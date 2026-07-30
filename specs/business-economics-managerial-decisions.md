# Business Economics & Managerial Decisions — Dynamic Practice Specification

Status: implementation specification; fictional organizations and decisions
only, **not business, accounting, pricing, employment, legal, or investment advice**

Audience: scenario generator, managerial-costing and decision engine, semantic
answer checker, table/chart renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Business Economics & Managerial Decisions

### Topic goal

Develop fluent, explicit reasoning about how revenues, costs, capacity,
uncertainty, and time affect fictional managerial choices. The learner should
become able to:

- classify costs by behavior, traceability, avoidability, and decision relevance;
- construct and interpret cost functions within a stated relevant range;
- calculate contribution margins, break-even points, target volumes, margin of
  safety, and operating leverage;
- distinguish accounting profit from incremental future cash-flow differences;
- identify sunk, committed, avoidable, incremental, and opportunity costs;
- analyze special orders, make-or-buy, product/segment continuation,
  replacement, and further-processing choices;
- rank products by contribution per scarce resource and allocate bounded
  capacity subject to demand and operational constraints;
- read demand schedules and calculate price, quantity, revenue, contribution,
  profit, and elasticity under supplied models;
- compare prices without treating cost-plus output as a market fact;
- construct sales, production, materials, labor, and cash budgets;
- flex a budget to actual activity and diagnose price, quantity, rate, and
  efficiency variances;
- evaluate bounded projects using relevant cash flows, payback, and net present
  value under supplied assumptions;
- use payoff tables, expected value, regret, decision trees, and sensitivity
  thresholds without confusing model probabilities with facts;
- compare divisional performance measures while recognizing controllability,
  allocation, and incentive effects;
- retain nonfinancial, legal, ethical, safety, employee, customer, environmental,
  resilience, and strategic constraints rather than forcing every consideration
  into money;
- explain when a recommendation changes with assumptions or cannot be determined.

Repeated practice should improve decision-model construction and auditability,
not merely formula recall or short-term profit maximization.

### Relationship to neighboring Practice Lab topics

- **Accounting & Bookkeeping** owns transaction recognition, journal entries,
  ledgers, and external-statement preparation.
- **Investment Literacy & Company Analysis** owns analysis of completed company
  disclosures, capital structure, per-share measures, and market valuation.
- **Everyday Economics** owns consumer pricing, percent changes, interest,
  inflation, subscriptions, and elementary expected value.
- **Probability & Statistics** owns probability models, distributions, inference,
  and Bayes' theorem.
- **Spreadsheet Practice** owns spreadsheet formulas, references, and tool use.
- **Data Literacy & Chart Reading** owns general visual-claim interpretation.

This app owns internal cost/revenue models, operating decisions, budgeting,
variance diagnosis, resource allocation, and bounded decision analysis.

### Audience and prerequisites

The audience includes adult learners, business students, founders, engineers,
and managers who want quantitative fluency without assuming an accounting
specialism.

Prerequisites:

- signed decimal, percentage, ratio, and simple algebra;
- reading small tables, graphs, and timelines;
- basic revenue, expense, asset, liability, and cash concepts;
- elementary probability for the uncertainty category.

Learn mode introduces every cost and decision convention. No real business data,
spreadsheet, calculator service, or accounting software is required.

### Professional sources and terminology boundary

The scope is informed by:

- [IFAC's Global Management Accounting
  Principles](https://www.ifac.org/content/global-management-accounting-principles),
  which frame management accounting as supporting decisions, risk response, and
  value creation;
- IFAC's discussion of [costing for management
  decisions](https://www.ifac.org/news-events/2009-07/new-ifac-publication-explains-how-better-costing-can-result-better-management-decision-making),
  which distinguishes external-reporting cost information from information
  designed for internal decision support;
- ACCA's guidance on [relevant
  costs](https://www.accaglobal.com/ca/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/relevant-costs.html),
  which focuses on future cash-flow changes caused by the decision;
- ACCA's [cost-volume-profit
  guidance](https://www.accaglobal.com/ubcs/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/CVP-analysis.html),
  including contribution, break-even, target profit, margin of safety, sales
  mix, and model limitations;
- the [IMA Management Accounting Competency
  Framework](https://prodcm.imanet.org/-/media/IMA/Files/Home/Career-Resources/Competency-Framework/Competency-Framework-White-Paper.ashx),
  which includes decision analysis and strategic/tactical planning.

These sources guide educational coverage; the app does not certify professional
competence or implement a complete management-accounting framework.

Initial fictional profiles:

```text
pl-managerial-costs-v1
pl-cvp-v1
pl-relevant-decisions-v1
pl-capacity-v1
pl-pricing-demand-v1
pl-operating-budget-v1
pl-standard-variance-v1
pl-capital-decision-v1
pl-managerial-performance-v1
```

### Legal, ethical, and professional boundary

Every exercise/export states:

```text
FICTIONAL MANAGERIAL-DECISION EXERCISE — NOT BUSINESS, ACCOUNTING,
PRICING, EMPLOYMENT, LEGAL, SAFETY, OR INVESTMENT ADVICE
```

The app must not:

- ingest a real organization's costs, demand, workforce, customers, bids, or
  competitors in v1;
- recommend a real price, wage, staffing level, closure, outsourcing arrangement,
  supplier, investment, or product decision;
- model coordination with competitors about prices, bids, customers, output,
  capacity, terms, wages, or territories;
- suggest that price fixing, bid rigging, market allocation, or output restriction
  is an acceptable managerial option;
- diagnose antitrust compliance, predatory pricing, discrimination, employment
  legality, tax treatment, or contract enforceability;
- monetize injury, safety, accessibility, human rights, employee welfare,
  privacy, environmental damage, or legal compliance to make it tradeable
  against profit;
- hide layoffs, safety reduction, unpaid labor, deceptive marketing, illegal
  disposal, or customer harm inside a favorable cost variance;
- treat expected monetary value as the only legitimate objective;
- imply that a model optimum remains optimal outside its assumptions;
- replace qualified accounting, legal, operations, engineering, workforce, or
  stakeholder review.

Pricing cases always depict one fictional firm choosing independently from a
supplied demand model. The [FTC's price-fixing
guidance](https://www.ftc.gov/advice-guidance/competition-guidance/guide-antitrust-laws/dealings-competitors/price-fixing)
notes that firms generally must establish prices and competitive terms
independently rather than agreeing with competitors. Jurisdiction-specific
competition law remains outside the app.

### Controlled decision model

```text
ManagerialDecisionCase {
  caseId
  organizationProfileId
  decisionDate
  horizon
  currencyAndScale
  products[]
  services[]
  resources[]
  activities[]
  costItems[]
  revenueDrivers[]
  demandModels[]
  capacities[]
  budgets[]
  standards[]
  actuals[]
  alternatives[]
  projectCashFlows[]
  uncertaintyModels[]
  responsibilityCenters[]
  constraints[]
  qualitativeFactors[]
  assumptions[]
  evaluations[]
  provenance[]
}
```

All scenarios are fictional and deliberately small. Stable IDs connect source
facts, calculations, constraints, assumptions, choices, and feedback.

### Decision layers

Keep these layers distinct:

```text
Observed/supplied facts
  historical costs, current capacity, contracts, actual volumes

Classification/model choices
  cost behavior, allocation rule, demand function, probability model

Decision-relative consequences
  future differential cash flows, opportunity costs, constraints

Evaluation rule
  contribution, profit, NPV, expected value, regret, KPI set

Qualified conclusion
  selected alternative, sensitivity, missing information, nonfinancial limits
```

A cost can be fixed for behavior analysis yet avoidable for one decision. An
allocated cost can be valid for reporting but irrelevant to a short-term choice.
Feedback must name the layer and decision horizon.

### Normative quantitative model

#### Exact values, time, units, and rounding

- Semantic money, rates, quantities, resource units, and probabilities use exact
  decimal or rational arithmetic.
- Every value declares currency/scale, time basis, physical unit, and whether it
  is per unit, batch, period, activity, or total.
- Probabilities are exact and sum to 1 within a complete chance node.
- Discount rates and cash-flow dates are explicit.
- Intermediate values remain exact; round only the requested displayed result.
- Integer units use ceiling only where indivisible sales/production and the prompt
  explicitly requests the minimum whole number.
- Favorable/unfavorable variance labels are derived after signed arithmetic and
  never replace the amount.

#### Cost behavior profile

Within the explicitly displayed relevant range:

```text
totalVariableCost = variableCostPerUnit * activity
totalFixedCost = fixedCost
totalMixedCost = fixedComponent + variableRate * activity
stepCost = sum(stepCapacityBlocksRequired * costPerBlock)
totalCost = sum(all applicable cost components)
unitAverageCost = totalCost / units
```

Fixed total cost is fixed only within the named range and period; fixed cost per
unit changes with activity. Variable cost per unit is constant only within the
model. Mixed-cost estimation families treat the fitted function as an estimate,
not a discovered physical law.

#### Contribution and CVP profile

```text
unitContribution = sellingPrice - unitVariableCost
totalContribution = revenue - totalVariableCost
contributionMarginRatio = contribution / revenue
profit = totalContribution - avoidableAndCommittedFixedCostsInModel
breakEvenUnits = fixedCosts / unitContribution
targetUnits = (fixedCosts + targetProfit) / unitContribution
breakEvenRevenue = fixedCosts / contributionMarginRatio
marginOfSafety = plannedSales - breakEvenSales
degreeOfOperatingLeverage = contribution / profit
```

CVP families require positive contribution for a finite break-even answer and
state constant price, unit variable cost, fixed cost, capacity, and sales-mix
assumptions. Whole-unit requirements round up only after solving exactly.

#### Relevant-cost profile

A numeric item is relevant to a decision when it is:

```text
future
different between feasible alternatives
caused by or avoidable through the decision
```

Relevant benefits include incremental revenue, avoided cost, disposal value,
released capacity value, and opportunity contribution. Sunk costs are excluded.
Committed costs are excluded unless the decision changes them. Allocated fixed
cost is included only to the extent a supplied avoidable future cash flow changes.

#### Demand and pricing profile

Permitted demand models are:

```text
explicit price-quantity schedule
Q(P) = a - bP
P(Q) = a - bQ
```

within a declared integer or decimal domain. The generator enforces nonnegative
price and quantity and never extrapolates beyond the shown range.

```text
revenue(P) = P * Q(P)
profit(P) = (P - unitVariableCost) * Q(P) - fixedCost
arcElasticity = ((Q2-Q1)/average(Q1,Q2))
                / ((P2-P1)/average(P1,P2))
```

Price optimization in v1 enumerates displayed feasible prices/quantities. It
does not estimate real demand or use competitor coordination.

#### Budget and variance profile

```text
productionUnits = salesUnits + desiredEndingFinishedGoods
                  - openingFinishedGoods

materialPurchases = materialForProduction + desiredEndingMaterial
                    - openingMaterial

flexBudget = fixedBudget + actualActivity * variableRate

materialPriceVariance = actualQuantity * (actualPrice - standardPrice)
materialUsageVariance = standardPrice * (actualQuantity - standardQuantity)
laborRateVariance = actualHours * (actualRate - standardRate)
laborEfficiencyVariance = standardRate * (actualHours - standardHours)
```

The canonical signed convention is `actual minus standard`: positive cost
variance is unfavorable and negative is favorable. Revenue variances use a
separate displayed convention. Standards, allowed quantity/hours, and causal
claims are never inferred.

#### Capital and uncertainty profile

```text
NPV = sum(cashFlow[t] / (1 + discountRate)^t)
expectedValue = sum(probability[i] * payoff[i])
regret(state, action) = bestPayoffInState - payoff(state, action)
EVPI = expectedValueWithPerfectInformation
       - bestExpectedValueWithoutPerfectInformation
```

NPV uses exact dated period-end cash flows unless another timing is displayed.
The discount rate is supplied, not estimated. Probabilities are model inputs,
not app predictions.

### Scope

Included:

- fixed, variable, mixed, step, direct, indirect, avoidable, committed, sunk,
  incremental, and opportunity cost;
- cost equations, relevant ranges, high-low estimation, and cost-model audits;
- contribution, break-even, target profit, margin of safety, operating leverage,
  multiproduct mix, and CVP graphs;
- special orders, make-or-buy, discontinue/retain, sell/process further,
  replace/keep, and capacity-use decisions;
- limiting factors, contribution per constraint, demand caps, bounded resource
  allocation, and bottleneck-relief value;
- demand schedules/functions, elasticity, price-volume-profit tables, markup,
  target costing, discounts, and discrete price selection;
- sales, production, materials, labor, overhead, collections, payments, cash,
  and flexible budgets;
- materials, labor, overhead, sales, planning/operational, and responsibility
  variances under explicit profiles;
- relevant project cash flows, payback, NPV, project comparison, payoff tables,
  expected value, regret, decision trees, EVPI, and sensitivity;
- segment contribution, controllable profit, ROI, residual income, transfer
  pricing ranges, multi-KPI tradeoffs, and integrated audits.

### Exclusions

Excluded:

- real pricing, competitor data, bids, wages, staffing, closures, sourcing, or
  investment decisions;
- antitrust, consumer-protection, labor, tax, contract, environmental, safety,
  accessibility, or sector regulation;
- general-equilibrium economics, macroeconomics, game-theoretic collusion, and
  auction/bid strategy;
- econometric demand estimation, causal inference, survey design, and live A/B
  testing;
- nonlinear continuous optimization, calculus-based monopoly pricing, integer
  programming beyond bounded enumeration, simulation, and stochastic processes;
- full absorption-cost inventory reporting, tax depreciation, working-capital
  valuation, WACC estimation, terminal values, and real-options valuation;
- complex activity-based costing, lifecycle costing, quality costing, transfer-
  pricing tax rules, and multinational tax;
- open-ended ethical scoring or AI-generated management recommendations.

### Global answer conventions

- Ignore surrounding whitespace.
- Numeric answers accept localized separators and displayed units/scales.
- Percent answers accept `12.5` or `12.5%` as 12.5 percentage points.
- Money per unit, resource per unit, total money, counts, periods, and probability
  answers are different semantic types.
- Favorable/unfavorable may be entered as `F`/`U` only when the UI explicitly
  offers that localized convention; signed amount remains canonical.
- Multiple selections and sequences compare stable IDs, not labels.
- Equivalent formulas are accepted after typed AST normalization.
- `Undefined`, `infeasible`, `not comparable`, and `cannot determine` are distinct.
- A recommendation response is a structured choice among fictional alternatives
  plus its criterion; free-form business advice is not scored.

### Difficulty philosophy

Difficulty increases through:

- changing classification by decision, horizon, or relevant range;
- moving between per-unit, batch, period, resource, and total quantities;
- solving inverse contribution and break-even relationships;
- separating allocated from avoidable and sunk from opportunity cost;
- coordinating demand, capacity, mix, and nonfinancial constraints;
- flexing budgets before comparing actual results;
- decomposing a total variance into price/rate and quantity/efficiency effects;
- adding timing, probabilities, sequential decisions, and sensitivity;
- comparing measures with different controllability/incentive properties;
- identifying a root model error or missing assumption.

Difficulty must not increase through long stories, huge tables, implausible
decimal noise, hidden units, arbitrary terminology, unrealistic probabilities,
manual enumeration beyond a small bounded set, or time pressure.

### Shared generation and rejection rules

Every instance must:

- declare organization/profile, decision, horizon, units, constraints, formula/
  evaluation rule, rounding, and nonfinancial hard constraints;
- derive all costs, revenues, budgets, alternatives, and feedback from one model;
- retain source and assumption provenance;
- have a primary and independent exact oracle;
- provide all facts needed for a unique answer unless insufficiency is the task;
- accept all tied/equivalent optimal choices;
- generate distractors from named misconceptions.

Reject an instance when:

- units, time bases, or decision alternatives are incompatible;
- a cost's behavior/relevance depends on an unstated horizon or range;
- CVP has nonpositive contribution but expects a finite break-even point;
- multiproduct break-even hides the sales mix;
- a relevant-cost decision silently uses unavoidable allocated cost;
- capacity allocation has an unaccepted tie or infeasible hidden constraint;
- a demand model yields negative price/quantity or requires extrapolation;
- rounded displays change the optimal choice;
- probabilities do not sum exactly or a chance branch is missing;
- an apparently optimal alternative violates a hard qualitative constraint;
- the prompt implies real legal, ethical, safety, workforce, or pricing advice;
- an audit contains multiple roots unless explicitly multi-select;
- a recent structural signature repeats with only labels/numbers changed.

## 2. Category: Cost concepts, behavior, traceability, and estimation

### Category purpose

Train the learner to classify and model a cost for a stated purpose rather than
assuming each cost has one permanent label.

### Learn

Cost behavior asks how total cost changes with activity. Traceability asks
whether a cost can be economically traced to a cost object. Decision relevance
asks whether a future amount differs between alternatives. These axes are
independent.

### Prerequisites

Linear arithmetic and reading tables.

### Category boundaries

No journal entries or external inventory valuation. Allocation mechanics appear
later only when they affect a decision or performance measure.

### Common misconceptions

- Fixed means never changes under any circumstance.
- Variable total cost and variable cost per unit both increase with activity.
- Direct means variable and indirect means fixed.
- Historical cost is relevant because it is known precisely.
- Allocated cost disappears when a product is discontinued.
- A two-point high-low fit proves the true causal cost function.

### Family `cost_behavior_classify`

**Task/purpose.** Classify a supplied cost pattern as fixed, variable, mixed,
step, or insufficient under a stated range. **Response/template.** Single choice
plus evidence row. **Derivation.** Compare total/per-unit behavior against the
profile functions. **Difficulty.** L1 ideal patterns; L2 table with scale; L3
range change/ambiguous points. **Distractors/constraints.** Direct/indirect
labels and one-row guesses; at least two informative activity levels.
**Feedback.** Show total and per-unit patterns. **Examples.** total 100 at all
levels→fixed (L1); 3 per unit→variable (L1); jumps each 10 units→step (L3).
**Validation.** Function-class oracle.

### Family `cost_total_unit_transform`

**Task/purpose.** Convert between total and per-unit cost at a stated activity.
**Response/template.** Money/unit and total fields. **Derivation.** Evaluate the
active cost function then divide/multiply by activity. **Difficulty.** L1
variable; L2 fixed average; L3 mixed/step. **Distractors/constraints.** Hold
fixed cost per unit constant, double-count activity. **Feedback.** Total-versus-
unit table. **Examples.** 4×20=80 variable total (L1); fixed 100/20=5 per unit
(L2); mixed cost (L3). **Validation.** Round-trip invariant.

### Family `cost_equation_evaluate`

**Task/purpose.** Evaluate or invert `Y=a+bX` within the relevant range.
**Response/template.** Money/activity field. **Derivation.** Exact linear
substitution or algebraic inversion. **Difficulty.** L1 forward; L2 solve `X`;
L3 compare two functions/intersection. **Distractors/constraints.** Apply fixed
component per unit, accept outside range. **Feedback.** Annotate units of `a`,
`b`, and `X`. **Examples.** 100+3×20=160 (L1); solve cost 250→X=50 (L2);
cost-function crossover (L3). **Validation.** Substitute answer and range-check.

### Family `high_low_estimate`

**Task/purpose.** Estimate variable rate and fixed component from highest/lowest
activity observations. **Response/template.** Two named fields/equation.
**Derivation.** `b=(costHigh-costLow)/(activityHigh-activityLow)` then
`a=cost-bX`. **Difficulty.** L2 endpoints given; L3 choose by activity not cost;
L4 identify outlier/model limitation. **Distractors/constraints.** Highest cost
instead of activity, use averages, zero activity spread. **Feedback.** Two-point
slope and intercept. **Examples.** (220−140)/(40−20)=4, fixed 60 (L2);
nonaligned cost ranking (L3); fit valid only stated range (L4). **Validation.**
Both points lie on estimate.

### Family `relevant_range_check`

**Task/purpose.** Decide whether a cost model can be applied at a proposed
activity and select the required profile if not. **Response/template.** Valid/
invalid/profile choice. **Derivation.** Interval and step-capacity lookup.
**Difficulty.** L1 inside/outside; L2 boundary; L3 several capacity regimes.
**Distractors/constraints.** Extrapolate because equation exists, inclusive-end
errors. **Feedback.** Mark interval and model change. **Examples.** 80 within
0–100 (L1); 100 boundary per displayed convention (L2); second supervisor above
120 (L3). **Validation.** Exact interval policy.

### Family `direct_indirect_trace`

**Task/purpose.** Classify whether a cost is directly traceable to a specified
cost object at reasonable effort. **Response/template.** Direct/indirect/
insufficient plus object. **Derivation.** Resolve fact/object/profile relation.
**Difficulty.** L1 product material/factory rent; L2 department versus product;
L3 same cost under different objects. **Distractors/constraints.** Variable=
direct, physical proximity. **Feedback.** Cost→object trace graph.
**Examples.** wood to table→direct (L1); plant rent to one table→indirect (L1);
supervisor direct to department but indirect to unit (L3). **Validation.**
Traceability registry.

### Family `avoidable_committed_classify`

**Task/purpose.** Classify future fixed/variable amounts as avoidable, unavoidable,
or partly avoidable for a named decision/horizon. **Response/template.**
Classification plus amount. **Derivation.** Compare alternative cash-flow
schedules. **Difficulty.** L1 cancellable cost; L2 committed contract; L3 partial
capacity block. **Distractors/constraints.** Fixed=unavoidable, variable=avoidable
without facts. **Feedback.** Alternative difference table. **Examples.**
cancelable lease after product exit→avoidable (L1); signed annual contract→
unavoidable this year (L2); one of three shifts removed (L3). **Validation.**
Cash-flow delta.

### Family `cost_model_select`

**Task/purpose.** Select the cost representation appropriate for a stated
planning, control, product, or decision question. **Response/template.**
Model/basis choice. **Derivation.** Match purpose to required causality,
traceability, behavior, and horizon. **Difficulty.** L2 behavior versus
allocation; L3 decision-specific; L4 competing models with disclosed limitations.
**Distractors/constraints.** Most detailed/official-looking model automatically.
**Feedback.** Purpose→information need mapping. **Examples.** CVP→behavior model
(L2); make/buy→differential cash flows (L3); performance allocation not relevant
cost (L4). **Validation.** Purpose registry.

### Family `cost_behavior_audit`

**Task/purpose.** Find one root classification, unit, range, traceability, or
estimation error in a cost model. **Response/template.** Root/correction/
consequence. **Derivation.** Replay cost-function and metadata checks.
**Difficulty.** L2 total/unit; L3 range/high-low; L4 purpose mismatch.
**Distractors/constraints.** One root; downstream wrong totals are symptoms.
**Feedback.** Corrected cost table/function. **Examples.** fixed per unit held
constant (L2); high cost chosen instead of high activity (L3); allocated cost
treated as avoidable (L4). **Validation.** Fault manifest.

### Cross-family progression

Behavior classification precedes total/unit transformation and equations.
Relevant range precedes estimation extrapolation. Traceability and avoidability
are deliberately interleaved to prevent one-axis thinking.

## 3. Category: Contribution, cost-volume-profit, and break-even

### Category purpose

Train forward and inverse reasoning among price, variable cost, volume, fixed
cost, contribution, profit, and safety margin.

### Learn

Contribution is revenue minus variable cost; it first covers fixed cost and then
profit. Break-even is model-dependent and finite only with positive contribution.
Multiproduct break-even depends on the stated sales mix.

### Prerequisites

Category 2 and simple algebra.

### Category boundaries

No claim that accounting break-even captures cash timing, financing, taxes,
risk, capacity changes, or customer effects unless supplied.

### Common misconceptions

- Subtracting allocated full cost to compute contribution.
- Dividing fixed cost by price instead of unit contribution.
- Rounding a break-even unit down.
- Treating margin of safety as contribution margin.
- Applying single-product CVP to changing product mix.
- Calling operating leverage a probability of loss.

### Family `unit_total_contribution`

**Task/purpose.** Compute unit/total contribution or a missing price/variable
cost. **Response/template.** Money per unit/total fields. **Derivation.**
`P-V` and multiply by units. **Difficulty.** L1 forward; L2 inverse; L3 several
variable components/returns. **Distractors/constraints.** Subtract fixed cost per
unit, confuse total and unit. **Feedback.** Unit bridge then volume.
**Examples.** 10−6=4/unit (L1); 4×100=400 total (L1); infer price from target
contribution (L2). **Validation.** Unit/total identity.

### Family `contribution_margin_ratio`

**Task/purpose.** Calculate contribution as a fraction of sales or solve an
inverse relationship. **Response/template.** Percent/money. **Derivation.**
`contribution/revenue` or `(P-V)/P`. **Difficulty.** L1 direct; L2 inverse; L3
weighted mix. **Distractors/constraints.** Profit/revenue, markup on variable
cost. **Feedback.** State contribution per currency unit of sales.
**Examples.** (10−6)/10=40% (L1); sales 500×40%=200 contribution (L2);
weighted total ratio (L3). **Validation.** Aggregate/unit equivalence.

### Family `break_even_units`

**Task/purpose.** Calculate break-even units or a missing fixed/contribution
input. **Response/template.** Whole/decimal units. **Derivation.** `F/UCM`;
ceil only for required indivisible minimum. **Difficulty.** L1 exact; L2
round-up; L3 inverse. **Distractors/constraints.** Divide by price or full unit
cost, round normally. **Feedback.** Fixed-cost coverage table.
**Examples.** 100/4=25 units (L1); 101/4→26 whole units (L2); infer fixed cost
(L3). **Validation.** Profit below/at chosen unit boundary.

### Family `break_even_revenue`

**Task/purpose.** Calculate break-even sales revenue from the contribution ratio.
**Response/template.** Money field. **Derivation.** `F/CMR`.
**Difficulty.** L1 ratio supplied; L2 derive ratio; L3 multiproduct constant mix.
**Distractors/constraints.** Fixed cost×ratio, confuse units and revenue.
**Feedback.** Revenue→contribution→fixed-cost bridge. **Examples.** 100/40%=250
(L1); derive CMR (L2); weighted mix (L3). **Validation.** Contribution at answer
equals fixed cost.

### Family `target_profit_volume`

**Task/purpose.** Find units/revenue needed for a supplied target profit.
**Response/template.** Units/money. **Derivation.** `(F+targetProfit)/UCM` or
`/CMR`; apply indivisibility. **Difficulty.** L1 units; L2 revenue; L3 after-tax
target only with supplied simplified tax rule. **Distractors/constraints.**
Subtract target, use price denominator. **Feedback.** Required contribution
bridge. **Examples.** (100+60)/4=40 units (L1); revenue target (L2); gross-up
declared target (L3). **Validation.** Substitute into profit function.

### Family `margin_of_safety`

**Task/purpose.** Calculate margin of safety in units, revenue, or percent.
**Response/template.** Named fields. **Derivation.** Planned/actual sales minus
break-even; percent divides by planned/actual sales as named.
**Difficulty.** L1 units; L2 revenue/percent; L3 negative safety margin.
**Distractors/constraints.** Divide by break-even, confuse with CMR.
**Feedback.** Sales position on break-even line. **Examples.** 40−25=15 units
(L1); 15/40=37.5% (L2); sales below break-even→negative margin (L3).
**Validation.** Definition AST.

### Family `operating_leverage`

**Task/purpose.** Calculate degree of operating leverage and use it for a small
local percentage-change estimate/identity. **Response/template.** Multiple/
percent. **Derivation.** `contribution/profit`; under unchanged linear CVP,
profit change %=DOL×sales change %. **Difficulty.** L2 direct; L3 compare cost
structures; L4 reject use across fixed-cost step/range.
**Distractors/constraints.** Fixed/variable ratio, probability interpretation,
apply at break-even. **Feedback.** Contribution and profit gap. **Examples.**
200/50=4x (L2); 5% sales→20% profit locally (L3); invalid beyond capacity step
(L4). **Validation.** Scenario recomputation.

### Family `multiproduct_cvp_mix`

**Task/purpose.** Calculate weighted contribution and bundle break-even under a
fixed sales mix. **Response/template.** Bundle/product units. **Derivation.**
Construct one composite mix bundle, sum contribution, divide fixed cost, then
expand quantities. **Difficulty.** L2 2-product bundle; L3 revenue-mix ratio;
L4 compare mix change. **Distractors/constraints.** Average contributions
unweighted, hide mix, accept fractional indivisible bundle improperly.
**Feedback.** Bundle table. **Examples.** 2A+1B contribution 10 (L2); 100 fixed→
10 bundles (L2); altered mix changes break-even (L4). **Validation.** Bundle
profit identity.

### Family `cvp_graph_interpret`

**Task/purpose.** Read or complete revenue, total-cost, contribution, or
profit-volume graphs generated from an exact CVP model. **Response/template.**
Point/line/region selection. **Derivation.** Map exact intersections/slopes/
intercepts to model facts. **Difficulty.** L1 break-even point; L2 profit/loss
gap; L3 compare slopes/fixed intercepts. **Distractors/constraints.** Pixel
measurement not required; axes/units visible. **Feedback.** Overlay exact values.
**Examples.** line intersection=break-even (L1); vertical gap=profit (L2);
steeper revenue line from higher price (L3). **Validation.** SVG/model semantic
round-trip.

### Family `cvp_audit`

**Task/purpose.** Diagnose one contribution, break-even, mix, range, graph, or
interpretation error. **Response/template.** Root/correction/limited conclusion.
**Derivation.** Replay CVP AST and assumptions. **Difficulty.** L2 formula; L3
rounding/mix; L4 capacity/range invalidation. **Distractors/constraints.** One
root; do not claim break-even guarantees cash sufficiency. **Feedback.**
Corrected equation/graph. **Examples.** fixed cost/price (L2); break-even rounded
down (L3); constant mix silently changed (L4). **Validation.** Fault manifest.

### Cross-family progression

Contribution precedes ratios and break-even. Unit and revenue forms are learned
separately before inverse targets. Single-product CVP precedes mix and graphs.
Operating leverage appears only after profit structure is secure.

## 4. Category: Relevant costing and short-term alternatives

### Category purpose

Train comparison of future differences between feasible alternatives while
excluding sunk and unavoidable allocations and retaining qualitative constraints.

### Learn

The relevant amount is the future cash flow changed by the decision, including
opportunity cost. “Already spent,” “allocated,” and “book value” do not answer
that question by themselves.

### Prerequisites

Categories 2–3.

### Category boundaries

Decisions are bounded, fictional, short-term scenarios. No real outsourcing,
closure, employment, contract, tax, safety, or supplier advice.

### Common misconceptions

- Include sunk research or book value because it appears in the table.
- Include allocated fixed overhead that continues unchanged.
- Ignore opportunity contribution from scarce capacity.
- Accept a special order whenever price exceeds variable manufacturing cost.
- Drop a segment because its fully allocated profit is negative.
- Monetize qualitative hard constraints.

### Family `relevant_cost_classify`

**Task/purpose.** Classify each item as relevant benefit, relevant cost, sunk,
unavoidable, opportunity cost, or insufficient for one decision.
**Response/template.** Matching plus included amount. **Derivation.** Compare
future cash-flow schedules by alternative. **Difficulty.** L1 sunk/incremental;
L2 committed/avoidable; L3 partial or opportunity effect.
**Distractors/constraints.** Accounting label alone; horizon and decision shown.
**Feedback.** Future? different? caused? checklist. **Examples.** past study→sunk
(L1); cancelable future rent→relevant saving (L2); lost contribution→opportunity
cost (L3). **Validation.** Alternative-delta ledger.

### Family `opportunity_cost`

**Task/purpose.** Calculate the value foregone by using a constrained resource
for one alternative. **Response/template.** Money/resource field.
**Derivation.** Select best feasible forgone use and compute its lost
contribution/benefit. **Difficulty.** L1 one forgone order; L2 partial capacity;
L3 several alternatives. **Distractors/constraints.** Historical resource cost,
sum all forgone alternatives. **Feedback.** Chosen versus next-best feasible use.
**Examples.** one hour displaces 8 contribution→cost 8 (L1); partial displacement
(L2); best of three uses (L3). **Validation.** Bounded alternative enumeration.

### Family `special_order_decision`

**Task/purpose.** Calculate incremental effect and choose accept/reject under
supplied spare-capacity, regular-sales, and hard constraints.
**Response/template.** Contribution bridge plus choice. **Derivation.** Incremental
revenue minus incremental costs and opportunity contribution.
**Difficulty.** L1 spare capacity; L2 special setup/shipping; L3 displaced sales/
strategic constraint. **Distractors/constraints.** Full allocated unit cost,
ignore opportunity cost, extrapolate price to regular customers.
**Feedback.** Only changed cash flows. **Examples.** price 7−incremental cost 5
positive (L1); add batch setup (L2); lost regular margin reverses choice (L3).
**Validation.** Alternative ledger and constraint check.

### Family `make_or_buy`

**Task/purpose.** Compare avoidable internal cost plus opportunity effects with a
supplier quote. **Response/template.** Relevant-cost table/choice.
**Derivation.** Sum avoidable make cash flows; compare purchase and alternative
capacity use. **Difficulty.** L1 all variable; L2 avoidable fixed/allocated
unavoidable; L3 capacity opportunity/quality hard constraint.
**Distractors/constraints.** Full cost comparison, ignore released capacity.
**Feedback.** Make/buy differential. **Examples.** buy 9 versus avoidable make
10 (L1); allocated 3 continues (L2); alternative contribution changes result
(L3). **Validation.** Cash-flow delta.

### Family `retain_drop_segment`

**Task/purpose.** Determine short-term profit effect of retaining or dropping a
fictional product/segment. **Response/template.** Contribution/avoidable-fixed
bridge plus choice. **Derivation.** Lost contribution compared with avoidable
fixed savings and opportunity benefits. **Difficulty.** L1 direct; L2 shared
allocated costs; L3 replacement use/cross-sales supplied.
**Distractors/constraints.** Drop on negative allocated profit alone, assume all
fixed cost disappears. **Feedback.** Segment margin bridge. **Examples.** lose
20 contribution/save 12→retain (L1); common allocation excluded (L2); freed space
benefit reverses choice (L3). **Validation.** Before/after total profit.

### Family `sell_or_process_further`

**Task/purpose.** Compare incremental revenue from further processing with
incremental processing cost. **Response/template.** Differential amount/choice.
**Derivation.** `(finalSalesValue-splitOffSalesValue)-furtherCost`.
**Difficulty.** L1 one product; L2 joint costs shown as sunk to split-off; L3
capacity/opportunity or yield loss. **Distractors/constraints.** Allocate joint
cost to decision, compare total final revenue with further cost.
**Feedback.** Split-off decision timeline. **Examples.** extra revenue 8−cost 5
=3 process (L1); joint cost excluded (L2); bottleneck cost included (L3).
**Validation.** Alternative cash-flow identity.

### Family `keep_replace_asset`

**Task/purpose.** Compare relevant future cash flows of keeping or replacing a
fictional operating asset over a common horizon. **Response/template.** Schedule/
choice. **Derivation.** Include current disposal value, purchase cash flow,
operating differences, and terminal values; exclude book value unless it changes
a supplied cash flow. **Difficulty.** L2 one period; L3 multi-period undiscounted;
L4 discounted handoff to Category 9. **Distractors/constraints.** Sunk book cost,
different horizons. **Feedback.** Common-horizon cash table. **Examples.**
maintenance saving versus price (L2); disposal value opportunity cost (L3);
discounted case linked (L4). **Validation.** Alternative schedule.

### Family `capacity_order_choice`

**Task/purpose.** Choose among mutually exclusive orders competing for finite
capacity. **Response/template.** Order set/total contribution.
**Derivation.** Enumerate feasible subsets using incremental contribution and
resource use. **Difficulty.** L2 one resource/whole orders; L3 setup blocks;
L4 several ties/qualitative constraint. **Distractors/constraints.** Highest
revenue or total order contribution without resource feasibility.
**Feedback.** Feasible subset table. **Examples.** choose higher contribution
within hours (L2); batch setup changes fit (L3); accept all optimal tied sets
(L4). **Validation.** Exhaustive bounded enumeration.

### Family `qualitative_constraint_match`

**Task/purpose.** Identify which supplied nonfinancial factors are hard
constraints, measurable criteria, missing facts, or irrelevant to the bounded
decision. **Response/template.** Matching/multi-select. **Derivation.** Evaluate
typed constraint metadata, not sentiment. **Difficulty.** L1 quality requirement;
L2 supplier resilience/customer effect; L3 conflicting stakeholder criteria.
**Distractors/constraints.** Monetize safety/legal minimum, ignore unspecified
evidence. **Feedback.** Constraint versus preference table. **Examples.**
certification required→hard (L1); lead-time preference→criterion (L2); employee
impact missing→cannot conclude (L3). **Validation.** Constraint registry.

### Family `relevant_decision_audit`

**Task/purpose.** Find one root inclusion, exclusion, opportunity, horizon, or
constraint error in a short-term analysis. **Response/template.** Root/
correction/downstream choice. **Derivation.** Replay differential cash-flow and
constraint logic. **Difficulty.** L2 sunk/allocated; L3 opportunity; L4
qualitative or timing error. **Distractors/constraints.** One root; changed
choice accepted only if recomputed. **Feedback.** Correct differential bridge.
**Examples.** sunk study included (L2); forgone contribution omitted (L3);
supplier fails hard quality requirement (L4). **Validation.** Fault manifest.

### Cross-family progression

Classification and opportunity cost precede named decisions. Spare-capacity
special orders precede constrained ones. Each application reuses the same
differential ledger so learners transfer the principle rather than memorize
separate slogans.

## 5. Category: Scarce resources, product mix, and capacity

### Category purpose

Train allocation of limited resources by contribution per constrained unit,
while respecting demand, indivisibility, setup, and hard operational constraints.

### Learn

When one resource is scarce, contribution per unit of that resource—not
contribution per product—usually ranks marginal use. Ranking alone is not a full
solution when products are indivisible, require setups, or use several resources.

### Prerequisites

Categories 3–4.

### Category boundaries

Small exact allocation models only. No workforce scheduling, safety-capacity
tradeoff, industrial-engineering certification, or general LP solver.

### Common misconceptions

- Rank by contribution per product or revenue.
- Divide scarce resource by contribution.
- Ignore demand limits or minimum commitments.
- Assume all capacity can be used fractionally.
- Treat unused capacity as automatically wasteful.
- Apply a one-resource ranking when several constraints bind.

### Family `contribution_per_constraint`

**Task/purpose.** Calculate contribution per unit of one named scarce resource.
**Response/template.** Money/resource field. **Derivation.**
`unitContribution/resourceUnitsPerProduct`. **Difficulty.** L1 direct; L2 derive
contribution; L3 compare resource units/scales. **Distractors/constraints.**
Reverse ratio, revenue/resource, contribution per product. **Feedback.** Unit
cancellation. **Examples.** 12 contribution/3 hours=4/hour (L1); derive variable
cost first (L2); minutes-to-hours normalization (L3). **Validation.** Dimensional
oracle.

### Family `rank_products_constraint`

**Task/purpose.** Rank products for marginal use of one bottleneck.
**Response/template.** Ordered sequence with ties. **Derivation.** Sort exact
contribution per constrained unit. **Difficulty.** L1 two products; L2 four;
L3 ties or misleading high unit contribution. **Distractors/constraints.**
Revenue, margin percent, unit contribution ranking. **Feedback.** Side-by-side
rates. **Examples.** 5/hour outranks 4/hour (L1); high contribution/long time
falls (L2); exact tie accepted (L3). **Validation.** Stable exact sort.

### Family `optimal_mix_single_constraint`

**Task/purpose.** Allocate one divisible/indivisible constrained resource across
products with demand caps. **Response/template.** Product quantities and total
contribution. **Derivation.** Greedy allocation for divisible profile; bounded
enumeration for indivisible profile. **Difficulty.** L2 divisible; L3 whole units/
leftover; L4 setup/minimum batch. **Distractors/constraints.** Ignore caps,
fractional units in whole profile, ranking without final fit. **Feedback.**
Resource ledger. **Examples.** fill A then B (L2); lower-ranked item uses remainder
(L3); setup changes optimum (L4). **Validation.** Exhaustive oracle.

### Family `capacity_demand_feasibility`

**Task/purpose.** Test whether a sales/production plan fits resource capacities
and identify the binding/excess resource. **Response/template.** Feasible status
plus slack table. **Derivation.** Matrix-multiply quantities by resource
requirements and compare capacities. **Difficulty.** L1 one resource; L2 several;
L3 minimum commitments/period carryover supplied. **Distractors/constraints.**
Check only total units, confuse demand cap with required output. **Feedback.**
Resource-use matrix. **Examples.** 90 of 100 hours→10 slack (L1); labor binds
while machine slack (L2); minimum contract makes infeasible (L3). **Validation.**
Exact constraint evaluation.

### Family `shadow_value_bounded`

**Task/purpose.** Calculate the incremental objective value of one extra unit or
small block of a constrained resource in the current bounded model.
**Response/template.** Money/resource plus valid range. **Derivation.** Re-solve
base and augmented capacity; difference divided by added resource where valid.
**Difficulty.** L2 next product constant value; L3 demand threshold; L4
indivisible step. **Distractors/constraints.** Treat as market price or valid at
all quantities. **Feedback.** Before/after optimal mix and range.
**Examples.** extra hour earns 5 (L2); value falls after demand cap (L3); extra
single hour has zero until batch completes (L4). **Validation.** Dual result by
enumeration, no LP terminology required.

### Family `bottleneck_relief_decision`

**Task/purpose.** Compare the incremental value of added capacity with its
avoidable cost and constraints. **Response/template.** Benefit/cost bridge and
choice. **Derivation.** Re-optimize with proposed capacity, subtract incremental
relief cost. **Difficulty.** L2 one block; L3 overtime/outsourcing rates; L4 new
bottleneck emerges. **Distractors/constraints.** Multiply current shadow value
beyond valid range, assume all sales exist. **Feedback.** Capacity-response
curve. **Examples.** buy 10 hours costing 30 for value 50 (L2); demand limits
benefit (L3); material becomes bottleneck (L4). **Validation.** Base/proposal
enumeration.

### Family `multi_constraint_allocation`

**Task/purpose.** Select the best feasible small integer product mix under two
or three constraints. **Response/template.** Quantities/objective.
**Derivation.** Enumerate bounded integer combinations; filter feasibility and
maximize declared contribution. **Difficulty.** L3 two products/two resources;
L4 three products/setups; L5 multiple optima. **Distractors/constraints.**
Single-resource ranking, infeasible highest contribution, reject tied optima.
**Feedback.** Feasible frontier table. **Examples.** labor/material mix (L3);
setup block (L4); two optimal mixes accepted (L5). **Validation.** Exhaustive
search and complete optimum set.

### Family `capacity_allocation_audit`

**Task/purpose.** Diagnose one rate, unit, cap, indivisibility, setup, or
constraint error in capacity analysis. **Response/template.** Root/correction/
optimal set. **Derivation.** Replay resource matrix and solver.
**Difficulty.** L2 contribution rate; L3 demand/remainder; L4 several constraints.
**Distractors/constraints.** One root; downstream mix is symptom. **Feedback.**
Correct resource ledger/frontier. **Examples.** rank per product not hour (L2);
demand cap omitted (L3); second constraint ignored (L4). **Validation.** Fault
manifest.

### Cross-family progression

Contribution rates precede ranking; ranking precedes allocation. Feasibility is
interleaved before optimization. Shadow value is introduced only as a local
before/after result, then used in bottleneck relief.

## 6. Category: Pricing, demand, elasticity, and target cost

### Category purpose

Train arithmetic links among price, quantity demanded, revenue, contribution,
profit, and cost targets under explicit fictional demand models.

### Learn

Raising price increases revenue per unit but may reduce quantity. The
revenue-maximizing price need not maximize contribution or profit. Elasticity
describes responsiveness over a stated interval; it is not a moral, legal, or
forecast judgment.

### Prerequisites

Categories 2–3 and signed percentage ratios.

### Category boundaries

One fictional firm acts independently. No competitor coordination, real price
recommendation, personalized pricing, protected-class/customer discrimination,
auction strategy, deceptive pricing, or legal classification.

### Common misconceptions

- Choose the price with highest revenue instead of highest profit.
- Assume higher price always raises total revenue.
- Divide demand change by only the ending quantity/base.
- Ignore capacity, variable cost, or cannibalization.
- Apply a markup to the wrong cost base.
- Treat target cost as the current cost or guaranteed achievable cost.

### Family `demand_schedule_read`

**Task/purpose.** Read quantity/revenue at a displayed price or identify an
interval pattern from a demand schedule. **Response/template.** Quantity/money/
choice. **Derivation.** Exact row lookup and `P×Q`. **Difficulty.** L1 lookup;
L2 revenue column; L3 capacity-capped sales. **Distractors/constraints.** Interpolate
when discrete only, use demand above capacity as sales. **Feedback.** Highlight
row and constraint. **Examples.** price 10→80 demand (L1); revenue 800 (L2);
capacity 70→sales 70 (L3). **Validation.** Table/model match.

### Family `linear_demand_transform`

**Task/purpose.** Evaluate or invert a supplied linear demand function.
**Response/template.** Price/quantity field. **Derivation.** Substitute into
`Q=a-bP` or solve algebraically within domain. **Difficulty.** L1 evaluate; L2
inverse; L3 unit scale/domain boundary. **Distractors/constraints.** Sign error,
extrapolate to negative values. **Feedback.** Function graph and substitution.
**Examples.** Q=100−5P at P=10→50 (L1); Q=25→P=15 (L2); outside domain rejected
(L3). **Validation.** Round-trip and domain.

### Family `arc_price_elasticity`

**Task/purpose.** Calculate midpoint arc elasticity and classify magnitude.
**Response/template.** Signed/magnitude field plus elastic/unit/inelastic choice.
**Derivation.** Use exact midpoint percentage changes and their ratio.
**Difficulty.** L2 friendly values; L3 negative sign versus magnitude; L4
compare intervals. **Distractors/constraints.** Starting-base percentages,
reverse ratio, classify negative number directly. **Feedback.** Two midpoint
changes. **Examples.** compute −1.5, elastic magnitude (L2); unit elasticity
(L3); same curve/different interval (L4). **Validation.** Symmetry under endpoint
reversal.

### Family `elasticity_revenue_relation`

**Task/purpose.** Determine the observed total-revenue direction after a supplied
price/quantity change and relate it cautiously to calculated arc elasticity.
**Response/template.** Revenue change plus controlled explanation.
**Derivation.** Compare `P1Q1` and `P2Q2`; use elasticity only for interval
classification. **Difficulty.** L2 direct; L3 near-unit rounding; L4 capacity/
other-factor caveat. **Distractors/constraints.** Higher price→higher revenue
automatically, causal extrapolation. **Feedback.** Both revenue rectangles.
**Examples.** price up/quantity down/revenue falls (L2); revenue unchanged (L3);
capacity invalidates unconstrained relation (L4). **Validation.** Exact products.

### Family `profit_at_price`

**Task/purpose.** Calculate demand, sales, revenue, variable cost, contribution,
and profit at one candidate price. **Response/template.** Waterfall fields.
**Derivation.** Evaluate demand; cap by capacity if declared; apply profit
function. **Difficulty.** L1 schedule; L2 linear demand; L3 step/setup/capacity.
**Distractors/constraints.** Profit=revenue, use demand rather than feasible
sales. **Feedback.** Price→quantity→profit chain. **Examples.** P=10,Q=50,V=6,
F=100→profit 100 (L1); capacity cap (L2); step cost (L3). **Validation.** Scenario
AST.

### Family `discrete_price_optimize`

**Task/purpose.** Choose all profit-maximizing prices from a finite feasible set.
**Response/template.** Price set and profit. **Derivation.** Enumerate candidate
prices through exact demand/cost/constraint model. **Difficulty.** L2 schedule;
L3 linear demand sampled prices; L4 tie or capacity/cannibalization.
**Distractors/constraints.** Highest price/revenue/volume, accept infeasible
candidate. **Feedback.** Candidate table. **Examples.** three prices (L2);
revenue winner differs from profit winner (L3); tied maxima accepted (L4).
**Validation.** Complete enumeration.

### Family `markup_cost_base`

**Task/purpose.** Calculate price or markup percentage from an explicitly named
cost base. **Response/template.** Money/percent. **Derivation.**
`price=costBase×(1+markupOnCost)`; margin on selling price remains a separate
formula. **Difficulty.** L1 markup on cost; L2 inverse; L3 markup versus margin.
**Distractors/constraints.** Apply percent to price, switch variable/full cost.
**Feedback.** Label base in denominator. **Examples.** cost 80+25%=100 (L1);
infer markup (L2); 25% markup=20% price margin (L3). **Validation.** Inverse
identity.

### Family `target_cost`

**Task/purpose.** Derive allowable cost from a supplied market-price assumption
and target profit/margin. **Response/template.** Money/required reduction.
**Derivation.** `targetCost=targetPrice-targetProfitAmount`; convert margin basis
as declared. **Difficulty.** L1 amount; L2 margin percentage; L3 compare current
estimated cost and feasibility status. **Distractors/constraints.** Add target
profit, use markup instead of margin, imply cost reduction is achievable.
**Feedback.** Price→target return→allowable cost. **Examples.** 100−20=80 (L1);
15% price margin (L2); current 86→6 gap, feasibility unknown (L3).
**Validation.** Target equation.

### Family `discount_incremental_effect`

**Task/purpose.** Evaluate a fictional discount/promotion using supplied demand,
incremental cost, cannibalization, and capacity facts. **Response/template.**
Before/after contribution bridge. **Derivation.** Recompute contribution for
changed and displaced sales; include stated promotion cost.
**Difficulty.** L2 incremental units; L3 discount on all units; L4 cannibalization/
capacity. **Distractors/constraints.** Apply lower price only to new units when
offer covers all, use revenue change as profit. **Feedback.** Existing/new/lost
unit table. **Examples.** limited coupon (L2); all-unit price cut (L3);
high-margin product cannibalized (L4). **Validation.** Customer-cohort ledger.

### Family `pricing_demand_audit`

**Task/purpose.** Diagnose one demand, elasticity, cost-base, capacity,
cannibalization, or objective error in pricing analysis.
**Response/template.** Root/correction/qualified choice. **Derivation.** Replay
demand and profit pipeline. **Difficulty.** L2 arithmetic; L3 objective/base;
L4 model/legal boundary. **Distractors/constraints.** One root; no real price
recommendation or competitor coordination. **Feedback.** Correct candidate
table. **Examples.** maximize revenue instead of profit (L2); markup/margin
confused (L3); demand extrapolated beyond range (L4). **Validation.** Fault
manifest.

### Cross-family progression

Schedules precede equations; profit-at-price precedes optimization. Elasticity
is paired with direct revenue computation so it does not become a slogan. Markup
and target cost remain separate from demand-based choice.

## 7. Category: Operating budgets, cash plans, and flexible budgets

### Category purpose

Train coordination of sales, production, resource purchases, timing, and cash,
then distinguish activity differences from spending/performance differences.

### Learn

Budgets form a dependency network: sales drive production; production and
inventory policies drive resource needs; payment/collection timing drives cash.
A flexible budget recalculates allowed variable amounts at actual activity
before comparing performance.

### Prerequisites

Categories 2–3 and timeline arithmetic.

### Category boundaries

No real forecast, treasury recommendation, tax/payroll rules, or behavioral claim
that a budget target is automatically fair or controllable.

### Common misconceptions

- Budget production equal to sales despite inventory policy.
- Add opening inventory instead of subtracting it.
- Treat purchases, use, expense, and cash payment as the same period amount.
- Collect every sale immediately.
- Compare static budget directly with actual at a different volume.
- Label every unfavorable variance as poor management.

### Family `sales_budget`

**Task/purpose.** Calculate budgeted sales units/revenue from volumes, prices,
products, or channels. **Response/template.** Period table. **Derivation.** Sum
exact `units×price` by period/segment. **Difficulty.** L1 one product; L2 several
periods; L3 returns/mix or opening backlog supplied. **Distractors/constraints.**
Add price and units, mix gross/net sales. **Feedback.** Driver table.
**Examples.** 100×8=800 (L1); quarterly schedule (L2); channel mix (L3).
**Validation.** Component totals.

### Family `production_budget`

**Task/purpose.** Calculate required production from sales and finished-goods
inventory policy. **Response/template.** Unit schedule/missing row.
**Derivation.** `sales+desiredEndingFG-openingFG`. **Difficulty.** L1 one period;
L2 rolling periods; L3 capacity/inventory floor. **Distractors/constraints.**
Reverse opening/ending signs, use revenue units. **Feedback.** Units-available
ledger. **Examples.** 100+20−15=105 (L1); ending becomes next opening (L2);
capacity flags infeasible plan (L3). **Validation.** Inventory rollforward.

### Family `materials_purchases_budget`

**Task/purpose.** Calculate material needed and purchases from production,
usage, and inventory policy. **Response/template.** Physical/money schedule.
**Derivation.** Production×material per unit, then needs+ending−opening; multiply
purchase price if requested. **Difficulty.** L1 one material; L2 rolling periods;
L3 yield/scrap factor explicitly defined. **Distractors/constraints.** Use sales
units, confuse use and purchase. **Feedback.** Two-stage quantity ledger.
**Examples.** 100 units×2 kg=200 kg (L1); 200+30−20=210 purchases (L2);
declared yield allowance (L3). **Validation.** Material rollforward.

### Family `labor_overhead_budget`

**Task/purpose.** Calculate direct labor and variable/fixed overhead budget from
production/activity drivers. **Response/template.** Hours/money fields.
**Derivation.** Apply standard hours/rates and declared overhead cost functions.
**Difficulty.** L1 labor; L2 mixed overhead; L3 several activity drivers.
**Distractors/constraints.** Apply fixed overhead per unit, use sales volume.
**Feedback.** Driver→resource→cost tree. **Examples.** 100×0.5h×20=1,000 (L1);
fixed+variable overhead (L2); setups plus machine hours (L3). **Validation.**
Dimensional AST.

### Family `cash_collections_schedule`

**Task/purpose.** Schedule cash collections from sales using an explicit
collection pattern and opening receivables. **Response/template.** Period table.
**Derivation.** Convolve sales cohorts with collection percentages; include
opening balance schedule. **Difficulty.** L2 current/next period; L3 three-lag/
bad-debt fraction; L4 changing pattern supplied. **Distractors/constraints.**
Treat revenue as cash, lose opening cohort, percentages not summing as declared.
**Feedback.** Cohort matrix. **Examples.** 60% now/40% next (L2); opening AR
collection (L3); revised pattern (L4). **Validation.** Cohort totals.

### Family `cash_payments_schedule`

**Task/purpose.** Schedule payments for purchases/costs under explicit timing.
**Response/template.** Period table. **Derivation.** Convolve purchase/cost
cohorts with payment pattern and opening payables. **Difficulty.** L2 one lag;
L3 several cost types; L4 fixed payment dates/minimum. **Distractors/constraints.**
Expense=purchase=payment, omit opening payable. **Feedback.** Payment cohort
matrix. **Examples.** 50% current/50% next (L2); opening AP (L3); rent paid in
advance separately (L4). **Validation.** Cohort rollforward.

### Family `cash_budget`

**Task/purpose.** Build opening cash, receipts, payments, financing, and ending
cash schedule under a supplied minimum-cash rule. **Response/template.** Period
table/borrowing amount. **Derivation.** Exact cash rollforward; borrow/repay only
per displayed rule. **Difficulty.** L2 one period; L3 rolling financing; L4
interest timing or borrowing increments. **Distractors/constraints.** Profit as
cash, ignore minimum, repay before feasible. **Feedback.** Cash waterfall.
**Examples.** opening 10+receipts 50−payments 45=15 (L2); borrow to minimum
(L3); discrete facility blocks (L4). **Validation.** Period rollforward and rule
simulation.

### Family `flexible_budget`

**Task/purpose.** Recalculate budget revenue/cost/profit at actual activity before
comparison. **Response/template.** Flexible-budget table.
**Derivation.** Apply standard price and variable rates to actual driver
quantities; retain fixed budget within range. **Difficulty.** L1 one variable
cost; L2 several lines; L3 several drivers/step fixed cost.
**Distractors/constraints.** Scale fixed cost, leave variable cost at static
volume. **Feedback.** Static→activity→flex bridge. **Examples.** 1,100 units×3
standard variable cost (L1); fixed stays 2,000 (L2); setup driver (L3).
**Validation.** Cost-function evaluation.

### Family `budget_coordination_audit`

**Task/purpose.** Find one root unit, inventory, cohort, cash, dependency, or
flexing error in a coordinated budget. **Response/template.** Root/correction/
affected schedules. **Derivation.** Validate dependency DAG and rollforwards.
**Difficulty.** L2 one schedule; L3 downstream cash; L4 stale assumption.
**Distractors/constraints.** One root; fix source before downstream tables.
**Feedback.** Highlight dependency path. **Examples.** opening inventory added
(L2); collections omit prior receivable (L3); sales revision not propagated
(L4). **Validation.** Fault manifest.

### Cross-family progression

Sales precedes production, which precedes resources. Collection/payment cohorts
precede the cash budget. Flexible budgets are introduced after static dependency
logic so “flexing” is not confused with revising the original plan.

## 8. Category: Standards, variances, and performance diagnosis

### Category purpose

Train decomposition of actual-versus-standard differences into traceable price,
rate, quantity, efficiency, volume, and planning components without inventing
causes or blame.

### Learn

A variance is a comparison under a declared sign convention. Flex to actual
activity before judging spending or efficiency. A favorable cost variance means
lower cost than the comparison basis—not necessarily a good operational outcome.

### Prerequisites

Categories 2 and 7.

### Category boundaries

No real employee evaluation, incentive recommendation, fraud claim, or assumption
that standards are fair, attainable, safe, or controllable.

### Common misconceptions

- Compare actual cost with a static budget at different activity.
- Use purchased quantity for a usage variance when the profile uses quantity
  used.
- Apply actual price to a standard-quantity variance.
- Reverse favorable/unfavorable signs.
- Call every variance a manager's fault.
- Sum variances built from incompatible standards.

### Family `standard_quantity_hours`

**Task/purpose.** Calculate standard quantity/hours allowed for actual output.
**Response/template.** Resource units. **Derivation.** Actual good output times
standard input per output, adjusted only by declared standard yield.
**Difficulty.** L1 direct; L2 several products; L3 yield/rework standard.
**Distractors/constraints.** Budget output, actual input, double-count allowed
waste. **Feedback.** Output→allowed-input bridge. **Examples.** 100×2kg=200kg
(L1); product mix (L2); declared yield factor (L3). **Validation.** Dimensional
AST.

### Family `materials_price_usage_variance`

**Task/purpose.** Compute and reconcile direct-material price and usage variances.
**Response/template.** Signed amounts plus F/U. **Derivation.** Use canonical
formulas with actual quantity at purchase/use per displayed profile and standard
quantity allowed. **Difficulty.** L2 one material; L3 purchase/use quantities
differ; L4 several materials/mix. **Distractors/constraints.** Swap AQ/SQ or
AP/SP; F/U derived after sign. **Feedback.** Price then quantity rectangle.
**Examples.** AQ100(AP6−SP5)=100 U (L2); usage SP5(AQ100−SQ90)=50 U (L2);
purchase/use split (L3). **Validation.** Reconcile actual to flex standard cost.

### Family `labor_rate_efficiency_variance`

**Task/purpose.** Compute labor rate and efficiency variances.
**Response/template.** Signed amounts plus F/U. **Derivation.**
`AH(AR-SR)` and `SR(AH-SH)`. **Difficulty.** L2 direct; L3 overtime premium
separated; L4 skill mix with profile definitions. **Distractors/constraints.**
Use SH in rate variance, actual rate in efficiency variance. **Feedback.**
Rate/hour decomposition. **Examples.** 50h×(22−20)=100 U (L2);
20×(50−45)=100 U (L2); overtime component (L3). **Validation.** Total labor-cost
bridge.

### Family `variable_overhead_variance`

**Task/purpose.** Compute variable-overhead spending and efficiency variances
using the named driver. **Response/template.** Signed amounts/F/U.
**Derivation.** `actualVOH-AH*standardRate` and
`standardRate*(AH-SH)` or exact profile equivalents.
**Difficulty.** L2 machine/labor hours; L3 several variable pools; L4 driver
misclassification. **Distractors/constraints.** Use fixed overhead, output units
instead of named driver. **Feedback.** Driver-rate bridge. **Examples.** actual
510 versus 50h×10=500→10 U (L2); efficiency component (L3); two pools (L4).
**Validation.** Flex-budget reconciliation.

### Family `fixed_overhead_budget_variance`

**Task/purpose.** Compare actual fixed overhead with budgeted fixed overhead and
distinguish it from activity/volume effects. **Response/template.** Signed
amount/F/U. **Derivation.** `actualFixedOH-budgetFixedOH` within relevant range.
**Difficulty.** L1 direct; L2 step cost; L3 separate supplied volume-allocation
variance. **Distractors/constraints.** Flex fixed cost per unit, call under/
overapplied amount spending variance. **Feedback.** Total fixed budget line.
**Examples.** 1,050−1,000=50 U (L1); capacity step changes budget (L2);
allocation variance separately labeled (L3). **Validation.** Profile identity.

### Family `sales_price_volume_variance`

**Task/purpose.** Decompose sales-revenue or contribution change into price and
volume effects under a declared bridge. **Response/template.** Signed
contributions. **Derivation.** Default revenue:
`AQ(AP-SP)` and `SP(AQ-SQ)`; contribution variant uses standard contribution.
**Difficulty.** L2 one product; L3 contribution version; L4 mix effect.
**Distractors/constraints.** Cost F/U convention copied blindly, double-count
interaction. **Feedback.** Standard→price→volume waterfall.
**Examples.** actual price above standard→favorable revenue price variance (L2);
lower volume (L2); mix bridge (L4). **Validation.** Components reconcile total.

### Family `planning_operational_variance`

**Task/purpose.** Split a total variance between a revised ex-post planning
benchmark and operational performance under supplied policy.
**Response/template.** Two signed amounts. **Derivation.** Original standard→
revised standard→actual using a declared bridge order.
**Difficulty.** L3 one external price change; L4 price plus efficiency; L5
alternative attribution orders shown. **Distractors/constraints.** Treat revised
standard as hidden hindsight truth, mix standards. **Feedback.** Three-column
bridge. **Examples.** market material price revision (L3); operational purchase
price difference remains (L4); attribution policy affects split (L5).
**Validation.** Sum to total variance.

### Family `variance_reconcile_interpret`

**Task/purpose.** Reconcile a set of variances to actual result and select only
supported operational statements. **Response/template.** Bridge plus multi-select.
**Derivation.** Apply signed variance ledger and controlled evidence predicates.
**Difficulty.** L2 two variances; L3 revenue/cost/profit; L4 offsetting variances
and missing causes. **Distractors/constraints.** Net favorable means every
component favorable, arithmetic variance proves cause. **Feedback.** Waterfall
and evidence/missing-premise links. **Examples.** price U+usage F net (L2);
profit bridge (L3); “lower usage caused defects” unsupported (L4).
**Validation.** Ledger and claim entailment.

### Family `variance_audit`

**Task/purpose.** Diagnose one quantity, rate, flex, sign, standard-version, or
interpretation error in variance analysis. **Response/template.** Root/
correction/qualified claim. **Derivation.** Replay standard/actual/flexible
budget provenance. **Difficulty.** L2 formula; L3 stale standard; L4 blame/
constraint overreach. **Distractors/constraints.** One root; safety/quality
effects cannot be inferred or traded away. **Feedback.** Correct bridge.
**Examples.** budget quantity used instead of actual output allowance (L2);
actual price used in usage variance (L3); favorable cost called good management
(L4). **Validation.** Fault manifest.

### Cross-family progression

Allowed quantity/hours precedes price/usage and rate/efficiency pairs. Flexible
budgets precede spending diagnosis. Reconciliation and interpretation appear
only after components can be calculated independently.

## 9. Category: Capital choices, uncertainty, and decision trees

### Category purpose

Train time- and uncertainty-aware comparison of bounded fictional alternatives
using supplied cash flows, discount rates, probabilities, and decision criteria.

### Learn

Relevant project cash flows are incremental. Payback and NPV answer different
questions. Expected value is a probability-weighted average over repeated/model
outcomes, not a guaranteed result. A decision tree rolls values backward from
later events and choices.

### Prerequisites

Category 4, compound discounting, and elementary probability.

### Category boundaries

No real capital budgeting, discount-rate estimation, financing structure, tax
advice, portfolio choice, or monetization of mandatory safety/legal constraints.

### Common misconceptions

- Include sunk development cost in project cash flows.
- Omit opportunity cost or terminal working-capital recovery when supplied.
- Compare projects with different horizons without the declared common rule.
- Accept a project because payback is short despite a negative NPV criterion.
- Choose the largest single payoff instead of expected value.
- Average branch values without probabilities.
- Treat EVPI as the price of any information, regardless of accuracy.

### Family `project_cash_flow_construct`

**Task/purpose.** Classify and schedule relevant incremental project cash flows.
**Response/template.** Period cash-flow table. **Derivation.** Compare with/without
project; include investment, operating differences, opportunity cost, working
capital, and terminal values as supplied. **Difficulty.** L2 initial/annual;
L3 working-capital recovery; L4 replacement/opportunity effects.
**Distractors/constraints.** Sunk study, depreciation without cash-tax profile,
omit terminal release. **Feedback.** Incremental timeline. **Examples.** −100
then +30 annual (L2); working capital outflow/recovery (L3); displaced contribution
(L4). **Validation.** Alternative cash-flow delta.

### Family `payback_period`

**Task/purpose.** Calculate simple payback and state its supplied limitations.
**Response/template.** Period plus residual fraction if allowed.
**Derivation.** Accumulate undiscounted project cash flows until initial outlay
is recovered. **Difficulty.** L1 equal flows; L2 uneven; L3 no payback within
horizon. **Distractors/constraints.** Average flow shortcut when uneven, include
post-payback cash in timing. **Feedback.** Cumulative cash table.
**Examples.** 100/25=4 years (L1); uneven flows recover during year 3 (L2);
never recovers in shown horizon (L3). **Validation.** Cumulative crossing.

### Family `net_present_value`

**Task/purpose.** Discount supplied incremental cash flows and calculate NPV.
**Response/template.** PV table/money field. **Derivation.** Exact profile
formula with period-end timing. **Difficulty.** L2 one future flow/PV factors;
L3 annuity-like sequence; L4 uneven cash flows/terminal value.
**Distractors/constraints.** Compound forward, omit time zero, round each PV
unless stated. **Feedback.** Time, factor, PV table. **Examples.** −100+110/1.10
=0 (L2); multi-period flows (L3); terminal recovery (L4). **Validation.**
Independent rational/high-precision oracle.

### Family `project_compare_constraint`

**Task/purpose.** Select all preferred feasible projects under a supplied NPV,
budget, exclusivity, and hard-constraint rule. **Response/template.** Project
set/total NPV. **Derivation.** Enumerate bounded subsets, filter constraints, and
maximize stated criterion. **Difficulty.** L2 independent projects; L3 capital
limit/mutual exclusion; L4 indivisible combinations/ties.
**Distractors/constraints.** Highest individual NPV, NPV percentage, infeasible
set. **Feedback.** Feasible project-set table. **Examples.** accept positive
independent NPVs (L2); capital rationing combination (L3); tied sets accepted
(L4). **Validation.** Exhaustive subset oracle.

### Family `payoff_regret_table`

**Task/purpose.** Complete payoff/regret cells and choose under maximin or minimax
regret when that rule is explicitly supplied. **Response/template.** Matrix/
choice. **Derivation.** Regret equals state-best payoff minus action payoff;
apply named row criterion. **Difficulty.** L2 payoff lookup; L3 regret matrix;
L4 ties/negative payoffs. **Distractors/constraints.** Global best instead of
state best, maximize regret. **Feedback.** State-by-state opportunity loss.
**Examples.** complete one regret cell (L2); minimax regret choice (L3); tied
maximin choices (L4). **Validation.** Matrix enumeration.

### Family `expected_value_decision`

**Task/purpose.** Compute expected monetary value for alternatives and choose all
maximizers under the stated criterion. **Response/template.** EV fields/choice.
**Derivation.** Sum exact probability×payoff for each alternative.
**Difficulty.** L1 two outcomes; L2 several alternatives; L3 conditional cost/
ties. **Distractors/constraints.** Choose best possible outcome, unweighted
average, treat EV as guaranteed. **Feedback.** Probability-weight table.
**Examples.** 50%×10+50%×0=5 (L1); compare options (L2); tie accepted (L3).
**Validation.** Probabilities and EV exact.

### Family `decision_tree_rollback`

**Task/purpose.** Evaluate a small sequential decision/chance tree by rollback.
**Response/template.** Node values and policy. **Derivation.** At chance nodes
take probability-weighted value; at decision nodes apply declared objective over
feasible branches, working backward. **Difficulty.** L2 one chance node; L3
decision then information; L4 two stages/conditional probabilities.
**Distractors/constraints.** Average decision branches, decide before observing
available information, double-count branch costs. **Feedback.** Highlight
rollback order. **Examples.** one gamble (L2); test then decide (L3); conditional
tree (L4). **Validation.** Recursive independent evaluator.

### Family `value_of_perfect_information`

**Task/purpose.** Calculate EV with perfect information and EVPI.
**Response/template.** Money fields. **Derivation.** Choose state-best action
within each state, weight results, subtract best no-information EV.
**Difficulty.** L2 two states/actions; L3 several; L4 distinguish sample/
imperfect information. **Distractors/constraints.** Perfect-info EV without
subtracting baseline, negative EVPI. **Feedback.** With/without information
table. **Examples.** EVwPI 12−best EV 9=3 (L2); three states (L3); imperfect test
cannot be valued as EVPI (L4). **Validation.** EVPI nonnegative and upper-bound
checks.

### Family `decision_sensitivity_threshold`

**Task/purpose.** Solve a break-even probability, cash flow, price, cost, or
discount-rate grid threshold where two alternatives tie.
**Response/template.** Threshold/range. **Derivation.** Construct exact equality
or enumerate the declared rate grid; verify choice on both sides.
**Difficulty.** L2 one probability; L3 contribution/NPV input; L4 several
parameters with one varied at a time. **Distractors/constraints.** Change hidden
inputs, report point as forecast. **Feedback.** Difference equation/one-way
sensitivity table. **Examples.** solve `p` where EVs equal (L2); break-even
annual cash flow (L3); grid switch rate (L4). **Validation.** Boundary and
neighbor witnesses.

### Family `investment_uncertainty_audit`

**Task/purpose.** Diagnose one cash-flow, time, probability, rollback,
information-value, feasibility, or interpretation error.
**Response/template.** Root/correction/conditional decision. **Derivation.**
Replay cash-flow timeline and decision tree. **Difficulty.** L2 payback/NPV;
L3 EV/tree; L4 sensitivity or qualitative constraint. **Distractors/constraints.**
One root; expected or NPV-optimal is conditional, not guaranteed.
**Feedback.** Correct timeline/tree. **Examples.** sunk cost included (L2);
chance probabilities omitted (L3); decision branch chosen before information
(L4). **Validation.** Fault manifest.

### Cross-family progression

Relevant cash-flow construction precedes every project metric. Payback and NPV
are taught in contrast. Static payoff/EV tables precede sequential trees. EVPI
and sensitivity appear only after baseline alternatives are evaluated correctly.

## 10. Category: Responsibility, incentives, multi-criteria decisions, and audits

### Category purpose

Train comparison of organizational units and managers under explicitly defined
responsibility, allocation, investment, transfer, and multi-criteria rules.

### Learn

A performance measure can encourage behavior as well as describe results.
Controllability, common-cost allocation, time horizon, capital base, and transfer
rules can change apparent performance. No single KPI captures every objective.

### Prerequisites

All earlier categories as relevant.

### Category boundaries

No real employee appraisal, compensation design, transfer-pricing tax rule,
organizational restructuring, balanced-scorecard consultancy, or ethical
judgment by language model.

### Common misconceptions

- Hold a manager responsible for supplied uncontrollable items.
- Allocate common cost and then treat it as avoidable.
- Choose a division solely by absolute profit or ROI.
- Reject a positive-residual-income project because it lowers existing ROI.
- Set transfer price from one division's full cost without capacity context.
- Collapse incompatible KPIs into a hidden weighted score.

### Family `segment_contribution_statement`

**Task/purpose.** Construct product/segment contribution and segment margin,
separating traceable avoidable fixed costs from common allocated costs.
**Response/template.** Layered statement/missing row. **Derivation.** Revenue−
variable cost=contribution; minus traceable fixed=segment margin; common cost
shown separately. **Difficulty.** L2 one segment; L3 multiple/shared cost; L4
decision versus reporting view. **Distractors/constraints.** Allocate common
cost as avoidable, stop at gross margin. **Feedback.** Cost-layer statement.
**Examples.** contribution 40−traceable fixed 15=25 segment margin (L2);
common cost below segments (L3); reporting allocation reconciled separately
(L4). **Validation.** Statement identity.

### Family `controllable_profit`

**Task/purpose.** Calculate profit controllable by a named responsibility center
under supplied authority facts. **Response/template.** Money/inclusion table.
**Derivation.** Include only revenues/costs tagged controllable for the role and
horizon. **Difficulty.** L2 cost center; L3 profit center/shared service; L4
partial/time-lag control. **Distractors/constraints.** Every assigned line,
manager title implies control. **Feedback.** Authority→line-item mapping.
**Examples.** central rent excluded (L2); local overtime included (L3); contract
locked this quarter (L4). **Validation.** Responsibility registry.

### Family `division_roi`

**Task/purpose.** Calculate divisional ROI under a defined profit and investment
base and show mechanical project effect. **Response/template.** Percent before/
after. **Derivation.** `controllableOperatingProfit/averageOperatingAssets` or
displayed profile. **Difficulty.** L2 direct; L3 average assets; L4 proposed
project lowers division ROI but earns positive profit. **Distractors/constraints.**
Sales denominator, ending assets, call ROI market return. **Feedback.** Numerator/
capital basis and incentive effect. **Examples.** 20/100=20% (L2); average base
(L3); new 15% project lowers 20% average (L4). **Validation.** Definition AST.

### Family `residual_income`

**Task/purpose.** Calculate residual income and compare its project incentive
with ROI under a supplied required return. **Response/template.** Money/choice.
**Derivation.** `operatingProfit-requiredRate*investmentBase`.
**Difficulty.** L2 direct; L3 proposed project; L4 different division sizes/rates.
**Distractors/constraints.** Multiply profit by rate, compare absolute RI across
sizes without stated criterion. **Feedback.** Profit less capital charge.
**Examples.** 20−10%×100=10 (L2); positive-RI 15% project at 10% hurdle (L3);
size limitation (L4). **Validation.** ROI/RI reconciliation.

### Family `transfer_price_range`

**Task/purpose.** Calculate a feasible internal transfer-price range from minimum
seller and maximum buyer values under supplied capacity/opportunity facts.
**Response/template.** Range/infeasible status. **Derivation.** Seller minimum=
incremental cost+opportunity cost; buyer maximum=external alternative adjusted
for differences. **Difficulty.** L2 spare capacity; L3 constrained seller; L4
quality/logistics or no overlap. **Distractors/constraints.** Full cost always,
external market price always, tax/jurisdiction ignored. **Feedback.** Both
divisions' boundaries. **Examples.** seller min 6/buyer max 9→range (L2);
lost contribution raises min (L3); min>max→no mutually beneficial range (L4).
**Validation.** Alternative-ledger oracle.

### Family `multi_kpi_tradeoff`

**Task/purpose.** Compare alternatives across a displayed set of financial and
nonfinancial criteria without inventing hidden commensurability.
**Response/template.** Constraint-filtered/Pareto/weighted result as explicitly
named. **Derivation.** Test hard constraints, normalize only declared metrics,
then apply displayed weights or dominance. **Difficulty.** L2 hard filters;
L3 weighted score; L4 Pareto set/sensitivity. **Distractors/constraints.** Profit
overrides hard safety/quality requirement, raw-unit sum, hidden weights.
**Feedback.** Constraint then criterion table. **Examples.** infeasible option
removed (L2); transparent 60/40 score (L3); two nondominated choices (L4).
**Validation.** Exact filter/score/Pareto oracle.

### Family `managerial_decision_sufficiency`

**Task/purpose.** Identify missing facts, assumptions, objectives, or stakeholder
choices that prevent a unique managerial conclusion.
**Response/template.** `cannot determine` reason and witness alternatives.
**Derivation.** Solve across unspecified variable/criterion domains.
**Difficulty.** L2 missing avoidability; L3 unknown demand/probability; L4
conflicting unweighted objectives. **Distractors/constraints.** Fill gap with
industry convention or choose highest short-term profit. **Feedback.** Show
different valid outcomes. **Examples.** fixed cost continuation unknown (L2);
demand response absent (L3); no weights leaves Pareto alternatives (L4).
**Validation.** At least two witness completions.

### Family `integrated_managerial_decision_audit`

**Task/purpose.** Find one earliest root defect or unresolved premise across
facts→cost model→constraints→alternatives→evaluation→conclusion.
**Response/template.** Root layer, evidence, correction, downstream effects,
qualified conclusion. **Derivation.** Validate units, horizons, cost behavior,
relevance, capacity, demand, budget, variance, timing, probability, incentives,
and hard constraints in dependency order. **Difficulty.** L3 two domains; L4
several downstream outputs; L5 underdetermined/value-dependent.
**Distractors/constraints.** One root or explicit insufficiency; no real-world
recommendation. **Feedback.** Provenance graph. **Examples.** unavoidable
allocated cost corrupts make/buy (L3); stale demand model corrupts price and cash
budget (L4); missing safety feasibility prevents choice despite profit ranking
(L5). **Validation.** Fault/insufficiency manifest.

### Cross-family progression

Segment layers and controllability precede ROI/RI. Transfer pricing reuses
relevant cost and capacity. Multi-KPI comparison follows single-objective
fluency. Sufficiency drills precede integrated audits.

## 11. Topic-level progression

### Level 1 — Classify and calculate

Recognize ideal cost behavior, compute unit/total contribution, build one budget
row, and evaluate one explicit price, capacity, variance, or payoff relationship.

### Level 2 — Invert and compare

Solve break-even/target relationships, compare relevant alternatives, flex a
budget, decompose paired variances, and evaluate simple projects or uncertainty.

### Level 3 — Coordinate constraints and timing

Handle sales mix, opportunity cost, bottlenecks, demand response, inventory/cash
timing, weighted models, and sequential decisions.

### Level 4 — Reconcile and stress assumptions

Coordinate several budgets/resources, compare models and KPIs, propagate changed
assumptions, test sensitivity, and diagnose root rather than downstream errors.

### Level 5 — Preserve conditionality and plural objectives

Recognize multiple optima, missing information, noncommensurable criteria,
incentive effects, and conclusions that depend on values or model choice.

## 12. Adaptive practice guidance

Track mastery by:

- category and family;
- cost-behavior, traceability, avoidability, and relevance axes;
- per-unit/total, resource, time, physical, money, and probability units;
- direct, inverse, reconciliation, selection, allocation, scenario, and audit
  modes;
- horizon/relevant range;
- capacity and demand structure;
- budget dependency/collection-payment lag;
- variance type, sign, and standard version;
- deterministic/uncertain and static/sequential decision structure;
- objective, hard constraint, responsibility, and misconception.

Failure-driven routing:

- fixed total/per-unit confusion → paired activity tables;
- direct/variable or indirect/fixed confusion → change cost object and behavior
  independently;
- allocated cost treated as avoidable → alternative cash-flow classification;
- sunk cost included → future/different/caused checklist;
- break-even formula error → unit contribution before inverse CVP;
- single-resource ranking error → contribution-per-resource drill;
- infeasible “optimal” mix → feasibility before objective;
- revenue-maximizing price chosen for profit → one-price waterfall, then table;
- markup/margin confusion → denominator comparison;
- opening/ending inventory sign error → physical rollforward;
- revenue/purchases treated as cash → cohort schedules;
- static-versus-actual variance → flexible-budget diagnostic;
- F/U reversal → signed actual-minus-standard bridge;
- EV treated as guaranteed → distribution/payoff interpretation;
- decision tree evaluated forward → terminal-node rollback;
- ROI called shareholder return → responsibility-center basis;
- downstream audit symptom selected → provenance-to-root drill.

Slow but correct computation preserves conceptual level while simplifying
arithmetic. Fast formula recall without correct classification does not establish
mastery.

## 13. Answer checking and feedback

### Semantic checking

- Compare stable IDs, exact values, units, time bases, alternatives, constraints,
  and decision criteria—not localized strings.
- Use exact rational/decimal arithmetic and round only at the declared stage.
- Normalize formulas by typed expression tree, including unit dimensions.
- Accept every tied optimal mix/project/price/decision that satisfies the active
  equivalence policy.
- `Undefined` is a mathematical status, `infeasible` violates a hard constraint,
  `not comparable` has incompatible bases, and `cannot determine` lacks a
  necessary fact/value.
- Recommendation controls require both the correct fictional alternative set and
  the correct declared criterion/condition.

### Misconception fingerprints

Store alternative results for:

- total versus unit cost;
- fixed cost scaled with units;
- direct/variable and indirect/fixed conflation;
- high cost rather than high activity in high-low;
- sunk/allocated cost inclusion;
- omitted opportunity cost;
- fixed cost divided by price/full unit cost;
- ordinary rounding instead of whole-unit ceiling;
- product contribution rather than contribution per constraint;
- revenue versus profit objective;
- elasticity base/reversal;
- markup on cost versus margin on price;
- opening/ending inventory sign reversal;
- sales/use/purchase/payment conflation;
- static budget versus flexible budget;
- AQ/SQ and AP/SP variance swaps;
- forward compounding instead of discounting;
- unweighted payoff average;
- forward rather than backward tree evaluation;
- uncontrollable/common cost attribution.

### Worked feedback order

1. Restate decision, horizon, feasible alternatives, and criterion.
2. List hard constraints and nonfinancial boundaries.
3. Identify relevant units and source facts.
4. Classify costs/revenues before calculating.
5. Show exact differential, budget, resource, or decision bridge.
6. Apply objective and accept ties.
7. Test sensitivity or missing facts when relevant.
8. State the narrow conclusion and its limitations.

## 14. Rendering, interaction, accessibility, and localization

- Tables expose captions, row/column headers, units, periods, totals, subtotals,
  standards/actuals, and assumptions.
- CVP, demand, cost, profit-volume, sensitivity, and cumulative-cash graphs are
  semantic SVGs generated from exact models; answers never rely on pixel
  measurement.
- Resource allocation uses both matrix/table and optional block/bar views.
- Budget and cash collection/payment schedules expose cohort tables.
- Decision trees have keyboard-navigable nested-list equivalents with node type,
  probability, branch cost/payoff, and rollback value.
- Waterfalls have accessible signed tables and do not rely on red/green.
- Hard constraints, preferences, favorable/unfavorable, actual/standard, and
  feasible/infeasible use text/pattern as well as color.
- Drag/drop has matching, numeric, or list alternatives.
- Currency localization changes display only, never exchange value.
- Localization preserves decimal separators, percentage points, F/U semantics,
  physical units, time basis, and `per` denominators.
- Reduced-motion mode uses static stages.

## 15. Generator and implementation architecture

Recommended standalone modules:

```text
seededRng
fictionalOrganizationGrammar
managerialProfileRegistry
exactDecimalRational
unitDimensionEngine
costFunctionEngine
relevantRangeOracle
differentialCashFlowLedger
cvpEngine
resourceConstraintSolver
demandAndPricingEngine
budgetDependencyGraph
cohortScheduleEngine
standardVarianceEngine
discountedCashFlowEngine
payoffDecisionTreeEngine
performanceMeasureRegistry
constraintAndParetoEngine
sensitivitySolver
claimEntailmentEngine
provenanceGraph
faultInjector
semanticTableSvgRenderer
accessibleFactBuilder
localizedAnswerParser
semanticAnswerChecker
```

Generation pipeline:

1. Select family, misconception, profile, horizon, and difficulty dimensions.
2. Construct a coherent fictional facts/assumptions model.
3. Derive costs, revenues, constraints, alternatives, budgets, and results.
4. Solve through the primary engine and an independent bounded oracle.
5. Generate distractors from alternative computations or inject one audit fault.
6. Render exact semantic views and structured accessible equivalents.
7. Reject ambiguity, infeasibility outside the task, rounded-choice collision,
   unsupported causality, legal/ethical overreach, or repeated structure.
8. Localize only after semantic validation.

The app remains standalone HTML/JS/CSS. No backend, optimizer service,
spreadsheet, accounting platform, market feed, competitor-price feed, or
language model is required at runtime.

## 16. Automated validation requirements

### Model invariants

- Every fact, cost item, event, assumption, constraint, alternative, output, and
  conclusion has stable provenance.
- Physical, time, money, rate, and resource units are dimensionally compatible.
- Cost functions agree with their behavior class inside the relevant range.
- Alternative cash-flow ledgers sum to the displayed differential.
- Budget quantities, inventories, receivables/payables, and cash roll forward.
- Standards and actuals retain distinct version IDs.
- Probabilities at complete chance nodes sum exactly to 1.
- Scenario copies do not mutate the base model.

### Formula and solver invariants

- Cost equations reproduce generated observations intended to be exact.
- High-low estimates pass through both selected points.
- CVP answers substitute back into the exact profit function.
- Multiproduct CVP preserves its displayed mix.
- Whole-unit/batch answers satisfy minimality.
- Resource solutions are feasible and optimal under exhaustive bounded
  enumeration; all tied optima are archived.
- Demand results remain inside domain with nonnegative price/quantity.
- Candidate-price optima match exhaustive enumeration.
- Flexible budgets evaluate standard functions at actual activity.
- Variance components reconcile to the declared actual-versus-standard total.
- Project cash-flow, payback, and NPV timelines use declared timing.
- Decision-tree rollback matches independent recursive enumeration.
- EVPI is nonnegative and no greater than the relevant perfect-information
  bound.
- ROI, residual income, transfer ranges, scores, and Pareto sets use visible
  profile definitions.

### Question invariants

- All placeholders are substituted and all required assumptions/units are shown.
- Numeric answers are reproducible from visible rounded data.
- Distractors remain distinct and incorrect after display rounding.
- Qualitative claims are entailed; unsupported claims retain missing-premise or
  counterexample metadata.
- Audit cases contain one earliest root unless explicitly marked multi-fault or
  insufficiency.
- Worked solutions include classification, calculation, criterion, constraint,
  and limitation.
- No case contains real organization/customer/competitor data, coordination,
  legal advice, unsafe tradeoff, or personnel recommendation.

For at least `10,000` accepted seeds per family/level, and `25,000` for mixed/
step costs, multiproduct CVP, constrained allocation, pricing optimization,
cohort budgets, variance reconciliation, project subsets, decision trees, EVPI,
sensitivity, Pareto comparison, and integrated audits, validate all invariants,
answer uniqueness, parser behavior, localization, accessibility, and coverage.

## 17. Coverage requirements

Balance:

- fixed/variable/mixed/step and total/per-unit views;
- direct/indirect, avoidable/unavoidable, sunk/incremental/opportunity axes;
- positive/zero/nonpositive contribution and finite/nonfinite break-even status;
- exact/ceiling/inverse/mix CVP cases;
- spare/constrained capacity and divisible/indivisible/setup cases;
- accept/reject/tie outcomes across relevant-cost decisions;
- demand schedules/functions, elastic/unit/inelastic intervals, revenue/profit
  optima, markup and target-cost bases;
- sales/production/resource/cash/flexible budgets and timing lags;
- favorable/unfavorable/offsetting variances without performance labels;
- deterministic, probabilistic, sequential, sensitivity, and insufficiency
  cases;
- ROI/RI/transfer/multi-KPI incentive patterns;
- direct, inverse, construction, comparison, selection, audit, and multiple-valid
  response modes.

Structural signatures include family, cost structure, horizon, unit scale,
decision direction, constraint topology, demand shape, budget lags, variance
sign pattern, tree topology, criterion, misconception, and root fault. Changed
names or numbers alone do not count as new coverage.

## 18. Recommended views and v1 priorities

Views:

1. **Costs & Behavior**
2. **Contribution & Break-even**
3. **Relevant Decisions**
4. **Capacity & Mix**
5. **Pricing & Demand**
6. **Budgets & Cash**
7. **Standards & Variances**
8. **Projects & Uncertainty**
9. **Responsibility & Audit**

V1 prioritizes:

- linear and step costs within explicit ranges;
- contribution and one/multiproduct CVP;
- special order, make/buy, retain/drop, process-further decisions;
- one/two-resource bounded allocation;
- discrete demand/pricing tables and simple linear functions;
- coordinated production/material/cash and flexible budgets;
- material/labor and basic overhead/sales variances;
- relevant project cash flows, payback, NPV, EV, simple trees;
- segment margin, ROI/RI, sufficiency, and integrated audit.

Defer:

- real business inputs or recommendations;
- econometric demand, continuous nonlinear optimization, large LP/MIP;
- full ABC, lifecycle/quality/environmental costing;
- taxes, financing, WACC, terminal value, inflation/FX;
- workforce, legal, safety, compliance, or competitor-strategy decisions;
- complex simulations and open-ended management essays.

## 19. Topic-level quality checklist

- [ ] Every organization, product, customer, supplier, competitor, and project is
      fictional.
- [ ] Every question declares purpose, horizon, units, range, alternatives,
      constraints, and criterion.
- [ ] Cost behavior, traceability, allocation, and decision relevance stay
      separate.
- [ ] Sunk/unavoidable costs and opportunity effects are handled explicitly.
- [ ] CVP assumptions and multiproduct mix are visible.
- [ ] Feasibility and hard qualitative constraints precede optimization.
- [ ] Demand models are bounded and prices are chosen independently.
- [ ] No pricing/decision case creates legal, safety, workforce, or ethical advice.
- [ ] Budget dependencies and cash timing reconcile.
- [ ] Variances are flexed, signed, and never treated as proof of cause/blame.
- [ ] Discount rates and probabilities are supplied assumptions, not estimates.
- [ ] Expected value is not presented as guaranteed outcome.
- [ ] Performance measures expose controllability, allocation, and incentive
      limitations.
- [ ] Undefined/infeasible/not comparable/cannot determine remain distinct.
- [ ] Tied/equivalent/Pareto-optimal alternatives are all accepted.
- [ ] Every family has task, response/template, derivation, difficulty,
      misconception distractors/constraints, feedback, three examples, and
      validation.
- [ ] Exact independent oracles, seed sweeps, accessibility, and localization
      pass.
- [ ] Runtime requires no backend or external service.

## 20. Stable identifiers and navigation

The backticked family identifiers above are stable public IDs. Archive:

```text
seed
familyId
level
organizationProfileId
decisionAndHorizonIds
currencyScaleAndUnitIds
costModelVersionIds
demandModelId
budgetAndStandardRevisionIds
constraintAndObjectiveIds
probabilityAndDiscountProfileIds
exactInputs
exactAnswerAndOptimalSet
displayRounding
acceptedAnswerSet
misconceptionIds
provenanceGraph
faultOrInsufficiencyManifest
structuralSignature
```

Changing a cost definition, relevant-range boundary, decision-relevance rule,
variance sign convention, demand function, cash-flow timing, optimization
criterion, constraint, or accepted equivalence requires a new version. Localized
renaming does not.
