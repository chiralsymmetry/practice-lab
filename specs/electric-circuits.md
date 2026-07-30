# Electric Circuits — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, schematic-renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Electric Circuits

### Topic goal

Develop practical circuit literacy from foundational schematic reading through intermediate analysis: recognize symbols and markings, read a schematic as a network of nodes and branches, select an explicit component model, calculate useful operating quantities, check loading and ratings, and recognize when an idealized design will or will not behave as intended.

The topic should progress substantially beyond isolated formula substitution while remaining below an electrical-engineering degree course. Repeated practice should improve the learner's ability to analyze and design small low-voltage analog and digital-interface circuits.

### Scope

The topic includes:

- schematic symbols, reference designators, common net labels, terminal markings, component value markings, polarity, and reference direction;
- schematic connectivity, electrically identical nodes, possible current paths, opens, shorts, series/parallel classification, and basic single-fault diagnosis;
- SI prefixes and unit conversion;
- Ohm's law, Kirchhoff's current law (KCL), Kirchhoff's voltage law (KVL), power, and energy;
- series, parallel, and reducible mixed resistor networks;
- unloaded and loaded dividers;
- Thévenin and Norton equivalents and sources with internal resistance;
- capacitor/inductor constitutive relationships at a qualitative level, stored energy, and first-order RC/RL transients;
- sinusoidal peak/RMS values, reactance, simple series impedance, phase, real/reactive/apparent power, and power factor;
- first-order passive RC/RL filters;
- piecewise-linear diode and LED models, basic rectifiers, BJT switches, and enhancement-MOSFET switches;
- ideal op-amp linear circuits, saturation checks, and simple comparators;
- pull-ups/pull-downs, open-drain nodes, and stated digital input thresholds;
- meter connection/loading, component tolerances, standard-value selection, and voltage/current/power ratings.

Expected prior knowledge is arithmetic with positive and negative numbers, fractions, decimal place value, and simple algebraic rearrangement. No prior schematic-reading experience is assumed. Category prerequisites below are normative: a learner should not be routed into formula-based circuit analysis until the relevant schematic-literacy checks are reliable.

### Safety and educational boundary

All exercises are idealized educational calculations, not construction or safety approval.

- Default sources are isolated low-voltage DC or low-voltage signal sources, normally at or below `24 V`.
- Do not generate mains wiring, high-voltage capacitors, lithium-cell charging, medical circuits, human-body current, explosive environments, protective-earth design, fuses for real installations, or instructions to defeat safety mechanisms.
- A correct exercise answer does not establish that a physical circuit is safe, compliant, stable, manufacturable, or reliable.
- Practical-rating questions teach margin under explicitly stated assumptions; they do not replace datasheets, standards, or engineering review.

### Exclusions

Do not include:

- Maxwell's equations, electromagnetic fields, transmission lines, antennas, RF matching, S-parameters, skin effect, or distributed models;
- Laplace transforms, differential-equation derivations, state-space methods, Bode-plot construction beyond first-order landmarks, poles/zeros beyond one pole, or feedback-control stability;
- semiconductor device physics, Ebers–Moll, MOS square-law bias design, small-signal transistor parameters, hybrid-pi models, or IC internals;
- transformers, three-phase systems, motors, generators, switch-mode converter design, magnetic-core saturation, or power electronics;
- noise spectral density, precision error budgets, thermal models, PCB layout, EMC, or regulatory compliance;
- arbitrary bridge/mesh networks requiring simultaneous systems larger than two equations;
- memorized real-device values unless supplied in the question;
- hidden parasitics, tolerance, loading, source resistance, or output limits.

### Normative circuit model and notation

- Every numeric question states whether the model is DC steady state, switching transient, or sinusoidal steady state.
- Ground is only the chosen `0 V` reference node; it is not automatically protective earth.
- Voltage `V_ab` means `V(a)-V(b)`.
- A branch-current arrow defines positive current. A negative answer means actual current is opposite the arrow.
- Passive sign convention is used for absorbed power: current entering the labeled positive terminal gives `p=vi`; negative power means delivery.
- Ideal wires are equipotential and ideal open circuits carry zero current.
- Ideal voltage sources fix voltage; ideal current sources fix current.
- Ideal meters are used only when explicitly stated. Otherwise the meter model is supplied.
- DC steady state after a long time: ideal capacitor is open circuit; ideal inductor is short circuit.
- Capacitor voltage and inductor current are continuous across an ideal switching instant unless an impulse source is explicitly introduced (which this topic excludes).
- Sinusoidal frequency `f` is in hertz and angular frequency is `ω=2πf`.
- Complex impedance uses `j=√-1`; capacitor `Z_C=1/(jωC)=-j/(ωC)`, inductor `Z_L=jωL`.
- Phase answers use degrees in `(-180°,180°]` unless stated.

### Component models

Every nonlinear/device question visibly names its model:

- **Ideal diode:** on is a short with non-negative forward current; off is open with non-positive diode voltage under the shown polarity.
- **Constant-drop diode/LED:** on-state drop is the supplied `V_D`/`V_F`; off is open. The assumed state must be checked.
- **BJT switch model:** cutoff has `I_C=0`; saturation has supplied `V_CE(sat)` and conservative forced beta/design ratio as stated. No active-region analog bias inference unless explicitly modeled.
- **Enhancement NMOS switch model:** off/on decision uses supplied threshold/logic-level condition; on state uses supplied `R_DS(on)` at stated gate drive. `V_GS(th)` must never be treated as guaranteed low-resistance turn-on.
- **Ideal op amp in linear negative feedback:** input currents are zero and `V_+=V_-`, provided the computed output lies within supplied output limits. Otherwise the output saturates according to the simplified supplied limit model.

### Units, prefixes, and answer conventions

Supported prefixes include `p, n, µ/u, m, k, M` with case-sensitive meanings. Unit symbols include:

`V, A, Ω/ohm, W, J, C, F, H, Hz, VA, var, s`.

- Surrounding whitespace is ignored.
- Decimal point/comma follows locale setting.
- Compatible scaled units are accepted (`0.02 A`, `20 mA`).
- `u` is accepted for `µ`.
- Unitless answers must not be interpreted as a prefixed quantity.
- The parser must reject dimensionally incompatible units.
- Requested sign must be preserved; magnitude-only questions say “magnitude.”
- Angles may include `°` or `deg`.
- Multiple values use named fields with units rather than a loose list.

Canonical computation uses exact decimal/rational arithmetic where possible and sufficiently precise transcendental functions for exponentials, `π`, magnitude, and phase. Unless a family says otherwise:

- intermediate values retain at least 12 significant digits;
- round only the final requested quantity;
- accepted tolerance is the larger of the displayed half-unit in the last place and `0.2%` relative;
- conceptual/choice answers require exact semantic selection.

### Schematic requirements

The schematic is part of the question, not decoration.

- Nodes that are electrically identical must join visibly with a dot where ambiguity is possible.
- Crossing unconnected wires must be shown with a bridge/gap or clearly no junction dot.
- Every source polarity, diode orientation, transistor terminal, op-amp supply limit, current arrow, and measured voltage polarity needed for the answer is labeled.
- Component labels in text and SVG must derive from the same semantic graph.
- Each symbol-recognition instance must declare the drawing convention used (`IEC`, `ANSI`, or a named application convention); alternate resistor symbol styles must map to the same resistor semantic type.
- Reference designators, value text, net labels, polarity marks, and terminal names must be separate semantic fields rather than one unparsed SVG string.
- The generated graph must be electrically validated before rendering.
- Layout changes alone are not a question variation and must never alter topology.
- Accessible text must describe nodes, branches, component values, and measurement points sufficiently to solve without the image.

### Difficulty philosophy

Difficulty should rise through topology recognition, model selection, sign/reference reasoning, loading, transient initial/final conditions, phase, interacting constraints, and design verification.

It must not rise merely through awkward prefixes, excessive significant digits, cluttered drawings, many series components, hidden nodes, or arithmetic that is best delegated to a calculator. Most questions should involve at most three essential reasoning stages.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `analysisDomain`, `componentModel`, `drawingConvention`, `circuitGraph`, `schematicLayout`, `annotationSemantics`, `responseMode`, `choiceSet`, `givensSI`, `requestedQuantity`, `expectedDimension`, `exactAnswer`, `displayAnswer`, `tolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, and `structuralSignature`.

Fields not applicable to a family are explicitly `null` or empty, not silently omitted. Choice answers store stable semantic IDs separately from localized display text.

Generate the semantic graph and model first, solve it independently, validate constraints, then render text/SVG. Reject recent structural signatures within 20 questions and exact instances within 100.

## 2. Category: Schematic Literacy and Connectivity

### Category purpose

Build the visual and topological reading skills required before equations are useful: identify what symbols and labels mean, recover the electrical graph from a drawing, and predict the immediate consequences of simple connections and faults.

### Learn

A schematic describes electrical connections, not physical placement. A component symbol identifies a type; a reference designator identifies one particular component; a value or part marking describes it. Continuous ideal wire, joined wire at a junction dot, and repeated identical net labels denote one node. A crossing without a junction does not. Components are series only when their shared node has no other branch, and parallel only when both terminal-node pairs match. An open breaks a path; a short joins two nodes with zero ideal resistance and may bypass a component.

Read conventional current as a possible closed path from a source's labeled positive terminal through conducting branches to its negative terminal. Do not infer current merely from drawing direction or proximity. Component polarity and terminal names matter, but ground is only the chosen `0 V` reference.

Representative examples: `R3` means the third resistor identifier, not `3 Ω`; `4k7` means `4.7 kΩ`; two wires carrying the same `OUT` net label are the same node even if no line is drawn between them.

Expected answer styles are exact selected meanings, node sets, ordered paths, or normalized component values with units. When a drawing convention varies, the question states the convention or accepts all semantically equivalent names listed by the family.

### Prerequisites

- Basic arithmetic and reading of Latin letters and decimal numbers.
- No circuit formulas and no prior symbol knowledge are assumed.

### Category boundaries

This category asks what a schematic says and what connectivity alone implies. Quantitative Ohm/Kirchhoff calculations belong in DC Foundations; nonlinear device-state calculation belongs in Diodes and Transistor Switches; instrument loading belongs in Digital Interfaces, Measurement, and Practical Limits. Fault questions here contain one idealized fault and use connectivity or supplied binary behavior, not real troubleshooting procedures.

### Subcategories

1. Symbols, Designators, and Labels
2. Polarity, Terminals, and Value Markings
3. Nodes, Paths, Opens, and Shorts
4. Topology Classification and Basic Fault Diagnosis

### Subcategory: Symbols, Designators, and Labels

**Skill.** Distinguish a component's graphical symbol, unique reference designator, displayed value, and named net or supply label.

**Mental operation.** Inspect shape and annotation independently, then map each field to its semantic role without treating its screen position as connectivity.

**Common misconceptions.**

- Reading `R7` as a resistance value instead of an identifier.
- Assuming two components with the same prefix are connected or interchangeable.
- Treating every ground-like mark as protective earth.
- Confusing a cell/source symbol, polarized capacitor, and unpolarized capacitor.
- Inferring a device from its value text while ignoring the symbol.

**Generation scope.** Use only the symbol and label vocabularies declared in the two families below. Draw one target plus zero to four context components from a validated semantic graph. The target must remain legible at the smallest supported viewport and must have accessible text that does not reveal the answer by naming its semantic type.

**Difficulty dimensions.** Symbol visual similarity, presence of context, abstraction of the requested role, alternate declared symbol convention, and separation between a label and the item it names.

**Question families.** `schematic_symbol_recognition`, then `reference_designator_and_label`.

### Question Family: `schematic_symbol_recognition` — Recognize a schematic symbol

**Learner task.** Identify the component or schematic object represented by one highlighted symbol.

**Relationship to the skill.** Fast, reliable symbol recognition lets the learner parse later schematics before selecting a model or equation.

**Response mode.** Single-choice.

**Question template.**

> In this `{symbolConvention}` schematic, what does highlighted symbol `{targetTag}` represent?

The schematic and accessible description say only that `{targetTag}` is highlighted and describe its strokes/terminals; they must not name the object.

**Placeholder definitions.**

- `{symbolConvention}` is `IEC`, `ANSI`, or `common mixed-signal convention`; it selects a reviewed renderer glyph set. A mixed convention may be used only for symbols whose meanings do not conflict.
- `{targetTag}` is a display tag such as `A`, not a reference designator and not a component name.
- The hidden semantic `{symbolType}` is one of: resistor, non-polarized capacitor, polarized capacitor, inductor, cell, multi-cell battery, independent voltage source, independent current source, circuit-reference ground, open switch, closed switch, diode, LED, NPN BJT, enhancement NMOS, op amp, or connection/junction dot. Levels restrict this set.

**Answer template.** `{canonicalSymbolName}`.

**Answer derivation.** Read the renderer's semantic `symbolType` for the highlighted graph object and map it through the convention-specific synonym table. Do not classify from pixel geometry in the answer generator.

**Accepted answers.** The selected canonical choice only. When shown as a non-choice accessibility fallback, accept case-insensitive canonical names and declared synonyms such as `resistor`/`resistance`, `non-polar capacitor`/`unpolarized capacitor`, and `ground`/`0 V reference`; do not accept `earth` for circuit-reference ground.

**Instance constraints.**

- Exactly one choice denotes `{symbolType}` under `{symbolConvention}`.
- Show all polarity marks, arrows, light arrows, and transistor terminal cues required by that convention.
- Choices use names at the same taxonomic level; do not contrast `diode` with a part number.
- The crop includes complete terminals and no overlapping label.

**Rejection rules.**

- Reject ambiguous or nonstandard glyphs, clipped arrows, symbol/value overlap, or a glyph that requires color alone to distinguish it.
- Reject a distractor that is also a valid name for the glyph.
- Reject context that reveals the answer through a reference prefix or explicit value unit.
- Reject cosmetic-only repeats of the same target and distractor set within the recent-history window.

**Controlled variations.**

- Isolated symbol versus highlighted symbol in a small circuit.
- Recognize a component versus a non-component schematic object such as a junction or reference ground.
- IEC rectangular and ANSI zigzag resistor variants, always with the convention stated.
- Match two symbols to two names only after single-target recognition is mastered.

**Difficulty levels.**

- **Level 1:** resistor, non-polarized capacitor, cell, open/closed switch, and circuit-reference ground; isolated target; four visually distinct choices.
- **Level 2:** inductor, voltage/current source, diode, LED, and polarized capacitor; one relevant orientation cue.
- **Level 3:** target appears among two to four context symbols; distractors are visually related, such as diode/LED or capacitor/polarized capacitor.
- **Level 4:** NPN BJT, enhancement NMOS, and op amp under the declared convention; terminal details are visible, but terminal naming is assessed in the polarity family.
- **Level 5:** mixed matching set across passive, source, switching, and semiconductor classes with reduced highlighting; no new obscure symbols.

**Multiple-choice distractors.**

- Use a visually confusable symbol: capacitor for cell, diode for LED, current source for voltage source, BJT for MOSFET.
- Use a functional overgeneralization: `earth connection` for circuit-reference ground or `wire crossing` for junction.
- Use one familiar but geometrically dissimilar item only at Level 1 as scaffolding.
- Never use arbitrary component names merely to fill the choice count.

**Feedback.**

- **Correct feedback:** “Correct: `{targetTag}` is `{canonicalSymbolName}`. `{recognitionCue}`.”
- **Incorrect feedback:** Name the visible cue that distinguishes the selected distractor, for example, “An LED has outward light arrows; this diode symbol does not.”
- **Worked solution:** State the declared convention, point out the defining strokes/arrow/polarity mark, name the component class, and state one limited schematic role without introducing an unstated device model.

**Examples.**

1. **Question:** “In this ANSI schematic, what does highlighted symbol A represent?” The target is a zigzag with two terminals. Choices: resistor, capacitor, open switch, ground. **Answer:** resistor. **Derivation:** ANSI zigzag resistor glyph. **Level:** 1. **Targets:** confusing component type with placement.
2. **Question:** “In this IEC schematic, what does highlighted symbol B represent?” The target has two plates and a `+` by one plate. Choices: non-polarized capacitor, polarized capacitor, cell, voltage source. **Answer:** polarized capacitor. **Derivation:** capacitor plates plus explicit positive-terminal mark. **Level:** 2. **Targets:** ignoring polarity mark.
3. **Question:** “In this common mixed-signal convention schematic, what does highlighted symbol C represent?” The highlighted three-terminal symbol has an insulated gate line and no emitter arrow. Choices: enhancement NMOS, NPN BJT, diode, op amp. **Answer:** enhancement NMOS. **Derivation:** insulated gate and MOSFET channel/source-drain glyph distinguish it from a BJT. **Level:** 4. **Targets:** treating all three-terminal devices as transistors of one type.

**Implementation notes.** Generate the semantic object first and select a reviewed SVG symbol keyed by `{symbolConvention}`. Maintain separate canonical-name, accepted-synonym, visual-cue, and distractor-confusion tables. Accessibility descriptions may describe geometry and visible marks but must not contain the canonical name before submission.

**Automated validation.** Assert that the glyph key maps back to exactly one semantic type, all required marks are present, every placeholder is substituted, choices are unique with one correct answer, accessibility text does not contain an accepted answer token, and the target bounding box is unclipped at all supported sizes. Snapshot-test every symbol/convention pair.

**Coverage requirements.** Each unlocked symbol appears as the answer before it is used only as context. Balance passive/source/switch/device/object classes; both resistor conventions; diode versus LED; polarized versus non-polarized capacitor; open versus closed switch; and ground versus junction. No target may exceed 12% of this family's rolling 100 items.

### Question Family: `reference_designator_and_label` — Interpret designators and common labels

**Learner task.** Determine whether a highlighted annotation is a component identifier, value, terminal name, net label, supply label, or no-connect marker and interpret its conventional meaning.

**Relationship to the skill.** Separating identity from value and connectivity prevents label-based topology errors and supports unambiguous communication about later circuits.

**Response mode.** Single-choice at Levels 1–3; matching at Levels 4–5.

**Question templates.**

> In the shown schematic, what does `{annotation}` tell you?

> Match each annotation `{annotationSet}` to its role.

**Placeholder definitions.**

- `{annotation}` is selected from component identifiers `R1`, `C2`, `L3`, `D4`, `LED1`, `Q1`, `U1`, `SW1`, `J1`, and `TP1`; values such as `10 kΩ` or `100 nF`; terminal labels `A`, `K`, `G`, `D`, `S`, `B`, `C`, `E`, `+`, `-`; net labels `VIN`, `VOUT`, `SENSE`, `RESET`; supply/reference labels `GND`, `0V`, `VCC`, `VDD`, `VSS`, `VEE`; or the explicit no-connect marker `NC`/cross specified by the drawing convention.
- `{annotationSet}` contains three or four annotations with distinct roles.
- `{role}` is a generator semantic, not inferred solely from spelling. A legend is supplied whenever project-specific usage could differ.

**Answer template.** `{role}: {meaning}`; matching answers store an annotation-to-role map.

**Answer derivation.** Read the annotation object's semantic role. For a reference designator, split its conventional prefix and unique index; for a net label, resolve all identical in-scope labels to one net; for a supply label, report the declared rail/reference meaning from the question legend.

**Accepted answers.** Exact selected role/meaning. Matching requires all pairs correct unless the UI supports per-pair scoring. `GND`, `0V`, and supply names are not interchangeable unless the schematic explicitly aliases them.

**Instance constraints.**

- A visible legend defines any nonstandard prefix or label.
- `Q` may mean BJT or MOSFET generally, so the correct meaning is “transistor/device identifier” unless the adjacent symbol resolves the type.
- `U` means integrated-circuit identifier, not automatically op amp.
- Repeated net labels connect only within the declared schematic scope.
- `NC` is used only when explicitly defined as no-connect, not as an unlabeled pin name.

**Rejection rules.**

- Reject a question whose answer depends on undocumented company conventions.
- Reject choices claiming that a designator encodes value, connectivity, quality, or physical order.
- Reject a supply label if its voltage is not given but a choice asserts a numeric voltage.
- Reject label placement that could visually attach to two objects.

**Controlled variations.**

- Interpret the prefix, the numeric suffix, or the whole annotation's role.
- Distinguish identifier from value on one component.
- Identify that repeated net labels connect distant wire segments.
- Match labels to roles with a supplied legend.

**Difficulty levels.**

- **Level 1:** `R`, `C`, `L`, `D` identifiers contrasted with explicit values.
- **Level 2:** `Q`, `U`, `SW`, `J`, and `TP`; common `VIN`, `VOUT`, `GND`, and `0V`.
- **Level 3:** distinguish terminal labels from net labels and explain repeated-label connectivity.
- **Level 4:** match three or four annotations from one schematic, including a supply label whose voltage comes from a legend.
- **Level 5:** scope-aware repeated labels and aliases explicitly declared by a hierarchical-sheet legend; no undocumented CAD-specific rules.

**Multiple-choice distractors.**

- Interpret the numeric suffix as the component value.
- Treat a net label as a reference designator or terminal name.
- Assign a fixed voltage to `VCC`/`VDD` without a legend.
- Treat `GND` as protective earth or assume differently named ground-like labels are connected.
- Treat `NC` as ground or as a hidden connection.

**Feedback.**

- **Correct feedback:** “Correct: `{annotation}` is `{role}`; `{meaning}`.”
- **Incorrect feedback:** Contrast the chosen role with the visible context, such as “`R12` identifies which resistor this is; `4.7 kΩ` is its value.”
- **Worked solution:** Identify the annotation class, interpret its prefix/name using the declared convention, and state what it does and does not imply about value or connectivity.

**Examples.**

1. **Question:** “In the shown schematic, what does `R3` tell you?” Choices: the resistor is `3 Ω`; it is the identifier of a resistor; it joins node R to node 3; it is tolerance class 3. **Answer:** it is the identifier of a resistor. **Derivation:** `R` is the resistor prefix and `3` distinguishes the instance. **Level:** 1. **Targets:** designator-as-value.
2. **Question:** “Two separated wire segments are both labeled `VOUT` within this sheet. What does that tell you?” **Answer:** they are the same electrical net. **Derivation:** equal in-scope net labels identify one node. **Level:** 3. **Targets:** requiring a drawn wire for connectivity.
3. **Question:** “The legend says `VDD = 3.3 V` and `AGND` is not tied to `GND` on this sheet. Match `Q2`, `VDD`, `G`, and `AGND` to their roles.” **Answer:** transistor/device identifier; 3.3 V supply net; gate terminal; distinct analog reference net. **Derivation:** use symbol context and the explicit legend, without aliasing ground names. **Level:** 5. **Targets:** assuming names alone prove voltage or connection.

**Implementation notes.** Store annotation role, displayed text, scope, target object/net, and legend entry separately. The generator may select familiar conventional names but must construct the answer from semantic data, not regex alone.

**Automated validation.** Verify unique designators, label-to-net resolution, annotation anchoring, legend completeness, exactly one correct choice or bijective matching map, and absence of undeclared aliases. Ensure generated explanatory text never claims more than the semantic role guarantees.

**Coverage requirements.** Balance component identifiers, values, terminals, ordinary nets, supply/reference nets, and no-connect markers. At least 20% of Level 3+ items must use repeated net labels, and at least 20% must expose the designator-versus-value misconception.

### Subcategory: Polarity, Terminals, and Value Markings

**Skill.** Read orientation-dependent terminal information and decode common passive-component value markings.

**Mental operation.** Locate the orientation cue or notation convention, assign semantic terminals/significance, then translate it to a polarity statement or normalized value.

**Common misconceptions.**

- Treating current direction and voltage polarity as intrinsic rather than declared references.
- Reversing diode anode/cathode or assuming every capacitor is polarized.
- Reading color bands from the wrong end or using a tolerance color as a digit.
- Reading `4k7` as `47 kΩ`, or reading capacitor code `104` as `104 pF`.
- Treating a BJT emitter arrow as a current-source arrow.

**Generation scope.** Use explicit, reviewed orientation cues; 4- and 5-band resistor codes; RKM resistor notation; and three-digit capacitor codes in pF. No manufacturer-specific SMD code, EIA-96 code, polarized-capacitor stripe convention, or device pin-number package mapping is assumed.

**Difficulty dimensions.** Cue subtlety, requested direction versus terminal name, encoding versus decoding, significant-digit count, multiplier range, mixed prefix conversion, and nearby irrelevant labels.

**Question families.** `polarity_and_terminal_interpretation`, `resistor_color_code`, and `compact_component_notation`.

### Question Family: `polarity_and_terminal_interpretation` — Read polarity and terminals

**Learner task.** Identify a named terminal, interpret a marked voltage polarity/current reference, or determine the sign meaning encoded by the shown orientation.

**Relationship to the skill.** Later Ohm's-law, diode, transistor, op-amp, and power questions are only meaningful if the learner reads terminal and reference conventions correctly.

**Response mode.** Single-choice or one named short-text field.

**Question templates.**

> Which highlighted terminal of `{componentRef}` is the `{terminalName}`?

> The schematic defines `{voltageName}` with `+` at `{positiveNode}` and `-` at `{negativeNode}`. What node-voltage expression equals `{voltageName}`?

> What does a negative value of current `{currentName}`, whose arrow points `{arrowDirection}`, mean?

**Placeholder definitions.**

- `{componentRef}` identifies a source, polarized capacitor, diode/LED, NPN BJT, enhancement NMOS, or op amp.
- `{terminalName}` is positive/negative terminal, anode/cathode, base/collector/emitter, gate/drain/source, or non-inverting/inverting input, restricted by component type.
- `{positiveNode}` and `{negativeNode}` are distinct node IDs; `{voltageName}` is `V_{positiveNode}{negativeNode}` or another explicitly drawn voltage arrow.
- `{currentName}` is a unique current label and `{arrowDirection}` names its two endpoint nodes.
- Visual cues follow the declared symbol convention: diode bar marks cathode, BJT arrow is on emitter, MOS gate is insulated, and op-amp inputs carry `+`/`-`.

**Answer template.** Terminal tasks: `{terminalId}`. Voltage tasks: `V({positiveNode}) - V({negativeNode})`. Negative-current tasks: `actual current flows opposite the drawn arrow`.

**Answer derivation.** Resolve the highlighted symbol terminal through the semantic graph. For voltage, subtract the node at the `-` mark from the node at the `+` mark. For current, interpret the arrow as the positive reference and reverse it only when the signed result is negative.

**Accepted answers.** Exact selected terminal/statement. Short text accepts declared synonyms (`non-inverting`/`positive input`, `cathode`/`K`) and algebraically identical node-voltage expressions in the same order. A reversed expression is not accepted.

**Instance constraints.**

- Every required orientation mark is visible and repeated in accessible text.
- Node names are distinct and unambiguous.
- Terminal questions do not require package pinout knowledge.
- The family tests interpretation only; device conduction or gain is not inferred unless stated as a meaning choice.

**Rejection rules.**

- Reject symmetric symbol orientations with no identifying cue.
- Reject op-amp input `+`/`-` choices that call them power-supply pins.
- Reject diode questions where the cathode bar is obscured.
- Reject cases where voltage expression simplifies to zero or the current-arrow endpoints are the same node.

**Controlled variations.**

- Terminal name from symbol; highlighted terminal from name.
- Voltage expression from drawn polarity; place polarity marks for a supplied expression.
- Interpret negative current or negative absorbed power reference.
- Rotate or mirror the whole symbol while preserving its terminal semantics.

**Difficulty levels.**

- **Level 1:** source `+`/`-`, voltage polarity, and negative-current arrow meaning with strong labels.
- **Level 2:** diode/LED anode and cathode, and polarized-capacitor marked terminal.
- **Level 3:** BJT `B/C/E`, NMOS `G/D/S`, or op-amp `+/-` inputs with terminal cues.
- **Level 4:** mirrored/rotated symbols in context plus one irrelevant nearby label.
- **Level 5:** combine a terminal identification with a signed `V_ab` or current-reference interpretation; still at most two reasoning steps.

**Multiple-choice distractors.**

- Reverse positive and negative nodes in `V_ab`.
- Treat a negative current as impossible or as zero.
- Name the diode bar as anode.
- Name the BJT arrow terminal as collector or confuse BJT and MOS terminal vocabularies.
- Treat op-amp `+`/`-` input marks as supply polarity.

**Feedback.**

- **Correct feedback:** “Correct: `{orientationCue}` identifies `{answer}`.”
- **Incorrect feedback:** Diagnose the specific reversal or symbol confusion, for example, “The diode bar marks the cathode, not the anode.”
- **Worked solution:** Locate the cue, map it to the terminal/reference, then write the polarity or direction in words and, when applicable, as `V(+) - V(-)`.

**Examples.**

1. **Question:** “The schematic defines `V_ab` with `+` at node a and `-` at node b. What expression equals `V_ab`?” **Answer:** `V(a)-V(b)`. **Derivation:** voltage is positive-node potential minus negative-node potential. **Level:** 1. **Targets:** reversed subtraction.
2. **Question:** “Which highlighted terminal of D2 is the cathode?” The right terminal touches the diode bar. **Answer:** right terminal. **Derivation:** the bar is the cathode cue. **Level:** 2. **Targets:** anode/cathode reversal.
3. **Question:** “On the mirrored NPN symbol Q1, which highlighted terminal is the emitter?” **Answer:** terminal E, the lead carrying the arrow. **Derivation:** the BJT arrow is on the emitter even when mirrored. **Level:** 4. **Targets:** relying on page position.

**Implementation notes.** Symbol transforms must transform terminal coordinates but never semantic terminal IDs. Create the correct answer from terminal metadata. Accessibility text may say “lead with the arrow” but should not name it before submission.

**Automated validation.** Verify terminal count/type, orientation marks after transforms, node distinction, voltage-expression order, one correct choice, synonym normalization, and screenshot legibility. Property-test mirror/rotation invariance of semantic answers.

**Coverage requirements.** Balance reference-direction, voltage-polarity, passive/device terminal, and op-amp-input tasks. Each orientation-sensitive device must appear both mirrored and unmirrored; no screen position may predict a terminal above chance over the test corpus.

### Question Family: `resistor_color_code` — Decode and construct resistor color bands

**Learner task.** Decode a 4- or 5-band resistor value and tolerance, or choose the band sequence that encodes a supplied value.

**Relationship to the skill.** This builds fluent translation between a common physical component marking and the values used on schematics and in calculations.

**Response mode.** Two named fields (`resistance`, `tolerance`) for decoding; single-choice for encoding.

**Question templates.**

> Read from the end marked by `{readStartCue}`. What resistance and tolerance do bands `{bandSequence}` represent?

> Which `{bandCount}`-band sequence represents `{targetResistance}` with `{targetTolerance}` tolerance?

**Placeholder definitions.**

- `{readStartCue}` is a visible arrow or “bands left to right”; the renderer also separates the tolerance band for a 4-band resistor.
- `{bandSequence}` is an ordered list of color names and rendered bands.
- `{bandCount}` is `4` or `5`.
- Digit colors: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9.
- Multiplier colors represent `10^n` for black through white; gold is `10^-1`, silver is `10^-2`.
- Tolerance colors used here: brown `±1%`, red `±2%`, green `±0.5%`, blue `±0.25%`, violet `±0.1%`, grey `±0.05%`, gold `±5%`, silver `±10%`.
- Four-band format is two significant digits, multiplier, tolerance. Five-band format is three significant digits, multiplier, tolerance.

**Answer template.** Decode: `resistance={normalizedResistance}; tolerance=±{tolerancePercent}%`. Encode: `{orderedBandSequence}`.

**Answer derivation.** Convert significant-digit bands to integer `S`, multiply by the multiplier band's factor, and attach the tolerance band's percentage. For encoding, choose the required number of significant digits and an allowed integer multiplier exponent that reproduces the target exactly, then map digits/factor/tolerance to colors.

**Accepted answers.** Resistance accepts any compatible scaled unit under global conventions; tolerance accepts numeric percent with optional `±`. Encoding accepts only the selected ordered sequence. British spelling `grey` and American `gray` normalize identically in text fallback.

**Instance constraints.**

- The reading direction is explicit; the first significant digit is nonzero.
- Encoded target values have exactly one representation at the requested band count under the allowed multiplier table.
- Generated resistance range is `0.1 Ω` through `99 GΩ` for four-band and `0.1 Ω` through `999 GΩ` for five-band, further capped to `1 Ω..10 MΩ` at Levels 1–2.
- Color is duplicated by text/order for accessibility.

**Rejection rules.**

- Reject an ambiguous orientation, a missing tolerance band, or adjacent bands that merge visually.
- Reject target values requiring rounding or a multiplier outside the table.
- Reject all-black significant digits, leading black, and tolerance-less 3-band cases.
- Reject distractor sequences that accidentally encode the same value/tolerance.

**Controlled variations.**

- Decode value only, then value plus tolerance.
- Encode a supplied normalized value.
- Four-band versus five-band.
- Request base ohms or a sensible SI-prefixed display without changing the decoded value.

**Difficulty levels.**

- **Level 1:** four-band, multipliers black through yellow, gold tolerance, explicit left-to-right text.
- **Level 2:** varied allowed tolerances and SI-prefix normalization.
- **Level 3:** gold/silver multipliers and encode-from-value questions.
- **Level 4:** five-band decoding with three significant digits.
- **Level 5:** interleave four- and five-band encode/decode and less common tolerance colors; band count and read direction remain explicit.

**Multiple-choice distractors.**

- Reverse the significant bands.
- Treat the multiplier color as another significant digit.
- Use the tolerance band as a multiplier.
- Shift the multiplier by one decade.
- Apply the four-band rule to a five-band code or omit the third significant digit.

**Feedback.**

- **Correct feedback:** “Correct: `{significantDigits} × {multiplier} = {normalizedResistance}`, with `{toleranceColor} = ±{tolerancePercent}%`.”
- **Incorrect feedback:** Compare the answer with known error transforms, naming the likely band-position or decade error.
- **Worked solution:** Mark the reading direction, label each band role, translate colors to digits/factor/tolerance, calculate in ohms, then normalize the prefix.

**Examples.**

1. **Question:** “Read left to right. What resistance and tolerance do brown–black–red–gold bands represent?” **Answer:** `1 kΩ`, `±5%`. **Derivation:** `10 × 10² Ω = 1000 Ω`; gold is `±5%`. **Level:** 1. **Targets:** multiplier as digit.
2. **Question:** “Which 4-band sequence represents `4.7 Ω ±1%`?” **Answer:** yellow–violet–gold–brown. **Derivation:** `47 × 0.1 Ω = 4.7 Ω`; brown tolerance is `1%`. **Level:** 3. **Targets:** gold multiplier versus tolerance role.
3. **Question:** “Read left to right. What do brown–violet–black–orange–brown represent?” **Answer:** `170 kΩ`, `±1%`. **Derivation:** `170 × 10³ Ω`; final brown is tolerance. **Level:** 4. **Targets:** applying the two-digit rule to five bands.

**Implementation notes.** Use a data table for each color's allowed roles. Generate from exact integer significands and powers of ten, then render; do not sample floating values and approximate them. Supply texture/order labels in addition to color.

**Automated validation.** Decode the rendered sequence independently; encode the exact target back and compare; verify band count, legal role/color combinations, unique correct choice, readable contrast, text alternative order, accepted-unit equivalence, and misconception mapping for every distractor.

**Coverage requirements.** Balance decode/encode, four/five bands after unlock, multiplier decades, tolerance colors, and answers below/above `1 kΩ`. Gold/silver multiplier cases must recur but remain below 25%; gold tolerance must not dominate above 40% after Level 2.

### Question Family: `compact_component_notation` — Decode resistor and capacitor markings

**Learner task.** Convert between compact resistor notation or three-digit capacitor codes and an ordinary value with units.

**Relationship to the skill.** The family prevents place-value errors when schematic labels or component markings replace a decimal point with a multiplier letter or encode capacitance in picofarads.

**Response mode.** Numeric quantity for decoding; single-choice for encoding.

**Question templates.**

> The resistor is marked `{resistorMark}`. What is its resistance?

> The capacitor's three-digit code is `{capacitorCode}` (value encoded in pF). What is its capacitance?

> Which `{notationType}` marking represents `{targetValue}`?

**Placeholder definitions.**

- `{resistorMark}` uses RKM notation `[digits]R[digits]`, `[digits]k[digits]`, or `[digits]M[digits]`; the letter is both decimal marker and multiplier. Allowed examples include `2R2`, `4k7`, `10k`, `1M0`; case is significant for `M`.
- `{capacitorCode}` is exactly three decimal digits `ABC`; `AB` is an integer from 10 to 99 and `C` from 0 to 6, meaning `AB × 10^C pF`.
- `{notationType}` is `resistor RKM` or `three-digit capacitor`.
- `{targetValue}` is constructed to have an exact allowed encoding.

**Answer template.** `{normalizedValue} {unit}`.

**Answer derivation.** For RKM, replace `R`, `k`, or `M` by a decimal point for digit placement, parse the resulting significand, then multiply by `1 Ω`, `1 kΩ`, or `1 MΩ`. If no trailing digit follows the letter, the value is an integer multiple. For a capacitor code, parse the first two digits as `S`, exponent digit as `n`, compute `S×10^n pF`, and convert to the requested convenient unit.

**Accepted answers.** Any dimensionally compatible resistance/capacitance value under global unit conventions. Preserve uppercase `M` as mega; lowercase `m` is not an accepted replacement. Encoding choices require exact marking text.

**Instance constraints.**

- The question explicitly says resistor or capacitor and names the notation convention.
- RKM markings contain exactly one multiplier letter and at least one digit before it.
- Capacitor codes are exactly three digits with a two-digit nonzero significand.
- Encoding targets are exactly representable and have one canonical marking under the family's formatting rule.

**Rejection rules.**

- Reject manufacturer-specific, EIA-96, tolerance-letter, decimal-point, or significant-leading-zero codes outside this family.
- Reject capacitor codes with an ambiguous printed glyph or more/fewer than three digits.
- Reject RKM values where lowercase/uppercase loss would change the answer in the current font.
- Reject choices that differ only by a globally accepted equivalent unit.

**Controlled variations.**

- Decode RKM marking; encode RKM from value.
- Decode capacitor code to pF, nF, or µF.
- Encode a capacitance as a three-digit pF code.
- Interleave notation types only when the component type remains explicit.

**Difficulty levels.**

- **Level 1:** `R`/`k` resistor marks such as `2R2`, `4k7`, and whole-decade capacitor codes such as `103`.
- **Level 2:** trailing-zero/absent-fraction resistor marks and capacitor prefix conversion.
- **Level 3:** `M` resistor marks and non-round capacitor codes such as `472`.
- **Level 4:** inverse encoding from a supplied value.
- **Level 5:** mixed encode/decode with close decade distractors; notation type remains stated and arithmetic stays mental.

**Multiple-choice distractors.**

- Remove the letter without preserving its decimal position (`4k7 → 47 kΩ`).
- Treat `R` as a unit suffix only (`2R2 → 22 Ω`).
- Read all three capacitor digits as a number (`104 → 104 pF`).
- Use the third capacitor digit as a multiplier rather than a power of ten.
- Convert pF to nF/µF by the wrong factor of `1000`.

**Feedback.**

- **Correct feedback:** RKM: “Correct: the `{letter}` marks the decimal position and the `{multiplier}` scale.” Capacitor: “Correct: `{AB} × 10^{C} pF = {normalizedValue}`.”
- **Incorrect feedback:** Match the response to the place-value/decade transforms above and explicitly show the marker role.
- **Worked solution:** Identify notation type, split significand and multiplier/exponent, compute in base encoded units, then convert once to the display prefix.

**Examples.**

1. **Question:** “The resistor is marked `4k7`. What is its resistance?” **Answer:** `4.7 kΩ`. **Derivation:** `k` replaces the decimal point and supplies kilo-ohms. **Level:** 1. **Targets:** reading `47 kΩ`.
2. **Question:** “The capacitor's three-digit code is `472` (value encoded in pF). What is its capacitance?” **Answer:** `4.7 nF`. **Derivation:** `47×10² pF = 4700 pF = 4.7 nF`. **Level:** 3. **Targets:** reading `472 pF`.
3. **Question:** “Which three-digit capacitor code represents `100 nF`?” **Answer:** `104`. **Derivation:** `100 nF = 100,000 pF = 10×10⁴ pF`. **Level:** 4. **Targets:** using `100` or `105`.

**Implementation notes.** Represent values exactly as integer ohms where possible or rational SI quantities. Generate codes first for decode questions and exact encodable targets first for inverse questions. Typography must distinguish `M`, `k`, and digits clearly.

**Automated validation.** Round-trip every marking through independent encoder/decoder functions; assert exact dimension and value, three-character capacitor format, canonical RKM output, one correct choice, no equivalent-valued distractors, and full placeholder substitution.

**Coverage requirements.** Balance resistance/capacitance and encode/decode after unlock. Cover `R`, `k`, and `M`; capacitor exponent digits `0..6` without overconcentrating on `3`/`4`; and normalized answers in pF, nF, and µF.

### Subcategory: Nodes, Paths, Opens, and Shorts

**Skill.** Convert a schematic drawing into nodes and conducting paths, including junctions, crossings, labels, switch states, opens, and zero-resistance connections.

**Mental operation.** Trace continuous conductive connectivity without crossing a component boundary, merge explicitly joined points, then search for complete source-to-return paths.

**Common misconceptions.**

- Treating a wire crossing without a dot as connected.
- Treating two points separated by a component as the same node.
- Missing repeated-label connectivity or assuming proximity creates it.
- Believing current is used up, follows only one parallel branch, or can traverse an open.
- Confusing a closed switch (short connection) with an open switch.

**Generation scope.** Reviewed graphs contain 2–8 named nodes, 2–10 ideal-wire segments, 1–6 components, and at most two switches. Path questions use only elements declared conducting/nonconducting; no unstated diode/transistor state.

**Difficulty dimensions.** Junction/crossing cues, repeated labels, wire bends, number of branches, switch-state combinations, bypass connections, and whether one or all paths are requested.

**Question families.** `electrically_identical_nodes`, `possible_current_paths`, and `open_short_recognition`.

### Question Family: `electrically_identical_nodes` — Identify one electrical node

**Learner task.** Select all labeled points that are electrically identical under the shown ideal-wire and switch states.

**Relationship to the skill.** Node identification is the bridge from schematic artwork to the graph used by KCL, voltage measurement, parallel classification, and nodal analysis.

**Response mode.** Multiple-choice (select all that apply).

**Question template.**

> Which labeled points are on the same electrical node as `{anchorPoint}`? Select all that apply.

**Placeholder definitions.**

- `{anchorPoint}` is one of 3–8 visible point labels `A` through `H`.
- Other point labels are attached to wire coordinates or component terminals.
- The semantic graph includes ideal wires, explicit junctions, unconnected crossings, same-scope net-label aliases, closed switches modeled as wires, open switches, and ordinary two-terminal components.

**Answer template.** An unordered set `{equivalentOtherPointSet}`, displayed in label order and excluding the already-given `{anchorPoint}`.

**Answer derivation.** Build a connectivity graph containing ideal-wire edges, junction joins, repeated equal net-label joins, and closed-switch edges. Do not add edges across open switches or components. Return all offered point labels other than `{anchorPoint}` that are in its connected component.

**Accepted answers.** Exactly the correct set of offered points; order ignored. The anchor is shown as the reference and is not an answer choice. Partial sets are incorrect unless the UI explicitly supports diagnostic partial credit.

**Instance constraints.**

- At least one other point shares the anchor node and at least one does not.
- Crossings use the global dot/gap rules and remain legible.
- Any repeated net label is unique to one semantic net within scope.
- A component terminal at the end of a wire belongs to that node, but the opposite terminal does not unless independently shorted.

**Rejection rules.**

- Reject all-or-none answers, accidental duplicate point labels, visually ambiguous junctions, or a component shorted unintentionally.
- Reject layouts where line thickness or near-touching suggests a connection absent from the graph.
- Reject answer sets made obvious only by all correct labels being spatially adjacent.

**Controlled variations.**

- Continuous/bent wire, junction branch, crossing without junction.
- Repeated net labels connecting separated regions.
- Open versus closed switch in the connectivity graph.
- Ask whether two highlighted points are the same node as a yes/no diagnostic variant.

**Difficulty levels.**

- **Level 1:** one continuous wire with bends and one component boundary; no crossings.
- **Level 2:** one three-way junction and one unconnected crossing.
- **Level 3:** repeated net labels or one switch state.
- **Level 4:** combine junction, crossing, and component terminal across separated drawing regions.
- **Level 5:** up to eight points and two switches/labels, but no more than three independent connectivity decisions.

**Multiple-choice distractors.**

- A point across a resistor or source.
- A wire that merely crosses the anchor wire without a junction.
- A nearby point on a different net.
- A point separated by an open switch.
- Omit a distant point joined by the same net label.

**Feedback.**

- **Correct feedback:** “Correct: `{anchorPoint}` and `{equivalentOtherPointSet}` are connected by ideal wire, joined labels, or closed switches with no component between them.”
- **Incorrect feedback:** Mark each missed/extra point and name the exact boundary or join involved.
- **Worked solution:** Start at `{anchorPoint}`, trace only allowed zero-resistance connections, stop at every component/open, resolve repeated labels, and list the reached point labels.

**Examples.**

1. **Question:** “A and B lie on one continuous wire; R1 separates B from C. Which offered points are on the same node as A?” **Answer:** B. **Derivation:** wire joins A/B; R1 is a component boundary. **Level:** 1. **Targets:** treating both resistor terminals as one node.
2. **Question:** “The A–B wire crosses the C–D wire without a dot. Which offered points share A's node?” **Answer:** B. **Derivation:** an unmarked crossing is not a junction. **Level:** 2. **Targets:** crossing-as-junction.
3. **Question:** “A is on a wire labeled `SENSE`; D is on a distant wire also labeled `SENSE`; B is across an open switch; C joins A at a dot. Which offered points share A's node?” **Answer:** C and D. **Derivation:** dot and repeated label join; the open switch excludes B. **Level:** 4. **Targets:** missing label connectivity and crossing an open.

**Implementation notes.** Compute node membership before layout. Renderer crossings carry explicit junction booleans. Net-label scope is part of the semantic graph. Randomized layout must not alter the union-find result.

**Automated validation.** Compare a union-find implementation with an independent graph connected-components pass; verify point-label uniqueness, crossing/junction rendering, answer-set cardinality, accessibility equivalence, and invariance under allowed layout changes.

**Coverage requirements.** Balance wire bends, junctions, unconnected crossings, components, switches, and repeated labels. At least 30% of Level 2+ items include an unconnected crossing and 20% of Level 3+ include a distant same-label connection.

### Question Family: `possible_current_paths` — Trace complete conducting paths

**Learner task.** Identify every possible complete conventional-current path between the labeled terminals of an energized source for the shown ideal states.

**Relationship to the skill.** Path tracing establishes the closed-loop intuition needed before KCL/KVL and prevents learners from reasoning from component proximity or isolated voltage labels.

**Response mode.** Single-choice for one-path/no-path cases; multiple-choice (select all complete paths) when branches exist.

**Question template.**

> With `{stateDescription}`, which listed sequences are complete possible conventional-current paths from `{sourcePositive}` to `{sourceNegative}`? Select all that apply.

**Placeholder definitions.**

- `{stateDescription}` lists each switch and idealized conducting element as open/closed or conducting/nonconducting.
- `{sourcePositive}` and `{sourceNegative}` are the two explicitly marked terminals of one isolated ideal low-voltage source.
- Each path choice is an ordered sequence of node/component references beginning at `{sourcePositive}` and ending at `{sourceNegative}`.
- Passive resistors/lamps/wires conduct; open switches and components explicitly declared open do not. No amount of current is inferred.

**Answer template.** Set of complete ordered path IDs `{completePaths}`; `no complete path` when the set is empty.

**Answer derivation.** Remove open/nonconducting branches, treat ideal wires/closed switches as edges, and enumerate simple graph paths from source positive to source negative without traversing the source branch itself. Normalize each path by endpoint direction and compare with choices.

**Accepted answers.** Exactly all complete path choices. Path order within the selected set is irrelevant; component order within a path is not. `No path` is accepted only when the generated set is empty.

**Instance constraints.**

- At most four complete simple paths and six non-source components.
- Each listed sequence is contiguous in the graph or represents one identifiable misconception.
- Parallel branches, when present, may both carry possible current; wording says “possible,” not that current magnitude is nonzero under every real model.
- There is no conducting zero-resistance path directly across an ideal voltage source; those cases belong to open/short recognition.

**Rejection rules.**

- Reject paths requiring an unstated diode/transistor state, paths that revisit a node, or topologies with combinatorial path explosion.
- Reject a choice whose only error is an invisible layout detail.
- Reject cases where a zero-valued source would make “energized” misleading.
- Reject duplicate paths differing only by traversal notation.

**Controlled variations.**

- One series loop; no path due to one open.
- Two parallel return branches; select all valid paths.
- Switch-state comparison before/after one switch changes.
- Given a proposed path, identify the first break.

**Difficulty levels.**

- **Level 1:** one loop, one open/closed switch, strong path highlighting.
- **Level 2:** one branch point with up to two candidate paths.
- **Level 3:** two switch states or a distant net-label join.
- **Level 4:** select all paths in a small branched network and reject one sequence crossing an open.
- **Level 5:** compare path-set change after one switch toggles; at most three topology decisions.

**Multiple-choice distractors.**

- A sequence that stops before returning to the negative terminal.
- A path crossing an open switch.
- A path that jumps between an unconnected crossing or similarly named but unequal nets.
- Only one of two valid parallel paths (“current chooses one path”).
- A reversed conventional path beginning at the negative terminal when direction is requested.

**Feedback.**

- **Correct feedback:** “Correct: each selected sequence is continuous from `+` to `-`; `{invalidSummary}`.”
- **Incorrect feedback:** Highlight the first discontinuity in each false path and any unselected valid branch.
- **Worked solution:** Apply declared states, begin at source `+`, trace every branch without jumping nodes, and retain only sequences that reach source `-`.

**Examples.**

1. **Question:** “With SW1 closed, which sequence is a complete path from source `+` to `-`?” Choices include `+ → SW1 → R1 → -`. **Answer:** that sequence. **Derivation:** every adjacent pair is connected and the loop returns to `-`. **Level:** 1. **Targets:** open-loop thinking.
2. **Question:** “R1 and R2 form parallel branches between nodes A and B. Which are possible paths from `+` through A to B and `-`?” **Answer:** both `+→A→R1→B→-` and `+→A→R2→B→-`. **Derivation:** both branches independently complete the return. **Level:** 2. **Targets:** current chooses only one path.
3. **Question:** “SW1 is open in the R1 branch; SW2 is closed in the R2 branch; a third choice jumps an unconnected crossing. Select all complete paths.” **Answer:** only the path through SW2 and R2. **Derivation:** remove SW1 branch and reject the crossing jump. **Level:** 4. **Targets:** traversing an open/crossing.

**Implementation notes.** Use bounded reviewed topology skeletons. Generate the graph and switch states, enumerate paths, then construct at least one misconception-based false sequence from the graph difference.

**Automated validation.** Independently enumerate simple source-to-return paths, verify every offered sequence edge-by-edge, ensure exact choice-set uniqueness, enforce path-count bounds, and assert that accessible descriptions convey every branch and state.

**Coverage requirements.** Balance one/no/multiple-path answers and open switch, branch, junction, crossing, and net-label mechanisms. At Level 2+, multiple-valid-path items must be at least 30% so series-only tracing does not dominate.

### Question Family: `open_short_recognition` — Recognize opens, shorts, and bypasses

**Learner task.** Classify a highlighted connection or fault as open, short, component bypass, source short, or neither and state its immediate ideal-circuit consequence.

**Relationship to the skill.** Distinguishing broken paths from merged nodes is essential for topology classification, safe model interpretation, and later fault diagnosis.

**Response mode.** Single-choice; Level 4 may use two named fields (`classification`, `consequence`).

**Question template.**

> In the shown ideal schematic, how should `{highlightedFeature}` be classified, and what immediate consequence follows?

**Placeholder definitions.**

- `{highlightedFeature}` is an open switch/broken wire, closed switch/wire link, zero-resistance connection across a component, zero-resistance connection across a source, or ordinary nonzero-resistance branch.
- `{classification}` is `open circuit`, `short connection`, `component bypassed`, `ideal voltage-source short (invalid/unbounded ideal current)`, or `neither`.
- `{consequence}` is generated from graph connectivity: branch current forced to zero, terminal nodes merged, bypassed component voltage forced to zero, ideal-source inconsistency, or no open/short consequence.

**Answer template.** `{classification}; {consequence}`.

**Answer derivation.** For an open, remove the highlighted edge and identify the interrupted branch. For a short, contract the zero-resistance edge; if it joins both terminals of a component, that component is bypassed and has zero terminal voltage. If it joins unequal fixed-voltage nodes or both terminals of a nonzero ideal voltage source, classify the ideal model as inconsistent/unbounded rather than calculating current.

**Accepted answers.** Exact selected semantic pair. Accept `broken circuit` for open and `zero-ohm connection` for short in text fallback. Do not accept “zero current everywhere” unless the open eliminates every complete source path.

**Instance constraints.**

- Fault/state is explicit and only its immediate ideal consequence is asked.
- A bypass must connect exactly the two component-terminal nodes.
- Source-short cases explicitly state the ideal-source model and avoid physical hazard instructions.
- If other branches remain, feedback distinguishes branch consequence from whole-circuit consequence.

**Rejection rules.**

- Reject hidden wire resistance, ambiguous switch state, or multiple simultaneous faults.
- Reject physical-current or damage claims for an ideal source short.
- Reject a “short” that contains a nonzero component, and an “open” that has a parallel bypass when asking whether the whole circuit is open.
- Reject topology where two answer classifications are semantically equivalent.

**Controlled variations.**

- Classify a shown switch/wire state.
- Identify which component is bypassed.
- Decide whether an open affects one branch or all source paths.
- Compare before/after node contraction for a short.

**Difficulty levels.**

- **Level 1:** isolated open versus closed switch and immediate branch effect.
- **Level 2:** wire across one resistor or an open in one series loop.
- **Level 3:** open in one parallel branch versus whole-network open.
- **Level 4:** distinguish benign node join, component bypass, and invalid ideal-source short.
- **Level 5:** predict the small graph-level consequence after one open/short fault without calculating magnitudes.

**Multiple-choice distractors.**

- Swap open and short consequences.
- Say an open in one parallel branch stops all current.
- Say a shorted resistor has infinite voltage or necessarily zero current.
- Treat any closed switch as a source short.
- Assign a finite ideal-source short current without resistance.

**Feedback.**

- **Correct feedback:** “Correct: `{classification}` means `{graphChange}`, so `{consequence}`.”
- **Incorrect feedback:** Contrast edge removal (open) with node contraction (short), then local versus whole-circuit impact.
- **Worked solution:** Identify the feature's endpoints, remove or contract its edge, inspect remaining complete paths/component terminal nodes, and state only consequences guaranteed by the ideal model.

**Examples.**

1. **Question:** “SW1 is open in the only series loop. Classify it and give the consequence.” **Answer:** open circuit; no complete path, so loop current is zero. **Derivation:** remove SW1 edge and the source terminals disconnect. **Level:** 1. **Targets:** open/closed reversal.
2. **Question:** “An ideal wire is connected across both terminals of R2 while another branch remains normal. What follows?” **Answer:** R2 is bypassed; its terminal voltage is `0 V`. **Derivation:** the wire merges R2's endpoint nodes. **Level:** 2. **Targets:** assuming all circuit current is zero.
3. **Question:** “An ideal wire directly joins the terminals of an ideal `5 V` source. What does the ideal model predict?” **Answer:** an invalid/inconsistent ideal connection with unbounded/undefined current, not a finite value. **Derivation:** the wire requires `0 V` while the source requires `5 V`. **Level:** 4. **Targets:** applying Ohm's law with zero resistance to invent a finite answer.

**Implementation notes.** Model opens as absent edges and shorts as explicit zero-resistance contractions. Preserve a distinct diagnostic for contradictory ideal voltage constraints. Avoid construction or real-hardware repair language.

**Automated validation.** Run connectivity before/after the feature, verify bypass endpoint equality, detect ideal-voltage-source contradictions, ensure one classification/consequence pair, and confirm no feedback makes unsupported current/damage claims.

**Coverage requirements.** Balance opens and shorts; local and whole-network effects; series and parallel placement; component bypass and source contradiction. Whole-circuit-open answers must not exceed 40% of open cases.

### Subcategory: Topology Classification and Basic Fault Diagnosis

**Skill.** Classify component relationships by node incidence and isolate one idealized fault from a small set of uniquely distinguishable candidates.

**Mental operation.** Compare terminal-node pairs rather than page layout, then apply one open/short graph change and match its predicted observations.

**Common misconceptions.**

- Calling objects series because they are drawn in a row.
- Calling objects parallel because their symbols look aligned.
- Ignoring a third branch at a shared node.
- Choosing a plausible fault without checking every supplied observation.
- Treating a changed label/value as an open or short when the question declares only connectivity faults.

**Generation scope.** Use two target components within validated graphs of at most seven components. Fault cases begin from a known-good reference graph and inject exactly one enumerated fault whose observation signature is unique.

**Difficulty dimensions.** Visual layout versus topology, third branches at shared nodes, repeated net labels, nested subcircuits, number of candidate faults, and number/type of observations.

**Question families.** `series_parallel_or_neither`, followed by `basic_schematic_fault_diagnosis`.

### Question Family: `series_parallel_or_neither` — Classify component relationships

**Learner task.** Classify two highlighted two-terminal components as series, parallel, or neither from their node connections.

**Relationship to the skill.** Correct classification prevents invalid equivalent-resistance and divider formulas and makes topology recognition explicit before arithmetic.

**Response mode.** Single-choice.

**Question template.**

> Are `{componentA}` and `{componentB}` in series, in parallel, or neither in the shown ideal schematic?

**Placeholder definitions.**

- `{componentA}` and `{componentB}` are distinct two-terminal resistors or other passive conducting elements with terminal-node pairs `(a1,a2)` and `(b1,b2)`.
- `series` means they share exactly one node and that shared node is incident only to those two component branches (wire segments within the node do not count separately).
- `parallel` means their unordered terminal-node sets are identical.
- `neither` covers all other relationships.

**Answer template.** `{series|parallel|neither}` plus feedback node evidence.

**Answer derivation.** Resolve each component's endpoints to canonical electrical nodes. If endpoint sets match, answer parallel. Else if exactly one endpoint node matches and its component-branch degree is two, answer series. Otherwise answer neither.

**Accepted answers.** Exact semantic selection. `not series or parallel` is accepted for `neither` in text fallback.

**Instance constraints.**

- Both targets are genuine distinct two-terminal components.
- All junctions/net labels needed to determine endpoint nodes are visible or accessible.
- Series degree counts component branches after wire-node collapse, including any third branch not visually adjacent.
- Exactly one class applies; parallel takes precedence over any visual adjacency.

**Rejection rules.**

- Reject self-loops, duplicate components on the same branch masquerading as one, ambiguous crossings, or hidden off-page connectivity.
- Reject `neither` cases with no plausible series/parallel cue.
- Reject drawings in which screen alignment perfectly predicts the class across a generation batch.

**Controlled variations.**

- Direct series/parallel skeletons.
- A third branch invalidating apparent series.
- One shared node but different other nodes (neither).
- Repeated net labels establishing non-adjacent parallel endpoints.
- Layout rotation/reordering that preserves the graph.

**Difficulty levels.**

- **Level 1:** isolated two-component series or parallel topology with named nodes.
- **Level 2:** mixed layout orientation; ask one `neither` case sharing only one branch node.
- **Level 3:** apparent series invalidated by a third branch.
- **Level 4:** distant repeated labels establish parallel or a hidden-in-plain-view branch establishes neither.
- **Level 5:** targets embedded in a five-to-seven-component reducible network; only the relationship is requested.

**Multiple-choice distractors.**

- `series` when symbols are drawn end-to-end but the shared node branches.
- `parallel` when symbols are visually aligned but share only one node.
- `neither` when repeated net labels make both endpoints identical.
- `series` based on equal current values or `parallel` based on equal component values; values should be present only at higher levels.

**Feedback.**

- **Correct feedback:** “Correct: `{componentA}` connects `{nodesA}` and `{componentB}` connects `{nodesB}`; `{topologyTest}`.”
- **Incorrect feedback:** Show endpoint-node pairs and identify the failed condition, especially the third branch for false-series answers.
- **Worked solution:** Collapse wires/labels into nodes, list each component's two endpoints, test identical endpoint sets for parallel, then test exclusive shared node for series.

**Examples.**

1. **Question:** “R1 connects A–B and R2 connects B–C; no other component joins B. Series, parallel, or neither?” **Answer:** series. **Derivation:** one shared node B has component degree two. **Level:** 1. **Targets:** none.
2. **Question:** “R1 connects A–B and R2 connects B–C, but R3 also connects B–D. Classify R1 and R2.” **Answer:** neither. **Derivation:** the third branch at B means they need not share the same current. **Level:** 3. **Targets:** drawn-in-a-row series.
3. **Question:** “R4's endpoints are labeled `VIN` and `VOUT`; distant R5 has the same two endpoint labels. Classify them.” **Answer:** parallel. **Derivation:** both terminal-node sets are `{VIN,VOUT}`. **Level:** 4. **Targets:** requiring visual side-by-side placement.

**Implementation notes.** Determine class solely from the canonical graph. Layout randomization should deliberately decorrelate screen orientation and class. Branch degree excludes multiple wire segments but includes every component terminal incident on the node.

**Automated validation.** Recompute canonical nodes and degrees independently, assert class exclusivity, one correct choice, visible/accessibly described branch evidence, and invariance across at least three layout transforms per structural seed.

**Coverage requirements.** Balance series, parallel, and neither approximately equally after Level 2. At least half of `neither` cases must target a specific false-series or false-parallel cue; repeated-label and third-branch cases recur regularly.

### Question Family: `basic_schematic_fault_diagnosis` — Diagnose one open or short fault

**Learner task.** Select the single stated open/short connection fault that uniquely explains all supplied ideal observations in a small low-voltage circuit.

**Relationship to the skill.** This integrates symbols, nodes, paths, and open/short consequences without prematurely requiring substantial calculation or real-hardware troubleshooting.

**Response mode.** Single-choice.

**Question template.**

> The reference schematic should produce `{normalBehavior}`. With one fault from the choices, it instead produces `{observations}`. Which fault is consistent with every observation?

**Placeholder definitions.**

- `{normalBehavior}` is a supplied binary/qualitative behavior: which ideal lamps are on, which branches have a complete path, or whether named node pairs are connected.
- `{observations}` contains two or three independent ideal observations expressed as lamp on/off, path present/absent, or an ideal continuity result with the source explicitly disconnected.
- Candidate faults are exactly one open wire/component or one short between two named nodes/component terminals.
- The semantic `{fault}` is injected into a known-good graph; each candidate has a precomputed observation signature.

**Answer template.** `{faultId}: {faultDescription}`.

**Answer derivation.** For each candidate, clone the good graph, remove the declared open edge or contract the declared short endpoints, recompute all observations, and select the sole candidate whose complete signature equals `{observations}`.

**Accepted answers.** Exact selected fault. No “most likely” alternatives: the generated evidence must logically identify one candidate under the stated single-fault ideal model.

**Instance constraints.**

- Exactly one fault is present and it is one of the listed candidates.
- There are three or four candidates and exactly one matches all observations.
- Circuit has one isolated source at or below `24 V`; no real probing, energized-work instruction, or safety claim.
- Continuity observations state that the source is disconnected and use an ideal continuity model.
- A learner can solve by at most three connectivity decisions.

**Rejection rules.**

- Reject candidate sets with identical observation signatures, an observation irrelevant to every candidate, multiple simultaneous faults, or reliance on component tolerance.
- Reject short faults that contradict an ideal voltage source unless that contradiction is itself the explicit qualitative observation.
- Reject “intermittent,” physical damage, reversed semiconductor, or value-drift faults from this foundational family.
- Reject cases solvable from only a suspicious component name rather than observations.

**Controlled variations.**

- One series loop with one open location distinguished by a midpoint connectivity observation.
- Two parallel indicator branches with an open branch or shared-return fault.
- A resistor/lamp bypass short distinguished by which component has zero voltage or is bypassed.
- Compare a faulty graph with a highlighted known-good reference graph.

**Difficulty levels.**

- **Level 1:** two candidate opens and two direct path/continuity observations with strong highlighting.
- **Level 2:** three candidates in series/parallel branches; combine normal behavior with one fault symptom.
- **Level 3:** four open/short candidates and two observations; eliminate candidates systematically.
- **Level 4:** one shared-node fault can affect two branches; three observations required.
- **Level 5:** graph has up to seven components and a distant net label, but the one-fault model and qualitative observations remain explicit.

**Multiple-choice distractors.**

- A fault explaining only the most salient observation but contradicting another.
- An open downstream of a branch whose observed upstream path remains complete.
- A short across the wrong component.
- A shared-return open when the other branch is observed working.
- The visually nearest component, to expose proximity-based guessing.

**Feedback.**

- **Correct feedback:** “Correct: `{fault}` predicts `{matchedObservations}` and preserves `{unaffectedObservation}`.”
- **Incorrect feedback:** Simulate the selected candidate and identify the first supplied observation it contradicts; never merely say “try again.”
- **Worked solution:** List candidates, apply each one graphically as edge removal/contraction, predict every observation, cross out contradictions, and retain the unique matching signature.

**Examples.**

1. **Question:** “A source, SW1, L1, and L2 are in one series loop and both lamps should be on. Both are off; with the source disconnected, continuity exists from source `+` through SW1 to L1's input, but not through L1. One fault: SW1 open, L1 open, or L2 open. Which?” **Answer:** L1 open. **Derivation:** upstream continuity clears SW1; failure through L1 locates the break before L2. **Level:** 1. **Targets:** choosing any open because both lamps are off.
2. **Question:** “L1 and L2 are separate parallel branches. L1 is on and L2 is off. Candidates: source open, shared return open, L2 branch open, wire short across L1. Which?” **Answer:** L2 branch open. **Derivation:** source and shared return must work because L1 is on; an L1 short does not uniquely remove L2's path. **Level:** 2. **Targets:** assuming one branch fault stops all branches.
3. **Question:** “Reference circuit has R1 then parallel lamps L1/L2. Observations: both lamps are on and R1 has `0 V` across it. Candidates: R1 open, L1 open, L2 open, wire short across R1. Which?” **Answer:** wire short across R1. **Derivation:** contracting R1's endpoints bypasses it while preserving both lamp paths; each other candidate contradicts at least one lamp observation. **Level:** 3. **Targets:** confusing zero voltage with an open.

**Implementation notes.** Build a small fault-simulation matrix whose rows are candidate graph mutations and columns are possible observations. Choose observation subsets backward so exactly one row remains. Model each ideal lamp as a supplied positive resistance solely to classify its solved current as zero/nonzero; do not ask for brightness or require the learner to calculate that current.

**Automated validation.** Exhaustively simulate all listed faults, prove the observation vector has one match, ensure the good graph satisfies `{normalBehavior}`, enforce single mutation, check source/continuity conditions, and render a complete accessible description. Mutation tests should confirm that dropping any required observation either preserves uniqueness intentionally or marks it as nonessential.

**Coverage requirements.** Balance open and short diagnoses, series and parallel skeletons, shared versus local faults, and lamp/path/continuity observations. No physical fault location or answer choice may dominate; at least 40% of Level 2+ cases require using more than one observation.

### Cross-family progression for Schematic Literacy and Connectivity

Introduce symbol recognition before relying on unglossed symbols. Then separate identifiers, values, terminals, and net labels. Polarity/terminal reading precedes signed quantities and device models; color/compact value decoding should be interleaved with SI conversion once both are introduced. Node equivalence precedes current-path tracing, which precedes explicit open/short consequences. Series/parallel/neither classification follows node mastery and is a prerequisite for network reduction. Basic fault diagnosis comes last and must initially reuse only mastered symbol, node, path, and open/short mechanisms.

Do not gate all later practice on resistor color codes: they are a physical-marking literacy branch, while node, polarity, and topology skills are hard prerequisites for analytical circuit families.

## 3. Category: DC Foundations

### Category purpose

Build fluent units, sign conventions, and conservation laws that support every later category.

### Learn

Use SI units before formulas. Ohm's law applies to an ideal resistor: `V=IR`. KCL conserves charge at a node; KVL conserves energy around a closed loop. With passive sign convention, positive power is absorbed and negative power delivered.

### Prerequisites

- Recognize the source, resistor, ground/reference, and junction symbols used in the question.
- Resolve electrically identical nodes and read voltage polarity/current arrows.
- Classify the simple path/topology used by the question; series/parallel reduction additionally requires `series_parallel_or_neither`.

### Category boundaries

Use normally printed component values here; color-code and compact-marking decoding remain separately trainable and must not become a hidden prerequisite. Detailed network reduction belongs in Resistive Networks and Equivalent Sources.

### Subcategories

1. Units and Prefixes
2. Ohm's Law
3. KCL and KVL
4. Power and Energy

### Common misconceptions

- Using milliamps as amps without the `10^-3` factor.
- Treating voltage as “at a point” without reference.
- Assuming current is consumed by components.
- Adding voltage magnitudes without polarity.
- Reporting negative absorbed power as an error rather than delivery.

### Family `si_quantity_conversion`

**Learner task.** Convert one electrical quantity between compatible SI prefix units.

**Response mode.** Numeric quantity.

**Template.** `Convert {value} {sourceUnit} to {targetUnit}.`

**Derivation.** Convert source to base SI by its prefix factor, then divide by target prefix. Preserve physical dimension.

**Constraints and rejection.** Prefix change `10^1..10^9`; values remain readable. Reject dimension changes and gratuitous scientific notation at early levels.

**Difficulty.** Level 1 `m↔base`, `k↔base`. Level 2 multi-step prefixes. Level 3 mixed schematic values. Level 4 scientific notation. Level 5 choose a sensible display prefix.

**Feedback.** Show prefix powers and dimensional check.

**Examples.**

1. `Convert 20 mA to A.` Answer `0.020 A`. Level 1.
2. `Convert 4.7 kΩ to Ω.` Answer `4700 Ω`. Level 1.
3. `Convert 220 nF to µF.` Answer `0.22 µF`. Level 2.

**Implementation and validation.** Dimension-tagged quantities; round-trip conversion. Coverage balances prefix direction and dimension.

### Family `ohms_law`

**Learner task.** Solve for one of resistor voltage, current, or resistance with stated polarity/direction.

**Response mode.** Numeric quantity in requested dimension.

**Derivation.** `V=IR`, `I=V/R`, or `R=V/I`; signed `V`/`I` follow passive reference. Resistance positive.

**Constraints and rejection.** Nonzero divisor, realistic low-voltage values, no negative resistance. At advanced levels, a negative current is allowed when arrow opposes actual flow.

**Difficulty.** Level 1 solve V/I with aligned references. Level 2 solve R/prefix conversion. Level 3 signed reference. Level 4 derive from two node voltages. Level 5 combine one mastered network reduction.

**Feedback.** Convert units, state reference polarity, substitute.

**Examples.**

1. `5 V across 1 kΩ. Current from + to -?` Answer `5 mA`. Level 1.
2. `20 mA through 220 Ω. Voltage drop?` Answer `4.4 V`. Level 1.
3. `Node a=2 V, node b=5 V, 1 kΩ resistor; current arrow a→b.` Answer `-3 mA`. Level 3.

**Implementation and validation.** Solve in SI and cross-check `V-IR=0`. Balance target and sign.

### Family `kcl_node`

**Learner task.** Find one unknown branch current at a node.

**Response mode.** Signed current.

**Template.** Node schematic with arrows and `Σ currents entering = Σ currents leaving`.

**Derivation.** Sum signed currents using declared arrow convention; solve one linear equation.

**Constraints and rejection.** Three to five branches, exactly one unknown, no dependent sources. Avoid accidental zero except diagnostics.

**Difficulty.** Level 1 all known arrows naturally grouped. Level 2 mixed arrow directions. Level 3 signed unknown. Level 4 currents derived through resistors. Level 5 two nodes but only sequential single equations.

**Feedback.** List entering/leaving terms and interpret negative result.

**Examples.**

1. `3 mA and 2 mA enter; I leaves.` Answer `I=5 mA`. Level 1.
2. `8 mA enters; 3 mA and I leave.` Answer `I=5 mA`. Level 1.
3. `Arrow I enters; 2 mA enters; 7 mA leaves.` Answer `I=5 mA`. Level 2.

**Implementation and validation.** Node-incidence equation; independently assert algebraic sum zero. Vary arrow orientation.

### Family `kvl_loop`

**Learner task.** Find an unknown voltage/rise/drop around one loop.

**Response mode.** Signed voltage.

**Derivation.** Traverse indicated direction and sum signed voltage changes to zero.

**Constraints and rejection.** One loop, three to five elements, one unknown. Polarities visible. No conflicting ideal voltage sources.

**Difficulty.** Level 1 one source/two drops. Level 2 mixed labeled polarity. Level 3 negative result. Level 4 one drop derived by Ohm's law. Level 5 two meshes reducible sequentially, not simultaneous mesh analysis.

**Feedback.** Annotate traversal signs and equation.

**Examples.**

1. `12 V rise, drops 5 V and Vx.` Answer `Vx=7 V`. Level 1.
2. `Loop traversal changes +9 V, -2 V, -3 V, then Vx.` Answer `Vx=-4 V`. Level 2.
3. `5 V source, 2 mA through series 1 kΩ and R; voltage across R?` Answer `3 V`. Level 4.

**Implementation and validation.** Graph loop equation sum zero; cross-check any resistor-derived term.

### Family `power_and_energy`

**Learner task.** Calculate absorbed/delivered power, resistor power, or energy over constant time.

**Response mode.** Power or energy.

**Derivation.** `P=VI`; resistor `I²R=V²/R`; constant energy `E=Pt`.

**Constraints and rejection.** Sign/polarity explicit for general element. Values within component scales. No time-varying integration.

**Difficulty.** Level 1 `VI`. Level 2 derived resistor formula. Level 3 sign/delivery. Level 4 energy/time conversion. Level 5 select minimum rating in Practical category.

**Feedback.** State passive sign convention and units.

**Examples.**

1. `5 V and 20 mA enter positive terminal.` Answer `100 mW absorbed`. Level 1.
2. `10 V across 100 Ω.` Answer `1 W`. Level 2.
3. `Element voltage +12 V, current reference entering negative terminal is 0.5 A.` Answer `-6 W absorbed`, i.e. `6 W delivered`. Level 3.

**Implementation and validation.** Cross-check equivalent formulas for resistors and dimensional units.

### Cross-family progression for DC Foundations

Units precede equations. Ohm's law precedes KCL/KVL with derived currents/drops. Power sign follows voltage/current reference signs. Incorrect prefix answers trigger conversion practice without changing topology.

## 4. Category: Resistive Networks and Equivalent Sources

### Category purpose

Train topology recognition, network reduction, loading, and replacement of a linear two-terminal network by a useful Thévenin or Norton equivalent.

### Learn

Series elements share current; parallel elements share voltage. Divider formulas apply only to the stated topology and load. A linear source network seen from two terminals can be replaced by `V_th` in series with `R_th` or, equivalently, `I_N` in parallel with `R_N`, with the port polarity and current direction kept explicit.

### Prerequisites

- `electrically_identical_nodes` and `series_parallel_or_neither`.
- Ohm's law and the voltage/current reference conventions from DC Foundations.
- KCL/KVL before equivalent-source extraction from anything beyond a direct source/resistance form.

### Category boundaries

Only reducible resistor networks and independent-source two-terminal equivalents are generated. General bridge networks, dependent-source equivalents, and simultaneous systems larger than the topic exclusions remain out of scope.

### Subcategories

1. Series/Parallel Reduction
2. Dividers and Loading
3. Thévenin, Norton, and Source Resistance

### Common misconceptions

- Calling components series because drawn in a row despite a branch node.
- Calling components parallel without sharing both nodes.
- Producing parallel equivalent above the smallest branch.
- Using unloaded divider formula after attaching a load.
- Turning off dependent sources (excluded) or measuring `R_th` with independent sources active.
- Treating Norton current as the current through every load rather than the port short-circuit current.
- Reversing Norton current direction while retaining the same Thévenin voltage sign.

### Family `series_parallel_equivalent`

**Learner task.** Find equivalent resistance of a pure series or pure parallel group.

**Response mode.** Resistance.

**Derivation.** Series sum; parallel reciprocal sum, with two-resistor product/sum as allowed shortcut.

**Constraints and rejection.** Two to four positive resistors. Topology encoded by nodes, not visual proximity. Parallel answer must be below minimum.

**Difficulty.** Level 1 two series/equal parallel. Level 2 unequal parallel. Level 3 three/four branches. Level 4 prefixes. Level 5 inverse missing resistor.

**Feedback.** State shared-current/shared-voltage topology test before formula.

**Examples.**

1. `220 Ω + 330 Ω in series.` Answer `550 Ω`. Level 1.
2. `1 kΩ || 1 kΩ.` Answer `500 Ω`. Level 1.
3. `1 kΩ || 2 kΩ.` Answer `666.67 Ω`. Level 2.

**Implementation and validation.** Conductance-based solver cross-check; bounds/inverse substitution.

### Family `mixed_resistive_reduction`

**Learner task.** Reduce a series-parallel resistor network in two or three justified steps.

**Response mode.** Equivalent resistance or source current.

**Derivation.** Collapse only subgraphs proven pure series/parallel; optionally apply Ohm's law to total.

**Constraints and rejection.** Reducible graph, at most five resistors and three reductions. Reject bridge networks and diagrams where a hidden connection changes topology.

**Difficulty.** Level 2 one parallel pair plus series. Level 3 nested group. Level 4 source current. Level 5 inverse component choice.

**Feedback.** Highlight collapsed subgraph at each step.

**Examples.**

1. `100 Ω + (200 Ω || 200 Ω).` Answer `200 Ω`. Level 2.
2. `(1 kΩ + 1 kΩ) || 1 kΩ.` Answer `666.67 Ω`. Level 3.
3. `12 V across 2 kΩ + (3 kΩ || 6 kΩ). Source current?` Answer `3 mA`; equivalent `4 kΩ`. Level 4.

**Implementation and validation.** Compare symbolic reduction with nodal conductance solver.

### Family `voltage_divider`

**Learner task.** Solve output, one resistance, or divider current for an unloaded two-resistor divider.

**Response mode.** Voltage/resistance/current.

**Derivation.** `I=V_in/(R1+R2)`, `V_out=IR2` for output across lower resistor.

**Constraints and rejection.** Ideal source, no load, polarity/ground shown. Resistances positive. Output strictly between rails for positive network.

**Difficulty.** Level 1 equal/direct. Level 2 unequal. Level 3 inverse resistor/ratio. Level 4 nonzero lower reference. Level 5 check output-current tradeoff only when load absent.

**Feedback.** Identify which resistor output spans; do not teach a label-only formula.

**Examples.**

1. `5 V, R1=R2=10 kΩ, output across R2.` Answer `2.5 V`. Level 1.
2. `12 V, R1=3 kΩ, R2=1 kΩ.` Answer `3 V`. Level 2.
3. `10 V, R1=6 kΩ, desired output 4 V. R2?` Answer `4 kΩ`. Level 3.

**Implementation and validation.** Nodal-solver cross-check and ratio bounds.

### Family `loaded_voltage_divider`

**Learner task.** Calculate divider output or loading error when a load is attached.

**Response mode.** Voltage or percent error.

**Derivation.** Replace lower leg by `R2||R_L`, then divider formula. Loading error relative to unloaded output.

**Constraints and rejection.** Load positive; visible parallel connection. Error nontrivial but within display tolerance. No nonlinear load.

**Difficulty.** Level 2 load equal/large. Level 3 general. Level 4 percent droop. Level 5 choose minimum load/input resistance meeting error.

**Feedback.** Show effective lower leg and contrast unloaded result.

**Examples.**

1. `10 V, R1=R2=10 kΩ, load 10 kΩ across R2.` Answer `3.333 V`. Level 2.
2. Same divider, load `100 kΩ`. Answer `4.762 V`. Level 3.
3. Unloaded `5 V`, loaded `4.762 V`. Answer `4.76% droop`. Level 4.

**Implementation and validation.** Full nodal solution; check loaded output ≤ unloaded for ground load.

### Family `thevenin_equivalent`

**Learner task.** Find `V_th`, `R_th`, or load current from a simple resistive two-terminal network.

**Response mode.** Named voltage/resistance/current fields.

**Derivation.** `V_th` is open-circuit terminal voltage. For independent sources only, deactivate voltage sources to shorts/current sources to opens and find resistance seen at port. Load current=`V_th/(R_th+R_L)`.

**Constraints and rejection.** Independent sources only, low-complexity divider/source networks, no dependent sources. Port/polarity explicit.

**Difficulty.** Level 3 simple source+series resistor. Level 4 divider Thévenin. Level 5 use equivalent with varying loads or maximum-power conceptual check.

**Feedback.** Separate open-circuit voltage from deactivated-source resistance.

**Examples.**

1. `5 V ideal source in series with 1 kΩ at port.` Answer `Vth=5 V,Rth=1 kΩ`. Level 3.
2. `12 V divider R1=3 kΩ,R2=1 kΩ, port across R2.` Answer `Vth=3 V,Rth=750 Ω`. Level 4.
3. Same equivalent with `750 Ω` load. Answer load current `2 mA`, load voltage `1.5 V`. Level 5.

**Implementation and validation.** Nodal open-circuit plus test-source resistance solver cross-check.

### Question Family: `norton_equivalent` — Find and use a Norton equivalent

**Learner task.** Find `I_N`, `R_N`, or a load quantity for a simple independent-source resistive network, including conversion to or from its Thévenin equivalent.

**Relationship to the skill.** Norton practice complements Thévenin by making short-circuit current and current division explicit while reinforcing that both forms describe the same terminal behavior.

**Response mode.** One or more named numeric fields with dimensions; single-choice only for conceptual source-deactivation or equivalence checks.

**Question templates.**

> For the network seen at port `{portPositive}`–`{portNegative}`, find its Norton current `{nortonCurrentName}` in the shown direction and Norton resistance `{nortonResistanceName}`.

> Convert `{theveninVoltage}`, `{theveninResistance}` at port `{portPositive}`–`{portNegative}` to the equivalent Norton source.

> The Norton equivalent `{nortonCurrent}`, `{nortonResistance}` drives `{loadResistance}`. Find `{requestedLoadQuantity}`.

**Placeholder definitions.**

- `{portPositive}` and `{portNegative}` are distinct terminal nodes; `V_port=V({portPositive})-V({portNegative})`.
- `{nortonCurrentName}` is `I_N`. Its arrow is drawn inside the Norton model from `{portNegative}` toward `{portPositive}`; it equals the external short-circuit current flowing from `{portPositive}` to `{portNegative}`.
- `{nortonResistanceName}` is `R_N`, the resistance seen into the port with independent voltage sources shorted and independent current sources opened.
- `{theveninVoltage}` is signed `V_th` under the declared port polarity; `{theveninResistance}` is positive `R_th`.
- `{nortonCurrent}` is signed in the declared arrow direction; `{nortonResistance}` and `{loadResistance}` are positive.
- `{requestedLoadQuantity}` is load current from `{portPositive}` to `{portNegative}` or load voltage with positive at `{portPositive}`.

**Answer template.** Equivalent fields: `I_N={signedCurrent}; R_N={resistance}`. Load fields: `I_L={signedCurrent}` or `V_L={signedVoltage}`.

**Answer derivation.** Compute `I_N` by shorting the output port and solving the external short current from `{portPositive}` to `{portNegative}`. Compute `R_N` by deactivating independent sources and finding port resistance with a test source; `R_N=R_th`. For conversion, use `I_N=V_th/R_th` and `R_N=R_th`, preserving the stated directions. With a load in parallel, use current division `I_L=I_N R_N/(R_N+R_L)` and `V_L=I_L R_L`; independently, `V_L=I_N(R_N||R_L)`.

**Accepted answers.** Any compatible scaled units under global conventions, with the requested sign. Named fields may appear in either UI order. Conceptual choices require exact selection. A magnitude-only response is accepted only if the prompt explicitly requests magnitude.

**Instance constraints.**

- Networks contain independent sources and resistors only, with one explicit two-terminal port and no load during equivalent extraction.
- `R_N>0`, divisors are nonzero, and the port short does not create contradictory ideal-voltage-source constraints.
- At Levels 1–3, choose values yielding readable exact or terminating-decimal results; Level 4–5 may use global numeric tolerance.
- The schematic and accessible text show both port voltage polarity and Norton/short-circuit current directions.
- A conversion pair must satisfy `V_th=I_N R_N` under those directions.

**Rejection rules.**

- Reject networks with dependent sources, negative/equivalent zero resistance, floating subcircuits that affect no port behavior, or multiple valid interpretations of source deactivation.
- Reject a port placed directly across a nonzero ideal voltage source when short-circuit current would be unbounded.
- Reject load cases where the offered answer can be copied as `I_N` because `R_L=0` or another degenerate limit.
- Reject values dominated by awkward arithmetic or a sign convention hidden only in prose.

**Controlled variations.**

- Direct ideal current source in parallel with a resistor.
- Divider/source network requiring short-circuit-current and source-deactivation steps.
- Convert Thévenin to Norton or Norton to Thévenin.
- Use a Norton equivalent with one resistive load.
- Ask only one of `I_N` or `R_N` after prerequisite mastery, while feedback still verifies the pair.

**Difficulty levels.**

- **Level 1:** read `I_N` and `R_N` from an already drawn ideal Norton source; aligned positive direction.
- **Level 2:** convert a supplied positive `V_th,R_th` pair or solve a direct current-source/parallel-resistor form.
- **Level 3:** extract the Norton equivalent of a one-source divider network by port short and source deactivation.
- **Level 4:** preserve a signed/reversed port reference or calculate one load current/voltage by current division.
- **Level 5:** switch between Thévenin and Norton to answer two load cases or infer one missing equivalent parameter from terminal behavior; at most three essential reasoning stages.

**Multiple-choice distractors.**

- Use `I_N=V_th×R_th` rather than division.
- Set `R_N=1/R_th` or omit a parallel resistance when sources are deactivated.
- Reverse `I_N` without changing `V_th` polarity.
- Treat independent current sources as shorts or voltage sources as opens during resistance extraction.
- Set load current equal to `I_N` instead of applying current division.
- Use `R_N+R_L` as the Norton parallel equivalent.

**Feedback.**

- **Correct feedback:** “Correct: the port short current is `{I_N}` in the declared direction and the deactivated-source resistance is `{R_N}`; `I_N R_N={V_th}`.”
- **Incorrect feedback:** Compare the response with recognizable transforms above and point to the direction or source-deactivation rule that differs.
- **Worked solution:** Mark port polarity/direction, solve the short-circuit current, deactivate each independent source and find resistance seen at the port, verify against the corresponding Thévenin voltage, then apply current division if a load is present.

**Examples.**

1. **Question:** “A `3 mA` ideal current source directed from b to a is in parallel with `2 kΩ` at port a–b. Find the Norton equivalent.” **Answer:** `I_N=3 mA`, `R_N=2 kΩ`. **Derivation:** the circuit is already in Norton form. **Level:** 1. **Targets:** treating parallel resistance as series.
2. **Question:** “A `12 V` source has its negative terminal at b=`0 V`; its positive terminal feeds `R1=3 kΩ` to port a, and `R2=1 kΩ` connects a to b. Find `I_N` as external short current a→b and `R_N`.” **Answer:** `I_N=4 mA`, `R_N=750 Ω`. **Derivation:** shorting a–b bypasses R2, so `I_sc=12 V/3 kΩ`; deactivating the source gives `3 kΩ || 1 kΩ`. **Level:** 3. **Targets:** including R2 in short-circuit current or failing to short the voltage source for resistance.
3. **Question:** “A Norton source has `I_N=2 mA` from b to a and `R_N=1 kΩ`; `R_L=1 kΩ` is connected a–b. Find load current a→b and load voltage `V_ab`.” **Answer:** `I_L=1 mA`, `V_ab=1 V`. **Derivation:** equal parallel resistances split the source current equally; `1 mA×1 kΩ=1 V`. **Level:** 4. **Targets:** assigning all `I_N` to the load.

**Implementation notes.** Reuse the Thévenin family's validated port object and source-deactivation helper. Store internal Norton arrow, external short-current arrow, and port voltage polarity separately but enforce their declared relationship. Generate extraction networks from reviewed templates, not arbitrary source graphs.

**Automated validation.** Solve open-circuit voltage, short-circuit current, and test-source resistance independently; assert `R_N=R_th` and `V_th=I_N R_N` within exact/tolerance rules. For loads, compare current division with the Thévenin series solution and a nodal solve. Verify sign consistency, one correct choice, dimensional fields, source-deactivation state, and all rejection rules over at least 10,000 deterministic seeds per level.

**Coverage requirements.** Balance already-in-Norton, conversion, extraction, and load-use variants after unlock. Include voltage-source and current-source starting networks; positive and negative signed `I_N` at Level 4+; varied `R_L/R_N` below, equal to, and above one; and every declared misconception without letting direct read-off exceed 25% after Level 2.

### Family `source_internal_resistance`

**Learner task.** Calculate terminal voltage, load current, or internal dissipation for an ideal source plus series internal resistance.

**Response mode.** Voltage/current/power.

**Derivation.** `I=V_s/(R_s+R_L)`, `V_terminal=IR_L=V_s-IR_s`.

**Constraints and rejection.** Positive resistances, no battery chemistry. Ratings handled separately.

**Difficulty.** Level 2 direct. Level 3 infer `R_s` from open/load voltage. Level 4 power split. Level 5 load regulation percentage.

**Feedback.** Distinguish ideal emf from loaded terminal voltage.

**Examples.**

1. `10 V source, Rs=1 Ω, load=9 Ω.` Answer `I=1 A,Vload=9 V`. Level 2.
2. `Open 12 V; with 2 A load terminal is 11 V.` Answer `Rs=0.5 Ω`. Level 3.
3. `5 V, Rs=10 Ω, RL=40 Ω.` Answer internal power `0.1 W`; current `0.1 A`. Level 4.

**Implementation and validation.** KVL/power balance cross-check.

### Cross-family progression for Resistive Networks

Schematic node and series/parallel literacy precede formulas. Pure reductions precede mixed networks. Unloaded dividers precede loading; loaded divider naturally introduces Thévenin. Teach Thévenin extraction first, then pair it with Norton conversion and short-circuit-current extraction; once both are reliable, interleave equivalent forms so the learner chooses the more convenient representation. Source resistance reuses the shared equivalent model. Wrong loaded-divider answers matching unloaded output trigger a paired comparison; Norton load current equal to `I_N` triggers current-division practice.

## 5. Category: Energy Storage and First-Order Transients

### Category purpose

Train capacitor/inductor state, stored energy, DC steady-state equivalents, and exponential response of one-energy-storage-element circuits.

### Learn

`Q=CV`, capacitor energy `½CV²`; inductor energy `½LI²`. Capacitor voltage and inductor current cannot jump in these ideal finite-source circuits. For a first-order step:

`x(t)=x_final+(x_initial-x_final)e^(-t/τ)`.

For a capacitor, `τ=R_seen C`; for an inductor, `τ=L/R_seen`.

### Boundaries and misconceptions

Only one independent capacitor or inductor per transient equivalent. No coupled inductors, resonance, second-order response, switching bounce, impulse sources, or initial-condition inconsistency.

Misconceptions include treating a capacitor as always open, an inductor as always short, confusing initial with final state, using source resistance without looking into the deactivated network, and assuming “one time constant” means finished.

### Family `capacitor_charge_energy`

**Learner task.** Calculate charge, voltage, capacitance, or stored energy.

**Response mode.** Dimensioned numeric.

**Derivation.** `Q=CV`, `E=½CV²`.

**Constraints and rejection.** Positive C; magnitude questions unless polarity charge explicitly defined. Values practical and prefix-friendly.

**Difficulty.** Level 1 Q/C/V. Level 2 energy. Level 3 inverse. Level 4 compare energy after voltage change. Level 5 rating check elsewhere.

**Feedback.** Convert F/V/C units; emphasize energy scales with voltage squared.

**Examples.**

1. `10 µF at 5 V. Charge magnitude?` Answer `50 µC`. Level 1.
2. `100 µF at 12 V. Energy?` Answer `7.2 mJ`. Level 2.
3. `Capacitor energy 2 mJ at 10 V. Capacitance?` Answer `40 µF`. Level 3.

**Implementation and validation.** Formula round-trips and dimension checks.

### Family `rc_time_constant_and_step`

**Learner task.** Find RC time constant or capacitor voltage/current after a DC switching step.

**Response mode.** Time, voltage, or current.

**Derivation.** Find initial voltage, final voltage, `R_seen`, `τ=R_seen C`, then exponential response. Charging current follows resistor voltage.

**Constraints and rejection.** One capacitor, ideal switch changes once at `t=0`, resistive DC sources, consistent initial steady state. Common times `t=τ,2τ,3τ,5τ` or supplied decimal.

**Difficulty.** Level 2 τ. Level 3 zero-to-source charging. Level 4 nonzero initial/final. Level 5 Thévenin-derived `R_seen`.

**Feedback.** Four-line method: `v(0-)`, `v(∞)`, `τ`, substitution.

**Examples.**

1. `R=10 kΩ,C=100 µF.` Answer `τ=1 s`. Level 2.
2. `0 V capacitor charges toward 10 V; at 1τ?` Answer `6.321 V`. Level 3.
3. `v(0)=8 V, final=2 V, τ=0.5 s; v(1 s)?` Answer `2.812 V`; `2+6e^-2`. Level 4.

**Implementation and validation.** Independent state-form solution; verify t=0/final limits and monotonicity.

### Family `capacitor_switching_state`

**Learner task.** Determine capacitor voltage immediately before/after switching and at DC steady state.

**Response mode.** Three named voltages/qualitative current.

**Derivation.** Solve pre-switch DC with capacitor open; enforce `v_C(0+)=v_C(0-)`; solve post-switch final DC with capacitor open.

**Constraints and rejection.** No ideal voltage source directly imposing a conflicting instantaneous capacitor voltage.

**Difficulty.** Level 2 initially uncharged. Level 3 precharged. Level 4 changed divider. Level 5 ask initial current using continuous voltage.

**Feedback.** Separate time snapshots.

**Examples.**

1. `Initially discharged capacitor connected through R to 5 V.` Answer `vC(0-)=0,vC(0+)=0,vC(∞)=5 V`. Level 2.
2. `Capacitor held at 3 V, then connected through R toward 9 V.` Answer `3,3,9 V`. Level 3.
3. `10 µF at 4 V connected through 2 kΩ toward 10 V.` Answer initial current `3 mA`. Level 4.

**Implementation and validation.** Time-snapshot circuit solver; continuity assertion.

### Family `inductor_energy_and_dc_state`

**Learner task.** Calculate inductor energy or interpret ideal inductor in DC steady state.

**Response mode.** Energy/current/choice.

**Derivation.** `E=½LI²`; long-time DC ideal inductor is short. Current continuity across switching.

**Constraints and rejection.** Positive L; no magnetic saturation or resistance unless supplied.

**Difficulty.** Level 1 energy. Level 2 DC state. Level 3 inverse. Level 4 continuity.

**Feedback.** Contrast capacitor voltage continuity with inductor current continuity.

**Examples.**

1. `100 mH carrying 2 A. Energy?` Answer `0.2 J`. Level 1.
2. `Ideal inductor after long time in DC series circuit.` Answer `short circuit`. Level 2.
3. `Energy 50 mJ in 100 mH. Current magnitude?` Answer `1 A`. Level 3.

**Implementation and validation.** Formula round-trip and state-model checks.

### Family `rl_time_constant_and_step`

**Learner task.** Find RL time constant or inductor current after a step.

**Response mode.** Time/current/voltage.

**Derivation.** `τ=L/R_seen`; `i(t)=i_final+(i_initial-i_final)e^-t/τ`.

**Constraints and rejection.** One inductor, resistive network, consistent initial condition, no source conflict.

**Difficulty.** Level 2 τ. Level 3 zero-current energizing. Level 4 nonzero initial. Level 5 equivalent resistance.

**Feedback.** Same initial/final/τ method with current continuity.

**Examples.**

1. `L=2 H,R=4 Ω.` Answer `τ=0.5 s`. Level 2.
2. `Current rises 0→3 A; at 1τ?` Answer `1.896 A`. Level 3.
3. `i(0)=5 A, final=1 A, τ=2 s; i(4 s)?` Answer `1.541 A`. Level 4.

**Implementation and validation.** Limit/monotonicity checks and independent exponential solver.

### Cross-family progression

Energy precedes switching. Snapshot continuity precedes exponentials. RC precedes RL; shared first-order form is then interleaved. Thévenin-derived time constants require prior equivalent-source mastery.

## 6. Category: Sinusoidal AC and First-Order Filters

### Category purpose

Train RMS, reactance, simple complex impedance, phase, AC power, and one-pole passive filter behavior.

### Learn

For a sine wave, `V_rms=V_peak/√2` and `V_pp=2V_peak`. Reactance magnitudes are `X_C=1/(2πfC)` and `X_L=2πfL`. Add series impedances as complex numbers. Real power is `P=V_rms I_rms cosφ`.

### Boundaries and misconceptions

Sinusoidal steady state only; one frequency at a time. No Fourier analysis, harmonics, resonance beyond simple series RLC identification, multi-pole filters, or phasor reference ambiguity.

Misconceptions: using peak in RMS power, swapping capacitor/inductor frequency trends, adding impedance magnitudes directly, and confusing current-leading with voltage-leading.

### Family `sine_peak_rms`

**Learner task.** Convert among peak, peak-to-peak, and RMS for a zero-offset sine.

**Derivation.** `Vpp=2Vp`, `Vrms=Vp/√2`.

**Constraints and rejection.** Sine explicitly stated; no DC offset/non-sinusoid.

**Difficulty.** Level 1 peak↔pp. Level 2 RMS. Level 3 inverse/mixed units.

**Examples.**

1. `10 V peak sine. RMS?` Answer `7.071 V`.
2. `20 Vpp sine. Peak?` Answer `10 V`.
3. `10 Vrms sine. Peak?` Answer `14.142 V`. Level 3.

**Validation.** Identity round-trips.

### Family `reactance`

**Learner task.** Calculate capacitor/inductor reactance magnitude and state trend with frequency.

**Derivation.** Global formulas; impedance sign `-jX_C` or `+jX_L`.

**Constraints and rejection.** Positive f/C/L. Ask magnitude unless complex form explicit.

**Difficulty.** Level 2 direct. Level 3 inverse f/component. Level 4 compare at two frequencies.

**Examples.**

1. `1 µF at 1 kHz. |Xc|?` Answer `159.15 Ω`.
2. `10 mH at 1 kHz. Xl?` Answer `62.83 Ω`.
3. `C fixed; frequency doubles.` Answer `|Xc| halves`.

**Validation.** Dimensional formula and monotonicity.

### Family `series_ac_impedance`

**Learner task.** Find magnitude/phase/current in series RC, RL, or simple RLC.

**Derivation.** `Z=R+j(X_L-X_C)`, magnitude `sqrt(R²+X²)`, angle `atan2(X,R)`, `I=V/Z`.

**Constraints and rejection.** Positive R; no near-zero cancellation at early levels. Voltage phase reference `0°` explicit.

**Difficulty.** Level 3 RC/RL with supplied reactance. Level 4 derive reactance. Level 5 simple RLC/cancellation.

**Examples.**

1. `R=100 Ω, X_L=100 Ω series.` Answer `|Z|=141.42 Ω, angle +45°`.
2. `R=100 Ω, X_C=100 Ω series.` Answer `|Z|=141.42 Ω, angle -45°`.
3. `10 Vrms across 3+j4 Ω.` Answer current magnitude `2 A`, phase `-53.13°`.

**Validation.** Complex arithmetic solver and power consistency.

### Family `ac_power_factor`

**Learner task.** Calculate apparent, real, reactive power or power factor.

**Derivation.** `S=VI`, `P=S cosφ`, `Q=S sinφ`; signs use stated load convention.

**Constraints and rejection.** RMS quantities explicit; passive load; phase in range. No three-phase.

**Difficulty.** Level 2 resistive. Level 3 given PF. Level 4 derive from impedance. Level 5 identify leading/lagging.

**Examples.**

1. `10 Vrms,2 Arms,resistive.` Answer `P=20 W,PF=1`.
2. `120 Vrms,2 Arms,PF=0.8.` Answer `S=240 VA,P=192 W`.
3. `S=100 VA,φ=+36.87°.` Answer `P=80 W,Q=+60 var`, lagging inductive.

**Validation.** Assert `S²=P²+Q²` within tolerance.

### Family `first_order_filter`

**Learner task.** Find cutoff, gain magnitude at landmark frequency, or identify low/high-pass topology.

**Derivation.** RC cutoff `fc=1/(2πRC)`; at cutoff magnitude `1/√2` of passband (`-3.0103 dB`). Use divider impedances for other points.

**Constraints and rejection.** Unloaded ideal source/filter, first order only. Output node explicit.

**Difficulty.** Level 2 topology. Level 3 cutoff. Level 4 cutoff gain/phase. Level 5 one frequency ratio (0.1fc,10fc).

**Examples.**

1. `Series R, shunt C, output across C.` Answer `low-pass`.
2. `R=1 kΩ,C=1 µF.` Answer `fc=159.15 Hz`.
3. `Low-pass at f=fc, Vin=1 Vrms.` Answer `|Vout|=0.707 Vrms`, phase `-45°`.

**Validation.** Complex divider cross-check and asymptotic behavior.

### Cross-family progression

RMS precedes power. Reactance precedes impedance, which precedes filters and phase-derived power factor. Calculator use is expected for `π`, roots, and exponentials; conceptual signs and topology remain graded separately.

## 7. Category: Diodes and Transistor Switches

### Category purpose

Apply explicitly supplied piecewise device models to practical rectification, indication, and switching circuits.

### Learn

Assume a state, replace the device by its stated on/off model, solve the linear circuit, then verify the state inequalities. Device labels and terminal orientation are essential.

### Boundaries and misconceptions

No analog transistor bias/small-signal gain, body diode transients, switching speed, thermal runaway, or real datasheet interpolation. `V_GS(th)` is never an on-resistance specification.

### Family `diode_state_piecewise`

**Learner task.** Determine diode state and circuit current/voltage under ideal or supplied constant-drop model.

**Derivation.** Solve off/on candidates and verify forward voltage/current inequalities.

**Constraints and rejection.** One/two diodes, resistive DC network, unique consistent state.

**Difficulty.** Level 1 ideal polarity. Level 2 constant drop. Level 3 biased clipper. Level 4 two-state selection.

**Examples.**

1. `5 V→1 kΩ→ideal diode→ground, anode toward resistor.` Answer `on,5 mA`.
2. Same with `0.7 V` drop. Answer `on,4.3 mA`.
3. `Anode 1 V,cathode 3 V, ideal diode.` Answer `off`.

**Validation.** Enumerate states, solve linear network, require one consistent state.

### Family `led_resistor_design`

**Learner task.** Calculate/select LED resistor and verify resistor/LED current and resistor power.

**Derivation.** `R_ideal=(V_s-V_F)/I`; chosen standard resistor at least ideal for maximum-current constraint; actual `I=(V_s-V_F)/R`.

**Constraints and rejection.** `V_s>V_F`; supplied constant `V_F`; positive current. Standard series supplied. No driving directly from unspecified GPIO.

**Difficulty.** Level 1 ideal R. Level 2 current with chosen R. Level 3 next standard value. Level 4 worst-case supply/VF. Level 5 power rating.

**Examples.**

1. `5 V,VF=2 V,20 mA.` Answer `150 Ω`.
2. `9 V,VF=2 V,R=330 Ω.` Answer `21.21 mA`.
3. `12 V,VF=3 V,max 20 mA; E12 choice.` Answer `470 Ω`, actual `19.15 mA`, resistor `0.172 W`.

**Validation.** Device equation, standard-value lookup, max-current inequality.

### Family `rectifier_output`

**Learner task.** Find polarity/peak output of simple half/full-wave rectifier using supplied diode drops.

**Derivation.** Conducting path count times `V_D`; output peak=`max(0,inputPeak-nV_D)`.

**Constraints and rejection.** Resistive load, no smoothing capacitor initially, topology and input peak explicit.

**Difficulty.** Level 2 ideal half-wave. Level 3 constant-drop. Level 4 bridge path. Level 5 qualitative waveform/frequency.

**Examples.**

1. `10 Vpeak half-wave, ideal diode.` Answer positive output peak `10 V`.
2. `10 Vpeak half-wave, VD=0.7 V.` Answer `9.3 V`.
3. `12 Vpeak bridge,0.7 V each.` Answer `10.6 V`; two conduct.

**Validation.** State/path enumeration and waveform polarity.

### Family `bjt_low_side_switch`

**Learner task.** Design/check an NPN low-side switch using supplied saturation model and forced beta.

**Derivation.** `I_C=(V_s-V_CE(sat))/R_load`; required `I_B≥I_C/β_forced`; `R_B≤(V_drive-V_BE)/I_B`.

**Constraints and rejection.** Supplied `V_BE`, `V_CE(sat)`, forced beta, resistive load, emitter grounded. Ratings checked separately.

**Difficulty.** Level 3 collector current. Level 4 base resistor. Level 5 choose standard value/check drive current.

**Examples.**

1. `5 V,load 100 Ω,VCEsat=0.2 V.` Answer `IC=48 mA`.
2. `IC=50 mA,forced β=10.` Answer `IB≥5 mA`.
3. `3.3 V drive,VBE=0.7 V,IB≥5 mA; choose from E24.` Answer `RB≤520 Ω`; choose `510 Ω`.

**Validation.** Inequality and saturation-assumption check.

### Family `mosfet_low_side_switch`

**Learner task.** Check stated gate drive suitability and on-state drop/loss for NMOS low-side switching.

**Derivation.** Use supplied guaranteed `R_DS(on)` at actual `V_GS`; `V_DS=IR`, `P=I²R`.

**Constraints and rejection.** Source at ground, resistive load, static on/off, supplied logic-level data. Never infer from threshold alone.

**Difficulty.** Level 3 gate-source voltage. Level 4 loss. Level 5 distinguish threshold from guaranteed drive/rating.

**Examples.**

1. `Gate 5 V,source 0 V.` Answer `VGS=5 V`.
2. `I=2 A,RDSon=50 mΩ.` Answer `VDS=0.1 V,P=0.2 W`.
3. `VGS(th)=2 V only; gate drive 3.3 V, no RDSon specified there.` Answer `cannot verify low-loss on-state`.

**Validation.** Model-data availability required; dimensional/power cross-check.

## 8. Category: Ideal Op-Amps and Comparators

### Category purpose

Analyze common ideal op-amp circuits and verify that the assumed linear solution fits stated output limits.

### Learn

Input currents are zero. With negative feedback and unsaturated output, `V+=V-`. These are conditional conclusions, not universal op-amp facts. Compute the linear result, then check supply/output range.

### Family `opamp_linear_state`

**Learner task.** Identify whether ideal negative-feedback assumptions apply and find input node voltage/current.

**Derivation.** Inspect feedback sign/connectivity; if linear and within limits use zero input current/virtual equality.

**Constraints and rejection.** Explicit ideal model/output limits, one op amp, no stability/bandwidth.

**Difficulty.** Level 2 follower. Level 3 virtual ground. Level 4 saturation check.

**Examples.**

1. `Follower, V+=2 V, limits ±5 V.` Answer `Vout=2 V`.
2. `Inverting circuit,V+=0,linear.` Answer `V-=0,input currents=0`.
3. `Follower requests 7 V,limits ±5 V.` Answer `saturates high at +5 V simplified limit`.

**Validation.** Modified nodal solver plus limit consistency.

### Family `opamp_inverting`

**Learner task.** Find gain/output/input current of an ideal inverting amplifier.

**Derivation.** `Vout=-(Rf/Rin)Vin` for grounded non-inverting input, then saturation check.

**Constraints and rejection.** Negative feedback, source ideal or supplied resistance included in Rin.

**Difficulty.** Level 2 gain. Level 3 output. Level 4 inverse resistor. Level 5 saturation.

**Examples.**

1. `Rin=10 kΩ,Rf=20 kΩ.` Answer gain `-2`.
2. `Vin=0.5 V,same values.` Answer `Vout=-1 V`.
3. `Vin=2 V,gain -4,limits ±5 V.` Answer saturated at `-5 V`, not `-8 V`.

**Validation.** Nodal linear result plus output clamp model.

### Family `opamp_noninverting`

**Learner task.** Find gain/output of non-inverting amplifier.

**Derivation.** `gain=1+Rf/Rg`; output=gain×input, then limits.

**Constraints and rejection.** Referenced lower resistor to stated reference; ideal negative feedback.

**Difficulty.** Level 2 gain. Level 3 output. Level 4 reference offset. Level 5 resistor design/saturation.

**Examples.**

1. `Rf=9 kΩ,Rg=1 kΩ.` Answer gain `10`.
2. `Vin=0.2 V,same.` Answer `2 V`.
3. `Desired gain 5,Rg=10 kΩ.` Answer `Rf=40 kΩ`.

**Validation.** Nodal solver and gain identity.

### Family `opamp_summing`

**Learner task.** Analyze a two/three-input inverting summer.

**Derivation.** `Vout=-Rf Σ(Vi/Ri)` with virtual reference, then limits.

**Constraints and rejection.** At most three inputs, clear common reference, manageable arithmetic.

**Difficulty.** Level 3 equal resistors. Level 4 weighted. Level 5 saturation/missing input.

**Examples.**

1. `Rf=R1=R2, inputs 1 V and 2 V.` Answer `-3 V`.
2. `Rf=10 kΩ; V1=1 V/R1=10 kΩ; V2=2 V/R2=20 kΩ.` Answer `-2 V`.
3. Linear result `-7 V`, limits `±5 V`. Answer saturates `-5 V`.

**Validation.** KCL at summing node plus limits.

### Family `comparator_state`

**Learner task.** Determine simplified comparator high/low output from input ordering.

**Derivation.** Output high limit if `V+>V-`, low if `<`; equality is excluded or explicitly indeterminate in ideal model.

**Constraints and rejection.** Open-loop comparator model and output levels supplied; no op-amp linear equality assumption or hysteresis initially.

**Difficulty.** Level 2 direct. Level 3 divider threshold. Level 4 simple stated hysteresis thresholds.

**Examples.**

1. `V+=2 V,V-=1 V,outputs 0/5 V.` Answer `5 V`.
2. `V+=0.8 V,V-=1.2 V,outputs ±12 V.` Answer `-12 V`.
3. `V-=2.5 V divider,V+=sensor 3 V.` Answer high.

**Validation.** Inequality/state enumeration; reject equality.

## 9. Category: Digital Interfaces, Measurement, and Practical Limits

### Category purpose

Connect ideal calculations to logic inputs, instruments, tolerances, and ratings without pretending to complete a real safety/reliability design.

### Family `pull_resistor_and_open_drain`

**Learner task.** Find node state/current for pull-up/down or open-drain connection.

**Derivation.** Released input tends to rail through resistor; asserted open drain pulls low; sink current `(Vdd-Vol)/R`.

**Constraints and rejection.** Supplied leakage/threshold/Vol when relevant; one shared node. No bus timing.

**Difficulty.** Level 2 logic state. Level 3 current. Level 4 choose resistor satisfying sink/leakage inequalities. Level 5 multiple open drains qualitative wired-AND.

**Examples.**

1. `10 kΩ pull-up to 5 V, switch open, ideal input.` Answer high/5 V.
2. `1 kΩ pull-up to 5 V, open drain at Vol=0.2 V.` Answer sink `4.8 mA`.
3. `Two open-drain outputs share pull-up; either asserts low.` Answer node low (wired-AND in positive logic).

**Validation.** Enumerate switch states and KCL.

### Family `logic_threshold_margin`

**Learner task.** Classify input as guaranteed low/high/indeterminate or calculate static noise margin from supplied thresholds.

**Derivation.** Compare voltage with `VIL(max)`/`VIH(min)`; low margin `VIL(max)-VOL(max)`, high `VOH(min)-VIH(min)`.

**Constraints and rejection.** Thresholds supplied; never memorize logic-family values.

**Difficulty.** Level 2 classify. Level 3 margins. Level 4 divider/open-drain voltage versus threshold.

**Examples.**

1. `VILmax=0.8,VIHmin=2.0,input=0.5 V.` Answer guaranteed low.
2. Same, input=`1.2 V`. Answer indeterminate.
3. `VOHmin=2.7,VIHmin=2.0.` Answer high noise margin `0.7 V`.

**Validation.** Ordered-threshold assertions and boundary cases.

### Family `meter_connection`

**Learner task.** Choose correct voltmeter/ammeter connection or predict ideal-meter fault/result.

**Derivation.** Voltmeter parallel/high resistance; ammeter series/low resistance. Ideal ammeter across ideal voltage source creates inconsistent/infinite-current ideal circuit.

**Constraints and rejection.** Low-voltage schematic; no real fuse/safety instruction.

**Difficulty.** Level 1 choose connection. Level 2 polarity/sign. Level 3 identify ideal short/open disturbance.

**Examples.**

1. `Measure resistor voltage.` Answer voltmeter in parallel.
2. `Measure branch current.` Answer ammeter in series.
3. `Ideal ammeter directly across ideal 5 V source.` Answer invalid ideal connection; equations inconsistent/unbounded current.

**Validation.** Graph insertion rule and ideal-source consistency check.

### Family `meter_loading`

**Learner task.** Calculate measurement error from finite voltmeter input resistance or ammeter burden resistance.

**Derivation.** Insert meter model into circuit and re-solve; compare undisturbed quantity.

**Constraints and rejection.** Meter resistance supplied. One measurement, linear network.

**Difficulty.** Level 3 voltmeter across source resistance/divider. Level 4 percent error. Level 5 ammeter burden.

**Examples.**

1. `5 V Thévenin source,Rth=10 kΩ,voltmeter 10 MΩ.` Answer `4.995 V`.
2. `10 V divider 10 kΩ/10 kΩ, meter 10 kΩ across lower.` Answer `3.333 V`.
3. `Ideal current 10 mA through 100 Ω; ammeter adds 10 Ω with 1.1 V source.` Answer measured `10 mA` versus without meter `11 mA`, `9.09%` low.

**Validation.** Solve with/without meter; error-sign check.

### Family `tolerance_worst_case`

**Learner task.** Find component range or conservative output/current bounds using supplied independent tolerances.

**Derivation.** Component min/max=`nominal(1±tol)`; monotonic endpoint selection proven for skeleton.

**Constraints and rejection.** At most three tolerances; no statistical/RSS claims. Worst-case independence explicit.

**Difficulty.** Level 2 component range. Level 3 Ohm current. Level 4 divider monotonic endpoints. Level 5 LED worst case.

**Examples.**

1. `1 kΩ ±5%.` Answer `950..1050 Ω`.
2. `5 V across 1 kΩ ±5%. Current range?` Answer `4.762..5.263 mA`.
3. Divider equal nominal `±1%`, worst output ratio. Answer min `0.495`, max `0.505` approximately.

**Validation.** Endpoint enumeration and monotonic proof/complete corner evaluation.

### Family `component_rating_check`

**Learner task.** Compare calculated stress with stated voltage/current/power rating and choose minimum offered rating with margin rule.

**Derivation.** Calculate worst stated stress, apply supplied design factor/derating, choose first rating meeting `rating≥required`.

**Constraints and rejection.** Margin rule supplied; no unstated thermal/peak ratings. Answer limited to arithmetic adequacy.

**Difficulty.** Level 2 resistor power. Level 3 voltage/current rating. Level 4 worst-case tolerance. Level 5 multiple constraints.

**Examples.**

1. `10 V across 1 kΩ.` Answer resistor power `0.1 W`; `0.125 W` is arithmetically adequate without extra margin.
2. `Dissipation 0.18 W; require ≥2× margin; choices 0.25,0.5,1 W.` Answer `0.5 W`.
3. `Capacitor sees max 12 V; require 1.5× voltage margin; choices 16,25,35 V.` Answer `25 V`.

**Validation.** Stress formula and ordered-choice uniqueness.

### Cross-family progression

Digital pulls follow resistive networks and transistor switches. Meter connection precedes loading. Tolerance precedes rating selection. These families deliberately qualify conclusions as model/rating arithmetic, not complete product design.

## 10. Topic-level progression

Recommended order:

1. schematic symbols, reference designators, common labels, polarity, and terminal interpretation;
2. component value markings, electrically identical nodes, current paths, opens/shorts, and series/parallel/neither classification;
3. basic schematic fault diagnosis interleaved with units, then Ohm's law and power;
4. KCL/KVL, pure and mixed resistor networks, and dividers;
5. loading, source resistance, Thévenin/Norton equivalents, and meters;
6. capacitor/inductor energy and DC state;
7. RC/RL time constants and switching;
8. sine RMS, reactance, simple impedance and filters;
9. diode/LED models, rectifiers, and BJT/MOSFET switches;
10. digital pull interfaces and ideal op-amp amplifiers/comparators;
11. AC power, tolerance, loading error, and rating checks.

Advanced families unlock by prerequisite family, not broad category score. Symbol recognition unlocks use of an unglossed symbol; node/path mastery unlocks KCL/KVL and network reduction; polarity/terminal mastery unlocks signed and device questions; topology classification unlocks reduction/dividers. Resistor color-code mastery is not required for analytical questions whose values are printed normally. Interleave calculations with topology/model identification, and interleave Thévenin/Norton once each direct form is reliable.

## 11. Adaptive practice guidance

Track family, symbol type/convention, annotation role, terminal type/orientation, marking notation, node-connectivity mechanism, path/open/short mechanism, topology, fault type, requested quantity, SI-prefix direction, sign convention, component model, domain, equivalent-source form, loading state, initial/final condition, phase quadrant, device state, saturation state, tolerance corner, and misconception.

Maintain mastery estimates by category, subcategory, family, misconception, representation, and difficulty dimension. Family unlock decisions use prerequisite-family evidence; a broad category score must not conceal a persistent node, polarity, notation, or source-equivalence misconception.

Key routing:

| Error | Diagnosis | Next item |
|---|---|---|
| symbol confused with a lookalike | missing visual cue | isolated contrast using the two symbols |
| `R3` read as `3 Ω` | designator/value roles confused | label-role contrast on one component |
| diode/voltage polarity reversed | orientation cue ignored | rotated terminal/polarity item with explicit cue |
| `4k7` read as `47 kΩ` | compact decimal marker misunderstood | RKM decode then encode pair |
| `104` read as `104 pF` | capacitor exponent rule missed | split significand/exponent with prefix conversion |
| crossing treated as junction | node connectivity cue missed | paired crossing-with/without-dot item |
| only one parallel path selected | “current chooses one path” | select-all current-path item |
| open/short consequences swapped | edge removal/contraction confused | matched before/after graph item |
| apparent row classified as series | shared-node branch ignored | endpoint-node pairs with third branch |
| fault choice explains only one symptom | evidence not cross-checked | simpler fault matrix with two discriminating observations |
| ×1000 error | prefix conversion | same formula, isolated unit conversion |
| parallel result above minimum | series/parallel model | topology/bounds contrast |
| loaded divider equals unloaded | load ignored | paired outputs |
| wrong `R_seen` | source deactivation/topology | Thévenin resistance only |
| Norton load current equals `I_N` | current division ignored | equal-branch Norton load then varied ratio |
| Norton current sign reversed | port direction mismatch | paired Thévenin/Norton polarity conversion |
| RC starts at final | continuity/initial state | snapshot question |
| 1τ treated complete | exponential landmark | 1τ/5τ contrast |
| capacitor reactance rises with f | trend reversed | two-frequency qualitative item |
| impedance magnitudes added | phase/complex addition missed | 3-4-5 impedance |
| peak used for AC power | RMS confusion | peak↔RMS then power |
| diode state inconsistent | assumed state not checked | on/off verification fields |
| MOSFET threshold treated fully on | datasheet parameter confusion | supplied RDS(on) availability judgment |
| op-amp virtual equality during saturation | conditional ideal rule missed | linear result then limit check |
| comparator treated as linear op amp | feedback/model confusion | open-loop state item |
| voltmeter changes divider ignored | instrument loading | ideal versus finite meter pair |
| nominal tolerance used for worst case | corner selection | one-component range then monotonic circuit |

Recommended selection: 45% weakest due, 25% spaced mastery, 20% misconception/prerequisite diagnostics, 10% controlled combination. At least 25% should ask topology, model validity, sign, or rating judgment rather than a formula result.

## 12. Feedback and implementation requirements

For schematic-literacy questions, feedback must show:

1. the defining visual cue or annotation convention;
2. the relevant node/terminal mapping;
3. the graph operation (trace, edge removal, or node contraction);
4. why a recognized distractor fails.

For analytical questions, feedback must show:

1. model/domain and topology;
2. reference polarity/direction;
3. equations before numbers;
4. unit-normalized substitution;
5. final units/rounding;
6. a plausibility check (bounds, limiting case, state consistency, or power balance).

Use a dimension-aware quantity system internally. Circuit graphs, text, SVG, solver, and feedback share one semantic source. Linear DC/AC instances should be independently checked by modified nodal analysis; reducible networks also by family formula. First-order responses must pass initial/final/monotonicity checks. Piecewise devices enumerate states and require exactly one consistent solution. Op-amp linear solutions must be checked against limits.

Do not generate arbitrary schematics and hope they solve. Use reviewed topology templates with bounded parameters and rejection. Symbol identity, annotations, terminal semantics, graph connectivity, display layout, and accessible text must be generated from the same source. Calculator availability is appropriate for exponentials/complex values; adaptive scoring should distinguish visual literacy, concept, sign, and arithmetic errors.

## 13. Automated validation

For every instance:

- all graph nodes/branches and labels agree across text/SVG;
- rendered symbols round-trip to their declared semantic type and convention;
- reference designators are unique and annotations resolve to the declared object, terminal, or net scope;
- terminal semantics survive every allowed rotate/mirror transform;
- requested dimension matches answer dimension;
- exact SI answer and displayed conversion recompute;
- no zero divisor, impossible source constraint, floating node, or unintended multiple solution exists;
- model assumptions are explicit and self-consistent;
- choices have one correct answer;
- rounding/tolerance accepts canonical compatible units;
- schematic accessibility text is complete;
- rejection and recent-history rules pass.

Property tests:

- dimensional round trips for all prefixes;
- resistor color-band and compact-notation encode/decode round trips;
- union-find versus graph traversal agreement for electrical nodes;
- complete-path enumeration after every generated switch/open state;
- open-edge removal, short-node contraction, and ideal-source contradiction checks;
- series/parallel/neither classification invariant under layout changes;
- unique observation signature for every generated single-fault diagnosis;
- KCL at every solved node and KVL/power balance for solved networks;
- formula versus nodal-solver agreement for resistor/divider/Thévenin/Norton/meter cases;
- Thévenin/Norton identities `R_th=R_N`, `V_th=I_N R_N`, and equal loaded port behavior;
- transient `t=0`, `t→∞`, and derivative-direction checks;
- complex impedance/divider and `S²=P²+Q²` checks;
- exhaustive device-state consistency for each piecewise topology;
- op-amp nodal solution plus output-limit check;
- all tolerance corners enumerated for declared worst-case families;
- at least 10,000 deterministic seeds per family/level.

Distribution tests balance symbol/annotation/terminal target, drawing convention and orientation, marking format, junction mechanism, path count, open/short location, series/parallel/neither class, fault type, analytical topology, target variable, prefix, sign, equivalent-source form, exact/rounded result, load ratio, time point, reactive type, phase sign, device state, op-amp saturation, logic state, and tolerance corner. Easy identities and visually repeated schematics must remain below quotas.

## 14. Topic-level quality checklist

- [ ] The app is titled **Electric Circuits**, not “Basics.”
- [ ] Foundational schematic literacy precedes formula-based circuit analysis.
- [ ] Every unglossed symbol has been introduced, and its declared convention is supported.
- [ ] Reference designators, values, terminals, and net labels remain distinct semantic fields.
- [ ] Color bands and compact markings round-trip to exact normalized values.
- [ ] Every schematic is generated from a validated semantic graph.
- [ ] Junctions, crossings, repeated labels, opens, and shorts render consistently with graph connectivity.
- [ ] Series/parallel/neither classification uses endpoint nodes and branch degree, never visual alignment.
- [ ] Fault-diagnosis instances have exactly one fault and one observation-consistent answer.
- [ ] Voltage polarities and current reference arrows are explicit.
- [ ] Compatible units are accepted and incompatible dimensions rejected.
- [ ] Loading/tolerance/rating are never silently ignored when relevant.
- [ ] Capacitor voltage and inductor current continuity are respected.
- [ ] AC questions distinguish peak and RMS and use explicit phase conventions.
- [ ] Device questions name an idealized model and verify assumed state.
- [ ] `VGS(th)` is never used as a guaranteed MOSFET on-drive specification.
- [ ] Ideal op-amp equality is used only with linear negative feedback and valid output range.
- [ ] Meter models are inserted into the circuit for loading questions.
- [ ] Thévenin and Norton equivalents use consistent port polarity/current direction and identical loaded behavior.
- [ ] Worst-case claims enumerate/prove the relevant corners.
- [ ] No exercise constitutes mains/high-voltage construction advice.
- [ ] Every schematic-literacy and Norton family supplies the complete dynamic-family contract: exact templates/placeholders, accepted answers, constraints/rejections, controlled variations, qualitative levels, misconception-based distractors, diagnostic feedback/worked solution, three graded examples, implementation notes, automated validation, and coverage quotas.
- [ ] Every family has three examples, constraints, derivation, feedback, and validation.
- [ ] Independent solvers/property tests validate generated answers.
- [ ] Difficulty grows through circuit reasoning rather than drawing clutter or arithmetic.

## 15. Stable identifiers and recommended navigation

Recommended navigation:

- Schematic Literacy & Connectivity
- DC Foundations
- Resistive Networks
- Energy Storage & Transients
- Sinusoidal AC & Filters
- Diodes & Transistor Switches
- Op-Amps & Comparators
- Digital Interfaces & Practical Limits

Stable family identifiers are the backticked names above. Existing `electric-circuits-basics` progress may be migrated into the corresponding foundation families, but it must not imply mastery of newly introduced intermediate material.
