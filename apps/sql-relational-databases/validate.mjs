import vm from "node:vm";

async function loadApp(localeCode) {
  const locale = (await import(`./locales/${localeCode}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
    .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = { window: {}, document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.SqlRelationalDatabasesApp;
}

const en = await loadApp("en");
const sv = await loadApp("sv");
const failures = [];
const fail = (name, data) => {
  if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`);
};
const o = en.oracles;

const refNot = (x) => x === "T" ? "F" : x === "F" ? "T" : "U";
const refAnd = (a, b) => a === "F" || b === "F" ? "F" : a === "T" && b === "T" ? "T" : "U";
const refOr = (a, b) => a === "T" || b === "T" ? "T" : a === "F" && b === "F" ? "F" : "U";
const truth = ["T", "F", "U"];
for (let i = 0; i < 100_000; i += 1) {
  const a = truth[i % 3], b = truth[Math.floor(i / 3) % 3];
  if (o.not3(a) !== refNot(a) || o.and3(a, b) !== refAnd(a, b) || o.or3(a, b) !== refOr(a, b)) fail("3VL", [a, b]);
  const value = i % 11 === 0 ? null : i % 17;
  const list = [i % 5, (i * 7) % 19, i % 4 === 0 ? null : (i * 11) % 23];
  const comparisons = list.map((x) => value === null || x === null ? "U" : value === x ? "T" : "F");
  const expected = comparisons.includes("T") ? "T" : comparisons.includes("U") ? "U" : "F";
  if (o.in3(value, list) !== expected) fail("IN", [value, list]);
}

const refKey = (value) => value === null ? "#NULL" : `${typeof value}:${value}`;
const refDistinct = (rows) => {
  const seen = new Set();
  return rows.filter((row) => {
    const key = row.map(refKey).join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
for (let i = 0; i < 100_000; i += 1) {
  const rows = Array.from({ length: 2 + i % 7 }, (_, j) => [j % 4 === 0 ? null : (i * 13 + j * 5) % 9, (i + j) % 3]);
  const got = o.distinctRows(rows), expected = refDistinct(rows);
  if (JSON.stringify(got) !== JSON.stringify(expected)) fail("DISTINCT", [i]);
  const shuffled = rows.slice().reverse();
  if (!o.bagEqual(rows, shuffled)) fail("bag permutation", [i]);
  if (rows.length > 2 && o.bagEqual(rows, rows.slice(1))) fail("bag multiplicity", [i]);
}

for (let i = 0; i < 100_000; i += 1) {
  const left = Array.from({ length: 1 + i % 5 }, (_, j) => ({ lk: (i + j) % 4 === 0 ? null : (i + j) % 3, leftId: j }));
  const right = Array.from({ length: 1 + (i * 7) % 6 }, (_, j) => ({ rk: (i + j * 2) % 5 === 0 ? null : (i + j) % 3, rightId: j }));
  let inner = 0, padded = 0;
  for (const a of left) {
    let matches = 0;
    for (const b of right) if (a.lk !== null && b.rk !== null && a.lk === b.rk) matches += 1;
    inner += matches;
    padded += matches || 1;
  }
  if (o.joinRows(left, right, "lk", "rk", false, false).length !== inner) fail("inner join", [i]);
  if (o.joinRows(left, right, "lk", "rk", true, false).length !== padded) fail("left join", [i]);
}

for (let i = 0; i < 50_000; i += 1) {
  const values = Array.from({ length: i % 9 }, (_, j) => (i + j) % 4 === 0 ? null : (i * 3 + j) % 17);
  const nonnull = values.filter((x) => x !== null);
  const result = o.aggregates(values);
  const sum = nonnull.reduce((a, b) => a + b, 0);
  const expected = { countStar: values.length, count: nonnull.length, countDistinct: new Set(nonnull).size, sum: nonnull.length ? sum : null, avg: nonnull.length ? sum / nonnull.length : null };
  for (const key of Object.keys(expected)) if (result[key] !== expected[key]) fail("aggregate", [i, key]);
}

for (let i = 0; i < 50_000; i += 1) {
  const left = Array.from({ length: i % 7 }, (_, j) => j % 4 === 0 ? null : (i + j) % 11);
  const right = Array.from({ length: (i * 3) % 7 }, (_, j) => j % 5 === 0 ? null : (i * 5 + j) % 11);
  const union = refDistinct(left.concat(right).map((x) => [x]));
  const gotUnion = o.distinctRows(left.concat(right).map((x) => [x]));
  if (JSON.stringify(union) !== JSON.stringify(gotUnion)) fail("set union", [i]);
  const probe = i % 13;
  const expectedIn = right.includes(probe) ? "T" : right.includes(null) ? "U" : "F";
  if (o.in3(probe, right) !== expectedIn) fail("subquery IN", [i]);
}

const mutationFamilies = ["insert_defaults_constraints", "update_result", "delete_result", "check_not_null_unique", "foreign_key_action", "statement_atomicity", "transaction_commit_rollback", "isolation_schedule"];
for (let i = 0; i < 50_000; i += 1) {
  const family = mutationFamilies[i % mutationFamilies.length];
  const question = en.generateQuestion(family, 1 + i % 5, i + 1);
  if (!en.checkQuestion(question.canonicalAnswer, question).correct) fail("mutation canonical", [family, i]);
  if (question.metadata.dialectVersion !== "PracticeSQL-1") fail("mutation model", [family, i]);
}
let sawSnapshotConflict = false;
for (let seed = 1; seed <= 1_000; seed += 1) {
  const question = en.generateQuestion("isolation_schedule", 5, seed);
  const source = question.prompt.blocks.map((block) => block.text || "").join("\n");
  if (source.includes("T1 writes x and tries to commit")) {
    sawSnapshotConflict = true;
    if (!question.expectedText.includes("T1 aborts")) fail("snapshot later-writer conflict", [seed, question.expectedText]);
  }
}
if (!sawSnapshotConflict) fail("snapshot conflict coverage", []);

const closureRef = (start, fds) => {
  const out = new Set(start);
  for (let changed = true; changed;) {
    changed = false;
    for (const [lhs, rhs] of fds) if (lhs.every((x) => out.has(x))) for (const x of rhs) if (!out.has(x)) { out.add(x); changed = true; }
  }
  return [...out].sort();
};
for (let i = 0; i < 25_000; i += 1) {
  const attrs = ["A", "B", "C", "D", "E"];
  const fds = attrs.slice(0, 4).map((x, j) => [[x], [attrs[(j + 1 + i % 2) % attrs.length]]]);
  const start = [attrs[i % attrs.length]];
  if (o.closure(start, fds).join() !== closureRef(start, fds).join()) fail("FD closure", [i]);
}

const prefixRef = (columns, predicates) => {
  let used = 0, stopped = false;
  for (const column of columns) {
    const predicate = predicates[column];
    if (!predicate || stopped) break;
    used += 1;
    if (predicate === "range") stopped = true;
  }
  return used;
};
for (let i = 0; i < 25_000; i += 1) {
  const predicates = {};
  if (i & 1) predicates.a = "eq";
  if (i & 2) predicates.b = i & 4 ? "range" : "eq";
  if (i & 8) predicates.c = "eq";
  if (o.indexPrefix(["a", "b", "c"], predicates) !== prefixRef(["a", "b", "c"], predicates)) fail("index prefix", [i]);
}

let generated = 0;
for (let familyIndex = 0; familyIndex < en.families.length; familyIndex += 1) {
  const family = en.families[familyIndex];
  const svFamily = sv.families[familyIndex];
  if (family.id !== svFamily.id || family.title === svFamily.title) fail("locale family parity", [family.id]);
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 100; sample += 1) {
      const seed = ((familyIndex + 1) * 1_000_000 + level * 10_000 + sample + 1) >>> 0;
      const enQuestion = en.generateQuestion(family.id, level, seed);
      const svQuestion = sv.generateQuestion(family.id, level, seed);
      if (JSON.stringify(enQuestion.canonicalAnswer) !== JSON.stringify(svQuestion.canonicalAnswer)) fail("locale answer parity", [family.id, level, seed]);
      if (!en.checkQuestion(enQuestion.canonicalAnswer, enQuestion).correct || !sv.checkQuestion(svQuestion.canonicalAnswer, svQuestion).correct) fail("canonical answer", [family.id, level, seed]);
      signatures.add(enQuestion.structuralSignature);
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`SQL extended validation passed: 100,000 scalar/3VL cases, 100,000 bag/order cases, 100,000 joins, 50,000 aggregates, 50,000 subquery/set cases, 50,000 mutation/transaction questions, 25,000 FD cases, 25,000 index cases, and ${generated.toLocaleString("en-US")} bilingual generated questions.`);
