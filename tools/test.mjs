import vm from "node:vm";

class FakeEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = Boolean(options.bubbles);
    this.defaultPrevented = false;
    this.target = null;
  }
  preventDefault() { this.defaultPrevented = true; }
}

class FakeClassList {
  constructor(element) { this.element = element; this.values = new Set(); }
  add(...values) { values.forEach((value) => this.values.add(value)); this.sync(); }
  contains(value) { return this.values.has(value); }
  sync() { this.element._className = [...this.values].join(" "); }
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.dataset = {};
    this.style = {};
    this.classList = new FakeClassList(this);
    this._className = "";
    this.value = "";
    this.textContent = "";
    this.disabled = false;
    this.selectionStart = 0;
    this.selectionEnd = 0;
  }
  set className(value) {
    this._className = String(value);
    this.classList.values = new Set(String(value).split(/\s+/).filter(Boolean));
  }
  get className() { return this._className; }
  appendChild(child) { this.children.push(child); child.parentElement = this; return child; }
  replaceChildren(...children) { this.children = []; children.forEach((child) => this.appendChild(child)); }
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(callback);
  }
  removeEventListener(type, callback) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter((item) => item !== callback));
  }
  dispatchEvent(event) {
    event.target ||= this;
    (this.listeners.get(event.type) || []).slice().forEach((callback) => callback(event));
    return !event.defaultPrevented;
  }
  click() { this.dispatchEvent(new FakeEvent("click")); }
  closest(selector) { return selector === "button" && this.tagName === "BUTTON" ? this : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
  setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; }
}

class FakeDocument {
  constructor() {
    this.defaultView = { Event: FakeEvent };
    this.activeElement = null;
  }
  createElement(tagName) { return new FakeElement(tagName, this); }
}

async function runSharedUiTests() {
  const source = await Bun.file("shared/practice-ui.js").text();
  const fakeDocument = new FakeDocument();
  const window = { Event: FakeEvent, document: fakeDocument };
  vm.runInNewContext(source, { window, document: fakeDocument, console, Map, Set, WeakMap });
  const ui = window.PracticeLabUI;
  const assert = (condition, message) => { if (!condition) throw new Error(`shared UI: ${message}`); };

  const grid = fakeDocument.createElement("div");
  let presses = 0;
  const buttons = ui.renderInputGrid(grid, [
    [["7", () => { presses += 1; }], ["Enter", () => { presses += 10; }, { id: "submit", variant: "primary", colspan: 2, ariaLabel: "Submit answer" }]],
    [["Clear", () => {}, { variant: "function", disabled: true }]],
  ], { ariaLabel: "Test keypad" });
  assert(grid.children.length === 2, "explicit rows are rendered");
  assert(buttons.get("submit").type === "button", "buttons never submit implicitly");
  assert(buttons.get("submit").classList.contains("primary"), "button variants are applied");
  assert(buttons.get("submit").style.gridColumn === "span 2", "colspan is applied");
  assert(buttons.get("submit").getAttribute("aria-label") === "Submit answer", "accessible label is applied");
  grid.children[0].children[0].click();
  buttons.get("submit").click();
  assert(presses === 11, "callbacks run once per press");
  const pointerEvent = new FakeEvent("pointerdown");
  pointerEvent.target = buttons.get("submit");
  grid.dispatchEvent(pointerEvent);
  assert(pointerEvent.defaultPrevented, "pointer presses preserve input focus");
  let malformedRejected = false;
  try { ui.renderInputGrid(grid, [["bad"]]); } catch (error) { malformedRejected = true; }
  assert(malformedRejected, "malformed tuples are rejected");

  const input = fakeDocument.createElement("input");
  let inputEvents = 0;
  input.addEventListener("input", () => { inputEvents += 1; });
  const editor = ui.createTextEditor(() => input);
  input.value = "12😀4";
  input.setSelectionRange(1, 4);
  editor.insert("X")();
  assert(input.value === "1X4" && input.selectionStart === 2, "insert replaces the current selection");
  assert(fakeDocument.activeElement === null, "editing does not focus an unfocused input");
  input.focus();
  input.value = "A😀";
  input.setSelectionRange(3, 3);
  editor.backspace();
  assert(input.value === "A" && input.selectionStart === 1, "backspace removes one Unicode code point");
  assert(fakeDocument.activeElement === input, "editing preserves an input that is already focused");
  editor.clear();
  assert(input.value === "" && input.selectionStart === 0 && inputEvents === 3, "clear updates state and emits input");

  const categorySelect = fakeDocument.createElement("select");
  const familySelect = fakeDocument.createElement("select");
  const levelSelect = fakeDocument.createElement("select");
  const selections = [];
  const selectors = ui.createPracticeSelectors({
    categorySelect,
    familySelect,
    levelSelect,
    categories: [{ id: "one", title: "One" }, { id: "two", title: "Two" }],
    families: [{ id: "a", categoryId: "one", title: "A", levels: [1, 2] }, { id: "b", categoryId: "two", title: "B", levels: [3] }],
    levelLabel: (level) => `L${level}`,
    onSelect: (selection) => selections.push(selection),
  });
  selectors.render({ familyId: "a", level: 2 });
  assert(!categorySelect.disabled && !familySelect.disabled && !levelSelect.disabled, "selectors remain enabled");
  assert(levelSelect.children[1].textContent === "L2", "level labels are configurable");
  categorySelect.value = "two";
  categorySelect.dispatchEvent(new FakeEvent("change"));
  assert(selections.length === 1 && selections[0].familyId === "b" && selections[0].level === 3, "category changes report a valid manual selection");
  selectors.destroy();

  console.log("shared practice UI tests passed");
}

await runSharedUiTests();

const outputs = [
  "dist/programmer-low-level-numeracy.html",
  "dist/programmer-low-level-numeracy.sv.html",
  "dist/mental-arithmetic.html",
  "dist/mental-arithmetic.sv.html",
  "dist/number-theory-modular-arithmetic.html",
  "dist/number-theory-modular-arithmetic.sv.html",
  "dist/everyday-economics.html",
  "dist/everyday-economics.sv.html",
  "dist/floating-point-practice.html",
  "dist/floating-point-practice.sv.html",
  "dist/cpp-mental-execution.html",
  "dist/cpp-mental-execution.sv.html",
  "dist/assembly-practice-6502.html",
  "dist/assembly-practice-6502.sv.html",
  "dist/git-version-control.html",
  "dist/git-version-control.sv.html",
  "dist/unicode-encodings-text.html",
  "dist/unicode-encodings-text.sv.html",
  "dist/japanese-numbers-dates.html",
  "dist/japanese-numbers-dates.sv.html",
  "dist/electric-circuits.html",
  "dist/electric-circuits.sv.html",
];

for (const output of outputs) {
  const html = await Bun.file(output).text();

  if (/<script\s+[^>]*src=|<link\s+[^>]*rel=["']stylesheet["']/i.test(html)) {
    throw new Error(`${output}: standalone build contains an external runtime asset`);
  }
  if (/__(?:INLINE|PRACTICE_TOOLS|SETTINGS_EXTRAS)__|\{\{\??[a-zA-Z0-9_.-]+\}\}/.test(html)) {
    throw new Error(`${output}: build contains an unresolved shell placeholder`);
  }
  if (!html.includes("PracticeLabUI") || !html.includes("renderInputGrid")) {
    throw new Error(`${output}: shared practice runtime was not inlined`);
  }

  const scriptMatch = html.match(/<script>\n([\s\S]*)\n  <\/script>/);

  if (!scriptMatch) {
    throw new Error(`${output}: could not find inline app script`);
  }

  const script = scriptMatch[1];
  new Function(script);

  if (/\b(?:categorySelect|familySelect|levelSelect)\.disabled\s*=\s*(?:true|progress\.settings\.adaptive)/.test(script)) {
    throw new Error(`${output}: practice selectors must remain interactive in adaptive mode`);
  }

  const context = {
    window: {},
    document: {
      addEventListener() {},
    },
    console,
  };

  vm.createContext(context);
  vm.runInContext(script, context);

  if (typeof context.window.runSelfTests !== "function") {
    throw new Error(`${output}: window.runSelfTests() was not exposed`);
  }

  const result = context.window.runSelfTests();
  if (!result.ok) {
    throw new Error(`${output}: self-tests failed: ${JSON.stringify(result.failures)}`);
  }

  console.log(`${output}: self-tests passed`);
}

console.log("all self-tests passed");
