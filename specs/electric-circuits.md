# Electric Circuits — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, schematic-renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Electric Circuits

### Topic goal

Develop practical intermediate circuit literacy: read a schematic as a network of nodes and branches, select an explicit component model, calculate useful operating quantities, check loading and ratings, and recognize when an idealized design will or will not behave as intended.

The topic should progress substantially beyond isolated formula substitution while remaining below an electrical-engineering degree course. Repeated practice should improve the learner's ability to analyze and design small low-voltage analog and digital-interface circuits.

### Scope

The topic includes:

- SI prefixes, unit conversion, polarity, reference direction, and schematic connectivity;
- Ohm's law, Kirchhoff's current law (KCL), Kirchhoff's voltage law (KVL), power, and energy;
- series, parallel, and reducible mixed resistor networks;
- unloaded and loaded dividers;
- Thévenin equivalents and sources with internal resistance;
- capacitor/inductor constitutive relationships at a qualitative level, stored energy, and first-order RC/RL transients;
- sinusoidal peak/RMS values, reactance, simple series impedance, phase, real/reactive/apparent power, and power factor;
- first-order passive RC/RL filters;
- piecewise-linear diode and LED models, basic rectifiers, BJT switches, and enhancement-MOSFET switches;
- ideal op-amp linear circuits, saturation checks, and simple comparators;
- pull-ups/pull-downs, open-drain nodes, and stated digital input thresholds;
- meter connection/loading, component tolerances, standard-value selection, and voltage/current/power ratings.

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
- The generated graph must be electrically validated before rendering.
- Layout changes alone are not a question variation and must never alter topology.
- Accessible text must describe nodes, branches, component values, and measurement points sufficiently to solve without the image.

### Difficulty philosophy

Difficulty should rise through topology recognition, model selection, sign/reference reasoning, loading, transient initial/final conditions, phase, interacting constraints, and design verification.

It must not rise merely through awkward prefixes, excessive significant digits, cluttered drawings, many series components, hidden nodes, or arithmetic that is best delegated to a calculator. Most questions should involve at most three essential reasoning stages.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `analysisDomain`, `componentModel`, `circuitGraph`, `schematicLayout`, `givensSI`, `requestedQuantity`, `expectedDimension`, `exactAnswer`, `displayAnswer`, `tolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, and `structuralSignature`.

Generate the semantic graph and model first, solve it independently, validate constraints, then render text/SVG. Reject recent structural signatures within 20 questions and exact instances within 100.

## 2. Category: DC Foundations

### Category purpose

Build fluent units, sign conventions, and conservation laws that support every later category.

### Learn

Use SI units before formulas. Ohm's law applies to an ideal resistor: `V=IR`. KCL conserves charge at a node; KVL conserves energy around a closed loop. With passive sign convention, positive power is absorbed and negative power delivered.

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

## 3. Category: Resistive Networks and Equivalent Sources

### Category purpose

Train topology recognition, network reduction, loading, and replacement of a linear two-terminal network by a useful equivalent.

### Learn

Series elements share current; parallel elements share voltage. Divider formulas apply only to the stated topology and load. A linear source network seen from two terminals can be replaced by `V_th` in series with `R_th`.

### Subcategories

1. Series/Parallel Reduction
2. Dividers and Loading
3. Thévenin and Source Resistance

### Common misconceptions

- Calling components series because drawn in a row despite a branch node.
- Calling components parallel without sharing both nodes.
- Producing parallel equivalent above the smallest branch.
- Using unloaded divider formula after attaching a load.
- Turning off dependent sources (excluded) or measuring `R_th` with independent sources active.

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
2. Same divider, load 100 kΩ.` Answer `4.762 V`. Level 3.
3. Unloaded 5 V, loaded 4.762 V.` Answer `4.76% droop`. Level 4.

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
3. Same equivalent with 750 Ω load.` Answer load current `2 mA`, load voltage `1.5 V`. Level 5.

**Implementation and validation.** Nodal open-circuit plus test-source resistance solver cross-check.

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

Topology recognition precedes formulas. Pure reductions precede mixed networks. Unloaded dividers precede loading; loaded divider naturally introduces Thévenin. Source resistance reuses the equivalent model. Wrong loaded-divider answers matching unloaded output trigger a paired comparison.

## 4. Category: Energy Storage and First-Order Transients

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

## 5. Category: Sinusoidal AC and First-Order Filters

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

## 6. Category: Diodes and Transistor Switches

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
2. Same with `0.7 V` drop.` Answer `on,4.3 mA`.
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

## 7. Category: Ideal Op-Amps and Comparators

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
3. Linear result `-7 V`, limits ±5 V.` Answer saturates `-5 V`.

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

## 8. Category: Digital Interfaces, Measurement, and Practical Limits

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
2. Same,input=1.2 V.` Answer indeterminate.
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
3. Divider equal nominal ±1%, worst output ratio.` Answer min `0.495`, max `0.505` approximately.

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

## 9. Topic-level progression

Recommended order:

1. units, Ohm's law, series/parallel, power;
2. KCL/KVL, mixed networks, dividers;
3. loading, source resistance, Thévenin, meters;
4. capacitor/inductor energy and DC state;
5. RC/RL time constants and switching;
6. sine RMS, reactance, simple impedance and filters;
7. diode/LED models and rectifiers;
8. BJT/MOSFET switches and digital pull interfaces;
9. ideal op-amp amplifiers/comparators;
10. AC power, tolerance, loading error, and rating checks.

Advanced families unlock by prerequisite family, not broad category score. Interleave calculations with topology/model identification.

## 10. Adaptive practice guidance

Track family, topology, requested quantity, SI-prefix direction, sign convention, component model, domain, loading state, initial/final condition, phase quadrant, device state, saturation state, tolerance corner, and misconception.

Key routing:

| Error | Diagnosis | Next item |
|---|---|---|
| ×1000 error | prefix conversion | same formula, isolated unit conversion |
| parallel result above minimum | series/parallel model | topology/bounds contrast |
| loaded divider equals unloaded | load ignored | paired outputs |
| wrong `R_seen` | source deactivation/topology | Thévenin resistance only |
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

## 11. Feedback and implementation requirements

Feedback must show:

1. model/domain and topology;
2. reference polarity/direction;
3. equations before numbers;
4. unit-normalized substitution;
5. final units/rounding;
6. a plausibility check (bounds, limiting case, state consistency, or power balance).

Use a dimension-aware quantity system internally. Circuit graphs, text, SVG, solver, and feedback share one semantic source. Linear DC/AC instances should be independently checked by modified nodal analysis; reducible networks also by family formula. First-order responses must pass initial/final/monotonicity checks. Piecewise devices enumerate states and require exactly one consistent solution. Op-amp linear solutions must be checked against limits.

Do not generate arbitrary schematics and hope they solve. Use reviewed topology templates with bounded parameters and rejection. Calculator availability is appropriate for exponentials/complex values; adaptive scoring should distinguish concept errors from arithmetic slips.

## 12. Automated validation

For every instance:

- all graph nodes/branches and labels agree across text/SVG;
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
- KCL at every solved node and KVL/power balance for solved networks;
- formula versus nodal-solver agreement for resistor/divider/Thévenin/meter cases;
- transient `t=0`, `t→∞`, and derivative-direction checks;
- complex impedance/divider and `S²=P²+Q²` checks;
- exhaustive device-state consistency for each piecewise topology;
- op-amp nodal solution plus output-limit check;
- all tolerance corners enumerated for declared worst-case families;
- at least 10,000 deterministic seeds per family/level.

Distribution tests balance topology, target variable, prefix, sign, exact/rounded result, load ratio, time point, reactive type, phase sign, device state, op-amp saturation, logic state, and tolerance corner. Easy identities and visually repeated schematics must remain below quotas.

## 13. Topic-level quality checklist

- [ ] The app is titled **Electric Circuits**, not “Basics.”
- [ ] Every schematic is generated from a validated semantic graph.
- [ ] Voltage polarities and current reference arrows are explicit.
- [ ] Compatible units are accepted and incompatible dimensions rejected.
- [ ] Loading/tolerance/rating are never silently ignored when relevant.
- [ ] Capacitor voltage and inductor current continuity are respected.
- [ ] AC questions distinguish peak and RMS and use explicit phase conventions.
- [ ] Device questions name an idealized model and verify assumed state.
- [ ] `VGS(th)` is never used as a guaranteed MOSFET on-drive specification.
- [ ] Ideal op-amp equality is used only with linear negative feedback and valid output range.
- [ ] Meter models are inserted into the circuit for loading questions.
- [ ] Worst-case claims enumerate/prove the relevant corners.
- [ ] No exercise constitutes mains/high-voltage construction advice.
- [ ] Every family has three examples, constraints, derivation, feedback, and validation.
- [ ] Independent solvers/property tests validate generated answers.
- [ ] Difficulty grows through circuit reasoning rather than drawing clutter or arithmetic.

## 14. Stable identifiers and recommended navigation

Recommended navigation:

- DC Foundations
- Resistive Networks
- Energy Storage & Transients
- Sinusoidal AC & Filters
- Diodes & Transistor Switches
- Op-Amps & Comparators
- Digital Interfaces & Practical Limits

Stable family identifiers are the backticked names above. Existing `electric-circuits-basics` progress may be migrated into the corresponding foundation families, but it must not imply mastery of newly introduced intermediate material.
