# Floating-Point Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator and UI implementers

## 1. Topic overview

### Goal

Develop an exact mental model of binary floating point: classify bit patterns, decode and encode values, reason about normalization/subnormals, determine spacing and neighbors, judge exact representability, and predict rounding or absorption in small arithmetic.

### Formats

All formats use one sign bit, a biased exponent, and a trailing-fraction field:

| ID | Bits | Exponent | Fraction | Bias | Precision `p` |
|---|---:|---:|---:|---:|---:|
| FP4 | 4 | 2 | 1 | 1 | 2 |
| FP6 | 6 | 3 | 2 | 3 | 3 |
| FP8 | 8 | 4 | 3 | 7 | 4 |
| binary16 / FP16 | 16 | 5 | 10 | 15 | 11 |
| binary32 / FP32 | 32 | 8 | 23 | 127 | 24 |

FP4/6/8 are pedagogical IEEE-style formats. FP16 and FP32 follow IEEE binary16/binary32 field layouts. The app does not claim that JavaScript evaluates arithmetic in these formats.

### Normative model

For sign `s`, exponent field `E`, fraction integer `F`, fraction width `f`, bias `B`:

- `E=0,F=0`: signed zero `(-1)^s 0`.
- `E=0,F≠0`: subnormal `(-1)^s × (F/2^f) × 2^(1-B)`.
- `0<E<Emax`: normal `(-1)^s × (1+F/2^f) × 2^(E-B)`.
- `E=Emax,F=0`: signed infinity.
- `E=Emax,F≠0`: NaN.

Default rounding is **round to nearest, ties to even**. Unless a family explicitly teaches another mode, no other mode is used. Overflow under this mode produces signed infinity; underflow may produce a subnormal or signed zero. Exact operations are conceptually evaluated with unbounded rationals before one rounding to the target format.

NaN payload/sign and signaling-versus-quiet classification are excluded. Encoding “NaN” uses a declared canonical pattern per format. Comparisons and arithmetic involving NaN/infinity are excluded except explicit classification/special-result families.

### Scope

- field extraction and classification;
- exact finite decode/encode;
- exponent bias and hidden leading bit;
- smallest/largest finite values and normal/subnormal boundary;
- ULP spacing and adjacent representable values;
- exactness of integers and rational numbers;
- rounding to a format, including ties-to-even;
- whether an addition changes the stored value;
- selected special results such as finite overflow and signed zero.

### Exclusions

No decimal floating formats, extended precision, fused multiply-add, compiler excess precision, language-specific constant parsing, exception flags, traps, NaN payloads, signaling NaNs, total ordering, decimal-to-binary shortest printing algorithms, catastrophic-cancellation error analysis, iterative algorithms, or numerical-method stability.

### Answer conventions

- Bit patterns require exactly the format width; spaces/underscores and optional `0b` are accepted.
- FP16/FP32 also accept exact-width hexadecimal with optional `0x`.
- Finite values accept reduced fractions, integers, mixed numbers, or exact terminating decimals.
- Approximate decimals are accepted only when the prompt requests rounding and states tolerance.
- `+0` and `-0` remain distinct when sign is requested.
- Classes are `zero`, `subnormal`, `normal`, `infinity`, `NaN`.
- Yes/no uses controls.
- Named fields are used for sign, stored exponent, unbiased exponent, significand, and value.

### Difficulty philosophy

Difficulty rises through removing field cues, crossing normal/subnormal boundaries, inverse encoding, tie cases, mixed bit/hex forms, and combining spacing with rounding. It must not rise through long binary transcription or requiring memorization of large decimal FP32 values.

### Generation and oracle

Every item stores format, raw bits, exact rational value where finite, class, fields, rounding mode, semantic family, misconception, and structural signature.

Use integer/BigInt rational arithmetic as the oracle. Host `Number`, typed arrays, or JavaScript arithmetic may be supplementary checks for binary32 but never the canonical derivation. Enumerate all FP4/6/8 patterns exhaustively. For FP16/32, use field formulas and boundary-focused generators.

## 2. Category: Classification and Fields

### Learn

Exponent all zero means zero/subnormal; exponent all ones means infinity/NaN. The fraction distinguishes within those pairs. Sign never changes the class.

### Misconceptions

Treating every exponent-zero value as zero; every exponent-one value as infinity; sign-one as a separate class; or interpreting NaN as an especially large number.

### Family `classify_pattern`

**Task/template.** `Classify {format} pattern {bits}.`

**Derivation.** Extract `E,F`; apply normative class table.

**Constraints.** Balance all five classes and both signs; NaN fraction nonzero.

**Difficulty.** L1 fields separated; L2 raw bits; L3 hex; L4 boundary contrasts; L5 classify several adjacent patterns.

**Feedback.** Show exponent/fraction fields and decisive rule.

**Examples.**

1. FP4 `0000` → `zero`.
2. FP4 `0001` → `subnormal`.
3. FP32 `0x7F800001` → `NaN`.

**Validation.** Field-mask oracle; exhaustive toy formats.

### Family `extract_fields`

**Task.** Give sign, stored exponent, and fraction fields from a pattern.

**Derivation.** Slice according to declared format widths.

**Constraints.** Exact field widths retained; no numeric interpretation required.

**Difficulty.** L1 visual separators; L2 contiguous bits; L3 hex; L4 convert fields to integers.

**Feedback.** Overlay field boundaries.

**Examples.**

1. FP6 `1 100 10` → `s=1,E=100,F=10`.
2. FP8 `0xB4` (`1 0110 100`) → `s=1,E=6,F=4`.
3. FP16 `0x3C00` → `s=0,E=01111,F=0000000000`.

**Validation.** Reassemble fields to identical raw pattern.

### Family `special_sign`

**Task.** Distinguish `+0/-0` or `+∞/-∞` while retaining common class.

**Derivation.** Class from `E,F`; sign from sign bit.

**Constraints.** Only zero/infinity; do not assign ordered numeric meaning to NaN sign.

**Difficulty.** L1 zero; L2 infinity; L3 bit/hex.

**Feedback.** State class and signed value separately.

**Examples.**

1. FP4 `1000` → class zero, value `-0`.
2. FP4 `0110` → `+∞`.
3. FP16 `0xFC00` → `-∞`.

**Validation.** Exact known field patterns.

## 3. Category: Exact Decoding

### Learn

Normals use hidden leading `1`; subnormals use leading `0` and exponent `1-bias`. Decode as an exact power-of-two fraction before converting to decimal.

### Family `decode_normal`

**Task/template.** `Decode {format} {bits} exactly.`

**Derivation.** `(-1)^s(2^f+F)2^(E-B-f)`.

**Constraints.** Normal only; answers kept concise for larger formats through sparse fractions/exponents.

**Difficulty.** L1 powers; L2 fractional significand; L3 negative; L4 hex; L5 large/small power.

**Feedback.** Show sign, unbiased exponent, significand, exact product.

**Examples.**

1. FP4 `0010` → `1`.
2. FP6 `001110` (`0 011 10`) → `3/2`.
3. FP16 `0xC500` → `-5`.

**Validation.** Rational field formula and encode round-trip.

### Family `decode_subnormal`

**Task.** Decode a subnormal exactly.

**Derivation.** `(-1)^s F×2^(1-B-f)`.

**Constraints.** `F≠0`; include smallest/largest subnormal.

**Difficulty.** L1 one fraction bit; L2 several; L3 negative; L4 FP16/32 power notation.

**Feedback.** Explicitly omit hidden one.

**Examples.**

1. FP4 `0001` → `1/2`.
2. FP6 `000011` → `3/16`.
3. FP16 `0x0001` → `2^-24`.

**Validation.** Rational formula; boundary order checks.

### Family `decode_components`

**Task.** Provide unbiased exponent, exact significand, and value.

**Derivation.** Normal exponent `E-B`; subnormal effective exponent `1-B`; significand per class.

**Constraints.** Finite nonzero; fields named to avoid confusing stored/effective exponent.

**Difficulty.** L2 normal; L3 subnormal; L4 mixed.

**Feedback.** Three-column field→component→value table.

**Examples.**

1. FP6 `0 100 01` → exponent `1`, significand `5/4`, value `5/2`.
2. FP6 `0 000 10` → effective exponent `-2`, significand `1/2`, value `1/8`.
3. FP32 `0x3FC00000` → exponent `0`, significand `3/2`, value `3/2`.

**Validation.** Components recombine to rational value.

## 4. Category: Encoding and Rounding

### Learn

Choose sign, normalize magnitude, encode biased exponent and trailing fraction. If value is not exact, compare adjacent representable values; at an exact midpoint choose the one whose retained significand integer is even.

### Misconceptions

Storing the hidden one, biasing subnormal exponent normally, truncating instead of rounding, ties always upward, or losing signed zero.

### Family `encode_exact_finite`

**Task.** Encode an exactly representable finite value.

**Derivation.** Normalize or express as subnormal unit multiple; populate fields.

**Constraints.** Unique finite pattern except numeric zero, whose requested sign is explicit.

**Difficulty.** L1 positive normal; L2 negative/subnormal; L3 boundary; L4 hex.

**Feedback.** Show binary normalization and fields.

**Examples.**

1. FP4 `1` → `0010`.
2. FP6 `-3/2` → `101110`.
3. FP16 `5` → `0x4500`.

**Validation.** Decode encoded bits equals source exactly.

### Family `encode_special`

**Task.** Encode signed zero/infinity or canonical NaN.

**Derivation.** Use reserved exponent and fraction rules.

**Constraints.** NaN canonical fraction specified in prompt/format metadata.

**Difficulty.** L1 zeros; L2 infinities; L3 NaN/hex.

**Feedback.** Explain reserved field selection.

**Examples.**

1. FP4 `-0` → `1000`.
2. FP6 `+∞` → `011100`.
3. FP16 canonical quiet NaN → `0x7E00`.

**Validation.** Classification round-trip.

### Family `round_to_format`

**Task.** Encode a nonrepresentable exact rational using nearest-even.

**Derivation.** Locate adjacent values, compare exact rational distances; ties choose even retained significand.

**Constraints.** Include below/above/tie outcomes; exclude overflow until separate family.

**Difficulty.** L2 toy non-tie; L3 tie; L4 normal/subnormal boundary; L5 FP16/32 sparse cases.

**Feedback.** Show neighbors, distances, tie parity.

**Examples.**

1. FP4 value `5/4`, neighbors `1` and `3/2` → `1` (`0010`), midpoint tie and lower significand even.
2. FP6 value `13/8`, neighbors `3/2` and `7/4` → `3/2`, midpoint tie with even retained significand.
3. FP8 value `1.1` exact decimal → nearest pattern determined by rational comparison, `0x39` (`1.125`).

**Validation.** Exhaustive nearest search for toy formats; integer rounding oracle for larger formats.

### Family `rounding_boundary_result`

**Task.** Determine result class/value at overflow or underflow boundary.

**Derivation.** Apply nearest-even including subnormal/zero and max-finite/infinity boundaries.

**Constraints.** Exact boundary rationals; signed direction explicit.

**Difficulty.** L3 subnormal/zero; L4 normal boundary; L5 overflow midpoint.

**Feedback.** Show boundary neighbors and rounding rule.

**Examples.**

1. FP4 positive value `1/4` → `+0` (tie between 0 and smallest subnormal; zero even).
2. FP6 value `7/32` → smallest positive normal `000100` (tie with the largest subnormal; the normal endpoint has the even retained significand).
3. binary16 exact `65520` → `+∞` under nearest-even.

**Validation.** Enumerated adjacent extended endpoints and independent known IEEE boundary tests.

## 5. Category: Exponents, Range, and Spacing

### Family `remove_exponent_bias`

**Task.** Convert stored normal exponent to unbiased exponent or reverse.

**Derivation.** `e=E-B`; reverse `E=e+B`.

**Constraints.** Normal exponent fields only; subnormal effective exponent belongs elsewhere.

**Difficulty.** L1 direct; L2 inverse; L3 binary field; L4 FP32.

**Feedback.** Distinguish stored field from actual power.

**Examples.**

1. FP6 `E=100₂=4`, bias3 → `e=1`.
2. FP8 desired `e=-3`, bias7 → stored `E=4=0100`.
3. FP32 `E=130` → `e=3`.

**Validation.** Range and inverse checks.

### Family `ulp_spacing`

**Task.** Find adjacent spacing in normal binade near `2^e`.

**Derivation.** `ULP=2^(e-(p-1))`. Subnormal spacing is constant `2^(1-B-f)`.

**Constraints.** State whether normal binade/subnormal region; do not call ULP “epsilon.”

**Difficulty.** L1 toy; L2 inverse; L3 subnormal; L4 FP32.

**Feedback.** Show precision and exponent substitution.

**Examples.**

1. FP6 (`p=3`) near `2^1` → spacing `1/2`.
2. FP8 near `2^-2` → spacing `1/32`.
3. FP32 near `2^20` → spacing `1/8`.

**Validation.** Difference of adjacent enumerated/constructed patterns.

### Family `adjacent_values`

**Task.** Give predecessor/successor of a finite value.

**Derivation.** Step raw encoding in numeric order with sign-aware handling; verify exact rational adjacency.

**Constraints.** Exclude NaN; state handling at zero/infinity. Include binade/subnormal transitions.

**Difficulty.** L2 positive normal; L3 boundary; L4 negative; L5 hex.

**Feedback.** Show spacing on each side (which can differ at a power of two).

**Examples.**

1. FP4 successor of `1` → `3/2`.
2. FP6 predecessor of smallest normal `1/4` → largest subnormal `3/16`.
3. FP32 successor of `1` → `1+2^-23`.

**Validation.** Exhaustive ordered list toy; bit-neighbor/rational proof larger.

### Family `format_extrema`

**Task.** Find smallest subnormal, smallest normal, largest finite, or exponent range.

**Derivation.** Apply boundary fields.

**Constraints.** Requested endpoint explicit; exact power/fraction answer preferred.

**Difficulty.** L1 toy; L2 compare endpoints; L3 FP16; L4 FP32.

**Feedback.** Show boundary pattern and decode.

**Examples.**

1. FP6 smallest positive subnormal → `1/16`.
2. FP6 smallest positive normal → `1/4`.
3. binary16 largest finite → `65504` (`0x7BFF`).

**Validation.** Boundary patterns and ordering.

## 6. Category: Exact Representability

### Learn

A reduced rational has a terminating binary expansion only if its denominator is a power of two, but it must also fit format range/precision. Integers are consecutive only through `2^p`; above that, spacing grows.

### Family `rational_exactness`

**Task.** Decide whether a stated rational is exactly representable in a format.

**Derivation.** Reduce fraction; require power-of-two denominator, range, and alignment to local spacing/subnormal unit.

**Constraints.** Include denominator trap, precision trap, range trap, and exact cases.

**Difficulty.** L1 denominator property; L2 format precision; L3 subnormal; L4 boundaries.

**Feedback.** Identify first failed condition.

**Examples.**

1. binary32 `1/10` → no.
2. binary32 `3/8` → yes.
3. FP4 `3/4` → no; finite values near there are `1/2` and `1`.

**Validation.** Reduced rational against exact format lattice.

### Family `integer_exactness`

**Task.** Decide whether an integer is exactly representable.

**Derivation.** Check range and divisibility by spacing in its binade.

**Constraints.** Cases around `2^p`, odd/even gaps, max finite.

**Difficulty.** L2 toy threshold; L3 one above threshold; L4 FP32 landmarks.

**Feedback.** State local spacing and divisibility.

**Examples.**

1. FP6 (`p=3`) integer `8` → yes.
2. FP6 integer `9` → no; spacing there is 2.
3. FP32 `16777217` → no; neighbors `16777216,16777218`.

**Validation.** Exact encoding attempt.

### Family `operation_exactness`

**Task.** Decide whether an exact arithmetic result is representable before computing rounded bits.

**Derivation.** Evaluate operands as rationals, perform stated `+,-,×` exactly, run representability test.

**Constraints.** Finite exact operands, one operation, no overflow special unless target.

**Difficulty.** L3 addition; L4 multiplication/cancellation; L5 boundary.

**Feedback.** Separate exact mathematical result from rounded stored result.

**Examples.**

1. binary32 `1/2+1/4=3/4` → exact.
2. binary32 `1+2^-24` → mathematical result not representable.
3. FP6 `3/2×3/2=9/4` → not representable in FP6.

**Validation.** Rational operation plus lattice test.

## 7. Category: Rounding Effects and “Will It Change?”

### Family `addition_changes_value`

**Task.** Given representable `x` and exact increment `y`, decide whether rounded `x+y` differs from `x`.

**Derivation.** Compute exact sum and nearest-even rounding; do not use only “less than half ULP” at ties.

**Constraints.** Finite positive base initially; include below/above/tie and even/odd tie cases.

**Difficulty.** L2 obvious. L3 half-ULP ties. L4 binade boundary. L5 negative increment.

**Feedback.** Show local neighbors, half-ULP, and tie parity.

**Examples.**

1. FP32 `2^20 + 1/16` → no change; half ULP tie and base even.
2. FP32 `2^20 + 1/8` → changes to next float.
3. FP6 `5/4 + 1/8` → changes to `3/2`; midpoint tie rounds to the even upper significand.

**Validation.** Exact rational add then format round.

### Family `rounded_addition_result`

**Task.** Give stored result of one finite addition/subtraction.

**Derivation.** Exact rational operation then one nearest-even rounding.

**Constraints.** No NaN; overflow/zero sign only when explicit. Avoid double rounding.

**Difficulty.** L2 exact result. L3 inexact. L4 tie/cancellation. L5 normal-subnormal boundary.

**Feedback.** Show exact result and selected neighbors.

**Examples.**

1. FP4 `1 + 1/2` → `3/2`.
2. FP6 `1 + 1/8` → `1` (tie, even).
3. FP6 `7/4 + 1/2 = 9/4` exact, rounds to `2`.

**Validation.** Rational oracle and exhaustive toy operation table.

### Family `absorption_threshold`

**Task.** Find smallest positive increment from a supplied candidate set that changes a base value.

**Derivation.** Test each exact increment under nearest-even; threshold depends on half-spacing and parity.

**Constraints.** Candidates ordered; exactly one first-changing choice.

**Difficulty.** L3 even base. L4 odd significand tie. L5 power-of-two asymmetric neighbor spacing.

**Feedback.** Mark no-change/change candidates and explain tie.

**Examples.**

1. FP32 at `2^20`, candidates `1/32,1/16,1/8` → `1/8`.
2. FP6 at `1`, candidates `1/16,1/8,1/4` → `1/4`.
3. FP6 at `5/4`, candidates `1/16,1/8,1/4` → `1/8` because midpoint tie rounds upward to even significand.

**Validation.** Candidate enumeration and uniqueness.

### Family `non_associativity`

**Task.** Compare two explicitly parenthesized floating-point evaluation orders.

**Derivation.** Round after each operation in target format.

**Constraints.** Finite values, no compiler reassociation, expressions explicitly abstract format operations. Results must differ.

**Difficulty.** L4 toy. L5 FP16/32 landmarks.

**Feedback.** Show rounded intermediate for each parenthesization.

**Examples.**

1. FP6 `(8+1)+(-8)` versus `8+(1-8)` → `0` versus `1` under FP6 rounding.
2. FP32 `(16777216+1)-16777216` → `0`.
3. FP32 `16777216+(1-16777216)` → `1`.

**Validation.** Exhaustive toy search and rational step-rounding.

### Family `special_arithmetic_result`

**Task.** Classify a small explicitly modeled special-result operation.

**Derivation.** IEEE-style rules for selected operations.

**Scope.** finite overflow→infinity; finite nonzero/∞→signed zero; ∞-∞ and 0/0→NaN. No NaN payload/sign.

**Constraints.** Operation and signs explicit; no exception flags.

**Difficulty.** L3 infinity/zero. L4 invalid forms. L5 signed zero.

**Feedback.** State special rule, not ordinary algebra.

**Examples.**

1. FP16 max finite + max finite → `+∞`.
2. `+∞ + (-∞)` → `NaN`.
3. `-1 / +∞` → `-0`.

**Validation.** Whitelisted rule table plus classification.

## 8. Cross-family progression and adaptive guidance

Order:

1. fields and classification;
2. normal decode, then subnormal decode;
3. exact encode and bias;
4. extrema, ULP, and neighbors;
5. rational/integer exactness;
6. rounding to format and boundary rounding;
7. change/rounded addition/non-associativity;
8. selected special arithmetic.

Track mastery by family, format, class, sign, normal/subnormal region, direction, tie status/parity, representation, and misconception.

Failure routing:

| Error | Next practice |
|---|---|
| exponent-zero always zero | zero/subnormal classification pair |
| hidden one used for subnormal | matched normal/subnormal decode |
| exponent not debiased | bias-only family |
| FP32 integer threshold off by one | spacing around `2^24` |
| denominator-power-of-two always marked exact | precision/range counterexample |
| truncation instead of nearest | non-tie neighbor comparison |
| every tie rounded up | even/odd tie pair |
| half-ULP always changes | base parity diagnostic |
| ULP called epsilon | spacing at 1 versus chosen magnitude |
| host decimal answer used as exact oracle | fraction reconstruction |

Recommended adaptive mix: 45% weakest, 25% spaced mastery, 20% misconception contrasts, 10% stretch. Toy formats dominate initial reasoning; FP16/32 validate transfer without requiring long transcription.

## 9. Feedback, implementation, and validation

Feedback must show fields, exact rational/power-of-two form, and rounding neighbors where relevant. Never explain correctness by citing JavaScript output.

Implementation requirements:

- reduced BigInt rationals;
- integer field extraction/assembly;
- exact comparison of distances;
- explicit ties-to-even parity on retained significand;
- signed-zero representation separate from rational zero;
- symbolic infinities/NaN;
- deterministic seeded generation;
- binary/hex renderers derived from raw bits.

Automated validation:

- exhaust all FP4/FP6/FP8 patterns for classification/decode/order;
- exhaust toy-format finite encode round-trips;
- exhaust pairwise toy additions where practical;
- validate FP16/FP32 boundary constants independently;
- property-test decode→encode and field reassembly;
- verify neighbor ordering and ULP differences;
- verify exactness against successful exact encode;
- verify tie cases have equal rational distances and declared parity;
- ensure every choice has one correct answer;
- test at least 10,000 seeds per family/level;
- test parser forms, exact widths, prefixes, fractions, signed zero, and incompatible responses.

## 10. Coverage and quality checklist

- [ ] Every format is fully declared in the prompt or Learn context.
- [ ] Default rounding is nearest, ties to even.
- [ ] Host floating point is not the answer oracle.
- [ ] Zero/subnormal and infinity/NaN boundaries recur.
- [ ] Signed zero is preserved when relevant.
- [ ] NaN payload/signaling details remain excluded.
- [ ] Normal and subnormal formulas use the correct leading bit/exponent.
- [ ] Spacing is magnitude-dependent and distinguished from epsilon.
- [ ] Exactness checks include denominator, precision, and range.
- [ ] Tie examples exercise both parity outcomes.
- [ ] Arithmetic rounds once per explicitly shown operation.
- [ ] Non-associativity examples show intermediate rounding.
- [ ] Every family has three examples, constraints, derivation, feedback, and validation.
- [ ] Long FP32 bit transcription does not dominate practice.

## 11. Stable navigation

Retain the current categories:

- Classify Floats
- Decode Value
- Encode Value
- Exponent & Spacing
- Exactness
- Will It Change?

The stable family identifiers are the backticked names above. Existing category progress may remain visible, while new adaptive records use family, format, boundary/tie class, and misconception.
