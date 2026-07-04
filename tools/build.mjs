const apps = [
  {
    id: "programmer-low-level-numeracy",
    sourceDir: "apps/programmer-low-level-numeracy",
    outputBase: "programmer-low-level-numeracy",
    locales: ["en", "sv"],
  },
  {
    id: "mental-arithmetic",
    sourceDir: "apps/mental-arithmetic",
    outputBase: "mental-arithmetic",
    locales: ["en"],
  },
];

async function readText(path) {
  return await Bun.file(path).text();
}

function getPath(object, path) {
  return path.split(".").reduce((current, part) => {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      return current[part];
    }
    return undefined;
  }, object);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function applyTemplate(template, locale, app) {
  return template.replace(/\{\{([a-zA-Z0-9_.-]+)\}\}/g, (match, key) => {
    const value = getPath({ ...locale, app }, key) ?? getPath(locale.text, key);
    if (value === undefined) {
      throw new Error(`${app.id}/${locale.code}: missing template key ${key}`);
    }
    return escapeHtml(value);
  });
}

function outputPath(app, locale) {
  return `dist/${app.outputBase}${locale.suffix || ""}.html`;
}

async function loadLocale(app, code) {
  const module = await import(`../${app.sourceDir}/locales/${code}.mjs`);
  return module.default;
}

async function buildAppLocale(app, locale, source) {
  let js = source.js.replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  let html = applyTemplate(source.template, locale, app);
  html = html.replace("/* __INLINE_CSS__ */", source.css.trimEnd());
  html = html.replace("// __INLINE_JS__", js.trimEnd());

  if (html.includes("__INLINE_CSS__") || html.includes("__INLINE_JS__") || html.includes("__LOCALE_TEXT__")) {
    throw new Error(`${app.id}/${locale.code}: build placeholders were not replaced`);
  }

  if (/\{\{[a-zA-Z0-9_.-]+\}\}/.test(html)) {
    throw new Error(`${app.id}/${locale.code}: template placeholders were not replaced`);
  }

  await Bun.$`mkdir -p dist`.quiet();
  const output = outputPath(app, locale);
  await Bun.write(output, html);
  console.log(`built ${output}`);
}

async function buildApp(app) {
  const source = {
    template: await readText(`${app.sourceDir}/template.html`),
    css: await readText(`${app.sourceDir}/style.css`),
    js: await readText(`${app.sourceDir}/main.js`),
  };

  for (const code of app.locales) {
    await buildAppLocale(app, await loadLocale(app, code), source);
  }
}

for (const app of apps) {
  await buildApp(app);
}
