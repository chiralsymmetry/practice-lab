const categories = [
  {
    id: "computing-operations",
    title: "Computing and operations",
  },
  {
    id: "mathematics-data",
    title: "Mathematics and data",
  },
  {
    id: "science-engineering-spatial-reasoning",
    title: "Science, engineering, and spatial reasoning",
  },
  {
    id: "business",
    title: "Business",
  },
  {
    id: "languages-humanities-other-practice",
    title: "Languages, humanities, and other practice",
  },
];

const apps = [
  {
    id: "programmer-low-level-numeracy",
    categoryId: "computing-operations",
    sourceDir: "apps/programmer-low-level-numeracy",
    outputBase: "programmer-low-level-numeracy",
    locales: ["en", "sv"],
    settingsExtras: "apps/programmer-low-level-numeracy/settings-extras.html",
  },
  {
    id: "mental-arithmetic",
    categoryId: "mathematics-data",
    sourceDir: "apps/mental-arithmetic",
    outputBase: "mental-arithmetic",
    locales: ["en", "sv"],
  },
  {
    id: "number-theory-modular-arithmetic",
    categoryId: "mathematics-data",
    sourceDir: "apps/number-theory-modular-arithmetic",
    outputBase: "number-theory-modular-arithmetic",
    locales: ["en", "sv"],
  },
  {
    id: "everyday-economics",
    categoryId: "business",
    sourceDir: "apps/everyday-economics",
    outputBase: "everyday-economics",
    locales: ["en", "sv"],
    practiceTools: "apps/everyday-economics/practice-tools.html",
    settingsExtras: "apps/everyday-economics/settings-extras.html",
  },
  {
    id: "floating-point-practice",
    categoryId: "computing-operations",
    sourceDir: "apps/floating-point-practice",
    outputBase: "floating-point-practice",
    locales: ["en", "sv"],
  },
  {
    id: "cpp-mental-execution",
    categoryId: "computing-operations",
    sourceDir: "apps/cpp-mental-execution",
    outputBase: "cpp-mental-execution",
    locales: ["en", "sv"],
  },
  {
    id: "assembly-practice-6502",
    categoryId: "computing-operations",
    sourceDir: "apps/assembly-practice-6502",
    outputBase: "assembly-practice-6502",
    locales: ["en", "sv"],
  },
  {
    id: "git-version-control",
    categoryId: "computing-operations",
    sourceDir: "apps/git-version-control",
    outputBase: "git-version-control",
    locales: ["en", "sv"],
  },
  {
    id: "unicode-encodings-text",
    categoryId: "computing-operations",
    sourceDir: "apps/unicode-encodings-text",
    outputBase: "unicode-encodings-text",
    locales: ["en", "sv"],
  },
  {
    id: "computer-science",
    categoryId: "computing-operations",
    sourceDir: "apps/computer-science",
    outputBase: "computer-science",
    locales: ["en", "sv"],
  },
  {
    id: "sql-relational-databases",
    categoryId: "computing-operations",
    sourceDir: "apps/sql-relational-databases",
    outputBase: "sql-relational-databases",
    locales: ["en", "sv"],
  },
  {
    id: "admin-practice",
    categoryId: "computing-operations",
    sourceDir: "apps/admin-practice",
    outputBase: "admin-practice",
    locales: ["en", "sv"],
  },
  {
    id: "http-web-practice",
    categoryId: "computing-operations",
    sourceDir: "apps/http-web-practice",
    outputBase: "http-web-practice",
    locales: ["en", "sv"],
  },
  {
    id: "japanese-numbers-dates",
    categoryId: "languages-humanities-other-practice",
    sourceDir: "apps/japanese-numbers-dates",
    outputBase: "japanese-numbers-dates",
    locales: ["en", "sv"],
  },
  {
    id: "electric-circuits",
    categoryId: "science-engineering-spatial-reasoning",
    sourceDir: "apps/electric-circuits",
    outputBase: "electric-circuits",
    locales: ["en", "sv"],
    practiceTools: "apps/electric-circuits/practice-tools.html",
    settingsExtras: "apps/electric-circuits/settings-extras.html",
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
  return template.replace(/\{\{(\??)([a-zA-Z0-9_.-]+)\}\}/g, (match, optional, key) => {
    const value = getPath({ ...locale, app }, key) ?? getPath(locale.text, key);
    if (value === undefined) {
      if (optional) return "";
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
  let html = source.shell
    .replace("<!-- __PRACTICE_TOOLS__ -->", source.practiceTools)
    .replace("<!-- __SETTINGS_EXTRAS__ -->", source.settingsExtras);
  html = applyTemplate(html, locale, app);
  html = html.replace("/* __INLINE_SHARED_CSS__ */", () => source.sharedCss.trimEnd());
  html = html.replace("/* __INLINE_APP_CSS__ */", () => source.css.trimEnd());
  html = html.replace("// __INLINE_SHARED_JS__", () => source.sharedJs.trimEnd());
  html = html.replace("// __INLINE_APP_JS__", () => js.trimEnd());

  if (html.includes("__INLINE_") || html.includes("__PRACTICE_TOOLS__") || html.includes("__SETTINGS_EXTRAS__") || html.includes("__LOCALE_TEXT__")) {
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
    shell: await readText("shared/practice-shell.html"),
    sharedCss: await readText("shared/practice.css"),
    sharedJs: await readText("shared/practice-ui.js"),
    css: await readText(`${app.sourceDir}/style.css`),
    js: await readText(`${app.sourceDir}/main.js`),
    practiceTools: app.practiceTools ? await readText(app.practiceTools) : "",
    settingsExtras: app.settingsExtras ? await readText(app.settingsExtras) : "",
  };

  for (const code of app.locales) {
    await buildAppLocale(app, await loadLocale(app, code), source);
  }
}

async function buildIndex() {
  const appsByCategory = new Map(categories.map((category) => [category.id, []]));

  for (const app of apps) {
    const categoryApps = appsByCategory.get(app.categoryId);
    if (!categoryApps) {
      throw new Error(`${app.id}: unknown launcher category ${app.categoryId}`);
    }

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
    categoryApps.push(`<li><h3><a href="${escapeHtml(primary.href)}">${escapeHtml(title)}</a></h3><p>${escapeHtml(subtitle)}</p><p class="links">${links}</p></li>`);
  }

  const sections = categories.map((category) => {
    const categoryApps = appsByCategory.get(category.id);
    return `<section aria-labelledby="${escapeHtml(category.id)}">
      <h2 id="${escapeHtml(category.id)}">${escapeHtml(category.title)}</h2>
      <ul>
        ${categoryApps.join("\n        ")}
      </ul>
    </section>`;
  });

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Practice Lab</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1f2933; background: #f4f0e8; }
    body { margin: 0; }
    main { width: min(1040px, calc(100vw - 32px)); margin: 0 auto; padding: 48px 0 64px; }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 6vw, 4rem); line-height: 1; }
    p { color: #52606d; line-height: 1.55; }
    .intro { max-width: 720px; margin-bottom: 0; }
    section { margin-top: 40px; }
    section h2 { margin: 0; padding-bottom: 10px; border-bottom: 2px solid #d8cfc1; font-size: clamp(1.25rem, 3vw, 1.65rem); }
    ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 12px; margin: 14px 0 0; padding: 0; list-style: none; }
    li { display: flex; flex-direction: column; padding: 18px 20px; border: 1px solid #d8cfc1; border-radius: 8px; background: #fffaf1; }
    h3 { margin: 0 0 6px; font-size: 1.2rem; }
    a { color: #0f5f72; font-weight: 800; text-decoration-thickness: 0.12em; text-underline-offset: 0.16em; }
    .links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; margin-bottom: 0; padding-top: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>Practice Lab</h1>
    <p class="intro">Small offline practice apps for programmer-adjacent skills and adjacent numeracy. Each app stores progress locally in your browser.</p>
    ${sections.join("\n    ")}
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
