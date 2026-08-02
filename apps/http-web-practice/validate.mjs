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
      for (const match of visible.matchAll(/https?:\/\/([^\s/;"']+)/g)) if (!match[1].replace(/:\d+$/, "").toLowerCase().endsWith(".test")) fail("nonreserved hostname", [family.id, level, seed, match[0]]);
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

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`HTTP/web extended validation passed: 495,000 independent oracle/property instances and ${generated.toLocaleString("en-US")} generated questions (10,000 per family and level), with bilingual seed parity.`);
