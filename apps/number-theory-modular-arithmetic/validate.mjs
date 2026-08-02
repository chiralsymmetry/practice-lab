import vm from "node:vm";

const locale = (await import("./locales/en.mjs")).default;
const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
  .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
const context = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(source, context);

const app = context.window.NumberTheoryPractice;
if (!app || app.oracleVersion !== "number-theory-exact-v1") throw new Error("Number-theory app/oracle model missing");
const o = app.oracles;

function fail(label, values) { throw new Error(`${label}: ${values.join(", ")}`); }
function gcdRef(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  let best = 0;
  for (let d = 1; d <= Math.min(a || b, b || a); d += 1) if (a % d === 0 && b % d === 0) best = d;
  return a === 0 ? b : b === 0 ? a : best;
}
function modRef(a, m) { return ((a % m) + m) % m; }
function powRef(a, e, m) { let out = 1; for (let i = 0; i < e; i += 1) out = modRef(out * a, m); return out; }

for (let i = 0; i < 100_000; i += 1) {
  const a = (i * 7919) % 200_003 - 100_001;
  const m = (i * 97) % 997 + 1;
  const expectedQ = Math.floor(a / m), expectedR = a - expectedQ * m;
  const got = o.divmod(BigInt(a), BigInt(m));
  if (got.q !== BigInt(expectedQ) || got.r !== BigInt(expectedR)) fail("divmod", [a, m]);
  if ((a % m === 0) !== (got.r === 0n)) fail("divisibility", [a, m]);
}

for (let i = 0; i < 100_000; i += 1) {
  const a = (i * 37) % 401;
  const b = (i * 83 + 17) % 401;
  const g = gcdRef(a, b);
  if (o.gcd(BigInt(a), BigInt(b)) !== BigInt(g)) fail("gcd", [a, b]);
  const expectedLcm = a === 0 || b === 0 ? 0 : Math.abs(a * b) / g;
  if (o.lcm(BigInt(a), BigInt(b)) !== BigInt(expectedLcm)) fail("lcm", [a, b]);
  const n = BigInt((i * 43) % 10_000 + 2);
  const factors = o.factorize(n);
  let product = 1n;
  for (const [p, e] of factors) {
    if (!o.isPrime(p)) fail("composite factor", [n, p]);
    product *= p ** e;
  }
  if (product !== n) fail("factor multiply-back", [n]);
}

for (let i = 0; i < 100_000; i += 1) {
  const a = (i * 71) % 401 - 200;
  const b = (i * 109) % 401 - 200;
  const m = (i * 13) % 47 + 2;
  if (o.mod(BigInt(a + b), BigInt(m)) !== BigInt(modRef(a + b, m))) fail("mod add", [a, b, m]);
  if (o.mod(BigInt(a * b), BigInt(m)) !== BigInt(modRef(a * b, m))) fail("mod multiply", [a, b, m]);
  const e = i % 19;
  if (o.powmod(BigInt(a), BigInt(e), BigInt(m)) !== BigInt(powRef(a, e, m))) fail("powmod", [a, e, m]);
}

for (let i = 0; i < 50_000; i += 1) {
  const n = (i * 17) % 39 + 2;
  const a = (i * 31) % n;
  const b = (i * 47 + 3) % n;
  const inverse = o.inverse(BigInt(a), BigInt(n));
  let inverseRef = null;
  for (let x = 0; x < n; x += 1) if (modRef(a * x, n) === 1) { inverseRef = x; break; }
  if ((inverse === null) !== (inverseRef === null) || (inverse !== null && inverse !== BigInt(inverseRef))) fail("inverse", [a, n]);
  const solutions = [];
  for (let x = 0; x < n; x += 1) if (modRef(a * x - b, n) === 0) solutions.push(String(x));
  if (o.solveLinear(BigInt(a), BigInt(b), BigInt(n)).map(String).join(",") !== solutions.join(",")) fail("linear congruence", [a, b, n]);
}

for (let i = 0; i < 50_000; i += 1) {
  const m = (i * 7) % 17 + 2, n = (i * 11) % 19 + 2;
  const a = (i * 13) % m, b = (i * 23 + 1) % n;
  const got = o.crtMerge(BigInt(a), BigInt(m), BigInt(b), BigInt(n));
  const period = Number(o.lcm(BigInt(m), BigInt(n)));
  let brute = null;
  for (let x = 0; x < period; x += 1) if (x % m === a && x % n === b) { brute = x; break; }
  if ((got === null) !== (brute === null)) fail("CRT consistency", [a, m, b, n]);
  if (got && (got.r !== BigInt(brute) || got.m !== BigInt(period))) fail("CRT merge", [a, m, b, n]);
}

for (let i = 0; i < 50_000; i += 1) {
  const a = (i * 17) % 31 + 1, b = (i * 29) % 37 + 1, c = (i * 41) % 101 - 50;
  const eg = o.egcd(BigInt(a), BigInt(b));
  if (BigInt(a) * eg.x + BigInt(b) * eg.y !== eg.g) fail("Bézout certificate", [a, b]);
  const solvable = c % Number(eg.g) === 0;
  if (solvable) {
    const scale = BigInt(c) / eg.g, x0 = eg.x * scale, y0 = eg.y * scale;
    const dx = BigInt(b) / eg.g, dy = -BigInt(a) / eg.g;
    for (const t of [-3n, 0n, 4n]) if (BigInt(a) * (x0 + dx * t) + BigInt(b) * (y0 + dy * t) !== BigInt(c)) fail("Diophantine parameter", [a, b, c]);
  }
}

for (let i = 0; i < 25_000; i += 1) {
  const m = (i * 19) % 43 + 2, a = (i * 23) % m, e = (i * 29) % 31;
  if (o.powmod(BigInt(a), BigInt(e), BigInt(m)) !== BigInt(powRef(a, e, m))) fail("theorem power", [a, e, m]);
  let units = 0;
  for (let x = 1; x <= m; x += 1) if (gcdRef(x, m) === 1) units += 1;
  if (o.phi(BigInt(m)) !== BigInt(units)) fail("totient", [m]);
  const message = BigInt(i % 55), encrypted = o.powmod(message, 3n, 55n), decrypted = o.powmod(encrypted, 27n, 55n);
  if (decrypted !== message) fail("toy RSA round trip", [message]);
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
      signatures.add(question.structuralSignature);
      generated += 1;
    }
    if (signatures.size < 2) fail("generator variation", [family.id, level]);
  }
}

console.log(`Number theory extended validation passed: 475,000 required property cases and ${generated.toLocaleString("en-US")} generated questions`);
