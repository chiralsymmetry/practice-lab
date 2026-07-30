# Medical Calculations — Dynamic Practice Specification

Status: safety-critical implementation specification; **not approved for patient care**

Audience: exercise-generator, dimensional-quantity engine, exact arithmetic oracle, synthetic medication/laboratory data generator, safety-rule checker, reviewer tooling, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Medical Calculations

### Topic goal

Develop reliable arithmetic habits for fictional medication and laboratory scenarios while repeatedly reinforcing that calculation is only one small part of safe clinical work. The learner should become able to:

- convert mass, volume, time, amount-of-substance, equivalent, and compound-rate units without losing scale;
- set up dimensional-analysis chains whose units visibly cancel;
- distinguish a dose, dose rate, daily total, concentration, volume, quantity per unit, and administration interval;
- calculate tablet quantities and liquid volumes from a complete synthetic order and label;
- calculate weight- or body-surface-area-based quantities from a formula and protocol supplied in the question;
- apply supplied minimum, maximum, and measurable-increment constraints;
- calculate concentrations after reconstitution, dilution, and idealized mixing;
- move among volume, time, pump rate, dose rate, weight-normalized rate, and drop rate;
- total synthetic intake/output and reason about schedules and elapsed time;
- compare a fictional laboratory result only with its accompanying method-, unit-, and population-specific reference interval;
- distinguish a reference limit, decision threshold, critical threshold, analytical uncertainty, and trend rule when each is supplied;
- use leading zeros, omit medication trailing zeros, expand error-prone abbreviations, and preserve complete units;
- estimate order of magnitude, calculate by an independent route, and reverse-check a result;
- stop rather than guess when an order, label, conversion, protocol, patient attribute, or laboratory interval is missing or incompatible;
- explain why an arithmetically correct result can still be unsafe or clinically unusable.

The governing habit is:

> Identify the requested quantity, write every value with its unit and source, cancel dimensions, calculate without premature rounding, compare with the supplied limits, reverse-check, and stop for qualified review if anything is incomplete or inconsistent.

### High-stakes boundary

This topic is educational arithmetic, not medical advice, prescribing support, dispensing support, laboratory interpretation, triage, diagnosis, or a clinical calculator.

Every app view, question, review screen, export, and printed page must visibly state:

```text
SIMULATION ONLY — FICTIONAL DATA — NOT FOR PATIENT CARE
```

The boundary is structural:

- all people, medications, products, orders, protocols, labels, laboratory names, analytes, specimens, devices, and results are synthetic;
- no real drug, brand, indication, formulary, dose recommendation, reference range, critical value, protocol, or patient case is bundled;
- the app generates the complete problem; it has no mode for entering a real person's values;
- clipboard/import/API features must not accept arbitrary clinical orders or laboratory reports;
- answers are numeric/classification exercises and never imperative treatment instructions;
- a missing or inconsistent datum produces `STOP — REVIEW REQUIRED`, not an inferred value;
- no result is described as safe, appropriate, therapeutic, normal, diagnostic, or ready to administer;
- completing the app does not establish professional competence, authority, or authorization;
- implementation, mathematical correctness, and model review do not replace local policy, current product labeling, qualified professional judgment, independent verification, or the actual clinical workflow.

Medication-related harm is a major patient-safety concern, as emphasized by the [WHO Medication Without Harm programme](https://www.who.int/publications/i/item/9789240062764/). That fact justifies the unusually strict review and product boundaries below; it does not authorize the app to make clinical recommendations.

### Relationship to neighboring Practice Lab topics

- **Mental Arithmetic** owns general arithmetic fluency. This app adds unit identity, labels, caps, measurement increments, and stop conditions.
- **Chemistry** owns molarity, formula mass, solutions, and chemical entities. This app uses supplied clinical-style quantities and never asks the learner to infer chemistry needed for an unsupplied conversion.
- **Probability and Statistics** owns distributions, confidence intervals, diagnostic-test probability, and inference. This app may classify a supplied measurement interval but does not estimate disease probability.
- **Data Literacy and Chart Reading** owns general trend/chart interpretation. This app uses small tabular result histories only for unit-aware, explicitly defined delta rules.
- **Everyday Economics** owns percentage and rate arithmetic outside medicine.

### Audience and prerequisites

The intended audience is an adult learner or trainee practicing arithmetic before or alongside an independently governed educational programme.

Prerequisites:

- multiplication, division, fractions, percentages, and decimals;
- powers of ten and scientific notation;
- elementary algebra and ratios;
- elapsed-time calculation;
- reading a table and a labeled quantity.

The app introduces dimensional analysis before using compound rates. It must not assume clinical knowledge, and it must not teach clinical decision-making implicitly through supposedly “obvious” context.

### Authority and versioned profiles

The initial profile is:

```text
pl-medcalc-synthetic-v1
```

Its authority is deliberately narrow:

- SI prefixes and unit-symbol structure follow the [NIST Guide to the SI](https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes);
- medication-decimal and abbreviation exercises use the [Joint Commission Official “Do Not Use” List](https://www.jointcommission.org/-/media/tjc/documents/resources/patient-safety-topics/patient-safety/do_not_use_list_9_14_18.pdf) and relevant [FDA safe-use notation guidance](https://www.fda.gov/drugs/safe-use-initiative/safe-use-initiative-current-projects);
- laboratory-reference reasoning follows the principle that intervals depend on the reporting laboratory, method, units, and applicable group, as explained by [MedlinePlus](https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/) and addressed formally by [CLSI EP28](https://clsi.org/shop/standards/ep28/).

These sources do not supply question doses or result ranges. Every quantitative clinical-looking rule is fictional and printed inside the question.

Each generated instance stores:

```text
technicalProfileId
unitTableVersion
notationSafetyProfileId
syntheticProtocolVersion
syntheticLabelVersion
syntheticLabProfileVersion
generatorVersion
reviewManifestVersion
```

Updating a source or profile cannot silently change saved answers.

### Quantity and dimensional model

Every number that represents a quantity is stored with a semantic dimension and exact scale:

```text
Quantity {
  value: Rational
  unit
  dimension
  substanceId?
  sourceId
}
```

Core dimensions:

```text
mass
volume
time
bodyMass
bodySurfaceArea
amountOfSubstance[analyteId]
equivalent[analyteId]
activity[compoundId]
count[formId]
drop[setId]
```

`mass` and `bodyMass` share physical dimensions but remain different semantic roles so an order's numerator cannot accidentally be confused with the subject's body mass.

Core decimal relationships:

```text
1 kg  = 1000 g
1 g   = 1000 mg
1 mg  = 1000 mcg
1 mcg = 1000 ng

1 L   = 1000 mL
1 dL  = 100 mL

1 h   = 60 min
1 min = 60 s

1 mol  = 1000 mmol
1 mmol = 1000 micromol
```

Medication-style display uses `mcg`, not the micro symbol, to reduce misreading. Pure metrology explanations may show `µg` as the SI symbol, but generated medication labels and orders use `mcg`. `mL` is canonical; `cc` is treated as an unsafe/noncanonical abbreviation in this profile.

The app never treats case as cosmetic:

```text
mg ≠ Mg
mL ≠ ML
```

Unit aliases are explicit and narrowly accepted. A bare number is accepted only when the answer field itself permanently displays the complete unit.

### Substance-specific and non-interchangeable units

An activity `Unit` is compound-specific:

```text
Unit[PracticeCompound-A] ≠ Unit[PracticeCompound-B]
```

It cannot be converted to mass without an explicit, fictional conversion factor supplied in the question. `U` and `IU` are never generated as safe order notation; exercises expand them to `Unit` and `International Unit` according to the pinned notation profile.

Millimoles and milliequivalents are not generically interchangeable:

```text
mEq = mmol × |declared ionic charge|
```

The charge and analyte identity must be supplied. For a monovalent synthetic ion, the numeric values match; for a divalent ion, `1 mmol = 2 mEq`. A conversion without valence is rejected as incomplete.

### Dimensional-analysis contract

Calculations are represented as factor chains:

```text
target =
  givenQuantity
  × conversionFactor1
  × conversionFactor2
  ...
```

Each conversion factor is a dimensionally equal ratio. Numerator and denominator units cancel symbolically. The final uncancelled dimension must equal the requested dimension before arithmetic is graded.

Example:

```text
0.4 g × (1000 mg / 1 g) = 400 mg
```

For compound units, convert numerator and denominator independently:

```text
0.2 mg/min × (1000 mcg / 1 mg) × (60 min / 1 h)
= 12 000 mcg/h
```

An accidentally correct number with the wrong dimension is not correct.

### Synthetic order and label model

```text
TrainingOrder {
  caseId
  compoundId
  amountPerDose?
  amountPerBodyMassPerDose?
  amountPerBodyMassPerTime?
  amountPerBodySurfaceArea?
  totalDailyAmount?
  interval?
  duration?
  routeCode?
  suppliedLimits[]
  requiredRoundingPolicy
}

TrainingLabel {
  productId
  compoundId
  form
  amount
  volumeOrCount
  concentration
  totalContainerAmount?
  postReconstitutionFinalVolume?
  measurableIncrement?
  routeCode?
}
```

An order and label may be combined only when `compoundId`, form/route constraints, and quantity dimensions match. The app does not decide that two real products are therapeutically interchangeable.

Question wording uses:

> Under this fictional training order and label, what calculated quantity follows?

It does not use:

> How much should the patient receive?

### Order completeness and stop conditions

A question that asks for a computed quantity must provide every required datum or deliberately test recognition that it cannot be calculated.

Mandatory stop conditions include:

- missing subject body mass when the order is mass-normalized;
- body mass supplied in an unresolved/ambiguous unit;
- missing concentration or total-volume relationship;
- order and label compounds do not match;
- incompatible route/form under the supplied synthetic rule;
- missing interval when converting daily total to per-dose amount;
- `Unit`-to-mass conversion without compound-specific factor;
- mmol-to-mEq conversion without charge;
- reconstitution label gives neither final concentration nor final volume needed for the task;
- a result smaller than the declared measuring increment when no rounding/alternative rule is supplied;
- conflicting values that cannot both be true;
- laboratory result and reference interval use incompatible units without a supplied conversion;
- laboratory method/group metadata does not select exactly one interval.

The canonical answer is:

```text
STOP_REVIEW_REQUIRED(reasonCode)
```

The app must not suggest a substitute concentration, alter the order, choose a route, or invent missing clinical data.

### Medication notation safety profile

Generated safe notation follows:

- use a leading zero for values below one: `0.5 mg`, not `.5 mg`;
- omit a trailing zero in medication quantities: `5 mg`, not `5.0 mg`;
- write `Unit`, not `U` or `u`;
- write `International Unit`, not `IU`;
- write `daily` and `every other day`, not `QD`, `q.d.`, `QOD`, or variants;
- use full synthetic compound names/IDs; do not use ambiguous real-drug abbreviations;
- write `mL`, not `cc`;
- write `mcg` in medication contexts rather than `µg`;
- keep a space between number and unit in display;
- never omit a denominator from a concentration or rate.

The trailing-zero restriction applies to medication-related notation in this profile. Laboratory values may preserve a trailing zero when it communicates reported precision; the context must be explicit.

### Forms, concentrations, and percentage model

Core label relationships:

```text
concentration = amount / volume
amount = concentration × volume
volume = amount / concentration
```

A solid-unit label such as `125 mg per tablet` stores:

```text
amountPerUnit = 125 mg / 1 tablet[productId]
```

The app permits a fractional tablet only when the synthetic label explicitly says the dosage form may be divided into the requested fraction. It does not teach real tablet splitting.

The v1 percentage profiles are:

```text
x% w/v = x g per 100 mL
x% w/w = x g per 100 g
x% v/v = x mL per 100 mL
```

The basis must always be shown. `1%` without `w/v`, `w/w`, or `v/v` is incomplete in exact questions.

The historical ratio-strength teaching profile is:

```text
1:N w/v = 1 g per N mL
```

It appears only in interpretation/conversion exercises and is always expanded in feedback. It is not used as the sole displayed concentration in an integrated order.

### Reconstitution, dilution, and mixing model

Reconstitution questions use **final volume**, not automatically “initial diluent plus powder volume”:

```text
finalConcentration =
  totalAmountInContainer / labeledFinalVolume
```

If a label states only `add D mL` and separately supplies a final volume, the final volume governs concentration. The app never assumes powder displacement is zero unless the fictional label explicitly states that idealization.

Ideal dilution conserves solute amount:

```text
C1V1 = C2V2
diluentToAdd = finalVolume - stockVolume
```

Solutions are assumed compatible and volumes additive only because the synthetic question says so. These calculations are not preparation instructions.

Ideal mixture concentration:

```text
totalAmount = Σ(CiVi)
totalVolume = ΣVi
mixtureConcentration = totalAmount / totalVolume
```

### Weight- and surface-area-based model

Every normalization basis is explicit:

```text
mg/kg/dose
mg/kg/day
mcg/kg/min
mg/m²/dose
```

They are not interchangeable.

If the question supplies a total daily amount and number of equal doses:

```text
perDose = totalDailyAmount / dosesPerDay
```

If the fictional protocol supplies a maximum:

```text
uncapped = rate × basis
protocolAmount = min(uncapped, suppliedMaximum)
```

The app does not infer maxima from memory.

Selected surface-area questions use the explicitly supplied Mosteller teaching formula:

```text
BSA_m2 = sqrt(height_cm × bodyMass_kg / 3600)
```

This formula is a calculation model inside a fictional protocol. The app does not choose when BSA dosing is clinically appropriate.

The weight field used—such as `trainingWeight`—is named by the protocol. Actual, ideal, adjusted, dosing, dry, estimated, or historical weight selection is clinical policy and excluded unless the exact synthetic value to use is already designated.

### Infusion and drop-rate model

Core volume-rate relationships:

```text
rate_mL_per_h = volume_mL / time_h
volume_mL = rate_mL_per_h × time_h
time_h = volume_mL / rate_mL_per_h
```

For a mass rate:

```text
volumeRate =
  orderedMassRate / concentration
```

For a weight-normalized rate:

```text
orderedAmountPerTime =
  orderedAmountPerBodyMassPerTime × trainingWeight

volumeRate =
  orderedAmountPerTime / concentration
```

Every time-unit conversion remains in the factor chain.

Gravity-drop questions use a supplied fictional administration-set factor:

```text
dropsPerMinute =
  volume_mL × dropFactor_dropsPer_mL / time_min
```

`dropFactor` is set-specific and never memorized. A rounding rule is always supplied.

No question asks the app to program a real pump or recommends gravity administration. Pump screens are synthetic diagrams with no brand resemblance.

### Time, schedule, and fluid-balance model

Schedules use an artificial 24-hour clock without dates, daylight-saving changes, time zones, or real medication timing. “Every `n` hours” means equal elapsed intervals in the synthetic timeline. It is not treated as synonymous with “`k` times daily” unless the question defines it that way.

Synthetic fluid balance:

```text
netBalance = totalIntake - totalOutput
```

Positive and negative are arithmetic signs only. The app makes no conclusion about hydration, treatment, or clinical significance.

### Laboratory report model

Every report carries its own complete comparison context:

```text
SyntheticLabResult {
  labProfileId
  analyteId
  specimenType
  methodId
  subjectGroupId
  collectionContextId?
  value
  unit
  reportedPrecision
  referenceInterval?
  decisionThresholds[]
  criticalThresholds[]
  analyticalUncertainty?
  qualitativeReference?
}
```

The app never supplies universal “normal values.” The learner uses only the interval printed on the same synthetic report or a formally declared compatible report.

Default interval notation:

```text
[low, high]  // both boundaries included
```

Other open/closed boundaries must be shown explicitly.

Canonical classifications:

```text
BELOW_REFERENCE
WITHIN_REFERENCE
ABOVE_REFERENCE
CRITICAL_LOW_BY_SUPPLIED_RULE
CRITICAL_HIGH_BY_SUPPLIED_RULE
OVERLAPS_BOUNDARY_WITH_UNCERTAINTY
NOT_COMPARABLE
```

A result outside a reference interval does not establish illness, and a result inside does not establish health. The app never maps a result to a disease, urgency, treatment, or prognosis.

Reference intervals, decision thresholds, and critical thresholds are distinct:

- a reference interval describes a selected reference population under a method;
- a decision threshold is a supplied rule for a specific fictional task;
- a critical threshold is a separately supplied notification/escalation boundary;
- none is inferred from the others.

If a synthetic result triggers a supplied critical threshold, the exercise answer is only the classification and `STOP — REVIEW REQUIRED`. It does not offer a treatment action.

### Laboratory unit conversion and comparison

Simple metric conversions may use the common unit table. Analyte-specific mass/amount conversions require a supplied factor:

```text
convertedValue = sourceValue × suppliedConversionFactor
```

The factor includes analyte identity and units. The app does not expect molecular-weight memorization.

To compare with a reference interval:

1. select the interval matching all supplied metadata;
2. establish compatible units;
3. convert the result or interval with the supplied factor;
4. compare using full precision and boundary rules;
5. state only the defined classification.

Results from different lab profiles are `NOT_COMPARABLE` unless the question explicitly supplies a valid relationship or says the profiles are harmonized for the requested comparison.

### Uncertainty, trends, and delta rules

If a result is represented as `x ± u`, the interval is `[x-u,x+u]` under the question's simplified model. Relative to a reference boundary:

- wholly below → definitely below under model;
- wholly inside → within under model;
- crossing a boundary → overlaps boundary;
- wholly above → definitely above.

This is not a confidence interval unless the prompt explicitly defines it as one.

Trend questions use only supplied compatible results and a declared metric:

```text
absoluteChange = new - old
percentChange = (new-old)/old × 100%, old ≠ 0
```

A delta-check threshold is a fictional rule printed in the question. Exceeding it means `REVIEW_REQUIRED_BY_SUPPLIED_RULE`, not clinical deterioration.

### Rounding, precision, and measurability

There is no universal medication-rounding rule.

Every numeric question specifies one of:

```text
exact
round to N decimal places
round to N significant figures
round to nearest increment q
round down to permitted increment q
round up to permitted increment q
STOP if not exactly measurable
```

Midpoint tie behavior is printed or inherited from a versioned profile; default training arithmetic uses round-to-nearest with ties away from zero for nonnegative quantities.

Rules:

- preserve exact rational values for decimal inputs and conversion factors; where a
  formula introduces an irrational value, use a deterministic arbitrary-precision
  decimal implementation with a documented error bound comfortably below the
  smallest supported final rounding boundary;
- round only the final requested quantity;
- never round a value to zero when the unrounded positive quantity is below the measurable increment; return a stop condition unless a supplied policy says otherwise;
- after rounding, recheck supplied minimum/maximum and total constraints;
- display enough working precision for an independent reviewer to reproduce the result;
- laboratory trailing zeros may retain reported precision; medication trailing zeros are removed.

### Independent-check contract

Every numeric medication-style question must have two computational paths:

1. primary exact derivation;
2. independent verification, such as reverse substitution, alternate factor order, conservation, or a separately implemented solver.

Examples:

```text
calculatedVolume × labelConcentration = orderedAmount
calculatedRate × time = totalVolume
perDose × dosesPerDay = totalDailyAmount
finalConcentration × finalVolume = conservedAmount
```

If paths disagree beyond exact/tolerance rules, the generator rejects the question and the production app does not display an answer.

### Scope

Included:

- metric mass/volume/time conversions and compound-unit dimensional analysis;
- activity-unit boundaries and supplied mmol/mEq conversions;
- complete synthetic order/label parsing and error-prone notation;
- tablet/count and oral-liquid-style arithmetic using fictional products;
- weight-, day-, dose-, rate-, maximum-, safe-range-, and BSA-formula calculations using supplied fictional protocols;
- mass/volume, percentage, ratio-strength, reconstitution, dilution, and mixture arithmetic;
- volume, time, pump-rate, normalized-rate, and gravity-drop arithmetic;
- synthetic schedule, elapsed-time, and fluid-balance arithmetic;
- report-specific laboratory reference intervals, unit conversion, critical/reference distinction, trends, delta rules, and uncertainty overlap;
- rounding, measurability, order-of-magnitude, reverse checks, missing-data stops, and integrated audits.

### Exclusions

- real patient data, real medication names, brands, indications, doses, formulations, package labels, formularies, interactions, contraindications, allergies, routes, protocols, or prescribing information;
- real laboratory analyte reference ranges, decision limits, critical values, diagnosis, treatment, urgency, or result interpretation;
- open-ended calculators, uploads, OCR, EHR integration, pump integration, barcode scanning, callbook-like product lookup, or clinical API access;
- deciding whether a medication should be prescribed, dispensed, compounded, split, crushed, administered, held, repeated, titrated, or changed;
- renal/hepatic dose adjustment, ideal/adjusted body-weight selection, pharmacokinetics, therapeutic drug monitoring, insulin correction, anticoagulation, chemotherapy protocols, parenteral nutrition, neonatal care, resuscitation, anesthesia, opioids, controlled substances, or other high-alert clinical protocols;
- bedside device operation, sterile preparation, aseptic technique, compatibility, stability, storage, disposal, or hazardous-drug handling;
- real diagnostic formulas such as eGFR, corrected calcium, anion gap, osmolality, acid–base compensation, risk scores, or clinical decision rules;
- diagnostic sensitivity/specificity/Bayes reasoning, which belongs in Probability and Statistics;
- claims that a generated result is clinically safe because the arithmetic is correct.

### Global answer conventions

- Surrounding whitespace is ignored; locale-aware decimal separators are supported.
- A quantity answer requires a compatible unit unless the field permanently supplies it.
- `mcg` and `µg` may be equivalent in pure conversion answers; medication-notation rewrite tasks require safe-profile display `mcg`.
- `mL` is canonical; `ml` may be normalized in arithmetic input but is corrected in notation feedback; `cc` is not accepted as safe display.
- Compound units accept mathematically equivalent forms such as `mg/(kg·h)` and `mg·kg⁻¹·h⁻¹` when unambiguous.
- Unit case remains significant.
- Exact counts may be fractional only when the form/protocol permits the denominator.
- Numeric tolerance is derived from the requested rounding/increment; there is no generic loose clinical tolerance.
- Leading-zero/trailing-zero formatting is graded separately from numeric equality in notation families.
- `STOP — REVIEW REQUIRED` answers use structured reason codes; free-form safety prose is not required.
- Multiple stop reasons are all shown when the family asks for an audit; “first blocking reason” families state their priority order.

### Difficulty philosophy

Difficulty should increase through:

- changing the requested quantity and direction of conversion;
- adding one meaningful unit cancellation;
- distinguishing daily, per-dose, per-time, and normalized rates;
- using label totals versus per-unit strength;
- adding a supplied cap, interval, measurable increment, or rounding rule;
- combining weight, concentration, and time while preserving units;
- selecting a matching laboratory interval from metadata;
- converting both result and interval consistently;
- recognizing insufficient or contradictory data;
- finding a scale error that survives superficial arithmetic;
- reconciling two independent calculations.

Difficulty must not increase through:

- obscure real medications or laboratory facts;
- hidden clinical assumptions;
- more decimal places without new reasoning;
- artificial time pressure;
- tiny labels or ambiguous typography;
- unsafe abbreviation exposure without immediate correction;
- numbers chosen to mimic a recognizable real protocol;
- rewarding action after a stop condition.

## 2. Category: Units and dimensional analysis

### Category purpose

Build automatic scale awareness and a visible unit-cancellation method before any medication-style formula is introduced.

### Learn

Write the starting quantity and multiply by conversion factors equal to one. Arrange each factor so the unwanted unit cancels. Keep compound-unit numerators and denominators visible. A thousandfold error often comes from moving between `g`, `mg`, and `mcg`; unit symbols and capitalization are part of the value.

### Prerequisites

Decimals, fractions, multiplication, and powers of ten.

### Category boundaries

This category trains quantities and unit structure without a dosage scenario. Concentrations begin in Category 6 and order/label interpretation in Category 3.

### Common misconceptions

- Moving a decimal by memory without tracking direction.
- Treating `mg` and `mcg` as similar labels.
- Multiplying when the conversion requires division.
- Cancelling a numerator unit against another numerator.
- Converting the numerator of a rate but not its denominator.
- Treating `Unit`, mmol, mEq, and mg as interchangeable.
- Ignoring capitalization or using `cc`.

### Families

#### Family `metric_mass_convert`

**Task.** Convert among `kg`, `g`, `mg`, `mcg`, and `ng`.

**Response/template.** quantity; “Convert `{quantity}` to `{targetUnit}`.”

**Derivation.** multiply through the exact decimal prefix chain.

**Difficulty.** direction, multiple prefix steps, scientific notation.

**Distractors.** ×/÷ reversal, one skipped factor of 1000, mass-unit capitalization error.

**Feedback.** show factor chain and order-of-magnitude check.

**Examples.** (1) `2 g → 2000 mg`. (2) `0.45 mg → 450 mcg`. (3) `7.2×10⁶ ng → 7.2 mg`.

**Validation.** Independent rational conversion; nonzero values unless zero is the explicit concept.

#### Family `metric_volume_convert`

**Task.** Convert among `L`, `dL`, and `mL`.

**Response/template.** quantity.

**Derivation.** use exact decimal factors.

**Difficulty.** dL middle scale, inverse direction, mixed notation.

**Distractors.** treat dL as 10 mL, use 100 rather than 1000 for L/mL, answer `cc`.

**Feedback.** place units on a scale and show canonical `mL`.

**Examples.** (1) `1.5 L →1500 mL`. (2) `2.4 dL →240 mL`. (3) `75 mL →0.75 dL`.

**Validation.** Unit dimension remains volume.

#### Family `time_convert`

**Task.** Convert between hours, minutes, and seconds.

**Response/template.** quantity.

**Derivation.** exact factors `60 min/h`, `60 s/min`.

**Difficulty.** decimal hours, compound h:min representation, reverse direction.

**Distractors.** decimal minutes treated as clock minutes, base-100 conversion.

**Feedback.** distinguish `1.5 h=90 min` from `1 h 50 min`.

**Examples.** (1) `2 h→120 min`. (2) `0.75 h→45 min`. (3) `2 h 15 min→135 min`.

**Validation.** Clock-style input is explicitly parsed, never inferred from `2.15`.

#### Family `compound_rate_convert`

**Task.** convert a rate's numerator and/or denominator units.

**Response/template.** compound quantity.

**Derivation.** multiply a factor for each changed unit and cancel symbolically.

**Difficulty.** both numerator and denominator, reciprocal time direction.

**Distractors.** multiply by 60 in the wrong direction, convert only numerator, lose `/kg`.

**Feedback.** show full dimensional chain.

**Examples.** (1) `2 mg/h→2000 mcg/h`. (2) `0.5 mg/min→30 mg/h`. (3) `4 mcg/(kg·min)→240 mcg/(kg·h)`.

**Validation.** Final dimension and semantic normalization basis equal target.

#### Family `dimensional_chain_build`

**Task.** select or order conversion factors that produce a requested unit.

**Response/template.** ordered factor chain.

**Derivation.** search factors whose numerator/denominator units cancel to target.

**Difficulty.** irrelevant factors, multi-step chain, compound rate.

**Distractors.** reciprocal factor, extra uncancelled unit, numerically tempting factor.

**Feedback.** cross out cancelled units before multiplying.

**Examples.** (1) `g→mg`. (2) `mg/min→mcg/h`. (3) `mg/(kg·h)×kg→mg/h`.

**Validation.** Symbolic dimension engine proves chain result; choices are unique or all valid chains accepted.

#### Family `missing_conversion_factor`

**Task.** fill one numerator/denominator in a unit-equivalent factor.

**Response/template.** number and unit.

**Derivation.** enforce equality and desired cancellation.

**Difficulty.** inverse orientation and compound factor.

**Distractors.** correct number wrong unit, reciprocal equality, 100/1000 confusion.

**Feedback.** verify factor equals one.

**Examples.** (1) `1000 mg / ? g` → `1 g`. (2) `1 h / ? min` → `60 min`. (3) factor converting `mL/h` to `mL/min` → `1 h/60 min`.

**Validation.** Factor is dimensionless and exactly one physically.

#### Family `normalization_unit_read`

**Task.** identify what a compound normalization such as `mg/kg/day` or `mcg/kg/min` means.

**Response/template.** matching or named numerator/bases.

**Derivation.** parse unit expression tree.

**Difficulty.** nested solidus notation and compare similar bases.

**Distractors.** collapse `/kg/day` into `/kg per dose`, swap time unit, treat kg as dose mass.

**Feedback.** verbalize “amount per body mass per time.”

**Examples.** (1) `mg/kg/dose` → per body mass per dose. (2) `mg/kg/day` → total normalized daily amount. (3) `mcg/(kg·min)` → amount rate per body mass.

**Validation.** Repeated solidus is rendered with parentheses or negative exponents to avoid ambiguity.

#### Family `medication_micro_notation`

**Task.** choose or rewrite safe-profile microgram notation.

**Response/template.** text choice.

**Derivation.** medication context canonicalizes to `mcg`; pure SI context may identify `µg`.

**Difficulty.** context switch and unsafe lookalike.

**Distractors.** `mg`, `ug`, ambiguous handwritten-like symbol.

**Feedback.** show thousandfold relationship and notation policy.

**Examples.** (1) medication label `250 mcg`. (2) `0.25 mg=250 mcg`. (3) reject `250 mg` as a transcription of `250 mcg`.

**Validation.** Typography makes `mg`/`mcg` distinct; no visual trick fonts.

#### Family `activity_unit_boundary`

**Task.** decide whether a supplied conversion involving `Unit[compound]` is possible.

**Response/template.** converted value or stop reason.

**Derivation.** require matching compound ID and an explicit factor for mass conversion.

**Difficulty.** same numeric label for different compounds and reverse conversion.

**Distractors.** treat Unit as mg, reuse factor from another compound, cancel compound IDs.

**Feedback.** explain substance-specific dimension.

**Examples.** (1) no factor, `500 Unit→mg` → stop. (2) supplied `100 Unit-A/mg` permits conversion. (3) Unit-A cannot use Unit-B factor.

**Validation.** Type system rejects mismatched activity dimensions.

#### Family `mmol_meq_convert`

**Task.** convert supplied synthetic-ion amount between mmol and mEq.

**Response/template.** quantity.

**Derivation.** `mEq=mmol×|charge|`.

**Difficulty.** reverse direction, divalent/trivalent ion, missing charge.

**Distractors.** always 1:1, use signed charge, convert to mass.

**Feedback.** show amount × absolute valence.

**Examples.** (1) Ion A⁺: `3 mmol→3 mEq`. (2) Ion B²⁺: `3 mmol→6 mEq`. (3) charge absent → stop.

**Validation.** Synthetic analyte identity and charge are explicit.

#### Family `result_dimension`

**Task.** identify the unit/dimension produced by a formula before calculating.

**Response/template.** unit expression.

**Derivation.** symbolic multiplication/division and cancellation.

**Difficulty.** several factors and compound units.

**Distractors.** requested unit guessed without cancellation, uncancelled kg/time, inverted concentration.

**Feedback.** show a units-only line.

**Examples.** (1) `(mg/mL)×mL→mg`. (2) `(mg/kg)×kg→mg`. (3) `(mcg/kg/min)×kg÷(mcg/mL)×60 min/h→mL/h`.

**Validation.** Unit algebra independent of numeric oracle.

#### Family `unit_magnitude_audit`

**Task.** find one unit, scale, capitalization, or dimensional error in a calculation.

**Response/template.** select and correct earliest error.

**Derivation.** replay exact conversion and unit algebra.

**Difficulty.** numerically plausible 10×/1000× result or wrong final dimension.

**Distractors.** other steps use equivalent forms correctly.

**Feedback.** name error factor and expected magnitude direction.

**Examples.** (1) `0.5 mg=0.0005 mcg` is 10⁶ wrong. (2) `1 h=100 min`. (3) result leaves `kg` uncancelled.

**Validation.** Exactly one root error; all values fictional and context-free.

## 3. Category: Synthetic orders, labels, and safe notation

### Category purpose

Train extraction of the exact quantities needed for arithmetic and recognition of incomplete, incompatible, or error-prone notation.

### Learn

A complete training calculation names the compound, amount/rate, basis, interval, route/form rule where relevant, and the matching label strength. Read totals and denominators carefully: `100 mg in 5 mL` is the same concentration as `20 mg/mL`, while `100 mg/mL in a 5 mL container` contains 500 mg total. Do not repair missing information by guessing.

### Prerequisites

Units and dimensional analysis.

### Category boundaries

This category parses and validates data. Actual tablet/liquid arithmetic follows in Category 4, normalized protocols in Category 5, and concentrations in Category 6.

### Common misconceptions

- Confusing total container amount with amount per mL.
- Treating `mg/5 mL` as `mg/mL`.
- Reading `mg/kg/day` as `mg/kg/dose`.
- Ignoring compound/product mismatch.
- Filling missing interval or route from habit.
- Accepting `.5`, `5.0`, `U`, `IU`, `QD`, or `cc` as safe-profile notation.
- Treating an arithmetically usable but incomplete order as valid.

### Families

#### Family `order_components`

**Task.** identify amount, basis, interval, compound, and supplied limits in a synthetic order.

**Response/template.** named fields.

**Derivation.** parse the structured order, not free prose inference.

**Difficulty.** normalized rate, daily/per-dose distinction, irrelevant metadata.

**Distractors.** swap label strength into ordered amount, omit basis, call maximum the order.

**Feedback.** annotate each component.

**Examples.** (1) `Training-A 40 mg once` →40 mg/dose. (2) `12 mg/kg/day in 3 equal doses` →daily basis and 3. (3) `2 mcg/kg/min, max supplied` →rate plus cap.

**Validation.** Rendered wording round-trips to semantic order.

#### Family `frequency_interval_parse`

**Task.** distinguish elapsed interval, equal doses per day, and named schedule.

**Response/template.** interval/count fields.

**Derivation.** use only explicit synthetic timeline definition.

**Difficulty.** every-n-hours versus times-daily contrast.

**Distractors.** assume 3 times daily means every 8 hours, count endpoints twice.

**Feedback.** draw 24-hour timeline when defined.

**Examples.** (1) every 6 h →4 equal intervals/24 h under simple timeline. (2) 3 equal doses/day → divide daily amount by3, schedule times unspecified. (3) “morning and evening” has 2 doses but no exact interval unless supplied.

**Validation.** No real scheduling recommendation.

#### Family `daily_vs_per_dose`

**Task.** classify a stated quantity as total daily, per dose, or per time.

**Response/template.** single choice and unit.

**Derivation.** inspect denominator/basis tokens.

**Difficulty.** mixed wording and normalized quantities.

**Distractors.** ignore `/day`, treat divided doses as original rate.

**Feedback.** rewrite with explicit parentheses.

**Examples.** (1) `30 mg/day` →daily total. (2) `10 mg/dose, 3 doses/day` →30 mg/day. (3) `6 mg/kg/day ÷3` →2 mg/kg/dose.

**Validation.** Exact semantic quantity types differ even if numbers coincide.

#### Family `label_strength_parse`

**Task.** extract amount, denominator volume/count, and concentration from a label.

**Response/template.** named fields.

**Derivation.** parse `amount per quantity` exactly.

**Difficulty.** total-volume denominator, per-tablet versus per-two-tablet label.

**Distractors.** drop denominator, assume 1 mL, use container volume as amount.

**Feedback.** normalize to amount per one unit and retain original label.

**Examples.** (1) `100 mg/5 mL` →20 mg/mL. (2) `250 mg per 2 tablets` →125 mg/tablet. (3) `40 mg/mL, 10 mL` →400 mg total.

**Validation.** Concentration × denominator reproduces numerator.

#### Family `total_amount_total_volume`

**Task.** distinguish total amount, total volume, and concentration on a synthetic container.

**Response/template.** named fields or calculated total.

**Derivation.** `totalAmount=concentration×totalVolume`.

**Difficulty.** label presents both per-unit and container totals.

**Distractors.** report concentration as total, divide instead of multiply.

**Feedback.** dimensional check.

**Examples.** (1) `20 mg/mL, 5 mL` →100 mg total. (2) `300 Unit/mL, 2 mL` →600 Unit total. (3) `120 mg in 6 mL` →20 mg/mL, total remains120 mg.

**Validation.** Activity compound IDs match through multiplication.

#### Family `matching_label_select`

**Task.** choose the label compatible with a complete fictional order.

**Response/template.** one or all matching labels.

**Derivation.** match compound, form/route rule, and convertible dimensions.

**Difficulty.** similar IDs, different concentrations, one missing datum.

**Distractors.** same number wrong unit, same compound incompatible supplied route, lookalike ID.

**Feedback.** table match predicates.

**Examples.** (1) Training-A order selects Training-A label. (2) Training-A1 does not match Training-Al. (3) label lacking concentration cannot support requested volume.

**Validation.** Backward-generate unique match or accept full valid set.

#### Family `decimal_notation_safety`

**Task.** rewrite a medication-style quantity using leading-zero/no-trailing-zero rules.

**Response/template.** short text quantity.

**Derivation.** preserve numeric value and canonical unit while changing notation.

**Difficulty.** several quantities and laboratory-context exception.

**Distractors.** change value, remove significant laboratory zero, add trailing medication zero.

**Feedback.** show how a missed decimal could cause a tenfold error.

**Examples.** (1) `.5 mg→0.5 mg`. (2) `5.0 mg→5 mg`. (3) laboratory `5.0` may retain reported precision when explicitly labeled.

**Validation.** Numeric equality plus context-specific formatting required.

#### Family `unsafe_abbreviation_expand`

**Task.** replace a listed error-prone abbreviation with safe-profile words/symbols.

**Response/template.** rewritten phrase.

**Derivation.** use versioned Joint Commission/FDA mapping.

**Difficulty.** multiple abbreviations and case variants.

**Distractors.** alternative unsafe variant, change schedule, expand without unit.

**Feedback.** state the documented ambiguity.

**Examples.** (1) `5 U→5 Unit`. (2) `10 IU→10 International Unit`. (3) `QD→daily`; `QOD→every other day`.

**Validation.** Static reviewed mapping; generated answer never introduces a prohibited token.

#### Family `order_completeness`

**Task.** decide whether the supplied order/label data are sufficient for the requested calculation.

**Response/template.** sufficient or stop reason(s).

**Derivation.** compare required dependency graph with present compatible values.

**Difficulty.** irrelevant extra data and multiple missing dependencies.

**Distractors.** infer conventional concentration, assume body mass, ignore mismatched compound.

**Feedback.** show required-versus-present fields.

**Examples.** (1) dose and concentration present → volume calculable. (2) mg/kg order without weight → stop. (3) mEq conversion without charge → stop.

**Validation.** Dependency graph independently generated from requested quantity.

#### Family `route_form_rule_check`

**Task.** apply a supplied synthetic compatibility table without clinical inference.

**Response/template.** compatible/incompatible/unknown.

**Derivation.** exact lookup by product form and fictional route code.

**Difficulty.** multiple forms and missing table row.

**Distractors.** use real-world assumptions, infer unknown as compatible, match on name only.

**Feedback.** cite supplied table row or missing evidence.

**Examples.** (1) table says Form-X with Route-1 →compatible. (2) Form-Y explicitly forbidden →incompatible. (3) no row →stop/unknown.

**Validation.** Codes are synthetic and carry no real route meaning.

#### Family `order_label_audit`

**Task.** find the first unsafe notation, mismatch, omission, or denominator error.

**Response/template.** select and structured reason.

**Derivation.** run notation and compatibility validators before arithmetic.

**Difficulty.** calculation appears numerically possible despite blocking defect.

**Distractors.** harmless formatting or clinically unsupported preferences.

**Feedback.** stop at the first blocking condition.

**Examples.** (1) compound mismatch. (2) `.4 mg` lacks leading zero. (3) label `50 mg/5 mL` misread as50 mg/mL.

**Validation.** Exactly one prioritized root defect unless multi-fault audit explicitly requested.

## 4. Category: Solid-unit and liquid-volume arithmetic

### Category purpose

Train direct quantity-from-strength calculations for complete synthetic products while enforcing form divisibility and measurable-increment constraints.

### Learn

Use:

```text
number of units = ordered amount / amount per unit
volume = ordered amount / concentration
```

Then check whether the form permits the result and whether the supplied device increment can represent it. Arithmetic alone does not grant permission to split a dosage form or round a volume.

### Prerequisites

Complete order/label parsing and unit cancellation.

### Category boundaries

This category uses fixed per-dose amounts. Weight/BSA protocols belong in Category 5 and reconstitution/dilution in Category 6.

### Common misconceptions

- Multiplying ordered amount by label strength.
- Omitting the label's “per two units” denominator.
- Assuming every tablet may be halved or quartered.
- Rounding an unmeasurable positive volume to zero.
- Using total container volume instead of concentration.
- Reporting a count with mass units or a volume without `mL`.

### Families

#### Family `solid_unit_count`

**Task.** calculate the number of synthetic solid units for an ordered amount.

**Response/template.** count with form unit.

**Derivation.** ordered amount ÷ amount per unit.

**Difficulty.** unit conversion and non-integer allowed count.

**Distractors.** multiply, invert fraction, answer amount instead of count.

**Feedback.** show unit cancellation and reverse product.

**Examples.** (1) 100 mg order,50 mg/unit →2 units. (2) 0.6 g order,200 mg/unit →3. (3) 75 mg,50 mg/unit with halves permitted →1.5 units.

**Validation.** Exact rational count and form-permission check.

#### Family `solid_fraction_permission`

**Task.** decide whether a calculated fractional count is representable under the label's permitted divisions.

**Response/template.** representable or stop reason.

**Derivation.** reduce fraction and check denominator against allowed set.

**Difficulty.** quarters versus halves and multiple units.

**Distractors.** round to nearest whole, assume visible score, accept any decimal.

**Feedback.** show exact fraction and permitted increments.

**Examples.** (1) 1.5 with halves allowed →representable. (2) 1.25 with halves only →stop. (3) 2/3 when only quarters allowed →stop.

**Validation.** Synthetic label explicitly supplies divisibility; no real product inference.

#### Family `multi_strength_units`

**Task.** construct a requested amount from supplied synthetic unit strengths under a count/minimization rule.

**Response/template.** count per strength or stop.

**Derivation.** bounded integer/rational combination search.

**Difficulty.** several strengths, maximum unit count, fractional permissions.

**Distractors.** near amount, wrong total, unnecessary units under minimum-count rubric.

**Feedback.** sum selected amounts.

**Examples.** (1) 75 from 50+25. (2) 125 from two50+one25 under supplied inventory. (3) no exact allowed combination →stop.

**Validation.** Enumerate all combinations; accept every minimum solution if tied.

#### Family `liquid_volume`

**Task.** calculate volume from ordered amount and concentration.

**Response/template.** mL.

**Derivation.** amount ÷ `(amount/mL)`.

**Difficulty.** label denominator not 1 mL and mass conversion.

**Distractors.** multiply, use total container volume, omit denominator normalization.

**Feedback.** dimensional chain and reverse amount check.

**Examples.** (1) 100 mg at20 mg/mL →5 mL. (2) 75 mg from150 mg/5 mL →2.5 mL. (3) 0.3 g from40 mg/mL →7.5 mL.

**Validation.** Reverse multiplication exactly reproduces amount before rounding.

#### Family `liquid_amount`

**Task.** calculate amount contained in a measured volume.

**Response/template.** mass/activity.

**Derivation.** concentration × volume.

**Difficulty.** unit conversion and partial volume.

**Distractors.** divide, use full container, drop compound dimension.

**Feedback.** show amount-per-mL times mL.

**Examples.** (1) 20 mg/mL×3 mL→60 mg. (2) 100 mg/5 mL×1.5 mL→30 mg. (3) 250 Unit-A/mL×0.4 mL→100 Unit-A.

**Validation.** Output dimension matches concentration numerator.

#### Family `dose_volume_inverse`

**Task.** solve for missing order amount or label concentration from a known volume relationship.

**Response/template.** quantity.

**Derivation.** rearrange `amount=concentration×volume`.

**Difficulty.** label denominator and mixed units.

**Distractors.** wrong inverse, confuse total container.

**Feedback.** verify all three relationship forms.

**Examples.** (1) 4 mL at25 mg/mL →100 mg. (2) 80 mg in2 mL →40 mg/mL. (3) 150 mg requires3 mL →50 mg/mL.

**Validation.** Nonzero divisor and exact reverse check.

#### Family `container_dose_count`

**Task.** calculate how many complete ordered quantities a synthetic container holds.

**Response/template.** complete count plus remainder.

**Derivation.** total amount or volume divided by per-dose requirement, floor only when “complete” is requested.

**Difficulty.** volume loss supplied, fractional remainder.

**Distractors.** round up, use nominal label count after stated loss, omit remainder.

**Feedback.** show total, quotient, and remainder without recommending use.

**Examples.** (1) 1000 mg total/100 mg →10. (2) 25 mL/4 mL →6 complete,1 mL remains. (3) usable volume explicitly 9.5 mL/1.2 →7 complete.

**Validation.** “Complete” count semantics explicit; no real stock management.

#### Family `package_total_amount`

**Task.** calculate total amount/count from package structure.

**Response/template.** total quantity.

**Derivation.** multiply per-unit amount × units per package × package count.

**Difficulty.** nested packaging and unit conversion.

**Distractors.** add levels, omit package count, report concentration.

**Feedback.** tree multiplication with units.

**Examples.** (1) 10 units×25 mg→250 mg. (2) 3 packs×8 units×50 mg→1200 mg. (3) convert total to g.

**Validation.** Counts are exact nonnegative integers.

#### Family `device_increment_rounding`

**Task.** apply a supplied measurable increment to a calculated liquid volume.

**Response/template.** rounded volume or stop.

**Derivation.** calculate unrounded value, apply named increment rule, recheck bounds.

**Difficulty.** midpoint, directed rounding, maximum after rounding.

**Distractors.** generic two-decimal rule, premature rounding, round below-positive to zero.

**Feedback.** show quotient in increment units and final reverse-delivered amount as arithmetic only.

**Examples.** (1) 2.24 mL nearest0.1→2.2 mL. (2) 2.25 with ties-up→2.3. (3) 0.04 with0.1 increment and “stop if not measurable” →stop.

**Validation.** Rounding policy printed; output is not called clinically acceptable.

#### Family `formulation_arithmetic_audit`

**Task.** find one inversion, denominator, divisibility, container, or increment error.

**Response/template.** select and correct/stop.

**Derivation.** recompute quantity then constraints.

**Difficulty.** numeric result correct before a form constraint is applied.

**Distractors.** alternative exact solution allowed by label.

**Feedback.** separate arithmetic correctness from representability.

**Examples.** (1) 100 mg÷50 mg/unit reported50 units. (2) quarter unit chosen when halves only. (3) 0.04 mL rounded to0 under stop policy.

**Validation.** Exactly one root defect.

## 5. Category: Weight-, time-, range-, and surface-area-normalized quantities

### Category purpose

Train precise distinction among per-dose, per-day, per-time, per-body-mass, and per-surface-area rules, including supplied caps and ranges.

### Learn

Read the whole unit before calculating. `mg/kg/day` gives a total daily quantity; `mg/kg/dose` gives each dose; `mcg/kg/min` is a rate. Multiply by the exact synthetic weight named by the protocol, then divide by doses or apply a cap only when the printed rule says so. Never choose a weight definition or maximum from memory.

### Prerequisites

Compound units, order components, and direct amount/volume calculations.

### Category boundaries

This category computes the protocol amount. Converting that amount to a product volume belongs in Categories 4/7. Real dose selection and organ-function adjustment are excluded.

### Common misconceptions

- Treating `/day` as `/dose`.
- Dividing by doses twice or not at all.
- Converting body mass in the wrong direction.
- Applying a maximum before multiplying when the rule caps the final amount.
- Comparing a per-dose value with a daily limit.
- Selecting an unsupplied “dosing weight.”
- Rounding BSA before calculating the protocol amount.

### Families

#### Family `weight_based_per_dose`

**Task.** calculate an amount from a supplied `amount/kg/dose` rule and training weight.

**Response/template.** amount per dose.

**Derivation.** normalized quantity × body mass.

**Difficulty.** g/kg conversions and decimal rule.

**Distractors.** divide by weight, multiply by number of daily doses, retain kg.

**Feedback.** cancel kg and reverse-divide by weight.

**Examples.** (1) 2 mg/kg/dose×20 kg→40 mg/dose. (2) 0.15 mg/kg×60 kg→9 mg. (3) 250 mcg/kg×8 kg→2000 mcg=2 mg.

**Validation.** Synthetic rate values avoid matching a reviewed exclusion list of recognizable real protocols.

#### Family `weight_based_daily`

**Task.** calculate total daily amount from `amount/kg/day`.

**Response/template.** amount/day.

**Derivation.** rate × training weight.

**Difficulty.** unit conversion and later comparison with per-dose.

**Distractors.** label as per dose, divide by 24 without instruction.

**Feedback.** retain `/day` in result.

**Examples.** (1) 6 mg/kg/day×10 kg→60 mg/day. (2) 0.4 g/kg/day×5 kg→2 g/day. (3) 75 mcg/kg/day×24 kg→1800 mcg/day.

**Validation.** Final semantic basis remains daily.

#### Family `divide_daily_doses`

**Task.** convert a total daily amount into equal per-dose amounts using a supplied count.

**Response/template.** amount/dose.

**Derivation.** daily amount ÷ exact doses/day.

**Difficulty.** start from normalized daily rate, non-integer result, cap interaction deferred.

**Distractors.** multiply by count, divide weight instead, report daily total.

**Feedback.** verify per dose × dose count = daily total.

**Examples.** (1) 60 mg/day in3→20 mg/dose. (2) 90 mg/day in4→22.5 mg/dose. (3) 5 mg/kg/day×18 kg in3→30 mg/dose.

**Validation.** Dose count positive integer and division exact oracle.

#### Family `maximum_cap_apply`

**Task.** apply a supplied maximum to an uncapped fictional protocol amount.

**Response/template.** uncapped, final, and whether cap applied.

**Derivation.** compute comparable quantities, then `min`.

**Difficulty.** per-dose versus daily cap, unit conversion, equality.

**Distractors.** compare incompatible bases, subtract maximum, cap normalized rate before weight.

**Feedback.** align units/bases before comparison.

**Examples.** (1) uncapped80 mg, max100→80. (2) uncapped120, max100→100. (3) per-dose80 cannot be compared with daily100 without dose count.

**Validation.** Maximum carries same semantic dimension or instance stops.

#### Family `minimum_maximum_range`

**Task.** compute the low/high amounts implied by a supplied normalized range.

**Response/template.** ordered interval.

**Derivation.** multiply both endpoints by the named basis and apply any separately supplied cap.

**Difficulty.** daily/per-dose conversion and endpoint rounding.

**Distractors.** multiply only one end, reverse bounds, cap low end incorrectly.

**Feedback.** parallel endpoint chains.

**Examples.** (1) 2–4 mg/kg×10 kg→20–40 mg. (2) daily range divided into2 doses. (3) high endpoint reduced by supplied max.

**Validation.** Result low≤high after rules; rejected if rounding reverses/collapses unintentionally.

#### Family `range_membership`

**Task.** classify a proposed numeric amount as below/within/above a supplied fictional range.

**Response/template.** classification.

**Derivation.** convert amount and range to same unit/basis and compare using stated inclusivity.

**Difficulty.** boundary equality, per-dose/daily conversion.

**Distractors.** compare raw numbers with different units, use exclusive boundary by habit.

**Feedback.** show normalized comparable quantities; never call it clinically safe.

**Examples.** (1) 30 in[20,40]→within. (2) 20 at inclusive low→within. (3) 50 mg/day versus range20–30 mg/dose cannot compare without frequency.

**Validation.** Incompatible semantic bases return stop.

#### Family `body_mass_unit_convert`

**Task.** convert a supplied training body mass before a normalized calculation.

**Response/template.** kg, with factor shown.

**Derivation.** use exact factor supplied in question; default optional teaching factor `1 kg=2.2 lb` only when printed.

**Difficulty.** exact versus rounded factor and downstream use.

**Distractors.** multiply pounds by2.2, use unstated factor, round mass prematurely.

**Feedback.** keep conversion factor visible and label it question-specific.

**Examples.** (1) 44 lb÷2.2→20 kg. (2) 33 lb→15 kg under printed factor. (3) use supplied 2.20462 calculator factor without early rounding.

**Validation.** No implicit lb/kg factor; source and precision saved.

#### Family `bsa_mosteller`

**Task.** calculate fictional body surface area from supplied height and body mass.

**Response/template.** m².

**Derivation.** `sqrt(height_cm×kg/3600)`.

**Difficulty.** unit preprocessing and requested precision.

**Distractors.** omit square root, use meters without adapting formula, divide by3600 after square root.

**Feedback.** substitute units and delay rounding.

**Examples.** (1) 160 cm,50 kg→sqrt(8000/3600)≈1.491 m². (2) 180,80→2.000 m². (3) height1.7 m must first become170 cm.

**Validation.** Positive realistic teaching bounds; independent calculator oracle.

#### Family `bsa_based_amount`

**Task.** apply a supplied `amount/m²` fictional rule to computed or given BSA.

**Response/template.** amount.

**Derivation.** rate × unrounded BSA, then final rounding/cap.

**Difficulty.** calculate BSA first and apply max.

**Distractors.** use body mass instead, round BSA early, retain m².

**Feedback.** show BSA calculation and amount as separate stages.

**Examples.** (1) 20 mg/m²×1.5 m²→30 mg. (2) BSA from180/80=2 then12 mg/m²→24 mg. (3) cap applied after unrounded product.

**Validation.** Formula/rate fictional and fully supplied.

#### Family `normalized_rate_reverse`

**Task.** recover the normalized rate or training weight from a known total quantity.

**Response/template.** compound quantity.

**Derivation.** rearrange `total=rate×basis`.

**Difficulty.** time/dose basis and unit conversion.

**Distractors.** multiply instead of divide, drop denominator, use daily amount with per-minute total.

**Feedback.** reverse-substitute.

**Examples.** (1) 40 mg from20 kg→2 mg/kg. (2) 120 mcg/min from60 kg→2 mcg/kg/min. (3) 90 mg/day for15 kg→6 mg/kg/day.

**Validation.** Known total and normalized basis compatible.

#### Family `normalized_protocol_audit`

**Task.** find one basis, weight, cap, range, BSA, or rounding error.

**Response/template.** select and correct/stop.

**Derivation.** parse semantic units, recompute, and check constraints.

**Difficulty.** same numeric value labeled with wrong basis or cap.

**Distractors.** correct alternative algebraic route.

**Feedback.** identify whether error precedes arithmetic or follows it.

**Examples.** (1) `/day` result labeled per dose. (2) weight chosen from an undesignated field. (3) BSA rounded before multiplication changes final increment.

**Validation.** Exactly one root defect.

## 6. Category: Concentration, reconstitution, dilution, and mixtures

### Category purpose

Train conservation-of-amount reasoning across fictional solution labels without turning calculations into preparation instructions.

### Learn

Concentration is an amount divided by volume. Reconstitution uses the **labeled final volume**. Dilution changes volume but preserves the modeled amount of solute. Keep `w/v`, `w/w`, and `v/v` distinct. These are paper calculations under ideal compatibility/additivity assumptions, not instructions to make a real product.

### Prerequisites

Mass/volume conversions and direct liquid arithmetic.

### Category boundaries

This category ends with a concentration or volume relationship. Rate over time belongs in Category 7.

### Common misconceptions

- Dividing volume by amount to obtain concentration.
- Treating container total and concentration as the same.
- Using diluent-added volume as final volume without label support.
- Applying `C1V1=C2V2` while changing the substance identity.
- Mixing percentage bases.
- Interpreting `1:1000` without the declared basis.
- Averaging concentrations without volume weighting.

### Families

#### Family `mass_volume_concentration`

**Task.** calculate concentration from amount and volume.

**Response/template.** mass/volume.

**Derivation.** amount ÷ volume, with unit conversion.

**Difficulty.** non-1 mL denominator and requested alternate unit.

**Distractors.** volume/amount, report total amount, omit denominator.

**Feedback.** show ratio and reverse conservation.

**Examples.** (1) 100 mg/5 mL→20 mg/mL. (2) 0.5 g/250 mL→2 mg/mL. (3) 300 mcg/0.6 mL→500 mcg/mL.

**Validation.** Positive amount/volume; independent reverse product.

#### Family `amount_from_concentration`

**Task.** calculate total amount in a supplied volume.

**Response/template.** mass/activity.

**Derivation.** concentration × volume.

**Difficulty.** mixed volume units and compound-specific activity.

**Distractors.** divide, convert after multiplication incorrectly.

**Feedback.** cancel volume and preserve compound ID.

**Examples.** (1) 4 mg/mL×25 mL→100 mg. (2) 0.2 g/L×0.5 L→0.1 g. (3) 80 Unit-A/mL×3.5 mL→280 Unit-A.

**Validation.** Exact dimensional oracle.

#### Family `volume_from_concentration`

**Task.** calculate volume containing a target amount.

**Response/template.** volume.

**Derivation.** amount ÷ concentration.

**Difficulty.** unit conversion and subsequent measurable-increment rule.

**Distractors.** multiply, use total container, ignore activity ID.

**Feedback.** reverse-check amount.

**Examples.** (1) 60 mg at20 mg/mL→3 mL. (2) 0.3 g at50 mg/mL→6 mL. (3) result0.04 mL with0.1 stop rule→stop.

**Validation.** Divisor positive and compound identity matches.

#### Family `percent_strength`

**Task.** convert between declared percentage strength and amount/volume or mass/mass concentration.

**Response/template.** expanded ratio/concentration.

**Derivation.** apply exact basis definition.

**Difficulty.** w/v versus w/w versus v/v and inverse conversion.

**Distractors.** treat 1%=1 mg/mL, mix bases, divide by100 twice.

**Feedback.** expand percent to `x per100` before converting.

**Examples.** (1) 1% w/v→1 g/100 mL=10 mg/mL. (2) 0.5% w/v→5 mg/mL. (3) 2% w/w→2 g/100 g, not mg/mL.

**Validation.** Basis always visible; density never inferred.

#### Family `ratio_strength`

**Task.** expand or convert fictional `1:N w/v` ratio strength.

**Response/template.** g/mL or mg/mL.

**Derivation.** `1 g/N mL`, then convert units.

**Difficulty.** large N and inverse missing N.

**Distractors.** `N g/1 mL`, percent without conversion, ignore w/v.

**Feedback.** immediately rewrite in unambiguous mass/volume form.

**Examples.** (1) `1:100 w/v→10 mg/mL`. (2) `1:1000→1 mg/mL`. (3) `2 mg/mL→1:500 w/v` under profile.

**Validation.** Ratio strength never appears alone in integrated administration questions.

#### Family `reconstitution_final_concentration`

**Task.** calculate post-reconstitution concentration from total amount and labeled final volume.

**Response/template.** concentration.

**Derivation.** total amount ÷ final volume.

**Difficulty.** label also displays diluent amount/displacement distractor.

**Distractors.** divide by diluent-added volume, add powder amount as volume, use pre-reconstitution container volume.

**Feedback.** highlight “final volume.”

**Examples.** (1) 500 mg final10 mL→50 mg/mL. (2) add8 mL but final10 mL→use10. (3) final volume absent→stop.

**Validation.** Final-volume source tagged; no physical preparation instructions.

#### Family `reconstitution_target_volume`

**Task.** calculate volume needed from a fully specified post-reconstitution concentration.

**Response/template.** mL or stop.

**Derivation.** target amount ÷ concentration; apply measurement rule.

**Difficulty.** concentration must first be derived and rounded only at end.

**Distractors.** use diluent amount as concentration denominator, round intermediate concentration.

**Feedback.** separate reconstitution label calculation from target-volume calculation.

**Examples.** (1) 500 mg/10 mL and target100 mg→2 mL. (2) 1 g final20 mL and target75 mg→1.5 mL. (3) measurement increment makes exact result unavailable→stop.

**Validation.** Independent amount-conservation check after final rounding.

#### Family `dilution_c1v1`

**Task.** solve one missing value in `C1V1=C2V2` under the ideal fictional model.

**Response/template.** concentration or volume.

**Derivation.** conserve amount and algebraically isolate target.

**Difficulty.** unit conversion, choose stock/final sides, inverse target.

**Distractors.** add concentrations, swap V1/V2, change substance.

**Feedback.** show conserved amount on both sides.

**Examples.** (1) 10 mg/mL×5 mL to final25 mL→2 mg/mL. (2) stock20, target5, final40→10 mL stock. (3) mismatched compounds→stop.

**Validation.** `C1V1` and `C2V2` equal independently.

#### Family `diluent_volume`

**Task.** distinguish stock volume from diluent-to-add volume.

**Response/template.** two named volume fields.

**Derivation.** solve stock volume, then `final-stock`.

**Difficulty.** stock already has nonzero volume and final-volume cap.

**Distractors.** report final volume as diluent, subtract backward, equate dilution ratio with add volume.

**Feedback.** volume bar showing stock + diluent = final under ideal additivity.

**Examples.** (1) stock5 mL, final20→add15. (2) stock12.5, final50→37.5. (3) calculated stock exceeds final→invalid/stop.

**Validation.** Additivity explicitly supplied and add volume nonnegative.

#### Family `serial_dilution`

**Task.** calculate concentration or cumulative dilution factor through several ideal stages.

**Response/template.** factor and final concentration.

**Derivation.** multiply stage dilution fractions.

**Difficulty.** unequal stages, recover one stage, avoid premature rounding.

**Distractors.** add dilution factors, use diluent/final instead of stock/final, round each stage.

**Feedback.** stage table and cumulative product.

**Examples.** (1) two 1:10 stages→1:100. (2) 8 mg/mL×1/4×1/5→0.4 mg/mL. (3) solve missing factor from total1:200.

**Validation.** Stage definitions explicit; “1:10 dilution” rendered as stock fraction 1/10 to avoid ambiguity.

#### Family `mixture_concentration`

**Task.** compute ideal concentration after mixing compatible solutions of the same synthetic compound.

**Response/template.** total amount, total volume, concentration.

**Derivation.** sum `CiVi`, sum volumes, divide.

**Difficulty.** unequal volumes/concentrations and mixed units.

**Distractors.** simple average of concentrations, average weighted backward, omit one amount.

**Feedback.** amount/volume table.

**Examples.** (1) equal volumes 2 and6 mg/mL→4. (2) 10 mL×2 plus30 mL×6→5 mg/mL. (3) different compounds→cannot use one mixture concentration.

**Validation.** Compatibility/additivity and identical compound IDs required.

#### Family `concentration_audit`

**Task.** find one basis, denominator, final-volume, conservation, or mixture error.

**Response/template.** select and correct/stop.

**Derivation.** recompute amounts and dimensions.

**Difficulty.** wrong method gives plausible value.

**Distractors.** equivalent concentration forms.

**Feedback.** identify which amount-conservation identity fails.

**Examples.** (1) simple average for unequal volumes. (2) uses8 mL added instead of10 mL final. (3) treats2% w/w as20 mg/mL.

**Validation.** Exactly one root defect.

## 7. Category: Infusion, pump-rate, and gravity-drop arithmetic

### Category purpose

Train rate/volume/time relationships and multi-unit cancellation under entirely synthetic, non-operational conditions.

### Learn

Start with the requested unit. For `mL/h`, cancel amount units using concentration and convert minutes/hours explicitly. Check by multiplying the final rate by time: it should reproduce volume, and concentration should reproduce amount. A correct number is still a simulation answer—not a pump setting.

### Prerequisites

Compound-unit conversion, concentration, normalized rates, and final-only rounding.

### Category boundaries

This category performs arithmetic only. Device operation, clinical titration, compatibility, line setup, and real pump programming are excluded.

### Common misconceptions

- Using total bag volume when concentration is needed.
- Multiplying by concentration instead of dividing for mL/h.
- Missing the `60 min/h` factor.
- Multiplying by body mass twice.
- Treating mL/h and drops/min as interchangeable.
- Memorizing a drop factor rather than using the supplied set.
- Rounding intermediate rate before reverse-checking.

### Families

#### Family `volume_rate`

**Task.** calculate mL/h from volume and duration.

**Response/template.** mL/h.

**Derivation.** volume ÷ hours.

**Difficulty.** minutes-to-hours and non-integer rate.

**Distractors.** time/volume, divide by minutes but label per hour.

**Feedback.** verify rate×time=volume.

**Examples.** (1) 500 mL/5 h→100 mL/h. (2) 120 mL/90 min→80 mL/h. (3) 75 mL/2.5 h→30 mL/h.

**Validation.** Positive time; reverse equality.

#### Family `time_from_volume_rate`

**Task.** calculate duration from volume and rate.

**Response/template.** hours/minutes.

**Derivation.** volume ÷ rate, then convert.

**Difficulty.** mixed units and clock-style display.

**Distractors.** rate/volume, decimal hour read as clock minutes.

**Feedback.** show decimal-to-minutes conversion.

**Examples.** (1) 300 mL at100 mL/h→3 h. (2) 75 at50→1.5 h=90 min. (3) 40 at24→1 h40 min.

**Validation.** Clock formatting independently checked.

#### Family `volume_from_rate_time`

**Task.** calculate delivered synthetic volume from rate and elapsed time.

**Response/template.** mL.

**Derivation.** rate×time with units aligned.

**Difficulty.** partial hours and changing rates in segments.

**Distractors.** divide, treat minutes as hours, average rates unweighted.

**Feedback.** timeline area as rate×time.

**Examples.** (1) 25 mL/h×4 h→100 mL. (2) 60×30 min→30 mL. (3) 20 for1 h plus40 for0.5 h→40 mL.

**Validation.** Segments non-overlapping; sum exact.

#### Family `mass_rate_to_volume_rate`

**Task.** convert a mass/time order and concentration to volume/time.

**Response/template.** mL/h.

**Derivation.** ordered mass rate ÷ concentration with time conversion.

**Difficulty.** mcg/min versus mg/mL and hour target.

**Distractors.** multiply concentration, omit 60/1000 factors.

**Feedback.** full factor chain and reverse amount rate.

**Examples.** (1) 20 mg/h at10 mg/mL→2 mL/h. (2) 100 mcg/min at1 mg/mL→6 mL/h. (3) 0.2 mg/min at5 mg/mL→2.4 mL/h.

**Validation.** Two independent paths and magnitude estimate.

#### Family `weight_normalized_infusion`

**Task.** convert a supplied amount/kg/time rate, training weight, and concentration to volume/time.

**Response/template.** mL/h.

**Derivation.** normalized rate×kg×time conversion÷concentration.

**Difficulty.** three unit scales and cap.

**Distractors.** divide by weight, multiply concentration, omit minute/hour.

**Feedback.** cancel units line by line.

**Examples.** (1) 2 mcg/kg/min×50 kg with100 mcg/mL→60 mL/h. (2) 0.5 mg/kg/h×20 kg at5 mg/mL→2 mL/h. (3) supplied max rate triggers cap before volume conversion.

**Validation.** Generated rates are fictional and screened against recognizable high-alert examples.

#### Family `pump_rate_from_bag`

**Task.** calculate synthetic pump display rate from total amount/volume and ordered amount rate.

**Response/template.** mL/h.

**Derivation.** derive bag concentration then divide ordered rate by it.

**Difficulty.** label in total bag form and mixed time units.

**Distractors.** use bag volume as concentration, invert bag ratio.

**Feedback.** two-stage concentration→rate solution.

**Examples.** (1) 500 mg/250 mL, order20 mg/h→10 mL/h. (2) 1 g/500 mL, order50 mg/h→25. (3) conflicting printed concentration and totals→stop.

**Validation.** Label consistency checked before calculation.

#### Family `amount_rate_from_pump`

**Task.** calculate fictional amount/time delivered by a supplied pump rate and concentration.

**Response/template.** mass/time.

**Derivation.** mL/time×amount/mL.

**Difficulty.** minute/hour conversion and weight-normalized reverse.

**Distractors.** divide, use total bag amount without volume.

**Feedback.** cancel mL and optionally divide by training weight.

**Examples.** (1) 5 mL/h×4 mg/mL→20 mg/h. (2) 6 mL/h×1 mg/mL→100 mcg/min. (3) divide by50 kg→2 mcg/kg/min.

**Validation.** Round-trip with rate conversion oracle.

#### Family `drop_rate`

**Task.** calculate drops/min using supplied volume, duration, and set factor.

**Response/template.** drops/min under printed rounding rule.

**Derivation.** `mL×drops/mL÷min`.

**Difficulty.** duration conversion and final integer rounding.

**Distractors.** omit drop factor, use h denominator, use a memorized factor.

**Feedback.** show unrounded rate and rule.

**Examples.** (1) 100 mL over50 min at10 drops/mL→20 drops/min. (2) 120 mL/2 h at15→15 drops/min. (3) 83.3 rounded by supplied nearest-whole rule→83.

**Validation.** Drop factor always printed and set-specific.

#### Family `drop_duration`

**Task.** solve volume or duration from drops/min and supplied drop factor.

**Response/template.** volume/time.

**Derivation.** rearrange drop-rate equation.

**Difficulty.** rounded observed rate creates interval/approximate answer when specified.

**Distractors.** treat drops as mL, wrong inverse, ignore rounding uncertainty.

**Feedback.** reverse equation and distinguish exact set rate from rounded display.

**Examples.** (1) 20 drops/min,10 drops/mL for50 min→100 mL. (2) 15 drops/min,15 drops/mL for120 min→120 mL. (3) infer duration only when rate is declared exact.

**Validation.** Approximate-versus-exact metadata explicit.

#### Family `infusion_segment_total`

**Task.** total volume or amount across piecewise-constant synthetic rate segments.

**Response/template.** total and segment table.

**Derivation.** sum rate×duration, then concentration if requested.

**Difficulty.** unit changes and one pause segment.

**Distractors.** unweighted average, include gap as active, overlap segments.

**Feedback.** area-under-step-timeline representation.

**Examples.** (1) 10 mL/h×2 h +20×1 h→40 mL. (2) include30-min pause→0 during pause. (3) concentration3 mg/mL→120 mg total.

**Validation.** Timeline monotonic and segments nonoverlapping.

#### Family `bag_remaining_time`

**Task.** calculate synthetic remaining time from usable volume and current constant rate.

**Response/template.** duration.

**Derivation.** usable volume ÷ rate.

**Difficulty.** prior delivered volume and reserve excluded by supplied rule.

**Distractors.** use nominal rather than usable volume, add elapsed time, ignore unit.

**Feedback.** calculate remaining volume first.

**Examples.** (1) 200 mL at50→4 h. (2) 500 initial,120 used,40/h→9.5 h. (3) supplied unusable20 mL deducted before division.

**Validation.** Pure timeline arithmetic; no recommendation to change a bag.

#### Family `infusion_audit`

**Task.** find one rate, time, concentration, body-mass, drop-factor, or rounding error.

**Response/template.** select and correct/stop.

**Derivation.** dimension check, independent reverse calculation, constraint check.

**Difficulty.** result differs by 60 or1000 and may look plausible.

**Distractors.** alternative exact factor order.

**Feedback.** highlight missing/inverted factor and final unit.

**Examples.** (1) mcg/min→mg/h misses60. (2) concentration multiplied instead of divided. (3) drop factor taken from memory rather than displayed set.

**Validation.** Exactly one root defect.

## 8. Category: Synthetic fluid balance and schedules

### Category purpose

Train signed totals, rate over intervals, and time sequencing without attaching clinical meaning.

### Learn

Keep intake and output as separate signed categories, align time windows, and calculate net only after totals. For schedules, count elapsed intervals on the synthetic 24-hour timeline; do not assume that “three times daily” specifies exact times.

### Prerequisites

Volume/time conversion and basic timeline arithmetic.

### Category boundaries

This category does not interpret hydration, urine output, treatment, adherence, missed doses, or real scheduling.

### Common misconceptions

- Adding output rather than subtracting it in net balance.
- Mixing different observation windows.
- Double-counting a boundary event.
- Reading decimal hours as clock notation.
- Equating times-per-day with exact spacing.
- Ignoring a paused interval.

### Families

#### Family `intake_total`

**Task.** total fictional intake entries over a declared interval.

**Response/template.** volume.

**Derivation.** convert compatible volumes and sum included entries.

**Difficulty.** several units and boundary inclusion.

**Distractors.** include outside-window entry, subtract one item, skip conversion.

**Feedback.** table included/excluded rows.

**Examples.** (1) 200+300 mL→500. (2) 0.5 L+250 mL→750 mL. (3) exclude entry at open interval endpoint.

**Validation.** Time-window boundary explicit.

#### Family `output_total`

**Task.** total fictional output entries over a declared interval.

**Response/template.** volume.

**Derivation.** same as intake but preserve category.

**Difficulty.** cumulative meter values versus interval entries.

**Distractors.** sum cumulative readings, include prior baseline.

**Feedback.** distinguish increments from cumulative counter difference.

**Examples.** (1) 100+150→250 mL. (2) cumulative rises400→650→output250. (3) convert0.2 L plus75 mL→275.

**Validation.** Data model tags incremental/cumulative.

#### Family `net_fluid_balance`

**Task.** compute synthetic net balance.

**Response/template.** signed volume.

**Derivation.** intake total − output total.

**Difficulty.** negative result and mixed units.

**Distractors.** total both positive, reverse sign, report magnitude only.

**Feedback.** show signed equation and explicitly withhold clinical meaning.

**Examples.** (1) 1000−700→+300 mL. (2) 500−800→−300. (3) equal totals→0.

**Validation.** Sign retained; no “good/bad” label.

#### Family `rate_over_interval`

**Task.** compute average volume rate over a specified synthetic window.

**Response/template.** mL/h.

**Derivation.** total volume ÷ elapsed hours.

**Difficulty.** irregular timestamps and partial window.

**Distractors.** divide by event count, use clock difference incorrectly.

**Feedback.** derive elapsed time then rate.

**Examples.** (1) 240 mL/4 h→60. (2) 90 mL from08:30–10:00→60. (3) compare two equal-duration windows.

**Validation.** Times unambiguous and same artificial day.

#### Family `schedule_intervals`

**Task.** generate or complete equally spaced synthetic times from a start and interval.

**Response/template.** ordered times.

**Derivation.** repeated elapsed-time addition modulo24 only when wrap is declared.

**Difficulty.** overnight wrap and minute offsets.

**Distractors.** base-100 minutes, count start as elapsed interval, use times-per-day spacing without rule.

**Feedback.** timeline arrows.

**Examples.** (1) start06:00 every6 h→06,12,18,00. (2) 07:30 every8 h→07:30,15:30,23:30. (3) “3 times daily” alone→exact times not determined.

**Validation.** No real date/DST behavior.

#### Family `doses_per_day_from_interval`

**Task.** calculate number of equal events in 24 h under the simple periodic model.

**Response/template.** count or non-integer warning.

**Derivation.** `24 h / interval`, only if exact tiling is required by profile.

**Difficulty.** minute intervals and non-divisor.

**Distractors.** add one endpoint, round non-integer silently.

**Feedback.** show cycle length and boundary convention.

**Examples.** (1) every8 h→3. (2) every6 h→4. (3) every5 h does not evenly tile24; follow supplied horizon rule rather than say 4.8 doses.

**Validation.** The task never turns count into real schedule advice.

#### Family `remaining_duration`

**Task.** calculate remaining time in a fixed synthetic course/timeline from elapsed intervals.

**Response/template.** time.

**Derivation.** total planned duration − elapsed duration.

**Difficulty.** mixed day/hour units and pause policy.

**Distractors.** subtract event count as hours, include paused time contrary to rule.

**Feedback.** duration bar.

**Examples.** (1) 12 h total,5 elapsed→7. (2) 3 days−30 h→42 h. (3) active-time-only course excludes a supplied pause.

**Validation.** Nonnegative; no advice about continuing/stopping medication.

#### Family `timeline_audit`

**Task.** find one window, sign, interval, wrap, or cumulative-count error.

**Response/template.** select and correct.

**Derivation.** replay timeline and totals.

**Difficulty.** boundary event or cumulative/incremental mix.

**Distractors.** alternative format with same elapsed time.

**Feedback.** identify first temporal/category mistake.

**Examples.** (1) output added to net. (2) 1.5 h read as1 h50. (3) start/end both counted as four intervals when only three elapsed.

**Validation.** Exactly one root defect.

## 9. Category: Laboratory reference and report reasoning

### Category purpose

Train disciplined comparison of a synthetic result with the exact interval, unit, method, group, and rule printed on its own report—without diagnosis.

### Learn

A reference interval is not a universal “healthy/unhealthy” boundary. Select the interval that matches the report's metadata, put the result and interval in the same unit, apply the stated boundary convention, and use only the requested label: below, within, above, critical by supplied rule, overlap, or not comparable. Reference, decision, and critical thresholds are different objects.

### Prerequisites

Unit conversion, interval comparison, percentages, and stop conditions.

### Category boundaries

This category interprets report structure and arithmetic flags only. It excludes diseases, symptoms, treatment, urgency, predictive value, and diagnostic testing.

### Common misconceptions

- Looking up or recalling a universal range instead of using the report.
- Comparing different units as raw numbers.
- Selecting an interval based on an inferred demographic category.
- Treating an outside result as a diagnosis.
- Treating an inside result as proof of health.
- Treating a reference endpoint as a critical threshold.
- Comparing incompatible laboratory methods.
- Calling `x±u` a confidence interval without a definition.

### Families

#### Family `reference_interval_classify`

**Task.** classify a synthetic result against its printed inclusive reference interval.

**Response/template.** below/within/above.

**Derivation.** compare full-precision value with `[low,high]`.

**Difficulty.** decimal precision, converted units, close boundary.

**Distractors.** use a memorized range, reverse high/low, round before compare.

**Feedback.** show number line and state that classification is not diagnosis.

**Examples.** (1) 5 in[3,7]→within. (2) 2.9→below. (3) 7.1→above.

**Validation.** Synthetic analyte names and intervals only.

#### Family `reference_boundary`

**Task.** apply inclusive/exclusive endpoint notation exactly.

**Response/template.** classification.

**Derivation.** use bracket/parenthesis predicates.

**Difficulty.** equality and mixed open/closed interval.

**Distractors.** assume every endpoint included, round onto boundary.

**Feedback.** verbalize endpoint rule.

**Examples.** (1) 3 in[3,7]→within. (2) 3 in(3,7]→below/not within. (3) 7 in[3,7)→above/not within.

**Validation.** Wording distinguishes mathematical classification from clinical terms.

#### Family `select_applicable_interval`

**Task.** select the one reference interval matching supplied report metadata.

**Response/template.** interval ID or stop.

**Derivation.** exact predicate match on lab, method, specimen, group, and context.

**Difficulty.** several near-matching rows and missing metadata.

**Distractors.** match analyte only, infer group, choose widest range.

**Feedback.** table each field match.

**Examples.** (1) Method-M/specimen-S selects row M/S. (2) age-band ID supplied selects exact band. (3) group ID missing with multiple candidates→stop.

**Validation.** Never infer sex, gender, pregnancy, age, fasting, or specimen context.

#### Family `lab_unit_match`

**Task.** decide whether result and interval units are directly comparable.

**Response/template.** yes/no/conversion needed.

**Derivation.** compare dimensional and analyte identities, not text similarity.

**Difficulty.** scaled units and mass-versus-amount concentration.

**Distractors.** compare `mg/L` with `mmol/L` without factor, treat dL/L as identical numbers.

**Feedback.** name required scale/analyte factor.

**Examples.** (1) mg/L versus mg/L→yes. (2) mg/dL versus mg/L→convert. (3) mg/L versus mmol/L without analyte factor→stop.

**Validation.** Type system enforces analyte-specific amount/mass.

#### Family `lab_metric_convert`

**Task.** convert a result between metric-scaled concentration units.

**Response/template.** converted result.

**Derivation.** dimensional factor chain.

**Difficulty.** numerator and denominator scales together.

**Distractors.** convert numerator only, wrong dL/L direction, thousandfold error.

**Feedback.** full unit cancellation.

**Examples.** (1) 10 mg/dL→100 mg/L. (2) 250 mcg/L→0.25 mg/L. (3) 0.4 mg/mL→400 mg/L.

**Validation.** Exact SI factors and same analyte ID.

#### Family `analyte_factor_convert`

**Task.** use a supplied analyte-specific factor to convert mass/amount concentration.

**Response/template.** converted result.

**Derivation.** multiply by factor whose units and direction are printed.

**Difficulty.** reciprocal factor and interval conversion.

**Distractors.** use factor from another analyte, invert incorrectly, memorize real chemistry.

**Feedback.** show analyte ID and cancel units.

**Examples.** (1) Marker-A factor `2 mmol/L per mg/L`; 3→6. (2) reverse using reciprocal. (3) factor for Marker-B cannot convert Marker-A.

**Validation.** Factors fictional and bound to analyte/method IDs.

#### Family `convert_reference_interval`

**Task.** convert both endpoints of a synthetic reference interval to a requested unit.

**Response/template.** ordered interval.

**Derivation.** monotone positive conversion applied to both endpoints.

**Difficulty.** analyte factor and reported precision.

**Distractors.** convert result but not range, convert one endpoint, reverse interval.

**Feedback.** parallel endpoint factor chains.

**Examples.** (1) [1,2] mg/dL→[10,20] mg/L. (2) [500,900] mcg/L→[0.5,0.9] mg/L. (3) supplied factor converts mass to amount endpoints.

**Validation.** Preserve boundary openness and endpoint order.

#### Family `critical_vs_reference`

**Task.** classify a result against separately supplied reference and critical thresholds.

**Response/template.** all applicable labels plus stop/review flag.

**Derivation.** evaluate independent predicates in priority display order.

**Difficulty.** outside reference but not critical, equality semantics.

**Distractors.** equate reference high with critical high, infer critical from distance.

**Feedback.** overlay both boundary sets and withhold treatment meaning.

**Examples.** (1) above reference, below critical→above only. (2) exceeds supplied critical high→critical-high and stop/review. (3) no critical rule→cannot classify critical.

**Validation.** Critical values wholly synthetic and never resemble named real-analyte guidance intentionally.

#### Family `qualitative_result`

**Task.** compare a synthetic qualitative result with the report's expected category set.

**Response/template.** matches/does-not-match/not-interpretable.

**Derivation.** exact categorical lookup; no disease meaning.

**Difficulty.** indeterminate/equivocal categories and invalid specimen flag.

**Distractors.** treat positive as “good,” infer diagnosis, collapse indeterminate into negative.

**Feedback.** state only report-category relation.

**Examples.** (1) expected `NEG`, observed `NEG`→matches. (2) observed `POS`→does not match expected. (3) `INVALID`→not interpretable under supplied rule.

**Validation.** Generic categories and synthetic marker; no test name.

#### Family `lab_delta_absolute`

**Task.** calculate signed absolute change between compatible result reports.

**Response/template.** quantity.

**Derivation.** new−old after unit alignment.

**Difficulty.** negative change, precision, compatibility metadata.

**Distractors.** absolute magnitude only, old−new, compare incompatible labs.

**Feedback.** show ordered subtraction and compatibility check.

**Examples.** (1) 8−5→+3 units. (2) 4−7→−3. (3) different incompatible methods→not comparable.

**Validation.** Same analyte and compatible profile required.

#### Family `lab_delta_percent`

**Task.** calculate percent change and apply a fictional delta-review threshold.

**Response/template.** percent and threshold result.

**Derivation.** `(new-old)/old×100`, old nonzero, compare absolute or signed percentage as specified.

**Difficulty.** negative change, unit conversion, threshold equality.

**Distractors.** divide by new, percentage-point subtraction, ignore sign/absolute rule.

**Feedback.** show denominator and exact rule.

**Examples.** (1) 10→12 =+20%. (2) 8→6=−25%. (3) old0→percent change undefined/stop.

**Validation.** Fictional threshold printed; output is review flag, not clinical change.

#### Family `lab_uncertainty_overlap`

**Task.** classify `x±u` relative to a supplied interval under the simplified uncertainty model.

**Response/template.** definitely below/inside/above/overlaps.

**Derivation.** form `[x-u,x+u]` and compare intervals.

**Difficulty.** one/both boundaries and open endpoints.

**Distractors.** classify center only, call it confidence interval, add uncertainty to reference interval.

**Feedback.** show uncertainty bar and limitation.

**Examples.** (1) 5±0.2 versus[4,6]→inside. (2) 4±0.3 versus[4.2,6]→overlaps low boundary. (3) 7±0.1 versus[4,6]→above.

**Validation.** `u≥0`; semantics never mislabeled.

#### Family `reference_reasoning_audit`

**Task.** find one interval-selection, unit, threshold, comparison, uncertainty, or diagnostic-overclaim error.

**Response/template.** select and correct/stop.

**Derivation.** validate report context before numeric comparison.

**Difficulty.** arithmetic correct under wrong interval/method.

**Distractors.** harmless reported-precision differences.

**Feedback.** identify whether evidence supports classification only or no comparison.

**Examples.** (1) result compared with another lab's interval. (2) outside range called a diagnosis. (3) critical threshold invented from reference endpoint.

**Validation.** Exactly one root defect and no clinical interpretation in correction.

## 10. Category: Rounding, estimation, and independent verification

### Category purpose

Make error detection, final-only rounding, measurability, magnitude checks, and independent verification habitual rather than optional polish.

### Learn

Estimate the scale before calculating. Keep full precision until the requested final quantity, apply the printed increment rule, then substitute the result back into the original relationship. A second calculation that merely repeats the same key presses is not independent. If rounding or missing precision changes a supplied bound, stop for review.

### Prerequisites

At least one direct quantity family and one concentration/rate family.

### Category boundaries

This category validates arithmetic. It does not establish clinical acceptability or choose local rounding policy.

### Common misconceptions

- Rounding intermediate concentration, weight, or BSA.
- Applying a generic “two decimal places” rule.
- Reporting more measurable precision than the supplied device.
- Accepting a thousandfold answer because calculator syntax was followed.
- Calling repeated identical arithmetic an independent check.
- Ignoring disagreement between forward and reverse paths.

### Families

#### Family `round_to_increment`

**Task.** round a nonnegative value to a supplied increment and tie rule.

**Response/template.** rounded quantity.

**Derivation.** divide by increment, round integer index, multiply back.

**Difficulty.** non-decimal increments and directed rounding.

**Distractors.** decimal-place rounding, reverse direction, midpoint rule mismatch.

**Feedback.** show value in increment units.

**Examples.** (1) 2.24 to0.1→2.2. (2) 2.25 ties-up→2.3. (3) 17 to nearest5→15.

**Validation.** Result is integer multiple of increment.

#### Family `round_final_only`

**Task.** compare calculations with correct final-only versus premature rounding.

**Response/template.** final value or method choice.

**Derivation.** compute exact path and premature-rounding alternative.

**Difficulty.** several stages and final increment.

**Distractors.** round every displayed intermediate, round BSA/concentration first.

**Feedback.** quantify divergence.

**Examples.** (1) retain 1.491… BSA until amount. (2) derive 33.333… mg/mL then volume. (3) premature rate rounding crosses supplied cap.

**Validation.** Reject instances where both methods produce same final answer unless equivalence is target.

#### Family `reported_precision`

**Task.** format a result to stated decimal places/significant figures while preserving context rules.

**Response/template.** formatted quantity.

**Derivation.** apply requested numeric precision and medication/lab notation policy.

**Difficulty.** zeros significant in lab but unsafe trailing in medication.

**Distractors.** confuse decimal places/significant figures, strip lab precision, add medication zero.

**Feedback.** separate numeric precision from safety notation context.

**Examples.** (1) 1.246 to2 decimals→1.25. (2) 0.00487 to2 sig figs→0.0049. (3) lab5.0 retains one decimal; medication5.0 rewrites5.

**Validation.** Context ID determines formatting.

#### Family `order_of_magnitude_estimate`

**Task.** choose a defensible magnitude interval before exact calculation.

**Response/template.** power-of-ten band or range.

**Derivation.** round inputs to one significant scale and bound operations.

**Difficulty.** compound factors of60/1000 and concentration inversion.

**Distractors.** exact-looking value, wrong prefix, ignore denominator.

**Feedback.** show coarse mental estimate and compare exact.

**Examples.** (1) 0.5 mg≈500 mcg, not0.5 mcg. (2) 100 mcg/min≈6 mg/h. (3) 50 mg at10 mg/mL≈5 mL.

**Validation.** Exact answer lies within accepted estimate band.

#### Family `reverse_calculation`

**Task.** verify a proposed result by substituting it into the inverse relationship.

**Response/template.** verified/not verified and reconstructed value.

**Derivation.** use inverse formula with full units.

**Difficulty.** rounded candidate and allowed discrepancy.

**Distractors.** repeat forward division, compare raw numbers with different units.

**Feedback.** show reconstructed source quantity.

**Examples.** (1) 5 mL×20 mg/mL→100 mg. (2) 80 mL/h×1.5 h→120 mL. (3) per-dose×count→daily total.

**Validation.** Tolerance derives from final rounding, not arbitrary percentage.

#### Family `independent_path_compare`

**Task.** compare two genuinely different calculation paths and resolve agreement/disagreement.

**Response/template.** agree/disagree and first divergent step.

**Derivation.** normalize both exact results/dimensions.

**Difficulty.** equivalent factor orders and one seeded reciprocal error.

**Distractors.** call formatting difference disagreement, accept same wrong duplicated path as independent.

**Feedback.** align units and intermediate invariants.

**Examples.** (1) normalize label first versus direct ratio. (2) amount-first versus volume-first mixture check. (3) one path omits60 and disagrees.

**Validation.** Paths use separately implemented functions, not one shared final formula.

#### Family `measurability_check`

**Task.** determine whether a calculated quantity is representable under supplied increment and policy.

**Response/template.** measurable, rounded result, or stop.

**Derivation.** compare exact result with allowed lattice/range.

**Difficulty.** maximum error tolerance and directed policy.

**Distractors.** silently round to zero, invent a smaller device, call any decimal measurable.

**Feedback.** show nearest permitted values and supplied rule.

**Examples.** (1) 2.3 on0.1 lattice→exactly measurable. (2) 2.34 with nearest0.1→2.3 if permitted. (3) 0.04 with stop-below0.1→stop.

**Validation.** No device recommendation.

#### Family `supplied_bound_recheck`

**Task.** re-evaluate a supplied min/max/total constraint after rounding.

**Response/template.** passes or stop reason.

**Derivation.** compare rounded and reconstructed quantities with constraint in same basis.

**Difficulty.** rounding direction crosses boundary and daily total accumulation.

**Distractors.** check unrounded only, compare per-dose with daily, use displayed rounded bound.

**Feedback.** show pre/post rounding values.

**Examples.** (1) rounded amount remains below max. (2) rounding up crosses max→stop. (3) each per-dose rounding changes daily total beyond supplied tolerance.

**Validation.** Bound semantic dimension must match.

#### Family `missing_data_stop`

**Task.** identify the minimum missing datum(s) that block an otherwise tempting calculation.

**Response/template.** reason code/set.

**Derivation.** dependency graph cut set.

**Difficulty.** several irrelevant values and alternate valid path.

**Distractors.** guess a standard value, demand data not needed, overlook incompatible unit.

**Feedback.** show calculation graph with missing edge.

**Examples.** (1) weight-normalized order lacks weight. (2) volume requested without concentration. (3) lab interval exists but unit conversion factor absent.

**Validation.** Enumerate minimal blocking sets; accept all when several equivalent paths exist.

#### Family `calculation_safety_audit`

**Task.** find the first rounding, precision, estimate, reverse-check, measurability, or missing-data failure.

**Response/template.** select and structured correction.

**Derivation.** execute validation pipeline in stated priority.

**Difficulty.** final number happens to match despite invalid process.

**Distractors.** stylistic differences with same safe-profile meaning.

**Feedback.** explain why process reliability matters even if number coincides.

**Examples.** (1) intermediate rounded but lucky final same. (2) forward/reverse disagree and result still accepted. (3) unmeasurable value rounded to zero.

**Validation.** Exactly one prioritized root defect.

## 11. Category: Integrated verification cases

### Category purpose

Combine parsing, dimensions, arithmetic, constraints, and review behavior in small synthetic cases while preserving a decomposed score.

### Learn

Integrated work follows gates:

1. verify that the fictional order/report is complete;
2. match label or interval metadata;
3. set up units;
4. calculate exactly;
5. apply the supplied rounding and limits;
6. reverse-check;
7. return a quantity/classification or stop reason.

Skipping an early gate cannot be compensated by later arithmetic.

### Prerequisites

The component families used by each case.

### Category boundaries

Integrated cases remain generated exercises. They never output a real order, pump setting, treatment action, or diagnostic conclusion.

### Common misconceptions

- Starting arithmetic before compatibility/completeness checks.
- Letting a plausible result override a mismatch.
- Applying the right formula to the wrong semantic basis.
- Reporting only a final number without units/checks.
- Treating a laboratory flag as a dosage instruction.
- Continuing after independent checks disagree.

### Families

#### Family `integrated_order_to_quantity`

**Task.** process a complete fixed-dose synthetic order and label through final representability.

**Response/template.** extracted data, setup, unrounded, final, verification.

**Derivation.** full gate sequence.

**Difficulty.** one unit conversion and supplied increment.

**Distractors.** bypass label denominator or rounding rule.

**Feedback.** stage-by-stage verdict.

**Examples.** (1) solid count. (2) liquid volume. (3) complete arithmetic but fractional form prohibited→stop.

**Validation.** Two independent oracles and all gates.

#### Family `integrated_normalized_liquid`

**Task.** combine normalized fictional rule, training weight, dose division/cap, concentration, and measurement increment.

**Response/template.** multi-stage named fields.

**Derivation.** normalized amount→cap/range→volume→round→reverse total.

**Difficulty.** daily/per-dose and mixed units.

**Distractors.** divide at wrong stage, compare wrong basis, round concentration.

**Feedback.** units retained at every stage.

**Examples.** (1) mg/kg/dose to mL. (2) mg/kg/day in3 doses to mL/dose. (3) cap or measurability produces stop.

**Validation.** Synthetic protocol screened and exact.

#### Family `integrated_reconstitution_quantity`

**Task.** derive fictional post-reconstitution concentration and requested solid/liquid quantity.

**Response/template.** final concentration, target volume, checks.

**Derivation.** total/final volume, then target/concentration, then increment.

**Difficulty.** diluent-versus-final-volume distractor and mass conversion.

**Distractors.** early rounding, wrong denominator.

**Feedback.** two conservation checks.

**Examples.** (1) amount/final volume then simple target. (2) supplied final volume differs from added volume. (3) missing final volume→stop.

**Validation.** No preparation verbs/instructions.

#### Family `integrated_infusion_quantity`

**Task.** combine fictional normalized rate, weight, bag concentration, and time conversion into mL/h.

**Response/template.** factor chain, result, reverse rate.

**Derivation.** full dimensional chain and independent bag-ratio path.

**Difficulty.** mcg/mg and min/h together.

**Distractors.** common 60×/1000× errors.

**Feedback.** magnitude estimate plus reverse check.

**Examples.** (1) mass/h to mL/h. (2) mcg/kg/min to mL/h. (3) inconsistent bag totals→stop.

**Validation.** No pump-brand UI and no imperative display.

#### Family `integrated_lab_report`

**Task.** select interval, convert units, classify result, and evaluate separately supplied review threshold.

**Response/template.** interval ID, converted values, classification, review flag.

**Derivation.** report gate sequence.

**Difficulty.** method/group matching and analyte factor.

**Distractors.** use another interval, infer diagnosis, merge critical/reference.

**Feedback.** evidence-limited report table.

**Examples.** (1) direct-unit within range. (2) converted result above reference but not critical. (3) no matching group interval→not comparable/stop.

**Validation.** Synthetic report only and no clinical conclusion.

#### Family `double_check_disagreement`

**Task.** reconcile two fictional reviewers' calculations and locate first disagreement.

**Response/template.** reviewer path, divergent factor, corrected result or stop.

**Derivation.** compare semantic calculation graphs.

**Difficulty.** equivalent formatting versus real scale/basis mismatch.

**Distractors.** average answers, choose more precise-looking result, proceed after unresolved conflict.

**Feedback.** align units/inputs node by node.

**Examples.** (1) one uses mg, one mcg without conversion. (2) one uses `/day`, other `/dose`. (3) both agree numerically but label compound mismatch means stop.

**Validation.** Disagreement fixtures have one root or explicitly unresolved case.

#### Family `case_transcription`

**Task.** copy a generated quantity/order fragment into safe-profile notation without changing semantics.

**Response/template.** structured fields and canonical display.

**Derivation.** parse source, validate semantic equality, format safely.

**Difficulty.** multiple quantities, leading/trailing zeros, compound unit.

**Distractors.** semantic decimal shift, unit omission, unsafe abbreviation retained.

**Feedback.** diff source/normalized representation and risk.

**Examples.** (1) `.25 mg→0.25 mg`. (2) `5.0 U→5 Unit`. (3) `50 mcg/min` must not become `50 mg/min`.

**Validation.** No copyable output resembles a real prescription; persistent simulation watermark.

#### Family `integrated_case_audit`

**Task.** identify the first/root defect in a generated case, oracle, rendering, review state, or safety boundary.

**Response/template.** layer, defect, reason, safe disposition.

**Derivation.** replay data lineage, gate pipeline, dual oracles, and UI policy.

**Difficulty.** downstream arithmetic remains internally consistent after wrong source.

**Distractors.** consequences rather than root, stylistic formatting.

**Feedback.** identify exact source and why production must reject/stop.

**Examples.** (1) displayed concentration differs from semantic label. (2) both oracles share the same conversion helper and miss a 1000× mutation. (3) arbitrary user values were enabled, turning practice into a clinical calculator.

**Validation.** Exactly one root fixture and deterministic evidence.

## 12. Topic-level progression

### Level 1 — Unit identity and direct relationships

- mass, volume, and time conversions;
- dimensional cancellation with one factor;
- amount/concentration/volume triangle;
- simple inclusive intervals;
- explicit leading/trailing-zero correction;
- all synthetic fields labeled and irrelevant data absent.

### Level 2 — Complete order/label arithmetic

- solid counts and liquid volumes;
- daily versus per-dose quantities;
- metric conversions inside one calculation;
- direct weight-normalized amounts;
- volume/rate/time;
- exact reference interval and unit selection;
- reverse check shown as scaffold.

### Level 3 — Constraints and multiple stages

- form divisibility and measuring increments;
- maxima and normalized ranges;
- BSA formula;
- percentage/ratio strength;
- reconstitution and single dilution;
- mass/time to volume/time;
- laboratory unit conversion and critical/reference distinction;
- deliberate missing-data stop cases.

### Level 4 — Compound rates and robust report reasoning

- mcg/kg/min chains;
- serial dilution and mixtures;
- drop-factor arithmetic;
- multi-segment rates;
- analyte-specific lab factors;
- uncertainty overlap and delta rules;
- independent path comparison;
- near-boundary rounding without premature truncation.

### Level 5 — Integrated verification

- complete gate pipelines;
- multi-constraint normalized liquid cases;
- reconstitution-to-quantity and infusion chains;
- report metadata selection plus conversion/classification;
- two-reviewer disagreement;
- generator/oracle/rendering safety audits;
- stop conditions that override plausible arithmetic.

No level introduces real products, protocols, or clinical judgment.

## 13. Adaptive practice guidance

Track mastery separately by:

```text
quantity dimension
unit/prefix
conversion direction
numerator/denominator/time basis
order/label field
daily/per-dose/per-time distinction
form/count/volume relationship
normalization basis
cap/range/increment rule
concentration model
rate model
laboratory metadata/unit/threshold rule
rounding stage
reverse-check method
stop reason
misconception
```

Adaptive responses:

- A `mg↔mcg` scale error triggers pure prefix contrasts before another integrated case.
- A `/min↔/h` error triggers units-only rate conversion.
- A daily/per-dose error triggers semantic parsing without arithmetic.
- A concentration inversion triggers amount-volume-concentration triangles.
- Premature rounding triggers paired exact-versus-rounded paths.
- A guessed missing value triggers several stop-condition cases and reinforces that stopping is a correct outcome.
- A wrong laboratory interval triggers metadata matching before numeric comparison.
- Diagnostic language in a reflection answer receives a boundary reminder, not a disease explanation.
- Failure in an integrated case is decomposed to the earliest gate; the scheduler does not merely lower all numbers.

Mastery cannot remove the persistent simulation banner or unlock real-data entry.

## 14. Answer checking and worked feedback

### Exact quantity checking

- Parse quantity and unit separately.
- Convert to canonical exact rational units where all inputs are decimal/rational.
- Preserve semantic tags such as per-dose, per-day, body mass, compound, analyte, form, and administration set.
- Reject dimensionally incompatible answers even when numeric text matches.
- Apply tolerance only after the specified final-rounding model.

### Stop-condition checking

Stop answers are structured:

```text
{
  outcome: "STOP_REVIEW_REQUIRED",
  reasonCodes: [...]
}
```

If several reasons exist and the family requests all, order does not matter. If it requests the first blocking reason, use the displayed validation priority.

### Distractor diagnosis

The checker should recognize:

- reciprocal/inversion result;
- ×10, ×60, ×100, ×1000, and combinations;
- omitted body mass;
- body mass applied twice;
- daily/per-dose confusion;
- concentration denominator dropped;
- final-volume/diluent-volume substitution;
- simple versus volume-weighted concentration average;
- wrong lab interval;
- wrong/unitless threshold comparison;
- intermediate-rounding result;
- safe numeric value with unsafe notation.

### Worked feedback

For numeric cases:

1. restate requested quantity and unit;
2. list every source value and synthetic source ID;
3. show a units-only setup;
4. show exact arithmetic;
5. apply supplied cap/range/increment;
6. reverse-check independently;
7. state `training result` or stop reason;
8. repeat “not for patient care” without adding clinical advice.

For lab cases, feedback ends at the report classification and evidence boundary.

## 15. Rendering, interaction, localization, and accessibility

### Rendering and interaction

- Every case card carries a high-contrast `FICTIONAL TRAINING CASE` badge.
- The persistent safety banner cannot be dismissed.
- Synthetic labels and reports use a clearly fictional visual system and must not imitate a real manufacturer, hospital, laboratory, EHR, prescription, or pump.
- Units never wrap away from their values; a nonbreaking space may be used.
- Fractions, solidus grouping, superscripts, and negative exponents have accessible plain-text alternatives.
- Body mass, ordered amount, concentration, time, and target unit use distinct labels, not color alone.
- The learner may rearrange factor cards, but can also enter an ordered sequence by keyboard.
- No “copy order,” “send,” “administer,” “program,” “print prescription,” or external-sharing action exists.
- Exported learning history contains family IDs and scores, not synthetic case text that could be mistaken for an order.

### Accessibility

- Correct/incorrect/stop states use icon, heading, text, and programmatic status—not green/red alone.
- Tables have semantic headers and captions.
- Factor cancellation has a linear screen-reader explanation.
- Timed performance is optional and never blocks progression.
- Large text/zoom/reflow preserve unit associations and safety labels.
- Drag interactions have button/keyboard alternatives.
- Decimal punctuation, minus signs, micro notation, and similar glyphs use clear typography.
- Screen-reader labels say “fictional training quantity” where context could be mistaken.

### Localization

Localized:

- instructional prose and feedback;
- decimal separators;
- time display conventions;
- full-word safe-notation mappings where a jurisdictional profile has been formally reviewed.

Invariant:

- canonical dimensions and unit scale;
- synthetic IDs;
- exact answers;
- safety banner meaning;
- no-real-data boundary.

A locale/jurisdiction must not be enabled for medication-notation content until appropriately credentialed reviewers approve its abbreviations, unit display, decimal conventions, and safety wording. A translation alone is insufficient.

## 16. Generator and implementation architecture

Recommended modules:

```text
seededRng
rationalArithmetic
highPrecisionDecimal
unitRegistry
dimensionAlgebra
quantityParser
syntheticProtocolStore
syntheticLabelStore
orderLabelValidator
concentrationSolver
normalizedQuantitySolver
infusionSolver
timelineSolver
syntheticLabStore
labComparisonSolver
roundingEngine
stopConditionEngine
primaryOracle
independentOracle
misconceptionOracle
questionGenerators
renderers
answerChecker
reviewManifestVerifier
localeCatalog
```

### Data lineage

Every displayed number records:

```text
sourceType
sourceId
canonicalQuantity
displayQuantity
reportedPrecision
syntheticFlag: true
```

The generator constructs compatible semantic data, the primary oracle solves it, an independent oracle verifies it, the constraint/stop engine evaluates it, and only then may rendering occur.

### No shared-failure dual check

The two oracles must not simply call the same conversion/concentration helper. At least:

- one uses exact dimensional factor chaining;
- the other uses independently coded canonical-unit formulas and reverse invariants.

Mutation tests must prove that ×10, ×60, ×1000, denominator inversion, daily/dose swap, final/diluent-volume swap, and wrong-interval selection are caught.

### Standalone architecture

- HTML/JS/CSS only, no backend required.
- No network, medication database, laboratory database, telemetry containing case answers, or external API.
- All data assets are bundled, fictional, versioned, and review-manifested.
- Service-worker/offline cache must not preserve obsolete reviewed content after a safety withdrawal.
- Local progress stores skill metadata only by default.

## 17. Mandatory clinical-content review and release governance

This section is a release gate, not a recommendation.

### Required human reviewers

Before any public or learner release, the complete profile must receive documented approval from:

1. an appropriately credentialed medication-safety pharmacist or equivalent professional for the intended jurisdiction;
2. an appropriately credentialed nurse/medical educator experienced in dosage-calculation education;
3. an appropriately credentialed clinical laboratory scientist, clinical chemist, or pathologist for laboratory-reference content;
4. a human-factors/patient-safety reviewer;
5. an accessibility and localization reviewer.

At least two reviewers must independently recalculate every golden integrated case. No reviewer may approve solely from generated summaries. AI generation or review is never a substitute for these sign-offs.

### Review manifest

```text
ReviewManifest {
  profileVersion
  sourceVersions
  reviewedFamilyIds
  reviewedSyntheticDataIds
  goldenCaseHashes
  reviewerRoles
  approvalDates
  jurisdictionLocale
  knownLimitations
  expiryOrReviewByDate
  withdrawalState
}
```

The production build fails closed if:

- the manifest is absent, expired, withdrawn, or mismatched;
- a family/data/version lacks approval;
- golden-case hashes differ;
- locale-specific safety text lacks review;
- a forbidden real product/analyte/protocol token is detected.

### Change control

Any change to formulas, unit aliases, notation rules, synthetic protocols, labels, lab profiles, rounding, stop priorities, generated ranges, translations, or safety UI requires:

- change record;
- automated regression/mutation tests;
- targeted qualified review;
- new manifest version;
- retained prior fixtures for saved-question reproducibility.

Pure typography changes still require a check that decimal points, units, subscripts, and warning labels remain unambiguous.

### Incident and withdrawal readiness

The app must expose a non-clinical issue-report path. A credible safety issue can:

- disable a family/profile through a signed local update;
- mark affected versions withdrawn;
- prevent cached withdrawn content from loading;
- identify affected question seeds without storing user case data.

The app must never tell a reporter how to manage a patient situation; it directs clinical concerns to local qualified professionals and emergency systems as appropriate to the user's real context.

## 18. Automated validation

### Arithmetic and dimension tests

- Exhaust every supported prefix pair with representative values.
- Property-test round trips for mass, volume, time, and compound rates.
- Verify dimensional equality independently before numeric comparison.
- Test activity/analyte/form IDs cannot cancel across identities.
- Test mmol/mEq fixtures for monovalent, multivalent, and missing-charge cases.
- Use exact rationals for finite-decimal inputs. Irrational results use the pinned
  arbitrary-precision implementation and must carry a proved error bound below the
  applicable rounding boundary; binary64 may be tested as a deliberately weaker
  secondary path but must not be the grading oracle.

### Order, label, and protocol tests

- Rendered order/label round-trips to semantic data.
- Total amount equals concentration × total volume.
- Per-dose × count equals daily total when modeled.
- Cap/range comparisons use identical semantic basis.
- Form divisions and measurement increments are enforced.
- Every mandatory stop condition has positive and negative fixtures.
- Forbidden real-name dictionaries and recognizable-protocol review sets are checked by humans as well as tooling.

### Concentration and infusion tests

- Reconstitution always uses tagged final volume.
- Dilution conserves amount.
- Mixture totals conserve amount and volume under model.
- Volume/rate/time triangle round-trips.
- Normalized infusion paths reproduce mass rate from final volume rate.
- Drop-rate fixtures cover hour/minute conversion and every rounding mode.
- Mutations for reciprocal, 60, and 1000 factors fail.

### Laboratory tests

- Interval selector returns exactly one row or a stop.
- Result and interval unit conversions are monotone and consistent.
- Reference, decision, and critical predicates remain separate.
- Boundary equality tests cover open/closed endpoints.
- Uncertainty intervals cover inside/outside/overlap.
- Different incompatible lab profiles cannot be trended.
- Feedback contains no disease, treatment, urgency, or “normal means healthy” claims.

### Rounding and notation tests

- Every family states a rounding policy or exact answer.
- No intermediate display value feeds the oracle.
- Increment results lie on allowed lattice.
- Post-round bounds are rechecked.
- Medication display always adds leading zeros and removes trailing zeros.
- Laboratory precision may preserve reviewed trailing zeros.
- Unsafe abbreviations cannot appear in generated safe text.

### UI and boundary tests

- Safety banner visible at 100–400% zoom, print, review, and offline.
- No arbitrary real-value calculation route exists in DOM, query parameters, storage import, or API.
- No clinical-action verbs appear in answer summaries.
- Synthetic case labels cannot be confused with a real prescription/report template.
- Accessibility alternatives preserve complete units and warnings.
- Every integrated numeric result displays an independent check.

### Seed and mutation tests

For at least 25,000 seeds per numeric family and all bounded states:

- no non-finite values or division by zero;
- all placeholders filled;
- expected dimensions correct;
- distractors distinct and misconception-derived;
- all stop dependencies correctly classified;
- both oracles agree;
- reverse invariants pass;
- displayed rounding matches profile;
- no case matches a prohibited/recognizable real protocol fixture;
- audit family has exactly one intended root defect.

## 19. Coverage requirements

Minimum release coverage:

- every mass/volume/time prefix direction appears;
- compound rates include numerator-only, denominator-only, and both conversions;
- activity and equivalent conversions include permitted and stop cases;
- order parsing covers dose, daily, normalized, interval, cap, and incomplete forms;
- notation covers leading zero, trailing zero, Unit, International Unit, daily/every-other-day, `mL`, and `mcg`;
- solid/liquid calculations cover integer, allowed fraction, prohibited fraction, measurable, and unmeasurable outcomes;
- normalized quantities cover per-dose, per-day, per-time, BSA, range, cap, and reverse forms;
- concentrations cover mass/volume, every percentage basis, ratio interpretation, reconstitution, dilution, serial dilution, and mixtures;
- rates cover all three volume-rate triangle directions, mass rate, normalized rate, bag totals, drop factor, segments, and remaining time;
- fluid/schedule families cover positive/negative/zero balance and exact/indeterminate timing;
- labs cover interval selection, units, analyte factors, boundaries, critical/reference distinction, qualitative result, deltas, uncertainty, and noncomparability;
- rounding/verification includes every rounding mode, premature-rounding contrast, magnitude, reverse check, independent paths, measurability, and stop;
- integrated families regularly produce valid numeric and correct stop outcomes.

Recent-history constraints prevent:

- repeated powers-of-ten-only easy conversions;
- concentration labels always using `/1 mL`;
- integer-only volumes/counts;
- every correct outcome being a numeric answer rather than a stop;
- every lab result being outside range;
- every critical case being high rather than low;
- one rounding increment dominating;
- all errors being 1000×;
- integrated cases overwhelming foundational practice.

## 20. Recommended views and v1 priorities

### Views

1. **Safety and scope** — non-dismissible explanation and source/profile versions.
2. **Units** — prefix, dimensions, and factor-chain practice.
3. **Orders and labels** — synthetic parsing, completeness, and notation.
4. **Dosage arithmetic** — fixed, normalized, concentration, and rate categories.
5. **Laboratory reports** — report-specific interval/unit reasoning only.
6. **Verification** — estimation, rounding, reverse check, and stop cases.
7. **Mixed review** — gated integrated cases after prerequisites.
8. **Review record** — content-review manifest and limitations visible to educators.

### Recommended v1

Ship only after the mandatory review gate, beginning with:

- SI mass/volume/time units and dimensional chains;
- safe decimal/unit notation;
- complete synthetic fixed solid/liquid calculations;
- simple `mg/kg/dose` and `mg/kg/day` distinctions with supplied caps;
- mass/volume concentration and final-volume reconstitution;
- volume/rate/time and one mass-rate conversion;
- report-specific interval classification and metric-unit conversion;
- final-only rounding, magnitude estimation, reverse checks, and missing-data stops.

Defer:

- BSA if review resources are limited;
- weight-normalized infusion and drop-rate families until foundational release has independent evaluation;
- analyte-specific factor and uncertainty families until laboratory reviewer approval;
- all other material named in Exclusions permanently unless a new separately governed profile is created.

## 21. Topic-level quality and release checklist

Before any release, confirm:

- [ ] Every screen says `SIMULATION ONLY — FICTIONAL DATA — NOT FOR PATIENT CARE`.
- [ ] There is no real-data/free-calculator/import/API mode.
- [ ] Every medication, product, protocol, analyte, lab, range, result, and subject is synthetic.
- [ ] No real dose, range, critical value, treatment, diagnosis, or clinical recommendation is bundled.
- [ ] Unit dimensions include compound/analyte/form identity where required.
- [ ] Daily, per-dose, per-time, per-kg, and per-m² semantics cannot be silently interchanged.
- [ ] Missing or incompatible data produce a structured stop.
- [ ] Medication notation uses leading zeros, no trailing zeros, and reviewed safe abbreviations.
- [ ] Every question supplies its rounding and measurement rule.
- [ ] Intermediate values are not rounded into the oracle.
- [ ] Every numeric medication-style answer has independent computation and reverse validation.
- [ ] Laboratory comparison uses the interval and units on the same compatible synthetic report.
- [ ] Reference, decision, and critical thresholds remain distinct.
- [ ] Lab feedback never equates in-range with health or out-of-range with disease.
- [ ] Every family has misconception-derived distractors, three examples, and deterministic validation.
- [ ] Mutation tests catch reciprocal, ×10, ×60, ×1000, basis, denominator, and interval-selection errors.
- [ ] Required credentialed reviewers have independently approved every enabled family/data/locale.
- [ ] The signed review manifest matches the production build and has not expired or been withdrawn.
- [ ] Cached withdrawn content fails closed.
- [ ] Accessibility review confirms decimal points, units, warning text, and factor chains remain unambiguous.
- [ ] The app never describes an arithmetic result as safe, appropriate, therapeutic, or ready to use.
