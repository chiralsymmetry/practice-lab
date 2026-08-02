import vm from "node:vm";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function loadApp(localeCode) {
  const locale = (await import(`./locales/${localeCode}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text()).replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = { window: {}, document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.AssemblyAmd64Practice;
}

const en = await loadApp("en");
const sv = await loadApp("sv");
const o = en.oracles;
const failures = [];
const fail = (name, data) => { if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

if (en.modelId !== "amd64-long-sysv-v1" || en.families.length !== 33) fail("model registration", [en.modelId, en.families.length]);

function parityReference(value) {
  value = BigInt(value) & 0xFFn;
  let bits = 0;
  for (let i = 0; i < 8; i += 1) bits += Number((value >> BigInt(i)) & 1n);
  return bits % 2 === 0 ? 1 : 0;
}
function addReference(a, b, carry, width) {
  const modulus = 1n << BigInt(width), mask = modulus - 1n, sign = 1n << BigInt(width - 1);
  a = BigInt(a) & mask; b = BigInt(b) & mask;
  const total = a + b + BigInt(carry), result = total & mask;
  return { result, CF: total >= modulus ? 1 : 0, PF: parityReference(result), AF: ((a & 15n) + (b & 15n) + BigInt(carry)) > 15n ? 1 : 0, ZF: result === 0n ? 1 : 0, SF: (result & sign) !== 0n ? 1 : 0, OF: ((~(a ^ b) & (a ^ result) & sign) !== 0n) ? 1 : 0 };
}
function subReference(a, b, borrow, width) {
  const modulus = 1n << BigInt(width), mask = modulus - 1n, sign = 1n << BigInt(width - 1);
  a = BigInt(a) & mask; b = BigInt(b) & mask;
  const exact = a - b - BigInt(borrow), result = ((exact % modulus) + modulus) % modulus;
  return { result, CF: exact < 0n ? 1 : 0, PF: parityReference(result), AF: ((a ^ b ^ result) & 16n) !== 0n ? 1 : 0, ZF: result === 0n ? 1 : 0, SF: (result & sign) !== 0n ? 1 : 0, OF: (((a ^ b) & (a ^ result) & sign) !== 0n) ? 1 : 0 };
}

let arithmeticCases = 0;
for (let a = 0; a < 256; a += 1) {
  for (let b = 0; b < 256; b += 1) {
    for (let carry = 0; carry < 2; carry += 1) {
      const addExpected = addReference(a, b, carry, 8), addGot = o.addOp(a, b, carry, 8);
      const subExpected = subReference(a, b, carry, 8), subGot = o.subOp(a, b, carry, 8);
      for (const key of ["result", "CF", "PF", "AF", "ZF", "SF", "OF"]) {
        if (addGot[key] !== addExpected[key]) fail("ADD/ADC 8", [a, b, carry, key, addGot[key], addExpected[key]]);
        if (subGot[key] !== subExpected[key]) fail("SUB/SBB 8", [a, b, carry, key, subGot[key], subExpected[key]]);
      }
      arithmeticCases += 2;
    }
  }
}
for (let i = 0; i < 400_000; i += 1) {
  const width = [16, 32, 64][i % 3];
  const a = (BigInt(Math.imul(i + 1, 2654435761) >>> 0) << 32n) | BigInt(Math.imul(i + 7, 2246822519) >>> 0);
  const b = (BigInt(Math.imul(i + 11, 3266489917) >>> 0) << 32n) | BigInt(Math.imul(i + 13, 668265263) >>> 0);
  const carry = i & 1;
  const addExpected = addReference(a, b, carry, width), addGot = o.addOp(a, b, carry, width);
  const subExpected = subReference(a, b, carry, width), subGot = o.subOp(a, b, carry, width);
  if (!same(Object.fromEntries(Object.keys(addExpected).map((key) => [key, String(addGot[key])])), Object.fromEntries(Object.keys(addExpected).map((key) => [key, String(addExpected[key])])))) fail("wide add", [i, width]);
  if (!same(Object.fromEntries(Object.keys(subExpected).map((key) => [key, String(subGot[key])])), Object.fromEntries(Object.keys(subExpected).map((key) => [key, String(subExpected[key])])))) fail("wide sub", [i, width]);
  arithmeticCases += 2;
}

const aliases = ["RAX", "EAX", "AX", "AL", "AH", "RSI", "ESI", "SI", "SIL", "RSP", "ESP", "SP", "SPL", "R8", "R8D", "R8W", "R8B", "R15D", "R15W", "R15B"];
for (let i = 0; i < 100_000; i += 1) {
  const name = aliases[i % aliases.length], info = o.aliasInfo(name), parent = (BigInt(i * 0x9e37) << 32n) | BigInt(Math.imul(i, 2654435761) >>> 0), value = BigInt(Math.imul(i + 3, 2246822519) >>> 0), result = o.writeAlias(parent, name, value);
  const widthMask = (1n << BigInt(info.width)) - 1n;
  const expected = info.width === 64 ? value & widthMask : info.zeroUpper ? value & widthMask : (parent & ~((widthMask) << BigInt(info.offset))) | ((value & widthMask) << BigInt(info.offset));
  if (result !== BigInt.asUintN(64, expected)) fail("register slice", [name, parent.toString(), value.toString(), result.toString(), expected.toString()]);
}

for (let i = 0; i < 100_000; i += 1) {
  const width = [8, 16, 32, 64][i % 4], value = (BigInt(Math.imul(i + 5, 2654435761) >>> 0) << 32n) | BigInt(Math.imul(i + 9, 2246822519) >>> 0), bytes = o.bytesOf(value, width), roundTrip = o.valueOfBytes(bytes);
  if (roundTrip !== BigInt.asUintN(width, value) || bytes.length !== width / 8) fail("endian round trip", [i, width, bytes]);
}

for (let i = 0; i < 100_000; i += 1) {
  const base = (BigInt(i) << 24n) + 0x1000n, index = BigInt(Math.imul(i + 1, 40503) >>> 0), scale = [1, 2, 4, 8][i % 4], displacement = BigInt((i % 8193) - 4096), expected = BigInt.asUintN(64, base + index * BigInt(scale) + displacement);
  if (o.effectiveAddress(base, index, scale, displacement) !== expected || o.relativeTarget(base, displacement) !== BigInt.asUintN(64, base + displacement)) fail("address arithmetic", [i, base.toString(), index.toString(), scale, displacement.toString()]);
}

function conditionReference(name, f) {
  const rules = {
    JE: f.ZF === 1, JZ: f.ZF === 1, JNE: f.ZF === 0, JNZ: f.ZF === 0, JB: f.CF === 1, JC: f.CF === 1, JNAE: f.CF === 1,
    JBE: f.CF === 1 || f.ZF === 1, JA: f.CF === 0 && f.ZF === 0, JAE: f.CF === 0, JNC: f.CF === 0,
    JL: f.SF !== f.OF, JLE: f.ZF === 1 || f.SF !== f.OF, JG: f.ZF === 0 && f.SF === f.OF, JGE: f.SF === f.OF,
    JS: f.SF === 1, JNS: f.SF === 0, JP: f.PF === 1, JNP: f.PF === 0, JO: f.OF === 1, JNO: f.OF === 0,
  };
  return rules[name];
}
const conditionNames = ["JE", "JZ", "JNE", "JNZ", "JB", "JC", "JNAE", "JBE", "JA", "JAE", "JNC", "JL", "JLE", "JG", "JGE", "JS", "JNS", "JP", "JNP", "JO", "JNO"];
for (const name of conditionNames) for (let bits = 0; bits < 32; bits += 1) {
  const flags = { CF: bits & 1 ? 1 : 0, PF: bits & 2 ? 1 : 0, ZF: bits & 4 ? 1 : 0, SF: bits & 8 ? 1 : 0, OF: bits & 16 ? 1 : 0 };
  if (o.conditionValue(name, flags) !== conditionReference(name, flags)) fail("Jcc truth table", [name, flags]);
}
if (o.conditionValue("JZ", { ZF: "?" }) !== null || o.conditionValue("JC", { CF: 0, AF: "?" }) !== false) fail("undefined flag dependency", null);

for (let i = 0; i < 100_000; i += 1) {
  const width = [16, 32, 64][i % 3], a = BigInt.asUintN(width, BigInt((i % 200001) - 100000)), b = BigInt.asUintN(width, BigInt(((i * 17) % 200001) - 100000)), output = o.imulTwo(a, b, width);
  const full = BigInt.asIntN(width, a) * BigInt.asIntN(width, b), result = BigInt.asUintN(width, full), fits = BigInt.asIntN(width, result) === full;
  if (output.result !== result || output.CF !== (fits ? 0 : 1) || output.OF !== (fits ? 0 : 1)) fail("IMUL", [i, width, a.toString(), b.toString()]);
}

const assembler = Bun.which("as"), objcopy = Bun.which("objcopy");
if (!assembler || !objcopy) fail("assembler fixtures", "GNU as and objcopy are required");
else {
  const directory = mkdtempSync(join(tmpdir(), "practice-lab-amd64-"));
  try {
    for (let index = 0; index < en.fixtures.length; index += 1) {
      const fixture = en.fixtures[index], intelSource = `.text\n.intel_syntax noprefix\n.globl fixture\nfixture:\n  ${fixture.intel}\n`, attSource = `.text\n.att_syntax\n.globl fixture\nfixture:\n  ${fixture.att}\n`;
      const intelAsm = join(directory, `intel-${index}.s`), attAsm = join(directory, `att-${index}.s`), intelObject = join(directory, `intel-${index}.o`), attObject = join(directory, `att-${index}.o`), intelBinary = join(directory, `intel-${index}.bin`), attBinary = join(directory, `att-${index}.bin`);
      writeFileSync(intelAsm, intelSource); writeFileSync(attAsm, attSource);
      const intelBuild = Bun.spawnSync([assembler, "--64", intelAsm, "-o", intelObject]), attBuild = Bun.spawnSync([assembler, "--64", attAsm, "-o", attObject]);
      if (intelBuild.exitCode || attBuild.exitCode) { fail("assembler syntax", [fixture, intelBuild.stderr.toString(), attBuild.stderr.toString()]); continue; }
      Bun.spawnSync([objcopy, "-O", "binary", "--only-section=.text", intelObject, intelBinary]); Bun.spawnSync([objcopy, "-O", "binary", "--only-section=.text", attObject, attBinary]);
      if (!readFileSync(intelBinary).equals(readFileSync(attBinary))) fail("syntax semantic bytes", fixture);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

const proseLeak = /\b(?:no restore|ordinary function entry|value live across|before call|callee entry|stack delta|nested call|load width|store width|branch if|signed less|signed greater|unsigned below|unsigned above|memory reads|final state)\b/i;
let generated = 0;
for (let familyIndex = 0; familyIndex < en.families.length; familyIndex += 1) {
  const family = en.families[familyIndex];
  if (sv.families[familyIndex]?.id !== family.id) fail("locale family identity", family.id);
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 10_000; sample += 1) {
      const seed = ((familyIndex + 1) * 100_000_000 + level * 10_000 + sample + 1) >>> 0;
      const question = en.generateQuestion(family.id, level, seed, true);
      if (!en.checkQuestion(question.canonicalAnswer, question).correct) fail("canonical answer", [family.id, level, seed]);
      if (en.checkQuestion({}, question).correct) fail("empty answer accepted", [family.id, level, seed]);
      if (question.modelId !== en.modelId || question.metadata.architecture !== "AMD64 long mode" || question.metadata.abi !== "System V AMD64" || question.metadata.syntheticState.nativeExecution !== false) fail("question metadata", [family.id, level, seed]);
      for (const field of question.fields) if (field.options) {
        const values = field.options.map((option) => option.value), labels = field.options.map((option) => option.label);
        if (new Set(values).size !== values.length || new Set(labels).size !== labels.length || values.filter((value) => value === field.answer).length !== 1) fail("choice uniqueness", [family.id, level, seed]);
      }
      signatures.add(question.structuralSignature);
      if (sample < 50) {
        const translated = sv.generateQuestion(family.id, level, seed, true);
        if (!same(question.canonicalAnswer, translated.canonicalAnswer) || !sv.checkQuestion(translated.canonicalAnswer, translated).correct) fail("locale answer parity", [family.id, level, seed]);
        const visible = [translated.prompt.title, translated.prompt.note, translated.explanation, ...translated.prompt.rows, ...translated.fields.flatMap((field) => (field.options || []).map((option) => option.label))].join("\n");
        if (proseLeak.test(visible)) fail("Swedish generated prose", [family.id, level, seed, visible]);
      }
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`AMD64 extended validation passed: ${arithmeticCases.toLocaleString("en-US")} independently checked ALU cases, 400,000 register/endian/address/IMUL properties, exhaustive Jcc tables, GNU assembler translation fixtures, and ${generated.toLocaleString("en-US")} generated questions (10,000 per family and level) with bilingual parity.`);
