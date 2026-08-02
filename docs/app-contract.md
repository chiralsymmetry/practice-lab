# Practice Lab App Contract

## Purpose

This document is the implementation and review contract for Practice Lab apps. It records the behavior shared by the mature apps so that a new session does not have to rediscover it from copied source code.

The topic specification remains authoritative for educational scope, question families, accepted answers, difficulty, and domain assumptions. This contract governs the common product, architecture, localization, interaction, progress, and validation behavior. A topic specification may impose stricter rules. Deviating from the platform invariants here requires an explicit user decision, not an incidental implementation shortcut.

## 1. Product boundary

Practice Lab is a collection of small, generated practice applications, not a general tutoring platform or a set of static flashcards.

Every app must:

- run by opening one generated HTML file directly, including through `file://`;
- remain useful without a network connection;
- store progress locally and support JSON export/import;
- generate many semantically meaningful instances locally;
- check answers locally against a precise model;
- teach fluency through repeated reasoning, not vocabulary recall alone.

There is no backend. Build-time validation with compilers, exhaustive scripts, or reference implementations does not imply that those tools exist in the browser. Runtime assets must not depend on CDNs, remote APIs, external fonts, or module loaders. Small audio/image resources may be embedded as data, generated with browser APIs, or drawn as HTML/SVG/canvas.

Static definitions are usually better placed in Learn cards. A question family belongs in practice mode only when variation changes the reasoning task or supplies useful contextual retrieval.

## 2. Source and build architecture

### App source

A normal app lives at:

```text
apps/<app-id>/
  main.js
  style.css
  locales/
    en.mjs
    sv.mjs
```

Optional shell extensions are:

```text
apps/<app-id>/practice-tools.html
apps/<app-id>/settings-extras.html
```

Use those two explicit slots for domain tools and settings. Do not fork the full HTML shell to add app-specific markup.

### Shared foundation

The shared foundation consists of:

- `shared/practice-shell.html`: page structure and stable element IDs;
- `shared/practice.css`: common layout, navigation, panels, forms, selectors, metrics, matrices, key grids, feedback, settings, and responsive rules;
- `shared/practice-ui.js`: stable, low-risk browser helpers exposed as `window.PracticeLabUI`.

Shared CSS is inlined before app CSS. Shared JavaScript is inlined before app JavaScript. App CSS should contain domain diagrams, prompts, specialized tools, typography needs, and small theme overrides—not copies of the shell layout. App JavaScript owns generation, checking, domain models, progress calculations, adaptive scoring, and domain-specific rendering.

When the same UI behavior is required by several apps, extend the shared runtime and its unit tests. Do not create subtly different copied helpers. Do not move domain logic into the shared runtime merely because two subjects both have a concept called a graph, parser, or calculator.

### Registration and output

Register an app in the `apps` table in `tools/build.mjs` with:

- a stable `id`;
- one launcher `categoryId`;
- `sourceDir`;
- stable `outputBase`;
- `locales: ["en", "sv"]`;
- optional `practiceTools` and `settingsExtras` paths.

English uses `dist/<outputBase>.html`; Swedish uses `dist/<outputBase>.sv.html`. Register both in the output list in `tools/test.mjs`. The build must leave no unresolved locale, shell-slot, CSS, or JavaScript placeholder and no external runtime asset.

`dist/` is generated and ignored. Never use a generated file as the source of a fix.

## 3. Required views and controls

The shared shell supplies five views. An app should make each useful rather than merely leaving the container present.

### Practice

Practice includes:

- Adaptive and Manual mode controls;
- Pause and Learn-this controls;
- current category, family, level, and mastery;
- generated prompt and answer controls;
- Check, Next, and Skip actions;
- an answer keypad when useful;
- immediate feedback;
- category, family, and level selectors;
- current-cell mastery, accuracy, streak, and average time;
- optional app-specific tools.

Check must not silently mean “next question.” After submission, the primary continuation action may change to Next, but answer controls must be frozen and feedback must remain available until the learner advances.

### Matrix

The matrix shows every supported family/level cell and its progress independently. Selecting a cell opens that exact cell in Manual mode. Unsupported family/level combinations are visibly unavailable rather than mapped to another level.

### Stats

Stats include aggregate attempts, correct answers, elapsed practice time, practiced cells, and useful weakest/strongest lists. Items that name a family and level should open that exact cell in Manual mode.

### Settings

Settings include adaptive category enablement and progress export, copy, import, and reset. Additional domain settings use `settings-extras.html`. Reset is confirmed. Invalid imported JSON is handled visibly without destroying valid stored progress.

### Learn

Every family has concise Learn content containing the applicable model, minimum rules, answer convention, representative example, and important trap. “Learn this” should spotlight or scroll to the current family. Learn is concise instruction, not a replacement textbook.

## 4. Categories, families, levels, and identity

Categories organize related skills. Families are stable, repeatable forms of reasoning. A family must generate many useful instances whose differences are more than renamed variables, whitespace, or arbitrary story decoration.

Identifiers are data compatibility boundaries:

- category IDs and family IDs are stable and locale-independent;
- the same IDs refer to the same semantics in all locales;
- family IDs appear in progress keys, histories, tests, and deep UI actions;
- renaming a displayed title must not rename stored identity;
- removing or changing a family requires deliberate migration handling.

The established default is five structural difficulty levels, L1 through L5. Difficulty should rise through additional interacting rules, reduced scaffolding, inversion, transfer, longer dependency chains, or more demanding representations. Larger numbers, longer prose, obscure trivia, and tedious calculation are not sufficient progression by themselves.

If a family genuinely supports fewer levels, declare `family.levels` explicitly and render the other matrix cells unavailable. Do not generate fake difficulty merely to fill the matrix.

## 5. Question generation contract

A generated question should carry enough stable information to render, check, explain, reproduce, and test it. Exact property names can remain app-specific, but the semantic contract includes:

- stable family and category identity;
- structural level;
- deterministic seed or generated parameters;
- localized prompt data;
- one or more typed response fields;
- a canonical answer;
- expected-answer display text;
- explanation, rule, derivation, or worked solution;
- a structural signature used to detect low variation/repetition;
- pinned model/standard metadata where domain correctness depends on it;
- misconception, representation, or difficulty tags when useful for adaptation.

For a fixed locale, family, level, and seed, generation must be deterministic. Localization may change rendered strings and accepted locale-specific notation, but not the underlying problem or correct semantics.

Generators must reject or construct around:

- ambiguous questions or more valid answers than the checker accepts;
- undefined, unspecified, implementation-dependent, or convention-dependent cases unless identifying that status is the intended task;
- degenerate cases where the operation has no pedagogically relevant effect;
- accidental hints that reveal the answer;
- duplicate choices or more than one correct choice;
- arithmetic or text complexity unrelated to the target skill;
- excessive repetition of one structural template.

Use exact integers, `BigInt`, rational representations, finite enumeration, or independently testable reference algorithms where appropriate. Floating-point tolerance must be explicit, scaled to the problem, and paired with unit/dimension handling when applicable. A numerical equivalence heuristic may supplement a controlled symbolic checker but should not be presented as a general proof system.

Multiple-choice distractors should encode known misconceptions. Random nearby values are suitable only when numerical proximity is itself the misconception being tested.

## 6. Answer checking and feedback

Checking must normalize only representations the specification declares equivalent. Examples include surrounding whitespace, case, separators, prefixes, localized decimal notation, or set/order normalization. Do not accept a broader language than the parser can validate safely, and do not reject a conventional equivalent form without documenting the restriction.

For every generated question:

- the canonical answer must be accepted by the public checker;
- malformed input must fail without throwing;
- every response field must participate in checking;
- choice values must be stable and separate from localized labels;
- ordered answers and unordered sets must not be confused;
- unit-bearing answers must validate both magnitude and compatible dimension;
- multi-answer questions must define whether duplicates and ordering matter.

Correct feedback confirms the result and may show a compact derivation. Incorrect feedback shows the expected answer and explains the relevant rule or likely misconception. Prefer a worked mental method over merely repeating the final value. Always keep feedback localized and safe to render.

## 7. Adaptive and Manual modes

Both modes expose the same question families, answer controls, feedback, pause behavior, and Learn content. They differ only in how the next family/level is chosen.

### Manual mode

Manual mode permits direct access to every supported family and level, regardless of adaptive locks or prerequisites. The category, family, and level selectors remain enabled at all times. Selecting one of them, a matrix cell, or a family/level item in Stats is an explicit manual selection and switches the app to Manual mode.

### Adaptive mode

Adaptive mode operates over enabled categories and respects topic prerequisites. It must not draw from every level when progress is empty.

The common level rule is:

1. The first supported level of each eligible family starts unlocked.
2. The next level unlocks when the immediately preceding level has at least five attempts and at least 80% mastery.
3. Unlocking is sequential; evidence at a manually attempted high level does not bypass an unmastered lower level.
4. Adaptive selection normally presents the highest unlocked level for a family while retaining the ability to revisit weak prerequisite material when the app's diagnostic model calls for it.
5. Topic prerequisites may make the rule stricter, never silently looser.

Use `PracticeLabUI.unlockedLevels(levels, getStat)` for the common rule. Existing equivalent implementations may combine five attempts with 80% recent accuracy when mastery is defined as evidence-weighted recent accuracy.

Among eligible cells, selection should balance:

- unseen or newly unlocked material;
- lowest mastery and recent mistakes;
- diagnostic families associated with recorded misconceptions;
- occasional review of established material;
- structural variety and avoidance of immediate repeats.

Do not let a large collection of untried high levels starve foundational practice. Category enablement must never produce an empty or crashing pool; use a clear eligible fallback without mutating unrelated progress.

### Mastery and timing

Progress is tracked per family and level, with attempts, correct answers, recent outcomes, streak, elapsed time, and mastery at minimum. A new cell begins at zero. Mastery needs both accuracy and evidence; one lucky answer must not mark a level mastered. Recent errors should lower or slow mastery. Topic-specific misconception and dimension tracking is encouraged.

Pause stops the question timer. Time spent in a paused overlay must not be recorded. Skipping should not be counted as a correct attempt; if a topic chooses to count skips as evidence, that policy must be explicit.

## 8. Input, keypads, and mobile behavior

Use `PracticeLabUI.renderInputGrid(container, rows, options)` for answer and calculator grids. An input cell is:

```js
[label, callback, { id, variant, colspan, ariaLabel, disabled }]
```

Rows are explicit. IDs are optional but must be unique within one grid. Named buttons are used to update state and labels later. All rendered keys are `type="button"` and must not submit a form accidentally.

Use `PracticeLabUI.createTextEditor(() => activeInput)` for insertion, Unicode-safe backspace, and clearing. It respects selections/carets, emits an `input` event, and does not focus an unfocused field.

Keypad requirements:

- Layout belongs to the app because answer alphabets differ by subject.
- Keep the layout stable across families. Disable irrelevant character keys rather than removing or rearranging them between questions.
- Keep meta keys such as Delete, Clear, Check/Submit, and—when needed—Next field available in consistent positions.
- A multi-field answer visibly marks the active target. Tapping/focusing a field changes the target, and Next field cycles among enabled text fields.
- Key presses preserve the current field and caret. They must not steal focus.
- Choice-only questions may hide a text keypad.
- Key IDs and enabled-key sets are invariants worth self-testing; duplicate IDs are startup failures.

When the custom keypad is intended to replace the operating system keyboard, text fields use `inputmode="none"`. Do not programmatically focus them on coarse-pointer/mobile devices, because that can open the virtual keyboard; desktop-only convenience focus should be guarded by a fine-pointer media query. A learner may still tap or use a hardware keyboard where the browser permits it.

If the custom keypad cannot express every accepted answer, either add the missing keys or allow ordinary text entry. Never advertise a convenient keypad that makes a valid answer impossible.

## 9. Accessibility and safe rendering

Use semantic form controls and associated labels. Buttons that do not intentionally submit a form use `type="button"`. Interactive diagrams need an equivalent textual prompt or accessible name. State changes such as feedback and pause/resume should be announced appropriately without making every timer update noisy.

Do not build dynamic HTML by inserting unescaped generated or imported text. Prefer DOM creation and `textContent`; use `PracticeLabUI.escapeHtml` when trusted markup assembly is unavoidable. Imported progress is data, never executable markup.

Do not rely on color alone for correctness, disabled state, selected target, or matrix readiness. Preserve visible focus and keyboard access. Test narrow/mobile layouts in addition to desktop.

## 10. Localization contract

Each locale module exports:

```js
{
  code,
  lang,
  suffix,
  text
}
```

English normally has `suffix: ""`; Swedish has `suffix: ".sv"`. The shared shell consumes localized template keys such as app title, navigation, practice controls, matrix, stats, settings, Learn, and messages.

Translation parity covers more than shell labels:

- category, subcategory, and family titles;
- all generated question wording and contextual data labels;
- choices and multi-choice options;
- response-field labels and accepted localized conventions;
- hints, rules, diagnoses, derivation steps, worked solutions, and expected-answer prose;
- calculators, domain tools, settings, dialogs, and error messages;
- accessibility labels and educational/model notes.

Keep stable internal option values and IDs independent of translated labels. English and Swedish generation for the same semantic seed should exercise the same task. A Swedish page must not leak generated English prose merely because the outer shell is translated. Add generated-text coverage tests or structured translation-table coverage rather than relying on visual spot checks.

Symbols, source code, commands, register names, standards terminology, and proper nouns may remain unchanged when they are the subject rather than untranslated prose. Make that distinction intentionally.

## 11. Persistence and compatibility

Progress is private browser-local data. Use a stable, app-specific storage key. Reads and writes must fail safely when storage is unavailable or data is malformed. `PracticeLabUI.readJson` and `writeJson` are available for simple safe access.

A stored schema normally includes:

- a version;
- active view;
- settings, including Adaptive mode and enabled categories;
- last Manual selection;
- per-family/per-level statistics;
- bounded history and diagnostic metadata when useful.

Loading and importing should merge through a validating function that supplies defaults, clamps numbers, bounds history/recent arrays, ignores unknown or malformed fields, and preserves compatible old data. Do not blindly trust parsed JSON. Schema changes need migration or backward-compatible merging. Do not rename storage keys, family IDs, or output files merely for stylistic consistency.

Export produces portable JSON containing the complete meaningful progress state. Copy uses the shared clipboard helper so `file://` fallback continues to work. Reset requires confirmation and only removes/resets this app's progress.

## 12. Domain models and pinned assumptions

Domains with contested, versioned, or implementation-specific behavior must declare their model in the UI and question metadata. Examples in current apps include a C++ language version, original NMOS 6502 behavior, a Unicode version/text model, and synthetic Git-state semantics.

State assumptions in prompts or educational notes when they affect the answer: tie order, iteration order, rounding mode, unit system, ABI, syntax dialect, physical idealization, graph neighbor order, calendar convention, probability model, or circuit-analysis domain.

Do not claim general validity when the checker implements a bounded model. Browser simulation may be deliberately smaller than a real shell, compiler, CPU, database, network, or laboratory. Describe that boundary plainly.

For high-stakes subjects, include a conspicuous educational-only boundary, conservative assumptions, and independent expert review requirements in both the specification and app. A generated drill must not present itself as individualized medical, legal, financial, or safety-critical advice.

## 13. Testing and validation

Testing is part of the app contract, not a cleanup step.

### Shared/runtime tests

`tools/test.mjs` unit-tests shared UI behavior and then checks every built locale. Extend it when adding a shared API or platform invariant. It verifies, among other things:

- input-grid structure, metadata, callbacks, and focus preservation;
- caret/selection editing and Unicode backspace;
- selector behavior while Adaptive mode is active;
- ordered adaptive level unlocking;
- absence of external runtime assets and unresolved build slots;
- JavaScript parsing and use only of real `PracticeLabUI` methods;
- exposed self-tests in every standalone output.

### App self-tests

Every app exposes `window.runSelfTests`, returning an object with at least `{ ok, failures }`. A testable app API should also expose its categories, families, deterministic generator, checker, model identifier, and important pure oracles under one app-specific global.

Self-tests cover:

- unique stable IDs and complete generator registration;
- every family at every supported level;
- many deterministic seeds per cell;
- acceptance of every canonical answer;
- answer-parser landmarks and malformed inputs;
- at least two meaningful structural signatures per family/level;
- rendering metadata required by the app;
- important domain landmarks, boundary values, and invariants;
- locale-table completeness and generated Swedish-text coverage;
- keypad IDs and per-response enabled-key coverage when keypads are dynamic.

Do not weaken sample counts or invariants merely to make a failure disappear. Fix the generator, oracle, checker, or declared scope.

### Independent validators

Add `apps/<app-id>/validate.mjs` and register it in `tools/test.sh` when confidence benefits from a second implementation or a much larger run. Appropriate techniques include:

- exhaustive checking of a bounded state space;
- comparison with a separately written reference algorithm;
- algebraic/property invariants and round trips;
- compile-time assertions and runtime fixtures under all declared compilers;
- known standard landmarks and rejection cases;
- very large seeded generator sweeps.

The browser must not dynamically invoke those validators. They run during development/build verification.

### Required commands

During development, run focused checks early. Before handing off a completed app or shared-runtime change, run:

```sh
git diff --check
tools/test.sh
```

`tools/test.sh` rebuilds first, runs all localized standalone self-tests, and runs registered extended validators. If a full validator is exceptionally expensive and the user asked for a narrow documentation-only change, state what was and was not run; do not imply full validation.

## 14. New-app acceptance checklist

Before calling a new or reworked app complete, verify all of the following:

- The implementation follows its topic spec and does not silently narrow difficult families.
- Every family has a precise generator, checker, explanation, and meaningful L1–L5 progression (or explicit unavailable levels).
- Fresh Adaptive mode only selects foundational unlocked levels; Manual mode can select everything.
- Selectors, matrix cells, stats items, pause/resume, Learn-this, export/import/reset, and category enablement work.
- Multi-field answers and specialized key alphabets work on desktop and mobile without unwanted virtual-keyboard focus.
- English and Swedish are semantically complete, including generated text and feedback.
- All runtime dependencies are inlined and both output filenames are stable.
- Storage is safe, bounded, versioned, and compatible with prior data.
- Canonical answers pass for many seeds; malformed answers fail safely; structural variation is demonstrated.
- Domain assumptions are pinned and independently validated where warranted.
- `tools/build.mjs`, `tools/test.mjs`, and, when applicable, `tools/test.sh` are updated.
- `README.md` lists the app and output, and `FUTURE_WORK.md` reflects its implemented status.
- `git diff --check` and `tools/test.sh` pass, or any scoped exception is reported explicitly.
