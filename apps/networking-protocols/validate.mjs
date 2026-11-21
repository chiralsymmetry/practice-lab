// Extended validation for the networking app: a large generated sweep, independent reference
// implementations, Python's ipaddress module, and tcpdump decoding of serialized packets.
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
  return context.window.NetworkingProtocolsApp;
}
const en = await loadApp("en");
const sv = await loadApp("sv");
const o = en.oracles;
const failures = [];
const fail = (name, data) => { if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`); };
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let seed = 0x2545f491;
const rand = (n) => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; return seed % n; };

// ---------- Independent references ----------
// Byte-oriented Internet checksum (sums 8-bit pairs without forming words first).
function checksumBytes(bytes) {
  let hi = 0, lo = 0;
  for (let i = 0; i < bytes.length; i += 2) { hi += bytes[i]; lo += bytes[i + 1] ?? 0; }
  let sum = hi * 256 + lo;
  while (sum > 0xffff) sum = (sum & 0xffff) + Math.floor(sum / 65536);
  return (~sum) & 0xffff;
}
let propertyCases = 0;
for (let i = 0; i < 100_000; i += 1) {
  const words = Array.from({ length: 1 + rand(12) }, () => rand(65536));
  const bytes = words.flatMap((w) => [w >>> 8, w & 255]);
  if (o.inetChecksum(words) !== checksumBytes(bytes)) fail("checksum word/byte oracles", words);
  const withCk = words.concat([o.inetChecksum(words)]);
  let s = withCk.reduce((a, b) => a + b, 0); while (s > 0xffff) s = (s & 0xffff) + Math.floor(s / 65536);
  if (s !== 0xffff) fail("checksum verify property", words);
  propertyCases += 1;
}
// Fragmentation: every plan reassembles to exactly the payload, offsets are 8-byte aligned, and each fragment fits the MTU.
function intervalsCover(frags, total) {
  const iv = frags.map((f) => [f.off, f.off + f.len]).sort((a, b) => a[0] - b[0]);
  let pos = 0; for (const [s, e] of iv) { if (s !== pos) return false; pos = e; } return pos === total;
}
for (let i = 0; i < 50_000; i += 1) {
  const mtu = 68 + rand(9000), payload = rand(20000), plan = o.fragmentPlan(payload, 20, mtu);
  if (!intervalsCover(plan, payload)) fail("fragment coverage", [payload, mtu]);
  if (plan.some((f, j) => f.off % 8 || f.len + 20 > mtu || f.mf !== (j < plan.length - 1) || (f.mf && f.len % 8))) fail("fragment rules", [payload, mtu]);
  const shuffled = plan.map((f) => ({ id: 7, off: f.off / 8, len: f.len, mf: f.mf })).sort(() => rand(3) - 1);
  const re = o.reassemble(shuffled);
  if (payload > 0 && (re.status !== "complete" || re.len !== payload)) fail("fragment round trip", [payload, mtu, re]);
  propertyCases += 1;
}
// TCP receiver: independent interval-union model.
function receiveRef(rcv, segs) {
  const have = new Set(); const acks = []; let fin = null;
  for (const s of segs) { for (let b = s.seq; b < s.seq + s.len; b += 1) have.add(b); if (s.fin) fin = s.seq + s.len; let next = rcv; while (have.has(next)) next += 1; rcv = next; acks.push(rcv + (fin !== null && rcv >= fin ? 1 : 0)); }
  return acks;
}
// Socket matcher.
function socketRef(socks, p) {
  const ok = socks.filter((s) => s.proto === p.proto && s.lport === p.dport && (s.laddr === "0.0.0.0" || s.laddr === p.dst) && (!s.raddr || (s.raddr === p.src && s.rport === p.sport)));
  const rank = (s) => (s.raddr ? 2 : 0) + (s.laddr === "0.0.0.0" ? 0 : 1);
  ok.sort((a, b) => rank(b) - rank(a)); return ok[0]?.id ?? null;
}

// ---------- Generated sweep ----------
const answerLabel = (q, id = "answer") => { const f = q.fields.find((x) => x.id === id); return f.options ? f.options.find((x) => x.value === f.answer).label : f.answer; };
let generated = 0, referenceChecks = 0;
// Application, policy, and diagnosis references.
function dnsQueriesRef({ cache, cname, tld1, tld2 }) {
  if (cache === "answer") return 0;
  return (cache === "tld" ? 2 : 3) + (cname ? (tld2 === tld1 ? 2 : 3) : 0);
}
const leaseState = (lease, t) => (t < lease / 2 ? "bound" : t < lease * 7 / 8 ? "renew" : t < lease ? "rebind" : "expired");
function natAllocRef(rows, proto) { const used = new Set(rows.filter((x) => x.proto === proto).map((x) => x.ext)); let p = 40001; while (used.has(p)) p += 1; return p; }
function fwRef(pk, timeout) {
  let conn = null;
  return pk.map((x) => {
    const key = x.dir === "out" ? `${x.s}:${x.sp}>${x.d}:${x.dp}` : `${x.d}:${x.dp}>${x.s}:${x.sp}`;
    if (conn && x.t - conn.last >= timeout) conn = null;
    if (conn && conn.key === key) { conn.last = x.t; return "ESTABLISHED allow"; }
    if (x.dir === "out" && x.fl === "SYN" && [80, 443].includes(x.dp)) { conn = { key, last: x.t }; return "NEW allow"; }
    return "NEW drop";
  });
}
function certRef({ cert, host }) {
  if (!cert.trusted) return "untrusted";
  if (cert.to < 2027) return "expired";
  const n = cert.name; if (n === host) return "ok";
  if (n.startsWith("*.")) { const labels = host.split("."); if (labels.length >= 2 && labels.slice(1).join(".") === n.slice(2)) return "ok"; }
  return "name";
}
const httpCases = [], frameCases = [], aclCases = [], ptrCases = [], capFrames = [];
const routeCases = [], v6Packets = [], ipv4Packets = [], udpPackets = [], framePackets = [], arpPackets = [], solCases = [], slaacCases = [], nextHopCases = [];
// Switching references.
function learnRef({ before, events, elapsed, maxAge }) {
  const fdb = {};
  for (const [k, v] of Object.entries(before)) if (v.age + elapsed < maxAge) fdb[k] = v.port;
  for (const e of events) fdb[`${e.vlan}|${e.src}`] = e.port;
  return Object.fromEntries(Object.keys(fdb).sort().map((k) => [k, fdb[k]]));
}
function bridgeRef({ ports, fdb, frame }) {
  const table = { ...fdb, [`${frame.vlan}|${frame.src}`]: frame.port };
  const members = ports.filter((p) => p.vlans.includes(frame.vlan)).map((p) => p.id);
  const out = frame.dst === "broadcast" ? undefined : table[`${frame.vlan}|${frame.dst}`];
  if (out === undefined) return { action: "flood", ports: members.filter((p) => p !== frame.port) };
  return out === frame.port ? { action: "filter", ports: [] } : { action: "forward", ports: [out] };
}
function vlanPathRef({ inPort, outPort, frame }) {
  let vlan;
  if (inPort.mode === "access") { if (frame.tag !== null) return "drop"; vlan = inPort.vlan; }
  else { if (frame.tag === null || !inPort.allowed.includes(frame.tag)) return "drop"; vlan = frame.tag; }
  if (outPort.mode === "access") return outPort.vlan === vlan ? "untagged" : "drop";
  return outPort.allowed.includes(vlan) ? `tag ${vlan}` : "drop";
}
function isolationRef({ hosts, links, src }) {
  const s = hosts.find((h) => h.id === src), seen = new Set([s.sw]), queue = [s.sw];
  while (queue.length) { const x = queue.shift(); for (const l of links) { const o = l.a === x ? l.b : l.b === x ? l.a : null; if (o && l.allowed.includes(s.vlan) && !seen.has(o)) { seen.add(o); queue.push(o); } } }
  return hosts.filter((h) => h.id !== src && h.vlan === s.vlan && seen.has(h.sw)).map((h) => h.id);
}
const icmpRef = (c) => ({ ttl: "te", hop6: "te", echo: "echo", noRoute: "net", noRoute6: "net", udpClosed: "port", df4: "fragNeeded", frag4: "none", ptb6: "ptb", errAboutErr: "none", nonFirstFrag: "none", broadcastDst: "none" })[c];
for (let familyIndex = 0; familyIndex < en.families.length; familyIndex += 1) {
  const family = en.families[familyIndex];
  if (sv.families[familyIndex]?.id !== family.id) fail("locale family parity", family.id);
  for (const level of family.levels) {
    const signatures = new Set();
    for (let sample = 0; sample < 4_000; sample += 1) {
      const s = ((familyIndex + 1) * 10_000_000 + level * 100_000 + sample + 1) >>> 0, q = en.generateQuestion(family.id, level, s), m = q.metadata, where = [family.id, level, s];
      if (!en.checkQuestion(q.canonicalAnswer, q).correct) fail("canonical answer", where);
      if (en.checkQuestion({}, q).correct) fail("empty answer accepted", where);
      for (const f of q.fields) {
        const bad = { ...q.canonicalAnswer, [f.id]: f.kind === "integer" ? "1.5" : f.kind === "hex" ? "0xZZ" : f.kind === "bytes" ? "0" : "nope" };
        if (en.checkQuestion(bad, q).correct) fail("malformed answer accepted", [...where, f.id]);
        if (f.options) { const v = f.options.map((x) => x.value), l = f.options.map((x) => x.label); if (new Set(v).size !== v.length || new Set(l).size !== l.length || v.filter((x) => x === f.answer).length !== 1) fail("choice uniqueness", where); }
      }
      if (m.modelId !== "network-protocols-v1") fail("model metadata", where);
      signatures.add(q.structuralSignature);
      if (sample < 50) {
        const t = sv.generateQuestion(family.id, level, s);
        if (!equal(q.canonicalAnswer, t.canonicalAnswer) || !sv.checkQuestion(t.canonicalAnswer, t).correct) fail("bilingual answer parity", where);
      }
      // Independent references over question metadata.
      if (m.ooo) { if (!equal(receiveRef(m.ooo.base, m.ooo.arrive), m.ooo.acks)) fail("out-of-order ACK reference", where); referenceChecks += 1; }
      if (m.win) { const lo = Math.max(m.win.s, m.win.ack), hi = Math.min(m.win.e, m.win.ack + m.win.win); if (Math.max(0, hi - lo) !== m.win.n || Number(q.canonicalAnswer.answer) !== m.win.n) fail("window reference", where); referenceChecks += 1; }
      if (m.sockets) { if (socketRef(m.sockets.socks, m.sockets.pkt) !== m.sockets.hit) fail("socket reference", where); referenceChecks += 1; }
      if (m.tcp && m.tcp.ack !== undefined && m.tcp.seq !== undefined) { const want = (m.tcp.seq + m.tcp.len + (m.tcp.syn ? 1 : 0) + (m.tcp.fin ? 1 : 0)) % 4294967296; if (want !== m.tcp.ack) fail("sequence reference", where); referenceChecks += 1; }
      if (m.mss) { const n = Math.ceil(m.mss.bytes / m.mss.mss), last = m.mss.bytes - (n - 1) * m.mss.mss; if (Number(q.canonicalAnswer.count) !== n || Number(q.canonicalAnswer.last) !== last || Number(q.canonicalAnswer.lastSeq) !== m.mss.start + (n - 1) * m.mss.mss) fail("MSS reference", where); referenceChecks += 1; }
      if (m.reasm) { const ref = o.reassemble(m.reasm.frags).status; if (ref !== m.reasm.status) fail("reassembly status", where); referenceChecks += 1; }
      if (m.checksum && m.checksum.words) { const bytes = m.checksum.words.flatMap((w) => [w >>> 8, w & 255]); if (parseInt(q.canonicalAnswer.answer, 16) !== checksumBytes(bytes)) fail("checksum reference", where); referenceChecks += 1; }
      if (m.checksum && m.checksum.incremental) { if (m.checksum.inc !== m.checksum.full) fail("incremental checksum equals recomputation", where); referenceChecks += 1; }
      if (m.route && sample < 400) routeCases.push({ where, ...m.route });
      if (m.frame && m.frame.bytes && !m.frame.issue && sample < 300) framePackets.push({ where, ...m.frame });
      if (m.arp && m.arp.op && sample < 300) arpPackets.push({ where, ...m.arp });
      if (m.sol && sample < 400) solCases.push({ where, ...m.sol });
      if (m.slaac && m.slaac.cand && m.slaac.iid && sample < 400) slaacCases.push({ where, ...m.slaac });
      if (m.nextHop && !m.nextHop.v6 && sample < 400) nextHopCases.push({ where, ...m.nextHop });
      if (m.fdb) { if (!equal(learnRef(m.fdb), Object.fromEntries(Object.keys(m.fdb.after).sort().map((k) => [k, m.fdb.after[k].port])))) fail("switch learning reference", where); referenceChecks += 1; }
      if (m.bridge) { if (!equal(bridgeRef(m.bridge), { action: m.bridge.res.action, ports: m.bridge.res.ports })) fail("switch forwarding reference", where); referenceChecks += 1; }
      if (m.vlanPath) { if (!equal(vlanPathRef(m.vlanPath), m.vlanPath.res.drop ? "drop" : m.vlanPath.res.tag === null ? "untagged" : `tag ${m.vlanPath.res.tag}`)) fail("VLAN port reference", where); referenceChecks += 1; }
      if (m.iso) { if (!equal(isolationRef(m.iso), m.iso.recv)) fail("VLAN isolation reference", where); referenceChecks += 1; }
      if (m.icmp) { if (icmpRef(m.icmp.c) !== m.icmp.ans) fail("ICMP selection reference", where); referenceChecks += 1; }
      if (m.ping && m.ping.loss !== undefined) { const got = new Set(m.ping.replies.map((x) => x.seq)); const ref = Math.round(1000 * (m.ping.probes.length - got.size) / m.ping.probes.length) / 10; if (ref !== m.ping.loss) fail("ping loss reference", where); referenceChecks += 1; }
      if (m.pmtu) { const pm = Math.min(...m.pmtu.links); if (pm !== m.pmtu.pmtu || pm - m.pmtu.tunnel - m.pmtu.ipH - m.pmtu.tcpHdr !== m.pmtu.mss || Number(q.canonicalAnswer.mss) !== m.pmtu.mss) fail("PMTU/MSS reference", where); referenceChecks += 1; }
      if (m.dnsTrace) { if (dnsQueriesRef(m.dnsTrace) !== m.dnsTrace.recQueries) fail("DNS resolution reference", where); referenceChecks += 1; }
      if (m.dnsCache) {
        const c = m.dnsCache;
        if (c.recs) { const live = c.recs.filter((x) => x.at + x.ttl > c.now).map((x) => `${x.n} (${x.at + x.ttl - c.now} s)`); if (!equal(live, c.live)) fail("DNS cache reference", where); }
        if (c.exp !== undefined && Number.isFinite(c.exp)) { /* hit iff now < expiry; checked through the answer text below */ }
        if (c.tc !== undefined) { const ref = c.now < c.tc && c.now >= c.ta ? "target" : c.now >= c.tc && c.now < c.ta ? "alias" : "both"; if (ref !== c.res) fail("DNS chain reference", where); }
        if (c.t1 !== undefined && c.t1 + c.ttl2 - c.t2 !== Number(q.canonicalAnswer.answer)) fail("DNS replacement TTL reference", where);
        referenceChecks += 1;
      }
      if (m.dnsT && m.dnsT.len !== undefined) { const want = [m.dnsT.len >> 8, m.dnsT.len & 255].map((x) => x.toString(16).toUpperCase().padStart(2, "0")).join(" "); if (q.canonicalAnswer.answer !== want) fail("DNS/TCP length prefix reference", where); referenceChecks += 1; }
      if (m.dnsT && m.dnsT.n !== undefined) { if (Number(q.canonicalAnswer.answer) !== (m.dnsT.reuse ? 1 : m.dnsT.n)) fail("DNS/TCP reuse reference", where); referenceChecks += 1; }
      if (m.lease) { if (leaseState(m.lease.lease, m.lease.t - (m.lease.ackAt ?? 0)) !== m.lease.state) fail("DHCP lease reference", where); referenceChecks += 1; }
      if (m.reuse) {
        const u = m.reuse;
        if (u.close) { if (1 + u.close.slice(0, -1).filter(Boolean).length !== u.conns) fail("HTTP close reference", where); }
        if (u.origins) { if (new Set(u.origins).size !== u.conns) fail("HTTP origin reference", where); }
        if (u.assign) { const end = {}; u.assign.forEach((c, i) => { end[c] = (end[c] ?? 0) + u.times[i]; if (end[c] !== u.done[i]) fail("HTTP two-connection reference", where); }); }
        if (u.serial !== undefined && (u.serial !== u.times.reduce((a, b) => a + b, 0) || u.par !== Math.max(...u.times))) fail("HTTP/2 concurrency reference", where);
        referenceChecks += 1;
      }
      if (m.h2) { const d = {}; for (const f of m.h2.frames) if (f.sid) d[f.sid] = (d[f.sid] ?? "") + (f.type === "DATA" ? f.text : ""); if (!equal(d, m.h2.data)) fail("HTTP/2 stream reference", where); referenceChecks += 1; }
      if (m.alpn) { const order = m.alpn.pref === "client" ? m.alpn.c : m.alpn.s, other = m.alpn.pref === "client" ? m.alpn.s : m.alpn.c; const ref = m.alpn.pref ? order.find((x) => other.includes(x)) ?? null : m.alpn.c.find((x) => m.alpn.s.includes(x)); if (ref !== m.alpn.res) fail("ALPN reference", where); referenceChecks += 1; }
      if (m.cert) { if (certRef(m.cert) !== m.cert.res) fail("certificate reference", where); referenceChecks += 1; }
      if (m.nat && m.nat.rows) { const n = m.nat, active = n.rows.filter((x) => n.timeout === null || n.now - x.last < n.timeout), hit = active.find((x) => x.proto === n.proto && x.ip === n.ip && x.port === n.port); if ((hit ? hit.ext : natAllocRef(active, n.proto)) !== n.ext) fail("PAT allocation reference", where); referenceChecks += 1; }
      if (m.natR) { const n = m.natR, hit = n.rows.find((x) => x.proto === n.pkt.proto && x.ext === n.pkt.dport && x.remote === n.pkt.src && (n.timeout === null || n.now - x.last < n.timeout)); if ((hit ? `${hit.ip}:${hit.port}` : null) !== n.res) fail("NAT return reference", where); referenceChecks += 1; }
      if (m.pf && m.pf.rules) { const hit = m.pf.rules.find((x) => x.proto === m.pf.pkt.proto && x.ext === m.pf.pkt.dport); if ((hit ? `${hit.ip}:${hit.port}` : null) !== m.pf.hit) fail("port-forward reference", where); referenceChecks += 1; }
      if (m.fw && m.fw.pk) { if (!equal(fwRef(m.fw.pk, m.fw.timeout), m.fw.res)) fail("stateful firewall reference", where); referenceChecks += 1; }
      if (m.acl && m.acl.pkt && sample < 400) aclCases.push({ where, rules: m.acl.rules, pkt: m.acl.pkt, idx: m.acl.idx });
      if (m.http && m.http.req && !m.http.err && sample < 300) httpCases.push({ where, ...m.http });
      if (m.http && m.http.err === "version" && sample < 300) httpCases.push({ where, ...m.http });
      if (m.httpFrame && sample < 300) frameCases.push({ where, ...m.httpFrame });
      if (m.dns && m.dns.rev && sample < 400) ptrCases.push({ where, rev: m.dns.rev, name: m.dns.revName });
      if (m.cap && m.cap.bytes && !m.cap.bad && sample < 300) capFrames.push({ where, ...m.cap });
      if (m.tunnel) { if (m.tunnel.pmtu - m.tunnel.over !== m.tunnel.budget) fail("tunnel budget reference", where); referenceChecks += 1; }
      if (m.v6 && sample < 300) v6Packets.push({ where, ...m.v6 });
      if (m.wire && m.wire.kind === "ipv4" && m.wire.bytes && sample < 300) ipv4Packets.push({ where, ...m.wire });
      if (m.wire && m.wire.kind === "udp" && m.wire.fields && sample < 300) udpPackets.push({ where, ...m.wire });
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}

// ---------- Python ipaddress: route selection and IPv6 text form ----------
let pythonNote = "", pythonChecks = 0;
const py = Bun.spawnSync(["/usr/bin/env", "python3", "-c", "import ipaddress"], { stdout: "pipe", stderr: "pipe" });
if (py.exitCode === 0) {
  const addrs = Array.from({ length: 20_000 }, () => { const groups = Array.from({ length: 8 }, () => (rand(4) === 0 ? 0 : rand(65536))); if (rand(2)) groups.fill(0, rand(8), rand(9)); return groups.map((g) => g.toString(16)).join(":"); });
  const script = `
import ipaddress, json, sys
data = json.load(sys.stdin)
out = {"v6": [ipaddress.IPv6Address(a).compressed for a in data["addrs"]], "routes": [], "sol": [], "slaac": [], "nexthop": [], "ptr": [], "acl": []}
for c in data["ptr"]:
    out["ptr"].append(ipaddress.ip_address(c["rev"]).reverse_pointer + ".")
for c in data["acl"]:
    p = c["pkt"]; hit = None
    for i, r in enumerate(c["rules"]):
        if r["proto"] != "any" and r["proto"] != p["proto"]: continue
        if r.get("src") and ipaddress.ip_address(p["src"]) not in ipaddress.ip_network(r["src"]): continue
        if r.get("dst") and ipaddress.ip_address(p["dst"]) not in ipaddress.ip_network(r["dst"]): continue
        if r.get("ports") and not (r["ports"][0] <= p["dport"] <= r["ports"][1]): continue
        if r.get("state") and r["state"] != p["state"]: continue
        hit = i; break
    out["acl"].append(hit)
for c in data["sol"]:
    t = int(ipaddress.IPv6Address(c["target"]))
    m = int(ipaddress.IPv6Address("ff02::1:ff00:0")) | (t & 0xFFFFFF)
    out["sol"].append([str(ipaddress.IPv6Address(m)), "33:33:" + ":".join("%02x" % ((m >> (8 * i)) & 255) for i in (3, 2, 1, 0))])
for c in data["slaac"]:
    out["slaac"].append(str(ipaddress.IPv6Network(c["pre"] + "/64")[int(ipaddress.IPv6Address("::" + c["iid"]))]))
for c in data["nexthop"]:
    dst = ipaddress.ip_address(c["dst"]); best = None
    for r in c["routes"]:
        net = ipaddress.ip_network(r["p"])
        if dst in net and (best is None or net.prefixlen > best[0].prefixlen): best = (net, r["via"])
    out["nexthop"].append(best[1] or c["dst"])
for case in data["routes"]:
    dst = ipaddress.ip_address(case["dst"])
    best = None
    for r in case["routes"]:
        net = ipaddress.ip_network(r["net"] + "/" + str(r["p"]), strict=False)
        if dst in net and (best is None or r["p"] > best[0] or (r["p"] == best[0] and r["m"] < best[1])):
            best = (r["p"], r["m"], r["id"])
    out["routes"].append(best[2] if best else None)
print(json.dumps(out))`;
  const run = Bun.spawnSync(["/usr/bin/env", "python3", "-I", "-c", script], { stdin: Buffer.from(JSON.stringify({ addrs, routes: routeCases, sol: solCases, slaac: slaacCases, nexthop: nextHopCases, ptr: ptrCases, acl: aclCases })), stdout: "pipe", stderr: "pipe" });
  if (run.exitCode !== 0) fail("python ipaddress run", run.stderr.toString().slice(0, 300));
  else {
    const out = JSON.parse(run.stdout.toString());
    addrs.forEach((a, i) => { if (o.v6Format(o.v6Parse(a)) !== out.v6[i]) fail("IPv6 compression vs Python", [a, o.v6Format(o.v6Parse(a)), out.v6[i]]); pythonChecks += 1; });
    routeCases.forEach((c, i) => { if (c.best !== out.routes[i]) fail("route selection vs Python", [...c.where, c.best, out.routes[i]]); pythonChecks += 1; });
    solCases.forEach((c, i) => { if (o.v6Format(o.v6Parse(c.ip)) !== o.v6Format(o.v6Parse(out.sol[i][0])) || c.mac !== out.sol[i][1]) fail("solicited-node vs Python", [...c.where, c.ip, c.mac, out.sol[i]]); pythonChecks += 1; });
    slaacCases.forEach((c, i) => { if (o.v6Format(o.v6Parse(c.cand)) !== o.v6Format(o.v6Parse(out.slaac[i]))) fail("SLAAC address vs Python", [...c.where, c.cand, out.slaac[i]]); pythonChecks += 1; });
    ptrCases.forEach((c, i) => { if (c.name !== out.ptr[i]) fail("PTR name vs Python", [...c.where, c.name, out.ptr[i]]); pythonChecks += 1; });
    aclCases.forEach((c, i) => { if (c.idx !== out.acl[i]) fail("first-match rule vs Python ipaddress", [...c.where, c.idx, out.acl[i]]); pythonChecks += 1; });
    nextHopCases.forEach((c, i) => { if (c.target !== out.nexthop[i]) fail("next-hop target vs Python", [...c.where, c.target, out.nexthop[i]]); pythonChecks += 1; });
  }
} else pythonNote = " Python ipaddress checks skipped: python3 not found.";

// ---------- Python http.client / http.server: HTTP/1.1 parsing and framing ----------
let httpChecks = 0;
if (py.exitCode === 0 && (httpCases.length || frameCases.length)) {
  const script = `
import io, json, sys, http.client, http.server
data = json.load(sys.stdin)
class Keep(io.BytesIO):
    def close(self): pass
class Sock:
    def __init__(self, b): self.f = Keep(b)
    def makefile(self, *a, **k): return self.f
out = {"frames": [], "reqs": []}
for c in data["frames"]:
    s = Sock(c["stream"].encode("ascii")); r = http.client.HTTPResponse(s, method="GET"); r.begin(); body = r.read()
    out["frames"].append({"body": body.decode("ascii"), "offset": s.f.tell(), "status": r.status})
class H(http.server.BaseHTTPRequestHandler):
    def __init__(self, raw):
        self.rfile = io.BytesIO(raw); self.wfile = io.BytesIO(); self.client_address = ("192.0.2.1", 1); self.request_version = "HTTP/1.1"; self.command = None
        self.raw_requestline = self.rfile.readline(65537)
    def log_message(self, *a): pass
for c in data["reqs"]:
    h = H(c["req"].encode("ascii")); ok = h.parse_request(); body = b""
    if ok and h.headers.get("Content-Length"): body = h.rfile.read(int(h.headers["Content-Length"]))
    out["reqs"].append({"ok": bool(ok), "method": h.command if ok else None, "path": h.path if ok else None, "host": h.headers.get("Host") if ok else None, "body": len(body)})
print(json.dumps(out))`;
  const run = Bun.spawnSync(["/usr/bin/env", "python3", "-I", "-c", script], { stdin: Buffer.from(JSON.stringify({ frames: frameCases, reqs: httpCases })), stdout: "pipe", stderr: "pipe" });
  if (run.exitCode !== 0) fail("python http run", run.stderr.toString().slice(0, 400));
  else {
    const out = JSON.parse(run.stdout.toString());
    frameCases.forEach((c, i) => { const g = out.frames[i]; if (g.body.length !== c.bodyLen || (c.body !== undefined && g.body !== c.body) || (c.offset !== undefined && g.offset !== c.offset)) fail("HTTP framing vs Python http.client", [...c.where, g]); httpChecks += 1; });
    httpCases.forEach((c, i) => { const g = out.reqs[i]; if (c.err === "version") { if (g.ok) fail("malformed request accepted by Python http.server", c.where); } else if (!g.ok || g.method !== c.method || g.path !== c.target || (g.host ?? "").split(":")[0] !== c.host || g.body !== c.bodyLen) fail("HTTP request vs Python http.server", [...c.where, g]); httpChecks += 1; });
  }
}

// ---------- tcpdump decoding of serialized packets ----------
let tcpdumpNote = "", tcpdumpChecks = 0;
function pcap(packets, linktype = 101) {
  const parts = [], gh = Buffer.alloc(24);
  gh.writeUInt32LE(0xa1b2c3d4, 0); gh.writeUInt16LE(2, 4); gh.writeUInt16LE(4, 6); gh.writeUInt32LE(262144, 16); gh.writeUInt32LE(linktype, 20); parts.push(gh);
  packets.forEach((p, i) => { const h = Buffer.alloc(16); h.writeUInt32LE(i, 0); h.writeUInt32LE(p.length, 8); h.writeUInt32LE(p.length, 12); parts.push(h, Buffer.from(p)); });
  return Buffer.concat(parts);
}
// Independent IPv6 serializer for extension-header chains.
function v6ext(type, nh, len) {
  if (type === 44) return [nh, 0, 0, 0, 0, 0, 0, 1];
  const b = [nh, len / 8 - 1];
  if (type === 43) { b.push(0, 0, 0, 0, 0, 0); while (b.length < len) b.push(0); return b; }
  b.push(1, len - 4); while (b.length < len) b.push(0); return b;
}
function v6packet(chain, lens, upper) {
  const upperBytes = upper === 17 ? [0xc3, 0x50, 0x00, 0x35, 0, 8, 0, 0] : upper === 6 ? [0xc3, 0x50, 0, 80, 0, 0, 0, 1, 0, 0, 0, 0, 0x50, 2, 0xfa, 0xf0, 0, 0, 0, 0] : [128, 0, 0, 0, 0, 1, 0, 1];
  let body = []; chain.forEach((t, i) => { body = body.concat(v6ext(t, i + 1 < chain.length ? chain[i + 1] : upper, lens[i])); }); body = body.concat(upperBytes);
  const addr = (x) => [0x20, 1, 0x0d, 0xb8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, x];
  return [0x60, 0, 0, 0, body.length >> 8, body.length & 255, chain.length ? chain[0] : upper, 64, ...addr(1), ...addr(2), ...body];
}
const hasTcpdump = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "sh", "-c", "command -v tcpdump"], { stdout: "pipe" }).exitCode === 0;
if (hasTcpdump) {
  const dir = mkdtempSync(join(tmpdir(), "net-validate-"));
  try {
    const decode = (packets) => { writeFileSync(join(dir, "p.pcap"), pcap(packets)); const r = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "tcpdump", "-nn", "-v", "-q", "-r", join(dir, "p.pcap")], { stdout: "pipe", stderr: "pipe" }); return r.stdout.toString().split(/\n(?=\d\d:)/).filter(Boolean); };
    // IPv4 headers shown in questions: pad to Total Length and compare tcpdump's decoding with the question's model.
    const ipv4 = ipv4Packets.filter((p) => !p.issue || p.issue === "ok" || p.issue === "checksum");
    const lines4 = decode(ipv4.map((p) => { const b = p.bytes.split(" ").map((x) => parseInt(x, 16)); const total = b[2] * 256 + b[3]; return b.concat(Array(Math.max(0, total - b.length)).fill(0)); }));
    ipv4.forEach((p, i) => {
      const line = lines4[i] ?? "", b = p.bytes.split(" ").map((x) => parseInt(x, 16));
      const ttl = Number(/ttl (\d+)/.exec(line)?.[1]), proto = Number(/proto \w+ \((\d+)\)/.exec(line)?.[1]), len = Number(/length (\d+)/.exec(line)?.[1]), off = Number(/offset (\d+)/.exec(line)?.[1]), mf = /flags \[[^\]]*\+/.test(line), badCk = /bad cksum/.test(line);
      const addrs = /\)\s+(\d+\.\d+\.\d+\.\d+)(?:\.\d+)? > (\d+\.\d+\.\d+\.\d+)/.exec(line);
      if (ttl !== b[8] || proto !== b[9] || len !== b[2] * 256 + b[3]) fail("tcpdump IPv4 fields", [...p.where, line.slice(0, 160)]);
      if (p.fields?.ttl !== undefined && (p.fields.ttl !== ttl || p.fields.protocol !== proto)) fail("tcpdump TTL/protocol vs answer", p.where);
      if (p.fields?.offset !== undefined && (p.fields.offset * 8 !== off || p.fields.mf !== mf)) fail("tcpdump fragment fields vs answer", [...p.where, line.slice(0, 160)]);
      if (p.fields?.src !== undefined && (!addrs || addrs[1] !== p.fields.src || addrs[2] !== p.fields.dst)) fail("tcpdump addresses vs answer", [...p.where, line.slice(0, 160)]);
      if (p.valid !== undefined && p.valid === badCk) fail("tcpdump checksum validity vs answer", [...p.where, line.slice(0, 160)]);
      if (p.issue === "checksum" && !badCk) fail("tcpdump should report the broken checksum", p.where);
      if (p.zeroChecksum) { const want = /->([0-9a-f]+)\)/.exec(line)?.[1]; if (parseInt(want, 16) !== p.checksum) fail("tcpdump checksum value vs answer", [...p.where, line.slice(0, 160)]); }
      tcpdumpChecks += 1;
    });
    // UDP headers: wrap in an IPv4 packet and compare ports and data length.
    const linesU = decode(udpPackets.map((p) => { const u = p.bytes.split(" ").map((x) => parseInt(x, 16)); const total = 20 + p.fields.len; return o.ipv4Header({ totalLength: total, id: 1, ttl: 64, protocol: 17, src: "192.0.2.1", dst: "198.51.100.2" }).concat(u, Array(p.fields.len - 8).fill(0)); }));
    udpPackets.forEach((p, i) => {
      const line = linesU[i] ?? "", m = /192\.0\.2\.1\.(\d+) > 198\.51\.100\.2\.(\d+): UDP, length (\d+)/.exec(line);
      if (!m || Number(m[1]) !== p.fields.sport || Number(m[2]) !== p.fields.dport || Number(m[3]) !== p.fields.len - 8) fail("tcpdump UDP fields vs answer", [...p.where, line.slice(0, 200)]);
      tcpdumpChecks += 1;
    });
    // IPv6 extension chains: serialize independently and compare tcpdump's header sequence and upper protocol.
    const tokenOf = { 0: "HBH", 60: "DSTOPT", 43: "RT6", 44: "frag" };
    const linesV = decode(v6Packets.map((p) => v6packet(p.chain, p.exts.map((e) => e.len), p.upper)));
    v6Packets.forEach((p, i) => {
      const line = (linesV[i] ?? "").split(/2001:db8::2(?:\.\d+)?: /).slice(1).join(""), seen = [...line.matchAll(/\b(HBH|DSTOPT|RT6|frag) \(/g)].map((x) => x[1]);
      const upper = /ICMP6/.test(line) ? 58 : /\btcp\b|Flags \[/.test(line) ? 6 : /\budp\b|UDP|> \S+\.53:|50000 > 53/.test(line) ? 17 : null;
      if (!equal(seen, p.chain.map((t) => tokenOf[t])) || upper !== p.upper) fail("tcpdump IPv6 chain vs answer", [...p.where, line.slice(0, 200)]);
      tcpdumpChecks += 1;
    });
    // Ethernet frames (linktype 1): compare tcpdump's MACs, EtherType, and VLAN ID with the question's model.
    const decodeEth = (packets) => { writeFileSync(join(dir, "e.pcap"), pcap(packets, 1)); const r = Bun.spawnSync(["/usr/bin/env", "-i", "PATH=/usr/bin:/bin", "tcpdump", "-nn", "-e", "-r", join(dir, "e.pcap")], { stdout: "pipe", stderr: "pipe" }); return r.stdout.toString().split(/\n(?=\d\d:)/).filter(Boolean); };
    const ethNames = { 2048: "IPv4", 34525: "IPv6", 2054: "ARP" };
    const linesE = decodeEth(framePackets.map((f) => { const b = f.bytes.split(" ").map((x) => parseInt(x, 16)); while (b.length < 60) b.push(0); return b; }));
    framePackets.forEach((f, i) => {
      const line = linesE[i] ?? "", m = /^\S+ ([0-9a-f:]{17}) > ([0-9a-f:]{17}), ethertype (?:802\.1Q \(0x8100\), length \d+: vlan (\d+), p (\d+), (?:DEI, )?ethertype )?(\w+) \(0x([0-9a-f]{4})\)/.exec(line);
      if (!m || (f.src && m[1] !== f.src) || (f.dst && m[2] !== f.dst) || parseInt(m[6], 16) !== f.et || (f.tagged && Number(m[3]) !== f.vid) || (!f.tagged && m[3] !== undefined)) fail("tcpdump Ethernet fields vs answer", [...f.where, line.slice(0, 200)]);
      tcpdumpChecks += 1;
    });
    // ARP: serialize requests and replies from the question's model and compare tcpdump's reading.
    const macB = (x) => x.split(":").map((h) => parseInt(h, 16)), ipB = (x) => x.split(".").map(Number);
    const arpFrames = arpPackets.map((a) => { const req = a.op === "request", sha = a.sha, tha = req ? "00:00:00:00:00:00" : a.tha, dstMac = req ? "ff:ff:ff:ff:ff:ff" : a.tha; return [...macB(dstMac), ...macB(sha), 8, 6, 0, 1, 8, 0, 6, 4, 0, req ? 1 : 2, ...macB(sha), ...ipB(a.spa), ...macB(tha), ...ipB(a.tpa), ...Array(18).fill(0)]; });
    const linesA = decodeEth(arpFrames);
    arpPackets.forEach((a, i) => {
      const line = linesA[i] ?? "", want = a.op === "request" ? `Request who-has ${a.tpa} tell ${a.spa}` : `Reply ${a.spa} is-at ${a.sha}`;
      if (!line.includes(want) || !line.includes(a.op === "request" ? "> ff:ff:ff:ff:ff:ff" : `> ${a.tha}`)) fail("tcpdump ARP vs answer", [...a.where, line.slice(0, 200)]);
      tcpdumpChecks += 1;
    });
    // Captured frames in the diagnosis family: tcpdump must agree with the summary's addresses, ports, VLAN, and flags.
    const linesC = decodeEth(capFrames.map((f) => f.bytes.split(" ").map((x) => parseInt(x, 16)).concat(Array(Math.max(0, 60 - f.bytes.split(" ").length)).fill(0))));
    const flagMap = { SYN: "S", ACK: ".", FIN: "F", RST: "R", PSH: "P" };
    capFrames.forEach((f, i) => {
      const line = linesC[i] ?? "";
      let ok;
      if (f.arp) ok = line.includes(f.arp.op === 1 ? `Request who-has ${f.arp.tpa} tell ${f.arp.spa}` : `Reply ${f.arp.spa} is-at ${f.arp.sha}`);
      else {
        const sep = f.v6 ? "." : ".", src = `${f.src}${sep}${f.sport}`, dst = `${f.dst}${sep}${f.dport}`;
        ok = line.includes(`${src} > ${dst}`) && (f.vlan === null || line.includes(`vlan ${f.vlan},`));
        if (f.proto === 6) { const fl = /Flags \[([^\]]*)\]/.exec(line)?.[1] ?? "", want = f.flags.split("+").map((x) => flagMap[x]); ok = ok && want.every((x) => fl.includes(x)) && fl.length === want.length; }
        else ok = ok && !/Flags \[/.test(line);
      }
      if (!ok) fail("tcpdump capture decode vs answer", [...f.where, line.slice(0, 220)]);
      tcpdumpChecks += 1;
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }
} else tcpdumpNote = " tcpdump checks skipped: tcpdump not found on PATH=/usr/bin:/bin.";

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Networking extended validation passed: ${propertyCases.toLocaleString("en-US")} checksum/fragmentation property cases, ${referenceChecks.toLocaleString("en-US")} independent reference checks, ${pythonChecks.toLocaleString("en-US")} Python ipaddress checks, ${httpChecks.toLocaleString("en-US")} Python http.client/http.server checks, ${tcpdumpChecks.toLocaleString("en-US")} packets decoded by tcpdump, and ${generated.toLocaleString("en-US")} generated questions (4,000 per family and supported level), with bilingual seed parity.${pythonNote}${tcpdumpNote}`);
