# Future Work

Practice Lab is a collection of small, offline, generated-practice apps. This
roadmap tracks four different states:

- **Implemented** — an app source directory exists under `apps/` and is
  registered in the build.
- **Specified but not implemented** — an implementation specification exists
  under `specs/`, but no corresponding app source directory exists.
- **Not yet specified** — the idea is still useful, but no implementation
  specification defines it.
- **Deliberately excluded** — a current specification or project boundary
  explicitly keeps the idea out of scope.

An implemented app is evidence that the app exists, not a claim that every
possible extension has been completed. The topic specifications remain the
source of truth for family-level scope and validation requirements.

## Implemented apps

| App | Status | Specification | Source |
|---|---|---|---|
| Programmer Low-Level Numeracy | **Implemented** | [spec](specs/programmer-low-level-numeracy.md) | [app](apps/programmer-low-level-numeracy/) |
| Mental Arithmetic | **Implemented** | [spec](specs/mental-arithmetic.md) | [app](apps/mental-arithmetic/) |
| Number Theory and Modular Arithmetic | **Implemented** | [spec](specs/number-theory-modular-arithmetic.md) | [app](apps/number-theory-modular-arithmetic/) |
| Everyday Economics | **Implemented** | [spec](specs/everyday-economics.md) | [app](apps/everyday-economics/) |
| Floating-Point Practice | **Implemented** | [spec](specs/floating-point-practice.md) | [app](apps/floating-point-practice/) |
| C++ Mental Execution | **Implemented** | [spec](specs/cpp-mental-execution.md) | [app](apps/cpp-mental-execution/) |
| 6502 Assembly Practice | **Implemented** | [spec](specs/assembly-practice-6502.md) | [app](apps/assembly-practice-6502/) |
| Japanese Numbers, Dates, Time, and Money | **Implemented** | [spec](specs/japanese-numbers-dates.md) | [app](apps/japanese-numbers-dates/) |
| Electric Circuits | **Implemented** | [spec](specs/electric-circuits.md) | [app](apps/electric-circuits/) |

These are the only topics currently marked implemented. Each has an app
directory and an entry in `tools/build.mjs`; no status below is inferred from
commit messages or from the existence of a spec alone.

## Disposition of the original proposals

All exercise categories in the former long-form proposals are covered by the
linked specifications except for the items retained under **Not yet
specified** or **Deliberately excluded** below.

| Original proposal | Present state |
|---|---|
| Programmer Low-Level Numeracy improvements | **Implemented and specified.** Decimal/hex landmarks, ranges, masks, fields, popcount, alignment, address/layout reasoning, power-of-two remainders, structured carry/borrow/overflow answers, and endian drills are owned by the [low-level numeracy spec](specs/programmer-low-level-numeracy.md). Broad arithmetic became the separate Mental Arithmetic app; language-context bit operations are owned by C++ Mental Execution. |
| Floating Point Practice | **Implemented and specified** in the [floating-point spec](specs/floating-point-practice.md), covering FP4, FP6, FP8, binary16, bfloat16, and binary32. The original machine-epsilon idea is handled through format-specific spacing and exactness families. FP64 has a deliberate disposition below. |
| C++ Mental Execution | **Implemented and specified** in the [C++ spec](specs/cpp-mental-execution.md). The original state tracing, aliasing, parameter, type, overload, lifetime, ownership, container, callable, bitwise, and behavior-classification ideas are now bounded families rather than a proposal for a general compiler. |
| Mental Arithmetic | **Implemented and specified** for core integer arithmetic in the [Mental Arithmetic spec](specs/mental-arithmetic.md). The original idea was also split by ownership: divisibility, modular arithmetic, and clock arithmetic moved to [Number Theory and Modular Arithmetic](specs/number-theory-modular-arithmetic.md), while byte addresses, offsets, and alignment moved to [Programmer Low-Level Numeracy](specs/programmer-low-level-numeracy.md). |
| Theoretical CS and Algorithms | **Specified but not implemented** as [Computer Science: Algorithms and Discrete Reasoning](specs/computer_science.md). |
| Shell, Regex, and Admin Practice | **Specified but not implemented** as [Unix Shell and Administration Practice](specs/admin-practice.md). Its networking and HTTP edge grew into the broader [Networking and Protocols](specs/networking-protocols.md) and [HTTP and Web Practice](specs/http-web-practice.md) specs. |
| Assembly Practice | The original idea was split into two apps. [6502 Assembly Practice](specs/assembly-practice-6502.md) is **implemented and specified**; [AMD64 Assembly Practice](specs/assembly-practice-amd64.md) remains **specified but not implemented**. |
| Electric Circuits and Electronics | **Implemented and specified** as [Electric Circuits](specs/electric-circuits.md). |
| Economics and Applied Everyday Math | The price, percent, interest, inflation, subscription, expected-value, and shared-charge core is **implemented and specified** as [Everyday Economics](specs/everyday-economics.md). Organizational budgeting and decision work was absorbed into the broader, **specified but not implemented** [Business Economics and Managerial Decisions](specs/business-economics-managerial-decisions.md) topic; Rule-of-72 practice is specified in [Investment Literacy and Company Analysis](specs/investment-literacy-company-analysis.md). |
| Physics and Chemistry Practice | The combined science idea was **split into two specified but not implemented apps**: [Physics](specs/physics.md) and [Chemistry](specs/chemistry.md). |
| Calculus and Symbolic Math Practice | **Specified but not implemented** as [Calculus](specs/calculus.md), including the controlled expression grammar and layered checker that the proposal anticipated. |
| Git, HTTP, SQL, Networking, and Unicode | All five are **specified but not implemented**: [Git and Version-Control Reasoning](specs/git-version-control.md), [HTTP and Web Practice](specs/http-web-practice.md), [SQL and Relational Databases](specs/sql-relational-databases.md), [Networking and Protocols](specs/networking-protocols.md), and [Unicode, Encodings, and Text](specs/unicode-encodings-text.md). |
| Japanese Practice | The original idea was **split**. Numbers, counters, dates, time, and money are **implemented** under the [focused spec](specs/japanese-numbers-dates.md); wider kana, vocabulary, particles, inflection, reading, listening, and interaction are **specified but not implemented** in [Japanese Language](specs/japanese-language.md). |
| Music Practice | **Specified but not implemented** as [Music Practice](specs/music-practice.md); it is no longer merely a possible later architecture experiment. |

## Specified but not implemented

The following 56 topic specs have no corresponding directory under `apps/`.
They are the implementation backlog; they do not need another proposal document
before implementation.

### Computing and operations

- [Unix Shell and Administration Practice](specs/admin-practice.md)
- [AMD64 Assembly Practice](specs/assembly-practice-amd64.md)
- [Computer Science: Algorithms and Discrete Reasoning](specs/computer_science.md)
- [Digital Logic and Computer Architecture](specs/digital-logic-computer-architecture.md)
- [Game Programming Fundamentals](specs/game-programming-fundamentals.md)
- [Git and Version-Control Reasoning](specs/git-version-control.md)
- [HTTP and Web Practice](specs/http-web-practice.md)
- [Networking and Protocols](specs/networking-protocols.md)
- [Practical Cryptography](specs/practical-cryptography.md)
- [Reverse Engineering and Code Recovery](specs/reverse-engineering-code-recovery.md)
- [SQL and Relational Databases](specs/sql-relational-databases.md)
- [System Design](specs/system-design.md)
- [Unicode, Encodings, and Text](specs/unicode-encodings-text.md)

### Mathematics and data

- [Algebra Fluency](specs/algebra-fluency.md)
- [Calculus](specs/calculus.md)
- [Data Literacy and Chart Reading](specs/data-literacy-chart-reading.md)
- [Differential Equations](specs/differential-equations.md)
- [Geometry and Trigonometry](specs/geometry-trigonometry.md)
- [Linear Algebra](specs/linear-algebra.md)
- [Logic](specs/logic.md)
- [Probability and Statistics](specs/probability-statistics.md)
- [Spreadsheet Practice](specs/spreadsheet-practice.md)

### Science, engineering, and spatial reasoning

- [Architectural Drawing and Spatial Reasoning](specs/architectural-drawing-spatial-reasoning.md)
- [Architectural Geometry and Building Quantities](specs/architectural-geometry-building-quantities.md)
- [Building Science](specs/building-science.md)
- [Chemistry](specs/chemistry.md)
- [Control Systems](specs/control-systems.md)
- [Design Reasoning](specs/design-reasoning.md)
- [Medical Calculations](specs/medical-calculations.md)
- [Navigation and Map Reasoning](specs/navigation-map-reasoning.md)
- [Photography and Optics](specs/photography-optics.md)
- [Physics](specs/physics.md)
- [Signals and Systems](specs/signals-and-systems.md)
- [Structures for Architects](specs/structures-for-architects.md)

### Business

- [Accounting and Bookkeeping](specs/accounting-bookkeeping.md)
- [Business Economics and Managerial Decisions](specs/business-economics-managerial-decisions.md)
- [Investment Literacy and Company Analysis](specs/investment-literacy-company-analysis.md)

### Languages, humanities, and other practice

- [Chess Calculation](specs/chess-calculation.md)
- [Chinese Language](specs/chinese-language.md)
- [Cognitive Drills](specs/cognitive-drills.md)
- [Color and Visual-Design Practice](specs/color-visual-design.md)
- [English Language](specs/english-language.md)
- [French Language](specs/french-language.md)
- [German Language](specs/german-language.md)
- [Grammar and Linguistics](specs/grammar-linguistics.md)
- [Greek Language](specs/greek-language.md)
- [Icelandic Language](specs/icelandic-language.md)
- [Italian Language](specs/italian-language.md)
- [Japanese Language](specs/japanese-language.md)
- [Korean Language](specs/korean-language.md)
- [Literary Reading and Analysis](specs/literary-reading-analysis.md)
- [Morse Code and Radio Procedure](specs/morse-code-radio-procedure.md)
- [Music Practice](specs/music-practice.md)
- [Russian Language](specs/russian-language.md)
- [Spanish Language](specs/spanish-language.md)
- [Swedish Language](specs/swedish-language.md)

## Not yet specified

These are the remaining useful proposals for which the present specs do not
define a family or UI requirement:

- **Rotate through carry** as an advanced low-level shift/rotate family.
- **Directed floating-point rounding modes** and explicit
  guard/round/sticky-bit drills. The current floating-point spec standardizes
  round-to-nearest, ties-to-even and defines no family for the other modes.
- **Programmer storage-unit conversions** such as byte/KiB/MiB/GiB conversions.
  The Mental Arithmetic spec assigns byte-specific work to low-level numeracy,
  but the low-level spec does not currently define this conversion family.
- **Generic ratio and recipe scaling** from the original applied-math proposal.
- **Low-level keypad refinement:** field-aware keypad presets are implemented;
  a user setting for keypad hint dimming remains unspecified.

Before implementation, each exercise-family item should be added to the owning
topic spec with generation, checking, progression, and validation rules. The UI
refinement can be specified in the owning app spec without creating a new topic.

## Deliberately excluded or deferred

- [Floating-Point Practice](specs/floating-point-practice.md) explicitly
  postpones FP64 and requires a distinct learning objective before it is added.
  It also excludes language-specific constant parsing; a future C++ floating
  literal/comparison/tolerance layer would require an explicit owner and spec
  revision.
- [Everyday Economics](specs/everyday-economics.md) excludes financial advice,
  current market/tax data, loan amortization, and open-ended personal budgeting.
  The former savings-rate/household-runway idea has no replacement spec.
- [Japanese Numbers, Dates, Time, and Money](specs/japanese-numbers-dates.md)
  excludes Japanese eras and larger units such as `億` and `兆` from its initial
  implementation.
- [Mental Arithmetic](specs/mental-arithmetic.md) excludes timed trick questions
  and keeps modular arithmetic and programmer-specific units in their dedicated
  topics.
- General-purpose execution or simulation engines remain outside the focused
  app model: no arbitrary C++ compiler/parser, browser shell, SPICE clone, or
  general computer algebra system.
- Static vocabulary, theorem-name recall, and long explanation-heavy material
  remain better suited to flashcards or documentation unless generation,
  interaction, simulation, or structured checking adds value.

## Current architecture and build direction

- Prefer generated questions with exact or structured checking. Keep each app
  focused enough that category- and family-level progress remains meaningful.
- Keep app source in `apps/<app-id>/`: `style.css`, `main.js`, and
  `locales/*.mjs`, plus optional shell-slot fragments. The common page shell,
  base stylesheet, and low-risk UI runtime live under `shared/`.
- Keep published artifacts as standalone localized HTML files under `dist/`.
  `tools/build.mjs` also generates the launcher at `dist/index.html`; a launcher
  is no longer future work.
- Use separate local-storage keys per app and retain export/import of progress.
- Keep the package-free toolchain: shell entry points plus Bun, with no `npm`,
  Node package ecosystem, runtime network dependency, or external packages.
- Continue using `tools/build.sh` and `tools/test.sh` as the build and validation
  entry points. Generated `dist/` files stay out of version control.
- Shared renderers, parsers, exact-arithmetic helpers, and progress components
  may be factored out when multiple implemented apps genuinely need them. The
  final distribution should remain standalone HTML per app and locale.
- When an app is added, register it in the build and test manifests, provide its
  localized source files, and keep this roadmap's status based on repository
  evidence rather than aspiration.
