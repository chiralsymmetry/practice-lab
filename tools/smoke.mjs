// Browser smoke test for the built apps.
//
// Loads every dist/*.html page in headless Chromium/Chrome through the DevTools protocol (no npm
// dependencies) and fails on: uncaught exceptions or console errors; a family whose question renders
// no answer controls or whose submission shows no feedback; and, at phone width, horizontal page
// overflow, overlapping controls, or button labels wider than their button.
//
// Browser lookup: $PRACTICE_LAB_BROWSER, then chromium, chromium-browser, google-chrome,
// google-chrome-stable on PATH. Set PRACTICE_LAB_SKIP_BROWSER=1 to skip explicitly.
// Usage: bun tools/smoke.mjs [page-name-filter ...]

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const DIST = join(ROOT, "dist");
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };
const VIEWS = ["practice", "matrix", "stats", "settings", "learn"];

if (process.env.PRACTICE_LAB_SKIP_BROWSER === "1") {
  console.log("Browser smoke test skipped (PRACTICE_LAB_SKIP_BROWSER=1).");
  process.exit(0);
}

function findBrowser() {
  const candidates = [process.env.PRACTICE_LAB_BROWSER, "chromium", "chromium-browser", "google-chrome", "google-chrome-stable"].filter(Boolean);
  for (const name of candidates) {
    const found = spawnSync("sh", ["-c", `command -v "${name}"`], { encoding: "utf8" });
    if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  }
  return null;
}

const browserPath = findBrowser();
if (!browserPath) {
  console.error("Browser smoke test: no Chromium/Chrome found. Install one, set PRACTICE_LAB_BROWSER, or set PRACTICE_LAB_SKIP_BROWSER=1 to skip explicitly.");
  process.exit(1);
}

const filters = process.argv.slice(2);
const pages = readdirSync(DIST).filter((name) => name.endsWith(".html") && (!filters.length || filters.some((f) => name.includes(f)))).sort();
if (!pages.length) { console.error("Browser smoke test: no matching pages in dist/. Run tools/build.sh first."); process.exit(1); }

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const profile = mkdtempSync(join(tmpdir(), "practice-lab-smoke-"));

// Launch headless and wait for the DevTools endpoint. Hosts that forbid unprivileged user namespaces
// (for example GitHub's Ubuntu 24.04 runners under AppArmor) kill Chrome's sandbox at startup, so a
// failed sandboxed launch is retried once with --no-sandbox; the pages loaded are local build output.
async function launch(sandbox) {
  const port = 9400 + Math.floor(Math.random() * 400);
  const args = ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", "--disable-gpu", "about:blank"];
  if (!sandbox) args.unshift("--no-sandbox");
  const child = spawn(browserPath, args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "", exited = false;
  child.stderr.on("data", (chunk) => { stderr = (stderr + chunk).slice(-4000); });
  child.on("exit", () => { exited = true; });
  for (let attempt = 0; attempt < 200 && !exited; attempt += 1) {
    try { return { child, version: await (await fetch(`http://127.0.0.1:${port}/json/version`)).json() }; } catch { await sleep(100); }
  }
  child.kill();
  return { child: null, version: null, stderr };
}

const isRoot = typeof process.getuid === "function" && process.getuid() === 0;
let { child: browser, version, stderr: launchError } = await launch(!isRoot);
if (!version && !isRoot) {
  console.log("Browser smoke test: sandboxed launch failed; retrying with --no-sandbox.");
  ({ child: browser, version, stderr: launchError } = await launch(false));
}
if (!version) {
  console.error(`Browser smoke test: the browser did not start (${browserPath}).${launchError ? `\n${launchError.trim()}` : ""}`);
  process.exit(1);
}

const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolveOpen) => socket.addEventListener("open", resolveOpen, { once: true }));
let nextId = 1;
const pending = new Map();
const listeners = new Set();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolveCall, rejectCall } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectCall(new Error(JSON.stringify(message.error))); else resolveCall(message.result);
  } else listeners.forEach((listener) => listener(message));
});
const send = (method, params = {}, sessionId) => new Promise((resolveCall, rejectCall) => {
  const id = nextId++;
  pending.set(id, { resolveCall, rejectCall });
  socket.send(JSON.stringify({ id, method, params, sessionId }));
});

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const call = (method, params) => send(method, params, sessionId);
await call("Page.enable");
await call("Runtime.enable");

let pageErrors = [];
listeners.add((message) => {
  if (message.sessionId !== sessionId) return;
  if (message.method === "Runtime.exceptionThrown") {
    const details = message.params.exceptionDetails;
    pageErrors.push((details.exception && details.exception.description) || details.text);
  } else if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    pageErrors.push("console.error: " + message.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" "));
  }
});

async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error((result.exceptionDetails.exception && result.exceptionDetails.exception.description) || result.exceptionDetails.text);
  return result.result.value;
}
async function setViewport({ width, height }, mobile) {
  await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  await call("Emulation.setTouchEmulationEnabled", { enabled: mobile });
}
async function open(page) {
  const loaded = new Promise((resolveLoad) => {
    const listener = (message) => { if (message.sessionId === sessionId && message.method === "Page.loadEventFired") { listeners.delete(listener); resolveLoad(); } };
    listeners.add(listener);
  });
  await call("Page.navigate", { url: "file://" + join(DIST, page) });
  await loaded;
  await evaluate(PAGE_HELPERS);
}

// Runs inside the page.
const PAGE_HELPERS = String.raw`
window.__smoke = {
  tick: () => new Promise((r) => setTimeout(r, 0)),
  visible(el) {
    if (!el || el.closest(".hidden,[hidden]")) return false;
    const style = getComputedStyle(el), rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
  },
  describe(el) {
    let s = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "");
    const text = (el.innerText || el.value || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 32);
    return text ? s + ' "' + text + '"' : s;
  },
  inScroller(el) {
    for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll") return true; }
    return false;
  },
  async setView(view) { const b = document.querySelector('[data-view="' + view + '"]'); if (b) { b.click(); await __smoke.tick(); } },
  controlCount() { return [...document.querySelectorAll("#answerControls input, #answerControls select, #answerControls textarea, #answerControls button")].filter(__smoke.visible).length; },
  feedbackShown() { const f = document.getElementById("feedback"); return Boolean(f && __smoke.visible(f) && f.innerText.trim()); },
  async answerSomething() {
    document.querySelectorAll("#answerControls input:not([type=radio]):not([type=checkbox]), #answerControls textarea").forEach((i) => { if (!i.disabled) { i.value = "0"; i.dispatchEvent(new Event("input", { bubbles: true })); } });
    document.querySelectorAll("#answerControls select").forEach((s) => { if (!s.disabled && s.options.length > 1) { s.selectedIndex = s.options.length - 1; s.dispatchEvent(new Event("change", { bubbles: true })); } });
    const radio = document.querySelector("#answerControls input[type=radio]"); if (radio) radio.click();
  },
  async exerciseFamilies() {
    const problems = [], cat = document.getElementById("categorySelect"), fam = document.getElementById("familySelect");
    const fire = (el) => el.dispatchEvent(new Event("change", { bubbles: true }));
    await __smoke.setView("practice");
    let families = 0;
    for (const category of [...cat.options].map((o) => o.value)) {
      cat.value = category; fire(cat); await __smoke.tick();
      for (const family of [...fam.options].map((o) => o.value)) {
        fam.value = family; fire(fam); await __smoke.tick(); families += 1;
        if (!__smoke.controlCount()) { problems.push("no answer controls for family " + family); continue; }
        const submit = document.getElementById("submitBtn");
        submit.click(); await __smoke.tick();
        if (!__smoke.feedbackShown()) { await __smoke.answerSomething(); submit.click(); await __smoke.tick(); }
        if (!__smoke.feedbackShown()) problems.push("no feedback after submitting family " + family);
      }
    }
    if (!families) problems.push("no families in the selectors");
    return problems;
  },
  layoutProblems(scope) {
    const problems = [], width = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > width + 1) {
      // Name the outermost elements that stick out (ignoring content inside its own scroller) and the question on screen.
      const sticking = [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > width + 1 && __smoke.visible(el) && !__smoke.inScroller(el));
      const outermost = sticking.filter((el) => !sticking.includes(el.parentElement)).slice(0, 3).map((el) => __smoke.describe(el) + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : "") + " (right " + Math.round(el.getBoundingClientRect().right) + "px)");
      const shown = [document.getElementById("questionFamily"), document.getElementById("questionLevel")].map((el) => el ? el.textContent.trim() : "").filter(Boolean).join(" ");
      problems.push(scope + ": page scrolls horizontally (" + document.documentElement.scrollWidth + "px > " + width + "px)" + (outermost.length ? "; sticking out: " + outermost.join(", ") : "") + (shown ? "; question: " + shown : ""));
    }
    const view = document.querySelector(".view.active") || document.body;
    const scopeEls = [...document.querySelectorAll("header *, nav *"), ...view.querySelectorAll("*")];
    const controls = scopeEls.filter((el) => el.matches("button, input, select, textarea") && __smoke.visible(el));
    for (const el of controls) {
      if (el.tagName === "BUTTON" && el.scrollWidth > el.clientWidth + 1 && !__smoke.inScroller(el)) problems.push(scope + ": label wider than its button: " + __smoke.describe(el) + " (" + el.scrollWidth + "px > " + el.clientWidth + "px)");
      const r = el.getBoundingClientRect();
      if (r.right > width + 1 && !__smoke.inScroller(el)) problems.push(scope + ": control past the right edge: " + __smoke.describe(el));
    }
    for (let i = 0; i < controls.length; i += 1) for (let j = i + 1; j < controls.length; j += 1) {
      const a = controls[i], b = controls[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (x > 3 && y > 3) problems.push(scope + ": controls overlap: " + __smoke.describe(a) + " / " + __smoke.describe(b));
    }
    return problems;
  }
};`;

const failures = [];
const started = Date.now();
for (const page of pages) {
  const problems = [];
  try {
    pageErrors = [];
    await setViewport(DESKTOP, false);
    await open(page);
    const isApp = await evaluate(`Boolean(document.getElementById("answerControls") && document.getElementById("familySelect"))`);
    if (isApp) {
      problems.push(...await evaluate(`__smoke.exerciseFamilies()`));
      // Phone layout, after the run above has populated stats and left feedback on screen.
      await setViewport(PHONE, true);
      await open(page);
      for (const view of VIEWS) {
        await evaluate(`__smoke.setView(${JSON.stringify(view)})`);
        problems.push(...await evaluate(`__smoke.layoutProblems("phone/${view}")`));
      }
      await evaluate(`(async () => { await __smoke.setView("practice"); document.getElementById("submitBtn").click(); await __smoke.tick(); if (!__smoke.feedbackShown()) { await __smoke.answerSomething(); document.getElementById("submitBtn").click(); await __smoke.tick(); } })()`);
      problems.push(...await evaluate(`__smoke.layoutProblems("phone/practice+feedback")`));
    } else {
      await setViewport(PHONE, true);
      await open(page);
      problems.push(...await evaluate(`__smoke.layoutProblems("phone/index")`));
    }
  } catch (error) {
    problems.push("smoke harness error: " + error.message);
  }
  problems.push(...pageErrors.map((error) => "page error: " + String(error).split("\n").slice(0, 2).join(" | ")));
  const unique = [...new Set(problems)];
  if (unique.length) failures.push([page, unique]);
  console.log(`${unique.length ? "FAIL" : "ok  "} ${page}${unique.length ? ` (${unique.length} problem${unique.length === 1 ? "" : "s"})` : ""}`);
}

socket.close();
browser.kill();
await sleep(200);
rmSync(profile, { recursive: true, force: true });

if (failures.length) {
  console.error("\nBrowser smoke test failures:");
  for (const [page, problems] of failures) {
    console.error(`\n${page}`);
    problems.slice(0, 25).forEach((problem) => console.error("  - " + problem));
    if (problems.length > 25) console.error(`  … ${problems.length - 25} more`);
  }
  process.exit(1);
}
console.log(`Browser smoke test passed: ${pages.length} pages in ${((Date.now() - started) / 1000).toFixed(1)}s (${browserPath}).`);
