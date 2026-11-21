import vm from "node:vm";

async function loadApp(localeCode) {
  const locale = (await import(`./locales/${localeCode}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
    .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = { window: {}, document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.HttpWebPracticeApp;
}

const en = await loadApp("en");
const sv = await loadApp("sv");
const o = en.oracles;
const failures = [];
const fail = (name, data) => {
  if (failures.length < 100) failures.push(`${name}: ${JSON.stringify(data)}`);
};
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const safe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

function referencePercentEncode(text) {
  let output = "";
  for (const byte of new TextEncoder().encode(text)) {
    const character = String.fromCharCode(byte);
    output += byte < 128 && safe.includes(character)
      ? character
      : `%${byte.toString(16).toUpperCase().padStart(2, "0")}`;
  }
  return output;
}

for (let i = 0; i < 100_000; i += 1) {
  const scheme = i % 3 ? "https" : "http";
  const defaultPort = scheme === "https" ? 443 : 80;
  const explicitPort = i % 5 === 0 ? 8000 + i % 1000 : defaultPort;
  const portText = i % 2 === 0 ? `:${explicitPort}` : "";
  const path = `/a${i % 17}/b${i % 23}`;
  const query = i % 4 === 0 ? `?q=${i % 31}` : "";
  const fragment = i % 7 === 0 ? `#f${i % 13}` : "";
  const input = `${scheme}://H${i % 97}.test${portText}${path}${query}${fragment}`;
  const parsed = o.parseUrl(input);
  const native = new URL(input);
  const expectedPort = Number(native.port || defaultPort);
  if (parsed.scheme !== native.protocol.slice(0, -1) || parsed.host !== native.hostname || parsed.effectivePort !== expectedPort) {
    fail("URL authority", [input, parsed]);
  }
  if (parsed.target !== `${native.pathname}${native.search}` || parsed.target.includes("#")) fail("request target", [input, parsed.target]);
  if (!equal(o.parseUrl(o.serializeUrl(parsed)), { ...parsed, writtenPort: explicitPort === defaultPort ? "" : String(explicitPort) })) {
    const roundTrip = o.parseUrl(o.serializeUrl(parsed));
    if (roundTrip.scheme !== parsed.scheme || roundTrip.host !== parsed.host || roundTrip.effectivePort !== parsed.effectivePort || roundTrip.target !== parsed.target) {
      fail("URL round trip", [input, parsed, roundTrip]);
    }
  }
  const ref = i % 4 === 0 ? "../next" : i % 4 === 1 ? "/root?q=1" : i % 4 === 2 ? "?page=2" : "#top";
  if (o.resolveReference(input, ref) !== new URL(ref, input).href) fail("reference resolution", [input, ref, o.resolveReference(input, ref), new URL(ref, input).href]);
  const text = ["café", "räv", "雪", "😀", `safe-${i % 101}`][i % 5];
  const encoded = o.percentEncode(text, safe);
  if (encoded !== referencePercentEncode(text) || o.percentDecode(encoded).value !== text) fail("percent round trip", [text, encoded]);
}

const methodMatrix = {
  GET: [true, true], HEAD: [true, true], POST: [false, false], PUT: [false, true],
  DELETE: [false, true], PATCH: [false, false], OPTIONS: [true, true],
};
const methods = Object.keys(methodMatrix);
const statuses = [100, 200, 201, 202, 204, 301, 302, 303, 304, 307, 308, 400, 401, 404, 405, 406, 409, 415, 422, 502, 504];
for (let i = 0; i < 25_000; i += 1) {
  const method = methods[i % methods.length];
  const status = statuses[(i * 7) % statuses.length];
  const got = o.methodProperties(method);
  if (got.safe !== methodMatrix[method][0] || got.idempotent !== methodMatrix[method][1]) fail("method matrix", [method, got]);
  const bodyExpected = method !== "HEAD" && !(status >= 100 && status < 200) && status !== 204 && status !== 304;
  if (o.bodyPermitted(method, status) !== bodyExpected) fail("message-body rule", [method, status]);
}

function media(value) {
  const [essence, ...rawParameters] = value.split(";").map((item) => item.trim().toLowerCase());
  const [type, subtype] = essence.split("/");
  const params = Object.fromEntries(rawParameters.map((item) => item.split("=")));
  return { type, subtype, params };
}

function negotiateReference(accept, offers) {
  const ranges = accept.split(",").map((piece, index) => {
    const parsed = media(piece);
    const q = parsed.params.q === undefined ? 1000 : Math.round(Number(parsed.params.q) * 1000);
    delete parsed.params.q;
    return { ...parsed, q, index };
  });
  const candidates = offers.map((offer, serverIndex) => {
    const representation = media(offer);
    const matches = ranges.filter((range) =>
      (range.type === "*" || range.type === representation.type)
      && (range.subtype === "*" || range.subtype === representation.subtype)
      && Object.entries(range.params).every(([name, value]) => representation.params[name] === value));
    matches.sort((a, b) => {
      const specificity = (range) => range.type === "*" ? 0 : range.subtype === "*" ? 1 : 2;
      return specificity(b) - specificity(a)
        || Object.keys(b.params).length - Object.keys(a.params).length
        || a.index - b.index;
    });
    const best = matches[0];
    return {
      offer,
      serverIndex,
      q: best?.q ?? 0,
      specificity: best ? (best.type === "*" ? 0 : best.subtype === "*" ? 1 : 2) : -1,
      paramCount: best ? Object.keys(best.params).length : 0,
    };
  }).filter((item) => item.q > 0);
  candidates.sort((a, b) => b.q - a.q || b.specificity - a.specificity || b.paramCount - a.paramCount || a.serverIndex - b.serverIndex);
  return candidates[0]?.offer ?? null;
}

const acceptParts = ["*/*;q=0.1", "text/*;q=0.7", "text/html;q=1", "text/html;q=0", "application/json;q=0.9", "image/svg+xml;q=0.001"];
const offerPool = ["text/html", "text/plain", "application/json", "image/svg+xml"];
for (let i = 0; i < 50_000; i += 1) {
  const accept = [acceptParts[i % acceptParts.length], acceptParts[(i * 5 + 1) % acceptParts.length], acceptParts[(i * 7 + 2) % acceptParts.length]].join(", ");
  const offers = [offerPool[i % 4], offerPool[(i + 1) % 4], offerPool[(i + 3) % 4]];
  const got = o.negotiate(accept, offers)?.offer ?? null;
  const expected = negotiateReference(accept, offers);
  if (got !== expected) fail("Accept negotiation", [accept, offers, got, expected]);
}

function redirectReference(status, method) {
  if (status === 303) return method === "HEAD" ? "HEAD" : "GET";
  if (status === 307 || status === 308) return method;
  if ((status === 301 || status === 302) && method === "POST") return "GET";
  return method;
}
const redirectStatuses = [301, 302, 303, 307, 308];
for (let i = 0; i < 25_000; i += 1) {
  const status = redirectStatuses[i % redirectStatuses.length];
  const method = methods[(i * 3) % methods.length];
  if (o.redirectMethod(status, method) !== redirectReference(status, method)) fail("redirect transition", [status, method]);
}
for (let i = 0; i < 10_000; i += 1) {
  let method = methods[i % methods.length];
  const chain = [301, 307, 303, 308].slice(0, 2 + i % 3);
  for (const status of chain) method = redirectReference(status, method);
  let reduced = methods[i % methods.length];
  for (const status of chain) reduced = o.redirectMethod(status, reduced);
  if (method !== reduced) fail("redirect chain", [chain, method, reduced]);
}

for (let i = 0; i < 100_000; i += 1) {
  const requestTime = i % 101;
  const responseTime = requestTime + i % 17;
  const date = responseTime - 20 + i % 41;
  const age = i % 23;
  const now = responseTime + i % 997;
  const apparent = Math.max(0, responseTime - date);
  const delay = responseTime - requestTime;
  const initial = Math.max(apparent, age + delay);
  const expectedAge = initial + now - responseTime;
  const got = o.currentAge({ requestTime, responseTime, date, age, now });
  if (got.currentAge !== expectedAge) fail("cache current age", [requestTime, responseTime, date, age, now, got]);
  const lifetime = i % 89;
  const validator = i % 3 !== 0;
  const noCache = i % 19 === 0;
  const expectedDecision = noCache ? "validate" : expectedAge < lifetime ? "serve stored response" : validator ? "validate" : "cannot use entry";
  const decision = o.freshnessDecision({ currentAge: expectedAge, lifetime, validator, noCache: false }, { noCache });
  if (decision !== expectedDecision) fail("cache freshness", [expectedAge, lifetime, validator, noCache, decision]);
  const tag = `"v${i % 37}"`;
  if (!o.etagMatch(`W/${tag}`, tag, false) || o.etagMatch(`W/${tag}`, tag, true)) fail("ETag comparison", [tag]);
}
for (let i = 0; i < 25_000; i += 1) {
  const family = en.generateQuestion("cache_timeline_trace", 1 + i % 5, i + 1);
  if (!en.checkQuestion(family.canonicalAnswer, family).correct || !family.metadata.syntheticState.offline) fail("cache timeline", i);
}

function domainReference(host, domain) {
  return host === domain || host.endsWith(`.${domain}`);
}
function pathReference(path, scope) {
  return path === scope || path.startsWith(`${scope}${scope.endsWith("/") ? "" : "/"}`);
}
for (let i = 0; i < 50_000; i += 1) {
  const host = i % 3 === 0 ? "app.test" : i % 3 === 1 ? "x.app.test" : "notapp.test";
  if (o.domainMatch(host, "app.test") !== domainReference(host, "app.test")) fail("cookie domain", host);
  const path = i % 4 === 0 ? "/app" : i % 4 === 1 ? "/app/x" : i % 4 === 2 ? "/apple" : "/";
  if (o.cookiePathMatch(path, "/app") !== pathReference(path, "/app")) fail("cookie path", path);
  const jar = [
    { name: "root", value: "R", domain: "app.test", hostOnly: true, path: "/", secure: true, sameSite: "Lax", expiry: null, creationIndex: 1 },
    { name: "deep", value: "D", domain: "app.test", hostOnly: true, path: "/app", secure: true, sameSite: "Lax", expiry: null, creationIndex: 2 },
  ];
  const context = { url: `https://app.test${path}`, now: i, credentials: "include", sameOrigin: true, sameSite: true, topLevel: false, method: "GET" };
  const expected = jar.filter((cookie) => pathReference(path, cookie.path)).sort((a, b) => b.path.length - a.path.length).map((cookie) => `${cookie.name}=${cookie.value}`);
  if (!equal(o.selectCookies(jar, context), expected)) fail("cookie selection", [path, o.selectCookies(jar, context), expected]);
}
for (let i = 0; i < 10_000; i += 1) {
  const question = en.generateQuestion("session_cookie_trace", 1 + i % 5, i + 1);
  if (!en.checkQuestion(question.canonicalAnswer, question).correct) fail("session trace", i);
}

function originReference(left, right) {
  const a = new URL(left);
  const b = new URL(right);
  return a.protocol === b.protocol && a.hostname.toLowerCase() === b.hostname.toLowerCase() && (a.port || (a.protocol === "https:" ? "443" : "80")) === (b.port || (b.protocol === "https:" ? "443" : "80"));
}
for (let i = 0; i < 50_000; i += 1) {
  const left = i % 2 ? "https://app.test/a" : "http://app.test/a";
  const right = i % 5 === 0 ? "https://app.test:443/b" : i % 5 === 1 ? "https://api.test/b" : i % 5 === 2 ? "http://app.test:80/b" : i % 5 === 3 ? "https://app.test:8443/b" : left;
  if (o.sameOrigin(left, right) !== originReference(left, right)) fail("origin tuple", [left, right]);
  const credentials = i % 2 === 0;
  const acao = i % 3 === 0 ? "*" : i % 3 === 1 ? "https://app.test" : "https://other.test";
  const acac = i % 5 === 0;
  const expectedExposure = credentials ? acao === "https://app.test" && acac : acao === "*" || acao === "https://app.test";
  if (o.corsExpose("https://app.test", credentials, acao, acac, false) !== expectedExposure) fail("CORS exposure", [credentials, acao, acac]);
}
for (let i = 0; i < 20_000; i += 1) {
  const question = en.generateQuestion("cors_full_exchange", 1 + i % 5, i + 1);
  if (!en.checkQuestion(question.canonicalAnswer, question).correct || question.metadata.corsModel !== "fetch-cors-profile-2026-07-30") fail("CORS exchange", i);
}
for (let i = 0; i < 10_000; i += 1) {
  const url = `https://cdn.test/r?q=${i % 13}`;
  const vary = i % 2 ? ["Accept", "X-Mode"] : [];
  const fields = i % 3 ? { accept: "application/json", "x-mode": "fast" } : {};
  const parsedUrl = new URL(url);
  const effectivePort = parsedUrl.port || (parsedUrl.protocol === "https:" ? "443" : "80");
  let expected = `${parsedUrl.protocol}//${parsedUrl.hostname}:${effectivePort}${parsedUrl.pathname}${parsedUrl.search}`;
  for (const name of vary) {
    const actual = Object.keys(fields).find((field) => field.toLowerCase() === name.toLowerCase());
    expected += `|${name.toLowerCase()}=${actual ? fields[actual] : "<missing>"}`;
  }
  if (o.intermediaryKey(url, vary, fields) !== expected) fail("intermediary key", [url, vary, fields]);
}
for (let i = 0; i < 20_000; i += 1) {
  const family = i % 2 ? "synthetic_exchange_reconstruct" : "synthetic_exchange_diagnosis";
  const question = en.generateQuestion(family, 1 + i % 5, i + 1);
  if (!en.checkQuestion(question.canonicalAnswer, question).correct) fail("event reconstruction/diagnosis", [family, i]);
}

const proseLeak = /\b(?:cookie always accepted|two sid cookies|accepted over HTTP|filesystem access control|prevents sending|wildcard always readable|strong comparison|weak comparison|no applicable validator|fresh hit|not stored|origin calls|server receipt|shuffled observations|message body exposed|timestamps alone|exposure precedes|response claims body|entry called fresh)\b/i;
let generated = 0;
for (let familyIndex = 0; familyIndex < en.families.length; familyIndex += 1) {
  const family = en.families[familyIndex];
  if (sv.families[familyIndex]?.id !== family.id) fail("locale family parity", family.id);
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 10_000; sample += 1) {
      const seed = ((familyIndex + 1) * 10_000_000 + level * 100_000 + sample + 1) >>> 0;
      const question = en.generateQuestion(family.id, level, seed);
      if (!en.checkQuestion(question.canonicalAnswer, question).correct) fail("canonical answer", [family.id, level, seed]);
      if (en.checkQuestion({}, question).correct) fail("empty answer accepted", [family.id, level, seed]);
      if (question.metadata.modelId !== "http-web-v1" || question.metadata.syntheticState.networkRequests !== false || !question.metadata.sourceAnchors) fail("model metadata", [family.id, level, seed]);
      if (!question.prompt.blocks.length || question.prompt.blocks.some((block) => JSON.stringify(block).length > 10_000)) fail("rendering budget", [family.id, level, seed]);
      for (const field of question.fields) {
        if (field.options) {
          const values = field.options.map((option) => option.value);
          const labels = field.options.map((option) => option.label);
          if (new Set(values).size !== values.length || new Set(labels).size !== labels.length || values.filter((value) => value === field.answer).length !== 1) fail("choice uniqueness", [family.id, level, seed]);
        }
      }
      const visible = [question.prompt.title, question.explanation, ...question.prompt.blocks.map((block) => block.text || block.caption || "")].join("\n");
      for (const match of visible.matchAll(/https?:\/\/([^\s/;"']+)/g)) if (!match[1].replace(/[.,;:)]+$/, "").replace(/:\d+$/, "").toLowerCase().endsWith(".test")) fail("nonreserved hostname", [family.id, level, seed, match[0]]);
      signatures.add(question.structuralSignature);
      if (sample < 50) {
        const translated = sv.generateQuestion(family.id, level, seed);
        if (!equal(question.canonicalAnswer, translated.canonicalAnswer) || !sv.checkQuestion(translated.canonicalAnswer, translated).correct) fail("bilingual answer parity", [family.id, level, seed]);
        const translatedVisible = [translated.prompt.title, translated.explanation, ...translated.prompt.blocks.map((block) => block.text || block.caption || ""), ...translated.fields.flatMap((field) => (field.options || []).map((option) => option.label))].join("\n");
        if (proseLeak.test(translatedVisible)) fail("Swedish generated prose leak", [family.id, level, seed, translatedVisible]);
      }
      generated += 1;
    }
    if (signatures.size < 2) fail("structural variation", [family.id, level]);
  }
}

// Independent references for the per-level generators, checked against what each question shows.
function answerLabel(question, id = "answer") {
  const field = question.fields.find((item) => item.id === id);
  return field.options ? field.options.find((option) => option.value === field.answer).label : field.answer;
}
function percentEncodeRef(text, safeSet) {
  return [...new TextEncoder().encode(text)].map((byte) => byte < 128 && safeSet.includes(String.fromCharCode(byte)) ? String.fromCharCode(byte) : `%${byte.toString(16).toUpperCase().padStart(2, "0")}`).join("");
}
function percentDecodeRef(text) {
  if (/%(?![0-9A-Fa-f]{2})/.test(text)) return "error: invalid percent triplet";
  const bytes = []; for (let i = 0; i < text.length; i += 1) { if (text[i] === "%") { bytes.push(parseInt(text.slice(i + 1, i + 3), 16)); i += 2; } else bytes.push(...new TextEncoder().encode(text[i])); }
  try { return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes)); } catch { return "error: invalid UTF-8"; }
}
function conditionalRef(method, current, lastModified, c) {
  const strong = (a, b) => a === b && !a.startsWith("W/") && !b.startsWith("W/"), weak = (a, b) => a.replace(/^W\//, "") === b.replace(/^W\//, "");
  const list = (value, cmp) => value === "*" || value.split(",").some((tag) => cmp(tag.trim(), current));
  if (c.im !== undefined) { if (!list(c.im, strong)) return 412; } else if (c.ius !== undefined && lastModified > c.ius) return 412;
  if (c.inm !== undefined) { if (list(c.inm, weak)) return method === "GET" || method === "HEAD" ? 304 : 412; }
  else if (c.ims !== undefined && (method === "GET" || method === "HEAD") && lastModified <= c.ims) return 304;
  return 200;
}
function storageRef(kind, d, cacheable, authorized) {
  if (d.noStore) return "no-store"; if (kind === "shared" && d.private) return "private";
  if (kind === "shared" && authorized && !(d.public || d.sMaxage !== undefined || d.mustRevalidate)) return "authorization";
  if (!cacheable && d.maxAge === undefined && d.sMaxage === undefined && !d.public) return "notCacheable";
  return d.noCache ? "storeValidate" : "store";
}
function lifetimeRef(kind, m) {
  if (kind === "shared" && m.sMaxage !== undefined) return [m.sMaxage, "s-maxage"];
  if (m.maxAge !== undefined) return [m.maxAge, "max-age"];
  if (m.expires !== undefined && m.date !== undefined) return [Math.max(0, m.expires - m.date), "Expires-Date"];
  return [0, "none"];
}
function cookieSendRef(c, ctx) {
  const url = new URL(ctx.url);
  if (c.expiry !== null && c.expiry <= ctx.now) return false;
  if (c.hostOnly ? url.hostname !== c.domain : !(url.hostname === c.domain || url.hostname.endsWith(`.${c.domain}`))) return false;
  if (!pathReference(url.pathname, c.path)) return false;
  if (c.secure && url.protocol !== "https:") return false;
  if (ctx.credentials === "omit" || (ctx.credentials === "same-origin" && !ctx.sameOrigin)) return false;
  if (c.sameSite === "Strict" && !ctx.sameSite) return false;
  if (c.sameSite === "Lax" && !ctx.sameSite && !(ctx.topLevel && ["GET", "HEAD", "OPTIONS"].includes(ctx.method))) return false;
  return true;
}
function corsReasonsRef(req) {
  if (req.sameOrigin) return [];
  const reasons = [];
  if (!["GET", "HEAD", "POST"].includes(req.method)) reasons.push("method");
  for (const [name, value] of Object.entries(req.fields)) {
    const lower = name.toLowerCase();
    if (lower === "content-type") { if (!["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"].includes(value.split(";")[0].trim().toLowerCase())) reasons.push("content-type"); }
    else if (!["accept", "accept-language", "content-language"].includes(lower)) reasons.push(`field ${lower}`);
  }
  return reasons;
}
function preflightRef(req, res) {
  if (!(req.credentials ? res.acao === req.origin && res.acac === true : res.acao === "*" || res.acao === req.origin)) return "origin";
  if (!["GET", "HEAD", "POST"].includes(req.method) && !res.methods.map((m) => m.toUpperCase()).includes(req.method)) return "method";
  const allowed = res.headers.map((h) => h.toLowerCase());
  return req.headers.some((h) => !allowed.includes(h.toLowerCase())) ? "headers" : "ok";
}
function timelineRef({ events, versions, policy }) {
  const store = new Map(); let calls = 0; const out = [];
  for (const ev of events) {
    const v = versions.filter((x) => x.from <= ev.t).at(-1), key = policy.vary ? ev.accept : "*", entry = store.get(key), body = policy.vary ? `${v.body}(${ev.accept})` : v.body;
    if (entry && ev.t - entry.at < policy.maxAge) { out.push(`t${ev.t} fresh hit → ${entry.body}`); continue; }
    calls += 1;
    if (entry && policy.etag) { if (entry.tag === v.tag) { entry.at = ev.t; out.push(`t${ev.t} validated, 304 → ${entry.body}`); } else { store.set(key, { body, tag: v.tag, at: ev.t }); out.push(`t${ev.t} validated, new 200 → ${body}`); } continue; }
    if (policy.noStore) { out.push(`t${ev.t} miss, not stored → ${body}`); continue; }
    store.set(key, { body, tag: v.tag, at: ev.t }); out.push(`t${ev.t} miss, stored → ${body}`);
  }
  return `${out.join("; ")}; origin calls ${calls}`;
}
function partition(keys) { const seen = new Map(); return keys.map((k) => { if (!seen.has(k)) seen.set(k, seen.size); return seen.get(k); }).join(","); }
let referenceChecks = 0;
for (const family of en.families) for (let level = 1; level <= 5; level += 1) for (let sample = 0; sample < 2_000; sample += 1) {
  const seed = (level * 9_000_011 + sample * 104_729 + family.id.length) >>> 0, q = en.generateQuestion(family.id, level, seed), m = q.metadata, where = [family.id, level, seed];
  if (m.resolve) { if (answerLabel(q) !== new URL(m.resolve.ref, m.resolve.base).href) fail("WHATWG Location resolution", where); referenceChecks += 1; }
  if (m.percent) { const want = m.percent.decode ? percentDecodeRef(m.percent.input) : percentEncodeRef(m.percent.input, m.percent.safe); if (answerLabel(q) !== want) fail("percent-encoding reference", [...where, want]); referenceChecks += 1; }
  if (m.negotiation && family.id === "accept_negotiation") { const want = negotiateReference(m.negotiation.accept, m.negotiation.offers); if (want === null ? answerLabel(q) !== "406" : !answerLabel(q).startsWith(`${want} (`)) fail("negotiation reference", where); referenceChecks += 1; }
  if (m.negotiation && family.id === "negotiation_response_fields" && !m.negotiation.accept2) { const want = negotiateReference(m.negotiation.accept, m.negotiation.offers); if (!answerLabel(q).startsWith(want === null ? "status 406" : `status 200; Content-Type ${want};`)) fail("negotiation fields reference", where); referenceChecks += 1; }
  if (m.chain) {
    let url = m.chain.start, method = m.chain.method, requests = 1, outcome = "final"; const seen = [url];
    for (let i = 0; i < m.chain.statuses.length; i += 1) { const next = new URL(m.chain.locs[i], url).href, nextMethod = redirectReference(m.chain.statuses[i], method); if (seen.includes(next)) { outcome = "loop"; method = nextMethod; break; } if (i + 1 > m.chain.limit) { outcome = "limit"; break; } url = next; method = nextMethod; seen.push(url); requests += 1; }
    if (outcome !== m.chain.outcome || method !== m.chain.finalMethod || requests !== m.chain.requests) fail("redirect chain reference", [...where, outcome, method, requests]); referenceChecks += 1;
  }
  if (m.conditional) { const c = m.conditional; if (conditionalRef(c.method, c.cur, c.lm, c.c) !== c.status) fail("conditional request reference", where); referenceChecks += 1; }
  if (m.storage) { const s = m.storage, want = s.kind === "both" ? [storageRef("private", s.d, s.cacheable, s.authorized), storageRef("shared", s.d, s.cacheable, s.authorized)] : storageRef(s.kind, s.d, s.cacheable, s.authorized); if (!equal(want, s.answer)) fail("cache storage reference", where); referenceChecks += 1; }
  if (m.freshness) { const [seconds, source] = lifetimeRef(m.freshness.kind, m.freshness.m); if (Number(q.canonicalAnswer.answer) !== seconds || q.canonicalAnswer.source !== source) fail("freshness lifetime reference", where); referenceChecks += 1; }
  if (m.cookieSelect) { const { jar, ctx } = m.cookieSelect, want = jar.filter((c) => cookieSendRef(c, ctx)).sort((a, b) => b.path.length - a.path.length || a.creationIndex - b.creationIndex).map((c) => `${c.name}=${c.value}`); if (answerLabel(q) !== (want.length ? `Cookie: ${want.join("; ")}` : "no Cookie field")) fail("cookie selection reference", [...where, want]); referenceChecks += 1; }
  if (m.corsClass) { if (!equal(corsReasonsRef(m.corsClass.req), m.corsClass.res.reasons)) fail("CORS classification reference", where); referenceChecks += 1; }
  if (m.preflight) { const want = preflightRef(m.preflight.req, m.preflight.res), got = m.preflight.result.ok ? "ok" : m.preflight.result.why; if (want !== got) fail("preflight reference", [...where, want, got]); referenceChecks += 1; }
  if (m.corsExpose) { const e = m.corsExpose, want = e.acao !== null && (e.cred ? e.acao === e.origin && e.acac === true : e.acao === "*" || e.acao === e.origin); if (want !== e.readable) fail("CORS exposure reference", where); referenceChecks += 1; }
  if (m.timeline) { if (answerLabel(q) !== timelineRef(m.timeline)) fail("cache timeline reference", where); referenceChecks += 1; }
  if (m.cacheKey) { const { reqs, vary, keys } = m.cacheKey, ref = reqs.map(({ url, fields }) => { const u = new URL(url); return `${u.origin}${u.pathname}${u.search}` + vary.map((name) => `|${Object.entries(fields).find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1] ?? "<missing>"}`).join(""); }); if (partition(ref) !== partition(keys)) fail("cache key reference", where); referenceChecks += 1; }
}

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
console.log(`HTTP/web extended validation passed: 495,000 independent oracle/property instances, ${referenceChecks.toLocaleString("en-US")} independent reference checks of generated questions (WHATWG URL, TextDecoder, RFC 9110/9111/6265, Fetch CORS), and ${generated.toLocaleString("en-US")} generated questions (10,000 per family and level), with bilingual seed parity.`);
