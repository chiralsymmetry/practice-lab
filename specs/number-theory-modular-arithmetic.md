# Number Theory and Modular Arithmetic — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, exact-integer oracle, controlled-proof checker, modular-expression parser, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Number Theory and Modular Arithmetic

### Topic goal

Develop fluent exact reasoning about divisibility, prime factors, greatest common divisors, remainders, and congruences. The learner should become able to:

- interpret divisibility and quotient–remainder statements precisely;
- recognize and justify divisibility rules;
- factor manageable integers and use prime exponents structurally;
- compute GCD/LCM by factors and the Euclidean algorithm;
- trace the extended Euclidean algorithm and construct Bézout coefficients;
- normalize residues and calculate modular sums, products, powers, and inverses;
- decide when cancellation/division modulo `n` is valid;
- solve linear congruences and systems using the Chinese remainder theorem;
- solve bounded linear Diophantine equations and parameterize all integer solutions;
- use Euler/Fermat theorems, multiplicative order, and cycles under explicit hypotheses;
- apply these tools to clocks, check digits, schedules, and toy cryptographic examples;
- distinguish a proof, a counterexample, and a pattern observed in examples.

### Position within Practice Lab

This app owns ordinary unbounded integer divisibility and modular structure. It connects:

- **Mental Arithmetic** through factor recognition and exact division;
- **Programmer Low-Level Numeracy** through wraparound, while remaining independent of fixed-width machine semantics;
- **Algebra Fluency** through equations and identities;
- **Computer Science** through hashing, cyclic schedules, and elementary cryptographic mathematics.

Fixed-width overflow, language `%` behavior, bit masks, and two’s-complement arithmetic remain in Programmer Low-Level Numeracy or language/assembly apps.

### Audience and prerequisites

The learner should know:

- signed integer arithmetic;
- fractions and powers with non-negative integer exponents;
- simple linear equations;
- set/list notation for later solution sets.

No proof course or abstract algebra is required. Controlled reasoning families introduce theorem hypotheses explicitly.

### Scope

The topic includes:

- divisibility notation, multiples, factors, quotient/remainder, divisibility rules, and closure properties;
- primes/composites, trial division, sieve reasoning, prime factorization, valuations, divisor count/sum, perfect powers;
- GCD, LCM, coprimality, Euclidean algorithm, binary/factor comparisons, extended Euclid, and Bézout identity;
- canonical residues, congruence classes, arithmetic, powers, polynomial substitution, and cancellation conditions;
- units, modular inverses, fast exponentiation, power cycles, multiplicative order, Euler’s totient, Fermat’s little theorem, and Euler’s theorem;
- linear congruences, simultaneous congruences, coprime and generalized CRT;
- two-variable linear Diophantine equations, integer constraints, and small counting/scheduling applications;
- quadratic-residue recognition at a bounded introductory level;
- checksum/check-digit rules and toy affine/RSA computations with tiny supplied parameters.

### Exclusions

Do not include in the initial app:

- analytic or algebraic number theory, distribution of primes, Dirichlet theorem, zeta functions, p-adics, ideals, algebraic integers, or elliptic curves;
- formal group/ring/field theory beyond locally explained units and residue classes;
- arbitrary large-integer factorization, primality certification, discrete logarithm attacks, or cryptographic key generation;
- probabilistic primality tests as implementation/security advice;
- continued fractions beyond an optional Euclidean-algorithm interpretation;
- Pell equations, higher-degree Diophantine equations, partitions, generating functions, Möbius inversion, or quadratic reciprocity;
- unrestricted proofs or induction grading;
- real-world cryptographic security claims, password cracking, cryptanalysis, or instructions to deploy toy ciphers;
- language-specific remainder operators unless the question explicitly contrasts them with Euclidean remainder;
- “find the pattern” questions with no theorem/finite model guaranteeing an answer.

### Normative integer and division model

- Integers are arbitrary precision.
- Divisibility `a|b` means there exists integer `k` such that `b=ak`.
- Every nonzero integer divides `0`; `0` divides only `0` under the existential definition, but divisor-list questions exclude divisor 0 and normally use positive divisors.
- For Euclidean division by positive `m`, every integer `a` has unique `q,r` with:

```text
a = qm + r,  0 ≤ r < m
```

- `a mod m` means that canonical remainder `r`.
- Moduli are integers `m≥2` unless a family explicitly discusses why modulus 0/1 is excluded.
- `gcd(a,b)` is non-negative; `gcd(0,0)=0`.
- `lcm(a,b)` is non-negative; `lcm(a,0)=0`, including `lcm(0,0)=0` by this app convention.
- Prime means a positive integer greater than 1 with exactly two positive divisors.
- Units such as `−1` are not prime.

### Congruence conventions

- `a≡b (mod m)` iff `m|(a−b)`.
- Every residue answer defaults to the canonical representative `0..m−1`.
- Negative representatives are accepted only when the prompt asks for “any representative” or a balanced residue.
- Congruence supports addition, subtraction, multiplication, and non-negative integer powers.
- Cancellation of `c` from `ca≡cb (mod m)` is automatically valid only when `gcd(c,m)=1`. In general it yields `a≡b (mod m/gcd(c,m))`, not necessarily modulo `m`.
- Division `a/b mod m` means multiplication by `b⁻¹ mod m` and exists only if `gcd(b,m)=1`.
- `a⁻¹ mod m` is the unique canonical residue `x` with `ax≡1 (mod m)`, when it exists.
- `0^0` is excluded.

### Prime-factor and arithmetic-function conventions

- Prime factorizations use positive integers `n≥2` and increasing primes.
- For nonzero `n`, `v_p(n)` is the exponent of prime `p` in `|n|`; `v_p(0)` is excluded.
- Positive-divisor questions list/count only positive divisors.
- If `n=∏p_i^{e_i}`, then `τ(n)=∏(e_i+1)` and `σ(n)=∏(1+p_i+...+p_i^{e_i})`.
- Euler’s totient `φ(n)` counts integers in `1..n` coprime to `n`; equivalently residues `0..n−1` that are units. `φ(1)=1`, but core modular families use `n≥2`.
- Multiplicative order `ord_m(a)` is defined only when `gcd(a,m)=1`.

### Linear congruence and CRT conventions

For `ax≡b (mod n)`:

- let `d=gcd(a,n)`;
- solutions exist iff `d|b`;
- when they exist, there are exactly `d` incongruent solutions modulo `n`;
- divide by `d`, solve the reduced invertible congruence modulo `n/d`, then lift.

For a system:

- coprime moduli have one solution modulo their product;
- general two-modulus systems are solvable iff residues agree modulo `gcd(m,n)`;
- when solvable, the solution is unique modulo `lcm(m,n)`;
- normalized answers state both canonical residue and combined modulus.

### Diophantine conventions

For `ax+by=c`:

- integer solutions exist iff `gcd(a,b)|c`;
- from one solution `(x0,y0)`, all are:

```text
x = x0 + (b/d)t
y = y0 - (a/d)t
t ∈ Z
```

where `d=gcd(a,b)`.

If non-negative/positive/bounded solutions are requested, intersect this parameterization with the stated inequalities. Parameter names are arbitrary.

### Exact answers and equivalence

- All core integer quantities use `BigInt`; no floating point is needed.
- Surrounding whitespace and an optional leading plus are ignored.
- Divisor/factor/residue/solution sets are unordered unless an order is requested.
- Prime factorizations accept reordered factors and equivalent powers, but feedback uses increasing primes.
- Bézout coefficient pairs are accepted if they satisfy `ax+by=gcd(a,b)`; do not require one algorithm’s pair unless the question asks for a trace.
- General Diophantine parameterizations are accepted when they generate exactly the same solution set, including sign/parameter shifts.
- CRT answers `x≡r (mod M)` accept any congruent `r`; display normalizes it.
- Proof-step questions use structured theorem/fact choices, not free-form prose.
- “No solution,” “not invertible,” and “undefined” are distinct semantic answers.

### Controlled expression grammar

Supported integer/modular expressions include:

```text
integer literals, variables
+ - * ^
gcd(a,b), lcm(a,b)
a mod m
a ≡ b (mod m)
prime powers and finite products
```

Exponents are non-negative integers in direct evaluation. Negative exponent syntax is allowed only in the dedicated inverse interpretation and is rendered as `a⁻¹`. No host-language `%` operator is accepted as a substitute for the mathematical remainder in explanation traces.

### Difficulty philosophy

Difficulty should rise through:

- reversing a relationship or filling a missing quotient/remainder;
- moving among factor, Euclidean, Bézout, and modular representations;
- weaker cues for theorem selection;
- non-coprime cases and multiple/no solutions;
- negative integers under canonical remainder;
- exponent cycles and hypothesis checks;
- parameterized solution sets and bounded constraints;
- combining at most two or three mastered ideas.

Difficulty must not rise through:

- enormous primes or tedious trial division;
- long Euclidean chains;
- huge exponent entry without a reduction strategy;
- cryptographic-size arithmetic;
- arbitrary theorem-name recall;
- obscure divisibility-rule trivia;
- accidental dependence on calculator rounding;
- open-ended proofs.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | Direct factor/multiple/remainder, small prime, one Euclidean step |
| 2 | Complete factorization, GCD/LCM, basic congruence arithmetic |
| 3 | Extended Euclid, inverse, power cycle, linear congruence |
| 4 | Non-coprime cases, generalized CRT, parameterized Diophantine solutions |
| 5 | Mixed theorem choice, proof/counterexample, bounded applications |

### Generator and oracle model

Every instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `integersExact`, `modulus`, `factorizations`, `euclideanTrace`, `bezoutCertificate`, `congruenceSystem`, `solutionSet`, `theoremHypotheses`, `canonicalAnswer`, `acceptedAnswerClass`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedSolution`, `structuralSignature`, and `oracleVersion`.

Generate backward from factors, GCD, residue class, inverse, order, or intended solution count. Independently validate by direct divisibility/enumeration for bounded moduli and by exact algorithms for larger cases. All generation/checking runs locally; there is no backend, CAS, factoring service, or runtime cryptographic library.

## 2. Category: Divisibility, multiples, and remainders

### Category purpose

Build exact interpretation of `a|b`, quotient–remainder structure, and useful divisibility properties.

### Learn

`a|b` means `b=ak` for an integer k. It does not mean `a/b` is an integer. Euclidean remainder is always non-negative for a positive divisor, even when the dividend is negative.

### Common misconceptions

- Reversing dividend and divisor.
- Saying 0 divides every number.
- Using a negative programming-language remainder.
- Treating `a|b+c` from only `a|b`.
- Assuming a divisor of a product divides each factor.

### Family `divisibility_decision`

**Task.** Decide whether one integer divides another and give quotient/certificate.

**Response and template.** Yes/no plus integer: `Does {a}|{b}? If yes, give k with b=ak.`

**Derivation.** For `a≠0`, test `b mod |a|=0`; handle a=0 by existential definition.

**Difficulty.** L1 positive; L2 negative/zero dividend; L3 zero divisor.

**Examples.**

1. `6|42` → yes, k=7. L1.
2. `−5|35` → yes, k=−7. L2.
3. `0|0` → yes under existential definition; `0|8` → no. L3.

**Distractors and validation.** Reverse quotient or blanket zero rule. Exact multiplication certificate.

### Family `factor_multiple_list`

**Task.** List/count factors or select multiples under bounds.

**Response and template.** Integer set: `List the positive divisors of {n}` or `which values are multiples of {a}?`

**Derivation.** Enumerate paired factors through sqrt(n), sort/normalize.

**Difficulty.** L1 small; L2 square; L3 negative multiple candidates/interval.

**Examples.**

1. divisors of 12 → `{1,2,3,4,6,12}`. L1.
2. divisors of 36 include sqrt pair once → 9 divisors. L2.
3. multiples of 7 in `[-20,20]` → `{-14,−7,0,7,14}`. L3.

**Distractors and validation.** Omit 1/n or double square root. Exact enumeration.

### Family `euclidean_quotient_remainder`

**Task.** Find q,r in Euclidean division.

**Response and template.** Named integers: `Write {a}=q·{m}+r with 0≤r<{m}.`

**Derivation.** `q=floor(a/m)`, `r=a−qm` for m>0.

**Difficulty.** L1 positive; L2 exact multiple; L3 negative dividend.

**Examples.**

1. 29 by 6 → q=4,r=5. L1.
2. 35 by 7 → q=5,r=0. L2.
3. −17 by 5 → q=−4,r=3. L3.

**Distractors and validation.** Truncate quotient to −3 giving negative remainder. Reconstruction/range.

### Family `missing_division_component`

**Task.** Recover dividend, divisor, quotient, or remainder from a valid division identity.

**Response and template.** Integer: `{a}=q·{m}+r with constraints; find {missing}.`

**Derivation.** Rearrange exactly, then enforce positive divisor/remainder range/integer quotient.

**Difficulty.** L1 dividend; L2 quotient; L3 divisor with divisibility constraint.

**Examples.**

1. `a=4·7+3` → a=31. L1.
2. `38=q·6+2` → q=6. L2.
3. `53=5m+3` → m=10 and `3<10`. L3.

**Distractors and validation.** Ignore remainder or accept noninteger. Substitute/range.

### Family `divisibility_rule_apply`

**Task.** Use base-10 divisibility rules for 2,3,4,5,8,9,10,11.

**Response and template.** Yes/no/remainder clue: `Without full division, is {n} divisible by {d}?`

**Derivation.** Apply versioned digit rule; feedback links it to congruence modulo d.

**Difficulty.** L1 last digit; L2 digit sum/last two-three; L3 alternating sum for 11.

**Examples.**

1. 124 divisible by 2 and 4. L1.
2. 7317 digit sum 18 → divisible by 9. L2.
3. 9185 alternating sum `9−1+8−5=11` → divisible by 11. L3.

**Distractors and validation.** Wrong suffix width/digit sum. Direct modulo oracle.

### Family `missing_digit_divisibility`

**Task.** Find all digits making a numeral divisible by a given d.

**Response and template.** Digit set: `Find digits x such that {digit_pattern} is divisible by {d}.`

**Derivation.** Enumerate 0..9, respecting no leading zero; filter exact modulo.

**Difficulty.** L1 rule 2/5; L2 3/9; L3 4/8/11 or two constraints.

**Examples.**

1. `37x` divisible by 5 → `{0,5}`. L1.
2. `4x2` divisible by 9 → x=3. L2.
3. `x32` divisible by 8 and 3 → x=4 only (432). L3.

**Distractors and validation.** One digit-rule condition only. Exhaustive digit oracle.

### Family `divisibility_property`

**Task.** Infer a valid divisibility conclusion or find a counterexample to an invalid one.

**Response and template.** Choice/witness: `Given {facts}, which conclusion must follow?`

**Derivation.** Use linear-combination/product/transitivity schemas; invalid claims carry small counterexample.

**Difficulty.** L1 sum; L2 linear combination/transitivity; L3 product-factor fallacy.

**Examples.**

1. `d|a,d|b` → `d|(a+b)`. L1.
2. `d|a` → `d|ka` for integer k. L2.
3. Invalid: `d|ab` implies `d|a`; counterexample d=6,a=2,b=3. L3.

**Distractors and validation.** Converse/reversed divisibility. Schema proof or exhaustive witness check.

### Cross-family progression

Decision and factor/multiple listing precede quotient–remainder. Negative dividends come after positive uniqueness. Digit rules are applied then inverted. Property reasoning follows concrete divisibility and introduces structured counterexamples.

## 3. Category: Primes, factorization, and divisor structure

### Category purpose

Build structural understanding of integers through unique prime exponents.

### Learn

Every integer greater than 1 has a unique prime factorization up to order. To test n for primality by trial division, only primes through `sqrt(n)` are needed.

### Common misconceptions

- Treating 1 or negative primes as prime.
- Trial-dividing past/short of sqrt without logic.
- Forgetting multiplicity in factorization.
- Counting divisor choices additively rather than multiplicatively.
- Confusing prime factor count with divisor count.

### Family `prime_composite_classify`

**Task.** Classify integer as prime, composite, unit/other.

**Response and template.** Choice/certificate: `Classify {n}; if composite give a nontrivial factor.`

**Derivation.** Handle n≤1; trial divide primes through sqrt(|n|) for n>1.

**Difficulty.** L1 small; L2 near-square prime; L3 0,1,negative contrast.

**Examples.**

1. 13 → prime. L1.
2. 91 → composite, `7·13`. L2.
3. 1 and −7 → neither prime nor composite under convention. L3.

**Distractors and validation.** 1 prime or odd=prime. Deterministic trial oracle.

### Family `trial_division_bound`

**Task.** Identify needed prime divisors or conclude primality after tests.

**Response and template.** Prime list/conclusion: `To test {n}, which primes must be checked?`

**Derivation.** All primes `p≤floor(sqrt(n))`; early stop if factor found.

**Difficulty.** L1 square bound; L2 nonsquare; L3 infer conclusion from reported tests.

**Examples.**

1. n=29 → check 2,3,5. L1.
2. n=97 → check 2,3,5,7. L2.
3. n=121: check 11 and find factor, composite. L3.

**Distractors and validation.** Check through n/2 or omit boundary sqrt. Prime-list oracle.

### Family `sieve_trace`

**Task.** Trace a small Sieve of Eratosthenes step or list remaining primes.

**Response and template.** Number set: `Starting with 2..{N}, after sieving by {primes}, which remain/are newly crossed?`

**Derivation.** Cross multiples from p²; prior smaller multiples already crossed.

**Difficulty.** L1 one prime; L2 full N≤60; L3 identify next p/stop condition.

**Examples.**

1. sieve by 2 through 20 → cross 4,6,...,20. L1.
2. full through 30 → `{2,3,5,7,11,13,17,19,23,29}`. L2.
3. after p=7 for N=50, stop because next prime²>N. L3.

**Distractors and validation.** Cross prime itself or start at 2p as required work. Sieve oracle.

### Family `prime_factorization`

**Task.** Factor a positive integer completely.

**Response and template.** Factor cards/exponents: `Write {n} as a product of prime powers.`

**Derivation.** Exact repeated prime division; generator constructs from bounded prime powers.

**Difficulty.** L1 two primes; L2 repeated/multiple; L3 perfect power or less obvious factor.

**Examples.**

1. 60=`2²·3·5`. L1.
2. 756=`2²·3³·7`. L2.
3. 2401=`7⁴`. L3.

**Distractors and validation.** Composite residual or missing exponent. Multiply back and primality-check bases.

### Family `valuation_exponent`

**Task.** Find `v_p(n)` or highest prime-power divisor.

**Response and template.** Integer/power: `Find v_{p}({n}).`

**Derivation.** Count exact repeated divisions by p.

**Difficulty.** L1 displayed factorization; L2 raw n; L3 valuation of product/quotient known integral.

**Examples.**

1. `v_2(40)=3`. L1.
2. `v_3(486)=5` because `486=2·3⁵`. L2.
3. `v_5(75²·10)=2·2+1=5`. L3.

**Distractors and validation.** Return prime power or coefficient. Factor/exponent oracle.

### Family `divisor_count_sum`

**Task.** Compute τ(n), σ(n), or enumerate divisors from factorization.

**Response and template.** Integer/set: `Given {factorization}, find {target}.`

**Derivation.** Choose each exponent independently; count/product geometric sums.

**Difficulty.** L1 τ two primes; L2 σ; L3 inverse small exponent pattern.

**Examples.**

1. `12=2²·3` → τ=6. L1.
2. `18=2·3²` → σ=(1+2)(1+3+9)=39. L2.
3. `p³q²` for distinct primes → τ=12. L3.

**Distractors and validation.** Sum exponents or omit +1. Enumerate bounded divisors independently.

### Family `perfect_power_squarefree`

**Task.** Classify perfect square/cube/kth power or squarefree from prime exponents.

**Response and template.** Choice/k: `Using {factorization}, classify {n}.`

**Derivation.** kth power iff every exponent divisible by k; squarefree iff all exponents≤1.

**Difficulty.** L1 square; L2 cube/highest power; L3 distinguish squarefree/perfect power.

**Examples.**

1. `2⁴3²=144` → perfect square. L1.
2. `2⁶3³=1728` → perfect cube (also sixth? exponent3 not /6, so not sixth). L2.
3. 30=`2·3·5` → squarefree. L3.

**Distractors and validation.** Value looks square or any exponent even. Exponent-vector oracle.

### Cross-family progression

Classification/trial bounds precede sieve/factorization. Valuations follow factorization, then divisor functions and perfect-power structure. Keep mental factor sizes bounded; structural exponents supply later GCD/totient work.

## 4. Category: GCD, LCM, and the Euclidean algorithm

### Category purpose

Build flexible common-divisor reasoning and a traceable efficient algorithm that leads naturally to Bézout coefficients.

### Learn

`gcd(a,b)` is the greatest non-negative common divisor. Euclid uses `gcd(a,b)=gcd(b,a mod b)` until remainder 0. The last nonzero remainder is the GCD. For nonzero a,b, `gcd(a,b)·lcm(a,b)=|ab|`.

### Common misconceptions

- GCD is the largest number appearing in both factorizations rather than common prime powers.
- LCM uses minimum exponents.
- Last quotient/zero remainder is the GCD.
- Euclidean steps use arbitrary remainders.
- Coprime means both numbers prime.
- Bézout coefficients must be positive/unique.

### Family `gcd_factor_method`

**Task.** Compute GCD from values/factorizations.

**Response and template.** Nonnegative integer: `Find gcd({a},{b}).`

**Derivation.** Minimum exponent of every prime; handle zeros by convention.

**Difficulty.** L1 visible factors; L2 raw values; L3 zero/negative/multiple inputs.

**Examples.**

1. gcd(18,24)=6. L1.
2. `2³3²` and `2²35` → gcd=`2²3=12`. L2.
3. gcd(0,−42)=42. L3.

**Distractors and validation.** LCM/max exponent or signed answer. Exact gcd algorithm.

### Family `lcm_factor_method`

**Task.** Compute LCM from factors or GCD relation.

**Response and template.** Nonnegative integer: `Find lcm({a},{b}).`

**Derivation.** If either input is zero, return 0 by convention; otherwise use maximum prime exponents or `|ab|/gcd`, dividing before multiplying.

**Difficulty.** L1 small; L2 shared powers; L3 zero/inverse missing.

**Examples.**

1. lcm(6,8)=24. L1.
2. `2³3²` and `2²35` → `2³3²5=360`. L2.
3. gcd=6,lcm=180,a=30 → |b|=36; if b positive, 36. L3.

**Distractors and validation.** Product without gcd division or min exponents. Multiples/gcd identity.

### Family `coprime_decision`

**Task.** Decide coprimality and give common-divisor/Bézout certificate.

**Response and template.** Yes/no plus certificate: `Are {a},{b} coprime?`

**Derivation.** gcd=1; for yes optionally produce Bézout pair, for no factor>1.

**Difficulty.** L1 obvious; L2 composite coprime; L3 consecutive/structured.

**Examples.**

1. 8,15 → coprime. L1.
2. 14,25 composite but coprime. L2.
3. n,n+1 always coprime; any common divisor divides difference 1. L3.

**Distractors and validation.** Both must prime or no shared visible small factor. Certificate.

### Family `euclidean_algorithm_trace`

**Task.** Complete/execute Euclidean division sequence.

**Response and template.** Ordered equations/GCD: `Use Euclid to find gcd({a},{b}).`

**Derivation.** Repeated canonical divisions with positive second operand.

**Difficulty.** L1 one/two steps; L2 several; L3 fill missing quotient/remainder.

**Examples.**

1. `48=2·18+12;18=1·12+6;12=2·6` → gcd6. L1.
2. `252,105`: remainders 42,21,0 → gcd21. L2.
3. `1071,462`: `1071=2·462+147;462=3·147+21;147=7·21` → 21. L3.

**Distractors and validation.** Report zero/quotient or noncanonical remainder. Reconstruct every line.

### Family `euclidean_missing_step`

**Task.** Fill a missing q/r/value in a valid Euclidean trace.

**Response and template.** Integer: `Complete {trace_with_gap}.`

**Derivation.** Use `a=qb+r` and `0≤r<b`, plus adjacent remainder continuity.

**Difficulty.** L1 remainder; L2 quotient; L3 missing dividend/divisor from adjacent lines.

**Examples.**

1. `43=5·8+?` →3. L1.
2. `95=?·36+23` →2. L2.
3. `?=4·17+5` and prior remainder continuity →73. L3.

**Distractors and validation.** Arithmetic difference without q factor. Full trace validator.

### Family `extended_euclid_bezout`

**Task.** Find x,y with `ax+by=gcd(a,b)`.

**Response and template.** Two integers: `Find Bézout coefficients for {a},{b}.`

**Derivation.** Back-substitute Euclidean equations or iterative extended algorithm.

**Difficulty.** L1 short; L2 several steps; L3 negative inputs/alternate valid pairs.

**Examples.**

1. gcd(18,12)=6: `18(1)+12(−1)=6`. L1.
2. For 99 and 78: `99−78=21,78−3·21=15,21−15=6,15−2·6=3`; back-substitution gives `99(−11)+78(14)=3`. L2.
3. for 35,12: `35(−1)+12(3)=1`; all equivalent pairs accepted. L3.

**Distractors and validation.** Coefficients produce 1 when gcd>1 or sign error. Direct linear certificate and gcd.

### Family `bezout_possible_values`

**Task.** Decide which integers can be represented as `ax+by`.

**Response and template.** Yes/no/certificate: `Can c={c} be written {a}x+{b}y?`

**Derivation.** Possible iff gcd(a,b)|c; scale Bézout pair when yes.

**Difficulty.** L1 divisibility; L2 construct pair; L3 characterize all representable values.

**Examples.**

1. `6x+9y=4` impossible because gcd3∤4. L1.
2. `6x+9y=12`: x=2,y=0. L2.
3. all values `14x+21y` are precisely multiples of 7. L3.

**Distractors and validation.** Any integer via negative coefficients. GCD criterion/certificate.

### Cross-family progression

Factor-based GCD/LCM precede Euclid. Coprimality is defined by GCD, not prime status. Complete traces precede gaps. Extended Euclid follows forward Euclid, then Bézout representability prepares inverses/Diophantine equations.

## 5. Category: Congruences and modular arithmetic

### Category purpose

Build residue-class equivalence and safe arithmetic/cancellation.

### Learn

`a≡b mod m` means the difference is a multiple of m. Reduce before or after addition/multiplication. Congruence is equality of residue classes, not ordinary equality.

### Common misconceptions

- Returning a negative/noncanonical remainder unintentionally.
- Comparing quotients instead of remainders.
- Reducing modulus itself like an operand.
- Dividing/cancelling without invertibility.
- Treating congruence as approximate equality.

### Family `canonical_residue`

**Task.** Normalize an integer modulo m.

**Response and template.** Integer `0..m−1`: `Find {a} mod {m}.`

**Derivation.** Euclidean quotient/remainder.

**Difficulty.** L1 positive; L2 negative; L3 large expression.

**Examples.**

1. 23 mod 7=2. L1.
2. −23 mod 7=5. L2.
3. `(10³+17) mod 9=0`. L3.

**Distractors and validation.** Negative host remainder or divisor−remainder mishap. Exact mod range.

### Family `congruence_decision`

**Task.** Decide `a≡b mod m` and give difference multiplier/residue.

**Response and template.** Yes/no/certificate: `Is {a}≡{b} (mod {m})?`

**Derivation.** Test `(a−b) mod m=0`.

**Difficulty.** L1 positive; L2 negative; L3 missing modulus candidates.

**Examples.**

1. 17≡5 mod12, difference12. L1.
2. −3≡4 mod7. L2.
3. 26≡8 mod m means m divides18; among m≥2 candidates are divisors of18. L3.

**Distractors and validation.** Same quotient or difference less than m. Divisibility certificate.

### Family `equivalent_representatives`

**Task.** List/select integers in a residue class or find representative in interval.

**Response and template.** Set/integer: `Which values are congruent to {a} mod {m}?`

**Derivation.** Values `a+km`; intersect bounds.

**Difficulty.** L1 select; L2 bounded list; L3 balanced representative.

**Examples.**

1. class 2 mod5 includes 7,−3. L1.
2. values ≡3 mod7 in `[-10,20]` → `{-4,3,10,17}`. L2.
3. canonical 8 mod11 has balanced representative −3. L3.

**Distractors and validation.** Step by residue not modulus. Enumerate k.

### Family `modular_add_subtract_multiply`

**Task.** Compute modular arithmetic expression.

**Response and template.** Canonical residue: `Compute ({expression}) mod {m}.`

**Derivation.** Reduce operands/intermediates exactly; operation homomorphism.

**Difficulty.** L1 sum/product; L2 negatives; L3 nested/multiple factors.

**Examples.**

1. `(8+9) mod7=3`. L1.
2. `(−4·6) mod11=9`. L2.
3. `(123·456+78) mod10=6`. L3.

**Distractors and validation.** Reduce only one operand or multiply residues then omit final reduction. BigInt direct/canonical.

### Family `modular_polynomial_substitution`

**Task.** Evaluate polynomial modulo m from x’s residue.

**Response and template.** Residue: `Given x≡{r} mod {m}, find {P(x)} mod {m}.`

**Derivation.** Substitute r and Horner-evaluate modulo m.

**Difficulty.** L1 linear; L2 quadratic; L3 degree≤5/negative coefficients.

**Examples.**

1. x≡3 mod7 → x+5≡1. L1.
2. x≡4 mod9 → x²+2x+1≡7. L2.
3. x≡−2 mod11 → x³−3x+4≡2. L3.

**Distractors and validation.** Substitute modulus or reduce exponent. Direct polynomial oracle.

### Family `modular_cancellation`

**Task.** Decide whether cancellation is valid and state resulting modulus/solutions.

**Response and template.** Choice/congruence: `From {c a}≡{c b} mod {m}, what may be concluded?`

**Derivation.** d=gcd(c,m); reduce to `a≡b mod m/d`; original-modulus cancellation only d=1.

**Difficulty.** L1 invertible c; L2 nonunit counterexample; L3 reduced modulus.

**Examples.**

1. `3a≡3b mod10` → a≡b mod10 since gcd=1. L1.
2. `2·1≡2·4 mod6` but 1≢4 mod6 → cancellation invalid. L2.
3. `6a≡6b mod15` → a≡b mod5. L3.

**Distractors and validation.** Always cancel or divide modulus by c rather than gcd. Exhaustive residue relation.

### Family `modular_expression_equivalence`

**Task.** Determine whether two modular expressions agree for every residue or give counterexample.

**Response and template.** Yes/no/witness: `Are {E1},{E2} congruent mod m for all x?`

**Derivation.** Normalize polynomial coefficient residues or exhaust finite residues for bounded m.

**Difficulty.** L1 distributive; L2 exponent expression; L3 false identity witness.

**Examples.**

1. `(x+3)²≡x²+6x+9` always. L1.
2. mod2, `x²≡x` for both residues. L2.
3. `x²≡x mod5` not always; x=2 gives4≠2. L3.

**Distractors and validation.** Infer integer identity from a few cases or vice versa. Symbolic/exhaustive oracle.

### Cross-family progression

Canonical residues precede congruence decisions/classes. Direct arithmetic precedes polynomial evaluation. Cancellation is introduced only after GCD fluency and is paired with counterexamples. Expression equivalence introduces finite exhaustive proof.

## 6. Category: Modular powers, cycles, and classical theorems

### Category purpose

Build efficient exponent reduction while checking theorem hypotheses instead of treating Fermat/Euler as magic.

### Learn

Repeated squaring computes `a^e mod m` in logarithmically many multiplications. A unit’s powers eventually repeat from 1; its multiplicative order divides `φ(m)`. Fermat/Euler apply only under their stated primality/coprimality hypotheses.

### Common misconceptions

- Compute huge power directly.
- Reduce exponent modulo m instead of a valid period.
- Apply Fermat when modulus composite.
- Apply Euler when base not coprime.
- Assume every cycle starts at 1 for nonunits.
- Confuse φ(m) with m−1 for composite m.

### Family `small_modular_power`

**Task.** Compute a manageable power modulo m.

**Response and template.** Residue: `Compute {a}^{e} mod {m}.`

**Derivation.** Repeated modular multiplication.

**Difficulty.** L1 exponent≤4; L2 recognize square; L3 negative base.

**Examples.**

1. `3⁴ mod5=1`. L1.
2. `7⁵ mod10=7`. L2.
3. `(−2)^7 mod9=7`. L3.

**Distractors and validation.** Reduce exponent mod m or sign loss. BigInt powmod.

### Family `repeated_squaring_trace`

**Task.** Complete binary exponentiation table and result.

**Response and template.** Ordered residues: `Compute {a}^{e} mod {m} by repeated squaring.`

**Derivation.** Compute `a^(1,2,4,...)`; multiply entries for set bits of e.

**Difficulty.** L1 one/two bits; L2 several; L3 missing table entry/exponent reconstruction.

**Examples.**

1. `3^13 mod7`: powers 3,2,4,2; use 8+4+1 →3. L1.
2. `5^23 mod13`: combine 16+4+2+1 →8. L2.
3. Missing `a^8` entry derived by squaring `a^4`, then use binary 29. L3 with a=2,m=17 gives `2^29≡15`.

**Distractors and validation.** Add residues or use wrong binary bits. Trace/powmod agreement.

### Family `power_cycle`

**Task.** Find/continue a residue power cycle and use it for exponent.

**Response and template.** Ordered cycle/residue: `List powers of {a} mod {m} until repetition; find {a}^{e}.`

**Derivation.** Iterate state; detect first repeated residue. Units return to 1; nonunits may have preperiod.

**Difficulty.** L1 unit short cycle; L2 exponent reduction; L3 nonunit preperiod.

**Examples.**

1. powers of 2 mod5: `2,4,3,1`, period4. L1.
2. `2^101 mod5`: 101 mod4=1 →2. L2.
3. powers of 2 mod8: `2,4,0,0...`, preperiod then fixed 0. L3.

**Distractors and validation.** Call nonunit sequence order or reduce before preperiod. Finite-state cycle detector.

### Family `euler_totient`

**Task.** Compute φ(n) from factorization or count units.

**Response and template.** Integer/set: `Find φ({n}).`

**Derivation.** `n∏_{p|n}(1−1/p)` or prime-power product; bounded enumeration cross-check.

**Difficulty.** L1 prime; L2 prime power/product; L3 raw factorization/unit list.

**Examples.**

1. φ(7)=6. L1.
2. φ(12)=12(1−1/2)(1−1/3)=4. L2.
3. units mod10 `{1,3,7,9}` → φ(10)=4. L3.

**Distractors and validation.** Count primes below n or n−number prime factors. GCD enumeration.

### Family `fermat_little_theorem`

**Task.** Reduce power modulo prime or check applicability.

**Response and template.** Residue/choice: `Use Fermat if applicable to compute {a}^{e} mod {p}.`

**Derivation.** For prime p and p∤a, reduce exponent modulo p−1; if p|a handle directly.

**Difficulty.** L1 theorem statement; L2 large exponent; L3 base divisible/hypothesis trap.

**Examples.**

1. `2^100 mod7`: 100 mod6=4 →2⁴=2. L1.
2. `5^123 mod11`: exponent3 →4. L2.
3. `7^20 mod7=0`; cannot replace with 1 using coprime form. L3.

**Distractors and validation.** Exponent mod p or apply to divisible base. Powmod/hypothesis.

### Family `euler_theorem`

**Task.** Reduce a modular power using Euler’s theorem and check coprimality.

**Response and template.** Residue/choice: `Compute {a}^{e} mod {m}; is Euler applicable?`

**Derivation.** If gcd(a,m)=1, `a^φ(m)≡1`; reduce exponent modulo φ.

**Difficulty.** L1 φ supplied; L2 compute φ; L3 noncoprime rejection.

**Examples.**

1. `3^100 mod10`, φ=4 →1. L1.
2. `5^43 mod12`, φ=4, exponent3 →5. L2.
3. `6^20 mod15`: gcd3, Euler not applicable; direct cycle gives6. L3.

**Distractors and validation.** Apply despite gcd or use m−1. Powmod.

### Family `multiplicative_order`

**Task.** Find ord_m(a) or use it to reduce exponent.

**Response and template.** Positive integer/residue: `Find ord_{m}({a}).`

**Derivation.** Require gcd=1; find least k>0 with a^k≡1, testing divisors of φ when useful.

**Difficulty.** L1 short enumeration; L2 divisor strategy; L3 undefined nonunit.

**Examples.**

1. ord_5(2)=4. L1.
2. ord_7(2)=3 because 2³≡1. L2.
3. ord_8(2) undefined since gcd(2,8)≠1. L3.

**Distractors and validation.** First repeated residue not necessarily 1 or φ automatically. Exact minimality.

### Family `theorem_selection_hypotheses`

**Task.** Choose a valid method/theorem for a power or identify missing hypothesis.

**Response and template.** Choice/reason: `Which reduction is justified for {expression}?`

**Derivation.** Evaluate prime/coprime/order facts against theorem schemas.

**Difficulty.** L1 prime Fermat; L2 composite coprime Euler; L3 neither/cycle needed.

**Examples.**

1. `3^50 mod7` → Fermat applicable. L1.
2. `5^100 mod12` → Euler applicable, gcd1. L2.
3. `6^100 mod15` → neither standard coprime theorem; use direct cycle. L3.

**Distractors and validation.** Theorem whose conclusion happens true but hypotheses fail. Schema plus powmod.

### Cross-family progression

Direct powers precede repeated squaring and cycles. Totient precedes Fermat/Euler practice, while explicit hypothesis questions accompany every theorem. Order follows cycles/totient. Nonunit counterexamples remain regular.

## 7. Category: Modular inverses and linear congruences

### Category purpose

Build exact modular division and complete solution-set reasoning.

### Learn

`a` has an inverse modulo m exactly when gcd(a,m)=1. Solve `ax≡b mod n` by the gcd criterion; non-coprime coefficients may give no solution or several residue classes.

### Common misconceptions

- Every nonzero residue has an inverse.
- Inverse is reciprocal fraction.
- Extended Euclid coefficient is not normalized.
- Divide a congruence without gcd.
- Return one solution when d solutions exist.
- Use modulus n rather than reduced n/d while solving.

### Family `unit_inverse_existence`

**Task.** Decide whether inverse exists/unit status.

**Response and template.** Yes/no: `Is {a} invertible modulo {m}?`

**Derivation.** Exactly when gcd(a,m)=1.

**Difficulty.** L1 prime modulus; L2 composite; L3 list all units.

**Examples.**

1. 3 invertible mod7. L1.
2. 6 not invertible mod15, gcd3. L2.
3. units mod8 are `{1,3,5,7}`. L3.

**Distractors and validation.** Nonzero means unit. GCD/enumeration.

### Family `modular_inverse_search`

**Task.** Find inverse by inspection/table for small modulus.

**Response and template.** Canonical residue: `Find {a}^{−1} mod {m}.`

**Derivation.** Search x=0..m−1 for ax modm=1 after gcd check.

**Difficulty.** L1 small; L2 negative a; L3 no inverse classification.

**Examples.**

1. `3⁻¹ mod7=5`. L1.
2. `(−2)⁻¹ mod5=2` because −4≡1. L2.
3. `4⁻¹ mod10` does not exist. L3.

**Distractors and validation.** m/a or sign inverse. Product certificate.

### Family `inverse_extended_euclid`

**Task.** Find inverse from extended Euclid trace.

**Response and template.** Residue/trace: `Use extended Euclid to find {a}^{−1} mod {m}.`

**Derivation.** From ax+my=1, inverse is x modm.

**Difficulty.** L1 trace supplied; L2 perform trace; L3 normalize negative coefficient.

**Examples.**

1. `3(−2)+7(1)=1` → inverse −2≡5 mod7. L1.
2. `17(−5)+43(2)=1` → inverse38 mod43. L2.
3. `35(−1)+12(3)=1` → 35 inverse mod12 is11. L3.

**Distractors and validation.** Use y or fail normalization. Multiply check.

### Family `modular_division`

**Task.** Evaluate `a/b mod m` or state undefined.

**Response and template.** Residue/undefined: `Compute {a}/{b} modulo {m}.`

**Derivation.** Find b inverse, multiply a, reduce; require gcd(b,m)=1.

**Difficulty.** L1 small; L2 reduce a/negative; L3 denominator nonunit.

**Examples.**

1. `4/3 mod7=4·5=6`. L1.
2. `−5/2 mod9=4·5=2`. L2.
3. `1/6 mod15` undefined. L3.

**Distractors and validation.** Integer division or cross-cancel. Inverse/product oracle.

### Family `linear_congruence_coprime`

**Task.** Solve ax≡b modn when gcd(a,n)=1.

**Response and template.** Congruence: `Solve {a}x≡{b} (mod {n}).`

**Derivation.** Multiply both sides by a inverse and normalize.

**Difficulty.** L1 inspection; L2 inverse; L3 negative coefficient/b.

**Examples.**

1. `3x≡1 mod7` → x≡5. L1.
2. `5x≡4 mod12` → inverse5, x≡8. L2.
3. `−3x≡5 mod11` → 8x≡5, inverse7, x≡2. L3.

**Distractors and validation.** Divide ordinary integers or inverse b. Exhaust residues.

### Family `linear_congruence_general`

**Task.** Solve non-coprime linear congruence completely.

**Response and template.** Residue set/no solution: `Solve {a}x≡{b} (mod {n}) in 0≤x<n.`

**Derivation.** d=gcd(a,n); reject if d∤b; reduce and lift d solutions.

**Difficulty.** L1 solvable two classes; L2 no solution; L3 d>2/lifting.

**Examples.**

1. `2x≡4 mod6` → x≡2 mod3 → `{2,5}` mod6. L1.
2. `4x≡3 mod10` → none since gcd2∤3. L2.
3. `6x≡9 mod15` → divide3: `2x≡3 mod5`, x≡4 mod5 → `{4,9,14}`. L3.

**Distractors and validation.** One reduced class only or divide modulus by a. Exhaustive residues.

### Family `linear_congruence_solution_count`

**Task.** Predict number/existence of solutions without listing all.

**Response and template.** Integer/no solution: `How many incongruent solutions does ax≡b modn have?`

**Derivation.** d if d|b, else 0.

**Difficulty.** L1 coprime; L2 noncoprime; L3 parameter b choices.

**Examples.**

1. `5x≡2 mod9` →1. L1.
2. `6x≡12 mod18` →6. L2.
3. `8x≡b mod20` has 4 solutions exactly when 4|b. L3.

**Distractors and validation.** n/d or always one. Enumerate.

### Family `inverse_linear_congruence`

**Task.** Construct b/a/modulus or coefficient to obtain a target solution set.

**Response and template.** Integer: `Choose {missing} so {congruence} has {target}.`

**Derivation.** Build from target x and gcd/solution-count constraints; validate all residues.

**Difficulty.** L1 missing b; L2 missing invertible a; L3 enforce multiple-solution set.

**Examples.**

1. `3x≡b mod7` with x≡4 → b=5. L1.
2. choose a inverse of 5 mod12 to make `ax≡1` solution x=5 → a=5. L2.
3. construct `2x≡4 mod6` for solution set `{2,5}`. L3.

**Distractors and validation.** Target satisfies but extra wrong cardinality. Exhaustive exact-set check.

### Cross-family progression

Existence precedes computation; search precedes extended Euclid. Modular division follows inverses. Coprime linear congruences precede general gcd cases, then solution counts and inverse construction.

## 8. Category: Chinese remainder systems

### Category purpose

Build systematic merging of residue constraints, including consistency for non-coprime moduli.

### Learn

Coprime congruences combine uniquely modulo the product. Non-coprime congruences combine only when their residues agree modulo the moduli’s GCD, and then repeat modulo the LCM.

### Common misconceptions

- Add residues/moduli.
- Multiply moduli even when non-coprime.
- Assume every system has a solution.
- Return one integer without combined modulus.
- Search only below largest modulus.
- Apply pairwise-coprime CRT formula to incompatible moduli.

### Family `crt_coprime_two`

**Task.** Solve two coprime congruences.

**Response and template.** `x≡r (mod M)`: `Solve x≡a modm, x≡b modn.`

**Derivation.** Substitute x=a+mk and solve mk≡b−a modn; M=mn.

**Difficulty.** L1 inspection; L2 inverse; L3 negative residues.

**Examples.**

1. x≡1 mod3,x≡2 mod5 → x≡7 mod15. L1.
2. x≡4 mod7,x≡3 mod8 → x≡11 mod56. L2.
3. x≡−1 mod5,x≡2 mod7 → x≡9 mod35. L3.

**Distractors and validation.** r=a+b or modulus m+n. Substitute/enumerate.

### Family `crt_coprime_three`

**Task.** Solve three pairwise-coprime congruences by incremental merging.

**Response and template.** Congruence: `Solve {three_system}.`

**Derivation.** Merge first two, then combined class with third.

**Difficulty.** L1 small clock-like; L2 varied residues; L3 missing trace merge.

**Examples.**

1. x≡0 mod2,1 mod3,4 mod5 → x≡4 mod30. L1.
2. x≡2 mod3,3 mod5,2 mod7 → x≡23 mod105. L2.
3. first merge gives x≡8 mod15; adding x≡1 mod7 → x≡? 8+15k≡1 mod7, k≡0 →8 mod105. L3.

**Distractors and validation.** Solve each independently/no combined period. Direct check/product uniqueness.

### Family `crt_general_consistency`

**Task.** Decide whether non-coprime system is consistent.

**Response and template.** Yes/no/reason: `Does {system} have an integer solution?`

**Derivation.** Check `a≡b mod gcd(m,n)`.

**Difficulty.** L1 compatible; L2 incompatible; L3 several constraints pair/incremental.

**Examples.**

1. x≡1 mod4,x≡3 mod6: gcd2, residues both odd → consistent. L1.
2. x≡1 mod4,x≡2 mod6: residues differ mod2 → none. L2.
3. `x≡1 mod4,x≡3 mod6` first merges to `x≡9 mod12`, so every candidate is `0 mod3`; adding `x≡1 mod3` makes the system inconsistent. L3.

**Distractors and validation.** Need equal residues exactly or always consistent. GCD criterion/enumeration.

### Family `crt_general_solve`

**Task.** Solve compatible non-coprime system.

**Response and template.** Congruence: `Solve {system}; give combined modulus.`

**Derivation.** Substitute, reduce linear congruence by gcd; M=lcm.

**Difficulty.** L1 inspection; L2 algebraic merge; L3 three constraints.

**Examples.**

1. x≡1 mod4,x≡3 mod6 → x≡9 mod12. L1.
2. x≡2 mod6,x≡5 mod9 → x≡14 mod18. L2.
3. merge x≡1 mod4,x≡3 mod6 then x≡4 mod5 → x≡9 mod60. L3.

**Distractors and validation.** Modulus product or list one occurrence. Substitute/LCM range.

### Family `crt_missing_residue`

**Task.** Recover missing residue/constraint from combined class.

**Response and template.** Residue: `Given x≡r modM and x≡a modm, what is x modn?`

**Derivation.** Reduce representative/completeness against component modulus; validate consistency.

**Difficulty.** L1 reduce; L2 unknown component; L3 choose all residues yielding target merge.

**Examples.**

1. x≡23 mod105 → x mod5=3. L1.
2. combined x≡11 mod56 and x≡4 mod7 → x≡3 mod8. L2.
3. target x≡9 mod12 with mod4 residue1 → mod6 residue3. L3.

**Distractors and validation.** Divide moduli or use quotient. Reduction oracle.

### Family `crt_application_schedule`

**Task.** Translate and solve repeating schedule/alignment constraints.

**Response and template.** Smallest nonnegative/time: `{scenario}; when next?`

**Derivation.** Convert offsets to congruences, solve CRT, choose smallest value satisfying lower bound.

**Difficulty.** L1 two coprime cycles; L2 offsets; L3 noncoprime consistency/lower bound.

**Examples.**

1. event at t≡1 mod3 and t≡2 mod5 → first t=7. L1.
2. bells ring at offsets 2 mod4 and 5 mod7 → t=26 mod28. L2.
3. constraints t≡1 mod4,t≡3 mod6 → t=9 mod12; first after 20 is21. L3.

**Distractors and validation.** LCM without offsets or first representative below bound. CRT plus bound.

### Cross-family progression

Two coprime constraints precede three. General consistency is taught before general solving. Missing-component questions invert the relationship. Applications follow symbolic fluency and always expose the translated congruences in feedback.

## 9. Category: Linear Diophantine equations

### Category purpose

Build complete integer-solution reasoning and distinguish one solution from all solutions or bounded feasible solutions.

### Learn

`ax+by=c` has integer solutions exactly when gcd(a,b) divides c. One Bézout solution generates all solutions by moving along a fixed integer direction.

### Common misconceptions

- Solving over reals/rationals and assuming integer values.
- GCD criterion reversed.
- Reporting one solution as all.
- Using wrong signs in parameter direction.
- Counting parameter endpoints incorrectly.
- Assuming nonnegative solutions exist whenever integer solutions do.

### Family `diophantine_solvability`

**Task.** Decide whether `ax+by=c` has integer solutions.

**Response and template.** Yes/no/reason: `Does {a}x+{b}y={c} have integer solutions?`

**Derivation.** d=gcd(a,b); yes iff d|c.

**Difficulty.** L1 obvious; L2 coefficients not coprime; L3 negative/zero coefficient.

**Examples.**

1. `6x+9y=12` → yes, gcd3|12. L1.
2. `6x+9y=10` → no. L2.
3. `0x+8y=24` → yes, y=3 and x arbitrary. L3.

**Distractors and validation.** c divides gcd or real solvability. GCD/certificate.

### Family `find_one_diophantine_solution`

**Task.** Find one integer solution using Bézout/scaling.

**Response and template.** Ordered pair: `Find one integer solution of {equation}.`

**Derivation.** Scale Bézout coefficients by c/d; simple inspection accepted.

**Difficulty.** L1 inspect; L2 extended Euclid; L3 negative c/coefficient.

**Examples.**

1. `4x+6y=10` → `(1,1)`. L1.
2. `35x+12y=7`; from `35(−1)+12(3)=1`, scale7 → `(−7,21)`. L2.
3. `14x−9y=1` → `(2,3)` because28−27=1. L3.

**Distractors and validation.** Pair solves modulo only. Direct equality.

### Family `parameterize_diophantine`

**Task.** Give all integer solutions from one solution.

**Response and template.** Parameter fields: `Find all integer solutions to {equation}.`

**Derivation.** Use normalized d and direction `(b/d,−a/d)`; verify exact solution-set equivalence.

**Difficulty.** L1 coefficients coprime; L2 d>1; L3 compare alternate parameterizations.

**Examples.**

1. `2x+3y=7`, one `(2,1)` → `x=2+3t,y=1−2t`. L1.
2. `6x+9y=12`, one `(2,0)` → `x=2+3t,y=−2t`. L2.
3. `x=5−3s,y=−1+2s` is equivalent to shifted/sign-changed valid parameterization for `2x+3y=7`. L3.

**Distractors and validation.** Direction `(a,b)` or same signs. Substitute and lattice-basis equality.

### Family `bounded_diophantine_solutions`

**Task.** List/count solutions satisfying nonnegative/positive/interval constraints.

**Response and template.** Pair set/count: `Solve {equation} with {bounds}.`

**Derivation.** Parameterize, convert every bound to integer interval for t, intersect/enumerate.

**Difficulty.** L1 nonnegative; L2 positive/bounds; L3 count without listing.

**Examples.**

1. `2x+3y=7`, x,y≥0 → `{(2,1)}`. L1.
2. `3x+5y=30`, x,y≥0 → `{(0,6),(5,3),(10,0)}`. L2.
3. same with x,y>0 → only `(5,3)`. L3.

**Distractors and validation.** Rational solutions or missed endpoints. Exhaust bounded grid.

### Family `coin_linear_combination`

**Task.** Determine/count ways to form total with item sizes/costs.

**Response and template.** Pair set/count: `How many nonnegative integer pairs satisfy {a}x+{b}y={total}?`

**Derivation.** Bounded Diophantine parameter interval; items considered unordered counts.

**Difficulty.** L1 one way; L2 several; L3 impossible/gcd or positive counts.

**Examples.**

1. 2-unit and 5-unit coins total 9 → `(2,1)`. L1.
2. 3- and 5-unit packs total30 → three pairs above. L2.
3. 6- and 10-unit packs total17 → none, gcd2∤17. L3.

**Distractors and validation.** Count orderings of coins. Equation enumeration.

### Family `diophantine_missing_parameter`

**Task.** Recover t or a missing coordinate in a parameterization.

**Response and template.** Integer: `Solutions are {parametric}; find solution with {condition}.`

**Derivation.** Solve linear coordinate constraint for integer t and verify both coordinates.

**Difficulty.** L1 given x; L2 range; L3 nearest/minimum under bounded linear criterion.

**Examples.**

1. `x=2+3t,y=1−2t`, x=11 → t=3,y=−5. L1.
2. same with y≥0 and x≥0 → t=0 only. L2.
3. choose t giving smallest nonnegative x among solutions → solve lower bound/step. For `x=−4+5t`, t=1 gives x=1. L3.

**Distractors and validation.** Independent coordinate choice. Substitute.

### Family `diophantine_congruence_link`

**Task.** Convert between divisibility/congruence and a two-variable equation.

**Response and template.** Equation/congruence: `Rewrite/solve {relation} using the equivalent form.`

**Derivation.** `ax≡b mod n` iff `ax−ny=b` for some integer y.

**Difficulty.** L1 translation; L2 use to solve; L3 explain solution count/parameter classes.

**Examples.**

1. `3x≡1 mod7` ↔ `3x−7y=1`. L1.
2. solution x=5 gives y=2:15−14=1. L2.
3. `6x≡9 mod15` ↔ `6x−15y=9`; gcd3 criterion and three x classes mod15. L3.

**Distractors and validation.** Plus/minus sign immaterial only with renamed y; exact existential equivalence.

### Cross-family progression

Solvability precedes one solution; one solution precedes parameterization. Bounds/counting then turn the lattice into finite answers. Applications remain clearly count-based. Congruence linkage consolidates the algebra.

## 10. Category: Residue patterns and toy applications

### Category purpose

Transfer modular reasoning to bounded practical patterns without implying cryptographic security.

### Learn

Many cyclic rules are congruences: clock positions, weekday offsets, check digits, and toy ciphers. The modulus and encoding must be explicit. Small RSA examples demonstrate inverse/exponent mechanics only; their sizes are deliberately insecure.

### Common misconceptions

- Mix 12-hour labels with residues 0..11.
- Ignore weights in a checksum.
- Assume checksum detects every error.
- Decode affine cipher without inverse.
- Use φ(n)=n−1 for RSA composite n.
- Treat toy RSA parameters as secure.

### Family `clock_arithmetic`

**Task.** Compute clock/cyclic position with explicit encoding.

**Response and template.** Label/residue: `On a {m}-position cycle encoded {encoding}, move {offset}.`

**Derivation.** Map label to residue, add offset, canonicalize, map back.

**Difficulty.** L1 positive; L2 negative; L3 solve starting/offset.

**Examples.**

1. 12-hour clock: 9+5 hours →2. L1.
2. weekday Monday plus −3 days → Friday. L2.
3. result 4 after +9 on 12-hour clock → start7. L3.

**Distractors and validation.** Return 0 instead of 12 under label mapping. Cycle oracle.

### Family `last_digit_digits`

**Task.** Find last digit or last k decimal digits using modulus `10^k`.

**Response and template.** Fixed-width digit string/integer: `Find the last {k} digit(s) of {expression}.`

**Derivation.** Powmod modulo `10^k`; pad leading zeroes for digit-string answer.

**Difficulty.** L1 product/sum; L2 power cycle; L3 two/three digits.

**Examples.**

1. last digit of `7^4` →1. L1.
2. last two digits of `3^10` →49. L2.
3. last three digits of `2^20` →576. L3.

**Distractors and validation.** Mod10 for all k or omit leading zeros. BigInt powmod/direct.

### Family `check_digit_compute`

**Task.** Compute missing/check digit under a fully displayed weighted congruence rule.

**Response and template.** Digit: `Choose c∈{digit_set} so Σw_i d_i+c≡{target} mod {m}.`

**Derivation.** Compute weighted residue; solve one small linear congruence/enumerate digit set.

**Difficulty.** L1 weight1; L2 alternating/varied; L3 coefficient nonunit/multiple/no digit.

**Examples.**

1. digits 1,2,3 and c make sum≡0 mod10 → c=4. L1.
2. weights 1,3,1 on digits 4,2,c target0 mod10 → c=0. L2.
3. `2c+3≡1 mod10` → `2c≡8`, digits `{4,9}` both satisfy; rule must specify tie policy or accept both. L3.

**Distractors and validation.** Ignore weights or subtract wrong direction. Enumerate allowed digits.

### Family `checksum_error_detection`

**Task.** Decide whether a changed digit/transposition is guaranteed detected by a displayed linear checksum.

**Response and template.** Yes/no/counterexample: `Under {checksum}, does {error_class} always change checksum?`

**Derivation.** Compute checksum difference modulo m; universal claim via bounded symbolic/enumeration.

**Difficulty.** L1 single digit; L2 weighted; L3 transposition/counterexample.

**Examples.**

1. sum mod10 detects a single digit change by ±1..±9. L1.
2. sum mod10 does not detect swapping two digits. L2.
3. weighted rule: swap effect `(w_i−w_j)(d_j−d_i)`; test modulo m. L3.

**Distractors and validation.** One sample implies guarantee. Exhaustive digit errors.

### Family `affine_cipher_toy`

**Task.** Encode/decode symbols with `E(x)=ax+b modm`.

**Response and template.** Symbol/residue: `Using alphabet encoding {mapping}, {encode_or_decode} {value}.`

**Derivation.** Encode directly; decode `a⁻¹(y−b)`; require gcd(a,m)=1.

**Difficulty.** L1 encode; L2 decode; L3 invalid key.

**Examples.**

1. mod26, a=5,b=8, x=0(A) → y=8(I). L1.
2. y=8, inverse of5 is21 → x=0. L2.
3. a=2 mod26 invalid for a permutation because gcd2. L3.

**Distractors and validation.** Subtract b after inverse incorrectly or nonunit key. Full alphabet bijection.

### Family `rsa_toy_key_math`

**Task.** Compute n,φ(n), or tiny private exponent from supplied distinct primes and e.

**Response and template.** Integer: `Toy RSA with p={p},q={q},e={e}; find {target}.`

**Derivation.** `n=pq`, `φ=(p−1)(q−1)`, require gcd(e,φ)=1, `d=e⁻¹ modφ`.

**Difficulty.** L1 n/φ; L2 d; L3 reject invalid e.

**Examples.**

1. p=5,q=11 → n=55,φ=40. L1.
2. e=3 → d=27 because81≡1 mod40. L2.
3. e=10 invalid since gcd(10,40)≠1. L3.

**Distractors and validation.** φ=n−1 or d ordinary reciprocal. Prime/gcd/inverse certificates; warning “toy/insecure.”

### Family `rsa_toy_transform`

**Task.** Encrypt/decrypt/sign-verify a tiny residue using supplied exponents.

**Response and template.** Residue: `Compute c=m^e modn` or `m=c^d modn` for toy values.`

**Derivation.** Repeated squaring; inputs restricted to declared residue range, parameters prevalidated.

**Difficulty.** L1 small encrypt; L2 decrypt; L3 round-trip/hypothesis.

**Examples.**

1. n=55,e=3,m=2 → c=8. L1.
2. d=27,c=8 → `8^27 mod55=2`. L2.
3. encrypt then decrypt m=7 under valid toy key returns7; show modular-power traces. L3.

**Distractors and validation.** Ordinary exponent without mod or wrong exponent. Independent powmod and exhaustive message round-trip for fixture.

### Family `quadratic_residue_intro`

**Task.** List/test squares modulo m or solve `x²≡a`.

**Response and template.** Residue/solution set: `Solve x²≡{a} mod {m} for 0≤x<m.`

**Derivation.** Exhaust square residues for bounded m≤50; deduplicate results.

**Difficulty.** L1 prime small; L2 composite/multiple roots; L3 no solution.

**Examples.**

1. squares mod7 are `{0,1,2,4}`. L1.
2. `x²≡1 mod8` → `{1,3,5,7}`. L2.
3. `x²≡3 mod7` → no solution. L3.

**Distractors and validation.** Only principal square root or integer square test. Exhaustive residue oracle.

### Cross-family progression

Clock/last-digit applications begin after basic modular arithmetic. Check digits introduce weighted linear congruences and limitations. Affine cipher follows inverses. Toy RSA follows totient/inverse/powmod and always displays an insecurity disclaimer. Quadratic residues remain bounded enumeration, not advanced theory.

## 11. Topic-wide progression

Recommended order:

1. divisibility, factors/multiples, Euclidean quotient/remainder;
2. primes, trial division, factorization, divisor structure;
3. GCD/LCM, coprimality, Euclidean traces;
4. canonical residues, congruence classes, modular arithmetic;
5. extended Euclid and Bézout coefficients;
6. modular inverses/division and coprime linear congruences;
7. power cycles, repeated squaring, totient, Fermat/Euler/order;
8. general linear congruences and solution counts;
9. coprime/general CRT;
10. Diophantine parameterization and bounded solutions;
11. check digits, toy affine/RSA, and quadratic residues.

Prerequisite gates:

- quotient/remainder gates canonical modular residues;
- prime factorization gates factor-based GCD/LCM, τ/σ, and φ;
- Euclid gates extended Euclid;
- Bézout/coprimality gate inverses;
- inverses gate modular division and coprime congruences;
- general congruences gate generalized CRT;
- Bézout parameterization gates Diophantine equations;
- repeated squaring/totient/inverses gate toy RSA.

Interleave:

- factor method and Euclidean GCD;
- direct congruence arithmetic and representative normalization;
- valid theorem use and failed-hypothesis counterexamples;
- coprime and non-coprime inverse/congruence cases;
- solvable/inconsistent CRT systems;
- one solution and all-solution parameterizations;
- symbolic forms and bounded exhaustive residue tables.

## 12. Adaptive practice guidance

Track:

`family`, `signPattern`, `zeroCase`, `factorShape`, `primeExponent`, `euclideanLength`, `remainderConvention`, `modulusType`, `gcdWithModulus`, `solutionCount`, `theorem`, `hypothesisStatus`, `representation`, `parameterization`, `application`, and `misconception`.

| Error pattern | Diagnosis | Follow-up |
|---|---|---|
| reverses `a|b` | divisor/dividend roles | multiplication-certificate field |
| negative remainder | truncating remainder model | Euclidean q,r reconstruction |
| calls 1 prime | unit/prime boundary | 0,1,2 contrasts |
| divisor count sums exponents | independent exponent choices missed | divisor lattice/product |
| GCD uses max exponents | GCD/LCM swapped | paired factor table |
| Euclid reports zero remainder | stopping rule | mark last nonzero |
| Bézout pair forced positive | coefficient sign model | direct certificate alternatives |
| negative residue left unnormalized | representative/class confusion | number-line class/list |
| cancels a nonunit | modular division assumed | gcd/counterexample |
| computes huge power directly | no cycle/squaring strategy | binary exponent table |
| reduces exponent mod m | modulus/period confusion | order versus modulus contrast |
| Fermat used with composite p | hypothesis skipped | classify modulus first |
| Euler used for noncoprime base | unit hypothesis skipped | gcd diagnostic |
| inverse given for nonunit | nonzero/unit confusion | unit list |
| one solution to noncoprime congruence | lifting omitted | reduced modulus plus d lifts |
| CRT modulus always product | coprimality ignored | gcd consistency/lcm |
| incompatible CRT solved anyway | residue compatibility missed | compare residues mod gcd |
| one Diophantine pair reported as all | lattice direction missing | parameterization scaffold |
| parameter signs same | direction error | substitute t and t+1 |
| rational/nonnegative mix | integer/bound constraint missed | t interval |
| checksum guarantee from examples | universal claim unsupported | symbolic difference/counterexample |
| toy RSA treated secure | scope misunderstanding | explicit educational warning |

Selection: 35% weakest misconception/family, 25% spaced mastery, 15% representation transfer, 10% theorem-hypothesis diagnostics, 10% inverse/construction, 5% mixed applications.

Slow but correct trial arithmetic should trigger smaller-number fluency or method choice, not concept demotion. If a learner gives a valid noncanonical representative, mark the congruence correct but schedule normalization unless canonical form was explicitly required.

## 13. Feedback and worked solutions

Worked solutions should:

1. state the definition/theorem and hypotheses;
2. normalize signs/remainders;
3. show factor, Euclidean, residue, or parameter steps;
4. preserve exact integer arithmetic;
5. state the complete answer class/modulus/parameter range;
6. verify by multiplication, divisibility, substitution, or exhaustive bounded residues.

Diagnostic examples:

> `−17/5` truncated toward zero gives remainder `−2`, but this app uses Euclidean remainder. `−17=(−4)·5+3`, so the residue is 3.

> You cancelled 6 modulo 15. Since gcd(6,15)=3, cancellation reduces the modulus to 5; it does not preserve modulus 15.

> Euler’s theorem requires gcd(a,m)=1. Here gcd(6,15)=3, so use the actual power cycle.

> Reducing `6x≡9 mod15` gives one class modulo 5, which lifts to three classes modulo 15: 4,9,14.

> `(−7,21)` is a correct solution, but not the whole set. Add multiples of `(12,−35)` for `35x+12y=7`.

Do not reject alternate Bézout pairs, CRT representatives, or equivalent Diophantine parameters after semantic verification.

## 14. Rendering, interaction, and accessibility

- Use semantic math markup and accessible linear text for divisibility, congruence, gcd, powers, and parameterizations.
- Do not use vertical bar ambiguously: screen readers say “divides,” not “absolute value.”
- Euclidean traces align dividend, quotient, divisor, and remainder in semantic table columns.
- Prime factorizations use factor cards or exponents with text equivalents.
- Residue circles/number lines expose every value and class as text.
- Sets and congruence-system fields are fully keyboard operable.
- Color is not the only cue for primes, residues, satisfied constraints, or theorem hypotheses.
- Toy-cryptography prompts visibly and accessibly say “educational toy; insecure.”

## 15. Generator and implementation requirements

### Exact integer engine

Use `BigInt` for all values. Implement independently reviewed:

- Euclidean `divmod` for negative dividends;
- gcd/lcm;
- deterministic bounded prime sieve/trial division;
- exact factorization of generator-bounded values;
- extended gcd;
- modular normalization/multiplication/pow;
- inverse and linear-congruence solution;
- coprime/general CRT merge;
- Diophantine parameter canonicalization;
- valuation/totient/divisor functions.

Never use JavaScript `%` directly as the mathematical modulo oracle without canonical normalization.

### Controlled proof/counterexample model

Divisibility/theorem questions use typed facts/rules. Universal modular claims may be proven by:

- exact polynomial coefficient normalization where valid;
- exhaustive residues for the displayed finite modulus;
- theorem schema with verified hypotheses.

Invalid claims store a concrete checked counterexample. Free-form prose is not graded.

### Independent validation

- Factorization multiplies back and every base is prime.
- GCD uses both Euclid and factor/enumeration property tests.
- Bézout pairs are direct certificates.
- Modular answers are recomputed by independent canonical and repeated-add/multiply paths for bounded values.
- Linear congruence/CRT/quadratic-residue sets are exhaustively enumerated for generation bounds.
- Diophantine parameterizations are checked algebraically plus bounded sampling/set comparison.
- Powmod uses independent binary and cycle/direct implementations.
- Toy RSA validates every message residue for the tiny fixture where feasible.

### Offline constraint

All generation/checking runs in the standalone page. No backend, arbitrary-precision service, factoring API, cryptographic provider, or network lookup is used. Toy crypto never calls production cryptographic APIs or stores keys.

## 16. Automated validation

For every instance:

- all placeholders parse as integers/moduli;
- moduli meet family bounds;
- q,r reconstruct dividend and satisfy the Euclidean range;
- factorizations are complete and exact;
- divisor/GCD/LCM/totient outputs match independent oracles;
- every Euclidean trace line is canonical and connects to the next;
- Bézout/Diophantine certificates substitute exactly;
- residues are canonical when requested;
- inverses exist exactly when gcd=1;
- linear-congruence solution count and set are complete;
- CRT consistency, representative, and combined modulus are exact;
- theorem hypotheses are visibly supplied and true when invoked;
- power reductions match direct powmod;
- application encoding/weights/cycle mapping is explicit;
- choices contain exactly one correct/best answer;
- distractors are distinct and reproduce named misconceptions;
- worked solutions end in the canonical/accepted answer class.

Fuzz/property minimums:

- 100,000 Euclidean divmod/divisibility cases including negatives/zero;
- 100,000 factor/GCD/LCM/Euclid cases;
- 100,000 modular arithmetic/cancellation/power cases;
- 50,000 inverse/linear-congruence cases;
- 50,000 CRT systems including inconsistent/noncoprime;
- 50,000 Diophantine parameter/bound cases;
- 25,000 theorem-hypothesis/application cases.

## 17. Coverage requirements

Balance:

- positive/negative/zero dividends and exact/nonexact division;
- prime/composite/unit/zero classification;
- squarefree/repeated-prime/perfect-power factorizations;
- gcd 1, proper >1, one operand divides other, and zero cases;
- short/medium Euclidean traces and varied quotients;
- positive/negative/canonical/balanced residue representations;
- prime/composite moduli and unit/nonunit operands;
- power cycles, repeated squaring, Fermat/Euler applicable/inapplicable;
- inverse exists/does not;
- linear congruences with 0,1,and d>1 solutions;
- CRT coprime/noncoprime compatible/incompatible;
- Diophantine none/one displayed/all parameterized/bounded multiple;
- application questions and explicit limitations.

Within a session, suppress exact repeats for 100 items and structural repeats for 20; avoid more than two consecutive raw-computation families; include at least one theorem-hypothesis or counterexample item per six calculations after unlock.

## 18. Topic-level quality checklist

- [ ] Euclidean remainder convention handles negative dividends explicitly.
- [ ] Zero/divisor/GCD/LCM conventions are stated and tested.
- [ ] Prime excludes 1 and negative integers.
- [ ] Factorizations are complete and validated.
- [ ] Euclidean algorithm reports the last nonzero remainder.
- [ ] Alternate Bézout coefficients are accepted.
- [ ] Congruence answers distinguish class from representative.
- [ ] Modular cancellation/division checks gcd.
- [ ] Fermat/Euler/order families enforce hypotheses.
- [ ] General linear congruences return every residue class.
- [ ] General CRT checks consistency and uses LCM modulus.
- [ ] Diophantine answers distinguish one from all/bounded solutions.
- [ ] Universal claims have proof schemas or counterexamples.
- [ ] Toy cryptography is labeled insecure and educational.
- [ ] Every family has at least three examples and validation.
- [ ] Difficulty grows through structure rather than integer size.
- [ ] All arithmetic uses exact local integers.
- [ ] The standalone app requires no backend/service.
- [ ] Repeated practice improves transferable modular reasoning.

## 19. Stable navigation

1. `divisibility` — Divisibility & Remainders
2. `primes` — Primes & Factorization
3. `gcd-euclid` — GCD, LCM & Euclid
4. `congruences` — Congruences & Modular Arithmetic
5. `powers` — Modular Powers & Theorems
6. `inverses` — Inverses & Linear Congruences
7. `crt` — Chinese Remainder Systems
8. `diophantine` — Diophantine Equations
9. `applications` — Residue Patterns & Toy Applications

Family identifiers are stable persistence/analytics keys and must not be translated or silently repurposed.
