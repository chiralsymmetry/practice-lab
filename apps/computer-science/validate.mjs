import vm from "node:vm";

const locale = (await import("./locales/en.mjs")).default;
const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
  .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
const context = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(source, context);

const app = context.window.ComputerSciencePractice;
if (!app || app.modelId !== "cs-discrete-v1") throw new Error("Computer-science app/oracle model missing");
const o = app.oracles;
function fail(label, values = []) { throw new Error(`${label}: ${values.join(", ")}`); }

const growthIds = ["1", "loglog", "log", "log2", "sqrt", "n", "nlog", "nlog2", "n2", "n2log", "n3", "2n", "fact"];
for (const a of growthIds) for (const b of growthIds) {
  if (o.compareGrowth(a, b) !== -o.compareGrowth(b, a)) fail("growth antisymmetry", [a, b]);
  for (const c of growthIds) {
    if (o.compareGrowth(a, b) <= 0 && o.compareGrowth(b, c) <= 0 && o.compareGrowth(a, c) > 0) fail("growth transitivity", [a, b, c]);
  }
}

function recurrenceRef(a, b, k, base, d) {
  let value = BigInt(base);
  for (let depth = 1; depth <= k; depth += 1) value = BigInt(a) * value + BigInt(b) ** BigInt(depth * d);
  return value;
}
for (let a = 1; a <= 4; a += 1) for (let b = 2; b <= 4; b += 1) for (let k = 0; k <= 8; k += 1) for (let d = 0; d <= 3; d += 1) {
  if (o.recurrenceValue(a, b, k, 1, d) !== recurrenceRef(a, b, k, 1, d)) fail("recurrence reference", [a, b, k, d]);
}

const masterClass = (a, b, d, logk) => {
  let p = 0, power = 1;
  while (power < a) { power *= b; p += 1; }
  if (d < p) return p === 1 ? "n" : "n2";
  if (d > p) return d === 1 ? "n" : d === 2 ? "n2" : "n3";
  if (p === 0) return logk === 0 ? "log" : "log2";
  return p === 1 ? "nlog" : "n2log";
};
for (let seed = 1; seed <= 10_000; seed += 1) {
  const question = app.generateQuestion("master_recurrence_class", 5, seed);
  const [a, b, d, logk] = question.metadata.semanticSignature.split("-").map(Number);
  if (question.canonicalAnswer.answer !== masterClass(a, b, d, logk)) fail("Master classification", [a, b, d, logk]);
}

function heapValid(heap) { return heap.every((value, i) => (i === 0 || heap[Math.floor((i - 1) / 2)] <= value)); }
for (let seed = 0; seed < 50_000; seed += 1) {
  let heap = [];
  const inserted = [];
  for (let i = 0; i < 8; i += 1) {
    const value = (seed * 17 + i * 23) % 101;
    inserted.push(value);
    heap = o.minHeapInsert(heap, value);
    if (!heapValid(heap)) fail("heap insert invariant", [seed, i]);
  }
  const removed = [];
  while (heap.length) {
    removed.push(heap[0]);
    heap = o.minHeapDelete(heap);
    if (!heapValid(heap)) fail("heap delete invariant", [seed]);
  }
  if (removed.join(",") !== inserted.slice().sort((x, y) => x - y).join(",")) fail("heap ordering", [seed]);
}

for (let m = 3; m <= 17; m += 1) for (let seed = 0; seed < 5_000; seed += 1) {
  const keys = Array.from({ length: m }, (_, i) => seed * m + i * 19 + 1);
  const trace = o.linearProbe(keys, m);
  if (trace.table.filter((x) => x !== "·").length !== m) fail("linear probe occupancy", [m, seed]);
  if (new Set(trace.table).size !== m) fail("linear probe key preservation", [m, seed]);
  if (trace.probes.some((p) => p < 1 || p > m)) fail("linear probe bounds", [m, seed]);
}

function bfsRef(vertices, edges, directed, start) {
  const adj = Object.fromEntries(vertices.map((v) => [v, []]));
  for (const [u, v] of edges) { adj[u].push(v); if (!directed) adj[v].push(u); }
  Object.values(adj).forEach((list) => list.sort());
  const queue = [start], seen = new Set([start]), order = [];
  while (queue.length) { const u = queue.shift(); order.push(u); for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); queue.push(v); } }
  return order;
}
function dijkstraRef(vertices, edges, directed, start) {
  const dist = Object.fromEntries(vertices.map((v) => [v, Infinity]));
  dist[start] = 0;
  for (let pass = 0; pass < vertices.length - 1; pass += 1) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
      if (!directed && dist[v] + w < dist[u]) { dist[u] = dist[v] + w; changed = true; }
    }
    if (!changed) break;
  }
  return dist;
}
for (let seed = 0; seed < 100_000; seed += 1) {
  const vertices = ["A", "B", "C", "D", "E"];
  const directed = Boolean(seed & 1);
  const edges = [["A", "B", seed % 7], ["A", "C", 1 + seed % 5], ["C", "B", 2], ["B", "D", 1], ["C", "D", 4], ["D", "E", seed % 3]];
  const gotBfs = o.bfs(vertices, edges, directed, "A").order;
  if (gotBfs.join(",") !== bfsRef(vertices, edges, directed, "A").join(",")) fail("BFS reference", [seed]);
  const got = o.dijkstra(vertices, edges, directed, "A").dist, expected = dijkstraRef(vertices, edges, directed, "A");
  for (const v of vertices) if (got[v] !== expected[v]) fail("Dijkstra reference", [seed, v, got[v], expected[v]]);
}

for (let n = 2; n <= 12; n += 1) {
  const vertices = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) if ((i * 17 + j * 31 + n) % 4 === 0) edges.push([vertices[i], vertices[j]]);
  const order = o.topological(vertices, edges), position = Object.fromEntries(order.map((v, i) => [v, i]));
  if (order.length !== n || edges.some(([u, v]) => position[u] >= position[v])) fail("topological edge order", [n]);
}

const logicAsts = [["and", "p", "q"], ["or", ["not", "p"], "q"], ["imp", "p", "q"], ["iff", ["imp", "p", "q"], ["or", ["not", "p"], "q"]]];
for (const ast of logicAsts) {
  const column = o.truthColumn(ast, ["p", "q"]);
  if (column.length !== 4 || column.some((x) => x !== "T" && x !== "F")) fail("truth column", [JSON.stringify(ast)]);
}

for (let n = 0; n <= 30; n += 1) {
  if (o.factorial(n) !== (n < 2 ? 1n : BigInt(n) * o.factorial(n - 1))) fail("factorial recurrence", [n]);
  for (let k = 0; k <= n; k += 1) {
    if (k > 0 && k < n && o.binomial(n, k) !== o.binomial(n - 1, k - 1) + o.binomial(n - 1, k)) fail("Pascal identity", [n, k]);
  }
}
for (let length = 1; length <= 16; length += 1) {
  const all = o.countBitStrings(length, () => true);
  if (all !== 2 ** length) fail("bit-string universe", [length]);
  for (let ones = 0; ones <= length; ones += 1) {
    const count = o.countBitStrings(length, (bits) => bits.split("1").length - 1 === ones);
    if (BigInt(count) !== o.binomial(length, ones)) fail("bit-string binomial", [length, ones]);
  }
}

let generated = 0;
for (let familyIndex = 0; familyIndex < app.families.length; familyIndex += 1) {
  const family = app.families[familyIndex];
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 200; sample += 1) {
      const seed = ((familyIndex + 1) * 10_000_000 + level * 10_000 + sample + 1) >>> 0;
      const question = app.generateQuestion(family.id, level, seed, true);
      if (!app.checkQuestion(question.canonicalAnswer, question).correct) fail("canonical answer", [family.id, level, seed]);
      if (!question.prompt.title || !question.prompt.rows.length || !question.explanation) fail("rendering contract", [family.id, level, seed]);
      signatures.add(question.structuralSignature);
      generated += 1;
    }
    if (signatures.size < 2) fail("generator variation", [family.id, level]);
  }
}

console.log(`Computer-science extended validation passed: exact growth/recurrence invariants, 400,000 heap transitions, 75,000 hash traces, 100,000 graph references, exhaustive small bit strings, and ${generated.toLocaleString("en-US")} generated questions`);
