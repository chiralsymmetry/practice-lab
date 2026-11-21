import vm from "node:vm";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

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

// Independent references for the models that cannot be replayed against real tools.
function classOf(identity, obj) { return identity.uid === obj.uid ? 6 : identity.gids.includes(obj.gid) ? 3 : 0; }
function bits(identity, obj) { return (obj.mode >> classOf(identity, obj)) & 7; }
function dirRef({ identity, anc, dir, file, op }) {
  if (!(bits(identity, anc) & 1)) return "ancX";
  if (op === "list") return bits(identity, dir) & 4 ? "ok" : "dirR";
  if (!(bits(identity, dir) & 1)) return "dirX";
  if (op === "read") return bits(identity, file) & 4 ? "ok" : "fileR";
  if (!(bits(identity, dir) & 2)) return "dirW";
  if (op === "remove" && (dir.mode & 0o1000) && identity.uid !== file.uid && identity.uid !== dir.uid) return "sticky";
  return "ok";
}
function storageRef({ blocks, inodes, existing, ops }) {
  const names = new Map(), objs = [];
  for (const [name, b] of existing) { const o = { blocks: b, links: 1 }; objs.push(o); names.set(name, o); }
  let free = blocks, freeI = inodes; const failed = [];
  ops.forEach(([kind, a, b], i) => {
    const fail = () => failed.push(i + 1);
    if (kind === "create") { if (names.has(a) || free < b || freeI < 1) return fail(); free -= b; freeI -= 1; names.set(a, { blocks: b, links: 1 }); }
    else if (kind === "append") { const o = names.get(a); if (!o || free < b) return fail(); free -= b; o.blocks += b; }
    else if (kind === "ln") { const o = names.get(a); if (!o || names.has(b)) return fail(); names.set(b, o); o.links += 1; }
    else if (kind === "rm") { const o = names.get(a); if (!o) return fail(); names.delete(a); if (--o.links === 0) { free += o.blocks; freeI += 1; } }
  });
  return { blocks: free, inodes: freeI, failed };
}
function dnsRef({ recs, cache, q }) {
  const src = cache.concat(recs), seen = new Set([q]), chain = [q]; let cur = q;
  for (;;) {
    const hit = src.find(([n, t]) => n === cur && (t === "A" || t === "CNAME"));
    if (!hit) return { chain, end: src.some(([n]) => n === cur) ? "nodata" : "nx" };
    if (hit[1] === "A") return { chain, end: hit[2] };
    cur = hit[2]; if (seen.has(cur)) return { chain: chain.concat([cur]), end: "loop" }; seen.add(cur); chain.push(cur);
  }
}
function httpRef({ routes, method, path, token }) {
  const segs = path.split("/"), hits = routes.filter((r) => { const a = r.path.split("/"); return a.length === segs.length && a.every((x, i) => x === "{id}" ? /^[0-9]+$/.test(segs[i]) : x === segs[i]); });
  if (!hits.length) return { status: 404, route: "none" };
  const h = hits.find((r) => r.methods.includes(method));
  if (!h) return { status: 405, route: "none" };
  return h.auth && !token ? { status: 401, route: h.id } : { status: h.status, route: h.id };
}
function socketRef({ listeners, proto, addr, port }) {
  const h = listeners.find((l) => l.proto === proto && l.port === port && (l.addr === "0.0.0.0" || l.addr === addr));
  return h ? h.id : null;
}
let referenceCases = 0;
for (const family of en.families) for (let level = 1; level <= 5; level += 1) for (let sample = 0; sample < 2000; sample += 1) {
  const seed = (level * 7_000_003 + sample * 104_729 + 17) >>> 0, q = en.generateQuestion(family.id, level, seed), m = q.metadata;
  if (m.access) { const { identity, inode, op } = m.access, ops = op === "all" ? ["read", "write", "execute"] : [op], cls = classOf(identity, inode), clsName = cls === 6 ? "owner" : cls === 3 ? "group" : "other";
    if (q.canonicalAnswer.class !== clsName) fail("file access class", [family.id, level, seed]);
    for (const o of ops) { const bit = o === "read" ? 4 : o === "write" ? 2 : 1, want = (inode.mode >> cls) & bit ? "allowed" : "denied", got = op === "all" ? q.canonicalAnswer[o] : q.canonicalAnswer.result; if (got !== want) fail("file access decision", [family.id, level, seed, o]); }
    referenceCases += 1; }
  if (m.dirAccess) { if (dirRef(m.dirAccess) !== m.dirAccess.why) fail("directory access reference", [level, seed]); referenceCases += 1; }
  if (m.storage && m.storage.result) { const ref = storageRef(m.storage); if (JSON.stringify(ref) !== JSON.stringify(m.storage.result)) fail("storage reference", [level, seed, ref, m.storage.result]); if (q.canonicalAnswer.blocks !== undefined && (Number(q.canonicalAnswer.blocks) !== ref.blocks || Number(q.canonicalAnswer.inodes) !== ref.inodes)) fail("storage answer fields", [level, seed]); referenceCases += 1; }
  if (m.dns) { const ref = dnsRef(m.dns); if (ref.end !== m.dns.end || ref.chain.join() !== m.dns.chain.join()) fail("DNS reference", [level, seed]); referenceCases += 1; }
  if (m.http) { const ref = httpRef(m.http); if (ref.status !== m.http.status || ref.route !== m.http.route || Number(q.canonicalAnswer.answer) !== ref.status) fail("HTTP reference", [level, seed, ref]); referenceCases += 1; }
  if (m.socket) { if (socketRef(m.socket) !== m.socket.hit) fail("socket reference", [level, seed]); referenceCases += 1; }
}

// Replay every shell-model question against the real GNU tools (bash, coreutils, grep, sed, gawk, findutils).
function gnuToolsAvailable() {
  const p = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "bash", "-c", "grep --version; sed --version; find --version; xargs --version; realpath --version; awk --version"], { stdout: "pipe", stderr: "pipe" });
  const out = p.stdout.toString();
  return p.exitCode === 0 && /GNU grep/.test(out) && /GNU sed/.test(out) && /GNU findutils/.test(out) && /coreutils/.test(out) && /GNU Awk/.test(out);
}
let replayed = 0, replayNote = "";
if (gnuToolsAvailable()) {
  const cases = [];
  en.families.forEach((family, fi) => { for (let level = 1; level <= 5; level += 1) for (let sample = 0; sample < 60; sample += 1) {
    const seed = ((fi + 1) * 1_000_003 + level * 7919 + sample * 104_729) >>> 0, q = en.generateQuestion(family.id, level, seed);
    if (q.metadata.replay) cases.push({ id: family.id, level, seed, replay: q.metadata.replay });
  } });
  const base = mkdtempSync(join(tmpdir(), "admin-replay-"));
  try {
    let runner = "";
    cases.forEach(({ replay: rp }, i) => {
      const dir = join(base, "c" + i); mkdirSync(dir);
      (rp.dirs || []).forEach((d) => mkdirSync(join(dir, d), { recursive: true }));
      Object.entries(rp.files || {}).forEach(([p, content]) => { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), content); });
      (rp.links || []).forEach(([p, target]) => { mkdirSync(dirname(join(dir, p)), { recursive: true }); symlinkSync(target.startsWith("/") ? join(dir, "root") + target : target, join(dir, p)); });
      writeFileSync(join(base, "s" + i + ".sh"), rp.script + "\n");
      runner += `(cd "${base}/c${i}" && . "${base}/s${i}.sh") >"${base}/o${i}" 2>/dev/null </dev/null\n`;
    });
    writeFileSync(join(base, "runner.sh"), runner);
    const run = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "LC_ALL=C", "HOME=/nonexistent", "bash", "--norc", "--noprofile", join(base, "runner.sh")], { stdout: "pipe", stderr: "pipe", timeout: 600_000 });
    if (run.exitCode === null) fail("GNU replay", ["runner timed out"]);
    cases.forEach((c, i) => { const got = existsSync(join(base, "o" + i)) ? readFileSync(join(base, "o" + i), "utf8") : null; if (got !== c.replay.expect) fail("GNU replay", [c.id, c.level, c.seed, c.replay.script, c.replay.expect, got]); });
    replayed = cases.length;
  } finally { rmSync(base, { recursive: true, force: true }); }
} else replayNote = " GNU tool replay skipped: GNU bash/coreutils/grep/sed/gawk/findutils not found on PATH=/usr/bin:/bin.";

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
// Choice-position bias: the correct option must not sit in a predictable position.
{
  let choiceFields = 0, firstPosition = 0;
  for (const family of en.families) for (let level = 1; level <= 5; level += 1) for (let sample = 1; sample <= 40; sample += 1) {
    const question = en.generateQuestion(family.id, level, sample * 7919 + level);
    for (const field of question.fields) if (field.kind === "choice" && field.options.length >= 3) {
      choiceFields += 1;
      if (field.options[0].value === field.answer) firstPosition += 1;
    }
  }
  if (!choiceFields || firstPosition / choiceFields > 0.45) throw new Error(`Choice-position bias: correct option first in ${firstPosition}/${choiceFields}`);
}
console.log(`Administration extended validation passed: 354,096 independent oracle/property cases, ${referenceCases.toLocaleString("en-US")} independent model-reference checks, ${replayed.toLocaleString("en-US")} questions replayed against real GNU tools, and ${generated.toLocaleString("en-US")} generated questions (10,000 per family and level), with bilingual seed parity.${replayNote}`);
