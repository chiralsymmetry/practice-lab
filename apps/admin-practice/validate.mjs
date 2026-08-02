import vm from "node:vm";

async function loadApp(localeCode) {
  const locale = (await import(`./locales/${localeCode}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
    .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = { window: {}, document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.AdminPracticeApp;
}

const en = await loadApp("en");
const sv = await loadApp("sv");
const failures = [];
const fail = (name, data) => { if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`); };
const o = en.oracles;

function pathRef(cwd, path) {
  const out = [];
  for (const part of `${path.startsWith("/") ? "" : cwd}/${path}`.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop(); else out.push(part);
  }
  return `/${out.join("/")}`;
}
for (let i = 0; i < 100_000; i += 1) {
  const cwd = `/a${i % 7}/b${i % 11}/c`;
  const parts = Array.from({ length: 2 + i % 9 }, (_, j) => (i + j) % 5 === 0 ? ".." : (i + j) % 7 === 0 ? "." : `x${(i * 13 + j) % 17}`);
  const path = `${i % 3 === 0 ? "/" : ""}${parts.join(i % 2 ? "/" : "//")}`;
  if (o.lexicalPath(cwd, path) !== pathRef(cwd, path)) fail("lexical path", [cwd, path]);
}

for (let mode = 0; mode < 4096; mode += 1) {
  const text = o.modeSymbolic(mode);
  if (!/^[rwxstST-]{9}$/.test(text) || o.symbolicMode(text) !== mode) fail("permission round trip", [mode, text]);
}

function pipelineRef(statuses, pipefail) {
  if (!pipefail) return statuses.at(-1);
  return statuses.toReversed().find((status) => status !== 0) ?? 0;
}
for (let i = 0; i < 100_000; i += 1) {
  const statuses = Array.from({ length: 2 + i % 6 }, (_, j) => (i * 17 + j * 7) % 5 === 0 ? 0 : (i + j) % 9);
  for (const pipefail of [false, true]) if (o.pipelineStatus(statuses, pipefail) !== pipelineRef(statuses, pipefail)) fail("pipeline status", [statuses, pipefail]);
}

for (let i = 0; i < 100_000; i += 1) {
  const value = (Math.imul(i, 2654435761) + 0x9e3779b9) >>> 0;
  const ip = o.intToIp(value);
  if (o.ipToInt(ip) !== value) fail("IPv4 round trip", [value, ip]);
  const prefix = i % 33, size = 2 ** (32 - prefix), expectedNetwork = prefix === 0 ? 0 : Math.floor(value / size) * size;
  const got = o.cidr(ip, prefix);
  if (o.ipToInt(got.network) !== (expectedNetwork >>> 0) || o.ipToInt(got.broadcast) !== ((expectedNetwork + size - 1) >>> 0)) fail("CIDR range", [ip, prefix, got]);
  const candidate = o.intToIp((value ^ 0x0000ffff) >>> 0);
  const expectedMember = prefix === 0 || Math.floor(o.ipToInt(candidate) / size) === Math.floor(value / size);
  if (o.inSubnet(candidate, ip, prefix) !== expectedMember) fail("CIDR membership", [ip, candidate, prefix]);
}

for (let i = 0; i < 50_000; i += 1) {
  const destination = `10.${i % 256}.${(i * 7) % 256}.${(i * 11) % 256}`;
  const routes = [
    { id: "default", network: "0.0.0.0", prefix: 0, metric: 100 },
    { id: "private", network: "10.0.0.0", prefix: 8, metric: 10 },
    { id: "site-a", network: `10.${i % 256}.0.0`, prefix: 16, metric: 30 },
    { id: "site-b", network: `10.${i % 256}.0.0`, prefix: 16, metric: 20 },
  ];
  const matching = routes.filter((route) => o.inSubnet(destination, route.network, route.prefix));
  matching.sort((a, b) => b.prefix - a.prefix || a.metric - b.metric);
  if (o.chooseRoute(routes, destination).id !== matching[0].id) fail("route selection", [destination]);
}

let generated = 0;
for (let familyIndex = 0; familyIndex < en.families.length; familyIndex += 1) {
  const family = en.families[familyIndex];
  const svFamily = sv.families[familyIndex];
  if (family.id !== svFamily.id || family.title === svFamily.title) fail("locale family parity", [family.id]);
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 10_000; sample += 1) {
      const seed = ((familyIndex + 1) * 10_000_000 + level * 100_000 + sample + 1) >>> 0;
      const question = en.generateQuestion(family.id, level, seed);
      if (!en.checkQuestion(question.canonicalAnswer, question).correct) fail("canonical answer", [family.id, level, seed]);
      if (question.metadata.dialectVersion !== "bash-gnu-v1" || question.metadata.virtualState.realExecution !== false) fail("model metadata", [family.id, level, seed]);
      signatures.add(question.structuralSignature);
      if (sample < 50) {
        const translated = sv.generateQuestion(family.id, level, seed);
        if (JSON.stringify(question.canonicalAnswer) !== JSON.stringify(translated.canonicalAnswer)) fail("locale answer parity", [family.id, level, seed]);
        if (!sv.checkQuestion(translated.canonicalAnswer, translated).correct) fail("Swedish canonical answer", [family.id, level, seed]);
        const visible = [translated.prompt.title, translated.explanation, ...translated.prompt.blocks.map((block) => block.text || block.caption || "")].join("\n");
        if (/\b(?:cwd|entries|component statuses|empty input|exactly three lowercase|file may|filenames may|requested|directory mode|operation:|create needs|processes|destination|candidates|routes:|request:|unauthenticated)\b/i.test(visible)) fail("Swedish generated prose leak", [family.id, level, seed, visible]);
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
console.log(`Administration extended validation passed: 354,096 independent oracle/property cases and ${generated.toLocaleString("en-US")} generated questions (10,000 per family and level), with bilingual seed parity.`);
