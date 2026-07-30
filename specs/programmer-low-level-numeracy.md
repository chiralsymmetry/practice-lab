# Programmer Low-Level Numeracy — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Programmer Low-Level Numeracy

### Topic goal

Develop fast, accurate mental manipulation of fixed-width integers, bit patterns, and abstract byte addresses: move between representations, reason about wraparound and status conditions, apply bit operations, construct and use masks and fields, calculate address/layout relationships, and reconstruct values from byte-addressed memory.

The goal is trainable performance. A practiced learner should be able to solve small and medium instances without writing code, while retaining precise width, signedness, address-unit, boundary, layout, and byte-order semantics.

### Scope

The topic includes:

- powers of two as bit-position and width landmarks;
- binary, hexadecimal, unsigned decimal, and optional octal conversion;
- unsigned and two's-complement interpretations of a fixed-width pattern;
- ranges, representability, and minimum widths;
- zero extension, sign extension, and truncation;
- fixed-width unsigned and signed addition and subtraction;
- carry-out, borrow, and signed overflow, including their independence;
- width-bounded `AND`, `OR`, `XOR`, and `NOT`;
- logical shifts, arithmetic right shift, carry-out, and rotations;
- construction and application of single-bit, set-of-bits, and contiguous masks;
- `test-single`, `test-any`, `test-all`, and masked equality;
- contiguous bit-field extraction, insertion, and fit checks;
- decimal and hexadecimal programmer landmarks;
- abstract byte-address arithmetic, distances, power-of-two alignment, and padding;
- offsets and containing boundaries for explicitly sized words, cache lines, and pages;
- boundary-crossing tests for explicitly sized byte ranges;
- array-element and record-field offsets from completely supplied layouts;
- population count and recognition of one-hot, contiguous, sparse, and complementary mask shapes;
- power-of-two remainder shortcuts;
- big- and little-endian byte storage, loads, subvalue loads, and signed interpretation.

Expected prior knowledge:

- ordinary integer addition and subtraction;
- multiplication of small non-negative integers;
- non-negative exponents;
- place value;
- the quotient/remainder idea for non-negative integers;
- the idea that a bit is `0` or `1`.

The default width set is `4, 8, 12, 16, 24, 32, 48, 64` bits. Individual families narrow this set. One- and two-bit instances may be used only as diagnostic or introductory scaffolding, never as the dominant practice.

### Exclusions

Do not include:

- floating-point representation or floating-point underflow;
- general multiplication, division, or modular-arithmetic proofs; small products formed from supplied array/layout sizes and division/remainder by explicit powers of two are included only as bounded programmer numeracy;
- arbitrary-precision complement with infinitely many leading sign bits;
- C, C++, Java, JavaScript, or ISA-specific shift and overflow behavior;
- C or C++ undefined behavior, pointer provenance, object-lifetime, or pointer-comparison rules;
- shifts by a negative count or by a count greater than or equal to the width;
- saturating arithmetic;
- bit order within a byte, bit-endian protocols, network bit numbering, or mixed-endian formats;
- unaligned-access legality, alignment faults, aliasing, or language-level undefined behavior;
- inferred or ABI-dependent record/structure layout, including unstated padding;
- virtual-to-physical address translation, page tables, TLBs, allocation validity, or protection;
- cache-performance, locality, coherence, or replacement claims;
- architecture-specific word, cache-line, or page sizes, address widths, canonical-address rules, or other unstated machine rules;
- text encoding, checksums, cryptography, or instruction encoding;
- non-contiguous fields in the bit-field subcategory;
- octal arithmetic. Octal is an optional representation drill only.

Language-specific questions belong in a language or architecture topic. This topic uses an abstract, explicitly defined fixed-width machine model.

### Normative machine model and notation

- Width `n` is always stated. Values are reduced modulo `2^n` only when a family explicitly calls for a wrapped result.
- Bit positions are zero-indexed. Bit `0` is the rightmost, least-significant bit.
- A range `hi..lo` is inclusive at both ends and requires `n > hi >= lo >= 0`. Its width is `hi - lo + 1`.
- `x & y`, `x | y`, `x ^ y`, and `~x` mean width-bounded bitwise AND, OR, XOR, and NOT.
- `x << k` means logical left shift in width `n`, discarding high bits and filling low bits with zero.
- `x >>> k` means logical right shift, discarding low bits and filling high bits with zero.
- `x ASR k` means arithmetic right shift, discarding low bits and copying the original sign bit into vacated high positions. `ASR` is used instead of the language-dependent symbol `>>`.
- `ROL(x, k)` and `ROR(x, k)` rotate within width `n`. Rotation counts are interpreted modulo `n` only in families that explicitly teach equivalence; direct-computation families normally use `1..n-1`.
- For a multi-bit shift, carry-out is the **last** bit shifted out. A left shift by `k` has carry `(x >> (n-k)) & 1`; either right shift has carry `(x >> (k-1)) & 1`.
- Unsigned addition has carry-out when the exact sum is at least `2^n`.
- Unsigned subtraction has borrow when the left operand is smaller than the right operand.
- Signed addition or subtraction has **signed overflow** when its mathematical result is outside `[-2^(n-1), 2^(n-1)-1]`. Its direction is `above` or `below`; there is no separate processor concept named signed underflow in this specification.
- An address is a non-negative integer naming an abstract byte position. It is not a language pointer. Address arithmetic is exact mathematical integer arithmetic; generated results never become negative and never wrap unless a question explicitly concerns a fixed-width integer instead.
- Alignment `A` is always an explicitly supplied positive power of two. Address `x` is aligned to `A` exactly when `x mod A = 0`.
- A byte range is written `[start, start + length)`: it includes `length > 0` bytes at addresses `start` through `start + length - 1`. Boundary-crossing questions use this half-open convention.
- A word, cache line, or page is only an abstract fixed-size address unit. Its positive power-of-two size in bytes is stated in every question; the role name supplies no additional behavior.
- Array and record layouts are complete question data. Record fields and explicit padding entries occupy the stated byte counts in the stated order; no hidden padding or ABI rule may be inferred.
- Memory diagrams list increasing addresses from left to right unless arrows and addresses explicitly show otherwise.
- Endianness changes byte order, never bit order within a byte.

### Global answer conventions

Surrounding whitespace is ignored. Decimal answers accept an optional leading `+` and ordinary leading zeroes. Negative zero normalizes to zero.

Binary input:

- accepts an optional `0b` prefix;
- ignores spaces and underscores between digits;
- is case-insensitive with respect to the prefix;
- must otherwise contain only `0` and `1`;
- must contain exactly the declared number of bits when the answer is a **pattern**;
- may omit leading zeroes only when the answer is explicitly an abstract numeric value.

Hexadecimal input:

- accepts an optional `0x` prefix;
- ignores spaces and underscores between digits;
- accepts either letter case;
- must contain exactly `ceil(n/4)` digits when the answer is a fixed-width pattern;
- may omit leading zeroes when the answer is explicitly a numeric value or the prompt says so.

Address and byte-count answers are numeric values, not fixed-width patterns. The prompt states whether to answer in decimal or hexadecimal; hexadecimal numeric answers accept the global hexadecimal forms without requiring leading zeroes. A signed address displacement may use a leading `-`, but an address itself may not be negative.

Octal input follows the same rules with optional `0o`. Fixed-width octal answers use exactly `ceil(n/3)` digits, with unused high displayed bits required to be zero.

Boolean answers use displayed controls where possible. Text fallback accepts `yes/no`, `true/false`, and `1/0`. Status answers use named fields, for example `wrapped = 0110, carry = yes`, rather than an overloaded trailing `+`, `-`, or `0`.

Lists of bit positions are comma- or space-separated, order-insensitive, and duplicate-insensitive after validation. An empty set is entered as `none`; blank input is not treated as an answer.

Byte sequences are written in increasing-address order. Each byte is exactly two hexadecimal digits; spaces, commas, or hyphens may separate bytes.

Units such as `bits`, `bytes`, or `decimal` are not accepted inside numeric answer fields unless a family explicitly provides a short-text response.

### Global generation rules

Every generated question must carry machine-readable metadata:

`categoryId`, `subcategoryId`, `familyId`, `level`, `width`, `representation`, `difficultyDimensions`, `misconceptionsTargeted`, `parameters`, `canonicalAnswer`, and `structuralSignature`.

`width` is the declared bit-pattern width when one exists and `null` for unbounded abstract-address numeric questions. Address families record `addressRepresentation`, `answerRepresentation`, and every applicable size, unit, and range convention in `parameters`; they must not invent an address width merely to fill metadata.

Generators must:

1. generate semantic parameters first and render from them;
2. derive the answer with integer/bit operations independent of display strings;
3. apply family constraints and rejection rules before presenting the item;
4. prevent unresolved placeholders and ambiguous wording;
5. avoid an exact structural signature among the last 20 questions and an exact rendered duplicate among the last 100;
6. use constructed cases where random sampling would underrepresent boundaries or misconceptions;
7. keep operand arithmetic subordinate to the target skill;
8. record the actual difficulty dimensions, not only a scalar level.

Random operands must not create an accidental curriculum. Uniform bit patterns overrepresent medium-popcount values and underrepresent boundaries, so each family specifies balanced case classes.

### Difficulty philosophy

Difficulty should rise through:

- weaker or transformed cues;
- inversion of a learned relationship;
- mixed representations;
- boundary proximity;
- more active bits or groups when that changes the mental strategy;
- interaction between two independently mastered rules;
- distinguishing plausible competing mental models;
- preserving unrelated bits while changing a selected field.

Difficulty must not rise merely through longer prose, gratuitously large decimal arithmetic, hidden conventions, visually dense formatting, or time pressure. Wider values are appropriate only after chunking or decomposition makes them a meaningful extension of the same skill.

### Common feedback and distractor policy

Correct feedback is one concise confirmation plus the defining relationship. Incorrect feedback first diagnoses a recognizable error, then shows the intended method. Do not merely reveal the answer.

When choices are used, distractors must be computed from named misconceptions. Remove duplicate distractors, the correct answer, and choices made invalid by the prompt. If fewer than three plausible distinct distractors remain, generate a different instance or use direct input.

Worked solutions should show aligned groups, boundary formulas, or the selected mask. They must not rely on implementation-language evaluation.

## 2. Category: Representation

### Category purpose

Train the learner to distinguish a bit pattern from its interpretation and to move fluently among widths and power-of-two representations without losing leading zeroes or signedness.

### Learn

In binary, `2^k` is a `1` followed by `k` zeroes, and bit position `k` contributes `2^k`. Four binary bits form one hexadecimal digit; three form one octal digit. A fixed-width pattern may be read as unsigned or as two's complement. Unsigned uses weights `2^i`; two's complement gives the top bit weight `-2^(n-1)`.

For `n` bits, unsigned range is `0..2^n-1` and signed range is `-2^(n-1)..2^(n-1)-1`. Zero extension preserves an unsigned value, sign extension preserves a two's-complement signed value, and truncation preserves the value modulo the destination width.

Examples:

```text
bit 5 contributes 2^5 = 32
8-bit 1111 1101 = unsigned 253 = signed -3
sign-extend 4-bit 1001 to 8 bits: 1111 1001
```

Fixed-width pattern answers retain leading zeroes.

### Prerequisites

Ordinary place value and small powers of two.

### Category boundaries

This category does not perform arithmetic on two fixed-width operands. Addition used to decode a pattern is place-value accumulation, not the Fixed-Width Arithmetic category. Grouping into bytes for memory order belongs to Memory Representation.

### Subcategories in order

1. Bit Positions and Powers of Two
2. Base Conversion and Grouping
3. Signed and Unsigned Views
4. Widths, Ranges, and Representability
5. Extension and Truncation

## 2.1 Subcategory: Bit Positions and Powers of Two

### Skill and mental operation

Recall common powers of two and use them as landmarks for bit contribution, magnitude, and width. The learner should retrieve small values directly and bracket larger values rather than repeatedly multiplying by two.

### Common misconceptions

- Reading bit position `k` as value `k` instead of `2^k`.
- Saying that `2^k` has `k` binary digits; it has `k+1`.
- Confusing the exponent with a one-indexed bit position.
- Choosing the numerically nearest exponent rather than the nearest power value.
- Using `floor(log2 x)+1` for `x = 0`; unsigned zero still needs one representational bit in this app.

### Generation scope and dimensions

Exponents are `0..63`; direct decimal recall should concentrate on `0..20` and common storage landmarks `24, 32, 48, 63`. Difficulty dimensions are recall versus derivation, forward versus inverse relationship, exact versus nearby value, boundary proximity, and whether the task asks for a value, exponent, or width.

### Family `power_relation`

**Learner task.** Complete an exact relationship among exponent, power-of-two value, bit position, and binary shape.

**Relationship to skill.** Repetition creates the landmark table used by every later category.

**Response mode.** Integer input.

**Preferred templates.**

- `What decimal value does bit {position} contribute?`
- `2^n = {value}. What is n?`
- `Compute 2^{exponent} in decimal.`
- `An exact power of two has decimal value {value}. Which bit position is set?`

**Placeholders.** `{position}` and `{exponent}` are the same integer `k` in `0..63`. `{value} = 2^k`, displayed in decimal. Direct decimal-answer instances use `k <= 20` at Levels 1–2, `k <= 32` at Level 3, and larger exponents only when the response is `k` rather than a long decimal.

**Answer derivation.** Compute `1 << k` using an integer type capable of at least 64 unsigned bits. The exponent and only set-bit position are both `k`.

**Accepted answers.** One decimal integer under global conventions.

**Constraints and rejection.** Do not ask the exponent when it is already printed unreplaced. Do not use `2^0` more than 5% of this family. Do not let exponents above 20 turn into decimal transcription drills.

**Controlled variations and difficulty.**

- Level 1: bit positions `0..8`, forward value recall, explicit `bit 0 is rightmost` cue.
- Level 2: inverse value-to-exponent and exponents through 16.
- Level 3: switch among bit position, exponent, and binary shape; include storage landmarks.
- Level 4: mixed prompt such as `0x00010000 has which single set-bit position?`

**Feedback.** Correct: `Bit {k} has weight 2^{k} = {value}.` Incorrect: if the answer equals `k`, identify position/value confusion; if off by one, show `bit 0 = 1, so bit k = 2^k`.

**Examples.**

1. Question: `What decimal value does bit 5 contribute?` Answer: `32`. Derivation: `2^5 = 32`. Level 1; targets position-as-value.
2. Question: `An exact power of two has value 4096. Which bit position is set?` Answer: `12`. Derivation: `4096 = 2^12`. Level 2.
3. Question: `The 16-bit pattern 0000 0001 0000 0000 has one set bit. What is its position?` Answer: `8`. Derivation: count from the right starting at zero. Level 4; targets one-indexing.

**Implementation and automated validation.** Derive all displayed forms from `k`; independently verify popcount is one and `value == 2^k`. Across 100 family items, cover every exponent `0..16` before a third repetition, and balance forward and inverse prompts.

### Family `power_landmark`

**Learner task.** Relate a non-power value to the powers immediately below and above it, or select the smallest power of two meeting a limit.

**Relationship to skill.** This turns memorized facts into magnitude and allocation-size reasoning.

**Response mode.** Integer input or two named integer fields.

**Preferred templates.**

- `Which exponents bracket {value}? Enter lower n and upper n such that 2^lower < {value} < 2^upper.`
- `What is the smallest exponent n for which 2^n >= {value}?`
- `Which power of two is closest to {value}? Enter its exponent n.`

**Placeholders.** Choose base exponent `k` in `2..30`. For bracketing, `2^k < value < 2^(k+1)`. For ceiling, `value` may also equal `2^k`. For closest, construct values on either side of midpoint `3*2^(k-1)`; exact ties are excluded unless the prompt states the tie rule `choose the smaller power`.

**Derivation.** `floorExponent` is the unique `k` with `2^k <= value < 2^(k+1)`. `ceilExponent` equals it for an exact power and otherwise `k+1`. Compare absolute differences for nearest.

**Constraints and rejection.** Bracketing never receives an exact power. Reject nearest instances with a difference ratio so extreme that digit length alone reveals the answer at advanced levels. Never say “closest listed power”; name the domain and tie rule.

**Difficulty.**

- Level 1: smallest power at least a value, values just above a familiar power.
- Level 2: full bracketing, varied offsets.
- Level 3: nearest power with cases on both sides of the arithmetic midpoint.
- Level 4: mixed hexadecimal value and exponent response.

**Feedback.** Show both neighboring powers and their distances. Diagnose choosing floor when ceiling was requested or comparing exponent distance.

**Examples.**

1. `Smallest n such that 2^n >= 70?` Answer `7`; `2^6=64 < 70 <=128=2^7`. Level 1.
2. `Enter the exponents bracketing 1000.` Answer `9, 10`; `512 < 1000 < 1024`. Level 2.
3. `Which power of two is closest to 0x0180? Enter n; if equally close, choose the smaller power.` Answer `8`; `0x0180=384`, equally distant from 256 and 512, so the stated rule selects `2^8`. Level 4.

**Implementation and validation.** Construct from a known interval, then verify inequalities. Balance lower/upper nearest answers and exact/non-exact ceiling cases. Tie cases must be at most 10% and must display the rule.

## 2.2 Subcategory: Base Conversion and Grouping

### Skill and mental operation

Convert fixed-width patterns by grouping bits into nibbles or triples, and connect unsigned decimal to a fixed-width pattern. Preserve width separately from numeric value.

### Common misconceptions

- Grouping binary from the left instead of from the radix point/right edge.
- Dropping leading zeroes from a pattern answer.
- Treating hex digits as decimal digits.
- Reversing digit order while expanding a nibble.
- Assuming octal has the same four-bit grouping as hex.
- Producing a value that fits numerically but exceeds the declared fixed-width pattern length.

### Generation scope and dimensions

Binary/hex widths are multiples of four from `4..64`. Octal grouping uses widths `3, 6, 9, 12, 15, 18, 24`; non-multiples of three may appear only at advanced levels with explicit left padding. Unsigned decimal conversion uses `4..16` bits for direct mental work and larger widths only for sparse or landmark patterns. Dimensions are direction, fixed-width preservation, missing group, mixed representation, density, and alignment.

### Family `binary_hex_grouping`

**Learner task.** Convert a complete fixed-width binary pattern to hexadecimal or expand hexadecimal to the exact-width binary pattern.

**Response mode.** Hexadecimal-string or binary-string input.

**Template.** `Convert the {width}-bit {sourceRepresentation} pattern {source} to {targetRepresentation}.`

**Placeholders.** `{width}` is a multiple of four in `4..64`; `{source}` is formatted to exactly the width; target is the other of binary and hexadecimal.

**Derivation.** Partition binary from the right into four-bit groups and map each group to one hex digit, or expand each hex digit independently into four bits. Preserve all groups.

**Constraints and rejection.** At least one group should contain both zero and one except at Level 1. At least 40% of items must contain a leading zero group, and at least 30% must contain an internal `0000`/`0` group. Reject all-zero and all-one patterns except deliberate diagnostics.

**Difficulty.**

- Level 1: one or two nibbles, conversion chart visible.
- Level 2: two to four nibbles, chart hidden, both directions.
- Level 3: leading and internal zero groups; missing-nibble controlled variation.
- Level 4: 24–64 bits but chunked visually; one selected field converted rather than the entire value.

**Feedback.** Align every nibble over its hex digit. If the numeric value matches but width does not, say `The value is right, but a {width}-bit pattern needs {digits} hex digits/{width} bits.`

**Examples.**

1. `Convert 8-bit binary 1010 1111 to hexadecimal.` Answer `AF`. Level 1; `1010=A`, `1111=F`.
2. `Convert 16-bit hexadecimal 0x0D04 to binary.` Answer `0000 1101 0000 0100`. Level 2; targets leading/internal zero preservation.
3. `In 0b1101 0110 0011 1001, convert only bits 11..4 to two hex digits.` Answer `63`. Level 4; select `0110 0011`, then group.

**Validation and coverage.** Round-trip with independent parsing; enforce exact target digit count. Track nibble values and ensure each of `0..F` occurs regularly in every position class.

### Family `binary_octal_grouping`

**Learner task.** Convert binary and octal by three-bit groups.

**Response mode.** Octal-string or binary-string input.

**Template and placeholders.** `Convert {source} to an exact {width}-bit {target} pattern.` Width is normally divisible by three. At Levels 3–4, `{width}` may not be divisible by three; the prompt explicitly says `pad on the left to a multiple of three, then discard only padding when returning to {width} bits`.

**Derivation.** Group from the right in triples, left-pad the top group if needed, and map `000..111` to `0..7`.

**Constraints and rejection.** Octal receives no more than 15% of Representation practice by default. Reject examples whose only challenge is transcribing more than eight octal digits. Include leading-zero preservation.

**Difficulty.** Level 1 uses `3..6` bits and a chart; Level 2 uses `9..18` bits in either direction; Level 3 introduces non-multiple widths with explicit padding; Level 4 compares a selected octal field with hex grouping.

**Feedback.** Show triple alignment and explicitly contrast `3 bits per octal digit` with `4 per hex digit` when a hex-like answer appears.

**Examples.**

1. `Convert binary 111 101 to octal.` Answer `75`. Level 1.
2. `Convert 12-bit octal 0o0534 to binary.` Answer `000 101 011 100`. Level 2; leading group retained.
3. `Convert the 11-bit pattern 11 011 001 101 to octal, left-padding only for grouping.` Answer `0o3315`; padded binary is `011 011 001 101`. Level 3.

**Validation and coverage.** Parse both forms and compare numeric value plus declared width. Exercise all octal digits, but keep the family opt-in or low-weight.

### Family `unsigned_base_conversion`

**Learner task.** Convert between unsigned decimal and a declared-width binary or hexadecimal form.

**Response mode.** Decimal-number, binary-string, or hexadecimal-string input.

**Template.** `Represent unsigned decimal {value} as exactly {width} bits in {base}.` or `What unsigned decimal value does the {width}-bit pattern {pattern} represent?`

**Placeholders.** `{value}` is in `0..2^width-1`; `{base}` is binary or hex. For arbitrary dense patterns, width is at most 16. Widths up to 64 are allowed for sparse patterns containing at most four set bits or a power-of-two boundary plus/minus at most 3.

**Derivation.** Use positional weights for binary; hex may be decoded nibble-by-nibble as `value = 16*accumulator + digit`. Encoding repeatedly selects groups, then left-pads to declared width.

**Constraints and rejection.** Do not ask for large dense decimal values that require calculator-like arithmetic. At least half of advanced questions should be decomposable using powers-of-two landmarks.

**Difficulty.** Level 1: decimal `0..255` and binary. Level 2: 8–12 bit binary/hex. Level 3: mixed direction with leading zeros. Level 4: sparse 16–64 bit landmarks or a selected field.

**Feedback.** Show a sum of nonzero place values for binary or a short base-16 accumulation. Diagnose signed interpretation if a top-bit-set pattern receives the corresponding negative answer.

**Examples.**

1. `Represent unsigned decimal 13 as exactly 8 binary bits.` Answer `0000 1101`. Level 1.
2. `What unsigned decimal value is 0x02A7?` Answer `679`; `2*256 + 10*16 + 7`. Level 2.
3. `What unsigned decimal value is the 32-bit pattern 0x80000005?` Answer `2147483653`; `2^31 + 5`. Level 4; landmark decomposition.

**Validation and coverage.** Round-trip exact values with arbitrary-precision integers. Balance encode/decode, base, top bit, zero, and sparse/dense classes.

## 2.3 Subcategory: Signed and Unsigned Views

### Skill and mental operation

Interpret the same `n` bits under unsigned weights and two's-complement weights, and encode representable signed or unsigned values without changing the width.

### Common misconceptions

- Treating the top bit as a separate minus sign (sign-magnitude).
- Negating the unsigned value instead of subtracting `2^n`.
- Applying two's complement to a positive top-bit-zero pattern.
- Believing a reinterpretation changes bits.
- Omitting leading ones or zeroes in an exact pattern answer.
- Assuming signed and unsigned ranges have the same positive maximum.

### Generation scope and dimensions

Widths `4, 8, 12, 16`, then sparse/near-boundary `24, 32, 64`. Balance top bit clear/set, zero, all ones, signed minimum, signed maximum, and ordinary interior values. Dimensions are direction, source representation, sign, boundary distance, and whether the learner must give one or both views.

### Family `interpret_pattern`

**Learner task.** Give the unsigned and/or signed decimal interpretation of a fixed-width pattern.

**Response mode.** One or two named integer fields.

**Template.** `Interpret the {width}-bit pattern {pattern}: unsigned = ?, signed = ?.` A controlled variation requests only one field.

**Derivation.** Parse raw `u`. Unsigned is `u`. Signed is `u` if `u < 2^(n-1)`, otherwise `u - 2^n`.

**Constraints and rejection.** Two-view questions should dominate because they make sameness of bits visible. Keep dense arbitrary patterns at width 16 or below. Boundary patterns must not exceed 25% collectively.

**Difficulty.** Level 1 asks one view for 4–8 bits with the formula visible. Level 2 asks both views. Level 3 uses hex source and near-boundary cases. Level 4 uses 24–64-bit sparse patterns.

**Feedback.** State `the bits do not change`; show `unsigned - 2^n` only for top-bit-set signed decoding. Detect sign-magnitude and one's-complement answers where possible.

**Examples.**

1. `Interpret 8-bit 0111 1101 as unsigned and signed.` Answer `125, 125`. Level 1.
2. `Interpret 8-bit 1111 1101 as unsigned and signed.` Answer `253, -3`; `253-256=-3`. Level 2.
3. `Interpret 32-bit 0x80000020 as unsigned and signed.` Answer `2147483680, -2147483616`; subtract `2^32`. Level 4.

**Validation and coverage.** Assert both values map back to identical low `n` bits. Balance sign-bit classes 50/50 outside diagnostics.

### Family `encode_fixed_width`

**Learner task.** Encode a representable signed or unsigned decimal value as an exact-width binary or hex pattern.

**Response mode.** Binary-string or hex-string input.

**Template.** `Encode {value} as {signedness} {width}-bit {representation}.`

**Derivation.** Unsigned raw is `value`. Signed raw is `value` when non-negative, otherwise `value + 2^n`. Format to exact width.

**Constraints and rejection.** Values must be representable. Negative cases must include ordinary negatives, not only `-1` and the minimum. When target hex and width is not a multiple of four, unused high display bits must be zero and the width stated prominently.

**Difficulty.** Level 1 unsigned and non-negative signed values. Level 2 small negative signed values using `2^n + value`. Level 3 mixed binary/hex and boundaries. Level 4 sparse larger widths.

**Feedback.** For negative values show both `2^n - magnitude` and an invert-plus-one check. Diagnose sign-magnitude if the submitted pattern has only the high bit plus magnitude.

**Examples.**

1. `Encode unsigned 10 as 8-bit binary.` Answer `0000 1010`. Level 1.
2. `Encode signed -37 as 8-bit hexadecimal.` Answer `DB`; `256-37=219=0xDB`. Level 2.
3. `Encode signed -32767 as 16-bit binary.` Answer `1000 0000 0000 0001`; `65536-32767=32769`. Level 3; counters the assumption that every negative has many trailing ones.

**Validation and coverage.** Decode the produced pattern under the requested signedness and compare with the source. Balance signs and distance from zero/boundaries.

### Family `reinterpret_decimal_view`

**Learner task.** Given a decimal value and its declared signedness/width, give the other interpretation without re-encoding a new value.

**Response mode.** Integer input.

**Template.** `The {width}-bit pattern is currently described as {sourceSignedness} decimal {sourceValue}. Reinterpret the same bits as {targetSignedness}.`

**Derivation.** If unsigned `u` becomes signed, answer `u` for `u < 2^(n-1)`, else `u-2^n`. If signed `s` becomes unsigned, answer `s` for `s>=0`, else `s+2^n`.

**Constraints and rejection.** Source must fit its declared interpretation. At least 70% of instances should cross to a different decimal value; unchanged positive cases remain as misconception checks.

**Difficulty.** Level 1 uses small 4–8-bit values and a visible range. Level 2 mixes changed/unchanged views. Level 3 uses boundaries and hex confirmation. Level 4 uses larger sparse values.

**Feedback.** Show the shared bit pattern as the bridge. Say explicitly that this is reinterpretation, not numeric conversion or clamping.

**Examples.**

1. `Reinterpret 8-bit unsigned 250 as signed.` Answer `-6`; `250-256`. Level 1.
2. `Reinterpret 12-bit signed -17 as unsigned.` Answer `4079`; `-17+4096`. Level 2.
3. `Reinterpret 16-bit unsigned 32767 as signed.` Answer `32767`; top bit is clear. Level 3; targets always-subtract misconception.

**Validation and coverage.** Encode source, decode target, and assert exact bit identity. Balance direction and changed/unchanged outcomes.

## 2.4 Subcategory: Widths, Ranges, and Representability

### Skill and mental operation

Use power-of-two boundaries to decide whether values fit, find a minimum width, and identify fixed-width extrema.

### Common misconceptions

- Giving signed maximum as `2^n-1` rather than `2^(n-1)-1`.
- Giving signed minimum as `-(2^(n-1)-1)` and forgetting the extra negative value.
- Treating unsigned minimum as a worthwhile repeated recall question; it is always zero.
- Using magnitude bits plus one sign bit for negative two's-complement values without checking the asymmetric boundary.
- Treating bit-pattern digit length as sufficient when a leading signed zero or one is required.

### Generation scope and dimensions

Widths `1..64`, with navigation levels favoring the standard width set. Values are sampled from boundary offsets `-2, -1, 0, +1, +2`, interior landmarks, and ordinary values. Difficulty comes from signedness, negative boundaries, inverse minimum-width reasoning, multiple candidate widths, and mixed representations.

### Family `range_boundary`

**Learner task.** Give a nontrivial minimum or maximum for a declared width and signedness, or identify which boundary a pattern represents.

**Response mode.** Integer input or single-choice.

**Template.** `What is the {boundary} {signedness} value representable in {width} bits?`

**Derivation.** Unsigned maximum `2^n-1`; signed minimum `-2^(n-1)`; signed maximum `2^(n-1)-1`. Unsigned minimum may appear only in an introductory comparison containing other boundaries, never as a standalone randomly repeated item.

**Constraints and rejection.** Balance the three nontrivial formulas. Do not let memorized 8/16/32-bit values exceed half of items.

**Difficulty.** Level 1 uses 4/8 bits with formula cues. Level 2 removes cues and varies widths. Level 3 asks boundary-pattern classification. Level 4 mixes decimal and hex boundaries.

**Multiple-choice distractors.** For boundary-pattern classification, use the other declared boundaries (`signed minimum`, `signed maximum`, `unsigned maximum`) plus `none of these`, removing any label that is also true under the prompt's explicitly stated interpretation. Never mix interpretations without naming them.

**Feedback.** Show the formula and explain signed asymmetry. For off-by-one answers, name whether zero was counted.

**Examples.**

1. `Maximum unsigned value in 6 bits?` Answer `63`; `2^6-1`. Level 1.
2. `Minimum signed value in 12-bit two's complement?` Answer `-2048`; `-2^11`. Level 2.
3. `The 16-bit pattern 0x7FFF is which boundary?` Answer `signed maximum`; top bit zero and remaining bits one. Level 3.

**Validation and coverage.** Verify formulas with pattern enumeration for widths up to 12 and algebraically for larger widths. Ensure all boundary types and standard/nonstandard widths recur.

### Family `representability`

**Learner task.** Decide whether a value fits a declared signed or unsigned width.

**Response mode.** Yes/no.

**Template.** `Does decimal {value} fit in {width}-bit {signedness}?`

**Derivation.** Compare against the exact declared interval, inclusively.

**Instance construction.** Choose a boundary first, then an offset class: just inside, exactly on, just outside, or clear interior/exterior. Random broad sampling is not acceptable because it makes most decisions obvious.

**Constraints and rejection.** At least 60% of items lie within two of a boundary. Negative values paired with unsigned must appear but not dominate. Both `yes` and `no` must remain near 50%.

**Difficulty.** Level 1 gives the range. Level 2 requires recalling it. Level 3 asks the same value against signed and unsigned widths in two named fields. Level 4 presents value in hex but asks representability of its abstract unsigned value.

**Feedback.** Show the inclusive range and where the value lies. Diagnose using unsigned max for signed questions.

**Examples.**

1. `Does 127 fit in signed 8-bit?` Answer `yes`; range `-128..127`. Level 1.
2. `Does 256 fit in unsigned 8-bit?` Answer `no`; max `255`. Level 2.
3. `Does -129 fit in signed 8-bit and unsigned 8-bit?` Answer `no, no`; it is below signed minimum and negatives do not fit unsigned. Level 3.

**Validation and coverage.** Recompute interval membership. Balance boundary side, signedness, answer, and zero/negative/positive classes.

### Family `minimum_width`

**Learner task.** Find the smallest width that represents a given unsigned or two's-complement signed value.

**Response mode.** Integer input.

**Template.** `What is the minimum number of bits needed to represent {value} as {signedness}?`

**Derivation.** Unsigned: answer `1` for zero, otherwise smallest `n` with `value <= 2^n-1`. Signed: smallest `n >= 1` with `-2^(n-1) <= value <= 2^(n-1)-1`.

**Constraints and rejection.** Unsigned source is non-negative. Construct around width transitions. Do not accept a sign-and-magnitude shortcut; validate against the two's-complement interval.

**Difficulty.** Level 1 unsigned positive values near powers. Level 2 signed non-negative values, which need a sign bit. Level 3 signed negative values around asymmetric boundaries. Level 4 values in hex or expressed as `2^k ± c`.

**Feedback.** Show why one fewer bit fails and the chosen width succeeds.

**Examples.**

1. `Minimum unsigned width for 255?` Answer `8`; 7-bit max is 127, 8-bit max 255. Level 1.
2. `Minimum signed width for 127?` Answer `8`; signed 7-bit max is 63. Level 2.
3. `Minimum signed width for -128?` Answer `8`; 8-bit min is -128 while 7-bit min is -64. Level 3.

**Validation and coverage.** Assert fit at `n` and non-fit at `n-1` (unless `n=1`). Balance exact-boundary and one-away cases, positive and negative signed values.

## 2.5 Subcategory: Extension and Truncation

### Skill and mental operation

Change pattern width while knowing which interpretation is preserved: fill high bits with zero for unsigned preservation, copy the source sign bit for signed preservation, or keep only low bits for truncation.

### Common misconceptions

- Sign-extending every source with ones rather than copying its sign bit.
- Extending based on whether a displayed decimal “looks negative” instead of the source top bit.
- Assuming zero extension preserves a negative signed value.
- Keeping high rather than low bits during truncation.
- Believing truncation preserves signed value rather than residue modulo `2^destinationWidth`.

### Generation scope and dimensions

Source/destination pairs include `4→8`, `4→12`, `8→12`, `8→16`, `12→16`, `16→32`, `24→32`, and `32→64`; truncation reverses them. Difficulty dimensions are fill rule, sign bit, whether zero/sign extension coincide, value-versus-pattern response, and composition with interpretation.

### Family `extend_pattern`

**Learner task.** Zero-extend or sign-extend a source pattern to an exact destination width.

**Response mode.** Binary-string or hex-string input.

**Template.** `{operation}-extend the {sourceWidth}-bit pattern {source} to {destinationWidth} bits.`

**Derivation.** Zero extension keeps raw source and adds zero high bits. Sign extension decodes source as signed, then encodes that value at destination width; equivalently fill new high bits with the original source top bit.

**Constraints and rejection.** For sign extension, balance source sign bit. Include cases where sign and zero extension coincide, but not more than half. Destination must be wider.

**Difficulty.** Level 1 zero extension and positive sign extension. Level 2 negative sign extension. Level 3 mixes operation names and hex/binary. Level 4 asks which operation preserves a declared interpretation before giving the result.

**Feedback.** Highlight the original sign bit and the newly filled region. If the answer matches the other extension, name the semantic difference.

**Examples.**

1. `Zero-extend 4-bit 1001 to 8 bits.` Answer `0000 1001`; unsigned 9 preserved. Level 1.
2. `Sign-extend 4-bit 1001 to 8 bits.` Answer `1111 1001`; signed -7 preserved. Level 2.
3. `Sign-extend 12-bit 0x7A5 to 16 bits.` Answer `0x07A5`; source sign bit is zero. Level 3; targets always-fill-ones.

**Validation and coverage.** Assert low source bits unchanged, high fill uniform, and requested interpreted value preserved. Cross-check by decode/re-encode.

### Family `truncate_pattern`

**Learner task.** Truncate a source pattern and state the resulting pattern, optionally with its numeric interpretation.

**Response mode.** Binary/hex string, or pattern plus named decimal field.

**Template.** `Truncate the {sourceWidth}-bit pattern {source} to {destinationWidth} bits.`

**Derivation.** `result = source mod 2^destinationWidth`; format exactly. If requested, decode under the explicitly stated destination signedness.

**Constraints and rejection.** At least 70% of instances discard at least one `1`, so truncation visibly changes the abstract unsigned value. Include no-change high-zero cases as diagnostics, not the majority.

**Difficulty.** Level 1 direct low-bit selection. Level 2 mixed group boundary. Level 3 asks resulting unsigned/signed interpretation. Level 4 composes truncation followed by extension and asks whether original value returns.

**Feedback.** Mark discarded versus retained regions and state the modulo relationship.

**Examples.**

1. `Truncate 8-bit 1011 0110 to 4 bits.` Answer `0110`; keep low four. Level 1.
2. `Truncate 16-bit 0xA37C to 8 bits.` Answer `0x7C`; modulo 256. Level 2.
3. `Truncate 12-bit 0xF81 to 8 bits, then interpret signed.` Answer pattern `0x81`, signed `-127`. Level 3.

**Validation and coverage.** Assert result equals masked low bits. Balance discarded high popcount and destination sign bit.

### Cross-family progression for Representation

Introduce `power_relation`, then `binary_hex_grouping`, then unsigned decimal conversion. Only after fixed-width leading zeroes are reliable should signed interpretation and encoding be interleaved. `range_boundary` precedes representability and minimum-width questions. Extension follows signed views; truncation follows unsigned modulo intuition.

After mastery, interleave:

- powers with minimum width;
- base grouping with signed/unsigned views;
- representability with encoding;
- extension/truncation with reinterpretation.

Keep octal low-weight and separate from early hex acquisition. If errors combine signedness and conversion, diagnose with a same-pattern two-view item before lowering width.

## 3. Category: Fixed-Width Arithmetic

### Category purpose

Train calculation of wrapped results while keeping four distinct ideas separate: exact mathematical result, low-width result bits, unsigned carry/borrow, and signed overflow.

### Learn

An `n`-bit result keeps the low `n` bits, which is reduction modulo `2^n`. Unsigned addition has carry-out when the exact sum is at least `2^n`; unsigned subtraction borrows when `a < b`. Signed overflow is different: it occurs when the mathematical signed result lies above `2^(n-1)-1` or below `-2^(n-1)`.

```text
4-bit 1111 + 0001 = 0000, carry yes, signed overflow no
4-bit 0111 + 0001 = 1000, carry no, signed overflow above
4-bit 1000 - 0001 = 0111, borrow no, signed overflow below
```

Both sides use identical bit addition; interpretation determines which status is meaningful. The UI must call a result below signed minimum `signed overflow below`, not signed underflow.

### Prerequisites

Exact-width binary encoding, signed/unsigned interpretation, and ranges.

### Category boundaries

Bitwise AND/OR/XOR are not arithmetic. This category may show hexadecimal operands only after binary carry behavior is learned. It does not teach language-specific overflow behavior or processor flags beyond the abstract definitions above.

### Subcategories in order

1. Unsigned Addition and Subtraction
2. Two's-Complement Addition and Subtraction
3. Carry, Borrow, and Signed Overflow

## 3.1 Subcategory: Unsigned Addition and Subtraction

### Skill, operation, and misconceptions

Compute the exact result, retain its low `n` bits, and independently identify carry or borrow. Common errors are dropping width after wrap, calling every wrapped result “overflow” without specifying status, using the result's top bit as carry, treating borrow as the carry bit, and subtracting in signed decimal because the pattern looks negative.

Widths are `4, 8, 12, 16` for dense operands; `24..64` only for hex-aligned or sparse operands. Case classes must deliberately cover no-status, exact boundary, one past boundary, long carry/borrow chains, and ordinary status cases.

### Family `unsigned_fixed_operation`

**Learner task.** Compute an unsigned add or subtract and return the exact-width result plus `carry` or `borrow`.

**Response mode.** Two named fields: fixed-width pattern and yes/no status.

**Templates.**

```text
{width}-bit unsigned:
  {left}
{operator} {right}
result = ?    {statusName} = ?
```

`{operator}` is `+` or `-`; `{statusName}` is `carry` for addition and `borrow` for subtraction. Operands are binary by default, with optional parenthesized unsigned decimal only at Levels 1–2.

**Derivation.** Addition: `exact=a+b`, `wrapped=exact mod 2^n`, `carry=(exact>=2^n)`. Subtraction: `exact=a-b`, `wrapped=exact mod 2^n`, `borrow=(a<b)`.

**Accepted answers.** Exact-width binary or hex as requested, and explicit Boolean status. A correct pattern with missing status is incomplete, not correct.

**Constraints and rejection.** Construct status/no-status near 50/50. Reject `+0` and `-0` except diagnostics; reject `a-a` beyond Level 1; reject cases where both operands and result are all-zero/all-one unless targeting a boundary. Keep exact decimal arithmetic mentally feasible when displayed.

**Difficulty.**

- Level 1: 4-bit, decimals shown, at most one local carry/borrow, status definition visible.
- Level 2: 8-bit, carry/borrow chains, no decimal annotation.
- Level 3: hex operands/results and near-boundary cases; learner may choose chunked binary.
- Level 4: one operand/result missing in a reversible equation, status supplied as a cue.
- Level 5: 16–64-bit sparse or hex-chunked operands; no dense longhand arithmetic.

**Feedback.** First show exact relation, then `low n bits`, then status test. Recognize (a) unwrapped exact answer, (b) signed interpretation, (c) inverted borrow, and (d) discarded carry appended to the result.

**Examples.**

1. `4-bit unsigned 1110 + 0011.` Answer `0001, carry yes`; exact `17`, modulo `16` is `1`. Level 1.
2. `8-bit unsigned 0010 0000 - 0010 0001.` Answer `1111 1111, borrow yes`; exact `-1`, modulo `256`. Level 2.
3. `16-bit unsigned 0xFF08 + 0x01F8.` Answer `0x0100, carry yes`; exact `0x10100`, retain low four hex digits. Level 3.

**Implementation, validation, and coverage.** Use arbitrary-precision integers, never host bitwise operators that coerce to 32 bits. Independently verify by modular arithmetic and bit-column simulation for widths through 16. In each 100 items per operator, target 45–55 status-yes, at least 15 boundary-distance `0..2`, 15 long-chain, and 20 ordinary cases.

### Family `unsigned_missing_operand`

**Learner task.** Recover one operand from a fixed-width unsigned equation, using the wrapped result and stated carry/borrow.

**Response mode.** Exact-width pattern input.

**Template.** `{left} {operator} ? = {wrapped} ({statusName}: {status})` or `? {operator} {right} = ...`.

**Derivation.** Solve modulo `2^n`; then use the given status to validate the unique `n`-bit operand. For `a-b=r`, missing `b=(a-r) mod 2^n`; missing `a=(r+b) mod 2^n`. Addition is analogous.

**Constraints and rejection.** There must be exactly one `n`-bit solution. Status must be consistent and pedagogically informative; reject cases where zero is the missing operand or where copying a visible term works. Do not introduce this before direct operations are reliable.

**Difficulty.** Level 2 gives decimals and 4 bits. Level 3 uses 8-bit binary. Level 4 mixes hex and asks the learner to verify status. Level 5 interleaves addition/subtraction without naming the inverse operation.

**Feedback.** Show the inverse modular operation and substitute the answer into the original equation.

**Examples.**

1. `4-bit: 1100 + ? = 0010 (carry yes).` Answer `0110`; `12+6=18`. Level 2.
2. `8-bit: ? - 0011 0000 = 1110 0000 (borrow yes).` Answer `0001 0000`; `16-48=-32 mod 256`. Level 3.
3. `16-bit: 0x0040 - ? = 0xFFF0 (borrow yes).` Answer `0x0050`; `64-80=-16`. Level 4.

**Validation and coverage.** Enumerate all candidates for widths up to 8 in tests; algebraically solve and resubstitute for larger widths. Balance missing side, operator, and status.

## 3.2 Subcategory: Two's-Complement Addition and Subtraction

### Skill, operation, and misconceptions

Perform the same low-bit arithmetic while judging the exact result against the signed range. Expose these errors: equating carry with signed overflow, declaring overflow whenever signs differ, overlooking `minimum - 1`, and treating the wrapped signed interpretation as the exact result.

### Family `signed_fixed_operation`

**Learner task.** Add or subtract signed two's-complement operands and return wrapped bits plus signed-overflow direction `above`, `below`, or `none`.

**Response mode.** Pattern plus single-choice overflow direction.

**Template.**

```text
{width}-bit two's complement:
  {leftPattern} ({leftSigned})
{operator} {rightPattern} ({rightSigned})
result bits = ?    signed overflow = above / below / none
```

Decimal annotations disappear after Level 2.

**Derivation.** Decode `a` and `b` as signed. Compute exact mathematical `s=a±b`. Encode `s mod 2^n`. Direction is `above` if `s>signedMax`, `below` if `s<signedMin`, otherwise `none`.

**Constraints and rejection.** Construct each direction; random sampling will make overflow too rare. For addition, above cases use two positive operands and below cases two negative operands. For subtraction, above usually uses non-negative minus negative; below uses negative minus positive. Reject zero operands except targeted sign-rule diagnostics.

**Difficulty.**

- Level 1: 4-bit with decoded decimal operands and range shown.
- Level 2: 8-bit with decimal operands, mixed overflow/no-overflow.
- Level 3: bits only; learner decodes signs and predicts overflow.
- Level 4: hexadecimal patterns and boundary-adjacent exact results.
- Level 5: missing operand or requested exact mathematical result alongside bits.

**Distractors.** For the overflow choice, use the direction implied by carry-out, the opposite boundary direction, and `none`. Never label `below` as “underflow.”

**Feedback.** Show decoded exact arithmetic and range comparison. If the submitted direction matches carry-out, explicitly state `carry-out concerns unsigned arithmetic; signed overflow concerns the signed range`.

**Examples.**

1. `4-bit signed 0111 (+7) + 0001 (+1).` Answer `1000, above`; exact `8 > 7`. Level 1.
2. `8-bit signed 1000 0000 (-128) - 0000 0001 (+1).` Answer `0111 1111, below`; exact `-129`. Level 2.
3. `8-bit signed 1111 0000 + 1111 0000.` Answer `1110 0000, none`; `-16+-16=-32` fits despite carry-out. Level 3; targets carry=overflow.

**Validation and coverage.** Cross-check range comparison with sign rules: addition overflows only for equal-sign operands with different result sign; subtraction only for differing operand signs with result sign differing from left. Per 90 items per operator, target 30 each `above/below/none`.

### Family `signed_missing_operand`

**Learner task.** Recover a signed operand from a wrapped equation and validate the stated overflow direction.

**Response mode.** Exact-width pattern; optional signed-decimal confirmation.

**Template.** `{leftPattern} {operator} ? = {resultPattern}; signed overflow {direction}.`

**Derivation.** Solve the raw equation modulo `2^n`, decode the candidate, recompute exact signed arithmetic, and check direction. The raw missing pattern is unique; the overflow cue teaches that inverse arithmetic and interpretation are separate.

**Constraints and rejection.** Reject if the overflow cue is inconsistent, if the missing value is zero, or if the candidate is visually identical to a visible operand. Use only after Level 3 direct mastery.

**Difficulty.** Level 3 uses 4–8 bits and signed decimals. Level 4 removes decimals. Level 5 asks for both pattern and signed interpretation.

**Feedback.** Solve low bits first, then perform the signed range check; do not pretend ordinary algebra alone determines an unbounded integer.

**Examples.**

1. `4-bit: 0111 + ? = 1001; overflow above.` Answer `0010` (+2); exact 9. Level 3.
2. `8-bit: ? - 0000 0001 = 0111 1111; overflow below.` Answer `1000 0000` (-128). Level 4.
3. `8-bit: 1111 1010 - ? = 0000 0011; overflow none.` Answer `1111 0111` (-9); `-6-(-9)=3`. Level 5.

**Validation and coverage.** Resubstitute raw bits and recompute signed direction. Balance missing side/operator/direction and reject duplicate structural signatures.

## 3.3 Subcategory: Carry, Borrow, and Signed Overflow

### Skill and mental operation

Given one bit operation, report unsigned and signed status independently. The learner should reason from exact unsigned and signed interpretations, not infer one flag from another.

### Common misconceptions

- Carry-out equals signed overflow.
- No carry means no signed overflow.
- Borrow is simply “negative signed result.”
- A top-bit-set wrapped result necessarily indicates overflow.
- Believing signed overflow has separate hardware statuses named overflow and underflow.

### Family `classify_arithmetic_status`

**Learner task.** For one addition or subtraction on raw `n`-bit patterns, give wrapped result and all applicable status fields.

**Response mode.** Multiple named fields:

- addition: `result`, `unsigned carry`, `signed overflow`;
- subtraction: `result`, `unsigned borrow`, `signed overflow`.

Signed overflow is `above/below/none`.

**Template.** `Treat these as raw {width}-bit patterns. Perform {left} {operator} {right}, then classify both unsigned and signed status.`

**Derivation.** Compute raw result modulo `2^n`. Compute carry/borrow using unsigned interpretations. Separately decode both operands and compare exact signed result with signed range.

**Instance construction.** Generate from a truth-table case class, not independent random operands. Addition must cover:

| Carry | Signed overflow | Required example class |
|---|---|---|
| no | none | small positives or cancelling signs |
| yes | none | two negatives whose sum fits, or mixed signs |
| no | above | two positives crossing signed max |
| yes | below | two negatives crossing signed min |

Subtraction must similarly cover all feasible combinations of borrow and signed direction.

**Constraints and rejection.** Every presented combination must be feasible and independently verified. No class may exceed 35% of recent items. Reject trivial zero identities and ambiguous status labels.

**Difficulty.** Level 2 shows signed/unsigned operand interpretations. Level 3 shows only bits. Level 4 asks status before result bits or uses hex. Level 5 asks which single condition changed after a one-bit operand modification.

**Feedback.** Use two parallel lines:

```text
unsigned: {uLeft} op {uRight} = {uExact} -> carry/borrow {status}
signed:   {sLeft} op {sRight} = {sExact} -> overflow {direction}
```

**Examples.**

1. `4-bit 1111 + 0001.` Answer `0000; carry yes; signed overflow none`. Unsigned `15+1=16`; signed `-1+1=0`. Level 2.
2. `4-bit 0111 + 0001.` Answer `1000; carry no; signed overflow above`. Level 3.
3. `8-bit 1000 0000 - 0000 0001.` Answer `0111 1111; borrow no; signed overflow below`. Unsigned `128-1`; signed `-128-1`. Level 3.

**Implementation and validation.** Exhaustively enumerate widths 2–8 to prove expected feasible status combinations and validate formulas. For wider widths, construct by lifting known small cases and adding neutral high/low regions. Coverage reports must include the joint status matrix, not only individual marginals.

### Cross-family progression for Fixed-Width Arithmetic

Teach unsigned direct addition before unsigned subtraction; then signed addition and subtraction. Introduce joint classification only after the learner can separately compute each status. Interleave direct signed and unsigned questions on the same raw patterns to reinforce that bits are shared but interpretation changes status.

Missing-operand families are mastery probes, not early difficulty-by-obscurity. If result bits are right but status is wrong, keep width stable and select diagnostic joint-status classes. If both are wrong, return to direct low-bit arithmetic before status classification.

## 4. Category: Bit Manipulation

### Category purpose

Train independent per-bit logic, movement of bits within a fixed width, and deliberate selection or replacement of bits without disturbing unrelated positions.

### Learn

`AND` keeps positions where both bits are one. `OR` keeps positions where either is one. `XOR` keeps positions where bits differ. Width-bounded `NOT` flips every bit in the stated width.

Shifts discard bits; rotations wrap them around. Masks and fields combine these primitives:

```text
set selected bits:      x | mask
clear selected bits:    x & ~mask
toggle selected bits:   x ^ mask
extract hi..lo:         (x >> lo) & (2^(hi-lo+1)-1)
insert field v:         (x & ~fieldMask) | ((v << lo) & fieldMask)
```

Testing must name its predicate. `(x & mask) != 0` means **any** selected bit is set; `(x & mask) == mask` means **all** are set; `(x & mask) == expected` means selected bits exactly match a pattern.

### Prerequisites

Exact-width base grouping, bit positions, and truncation.

### Category boundaries

Addition/subtraction belongs to Fixed-Width Arithmetic, even if displayed in binary. Memory byte reordering belongs to Memory Representation. Masks may select non-contiguous bits; bit fields in this topic are contiguous.

### Subcategories in order

1. Bitwise Operators
2. Shifts
3. Rotates
4. Mask Construction
5. Mask Application and Flags
6. Bit-Field Extraction and Insertion

## 4.1 Subcategory: Bitwise Operators

### Skill, operation, misconceptions, and scope

Apply a truth table independently at aligned positions. Misconceptions include treating XOR as OR, treating XOR as whole-number inequality, using logical instead of bitwise NOT, omitting width for NOT, carrying between columns, and accidentally doing binary addition. Widths are `4..32` for dense patterns and up to 64 when nibble grouping is visible. Difficulty dimensions are operator, complement width, active-bit distribution, mixed representation, missing operand, and operator identification.

### Family `bitwise_result`

**Learner task.** Compute `AND`, `OR`, `XOR`, or fixed-width `NOT`.

**Response mode.** Exact-width binary or hex pattern.

**Template.**

```text
{width}-bit bitwise operation:
  {left}
{operator} {right}
```

For NOT: `{width}-bit NOT: ~{operand}`.

**Derivation.** Apply the operator per bit; for NOT use `mask(n) XOR operand`. Format low `n` bits exactly.

**Constraints and rejection.** For binary operators, ensure all four pair types `00,01,10,11` appear across recent items and at least three types appear in a representative item of width ≥4. Reject results that copy an operand or become all zero/one more than 15% unless targeting that identity. Never mix `+` or `-` into this family.

**Difficulty.** Level 1: 4 bits and one named truth table. Level 2: 8–16 bits, all operators. Level 3: hex operands with hex result or mixed hex/binary. Level 4: selected byte/field only. Level 5: operation name omitted but its rule stated verbally.

**Feedback.** Show aligned operands and result, highlighting mismatched columns. Recognize OR-like, AND-like, copied-operand, addition, and unbounded-NOT answers.

**Examples.**

1. `4-bit 1010 AND 1100.` Answer `1000`. Level 1.
2. `8-bit 1010 0101 XOR 1111 0000.` Answer `0101 0101`. Level 2; `1` where bits differ.
3. `16-bit NOT 0x0F80.` Answer `0xF07F`. Level 3; complement is limited to 16 bits.

**Validation and coverage.** Independently calculate per character and numerically. Balance operators; for XOR/OR/AND, track pair-type counts and misconception-result collisions.

### Family `xor_missing_operand`

**Learner task.** Recover a missing operand in a fixed-width XOR equation.

**Response mode.** Exact-width pattern input.

**Template.** `{left} XOR ? = {result}` or `? XOR {right} = {result}`.

**Derivation.** The missing operand is the visible operand XOR the result because `a ^ b ^ a = b`.

**Constraints and rejection.** The answer must not be zero or a copied visible operand beyond diagnostics. Use patterns containing both equal and differing bit pairs. Reject width-ambiguous displays.

**Difficulty.** Level 2 uses 4 bits with the inverse identity visible. Level 3 uses 8–16 bits. Level 4 mixes binary and hex representations. Level 5 embeds the relation as one step of mask recovery.

**Feedback.** Compare a wrong answer by substituting it into the original equation. Show the cancellation identity rather than describing XOR as subtraction.

**Examples.**

1. `1010 XOR ? = 0110.` Answer `1100`; `1010 XOR 0110`. Level 2.
2. `0110 1100 XOR ? = 1100 0011.` Answer `1010 1111`. Level 3.
3. `0xA55A XOR ? = 0x0FF0.` Answer `0xAAAA`. Level 4.

**Validation and coverage.** Resubstitute and assert exact equality. Balance missing side, representation, and all four visible/result bit pairs.

### Family `identify_bitwise_operator`

**Learner task.** Identify which of AND, OR, or XOR maps two operands to a displayed result.

**Response mode.** Single-choice.

**Template.** `Which bitwise operator maps {left} and {right} to {result}: AND, OR, or XOR?`

**Derivation.** Compute all three candidate results at the declared width.

**Constraints and rejection.** Exactly one operator must match. Reject collisions, such as fully disjoint operands where OR and XOR agree, and identity-dominated patterns. Ensure decisive `11` and differing-bit positions are visible.

**Difficulty.** Level 2 uses 4-bit binary. Level 3 uses 8–16 bits and weaker visual symmetry. Level 4 uses hex. Level 5 shows one selected field from wider operands.

**Multiple-choice distractors.** The two other actual operators are the distractors; each displayed choice should optionally preview only its operator name, not its result.

**Feedback.** Show all three computed candidates after submission and point to the bit pair that distinguishes them.

**Examples.**

1. `Which maps 1010 and 1100 to 1000?` Answer `AND`; OR=`1110`, XOR=`0110`. Level 2.
2. `Which maps 0110 and 1010 to 1110?` Answer `OR`; AND=`0010`, XOR=`1100`. Level 2.
3. `Which maps 0xCC and 0xAA to 0x66?` Answer `XOR`; AND=`0x88`, OR=`0xEE`. Level 4.

**Validation and coverage.** Assert exactly one correct candidate after formatting. Balance correct operators and distinguishing bit-pair classes.

## 4.2 Subcategory: Shifts

### Skill, operation, misconceptions, and scope

Move bits, distinguish zero-fill from sign-fill, and identify the last discarded bit. Misconceptions include confusing logical and arithmetic right shift, preserving all shifted-out bits as “carry,” reversing shift direction, rotating instead of shifting, using the post-shift sign bit for fill, and language-specific masking of large counts.

Widths are `4..32` dense and `64` sparse. Counts for direct shifts are exactly `1..n-1`; zero and `>=n` are excluded. Difficulty dimensions are direction, fill rule, count, carry request, information loss, sign bit, and mixed representation.

### Family `shift_result`

**Learner task.** Compute a width-bounded logical left, logical right, or arithmetic right shift.

**Response mode.** Exact-width pattern.

**Template.** `In {width} bits, compute {pattern} {operator} {count}.` Operators are `<<`, `>>>`, and `ASR`, with a visible legend until Level 3.

**Derivation.** Follow the normative machine model. Arithmetic right decodes the signed value, applies floor division by `2^count`, and re-encodes, equivalently copying the original sign bit.

**Constraints and rejection.** Direct instances require a visible effect: reject all-zero values and, for arithmetic right, all-one negative patterns. At least half of right-shift items have top bit one so logical and arithmetic results differ. Do not let the result be identical to a rotation result in diagnostic comparisons.

**Difficulty.** Level 1: count 1, left/logical right. Level 2: arithmetic right and counts up to 3. Level 3: any valid count with explicit width. Level 4: hex source and binary result or vice versa. Level 5: compare two shift kinds on one input.

**Feedback.** Draw `count` vacated positions and their fill; mark discarded bits. If answer equals a rotate, say discarded bits do not wrap.

**Examples.**

1. `In 8 bits, 1011 0010 >>> 1.` Answer `0101 1001`. Level 1.
2. `In 8 bits, 1011 0010 ASR 2.` Answer `1110 1100`; original sign bit one fills left. Level 2.
3. `In 16 bits, 0x81F0 << 5.` Answer `0x3E00`; discard bits above bit 15. Level 4.

**Validation and coverage.** Compare bit-string simulation with arbitrary-precision formulas. Balance kind, sign bit, count bands, and result popcount.

### Family `shift_with_carry`

**Learner task.** Compute shifted result and the last bit shifted out.

**Response mode.** Pattern plus Boolean/bit carry field.

**Template.** Same as `shift_result`, adding `result = ?, carry-out = ?`.

**Derivation.** Left carry is source bit `n-count`; right carry is source bit `count-1`. Result derivation is unchanged.

**Constraints and rejection.** Balance carry `0/1`. Include multi-bit shifts where earlier discarded bits differ from the last discarded bit. This prevents “any discarded one means carry one.”

**Difficulty.** Level 2 count 1. Level 3 multi-bit with a discarded-bit ribbon. Level 4 no ribbon and mixed shift kinds. Level 5 gives result/carry and asks for a constrained source field, only when unique.

**Feedback.** Display discarded bits in movement order and identify the final one. Diagnose answers using the first shifted-out bit or OR of all discarded bits.

**Examples.**

1. `8-bit 1011 0011 >>> 1.` Answer `0101 1001, carry 1`. Level 2.
2. `8-bit 1011 0010 >>> 3.` Answer `0001 0110, carry 0`; discarded low bits are `010`, last is original bit 2=`0`. Level 3.
3. `8-bit 1101 0110 << 3.` Answer `1011 0000, carry 0`; original bit 5 is last out. Level 3.

**Validation and coverage.** Simulate one single-bit shift at a time and compare final result/carry with the formula. Cross-tab kind, count band, and carry.

### Family `shift_identification`

**Learner task.** Determine the shift kind or count that transforms one pattern to another.

**Response mode.** Single-choice for kind or integer for count.

**Template.** `Which operation transforms {source} into {result} in {width} bits?` or `Find k in {source} {operator} k = {result}, with 1 <= k < {width}.`

**Derivation.** Enumerate the permitted operations/counts and retain exact matches.

**Constraints and rejection.** There must be exactly one correct answer in the stated candidate set. Reject zero/all-one and periodic patterns that create collisions. Counts greater than the width are never silently reduced.

**Difficulty.** Level 3 identifies logical versus arithmetic right. Level 4 finds a unique count. Level 5 distinguishes shift from rotate.

**Distractors.** Use actual results of the other shift/rotate kind or off-by-one counts. Do not use arbitrary counts when they produce visibly unrelated results.

**Examples.**

1. `Which right shift maps 1001 0000 to 1100 1000: >>>1 or ASR1?` Answer `ASR1`. Level 3.
2. `Find k: 1110 1000 >>> k = 0001 1101.` Answer `3`. Level 4.
3. `Which maps 1000 0001 to 0000 0011: <<1 or ROL1?` Answer `ROL1`. Level 5.

**Validation and coverage.** Enumerate all candidates and assert unique correctness. Track ambiguity rejection rate; a high rate indicates poor source-pattern construction.

## 4.3 Subcategory: Rotates

### Skill, operation, misconceptions, and scope

Wrap bits around an `n`-bit ring, connect left/right inverses, and normalize equivalent counts. Misconceptions are shifting with zero fill, rotating through an imagined carry bit, reversing direction, and failing to reduce counts modulo width.

### Family `rotate_result`

**Learner task.** Compute `ROL` or `ROR` within a stated width.

**Response mode.** Exact-width pattern.

**Template.** `In {width} bits, compute {direction}({pattern}, {count}).`

**Derivation.** Normalize `k=count mod n`; `ROL=((x<<k)|(x>>(n-k))) & mask`, `ROR=((x>>k)|(x<<(n-k))) & mask`, with `k=0` returning `x`.

**Constraints and rejection.** Normal direct counts are `1..n-1`. Reject all-zero/all-one and patterns periodic at the chosen count unless periodicity is the target. At least one wrapped bit must be one in 70% of items.

**Difficulty.** Level 1 count 1 with arrows. Level 2 counts up to half width. Level 3 any nonzero count. Level 4 count may exceed width and explicitly says normalize modulo width. Level 5 mixed hex/binary.

**Feedback.** Split into retained and wrapped segments. Diagnose zero-fill as shift behavior.

**Examples.**

1. `ROL(1001,1) in 4 bits.` Answer `0011`. Level 1.
2. `ROR(1011 0010,3) in 8 bits.` Answer `0101 0110`. Level 3.
3. `ROL(0xA1,10) in 8 bits.` Answer `0x86`; `10 mod 8=2`. Level 4.

**Validation and coverage.** Compare formula with repeated one-bit rotations. Balance direction, normalized counts, and wrapped-bit values.

### Family `rotate_inverse_and_count`

**Learner task.** Find an inverse direction/count or a unique count mapping source to target.

**Response mode.** Integer input or ordered pair `{direction}, {count}`.

**Template.** `Find the smallest k in 1..{width-1} such that ROL({source}, k) = {target}.`

**Derivation.** Enumerate counts. Inverse identity: `ROL(x,k) = ROR(x,n-k)` for normalized nonzero `k`.

**Constraints and rejection.** Unique-count questions require an aperiodic source under rotation. Reject sources with a rotational period smaller than width. Equivalent-operation questions must specify smallest non-negative count.

**Difficulty.** Level 2 gives direction and asks inverse count. Level 3 finds unique count. Level 4 uses equivalent counts over width. Level 5 compares rotate and shift.

**Feedback.** Show the ring movement and equivalence modulo width.

**Examples.**

1. `The inverse of ROL(x,3) in 8 bits is ROR(x, ?).` Answer `3`. Level 2.
2. `Find k: ROL(1001 0111,k)=1111 0010.` Answer `5`. Level 3.
3. `Give smallest non-negative k: ROR(x,19)=ROR(x,k) for 8-bit x.` Answer `3`. Level 4.

**Validation and coverage.** Enumerate all counts, assert uniqueness where promised, and test inverse identity. Direct rotate items should not exceed 60% after mastery.

## 4.4 Subcategory: Mask Construction

### Skill, operation, misconceptions, and scope

Translate selected positions or an inclusive range into an exact-width mask before choosing an operation. Misconceptions include one-indexed positions, swapping `hi`/`lo`, using range width `hi-lo`, putting ones outside the field, and confusing a mask with an already-masked value.

### Family `construct_mask`

**Learner task.** Construct one of: a single-bit mask, a set-of-positions mask, a contiguous range mask, or its width-bounded inverse.

**Response mode.** Exact-width binary or hex pattern.

**Templates.**

- `Create a {width}-bit mask selecting bit {position}.`
- `Create a {width}-bit mask selecting bits {positions}.`
- `Create a {width}-bit mask selecting inclusive field {hi}..{lo}.`
- `Create the {width}-bit inverse of that mask.`

**Derivation.** Single `1<<p`; set is bitwise OR over positions; range is `((1<<(hi-lo+1))-1)<<lo`; inverse is `mask(width) XOR selection`.

**Constraints and rejection.** Position set is unique, sorted for display, size `2..min(6,n-1)`, and not accidentally contiguous when testing non-contiguous construction. Range width is at least 2 for range variants. Include edge-touching and interior ranges. Exact-width output is mandatory.

**Difficulty.** Level 1 single bit. Level 2 multiple positions and short ranges. Level 3 ranges crossing nibble boundaries. Level 4 inverse masks and hex output. Level 5 reconstructs positions/range from a mask.

**Feedback.** Render a bit-position ruler. For ranges, show width calculation and shifted run of ones. Diagnose off-by-one and reversed indexing.

**Examples.**

1. `Create an 8-bit mask for bit 5.` Answer `0010 0000` / `0x20`. Level 1.
2. `Create an 8-bit mask for bits {0,3,6}.` Answer `0100 1001` / `0x49`. Level 2.
3. `Create the 16-bit inverse mask for field 10..6.` Answer `0xF83F`; field mask is `0x07C0`. Level 4.

**Validation and coverage.** Verify selected bits exactly equal the requested set. Cross-check range popcount and endpoints. Balance each bit-position quartile, field width, boundary touch, and mask form.

## 4.5 Subcategory: Mask Application and Flags

### Skill, operation, misconceptions, and scope

Choose and apply the correct operator separately from constructing the mask, and distinguish Boolean predicates over masked bits. Misconceptions include using OR to toggle, XOR to set, forgetting width-bounded NOT when clearing, returning `x&mask` when a Boolean is requested, and equating any/all/exact tests.

### Family `apply_mask`

**Learner task.** Set, clear, toggle, or extract selected bits of a value using a supplied mask.

**Response mode.** Exact-width pattern.

**Template.** `In {width} bits, {operation} mask {mask} on value {value}. Give the resulting pattern.` “Extract” here returns `value & mask` without right alignment; right-aligned fields belong to bit fields.

**Derivation.** Set `x|m`; clear `x & (mask(n)^m)`; toggle `x^m`; extract `x&m`.

**Constraints and rejection.** The supplied mask is nonzero and not all ones. For set/clear, at least one selected bit changes; for toggle, at least two selected bits when possible; for extract, selected set and clear source bits both appear over recent coverage. Reject no-effect items except explicit misconception diagnostics.

**Difficulty.** Level 1 single-bit binary mask. Level 2 multi-bit binary. Level 3 hex value/mask. Level 4 names desired effect but omits operator. Level 5 composes two operations only when the order matters.

**Feedback.** Show `value`, `mask`, actual expression, and result aligned. If answer matches another operation, name it.

**Examples.**

1. `Set mask 0000 0100 on 1010 0001.` Answer `1010 0101`. Level 1.
2. `Clear mask 0011 1000 on 1011 1101.` Answer `1000 0101`. Level 2.
3. `Toggle 0x0F0F in 0xA55A.` Answer `0xAA55`. Level 3.

**Validation and coverage.** Check identities: unrelated bits unchanged; set-selected all one; clear-selected all zero; toggle-selected inverted. Balance operation and changed-bit count.

### Family `test_masked_flags`

**Learner task.** Evaluate a precisely named bit predicate: single, any, all, or exact masked equality.

**Response mode.** Yes/no.

**Templates.**

- `Is bit {position} set in {value}?`
- `Are any bits selected by {mask} set in {value}?`
- `Are all bits selected by {mask} set in {value}?`
- `Do bits selected by {mask} exactly equal {expectedMaskedPattern} in {value}?`

**Derivation.** Single `x&(1<<p)!=0`; any `x&m!=0`; all `x&m==m`; exact `x&m==expected`, with precondition `expected & ~m == 0`.

**Instance construction.** Construct truth classes: none set, some-but-not-all, all set. The same `(value,mask)` should sometimes be reused across separate any/all diagnostic items, never simultaneously in a way that leaks the answer.

**Constraints and rejection.** Multi-bit any/all masks have popcount at least 2. Balance yes/no for each predicate. Exact expected pattern must contain at least one set and one clear selected bit at advanced levels. Wording must never say only “test with `&`.”

**Difficulty.** Level 1 single bit. Level 2 any/all with binary mask. Level 3 interleaves any and all on similar cases. Level 4 exact masked equality. Level 5 chooses the predicate matching a requirement.

**Feedback.** Always show `x & mask`, then compare it with `0`, `mask`, or `expected` as appropriate. If an “all” answer matches “any,” say so directly.

**Examples.**

1. `Is bit 7 set in 0xA4?` Answer `yes`; `0xA4 & 0x80 = 0x80`. Level 1.
2. `Are all bits in mask 0011 0000 set in 1010 0000?` Answer `no`; masked result `0010 0000` is nonzero but not the whole mask. Level 3; any/all distinction.
3. `Under mask 0x0F0F, do 0xA53A's selected bits equal 0x050A?` Answer `yes`; both masked selected pattern and expected are `0x050A`. Level 4.

**Validation and coverage.** Recompute predicates and assert exact expected is a subset of mask. Cross-tab predicate, answer, and none/some/all class.

### Family `list_or_decode_flags`

**Learner task.** Convert between a flag pattern and the set of active bit positions.

**Response mode.** Position list or exact-width pattern.

**Template.** `List all set bit positions in {width}-bit {value}.` or `Create the flags pattern for positions {positions}.`

**Derivation.** Enumerate positions `0..n-1`, or OR their single-bit masks.

**Constraints and rejection.** Pattern-to-list uses popcount `1..min(8,n-1)` normally; empty/all sets are rare diagnostics. At widths above 16 use hex input and sparse sets. Do not duplicate `construct_mask` too heavily: this family is primarily a position-decoding diagnostic.

**Difficulty.** Level 1 4–8-bit binary. Level 2 hex input. Level 3 sparse 16–64-bit. Level 4 mixed with a named reserved-bit range to ignore.

**Feedback.** Show the position ruler and corresponding powers.

**Examples.**

1. `List set positions in 8-bit 0100 1001.` Answer `0,3,6`. Level 1.
2. `List set positions in 0xA1.` Answer `0,5,7`. Level 2.
3. `Create 32-bit flags for positions 1, 16, 31.` Answer `0x80010002`. Level 3.

**Validation and coverage.** Round-trip set ↔ pattern; reject out-of-range/duplicate requested positions. Balance low/high positions and popcount.

## 4.6 Subcategory: Bit-Field Extraction and Insertion

### Skill, operation, misconceptions, and scope

Combine range width, masking, and shifting to manipulate contiguous fields. Misconceptions include shifting in the wrong direction, forgetting to right-align extracted values, not clearing destination bits before insertion, allowing an oversized field value to leak, and modifying unrelated bits.

Fields satisfy `n>hi>=lo>=0`, widths `2..min(12,n)`, container widths `8,12,16,24,32`. Larger containers use hex. Values inserted must fit unless the family explicitly asks a fit question.

### Family `extract_field`

**Learner task.** Extract inclusive bits `hi..lo` and right-align them.

**Response mode.** Exact field-width binary or minimum-width hex pattern.

**Template.** `Extract bits {hi}..{lo} from the {containerWidth}-bit value {source}; return the {fieldWidth}-bit field right-aligned.`

**Derivation.** `fieldWidth=hi-lo+1`; `answer=(source>>lo)&(2^fieldWidth-1)`.

**Constraints and rejection.** Field should contain both bit values in at least 70% of items. Include fields touching low/high edges and crossing nibble boundaries. Reject ambiguous output width.

**Difficulty.** Level 1 nibble-aligned field. Level 2 nonzero `lo`. Level 3 crosses nibble boundary. Level 4 mixed hex input/binary output. Level 5 signed interpretation of extracted field after extraction.

**Feedback.** Highlight selected source bits, shift them right by `lo`, then mask to field width.

**Examples.**

1. `Extract bits 7..4 from 0xD6.` Answer `1101` / `0xD`. Level 1.
2. `Extract bits 6..3 from 0xD6.` Answer `1010`; `(0xD6>>3)&0xF`. Level 2.
3. `Extract bits 12..5 from 0xB6D3.` Answer `0xB6`; selected field crosses displayed nibble boundaries. Level 3.

**Validation and coverage.** Independently derive by slicing the exact binary string. Assert field answer fits its width and round-trips when shifted back under the field mask.

### Family `insert_field`

**Learner task.** Replace destination field `hi..lo` with a fitting value while preserving all other bits.

**Response mode.** Exact container-width pattern.

**Template.** `In {containerWidth}-bit {destination}, replace bits {hi}..{lo} with {fieldValue} ({fieldWidth} bits).`

**Derivation.** `fieldMask=((1<<w)-1)<<lo`; `answer=(destination & ~fieldMaskWithinN) | ((fieldValue<<lo)&fieldMask)`.

**Constraints and rejection.** Field value fits exactly; its high bit is sometimes zero to test width preservation. Existing destination field must differ from new field in at least two positions unless width is 1. Both set and clear changes should occur in at least half of items. Unrelated bits must remain nontrivial.

**Difficulty.** Level 2 nibble-aligned replacement. Level 3 nonaligned binary. Level 4 hex container and binary field. Level 5 asks for the two intermediate masks or completes a missing expression.

**Feedback.** Show old destination, clear mask/result, shifted new field, and combined result. Diagnose OR-without-clear when the answer matches that error.

**Examples.**

1. `In 0x93, replace bits 5..2 with 1010.` Answer `0xAB`; clear field then insert `0x28`. Level 2.
2. `In 1101 0110, replace bits 6..4 with 001.` Answer `1001 0110`. Level 3.
3. `In 0xA55A, replace bits 11..5 with 0b1010011.` Answer `0xAA7A`. Level 4.

**Validation and coverage.** Assert extracted answer field equals inserted value and `(answer & ~fieldMask)==(destination & ~fieldMask)`. Compute the OR-without-clear distractor and ensure it differs when used.

### Family `field_fit`

**Learner task.** Decide whether an unsigned value fits in a declared contiguous field.

**Response mode.** Yes/no.

**Template.** `Does unsigned {value} fit in inclusive field {hi}..{lo}?`

**Derivation.** Field width is `hi-lo+1`; fit iff `0 <= value < 2^width`.

**Constraints and rejection.** Construct values from maximum plus offsets `-2,-1,0,+1,+2`, where offset zero refers to the maximum. Balance yes/no. Broad obvious values are limited to introductory practice.

**Difficulty.** Level 1 states field width and formula. Level 2 requires inferring width. Level 3 presents value in hex/binary. Level 4 compares the same value against two candidate fields.

**Feedback.** Name field width, maximum, and boundary comparison. Diagnose use of `hi-lo`.

**Examples.**

1. `Does 15 fit in bits 6..3?` Answer `yes`; width 4, max 15. Level 1.
2. `Does 32 fit in bits 7..3?` Answer `no`; width 5, max 31. Level 2.
3. `Does 0x100 fit in bits 12..5?` Answer `no`; width 8, max `0xFF`. Level 3.

**Validation and coverage.** Compare with exact power boundary; assert the same value encodes in `width` bits iff expected yes. Balance width and boundary offsets.

### Family `field_expression`

**Learner task.** Select the expression that correctly extracts or inserts a field under the specification's abstract fixed-width semantics.

**Response mode.** Single-choice.

**Templates.** `Which expression extracts bits {hi}..{lo} right-aligned from {width}-bit x?` and `Which expression replaces bits {hi}..{lo} of x with fitting value v?`

**Derivation.** Extract: `(x >> lo) & ((1 << fieldWidth)-1)`. Insert: `(x & ~fieldMask) | ((v << lo) & fieldMask)`, with NOT bounded to the container width.

**Constraints and rejection.** Choices use the exact generated range and width; simplify only when `lo=0`. Use mathematical pseudocode or width-safe literal masks, not host-language expressions whose shift could overflow.

**Multiple-choice distractors.** Use `hi-lo` instead of `+1`, shift by `hi`, apply an unshifted mask before shifting, omit destination clear, or omit the inserted-value mask. Evaluate candidates and reject any instance where a distractor is semantically equivalent over the declared domain.

**Difficulty.** Level 3 extraction with literal mask. Level 4 insertion. Level 5 diagnoses one flawed expression or constructs a missing mask subexpression.

**Feedback.** Name the operation order and evaluate each choice on the displayed example value after submission.

**Examples.**

1. `Which extracts bits 9..5 right-aligned?` Answer `(x >> 5) & 0x1F`; width is 5. Level 3.
2. `Which extracts bits 10..4 right-aligned?` Answer `(x >> 4) & 0x7F`; width is 7. Level 3.
3. `Which replaces bits 6..3 with fitting v in 8-bit x?` Answer `(x & ~0x78) | ((v << 3) & 0x78)`. Level 4.

**Validation and coverage.** Evaluate each extraction choice over all inputs for containers through 12 bits and randomized inputs above that. For insertion, vary both `x` and every fitting `v`; require only one choice to preserve unrelated bits and reproduce the field.

### Cross-family progression for Bit Manipulation

Teach direct bitwise logic before shifts, then rotations. Mask construction must precede application; single-bit application precedes multi-bit predicates. `test-any` and `test-all` should be deliberately interleaved on some/ not-all patterns. Introduce fields only after range masks and shifts are reliable.

After mastery, interleave mask and field operations, but retain family identity in telemetry. If an insertion fails, diagnose in this order: field width/range, mask construction, shift alignment, destination clearing, and final OR. Do not merely reduce container width.

## 5. Category: Address, Layout, and Bit-Count Reasoning

### Category purpose

Train the programmer-facing arithmetic that connects powers of two and bit patterns to abstract byte addresses, boundaries, supplied data layouts, set-bit counts, and mask shapes. The learner should recognize low-bit structure and use it to avoid unnecessary long arithmetic while preserving exact units and range conventions.

### Learn

Programmer landmarks often appear as a `1` followed by zero hexadecimal digits: `0x10 = 16`, `0x100 = 256`, `0x1000 = 4096`, and `0x10000 = 65536`. One less than such a boundary is a run of hexadecimal `F` digits.

An address plus an offset is ordinary integer addition. For a positive power-of-two boundary `A`, an address is aligned when its remainder on division by `A` is zero. If `r = address mod A`, aligning down subtracts `r`; aligning up adds `0` when `r = 0`, otherwise `A-r`. The same remainder is the byte offset within any explicitly sized word, cache line, or page.

A range `[start, start+length)` touches addresses through `start+length-1`. It crosses a boundary of size `B` exactly when its first and last touched bytes have different containing-unit bases.

For bit patterns, population count or Hamming weight is the number of `1` bits. A one-hot mask has exactly one set bit. This category calls a nonzero multi-bit mask contiguous when all its `1` bits form one uninterrupted run. It calls a mask sparse only under the explicit threshold stated below. Two width-bounded masks are complementary when every bit set in one is clear in the other and vice versa.

Examples:

```text
0x1237 aligned down to 16 bytes = 0x1230
0x1237 aligned up to 16 bytes   = 0x1240
popcount(0xB4) = popcount(1011 0100) = 4
```

Address answers are numeric values, so leading zeroes do not carry width. Every word, cache-line, page, array-element, record-field, and padding size used by a question is supplied by that question.

### Prerequisites

- `power_relation`, `power_landmark`, and binary/hex grouping;
- non-negative addition and subtraction for address arithmetic;
- `construct_mask` before advanced mask-shape and remainder-expression variants;
- multiplication by small supplied element sizes before array-offset variants.

The landmark, direct address-addition, and direct population-count families may begin once Representation Level 2 is stable. Alignment and power-of-two remainder require reliable powers-of-two recognition. Supplied-layout composition requires base-plus-offset arithmetic.

### Category boundaries

Addresses are abstract byte indices, not pointers. No family may depend on object validity, allocation, provenance, aliasing, address-width wraparound, or language semantics. Alignment is an arithmetic predicate only and says nothing about whether an access is allowed or fast.

The names “word,” “cache line,” and “page” identify explicitly sized boundary units only. They do not imply architecture defaults, virtual-memory translation, cache behavior, or performance. Record layouts never infer padding or alignment: offsets are derived only from stated sizes, explicit offsets, and entries literally labeled padding.

Endianness and reconstruction of stored byte values belong to Memory Representation. Bit-field positions inside an integer belong to Bit Manipulation. General division and arbitrary moduli remain excluded.

### Subcategories in order

1. Programmer Landmarks and Address Arithmetic
2. Power-of-Two Alignment and Padding
3. Explicit Units and Boundary Crossing
4. Supplied Array and Record Layouts
5. Population Counts, Mask Shapes, and Power-of-Two Remainders

### Common misconceptions across the category

- Reading hexadecimal address digits as decimal digits.
- Dropping a carry between hexadecimal digits when adding an offset.
- Returning the final address when the question asks for an offset or distance.
- Treating “aligned to `A`” as “contains the digit `A`” rather than remainder zero.
- Always moving to the next boundary when align-up receives an already aligned address.
- Using the current remainder as align-up padding instead of `A-remainder`.
- Treating a range ending exactly at a boundary as crossing it.
- Testing the exclusive end address instead of the last touched address.
- Assuming unstated word, cache-line, page, or record-layout rules.
- Counting hexadecimal digits rather than the `1` bits represented by them.
- Treating any low-popcount mask as one-hot or any visually grouped ones as contiguous.
- Using `2^k` rather than `2^k-1` as a remainder mask.

## 5.1 Subcategory: Programmer Landmarks and Address Arithmetic

### Family `programmer_landmark`

**Learner task.** Convert or recognize exact power-of-two and one-less-than-power-of-two landmarks in decimal and hexadecimal.

**Relationship to skill.** These landmarks make later boundary, page-offset, mask, and address calculations retrieval-plus-adjustment tasks rather than repeated base conversion.

**Response mode.** Decimal-number input or hexadecimal numeric input.

**Preferred templates.**

- `Write decimal {decimalValue} in hexadecimal.`
- `Write hexadecimal {hexValue} in decimal.`
- `{value} is one less than which power-of-two boundary? Give the boundary in {answerRepresentation}.`

**Derivation.** Choose `k` from `4..32`. The exact landmark is `2^k`; the adjacent lower landmark is `2^k-1`. Direct cross-base prompts concentrate on `k` divisible by four and the additional familiar cases `k = 10, 20, 30`. Format the exact integer in the requested base.

**Constraints and rejection.** At Levels 1–2, use the core set `16, 256, 1024, 4096, 65536` and their hex forms. Higher levels may use `2^k`, `2^k-1`, or a small landmark multiple whose nonzero hex digits are at most two. Reject long general conversion, values with more than three nonzero hex digits, and prompts already answered verbatim by their notation.

**Difficulty dimensions.** Direction of conversion, exact versus one-less boundary, decimal versus hex cue, exponent divisible by four or not, and adjustment from a recalled landmark.

**Difficulty.** Level 1 uses exact core landmarks. Level 2 interleaves both directions and one-less values such as `255/0xFF`. Level 3 uses `2^10`, `2^20`, and small multiples. Level 4 asks for the adjacent boundary or combines a landmark with a small stated adjustment.

**Feedback.** Show the power relationship and hexadecimal digit grouping. Diagnose answers off by one as confusion between a boundary and its largest lower value; diagnose decimal-looking hex transcription separately.

**Examples.**

1. `Write decimal 256 in hexadecimal.` Answer `0x100`; `256 = 2^8`. Level 1.
2. `Write hexadecimal 0x1000 in decimal.` Answer `4096`; `0x1000 = 2^12`. Level 2.
3. `65535 is one less than which power-of-two boundary? Give the boundary in hexadecimal.` Answer `0x10000`; `65535 = 2^16-1`. Level 3.

**Validation and coverage.** Parse both representations and assert exact equality. Across 100 items, include every core landmark in both directions, at least 25 one-less cases, both divisible-by-four and non-divisible exponents, and no more than 15% small-multiple variants.

### Family `base_address_offset`

**Learner task.** Compute an abstract byte address from a supplied base address and signed or unsigned byte offset.

**Relationship to skill.** Repeated base-plus-offset calculation establishes the primitive used by arrays, fields, load windows, and boundary questions.

**Response mode.** Decimal or hexadecimal numeric input in the representation requested by the prompt.

**Preferred templates.**

- `Base address {base} plus byte offset {offset} gives what address? Answer in {answerRepresentation}.`
- `Starting at address {base}, move {magnitude} bytes {direction}. What address is reached?`

**Derivation.** `answer = base + offset`, where `{offset}` is an integer. “Forward” uses a positive offset and “back” uses its negative. Generate only cases with `answer >= 0`.

**Constraints and rejection.** Levels 1–2 use non-negative offsets. Signed offsets begin at Level 3 and must display an explicit sign or direction. Hex questions should exercise low-digit carry or borrow in 40–60% of items, but reject chains longer than four hex digits and arithmetic dominated by decimal conversion. No wrapping or fixed address width is implied.

**Difficulty.** Level 1 uses same-base small decimal offsets or nibble-aligned hex offsets. Level 2 includes one or two hex carries. Level 3 includes backward displacement and mixed decimal/hex presentation with an explicit answer base. Level 4 uses a landmark base plus a near-boundary offset.

**Feedback.** Align base and offset in the working base, preserve the requested unit, and show each carry or borrow. If the answer equals the offset, diagnose omission of the base; if it equals `base-offset` for a forward prompt, diagnose direction.

**Examples.**

1. `Base address 0x1000 plus byte offset 0x34 gives what address? Answer in hexadecimal.` Answer `0x1034`. Level 1.
2. `Base address 8192 plus byte offset 96 gives what address? Answer in decimal.` Answer `8288`. Level 2.
3. `Starting at address 0x2040, move 0x58 bytes back. What address is reached?` Answer `0x1FE8`. Level 3.

**Validation and coverage.** Recompute with arbitrary-precision signed integers and resubtract the base to recover the offset. Cross-tab direction, answer base, carry/borrow presence, and landmark proximity; mutate the base while retaining the offset and verify the answer changes by the same amount.

### Family `address_distance`

**Learner task.** Compute either the non-negative byte distance between ordered addresses or the signed displacement from one address to another, as explicitly requested.

**Relationship to skill.** This is the inverse of base-plus-offset arithmetic and prevents conflating addresses with lengths.

**Response mode.** Decimal or hexadecimal integer input.

**Preferred templates.**

- `How many bytes from lower address {low} to higher address {high}? Answer in {answerRepresentation}.`
- `What signed byte displacement takes address {from} to address {to}? Answer in {answerRepresentation}.`

**Derivation.** Ordered distance is `high-low` with precondition `high >= low`. Signed displacement is `to-from`. The inverse check is `from + displacement = to`.

**Constraints and rejection.** Wording must distinguish non-negative distance from signed displacement. Use differences `1..65536`; larger displayed addresses are allowed only when common high prefixes cancel cleanly. Reject subtraction requiring long unrelated decimal work or any item where address order is visually ambiguous.

**Difficulty.** Level 1 subtracts within one small block. Level 2 crosses a hex digit or landmark boundary. Level 3 mixes display and answer bases. Level 4 uses signed backward displacement or asks for a missing endpoint.

**Feedback.** Cancel common high address digits when useful, subtract endpoints, and verify by adding the result back. Diagnose reversed subtraction by sign and diagnose inclusive counting (`+1`) as confusion between address distance and number of addresses in an inclusive list.

**Examples.**

1. `How many bytes from lower address 0x1080 to higher address 0x1200? Answer in hexadecimal.` Answer `0x180`. Level 1.
2. `How many bytes from lower address 0x4000 to higher address 0x4C00? Answer in decimal.` Answer `3072`. Level 2.
3. `What signed byte displacement takes address 0x2020 to address 0x1FF0? Answer in decimal.` Answer `-48`. Level 3.

**Validation and coverage.** Assert endpoint order for distance variants, recompute subtraction independently, and verify the inverse addition. Balance borrow/no-borrow, forward/backward signed displacement, power-of-two distances, and non-landmark ordinary distances.

## 5.2 Subcategory: Power-of-Two Alignment and Padding

### Family `alignment_predicate`

**Learner task.** Decide whether an address is aligned to an explicitly supplied power-of-two byte boundary.

**Relationship to skill.** This isolates the zero-remainder/zero-low-bits test before the learner must calculate a new address or padding.

**Response mode.** Yes/no.

**Template.** `Is address {address} aligned to a {alignment}-byte boundary?`

**Derivation.** Compute `remainder = address mod alignment`; answer yes exactly when `remainder = 0`. Equivalently, for `alignment=2^k`, the low `k` address bits are all zero.

**Constraints and rejection.** `{alignment}` is one of `2,4,8,...,4096` and is always printed. Construct 50% aligned and 50% unaligned cases. Unaligned remainders must cover `1`, `alignment-1`, and ordinary interior values. Reject decimal items where digit appearance alone is a reliable alignment rule.

**Difficulty.** Level 1 uses 2–16-byte alignment with binary or simple hex suffixes. Level 2 uses 32–256. Level 3 mixes decimal and hex addresses. Level 4 contrasts two supplied alignments for one address.

**Feedback.** Show either the remainder or the low `k` bits. If the learner checks divisibility by the exponent `k`, name the required divisor `2^k`; if they infer a stronger alignment from a weaker one in the wrong direction, show both remainders.

**Examples.**

1. `Is address 0x1230 aligned to a 16-byte boundary?` Answer `yes`; the low hex digit is zero. Level 1.
2. `Is address 4100 aligned to an 8-byte boundary?` Answer `no`; `4100 mod 8 = 4`. Level 2.
3. `Is address 0x12C0 aligned to a 64-byte boundary?` Answer `yes`; `0x12C0 mod 0x40 = 0`. Level 3.

**Validation and coverage.** Compare exact remainder with a low-bit-mask test using `alignment-1`. Cross-tab answer, representation, exponent, and remainder class. Verify the implication that alignment to a larger supplied power of two implies alignment to every smaller supplied divisor used in contrast items.

### Family `align_power_two`

**Learner task.** Find the aligned address at or below, or at or above, a supplied address.

**Relationship to skill.** The family turns the alignment predicate into constructive boundary finding and distinguishes “at or above” from “strictly above.”

**Response mode.** Numeric input or two named fields `down` and `up`.

**Preferred templates.**

- `Align address {address} down to a {alignment}-byte boundary.`
- `Align address {address} up to a {alignment}-byte boundary.`
- `For address {address} and {alignment}-byte alignment, give down and up.`

**Derivation.** Let `r = address mod alignment`. `down = address-r`. `up = address` when `r=0`, otherwise `address+(alignment-r)`. Both are numeric addresses, not fixed-width patterns.

**Constraints and rejection.** Alignment is explicitly supplied and power-of-two. Include already aligned addresses in 20–30% of align-up items. Reject instances where “up” could be misread as the next strictly greater boundary; the Learn text and feedback must repeat “at or above.”

**Difficulty.** Level 1 aligns down with 4–16-byte boundaries. Level 2 aligns up and includes already aligned cases. Level 3 returns both endpoints for 32–256-byte boundaries. Level 4 mixes decimal/hex or uses addresses just below and just above a major landmark.

**Feedback.** Show `r`, then subtract it for down or add the required complement for up. Diagnose always adding a full alignment on an already aligned input and diagnose swapping the two endpoints.

**Examples.**

1. `Align address 0x1237 down to a 16-byte boundary.` Answer `0x1230`; remainder is `7`. Level 1.
2. `Align address 0x1230 up to a 16-byte boundary.` Answer `0x1230`; it is already aligned. Level 2.
3. `For address 0x1F3A and 256-byte alignment, give down and up.` Answer `down = 0x1F00, up = 0x2000`. Level 3.

**Validation and coverage.** Assert both results are multiples of alignment, `down <= address <= up`, and no closer qualifying multiples exist. Cross-check `address-down` and `up-address` against the remainder formulas. Cover zero, one, maximum, and interior remainder classes.

### Family `alignment_padding`

**Learner task.** Calculate the number of padding bytes required so the next address is aligned to a supplied boundary.

**Relationship to skill.** Padding is the distance from the current remainder to the next boundary, connecting alignment to layout-size reasoning.

**Response mode.** Non-negative decimal or hexadecimal integer input.

**Template.** `The next free address is {address}. How many padding bytes are required for {alignment}-byte alignment? Answer in {answerRepresentation}.`

**Derivation.** Let `r = address mod alignment`; `padding = 0` if `r=0`, otherwise `alignment-r`. Equivalently, `padding = (alignment-r) mod alignment` over non-negative integers.

**Constraints and rejection.** Generate all remainder classes constructively. Padding zero must occur in 20–30% of items, not disappear as a “trivial” case. No family may claim the padding is required by an ABI; it is required only by the alignment condition stated in the prompt.

**Difficulty.** Level 1 uses small alignment and decimal addresses. Level 2 uses hex suffix reasoning. Level 3 derives the next free address from `base + supplied size` first. Level 4 compares candidate layouts only by their explicitly requested padding.

**Feedback.** Show current remainder, distance to the next multiple, and the aligned result. If the learner returns the remainder, contrast bytes already past the boundary with bytes still needed.

**Examples.**

1. `The next free address is 0x1003. How many padding bytes are required for 4-byte alignment?` Answer `1`. Level 1.
2. `The next free address is 8190. How many padding bytes are required for 16-byte alignment?` Answer `2`. Level 2.
3. `The next free address is 0x21A6. How many padding bytes are required for 64-byte alignment? Answer in hexadecimal.` Answer `0x1A`; the next boundary is `0x21C0`. Level 3.

**Validation and coverage.** Assert `(address+padding) mod alignment = 0`, `0 <= padding < alignment`, and minimality. Cross-tab zero/nonzero, small/max/interior padding, representation, and whether the free address was direct or derived.

## 5.3 Subcategory: Explicit Units and Boundary Crossing

### Family `unit_offset_boundary`

**Learner task.** Find an address's byte offset within, containing base for, or containing interval of an explicitly sized word, cache line, or page.

**Relationship to skill.** Applying one remainder decomposition across several role labels reinforces that the supplied size, not architectural folklore, determines the answer.

**Response mode.** Numeric input or named numeric fields `offset`, `base`, and optionally `nextBoundary`.

**Preferred templates.**

- `A {role} is {unitSize} bytes. What is the byte offset of address {address} within its containing {role}?`
- `A {role} is {unitSize} bytes. Give the base address of the {role} containing {address}.`
- `A {role} is {unitSize} bytes. Give the containing half-open interval [base, nextBoundary) for address {address}.`

**Derivation.** `offset = address mod unitSize`; `base = address-offset`; `nextBoundary = base+unitSize`. The containing unit is `[base,nextBoundary)`, including when `address=base`.

**Constraints and rejection.** `{role}` is `word`, `cache line`, or `page`; `{unitSize}` is always printed and is a power of two. Typical generation sets are word `2..16`, cache line `16..256`, and page `256..65536`, but these are exercise ranges, not machine defaults. Do not infer any access, translation, or performance property from the role.

**Difficulty.** Level 1 asks only offset with small sizes. Level 2 asks base or interval. Level 3 uses 64–4096-byte units and mixed representations. Level 4 asks multiple named fields or compares the same address under two explicitly different unit sizes.

**Feedback.** Show quotient grouping only as repeated boundary chunks when useful; the preferred mental method is low-bit/hex-suffix remainder followed by subtraction. Diagnose returning the absolute address instead of within-unit offset and diagnose using an unstated “standard” size.

**Examples.**

1. `A word is 4 bytes. What is the byte offset of address 0x103B within its containing word?` Answer `3`. Level 1.
2. `A cache line is 64 bytes. Give the base address of the cache line containing 0x12D5.` Answer `0x12C0`; offset is `0x15`. Level 2.
3. `A page is 4096 bytes. Give base and nextBoundary for the containing half-open interval of address 0x2345.` Answer `base = 0x2000, nextBoundary = 0x3000`. Level 3.

**Validation and coverage.** Assert `address = base+offset`, `0 <= offset < unitSize`, both boundaries are multiples of unit size, and interval membership holds. Cross-tab role independently from size, boundary/interior offset class, requested output, and representation.

### Family `range_crosses_boundary`

**Learner task.** Decide whether a positive-length abstract byte range crosses a boundary of an explicitly supplied unit size.

**Relationship to skill.** This composes half-open range endpoints with containing-unit reasoning and targets the common exclusive-end off-by-one error.

**Response mode.** Yes/no; advanced variants may add the first crossed boundary as a named numeric field.

**Template.** `A {role} is {unitSize} bytes. Does byte range [{start}, {endExclusive}) cross a {role} boundary?`

**Placeholder derivation.** Generate `{length} > 0`; `{endExclusive} = start+length`. Display both endpoints or display `{start}` and `{length}`, but always name the half-open convention. `last = endExclusive-1`. The answer is yes iff `floor(start/unitSize) != floor(last/unitSize)`.

**Constraints and rejection.** Construct rather than sample 50% crossing and 50% non-crossing cases. Include ranges ending exactly at a boundary, starting exactly at a boundary, crossing by one byte, and crossing more than one boundary. Limit length arithmetic so boundary reasoning remains central.

**Difficulty.** Level 1 uses small units and displays start plus length. Level 2 displays half-open endpoints and includes exact-end cases. Level 3 uses hex addresses and page/cache-line labels with supplied sizes. Level 4 asks how many unit boundaries are crossed or for the first boundary after the Boolean decision.

**Feedback.** Identify the first and last touched bytes and their containing bases. If the learner tests `endExclusive`, show why that byte is not part of the range; if they treat any boundary endpoint as a crossing, contrast a range ending exactly there.

**Examples.**

1. `A cache line is 64 bytes. Does byte range [0x1030, 0x1040) cross a cache-line boundary?` Answer `no`; the last touched byte is `0x103F`. Level 2.
2. `A cache line is 64 bytes. Does the 16-byte range starting at 0x1038 cross a cache-line boundary?` Answer `yes`; it touches through `0x1047`. Level 2.
3. `A page is 4096 bytes. Does the 4-byte range starting at 8190 cross a page boundary?` Answer `yes`; it touches addresses on both sides of `8192`. Level 3.

**Validation and coverage.** Compare containing-base derivation with an independent interval enumeration for bounded test cases. If boundary count is requested, compute `floor(last/unitSize)-floor(start/unitSize)`. Cross-tab answer, exact-end, exact-start, one-byte-over, multi-boundary, role, and representation classes.

## 5.4 Subcategory: Supplied Array and Record Layouts

### Family `supplied_layout_offset`

**Learner task.** Calculate an array element, record field, or array-of-record field byte offset/address from a completely supplied layout.

**Relationship to skill.** Repeated practice separates zero-based stride, explicit field displacement, and final base addition while making unstated layout rules irrelevant.

**Response mode.** Decimal or hexadecimal numeric input; intermediate `elementOffset` and `fieldOffset` may be separate named fields.

**Preferred templates.**

- `An array begins at {base}; each element is {elementSize} bytes. What is the byte offset of element index {index}?`
- `This record is laid out in the listed order with no implicit padding: {layout}. What is the byte offset of field {field}?`
- `Records of explicitly stated size {recordSize} form an array at {base}. Field {field} has supplied offset {fieldOffset}. What is the address of that field in element {index}?`

**Derivation.** Array element offset is `index*elementSize`. In a sequential record, a field offset is the sum of all preceding stated field and explicit-padding sizes. For an array-of-record field, `address = base + index*recordSize + fieldOffset`. Indexing is zero-based and stated in every prompt.

**Constraints and rejection.** Element sizes are `1..32`, indices `0..31`, record component counts `2..7`, and total arithmetic normally stays below 4096 bytes. A record is either explicitly sequential with no implicit padding, or supplies every field offset directly. Padding can affect an answer only when listed as an explicit entry. Reject any layout whose displayed offsets/sizes overlap, disagree with record size, omit a needed fact, or invite an ABI inference.

**Difficulty.** Level 1 asks direct array element offset with small products. Level 2 sums preceding record entries, including explicit padding. Level 3 composes array stride and field offset. Level 4 supplies selected offsets and asks for a missing address or verifies whether a field range fits inside the stated record size.

**Feedback.** Stage the calculation as `element contribution + field contribution`, and visually include explicit padding as an ordinary occupied byte range. Diagnose one-based indexing, multiplying the field offset by the index, omitting padding, and inventing padding.

**Examples.**

1. `A zero-indexed array has 6-byte elements. What is the byte offset of element index 5?` Answer `30`; `5*6`. Level 1.
2. `Record layout, sequential with no implicit padding: tag 1 byte, padding 3 bytes, count 4 bytes, payload 12 bytes. What is payload's byte offset?` Answer `8`; `1+3+4`. Level 2.
3. `An array begins at 0x1000. Each record is explicitly 24 bytes; field value has supplied offset 8. What is value's address in zero-based element 3?` Answer `0x1050`; `0x1000 + 3*24 + 8`. Level 3.

**Validation and coverage.** Build an explicit interval list and independently sum sizes. Assert all fields/padding fit without overlap and any stated record size contains them. Verify `answer-base = index*recordSize+fieldOffset`. Balance arrays, records, composed variants, index zero/nonzero, explicit padding present/absent, and decimal/hex answers.

## 5.5 Subcategory: Population Counts, Mask Shapes, and Power-of-Two Remainders

### Family `population_count`

**Learner task.** Count the set bits in a bounded binary or hexadecimal pattern.

**Relationship to skill.** Popcount supports mask density, one-hot checks, and compact reasoning about grouped hexadecimal patterns.

**Response mode.** Non-negative decimal integer input.

**Template.** `What is the population count (number of 1 bits) of the {width}-bit pattern {pattern}?`

**Derivation.** Count `1` bits in the exact-width binary representation. For hex, sum the known nibble weights: `0→0`, `1/2/4/8→1`, `3/5/6/9/A/C→2`, `7/B/D/E→3`, `F→4`.

**Constraints and rejection.** Direct binary uses widths `4..24`; direct hex uses `8..32`. Widths `48` and `64` appear only for sparse, repeated-nibble, or otherwise chunkable patterns. Exclude all-zero/all-one except diagnostics, and prevent uniform random generation from making middle counts dominate.

**Difficulty.** Level 1 counts 4–8 displayed bits. Level 2 uses two to four hex nibbles. Level 3 uses mixed-density nibbles and internal zero/F groups. Level 4 uses chunkable 32–64-bit patterns with repeated, sparse, or landmark nibble groups.

**Feedback.** Annotate each binary group or hex nibble with its local count and sum the subtotals. Diagnose counting nonzero hex digits, decimal digits, or bit positions rather than set bits.

**Examples.**

1. `What is the population count of the 8-bit pattern 1011 0100?` Answer `4`. Level 1.
2. `What is the population count of the 16-bit pattern 0xF00F?` Answer `8`; `4+0+0+4`. Level 2.
3. `What is the population count of the 64-bit pattern 0x8000000100000001?` Answer `3`. Level 4.

**Validation and coverage.** Compare exact binary-string counting with repeated `x &= x-1` on an arbitrary-precision non-negative integer. Stratify target popcounts into zero/one, low, middle, high, and all-one classes with extremes limited to diagnostics; cover every hex nibble value regularly.

### Family `mask_shape`

**Learner task.** Recognize a precisely defined one-hot, contiguous-run, sparse, or complementary mask shape.

**Relationship to skill.** Shape recognition compresses common masks into popcount, gap, and width-bounded complement relationships instead of visual guesswork.

**Response mode.** Yes/no, single-choice among non-overlapping constructed classes, or multiple named Boolean fields.

**Preferred templates.**

- `Is the {width}-bit mask {mask} one-hot (exactly one 1 bit)?`
- `Do all 1 bits in nonzero mask {mask} form one contiguous run?`
- `Under this question's rule, sparse means 2..{sparseMax} set bits with at least one zero gap between set bits. Is {mask} sparse?`
- `Are {left} and {right} complementary {width}-bit masks?`

**Derivation.** One-hot iff `mask != 0` and `popcount(mask)=1`. Contiguous iff `mask != 0` and the set-bit positions form every integer from lowest set position through highest set position. Sparse uses the exact prompt definition: `2 <= popcount <= sparseMax` and non-contiguous, where `sparseMax = min(4, floor(width/4))` and generated widths are at least 8. Complementary iff `left XOR right = 2^width-1`, equivalently both AND to zero and OR to the width mask.

**Constraints and rejection.** A single-choice taxonomy uses mutually exclusive constructed labels: one-hot; contiguous multi-bit; sparse under the stated rule; or other. Never ask for an unqualified “sparse” judgment. Complement questions always state width. Negative examples should be one edit away in at least half of items: an extra isolated bit, a one-bit gap, a missing complement bit, or a bit outside the visible width.

**Difficulty.** Level 1 uses one-hot yes/no. Level 2 contrasts one-hot with contiguous multi-bit masks. Level 3 introduces explicit sparse and gap cases. Level 4 uses complementary pairs and hex patterns. Level 5 asks multiple shape predicates where overlap is allowed and reports each Boolean separately.

**Multiple-choice distractors.** Use only the other defined shape labels plus `other`; never invent synonymous labels. Construct the instance so one-hot, contiguous multi-bit, sparse-under-definition, and other are mutually exclusive, then evaluate every label from set positions before shuffling.

**Feedback.** Give popcount and set positions, then apply the named shape definition. For complements, show width-bounded AND and OR or aligned opposite bits. Diagnose “one-hot means one nonzero digit,” ignored gaps, and unbounded complement assumptions.

**Examples.**

1. `Is the 8-bit mask 0x20 one-hot?` Answer `yes`; exactly bit 5 is set. Level 1.
2. `Do all 1 bits in nonzero mask 0011 1100 form one contiguous run?` Answer `yes`; bits `5..2` are set. Level 2.
3. `Are 0x0F0F and 0xF0F0 complementary 16-bit masks?` Answer `yes`; XOR is `0xFFFF`. Level 4.

**Validation and coverage.** Derive set positions independently from numeric predicates. Enumerate all masks through width 12 to verify shape classifiers and mutual exclusivity of choice variants. Cross-tab positive/negative, representation, popcount, edge-touching, one-gap, extra-bit, sparse threshold, and complement-error classes.

### Family `power_two_remainder`

**Learner task.** Compute a non-negative value's remainder modulo an explicitly supplied power of two or choose the low-bit shortcut that computes it.

**Relationship to skill.** This unifies alignment remainders, within-unit offsets, and low-bit masks without expanding into general modular arithmetic.

**Response mode.** Decimal/hex numeric input or single-choice.

**Preferred templates.**

- `What is non-negative {value} mod {modulus}? Answer in {answerRepresentation}.`
- `{modulus} = 2^{k}. Which low bits of {value} determine the remainder?`
- `Which mask computes x mod {modulus} for non-negative x under width {width}?`

**Derivation.** With `modulus = 2^k`, `remainder = value & (modulus-1)`, equal to the numeric value of the low `k` bits. The mask is `2^k-1`, formatted to the stated width when the answer is a pattern.

**Constraints and rejection.** Values are non-negative; modulus is one of `2,4,...,65536` and always stated. Numeric instances must have remainder in constructed classes `0`, `1`, `modulus-1`, and interior. Expression choices use abstract width-bounded operators, never a host language, and require a stated pattern width at least `k` for modulus `2^k`. General or negative modulo conventions are excluded.

**Difficulty.** Level 1 reads low binary bits for mod 2–16. Level 2 reads one or two low hex digits for mod 16/256. Level 3 handles non-nibble powers such as 8, 32, and 64. Level 4 chooses the correct mask or connects the remainder to an alignment/unit-offset question.

**Multiple-choice distractors.** Use mask `modulus` instead of `modulus-1`, retain `k+1` or `k-1` low bits, select high rather than low bits, or return the quotient-aligned value. Evaluate choices and reject accidental equivalence for the displayed domain.

**Feedback.** State `modulus=2^k`, retain exactly the low `k` bits, and show their value. Diagnose confusing the modulus with its mask and confusing remainder with align-down.

**Examples.**

1. `What is 77 mod 8?` Answer `5`; low three bits of `77` are `101`. Level 1.
2. `What is 0x12AB mod 256? Answer in hexadecimal.` Answer `0xAB`; retain the low eight bits. Level 2.
3. `Which 16-bit mask computes x mod 64 for non-negative x?` Answer `0x003F`; `64-1 = 63`. Level 4.

**Validation and coverage.** Compare low-bit masking with arbitrary-precision quotient/remainder arithmetic. For choice items, prove exactly one candidate works over every `x` in `0..2^min(width,12)-1` and randomized wider values. Balance exponent, nibble-aligned/nonaligned modulus, remainder class, response representation, and numeric/expression variants.

### Cross-family progression for Address, Layout, and Bit-Count Reasoning

Introduce `programmer_landmark`, direct `base_address_offset`, and `population_count` after basic representation. Follow base-plus-offset with `address_distance` as its inverse. Teach `alignment_predicate` before align-up/down, then derive `alignment_padding` from align-up distance. Introduce generic power-of-two remainder alongside alignment and only then apply the same operation to named word/cache-line/page units.

Range crossing requires reliable containing-boundary calculations and the half-open range convention. Direct arrays precede record-field sums; composed array-of-record questions wait for both layout offsets and base-plus-offset to be stable. One-hot recognition may accompany single-bit masks, but sparse and complementary shape variants wait for popcount and width-bounded masks.

After acquisition, interleave:

- `base_address_offset` with `address_distance`;
- `alignment_predicate`, `align_power_two`, `alignment_padding`, and `power_two_remainder` on related low-bit structures;
- `unit_offset_boundary` with `range_crosses_boundary`;
- `population_count` with `mask_shape`;
- direct layout offsets with address reconstruction.

If a range-crossing answer fails, diagnose in order: exclusive-end convention, last touched byte, within-unit offset, then containing bases. If a composed layout address fails, separately assess zero-based index multiplication, supplied field offset, and final base addition. Do not respond by introducing architecture rules or merely shrinking every number.

## 6. Category: Memory Representation

### Category purpose

Train reconstruction and storage of multi-byte integers from explicit address order, while preserving the invariant that byte order changes but bit order within a byte does not.

### Learn

Memory is a sequence of bytes. In big-endian storage, the most-significant byte is at the lowest address. In little-endian storage, the least-significant byte is at the lowest address. A diagram in this app always marks increasing addresses.

```text
32-bit value 0x12345678
address:       A    A+1  A+2  A+3
big-endian:    12   34   56   78
little-endian: 78   56   34   12
```

Endianness reverses byte significance, not the eight bits inside each byte. A load's width determines how many bytes participate. Signedness is applied only after raw bytes are reconstructed.

### Prerequisites

Hex/binary byte grouping and signed/unsigned views. Load-window offset variants also require `base_address_offset`; questions that describe byte intervals require the half-open range convention from Address, Layout, and Bit-Count Reasoning.

### Category boundaries

No alignment legality, virtual-memory behavior, cache claim, or host-language pointer behavior. Loads are abstract and always permitted. Address order and load width are explicit. Bit fields inside a loaded value belong to Bit Manipulation after reconstruction.

### Subcategories in order

1. Storing Values as Bytes
2. Reconstructing Values from Memory
3. Subvalue and Signed Loads

### Common misconceptions across the category

- Reversing bits inside each byte.
- Listing bytes in significance order when the question asks increasing-address order.
- Assuming the diagram's visual left side is lower address without reading its arrow.
- Reversing all bytes of a larger array rather than only the selected load window.
- Applying signed interpretation to each byte separately.
- Believing the byte sequence itself has intrinsic endianness; endianness belongs to the interpretation/store rule.

## 6.1 Subcategory: Storing Values as Bytes

### Family `store_integer_bytes`

**Learner task.** Write the bytes produced by storing a fixed-width integer at increasing addresses under named endianness.

**Response mode.** Ordered byte sequence.

**Template.** `Store {width}-bit value {value} as {endianness}-endian starting at address {base}. List bytes at {addressList} in increasing-address order.`

**Placeholders.** Width is `16, 24, 32, 48, 64`; value is exact-width hex; byte count is width/8. Base is a simple hex address used only as a label, with no arithmetic beyond sequential offsets.

**Derivation.** Split the hex pattern from most-significant to least-significant byte. Big-endian uses that order; little-endian reverses it. Do not reverse digits or bits inside a byte.

**Constraints and rejection.** At least two bytes differ; avoid palindromic byte sequences and all-equal bytes because endianness has no visible effect. Include bytes with asymmetric bit patterns such as `0x96` so bit reversal is detectable. At Levels 1–2, no byte is omitted by leading-zero numeric formatting.

**Difficulty.**

- Level 1: 16/32-bit, address arrow and significance labels.
- Level 2: either endianness, 32-bit, no significance labels.
- Level 3: 24/48/64-bit and nonzero base.
- Level 4: binary byte output or one missing byte in an address table.
- Level 5: store into a larger array at an offset while leaving marked outside bytes unchanged.

**Feedback.** First split into bytes, then assign significance to addresses. If each byte is bit-reversed, explicitly state that bit order within a byte stays unchanged.

**Examples.**

1. `Store 0x1234 big-endian at A; list A,A+1.` Answer `12 34`. Level 1.
2. `Store 0x12345678 little-endian at A; list increasing addresses.` Answer `78 56 34 12`. Level 2.
3. `Store 24-bit 0x0096E1 little-endian at 0x20.` Answer at `20..22`: `E1 96 00`. Level 3; leading zero byte retained and `0x96` not bit-reversed.

**Implementation and automated validation.** Serialize by extracting `(raw >> (8*i)) & 0xFF` for little-endian and reversed index for big. Reconstruct from output and assert original raw value. Balance endianness and byte count; prevent palindromes.

## 6.2 Subcategory: Reconstructing Values from Memory

### Family `load_integer_bytes`

**Learner task.** Reconstruct the raw fixed-width integer loaded from bytes shown in increasing-address order.

**Response mode.** Exact-width hex pattern.

**Template.**

```text
Increasing addresses:
{addresses}
{bytes}
Load a {width}-bit {endianness}-endian value at {start}. What raw hex pattern is loaded?
```

**Derivation.** Big-endian fold: `acc=acc*256+byte`. Little-endian: `sum(byte[i] << 8*i)`. Format exactly `width/4` hex digits.

**Constraints and rejection.** Same non-palindrome rules as storage. Require exact load width and start address. The word `raw` prevents accidental signed interpretation.

**Difficulty.** Level 1 2 bytes with ordered significance cue. Level 2 4 bytes. Level 3 offset within a larger row. Level 4 byte values shown in binary. Level 5 two overlapping load questions from one array, presented separately.

**Feedback.** Label each selected byte's significance (`2^0` byte, `2^1` byte, and so on), then concatenate in significance order.

**Examples.**

1. `Bytes at A,A+1 are 34 12. Load 16-bit little-endian.` Answer `0x1234`. Level 1.
2. `Bytes at increasing addresses are DE AD BE EF. Load 32-bit big-endian.` Answer `0xDEADBEEF`. Level 2.
3. `Array at 0x10..0x15 is AA 78 56 34 12 BB. Load 32-bit little-endian at 0x11.` Answer `0x12345678`; only bytes `78 56 34 12` participate. Level 3.

**Validation and coverage.** Re-serialize reconstructed raw value and compare selected bytes. Assert bytes outside load window do not affect answer. Balance start offset and endian direction.

## 6.3 Subcategory: Subvalue and Signed Loads

### Family `load_subvalue`

**Learner task.** Select the correct byte window from a larger memory row and reconstruct a 16-, 24-, or 32-bit raw subvalue.

**Response mode.** Exact-width hex pattern.

**Template.** `Given bytes at {base}..{end}, load {loadWidth} bits at offset {offset} using {endianness}.`

**Derivation.** Select exactly `loadWidth/8` bytes beginning at `base+offset`, then apply `load_integer_bytes`.

**Constraints and rejection.** Array has at least one irrelevant byte on one side of the window and preferably both. Offset plus load length must fit. Irrelevant bytes should not duplicate selected boundary bytes too often. No alignment assumptions.

**Difficulty.** Level 2 aligned 16-bit load in 4 bytes. Level 3 nonzero offset. Level 4 different load widths from the same displayed row. Level 5 asks which addresses participate before the value.

**Feedback.** Highlight the load window first; only then discuss endian significance.

**Examples.**

1. `Bytes at A..A+3: 10 20 30 40. Load 16-bit big-endian at offset 1.` Answer `0x2030`. Level 2.
2. `Bytes: AA 01 02 03 BB. Load 24-bit little-endian at offset 1.` Answer `0x030201`. Level 3.
3. `Bytes at 0x40..0x47: F0 96 34 12 80 7F 55 AA. Load 32-bit little-endian at offset 1.` Answer `0x80123496`. Level 4.

**Validation and coverage.** Slice by indices before reconstruction; tests should mutate every irrelevant byte and prove the answer unchanged.

### Family `signed_load_interpretation`

**Learner task.** Reconstruct raw bytes under endianness, then interpret the full loaded pattern as signed two's complement.

**Response mode.** Two named fields: raw hex pattern and signed decimal.

**Template.** `Load {width} bits from these bytes as {endianness}, then give raw pattern and signed value.`

**Derivation.** Reconstruct unsigned raw first. If top bit is clear, signed equals raw; otherwise signed is `raw-2^width`.

**Constraints and rejection.** Signedness applies to the entire loaded value, never individual bytes. Balance final top bit. At least 40% of negative cases have a low-address byte below `0x80`, preventing superficial inspection of the first displayed byte.

**Difficulty.** Level 2 16-bit with raw field required. Level 3 32-bit. Level 4 offset load. Level 5 asks both signed and unsigned interpretations after reconstruction.

**Feedback.** Use two explicit stages: `bytes -> raw pattern`, then `raw pattern -> signed value`. If the answer sign follows the first displayed byte rather than the most-significant reconstructed byte, diagnose that error.

**Examples.**

1. `Bytes FE FF, 16-bit little-endian.` Answer raw `0xFFFE`, signed `-2`. Level 2.
2. `Bytes 80 01, 16-bit big-endian.` Answer raw `0x8001`, signed `-32767`. Level 2.
3. `Bytes at A..A+5: AA 00 00 00 80 BB; load 32-bit little-endian at offset 1.` Answer raw `0x80000000`, signed `-2147483648`. Level 4.

**Validation and coverage.** Re-serialize raw bytes, then decode signed independently. Cross-tab endianness, final sign, first displayed byte high bit, and boundary class.

### Cross-family progression for Memory Representation

Store questions precede loads because they establish address/significance mapping. Once both directions are accurate, interleave them as inverse relationships. Offset selection must be trained separately before mixing with signed interpretation. Binary-byte rendering is a representation variation, not a higher conceptual category; use it only to test the invariant that bit order inside a byte stays fixed.

If a signed load fails, first ask for raw reconstruction alone. If raw is correct, target signed-view practice. If the wrong byte window was selected, keep endianness simple and retrain addressing before combining rules.

## 7. Topic-level cross-family progression

Recommended introduction sequence:

1. powers, binary/hex grouping, and programmer landmarks;
2. unsigned pattern interpretation and fixed-width preservation;
3. signed views, ranges, and representability;
4. extension/truncation;
5. direct base-address/offset and address-distance inverses, plus bounded population count;
6. unsigned direct arithmetic;
7. signed direct arithmetic, then joint status classification;
8. bitwise operators;
9. shifts, then rotations;
10. mask construction, mask application, named flag tests, then mask shapes;
11. alignment predicates, align-down/up, padding, and power-of-two remainder;
12. explicit unit offsets/boundaries, then range crossing;
13. bit-field extraction/insertion and supplied array/record layouts;
14. endian stores/loads, offsets, then signed loads.

Families that should be interleaved after acquisition:

- `interpret_pattern` with `reinterpret_decimal_view`;
- `representability` with `minimum_width`;
- unsigned and signed direct operations on identical raw patterns;
- logical and arithmetic right shifts on top-bit-set sources;
- `test-any` and `test-all` on some-but-not-all masks;
- mask construction with application;
- `base_address_offset` with inverse `address_distance`;
- alignment, padding, and power-of-two remainder on matched low-bit cases;
- unit offsets with boundary crossing on the same explicitly supplied sizes;
- population count with one-hot/contiguous/sparse mask recognition;
- direct array/record offsets with composed field addresses;
- endian store with inverse load;
- raw load with signed interpretation.

Families that should remain separate until prerequisites are mastered:

- missing-operand arithmetic;
- shift/rotate identification;
- insertion expressions;
- align-up/down until the alignment predicate is reliable;
- range crossing until containing-unit bases and the exclusive end convention are reliable;
- composed array-of-record addresses until direct array stride and record-field offset are reliable;
- sparse/complement mask classification until popcount and width-bounded masks are reliable;
- offset plus signed endian loads.

Level selection must respect family-specific introductions. A topic-wide Level 4 does not authorize a Level 4 family whose prerequisite family has not reached stable Level 2 performance.

## 8. Adaptive practice guidance

### Mastery dimensions

Track mastery at:

- question family;
- misconception;
- representation (`binary`, `hex`, `decimal`, `octal`, `byte-sequence`);
- width band (`1–4`, `5–8`, `9–16`, `17–32`, `33–64`);
- difficulty dimension (inverse, boundary, mixed representation, multi-rule);
- status class for arithmetic;
- predicate class for masks;
- address operation and answer representation;
- alignment exponent and remainder/padding class;
- explicit unit role and supplied size as separate dimensions;
- range-crossing class (`no`, `exact-end`, `one-byte-over`, `multi-boundary`);
- layout form (`array`, `sequential-record`, `explicit-offset-record`, `composed`);
- popcount band and mask-shape predicate;
- endianness and load-window selection separately.

Category-only mastery is too coarse. The displayed category score may aggregate these values, but selection must use the finer records.

### Evidence model

Record correctness, normalized answer parts, latency excluding paused time, hint/worked-solution use, and diagnosed misconception. Partial multi-field answers should update each dimension separately: correct result bits with wrong status is evidence for result computation and against status classification; correct align-down with wrong align-up is separate evidence; correct element stride with wrong field addition is evidence for array indexing and against layout composition.

A single correct response does not establish mastery. Promotion should normally require at least:

- 5 recent attempts in the family/dimension;
- 80% recent accuracy;
- no more than one recurrence of the same misconception in the last five;
- at least two distinct structural signatures;
- acceptable latency relative to the learner's own established baseline.

Do not demote solely for slow but correct performance. Keep the level and increase spaced recurrence; reduce scaffolding only after accuracy is stable.

### Failure-driven selection

| Observed answer pattern | Diagnosis | Next selection |
|---|---|---|
| XOR answer equals OR | XOR/OR truth-table confusion | 4–8-bit XOR with at least one `11` column, then operator identification |
| NOT has too many/few leading ones | width omitted | fixed-width NOT and exact-pattern formatting |
| Correct arithmetic bits, wrong signed status matching carry | carry = overflow misconception | joint-status cases where the two differ |
| Signed result called “underflow” or `-` | legacy terminology | explicit `above/below/none` range comparison |
| Right shift answer equals rotate | discarded bits wrapped | matched shift-versus-rotate identification |
| Arithmetic right answer equals logical right | sign-fill confusion | top-bit-one, count-one matched pair |
| Multi-bit shift carry equals OR of discarded bits | carry definition confusion | discarded ribbon with mixed bits |
| Range mask off by one | `hi-lo` width mistake | field-width then construct-mask pair |
| Clear answer equals `x & mask` | mask polarity confusion | aligned `x & ~mask` worked example |
| `test-all` response matches `test-any` | predicate ambiguity | same some-but-not-all class, alternated wording |
| Insert answer equals OR without clear | destination not cleared | insertion with old field containing ones to clear |
| Align-up advances an already aligned address | “up” means strictly greater | matched already-aligned align-up and zero-padding items |
| Align-up padding equals current remainder | distance-from-previous used as distance-to-next | small alignment-padding pairs with unequal `r` and `A-r` |
| Boundary-crossing answer changes when only exclusive end is on boundary | exclusive end counted as touched | exact-end half-open range followed by one-byte-over contrast |
| Word/cache-line/page answer uses an unstated familiar size | architecture default imported | same role with two different explicitly printed sizes |
| Array offset equals `(index+1)*size` | one-based indexing | zero-indexed element 0, then nonzero direct stride |
| Record field offset omits listed padding | explicit padding ignored | interval diagram including padding as an ordinary stated entry |
| Popcount equals number of nonzero hex digits | nibble count used as bit count | mixed hex digits with weights 1, 2, 3, and 4 |
| Remainder mask equals the modulus | used `2^k` instead of `2^k-1` | low-`k`-bits item paired with mask construction |
| One-hot answer accepts two ones in one hex digit | nonzero digit mistaken for set bit | binary expansion followed by exact-popcount predicate |
| Complement answer ignores displayed width | unbounded or incomplete complement | aligned exact-width mask pair with AND/OR feedback |
| Endian answer reverses bits per byte | byte/bit order confusion | 2-byte store using asymmetric bytes |
| Signed load sign follows first displayed byte | significance/order confusion | raw reconstruction first, then signed view |
| Numeric value right but leading zeroes absent | pattern/value confusion | exact-width base grouping, no difficulty demotion |

When several rules fail together, issue a short diagnostic from each prerequisite rather than simply choosing smaller numbers. Selection should avoid repeating the identical rendered item or overfitting to one width.

### Scheduling and coverage

Adaptive selection should combine:

- 50% weakest due skills;
- 25% spaced previously mastered skills;
- 15% prerequisite diagnostics or misconception contrasts;
- 10% controlled stretch.

Within a family, use coverage quotas defined above and penalize recently used structural signatures. Optional octal defaults to off or at most 5% of total topic selection. Direct rotates decline after mastery in favor of inverse/equivalence questions. Standalone unsigned-minimum recall and direct core-landmark recall are not scheduled heavily after introduction; later landmark review should occur through alignment, offsets, ranges, and masks. Role labels must not bias selection toward one supposedly standard word/cache-line/page size.

## 9. Feedback requirements

Every question stores:

- a concise correct message;
- diagnostic mappings from plausible wrong normalized answers;
- a worked method;
- a canonical display answer.

Feedback must preserve the prompt's width and representation. It should reveal no unrelated technique. For multi-rule questions, it should stage the solution and identify the first incorrect stage when answer parts permit that inference.

The learner should be able to open a Learn panel from any question. That panel must show the exact conventions relevant to the active family, including shift notation, answer-field meanings, field inclusivity, address direction, half-open range endpoints, zero-based array indexing, or explicitly supplied unit/layout sizes.

## 10. Implementation requirements

### Numeric safety

Use arbitrary-precision integer operations for generation and validation. Do not use JavaScript number-bitwise operators for values above 32 bits. A width mask is `(1n << BigInt(width)) - 1n`. Every result is explicitly masked where the family requires fixed width.

### Semantic data before localization

Questions must be stored as semantic objects. Localized strings render templates and field labels but do not determine answers. Status enum values are:

- unsigned: `carry` or `borrow`, Boolean;
- signed overflow: `above`, `below`, `none`.

Do not retain the legacy overloaded `overflow/underflow` parser or trailing `+/-/0` as the primary answer contract. Imported progress may map old status attempts for historical display, but new questions use named fields.

### Determinism and prevalidation

Given a seed, locale, family, and level, semantic parameters and canonical answer must be deterministic. Locale may change rendering only. Generate with bounded rejection; after 100 rejected candidates, fall back to a constructive case generator and record a development warning.

All active instances are prevalidated before display. Choice order may be shuffled after correctness is established, using the same seeded generator.

### Structural signatures

A signature should include family, width band when applicable, operation, direction/predicate/status class, representation pair, boundary/remainder class, unit-size band, layout form, popcount/mask shape, field shape or shift-count band, and normalized operand-shape features. It should not include incidental prose, address label, role name without its supplied size, or exact random value alone.

## 11. Automated validation plan

### Per-instance invariants

For every generated instance:

1. all placeholders are substituted;
2. prompt, answer mode, and canonical answer agree;
3. declared width and formatted digit counts agree when `width` is non-null; address-numeric questions have no invented fixed width;
4. every parameter is in its declared range;
5. family derivation recomputes the answer independently;
6. rejection rules pass;
7. accepted-answer parsing accepts canonical allowed forms and rejects malformed/over-width forms;
8. every choice question has exactly one correct, distinct choice;
9. feedback values equal the actual parameters and answer;
10. localization changes no semantic field.

### Exhaustive and property tests

- Exhaust all patterns through width 8 for signed/unsigned views, extension pairs, arithmetic status, bitwise operations, shifts, and rotations.
- Exhaust all legal fields in containers through width 12 for construction, extraction, fit, and insertion properties.
- Exhaust addresses `0..4095` against every supplied alignment/unit size `2..256` for predicate, align-down/up, padding, offset, containing base, and power-of-two remainder equivalence.
- Exhaust positive ranges with start `0..255`, length `1..256`, and unit sizes `2..64`; compare boundary-crossing formulas with enumerated touched addresses.
- Exhaust masks through width 12 for population count, one-hot, contiguous, sparse-under-definition, and complementary-pair predicates.
- Enumerate small supplied layouts and assert summed offsets, explicit intervals, array strides, and composed field addresses without adding unstated padding.
- Exhaust short byte sequences for 16-bit store/load inverse tests.
- Property-test at least 10,000 seeds per family across supported levels.
- Assert encode/decode, store/load, construct/decode-mask, rotate/inverse, insert/extract, address-plus-distance, align-plus-padding, and layout-offset/address round trips.
- Mutate unrelated bits/bytes and verify family invariants such as insertion preservation and load-window isolation.
- Compare shift carry formulas with repeated one-bit simulation.
- Compare arithmetic overflow range tests with sign-rule tests.
- Compare low-bit remainder/mask derivations with exact quotient/remainder arithmetic.

### Distribution tests

For a deterministic large seed sample, fail tests when:

- an answer/status/predicate class falls outside its declared tolerance;
- a family variation is starved;
- easy zero/identity/palindrome cases exceed quotas;
- a bit position, nibble value, operator, endianness, sign, field shape, landmark class, alignment exponent, remainder class, supplied unit size, boundary-crossing class, layout form, popcount band, or mask shape is materially underrepresented;
- exact structural duplicates recur inside the configured window;
- rejection rates exceed 30% for a family, indicating poor construction.

Distribution tests should use broad tolerances appropriate to random sampling but fixed seeds so regressions are reproducible.

### Parser tests

Test accepted prefixes, case, grouping spaces/underscores, surrounding whitespace, exact pattern widths, numeric address forms, signed displacement forms, named multi-field address answers, list order, byte separators, and Boolean synonyms. Explicitly reject internal invalid characters, negative addresses, missing required status/address fields, extra pattern digits, blank position lists, and signed decimals in unsigned-only fields.

## 12. Coverage requirements

Across a long practice history:

- every family appears after prerequisites, but family weights reflect professional value;
- binary/hex dominate; octal remains optional;
- top-bit clear and set patterns are balanced where relevant;
- signed positive, negative, and boundary cases all recur;
- arithmetic joint-status combinations receive explicit coverage;
- logical and arithmetic right shifts are contrasted;
- rotate questions progress beyond direct mechanical calculation;
- masks cover construction separately from application;
- any/all/exact flag predicates all recur with decisive some-but-not-all cases;
- bit fields cover alignment, crossing nibble boundaries, edge-touching, extraction, fit, and insertion preservation;
- programmer landmarks cover decimal/hex directions, exact powers, one-less boundaries, and the core values without becoming a general base-conversion drill;
- base-plus-offset and distance families cover forward/backward, carry/borrow, decimal/hex answers, and inverse checks;
- alignment covers yes/no predicates, already-aligned align-up, align-down/up, and padding remainder classes;
- word, cache-line, and page labels each occur with varied explicitly supplied sizes; no role is coupled to an architecture default;
- unit-offset and range-crossing work covers boundary starts, exact ends, one-byte crossings, and multi-boundary ranges;
- supplied layouts cover direct arrays, sequential records, explicit padding, supplied field offsets, and composed array-of-record addresses without inferred ABI behavior;
- population-count work covers low/middle/high density and bounded chunkable wide patterns;
- mask-shape work covers positive and near-miss one-hot, contiguous, explicitly defined sparse, and width-bounded complementary cases;
- power-of-two remainder work covers low-bit counts, numeric remainders, correct `2^k-1` masks, and nibble-aligned/nonaligned moduli;
- endian work includes both directions, offsets, subvalue widths, and signed interpretation;
- zero, all-one, powers-of-two, and palindromic cases never dominate merely because they are easy to generate;
- recent structural repetition is suppressed without starving misconception-targeted review.

## 13. Topic-level quality checklist

Before implementation is accepted, verify:

- [ ] “Binary Arithmetic and Bitwise” has been replaced by **Bitwise Operators**; `+` and `-` are absent from that generator.
- [ ] The Learn text says: “In binary, `2^n` is a 1 followed by n zeroes.”
- [ ] Signed out-of-range results use **signed overflow above/below**, not a separate signed-underflow concept.
- [ ] Carry, borrow, and signed overflow are separate semantic fields and are jointly exercised.
- [ ] Shift symbols and semantics are visible; direct shift counts are `1..width-1`.
- [ ] Width-bounded NOT is explicit.
- [ ] Mask construction and application are separate subcategories.
- [ ] `test-single`, `test-any`, `test-all`, and masked equality have unambiguous wording and derivations.
- [ ] Width/range work emphasizes representability and minimum-width reasoning, not repeated unsigned-minimum recall.
- [ ] Extension feedback states which interpretation is preserved; truncation states modulo semantics.
- [ ] Bit-field extraction, insertion, and fit questions are implemented.
- [ ] Abstract addresses never wrap and are not treated as language pointers.
- [ ] Decimal/hex programmer landmarks, base-plus-offset, and address-distance families are implemented as distinct trainable relationships.
- [ ] Alignment predicates, align-down/up, and padding use explicitly supplied power-of-two sizes and include already-aligned cases.
- [ ] Word, cache-line, and page questions state their sizes and make no architecture or performance claim.
- [ ] Byte ranges use `[start, end)` and test the last touched byte for boundary crossing.
- [ ] Array and record offsets use only supplied sizes, explicit offsets, and explicit padding; no ABI layout is inferred.
- [ ] Population count and one-hot, contiguous, explicitly defined sparse, and width-bounded complement shapes are exercised.
- [ ] Power-of-two remainder shortcuts retain exactly the low `k` bits and use mask `2^k-1`.
- [ ] Endian questions include reconstruction, offsets, subvalues, and signed loads, not only direct byte reversal.
- [ ] Every family has meaningful difficulty changes, misconception-based feedback, rejection rules, three examples, validation, and coverage requirements.
- [ ] Generated questions are semantic objects, deterministic by seed, localized only at rendering, and prevalidated.
- [ ] Large-seed property and distribution tests pass.
- [ ] Solving repeated instances improves an identifiable mental operation rather than tolerance for tedious transcription.

## 14. Recommended navigation labels

The UI may group subcategories under five navigation headings without making every subcategory a separate page:

- **Representation:** Powers, Bases, Views, Widths & Fit, Extension
- **Fixed-Width Arithmetic:** Unsigned, Signed, Status
- **Bit Manipulation:** Bitwise, Shifts, Rotates, Masks, Flags, Fields
- **Addresses & Layouts:** Landmarks, Address Arithmetic, Alignment, Boundaries, Layouts, Bit Counts & Shapes
- **Memory Representation:** Store, Load, Subvalue & Signed Load

Progress and adaptive telemetry must retain the stable family identifiers from this specification even if navigation labels or localization change.
