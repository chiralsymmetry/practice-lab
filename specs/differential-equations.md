# Differential Equations — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, symbolic/numeric checker, direction-field and phase-portrait renderer, bounded ODE solver, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Differential Equations

### Topic goal

Develop fluent recognition, solution, verification, and qualitative interpretation of ordinary differential equations.

The learner should become able to:

- identify order, linearity, autonomy, homogeneity, and initial/boundary data from notation;
- select an appropriate first-order method instead of applying separation to everything;
- preserve equilibrium and singular solutions and state valid solution intervals;
- verify explicit, implicit, and parameterized solutions by substitution;
- interpret slope fields, phase lines, nullclines, equilibria, and stability;
- translate a modeled rate statement into an equation with units and assumptions;
- solve controlled higher-order linear equations and explain transient/forced behavior;
- use unilateral Laplace transforms for bounded initial-value problems;
- convert between scalar higher-order equations and first-order systems;
- execute and assess short numerical-method traces;
- recognize when an equation is outside the app's solvable grammar rather than forcing an invalid technique.

Repeated practice should improve method selection and solution sense, not merely pattern-match formulas.

### Relationship to neighboring Practice Lab topics

- **Calculus** retains general derivative/integral fluency and a compact introduction to solution verification, slope fields, Euler's method, separable equations, and exponential growth/decay.
- **Signals and Systems** owns input/output operators, impulse response, convolution, transfer/frequency response, and transform-domain signal behavior.
- **Linear Algebra** owns general systems, eigenvalues, eigenvectors, diagonalization, and matrix methods.
- **Physics, Chemistry, and Electric Circuits** own their domain models and physical assumptions.

This app is independent and supplies local reviews. It owns differential-equation classification, method selection, equation solving, qualitative behavior, IVP/BVP reasoning, and numerical approximation. Shared generators may reuse exact algebra or plotting code, but progress transfers only between demonstrably equivalent family IDs.

### Audience and prerequisites

Early categories assume:

- algebraic manipulation and equation solving;
- function notation and graphs;
- derivatives of polynomials, exponentials, logarithms, and basic trigonometric functions;
- elementary antiderivatives and definite integrals;
- basic vectors/matrices before the systems category.

Later categories may locally review:

- integration by parts and partial fractions;
- complex roots and Euler form;
- power series and coefficient matching;
- eigenpairs for `2×2` matrices.

The app diagnoses prerequisite errors field by field and may suggest the sister topic, but does not require the learner to complete another app first.

### Scope

The model ID is `differential-equations-v1`. It includes:

- ordinary differential equations in one independent variable;
- derivative notation, dependent/independent variables, order, degree when defined, explicit/implicit form, linearity, autonomy, and initial/boundary conditions;
- solution verification and maximal/restricted intervals;
- first-order slope fields, isoclines, autonomous phase lines, equilibria, stability, and local existence/uniqueness conclusions;
- separable equations, equilibrium solutions, implicit solutions, and IVPs;
- first-order linear equations and integrating factors;
- exact equations and potential functions;
- Bernoulli equations and scale-homogeneous substitution `y=vx` in bounded forms;
- exponential/logistic growth, Newton cooling, mixing tanks, simple drag, and other explicitly stated modeling templates;
- second-order and selected higher-order linear constant-coefficient homogeneous equations;
- characteristic roots, fundamental solution sets, Wronskians, initial conditions, and reduction of order in reviewed templates;
- nonhomogeneous linear equations, superposition, undetermined coefficients, resonance, and bounded variation of parameters;
- unilateral Laplace transforms for piecewise/step inputs and initial-value problems;
- first-order linear systems, scalar-to-system conversion, matrix/eigenmode solutions, phase portraits, equilibria, and planar nonlinear nullclines at a qualitative level;
- Euler, improved Euler/Heun, midpoint, and one-step classical RK4 on exact-friendly instances;
- local/global error concepts, convergence order, and bounded absolute-stability reasoning with the test equation;
- simple two-point linear boundary-value problems;
- power-series coefficient recurrences at ordinary points and selected regular singular points at a recognition level.

The intended ceiling is a strong first undergraduate ODE course with optional applied/numerical extensions.

### Exclusions

Do not include:

- partial differential equations, characteristics, Fourier PDE methods, separation of variables for PDEs, or boundary-integral methods;
- differential-algebraic equations, delay/stochastic differential equations, integro-differential equations, or fractional derivatives;
- rigorous existence proofs, Banach fixed-point proofs, measure theory, distributions, or weak solutions;
- arbitrary nonlinear closed-form solving, Abel/Riccati theory beyond a supplied special substitution, or elliptic/special-function solutions;
- general symbolic integration or a general computer algebra system;
- high-order characteristic polynomials whose roots are not supplied/factorable;
- Jordan-form systems, matrix exponentials beyond `2×2` reviewed templates, or complex defective systems;
- nonlinear bifurcation theory beyond one-parameter equilibrium/stability recognition;
- chaos, Lyapunov functions, invariant manifolds, limit-cycle proofs, Poincaré maps, or Hamiltonian mechanics;
- stiff/adaptive solver implementation, multistep methods beyond optional recognition, finite-element methods, or production numerical analysis;
- arbitrary shooting/finite-difference BVP solvers;
- medical, epidemiological, ecological, financial, or engineering predictions using real current data;
- safety-critical physical design or claims that an idealized model validates a real system.

### Normative notation

#### Variables and derivatives

- The independent variable is normally `x` for abstract equations and `t` for time models.
- The dependent variable is normally `y`; systems use bold/vector `u` or component names `u₁,u₂`.
- Prime notation means differentiation with respect to the displayed independent variable: `y'`, `y''`.
- Leibniz notation `dy/dx`, operator notation `D y`, and dot notation `ẏ` for time may appear after introduction.
- Partial-derivative notation is not used for an ODE derivative, except `∂f/∂y` in an existence/uniqueness condition.
- An `n`th-order scalar equation requires up to `n` independent initial conditions for a locally determined IVP under regular assumptions.

#### Classification

- **Order** is the highest derivative order appearing after the equation is interpreted as written.
- **Degree** is defined only when the equation is polynomial in all derivatives after removing negative powers/fractional powers of derivatives without introducing non-equivalent branches. If not polynomial in derivatives, degree is “not defined.”
- A scalar linear ODE has form

  `a_n(x)y^(n)+...+a_1(x)y'+a_0(x)y=g(x)`,

  where coefficients depend only on the independent variable and the equation is first degree in `y` and its derivatives.
- A linear equation is **homogeneous** when `g(x)=0`; otherwise it is nonhomogeneous.
- An equation is **autonomous** when the independent variable does not appear explicitly after simplification.
- `y'=F(y/x)` is called **scale-homogeneous first-order** in this spec, avoiding confusion with homogeneous linear equations.
- An equation solved for its highest derivative is in explicit normal form.
- An IVP specifies data at one independent-variable value. A BVP specifies conditions at two or more distinct points.

#### Solutions and intervals

- A solution is a function on an interval for which all required derivatives exist and the equation holds at every point in that interval.
- Initial/boundary conditions are part of the problem and must be verified separately.
- An explicit solution has `y=φ(x)`. An implicit relation `F(x,y)=C` is accepted when it defines a differentiable branch on the declared interval and satisfies the equation there.
- A general solution may be a family with arbitrary constants. A particular solution fixes those constants.
- A singular solution not obtained from the general family must be recorded when generated.
- Division by an expression involving `y`, `y'`, or a factor of the equation requires a lost-solution audit.
- Algebraic transformations that square an equation or multiply by a potentially zero/undefined factor require an extraneous-solution audit.
- Maximal interval answers exclude points where the equation's coefficients, forcing, solution, or required derivative becomes undefined.
- For `ln|y|`, a solved branch cannot cross `y=0`; an equilibrium `y=0` is handled separately when valid.

#### Equilibria and stability

- For autonomous `y'=f(y)`, an equilibrium `y*` satisfies `f(y*)=0`.
- A one-dimensional equilibrium is asymptotically stable if nearby arrows point toward it from both sides; unstable if away on both sides; semistable if attraction/repulsion differs by side.
- Linearization `f'(y*)` may classify a hyperbolic equilibrium: negative stable, positive unstable. If `f'(y*)=0`, the test is inconclusive and the phase-line sign must be used.
- For planar linear `u'=Au`, classifications use the displayed real eigenvalue profile. Borderline zero/pure-imaginary/repeated-defective cases are labeled separately rather than forced into asymptotically stable/unstable when nuance is required.

### Transform convention

Laplace exercises use the unilateral transform:

`L{f}(s)=∫₀^∞ e^(−st) f(t) dt`.

Derivative rules:

- `L{y'}=sY−y(0+)`;
- `L{y''}=s²Y−s y(0+)−y'(0+)`;
- higher derivatives follow the same initial-data pattern.

The unit step for transform inputs is `u(t−a)=0` for `t<a`, `1` for `t≥a`. Dirac impulse tasks use area/sifting semantics and never a finite value at its location.

### Numerical-method convention

- An IVP is written `y'=f(t,y)`, `y(t₀)=y₀`.
- Fixed step `h>0`, `t_n=t₀+nh`.
- Euler: `y_{n+1}=y_n+h f(t_n,y_n)`.
- Explicit midpoint: `k₁=f(t_n,y_n)`, `k₂=f(t_n+h/2,y_n+h k₁/2)`, `y_{n+1}=y_n+h k₂`.
- Heun/improved Euler: `k₁=f(t_n,y_n)`, predictor `y*=y_n+h k₁`, `k₂=f(t_n+h,y*)`, `y_{n+1}=y_n+h(k₁+k₂)/2`.
- Classical RK4 uses its standard four slopes; every RK4 prompt displays the convention because `k` scaling conventions vary.
- Local truncation error is the one-step defect starting from exact data. Global error is the accumulated solution error at a mesh point.
- Absolute-stability questions use `y'=λy`, `z=hλ`, and a displayed stability function `R(z)` or one derived for Euler.

### Controlled expression grammar

Generated expressions use a bounded AST:

```text
Rational(p,q)
NamedConstant(pi|e)
Variable(x|t|y)
Add(terms...)
Multiply(factors...)
Power(base, integer_or_reviewed_rational)
Function(exp|ln|sin|cos|sqrt|abs, argument)
Derivative(dependent, order)
Piecewise(branches<=3)
Equation(left,right)
Vector(entries<=3)
Matrix(rows<=3,cols<=3)
```

Generator restrictions:

- polynomial degrees normally `0..4`;
- denominator factors linear or reviewed quadratic;
- nested elementary-function depth at most `3`;
- linear ODE order at most `4`, with order `2` dominant;
- nonlinear exact-solution families are first order except bounded autonomous systems;
- parameter values are small integers/rationals and exact-friendly radicals;
- all generated integrals needed for a closed-form solution come from a reviewed antiderivative library;
- piecewise forcing has at most three intervals/jumps.

### Answer and equivalence conventions

- Surrounding whitespace is ignored.
- Exact integers, reduced fractions, `pi`, `e`, and supported radicals are preferred.
- Decimal answers are accepted only when requested or exactly equivalent to a terminating rational; numerical tolerance is explicit.
- Expressions use a bounded parser with declared variables/constants and operators `+,-,*,/,^`, parentheses, and supported functions.
- Explicit solutions are checked by task-specific substitution into the ODE and conditions, then domain/interval validation.
- Implicit solutions are checked by differentiating the relation along a branch (`F_x+F_y y'=0`) and comparing with the ODE where `F_y≠0`.
- General-solution constants use structured constant slots `C`, `C1`, `C2`; renaming/reordering is accepted when semantic verification succeeds.
- Equivalent bases for a linear solution space are accepted by Wronskian/span verification, not string comparison.
- A relation multiplied by a nonzero constant is equivalent. Squaring or applying a non-injective function is not automatically equivalent.
- Multiple branches/intervals use structured controls.
- “No solution,” “not uniquely determined,” “degree not defined,” and “method not applicable” are semantic answer controls.
- Units are accepted/required in modeling questions and checked dimensionally.

### Symbolic checking hierarchy

1. Parse, type-check, and enforce the declared domain/complexity budget.
2. Normalize rational/polynomial/algebraic forms exactly.
3. Use family-specific verification:
   - substitute explicit/implicit solutions and conditions;
   - differentiate antiderivative-based solutions;
   - check exactness/potential gradients;
   - reconstruct characteristic polynomial/solution basis;
   - evaluate recurrence/numerical stages;
   - compare phase-line/nullcline semantics;
   - transform and invert using the pinned Laplace pair library.
4. Use guarded high-precision sampling only as a secondary diagnostic on safe intervals; never as the sole proof for an ODE solution, domain, stability, or uniqueness claim.

If a supported answer cannot be certified, offer “checker limitation” without marking the learner conceptually wrong.

### Graph semantics

- Direction-field segments derive from exact `f(x,y)` at semantic grid points.
- Infinite/undefined slopes use explicit vertical/undefined markers; they are not clipped silently.
- Solution curves are generated from exact solutions when available or a validated high-accuracy build-time/runtime bounded integrator for qualitative display.
- Phase lines show equilibrium points and direction arrows with accessible text.
- Planar phase portraits show axes, equilibria, nullclines, vector arrows, and selected trajectories; arrows indicate increasing independent variable.
- Numerical plots distinguish exact/reference and approximate points by shape and labels, not color alone.
- Every graph has an accessible sign/slope/value table sufficient to answer.
- Exact answers never depend on pixel estimation.

### Safety and modeling boundary

Every applied exercise is an idealized model with displayed assumptions and synthetic parameters. Population, disease, medication, finance, structural motion, chemical concentration, and circuits are educational contexts only. The app must not make real forecasts, dosing recommendations, safety claims, or engineering approval.

### Difficulty philosophy

Difficulty should increase through:

- weaker classification cues and competing applicable forms;
- preserving lost/singular solutions and intervals;
- choosing a method before executing it;
- moving among equation, graph, field, phase line, and solution;
- applying conditions after finding a family;
- resonance/repeated-root and piecewise forcing structure;
- composing one algebra/calculus step with one ODE idea;
- qualitative reasoning when closed form is unavailable;
- checking method applicability and theorem conditions.

It must not increase through giant coefficients, long integrations, high-order determinants, excessive numerical steps, cluttered fields, hidden notation conventions, or unsupported symbolic equivalence.

### Shared family contract

Every family below includes:

- **Task**: exact trainable operation and relationship to the skill;
- **Response/template**: interaction mode and preferred wording with typed placeholders;
- **Derivation**: normative algorithm;
- **Difficulty**: meaningful conceptual dimensions;
- **Misconceptions/constraints**: distractor rules, accepted forms, instance/rejection rules, and variations;
- **Feedback**: decisive rule and worked-solution structure;
- **Examples**: at least three fully instantiated cases;
- **Validation/coverage**: independent oracle/invariant and distribution obligations.

All prompt text, answers, choices, graphs, and feedback derive from one semantic instance. Reject any generated item with ambiguous classification, nonunique unstated answer, invalid interval, accidental cancellation, duplicate choices, or excessive clerical work.

## 2. Category: Equation recognition and solution verification

### Category purpose

Build reliable reading of differential equations and evidence-based verification before learners choose solution methods.

### Learn

Order comes from the highest derivative. Linearity requires `y` and its derivatives only to the first power, never multiplied together or inside nonlinear functions, with coefficients depending only on the independent variable. A proposed solution must satisfy both the equation and all supplied conditions on a valid interval.

### Prerequisites

Derivative notation and basic algebra.

### Category boundaries

This category classifies and verifies; it does not yet solve an unfamiliar ODE.

### Subcategories

1. Variables and derivative notation
2. Order, degree, and form
3. Linearity/autonomy/homogeneity
4. IVP/BVP data
5. Solution and interval verification

### Family `ode_variables_notation`

**Task.** Identify independent/dependent variables and translate derivative notations.

**Response/template.** Matching: `For {equation_context}, identify the variables and rewrite {derivative}.`

**Derivation.** Use function declaration/denominator/dot context to bind the derivative to the independent variable.

**Difficulty.** L1 `dy/dx`; L2 prime/dot/operator notation; L3 multiple named functions or parameter; L4 reject partial-derivative interpretation.

**Misconceptions/constraints.** Every prime has a displayed function declaration. Distractors swap variables or treat `dy/dx` as a fraction for classification.

**Feedback.** Expand notation explicitly, e.g. `y''=d²y/dx²`.

**Examples.**

1. `y=y(x), y'+xy=0` → independent x, dependent y. L1.
2. `q=q(t), q̈+4q=0` → `d²q/dt²+4q=0`. L2.
3. `D³u−Du=t` with `D=d/dt` → third derivative of u with respect to t. L3.

**Validation/coverage.** Typed symbol table and notation round trip.

### Family `ode_order_degree`

**Task.** Determine ODE order and degree or state that degree is undefined.

**Response/template.** Integer order plus degree/status: `Classify the order and degree of {equation}.`

**Derivation.** Find highest derivative; test polynomiality in all derivatives; degree is exponent of highest derivative in the resulting derivative polynomial.

**Difficulty.** L1 linear form; L2 polynomial derivative powers; L3 radical/trigonometric derivative; L4 algebraic simplification without non-equivalent squaring.

**Misconceptions/constraints.** Distractors use highest ordinary power of y/x or clear radicals by squaring. Reject equations whose classification depends on an unstated transformation.

**Feedback.** Mark derivative terms separately from ordinary y powers.

**Examples.**

1. `y''+3y'=x` → order2, degree1. L1.
2. `(y''')²+y'=0` → order3, degree2. L2.
3. `sin(y')+y=0` → order1, degree not defined. L3.

**Validation/coverage.** Derivative-polynomial AST inspection; balance defined/undefined degree.

### Family `ode_linearity_classify`

**Task.** Decide whether a scalar ODE is linear and identify the first violating feature.

**Response/template.** Yes/no plus feature: `Is {equation} linear in {dependent_variable}?`

**Derivation.** Collect dependent variable and derivatives; confirm degree1, no products/compositions, and coefficients independent of y.

**Difficulty.** L1 obvious linear/nonlinear; L2 variable coefficients; L3 nonlinear coefficient depending on y/product derivatives; L4 parameter values that restore linearity.

**Misconceptions/constraints.** Distractors call variable coefficients nonlinear or polynomial-looking `y²` linear. The dependent variable is explicit.

**Feedback.** Rewrite into canonical linear form or highlight the precise offender.

**Examples.**

1. `x²y''+sin(x)y'=e^x` → linear. L2.
2. `y'+y²=x` → nonlinear because of y². L1.
3. `y y''+(y')²=0` → nonlinear because dependent terms multiply. L2.

**Validation/coverage.** Symbolic linear-form collector with parameter branch tests.

### Family `ode_type_labels`

**Task.** Apply autonomous, homogeneous-linear/nonhomogeneous, explicit/implicit, separable-form, and scale-homogeneous labels.

**Response/template.** Property set: `Which labels apply to {equation}?`

**Derivation.** Evaluate each independent definition after safe simplification.

**Difficulty.** L1 one label; L2 several simultaneous labels; L3 distinguish two meanings of homogeneous; L4 choose a method-relevant normal form.

**Misconceptions/constraints.** “Homogeneous” always carries qualifier in prompt/feedback. Do not label an equation separable merely because it can be algebraically tortured into a quotient outside the grammar.

**Feedback.** Give one criterion per selected/rejected label.

**Examples.**

1. `y'=y(1−y)` → first-order, autonomous, separable, nonlinear. L1.
2. `y'+2y=0` → linear homogeneous and autonomous. L2.
3. `y'=1+(y/x)²` → scale-homogeneous first-order, nonlinear, nonautonomous as written. L3.

**Validation/coverage.** Independent predicates over normalized ODE AST; cover label intersections.

### Family `ivp_bvp_data`

**Task.** Classify conditions as IVP/BVP and judge whether their count/location is structurally appropriate for order.

**Response/template.** Type plus condition count: `Classify {equation_and_conditions}.`

**Derivation.** Compare condition locations and derivative orders with ODE order; one location→IVP, distinct locations→BVP.

**Difficulty.** L1 first-order IVP; L2 second-order IVP/BVP; L3 insufficient/redundant conditions; L4 conditions causing inconsistency in a concrete family.

**Misconceptions/constraints.** “Appropriate count” is not proof of existence/uniqueness. Distractors count equation order terms instead of conditions.

**Feedback.** List free constants expected locally and how each condition constrains them.

**Examples.**

1. `y'=x+y, y(0)=1` → first-order IVP with one condition. L1.
2. `y''+y=0, y(0)=0,y'(0)=2` → second-order IVP with two conditions. L1.
3. `y''=0, y(0)=0,y(1)=1` → two-point BVP. L2.

**Validation/coverage.** Typed condition locations/orders and template solution-rank checks for concrete consistency cases.

### Family `explicit_solution_verify`

**Task.** Verify whether an explicit candidate satisfies an ODE and conditions on a stated interval.

**Response/template.** Yes/no with residual/condition fields: `Does {candidate} solve {problem} on {interval}?`

**Derivation.** Differentiate exact candidate, substitute to form residual, check zero identically, then conditions and definedness.

**Difficulty.** L1 first-order polynomial/exponential; L2 parameter/IC; L3 second-order; L4 candidate solves equation but violates interval/domain.

**Misconceptions/constraints.** Distractors test only one point, only IC, or only ODE. Candidate grammar supports exact differentiation.

**Feedback.** Separate equation residual, conditions, and interval.

**Examples.**

1. `y=3e^{−2x}` solves `y'+2y=0` and y(0)=3. L1.
2. `y=x²+1` does not solve `y'=2y`; residual `2x−2x²−2`. L1.
3. `y=1/(C−x)` solves y'=y² only where denominator nonzero. L3.

**Validation/coverage.** Independent differentiator and symbolic residual normalization.

### Family `implicit_solution_verify`

**Task.** Verify an implicit relation and identify valid local branches.

**Response/template.** Yes/no plus branch condition: `Does {F(x,y)=C} implicitly solve {ode}?`

**Derivation.** Differentiate `F(x,y(x))=C`: `F_x+F_y y'=0`; solve for y' where `F_y≠0`; compare and check relation/domain.

**Difficulty.** L1 separable logarithmic relation; L2 algebraic circle/branches; L3 singular points where implicit function theorem fails; L4 IC selects branch.

**Misconceptions/constraints.** Do not demand explicit solving. Reject grading through points where F_y=0 unless the family explicitly analyzes them.

**Feedback.** Show total derivative and branch restriction.

**Examples.**

1. `x²+y²=C` → `2x+2yy'=0`, so y'=−x/y where y≠0. L2.
2. `ln|y|=x+C` → y'/y=1, so y'=y on nonzero branches. L2.
3. `y²=x`, relation yields y'=1/(2y), not valid as a differentiable y(x) branch at (0,0). L3.

**Validation/coverage.** Symbolic total differentiation and local branch predicate.

### Family `solution_interval`

**Task.** Determine a maximal interval containing an initial point or identify why a proposed interval fails.

**Response/template.** Structured interval plus excluded points: `For {solution/problem} with x0={x0}, give the maximal valid interval.`

**Derivation.** Collect singularities of normalized coefficients, forcing, explicit solution, logs/radicals, and branch restrictions; choose connected component containing x0.

**Difficulty.** L1 rational coefficient; L2 solved denominator/log; L3 several singularities; L4 distinguish equation singularity from removable expression artifact.

**Misconceptions/constraints.** Only exact algebraic singularities. Distractors give all-domain, union of intervals for one IVP, or include endpoint singularity.

**Feedback.** Mark each excluded point and select the connected component.

**Examples.**

1. y=1/(2−x), x0=0 → maximal interval `(−∞,2)`. L1.
2. `xy'+y=0`, x0=1 → coefficient singular at0, interval `(0,∞)`. L2.
3. solution `ln|x−1|+C` with x0=3 → `(1,∞)`. L2.

**Validation/coverage.** Domain AST and connected-component oracle; boundary substitution checks.

### Cross-family progression

Notation precedes classification. Order/degree and linearity are taught separately before multi-label questions. IVP/BVP recognition precedes solution checks. Explicit verification precedes implicit verification. Interval questions follow domain-aware examples and recur in every solving category.

## 3. Category: Direction fields and qualitative first-order behavior

### Category purpose

Train useful conclusions when no closed form is available: local slope, equilibrium, monotonicity, stability, barriers, and uniqueness.

### Learn

For `y'=f(x,y)`, the direction field assigns slope `f(x,y)` at each point. A solution curve follows these slopes. In an autonomous equation `y'=f(y)`, the sign between equilibria gives a phase line. Existence/uniqueness theorems provide sufficient local conclusions, not magic global guarantees.

### Prerequisites

Category 2, graph sign reasoning.

### Category boundaries

This category does not solve equations symbolically. Numerical approximations come later.

### Subcategories

1. Local slope and isoclines
2. Field matching
3. Autonomous phase lines
4. Existence/uniqueness

### Family `local_slope_evaluate`

**Task.** Compute the slope and local direction of a solution through a point.

**Response/template.** Numeric slope plus direction: `For y'={f}, find the slope at ({x0},{y0}).`

**Derivation.** Substitute coordinates into f; classify positive/negative/zero/undefined.

**Difficulty.** L1 affine f; L2 product/rational; L3 parameter or undefined locus; L4 compare several points.

**Misconceptions/constraints.** Distractors evaluate y instead of y', swap coordinates, or differentiate f. Avoid unreadable arithmetic.

**Feedback.** Show substitution and a local tangent segment.

**Examples.**

1. y'=x+y at (1,2) → slope3. L1.
2. y'=y(1−y) at y=1 →0, horizontal. L1.
3. y'=(x−y)/(x+y) at (1,−1) → undefined. L3.

**Validation/coverage.** Exact AST evaluation and sign/status classifier.

### Family `isocline_construct`

**Task.** Find/select the locus on which the field has a specified constant slope.

**Response/template.** Equation/graph choice: `For y'={f}, find the isocline where slope={m}.`

**Derivation.** Solve `f(x,y)=m` within bounded linear/quadratic templates.

**Difficulty.** L1 f depending on y only; L2 affine x,y; L3 nonlinear factored; L4 multiple components.

**Misconceptions/constraints.** Distractors solve y=m or f=0 regardless of requested m. Locus and exclusions are explicit.

**Feedback.** Substitute a test point from the candidate locus.

**Examples.**

1. y'=x+y, slope0 → y=−x. L1.
2. y'=y², slope4 → y=±2. L2.
3. y'=(y−1)/(x+2), slope1 → y=x+3 with x≠−2. L3.

**Validation/coverage.** Exact equation solving and sample substitution across components.

### Family `direction_field_match`

**Task.** Match a generated ODE to its direction field or distinguish candidate fields.

**Response/template.** Single choice: `Which field corresponds to {ode}?`

**Derivation.** Compare invariants: dependence on x/y, zero-slope isoclines, signs, symmetries, and selected magnitudes.

**Difficulty.** L1 y-only horizontal bands; L2 x-only vertical bands; L3 affine diagonal isoclines; L4 nonlinear/undefined curve.

**Misconceptions/constraints.** Fields derive from semantic grids; distractors each embody one plausible misread. Avoid fields distinguishable only by tiny segment angle.

**Feedback.** Highlight three decisive grid points/isoclines.

**Examples.**

1. y'=y has slope constant along horizontal lines, zero at y=0. L1.
2. y'=x has slope constant along vertical lines, zero at x=0. L1.
3. y'=x−y has zero slopes on y=x and positive below it. L3.

**Validation/coverage.** Grid-signature comparison and unique semantic distinction.

### Family `solution_curve_match`

**Task.** Select which curve can be a solution through a point without solving the ODE.

**Response/template.** Graph choice: `Which curve is consistent with {field/ode} and {initial_point}?`

**Derivation.** Check initial point, tangent sign/magnitude, equilibrium crossing/uniqueness barriers, and concavity if derived.

**Difficulty.** L1 initial slope; L2 equilibrium barrier; L3 turning behavior; L4 combine slope and uniqueness.

**Misconceptions/constraints.** Candidate curves differ semantically, not cosmetically. Never infer uniqueness unless conditions support it.

**Feedback.** Mark first point where each wrong curve violates the field.

**Examples.**

1. y'=y through (0,1) must increase with slope1 initially. L1.
2. y'=y(1−y), y0=0.5 stays between equilibria0 and1 and increases. L2.
3. y'=x+y² through (0,0) has initial slope0 but immediately positive curvature from x term; a flat constant curve fails. L3.

**Validation/coverage.** Candidate derivative residual at semantic sample points and barrier logic.

### Family `autonomous_equilibria_phase_line`

**Task.** Find equilibria and complete the one-dimensional phase-line arrows.

**Response/template.** Equilibrium set plus interval arrows: `For y'={f(y)}, find equilibria and phase line.`

**Derivation.** Solve f(y)=0, partition real line, test sign in each interval.

**Difficulty.** L1 one linear root; L2 two/three factored roots; L3 repeated root; L4 parameter changes root order.

**Misconceptions/constraints.** Distractors find y'=constant instead of zero, alternate arrows automatically, or ignore multiplicity. Factorable polynomial/rational f with exclusions.

**Feedback.** Show sign table of factors.

**Examples.**

1. y'=y → equilibrium0; arrows left below0 and right above0. L1.
2. y'=y(1−y) → equilibria0,1; arrows left/right/left on intervals. L2.
3. y'=(y−1)² → equilibrium1; arrows right on both sides. L3.

**Validation/coverage.** Exact roots/exclusions and interval sign oracle.

### Family `equilibrium_stability`

**Task.** Classify autonomous equilibria as asymptotically stable, unstable, or semistable.

**Response/template.** Label per equilibrium: `Classify the equilibria of {phase_line_or_f}.`

**Derivation.** Inspect arrow directions from both sides; use f' only as a shortcut when nonzero.

**Difficulty.** L1 hyperbolic root; L2 several roots; L3 repeated/nonhyperbolic; L4 parameter transition.

**Misconceptions/constraints.** Distractors use sign of equilibrium value or f alone. If f'=0, require phase-line reasoning.

**Feedback.** State left/right attraction separately.

**Examples.**

1. y'=−2y → y=0 asymptotically stable. L1.
2. y'=y(1−y) →0 unstable,1 asymptotically stable. L2.
3. y'=(y−1)² → y=1 semistable: attracting from left, repelling to right. L3.

**Validation/coverage.** Sign-neighborhood oracle and derivative cross-check for hyperbolic cases.

### Family `qualitative_long_term`

**Task.** Predict monotonicity, limit equilibrium, or blow-up direction from an autonomous phase line and initial value.

**Response/template.** Direction/limit/status: `Starting at y0={value}, what qualitative behavior follows?`

**Derivation.** Locate initial interval, follow arrows without crossing unique equilibrium; identify attracting boundary/equilibrium or unbounded direction. Finite-time blow-up is claimed only when supplied/verified.

**Difficulty.** L1 approach stable equilibrium; L2 unbounded direction; L3 semistable side; L4 parameter/basin.

**Misconceptions/constraints.** Phase line alone proves direction and possible limit structure, not finite blow-up time. Wording distinguishes `unbounded as t increases` from `finite-time blow-up`.

**Feedback.** Trace the phase-line interval and barrier.

**Examples.**

1. y'=y(1−y), 0<y0<1 → increases toward1. L1.
2. same y0>1 → decreases toward1. L2.
3. y'=(y−1)², y0<1 → increases toward1; y0>1 increases away. L3.

**Validation/coverage.** Phase-line transition semantics plus exact solution cross-check where available.

### Family `existence_uniqueness_local`

**Task.** Apply stated sufficient conditions to decide what can be guaranteed locally at an initial point.

**Response/template.** Multiple choice guarantee: `For y'=f(x,y), y(x0)=y0, what follows from {continuity_data}?`

**Derivation.** Continuity of f on a rectangle gives local existence; continuity of f and f_y gives local uniqueness. Failure of a sufficient condition means “not guaranteed by this test,” not automatically false.

**Difficulty.** L1 both continuous; L2 f discontinuity; L3 f continuous but f_y problematic; L4 compare actual uniqueness with theorem inconclusiveness.

**Misconceptions/constraints.** Prompts specify theorem version and rectangle. Distractors conclude no solution/nonunique merely because hypotheses fail.

**Feedback.** Separate theorem guarantee from actual behavior.

**Examples.**

1. f=x+y polynomial near (0,0) → local existence and uniqueness guaranteed. L1.
2. f=1/(x−1) at x0=1 → theorem does not guarantee existence; ODE undefined there. L2.
3. f=|y|^(1/2) at (0,0): f continuous, usual f_y condition fails → existence guaranteed by continuity, uniqueness not guaranteed by this test. L3.

**Validation/coverage.** Domain/continuity metadata and theorem decision table; include inconclusive cases.

### Cross-family progression

Local slope precedes isoclines and field matching. Field matching precedes curve selection. Autonomous equilibria lead to phase lines, stability, and long-term behavior. Existence/uniqueness is introduced after learners see why solution curves may or may not cross.

## 4. Category: Separable equations and first-order autonomous solutions

### Category purpose

Train correct separation, integration, lost-solution audits, condition application, and qualitative checks for a broad exact-friendly first-order family.

### Learn

For `y'=g(x)h(y)`, non-equilibrium branches may be separated as `dy/h(y)=g(x)dx`. Any roots of h(y) divided away must be tested as equilibrium solutions. Integrate both sides, apply conditions, and state intervals/branches.

### Prerequisites

Categories 2–3; antiderivatives and logs.

### Category boundaries

Only genuinely separable forms appear. Logistic and applied autonomous models are included here algebraically and revisited in modeling.

### Subcategories

1. Recognizing and separating
2. Integrating and implicit forms
3. Equilibria/branches
4. IVPs and autonomous models

### Family `separable_recognize`

**Task.** Decide whether an ODE is separable and select a valid separated form.

**Response/template.** Yes/no plus equation choice: `Can {ode} be separated as G(y)dy=F(x)dx?`

**Derivation.** Factor RHS into x-only times y-only or rearrange a bounded multiplicative form without dividing by a potentially zero factor silently.

**Difficulty.** L1 product; L2 quotient/algebra; L3 additive trap; L4 multiple methods applicable.

**Misconceptions/constraints.** Distractors move additive terms across differentials, treat y+x as product, or divide away equilibria without note.

**Feedback.** Display x-only/y-only factors and lost-factor warning.

**Examples.**

1. y'=xy → `dy/y=x dx` for y≠0; separable. L1.
2. y'=(1+x²)/(1+y²) → `(1+y²)dy=(1+x²)dx`. L2.
3. y'=x+y → not separable by the supported product form (though linear). L2.

**Validation/coverage.** Factor-dependency analysis and re-multiplication equivalence.

### Family `separable_integrate`

**Task.** Integrate a correctly separated equation to an implicit/general solution.

**Response/template.** Structured implicit relation: `Integrate {separated_form} and give the non-equilibrium family.`

**Derivation.** Apply reviewed antiderivatives independently; combine constants into one C; preserve absolute values/domains.

**Difficulty.** L1 polynomial; L2 logarithm/exponential; L3 partial-fraction logistic; L4 inverse trig from supplied pair.

**Misconceptions/constraints.** Distractors integrate dy side as x, omit absolute value, or introduce two independent constants. Integrals are from curated library.

**Feedback.** Show two antiderivatives and constant consolidation.

**Examples.**

1. `dy/y=x dx` → `ln|y|=x²/2+C`. L1.
2. `(1+y²)dy=2x dx` → `y+y³/3=x²+C`. L2.
3. `dy/[y(1−y)]=dt` → `ln|y/(1−y)|=t+C` on appropriate non-equilibrium branches. L3.

**Validation/coverage.** Differentiate implicit relation and compare to separated equation.

### Family `lost_equilibrium_audit`

**Task.** Identify equilibrium/constant solutions lost by division and combine them with nonconstant families.

**Response/template.** Equilibrium set plus family: `When separating {ode}, which solutions require separate retention?`

**Derivation.** Solve every divided y-factor=0, substitute constants into original ODE, retain those satisfying it.

**Difficulty.** L1 one factor y; L2 multiple roots; L3 denominator/excluded root; L4 algebraic cancellation with parameter.

**Misconceptions/constraints.** Distractors report every zero of a denominator as solution or assume C=0 restores all equilibria.

**Feedback.** Mark division step and substitute each candidate into original equation.

**Examples.**

1. y'=xy: division by y loses y=0, which is a solution. L1.
2. y'=y(1−y): division loses y=0 and y=1. L2.
3. y'=(y−2)/(y−1): y=2 equilibrium; y=1 is excluded/undefined, not a solution. L3.

**Validation/coverage.** Original-ODE constant substitution and factor provenance.

### Family `separable_explicit_branch`

**Task.** Solve an implicit separated relation explicitly and choose the branch consistent with conditions.

**Response/template.** Explicit formula/branch fields: `Solve {implicit_relation} for y on {interval/condition}.`

**Derivation.** Apply injective inverse on the declared branch, solve algebraically, and verify no extraneous branch.

**Difficulty.** L1 exponential; L2 square/root with sign; L3 logistic algebra; L4 Lambert-W-requiring cases are rejected/not supported.

**Misconceptions/constraints.** Do not accept `±` when IC selects one branch. Reject equations needing unsupported inverse functions.

**Feedback.** Show branch choice and substitution.

**Examples.**

1. `ln|y|=x+C`, y(0)>0 → `y=Ae^x`, A>0. L1.
2. `y²=x²+1`, y(0)=−1 → `y=−sqrt(x²+1)`. L2.
3. `ln[y/(1−y)]=t+C`, 0<y<1 → `y=1/(1+A e^{−t})`, A>0. L3.

**Validation/coverage.** Branch-aware algebra and explicit/implicit substitution round trip.

### Family `separable_ivp`

**Task.** Solve a separable IVP and give its maximal interval.

**Response/template.** Formula plus interval: `Solve {ode}, {initial_condition}.`

**Derivation.** Audit equilibria, integrate branch, apply IC exactly, solve as requested, then determine connected validity interval.

**Difficulty.** L1 exponential; L2 rational blow-up; L3 logistic/implicit; L4 IC on equilibrium or branch boundary.

**Misconceptions/constraints.** Generate unique local solutions under displayed conditions. Distractors delay applying IC incorrectly or cross singularity.

**Feedback.** Separation→integration→constant→verification→interval.

**Examples.**

1. y'=2xy,y(0)=3 → `y=3e^{x²}`, all real x. L1.
2. y'=y²,y(0)=1 → `y=1/(1−x)`, maximal `(−∞,1)`. L2.
3. y'=y(1−y), y(0)=1 → equilibrium solution y=1, not a divided nonconstant branch. L3.

**Validation/coverage.** ODE/IC substitution and domain connected-component oracle.

### Family `autonomous_time_to_level`

**Task.** Use a separated definite integral to find time to move between levels or decide it is infinite/impossible.

**Response/template.** Exact/approximate time/status: `For y'=f(y), starting y0, find time to reach y1.`

**Derivation.** `Δt=∫_{y0}^{y1}dy/f(y)` along an interval with consistent direction and no intervening equilibrium/singularity.

**Difficulty.** L1 constant/proportional rate; L2 logistic level; L3 equilibrium makes time infinite; L4 direction makes target unreachable forward.

**Misconceptions/constraints.** Check phase line first. Distractors integrate through equilibrium or return negative time without interpreting direction.

**Feedback.** Confirm reachability, then evaluate the definite integral.

**Examples.**

1. y'=2y, y0=1 to y1=4 → time `ln4/2=ln2`. L1.
2. y'=y(1−y), y0=1/2 to y1=3/4 → time `ln3`. L2.
3. y'=−y, y0=1 never reaches y=0 in finite time; integral diverges. L3.

**Validation/coverage.** Phase-line reachability plus exact definite integral and solution inversion.

### Family `logistic_parameters_behavior`

**Task.** Read/derive carrying capacity, intrinsic rate, equilibria, inflection level, and solution behavior from logistic form/data.

**Response/template.** Named parameters/qualitative fields: `For y'=r y(1−y/K), determine {features}.`

**Derivation.** Equilibria0,K; for r,K>0, 0 unstable, K stable; maximal growth at y=K/2; solution constant determined by IC.

**Difficulty.** L1 identify r,K; L2 phase behavior; L3 solve IVP/inflection; L4 recover parameters from rates/data.

**Misconceptions/constraints.** Parameters positive unless an explicit generalized case. Distractors call K initial value or treat growth rate constant.

**Feedback.** Factor phase line and optionally graph per-capita rate.

**Examples.**

1. y'=0.3y(1−y/100) → r=0.3,K=100. L1.
2. y0=20 → increases toward100, fastest when y=50. L2.
3. y0=100 → constant equilibrium y=100. L2.

**Validation/coverage.** Parameter reconstruction, phase-line oracle, and exact logistic solution check.

### Cross-family progression

Recognition precedes integration. Lost-equilibrium auditing is introduced before full IVPs and remains mandatory. Implicit solutions precede branch extraction. Time-to-level and logistic behavior combine qualitative reachability with exact separation.

## 5. Category: First-order linear, exact, and substitution methods

### Category purpose

Train recognition and exact execution of the major first-order methods that are not simply separation.

### Learn

Linear standard form is `y'+P(x)y=Q(x)` with integrating factor `μ=e^{∫Pdx}`. An equation `M dx+N dy=0` is exact when `M_y=N_x`, then it comes from a potential `F` with `F_x=M,F_y=N`. Bernoulli and scale-homogeneous equations become simpler after a declared substitution.

### Prerequisites

Classification, separable equations, product rule, basic antiderivatives.

### Category boundaries

Only reviewed substitutions with mechanically checkable transformed equations are included. Guessing arbitrary substitutions is not.

### Subcategories

1. Method selection
2. First-order linear equations
3. Exact equations
4. Bernoulli equations
5. Scale-homogeneous substitutions

### Family `first_order_method_select`

**Task.** Choose all directly applicable primary methods for a first-order ODE and the most economical first step.

**Response/template.** Multiple choice plus first transformation: `Which method should be tried first for {ode}?`

**Derivation.** Normalize safely, apply separable/linear/exact/Bernoulli/scale-homogeneous predicates, then use declared priority based on shortest reviewed path.

**Difficulty.** L1 unique obvious type; L2 needs normalization; L3 multiple applicable methods; L4 “none of supported methods.”

**Misconceptions/constraints.** Distractors choose from surface tokens (`y'` means linear), or force separation of a sum. “Best” is defined by the generator's exact transformation-cost metadata.

**Feedback.** Show why each method predicate passes/fails.

**Examples.**

1. `y'+2y=e^x` → first-order linear. L1.
2. `y'=xy` → separable and linear homogeneous; separation is the shortest reviewed path. L2.
3. `y'=x+y²` → none of the supported direct forms. L3.

**Validation/coverage.** Independent method predicates and verified transformed equation.

### Family `linear_standard_form`

**Task.** Normalize a first-order linear equation and identify P,Q and singular points.

**Response/template.** Structured P,Q plus domain: `Put {equation} into y'+P(x)y=Q(x).`

**Derivation.** Divide by nonzero leading coefficient and record excluded zeros before simplifying.

**Difficulty.** L1 coefficient1; L2 divide variable coefficient; L3 signs/rational functions; L4 parameter singularity.

**Misconceptions/constraints.** Distractors divide only one term or discard coefficient zeros from interval analysis.

**Feedback.** Divide every term and retain domain exclusions.

**Examples.**

1. `y'+3y=x` → P=3,Q=x. L1.
2. `xy'+2y=x²`, x≠0 → `y'+(2/x)y=x`. L2.
3. `(x−1)y'−y=1` → P=`−1/(x−1)`,Q=`1/(x−1)`, x≠1. L3.

**Validation/coverage.** Cross-multiply normalized equation and compare on declared domain.

### Family `integrating_factor_compute`

**Task.** Compute/select an integrating factor and verify the product-derivative identity.

**Response/template.** μ plus identity: `For y'+{P}y={Q}, find one integrating factor μ.`

**Derivation.** `μ=e^{∫Pdx}`; nonzero constant multiples are equivalent; verify `(μy)'=μ(y'+Py)`.

**Difficulty.** L1 constant P; L2 `k/x`; L3 polynomial/rational reviewed integral; L4 inverse recover P from μ.

**Misconceptions/constraints.** Distractors use `e^P`, integrate Q, or omit absolute/domain issue. Accept nonzero constant multiples.

**Feedback.** Differentiate μ and confirm μ'=Pμ.

**Examples.**

1. P=2 → μ=`e^{2x}`. L1.
2. P=3/x on x>0 → μ=`x³`. L2.
3. μ=`e^{x²}` → P=μ'/μ=`2x`. L3.

**Validation/coverage.** Exact logarithmic derivative check.

### Family `linear_first_order_solve`

**Task.** Solve a first-order linear equation/IVP by integrating factor.

**Response/template.** Explicit formula plus interval: `Solve {linear_ode_and_optional_ic}.`

**Derivation.** Normalize, compute μ, integrate `(μy)'=μQ`, divide by μ, apply IC, and determine interval.

**Difficulty.** L1 homogeneous/constant coefficients; L2 polynomial forcing; L3 variable P; L4 IC across singular coefficient rejected.

**Misconceptions/constraints.** Curated integrable μQ. Distractors multiply only y, forget C/μ, or apply IC before restoring y.

**Feedback.** Five-row method table ending in substitution check.

**Examples.**

1. `y'+2y=0` → `y=Ce^{−2x}`. L1.
2. `y'+y=1,y(0)=0` → `y=1−e^{−x}`. L2.
3. `xy'+y=x²`, x>0 → `(xy)'=x²`, so `y=x²/3+C/x`. L3.

**Validation/coverage.** Exact ODE/IC residual and interval check.

### Family `exactness_test`

**Task.** Decide whether `M dx+N dy=0` is exact and compute the discrepancy if not.

**Response/template.** Yes/no plus `M_y,N_x`: `Is {M}dx+{N}dy=0 exact on {domain}?`

**Derivation.** Differentiate and compare on simply connected declared domain.

**Difficulty.** L1 polynomial; L2 trig/exponential; L3 parameter condition; L4 domain hole caveat.

**Misconceptions/constraints.** Distractors compare M_x with N_y or compare M,N directly. Topology caveats appear only with explicit domain teaching.

**Feedback.** Align partial derivatives term by term.

**Examples.**

1. `(2x+y)dx+(x+3y²)dy=0` → M_y=1,N_x=1, exact. L1.
2. `y dx+x²dy=0` → M_y=1,N_x=2x, not exact. L1.
3. `(ay)dx+(2x)dy=0` → exact only if a=2. L2.

**Validation/coverage.** Independent partial differentiator and normalized equality.

### Family `exact_potential_solve`

**Task.** Recover a potential F and implicit solution for an exact equation.

**Response/template.** F and `F=C`: `Find a potential for {exact_equation}.`

**Derivation.** Integrate M with respect to x plus g(y), compare F_y with N to find g', integrate; or symmetric route.

**Difficulty.** L1 polynomial; L2 missing g term; L3 trig/exponential; L4 apply IC and branch.

**Misconceptions/constraints.** Potentials differing by constants accepted. Distractors omit the “constant” function of the other variable.

**Feedback.** Show partial integration and correction function.

**Examples.**

1. `(2x+y)dx+(x+3y²)dy=0` → F=`x²+xy+y³`, solution F=C. L1.
2. `e^x cos y dx−e^x sin y dy=0` → F=`e^x cos y`. L2.
3. first example through (0,1) → C=1. L2.

**Validation/coverage.** Verify gradient `(F_x,F_y)=(M,N)` and IC.

### Family `simple_integrating_factor_exact`

**Task.** Find/select an x-only or y-only integrating factor that makes a nonexact equation exact.

**Response/template.** μ choice plus transformed check: `Which μ({x_or_y}) makes {equation} exact?`

**Derivation.** If `(M_y−N_x)/N` is x-only, `μ(x)=exp(∫ ratio dx)` under the chosen sign convention; analogous y-only formula is displayed/derived.

**Difficulty.** L1 candidate verification; L2 compute x-only; L3 y-only; L4 reject when ratio depends on both.

**Misconceptions/constraints.** Because formulas are sign-sensitive, Learn and feedback derive them rather than demand blind recall. Curated exact-friendly ratios.

**Feedback.** Compute discrepancy ratio, integrate, then retest exactness.

**Examples.**

1. Candidate μ=x for a displayed equation: multiply M,N and verify partials. L1.
2. If `(M_y−N_x)/N=2`, μ(x)=`e^{2x}` under displayed formula. L2.
3. If the ratio contains both x and y, no x-only integrating factor follows from this test. L3.

**Validation/coverage.** Multiply and exactness-test independently; include no-applicable result.

### Family `bernoulli_transform_solve`

**Task.** Recognize `y'+Py=Qy^n`, perform `v=y^{1−n}`, and solve a bounded equation/IVP.

**Response/template.** Transformation, linear v-equation, and optional y: `Solve/transform {bernoulli_ode}.`

**Derivation.** Differentiate v, divide/multiply carefully to get `v'+(1−n)Pv=(1−n)Q`, solve linearly, invert branch, audit y=0.

**Difficulty.** L1 identify substitution; L2 solve n=2 or−1; L3 IC/branch; L4 equilibrium lost by division.

**Misconceptions/constraints.** n≠0,1. Inversion domains explicit. Distractors use v=y^n or forget factor 1−n.

**Feedback.** Derive transformed equation rather than quote only.

**Examples.**

1. `y'+y=xy²`, n=2 → v=y^{-1}. L1.
2. transformed equation becomes `v'−v=−x`. L2.
3. y=0 must be checked separately when original equation permits it. L3.

**Validation/coverage.** Substitute transformation symbolically, solve v, and verify final y in original.

### Family `scale_homogeneous_substitution`

**Task.** Use `v=y/x` (y=vx) to transform/solve `y'=F(y/x)`.

**Response/template.** Transformed separable equation plus solution: `Apply y=vx to {ode}.`

**Derivation.** `y'=v+xv'`; set equal to F(v); obtain `xv'=F(v)−v`, separate.

**Difficulty.** L1 transform only; L2 integrate rational v; L3 IC/implicit relation; L4 singular lines/equilibria in v.

**Misconceptions/constraints.** x interval excludes0. Distractors set y'=v' or use v=x/y.

**Feedback.** Product-rule derivation and lost constant-slope line audit.

**Examples.**

1. `y'=1+y/x` → `v+xv'=1+v`, so `xv'=1`. L1.
2. integrate `v'=1/x` → `v=ln|x|+C`, hence y=`x(ln|x|+C)`. L2.
3. `y'=1+(y/x)²` → `xv'=1+v²−v`, a separable v-equation. L3.

**Validation/coverage.** Transformation residual and final substitution; domain x≠0.

### Cross-family progression

Method selection is interleaved with each new technique. Linear normalization precedes integrating factors and full solutions. Exactness test precedes potential construction; optional integrating factors are later. Bernoulli and scale-homogeneous substitutions remain separate until learners can derive the transformed equation.

## 6. Category: Modeling with first-order equations

### Category purpose

Train translation between a verbal rate law, an ODE with units, parameters/data, and model behavior.

### Learn

Define variables with units, express “rate of change” as a derivative, translate proportional/net-flow statements, supply initial data, and check dimensions/signs. A model is valid only under its stated assumptions.

### Prerequisites

Separable and first-order linear equations; unit reasoning.

### Category boundaries

All scenarios are synthetic and idealized. Domain science belongs in sister apps; here the assessed skill is model formulation and ODE behavior.

### Subcategories

1. Proportional growth/decay
2. Limited growth
3. Temperature exchange
4. Mixing
5. Motion with linear drag
6. Dimensional/model checks

### Family `model_rate_statement`

**Task.** Translate a controlled verbal rate statement into an ODE and initial condition.

**Response/template.** Structured equation/variable units: `Let {variable_definition}. Model {rate_statement}.`

**Derivation.** Identify accumulation derivative; add source terms and subtract sink terms; translate proportionality with dimensioned constant.

**Difficulty.** L1 one proportional term; L2 source minus loss; L3 capacity factor; L4 distinguish absolute versus per-capita rate.

**Misconceptions/constraints.** Every phrase uses a pinned semantic template. Distractors omit derivative, reverse signs, or confuse amount/concentration.

**Feedback.** Annotate each term with meaning and unit.

**Examples.**

1. population grows at rate proportional to P → `P'=kP`, k units1/time. L1.
2. amount A enters at 5 units/h and leaves at rate0.2A/h → `A'=5−0.2A`. L2.
3. per-capita growth decreases linearly to zero at K → `P'=rP(1−P/K)`. L3.

**Validation/coverage.** Dimension AST and semantic term/sign comparison.

### Family `exponential_growth_decay_model`

**Task.** Solve/infer rate constant, doubling/half-life, or time/value in `P'=kP`.

**Response/template.** Named parameter/value/time: `Given {growth_data}, find {target}.`

**Derivation.** `P=P0e^{kt}`; doubling `ln2/k`, half-life `ln2/|k|`; solve logarithmically.

**Difficulty.** L1 known k; L2 half/doubling; L3 infer k from two observations; L4 reverse target time.

**Misconceptions/constraints.** k carries reciprocal-time unit. Distractors use linear change or sign-wrong decay.

**Feedback.** Show ratio `P/P0` before logarithm.

**Examples.**

1. P'=0.1P,P0=50 → P(t)=`50e^{0.1t}`. L1.
2. half-life3 h → k=`−ln2/3 h^{-1}`. L2.
3. quantity triples in4 days → `P(t)=P0·3^{t/4}`. L3.

**Validation/coverage.** ODE/IC and forward/inverse time checks.

### Family `logistic_data_model`

**Task.** Solve/use logistic model from carrying capacity/rate/data and interpret regimes.

**Response/template.** Parameters/formula/prediction: `For logistic model {data}, find {target}.`

**Derivation.** Use phase properties or `P=K/[1+A e^{−rt}]`, `A=(K−P0)/P0`.

**Difficulty.** L1 compute A; L2 future value; L3 infer r from observation; L4 compare early exponential approximation.

**Misconceptions/constraints.** K,r,P0 positive with P0 not0 unless equilibrium case. No real population forecasts.

**Feedback.** Verify initial value, equilibrium, and units.

**Examples.**

1. K=100,P0=20 → A=4. L1.
2. r=1,K=100,P0=20 → `P=100/(1+4e^{-t})`. L2.
3. for P≪K, rate approximately rP, but exact model retains `(1−P/K)`. L3.

**Validation/coverage.** Exact solution substitution and data reconstruction.

### Family `newton_cooling`

**Task.** Form/solve `T'=−k(T−T_a)` for constant ambient temperature and infer a parameter/time.

**Response/template.** Formula/parameter/time with units: `Object starts {T0} in ambient {Ta}; {data}.`

**Derivation.** Difference θ=T−Ta satisfies θ'=−kθ, so `T=Ta+(T0−Ta)e^{−kt}`.

**Difficulty.** L1 formula/value; L2 infer k; L3 target time; L4 warming versus cooling sign.

**Misconceptions/constraints.** Constant ambient stated. Distractors decay toward zero instead of ambient or use Celsius absolute value incorrectly.

**Feedback.** Model the temperature difference and limiting value.

**Examples.**

1. Ta=20,T0=80,k=0.1 → `T=20+60e^{-0.1t}`. L1.
2. object at60 when t=ln2/k → halfway in difference, T=50 if Ta=20,T0=80. L2.
3. T0=5,Ta=25 → derivative initially positive; formula approaches25 from below. L2.

**Validation/coverage.** ODE/IC/limit and observation reconstruction.

### Family `mixing_tank`

**Task.** Construct/solve a well-stirred constant-volume mixing equation.

**Response/template.** ODE plus amount/concentration: `Tank has {volume,flows,concentrations}; find {target}.`

**Derivation.** Amount A: `A'=q_in c_in−q_out A/V`; equal flows keep V constant; solve first-order linear equation.

**Difficulty.** L1 pure water out/in; L2 nonzero inflow concentration; L3 parameter/time; L4 variable volume recognition but not full solve.

**Misconceptions/constraints.** v1 exact solve uses constant volume/equal rates. Distractors use initial concentration forever in outflow or confuse amount with concentration.

**Feedback.** In-rate/out-rate unit table.

**Examples.**

1. V=100 L, q=10 L/min, pure water in, A0=20 g → `A'=−A/10`. L1.
2. c_in=2 g/L with same q,V → `A'=20−A/10`, equilibrium200 g. L2.
3. A0=0 → `A=200(1−e^{−t/10})` g. L3.

**Validation/coverage.** Dimensional flow balance and ODE/IC solution check.

### Family `linear_drag_motion`

**Task.** Model/solve one-dimensional velocity with constant force and linear drag.

**Response/template.** ODE, terminal velocity, or v(t): `Mass {m} has force {F} and drag {−cv}; find {target}.`

**Derivation.** `m v'=F−cv`; terminal `F/c`; solution `v=F/c+(v0−F/c)e^{−ct/m}`.

**Difficulty.** L1 terminal value; L2 transient; L3 infer c/time constant; L4 sign/reference direction.

**Misconceptions/constraints.** Coordinate direction shown. No quadratic drag, position integration beyond one optional step, or real safety claims.

**Feedback.** Check force balance at terminal speed and initial derivative.

**Examples.**

1. m=2,F=10,c=5 → terminal v=2 m/s. L1.
2. v0=0 → `v=2(1−e^{−2.5t})`. L2.
3. time constant m/c=0.4 s. L2.

**Validation/coverage.** Force dimensions, ODE/IC, terminal limit.

### Family `model_assumption_dimension_check`

**Task.** Identify a dimension/sign/assumption flaw in a proposed model.

**Response/template.** Single choice plus correction: `Which issue makes {model} inconsistent with {statement}?`

**Derivation.** Compare term dimensions, conservation signs, state dependence, and declared assumptions.

**Difficulty.** L1 units; L2 source/sink sign; L3 constant-volume/well-mixed assumption; L4 distinguish model limitation from algebra error.

**Misconceptions/constraints.** Exactly one intended flaw. Distractors are true observations that do not invalidate the specified model.

**Feedback.** Show dimension and semantic balance.

**Examples.**

1. `P'=k+P` with P people and t days is dimensionally invalid unless coefficient of P has 1/day and k people/day. L1.
2. tank outflow term `−qA` has wrong units; it must be `−qA/V`. L2.
3. Newton cooling with changing ambient cannot use constant Ta solution unless Ta(t) is modeled. L3.

**Validation/coverage.** Dimension-tagged equation and assumption predicate.

### Cross-family progression

Verbal translation precedes solving contexts. Exponential and logistic reuse separable equations; cooling and mixing reuse linear equations; drag connects to second-order motion later. Assumption/dimension checks are interleaved throughout, not reserved as trivia.

## 7. Category: Higher-order homogeneous linear equations

### Category purpose

Train structural solution of constant-coefficient homogeneous equations and reliable application of initial conditions.

### Learn

For `a_n y^(n)+...+a_0y=0`, trial `e^{rx}` yields the characteristic polynomial. Distinct real, repeated real, and complex-conjugate roots produce different basis functions. A valid general solution needs the correct number of independent functions.

### Prerequisites

Classification, complex roots, exponentials/trigonometry, linear independence.

### Category boundaries

Variable-coefficient equations appear only in reduction-of-order or named Euler–Cauchy templates. General high-order root finding is excluded.

### Subcategories

1. Characteristic equations
2. Root-pattern solution bases
3. Initial conditions
4. Independence and reduction of order
5. Euler–Cauchy equations

### Family `characteristic_equation`

**Task.** Form or recover the characteristic polynomial from a constant-coefficient homogeneous ODE.

**Response/template.** Polynomial coefficient fields: `Find the characteristic equation for {ode}.`

**Derivation.** Substitute y=e^{rx}; replace y^(k) by r^k e^{rx}; divide nonzero exponential.

**Difficulty.** L1 second order monic; L2 missing derivative/signs; L3 order3/4 factored; L4 recover ODE from polynomial.

**Misconceptions/constraints.** Order≤4, factorable roots. Distractors differentiate r, omit zero coefficients, or use x as polynomial variable.

**Feedback.** Align each derivative with a power of r.

**Examples.**

1. `y''+3y'+2y=0` → `r²+3r+2=0`. L1.
2. `2y'''−5y'=0` → `2r³−5r=0`. L2.
3. `(r−1)²(r+2)=0` corresponds to `(D−1)²(D+2)y=0`. L3.

**Validation/coverage.** Coefficient-vector round trip ODE↔polynomial.

### Family `homogeneous_real_distinct`

**Task.** Construct/verify the general solution for distinct real characteristic roots.

**Response/template.** Root set plus solution basis: `Solve {homogeneous_ode}.`

**Derivation.** Factor polynomial; each distinct real root r contributes `e^{rx}`.

**Difficulty.** L1 roots supplied; L2 factor quadratic; L3 order3; L4 infer equation from modes.

**Misconceptions/constraints.** Distractors use one constant for all modes, put roots as coefficients, or omit a mode.

**Feedback.** Factor→roots→one independent exponential per root.

**Examples.**

1. `y''−3y'+2y=0` roots1,2 → `C1e^x+C2e^{2x}`. L1.
2. `y''−4y=0` → `C1e^{2x}+C2e^{−2x}`. L2.
3. roots−1,0,3 → `C1e^{−x}+C2+C3e^{3x}`. L3.

**Validation/coverage.** Substitute basis and verify Wronskian/nonzero Vandermonde.

### Family `homogeneous_repeated_root`

**Task.** Construct solution basis for repeated real roots.

**Response/template.** Root multiplicities plus basis: `Solve {ode} with repeated roots.`

**Derivation.** Root r of multiplicity m contributes `e^{rx},xe^{rx},...,x^{m−1}e^{rx}`.

**Difficulty.** L1 repeated quadratic; L2 mixed roots; L3 multiplicity3; L4 identify missing dependent basis member.

**Misconceptions/constraints.** Distractors duplicate same exponential with two constants or multiply exponent by multiplicity.

**Feedback.** Tie each multiplicity slot to an added x power.

**Examples.**

1. `(r−2)²` → `(C1+C2x)e^{2x}`. L1.
2. roots−1 double and3 single → `(C1+C2x)e^{−x}+C3e^{3x}`. L2.
3. `r=0` triple → `C1+C2x+C3x²`. L3.

**Validation/coverage.** Characteristic multiplicity and Wronskian/substitution.

### Family `homogeneous_complex_roots`

**Task.** Convert conjugate roots into a real solution basis.

**Response/template.** Root pair and real formula: `Solve {ode} whose roots are {alpha}±{beta}i.`

**Derivation.** Pair `e^{(α±iβ)x}` to obtain `e^{αx}(C1 cos βx+C2 sin βx)`.

**Difficulty.** L1 roots supplied; L2 factor quadratic; L3 repeated complex pair recognition; L4 interpret decay/growth/oscillation.

**Misconceptions/constraints.** β>0. Repeated complex roots above multiplicity1 are recognition-only in v1.

**Feedback.** Apply Euler identity and preserve real constants.

**Examples.**

1. roots±2i → `C1cos2x+C2sin2x`. L1.
2. roots−1±3i → `e^{−x}(C1cos3x+C2sin3x)`. L2.
3. roots2±i → oscillations with growing envelope e^{2x}. L3.

**Validation/coverage.** Exact ODE residual and complex-to-real span equivalence.

### Family `higher_order_ivp_constants`

**Task.** Apply initial conditions to a homogeneous solution basis and solve for constants.

**Response/template.** Constant fields and particular solution: `Solve {ode} with {conditions}.`

**Derivation.** Evaluate y and required derivatives at condition point; solve exact linear system.

**Difficulty.** L1 distinct roots at0; L2 repeated/complex; L3 conditions at nonzero exact-friendly point; L4 detect inconsistent/redundant data.

**Misconceptions/constraints.** Systems at most3×3 and exact-friendly. Alternative basis constants accepted through final solution verification.

**Feedback.** Show condition matrix and verify each condition.

**Examples.**

1. `y''−y=0,y(0)=2,y'(0)=0` → `y=2cosh x` or `e^x+e^{-x}`. L2.
2. `y''+y=0,y(0)=0,y'(0)=3` → `3sin x`. L1.
3. `y''−2y'+y=0,y(0)=1,y'(0)=0` → `(1−x)e^x`. L3.

**Validation/coverage.** Exact condition system and ODE/IC substitution; accept equivalent bases.

### Family `fundamental_set_wronskian`

**Task.** Decide whether candidate solutions form a fundamental set on an interval.

**Response/template.** Yes/no plus Wronskian/space dimension: `Do {functions} form a fundamental set for {ode}?`

**Derivation.** Verify each solves the homogeneous ODE and Wronskian nonzero at a regular point (or exact independence proof).

**Difficulty.** L1 obvious exponentials; L2 trig pair; L3 dependent scaled functions; L4 Wronskian zero caveat outside supported regular linear context.

**Misconceptions/constraints.** Never use Wronskian nonzero without first verifying correct number/solutions. Regular coefficient interval stated.

**Feedback.** Separate solution membership and independence.

**Examples.**

1. `{e^x,e^{2x}}` fundamental for `y''−3y'+2y=0`; Wronskian e^{3x}≠0. L2.
2. `{cos x,sin x}` fundamental for y''+y=0. L1.
3. `{e^x,2e^x}` not independent; W=0. L1.

**Validation/coverage.** Exact residual and Wronskian determinant.

### Family `reduction_of_order`

**Task.** Find/verify a second solution given one solution of a second-order homogeneous linear ODE.

**Response/template.** Candidate/formula: `Given y1 for {standard_form_ode}, find an independent y2.`

**Derivation.** Use `y2=y1∫ e^{−∫Pdx}/y1² dx` or substitute y=v y1 and reduce order.

**Difficulty.** L1 candidate verification; L2 simple P=0; L3 variable P curated integral; L4 check independence/domain.

**Misconceptions/constraints.** y1 nonzero on declared interval and integrals reviewed. Constant multiples rejected as second independent solution.

**Feedback.** Derive reduced first-order equation and Wronskian check.

**Examples.**

1. y''−y=0,y1=e^x → y2=e^{−x}. L1.
2. `x²y''−xy'+y=0`, x>0,y1=x → second solution x ln x. L3.
3. y2=3y1 solves the ODE but is not independent. L2.

**Validation/coverage.** ODE residual and nonzero Wronskian.

### Family `euler_cauchy_equation`

**Task.** Solve/classify an Euler–Cauchy equation using y=x^m on a declared half-line.

**Response/template.** Indicial roots and solution: `Solve {equidimensional_ode} on {x>0_or_x<0}.`

**Derivation.** Substitute y=x^m, reduce to polynomial in m; apply distinct/repeated/complex pattern with ln|x| for complex oscillation.

**Difficulty.** L1 distinct real m; L2 repeated; L3 complex; L4 transform x=e^t recognition.

**Misconceptions/constraints.** Domain never crosses0. Roots exact-friendly.

**Feedback.** Show derivative powers preserve x^m factor.

**Examples.**

1. `x²y''−xy'=0`, x>0 → m(m−1)−m=m(m−2), y=C1+C2x². L2.
2. `x²y''+xy'=0` → m²=0, y=C1+C2ln x. L2.
3. complex m=α±iβ → `x^α[C1cos(βln x)+C2sin(βln x)]`. L3.

**Validation/coverage.** Indicial polynomial and direct ODE substitution on domain.

### Cross-family progression

Characteristic construction precedes root-pattern families. Distinct, repeated, and complex cases are initially separate, then mixed. Initial conditions follow complete bases. Wronskian and reduction of order reinforce independence. Euler–Cauchy is a distinct variable-coefficient template introduced last.

## 8. Category: Nonhomogeneous linear equations and forcing

### Category purpose

Train superposition of complementary and particular solutions, trial selection, resonance correction, and forced-response interpretation.

### Learn

For `L[y]=g`, every solution is `y=y_h+y_p`. The complementary solution solves `L[y_h]=0`; one particular solution handles forcing. Undetermined-coefficient trials mirror forcing families but must be multiplied by enough powers of x when they overlap the complementary solution.

### Prerequisites

Category 7, polynomial/exponential/trigonometric differentiation.

### Category boundaries

Undetermined coefficients applies only to constant coefficients and curated forcing types. Variation of parameters covers selected cases; arbitrary integrals are excluded.

### Subcategories

1. Superposition structure
2. Trial selection
3. Resonance and coefficient solving
4. Variation of parameters
5. Forced behavior

### Family `nonhomogeneous_structure`

**Task.** Identify complementary/particular parts and determine whether a candidate is a general solution.

**Response/template.** Matching/yes-no: `For L[y]={g}, classify {candidate_terms}.`

**Derivation.** Apply L to each term; kernel terms are homogeneous, one term with output g is particular; verify correct independent constant count.

**Difficulty.** L1 obvious constant forcing; L2 mixed terms; L3 a different valid particular solution; L4 distinguish general from one particular.

**Misconceptions/constraints.** Particular solutions are nonunique up to homogeneous additions. Distractors demand the generator's exact yp form.

**Feedback.** Show L[term] and explain affine solution space.

**Examples.**

1. y''−y=e^x: a resonant particular cannot simply be Ae^x because e^x is homogeneous. L2.
2. if yp=x and yh=C1+C2e^x, general is yh+x. L1.
3. yp and yp+3e^{2x} are both particular when e^{2x} lies in the homogeneous kernel. L3.

**Validation/coverage.** Operator residual and homogeneous-span equivalence.

### Family `undetermined_trial_select`

**Task.** Select the minimal trial form for polynomial, exponential, sinusoidal, or product forcing before resonance correction.

**Response/template.** Trial-form choice: `Choose a trial for {forcing} in {ode}.`

**Derivation.** Use closed derivative family: degree-m polynomial; Ae^{ax}; A cos bx+B sin bx; product e^{ax}(polynomial×sin/cos).

**Difficulty.** L1 constant/polynomial; L2 exponential/sinusoid; L3 products; L4 include all lower polynomial degrees.

**Misconceptions/constraints.** Distractors omit necessary sine/cosine partner or lower polynomial terms. Resonance multiplier asked separately/combined at higher levels.

**Feedback.** Differentiate the proposed family to show closure.

**Examples.**

1. forcing x² → trial Ax²+Bx+C. L1.
2. forcing cos3x → A cos3x+B sin3x. L2.
3. forcing x e^{2x} → e^{2x}(Ax+B). L3.

**Validation/coverage.** Forcing-family AST closure and minimal coefficient count.

### Family `resonance_multiplier`

**Task.** Determine the power of x needed to remove trial overlap with the complementary solution.

**Response/template.** Integer s and corrected trial: `Correct {base_trial} for resonance with {characteristic_roots}.`

**Derivation.** Multiply base trial by x^s where s is multiplicity of the corresponding forcing root in characteristic polynomial.

**Difficulty.** L1 simple resonance; L2 repeated root; L3 complex pair; L4 partial overlap in product forcing.

**Misconceptions/constraints.** Distractors always multiply by x once or change forcing frequency.

**Feedback.** Map forcing to complex root and read multiplicity.

**Examples.**

1. y''−y=e^x; root1 simple → trial A x e^x. L1.
2. `(D−2)²y=e^{2x}` → trial A x²e^{2x}. L2.
3. y''+4y=cos2x; roots±2i simple → x(Acos2x+Bsin2x). L2.

**Validation/coverage.** Kernel-overlap/multiplicity oracle and linear independence check.

### Family `undetermined_coefficients_solve`

**Task.** Find a particular/general solution by coefficient matching.

**Response/template.** Coefficient fields plus solution: `Solve {constant_coefficient_ode} for {forcing}.`

**Derivation.** Build corrected trial, differentiate/substitute, match coefficients, solve exact linear system, append yh and optional conditions.

**Difficulty.** L1 constant/exponential; L2 polynomial/sinusoid; L3 resonance; L4 combined forcing via superposition.

**Misconceptions/constraints.** At most four unknown trial coefficients. Reject singular coefficient system except intended redundancy.

**Feedback.** Trial→derivatives→coefficient table→verification.

**Examples.**

1. y''−y=1 → yp=−1. L1.
2. y''+y=cos2x → yp=`−(1/3)cos2x`. L2.
3. y''−2y'+y=e^x → repeated resonance; yp=`(1/2)x²e^x`. L3.

**Validation/coverage.** Exact residual and coefficient-system solve; alternate yp accepted.

### Family `nonhomogeneous_ivp`

**Task.** Solve a forced linear IVP by combining yh, yp, and conditions.

**Response/template.** Final formula: `Solve {nonhomogeneous_ivp}.`

**Derivation.** Find/verify yh and yp, combine, differentiate, apply initial conditions.

**Difficulty.** L1 constant forcing; L2 sinusoid/exponential; L3 resonance; L4 piecewise method choice deferred to Laplace.

**Misconceptions/constraints.** Conditions apply to total response, not yh alone. Exact-friendly 2×2 systems.

**Feedback.** Keep yh/yp columns separate until condition equations.

**Examples.**

1. y''+y=1,y(0)=0,y'(0)=0 → y=1−cos x. L1.
2. y''−y=0 plus conditions belongs homogeneous, not forced. L1 contrast.
3. y''+4y=cos2x with zero IC has resonant term proportional to x sin2x. L3.

**Validation/coverage.** ODE/IC residual and independent numerical trajectory spot check.

### Family `variation_parameters_setup`

**Task.** Set up/evaluate bounded variation-of-parameters formulas for a second-order equation.

**Response/template.** Wronskian/u1',u2' and yp: `Using {y1,y2}, find a particular solution for {forcing}.`

**Derivation.** Normalize to `y''+Py'+Qy=g`; `u1'=−y2 g/W`, `u2'=y1 g/W`; integrate reviewed expressions and form yp.

**Difficulty.** L1 setup only; L2 easy integrals; L3 variable forcing; L4 compare with undetermined coefficients.

**Misconceptions/constraints.** Convention displayed; W nonzero. Integrals curated. Distractors omit normalization by leading coefficient or W.

**Feedback.** Compute W, normalized g, then each parameter derivative.

**Examples.**

1. y''+y=g, y1=cos x,y2=sin x,W=1 → u1'=−sin x g,u2'=cos x g. L1.
2. for g=sec x in same basis, setup uses reviewed integrals. L2.
3. if forcing is polynomial under constant coefficients, undetermined coefficients may be shorter though variation still valid. L3.

**Validation/coverage.** Reconstruct yp and exact residual; method comparison metadata.

### Family `forcing_response_interpret`

**Task.** Interpret transient, steady/particular, resonance growth, or beat-like bounded composition from a solved response.

**Response/template.** Component labels/qualitative choice: `Classify the terms in {solution} for {system}.`

**Derivation.** Terms from homogeneous roots are natural/transient (decay/grow/persist); particular terms track forcing; resonant polynomial multipliers create growing envelopes in undamped ideal models.

**Difficulty.** L1 decaying transient + constant; L2 sinusoidal steady state; L3 resonance; L4 damping versus forcing frequency.

**Misconceptions/constraints.** Do not promise physical steady state if homogeneous terms grow/persist. Context assumptions explicit.

**Feedback.** Link each term to a characteristic or forcing root.

**Examples.**

1. `Ce^{-2t}+3` → decaying transient plus steady constant3. L1.
2. `C1cos t+C2sin t+(1/3)cos2t` → natural frequency1, forced frequency2. L2.
3. `t sin2t` under forcing at natural frequency2 → ideal resonance with linearly growing envelope. L3.

**Validation/coverage.** Root/forcing provenance labels and asymptotic term classifier.

### Cross-family progression

Affine solution structure precedes trial selection. Trial family and resonance multiplier are practiced separately before coefficient solving. IVPs follow complete general solutions. Variation of parameters is introduced as a general bounded alternative, not the default. Response interpretation reconnects algebra to behavior.

## 9. Category: Unilateral Laplace-transform IVPs

### Category purpose

Train transform handling of initial data, discontinuous/impulsive forcing, and algebraic solution of bounded linear IVPs.

### Learn

The unilateral Laplace transform converts derivatives into powers of s plus initial-data terms. Unit steps encode delayed forcing. Solve algebraically for Y(s), simplify, then invert with a pinned pair/property library. Conditions for transform existence and theorem use remain visible.

### Prerequisites

Linear ODEs, partial fractions, unit step, transform convention in overview.

### Category boundaries

Signals and Systems owns bilateral transform/ROC interpretation. Here Laplace is an IVP method on t≥0. No arbitrary inverse transform or contour integration.

### Subcategories

1. Transform rules with initial data
2. Inversion and shifts
3. Transform-domain IVP solving
4. Step/impulse inputs
5. Convolution recognition

### Family `laplace_derivative_initial`

**Task.** Transform derivative terms with the correct initial-value contributions.

**Response/template.** Algebraic expression in Y,s: `Compute the unilateral Laplace transform of {derivative_term} using {initial_data}.`

**Derivation.** Apply the unilateral derivative formula recursively.

**Difficulty.** L1 y'; L2 y''; L3 third order/missing zero values; L4 combine linear derivative terms.

**Misconceptions/constraints.** Distractors use bilateral `s^nY` only, wrong powers of s on initial data, or use endpoint y(∞).

**Feedback.** Display descending initial-data powers.

**Examples.**

1. y(0)=3: L{y'}=`sY−3`. L1.
2. y(0)=1,y'(0)=2: L{y''}=`s²Y−s−2`. L2.
3. L{y''+4y}=`(s²+4)Y−s y0−v0`. L2.

**Validation/coverage.** Symbolic recurrence and known exponential test functions.

### Family `inverse_laplace_basic`

**Task.** Invert rational transforms from the reviewed pair/partial-fraction library.

**Response/template.** Time formula: `Find the inverse unilateral Laplace transform of {transform}.`

**Derivation.** Factor denominator, partial-fraction, complete square/shift as required, map terms.

**Difficulty.** L1 one pole; L2 two real poles; L3 repeated/quadratic; L4 numerator manipulation.

**Misconceptions/constraints.** Proper rational functions degree≤2 denominator factors generally. Distractors confuse `1/(s+a)` sign or omit t for repeated pole.

**Feedback.** Partial fractions and pair mapping.

**Examples.**

1. `1/(s+2)` → `e^{-2t}`. L1.
2. `1/[s(s+1)]` → `1−e^{-t}`. L2.
3. `1/(s+1)²` → `t e^{-t}`. L2.

**Validation/coverage.** Forward-transform pair reconstruction and symbolic rational equality.

### Family `laplace_shift_step`

**Task.** Convert delayed step functions/piecewise forcing to transforms and invert `e^{-as}F(s)`.

**Response/template.** Step-form/time-transform pair: `Rewrite/transform {piecewise_or_delayed_signal}.`

**Derivation.** Second shifting theorem: `e^{-as}F(s) ↔ u(t−a)f(t−a)`; first rewrite piecewise function relative to t−a.

**Difficulty.** L1 delayed constant; L2 delayed polynomial/sine; L3 multiple jumps; L4 recover piecewise values.

**Misconceptions/constraints.** a≥0. Distractors use u(t+a), fail to shift f's argument, or multiply transform by e^{+as}.

**Feedback.** Introduce local time τ=t−a and verify before/after jump.

**Examples.**

1. u(t−2) ↔ `e^{-2s}/s`. L1.
2. `(t−3)u(t−3)` ↔ `e^{-3s}/s²`. L2.
3. `0` before1 and `cos(t−1)` after → `u(t−1)cos(t−1)` ↔ `e^{-s}s/(s²+1)`. L3.

**Validation/coverage.** Piecewise/step evaluation equality and transform property round trip.

### Family `laplace_solve_ivp`

**Task.** Solve a constant-coefficient IVP through Y(s).

**Response/template.** Y(s) and y(t): `Use Laplace transforms to solve {ivp}.`

**Derivation.** Transform every term with IC, solve algebraically for Y, partial-fraction, invert, verify.

**Difficulty.** L1 first order; L2 second order; L3 nonzero IC/forcing; L4 compare with classical solution.

**Misconceptions/constraints.** Exact rational transforms only. Distractors apply IC after inverse and double-count them.

**Feedback.** Equation→transformed equation→Y→inverse→check.

**Examples.**

1. y'+y=0,y(0)=2 → Y=2/(s+1), y=2e^{-t}. L1.
2. y''+y=0,y(0)=0,y'(0)=1 → Y=1/(s²+1), y=sin t. L2.
3. y'+y=1,y(0)=0 → Y=`1/[s(s+1)]`, y=1−e^{-t}. L2.

**Validation/coverage.** Transform algebra plus direct ODE/IC residual.

### Family `laplace_piecewise_impulse_ivp`

**Task.** Solve/interpret an IVP with delayed step or Dirac impulse forcing.

**Response/template.** Transform and piecewise/step-form solution: `Solve {ivp_with_forcing}.`

**Derivation.** Transform forcing, solve Y, apply shift theorem; impulse creates a jump in the appropriate state/derivative consistent with integration across the event.

**Difficulty.** L1 delayed first-order input; L2 second-order step; L3 impulse jump; L4 multiple events.

**Misconceptions/constraints.** At most two events. Impulse is area, not height. Jump conditions independently verified.

**Feedback.** Show pre-event state, transform response, and event jump.

**Examples.**

1. y'+y=u(t−1),y(0)=0 → `u(t−1)[1−e^{−(t−1)}]`. L2.
2. y'+y=δ(t−2),y(0)=0 → `u(t−2)e^{−(t−2)}`; y jumps by1 at2. L2.
3. y''+y=δ(t−a) with zero state → `u(t−a)sin(t−a)`; y continuous, y' jumps by1. L3.

**Validation/coverage.** Distribution jump integration, transform equality, and piecewise residual away from events.

### Family `laplace_convolution_solution`

**Task.** Recognize/product-invert a transform as a time convolution and use it for a forced solution.

**Response/template.** Convolution expression or evaluated template: `Invert F(s)G(s) using convolution.`

**Derivation.** Product maps to `∫₀^t f(τ)g(t−τ)dτ`; connect to zero-state response.

**Difficulty.** L1 choose convolution form; L2 simple integral; L3 parameter/forcing; L4 compare with partial fractions.

**Misconceptions/constraints.** Factors from supported causal pairs; no arbitrary convolution integral.

**Feedback.** Map each factor separately and set correct 0..t limits.

**Examples.**

1. `1/(s+1)·1/s` → `∫₀^t e^{-τ}dτ=1−e^{-t}`. L2.
2. `H(s)F(s)` is zero-state output transform for impulse response h and input f. L1.
3. `1/(s²+1)·1/(s+1)` → convolution of sin t and e^{-t}; partial fractions may verify. L3.

**Validation/coverage.** Direct convolution versus rational multiplication/inversion.

### Cross-family progression

Derivative rules precede full IVPs. Basic inversion precedes delayed shifts. Ordinary IVPs precede piecewise/impulsive forcing. Convolution appears last and explicitly overlaps Signals & Systems without replacing its broader LTI treatment.

## 10. Category: First-order systems and planar dynamics

### Category purpose

Train conversion, execution, solution, and qualitative interpretation of small coupled ODE systems.

### Learn

An nth-order scalar ODE can be rewritten as n first-order equations by naming derivatives as state variables. For `u'=Au`, eigenvectors give invariant directions and eigenvalues give modal time factors. In nonlinear planar systems, nullclines locate zero component rates and their intersections are equilibrium candidates.

### Prerequisites

Higher-order linear equations; 2×2 matrix arithmetic/eigenpairs.

### Category boundaries

General eigenanalysis belongs in Linear Algebra. This category uses supplied/exact-friendly eigenstructure to understand ODE behavior. No nonlinear chaos or rigorous phase-plane proofs.

### Subcategories

1. Scalar-to-system conversion
2. Linear system execution/verification
3. Eigenmode solutions
4. Phase portraits and stability
5. Nonlinear nullclines

### Family `scalar_to_first_order_system`

**Task.** Convert an nth-order scalar ODE and conditions to a first-order system.

**Response/template.** State definitions and vector equation: `Rewrite {scalar_ode} as a first-order system.`

**Derivation.** Define u1=y,u2=y',...,un=y^(n−1); shift derivatives; solve original for highest derivative.

**Difficulty.** L1 second order; L2 forcing; L3 third order; L4 reverse system to scalar.

**Misconceptions/constraints.** Leading coefficient nonzero on interval. Distractors set every component derivative equal to highest derivative or lose conditions.

**Feedback.** State ladder and condition mapping.

**Examples.**

1. y''+3y'+2y=0 → u1'=u2,u2'=−2u1−3u2. L1.
2. y''+y=sin t → u'=`[[0,1],[-1,0]]u+[0,sin t]`. L2.
3. y(0)=1,y'(0)=2 → u(0)=[1,2]. L1.

**Validation/coverage.** Eliminate state variables and recover original ODE/conditions.

### Family `system_derivative_evaluate`

**Task.** Evaluate vector field/one derivative step at a point.

**Response/template.** Vector: `For u'={F(t,u)}, find u' at {point}.`

**Derivation.** Substitute components or multiply Au+b exactly.

**Difficulty.** L1 diagonal linear; L2 coupled 2×2; L3 nonlinear terms; L4 parameter/sign region.

**Misconceptions/constraints.** Dimensions≤3. Distractors multiply elementwise or swap component order.

**Feedback.** One row/component per derivative.

**Examples.**

1. u1'=u2,u2'=−u1 at (1,2) → (2,−1). L1.
2. u'=A u, A=`[[1,2],[0,−1]]`,u=(1,3) → (7,−3). L2.
3. x'=x(1−y),y'=y(x−1) at (1,1) → (0,0), equilibrium. L3.

**Validation/coverage.** Exact vector AST/matrix oracle.

### Family `system_solution_verify`

**Task.** Verify a vector-valued solution and initial condition.

**Response/template.** Yes/no with residual vector: `Does {u(t)} solve {system_ivp}?`

**Derivation.** Differentiate each component, evaluate F, compare vectors, then IC.

**Difficulty.** L1 decoupled; L2 coupled linear; L3 parameterized/eigenmode; L4 nonlinear candidate.

**Misconceptions/constraints.** Exact differentiable components. Distractors verify one component only or use scalar derivative.

**Feedback.** Aligned derivative/RHS components.

**Examples.**

1. u=(e^t,0) solves u'=diag(1,−1)u with u(0)=(1,0). L1.
2. u=(cos t,−sin t) solves u1'=u2,u2'=−u1 because u1'=−sin t and u2'=−cos t. L2.
3. same candidate with IC (0,1) fails IC despite solving equations. L2.

**Validation/coverage.** Symbolic vector residual and condition check.

### Family `linear_system_eigen_solution`

**Task.** Construct general/particular solution of `u'=Au` from supplied/exact eigenpairs.

**Response/template.** Modal coefficients/vector formula: `Solve u'=Au using {eigenpairs}.`

**Derivation.** Each eigenpair (λ,v) contributes `c e^{λt}v`; solve constants from u0. Complex conjugate pairs convert to a real basis when required.

**Difficulty.** L1 diagonal; L2 two real eigenpairs; L3 initial vector decomposition; L4 complex pair/repeated defective excluded or supplied.

**Misconceptions/constraints.** v nonzero, pairs verified. Distinct-real/complex diagonalizable 2×2 dominate.

**Feedback.** Decompose initial state into eigenvectors, then evolve coefficients.

**Examples.**

1. A=diag(−1,2) → u=(C1e^{-t},C2e^{2t}). L1.
2. eigenpairs (1,[1,1]),(−1,[1,−1]) → sum of corresponding modes. L2.
3. u0=[2,0]=[1,1]+[1,−1] → u=e^t[1,1]+e^{-t}[1,−1]. L3.

**Validation/coverage.** Verify eigenpairs, ODE residual, and IC decomposition.

### Family `linear_phase_portrait_classify`

**Task.** Classify planar linear equilibrium from eigenvalues/eigenvectors and select the matching phase portrait.

**Response/template.** Type/stability/portrait choice: `Classify u'=Au from {eigen_data}.`

**Derivation.** Real same-sign eigenvalues→node; opposite signs→saddle; complex real part nonzero→spiral; pure imaginary diagonalizable→center; defective repeated cases use supplied geometry.

**Difficulty.** L1 stable/unstable node; L2 saddle; L3 spiral/center; L4 repeated/degenerate distinction.

**Misconceptions/constraints.** Rotation direction requires evaluating vector field at a test point, not eigenvalues alone. Borderline cases explicitly labeled.

**Feedback.** Separate type, stability, eigendirections, rotation.

**Examples.**

1. λ=−1,−3 → asymptotically stable node. L1.
2. λ=2,−1 → saddle, unstable. L2.
3. λ=−1±2i → asymptotically stable spiral. L3.

**Validation/coverage.** Eigenvalue classifier plus simulated vector directions.

### Family `phase_portrait_trajectory`

**Task.** Determine invariant lines, qualitative trajectory direction, or long-term mode dominance in a linear phase portrait.

**Response/template.** Line/direction/limit choice: `For {system/eigenvectors}, describe trajectory from {u0}.`

**Derivation.** Decompose into eigenmodes; states on eigendirections remain there; compare exponential rates as t→±∞.

**Difficulty.** L1 eigenline; L2 node dominance; L3 saddle stable/unstable manifold; L4 spiral rotation from field.

**Misconceptions/constraints.** Do not claim generic trajectories cross. Distractors follow faster-decaying mode at long positive time or reverse time direction.

**Feedback.** Show modal coefficients and dominant exponent.

**Examples.**

1. initial state on stable eigenvector remains on that line and tends to0. L1.
2. stable node λ=−1,−4 with both components: λ=−1 direction dominates late. L2.
3. saddle initial exactly on negative-eigenvalue line tends to0 forward; generic state departs along positive mode. L3.

**Validation/coverage.** Exact modal evolution and phase-flow uniqueness.

### Family `nonlinear_nullclines_equilibria`

**Task.** Find nullclines/equilibria and component direction signs for a planar autonomous nonlinear system.

**Response/template.** Curve sets, intersections, sign region: `For x'={f},y'={g}, find nullclines and equilibria.`

**Derivation.** Solve f=0 and g=0 separately; intersect valid components; test signs in declared regions.

**Difficulty.** L1 linear nullclines; L2 factored population model; L3 multiple intersections; L4 parameter movement.

**Misconceptions/constraints.** Nullcline is where one component derivative is zero, not necessarily equilibrium. Factorable curves and at most four equilibria.

**Feedback.** Color/label x'=0 and y'=0 separately; intersections only are equilibria.

**Examples.**

1. x'=x(1−x),y'=−y → x-nullclines x=0,1; y-nullcline y=0; equilibria (0,0),(1,0). L2.
2. x'=y,y'=−x → nullclines y=0 and x=0; only equilibrium origin. L1.
3. a point on x'=0 but y'≠0 moves vertically, not stationary. L2.

**Validation/coverage.** Exact algebraic intersections and component sign oracle.

### Family `nonlinear_linearization`

**Task.** Compute/select Jacobian at an equilibrium and make the permitted local classification.

**Response/template.** Matrix/eigenvalue/type fields: `Linearize {system} at {equilibrium}.`

**Derivation.** Form Jacobian of vector field, evaluate, compute supplied/exact 2×2 eigenvalues, apply hyperbolic classification. Nonhyperbolic result is “inconclusive by linearization.”

**Difficulty.** L1 Jacobian entries; L2 stable/saddle; L3 several equilibria; L4 nonhyperbolic caveat.

**Misconceptions/constraints.** Do not infer nonlinear stability from zero-real-part eigenvalues. Exact-friendly polynomial systems.

**Feedback.** Differentiate, evaluate, classify, and state theorem limitation.

**Examples.**

1. x'=−x,y'=−2y at origin → J=diag(−1,−2), stable. L1.
2. x'=x(1−x),y'=−y at (1,0) → J=diag(−1,−1), locally asymptotically stable. L2.
3. zero eigenvalue at equilibrium → linearization test inconclusive. L3.

**Validation/coverage.** Symbolic Jacobian, equilibrium verification, eigen classifier.

### Cross-family progression

Scalar conversion and derivative evaluation precede vector solution verification. Eigenmode solutions precede phase-portrait classification and trajectories. Nonlinear nullclines precede Jacobian linearization. General matrix mechanics may route to Linear Algebra.

## 11. Category: Numerical initial-value methods

### Category purpose

Train transparent approximation steps, error interpretation, and method/step-size reasoning when exact solutions are unavailable or unnecessary.

### Learn

Numerical methods replace a continuous solution by mesh values. Each method samples one or more slopes per step. Smaller h usually reduces truncation error but costs more steps; stability and convergence still matter. Always update both t and y from the current row.

### Prerequisites

Local slopes, arithmetic, Taylor-series concept for error families.

### Category boundaries

No black-box solver use, adaptive control, stiff production methods, or long tables. Reference values are generated independently.

### Subcategories

1. Euler and higher-order explicit steps
2. Error and order
3. Stability
4. Method comparison

### Family `euler_step`

**Task.** Perform one explicit Euler step.

**Response/template.** Slope/new point: `Use Euler with h={h} from ({tn},{yn}) for y'={f}.`

**Derivation.** k=f(tn,yn); next `(tn+h,yn+hk)`.

**Difficulty.** L1 f(t); L2 f(t,y); L3 negative/fraction h; L4 inverse recover missing slope/h.

**Misconceptions/constraints.** Exact-friendly arithmetic. Distractors evaluate slope at new time or forget h.

**Feedback.** Show current point→slope→vertical increment→new point.

**Examples.**

1. y'=y,(0,1),h=0.1 → y1=1.1 at t=.1. L1.
2. y'=t−y,(1,2),h=.5 → slope−1,y_next=1.5. L2.
3. y'=2t+y,(0,3),h=1/4 → y_next=15/4. L2.

**Validation/coverage.** Direct formula and geometric tangent endpoint.

### Family `euler_trace`

**Task.** Complete several Euler rows and report approximation.

**Response/template.** Table: `Use Euler from t0 to {target} with h={h}.`

**Derivation.** Iterate using each newly computed state exactly.

**Difficulty.** L1 two steps; L2 changing f(t,y); L3 compare step sizes; L4 detect first erroneous row.

**Misconceptions/constraints.** At most six steps. Distractors reuse initial y or evaluate all slopes at t0.

**Feedback.** Grade each row and stop diagnosis at first divergence.

**Examples.**

1. y'=y,y0=1,h=1 for two steps → 1,2,4. L1.
2. y'=t+y,(0,1),h=.5 → y1=1.5,y2=2.5. L2.
3. a table using y0 in every slope is wrong from row2 onward. L3.

**Validation/coverage.** Iterative simulator and recurrence residual per row.

### Family `heun_midpoint_step`

**Task.** Perform one Heun or explicit-midpoint step under displayed convention.

**Response/template.** Stage fields and next y: `Use {method} for one step.`

**Derivation.** Apply normative method stage definitions from overview.

**Difficulty.** L1 stages supplied partly; L2 full computation; L3 compare Heun/midpoint; L4 vector one-step optional.

**Misconceptions/constraints.** Method name/formula displayed. Distractors average points rather than slopes or omit predictor.

**Feedback.** Table each stage with evaluation point.

**Examples.**

1. Heun y'=y,y0=1,h=1: k1=1,predictor2,k2=2,y1=2.5. L1.
2. midpoint same: k1=1, midpoint y=1.5,k2=1.5,y1=2.5. L1.
3. for nonlinear f, Heun and midpoint generally differ despite same order. L3.

**Validation/coverage.** Independent Butcher-table stage evaluator.

### Family `rk4_one_step`

**Task.** Complete a single classical RK4 step.

**Response/template.** k1..k4 and next y: `Using displayed RK4 convention, take one step.`

**Derivation.** Evaluate four stages and weighted average `(k1+2k2+2k3+k4)/6`, with k values defined as slopes in v1.

**Difficulty.** L1 some stages supplied; L2 f(t) only; L3 simple f(t,y); L4 identify stage-location error.

**Misconceptions/constraints.** One step only, exact-friendly values; prompt repeats whether k are slopes or h-scaled.

**Feedback.** Stage evaluation-point diagram.

**Examples.**

1. y'=1 gives all k=1 and y_next=y+h exactly. L1.
2. y'=t, from0,h=1 gives weighted slope1/2 and increment1/2. L2.
3. k4 is evaluated at t+h using y+h k3, not midpoint. L3.

**Validation/coverage.** Butcher tableau oracle and polynomial exactness checks.

### Family `local_global_error`

**Task.** Distinguish local truncation error, global error, method order, and compute simple observed error ratios.

**Response/template.** Classification/order/ratio: `Given errors at h and h/2, infer {order_or_error_type}.`

**Derivation.** For global error `E≈Ch^p`, halving h reduces by about `2^p`; local order is typically p+1 for one-step order-p method.

**Difficulty.** L1 definitions; L2 infer p; L3 distinguish roundoff/step error; L4 non-asymptotic caveat.

**Misconceptions/constraints.** Data generated in asymptotic regime when order inferred. Distractors equate local/global or think p means exactly p errors.

**Feedback.** Compare same final point and log2 ratio.

**Examples.**

1. global errors .04 and .01 when h halves → ratio4, p=2. L2.
2. Euler global order1, local truncation order2. L1.
3. error at one step starting exact is local; after many steps at target is global. L1.

**Validation/coverage.** Exact synthetic error law and definition metadata.

### Family `numerical_compare_exact`

**Task.** Compare a numerical approximation with an exact/reference value and compute signed/absolute/relative error.

**Response/template.** Error fields: `At {target}, approximation={a}, reference={r}; compute {errors}.`

**Derivation.** Signed error a−r; absolute magnitude; relative `/|r|` when r≠0.

**Difficulty.** L1 absolute; L2 signed/relative; L3 compare methods/steps; L4 reference rounded tolerance.

**Misconceptions/constraints.** Relative error not requested at zero reference. Rounding policy explicit.

**Feedback.** State orientation of signed error.

**Examples.**

1. approx2.5, exact e≈2.71828 → signed≈−.21828, absolute .21828. L1.
2. approx9.9, exact10 → relative error1%. L2.
3. smaller absolute error at same target is more accurate, not necessarily higher formal order from one trial. L3.

**Validation/coverage.** Decimal/high-precision arithmetic and zero-reference rejection.

### Family `euler_absolute_stability`

**Task.** Determine Euler amplification and whether a step lies in its absolute-stability region.

**Response/template.** R(z), magnitude, stable yes/no: `For y'=λy and step h, assess Euler stability.`

**Derivation.** Euler gives `y_{n+1}=(1+hλ)y_n`, so R(z)=1+z; stable if |1+z|<1 (boundary labeled separately).

**Difficulty.** L1 real negative λ; L2 choose h range; L3 complex z; L4 distinguish method stability from exact-system stability.

**Misconceptions/constraints.** Complex arithmetic exact-friendly. Do not call boundary asymptotically stable.

**Feedback.** Compare exact decay and numerical amplification.

**Examples.**

1. λ=−1,h=.5 → R=.5, stable. L1.
2. λ=−10,h=.3 → R=−2, magnitude2, unstable though exact solution decays. L2.
3. real λ<0 requires 0<h<−2/λ for Euler absolute stability. L3.

**Validation/coverage.** Stability-function geometry and repeated-step simulation.

### Family `method_step_choice`

**Task.** Choose a method/step adjustment satisfying a stated accuracy, cost, or stability constraint from supplied evidence.

**Response/template.** Single choice with reason: `Which option best meets {constraint}?`

**Derivation.** Apply declared order/error estimate and stability-region requirements; compare slope-evaluation cost.

**Difficulty.** L1 reduce h; L2 order/cost tradeoff; L3 stability dominates; L4 no option sufficient.

**Misconceptions/constraints.** No universal “RK4 always best.” All needed error/stability data supplied.

**Feedback.** Evaluate each constraint separately.

**Examples.**

1. Euler unstable because hλ=−3; reducing h below2/|λ| addresses stability. L2.
2. second-order method halving h predicts ~4× smaller global error in regime. L2.
3. strict budget of two f evaluations permits one Heun step or two Euler steps; accuracy conclusion needs supplied estimates. L3.

**Validation/coverage.** Constraint-satisfaction oracle over method metadata.

### Cross-family progression

One Euler step precedes traces. Heun/midpoint follow Euler; RK4 stays one-step and later. Error definitions precede method comparison. Absolute stability is an advanced concept taught with the scalar test equation before tradeoff questions.

## 12. Category: Boundary-value and series extensions

### Category purpose

Provide a bounded extension beyond IVPs: recognize two-point solution constraints and generate local series coefficients without attempting general BVP or special-function solvers.

### Learn

A BVP can have zero, one, or many solutions even when the condition count matches order. A power-series solution substitutes `Σa_n(x−x0)^n`, aligns powers, and derives a recurrence. Ordinary and regular-singular points require different starting forms.

### Prerequisites

Higher-order linear equations; power series and coefficient matching.

### Category boundaries

This optional category excludes PDE eigenproblems, general Sturm–Liouville theory, numerical shooting, and unbounded special-function computation.

### Subcategories

1. Linear two-point BVPs
2. Eigenvalue-like boundary parameters
3. Ordinary-point series
4. Frobenius recognition

### Family `linear_bvp_solve_count`

**Task.** Determine whether a simple second-order linear BVP has zero, one, or infinitely many solutions and find them when unique.

**Response/template.** Status plus constants/formula: `Solve/classify {bvp}.`

**Derivation.** Find general solution, apply both endpoint conditions as a 2×2 linear system, classify rank/consistency.

**Difficulty.** L1 y''=0 unique; L2 trig resonance no/many; L3 nonzero boundary data; L4 parameter endpoint.

**Misconceptions/constraints.** Conditions at distinct points. Distractors assume two conditions always imply unique.

**Feedback.** Show boundary-condition coefficient matrix and ranks.

**Examples.**

1. y''=0,y(0)=0,y(1)=1 → y=x, unique. L1.
2. y''+y=0,y(0)=0,y(π)=0 → y=C sin x, infinitely many. L2.
3. same equation y(0)=0,y(π)=1 → no solution. L2.

**Validation/coverage.** Exact solution-space boundary matrix and rank classification.

### Family `boundary_parameter_eigenvalue`

**Task.** Find parameter values permitting nontrivial solutions in a simple homogeneous BVP.

**Response/template.** Parameter set/mode: `For {bvp_with_lambda}, which λ admit a nonzero solution?`

**Derivation.** Solve sign cases λ>0,=0,<0 under displayed parameterization; impose boundaries and find exact frequencies.

**Difficulty.** L1 λ=μ² form supplied; L2 derive nπ/L; L3 distinguish trivial solution; L4 boundary condition variant.

**Misconceptions/constraints.** Initial version uses `y''+λy=0`, Dirichlet on `[0,L]`. n positive integer; no normalization claim.

**Feedback.** Show boundary determinant/sine condition.

**Examples.**

1. y(0)=y(π)=0 → λ=n²,n=1,2,... for nontrivial sin(nx). L2.
2. λ=0 yields y=Ax+B; both zero boundaries force trivial solution. L2.
3. λ<0 gives hyperbolic/exponential form and only trivial under two Dirichlet conditions. L3.

**Validation/coverage.** Exact boundary substitution across sign cases.

### Family `power_series_index_shift`

**Task.** Differentiate and reindex a power series so terms use a common power.

**Response/template.** Coefficient expression/index bounds: `Rewrite {series_derivative} in powers of (x−x0)^n.`

**Derivation.** Differentiate termwise and shift indices exactly.

**Difficulty.** L1 first derivative; L2 second; L3 multiply by x−x0; L4 combine terms.

**Misconceptions/constraints.** Formal/local series context stated. Distractors keep wrong starting index or factorial factor.

**Feedback.** Map old index to new index.

**Examples.**

1. y=Σ a_n x^n → y'=Σ_{n=0}∞(n+1)a_{n+1}x^n. L1.
2. y''=Σ_{n=0}∞(n+2)(n+1)a_{n+2}x^n. L2.
3. x y'=Σ_{n=1}∞ n a_n x^n. L2.

**Validation/coverage.** Coefficient extraction against finite polynomial truncations.

### Family `power_series_recurrence`

**Task.** Derive/use a coefficient recurrence for a linear ODE at an ordinary point.

**Response/template.** Recurrence plus requested coefficients: `Assume y=Σa_nx^n for {ode}; derive {recurrence}.`

**Derivation.** Substitute series, align powers, set each coefficient to zero, solve for highest-index coefficient.

**Difficulty.** L1 y'=ay; L2 y''+y=0; L3 polynomial coefficient; L4 compute parity subsequences.

**Misconceptions/constraints.** Request finite first coefficients; no need to name special functions.

**Feedback.** Aligned coefficient table and initial free coefficients.

**Examples.**

1. y'=y → `(n+1)a_{n+1}=a_n`. L1.
2. y''+y=0 → `a_{n+2}=−a_n/[(n+2)(n+1)]`. L2.
3. with a0=1,a1=0, recurrence gives 1,0,−1/2,0,1/24,... (cos series). L3.

**Validation/coverage.** Substitute truncated coefficients and verify residual order.

### Family `series_initial_coefficients`

**Task.** Map initial conditions to free series coefficients and compute a truncated approximation.

**Response/template.** Coefficient list/polynomial: `Using {recurrence,conditions}, find through degree {N}.`

**Derivation.** `a0=y(0)`, `a1=y'(0)`, generally `a_k=y^(k)(0)/k!`; propagate recurrence.

**Difficulty.** L1 a0/a1; L2 degree4; L3 expansion center x0; L4 approximate value/error bound supplied.

**Misconceptions/constraints.** N≤8. Distractors omit factorial or confuse derivative value with coefficient.

**Feedback.** Separate derivative data and coefficient scaling.

**Examples.**

1. y(0)=2 → a0=2. L1.
2. y'(0)=3 → a1=3. L1.
3. y''+y=0,y(0)=1,y'(0)=0 through x⁴ → `1−x²/2+x⁴/24`. L2.

**Validation/coverage.** Derivative/coefficient identity and recurrence residual.

### Family `ordinary_regular_singular_classify`

**Task.** Classify a point of `y''+P(x)y'+Q(x)y=0` as ordinary, regular singular, or not regular singular.

**Response/template.** Classification plus limiting functions: `Classify x0={value} for {ode}.`

**Derivation.** Ordinary if P,Q analytic; regular singular if `(x−x0)P` and `(x−x0)²Q` analytic; otherwise irregular under bounded rational profile.

**Difficulty.** L1 ordinary; L2 simple poles; L3 pole order too high; L4 normalize leading coefficient first.

**Misconceptions/constraints.** Rational coefficients with clear pole orders. “Analytic” tested through factor cancellation in this grammar, not proof.

**Feedback.** Normalize and multiply by required powers.

**Examples.**

1. y''+xy'+y=0 at0 → ordinary. L1.
2. y''+(1/x)y'+(1/x²)y=0 at0 → regular singular. L2.
3. y''+(1/x²)y'=0 at0 → not regular singular because xP=1/x remains singular. L3.

**Validation/coverage.** Rational pole-order oracle after exact cancellation.

### Family `frobenius_indicial_setup`

**Task.** Form the indicial equation/lowest-power coefficient for a reviewed regular-singular ODE.

**Response/template.** Indicial polynomial/root choice: `Using y=Σa_nx^{n+r}, find the indicial equation.`

**Derivation.** Substitute Frobenius form, identify lowest power, set coefficient to zero.

**Difficulty.** L1 Euler–Cauchy; L2 one additional analytic term; L3 roots difference issue recognition; L4 no full special-function expansion.

**Misconceptions/constraints.** Setup/root recognition only in v1; a0≠0. Distractors set r=0 prematurely or use ordinary-series index.

**Feedback.** Track lowest exponent and its coefficient.

**Examples.**

1. `x²y''+xy'−y=0` → r(r−1)+r−1=r²−1=0. L2.
2. roots r=±1 give leading behaviors x and x^{-1}. L2.
3. a0=0 is not allowed as the Frobenius leading coefficient; it would shift the starting index. L3.

**Validation/coverage.** Symbolic lowest-power extraction and direct leading-term substitution.

### Cross-family progression

BVP rank behavior precedes boundary eigenparameters. Series reindexing precedes recurrences and initial coefficients. Ordinary/regular-singular classification precedes Frobenius setup. This category is optional and must not gate core first-order/linear ODE mastery.

## 13. Topic-level progression

### Recommended introduction order

1. Variables/notation, order, degree, linearity, and IVP/BVP recognition.
2. Explicit solution verification and intervals.
3. Local slopes, direction fields, equilibria, phase lines, and stability.
4. Separable recognition, integration, lost equilibria, and IVPs.
5. First-order linear equations and integrating factors.
6. Exact equations, then bounded substitution methods.
7. First-order modeling and dimensional checks.
8. Homogeneous second-order constant-coefficient equations and conditions.
9. Nonhomogeneous forcing, trial selection, resonance, and IVPs.
10. Laplace-transform IVPs with steps/impulses.
11. First-order systems and phase portraits.
12. Numerical methods and error/stability.
13. Optional BVP and series extensions.

### Dependency map

```text
notation/classification --> solution verification --> interval/domain
          |                         |
          +--> slope fields --> autonomous phase lines --> stability
          |
          +--> separable --> first-order linear/exact/substitution
                                      |
                                      +--> modeling
                                      |
characteristic roots --> homogeneous higher order
                                      |
                         nonhomogeneous forcing --> Laplace IVPs
                                      |
small matrix/eigen review --> first-order systems --> phase portraits
                                      |
local slopes ------------------------+--> numerical methods

higher-order linear --> optional BVP
power-series algebra --> optional series/Frobenius
```

### Difficulty bands

| Band | Reasoning | Typical item |
|---|---|---|
| L1 Recognition/direct substitution | one definition or formula | order, slope, Euler step, simple root |
| L2 One method | a standard transformation/solution | separable IVP, integrating factor, root-pattern basis |
| L3 Method selection and conditions | choose path, preserve branches/data | lost equilibrium, resonance, phase stability |
| L4 Representation transfer | equation↔field↔solution↔system/transform | implicit verification, Laplace step input, phase portrait |
| L5 Applicability/diagnosis | theorem/method conditions or nonunique behavior | uniqueness inconclusive, BVP ranks, stability region |

Difficulty must remain conceptually diagnostic. Long partial fractions or twenty Euler rows are never L5.

### Interleaving

- Interleave classification with method selection so labels remain operational.
- Pair every symbolic solution family with periodic verification/interval items.
- Interleave phase-line predictions with exact autonomous solutions only after each is learned independently.
- Mix separable and linear equations that overlap to teach method economy.
- Pair nonresonant and resonant trial selection.
- Pair scalar second-order and equivalent first-order system representations.
- Pair exact/reference trajectories with numerical approximations without making closed form seem mandatory.
- Keep Laplace shifts/impulses separate until basic transform/IVP algebra is mastered.
- Do not mix BVP/Frobenius questions into a beginner session by default.

### Completion milestones

- **First-order fluency:** Categories 2–6 core methods and qualitative behavior.
- **Linear ODE fluency:** Categories 7–9.
- **Applied systems fluency:** modeling, systems, and numerical methods.
- **Extended first course:** optional BVP/series category.

No broad aggregate score skips the method-specific prerequisites.

## 14. Adaptive practice guidance

### Mastery dimensions

Track:

- category, family, method;
- order and linear/nonlinear status;
- explicit/implicit representation;
- IVP/BVP/none;
- autonomous/nonautonomous;
- symbolic/graphical/numerical/system representation;
- exact/approximate answer;
- interval/domain complexity;
- root pattern/forcing family/resonance multiplicity;
- CT scalar/vector dimension;
- theorem/method applicability;
- misconception ID;
- scaffold and latency.

### Misconception routing

| Error | Likely model | Follow-up |
|---|---|---|
| order taken from power of y | ordinary polynomial degree confused with derivative order | derivative-term highlighting |
| variable coefficient called nonlinear | coefficients thought must be constants | linear examples with varied a_k(x) |
| degree assigned to sin(y') | all equations assumed derivative-polynomial | defined/undefined degree contrast |
| autonomous confused with homogeneous | labels merged | multi-label comparison |
| candidate checked only at IC | condition seen as proof of solution | residual plus IC two-column check |
| maximal interval crosses singularity | formula treated as globally valid | connected-component domain item |
| slope field differentiated again | f seen as solution not derivative | point substitution/tangent |
| equilibrium classified by value sign | y* sign substituted for arrow direction | phase-line arrows both sides |
| theorem hypotheses fail ⇒ no solution | sufficient condition treated necessary | “not guaranteed” examples |
| y=0 lost in separation | divided factor forgotten | lost-equilibrium audit immediately |
| absolute value omitted in ∫dy/y | log branch collapsed | `ln|y|` and branch item |
| two constants retained after separation | integration constants treated independent | consolidate C1−C2 |
| integrating factor `e^P` | integration step omitted | μ'/μ=P verification |
| exactness compares M_x,N_y | cross partials swapped | gradient diagram |
| potential omits g(y) | integration constant treated scalar only | correction-function item |
| Bernoulli uses v=y^n | substitution exponent memorized wrongly | derive v' factor |
| tank outflow uses initial concentration | state not updated | rate-table trace |
| repeated root duplicates e^{rx} | independence ignored | Wronskian/multiplicity pair |
| complex root loses e^{αx} | real/imaginary parts split incorrectly | Euler-form reconstruction |
| conditions applied only to y_h | forcing response omitted from data | total-response condition table |
| trial omits sine partner/lower terms | derivative family not closed | derivative-closure selection |
| resonance always multiplies x once | multiplicity ignored | root/forcing overlap count |
| Laplace derivative omits initial terms | bilateral rule imported | unilateral derivative ladder |
| delayed f not shifted internally | step theorem half-applied | local time τ=t−a |
| matrix system multiplied elementwise | vector/matrix operation weak | one field-evaluation item |
| eigenvalues alone give rotation direction | orientation over-inferred | evaluate vector at test point |
| nullcline called equilibrium | one zero component mistaken for both | intersection and vector direction |
| Euler slope evaluated at new point | explicit/implicit update conflated | current-row arrows |
| same initial y reused each Euler row | state update missed | first erroneous row diagnosis |
| smaller error proves higher order | one trial overgeneralized | error-ratio data across h |
| exact stable ⇒ Euler stable any h | method stability ignored | test equation amplification |
| two BVP conditions guarantee unique | IVP intuition transferred | boundary matrix rank contrast |
| series coefficient equals derivative | factorial omitted | a_n=y^(n)(0)/n! |

### Adaptive actions

- After a method-selection error, present two minimal equations differing only in the decisive feature.
- After a late algebra error, preserve method-level credit and isolate the algebraic step.
- After a lost-solution error, immediately ask constant-solution substitution before another full solve.
- After interval errors, keep the same solution but vary initial point across singularity components.
- After qualitative-only errors, move between phase line and explicit solution without increasing algebra.
- Slow but correct work retains level with shorter coefficient arithmetic.
- Failed theorem applicability triggers hypothesis classification, not an easier numeric problem.
- Numerical-method errors are diagnosed at the first wrong stage/row.
- A checker-equivalence failure never updates misconception mastery.

### Mastery criteria

Provisional family mastery requires:

- three structurally different correct instances;
- success in direct and inverse/verification modes where applicable;
- correct interval/condition handling at least once;
- no primary misconception across two spaced reviews;
- success without optional method label/scaffold;
- reuse in a composed IVP/model/system problem.

Method selection is tracked separately from arithmetic execution.

## 15. Feedback and worked-solution design

### Feedback layers

1. Field-level verdict.
2. Decisive definition/method criterion.
3. First incorrect algebra/logic transition.
4. Full worked solution with verification.
5. Contrast to the recognized misconception.

### Worked-solution templates

- **Classification:** normalize safely, highlight derivative structure, apply each predicate.
- **Verification:** derivative table, ODE residual, conditions, interval.
- **Qualitative:** null/zero slopes, sign table/arrows, trajectory conclusion.
- **Separable:** factor, retain equilibria, separate, integrate, apply data, interval, substitute.
- **Linear:** normalize, μ, product derivative, integrate, data, check.
- **Exact:** cross partials, potential, correction function, implicit relation.
- **Higher order:** characteristic polynomial, roots/multiplicity, basis, constants, residual.
- **Forcing:** y_h, base trial, resonance multiplier, coefficients, total conditions.
- **Laplace:** transform term table, solve Y, partial fractions/shift, inverse, event/IC check.
- **Systems:** state/eigen decomposition, modal evolution, component/initial check.
- **Numerical:** stage/row table, approximation, error reference.
- **BVP/series:** boundary matrix rank or aligned coefficient powers.

### Example feedback

For missing y=0 after separating y'=xy:

> Dividing by y restricted the work to y≠0. Substitute the excluded candidate into the original equation: y=0 gives y'=0 and xy=0, so it is also a solution.

For `y'+x y=1` classified nonlinear:

> The coefficient x depends only on the independent variable. y and y' still appear to the first power and are not multiplied together, so the equation is linear.

For `A cos2x` chosen as trial under y''+4y=cos2x:

> cos2x and sin2x already span the homogeneous solution because ±2i are characteristic roots. Multiply the complete sinusoidal trial by x.

For Euler λ=−10,h=.3 called stable:

> The exact solution decays, but Euler multiplies each step by 1+hλ=−2. Its magnitude is 2, so numerical errors grow.

## 16. Rendering, interaction, and accessibility

### Required renderers/editors

- equation layout with derivative-token highlighting;
- structured method/property selector;
- explicit/implicit solution and interval editor;
- direction field with semantic grid;
- solution-curve overlay;
- one-dimensional phase line;
- sign/isocline table;
- characteristic-root and solution-basis cards;
- unilateral Laplace term table;
- planar vector field/nullclines/phase portrait;
- numerical stage and mesh table;
- boundary-condition matrix;
- power-series coefficient grid.

### Graph requirements

- Axes identify variables/units and increasing direction.
- Direction segments have accessible numeric slope table.
- Undefined slopes are marked, not silently clipped.
- Equilibrium/nullcline/trajectory styles differ by shape/pattern and labels.
- Arrows show forward independent-variable direction.
- Exact and numerical curves use distinguishable markers without relying on color.
- Singularities/asymptotes and excluded boundaries are explicit.
- Phase portraits do not imply quantitative trajectories from decorative curves.
- Every graph has a complete text/table alternative.

### Input requirements

- Classification/property responses use semantic controls.
- Intervals use structured endpoint/inclusion controls.
- Arbitrary constants use named slots and may be reordered/renamed semantically.
- Root/multiplicity answers use cards.
- Piecewise/step answers use interval rows.
- Numerical tables support keyboard navigation and field-level retry.
- Drag/drop alternatives include move buttons and screen-reader ordering.

## 17. Implementation architecture

### Offline contract

The app is one standalone HTML/JavaScript/CSS page. It uses no backend, remote CAS, compiler, live dataset, network call, microphone, or real sensor. All models/data are generated locally and synthetic.

### Exact scalar/algebra layer

Use arbitrary-precision rational arithmetic and a bounded exact algebraic/complex layer:

```text
Rational(BigInt, positive BigInt)
Quadratic(a+b*sqrt(d))
ComplexExact(re,im)
Polynomial(coefficients, variable)
RationalFunction(numerator, denominator, exclusions)
Interval(endpoints, openness)
```

JavaScript `Number` is not the oracle for polynomial roots, coefficient systems, Wronskians, BVP rank, or series recurrences.

### ODE semantic types

```text
DependentFunction(name, independent, order)
ODE(leftAST, rightAST, normalizedForm, domain)
Condition(kind, point, derivativeOrder, value)
ExplicitSolution(expression, interval)
ImplicitSolution(relation, branchMetadata)
DirectionField(rhs, grid)
AutonomousPhaseLine(equilibria, intervals, signs)
MethodCertificate(type, transformations)
LinearOperator(coefficients, forcing)
CharacteristicData(polynomial, roots, multiplicities)
LaplaceExpression(pairs, shifts, initialData)
VectorField(components)
StateSystem(matrixOrAST, forcing)
NumericalMethod(butcherTable, order, stabilityFunction)
```

### Bounded symbolic engine

Implement only reviewed operations:

- exact differentiation;
- curated antiderivative lookup/composition;
- polynomial/rational normalization/factorization for generated degrees;
- exact small linear systems;
- implicit total differentiation;
- interval/domain propagation;
- method predicates and transformation certificates;
- characteristic solution synthesis;
- small partial fractions;
- Laplace pair/property lookup;
- Jacobian and exact 2×2 eigen classification;
- power-series coefficient extraction.

Never call a general symbolic “solve ODE” routine at runtime.

### Independent validation

Primary solutions are generated from method templates. A separate verifier:

- differentiates and substitutes final candidates;
- checks every condition and interval;
- samples guarded points only after exact residual checks;
- validates qualitative metadata against derivative signs;
- compares numerical methods against independent high-precision reference integration for bounded displays.

### Distractor transforms

Named IDs include:

- `order_from_y_power`;
- `variable_coefficient_nonlinear`;
- `degree_always_defined`;
- `autonomous_as_homogeneous`;
- `verify_condition_only`;
- `interval_crosses_singularity`;
- `differentiate_direction_rhs`;
- `equilibrium_value_sign`;
- `theorem_failure_means_false`;
- `separation_loses_equilibrium`;
- `log_without_absolute`;
- `two_integration_constants`;
- `integrating_factor_without_integral`;
- `exact_cross_partials_swapped`;
- `potential_missing_other_function`;
- `bernoulli_wrong_power`;
- `outflow_initial_concentration`;
- `repeated_root_duplicate`;
- `complex_root_missing_envelope`;
- `condition_on_homogeneous_only`;
- `trial_incomplete_family`;
- `resonance_once_only`;
- `laplace_missing_initial`;
- `delay_only_step_shift`;
- `matrix_elementwise`;
- `nullcline_is_equilibrium`;
- `euler_new_point_slope`;
- `euler_reuse_initial`;
- `error_single_trial_order`;
- `exact_stability_equals_method_stability`;
- `bvp_count_means_unique`;
- `series_derivative_no_factorial`.

Each choice stores its transform ID. If equivalent to correct answer for the instance, it is rejected.

### Generation strategy

- Seeded, reproducible generation.
- Generate backward from a verified solution/root/phase pattern when possible.
- Store method certificate and transformation trail.
- Favor small rational/factorable parameters.
- Balance positive/negative rates, stable/unstable, distinct/repeated/complex roots, resonant/nonresonant, existence/uniqueness outcomes, and solution counts.
- Suppress recent semantic fingerprints.
- Reject accidental simplifications that change intended method/difficulty.

### Localization

Glossary must distinguish:

- order versus degree;
- linear homogeneous versus scale-homogeneous;
- autonomous versus homogeneous;
- general/particular/singular solution;
- initial versus boundary condition;
- stable equilibrium versus stable numerical method;
- exact equation versus exact numeric answer;
- integrating factor versus characteristic factor;
- phase line versus phase portrait;
- slope field versus solution curve.

Use complete localized templates and protect mathematical tokens.

## 18. Automated validation

### Per-instance checks

- all placeholders resolved;
- notation binds variables/derivatives unambiguously;
- classification predicates agree after normalization;
- solution residual is exactly zero under declared form;
- every condition is satisfied;
- interval lies within equation/solution domain;
- implicit branches meet `F_y` requirements where used;
- lost/extraneous candidate audits complete;
- method certificate transforms back to original equation;
- choice answer unique after semantic normalization;
- graph/table/answer share semantic source;
- numerical tolerance and rounding explicit;
- applied units/assumptions valid.

### Property/differential tests

- notation translation round trips;
- order/degree/linearity against independently constructed AST predicates;
- explicit/implicit solution substitution;
- maximal interval connected components;
- direction-field signs versus RHS;
- phase-line equilibria/sign/stability;
- method selection and transformed-equation equivalence;
- separated solution differentiation and equilibrium retention;
- integrating factor identity;
- exact potential gradient;
- Bernoulli/scale substitution round trip;
- modeling dimension and conservation balance;
- characteristic polynomial↔ODE round trip;
- homogeneous bases residual/Wronskian;
- undetermined trial closure/resonance multiplicity;
- nonhomogeneous residual and IC;
- Laplace forward/inverse algebra and event jumps;
- scalar↔state elimination;
- vector solution/Jacobian/eigen classification;
- numerical stages versus Butcher tableaux;
- error-order synthetic ratios and stability functions;
- BVP boundary-matrix rank;
- series recurrence residual order.

### Fuzz targets

Before release:

- 100,000 classification/verification/interval cases;
- 50,000 qualitative field/phase-line cases;
- 100,000 first-order method/solution cases;
- 25,000 model/unit cases;
- 100,000 characteristic/nonhomogeneous cases;
- 50,000 Laplace cases;
- 50,000 systems/phase-portrait cases;
- 100,000 numerical-stage/trace/error cases;
- 25,000 BVP/series cases;
- exhaustive curated lost-solution, singularity, resonance, nonuniqueness, and theorem-inapplicability corpus.

### Visual validation

- semantic slopes match rendered segments;
- equilibria/nullclines/arrow signs align;
- solution curves pass initial points and respect uniqueness barriers;
- singularities and intervals render;
- phase-portrait direction agrees with vector field;
- numerical mesh/stage points match tables;
- screen-reader alternatives are sufficient;
- localization remains legible at supported sizes.

## 19. Coverage requirements

Default mixed practice after prerequisites:

| Area | Share |
|---|---:|
| Classification/verification | 12% |
| Qualitative first order | 11% |
| Separable equations | 10% |
| Other first-order methods | 13% |
| Modeling | 8% |
| Higher-order homogeneous | 12% |
| Nonhomogeneous forcing | 10% |
| Laplace IVPs | 7% |
| Systems/phase plane | 8% |
| Numerical methods | 7% |
| BVP/series extensions | 2% |

Within eligible sessions:

- method-selection items appear at least every eight solving items;
- at least one quarter of symbolic solutions include interval/branch considerations;
- negative/non-applicable classification outcomes remain common;
- qualitative questions do not require closed-form solving;
- root patterns balance distinct, repeated, and complex;
- resonance occurs often enough to be mastered but below half of forcing items;
- systems balance component calculation and qualitative interpretation;
- numerical work includes method stability/error, not only arithmetic tables;
- optional extensions never dominate unless selected explicitly.

## 20. Stable navigation and delivery priorities

### Navigation

1. Recognize & Verify
2. Fields & Phase Lines
3. Separable Equations
4. First-Order Methods
5. Modeling
6. Higher-Order Linear
7. Forcing & Resonance
8. Laplace IVPs
9. Systems & Phase Portraits
10. Numerical Methods
11. Boundary & Series

### Recommended v1 slice

First release:

- Categories 2–5 in full except optional exact integrating-factor extension;
- exponential/logistic/cooling/mixing models;
- characteristic roots and all second-order homogeneous patterns;
- trial selection, resonance, and basic forced IVPs;
- basic Laplace derivatives/inversion/IVPs;
- scalar-to-system and linear phase classification;
- Euler/Heun steps and error basics.

Second increment:

- variation of parameters;
- step/impulse Laplace IVPs and convolution;
- nonlinear nullclines/linearization;
- RK4/stability-region practice;
- BVP and power-series extensions.

### Poor dynamic fits

Do not build families for:

- named-equation trivia without solving structure;
- arbitrary substitution guessing;
- long integration/partial-fraction drills;
- free-form existence proofs;
- qualitative sketches graded by pixels;
- high-order determinant arithmetic;
- real-world prediction from current data;
- arbitrary CAS-generated special functions.

## 21. Reference profile

Pin edition/section metadata for development fixtures. Suitable standard pedagogical references include:

- Boyce, DiPrima, and Meade, *Elementary Differential Equations and Boundary Value Problems*;
- Edwards and Penney, *Differential Equations and Boundary Value Problems*;
- Zill, *A First Course in Differential Equations with Modeling Applications*;
- Tenenbaum and Pollard, *Ordinary Differential Equations*;
- Hairer, Nørsett, and Wanner for numerical-method reference behavior where relevant.

The app's explicit conventions override reference variation. No reference material is downloaded at runtime.

## 22. Topic-level quality checklist

- [ ] Every family trains a repeatable operation or decision.
- [ ] Every family has at least three instantiated examples.
- [ ] Variables and derivative notation are unambiguous.
- [ ] Order, degree, linearity, autonomy, and homogeneity use pinned definitions.
- [ ] “Homogeneous” always has a qualifier where ambiguous.
- [ ] Solution checks include equation, conditions, and interval.
- [ ] Implicit solutions are accepted and branch-checked.
- [ ] Lost and extraneous solutions are audited.
- [ ] Maximal intervals are connected and exclude singularities.
- [ ] Direction fields derive directly from f(x,y).
- [ ] Stability classifications use arrow/eigenvalue conditions correctly.
- [ ] Failed sufficient theorem hypotheses yield “not guaranteed,” not an automatic negation.
- [ ] Separation retains equilibrium solutions.
- [ ] Integrating factors satisfy μ'=Pμ.
- [ ] Exact potentials reproduce both M and N.
- [ ] Substitution methods transform back to the original ODE.
- [ ] Modeling equations are dimensionally and semantically balanced.
- [ ] Characteristic multiplicities produce independent basis functions.
- [ ] Equivalent homogeneous bases/particular solutions are accepted.
- [ ] Resonance multiplier equals overlap multiplicity.
- [ ] Conditions apply to total nonhomogeneous solution.
- [ ] Laplace exercises use the unilateral convention and include initial terms.
- [ ] Step/impulse solutions satisfy jump behavior.
- [ ] Scalar and state-system forms eliminate to each other.
- [ ] Nullclines are not automatically equilibria.
- [ ] Nonhyperbolic linearization is reported inconclusive.
- [ ] Numerical stages use the displayed convention/current state.
- [ ] Method stability is distinct from exact-system stability.
- [ ] BVP solution count comes from rank/consistency.
- [ ] Series recurrences and initial coefficients include correct index/factorial factors.
- [ ] Difficulty rises through method/representation/applicability, not arithmetic length.
- [ ] Distractors are named misconception transforms and unique.
- [ ] Graphs/tables/answers share semantic data and are accessible.
- [ ] Runtime uses no general CAS/backend/network service.
- [ ] Property/fuzz/visual validation covers declared boundaries.
- [ ] Repeated practice improves method selection, verification, and qualitative reasoning.
