# Investment Literacy & Company Analysis — Dynamic Practice Specification

Status: implementation specification; fictional companies and securities only,
**not investment, accounting, tax, legal, or valuation advice**

Audience: financial-statement generator, ratio and valuation engine, semantic
answer checker, chart/table renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Investment Literacy & Company Analysis

### Topic goal

Develop fluent, skeptical reasoning from a controlled set of company statements,
notes, operating data, and market data. The learner should become able to:

- identify what each financial statement measures and reconcile their links;
- distinguish point-in-time balances from period flows;
- reconstruct revenue, cost, profit, cash, equity, and per-share bridges;
- calculate growth, margins, liquidity, turnover, returns, coverage, and
  cash-conversion measures from explicitly defined inputs;
- separate profitability from cash generation and solvency;
- distinguish total-company, equity-holder, and per-share quantities;
- account for weighted-average shares, dilution, dividends, and buybacks;
- bridge equity value to enterprise value without mixing claim holders;
- calculate and interpret P/E and other multiples with matched denominators;
- recognize when a ratio is undefined, misleading, incomparable, or
  underdetermined;
- reconcile reported and adjusted measures without assuming adjustments are
  inherently valid or invalid;
- compare periods, segments, scenarios, and fictional peers on a common basis;
- trace a headline claim to statements, notes, assumptions, and calculations;
- express conclusions conditionally rather than converting one metric into a
  buy/sell recommendation.

The app trains company-analysis mechanics and evidence discipline. It does not
predict security returns or teach that accounting quality, business quality,
valuation, risk, and expected return are interchangeable.

### Relationship to neighboring Practice Lab topics

- **Accounting & Bookkeeping** owns transaction recognition, journal entries,
  ledgers, adjustments, and statement preparation from records.
- **Everyday Economics** owns consumer arithmetic, compound interest, inflation,
  and simple expected value.
- **Probability & Statistics** owns distributions, estimation, uncertainty, and
  Bayes reasoning.
- **Spreadsheet Practice** owns formula mechanics and spreadsheet workflows.
- **Data Literacy & Chart Reading** owns general chart-scale and visual-claim
  interpretation.

This app begins with generated company disclosures and owns their analytical
reconstruction, comparison, valuation mechanics, and evidence-qualified
interpretation.

### Audience and prerequisites

The audience includes adult beginners, business students, and technically
inclined learners who want to understand company reports and common investment
language.

Prerequisites:

- decimal, percentage, ratio, and signed arithmetic;
- reading small tables and line charts;
- the accounting equation at an intuitive level;
- understanding that a share is a proportional claim, not a guaranteed return.

Learn mode introduces statement terminology and every formula before it is
assessed. No brokerage account, market-data subscription, or accounting course
is required.

### Disclosure, standards, and terminology boundary

Authoritative context includes:

- the [SEC Beginner's Guide to Financial
  Statements](https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements),
  which distinguishes balance sheets, income statements, cash-flow statements,
  and statements of shareholders' equity and emphasizes their interrelation;
- [IAS 33 Earnings per
  Share](https://www.ifrs.org/issued-standards/list-of-standards/ias-33-earnings-per-share.html/),
  which distinguishes basic and diluted EPS and uses a weighted-average share
  denominator;
- the SEC's [Non-GAAP Financial Measures
  guidance](https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures),
  which emphasizes definition, comparable-measure reconciliation, and the
  possibility that similarly titled measures differ;
- [IFRS 18 Presentation and Disclosure in Financial
  Statements](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-18-presentation-and-disclosure-in-financial-statements/),
  effective for annual periods beginning on or after 1 January 2027, which
  introduces defined profit-or-loss subtotals and requirements for
  management-defined performance measures;
- Investor.gov's definition of the [price-earnings
  ratio](https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-pe-ratio)
  as price per share divided by earnings per share.

These sources anchor terminology and cautions. The app does not reproduce a
complete accounting or securities-reporting regime.

Initial fictional profiles:

```text
pl-company-statements-v1
pl-company-cashflow-v1
pl-company-ratios-v1
pl-company-per-share-v1
pl-company-enterprise-value-v1
pl-company-adjustments-v1
pl-company-valuation-scenarios-v1
```

Every instance names its profile. It must not claim that the generated statements
comply with IFRS, US GAAP, Swedish K3, or another real framework.

### Financial and professional-safety boundary

Every exercise and export states:

```text
FICTIONAL EDUCATIONAL COMPANY — NOT INVESTMENT, ACCOUNTING, TAX,
LEGAL, CREDIT, OR VALUATION ADVICE
```

The app must not:

- ingest or rank real securities or current market data in v1;
- recommend buying, selling, holding, shorting, or allocating money;
- produce price targets for real companies;
- imply that a low multiple, high yield, high growth rate, or strong ratio
  guarantees value, safety, quality, or future returns;
- personalize conclusions from age, income, wealth, debt, goals, risk tolerance,
  jurisdiction, or portfolio;
- diagnose fraud, manipulation, insolvency, or misconduct;
- treat accounting estimates or non-GAAP adjustments as deceptive merely
  because they differ from another basis;
- substitute ratio thresholds for industry, lifecycle, accounting-policy,
  capital-intensity, cyclicality, or business-model context;
- present fictional scenario probabilities as forecasts;
- teach leverage, options, derivatives, margin borrowing, short selling, tax
  optimization, or regulated suitability in v1.

The diversification principle may appear in Learn text as a risk boundary, but
portfolio construction belongs to a separate topic. [Investor.gov's
diversification guidance](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/diversify-your-investments)
notes that diversification cannot guarantee against loss even though it can
reduce concentration risk.

### Controlled company model

```text
CompanyAnalysisCase {
  caseId
  companyProfileId
  reportingBasisId
  currencyId
  periodDefinitions[]
  priceObservations[]
  incomeStatements[]
  balanceSheets[]
  cashFlowStatements[]
  equityStatements[]
  shareSchedules[]
  segmentTables[]
  operatingDrivers[]
  debtSchedule?
  adjustmentReconciliations[]
  notes[]
  peerCases[]
  scenarios[]
  claimCards[]
  provenance[]
}
```

All companies are fictional. Default profiles exclude banks, insurers,
broker-dealers, funds, pre-revenue biotechnology, commodity reserves, and other
businesses whose statements or valuation require specialist models.

### Measurement layers

Keep these layers distinct:

```text
Disclosure layer
  reported line items, notes, dates, units, accounting basis

Derived-measure layer
  ratios and bridges calculated from disclosed inputs

Assumption layer
  adjustments, forecasts, scenario drivers, normalization choices

Market layer
  price, shares, market capitalization, enterprise-value bridge

Conclusion layer
  limited statements supported by the prior layers
```

A correct calculation does not make its interpretation universal. A market
multiple combines company data with a price at a stated date. A forecast is an
assumption, not a reported fact.

### Normative quantitative model

#### Exact values, units, and periods

- Semantic money, shares, rates, and ratios use exact decimal or rational
  arithmetic.
- Every table declares currency, scale (`units`, `thousands`, or `millions`),
  period, duration, and whether values are reported, adjusted, or scenario.
- Flow measures cover a period; balance-sheet values are measured at a date.
- Average balance is `(opening + closing) / 2` unless a displayed profile uses
  a supplied monthly average.
- Annual day ratios use the displayed `daysInPeriod`, normally `365`; quarterly
  cases use their actual supplied days.
- Percent changes use the earlier positive magnitude as denominator. If a
  denominator is zero or sign-changing, the app asks for an absolute change or
  a structured `not meaningful`, never a conventional growth percentage.
- Intermediate calculations are exact. Round only the requested result, normally
  to one decimal for percentages/multiples and two decimals for per-share values.

#### Simplified statement identities

```text
revenue - costOfRevenue = grossProfit
grossProfit - operatingExpenses = operatingProfit
operatingProfit + nonOperatingIncome - interest - tax = netIncome

assets = liabilities + shareholdersEquity

openingCash + CFO + CFI + CFF + FXorOtherCashEffect = closingCash

openingRetainedEarnings + attributableNetIncome
  - dividends + declaredOtherChanges = closingRetainedEarnings
```

The generator supplies any additional line needed by an identity. It never
silently treats EBITDA, operating profit, EBIT, and net income as synonyms.

#### Ratio registry

Every derived measure has a versioned definition object:

```text
MeasureDefinition {
  measureId
  label
  numeratorExpression
  denominatorExpression
  periodBasis
  averagingConvention
  signPolicy
  unit
  rounding
  sourceIds[]
  limitations[]
}
```

Core definitions include:

```text
growth = (current - prior) / prior
grossMargin = grossProfit / revenue
operatingMargin = operatingProfit / revenue
netMargin = attributableNetIncome / revenue

workingCapital = currentAssets - currentLiabilities
currentRatio = currentAssets / currentLiabilities
quickRatio = (cash + shortTermInvestments + receivables) / currentLiabilities

inventoryTurnover = costOfRevenue / averageInventory
DIO = averageInventory / costOfRevenue * daysInPeriod
DSO = averageReceivables / revenue * daysInPeriod
DPO = averagePayables / purchases * daysInPeriod
cashConversionCycle = DIO + DSO - DPO

freeCashFlow_pl_v1 = cashFromOperations - cashCapitalExpenditure
cashConversion = cashFromOperations / netIncome
accrualRatio_pl_v1 = (netIncome - cashFromOperations) / averageTotalAssets

assetTurnover = revenue / averageTotalAssets
ROA_pl_v1 = netIncome / averageTotalAssets
ROE_pl_v1 = attributableNetIncome / averageCommonEquity
NOPAT_pl_v1 = operatingProfit * (1 - suppliedNormalizedTaxRate)
investedCapital_pl_v1 = interestBearingDebt + commonEquity - excessCash
ROIC_pl_v1 = NOPAT / averageInvestedCapital

basicEPS = incomeAvailableToCommon / weightedAverageBasicShares
marketCapitalization = pricePerShare * currentSharesOutstanding
netDebt = interestBearingDebt - cashAndCashEquivalents
interestCoverage = EBIT / interestExpense

PE = pricePerShare / trailingBasicEPS
earningsYield = trailingBasicEPS / pricePerShare
enterpriseValue = marketCapitalization + debt + preferredEquity
                  + noncontrollingInterest - cash - nonoperatingInvestments
```

`free cash flow`, `NOPAT`, `invested capital`, and adjusted measures are not
universal accounting subtotals. Their profile definitions must always remain
visible.

#### Equity value and enterprise value

Equity-value multiples pair an equity claim with an equity denominator:

```text
P/E, price/book, price/sales (when explicitly chosen)
```

Enterprise-value multiples pair all operating claim holders with a pre-financing
operating denominator:

```text
EV/revenue, EV/EBIT, EV/EBITDA
```

The app flags numerator/denominator mismatch. It does not claim one family is
always superior.

#### Sign and meaningfulness policy

- A ratio with zero denominator is undefined.
- P/E and earnings yield use `not meaningful under this profile` when trailing
  EPS is zero or negative.
- Percentage growth is not meaningful when the base is zero and is specially
  qualified when the sign changes.
- Coverage ratios with nonpositive EBIT require a structured interpretation,
  not a reassuring negative multiple.
- ROE with nonpositive average equity is calculated only in a family explicitly
  about denominator pathology and is not ranked as ordinary performance.
- A high or low ratio is never labeled good/bad without a displayed criterion
  and comparison basis.

### Scope

Included:

- primary-statement orientation, subtotals, and cross-statement reconciliation;
- common-size and period-over-period analysis;
- revenue drivers, growth, mix, gross/operating/net profitability;
- liquidity, working capital, turnover, and operating-cycle measures;
- operating/investing/financing cash flow, simplified indirect CFO, capex, and
  a pinned free-cash-flow definition;
- cash-versus-profit bridges and bounded quality-of-earnings indicators;
- asset efficiency, ROA, ROE, DuPont decomposition, NOPAT, invested capital,
  and ROIC under explicit profiles;
- weighted-average shares, basic/diluted EPS, dilution, dividends, and buybacks;
- debt, net debt, coverage, maturity schedules, and sources/uses;
- market capitalization, enterprise value, P/E, earnings yield, price and EV
  multiples, implied values, and comparability;
- reported-to-adjusted reconciliations, segments, operating drivers, scenarios,
  evidence claims, and integrated audits.

### Exclusions

Excluded:

- real companies, filings, prices, estimates, analyst ratings, news, or screeners;
- personalized investment plans, portfolio allocation, efficient frontiers,
  CAPM/beta, factor models, technical analysis, or trading;
- options, futures, swaps, convertible valuation, short interest, securities
  lending, margin, or cryptoassets;
- full DCF, WACC estimation, cost of equity, terminal-growth recommendations,
  merger models, leveraged buyouts, or credit ratings in v1;
- banks, insurers, funds, regulated utilities, natural-resource reserves, and
  specialist industry accounting;
- inflation, FX translation, tax-law effects, pensions, leases, deferred tax,
  stock-option valuation, complex convertibles, and consolidation mechanics;
- auditing opinions, internal controls, fraud detection, forensic accounting,
  or legal disclosure compliance;
- environmental/social/governance scores and unverified impact claims;
- open-ended prose grading or AI-generated investment theses.

### Global answer conventions

- Ignore surrounding whitespace.
- Numeric answers accept localized separators and the displayed unit/scale.
- Percent answers accept `12.5` or `12.5%` as 12.5 percentage points.
- Multiples accept `8`, `8x`, or localized equivalent.
- Money and share answers must match the requested scale.
- Choices use stable semantic IDs rather than localized labels.
- Negative values require an explicit minus sign or parentheses.
- Structured `undefined`, `not meaningful`, `not comparable`, and `cannot
  determine` answers are distinct and require the correct reason.
- Equivalent arithmetic forms are accepted in formula-construction families.
- A conclusion answer is selected from controlled claims; free-form investment
  prose is not scored.

### Difficulty philosophy

Difficulty increases through:

- moving from one statement to linked statements and notes;
- choosing the correct numerator, denominator, date, and period;
- distinguishing beginning, ending, average, current, and weighted-average
  values;
- separating price, volume, mix, margin, and financing effects;
- reconciling profit to cash and equity value to enterprise value;
- handling negative, zero, or sign-changing denominators;
- comparing periods or peers on a normalized basis;
- tracing adjustments and scenario assumptions;
- identifying underdetermination and multiple defensible interpretations;
- finding an earliest root error in an integrated analysis.

Difficulty must not increase through huge tables, obscure company names,
unrealistic decimals, unstated industry conventions, rapidly changing real data,
tedious long division, or time pressure.

### Shared generation and rejection rules

Every instance must:

- declare company/profile, currency/scale, period/date, statement basis, formula,
  rounding, and requested semantic answer;
- derive all statements, ratios, charts, claims, and distractors from one model;
- retain provenance from each result to its source rows and assumptions;
- use exact arithmetic and an independent oracle;
- provide all data necessary for a unique answer, unless insufficiency is tested;
- accept every equivalent valid structured answer;
- generate misconception-based distractors.

Reject an instance when:

- statement identities fail unintentionally;
- reported, adjusted, forecast, and market values are visually confusable;
- a flow is divided by an unmatched ending balance without declaring that basis;
- a multiple mixes price dates or claim-holder bases;
- rounded displays cannot reproduce the intended answer;
- a ratio is undefined but a finite numeric answer is expected;
- two choices become equal after displayed rounding;
- the result depends on a hidden accounting or industry convention;
- the correct response would amount to investment advice;
- an audit has multiple root defects unless explicitly designed as multi-select;
- a recent structural signature repeats with only names/numbers changed.

## 2. Category: Statement orientation, identities, and linkage

### Category purpose

Train the learner to locate, classify, and reconcile information before
calculating analytical ratios.

### Learn

A balance sheet is a snapshot; income, cash flow, and equity statements cover a
period. Profit is not cash. The statements connect through identities, but one
line may require a note or reconciliation rather than a name match.

### Prerequisites

Accounting equation and signed arithmetic.

### Category boundaries

The app reads completed fictional disclosures. Preparing journal entries belongs
to Accounting & Bookkeeping.

### Common misconceptions

- Treating revenue or cash flow as an ending balance.
- Treating cash as profit.
- Adding values expressed in different scales.
- Assuming every similarly named line has the same definition.
- Forgetting dividends or other changes in an equity bridge.
- Treating a balanced statement as proof every classification is correct.

### Family `statement_scope_identify`

**Task/purpose.** Identify which statement/date/period can answer a supplied
question. **Response/template.** Single choice: `{information_need}` →
`{statement_and_scope}`. **Derivation.** Map semantic fact to statement role and
point/period scope. **Difficulty.** L1 cash balance/revenue; L2 equity change;
L3 note-plus-statement. **Distractors/constraints.** Same words on wrong
statement or wrong period; never ask for unavailable detail. **Feedback.** Show
fact→statement→scope. **Examples.** year-end debt→balance sheet (L1);
cash generated during year→cash flow statement (L2); share-count basis→share
note plus income statement (L3). **Validation.** Fact-source registry.

### Family `stock_flow_distinguish`

**Task/purpose.** Classify a measure as point-in-time stock, period flow, or
derived ratio. **Response/template.** Matching/table. **Derivation.** Lookup
measurement type. **Difficulty.** L1 assets/revenue; L2 average inventory;
L3 market price versus trailing EPS. **Distractors/constraints.** Snapshot/flow
word associations. **Feedback.** Display timeline. **Examples.** cash balance→
stock (L1); annual capex→flow (L2); current price/trailing EPS→mixed-date ratio
(L3). **Validation.** Type schema.

### Family `statement_line_classify`

**Task/purpose.** Place supplied line items on the correct statement and section.
**Response/template.** Drag/matching. **Derivation.** Resolve controlled line-item
IDs. **Difficulty.** L1 revenue/debt; L2 depreciation/capex; L3 dividends and
noncash share compensation. **Distractors/constraints.** Same economic event on
several statements; require exact line meaning. **Feedback.** Explain what the
line measures. **Examples.** inventory→balance sheet current asset (L1);
capex cash payment→investing cash flow (L2); stock compensation expense/add-back
appear in different contexts (L3). **Validation.** Profile registry.

### Family `accounting_equation_reconcile`

**Task/purpose.** Find a missing asset, liability, or equity total.
**Response/template.** Money field/table cell. **Derivation.** Apply
`assets=liabilities+equity`. **Difficulty.** L1 one total; L2 classified
subtotals; L3 scaled units/contra balance. **Distractors/constraints.** Sign or
scale errors; equation balance does not validate classifications. **Feedback.**
Show substituted equation. **Examples.** A=120,L=70→E=50 (L1); current/noncurrent
sum (L2); treasury/contra equity supplied (L3). **Validation.** Exact identity.

### Family `income_statement_subtotal`

**Task/purpose.** Reconstruct a missing gross, operating, pretax, or net-profit
subtotal. **Response/template.** Money field/ordered bridge. **Derivation.**
Evaluate pinned income-statement AST. **Difficulty.** L1 gross profit; L2
operating profit; L3 signed nonoperating items and tax. **Distractors/constraints.**
Revenue/cost sign, EBITDA/operating-profit conflation. **Feedback.** Waterfall.
**Examples.** 100−60=40 gross profit (L1); 40−25=15 operating profit (L2);
15+2−4−3=10 net income (L3). **Validation.** AST and identity.

### Family `cash_rollforward_reconcile`

**Task/purpose.** Reconcile opening cash, cash-flow sections, other cash effects,
and closing cash. **Response/template.** Missing amount/section. **Derivation.**
Evaluate cash rollforward. **Difficulty.** L1 CFO/CFI/CFF; L2 missing section;
L3 supplied FX/other effect. **Distractors/constraints.** Treat outflows as
positive or omit opening cash. **Feedback.** Signed bridge. **Examples.**
20+8−5+2=25 (L1); solve missing CFF (L2); include −1 FX effect (L3).
**Validation.** Closing cash equals balance sheet.

### Family `retained_earnings_bridge`

**Task/purpose.** Reconstruct retained earnings from opening balance, attributable
income, distributions, and supplied changes. **Response/template.** Money field/
bridge. **Derivation.** Evaluate declared equity rollforward. **Difficulty.**
L1 income/dividend; L2 loss; L3 prior adjustment/other change. **Distractors/constraints.**
Add dividends, use total comprehensive income when not requested. **Feedback.**
Signed equity bridge. **Examples.** 30+8−3=35 (L1); loss reduces balance (L2);
declared adjustment included (L3). **Validation.** Equity statement tie-out.

### Family `three_statement_link_audit`

**Task/purpose.** Find one root inconsistency across income, balance, cash-flow,
and equity statements. **Response/template.** Root row, evidence, correction.
**Derivation.** Test all profile identities and provenance in dependency order.
**Difficulty.** L2 direct mismatch; L3 one stale linked row; L4 downstream
differences. **Distractors/constraints.** Exactly one root mutation; downstream
symptoms are not accepted as root. **Feedback.** Highlight dependency path.
**Examples.** closing cash mismatch (L2); net income copied incorrectly to equity
(L3); corrected CFO fixes cash and ratio (L4). **Validation.** Fault manifest.

### Cross-family progression

Statement scope and stock/flow typing precede line placement. Single-statement
identities precede cross-statement links. Audits combine them only after direct
reconciliation is reliable.

## 3. Category: Revenue, growth, mix, and profitability

### Category purpose

Train decomposition of operating performance into volume, price, mix, cost, and
margin rather than treating revenue growth as profit growth.

### Learn

Revenue can be generated by units times price or by other explicitly declared
drivers. Gross, operating, and net margins answer different questions. Growth
is a rate relative to a valid base; margin change is measured in percentage
points.

### Prerequisites

Category 2 and percentage arithmetic.

### Category boundaries

No forecasting from historical patterns unless a scenario supplies assumptions.
Industry-specific KPIs are defined locally.

### Common misconceptions

- Adding percentage growth rates across periods.
- Confusing percent change with percentage-point change.
- Using revenue instead of gross profit in a margin numerator.
- Treating gross, operating, EBITDA, and net margin as synonyms.
- Inferring pricing power from revenue growth without volume/mix evidence.
- Calling a smaller loss a positive growth rate.

### Family `revenue_driver_compute`

**Task/purpose.** Compute revenue or a missing price/volume driver.
**Response/template.** Money/count/rate field. **Derivation.** Evaluate the
displayed driver equation, such as `units×averagePrice`. **Difficulty.** L1
forward; L2 inverse; L3 two products/retention-adjusted users.
**Distractors/constraints.** Unit/period mismatch, add instead of multiply;
driver equation is always shown. **Feedback.** Driver tree with units.
**Examples.** 2,000×5=10,000 (L1); revenue/units→price (L2); two-product sum
(L3). **Validation.** Dimensional AST.

### Family `revenue_mix_weight`

**Task/purpose.** Compute segment/product contribution or weighted average price/
growth. **Response/template.** Percent/money fields. **Derivation.** Sum component
revenue and divide each by total or use base-period weights as declared.
**Difficulty.** L1 contribution; L2 weighted price; L3 mix shift with unchanged
component margins. **Distractors/constraints.** Average percentages unweighted;
weights must share a basis. **Feedback.** Contribution table. **Examples.**
30/100=30% mix (L1); weighted price 7.20 (L2); high-margin mix raises total
margin (L3). **Validation.** Weights sum to 1.

### Family `growth_rate`

**Task/purpose.** Calculate valid period-over-period growth or identify why it is
not meaningful. **Response/template.** Percent/structured status. **Derivation.**
`(current-prior)/prior` for positive prior; apply sign policy otherwise.
**Difficulty.** L1 positive growth; L2 decline; L3 zero/sign change.
**Distractors/constraints.** Divide by current, report absolute change as rate.
**Feedback.** Show base explicitly. **Examples.** 100→120=20% (L1);
120→90=−25% (L2); 0→10=`not meaningful` (L3). **Validation.** Sign-policy oracle.

### Family `cagr`

**Task/purpose.** Calculate compound annual growth over an explicit number of
years. **Response/template.** Percent field. **Derivation.**
`(ending/beginning)^(1/years)-1` for positive endpoints. **Difficulty.** L2
two years/friendly root; L3 longer period; L4 compare CAGR with arithmetic
average. **Distractors/constraints.** Divide total growth by years, off-by-one
period count; endpoints and elapsed years shown. **Feedback.** Compound factor.
**Examples.** 100→121 over 2 years=10% (L2); 80→125 over 4 years (L3);
volatile path same endpoints/same CAGR (L4). **Validation.** Recompound answer.

### Family `gross_profit_margin`

**Task/purpose.** Reconstruct gross profit and gross margin.
**Response/template.** Money plus percent fields. **Derivation.**
`revenue-costOfRevenue`; divide by revenue. **Difficulty.** L1 direct; L2 missing
cost; L3 product-mix bridge. **Distractors/constraints.** Cost/revenue, markup
on cost, operating expenses included. **Feedback.** Profit staircase.
**Examples.** 100−60=40 and 40% (L1); infer COGS at 35% margin (L2);
mix-weighted margin (L3). **Validation.** Statement identity.

### Family `operating_profit_margin`

**Task/purpose.** Calculate operating profit/margin from the pinned subtotal.
**Response/template.** Money/percent. **Derivation.** Use declared operating
income before financing/tax; divide by revenue. **Difficulty.** L1 direct line;
L2 reconstruct; L3 compare after reclassification supplied by profile.
**Distractors/constraints.** Use EBITDA or net income, omit operating expense.
**Feedback.** Mark included rows. **Examples.** 15/100=15% (L1);
gross profit−opex (L2); same economics/different displayed classification (L3).
**Validation.** Measure-definition registry.

### Family `net_margin`

**Task/purpose.** Calculate attributable net margin and explain its layer.
**Response/template.** Percent/controlled interpretation. **Derivation.**
`incomeAvailableToCommon/revenue` under the case profile. **Difficulty.** L1
direct; L2 interest/tax bridge; L3 noncontrolling/preferred allocation supplied.
**Distractors/constraints.** Operating profit numerator, total rather than
attributable income. **Feedback.** Walk from operating to common income.
**Examples.** 8/100=8% (L1); interest lowers net not operating margin (L2);
attribution adjustment (L3). **Validation.** Claim-holder match.

### Family `operating_leverage_scenario`

**Task/purpose.** Recalculate profit when volume/revenue changes under supplied
variable and fixed costs. **Response/template.** Scenario profit/margin.
**Derivation.** Apply explicit unit contribution and fixed-cost equations.
**Difficulty.** L2 one product; L3 price/volume change; L4 mix plus step-fixed
cost. **Distractors/constraints.** Scale all costs with revenue, keep variable
cost total fixed. **Feedback.** Contribution bridge. **Examples.** +10 units
adds contribution (L2); price decline offsets volume (L3); capacity step cost
(L4). **Validation.** Scenario AST; not a forecast.

### Family `profitability_bridge_audit`

**Task/purpose.** Diagnose one error in revenue-growth or margin analysis.
**Response/template.** Root calculation/claim and correction. **Derivation.**
Replay driver, growth, subtotal, and margin trees. **Difficulty.** L2 wrong base;
L3 mix versus margin; L4 reported/adjusted basis mismatch.
**Distractors/constraints.** One root fault, balanced downstream arithmetic.
**Feedback.** Corrected waterfall. **Examples.** current-year denominator (L2);
percentage points called percent (L3); adjusted numerator/reported revenue (L4).
**Validation.** Fault manifest.

### Cross-family progression

Driver arithmetic and one-period growth precede CAGR. Gross margin precedes
operating and net margin. Scenario operating leverage follows historical
reconstruction; audits interleave only after the bases are stable.

## 4. Category: Balance-sheet liquidity and working-capital efficiency

### Category purpose

Train reasoning about short-term resources, obligations, and operating-cycle
capital while keeping liquidity distinct from profitability.

### Learn

Working capital is a difference; current and quick ratios are relative measures.
Turnover uses a period flow divided by an average balance. Days measures translate
turnover into time, but their interpretation depends on the business and period.

### Prerequisites

Categories 2–3 and averages.

### Category boundaries

No credit rating or insolvency prediction. Default cases are nonfinancial
operating companies.

### Common misconceptions

- Treating working capital and current ratio as the same measure.
- Including inventory in the quick ratio under this profile.
- Using closing inventory rather than the declared average.
- Using revenue instead of cost of revenue for inventory turnover.
- Using cost of revenue rather than purchases for payable days.
- Assuming a shorter or longer cash cycle is universally better.

### Family `working_capital`

**Task/purpose.** Calculate working capital or a missing current balance.
**Response/template.** Money field. **Derivation.**
`currentAssets-currentLiabilities`. **Difficulty.** L1 direct; L2 missing item;
L3 classify supplied balances first. **Distractors/constraints.** Ratio instead
of difference, include noncurrent items. **Feedback.** Classified balance bridge.
**Examples.** 80−50=30 (L1); solve missing current liabilities (L2);
exclude long-term debt (L3). **Validation.** Balance classification.

### Family `current_ratio`

**Task/purpose.** Calculate or invert current ratio.
**Response/template.** Multiple/money field. **Derivation.**
`currentAssets/currentLiabilities`. **Difficulty.** L1 direct; L2 missing
balance; L3 compare same working capital/different ratios.
**Distractors/constraints.** Subtract, reverse denominator, percent formatting.
**Feedback.** State `x of current assets per 1 of current liabilities`.
**Examples.** 80/40=2.0x (L1); ratio and liabilities→assets (L2);
scale changes interpretation (L3). **Validation.** Exact ratio.

### Family `quick_ratio`

**Task/purpose.** Calculate quick ratio under the displayed component profile.
**Response/template.** Multiple field. **Derivation.** Sum named quick assets and
divide by current liabilities. **Difficulty.** L1 cash+receivables; L2
short-term investments; L3 compare with current ratio.
**Distractors/constraints.** Include inventory/prepaids despite legend; definition
always visible. **Feedback.** Included/excluded ledger. **Examples.**
(10+30)/40=1.0x (L1); include supplied investments (L2); inventory explains gap
(L3). **Validation.** Profile component registry.

### Family `net_working_capital_change`

**Task/purpose.** Calculate the period change in operating working capital and
its directional cash effect. **Response/template.** Money plus source/use choice.
**Derivation.** Compute declared operating current assets minus operating current
liabilities at both dates; change; under indirect CFO an increase is a cash use.
**Difficulty.** L2 one component; L3 several components; L4 distinguish cash/
debt exclusions. **Distractors/constraints.** Reverse liability sign, include
cash or borrowings contrary to profile. **Feedback.** Opening→closing bridge.
**Examples.** receivable +5→cash use 5 (L2); payable +3→cash source 3 (L3);
net components (L4). **Validation.** CFO bridge tie.

### Family `inventory_turnover_days`

**Task/purpose.** Calculate inventory turnover and/or DIO.
**Response/template.** Multiple/days fields. **Derivation.** Use cost of revenue
and average inventory; invert and multiply by period days for DIO.
**Difficulty.** L1 supplied average; L2 calculate average; L3 period-length or
zero-balance exception. **Distractors/constraints.** Revenue numerator, ending
inventory, multiply rather than divide. **Feedback.** Units cancellation.
**Examples.** COGS 120/avg 30=4x (L1); 365/4=91.25 days (L2);
180-day period basis (L3). **Validation.** Reciprocal identity.

### Family `receivable_days`

**Task/purpose.** Calculate DSO from revenue and average receivables.
**Response/template.** Days field. **Derivation.**
`averageReceivables/revenue*daysInPeriod`. **Difficulty.** L1 supplied average;
L2 opening/closing; L3 credit-revenue subset explicitly supplied.
**Distractors/constraints.** End balance, COGS denominator, 365 for nonannual
period. **Feedback.** Flow-to-average-balance timeline. **Examples.**
10/100×365=36.5 days (L1); average first (L2); credit sales basis (L3).
**Validation.** Basis and period match.

### Family `payable_days`

**Task/purpose.** Calculate DPO using supplied purchases and average payables.
**Response/template.** Days field. **Derivation.**
`averagePayables/purchases*daysInPeriod`. **Difficulty.** L1 purchases given;
L2 derive purchases from COGS and inventory change; L3 declared payable subset.
**Distractors/constraints.** Use COGS automatically, reverse ratio. **Feedback.**
Show purchases bridge before DPO. **Examples.** 20/100×365=73 days (L1);
purchases=COGS+ending−opening inventory (L2); trade-payables subset (L3).
**Validation.** Purchases identity.

### Family `cash_conversion_cycle`

**Task/purpose.** Combine DIO, DSO, and DPO into the pinned cash-conversion cycle.
**Response/template.** Days field/contribution table. **Derivation.**
`DIO+DSO-DPO`. **Difficulty.** L1 components given; L2 derive one; L3 compare
drivers between periods. **Distractors/constraints.** Add DPO, confuse turnover
with days; no universal good/bad conclusion. **Feedback.** Signed timeline.
**Examples.** 60+30−45=45 days (L1); derive DSO (L2); inventory drives increase
(L3). **Validation.** Exact component reconciliation.

### Family `liquidity_working_capital_audit`

**Task/purpose.** Find one root error or unsupported conclusion in a liquidity/
working-capital analysis. **Response/template.** Root, correction, limited claim.
**Derivation.** Replay classifications, averages, flow bases, period days, and
formulas. **Difficulty.** L2 formula; L3 average/basis; L4 cross-period claim.
**Distractors/constraints.** Exactly one root; never accept “company is safe”
from one ratio. **Feedback.** Corrected metric table. **Examples.** inventory in
quick ratio (L2); ending rather than average balance (L3); different period days
(L4). **Validation.** Fault manifest.

### Cross-family progression

Working capital, current ratio, and quick ratio begin separately. Average-balance
turnover precedes days and the combined cash cycle. Cash-flow effects connect
this category to Category 5 only after the balance mechanics are secure.

## 5. Category: Cash flow, reinvestment, and profit-to-cash reasoning

### Category purpose

Train reconstruction of cash generation and uses, especially the differences
between accrual profit, operating cash flow, capital expenditure, financing, and
profile-defined free cash flow.

### Learn

Net income includes accruals and noncash expenses. The indirect cash-flow method
starts from profit, reverses noncash items, and incorporates operating
working-capital changes. Capital expenditure is an investing cash outflow.
“Free cash flow” has no meaning here without its displayed definition.

### Prerequisites

Categories 2 and 4.

### Category boundaries

No real-company cash-quality verdict, bankruptcy forecast, or specialist cash
classification dispute. The cash-flow profile resolves classifications.

### Common misconceptions

- Treating net income as cash generated.
- Adding back a noncash expense and also removing it from net income first.
- Reversing the cash effect of receivable, inventory, or payable changes.
- Treating all investing outflows as operating costs.
- Treating financing inflows as revenue.
- Assuming positive free cash flow is always preferable to reinvestment.

### Family `cash_flow_activity_classify`

**Task/purpose.** Classify a generated cash transaction as operating, investing,
financing, noncash, or excluded under the displayed profile.
**Response/template.** Single choice/matching. **Derivation.** Resolve event ID
through the pinned cash-flow classifier. **Difficulty.** L1 customer receipt/
equipment purchase/borrowing; L2 asset sale/dividend; L3 noncash acquisition or
profile-sensitive item explicitly defined. **Distractors/constraints.** Economic
word associations; no unstated IFRS/GAAP differences. **Feedback.** State why
cash moved and which resource/claim changed. **Examples.** customer collection→
CFO (L1); equipment cash purchase→CFI (L1); debt issued for equipment→noncash
disclosure (L3). **Validation.** Event registry.

### Family `cfo_indirect_reconcile`

**Task/purpose.** Reconcile net income to cash from operations or solve a missing
adjustment. **Response/template.** Signed bridge/money field. **Derivation.**
Start with net income; add noncash expenses/losses, subtract noncash gains, and
apply declared operating-asset/liability changes with exact signs.
**Difficulty.** L1 depreciation; L2 working capital; L3 gains plus several
changes. **Distractors/constraints.** Reverse asset/liability effects, count
cash capex in CFO. **Feedback.** Row-by-row bridge. **Examples.** NI 10 + D&A 3
=13 (L1); receivables +2→11 (L2); gain and working-capital bridge (L3).
**Validation.** Independent direct cash-event oracle.

### Family `capex_cash_flow`

**Task/purpose.** Identify or reconstruct cash capital expenditure from investing
rows and asset-disposal data. **Response/template.** Money/classification.
**Derivation.** Sum declared cash purchases of long-lived operating assets;
separate sale proceeds and noncash acquisitions. **Difficulty.** L1 one purchase;
L2 gross purchase versus net investing flow; L3 asset rollforward support.
**Distractors/constraints.** Use depreciation, net capex against sale proceeds,
include acquisition paid in shares. **Feedback.** Investing cash ledger.
**Examples.** equipment purchase 12→capex 12 (L1); purchase 20/sale proceeds 4
still gross capex 20 (L2); noncash asset excluded (L3). **Validation.** Cash-event
provenance.

### Family `free_cash_flow_profile`

**Task/purpose.** Calculate or compare free cash flow under an explicitly named
definition. **Response/template.** Money field/choice. **Derivation.** Default
`CFO-cashCapex`; alternate definitions only through a displayed AST.
**Difficulty.** L1 direct; L2 reconstruct CFO/capex; L3 compare two definitions.
**Distractors/constraints.** Net income−capex, EBITDA−capex, hide definition.
**Feedback.** Show formula label and reconciliation. **Examples.** CFO 30−capex
12=18 (L1); derive gross capex (L2); lease/payment inclusion changes profile
(L3). **Validation.** Definition-version oracle.

### Family `cash_conversion_ratio`

**Task/purpose.** Calculate CFO/net-income conversion and interpret it narrowly.
**Response/template.** Multiple plus controlled claim. **Derivation.**
`CFO/netIncome` when net income is positive; otherwise apply meaningfulness
policy. **Difficulty.** L1 direct; L2 compare periods; L3 loss/near-zero
denominator. **Distractors/constraints.** Reverse ratio, declare quality from one
period. **Feedback.** Profit-to-cash bridge and limitations. **Examples.**
12/10=1.2x (L1); working capital explains fall (L2); loss→not ordinary conversion
metric (L3). **Validation.** Sign policy.

### Family `accrual_ratio`

**Task/purpose.** Calculate the pinned accrual ratio and identify its arithmetic
driver. **Response/template.** Percent/driver choice. **Derivation.**
`(netIncome-CFO)/averageTotalAssets`. **Difficulty.** L2 direct; L3 average
assets; L4 compare with different asset bases. **Distractors/constraints.**
`CFO-NI`, ending assets, universal earnings-quality cutoff. **Feedback.** Numerator
bridge and denominator basis. **Examples.** (10−8)/100=2% (L2); calculate
average assets (L3); normalized basis needed (L4). **Validation.** Profile AST.

### Family `cash_profit_divergence`

**Task/purpose.** Attribute a supplied profit/CFO difference to noncash items and
working-capital movements. **Response/template.** Matching/contribution table.
**Derivation.** Use exact indirect-CFO contributions. **Difficulty.** L2 one
driver; L3 competing offsets; L4 reported versus normalized period.
**Distractors/constraints.** Infer motive or permanence, confuse cash capex with
CFO. **Feedback.** Ranked signed contributors. **Examples.** receivables build
(L2); depreciation offsets inventory use (L3); one-time settlement disclosed
(L4). **Validation.** Contributions sum to difference.

### Family `cash_runway_scenario`

**Task/purpose.** Calculate a mechanical runway under a supplied constant or
staged net-cash-use scenario. **Response/template.** Period count/remainder.
**Derivation.** Divide opening available cash by scenario cash use or simulate
declared stages exactly. **Difficulty.** L2 constant burn; L3 minimum-cash floor;
L4 changing burn/financing event. **Distractors/constraints.** Not a solvency
forecast; no fractional period unless allowed. **Feedback.** Cash schedule.
**Examples.** 24 cash/3 monthly use=8 months (L2); keep 6 minimum→6 months
(L3); staged plan (L4). **Validation.** Period simulation.

### Family `cash_flow_audit`

**Task/purpose.** Diagnose one classification, sign, reconciliation, definition,
or conclusion error in cash-flow analysis. **Response/template.** Root/correction/
limited conclusion. **Derivation.** Replay cash-event and ratio provenance.
**Difficulty.** L2 CFO sign; L3 capex/FCF; L4 adjustment-basis mismatch.
**Distractors/constraints.** Exactly one root; financing cash must not be called
operating performance. **Feedback.** Correct cash bridge. **Examples.**
inventory increase added (L2); asset-sale proceeds netted from capex (L3);
reported CFO with adjusted NI (L4). **Validation.** Fault manifest.

### Cross-family progression

Classification precedes indirect reconciliation. Capex precedes free cash flow.
Conversion and accrual ratios follow the cash bridge, while divergence and
runway questions require interpretation of their limited scenario basis.

## 6. Category: Returns, efficiency, and invested-capital reasoning

### Category purpose

Train matched flow-to-capital comparisons and decomposition of returns without
turning accounting returns into expected market returns.

### Learn

Return ratios combine a period result with capital employed during that period,
so average balances are normally more coherent than an unmatched ending balance.
ROA, ROE, and ROIC answer different claim-holder questions. High ROE may reflect
margin, asset efficiency, leverage, or a small equity denominator.

### Prerequisites

Categories 2–5.

### Category boundaries

These are accounting return measures, not total shareholder return, internal
rate of return, cost of capital, or a buy/sell rule.

### Common misconceptions

- Dividing by an ending balance without checking the convention.
- Calling ROE the return an investor earned in the market.
- Comparing ROA and ROE as though their numerators and claim holders match.
- Treating leverage-driven ROE as improved operating performance.
- Mixing EBIT, net income, and NOPAT.
- Subtracting all cash rather than displayed excess cash from invested capital.

### Family `average_balance`

**Task/purpose.** Calculate the correct average capital or operating balance for
a period. **Response/template.** Money field/selection. **Derivation.** Apply the
declared average convention. **Difficulty.** L1 opening/closing; L2 monthly
values; L3 acquisition midperiod with supplied weighted schedule.
**Distractors/constraints.** Ending balance, unweighted average of unequal
durations. **Feedback.** Timeline weights. **Examples.** (80+120)/2=100 (L1);
12-month average (L2); weighted midyear capital (L3). **Validation.** Weight sum.

### Family `asset_turnover`

**Task/purpose.** Calculate revenue generated per unit of average assets.
**Response/template.** Multiple. **Derivation.**
`revenue/averageTotalAssets`. **Difficulty.** L1 average supplied; L2 derive
average; L3 compare asset-light/capital-intensive fictional profiles.
**Distractors/constraints.** Ending assets, invert, label higher universally
better. **Feedback.** State units and context. **Examples.** 200/100=2x (L1);
opening/closing average (L2); same margin/different turnover (L3).
**Validation.** Flow/balance basis.

### Family `roa`

**Task/purpose.** Calculate profile-defined return on assets.
**Response/template.** Percent field. **Derivation.**
`netIncome/averageTotalAssets` under `ROA_pl_v1`. **Difficulty.** L1 direct;
L2 average assets; L3 compare periods with acquisition. **Distractors/constraints.**
Revenue numerator, ending assets, market-return interpretation. **Feedback.**
Numerator/denominator roles. **Examples.** 8/100=8% (L1); calculate average
(L2); acquisition changes basis (L3). **Validation.** Measure registry.

### Family `roe`

**Task/purpose.** Calculate attributable return on average common equity and
detect denominator pathology. **Response/template.** Percent/structured status.
**Derivation.** `incomeAvailableToCommon/averageCommonEquity`.
**Difficulty.** L1 positive equity; L2 attribution; L3 negative/near-zero equity.
**Distractors/constraints.** Total net income, ending equity, high result called
automatically strong. **Feedback.** Equity bridge and limitation. **Examples.**
12/60=20% (L1); subtract preferred allocation (L2); negative average equity→not
ordinary comparison (L3). **Validation.** Claim-holder/sign policy.

### Family `dupont_decompose`

**Task/purpose.** Decompose ROE into net margin, asset turnover, and equity
multiplier or solve a missing component. **Response/template.** Multiple named
fields. **Derivation.**
`NI/revenue × revenue/avgAssets × avgAssets/avgEquity`.
**Difficulty.** L2 forward; L3 inverse; L4 compare driver changes.
**Distractors/constraints.** Add components, use inconsistent averages, confuse
multiplier with debt/equity. **Feedback.** Cancellation chain. **Examples.**
5%×2×2=20% (L2); infer turnover (L3); margin down/leverage up bridge (L4).
**Validation.** Product equals ROE exactly.

### Family `nopat`

**Task/purpose.** Calculate normalized after-tax operating profit under the
displayed pedagogical profile. **Response/template.** Money field.
**Derivation.** `operatingProfit×(1-suppliedNormalizedTaxRate)`.
**Difficulty.** L1 direct; L2 inverse; L3 distinguish reported tax/normalized
rate. **Distractors/constraints.** Use net income, subtract interest twice,
present as accounting subtotal. **Feedback.** Operating-to-NOPAT bridge.
**Examples.** 20×(1−25%)=15 (L1); infer operating profit (L2); reported tax
differs from supplied normalized rate (L3). **Validation.** Profile AST.

### Family `invested_capital`

**Task/purpose.** Build invested capital from operating claim-holder components
under the displayed profile. **Response/template.** Money bridge.
**Derivation.** Default `debt+commonEquity-excessCash`; alternate operating-asset
form only when reconciled. **Difficulty.** L1 direct; L2 distinguish total/excess
cash; L3 reconcile financing and operating forms. **Distractors/constraints.**
Subtract all cash, omit debt, include trade payables inconsistently.
**Feedback.** Sources/uses bridge. **Examples.** 40+80−10=110 (L1); only 6 of
20 cash is excess (L2); two forms reconcile (L3). **Validation.** Definition AST.

### Family `roic`

**Task/purpose.** Calculate profile-defined ROIC and compare its operational
drivers. **Response/template.** Percent/bridge. **Derivation.**
`NOPAT/averageInvestedCapital`. **Difficulty.** L2 components supplied; L3
derive NOPAT/capital; L4 compare periods with a capital addition.
**Distractors/constraints.** Net income numerator, ending capital, compare with
cost of capital not supplied. **Feedback.** Matched operating numerator and
capital base. **Examples.** 15/100=15% (L2); full derivation (L3); new plant
changes denominator timing (L4). **Validation.** Profile and average-basis oracle.

### Family `returns_efficiency_audit`

**Task/purpose.** Diagnose one basis, average, attribution, leverage, or
interpretation error in returns analysis. **Response/template.** Root/correction/
qualified claim. **Derivation.** Replay return definitions and DuPont identities.
**Difficulty.** L2 denominator; L3 claim-holder mismatch; L4 leverage-driven
headline. **Distractors/constraints.** One root; accounting return never becomes
forecast return. **Feedback.** Correct decomposition. **Examples.** closing
assets used (L2); total NI/common equity mismatch (L3); ROE rise entirely from
equity multiplier (L4). **Validation.** Fault manifest.

### Cross-family progression

Average balances precede every return ratio. Asset turnover and margins precede
DuPont. NOPAT and invested capital are learned separately before ROIC. Audits
emphasize matched claim holders and periods.

## 7. Category: Shares, EPS, dilution, dividends, and buybacks

### Category purpose

Train the distinction between total company results, current shares, weighted
average shares, and per-share outcomes.

### Learn

Basic EPS uses income available to common shareholders and weighted-average
basic shares for the period. Market capitalization uses current shares at the
price date. Diluted EPS adds only the explicitly supplied dilutive effects.
Changing share count can change per-share values without changing total profit.

### Prerequisites

Categories 2–3 and weighted averages.

### Category boundaries

No option-pricing model, complex treasury-stock method, legal capital rules, or
claim that buybacks/dividends create value automatically.

### Common misconceptions

- Using ending shares for basic EPS.
- Using total net income when preferred claims are supplied.
- Treating authorization, issuance, and outstanding shares as identical.
- Assuming all potential shares are dilutive.
- Treating a buyback-funded EPS increase as operating growth.
- Confusing dividend payout with dividend yield.

### Family `weighted_average_shares`

**Task/purpose.** Calculate weighted-average basic shares from a dated schedule.
**Response/template.** Share count. **Derivation.** Weight each outstanding-share
level by exact fraction of period; apply declared split retrospectively when the
profile says so. **Difficulty.** L1 one midyear issue; L2 issue plus repurchase;
L3 split and uneven dates. **Distractors/constraints.** Ending shares, simple
average, weight transactions before their date. **Feedback.** Timeline table.
**Examples.** 100 for half-year/120 for half=110 (L1); three intervals (L2);
split-adjusted schedule (L3). **Validation.** Day/month weights sum to period.

### Family `basic_eps`

**Task/purpose.** Calculate basic EPS or a missing numerator/denominator.
**Response/template.** Money per share/share count. **Derivation.**
`incomeAvailableToCommon/weightedAverageBasicShares`. **Difficulty.** L1 direct;
L2 preferred dividend allocation; L3 inverse. **Distractors/constraints.**
Ending shares, revenue, total NI without allocation. **Feedback.** Claim-holder
and time-basis bridge. **Examples.** 12m/6m=2.00 (L1); subtract preferred
dividend (L2); infer weighted shares (L3). **Validation.** IAS-33-inspired
profile identity without compliance claim.

### Family `diluted_eps`

**Task/purpose.** Calculate diluted EPS from explicitly supplied incremental
income and share effects or identify antidilutive instruments.
**Response/template.** Money/share plus include/exclude selections.
**Derivation.** Test each generated instrument under the displayed simplified
method; include effects that reduce EPS/increase loss per share as defined.
**Difficulty.** L2 one simple instrument; L3 two instruments/ordering; L4
loss case. **Distractors/constraints.** Add every potential share, change
denominator without numerator, include antidilutive effect. **Feedback.**
Incremental EPS table. **Examples.** options add 1m shares (L2); convertible adds
after-tax interest and shares (L3); loss case excludes antidilution (L4).
**Validation.** Independent incremental-test enumeration.

### Family `share_count_change`

**Task/purpose.** Reconcile opening and closing shares and distinguish issued,
repurchased, treasury, and weighted-average counts. **Response/template.**
Bridge/matching. **Derivation.** Apply dated share events to each relevant count.
**Difficulty.** L1 issuance/repurchase; L2 treasury shares; L3 split versus
economic issuance. **Distractors/constraints.** Authorized equals outstanding,
weighted average equals closing. **Feedback.** Share-count timeline.
**Examples.** 100+20−5=115 closing (L1); treasury shares excluded (L2); split
restates per-share history (L3). **Validation.** Event ledger.

### Family `market_cap`

**Task/purpose.** Calculate equity market capitalization at a stated price date.
**Response/template.** Money/share-price field. **Derivation.**
`pricePerShare×currentSharesOutstanding` at the same timestamp.
**Difficulty.** L1 direct; L2 unit scales; L3 distinguish basic/diluted/current
shares. **Distractors/constraints.** Weighted-average shares, enterprise value,
price from another date. **Feedback.** Timestamped units. **Examples.**
10×5m=50m (L1); thousands/millions scale (L2); current versus EPS denominator
(L3). **Validation.** Date/scale match.

### Family `dividend_payout_yield`

**Task/purpose.** Calculate dividends per share, payout ratio, or dividend yield
under displayed definitions. **Response/template.** Money/percent fields.
**Derivation.** `DPS=commonDividends/currentEligibleShares` or supplied schedule;
`payout=DPS/EPS`; `yield=DPS/price`. **Difficulty.** L1 DPS/yield; L2 payout;
L3 changing shares/special dividend. **Distractors/constraints.** Yield=payout,
use total dividends as per-share, call yield total return. **Feedback.** Three
distinct denominators. **Examples.** DPS 1/price 20=5% yield (L1);
1/2 EPS=50% payout (L2); special component disclosed (L3). **Validation.**
Definition registry.

### Family `buyback_share_impact`

**Task/purpose.** Calculate mechanical share/EPS or cash/debt effects of a
fictional repurchase scenario. **Response/template.** Before/after fields.
**Derivation.** Shares repurchased=`cashSpent/repurchasePrice`; update supplied
cash/debt and scenario EPS with stated profit assumption. **Difficulty.** L2
constant profit; L3 interest effect from debt funding; L4 compare total versus
per-share results. **Distractors/constraints.** Treat cash spent as expense,
assume value creation, ignore financing cost. **Feedback.** sources/uses and
per-share bridge. **Examples.** 10 cash/10 price=1 share (L2); EPS rises with
unchanged NI (L3); debt interest offsets benefit (L4). **Validation.** Scenario
ledger; never a recommendation.

### Family `per_share_audit`

**Task/purpose.** Diagnose one share-date, weighting, attribution, dilution,
dividend, or buyback error. **Response/template.** Root/correction/limited claim.
**Derivation.** Replay share event and per-share schedules. **Difficulty.** L2
ending-versus-weighted; L3 dilution; L4 EPS-growth attribution.
**Distractors/constraints.** One root; per-share growth must not be called
operating growth automatically. **Feedback.** Correct share bridge. **Examples.**
closing shares used for EPS (L2); antidilutive shares included (L3); buyback
explains EPS growth despite flat NI (L4). **Validation.** Fault manifest.

### Cross-family progression

Weighted-average shares precede EPS. Basic EPS precedes dilution. Current shares
then connect price to market capitalization. Dividends and buybacks follow only
after total-versus-per-share distinctions are reliable.

## 8. Category: Debt, coverage, capital structure, and funding

### Category purpose

Train reconstruction of financing claims and their mechanical effects on
liquidity, coverage, and equity returns.

### Learn

Debt is a contractual financing claim; trade payables are operating liabilities
under the default analytical profile. Net debt subtracts only declared cash and
cash equivalents. Coverage compares a period earnings measure with a period
financing cost. Maturity timing can matter even when total debt is unchanged.

### Prerequisites

Categories 2, 5, and 6.

### Category boundaries

No covenant compliance, credit rating, refinancing prediction, insolvency
opinion, or bank/insurer capital analysis.

### Common misconceptions

- Calling every liability debt.
- Subtracting receivables or restricted cash from debt without a definition.
- Mixing gross debt and net debt between periods or peers.
- Treating negative coverage as reassuring because its absolute magnitude is
  large.
- Using EBITDA and EBIT interchangeably.
- Assuming debt is inherently good or bad.

### Family `debt_classify`

**Task/purpose.** Classify supplied obligations as interest-bearing debt,
operating liability, equity-like claim, or excluded item under the profile.
**Response/template.** Matching/multi-select. **Derivation.** Resolve obligation
IDs through the capital-structure registry. **Difficulty.** L1 loan/payable; L2
lease/preferred claim explicitly defined; L3 restricted/nonrecourse item.
**Distractors/constraints.** Name-based classification; profile always declares
borderline treatment. **Feedback.** State claim holder and measure inclusion.
**Examples.** bank loan→debt (L1); accounts payable→operating liability (L1);
preferred claim included in EV bridge, not common debt (L2). **Validation.**
Classification registry.

### Family `net_debt`

**Task/purpose.** Calculate gross debt, net debt, or net cash under the displayed
definition. **Response/template.** Money/status. **Derivation.** Sum included
debt and subtract included cash/cash equivalents. **Difficulty.** L1 direct;
L2 multiple debt classes; L3 restricted cash/nonoperating investment bridge.
**Distractors/constraints.** Subtract all liquid-looking assets, reverse net
cash sign. **Feedback.** Component bridge. **Examples.** debt 50−cash 20=30 net
debt (L1); several notes (L2); debt 20/cash 30→net cash 10 (L3).
**Validation.** Inclusion-profile AST.

### Family `debt_to_equity`

**Task/purpose.** Calculate debt-to-equity under an explicit gross/net and
book/market basis. **Response/template.** Multiple/structured comparison.
**Derivation.** Divide declared debt measure by declared equity measure.
**Difficulty.** L1 gross/book; L2 net debt; L3 compare basis changes or
nonpositive equity. **Distractors/constraints.** Liabilities instead of debt,
mix book and market without label, rank negative equity. **Feedback.** Label both
bases. **Examples.** 40/80=0.5x (L1); net-debt/book-equity (L2); negative equity
→not ordinary comparison (L3). **Validation.** Basis/sign policy.

### Family `interest_coverage`

**Task/purpose.** Calculate EBIT/interest coverage and apply the meaningfulness
policy. **Response/template.** Multiple/status. **Derivation.**
`EBIT/interestExpense` for positive interest; qualify nonpositive EBIT.
**Difficulty.** L1 direct; L2 reconstruct EBIT; L3 negative EBIT or capitalized
interest explicitly separated. **Distractors/constraints.** EBITDA numerator,
invert, absolute-value negative result. **Feedback.** Earnings-to-fixed-charge
bridge. **Examples.** EBIT 20/interest 4=5x (L1); derive EBIT (L2);
EBIT −2→coverage indicates operating shortfall, not −0.5x strength (L3).
**Validation.** Sign and numerator profile.

### Family `net_debt_to_ebitda`

**Task/purpose.** Calculate the stated leverage multiple or identify basis
incompatibility. **Response/template.** Multiple/status. **Derivation.** Divide
profile net debt at date by trailing profile EBITDA; apply sign policy.
**Difficulty.** L1 direct; L2 derive EBITDA/net debt; L3 negative EBITDA or
reported/adjusted mismatch. **Distractors/constraints.** Gross debt, EBIT,
forward/trailing mix. **Feedback.** Timestamp and basis table. **Examples.**
30/10=3x (L1); bridge components (L2); adjusted debt/reported EBITDA mismatch
(L3). **Validation.** Basis compatibility.

### Family `debt_maturity_liquidity`

**Task/purpose.** Compare a fictional debt-maturity schedule with explicitly
available liquidity under a bounded scenario. **Response/template.** Period
shortfall/surplus table. **Derivation.** Simulate scheduled maturities, supplied
cash generation, minimum cash, and committed funding without assuming renewal.
**Difficulty.** L2 one maturity; L3 several years; L4 conditional refinancing
scenario. **Distractors/constraints.** Count uncommitted facility, ignore minimum
cash, infer default. **Feedback.** Sources/maturities timeline. **Examples.**
12 liquidity−10 due=2 surplus (L2); staged schedule (L3); refinancing only in
named scenario (L4). **Validation.** Exact period ledger.

### Family `capital_allocation_sources_uses`

**Task/purpose.** Reconcile sources and uses for a generated investment,
acquisition, dividend, buyback, or debt-repayment scenario.
**Response/template.** Sources/uses table and residual cash/debt.
**Derivation.** Apply exact financing ledger; sources equal uses plus residual
change. **Difficulty.** L2 one source/use; L3 mixed cash/debt/equity; L4
transaction fees or minimum cash. **Distractors/constraints.** Treat financing
as revenue, omit balance-sheet effect, double-count capex. **Feedback.** Balanced
transaction bridge. **Examples.** cash funds capex (L2); debt+cash acquisition
(L3); buyback plus financing fee (L4). **Validation.** Ledger balance.

### Family `capital_structure_audit`

**Task/purpose.** Diagnose one debt classification, netting, denominator,
coverage, maturity, or sources/uses error. **Response/template.** Root/correction/
limited conclusion. **Derivation.** Replay capital-structure definitions and
schedules. **Difficulty.** L2 inclusion; L3 basis/date; L4 scenario claim.
**Distractors/constraints.** One root; no solvency or rating conclusion.
**Feedback.** Correct claim-holder bridge. **Examples.** trade payable counted as
debt (L2); restricted cash netted (L3); uncommitted refinancing assumed (L4).
**Validation.** Fault manifest.

### Cross-family progression

Debt classification precedes net debt and leverage. Coverage remains separate
from balance-sheet leverage. Maturities and sources/uses add timing only after
the static capital structure is understood.

## 9. Category: Market value, enterprise value, and valuation multiples

### Category purpose

Train mechanical valuation-language fluency while preserving the distinction
between a calculated multiple and a judgment about expected return.

### Learn

P/E is price per share divided by EPS on a matched basis. Market capitalization
is common-equity value; enterprise value bridges to the value attributable to
all operating capital providers. Multiples are shorthand comparisons, not
complete valuations. Price date, period, accounting basis, growth, risk, and
capital intensity affect comparability.

### Prerequisites

Categories 3, 6, 7, and 8.

### Category boundaries

No real security valuation, target price, DCF/WACC, trading signal, or claim that
a cheaper multiple is necessarily undervalued.

### Common misconceptions

- Reading P/E as a percentage or guaranteed payback period.
- Treating a lower P/E as automatically better.
- Using negative EPS to produce an ordinary negative P/E ranking.
- Calling market capitalization enterprise value.
- Pairing enterprise value with net income or EPS.
- Comparing trailing and forward or reported and adjusted measures silently.
- Applying a peer multiple without matching units and claim-holder basis.

### Family `pe_ratio`

**Task/purpose.** Calculate trailing P/E or identify when it is not meaningful.
**Response/template.** Multiple/status. **Derivation.**
`pricePerShare/trailingBasicEPS` with same share class and declared period.
**Difficulty.** L1 direct positive EPS; L2 derive EPS/market cap basis; L3 zero
or negative EPS. **Distractors/constraints.** EPS/price, percent, use forward or
diluted basis silently. **Feedback.** `price units per 1 earnings unit` plus
limitations. **Examples.** 20/2=10x (L1); equity value/earnings gives same basis
(L2); EPS −1→not meaningful as ordinary P/E (L3). **Validation.** Date/basis/
sign policy.

### Family `earnings_yield`

**Task/purpose.** Calculate earnings yield and connect it algebraically—but not
normatively—to P/E. **Response/template.** Percent/multiple. **Derivation.**
`EPS/price`; for positive values it is reciprocal of P/E.
**Difficulty.** L1 direct; L2 convert from P/E; L3 negative/adjusted basis.
**Distractors/constraints.** Treat as dividend yield or expected return.
**Feedback.** Reciprocal relationship and caveat. **Examples.** 2/20=10% (L1);
P/E 25x→4% (L2); loss yield not ordinary valuation ranking (L3).
**Validation.** Reciprocal invariant.

### Family `price_sales_book`

**Task/purpose.** Calculate price-to-sales or price-to-book on a declared
per-share or aggregate basis. **Response/template.** Multiple/status.
**Derivation.** `marketCap/revenue` or `marketCap/commonBookEquity`; per-share
forms must reconcile. **Difficulty.** L1 P/S; L2 P/B; L3 negative equity or
cross-basis comparison. **Distractors/constraints.** Enterprise value numerator,
total assets as book equity, infer profitability from sales multiple.
**Feedback.** Equity numerator/denominator bridge. **Examples.** 100/50=2x P/S
(L1); 100/40=2.5x P/B (L2); negative book equity→not ordinary P/B comparison
(L3). **Validation.** Aggregate/per-share equivalence.

### Family `enterprise_value_bridge`

**Task/purpose.** Bridge market capitalization to enterprise value or solve a
missing component. **Response/template.** Signed bridge/money field.
**Derivation.** Apply the profile equation including debt, preferred equity,
noncontrolling interest, cash, and nonoperating investments.
**Difficulty.** L1 market cap+debt−cash; L2 preferred/NCI; L3 missing component/
net-cash company. **Distractors/constraints.** Add cash, subtract debt, use book
common equity. **Feedback.** Claim-holder bridge. **Examples.** 100+40−10=130
(L1); add preferred/NCI (L2); solve cash from EV (L3). **Validation.** Exact
bridge and component inclusion.

### Family `ev_operating_multiple`

**Task/purpose.** Calculate EV/revenue, EV/EBIT, or EV/EBITDA under a matched
basis. **Response/template.** Multiple/status. **Derivation.** Divide enterprise
value at price date by declared trailing/forward operating denominator.
**Difficulty.** L1 direct; L2 derive EV/denominator; L3 nonpositive denominator
or basis mismatch. **Distractors/constraints.** Market cap numerator, net income
denominator, mix trailing/forward. **Feedback.** Enterprise claim-holder match.
**Examples.** EV 120/EBITDA 20=6x (L1); derive EV (L2); negative EBIT→not ordinary
EV/EBIT comparison (L3). **Validation.** Basis and sign policy.

### Family `multiple_basis_match`

**Task/purpose.** Match valuation numerators with compatible denominators and
period bases. **Response/template.** Matching/multi-select. **Derivation.**
Compare claim-holder, date, period, reported/adjusted, trailing/forward, and
currency metadata. **Difficulty.** L1 equity versus enterprise; L2 trailing/
forward; L3 adjusted/segment/currency basis. **Distractors/constraints.**
Familiar acronym matching. **Feedback.** Compatibility matrix. **Examples.**
price↔EPS (L1); EV↔EBIT (L1); current EV↔different-date forward EBITDA requires
normalization (L3). **Validation.** Type system.

### Family `negative_denominator_interpret`

**Task/purpose.** Select the correct treatment of zero, negative, or sign-changing
valuation denominators. **Response/template.** Structured status/reason.
**Derivation.** Apply measure-specific sign policy. **Difficulty.** L1 EPS loss;
L2 zero EBIT/book equity; L3 transition from loss to profit.
**Distractors/constraints.** Rank negative multiples as cheaper, take absolute
value, invent growth percentage. **Feedback.** Explain why ordinary ordering
fails. **Examples.** EPS<0→P/E not meaningful (L1); zero EBITDA→undefined
(L2); loss→profit needs absolute bridge (L3). **Validation.** Exhaust sign cases.

### Family `peer_multiple_compare`

**Task/purpose.** Normalize and compare multiples for fictional peers, then
select only conclusions supported by supplied differences. **Response/template.**
Comparison table/controlled claim. **Derivation.** Filter incompatible peers,
normalize displayed bases, and compare exact multiples and disclosed drivers.
**Difficulty.** L2 same basis; L3 growth/margin differences; L4 accounting/
capital-structure mismatch. **Distractors/constraints.** Cheapest=best, ignore
business/profile differences. **Feedback.** Basis and driver matrix.
**Examples.** same-basis P/E ordering (L2); higher multiple with higher supplied
growth (L3); incomparable adjusted/trailing bases (L4). **Validation.** Claim
entailed by case facts only.

### Family `implied_value_from_multiple`

**Task/purpose.** Calculate the mechanical price, equity value, or enterprise
value implied by a supplied hypothetical multiple and denominator.
**Response/template.** Money/bridge. **Derivation.** Multiply exact assumed
multiple by matched denominator, then perform EV↔equity bridge if required.
**Difficulty.** L2 P/E→price; L3 EV multiple→equity; L4 range/scenario.
**Distractors/constraints.** Treat assumed multiple as recommendation, omit net
debt, mismatched units. **Feedback.** Assumption→aggregate value→per-share bridge.
**Examples.** 12x×EPS 2=24 price (L2); 6x EBITDA→EV then equity (L3); multiple
range creates value range (L4). **Validation.** Reverse-multiple identity; label
hypothetical.

### Family `valuation_multiple_audit`

**Task/purpose.** Diagnose one date, basis, claim-holder, sign, normalization, or
interpretation error in a multiples analysis. **Response/template.** Root/
correction/qualified claim. **Derivation.** Replay market and measure provenance.
**Difficulty.** L2 formula; L3 EV bridge; L4 peer/implied-value claim.
**Distractors/constraints.** One root; no undervalued/overvalued conclusion
without a stated conditional criterion. **Feedback.** Correct compatibility
bridge. **Examples.** EPS/price called P/E (L2); EV/net income mismatch (L3);
forward peer compared with trailing company (L4). **Validation.** Fault manifest.

### Cross-family progression

P/E and earnings yield begin from per-share foundations. P/S and P/B reinforce
equity-value matching. Enterprise value is learned as a bridge before EV
multiples. Meaningfulness and basis matching precede peer/implied-value work.

## 10. Category: Adjustments, segments, scenarios, evidence, and integrated analysis

### Category purpose

Train disciplined synthesis: reconcile alternative measures, explain operational
drivers, test explicit scenarios, and limit conclusions to the supplied
evidence.

### Learn

An adjusted measure is a transformation with a definition and reconciliation,
not automatically a better or worse truth. Segment mix can change consolidated
results even when segment economics are unchanged. Historical facts, management
claims, analyst assumptions, and scenario outputs must remain labeled.

### Prerequisites

All earlier categories as relevant.

### Category boundaries

No real filing review, fraud allegation, management-quality rating, open-ended
investment thesis, or AI grading of persuasive prose.

### Common misconceptions

- Treating every exclusion as nonrecurring merely because it is labeled so.
- Comparing adjusted results with reported peers.
- Adding segment percentages instead of segment amounts.
- Attributing a total change to one driver without holding others constant.
- Treating a scenario as a forecast or probability.
- Selecting a recommendation when evidence only supports a conditional fact.

### Family `non_gaap_reconcile`

**Task/purpose.** Reconcile reported profit/cash measure to a defined adjusted
measure. **Response/template.** Signed adjustment table/missing amount.
**Derivation.** Apply each supplied pre/post-tax adjustment exactly and reconcile
to the most comparable reported measure. **Difficulty.** L2 pretax additions;
L3 tax effects and mixed signs; L4 per-share reconciliation.
**Distractors/constraints.** Reverse exclusions, ignore tax, start from wrong
reported subtotal. **Feedback.** Reported→adjustments→adjusted bridge.
**Examples.** NI 10+expense exclusion 2=12 adjusted pretax basis (L2); separate
tax effect (L3); adjusted EPS reconciliation (L4). **Validation.** Reconciliation
AST and comparable-measure ID.

### Family `adjustment_consistency`

**Task/purpose.** Test whether an adjustment policy is applied consistently
across periods/peers and identify the limited consequence. **Response/template.**
Consistent/inconsistent/insufficient plus evidence. **Derivation.** Compare
adjustment taxonomy, sign, tax, period, recurrence, and definition versions.
**Difficulty.** L2 same policy; L3 asymmetric exclusion; L4 renamed or
reclassified item. **Distractors/constraints.** Declare deception or accept
labels without reconciliation. **Feedback.** Side-by-side policy table.
**Examples.** same restructuring definition (L2); exclude losses but retain
gains (L3); definition changed between years (L4). **Validation.** Metadata
comparator.

### Family `segment_reconcile`

**Task/purpose.** Reconcile segment revenue/profit/assets to consolidated totals
through supplied eliminations/unallocated items. **Response/template.** Table
cell/bridge. **Derivation.** Sum segments and apply exact reconciliation rows.
**Difficulty.** L1 revenue sum; L2 eliminations; L3 unallocated central costs/
different profit measure. **Distractors/constraints.** Ignore eliminations,
compare segment measure directly with consolidated subtotal. **Feedback.**
Segment-to-group bridge. **Examples.** A+B=total (L1); remove intersegment sale
(L2); central cost reconciliation (L3). **Validation.** Consolidation identity
within fictional profile.

### Family `segment_mix_effect`

**Task/purpose.** Separate within-segment margin changes from consolidated mix
effects. **Response/template.** Contribution/bridge fields. **Derivation.**
Compute each segment's amount and weight; use declared base/current decomposition
order. **Difficulty.** L2 two segments; L3 price/mix; L4 alternative valid bridge
orders explicitly normalized. **Distractors/constraints.** Average margins
unweighted, attribute all change to segment performance. **Feedback.** Mix versus
within-segment waterfall. **Examples.** high-margin share rises (L2); both segment
margins flat/total margin up (L3); bridge-order difference disclosed (L4).
**Validation.** Contributions sum exactly.

### Family `common_size_trend`

**Task/purpose.** Convert statements to common-size percentages and identify
supported period patterns. **Response/template.** Percent table/controlled claim.
**Derivation.** Divide income rows by revenue and balance rows by total assets or
declared base. **Difficulty.** L1 one period; L2 two-period change; L3 scale
growth versus composition change. **Distractors/constraints.** Wrong base,
percent versus points, causal claim from composition alone. **Feedback.**
Absolute and common-size views together. **Examples.** COGS 60% of revenue (L1);
opex +2 points (L2); assets grow while inventory share falls (L3).
**Validation.** Bases sum where applicable.

### Family `driver_tree_variance`

**Task/purpose.** Attribute a change in revenue/profit/cash/return to supplied
drivers using a declared bridge order. **Response/template.** Ordered
contribution table. **Derivation.** Hold nonvaried inputs at the stated base and
apply exact finite-difference decomposition. **Difficulty.** L2 price/volume;
L3 margin/mix; L4 profit-to-cash or DuPont bridge. **Distractors/constraints.**
Double-count interactions, contributions fail to total, infer unprovided cause.
**Feedback.** Base→drivers→current waterfall. **Examples.** price then volume
(L2); mix bridge (L3); margin/turnover/leverage ROE bridge (L4).
**Validation.** Contribution sum and order metadata.

### Family `scenario_sensitivity`

**Task/purpose.** Recalculate one or more company measures under explicitly
supplied nonprobabilistic assumptions. **Response/template.** Scenario table/
sensitivity direction. **Derivation.** Clone base model, change named inputs,
and recompute dependencies exactly. **Difficulty.** L2 one driver; L3 interacting
drivers; L4 threshold/break-even. **Distractors/constraints.** Treat as forecast,
change unstated variables, linearize a nonlinear formula silently. **Feedback.**
Assumption delta and dependency graph. **Examples.** margin −1 point (L2);
volume/price case (L3); EBIT coverage threshold (L4). **Validation.** Immutable
base and scenario-diff oracle.

### Family `valuation_scenario_table`

**Task/purpose.** Build a bounded hypothetical value table from supplied earnings/
cash/multiple scenarios without choosing a recommendation.
**Response/template.** Matrix of implied values/ranges. **Derivation.** Apply
matched scenario denominator and assumed multiple, then EV/equity/per-share
bridges as declared. **Difficulty.** L2 two cases; L3 2D sensitivity; L4
negative-denominator cells and dilution. **Distractors/constraints.** Fill
nonmeaningful cells numerically, hide price/share-date basis, call midpoint fair
value. **Feedback.** Assumptions shown on both axes. **Examples.** EPS×P/E table
(L2); EBITDA×EV multiple less net debt (L3); loss cells marked N/M (L4).
**Validation.** Cell-by-cell valuation oracle.

### Family `evidence_claim_match`

**Task/purpose.** Select all and only claims entailed by supplied statements,
notes, definitions, and scenarios. **Response/template.** Multi-select with
evidence links. **Derivation.** Evaluate controlled claim predicates against the
case model and epistemic labels. **Difficulty.** L1 direct fact; L2 derived
comparison; L3 causal/forecast/quality overreach. **Distractors/constraints.**
True-sounding but unsupported claims, correlation→cause, scenario→forecast,
ratio→recommendation. **Feedback.** Evidence chain or missing premise.
**Examples.** operating margin rose (L1); mix arithmetically explains supplied
bridge (L2); “stock will outperform” unsupported (L3). **Validation.** Predicate
entailment and countermodel for insufficiency.

### Family `integrated_company_analysis_audit`

**Task/purpose.** Find one earliest root defect or unresolved assumption in a
statement-to-conclusion analysis. **Response/template.** Root layer, evidence,
correction, downstream consequences, permitted conclusion.
**Derivation.** Validate disclosure identities, measure definitions, dates,
claim holders, adjustments, scenarios, valuation, and evidence in dependency
order. **Difficulty.** L3 two layers; L4 several downstream metrics; L5
underdetermined/value-dependent conclusion. **Distractors/constraints.** One
root fault or explicit insufficiency; never require a buy/sell verdict.
**Feedback.** Causal provenance graph. **Examples.** stale share count corrupts
EPS/P/E (L3); adjusted EBITDA paired with reported peer multiple (L4); no
assumed multiple means implied value cannot be determined (L5).
**Validation.** Fault/insufficiency manifest and witness analyses.

### Cross-family progression

Direct reconciliations precede consistency checks. Segments and common-size
views precede driver bridges. Scenario arithmetic precedes valuation tables.
Evidence matching teaches conclusion limits before integrated audits.

## 11. Topic-level progression

### Level 1 — Read and reconstruct

Identify statement scope, distinguish stocks/flows, complete one identity, and
calculate direct growth, margin, liquidity, EPS, debt, or multiple values with
all components supplied.

### Level 2 — Match bases

Choose averages, periods, price dates, claim holders, cash-flow sections, and
ratio definitions; reconstruct one bridge or inverse relationship.

### Level 3 — Compare and decompose

Compare periods/fictional peers, separate price-volume-mix and profit-cash
drivers, handle weighted shares, dilution, enterprise value, and segments.

### Level 4 — Normalize and stress

Reconcile adjusted measures, test maturity and operating scenarios, diagnose
basis mismatches, and propagate a source change through several derived metrics.

### Level 5 — Qualify conclusions

Recognize undefined or incomparable measures, preserve multiple conditional
interpretations, identify missing assumptions, and audit an integrated chain
without converting analysis into an investment recommendation.

## 12. Adaptive practice guidance

Track mastery by:

- category and family;
- statement/section and stock-versus-flow type;
- numerator, denominator, average, date, period, scale, and sign policy;
- reported/adjusted/scenario and trailing/forward basis;
- total-company, enterprise, common-equity, and per-share claim-holder layer;
- direct, inverse, reconciliation, comparison, scenario, claim, and audit mode;
- misconception and difficulty dimension.

Failure-driven routing:

- profit treated as cash → statement scope, then indirect-CFO bridge;
- current/ending/average confusion → timelines and `average_balance`;
- percent versus percentage points → growth/margin paired drills;
- inventory/payables sign errors → working-capital cash-effect drills;
- CFO/capex/FCF conflation → classify before calculating;
- ROE called market return → numerator/denominator and DuPont families;
- ending shares used for EPS → weighted-share timeline;
- market cap called enterprise value → claim-holder bridge;
- price numerator paired with operating denominator → basis matching;
- negative P/E ranked as cheap → sign/meaningfulness cases;
- adjusted and reported measures mixed → reconciliation/consistency;
- scenario treated as forecast → epistemic-label/evidence matching;
- downstream error selected in audit → trace earliest source dependency.

Slow but correct answers retain the conceptual level while reducing arithmetic
noise. Fast answers with unsupported conclusions do not establish mastery.

## 13. Answer checking and feedback

### Semantic checking

- Compare semantic IDs, exact values, units, dates, periods, bases, and status;
  never compare display strings alone.
- Use exact rational/decimal arithmetic and apply rounding only at the declared
  output stage.
- Accept formula variants only when their typed expression trees are equivalent
  under the active definition.
- A multiple-choice item must have exactly one answer set after rounding and
  semantic normalization.
- Multi-select claim questions compare complete entailed sets.
- `Undefined` means division is mathematically unavailable.
- `Not meaningful` means the arithmetic can be written but ordinary analytical
  ordering is disallowed by the active policy.
- `Not comparable` means both values may exist but their bases conflict.
- `Cannot determine` means a needed disclosed value or assumption is absent.

### Misconception diagnosis

Maintain alternative-result fingerprints for:

- reversed numerator/denominator;
- current rather than prior growth base;
- percent/percentage-point confusion;
- ending rather than average balance;
- revenue rather than cost/purchases denominator;
- reversed operating-asset/liability cash sign;
- reported/adjusted or trailing/forward mismatch;
- total versus attributable income;
- current versus weighted-average versus diluted shares;
- market cap versus enterprise value;
- gross versus net debt;
- equity-value versus enterprise-value denominator;
- sign/absolute-value misuse;
- scenario fact versus historical fact.

### Worked feedback order

1. Restate the requested measure, basis, date/period, and unit.
2. Identify exact source rows and assumptions.
3. Show classification or bridge before the ratio.
4. Substitute values with signs and scales.
5. Calculate exactly and round once.
6. State what the result means mechanically.
7. State what cannot be concluded.

## 14. Rendering, interaction, accessibility, and localization

- Render statements as semantic tables with row headers, units, period headers,
  subtotal hierarchy, and reported/adjusted/scenario badges.
- Render bridges as accessible waterfall tables plus optional SVG; negative
  amounts require sign and pattern, not color alone.
- Render share, debt-maturity, cash-runway, and period-average problems on
  keyboard-readable timelines with equivalent event tables.
- Render driver trees and provenance graphs with structured nested lists.
- Chart axes start at a context-appropriate value and display scale breaks;
  table access always provides exact values.
- Do not rely on red/green for loss/profit, negative/positive, or fail/pass.
- Screen readers must receive table captions, units, scope, row relationships,
  and a concise textual derivation.
- Choice ordering, company names, sectors, currencies, and row labels localize
  independently from stable semantic IDs.
- Currency localization changes symbols and formatting, not economic values or
  exchange rates.
- Localization must preserve minus signs, parentheses, percent versus percentage
  points, decimal separators, `x` multiples, fiscal periods, and share scales.
- Reduced-motion mode uses static before/after bridges.

## 15. Generator and implementation architecture

Recommended standalone modules:

```text
seededRng
fictionalCompanyGrammar
reportingProfileRegistry
statementLedger
statementIdentityOracle
periodAndDateModel
measureDefinitionRegistry
exactDecimalRational
ratioEngine
meaningfulnessPolicy
cashFlowBridge
workingCapitalEngine
shareScheduleEngine
dilutionEnumerator
capitalStructureBridge
enterpriseValueBridge
segmentReconciler
adjustmentReconciler
driverDecomposer
scenarioEngine
claimEntailmentEngine
provenanceGraph
faultInjector
semanticTableRenderer
accessibleChartRenderer
localizedAnswerParser
semanticAnswerChecker
```

Generation pipeline:

1. Choose family, difficulty dimensions, profile, and misconception.
2. Construct a coherent fictional base ledger and any scenario/peer variants.
3. Derive all statements, notes, share schedules, and market observations.
4. Compute answers through the primary engine and an independent oracle.
5. Inject one named root defect for audit families.
6. Generate distractors from alternative computations.
7. Render and localize only after semantic validation.
8. Reject ambiguity, basis mismatch, degenerate ratios, duplicate choices,
   unsupported claims, or recent structural repetition.

The app remains standalone HTML/JS/CSS. No backend, brokerage API, market-data
feed, filing parser, spreadsheet engine, remote calculator, or language model is
required at runtime.

## 16. Automated validation requirements

### Model invariants

- Every statement row, note, event, assumption, price, and derived measure has a
  stable ID and provenance.
- Assets equal liabilities plus equity.
- Cash and retained-earnings rollforwards tie exactly.
- Segment tables reconcile through displayed eliminations/unallocated rows.
- Share-event schedules reproduce closing and weighted-average shares.
- Reported-to-adjusted reconciliations sum exactly and retain tax treatment.
- Scenario models never mutate the archived base case.

### Formula invariants

- Ratios use the active definition registry, compatible units, period bases,
  dates, and claim holders.
- Average-balance and weighted-share interval weights sum exactly to the period.
- Turnover and days measures satisfy their reciprocal relationship.
- Indirect CFO agrees with independently aggregated operating cash events.
- Free cash flow, NOPAT, invested capital, EBITDA, and every adjusted measure
  expose their nonuniversal definition IDs.
- DuPont components multiply to profile ROE.
- EPS and diluted EPS agree with independent share/instrument enumeration.
- Market capitalization uses current shares at the price date.
- Enterprise value components reconcile and EV multiples use compatible
  operating denominators.
- Sign/zero policy covers all denominator classes.
- Driver, segment, source/use, adjustment, and valuation bridges sum exactly.

### Question invariants

- All placeholders are substituted and all units/scales/periods are visible.
- Numeric inputs reproduce the canonical displayed answer from visible data.
- Choice distractors are distinct and incorrect after rounding.
- Claim answers are entailed by the case model; unsupported choices have a
  stored missing premise or counterexample.
- Audit instances contain one earliest root fault unless explicitly marked as an
  insufficiency/multi-select case.
- Worked solutions identify source data, formula, calculation, interpretation,
  and limitation.
- No generated output contains a real ticker/company, live price, recommendation,
  personalized language, or compliance/quality/fraud claim.

For at least `10,000` accepted seeds per family/level, and `25,000` for indirect
CFO, cash cycle, diluted EPS, enterprise value, adjustments, driver bridges,
scenarios, evidence matching, and integrated audits, verify all invariants,
answer uniqueness, parser behavior, rendering accessibility, localization, and
coverage distribution.

## 17. Coverage requirements

Balance:

- all four statements, notes, period and point-in-time facts;
- profit/loss and cash source/use signs;
- revenue price, volume, mix, and cost drivers;
- growth, decline, flat, zero-base, and sign-changing cases;
- gross, operating, net, reported, and adjusted profit layers;
- positive/negative working-capital component changes;
- current/quick/difference and turnover/day measures;
- operating, investing, financing, and noncash events;
- low/high/zero/negative denominator cases without value labels;
- average assets/equity/capital and acquisition timing;
- issuance, repurchase, split, basic, diluted, and current share counts;
- gross debt, net debt, net cash, coverage, and maturities;
- equity and enterprise multiples, trailing/forward, reported/adjusted;
- segment, peer, scenario, bridge, claim, audit, and insufficiency modes.

Track structural signatures including family, company archetype, number of
periods/segments, formula direction, sign class, average/date basis, adjustment
pattern, claim-holder layer, scenario dimensions, misconception, and root fault.
Names and changed numbers alone do not constitute new coverage.

Every misconception must recur intentionally. No easiest family, positive-growth
case, profitable company, low-leverage case, or numeric response mode may
dominate.

## 18. Recommended views and v1 priorities

Views:

1. **Statements & Links**
2. **Growth & Margins**
3. **Working Capital**
4. **Cash & Reinvestment**
5. **Returns & Efficiency**
6. **Shares & EPS**
7. **Debt & Funding**
8. **Value & Multiples**
9. **Adjustments & Segments**
10. **Scenarios & Audit**

V1 prioritizes:

- two or three annual periods;
- compact fictional nonfinancial companies;
- income, balance, cash-flow, and equity rollforwards;
- direct growth/margins, working capital, CFO/capex/FCF;
- ROA/ROE/DuPont and introductory ROIC profile;
- weighted shares/basic EPS, market cap, net debt, EV, and P/E;
- sign/meaningfulness and numerator/denominator matching;
- reported-to-adjusted and segment reconciliation;
- evidence-qualified claims and root-error audits.

Defer:

- real filings/data;
- complex diluted securities;
- specialist industries;
- quarterly seasonality and currency translation;
- full DCF/WACC and portfolio theory;
- tax, legal, covenant, or accounting-standard compliance;
- free-form investment theses.

## 19. Topic-level quality checklist

- [ ] Every company, security, price, filing, peer, and scenario is fictional.
- [ ] Every question shows currency, scale, date/period, and reporting basis.
- [ ] Statement identities and cross-statement links reconcile.
- [ ] Stocks, flows, averages, and current/weighted share counts do not blur.
- [ ] Profit, cash flow, liquidity, solvency, return, and valuation do not blur.
- [ ] Reported, adjusted, historical, forward, and scenario values stay labeled.
- [ ] Every ratio exposes numerator, denominator, averaging, and sign policy.
- [ ] Nonstandard measures expose their definition version.
- [ ] Equity and enterprise claim-holder bases match their denominators.
- [ ] Undefined/not meaningful/not comparable/cannot determine remain distinct.
- [ ] Negative denominators are never ranked as ordinary cheap multiples.
- [ ] Multiple/ratio changes do not become causal claims without supplied bridge.
- [ ] Scenarios are not presented as forecasts or probabilities.
- [ ] No metric becomes an automatic buy/sell, quality, safety, fraud, or
      management judgment.
- [ ] Every family has task, response/template, derivation, difficulty,
      misconception distractors/constraints, feedback, three examples, and
      validation.
- [ ] Distractors come from named mental models.
- [ ] Exact independent oracles, seed sweeps, accessibility, and localization
      checks pass.
- [ ] The runtime requires no backend or external service.

## 20. Stable identifiers and navigation

The backticked family identifiers above are stable public IDs. Archive:

```text
seed
familyId
level
companyProfileId
reportingBasisId
currencyAndScale
periodAndPriceDateIds
statementRevisionIds
measureDefinitionIds
adjustmentDefinitionIds
scenarioIds
exactInputs
exactAnswers
displayRounding
acceptedAnswerSet
meaningfulnessStatus
misconceptionIds
provenanceGraph
faultOrInsufficiencyManifest
structuralSignature
```

Changing a formula, sign policy, classification, averaging convention,
claim-holder mapping, accepted equivalence, or conclusion rule requires a new
profile/definition version. Renaming a localized label does not.
