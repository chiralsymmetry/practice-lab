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
| bfloat16 / BF16 | 16 | 8 | 7 | 127 | 8 |
| binary32 / FP32 | 32 | 8 | 23 | 127 | 24 |

FP4/6/8 are pedagogical IEEE-style formats. FP16, bfloat16, and FP32 follow their declared IEEE-style field layouts. The app does not claim that JavaScript evaluates arithmetic in these formats.

#### bfloat16 normative format declaration

bfloat16 is a fully supported target format, not an abbreviation for a binary32 value:

- bit 15 is the sign `s`;
- bits 14 through 7 are the 8-bit stored exponent `E`;
- bits 6 through 0 are the 7-bit fraction integer `F`;
- the exponent bias is `127`;
- normal precision is `p=8` significant binary digits: the implicit leading `1` plus 7 stored fraction bits;
- `E=0,F=0` encodes signed zero;
- `E=0,F≠0` encodes the subnormal value `(-1)^s F×2^-133`;
- `1≤E≤254` encodes the normal value `(-1)^s(128+F)×2^(E-134)`;
- `E=255,F=0` encodes signed infinity;
- `E=255,F≠0` encodes NaN.

Thus the normal unbiased-exponent range is `-126` through `127`, the smallest positive subnormal is `2^-133`, the smallest positive normal is `2^-126`, and the largest finite value is `255×2^120 = (2-2^-7)×2^127`, pattern `0x7F7F`. Within a normal binade `[2^e,2^(e+1))`, adjacent positive bfloat16 values are spaced by `2^(e-7)`; subnormal spacing is fixed at `2^-133`. Subnormals have no implicit leading `1`: their significand is exactly `F/128` at effective exponent `-126`, so precision tapers gradually toward zero. Positive infinity is `0x7F80`; negative infinity is `0xFF80`; positive and negative zero are `0x0000` and `0x8000`. The declared canonical NaN is `0x7FC0`; exercises do not interpret its payload, sign, or signaling status.

bfloat16 supports all nonzero `F=1..127` subnormals and gradual underflow; flush-to-zero behavior is not part of this specification. It uses round to nearest, ties to even exactly as specified below. It is incorrect to define conversion as unconditional deletion of the low 16 binary32 bits. A finite binary32 source is decoded exactly and rounded once to the bfloat16 lattice. Binary32 signed zeros and infinities retain their signs; any binary32 NaN maps to the declared canonical bfloat16 NaN. Exact rational sources have no NaN or infinity case.

### Normative model

For sign `s`, exponent field `E`, fraction integer `F`, fraction width `f`, bias `B`:

- `E=0,F=0`: signed zero `(-1)^s 0`.
- `E=0,F≠0`: subnormal `(-1)^s × (F/2^f) × 2^(1-B)`.
- `0<E<Emax`: normal `(-1)^s × (1+F/2^f) × 2^(E-B)`.
- `E=Emax,F=0`: signed infinity.
- `E=Emax,F≠0`: NaN.

Default rounding is **round to nearest, ties to even**. Unless a family explicitly teaches another mode, no other mode is used. Overflow under this mode produces signed infinity; underflow may produce a subnormal or signed zero. Exact operations are conceptually evaluated with unbounded rationals before one rounding to the target format.

NaN payload/sign and signaling-versus-quiet classification are excluded. Encoding “NaN” uses a declared canonical pattern per format. Comparisons and arithmetic involving NaN/infinity are excluded except explicit classification/special-result families.

For bfloat16, a midpoint is resolved by the low bit of the retained 8-bit significand integer for a normal result or the retained 7-bit fraction integer for a subnormal result. The even endpoint is selected. The positive zero/subnormal midpoint `2^-134` rounds to `+0`; positive magnitudes below it also round to `+0`, and those above it round to the smallest subnormal until the next midpoint. At the subnormal/normal midpoint `255×2^-134`, the largest subnormal has odd retained integer `127` and the smallest normal has even retained integer `128`, so the result is the smallest normal. At the upper boundary, `T=255×2^120+2^119` is the tie between largest finite and the next magnitude endpoint: positive finite inputs below `T` but above max finite round to max finite, while inputs at or above `T` round to `+∞`. The rules mirror by sign, including `-0` and `-∞`. These rules, rather than truncation, are normative.

### Scope

- field extraction and classification;
- exact finite decode/encode;
- exponent bias and hidden leading bit;
- smallest/largest finite values and normal/subnormal boundary;
- ULP spacing and adjacent representable values;
- exactness of integers and rational numbers;
- rounding to a format, including ties-to-even;
- exact conversion from binary32 bits or an exact rational to bfloat16;
- binary16-versus-bfloat16 comparisons of fields, range, precision, spacing, exactness, and rounded results;
- practical range-versus-precision choices stated as numerical requirements;
- whether an addition changes the stored value;
- selected special results such as finite overflow and signed zero.

### Exclusions

No decimal floating formats, extended precision, fused multiply-add, compiler excess precision, language-specific constant parsing, exception flags, traps, NaN payloads, signaling NaNs, total ordering, decimal-to-binary shortest printing algorithms, catastrophic-cancellation error analysis, iterative algorithms, numerical-method stability, or hardware throughput/latency/energy claims.

binary64/FP64 is deliberately postponed and no family may generate it. Within the present goals it repeats the same field, exactness, spacing, and rounding operations with wider transcription rather than adding a distinct skill. A future revision may add it only together with a learning objective that cannot be trained by the supported formats; a larger exponent range or the landmark `p=53` alone is not sufficient.

### Answer conventions

- Bit patterns require exactly the format width; spaces/underscores and optional `0b` are accepted.
- FP16/bfloat16/FP32 also accept exact-width hexadecimal with optional `0x`; FP16 and bfloat16 require exactly four hexadecimal digits and must always be format-labeled.
- Finite values accept reduced fractions, integers, mixed numbers, exact terminating decimals, or exact forms `a×2^k` with integer `a,k`.
- Approximate decimals are accepted only when the prompt requests rounding and states tolerance.
- `+0` and `-0` remain distinct when sign is requested.
- Classes are `zero`, `subnormal`, `normal`, `infinity`, `NaN`.
- Yes/no uses controls.
- Named fields are used for sign, stored exponent, unbiased exponent, significand, and value.

### Difficulty philosophy

Difficulty rises through removing field cues, crossing normal/subnormal boundaries, inverse encoding, tie cases, mixed bit/hex forms, and combining spacing with rounding. It must not rise through long binary transcription or requiring memorization of large decimal FP32 values.

### Generation and oracle

Every item stores format, raw bits, exact rational value where finite, class, fields, rounding mode, semantic family, misconception, and structural signature.

Use integer/BigInt rational arithmetic as the oracle. Host `Number`, typed arrays, `Math.fround`, `Float32Array`, or `DataView` may be supplementary diagnostics but never the canonical derivation or expected-answer source. Enumerate all FP4/6/8 patterns exhaustively. For FP16/bfloat16/FP32, use exact field formulas, integer bit operations, and boundary-focused generators.

Every generic family parameterized by `{format}` must support bfloat16 whenever its stated class/range constraints permit it. Dedicated bfloat16 and binary16/bfloat16 families supplement that transfer; they do not replace bfloat16 coverage in classification, field extraction, decode, exact encode, extrema, neighbors, spacing, rational/integer exactness, and rounding-boundary families.

For finite binary32-to-bfloat16 conversion, an allowed exact-integer implementation is to treat `raw` as an unsigned 32-bit integer, set `upper=floor(raw/2^16)` and `lower=raw mod 2^16`, then increment `upper` precisely when `lower>0x8000`, or when `lower=0x8000` and `upper` is odd. Handle NaN canonically before this rule. This implementation must be cross-checked against exact binary32 decode followed by rational rounding to bfloat16; it is not permission to use a host float.

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
4. bfloat16 `0x0080` (`0 00000001 0000000`) → `normal`, the smallest positive normal.

**Validation.** Field-mask oracle; exhaustive toy formats; bfloat16 boundary patterns `0x0000,0x0001,0x007F,0x0080,0x7F7F,0x7F80,0x7FC0` and their signed counterparts.

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
4. bfloat16 `0xBF20` → `s=1,E=01111110₂=126,F=0100000₂=32`.

**Validation.** Reassemble fields to identical raw pattern. Require the format label for every 16-bit pattern so FP16 and bfloat16 cannot be confused.

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
4. bfloat16 `0xFF80` → `-∞`.

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
4. bfloat16 `0x3FC0` → `3/2`.

**Validation.** Rational field formula and encode round-trip.

### Family `decode_subnormal`

**Task.** Decode a subnormal exactly.

**Derivation.** `(-1)^s F×2^(1-B-f)`.

**Constraints.** `F≠0`; include smallest/largest subnormal.

**Difficulty.** L1 one fraction bit; L2 several; L3 negative; L4 FP16/bfloat16/FP32 power notation.

**Feedback.** Explicitly omit hidden one.

**Examples.**

1. FP4 `0001` → `1/2`.
2. FP6 `000011` → `3/16`.
3. FP16 `0x0001` → `2^-24`.
4. bfloat16 `0x0003` → `3×2^-133`.

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
4. bfloat16 `0xC020` → exponent `1`, significand `5/4`, value `-5/2`.

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
4. bfloat16 `3/2` → `0x3FC0`.

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
4. bfloat16 canonical NaN → `0x7FC0`.

**Validation.** Classification round-trip.

### Family `round_to_format`

**Task.** Encode a nonrepresentable exact rational using nearest-even.

**Derivation.** Locate adjacent values, compare exact rational distances; ties choose even retained significand.

**Constraints.** Include below/above/tie outcomes; exclude overflow until separate family.

**Difficulty.** L2 toy non-tie; L3 tie; L4 normal/subnormal boundary; L5 FP16/bfloat16/FP32 sparse cases.

**Feedback.** Show neighbors, distances, tie parity.

**Examples.**

1. FP4 value `5/4`, neighbors `1` and `3/2` → `1` (`0010`), midpoint tie and lower significand even.
2. FP6 value `13/8`, neighbors `3/2` and `7/4` → `3/2`, midpoint tie with even retained significand.
3. FP8 value `1.1` exact decimal → nearest pattern determined by rational comparison, `0x39` (`1.125`).

**Validation.** Exhaustive nearest search for toy formats; integer rounding oracle for larger formats.

### Family `round_to_bfloat16`

**Task/templates.**

- `Round the exact value {value} to bfloat16 using round to nearest, ties to even. Give {requested_output}.`
- `Convert binary32 pattern {source_bits} to bfloat16 using round to nearest, ties to even. Give {requested_output}.`

**Skill.** Round an exact rational or an exactly decoded binary32 value to bfloat16, including midpoint parity, carry into the exponent, subnormal results, signed zero, and finite overflow.

**Derivation.** For a rational source, find the adjacent bfloat16 endpoints with integer/rational field formulas, compare exact distances by cross multiplication, and select the nearer endpoint or even endpoint at a tie. For binary32, first extract and classify the source fields and decode finite values exactly; then use the same rational procedure. The exact-integer `upper/lower` algorithm in Section 1 is permitted and must produce the same answer.

**Response.** `{requested_output}` is either a four-digit bfloat16 hexadecimal pattern, an exact value and class, or named fields. The prompt chooses exactly one. Hex responses accept the conventions in Section 1.

**Constraints and coverage.** Generate exact, below-midpoint, above-midpoint, tie-to-lower-even, and tie-to-upper-even cases. Regularly include carry into a new binade, normal/subnormal boundary, zero/subnormal midpoint, and max-finite/infinity midpoint. A binary32 source must be supplied as exact 32 bits or eight hex digits, never as a host-decimal rendering. NaN sources are limited to the canonical mapping rule and do not enter rational distance questions.

**Misconceptions/distractors.** Use unconditional truncation, ties always upward, binary16 field widths, keeping the low rather than high source bits, treating exponent-zero as an ordinary biased normal, or converting through a rounded decimal string. Do not use arbitrary nearby patterns.

**Difficulty.** L1 exact values and obvious non-ties; L2 ordinary normal rounding; L3 both midpoint parities; L4 exponent carry or subnormal boundary; L5 signed underflow/overflow and matched cases where truncation disagrees.

**Rejection rules.** Reject non-exact source descriptions, cases whose displayed precision does not distinguish the intended side of a midpoint, duplicate structural signatures, and cases dominated by long bit transcription. For binary32 inputs, reject instances where merely copying the upper half is the only repeatedly practiced outcome.

**Feedback.** Show the exact source value, its two bfloat16 neighbors, both exact distances, and retained parity at a tie. For a binary32 source, also show `upper`, `lower`, and why incrementing is or is not equivalent to the rational decision.

**Examples.**

1. `Round 257 to bfloat16.` → `0x4380`, value `256`; the neighbors are `256` and `258`, and the midpoint selects the even retained significand of `256`.
2. `Convert binary32 0x3F808000 to bfloat16.` → `0x3F80`, value `1`; the source is exactly `1+2^-8`, a tie between `1` and `1+2^-7`, and the lower retained significand is even.
3. `Convert binary32 0x3F818000 to bfloat16.` → `0x3F82`, value `1+2^-6`; the source is exactly halfway between `0x3F81` and `0x3F82`, and the upper retained significand is even.
4. `Round 1+5×2^-10 to bfloat16.` → `0x3F81`, value `1+2^-7`; the source is strictly closer to the upper neighbor than to `1`.

**Validation.** Independently compare the rational neighbor oracle with the integer `upper/lower` oracle for every generated finite binary32 source. Property-test exact bfloat16 values widened to binary32 and converted back. Validate declared zero, subnormal, normal, binade-carry, max-finite, infinity, and both tie-parity boundaries.

### Family `compare_binary16_bfloat16_rounding`

**Task/template.** `Round the exact source {source} independently to binary16 and bfloat16 using nearest-even. Give both results and state whether they are the same exact value.`

**Skill.** Recognize when binary16’s additional precision or bfloat16’s additional exponent range changes a conversion result.

**Derivation.** Decode `{source}` exactly when it is a binary32 pattern; otherwise reduce it as a rational. Run two independent exact neighbor-and-distance rounds, one using binary16 metadata and one using bfloat16 metadata. Compare the resulting classes and exact rational values, not their raw 16-bit patterns. Same raw bits across the two layouts do not imply the same value, and different raw bits may encode the same value.

**Response.** Two labeled four-digit hexadecimal patterns with class/exact value, followed by `same` or `different`. Labels are mandatory because both formats are 16 bits.

**Constraints and coverage.** Balance same-result and different-result cases. Different-result cases must include precision-only differences within both normal ranges, binary16 subnormal versus bfloat16 normal behavior, binary16 overflow versus finite bfloat16, and values nonzero in bfloat16 but zero in binary16. Same-result cases must include ordinary exact powers of two and at least some inexact sources that converge to the same exact endpoint. NaN comparison is excluded.

**Misconceptions/distractors.** Treating both 16-bit layouts as interchangeable; assuming binary16 is always better because `p=11`; assuming bfloat16 is always better because its range is wider; truncating bfloat16; or comparing bit strings instead of decoded values.

**Difficulty.** L2 exact shared values; L3 precision-driven difference near `1`; L4 subnormal-region contrast; L5 different result classes near either range boundary.

**Rejection rules.** Reject sources whose textual approximation hides the exact side of a boundary, cases that differ only by signed-zero presentation unless sign is the target, and runs dominated by trivial exact powers of two.

**Feedback.** Show each format’s applicable spacing/range, its two rounding endpoints, and the independent result. Name the cause as precision, range, subnormal spacing, or no difference.

**Examples.**

1. Exact `257` → binary16 `0x5C04`, value `257`; bfloat16 `0x4380`, value `256`; `different` because bfloat16 spacing is `2` there.
2. Binary32 `0x3F808000`, exactly `1+2^-8` → binary16 `0x3C04`, exact source value; bfloat16 `0x3F80`, value `1`; `different` because the source is a bfloat16 midpoint whose lower endpoint is even.
3. Exact `65520` → binary16 `0x7C00`, `+∞`; bfloat16 `0x4780`, value `65536`; `different` because binary16 overflows while bfloat16 remains finite.
4. Exact `1+2^-12` → binary16 `0x3C00`, value `1`; bfloat16 `0x3F80`, value `1`; `same` even though the layouts produce different raw patterns.

**Validation.** Use separate format metadata and rational rounding calls; decode both returned patterns and compare class/value. Assert that every `different` item has its declared causal signature and every `same` item agrees as an exact value rather than merely as formatted decimal text.

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
4. bfloat16 exact `2^-134` → `+0`; bfloat16 exact `255×2^120+2^119` → `+∞`.

**Validation.** Enumerated adjacent extended endpoints and independent known IEEE boundary tests.

## 5. Category: Exponents, Range, and Spacing

### Family `remove_exponent_bias`

**Task.** Convert stored normal exponent to unbiased exponent or reverse.

**Derivation.** `e=E-B`; reverse `E=e+B`.

**Constraints.** Normal exponent fields only; subnormal effective exponent belongs elsewhere.

**Difficulty.** L1 direct; L2 inverse; L3 binary field; L4 bfloat16/FP32 shared-bias contrast.

**Feedback.** Distinguish stored field from actual power.

**Examples.**

1. FP6 `E=100₂=4`, bias3 → `e=1`.
2. FP8 desired `e=-3`, bias7 → stored `E=4=0100`.
3. FP32 `E=130` → `e=3`.
4. bfloat16 `E=01111110₂=126` → `e=-1`.

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
4. bfloat16 near `1` → spacing `2^-7`; near `2^20` → spacing `2^13`.

**Validation.** Difference of adjacent enumerated/constructed patterns.

### Family `compare_binary16_bfloat16_spacing`

**Task/template.** `At the exactly representable value {value}, what is the upward spacing to the next value in binary16 and in bfloat16? Which is finer, or are they equal?`

**Skill.** Compare absolute precision at the same value or magnitude without assuming that one 16-bit format is uniformly finer.

**Derivation.** Confirm `{value}` is finite and exactly representable in both formats. Construct each successor from exact fields and subtract `{value}` as a rational. In a normal binade the upward spacing is `2^(e-(p-1))`; in a subnormal region it is the format’s constant subnormal step. At powers of two, “upward” is mandatory because predecessor and successor gaps may differ.

**Response.** Two labeled exact spacings and one of `binary16`, `bfloat16`, or `equal`.

**Constraints and coverage.** Use values shared by both formats, including ordinary shared-normal magnitudes, the region where binary16 is subnormal but bfloat16 is normal, equality cases, and transition values. Exclude zero, infinities, NaNs, and a format’s largest finite value. Prefer powers of two and sparse-significand values so the comparison, not transcription, is central.

**Misconceptions/distractors.** “Same 16-bit width means same spacing”; “binary16 always has finer spacing because `p=11`”; using bfloat16’s exponent width as precision; using predecessor spacing at a power of two; or applying the normal formula to a binary16 subnormal.

**Difficulty.** L2 both values normal; L3 different normal binades; L4 binary16 subnormal/bfloat16 normal; L5 equality and boundary transitions.

**Rejection rules.** Reject values not exactly common to both formats, ambiguous prompts saying only “ULP at a power of two,” and cases requiring unwieldy decimal expansions.

**Feedback.** Show the class and local spacing formula for each format. Explicitly note that binary16’s larger `p` gives finer relative spacing when both are normal, but bfloat16 can have finer absolute spacing where binary16 has already become subnormal.

**Examples.**

1. At `1` → binary16 upward spacing `2^-10`; bfloat16 `2^-7`; `binary16` is finer.
2. At `2^-20` → binary16 subnormal spacing `2^-24`; bfloat16 normal spacing `2^-27`; `bfloat16` is finer.
3. At `2^-17` → binary16 subnormal spacing `2^-24`; bfloat16 normal spacing `2^-24`; `equal`.

**Validation.** Encode `{value}` exactly in both formats, construct both successors, decode them rationally, and verify positive differences and the declared ordering.

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
4. bfloat16 predecessor/successor of `1` → `1-2^-8` and `1+2^-7`.

**Validation.** Exhaustive ordered list toy; bit-neighbor/rational proof larger.

### Family `format_extrema`

**Task.** Find smallest subnormal, smallest normal, largest finite, or exponent range.

**Derivation.** Apply boundary fields.

**Constraints.** Requested endpoint explicit; exact power/fraction answer preferred.

**Difficulty.** L1 toy; L2 compare endpoints; L3 FP16/bfloat16; L4 FP32 or cross-format boundaries.

**Feedback.** Show boundary pattern and decode.

**Examples.**

1. FP6 smallest positive subnormal → `1/16`.
2. FP6 smallest positive normal → `1/4`.
3. binary16 largest finite → `65504` (`0x7BFF`).
4. bfloat16 endpoints → smallest subnormal `2^-133` (`0x0001`), smallest normal `2^-126` (`0x0080`), largest finite `255×2^120` (`0x7F7F`).

**Validation.** Boundary patterns and ordering.

### Family `compare_binary16_bfloat16_capability`

**Task/templates.**

- `Which format has the larger {range_endpoint}: binary16 or bfloat16? Justify using its fields.`
- `Which format has greater normal significand precision: binary16 or bfloat16?`
- `At magnitude {magnitude}, which format can represent a finite nonzero value?`
- `At the exactly representable value {magnitude}, which format has finer upward spacing?`

**Skill.** Separate exponent range from significand precision and use the appropriate property for a stated comparison.

**Derivation.** Range decisions use exact extrema: binary16 has exponent width `5`, bias `15`, normal exponents `-14..15`, and smallest subnormal `2^-24`; bfloat16 has exponent width `8`, bias `127`, normal exponents `-126..127`, and smallest subnormal `2^-133`. Normal relative-precision decisions use `p=11` for binary16 and `p=8` for bfloat16. Magnitude-specific precision uses exact local successor spacing, including subnormal rules.

**Response.** Direct range/precision/spacing comparisons use `binary16`, `bfloat16`, or `equal`. The finite-nonzero support variant uses `binary16`, `bfloat16`, `both`, or `neither`. Feedback follows with the exact field/property comparison.

**Placeholders.** `{range_endpoint}` is one of `maximum finite magnitude`, `minimum positive subnormal magnitude`, `minimum positive normal magnitude`, or `normal unbiased-exponent range`. `{magnitude}` is an exact integer, rational, or power-of-two form; a spacing prompt requires it to be finite and exactly representable in both formats.

**Constraints and coverage.** Vary maximum finite magnitude, minimum positive magnitude, normal exponent range, normal precision, consecutive-integer threshold, and magnitude-specific spacing. Direct fact prompts must be interleaved with applied magnitudes; do not build a family consisting only of the two static answers “bfloat16 range” and “binary16 precision.”

**Misconceptions/distractors.** Conflating total width with precision; counting the sign bit in `p`; treating fraction width as exponent range; assuming wider range also means finer spacing; or ignoring subnormal behavior.

**Difficulty.** L1 labeled field counts; L2 direct range versus normal precision; L3 exact boundary comparison; L4 magnitude-specific class/spacing; L5 a counterexample to an overgeneralization such as binary16 always being locally finer.

**Rejection rules.** Reject vague uses of “more accurate,” unlabeled 16-bit patterns, hardware-performance interpretations, and questions where “range” could mean only positive normal range or all finite nonzero magnitudes without saying which.

**Feedback.** Name the controlling field, give exact widths/endpoints or spacing, and distinguish global format capability from local behavior at the supplied magnitude.

**Examples.**

1. `Which has the larger maximum finite magnitude?` → `bfloat16`: `255×2^120` versus binary16 `65504`.
2. `Which has greater normal significand precision?` → `binary16`: `p=11` versus bfloat16 `p=8`.
3. `At 2^-20, which has finer upward spacing?` → `bfloat16`: `2^-27` versus binary16 subnormal spacing `2^-24`.

**Validation.** Derive every comparison from the format table and exact boundary/spacing formulas; independently verify magnitude-specific claims by constructing adjacent patterns.

### Family `choose_binary16_or_bfloat16`

**Task/template.** `A numeric representation must satisfy {exact_requirements}. Which of binary16 and bfloat16 satisfies them: binary16, bfloat16, both, or neither? Ignore hardware performance.`

**Skill.** Translate a practical precision-versus-range requirement into exact range, spacing, or representability tests.

**Derivation.** Express every requirement as exact rational predicates: required extrema must lie within finite range; required nonzero magnitudes must not round to zero; required values or increments must lie on the format lattice; and “distinguish” means the named values round to distinct results. Test each format independently, then map the two booleans to `binary16`, `bfloat16`, `both`, or `neither`.

**Response.** Single choice from `binary16`, `bfloat16`, `both`, and `neither`; the worked solution supplies the exact predicate table.

**Constraints and coverage.** Requirements use exact powers of two, integers, or rationals and include all four answers. Contexts may mention measurements, model parameters, counters, or scaled data, but the deciding facts must be fully numerical. Do not assert speed, accelerator support, memory bandwidth, energy use, library availability, or suitability for a named workload.

**Misconceptions/distractors.** Choosing bfloat16 whenever values are “large”; choosing binary16 whenever precision is mentioned; assuming both because both occupy 16 bits; checking range but not resolution; or checking one representative value instead of all stated requirements.

**Difficulty.** L2 one range or precision condition; L3 a lattice/exact-integer condition; L4 combined range and resolution; L5 requirements for which each format satisfies a different condition and therefore neither satisfies all.

**Rejection rules.** Reject qualitative requirements such as “high accuracy,” scenarios dependent on empirical data distributions, hardware claims, and instances with a hidden unit conversion. Every answer must follow solely from declared format semantics.

**Feedback.** Give a two-row requirement table, marking each exact predicate pass/fail for binary16 and bfloat16. State the tradeoff without generalizing beyond the numbers in the prompt.

**Examples.**

1. `Every counter value from 0 through 1000 must be exact.` → `binary16`; its consecutive-integer guarantee reaches `2048`, while bfloat16’s reaches only `256`.
2. `Finite values as large as 2^100 are required; no finer resolution requirement is imposed.` → `bfloat16`; binary16 overflows at that magnitude.
3. `The same format must represent 2^100 finitely and distinguish 1 from 1+2^-9.` → `neither`; only bfloat16 has the range, but only binary16 distinguishes the two values under nearest-even.
4. `The format must represent 2^10 finitely and distinguish 1 from 1+2^-7.` → `both`.

**Validation.** Evaluate each stated predicate with exact encoders/rounders for both formats and verify the four-way answer. Require coverage of each answer and each causal failure signature.

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
4. bfloat16 `257` → no; its neighbors are `256` and `258`.

**Validation.** Reduced rational against exact format lattice.

### Family `integer_exactness`

**Task.** Decide whether an integer is exactly representable.

**Derivation.** Check range and divisibility by spacing in its binade.

**Constraints.** Cases around `2^p`, odd/even gaps, max finite.

**Difficulty.** L2 toy threshold; L3 one above threshold; L4 FP16/bfloat16/FP32 landmarks.

**Feedback.** State local spacing and divisibility.

**Examples.**

1. FP6 (`p=3`) integer `8` → yes.
2. FP6 integer `9` → no; spacing there is 2.
3. FP32 `16777217` → no; neighbors `16777216,16777218`.
4. bfloat16 integer `256` → yes, but `257` → no.

**Validation.** Exact encoding attempt.

### Family `largest_consecutive_integer`

**Task/template.** `For {format}, what is the largest integer N such that every integer from 0 through N is exactly representable?`

**Skill.** Connect significand precision `p` to the consecutive-integer boundary and distinguish that boundary from the largest finite or largest exactly representable integer.

**Derivation.** The answer is `N=2^p`: all integers through `2^p` fit in `p` significant bits after removing trailing zeroes. In the next binade the spacing is `2`, so `2^p+1` is the first missing positive integer. Negative integers are symmetric but are not needed to define `N`.

**Response.** An exact nonnegative integer. A comparison variant asks for labeled thresholds for two formats.

**Constraints and coverage.** Support every declared format whose exponent range includes `2^p`, including bfloat16. Vary whether `p` is given or must be recovered from the field declaration. Comparison variants should regularly pair binary16 and bfloat16.

**Misconceptions/distractors.** `2^f` from forgetting the hidden bit; `2^p-1` from confusing an integer-count boundary with an all-ones significand; the largest finite value; and the false claim that no larger integers are exact.

**Difficulty.** L1 `p` supplied; L2 derive `p=f+1`; L3 explain why the endpoint is included; L4 compare formats and test integers immediately around both thresholds.

**Rejection rules.** Reject wording such as “largest exactly representable integer,” because arbitrarily larger sparse integers may still be exact up to the finite range. Require “every integer from 0 through N.”

**Feedback.** State `p`, show `2^p`, then show that local spacing changes from `1` to `2` and that `2^p+1` is not representable.

**Examples.**

1. FP6 (`p=3`) → `N=8`; `9` is the first missing positive integer.
2. bfloat16 (`p=8`) → `N=256`; `257` rounds to `256` under nearest-even.
3. binary16 (`p=11`) → `N=2048`, compared with bfloat16’s `256`.

**Validation.** Exact-encode every integer in a boundary window through `2^p`; verify `2^p-1` and `2^p` are exact, `2^p+1` is not, and the stated format has sufficient exponent range.

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

**Difficulty.** L4 toy. L5 FP16/bfloat16/FP32 landmarks.

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
4. extrema, ULP, neighbors, and the consecutive-integer boundary;
5. rational/integer exactness;
6. bfloat16 exact-rational and binary32 conversion;
7. binary16/bfloat16 spacing, range, precision, and rounded-result contrasts;
8. practical exact-requirement choices;
9. change/rounded addition/non-associativity;
10. selected special arithmetic.

Introduce each field/decode/encode operation in a toy format, then transfer it to bfloat16 before using cross-format questions. Teach independent bfloat16 rounding before asking for binary16/bfloat16 result comparisons. Teach extrema and spacing in each format before practical choice questions.

Track mastery by family, format, format pair, class, sign, normal/subnormal region, direction, tie status/parity, same/different comparison outcome, comparison cause, representation, and misconception.

Failure routing:

| Error | Next practice |
|---|---|
| exponent-zero always zero | zero/subnormal classification pair |
| hidden one used for subnormal | matched normal/subnormal decode |
| exponent not debiased | bias-only family |
| FP32 integer threshold off by one | spacing around `2^24` |
| bfloat16 threshold reported as `128` or `255` | consecutive-integer boundary around `256` |
| denominator-power-of-two always marked exact | precision/range counterexample |
| truncation instead of nearest | non-tie neighbor comparison |
| binary32 low 16 bits always discarded | matched bfloat16 truncate-versus-round pair |
| every tie rounded up | even/odd tie pair |
| half-ULP always changes | base parity diagnostic |
| ULP called epsilon | spacing at 1 versus chosen magnitude |
| binary16 and bfloat16 raw patterns treated alike | labeled decode comparison |
| binary16 assumed locally finer at every magnitude | shared value in the binary16-subnormal region |
| wider range treated as greater precision | direct field contrast, then exact practical requirement |
| host decimal answer used as exact oracle | fraction reconstruction |

Recommended adaptive mix: 45% weakest, 25% spaced mastery, 20% misconception contrasts, 10% stretch. Toy formats dominate initial reasoning; FP16, bfloat16, and FP32 validate transfer without requiring long transcription. Within bfloat16 practice, ensure classification/fields, decode/encode, spacing/extrema, exactness, rational rounding, binary32 conversion, and binary16 comparison all recur rather than allowing conversion questions to dominate.

## 9. Feedback, implementation, and validation

Feedback must show fields, exact rational/power-of-two form, and rounding neighbors where relevant. Never explain correctness by citing JavaScript output.

Implementation requirements:

- reduced BigInt rationals;
- normalized rational signs and positive denominators;
- integer field extraction/assembly;
- exact comparison of distances;
- explicit ties-to-even parity on retained significand;
- signed-zero representation separate from rational zero;
- symbolic infinities/NaN;
- a bfloat16 metadata record with `width=16,e=8,f=7,B=127,p=8,Emax=255` and canonical NaN `0x7FC0`;
- independent binary16 and bfloat16 metadata even though both widths are 16;
- exact unsigned-integer binary32-to-bfloat16 conversion cross-checked against rational rounding;
- deterministic seeded generation;
- binary/hex renderers derived from raw bits.

Automated validation:

- exhaust all FP4/FP6/FP8 patterns for classification/decode/order;
- exhaust all 65,536 bfloat16 patterns for fields, classification, finite decode, and encode round-trip; omit NaNs only from numeric ordering;
- exhaust toy-format finite encode round-trips;
- exhaust pairwise toy additions where practical;
- validate FP16/bfloat16/FP32 boundary constants independently;
- property-test decode→encode and field reassembly;
- verify neighbor ordering and ULP differences;
- verify exactness against successful exact encode;
- verify tie cases have equal rational distances and declared parity;
- for representative binary32 `upper` values covering both signs, exponent boundaries, both parities, and carry cases, exhaust all 65,536 `lower` values and compare integer conversion with rational bfloat16 rounding;
- verify binary16/bfloat16 comparison answers by independently decoding both results and comparing exact classes/values;
- verify consecutive-integer boundaries at `2^p-1`, `2^p`, `2^p+1`, and the following even integer;
- verify practical-choice predicates independently for both formats and cover `binary16`, `bfloat16`, `both`, and `neither`;
- ensure every choice has one correct answer;
- test at least 10,000 seeds per family/level;
- test parser forms, exact widths, prefixes, fractions, signed zero, and incompatible responses.

## 10. Coverage and quality checklist

- [ ] Every format is fully declared in the prompt or Learn context.
- [ ] bfloat16 uses `1/8/7` fields, bias `127`, precision `8`, gradual subnormals, IEEE-style special fields, and nearest-even rounding.
- [ ] Default rounding is nearest, ties to even.
- [ ] Host floating point is not the answer oracle.
- [ ] Binary32-to-bfloat16 answers come from exact integer/rational logic, never `Number` or typed arrays.
- [ ] Zero/subnormal and infinity/NaN boundaries recur.
- [ ] Signed zero is preserved when relevant.
- [ ] NaN payload/signaling details remain excluded.
- [ ] Normal and subnormal formulas use the correct leading bit/exponent.
- [ ] Spacing is magnitude-dependent and distinguished from epsilon.
- [ ] binary16/bfloat16 comparisons label both formats and compare decoded exact values, not raw 16-bit patterns.
- [ ] Comparisons include shared-normal, binary16-subnormal, range-only, precision-only, same-result, and different-result cases.
- [ ] Exactness checks include denominator, precision, and range.
- [ ] Consecutive-integer questions say “every integer from 0 through N,” with bfloat16 `N=256`.
- [ ] Tie examples exercise both parity outcomes.
- [ ] Arithmetic rounds once per explicitly shown operation.
- [ ] Non-associativity examples show intermediate rounding.
- [ ] Practical choices use exact numerical requirements and make no hardware-performance claims.
- [ ] No item generates binary64/FP64 without a future distinct-skill specification revision.
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

The stable family identifiers are the backticked names above, including `round_to_bfloat16`, `compare_binary16_bfloat16_rounding`, `compare_binary16_bfloat16_spacing`, `compare_binary16_bfloat16_capability`, `choose_binary16_or_bfloat16`, and `largest_consecutive_integer`. Existing category progress may remain visible, while new adaptive records use family, format or format pair, boundary/tie class, comparison cause, and misconception.
