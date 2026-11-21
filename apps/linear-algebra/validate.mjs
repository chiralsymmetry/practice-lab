// Extended validation for the linear-algebra app: a large generated sweep, adversarial checks of the
// non-unique answer kinds, and an independent recomputation of every sampled answer with SymPy.
import vm from "node:vm";

async function loadApp(localeCode) {
  const locale = (await import(`./locales/${localeCode}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text()).replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = { window: {}, document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.LinearAlgebraApp;
}
const en = await loadApp("en");
const sv = await loadApp("sv");
const o = en.oracles;
const failures = [];
const fail = (name, data) => { if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`); };
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const norm = (v, k) => o.laNormalize(v, k);
// Rationals travel to Python as "n/d" strings.
const ser = (x) => (Array.isArray(x) ? x.map(ser) : x && typeof x === "object" && "n" in x && "d" in x ? `${x.n}/${x.d}` : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, ser(v)])) : typeof x === "bigint" ? String(x) : x);
const parseVecText = (s) => s.replace(/[()]/g, "").split(",").map((x) => x.trim());

let generated = 0, adversarial = 0;
const pyCases = [];
for (let fi = 0; fi < en.families.length; fi += 1) {
  const family = en.families[fi];
  if (sv.families[fi]?.id !== family.id) fail("locale family parity", family.id);
  for (const level of family.levels) {
    const signatures = new Set();
    for (let sample = 0; sample < 4_000; sample += 1) {
      const s = ((fi + 1) * 10_000_000 + level * 100_000 + sample + 1) >>> 0, q = en.generateQuestion(family.id, level, s), m = q.metadata, where = [family.id, level, s];
      if (!en.checkQuestion(q.canonicalAnswer, q).correct) fail("canonical answer", where);
      if (en.checkQuestion({}, q).correct) fail("empty answer accepted", where);
      for (const f of q.fields) {
        const bad = { ...q.canonicalAnswer, [f.id]: f.kind === "integer" ? "1.5" : "nope" };
        if (en.checkQuestion(bad, q).correct) fail("malformed answer accepted", [...where, f.id]);
        if (f.options) { const v = f.options.map((x) => x.value), l = f.options.map((x) => x.label); if (new Set(v).size !== v.length || new Set(l).size !== l.length || v.filter((x) => x === f.answer).length !== 1) fail("choice uniqueness", where); }
        // Non-unique representations: directions accept any nonzero multiple, spans any basis.
        if (f.kind.startsWith("dir:")) {
          const ent = parseVecText(f.answer), scaled = `(${ent.map((x) => `-2*(${x})`).join(",")})`;
          const scaledText = "(" + ent.map((x) => { const t = o.parseSurd(x); return t; }).map((t) => o.scanon(t)).join(",") + ")";
          const neg = "(" + ent.map((x) => (x.startsWith("-") ? x.slice(1) : "-" + x)).join(", ") + ")";
          if (norm(neg, f.kind) !== norm(f.answer, f.kind)) fail("direction not accepted after scaling by −1", [...where, neg]);
          if (norm("(" + ent.map(() => "0").join(",") + ")", f.kind) !== null) fail("zero direction accepted", where);
          adversarial += 2; void scaled; void scaledText;
        }
        if (f.kind.startsWith("span:")) {
          const [, n, k] = f.kind.split(":").map(Number), vecs = f.answer.match(/\([^)]*\)/g).map(parseVecText);
          if (k >= 2) {
            const sum = vecs[0].map((_, j) => `${vecs[0][j]}+${vecs[1][j]}`.replace(/\+-/g, "-"));
            const alt = [`(${sum.map((x) => o.rstr(o.parseSurd(x)["1"] ?? o.R(0)).replace(/−/g, "-")).join(", ")})`, ...vecs.slice(1).map((v) => `(${v.join(", ")})`)].join(", ");
            if (norm(alt, f.kind) !== norm(f.answer, f.kind)) fail("alternative basis rejected", [...where, alt]);
            const dup = [vecs[0], vecs[0], ...vecs.slice(2)].map((v) => `(${v.join(", ")})`).join(", ");
            if (norm(dup, f.kind) !== null) fail("dependent list accepted as basis", [...where, dup]);
            adversarial += 2;
          }
          const short = vecs.slice(0, Math.max(0, k - 1)).map((v) => `(${v.join(", ")})`).join(", ");
          if (k >= 1 && norm(short || "()", f.kind) !== null) fail("basis with too few vectors accepted", where);
          const rev = vecs.slice().reverse().map((v) => `(${v.map((x) => `${x}`).join(", ")})`).join(", ");
          if (norm(rev, f.kind) !== norm(f.answer, f.kind)) fail("reordered basis rejected", where);
          adversarial += 2; void n;
        }
      }
      if (m.modelId !== "linear-algebra-v1") fail("model metadata", where);
      signatures.add(q.structuralSignature);
      if (sample < 50) { const t = sv.generateQuestion(family.id, level, s); if (!equal(q.canonicalAnswer, t.canonicalAnswer) || !sv.checkQuestion(t.canonicalAnswer, t).correct) fail("bilingual answer parity", where); }
      if (sample < 120) pyCases.push({ where, fam: family.id, meta: ser(Object.fromEntries(Object.entries(m).filter(([k]) => !["modelId", "oracleVersion"].includes(k)))), fields: q.fields.map((f) => ({ id: f.id, kind: f.kind, answer: f.answer, label: f.options ? f.options.find((x) => x.value === f.answer)?.label : undefined })) });
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}

// ---------- SymPy: recompute every sampled answer from the question's inputs ----------
let symChecks = 0, symNote = "";
const hasSympy = Bun.spawnSync(["/usr/bin/env", "python3", "-c", "import sympy"], { stdout: "pipe", stderr: "pipe" }).exitCode === 0;
if (hasSympy) {
  const script = String.raw`
import json, sys
from sympy import Rational as Q, Matrix, sqrt, nsimplify, acos, deg, simplify, zeros, eye
def q(x): n, d = x.split("/"); return Q(int(n), int(d))
def V(v): return Matrix([q(x) for x in v])
def M(A): return Matrix([[q(x) for x in row] for row in A])
def s(x): return str(nsimplify(x)).replace("**", "^")
def vs(v): return "(" + ", ".join(s(x) for x in v) + ")"
out = []
for c in json.load(sys.stdin):
    m, fam, res = c["meta"], c["fam"], {}
    try:
        if "vec" in m:
            g = m["vec"]
            if g["k"] == "inverse": res["answer"] = vs(V(g["w"]) - q(g["c"]) * V(g["v"]))
            else: res["answer"] = vs(q(g["a"]) * V(g["u"]) + q(g["b"]) * V(g["v"]))
        elif "comb" in m:
            g = m["comb"]; cols = Matrix.hstack(*[V(v) for v in g["v"]])
            if g["k"] == "forward": res["answer"] = vs(sum((q(c) * V(v) for c, v in zip(g["c"], g["v"])), zeros(len(g["v"][0]), 1)))
            if g["k"] in ("solve", "member"):
                try:
                    x, params = cols.gauss_jordan_solve(V(g["w"])); ok = True
                except ValueError:
                    ok = False
                if g["k"] == "member": res["member"] = "yes" if ok else "no"
                if ok: res["a"], res["b"] = s(x[0]), s(x[1])
        elif "dn" in m:
            g = m["dn"]
            if g["k"] == "dot": res["answer"] = s(V(g["u"]).dot(V(g["v"])))
            elif g["k"] == "norm": res["answer"] = s(sqrt(V(g["u"]).dot(V(g["u"]))))
            elif g["k"] == "dist": d = V(g["p"]) - V(g["q"]); res["answer"] = s(sqrt(d.dot(d)))
            else:
                u, v = V(g["u"]), V(g["v"]); cth = simplify(u.dot(v) / (sqrt(u.dot(u)) * sqrt(v.dot(v)))); res["cos"] = s(cth); res["deg"] = str(int(deg(acos(cth))))
        elif "orth" in m:
            g = m["orth"]
            if g["k"] == "test": res["answer"] = "yes" if V(g["u"]).dot(V(g["v"])) == 0 else "no"
            elif g["k"] == "solve":
                a, b = V(g["a"]), V(g["b"]); i = g["idx"]; rest = sum(a[j] * b[j] for j in range(len(a)) if j != i); res["answer"] = s(-rest / b[i])
            else:
                w = V(g["w"]); u = Matrix([w[1], -w[0]]) / sqrt(w.dot(w)); u = u if u[0] > 0 else -u; res["answer"] = vs(u)
        elif "proj" in m:
            u, v = V(m["proj"]["u"]), V(m["proj"]["v"]); p = (u.dot(v) / v.dot(v)) * v; r = u - p
            res["answer"] = vs(p); res["res"] = vs(r); res["dist"] = s(sqrt(r.dot(r)))
        elif "cross" in m:
            c3 = V(m["cross"]["u"]).cross(V(m["cross"]["v"]))
            res["answer"] = vs(c3) if c["fields"][0]["kind"].startswith("vec") else s(sqrt(c3.dot(c3)))
        elif "rowop" in m:
            g = m["rowop"]; A = M(g["A"])
            if g["k"] == "swap": res["answer"] = vs(A.row(1))
            elif g["k"] == "scale": res["answer"] = vs(q(g["c"]) * A.row(g["row"]))
            elif g["k"] == "replace": res["answer"] = vs(A.row(g["q"]) - q(g["m"]) * A.row(g["p"]))
            else: res["answer"] = s(A[g["q"], 0] / A[g["p"], 0])
        elif "ech" in m:
            g = m["ech"]; A = M(g["M"])
            if g["k"] == "piv": res["answer_label"] = ", ".join(str(p + 1) for p in A.rref()[1])
            elif g["k"] == "kind":
                R, piv = A.rref()
                def is_ref(X):
                    last = -1; zero = False
                    for i in range(X.rows):
                        nzc = [j for j in range(X.cols) if X[i, j] != 0]
                        if not nzc: zero = True; continue
                        if zero or nzc[0] <= last: return False
                        last = nzc[0]
                    return True
                res["answer"] = "rref" if A == R else "ref" if is_ref(A) else "neither"
            else:
                Aa, b = A[:, :-1], A[:, -1]; ra, rab = Aa.rank(), A.rank()
                res["answer"] = "none" if rab > ra else "one" if ra == Aa.cols else "many"
        elif "rref" in m:
            R, piv = M(m["rref"]["A"]).rref()
            for i in range(R.rows): res["r%d" % (i + 1)] = vs(R.row(i))
        elif "sys" in m:
            g = m["sys"]
            if g["k"] == "row": res["answer"] = vs(V(g["row"] + [g["rhs"]]))
            elif g["k"] == "unique": res["answer"] = vs(M(g["A"]).LUsolve(V(g["b"])))
            elif g["k"] == "param":
                A, b = M(g["A"]), V(g["b"]); x, params = A.gauss_jordan_solve(b); part = x.subs({p: 0 for p in params}); res["p"] = vs(part)
                res["dirs"] = ", ".join(vs(v) for v in A.nullspace())
        elif "cls" in m:
            g = m["cls"]
            if g["k"] == "rank": res["answer"] = "none" if g["rAb"] > g["rA"] else "one" if g["rA"] == g["n"] else "many"
            elif g["k"] == "param": res["answer"] = s(Q(g["b"] * g["c"], g["a"]))
            else:
                A = M(g["M"]); ra, rab = A[:, :-1].rank(), A.rank(); res["answer"] = "none" if rab > ra else "one" if ra == 3 else "many"
        elif "shape" in m:
            g = m["shape"]
            if g["k"] == "entry": A = M(g["A"]); res["rows"], res["cols"], res["entry"] = str(A.rows), str(A.cols), s(A[g["i"] - 1, g["j"] - 1])
            elif g["k"] == "rule":
                f = {"i − j": lambda i, j: i - j, "i + 2j": lambda i, j: i + 2 * j, "i·j": lambda i, j: i * j, "(−1)^(i+j)": lambda i, j: (-1) ** (i + j), "2i − j": lambda i, j: 2 * i - j}[g["rule"]]
                B = M(g["B"])
                for i in range(B.rows): res["r%d" % (i + 1)] = vs([f(i + 1, j + 1) for j in range(B.cols)])
            else: res["xin"], res["out"], res["answer_label"] = str(g["s"]), str(g["p"]), "%d × %d" % (g["p"], g["s"])
        elif "marith" in m:
            g = m["marith"]
            X = (M(g["B"]) + M(g["A"])) / q(g["c"]) if g["k"] == "solve" else q(g["a"]) * M(g["A"]) + q(g["b"]) * M(g["B"])
            for i in range(X.rows): res["r%d" % (i + 1)] = vs(X.row(i))
        elif "mv" in m:
            g = m["mv"]; A, x = M(g["A"]), V(g["x"])
            if g["k"] == "num": res["answer"] = vs(A * x)
            elif g["k"] == "solve":
                k = g["idx"]; rest = A * x - x[k] * A.col(k); i = [j for j in range(A.rows) if A[j, k] != 0][0]; res["answer"] = s(((A * x)[i] - rest[i]) / A[i, k])
        elif "prod" in m and m["prod"]["k"] != "shape":
            g = m["prod"]; P = M(g["A"]) * M(g["B"])
            for i in range(P.rows): res["r%d" % (i + 1)] = vs(P.row(i))
            if g["k"] == "square": res["comm"] = "yes" if P == M(g["B"]) * M(g["A"]) else "no"
        elif "tr" in m:
            g = m["tr"]
            if g["k"] == "t":
                T = M(g["A"]).T
                for i in range(T.rows): res["r%d" % (i + 1)] = vs(T.row(i))
            elif g["k"] == "kind": A = M(g["A"]); res["answer"] = "sym" if A == A.T else "skew" if A == -A.T else "neither"
            else: res["expr_label"], res["shp_label"] = "BᵀAᵀ", "%d × %d" % (g["s"], g["p"])
        elif "inv" in m:
            g = m["inv"]
            if g["k"] == "check": res["answer"] = "yes" if M(g["A"]) * M(g["B"]) == eye(2) and M(g["B"]) * M(g["A"]) == eye(2) else "no"
            elif g["k"] == "compute":
                I = M(g["A"]).inv()
                for i in range(I.rows): res["r%d" % (i + 1)] = vs(I.row(i))
            elif g["k"] == "param": res["answer"] = s(Q(g["b"] * g["c"], g["a"]))
            else: res["answer"] = vs(M(g["A"]).inv() * V(g["b"]))
        elif "lu" in m:
            g = m["lu"]; A = M(g["A"]); L, U, perm = A.LUdecomposition()
            assert not perm
            if g["k"] == "mult": res["answer"] = s(L[1, 0])
            elif g["k"] == "full":
                res["l21"], res["l31"], res["l32"] = s(L[1, 0]), s(L[2, 0]), s(L[2, 1])
                for i in range(U.rows): res["u%d" % (i + 1)] = vs(U.row(i))
            else:
                y = L.LUsolve(V(g["b"])); res["y"] = vs(y); res["x"] = vs(U.LUsolve(y))
        elif "tf" in m:
            g = m["tf"]; X = M(g["S"]) * M(g["M"]) if g["k"] == "compose" else M(g["M"])
            if g["k"] != "name":
                for i in range(X.rows): res["r%d" % (i + 1)] = vs(X.row(i))
    except Exception as e:
        res = {"__error__": repr(e)[:200]}
    out.append({k: v for k, v in res.items() if v is not None})
print(json.dumps(out))`;
  const run = Bun.spawnSync(["/usr/bin/env", "python3", "-I", "-c", script], { stdin: Buffer.from(JSON.stringify(pyCases)), stdout: "pipe", stderr: "pipe" });
  if (run.exitCode !== 0) fail("sympy run", run.stderr.toString().slice(-800));
  else {
    const results = JSON.parse(run.stdout.toString());
    results.forEach((res, i) => {
      const c = pyCases[i];
      if (res.__error__) { fail("sympy case error", [...c.where, res.__error__]); return; }
      for (const f of c.fields) {
        if (res[f.id + "_label"] !== undefined) { if (res[f.id + "_label"] !== f.label) fail("label vs SymPy", [...c.where, f.id, f.label, res[f.id + "_label"]]); symChecks += 1; continue; }
        if (res[f.id] === undefined) continue;
        const want = res[f.id].replace(/\^/g, "**"), got = /^(rat|vec|dir|span)/.test(f.kind) ? norm(want.replace(/\*\*/g, "^"), f.kind) : want;
        const mine = /^(rat|vec|dir|span)/.test(f.kind) ? norm(f.answer, f.kind) : f.answer;
        if (got === null || got !== mine) fail("answer vs SymPy", [...c.where, f.id, f.answer, res[f.id]]);
        symChecks += 1;
      }
    });
  }
} else symNote = " SymPy checks skipped: python3 with sympy not found.";

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Linear-algebra extended validation passed: ${symChecks.toLocaleString("en-US")} answers recomputed by SymPy, ${adversarial.toLocaleString("en-US")} adversarial equivalence checks (scaled directions, alternative and dependent bases), and ${generated.toLocaleString("en-US")} generated questions (4,000 per family and level), with bilingual seed parity.${symNote}`);
