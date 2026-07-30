# Control Systems — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, rational-system checker, block-diagram/signal-flow renderer, stability analyzer, response simulator, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Control Systems

### Topic goal

Develop fluent reasoning about feedback systems: follow signal flow, derive closed-loop relationships, predict stability and performance, diagnose tradeoffs, and choose bounded controller changes that meet explicit specifications.

The learner should become able to:

- distinguish plant, controller, actuator, sensor, reference, error, disturbance, noise, and output;
- reduce block diagrams without losing summing signs or internal signal meaning;
- distinguish forward-path, loop-transfer, and closed-loop quantities without relying on ambiguous terminology;
- derive reference, disturbance, and noise transfer functions;
- connect closed-loop poles to transient behavior and steady-state error;
- apply Routh–Hurwitz, root-locus, Bode-margin, and Nyquist reasoning within pinned conventions;
- interpret sensitivity, robustness, bandwidth, noise, and control-effort tradeoffs;
- choose and tune simple P/PI/PD/PID, lead, lag, and state-feedback structures in controlled cases;
- test controllability and observability and reason about simple observers;
- recognize saturation, windup, delay, uncertainty, and unsafe modeling assumptions.

Repeated practice should improve control judgment, not just algebraic manipulation of transfer functions.

### Relationship to neighboring Practice Lab topics

- **Signals and Systems** owns LTI signals, convolution, Fourier/Laplace/Z representations, frequency response, transfer functions, and basic block composition.
- **Differential Equations** owns solving ODEs, state trajectories, and numerical IVPs.
- **Linear Algebra** owns general matrix/eigenvalue methods.
- **Electric Circuits** owns physical circuit topology, component models, and practical electrical limits.

Control Systems owns feedback architecture, closed-loop performance, feedback stability, robustness, and controller/observer design. Its early categories review the necessary transfer-function and state-space mechanics so the app remains independent.

### Audience and prerequisites

Early categories assume:

- algebra with rational expressions;
- complex numbers and polynomial roots;
- basic Laplace/transfer-function vocabulary;
- elementary first- and second-order differential-equation behavior.

Later categories assume or locally review:

- logarithmic decibels and Bode plots;
- `2×2`/`3×3` matrix arithmetic and eigenvalues;
- unilateral final-value theorem conditions;
- basic discrete-time/Z-transform notation for the optional digital-control category.

### Scope

The initial model ID is `control-systems-v1`. It includes:

- SISO continuous-time LTI feedback systems as the core;
- block diagrams, summing junctions, takeoff points, series/parallel/feedback reduction, nested loops, and small signal-flow graphs;
- forward-path transfer, loop transfer/return ratio, sensitivity, complementary sensitivity, reference tracking, disturbance rejection, and sensor-noise transmission;
- rational plant/controller/sensor models, characteristic equations, poles, zeros, properness, relative degree, and internal-signal transfer functions;
- first- and second-order transient performance, time constants, damping ratio, natural/damped frequency, overshoot, peak time, settling time, and dominant-pole approximations;
- steady-state error, system type, position/velocity/acceleration error constants, and internal-model intuition;
- continuous-time pole stability and bounded Routh–Hurwitz analysis;
- root-locus real-axis segments, asymptotes, centroid, breakaway candidates, angle/magnitude conditions, imaginary-axis crossings, and gain selection;
- Bode factor accumulation, gain/phase margins, crossover frequencies, bandwidth, resonance, and delay effects;
- Nyquist encirclement reasoning under a pinned orientation convention;
- P, PI, PD, PID, lead, and lag controller effects and bounded parameter design;
- sensitivity/robustness tradeoffs and multiplicative uncertainty tests at a conceptual/numeric level;
- state-space realization, controllability, observability, state feedback, reference prefilter, and a simple full-state observer;
- optional sampled-data/discrete-time closed-loop reasoning, unit-circle stability, and short digital-controller traces;
- nonlinear/practical limitations: saturation, integrator windup, rate limits, dead zones, sensor noise, and model mismatch, all under explicit simplified models.

The intended ceiling is a strong first classical-control course with a bounded state-space and digital-control extension.

### Exclusions

Do not include:

- MIMO frequency-domain design, singular-value robustness, structured singular value, H-infinity/H2 synthesis, or loop-shaping optimization;
- nonlinear-control proofs, Lyapunov design, feedback linearization, sliding mode, backstepping, adaptive control, or model predictive control;
- stochastic estimation, Kalman filtering, LQG, stochastic processes, or system identification from real data;
- general optimal control, calculus of variations, Pontryagin principle, dynamic programming, or LQR Riccati solving beyond optional recognition;
- distributed-parameter/PDE control, robotics kinematics/dynamics, flight-control laws, power-grid control, or automotive safety design;
- arbitrary high-order symbolic factorization, general polynomial root solving, or free-form compensator optimization;
- vendor PLC/industrial-control configuration, networked-control protocols, real actuator commands, or live hardware;
- claims that an idealized controller is safe, certifiable, robust enough, or suitable for a real plant;
- a general CAS, circuit simulator, control-design toolbox, backend, or runtime network service.

### Normative feedback conventions

#### Core negative-feedback structure

Unless a prompt explicitly says otherwise:

```text
e = r − H y
u = C e
y = G u
```

where:

- `r` is reference;
- `e` is error at the controller input;
- `u` is plant input/control effort;
- `C(s)` is controller;
- `G(s)` is plant;
- `H(s)` is feedback/sensor path.

The loop transfer/return ratio is:

`L(s)=C(s)G(s)H(s)`.

Then:

- reference-to-output: `Y/R = CG/(1+L)`;
- reference-to-error: `E/R = 1/(1+L)=S`;
- loop complementary sensitivity: `T=L/(1+L)=1−S`.

For unity feedback `H=1`, `Y/R=T=CG/(1+CG)`.

If a disturbance/noise enters elsewhere, the diagram defines its injection sign and location. Transfer functions are derived with all other independent inputs set to zero.

#### Terminology contract

The phrase “open-loop gain” is ambiguous and must not appear alone in a graded prompt. Use one of:

- **forward-path transfer** `CG`;
- **loop transfer/return ratio** `L=CGH`;
- **plant transfer** `G`;
- **DC gain** `F(0)` of a named transfer;
- **closed-loop reference transfer** `Y/R`.

Positive feedback uses `e=r+Hy` and denominator `1−L`; it is always explicitly labeled.

#### Transfer functions and cancellations

- Transfer functions assume zero initial conditions.
- Poles/zeros are roots after exact factorization.
- External transfer simplification may cancel common factors, but internal-stability questions retain the original realization/factors.
- A hidden unstable pole-zero cancellation is not considered internally stable.
- Continuous-time asymptotic stability requires every internal mode/pole strictly in the open left half-plane.
- Discrete-time asymptotic stability requires every internal mode/pole strictly inside the unit circle.
- Poles on the imaginary axis/unit circle require separate marginal/boundedness analysis; they are not asymptotically stable.

### Time-response conventions

#### First order

For `T(s)=K/(τs+1)`, `τ>0`, unit-step response is `K(1−e^(−t/τ))`.

- at `t=τ`: `1−e^(−1)≈63.2%` of final change;
- 2% settling approximation: `t_s≈4τ`;
- 5% settling approximation: `t_s≈3τ`.

Questions say which threshold is used.

#### Standard second order

Canonical denominator:

`s²+2ζω_n s+ω_n²`,

with `ω_n>0`. For `0<ζ<1`:

- poles `−ζω_n±jω_d`;
- `ω_d=ω_n sqrt(1−ζ²)`;
- percent overshoot `100 exp(−πζ/sqrt(1−ζ²))`;
- peak time `t_p=π/ω_d`;
- 2% settling approximation `t_s≈4/(ζω_n)`.

Rise-time definitions vary; a prompt must state its threshold definition or provide the formula. The app does not silently use one textbook's rise-time convention.

Dominant-pole approximation is allowed only when neglected poles are explicitly much faster under a stated ratio rule, default at least five times farther left in real part.

### Steady-state error conventions

For stable unity negative feedback with loop transfer `L(s)`:

- `E/R=1/(1+L)`;
- `e_ss=lim_{s→0}sE(s)` when final-value conditions hold;
- system type is the number of uncancelled poles at the origin in `L`;
- `K_p=lim_{s→0}L(s)`;
- `K_v=lim_{s→0}sL(s)`;
- `K_a=lim_{s→0}s²L(s)`.

For unit step/ramp/parabolic reference (`R=1/s,1/s²,1/s³`):

- step `e_ss=1/(1+K_p)`;
- ramp `e_ss=1/K_v`;
- parabolic `e_ss=1/K_a`;

using `0`, finite, or `∞` semantic arithmetic and only when closed-loop stability/final-value conditions hold. Non-unity feedback questions derive error from the actual diagram rather than applying unity formulas blindly.

### Frequency-domain conventions

- `20log10|L|` is magnitude in dB.
- Gain crossover `ω_gc`: `|L(jω_gc)|=1` (0 dB).
- Phase margin `PM=180°+∠L(jω_gc)` using a continuous/unwrapped phase branch near crossover.
- Phase crossover `ω_pc`: `∠L(jω_pc)=−180°` modulo the displayed branch.
- Gain margin `GM=1/|L(jω_pc)|`; `GM_dB=−20log10|L(jω_pc)|`.
- If no relevant crossover exists, margin may be infinite/undefined according to the explicitly stated profile.
- Pure delay `e^(−sT_d)` has magnitude1 and phase `−ωT_d` radians.

Nyquist convention:

- Traverse the standard Nyquist contour for the open right-half plane.
- Count **clockwise** encirclements of `−1` as positive `N_cw`.
- `Z=P+N_cw`, equivalently `N_cw=Z−P`, where P is open-loop RHP poles and Z is closed-loop RHP zeros of `1+L`.
- A stable closed loop requires `Z=0`, hence `N_cw=−P`.

Every Nyquist prompt repeats the clockwise-positive convention.

### Root-locus conventions

Root locus studies roots of:

`1+K L₀(s)=0`, `K≥0`.

- branches start at open-loop poles and end at finite zeros or infinity;
- number of branches equals number of poles;
- a real-axis point is on the locus when the number of real open-loop poles/zeros to its right is odd;
- asymptote count `n−m`, angles `(2q+1)180°/(n−m)`, centroid `(sum poles−sum zeros)/(n−m)`;
- angle condition `∠L₀(s)=(2k+1)180°`;
- magnitude condition `K=1/|L₀(s)|`.

Repeated poles/zeros and departure angles appear only in explicit advanced families.

### Routh–Hurwitz conventions

- Characteristic polynomial coefficients are real and ordered descending.
- Zero leading coefficients and all-zero rows are handled by declared epsilon/auxiliary-polynomial rules in advanced variants.
- The number of sign changes in the first column equals the number of open right-half-plane roots when no imaginary-axis ambiguity remains.
- Strict asymptotic stability requires all roots in the open left half-plane; parameter inequalities are strict unless a boundary case is requested.

### State-space conventions

Continuous-time:

`ẋ=Ax+Bu`, `y=Cx+Du`.

- controllability matrix `Ctrb=[B AB ... A^(n−1)B]`;
- observability matrix `Obsv=[C;CA;...;CA^(n−1)]`;
- full rank n means controllable/observable;
- state feedback `u=−Kx+N r` gives `A_cl=A−BK`;
- full-order observer `xhaṫ=A xhat+B u+L(y−C xhat)` has error dynamics `ė=(A−LC)e`.

Matrix sizes are at most `3×3`, with `2×2` dominant.

### Controlled algebra grammar

```text
Rational
QuadraticAlgebraic
ComplexExact
Polynomial(degree<=5)
RationalTransfer(numDegree<=4, denDegree<=5)
FactoredTransfer(gain, poles, zeros, delay?)
BlockDiagram(nodes<=12, edges<=16)
StateSpace(n<=3)
PiecewiseResponse
FrequencySampleTable
UncertaintyBound
```

Most hand computation uses degree/order at most3. Higher-order examples provide factorization, Routh scaffolding, or numerical frequency samples.

### Answer conventions

- Surrounding whitespace is ignored.
- Exact rational/radical/π answers are preferred where available.
- Transfer functions are compared after exact rational normalization, but internal-realization metadata remains separate.
- Polynomial answers compare normalized coefficient vectors.
- Pole/zero sets are order-insensitive and multiplicity-sensitive.
- Angles accept degrees or radians only when the prompt permits both; canonical display is degrees for classical Bode/root-locus work.
- dB and ratio answers are unit-tagged and not interchangeable without conversion.
- Stability labels are semantic controls: asymptotically stable, unstable, marginal/bounded under stated conditions, or inconclusive.
- Parameter ranges use a structured interval editor.
- Equivalent state-coordinate realizations are accepted only when the task asks for “an equivalent realization”; design tasks otherwise check closed-loop matrices/poles, not one stored K when nonunique.
- Approximate answers state precision/tolerance; default is the larger of half the final displayed unit and `10^-5` relative.

### Diagram conventions

- Summing-junction input signs are printed at each incoming arrow.
- Takeoff points are dots; line crossings without takeoff use bridges/gaps.
- Signal direction and names are visible.
- Block labels in text and SVG share semantic IDs.
- Moved summing/takeoff points retain compensating transfer blocks exactly.
- Feedback paths are visually distinct by direction and labels, not color alone.
- Every diagram has an accessible system of signal equations sufficient to solve.

### Safety and application boundary

All plants, sensors, actuators, and specifications are synthetic educational models. The app never controls real hardware or claims that a design is safe, robust, certifiable, or deployable. Saturation/rate-limit exercises teach why a linear design can fail; they do not provide real actuator settings.

### Difficulty philosophy

Difficulty should rise through:

- more internal signals or nested loops;
- distinguishing external transfer stability from internal stability;
- connecting pole/zero geometry to time/frequency behavior;
- satisfying multiple performance/stability constraints;
- choosing the correct stability test;
- inverse design from specifications;
- incorporating a bounded uncertainty/delay/nonlinearity;
- moving between transfer and state representations.

It must not rise through giant block diagrams, fifth-degree expansion by hand, tiny plot reading, arbitrary controller tuning, hidden sign conventions, or unvalidated real-world detail.

### Shared family contract

Every family below includes:

- **Task** and why the operation matters;
- **Response/template** with typed semantic placeholders;
- **Derivation** as the normative answer algorithm;
- **Difficulty** through meaningful reasoning dimensions;
- **Misconceptions/constraints** covering distractors, accepted forms, rejection rules, and variations;
- **Feedback** identifying the first decisive rule/error;
- **Examples** with at least three instantiated cases;
- **Validation/coverage** naming independent oracles and distribution requirements.

All question text, diagrams, answers, distractors, plots, and feedback derive from one immutable semantic model. Reject ambiguous loop signs, hidden input locations, undefined margins, accidental cancellations, duplicate choices, or arithmetic-dominated instances.

## 2. Category: Feedback signals and block-diagram reasoning

### Category purpose

Build exact signal-flow literacy before reducing transfer functions.

### Learn

Write one equation per summing junction and block. A takeoff copies a signal without changing it. Negative feedback subtracts the measured output from the reference. Reduction rules are shortcuts derived from those equations, not graphical magic.

### Prerequisites

Algebra and basic transfer-function multiplication.

### Category boundaries

This category focuses on topology and signal relationships. Stability/performance consequences come later.

### Subcategories

1. Signal roles and junctions
2. Series/parallel reduction
3. Single and nested feedback
4. Moving junctions/takeoffs
5. Signal-flow paths

### Family `control_signal_roles`

**Task.** Match named signals/blocks to control roles and distinguish reference, error, measurement, control effort, and output.

**Response/template.** Matching: `Label the signals and blocks in {diagram}.`

**Derivation.** Follow semantic graph from reference through comparator/controller/plant/sensor and independent injections.

**Difficulty.** L1 unity loop; L2 actuator/sensor; L3 disturbance/noise; L4 two-degree-of-freedom prefilter.

**Misconceptions/constraints.** Distractors call sensor output plant output, reference error, or disturbance reference. Every arrow has one semantic source.

**Feedback.** State one defining equation per role.

**Examples.**

1. `e=r−y` in unity feedback → e is tracking error. L1.
2. controller output before plant → control effort u. L1.
3. additive signal at sensor output → measurement noise, not plant disturbance. L3.

**Validation/coverage.** Typed block graph and role schema; balance injection locations.

### Family `summing_junction_evaluate`

**Task.** Compute or write the output equation of a signed summing junction.

**Response/template.** Scalar/symbolic equation: `Find {junction_output} from {signed_inputs}.`

**Derivation.** Sum each input multiplied by displayed ± sign.

**Difficulty.** L1 two signals; L2 three/four; L3 nested junction values; L4 infer missing sign from equation.

**Misconceptions/constraints.** Signs are attached to incoming arrows. Distractors subtract all feedback-looking arrows or ignore a minus.

**Feedback.** Expand signed terms in arrow order.

**Examples.**

1. inputs +r,−m → e=r−m. L1.
2. +r,−m,+d with values5,2,−1 → output2. L2.
3. desired e=r−y−n requires minus signs on both y and n inputs. L3.

**Validation/coverage.** Signed-incidence equation from graph.

### Family `series_blocks_reduce`

**Task.** Reduce ordered series blocks and track intermediate signals.

**Response/template.** Equivalent transfer plus requested internal relation: `Reduce {series_path}.`

**Derivation.** Multiply transfers in signal-flow order for SISO scalar LTI blocks.

**Difficulty.** L1 gains; L2 rational blocks; L3 noncommuting state/matrix block recognition; L4 recover missing block.

**Misconceptions/constraints.** Core uses scalar transfers where multiplication commutes algebraically but order still preserved semantically. No cancellation hidden when internal stability matters.

**Feedback.** Write each intermediate relation then substitute.

**Examples.**

1. gains2 then3 → equivalent6. L1.
2. `C=(s+1)/s`, `G=1/(s+1)` → external product1/s, with cancellation flagged. L2.
3. total P and known G≠0 → C=P/G. L3.

**Validation/coverage.** Rational multiplication and internal factor provenance.

### Family `parallel_blocks_reduce`

**Task.** Reduce parallel paths with a signed output sum.

**Response/template.** Equivalent transfer: `Find output/input for {parallel_paths}.`

**Derivation.** Each path receives same input; signed sum yields algebraic sum/difference of transfers.

**Difficulty.** L1 gains; L2 rational common denominator; L3 subtractive path/cancellation; L4 infer a branch.

**Misconceptions/constraints.** Distractors multiply parallel blocks or add denominators. Exactly one common source/sink.

**Feedback.** Compute each path output before summing.

**Examples.**

1. parallel gains2 and3 added →5. L1.
2. paths `1/(s+1)` and `1/(s+2)` → `(2s+3)/[(s+1)(s+2)]`. L2.
3. gains4 and1 with second subtracted →3. L2.

**Validation/coverage.** Signal-equation and rational-sum oracles.

### Family `single_feedback_reduce`

**Task.** Derive closed-loop transfer for one negative/positive feedback loop.

**Response/template.** Rational relation: `Find Y/R for {forward,feedback,sign}.`

**Derivation.** Solve `y=G_f(r∓Hy)` to get `G_f/(1±G_fH)` for negative/positive respectively.

**Difficulty.** L1 gains/unity; L2 dynamic H; L3 positive feedback; L4 infer loop sign from denominator.

**Misconceptions/constraints.** Sign displayed. Distractors use `G/(1+G)` despite nonunity H or put H in numerator.

**Feedback.** Derive from signal equations before showing shortcut.

**Examples.**

1. forward4, unity negative →4/5. L1.
2. forward G, sensor H negative feedback → `G/(1+GH)`. L2.
3. forward2, unity positive → `2/(1−2)=−2` algebraically, with instability assessed separately. L3.

**Validation/coverage.** Symbolic simultaneous-equation solve.

### Family `nested_loop_reduce`

**Task.** Reduce two nested/nonoverlapping loops in a valid order or compute the overall transfer.

**Response/template.** Ordered reductions plus transfer: `Reduce {nested_diagram}.`

**Derivation.** Reduce innermost loop, substitute equivalent block, then outer loop; alternatively solve all signal equations.

**Difficulty.** L1 inner unity loop; L2 distinct signs/sensors; L3 shared forward blocks; L4 reject invalid shortcut for overlapping loops.

**Misconceptions/constraints.** At most two loops and eight blocks. Diagram generator guarantees well-posed algebraic equations.

**Feedback.** Highlight loop boundaries and compare equation solution.

**Examples.**

1. inner forward G2 with H2 gives `G2/(1+G2H2)` before series G1. L2.
2. outer negative feedback H1 wraps G1 times inner equivalent → denominator `1+H1G1G_inner`. L3.
3. overlapping loops sharing a summing node cannot both be replaced independently by `G/(1+GH)`; use equations. L4.

**Validation/coverage.** Full symbolic graph solve versus reduction sequence.

### Family `move_summing_takeoff`

**Task.** Choose the compensating block required when moving a summing junction or takeoff across a block.

**Response/template.** Matching diagram/block: `Move {junction_or_takeoff} across G while preserving all signal relations.`

**Derivation.** Equate original and transformed branch signals; crossing a block requires multiplying/dividing the moved side path by G as appropriate.

**Difficulty.** L1 takeoff after→before; L2 sum before→after; L3 inverse block; L4 avoid move when G noninvertible/zero.

**Misconceptions/constraints.** Rather than memorize four rules, derive from named signals. G invertibility stated when division needed.

**Feedback.** Write equality at moved branch and solve compensating transfer.

**Examples.**

1. takeoff after G moved before G needs G in copied branch to preserve Gx. L1.
2. disturbance d added before G gives output G(x+d); moved after G requires adding Gd. L2.
3. moving a junction backward across G requires `G^{-1}` on the other input and is disallowed if inverse is not defined. L3.

**Validation/coverage.** Original/transformed signal equations compared identically.

### Family `signal_flow_path_gain`

**Task.** Identify forward paths, individual loop gains, and touching loops in a small signal-flow graph.

**Response/template.** Path/loop sets and gains: `List {requested graph structures}.`

**Derivation.** Enumerate directed simple paths/loops, multiply edge gains, compare node sets for touching.

**Difficulty.** L1 one path/loop; L2 several paths; L3 non-touching loops; L4 Mason calculation deferred next family.

**Misconceptions/constraints.** At most eight nodes; no duplicate cycles under rotation. Signs included in edge gain.

**Feedback.** Highlight graph traversal and edge product.

**Examples.**

1. r→a gain G1, a→y G2 → path gain G1G2. L1.
2. feedback y→a gain−H makes loop gain−G2H. L2.
3. loops sharing node a touch; disjoint node sets do not. L3.

**Validation/coverage.** Graph path/cycle enumeration and canonical cycle IDs.

### Family `mason_gain_formula`

**Task.** Compute overall transfer of a small signal-flow graph using Mason's formula.

**Response/template.** Pk, Δ, Δk, transfer: `Use Mason's formula for {graph}.`

**Derivation.** `T=ΣP_kΔ_k/Δ`; `Δ=1−Σloops+Σproducts of two non-touching loops−...`.

**Difficulty.** L1 one path/loop; L2 two touching loops; L3 non-touching loop product; L4 two forward paths.

**Misconceptions/constraints.** Small enumerated graphs only. Distractors ignore loop signs or include touching products.

**Feedback.** Table paths, loops, touching relation, determinant terms.

**Examples.**

1. one forward P and loop L → `T=P/(1−L)`. L1.
2. loop gain−GH → denominator1+GH. L2.
3. non-touching L1,L2 add product `+L1L2` in Δ. L3.

**Validation/coverage.** Mason result versus symbolic node-equation solve.

### Cross-family progression

Signal roles and signed junctions precede block reduction. Series/parallel precede single feedback, then nested loops. Junction moves are taught through equations. Signal-flow paths precede Mason's formula. Full signal-equation solving remains the reference oracle for every shortcut.

## 3. Category: Closed-loop transfer relationships and sensitivity

### Category purpose

Train derivation of how each independent input reaches each internal/output signal, rather than treating “the closed-loop transfer” as a single universal fraction.

### Learn

Superposition allows one independent input at a time. The same loop denominator appears in many paths, but numerators depend on where the input enters and where the output is measured. Sensitivity `S` and complementary sensitivity `T` partition key effects.

### Prerequisites

Category 2 and rational algebra.

### Category boundaries

This category derives relationships and basic tradeoffs. Detailed stability/performance tests come later.

### Subcategories

1. Reference tracking
2. Disturbance/noise paths
3. Internal signals
4. Sensitivity identities
5. Characteristic equations

### Family `reference_closed_loop_transfer`

**Task.** Derive Y/R, E/R, or U/R for the core feedback structure.

**Response/template.** Named transfer: `With other inputs zero, find {signal}/{R}.`

**Derivation.** Solve core equations using L=CGH: `Y/R=CG/(1+L)`, `E/R=S`, `U/R=CS`.

**Difficulty.** L1 unity/gains; L2 dynamic H; L3 control effort; L4 positive sign explicitly.

**Misconceptions/constraints.** Requested numerator signal is explicit. Distractors return T for nonunity Y/R or omit C in U/R.

**Feedback.** Show signal equations and label loop denominator.

**Examples.**

1. C=2,G=3,H=1 → Y/R=6/7. L1.
2. general H → E/R=`1/(1+CGH)`. L2.
3. U/R=`C/(1+CGH)`. L2.

**Validation/coverage.** Symbolic graph solve and transfer substitution.

### Family `plant_input_disturbance_transfer`

**Task.** Derive output/error response to an additive disturbance at plant input.

**Response/template.** Y/D or E/D: `Set r=n=0; find transfer from plant-input disturbance d to {signal}.`

**Derivation.** With y=G(Ce+d), e=−Hy: `Y/D=G/(1+L)=GS`; `E/D=−HG/(1+L)`.

**Difficulty.** L1 unity; L2 nonunity sensor; L3 disturbance before/after actuator distinction; L4 compare low-frequency rejection.

**Misconceptions/constraints.** Injection point/sign printed. Distractors use reference numerator CG.

**Feedback.** Redraw only active input path and feedback closure.

**Examples.**

1. unity loop C=4,G=1 → Y/D=1/5. L1.
2. general plant-input disturbance → GS. L2.
3. increasing low-frequency |L| reduces |S| and plant-input disturbance output if G remains bounded. L3.

**Validation/coverage.** Multi-input symbolic equations and superposition.

### Family `output_disturbance_transfer`

**Task.** Derive response to a disturbance added at plant output.

**Response/template.** Y/D: `A disturbance is added to plant output before sensing; find Y/D.`

**Derivation.** y=GCe+d, e=r−Hy; with r=0 obtain `Y/D=1/(1+L)=S`.

**Difficulty.** L1 unity; L2 sensor placement; L3 compare with plant-input disturbance; L4 disturbance outside sensor path.

**Misconceptions/constraints.** Diagram distinguishes physical output and measured output.

**Feedback.** Show why numerator differs from plant-input disturbance.

**Examples.**

1. output disturbance in core loop → Y/D=S. L1.
2. L=9 DC → DC output disturbance transmission1/10. L2.
3. disturbance added after sensor measurement is not rejected by the same loop; derive from actual diagram. L3.

**Validation/coverage.** Injection-node variants and equation solve.

### Family `sensor_noise_transfer`

**Task.** Derive output/control response to additive measurement noise.

**Response/template.** Y/N or U/N: `Noise n is added to measured signal with displayed sign; find transfer.`

**Derivation.** For e=r−(Hy+n), with r=0: `Y/N=−CG/(1+L)` and `U/N=−C/(1+L)`.

**Difficulty.** L1 unity; L2 dynamic H; L3 compare high-frequency T; L4 noise before/after H.

**Misconceptions/constraints.** Noise sign/location explicit. Distractors claim high loop gain rejects measurement noise at output like output disturbance.

**Feedback.** Trace noise through comparator and forward path.

**Examples.**

1. unity feedback → Y/N=`−L/(1+L)=−T`. L2.
2. C=2,G=3,H=1 → Y/N=−6/7. L1.
3. U/N=`−C S`, which may be large with high-frequency controller gain. L3.

**Validation/coverage.** Symbolic graph solve across noise locations.

### Family `sensitivity_complement_identity`

**Task.** Compute S,T and use `S+T=1` or derive a missing response.

**Response/template.** Rational/value fields: `For L={L}, find S and T.`

**Derivation.** `S=1/(1+L)`, `T=L/(1+L)`, exact identity.

**Difficulty.** L1 numeric gain; L2 rational L; L3 complex frequency sample; L4 inverse recover L from S/T.

**Misconceptions/constraints.** T here is loop complementary sensitivity, explicitly distinguished from nonunity Y/R.

**Feedback.** Common denominator and identity check.

**Examples.**

1. L=4 → S=1/5,T=4/5. L1.
2. S=0.1 → T=0.9,L=T/S=9. L2.
3. at a frequency L=j, S=1/(1+j),T=j/(1+j), sum1. L3.

**Validation/coverage.** Exact rational/complex identity and inverse round trip.

### Family `plant_sensitivity`

**Task.** Compute relative sensitivity of closed-loop reference transfer to plant gain/model changes in the core loop.

**Response/template.** Sensitivity expression/value: `Find ∂ln(T_r)/∂ln(G) for {structure}.`

**Derivation.** For fixed C,H and `T_r=CG/(1+CGH)`, relative plant sensitivity is `S=1/(1+L)`.

**Difficulty.** L1 numeric interpretation; L2 symbolic derivative; L3 approximate percent change; L4 distinguish sensor/controller sensitivity.

**Misconceptions/constraints.** Small-perturbation approximation labeled. Do not claim feedback removes all uncertainty.

**Feedback.** Log-differentiate or compare perturbed exact transfers.

**Examples.**

1. L=9 → plant relative sensitivity0.1. L1.
2. 5% small plant-gain change predicts about0.5% closed-loop change at L=9. L2.
3. if L≈0, sensitivity≈1: little desensitization. L2.

**Validation/coverage.** Symbolic derivative and finite perturbation regression.

### Family `internal_signal_transfer`

**Task.** Derive transfer to an internal signal and check whether it remains bounded for a declared input.

**Response/template.** Transfer plus stability/status: `Find {internal_signal}/{input}.`

**Derivation.** Solve semantic node equations without cancelling internal factors prematurely.

**Difficulty.** L1 controller output; L2 sensor output; L3 hidden canceled mode; L4 multiple independent inputs.

**Misconceptions/constraints.** External Y/R alone is insufficient for internal stability. Original factors/realization preserved.

**Feedback.** Highlight internal path and uncancelled modes.

**Examples.**

1. core U/R=CS. L1.
2. measured M/R=HCG/(1+L)=T. L2.
3. unstable plant pole canceled in Y/R by controller zero may remain in an internal transfer/state, so external simplification does not prove internal stability. L3.

**Validation/coverage.** State/signal graph transfer solve with factor provenance.

### Family `characteristic_equation_derive`

**Task.** Derive and normalize the closed-loop characteristic equation/polynomial.

**Response/template.** Polynomial: `For {C,G,H,sign}, find the characteristic equation.`

**Derivation.** Negative feedback: denominator of `1+CGH=0`; clear denominators without discarding factor provenance; positive uses1−L.

**Difficulty.** L1 gain/first order; L2 rational product; L3 parameter K; L4 cancellations/internal distinction.

**Misconceptions/constraints.** Leading coefficient normalized when requested. Distractors set numerator zero or use open-loop denominator alone.

**Feedback.** Build `D_L+N_L` (negative feedback) after common denominator.

**Examples.**

1. G=1/(s+1),C=K,H=1 → `s+1+K=0`. L1.
2. L=K/[s(s+2)] → characteristic `s²+2s+K`. L2.
3. positive feedback same L → `s²+2s−K`. L3.

**Validation/coverage.** Symbolic determinant/denominator and closed-loop pole check.

### Family `forward_loop_closed_gain_compare`

**Task.** Compute and distinguish forward-path gain, loop gain, and closed-loop gain at DC or a named frequency.

**Response/template.** Three named fields: `At {frequency}, find CG, L=CGH, and Y/R.`

**Derivation.** Evaluate each named transfer and apply feedback formula.

**Difficulty.** L1 constants/unity; L2 nonunity H; L3 complex values; L4 infer one component.

**Misconceptions/constraints.** Never label all three “gain.” Phase included for complex variants.

**Feedback.** Place each value on diagram and denominator.

**Examples.**

1. C=2,G=3,H=.5 → forward6,loop3,closed Y/R=6/4=1.5. L2.
2. unity H gives loop=forward, but closed is `L/(1+L)`. L1.
3. closed gain may exceed1 with nonunity sensor; this is not by itself positive feedback. L3.

**Validation/coverage.** Named-transfer evaluator and unit tests for nonunity H.

### Cross-family progression

Reference transfers precede disturbance/noise paths. S and T are introduced after learners derive them from equations. Internal signals precede internal-stability warnings. Characteristic equations bridge to stability. Named gain comparison directly addresses ambiguous “open-loop gain.”

## 4. Category: Pole locations and transient performance

### Category purpose

Train the connection from closed-loop poles/zeros to time-domain speed, damping, overshoot, and approximation validity.

### Learn

Closed-loop poles determine natural modes. A first-order pole at `−1/τ` sets time scale τ. Standard second-order poles encode `ζ` and `ω_n`. Zeros and additional poles can change response shape, so standard formulas apply only to the declared canonical/dominant model.

### Prerequisites

Characteristic equations, complex roots, exponential/sinusoidal response.

### Category boundaries

Differential Equations owns deriving general solutions. Here the skill is performance interpretation and inverse specification.

### Subcategories

1. First-order response
2. Second-order parameters
3. Time specifications
4. Pole/zero effects
5. Dominant approximations

### Family `first_order_time_constant`

**Task.** Extract/construct first-order DC gain, pole, time constant, and step response.

**Response/template.** Named fields/formula: `For T(s)={transfer}, find K,τ,pole, and unit-step response.`

**Derivation.** Normalize denominator to `τs+1`; pole−1/τ; final value K if stable/proper; response K(1−e^{-t/τ}).

**Difficulty.** L1 canonical; L2 normalize coefficients; L3 infer transfer from response/pole; L4 nonunit step.

**Misconceptions/constraints.** τ>0 for stable profile. Distractors use pole=−τ or final value numerator coefficient before normalization.

**Feedback.** Normalize, then connect pole/time exponential.

**Examples.**

1. `2/(3s+1)` → K=2,τ=3,pole−1/3. L1.
2. `4/(2s+2)=2/(s+1)` → K=2,τ=1. L2.
3. pole−5,DC gain3 → `T=15/(s+5)=3/(0.2s+1)`. L3.

**Validation/coverage.** Rational normalization and inverse Laplace/step simulation.

### Family `first_order_landmarks`

**Task.** Compute/read 63.2%, settling, or time-to-fraction landmarks.

**Response/template.** Time/value: `For first-order response {parameters}, find {landmark}.`

**Derivation.** Fraction `p=1−e^{-t/τ}` gives `t=−τln(1−p)`; use pinned 2%/5% approximations when named.

**Difficulty.** L1 value at τ; L2 settling approximation; L3 inverse fraction; L4 nonzero initial/final change.

**Misconceptions/constraints.** Work with fraction of total change, not absolute output. Threshold stated.

**Feedback.** Normalize response change `(y−y0)/(yf−y0)`.

**Examples.**

1. τ=2,K=10 → y(2)=`10(1−e^{-1})≈6.32`. L1.
2. 2% settling for τ=.5 →≈2 s. L2.
3. reach90% → t=τln10. L3.

**Validation/coverage.** Exact exponential inversion and threshold simulation.

### Family `second_order_pole_parameters`

**Task.** Convert between denominator, poles, and `ζ,ω_n,ω_d`.

**Response/template.** Named numeric fields: `For {denominator_or_poles}, find ζ,ωn,ωd and regime.`

**Derivation.** Match `s²+2ζω_ns+ω_n²`; pole real part−ζω_n, magnitudeω_n, imaginary magnitudeω_d.

**Difficulty.** L1 canonical coefficients; L2 poles supplied; L3 normalize leading coefficient; L4 inverse construct denominator.

**Misconceptions/constraints.** ω_n>0; regimes under/critical/over/undamped labeled. Avoid phase/magnitude numeric ambiguity.

**Feedback.** Coefficient match and pole triangle.

**Examples.**

1. `s²+4s+25` → ωn=5,ζ=.4,ωd=sqrt21. L2.
2. poles−3±j4 → ωn=5,ζ=.6,ωd=4. L2.
3. ζ=1,ωn=2 → denominator `(s+2)²`. L2.

**Validation/coverage.** Polynomial/pole reconstruction and regime predicate.

### Family `second_order_overshoot_peak`

**Task.** Compute percent overshoot and peak time for canonical underdamped response.

**Response/template.** Percent/time: `For ζ={zeta},ωn={wn}, find Mp and tp.`

**Derivation.** Use pinned formulas with ωd.

**Difficulty.** L1 supplied ωd; L2 compute both; L3 inverse ζ from overshoot; L4 reject formula outside 0<ζ<1.

**Misconceptions/constraints.** Canonical numerator/no zeros, unit step, underdamped. Distractors use ωn for peak time or omit percent conversion.

**Feedback.** Verify applicability then substitute.

**Examples.**

1. ζ=0.5,ωn=2 → ωd=sqrt3,tp=π/sqrt3, overshoot≈16.3%. L2.
2. ζ increases → overshoot decreases under canonical model. L1 qualitative.
3. ζ=1 → no underdamped peak; formula not applicable. L3.

**Validation/coverage.** High-precision formula and exact step-response peak regression.

### Family `second_order_settling`

**Task.** Estimate 2% settling time or infer real-part/damping requirement.

**Response/template.** Time/inequality: `Using the 2% approximation, find {target}.`

**Derivation.** `t_s≈4/(ζω_n)=4/σ` where σ=−Re(pole)>0.

**Difficulty.** L1 direct; L2 from poles; L3 design inequality; L4 compare approximation to extra pole invalidity.

**Misconceptions/constraints.** Approximation visibly labeled. Reject ζ=0/unstable.

**Feedback.** Connect exponential envelope e^{-ζω_nt}.

**Examples.**

1. ζ=.5,ωn=4 → ts≈2 s. L1.
2. poles−2±j5 → ts≈4/2=2 s. L2.
3. require ts≤1 → dominant real parts at most−4 under approximation. L3.

**Validation/coverage.** Envelope threshold and simulated canonical response.

### Family `transient_specs_inverse`

**Task.** Infer ζ and ωn/pole target from overshoot and settling/peak specifications.

**Response/template.** Parameter/pole region: `Choose parameters meeting {specs}.`

**Derivation.** Invert overshoot logarithm for ζ; derive σ from settling; ωn=σ/ζ; verify all specs numerically.

**Difficulty.** L1 one lookup/inverse supplied; L2 two specs; L3 choose candidate poles; L4 feasibility/rounding.

**Misconceptions/constraints.** Canonical second-order assumption explicit. Choices separated beyond tolerance.

**Feedback.** Translate each spec to one geometric constraint.

**Examples.**

1. ~16.3% overshoot → ζ≈0.5. L2.
2. ζ=.5 and ts≤2 → ωn≥4. L2.
3. poles−2±j3.464 meet ζ=.5,ωn=4,ts≈2. L3.

**Validation/coverage.** Forward formulas verify selected inverse.

### Family `pole_zero_response_effect`

**Task.** Predict qualitative effects of adding/moving a stable pole, LHP zero, or RHP zero.

**Response/template.** Matching/choice: `Compared with {baseline}, what likely changes under {modified_transfer}?`

**Derivation.** Use exact generated step responses/pole-zero facts: slow pole adds mode; nearby LHP zero may speed/reshape; RHP zero produces inverse response/nonminimum phase.

**Difficulty.** L1 extra slow pole; L2 LHP zero; L3 RHP zero; L4 distinguish unchanged poles from changed residues.

**Misconceptions/constraints.** Qualitative claims limited to curated templates and verified responses, never universal slogans.

**Feedback.** Show modal residues/initial direction for the generated pair.

**Examples.**

1. extra pole at−0.2 beside poles near−2 adds a slower tail. L1.
2. RHP zero can make step response initially move opposite final direction. L3.
3. changing a zero can change overshoot/shape without changing characteristic poles. L2.

**Validation/coverage.** Exact inverse Laplace and response-feature extraction.

### Family `dominant_pole_approximation`

**Task.** Select dominant poles, form a reduced model, and judge approximation validity.

**Response/template.** Pole subset/reduced transfer/status: `Which poles dominate {system}, using ratio rule {rule}?`

**Derivation.** Compare real-part decay rates and residues; retain slow pair/pole, match declared DC gain, verify neglected modes satisfy ratio/residue bounds.

**Difficulty.** L1 one fast pole; L2 complex pair; L3 zero/cancellation spoils; L4 no valid dominant set.

**Misconceptions/constraints.** Default ≥5× farther left plus nonlarge residue. Distractors choose largest imaginary part or closest magnitude to origin without real part.

**Feedback.** List time constants and residue warning.

**Examples.**

1. poles−1 and−10 →−1 dominant by10×. L1.
2. pair−2±j3 and pole−20 → pair dominant. L2.
3. fast pole with huge residue may cause significant early response; ratio alone is insufficient under advanced rule. L3.

**Validation/coverage.** Exact residues and response-error comparison over stated window.

### Cross-family progression

First-order poles/landmarks precede second-order parameters. Direct second-order metrics precede inverse design. Pole/zero qualitative effects and dominance are later because they delimit when canonical formulas may be trusted.

## 5. Category: Steady-state tracking and regulation

### Category purpose

Train final accuracy reasoning, system type, internal-model effects, and correct use of final-value conditions.

### Learn

Steady-state error depends on loop behavior near `s=0` and the reference/disturbance model. Integral action raises system type and can eliminate selected polynomial-reference errors, but only if the closed loop is stable and practical limits do not intervene.

### Prerequisites

Closed-loop transfer relationships, limits, final-value theorem.

### Category boundaries

This category evaluates steady state. Controller tradeoffs and design are later.

### Subcategories

1. Final-value applicability
2. System type and error constants
3. Reference errors
4. Disturbance regulation
5. Internal model

### Family `final_value_applicability_control`

**Task.** Decide whether final-value theorem can compute a steady output/error and, if so, apply it.

**Response/template.** Applicability plus value: `For {closed_loop_signal_transform}, find final value if justified.`

**Derivation.** Inspect poles of `sF(s)`; all must be strictly LHP for ordinary profile, then take limit s→0.

**Difficulty.** L1 stable first order; L2 persistent sinusoid/marginal; L3 unstable cancellation; L4 error may converge while another internal signal does not.

**Misconceptions/constraints.** Applicability always asked. Distractors take DC limit despite unstable/marginal poles.

**Feedback.** Pole check before limit.

**Examples.**

1. `Y=1/[s(s+1)]` → final1. L1.
2. `Y=1/(s²+1)` → sY poles±j; theorem not applicable/no final value. L2.
3. unstable hidden internal mode prevents internal stability even if simplified Y appears convergent. L3.

**Validation/coverage.** Direct inverse response limit and pole condition.

### Family `system_type_identify`

**Task.** Identify unity-feedback system type from loop transfer, including cancellations.

**Response/template.** Nonnegative integer: `What is the system type of L(s)={L}?`

**Derivation.** Simplify legitimate loop factors while preserving internal caveat; count uncancelled poles at s=0.

**Difficulty.** L1 obvious integrators; L2 factored/cancellation; L3 controller+plant composition; L4 unstable cancellation warning.

**Misconceptions/constraints.** Type is loop property, not closed-loop denominator order or number of poles overall.

**Feedback.** Factor around s=0 and count.

**Examples.**

1. `K/[s(s+2)]` → type1. L1.
2. `K(s+1)/[s²(s+3)]` → type2. L1.
3. `K s/[s(s+1)]` externally cancels origin → minimal loop type0, with realization caveat. L3.

**Validation/coverage.** Factor multiplicity at origin and provenance.

### Family `static_error_constants`

**Task.** Compute Kp,Kv,Ka for a stable unity-feedback loop.

**Response/template.** Extended-real named fields: `For L(s)={L}, find Kp,Kv,Ka.`

**Derivation.** Evaluate pinned limits with exact zero/pole orders.

**Difficulty.** L1 type0/1; L2 type2; L3 finite nonunit constants; L4 parameter.

**Misconceptions/constraints.** Use semantic `∞`, not overflow. Stability precondition stated/checked separately.

**Feedback.** Show s-power cancellation in each limit.

**Examples.**

1. `L=10/(s+2)` → Kp=5,Kv=0,Ka=0. L1.
2. `L=6/[s(s+3)]` → Kp=∞,Kv=2,Ka=0. L2.
3. `L=K/[s²(s+1)]` → Kp=∞,Kv=∞,Ka=K. L2.

**Validation/coverage.** Laurent order/coefficient oracle.

### Family `polynomial_reference_error`

**Task.** Compute unit step/ramp/parabolic steady-state error from type/constants.

**Response/template.** Extended-real value: `For stable unity feedback {L}, find e_ss to {input}.`

**Derivation.** Apply final-value theorem or pinned constants formula.

**Difficulty.** L1 step/type0; L2 ramp/type1; L3 parabolic/type2; L4 amplitude-scaled input.

**Misconceptions/constraints.** Input transform/amplitude shown. Distractors use Kp for every input or equate type with error value.

**Feedback.** Write E=R/(1+L) then limit.

**Examples.**

1. Kp=4, unit step → e_ss=1/5. L1.
2. Kv=3, unit ramp →1/3. L2.
3. type1 loop, unit parabolic →∞. L3.

**Validation/coverage.** Direct rational final-value calculation.

### Family `nonunity_feedback_error`

**Task.** Derive comparator error and/or physical tracking error for nonunity H.

**Response/template.** Named e=r−Hy and tracking r−y steady values: `Find both errors for {system}.`

**Derivation.** Use actual transfers; distinguish comparator error from output tracking difference.

**Difficulty.** L1 constant H; L2 dynamic H(0); L3 calibration/prefilter; L4 unity formulas fail.

**Misconceptions/constraints.** Error definition explicit. Do not call e physical r−y when H≠1.

**Feedback.** Evaluate sensor equation at steady state.

**Examples.**

1. high loop gain with H=.5 tends y≈2r while comparator e≈0; r−y≈−r. L2.
2. H=2 tends y≈r/2. L1.
3. a reference prefilter may restore desired DC mapping without changing loop L. L3.

**Validation/coverage.** Symbolic/DC signal equations.

### Family `disturbance_steady_state`

**Task.** Determine steady output/error from constant/ramp disturbance at a named injection.

**Response/template.** Value/status: `For {disturbance_path}, find steady response.`

**Derivation.** Use injection transfer (e.g. GS or S), multiply disturbance transform, check final-value conditions.

**Difficulty.** L1 output constant disturbance; L2 plant-input; L3 ramp disturbance/internal model; L4 compare controller types.

**Misconceptions/constraints.** Location named. Distractors reuse reference-error constants without correct numerator.

**Feedback.** Derive path transfer then low-frequency limit.

**Examples.**

1. output disturbance with S(0)=0 → constant output disturbance rejected at steady state. L2.
2. if L(0)=9, output-disturbance DC transmission S(0)=.1. L1.
3. plant-input disturbance uses G S, not just S. L2.

**Validation/coverage.** Symbolic transfer and final-value oracle.

### Family `internal_model_effect`

**Task.** Choose what integrator/resonant internal model is required to eliminate a declared steady signal class in ideal stable feedback.

**Response/template.** Controller feature/type choice: `Which controller internal model is needed for {tracking_or_rejection}?`

**Derivation.** Match exosystem polynomial/sinusoidal mode to loop poles/model, under stability and no cancellation.

**Difficulty.** L1 step→integrator; L2 ramp→two total integrators; L3 sinusoid→resonant pair recognition; L4 practical caveat.

**Misconceptions/constraints.** Conceptual bounded family. Do not imply adding integrators guarantees stability.

**Feedback.** Link input transform pole to loop low-frequency/internal model.

**Examples.**

1. zero constant step error needs at least type1 loop. L1.
2. zero ramp error needs at least type2 loop. L2.
3. adding an integrator may remove step error but can reduce stability margin. L3.

**Validation/coverage.** Reference/error rational limits and stability counterexamples.

### Cross-family progression

Final-value applicability precedes type/constants. Constants precede polynomial-reference errors. Nonunity and disturbance cases force derivation from actual diagrams. Internal-model questions synthesize type with controller implications.

## 6. Category: Algebraic stability and Routh–Hurwitz

### Category purpose

Train exact closed-loop stability decisions without explicitly solving every polynomial root.

### Learn

Stability is a property of the closed-loop characteristic polynomial/internal modes. First- and second-order coefficient tests are immediate. Routh's first column counts RHP roots and yields parameter ranges. Boundary cases require auxiliary/epsilon handling and separate interpretation.

### Prerequisites

Characteristic equations, polynomial coefficients, inequalities.

### Category boundaries

Root locus and frequency criteria come later. Routh work is bounded to order5 with scaffolding above order4.

### Subcategories

1. Pole and coefficient tests
2. Routh table construction
3. Root counts and parameter ranges
4. Marginal/boundary cases
5. Internal stability

### Family `pole_stability_classify_control`

**Task.** Classify CT/optional DT pole sets.

**Response/template.** Stability label and offending poles: `Classify the system with poles {poles}.`

**Derivation.** CT strict LHP; DT strict unit disk; boundary modes separately inspect multiplicity.

**Difficulty.** L1 real poles; L2 complex; L3 imaginary-axis/simple versus repeated; L4 hidden internal mode.

**Misconceptions/constraints.** Domain CT/DT stated. No “negative magnitude” reasoning.

**Feedback.** Plot poles and mark stability boundary.

**Examples.**

1. CT poles−1,−2±j3 → asymptotically stable. L1.
2. CT pole+0.2 → unstable. L1.
3. simple poles±j with no other unstable modes are not asymptotically stable; boundedness depends on input/internal context. L3.

**Validation/coverage.** Exact geometry and multiplicity.

### Family `low_order_coefficient_stability`

**Task.** Apply first-/second-order Hurwitz coefficient conditions or find parameter interval.

**Response/template.** Stable yes/no/range: `For p(s)={poly}, determine asymptotic stability.`

**Derivation.** First order positive normalized coefficients; second order `a2,a1,a0` same positive sign after leading normalization.

**Difficulty.** L1 numeric; L2 parameter; L3 sign normalization; L4 distinguish necessary-only for higher order.

**Misconceptions/constraints.** Do not generalize positive coefficients as sufficient above order2.

**Feedback.** State exact order-specific theorem.

**Examples.**

1. `s²+3s+2` stable. L1.
2. `s²−s+2` unstable. L1.
3. `s²+(K−1)s+K`, leading1 → stable for K>1. L2.

**Validation/coverage.** Exact roots as independent oracle.

### Family `routh_table_complete`

**Task.** Complete missing entries in a Routh table.

**Response/template.** Table cells: `Complete the Routh array for {polynomial}.`

**Derivation.** Fill first two rows from alternating coefficients, then determinant recurrence with pinned sign convention.

**Difficulty.** L1 cubic; L2 quartic; L3 symbolic K; L4 zero-leading epsilon case.

**Misconceptions/constraints.** Formula displayed in Learn; entries exact rational. Avoid needless fifth-order arithmetic.

**Feedback.** Show numerator/denominator for first wrong cell.

**Examples.**

1. `s³+2s²+3s+4`: first rows `[1,3]`, `[2,4]`; next first `(2·3−1·4)/2=1`. L1.
2. missing zero coefficients are inserted explicitly. L2.
3. first-column zero with nonzero row invokes ε advanced rule, not division by zero. L3.

**Validation/coverage.** Independent polynomial root count and symbolic recurrence.

### Family `routh_rhp_count`

**Task.** Count RHP roots from a completed/partial Routh first column.

**Response/template.** Nonnegative integer plus sign sequence: `How many RHP roots?`

**Derivation.** Normalize irrelevant positive scale, count consecutive sign changes excluding zeros handled by rule.

**Difficulty.** L1 all positive; L2 one/two changes; L3 parameter sign; L4 boundary zeros.

**Misconceptions/constraints.** Count changes, not negative entries. Exact signs known.

**Feedback.** Mark each transition.

**Examples.**

1. `[1,2,1,4]` →0 changes. L1.
2. `[1,−2,3,4]` →2 changes (+→−→+). L2.
3. `[1,2,−1,−3]` →1 change. L2.

**Validation/coverage.** Sign-change function versus numeric roots.

### Family `routh_parameter_range`

**Task.** Derive parameter range for strict stability.

**Response/template.** Interval/set: `Find K such that {characteristic_polynomial} is stable.`

**Derivation.** Construct symbolic Routh first column, require same strict sign after positive leading coefficient, solve inequalities, verify sample/boundaries.

**Difficulty.** L1 quadratic; L2 cubic one parameter; L3 quartic scaffold; L4 disjoint/no ranges.

**Misconceptions/constraints.** Denominator sign cases handled exactly. Boundaries excluded for strict stability.

**Feedback.** List inequalities and intersect.

**Examples.**

1. `s³+2s²+3s+K`: first-column condition `(6−K)/2>0` and K>0 → `0<K<6`. L2.
2. endpoint K=6 gives imaginary-axis boundary, not strict stability. L2.
3. empty inequality intersection → no stabilizing K in declared range. L3.

**Validation/coverage.** Symbolic inequality solver and sampled exact/numeric roots.

### Family `routh_special_row`

**Task.** Handle a zero first element or all-zero row and interpret boundary roots.

**Response/template.** Next construction and classification: `Apply the Routh special-case rule to {table/poly}.`

**Derivation.** Replace isolated leading zero by positive ε and take sign limit; all-zero row uses derivative of auxiliary polynomial from row above.

**Difficulty.** L1 recognize case; L2 epsilon signs; L3 auxiliary polynomial; L4 extract symmetric imaginary roots.

**Misconceptions/constraints.** Advanced, highly scaffolded, order≤4.

**Feedback.** Explain why ordinary recurrence fails and show limiting/root result.

**Examples.**

1. row begins0 but has later nonzero → use ε, not declare stable. L2.
2. all-zero row signals roots symmetric about origin. L2.
3. auxiliary `s²+4` yields imaginary roots±j2. L3.

**Validation/coverage.** Exact root factorization and epsilon-limit sign count.

### Family `stability_boundary_frequency`

**Task.** Find parameter/frequency at imaginary-axis crossing using Routh auxiliary equation or direct substitution.

**Response/template.** Parameter and ω: `Find the marginal-stability boundary for {poly(K)}.`

**Derivation.** Set Routh boundary entry zero or substitute s=jω, separate real/imaginary, solve and check remaining roots.

**Difficulty.** L1 supplied K; L2 cubic; L3 compare crossings; L4 reject zero-frequency root distinction.

**Misconceptions/constraints.** “Marginal” only if simple boundary roots and remaining modes stable; otherwise label boundary/unstable.

**Feedback.** Verify full pole set at boundary.

**Examples.**

1. prior `s³+2s²+3s+K`, K=6; auxiliary from s² row `2s²+6=0` → ω=sqrt3. L3.
2. K=0 gives root at origin, a different boundary. L2.
3. repeated imaginary roots are unstable/unbounded in ordinary internal response, not marginally stable. L3.

**Validation/coverage.** Exact polynomial factor/root multiplicity.

### Family `external_internal_stability`

**Task.** Distinguish BIBO external transfer stability from internal stability under cancellations/realizations.

**Response/template.** Property labels and hidden mode: `Assess external and internal stability of {realization}.`

**Derivation.** Simplify named external transfer for BIBO poles, but inspect all realization/internal eigenmodes and reachability/observability path.

**Difficulty.** L1 stable no cancellation; L2 stable canceled stable pole; L3 canceled RHP pole; L4 unobservable/uncontrollable mode.

**Misconceptions/constraints.** Original realization supplied. Never infer hidden modes from simplified transfer alone.

**Feedback.** Show external cancellation and retained internal state.

**Examples.**

1. no hidden modes and all poles LHP → both stable. L1.
2. Y/R cancellation removes `(s−1)` but state has eigenvalue+1 → external transfer may look stable; internally unstable. L3.
3. canceling a stable pole may alter internal behavior but does not create instability by itself. L2.

**Validation/coverage.** Transfer poles plus state eigenmodes/internal transfers.

### Cross-family progression

Pole geometry and low-order tests precede Routh construction. Table completion precedes RHP counts and parameter ranges. Special rows/boundaries are advanced. Internal stability returns to factor provenance and state realization after ordinary characteristic stability.

## 7. Category: Root-locus reasoning

### Category purpose

Train geometric prediction of closed-loop pole motion as scalar gain varies and use it for bounded gain design.

### Learn

Root-locus points satisfy the angle condition for `1+KL₀=0`; the magnitude condition gives K. Branches start at poles and end at zeros/infinity. Real-axis and asymptote rules provide a skeleton; breakaway and crossing calculations refine it.

### Prerequisites

Poles/zeros, characteristic equations, complex angle/magnitude, stability.

### Category boundaries

Plots are semantic, not freehand art. Compensator root-locus design appears after uncompensated rules.

### Subcategories

1. Branch endpoints and real-axis segments
2. Asymptotes
3. Angle/magnitude tests
4. Breakaway/crossings
5. Gain selection

### Family `root_locus_branch_count_endpoints`

**Task.** Determine branch count, start poles, end zeros/infinity.

**Response/template.** Counts and point sets: `For L0={factored}, identify root-locus endpoints for K≥0.`

**Derivation.** n poles→n branches; m finite zeros receive m; remaining n−m go to infinity.

**Difficulty.** L1 all real; L2 complex; L3 repeated; L4 improper n<m rejected/handled separately.

**Misconceptions/constraints.** Proper loop profile n≥m. Multiplicity counted.

**Feedback.** Pair branch inventory with poles/zeros.

**Examples.**

1. poles0,−2; no zeros →2 branches to infinity. L1.
2. three poles, one zero → one ends finite, two infinity. L2.
3. double pole counts as two branch starts. L2.

**Validation/coverage.** Root/zero multiset counts.

### Family `root_locus_real_axis`

**Task.** Mark real-axis intervals belonging to root locus.

**Response/template.** Interval selection: `Which real-axis segments lie on the locus?`

**Derivation.** Sort real poles/zeros; a test point lies on locus when count to right is odd.

**Difficulty.** L1 two poles; L2 pole/zero mix; L3 repeated points; L4 complex points ignored in real count.

**Misconceptions/constraints.** Endpoints separately marked. Distractors count to left or poles only.

**Feedback.** Table interval and right-side count.

**Examples.**

1. poles0,−2, no zeros → segment(−2,0). L1.
2. poles0,−4, zero−1 → segments(−∞,−4) and(−1,0). L2.
3. complex poles do not directly change real-axis right-count. L3.

**Validation/coverage.** Sorted interval parity and direct angle test.

### Family `root_locus_asymptotes`

**Task.** Compute asymptote count, centroid, and angles.

**Response/template.** Named fields: `Find root-locus asymptotes for {poles,zeros}.`

**Derivation.** Apply pinned n−m formulas.

**Difficulty.** L1 two poles/no zeros; L2 mixed points; L3 complex sums; L4 infer missing pole/zero.

**Misconceptions/constraints.** n>m. Angles canonical in `[0,360)`.

**Feedback.** Show pole/zero sum and q sequence.

**Examples.**

1. poles0,−2,no zeros → centroid−1, angles90°,270°. L1.
2. poles0,−1,−5,zero−2 → two asymptotes, centroid `(−6+2)/2=−2`, angles90°,270°. L2.
3. n−m=3 → angles60°,180°,300°. L2.

**Validation/coverage.** Exact complex sums and angle enumeration.

### Family `root_locus_angle_test`

**Task.** Decide whether a candidate complex point lies on root locus.

**Response/template.** Yes/no plus total angle: `Does s0={point} satisfy the angle condition for {L0}?`

**Derivation.** Sum zero angles minus pole angles, normalize modulo360, check odd180°.

**Difficulty.** L1 real segment; L2 one complex candidate; L3 complex poles/zeros; L4 angle deficiency for compensator.

**Misconceptions/constraints.** Exact landmark angles or tolerance stated. Distractors reverse pole/zero contributions.

**Feedback.** Vector-angle table.

**Examples.**

1. point−1 between poles0,−2 has total−180° → on locus. L1.
2. total angle−180°+360k → on locus. L2.
3. total−135° → not on locus; deficiency−45°/equivalent stated. L3.

**Validation/coverage.** Complex argument and characteristic gain real-positive check.

### Family `root_locus_gain_at_point`

**Task.** Compute gain K placing a pole at a candidate locus point.

**Response/template.** Positive scalar: `Given s0 lies on locus, find K.`

**Derivation.** `K=1/|L₀(s0)|`, product of pole distances over zero distances and gain.

**Difficulty.** L1 real; L2 complex distances; L3 base gain; L4 reject negative/non-angle candidate.

**Misconceptions/constraints.** Angle condition checked first. Avoid ugly radicals.

**Feedback.** Distance-product diagram and characteristic substitution.

**Examples.**

1. L0=1/[s(s+2)], at s=−1 → |den|=1, K=1. L1.
2. base gain2 doubles |L0|, halving required K. L2.
3. candidate failing angle condition has no positive K despite magnitude value. L3.

**Validation/coverage.** Magnitude formula and polynomial root substitution.

### Family `root_locus_breakaway`

**Task.** Find/select valid real-axis breakaway/break-in points.

**Response/template.** Candidate points/status: `Find valid break points for {L0}.`

**Derivation.** From `K(s)=−1/L₀(s)`, solve dK/ds=0; retain real points on locus with K≥0 and correct branch behavior.

**Difficulty.** L1 symmetric two poles; L2 pole/zero; L3 multiple algebraic candidates; L4 classify break-in/out.

**Misconceptions/constraints.** Derivative roots are candidates, not automatic. Degree manageable.

**Feedback.** Filter candidates by segment and gain.

**Examples.**

1. L0=1/[s(s+2)] → K=−s(s+2), derivative−2s−2=0 → s=−1,K=1. L2.
2. candidate off a real-axis locus segment is rejected. L2.
3. candidate yielding K<0 is rejected for K≥0 locus. L3.

**Validation/coverage.** Exact derivative and nearby closed-loop root trajectories.

### Family `root_locus_imaginary_crossing`

**Task.** Determine gain and frequency where locus crosses imaginary axis.

**Response/template.** K,ω: `Find imaginary-axis crossing for {characteristic_poly(K)}.`

**Derivation.** Use Routh boundary or substitute s=jω; solve real/imag and verify.

**Difficulty.** L1 supplied Routh; L2 cubic; L3 multiple boundaries; L4 origin crossing.

**Misconceptions/constraints.** K≥0 and ω≥0; remaining roots inspected.

**Feedback.** Cross-link Routh and locus.

**Examples.**

1. `s³+2s²+3s+K`: K=6,ω=sqrt3. L2.
2. K=0 root at origin is a boundary endpoint. L2.
3. crossing with another RHP pole does not create stable range. L3.

**Validation/coverage.** Exact roots and Routh agreement.

### Family `root_locus_sketch_select`

**Task.** Choose the only root-locus sketch consistent with all structural rules.

**Response/template.** Single graph choice: `Which sketch matches {L0}?`

**Derivation.** Validate endpoints, real segments, symmetry, asymptotes, branch continuity, crossings.

**Difficulty.** L1 real two-pole; L2 complex/asymptotes; L3 zero/breakaway; L4 several plausible local-but-global errors.

**Misconceptions/constraints.** Semantic vector curves generated from numeric continuation; choices differ by named rule.

**Feedback.** Identify first violated rule in each distractor.

**Examples.**

1. locus symmetric about real axis. L1.
2. branches cannot start away from poles at K=0. L1.
3. two branches going to infinity must approach declared asymptotes. L3.

**Validation/coverage.** Numeric root continuation and structural invariant suite.

### Family `root_locus_gain_design`

**Task.** Choose K meeting a stability/damping/settling constraint from locus data.

**Response/template.** Gain/range choice: `Select K so closed-loop poles satisfy {region}.`

**Derivation.** Intersect locus with pole region, use magnitude condition or supplied continuation table, verify roots/specs.

**Difficulty.** L1 stability interval; L2 real-part line; L3 damping-ratio ray; L4 competing/no feasible constraints.

**Misconceptions/constraints.** Candidate designs forward-verified. No arbitrary graphical measurement.

**Feedback.** Map performance spec to s-plane and test poles.

**Examples.**

1. L=K/[s(s+2)] stable for K>0, but damping changes with K. L2.
2. point−1±j√3 has ζ=.5; magnitude condition supplies K for its locus. L3.
3. if desired point fails angle condition, gain alone cannot place a pole there. L3.

**Validation/coverage.** Closed-loop roots and performance formulas.

### Cross-family progression

Endpoints and real-axis segments precede asymptotes. Angle condition precedes magnitude/gain. Breakaway and imaginary crossings follow the skeleton. Sketch selection integrates rules; gain design requires verified pole-region mapping.

## 8. Category: Frequency-domain stability and robustness

### Category purpose

Train gain/phase accumulation, stability margins, Nyquist encirclements, bandwidth, delay, and sensitivity tradeoffs.

### Learn

Feedback stability depends on how loop transfer approaches `−1`. Bode margins summarize crossover distance; Nyquist accounts for open-loop RHP poles explicitly. Sensitivity is reduced where loop gain is large, but high bandwidth can amplify measurement noise and consume robustness/control effort.

### Prerequisites

Frequency response, complex phase, closed-loop sensitivity, pole stability.

### Category boundaries

Signals & Systems owns basic Bode construction; this category uses it for control stability/performance. MIMO robustness is excluded.

### Subcategories

1. Loop Bode construction
2. Margins/crossovers
3. Nyquist criterion
4. Bandwidth/sensitivity
5. Delay and uncertainty

### Family `loop_bode_accumulate`

**Task.** Construct/read asymptotic loop magnitude/phase from factored controller/plant/sensor.

**Response/template.** Slope/phase table or plot choice: `Combine {C,G,H} into loop Bode data.`

**Derivation.** Add dB magnitudes/phases of factors; delays add phase only.

**Difficulty.** L1 gain/integrator; L2 two corners; L3 lead/lag/delay; L4 infer missing factor.

**Misconceptions/constraints.** At most four effective factors; exact landmark/asymptotic values.

**Feedback.** One factor row and cumulative row.

**Examples.**

1. K/s → magnitude slope−20 dB/dec, phase−90°. L1.
2. pole at10 adds −20 slope after10 and phase lag transition. L2.
3. delay leaves magnitude unchanged and adds−ωTd phase. L3.

**Validation/coverage.** Complex evaluation and asymptote event sweep.

### Family `gain_crossover_phase_margin`

**Task.** Find gain crossover and phase margin from exact response/table/plot.

**Response/template.** ωgc,PM: `At 0-dB crossover {data}, find phase margin.`

**Derivation.** Locate |L|=1; PM=180°+phase on declared branch.

**Difficulty.** L1 crossover supplied; L2 interpolate log-linear table; L3 multiple crossovers with policy; L4 no crossover.

**Misconceptions/constraints.** Crossover policy explicit; exact plot landmarks. Distractors use phase crossover.

**Feedback.** Mark 0 dB then angular distance to−180°.

**Examples.**

1. phase−135° at ωgc → PM45°. L1.
2. phase−200° at relevant crossover → PM−20°, warning of instability under usual assumptions. L2.
3. no gain crossover → PM undefined under profile, not automatically infinite. L3.

**Validation/coverage.** Complex/table crossover detector and Nyquist stability cross-check.

### Family `phase_crossover_gain_margin`

**Task.** Find phase crossover and gain margin ratio/dB.

**Response/template.** ωpc,GM,GMdB: `At −180° crossover {data}, find gain margin.`

**Derivation.** `GM=1/|L|`; dB is negative of loop magnitude dB.

**Difficulty.** L1 dB given; L2 ratio conversion; L3 multiple/no crossover; L4 infer gain change to boundary.

**Misconceptions/constraints.** “Gain margin dB” not current loop gain dB.

**Feedback.** Show gain needed to bring point to unit magnitude.

**Examples.**

1. magnitude−12 dB at ωpc → GM=+12 dB. L1.
2. |L|=.25 → GM=4≈12.04 dB. L2.
3. |L|=2 → GM=.5=−6.02 dB. L2.

**Validation/coverage.** Ratio/dB round trip and crossover semantics.

### Family `margin_gain_change`

**Task.** Predict how multiplying loop gain changes crossover/margins or determine allowable gain factor from GM.

**Response/template.** Gain factor/new margin/status: `Change loop gain by {factor}; determine {effect}.`

**Derivation.** Add `20log10K` to magnitude, phase unchanged at fixed frequencies; recompute crossover/margins from semantic response.

**Difficulty.** L1 margin factor; L2 crossover shift; L3 phase margin changes indirectly; L4 multiple crossover.

**Misconceptions/constraints.** Do not say phase margin is unchanged just because phase curve is unchanged; crossover moves.

**Feedback.** Shift magnitude plot and re-read phase at new crossover.

**Examples.**

1. GM=4 means gain can multiply by4 to marginal boundary under profile. L1.
2. doubling gain shifts magnitude +6.02 dB. L1.
3. phase curve unchanged but PM generally changes because ωgc changes. L3.

**Validation/coverage.** Scaled complex response and crossover recomputation.

### Family `nyquist_encirclement_count`

**Task.** Count clockwise encirclements of−1 from a semantic Nyquist path.

**Response/template.** Signed integer: `Using clockwise-positive convention, find Ncw.`

**Derivation.** Compute winding number of ordered curve about−1, including contour direction and conjugate branch.

**Difficulty.** L1 none/one; L2 counterclockwise negative; L3 multiple/near crossing; L4 indentation declared.

**Misconceptions/constraints.** Plots constructed with clear non-boundary curves unless marginal case intended.

**Feedback.** Animate traversal/winding with textual crossings.

**Examples.**

1. no encirclement → Ncw=0. L1.
2. one clockwise →+1. L1.
3. one counterclockwise →−1. L2.

**Validation/coverage.** Numeric winding-number algorithm and topology fixtures.

### Family `nyquist_closed_loop_stability`

**Task.** Use P and encirclements to find Z/closed-loop stability requirement.

**Response/template.** Z and stable yes/no: `Given P={P},Ncw={N}, find Z.`

**Derivation.** `Z=P+Ncw`; stable iff Z=0 and no boundary roots.

**Difficulty.** L1 P=0; L2 P>0; L3 required encirclements; L4 boundary passage.

**Misconceptions/constraints.** Clockwise convention repeated. Distractors use Z=N−P.

**Feedback.** Substitute into pinned equation.

**Examples.**

1. P=0,N=0 → Z=0 stable if no boundary crossing. L1.
2. P=1 requires Ncw=−1 (one counterclockwise) for Z=0. L2.
3. P=2,Ncw=−1 → Z=1 unstable. L2.

**Validation/coverage.** Closed-loop polynomial roots and winding theorem.

### Family `nyquist_plot_select`

**Task.** Choose a Nyquist plot consistent with poles, low/high-frequency behavior, symmetry, and stability.

**Response/template.** Graph choice: `Which Nyquist plot matches {L}?`

**Derivation.** Evaluate anchor frequencies/limits, conjugate symmetry, direction, and winding.

**Difficulty.** L1 stable minimum phase; L2 integrator; L3 RHP pole/zero; L4 delay loops.

**Misconceptions/constraints.** Semantic numeric curves; no pixel-only margin.

**Feedback.** Mark start/end/anchors and required winding.

**Examples.**

1. real-coefficient L has conjugate-symmetric positive/negative-frequency branches. L1.
2. strictly proper L tends0 as ω→∞. L1.
3. open-loop RHP pole changes required encirclement, not necessarily plot start alone. L3.

**Validation/coverage.** High-precision contour mapping and invariant checks.

### Family `sensitivity_bandwidth_tradeoff`

**Task.** Compare S,T and bandwidth effects across two loop designs.

**Response/template.** Choice/table: `Which design better meets {tracking,disturbance,noise} at specified bands?`

**Derivation.** Evaluate |S|,|T|, control transfer at named frequencies; low |S| aids error/disturbance, high |T| passes reference/measurement noise depending path.

**Difficulty.** L1 numeric samples; L2 band comparison; L3 waterbed caveat conceptual; L4 competing specs.

**Misconceptions/constraints.** No universal “higher bandwidth better.” Noise injection location explicit.

**Feedback.** One transfer path per requirement.

**Examples.**

1. |L|≫1 low frequency → |S|≈1/|L| small, |T|≈1. L1.
2. unity sensor noise output path is−T, so high-frequency |T| should be limited. L2.
3. design with lower S at low frequency but larger T near noise band has a tradeoff. L3.

**Validation/coverage.** Exact complex S/T and requirement scoring.

### Family `delay_margin_effect`

**Task.** Compute added phase lag from delay and assess updated phase margin/crossover implication.

**Response/template.** Phase/new PM/status: `A delay Td is added; at ωgc={w}, find effect.`

**Derivation.** Added phase degrees=`−ωTd·180/π`; magnitude unchanged; subtract from PM if crossover unchanged, or recompute when data supplied.

**Difficulty.** L1 fixed crossover; L2 max delay for PM; L3 crossover shift with other changes; L4 delay margin.

**Misconceptions/constraints.** Fixed-crossover approximation labeled. Td≥0.

**Feedback.** Convert time delay to phase at frequency.

**Examples.**

1. Td=.1,ω=5 →−0.5 rad≈−28.65°. L1.
2. original PM60° at same crossover → approximate new31.35°. L2.
3. maximum extra delay for30° phase allowance at ω=10 is `(π/6)/10=π/60 s`. L3.

**Validation/coverage.** Complex delay multiplication and margin recomputation.

### Family `robust_stability_uncertainty`

**Task.** Apply a supplied SISO multiplicative-uncertainty sufficient test.

**Response/template.** Yes/no/worst ratio: `Given |WΔ| bound and |T| samples, does |W T|<1 hold?`

**Derivation.** Evaluate product across supplied bands/grid; strict bound at all frequencies certifies under the declared small-gain profile.

**Difficulty.** L1 one frequency; L2 table; L3 find maximum allowable uncertainty; L4 failure means “not certified,” not necessarily unstable.

**Misconceptions/constraints.** The theorem/profile displayed. Distractors interpret failed sufficient test as proven instability.

**Feedback.** Mark worst-frequency product and theorem conclusion.

**Examples.**

1. max |W T|=.6<1 → robust stability certified under model. L2.
2. value1.2 → test fails; robustness not certified. L2.
3. if max |T|=2, uniform uncertainty bound must be <.5 for strict test. L3.

**Validation/coverage.** Grid/analytic maxima from generated simple profiles.

### Cross-family progression

Loop Bode accumulation precedes margins. Gain and phase margins are separate before gain-change interaction. Encirclement counting precedes Nyquist stability. Sensitivity/bandwidth follows S/T foundations. Delay and uncertainty are advanced robustness constraints.

## 9. Category: Classical controller and compensator design

### Category purpose

Train bounded selection/tuning of controller structure from explicit steady-state, transient, stability, noise, and effort requirements.

### Learn

P changes loop gain. Integral action raises low-frequency gain/type but adds phase lag and windup risk. Derivative/lead adds phase near crossover and responds strongly to high-frequency noise unless filtered. Lag raises low-frequency gain relative to crossover. Design is a tradeoff verified in the closed loop.

### Prerequisites

Steady-state error, root locus, margins, transient specs.

### Category boundaries

No arbitrary numerical optimization or real deployment. Every design family has a finite parameter grammar and independent forward verification.

### Subcategories

1. P/PI/PD/PID effects
2. Lead/lag design
3. Pole/zero coefficient matching
4. Gain/root-locus design
5. Saturation and windup

### Family `controller_structure_classify`

**Task.** Identify P/PI/PD/PID/lead/lag from transfer/equation and list poles/zeros.

**Response/template.** Type and features: `Classify C(s)={C}.`

**Derivation.** Normalize controller form, inspect origin pole and zeros/poles.

**Difficulty.** L1 ideal P/PI/PD; L2 PID; L3 filtered derivative/lead/lag; L4 equivalent forms.

**Misconceptions/constraints.** Distinguish ideal PD (improper) from realizable filtered derivative. Lead/lag defined by pole/zero ordering.

**Feedback.** Factor and mark origin/relative locations.

**Examples.**

1. `Kp` → P. L1.
2. `K(s+z)/s` → PI with zero−z. L2.
3. `K(s+z)/(s+p)`, p>z>0 → lead (pole farther left/higher break frequency). L3.

**Validation/coverage.** Factored-controller schema.

### Family `controller_effect_select`

**Task.** Choose likely controller modification for one diagnosed deficiency under explicit caveats.

**Response/template.** Single/multiple choice: `Which change most directly addresses {deficiency}?`

**Derivation.** Use curated effect matrix, then require forward validation metadata.

**Difficulty.** L1 step error→integral; L2 phase margin→lead; L3 noise/control effort tradeoff; L4 conflicting goals.

**Misconceptions/constraints.** Avoid universal claims; “likely/under this model” wording. Exactly one best among supplied options.

**Feedback.** State benefit and new risk.

**Examples.**

1. stable type0 with nonzero step error → integral action can raise type. L1.
2. need positive phase near crossover → lead/PD-like action. L2.
3. high sensor noise discourages unfiltered derivative/high high-frequency gain. L3.

**Validation/coverage.** Forward simulations/margins for all choices.

### Family `proportional_gain_design`

**Task.** Choose Kp to meet one/two algebraic closed-loop specifications.

**Response/template.** Gain/range: `For plant {G} with P control, find K meeting {spec}.`

**Derivation.** Build characteristic/closed transfer, solve error/pole/margin constraint, verify stability and all specs.

**Difficulty.** L1 first-order pole; L2 steady error; L3 combined bound; L4 no feasible K.

**Misconceptions/constraints.** K≥0 unless stated. No assumption increasing K always helps.

**Feedback.** Translate each requirement to K inequality and intersect.

**Examples.**

1. G=1/(s+1), unity, C=K → pole−(1+K). L1.
2. same step error `1/(1+K)≤.1` → K≥9. L2.
3. actuator/control-effort bound may impose upper K, creating feasibility interval. L3.

**Validation/coverage.** Closed-loop roots/error/internal U response.

### Family `pi_parameter_match`

**Task.** Select PI gains/zero to achieve a target low-order characteristic polynomial.

**Response/template.** Kp,Ki/zero fields: `For {plant}, match closed-loop denominator to {target}.`

**Derivation.** `C=Kp+Ki/s`; form characteristic, equate coefficients, require valid gains, verify.

**Difficulty.** L1 first-order plant→second order; L2 target ζ,ωn; L3 extra pole/cancellation warning; L4 infeasible sign.

**Misconceptions/constraints.** Exact simple plants. Avoid relying on cancellation for unstable modes.

**Feedback.** Coefficient table and resulting zero.

**Examples.**

1. G=1/s, unity PI → characteristic `s²+Kp s+Ki`. L1.
2. target `s²+4s+9` → Kp=4,Ki=9. L2.
3. positive gains yield PI zero at−Ki/Kp. L2.

**Validation/coverage.** Symbolic coefficient reconstruction and roots.

### Family `pd_parameter_match`

**Task.** Choose ideal/filtered PD parameters for a target characteristic effect under a declared plant.

**Response/template.** Kp,Kd/zero fields: `Match {target denominator} using C=Kp+Kd s.`

**Derivation.** Form characteristic and equate coefficients; report improper/high-frequency caveat for ideal derivative.

**Difficulty.** L1 second-order plant; L2 ζ/ωn; L3 filtered derivative supplied; L4 infeasible coefficient.

**Misconceptions/constraints.** No derivative kick/noise claim beyond model. Properness explicitly assessed.

**Feedback.** Show which coefficient damping term changes.

**Examples.**

1. plant `1/s²`, PD unity → characteristic `s²+Kd s+Kp`. L1.
2. target `s²+6s+25` → Kd=6,Kp=25. L2.
3. ideal Kd s has unbounded high-frequency magnitude; filtered implementation differs. L3.

**Validation/coverage.** Closed-loop polynomial and frequency/properness check.

### Family `pid_term_contribution`

**Task.** Compute PID output for a short error history/instant using supplied integral/derivative states.

**Response/template.** P,I,D,total fields: `For PID gains and {error data}, find u.`

**Derivation.** Continuous ideal `u=Kp e+Ki∫e+Kd de/dt`; discrete implementation uses displayed difference/integral update.

**Difficulty.** L1 supplied components; L2 short discrete trace; L3 derivative filter state; L4 saturation applied after unsaturated u.

**Misconceptions/constraints.** Convention/time step explicit. No numerical differentiation from noisy real data.

**Feedback.** Separate contributions.

**Examples.**

1. Kp=2,Ki=1,Kd=.5,e=3,integral4,e'=−2 → u=6+4−1=9. L1.
2. derivative term reacts to rate, not accumulated error. L1.
3. output limit±5 clips unsaturated9 to5 under stated saturation. L2.

**Validation/coverage.** Controller state-update simulator.

### Family `lead_compensator_phase`

**Task.** Compute maximum phase lead/frequency or choose pole/zero for a required phase contribution.

**Response/template.** α,φmax,ωm/parameters: `For lead C=K(1+s/z)/(1+s/p), p>z, find {target}.`

**Derivation.** With α=z/p<1 in pinned form, `sin φmax=(1−α)/(1+α)`, `ωm=sqrt(zp)`.

**Difficulty.** L1 ωm; L2 phase; L3 inverse α; L4 place around crossover with gain adjustment.

**Misconceptions/constraints.** Parameter convention repeated because α definitions vary.

**Feedback.** Mark zero below pole in frequency.

**Examples.**

1. z=1,p=9 → ωm=3 rad/s,α=1/9. L2.
2. α=1/3 → sinφmax=1/2 → φmax=30°. L2.
3. lead raises high-frequency gain by p/z relative to low-frequency gain. L3.

**Validation/coverage.** Exact frequency response maximum and formula round trip.

### Family `lag_compensator_low_frequency`

**Task.** Choose/evaluate lag parameters for a desired low-frequency gain improvement with bounded crossover impact.

**Response/template.** pole/zero ratio and gain effects: `For lag {form}, find DC/high-frequency ratio.`

**Derivation.** Use explicitly normalized form; place pole closer to origin than zero for lag, compute gain ratio and phase.

**Difficulty.** L1 classify ordering; L2 ratio; L3 place breaks below crossover; L4 verify margin loss.

**Misconceptions/constraints.** Convention displayed. Forward frequency verification required.

**Feedback.** Compare low/high limits and phase sign.

**Examples.**

1. `(s+0.1)/(s+0.01)` has low-frequency gain10, high-frequency1 and negative phase region: lag. L2.
2. pole closer to origin than zero produces phase lag. L1.
3. placing both a decade below crossover aims to limit crossover-phase disturbance, then must be checked. L3.

**Validation/coverage.** Complex frequency limits and margin recomputation.

### Family `compensator_design_verify`

**Task.** Verify whether a candidate P/PI/PD/lead/lag controller meets a finite spec set.

**Response/template.** Pass/fail per spec plus first failure: `Evaluate {candidate_controller} for {plant,specs}.`

**Derivation.** Build closed loop; check properness/internal stability, error, poles/time metrics, margins, bandwidth/noise/effort bounds as supplied.

**Difficulty.** L1 two algebraic specs; L2 time+error; L3 margin/noise; L4 misleading near-pass/infeasible.

**Misconceptions/constraints.** Every spec precisely defined; no free-form “good controller.”

**Feedback.** Requirements table with computed values.

**Examples.**

1. controller eliminating step error but destabilizing loop fails overall. L2.
2. lead meeting PM but violating noise gain bound fails that spec. L3.
3. all inequalities and internal stability pass → accepted only for idealized model. L3.

**Validation/coverage.** Independent pole/frequency/time simulation and constraint engine.

### Family `integrator_windup_antiwindup`

**Task.** Trace integrator state under actuator saturation and compare a declared anti-windup rule.

**Response/template.** Short state/output table: `Process {error sequence} with saturation {limits}.`

**Derivation.** Compute unsaturated u, clip, update integrator according to none/clamping/back-calculation rule explicitly supplied.

**Difficulty.** L1 one saturation step; L2 sustained error; L3 sign reversal/recovery; L4 compare rules.

**Misconceptions/constraints.** Toy discrete controller, at most six steps. Not real tuning advice.

**Feedback.** Separate requested, applied output, and stored integral.

**Examples.**

1. without anti-windup, positive error continues increasing integral while u is clipped. L1.
2. conditional integration freezes I when saturation and error drive farther into limit. L2.
3. after error reverses, wound-up integrator delays recovery. L3.

**Validation/coverage.** Deterministic nonlinear controller simulator.

### Cross-family progression

Structure/effects precede parameter matching. P design is simplest; PI/PD coefficient matching follows steady/transient goals. PID term traces teach implementation state. Lead/lag formulas are convention-pinned and forward-verified. Multi-spec verification and windup are capstone practical checks.

## 10. Category: State-space control and observers

This category is a bounded bridge from classical control to modern control. It uses small real matrices, almost always SISO systems of order two or three. The app should exercise meaning, rank, pole placement, and observer reasoning without turning into a general linear-algebra system.

### Category purpose

Connect internal-state models to feasibility and design: determine whether inputs can influence modes, whether outputs reveal them, and whether feedback and observers place the intended poles.

### Learn

A state-space model describes internal dynamics with `x_dot=Ax+Bu` and `y=Cx+Du`. Controllability asks whether input can move every relevant mode; observability asks whether output history can reveal it. Full-state feedback changes dynamics to `A-BK`. A full-order observer has estimation-error dynamics `A-LC`. Transfer functions describe zero-state input-output behavior, but may hide internal modes.

### Prerequisites

Small matrix products, determinants, rank, eigenvalues, characteristic polynomials, and closed-loop pole interpretation.

### Category boundaries

This category covers SISO realizations of order at most three, exact rank tests, bounded pole placement, and deterministic full-order observers. General matrix theory belongs in Linear Algebra; Kalman filtering, stochastic estimation, LQR, and MIMO design are excluded.

### Subcategories

1. State equations and realizations
2. Controllability and observability
3. Hidden internal modes
4. State feedback and reference scaling
5. Full-state observers and separation

### Family `state_space_signal_equations`

**Task.** Evaluate the state derivative and output, or infer matrix dimensions, for

```text
x_dot = Ax + Bu
y = Cx + Du
```

**Response/template.** Numeric vector/scalar or dimension choice: `Given {A,B,C,D,x,u}, find {x_dot,y}.`

**Derivation.** Perform the displayed matrix-vector products and additions.

**Difficulty.** L1 scalar/two-state dimensions; L2 numeric two-state evaluation; L3 multiple inputs or outputs; L4 infer one missing entry from a measurement.

**Misconceptions/constraints.** State components need not be physical outputs. All vector orientations and dimensions are rendered explicitly.

**Feedback.** Show `Ax`, `Bu`, `Cx`, and `Du` separately before combining.

**Examples.**

1. `A=[[0,1],[-2,-3]], B=[[0],[1]], x=[1,2]^T, u=4` gives `x_dot=[2,-4]^T`. L2.
2. `C=[1,0], D=0` and the same state give `y=1`. L1.
3. two states and one input require `A:2×2`, `B:2×1`. L1.

**Validation/coverage.** Exact rational matrix arithmetic and dimension checks.

### Family `state_space_transfer_realization`

**Task.** Find the transfer function of a small realization, or choose a realization for a supplied transfer function.

**Response/template.** Factored/rational transfer or multiple choice: `Find G(s)=Y(s)/U(s), assuming x(0)=0.`

**Derivation.** Use

```text
G(s) = C(sI-A)^(-1)B + D
```

then normalize the rational expression. Reverse questions forward-derive each candidate.

**Difficulty.** L1 diagonal first-order modes; L2 two-state companion form; L3 nonzero `D` or hidden mode; L4 minimality reasoning.

**Misconceptions/constraints.** The zero-initial-state assumption is stated. A transfer function can conceal uncontrollable or unobservable internal modes; transfer equivalence does not prove internal equivalence.

**Feedback.** Show `sI-A`, determinant, numerator, and any cancellation while retaining a note about original modes.

**Examples.**

1. `A=[-2],B=[1],C=[3],D=0` gives `3/(s+2)`. L1.
2. controllable canonical realization of `1/(s²+3s+2)` is selected from four candidates. L2.
3. a realization with an unobservable unstable state may have a stable-looking transfer function but is not internally stable. L4.

**Validation/coverage.** Symbolic matrix inverse for order at most three; compare uncancelled characteristic modes.

### Family `controllability_rank`

**Task.** Construct the controllability matrix and decide whether every state is controllable.

**Response/template.** matrix, rank, and yes/no:

```text
C_ctrb = [B AB ... A^(n-1)B]
```

**Derivation.** Generate matrix powers exactly and compute rank using rational elimination.

**Difficulty.** L1 recognize dimensions; L2 two-state rank; L3 three-state or parameter value; L4 identify the uncontrollable eigenvalue.

**Misconceptions/constraints.** Nonzero `B` alone is insufficient. Near-zero floating determinants are avoided; generated matrices have exact small integer/rational rank.

**Feedback.** Show columns and one row-reduction or determinant check.

**Examples.**

1. `A=diag(-1,-2), B=[1,0]^T` has rank1 and is not controllable. L2.
2. `A=[[0,1],[-2,-3]], B=[0,1]^T` gives determinant `-1`, hence rank2. L2.
3. solve for the parameter value making `[B AB]` singular. L3.

**Validation/coverage.** Exact rank and PBH cross-check for advanced questions.

### Family `observability_rank`

**Task.** Construct the observability matrix and decide whether the initial state can be inferred from ideal input/output history.

**Response/template.** matrix, rank, and yes/no:

```text
O_obsv = [C; CA; ...; CA^(n-1)]
```

**Derivation.** Generate row blocks and compute exact rank.

**Difficulty.** L1 recognize dimensions; L2 two-state rank; L3 three-state/parameter; L4 identify the unobservable mode.

**Misconceptions/constraints.** Measuring one state can still reveal others through dynamics. Observability is not the same as sensor accuracy.

**Feedback.** Display every row block and the rank test.

**Examples.**

1. `A=diag(-1,-2), C=[1,0]` has rank1. L2.
2. `A=[[0,1],[-2,-3]], C=[1,0]` gives `O=[[1,0],[0,1]]`. L2.
3. choose a sensor row `C` that makes a supplied two-state system observable. L3.

**Validation/coverage.** Exact rank and PBH cross-check.

### Family `hidden_modes_internal_behavior`

**Task.** Identify controllable/observable and hidden modes, and distinguish input-output behavior from internal behavior.

**Response/template.** mode labels or stability classification: `For {A,B,C}, classify each eigenmode.`

**Derivation.** Use controllability/observability tests, modal structure, and the uncancelled state eigenvalues.

**Difficulty.** L1 diagonal systems; L2 one hidden stable mode; L3 hidden unstable mode; L4 non-diagonal/PBH test.

**Misconceptions/constraints.** Pole-zero cancellation in `G(s)` never erases the physical internal mode. Prompts distinguish “BIBO transfer stability” from “internal asymptotic stability.”

**Feedback.** Show how each mode couples to input and output.

**Examples.**

1. a stable unobservable mode is absent from `G(s)` but remains in the state. L2.
2. an unstable uncontrollable mode cannot be stabilized by state feedback. L3.
3. a stable-looking reduced transfer with a hidden pole at `+1` is not internally stable. L3.

**Validation/coverage.** Eigenvalue, PBH, and transfer-cancellation agreement.

### Family `state_feedback_poles`

**Task.** Evaluate closed-loop poles under full-state feedback

```text
u = -Kx + Nr
```

**Response/template.** eigenvalues or characteristic polynomial: `Find poles of A-BK.`

**Derivation.** Form `A-BK`, its characteristic polynomial, and roots.

**Difficulty.** L1 scalar; L2 two-state integer roots; L3 complex pair; L4 compare candidate gains or stability range.

**Misconceptions/constraints.** The minus sign is printed in every prompt. `N` affects reference scaling, not the eigenvalues of `A-BK`.

**Feedback.** Show `BK`, `A-BK`, polynomial, and pole classification.

**Examples.**

1. `A=[1], B=[1], K=[3]` gives pole `-2`. L1.
2. compare two `K` vectors for faster stable poles. L2.
3. changing `N` alone leaves closed-loop poles unchanged. L1.

**Validation/coverage.** Independent matrix and polynomial eigenvalue paths.

### Family `state_feedback_place`

**Task.** Choose `K` to place the poles of a controllable small SISO system.

**Response/template.** gain vector: `Find K so eig(A-BK)={desired_poles}.`

**Derivation.** Match the coefficients of `det(sI-(A-BK))` to the desired polynomial; an advanced explanation may use Ackermann's formula.

**Difficulty.** L1 scalar; L2 two-state controllable canonical form; L3 general two-state system; L4 repeated/complex poles and verification.

**Misconceptions/constraints.** Generated systems are controllable. Desired complex poles occur in conjugate pairs. The answer is always substituted back.

**Feedback.** Show desired polynomial, coefficient equations, solved `K`, and achieved poles.

**Examples.**

1. choose scalar `K` to move pole `+1` to `-4`. L1.
2. place a companion-form system at `{-2,-3}`. L2.
3. an uncontrollable-system distractor is rejected before solving. L3.

**Validation/coverage.** Exact coefficient solve plus eigenvalue substitution.

### Family `reference_prefilter_gain`

**Task.** Choose the scalar prefilter `N` for unit steady-state tracking under state feedback.

**Response/template.** exact scalar:

```text
u = -Kx + Nr
```

For stable `A-BK`, SISO, `D=0`,

```text
N = -1 / (C(A-BK)^(-1)B)
```

**Derivation.** Set `x_dot=0`, solve the equilibrium, and impose `y_ss=r_ss`.

**Difficulty.** L1 evaluate supplied DC mapping; L2 scalar system; L3 two-state inverse; L4 nonzero `D` derived from equilibrium rather than formula recall.

**Misconceptions/constraints.** The sign follows the displayed feedback convention. A prefilter improves nominal command scaling but does not add integral disturbance rejection.

**Feedback.** Show equilibrium equations and the resulting reference-to-output DC gain before scaling.

**Examples.**

1. if the closed-loop path from `Nr` to `y` has DC gain `1/4`, choose `N=4`. L1.
2. recompute rather than applying the `D=0` shortcut when `D≠0`. L4.
3. a nominal prefilter does not guarantee zero error under plant mismatch. L3.

**Validation/coverage.** Equilibrium solver and direct closed-loop DC check.

### Family `observer_error_poles`

**Task.** Evaluate or place full-order observer poles for

```text
xhat_dot = Axhat + Bu + L(y-Cxhat)
```

**Response/template.** eigenvalues or observer gain: `Find poles of A-LC` or `choose L`.

**Derivation.** With `e_x=x-xhat`, derive `e_x_dot=(A-LC)e_x`, then evaluate or coefficient-match.

**Difficulty.** L1 scalar observer; L2 evaluate two-state gain; L3 place two-state observable system; L4 compare speed/noise tradeoff.

**Misconceptions/constraints.** `L` is a column for a scalar output. Faster ideal poles are not declared universally better because measurement noise and model error matter.

**Feedback.** Show the error-dynamics derivation, matrix, polynomial, and poles.

**Examples.**

1. scalar `A=1,C=1,L=4` gives observer-error pole `-3`. L1.
2. solve a two-state `L` for desired observer poles `{-5,-6}`. L3.
3. much faster observer poles may amplify measurement noise in the estimate. L4.

**Validation/coverage.** Dual pole-placement calculation and direct eigenvalue check.

### Family `separation_principle`

**Task.** Reason about an observer-based state-feedback controller and its combined poles.

**Response/template.** pole multiset or feasibility choice: `Given controller poles and observer poles, list augmented closed-loop poles.`

**Derivation.** Use triangular coordinates in state and estimation error; under the standard assumptions, the combined eigenvalues are those of `A-BK` together with those of `A-LC`.

**Difficulty.** L1 union of pole lists; L2 stability decision; L3 required controllability/observability; L4 hidden-mode limitation.

**Misconceptions/constraints.** The result does not make the controller and observer transients independent in every measured signal. It requires stabilizability/detectability for the corresponding unstable modes.

**Feedback.** Render the two pole sets and the augmented triangular structure.

**Examples.**

1. controller poles `{-2,-3}` and observer poles `{-8,-9}` give four augmented poles. L1.
2. one unstable observer pole makes the combined ideal system unstable. L2.
3. an undetectable unstable mode cannot be repaired by choosing `L`. L3.

**Validation/coverage.** Augmented-matrix eigenvalue cross-check.

### Cross-family progression

Learners first interpret state equations, then connect realizations to transfer functions. Controllability, observability, and hidden modes establish feasibility before gain design. State feedback, reference scaling, observer design, and the separation principle form a coherent capstone. State-space questions must not assume that classical input-output stability proves acceptable internal behavior.

## 11. Category: Sampled-data and discrete control

This is a limited extension, not a complete digital-control course. It focuses on sampling consequences, difference-equation execution, the `z`-domain feedback algebra, pole stability, and verification. Every problem labels the sampling period and whether a signal is continuous or sampled.

### Category purpose

Transfer established feedback reasoning to sampled implementations while making sample memory, unit-circle stability, discretization choice, and computational delay explicit.

### Learn

A digital controller operates on samples and stores previous values. A delay of one sample is `z^-1`; asymptotic stability requires closed-loop poles strictly inside the unit circle. The negative-feedback algebra still gives a denominator `1+L(z)`, but continuous pole geometry and final-value rules cannot be copied without translation. Under sampling period `T`, a continuous pole maps as `z=e^(sT)`.

### Prerequisites

Continuous feedback relationships, recurrence tracing, complex magnitude/angle, and basic `z`-transform notation.

### Category boundaries

This category covers short deterministic controller traces, small rational `z` models, explicit discretization formulas, stability, steady state, and delay. It excludes full intersample reconstruction theory, multirate control, quantization/noise-shaping design, processor scheduling, and hardware deployment.

### Subcategories

1. Controller recurrences
2. Discrete closed loops and poles
3. Continuous/discrete pole relationships
4. Difference equations and steady state
5. Discretization, delay, and verification

### Family `sampled_controller_trace`

**Task.** Execute a supplied difference-equation controller over a short error sequence.

**Response/template.** numeric table: `Given e[k] and initial memory, find u[k].`

**Derivation.** Apply the recurrence in sample order using stored prior values.

**Difficulty.** L1 proportional; L2 accumulator/PI; L3 derivative and saturation; L4 two stored states with anti-windup rule.

**Misconceptions/constraints.** Update order is explicit. At most eight samples. Initial values and saturation timing are never implicit.

**Feedback.** Table columns show current input, old memory, raw output, applied output, and new memory.

**Examples.**

1. `u[k]=2e[k]` for `[1,0,-1]` gives `[2,0,-2]`. L1.
2. `I[k]=I[k-1]+0.5e[k]`, `I[-1]=0` is traced for four samples. L2.
3. clipping occurs after computing the raw controller output. L3.

**Validation/coverage.** Deterministic recurrence interpreter and hand-coded fixtures.

### Family `z_domain_closed_loop`

**Task.** Reduce a declared discrete feedback loop and identify reference, error, or disturbance transfer functions.

**Response/template.** rational expression in `z` or `z^-1`: `Find Y(z)/R(z).`

**Derivation.** Use the same signal equations as continuous feedback, with all blocks expressed in the `z` domain.

**Difficulty.** L1 unity constant blocks; L2 first-order rational blocks; L3 disturbance/noise injection; L4 nested digital loops.

**Misconceptions/constraints.** A question uses either positive powers of `z` or delays `z^-1` consistently. Initial conditions are zero for transfer functions.

**Feedback.** Show loop transfer, denominator, and normalized rational form.

**Examples.**

1. unity negative feedback gives `T(z)=L(z)/(1+L(z))`. L1.
2. output disturbance maps through `S(z)=1/(1+L(z))`. L2.
3. a one-sample delay is retained as `z^-1`, not treated as gain one. L2.

**Validation/coverage.** Rational polynomial arithmetic in a pinned representation.

### Family `discrete_pole_stability`

**Task.** Classify a discrete closed loop from its poles or characteristic polynomial.

**Response/template.** stable/marginal/unstable plus offending pole: `Classify poles {list}.`

**Derivation.** Check `|z_i|<1` for asymptotic stability. Boundary cases are generated only with a stated bounded-input or mode-specific question.

**Difficulty.** L1 real poles; L2 complex pairs; L3 repeated unit-circle poles; L4 parameter ranges.

**Misconceptions/constraints.** Negative real poles inside the unit circle are stable but alternating. Left-half-plane rules do not apply directly in the `z` plane.

**Feedback.** Show each pole magnitude and mark it on a unit-circle plot.

**Examples.**

1. `z=-0.8` is stable and alternating. L1.
2. `0.7±0.7j` have magnitude about `0.990`, hence stable. L2.
3. pole `1.02` is unstable even though its real part is positive but small. L1.

**Validation/coverage.** Exact squared-magnitude comparisons when possible.

### Family `continuous_discrete_pole_map`

**Task.** Map pole locations between continuous and sampled domains using

```text
z = exp(sT)
```

**Response/template.** numeric complex pole, decay factor, or qualitative region.

**Derivation.** For `s=σ+jω`, use magnitude `e^(σT)` and angle `ωT` modulo `2π`.

**Difficulty.** L1 real decay; L2 complex pole; L3 alias-equivalent angles; L4 infer damping/frequency with branch stated.

**Misconceptions/constraints.** Sampling period `T` is always supplied. Inverting the map requires a specified frequency branch because the complex logarithm is multivalued.

**Feedback.** Separate magnitude/angle and relate LHP to the unit-circle interior.

**Examples.**

1. `s=-2`, `T=0.1` maps to `z=e^-0.2≈0.819`. L1.
2. `s=-1+j5`, `T=0.2` maps to magnitude `e^-0.2` and angle `1 rad`. L2.
3. the imaginary axis maps to the unit circle. L1.

**Validation/coverage.** Complex exponential plus round-trip on a pinned branch.

### Family `difference_equation_transfer`

**Task.** Convert between a linear difference equation and a transfer function.

**Response/template.** rational `H(z)` or recurrence: `Assume zero initial conditions.`

**Derivation.** Apply the shift property to every term, collect `Y(z)` and `U(z)`, and divide.

**Difficulty.** L1 one delay; L2 first-order IIR; L3 second-order; L4 normalize between `z` and `z^-1`.

**Misconceptions/constraints.** Delay indexing and initial conditions are printed. The app never silently changes transform convention.

**Feedback.** Show transformed equation, collected factors, and final normalization.

**Examples.**

1. `y[k]=0.5y[k-1]+u[k]` gives `Y/U=1/(1-0.5z^-1)`. L2.
2. `y[k]=u[k-1]` gives `H(z)=z^-1`. L1.
3. convert `(z+1)/(z-0.25)` to a causal normalized delay form. L3.

**Validation/coverage.** Symbolic recurrence/transfer round trip.

### Family `discrete_steady_state_error`

**Task.** Compute sampled steady-state values or error where the discrete final-value theorem applies.

**Response/template.** exact/numeric limit:

```text
lim(k→∞) y[k] = lim(z→1) (z-1)Y(z)
```

**Derivation.** Build the relevant transfer, form the transform for the declared sampled input, check closed-loop conditions, and evaluate.

**Difficulty.** L1 stable constant recurrence; L2 step tracking; L3 ramp/type analogy; L4 theorem-inapplicable distractor.

**Misconceptions/constraints.** The checker first tests the theorem’s pole conditions. It never reports an algebraic limit as a steady value for an unstable or persistent-oscillation case.

**Feedback.** Show the condition check before substitution.

**Examples.**

1. a stable unity loop with `S(1)=0.2` has step error `0.2`. L2.
2. a pole outside the unit circle invalidates the claimed final value. L2.
3. an integrator pole at `z=1` in the loop can eliminate a finite step error when the resulting closed loop is stable. L3.

**Validation/coverage.** Limit calculation plus closed-loop pole verification.

### Family `discretization_map`

**Task.** Apply a supplied discretization rule to a small controller or pole.

**Response/template.** rational discrete controller: `Using {forward Euler, backward Euler, Tustin}, substitute for s.`

**Derivation.** Use only the rule printed in the prompt, for example

```text
Tustin: s = (2/T)(z-1)/(z+1)
```

then simplify and normalize.

**Difficulty.** L1 map an integrator; L2 first-order controller; L3 compare mappings; L4 prewarping only when formula is supplied.

**Misconceptions/constraints.** No discretization method is described as exact in general. Zero-order-hold plant equivalents are supplied or restricted to scalar systems; the app does not require a matrix exponential implementation in v1.

**Feedback.** Show substitution, algebra, poles/zeros, and a frequency or DC sanity check.

**Examples.**

1. Tustin maps `1/s` to `(T/2)(z+1)/(z-1)`. L2.
2. forward and backward Euler give different discrete poles for the same `1/(s+a)`. L3.
3. a mapped candidate is rejected if its coefficient normalization is algebraically wrong. L2.

**Validation/coverage.** Symbolic substitution and selected-frequency comparison.

### Family `sampling_delay_phase`

**Task.** Quantify or reason about the phase cost of sampling/computation delay.

**Response/template.** phase angle, maximum frequency, or candidate comparison: `For delay mT at ω, find added phase.`

**Derivation.** A pure delay contributes phase `-ωmT` radians in continuous-frequency interpretation; a sample delay is `z^-m`.

**Difficulty.** L1 one sample at a supplied normalized frequency; L2 convert units; L3 margin impact; L4 choose a sampling period under a phase budget.

**Misconceptions/constraints.** Radians/degrees and physical/normalized frequency are labeled. Wrap display does not erase accumulated phase lag for margin reasoning.

**Feedback.** Show delay time, angular frequency, unwrapped phase, and remaining phase margin if applicable.

**Examples.**

1. `T=0.01 s`, one-sample delay at `ω=10 rad/s` adds `-0.1 rad≈-5.73°`. L2.
2. two samples double the unwrapped delay phase. L1.
3. solve `ωT≤10°` for the largest allowed `T`. L3.

**Validation/coverage.** Unit-aware exact calculation and direct complex response.

### Family `digital_design_verify`

**Task.** Verify a proposed digital loop against stability, steady-state, transient, saturation, and sampling constraints.

**Response/template.** requirement table and first failure.

**Derivation.** Construct exact discrete closed loop; check poles, DC/error values, simulated finite response, effort limits, and sampling-delay budget.

**Difficulty.** L1 stability+gain; L2 error+settling; L3 effort/delay; L4 misleading near-pass.

**Misconceptions/constraints.** Sampled settling time is reported in both samples and seconds. Passing an ideal discrete model is not claimed to validate hardware.

**Feedback.** One computed value and pass/fail mark per requirement.

**Examples.**

1. all poles inside the unit circle but actuator limit exceeded → overall fail. L2.
2. five-sample settling with `T=20 ms` means `0.10 s`. L1.
3. a stable controller fails because the one-sample delay removes the required phase margin. L3.

**Validation/coverage.** Independent pole calculation and deterministic time simulation.

### Cross-family progression

Begin with traces and pole geometry. Then connect recurrences, transfers, and steady-state reasoning. Discretization is a named, explicit transformation rather than magic. Delay and end-to-end verification close the category. This category should be optional until the learner is comfortable with continuous feedback.

## 12. Category: Practical limitations and control architecture

The app remains a reasoning laboratory, not a plant-control tool. These exercises expose where ideal linear models stop predicting reality and why control architecture matters. All numerical systems are harmless toys.

### Category purpose

Build the habit of checking control effort, measurement quality, model mismatch, nonlinear limits, and signal placement before trusting an ideal closed-loop calculation.

### Learn

Linear transfer models are local idealizations. Saturation, rate limits, dead zones, and backlash break superposition. Sensor noise and bias enter different signal paths and have different consequences. Feedforward shapes predictable commands or measured disturbances; feedback reacts to error. A nominally successful controller still needs explicit checks against uncertainty and actuator limits.

### Prerequisites

Internal-signal transfers, equilibrium reasoning, frequency response, controller structures, and short time-step traces.

### Category boundaries

This category uses fully declared toy nonlinearities and finite uncertainty sets to teach diagnosis. It does not model a real actuator, establish safety margins, prescribe industrial hardware, or replace robust/nonlinear control theory.

### Subcategories

1. Actuator magnitude and rate limits
2. Dead zones and memory nonlinearities
3. Measurement noise and bias
4. Model uncertainty
5. Feedforward, prefilters, and architecture diagnosis

### Family `actuator_saturation_trace`

**Task.** Compare requested and applied actuator commands under hard limits, then trace the immediate loop consequence.

**Response/template.** clipped value/table: `u_applied=clip(u_requested,u_min,u_max).`

**Derivation.** Compute ideal command, clip, and apply only the clipped signal to the plant model.

**Difficulty.** L1 one clip; L2 several samples; L3 feedback recovery; L4 compare linear prediction with nonlinear trace.

**Misconceptions/constraints.** Saturation is nonlinear; transfer-function superposition cannot be used through the clipped interval.

**Feedback.** Plot requested and applied command separately and mark saturated samples.

**Examples.**

1. request `8 V` with limits `±5 V` applies `5 V`. L1.
2. doubling controller gain may not double motion once saturation is active. L2.
3. a linear closed-loop pole calculation can remain correct locally yet fail to predict a large saturated transient. L3.

**Validation/coverage.** Exact clipping and deterministic nonlinear simulation.

### Family `actuator_rate_limit_trace`

**Task.** Trace an actuator whose command may change by at most a supplied amount per sample or second.

**Response/template.** output sequence or time-to-target: `|u[k]-u[k-1]|≤Δu_max.`

**Derivation.** Move from the prior applied value toward the request by no more than the allowed increment.

**Difficulty.** L1 monotone step; L2 changing requests; L3 interaction with feedback; L4 compare rate and magnitude saturation.

**Misconceptions/constraints.** Rate limit and amplitude limit are separate and their application order is stated when both occur.

**Feedback.** Table the request, permitted interval, and applied value.

**Examples.**

1. from `0` toward `10` with limit `2/sample` gives `2,4,6,8,10`. L1.
2. reversing the request cannot instantaneously reverse the actuator. L2.
3. a command may be within amplitude bounds but still violate the slew limit. L1.

**Validation/coverage.** Deterministic limiter with boundary and reversal cases.

### Family `dead_zone_and_backlash`

**Task.** Evaluate a precisely defined toy dead-zone or backlash operator and identify its effect on small commands.

**Response/template.** numeric output/short state trace.

**Derivation.** Apply the piecewise rule supplied in the prompt; backlash questions include the necessary internal memory.

**Difficulty.** L1 static dead zone; L2 boundary cases; L3 backlash reversal trace; L4 feedback consequence.

**Misconceptions/constraints.** The mathematical operator is always displayed because real devices differ. No vague mechanical intuition is graded.

**Feedback.** Highlight the active branch of the piecewise rule and any stored state.

**Examples.**

1. for `f(u)=0` when `|u|≤1`, command `0.7` produces zero. L1.
2. command `1.4` under a declared shifted dead-zone law is evaluated from that law. L2.
3. backlash creates path-dependent output, so the same input may yield different output after opposite histories. L3.

**Validation/coverage.** Piecewise-function oracle and memory-state trace.

### Family `measurement_noise_control_effort`

**Task.** Trace how sensor noise reaches output and controller effort, especially with derivative/high-frequency gain.

**Response/template.** transfer expression, gain comparison, or short numeric trace.

**Derivation.** Inject noise at the declared measurement summing junction and derive the internal transfer to `u` or `y`.

**Difficulty.** L1 identify noise path/sign; L2 evaluate transfer magnitude; L3 compare controllers; L4 filter/noise tradeoff.

**Misconceptions/constraints.** “Noise rejection” is signal-location and frequency dependent. Low output noise does not imply low actuator activity.

**Feedback.** Animate/highlight the noise path and show both output and effort magnitudes.

**Examples.**

1. high-frequency derivative action can turn small measurement noise into large command variation. L1.
2. compute `U/N=-C/(1+CGH)` for the displayed convention. L3.
3. two controllers with similar tracking may differ greatly in high-frequency control effort. L3.

**Validation/coverage.** Symbolic signal-flow derivation and frequency-response comparison.

### Family `sensor_bias_steady_offset`

**Task.** Compute the equilibrium effect of a constant sensor bias.

**Response/template.** output, error, or control offset: `measurement=Hy+b.`

**Derivation.** Insert the bias at the named junction and solve the closed-loop DC equations.

**Difficulty.** L1 high-gain sign intuition; L2 finite static gain; L3 integral loop; L4 nonunity sensor/reference scaling.

**Misconceptions/constraints.** Measured error may be zero while the physical output is offset. Bias is not random noise.

**Feedback.** Show true output, measured output, reference, and controller error separately.

**Examples.**

1. with unity feedback and very high loop gain, positive measurement bias tends to make true output track `r-b`. L2.
2. integral action can force measured error to zero without correcting an unknown sensor bias. L3.
3. swapping bias injection to the plant output changes the transfer and is not treated as the same problem. L2.

**Validation/coverage.** Exact equilibrium equations and sign-perturbation tests.

### Family `model_uncertainty_compare`

**Task.** Compare nominal and perturbed closed-loop behavior for a bounded set of plant models.

**Response/template.** worst-case metric, pass/fail, or robust-stability choice.

**Derivation.** Recompute poles, gains, margins, or finite responses for every explicitly supplied model/parameter endpoint.

**Difficulty.** L1 two gains; L2 uncertain time constant; L3 interval endpoints plus interior samples; L4 frequency-shaped uncertainty with supplied bound.

**Misconceptions/constraints.** Testing a few models is called a sampled check unless a theorem establishes the interval result. “Robust” is never inferred from the nominal response alone.

**Feedback.** Overlay nominal/perturbed results and identify the worst case.

**Examples.**

1. a controller passes the nominal plant but destabilizes the high-gain variant. L2.
2. compute worst settling time across three supplied plants. L2.
3. a small-gain robust-stability question uses the supplied uncertainty bound and nominal complementary sensitivity. L4.

**Validation/coverage.** Enumerated model oracle; theorem conditions checked for advanced templates.

### Family `feedforward_feedback_roles`

**Task.** Choose, derive, or compare feedforward and feedback paths for reference tracking and disturbance rejection.

**Response/template.** architecture choice or transfer expression.

**Derivation.** Write signal equations for the shown two-degree-of-freedom structure and inspect which inputs each path can respond to.

**Difficulty.** L1 role recognition; L2 ideal inverse feedforward; L3 mismatch/disturbance; L4 causality/properness limitations.

**Misconceptions/constraints.** Feedforward needs a reference/disturbance model and does not react to unknown error by itself. Exact plant inversion may be noncausal, improper, unstable, or fragile.

**Feedback.** Trace reference and disturbance paths separately.

**Examples.**

1. feedback can react to an unmeasured output disturbance after it creates error. L1.
2. nominal inverse feedforward improves command tracking but is wrong when plant gain changes. L2.
3. inverting a right-half-plane zero would require an unstable causal inverse and is rejected. L4.

**Validation/coverage.** Symbolic two-input transfers and realizability filters.

### Family `two_degree_freedom_prefilter`

**Task.** Evaluate a reference prefilter or two-degree-of-freedom controller that shapes command response without changing the feedback characteristic equation.

**Response/template.** transfer, DC gain, or candidate choice.

**Derivation.** Derive the reference path and compare its denominator with the disturbance/noise feedback denominator.

**Difficulty.** L1 constant prefilter; L2 first-order command filter; L3 compare tracking and disturbance response; L4 verify properness and overshoot target.

**Misconceptions/constraints.** The prefilter normally does not repair feedback instability or disturbance sensitivity. Prompts state its exact placement.

**Feedback.** Show which transfer functions change and which do not.

**Examples.**

1. multiplying the reference by `N` scales nominal command DC gain but leaves poles unchanged. L1.
2. a command low-pass can reduce reference-induced overshoot without changing output-disturbance poles. L3.
3. a prefilter cannot stabilize an unstable feedback denominator. L2.

**Validation/coverage.** Signal-flow derivation and denominator identity check.

### Family `control_architecture_diagnose`

**Task.** Diagnose a failed requirement or choose an architecture change from generated evidence.

**Response/template.** selected cause/action with required evidence: `Which change directly addresses {observed failure}?`

**Derivation.** Match the failure to its signal path: steady tracking, unknown disturbance, sensor noise, saturation, model mismatch, or command shaping.

**Difficulty.** L1 single symptom; L2 competing plausible changes; L3 multiple measurements; L4 identify that no listed linear fix suffices.

**Misconceptions/constraints.** Distractors are not universally “bad”; they simply fail to address the stated mechanism. Explanations stay within the supplied model.

**Feedback.** State why the selected change acts on the relevant path and why each distractor does not.

**Examples.**

1. persistent error from a constant plant disturbance suggests integral action if stability/effort permit. L2.
2. noisy derivative effort suggests filtering/reduced high-frequency gain, not merely a faster reference prefilter. L2.
3. severe actuator saturation may require command shaping or redesign; pole placement alone does not remove the nonlinearity. L3.

**Validation/coverage.** Rule-based causal graph with scenario-specific counterfactual simulation.

### Cross-family progression

The learner first sees individual nonlinearities and measurement faults, then plant uncertainty and architectural choices. The capstone diagnoses evidence rather than asking for generic slogans. These families deliberately connect internal signals, robustness, controller structure, and the difference between nominal mathematical success and a plausible implementation.

## 13. Topic-level progression

The five levels are global anchors, not merely larger coefficients.

### Level 1: Signal paths and one-step dynamics

- Name reference, error, plant output, controller output, and feedback signal.
- Reduce series/parallel blocks and one unity-feedback loop.
- Evaluate first-order landmarks and obvious pole stability.
- Recognize P/I/D effects, state equation dimensions, and unit-circle stability.
- Use small integers, labeled diagrams, and one demanded quantity.

### Level 2: Core closed-loop fluency

- Reduce nonunity and small nested feedback structures.
- Derive reference, error, output-disturbance, and noise transfers.
- Work with second-order parameters, step metrics, system type, and error constants.
- Complete small Routh tables, basic root-locus rules, and Bode margins.
- Evaluate controller parameters, controllability/observability, and simple discrete recurrences.

### Level 3: Integrated analysis

- Track internal signals and distinguish sensitivity from complementary sensitivity.
- Infer transient design parameters from specifications.
- Solve Routh stability ranges, root-locus crossings, and margin changes.
- Design bounded PI/PD/lead/lag or two-state feedback/observer gains.
- Include disturbances, sensor noise, delays, saturation, and model variants.
- Require two to four linked reasoning steps.

### Level 4: Robust and architecture-aware reasoning

- Detect hidden unstable cancellations and theorem precondition failures.
- Combine root locus, frequency response, steady-state error, and effort constraints.
- Analyze nonminimum-phase/delay limitations and sampled-data consequences.
- Compare nominal and perturbed models.
- Diagnose architecture choices and reject infeasible inverse/design requests.
- Use parameterized symbolic results with exact or carefully bounded numerical checking.

### Level 5: Capstone design verification

- Reduce a generated multi-loop diagram and expose all important internal transfers.
- Select or tune a controller from a finite candidate/design grammar.
- Verify internal stability, tracking, disturbance/noise response, margins, transient metrics, actuator bounds, and uncertainty cases.
- Explain the first failed requirement when no candidate succeeds.
- Combine classical control with a small state-space or digital implementation only when every convention remains visible.

Promotion should require performance across different families. A learner who can manipulate Routh arrays but cannot distinguish an output disturbance from sensor noise has not mastered the level.

## 14. Adaptive practice and misconception targeting

Track skills by family and misconception tag, not by one undifferentiated score. Suggested tags include:

- `feedback_sign`
- `forward_vs_loop_transfer`
- `signal_injection_location`
- `characteristic_equation`
- `cancelled_hidden_mode`
- `pole_vs_zero`
- `continuous_vs_discrete_region`
- `dc_vs_frequency_gain`
- `signed_vs_magnitude_margin`
- `final_value_conditions`
- `type_vs_closed_loop_order`
- `phase_wrap`
- `state_vs_output`
- `controllability_vs_observability`
- `linear_vs_saturated_model`
- `nominal_vs_robust_claim`

After an error, select a new question that isolates the suspected misconception. Examples:

- If the learner uses `CG/(1+CG)` when `H≠1`, present a numeric nonunity-feedback signal trace before returning to algebra.
- If `S` and `T` are swapped, ask one reference and one output-disturbance question on the same loop.
- If a unit-circle pole is judged by its real part, pair continuous and discrete pole maps.
- If a cancelled unstable pole is ignored, ask for both transfer stability and internal stability.
- If a margin is read at the wrong crossover, give a plot with only one declared crossing before returning to multiple crossings.

Question selection should balance:

- about 60% current-level mixed practice;
- about 20% prerequisite repair;
- about 15% spaced review;
- about 5% stretch questions.

Repeated generators must vary topology, requested signal, signs, representation, and parameters—not just coefficients.

## 15. Answer checking and worked feedback

### Exact and symbolic answers

Normalize rational functions to a declared polynomial order and sign. Preserve original uncancelled factors in metadata. Accept factored and expanded forms when equivalent under the controlled grammar.

For a typed transfer expression:

1. parse into an AST;
2. reject unsupported syntax with a specific message;
3. normalize rational coefficients;
4. compare cross-products symbolically;
5. check domain restrictions and hidden-mode metadata separately;
6. numerically spot-check safe complex points as a bug detector, not the proof.

### Numeric answers

- Accept exact fractions and decimals.
- Use unit-aware checking.
- State required rounding or tolerance in the prompt.
- Prefer exact generated values at L1–L3.
- For roots, margins, and transcendental values, use combined absolute/relative tolerance tied to displayed precision.
- Never mark a physically dimensioned number correct if the submitted unit is incompatible.

### Sets, sequences, and diagrams

- Pole/zero sets are order-insensitive but multiplicity-sensitive.
- Time traces and branch sequences are order-sensitive.
- Multiple root-locus/Nyquist crossing candidates require explicit labeling.
- Diagram answers use accessible selectable regions plus a text alternative.

### Feedback structure

Every response should provide:

1. verdict;
2. direct answer in the same form requested;
3. governing signal equation or theorem;
4. substitutions with signs and units;
5. result verification;
6. one short misconception note when relevant.

For a block reduction, the worked solution highlights the currently reduced subgraph. For a design-verification question, it presents a requirement table rather than burying the failure in prose.

Wrong multiple-choice answers should be generated from known errors: positive-feedback denominator, omitted `H`, swapped disturbance path, wrong stability region, degrees/radians confusion, ignoring a hidden mode, or applying a theorem without its conditions.

## 16. Rendering and interaction requirements

### Block diagrams

Use responsive SVG with:

- left-to-right signal flow by default;
- explicit arrowheads and signal names;
- summing junction signs adjacent to the input arrow;
- distinct takeoff dots;
- controller, actuator, plant, and sensor labels;
- disturbance/noise arrows with named injection locations;
- focus highlighting synchronized with worked steps.

The same diagram must have a text representation such as:

```text
r -> (+) e -> C -> u -> G -> (+ d_o) -> y
      (-) ^                         |
          +--------- H <------------+
```

### Plots

Pole maps, root loci, Bode plots, Nyquist plots, and time responses need:

- labeled axes and units;
- visible critical lines/circles (`Re=0`, unit circle, `-1`, 0 dB, `-180°`);
- non-color indicators such as shapes, dashes, arrows, and labels;
- optional value table for screen readers;
- zoom-safe SVG or canvas with a semantic text fallback;
- consistent phase-unwrapping display.

### Mathematical input

Provide a compact syntax helper near typed fields. Support keyboard-only entry, fraction templates where helpful, and a preview of the parsed expression. Do not require drag-and-drop. Matrix answers may use structured cells rather than free-form LaTeX.

### Audio and animation

No audio is required. Animations showing signal propagation or transient response must respect reduced-motion preferences and never carry information unavailable in the static view.

## 17. Implementation architecture

The app remains standalone HTML/CSS/JavaScript with no backend and no dynamic compiler or CAS download.

Recommended modules:

- seeded PRNG and replay token;
- exact rational/polynomial arithmetic;
- complex arithmetic and small-matrix routines;
- rational transfer-function representation retaining uncancelled source factors;
- controlled expression parser/formatter;
- signal-flow graph and reduction engine;
- pole/root and response metric utilities;
- frequency-response, margin, Nyquist, and root-locus samplers;
- Routh table generator;
- state-space rank/eigen/pole-placement helpers;
- discrete recurrence simulator;
- bounded nonlinear elements such as clip/rate/dead-zone;
- SVG block/plot renderer with text fallback;
- localization dictionaries for all learner-facing strings;
- family registry, adaptive scheduler, and misconception tags.

Every generated question should retain a complete model object:

```js
{
  seed,
  family,
  level,
  conventions,
  plant,
  controller,
  sensor,
  topology,
  requestedTransfer,
  sourceFactors,
  exactAnswer,
  displayAnswer,
  tolerances,
  derivation,
  misconceptionTags
}
```

The generator and solver must be separate. A family should generate a model, an independent oracle should solve it, and the renderer should consume the model without recomputing truth from display strings.

For plots, exact analytic facts determine the answer whenever possible; sampled curves are presentation and cross-checking layers. Adaptive samplers must refine near crossovers, resonances, roots, and the Nyquist critical point.

## 18. Automated validation requirements

### Per-instance validation

Reject a generated instance unless:

- all matrices, polynomials, and rational expressions have valid dimensions/degrees;
- denominators and required inverses are nonsingular where used;
- signs and signal injection points are unambiguous;
- the expected answer is unique under the prompt;
- stated theorem conditions hold, or failure of a condition is the tested answer;
- roots/crossovers/margins are sufficiently separated for displayed precision;
- diagram topology matches the algebraic signal equations;
- numeric values and units fit the display;
- distractors are distinct and genuinely wrong;
- any “design” answer passes forward verification.

### Independent checks

Use at least two computational paths where practical:

- block/signal equations versus graph reduction;
- polynomial roots versus matrix eigenvalues;
- symbolic transfer response versus numeric complex evaluation;
- Routh sign changes versus direct root classification;
- root-locus point test versus closed-loop roots at computed `K`;
- margin interpolation versus refined frequency solve;
- state-space transfer versus simulated impulse/step samples;
- closed-form first/second-order metrics versus time simulation;
- discrete transfer versus recurrence simulation;
- analytic equilibrium versus long stable simulation.

### Test suites

Include:

- golden fixtures for every family and level;
- seeded fuzz tests with deterministic replay;
- algebraic identity/property tests;
- block-diagram rewrite equivalence tests;
- stability-boundary cases on both sides of the boundary;
- cancellation tests retaining hidden unstable modes;
- phase-wrap and multiple-crossover fixtures;
- rank-deficient and nearly-but-exactly-full-rank state-space fixtures;
- saturation/rate-limit boundary traces;
- parser rejection and equivalent-answer tests;
- locale completeness tests.

Any generated failure should expose seed, family, full internal model, exact oracle result, and validation reason in developer mode.

## 19. Coverage requirements

### Generator-family inventory

This specification defines 98 families:

- 9 block-diagram and signal-flow;
- 9 closed-loop relationship and sensitivity;
- 8 transient-performance;
- 7 steady-state;
- 8 algebraic stability/Routh;
- 9 root-locus;
- 10 frequency/robustness;
- 10 controller/compensator;
- 10 state-space;
- 9 sampled-data;
- 9 practical/architecture.

The implementation should compute this count from the registry and fail tests if registered families are undocumented or documented families are missing.

### Required coverage dimensions

Across a representative seeded corpus:

- negative and explicitly named positive feedback;
- unity and nonunity sensors;
- reference, plant-input disturbance, output disturbance, and sensor noise;
- stable, unstable, marginal, and internally hidden unstable cases;
- real, repeated, and complex poles;
- first-, second-, and higher-order models;
- continuous and discrete stability regions;
- factored, expanded, pole-zero, matrix, diagram, plot, and recurrence representations;
- exact rational and tolerance-based numeric answers;
- symbolic, numeric, multiple-choice, table, and diagram interaction;
- nominal, perturbed, saturated, and delayed models.

No family should emit more than 35% of its corpus from one template shape. At least 20% of eligible questions should reverse the usual direction: infer a parameter, choose a model, diagnose a failure, or verify a candidate rather than merely evaluate a forward formula.

### Content exclusions

The initial app should not claim coverage of:

- nonlinear stability theory or Lyapunov proofs;
- MIMO singular-value design;
- `H∞`, `H2`, μ-synthesis, or LQG;
- nonlinear observers or Kalman filtering;
- stochastic process modeling;
- adaptive, optimal, predictive, or reinforcement-learning control;
- full sampled-data intersample analysis;
- industrial network configuration, PLC programming, or safety certification;
- actual controller deployment.

These are potential sister/advanced modules, not gaps to paper over with vocabulary questions.

## 20. Navigation and v1 priorities

Recommended navigation:

- **Learn:** conventions, formula maps, signal locations, and interactive worked diagrams.
- **Practice:** category, family, level, representation, and continuous/discrete filters.
- **Mixed session:** adaptive cross-family queue.
- **Review:** saved misses grouped by misconception.
- **Reference:** compact equations, stability regions, margin conventions, and input syntax.

### Minimum satisfying v1

Prioritize:

1. feedback signals and block reduction;
2. reference/error/disturbance closed-loop transfers;
3. first- and standard second-order transient metrics;
4. poles, characteristic equations, and steady-state error;
5. small Routh tables;
6. root-locus rules and gain-at-point;
7. Bode margin reading;
8. P/PI/PD effect and bounded coefficient matching;
9. saturation as the first practical limitation.

V1 should ship only after diagram/algebra consistency, exact polynomial checking, and internal-stability cancellation tests are reliable.

### Subsequent increments

- **V1.1:** lead/lag, Nyquist, uncertainty checks, richer diagrams.
- **V1.2:** state-space controllability, feedback, observers.
- **V1.3:** sampled-data recurrence, `z` stability, discretization/delay.
- **Later:** advanced robust or nonlinear topics only as separately scoped material.

## 21. Reference profile

The Learn and Reference views should contain:

- canonical negative-feedback signal equations;
- named forward-path, loop-transfer, sensitivity, and complementary-sensitivity definitions;
- reference/disturbance/noise transfer map by injection point;
- continuous and discrete stability-region diagrams;
- first- and standard second-order response formulas with assumption labels;
- system type and static error constants;
- Routh construction rules including zero-row cases;
- root-locus rules and angle/gain conditions;
- Bode crossover and margin definitions;
- pinned clockwise-positive Nyquist convention;
- controller and lead/lag forms used by the app;
- state-space controllability/observability and feedback/observer equations;
- discrete pole mapping and final-value conditions;
- accepted expression syntax, units, and rounding rules.

Formula cards should link to a short derivation or signal diagram. They should not be isolated lists to memorize.

## 22. Quality checklist

Before release, confirm:

- [ ] No graded prompt uses “open-loop gain” without replacing it with a precise named quantity.
- [ ] Every feedback diagram displays summing signs and signal injection locations.
- [ ] Positive feedback is explicitly named and uses its own denominator convention.
- [ ] Transfer simplification retains original internal modes in metadata.
- [ ] Continuous and discrete stability criteria are never mixed.
- [ ] First-/second-order time formulas display their assumptions and approximation status.
- [ ] Final-value, Routh, root-locus, margin, Nyquist, and separation-principle conditions are checked.
- [ ] Multiple gain/phase crossovers are handled or excluded explicitly.
- [ ] Root/pole sets preserve multiplicity.
- [ ] State-space questions distinguish input-output from internal behavior.
- [ ] Discrete prompts state sampling period, indexing, initial memory, and update order.
- [ ] Nonlinear-limit questions do not use linear superposition through the nonlinear interval.
- [ ] Every controller design is substituted back and verified against the stated requirements.
- [ ] Generated plots have semantic text/table alternatives.
- [ ] Typed symbolic answers receive syntax-specific feedback.
- [ ] Every family has at least three visible examples and golden fixtures.
- [ ] Seeded questions replay exactly across refreshes and locales.
- [ ] All learner-facing strings, including generated question fragments and feedback, are localizable.
- [ ] The app presents itself as an educational simulator, never as a tool for controlling real equipment.
