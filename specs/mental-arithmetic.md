# Mental Arithmetic — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Mental Arithmetic

### Topic goal

Develop fast, accurate head calculation with integers and exact percentages by building reusable strategies: recall facts, decompose by place value, bridge through round landmarks, compensate, distribute, double and halve, recover missing factors, and translate percentages into friendly fractions or component percentages.

The learner should become better at choosing a short mental route, not merely more tolerant of long written arithmetic.

### Scope

The topic includes:

- addition of two or several integers;
- subtraction as removal, compensation, or distance;
- multiplication facts and strategy-based products;
- exact integer division as a missing-factor problem;
- complements to powers of ten and other explicit round targets;
- exact percentages of integer bases;
- inverse percentage relationships with one missing value;
- negative differences at later levels;
- commutative, inverse, and distributive relationships where they directly support mental calculation.

Expected prior knowledge:

- reading positive and negative decimal integers;
- decimal place value;
- the meanings of `+`, `-`, `×`, `÷`, `%`, and `=`;
- multiplication facts through at least `5 × 5`, though the app may build the remaining core facts.

All questions are intended to be solved mentally. Scratch work may be used, but no family should require conventional long multiplication or long division as its best strategy.

### Exclusions

Do not include:

- non-terminating or approximate division;
- fractional, repeating-decimal, or rounded answers;
- percentages whose required answer is not an integer;
- compound interest, discounts, tax, tips, inflation, or financial word problems;
- fractions except as an explanatory strategy for percentages;
- roots, powers other than small strategy explanations, algebraic manipulation beyond one missing operand, or order-of-operations puzzles;
- timed “trick” questions;
- deliberately ambiguous implicit multiplication;
- locale-dependent digit grouping inside answer fields;
- operands so large that the intended solution is written-algorithm transcription.

Applied money and economics belong in Everyday Economics. This topic presents abstract numbers and short neutral prompts.

### Global notation

- Display multiplication as `×`, not `*`, in learner-facing text.
- Display division as `÷`, not `/`, except when a locale convention requires another unambiguous symbol.
- A percentage question `p% of b` means `(p × b) ÷ 100`.
- A complement is the non-negative amount `c` satisfying `value + c = target`.
- “Next multiple of `m`” means the smallest multiple of `m` strictly greater than the given value. If the current value is already a multiple, the answer is `m`, not zero.
- “Nearest” questions are excluded unless their tie rule is explicitly stated.
- Intermediate mental steps may be negative, but displayed operands remain non-negative except in families that explicitly introduce negative integers.

### Global answer conventions

The standard response mode is integer input.

- Surrounding whitespace is ignored.
- Spaces, underscores, and commas used as digit grouping are ignored.
- An optional leading `+` is accepted.
- Ordinary leading zeroes are accepted.
- `-0` normalizes to `0`.
- No units, percent sign, expression, or explanatory text is accepted in an integer field.
- Answers must be exact. Equivalent rounded or approximate answers are not accepted.

Yes/no and single-choice controls should be rendered as controls rather than parsed free text. Multiple named fields are used when a family asks for more than one missing value.

The implementation must use exact integers. Generated operands, intermediate values, and answers must remain within the implementation's exact integer range; using arbitrary-precision integers is preferred. A default learner-facing absolute-answer ceiling of `10,000,000` applies unless a family declares a lower limit.

### Difficulty philosophy

Difficulty should increase through:

- moving from recall to strategy selection;
- removing an explicit strategy cue;
- crossing one or more place-value boundaries;
- using an inverse relationship;
- combining two familiar decompositions;
- introducing plausible competing strategies or misconceptions;
- retaining irrelevant place-value digits while changing a friendly part;
- moving between a percentage and its fraction/decomposition.

Difficulty must not increase merely by adding digits, making every digit nonzero, increasing reading burden, or reducing response time. A larger problem may be easier than a smaller one when it has friendly structure; levels must be assigned from the intended mental route, not magnitude alone.

### Global generation model

Every question must include:

`categoryId`, `subcategoryId`, `familyId`, `level`, `strategy`, `difficultyDimensions`, `misconceptionsTargeted`, `parameters`, `canonicalAnswer`, `workedSteps`, and `structuralSignature`.

Generators must construct a solvable relationship around an intended strategy, render it, derive the answer independently, apply rejection rules, and only then present it. Pure uniform sampling from numeric ranges is permitted only for mixed mastery checks and must not dominate any category.

A structural signature includes family, strategy, digit/place pattern, boundary crossed, inverse direction, sign class, and percentage decomposition. Exact operand values alone are not a sufficient signature. Avoid the same signature among the last 15 questions and the same rendered expression among the last 100.

### Global feedback policy

Correct feedback gives the answer and a short efficient route. Incorrect feedback diagnoses a recognizable error when possible, then demonstrates the intended mental strategy. It must not merely restate `{expression} = {answer}`.

Worked solutions should normally contain two or three mental steps. If the “worked solution” becomes conventional column arithmetic, the generated instance or family is unsuitable.

Multiple-choice distractors must be calculated from misconceptions, not chosen as arbitrary nearby numbers. Remove duplicates and the correct answer. If three distinct plausible distractors cannot be produced, use direct input or regenerate.

## 2. Category: Addition

### Category purpose

Train flexible combination of integers through recall, place-value decomposition, bridging, compensation, and grouping rather than left-to-right digit accumulation.

### Learn

Addition becomes easier when one addend is split to make a round landmark or when both addends are decomposed by place:

```text
68 + 47 = 68 + 32 + 15 = 115
398 + 27 = 400 + 25 = 425
240 + 360 + 60 = 240 + 420 = 660
```

Addition is commutative and associative, so addends may be reordered and regrouped.

### Prerequisites

Decimal place value and basic addition facts through 10.

### Category boundaries

Finding a missing amount to a stated target belongs to Complements. Percentage components belong to Percentages even when the final operation is addition.

### Subcategories

1. Two-Addend Addition
2. Bridging and Compensation
3. Multi-Addend Grouping

## 2.1 Subcategory: Two-Addend Addition

### Skill and mental operation

Add two non-negative integers by decomposing one or both into place values and combining from the most useful place.

### Common misconceptions

- Losing a carried ten or hundred after combining partial sums.
- Concatenating place-value partial answers.
- Adding unequal places because digits were not aligned mentally.
- Treating a commuted expression as a different fact.
- Applying compensation without undoing it.

### Generation scope and difficulty dimensions

Operands range from one to five digits, but arbitrary dense five-digit pairs are excluded. Dimensions are number of active places, carry boundaries, zeroes inside operands, balance of addends, availability of a round anchor, and whether a strategy cue is shown.

### Family `add_place_values`

**Learner task.** Add two integers using place-value decomposition.

**Response mode.** Integer input.

**Template.** `Compute {a} + {b}.`

**Placeholder construction.** At Levels 1–2, one operand has one or two active place values. At Levels 3–4, both may have two or three. Level 5 may use four- or five-digit operands only when grouping into thousands/hundreds keeps the route to at most three mental additions.

**Derivation.** Exact integer sum `a+b`. Worked steps decompose the less friendly operand, for example `346 + 278 = 346 + 200 + 70 + 8`.

**Constraints and rejection.** Both operands are positive; zero identities are diagnostic only. At least one nonzero digit must occur in different place positions across the operands. Reject cases better classified as a near-landmark compensation item and dense cases requiring more than three meaningful intermediate totals.

**Difficulty.**

- Level 1: one- and two-digit, at most one crossing of ten.
- Level 2: two- and three-digit, one operand friendly by place.
- Level 3: two carries or three active place components.
- Level 4: strategy cue removed and internal zeroes included.
- Level 5: four/five digits with sparse or chunkable structure.

**Feedback.** Show place-value chunks. Detect a missing carry when the answer is exactly `10`, `100`, or `1000` too small, and a place-alignment error when a recognizable digitwise sum appears.

**Examples.**

1. `Compute 34 + 25.` Answer `59`; `34+20+5`. Level 1.
2. `Compute 346 + 278.` Answer `624`; `346+200=546`, `+70=616`, `+8=624`. Level 3.
3. `Compute 12,400 + 3,750.` Answer `16,150`; combine thousands/hundreds, then `+50`. Level 5.

**Implementation and validation.** Recompute with exact integers. Estimate digit count and assert answer lies between `max(a,b)` and `2×max(a,b)`. Coverage must balance carry count, active places, and operand order; the larger addend must not always be first.

### Family `add_missing_addend`

**Learner task.** Find one missing addend in an exact sum.

**Relationship to skill.** Inverse questions reveal whether the learner understands addition/subtraction relationships rather than only forward calculation.

**Response mode.** Integer input.

**Template.** `{known} + ? = {total}` or `? + {known} = {total}`.

**Derivation.** `missing = total-known`. Construct `known` and positive `missing`, then derive `total`; never independently sample all three.

**Constraints and rejection.** Missing value is positive and not equal to the visible addend except deliberate doubles practice. Reject totals smaller than known, zero answers, and items that duplicate a complement-to-landmark question.

**Difficulty.** Level 1 totals through 20. Level 2 two-digit totals. Level 3 boundary crossing. Level 4 missing value is more easily found by compensation/counting up. Level 5 sparse four-digit totals.

**Feedback.** Show both counting-up and inverse-subtraction forms when useful. Diagnose returning the total or visible addend.

**Examples.**

1. `7 + ? = 15.` Answer `8`. Level 1.
2. `68 + ? = 115.` Answer `47`; `68→100 is 32`, then 15. Level 3.
3. `? + 2,750 = 10,040.` Answer `7,290`; subtract `2,750` in friendly chunks. Level 5.

**Validation and coverage.** Substitute the answer and assert equality. Balance missing side, distance structure, and whether the total is round.

## 2.2 Subcategory: Bridging and Compensation

### Skill and mental operation

Recognize a nearby multiple of 10, 100, or 1000, move one addend to it, and preserve the total by applying the opposite adjustment.

### Common misconceptions

- Rounding an addend without compensating.
- Compensating in the same rather than opposite direction.
- Bridging to a landmark but forgetting the leftover portion.
- Choosing a farther landmark that adds unnecessary steps.

### Family `add_bridge_landmark`

**Learner task.** Add by splitting one addend so the other reaches the next round landmark.

**Response mode.** Integer input.

**Template.** `Compute {a} + {b}.` A Level 1 cue may add `Bridge {a} through {landmark}.`

**Construction.** Choose landmark `L` (10, 100, 1000, or a multiple thereof), choose `a` within 1–20 below `L`, choose leftover `r`, and set `b=(L-a)+r`. Ensure both split parts are positive.

**Derivation.** `a+b = L+r`.

**Constraints and rejection.** The bridge must reduce work. Reject `r=0` except complements review, a bridge portion larger than 20 at early levels, and cases with a nearer clearly superior landmark inconsistent with metadata.

**Difficulty.** Level 1 crosses 10 with cue. Level 2 crosses 100. Level 3 cue removed and either addend may be bridge target. Level 4 crosses a non-power round hundred/thousand. Level 5 contains distracting digits but a short bridge remains.

**Feedback.** Show exactly how much reaches the landmark and what remains. Detect answers equal to `L` as lost-leftover errors.

**Examples.**

1. `8 + 7.` Answer `15`; use 2 to reach 10, then add 5. Level 1.
2. `68 + 47.` Answer `115`; `68+32=100`, `47-32=15`. Level 2.
3. `3,985 + 267.` Answer `4,252`; use 15 to reach 4,000, then add 252. Level 4.

**Validation and coverage.** Verify `b=(L-a)+r`, `a<L`, and answer `L+r`. Balance landmark scale, bridge size, and target operand.

### Family `add_compensate_round`

**Learner task.** Replace a near-round addend with a round number and undo the excess or deficit.

**Response mode.** Integer input.

**Template.** `Compute {a} + {nearRound}.`

**Construction.** Select round `R` and small signed deviation `d` in `±1..±9` (up to ±25 at high levels); `nearRound=R+d`.

**Derivation.** `a+nearRound = a+R+d`.

**Constraints and rejection.** `|d|` must be small relative to `R`. Avoid items where direct bridge and compensation are identical enough to make strategy classification meaningless. Both above- and below-round cases must occur.

**Difficulty.** Level 1 near 10. Level 2 near 100. Level 3 deviation sign alternates without cue. Level 4 near multiples such as 300 or 2500. Level 5 two near-round addends, but still at most two compensations.

**Feedback.** Name the temporary round amount and correction direction. Diagnose omitted or sign-reversed correction.

**Examples.**

1. `26 + 19.` Answer `45`; `26+20-1`. Level 1.
2. `347 + 198.` Answer `545`; `347+200-2`. Level 2.
3. `2,998 + 4,997.` Answer `7,995`; `3,000+5,000-2-3`. Level 5.

**Validation and coverage.** Assert deviation metadata and exact result. Balance above/below round and correction sizes; double-compensation stays below 25% of this family.

## 2.3 Subcategory: Multi-Addend Grouping

### Skill and mental operation

Reorder and group three to five addends into complements, round totals, or equal chunks before combining.

### Common misconceptions

- Omitting an addend after regrouping.
- Treating reordering as changing signs.
- Pairing visually adjacent values when a nonadjacent compatible pair is better.
- Double-counting an addend used in a pair.

### Family `add_compatible_group`

**Learner task.** Sum several integers by finding compatible groups.

**Response mode.** Integer input.

**Template.** `Add mentally: {a1} + {a2} + ... + {ak}.`

**Construction.** Start with at least one pair or triple summing to a landmark, then add one or two distractor addends. Shuffle order.

**Derivation.** Sum each constructed group, then remaining values.

**Constraints and rejection.** `k=3..5`. Each addend is positive and uniquely accounted for. At least one nonadjacent compatible grouping exists. Reject layouts where left-to-right addition is equally trivial or where several incompatible intended groupings make feedback misleading; alternative efficient groupings are acceptable.

**Difficulty.** Level 1 three small addends and one complement pair. Level 2 four addends to 100. Level 3 two groups. Level 4 one distractor near a compatible value. Level 5 larger sparse values with two landmarks.

**Feedback.** Visually pair/group operands while preserving their original values. Accept and mention an alternative short route when telemetry can infer one.

**Examples.**

1. `7 + 6 + 3.` Answer `16`; group `7+3=10`. Level 1.
2. `38 + 25 + 62 + 15.` Answer `140`; `38+62=100`, `25+15=40`. Level 3.
3. `1,750 + 680 + 250 + 320 + 2,000.` Answer `5,000`; groups are 2,000, 1,000, and 2,000. Level 5.

**Validation and coverage.** Compare grouped and direct sums. Track addend count, number of compatible groups, shuffled positions, and landmark scale.

### Cross-family progression for Addition

Direct place-value addition comes first. Bridge and compensation are introduced separately with cues, then interleaved so the learner must select a route. Multi-addend grouping follows complements. Missing-addend questions should appear after forward sums at the same scale.

If an error is exactly one correction away, target compensation direction without increasing digits. If an addend is omitted, use three-addend grouping before returning to five.

## 3. Category: Subtraction

### Category purpose

Train subtraction as either decomposition, equal compensation, or distance between values, with explicit support for negative results at later levels.

### Learn

Choose the route that makes the distance easiest:

```text
83 - 27 = 83 - 20 - 7 = 56
103 - 78 = 105 - 80 = 25
504 - 487: 487→500 is 13, then 4, so 17
```

Adding the same amount to both operands preserves their difference. Counting up is often easier when values are close.

### Prerequisites

Addition, complements, and integer order.

### Category boundaries

Unsigned fixed-width wraparound is not part of this app. A negative result is an ordinary negative integer.

### Subcategories

1. Decomposition and Negative Differences
2. Compensation
3. Counting Up and Missing Terms

## 3.1 Subcategory: Decomposition and Negative Differences

### Common misconceptions

- Reversing operands to avoid a negative result.
- Subtracting each smaller digit from the larger digit independently.
- Losing a borrowed ten/hundred in mental decomposition.
- Applying the sign only to part of the result.

### Family `subtract_place_values`

**Learner task.** Compute `a-b` through place-value decomposition.

**Response mode.** Integer input.

**Template.** `Compute {a} - {b}.`

**Construction.** Choose `b` with at most three active place components. At Levels 1–3, `a>=b` in at least 85% of items. Levels 4–5 deliberately include negative differences.

**Derivation.** The canonical answer is exact integer `a-b`. Worked steps subtract the nonzero place components of `b` sequentially and must sum to the same result.

**Constraints and rejection.** Avoid zero subtrahend and equal operands outside diagnostics. Reject dense large pairs whose best route is written subtraction. Keep answer absolute value under the category scale.

**Difficulty.** Level 1 within 20. Level 2 two digits and one crossing. Level 3 hundreds with two/three chunks. Level 4 negative results and internal zeroes. Level 5 sparse four/five-digit values.

**Feedback.** Show sequential subtraction or reverse-and-negate for negative cases. Detect operand reversal and digitwise no-borrow answers.

**Examples.**

1. `Compute 17 - 9.` Answer `8`. Level 1.
2. `Compute 463 - 127.` Answer `336`; `463-100-20-7`. Level 3.
3. `Compute 2,750 - 3,120.` Answer `-370`; difference is `370` in the opposite direction. Level 4.

**Implementation and validation.** Exact subtraction; assert `(answer+b)==a`. Balance crossing count, sign, active places, and operand order at advanced levels.

## 3.2 Subcategory: Compensation

### Skill and mental operation

Add or subtract the same amount from both operands to make the subtrahend round.

### Family `subtract_equal_compensation`

**Learner task.** Compute a difference by shifting both operands equally.

**Response mode.** Integer input.

**Template.** `Compute {a} - {b}.`

**Construction.** Choose round `R`, small nonzero adjustment `d`, and desired difference `q`; set `b=R-d` and `a=b+q`. The preferred transform is `(a+d)-R`.

**Derivation.** `(a+d)-(b+d)=a-b`.

**Constraints and rejection.** Adjustment is small, transformed operands stay non-negative in early levels, and compensation materially reduces mental work. Balance rounding upward and downward.

**Difficulty.** Level 1 round to 10. Level 2 round to 100. Level 3 no strategy cue. Level 4 round both around an internal hundred/thousand. Level 5 negative answers or a choice between compensation and counting up.

**Feedback.** Show both operands receiving the same signed adjustment. Diagnose changing only one operand or using opposite adjustments.

**Examples.**

1. `43 - 19.` Answer `24`; `44-20`. Level 1.
2. `103 - 78.` Answer `25`; `105-80`. Level 2.
3. `3,012 - 1,997.` Answer `1,015`; `3,015-2,000`. Level 4.

**Validation and coverage.** Verify original and transformed differences match. Balance adjustment sign/size and landmark scale.

## 3.3 Subcategory: Counting Up and Missing Terms

### Skill and misconceptions

Find a difference by accumulating jumps from the smaller number to the larger, and solve missing minuend or subtrahend relationships. Misconceptions include omitting a jump, adding jump endpoints instead of distances, and using the wrong inverse operation.

### Family `subtract_count_up`

**Learner task.** Find `larger-smaller` where a short sequence of landmark jumps is efficient.

**Response mode.** Integer input.

**Template.** `What is the distance from {smaller} to {larger}?` or `Compute {larger} - {smaller}.`

**Construction.** Place smaller within 1–25 below a landmark and larger within 1–100 above it, permitting two or three jumps.

**Derivation.** Sum distances to the landmark(s) and then to larger.

**Constraints and rejection.** Values must be close relative to magnitude; otherwise place-value subtraction is preferable. No more than three jumps in the intended solution.

**Difficulty.** Level 1 one jump through 10. Level 2 through 100. Level 3 two landmarks. Level 4 choose counting-up without cue. Level 5 large but close values.

**Feedback.** Draw the jumps and add their lengths.

**Examples.**

1. `What is the distance from 8 to 13?` Answer `5`; `8→10` is 2 and `10→13` is 3. Level 1.
2. `Compute 504 - 487.` Answer `17`; `487→500` is 13, then 4. Level 2.
3. `Compute 20,013 - 19,978.` Answer `35`; `22` to 20,000, then 13. Level 5.

**Validation and coverage.** Assert summed jumps equal direct difference. Balance jump count and boundary scale.

### Family `subtract_missing_term`

**Learner task.** Find the missing minuend or subtrahend in an exact difference.

**Response mode.** Integer input.

**Templates.** `? - {b} = {difference}` and `{a} - ? = {difference}`.

**Derivation.** Missing minuend `a=difference+b`; missing subtrahend `b=a-difference`.

**Constraints and rejection.** Generated missing value is non-negative through Level 3. Negative difference appears only after signed differences are introduced. Reject zero/equal identities and ambiguous prose such as “subtract from.”

**Difficulty.** Level 1 within 20. Level 2 two digits. Level 3 crossing landmarks. Level 4 negative differences. Level 5 sparse larger values and alternating missing side.

**Feedback.** Substitute the answer and show the corresponding inverse relationship.

**Examples.**

1. `? - 7 = 9.` Answer `16`. Level 1.
2. `83 - ? = 46.` Answer `37`. Level 2.
3. `? - 2,400 = -350.` Answer `2,050`. Level 4.

**Validation and coverage.** Resubstitute. Balance missing side, sign of difference, and strategy needed for inverse computation.

### Cross-family progression for Subtraction

Begin with non-negative place-value differences, then compensation and counting up with explicit cues. Interleave them only after each method is recognized. Introduce negative results as an order/sign concept, not by suddenly using much larger operands. Missing terms follow forward subtraction.

## 4. Category: Multiplication

### Category purpose

Build core fact fluency and extend it through distribution, round-number compensation, and factor transformations such as doubling and halving.

### Learn

Multiplication is easier when a factor is rewritten:

```text
7 × 8 = 56
23 × 19 = 23 × 20 - 23 = 437
16 × 35 = 8 × 70 = 560
48 × 25 = 48 × 100 ÷ 4 = 1,200
```

Reordering factors does not change the product. Distribution and doubling/halving should reduce the work, not add decorative steps.

### Prerequisites

Addition, subtraction, and small multiplication facts.

### Category boundaries

Exact division used as a strategy step is allowed. General quotient practice belongs to Division. Powers and algebraic expansion are excluded.

### Subcategories

1. Core Facts
2. Distribution
3. Doubling and Halving
4. Landmark Multipliers

## 4.1 Subcategory: Core Facts

### Skill and mental operation

Recall products through `12 × 12`, using commutativity and derived facts for weak entries.

### Common misconceptions

- Addition answer (`a+b`) instead of product.
- Off-by-one repeated-addition result.
- Confusing neighboring facts such as `7×8`, `6×9`, and `8×8`.
- Treating reversed factors as unrelated facts.

### Family `multiplication_fact`

**Learner task.** Recall or derive one core multiplication fact.

**Response mode.** Integer input.

**Template.** `Compute {a} × {b}.`

**Scope.** `a,b` in `2..12`. Facts involving 0 or 1 are introductory diagnostics only. Squares, fives, tens, and elevens are treated as anchor classes rather than uniformly repeated.

**Derivation.** Exact `a×b`. Worked routes may use a known neighboring fact: `7×8 = 7×(10-2)`.

**Constraints and rejection.** Suppress immediate commuted duplicates. Do not overrepresent easy factors. Once an easy fact is mastered, weight weak/non-anchor facts more strongly.

**Difficulty.** Level 1 factors `2,5,10`. Level 2 all through 10 with cues from anchor facts. Level 3 through 12. Level 4 rapid mixed retrieval and missing factor. Larger factors do not belong to this family.

**Feedback and distractors.** Recognize `a+b`, `(a±1)×b`, swapped neighboring facts, and repeated-addition off-by-one. Show one short derived route only when recall is weak.

**Examples.**

1. `6 × 5.` Answer `30`. Level 1.
2. `7 × 8.` Answer `56`; `7×10-7×2`. Level 2.
3. `12 × 11.` Answer `132`; `12×10+12`. Level 3.

**Implementation and validation.** Recompute product. Coverage is tracked on an unordered fact matrix so `7×8` and `8×7` share mastery but both display orders occur.

## 4.2 Subcategory: Distribution

### Skill and misconceptions

Split one factor into friendly addends or a round number plus/minus a small correction. Errors include distributing to only one term, using the wrong correction sign, subtracting the small deviation instead of one full multiplicand per deviation, and losing a zero from a round product.

### Family `multiply_distribute`

**Learner task.** Compute a product by splitting one factor into two friendly parts.

**Response mode.** Integer input.

**Template.** `Compute {a} × {b}.`

**Construction.** Choose `b=u+v`, where `u` is `10, 20, 50, 100`, or another mastered landmark and `v` is a small signed value or friendly factor. Generate `b` from the decomposition, not randomly.

**Derivation.** `a×b = a×u + a×v`.

**Constraints and rejection.** Partial products must be mentally accessible and intended route at most three steps. Both positive and negative deviations occur. Reject dense two-digit-by-two-digit pairs with no friendly decomposition.

**Difficulty.** Level 2 one-digit by teen. Level 3 two-digit by `11,12,15,19,21`. Level 4 round landmark ± `1..5`. Level 5 one factor has two plausible decompositions and cue is absent.

**Feedback.** Show the actual decomposition and both partial products. Diagnose using `a×u±v` instead of `a×u±a×v`.

**Examples.**

1. `7 × 13.` Answer `91`; `7×10+7×3`. Level 2.
2. `23 × 19.` Answer `437`; `23×20-23`. Level 3.
3. `48 × 103.` Answer `4,944`; `48×100+48×3`. Level 4.

**Validation and coverage.** Verify decomposed and direct products. Balance deviation sign, landmark, split factor position, and partial-product count.

### Family `multiply_near_square`

**Learner task.** Use a known square or difference-of-squares structure for nearby factors.

**Response mode.** Integer input.

**Template.** `Compute {center-offset} × {center+offset}.`

**Derivation.** `(c-d)(c+d)=c²-d²`. The identity is taught explicitly; this is not assumed prior algebra.

**Constraints and rejection.** Centers are familiar multiples of 5 or 10, offsets `1..5`, and both square values are mentally recallable. Do not use if direct distribution is clearly shorter. This family is optional before Level 4.

**Difficulty.** Level 3 offset 1 around 10/20. Level 4 offsets 1–3 around round centers. Level 5 larger round centers with small square subtraction.

**Feedback.** Show center and equal offsets; diagnose multiplying the center by itself without subtracting `d²`.

**Examples.**

1. `9 × 11.` Answer `99`; `10²-1²`. Level 3.
2. `18 × 22.` Answer `396`; `20²-2²`. Level 4.
3. `47 × 53.` Answer `2,491`; `50²-3²`. Level 5.

**Validation and coverage.** Assert factors are symmetric and identity matches direct product. Balance centers and offsets; keep this family low-weight because it is specialized.

## 4.3 Subcategory: Doubling and Halving

### Skill and misconceptions

Move factors of two between operands to create a friendlier product. Common errors are doubling both factors, halving an odd factor without preserving exactness, or stopping before the transformed product is solved.

### Family `multiply_double_half`

**Learner task.** Compute a product by repeatedly halving an even factor and doubling the other.

**Response mode.** Integer input.

**Template.** `Compute {a} × {b}.`

**Construction.** Begin from a friendly product `u×v`, reverse one or more double/half transforms to obtain the displayed operands.

**Derivation.** If `a` is even, `a×b=(a/2)×(2b)`, repeated while it improves friendliness.

**Constraints and rejection.** Every halved factor is even at that step. One to three transformations. Result stays within ceiling. Reject cases whose displayed form is already easier than the intended transformed form.

**Difficulty.** Level 2 one transform to a multiple of 10. Level 3 two transforms. Level 4 choose which factor to halve. Level 5 combines a transform with a landmark multiplier.

**Feedback.** Show equal-product arrows and emphasize one factor halves while the other doubles.

**Examples.**

1. `16 × 5.` Answer `80`; `8×10`. Level 2.
2. `24 × 35.` Answer `840`; `12×70=6×140`. Level 3.
3. `48 × 125.` Answer `6,000`; `24×250=12×500`. Level 5.

**Validation and coverage.** Verify every transform preserves product and divisibility. Balance transform count and which displayed factor is even.

## 4.4 Subcategory: Landmark Multipliers

### Skill and mental operation

Use standard equivalences for multipliers closely tied to powers of ten.

### Family `multiply_landmark`

**Learner task.** Multiply by one of `5, 9, 11, 15, 25, 50, 75, 99, 101, 125`.

**Response mode.** Integer input.

**Derivation strategies.**

| Multiplier | Preferred relationship |
|---|---|
| 5 | `×10 ÷2` |
| 9 | `×10 - x` |
| 11 | `×10 + x` |
| 15 | `×10 + ×5` |
| 25 | `×100 ÷4` |
| 50 | `×100 ÷2` |
| 75 | `×3 ×100 ÷4`, when divisible structure is friendly |
| 99 | `×100 - x` |
| 101 | `×100 + x` |
| 125 | `×1000 ÷8`, when exact halving is friendly |

**Constraints and rejection.** Choose `x` so division steps are exact and short. Multiplier 75/125 instances must have enough factors of two or another obvious route. Do not force memorization of the table without teaching the relationship.

**Difficulty.** Level 1 multipliers 5/9/11. Level 2 15/25/50. Level 3 mixed choice. Level 4 75/99/101. Level 5 125 and strategy selection.

**Feedback.** Show the multiplier relationship. Detect failure to undo the scale or correction.

**Examples.**

1. `36 × 5.` Answer `180`; `36×10÷2`. Level 1.
2. `48 × 25.` Answer `1,200`; `48×100÷4`. Level 2.
3. `64 × 125.` Answer `8,000`; `64×1000÷8`. Level 5.

**Validation and coverage.** Direct multiplication validates every answer. Track each multiplier separately and balance operand order.

### Cross-family progression for Multiplication

Core facts precede every strategy family. Distribution and double/half are introduced independently; landmark multipliers then reuse both. Near-square products remain optional and low-weight. Advanced practice interleaves strategies so the learner chooses a route, but metadata retains the constructed best route.

## 5. Category: Division

### Category purpose

Train exact integer division as factor recovery, supported by multiplication facts, place-value scaling, and factor cancellation.

### Learn

All division questions in this topic are exact:

```text
144 ÷ 12 = 12 because 12 × 12 = 144
840 ÷ 35 = 24 because 35 × 24 = 840
3,600 ÷ 25 = 14,400 ÷ 100 = 144
```

Look for the missing factor or transform dividend and divisor by the same factor.

### Prerequisites

Multiplication facts, multiplication strategies, and exact integer concepts.

### Category boundaries

No remainder, rounding, recurring decimal, or fraction answer. “Divide by a fraction” is excluded.

### Subcategories

1. Exact Quotients
2. Factor and Scale Transformations
3. Missing Factors and Divisors

## 5.1 Subcategory: Exact Quotients

### Common misconceptions

- Reversing dividend and divisor.
- Returning the known divisor as the quotient.
- Dropping/adding a decimal-place zero during scaling.
- Estimating instead of checking by multiplication.

### Family `divide_exact_quotient`

**Learner task.** Find an exact integer quotient.

**Response mode.** Integer input.

**Template.** `Compute {dividend} ÷ {divisor}.`

**Construction.** Choose nonzero positive divisor `d` and positive quotient `q`, then set dividend `d×q`. Never choose dividend independently.

**Derivation.** Canonical answer is the constructed `q`. Independently compute `dividend÷d` and assert multiplication by `d` reconstructs the dividend.

**Constraints and rejection.** `d>=2`, `q>=2`. Product within ceiling. At early levels one factor is a mastered fact. Advanced dense factors require a declared strategy from multiplication; reject long-division-only cases.

**Difficulty.** Level 1 fact table through 10. Level 2 through 12 and round multiples. Level 3 one factor is `15,20,25,50`. Level 4 two-digit divisor with decomposable quotient. Level 5 sparse/landmark larger values.

**Feedback.** State the missing-factor check `d×q=dividend` and show the short factor route.

**Examples.**

1. `42 ÷ 7.` Answer `6`. Level 1.
2. `375 ÷ 25.` Answer `15`; `25×15=375`. Level 3.
3. `12,600 ÷ 35.` Answer `360`; `35×36=1,260`, then scale by 10. Level 5.

**Implementation and validation.** Assert dividend modulo divisor is zero and quotient reconstructs it. Balance divisor/quotient structures rather than raw ranges.

## 5.2 Subcategory: Factor and Scale Transformations

### Skill and misconceptions

Transform dividend and divisor by a common factor, or factor the divisor into easy sequential divisions. Errors include transforming only one side, applying factors in the wrong multiplicative amount, and using a non-exact intermediate quotient.

### Family `divide_factorized`

**Learner task.** Divide by a composite number through two or three exact factor steps.

**Response mode.** Integer input.

**Template.** `Compute {dividend} ÷ {divisor}.`

**Construction.** Select friendly factors `r,s` with `divisor=r×s`, choose quotient `q`, set dividend `q×r×s`, and ensure both division orders are exact when both are presented as options.

**Derivation.** `(dividend÷r)÷s`.

**Constraints and rejection.** Factors generally `2,3,4,5,8,10,12,25`. Intermediate results must be integers and manageable. Avoid a divisor whose fact-table recall makes factorization gratuitous at high mastery.

**Difficulty.** Level 2 two small factors. Level 3 one factor is 10/25. Level 4 learner chooses factor order. Level 5 three factors or one scale cancellation plus factor step.

**Feedback.** Display divisor factorization and exact intermediates. Diagnose dividing by only one factor.

**Examples.**

1. `96 ÷ 12.` Answer `8`; divide by 3 then 4. Level 2.
2. `1,800 ÷ 24.` Answer `75`; divide by 6 then 4. Level 3.
3. `16,000 ÷ 125.` Answer `128`; divide successively by `5,5,5`, or use the equivalent scaling route. Level 5.

**Implementation and validation.** The final rendered example and all generated instances must be exact; tests assert every intermediate declared in `workedSteps` is integral. Coverage balances factor order and factor types.

### Family `divide_scale_both`

**Learner task.** Simplify a quotient by multiplying or dividing dividend and divisor by the same power-of-two/ten-related factor.

**Response mode.** Integer input.

**Template.** `Compute {dividend} ÷ {divisor}.`

**Derivation.** `(a×k)÷(b×k)=a÷b` for nonzero `k`, or scale a divisor such as 25 to 100.

**Constraints and rejection.** Transformed values must be integers and visibly friendlier. Do not use decimal intermediate notation. Common divisors are `5,20,25,50,125`.

**Difficulty.** Level 2 cancel common trailing zeroes. Level 3 scale 25/50 to 100. Level 4 scale 125 to 1000. Level 5 select a common factor without cue.

**Feedback.** Show the same factor applied to numerator and divisor and preserve the quotient.

**Examples.**

1. `360 ÷ 40.` Answer `9`; cancel a factor 10. Level 2.
2. `3,600 ÷ 25.` Answer `144`; multiply both by 4: `14,400÷100`. Level 3.
3. `48,000 ÷ 125.` Answer `384`; multiply both by 8: `384,000÷1,000`. Level 4.

**Validation and coverage.** Verify transformed ratio by cross multiplication and exact result. Balance scale-up and cancellation.

## 5.3 Subcategory: Missing Factors and Divisors

### Family `division_missing_term`

**Learner task.** Recover a missing dividend, divisor, or quotient from an exact relationship.

**Response mode.** Integer input.

**Templates.** `? ÷ {d} = {q}`, `{dividend} ÷ ? = {q}`, and `{dividend} ÷ {d} = ?`.

**Derivation.** Missing dividend `d×q`; divisor `dividend÷q`; quotient `dividend÷d`.

**Constraints and rejection.** All terms are positive integers and division is exact. Missing divisor/quotient must be at least 2. Direct quotient variation is used only for mixed inverse selection, since `divide_exact_quotient` owns its main practice.

**Difficulty.** Level 1 fact relationships. Level 2 missing dividend. Level 3 missing divisor. Level 4 mixed missing position without cue. Level 5 landmark-factor values.

**Feedback.** Rewrite as `divisor×quotient=dividend` and substitute.

**Examples.**

1. `? ÷ 6 = 7.` Answer `42`. Level 1.
2. `144 ÷ ? = 12.` Answer `12`. Level 3.
3. `18,000 ÷ ? = 72.` Answer `250`; `72×250=18,000`. Level 5.

**Validation and coverage.** Substitute and assert exact equality. Balance missing position and underlying multiplication strategy.

### Cross-family progression for Division

Exact fact-family quotients precede factorization. Scale-both transformations follow landmark multiplication. Missing positions are interleaved only after the forward relationship is stable. Wrong answers should trigger the corresponding multiplication fact or strategy rather than simply a smaller dividend.

## 6. Category: Complements

### Category purpose

Build immediate knowledge of amounts needed to reach round totals, supporting addition bridges, subtraction by distance, money calculations, and percentage decomposition.

### Learn

A complement is a missing addend:

```text
73 + ? = 100  -> 27
680 + ? = 1,000 -> 320
287 needs 13 to reach the next multiple of 100, 300
```

Work from the rightmost place, or jump to the next ten and then the larger target. Always read whether the target is explicitly stated or must be found.

### Prerequisites

Addition facts and decimal place value.

### Category boundaries

General missing-addend equations belong to Addition unless the target is a deliberate round landmark. Change-making stories belong to Everyday Economics.

### Subcategories

1. Complements to a Stated Landmark
2. Complements to the Next Multiple
3. Decomposed Complement Paths

### Common misconceptions

- Returning the target instead of the missing amount.
- Subtracting in the wrong direction.
- Giving the complement to 10 when target is 100 or 1000.
- Returning zero when the prompt asks for the next strictly greater multiple.
- Handling each digit independently without borrow/carry relationships.

## 6.1 Subcategory: Complements to a Stated Landmark

### Family `complement_to_landmark`

**Learner task.** Find `target-value` for a stated round target.

**Response mode.** Integer input.

**Template.** `{value} + ? = {target}.`

**Placeholders.** Targets are `10, 20, 50, 100, 200, 500, 1,000, 10,000` and selected round multiples. `0<value<target`.

**Derivation.** `answer=target-value`.

**Constraints and rejection.** Zero answer is excluded. Value is not sampled uniformly: balance final digits, number of required place crossings, and small/large complements. Powers of ten dominate early levels; arbitrary round multiples appear later.

**Difficulty.** Level 1 to 10/20. Level 2 to 100. Level 3 to 500/1000 with one easy jump. Level 4 internal zeroes and non-power targets. Level 5 to 10,000 or round multiples with several active places.

**Feedback.** Show a jump decomposition and substitute. Diagnose complement-to-wrong-scale answers.

**Examples.**

1. `7 + ? = 10.` Answer `3`. Level 1.
2. `73 + ? = 100.` Answer `27`; 7 to 80 and 20 to 100. Level 2.
3. `6,735 + ? = 10,000.` Answer `3,265`. Level 5.

**Implementation and validation.** Assert value plus answer equals target and `0<answer<target`. Balance target, complement size band, and final digit.

## 6.2 Subcategory: Complements to the Next Multiple

### Family `complement_next_multiple`

**Learner task.** Find how much must be added to reach the next strictly greater multiple of a named unit.

**Response mode.** Integer input.

**Template.** `How much must be added to {value} to reach the next multiple of {unit}?`

**Derivation.** `remainder=value mod unit`; answer is `unit-remainder`, including `unit` when remainder is zero.

**Constraints and rejection.** Unit is `10, 25, 50, 100, 250, 500, 1000` as level permits. Prompt must state “strictly greater” or the Learn convention must be visible. Balance values already on a multiple and ordinary remainders; on-multiple cases stay below 15%.

**Difficulty.** Level 1 next 10. Level 2 next 100. Level 3 units 25/50. Level 4 250/500 and internal landmarks. Level 5 next 1000 for larger values.

**Feedback.** Name the actual next target and verify addition. If answer zero on an exact multiple, repeat the strictly-greater rule.

**Examples.**

1. `How much must be added to 47 to reach the next multiple of 10?` Answer `3`; target 50. Level 1.
2. `How much must be added to 287 to reach the next multiple of 100?` Answer `13`; target 300. Level 2.
3. `How much must be added to 2,500 to reach the next strictly greater multiple of 500?` Answer `500`; target 3,000. Level 4.

**Validation and coverage.** Assert `(value+answer)%unit==0`, `answer in 1..unit`, and no smaller positive answer works. Track remainder bands and exact-multiple cases.

## 6.3 Subcategory: Decomposed Complement Paths

### Family `complement_two_stage`

**Learner task.** Complete a complement that is easiest as a jump to a small landmark and then to the target.

**Response mode.** Integer input; optional two named jump fields at introductory levels.

**Template.** `{value} + ? = {target}.`

**Construction.** Choose intermediate `M` (next ten/hundred) between value and target so both `M-value` and `target-M` are friendly.

**Derivation.** Answer `(M-value)+(target-M)`.

**Constraints and rejection.** Intermediate lies strictly inside interval and gives a genuinely shorter mental route. At most three jumps. Do not duplicate a single-digit complement item.

**Difficulty.** Level 2 two jumps to 100. Level 3 jump through a hundred to 1000. Level 4 choose intermediate without cue. Level 5 multiple plausible landmarks; shortest route still no more than three jumps.

**Feedback.** Draw the path and sum jump lengths. Diagnose omission of either stage.

**Examples.**

1. `68 + ? = 100.` Answer `32`; `2+30`. Level 2.
2. `684 + ? = 1,000.` Answer `316`; `16+300`. Level 3.
3. `7,968 + ? = 10,000.` Answer `2,032`; `32+2,000`. Level 5.

**Validation and coverage.** Verify staged and direct complements match. Balance first-jump size and landmark scale.

### Cross-family progression for Complements

Master complements to 10, then 100, before using them inside addition bridges and counting-up subtraction. Next-multiple questions require explicit convention practice. Two-stage complements should be interleaved with Addition and Subtraction once the standalone facts are reliable.

## 7. Category: Percentages

### Category purpose

Train exact percentage calculation through benchmark fractions, decomposition, scaling, and inverse relationships.

### Learn

Use benchmark percentages rather than multiplying first:

```text
10% = divide by 10
5% = half of 10%
20% = divide by 5
25% = one quarter
50% = one half
75% = three quarters
15% = 10% + 5%
```

For example, `15% of 80 = 8 + 4 = 12`. The generator only asks direct percentage questions whose exact answer is an integer.

### Prerequisites

Multiplication, exact division, and complements.

### Category boundaries

No percent change, percentage points, original-price stories, compound change, interest, or rounding. Those belong to Everyday Economics. This category uses abstract relationships only.

### Subcategories

1. Benchmark Percentages
2. Composite Percentages
3. Scaling and Commutativity
4. Inverse Percentage Relationships

### Common misconceptions

- Treating `p%` as multiply by `p` without dividing by 100.
- Returning the remaining percent rather than the requested part.
- Confusing 5% with divide by 5 (20%).
- Computing 25% as half instead of quarter.
- Adding percentage points to the base.
- For inverse questions, dividing/multiplying in the wrong direction.
- Using `p% of b = b% of p` without respecting that the second percent may look unusual but is numerically valid.

## 7.1 Subcategory: Benchmark Percentages

### Family `percentage_benchmark`

**Learner task.** Compute `p%` of an integer base for benchmark `p`.

**Response mode.** Integer input.

**Template.** `What is {percent}% of {base}?`

**Scope.** Percent is `1,2,5,10,20,25,50,75,100`. Base is constructed so the exact answer is integer and the benchmark fraction is mentally usable.

**Derivation.** Use exact `(p×base)/100`; worked route uses division/multiplication relationship, such as quarter for 25%.

**Constraints and rejection.** Do not overrepresent 10/50/100. For 1% base is a multiple of 100; for 5% a multiple of 20; for 25/75 a multiple of 4. Reject answers requiring a decimal.

**Difficulty.** Level 1 10/50/100. Level 2 5/20/25. Level 3 1/2/75. Level 4 mixed benchmark without cue. Level 5 larger bases with easy factor structure.

**Feedback.** Name the benchmark relationship and exact operation. Diagnose known alternative percent errors.

**Examples.**

1. `What is 10% of 80?` Answer `8`. Level 1.
2. `What is 25% of 360?` Answer `90`; one quarter. Level 2.
3. `What is 75% of 1,240?` Answer `930`; three quarters. Level 4.

**Implementation and validation.** Assert product divisible by 100. Balance percent values, base magnitude, and quotient structure.

## 7.2 Subcategory: Composite Percentages

### Skill and misconceptions

Decompose a non-benchmark percentage into two or three mastered components. Errors include computing each component from the previous result, omitting a component, or using the wrong sign for `benchmark-minus`.

### Family `percentage_composite`

**Learner task.** Compute a percentage such as 12%, 15%, 18%, 30%, 35%, or 65% by combining benchmarks.

**Response mode.** Integer input.

**Template.** `What is {percent}% of {base}?`

**Construction.** Choose decomposition first, then a base divisible enough for every component and final answer to be integral.

**Derivation.** Compute each declared component as an exact integer percentage of the original base, combine them according to the route, and independently verify the result equals `(percent×base)÷100`.

**Preferred decompositions.**

| Percent | Route |
|---|---|
| 12% | 10% + 2% |
| 15% | 10% + 5% |
| 18% | 20% - 2% or 10% + 5% + 3% at Level 5 |
| 30% | 3 × 10% |
| 35% | 25% + 10% |
| 40% | 2 × 20% |
| 60% | 50% + 10% |
| 65% | 50% + 10% + 5% |
| 80% | 100% - 20% |
| 90% | 100% - 10% |

**Constraints and rejection.** At most three components. Every component must be exact and friendly. Route metadata may store alternatives, but feedback chooses the shortest based on mastered benchmarks.

**Difficulty.** Level 2 two additive components. Level 3 subtraction from a benchmark. Level 4 choose between routes. Level 5 three components or larger friendly base.

**Feedback.** Compute each component from the original base, then combine. Diagnose chained-component calculations.

**Examples.**

1. `What is 15% of 80?` Answer `12`; 8 + 4. Level 2.
2. `What is 35% of 240?` Answer `84`; quarter is 60 and 10% is 24. Level 3.
3. `What is 18% of 650?` Answer `117`; 20% is 130 minus 2% is 13. Level 4.

**Validation and coverage.** Verify component sum/difference and direct formula. Balance decompositions, additive/subtractive route, and component count.

## 7.3 Subcategory: Scaling and Commutativity

### Family `percentage_swap_or_scale`

**Learner task.** Transform `p% of b` into an equivalent, easier percentage relationship or scale both values by a compatible factor.

**Response mode.** Integer input; single-choice only when selecting the easier equivalent expression.

**Template.** `Compute {percent}% of {base}.` Advanced controlled variation: `Which equivalent expression is easiest?`

**Derivation.** Use `p% of b = b% of p` because both equal `p×b/100`, or split a scaled base. Example: `4% of 75 = 75% of 4 = 3`.

**Constraints and rejection.** Swap only when it is materially easier and the swapped percent has a known benchmark relationship. Do not imply the quantities are semantically interchangeable in real-world unit contexts; prompts are abstract numbers only.

**Difficulty.** Level 3 explicit swap cue. Level 4 learner detects swap. Level 5 combines swap with benchmark fraction or scale.

**Multiple-choice distractors.** Use unchanged multiplication by percent, swapped numbers without the percent sign, complement percentage, and a known benchmark misapplication. Each is evaluated and duplicates removed.

**Feedback.** Show both products over 100 and the easier benchmark.

**Examples.**

1. `What is 4% of 75?` Answer `3`; use 75% of 4. Level 3.
2. `What is 8% of 25?` Answer `2`; use 25% of 8. Level 3.
3. `What is 16% of 125?` Answer `20`; use 125% of 16 = 16 + quarter of 16. Level 5.

**Validation and coverage.** Direct formula validates answer; verify swapped form is exact and declared easier by a strategy-cost heuristic. Keep this family below 15% of percentage practice.

## 7.4 Subcategory: Inverse Percentage Relationships

### Family `percentage_missing_base`

**Learner task.** Find the base when a benchmark or composite percentage and result are known.

**Response mode.** Integer input.

**Template.** `{percent}% of ? = {part}.`

**Construction.** Choose integer base meeting the family constraints, calculate exact part, then hide base.

**Derivation.** `base=(part×100)/percent`, preferably inverted through the learned benchmark (e.g. if 25% is 30, whole is four times 30).

**Constraints and rejection.** Unique positive integer base. Percent generally `10,20,25,50,75`, with `5,15` only when inverse remains simple. Reject calculator-like division.

**Difficulty.** Level 2 50/25. Level 3 10/20/75. Level 4 5/15 with friendly part. Level 5 mixed direction without saying “find the whole.”

**Feedback.** State the fraction/scale relationship and substitute.

**Examples.**

1. `50% of ? = 35.` Answer `70`. Level 2.
2. `25% of ? = 45.` Answer `180`. Level 2.
3. `15% of ? = 72.` Answer `480`; 5% is 24, so 100% is 20×24. Level 4.

**Validation and coverage.** Substitute in exact integer arithmetic. Balance percent and inverse multiplier.

### Family `percentage_missing_percent`

**Learner task.** Determine an integer percentage when part and base are known.

**Response mode.** Integer input; prompt says to omit `%`.

**Template.** `{part} is what integer percent of {base}?`

**Derivation.** `percent=(part×100)/base`.

**Constraints and rejection.** Percentage is an integer in `1..100` and selected from benchmark/composite values already learned. Base is nonzero. Do not use reducible ratios requiring awkward fraction arithmetic.

**Difficulty.** Level 2 obvious halves/quarters. Level 3 benchmark set. Level 4 composite percentages. Level 5 base/part scaled with distracting zeroes.

**Feedback.** Show benchmark comparison or exact ratio times 100. Diagnose returning `base-part` or the fraction denominator.

**Examples.**

1. `20 is what integer percent of 40?` Answer `50`. Level 2.
2. `45 is what integer percent of 180?` Answer `25`. Level 3.
3. `234 is what integer percent of 1,300?` Answer `18`. Level 4.

**Validation and coverage.** Assert `(part×100)%base==0` and result in range. Balance percent values and scaling patterns.

### Cross-family progression for Percentages

Benchmark percentages precede composites. Inverse base questions follow the corresponding forward benchmark. Missing-percent questions appear only after the learner distinguishes part, whole, and rate. Swap/scale is an optional efficiency family, never a prerequisite for basic percentage competence.

If a learner computes 5% as one fifth, target paired 5%/20% questions. If components are chained from previous components, show two named component fields based on the same original base before returning to direct input.

## 8. Topic-level cross-family progression

Recommended introduction order:

1. addition facts/place value and complements to 10;
2. addition bridging and complements to 100;
3. subtraction decomposition, compensation, and counting up;
4. multiplication facts, then distribution and double/half;
5. exact division as missing factor;
6. multi-addend grouping and missing arithmetic terms;
7. landmark multiplication and factorized/scaled division;
8. benchmark percentages, then composite and inverse percentages;
9. optional near-square and percentage-swap strategies.

After acquisition, interleave inverse pairs:

- addition and missing addend;
- subtraction and missing term;
- multiplication fact and exact quotient;
- complement and bridge addition;
- benchmark percentage and missing base/percent.

Strategy-choice questions should mix only already-mastered strategies. A high topic level does not unlock a family whose prerequisites are weak.

## 9. Adaptive practice guidance

### Mastery dimensions

Track:

- category and question family;
- strategy;
- misconception;
- operand place-pattern and magnitude band;
- number of boundary crossings;
- inverse direction/missing position;
- sign of subtraction result;
- multiplication fact pair;
- division factor structure;
- complement target type;
- percentage benchmark/decomposition.

Category-level cells may remain for navigation, but selection and feedback require these finer dimensions.

### Evidence

Record correctness, normalized answer, latency excluding pauses, hint/worked-solution use, and inferred misconception. Slow correct answers indicate a fluency need, not conceptual failure. Promote only after multiple structural forms, normally at least five recent attempts with 80% accuracy and no repeated misconception in the last five.

Latency expectations are learner-relative. Do not enforce universal countdowns or mark a correct answer wrong because it was slow.

### Failure-driven routing

| Answer pattern | Likely misconception | Next practice |
|---|---|---|
| Sum short by 10/100 | lost carry/bridge component | same scale, one explicit bridge |
| Compensation answer omits small correction | rounded without undoing | near-round item with correction field |
| Multi-addend result omits exactly one operand | grouping omission | three addends with visual pairing |
| Difference has correct magnitude, wrong sign | operands reversed | order comparison plus one negative difference |
| Subtraction changes only subtrahend during compensation | unequal compensation | matched transformed equation |
| Product equals `a+b` | multiplication meaning/fact weakness | small repeated-addition/fact item |
| Product matches `a×R±d` | failed distribution of deviation | explicit two partial-product fields |
| Double/half product doubled or halved | changed only one factor | equality transformation item |
| Quotient equals divisor | factor-role confusion | rewrite as missing multiplication factor |
| Factorized division stops after one factor | incomplete factorization | two named division steps |
| Complement is to wrong power of ten | target-scale confusion | side-by-side stated targets |
| Next-multiple answer is zero on exact multiple | “strictly greater” missed | exact-multiple diagnostic |
| 5% answer equals base÷5 | 5%/20% confusion | paired benchmark contrast |
| Composite percentage applies second component to first | chained-base error | named components from original base |
| Missing percentage answer is `base-part` | percent/difference confusion | benchmark ratio question |

When an error spans several skills, select short prerequisite diagnostics instead of lowering all operand sizes indiscriminately.

### Scheduling

Recommended adaptive mix:

- 50% weakest due family/strategy;
- 25% spaced mastered skills;
- 15% misconception contrasts or prerequisite diagnostics;
- 10% controlled stretch.

Easy anchor facts remain in spaced review but must not dominate. Optional specialized families (`multiply_near_square`, `percentage_swap_or_scale`) together should be at most 10% of total topic practice unless manually selected.

## 10. Feedback requirements

Every instance stores a canonical answer, concise confirmation, worked mental route, and mappings for plausible wrong answers. Feedback should prefer a route the learner has already learned; alternative efficient routes may be mentioned but should not create a wall of methods.

For a wrong answer:

1. identify a specific likely error when evidence supports it;
2. display the critical relationship or decomposition;
3. show no more than three intermediate totals;
4. end with the canonical answer.

The Learn panel opened from a question must show the active strategy and one structurally similar example, not only the broad category card.

## 11. Implementation requirements

### Numeric correctness

Use exact integer arithmetic. Before display, assert every direct division and percentage component is integral. Do not generate a decimal answer and round it to fit the integer interface.

### Semantic generation and localization

Generate semantic operands and relationships before localized wording. Locale changes may alter symbols and digit grouping but never parameters, answers, family, difficulty, or strategy. Parsers must handle the locale's displayed grouping without accepting arbitrary explanatory text.

### Strategy-cost validation

Each constructed item records an estimated mental cost: number of recalled facts, decompositions, boundary jumps, and intermediate totals. Reject an item if:

- intended route exceeds four meaningful steps;
- a clearly simpler untrained trick makes the metadata misleading;
- conventional written arithmetic is more natural than the declared strategy;
- operand length adds transcription without changing reasoning.

The cost heuristic guides generation but does not claim that every learner uses the same best strategy.

### Determinism and recent-history control

Given seed, family, level, and locale-independent settings, semantic generation is deterministic. Bounded rejection is limited to 100 attempts before a constructive fallback. Choice order is shuffled only after unique correctness is established.

## 12. Automated validation

### Per-instance checks

For every question:

1. all placeholders are substituted;
2. operands satisfy scope and family construction;
3. canonical answer recomputes independently;
4. all displayed and worked intermediate operations are exact;
5. response parser accepts canonical allowed forms;
6. rejection rules and answer ceiling pass;
7. question wording uniquely identifies operand roles;
8. any choice set has exactly one correct distinct answer;
9. feedback uses the actual parameters;
10. structural signature is complete.

### Exhaustive and property tests

- Exhaust addition/subtraction operands through 100 for core identities and missing terms.
- Exhaust multiplication facts `2..12` and their commuted forms.
- Exhaust constructed exact division relationships through a configured small bound.
- Exhaust complements for every value below targets through 1000.
- Exhaust benchmark percentages for bases through 1000 that meet divisibility constraints.
- Property-test at least 10,000 deterministic seeds per family/level.
- Round-trip every inverse relationship by substitution.
- Verify transformed addition, subtraction, multiplication, and division routes equal direct arithmetic.
- Verify percentage components sum to direct `(p×base)/100`.

### Distribution tests

Large fixed-seed samples must verify:

- carry/boundary-crossing classes are balanced;
- compensation signs both occur;
- operand order is not fixed;
- negative subtraction results appear only at declared levels and target rates;
- core multiplication facts are not dominated by `2,5,10`;
- all landmark multipliers and division factor structures recur;
- complements cover low/middle/high remainder bands;
- percentage answers and decompositions are balanced;
- identity, zero, and repeated rendered items remain below quotas;
- specialized optional strategies do not crowd out fundamentals.

### Parser tests

Test signs, surrounding whitespace, digit grouping by spaces/underscores/commas, leading zeroes, negative zero, and exact integer limits. Reject blank input, decimal points, scientific notation, fractions, percent signs in ordinary integer fields, extra words, and non-finite/out-of-range values.

## 13. Coverage requirements

Over long practice:

- direct random-range arithmetic never dominates strategy-constructed items;
- each operation is practiced both forward and, after mastery, in an inverse form;
- difficulty changes strategy demand rather than only magnitude;
- addition includes place value, bridge, compensation, and compatible grouping;
- subtraction includes decomposition, equal compensation, counting up, and negative results;
- multiplication covers the full core fact matrix and multiple extension strategies;
- every division shown is exact and mentally factorable;
- complements support later bridge/count-up skills;
- percentages cover benchmark, composite, and inverse relationships;
- wrong-answer patterns influence selection at misconception level;
- recent structural repetition is suppressed;
- every family remains capable of producing many valuable instances.

## 14. Topic-level quality checklist

- [ ] Every family has a specific mental strategy or inverse relationship.
- [ ] Levels are not defined only by operand ranges.
- [ ] The intended route is at most four meaningful mental steps.
- [ ] Addition and subtraction compensation directions are explicit.
- [ ] Negative differences are introduced deliberately and graded as ordinary integers.
- [ ] Multiplication facts track commuted pairs without displaying only one order.
- [ ] Landmark multiplication operands make division/halving steps exact.
- [ ] Every generated division has an integer quotient.
- [ ] Complements distinguish a stated target from the next strictly greater multiple.
- [ ] Every generated percentage result and worked component is integral.
- [ ] Percentage word problems and rounding remain outside this topic.
- [ ] Missing-term families have exactly one valid integer answer.
- [ ] Feedback teaches a mental route and diagnoses recognizable errors.
- [ ] Every family has three valid instantiated examples.
- [ ] Property, distribution, parser, and inverse-round-trip tests pass.
- [ ] Repeated practice improves fluency or strategy choice rather than written-algorithm endurance.

## 15. Stable identifiers and recommended navigation

Navigation may retain the six current category labels:

- Addition
- Subtraction
- Multiplication
- Division
- Complements
- Percentages

Stable family identifiers are the backticked names in this specification. Progress migration from the current category-by-level model should retain historical category attempts for display but begin new family/strategy mastery records without pretending old aggregate attempts identify a specific strategy weakness.
