# Practice Lab Agent Instructions

These instructions apply to the whole repository. Read [docs/app-contract.md](docs/app-contract.md) before creating, reworking, translating, or making shared changes to an app. For topic implementation, also read the app's specification in `specs/`; for new specifications, read `specs/topics-spec-guidance.md`.

## Non-negotiable product invariants

- Every built app is a standalone, offline HTML file. Do not add a backend, runtime network dependency, package loader, CDN asset, or external font. Assets needed at runtime must be inlined or generated locally.
- Edit source under `apps/`, `shared/`, and `tools/`; never hand-edit or commit generated `dist/` files.
- Use the shared shell, shared CSS, and `window.PracticeLabUI`. Put reusable presentation and low-risk browser behavior in `shared/`; keep generators, checking, domain models, and domain-specific rendering app-local.
- Preserve the current visual language and responsive behavior unless the user asks for a redesign.
- Preserve stable family/category identifiers, output filenames, local-storage keys and schemas, and import/migration behavior unless an intentional migration is part of the task.

## Practice behavior

- Provide equivalent Adaptive and Manual modes. Selectors remain clickable in both modes; choosing a category, family, level, matrix cell, or stats item switches to that manual selection.
- Adaptive practice begins at the first supported level of each family. A later level is not eligible until its preceding level has at least five attempts and 80% mastery. Use `PracticeLabUI.unlockedLevels` unless a topic specification defines a stricter progression. Never place every level in a fresh adaptive pool.
- Manual mode permits direct access to every supported family and level, including locked adaptive levels.
- Track progress independently by stable family and level. Pause time must not count toward answer time.
- Generated questions must be deterministic from their seed, have exact or explicitly tolerance-bounded checking, reject their canonical answer only under a test failure, and expose meaningful structural variation rather than cosmetic randomization.
- Feedback must state correctness, show the expected answer when needed, and teach the intended reasoning through a rule, diagnosis, derivation, or worked solution.

## Input and accessibility

- Build custom keypads with `PracticeLabUI.renderInputGrid` and editing behavior with `PracticeLabUI.createTextEditor`.
- Keep a stable keypad layout when answer families use different character sets; disable irrelevant keys instead of moving the remaining keys.
- If a custom keypad replaces the mobile keyboard, use `inputmode="none"` and do not programmatically focus the field on coarse-pointer/mobile devices.
- For multi-field answers, visibly track the active target and provide a next-field control. Keypad presses must edit the current selection/caret and must not steal focus.
- Use semantic controls, `type="button"` where submission is not intended, labels, ARIA names where needed, keyboard-accessible interactions, and escaped/text-only insertion for generated content.

## Localization

- Every registered app has complete English and Swedish builds unless the user explicitly changes the repository-wide locale policy.
- Locale parity includes shell text, categories, family names, generated questions, choices, answer labels, hints, diagnoses, worked solutions, settings, calculators/tools, and confirmation/error messages.
- Do not treat an English UI shell around untranslated generated content as a translation. Keep canonical semantics and checking equivalent across locales.

## Completion checklist

- Register new apps/locales/categories in `tools/build.mjs`, register their outputs and shared-runtime checks in `tools/test.mjs`, and add any domain validator to `tools/test.sh`.
- Update `README.md` and `FUTURE_WORK.md` when an app is added, renamed, or moved from future work into the implemented set.
- Expose `window.runSelfTests`; test every family and level over many deterministic seeds, canonical-answer acceptance, structural variation, locale coverage, and domain invariants. Add an independent validator when correctness depends on a compiler, reference algorithm, exhaustive finite space, or pinned standard/model.
- Run `tools/test.sh` for completed app/shared changes. At minimum during iteration, run syntax checks, `git diff --check`, `tools/build.sh`, and `bun tools/test.mjs`.
- Report what changed, what was verified, and any intentional contract exception.

