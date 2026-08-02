# Practice Lab

Practice Lab is a collection of small offline practice apps for programmer-adjacent skills and adjacent numeracy. Current apps:

- **Programmer Low-Level Numeracy**: bits, bases, fixed-width integers, masks, shifts, abstract addresses, supplied layouts, alignment, boundaries, and endian memory order.
- **Mental Arithmetic**: fast integer addition, subtraction, multiplication, division, complements, and percentages.
- **Number Theory & Modular Arithmetic**: divisibility, primes, factorization, GCD/LCM, Euclid, congruences, powers, inverses, CRT, Diophantine equations, checksums, and bounded toy cryptography.
- **Everyday Economics**: applied math for prices, percentages, interest, inflation, subscriptions, and expected value.
- **Floating Point Practice**: FP4 through FP32 drills for classification, exact decoding/encoding, spacing, exactness, and small additions that disappear.
- **C++ Code Reading**: trace runtime state, aliasing, types, overloads, lifetime, and declaration-heavy callables in small controlled snippets.
- **6502 Assembly Practice**: execute original NMOS 6502 addressing, instructions, flags, arithmetic, branches, stack frames, interrupts, and cycle counts.
- **Git & Version-Control Reasoning**: predict snapshots, refs, the index, status, branches, merges, conflicts, rewriting, remotes, collaboration, diagnosis, bisect, and recovery in a synthetic repository model.
- **Unicode, Encodings & Text**: reason about text units, scalar validity, UTF-8/16/32, byte order, legacy encodings, normalization, grapheme clusters, casing, JavaScript strings, and safe text pipelines.
- **Computer Science: Algorithms & Discrete Reasoning**: analyze growth and recurrences, trace data structures and graph algorithms, evaluate logic, and solve exact counting and finite-probability problems.
- **Japanese Numbers & Dates**: practice Japanese readings for numbers, counters, months, dates, weekdays, and relative days.
- **Electric Circuits**: generated, model-explicit drills spanning DC foundations, resistor networks, transients, AC and filters, semiconductor switches, op-amps, digital interfaces, measurement, tolerance, and ratings.

The built apps are standalone HTML files:

- `dist/programmer-low-level-numeracy.html`
- `dist/programmer-low-level-numeracy.{{lang}}.html`
- `dist/mental-arithmetic.html`
- `dist/mental-arithmetic.{{lang}}.html`
- `dist/number-theory-modular-arithmetic.html`
- `dist/number-theory-modular-arithmetic.{{lang}}.html`
- `dist/everyday-economics.html`
- `dist/everyday-economics.{{lang}}.html`
- `dist/floating-point-practice.html`
- `dist/floating-point-practice.{{lang}}.html`
- `dist/cpp-mental-execution.html`
- `dist/cpp-mental-execution.{{lang}}.html`
- `dist/assembly-practice-6502.html`
- `dist/assembly-practice-6502.{{lang}}.html`
- `dist/git-version-control.html`
- `dist/git-version-control.{{lang}}.html`
- `dist/unicode-encodings-text.html`
- `dist/unicode-encodings-text.{{lang}}.html`
- `dist/computer-science.html`
- `dist/computer-science.{{lang}}.html`
- `dist/japanese-numbers-dates.html`
- `dist/japanese-numbers-dates.{{lang}}.html`
- `dist/electric-circuits.html`
- `dist/electric-circuits.{{lang}}.html`

Build it, then open it directly in a browser. Progress is stored locally in the browser with `localStorage`, but can also be freely exported/imported as JSON.

## Source Layout

The standalone HTML files are generated into `dist/`, which is ignored by git. Edit the source files instead:

- `apps/{{app}}/style.css`
- `apps/{{app}}/main.js`
- `apps/{{app}}/locales/*.mjs`
- `apps/{{app}}/practice-tools.html` and `settings-extras.html` when the app needs shell extensions

Shared presentation and low-level browser UI live in:

- `shared/practice-shell.html`
- `shared/practice.css`
- `shared/practice-ui.js`

Tooling lives in:

- `tools/build.sh`
- `tools/build.mjs`
- `tools/test.sh`
- `tools/test.mjs`

There is no Node/npm dependency chain. The build uses shell plus Bun, with no external packages.

## Build

```sh
tools/build.sh
```

This inlines the shared shell/runtime, shared CSS, and app-specific CSS and JavaScript into localized files under `dist/`. English uses the plain `.html` filename; localized builds use `.{{lang}}.html`.

## Test

```sh
tools/test.sh
```

This rebuilds the apps, checks that every inline script parses, runs the browser-console self-tests through Bun, validates C++ fixtures with GCC and Clang, and runs the extended 6502, number-theory, Git, and Unicode generator/oracle validations.

## GitHub Pages and Releases

The workflow in `.github/workflows/pages.yml` builds and tests the apps with Bun, uploads `dist/` as the GitHub Pages artifact, deploys it, and creates a GitHub Release.

Repository setup:

- In GitHub, go to **Settings -> Pages**.
- Set **Build and deployment -> Source** to **GitHub Actions**.
- Make sure GitHub Actions are enabled for the repository.
- Push to `main`, or run **Build and Deploy Pages** manually from the Actions tab.

The published site root uses the generated `dist/index.html` landing page, with links to each standalone app and locale. The generated files still stay out of git.

Release notes:

- Each successful workflow run creates a sequential release tag such as `r0001`, `r0002`, and so on.
- The release contains `practice-lab-dist.zip`, which is the generated standalone HTML site.
- The next release number is computed from existing `rXXXX` tags. Do not delete or rename those tags unless you intentionally want to affect the sequence.
- The workflow needs `contents: write`, `pages: write`, and `id-token: write` permissions through the repository's normal `GITHUB_TOKEN`.

## Notes

- Keep generated HTML files out of git. Build them into `dist/` for local use or release packaging.
- Put future app ideas and design notes in `FUTURE_WORK.md`.
- If more apps are added, each should get its own source directory under `apps/` and its own generated standalone HTML file.

## License

Practice Lab is released under the MIT License. See `LICENSE`.
