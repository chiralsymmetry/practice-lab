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

// Text expression evaluator for next-state equations (Q1, Q0, x; ¬ · + only).
function evalText(e, env) { const js = e.replace(/¬/g, "!").replace(/·/g, "&&").replace(/\+/g, "||").replace(/\b(Q1|Q0|x)\b/g, (v) => `env.${v}`); return Function("env", `return (${js}) ? 1 : 0;`)(env); }
function timingRef(t) {
  if (t.k === "period") return t.t === t.cq + t.comb + t.su;
  if (t.k === "fmax") return t.cq + t.comb + t.su === t.T && Number.isInteger(1e6 / t.T);
  if (t.k === "hold") return t.slack === t.cqMin + t.cmin - t.hold;
  if (t.k === "skew") return t.period === t.cqMax + t.cmax + t.su - t.skew && t.slack === t.cqMin + t.cmin - t.hold - t.skew;
  return t.slack === t.cqMin + t.cmin - t.hold - t.skew && t.slack < 0;
}
// Enumerate every input-to-Y path and sum delays (no dynamic programming).
function critRef(c) {
  const gates = Object.fromEntries(c.net.gates.map((g) => [g.name, g])), paths = [];
  const walk = (node, acc) => { const g = gates[node]; if (!g) { paths.push([node, ...acc]); return; } for (const p of g.ins) walk(p.src, [node, ...acc]); };
  walk("Y", []);
  const cost = (pp) => (c.arr[pp[0]] || 0) + pp.slice(1).reduce((a, n) => a + c.delays[gates[n].type], 0);
  const costs = paths.map(cost), max = Math.max(...costs), min = Math.min(...costs);
  return { max, min, paths: paths.filter((pp, i) => costs[i] === max) };
}
function seqRef(q) {
  const x = q.xs ? q.xs.join("") : "", p = q.p;
  const scan = (overlap) => { const out = Array(x.length).fill(0); let i = 0; while (i + p.length <= x.length) { if (x.slice(i, i + p.length) === p) { out[i + p.length - 1] = 1; i += overlap ? 1 : p.length; } else i += 1; } return out; };
  if (q.k === "count") return scan(true).join("") === q.o1.join("") && scan(false).join("") === q.o2.join("");
  if (q.k === "mealy") return scan(q.overlap).join("") === q.out;
  if (q.k === "moore") { const o = scan(q.overlap); return [0, ...o.slice(0, -1)].join("") === q.out; }
  // Failure transition: longest suffix of prefix(k)+b that is a prefix of p, checked by brute force.
  const s2 = p.slice(0, q.state) + q.b; for (let len = s2.length; len >= 0; len -= 1) if (p.startsWith(s2.slice(s2.length - len))) return len === q.next; return false;
}
function sencRef(e) {
  if (e.k === "bits") return 2 ** e.b >= e.n && 2 ** (e.b - 1) < e.n;
  if (e.k === "onehot") return e.code.length === e.n && e.code.split("").filter((c) => c === "1").length === 1 && e.code[e.n - 1 - e.s] === "1";
  if (e.k === "gray") { const g = parseInt(e.code, 2); return (g ^ (g >> 1) ^ (g >> 2) ^ (g >> 3)) === e.s; }
  return true;
}
function tdBitsRef(f) { let d1 = "", d0 = ""; for (let row = 0; row < 8; row += 1) { const st = row >> 1, x = row & 1; if (st >= f.n) { d1 += "X"; d0 += "X"; continue; } const nx = f.next[st][x]; d1 += (nx >> 1) & 1; d0 += nx & 1; } return [d1, d0]; }
// Independent PL16 model: decoding from the instruction word, a separately written control table, and architectural semantics.
const MC_CYCLES = { ADD: 4, SUB: 4, AND: 4, OR: 4, XOR: 4, ADDI: 4, LD: 5, ST: 4, BEQ: 3, BNE: 3, J: 3 };
function ctlRef(op) {
  const r = ["ADD", "SUB", "AND", "OR", "XOR"].includes(op);
  return { RegWrite: +(r || op === "ADDI" || op === "LD"), RegDst: +r, ALUSrc: +(["ADDI", "LD", "ST"].includes(op)), MemRead: +(op === "LD"), MemWrite: +(op === "ST"), ResultSrc: +(op === "LD"), Branch: +(op === "BEQ" || op === "BNE"), Jump: +(op === "J"), ALUOp: r ? "funct" : op === "BEQ" || op === "BNE" ? "sub" : "add" };
}
function dpRef(st, ins, c) {
  const regs = st.regs.slice(), mem = { ...st.mem }, a = regs[ins.rs ?? 0] ?? 0, b0 = regs[ins.rt ?? 0] ?? 0, imm = ((ins.imm ?? 0) + 65536) % 65536, b = c.ALUSrc ? imm : b0;
  const fn = c.ALUOp === "funct" ? ins.op : c.ALUOp === "sub" ? "SUB" : "ADD";
  const alu = fn === "ADD" ? (a + b) % 65536 : fn === "SUB" ? (a - b + 65536) % 65536 : fn === "AND" ? a & b : fn === "OR" ? a | b : a ^ b;
  const res = c.ResultSrc ? (c.MemRead ? mem[alu & 0xfffe] ?? 0 : 0) : alu, dest = c.RegDst ? ins.rd : ins.rt;
  if (c.MemWrite) mem[alu & 0xfffe] = b0;
  if (c.RegWrite && dest) regs[dest] = res;
  const taken = c.Branch && (ins.op === "BNE" ? alu !== 0 : alu === 0);
  return { regs, mem, pc: c.Jump ? ins.addr : taken ? (st.pc + 2 + 2 * ins.imm + 65536) % 65536 : (st.pc + 2) % 65536 };
}
function archRef(st, ins) {
  const R = st.regs.slice(), M = { ...st.mem }, v = (i) => R[i] ?? 0, w = (i, x) => { if (i) R[i] = ((x % 65536) + 65536) % 65536; };
  const ea = () => ((v(ins.rs) + ins.imm) % 65536 + 65536) % 65536 & 0xfffe;
  let pc = (st.pc + 2) % 65536;
  switch (ins.op) {
    case "ADD": w(ins.rd, v(ins.rs) + v(ins.rt)); break; case "SUB": w(ins.rd, v(ins.rs) - v(ins.rt)); break;
    case "AND": w(ins.rd, v(ins.rs) & v(ins.rt)); break; case "OR": w(ins.rd, v(ins.rs) | v(ins.rt)); break; case "XOR": w(ins.rd, v(ins.rs) ^ v(ins.rt)); break;
    case "ADDI": w(ins.rt, v(ins.rs) + ins.imm); break; case "LD": w(ins.rt, M[ea()] ?? 0); break; case "ST": M[ea()] = v(ins.rt); break;
    case "BEQ": if (v(ins.rs) === v(ins.rt)) pc = (pc + 2 * ins.imm + 65536) % 65536; break; case "BNE": if (v(ins.rs) !== v(ins.rt)) pc = (pc + 2 * ins.imm + 65536) % 65536; break;
    case "J": pc = ins.addr; break;
  }
  return { regs: R, mem: M, pc };
}
function decodeRef(wd) {
  const op = wd >>> 12, f = (k, n) => (wd >>> k) & ((1 << n) - 1), sx = (x) => (x & 32 ? x - 64 : x);
  if (op === 0) return { op: ["ADD", "SUB", "AND", "OR", "XOR"][f(0, 3)], rs: f(9, 3), rt: f(6, 3), rd: f(3, 3) };
  if (op === 6) return { op: "J", addr: f(0, 12) * 2 };
  return { op: { 1: "ADDI", 2: "LD", 3: "ST", 4: "BEQ", 5: "BNE" }[op], rs: f(9, 3), rt: f(6, 3), imm: sx(f(0, 6)) };
}
function cpuRef(c) {
  if (c.w !== undefined) { const d = decodeRef(c.w), want = { ...c.ins }; delete want.fmt; if (c.k === "field") return ((c.w >>> c.field[2]) & ((1 << (c.field[1] - c.field[2] + 1)) - 1)) === c.v; return Object.keys(d).every((k) => d[k] === want[k]); }
  const a = archRef(c.st, c.ins), regsOk = equal(a.regs, c.out.regs), memOk = Object.keys({ ...a.mem, ...c.out.mem }).every((k) => (a.mem[k] ?? 0) === (c.out.mem[k] ?? 0));
  return regsOk && memOk && a.pc === c.out.pc && equal(dpRef(c.st, c.ins, ctlRef(c.ins.op)).regs, a.regs);
}

// ---------- References for pipelines, caches, virtual memory, and performance ----------
function pipeRef(p) { const k = p.stages.length, extra = p.slow >= 0 ? p.m - 1 : 0, fin = Array.from({ length: p.n }, (_, i) => i + k + (p.slow >= 0 && i >= p.slow ? extra : 0)); if (!equal(fin, p.finish)) return false; if (p.st !== undefined && p.slow < 0) { const idx = p.c - p.j; const st = idx < 0 ? "not started" : idx >= k ? "done" : p.stages[idx]; return st === p.st; } return true; }
const dRef = (x) => (["ST", "BEQ", "BNE", "J"].includes(x.op) ? 0 : ["ADDI", "LD"].includes(x.op) ? x.rt : x.rd) || 0;
const uRef = (x) => (x.op === "J" ? [] : ["ADDI", "LD"].includes(x.op) ? [x.rs] : [x.rs, x.rt]);
function depRef(a, b) { const da = dRef(a), db = dRef(b); return { raw: !!da && uRef(b).includes(da), war: !!db && uRef(a).includes(db), waw: !!da && da === db }; }
function stallRef(st) {
  const prog = st.prog;
  if (st.k === "struct") { // fetch cycles skip any cycle in which an earlier load/store occupies MEM (fetch + 3).
    const fetch = []; const memBusy = new Set();
    prog.forEach((x, i) => { let c = i === 0 ? 1 : fetch[i - 1] + 1; while (memBusy.has(c)) c += 1; fetch.push(c); if (x.op === "LD" || x.op === "ST") memBusy.add(c + 3); });
    return fetch[fetch.length - 1] + 4;
  }
  const id = [];
  prog.forEach((x, i) => { let t = i === 0 ? 2 : id[i - 1] + 1; for (const reg of uRef(x)) { if (!reg) continue; let j = i - 1; while (j >= 0 && dRef(prog[j]) !== reg) j -= 1; if (j < 0) continue; const ready = st.mode === "none" ? id[j] + 3 : prog[j].op === "LD" ? id[j] + 2 : id[j] + 1; t = Math.max(t, ready); } id.push(t); });
  return id[id.length - 1] + 3;
}
function cacheRef(c) { const sets = new Map(), out = []; let time = 0; for (const a of c.addrs) { time += 1; const blk = Math.floor(a / c.blk), set = blk % c.sets, tag = Math.floor(blk / c.sets); if (!sets.has(set)) sets.set(set, new Map()); const lines = sets.get(set); if (lines.has(tag)) { out.push(true); lines.set(tag, time); } else { out.push(false); if (lines.size === c.ways) { let old = null; for (const [t, u] of lines) if (old === null || u < lines.get(old)) old = t; lines.delete(old); } lines.set(tag, time); } } return out; }
function replRef(seq, ways, policy) { const use = new Map(), ins = new Map(); let time = 0, victim = null; for (const b of seq) { time += 1; if (use.has(b)) { if (policy === "lru") use.set(b, time); continue; } if (use.size === ways) { const by = policy === "lru" ? use : ins; let v = null; for (const [k, t] of by) if (v === null || t < by.get(v)) v = k; victim = v; use.delete(v); ins.delete(v); } use.set(b, time); ins.set(b, time); } const by = policy === "lru" ? use : ins; return { victim, order: [...by.keys()].sort((a, b) => by.get(a) - by.get(b)).join(", ") }; }
function writeSeqRef(w) { const line = [null, null]; let wr = 0, rd = 0; for (const op of w.ops) { const s = op.b % 2, L = line[s], hit = !!L && L.b === op.b; if (op.w) { if (hit) { if (w.wb) L.d = true; else wr += 1; } else if (w.alloc) { if (L && L.d) wr += 1; rd += 1; line[s] = { b: op.b, d: w.wb }; if (!w.wb) wr += 1; } else wr += 1; } else if (!hit) { if (L && L.d) wr += 1; rd += 1; line[s] = { b: op.b, d: false }; } } return { w: wr, r: rd }; }
function tlbRef(t) { const ent = []; return t.vpns.map((v, i) => { const key = `${t.asids ? t.asids[i] : 0}/${v}`, k = ent.findIndex((e) => e.key === key); if (k >= 0) { if (t.policy === "lru") { const [e] = ent.splice(k, 1); ent.push(e); } return true; } if (ent.length === t.size) ent.shift(); ent.push({ key }); return false; }); }
function ioRef(io) {
  if (io.k === "poll") { let c = 0, t = 0; while (true) { c += 1; if (t >= io.ready) break; t += io.p; } return c === io.checks && t === io.seen; }
  if (io.k === "cost") { let c = 0, t = 0; while (true) { c += 1; if (t >= io.ready) break; t += io.p; } return c === io.polls && c * io.cost === io.v; }
  if (io.k === "int") return io.v === io.ready + io.lat + io.hand;
  if (io.k === "dma") return io.pio === io.N * io.w && io.dma === io.setup + io.irq;
  return Object.keys(io.costs).every((k) => io.costs[k] >= io.costs[io.best]);
}
function mmioRef(x) {
  const map = [["RAM", 0, 0x7fff], ["ROM", 0x8000, 0xbfff], ["UART", 0xc000, 0xc00f], ["TIMER", 0xc010, 0xc01f], ["GPIO", 0xc020, 0xc02f]];
  if (x.k === "dev") { const d = map.find((m) => x.a >= m[1] && x.a <= m[2]); return (d ? d[0] : null) === x.ans; }
  if (x.k === "reg") return ["DATA", "STATUS", "CTRL", "BAUD"][(x.addr - 0xc000) >> 1] === x.reg;
  if (x.k === "clear") return x.r1 === x.st && x.r2 === x.ev;
  if (x.k === "write") return x.after === (x.target === 1 ? x.old : x.val);
  return x.ok === (x.width === 8 || x.a % 2 === 0);
}
function arbRef(a) { const pend = new Set(); let last = a.n - 1; return a.reqs.map((r) => { r.forEach((m) => pend.add(m)); let g = -1; const order = a.policy === "fixed" ? [...Array(a.n).keys()] : Array.from({ length: a.n }, (_, k) => (last + 1 + k) % a.n); for (const m of order) if (pend.has(m)) { g = m; break; } if (g >= 0) { pend.delete(g); last = g; } return g; }); }
function cohRef(ops, mesi) {
  // Table-driven MSI/MESI: [state][event] -> [next, busTransaction, writeback]
  const local = { R: { I: (other) => [mesi && other === "I" ? "E" : "S", 1], S: () => ["S", 0], E: () => ["E", 0], M: () => ["M", 0] }, W: { I: () => ["M", 1], S: () => ["M", 1], E: () => ["M", 0], M: () => ["M", 0] } };
  const snoop = { R: { I: ["I", 0], S: ["S", 0], E: ["S", 0], M: ["S", 1] }, W: { I: ["I", 0], S: ["I", 0], E: ["I", 0], M: ["I", 1] } };
  const st = ["I", "I"]; let bus = 0, wb = 0, badM = false;
  for (const o of ops) { const me = o.c, ot = 1 - o.c, [nx, b] = local[o.op][st[me]](st[ot]); if (b) { const [sn, w] = snoop[o.op][st[ot]]; st[ot] = sn; wb += w; bus += 1; } st[me] = nx; if (st.filter((x) => x === "M" || x === "E").length > 1) badM = true; }
  return { st, bus, wb, badM };
}
function fsRef(f) {
  const bx = Math.floor(f.x / f.B), by = Math.floor(f.y / f.B);
  if (f.k === "same") return (bx === by) === f.same;
  if (f.k === "count") return f.inv === (bx === by ? 2 * f.n - 1 : 0);
  if (f.k === "pad") { let p = 0; while (Math.floor((f.y + p) / f.B) === bx) p += 1; return p === f.pad && f.y > f.x; }
  return f.kind === (f.x === f.y ? "true" : bx === by ? "false" : "none");
}
function latRef(l) {
  if (l.k === "thr") return l.v === l.mhz * l.per;
  if (l.k === "xfer") return l.v === l.lat + l.size / l.bw;
  if (l.k === "bott") return l.v === Math.min(...l.rates) && l.rates[l.bi] === l.v;
  if (l.k === "pipe") return l.lat === l.st * l.tc && l.thr === 1000 / l.tc;
  return l.v === l.st * l.tc + (l.N - 1) * l.tc;
}

// ---------- Sweep ----------
let generated = 0, referenceChecks = 0;
const ivCases = [], ysCases = [], kmapCases = [], seqCases = [], decCases = [];
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
      if (few && (m.latch || m.ff || m.reg || m.sreg || (m.cnt && m.cnt.k !== "design") || m.hz && m.hz.k === "trace" || m.fsm || m.fsmOut || (m.senc && m.senc.k === "illegal"))) seqCases.push({ where, m });
      if (m.cnt && m.cnt.k === "design" && sample < 40) seqCases.push({ where, m });
      if (m.timing) { if (!timingRef(m.timing)) fail("timing reference", where); referenceChecks += 1; }
      if (m.crit) { const r = critRef(m.crit); if (r.max !== m.crit.delay || r.min !== m.crit.min || !r.paths.some((pp) => pp.join() === m.crit.path.join())) fail("critical path vs path enumeration", where); referenceChecks += 1; }
      if (m.seq) { if (!seqRef(m.seq)) fail("sequence detector vs string scan", where); referenceChecks += 1; }
      if (m.senc && m.senc.k !== "illegal") { if (!sencRef(m.senc)) fail("state encoding reference", where); referenceChecks += 1; }
      if (m.td && m.td.d1 !== undefined) { const ref = tdBitsRef(m.td.f); if (ref[0] !== m.td.d1 || ref[1] !== m.td.d0) fail("next-state bit columns", where); referenceChecks += 1; }
      if (m.td && m.td.expr) { const col = Array.from({ length: 8 }, (_, row) => { const env = { Q1: (row >> 2) & 1, Q0: (row >> 1) & 1, x: row & 1 }; return evalText(m.td.expr, env); }); if (m.td.col.split("").some((c, i) => c !== "X" && Number(c) !== col[i])) fail("next-state equation vs column", where); referenceChecks += 1; }
      if (m.cpu) { if (!cpuRef(m.cpu)) fail("PL16 reference interpreter", where); referenceChecks += 1; }
      if (m.ctl && m.ctl.c) { if (!equal(ctlRef(m.ctl.op), m.ctl.c)) fail("control table reference", where); referenceChecks += 1; }
      if (m.mc && m.mc.k === "program") { const tot = Object.entries(m.mc.mix).reduce((a, [op, n]) => a + n * MC_CYCLES[op], 0); if (tot !== m.mc.total) fail("multicycle cycle count", where); referenceChecks += 1; }
      if (m.mc && m.mc.k === "seq" && MC_CYCLES[m.mc.op] !== m.mc.n) { fail("multicycle sequence length", where); }
      if (m.pc && m.pc.k === "branch") { const taken = m.pc.op === "BEQ" ? m.pc.a === m.pc.b : m.pc.a !== m.pc.b, nx = taken ? (m.pc.pc + 2 + 2 * m.pc.off) & 0xffff : (m.pc.pc + 2) & 0xffff; if (taken !== m.pc.taken || nx !== m.pc.next) fail("branch PC reference", where); referenceChecks += 1; }
      if (m.pc && m.pc.k === "jump") { if (((m.pc.w & 0xfff) << 1) !== m.pc.next || m.pc.w >> 12 !== 6) fail("jump PC reference", where); referenceChecks += 1; }
      if (m.fault && m.fault.k === "value") { const out = dpRef(m.fault.st, m.fault.ins, { ...ctlRef(m.fault.ins.op), [m.fault.fault[0]]: m.fault.fault[1] }); const c = ctlRef(m.fault.ins.op), dest = c.RegDst ? m.fault.ins.rd : m.fault.ins.rt; if (out.regs[dest] !== m.fault.v) fail("fault injection reference", where); referenceChecks += 1; }
      if (m.pipe) { if (!pipeRef(m.pipe)) fail("pipeline occupancy reference", where); referenceChecks += 1; }
      if (m.dep && m.dep.k === "reg") { const d = depRef(m.dep.a, m.dep.b), kinds = ["raw", "war", "waw"].filter((k) => d[k]); const t = kinds.length ? kinds[0] : "none"; if (kinds.length > 1 || t !== m.dep.type || (t === "raw" && m.dep.mid.length <= 1) !== m.dep.hazard) fail("dependence reference", where); referenceChecks += 1; }
      if (m.fwd) { const src = (reg) => (!reg ? "rf" : dRef(m.fwd.p1) === reg ? "exmem" : dRef(m.fwd.p2) === reg ? "memwb" : "rf"); if (src(m.fwd.c.rs) !== m.fwd.fa || src(m.fwd.c.rt) !== m.fwd.fb) fail("forwarding reference", where); referenceChecks += 1; }
      if (m.stall) { if (stallRef(m.stall) !== m.stall.total) fail("stall/cycle reference", where); referenceChecks += 1; }
      if (m.ctrl && m.ctrl.k === "flush") { const mis = m.ctrl.pred === "nt" ? m.ctrl.taken : !m.ctrl.taken, next = m.ctrl.taken ? (m.ctrl.pc + 2 + 2 * m.ctrl.off + 65536) % 65536 : m.ctrl.pc + 2; if ((mis ? m.ctrl.pen : 0) !== m.ctrl.flush || next !== m.ctrl.next) fail("branch flush reference", where); referenceChecks += 1; }
      if (m.geo) { const g = m.geo; if (g.sets * g.ways * g.blk !== g.cap || 2 ** g.off !== g.blk || 2 ** g.idx !== g.sets || g.tag + g.idx + g.off !== g.aw) fail("cache geometry identities", where); referenceChecks += 1; }
      if (m.split) { const b = m.split.a.toString(2).padStart(m.split.aw, "0"), w = m.split.aw, o = m.split.off, ix = m.split.idx; const ref = { off: parseInt(b.slice(w - o) || "0", 2), set: parseInt(b.slice(w - o - ix, w - o) || "0", 2), tag: parseInt(b.slice(0, w - o - ix) || "0", 2) }; if (!equal(ref, { off: m.split.sp.off, set: m.split.sp.set, tag: m.split.sp.tag })) fail("address split vs string slicing", where); referenceChecks += 1; }
      if (m.cache) { if (!equal(cacheRef(m.cache), m.cache.out)) fail("cache simulator reference", where); referenceChecks += 1; }
      if (m.repl && m.repl.k === "trace") { const r2 = replRef(m.repl.seq, m.repl.ways, m.repl.policy); if (r2.victim !== m.repl.victim || r2.order !== m.repl.order) fail("replacement reference", where); referenceChecks += 1; }
      if (m.wp && m.wp.k === "seq") { const r2 = writeSeqRef(m.wp); if (r2.w !== m.wp.writes || r2.r !== m.wp.reads) fail("write-policy sequence reference", where); referenceChecks += 1; }
      if (m.wp && m.wp.k === "one") { const mw = m.wp.wb ? (m.wp.hit || m.wp.alloc ? 0 : 1) : 1, dirty = m.wp.wb && (m.wp.hit || m.wp.alloc), cached = m.wp.hit || m.wp.alloc; if (mw !== m.wp.memWrites || dirty !== m.wp.dirty || cached !== m.wp.cached) fail("write-policy reference", where); referenceChecks += 1; }
      if (m.arr && m.arr.k === "build") { if (m.arr.chips !== m.arr.dm * m.arr.wm || 2 ** m.arr.lines !== m.arr.cd * m.arr.dm) fail("memory array reference", where); referenceChecks += 1; }
      if (m.arr && (m.arr.k === "bank" || m.arr.k === "local")) { if (Math.floor(m.arr.addr / m.arr.cd) !== m.arr.bank || m.arr.addr % m.arr.cd !== m.arr.local) fail("bank select reference", where); referenceChecks += 1; }
      if (m.bank && m.bank.k === "rows") { const open = {}, res = m.bank.addrs.map((a) => { const b = a.toString(2).padStart(4 + m.bank.bb + m.bank.cb, "0"), row = b.slice(0, 4), bank = b.slice(4, 4 + m.bank.bb), hit = open[bank] === row; open[bank] = row; return hit; }); if (!equal(res, m.bank.res)) fail("DRAM row-buffer reference", where); referenceChecks += 1; }
      if (m.vm && m.vm.k === "one") { const e = m.vm.pt[m.vm.va >> 8], out = !e.v ? "fault" : m.vm.write && !e.perm.includes("W") ? "prot" : "ok"; if (out !== m.vm.outcome || (out === "ok" && e.ppn * 256 + (m.vm.va & 255) !== m.vm.pa)) fail("translation reference", where); referenceChecks += 1; }
      if (m.vm && m.vm.k === "split") { if (Math.floor(m.vm.va / 2 ** m.vm.pb) !== m.vm.vpn || m.vm.va % 2 ** m.vm.pb !== m.vm.off) fail("page split reference", where); referenceChecks += 1; }
      if (m.walk && m.walk.k === "pte") { if (m.walk.base + 2 * m.walk.i2 !== m.walk.pteAddr || m.walk.ppn * 256 + m.walk.off !== m.walk.pa || (m.walk.i1 << 12 | m.walk.i2 << 8 | m.walk.off) !== m.walk.va) fail("page walk reference", where); referenceChecks += 1; }
      if (m.walk && m.walk.k === "outcome") { const out = !m.walk.l1v ? "l1" : !m.walk.l2v ? "l2" : "ok"; if (out !== m.walk.outcome) fail("page walk outcome reference", where); referenceChecks += 1; }
      if (m.tlb) { if (!equal(tlbRef(m.tlb), m.tlb.out)) fail("TLB reference", where); referenceChecks += 1; }
      if (m.acc) { const a = m.acc, first = a.tlbHit ? "tlbHit" : a.present ? "tlbMissFill" : "tlbMiss"; const ref = first === "tlbMiss" ? ["tlbMiss", "fault"] : a.write && !a.perm.includes("W") ? [first, "prot"] : [first, "pa", a.cached ? "cacheHit" : "cacheMiss"]; if (!equal(ref, a.steps)) fail("access outcome reference", where); referenceChecks += 1; }
      if (m.io) { if (!ioRef(m.io)) fail("I/O method reference", where); referenceChecks += 1; }
      if (m.mmio) { if (!mmioRef(m.mmio)) fail("memory-mapped I/O reference", where); referenceChecks += 1; }
      if (m.arb && m.arb.k === "trace") { if (!equal(arbRef(m.arb), m.arb.grants)) fail("arbitration reference", where); referenceChecks += 1; }
      if (m.arb && m.arb.k === "starve") { if ((m.arb.policy === "fixed") !== m.arb.v) fail("starvation reference", where); referenceChecks += 1; }
      if (m.coh) { const r2 = cohRef(m.coh.ops, m.coh.mesi); if (!equal(r2.st, m.coh.st) || r2.bus !== m.coh.bus || r2.wb !== m.coh.wb || r2.badM) fail("coherence protocol reference", where); referenceChecks += 1; }
      if (m.fs) { if (!fsRef(m.fs)) fail("false sharing reference", where); referenceChecks += 1; }
      if (m.lat) { if (!latRef(m.lat)) fail("latency/throughput reference", where); referenceChecks += 1; }
      // Exact rational checks (Python fractions) for answers shown as rounded decimals.
      if (sample < 200 && (m.cpi || m.amat || m.perf || m.amd)) { const fieldId = q.fields.find((f) => f.options && /^[0-9.]+$/.test(f.options[0]?.label ?? "") && f.options.some((o) => /^[0-9.]+$/.test(o.label)))?.id; if (fieldId) decCases.push({ where, spec: m.cpi || m.amat || m.perf || m.amd, fam: m.cpi ? "cpi" : m.amat ? "amat" : m.perf ? "perf" : "amd", label: correctLabel(q, fieldId) }); }
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}
// Brute-force minimality.
for (const c of kmapCases) { const b = bruteMin(c.vars.length, c.ones, c.dcs); if (!b || b.terms !== c.terms || b.lits !== c.lits) fail("K-map minimality vs brute force", [...c.where, b, c.terms, c.lits]); referenceChecks += 1; }

// ---------- Python fractions: exact values behind every rounded decimal answer ----------
let pyChecks = 0;
if (Bun.spawnSync(["/usr/bin/env", "python3", "-c", "import fractions"], { stdout: "pipe", stderr: "pipe" }).exitCode === 0 && decCases.length) {
  const script = `
import json, sys
from fractions import Fraction as F
out = []
for c in json.load(sys.stdin):
    f, s = c["fam"], c["spec"]
    q = lambda x: F(str(x))
    if f == "cpi":
        k = s["k"]
        v = F(s["n"] + 4, s["n"]) if k == "short" else 1 + q(s["fb"]) / 100 * q(s["pm"]) / 100 * s["pp"] if k == "branch" else 1 + q(s["fl"]) / 100 * q(s["lu"]) / 100 + q(s["fb"]) / 100 * q(s["pm"]) / 100 * 2 if k == "mixed" else F(s["n"] * s["st"], s["n"] + s["st"] - 1) if k == "speedup" else None
    elif f == "amat":
        k = s["k"]
        v = s["ht"] + q(s["mr"]) / 100 * s["mp"] if k == "one" else s["h1"] + q(s["m1"]) / 100 * (s["h2"] + q(s["m2"]) / 100 * s["mem"]) if k == "two" else q(s["m1"]) * q(s["m2"]) / 100 if k == "global" else (s["t"] - s["h1"]) / (q(s["m1"]) / 100)
    elif f == "perf":
        k = s["k"]
        v = (max(q(s["ca"]) / q(s["fa"]), q(s["cb"]) / q(s["fb"])) / min(q(s["ca"]) / q(s["fa"]), q(s["cb"]) / q(s["fb"]))) if k == "cmp" else q(s["v"]) if k == "cpi" else q(s["ic"]) * q(s["cpi"]) / s["t"] if k == "rate" else 1 / ((1 - q(s["dI"]) / 100) * (1 + q(s["dC"]) / 100)) if k == "compiler" else None
    else:
        k = s["k"]; fr = q(s["f"])
        v = 1 / ((1 - fr) + fr / s["s"]) if k == "one" else 1 / (1 - fr) if k == "max" else max(1 / ((1 - fr) + fr / s["s"]), 1 / ((1 - q(s["f2"])) + q(s["f2"]) / s["s2"])) if k == "cmp" else (None if 1 / q(s["T"]) - (1 - fr) <= 0 else fr / (1 / q(s["T"]) - (1 - fr)))
    out.append(None if v is None else [v.numerator, v.denominator])
print(json.dumps(out))`;
  const run = Bun.spawnSync(["/usr/bin/env", "python3", "-I", "-c", script], { stdin: Buffer.from(JSON.stringify(decCases)), stdout: "pipe", stderr: "pipe" });
  if (run.exitCode !== 0) fail("python fractions run", run.stderr.toString().slice(0, 500));
  else JSON.parse(run.stdout.toString()).forEach((v, i) => { const c = decCases[i]; if (v === null) return; const exact = v[0] / v[1], shown = Number(c.label), d = (c.label.split(".")[1] ?? "").length, tol = 0.5 * 10 ** -Math.max(d, 0) + 1e-9; if (!Number.isFinite(shown) || Math.abs(exact - shown) > Math.max(tol, 0.5 * 10 ** -3)) fail("decimal answer vs exact fraction", [...c.where, c.label, v]); pyChecks += 1; });
}

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
  // ---------- Sequential circuits in Icarus Verilog (timed stimulus, one initial block per case) ----------
  if (hasTool("iverilog") && hasTool("vvp") && seqCases.length) {
    const L = [], expect = [];
    const fsmCase = (p, f, x0, start, xs, rstAt, outs) => {
      const sb = 3;
      L.push(`  reg [${sb - 1}:0] ${p}s; reg ${p}x; wire [${sb - 1}:0] ${p}n; wire ${p}o;`);
      const nx = (x) => `(${Array.from({ length: f.n }, (_, k) => `${p}s == ${k} ? ${f.next[k][x]} : `).join("")}0)`;
      L.push(`  assign ${p}n = ${p}x ? ${nx(1)} : ${nx(0)};`);
      const outE = f.mealy ? `(${Array.from({ length: f.n }, (_, k) => `${p}s == ${k} ? (${p}x ? ${f.out[k][1]} : ${f.out[k][0]}) : `).join("")}0)` : `(${Array.from({ length: f.n }, (_, k) => `${p}s == ${k} ? ${f.out[k]} : `).join("")}0)`;
      L.push(`  assign ${p}o = ${outE};`);
      const steps = xs.map((x, i) => `${p}x = ${x}; #1 $display("${p} o${i} %b", ${p}o); ${p}s = ${i === rstAt ? 0 : `(${p}s >= ${f.n}) ? 0 : ${p}n`}; #1 $display("${p} s${i} %0d", ${p}s);`).join(" ");
      L.push(`  initial begin ${p}s = ${start}; ${steps} end`);
    };
    seqCases.forEach(({ where, m }, i) => {
      const p = `q${i}_`;
      if (m.latch && m.latch.k === "d") {
        L.push(`  reg ${p}en, ${p}d, ${p}q; always @(*) if (${p}en) ${p}q = ${p}d;`);
        L.push(`  initial begin ${p}en = 0; ${p}d = 0; ${p}q = ${m.latch.q0}; ${m.latch.rows.map((r, k) => `#1 ${p}en = ${r.en}; ${p}d = ${r.d}; #9 $display("${p} v${k} %b", ${p}q);`).join(" ")} end`);
        expect.push([p, where, "latch D", m.latch.qs.split("").map((v, k) => [`v${k}`, v])]);
      } else if (m.latch && (m.latch.k === "nor" || m.latch.k === "nand")) {
        const nand = m.latch.k === "nand", g = nand ? "nand" : "nor";
        L.push(nand ? `  reg ${p}a, ${p}b; wire ${p}q, ${p}qb; nand #1 (${p}q, ${p}a, ${p}qb); nand #1 (${p}qb, ${p}b, ${p}q);` : `  reg ${p}a, ${p}b; wire ${p}q, ${p}qb; nor #1 (${p}q, ${p}b, ${p}qb); nor #1 (${p}qb, ${p}a, ${p}q);`);
        const init = nand ? (m.latch.q0 ? `${p}a = 0; ${p}b = 1;` : `${p}a = 1; ${p}b = 0;`) : m.latch.q0 ? `${p}a = 1; ${p}b = 0;` : `${p}a = 0; ${p}b = 1;`, hold = nand ? `${p}a = 1; ${p}b = 1;` : `${p}a = 0; ${p}b = 0;`;
        L.push(`  initial begin ${init} #10 ${hold} #10 ${m.latch.rows.map((r, k) => `${p}a = ${r.s}; ${p}b = ${r.r}; #10 if (${p}q === ${p}qb) $display("${p} v${k} inv"); else $display("${p} v${k} %b", ${p}q);`).join(" ")} end`);
        expect.push([p, where, "SR latch gates", m.latch.out.map((v, k) => [`v${k}`, v])]);
      } else if (m.latch && m.latch.k === "cmp") {
        const lc = m.latch;
        L.push(`  reg ${p}c, ${p}d, ${p}ql, ${p}qf; always @(*) if (${p}c) ${p}ql = ${p}d; always @(posedge ${p}c) if ($time > 1) ${p}qf <= ${p}d;`);
        L.push(`  initial begin ${p}ql = ${lc.q0}; ${p}qf = ${lc.q0}; ${p}d = ${lc.d[0]}; ${p}c = ${lc.clk[0]}; #10 ${lc.clk.slice(1).map((c, k) => `${p}d = ${lc.d[k + 1]}; #1 ${p}c = ${c}; #9`).join(" ")} $display("${p} l %b", ${p}ql); $display("${p} f %b", ${p}qf); end`);
        expect.push([p, where, "latch vs flip-flop", [["l", String(m.latch.qL)], ["f", String(m.latch.qF)]]]);
      } else if (m.ff && m.ff.type) {
        const f = m.ff, body = f.type === "D" ? `${p}q <= ${p}a;` : f.type === "T" ? `${p}q <= ${p}a ? ~${p}q : ${p}q;` : `case ({${p}a, ${p}b}) 2'b00: ${p}q <= ${p}q; 2'b01: ${p}q <= 0; 2'b10: ${p}q <= 1; 2'b11: ${p}q <= ~${p}q; endcase`;
        L.push(`  reg ${p}clk, ${p}q, ${p}a, ${p}b, ${p}rst, ${p}en; always @(posedge ${p}clk) if (${p}rst) ${p}q <= 0; else if (${p}en) begin ${body} end`);
        L.push(`  initial begin ${p}clk = 0; ${p}q = ${f.q}; ${p}a = ${f.a}; ${p}b = ${f.b}; ${p}rst = ${f.rst}; ${p}en = ${f.en}; #5 ${p}clk = 1; #1 $display("${p} n %b", ${p}q); end`);
        expect.push([p, where, "flip-flop", [["n", String(f.nq)]]]);
      } else if (m.ff && m.ff.kind) {
        const f = m.ff, eq = { johnson: [`${p}q0`, `~${p}q1`, "D"], swap: [`${p}q0`, `${p}q1`, "D"], xor: [`${p}q1 ^ ${p}q0`, `~${p}q0`, "D"] }[f.kind];
        let upd;
        if (eq) upd = `${p}q1 <= ${eq[0]}; ${p}q0 <= ${eq[1]};`;
        else if (f.kind === "t") upd = `${p}q1 <= ${p}q0 ? ~${p}q1 : ${p}q1; ${p}q0 <= ~${p}q0;`;
        if (f.kind === "jk") { // J1 = Q0, K1 = ¬Q0; J0 = ¬Q1, K0 = Q1, written with an explicit JK case statement.
          L.push(`  reg ${p}clk, ${p}q1, ${p}q0; wire ${p}j1 = ${p}q0, ${p}k1 = ~${p}q0, ${p}j0 = ~${p}q1, ${p}k0 = ${p}q1;`);
          L.push(`  always @(posedge ${p}clk) begin case ({${p}j1, ${p}k1}) 2'b00: ${p}q1 <= ${p}q1; 2'b01: ${p}q1 <= 0; 2'b10: ${p}q1 <= 1; 2'b11: ${p}q1 <= ~${p}q1; endcase case ({${p}j0, ${p}k0}) 2'b00: ${p}q0 <= ${p}q0; 2'b01: ${p}q0 <= 0; 2'b10: ${p}q0 <= 1; 2'b11: ${p}q0 <= ~${p}q0; endcase end`);
        } else L.push(`  reg ${p}clk, ${p}q1, ${p}q0; always @(posedge ${p}clk) begin ${upd} end`);
        L.push(`  initial begin ${p}clk = 0; ${p}q1 = ${f.q1}; ${p}q0 = ${f.q0}; #5 ${p}clk = 1; #1 $display("${p} n %b%b", ${p}q1, ${p}q0); end`);
        expect.push([p, where, "flip-flop pair", [["n", f.next]]]);
      } else if (m.reg) {
        const g = m.reg, w = g.w;
        L.push(`  reg ${p}clk, ${p}arst, ${p}en, ${p}rst; reg [${w - 1}:0] ${p}d, ${p}q; always @(posedge ${p}clk or posedge ${p}arst) if (${p}arst) ${p}q <= 0; else if (${p}rst) ${p}q <= 0; else if (${p}en) ${p}q <= ${p}d;`);
        L.push(`  initial begin ${p}clk = 0; ${p}arst = 0; ${p}q = ${w}'d${g.q0}; ${g.edges.map((e, k) => `${k === g.asyncAt ? `#1 ${p}arst = 1; #1 ${p}arst = 0; ` : ""}${p}d = ${w}'d${e.d}; ${p}en = ${e.en}; ${p}rst = ${e.rst}; #4 ${p}clk = 1; #1 $display("${p} e${k} %b", ${p}q); #4 ${p}clk = 0;`).join(" ")} end`);
        expect.push([p, where, "register", g.after.map((v, k) => [`e${k}`, v])]);
      } else if (m.sreg) {
        const g = m.sreg, w = g.w;
        L.push(`  reg ${p}clk, ${p}en, ${p}dir, ${p}sin; reg [${w - 1}:0] ${p}q; always @(posedge ${p}clk) if (${p}en) ${p}q <= ${p}dir ? {${p}q[${w - 2}:0], ${p}sin} : {${p}sin, ${p}q[${w - 1}:1]};`);
        L.push(`  initial begin ${p}clk = 0; ${p}q = ${w}'d${g.load !== null ? g.load : g.q0}; ${g.rec.map((e) => `${p}en = ${e.en}; ${p}dir = ${e.dir === "L" ? 1 : 0}; ${p}sin = ${e.sin}; #1 if (${p}en) $display("${p} o %b", ${p}dir ? ${p}q[${w - 1}] : ${p}q[0]); #4 ${p}clk = 1; #5 ${p}clk = 0;`).join(" ")} $display("${p} q %b", ${p}q); end`);
        expect.push([p, where, "shift register", [["q", bits(g.q, w)]], g.emitted]);
      } else if (m.cnt && m.cnt.k === "ripple") {
        L.push(`  reg ${p}clk; reg [3:0] ${p}q; always @(posedge ${p}clk) ${p}q[0] <= #1 ~${p}q[0]; always @(negedge ${p}q[0]) if ($time > 2) ${p}q[1] <= #1 ~${p}q[1]; always @(negedge ${p}q[1]) if ($time > 2) ${p}q[2] <= #1 ~${p}q[2]; always @(negedge ${p}q[2]) if ($time > 2) ${p}q[3] <= #1 ~${p}q[3];`);
        L.push(`  initial begin ${p}clk = 0; ${p}q = 4'd${m.cnt.s}; #5 ${p}clk = 1; end always @(${p}q) if ($time > 2) $display("${p} t %b", ${p}q);`);
        expect.push([p, where, "ripple counter", null, m.cnt.trans]);
      } else if (m.cnt && m.cnt.k === "design") {
        const v = { up: [`${p}q1 ^ ${p}q0`, `~${p}q0`], down: [`~(${p}q1 ^ ${p}q0)`, `~${p}q0`], gray: [`${p}q0`, `~${p}q1`], mod3: [`${p}q0`, `~${p}q1 & ~${p}q0`] }[m.cnt.key];
        L.push(`  reg ${p}clk, ${p}q1, ${p}q0; always @(posedge ${p}clk) begin ${p}q1 <= ${v[0]}; ${p}q0 <= ${v[1]}; end`);
        L.push(`  initial begin ${p}clk = 0; ${p}q1 = 0; ${p}q0 = 0; ${m.cnt.seq.map((_, k) => `#5 ${p}clk = 1; #1 $display("${p} c${k} %0d", {${p}q1, ${p}q0}); #4 ${p}clk = 0;`).join(" ")} end`);
        expect.push([p, where, "counter design", m.cnt.seq.map((_, k) => [`c${k}`, String(m.cnt.seq[(k + 1) % m.cnt.seq.length])])]);
      } else if (m.cnt) {
        const c = m.cnt, b = c.bits;
        L.push(`  reg ${p}clk, ${p}en, ${p}up; reg [${b - 1}:0] ${p}q; always @(posedge ${p}clk) if (${p}en) ${p}q <= ${p}up ? (${p}q == ${c.mod - 1} ? 0 : ${p}q + 1) : (${p}q == 0 ? ${c.mod - 1} : ${p}q - 1);`);
        L.push(`  initial begin ${p}clk = 0; ${p}q = ${c.start}; ${c.rec.map((e, k) => `${p}en = ${e.en}; ${p}up = ${e.up}; #5 ${p}clk = 1; #1 $display("${p} e${k} %b ${c.k === "updown" ? "%b" : "-"}", ${p}q${c.k === "updown" ? `, ${p}up ? (${p}q == ${c.mod - 1}) : (${p}q == 0)` : ""}); #4 ${p}clk = 0;`).join(" ")} end`);
        expect.push([p, where, "counter", c.states.map((v, k) => [`e${k}`, `${v} ${c.k === "updown" ? c.tc[k] : "-"}`])]);
      } else if (m.hz) {
        const h = m.hz, f1 = h.pos ? "|" : "&", f2 = h.pos ? "&" : "|", bc = h.pos ? 0 : 1;
        L.push(`  reg ${p}a, ${p}na, ${p}p, ${p}r, ${p}y; reg ${p}b = ${bc}, ${p}c = ${bc}; integer ${p}t0;`);
        L.push(`  always @(${p}a) ${p}na <= #${h.dn} ~${p}a; always @(${p}a) ${p}p <= #${h.dg + h.buf} (${p}a ${f1} ${p}b); always @(${p}na) ${p}r <= #${h.dg} (${p}na ${f1} ${p}c); always @(${p}p or ${p}r) ${p}y <= #${h.dout} (${p}p ${f2} ${p}r);`);
        L.push(`  initial begin ${p}a = ${h.aFrom}; ${p}na = ${1 - h.aFrom}; ${p}p = ${h.aFrom} ${f1} ${bc}; ${p}r = ${1 - h.aFrom} ${f1} ${bc}; ${p}y = (${h.aFrom} ${f1} ${bc}) ${f2} (${1 - h.aFrom} ${f1} ${bc}); #100 ${p}a = ${1 - h.aFrom}; end always @(${p}y) if ($time >= 100) $display("${p} h %0d %b", $time - 100, ${p}y);`);
        expect.push([p, where, "hazard", null, h.events.map((e) => `${e[0]} ${e[1]}`)]);
      } else if (m.fsm) {
        fsmCase(p, m.fsm.f, null, m.fsm.s0, m.fsm.xs, m.fsm.rst, null);
        expect.push([p, where, "FSM trace", m.fsm.states.map((v, k) => [`s${k}`, String(v)])]);
      } else if (m.fsmOut) {
        m.fsmOut.machines.forEach((f, j) => { fsmCase(`${p}m${j}`, f, null, m.fsmOut.s0 ?? 0, m.fsmOut.xs, -1, null); expect.push([`${p}m${j}`, where, "FSM outputs", m.fsmOut.outs[j].split("").map((v, k) => [`o${k}`, v])]); });
      } else if (m.senc) {
        fsmCase(p, m.senc.f, null, m.senc.start, m.senc.xs, -1, null);
        expect.push([p, where, "illegal-state recovery", m.senc.states.map((v, k) => [`s${k}`, String(v)])]);
      }
    });
    writeFileSync(join(dir, "seq.v"), ["module seqtb;", ...L, "endmodule"].join("\n"));
    const comp = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "iverilog", "-o", join(dir, "seq.vvp"), join(dir, "seq.v")], { stdout: "pipe", stderr: "pipe" });
    if (comp.exitCode !== 0) fail("iverilog sequential compile", comp.stderr.toString().slice(0, 800));
    else {
      const run = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "vvp", "-n", join(dir, "seq.vvp")], { stdout: "pipe", stderr: "pipe" });
      const tagged = {};
      for (const raw of run.stdout.toString().split("\n")) { const mm = /^(q\d+_(?:m\d+)?)\s+(\S+)\s*(.*)$/.exec(raw.trim()); if (mm) (tagged[mm[1]] ??= []).push([mm[2], mm[3]]); }
      for (const [p, where, kind, pairs, seq] of expect) {
        const got = tagged[p] ?? [];
        let ok = true;
        if (pairs) for (const [k, v] of pairs) { const hit = got.find((g) => g[0] === k); if (!hit || hit[1].toLowerCase() !== v.toLowerCase()) ok = false; }
        if (kind === "ripple counter") ok = equal(got.filter((g) => g[0] === "t").map((g) => g[1]), seq);
        if (kind === "hazard") ok = equal(got.filter((g) => g[0] === "h").map((g) => g[1]), seq);
        if (kind === "shift register") ok = ok && got.filter((g) => g[0] === "o").map((g) => g[1]).join("") === seq;
        if (!ok) fail(`iverilog ${kind} vs answer`, [...where, got.slice(0, 8)]);
        ivChecks += 1;
      }
    }
  }
} finally { rmSync(dir, { recursive: true, force: true }); }

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Digital-logic extended validation passed: ${propertyCases.toLocaleString("en-US")} gate property cases, ${referenceChecks.toLocaleString("en-US")} independent reference checks (including brute-force K-map minimality), ${ivChecks.toLocaleString("en-US")} circuits simulated by Icarus Verilog, ${ysChecks.toLocaleString("en-US")} Yosys SAT proofs, ${pyChecks.toLocaleString("en-US")} exact-fraction checks (Python), and ${generated.toLocaleString("en-US")} generated questions (4,000 per family and supported level), with bilingual seed parity.${toolNote}`);
