import vm from "node:vm";

const html = await Bun.file("dist/programmer-low-level-numeracy.html").text();
const scriptMatch = html.match(/<script>\n([\s\S]*)\n  <\/script>/);

if (!scriptMatch) {
  throw new Error("Could not find inline app script");
}

const script = scriptMatch[1];
new Function(script);

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
  throw new Error("window.runSelfTests() was not exposed");
}

const result = context.window.runSelfTests();
if (!result.ok) {
  throw new Error(`Self-tests failed: ${JSON.stringify(result.failures)}`);
}

console.log("self-tests passed");
