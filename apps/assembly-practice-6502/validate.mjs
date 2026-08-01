import vm from "node:vm";

const locale = (await import("./locales/en.mjs")).default;
const source = (await Bun.file(new URL("./main.js", import.meta.url)).text())
  .replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
const context = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(source, context);

const app = context.window.Assembly6502Practice;
if (!app || app.modelId !== "mos6502-nmos-v1") throw new Error("6502 app did not expose the declared model");

const adcQuirk = app.oracles.adcDecimalNmos(0x45, 0x55, 0);
if (adcQuirk.A !== 0x00 || adcQuirk.C !== 1 || adcQuirk.N !== 1 || adcQuirk.V !== 1 || adcQuirk.Z !== 0) {
  throw new Error(`NMOS decimal ADC reference mismatch: ${JSON.stringify(adcQuirk)}`);
}
const sbcReference = app.oracles.sbcDecimalNmos(0x50, 0x01, 1);
if (sbcReference.A !== 0x49 || sbcReference.C !== 1) {
  throw new Error(`NMOS decimal SBC reference mismatch: ${JSON.stringify(sbcReference)}`);
}

let generated = 0;
for (let familyIndex = 0; familyIndex < app.families.length; familyIndex += 1) {
  const family = app.families[familyIndex];
  for (let level = 1; level <= 5; level += 1) {
    const signatures = new Set();
    for (let sample = 0; sample < 10_000; sample += 1) {
      const seed = ((familyIndex + 1) * 100_000_000 + level * 10_000 + sample + 1) >>> 0;
      const question = app.generateQuestion(family.id, level, seed, true);
      const result = app.checkQuestion(question.canonicalAnswer, question);
      if (!result.correct) throw new Error(`Canonical answer rejected for ${family.id} L${level} seed ${seed}`);
      if (question.modelId !== app.modelId || question.familyId !== family.id || question.level !== level) {
        throw new Error(`Metadata mismatch for ${family.id} L${level} seed ${seed}`);
      }
      signatures.add(question.structuralSignature);
      generated += 1;
    }
    if (signatures.size < 2) throw new Error(`Generator lacks structural variation: ${family.id} L${level}`);
  }
}

console.log(`6502 extended validation passed: ${generated.toLocaleString("en-US")} generated questions (10,000 per family/level), NMOS decimal references`);
