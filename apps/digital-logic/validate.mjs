// Extended validation for the digital-logic app: a large generated sweep, independent JavaScript
// references, Icarus Verilog simulation of generated circuits, and Yosys SAT equivalence proofs.
import vm from "node:vm";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function loadApp(localeCode) {
  const locale = (await import(`./locales/${localeCode}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text()).replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = { window: {}, document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.DigitalLogicApp;
}
const en = await loadApp("en");
const sv = await loadApp("sv");
const failures = [];
const fail = (name, data) => { if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`); };
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const bits = (n, w) => (n >>> 0).toString(2).padStart(w, "0").slice(-w);
const signed = (n, w) => (n & (1 << (w - 1)) ? n - (1 << w) : n);
const correctLabel = (q, id) => { const f = q.fields.find((x) => x.id === id); return f.options.find((x) => x.value === f.answer).label; };

// ---------- Independent references ----------
// Gate truth functions from counting ones, not from the app's reducers.
const ones = (a) => a.filter((x) => x === 1).length;
const gateRef = { AND: (a) => +(ones(a) === a.length), OR: (a) => +(ones(a) > 0), XOR: (a) => ones(a) % 2, NAND: (a) => +(ones(a) !== a.length), NOR: (a) => +(ones(a) === 0), XNOR: (a) => 1 - (ones(a) % 2), NOT: (a) => 1 - a[0], BUF: (a) => a[0] };
let propertyCases = 0;
for (const [type, fn] of Object.entries(gateRef)) for (let n = type === "NOT" || type === "BUF" ? 1 : 2; n <= (type === "NOT" || type === "BUF" ? 1 : 4); n += 1) for (let row = 0; row < 1 << n; row += 1) {
  const ins = bits(row, n).split("").map(Number);
  if (en.oracles.GATE_FN[type](ins) !== fn(ins)) fail("gate function", [type, ins]);
  propertyCases += 1;
}
// Exact SOP minimality by brute force over all implicants (not only primes).
function bruteMin(n, onesList, dcs) {
  const N = 1 << n, zeros = []; for (let m = 0; m < N; m += 1) if (!onesList.includes(m) && !dcs.includes(m)) zeros.push(m);
  const imps = []; for (let mask = 0; mask < N; mask += 1) for (let val = 0; val < N; val += 1) { if (val & ~mask) continue; const cov = []; for (let m = 0; m < N; m += 1) if ((m & mask) === (val & mask)) cov.push(m); if (!cov.some((m) => zeros.includes(m))) imps.push({ lits: bitCount(mask), cov }); }
  let best = null;
  const rec = (start, chosen, size) => {
    if (chosen.length === size) { const covered = new Set(chosen.flatMap((i) => imps[i].cov)); if (onesList.every((m) => covered.has(m))) { const lits = chosen.reduce((a, i) => a + imps[i].lits, 0); if (!best || lits < best.lits) best = { terms: size, lits }; } return; }
    for (let i = start; i < imps.length; i += 1) { chosen.push(i); rec(i + 1, chosen, size); chosen.pop(); }
  };
  for (let size = 1; size <= 4 && !best; size += 1) rec(0, [], size);
  return best;
}
function bitCount(x) { let c = 0; while (x) { c += x & 1; x >>>= 1; } return c; }
const shiftRef = (kind, x, k, w) => { const m = 2 ** w - 1, s = bits(x, w); if (kind === "sll") return parseInt((s + "0".repeat(k)).slice(-w), 2); if (kind === "srl") return parseInt(("0".repeat(k) + s).slice(0, w), 2); if (kind === "sra") return parseInt((s[0].repeat(k) + s).slice(0, w), 2); if (kind === "rol") return parseInt(s.slice(k) + s.slice(0, k), 2); return parseInt(s.slice(w - k) + s.slice(0, w - k), 2) & m; };
// Text → Verilog expression (¬ ~, · &, ⊕ ^, + |); Verilog precedence ~ > & > ^ > | matches the display convention.
const toVerilog = (e) => e.replace(/¬/g, "~").replace(/·/g, " & ").replace(/⊕/g, "^").replace(/\+/g, "|");

// ---------- Sweep ----------
let generated = 0, referenceChecks = 0;
const ivCases = [], ysCases = [], kmapCases = [];
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
        const bad = { ...q.canonicalAnswer, [f.id]: f.kind === "integer" ? "1.5" : f.kind === "hex" ? "0xZZ" : f.kind === "bits" ? "2" : "nope" };
        if (en.checkQuestion(bad, q).correct) fail("malformed answer accepted", [...where, f.id]);
        if (f.kind === "bits" && en.checkQuestion({ ...q.canonicalAnswer, [f.id]: "0" + f.answer }, q).correct) fail("bit width not preserved", [...where, f.id]);
        if (f.options) { const v = f.options.map((x) => x.value), l = f.options.map((x) => x.label); if (new Set(v).size !== v.length || new Set(l).size !== l.length || v.filter((x) => x === f.answer).length !== 1) fail("choice uniqueness", where); }
      }
      if (m.modelId !== "digital-logic-v1") fail("model metadata", where);
      signatures.add(q.structuralSignature);
      if (sample < 50) { const t = sv.generateQuestion(family.id, level, s); if (!equal(q.canonicalAnswer, t.canonicalAnswer) || !sv.checkQuestion(t.canonicalAnswer, t).correct) fail("bilingual answer parity", where); }
      const few = sample < 150;
      // JavaScript references.
      if (m.dec) { const out = Array.from({ length: 1 << m.dec.k }, (_, i) => { const idx = (1 << m.dec.k) - 1 - i, hit = (m.dec.en ?? true) && idx === m.dec.code; return m.dec.low ? (hit ? "0" : "1") : (hit ? "1" : "0"); }).join(""); if (out !== m.dec.out) fail("decoder reference", where); referenceChecks += 1; }
      if (m.enc) { const set = m.enc.ins.map((x, i) => (x ? i : -1)).filter((i) => i >= 0), valid = m.enc.ordinary ? set.length === 1 : set.length > 0, code = !valid ? 0 : m.enc.lowPri ? Math.min(...set) : Math.max(...set); if (valid !== m.enc.valid || code !== m.enc.code) fail("encoder reference", where); referenceChecks += 1; }
      if (m.cmp) { const c = (x, y) => (x < y ? "lt" : x > y ? "gt" : "eq"); if (c(m.cmp.a, m.cmp.b) !== m.cmp.u || (m.cmp.s && c(signed(m.cmp.a, m.cmp.w), signed(m.cmp.b, m.cmp.w)) !== m.cmp.s)) fail("comparator reference", where); referenceChecks += 1; }
      if (m.par) { const total = bitCount(m.par.v) + m.par.p; if ((total % 2 === 1) !== m.par.odd) fail("parity generator reference", where); if (m.par.recv !== undefined && ((bitCount(m.par.recv) + m.par.p) % 2 === 1) === m.par.odd === m.par.err) fail("parity checker reference", where); referenceChecks += 1; }
      if (m.mux && m.mux.data) { const y = m.mux.en === 1 ? 0 : m.mux.data[m.mux.sel]; if (y !== m.mux.y) fail("mux reference", where); referenceChecks += 1; }
      if (m.mux && m.mux.tree) { const sel = m.mux.s, y = sel >= 4 ? m.mux.d8[sel] : m.mux.en === 1 ? 0 : m.mux.d8[sel]; if (y !== m.mux.y) fail("mux tree reference", where); referenceChecks += 1; }
      if (m.al && m.al.act) { const act = m.al.cs === 1 ? "idle" : m.al.we === 0 ? "write" : m.al.oe === 0 ? "read" : "idle"; if (act !== m.al.act) fail("memory control reference", where); referenceChecks += 1; }
      if (m.adder && m.adder.k === "recover") { const fits = [0, 1].filter((a) => { const t = a + m.adder.b + m.adder.cin; return (m.adder.useS ? t % 2 : t >> 1) === m.adder.given; }); const k = fits.length === 2 ? "amb" : fits.length === 0 ? "none" : "u" + fits[0]; if (k !== m.adder.res) fail("full-adder recovery reference", where); referenceChecks += 1; }
      if (m.adder && m.adder.k === "recover2") { const sols = []; for (let b = 0; b < 2; b += 1) for (let c = 0; c < 2; c += 1) { const t = m.adder.a + b + c; if (t % 2 === m.adder.s && t >> 1 === m.adder.cout) sols.push([b, c]); } const k = sols.length === 0 ? "none" : sols.length === 2 ? "amb" : sols[0][0] ? "two" : "zero"; if (k !== m.adder.res) fail("full-adder two-input recovery reference", where); referenceChecks += 1; }
      if (m.cla && m.cla.carries) { const w = m.cla.w, ref = [m.cla.c0]; for (let i = 1; i <= w; i += 1) { const mk = (1 << i) - 1; ref.push(((m.cla.A & mk) + (m.cla.B & mk) + m.cla.c0) >> i); } if (ref.join("") !== m.cla.carries) fail("lookahead carries vs arithmetic", where); referenceChecks += 1; }
      if (m.shift) { if (shiftRef(m.shift.kind, m.shift.x, m.shift.k, m.shift.w) !== m.shift.res || (m.shift.rot !== undefined && shiftRef("ror", m.shift.x, m.shift.k, m.shift.w) !== m.shift.rot)) fail("shifter reference", where); if (m.shift.ctl && parseInt(m.shift.ctl, 2) !== m.shift.k) fail("shifter control reference", where); referenceChecks += 1; }
      if (m.kmap && kmapCases.length < 300 && sample % 7 === 0) kmapCases.push({ where, ...m.kmap });
      // Icarus Verilog cases.
      if (few && m.gate) ivCases.push({ where, kind: "gate", ...m.gate });
      if (few && m.net) ivCases.push({ where, kind: "net", ...m.net });
      if (few && m.bus) ivCases.push({ where, kind: "bus", ...m.bus });
      if (few && m.rep) ivCases.push({ where, kind: "expr", vars: m.rep.vars, expr: m.rep.expr, col: m.rep.col });
      if (few && m.canon && (m.canon.form === "sop" || m.canon.form === "pos")) { const lab = correctLabel(q, "answer"), want = Array.from({ length: 1 << m.canon.vars.length }, (_, i) => (m.canon.ones.includes(i) ? "1" : "0")).join(""); ivCases.push({ where, kind: "expr", vars: m.canon.vars, expr: lab.replace(/^\((.*)\)$/s, "($1)"), col: want }); }
      if (few && m.ripple) ivCases.push({ where, kind: "ripple", ...m.ripple });
      if (few && m.flags) ivCases.push({ where, kind: "flags", ...m.flags });
      if (few && m.alu && m.alu.k === "table") ivCases.push({ where, kind: "alu", ...m.alu });
      if (few && m.shift) ivCases.push({ where, kind: "shift", op: m.shift.kind, x: m.shift.x, k: m.shift.k, w: m.shift.w, res: m.shift.res });
      if (few && m.adder && m.adder.k === "full") ivCases.push({ where, kind: "fa", ...m.adder });
      // Yosys equivalence cases.
      if (sample < 12 && m.uni) ysCases.push({ where, kind: "uni", ...m.uni });
      if (sample < 12 && m.muxImpl) ysCases.push({ where, kind: "muxImpl", ...m.muxImpl });
      if (sample < 12 && m.kmap) ysCases.push({ where, kind: "kmap", ...m.kmap });
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}
// Brute-force minimality.
for (const c of kmapCases) { const b = bruteMin(c.vars.length, c.ones, c.dcs); if (!b || b.terms !== c.terms || b.lits !== c.lits) fail("K-map minimality vs brute force", [...c.where, b, c.terms, c.lits]); referenceChecks += 1; }

// ---------- Icarus Verilog ----------
const hasTool = (t) => Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "sh", "-c", `command -v ${t}`], { stdout: "pipe" }).exitCode === 0;
let ivChecks = 0, ysChecks = 0, toolNote = "";
const dir = mkdtempSync(join(tmpdir(), "dl-validate-"));
try {
  if (hasTool("iverilog") && hasTool("vvp")) {
    const lines = ["module tb;"], disp = [];
    const lit = (v) => (v === "X" ? "1'bx" : v === "Z" ? "1'bz" : `1'b${v}`);
    ivCases.forEach((c, i) => {
      const p = `c${i}_`;
      if (c.kind === "gate") {
        const ins = c.pins.map((pin, j) => { lines.push(`  wire ${p}i${j} = ${lit(pin.val)};`); return pin.inv ? `~${p}i${j}` : `${p}i${j}`; });
        const prim = c.type.toLowerCase();
        lines.push(`  wire ${p}g; ${prim === "not" ? `not (${p}g, ${ins[0]});` : `${prim} (${p}g, ${ins.join(", ")});`}`, `  wire ${p}y = ${c.outInv ? "~" : ""}${p}g;`);
        disp.push(`$display("${i} %b", ${p}y);`);
      } else if (c.kind === "net") {
        c.inputs.forEach((v) => lines.push(`  wire ${p}${v} = 1'b${c.env[v]};`));
        c.gates.forEach((g) => { const prim = g.type.toLowerCase(), ins = g.ins.map((x) => (x.inv ? "~" : "") + p + x.src); lines.push(`  wire ${p}${g.name}; ${prim} (${p}${g.name}, ${ins.join(", ")});`); });
        disp.push(`$display("${i} %b", {${c.gates.map((g) => p + g.name).join(", ")}});`);
      } else if (c.kind === "bus") {
        for (let b = 0; b < c.w; b += 1) {
          lines.push(`  wire ${p}b${b};`);
          c.drivers.forEach((d, j) => { const en = c.w > 1 ? d.enBits[b] : d.en; lines.push(`  bufif1 (${p}b${b}, 1'b${d.data[b]}, 1'b${en});`); });
        }
        disp.push(`$display("${i} %b", {${Array.from({ length: c.w }, (_, b) => p + "b" + b).join(", ")}});`);
      } else if (c.kind === "expr") {
        const n = c.vars.length;
        lines.push(`  reg [${n - 1}:0] ${p}r; reg [${(1 << n) - 1}:0] ${p}col; integer ${p}k;`);
        const wires = c.vars.map((v, j) => `wire ${p}${v} = ${p}r[${n - 1 - j}];`).join(" ");
        lines.push(`  ${wires}`, `  wire ${p}f = ${toVerilog(c.expr).replace(/\b([A-D])\b/g, `${p}$1`)};`);
        disp.push(`for (${p}k = 0; ${p}k < ${1 << n}; ${p}k = ${p}k + 1) begin ${p}r = ${p}k; #1 ${p}col[${(1 << n) - 1} - ${p}k] = ${p}f; end $display("${i} %b", ${p}col);`);
      } else if (c.kind === "ripple") {
        lines.push(`  wire [${c.w}:0] ${p}sum = ${c.w}'d${c.a} + ${c.w}'d${c.b} + ${c.cin};`);
        disp.push(`$display("${i} %b", ${p}sum[${c.w - 1}:0]);`);
      } else if (c.kind === "flags") {
        const w = c.w;
        lines.push(`  wire [${w - 1}:0] ${p}a = ${w}'d${c.a}, ${p}b = ${w}'d${c.b}, ${p}bx = ${p}b ^ {${w}{1'b${c.sub}}};`, `  wire [${w}:0] ${p}t = {1'b0, ${p}a} + {1'b0, ${p}bx} + ${c.sub};`, `  wire ${p}v = (${p}a[${w - 1}] == ${p}bx[${w - 1}]) && (${p}t[${w - 1}] != ${p}a[${w - 1}]);`);
        disp.push(`$display("${i} %b %b %b", ${p}t[${w - 1}:0], ${p}t[${w}], ${p}v);`);
      } else if (c.kind === "alu") {
        const w = c.w, A = `${w}'d${c.a}`, B = `${w}'d${c.b}`;
        const ex = { AND: `${A} & ${B}`, OR: `${A} | ${B}`, ADD: `${A} + ${B}`, XOR: `${A} ^ ${B}`, NOR: `~(${A} | ${B})`, "PASS A": A, SUB: `${A} - ${B}`, SLT: `($signed(${A}) < $signed(${B})) ? ${w}'d1 : ${w}'d0` }[c.op];
        lines.push(`  wire [${w - 1}:0] ${p}y = ${ex};`);
        disp.push(`$display("${i} %b", ${p}y);`);
      } else if (c.kind === "shift") {
        const w = c.w, X = `${w}'d${c.x}`, k = c.k;
        lines.push(`  wire [${w - 1}:0] ${p}y = ${{ sll: `${X} << ${k}`, srl: `${X} >> ${k}`, sra: `$signed(${X}) >>> ${k}`, rol: `(${X} << ${k}) | (${X} >> ${w - k})`, ror: `(${X} >> ${k}) | (${X} << ${w - k})` }[c.op]};`);
        disp.push(`$display("${i} %b", ${p}y);`);
      } else if (c.kind === "fa") {
        lines.push(`  wire [1:0] ${p}t = ${c.a} + ${c.b} + ${c.cin};`);
        disp.push(`$display("${i} %b", ${p}t);`);
      }
    });
    lines.push("  initial begin", "    #1;", ...disp.map((d) => "    " + d), "  end", "endmodule");
    const src = lines.join("\n");
    writeFileSync(join(dir, "tb.v"), src);
    const comp = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "iverilog", "-o", join(dir, "tb.vvp"), join(dir, "tb.v")], { stdout: "pipe", stderr: "pipe" });
    if (comp.exitCode !== 0) fail("iverilog compile", comp.stderr.toString().slice(0, 600));
    else {
      const run = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "vvp", "-n", join(dir, "tb.vvp")], { stdout: "pipe", stderr: "pipe" });
      const out = {}; run.stdout.toString().split("\n").forEach((l) => { const mm = /^(\d+) (.*)$/.exec(l.trim()); if (mm) out[mm[1]] = mm[2].split(" "); });
      ivCases.forEach((c, i) => {
        const got = out[i];
        if (!got) { fail("iverilog missing output", c.where); return; }
        let ok;
        if (c.kind === "gate") ok = got[0].toUpperCase() === String(c.y);
        else if (c.kind === "net") ok = got[0] === c.gates.map((g) => c.val[g.name]).join("");
        else if (c.kind === "bus") ok = got[0].toUpperCase() === c.bus;
        else if (c.kind === "expr") ok = got[0] === c.col;
        else if (c.kind === "ripple") ok = got[0] === bits(c.s, c.w);
        else if (c.kind === "flags") ok = got[0] === bits(c.o.res, c.w) && Number(got[1]) === c.o.c && Number(got[2]) === c.o.v;
        else if (c.kind === "alu") ok = got[0] === bits(c.res, c.w);
        else if (c.kind === "shift") ok = got[0] === bits(c.res, c.w);
        else if (c.kind === "fa") ok = got[0] === `${c.cout}${c.s}`;
        if (!ok) fail(`iverilog ${c.kind} vs answer`, [...c.where, got]);
        ivChecks += 1;
      });
    }
  } else toolNote += " Icarus Verilog checks skipped: iverilog not found.";

  // ---------- Yosys SAT equivalence ----------
  if (hasTool("yosys")) {
    const mods = [], props = [];
    const netToV = (net, p) => net.split("; ").map((line) => { const mm = /^(\w+) = (NAND|NOR)\(([^)]*)\)$/.exec(line); if (!mm) return null; return `  wire ${p}${mm[1]} = ~(${mm[3].split(", ").map((x) => (/^[01]$/.test(x) ? `1'b${x}` : p + x)).join(mm[2] === "NAND" ? " & " : " | ")});`; });
    ysCases.forEach((c, i) => {
      const p = `c${i}_`, body = [];
      if (c.kind === "uni") {
        const vars = c.vars;
        body.push(`module m${i}(input ${vars.join(", input ")}, output eq_good, output eq_bad0, output eq_bad1, output eq_bad2, output only);`);
        const target = toVerilog(c.target);
        const good = netToV(c.good, p + "g");
        if (good.includes(null)) { fail("universal circuit parse", c.where); return; }
        const re = (s, pre) => s.replace(new RegExp(`\\b(${vars.join("|")})\\b`, "g"), (x) => x).replace(new RegExp(`${pre}(${vars.join("|")})\\b`, "g"), "$1");
        body.push(...good.map((l) => re(l, p + "g")));
        body.push(`  assign eq_good = (${p}gY == (${target}));`);
        c.bad.forEach((b, j) => { const lines = netToV(b, `${p}b${j}`); if (lines.includes(null)) { body.push(`  assign eq_bad${j} = 1'b0;`); return; } body.push(...lines.map((l) => re(l, `${p}b${j}`)), `  assign eq_bad${j} = (${p}b${j}Y == (${target}));`); });
        for (let j = c.bad.length; j < 3; j += 1) body.push(`  assign eq_bad${j} = 1'b0;`);
        const onlyFam = c.good.split("; ").every((l) => l.includes(`= ${c.fam}(`));
        body.push(`  assign only = 1'b${onlyFam ? 1 : 0};`, "endmodule");
        props.push({ i, c, checks: [["eq_good", true], ["only", true], ...c.bad.map((_, j) => [`eq_bad${j}`, false])] });
      } else if (c.kind === "muxImpl") {
        const vars = c.vars, data = Object.keys(c.ans).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))).map((k) => (c.ans[k] === "0" ? "1'b0" : c.ans[k] === "1" ? "1'b1" : c.ans[k].replace("¬", "~")));
        body.push(`module m${i}(input ${vars.join(", input ")}, output eq);`, `  wire [${c.sels.length - 1}:0] ${p}s = {${c.sels.join(", ")}};`, `  wire [${data.length - 1}:0] ${p}d = {${data.slice().reverse().join(", ")}};`, `  assign eq = (${p}d[${p}s] == (${toVerilog(c.expr)}));`, "endmodule");
        props.push({ i, c, checks: [["eq", true]] });
      } else if (c.kind === "kmap") {
        const n = c.vars.length, onesBits = Array.from({ length: 1 << n }, (_, r) => (c.ones.includes(r) ? 1 : 0)), dcBits = Array.from({ length: 1 << n }, (_, r) => (c.dcs.includes(r) ? 1 : 0));
        const rev = (a) => a.slice().reverse().join("");
        body.push(`module m${i}(input ${c.vars.join(", input ")}, output eq);`, `  wire [${n - 1}:0] ${p}idx = {${c.vars.join(", ")}};`, `  wire [${(1 << n) - 1}:0] ${p}on = ${1 << n}'b${rev(onesBits)}, ${p}dc = ${1 << n}'b${rev(dcBits)};`, `  assign eq = ${p}dc[${p}idx] | (${p}on[${p}idx] == (${c.expr === "0" ? "1'b0" : c.expr === "1" ? "1'b1" : toVerilog(c.expr)}));`, "endmodule");
        props.push({ i, c, checks: [["eq", true]] });
      }
      mods.push(body.join("\n"));
    });
    writeFileSync(join(dir, "eq.v"), mods.join("\n"));
    // One yosys run checks every property; each result is read between log markers.
    const cmds = [`read_verilog ${join(dir, "eq.v")}`, "proc"], order = [];
    props.forEach(({ i, c, checks }) => checks.forEach(([sig, want]) => { order.push({ c, sig, want }); cmds.push(`log MARK ${order.length - 1}`, `sat -prove ${sig} 1 m${i}`); }));
    const ys = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "HOME=" + dir, "yosys", "-p", cmds.join("; ")], { stdout: "pipe", stderr: "pipe" });
    const text = ys.stdout.toString();
    if (ys.exitCode !== 0) fail("yosys run", (ys.stderr.toString() || text).slice(-600));
    else {
      const parts = text.split(/\nMARK (\d+)\n/);
      const result = {}; for (let k = 1; k < parts.length; k += 2) result[parts[k]] = /SAT proof finished - no model found: SUCCESS!/.test(parts[k + 1]) ? true : /model found: FAIL!/.test(parts[k + 1]) ? false : null;
      order.forEach(({ c, sig, want }, k) => { if (result[k] !== want) fail(`yosys ${c.kind} ${sig}`, [...c.where, result[k]]); ysChecks += 1; });
    }
  } else toolNote += " Yosys checks skipped: yosys not found.";
} finally { rmSync(dir, { recursive: true, force: true }); }

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Digital-logic extended validation passed: ${propertyCases.toLocaleString("en-US")} gate property cases, ${referenceChecks.toLocaleString("en-US")} independent reference checks (including brute-force K-map minimality), ${ivChecks.toLocaleString("en-US")} circuits simulated by Icarus Verilog, ${ysChecks.toLocaleString("en-US")} Yosys SAT proofs, and ${generated.toLocaleString("en-US")} generated questions (4,000 per family and supported level), with bilingual seed parity.${toolNote}`);
