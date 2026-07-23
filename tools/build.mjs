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
    locales: ["en", "sv"],
  },
  {
    id: "everyday-economics",
    sourceDir: "apps/everyday-economics",
    outputBase: "everyday-economics",
    locales: ["en", "sv"],
  },
  {
    id: "floating-point-practice",
    sourceDir: "apps/floating-point-practice",
    outputBase: "floating-point-practice",
    locales: ["en", "sv"],
  },
  {
    id: "cpp-mental-execution",
    sourceDir: "apps/cpp-mental-execution",
    outputBase: "cpp-mental-execution",
    locales: ["en", "sv"],
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

function appOutputHref(app, locale) {
  return `${app.outputBase}${locale.suffix || ""}.html`;
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

async function buildIndex() {
  const rows = [];
  for (const app of apps) {
    const locales = [];
    for (const code of app.locales) {
      const locale = await loadLocale(app, code);
      locales.push({ locale, href: appOutputHref(app, locale) });
    }
    const primary = locales[0];
    const title = primary.locale.text.appTitle;
    const subtitle = primary.locale.text.brandSubtitle;
    const links = locales.map(({ locale, href }) => {
      const label = locale.code === "en" ? "English" : locale.code;
      return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    }).join(" ");
    rows.push(`<li><h2><a href="${escapeHtml(primary.href)}">${escapeHtml(title)}</a></h2><p>${escapeHtml(subtitle)}</p><p class="links">${links}</p></li>`);
  }

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Practice Lab</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1f2933; background: #f4f0e8; }
    body { margin: 0; }
    main { width: min(920px, calc(100vw - 32px)); margin: 0 auto; padding: 48px 0; }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 6vw, 4rem); line-height: 1; }
    p { color: #52606d; line-height: 1.55; }
    ul { display: grid; gap: 12px; margin: 32px 0 0; padding: 0; list-style: none; }
    li { padding: 18px 20px; border: 1px solid #d8cfc1; border-radius: 8px; background: #fffaf1; }
    h2 { margin: 0 0 6px; font-size: 1.2rem; }
    a { color: #0f5f72; font-weight: 800; text-decoration-thickness: 0.12em; text-underline-offset: 0.16em; }
    .links { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 0; }
  </style>
</head>
<body>
  <main>
    <h1>Practice Lab</h1>
    <p>Small offline practice apps for programmer-adjacent skills and adjacent numeracy. Each app stores progress locally in your browser.</p>
    <ul>
      ${rows.join("\n      ")}
    </ul>
  </main>
</body>
</html>
`;
  await Bun.write("dist/index.html", html);
  await Bun.write("dist/.nojekyll", "");
  console.log("built dist/index.html");
}

for (const app of apps) {
  await buildApp(app);
}

await buildIndex();
