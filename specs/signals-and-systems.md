# Signals and Systems — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, exact/numeric checker, signal/system simulator, plot renderer, audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Signals and Systems

### Topic goal

Develop fluent reasoning about how signals vary, how systems transform them, and how the same behavior appears in time, frequency, equation, block-diagram, and state-space representations.

The learner should become able to:

- read amplitude, offset, period, frequency, angular frequency, and phase without confusing them;
- transform a signal in amplitude and time and predict the resulting graph or samples;
- decide whether a signal is periodic, even/odd, an energy signal, or a power signal;
- test system properties with decisive witnesses rather than vocabulary recall;
- mentally execute short convolution, difference-equation, and state-space traces;
- connect impulse response, transfer function, frequency response, poles, and observable behavior;
- reason about Fourier representations, sampling, aliasing, and elementary filtering;
- move among the neighboring ideas of calculus, linear algebra, physics, and circuits while keeping each model's assumptions explicit.

Repeated practice should improve transferable signal fluency. It should not become a collection of formula-identification flashcards or a substitute for plotting arbitrary expressions in a computer algebra system.

### Position among the other Practice Lab topics

This app is the bridge between four existing topics:

- **Physics** owns physical wave speed, wavelength in space, standing-wave boundary conditions, acoustics, and optical-wave context.
- **Electric Circuits** owns component laws, circuit topology, phasor impedance, electrical power, and actual filter circuits.
- **Calculus** owns general differentiation, integration, limits, series, and differential-equation technique.
- **Linear Algebra** owns general matrices, bases, eigenspaces, diagonalization, and finite-dimensional transformations.

Signals and Systems reuses those tools to answer a different question: what input/output relationship does a time-varying quantity or operator have? It owns abstract signals, time transformations, system properties, LTI response, convolution, frequency representation, sampling, and bounded transform-domain models.

The app is independent. Its Learn cards must supply every local convention and any small calculus/complex-number/matrix method needed by a generated family. Mastery in another app may accelerate placement but is not required to begin.

### Audience and prerequisites

Early categories assume:

- signed arithmetic, fractions, and powers;
- Cartesian graphs and function notation;
- basic sine and cosine landmarks;
- SI prefixes and units;
- the idea that a sequence has integer indices.

Later categories assume, or locally review:

- complex numbers in rectangular and polar form;
- elementary differentiation and integration;
- finite sums and geometric series;
- small vectors and matrices;
- first-order differential and difference equations.

Questions that assess these prerequisite operations in isolation belong in their sister apps. Here, each is embedded in signal/system reasoning.

### Scope

The initial model ID is `signals-systems-v1`. It includes:

- continuous-time and discrete-time signals;
- independent-variable units and dimensional interpretation;
- amplitude, DC offset, peak, peak-to-peak, RMS, period, ordinary frequency, angular frequency, phase, and delay;
- real sinusoids and complex exponentials;
- unit impulse, unit step, ramp, rectangular/triangular pulses, normalized sinc, real exponentials, and finite sequences;
- amplitude scaling, offset, addition, multiplication, time shift, time scaling, reversal, and discrete index transformations;
- periodicity and fundamental period for individual signals and exact-friendly sums;
- even/odd decomposition;
- signal energy, average power, RMS, inner products, orthogonality, and finite cross-correlation;
- input/output maps and block diagrams;
- linearity, time invariance, causality, memory, invertibility at a bounded level, BIBO stability, and static/nonlinear distinctions;
- continuous- and discrete-time LTI systems;
- impulse response, step response, convolution, deconvolution of short finite sequences, and convolution properties;
- zero-input, zero-state, transient, natural, and forced response in controlled first/second-order models;
- linear constant-coefficient differential and difference equations;
- small continuous/discrete state-space updates and modal behavior;
- transfer functions, pole-zero diagrams, regions of convergence, causality, and stability for simple rational systems;
- frequency response, sinusoidal steady state, magnitude, phase, phase delay at a point, idealized filter classifications, cutoff/bandwidth, and Bode asymptotic landmarks;
- continuous-time Fourier series and transform concepts;
- discrete-time Fourier transform (DTFT);
- sampling, Nyquist-rate reasoning, aliasing, ideal reconstruction conditions, DFT-bin interpretation, simple DFTs, leakage recognition, and circular versus linear convolution;
- elementary modulation/mixing as spectral translation;
- Laplace and Z-transform pairs and properties for a tightly controlled grammar.

The intended ceiling is a strong introductory Signals and Systems course with a modest DSP finish. Some families are advanced for a general adult learner, but all remain generated, exact or robustly checkable, and locally simulated.

### Exclusions

Do not include:

- electromagnetic field theory, transmission lines, antennas, RF propagation, or waveguide modes;
- circuit component solving, impedance networks, transistor/op-amp models, or filter construction from real components;
- multivariable calculus, contour integration, residue-theorem derivations, distribution theory proofs, or measure theory;
- arbitrary symbolic differential equations, nonlinear dynamics, chaos, PDEs, or boundary-value problems;
- stochastic processes, random signals, power spectral density estimation, Wiener filtering, Kalman filtering, or statistical detection theory;
- multirate DSP, polyphase structures, adaptive filters, wavelets, cepstra, filter-design optimization, or fixed-point implementation;
- feedback-control design, root locus, Nyquist stability criterion, gain/phase margins, controllability/observability proofs, or regulator design;
- two-dimensional image signals and multidimensional Fourier transforms in v1;
- Hilbert transforms, analytic signals, single-sideband modulation, or communications link budgets;
- general rational partial-fraction decomposition above second order;
- arbitrary inverse transforms, branch cuts, repeated complex poles beyond supplied templates, or unbounded regions of convergence;
- real microphone recording, live sensor capture, medical signal interpretation, or claims about actual equipment;
- arbitrary uploaded audio or signal files;
- a general CAS, circuit simulator, DSP library, or backend.

### Normative notation and signal model

#### Time domains

- Continuous-time signals use `x(t)`, where `t∈R`.
- Discrete-time signals use `x[n]`, where `n∈Z`.
- Parentheses and brackets are semantically significant. The app must not render a discrete sequence as `x(n)`.
- A plot labels whether its horizontal axis is time, sample index, spatial coordinate, or another declared variable.
- Unless units are given, continuous time is in seconds and discrete frequency is per sample.

#### Frequency and phase

- Ordinary frequency `f` is in hertz and angular frequency is `ω=2πf` in radians per second.
- Continuous-time sinusoid canonical form is `x(t)=A cos(ωt+φ)+D`, with `A≥0`.
- Discrete-time sinusoid canonical form is `x[n]=A cos(Ωn+φ)+D`, where `Ω` is radians per sample.
- Phase is in radians by default. A question may request degrees explicitly; the answer checker converts exactly when possible.
- Canonical phase is wrapped to `(-π,π]`. At zero amplitude, phase is undefined and phase questions are rejected.
- `cos(ω(t−t₀)+φ)` has phase `φ−ωt₀` when rewritten against `t`.
- A positive `t₀` in `x(t−t₀)` is a delay/right shift.
- Discrete-time frequencies differing by `2πk` produce the same sequence. For real cosines, sign reversal also permits `cos(Ωn+φ)=cos(−Ωn−φ)`.

#### Periodicity

- A continuous-time signal is periodic if a `T>0` exists with `x(t+T)=x(t)` for all `t`; the smallest positive such value is `T₀`.
- A discrete-time signal is periodic if a positive integer `N` exists with `x[n+N]=x[n]` for every integer `n`; the smallest is `N₀`.
- `cos(Ωn+φ)` is periodic exactly when `Ω/(2π)` is rational. If reduced `Ω/(2π)=p/q`, its fundamental period is `q` except degenerate constant cases, which are handled separately.
- A constant nonzero CT signal has every positive real number as a period and therefore no smallest positive fundamental period. A constant DT sequence has fundamental period `N₀=1`. Questions must apply the domain-specific result.
- For sums of CT periodic components, a common/fundamental period is generated only from commensurate rational frequencies and then independently verified; the generator must not blindly use an LCM if cancellation lowers the result.

#### Elementary signals

- Unit step: `u(t)=0` for `t<0`, `u(t)=1` for `t≥0`; discrete `u[n]` follows the same index rule.
- Continuous impulse `δ(t)` is the Dirac impulse: it has unit area and is not an ordinary finite-height function. The app never asks for `δ(0)` as a numeric value.
- Discrete impulse: `δ[n]=1` at `n=0`, otherwise `0`.
- Ramp: `r(t)=t u(t)` and `r[n]=n u[n]`.
- Normalized sinc: `sinc(t)=sin(πt)/(πt)` for nonzero `t`, with `sinc(0)=1`.
- `rect(t)=1` for `|t|<1/2`, `0` for `|t|>1/2`, and `1/2` at the boundary. Exact-value exercises avoid boundary dependence unless it is the point of the question.
- A finite sequence is zero outside its displayed/support range unless another extension is explicitly shown.

#### Complex numbers

- `j²=−1`.
- Euler's identity is `e^{jθ}=cosθ+j sinθ`.
- Polar complex values use magnitude `r≥0` and phase in `(-π,π]`.
- Phasor-like complex amplitude in this app represents a sinusoidal coefficient or system response, not circuit impedance unless an Electric Circuits exercise explicitly supplies that context.

### LTI and transform conventions

#### Convolution

- CT: `(x*h)(t)=∫_{−∞}^{∞}x(τ)h(t−τ)dτ`.
- DT: `(x*h)[n]=Σ_{k=−∞}^{∞}x[k]h[n−k]`.
- Only finitely supported or exact-friendly causal exponential/polynomial cases are generated.
- Convolution is commutative for the supported scalar LTI systems.

#### Fourier series and transforms

- CT Fourier-series synthesis: `x(t)=Σ_{k∈Z} C_k e^{jkω₀t}`, `ω₀=2π/T₀`.
- Coefficients: `C_k=(1/T₀)∫_{T₀}x(t)e^{−jkω₀t}dt`.
- CT Fourier transform: `X(ω)=∫x(t)e^{−jωt}dt`.
- Inverse: `x(t)=(1/2π)∫X(ω)e^{jωt}dω`.
- DTFT: `X(e^{jΩ})=Σx[n]e^{−jΩn}`, periodic in `Ω` with period `2π`.
- A displayed impulse in frequency has area/coefficient semantics; it is not rendered as a finite spectral height.

#### DFT

- Length-`N` DFT: `X[k]=Σ_{n=0}^{N−1}x[n]e^{−j2πkn/N}`.
- Inverse DFT has the `1/N` factor.
- Bin `k` corresponds to `Ω_k=2πk/N`, or `f_k=k f_s/N`; bins above `N/2` may be interpreted as negative frequencies after wrapping.

#### Laplace and Z transforms

- Bilateral Laplace transform: `X(s)=∫x(t)e^{−st}dt`, with an explicit region of convergence.
- Bilateral Z-transform: `X(z)=Σx[n]z^{−n}`, with an explicit region of convergence.
- System transfer functions mean zero-state transforms: `H=Y/X` under zero initial conditions.
- A rational expression without its ROC is not a complete signal transform when different time-domain signals share it.
- For causal rational LTI systems in the generated minimal/cancellation-free profile, CT BIBO stability requires poles strictly in the left half-plane; DT BIBO stability requires poles strictly inside the unit circle.

### Energy, power, and stability conventions

- CT energy: `E=∫|x(t)|²dt`.
- DT energy: `E=Σ|x[n]|²`.
- CT average power: `P=lim_{T→∞}(1/(2T))∫_{−T}^{T}|x(t)|²dt`.
- DT average power: `P=lim_{N→∞}(1/(2N+1))Σ_{n=−N}^{N}|x[n]|²`.
- RMS is `sqrt(P)` for periodic/power signals, or the square root of mean square over one declared period.
- The zero signal has zero energy and zero power and is classified separately, not forced into “energy” or “power” under definitions requiring positive finite values.
- A nonzero energy signal has finite positive energy and zero average power.
- A nonzero finite-power periodic signal has infinite energy and finite positive average power.
- BIBO stability means every bounded input produces a bounded output. For scalar LTI systems, this is equivalent to absolute integrability/summability of `h`.

### Controlled signal grammar

The generator and checker use semantic ASTs rather than arbitrary JavaScript expressions:

```text
Rational(p,q)
RealAlgebraic(a,b,d)          // a+b*sqrt(d), bounded whitelist
Complex(re,im)
Variable(t|n)
Constant(c)
Impulse(domain, shift)
Step(domain, shift)
Ramp(domain, shift)
Rect(center,width,height)
Triangle(center,width,height)
Sinc(scale, shift, amplitude)
Exponential(amplitude, rate, shift, support)
Sinusoid(amplitude, frequency, phase, offset, domain)
FiniteSequence(startIndex, values)
PiecewisePolynomial(intervals, degree<=2)
Add(terms...)
Multiply(factors...)
AmplitudeScale(c, signal)
TimeTransform(signal, scale, shift) // x(a*t+b) or x[a*n+b]
```

Not every AST combination is legal. The generator uses reviewed templates with bounded support, degree, and transform depth. Learner expression entry is used only where equivalence can be proven by family-specific normalization; otherwise use structured parameters, a sequence editor, graph selection, or multiple choice.

### Exact and numeric answer conventions

- Surrounding whitespace is ignored.
- Integers, reduced fractions, `pi`/`π`, and supported radicals are accepted in exact fields.
- Equivalent angle forms are accepted and normalized to the requested/canonical interval.
- Compatible SI units and prefixes are accepted for dimensional quantities.
- Radians are dimensionless mathematically but the UI retains `rad`, `rad/s`, and `rad/sample` labels for clarity.
- Frequencies must not silently exchange hertz and radians per second.
- Complex answers accept rectangular or polar form where the prompt permits either; semantic comparison handles phase wrapping.
- Finite sequences use indexed cells, not comma-separated text whose starting index is ambiguous.
- Piecewise answers use a structured interval editor or choice among generated graphs.
- Exact answers are preferred for rational/π/radical templates.
- When approximation is requested, default tolerance is the larger of half a displayed final-place unit and `10^-6` relative. Phase near a magnitude-zero point is never numerically graded.
- Multiple values use named fields.

### Graph and audio conventions

- Every graph derives from the semantic signal and displays axes, scale, independent variable, units, zero, and marked breakpoints/samples.
- Stem plots are used for discrete-time sequences; connecting stems with a curve is forbidden.
- Impulses use labeled arrows carrying their area/weight. Their drawn height is symbolic.
- Open/closed piecewise endpoints are distinguishable without color.
- Exact-answer graph questions place relevant landmarks on ticks or provide coordinates; learners never need pixel measurement.
- Time shifts/scales retain a visible anchor/origin.
- Every graph has an accessible table or piecewise/text description sufficient to solve.
- Optional audio playback may render audible-frequency real signals generated locally with Web Audio. Audio is supplementary, never required for core questions, and has replay/volume controls.
- Audio must not be used for ultrasonic/sub-audible values, complex signals, impulses, unstable systems, or tasks whose exact answer cannot be heard reliably.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `modelId`, `domain`, `signalASTs`, `systemModel`, `exactParameters`, `units`, `requestedObject`, `canonicalAnswer`, `equivalenceMode`, `numericTolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `plotDescription`, `audioEligible`, `structuralSignature`, and `seed`.

Generate semantic signals/systems first, derive answers with a primary oracle, validate independently, then render text/plots/audio. Reject recent structural signatures within 20 questions and exact instances within 100.

### Difficulty philosophy

Difficulty should rise through:

- transferring among formula, graph, samples, spectrum, block diagram, and state;
- composing transformations whose order matters;
- separating similar concepts such as phase versus delay or energy versus power;
- maintaining short state/convolution traces;
- choosing a system property and constructing a witness;
- moving from time-domain behavior to frequency/pole interpretation;
- adding one bounded layer of calculus, complex arithmetic, or matrix reasoning;
- inverse construction rather than only forward calculation.

It must not rise through enormous sums, ugly frequencies, long integrations, dense plots, arbitrary high-order polynomials, unexplained textbook convention changes, or answers sensitive to floating-point noise. Most questions should require at most three essential conceptual operations.

### Shared question-family contract

Every family below inherits these requirements:

- **Task** states the exact trainable operation and why repetition helps.
- **Response/template** fixes the response mode and preferred wording; braces denote semantic placeholders whose type/range is specified by the family's generation sentence.
- **Derivation** is the normative answer algorithm.
- **Difficulty** describes qualitative dimensions, not only larger numbers.
- **Misconceptions/constraints** supplies misconception-derived distractors, instance constraints, rejection rules, accepted representation, and meaningful variations.
- **Feedback** shows the first decisive rule or state transition and diagnoses any recognized wrong transform.
- **Examples** contains at least three fully instantiated cases spanning the intended range.
- **Validation/coverage** names an independent oracle/invariant and distribution obligations.
- Choice answers must have exactly one correct semantic answer. Duplicate/equivalent distractors are removed.
- A generated item is rejected if its intended difficulty cancels, its answer is undefined/non-unique without saying so, or clerical work dominates the skill.

## 2. Category: Signal quantities and representations

### Category purpose

Build a precise vocabulary grounded in generated graphs, formulas, and samples, so later system reasoning is not undermined by amplitude/frequency/domain confusion.

### Learn

A signal is a function of an independent variable. Continuous-time signals exist for every modeled real `t`; discrete-time signals exist only at integer `n`. For `A cos(2πft+φ)+D`, `A` is amplitude about mean `D`, period is `1/f`, and peak-to-peak is `2A`. Angular frequency is `2πf`.

### Prerequisites

Basic graphs, fractions, sine/cosine landmarks.

### Category boundaries

Physical wavelength and propagation speed belong in Physics. System action and spectra are later categories.

### Subcategories

1. Domains and representations
2. Sinusoidal quantities
3. Elementary signals
4. Symmetry

### Family `signal_domain_classify`

**Task.** Decide whether a formula/plot/table describes continuous time, discrete time, or a non-time independent variable, and identify valid input values.

**Response/template.** Matching: `Classify each representation {representations} and state its independent-variable domain.`

**Derivation.** Read notation and axis metadata: `x(t)`/continuous curve means real `t`; `x[n]`/stem samples means integer `n`; another labeled axis is not silently time.

**Difficulty.** L1 brackets versus parentheses; L2 graph/table; L3 mixed spatial/time plots or sampled values with physical time labels.

**Misconceptions/constraints.** Distractors connect stems into a CT signal, treat `n` as any real, or call every horizontal axis time. Every plot includes semantic axis labels; reject visually ambiguous renderings.

**Feedback.** Point to notation and allowed independent-variable set.

**Examples.**

1. `x(t)=e^{-t}u(t)` → continuous time, `t∈R`. L1.
2. `x[n]={1,2,0}` at `n=0,1,2` → discrete time, integer indices. L1.
3. `p(x)=cos(2πx/3)` with horizontal axis metres → continuous spatial signal, not a time signal. L3.

**Validation/coverage.** Typed-domain metadata is the oracle; balance formulas, curves, stems, and tables.

### Family `signal_graph_read`

**Task.** Extract values, support, extrema, discontinuities, or sample indices from a semantically generated plot.

**Response/template.** Named numeric/set fields: `From {plot}, find {requested_features}.`

**Derivation.** Query the underlying piecewise/finite-sequence AST, not pixels.

**Difficulty.** L1 one value; L2 support/peak; L3 open endpoints or shifted indices; L4 compare CT and DT representations.

**Misconceptions/constraints.** Distractors confuse missing DT stems with zero only when support convention is not stated, include an open endpoint, or read peak-to-peak as peak. Exact landmarks lie on ticks.

**Feedback.** Highlight the semantic point/interval and its inclusion state.

**Examples.**

1. pulse equals3 on `0≤t<2`, zero elsewhere → support `[0,2)`, peak3. L1.
2. stems `x[-1]=2,x[0]=-1,x[2]=4`, zero elsewhere → `x[1]=0`, maximum4 at `n=2`. L2.
3. triangle vertices `(-2,0),(0,5),(2,0)` → support `[-2,2]`, peak5, area10. L3.

**Validation/coverage.** AST direct evaluation and breakpoint inclusion tests; graphical/text alternatives must agree.

### Family `sinusoid_parameters`

**Task.** Read amplitude, offset, peaks, period, frequency, angular frequency, and phase from one sinusoid.

**Response/template.** Multiple named fields: `For {sinusoid}, give {parameters}.`

**Derivation.** Normalize to `A cos(ωt+φ)+D`, make `A≥0`, wrap phase, compute `f=ω/(2π)`, `T=2π/|ω|`, peaks `D±A`.

**Difficulty.** L1 already canonical; L2 sine-to-cosine or negative amplitude; L3 graph/formula transfer; L4 units and wrapped phase.

**Misconceptions/constraints.** Distractors use `2A` as amplitude, `D+A` as amplitude, `1/ω` as period, or phase as a time shift. Reject `A=0`.

**Feedback.** Show canonical rewrite and one period on a phase circle/graph.

**Examples.**

1. `3cos(2πt)+1` → amplitude3, offset1, `f=1 Hz`, `T=1 s`, peaks4 and−2. L1.
2. `−2cos(4t)` → `2cos(4t+π)`, amplitude2, phaseπ, `ω=4 rad/s`. L2.
3. `4sin(6πt−π/3)+2` → `4cos(6πt−5π/6)+2`, `f=3 Hz`, `T=1/3 s`. L3.

**Validation/coverage.** Evaluate original/canonical AST at exact landmarks plus parameter reconstruction.

### Family `frequency_unit_convert`

**Task.** Convert among period, hertz, angular frequency, and discrete radians/sample.

**Response/template.** Numeric quantity with unit: `Convert {source_quantity} to {target_quantity}.`

**Derivation.** CT uses `T=1/f`, `ω=2πf`; sampled sinusoids use `Ω=2πf/f_s` with displayed `f_s`.

**Difficulty.** L1 `T↔f`; L2 `f↔ω`; L3 sampled analog-to-digital frequency; L4 inverse with unit prefixes.

**Misconceptions/constraints.** Distractors omit/multiply the wrong `2π`, call rad/sample hertz, or use `T=2π/f`. Generate exact-friendly π multiples and reasonable SI prefixes.

**Feedback.** Show dimensional equation before substitution.

**Examples.**

1. `T=0.25 s` → `f=4 Hz`. L1.
2. `f=5 Hz` → `ω=10π rad/s`. L2.
3. `f=1 kHz`, `f_s=8 kHz` → `Ω=π/4 rad/sample`. L3.

**Validation/coverage.** Round-trip conversions and dimension-tagged quantity checks.

### Family `sinusoid_construct`

**Task.** Construct canonical sinusoid parameters/formula from verbal or graphical constraints.

**Response/template.** Structured `A,ω/f,φ,D` fields or formula: `Construct a cosine-form signal satisfying {constraints}.`

**Derivation.** Infer `D=(max+min)/2`, `A=(max−min)/2`, period from repeated phase landmarks, then phase from the value/slope at a declared origin.

**Difficulty.** L1 amplitude/frequency; L2 offset and origin crest; L3 zero crossing with slope direction; L4 delayed landmark.

**Misconceptions/constraints.** Require a unique canonical phase modulo `2π`; reject constraints compatible with multiple phases unless a phase range is provided.

**Feedback.** Derive midline/amplitude first, then period, then phase.

**Examples.**

1. amplitude2, frequency3 Hz, crest at t=0 → `2cos(6πt)`. L1.
2. max5, min1, period4 s, crest at0 → `3+2cos(πt/2)`. L2.
3. amplitude4, period2 s, crosses zero upward at t=0 → `4cos(πt−π/2)`. L3.

**Validation/coverage.** Substitute all constraints into the constructed AST and check uniqueness in canonical range.

### Family `elementary_signal_evaluate`

**Task.** Evaluate step, impulse-sequence, ramp, rectangular pulse, sinc landmarks, exponential, or finite-sequence expressions.

**Response/template.** Numeric fields: `Evaluate {signal} at {points_or_indices}.`

**Derivation.** Apply the normative elementary definitions and support/boundary convention exactly.

**Difficulty.** L1 direct step/sequence; L2 shift/scale; L3 sum of elementary signals; L4 distinguish CT impulse area from point value.

**Misconceptions/constraints.** Never request numeric `δ(t)` at zero; CT impulse items ask area/integral action. Boundary-dependent `rect` questions state the convention.

**Feedback.** Expand one definition at each requested point.

**Examples.**

1. `u(t−2)` at `t=1,2,3` → `0,1,1`. L1.
2. `r[n+1]=(n+1)u[n+1]` at `n=−2,−1,0` → `0,0,1`. L2.
3. `∫(3δ(t−2)+δ(t+1))dt` over all time →4. L3.

**Validation/coverage.** AST evaluation plus distribution-specific integral identities; cover both sides and exact boundaries.

### Family `signal_symmetry_classify`

**Task.** Classify a CT/DT signal as even, odd, both, or neither.

**Response/template.** Single choice: `Under reflection about zero, classify {signal}.`

**Derivation.** Compare exact AST/table values under `x(−t)` or `x[−n]` with `x` and `−x`.

**Difficulty.** L1 standard sine/cosine; L2 finite sequence with negative indices; L3 shifted/mixed expression; L4 zero signal (“both”).

**Misconceptions/constraints.** Distractors treat positive-valued as even, any negative value as odd, or symmetry about a shifted center as even about zero.

**Feedback.** Show mirrored sample/term and the defining equality.

**Examples.**

1. `cos(3t)` → even. L1.
2. `t e^{−|t|}` → odd. L2.
3. zero signal → both even and odd. L3.

**Validation/coverage.** Symbolic parity rules and exact paired evaluations; balance four classifications.

### Cross-family progression

Domain and graph reading precede parameter extraction. Direct sinusoid parameters and conversions precede inverse construction. Elementary signals are introduced before transformations. Symmetry begins with familiar sinusoids, then returns after signal operations.

## 3. Category: Signal transformations and periodicity

### Category purpose

Train the mental geometry of changing signal amplitude and time, including transformation order and the distinct periodicity rules of CT and DT signals.

### Learn

Outside operations change values; inside operations change the independent variable. `y(t)=a x(t)+b` scales about zero then shifts vertically. `x(t−t₀)` moves right by `t₀`; `x(at)` compresses by `|a|` when `|a|>1` and reverses when `a<0`. For `x(at+b)`, solve `at+b=s` for where each original landmark `s` moves.

### Prerequisites

Category 2 and basic equation solving.

### Category boundaries

This category transforms known signals. System properties ask whether an operator behaves the same under such transformations and come later.

### Subcategories

1. Amplitude transformations
2. CT time transformations
3. DT index transformations
4. Periodicity

### Family `amplitude_scale_offset`

**Task.** Transform values/range/graph under `y=a x+b` or recover `a,b`.

**Response/template.** Graph choice or named numeric fields: `For {input_signal}, determine {features} of y={a}x+{b}.`

**Derivation.** Map every ordinate `v→av+b`; for negative `a`, swap min/max ordering.

**Difficulty.** L1 positive scale; L2 offset; L3 negative scale and range; L4 inverse from paired landmarks.

**Misconceptions/constraints.** Distractors apply `b` inside time, scale about the offset rather than zero, or fail to reverse extrema. Use nonconstant signals and visible landmarks.

**Feedback.** Show the value map on midline/min/max.

**Examples.**

1. x range `[−1,2]`, `y=3x` → `[−3,6]`. L1.
2. `y=2x−1`, input values `0,1,3` → `−1,1,5`. L2.
3. x range `[−2,4]`, `y=−0.5x+3` → `[1,4]`. L3.

**Validation/coverage.** Apply affine map to AST and exact range candidates; balance scale signs and inverse tasks.

### Family `time_shift`

**Task.** Move landmarks/support under a delay or advance and identify the matching formula/graph.

**Response/template.** Interval/landmark fields or graph choice: `Transform {signal} to y(t)=x(t−{shift}).`

**Derivation.** Original landmark at `s` appears where `t−shift=s`, hence `t=s+shift`; identical index rule applies for integer DT shifts.

**Difficulty.** L1 positive delay; L2 advance; L3 support/open endpoints; L4 infer shift from two plots.

**Misconceptions/constraints.** Primary distractor shifts in the sign written inside rather than solving the argument. DT shift must be integer.

**Feedback.** Track one labeled anchor before redrawing the whole signal.

**Examples.**

1. x pulse on `[0,2]`; `x(t−3)` → support `[3,5]`. L1.
2. crest of x at t=1; `x(t+2)` → crest at t=−1. L2.
3. x[n] nonzero at `{−1,0,2}`; `x[n−4]` → `{3,4,6}`. L2.

**Validation/coverage.** AST support transformation and landmark inverse mapping.

### Family `time_scale_reverse`

**Task.** Determine support/period/landmarks under `x(at)`, including reversal.

**Response/template.** Named fields or graph choice: `For y(t)=x({a}t), find {features}.`

**Derivation.** Landmark `s` moves to `t=s/a`; period becomes `T/|a|`; `a<0` reverses order.

**Difficulty.** L1 integer compression; L2 expansion/fraction; L3 reversal; L4 simultaneous period and support.

**Misconceptions/constraints.** Distractors multiply landmark times by `a`, call `x(2t)` expansion, or ignore negative reversal. Exclude `a=0`.

**Feedback.** Solve the inside equation for two anchors and show period scaling.

**Examples.**

1. pulse support `[0,4]`; `x(2t)` → `[0,2]`. L1.
2. period6; `x(t/3)` → period18. L2.
3. support `[−1,3]`; `x(−2t)` → `[−1.5,0.5]` with reversed shape. L3.

**Validation/coverage.** Inverse affine mapping of ordered breakpoints; exact rational endpoints.

### Family `composite_time_transform`

**Task.** Transform a signal under `x(at+b)` or recover the compact transform from mapped landmarks.

**Response/template.** Landmark table/graph/formula: `Map {landmarks} for y(t)=x({a}t+{b}).`

**Derivation.** For every original landmark `s`, solve `t=(s−b)/a`; sort transformed times for rendering. Equivalent center form may be derived after, not guessed before.

**Difficulty.** L1 positive a with shift; L2 fractional values; L3 reversal plus shift; L4 inverse construction.

**Misconceptions/constraints.** Distractors perform shift/scale in the wrong order or write `x(a(t+b))` as equivalent without distributing. At least two asymmetric landmarks prevent guessing.

**Feedback.** Use the landmark equation table rather than a memorized order slogan.

**Examples.**

1. x landmarks0,2; `x(2t−4)` → t=2,3. L2.
2. x support `[−1,3]`; `x(−t+2)` → support `[−1,3]`, reversed about t=1. L3.
3. original landmarks0→new1 and4→new3 → argument `2t−2`, so `y=x(2t−2)`. L4.

**Validation/coverage.** Forward/inverse affine-map agreement and graph AST equality.

### Family `sequence_index_transform`

**Task.** Evaluate or redraw finite sequences under integer index shifts, reversal, and decimation-like index substitution.

**Response/template.** Indexed sequence editor: `Given {x_values}, compute y[n]=x[{index_expression}] over {indices}.`

**Derivation.** For each requested integer `n`, compute the source integer index and look it up; outside support is zero.

**Difficulty.** L1 shift; L2 reversal; L3 `x[2n−1]` skips samples; L4 sum of transformed sequences.

**Misconceptions/constraints.** Do not invent interpolation when the requested source index is noninteger; v1 generates integer-affine expressions on integer n. Distractors move displayed stems geometrically without substitution.

**Feedback.** Show `n→source index→value` rows.

**Examples.**

1. x[0..2]=`[1,2,3]`; `x[n−1]` at n=0..3 → `[0,1,2,3]`. L1.
2. same x; `x[−n]` nonzero at n=−2,−1,0 with values3,2,1. L2.
3. x[0..4]=`[1,2,3,4,5]`; `x[2n]` at n=0,1,2 → `[1,3,5]`. L3.

**Validation/coverage.** Direct integer substitution and support-set transformation.

### Family `periodicity_test`

**Task.** Decide whether one CT/DT signal is periodic and give its fundamental period when defined.

**Response/template.** Yes/no plus `T0`/`N0`: `Is {signal} periodic? If so, give the fundamental period.`

**Derivation.** CT sinusoid uses `2π/|ω|`; CT exponential/polynomial templates use definition; DT sinusoid reduces `Ω/(2π)` and takes denominator; finite nonzero sequences are aperiodic unless explicitly periodically extended.

**Difficulty.** L1 CT sinusoid; L2 DT rational frequency; L3 irrational normalized frequency/elementary mixtures; L4 degenerate/cancellation cases.

**Misconceptions/constraints.** Distractors assume every sinusoid sampled in DT is periodic, use CT period as noninteger DT period, or call a finite displayed pattern periodically repeated without extension notation.

**Feedback.** Test the domain-specific shift equality.

**Examples.**

1. `cos(5t)` → periodic, `T0=2π/5`. L1.
2. `cos(3πn/4)` has `Ω/(2π)=3/8` → `N0=8`. L2.
3. `cos(n)` → aperiodic because `1/(2π)` is irrational. L3.

**Validation/coverage.** Exact rationality/AST periodicity rules plus finite-period enumeration for DT candidates.

### Family `sum_fundamental_period`

**Task.** Find the fundamental period of a sum of commensurate periodic components or conclude aperiodic.

**Response/template.** Period/status: `Find the fundamental period of {sum_signal}.`

**Derivation.** Find the least positive common period from reduced rational frequency ratios, then verify the complete sum is unchanged and no divisor/candidate smaller period works.

**Difficulty.** L1 harmonic components; L2 rational CT frequencies; L3 DT components; L4 phase/cancellation reduces the naive common period.

**Misconceptions/constraints.** Distractors add component periods, choose the largest, or use LCM without checking cancellation. Generator constructs exact frequency lattices.

**Feedback.** Express each component frequency as an integer multiple of the candidate fundamental and perform the minimality check.

**Examples.**

1. `cos(2πt)+sin(4πt)` → `T0=1 s`. L1.
2. `cos(3t)+cos(5t)` → common angular-frequency gcd1, `T0=2π`. L2.
3. `cos(πn/2)+cos(πn)` → periods4 and2, sum `N0=4`. L2.

**Validation/coverage.** Exact symbolic shift plus brute-force DT period and dense exact CT landmark check as secondary.

### Family `dt_frequency_equivalence`

**Task.** Normalize a DT frequency/phase or identify equivalent sinusoidal sequences.

**Response/template.** Canonical `Ω,φ` or matching: `Which discrete-time sinusoid is identical to {signal} for all integer n?`

**Derivation.** Reduce `Ω` modulo `2π` to `(-π,π]`; for cosine optionally flip frequency sign while negating phase; normalize amplitude positive.

**Difficulty.** L1 add `2π`; L2 negative frequency; L3 phase plus negative amplitude; L4 distinguish equality from same magnitude spectrum.

**Misconceptions/constraints.** Distractors transfer CT uniqueness to DT, alter frequency by arbitrary `π`, or flip frequency without phase.

**Feedback.** Substitute integer n and show the added `2πkn` contributes whole cycles.

**Examples.**

1. `cos((Ω+2π)n)` equals `cos(Ωn)`. L1.
2. `cos(−πn/3+π/4)` equals `cos(πn/3−π/4)`. L2.
3. `−cos(5πn/2)` → `cos(πn/2+π)` after frequency reduction and amplitude normalization. L3.

**Validation/coverage.** Canonical complex-exponential coefficient normalization plus exact sample comparison over a full period where periodic.

### Cross-family progression

Vertical changes and pure shifts precede scaling/reversal. Composite transforms use landmark equations only after those direct forms. DT index substitution remains separate until learners stop interpolating sequences. Single-signal periodicity precedes sums and DT frequency equivalence.

## 4. Category: Signal operations, energy, and similarity

### Category purpose

Train algebraic combination and quantitative comparison of signals before those operations are used in system and spectral reasoning.

### Learn

Signals add and multiply pointwise. Reflection separates any signal into even and odd parts. Energy sums/integrates squared magnitude; average power averages it over unbounded time or one period when periodic. Inner products measure alignment, and correlation compares alignment under relative shifts.

### Prerequisites

Categories 2–3; basic finite sums/integrals for later levels.

### Category boundaries

Convolution is not pointwise multiplication and belongs in Category 6. Probabilistic covariance and random-signal correlation are excluded.

### Subcategories

1. Pointwise operations
2. Symmetry decomposition
3. Energy, power, and RMS
4. Inner products and correlation

### Family `signal_pointwise_combine`

**Task.** Compute/support/render a sum, difference, product, minimum/maximum, or gated signal pointwise.

**Response/template.** Sequence/piecewise table or graph: `Compute y={operation} for {signals}.`

**Derivation.** Partition CT intervals at every breakpoint or align DT indices, then apply the operation to values at the same time/index.

**Difficulty.** L1 aligned DT sums; L2 shifted pulses; L3 product/gating and breakpoint union; L4 infer operands from result.

**Misconceptions/constraints.** Distractors convolve instead of multiply, add supports without checking cancellation, or align sequence array positions instead of indices.

**Feedback.** Show a common time/index table.

**Examples.**

1. x[0..2]=`[1,2,3]`, h[0..2]=`[2,0,−1]`; x+h=`[3,2,2]`. L1.
2. two unit pulses on `[0,2]` and `[1,3]`; product is unit pulse on `[1,2]`. L2.
3. `u(t)−u(t−2)` is1 on `[0,2)` and0 elsewhere. L3.

**Validation/coverage.** AST interval partition and exact sample oracle; verify supports and breakpoint inclusion.

### Family `even_odd_decompose`

**Task.** Compute the even and odd components of a signal.

**Response/template.** Structured formulas/graphs: `Find x_e and x_o for {signal}.`

**Derivation.** `x_e=(x(t)+x(−t))/2`, `x_o=(x(t)−x(−t))/2`, or DT analog.

**Difficulty.** L1 known polynomial/sinusoid; L2 finite sequence; L3 shifted piecewise signal; L4 reconstruct missing component.

**Misconceptions/constraints.** Distractors omit halves, swap signs, or decompose about the signal's center rather than zero.

**Feedback.** Display reflected signal, sum/difference, and reconstruction `x_e+x_o=x`.

**Examples.**

1. `x(t)=3+2t` → `x_e=3`, `x_o=2t`. L1.
2. `e^t` → `x_e=cosh(t)`, `x_o=sinh(t)` only as displayed choice; free-form hyperbolic syntax is not required. L2.
3. x[-1]=1,x[0]=2,x[1]=3 → even values at ±1 are2, odd values are `−1,+1`, center odd0. L3.

**Validation/coverage.** Exact parity and reconstruction identities; if hyperbolic forms appear, provide equivalent exponential choices.

### Family `energy_power_classify`

**Task.** Classify a signal as energy, power, zero, or neither under the normative definitions.

**Response/template.** Single choice with optional E/P: `Classify {signal} and state the finite metric when applicable.`

**Derivation.** Evaluate/recognize total squared magnitude and long-time average; use periodic one-period average when valid.

**Difficulty.** L1 finite support/periodic; L2 decaying/growing exponential; L3 borderline sequence/power-law from supplied result; L4 zero/neither distinctions.

**Misconceptions/constraints.** Distractors call any finite-amplitude signal energy, any periodic signal finite-energy, or zero both. Advanced convergence is supplied rather than testing series/integral technique.

**Feedback.** State whether total energy and average power are finite/positive/zero.

**Examples.**

1. finite nonzero sequence `[1,−1,2]` → energy signal. L1.
2. `3cos(2t)` → power signal, `P=9/2`. L1.
3. `e^t u(t)` → neither: unbounded energy and average power under the defined limit. L3.

**Validation/coverage.** Template-specific exact integral/sum oracle; balance all four classes.

### Family `signal_energy_compute`

**Task.** Compute total energy for a finite sequence, pulse, or exact-friendly decaying signal.

**Response/template.** Nonnegative scalar with units if any: `Compute the energy of {signal}.`

**Derivation.** Sum/integrate squared magnitude over support; complex signals use magnitude squared.

**Difficulty.** L1 finite samples/constant pulse; L2 piecewise/ramp; L3 exponential; L4 transformed signal using scaling law.

**Misconceptions/constraints.** Distractors omit squaring, square the support length, integrate signed signal, or forget `1/|a|` for CT time scaling.

**Feedback.** Show `|x|²` and support before accumulation.

**Examples.**

1. x=`[1,−2,2]` → `E=1+4+4=9`. L1.
2. x(t)=3 on `[0,2]` → `E=18`. L1.
3. x(t)=`e^{−2t}u(t)` → `∫₀∞e^{−4t}dt=1/4`. L3.

**Validation/coverage.** Independent piecewise integration/geometric-sum oracle and nonnegativity.

### Family `average_power_rms`

**Task.** Compute average power and RMS of a periodic or declared finite-window signal.

**Response/template.** Named numeric fields: `Over {period_or_window}, find P and RMS for {signal}.`

**Derivation.** Average `|x|²` over one period/window; RMS=`sqrt(P)`. For sinusoid plus DC, orthogonality gives `P=D²+A²/2`.

**Difficulty.** L1 square wave/constant; L2 zero-mean sinusoid; L3 DC offset/multilevel duty cycle; L4 sum of orthogonal harmonics.

**Misconceptions/constraints.** Distractors average then square, use peak as RMS, include cross term between orthogonal components, or confuse peak-to-peak.

**Feedback.** Show squared levels and duration fractions or harmonic contributions.

**Examples.**

1. constant4 → `P=16`, RMS4. L1.
2. `6cos(ωt)` → `P=18`, RMS`3sqrt(2)`. L2.
3. `2+4cos(ωt)` → `P=4+8=12`, RMS`2sqrt(3)`. L3.

**Validation/coverage.** Exact one-period integration and sampled dense check only as secondary; balance DC, sinusoid, pulse duty cycle.

### Family `inner_product_orthogonality`

**Task.** Compute a finite/windowed signal inner product, decide orthogonality, or find one projection coefficient.

**Response/template.** Scalar plus yes/no: `On {domain}, compute <x,y> and decide whether they are orthogonal.`

**Derivation.** CT integrates `x(t)conj(y(t))`; DT sums. Orthogonal iff inner product exactly zero. Projection coefficient is `<x,y>/<y,y>` for nonzero y.

**Difficulty.** L1 real vectors/sequences; L2 sin/cos over full periods; L3 complex finite sequences; L4 projection/reconstruction.

**Misconceptions/constraints.** Distractors use pointwise product must be zero everywhere, omit conjugation, or test equal energy. Domains are finite or periodic windows with exact-friendly integrals.

**Feedback.** Show term/integral cancellation and distinguish local overlap from total inner product.

**Examples.**

1. `[1,1]` and `[1,−1]` → inner product0, orthogonal. L1.
2. `cos t` and `sin t` on `[−π,π]` →0. L2.
3. projection of `[2,0]` onto `[1,1]` has coefficient1 and vector `[1,1]`. L3.

**Validation/coverage.** Exact rational/π/complex inner-product oracle; reject zero projection target.

### Family `cross_correlation_lag`

**Task.** Compute a bounded cross-correlation value or identify the lag of best alignment.

**Response/template.** Correlation sequence/lag: `Using r_xy[ℓ]=Σ x[n]conj(y[n−ℓ]), compute {requested}.`

**Derivation.** Apply the displayed convention exactly, align integer indices, multiply/conjugate, and sum.

**Difficulty.** L1 autocorrelation at zero; L2 one lag; L3 full short correlation; L4 delay detection with scale/noise-free distractors.

**Misconceptions/constraints.** Because lag sign conventions vary, repeat the formula in every question. Distractors use convolution reversal, opposite lag convention, or normalize without being asked.

**Feedback.** Show aligned index rows for the chosen lag.

**Examples.**

1. x=`[1,2]`; `r_xx[0]=1²+2²=5`. L1.
2. x=`[1,0,2]`, y=`[0,1,0,2]` (y delayed one) → best alignment under displayed convention at lag `−1`. L3.
3. x=`[1,−1]`, y=`[1,1]` → zero-lag correlation0. L2.

**Validation/coverage.** Direct double-index oracle and convention-specific known-delay fixtures.

### Cross-family progression

Pointwise combination precedes even/odd decomposition. Energy classification precedes calculation and RMS. Inner products follow finite energy, then correlation introduces shifting. Correlation stays deterministic; random-signal statistics belong elsewhere.

## 5. Category: Systems and operator properties

### Category purpose

Train the learner to execute input/output rules and test structural properties with definitions and counterexamples.

### Learn

A system maps an input signal to an output signal. Linearity combines additivity and homogeneity. Time invariance means shifting the input only shifts the output. Causality forbids dependence on future input. Memoryless output at time/index uses only input at that same time/index. BIBO stability quantifies every bounded input.

### Prerequisites

Signal transformations and pointwise operations.

### Category boundaries

This category may use any declared operator, not only LTI systems. Convolution and impulse-response machinery begin in Category 6. Feedback-control stability criteria are excluded.

### Subcategories

1. Executing system maps
2. Linearity and invariance
3. Causality, memory, invertibility, and stability
4. Block diagrams

### Family `system_output_evaluate`

**Task.** Compute an output value/short output signal from a stated memoryless or finite-memory operator.

**Response/template.** Numeric/sequence/formula fields: `For system T{x}={rule} and input {input}, find {output}.`

**Derivation.** Substitute the input into the operator with exact index/time alignment and apply declared initial/outside-support values.

**Difficulty.** L1 pointwise gain/nonlinearity; L2 shift/difference; L3 running finite sum; L4 nested operator.

**Misconceptions/constraints.** Distractors substitute output for input, confuse `x[n−1]` with output delay, or apply a rule only to displayed support. Operators have bounded lookback/lookahead.

**Feedback.** Expand one requested output into the exact input values it uses.

**Examples.**

1. `y(t)=3x(t)`, `x(t)=cos t` → `y(t)=3cos t`. L1.
2. `y[n]=x[n]−x[n−1]`, x[0..2]=`[1,3,2]`, zero before0 → y[0..2]=`[1,2,−1]`. L2.
3. `y[n]=Σ_{k=0}^2x[n−k]`, same x → y[0..2]=`[1,4,6]`. L3.

**Validation/coverage.** Operator AST evaluation and a separate expanded-expression oracle.

### Family `system_linearity_test`

**Task.** Decide linearity and identify the failed additivity/homogeneity condition or a witness.

**Response/template.** Yes/no plus witness choice: `Is T{x}={rule} linear?`

**Derivation.** Symbolically compare `T{a x1+b x2}` with `aT{x1}+bT{x2}` or evaluate a generated decisive witness.

**Difficulty.** L1 gain/differentiation-like difference; L2 offset/square/absolute value; L3 input-dependent coefficient or initial condition; L4 parameter condition for linearity.

**Misconceptions/constraints.** Distractors treat every equation with x as linear, confuse time invariance with linearity, or accept affine offset. Every “nonlinear” answer has an explicit counterexample; avoid domain restrictions that make scaling undefined.

**Feedback.** Start with zero-input test when decisive, then show the violated equality.

**Examples.**

1. `T{x}=4x` → linear. L1.
2. `T{x}=x+2` → not linear because `T{0}=2`. L1.
3. `T{x}[n]=n x[n]` → linear (though time-varying). L3.

**Validation/coverage.** Symbolic operator rules plus randomized exact witness verification; balance linear/nonlinear and separate from TI.

### Family `system_time_invariance_test`

**Task.** Decide time invariance and construct/interpret the shift test.

**Response/template.** Yes/no plus compared outputs: `Is T{x}={rule} time invariant? Compare a shift by {shift}.`

**Derivation.** Compute `T{x(t−t0)}` and `y(t−t0)` (or DT analog) and compare for all supported inputs; use a witness if unequal.

**Difficulty.** L1 gain/fixed delay; L2 explicit time/index coefficient; L3 time reversal/scaling; L4 threshold or accumulator with fixed origin.

**Misconceptions/constraints.** Distractors assume “contains a delay” means time-varying, test a single constant input that hides variation, or conflate linearity. Non-TI witnesses must be nondegenerate.

**Feedback.** Display the two branches of the shift-test diagram.

**Examples.**

1. `y[n]=x[n−2]` → time invariant. L1.
2. `y[n]=n x[n]` → time varying: shifted-input branch gives `n x[n−n0]`, shifted-output gives `(n−n0)x[n−n0]`. L2.
3. `y(t)=x(2t)` → time varying for ordinary shifts. L3.

**Validation/coverage.** Symbolic affine-index comparison and exact witness simulation.

### Family `system_causality_test`

**Task.** Decide whether output at a time/index can depend on future input.

**Response/template.** Yes/no plus decisive dependency: `Is {system_rule} causal?`

**Derivation.** Inspect all input arguments or integration/summation limits relative to output time. A future argument/later interval provides a noncausal witness.

**Difficulty.** L1 fixed delay/advance; L2 symmetric window; L3 integral/running sum; L4 implicit difference equation with stated realization.

**Misconceptions/constraints.** Distractors equate memory with noncausality or assume CT differentiation is noncausal in the ideal mathematical model. Every rule is fully specified.

**Feedback.** Mark the latest input time required for one output.

**Examples.**

1. `y[n]=x[n]+x[n−1]` → causal. L1.
2. `y[n]=x[n+2]` → noncausal. L1.
3. `y(t)=∫_{−∞}^{t}x(τ)dτ` → causal with memory. L2.

**Validation/coverage.** Dependency-bound analysis plus paired-input witness that agrees up to present and differs later.

### Family `system_memory_test`

**Task.** Classify a system as memoryless or having memory and identify the dependency.

**Response/template.** Single choice plus input-time set: `Does {system} have memory?`

**Derivation.** Output at `t0/n0` is memoryless only if it depends exclusively on input at that same argument.

**Difficulty.** L1 pointwise versus delay; L2 derivative/integral; L3 nonlinear delayed terms; L4 parameter values that remove memory.

**Misconceptions/constraints.** Distractors equate causal with memoryless, call a constant-output system “memory” because it ignores current input, or treat stored coefficients as signal memory.

**Feedback.** List precisely which input arguments affect one output.

**Examples.**

1. `y(t)=x²(t)` → memoryless. L1.
2. `y[n]=x[n]+x[n−1]` → has memory. L1.
3. `y[n]=a x[n−1]+x[n]` → memoryless only when `a=0`. L3.

**Validation/coverage.** Operator dependency-set oracle; include causal-memory and noncausal-memory contrasts.

### Family `system_invertibility`

**Task.** Decide whether inputs are uniquely recoverable and apply/find a simple inverse.

**Response/template.** Yes/no plus inverse/output: `Is T{x}={rule} invertible on {declared_domain}?`

**Derivation.** Prove injectivity within the generated domain or construct two distinct inputs with the same output; if invertible, apply the explicit algebraic/index inverse.

**Difficulty.** L1 nonzero gain; L2 offset/shift; L3 square with/without nonnegative domain; L4 first difference with supplied boundary condition.

**Misconceptions/constraints.** Invertibility is domain-dependent. Distractors take square roots without sign, forget lost initial conditions, or confuse causal inverse with any inverse.

**Feedback.** Show recovered input or the colliding pair.

**Examples.**

1. `y=3x` → invertible, `x=y/3`. L1.
2. `y=x²` on all real-valued signals → not invertible: x and−x collide. L2.
3. `y[n]=x[n]−x[n−1]` with `x[−1]=0` and finite causal sequence → recover by cumulative sum. L3.

**Validation/coverage.** Algebraic inverse composition or exact collision witness; domain always displayed.

### Family `system_bibo_stability`

**Task.** Decide BIBO stability for a directly described operator and give a bound or bounded-input witness.

**Response/template.** Stable/unstable plus bound/witness: `Is {system} BIBO stable?`

**Derivation.** Bound output in terms of `|x|≤M`, or construct a bounded input producing an unbounded output.

**Difficulty.** L1 memoryless bounded-gain/nonlinearity; L2 accumulator; L3 time-varying gain; L4 parameter condition.

**Misconceptions/constraints.** Distractors confuse bounded one example with “every bounded input,” internal state with output, or natural-response stability with BIBO absent initial-condition convention. LTI impulse tests are reserved for Category 6.

**Feedback.** State quantifiers and exhibit the bound/counterexample.

**Examples.**

1. `y(t)=0.5x(t)` → stable; `|y|≤0.5M`. L1.
2. `y[n]=Σ_{k=0}^n x[k]` → unstable; bounded x=1 gives y=n+1. L2.
3. `y[n]=n x[n]` → unstable; bounded x=1 gives y=n. L2.

**Validation/coverage.** Template proof metadata plus simulated witnesses over growing windows as a regression check.

### Family `system_property_witness`

**Task.** Choose or construct the smallest decisive witness for a claimed property failure.

**Response/template.** Single choice/structured inputs: `Which input(s) prove that {system} is not {property}?`

**Derivation.** Evaluate each candidate against the exact definition and choose one whose outputs violate it.

**Difficulty.** L1 zero-input linearity witness; L2 time-shift witness; L3 future-pair causality witness; L4 stability sequence.

**Misconceptions/constraints.** Incorrect choices may produce different outputs but not violate the quantified property. The checker verifies witness logic, not similarity to a stored example.

**Feedback.** Explain why the chosen witness is decisive and why a tempting non-witness is inconclusive.

**Examples.**

1. For `T{x}=x+1`, x=0 proves nonlinearity because T{0}≠0. L1.
2. For `T{x}[n]=n x[n]`, choose impulse δ[n] and shift1 to expose time variation. L2.
3. To prove `x[n+1]` noncausal, choose inputs equal through n=0 but differing at n=1; outputs differ at0. L3.

**Validation/coverage.** Formal property predicate evaluates every candidate; exactly one is decisive under stated claim.

### Family `block_diagram_reduce`

**Task.** Compute an equivalent operator/transfer expression for series, parallel, gain/sum, delay, and simple negative feedback blocks.

**Response/template.** Structured expression or matching diagram: `Reduce {block_diagram} to {requested_relation}.`

**Derivation.** Series composes in signal-flow order; parallel sums paths; at declared negative feedback with forward G and feedback H, solve `Y=G(X−HY)` to obtain `G/(1+GH)`.

**Difficulty.** L1 gains/series; L2 parallel/delay; L3 one feedback loop; L4 compare diagrams whose noncommuting blocks differ.

**Misconceptions/constraints.** Feedback sign is labeled. Reject algebraic loops without a unique relation and nonlinear-block reorderings. Distractors add series gains or multiply parallel gains.

**Feedback.** Label each internal signal and eliminate it one equation at a time.

**Examples.**

1. gains2 then3 → equivalent gain6. L1.
2. parallel gains2 and−1 summed → gain1. L2.
3. forward G=4, unity negative feedback → transfer `4/(1+4)=4/5`. L3.

**Validation/coverage.** Symbolic signal-flow equations and independent numeric probes; balance topology/sign.

### Cross-family progression

Execute systems before classifying them. Linearity and time invariance are introduced separately and then contrasted. Causality and memory are paired but never conflated. Direct stability precedes LTI impulse-response stability. Witness selection follows each property. Block diagrams synthesize only mastered operators.

## 6. Category: LTI systems and convolution

### Category purpose

Train the central LTI mental model: an impulse response completely determines zero-state behavior, and convolution adds shifted, weighted copies of that response.

### Learn

For an LTI system, `h` is the response to a unit impulse. A discrete input decomposes as a sum of shifted impulses, so the output is the same sum of shifted impulse responses. In continuous time, convolution integrates such weighted shifts. Causality and BIBO stability can be read directly from `h`.

### Prerequisites

System linearity/time invariance, elementary impulses, finite sequences, basic area.

### Category boundaries

Convolution here is time-domain. Fourier multiplication appears later. Initial-condition response is not part of the zero-state convolution unless explicitly added.

### Subcategories

1. Impulse and step responses
2. DT convolution
3. CT convolution
4. LTI structure and inverse reasoning

### Family `impulse_step_response`

**Task.** Relate impulse response `h` and zero-state step response `s`.

**Response/template.** Sequence/formula: `Given {h_or_s}, find {s_or_h}.`

**Derivation.** DT `s[n]=Σ_{k=−∞}^{n}h[k]` and `h[n]=s[n]−s[n−1]`; CT `s(t)=∫_{−∞}^{t}h(τ)dτ`, with `h=ds/dt` including impulses at jumps.

**Difficulty.** L1 finite DT cumulative sum/difference; L2 CT rectangular h; L3 step response with jump/impulse; L4 parameter recovery.

**Misconceptions/constraints.** Distractors equate h and s, use future cumulative sums, or miss an impulse at a CT jump. Advanced distribution derivative is choice/diagram based.

**Feedback.** Show cumulative area/sum and one incremental recovery.

**Examples.**

1. h[0..2]=`[1,2,−1]` → s[0..]=`[1,3,2,2,...]`. L1.
2. s[n]=u[n] → h[n]=δ[n]. L1.
3. h(t)=2 on `[0,1]`, zero elsewhere → s(t)=0 before0, `2t` on `[0,1]`, 2 after1. L2.

**Validation/coverage.** Difference/integration round trip with support/breakpoint checks.

### Family `dt_convolution_value`

**Task.** Compute one selected output sample of DT convolution.

**Response/template.** Scalar: `For x={sequence} and h={sequence}, compute y[{n0}]=(x*h)[{n0}].`

**Derivation.** Sum `x[k]h[n0−k]` over overlap of finite supports.

**Difficulty.** L1 nonnegative indices; L2 negative starts; L3 sparse/complex; L4 infer missing term.

**Misconceptions/constraints.** Distractors use pointwise product, correlation sign, or array positions rather than indices. Limit to at most six nonzero products.

**Feedback.** Display flip/shift/alignment table and only overlapping products.

**Examples.**

1. x=`[1,2]`, h=`[3,4]`, both start0; y[1]=`1·4+2·3=10`. L1.
2. x[-1]=2,x[0]=1; h[0]=1,h[1]=−1 → y[0]=`2(−1)+1(1)=−1`. L2.
3. x=δ[n−2], h[n] arbitrary → y[5]=h[3]. L3.

**Validation/coverage.** Direct sum and polynomial-coefficient multiplication oracle.

### Family `dt_convolution_sequence`

**Task.** Compute the full finite linear convolution and its index support.

**Response/template.** Indexed sequence editor: `Compute y=x*h for {x,h}.`

**Derivation.** Output support starts at sum of starts and ends at sum of ends; compute each diagonal sum.

**Difficulty.** L1 length2; L2 unequal lengths/signs; L3 shifted supports/sparse impulses; L4 parameterized short sequence or identify error.

**Misconceptions/constraints.** Distractors produce length max rather than `Lx+Lh−1`, circular convolution, or omit endpoint sample. Cap output length at9.

**Feedback.** Use diagonal/table or shifted-copy view.

**Examples.**

1. `[1,1]*[1,1]` → `[1,2,1]`. L1.
2. `[1,−1]*[1,2,1]` → `[1,1,−1,−1]`. L2.
3. x starts−1 values `[2,1]`, h starts2 values `[1,3]` → y starts1 values `[2,7,3]`. L3.

**Validation/coverage.** Naive convolution and generating-polynomial multiplication agree.

### Family `ct_convolution_overlap`

**Task.** Determine overlap interval and one convolution value for rectangular/triangular/piecewise-constant signals.

**Response/template.** Interval plus scalar: `At t={t0}, find the overlap and y(t0).`

**Derivation.** Reflect/shift `h(t−τ)`, intersect supports in τ, multiply heights/linear pieces, integrate over overlap.

**Difficulty.** L1 equal unit pulses at a point; L2 unequal widths/amplitudes; L3 signed pieces; L4 exact triangular integrand.

**Misconceptions/constraints.** Distractors slide without reflection, multiply total areas, or measure union. Landmarks exact; at most two polynomial pieces in one value.

**Feedback.** Animate/step reflection, shift, overlap, integral with accessible interval text.

**Examples.**

1. x=h=rect(t) (unit width); at t=0 overlap length1 → y(0)=1. L1.
2. x=1 on `[0,2]`, h=3 on `[0,1]`; at t=1 overlap τ∈`[0,1]` → y=3. L2.
3. same signals at t=2.5: overlap τ∈`[1.5,2]`, length0.5 → y=1.5. L3.

**Validation/coverage.** Interval-intersection/integration oracle and numerical quadrature only as secondary regression.

### Family `ct_convolution_piecewise`

**Task.** Construct/select the full piecewise convolution of exact-friendly pulses or one-sided exponentials.

**Response/template.** Piecewise fields or graph choice: `Find y(t)=x*h.`

**Derivation.** Collect all support-alignment breakpoints, derive overlap integral on each interval, simplify, and check continuity/jumps where applicable.

**Difficulty.** L1 identical rectangles→triangle; L2 unequal rectangles→trapezoid; L3 exponential with step; L4 short piecewise-linear case.

**Misconceptions/constraints.** Reject cases requiring high-degree integration or many pieces. Distractors use pointwise product shape, wrong support sum, or incorrect peak area.

**Feedback.** Show support addition, overlap evolution, then formula per interval.

**Examples.**

1. unit pulses on `[0,1]` convolve to triangle: t on `[0,1]`, `2−t` on `[1,2]`. L2.
2. width2 and width1 unit pulses → rise, plateau1, fall over support `[0,3]`. L2.
3. `e^{−t}u(t)*e^{−t}u(t)=t e^{−t}u(t)`. L3.

**Validation/coverage.** Symbolic piecewise integration plus sampled integral and total-area property.

### Family `convolution_properties`

**Task.** Simplify or compare convolutions using commutativity, associativity, distributivity, identity, shifts, and scaling.

**Response/template.** Expression/choice: `Simplify {convolution_expression} without direct integration.`

**Derivation.** Apply reviewed identities, including `x*δ(t−t0)=x(t−t0)` and area/time-scaling rules where stated.

**Difficulty.** L1 impulse identity; L2 shift/gain; L3 regroup cascades; L4 expose an invalid claimed property.

**Misconceptions/constraints.** Distractors confuse convolution with multiplication identities, shift in wrong direction, or assume convolution distributes over pointwise products.

**Feedback.** Name one identity per rewrite and verify with the definition when requested.

**Examples.**

1. `x[n]*δ[n] = x[n]`. L1.
2. `x[n]*δ[n−3]=x[n−3]`. L2.
3. `(x*h1)*h2=x*(h1*h2)` for supported scalar signals. L2.

**Validation/coverage.** Canonical convolution-expression AST and numeric finite-sequence probes.

### Family `short_deconvolution`

**Task.** Recover a short causal finite sequence from input and output under a unique convolution relation.

**Response/template.** Indexed sequence fields: `Given y=x*h and {x,y}, recover {h}.`

**Derivation.** Use earliest output sample to solve earliest unknown, then proceed recursively; equivalently divide generating polynomials when exact.

**Difficulty.** L1 leading x sample1; L2 other nonzero rational; L3 missing x instead; L4 detect no/ambiguous solution.

**Misconceptions/constraints.** Leading known divisor must be nonzero for unique recursive cases. Distractors divide samples pointwise or use circular deconvolution.

**Feedback.** Show one triangular convolution equation at a time.

**Examples.**

1. x=`[1,1]`, y=`[1,3,2]` → h=`[1,2]`. L2.
2. x=`[2]`, y=`[6,−2]` → h=`[3,−1]`. L1.
3. x=`[0,1]`, requested h start0 without output index context → reject/ambiguous unless support start is fixed. L4 diagnostic.

**Validation/coverage.** Re-convolve recovered sequence and verify uniqueness/rank of Toeplitz system.

### Family `lti_property_from_impulse`

**Task.** Decide causality, BIBO stability, memorylessness, or delay from an LTI impulse response.

**Response/template.** Property set: `For LTI impulse response {h}, classify {properties}.`

**Derivation.** Causal iff h is zero before0; stable iff absolute sum/integral finite; memoryless iff `h=Kδ`; pure delay/gain iff shifted impulse.

**Difficulty.** L1 finite causal h; L2 two-sided/decaying; L3 parameter condition; L4 distinguish causal from stable.

**Misconceptions/constraints.** Distractors inspect input rather than h, use signed cancellation for stability, or call any causal h memoryless. Infinite-support cases have exact convergence.

**Feedback.** Tie each property to a separate feature of h.

**Examples.**

1. h[n]=`(1/2)^n u[n]` → causal and stable, has memory. L2.
2. h[n]=u[n] → causal but not BIBO stable. L2.
3. h(t)=3δ(t−2) → causal, stable gain-delay, has memory because delay2. L3.

**Validation/coverage.** Support and absolute-sum/integral oracle; cross product of property outcomes.

### Family `lti_complex_exponential_eigenfunction`

**Task.** Use the complex-exponential eigenfunction property to derive an LTI response.

**Response/template.** Complex coefficient/output: `For LTI frequency response {H} and input {exponential_or_sinusoid}, find the zero-state steady response.`

**Derivation.** `e^{st}` or `z^n` produces same exponential scaled by `H(s)`/`H(z)` when convergence conditions hold; for real cosine use magnitude/phase of `H(jω)`.

**Difficulty.** L1 real gain; L2 complex magnitude/phase; L3 sum of two exponentials; L4 reject frequency outside declared ROC/undefined response.

**Misconceptions/constraints.** Distractors change input frequency, multiply phase as a scalar, or apply to nonlinear/time-varying systems. System explicitly LTI.

**Feedback.** Show exponential passing unchanged in shape while eigenvalue scales it.

**Examples.**

1. H(j2)=3 and x(t)=`e^{j2t}` → y=`3e^{j2t}`. L1.
2. H(j5)=`2e^{−jπ/4}`, x=`cos(5t)` → y=`2cos(5t−π/4)`. L2.
3. x=`e^{j t}+2e^{j3t}` → output `H(j1)e^{jt}+2H(j3)e^{j3t}`. L3.

**Validation/coverage.** Direct convolution on supported finite/exponential fixtures and complex arithmetic oracle.

### Cross-family progression

Step/impulse relation and one DT output sample precede full sequences. DT convolution gives exact finite practice before CT overlap animations. CT full-piecewise convolution is advanced. Identities and deconvolution follow direct computation. Impulse-response property reading and exponential eigenfunctions bridge to the frequency domain.

## 7. Category: Dynamic equations and state

### Category purpose

Connect short input/output traces to differential equations, difference equations, natural/forced response, transfer functions, and finite-dimensional state.

### Learn

A dynamic system needs current input and stored state. Difference equations update sample by sample; differential equations constrain rates of change. With linear zero-input dynamics, modes evolve exponentially or geometrically. Zero-state response comes from input with zero initial state; zero-input response comes from initial state with zero input.

### Prerequisites

System properties, convolution, elementary derivatives/integrals, small matrix-vector multiplication.

### Category boundaries

General ODE solving belongs in Calculus and general eigenanalysis in Linear Algebra. This category uses generated solution templates and dimensions at most three.

### Subcategories

1. Difference-equation traces
2. Differential-equation behavior
3. Response decomposition
4. State-space updates and modes

### Family `difference_equation_next`

**Task.** Compute one next output/state sample from a causal constant-coefficient recurrence.

**Response/template.** Scalar: `Given {difference_equation}, {past_values}, and {input_values}, find {target_sample}.`

**Derivation.** Algebraically isolate the target and substitute exact indexed values.

**Difficulty.** L1 FIR/input only; L2 first-order feedback; L3 second-order; L4 solve an equation where target coefficient is not1.

**Misconceptions/constraints.** Distractors shift all indices incorrectly, use unavailable future values, or omit initial conditions. Every required value is supplied/derivable.

**Feedback.** Write the recurrence at the requested n with actual numbers.

**Examples.**

1. `y[n]=x[n]+x[n−1]`, x[0]=2,x[−1]=0 → y[0]=2. L1.
2. `y[n]=0.5y[n−1]+x[n]`, y[−1]=0,x[0]=4 → y[0]=4. L2.
3. `2y[n]−y[n−1]=x[n]`, y[0]=3,x[1]=5 → y[1]=4. L3.

**Validation/coverage.** Independent recurrence isolator and direct residual substitution.

### Family `difference_equation_trace`

**Task.** Generate a short output/state sequence from input and initial conditions.

**Response/template.** Indexed sequence: `Trace {equation} for n={range}.`

**Derivation.** Iterate causally in increasing n, retaining required past values exactly.

**Difficulty.** L1 FIR; L2 first-order IIR; L3 second-order/sign changes; L4 separate zero-input and zero-state traces.

**Misconceptions/constraints.** Limit to 3–8 output samples and readable rational values. Distractors repeatedly reuse initial state or update in the wrong order.

**Feedback.** Table columns contain n, input, past state/output, and result.

**Examples.**

1. `y[n]=x[n]+x[n−1]`, x=`[1,2,0]`, zero prehistory → y=`[1,3,2]`. L1.
2. `y[n]=0.5y[n−1]+δ[n]`, y[−1]=0 → y[0..3]=`[1,1/2,1/4,1/8]`. L2.
3. `y[n]=y[n−1]+x[n]`, x=`[1,−1,2]` → y=`[1,0,2]`. L2.

**Validation/coverage.** Iterative simulator plus equation-residual check at every n.

### Family `differential_equation_solution_check`

**Task.** Verify which candidate satisfies a linear differential equation and initial condition or recover a parameter.

**Response/template.** Single choice/parameter: `Which y(t) satisfies {equation} and {initial_conditions}?`

**Derivation.** Differentiate candidate AST, substitute into equation, and test every initial condition exactly.

**Difficulty.** L1 first-order homogeneous; L2 forced exponential/constant; L3 second-order exact modes; L4 repeated-root or resonance candidate recognition.

**Misconceptions/constraints.** Do not grade arbitrary symbolic solution derivations. Distractors satisfy equation but not IC, IC but not equation, or use wrong sign exponent.

**Feedback.** Show residual and initial-condition table separately.

**Examples.**

1. `y'+2y=0,y(0)=3` → `3e^{−2t}`. L1.
2. `y'+y=1,y(0)=0` → `1−e^{−t}`. L2.
3. `y''+y=0,y(0)=0,y'(0)=2` → `2sin t`. L3.

**Validation/coverage.** Exact symbolic differentiation/substitution under bounded AST.

### Family `natural_forced_decompose`

**Task.** Separate total response into zero-input/natural and zero-state/forced components.

**Response/template.** Two formula/sequence fields: `Decompose {response_data} into zero-input and zero-state parts.`

**Derivation.** Solve/simulate with input zero and original initial state, then with input present and zero initial state; sum and verify original.

**Difficulty.** L1 first-order DT; L2 first-order CT supplied forms; L3 second-order/mode matching; L4 infer initial state from decomposition.

**Misconceptions/constraints.** Distractors label steady-state as always zero-state, put initial-condition terms into convolution, or assume “natural” means unstable. Exact template solutions only.

**Feedback.** Show the two experiments and superposition.

**Examples.**

1. `y[n]=0.5y[n−1]+x[n]`, y[−1]=2, x=0 → zero-input begins y[0]=1. L1.
2. same with δ input and zero initial → zero-state h[n]=`0.5^n u[n]`. L2.
3. total for both is sum of those traces, verified sample by sample. L2.

**Validation/coverage.** Two simulator runs plus exact superposition residual.

### Family `equation_to_transfer_function`

**Task.** Derive a zero-state transfer function from a linear constant-coefficient differential/difference equation.

**Response/template.** Structured polynomial ratio: `Under zero initial conditions, find H={Y}/{X} for {equation}.`

**Derivation.** Replace `d^k/dt^k` by `s^k` or delay `x[n−k]` by `z^{−k}`, collect Y and X, then divide and normalize.

**Difficulty.** L1 first order; L2 second order/FIR; L3 mixed input derivatives/delays; L4 normalize and identify direct feedthrough.

**Misconceptions/constraints.** Prompt always states zero initial conditions. Distractors include IC terms, invert ratio, or shift signs incorrectly. Polynomial degree≤2.

**Feedback.** Transform each term in an aligned equation before collecting.

**Examples.**

1. `y'+2y=x` → `H(s)=1/(s+2)`. L1.
2. `y[n]−0.5y[n−1]=x[n]` → `H(z)=1/(1−0.5z^{-1})`. L2.
3. `y''+3y'+2y=x'+4x` → `(s+4)/(s²+3s+2)`. L3.

**Validation/coverage.** Symbolic polynomial collection and cross-multiplied equation identity.

### Family `state_update_trace`

**Task.** Execute a small CT derivative evaluation or DT state update and output equation.

**Response/template.** Vector/scalar fields: `Given {A,B,C,D}, state {q}, and input {u}, find {next_or_derivative,y}.`

**Derivation.** CT `qdot=Aq+Bu`, `y=Cq+Du`; DT `q[n+1]=Aq[n]+Bu[n]`.

**Difficulty.** L1 scalar state; L2 2×2; L3 two steps/input change; L4 recover missing state/input.

**Misconceptions/constraints.** State vector uses `q` to avoid confusion with input signal x. Dimensions≤3 and exact small entries. Distractors use elementwise matrix multiplication or output after rather than before update when convention says current state.

**Feedback.** Show matrix-vector products with dimensions.

**Examples.**

1. DT q next=`0.5q+u`, q=2,u=3 → qnext=4. L1.
2. `A=[[1,1],[0,1]], q=[2,3], B=[1,0],u=1` → qnext=`[6,3]`. L2.
3. with C=`[1,−1]`,D=0,current q `[2,3]` → current y=−1. L2.

**Validation/coverage.** Exact matrix arithmetic and dimension/type checks.

### Family `state_space_input_output`

**Task.** Derive a short impulse response/transfer function from a tiny state-space model or realize a supplied recurrence.

**Response/template.** Sequence/rational function or matching realization: `For {state_model}, find {requested_io_behavior}.`

**Derivation.** DT zero-state impulse response uses `h[0]=D`, `h[n]=CA^{n−1}B` for n≥1; transfer `H(z)=C(zI−A)^{-1}B+D`. CT analogous `H(s)=C(sI−A)^{-1}B+D`.

**Difficulty.** L1 scalar state; L2 diagonal 2-state; L3 canonical recurrence realization; L4 compare equivalent realizations.

**Misconceptions/constraints.** Small exact inverses only; no claim that a realization is unique. Distractors omit D or use `CA^nB` off by one.

**Feedback.** Show initial impulse update and first two Markov parameters before transform algebra.

**Examples.**

1. DT scalar A=1/2,B=C=1,D=0 → h[1]=1,h[2]=1/2. L2.
2. CT A=−2,B=C=1,D=0 → H(s)=`1/(s+2)`. L2.
3. D=3 adds direct h[0]=3/transfer feedthrough3. L3.

**Validation/coverage.** Compare state simulation, Markov parameters, and rational expansion.

### Family `state_mode_evolution`

**Task.** Use an eigenvector/mode to predict zero-input state evolution and stability trend.

**Response/template.** Vector/formula plus trend: `Given Aq=λq and initial state {multiple}q, find state after {time_or_steps}.`

**Derivation.** DT `q[n]=λ^n q[0]`; CT for `qdot=Aq`, `q(t)=e^{λt}q(0)`. For modal sums, scale each supplied eigencomponent independently.

**Difficulty.** L1 one real mode; L2 two supplied modes; L3 negative/complex-pair qualitative behavior; L4 dominant mode.

**Misconceptions/constraints.** Complex pairs are qualitative/choice only in v1 unless coefficients supplied. Distractors multiply by nλ, confuse CT `e^{λt}` with `λ^t`, or ignore eigenvector direction.

**Feedback.** Connect matrix action to scalar evolution along an invariant direction.

**Examples.**

1. DT λ=1/2,q0=v → q3=`v/8`. L1.
2. CT λ=−2,q0=3v → q(t)=`3e^{−2t}v`. L2.
3. DT components along λ=0.8 and−0.2 → both decay; 0.8 mode dominates long-term. L3.

**Validation/coverage.** Exact matrix-power/exponential-template check and eigenpair verification.

### Cross-family progression

One-step recurrence substitution precedes traces. Candidate ODE verification avoids requiring general symbolic solving. Zero-input/zero-state separation precedes transfer functions. Direct state updates precede state-to-input/output and modal behavior. General matrix and ODE fluency remain in their sister apps.

## 8. Category: Frequency response and Fourier representations

### Category purpose

Train the ability to predict how an LTI system treats frequency components and to move between periodic signals, spectra, and time-domain operations.

### Learn

An LTI system cannot create a new frequency from a single complex exponential; it scales that component by `H(jω)` or `H(e^{jΩ})`. Fourier series represents a periodic signal with discrete harmonics. The Fourier transform represents aperiodic signal content over continuous frequency. Time shifts change phase, while time scaling changes spectral scale.

### Prerequisites

Complex arithmetic, LTI eigenfunction property, energy/power, and basic integration.

### Category boundaries

Circuit-specific impedance and component filter design remain in Electric Circuits. Transform pairs are a pinned small library, not arbitrary symbolic integration.

### Subcategories

1. Frequency response
2. Filter shape and Bode landmarks
3. Fourier series
4. Fourier-transform properties
5. Spectral translation

### Family `frequency_response_evaluate`

**Task.** Evaluate magnitude/phase of a simple `H(jω)` or `H(e^{jΩ})` at a supplied frequency.

**Response/template.** Complex/magnitude-phase fields: `Evaluate {H} at {frequency}.`

**Derivation.** Substitute the frequency variable, compute exact/controlled complex arithmetic, then magnitude and canonical phase.

**Difficulty.** L1 real gain; L2 first-order rational landmark; L3 DT delay/FIR sum; L4 compare two frequencies.

**Misconceptions/constraints.** Avoid phase grading at zeros. Distractors substitute ω for jω, omit denominator magnitude, or report real/imaginary parts as magnitude/phase.

**Feedback.** Show substitution, rectangular value, then polar conversion.

**Examples.**

1. `H(jω)=2`, at any ω → magnitude2, phase0. L1.
2. `H(jω)=1/(1+jω)`, at ω=1 → magnitude`1/sqrt(2)`, phase`−π/4`. L2.
3. `H(e^{jΩ})=1+e^{−jΩ}`, at Ω=π →0; phase undefined. L3.

**Validation/coverage.** Independent complex arithmetic and direct impulse-response DTFT where available.

### Family `sinusoid_steady_state`

**Task.** Predict zero-state sinusoidal steady-state output from input and frequency response.

**Response/template.** Canonical sinusoid fields/formula: `Input is {sinusoid}; H at its frequency is {value}. Find steady-state output.`

**Derivation.** Output amplitude=`input amplitude·|H|`, phase=`input phase+arg H`, with same frequency; DC offset uses H(0) separately.

**Difficulty.** L1 gain only; L2 phase; L3 DC plus sinusoid/multiple harmonics; L4 distinguish steady-state from transient.

**Misconceptions/constraints.** Distractors change frequency, multiply phase, add magnitude, or pass DC through H at sinusoid frequency.

**Feedback.** Process each frequency component independently.

**Examples.**

1. input `3cos(2t)`, H(j2)=2 → `6cos(2t)`. L1.
2. H(j4)=`0.5e^{jπ/3}`, input `2cos(4t−π/6)` → `cos(4t+π/6)`. L2.
3. input `1+2cos t`, H(0)=3,H(j1)=`e^{−jπ/2}` → `3+2cos(t−π/2)`. L3.

**Validation/coverage.** Complex coefficient multiplication and time-domain simulation after transient for template systems.

### Family `filter_response_classify`

**Task.** Classify low-pass, high-pass, band-pass, band-stop, all-pass, or nonstandard response from magnitude samples/plot.

**Response/template.** Single choice: `Classify {magnitude_response} under the displayed ideal/qualitative definitions.`

**Derivation.** Compare pass/attenuated regions and DC/high-frequency behavior to pinned class predicates.

**Difficulty.** L1 ideal low/high; L2 band types; L3 all-pass with phase; L4 response that matches none.

**Misconceptions/constraints.** Magnitude axis/scale is explicit. Distractors classify from phase or assume every response is one named filter.

**Feedback.** Mark passbands, stopbands, and limiting behavior.

**Examples.**

1. magnitude near1 at low ω and tends0 high → low-pass. L1.
2. magnitude small low/high but large around ω0 → band-pass. L2.
3. magnitude1 for all ω with varying phase → all-pass. L3.

**Validation/coverage.** Semantic response-shape labels and representative sample inequalities.

### Family `cutoff_bandwidth`

**Task.** Read/compute cutoff frequency, half-power magnitude, center frequency, or bandwidth from declared response landmarks.

**Response/template.** Numeric fields: `For {response}, find {cutoff_or_bandwidth}.`

**Derivation.** Half-power magnitude is passband magnitude divided by `sqrt(2)`; bandwidth=`ω_H−ω_L` or hertz analog; center definition is explicitly arithmetic/geometric as requested.

**Difficulty.** L1 one cutoff; L2 convert Hz/rad/s; L3 band limits; L4 solve first-order magnitude equation.

**Misconceptions/constraints.** Distractors use half amplitude, add band edges, or mix units. No hidden convention for center frequency.

**Feedback.** Tie −3 dB/half-power to squared magnitude.

**Examples.**

1. unity passband cutoff has magnitude `1/sqrt(2)`. L1.
2. band edges100 and300 Hz → bandwidth200 Hz. L2.
3. `|H|=1/sqrt(1+(ω/10)^2)` → cutoff10 rad/s. L3.

**Validation/coverage.** Exact response evaluation and unit-aware landmark checks.

### Family `bode_asymptote`

**Task.** Determine asymptotic magnitude slope/value or phase landmarks from factored first/second-order poles/zeros.

**Response/template.** Slope/value table or plot choice: `Complete the asymptotic Bode plot for {factored_H}.`

**Derivation.** Each first-order zero adds +20 dB/dec after its corner; pole adds −20; origin factors apply everywhere; gains add dB offsets. Phase landmarks use the stated approximation profile.

**Difficulty.** L1 one pole/zero; L2 gain plus corner; L3 two corners; L4 pole/zero cancellation shown before simplification.

**Misconceptions/constraints.** At most three effective factors. Distractors use linear magnitude addition, wrong slope sign, or change slope before corner.

**Feedback.** Maintain a running slope table at each corner.

**Examples.**

1. `1/(1+jω/10)` → slope0 then−20 dB/dec after10. L1.
2. `1+jω/100` → +20 dB/dec after100. L1.
3. `(1+jω/10)/[(1+jω)(1+jω/100)]` → slope0 below1, −20 dB/dec from1–10, 0 from10–100, and−20 above100. L3.

**Validation/coverage.** Factor-event sweep and numerical magnitude comparison away from corners.

### Family `phase_delay`

**Task.** Convert linear phase at a frequency to phase delay or predict phase from a pure delay.

**Response/template.** Time/phase field: `At {frequency}, {system} has {phase_or_delay}; find {target}.`

**Derivation.** Pure delay `t0` has phase `−ωt0`; phase delay at nonzero ω is `−φ(ω)/ω`, with unwrapped phase supplied when needed.

**Difficulty.** L1 pure delay; L2 infer delay; L3 degrees/Hz; L4 distinguish phase wrapping ambiguity.

**Misconceptions/constraints.** Group delay derivatives are excluded in v1. Prompt supplies unwrapped phase for inverse tasks; reject ω=0.

**Feedback.** Connect delay to shifted sinusoid and state phase-wrap ambiguity.

**Examples.**

1. delay0.1 s at ω=5 → phase−0.5 rad. L1.
2. phase−π/2 at ω=10π → delay0.05 s. L2.
3. delay2 ms at f=100 Hz → phase`−0.4π rad` (−72°). L3.

**Validation/coverage.** Time-shift simulation and unit-aware formula round trip.

### Family `fourier_series_coefficients`

**Task.** Compute selected complex Fourier-series coefficients for constant, sinusoid, impulse train, or simple pulse.

**Response/template.** Indexed complex coefficients: `For one period of {signal}, find C_k for {indices}.`

**Derivation.** Use coefficient integral or direct canonical exponential decomposition.

**Difficulty.** L1 DC/sinusoid; L2 shifted sinusoid; L3 rectangular duty-cycle coefficient; L4 combine components.

**Misconceptions/constraints.** Coefficient convention is repeated. Distractors omit 1/T, put all cosine amplitude in one side, or reverse phase signs.

**Feedback.** Show either exponential decomposition or one exact period integral.

**Examples.**

1. `x(t)=3` → C0=3, others0. L1.
2. `2cos(ω0t)` → C1=C−1=1. L1.
3. `2cos(ω0t+π/3)` → C1=`e^{jπ/3}`, C−1=`e^{-jπ/3}`. L2.

**Validation/coverage.** Synthesis reconstruction at exact landmarks and coefficient conjugate symmetry for real signals.

### Family `fourier_series_synthesis`

**Task.** Reconstruct/simplify a real periodic signal from a sparse set of complex Fourier coefficients.

**Response/template.** Formula/graph choice: `Synthesize the real signal from {coefficients}.`

**Derivation.** Sum conjugate pairs: `C_k e^{jkω0t}+C_k*e^{-jkω0t}=2|C_k|cos(kω0t+arg C_k)`.

**Difficulty.** L1 DC/pair; L2 phase; L3 two harmonics; L4 missing coefficient via realness.

**Misconceptions/constraints.** Coefficients generated conjugate-symmetric for real outputs. Distractors omit factor2 or use k as amplitude.

**Feedback.** Pair positive and negative harmonics before simplifying.

**Examples.**

1. C0=1,C±1=1/2 → `1+cos(ω0t)`. L1.
2. C1=`e^{jπ/4}`,C−1 conjugate → `2cos(ω0t+π/4)`. L2.
3. C±1=1,C±2=1/2 → `2cosω0t+cos2ω0t`. L3.

**Validation/coverage.** Exact coefficient extraction from synthesized AST.

### Family `fourier_symmetry`

**Task.** Infer coefficient/spectrum symmetry or time-signal parity/reality from the other representation.

**Response/template.** Property matching: `Given {time_or_spectral_property}, which {coefficient_property} must hold?`

**Derivation.** Real time signal gives conjugate symmetry; real even gives real even spectrum; real odd gives imaginary odd spectrum under pinned transform.

**Difficulty.** L1 real conjugate symmetry; L2 even/odd; L3 infer missing coefficients; L4 distinguish sufficient from necessary statements.

**Misconceptions/constraints.** Distractors claim real signal has only real coefficients or even signal has only positive frequencies.

**Feedback.** Apply conjugation/reflection identity to one coefficient pair.

**Examples.**

1. real x(t): C−3=`C3*`. L1.
2. real even x(t): coefficients real and even. L2.
3. real odd x(t): CTFT is imaginary and odd (where ordinary function representation applies). L3.

**Validation/coverage.** Symbolic transform-symmetry table and generated pair checks.

### Family `spectrum_line_read`

**Task.** Read harmonic frequencies, complex coefficients, amplitude/phase, DC, or fundamental period from a line spectrum.

**Response/template.** Named fields/formula: `Interpret {line_spectrum}.`

**Derivation.** Use line locations `kω0` and complex weights; pair conjugates for real sinusoid amplitudes/phases.

**Difficulty.** L1 one real cosine; L2 DC/phase; L3 missing fundamental line but gcd of indices; L4 distinguish coefficient from drawn impulse height.

**Misconceptions/constraints.** Arrow label is weight/area, not pixel height. Reject ambiguous fundamental when active indices have a common factor unless expected reduced fundamental is computed.

**Feedback.** Label k, frequency, and coefficient separately.

**Examples.**

1. lines at ±5 with weights1 → `2cos5t`. L1.
2. line0 weight3 and ±2 weights `e^{±jπ/4}` → `3+2cos(2t+π/4)`. L2.
3. active harmonics k=2,3 for displayed ω0=4 → fundamental remains4 rad/s because gcd(2,3)=1. L3.

**Validation/coverage.** Spectrum AST synthesis/extraction round trip.

### Family `fourier_transform_property`

**Task.** Derive a transformed spectrum using linearity, time shift, frequency shift, time scaling, differentiation, or convolution.

**Response/template.** Structured transformed expression/matching: `Given x(t)↔X(ω), find the transform of {modified_signal}.`

**Derivation.** Apply one/two pinned identities with correct scale/phase factors, e.g. `x(t−t0)↔e^{-jωt0}X(ω)`, `x(at)↔(1/|a|)X(ω/a)`.

**Difficulty.** L1 gain/shift; L2 scaling/modulation; L3 derivative/convolution; L4 compose two transformations in declared order.

**Misconceptions/constraints.** Limit transform depth2. Distractors omit absolute Jacobian, shift X rather than multiply phase, or confuse convolution/product.

**Feedback.** Name and apply identities sequentially, preserving variable.

**Examples.**

1. x(t−2) → `e^{-j2ω}X(ω)`. L1.
2. x(3t) → `(1/3)X(ω/3)`. L2.
3. `dx/dt` → `jωX(ω)` under stated regularity. L2.

**Validation/coverage.** Property AST plus numerical quadrature on bounded smooth fixtures as secondary.

### Family `parseval_energy_power`

**Task.** Compute/compare signal energy or periodic power from spectral coefficients using Parseval.

**Response/template.** Nonnegative scalar: `Use {spectral_data} to find {energy_or_power}.`

**Derivation.** FS average power=`Σ|C_k|²`; CTFT energy=`(1/2π)∫|X(ω)|²dω` under convention.

**Difficulty.** L1 sparse FS; L2 complex coefficients; L3 simple rectangular spectral magnitude integral; L4 missing coefficient from total power.

**Misconceptions/constraints.** Distractors sum coefficients without magnitude-square or omit the convention factor. Spectra finite/sparse or piecewise constant.

**Feedback.** Show contribution of each symmetric line/band.

**Examples.**

1. C0=2,C±1=1 → power `4+1+1=6`. L1.
2. x=`3cosω0t` has C±1=3/2 → power `9/4+9/4=9/2`. L2.
3. `|X|=2` on `|ω|≤π`, zero elsewhere → energy `(1/2π)·4·2π=4`. L3.

**Validation/coverage.** Compare against direct time-domain energy/power oracle.

### Family `spectral_mixing_modulation`

**Task.** Predict frequencies created by multiplying a signal by a cosine or adding sinusoids.

**Response/template.** Frequency-line set and weights: `Find output spectral lines when {signal} is multiplied by {carrier}.`

**Derivation.** `x(t)cos(ωc t)↔(1/2)[X(ω−ωc)+X(ω+ωc)]`; for tones, use product-to-sum.

**Difficulty.** L1 two tones; L2 baseband lines shifted; L3 overlapping shifted copies; L4 distinguish multiplication from addition/nonlinear harmonics.

**Misconceptions/constraints.** Frequencies exact and nonnegative display convention stated. Distractors only add carrier frequency, preserve original amplitude, or confuse signal addition with mixing.

**Feedback.** Draw two half-amplitude shifted spectral copies.

**Examples.**

1. `cos2t·cos5t = 0.5cos3t+0.5cos7t`. L1.
2. line at ±1 mixed by cos10t → lines at ±9 and±11, weights halved. L2.
3. adding cos2t+cos5t keeps lines2 and5; it does not create3 and7. L3 contrast.

**Validation/coverage.** Trigonometric expansion and spectral-shift AST agree.

### Cross-family progression

Evaluate H before predicting sinusoidal response. Qualitative filter types precede cutoff and Bode accumulation. Fourier coefficients and synthesis are inverse pairs; symmetry follows real examples. Spectrum reading precedes abstract transform properties. Parseval and mixing are later composition families.

## 9. Category: Sampling and finite spectral analysis

### Category purpose

Train the transition between CT signals and samples, distinguish unavoidable alias equivalence from implementation error, and interpret finite DFT data without overstating it.

### Learn

Sampling evaluates `x(t)` at `t=nT_s`; `f_s=1/T_s`. A bandlimited signal below `f_s/2` is uniquely recoverable under ideal assumptions. Frequencies separated by integer multiples of `f_s` produce the same samples. The DFT analyzes one finite record as a periodic length-N sequence; circular convolution and bin spacing follow from that finite periodic model.

### Prerequisites

Sinusoids, DT frequency equivalence, Fourier line spectra, finite convolution.

### Category boundaries

No ADC hardware, antialias-filter circuit design, quantization noise statistics, window optimization, or FFT implementation.

### Subcategories

1. Sampling and aliasing
2. Reconstruction conditions
3. DFT bins and simple transforms
4. Finite-record effects and circular convolution

### Family `sample_continuous_signal`

**Task.** Generate sample values/DT formula from a CT signal and sampling rate.

**Response/template.** Indexed samples/formula: `Sample {x(t)} at f_s={fs}, starting {origin}.`

**Derivation.** Substitute `t=n/f_s` (plus declared origin); normalize resulting Ω if requested.

**Difficulty.** L1 landmark samples; L2 phase/origin; L3 sum of tones; L4 infer CT candidates sharing samples.

**Misconceptions/constraints.** Exact-friendly angles only. Distractors multiply by fs, treat sample index as seconds, or join samples to recover unique unsupplied CT signal.

**Feedback.** Show t-grid and substitution.

**Examples.**

1. x=`cos(2πt)`, fs=4 Hz → x[n]=`cos(πn/2)` → `[1,0,−1,0,...]`. L1.
2. x=`sin(2π·100t)`, fs=800 → Ω=π/4. L2.
3. x=`2+cos(2π·3t)`, fs=6 → x[n]=`2+cos(πn)=3,1,...`. L2.

**Validation/coverage.** CT AST substitution and exact trigonometric landmark evaluator.

### Family `nyquist_rate_condition`

**Task.** Determine minimum strict sampling condition or whether a declared bandlimited signal meets ideal reconstruction requirements.

**Response/template.** Rate/yes-no: `Signal is bandlimited to {B}. Is f_s={fs} sufficient under the strict v1 rule?`

**Derivation.** Require `f_s>2B` in generated sufficiency questions; equality is labeled boundary/avoided because endpoint content and convention matter.

**Difficulty.** L1 B given; L2 highest component from spectrum; L3 baseband bandwidth versus carrier highest frequency; L4 choose antialias cutoff conceptually.

**Misconceptions/constraints.** Distractors require fs>B, use lowest frequency, or confuse spectral width with highest absolute frequency. No claim that ordinary non-bandlimited signals reconstruct exactly.

**Feedback.** Mark spectral copies and Nyquist interval.

**Examples.**

1. B=3 kHz, fs=8 kHz → sufficient. L1.
2. tones at1 and5 kHz → B=5 kHz; fs=9 kHz insufficient. L2.
3. ideal band occupying 8–12 kHz sampled as baseband under ordinary v1 theorem uses highest12 kHz, so fs>24 kHz; bandpass-sampling exceptions excluded. L3.

**Validation/coverage.** Exact inequality and spectrum support oracle; equality handled explicitly.

### Family `alias_frequency`

**Task.** Find the baseband alias and sampled DT frequency of a CT sinusoid.

**Response/template.** Frequency and Ω: `Sample tone f={f} at f_s={fs}; give its alias in [0,f_s/2] and canonical Ω.`

**Derivation.** Reduce f modulo fs, reflect values above fs/2 to `fs−r`; track sine/cosine phase/sign when waveform, not just frequency, is requested.

**Difficulty.** L1 one fold; L2 multiple wraps; L3 sine phase/sign; L4 identify all CT frequencies in a range sharing samples.

**Misconceptions/constraints.** Avoid ambiguous Nyquist sine zero cases unless explicit. Distractors subtract fs only once or clamp at fs/2.

**Feedback.** Show frequency modulo fs and reflection.

**Examples.**

1. 7 Hz at fs=10 → alias3 Hz, canonical |Ω|=`0.6π`. L1.
2. 23 Hz at fs=8 → remainder7→alias1 Hz. L2.
3. tones2,12,18 Hz at fs=10 all yield cosine samples at absolute alias2 Hz (phase may distinguish declared variants). L3.

**Validation/coverage.** Exact modular-frequency equivalence and sample comparison over common periods.

### Family `sampled_reconstruction_choice`

**Task.** Choose which CT spectra/signals are consistent with samples and which is selected by ideal bandlimited reconstruction.

**Response/template.** Multiple choice/set: `Given {samples,fs,assumption}, which reconstruction follows?`

**Derivation.** Map sample-spectrum replicas; under explicit baseband bandlimit select the unique copy in `|f|<fs/2`.

**Difficulty.** L1 one sinusoid candidates; L2 phase; L3 spectrum replicas; L4 “not uniquely determined” without bandlimit.

**Misconceptions/constraints.** The app must emphasize samples alone do not specify a unique CT signal. Distractors assume straight-line interpolation is ideal reconstruction.

**Feedback.** Separate consistency with samples from selection by prior bandlimit assumption.

**Examples.**

1. samples `cos(0.4πn)`, fs=10 → 2 Hz baseband reconstruction under strict baseband assumption. L2.
2. 2 Hz and8 Hz cosines at fs10 share samples; without bandlimit both are consistent. L3.
3. all-zero samples can come from zero or `sin(2πf_s t)`; samples alone are not unique. L3.

**Validation/coverage.** Symbolic sample equality and assumption-gated uniqueness predicate.

### Family `dft_bin_frequency`

**Task.** Map DFT bin indices to Ω/hertz, including wrapped negative frequencies and resolution.

**Response/template.** Named frequency fields: `For N={N}, f_s={fs}, interpret bin k={k}.`

**Derivation.** Spacing `Δf=fs/N`; raw bin f=kΔf; if k>N/2, wrapped signed f=(k−N)Δf.

**Difficulty.** L1 low bin; L2 negative wrapped bin; L3 even-N Nyquist bin; L4 inverse bin from frequency.

**Misconceptions/constraints.** DFT length2–16 exact-friendly. Distractors use fs/(N−1), call k frequency, or mirror wrong.

**Feedback.** Show a circular bin ruler.

**Examples.**

1. N=8,fs=800 Hz,k=2 →200 Hz. L1.
2. same k=7 → raw700, wrapped−100 Hz. L2.
3. N=8,k=4 → Nyquist ±400 Hz boundary representation. L3.

**Validation/coverage.** Integer modular mapping and inverse round trip.

### Family `simple_dft`

**Task.** Compute the DFT of a short structured sequence or recover it by IDFT.

**Response/template.** Complex vector grid: `Using the stated DFT convention, compute X[k] for {x}.`

**Derivation.** Apply DFT sum with exact roots for N in `{2,4,8}` and structured impulses/constants/alternating/two-sample cases.

**Difficulty.** L1 impulse/constant; L2 N=4 general small sequence; L3 shift/phase property; L4 inverse or missing coefficient from real symmetry.

**Misconceptions/constraints.** Avoid tedious unstructured N=8 arithmetic. Distractors put 1/N on forward transform, reverse exponent sign, or confuse time index with bin.

**Feedback.** Use basis-vector/rotating-phasor table.

**Examples.**

1. x=`[1,0,0,0]` → X=`[1,1,1,1]`. L1.
2. x=`[1,1,1,1]` → X=`[4,0,0,0]`. L1.
3. x=`[1,0,−1,0]` → X=`[0,2,0,2]`. L2.

**Validation/coverage.** Direct O(N²) exact complex oracle and IDFT round trip.

### Family `dft_leakage_recognize`

**Task.** Predict whether a finite sinusoidal record lands on one DFT bin or spreads across bins under a rectangular window.

**Response/template.** Choice plus cycles/bin: `Will {tone,record} be bin-centered?`

**Derivation.** Record contains integer cycles iff `fN/fs` is integer; otherwise endpoint periodic extension is discontinuous and energy spreads.

**Difficulty.** L1 integer cycles; L2 fractional cycles; L3 compare changing N/fs; L4 distinguish resolution from leakage.

**Misconceptions/constraints.** Qualitative only; no side-lobe amplitude calculation. Distractors claim DFT always returns true single tone or zero padding removes leakage.

**Feedback.** Show the record's periodic wrap and bin location.

**Examples.**

1. fs=8,N=8,f=2 →2 cycles, bin2, no ideal rectangular-window leakage. L1.
2. fs=8,N=8,f=2.5 →2.5 cycles, leakage. L2.
3. zero-padding same 2.5-cycle record samples spectrum more densely but does not remove leakage. L3.

**Validation/coverage.** Exact cycle-count predicate and numerical DFT shape as secondary.

### Family `circular_linear_convolution`

**Task.** Compute short circular convolution or choose zero-padding needed for linear convolution via DFT.

**Response/template.** Sequence/integer length: `Compute N-point circular convolution or choose N for linear convolution.`

**Derivation.** Circular `y[n]=Σ_{k=0}^{N−1}x[k]h[(n−k) mod N]`; linear convolution length `Lx+Lh−1`, so DFT length at least that avoids wrap.

**Difficulty.** L1 circular shift impulse; L2 N=3/4 computation; L3 compare linear; L4 padding length.

**Misconceptions/constraints.** Sequences length≤4. Distractors return truncated linear convolution or choose `max(Lx,Lh)` padding.

**Feedback.** Show wraparound arrows and the non-wrapped padded alternative.

**Examples.**

1. N=4, x=`[1,2,0,0]`, h=`[1,0,0,0]` → circular y=x. L1.
2. N=3, `[1,1,0]` circular-convolved with itself → `[1,2,1]` (fits without endpoint wrap here). L2.
3. lengths3 and4 require N≥6 for DFT-based linear convolution. L3.

**Validation/coverage.** Direct modular sum versus DFT-multiply-IDFT; compare padded linear oracle.

### Cross-family progression

Direct sample substitution precedes Nyquist conditions and alias arithmetic. Reconstruction questions explicitly add the missing bandlimit assumption. Bin mapping precedes DFT computation. Leakage is qualitative after bin meaning. Circular convolution follows both linear convolution and DFT.

## 10. Category: Laplace, Z, poles, and system behavior

### Category purpose

Train bounded transform-domain reasoning that connects time support and modes to rational expressions, regions of convergence, poles, causality, stability, and system response.

### Learn

Laplace and Z transforms include a region of convergence. Poles encode natural modes, while zeros suppress specific transform-domain components. The same rational expression can represent different right-/left-/two-sided signals under different ROCs. For causal minimal rational LTI systems, stability is read from pole location.

### Prerequisites

Transfer functions, exponentials, complex plane, geometric series.

### Category boundaries

No contour integration, arbitrary inverse transform, root locus, or high-order partial fractions. Initial-value/final-value theorems are used only with all conditions checked.

### Subcategories

1. Transform pairs and ROC
2. Pole-zero representation
3. Causality and stability
4. Response and value theorems

### Family `laplace_pair`

**Task.** Match/derive a CT Laplace pair and ROC from the bounded library.

**Response/template.** Rational expression plus ROC or signal choice: `Find X(s) and ROC for {signal}.`

**Derivation.** Apply direct integral/geometric-exponential templates and shift/scale properties.

**Difficulty.** L1 right-sided exponential; L2 left-sided; L3 sum with ROC intersection; L4 time shift.

**Misconceptions/constraints.** Distractors omit ROC, use Fourier-only convergence, or assign right-sided ROC left of pole. Rates rational; at most two terms.

**Feedback.** Show convergence inequality before algebraic expression.

**Examples.**

1. `e^{−2t}u(t)` → `1/(s+2)`, ROC Re(s)>−2. L1.
2. `−e^{−2t}u(−t)` → `1/(s+2)`, ROC Re(s)<−2. L2.
3. `e^{−t}u(t)+e^{−3t}u(t)` → sum of fractions, ROC Re(s)>−1. L3.

**Validation/coverage.** Symbolic integral templates and ROC inequality intersection.

### Family `z_transform_pair`

**Task.** Match/derive a DT Z-transform pair and ROC.

**Response/template.** Rational expression plus ROC: `Find X(z) and ROC for {sequence}.`

**Derivation.** Sum geometric series in `z^{-1}` with right-/left-sided support; finite sequences yield all z except possible0/∞ qualifications in displayed profile.

**Difficulty.** L1 impulse/delay; L2 right-sided exponential; L3 left-sided/two-term ROC; L4 finite shifted sequence.

**Misconceptions/constraints.** Distractors reverse z power, omit support/ROC, or assume all causal signals have `|z|>1` rather than outside outermost pole.

**Feedback.** Write series and convergence ratio.

**Examples.**

1. `δ[n−2]` → `z^{-2}`, ROC `0<|z|<∞` under finite-delay profile. L1.
2. `(1/2)^n u[n]` → `1/(1−0.5z^{-1})`, ROC `|z|>0.5`. L2.
3. `−2^n u[−n−1]` → same rational form with pole2, ROC `|z|<2`. L3.

**Validation/coverage.** Finite truncation convergence diagnostics plus exact pair library.

### Family `roc_signal_sidedness`

**Task.** Infer possible time sidedness/causality from pole locations and ROC, or choose the valid ROC for a supplied signal.

**Response/template.** Right/left/two-sided and ROC choice: `Given {rational_expression,poles,ROC}, classify support.`

**Derivation.** ROC outside outermost pole→right-sided; inside innermost→left-sided; annulus/vertical strip between poles→two-sided; ROC excludes poles.

**Difficulty.** L1 one pole; L2 two poles; L3 empty intersection; L4 distinguish signal causality from system transfer interpretation.

**Misconceptions/constraints.** CT uses vertical half-planes/strips; DT annuli. Avoid pole-zero cancellation ambiguity by simplifying first.

**Feedback.** Shade ROC and connect expansion direction to support.

**Examples.**

1. Z poles0.5,2 and ROC `|z|>2` → right-sided. L2.
2. same ROC `0.5<|z|<2` → two-sided. L2.
3. Laplace poles−3,−1 and ROC Re(s)<−3 → left-sided. L2.

**Validation/coverage.** Pole-order/ROC geometry predicates and pair reconstruction.

### Family `pole_zero_read`

**Task.** Convert between factored rational transfer function and pole-zero plot, including multiplicity and gain.

**Response/template.** Complex point set/gain or matching plot: `Identify poles, zeros, and gain of {H}.`

**Derivation.** Factor numerator/denominator, cancel only when the profile asks for minimal form, record roots/multiplicity, derive gain by coefficient comparison.

**Difficulty.** L1 real first order; L2 two real roots; L3 conjugate pair; L4 cancellation distinction.

**Misconceptions/constraints.** Degree≤2 after cancellation; complex roots supplied/factorable. Distractors swap poles/zeros or treat origin powers incorrectly.

**Feedback.** Set numerator/denominator factors to zero separately.

**Examples.**

1. `(s+1)/(s+3)` → zero−1,pole−3,gain1. L1.
2. `2(z−0.5)/[z(z+0.2)]` → zero0.5,poles0 and−0.2,gain2. L2.
3. `(s²+4)/(s+1)` → zeros±j2,pole−1. L3.

**Validation/coverage.** Polynomial reconstruction from root multisets and exact coefficient normalization.

### Family `pole_stability_causality`

**Task.** Decide causal BIBO stability or choose an ROC satisfying stated properties.

**Response/template.** Property/ROC choice: `For minimal rational {H,poles,ROC_or_causality}, decide stability and causality.`

**Derivation.** Stable iff ROC includes jω axis (CT) or unit circle (DT); causal rational system has ROC outside outermost pole; combine for pole-location rule.

**Difficulty.** L1 causal one pole; L2 several poles; L3 noncausal stable ROC; L4 unstable pole-zero cancellation warning.

**Misconceptions/constraints.** Systems minimal/cancellation-free unless cancellation is explicit. Distractors use zeros for stability or equate causal with stable.

**Feedback.** Shade ROC, mark stability contour, and apply both tests separately.

**Examples.**

1. causal CT pole−2 → stable. L1.
2. causal DT pole1.2 → unstable. L1.
3. DT poles0.5 and2, ROC `0.5<|z|<2` includes unit circle → stable but two-sided/noncausal. L3.

**Validation/coverage.** Geometric ROC predicates and impulse absolute-sum/integral cross-check.

### Family `transfer_response_components`

**Task.** Use poles/zeros or partial fractions to identify natural modes and a bounded zero-state response.

**Response/template.** Mode/coefficient selection or short formula: `For {H} and {X}, identify poles/modes and {response}.`

**Derivation.** Form `Y=HX`, factor, perform template partial fractions, inverse using pair library; distinguish system poles from input poles and cancellations.

**Difficulty.** L1 gain at exponential; L2 one system pole/step input; L3 two simple poles; L4 cancellation and repeated pole template.

**Misconceptions/constraints.** At most two effective poles; ROC/causality stated. Distractors treat every Y pole as system natural mode or ignore cancellation.

**Feedback.** Factor H, X, then Y in separate colors and map each surviving pole to a time mode.

**Examples.**

1. H=`1/(s+2)`, X=`1/s` → Y=`1/[s(s+2)]`, step response `(1/2)(1−e^{−2t})u(t)`. L2.
2. H has pole−3 → natural CT mode `e^{−3t}`. L1.
3. H=`(s+1)/(s+2)`, input transform has pole−1; cancellation in Y may remove that input mode under zero-state algebra. L3.

**Validation/coverage.** Rational multiplication/partial-fraction reconstruction and direct ODE/convolution comparison.

### Family `initial_final_value`

**Task.** Apply or reject initial/final value theorem for a supplied transform after checking conditions.

**Response/template.** Value or “the theorem is not applicable”: `Can the {initial/final} value theorem be used for {X}? If so, find the value.`

**Derivation.** CT initial `x(0+)=lim_{s→∞}sX(s)` under stated conditions; final `lim x=lim_{s→0}sX(s)` only when poles of `sX` satisfy stability conditions. DT analogous forms are declared in prompt.

**Difficulty.** L1 valid first-order; L2 improper/jump condition; L3 final theorem fails due imaginary/right-half/unit-circle poles; L4 distinguish theorem failure from final value nonexistence.

**Misconceptions/constraints.** Every problem asks applicability first. Distractors mechanically take limits despite invalid pole conditions.

**Feedback.** Check pole/regularity conditions before computing the limit.

**Examples.**

1. X=`1/(s+2)` → initial value1, final0. L1.
2. X=`1/[s(s+2)]` → final `lim sX=1/2`; conditions hold. L2.
3. X=`1/(s²+1)` → `sX` has poles±j; final-value theorem not applicable and sin-like signal has no final limit. L3.

**Validation/coverage.** Pair-library direct limits versus theorem result; include valid and invalid conditions equally at advanced levels.

### Cross-family progression

Right-sided one-pole pairs precede left-/two-sided ROCs. Pair expressions precede pole-zero plots. Causality and stability use ROC geometry before transfer response. Initial/final value questions always require a condition check and are never taught as automatic substitutions.

## 11. Topic-level progression

### Recommended introduction order

1. CT/DT domains, graph reading, sinusoid parameters, and frequency units.
2. Elementary signals, amplitude changes, shifts, scales, reversal, and sequence indexing.
3. Single-signal periodicity, sums, symmetry, pointwise operations, and energy/RMS.
4. Direct system execution, then linearity, time invariance, causality, memory, and stability.
5. Impulse/step response and finite DT convolution.
6. CT convolution and LTI properties from impulse response.
7. Difference-equation traces and zero-input/zero-state decomposition.
8. Frequency response and sinusoidal steady state.
9. Fourier-series lines, transform properties, and spectral interpretation.
10. Sampling, aliasing, DFT bins, and circular convolution.
11. State-space modes, Laplace/Z ROCs, poles, causality, and stability.

### Dependency map

```text
signal domain + graph
        |
        +--> sinusoid parameters --> periodicity --> frequency response
        |                                  |                |
        |                                  +--> Fourier ----+--> sampling/DFT
        |
        +--> time/amplitude transforms --> property shift tests
        |
elementary signals --> energy/inner product --> correlation
        |
        +--> system execution --> linearity/time invariance
                                 |              |
                                 +--> LTI ------+--> convolution
                                                  |
difference/differential equations ----------------+--> transfer function
        |                                                  |
        +--> state space --> modes ------------------------+--> poles/ROC
```

### Difficulty bands

| Band | Reasoning character | Typical representation |
|---|---|---|
| L1 Direct reading | one definition or landmark | labeled formula/graph/sample |
| L2 One transformation | exact forward operation | one shifted/scaled signal or short trace |
| L3 Representation transfer | same object in two forms | graph↔formula, h↔step, time↔frequency |
| L4 Composition/inversion | two or three mastered rules, order or uniqueness matters | composite transform, convolution, recurrence, ROC |
| L5 Diagnosis/synthesis | choose a witness/model and explain a boundary | property counterexample, alias ambiguity, pole behavior |

An L4 problem must not be manufactured by giving an L1 problem ugly arithmetic. Advanced notation may appear only after its semantic prerequisites.

### Interleaving rules

- Interleave CT and DT analogs only after each rule has been taught separately; surface the places where their behavior genuinely differs.
- Pair hertz and radians/second conversions until `2π` mistakes disappear, then reduce conversion frequency.
- Pair graph and formula transformations, but do not combine negative scaling with a new signal type on first exposure.
- Interleave linearity and time invariance to break their common conflation.
- Pair causality and memory with contrasting examples: causal-with-memory and memoryless-causal.
- Pair convolution computation with impulse-response interpretation.
- Pair time-domain and frequency-domain solutions only after each can be solved independently.
- Sampling ambiguity questions must follow direct alias calculation; they must not be the learner's first exposure to sampling.
- ROC and pole families remain locked until right-/left-sided exponentials and causal stability are reliable.

### Cross-topic links

The app may offer optional, nonblocking links:

- a period/frequency error → Physics wave fundamentals;
- a complex-magnitude or phasor error → Electric Circuits AC foundations;
- an integral/derivative error inside energy or ODE verification → Calculus;
- a matrix/eigenmode error → Linear Algebra.

The signal/system question itself remains graded field by field so a prerequisite arithmetic mistake does not erase evidence that the learner chose the right model.

## 12. Adaptive practice guidance

### Mastery dimensions

Track separately:

- category, subcategory, family;
- CT versus DT;
- signal/system representation: formula, graph, stems, table, block, spectrum, pole plot, state;
- forward versus inverse construction;
- exact versus approximate arithmetic;
- transformation depth;
- state/trace length;
- support type: finite, right-sided, two-sided, periodic;
- real versus complex;
- misconception ID;
- scaffolding level and response latency.

Do not use one broad “Signals” score to unlock Laplace or state-space content.

### Misconception routing

| Error signature | Likely mental model | Follow-up |
|---|---|---|
| amplitude reported as peak-to-peak | distance from min to max treated as amplitude | midline/max/min reconstruction |
| `T=1/ω` | hertz and angular frequency conflated | paired `f,ω,T` with units |
| phase given in seconds | phase and delay conflated | same sinusoid at two frequencies with one delay |
| `x(t−2)` shifted left | inside sign read literally | one-anchor shift questions |
| `x(2t)` expanded | time scale applied forward instead of inverse | map two original landmarks by solving `2t=s` |
| transform order error in `x(at+b)` | shift/scale slogans memorized | landmark equation table |
| noninteger DT period accepted | CT period rule copied to DT | rational `Ω/(2π)` contrasts |
| any negative-valued signal called odd | sign confused with parity | mirrored value pairs |
| energy computed without magnitude-square | “area under signal” substituted | compare signed area and energy |
| RMS equals average magnitude/peak | mean-square step omitted | square→average→root card |
| pointwise product used for convolution | operations not distinguished | same pair: product versus convolution support |
| convolution not flipped | correlation-like sliding used | graphical reflect–shift–overlap |
| linear because formula “looks linear” | zero-input/superposition not tested | affine offset witness |
| time-varying because delay appears | delay confused with explicit time coefficient | fixed delay versus `n x[n]` pair |
| causal means memoryless | property definitions merged | causal accumulator/delay versus pointwise nonlinearity |
| one bounded trial proves stable | quantifier “every bounded input” missed | choose decisive bounded witness |
| h and step response equated | impulse/step roles merged | cumulative/difference pair |
| transient phase/gain called H response | steady state not separated | zero-input versus sinusoidal forced response |
| Fourier cosine amplitude placed wholly at +ω | two-sided complex spectrum missed | conjugate coefficient pairing |
| time shift moves spectral magnitude | phase factor misunderstood | matched magnitude/phase display |
| fs>B deemed sufficient | spectral copies only one-sided mentally | explicit ±B copies and `fs>2B` |
| one sample sequence assumed unique CT signal | interpolation assumption hidden | alias-consistent candidate set |
| DFT bin k treated as hertz | index and physical frequency conflated | bin ruler with `Δf=fs/N` |
| causal automatically stable | ROC/poles collapsed | causal unstable and stable noncausal contrasts |
| rational transform accepted without ROC | transform seen only as algebra | same fraction, right-/left-sided pair |
| zeros used to assess stability | pole/zero roles swapped | matched pole plots with moved zero |

### Adaptive actions

- After a wrong composite answer, identify the first incorrect primitive transform and issue a one-step diagnostic.
- After a representation-only error, keep semantic difficulty and change formula↔graph↔table while preserving parameters.
- Slow but correct convolution gets shorter support with the same overlap structure, not a conceptual demotion.
- Correct property label with invalid reasoning gets a witness-selection item before mastery credit.
- Repeated numerical integration mistakes route to exact finite sums/pulse areas while retaining the energy/convolution concept.
- DT-only errors trigger CT/DT contrasts rather than generic easier questions.
- Phase errors near wrap boundaries reduce wrapping complexity but keep magnitude/frequency fixed.
- Correct DFT computation with wrong bin interpretation triggers bin mapping, not another transform sum.
- Pole stability errors trigger impulse-response convergence and pole geometry as paired representations.

### Mastery criteria

A family is provisionally mastered after:

- at least three structurally distinct correct instances;
- success across the applicable domain/representation variants;
- one inverse or construction case when supported;
- no primary misconception recurrence in two spaced reviews;
- success without optional visual scaffolding;
- successful reuse in one composed family.

Exact speed targets differ by family. A property witness should become quick; a multi-piece convolution may remain deliberate.

## 13. Feedback and worked solutions

### Layered feedback

1. **Verdict:** grade each named field.
2. **Decisive definition:** one sentence.
3. **Landmark/state table:** expose the first wrong transform or update.
4. **Worked solution:** show all essential steps.
5. **Contrast:** show the learner's recognized misconception result alongside the correct one.

### Family-specific feedback patterns

- **Sinusoids:** normalize amplitude/phase and mark one period.
- **Time transforms:** table original landmark `s`, equation `at+b=s`, new location.
- **Periodicity:** state a candidate shift and verify it, then minimality.
- **Energy/RMS:** show square, support/period, sum/integral, normalization, root.
- **Properties:** display the defining equality/quantifier and witness.
- **Convolution:** reflect, shift, overlap, multiply, accumulate.
- **Recurrences:** one row per n; do not skip hidden state updates.
- **Frequency response:** rectangular complex value, magnitude, phase, output component.
- **Fourier:** pair positive/negative lines and preserve transform convention factors.
- **Sampling:** draw replicated spectra or show modulo/reflection arithmetic.
- **ROC/poles:** shade ROC, mark poles, then test causality/stability contour.

### Example misconception feedback

For `x(2t)` answered as an expansion:

> An original landmark at `t=4` appears where `2t=4`, so it moves to `t=2`. Inside time scaling works through the inverse mapping; the signal is compressed by two.

For `y[n]=x[n]+1` answered linear:

> A linear system must send the zero input to zero. Here `T{0}=1`, so the constant offset is a decisive counterexample.

For alias 7 Hz at 10 Hz answered 7 Hz:

> Sampled frequencies are equivalent modulo 10 Hz. `7−10=−3 Hz`; a real cosine at −3 Hz has the same samples as one at +3 Hz, so the baseband alias is 3 Hz.

For causal pole 1.2 in DT answered stable:

> Causality places the ROC outside the outermost pole: `|z|>1.2`. That ROC excludes the unit circle, so the impulse response is not absolutely summable and the system is not BIBO stable.

## 14. Rendering, interaction, audio, and accessibility

### Required renderers

- CT curve/piecewise plot;
- DT stem plot;
- impulse-arrow plot with weight labels;
- paired before/after transformation plot;
- reflect–shift–overlap convolution view;
- finite sequence/index editor;
- block diagram and signal-flow graph;
- recurrence/state table;
- complex plane and phasor;
- magnitude/phase response plot;
- Fourier line spectrum;
- sampled-spectrum replica diagram;
- DFT circular bin ruler;
- pole-zero/ROC plot.

All renderers consume semantic objects also used by answer derivation.

### Plot requirements

- Axes label variable, unit, scale, zero, and breakpoints.
- CT and DT visual styles are never interchangeable.
- Symbolic impulses use arrows and numeric area labels.
- Phase plots identify radians/degrees and wrapped/unwrapped status.
- Log-frequency/magnitude axes visibly say `log` and `dB`.
- Pole and zero shapes differ independently of color; multiplicity is textual.
- ROC shading has hatch/pattern and a textual inequality.
- Spectrum lines label coefficient/area; drawn arrow height alone is not quantitative.
- Every graph has a table/text equivalent and logical keyboard focus order.

### Interactive transformations

Optional sliders may demonstrate amplitude, shift, scale, and phase, but generated graded values remain exact. Sliders:

- expose a numeric field;
- support keyboard increments;
- do not make pixel alignment the checker;
- provide reset and reduced-motion behavior.

### Audio

Locally synthesized audio can strengthen amplitude/frequency/filter intuition:

- use Web Audio oscillator/buffer nodes after an explicit learner gesture;
- clamp safe volume and fade starts/stops to avoid clicks;
- normalize playback level only when the exercise is not about amplitude;
- never claim equal perceived loudness from equal RMS;
- provide a visual and textual equivalent;
- make every audio-backed question solvable without hearing;
- do not request microphone permission or transmit audio.

### Mathematical input

Prefer structured inputs:

- amplitude/frequency/phase fields;
- interval/support editor;
- indexed sequence grid;
- complex rectangular/polar fields;
- coefficient table;
- pole/zero cards;
- property choices with witness selection.

Free-form formulas use only the controlled grammar. Unsupported equivalent forms must produce a checker-limit option rather than penalize conceptual knowledge.

## 15. Implementation architecture

### Offline contract

The app is a single standalone HTML/JavaScript/CSS page. Runtime:

- makes no network request;
- loads no remote plotting, CAS, audio, or font library;
- uses no backend, compiler, microphone, uploaded file, or OS signal source;
- generates and checks all content locally;
- stores only local practice progress if the learner enables it.

### Exact scalar layer

Use:

```text
Rational { numerator: BigInt, denominator: positive BigInt }
Quadratic { a:Rational, b:Rational, d:squareFreeInt }
ComplexExact { re:ExactReal, im:ExactReal }
PiMultiple { coefficient:Rational }
```

Use `Number` only for rendering and declared approximations. Exact-friendly roots of unity for N=2,4,8 use normalized exact complex values.

### Semantic layers

Implement separately:

1. **Signal AST and support engine**
   - evaluation, reflection, affine time transform, parity, support, breakpoints;
   - exact finite-sequence indices;
   - impulse terms distinct from ordinary functions.
2. **Piecewise algebra**
   - interval partition;
   - degree≤2 polynomial/exponential templates;
   - exact integration and differentiation within supported forms.
3. **System/operator AST**
   - pointwise, shift, finite difference/sum, convolution, state model, block composition;
   - dependency analysis for causality/memory;
   - symbolic rules for linearity/TI templates.
4. **Discrete-event/state simulator**
   - recurrences;
   - finite convolution/correlation;
   - DT state-space;
   - sampled sequences.
5. **Complex/frequency layer**
   - canonical phase;
   - sparse spectral lines;
   - frequency response;
   - exact DFT roots.
6. **Rational transform layer**
   - polynomial degree≤2;
   - factored roots/multiplicity;
   - ROC inequalities;
   - reviewed transform-pair library.

### No general CAS promise

The implementation must not use generic numerical sampling as proof of:

- signal equality with discontinuities;
- periodicity;
- linearity/time invariance;
- transform equivalence;
- pole-zero cancellation;
- energy convergence;
- system stability.

Use family-specific symbolic templates and exact invariants. Numerical sampling/plotting is only a secondary diagnostic.

### Question-source rule

Prompt, answer, distractors, plot, audio, and worked solution derive from one immutable instance. For example:

- transformation plots derive from transformed breakpoints, not separately sampled expressions;
- recurrence tables derive from the same state update that computes the answer;
- spectrum and synthesized signal share coefficient objects;
- pole plot and rational expression share factored polynomial data;
- audio buffer and displayed waveform share signal parameters.

### Distractor transforms

Store named wrong operations:

- `amplitude_as_peak_to_peak`;
- `omega_as_hertz`;
- `shift_inside_sign`;
- `time_scale_forward`;
- `transform_order_swap`;
- `dt_period_noninteger`;
- `odd_means_negative`;
- `energy_without_square`;
- `rms_without_square`;
- `pointwise_as_convolution`;
- `convolution_without_reflection`;
- `affine_as_linear`;
- `delay_as_time_variation`;
- `causal_as_memoryless`;
- `one_bounded_example`;
- `step_equals_impulse`;
- `phase_multiplied`;
- `fourier_one_sided_amplitude`;
- `time_shift_spectral_shift`;
- `nyquist_one_sided`;
- `alias_single_subtraction`;
- `dft_bin_is_hz`;
- `forward_dft_has_inverse_scale`;
- `circular_as_truncated_linear`;
- `transform_without_roc`;
- `zeros_determine_stability`;
- `causal_implies_stable`;
- `value_theorem_without_conditions`.

If a wrong transform equals the correct answer for a generated instance, reject it as a distractor and regenerate/choose another misconception.

### Random generation

- Use a seeded PRNG and persist seed/model/family/dimensions.
- Construct backward from pedagogically useful periods, overlaps, poles, or alias results.
- Prefer small rational parameters and π fractions.
- Balance positive/negative shift, compression/expansion, stable/unstable, causal/noncausal, and CT/DT.
- Fingerprint semantic structure, not wording/layout.
- Do not overproduce impulses, powers of two, zero phase, or origin-aligned support.

### Localization

Localization resources must distinguish:

- frequency versus angular frequency;
- shift/delay/advance;
- continuous versus discrete time;
- impulse “weight/area” versus height;
- energy versus power;
- system “memory” versus computer storage;
- phase delay versus phase angle;
- causal signal versus causal system;
- pole/zero and ROC.

Templates are whole localized sentences. Math tokens and indices are protected from grammatical rearrangement. Decimal separator and SI formatting follow locale without changing exact values.

## 16. Automated validation

### Per-instance requirements

- every placeholder is substituted;
- semantic domain and notation agree;
- answer exists and is unique under stated convention, or accepted set is explicit;
- units/dimensions are consistent;
- exact/canonical and displayed approximate answers agree;
- every distractor is distinct and generated by an applicable misconception;
- plots/tables/audio derive from the same signal;
- CT impulses never receive a finite point value;
- phase is not graded when magnitude/amplitude is zero;
- piecewise endpoints and support inclusion agree;
- all requested recurrence/state inputs exist;
- transform expressions include ROC when signal identity needs it;
- numeric tolerance cannot merge distinct conceptual answers.

### Property and differential tests

Run:

- signal-transform composition/inverse landmark checks;
- parity decomposition and reconstruction;
- CT/DT periodicity candidate/minimality checks;
- energy scaling laws: CT `E{x(at)}=E{x}/|a|`, DT only for supported integer mappings with explicitly derived behavior;
- RMS/power comparison by exact one-period accumulation;
- system property symbolic rule versus generated witnesses;
- convolution commutativity/associativity/distributivity on finite sequences;
- convolution support and total-area/sum invariants;
- impulse/step cumulative-difference round trip;
- recurrence/state equation residual at every sample;
- ODE candidate substitution;
- zero-input + zero-state = total response;
- state-space Markov parameters versus direct simulation;
- frequency response from transfer function versus impulse transform;
- Fourier analysis/synthesis round trip for sparse coefficients;
- Parseval time/frequency agreement;
- sampling aliases by exact sample equality;
- DFT/IDFT round trip and circular-convolution theorem;
- rational-expression reconstruction from poles/zeros;
- ROC/pair consistency;
- stability from poles/ROC versus absolute h convergence;
- initial/final value results versus direct pair-library limits.

### Fuzz targets

Before release:

- 100,000 sinusoid/frequency/phase and affine-transform instances;
- 50,000 periodicity/symmetry/energy cases;
- 50,000 system-property/witness cases;
- 100,000 finite convolution/correlation/recurrence cases;
- 25,000 CT piecewise convolution cases;
- 50,000 frequency-response/Fourier-line cases;
- 50,000 sampling/alias/DFT cases;
- 50,000 pole/ROC/transform cases;
- exhaustive supported exact DFT sequences over a small coefficient alphabet for N=2 and4;
- every curated endpoint, zero-magnitude, cancellation, ROC-boundary, and theorem-inapplicable case.

### Visual regression

For every plot type:

- semantic landmark coordinates match labels;
- open/closed endpoints and impulses render correctly;
- CT and DT styles remain distinct;
- responsive view retains axes and labels;
- text alternative is sufficient to solve;
- phase/ROC wrapping/shading matches metadata;
- localization does not overlap math at supported viewport/font scales.

Audio tests verify duration, sample bounds, fades, local-only construction, and silence/disable behavior when audio is ineligible.

## 17. Coverage requirements

Default mixed practice after prerequisites:

| Area | Target |
|---|---:|
| Quantities and representations | 11% |
| Transformations and periodicity | 14% |
| Energy and similarity | 9% |
| System properties | 13% |
| LTI and convolution | 16% |
| Dynamic equations/state | 11% |
| Frequency/Fourier | 13% |
| Sampling/DFT | 8% |
| Laplace/Z/poles | 5% |

Within eligible practice:

- CT/DT approaches 55/45 rather than treating DT as an appendix;
- formulas, graphs, tables/stems, and diagrams all recur;
- at least one third of transform questions use inverse construction/identification;
- system properties include all meaningful true/false combinations;
- convolution alternates shifted-copy, sum/table, and overlap views;
- at least one quarter of frequency questions require phase, not only magnitude;
- alias questions include both no-alias and multi-wrap cases;
- transform-domain practice never dominates learners who primarily chose foundational levels;
- zero, unit impulse, origin-aligned, and zero-phase cases remain useful but collectively below 25% per applicable family.

## 18. Stable navigation and delivery priorities

### Navigation

1. Signals & Sinusoids
2. Transformations & Periodicity
3. Energy & Similarity
4. System Properties
5. LTI & Convolution
6. Dynamic Equations & State
7. Frequency & Fourier
8. Sampling & DFT
9. Laplace, Z & Poles

### Recommended v1 slice

First release:

- all Categories 2–6;
- difference-equation next/trace and equation-to-transfer;
- frequency-response evaluation, sinusoidal output, filter classification;
- Fourier-series sparse coefficients/synthesis/spectrum reading;
- sample substitution, Nyquist, aliasing, DFT bins/simple DFT;
- one-pole causal Laplace/Z pairs and pole stability.

Second increment:

- CT full piecewise convolution;
- state-space input/output and modal composition;
- Bode multi-corner traces;
- transform-property composition, Parseval, and mixing;
- DFT leakage/circular convolution;
- left-/two-sided ROC, transfer-response partial fractions, and value theorems.

### Unsuitable dynamic families

Do not implement:

- static acronym definitions without an instance;
- long lookup tables of transform pairs;
- freehand graph grading;
- arbitrary Fourier/partial-fraction integrals;
- “design a filter” prose;
- subjective audio-quality judgments;
- real biomedical/audio/equipment diagnosis;
- proofs of generalized-function identities;
- unsupported high-order system arithmetic.

Use Learn/reference cards or another app for these.

## 19. Reference profile

Implementation references should pin edition/section metadata. Suitable primary pedagogical references include:

- Oppenheim, Willsky, and Nawab, *Signals and Systems*;
- Oppenheim and Schafer, *Discrete-Time Signal Processing*;
- Lathi, *Linear Systems and Signals*;
- Bracewell, *The Fourier Transform and Its Applications*;
- reviewed course notes whose transform conventions match this document.

References inform build-time fixtures. The shipped app contains its own versioned conventions and does not download reference material. If a reference uses another Fourier, phase, step-boundary, correlation-lag, DFT, or ROC convention, convert it explicitly before fixture use.

## 20. Topic-level quality checklist

- [ ] Every family trains a repeatable signal/system operation rather than terminology alone.
- [ ] Every family has at least three instantiated examples.
- [ ] CT and DT notation/domain are never conflated.
- [ ] Hertz, radians/second, and radians/sample remain dimensionally distinct.
- [ ] Phase and delay use the declared sign/wrapping convention.
- [ ] Step, impulse, rect, sinc, correlation, Fourier, DFT, Laplace, and Z conventions are explicit.
- [ ] CT impulse questions use area/action, never a finite height/value at zero.
- [ ] Exact graph answers derive from semantic landmarks, not pixels.
- [ ] Time transformation uses inverse landmark mapping.
- [ ] DT periodicity requires an integer period.
- [ ] Period-sum answers are checked for cancellation/minimality.
- [ ] Energy uses magnitude squared and power uses the declared average.
- [ ] The zero signal is handled explicitly.
- [ ] System linearity, time invariance, causality, memory, invertibility, and stability are separate properties.
- [ ] Every negative property classification has a valid witness.
- [ ] LTI convolution excludes initial-condition response unless named.
- [ ] Convolution and pointwise multiplication/correlation remain distinct.
- [ ] CT piecewise convolution is independently integrated and checked.
- [ ] Recurrence/state traces satisfy their equations at every step.
- [ ] Transfer functions state zero initial conditions.
- [ ] State-space timing says whether output uses current or updated state.
- [ ] Frequency-response phase is not graded at a zero.
- [ ] Fourier analysis/synthesis uses one pinned normalization.
- [ ] Spectrum impulse arrows show weight/area semantics.
- [ ] Sampling questions distinguish sample consistency from unique reconstruction assumptions.
- [ ] Nyquist boundary cases are stated or rejected.
- [ ] DFT bins are indices, with physical frequency derived from N and fs.
- [ ] Circular convolution is not silently substituted for linear convolution.
- [ ] Rational transforms include ROC when needed.
- [ ] Pole-zero cancellations are simplified or explicitly pedagogical.
- [ ] Causality and stability are tested separately in ROC questions.
- [ ] Initial/final value theorems require applicability checks first.
- [ ] Distractors come from named misconceptions and remain semantically distinct.
- [ ] Difficulty rises through representation/state/model composition, not tedium.
- [ ] The app uses a bounded exact signal/system engine, not a general CAS.
- [ ] Plots, tables, audio, answers, and feedback share the same semantic source.
- [ ] All required functionality is local in one standalone HTML/JavaScript/CSS page.
- [ ] Automated fuzz/property/visual tests cover declared boundaries.
- [ ] Repeated practice improves actual signal reasoning.
