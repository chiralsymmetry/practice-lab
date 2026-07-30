# Algebra Fluency — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, exact-expression engine, equation/inequality solver, graph renderer, answer-checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Algebra Fluency

### Topic goal

Develop fast, reliable manipulation and interpretation of algebraic expressions, equations, inequalities, systems, and functions. The learner should become able to:

- read expression structure and translate between words and symbols;
- evaluate expressions under substitutions without precedence or sign errors;
- simplify, expand, and factor while preserving meaning;
- solve and classify linear, quadratic, rational, radical, exponential, logarithmic, and absolute-value equations within a controlled grammar;
- solve and represent inequalities, including compound, polynomial, rational, and absolute-value cases;
- preserve domain restrictions and reject extraneous solutions;
- move among formula, table, graph, factored, vertex, and standard representations;
- solve small systems and choose an efficient method;
- use functions, composition, inverses, transformations, and sequences fluently;
- verify answers by substitution, expansion, sign analysis, or graph behavior.

The central habit is **equivalence with conditions**. Algebraic moves are not typography changes: they must preserve a value, expression function, equation solution set, or inequality solution set under the declared domain.

### Position within Practice Lab

This app supplies the symbolic fluency assumed by:

- **Calculus**, including factoring, rational expressions, functions, exponents, and logarithms;
- **Physics**, **Chemistry**, **Electric Circuits**, and **Everyday Economics**, including formula rearrangement and modeling;
- **Probability and Statistics**, including equations, powers, and function interpretation;
- **Linear Algebra**, which extends equation solving to matrices and vector spaces.

It should diagnose arithmetic weaknesses but not duplicate the Mental Arithmetic app. It should not teach calculus rules, matrix methods, or domain-specific formulas whose algebra is incidental.

### Audience and prerequisites

The learner should know:

- signed integer and decimal arithmetic;
- fraction meaning and basic fraction operations;
- multiplication/division facts;
- coordinate axes and ordered pairs for graph categories.

Early categories begin at pre-algebra transition. Later categories reach a strong secondary-school/precalculus algebra level.

### Scope

The topic includes:

- variables, constants, coefficients, terms, factors, powers, grouping, and operation precedence;
- substitution and exact evaluation;
- commutative, associative, distributive, identity, inverse, and zero-product properties;
- like terms, distribution, nested signs, polynomial expansion, and form recognition;
- one- and multi-step linear equations, variables on both sides, identities, contradictions, proportions, literal equations, and controlled applications;
- linear, compound, and absolute-value inequalities; interval/set notation; sign charts;
- polynomial vocabulary and arithmetic, special products, division, remainder/factor theorems, and controlled factorization;
- quadratic equations by factoring, square roots, completing the square, and quadratic formula; discriminant and graph features;
- bounded complex-number arithmetic and non-real quadratic roots;
- rational-expression domains, simplification, arithmetic, rational equations, and rational inequalities;
- integer and rational exponent laws, radicals, rationalization, radical equations, exponentials, and logarithms;
- two-variable linear systems by graphs, substitution, and elimination; bounded three-variable and nonlinear systems;
- function notation, domains/ranges, tables, transformations, composition, inverse functions, piecewise rules, linear features, and arithmetic/geometric sequences.

The intended ceiling is algebra/precalculus fluency needed for technical study. Each family remains small enough for exact local generation and checking.

### Exclusions

Do not include in the initial app:

- calculus, limits, derivatives, integrals, infinite series, or optimization;
- matrix row reduction or vector-space theory;
- unrestricted computer algebra, Gröbner bases, arbitrary high-degree root finding, abstract algebra, field/ring theory, or proof grading;
- trigonometric identities/equations beyond optional use of familiar function notation;
- conic sections other than quadratic/parabola features;
- arbitrary piecewise symbolic solving, nested radicals of unrestricted form, or equations needing special functions;
- polynomial factorization above degree four unless structure is explicitly generated from known factors;
- general quartic/cubic formulas;
- logarithms of non-positive real values or silent complex branches;
- rational expressions whose original excluded values are lost from the semantic answer;
- word problems whose difficulty is reading ambiguity, unfamiliar domain knowledge, or implausible arithmetic;
- “simplify” prompts without a declared target form;
- trick questions based on invisible multiplication or ambiguous fraction layout.

### Normative scalar domain

- Core algebra is over the real numbers.
- Complex values appear only in explicitly labeled complex-number and quadratic-root families.
- Integers and rationals are exact.
- Irrational exact values use normalized radicals and logarithmic/exponential forms within the supported grammar.
- Division by zero is undefined.
- An even-index real radical requires a non-negative radicand; an odd-index radical is defined for all real radicands.
- `sqrt(x²)=|x|` over the reals, not automatically `x`.
- `a^(m/n)` uses the reduced rational exponent. For even `n`, the real base restrictions are explicit.
- `log_b(x)` requires `b>0`, `b≠1`, and `x>0`.
- Unless a prompt declares otherwise, equations and inequalities ask for real solutions.

### Controlled expression grammar

The parser supports semantic AST nodes:

```text
Integer, Rational, Variable
Neg(expr)
Add(expr...)
Mul(expr...)
Pow(base, integerExponent)
RationalPow(base, reducedRationalExponent)
Div(numerator, denominator)
Abs(expr)
Root(index, expr)
Exp(base, expr)
Log(base, expr)
FunctionCall(name, expr)
Piecewise(branches)
```

Restrictions:

- variables are normally `x`; systems use `x,y` and bounded advanced cases add `z`;
- coefficients are integers or reduced rationals;
- implicit multiplication may be displayed (`3x`, `2(x+1)`), but learner input may use `*`;
- exponentiation binds before unary negation: `-x^2=-(x^2)`, while `(-x)^2` is distinct;
- division bars create an explicit grouped numerator and denominator;
- functions require parentheses in typed input: `log_2(x)`, `sqrt(x)`, `abs(x)`;
- arbitrary juxtaposed function calls, factorials, modulo, floor/ceiling, and unsupported names are rejected;
- no JavaScript `eval` or executable syntax is accepted.

The visible input-help card must show accepted syntax and examples for the active family only.

### Equality, identity, and solution-set semantics

The checker distinguishes:

- **numeric equality** at one substitution;
- **expression equivalence** on a declared domain;
- **identity**, true for every value in its domain;
- **equation**, true only at its solution set;
- **inequality**, with a solution region/set;
- **definition or formula**, where named variables have declared roles.

`2(x+1)=2x+2` is an identity. `2(x+1)=8` is an equation. Cancelling `(x−3)` from `(x−3)(x+1)/(x−3)` yields `x+1` only for `x≠3`; the original expression and simplified formula do not have identical domains unless that exclusion is preserved.

### Normal forms and task contracts

Every expression task declares one target contract:

- `equivalent_any`: any supported expression equivalent on the required domain;
- `collected`: polynomial terms combined, descending degree, no zero terms;
- `expanded`: no products of non-constant sums and no positive powers of sums;
- `factored`: a product satisfying the family’s irreducibility/domain rules;
- `reduced_rational`: relatively prime numerator/denominator plus original exclusions;
- `radical_normal`: square-free radicands, no extractable perfect powers, requested denominator convention;
- `positive_exponents`: no negative exponents;
- `isolated_variable`: requested variable alone on the specified side;
- `finite_solution_set`, `interval_union`, `ordered_tuple_set`, or `function_rule`.

The learner must never infer the desired meaning of “simplify.” Preferred wording names the contract, for example:

> Expand and collect like terms.

> Factor completely over the integers.

> Write with positive exponents.

### Exact answer equivalence

Use task-specific exact checking:

- integers/rationals: normalized exact values;
- polynomials: canonical sparse coefficient maps;
- factorizations: expand exactly, verify required factor properties, and accept reordered factors/unit redistribution;
- rational expressions: reduce exact polynomial numerator/denominator and compare excluded-domain sets;
- radicals: normalize in a bounded algebraic-number representation and verify by exact powers/minimal identities;
- equations: compare exact solution sets and verify every candidate in the original equation;
- inequalities: compare normalized unions of real intervals/points;
- systems: compare exact sets of ordered tuples or declared parameterizations;
- functions: compare rules together with domains, or graph/table properties as requested;
- complex values: normalized pairs `a+bi` with exact supported components.

Numerical evaluation at sample points is a secondary diagnostic only. It must not be the sole proof of polynomial/rational identity, domain equality, equation solution sets, or inequality regions.

### Structured answer formats

Prefer semantic controls when free text would be fragile:

- coefficient/exponent fields for early monomials;
- expression editor for supported ASTs;
- equation balance with draggable/selected operation;
- finite solution-set chips;
- interval builder with endpoint and open/closed controls;
- sign-chart cells;
- ordered-pair cards for systems;
- graph point/line/parabola controls with accessible numeric fields;
- factor cards whose order is ignored;
- domain-exclusion chips;
- function table and piecewise branch fields.

Surrounding whitespace is ignored. Unicode minus and ASCII `-` are accepted. Equivalent rational and radical syntax is accepted. Variable names are case-sensitive. Multiple solutions are unordered unless the prompt explicitly asks for increasing order.

### Equation and inequality conventions

- Every transformation must be applied to both sides.
- Multiplying/dividing an inequality by a negative reverses its comparison.
- Squaring an equation may add extraneous solutions; multiplying by an expression may hide excluded values.
- The zero-product property applies only when a product equals zero.
- `|u|=a`: no real solution for `a<0`, one structural equation at `a=0`, and `u=±a` for `a>0`.
- `|u|<a` with `a>0` gives `−a<u<a`; `|u|>a` gives `u<−a or u>a`; non-strict variants preserve endpoints.
- `∞` and `−∞` are never included endpoints.
- Interval unions are normalized, merging overlaps and touching intervals when inclusion makes the union connected.
- Graph shading and interval notation must agree exactly.

### Polynomial, radical, and logarithm conventions

- Polynomial standard form uses descending exponent order.
- “Factor completely over the integers” extracts the numeric GCF with positive leading coefficient remaining, then uses integer irreducible factors.
- Constant factors may be redistributed only if the requested normalization remains satisfied.
- Difference of squares: `a²−b²=(a−b)(a+b)`; sum of squares does not factor over the reals/integers.
- Quadratic formula uses `x=[−b±sqrt(b²−4ac)]/(2a)`.
- For real factorization, a negative discriminant quadratic is irreducible.
- Radical addition combines only like radical terms after normalization.
- Rationalizing a denominator is a requested form, not a claim that an unrationalized equivalent is mathematically wrong.
- Log laws require positive arguments in their real domains. `log(x+y)` does not split.
- Exponential/logarithmic inverse moves preserve the applicable base and domain conditions.

### Difficulty philosophy

Difficulty should rise through:

- deeper but readable expression structure;
- weaker scaffolding and inverse/missing-step questions;
- variables on both sides or parameters controlling cases;
- domain restrictions and possible extraneous roots;
- transfer among symbolic, graphical, tabular, and verbal representations;
- choosing an efficient method rather than being told one;
- multiple intervals/solutions or conditional cases;
- combining two or at most three mastered operations.

Difficulty must not rise through:

- enormous coefficients or long arithmetic;
- dense expressions created only to look intimidating;
- excessive fractions before fraction fluency is established;
- arbitrary polynomial degree;
- nearly coincident graph features;
- ambiguous notation or unsupported simplification conventions;
- wordy scenarios unrelated to the algebra;
- requiring a general CAS;
- punishing a correct equivalent form.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | Identify structure, substitute, combine one set of like terms, or perform one inverse operation |
| 2 | Two-step manipulation, distribution, direct factoring pattern, or one representation change |
| 3 | Variables on both sides, multi-factor/interval solution, domain restriction, or method choice |
| 4 | Parameter cases, inverse construction, rational/radical extraneous checks, systems, mixed representations |
| 5 | Bounded synthesis, multiple conditions, advanced factor/root structure, or comparative method reasoning |

Each item additionally records AST depth, term/factor count, coefficient type, solution cardinality, domain complexity, representation, scaffolding, and misconception target.

### Generator and oracle model

Every instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `expressionASTs`, `relationAST`, `declaredDomain`, `originalDomain`, `targetContract`, `givensExact`, `canonicalAnswer`, `acceptedAnswerClass`, `solutionSet`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedSteps`, `structuralSignature`, `grammarVersion`, and `oracleVersion`.

Generation should usually work backward:

1. choose a desired structure, roots, interval endpoints, factorization, or graph features;
2. construct an exact semantic object;
3. derive the displayed form through controlled reversible transforms;
4. solve/normalize with a primary exact oracle;
5. independently validate by expansion, substitution, interval sampling around all critical points, or a second algorithm;
6. construct distractors from named misconception transforms;
7. reject degenerate, ambiguous, or tedious cases;
8. render all representations from the semantic object.

All generation and checking runs locally in the standalone page. Development-time tests may compare against trusted symbolic systems, but no runtime CAS, backend, package download, or network access is assumed.

## 2. Category: Expression structure, notation, and evaluation

### Category purpose

Build accurate parsing of algebra before manipulation, especially precedence, grouping, substitution, and the roles of terms and factors.

### Learn

An expression is a tree of operations. Terms are separated by top-level addition/subtraction; factors are multiplied within a term. Exponents apply before unary negation. Substitute with parentheses: if `x=−2`, then `3x²=3(−2)²=12`.

### Prerequisites

Signed arithmetic and operation precedence.

### Common misconceptions

- Reading `-x²` as `(-x)²`.
- Treating adjacent terms as factors or vice versa.
- Substituting a negative value without parentheses.
- Applying an exponent to a coefficient or sum outside its scope.
- Believing a variable must stand for one fixed unknown in every expression.

### Family `identify_expression_parts`

**Task.** Identify top-level terms, factors, coefficient, constant term, base, exponent, or main operation.

**Response and template.** Selection/matching: `In {expression}, identify {requested_part}.`

**Derivation.** Parse the AST and select nodes by structural role, not string splitting.

**Difficulty.** L1 monomial/binomial; L2 nested grouping/fractions; L3 distinguish top-level from inner parts.

**Examples.**

1. `5x−3` → coefficient of `x` is `5`. L1.
2. `2(x+4)` → factors are `2` and `(x+4)`. L2.
3. `−(x−1)²+3` → main operation is addition of `−(x−1)²` and `3`. L3.

**Distractors and validation.** Surface-neighbor tokens and inner nodes. Renderer spans must map directly to AST nodes.

### Family `order_of_operations_symbolic`

**Task.** Choose the next operation or evaluate a fully numeric algebra-style expression.

**Response and template.** Choice/rational: `Evaluate {expression}` or `Which operation is performed first?`

**Derivation.** Follow AST grouping, powers, unary operations, multiplication/division, then addition/subtraction.

**Difficulty.** L1 explicit parentheses; L2 unary minus/powers; L3 nested fraction bars.

**Examples.**

1. `3+2·5=13`. L1.
2. `−2²+5=1`. L2.
3. `(6−2²)/(1+1)=1`. L3.

**Distractors and validation.** Left-to-right regardless of precedence, `(-2)²`, or fraction-bar grouping ignored. Exact evaluator and AST round-trip.

### Family `substitute_evaluate`

**Task.** Evaluate an expression for one or more supplied variable values.

**Response and template.** Exact number: `Evaluate {expression} when {assignments}.`

**Derivation.** Replace variables by parenthesized exact values, then evaluate the AST.

**Difficulty.** L1 positive integer; L2 negative/fraction; L3 two variables or repeated occurrence with powers.

**Examples.**

1. `3x+1` at `x=4` → `13`. L1.
2. `x²−2x` at `x=−3` → `15`. L2.
3. `2a−ab+b²` at `a=1/2,b=−2` → `5`. L3.

**Distractors and validation.** Substitute once only, lose negative signs, or square only magnitude inconsistently. Exact environment evaluator.

### Family `translate_words_expression`

**Task.** Translate a controlled verbal relationship into an expression or match an expression to words.

**Response and template.** Expression/choice: `Write an expression for: {verbal_template}.`

**Derivation.** Authored semantic templates map directly to ASTs: sum, difference, product, quotient, “less than,” and grouped quantities.

**Difficulty.** L1 direct phrase; L2 reversed order such as “5 less than x”; L3 grouped or nested relationship.

**Examples.**

1. “Three times x” → `3x`. L1.
2. “Five less than twice x” → `2x−5`. L2.
3. “The quotient of x+3 and twice y” → `(x+3)/(2y)`. L3.

**Distractors and validation.** Reverse subtraction/division or omit grouping. Exact AST mapping and semantic-equivalence rejection among options.

### Family `property_identification`

**Task.** Identify or apply a named algebraic property in one controlled step.

**Response and template.** Matching: `{before} → {after}. Which property justifies the step?`

**Derivation.** Match exact rewrite schema: commutative, associative, distributive, identity, inverse, or zero.

**Difficulty.** L1 numeric/simple variables; L2 distinguish commutative/associative; L3 inverse distribution or nested location.

**Examples.**

1. `a+b=b+a` → commutative addition. L1.
2. `(ab)c=a(bc)` → associative multiplication. L2.
3. `6x+6y=6(x+y)` → distributive property in reverse. L3.

**Distractors and validation.** Other property sharing operation vocabulary. Rewrite-schema matcher verifies exactly one named property.

### Family `equivalence_at_values`

**Task.** Decide whether two expressions are equivalent, or find a value that exposes non-equivalence.

**Response and template.** Yes/no or exact witness: `Are {left} and {right} equivalent for all real x in {domain}? If not, give a counterexample.`

**Derivation.** Normalize exactly; for non-equivalence generate/accept any safe value where values differ or definedness differs.

**Difficulty.** L1 obvious distribution; L2 nested expressions; L3 domain-sensitive rational pair.

**Examples.**

1. `2(x+3)` and `2x+6` → equivalent. L1.
2. `(x+1)²` and `x²+1` → not; `x=1` is a witness. L2.
3. `(x²−1)/(x−1)` and `x+1` → not equivalent on all reals because first is undefined at `1`. L3.

**Distractors and validation.** Compare appearance or one coincidental value. Polynomial/rational exact normalization plus domain comparison.

### Cross-family progression

AST-part recognition and precedence precede substitution. Translation interleaves both directions. Properties are introduced as explanations for later manipulation, and equivalence-at-values begins only after learners distinguish expression value from identity.

## 3. Category: Simplifying, collecting, and expanding

### Category purpose

Build reliable local transformations and the ability to produce a requested expression form without changing value or domain.

### Learn

Like terms have the same variable part and exponent. Distribution multiplies every term inside grouping. A minus before parentheses distributes `−1`. Expanded, collected, and factored are different forms; the prompt names the target.

### Prerequisites

Expression structure and properties.

### Common misconceptions

- Combining unlike terms.
- Adding exponents when adding terms.
- Distributing to only the first term.
- Losing a negative sign before parentheses.
- Treating `(a+b)²` as `a²+b²`.
- Cancelling terms across addition.

### Family `combine_like_terms`

**Task.** Collect like terms into polynomial standard form.

**Response and template.** Expression: `Collect like terms: {expression}.`

**Derivation.** Convert each term to coefficient times monomial key and sum coefficients by key.

**Difficulty.** L1 one variable/degree; L2 several degrees/constants; L3 rational coefficients or two variables.

**Examples.**

1. `3x+5x=8x`. L1.
2. `2x²−3x+4+x²+x−7=3x²−2x−3`. L2.
3. `(1/2)xy−2x+(3/2)xy+x=2xy−x`. L3.

**Distractors and validation.** Add exponents, combine all coefficients, or retain zero terms. Exact coefficient-map comparison.

### Family `distribute_and_collect`

**Task.** Expand one or more scalar products and collect.

**Response and template.** Expression: `Expand and collect: {expression}.`

**Derivation.** Apply distributive multiplication to every child, then canonical polynomial collection.

**Difficulty.** L1 positive scalar; L2 negative/fraction scalar; L3 two distributed groups.

**Examples.**

1. `3(x+4)=3x+12`. L1.
2. `−2(3x−5)=−6x+10`. L2.
3. `4(2x−1)−3(x+2)=5x−10`. L3.

**Distractors and validation.** Distribute once, preserve inner sign wrongly, or multiply constants only. Expand independently and compare maps.

### Family `expand_monomial_product`

**Task.** Multiply monomials using coefficient and exponent rules.

**Response and template.** Monomial: `Multiply and write in standard form: {factors}.`

**Derivation.** Multiply coefficients; add exponents for identical bases.

**Difficulty.** L1 one variable; L2 several variables/signs; L3 rational coefficient or nested power.

**Examples.**

1. `(3x)(4x²)=12x³`. L1.
2. `(−2a²b)(3ab³)=−6a³b⁴`. L2.
3. `(1/2 x²y)²(−8x)=−2x⁵y²`. L3.

**Distractors and validation.** Multiply exponents, add coefficients, or lose sign. Exact monomial tuple oracle.

### Family `expand_polynomial_products`

**Task.** Expand products/powers of small polynomials and collect.

**Response and template.** Expression: `Expand and collect: {factored_expression}.`

**Derivation.** Polynomial convolution, repeated for bounded powers.

**Difficulty.** L1 monomial×binomial; L2 binomial×binomial; L3 binomial×trinomial or cube with friendly coefficients.

**Examples.**

1. `x(x+3)=x²+3x`. L1.
2. `(x+2)(x−5)=x²−3x−10`. L2.
3. `(2x−1)(x²+3x+4)=2x³+5x²+5x−4`. L3.

**Distractors and validation.** Missing cross term, sign error, or square each term only. Convolution and point-evaluation cross-check.

### Family `special_product_identity`

**Task.** Recognize, expand, or complete square/difference-of-squares identities.

**Response and template.** Expression/matching: `Complete the identity: {template_with_gap}.`

**Derivation.** Apply `(a±b)²=a²±2ab+b²` or `(a−b)(a+b)=a²−b²`.

**Difficulty.** L1 numeric/monic; L2 coefficients; L3 inverse missing term.

**Examples.**

1. `(x+4)²=x²+8x+16`. L1.
2. `(3x−2)²=9x²−12x+4`. L2.
3. `x²+?x+25=(x+5)²` → `10`. L3.

**Distractors and validation.** Missing middle term, sign middle/square error. Exact expansion and schema binding.

### Family `simplify_nested_signs`

**Task.** Remove nested parentheses and unary signs, then collect.

**Response and template.** Expression: `Remove grouping and collect: {expression}.`

**Derivation.** Propagate multiplication by `±1` through nested additions before collection.

**Difficulty.** L1 one minus; L2 nested minus; L3 subtraction of a distributed expression.

**Examples.**

1. `−(x−3)=−x+3`. L1.
2. `2−[3−(x−1)]=x−2`. L2.
3. `−2[x−(3−2x)]=−6x+6`. L3.

**Distractors and validation.** Flip first sign only or double-flip all levels. Recursive AST transform and exact normalization.

### Family `find_simplification_error`

**Task.** Locate the first invalid line in a short manipulation and identify the rule violated.

**Response and template.** Line selection/reason: `Which is the first incorrect step, and why? {steps}`

**Derivation.** Generate a valid rewrite chain, replace one step with one named misconception transform, and validate adjacent equivalence.

**Difficulty.** L1 distribution/like terms; L2 powers/signs; L3 domain-changing cancellation.

**Examples.**

1. `3(x+2)=3x+2` → distribution missed factor on `2`. L1.
2. `2x+3x²=5x³` → unlike terms combined. L2.
3. `(x²−x)/x=x−1` “for all x” → exclusion `x≠0` lost. L3.

**Distractors and validation.** Later consequences and valid-but-unfamiliar steps. Exact equivalence/domain check for every adjacent pair.

### Cross-family progression

Combine like terms before distribution; then mix them. Monomial multiplication precedes polynomial convolution. Special products are learned both forward and inverse. Error analysis is interleaved after each operation and later introduces domain preservation.

## 4. Category: Linear equations, proportions, and formulas

### Category purpose

Build reversible balance operations, solution classification, and flexible isolation of variables.

### Learn

An equation states two expressions are equal. Apply the same valid operation to both sides and simplify. A linear equation may have one solution, no solution, or every real number as a solution. Check by substitution in the original equation.

### Prerequisites

Distribution, collection, signed fractions.

### Common misconceptions

- Moving a term by changing its sign without understanding the balance operation.
- Applying an operation to only part of one side.
- Dividing by a coefficient that may be zero in a parameter case.
- Declaring `0=0` to mean `x=0`.
- Cross-multiplying proportions incorrectly.
- Clearing denominators without multiplying every term.

### Family `linear_one_two_step`

**Task.** Solve a one- or two-step linear equation.

**Response and template.** Exact number: `Solve for x: {equation}.`

**Derivation.** Undo addition/subtraction, then nonzero multiplication/division; generate backward from exact solution.

**Difficulty.** L1 `x+a=b`; L2 `ax+b=c`; L3 rational coefficients.

**Examples.**

1. `x+7=12` → `x=5`. L1.
2. `3x−4=11` → `x=5`. L2.
3. `(2/3)x+5=1` → `x=−6`. L3.

**Distractors and validation.** Wrong inverse sign, divide only one term, or reciprocal error. Exact substitution in original.

### Family `linear_distribution_equation`

**Task.** Solve after distributing/collecting one or both sides.

**Response and template.** Exact number: `Solve: {equation}.`

**Derivation.** Normalize both sides to `ax+b`, then solve `(aL−aR)x=bR−bL` when coefficient difference is nonzero.

**Difficulty.** L1 one distributed side; L2 both sides; L3 nested/fractional grouping.

**Examples.**

1. `2(x+3)=14` → `x=4`. L1.
2. `3(x−2)+1=2(x+4)` → `x=13`. L2.
3. `(x−1)/2−(x+3)/3=1` → `x=15`. L3.

**Distractors and validation.** Partial distribution, denominator clearing only one term, or lost sign. Polynomial-normal-form solver plus substitution.

### Family `linear_variables_both_sides`

**Task.** Solve a linear equation with variable terms on both sides.

**Response and template.** Exact number: `Solve: {left}={right}.`

**Derivation.** Collect variable terms on one side and constants on the other, avoiding division until coefficient is known nonzero.

**Difficulty.** L1 integer forms; L2 distributions; L3 solution constructed to be fractional.

**Examples.**

1. `5x+2=3x+10` → `x=4`. L1.
2. `4(x−1)=2(x+5)` → `x=7`. L2.
3. `3x−2=5x+1` → `x=−3/2`. L3.

**Distractors and validation.** Add coefficients across equality or reverse constant sign only. Exact coefficient-difference oracle.

### Family `classify_linear_equation`

**Task.** Classify as one solution, no solution, or all real numbers, optionally reporting the solution.

**Response and template.** Choice plus number: `Classify and solve: {equation}.`

**Derivation.** Normalize to `ax=b`: `a≠0` one solution; `a=0,b≠0` none; `a=0,b=0` all reals.

**Difficulty.** L1 visibly reduced; L2 hidden by distribution; L3 parameter choice controls class.

**Examples.**

1. `2x+1=2x+3` → no solution. L1.
2. `3(x+2)=3x+6` → all real numbers. L2.
3. `(k−2)x=6`; at `k=2` no solution, otherwise `6/(k−2)`. L3.

**Distractors and validation.** `x=0` from `0=0`, or divide by zero. Symbolic coefficient classification.

### Family `solve_literal_formula`

**Task.** Rearrange a formula to isolate a requested variable under stated nonzero/domain assumptions.

**Response and template.** Expression: `Solve {formula} for {target}, assuming {conditions}.`

**Derivation.** Apply inverse AST operations while tracking conditions; verify by symbolic substitution into original identity.

**Difficulty.** L1 additive/multiplicative; L2 target appears in one grouped term; L3 target appears twice and must be factored.

**Examples.**

1. `y=mx+b` for `b` → `b=y−mx`. L1.
2. `A=(h/2)(a+b)` for `h` → `h=2A/(a+b)`, `a+b≠0`. L2.
3. `P=ax+bx` for `x` → `x=P/(a+b)`, `a+b≠0`. L3.

**Distractors and validation.** Invert only one factor/term or omit required nonzero condition. Identity substitution and domain audit.

### Family `solve_proportion`

**Task.** Solve an exact proportion or determine whether two ratios are proportional.

**Response and template.** Exact number/yes-no: `Solve {a}/{b}={c}/{d} for {variable}.`

**Derivation.** Require denominators nonzero, cross-multiply as equality of products, then solve.

**Difficulty.** L1 one missing numerator; L2 variable in denominator; L3 affine numerator/denominator with exclusion.

**Examples.**

1. `x/5=6/10` → `x=3`. L1.
2. `4/x=2/7` → `x=14`, with `x≠0`. L2.
3. `(x+1)/(x−2)=2/3` → `x=7`, excluding `2`. L3.

**Distractors and validation.** Multiply corresponding rather than diagonal terms, invert one ratio, or retain excluded value. Original-equation substitution.

### Family `linear_model_from_context`

**Task.** Build and solve a one-variable linear equation from a controlled context.

**Response and template.** Equation plus number: `{scenario} Write an equation for {unknown}, then solve.`

**Derivation.** Scenario template supplies quantity roles and a semantic equation; solving uses exact linear oracle.

**Difficulty.** L1 total from equal groups; L2 fixed plus rate; L3 mixture/consecutive values with one relation.

**Examples.**

1. 3 equal tickets plus fee 2 cost 20 → `3x+2=20`, `x=6`. L1.
2. Plan A costs `10+4m` and total is 38 → `m=7`. L2.
3. Three consecutive integers sum to 72 → `x+(x+1)+(x+2)=72`, first `23`. L3.

**Distractors and validation.** Wrong fixed/rate placement or off-by-one consecutive terms. Units/roles checked and answer substituted in scenario.

### Family `equation_next_step`

**Task.** Choose a valid and useful next operation or fill one missing equation line.

**Response and template.** Choice/expression: `What is a valid next step toward solving {equation}?`

**Derivation.** Apply candidate balance operation to entire sides; label valid/useful, valid/redundant, or invalid.

**Difficulty.** L1 inverse operation; L2 clear fractions/distribute choice; L3 avoid dividing by a potentially zero parameter.

**Examples.**

1. `x+5=9` → subtract 5 from both sides. L1.
2. `(x−1)/3=4` → multiply both sides by 3. L2.
3. `(k−2)x=6` → cannot divide by `k−2` without case `k=2`. L3.

**Distractors and validation.** Operation on one side/one term or unsafe division. Exact relation-equivalence and condition tracking.

### Cross-family progression

One/two-step equations establish balance, followed by distribution and variables on both sides. Classification is interleaved early so “solve” does not always imply one answer. Proportions and formulas reuse the same operations with domain conditions. Context translation and next-step selection diagnose setup separately from arithmetic.

## 5. Category: Inequalities and absolute value

### Category purpose

Build solution-set reasoning, including direction reversal, interval unions, boundary inclusion, and distance interpretation.

### Learn

Solve a linear inequality like an equation, except multiplying or dividing by a negative reverses the sign. An inequality answer is usually a set of values. Absolute value is distance from zero: `|u|<a` means inside a band and `|u|>a` means outside it when `a>0`.

### Prerequisites

Linear equations, signed order, number line.

### Common misconceptions

- Reversing for subtraction but not negative multiplication, or reversing unnecessarily.
- Writing one number instead of a solution set.
- Swapping “and” with “or.”
- Including an endpoint for `<` or excluding it for `≤`.
- Treating infinity as an included endpoint.
- Splitting every absolute inequality into the same pattern.

### Family `linear_inequality`

**Task.** Solve a one-variable linear inequality and represent its solution.

**Response and template.** Interval builder: `Solve and write in interval notation: {inequality}.`

**Derivation.** Normalize to `ax ⋚ b`; divide by `a`, reversing when `a<0`.

**Difficulty.** L1 positive coefficient; L2 negative coefficient; L3 distribution/variables both sides.

**Examples.**

1. `2x+1<7` → `x<3`, `(-∞,3)`. L1.
2. `−3x≥6` → `x≤−2`, `(-∞,−2]`. L2.
3. `4−2(x+1)>x−7` → `x<3`. L3.

**Distractors and validation.** No reversal, wrong endpoint, equation-only answer. Exact boundary and test-point oracle.

### Family `classify_linear_inequality`

**Task.** Determine whether a reduced linear inequality has an interval, no solutions, or all real numbers.

**Response and template.** Choice/interval: `Solve and classify: {inequality}.`

**Derivation.** Reduce to `ax ⋚ b`; when `a=0`, evaluate the constant proposition.

**Difficulty.** L1 visible constant; L2 cancellation after distribution; L3 parameter cases.

**Examples.**

1. `x+2<x+5` → all reals. L1.
2. `3(x−1)≥3x+1` → no solutions. L2.
3. `(k−1)x>2` → cases depend on sign of `k−1`. L3.

**Distractors and validation.** Always isolate x or divide by zero. Symbolic sign/case oracle.

### Family `compound_linear_inequality`

**Task.** Solve an “and” chain or “or” pair and normalize the interval union.

**Response and template.** Interval union: `Solve: {compound_inequality}.`

**Derivation.** Solve component inequalities, then intersect for “and” or union for “or.”

**Difficulty.** L1 three-part chain; L2 separate inequalities; L3 overlapping/touching intervals requiring normalization.

**Examples.**

1. `−1≤2x+3<7` → `−2≤x<2`, `[-2,2)`. L1.
2. `x<−3 or x≥4` → `(-∞,−3)∪[4,∞)`. L2.
3. `x≤2 or 1<x<5` → `(-∞,5)`. L3.

**Distractors and validation.** Union/intersection swap or endpoint error. Interval-set Boolean operations and boundary tests.

### Family `interval_number_line_translation`

**Task.** Translate among inequality, interval notation, set-builder notation, and a number-line graph.

**Response and template.** Matching/structured interval: `Which interval represents {inequality_or_graph}?`

**Derivation.** Convert semantic interval components; open/closed endpoints follow strictness.

**Difficulty.** L1 ray; L2 bounded interval; L3 disconnected union.

**Examples.**

1. `x≥2` ↔ `[2,∞)`. L1.
2. `−3<x≤1` ↔ `(-3,1]`. L2.
3. `x≤−1 or x>4` ↔ `(-∞,−1]∪(4,∞)`. L3.

**Distractors and validation.** Bracket infinity, swapped endpoint types, or use intersection. Semantic renderer/table round-trip.

### Family `absolute_value_equation`

**Task.** Solve an absolute-value equation with linear interior.

**Response and template.** Finite set/classification: `Solve over the reals: |{linear}|={a}.`

**Derivation.** If `a<0`, none; if `a=0`, solve interior zero; if `a>0`, solve interior `=a` and `=−a`.

**Difficulty.** L1 `|x|=a`; L2 affine interior; L3 absolute expression on one side after isolation.

**Examples.**

1. `|x|=5` → `{−5,5}`. L1.
2. `|2x−1|=7` → `{−3,4}`. L2.
3. `3|x+2|−4=8` → `{−6,2}`. L3.

**Distractors and validation.** Positive branch only, set interior equal to `±` before isolating abs, or accept negative distance. Substitute all roots.

### Family `absolute_value_inequality`

**Task.** Solve a linear absolute-value inequality.

**Response and template.** Interval union: `Solve: |{linear}| {comparison} {a}.`

**Derivation.** Use inside interval for `<,≤`; outside rays for `>,≥`; handle `a≤0` cases directly.

**Difficulty.** L1 centered at zero; L2 shifted/scaled; L3 non-positive bound or isolation first.

**Examples.**

1. `|x|<3` → `(-3,3)`. L1.
2. `|2x−4|≥6` → `(-∞,−1]∪[5,∞)`. L2.
3. `|x+1|<0` → no solutions. L3.

**Distractors and validation.** And/or reversal or negative-bound mishandling. Interval oracle plus critical/test points.

### Family `polynomial_sign_chart`

**Task.** Use given/factorable zeros and multiplicities to solve a polynomial inequality.

**Response and template.** Sign chart/interval: `Solve {factored_polynomial} {comparison} 0.`

**Derivation.** Sort real zeros, determine sign on intervals by factor signs; even multiplicity does not flip, odd does.

**Difficulty.** L1 two simple roots; L2 three roots/scalar sign; L3 repeated root and non-strict inclusion.

**Examples.**

1. `(x−1)(x+2)>0` → `(-∞,−2)∪(1,∞)`. L1.
2. `−(x−3)(x+1)≤0` → `(-∞,−1]∪[3,∞)`. L2.
3. `(x−2)²(x+1)<0` → `(-∞,−1)`; no sign flip at 2. L3.

**Distractors and validation.** Alternate sign at every distinct root or omit endpoints. Exact sign sampling per interval and root inclusion.

### Cross-family progression

Single inequalities establish reversal and set answers. Translation among representations is interleaved immediately. Compound inequalities precede absolute inequalities, whose “inside/outside” structure reuses intersection/union. Polynomial sign charts wait until factoring basics are available and then prepare rational inequalities.

## 6. Category: Polynomials and factorization

### Category purpose

Build structural fluency with polynomial form, arithmetic, division, factors, roots, and complete factorization.

### Learn

A polynomial is a finite sum of non-negative integer powers. Standard form exposes degree and leading coefficient; factored form exposes zeros. Multiplication convolves terms. Factoring reverses expansion and must continue until every factor is irreducible under the requested coefficient domain.

### Prerequisites

Collection, distribution, exponent rules for non-negative integers.

### Common misconceptions

- Calling expressions with variables in denominators polynomials.
- Adding degrees during polynomial addition.
- Omitting zero placeholders in division.
- Forgetting a GCF.
- Factoring a sum of squares over the reals.
- Using zero-product reasoning when the product does not equal zero.
- Confusing factor `x−r` with root `−r`.

### Family `polynomial_classify_features`

**Task.** Decide whether an expression is a polynomial and identify degree, leading coefficient, and term count after collection.

**Response and template.** Named fields/choice: `For {expression}, classify it and give {features}.`

**Derivation.** Normalize polynomial AST; reject negative/fractional variable exponents, variables in denominators, or unsupported functions.

**Difficulty.** L1 standard form; L2 uncollected form; L3 near-miss non-polynomial.

**Examples.**

1. `3x²−x+5` → degree 2, leading coefficient 3. L1.
2. `x³−x³+4x` → degree 1 after collection. L2.
3. `x²+1/x` → not a polynomial. L3.

**Distractors and validation.** Largest coefficient as degree or count before cancellation. Exact polynomial parser/normalizer.

### Family `polynomial_add_subtract`

**Task.** Add or subtract polynomials in standard form.

**Response and template.** Collected expression: `Compute ({P}) {op} ({Q}).`

**Derivation.** Add/subtract coefficient maps by exponent.

**Difficulty.** L1 same degree; L2 missing degrees/signs; L3 two variables or rational coefficients.

**Examples.**

1. `(2x+3)+(x−5)=3x−2`. L1.
2. `(x³−2x+1)−(2x³+x²−4)=−x³−x²−2x+5`. L2.
3. `(1/2 x²y−3xy²)−(−1/2 x²y+xy²)=x²y−4xy²`. L3.

**Distractors and validation.** Fail to distribute subtraction or combine unlike powers. Exact coefficient map.

### Family `polynomial_multiply`

**Task.** Multiply two small polynomials and collect.

**Response and template.** Expanded expression: `Multiply and write in standard form: ({P})({Q}).`

**Derivation.** Convolve exact coefficient maps.

**Difficulty.** L1 monomial/binomial; L2 two binomials; L3 degree-2 by degree-2 with sparse terms.

**Examples.**

1. `2x(x²−3)=2x³−6x`. L1.
2. `(x−2)(x+5)=x²+3x−10`. L2.
3. `(x²+x−1)(x²−2)=x⁴+x³−3x²−2x+2`. L3.

**Distractors and validation.** Missing cross-products or degree addition error. Convolution and exact evaluations.

### Family `polynomial_division`

**Task.** Divide by a monomial or linear polynomial and report quotient/remainder.

**Response and template.** Two fields: `Divide {P} by {D}. Give quotient and remainder.`

**Derivation.** Exact long division or synthetic division when divisor `x−r`; enforce `P=DQ+R`, `deg R<deg D`.

**Difficulty.** L1 monomial division; L2 exact linear division; L3 nonzero remainder/missing degree.

**Examples.**

1. `(6x³−3x²)/3x=2x²−x`. L1.
2. `(x²−1)/(x−1)` → quotient `x+1`, remainder 0. L2.
3. `(2x³+3x−5)/(x+2)` → quotient `2x²−4x+11`, remainder `−27`. L3.

**Distractors and validation.** Divide leading term only, omit zero coefficient, or remainder wrong sign. Reconstruction identity.

### Family `factor_gcf`

**Task.** Extract the greatest common monomial factor under normalized sign convention.

**Response and template.** Factored expression: `Factor out the greatest common factor: {P}.`

**Derivation.** Numeric GCD of coefficients and minimum exponent of every shared variable; normalize residual leading coefficient positive.

**Difficulty.** L1 numeric GCF; L2 variables; L3 negative leading term or rational normalization.

**Examples.**

1. `6x+9=3(2x+3)`. L1.
2. `12x³y−8x²y²=4x²y(3x−2y)`. L2.
3. `−10x³+15x²=−5x²(2x−3)`. L3.

**Distractors and validation.** Non-greatest factor, use maximum exponent, or fail to extract sign. Exact expansion and maximality check.

### Family `factor_special_patterns`

**Task.** Factor differences of squares and perfect-square trinomials completely.

**Response and template.** Factored expression: `Factor completely over the integers: {P}.`

**Derivation.** Match normalized schemas recursively after GCF extraction.

**Difficulty.** L1 `x²−a²`; L2 coefficient squares/perfect-square trinomial; L3 repeated recursive difference.

**Examples.**

1. `x²−25=(x−5)(x+5)`. L1.
2. `9x²−12x+4=(3x−2)²`. L2.
3. `x⁴−16=(x−2)(x+2)(x²+4)`. L3 over integers.

**Distractors and validation.** Factor sum of squares or wrong middle sign. Expand and verify irreducibility of residual factors.

### Family `factor_quadratic`

**Task.** Factor a quadratic over the integers or classify it as irreducible there.

**Response and template.** Factor cards/irreducible choice: `Factor completely over the integers: {ax²+bx+c}.`

**Derivation.** Construct from integer linear factors/GCF or use discriminant/perfect-square test for irreducibility.

**Difficulty.** L1 monic; L2 non-monic; L3 GCF/sign or irreducible contrast.

**Examples.**

1. `x²+5x+6=(x+2)(x+3)`. L1.
2. `6x²+x−2=(3x+2)(2x−1)`. L2.
3. `2x²+2x+2=2(x²+x+1)`, residual irreducible over integers. L3.

**Distractors and validation.** Correct product `ac` but wrong sum, sign pair errors, or stop before GCF. Exact expansion and integer-factor completeness.

### Family `factor_grouping`

**Task.** Factor four-term polynomials by grouping or a constructed shared binomial.

**Response and template.** Factored expression: `Factor completely: {P}.`

**Derivation.** Generate from `(A+B)C` then expand/reorder; recover common binomial after pair GCFs.

**Difficulty.** L1 adjacent grouping; L2 reorder required; L3 sign extraction to match binomials.

**Examples.**

1. `x³+2x²+3x+6=(x+2)(x²+3)`. L1.
2. `2x²−6x+x−3=(2x+1)(x−3)`. L2.
3. `3x³−6x²−5x+10=(x−2)(3x²−5)`. L3.

**Distractors and validation.** Group without common factor or mismatched signs. Exact expansion and factor-domain completeness.

### Family `remainder_factor_root_link`

**Task.** Use the remainder/factor theorem to evaluate, find a parameter, or test a factor/root.

**Response and template.** Number/yes-no: `For P(x)={P}, determine {P(r)_or_factor_claim}.`

**Derivation.** Remainder on division by `x−r` is `P(r)`; `x−r` is a factor iff `P(r)=0`.

**Difficulty.** L1 evaluate; L2 test factor; L3 solve coefficient parameter from `P(r)=0`.

**Examples.**

1. `P=x²+1`, remainder at division by `x−2` → `P(2)=5`. L1.
2. `x−3` factor of `x²−5x+6` because `P(3)=0`. L2.
3. `P=x²+kx−6`, factor `x−2` → `4+2k−6=0`, `k=1`. L3.

**Distractors and validation.** Substitute `−r`, confuse root/factor sign, or report quotient. Evaluation and division oracles agree.

### Family `solve_factored_polynomial`

**Task.** Solve a degree 2–4 polynomial equation by complete factorization and the zero-product property.

**Response and template.** Finite real set: `Solve over the reals: {polynomial_equation}.`

**Derivation.** Move all terms to zero, factor from a known generated integer factorization, solve each linear/quadratic factor, and deduplicate roots.

**Difficulty.** L1 factored form; L2 expanded cubic with GCF; L3 repeated factors and an irreducible quadratic.

**Examples.**

1. `x(x−3)(x+2)=0` → `{−2,0,3}`. L1.
2. `x³−4x²=0` → `x²(x−4)`, roots `{0,4}`. L2.
3. `(x−1)²(x²+1)=0` over reals → `{1}`. L3.

**Distractors and validation.** Apply zero product before zero, report multiplicity as duplicate solutions, or treat sum of squares as real roots. Exact factor expansion and original substitution.

### Cross-family progression

Classification and addition precede multiplication/division. GCF is always checked before pattern/quadratic/group factoring. Expansion and factoring are interleaved as inverse skills. Remainder/factor/root links follow division and prepare polynomial equations.

## 7. Category: Quadratics and bounded complex numbers

### Category purpose

Build method selection and movement among roots, factors, vertex, discriminant, and graph—not just formula substitution.

### Learn

A quadratic `ax²+bx+c`, `a≠0`, may be solved by factoring, square roots, completing the square, or the quadratic formula. The discriminant `D=b²−4ac` classifies real roots. Standard, factored, and vertex forms reveal different features.

### Prerequisites

Factoring, radicals, linear equations, graph coordinates.

### Common misconceptions

- Applying zero-product property before setting the equation to zero.
- Taking only the positive square root.
- Dividing only part of the quadratic-formula numerator by `2a`.
- Using `b` instead of `−b`.
- Claiming negative discriminant means no complex roots.
- Reading root signs directly from `(x−r)`.
- Confusing vertex x-coordinate with a root.

### Family `solve_quadratic_factoring`

**Task.** Solve a factorable quadratic equation.

**Response and template.** Finite solution set: `Solve over the reals by factoring: {equation}.`

**Derivation.** Move all terms to zero, factor completely, set each nonconstant factor to zero.

**Difficulty.** L1 already zero/factored; L2 monic expanded; L3 non-monic or equation needs rearrangement.

**Examples.**

1. `(x−2)(x+3)=0` → `{−3,2}`. L1.
2. `x²−5x+6=0` → `{2,3}`. L2.
3. `2x²+x=6` → `2x²+x−6=(2x−3)(x+2)`, roots `{−2,3/2}`. L3.

**Distractors and validation.** Factor signs reversed, zero-product used before zero, one root omitted. Original substitution and factor expansion.

### Family `solve_quadratic_square_root`

**Task.** Solve a quadratic reducible to `(x−h)²=k`.

**Response and template.** Finite set/classification: `Solve over the reals: {square_equation}.`

**Derivation.** Isolate square; for `k<0` no real solutions, `k=0` one, `k>0` `x=h±sqrt(k)`.

**Difficulty.** L1 `x²=k`; L2 shifted/scaled square; L3 non-perfect-square exact radical.

**Examples.**

1. `x²=16` → `{−4,4}`. L1.
2. `3(x−2)²=27` → `{−1,5}`. L2.
3. `(x+1)²=7` → `{−1−sqrt(7),−1+sqrt(7)}`. L3.

**Distractors and validation.** Positive root only, `h` sign wrong, or `sqrt(a+b)` splitting. Exact squaring/substitution.

### Family `complete_the_square`

**Task.** Rewrite a quadratic in vertex/square form or identify the balancing constant.

**Response and template.** Expression/named field: `Complete the square: {quadratic}.`

**Derivation.** Factor leading coefficient if needed; add/subtract square of half the linear coefficient inside normalized bracket.

**Difficulty.** L1 monic even `b`; L2 odd/fractional vertex; L3 non-unit leading coefficient.

**Examples.**

1. `x²+6x+2=(x+3)²−7`. L1.
2. `x²−5x+1=(x−5/2)²−21/4`. L2.
3. `2x²+8x−3=2(x+2)²−11`. L3.

**Distractors and validation.** Use `b²`, forget compensation, or mishandle outside coefficient. Exact expansion.

### Family `quadratic_formula`

**Task.** Solve a quadratic using the formula and simplify exact roots.

**Response and template.** Finite set: `Use the quadratic formula to solve over {reals_or_complex}: {equation}.`

**Derivation.** Normalize `ax²+bx+c=0`, compute `D`, substitute with full numerator grouping, normalize radicals/complex parts.

**Difficulty.** L1 perfect-square `D`; L2 non-square positive `D`; L3 negative `D` in complex mode.

**Examples.**

1. `x²−x−6=0` → `{−2,3}`. L1.
2. `2x²−4x−1=0` → `{1±sqrt(6)/2}`. L2.
3. `x²+4x+13=0` → `{-2±3i}`. L3.

**Distractors and validation.** Wrong `−b`, denominator only under radical term, or `sqrt(−D)` left real. Exact original substitution.

### Family `discriminant_root_classification`

**Task.** Classify roots or find a parameter yielding a requested root pattern.

**Response and template.** Choice/parameter: `Use the discriminant to determine {root_class_or_parameter}.`

**Derivation.** Compute `D=b²−4ac`: positive two distinct real, zero one repeated real, negative conjugate non-real pair.

**Difficulty.** L1 classify numeric; L2 distinguish rational/irrational using perfect-square `D`; L3 solve parameter inequality/equality.

**Examples.**

1. `x²+2x+5` has `D=−16` → two non-real roots. L1.
2. `2x²+x−1`, `D=9` → two rational roots. L2.
3. `x²+kx+4` has one repeated root when `k=±4`. L3.

**Distractors and validation.** Sign classification reversed or one `k` branch omitted. Exact discriminant and generated-root cross-check.

### Family `quadratic_forms_features`

**Task.** Read roots, vertex, axis, intercept, or opening from standard/factored/vertex form.

**Response and template.** Named fields: `For f(x)={form}, determine {features}.`

**Derivation.** Factored roots; vertex `(h,k)` from `a(x−h)²+k`; axis `x=h`; y-intercept `f(0)`; sign of `a` controls opening.

**Difficulty.** L1 one revealing form; L2 several features; L3 convert form or infer missing feature.

**Examples.**

1. `(x−2)(x+5)` → roots `2,−5`. L1.
2. `−2(x−3)²+4` → vertex `(3,4)`, opens down. L2.
3. `x²−6x+5=(x−3)²−4` → axis 3, vertex `(3,−4)`. L3.

**Distractors and validation.** Root/vertex sign errors or y-intercept equals `c` when not standard form without evaluating. Exact conversion/evaluation.

### Family `complex_number_arithmetic`

**Task.** Simplify bounded sums, products, quotients, powers of `i`, or conjugates.

**Response and template.** Complex exact: `Write in a+bi form: {expression}.`

**Derivation.** Pair arithmetic with `i²=−1`; quotient multiplies by conjugate and normalizes denominator.

**Difficulty.** L1 powers/addition; L2 multiplication; L3 simple quotient/conjugate norm.

**Examples.**

1. `i³=−i`. L1.
2. `(2+3i)(1−i)=5+i`. L2.
3. `(1+i)/(1−i)=i`. L3.

**Distractors and validation.** `i²=1`, multiply components only, or fail conjugate sign. Exact pair oracle.

### Family `choose_quadratic_method`

**Task.** Choose an efficient valid solving method and identify the structural cue.

**Response and template.** Method/reason matching: `Which method is most efficient for {quadratic_equation}, and why?`

**Derivation.** A versioned decision rubric prefers square-root form, visible integer factoring, completing-square/vertex requests, then quadratic formula as general fallback. Other valid methods are not called incorrect, only less direct.

**Difficulty.** L1 visible square/factors; L2 expanded factorable versus nonfactorable; L3 method constrained by requested output such as vertex form.

**Examples.**

1. `(x−2)²=9` → square-root method. L1.
2. `x²+5x+6=0` → factoring is direct. L2.
3. `2x²+x−7=0` with nonsquare discriminant → quadratic formula. L3.

**Distractors and validation.** Zero-product without factoring/zero side, square roots on an unsquared sum, or “cannot solve.” Rubric and all offered method preconditions validated.

### Cross-family progression

Factoring and square-root methods precede completing square and formula. Method-selection prompts should mix them after basic mastery. Discriminant classification precedes negative-discriminant formula cases. Quadratic forms and graphs are interleaved so roots and vertex remain meaningful. Complex arithmetic is unlocked only when non-real roots appear.

## 8. Category: Rational expressions and equations

### Category purpose

Build fraction-like algebra while preserving polynomial structure and original domain exclusions.

### Learn

A rational expression is a polynomial quotient. Factor before cancelling, and cancel common **factors**, never terms. Record values that made any original denominator zero. Rational equations are solved after clearing denominators, but every candidate must be checked in the original.

### Prerequisites

Polynomial factoring, fraction arithmetic, linear/quadratic equations.

### Common misconceptions

- Cancelling terms across addition.
- Cancelling a factor from only part of a sum.
- Losing original excluded values after reduction.
- Adding denominators directly.
- Multiplying by an LCD incompletely.
- Accepting a root that zeroes an original denominator.

### Family `rational_domain`

**Task.** Find the real domain/excluded values of a rational expression.

**Response and template.** Finite exclusion set/interval: `State the domain of {expression}.`

**Derivation.** Factor every original denominator and solve where each equals zero; domain is real numbers minus the union.

**Difficulty.** L1 linear denominator; L2 factorable quadratic; L3 several denominators/cancelled-looking factor.

**Examples.**

1. `1/(x−3)` → `x≠3`. L1.
2. `(x+1)/(x²−4)` → exclude `−2,2`. L2.
3. `(x−1)/(x−1)` still excludes `1`. L3.

**Distractors and validation.** Zeros of numerator or reduced denominator only. Exact original-denominator zero set.

### Family `simplify_rational_expression`

**Task.** Reduce a rational expression and retain original exclusions.

**Response and template.** Expression plus exclusions: `Reduce {expression}; state all excluded values.`

**Derivation.** Factor numerator/denominator, cancel polynomial GCD, normalize denominator leading sign, preserve original domain.

**Difficulty.** L1 monomial factors; L2 quadratic factors; L3 multiple cancellations/sign normalization.

**Examples.**

1. `6x²/9x=2x/3`, `x≠0`. L1.
2. `(x²−9)/(x−3)=x+3`, `x≠3`. L2.
3. `(x²−x)/(x²−1)=x/(x+1)`, exclude `−1,1`. L3.

**Distractors and validation.** Term cancellation or drop hole. Exact cross-product equality on intersection plus exclusion-set equality.

### Family `multiply_divide_rational`

**Task.** Multiply/divide rational expressions and reduce.

**Response and template.** Reduced expression plus exclusions: `Compute and reduce: {expression}.`

**Derivation.** For division multiply by reciprocal, add zero restrictions on the divisor expression, factor/cancel, preserve every original restriction.

**Difficulty.** L1 monomials; L2 factorable binomials; L3 division with added numerator-zero restriction.

**Examples.**

1. `(x/3)(6/x)=2`, `x≠0`. L1.
2. `(x²−4)/(x+1) · (x+1)/(x−2)=x+2`, exclude `−1,2`. L2.
3. `(x/(x−1))÷(x²/(x−1))=1/x`, exclude `0,1`. L3.

**Distractors and validation.** Divide straight across without reciprocal or lose restrictions. Symbolic reduction and original-operation definedness.

### Family `add_subtract_rational`

**Task.** Add/subtract rational expressions using an LCD and reduce.

**Response and template.** Reduced expression plus exclusions: `Compute: {left} {op} {right}.`

**Derivation.** Factor denominators, construct polynomial LCM, scale every numerator, combine, reduce while retaining original exclusions.

**Difficulty.** L1 common denominator; L2 relatively prime linear denominators; L3 shared factors and reducible result.

**Examples.**

1. `2/x+3/x=5/x`, `x≠0`. L1.
2. `1/x+1/(x+1)=(2x+1)/[x(x+1)]`, exclude `0,−1`. L2.
3. `1/(x−1)−2/(x²−1)=(x−1)/(x²−1)=1/(x+1)`, exclude `−1,1`. L3.

**Distractors and validation.** Add denominators or fail numerator scaling. Exact common-denominator and cross-product check.

### Family `solve_rational_equation`

**Task.** Solve a bounded rational equation and reject excluded candidates.

**Response and template.** Finite set: `Solve over the reals: {equation}.`

**Derivation.** Record restrictions, multiply by LCD, solve resulting degree `≤2`, test every candidate in original.

**Difficulty.** L1 constant denominator; L2 variable linear denominators; L3 extraneous excluded candidate.

**Examples.**

1. `x/3=4` → `{12}`. L1.
2. `1/x+1/2=1` → `{2}`. L2.
3. `1/(x−1)=x/(x−1)` yields candidate `x=1`, excluded → no solution. L3.

**Distractors and validation.** Keep excluded root, incomplete LCD multiplication, or denominator zero. Original AST substitution.

### Family `rational_inequality`

**Task.** Solve a factorable rational inequality with a sign chart.

**Response and template.** Interval union: `Solve {rational_expression} {comparison} 0.`

**Derivation.** Factor numerator/denominator, mark zeros and undefined points, sample signs between critical values; include numerator zeros only for non-strict, never denominator zeros.

**Difficulty.** L1 one zero/pole; L2 two/three critical points; L3 repeated factors/non-strict endpoints.

**Examples.**

1. `(x−1)/(x+2)>0` → `(-∞,−2)∪(1,∞)`. L1.
2. `x/[(x−2)(x+1)]≤0` → `(-∞,−1)∪[0,2)`. L2.
3. `(x−1)²/(x+3)<0` → `(-∞,−3)`; even zero does not flip. L3.

**Distractors and validation.** Include poles or alternate signs mechanically. Exact sign per interval and boundary audit.

### Family `direct_inverse_variation`

**Task.** Construct/use direct, inverse, or joint variation equations.

**Response and template.** Formula/number: `{variation_statement}; given {values}, find {target}.`

**Derivation.** Translate to `y=kx^n`, `y=k/x^n`, or declared joint product; solve exact `k`, then target.

**Difficulty.** L1 direct; L2 inverse; L3 joint/power variation or compare scaling.

**Examples.**

1. `y` varies directly with `x`, `y=12` at `x=3` → `k=4`. L1.
2. `y=k/x`, `y=5` at `x=2`; at `x=10`, `y=1`. L2.
3. `z=kxy²`, and `z=24` at `x=3,y=2`; then `k=2`, so at `x=5,y=3`, `z=90`. L3.

**Distractors and validation.** Swap direct/inverse or omit exponent. Substitute both known and target states.

### Cross-family progression

Domain is taught before reduction and accompanies every later family. Multiplication/division precede addition/subtraction. Rational equations follow arithmetic and factorization; rational inequalities follow polynomial sign charts. Variation supplies meaningful but controlled rational models.

## 9. Category: Exponents, radicals, exponentials, and logarithms

### Category purpose

Build exact power/root manipulation and inverse-function reasoning under real-domain conditions.

### Learn

For the same nonzero base, multiplication adds exponents, division subtracts, and a power of a power multiplies. Negative exponents mean reciprocals. Radicals are rational powers with domain conditions. Logarithms answer “what exponent?” and invert exponentials.

### Prerequisites

Factoring, rational expressions, linear/quadratic equations.

### Common misconceptions

- Applying exponent laws across addition.
- Multiplying exponents when multiplying like bases.
- Treating a negative exponent as a negative value.
- Splitting `sqrt(a+b)` or `log(a+b)`.
- Replacing `sqrt(x²)` with `x` for negative x.
- Dropping logarithm argument restrictions.
- Equating exponents when bases are not equal/injective under the declared domain.

### Family `integer_exponent_laws`

**Task.** Simplify products, quotients, and powers using integer exponent laws.

**Response and template.** Expression: `Simplify and write with positive exponents: {expression}.`

**Derivation.** Normalize each base’s exponent sum; move negative powers across fraction bar; simplify coefficient separately.

**Difficulty.** L1 product; L2 quotient/power; L3 several variables and negative exponents.

**Examples.**

1. `x³x⁴=x⁷`. L1.
2. `(a³)²/a=a⁵`, `a≠0`. L2.
3. `6x⁻²y³/(3xy⁻¹)=2y⁴/x³`. L3.

**Distractors and validation.** Multiply exponents or make coefficient negative. Exact exponent-map oracle and domain conditions.

### Family `zero_negative_exponents`

**Task.** Evaluate/rewrite zero and negative powers with valid base restrictions.

**Response and template.** Exact expression: `Rewrite {power_expression} without negative exponents.`

**Derivation.** `a⁰=1` and `a^(−n)=1/a^n` for `a≠0`.

**Difficulty.** L1 numeric; L2 variable; L3 nested negative power/fraction.

**Examples.**

1. `5⁰=1`. L1.
2. `x⁻³=1/x³`, `x≠0`. L2.
3. `(2x⁻¹/y⁻²)⁻¹=x/(2y²)` with nonzero variables. L3.

**Distractors and validation.** Answer zero, negate base, or reciprocal only one factor. Exponent normalization.

### Family `rational_exponents_radicals`

**Task.** Convert between radical and rational-exponent form or evaluate friendly powers.

**Response and template.** Expression/number: `Rewrite {expression} in {requested_form}.`

**Derivation.** `a^(m/n)=Root(n,a^m)` in the declared real domain; reduce exponent and track even-index restrictions.

**Difficulty.** L1 square/cube roots; L2 numerator exponent; L3 negative rational exponent/domain.

**Examples.**

1. `x^(1/2)=sqrt(x)`, `x≥0`. L1.
2. `27^(2/3)=9`. L2.
3. `x^(−3/2)=1/(x sqrt(x))`, real domain `x>0`. L3.

**Distractors and validation.** Swap numerator/denominator or multiply root/index. Exact power identities and domain comparison.

### Family `simplify_radicals`

**Task.** Extract perfect powers and normalize a radical.

**Response and template.** Radical expression: `Simplify over the reals: {radical}.`

**Derivation.** Factor radicand into maximal perfect-index power times power-free remainder; use absolute value where even root extracts an even power of an unrestricted variable.

**Difficulty.** L1 numeric square root; L2 coefficients/variables with nonnegative assumptions; L3 unrestricted-variable absolute value or higher root.

**Examples.**

1. `sqrt(72)=6sqrt(2)`. L1.
2. With `x≥0`, `sqrt(12x³)=2x sqrt(3x)`. L2.
3. `sqrt(9x²)=3|x|` for real x. L3.

**Distractors and validation.** Split sums, omit absolute value, or extract non-perfect factor. Exact normalized radical square/power check.

### Family `radical_arithmetic_rationalize`

**Task.** Combine like radicals, multiply them, or rationalize a simple denominator.

**Response and template.** Radical-normal expression: `{operation_instruction}: {expression}.`

**Derivation.** Normalize radicals first, combine identical radicands; rationalize monomial radical or binomial conjugate denominator when requested.

**Difficulty.** L1 combine; L2 multiply; L3 conjugate rationalization.

**Examples.**

1. `2sqrt(3)+5sqrt(3)=7sqrt(3)`. L1.
2. `sqrt(6)sqrt(15)=3sqrt(10)`. L2.
3. `1/(2+sqrt(3))=2−sqrt(3)`. L3.

**Distractors and validation.** Add radicands or conjugate numerator only. Exact quadratic-field normalization and denominator-form predicate.

### Family `solve_radical_equation`

**Task.** Solve one- or two-stage radical equations and reject extraneous roots.

**Response and template.** Finite real set: `Solve and check: {equation}.`

**Derivation.** Isolate a radical, enforce sign/domain constraints, raise to index power, solve bounded polynomial, verify in original.

**Difficulty.** L1 one square root; L2 affine radicand/right side; L3 squaring creates an extraneous candidate.

**Examples.**

1. `sqrt(x)=5` → `{25}`. L1.
2. `sqrt(2x+3)=x` → candidates checked; `{3}`. L2.
3. `sqrt(x+6)=x` → candidates `3,−2`, only `{3}`. L3.

**Distractors and validation.** Keep every squared-equation root or ignore radicand. Exact original substitution/domain.

### Family `solve_exponential_equation`

**Task.** Solve bounded exponential equations by common base or one logarithm step.

**Response and template.** Exact/rounded real number: `Solve: {equation}.`

**Derivation.** Rewrite to common injective base when possible; otherwise isolate exponential and apply log, preserving positive side.

**Difficulty.** L1 same base; L2 disguised base; L3 logarithmic exact/decimal answer.

**Examples.**

1. `2^(x+1)=16` → `x=3`. L1.
2. `9^x=27` → `3^(2x)=3³`, `x=3/2`. L2.
3. `3e^(2x)=7` → `x=(1/2)ln(7/3)`. L3.

**Distractors and validation.** Equate bases/arguments illegally or take log of one factor only. Substitute with high-precision plus symbolic inverse.

### Family `log_definition_laws`

**Task.** Convert exponential/log form, evaluate exact logs, or expand/condense using valid laws.

**Response and template.** Expression: `{instruction}: {log_expression}.`

**Derivation.** `log_b a=c ↔ b^c=a`; product→sum, quotient→difference, power→coefficient under positive arguments.

**Difficulty.** L1 conversion/evaluation; L2 one law; L3 several factors with domain stated.

**Examples.**

1. `log_2(8)=3` ↔ `2³=8`. L1.
2. `ln(xy)=ln x+ln y` for `x,y>0`. L2.
3. `log_b(x²/sqrt(y))=2log_b x−(1/2)log_b y` for positive x,y. L3.

**Distractors and validation.** Split sums or move exponent incorrectly. Log AST rewrite and domain predicate.

### Family `solve_logarithmic_equation`

**Task.** Solve a bounded logarithmic equation and enforce argument/base domains.

**Response and template.** Finite real set: `Solve over the reals: {equation}.`

**Derivation.** Combine logs when justified, convert to exponential/polynomial form, solve, reject non-positive arguments.

**Difficulty.** L1 one log; L2 sum/difference logs; L3 quadratic candidates with domain rejection.

**Examples.**

1. `log_2 x=5` → `{32}`. L1.
2. `ln(x−1)=ln 4` → `{5}`. L2.
3. `ln(x)+ln(x−3)=ln 4` → `x(x−3)=4`, candidates `4,−1`; answer `{4}`. L3.

**Distractors and validation.** Drop log, add arguments for product, or keep invalid root. Original-domain substitution.

### Cross-family progression

Integer exponent rules precede negative/rational powers. Radical normalization precedes arithmetic and equations. Exponential equations introduce inverse logs; log definition precedes laws and log equations. Every equation family includes original-domain checking.

## 10. Category: Systems of equations

### Category purpose

Build coordinated reasoning about simultaneous constraints and method choice.

### Learn

A solution to a system satisfies every equation. Graphically it is an intersection. Substitution replaces an equal expression; elimination combines equations to cancel a variable. Linear systems may have one, no, or infinitely many solutions.

### Prerequisites

Linear equations, ordered pairs, quadratic solving for nonlinear variants.

### Common misconceptions

- Solving each equation independently and pairing arbitrary values.
- Substituting into only part of an equation.
- Adding equations without multiplying every term.
- Treating parallel lines as one solution.
- Reporting one point for coincident lines.
- Losing solutions in nonlinear substitution.

### Family `system_solution_check`

**Task.** Test whether an ordered pair/triple satisfies a system.

**Response and template.** Yes/no with equation flags: `Does {tuple} solve {system}?`

**Derivation.** Substitute coordinates into every equation; all must be true.

**Difficulty.** L1 two linear equations; L2 fractions; L3 three equations or nonlinear term.

**Examples.**

1. `(2,1)` satisfies `x+y=3,x−y=1`. L1.
2. `(1/2,2)` satisfies `2x+y=3` but not `x−y=0` → not a solution. L2.
3. `(1,−1,2)` satisfies `x+y+z=2`, `2x−y=3`, and `z−x=1`. L3.

**Distractors and validation.** First-equation-only acceptance. Exact evaluation of every relation.

### Family `solve_system_graph`

**Task.** Read or construct the intersection of two linear graphs.

**Response and template.** Ordered pair/classification: `Using the graph/table, solve the system {lines}.`

**Derivation.** Exact line semantic objects determine intersection; graph is a rendering, not oracle.

**Difficulty.** L1 integer intersection; L2 parallel/coincident; L3 infer from table or choose graph.

**Examples.**

1. `y=x`, `y=−x+4` → `(2,2)`. L1.
2. `y=2x+1`, `y=2x−3` → no solution. L2.
3. Equivalent equations → infinitely many points on the line. L3.

**Distractors and validation.** Intercepts instead of intersection. Algebraic solution and rendered geometry agree.

### Family `solve_system_substitution`

**Task.** Solve a two-linear-equation system by substitution.

**Response and template.** Ordered pair: `Solve by substitution: {system}.`

**Derivation.** Substitute an isolated/easily isolated variable, solve resulting linear equation, back-substitute.

**Difficulty.** L1 variable isolated; L2 isolate first; L3 fractions or classification.

**Examples.**

1. `y=x+1, x+y=5` → `(2,3)`. L1.
2. `2x−y=1,3x+y=9` → `(2,3)`. L2.
3. Substitution reduces to false/identity → none/infinite. L3.

**Distractors and validation.** Substitute variable name without whole expression or omit back-substitution. Exact tuple/system check.

### Family `solve_system_elimination`

**Task.** Solve a two-linear-equation system by elimination.

**Response and template.** Ordered pair: `Solve by elimination: {system}.`

**Derivation.** Choose integer multipliers minimizing arithmetic, add/subtract full equations, solve and back-substitute.

**Difficulty.** L1 coefficients already opposite; L2 one multiplier; L3 two multipliers or fractions.

**Examples.**

1. `x+y=5,x−y=1` → `(3,2)`. L1.
2. `2x+3y=12,x−3y=−3` → `(3,2)`. L2.
3. `2x+3y=1,5x−2y=12`; multiply the equations by 2 and 3 to eliminate y → `(2,−1)`. L3.

**Distractors and validation.** Multiply only variable term or add constants incorrectly. Exact linear solver and tuple substitution.

### Family `classify_linear_system`

**Task.** Classify a two-variable linear system from equations, slopes, or determinant-like coefficient relation.

**Response and template.** Choice: `How many solutions does {system} have?`

**Derivation.** Compare normalized coefficient rows: distinct nonparallel one; proportional coefficients/constants infinite; proportional coefficients but inconsistent constants none.

**Difficulty.** L1 graph slopes; L2 equations; L3 parameter controlling classification.

**Examples.**

1. Slopes 2 and −1 → one solution. L1.
2. `2x+4y=6,x+2y=4` → no solution. L2.
3. `kx+y=2,2x+2y=4` → infinitely many solutions when `k=1`; otherwise unique `(0,2)`. L3.

**Distractors and validation.** Same slope means infinite regardless intercept. Exact rank/classification oracle.

### Family `three_variable_system`

**Task.** Solve a small 3×3 linear system engineered for clean elimination.

**Response and template.** Ordered triple: `Solve: {three_equations}.`

**Derivation.** Eliminate one variable from two pairs, solve resulting 2×2, back-substitute; unique solutions only in core variant.

**Difficulty.** L1 triangular; L2 one elimination layer; L3 classification/parameterization with scaffold.

**Examples.**

1. `z=1,y+z=3,x+y+z=6` → `(3,2,1)`. L1.
2. `x+y+z=2`, `2x−y+z=7`, `x+3y−2z=−11` → `(1,−2,3)`. L2.
3. `x+y+z=3`, `2x+2y+2z=6`, `x−y=1` → infinitely many: `(1+t,t,2−2t)`. L3.

**Distractors and validation.** Back-substitution omission or partial row multiplication. Exact rational elimination and original substitution.

### Family `linear_nonlinear_system`

**Task.** Solve a bounded line–parabola or line–circle system.

**Response and template.** Unordered ordered-pair set: `Solve over the reals: {system}.`

**Derivation.** Substitute linear rule into quadratic relation, solve degree `≤2`, back-substitute each root.

**Difficulty.** L1 line with `y=x+c`; L2 two intersections; L3 tangent/no real intersection classification.

**Examples.**

1. `y=x, y=x²` → `{(0,0),(1,1)}`. L1.
2. `y=x+2, x²+y²=10` → `{(−3,−1),(1,3)}`. L2.
3. `y=2x−1, y=x²` → tangent intersection `{(1,1)}`. L3.

**Distractors and validation.** Pair x roots with wrong y or omit second point. Original-system exact check and cardinality.

### Cross-family progression

Checking solutions precedes solving. Graphs give intersection meaning; substitution and elimination are taught separately, then method selection mixes them. Classification is interleaved. Three-variable and nonlinear systems remain late, bounded, and scaffolded.

## 11. Category: Functions, graphs, and sequences

### Category purpose

Build fluency treating functions as input-output rules with domains, transformations, combinations, and inverse relationships.

### Learn

`f(x)` names the output of function `f` at input `x`; it is not multiplication. A function gives one output per input. Composition applies the inner function first. An inverse reverses input/output on a one-to-one domain. Graph transformations follow the input/output structure.

### Prerequisites

Substitution, equations, coordinate graphs, polynomial/rational domains.

### Common misconceptions

- Reading `f(x)` as `f·x`.
- Substituting into only one occurrence.
- Swapping domain and range.
- Applying horizontal shifts in the visible sign direction.
- Composing in the wrong order.
- Confusing reciprocal `1/f` with inverse `f⁻¹`.
- Extrapolating sequence patterns without a declared family.

### Family `function_evaluate_solve_input`

**Task.** Evaluate a function or solve for input(s) yielding a specified output.

**Response and template.** Number/finite set: `For f(x)={rule}, find {f(a)_or_inputs}.`

**Derivation.** Evaluation substitutes; inverse query solves `f(x)=target` within domain.

**Difficulty.** L1 linear evaluation; L2 quadratic/rational input; L3 multiple/no inputs with domain.

**Examples.**

1. `f(x)=2x+3`, `f(4)=11`. L1.
2. `f(x)=x²−1`, solve `f(x)=8` → `{−3,3}`. L2.
3. `f(x)=1/(x−2)`, solve `f(x)=0` → none. L3.

**Distractors and validation.** Multiply `f*x`, choose one inverse root, or ignore domain. Exact rule evaluator/solver.

### Family `function_domain_range`

**Task.** Determine domain/range for a controlled rule, table, mapping, or graph.

**Response and template.** Set/interval: `State the {domain_or_range} of {function_representation}.`

**Derivation.** Apply denominator/radical/log restrictions or extract input/output coordinate sets; range only for supported invertible/quadratic/piecewise templates.

**Difficulty.** L1 finite mapping; L2 rational/radical domain; L3 quadratic/piecewise range.

**Examples.**

1. Pairs `(1,4),(2,5)` → domain `{1,2}`, range `{4,5}`. L1.
2. `sqrt(x−3)` → domain `[3,∞)`, range `[0,∞)`. L2.
3. `(x−2)²−5` → range `[-5,∞)`. L3.

**Distractors and validation.** Swap domain/range or use zeros only. Exact semantic domain/range oracle.

### Family `relation_is_function`

**Task.** Decide whether a mapping/table/set/graph defines a function.

**Response and template.** Yes/no with witness: `Does {relation} define y as a function of x?`

**Derivation.** Each domain input must have at most one output; graph variant uses exact vertical-fiber intersections.

**Difficulty.** L1 mapping; L2 repeated x in table; L3 curve/implicit relation.

**Examples.**

1. `{(1,2),(2,2)}` → yes. L1.
2. `{(1,2),(1,3)}` → no; x=1 has two outputs. L2.
3. `x²+y²=1` does not define all-circle y as function of x. L3.

**Distractors and validation.** Require unique outputs globally or confuse repeated y. Exact fiber check.

### Family `function_transformations`

**Task.** Match or construct vertical/horizontal shifts, reflections, and scalings.

**Response and template.** Rule/graph matching: `Starting from y=f(x), describe/choose the graph of {transformed_rule}.`

**Derivation.** Outside operations transform outputs; inside operations inversely transform inputs. Apply declared order from coordinate mapping.

**Difficulty.** L1 one shift; L2 reflection/scale; L3 two transformations/order.

**Examples.**

1. `f(x)+3` → up 3. L1.
2. `f(x−2)` → right 2. L2.
3. `−2f(x+1)+4` → left 1, vertical stretch 2/reflection, up 4. L3.

**Distractors and validation.** Horizontal sign same as written or swap inside/outside. Transform exact landmarks and compare rendered graph.

### Family `function_composition`

**Task.** Compute/evaluate a composition and its domain for controlled rules.

**Response and template.** Expression/number: `Find (f∘g)({x_or_variable}) for f={f}, g={g}.`

**Derivation.** Substitute `g` as the complete input of `f`; domain requires x in domain of g and g(x) in domain of f.

**Difficulty.** L1 evaluate numerically; L2 symbolic polynomial; L3 rational/radical domain or compare order.

**Examples.**

1. `f(x)=2x,g(x)=x+1`; `(f∘g)(3)=8`. L1.
2. `f=x²,g=x−1` → `(x−1)²`. L2.
3. For `f(x)=2x,g(x)=x+1`, `(f∘g)(x)=2x+2` but `(g∘f)(x)=2x+1`. L3.

**Distractors and validation.** Multiply functions or reverse order. AST substitution, domain preimage, and evaluation cross-check.

### Family `inverse_function`

**Task.** Find/check an inverse for a one-to-one controlled function.

**Response and template.** Function rule/domain: `Find f⁻¹ for {function_with_domain}.`

**Derivation.** Set `y=f(x)`, solve for x, swap labels; verify both compositions are identities on proper domains.

**Difficulty.** L1 affine; L2 rational/Möbius; L3 restricted quadratic/square root.

**Examples.**

1. `f(x)=3x−2` → `f⁻¹(x)=(x+2)/3`. L1.
2. `f(x)=1/(x−1)` → `f⁻¹(x)=1+1/x`, with domains tracked. L2.
3. `f(x)=x²,x≥0` → `f⁻¹(x)=sqrt(x)`. L3.

**Distractors and validation.** Reciprocal or swap symbols without solving. Exact two-composition/domain validation.

### Family `linear_function_features`

**Task.** Determine slope, intercepts, equation, or rate from points/table/graph.

**Response and template.** Named fields: `For {linear_representation}, find {features_or_rule}.`

**Derivation.** `m=(y2−y1)/(x2−x1)` for distinct x; `b=y−mx`; intercepts solve x or y zero.

**Difficulty.** L1 read `y=mx+b`; L2 two points/table; L3 parallel/perpendicular or inverse missing point.

**Examples.**

1. `y=3x−4` → slope 3, y-intercept −4. L1.
2. Through `(1,2),(3,8)` → `m=3`, `y=3x−1`. L2.
3. Perpendicular to slope `2/3` → slope `−3/2`. L3.

**Distractors and validation.** Run/rise, intercept sign, or negative reciprocal error. Exact point-line checks.

### Family `piecewise_evaluate_solve`

**Task.** Evaluate or solve a bounded piecewise function with explicit branch conditions.

**Response and template.** Number/finite set: `For {piecewise_rule}, find {target}.`

**Derivation.** Select branches by domain predicates; inverse queries solve each branch then filter by that branch condition.

**Difficulty.** L1 evaluate away from boundary; L2 boundary inclusion; L3 solve output across branches.

**Examples.**

1. `f=x+1` if `x<0`, `x²` if `x≥0`; `f(−2)=−1`. L1.
2. Same, `f(0)=0` from second branch. L2.
3. For the same rule, `f(x)=2` gives only `x=sqrt(2)`; the candidate `x=1` from the first formula violates `x<0`. L3.

**Distractors and validation.** Use wrong branch or accept candidate outside branch. Exact predicate/filter oracle.

### Family `arithmetic_geometric_sequence`

**Task.** Identify, extend, or construct explicit/recursive arithmetic and geometric sequences.

**Response and template.** Number/formula: `For sequence {terms_or_rule}, find {target}.`

**Derivation.** Arithmetic `a_n=a1+(n−1)d`; geometric `a_n=a1 r^(n−1)`; validate index origin.

**Difficulty.** L1 next term/type; L2 nth term; L3 recover parameters or distinguish from nonmatching sequence.

**Examples.**

1. `4,7,10,...` → `d=3`, next 13. L1.
2. `a1=5,r=2` → `a6=160`. L2.
3. `a4=14,a9=29` arithmetic → `d=3,a1=5`. L3.

**Distractors and validation.** Use `nd`, confuse ratio/difference, off-by-one exponent. Exact term generator and inverse substitution.

### Cross-family progression

Evaluation and finite mappings precede domain/range. Linear features connect formulas and graphs before general transformations. Composition precedes inverses. Piecewise functions wait until inequalities are fluent. Sequences reuse function input/output and exponent patterns without introducing infinite-series calculus.

## 12. Topic-wide progression

Recommended introduction order:

1. expression parts, precedence, substitution, and verbal translation;
2. like terms, distribution, monomial products, and nested signs;
3. one/two-step linear equations and basic inequalities;
4. variables on both sides, classification, formulas, proportions, and interval notation;
5. polynomial arithmetic, GCF, special products, and quadratic factoring;
6. compound/absolute inequalities and polynomial sign charts;
7. quadratic equations, forms, discriminant, and method selection;
8. rational domains/arithmetic/equations and radical normalization/equations;
9. exponentials, logarithms, and bounded complex roots;
10. two-variable systems, functions, transformations, composition, and inverses;
11. rational inequalities, parameter cases, three-variable/nonlinear systems, and mixed synthesis.

Prerequisite gates:

- AST structure and signed substitution gate all manipulation;
- collection/distribution gate linear equations;
- linear equations gate inequalities and literal formulas;
- expansion gates factorization;
- factoring gates polynomial/quadratic/rational solving;
- interval notation and factoring gate sign-chart inequalities;
- rational-domain fluency gates rational equations;
- exponent laws gate radicals, exponentials, and logarithms;
- equation checking gates radical/log equations;
- two-variable equations and graph features gate systems/functions;
- one-to-one/function domain fluency gates inverses.

Interleave inverse pairs:

- expand ↔ factor;
- evaluate function ↔ solve for input;
- exponential ↔ logarithmic form;
- equation ↔ generated solution/check;
- inequality ↔ interval/number-line graph;
- roots ↔ factors ↔ x-intercepts;
- standard ↔ factored ↔ vertex quadratic form;
- system equations ↔ intersection;
- function transformation rule ↔ moved landmarks.

Do not advance from a category aggregate alone. For example, quick linear solving does not compensate for domain loss, and correct expansion does not demonstrate factoring recognition.

## 13. Adaptive practice guidance

Track mastery by:

`family`, `ASTShape`, `targetContract`, `coefficientType`, `variableCount`, `domainFeature`, `solutionCardinality`, `representation`, `operationDirection`, `scaffolding`, `methodChoice`, `verificationBehavior`, and `misconception`.

| Error pattern | Likely misconception | Follow-up |
|---|---|---|
| evaluates `-2²` as 4 | unary minus/exponent scope | compare `-x²` and `(-x)²` at values |
| combines `x+x²` | unlike terms | sort terms by monomial key |
| expands `a(b+c)` as `ab+c` | partial distribution | highlight both outgoing products |
| expands `(a+b)²` without middle term | square-distribution myth | area/product expansion before identity |
| moves term with wrong sign | balance operation not understood | choose operation applied to both sides |
| gets `0=0` then `x=0` | identity classification | one/none/all contrast set |
| divides by parameter expression | hidden zero case | branch on coefficient sign/zero |
| fails to reverse inequality | negative scaling order | same equation/inequality paired item |
| uses “and” for outside absolute inequality | distance region confusion | number-line inside/outside visualization |
| includes infinity endpoint | interval notation | endpoint semantics matching |
| factors before GCF | incomplete factorization | GCF-only diagnostic |
| factor sign gives wrong root | `(x−r)` sign link | root-factor matching |
| takes one square root | `±` omitted | square equation with symmetric graph |
| quadratic formula denominator partial | numerator grouping | structured `−b`, radical, whole numerator fields |
| cancels terms across sum | factor/term confusion | identify factors before cancellation |
| loses cancelled exclusion | formula/domain conflation | reduced formula plus domain field |
| keeps denominator-zero candidate | original equation not checked | candidate checklist in original |
| `a⁻²=−a²` | negative exponent meaning | reciprocal rewrite |
| `sqrt(x²)=x` universally | even-root sign | negative substitution counterexample |
| splits radical/log over a sum | invalid homomorphism | contrast product versus sum |
| keeps squared/log candidate | extraneous/domain failure | explicit candidate verification |
| composes in wrong order | inner/outer reversal | two-stage input-output boxes |
| inverse written as reciprocal | notation confusion | composition identity check |
| system pair satisfies one equation | simultaneity missed | per-equation check fields |
| graph answer uses intercepts | intersection meaning | highlight shared ordered pair |

Recommended selection after prerequisites:

- 35% weakest due family/misconception;
- 25% spaced mastered families;
- 15% inverse representation transfer;
- 10% verification/error analysis;
- 10% prerequisite diagnostics;
- 5% mixed synthesis.

If a learner’s answer is algebraically correct but violates only the requested form, report that distinction and schedule a form-recognition item rather than an equivalence failure. If the checker cannot prove a plausibly valid supported answer, offer a no-penalty checker-limitation path.

## 14. Feedback and worked solutions

Worked solutions should expose the smallest reliable reasoning chain:

1. state the target form, variable, domain, or solution-set type;
2. identify expression structure or restrictions;
3. name the chosen property/method;
4. show one transformation per line with equality/implication status;
5. normalize the requested form;
6. verify by substitution, expansion, composition, or sign test;
7. restate exclusions and answer set.

Use equivalence arrows carefully:

- `=` between equal expressions/numbers;
- `⇔` only for reversible equation/inequality transformations under stated conditions;
- `⇒` when a step such as squaring may add candidates;
- prose such as “candidate” until original-equation checking completes.

Diagnostic examples:

> Your `3x+2` distributed 3 to the first term only. Both terms inside `(x+2)` must be multiplied: `3x+6`.

> Dividing by `−2` changes the order: from `−2x<6`, the result is `x>−3`.

> `x=1` solves the cleared equation but makes the original denominator zero, so it is excluded.

> `sqrt(x²)` is the non-negative magnitude of x, so it is `|x|` over the real numbers.

Correct feedback should validate meaning, not only form:

> Correct: `(x−2)(x+5)` expands to `x²+3x−10`, and neither factor can be factored further over the integers.

Do not force extra simplification beyond the contract. If `2(x+1)` is accepted under `equivalent_any`, do not mark it inferior to `2x+2`.

## 15. Rendering, interaction, and accessibility

- Render expressions from ASTs using semantic MathML plus accessible linear text.
- Fraction bars, exponents, radical extents, absolute bars, and grouping must be visually unambiguous at zoom.
- Use explicit multiplication where adjacency could be misread.
- Screen readers distinguish “negative x squared” from “negative x, all squared,” and inverse function from reciprocal.
- Number lines expose endpoint values, inclusion, and shaded intervals as text.
- Graphs expose exact landmarks, equations, axes, scale, and a table alternative.
- Open/closed endpoints, branches, roots, and selected factors are not distinguished by color alone.
- Expression editors are fully keyboard operable and preserve cursor/group structure.
- Parse errors identify the unsupported token or unmatched group without silently rewriting input.
- Localization must preserve operation order, conditional words (“and/or”), and reversed comparison phrases.

## 16. Generator and implementation requirements

### Exact internal arithmetic

Use:

```text
BigInt
Rational := { numerator: BigInt, denominator: positive BigInt }
Monomial := sorted map<variable, nonnegative integer exponent>
Polynomial := sparse map<Monomial, Rational>
IntervalSet := normalized ordered intervals and isolated points
ComplexExact := { real: AlgebraicExact, imag: AlgebraicExact }
```

Supported algebraic exact values are bounded to rationals, normalized square/cube-root combinations needed by generated families, and quadratic-field forms. Do not use binary floating point as the equality oracle.

### Domain-aware AST transformations

Every rewrite returns:

`newAST`, `requiredConditions`, `preservedDomain`, `introducedCandidates`, and `proofRuleId`.

The checker must distinguish:

- equivalence on original domain;
- equivalence with an added restriction;
- equation implication rather than equivalence;
- target-form satisfaction;
- correct solution set after original-domain filtering.

### Bounded solver stack

The local engine should implement audited algorithms for:

- polynomial normalization, GCD, division, and rational-root testing;
- generated-template integer factorization through degree four;
- linear and quadratic exact equations;
- finite products using zero-product property;
- linear/absolute/polynomial/rational inequalities through critical-point sign analysis;
- rational and radical equations that reduce to declared degree bounds;
- exponential/log equations from whitelisted invertible templates;
- 2×2/3×3 exact linear systems and bounded line–quadratic systems;
- function domains and transformations from supported AST templates.

It must not silently escalate unsupported learner input to numerical guessing. Unsupported equivalent forms should receive a clear supported-form request without a mastery penalty.

### Independent validation

The generation transform and answer checker must not be the same unexamined code path:

- polynomial results: coefficient normalization plus independent evaluation grid;
- factors: expansion plus irreducibility/schema checks;
- rational expressions: cross-products plus original-domain equality;
- radical values: exact algebraic normalization plus high-precision check;
- equation roots: independent substitution in original;
- inequality sets: exact critical points plus one test point per component/complement;
- systems: tuple substitution in every original equation;
- inverses: both compositions with domain checks;
- graphs/tables: semantic object agreement rather than pixel reading.

### Offline constraint

All parsing, generation, rendering, solving, and checking runs in the standalone HTML/JS/CSS page. No backend, runtime CAS, remote plotting service, network dataset, or downloaded package is required. Build-time test tooling may use mature symbolic systems for differential testing.

## 17. Automated validation

For every generated instance:

- all placeholders are substituted;
- rendered expression parse round-trip preserves its AST;
- declared and original domains are recomputed independently;
- coefficients and exact values fit configured complexity bounds;
- the canonical answer satisfies the requested target contract;
- every equation/system solution satisfies every original relation;
- no valid supported solution is omitted;
- every inequality interval matches critical-point signs and endpoint inclusion;
- every factorization expands to the original and is complete under the declared domain;
- every rational answer retains all original exclusions;
- every radical/log/exponential candidate passes domain checks;
- every graph/table/text representation agrees;
- every multiple-choice set has exactly one best/correct choice under its wording;
- distractors are distinct after normalization and reproduce named misconceptions;
- worked steps are valid under their attached conditions;
- rounding, if requested, derives from an unrounded exact/high-precision value;
- rejection rules and structural-repeat limits are enforced.

Fuzz/property testing minimums:

- 100,000 expression parse/render/normalize cases;
- 100,000 polynomial expansion/factor/division cases;
- 100,000 linear equation/inequality cases across classifications;
- 50,000 quadratic and higher factored-polynomial cases;
- 50,000 rational-domain/arithmetic/equation cases;
- 50,000 radical/exponent/log cases;
- 25,000 systems/function cases;
- every authored verbal, method-choice, misconception, and localization template.

Adversarial equivalence tests must include:

- reordered terms/factors;
- redistributed rational constants;
- identities that agree at many points but not exactly;
- cancelled holes;
- `sqrt(x²)` sign cases;
- unsimplified but correct quadratic roots;
- redundant/overlapping interval unions;
- solution sets in different orders;
- inverse functions with restricted domains;
- expressions near floating overflow/underflow if evaluated numerically.

## 18. Coverage requirements

Balance:

- positive, negative, zero, integer, and rational coefficients;
- zero/one/multiple/infinite solution classifications;
- variable on left/right/both sides;
- strict/non-strict and left/right/bounded/disconnected inequalities;
- GCF, difference squares, perfect squares, monic/non-monic quadratics, grouping, and irreducible cases;
- roots positive/negative/zero/repeated/irrational/non-real;
- rational expressions with no cancellation, visible cancellation, and hidden retained holes;
- radical equations with and without extraneous candidates;
- exponent/log equations solved by common base and inverse operation;
- systems with one/none/infinite solutions and multiple solving methods;
- formula/table/graph/verbal directions;
- direct computation, inverse construction, next-step, error diagnosis, and method selection.

Within a session:

- do not repeat an exact instance within 100 questions;
- suppress the same structural signature for 20 questions;
- avoid more than two consecutive items with the same response representation;
- include at least one verification/error-analysis item per six manipulation items;
- include domain-sensitive items regularly after rational/radical/log unlock;
- prevent integer-only easy forms from dominating after rational fluency;
- rotate variable letters only when it is pedagogically useful, never as fake difficulty.

## 19. Topic-level quality checklist

- [ ] Every “simplify” task names a target contract.
- [ ] Expression grammar and real/complex domain are explicit.
- [ ] Equality, identity, equation, and inequality semantics remain distinct.
- [ ] Exact arithmetic is the primary oracle.
- [ ] Polynomial/rational equivalence is never decided by point sampling alone.
- [ ] Original domain exclusions survive cancellation.
- [ ] Radical/log equations check every candidate in the original.
- [ ] Inequality multiplication/division by negatives reverses comparison.
- [ ] Interval endpoints and infinity conventions are consistent.
- [ ] Factoring answers are complete under a named coefficient domain.
- [ ] Quadratic method selection values structure, not one universal method.
- [ ] Alternative correct factor order, solution order, and expression form are accepted.
- [ ] Function inverses are not conflated with reciprocals.
- [ ] Graphs and symbolic rules derive from one semantic object.
- [ ] Distractors correspond to recognizable misconceptions.
- [ ] Every family has at least three examples and an automated validation rule.
- [ ] Difficulty increases through structure and conditions, not arithmetic bulk.
- [ ] The local app does not need a backend or general-purpose CAS.
- [ ] Adaptive tracking separates manipulation, domain, method, and verification weaknesses.
- [ ] Repeated practice should transfer to later technical/scientific subjects.

## 20. Stable navigation

Recommended category order and stable IDs:

1. `expressions` — Expression Structure & Evaluation
2. `simplifying` — Simplifying & Expanding
3. `linear-equations` — Linear Equations & Formulas
4. `inequalities` — Inequalities & Absolute Value
5. `polynomials` — Polynomials & Factoring
6. `quadratics` — Quadratics & Complex Roots
7. `rational` — Rational Expressions
8. `powers` — Exponents, Radicals & Logs
9. `systems` — Systems of Equations
10. `functions` — Functions, Graphs & Sequences

Family identifiers in this document are stable persistence and analytics keys. Display labels may be localized; identifiers must not be translated or silently repurposed.
