import vm from "node:vm";

const locale = (await import("./locales/en.mjs")).default;
const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
  .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
const context = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(source, context);

const app = context.window.LogicPractice;
if (!app || app.modelId !== "classical-logic-finite-v1") throw new Error("Logic app/oracle model missing");
const o = app.oracles;
const c = app.constructors;
function fail(label, details = []) { throw new Error(`${label}: ${details.join(", ")}`); }

function referenceEval(node, env) {
  switch (node.op) {
    case "atom": return Boolean(env[node.name]);
    case "not": return !referenceEval(node.a, env);
    case "and": return referenceEval(node.a, env) && referenceEval(node.b, env);
    case "or": return referenceEval(node.a, env) || referenceEval(node.b, env);
    case "imp": return !referenceEval(node.a, env) || referenceEval(node.b, env);
    case "iff": return referenceEval(node.a, env) === referenceEval(node.b, env);
    default: throw new Error(`Unknown proposition node ${node.op}`);
  }
}

const P = c.atom("P"), Q = c.atom("Q");
let formulas = [P, Q, c.not(P), c.not(Q)];
const binary = [c.and, c.or, c.imp, c.iff];
for (let depth = 0; depth < 2; depth += 1) {
  const prior = formulas.slice();
  for (const a of prior) for (const b of prior) for (const make of binary) formulas.push(make(a, b));
  formulas = formulas.slice(0, 600);
}
for (const formula of formulas) {
  for (const env of [{ P: false, Q: false }, { P: false, Q: true }, { P: true, Q: false }, { P: true, Q: true }]) {
    const got = o.propEval(formula, env), expected = referenceEval(formula, env);
    if (got !== expected) fail("independent proposition evaluation", [o.propText(formula), JSON.stringify(env)]);
  }
  const rendered = o.propText(formula), parsed = o.parseFormula(rendered);
  if (!parsed || !o.equivalent(formula, parsed)) fail("formula render/parse round trip", [rendered]);
}

for (const left of formulas.slice(0, 120)) for (const right of formulas.slice(0, 120)) {
  const rows = [{ P: false, Q: false }, { P: false, Q: true }, { P: true, Q: false }, { P: true, Q: true }];
  const expected = rows.every((env) => referenceEval(left, env) === referenceEval(right, env));
  if (o.equivalent(left, right) !== expected) fail("independent equivalence", [o.propText(left), o.propText(right)]);
}

const parserLandmarks = [
  ["!P | Q", c.or(c.not(P), Q)],
  ["P -> Q", c.imp(P, Q)],
  ["P iff Q", c.iff(P, Q)],
  ["not (P and Q)", c.not(c.and(P, Q))],
];
for (const [text, target] of parserLandmarks) {
  const parsed = o.parseFormula(text);
  if (!parsed || !o.equivalent(parsed, target)) fail("parser alias", [text]);
}
for (const bad of ["", "P Q", "P v Q", "P ->", "(P and Q", "P nonsense Q"]) if (o.parseFormula(bad)) fail("malformed parser accepted", [bad]);

for (let size = 1; size <= 4; size += 1) {
  const domain = Array.from({ length: size }, (_, index) => String.fromCharCode(97 + index));
  for (let mask = 0; mask < (1 << size); mask += 1) {
    const extension = domain.filter((_, index) => mask & (1 << index));
    const model = { domain, constants: {}, predicates: { P: extension } };
    const exists = c.some("x", c.pred("P", "x")), every = c.all("x", c.pred("P", "x"));
    if (o.folEval(exists, model) !== (extension.length > 0)) fail("existential finite model", [size, mask]);
    if (o.folEval(every, model) !== (extension.length === size)) fail("universal finite model", [size, mask]);
  }
}

for (let size = 1; size <= 3; size += 1) {
  const domain = Array.from({ length: size }, (_, index) => String.fromCharCode(97 + index));
  const pairCount = size * size;
  for (let mask = 0; mask < (1 << pairCount); mask += 1) {
    const pairs = [];
    for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) if (mask & (1 << (x * size + y))) pairs.push([domain[x], domain[y]]);
    const model = { domain, constants: {}, predicates: { R: pairs } };
    const eachHasSome = c.all("x", c.some("y", c.rel("R", "x", "y")));
    const oneForAll = c.some("y", c.all("x", c.rel("R", "x", "y")));
    const refEach = domain.every((x) => domain.some((y) => pairs.some(([a, b]) => a === x && b === y)));
    const refOne = domain.some((y) => domain.every((x) => pairs.some(([a, b]) => a === x && b === y)));
    if (o.folEval(eachHasSome, model) !== refEach || o.folEval(oneForAll, model) !== refOne) fail("binary relation enumeration", [size, mask]);
  }
}

let generated = 0;
function isPropositional(node) {
  if (!node || typeof node !== "object") return false;
  if (node.op === "atom") return true;
  if (node.op === "not") return isPropositional(node.a);
  return ["and", "or", "imp", "iff"].includes(node.op) && isPropositional(node.a) && isPropositional(node.b);
}
for (let familyIndex = 0; familyIndex < app.families.length; familyIndex += 1) {
  const family = app.families[familyIndex];
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 10_000; sample += 1) {
      const seed = ((familyIndex + 1) * 10_000_000 + level * 100_000 + sample + 1) >>> 0;
      const question = app.generateQuestion(family.id, level, seed);
      if (!app.checkQuestion(question.canonicalAnswer, question).correct) fail("canonical answer", [family.id, level, seed]);
      if (isPropositional(question.metadata.formulaAst)) {
        const vars = ["P", "Q", "R", "S"];
        for (let mask = 0; mask < 16; mask += 1) {
          const env = Object.fromEntries(vars.map((name, index) => [name, Boolean(mask & (1 << index))]));
          if (o.propEval(question.metadata.formulaAst, env) !== referenceEval(question.metadata.formulaAst, env)) fail("generated formula oracle", [family.id, level, seed]);
        }
      }
      if (question.metadata.premiseAsts && question.metadata.conclusionAst) {
        const counters = o.argumentCountermodels(question.metadata.premiseAsts, question.metadata.conclusionAst);
        for (const env of counters) {
          if (!question.metadata.premiseAsts.every((premise) => referenceEval(premise, env)) || referenceEval(question.metadata.conclusionAst, env)) fail("generated countermodel", [family.id, level, seed]);
        }
      }
      if (question.metadata.proofState && question.metadata.proofState.lines && !o.validateProof(question.metadata.proofState.lines)) fail("scope-aware proof validation", [family.id, level, seed]);
      signatures.add(question.structuralSignature);
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}

console.log(`Logic extended validation passed: ${formulas.length} proposition ASTs, independent equivalence checks, exhaustive unary domains through size 4, exhaustive binary relations through size 3, and ${generated.toLocaleString("en-US")} generated questions`);
