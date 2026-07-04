import vm from "node:vm";

const outputs = [
  "dist/programmer-low-level-numeracy.html",
  "dist/programmer-low-level-numeracy.sv.html",
  "dist/mental-arithmetic.html",
  "dist/mental-arithmetic.sv.html",
  "dist/everyday-economics.html",
  "dist/everyday-economics.sv.html",
];

for (const output of outputs) {
  const html = await Bun.file(output).text();
  const scriptMatch = html.match(/<script>\n([\s\S]*)\n  <\/script>/);

  if (!scriptMatch) {
    throw new Error(`${output}: could not find inline app script`);
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
    throw new Error(`${output}: window.runSelfTests() was not exposed`);
  }

  const result = context.window.runSelfTests();
  if (!result.ok) {
    throw new Error(`${output}: self-tests failed: ${JSON.stringify(result.failures)}`);
  }

  console.log(`${output}: self-tests passed`);
}

console.log("all self-tests passed");
