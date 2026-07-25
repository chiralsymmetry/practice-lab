# Calculus — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, expression-parser/checker, graph-renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Calculus

### Topic goal

Develop fluent single-variable calculus reasoning: connect limits, local rate of change, accumulation, and infinite approximation; select and execute the appropriate symbolic or numerical method; interpret derivatives and integrals from formulas, graphs, and tables; and check answers against domains, signs, units, and qualitative behavior.

The app should train mathematical decisions, not only memorized templates. A learner should become better at seeing structure—composition, product, quotient, local behavior, accumulation, error, and convergence—while working within a deliberately bounded expression language.

### Audience and prerequisites

The learner is expected to know:

- arithmetic with fractions and powers;
- algebraic simplification, factoring, rational expressions, and equation solving;
- functions, composition, inverse notation, and interval notation;
- Cartesian graphs, slope, and basic trigonometry;
- exponentials and logarithms;
- sigma notation before advanced numerical integration and series.

The early “Functions and Rates” category diagnoses prerequisites but is not a full precalculus course.

### Scope

The topic includes:

- function domains, composition, difference quotients, and average rate of change;
- finite, one-sided, infinite, and infinite-input limits, including special trigonometric limits and controlled L'Hôpital cases;
- continuity and removable/jump/infinite discontinuities;
- derivative definition and differentiation of powers, sums, products, quotients, compositions, trigonometric, exponential, and logarithmic functions;
- implicit differentiation and tangent/normal lines;
- rates of change, motion, the Mean Value Theorem, critical points, monotonicity, extrema, concavity, inflection, optimization, related rates, linearization, and Newton iteration;
- antiderivatives, definite integrals, signed area, Riemann/trapezoid/midpoint sums, the Fundamental Theorem of Calculus, average value, and accumulation functions;
- controlled substitution, integration by parts, simple partial fractions, and selected improper integrals;
- verifying differential-equation solutions, slope fields, Euler's method, separable equations, and exponential growth/decay;
- sequence limits, geometric series, selected convergence tests, alternating-series error, power-series intervals, and Taylor polynomials/remainders.

The intended ceiling is a strong single-variable Calculus I–II fluency app. It includes more than polynomial differentiation but does not attempt the full breadth of every university sequence.

### Exclusions

Do not include:

- multivariable/vector calculus, partial derivatives, multiple/line/surface integrals, Green/Stokes/divergence theorems, or constrained optimization in several variables;
- rigorous epsilon–delta or epsilon–`N` proofs, formal real analysis, measure theory, generalized functions, or proof grading;
- parametric/polar calculus, arc length, surfaces of revolution, centers of mass, hydrostatic force, or advanced applications in the initial version;
- inverse-trigonometric and hyperbolic differentiation/integration, trigonometric substitution, reduction formulas, Laplace transforms, Fourier series, or second-order differential equations;
- arbitrary symbolic integration, general algebraic factorization, branch-cut reasoning, complex-valued calculus, or a general-purpose computer algebra system;
- expressions with unsupported special functions, piecewise symbolic answers, arbitrary parameters, nested absolute values, or variable exponents such as `x^x` unless a later family explicitly adds them;
- free-form derivations whose correctness requires natural-language proof judgment;
- physical claims that rely on unstated models; applied questions must provide the relationship and units needed.

### Core conventions

- Calculus is over the real numbers.
- Unless stated otherwise, the independent variable is `x`.
- Intervals use standard notation: `(a,b)`, `[a,b]`, unions with `∪`, and `∞` is never included with a square bracket.
- `f'(a)` is the derivative value, not a function; `f'(x)` is the derivative function.
- `lim_(x→a⁻)` and `lim_(x→a⁺)` are left/right limits. A finite two-sided limit exists only when both one-sided limits exist and agree.
- `∞` and `−∞` are limit behaviors, not real-number answers. “DNE” is distinct from an infinite limit unless the prompt asks only whether a finite limit exists.
- A discontinuity may be removable, jump, or infinite under the supported models.
- Definite integrals are signed net accumulation. Geometric area is non-negative and may require splitting at zeros.
- Indefinite integrals represent families of antiderivatives and require an arbitrary additive constant when the prompt says “general antiderivative.”
- Logarithm means natural logarithm `ln` unless another base is explicitly written.
- Trigonometric arguments are in radians. Degree-mode calculus questions are excluded.
- Numerical answers state a rounding requirement and keep unrounded intermediates.

### Controlled expression language

The app must not promise arbitrary mathematical input. Display a concise syntax reference beside every typed-expression field.

Supported lexical forms:

- integer and rational/terminating-decimal constants;
- declared variables shown by the prompt, normally one such as `x` or `t`; implicit-differentiation prompts may declare both `x` and `y`;
- constants `pi`/`π` and `e`;
- operators `+`, `-`, `*`, `/`, `^`;
- parentheses;
- functions `sin(...)`, `cos(...)`, `tan(...)`, `exp(...)`, `ln(...)`, `sqrt(...)`, and `abs(...)`;
- a reserved integration constant `C` only where permitted.

Normative parsing rules:

- `^` means exponentiation; `**` is not required.
- Exponentiation binds tighter than unary minus, so `-x^2=-(x^2)`.
- Explicit multiplication is canonical. The parser should also accept unambiguous `2x`, `3sin(x)`, and adjacent parenthesized factors, but rendered syntax always uses `*`.
- Function parentheses are required: accept `sin(x)`, not bare `sin x`.
- Whitespace is ignored.
- Division is binary and left-associative; learners should use parentheses for a compound numerator/denominator.
- Identifiers not declared in the prompt are rejected rather than silently treated as constants.
- `C` is accepted only as a top-level additive arbitrary constant in general-antiderivative answers.
- Equation-answer wrappers may accept `y={expression in x}` for a line or solution, but the right-hand expression still uses the controlled AST.

Generated expression AST nodes:

```text
Rational(p,q)             q>0, gcd(|p|,q)=1
Variable(name)
NamedConstant(pi|e)
Add(term...)
Multiply(factor...)
Power(base, rationalExponent)
Function(sin|cos|tan|exp|ln|sqrt|abs, argument)
```

Generator restrictions:

- polynomial exponents are integers in `[-6,8]`, with negative exponents used only where the domain is explicit;
- general rational exponents are drawn from `{1/2, 1/3, 2/3, 3/2}` and use domain-safe templates;
- generated nesting depth is at most `4`, and learner answers above a documented complexity budget are rejected politely;
- generated expressions are single-variable except for reviewed implicit relations; implicit derivative answers use exact normalization in `x,y` rather than the single-variable numerical fallback;
- `abs` occurs primarily in domain, graph, and piecewise-limit choice questions; its derivative at corners is never requested as a single value;
- denominators, `ln`, `sqrt`, and `tan` carry domain constraints in the semantic AST.

### Domain contract

Expression equivalence is always relative to a declared real domain.

- A denominator must be nonzero.
- `ln(u)` requires `u>0`.
- `sqrt(u)` requires `u≥0`; when in a denominator it requires `u>0`.
- `tan(u)` requires `cos(u)≠0`.
- Even-denominator rational powers use their real principal value on their supported domain.
- Cancelling a factor may change the written formula at a hole. A limit question may use that cancellation locally, but a function-equivalence checker must preserve/examine the original domain.
- Generated evaluation/sample points must remain a safe distance from singularities and interval boundaries.

Every instance stores the intended domain. Feedback must distinguish “same values where both are defined” from “same function with the same domain” when that distinction matters.

### Symbolic answer checking

Checking is layered. Passing a weak layer must not override a contradiction from a stronger one.

1. **Parse and validate.** Reject unsupported syntax, undeclared identifiers, excess complexity, or an answer undefined on the required domain.
2. **Exact structural/canonical check.**
   - Flatten/sort associative sums and products.
   - Fold rational constants and normalize signs.
   - Expand/collect rational-coefficient polynomials.
   - Normalize rational functions by polynomial gcd with a separate domain record.
   - Apply a finite reviewed identity set: `sin²x+cos²x=1`, odd/even signs, `exp(a)exp(b)=exp(a+b)` only when safe, and inverse `exp(ln u)=u` only with `u>0`.
3. **Task-specific verification.**
   - Derivatives: independently differentiate the original function, then compare the learner candidate with that result by exact normalization or guarded equivalence.
   - Antiderivatives: differentiate the non-`C` portion and compare with the integrand.
   - Differential equations: substitute the candidate and its derivatives into the equation and initial condition.
   - Limits/series: use the family's exact oracle, not general sampling.
4. **Guarded numerical equivalence fallback.** Use only for generated elementary-function families whose domain and complexity are bounded. Evaluate both expressions at at least 12 deterministic safe points spanning each relevant connected interval, including noninteger points, using scaled absolute/relative tolerances. Reject if either expression has a different definedness pattern or non-finite value.

Numerical agreement is a practical secondary check, not proof. It must never be the sole oracle for polynomial/rational expressions, discontinuities, convergence, or domain-sensitive identities. If equivalence cannot be established confidently, offer the expected form and allow the learner to report a checker limitation without counting it as conceptual failure.

### Antiderivative constant convention

- “Find **one** antiderivative” accepts a representative without `+C`.
- “Find the **general** antiderivative” requires the reserved top-level additive token `C`.
- Two antiderivatives are equivalent when their derivatives match on the declared interval; disconnected-domain constants are outside scope.
- Numeric constants may be absorbed into `C`; `x²+C+5` is accepted.
- `C` inside a function, product with `x`, denominator, exponent, or integration bound is rejected.

### Numeric and exact-answer conventions

- Integers and reduced fractions are preferred where exact.
- Equivalent exact forms using `pi`, radicals, and supported functions are accepted.
- Decimal answers are accepted only when the prompt allows approximation or their tolerance is explicitly declared.
- Default numeric tolerance is the larger of half a displayed last-place unit and `10⁻⁶` relative; iterative/numerical families may specify a method-derived tolerance.
- `DNE`, `does not exist`, `∞`, and `−∞` are semantic controls rather than fragile free text.
- Multiple quantities use named fields.
- Set/interval answers use a structured interval editor when possible; text parsing is limited to finite unions of intervals and points.

### Graph and table semantics

- Graphs derive from an exact semantic function, piecewise function, derivative-sign chart, or sampled table.
- Axes show variable, scale, zero, and units when applicable.
- Quantitative points, endpoints, holes, asymptotes, corners, and tangent markers are explicitly encoded; do not require pixel estimation when an exact answer is expected.
- Open/closed points are distinguishable by shape and accessible label, not color alone.
- A smooth-looking raster is not evidence of differentiability; differentiability questions use semantic corner/cusp/vertical-tangent/discontinuity markers.
- Every graph has an accessible table/text description sufficient to answer.
- Graph-layout changes are not meaningful question variation.

### Difficulty philosophy

Difficulty should rise through:

- weaker cues about the applicable rule;
- more composition layers or interaction of two mastered rules;
- inversion, parameter solving, and function/derivative/integral representation transfer;
- domain and endpoint reasoning;
- selecting among exact, qualitative, and numerical methods;
- interpreting rather than merely computing;
- checking approximation error or convergence conditions.

It must not rise through huge coefficients, tedious expansion, unreadable nesting, obscure identities, accidental cancellation, excessive algebra unrelated to calculus, or requiring a CAS. Most advanced questions should have no more than three essential conceptual stages.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `expressionAST`, `domain`, `pointOrInterval`, `method`, `exactAnswerAST`, `canonicalAnswer`, `displayAnswer`, `numericTolerance`, `acceptedForms`, `safeSampleSet`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `graphSemantics`, and `structuralSignature`.

Generate a latent exact instance, compute with an independent oracle, validate its domain and pedagogical constraints, then render. Reject the same structural signature within 20 questions and exact instance within 100.

## 2. Category: Functions and Rates

### Category purpose

Establish domain/composition fluency and connect average rate to the limiting idea of instantaneous rate.

### Learn

A function includes a rule and a domain. Composition means substitution: `(f∘g)(x)=f(g(x))`. Average rate of change over `[a,b]` is the secant slope `(f(b)−f(a))/(b−a)`. The derivative will arise by letting the second point approach the first.

### Common misconceptions

- Cancelling factors and forgetting the original excluded point.
- Treating `f(g(x))` as `f(x)g(x)`.
- Dividing by `b−a` with the sign reversed only in the denominator.
- Confusing average function value with average rate of change.

### Family `function_domain`

**Task.** Determine the real domain of a controlled expression or whether a given input is allowed.

**Derivation.** Intersect denominator, logarithm, square-root, and tangent constraints from the AST.

**Difficulty.** L1 one denominator/root/log; L2 combined constraints; L3 simplify constraints while retaining holes.

**Examples.**

1. L1: `1/(x−3)` → `x≠3`.
2. L2: `sqrt(x−2)` → `[2,∞)`.
3. L3: `(x²−1)/(x−1)` as written → `(-∞,1)∪(1,∞)`.

**Validation.** Symbolic constraint solver over supported linear/quadratic factors plus boundary probes.

### Family `function_composition`

**Task.** Compute/evaluate a composition or identify inner and outer functions.

**Derivation.** Substitute the complete inner AST for the outer variable without premature simplification.

**Difficulty.** L1 numeric composition; L2 symbolic polynomial; L3 domain of a composition or decomposition for chain rule.

**Examples.**

1. `f(x)=x², g(x)=x+1`; `(f∘g)(2)=9`.
2. `(f∘g)(x)=(x+1)²`.
3. `ln(3x−2)` → outer `ln(u)`, inner `u=3x−2`.

**Validation.** AST substitution and evaluation at safe points.

### Family `average_rate_secant`

**Task.** Find average rate of change from a formula, table, or graph and interpret its units.

**Derivation.** `(f(b)−f(a))/(b−a)`.

**Difficulty.** L1 linear/integer endpoints; L2 nonlinear formula; L3 choose interval from graph/table or compare secants approaching a point.

**Examples.**

1. `f(x)=3x+2` on `[1,5]` → `3`.
2. `f(x)=x²` on `[1,3]` → `4`.
3. position changes `10 m→22 m` during `2 s→5 s` → `4 m/s`.

**Validation.** Exact endpoint evaluation; denominator nonzero; units are vertical/horizontal.

## 3. Category: Limits and Continuity

### Category purpose

Train local behavior reasoning separately from function value and provide the foundation for derivatives, integrals, and series.

### Learn

`lim_(x→a)f(x)` asks what values approach as `x` approaches `a`, not necessarily `f(a)`. A two-sided limit exists when left and right limits agree. Algebra may expose a removable factor, while end behavior follows dominant terms. Continuity at `a` requires `f(a)` defined, the limit existing, and equality between them.

### Common misconceptions

- Replacing every limit with direct substitution even when it gives `0/0`.
- Treating `0/0` as the limit value rather than an indeterminate form.
- Using the filled graph point instead of nearby behavior.
- Declaring a two-sided limit from only one side.
- Saying any unbounded behavior is simply `∞` regardless of sign/side.
- Cancelling a factor and claiming the original function becomes defined at the hole.

### Family `limit_from_graph_table`

**Task.** Determine one-sided/two-sided limit or function value from a semantic graph/table.

**Response mode.** Exact number, `∞`, `−∞`, or `DNE`.

**Derivation.** Read approach behavior independently from left/right and from the closed-point value.

**Difficulty.** L1 continuous; L2 removable hole/different value; L3 jump or opposite infinite sides.

**Examples.**

1. curve approaches `4` from both sides and `f(2)=4` → limit `4`.
2. both sides approach `3`, closed point at `5` → limit `3`, value `5`.
3. left approaches `−1`, right `2` → two-sided limit `DNE`.

**Validation.** Graph/table generated from explicit one-sided semantic records.

### Family `limit_direct_substitution`

**Task.** Evaluate a limit for an expression continuous at the target.

**Derivation.** Verify domain/continuity, then substitute exactly.

**Difficulty.** L1 polynomial; L2 rational with nonzero denominator; L3 composition of continuous elementary functions.

**Examples.**

1. `lim_(x→2)(3x−1)=5`.
2. `lim_(x→1)(x²+2)/(x+3)=3/4`.
3. `lim_(x→0) exp(x²+1)=e`.

**Validation.** Exact AST evaluation and continuity predicate.

### Family `limit_factor_cancel`

**Task.** Evaluate a removable `0/0` rational limit by factoring and cancelling locally.

**Derivation.** Factor reviewed polynomial templates, cancel the common factor for `x≠a`, evaluate the reduced expression.

**Difficulty.** L1 difference of squares; L2 quadratic factor; L3 multiplicity/parameter chosen for a removable hole.

**Examples.**

1. `lim_(x→2)(x²−4)/(x−2)=4`.
2. `lim_(x→−1)(x²+3x+2)/(x+1)=1`.
3. `lim_(x→3)(x−3)²/((x−3)(x+2))=0`.

**Validation.** Exact polynomial gcd and original-domain record.

### Family `limit_rationalize`

**Task.** Evaluate a radical `0/0` limit by multiplying by a conjugate.

**Derivation.** Use `(sqrt(u)−sqrt(v))(sqrt(u)+sqrt(v))=u−v`, cancel locally, evaluate.

**Difficulty.** L1 standard root difference; L2 coefficients/shift; L3 reciprocal/conjugate selection.

**Examples.**

1. `lim_(x→0)(sqrt(x+1)−1)/x=1/2`.
2. `lim_(x→4)(sqrt(x)−2)/(x−4)=1/4`.
3. choose `sqrt(x+5)+3` as conjugate when `x→4`.

**Validation.** Symbolic conjugate product and domain-safe one-sided neighborhood.

### Family `limit_special_trig`

**Task.** Evaluate a limit derived from the standard radian limits `sin(u)/u→1` and `(1−cos(u))/u²→1/2`.

**Derivation.** Rewrite to expose a standard limit, retaining scalar factors and verifying `u→0`.

**Difficulty.** L1 direct standard form; L2 linear inner/scalar multiple; L3 reciprocal or cosine form.

**Misconceptions.** Substitute to report `0/0`, lose the inner scale, or use degree-mode intuition.

**Examples.**

1. `lim_(x→0) sin(x)/x=1`.
2. `lim_(x→0) sin(3x)/x=3`.
3. `lim_(x→0) (1−cos x)/x²=1/2`.

**Validation.** Template-specific symbolic rewrite; high-precision approach sampling is diagnostic only.

### Family `limit_lhopital`

**Task.** Decide whether L'Hôpital's rule applies and, when it does, evaluate a controlled limit.

**Derivation.** First verify a `0/0` or `±∞/±∞` quotient on the relevant side, differentiate numerator and denominator separately, and reevaluate; use at most two applications.

**Difficulty.** L1 recognize valid/invalid form; L2 one application; L3 two applications or infinity quotient.

**Constraints.** Products, differences of infinities, `0*∞`, and powers are excluded unless the prompt first supplies the valid quotient rewrite. Hypotheses must be checked rather than inferred from surface syntax.

**Examples.**

1. `lim_(x→1) ln(x)/(x−1)=1`.
2. `lim_(x→0) (exp(x)−1)/x=1`.
3. `lim_(x→∞) x/exp(x)=0`.

**Validation.** Family-specific indeterminate-form certificate and independent limit oracle for every derivative quotient.

### Family `limit_infinity_asymptote`

**Task.** Determine a rational-function limit at `±∞` or a one-sided limit at a vertical asymptote.

**Derivation.** At infinity compare degrees/leading coefficients; at a pole use factor signs on each side.

**Difficulty.** L1 denominator degree larger; L2 equal/different degrees; L3 signed one-sided pole or horizontal/slant-behavior choice.

**Examples.**

1. `lim_(x→∞)(3x+1)/(x²+2)=0`.
2. `lim_(x→−∞)(2x²−1)/(5x²+x)=2/5`.
3. `lim_(x→2⁺)1/(x−2)=+∞`.

**Validation.** Exact degree/leading-term oracle and interval sign probes.

### Family `continuity_parameter`

**Task.** Classify a discontinuity or choose a parameter making a piecewise function continuous.

**Derivation.** Compare left limit, right limit, and declared value; solve their equality for the parameter.

**Difficulty.** L1 classify; L2 fill a hole; L3 solve linear parameter across two pieces.

**Examples.**

1. hole with common limit → removable.
2. `f(x)=(x²−1)/(x−1)` for `x≠1`, `f(1)=k` → `k=2`.
3. `ax+1` left and `x²` right at `x=2` → `a=3/2` for continuity.

**Validation.** Independent one-sided expressions and parameter back-substitution.

## 4. Category: Derivatives and Differentiation Rules

### Category purpose

Build exact derivative fluency while keeping rule selection, composition structure, and evaluation distinct.

### Learn

The derivative is the limit of a difference quotient and measures instantaneous rate/slope. Differentiation is linear. Products and quotients require their own rules, and compositions require the chain rule. A correct symbolic derivative must also respect the original function's domain.

### Common misconceptions

- Lowering an exponent without multiplying by it.
- Differentiating a constant as itself.
- Using `(fg)'=f'g'` or `(f/g)'=f'/g'`.
- Omitting or duplicating the inner derivative.
- Treating `e^u`, `ln(u)`, or `sin(u)` as if `u=x`.
- Evaluating first when the task asks for a derivative function.

### Family `derivative_definition`

**Task.** Build/evaluate the difference quotient or derive a simple derivative from the limit definition.

**Derivation.** Form `[f(a+h)−f(a)]/h` or `[f(x+h)−f(x)]/h`, simplify for `h≠0`, then take `h→0`.

**Difficulty.** L1 linear; L2 quadratic at a point; L3 symbolic quadratic/cubic with controlled expansion.

**Examples.**

1. `f(x)=3x+1` → difference quotient `3`.
2. `f(x)=x²` at `x=2` → quotient `4+h`, limit `4`.
3. `f(x)=x²` symbolically → `2x+h`, limit `2x`.

**Validation.** Polynomial expansion plus comparison with derivative oracle.

### Family `derivative_power_sum`

**Task.** Differentiate constants, powers, polynomials, and linear combinations.

**Derivation.** `d(cx^n)/dx=cnx^(n−1)` and termwise linearity.

**Difficulty.** L1 monomial positive integer; L2 polynomial; L3 negative/fractional powers on declared domain.

**Examples.**

1. `d(x⁵)/dx=5x⁴`.
2. `d(3x⁴−2x+7)/dx=12x³−2`.
3. `d(4sqrt(x)−2/x)/dx=2/sqrt(x)+2/x²`, `x>0`.

**Validation.** Exact power-rule AST and safe-point finite differences as supplementary check.

### Family `derivative_product`

**Task.** Differentiate a product and recognize when expansion is an alternative.

**Derivation.** `(uv)'=u'v+uv'`.

**Difficulty.** L1 polynomial factors; L2 polynomial×transcendental; L3 product with an inner chain rule.

**Examples.**

1. `(x²(x+1))'=2x(x+1)+x²`.
2. `(x*sin(x))'=sin(x)+x*cos(x)`.
3. `(x²*exp(3x))'=2x*exp(3x)+3x²*exp(3x)`.

**Validation.** Product AST differentiation; accept expanded/factored equivalents.

### Family `derivative_quotient`

**Task.** Differentiate a quotient, preserving denominator/domain.

**Derivation.** `(u/v)'=(u'v−uv')/v²`.

**Difficulty.** L1 simple polynomial quotient; L2 transcendental numerator/denominator; L3 quotient plus chain.

**Examples.**

1. `((x+1)/x)'=−1/x²`, `x≠0`.
2. `(sin(x)/x)'=(x*cos(x)−sin(x))/x²`.
3. `(exp(x)/(x²+1))'=exp(x)*(x²+1−2x)/(x²+1)²`.

**Validation.** Quotient-rule AST, rational normalization where applicable, and domain check.

### Family `derivative_chain`

**Task.** Identify inner/outer functions and differentiate a composition.

**Derivation.** `d[f(g(x))]/dx=f'(g(x))*g'(x)`.

**Difficulty.** L1 power of linear; L2 elementary outer; L3 two nested layers or product plus chain.

**Examples.**

1. `((3x+1)⁴)'=12(3x+1)³`.
2. `(sin(x²))'=2x*cos(x²)`.
3. `(exp((x−1)³))'=3(x−1)²*exp((x−1)³)`.

**Validation.** Composition AST differentiation and inner-factor misconception probes.

### Family `derivative_transcendental`

**Task.** Differentiate supported trig, exponential, and logarithmic functions.

**Derivation.** Use `sin' = cos`, `cos'=−sin`, `tan'=1/cos²`, `exp'=exp`, and `ln(u)'=u'/u`.

**Difficulty.** L1 direct; L2 scalar/linear inner; L3 mixed sum/product with domain.

**Examples.**

1. `(cos x)'=−sin x`.
2. `(ln(2x+1))'=2/(2x+1)`.
3. `(x*ln x−exp(−x))'=ln x+1+exp(−x)`, `x>0`.

**Validation.** Exact rule table and guarded numeric derivative comparison.

### Family `implicit_derivative`

**Task.** Find `dy/dx` at a point or as an expression from an implicit relation.

**Derivation.** Differentiate both sides with respect to `x`, applying chain rule to `y`; collect `y'` terms and solve.

**Difficulty.** L1 circle-type relation; L2 products/powers of `y`; L3 evaluate slope at a valid point.

**Examples.**

1. `x²+y²=25` → `y'=−x/y`, where `y≠0`.
2. `xy=6` → `y'=−y/x`.
3. on `x²+y²=25` at `(3,4)` → slope `−3/4`.

**Validation.** Symbolic total derivative, relation/point check, nonzero solved coefficient.

### Family `derivative_value_tangent`

**Task.** Evaluate a derivative at a point or form tangent/normal line.

**Derivation.** Differentiate, evaluate `m=f'(a)`, use `y−f(a)=m(x−a)`; normal slope is `−1/m` when finite/nonzero.

**Difficulty.** L1 derivative value; L2 tangent; L3 normal or parameter making a tangent condition.

**Examples.**

1. `f=x³`, `f'(2)=12`.
2. tangent to `x²` at `x=1` → `y−1=2(x−1)`.
3. normal to `x²` at `x=1` → `y−1=−(1/2)(x−1)`.

**Validation.** Line passes through point and has required slope; handle horizontal/vertical normals with choices.

### Family `mean_value_theorem`

**Task.** Check the Mean Value Theorem hypotheses and find all guaranteed points `c` for a controlled function on `[a,b]`.

**Derivation.** Verify continuity on `[a,b]` and differentiability on `(a,b)`, compute the secant slope, then solve `f'(c)=(f(b)−f(a))/(b−a)` with `c∈(a,b)`.

**Difficulty.** L1 hypotheses/linear or quadratic; L2 several valid `c`; L3 identify a failed hypothesis at a corner/discontinuity.

**Misconceptions.** Include endpoints as `c`, skip hypotheses, or assume exactly one point is guaranteed.

**Examples.**

1. `f=x²` on `[0,2]` → secant slope `2`, so `c=1`.
2. `f=x³` on `[−1,1]` → slope `1`, so `c=±1/sqrt(3)`.
3. `f=abs(x)` on `[−1,1]` → theorem does not apply because `f` is not differentiable at `0`.

**Validation.** Symbolic continuity/differentiability certificate, exact root set, and open-interval filtering.

## 5. Category: Derivative Applications and Graph Analysis

### Category purpose

Use derivatives to reason about behavior and local approximation, not merely produce formulas.

### Learn

The sign of `f'` controls increasing/decreasing behavior; zeros or undefined derivative values are critical numbers when the function is defined. The sign of `f''` describes concavity. Optimization requires a model, feasible domain, critical/endpoints, and comparison. Linearization uses the tangent line locally, and Newton's method repeatedly intersects a tangent with the axis.

### Family `motion_derivatives`

**Task.** Relate position, velocity, acceleration, speed, and direction from a formula/graph.

**Derivation.** `v=s'`, `a=v'=s''`; speed `=|v|`; direction follows sign of velocity.

**Difficulty.** L1 differentiate; L2 evaluate/interpret; L3 turning/rest intervals from polynomial signs.

**Examples.**

1. `s=t²+1` → `v=2t`, `a=2`.
2. `s=t³−3t`, at `t=1` → `v=0`.
3. `v=(t−1)(t−3)` on `t≥0` → moving backward on `(1,3)`.

**Validation.** Derivative AST and sign-chart oracle; units propagate.

### Family `critical_points`

**Task.** Find critical numbers and classify local extrema from derivative data.

**Derivation.** Candidate where `f'=0` or undefined while `f` is defined; classify by sign change or second derivative when valid.

**Difficulty.** L1 roots of factored `f'`; L2 include nondifferentiable point; L3 classification/no-extremum critical point.

**Examples.**

1. `f'=x−2` → critical `2`, negative-to-positive local minimum.
2. `f'=x²` → critical `0`, no sign change/no extremum.
3. `f=abs(x)` → critical `0`, local minimum though derivative undefined.

**Validation.** Exact critical set plus interval sign samples.

### Family `monotonicity_extrema`

**Task.** Determine increasing/decreasing intervals and absolute extrema on a closed interval.

**Derivation.** Partition by critical numbers, test derivative sign, and compare function values at interior candidates/endpoints for absolute extrema.

**Difficulty.** L1 sign chart supplied; L2 derive from factored derivative; L3 closed-interval candidates.

**Examples.**

1. `f'>0` on `(−∞,1)`, `<0` after → local maximum at `1`.
2. `f'=x(x−2)` → increasing `(-∞,0)∪(2,∞)`, decreasing `(0,2)`.
3. on `[0,3]`, compare endpoint and critical values explicitly.

**Validation.** Symbolic root ordering, sign intervals, and exact candidate evaluation.

### Family `concavity_inflection`

**Task.** Determine concavity/inflection from `f`, `f'`, `f''`, or a graph.

**Derivation.** Concave up where `f''>0`, down where `<0`; inflection requires concavity change and function definition/continuity under supported templates.

**Difficulty.** L1 supplied `f''`; L2 compute; L3 distinguish `f''=0` without sign change.

**Examples.**

1. `f=x²` → concave up everywhere.
2. `f=x³` → inflection at `0`.
3. `f=x⁴` has `f''(0)=0` but no inflection.

**Validation.** Second derivative and two-sided sign chart.

### Family `graph_derivative_match`

**Task.** Match a generated function graph with its derivative or infer derivative signs/zeros.

**Response mode.** Single-choice graph or interval selections.

**Derivation.** Use tangent signs, horizontal tangents, corners, and relative steepness from semantic curve features.

**Difficulty.** L1 monotone linear/quadratic; L2 multiple extrema; L3 distinguish derivative discontinuity/corner and concavity behavior.

**Distractors.** Copy original graph, confuse height with slope, reflect sign, or choose second derivative.

**Examples.**

1. upward-opening parabola → increasing line derivative.
2. cubic with max/min → quadratic derivative crossing at both critical points.
3. `abs(x)` → derivative `−1` left, `+1` right, undefined at `0`.

**Validation.** Derivative generated analytically from source; choice features sampled semantically.

### Family `optimization`

**Task.** Build/optimize one-variable objective over a stated feasible interval.

**Derivation.** Express objective in one variable, find critical points, include endpoints, compare feasible values.

**Generation.** Reviewed templates: rectangle perimeter/area, open-top box with friendly dimensions, revenue/cost polynomial, nearest-point quadratic.

**Difficulty.** L1 objective supplied; L2 construct from constraint; L3 endpoints or discrete feasibility distinction.

**Examples.**

1. maximize `A=x(10−x)` on `[0,10]` → `x=5`.
2. rectangle perimeter `20`: square `5×5` maximizes area.
3. minimize `x²+(x−4)²` → `x=2`.

**Validation.** Domain, derivative candidates, endpoint comparison, and second/brute-grid supplementary check.

### Family `related_rates`

**Task.** Differentiate a supplied geometric/physical relationship with respect to time and solve an instantaneous rate.

**Derivation.** Write relation before values, differentiate implicitly in time, substitute the snapshot, solve with units/sign.

**Generation.** Reviewed templates: circle, sphere, right triangle, similar-triangle shadow, distance between coordinate movers.

**Difficulty.** L1 relation supplied; L2 derive basic geometry; L3 two changing quantities.

**Examples.**

1. `A=πr²`, `r=3`, `dr/dt=2` → `dA/dt=12π`.
2. `V=4πr³/3`, `r=2`, `dr/dt=1` → `dV/dt=16π`.
3. `x²+y²=25`, `x=3,y=4,dx/dt=2` → `dy/dt=−3/2`.

**Validation.** Symbolic time derivative and relation snapshot consistency.

### Family `linearization`

**Task.** Construct `L(x)=f(a)+f'(a)(x−a)` and use it for a local estimate/error comparison.

**Derivation.** Evaluate function and derivative at a nearby convenient base point.

**Difficulty.** L1 line; L2 estimate; L3 infer over/underestimate from concavity.

**Examples.**

1. for `f=x²` at `a=2`, `L(x)=4+4(x−2)`.
2. `sqrt(4.1)` about `4` → `2+0.1/4=2.025`.
3. since `sqrt(x)` is concave down, tangent estimate is an overestimate.

**Validation.** Tangency value/slope and numeric local comparison.

### Family `newton_iteration`

**Task.** Perform one/two Newton iterations or identify convergence failure under a supplied start.

**Derivation.** `x_(n+1)=x_n−f(x_n)/f'(x_n)`.

**Difficulty.** L1 one rational-friendly step; L2 two rounded steps; L3 choose start/diagnose zero derivative or cycle from explicit data.

**Examples.**

1. `f=x²−2`, `x0=1` → `x1=3/2`.
2. same, `x1=1.5` → `x2=17/12≈1.4167`.
3. if `f'(x_n)=0` while `f(x_n)≠0`, next Newton step is undefined.

**Validation.** Exact rational iterations when possible and requested-rounding replay.

## 6. Category: Integrals and Accumulation

### Category purpose

Connect antiderivatives, signed accumulation, approximation, and the Fundamental Theorem while introducing bounded integration techniques.

### Learn

An antiderivative reverses differentiation. A definite integral is a limit of signed sums and represents net accumulation. The Fundamental Theorem connects them: if `F'=f`, then `∫_a^b f=F(b)−F(a)`, and the derivative of an accumulation function recovers its integrand with the chain rule when the bound varies.

### Common misconceptions

- Forgetting `+C` for a general antiderivative.
- Applying the power rule to `x^-1`.
- Treating definite integral as always positive area.
- Omitting `Δx` in a Riemann sum.
- Swapping bounds without changing sign.
- Using substitution without transforming the differential/bounds.
- Applying integration by parts as if it were the product rule without rearrangement.

### Family `antiderivative_basic`

**Task.** Find one/general antiderivative of a controlled sum.

**Derivation.** Reverse power rule for `n≠−1`; `∫1/x dx=ln|x|` on a declared interval; basic `sin`, `cos`, `exp`.

**Difficulty.** L1 monomial; L2 polynomial; L3 elementary mixture/negative powers.

**Examples.**

1. general `∫3x² dx=x³+C`.
2. `∫(4x−2)dx=2x²−2x+C`.
3. on `x>0`, `∫(1/x+cos x)dx=ln(x)+sin(x)+C`.

**Validation.** Differentiate non-`C` portion and enforce constant convention.

### Family `definite_integral_geometry`

**Task.** Evaluate a definite integral from exact geometric regions or distinguish net integral from total area.

**Derivation.** Sum signed rectangle/triangle/semicircle areas; split absolute-area questions at zeros.

**Difficulty.** L1 one positive region; L2 positive/negative; L3 integral versus geometric area pair.

**Examples.**

1. constant `f=3` on `[0,4]` → integral `12`.
2. triangle base `4`, height `2` below axis → `−4`.
3. regions `+6` and `−2` → integral `4`, total area `8`.

**Validation.** Exact region ledger from semantic graph.

### Family `riemann_sum`

**Task.** Compute/interpret left, right, midpoint, or explicitly sampled Riemann sum.

**Derivation.** Partition width `Δx=(b−a)/n`; sum `f(x_i*)Δx`.

**Difficulty.** L1 table/uniform partition; L2 formula endpoints; L3 sigma notation/nonuniform supplied widths.

**Examples.**

1. right sum for `f=x` on `[0,2]`, `n=2` → `1*(1)+2*(1)=3`.
2. left sum for `x²` on `[0,2]`, `n=2` → `1`.
3. interpret `Σ_(i=1)^n f(a+iΔx)Δx` as a right-endpoint sum.

**Validation.** Explicit partition/sample enumeration and interval coverage.

### Family `numerical_integration`

**Task.** Compute trapezoid/midpoint estimate or compare error direction under stated concavity/monotonicity.

**Derivation.** Composite trapezoid averages adjacent heights; midpoint samples interval centers. Exact method and `n` are displayed.

**Difficulty.** L1 one trapezoid; L2 composite table; L3 over/under judgment from convexity.

**Examples.**

1. heights `2,4`, width `3` → trapezoid `9`.
2. `f=x²` on `[0,2]`, trapezoid `n=2` → `3`.
3. for convex `x²`, trapezoid overestimates the exact integral.

**Validation.** Independent weighted-sum oracle and partition checks.

### Family `ftc_evaluate`

**Task.** Evaluate a definite integral using a supplied/derived antiderivative and net-change theorem.

**Derivation.** `F(b)−F(a)`; reversing bounds changes sign.

**Difficulty.** L1 polynomial; L2 elementary functions; L3 net change with initial value.

**Examples.**

1. `∫_0^2 3x² dx=8`.
2. `∫_0^pi cos x dx=0`.
3. `v(t)=2t`, `s(0)=5`; `s(3)=5+∫_0^3 2t dt=14`.

**Validation.** Differentiate antiderivative and exact endpoint evaluation.

### Family `accumulation_derivative`

**Task.** Differentiate an integral with a variable bound, including a chain-rule bound.

**Derivation.** `d/dx ∫_a^{g(x)}f(t)dt=f(g(x))g'(x)`; reverse bounds introduce a minus sign.

**Difficulty.** L1 upper `x`; L2 upper `g(x)`; L3 both bounds variable using subtraction.

**Examples.**

1. `d/dx ∫_0^x t²dt=x²`.
2. `d/dx ∫_1^{x²} sin(t)dt=2x*sin(x²)`.
3. `d/dx ∫_x^{2x} f(t)dt=2f(2x)−f(x)`.

**Validation.** Symbolic Leibniz-bound rule for supported continuous integrands.

### Family `integral_average_value`

**Task.** Find average value or a missing constant from an average-value condition.

**Derivation.** `f_avg=(1/(b−a))∫_a^b f(x)dx`.

**Difficulty.** L1 polynomial; L2 graph/table integral supplied; L3 solve parameter/compare with endpoint values.

**Examples.**

1. average of `x` on `[0,2]` → `1`.
2. average of `x²` on `[0,3]` → `3`.
3. constant `k` with average value `5` → `k=5`.

**Validation.** Integral oracle and range check `min≤average≤max` for continuous bounded examples.

### Family `integration_substitution`

**Task.** Choose a substitution or evaluate an integral matching reverse chain rule.

**Derivation.** Set `u=g(x)`, transform `du=g'(x)dx`; for definite integrals transform bounds or back-substitute, never mix.

**Difficulty.** L1 obvious linear inner; L2 power/log/exponential; L3 definite bounds or small scalar mismatch.

**Examples.**

1. `∫2x(x²+1)³dx`, `u=x²+1` → `(x²+1)^4/4+C`.
2. `∫3exp(3x)dx=exp(3x)+C`.
3. `∫_0^1 2x exp(x²)dx=e−1`.

**Validation.** Differentiate result; definite result also checked numerically.

### Family `integration_by_parts`

**Task.** Select `u,dv` and evaluate a reviewed product integral.

**Derivation.** `∫u dv=uv−∫v du`.

**Generation.** Polynomial×`exp/sin/cos`, and `ln(x)` with implicit `dv=dx`; at most two repetitions.

**Difficulty.** L1 choose parts; L2 one application; L3 two polynomial reductions or definite bounds.

**Examples.**

1. `∫x exp(x)dx=x exp(x)−exp(x)+C`.
2. `∫ln(x)dx=x ln(x)−x+C`, `x>0`.
3. `∫x cos(x)dx=x sin(x)+cos(x)+C`.

**Validation.** Differentiate answer and verify parts decomposition.

### Family `integration_partial_fractions`

**Task.** Decompose/integrate a proper rational function with simple linear factors.

**Derivation.** Solve exact coefficients for distinct/repeated real linear factors, then integrate `1/(x−a)` terms (and one repeated-factor power).

**Difficulty.** L1 decomposition supplied/missing coefficients; L2 distinct factors; L3 one repeated factor.

**Examples.**

1. `1/((x−1)(x+1))=(1/2)/(x−1)−(1/2)/(x+1)`.
2. its integral is `(1/2)ln|x−1|−(1/2)ln|x+1|+C`.
3. decompose a generated rational function reconstructed from friendly coefficients.

**Validation.** Exact rational-function recombination and derivative check.

### Family `improper_integral`

**Task.** Determine convergence and value for selected improper integrals.

**Derivation.** Replace infinite bound/singularity with a limit; use `p`-integral rules or evaluate controlled antiderivative.

**Difficulty.** L1 `∫_1^∞1/x^p`; L2 finite-endpoint singularity; L3 evaluate convergent exponential/rational template.

**Examples.**

1. `∫_1^∞1/x² dx=1`, convergent.
2. `∫_1^∞1/x dx` diverges.
3. `∫_0^1 1/sqrt(x) dx=2`, convergent.

**Validation.** Exact `p` rule or symbolic limit; numerical truncation is supplementary only.

## 7. Category: Differential Equations and Numerical Solutions

### Category purpose

Treat derivatives as equations for unknown functions and practice solution verification, qualitative fields, exact separable models, and numerical stepping.

### Learn

A differential equation constrains a function through its derivatives. A solution must satisfy the equation on an interval; an initial condition selects a particular member. Slope fields encode `y'=F(x,y)`. Euler's method follows local tangent steps, while separable equations rearrange variables before integration.

### Family `ode_verify_solution`

**Task.** Decide whether a proposed function satisfies an ODE and initial condition.

**Derivation.** Differentiate candidate, substitute into both sides, check identity on domain and initial data.

**Difficulty.** L1 first derivative; L2 parameter/initial condition; L3 domain-sensitive candidate.

**Examples.**

1. `y=x²`, `y'=2x` → satisfies.
2. `y=Ce^x`, `y'=y`; `y(0)=3` → `C=3`.
3. `y=1/(C−x)` → verify `y'=y²` where defined.

**Validation.** Symbolic residual plus initial-condition substitution.

### Family `slope_field`

**Task.** Match an ODE to a generated slope field or infer local solution direction.

**Derivation.** Evaluate sign/magnitude of `F(x,y)` on grid landmarks; isoclines and equilibrium solutions are semantic.

**Difficulty.** L1 `y'=f(x)`; L2 autonomous `y'=f(y)`; L3 compare `x,y` dependence/equilibria.

**Examples.**

1. `y'=x` → same slope within each vertical column.
2. `y'=y` → zero along `y=0`, positive above, negative below.
3. `y'=x−y` → zero along `y=x`.

**Validation.** Field arrows generated directly from ODE AST; accessible sign table.

### Family `euler_method`

**Task.** Perform one or several explicit Euler steps.

**Derivation.** `y_(n+1)=y_n+hF(x_n,y_n)`, `x_(n+1)=x_n+h`.

**Difficulty.** L1 one step; L2 two/three steps; L3 fill table or compare step sizes to supplied reference.

**Examples.**

1. `y'=x+y`, `(0,1)`, `h=0.1` → `y1=1.1`.
2. next step at `(0.1,1.1)` → `y2=1.22`.
3. complete named columns `x_n,y_n,F,hF,y_(n+1)`.

**Validation.** Replay steps from unrounded stored values; tolerance matches requested rounding policy.

### Family `separable_equation`

**Task.** Solve a bounded separable initial-value problem or identify correct separation.

**Derivation.** Rearrange `dy/g(y)=f(x)dx`, integrate, include constant, apply initial value, state interval.

**Generation.** Linear separations leading to powers/exponentials; avoid lost equilibrium solutions by generating/checking them explicitly.

**Difficulty.** L1 separation choice; L2 general solution; L3 initial condition/domain.

**Examples.**

1. `y'=xy` → `dy/y=x dx`.
2. nonzero solutions `y=C exp(x²/2)` plus equilibrium `y=0`.
3. `y'=2x`, `y(0)=3` → `y=x²+3`.

**Validation.** Substitute solution and initial value; track solutions excluded by division.

### Family `exponential_growth_decay`

**Task.** Solve/interpret `y'=ky` from initial value, rate, half-life, or doubling time.

**Derivation.** `y=y₀e^(kt)`; `T_double=ln2/k`, `T_half=−ln2/k`.

**Difficulty.** L1 evaluate model; L2 infer `k`; L3 solve time/compare continuous versus stated percentage rate.

**Examples.**

1. `y₀=10,k=0.2` → `y(t)=10e^(0.2t)`.
2. half-life `5` → `k=−ln2/5`.
3. solve `10e^(0.2t)=20` → `t=ln2/0.2`.

**Validation.** ODE/initial substitution and forward/inverse time check.

## 8. Category: Sequences, Series, and Taylor Approximation

### Category purpose

Extend limit and approximation reasoning to infinite discrete processes while separating term behavior from sum behavior.

### Learn

A sequence asks whether terms approach a value. A series asks whether partial sums approach a finite value. `a_n→0` is necessary but not sufficient for `Σa_n` to converge. Geometric and `p` series provide benchmarks; tests have hypotheses. A Taylor polynomial matches derivatives at a center and approximates locally with a controlled remainder when a bound is supplied.

### Common misconceptions

- Confusing a sequence with the series of its terms.
- Believing `a_n→0` proves `Σa_n` converges.
- Using the geometric sum when `|r|≥1`.
- Applying a convergence test without its hypotheses.
- Treating conditional convergence as absolute convergence.
- Omitting the center shift or factorial in Taylor coefficients.

### Family `sequence_limit`

**Task.** Determine a sequence limit from rational/power/geometric forms.

**Derivation.** Use dominant terms and `r^n` behavior; report divergence/oscillation distinctly.

**Difficulty.** L1 rational dominant degree; L2 geometric; L3 combined/oscillatory.

**Examples.**

1. `(3n+1)/(n+2)→3`.
2. `(1/2)^n→0`.
3. `(-1)^n` diverges by oscillation.

**Validation.** Exact class oracle; sampling is illustration only.

### Family `geometric_series`

**Task.** Identify ratio, convergence, sum, or missing term for a geometric series.

**Derivation.** `Σ_(n=0)^∞ ar^n=a/(1−r)` iff `|r|<1`; finite sum uses the declared index/count.

**Difficulty.** L1 classify; L2 infinite sum; L3 shifted index/solve parameter.

**Examples.**

1. `1+1/2+1/4+...` → sum `2`.
2. `3−1+1/3−...` → `a=3,r=−1/3`, sum `9/4`.
3. `Σ2(1.2)^n` diverges.

**Validation.** Exact ratio and index-aware partial-sum formula.

### Family `series_test_selection`

**Task.** Classify a series or choose a valid/informative convergence test from a bounded library.

**Supported tests.** nth-term divergence, geometric, `p` series, direct/limit comparison for positive terms, integral test for whitelisted decreasing functions, alternating-series test, and ratio test for factorial/exponential templates.

**Difficulty.** L1 benchmark; L2 choose test; L3 distinguish absolute/conditional/divergent.

**Examples.**

1. `Σ1/n` → divergent `p=1`.
2. `Σ1/n²` → convergent `p=2`.
3. `Σ(-1)^(n+1)/n` → conditionally convergent.

**Validation.** Template carries a proof certificate and test hypotheses; choices must have one best valid test.

### Family `alternating_error`

**Task.** Bound truncation error or choose terms needed using the alternating-series estimation theorem.

**Derivation.** When hypotheses hold, `|R_N|≤b_(N+1)`.

**Difficulty.** L1 error bound; L2 terms needed; L3 interval for exact sum from partial sum and next-term sign.

**Examples.**

1. alternating harmonic after `N=4` → error `≤1/5`.
2. require error `<0.01` for `b_n=1/n` → choose `N≥100`.
3. if next omitted term is positive, exact sum lies between `S_N` and `S_N+b_(N+1)`.

**Validation.** Verify positivity, monotone decrease, and zero limit before using theorem.

### Family `power_series_interval`

**Task.** Determine radius/interval of convergence for geometric-derived or ratio-test power series, checking endpoints separately.

**Derivation.** Solve interior `|x−a|<R`; substitute each endpoint into the original series.

**Difficulty.** L1 geometric form; L2 ratio-derived radius; L3 one/both endpoint distinctions.

**Examples.**

1. `Σx^n` → `(-1,1)`.
2. `Σ((x−2)/3)^n` → `(-1,5)`.
3. `Σ(x−1)^n/n` → interval `[0,2)`.

**Validation.** Exact interior inequality and endpoint series certificates.

### Family `taylor_polynomial`

**Task.** Construct/evaluate a Taylor polynomial or use a supplied remainder bound.

**Derivation.** `P_n(x)=Σ_(k=0)^n f^(k)(a)(x−a)^k/k!`.

**Generation.** `exp`, `sin`, `cos`, and simple rational/geometric functions at friendly centers; degree `≤6`.

**Difficulty.** L1 coefficients/derivatives supplied; L2 construct Maclaurin polynomial; L3 evaluate approximation or choose degree from supplied remainder bound.

**Examples.**

1. `e^x`, degree 2 at `0` → `1+x+x²/2`.
2. `sin x`, degree 3 at `0` → `x−x³/6`.
3. approximate `e^0.1` with `P2` → `1.105`.

**Validation.** Derivative matching through degree `n`; independently evaluate stated remainder bound.

## 9. Cross-family progression

Recommended order:

1. domains, composition, average rate, graph/table limits;
2. algebraic and special-trigonometric limits, continuity, derivative definition, power/sum rules;
3. controlled L'Hôpital cases, product/quotient/chain/transcendental derivatives, tangent lines, and the Mean Value Theorem;
4. motion, sign charts, extrema, concavity, graph matching, and linearization;
5. basic antiderivatives, geometric integrals, Riemann sums, FTC, and accumulation derivatives;
6. optimization, related rates, Newton iteration, substitution, and numerical integration;
7. integration by parts/partial fractions/improper integrals and first-order differential equations;
8. sequences, convergence tests, power series, and Taylor approximation.

Interleave:

- rule-recognition questions immediately before and after symbolic execution;
- formula, graph, and table representations after each concept reaches basic fluency;
- direct derivative questions with derivative-at-a-point and qualitative-sign questions;
- indefinite integrals with differentiation checks;
- Riemann/numerical sums with exact FTC results for the same friendly functions;
- limit behavior with sequence/series questions later;
- Newton/Euler iterations with explicit row-by-row arithmetic rather than opaque calculator output.

Do not unlock an advanced technique from a broad category score. Chain-rule fluency gates substitution and accumulation bounds; limits gate derivative definition and improper integrals; algebraic factoring gates partial fractions.

## 10. Adaptive practice guidance

Track:

`family`, `expression class`, `AST depth`, `domain feature`, `representation`, `rule selected`, `outer/inner structure`, `sign behavior`, `exact/approximate mode`, `interval endpoint`, `integration technique`, `convergence certificate`, `checker layer`, and `misconception`.

| Error pattern | Diagnosis | Next item |
|---|---|---|
| uses `f(a)` for hole limit | value/limit conflation | paired limit and value fields |
| reports `0/0` | indeterminate-form misunderstanding | classify then factor/rationalize |
| one-sided values differ but finite answer given | two-sided condition missed | left/right fields before whole limit |
| L'Hôpital used on a non-indeterminate form | theorem hypotheses skipped | classify form before differentiating |
| `(x^n)'=x^(n−1)` | missing exponent factor | monomial coefficient/exponent fields |
| `(fg)'=f'g'` | product-rule model | identify two required terms |
| missing inner derivative | chain rule | outer/inner then derivative scaffold |
| quotient numerator sign reversed | quotient-order memory | verbal low-high order plus expansion check |
| critical point whenever `f'=0` | sign-change assumption | `x³`/`x⁴` contrasts |
| inflection whenever `f''=0` | concavity-change condition | second-derivative sign chart |
| endpoint omitted in optimization | closed-domain candidates | candidate checklist |
| no `+C` | family versus representative | differentiate two answers differing by constant |
| definite integral forced positive | net area confusion | signed region ledger |
| Riemann sum lacks `Δx` | height versus area | units/rectangle prompt |
| substitution changes `u` but not `dx/bounds` | incomplete substitution | structured `u,du,bounds` fields |
| initial values used in Euler derivative repeatedly | step-state update missed | explicit row columns |
| `a_n→0` claimed sufficient | sequence/series conflation | harmonic counterexample |
| endpoint not checked | radius versus interval confusion | endpoint-only follow-up |
| Taylor term lacks factorial | coefficient rule | derivative/factorial table |
| equivalent answer rejected by structural layer | checker limitation | rerun exact/task-specific/fallback audit without mastery penalty |

Recommended selection: 40% weakest due, 25% spaced mastery, 20% misconception/prerequisite diagnostic, 10% representation transfer, 5% bounded synthesis.

If a multi-rule expression is wrong, diagnose rule selection before algebraic simplification. If the learner's unsimplified derivative is correct, accept it; simplification style is not the target unless explicitly asked.

## 11. Feedback and worked-solution requirements

Worked solutions must show:

1. domain and target interpretation;
2. selected rule/theorem and its hypotheses;
3. expression structure or partition/sign chart;
4. symbolic steps before optional simplification;
5. exact answer and requested approximation;
6. a check by differentiation, substitution, sign, bounds, graph behavior, units, or error estimate.

Examples of diagnostic feedback:

> Your answer is the product of the derivatives. The product rule needs two terms: differentiate one factor at a time while keeping the other unchanged.

> The integral is `4`, not `8`: the region below the axis subtracts from net accumulation. `8` is the total geometric area.

Feedback must not insist on a canonical display when the learner supplied a verified equivalent form. Show both:

> `2x(x+1)+x²` is correct. Expanded, it is `3x²+2x`.

For a rejected but plausibly equivalent expression, expose whether parsing, domain, or equivalence proof failed and provide a no-penalty “show in supported form” path.

## 12. Rendering and accessibility requirements

- Use semantic MathML where browser support permits, with accessible linear text generated from the same AST.
- Superscripts, fractions, radicals, limits, integrals, and sigma notation must remain readable at zoom and in high contrast.
- Never encode open/closed points, positive/negative regions, or selected intervals by color alone.
- Every graph has keyboard-addressable landmarks and a table/text equivalent.
- Structured expression fields provide buttons for common functions but remain fully keyboard operable.
- Screen-reader text distinguishes `f inverse` from `1/f`, `sin squared x` from `sin of x squared`, and bound variables from free variables.
- Error messages point to the rejected token/range without rewriting the learner's answer silently.

## 13. Generator and implementation requirements

### AST-first generation

- Generate expressions, domains, graphs, choices, answers, and worked steps from one AST/semantic model.
- Use exact integer/rational arithmetic for polynomial/rational coefficients, partitions, and iterations where possible.
- Generate backward from friendly factorization, critical points, antiderivatives, and convergence certificates.
- Preserve unsimplified rule-form answers as accepted canonical alternatives.
- Alpha-rename dummy integration/summation variables safely.
- Never use JavaScript `eval`, `Function`, or injected HTML to parse learner mathematics.

### Oracle independence

The production answer AST and validator must not merely call the same transformation path twice.

- Derivatives: rule-based AST result plus finite-difference/complex-step-style development check where the real supported functions permit it.
- Integrals: differentiate the generated antiderivative and compare; definite values additionally use high-order numeric quadrature in tests.
- Limits: family-specific algebra/sign oracle plus high-precision approach sampling for diagnostics.
- Optimization: candidate analysis plus bounded dense numeric scan in tests.
- Series: template proof certificate plus partial-sum/asymptotic diagnostics.
- ODEs: substitution residual and numerical trajectory spot checks.

### Offline constraint

The app is a standalone HTML/JS/CSS page. Parsing, simplification, differentiation, evaluation, plotting, and checking run locally. No backend, remote CAS, runtime package download, or network lookup is assumed. A small audited math engine is part of the app; it must remain bounded to this specification.

## 14. Automated validation

For every instance:

- expression render→parse preserves the AST;
- declared domain matches all AST restrictions;
- every evaluation point is safe and finite when required;
- exact answer satisfies the task-specific oracle;
- alternative accepted forms pass canonical/task-specific checks;
- numerical fallback uses enough safe points and never overrides domain mismatch;
- choices are distinct and have exactly one semantically correct answer;
- graph/table/text representations agree;
- rounding/tolerance and iteration policy are explicit;
- worked solution recomputes the answer;
- structural-history/rejection rules pass.

Property/regression tests:

- parser precedence: `-x^2`, chained division, implicit multiplication, function calls;
- polynomial canonicalization and rational-function gcd/domain preservation;
- derivative rules on thousands of bounded random ASTs;
- antiderivative differentiation and `C` placement;
- one-sided/two-sided limits at holes, jumps, and signed poles;
- special trigonometric rewrites and L'Hôpital indeterminate-form hypotheses;
- tangent/normal vertical and horizontal cases;
- Mean Value Theorem hypothesis failures and all interior solutions;
- critical/inflection candidates without sign changes;
- closed-interval endpoint extrema;
- signed integral versus total area;
- Riemann/trapezoid weights and partition coverage;
- FTC variable bounds including reversed/two variable bounds;
- substitution bound transformation;
- integration-by-parts and partial-fraction reconstruction;
- improper `p=1` boundary;
- Newton zero-derivative and Euler state-update cases;
- separable-equation lost equilibrium solution;
- harmonic versus geometric, conditional versus absolute, and power-series endpoint cases;
- Taylor coefficient/factorial and remainder checks;
- at least `10,000` deterministic seeds per family and level.

Numerical equivalence adversarial tests must include:

- different polynomials agreeing on too few sample points;
- expressions differing only at a removable hole;
- `sqrt(x²)` versus `x`;
- `ln(exp(x))` versus `x` and `exp(ln(x))` versus `x` with their different domains;
- periodic aliases and near-singular tangent values;
- overflow/underflow and catastrophic cancellation;
- answers that insert high-degree zero factors at known sample points.

These tests are why sampling remains a fallback, never a proof oracle.

## 15. Coverage requirements

Across a long mixed session:

- at least 25% of questions ask for rule choice, interpretation, graph/table behavior, domain, hypotheses, or error—not only a final expression;
- derivatives balance polynomial, product, quotient, chain, transcendental, implicit, and evaluated/tangent forms;
- limit sessions include function-value contrasts and both one-sided directions;
- graph analysis includes increasing/decreasing, extrema, concavity, corners, and derivative matching;
- integrals balance signed geometry, approximation, FTC, and technique selection;
- ODE practice balances verification, qualitative fields, numerical stepping, and exact separable models;
- series practice distinguishes sequences, term tests, convergence types, endpoints, and approximation error;
- exact and approximate, forward and inverse, formula and visual representations are balanced;
- no single special value (`0`, `1`, `pi`) or special angle dominates;
- every declared misconception appears deliberately.

Cross-family synthesis is limited to mastered prerequisites and normally at most three conceptual stages. Good synthesis includes derivative→critical points→endpoint comparison, or reaction-rate-style model→separation→initial value. Avoid giant expressions whose primary challenge is transcription.

## 16. Topic-level quality checklist

- [ ] The app is single-variable calculus and states its ceiling clearly.
- [ ] The controlled expression grammar is visible and enforced.
- [ ] No arbitrary-CAS capability is promised.
- [ ] Domain is stored separately from simplified value expressions.
- [ ] Numeric sampling is never the sole proof for domain-sensitive or algebraic answers.
- [ ] Equivalent unsimplified rule forms are accepted.
- [ ] General antiderivatives require a valid top-level `+C`.
- [ ] Limits distinguish nearby behavior, value, DNE, and signed infinity.
- [ ] Critical and inflection points require their actual sign/definition conditions.
- [ ] Definite integral and geometric area are distinguished.
- [ ] Numerical methods state update/partition/rounding policy.
- [ ] The hypotheses of convergence/error tests are validated.
- [ ] Graphs and accessible descriptions share semantic data.
- [ ] Every distractor maps to a plausible misconception.
- [ ] Every family has derivation, difficulty progression, three examples, and validation.
- [ ] Difficulty grows through calculus reasoning rather than algebraic tedium.
- [ ] The standalone app needs no backend or runtime CAS.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Functions & Rates
2. Limits & Continuity
3. Derivatives
4. Derivative Applications
5. Integrals & Accumulation
6. Differential Equations
7. Sequences & Series

Stable family identifiers are the backticked identifiers above. If an earlier derivative-only prototype exists, migrate progress only to matching family IDs; polynomial derivative mastery must not imply limits, applications, integration, ODE, or series mastery.
