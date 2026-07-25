# Physics — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, diagram/graph-renderer, numeric-checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Physics

### Topic goal

Develop fast, reliable algebra-based physical reasoning: identify the applicable idealized model, translate between words, diagrams, graphs, units, and equations, compute or compare the requested quantity, and test whether the result is dimensionally and physically plausible.

The app is not a formula-recall quiz. Repeated practice should improve the learner's ability to decide what a formula means, which quantities are signed or vector-valued, which assumptions make it valid, and what a graph's slope or area represents.

### Audience and expected prior knowledge

The target learner is an adult or secondary-school/introductory-college student who knows:

- arithmetic, fractions, ratios, powers of ten, and simple algebra;
- square roots and basic trigonometry for later levels;
- Cartesian coordinates and the meaning of slope and area;
- calculator use when a family involves trigonometric, logarithmic, or square-root calculations.

Calculus is not required. A few ideas normally expressed with calculus may appear only through constant values, piecewise-linear graphs, or explicitly supplied average relationships.

### Scope

The topic includes:

- SI units, prefixes, compound-unit conversion, dimensions, measurement resolution, and estimation;
- one- and two-dimensional kinematics, constant acceleration, free fall, and projectile components;
- position–time, velocity–time, acceleration–time, force–displacement, and other simple generated graphs;
- Newton's laws, free-body reasoning, friction, inclines, equilibrium, and uniform circular motion;
- work, kinetic and potential energy, power, efficiency, impulse, momentum, one-dimensional collisions, and torque;
- mechanical waves, sound, standing-wave fundamentals, reflection, refraction, and thin lenses;
- temperature, heating, phase changes, ideal gases, density, pressure, hydrostatics, and buoyancy;
- charge, current, electric force/field/potential, electrical energy, and elementary magnetic-force reasoning;
- simple experimental-data interpretation, proportional models, uncertainty ranges, and model checks.

This is a broad algebra-based physics practice app, not merely “mechanics basics.” Categories unlock progressively, but each remains bounded enough to generate questions with objective local checking.

### Exclusions

Do not include:

- calculus-based derivations, differential equations, vector calculus, tensors, Lagrangian/Hamiltonian mechanics, or proof questions;
- non-inertial frames beyond the qualitative statement that the declared frame is inertial;
- rotational inertia tables, rolling without slipping, angular momentum, gravitation beyond uniform near-Earth gravity, or orbital mechanics in the initial version;
- fluid viscosity, Bernoulli-flow networks, turbulence, kinetic theory derivations, entropy calculations, or heat engines;
- diffraction calculations, interference path-difference problems, polarization, physical optics beyond simple wave descriptions, or relativistic Doppler effects;
- AC circuit analysis, resistor networks, Kirchhoff laws, capacitance/inductance transients, semiconductors, op-amps, or electronics design; those belong in **Electric Circuits**;
- Maxwell's equations, electromagnetic induction, field integration, continuous charge distributions, particle accelerators, or detailed motor/generator models;
- quantum, atomic, nuclear, particle, relativity, astrophysics, or memorized catalogues of constants;
- free-form explanations whose correctness would require natural-language judgment;
- practical experiments involving mains electricity, ionizing radiation, pressure vessels, combustion, weapons, traffic, heights, or other hazardous setups.

### Educational and safety boundary

All situations are idealized calculations, not instructions for building, testing, or operating physical equipment. Human, vehicle, sports, and laboratory contexts must use benign values and must not ask the learner to infer real-world safety. Electricity items are low-energy conceptual models; no generated question may imply that a numeric answer establishes electrical safety.

### Normative physical model

Every instance stores and visibly states the assumptions needed to select its model. Assumptions must never be hidden merely because they are common in textbooks.

- Unless stated otherwise, the reference frame is inertial, distances are small enough for flat geometry, objects are point particles, and air resistance is neglected.
- One-dimensional signed quantities use the displayed positive direction. A negative result reports direction; it is not automatically an error.
- In two dimensions, `+x` is right and `+y` is up unless the diagram explicitly declares different axes.
- Vector magnitudes are non-negative. Vector components may be negative.
- Angles are in degrees and are measured from the named axis or surface. Reflection/refraction angles are measured from the normal.
- Near-Earth gravity is uniform and downward. Each instance displays the value of `g`, normally `9.8 m/s²`; generators must not silently alternate between `9.8`, `9.81`, and `10`.
- Constant-acceleration equations are valid only when acceleration is constant over the stated interval.
- A “frictionless” surface has zero friction. Otherwise the supplied friction model is used.
- Static friction satisfies `0 ≤ |f_s| ≤ μ_s N` and takes the value needed for equilibrium up to its maximum. Kinetic friction has magnitude `f_k=μ_k N` and opposes relative sliding.
- “Centripetal force” means the inward net force `mv²/r`, not an additional force to add to a free-body diagram.
- Mechanical-energy conservation is used only when the declared system has no non-conservative energy transfer. Work and heat must be included when present.
- Momentum conservation is used only for a declared isolated system over the collision/interaction interval.
- Torque is `τ=rF sin θ`; counterclockwise is positive unless stated otherwise.
- Fluids are incompressible and at rest for hydrostatic/buoyancy families.
- An ideal gas obeys `PV=nRT`; temperature in gas-law calculations is absolute kelvin.
- Wave media are uniform and non-dispersive unless a supplied relationship says otherwise.
- Geometric-optics rays are paraxial for thin-lens questions. Lens sign conventions are declared below.
- Electric test charges are sufficiently small not to disturb the source configuration. Point-charge questions use electrostatics in vacuum/air.
- Magnetic-force questions use uniform fields and explicitly show the charge sign, velocity, and field direction.

### Constants and supplied data

The app must distinguish defined/reference constants from problem-specific approximations.

- The generator maintains a versioned constants table sourced from BIPM SI definitions and the current CODATA/NIST release.
- Questions should usually supply any constant needed for calculation, including `g`, `R`, `k_e`, sound speed, refractive index, specific heat, latent heat, and fluid density.
- Memorizing numerical constants is not a target skill. Constants may be omitted only after the same session has pinned them in a persistent formula/data panel.
- Use `π` at full internal precision. A question may explicitly permit `π≈3.14`.
- Exact SI definitions, such as `1 Hz = 1 s⁻¹` and `1 N = 1 kg·m·s⁻²`, remain exact. Empirical material properties must not be presented as universal exact values.

### Unit, notation, and dimensional conventions

Canonical storage uses SI base units. Supported display/answer units include:

- length: `m, cm, mm, km`;
- time: `s, ms, min, h`;
- mass: `kg, g`;
- angle: `rad, °/deg` where the family permits it;
- speed/acceleration: `m/s, km/h, m/s²`;
- force/energy/power: `N, J, W`;
- momentum/impulse: `kg·m/s, N·s`;
- pressure: `Pa, kPa, MPa, atm` when the conversion is supplied;
- frequency: `Hz, kHz`;
- temperature: `K, °C`;
- charge/current/voltage/field: `C, mC, µC/uC, nC, A, mA, V, N/C, V/m`;
- magnetic field: `T, mT`;
- density: `kg/m³, g/cm³`;
- volume: `m³, L, mL`.

The quantity parser must understand multiplication dots, ASCII `*`, division, integer powers, and compatible derived units. It must reject dimensionally incompatible answers.

- Surrounding whitespace is ignored.
- Decimal point/comma follows locale setting.
- Scientific notation accepts `e` form and `×10^n`.
- `u` is accepted for `µ`; prefix case remains significant.
- Compatible units are accepted unless the family explicitly trains conversion to a requested unit.
- Unitless input is accepted only when the answer field already displays a fixed unit or the quantity is dimensionless.
- Multiple quantities use named fields, not an ambiguous comma-separated list.
- Direction choices use semantic labels such as `left`, `right`, `into page`, or `out of page`; do not infer direction from a bare sign when no axis is shown.
- Equivalent exact forms such as `5√2 m/s` may be accepted when the expression parser is available; a decimal equivalent must always be accepted.

### Numeric accuracy and rounding

Compute in canonical SI using exact rational arithmetic where practical and at least 12 significant digits otherwise. Round only the requested final result.

Unless a family overrides it, the accepted tolerance is the larger of:

- half a unit in the last displayed decimal place; and
- `0.2%` of the nonzero canonical answer magnitude.

Exact counts, choices, signs, formula selections, and dimension vectors require exact semantic agreement. For answers expected to be zero, tolerance derives from the displayed precision and relevant scale rather than a relative percentage.

Significant figures are taught only in the measurement family. Elsewhere, do not reject a physically correct answer merely because it contains extra sensible digits.

### Diagram and graph semantics

Visuals are part of the question and must derive from the same semantic instance as the solver.

- Every axis has a variable name, unit, scale, zero location, and positive direction.
- Every graph vertex used for calculation lies on a readable tick or has a numeric label.
- Piecewise-linear segments are exact between displayed vertices.
- Area under a graph is signed relative to the horizontal axis unless the prompt asks for geometric area.
- Curves must not be used for quantitative reading unless their equation or exact sampled values are supplied.
- Force arrows originate on the affected object, point in the force direction, and have text labels. Arrow length is qualitative unless “drawn to scale” is explicitly stated.
- Object size, path curvature, and diagram spacing are not quantitatively meaningful unless declared.
- Reflection/refraction diagrams show the interface and normal.
- Electric/magnetic direction diagrams define `⊙` as out of the page and `⊗` as into the page.
- Every SVG/canvas visual has accessible text containing all givens and spatial relationships needed to solve the item without seeing the image.

### Global answer conventions

Each question explicitly says whether it asks for:

- a scalar, signed component, magnitude, direction, interval/range, choice, ordered sequence, or several named quantities;
- an exact value or rounded value;
- a requested output unit;
- use of a calculator.

If a prompt says “speed,” the answer cannot be negative. If it says “velocity along the shown axis,” the sign is required. Temperature changes in `K` and `°C` have the same numeric size, but absolute Celsius and kelvin values do not.

### Difficulty philosophy

Difficulty should rise through:

- selecting a model from explicit conditions;
- choosing a system, axis, sign, or relevant component;
- moving among prose, diagrams, graphs, tables, and equations;
- reversing a familiar relationship;
- combining two or at most three independently mastered steps;
- recognizing bounds, limiting cases, and whether a proposed model applies;
- distinguishing related quantities such as speed/velocity, mass/weight, energy/power, and force/pressure.

Difficulty must not rise through gratuitous decimal arithmetic, obscure constants, cluttered diagrams, trick wording, unrealistic values, hidden assumptions, or requiring many identical substitutions. Most level-3 questions should remain solvable in under three minutes with a basic calculator.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `modelId`, `assumptions`, `semanticScene`, `givensSI`, `displayGivens`, `requestedQuantity`, `requestedDimension`, `referenceAxes`, `exactAnswer`, `displayAnswer`, `acceptedUnits`, `tolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `visualDescription`, and `structuralSignature`.

Generate the semantic model first, solve it independently, validate it, and only then render wording and visuals. Reject the same structural signature within 20 questions and the same numeric instance within 100.

## 2. Category: Measurement, Units, and Models

### Category purpose

Train the representational skills that make later calculations meaningful: dimensions, unit scale, measurement limits, and rough plausibility.

### Learn

A physical quantity is a number with a unit and dimension. Convert units by multiplying by forms of one, and apply conversion factors to every power in a compound unit. Equations can only add like dimensions. Measurements describe intervals implied by their resolution; calculated precision cannot create information that was never measured.

### Subcategories

1. Prefix and compound-unit conversion
2. Dimensions and equation checks
3. Resolution, uncertainty, and estimation

### Common misconceptions

- Converting `cm²` with one factor of `100` instead of squaring it.
- Treating derived-unit names as unrelated to base units.
- Believing matching unit symbols prove an equation's physical validity.
- Confusing an instrument's smallest division with a guaranteed exact value.
- Reporting implausible results without a scale check.

### Family `unit_conversion`

**Skill.** Convert simple or compound quantities while preserving dimension.

**Response mode.** Numeric quantity in a requested unit.

**Template.** `Convert {value} {sourceUnit} to {targetUnit}.`

**Generation and derivation.** Choose compatible units from the global table. Multiply by the exact ratio of source scale to target scale, applying exponents to scale factors. Levels: one prefix; mixed time/speed; squared/cubed or density units.

**Misconceptions, constraints, and rejection.** Target missed prefix factors, `60` versus `100`, and unsquared factors. Reject conversions whose only challenge is entering more than four significant digits or whose display rounds the intended distinction away.

**Feedback and validation.** Show a chain of unit-canceling factors and verify dimensional identity plus round-trip conversion.

**Examples.**

1. L1: `Convert 2.4 km to m.` → `2400 m`; multiply by `1000`.
2. L2: `Convert 72 km/h to m/s.` → `20 m/s`; multiply by `1000/3600`.
3. L3: `Convert 1.20 g/cm³ to kg/m³.` → `1200 kg/m³`; both mass and cubed length change.

### Family `dimensional_analysis`

**Skill.** Determine the dimension of a quantity or whether an equation is dimensionally possible.

**Response mode.** Single-choice or dimension expression.

**Template.** `Given [{quantity definitions}], what are the dimensions of {expression}?`

Controlled variant: `Which proposed equation could be dimensionally valid?`

**Generation and derivation.** Represent dimensions as integer exponent vectors over `M,L,T,I,Θ`. Multiply/divide by adding/subtracting exponents; raise by multiplying exponents. Levels: derived unit expansion; compound expression; compare several equations containing plausible exponent errors.

**Misconceptions, constraints, and rejection.** Distractors omit an exponent, invert time, confuse energy with power, or add incompatible terms. Do not imply dimensional consistency proves an equation physically correct.

**Feedback and validation.** Expand each quantity to bases and compare every term. Independently symbolic-check exponent vectors.

**Examples.**

1. L1: `What are the dimensions of speed?` → `L T⁻¹`.
2. L2: `What are the dimensions of ½mv²?` → `M L² T⁻²`.
3. L3: `Which could be valid: x=vt, x=v/t, x=vt²?` → `x=vt`.

### Family `measurement_interval`

**Skill.** Interpret resolution or stated absolute uncertainty as a value interval and propagate one simple bound.

**Response mode.** Two named numeric fields or single-choice.

**Template.** `{quantity} is recorded as {reading} {unit} to the nearest {resolution} {unit}. What interval of true values is represented?`

Variant: `Using the stated independent bounds, what is the possible range of {sumOrDifference}?`

**Generation and derivation.** Nearest-resolution readings map to half-open display bins `[reading-r/2, reading+r/2)`; UI feedback may write the upper endpoint with `<`. For addition/subtraction, evaluate endpoint combinations. Do not introduce statistical confidence or Gaussian assumptions.

**Misconceptions, constraints, and rejection.** Target full-resolution instead of half-resolution, percentage/absolute confusion, and shrinking uncertainty by subtraction. Values must not cross an impossible physical boundary unless interpreting that issue is the task.

**Feedback and validation.** Show endpoints and worst-case arithmetic; enumerate endpoint corners independently.

**Examples.**

1. L1: `12.4 cm to nearest 0.1 cm` → `12.35 cm ≤ L < 12.45 cm`.
2. L2: `5.0±0.2 s and 3.0±0.1 s: range of the sum` → `7.7 s to 8.3 s`.
3. L3: `A=10.0±0.2 m, B=4.0±0.1 m: range of A−B` → `5.7 m to 6.3 m`.

### Family `order_of_magnitude`

**Skill.** Estimate scale and detect physically implausible unit/formula results.

**Response mode.** Power-of-ten input or single-choice.

**Template.** `Using the supplied approximate values, estimate {quantity} to the nearest power of ten.`

Variant: `Which result is plausible for {described situation}?`

**Generation and derivation.** Values are deliberately rounded to one significant digit. Compute the rough product/quotient and select the closest `10^n`; define ties by comparing logarithmic distance. Levels: one operation; compound unit; diagnose a factor-of-10/1000 error.

**Misconceptions, constraints, and rejection.** Choices reflect prefix mistakes, inverted ratios, or dimension mismatch. Do not require memorized real-world facts; all relevant scales appear in the prompt.

**Feedback and validation.** Show exponent arithmetic and a unit check.

**Examples.**

1. L1: `About 3×10⁸ m/s for 2×10⁻³ s: distance order?` → `10⁶ m`.
2. L2: `Mass ≈10³ kg, speed ≈10¹ m/s: kinetic-energy order?` → `10⁵ J`.
3. L3: `A 2 kW device runs about 10³ s. Plausible energy?` → `about 10⁶ J`, not `10³ J`.

## 3. Category: Motion and Motion Graphs

### Category purpose

Build a signed, model-aware understanding of motion and connect equations to the slopes and areas of graphs.

### Learn

Displacement is final position minus initial position; distance is total path length. Average velocity is displacement divided by elapsed time, while average speed uses distance. For constant acceleration, use `v=v₀+at`, `Δx=v₀t+½at²`, and `v²=v₀²+2aΔx`. On a position–time graph slope is velocity; on a velocity–time graph slope is acceleration and signed area is displacement.

### Subcategories

1. Average motion and constant velocity
2. Constant acceleration and free fall
3. Projectile components
4. Motion graph interpretation

### Common misconceptions

- Treating distance and displacement, or speed and velocity, as interchangeable.
- Dropping a negative sign when motion reverses.
- Using constant-acceleration equations on unequal piecewise accelerations.
- Assuming acceleration and velocity always point the same way.
- Reading graph height when slope or area is requested.
- Treating area below the time axis as positive displacement.

### Family `average_motion`

**Skill.** Compute distance, displacement, average speed, or average velocity for a one-dimensional trip.

**Response mode.** Numeric quantity, optionally with a direction choice.

**Template.** `An object moves along the shown axis: {segments}. Find its {target}.`

**Generation and derivation.** Sum absolute segment lengths for distance and signed displacements for displacement; divide by total positive elapsed time as requested. Levels: no reversal; reversal; return/pause with contrasting speed and velocity fields.

**Constraints and rejection.** Segment endpoints and durations are explicit. Reject average speed equal to velocity magnitude in a reversal item, zero total time, or tedious more-than-four-segment paths.

**Feedback and validation.** Tabulate each signed displacement, distance, and duration. Check `distance ≥ |displacement|`.

**Examples.**

1. L1: `120 m east in 30 s` → average velocity `4 m/s east`.
2. L2: `60 m right in 20 s, then 20 m left in 10 s` → average velocity `+1.33 m/s`.
3. L3: `100 m out and 100 m back in 50 s` → speed `4 m/s`, velocity `0 m/s`.

### Family `constant_acceleration`

**Skill.** Select and rearrange a constant-acceleration relationship for one unknown.

**Response mode.** Numeric quantity with units.

**Template.** `Along {axis}, {givens}. Acceleration is constant. Find {target}.`

**Generation and derivation.** Generate a consistent latent trajectory, expose two or three independent quantities, and solve for one of `v₀,v,a,t,Δx`. Prefer construction from exact-friendly values. Levels: direct `v=v₀+at`; choose an equation; combine two relationships or select a physical quadratic root.

**Misconceptions, constraints, and rejection.** Target sign reversal, wrong `½`, and inappropriate average-velocity use. Reject negative elapsed time, ambiguous quadratic roots, and cases with hidden non-constant acceleration.

**Feedback and validation.** State the axis, write the minimal equation, substitute signed values, and cross-check using an independent equation when enough data exist.

**Examples.**

1. L1: `v₀=3 m/s, a=2 m/s², t=4 s` → `v=11 m/s`.
2. L2: `v₀=10 m/s, v=4 m/s, t=3 s` → `a=−2 m/s²`.
3. L3: `starts at 2 m/s, a=3 m/s², travels 24 m` → `v=12.17 m/s` in the forward-root instance.

### Family `free_fall`

**Skill.** Apply constant downward gravitational acceleration with a declared vertical sign convention.

**Response mode.** Numeric quantity and, when needed, direction.

**Template.** `Take upward as positive and use g={g}. {scenario}. Find {target}. Ignore air resistance.`

**Generation and derivation.** Use `a_y=-g`. Generate drops, upward throws, and comparisons at the same height. Levels: drop from rest; time/height/velocity; upward-then-downward motion.

**Misconceptions, constraints, and rejection.** Target `a=+g` despite upward-positive, zero acceleration at the top, and unequal ideal speeds at the same height. Ground-contact time is the smallest nonnegative physical root.

**Feedback and validation.** Show signed substitution and verify energy/kinematic consistency.

**Examples.**

1. L1: `Dropped for 2.0 s, g=9.8` → `v_y=−19.6 m/s`.
2. L2: `Thrown upward at 19.6 m/s` → top after `2.0 s`.
3. L3: `Thrown upward at 14 m/s from 5 m; speed just before ground` → `17.15 m/s`.

### Family `projectile_components`

**Skill.** Separate independent horizontal and vertical motion for a projectile.

**Response mode.** Numeric quantity or two named component fields.

**Template.** `A projectile is launched at {speed} at {angle} above horizontal. Use g={g}; ignore air resistance. Find {target}.`

Controlled variants include horizontal launch from a stated height and state-at-time questions.

**Generation and derivation.** Resolve `v₀x=v₀ cosθ`, `v₀y=v₀ sinθ`; use `a_x=0`, `a_y=-g`; share the same time. Levels: components; state at supplied time; range/flight time for same-height or horizontal-launch cases.

**Misconceptions, constraints, and rejection.** Target applying gravity horizontally, using total speed as vertical speed, and mixing times. State whether landing height equals launch height. Reject trajectories whose rounded discriminant creates ambiguity.

**Feedback and validation.** Draw/lists components, solve vertical time condition, then horizontal displacement. Numerically verify landing height.

**Examples.**

1. L1: `20 m/s at 30°` → `(v₀x,v₀y)=(17.32,10.0) m/s`.
2. L2: same launch after `1.0 s`, `g=9.8` → `v_y=0.2 m/s`.
3. L3: `10 m/s horizontally from 19.6 m` → flight `2.0 s`, range `20 m`.

### Family `motion_graph_slope`

**Skill.** Interpret and calculate slope on position–time or velocity–time graphs.

**Response mode.** Numeric quantity, direction, or single-choice interpretation.

**Template.** `From {t1} to {t2}, what does the slope of this {graphType} graph represent, and what is its value?`

**Generation and derivation.** Use exact piecewise-linear vertices. Compute `Δvertical/Δtime`, with units determining velocity or acceleration. Levels: positive segment; horizontal/negative segment; compare several intervals or identify a turning point.

**Misconceptions, constraints, and rejection.** Distractors use graph height, reciprocal slope, unsigned slope, or endpoint average over the wrong interval. Never infer instantaneous slope at a sharp corner.

**Feedback and validation.** Highlight rise/run and connect units. Graph model and accessibility text must give identical vertices.

**Examples.**

1. L1: position rises `2→10 m` over `1→5 s` → `+2 m/s`.
2. L2: velocity falls `6→−2 m/s` over `0→4 s` → `−2 m/s²`.
3. L3: choose the interval with greatest speed on a piecewise `x-t` graph → interval with greatest absolute slope.

### Family `motion_graph_area`

**Skill.** Interpret signed area on velocity–time and acceleration–time graphs.

**Response mode.** Numeric quantity, optionally multiple named fields.

**Template.** `Find the {displacementOrVelocityChange} represented from {t1} to {t2} on the graph.`

**Generation and derivation.** Sum signed rectangle/triangle/trapezoid areas of exact linear segments. For acceleration graphs, add area to supplied initial velocity. Levels: one rectangle; triangle/trapezoid; regions crossing the axis with displacement versus distance contrast.

**Misconceptions, constraints, and rejection.** Target using slope, ignoring negative area, and confusing displacement with distance. Reject curved quantitative areas and excessive segment counting.

**Feedback and validation.** Shade positive/negative regions separately and show their signed sum. Independently integrate the piecewise-linear model.

**Examples.**

1. L1: `v=3 m/s for 4 s` → displacement `12 m`.
2. L2: velocity rises linearly `0→8 m/s` over `4 s` → `16 m`.
3. L3: `+4 m/s for 3 s`, then `−2 m/s for 2 s` → displacement `8 m`, distance `16 m`.

## 4. Category: Forces, Equilibrium, and Circular Motion

### Category purpose

Train selection of a system and axes, translation from interaction descriptions to free-body forces, and use of net force rather than isolated formula matching.

### Learn

For an object of constant mass, `ΣF=ma`. Forces describe interactions: weight, normal, tension, friction, spring, and applied forces. Newton's third-law partners act on different objects. Equilibrium means zero net force, not “no forces.” In uniform circular motion, acceleration and net force point toward the center.

### Subcategories

1. Force identification and Newton's second law
2. Contact forces and inclines
3. Equilibrium
4. Uniform circular motion

### Common misconceptions

- Treating motion direction as proof of net-force direction.
- Adding a separate `ma` or “centripetal force” arrow.
- Pairing weight and normal as a Newton's-third-law pair.
- Assuming `N=mg` on every surface.
- Always setting static friction to `μ_sN`.
- Treating equal-and-opposite forces on one object as a third-law pair.

### Family `free_body_model`

**Skill.** Identify all external forces on a declared system and their directions.

**Response mode.** Multiple-choice diagram or matching force-to-direction.

**Template.** `For the system {system}, under the stated conditions, which free-body diagram is correct?`

**Generation and derivation.** Build the scene from a reviewed interaction graph, then include exactly the forces crossing the system boundary. Levels: one contact; applied/tension/friction; alternate system boundaries or accelerating motion.

**Distractors and rejection.** Distractors add motion/`ma` forces, omit weight/contact, reverse friction, or include internal forces. Reject ambiguous contact/slip states and diagrams differing only cosmetically.

**Feedback and validation.** Name the agent causing each force and why excluded forces do not cross the boundary. Validate choices structurally against the interaction graph.

**Examples.**

1. L1: book resting on table → weight down, normal up.
2. L2: crate sliding right while slowing → weight down, normal up, kinetic friction left.
3. L3: two blocks treated as one system pulled by an external rope → omit their mutual contact force.

### Family `newtons_second_law`

**Skill.** Find net force, acceleration, mass, or one force component from `ΣF=ma`.

**Response mode.** Signed numeric quantity or named components.

**Template.** `For {object}, the forces along {axis} are {forces}. Find {target}.`

**Generation and derivation.** Sum signed force components and solve `ΣF=ma`. Levels: collinear forces; resolve one angled force; two-axis component equations.

**Misconceptions, constraints, and rejection.** Target sum-of-magnitudes, force/acceleration sign confusion, and using weight as mass. Use friendly trig at early levels and reject near-zero residuals unless equilibrium is the point.

**Feedback and validation.** Show axis, signed force sum, and dimensional check. Independently compare vector sum with `m a`.

**Examples.**

1. L1: `10 N right, 4 N left, m=2 kg` → `a=+3 m/s²`.
2. L2: `m=5 kg, a=−2 m/s², one force +3 N` → other force `−13 N`.
3. L3: `20 N at 60° above +x and 4 N left, m=2 kg` → `a_x=3 m/s²`.

### Family `friction_and_normal`

**Skill.** Determine normal/friction forces and whether static equilibrium is possible.

**Response mode.** Numeric quantity plus state choice (`static`/`sliding`).

**Template.** `{contact scenario}; μs={muS}{optionalMuK}. Find the friction force and determine whether the object remains at rest.`

**Generation and derivation.** First solve the normal force, then required static friction. Compare `|f_required|` with `μ_sN`; if exceeded and sliding is declared, use `μ_kN`. Levels: horizontal surface; angled applied force altering `N`; threshold/state decision.

**Misconceptions, constraints, and rejection.** Target `f_s=μ_sN` always, wrong friction direction, and `N=mg` despite vertical applied component. Avoid situations requiring deformation/contact subtleties.

**Feedback and validation.** Show required versus maximum static friction before selecting state. Check non-negative contact normal.

**Examples.**

1. L1: `N=100 N, μs=0.4, required 25 N` → `f_s=25 N`, static.
2. L2: `m=10 kg, horizontal pull 50 N, μs=0.3, g=9.8` → max `29.4 N`, cannot remain static.
3. L3: upward-angled pull reduces `N`; compute `N` before the friction limit.

### Family `inclined_plane`

**Skill.** Resolve weight parallel/perpendicular to a slope and analyze acceleration or equilibrium.

**Response mode.** Numeric quantity or named component fields.

**Template.** `A {mass} object is on a {angle}° incline. {surface model}. Use g={g}. Find {target}.`

**Generation and derivation.** Choose axes along/perpendicular to plane. Weight components are `mg sinθ` down-slope and `mg cosθ` into plane. Add friction/tension only when stated. Levels: components/normal; frictionless acceleration; friction or applied force.

**Misconceptions, constraints, and rejection.** Target swapped sine/cosine, using full `mg` along slope, and wrong friction direction. Reject angles too close to `0°/90°` except diagnostic limiting cases.

**Feedback and validation.** Show the component triangle and signed along-slope equation.

**Examples.**

1. L1: `2 kg, 30°, g=9.8` → downhill weight component `9.8 N`.
2. L2: same frictionless slope → acceleration `4.9 m/s²` downhill.
3. L3: `μk=0.20` → `a=g(sin30°−0.20cos30°)=3.20 m/s²`.

### Family `force_equilibrium`

**Skill.** Solve one- or two-axis translational equilibrium for an unknown force/tension.

**Response mode.** Numeric quantity or two named fields.

**Template.** `{object or junction} is in static equilibrium under {forces}. Find {unknown}.`

**Generation and derivation.** Apply `ΣF_x=0` and `ΣF_y=0`. Generate backward from a valid equilibrium so all tensions are non-negative. Levels: one axis; symmetric two-rope support; asymmetric components with one/two unknowns.

**Misconceptions, constraints, and rejection.** Target equal tension assumptions without symmetry, sum-of-magnitudes, and angle-from-horizontal/vertical confusion. Reject underdetermined systems or nearly singular angles.

**Feedback and validation.** Resolve forces and show both component sums. Independently check residual force below numeric tolerance.

**Examples.**

1. L1: `8 N right; equilibrium force?` → `8 N left`.
2. L2: `100 N load, two identical vertical components at 30° above horizontal` → each tension `100 N`.
3. L3: asymmetric cable angles → solve the displayed two-equation system and verify both residuals zero.

### Family `uniform_circular_motion`

**Skill.** Relate speed, radius, period, inward acceleration, and the real forces supplying it.

**Response mode.** Numeric quantity or single-choice direction/force source.

**Template.** `{object} moves uniformly in a circle of radius {r} with {speedOrPeriod}. Find {target}.`

**Generation and derivation.** Use `v=2πr/T`, `a_c=v²/r`, and `F_net,in=mv²/r`. Levels: one relation; chained period/speed/force; identify which listed real force(s) supply the inward net force.

**Misconceptions, constraints, and rejection.** Target outward acceleration, constant-velocity confusion, and adding “centripetal force.” Do not use banking/conical pendulums initially.

**Feedback and validation.** Show inward direction separately from magnitude and name the interaction supplying net force.

**Examples.**

1. L1: `v=6 m/s, r=3 m` → `a_c=12 m/s²` inward.
2. L2: `m=2 kg` for the same motion → inward net force `24 N`.
3. L3: `r=0.5 m, period=1.0 s, m=0.2 kg` → `F=3.95 N` inward.

## 5. Category: Energy, Momentum, and Torque

### Category purpose

Train system-based alternatives to step-by-step force analysis and distinguish conserved quantities from superficially similar ones.

### Learn

Work by a constant force is `W=Fd cosθ`; net work changes kinetic energy `K=½mv²`. Near Earth, gravitational potential energy changes by `mgΔy`. Power is energy transferred per time. Impulse `J=F_avgΔt` changes momentum `p=mv`. Momentum is conserved for an isolated system, while kinetic energy is conserved only in an elastic collision. Torque measures turning effect: `τ=rF sinθ`.

### Subcategories

1. Work, energy, and power
2. Impulse and one-dimensional collisions
3. Torque and rotational equilibrium

### Common misconceptions

- Using total force instead of its displacement-parallel component for work.
- Treating energy as a vector or confusing power with energy.
- Conserving mechanical energy despite stated friction/work.
- Conserving kinetic energy in every collision.
- Using speed rather than signed velocity in momentum.
- Ignoring perpendicular lever arm in torque.

### Family `work_and_force_graph`

**Skill.** Calculate work from a constant force/angle or signed area under a force–position graph.

**Response mode.** Numeric energy.

**Template.** `A force {description} acts while the object moves {displacement}. How much work does this force do?`

Graph variant: `Find the work from x={x1} to x={x2} from the Fₓ–x graph.`

**Generation and derivation.** Use `Fd cosθ` or signed rectangle/triangle/trapezoid areas. Levels: parallel/perpendicular; angled force; piecewise-linear graph including negative work.

**Misconceptions, constraints, and rejection.** Target omitting cosine, using sine, and unsigned graph area. Explicitly define angle between force and displacement.

**Feedback and validation.** Show dot-product/component reasoning. Independently integrate graph segments.

**Examples.**

1. L1: `12 N along 3 m` → `36 J`.
2. L2: `20 N at 60° to 5 m displacement` → `50 J`.
3. L3: `Fₓ rises 0→8 N across 4 m` → `16 J`.

### Family `mechanical_energy`

**Skill.** Use an explicitly declared energy system to relate speed, height, spring energy, and non-conservative work.

**Response mode.** Numeric quantity.

**Template.** `For the system {system}, {initial state} becomes {final state}. {transfer assumptions}. Find {target}.`

**Generation and derivation.** Use `K_i+U_i+W_external/nonconservative=K_f+U_f`; permitted potentials are `mgy` and `½kx²`. Levels: gravitational conversion; spring/gravity; include one stated frictional/external work term.

**Misconceptions, constraints, and rejection.** Target conserving energy for the wrong system, dropping initial kinetic energy, and using path length as height. Construct non-negative kinetic energies and reject impossible final states unless “is it reachable?” is asked.

**Feedback and validation.** Name system and transfers before algebra; cross-check energy balance.

**Examples.**

1. L1: dropped through `5 m`, `g=9.8` → speed `9.90 m/s`.
2. L2: `m=2 kg`, `v=4 m/s`, rises `0.5 m` → final speed `2.49 m/s`.
3. L3: initial `50 J`, gains `20 J` potential, loses `8 J` to friction → final kinetic `22 J`.

### Family `power_efficiency`

**Skill.** Relate energy/work, time, power, and efficiency without conflating them.

**Response mode.** Numeric quantity or percentage.

**Template.** `{device/person} transfers {energyOrWork} in {time}. Find {powerOrEfficiencyOrInput}.`

**Generation and derivation.** Use `P=ΔE/Δt` and `η=useful output/input`; optionally `P=Fv` only for force parallel to constant velocity. Levels: direct power; efficiency; two-step input/output comparison.

**Misconceptions, constraints, and rejection.** Target multiplying energy by time, efficiency above 100%, and percent/fraction confusion. All transfer boundaries must be named.

**Feedback and validation.** Draw an input/useful/waste balance and check `0≤η≤1`.

**Examples.**

1. L1: `600 J in 3 s` → `200 W`.
2. L2: `500 J input, 350 J useful` → `70%`.
3. L3: `2.0 kW input at 80% for 5 min` → useful energy `480 kJ`.

### Family `impulse_momentum`

**Skill.** Connect signed impulse, force–time area, and momentum change.

**Response mode.** Numeric quantity with direction.

**Template.** `{mass} object changes velocity from {vi} to {vf}. Find {impulseOrAverageForce}.`

Graph variant: `Find the impulse represented by the F–t graph.`

**Generation and derivation.** Compute `J=Δp=m(v_f-v_i)` or signed graph area, then `F_avg=J/Δt`. Levels: no reversal; reversal; piecewise force graph or missing velocity.

**Misconceptions, constraints, and rejection.** Target `m(v_f+v_i)`, using speeds unsigned, and peak rather than average force. Axis direction must be visible.

**Feedback and validation.** Show initial/final signed momentum and graph-area cross-check.

**Examples.**

1. L1: `2 kg, 1→4 m/s` → `J=+6 N·s`.
2. L2: `0.5 kg, +6→−2 m/s in 0.2 s` → `F_avg=−20 N`.
3. L3: triangular pulse `0→10→0 N` over `0.4 s` → `J=2 N·s`.

### Family `one_dimensional_collision`

**Skill.** Apply signed momentum conservation and, only when stated, collision-type information.

**Response mode.** Numeric final velocity/velocities or collision classification.

**Template.** `On a frictionless line, {initial bodies}. During the brief collision the two-body system is isolated. {collision condition}. Find {target}.`

**Generation and derivation.** Always use `Σp_i=Σp_f`. For perfectly inelastic cases, final velocities are equal. For elastic cases, use momentum plus kinetic-energy conservation, restricted to generated friendly solutions. Levels: stick together; one missing velocity; classify kinetic-energy change or simple elastic collision.

**Misconceptions, constraints, and rejection.** Target conserving each body's momentum, averaging velocities without mass, and conserving kinetic energy when not stated. Reject underdetermined general collisions.

**Feedback and validation.** Show signed momentum table; compare initial/final kinetic energy as a check, not an assumed conservation unless elastic.

**Examples.**

1. L1: `1 kg at +4 m/s sticks to 1 kg at rest` → `+2 m/s`.
2. L2: `2 kg at +3` sticks to `1 kg at −3` → `+1 m/s`.
3. L3: equal masses, one stationary, ideal elastic head-on → velocities exchange.

### Family `torque_equilibrium`

**Skill.** Calculate torque and balance clockwise/counterclockwise moments about a chosen pivot.

**Response mode.** Signed torque or numeric force/distance.

**Template.** `About pivot {pivot}, {forces and lever arms}. Find {target}. Take counterclockwise as positive.`

**Generation and derivation.** Use perpendicular distance or `rF sinθ`; sum signed torques. Levels: perpendicular single force; balance two moments; angled force with an irrelevant pivot force.

**Misconceptions, constraints, and rejection.** Target using full radius for nonperpendicular force, losing rotation sign, and including a force through the pivot. Reject unstable/physical-support claims; ask only algebraic rotational equilibrium.

**Feedback and validation.** Mark lever arms and rotation sense; verify `Στ=0` for equilibrium.

**Examples.**

1. L1: `10 N perpendicular at 0.30 m, CCW` → `+3.0 N·m`.
2. L2: `20 N at 0.20 m` balances force at `0.50 m` → `8 N`.
3. L3: `12 N at r=0.40 m and 30° to the lever` → `2.4 N·m` magnitude.

## 6. Category: Waves, Sound, and Geometric Optics

### Category purpose

Train periodic-quantity relationships, extraction of wave information from spatial/temporal representations, and rule-based ray reasoning.

### Learn

For a periodic wave, `f=1/T` and `v=fλ`. Amplitude is measured from equilibrium, not crest to trough. Sound-level differences use a logarithm of intensity ratio. Reflection angles are equal about the normal, and refraction obeys `n₁sinθ₁=n₂sinθ₂`. For the declared thin-lens convention, `1/f=1/d_o+1/d_i` and `m=-d_i/d_o`.

### Normative optics sign convention

- Real objects have `d_o>0`.
- Converging lenses have `f>0`; diverging lenses have `f<0`.
- Real images on the far side have `d_i>0`; virtual images on the object side have `d_i<0`.
- `m=h_i/h_o=-d_i/d_o`; negative magnification is inverted, positive is upright.
- Questions must show this convention in Learn/help and repeat it when sign is assessed.

### Subcategories

1. Wave relationships and representations
2. Standing waves and sound level
3. Reflection, refraction, and thin lenses

### Common misconceptions

- Confusing period with frequency or amplitude with wavelength.
- Reading crest-to-trough height as amplitude.
- Assuming frequency changes when a wave enters a new medium.
- Treating decibels as a linear ratio.
- Measuring optical angles from the surface.
- Assuming every converging lens makes a real magnified image.

### Family `wave_relationship`

**Skill.** Solve `v=fλ` and `T=1/f` with units and medium assumptions.

**Response mode.** Numeric quantity.

**Template.** `A periodic wave has {two givens}. Find {target}.`

**Generation and derivation.** Solve one relationship or chain both. Levels: `f↔T`; one missing in `v=fλ`; medium change with frequency fixed by source.

**Misconceptions, constraints, and rejection.** Target multiply/divide inversion and incorrect frequency change across boundary. Avoid simultaneous unknowns and impractical scales without prefixes.

**Feedback and validation.** Show unit cancellation and inverse/trend check.

**Examples.**

1. L1: `f=5 Hz` → `T=0.20 s`.
2. L2: `f=400 Hz, λ=0.85 m` → `v=340 m/s`.
3. L3: same `500 Hz` source enters medium where `v=1500 m/s` → `λ=3.0 m`.

### Family `wave_graph_parameters`

**Skill.** Read amplitude, wavelength, period, frequency, or phase position from an exact wave graph.

**Response mode.** Numeric quantity or matching.

**Template.** `The graph shows {quantity} versus {axis}. Find {target}.`

**Generation and derivation.** Spatial snapshots yield amplitude/wavelength; time traces yield amplitude/period/frequency. Use annotated sinusoidal landmarks on ticks. Levels: direct landmark; distinguish spatial/time graph; compare two waves.

**Misconceptions, constraints, and rejection.** Target peak-to-peak as amplitude, adjacent zero crossings as full wavelength, and spatial graph as trajectory. Reject pixel-measurement dependence.

**Feedback and validation.** Mark equilibrium-to-crest and same-phase points. Verify displayed vertices against semantic parameters.

**Examples.**

1. L1: crest `+3 cm`, equilibrium `0` → amplitude `3 cm`.
2. L2: crests at `x=1 m` and `x=5 m` → wavelength `4 m`.
3. L3: time crests `0.2 s` apart → period `0.2 s`, frequency `5 Hz`.

### Family `standing_wave_modes`

**Skill.** Relate length, boundary conditions, harmonic number, wavelength, and frequency.

**Response mode.** Numeric quantity or single-choice mode diagram.

**Template.** `A {systemType} of length {L} supports standing waves. For mode {n}, find {target}. Wave speed is {v}.`

**Generation and derivation.** String/fixed-fixed and open-open pipe: `λ_n=2L/n`. Closed-open pipe: only odd `n=1,3,5...` with `λ_n=4L/n`. State whether `n` denotes harmonic number. Levels: fundamental; higher allowed mode; choose diagram from nodes/antinodes.

**Misconceptions, constraints, and rejection.** Target half/full-wavelength confusion and permitting even closed-open harmonics. Keep end correction excluded.

**Feedback and validation.** Draw node/antinode pattern and count fractions of a wavelength.

**Examples.**

1. L1: fixed string `L=1 m`, fundamental → `λ=2 m`.
2. L2: same string, `v=100 m/s`, second harmonic → `f=100 Hz`.
3. L3: closed-open pipe `L=0.85 m`, `v=340 m/s`, third harmonic → `300 Hz`.

### Family `sound_level_ratio`

**Skill.** Convert between sound-intensity ratio and decibel difference.

**Response mode.** Numeric decibels or ratio.

**Template.** `Sound B has intensity {ratio} times sound A. What is βB−βA?`

Inverse variant: `A level increase of {dB} dB corresponds to what intensity ratio?`

**Generation and derivation.** Use `Δβ=10log₁₀(I_B/I_A)` and inverse `10^(Δβ/10)`. Level 1 uses powers of ten; later levels use calculator-friendly nonpowers and inverse questions. Amplitude ratios are excluded unless the prompt explicitly gives the same-medium square relationship and uses `20log₁₀`.

**Misconceptions, constraints, and rejection.** Target linear dB arithmetic and factor `20` confusion. Ratios must be positive.

**Feedback and validation.** State logarithmic relationship and direction; inverse-compute the ratio.

**Examples.**

1. L1: intensity ratio `10` → `+10 dB`.
2. L2: ratio `1000` → `+30 dB`.
3. L3: `+6 dB` → intensity ratio `3.98`.

### Family `reflection_refraction`

**Skill.** Apply the normal-based angle convention and Snell's law, including total internal reflection checks.

**Response mode.** Numeric angle or single-choice ray.

**Template.** `A ray travels from n₁={n1} to n₂={n2} at θ₁={theta1} from the normal. Find {target}.`

**Generation and derivation.** Reflection: `θ_r=θ_i`. Refraction: solve Snell's law. For `n₁>n₂`, compare with `θ_c=asin(n₂/n₁)` before solving. Levels: reflection; refraction; critical angle/TIR classification.

**Misconceptions, constraints, and rejection.** Target measuring from surface, bending the wrong way, and arcsine of an impossible value without recognizing TIR. Avoid rounded values close to the critical boundary.

**Feedback and validation.** Show normal, Snell substitution, and qualitative toward/away-from-normal check.

**Examples.**

1. L1: incidence `35°` → reflection `35°`.
2. L2: air `1.00` to glass `1.50` at `30°` → refraction `19.5°`.
3. L3: glass `1.50` to air at `50°` → total internal reflection.

### Family `thin_lens_image`

**Skill.** Use the declared sign convention to find image distance, magnification, size, and orientation.

**Response mode.** Numeric quantity plus categorical image properties.

**Template.** `Using the displayed thin-lens sign convention, f={f}, dₒ={do}{optionalHeight}. Find {target}.`

**Generation and derivation.** Solve `1/d_i=1/f−1/d_o`, then `m=-d_i/d_o` and `h_i=mh_o`. Levels: real image distance; magnification/orientation; virtual/diverging or inside-focal-length cases.

**Misconceptions, constraints, and rejection.** Target sign loss, inverse arithmetic, and “negative height means impossible.” Reject `d_o≈f` producing impractically huge/undefined image distance unless infinity is explicitly the conceptual answer.

**Feedback and validation.** Show reciprocal arithmetic, interpret signs, and compare with a semantic principal-ray diagram.

**Examples.**

1. L1: `f=10 cm, dₒ=30 cm` → `d_i=15 cm`.
2. L2: same with `hₒ=4 cm` → `m=−0.5`, `h_i=−2 cm`, real/inverted.
3. L3: `f=10 cm, dₒ=6 cm` → `d_i=−15 cm`, virtual/upright, `m=+2.5`.

## 7. Category: Thermal Physics and Fluids

### Category purpose

Train distinctions among temperature, internal-energy transfer, state change, pressure, and buoyant force using explicit material models.

### Learn

Temperature is not energy. Without phase change, a supplied constant specific heat gives `Q=mcΔT`; during an idealized phase change, `Q=mL` while temperature stays constant. Ideal-gas calculations use kelvin. Pressure is force per area; in a static fluid it changes by `ρgΔh`. Buoyant force equals the weight of displaced fluid.

### Subcategories

1. Temperature and heat transfer
2. Phase change and ideal gases
3. Density, pressure, and buoyancy

### Common misconceptions

- Treating Celsius as an absolute scale in ratios or gas laws.
- Confusing heat, temperature, and specific heat.
- Changing temperature during an idealized phase plateau.
- Using object density instead of fluid density for buoyant force.
- Using total depth rather than depth difference for pressure difference.
- Confusing pressure with total force.

### Family `temperature_and_heating`

**Skill.** Convert temperature scales where needed and calculate `Q=mcΔT`.

**Response mode.** Numeric temperature, temperature change, or energy.

**Template.** `{mass} of {material} with c={c} changes from {Ti} to {Tf}. Find {target}; neglect phase change and losses.`

**Generation and derivation.** Convert absolute temperatures with `T_K=T_°C+273.15`; compute the interval then `Q=mcΔT`. Sign may represent energy into the named system. Levels: conversion/ΔT; direct heating; missing mass/final temperature.

**Misconceptions, constraints, and rejection.** Target adding `273.15` to a temperature difference, confusing grams/kilograms, and dropping heat sign. Material constants are always supplied.

**Feedback and validation.** Show temperature interval and units `J/(kg·K)`. Reverse-check the final temperature.

**Examples.**

1. L1: `20.0°C` → `293.15 K`.
2. L2: `0.50 kg`, `c=4200 J/(kg·K)`, `20→30°C` → `21 kJ`.
3. L3: `10 kJ` removed from `2 kg`, `c=500` → `ΔT=−10 K`.

### Family `phase_change_energy`

**Skill.** Calculate energy through heating/cooling segments and idealized phase changes.

**Response mode.** Numeric energy or final-state choice.

**Template.** `{mass} of {substance} undergoes {temperature/state path}. Given {c and L values}, find {target}.`

**Generation and derivation.** Partition path into `mcΔT` segments and `mL` plateaus, sum signed energy. Levels: one phase change; heat then phase change; determine whether supplied energy completes a phase change and the remaining fraction.

**Misconceptions, constraints, and rejection.** Target using `mcΔT` on a plateau, omitting a path segment, or changing all mass when energy is insufficient. Constants and transition temperatures are supplied.

**Feedback and validation.** Display a segment ledger and optional heating-curve marker. Energy sum and mass fraction must satisfy bounds.

**Examples.**

1. L1: melt `0.20 kg` with `L=334 kJ/kg` → `66.8 kJ`.
2. L2: heat then melt → sum the supplied sensible and latent terms.
3. L3: `33.4 kJ` supplied to `0.20 kg` at melting point → `0.10 kg` melts.

### Family `ideal_gas_state`

**Skill.** Use `PV=nRT` or ratios between two fixed-amount ideal-gas states.

**Response mode.** Numeric pressure, volume, amount, or absolute temperature.

**Template.** `An ideal gas {state description}. Given R={R}, find {target}.`

**Generation and derivation.** Convert all values to compatible units and kelvin. Use direct law or `P₁V₁/T₁=P₂V₂/T₂` for fixed `n`. Levels: one state; one-variable two-state change; combined change.

**Misconceptions, constraints, and rejection.** Target Celsius ratios, holding an unstated variable fixed, and kPa/Pa or L/m³ errors. All states have positive absolute temperature, volume, pressure, and amount.

**Feedback and validation.** List what is fixed, normalize units, and substitute. Check proportional trend.

**Examples.**

1. L1: fixed volume, `300→600 K` → pressure doubles.
2. L2: fixed temperature, volume doubles → pressure halves.
3. L3: `P₁=100 kPa, V₁=2 L, T₁=300 K; V₂=1 L, T₂=450 K` → `P₂=300 kPa`.

### Family `density_pressure`

**Skill.** Relate density, mass, volume, pressure, force, and area.

**Response mode.** Numeric quantity.

**Template.** `{scenario with two of density/mass/volume or pressure/force/area}. Find {target}.`

**Generation and derivation.** Use `ρ=m/V` or average normal pressure `P=F/A`. Levels: direct; compound-unit conversion; compare same force/different areas or infer one dimension of a rectangular face.

**Misconceptions, constraints, and rejection.** Target inverted ratios, area/length confusion, and pressure as total force. Shapes and contact assumptions must be explicit.

**Feedback and validation.** Show quotient with dimensions and qualitative inverse relationship.

**Examples.**

1. L1: `6 kg in 0.003 m³` → `2000 kg/m³`.
2. L2: `500 N over 0.020 m²` → `25 kPa`.
3. L3: same force on half the area → twice the average pressure.

### Family `hydrostatic_pressure`

**Skill.** Calculate pressure differences in a static uniform fluid.

**Response mode.** Numeric pressure.

**Template.** `In a static fluid of density {rho}, points differ in depth by {dh}. Use g={g}. Find {pressure difference or absolute pressure}.`

**Generation and derivation.** Use `ΔP=ρgΔh`; add supplied surface pressure only for absolute pressure. Levels: pressure difference; absolute/gauge distinction; compare layers with piecewise densities.

**Misconceptions, constraints, and rejection.** Target using container width, total depth instead of difference, and omitting/adding atmospheric pressure incorrectly. No accelerating containers or capillary effects.

**Feedback and validation.** Show vertical depth path and pressure contributions per layer.

**Examples.**

1. L1: water `ρ=1000`, depth `2 m`, `g=9.8` → gauge `19.6 kPa`.
2. L2: surface `101 kPa` plus `19.6 kPa` → absolute `120.6 kPa`.
3. L3: `1 m` oil plus `2 m` water → sum `ρ_i g h_i`.

### Family `buoyancy`

**Skill.** Use displaced-fluid volume to find buoyant force and floating fraction.

**Response mode.** Numeric force, volume/fraction, or sink/float choice.

**Template.** `{object} displaces {volume} of fluid with density {rhoFluid}. Use g={g}. Find {target}.`

**Generation and derivation.** `F_B=ρ_fluid gV_displaced`. For floating equilibrium, `F_B=mg`; fraction submerged is `ρ_object/ρ_fluid` for a uniform object. Levels: fully submerged force; apparent force/equilibrium; floating fraction or sink/float.

**Misconceptions, constraints, and rejection.** Target object density in Archimedes force, total object volume when partially submerged, and buoyant force always equaling weight. Do not infer stability/orientation.

**Feedback and validation.** Identify displaced volume and compare buoyant force with weight under stated support/acceleration.

**Examples.**

1. L1: `0.002 m³` in water, `g=9.8` → `19.6 N`.
2. L2: `30 N` weight and `20 N` buoyancy while held → additional upward support `10 N`.
3. L3: object density `750 kg/m³` floating in water → `75%` submerged.

## 8. Category: Electricity and Magnetism Foundations

### Category purpose

Develop physical meaning for charge, current, potential, fields, and magnetic force without duplicating network/electronics analysis.

### Boundary with Electric Circuits

This category may use a single current path or device solely to connect `Q`, `I`, `V`, `E`, and `P`. Series/parallel reduction, KCL/KVL, RC/RL behavior, AC, component models, meters, and circuit design belong in **Electric Circuits**. Cross-links should offer that app after mastery rather than reproducing its question bank.

### Learn

Current is charge flow rate, `I=ΔQ/Δt`. Voltage is energy transferred per charge, `V=ΔE/q`. A point charge creates an electric field, and another charge experiences `F=qE`. Electric power can be written `P=IV`. A moving charge in a magnetic field feels `F=qvB sinθ`, perpendicular to both velocity and field, with direction reversed for negative charge.

### Subcategories

1. Charge, current, voltage, and energy
2. Electrostatic force, field, and potential
3. Magnetic force and direction

### Common misconceptions

- Believing current is “used up.”
- Confusing charge with current or voltage with energy.
- Ignoring the sign of a source/test charge in field versus force direction.
- Adding electric field magnitudes without vector direction.
- Applying inverse-square behavior as inverse distance.
- Predicting magnetic force along the magnetic field or velocity.

### Family `charge_current_time`

**Skill.** Relate transferred charge, average current, time, and elementary-charge count.

**Response mode.** Numeric quantity or integer count.

**Template.** `{charge/current transfer description}. Find {target}.`

**Generation and derivation.** Use `I=ΔQ/Δt`; for counts use `N=|Q|/e` with supplied `e`. Levels: direct; prefixes/time conversion; electron count or signed conventional-current interpretation.

**Misconceptions, constraints, and rejection.** Target charge/current unit confusion, minute/second error, and electron-flow versus conventional-current direction. Count questions are constructed from or rounded according to explicit wording.

**Feedback and validation.** Show unit cancellation and distinguish carrier direction from conventional current.

**Examples.**

1. L1: `6 C in 3 s` → `2 A`.
2. L2: `20 mA for 5 min` → `6 C`.
3. L3: `3.204×10⁻¹⁹ C` magnitude with supplied `e=1.602×10⁻¹⁹ C` → `2 electrons`.

### Family `electric_energy_power`

**Skill.** Relate voltage, charge, energy, current, power, and time in a one-element energy transfer.

**Response mode.** Numeric quantity.

**Template.** `{element/source} transfers {givens}. Find {energy, voltage, power, or time}.`

**Generation and derivation.** Use `ΔE=qV`, `P=IV`, and `ΔE=Pt` with explicitly named energy direction; sign is included only when polarity/passive convention is shown. Levels: one relation; two-step; compare energy or billing-style `kWh↔J` conversion.

**Misconceptions, constraints, and rejection.** Target voltage-as-energy, multiplying when division is needed, and `kW/kWh` confusion. Network analysis is forbidden.

**Feedback and validation.** Name energy per charge and/or rate, then cross-check dimensions.

**Examples.**

1. L1: `3 C through 12 V rise` → energy increase `36 J`.
2. L2: `2 A at 6 V` → power `12 W`.
3. L3: `60 W for 5 min` → energy `18 kJ`.

### Family `coulomb_force_field`

**Skill.** Calculate and direct electric force/field for one source or a simple collinear superposition.

**Response mode.** Numeric magnitude plus direction.

**Template.** `Point charge(s) {configuration}. Use kₑ={ke}. Find {fieldOrForce} at {point}.`

**Generation and derivation.** One source: `E=k_e|Q|/r²`, direction away from positive/toward negative; `F=q_testE`. Advanced collinear items add signed field components from at most two sources. Levels: magnitude; sign/direction; two-source superposition or force on signed test charge.

**Misconceptions, constraints, and rejection.** Target inverse distance, force/field confusion, and direction based only on source or only on test charge. Reject points on charges, near-perfect cancellation after rounding, and arbitrary 2D trig.

**Feedback and validation.** Draw component arrows before adding; check inverse-square scaling and Newton's-third-law magnitude where applicable.

**Examples.**

1. L1: supplied `kₑ`, `Q=+2 µC`, `r=3 m` → `E≈1998 N/C` away.
2. L2: `q_test=−1 µC` in `+2000 N/C` rightward field → force `0.002 N` left.
3. L3: two collinear sources → compute signed contributions separately, then sum.

### Family `electric_potential`

**Skill.** Relate electric potential, potential energy, work, and point-charge potential.

**Response mode.** Numeric voltage, energy, or work.

**Template.** `{charge} moves through a potential difference {deltaV}, or a point charge creates potential at {r}. Find {target}.`

**Generation and derivation.** Use `ΔU=qΔV`; external quasistatic work equals `ΔU`, electric-field work equals `−ΔU`. For one point charge, `V=k_eQ/r` relative to infinity. Levels: energy per charge; signed charge through ΔV; point potential/comparison.

**Misconceptions, constraints, and rejection.** Target ignoring charge sign, confusing field/potential direction, and inverse-square potential. The actor doing work must be named.

**Feedback and validation.** Track signs in a small energy ledger and check voltage dimension `J/C`.

**Examples.**

1. L1: `2 C` through `+5 V` → `ΔU=+10 J`.
2. L2: `−3 µC` through `+12 V` → `ΔU=−36 µJ`.
3. L3: point charge potential doubles when distance halves, not quadruples.

### Family `magnetic_force`

**Skill.** Find magnetic-force magnitude and direction for a moving point charge.

**Response mode.** Numeric magnitude plus semantic direction.

**Template.** `A {chargeSign} charge {q} moves {velocityDirection} at {v} through uniform B={B} directed {fieldDirection}. Find the magnetic force.`

**Generation and derivation.** Magnitude `|q|vB sinθ`. Direction is `v×B` for positive charge and reversed for negative charge. Levels: perpendicular magnitude; zero/angled magnitude; page-direction or sign reversal.

**Misconceptions, constraints, and rejection.** Target force parallel to field, omitting sine, and failing to reverse negative charge. Use axis-aligned directions at direction levels; never require an ambiguous hand-drawn perspective.

**Feedback and validation.** Compute cross product from explicit basis vectors, then apply charge sign. Verify force perpendicular to both vectors and zero for parallel motion.

**Examples.**

1. L1: `q=2 µC, v=3 m/s, B=0.5 T`, perpendicular → `3 µN`.
2. L2: velocity parallel to field → `0 N`.
3. L3: positive charge moves right with field up → force out of page; a negative charge would be into page.

## 9. Category: Data, Graphs, and Model Choice

### Category purpose

Train the habits that connect calculations to evidence: extract a physical relationship from data, interpret slope/intercept with units, and decide whether a simple model is supported.

### Learn

A model states how quantities relate under assumptions. A straight graph has a slope with physical units and may have a meaningful intercept. Scatter and measurement intervals matter: data need not land exactly on a model. A useful conclusion states what the data support, not more.

### Subcategories

1. Proportional relationships
2. Slope/intercept interpretation
3. Model and residual checks

### Common misconceptions

- Calling every increasing relationship “directly proportional.”
- Ignoring a nonzero intercept.
- Reporting slope without units or inverting axes.
- Selecting a model from one point.
- Treating small rounding scatter as proof a model is false.
- Extrapolating far beyond the generated data range.

### Family `proportional_relationship`

**Skill.** Identify direct, inverse, square, or inverse-square relationships from a generated table or paired comparisons.

**Response mode.** Single-choice model or numeric prediction.

**Template.** `Which relationship best matches the exact/rounded data table for {x} and {y}?`

Variant: `Assuming the stated relationship, predict y when x={newX}.`

**Generation and derivation.** Generate from `y=kx`, `k/x`, `kx²`, or `k/x²`, then optionally round within declared resolution. Levels: exact distinguishing ratios; include scale factor; modest rounded data and prediction within range.

**Distractors, constraints, and rejection.** Distractors correspond to the other candidate exponents. Reject ranges where two models are indistinguishable at displayed precision or where intercept behavior is required.

**Feedback and validation.** Compare invariant quantities `y/x`, `xy`, `y/x²`, `yx²`.

**Examples.**

1. L1: doubling `x` doubles `y` throughout → direct.
2. L2: doubling distance makes measured value one quarter → inverse-square.
3. L3: infer `k` from one row and predict a held-out in-range row.

### Family `graph_slope_intercept`

**Skill.** Calculate a best-defined straight-line slope/intercept and interpret their physical meaning and units.

**Response mode.** Numeric slope/intercept plus single-choice interpretation.

**Template.** `The plotted line shows {verticalQuantity} against {horizontalQuantity}. Find and interpret {slopeOrIntercept}.`

**Generation and derivation.** Use an exact rendered line through labeled points, not noisy regression. `slope=Δy/Δx`; derive units by division. Context mappings include `x-t`, `v-t`, `F-a`, and spring `F-x`. Levels: calculate; interpret; distinguish nonzero intercept/model offset.

**Misconceptions, constraints, and rejection.** Target reciprocal slope, graph height, and missing units. Reject contexts where slope meaning depends on an unstated theory.

**Feedback and validation.** Mark two points and show both numeric/unit quotients; evaluate the line equation at a third point.

**Examples.**

1. L1: `x` versus `t`, rise `12 m` over `3 s` → slope `4 m/s`, velocity.
2. L2: `F` versus `a`, slope `2 kg` → mass `2 kg`.
3. L3: `F=kx+b` with nonzero `b` → slope is stiffness; intercept is offset force.

### Family `model_check`

**Skill.** Decide whether data with stated resolution support a proposed simple model and identify the most diagnostic deviation.

**Response mode.** Single-choice conclusion or yes/no with selected reason.

**Template.** `Measurements have resolution/uncertainty {u}. Which conclusion about model {model} is best supported?`

**Generation and derivation.** Generate values inside or outside declared tolerance bands. Compare model predictions with intervals/residuals; require at least three points. Levels: one obvious outlier; all within resolution; systematic residual trend suggesting wrong exponent/intercept.

**Distractors, constraints, and rejection.** Distractors claim exact proof, ignore uncertainty, or overgeneralize beyond range. Do not ask for formal statistics, fitted confidence intervals, or causal conclusions.

**Feedback and validation.** Show prediction-minus-measurement residuals and uncertainty bounds. Independently classify every point.

**Examples.**

1. L1: one prediction lies well outside every measurement interval → model not supported by that point.
2. L2: all residuals smaller than stated resolution → data are consistent with, not proof of, model.
3. L3: residuals change systematically from positive to negative → model form/offset likely inadequate over the range.

## 10. Cross-family progression

Recommended introduction order:

1. units, dimensions, average motion, and direct graph slope/area;
2. constant acceleration, free-body models, and Newton's second law;
3. work/energy, impulse/momentum, heating, density/pressure, and wave relationships;
4. inclines, friction state, equilibrium, projectiles, and circular motion;
5. collisions, torque, standing waves, hydrostatics/buoyancy, and charge/current;
6. optics, ideal gases/phase paths, electric fields/potential, magnetism, and model checking.

Key interleaving:

- unit conversion should recur inside every numeric category after isolated mastery;
- equation questions should alternate with matching graph questions;
- free-body identification should precede calculation using the same scene template;
- energy and force approaches should occasionally solve paired versions of the same physically compatible situation;
- impulse graphs should follow velocity–time area but remain distinct in units and meaning;
- electrostatic field direction should precede force on a negative test charge;
- noisy/rounded data should follow exact proportional relationships.

Do not unlock combined questions merely from a broad topic score. Prerequisite family mastery and representation-specific performance are required.

## 11. Adaptive practice guidance

Track mastery by:

`family`, `model`, `requested quantity`, `representation`, `unit dimension`, `prefix/conversion type`, `axis/sign`, `graph operation`, `assumption selection`, `number of reasoning stages`, and `misconception`.

Important routing:

| Error pattern | Likely diagnosis | Next practice |
|---|---|---|
| factor `10`, `100`, or `1000` | unit/prefix conversion | same physics with isolated conversion first |
| wrong factor for `cm²/cm³` | exponent not applied to conversion | area/volume unit round trip |
| uses path length for displacement | distance/displacement confusion | paired out-and-back average-motion items |
| graph height used for slope/area | representation confusion | ask quantity meaning before number |
| positive magnitude despite signed reversal | axis/sign loss | one-dimensional component ledger |
| acceleration set to zero at top | velocity/acceleration confusion | free-fall snapshot contrast |
| `N=mg` on incline/angled pull | contact model overgeneralized | vertical/perpendicular force balance |
| `f_s=μ_sN` below threshold | static-friction rule | required-versus-maximum two-field item |
| adds “centripetal force” | force-role misconception | free-body choice then inward net-force sum |
| conserves energy despite losses | system/transfer omission | choose system and energy ledger |
| conserves kinetic energy in sticking collision | conservation confusion | momentum table plus KE comparison |
| unsigned collision momentum | speed/velocity confusion | opposite-direction one-step impulse |
| amplitude is peak-to-peak | graph landmark confusion | label equilibrium, amplitude, wavelength |
| dB treated linearly | logarithmic-scale confusion | powers-of-ten intensity ratios |
| optical angle measured from surface | normal convention | visual angle-identification item |
| Celsius used in gas ratio | absolute-temperature confusion | Celsius-to-kelvin diagnostic |
| buoyancy uses object density | displaced-fluid model | identify displaced volume/fluid first |
| electric force direction follows field for negative q | field/force distinction | field-only then signed test-charge pair |
| magnetic direction not reversed for negative q | cross-product/sign rule | identical scene with charge-sign contrast |
| “consistent” reported as “proven” | evidence overclaim | model-check wording contrast |

Recommended selection mix:

- 40% weakest due family/dimension;
- 25% spaced mastered material;
- 20% targeted misconception or prerequisite diagnostic;
- 10% representation transfer;
- 5% carefully bounded two-family synthesis.

After a multi-step error, diagnose the first failed model/representation step rather than simply reducing numbers. Slow but correct performance should retain the conceptual level while reducing conversion clutter.

## 12. Feedback and worked-solution requirements

Every numeric worked solution must show, in order:

1. the declared model and assumptions;
2. the system, axes, sign convention, or graph interpretation;
3. the symbolic relationship before substitution;
4. values converted to compatible units;
5. algebra and final value with unit;
6. one plausibility check: dimension, sign, bound, proportional trend, limiting case, conservation balance, or alternate representation.

Correct feedback should be concise but identify the key reasoning:

> Correct — the signed area under the velocity–time graph is displacement.

Incorrect feedback should diagnose recognizable alternatives:

> `16 m` is the total geometric area. The region below the axis contributes negative displacement, so the signed result is `8 m`.

For multiple choice, store a misconception code for each distractor. Do not say only “incorrect” or reveal a formula without explaining why it applies.

Formula-help may be available, but adaptive scoring should record whether it was used. Questions intended to test model selection should offer a small relevant formula sheet rather than reward memorization.

## 13. Generator and implementation requirements

### Semantic-first generation

- Use reviewed model templates; do not generate arbitrary prose and infer physics afterward.
- Prefer constructing latent exact states and deriving givens/answers from them.
- Text, table, diagram/graph, answer oracle, and feedback must share the same semantic object.
- Every numeric quantity has a dimension vector and canonical SI value.
- Every approximation records its origin: displayed rounding, supplied empirical constant, or numerical function.

### Family coverage

Every family must implement all of the following before release:

- at least the three qualitatively distinct levels declared here;
- at least three wording/representation templates that do not alter semantics accidentally;
- misconception-derived distractors where choices are used;
- the three documented example types: straightforward, representative, and upper-level;
- rejection rules and structural signatures;
- a worked solution generated from symbolic steps;
- at least one independent oracle/property check.

The generator should balance requested variables, signs/directions, exact versus rounded results, representations, and model variants. It must not let the easiest forward-substitution variant dominate.

### Calculator and formula policy

- Levels involving logs, non-special trigonometric angles, quadratic roots, or awkward square roots are calculator-appropriate and should say so.
- Mental-calculation levels use deliberately friendly values.
- A formula/data panel should list equations already introduced in Learn, variable meanings, and supplied constants.
- The answer checker must not require the learner to reproduce a particular algebraic route.

### Accessibility and interaction

- Color is never the sole carrier of sign, vector direction, region, phase, or object identity.
- Keyboard and screen-reader users must be able to answer every family.
- Diagrams have semantic focus order and complete textual equivalents.
- Tables use headers with units.
- Graphs offer a text/table representation of exact points/segments.
- Choice order is randomized without moving paired labels away from their diagrams.

### Offline constraint

The app remains a standalone HTML/JS/CSS page. All generation, rendering, checking, and validation run locally in JavaScript. No runtime physics service, symbolic algebra server, compiler, or network lookup is assumed. Expensive validation belongs in development/build-time tests; shipped runtime oracles use the same bounded reviewed models plus lightweight independent checks.

## 14. Automated validation

For every generated instance:

- all placeholders are substituted and all givens are used or intentionally marked as irrelevant;
- the model assumptions are sufficient and mutually consistent;
- dimensions of every equation term and requested answer agree;
- canonical, display, and accepted-unit answers round-trip correctly;
- no denominator is zero and no forbidden/ambiguous root is accepted;
- elapsed times, masses, absolute temperatures, volumes, and material parameters are physically valid for the declared ideal model;
- choices contain exactly one correct semantic answer and distinct misconception-based distractors;
- diagram/graph/text representations agree exactly;
- the worked solution recomputes the oracle;
- rejection/history constraints pass.

Property and independent-oracle tests must include:

- unit conversion round trips, including squared/cubed units;
- dimension-vector algebra for every formula;
- kinematic state reconstruction and agreement among applicable equations;
- numerical differentiation/integration of motion graph segments;
- vector-force residual `ΣF-ma`;
- energy and momentum ledger closure;
- torque residual for equilibrium;
- wave inverse/product identities and optical equation back-substitution;
- thermal segment energy sums and ideal-gas state identity;
- hydrostatic layer sums and buoyancy bounds;
- electric/magnetic vector direction from basis-vector cross products;
- residual classification for model-check data;
- at least `10,000` deterministic seeds per family and level.

Distribution tests should cap:

- zero answers and exact cancellations;
- repeated special angles (`30°`, `45°`, `60°`);
- stationary/equilibrium cases;
- all-positive directions;
- exact integer answers;
- the same target variable;
- identical visual/topological signatures;
- questions solvable from superficial keyword matching.

### Reference regression cases

Maintain hand-audited regression cases for:

- turnaround under constant acceleration;
- static friction below and above threshold;
- force through a torque pivot;
- velocity graph crossing zero;
- sticking versus elastic collisions;
- closed-open pipe harmonic numbering;
- total internal reflection;
- virtual lens image sign;
- Celsius interval versus absolute kelvin;
- floating versus fully submerged buoyancy;
- negative electric test charge;
- negative charge in a magnetic field;
- model-consistent data with rounding scatter.

## 15. Coverage requirements

Across a long mixed session:

- at least 20% of questions ask for a model, interpretation, direction, graph meaning, or plausibility judgment rather than a numeric substitution;
- at least 20% of numeric questions require a compatible-unit conversion, but no more than 10% should make awkward conversion the main difficulty;
- motion includes positive, negative, zero, reversal, and return cases;
- graphs include slope, signed area, zero crossing, and piecewise comparison;
- force scenes balance equilibrium/non-equilibrium and frictionless/friction/contact variants;
- energy and momentum questions balance forward and inverse targets;
- wave/optics questions balance numeric and diagrammatic representation;
- thermal/fluid questions distinguish intensive/extensive quantities and gauge/absolute pressure;
- electric/magnetic questions balance magnitude and direction;
- every declared misconception is deliberately exercised and tracked.

Cross-category synthesis is limited to already mastered skills and normally no more than three essential steps. Good synthesis examples include units plus kinematics, force plus energy comparison, or electric power plus time. Do not create sprawling “everything in one problem” stories.

## 16. Topic-level quality checklist

- [ ] The app trains model selection and representation, not formula-name recall.
- [ ] Every problem states assumptions that make its equation valid.
- [ ] Scalars, signed components, magnitudes, and directions are distinguished.
- [ ] Units are dimension-checked and compatible answer units are accepted.
- [ ] `g` and empirical/material constants are supplied or visibly pinned.
- [ ] Distance/displacement and speed/velocity are never conflated.
- [ ] Constant-acceleration formulas are used only on constant-acceleration intervals.
- [ ] Static friction is not automatically set to its maximum.
- [ ] Centripetal force is treated as inward net force, not a new interaction.
- [ ] Conservation laws name the system and allowed transfers.
- [ ] Graph slope/area meaning and sign follow labeled axes and units.
- [ ] Optical angles are measured from the normal and lens signs are explicit.
- [ ] Gas-law temperatures use kelvin.
- [ ] Buoyant force uses displaced-fluid volume and fluid density.
- [ ] Electricity scope does not duplicate the Electric Circuits app.
- [ ] Visuals and accessible text derive from the same semantic model.
- [ ] Distractors correspond to known misconceptions.
- [ ] Every family has derivation, constraints, feedback, three examples, and validation.
- [ ] Difficulty grows through physics reasoning rather than arithmetic or ambiguity.
- [ ] The standalone app requires no backend or runtime network access.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Measurement & Units
2. Motion & Graphs
3. Forces & Equilibrium
4. Energy, Momentum & Torque
5. Waves, Sound & Optics
6. Thermal Physics & Fluids
7. Electricity & Magnetism
8. Data & Models

Stable family identifiers are the backticked identifiers in this specification. Category labels may be shortened in navigation, but stored progress must use stable identifiers. If an older app has a generic `physics-basics` score, migrate only demonstrably equivalent family-level progress; do not treat it as mastery of the expanded topic.
