const apps = [
  {
    id: "programmer-low-level-numeracy",
    sourceDir: "apps/programmer-low-level-numeracy",
    output: "dist/programmer-low-level-numeracy.html",
  },
];

async function readText(path) {
  return await Bun.file(path).text();
}

async function buildApp(app) {
  const template = await readText(`${app.sourceDir}/template.html`);
  const css = await readText(`${app.sourceDir}/style.css`);
  const js = await readText(`${app.sourceDir}/main.js`);

  let html = template.replace("/* __INLINE_CSS__ */", css.trimEnd());
  html = html.replace("// __INLINE_JS__", js.trimEnd());

  if (html.includes("__INLINE_CSS__") || html.includes("__INLINE_JS__")) {
    throw new Error(`${app.id}: template placeholders were not replaced`);
  }

  await Bun.$`mkdir -p dist`.quiet();
  await Bun.write(app.output, html);
  console.log(`built ${app.output}`);
}

for (const app of apps) {
  await buildApp(app);
}
