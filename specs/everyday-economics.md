# Everyday Economics — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Everyday Economics

### Topic goal

Develop reliable quantitative judgment for common price, rate, time, inflation, subscription, and risk decisions. The learner should become able to identify the relevant base and unit, choose the correct relationship, calculate it accurately, and interpret the result.

This is applied numeracy practice, not financial, tax, legal, investment, or purchasing advice.

### Scope

The topic includes:

- unit prices and offer comparison;
- compatible metric or US customary quantity conversions used in unit pricing;
- discounts, sales tax, and successive percentage adjustments;
- absolute change, percent change, and inverse percent-change questions;
- simple interest and annually compounded interest;
- nominal prices, cumulative inflation, and purchasing power;
- recurring subscription totals, common-horizon comparisons, effective monthly cost, and break-even duration;
- expected monetary value for explicitly stated finite outcomes;
- break-even prices or probabilities in simple expected-value decisions.

The exercises use stylized, fully specified scenarios. Rates are generated values, not current market, tax, or inflation data.

Expected prior knowledge:

- decimal arithmetic;
- multiplication and exact division;
- converting a percentage such as `15%` to `0.15`;
- reading a simple table;
- understanding months and years.

### Exclusions

Do not include:

- recommendations to buy, invest, borrow, insure, subscribe, or gamble;
- current prices, tax laws, inflation figures, interest rates, or exchange rates;
- currency conversion;
- progressive taxes, deductions, exemptions, tips, tariffs, or tax-inclusive legal conventions;
- APR/APY conversion, daily compounding, variable rates, loan amortization, payments, fees not explicitly stated, or present-value discounting;
- investment volatility, utility functions, risk aversion, variance, portfolio theory, or “guaranteed return” language;
- CPI basket construction, hedonic adjustment, wage indexes, or macroeconomic forecasting;
- probability estimation from real-world events;
- expected-value claims about one individual trial;
- fractional physical quantities requiring domain-specific measurement precision;
- hidden assumptions about when a fee, discount, tax, interest credit, or free month occurs.

### Normative quantitative model

#### Decimal values and rounding

All semantic values must use exact decimal or rational arithmetic. Binary floating-point may not determine canonical answers.

- Currency has a declared minor-unit precision, normally two decimals.
- Money is rounded to the nearest minor unit using **round half away from zero**.
- Percent answers are rounded to two percentage-point decimals unless the family declares an exact integer percentage.
- Unit prices are rounded to the displayed currency precision per declared comparison unit.
- Intermediate values are not rounded unless the question explicitly models a per-period or per-item transaction rounded at that stage.
- When a question says “round only the final answer,” all internal computation remains exact.
- Negative zero displays as zero.

For a multi-stage price:

1. calculate each exact stage from its explicitly stated base;
2. retain exact values internally;
3. round the requested final amount once.

If a real-world convention could reasonably require stage rounding, the prompt must state it. Otherwise such instances are excluded.

#### Rates and percentage bases

- A rate `r%` is exact rational `r/100`.
- `p% of x = x × p/100`.
- Percent change from old `o` to new `n`, for `o>0`, is `(n-o)/o × 100%`.
- A decrease is a negative percent change unless the prompt asks for the non-negative “percent decrease.”
- Successive changes multiply factors. A `20%` increase followed by a `20%` decrease has factor `1.2×0.8=0.96`, not 1.
- Discount and tax amounts are calculated from the explicitly named price base.
- Simple-interest balance is `P(1+rt)`.
- Annual compound balance is `P(1+r)^t` for integer years.
- Constant annual inflation uses the same compound factor.
- Purchasing power of future money in today's currency is `futureNominal/(1+i)^t`.

#### Time

- One year is exactly 12 months for subscription comparisons.
- “Monthly” charges occur once per billed month.
- An annual fee covers exactly 12 months unless stated otherwise.
- Interest and inflation questions use years; fractional years are excluded in the initial scope.
- Free months reduce the number of monthly charges, not setup fees, unless stated.

#### Probability and expected value

- Probabilities are exact and lie in `0..100%`.
- A complete multi-outcome distribution sums to exactly `100%`.
- Expected value is `Σ probability × net outcome`.
- When rewards are gross and a certain cost is separate, subtract the cost once after summing expected gross rewards.
- A `0` outcome must be shown when its probability is needed to complete the distribution.

### Units and localization

Currency symbol and number formatting are presentation settings. Changing them must not convert amounts or change semantic values.

Metric unit-price pairs may use:

- `g ↔ kg` with `1000 g = 1 kg`;
- `mL ↔ L` with `1000 mL = 1 L`;
- `item`, `100 g`, `100 mL`, `kg`, and `L` as comparison units.

US-unit mode may use:

- `oz ↔ lb` with `16 oz = 1 lb`;
- `fl oz`, `item`, `lb`, and explicitly chosen package units.

Do not convert between mass and volume or between metric and US systems inside one question. `fl oz` must be labeled as volume and never shortened to ambiguous `oz` when mass ounces also appear.

### Global answer conventions

The prompt must label the expected semantic type and unit.

Money answers:

- accept an optional configured currency symbol/code;
- accept either configured decimal separator;
- accept grouping separators when unambiguous;
- are correct when the parsed value rounds to the canonical minor-unit value;
- must not accept a percent sign.

Percent answers:

- accept `12.5` or `12.5%`;
- interpret both as `12.5%`, never as `0.125%`;
- do not accept decimal fraction `0.125` as `12.5%` unless the prompt explicitly requests a decimal rate.

Unit-price answers may include the displayed `/unit` suffix, but the numeric field alone is sufficient. Integer count/month answers must be exact integers. Yes/no and offer-selection questions should use controls. Multiple named fields are required when partial reasoning is itself assessed.

### Difficulty philosophy

Difficulty should increase through:

- identifying the correct comparison base;
- converting compatible units before comparison;
- distinguishing an amount from a final value;
- applying inverse relationships;
- using a common time horizon;
- separating nominal from real values;
- compounding over multiple periods;
- distinguishing additive from multiplicative percentage reasoning;
- summing several mutually exclusive probability outcomes;
- solving a break-even equality.

Difficulty must not increase merely through larger prices, more decimal places, longer stories, obscure products, unrealistic rates, or tedious exponentiation. Calculator use may be available, but the conceptual operation must remain the primary challenge.

### Global generation and metadata

Every question stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `answerKind`, `currencyPrecision`, `units`, `timeBasis`, `roundingStage`, `difficultyDimensions`, `misconceptionsTargeted`, `parameters`, `exactAnswer`, `roundedAnswer`, `workedSteps`, and `structuralSignature`.

Generate semantic parameters first. Derive displayed values from exact rationals/decimals, independently recompute the answer, apply rejection rules, and only then localize and render.

Avoid the same structural signature among the last 20 questions and exact rendered duplicates among the last 100. A signature includes family, direction, unit conversion, rate structure, number of stages/outcomes, sign/comparison class, and rounding class—not merely exact numbers.

### Global feedback and distractors

Feedback begins with the relationship and units, then calculation, then interpretation. Incorrect feedback should identify base, unit, time-horizon, additive/multiplicative, gross/net, or rounding errors when a submitted answer matches one.

Choice distractors must come from named misconceptions. Remove duplicates and any distractor that rounds to the correct displayed answer. Regenerate when fewer than three distinct plausible choices remain.

## 2. Category: Unit Prices

### Category purpose

Train normalization of price by quantity so differently sized offers can be compared on a common physical or item basis.

### Learn

Unit price is `price ÷ quantity`, after converting quantities to the same unit:

```text
6.00 for 3 kg = 2.00/kg
4.50 for 750 g = 6.00/kg
```

Compare exact unit prices, not only package totals. Lower unit price means cheaper per unit when all other product qualities are assumed equal.

### Prerequisites

Decimal division and compatible unit conversion.

### Category boundaries

No quality, waste, consumption, tax, membership, delivery, or currency differences unless explicitly included. Those factors can make a real decision different, so feedback must say “cheaper per stated unit,” not “better.”

### Subcategories

1. Direct Unit Price
2. Offer Comparison
3. Inverse Package Relationships

### Common misconceptions

- Dividing quantity by price.
- Comparing package prices without quantities.
- Comparing `price/kg` with `price/100 g` as though units matched.
- Treating `750 g` as `0.75 g` or `7.5 kg`.
- Rounding each offer so coarsely that a true difference disappears.
- Claiming the larger package is automatically cheaper per unit.

## 2.1 Subcategory: Direct Unit Price

### Family `unit_price_direct`

**Learner task.** Calculate price per named unit from one package.

**Response mode.** Decimal money per unit.

**Template.** `{packagePrice} for {quantity} {quantityUnit}. What is the price per {comparisonUnit}? Round to {currencyDecimals} decimals.`

**Placeholders.** Units are identical at Levels 1–2. Later, quantity is converted using the global unit table. Package price is positive; quantity is positive.

**Derivation.** Convert package quantity to comparison units `q`; exact unit price is `price/q`; round only final unit price.

**Constraints and rejection.** At early levels choose terminating, friendly quotients. Later levels may require rounding, with exact answer not at a half-rounding ambiguity caused by display truncation. Reject package prices below one minor unit, zero quantities, mixed physical dimensions, and unrealistic unit-price extremes.

**Difficulty.**

- Level 1: integer quantities and exact two-decimal unit price.
- Level 2: non-integer exact quotient or per-item packs.
- Level 3: `g↔kg`, `mL↔L`, or `oz↔lb`.
- Level 4: comparison unit `100 g`/`100 mL`.
- Level 5: rounding-sensitive but realistic quotient.

**Feedback.** Show quantity conversion first, then division and final rounding. Diagnose reversed division and factor-of-10/100/1000 conversion errors.

**Examples.**

1. `6.00 for 3 kg. Price per kg?` Answer `2.00/kg`; `6÷3`. Level 1.
2. `4.50 for 750 g. Price per kg?` Answer `6.00/kg`; `750 g=0.75 kg`, then `4.50÷0.75`. Level 3.
3. `7.49 for 18 items. Price per item?` Answer `0.42/item`; exact `0.4161…`, rounded once. Level 5.

**Implementation and validation.** Use exact minor units and rational quantities. Verify dimensional compatibility and recompute quotient. Coverage balances unit, conversion direction, exact/rounded result, and quantity scale.

## 2.2 Subcategory: Offer Comparison

### Family `unit_price_compare`

**Learner task.** Select the cheaper-per-unit offer and optionally state the savings per comparison unit.

**Response mode.** Single-choice offer; optional money field for difference.

**Template.**

```text
Offer A: {priceA} for {quantityA} {unitA}
Offer B: {priceB} for {quantityB} {unitB}
Which is cheaper per {comparisonUnit}?
```

**Derivation.** Convert both quantities to comparison unit. Compare exact rational unit prices by cross multiplication. Display rounded unit prices after the decision. Difference is the absolute exact unit-price difference rounded to money precision.

**Constraints and rejection.** Exactly one offer is cheaper unless the prompt explicitly offers `same unit price`. Reject cases whose exact unit prices differ but round to the same displayed value; reject differences below one displayed minor unit per comparison unit. Balance A/B winners.

**Difficulty.** Level 1 same quantities. Level 2 different quantities, same unit. Level 3 compatible unit conversion. Level 4 three offers. Level 5 includes a fixed coupon/fee explicitly allocated to one purchase.

**Multiple-choice distractors.** Higher package price assumed worse, larger package assumed better, comparison after reversing one division, or `same` when rounded package prices look similar.

**Feedback.** Show both exact-to-sufficient-precision unit prices with identical units. Avoid saying the selected offer is universally better.

**Examples.**

1. `A: 4.00 for 2 kg; B: 5.50 for 2 kg. Cheaper per kg?` Answer `A`; `2.00/kg` versus `2.75/kg`. Level 1.
2. `A: 3.60 for 600 g; B: 5.50 for 1 kg. Cheaper per kg?` Answer `B`; `6.00/kg` versus `5.50/kg`. Level 3.
3. `A: 8.40 for 24 items; B: 5.40 for 15 items. Cheaper per item?` Answer `A`; `0.35` versus `0.36`. Level 4.

**Implementation and validation.** Compare rationals without rounding; assert unique choice after displayed rounding. For three-offer variations, require one unique minimum. Coverage tracks winner position and misleading package-price/size cues.

## 2.3 Subcategory: Inverse Package Relationships

### Family `unit_price_missing_value`

**Learner task.** Find package price or quantity from unit price and the other value.

**Response mode.** Money for price; decimal quantity for quantity.

**Templates.** `At {unitPrice} per {unit}, what does {quantity} {unit} cost?` and `{packagePrice} costs {unitPrice} per {unit}. What quantity is in the package?`

**Derivation.** Price=`unitPrice×quantity`; quantity=`packagePrice/unitPrice`, after compatible-unit conversion.

**Constraints and rejection.** Quantity answers use realistic declared precision and must be exact at that precision. Reject ambiguous packaging units and cases requiring rounded unit price to reconstruct a supposedly exact package price unless the prompt says the unit price is exact.

**Difficulty.** Level 1 missing price with integer quantity. Level 2 missing quantity. Level 3 converted units. Level 4 infer number of items/packages. Level 5 inverse with a rounded final money result.

**Feedback.** State whether multiplication or division recovers the missing value and show units cancelling.

**Examples.**

1. `At 2.40/kg, what do 3 kg cost?` Answer `7.20`. Level 1.
2. `A package costs 9.00 at exactly 3.60/kg. What mass?` Answer `2.5 kg`. Level 2.
3. `At 1.25 per 100 g, what do 750 g cost?` Answer `9.38`; `7.5×1.25=9.375`, rounded once. Level 4.

**Implementation and validation.** Substitute the answer into the direct unit-price relationship. Validate dimensional units and declared exact-versus-rounded inputs.

### Cross-family progression for Unit Prices

Direct unit prices precede comparisons. Unit conversion is introduced in direct questions before mixed-unit offers. Missing-value relationships follow forward calculation. If an offer comparison fails, diagnose each unit price separately before asking another comparison.

## 3. Category: Discounts and Tax

### Category purpose

Train identification of the percentage base and calculation of discount, discounted subtotal, tax amount, and final price as distinct quantities.

### Learn

A `p%` discount removes `p%` of the original price; the customer pays `(100-p)%`. Sales tax is calculated from the explicitly stated taxable subtotal:

```text
80.00 at 25% off:
discount = 20.00
discounted subtotal = 60.00
8% tax on 60.00 = 4.80
final price = 64.80
```

Successive discounts multiply remaining-price factors. `20% off, then 10% off` means paying `0.8×0.9=72%`, a 28% total discount—not 30%.

### Prerequisites

Percentages of an amount and money rounding.

### Category boundaries

Tax rules are fictional and fully stated. Do not imply a generated rate applies in a real jurisdiction. Coupons, fixed fees, rebates, and tax-inclusive pricing appear only in explicitly named families.

### Subcategories

1. Discount Amount and Sale Price
2. Tax Amount and Taxed Price
3. Multi-Stage Adjustments
4. Inverse Price Questions

### Common misconceptions

- Paying the discount percent rather than the remainder percent.
- Returning the discount amount when final price was requested.
- Calculating tax from original price when taxable subtotal is discounted price.
- Adding discount and tax rates as though they share a signed base.
- Adding successive discount percentages.
- Rounding each stage despite a final-only instruction.

## 3.1 Subcategory: Discount Amount and Sale Price

### Family `discount_single`

**Learner task.** Calculate either discount amount or price after one percentage discount.

**Response mode.** Money.

**Template.** `Original price: {price}. Discount: {rate}. What is the {requested: discount amount / sale price before tax}?`

**Derivation.** Discount=`price×rate`; sale price=`price×(1-rate)`.

**Constraints and rejection.** Prompt emphasizes requested quantity. Rates generally `5,10,15,20,25,30,40,50,60,75%`; values produce useful exact or rounding examples. Reject a case where discount amount equals sale price unless deliberately targeting 50% terminology.

**Difficulty.** Level 1 friendly 10/25/50%. Level 2 distinguish amount versus final. Level 3 nontrivial rates. Level 4 rounding at final. Level 5 missing verbal cue and competing amount shown.

**Feedback.** Label original, removed amount, and remaining amount. Diagnose swapping discount with sale price.

**Examples.**

1. `80.00 at 25% off. Discount amount?` Answer `20.00`. Level 1.
2. `80.00 at 25% off. Sale price?` Answer `60.00`. Level 1.
3. `59.95 at 15% off. Sale price, rounded once?` Answer `50.96`; exact `50.9575`. Level 4.

**Implementation and validation.** Exact rate multiplication; assert original=discount+sale exact before rounding. Balance requested quantity and rate.

## 3.2 Subcategory: Tax Amount and Taxed Price

### Family `tax_single`

**Learner task.** Calculate tax amount or total from a stated pre-tax price and fictional flat rate.

**Response mode.** Money.

**Template.** `Pre-tax price: {subtotal}. Tax rate: {rate}. What is {tax amount / total after tax}?`

**Derivation.** Tax=`subtotal×rate`; total=`subtotal×(1+rate)`.

**Constraints and rejection.** Always say `pre-tax`. Rates are generated practice values. Do not include tax-inclusive reverse calculation in this family.

**Difficulty.** Level 1 5/10%. Level 2 distinguish amount/total. Level 3 rates such as 6/8/12%. Level 4 rounding. Level 5 several taxable line items only after subtotal is explicitly provided or easily summed.

**Feedback.** Identify taxable base and separate added amount from total.

**Examples.**

1. `Pre-tax 40.00, tax 5%. Tax amount?` Answer `2.00`. Level 1.
2. `Pre-tax 75.00, tax 8%. Total?` Answer `81.00`. Level 2.
3. `Pre-tax 19.99, tax 6%. Total, rounded once?` Answer `21.19`; exact `21.1894`. Level 4.

**Implementation and validation.** Assert exact total=subtotal+tax. Track amount/total, rate, and rounding class.

## 3.3 Subcategory: Multi-Stage Adjustments

### Family `discount_then_tax`

**Learner task.** Calculate discounted subtotal, tax on that subtotal, and/or final price.

**Response mode.** Final money input at early levels; multiple named money fields at diagnostic levels.

**Template.** `Original {price}; {discount}% discount; then {tax}% tax on the discounted subtotal. What is the final price? Round only the final result.`

**Derivation.** `subtotal=price×(1-discount)`; `tax=subtotal×taxRate`; `final=subtotal×(1+taxRate)`.

**Constraints and rejection.** Tax base is explicit. At least half of diagnostic items make tax-on-original distractor differ by multiple minor units. Do not claim operation order changes the final multiplicative product; the pedagogical distinction is the named base and intermediate amounts.

**Difficulty.** Level 2 friendly stages. Level 3 both stages nontrivial. Level 4 multiple named fields expose base errors. Level 5 final-only rounding versus explicitly stage-rounded controlled variation.

**Feedback.** Show stage table with exact bases. If answer matches tax on original, identify it. If the learner adds signed rates, show factor multiplication.

**Examples.**

1. `100.00, 20% off, then 10% tax on sale subtotal. Final?` Answer `88.00`. Level 2.
2. `80.00, 25% off, then 8% tax. Final?` Answer `64.80`. Level 3.
3. `59.95, 15% off, then 7% tax; round final only.` Answer `54.52`; exact `59.95×0.85×1.07=54.524525`. Level 5.

**Implementation and validation.** Recompute both stages exactly. Calculate misconception candidates: `price×(1-discount+tax)`, tax on original added to sale subtotal, and discount amount mistaken for subtotal.

### Family `successive_discounts`

**Learner task.** Calculate final price or equivalent total discount after two successive discounts.

**Response mode.** Money or percent, explicitly labeled.

**Template.** `{price} receives {rate1}% off, then {rate2}% off the reduced price. What is the {final price / equivalent total discount}?`

**Derivation.** Remaining factor `(1-r1)(1-r2)`; final=`price×factor`; equivalent discount=`1-factor`.

**Constraints and rejection.** Both rates positive and below 100. Avoid rate pairs whose sum equals equivalent discount after rounding. Requested type explicit.

**Difficulty.** Level 2 equal friendly rates. Level 3 unequal rates. Level 4 equivalent discount. Level 5 inverse comparison against one coupon.

**Feedback.** Show second discount's reduced base and factor multiplication. Diagnose adding rates.

**Examples.**

1. `100.00, 20% off then 10% off. Final?` Answer `72.00`. Level 2.
2. `200.00, 25% off then 20% off. Final?` Answer `120.00`. Level 3.
3. `30% off then 10% off. Equivalent total discount?` Answer `37%`; remaining factor `0.7×0.9=0.63`. Level 4.

**Implementation and validation.** Compute exact factors; assert equivalent rate in `0..100%`. Balance final/equivalent requests and misconception separation.

## 3.4 Subcategory: Inverse Price Questions

### Family `price_before_adjustment`

**Learner task.** Recover original/pre-tax price from a final amount and one stated rate relationship.

**Response mode.** Money.

**Templates.** `After a {discount}% discount, price is {sale}. Original price?` and `After {tax}% tax, total is {total}. Pre-tax price?`

**Derivation.** Original=`sale/(1-discount)`; pre-tax=`total/(1+tax)`.

**Constraints and rejection.** Construct original first so inverse is exact or rounds unambiguously. Prompt says whether given final is exact to minor units; reject cases where many originals could round to it. Multi-stage inverse is excluded initially.

**Difficulty.** Level 2 50/25% discount. Level 3 other friendly factors. Level 4 reverse tax. Level 5 exact-money inverse requiring decimal division.

**Feedback.** Explain division by remaining/growth factor, not “add the percent back.” Detect naive `sale×(1+discount)`.

**Examples.**

1. `After 25% off, price is 60.00. Original?` Answer `80.00`; divide by `0.75`. Level 2.
2. `After 20% off, price is 96.00. Original?` Answer `120.00`. Level 3.
3. `After 8% tax, total is exactly 81.00. Pre-tax?` Answer `75.00`; divide by `1.08`. Level 4.

**Implementation and validation.** Forward-apply the rate and assert exact reconstruction under stated rounding convention. Track discount/tax inverse and naive-add-back distractor.

### Cross-family progression for Discounts and Tax

Discount amount and sale price are learned before tax. Combined stages appear only after both bases are stable. Successive discounts precede inverse multi-rate comparisons. If final price is wrong, use named intermediate fields to isolate percent, base, and rounding errors.

## 4. Category: Percent Change

### Category purpose

Train comparison of change to the original reference value, including direction, inverse recovery, and the asymmetry of successive increases and decreases.

### Learn

```text
absolute change = new - old
percent change = (new - old) ÷ old × 100%
```

From 50 to 60, change is 10 and percent change is `10/50=20%`. From 60 back to 50 is `-10/60=-16.67%`; reversing endpoints changes the denominator.

### Prerequisites

Percentage calculation and signed differences.

### Category boundaries

No percentage-point questions unless the quantities themselves are explicitly rates. No CAGR, index construction, or attribution.

### Subcategories

1. Absolute and Percent Change
2. Forward and Inverse Values
3. Successive Changes

### Common misconceptions

- Dividing by new instead of old.
- Reporting absolute change as a percent.
- Dropping the sign on a decrease.
- Treating reverse changes as equal and opposite percentages.
- Adding successive percent changes.
- Confusing percent change with percentage-point change.

## 4.1 Subcategory: Absolute and Percent Change

### Family `percent_change_direct`

**Learner task.** Calculate signed percent change from old to new.

**Response mode.** Percent number.

**Template.** `Old value: {old}. New value: {new}. What is the signed percent change?`

**Derivation.** `(new-old)/old×100`, with `old>0`.

**Constraints and rejection.** Old is strictly positive. Construct exact rates first, then new value, so intended answers are exact or have controlled rounding. Balance increase/decrease; unchanged cases are diagnostics under 10%.

**Difficulty.** Level 1 friendly increases. Level 2 decreases. Level 3 rounding to two percentage decimals. Level 4 decimal/money values. Level 5 competing old/new scales.

**Feedback.** Name change and original denominator. If answer matches denominator `new`, diagnose it.

**Examples.**

1. `Old 50, new 60.` Answer `20%`; `10/50`. Level 1.
2. `Old 80, new 60.` Answer `-25%`; `-20/80`. Level 2.
3. `Old 240, new 275.` Answer `14.58%`; exact `35/240×100=14.5833…`. Level 3.

**Implementation and validation.** Exact rational rate then final percent rounding. Balance sign, denominator cues, and exact/rounded cases.

### Family `absolute_vs_percent_change`

**Learner task.** Give both absolute and percent change with correct units.

**Response mode.** Two named fields.

**Template.** `A value changes from {old} {unit} to {new} {unit}. Give absolute change and signed percent change.`

**Derivation.** Absolute=`new-old` in source unit; percent=`absolute/old×100`.

**Constraints and rejection.** Unit may be currency, count, or neutral units. Do not mix units. Choose cases where numerical absolute and percent values differ to expose confusion.

**Difficulty.** Level 1 positive integer changes. Level 2 decreases. Level 3 decimal units. Level 4 asks interpretation of both fields.

**Feedback.** Place the two results side-by-side with units. Detect swapped fields.

**Examples.**

1. `40 units to 50 units.` Answer `+10 units; +25%`. Level 1.
2. `200.00 to 170.00.` Answer `-30.00; -15%`. Level 2.
3. `1.20/kg to 1.50/kg.` Answer `+0.30/kg; +25%`. Level 3.

**Implementation and validation.** Validate each field separately. Ensure displayed rounding cannot make old/new appear equal.

## 4.2 Subcategory: Forward and Inverse Values

### Family `value_after_percent_change`

**Learner task.** Calculate a new value after a signed percent increase or decrease.

**Response mode.** Decimal or money matching input.

**Template.** `{old} changes by {signedRate}. What is the new value?`

**Derivation.** `new=old×(1+rate)`.

**Constraints and rejection.** Decrease rate greater than `-100%`; no negative new value. Construct realistic/friendly amounts and round only as specified.

**Difficulty.** Level 1 benchmark increase. Level 2 decrease. Level 3 signed rates mixed. Level 4 rounded decimals. Level 5 compare with absolute-change distractor.

**Feedback.** Show growth/remaining factor. Diagnose adding the rate number directly.

**Examples.**

1. `80 increases by 25%. New value?` Answer `100`. Level 1.
2. `240 decreases by 15%. New value?` Answer `204`. Level 2.
3. `59.95 increases by 7%. New money value?` Answer `64.15`; exact `64.1465`. Level 4.

**Implementation and validation.** Forward factor exact; verify direct rate recomputes from unrounded values.

### Family `original_before_percent_change`

**Learner task.** Recover original value from new value and signed percent change.

**Response mode.** Decimal or money.

**Template.** `After a {signedRate} change, the value is {new}. What was the original?`

**Derivation.** `old=new/(1+rate)`.

**Constraints and rejection.** Growth factor positive. Construct old first and reject inverse ambiguity introduced by rounded displayed new values unless the prompt declares it exact.

**Difficulty.** Level 2 50/25% changes. Level 3 mixed increases/decreases. Level 4 decimals. Level 5 distinguish inverse factor from applying opposite rate.

**Feedback.** Divide by the original change factor. Explicitly show why applying the opposite percentage is generally wrong.

**Examples.**

1. `After a 25% increase, value is 100. Original?` Answer `80`. Level 2.
2. `After a 20% decrease, value is 96. Original?` Answer `120`. Level 3.
3. `After a 10% increase, value is exactly 82.50. Original?` Answer `75.00`. Level 4.

**Implementation and validation.** Forward-reapply exact factor. Calculate opposite-rate misconception candidate.

## 4.3 Subcategory: Successive Changes

### Family `successive_percent_changes`

**Learner task.** Calculate final value or net percent change after two successive changes.

**Response mode.** Decimal/money or percent as labeled.

**Template.** `{start} changes by {rate1}, then by {rate2} from the new value. What is {final / net signed percent change}?`

**Derivation.** Combined factor `(1+r1)(1+r2)`; final=`start×factor`; net percent=`(factor-1)×100`.

**Constraints and rejection.** Rates are above `-100%`. Include increase/decrease pairs and same-direction pairs. Reject cases where additive shortcut accidentally equals rounded correct answer.

**Difficulty.** Level 2 two friendly same-direction changes. Level 3 increase then decrease. Level 4 net-rate request. Level 5 compare sequences or three stages only if calculation remains concise.

**Feedback.** Show base updating between stages and factor multiplication. Diagnose sum-of-rates and cancellation assumptions.

**Examples.**

1. `100 increases 10%, then 20%. Final?` Answer `132`; `100×1.1×1.2`. Level 2.
2. `100 increases 20%, then decreases 20%. Final?` Answer `96`. Level 3.
3. `Increase 25%, then decrease 10%. Net percent change?` Answer `+12.5%`; `1.25×0.9=1.125`. Level 4.

**Implementation and validation.** Exact factor product, independent staged computation, and misconception candidates. Balance direction sequence and request type.

### Family `reverse_change_comparison`

**Learner task.** Compare forward and reverse percent changes between the same two positive values.

**Response mode.** Two named percent fields or single-choice comparison.

**Template.** `A changes from {low} to {high}, then consider {high} back to {low}. Give both signed percent changes.`

**Derivation.** Forward=`(high-low)/low`; reverse=`(low-high)/high`.

**Constraints and rejection.** Values unequal and positive. Choose pairs yielding instructive exact/simple rates or controlled rounding.

**Difficulty.** Level 2 50↔100. Level 3 non-double pairs. Level 4 rounded rates. Level 5 identify required reverse rate to restore original.

**Feedback.** Highlight the different denominators.

**Examples.**

1. `50→100 and 100→50.` Answer `+100%; -50%`. Level 2.
2. `50→60 and 60→50.` Answer `+20%; -16.67%`. Level 3.
3. `80 rises 25% to 100. What decrease restores 80?` Answer `20% decrease`. Level 4.

**Implementation and validation.** Independently compute both ratios and round each only at display. Track ratio structures and signs.

### Cross-family progression for Percent Change

Direct percent change follows absolute change. Forward new-value questions precede inverse originals. Successive and reverse comparisons appear only after the original denominator is reliable. If sign is wrong, diagnose direction before introducing compounding.

## 5. Category: Interest

### Category purpose

Train precise distinction between principal, interest earned, ending balance, simple growth, and compound growth under an explicitly stated annual model.

### Learn

Simple interest is calculated from the original principal every year:

```text
interest = P × r × t
balance = P(1 + rt)
```

Annual compound interest applies each year's rate to the current balance:

```text
balance = P(1+r)^t
```

At `5%` for two years, `100.00` becomes `110.00` with simple interest and `110.25` with annual compounding.

### Prerequisites

Percentages, multiplication, exponents by repeated multiplication, and money rounding.

### Category boundaries

No APR/APY conversion, subannual compounding, deposits/withdrawals, loans, amortization, variable rates, present value, or claims about real products. Interest may be negative only in an explicitly labeled mathematical extension, disabled by default.

### Subcategories

1. One-Period Interest
2. Simple Interest
3. Annual Compound Interest
4. Comparison and Inverse Relationships

### Common misconceptions

- Returning interest earned when ending balance was requested, or vice versa.
- Using rate `5` rather than `0.05`.
- Multiplying principal by years but omitting rate.
- Compounding simple interest.
- Applying compound rate always to original principal.
- Rounding every year's balance despite final-only rounding.
- Treating a multi-year total rate as the annual rate.

## 5.1 Subcategory: One-Period Interest

### Family `interest_one_period`

**Learner task.** Calculate interest earned or ending balance for one annual period.

**Response mode.** Money.

**Template.** `Principal {principal}; annual rate {rate}; one year. What is {interest earned / ending balance}?`

**Derivation.** Interest=`P×r`; balance=`P+interest`. Simple and annual compound coincide for one period.

**Constraints and rejection.** Requested quantity explicit. Rates `1..15%` generally; positive principal. Include exact and final-rounding cases.

**Difficulty.** Level 1 benchmark rates and interest amount. Level 2 balance versus interest. Level 3 decimal rates. Level 4 rounding-sensitive values.

**Feedback.** Label principal, earned amount, and total. Diagnose swapping interest/balance.

**Examples.**

1. `Principal 200.00 at 5% for one year. Interest earned?` Answer `10.00`. Level 1.
2. `Principal 200.00 at 5%. Ending balance after one year?` Answer `210.00`. Level 1.
3. `Principal 1,234.50 at 3.5%. Interest earned, rounded once?` Answer `43.21`; exact `43.2075`. Level 4.

**Implementation and validation.** Exact decimal rate multiplication; assert balance=principal+interest before rounding. Balance requested quantity.

## 5.2 Subcategory: Simple Interest

### Family `simple_interest_multi_period`

**Learner task.** Calculate total simple interest or ending balance over integer years.

**Response mode.** Money.

**Template.** `Principal {principal}; simple interest {rate} per year; {years} years. What is {total interest / ending balance}?`

**Derivation.** Total interest=`P×r×t`; ending balance=`P+interest`.

**Constraints and rejection.** Years `2..10`; fixed annual rate; no compounding. Choose values that keep percentage multiplication meaningful.

**Difficulty.** Level 2 two/three years. Level 3 distinguish annual from total rate. Level 4 decimal rates and rounding. Level 5 inverse requested value.

**Feedback.** Show equal interest amount per year and total. If answer matches compounding, diagnose it.

**Examples.**

1. `500.00 at 4% simple for 3 years. Total interest?` Answer `60.00`. Level 2.
2. `500.00 at 4% simple for 3 years. Ending balance?` Answer `560.00`. Level 2.
3. `1,250.00 at 2.5% simple for 7 years. Ending balance?` Answer `1,468.75`. Level 4.

**Implementation and validation.** Compare formula with repeated equal annual additions. Track years, rate, and interest/balance request.

## 5.3 Subcategory: Annual Compound Interest

### Family `compound_interest_annual`

**Learner task.** Calculate ending balance or total interest after annual compounding.

**Response mode.** Money.

**Template.** `Principal {principal}; {rate} annual interest, compounded yearly; {years} years. What is {ending balance / total interest}? Round only the requested final amount.`

**Derivation.** Exact balance=`P×(1+r)^t`; interest=`balance-P`.

**Constraints and rejection.** Integer years `2..8`; rate normally `1..10%`. Values should permit repeated-factor or calculator-assisted practice without huge numbers. No intermediate rounding unless explicitly varied.

**Difficulty.** Level 2 two years with friendly rate. Level 3 three/four years. Level 4 total-interest request and decimal rate. Level 5 compare final-only with explicitly annual-rounded ledger.

**Feedback.** Show a compact year/factor table. Diagnose simple-interest answer and principal-omitted interest.

**Examples.**

1. `100.00 at 5%, compounded yearly for 2 years. Balance?` Answer `110.25`. Level 2.
2. `1,000.00 at 10%, compounded yearly for 3 years. Balance?` Answer `1,331.00`. Level 3.
3. `800.00 at 2.5%, compounded yearly for 4 years. Total interest?` Answer `83.05`; balance `883.0503125`. Level 4.

**Implementation and validation.** Use exact decimal exponentiation. Compare with repeated exact multiplication; round once. Coverage balances years/rates and requested quantity.

## 5.4 Subcategory: Comparison and Inverse Relationships

### Family `simple_vs_compound`

**Learner task.** Compare simple and annually compounded balances under the same principal, annual rate, and years.

**Response mode.** Two money fields or single-choice larger balance plus difference.

**Derivation.** Compute `P(1+rt)` and `P(1+r)^t`; difference is compound minus simple.

**Constraints and rejection.** `t>=2`, `r>0`. Difference must survive money rounding. Do not ask which is larger without requesting/teaching magnitude.

**Difficulty.** Level 2 two years. Level 3 calculate both. Level 4 difference. Level 5 find when a displayed difference first exceeds a threshold by enumerating a small year set.

**Feedback.** Align annual bases and identify interest-on-interest.

**Examples.**

1. `100.00, 5%, 2 years. Simple and annual-compound balances?` Answer `110.00; 110.25`. Level 2.
2. `1,000.00, 10%, 3 years. Which is larger and by how much?` Answer `compound by 31.00`; simple `1,300`, compound `1,331`. Level 3.
3. `2,000.00, 4%, 5 years. Difference compound minus simple?` Answer `33.31`; compound `2,433.31`, simple `2,400.00`. Level 4.

**Implementation and validation.** Independently calculate both exact balances and rounded requested difference. Reject rounded ties.

### Family `interest_missing_principal`

**Learner task.** Recover principal from an exact ending balance under a stated simple or one-period/annual compound factor.

**Response mode.** Money.

**Template.** `Ending balance {balance} after {years} years at {rate} {kind}. What was the principal?`

**Derivation.** Simple `P=B/(1+rt)`; compound `P=B/(1+r)^t`.

**Constraints and rejection.** Construct principal first and label displayed ending balance exact; reject ambiguity from rounded balance. Limit compound inverse to friendly factors/no logarithms.

**Difficulty.** Level 3 one-period or simple. Level 4 multi-year simple. Level 5 two-year friendly compound.

**Feedback.** Divide by the full growth factor, then forward-check.

**Examples.**

1. `Balance 110.00 after one year at 10%. Principal?` Answer `100.00`. Level 3.
2. `Simple balance 1,200.00 after 4 years at 5%. Principal?` Answer `1,000.00`; factor `1.20`. Level 4.
3. `Annual-compound balance 1,210.00 after 2 years at 10%. Principal?` Answer `1,000.00`; factor `1.21`. Level 5.

**Implementation and validation.** Forward-apply growth factor exactly and assert reconstruction. Track kind and naive subtract-interest distractor.

### Cross-family progression for Interest

One-period amount-versus-balance distinction precedes multi-year models. Teach simple and compound separately, then compare them. Inverse principal appears after forward mastery. If compound answers match simple interest, keep principal/rate fixed and use a two-year stage table.

## 6. Category: Inflation and Purchasing Power

### Category purpose

Train the difference between a future nominal price, cumulative inflation rate, and the real purchasing power of an amount under a simplified constant-rate model.

### Learn

With constant annual inflation `i`:

```text
future price = today's price × (1+i)^years
today-value purchasing power = future nominal amount ÷ (1+i)^years
```

Inflation compounds. A nominal amount increasing at the same rate as prices has unchanged purchasing power in this simplified model.

### Prerequisites

Percent change and annual compounding.

### Category boundaries

Rates are fictional constants. Do not call a generated figure a forecast or a measured CPI result. No basket weighting, substitution effects, taxes, wages, or investment advice.

### Subcategories

1. Future Nominal Prices
2. Cumulative Inflation
3. Purchasing Power and Real Change

### Common misconceptions

- Adding the annual percentage instead of compounding.
- Calling a higher nominal price a gain in purchasing power.
- Multiplying rather than dividing to convert future money to today's purchasing power.
- Subtracting inflation rate from nominal growth rate as an exact multi-year result.
- Treating cumulative inflation as annual rate times years in compound questions.

## 6.1 Subcategory: Future Nominal Prices

### Family `inflated_future_price`

**Learner task.** Calculate future nominal price after constant annual inflation.

**Response mode.** Money.

**Template.** `Today's price {price}; inflation {rate} per year for {years} years. What future nominal price does this model give?`

**Derivation.** `price×(1+i)^t`.

**Constraints and rejection.** Years `1..10`, rate positive `1..10%`; one-year cases introduce, multi-year cases compound. Final-only rounding stated.

**Difficulty.** Level 1 one year. Level 2 two years. Level 3 multi-year friendly rate. Level 4 decimal rate/rounding. Level 5 inverse or comparison context.

**Feedback.** Show factor by year or exponent. Diagnose simple multiplication by `i×t`.

**Examples.**

1. `100.00 at 3% inflation for one year.` Answer `103.00`. Level 1.
2. `100.00 at 5% for two years.` Answer `110.25`. Level 2.
3. `250.00 at 2.5% for four years.` Answer `275.95`; exact `275.95322265625`. Level 4.

**Implementation and validation.** Exact decimal exponentiation and final rounding; compare repeated multiplication.

## 6.2 Subcategory: Cumulative Inflation

### Family `cumulative_inflation_rate`

**Learner task.** Calculate the cumulative price-level increase implied by a constant annual rate.

**Response mode.** Percent.

**Template.** `Inflation is {annualRate} each year for {years} years. What is cumulative inflation?`

**Derivation.** `((1+i)^t-1)×100%`.

**Constraints and rejection.** `t>=2`; rate positive. Choose cases where cumulative differs visibly from `annualRate×years`.

**Difficulty.** Level 2 two years. Level 3 three/four. Level 4 decimal annual rates. Level 5 compare cumulative factors.

**Feedback.** Show compound factor and subtract one. Diagnose simple-rate-times-years.

**Examples.**

1. `5% yearly for 2 years.` Answer `10.25%`. Level 2.
2. `10% yearly for 3 years.` Answer `33.10%`; factor `1.331`. Level 3.
3. `2.5% yearly for 4 years.` Answer `10.38%`; factor `1.103812890625`. Level 4.

**Implementation and validation.** Exact factor; percent rounding once. Track difference from simple approximation.

## 6.3 Subcategory: Purchasing Power and Real Change

### Family `purchasing_power`

**Learner task.** Convert a future nominal amount into today's purchasing power, or find future nominal amount needed to preserve today's purchasing power.

**Response mode.** Money.

**Templates.** `{futureAmount} in {years} years with {inflation} inflation has what purchasing power in today's money?` and `What future nominal amount preserves today's {todayAmount} purchasing power?`

**Derivation.** Today's value=`future/(1+i)^t`; required future=`today×(1+i)^t`.

**Constraints and rejection.** Direction explicit. Construct exact/friendly values or controlled rounding. Do not use the phrase “worth” without naming today's/future currency basis.

**Difficulty.** Level 2 one year. Level 3 multi-year forward requirement. Level 4 inverse purchasing power. Level 5 compare two nominal amounts in same real basis.

**Feedback.** Label nominal year and real base year. Diagnose multiplication/division reversal.

**Examples.**

1. `103.00 next year with 3% inflation: purchasing power in today's money?` Answer `100.00`. Level 2.
2. `Today's 500.00 purchasing power, 4% inflation for 2 years: required future amount?` Answer `540.80`. Level 3.
3. `1,000.00 in 3 years with 5% inflation: today's purchasing power?` Answer `863.84`; divide by `1.157625`. Level 4.

**Implementation and validation.** Apply inverse factors and forward round-trip before rounding. Track direction and nominal/real label.

### Family `real_change_from_nominal`

**Learner task.** Calculate real change when a nominal value and price level grow by stated rates.

**Response mode.** Percent.

**Template.** `A nominal amount changes by {nominalRate}; prices change by {inflationRate}. What is the exact real percent change?`

**Derivation.** Real factor=`(1+nominalRate)/(1+inflationRate)`; real change=`factor-1`.

**Constraints and rejection.** Growth factors positive. Use one-period rates initially. Reject cases where simple subtraction rounds to exact answer, since it would not expose the relationship.

**Difficulty.** Level 3 friendly one-year rates. Level 4 decreases/decimal rates. Level 5 multi-year factors already provided rather than requiring two separate exponentiations.

**Feedback.** Divide nominal growth factor by price growth factor. Show simple rate subtraction only as an approximation and identify it when submitted.

**Examples.**

1. `Nominal +5%, prices +5%. Real change?` Answer `0%`. Level 3.
2. `Nominal +10%, prices +5%. Real change?` Answer `+4.76%`; `1.10/1.05-1`. Level 4.
3. `Nominal +3%, prices +5%. Real change?` Answer `-1.90%`; `1.03/1.05-1`. Level 4.

**Implementation and validation.** Exact rational factor, rounded percent. Generate subtraction-approximation distractor and ensure distinct.

### Cross-family progression for Inflation

Future nominal price follows compound interest. Cumulative inflation separates annual from total rate. Purchasing-power questions then reverse the factor. Real change is last because it combines two indexes. If multiplication/division direction fails, use paired forward/inverse questions with the same factor.

## 7. Category: Subscriptions

### Category purpose

Train conversion of recurring and one-time charges to a common time horizon, including promotions and break-even comparisons.

### Learn

List every cost over the same period:

```text
total = setup fee + billed months × monthly price + stated recurring fees
effective monthly cost = total ÷ months of access
```

An annual price and monthly price cannot be compared until both are expressed over the same number of months. A free month removes a monthly charge but does not remove an unrelated setup fee.

### Prerequisites

Multiplication, money addition, and simple equations.

### Category boundaries

No cancellation law, refunds, prorating, auto-renewal behavior, taxes, inflation, time value of money, or product-quality comparison unless explicitly stated. Plans are stylized, and “cheaper” means lower stated monetary cost over the requested horizon.

### Subcategories

1. Single-Plan Total
2. Effective Monthly Cost
3. Common-Horizon Comparison
4. Break-Even Duration

### Common misconceptions

- Omitting setup/annual fees.
- Charging for free months.
- Dividing by billed months instead of access months for effective cost.
- Comparing monthly sticker prices despite different fees.
- Comparing an annual total with one monthly payment.
- Counting the setup fee once per month.
- Solving a break-even month but ignoring whether months must be whole.

## 7.1 Subcategory: Single-Plan Total

### Family `subscription_total`

**Learner task.** Calculate total cost of one plan over a stated number of access months.

**Response mode.** Money.

**Template.**

```text
Monthly charge: {monthly}
One-time setup fee: {setup}
Access period: {months} months
Free billed months: {freeMonths}
What is total cost?
```

**Derivation.** Charged months=`max(0, months-freeMonths)`; total=`setup+monthly×chargedMonths`, plus any separately stated annual fee occurrences.

**Constraints and rejection.** Free months `0..months`; setup charged once. Advanced annual fee questions state payment timing and count explicitly. No hidden prorating.

**Difficulty.** Level 1 monthly×months. Level 2 setup fee. Level 3 free months. Level 4 annual fee within 18–36 months. Level 5 mixed fixed/recurring charges with at most four terms.

**Feedback.** Itemize each charge and count. Diagnose setup multiplied by months or free months charged.

**Examples.**

1. `12.00/month for 12 months; no fees.` Answer `144.00`. Level 1.
2. `15.00/month for 6 months plus 25.00 setup.` Answer `115.00`. Level 2.
3. `20.00/month for 18 months, first 3 months free, setup 30.00.` Answer `330.00`; 15 charged months. Level 3.

**Implementation and validation.** Exact minor-unit multiplication and sum. Assert charge counts and balance fee/free-month combinations.

## 7.2 Subcategory: Effective Monthly Cost

### Family `subscription_effective_monthly`

**Learner task.** Convert all costs over a horizon to an effective cost per access month.

**Response mode.** Money per month.

**Template.** `Plan costs {components} over {months} months of access. What is effective cost per access month?`

**Derivation.** Compute exact total, then divide by access months and round final.

**Constraints and rejection.** Access months positive. Denominator is access duration, not charged months. Reject cases where displayed component rounding cannot reproduce exact total.

**Difficulty.** Level 2 setup fee. Level 3 free months. Level 4 annual and setup fees. Level 5 rounding-sensitive quotient.

**Feedback.** Show total first, then divide by access months. Diagnose division by charged months.

**Examples.**

1. `120.00 annual plan for 12 months.` Answer `10.00/month`. Level 2.
2. `10.00/month for 12 months plus 24.00 setup.` Answer `12.00/month`. Level 3.
3. `8.99/month for 12 months plus 10.00 setup, first 2 months free.` Answer `8.33/month`; total `99.90`, divided by 12. Level 5.

**Implementation and validation.** Reuse validated total then exact rational division. Coverage balances fee and promotion structures.

## 7.3 Subcategory: Common-Horizon Comparison

### Family `subscription_compare`

**Learner task.** Compare two or three plans over an identical stated access horizon.

**Response mode.** Single-choice plan; optional savings money field.

**Template.**

```text
Compare over {months} months:
Plan A: {termsA}
Plan B: {termsB}
Which costs less, and by how much?
```

**Derivation.** Evaluate every plan over exactly `months`; select unique minimum and subtract it from next relevant plan.

**Constraints and rejection.** Same access/service assumed for arithmetic. Reject rounded ties and differences below one minor unit. Balance winner position and ensure monthly sticker price is misleading in at least 40% of advanced items.

**Difficulty.** Level 1 monthly versus annual over 12 months. Level 2 setup fee. Level 3 free months. Level 4 18/24-month horizons with recurring annual fee. Level 5 three plans.

**Multiple-choice distractors.** Lowest monthly sticker, lowest upfront payment, annual price compared to one month, or plan with most free months without totaling.

**Feedback.** Show a common-horizon table of total and effective monthly cost.

**Examples.**

1. `12 months: A 10.00/month; B 108.00/year. Cheaper and savings?` Answer `B by 12.00`. Level 1.
2. `12 months: A 8.00/month + 30.00 setup; B 11.00/month no setup.` Answer `A by 6.00`; 126 versus 132. Level 3.
3. `24 months: A 15/month; B 12/month + 50 setup + 30 annual fee charged twice. Which costs less and by how much?` Answer `A by 38.00`; totals are A `360.00`, B `398.00`. Level 4.

**Implementation and validation.** Compute all totals independently and require one unique minimum. The rendered answer must never contain an unresolved provisional marker. Track misleading cue and horizon.

## 7.4 Subcategory: Break-Even Duration

### Family `subscription_break_even`

**Learner task.** Find the first whole access month at which one plan becomes no more expensive or strictly cheaper than another, as explicitly asked.

**Response mode.** Integer month count.

**Template.** `Plan A: {fixedA}+{monthlyA}/month. Plan B: {fixedB}+{monthlyB}/month. From which whole month is A {relation} B?`

**Derivation.** Solve linear inequality/equality in month `m`, then apply requested whole-month condition. For equality, `m=(fixedB-fixedA)/(monthlyA-monthlyB)` when denominator nonzero.

**Constraints and rejection.** Slopes differ; a finite positive crossing exists within `1..60`. Wording distinguishes `equal`, `no more expensive`, and `strictly cheaper`. Reject crossings exactly between months unless ceiling behavior is the target.

**Difficulty.** Level 3 exact equality at whole month. Level 4 first no-more-expensive month. Level 5 fractional crossing requiring ceiling and strictness check.

**Feedback.** Write both total functions, solve, then verify the month before and the answer month.

**Examples.**

1. `A: 30 setup + 5/month; B: 0 setup + 10/month. When equal?` Answer `month 6`; both 60. Level 3.
2. `A: 50 setup + 8/month; B: 14/month. First month A is no more expensive?` Answer `month 9`; at 8 months A=114, B=112; at 9 months A=122, B=126. Level 4.
3. `A: 40 setup + 7/month; B: 12/month. First month A is strictly cheaper?` Answer `month 9`; equality at 8, strict after. Level 5.

**Implementation and validation.** Evaluate totals at `m-1` and `m`; assert requested relation first becomes true at `m`. Coverage balances equality versus strict inequality.

### Cross-family progression for Subscriptions

Single totals precede effective rates and comparison. Promotions are introduced in one-plan questions before comparisons. Break-even follows common-horizon totals and uses only linear flat-fee plans initially. A comparison error should trigger separate plan totals before another selection question.

## 8. Category: Expected Value

### Category purpose

Train probability-weighted averaging of explicitly stated monetary outcomes and distinguish gross reward, certain cost, net outcome, and long-run average.

### Learn

Expected value is:

```text
EV = probability₁ × outcome₁ + probability₂ × outcome₂ + ...
```

If a certain entry cost is separate, subtract it once:

```text
25% chance to receive 20.00, otherwise receive 0, cost 2.00
EV = 0.25×20 + 0.75×0 - 2 = 3.00
```

EV is a long-run average over repeated comparable trials. It is not a prediction of the result of one trial and does not by itself decide whether an option suits a person.

### Prerequisites

Percentages, signed money amounts, and weighted sums.

### Category boundaries

No advice about gambling, insurance, investing, or safety. No subjective utility, risk tolerance, variance, correlation, continuous distributions, or probabilities inferred from data.

### Subcategories

1. One Reward and Certain Cost
2. Multiple Outcomes
3. Comparing Options
4. Break-Even Probability or Cost

### Common misconceptions

- Multiplying the cost by win probability when cost is certain.
- Subtracting cost from payoff and then also subtracting it again.
- Ignoring losing/zero outcomes.
- Adding probabilities to payoffs.
- Treating percentages as whole numbers.
- Choosing highest possible payoff rather than highest EV.
- Interpreting positive EV as a guaranteed gain.
- Using probabilities that do not sum to 100%.

## 8.1 Subcategory: One Reward and Certain Cost

### Family `expected_value_single_reward`

**Learner task.** Calculate net EV for one possible gross reward, a zero-reward alternative, and an optional certain cost.

**Response mode.** Signed money.

**Template.** `{probability}% chance to receive {reward}; otherwise receive 0. Certain cost {cost}. What is net expected value per trial?`

**Derivation.** `EV=p×reward-cost`.

**Constraints and rejection.** Probability `1..99%`; reward/cost non-negative. Balance positive, zero, and negative EV through construction. Cost is clearly paid regardless of outcome.

**Difficulty.** Level 1 no cost. Level 2 certain cost. Level 3 negative/zero EV. Level 4 decimal probability/reward and rounding. Level 5 distinguish gross payout from net profit.

**Feedback.** Show expected gross reward, then subtract certain cost once. State long-run interpretation.

**Examples.**

1. `25% chance of 20.00, otherwise 0, no cost.` Answer `5.00`. Level 1.
2. `25% chance to receive 20.00, certain cost 2.00.` Answer `3.00`. Level 2.
3. `10% chance to receive 50.00, certain cost 7.00.` Answer `-2.00`. Level 3.

**Implementation and validation.** Exact probability rational. Compute gross and net separately. Coverage balances EV sign and probability class.

## 8.2 Subcategory: Multiple Outcomes

### Family `expected_value_multiple_outcomes`

**Learner task.** Sum probability-weighted net outcomes from a complete finite distribution.

**Response mode.** Signed money.

**Template.**

```text
{p1}%: {outcome1}
{p2}%: {outcome2}
...
What is expected net outcome?
```

Outcomes are labeled as already net; no separate cost unless shown on its own line as certain.

**Derivation.** `Σ(pi×xi)`; probabilities sum exactly to 100%.

**Constraints and rejection.** Two outcomes at Levels 1–2, three/four later. Include positive, zero, and negative outcomes. Reject incomplete distributions, duplicate outcome rows that should be combined, and excessive arithmetic.

**Difficulty.** Level 2 two outcomes. Level 3 three including loss. Level 4 non-equal probabilities. Level 5 four outcomes or final rounding.

**Feedback.** Show one weighted contribution per row and sum. Diagnose unweighted average.

**Examples.**

1. `50%: +10.00; 50%: 0.00.` Answer `5.00`. Level 2.
2. `25%: +30.00; 50%: +5.00; 25%: -10.00.` Answer `7.50`. Level 3.
3. `10%: +100.00; 30%: +10.00; 40%: 0; 20%: -25.00.` Answer `8.00`. Level 4.

**Implementation and validation.** Assert probabilities exactly sum to one and independently sum rational contributions. Balance outcome count/sign patterns.

## 8.3 Subcategory: Comparing Options

### Family `expected_value_compare`

**Learner task.** Calculate and compare EVs of two explicitly specified options.

**Response mode.** Single-choice higher EV; optional signed money difference.

**Template.** `Compare Option A {distributionA} and Option B {distributionB}. Which has higher expected value, and by how much?`

**Derivation.** Compute EV of each under the same net/gross convention; compare exact values.

**Constraints and rejection.** Unique higher EV unless `same` is explicitly a choice. Difference survives displayed rounding. Highest possible payoff should disagree with highest EV in at least 40% of advanced items.

**Difficulty.** Level 2 certain amount versus simple gamble. Level 3 two one-reward gambles. Level 4 multi-outcome option. Level 5 close EVs with clear rounding.

**Multiple-choice distractors.** Highest maximum payoff, highest win probability, lowest entry cost, or rounded tie. Each corresponds to the generated scenario.

**Feedback.** Show EV rows side by side and remind that comparison is by long-run average only.

**Examples.**

1. `A: certain 4.00. B: 25% of 20.00, otherwise 0.` Answer `B by 1.00`; EVs 4 and 5. Level 2.
2. `A: 50% of 12.00; B: 25% of 30.00; otherwise 0.` Answer `B by 1.50`; EVs 6 and 7.50. Level 3.
3. `A: 10% +100, 90% -2; B: certain +9. Which has higher EV, and by how much?` Answer `B by 0.80`; EVs are A `8.20`, B `9.00`. Level 4.

**Implementation and validation.** Compute every option independently, assert a unique rounded-visible ordering, and reject unresolved provisional text.

## 8.4 Subcategory: Break-Even Probability or Cost

### Family `expected_value_break_even`

**Learner task.** Find the maximum certain cost or minimum win probability that makes net EV zero/non-negative.

**Response mode.** Money or percent as labeled.

**Templates.** `At probability {p} and reward {reward}, what certain cost gives EV exactly zero?` and `Reward {reward}, certain cost {cost}: what minimum probability gives EV zero?`

**Derivation.** Break-even cost=`p×reward`; break-even probability=`cost/reward`. For “minimum whole percent,” take the mathematical ceiling and verify.

**Constraints and rejection.** Reward positive; cost non-negative; probability in `0..100%`. State whether exact percent or minimum whole percent is requested. Reject infeasible cases with cost>reward for a single non-negative reward.

**Difficulty.** Level 2 break-even cost. Level 3 exact probability. Level 4 rounded probability. Level 5 minimum whole-percent threshold and verification.

**Feedback.** Set `p×reward-cost=0`, solve, and interpret equality rather than promise profit.

**Examples.**

1. `25% chance of 20.00. Break-even certain cost?` Answer `5.00`. Level 2.
2. `Reward 50.00, cost 10.00. Exact break-even probability?` Answer `20%`. Level 3.
3. `Reward 30.00, cost 7.00. Minimum whole-percent probability for non-negative EV?` Answer `24%`; exact threshold `23.333…%`. Level 5.

**Implementation and validation.** Substitute threshold; for whole-percent answers assert previous integer percent is negative EV and answer is non-negative.

### Cross-family progression for Expected Value

Begin with no-cost single rewards, then certain cost. Multi-outcome distributions follow after gross/net language is stable. Comparison and break-even are inverse mastery families. If a learner weights a certain cost by probability, select a paired gross-then-net two-field item.

## 9. Topic-level cross-family progression

Recommended order:

1. direct unit price and simple offer comparison;
2. single discount amount/sale price and single tax amount/total;
3. direct percent change and forward changed value;
4. one-period then simple interest;
5. subscription totals and effective monthly cost;
6. single-reward expected value;
7. combined discounts/tax and successive percentage changes;
8. annual compound interest and nominal inflation;
9. common-horizon subscriptions and multi-outcome EV;
10. inverse price/change/interest questions, purchasing power, real change, and break-even families.

Interleave inverse pairs after acquisition:

- unit price with missing package value;
- discounted/final price with original price;
- forward percent change with original-value recovery;
- nominal future price with today's purchasing power;
- subscription total comparison with break-even month;
- expected value with break-even probability/cost.

Do not unlock multi-stage or inverse families solely because a category-level average is high; their direct prerequisites must be stable.

## 10. Adaptive practice guidance

### Mastery dimensions

Track:

- family and direction;
- answer kind (amount, total, rate, unit price, choice, duration);
- misconception;
- unit/conversion;
- percentage base;
- number of multiplicative stages;
- time horizon and annual/monthly basis;
- simple/compound/real model;
- gross/net convention;
- probability outcome count and sign pattern;
- exact-versus-rounded answer.

Category-level scores may be displayed but are insufficient for selection.

### Partial evidence

Multiple-field questions update fields independently. Correct discounted subtotal with wrong tax reveals tax-base or tax arithmetic weakness, not discount weakness. Correct plan totals with wrong comparison reveals decision/comparison error. Record calculator use and latency, but do not penalize correct answers solely for being slow or calculator-assisted.

### Failure-driven routing

| Observed answer | Likely misconception | Next selection |
|---|---|---|
| Unit price equals quantity÷price | reversed division | direct same-unit item with units shown in fraction |
| Chooses lowest package price | ignores quantity | same-unit two-offer comparison |
| Conversion off ×10/100/1000/16 | unit conversion | isolated quantity conversion before unit price |
| Discount amount returned as final | amount/remaining confusion | two named fields |
| Combined price matches adding signed rates | shared-base/additive error | stage-factor question |
| Successive discounts equal summed rates | additive percent model | same starting 100 with stage table |
| Percent change uses new denominator | wrong reference base | absolute change plus labeled old denominator |
| Reverse change is equal/opposite | denominator asymmetry | forward/reverse paired item |
| Compound answer equals simple | no interest-on-interest | two-year balance table |
| Interest answer omits principal | interest/balance confusion | one-period two-field question |
| Inflation answer is `rate×years` | no compounding | cumulative two-year factor |
| Purchasing power multiplied by inflation factor | direction reversal | paired preserve/deflate question |
| Real change equals nominal minus inflation | approximation treated exact | one-period factor ratio |
| Subscription omits setup | fixed/recurring confusion | itemized one-plan total |
| Effective monthly divides by charged months | access/billed confusion | free-month plan with labeled denominators |
| Break-even month off by one | whole-month/strictness error | verify previous and current month |
| EV weights certain cost by win probability | gross/net confusion | expected gross then subtract cost fields |
| EV is unweighted average | probability weighting omitted | two unequal-probability outcomes |
| Option chosen by maximum payoff | EV versus upside confusion | certain amount versus rare payoff |

When multiple stages fail, select diagnostic questions for each stage rather than only reducing monetary values.

### Scheduling

Recommended adaptive mix:

- 45% weakest due family/dimension;
- 25% spaced mastered material;
- 20% misconception contrasts/prerequisites;
- 10% controlled stretch.

At least 30% of long-run practice should require interpretation or comparison rather than only formula substitution. Inverse/break-even families appear only after forward accuracy. Rounding-sensitive items stay below 20% so the app does not become a rounding drill.

## 11. Feedback requirements

Every instance stores:

- exact semantic calculation;
- canonical rounded answer and unit;
- concise correct feedback;
- a staged worked solution;
- plausible misconception calculations;
- an interpretation sentence with appropriately limited claims.

Feedback must state:

- the percentage base;
- the time horizon/basis when relevant;
- whether amounts are nominal, real, gross, or net;
- when rounding occurs;
- comparison scope (“lower stated cost over 12 months,” not “best plan”).

Do not use moralizing language about spending, debt, gambling, or financial competence.

## 12. Implementation requirements

### Exact decimal representation

Represent currency in integer minor units when operations permit, and rates/quantities as reduced rationals or decimal objects. Compound powers may use exact decimal multiplication followed by one declared rounding. Do not use `Number.EPSILON` as the canonical financial rounding policy.

Canonical round-half-away-from-zero for rational `numerator/denominator` can be implemented by comparing twice the remainder magnitude with the denominator, then adjusting the truncated quotient away from zero on a tie.

### Answer parsing and localization

Number parsing must distinguish decimal and grouping separators using the active format. Ambiguous input such as `1,234` must follow the explicitly shown locale format, not a silent heuristic that may reinterpret it differently. Render the expected decimal convention near the field when ambiguity is possible.

Currency selection changes symbols only. Unit-system selection changes generated unit families but never converts an already-active question after generation. Locale changes must not alter semantic seed, exact answer, rounding, or mastery identity.

### Determinism and prevalidation

Given seed, family, level, number format, currency display, and unit system, generation is deterministic. All instances are prevalidated. Rejection is bounded at 100 attempts before constructive fallback.

Choice order is randomized only after unique correctness. Exact rationals decide comparisons; formatted strings never do.

## 13. Automated validation

### Per-instance checks

1. Every placeholder is substituted and every unit/time label present.
2. Exact answer recomputes independently from semantic parameters.
3. Rounded answer follows declared precision, tie rule, and rounding stage.
4. Rate bases, units, and horizons are dimensionally compatible.
5. Divisors and old/reference values are nonzero.
6. Complete probability distributions sum exactly to 100%.
7. Choice questions have exactly one correct distinct displayed option.
8. Inverse questions round-trip under their stated exactness convention.
9. Rejection rules pass and no provisional marker remains.
10. Localized rendering parses back to the canonical value.

### Property and exhaustive tests

- Exhaust representative minor-unit prices and small quantities for unit-price rational comparison.
- Test all declared unit conversion pairs in both directions.
- Verify discount/tax stage identities and successive-rate factors.
- Exhaust small old/new integer pairs for percent-change denominator/sign.
- Compare simple and compound formulas with repeated annual simulation.
- Verify nominal inflation/purchasing-power inverse round trips.
- Enumerate subscription totals around every break-even month and test the previous month.
- Enumerate probability grids for two/three outcomes and compare weighted sums.
- Verify break-even EV thresholds immediately below/at/above the answer.
- Property-test at least 10,000 deterministic seeds per family/level.

### Distribution tests

Fixed-seed samples must verify:

- A/B/third-offer winners are balanced;
- unit conversion directions and dimensions recur;
- amount versus final/total requests are balanced;
- increase/decrease and old/new denominator traps recur;
- simple and compound families do not starve one another;
- nominal/real direction is balanced;
- subscription fee/promotion structures and winner cues vary;
- positive/zero/negative EV classes recur;
- expected-value option with highest payoff is not systematically best;
- exact and rounding-required cases meet quotas;
- structural duplicates remain outside history windows.

### Parser tests

Test configured comma/point decimals, permitted grouping, currencies before/after values, percent sign, negative values, whitespace, and exact integers. Reject ambiguous separators under the active format, multiple signs, scientific notation, fractions, NaN/infinity, wrong units, and a percent answer supplied as a decimal fraction unless explicitly requested.

## 14. Coverage requirements

Across long-run practice:

- every category contains forward, interpretation, and inverse/comparison work;
- unit prices include direct, mixed-unit comparison, and missing values;
- discounts/tax distinguish amount, subtotal, tax base, final price, and successive factors;
- percent change includes direction, denominator, inverse, and successive changes;
- interest distinguishes principal, interest, balance, simple, and compound;
- inflation distinguishes annual rate, cumulative rate, nominal price, purchasing power, and real change;
- subscription questions use common horizons and verify break-even integer months;
- EV includes gross/net, multiple outcomes, comparisons, and thresholds;
- realistic-looking prose never hides an unstated convention;
- difficulty is driven by model selection and interpretation, not giant values;
- generated figures are never presented as current facts or advice.

## 15. Topic-level quality checklist

- [ ] Every monetary question states currency precision and rounding stage.
- [ ] Exact decimal/rational arithmetic determines answers and choices.
- [ ] Every rate names its base and time period.
- [ ] Unit comparisons normalize compatible physical units.
- [ ] Offer comparisons use exact unit prices and reject rounded ties.
- [ ] Discount amount, sale subtotal, tax amount, and final price are distinct.
- [ ] Successive percentages multiply factors.
- [ ] Percent change always uses the original value as denominator.
- [ ] Simple and annually compounded interest are not mixed implicitly.
- [ ] Nominal price and purchasing power are explicitly labeled.
- [ ] Subscription comparisons share an identical access horizon.
- [ ] Break-even questions state equality/inequality and whole-month convention.
- [ ] Expected-value distributions are complete and gross/net language is unambiguous.
- [ ] EV feedback describes a long-run average, not a guaranteed outcome.
- [ ] Every family has three valid instantiated examples.
- [ ] Every choice set has one correct answer after rounding.
- [ ] Property, distribution, inverse, localization, and parser tests pass.
- [ ] The app states that exercises are educational and not financial advice.

## 16. Stable identifiers and recommended navigation

The UI may retain the current seven category labels:

- Unit Prices
- Discounts and Tax
- Percent Change
- Interest
- Inflation
- Subscriptions
- Expected Value

Stable family identifiers are the backticked names in this specification. Existing category-level progress may remain visible after migration, but new adaptive records must begin at family/dimension level; historical category attempts cannot be assumed to identify mastery of newly separated skills.
