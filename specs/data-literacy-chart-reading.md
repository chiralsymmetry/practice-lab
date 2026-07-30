# Data Literacy and Chart Reading — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, semantic-chart renderer, exact-data oracle, claim checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Data Literacy and Chart Reading

### Topic goal

Develop fast, careful reading of tables and visual displays and the ability to decide which claims the displayed evidence supports.

The learner should become able to:

- identify variables, units, populations, categories, time spans, and sources;
- read linear, truncated, broken, reversed, and logarithmic axes correctly;
- interpolate between ticks without inventing false precision;
- distinguish counts, rates, percentages, indexed values, and cumulative totals;
- extract and compare values from tables, bars, lines, compositions, distributions, scatterplots, and maps;
- recognize what a display does not reveal;
- account for denominators, unequal intervals, missing values, aggregation, and uncertainty;
- diagnose visual encodings that exaggerate, conceal, or confuse;
- choose a chart that fits the data and intended comparison;
- construct or repair a small chart with honest scales, labels, and accessible alternatives.

The app should build the habit:

> Read title and source, identify variables and units, inspect scale and denominator, extract the values, then evaluate the claim.

It must not train suspicion as a reflex. A truncated axis, unusual ordering, or dual axis is not automatically deceptive; the learner judges the consequence in the specific display.

### Relationship to neighboring Practice Lab topics

- **Probability and Statistics** owns descriptive statistics, probability, formal uncertainty, sampling, inference, correlation/regression calculations, and study design.
- **Everyday Economics** owns consumer price/rate calculations and inflation/purchasing-power numeracy.
- **Algebra Fluency** owns general proportional and equation reasoning.

Data Literacy and Chart Reading owns visual encodings, axes, table/chart extraction, denominator and comparability checks, and evidence-bounded claim auditing. It may locally review a percentage, median, interval, or correlation idea when needed to read a chart, but does not become a statistics course.

### Audience and prerequisites

Early categories assume:

- whole-number and decimal arithmetic;
- basic percentages and ratios;
- locating a point on a number line;
- reading row and column headers.

Later categories locally introduce:

- logarithmic scales;
- index numbers;
- rates per population/exposure;
- interval and error-bar semantics;
- bivariate association language.

No spreadsheet, programming, or statistics course is required.

### Scope

The initial model ID is `data-literacy-chart-reading-v1`. It includes:

- chart anatomy: title, subtitle, source, footnote, legend, encoding key, axes, variables, units, categories, period, population, and sample;
- exact reading/interpolation on linear, negative, nonzero-baseline, broken, reversed, log, date/time, and unit-prefixed scales;
- semantic tables, lookup, totals/subtotals, rankings, percentage tables, missing/suppressed values, and table/chart reconciliation;
- vertical/horizontal, grouped, diverging, and stacked bar charts;
- line, step, area, cumulative, slope, and small-multiple time-series displays;
- pie/donut charts, 100% stacked bars, treemaps, and waterfall charts in bounded forms;
- dot plots, strip plots, histograms, frequency polygons, box plots, and cumulative-frequency curves;
- scatterplots, trend lines supplied as visual summaries, bubble charts, heatmaps, choropleths, and symbol maps;
- error bars, confidence/range bands, sample-size annotations, benchmark/reference lines, and uncertainty-aware claim selection;
- counts versus rates, percentage-point versus percent change, nominal versus indexed values, per-capita/exposure normalization, weighted aggregation, and subgroup/overall comparisons;
- misleading or fragile choices: truncation, aspect ratio, unequal bins, area/volume encodings, dual axes, cherry-picked windows, omitted categories, visual clutter, and inappropriate normalization;
- chart choice, axis/legend design, annotation, table-to-chart construction, accessible summaries, and chart repair;
- synthetic, culturally neutral datasets generated locally with exact semantic values.

The intended ceiling is broad practical chart literacy suitable for everyday media, work, public information, and introductory academic reading.

### Exclusions

Do not include:

- current news, political polling, real public-health claims, live financial prices, or claims requiring external fact checking;
- personal, medical, legal, credit, employment, or investment decisions;
- formal hypothesis tests, confidence-interval construction, regression fitting, probability models, or survey-design calculations beyond chart-reading needs;
- general data cleaning, database querying, spreadsheet commands, dashboard software, or programming APIs;
- advanced visualization research, perceptual-model proofs, color-science calculations, geographic projections, or GIS analysis;
- network, Sankey, parallel-coordinate, ternary, radar/spider, violin, ridgeline, candlestick, control, ROC, or specialist scientific plots in v1;
- arbitrary free-form chart criticism graded by language model;
- exact value questions whose answer can only be estimated from antialiased pixels;
- deliberately illegible charts, microscopic labels, or “spot the lie” cynicism;
- claims of author intent such as “the designer is lying” when only the visual consequence is observable.

### Normative semantic and visual model

#### Semantic-first construction

Every display is derived from an exact semantic object:

```text
Dataset
  variables[]
  records[]
  units
  population/sample
  sourceMetadata
  missingness

Chart
  mark
  encodings
  scales
  transforms
  filters
  annotations
  layout
  accessibleTable
```

Canonical answers come from semantic values, transforms, and scale definitions—not reverse measurement of rendered pixels. SVG geometry is independently checked against the semantic chart.

#### Axis conventions

Every quantitative axis declares:

- variable name;
- unit;
- direction;
- scale type;
- domain;
- labeled ticks;
- transform when non-linear.

Linear mapping:

```text
position fraction = (value - domain_min) / (domain_max - domain_min)
```

Logarithmic axes:

- base is displayed, normally base10;
- only positive values are permitted;
- equal visual intervals represent equal ratios, not equal differences;
- minor ticks are either labeled or excluded from exact-value questions.

Broken axes display an unmistakable break marker and inaccessible interval. Reversed axes show descending tick labels. Time axes use actual elapsed spacing unless explicitly labeled categorical periods.

Bars encode magnitude by length from a common baseline. Ordinary magnitude bars should include zero. A nonzero bar baseline may appear only when visibly marked and when the question trains its effect. Lines encode position and may use a nonzero axis when the domain and consequence are clear.

#### Missing, zero, and unavailable

These are distinct semantic states:

- `0`: observed numeric zero;
- `missing`: value not observed/available;
- `not_applicable`: category does not apply;
- `suppressed`: deliberately not displayed under a stated rule;
- `not_yet`: future or incomplete period.

A missing line-series value creates a gap unless an explicit imputation/interpolation transform is declared. It is never silently converted to zero.

#### Percentages, rates, and indexes

- A percentage always stores numerator, denominator, and reference population.
- Percentage-point change is `new%−old%`.
- Percent change is `(new−old)/old ×100%`, defined only when the old value is nonzero.
- A rate includes an exposure unit such as `per 1,000 residents` or `per hour`.
- An index with base period `b` uses:

  ```text
  index_t = value_t / value_b × 100
  ```

  unless a different displayed formula is supplied.
- Cumulative values are monotone nondecreasing only when components are nonnegative; a decrease then signals correction/redefinition or invalid data and must be explained.

#### Histogram and distribution conventions

- Histogram bars touch and represent numeric intervals.
- Bin boundaries and inclusion rule are shown, default `[a,b)` with final bin closed when needed.
- For equal-width bins, height may encode frequency or relative frequency.
- For unequal-width bins, **area** represents frequency and height is frequency density:

  ```text
  density = frequency / bin width
  ```

- Box plots use the same declared quartile convention as Probability and Statistics and expose the exact five-number summary.
- A display cannot reveal exact raw values that aggregation removed.

#### Uncertainty conventions

Error bars never have an assumed universal meaning. Each chart labels them as one of:

- range;
- interquartile range;
- standard deviation;
- standard error;
- a named confidence interval;
- another explicitly defined interval.

The app may ask about interval endpoints, relative width, and claims supported by the stated semantics. It must not teach that visual overlap/non-overlap alone is a universal hypothesis test.

#### Maps and area encodings

- Choropleth regions encode a rate/percentage or other comparable normalized value unless a raw-count exception is the exact audit target.
- Symbol maps use symbol **area**, not radius/diameter, to encode magnitude.
- Bubble charts likewise encode the displayed variable by area when stated.
- Map area has no evidential weight unless geographic area itself is the variable.
- Legends expose exact class thresholds and inclusion boundaries.

### Global answer conventions

- Surrounding whitespace is ignored.
- Numeric answers accept exact fractions/decimals and compatible displayed units.
- Counts must be exact integers unless the chart explicitly reports estimates.
- Percent fields accept `12.5` or `12.5%` as `12.5%`; a field label prevents decimal-fraction ambiguity.
- Dates use localized display backed by ISO semantic dates.
- Approximate read-offs state precision, normally nearest tick subdivision; accepted tolerance is half the smallest requested unit.
- If a chart only supports a range, the answer is a structured interval, not a guessed point.
- Category labels use semantic selection rather than spelling-sensitive text.
- Sets of supported claims are order-insensitive; ranked sequences are order-sensitive.
- “Cannot determine from this display” is available only when information is genuinely absent, not as a generic escape.
- Claim questions use controlled semantic clauses so causation, population, period, unit, direction, magnitude, and uncertainty can be checked separately.

### Difficulty philosophy

Difficulty should increase through:

- weaker scaffolding for title/legend/axis inspection;
- interpolation and inverse position-to-value tasks;
- nonzero, log, reversed, broken, or time-irregular scales;
- switching among absolute, relative, indexed, and cumulative quantities;
- comparing several series with different baselines;
- distinguishing bar segment length from endpoint position;
- identifying what aggregation or missingness hides;
- coordinating numerator, denominator, unit, and reference population;
- evaluating a claim across title, chart, footnote, and source;
- repairing a display while preserving its semantic data.

It must not increase through tiny charts, low contrast, excessive categories, arbitrary decimals, obscure subject matter, long arithmetic, color-memory tests, visual search clutter, hidden definitions, or subjective aesthetic preference.

### Shared family contract

Every family below includes:

- **Task** and its trainable visual/data operation;
- **Response/template** with semantic placeholders;
- **Derivation** from the exact chart model;
- **Difficulty** through meaningful dimensions;
- **Misconceptions/constraints** including distractors and rejection rules;
- **Feedback** showing where and how to read;
- **Examples** with at least three instantiated cases;
- **Validation/coverage** naming oracle checks and distribution obligations.

Reject generated items with ambiguous ticks, occluded marks, rounded ties, indistinguishable choices, inconsistent source/table/chart values, unsupported causal claims, or geometry too small for the declared response precision.

## 2. Category: Chart anatomy, axes, and scales

### Category purpose

Make scale inspection automatic and translate reliably between visual position and quantitative value.

### Learn

Before reading a mark, identify the variable, unit, direction, domain, and scale. On a linear axis, equal distances are equal differences. On a log axis, equal distances are equal ratios. A zero baseline matters especially for bars because their lengths encode magnitude.

### Prerequisites

Number lines, subtraction, fractions, and powers of ten for log variants.

### Category boundaries

This category isolates axes and metadata. Multi-series comparisons and misleading-claim synthesis come later.

### Subcategories

1. Titles, variables, units, and legends
2. Linear tick reading and interpolation
3. Nonzero, negative, reversed, and broken axes
4. Logarithmic and time axes
5. Scale comparison and precision

### Common misconceptions

- Reading the mark before checking the unit.
- Assuming every axis begins at zero or increases upward/rightward.
- Counting tick marks instead of intervals.
- Treating a halfway position as halfway in value on a log scale.
- Treating dates as equally spaced categories despite unequal elapsed time.
- Reporting more digits than the scale supports.

### Family `chart_metadata_identify`

**Task.** Identify variable, unit, population, period, or series from title/subtitle/axis/legend/source.

**Response/template.** Matching: `For {chart}, identify {metadata_fields}.`

**Derivation.** Resolve labeled semantic roles, not visual proximity alone.

**Difficulty.** L1 one axis/title; L2 legend+subtitle; L3 footnote changes scope; L4 distinguish observed period from publication date.

**Misconceptions/constraints.** Distractors reuse plausible nearby labels. Every needed field is visible and accessible.

**Feedback.** Highlight the exact label supporting each answer.

**Examples.**

1. y-axis “Energy (kWh)” → variable energy, unit kWh. L1.
2. legend maps dashed line to “Plan B.” L2.
3. title says 2025 but footnote says data through September → observed period ends September. L3.

**Validation/coverage.** Metadata schema/rendered-label identity.

### Family `linear_tick_interval`

**Task.** Determine tick step or value at a labeled/unlabeled linear tick.

**Response/template.** Numeric with unit: `What value is at {tick_or_mark}?`

**Derivation.** Difference between labeled endpoints divided by number of intervals.

**Difficulty.** L1 every tick labeled; L2 sparse labels; L3 decimal/negative; L4 infer missing endpoint.

**Misconceptions/constraints.** Distractors divide by tick count rather than interval count. Exact tick alignment required.

**Feedback.** Count spaces and show repeated addition.

**Examples.**

1. 0 to20 across4 intervals → step5. L1.
2. labels10 and30 with4 intervals → middle unlabeled tick20. L2.
3. −2 to2 across8 intervals → step0.5. L3.

**Validation/coverage.** Exact affine-scale inversion.

### Family `linear_interpolate_value`

**Task.** Read a mark between ticks on a linear scale.

**Response/template.** Numeric/approximate value.

**Derivation.** Add the indicated fraction of one tick interval to the lower tick value.

**Difficulty.** L1 halves; L2 quarters; L3 negative/decimal; L4 inverse place a supplied value.

**Misconceptions/constraints.** Geometry lands on declared subdivisions; reject false precision.

**Feedback.** Zoom one interval and show fractional position.

**Examples.**

1. halfway from40 to50 →45. L1.
2. one quarter from1.2 to1.6 →1.3. L2.
3. three quarters from−8 to−4 →−5. L3.

**Validation/coverage.** Semantic value-to-position round trip.

### Family `axis_baseline_effect`

**Task.** Identify baseline and quantify how a truncated baseline changes apparent bar-length ratio.

**Response/template.** baseline, true ratio, displayed-length ratio.

**Derivation.** True magnitude ratio `b/a`; visual length ratio `(b−baseline)/(a−baseline)`.

**Difficulty.** L1 notice nonzero baseline; L2 calculate ratios; L3 compare two renderings; L4 determine when baseline is appropriate for a line but risky for bars.

**Misconceptions/constraints.** Do not label all truncation deceptive; question asks consequence.

**Feedback.** Draw zero-to-value and baseline-to-value lengths.

**Examples.**

1. bars100 and110 with baseline0 → length ratio1.1. L1.
2. same values with baseline90 → lengths10 and20, apparent ratio2. L2.
3. a temperature line 19–21°C may use a narrow axis if domain is labeled; bars claiming “twice as warm” may not. L3.

**Validation/coverage.** Exact length geometry and claim semantics.

### Family `negative_diverging_axis`

**Task.** Read signed values and directions around zero.

**Response/template.** numeric/comparison: `Which category is most negative/largest change?`

**Derivation.** Use labeled zero and signed axis; distance alone does not determine greater numeric value.

**Difficulty.** L1 one negative; L2 diverging bars; L3 reversed ordering; L4 compare absolute versus signed magnitude.

**Misconceptions/constraints.** Prompt distinguishes “largest value,” “largest decrease,” and “largest magnitude.”

**Feedback.** Mark zero and restate requested comparison.

**Examples.**

1. −3 is less than−1. L1.
2. changes A−8,B+5 → largest magnitude A; largest value B. L2.
3. a longer leftward bar encodes a larger decrease, not a larger numeric value. L2.

**Validation/coverage.** Signed and absolute order certificates.

### Family `reversed_axis_read`

**Task.** Read or order marks on an explicitly reversed quantitative axis.

**Response/template.** numeric/ranking.

**Derivation.** Follow tick labels; mapping direction is descending.

**Difficulty.** L1 two values; L2 interpolation; L3 compare reversed and ordinary panels; L4 diagnose inferred trend.

**Misconceptions/constraints.** Arrow/direction and labels visible. Reversal may be conventional in a supplied domain but is never hidden.

**Feedback.** Trace from labeled ticks rather than assuming upward means larger.

**Examples.**

1. y-axis labels100,80,60 upward → upper point has smaller value. L1.
2. halfway between80 and60 →70 even on reversed axis. L2.
3. visually rising line on descending axis represents declining numeric values. L3.

**Validation/coverage.** Monotone-decreasing scale inversion.

### Family `broken_axis_read`

**Task.** Read values across an axis break and state what distances cannot be compared.

**Response/template.** numeric plus supported/unsupported comparison.

**Derivation.** Use each displayed segment's mapping; do not treat the omitted interval as rendered distance.

**Difficulty.** L1 identify break; L2 read either side; L3 compare gaps; L4 reconstruct omitted range from labels.

**Misconceptions/constraints.** Break marker and segment ticks explicit. Marks never lie in omitted interval.

**Feedback.** Shade the omitted domain and separate segment mappings.

**Examples.**

1. axis jumps from20 to80 → values21–79 are not displayed. L1.
2. pixel gap across break does not encode numeric difference. L2.
3. points at18 and82 differ64 despite appearing adjacent around break. L3.

**Validation/coverage.** Piecewise-scale inverse and omitted-domain checks.

### Family `log_axis_read`

**Task.** Read major/minor positions and compare ratios on a declared log axis.

**Response/template.** value/ratio: `On base-{base} axis, what value is {mark}?`

**Derivation.** Map equal distances in exponent/log space.

**Difficulty.** L1 powers of10; L2 geometric midpoint; L3 labeled minor ticks; L4 multi-decade ratio.

**Misconceptions/constraints.** Only positive data. Exact minor ticks labeled. Distractors use arithmetic midpoint.

**Feedback.** Show exponents/ratios beside positions.

**Examples.**

1. major ticks1,10,100 are equally spaced on log10 axis. L1.
2. midpoint between10 and100 → `sqrt(1000)≈31.6`, not55. L2.
3. values2 and200 differ by factor100, two decades. L3.

**Validation/coverage.** Log transform/inverse with tolerance.

### Family `time_axis_spacing`

**Task.** Interpret dates/durations on regular or irregular time axes.

**Response/template.** elapsed interval, rate, or chart-consistency choice.

**Derivation.** Convert semantic dates to elapsed time; compare with actual axis spacing.

**Difficulty.** L1 equal monthly; L2 missing/irregular dates; L3 category-spaced versus elapsed-time panels; L4 rate per time.

**Misconceptions/constraints.** Date precision and calendar convention supplied. No ambiguous month-length arithmetic unless exact dates shown.

**Feedback.** Annotate elapsed durations between observations.

**Examples.**

1. Jan1 toJan11 →10 elapsed days. L1.
2. points for Jan,Feb,May should have a larger Feb–May gap on elapsed-time axis. L2.
3. equal visual spacing of irregular visits means categorical visit order, not necessarily time-proportional spacing. L3.

**Validation/coverage.** Date-duration and geometry-spacing agreement.

### Family `axis_precision_rounding`

**Task.** Choose the defensible precision/range for a chart read-off.

**Response/template.** rounded numeric or precision choice.

**Derivation.** Use exact semantic value only to validate; learner reports to the chart's declared readable subdivision.

**Difficulty.** L1 exact tick; L2 between ticks; L3 thick mark/range; L4 compare chart versus table precision.

**Misconceptions/constraints.** Do not reward invented decimals. Accessible description states uncertainty range for thick marks.

**Feedback.** Relate last justified digit to tick spacing/mark width.

**Examples.**

1. point exactly on tick25 →25. L1.
2. axis ticks every10 with no subdivisions, point near halfway → about45, not45.037. L2.
3. source table says45.037 while chart supports about45; table permits higher precision. L3.

**Validation/coverage.** Display-resolution metadata governs accepted answer.

### Cross-family progression

Metadata and ordinary ticks come first. Interpolation precedes nonzero/negative/reversed/broken scales. Log and irregular-time axes remain separate until linear reading is reliable. Precision practice is interleaved throughout so learners do not confuse exact underlying data with visually justified resolution.

## 3. Category: Tables, lookup, and structural reading

### Category purpose

Navigate headers and scopes, distinguish totals from components, and extract or reconstruct values without losing the denominator or missingness state.

### Learn

A cell has meaning only through its row, column, unit, and any header hierarchy. Totals may overlap with subtotals; percentages may be of rows, columns, or the whole table. Blank, zero, suppressed, and not applicable are different.

### Prerequisites

Basic arithmetic and chart metadata.

### Category boundaries

This category focuses on table structure. Statistical contingency analysis and database querying belong elsewhere.

### Subcategories

1. Header paths and lookup
2. Totals and subtotals
3. Percent denominators
4. Sorting/ranking
5. Missing and suppressed data
6. Table-chart consistency

### Common misconceptions

- Reading the right number from the wrong row or year.
- Adding a subtotal to its components.
- Assuming percentages sum down columns when they are row percentages.
- Treating blank as zero.
- Ranking displayed rounded ties as though exact order were known.

### Family `table_header_path_lookup`

**Task.** Extract a cell using row, nested column, unit, and period.

**Response/template.** numeric/text: `For {row_entity}, {measure}, {period}, what is the value?`

**Derivation.** Resolve full header path and semantic record key.

**Difficulty.** L1 flat table; L2 multi-level headers; L3 unit footnote; L4 transposed table.

**Misconceptions/constraints.** Distractors are neighboring cells. Highlighting is feedback only.

**Feedback.** Trace row then every column header.

**Examples.**

1. row B, column2025 →17. L1.
2. North → Revenue → Q2 →1.4 million. L2.
3. table “values in thousands,” cell250 →250,000 units. L3.

**Validation/coverage.** Header-path key exactly selects one cell.

### Family `table_total_subtotal`

**Task.** Calculate/verify a total without double-counting included subtotals.

**Response/template.** numeric or valid-total choice.

**Derivation.** Sum leaf members defined by hierarchy; compare displayed subtotal.

**Difficulty.** L1 row total; L2 nested subtotal; L3 overlapping “all” category; L4 missing component.

**Misconceptions/constraints.** Hierarchy is explicit. Reject non-additive measures such as averaging percentages unless exact weighting supplied.

**Feedback.** Expand subtotal into included leaves.

**Examples.**

1. East4+West6 → total10. L1.
2. Fruit total includes Apples3 and Pears2; do not add Fruit5 again. L2.
3. total12, known components4,3,2 → missing3. L2.

**Validation/coverage.** Hierarchical aggregation tree.

### Family `table_percentage_denominator`

**Task.** Identify or compute whether a percentage uses row, column, or grand total.

**Response/template.** denominator and percentage.

**Derivation.** Follow table label (`% within row`, etc.) and divide cell count by declared margin.

**Difficulty.** L1 explicit row; L2 infer by totals; L3 compare two denominator views; L4 missing margin.

**Misconceptions/constraints.** Percentages constructed to sum exactly modulo displayed rounding.

**Feedback.** Highlight numerator cell and denominator margin.

**Examples.**

1. row counts30 and70 → first is30% of row. L1.
2. cell20, column total80 →25% column percentage. L2.
3. same count can be40% of its row and25% of its column. L3.

**Validation/coverage.** Exact fraction and rounding-sum tolerance.

### Family `table_rank_sort`

**Task.** Rank rows by a named measure or find top/bottom after a filter.

**Response/template.** ordered sequence/category.

**Derivation.** Select correct measure/period, apply filter, compare exact values.

**Difficulty.** L1 unique top; L2 multi-period column; L3 ascending/descending with negatives; L4 rounded tie.

**Misconceptions/constraints.** When displayed values tie and hidden exact values differ, exact ranking is “cannot distinguish” unless table exposes precision.

**Feedback.** Show selected values in sorted order.

**Examples.**

1. A5,B9,C7 → B highest. L1.
2. rank 2025 growth, not 2025 level. L2.
3. displayed1.2 and1.2 → chart/table does not support a strict ranking. L3.

**Validation/coverage.** Exact/displayed-order partial-order checker.

### Family `table_change_across_columns`

**Task.** Compute absolute, percentage-point, or percent change across two columns.

**Response/template.** named numeric fields.

**Derivation.** Use declared change definition and same row/unit.

**Difficulty.** L1 absolute; L2 percentage points; L3 percent change; L4 select correct baseline period.

**Misconceptions/constraints.** Old value nonzero for percent change. Distractors swap row or denominator.

**Feedback.** Label old/new and formula.

**Examples.**

1. 40 to55 → absolute +15. L1.
2. 40% to55% → +15 percentage points, +37.5%. L2.
3. 2023→2025 change ignores intermediate column only when requested endpoints. L2.

**Validation/coverage.** Exact change identities.

### Family `table_missing_zero_suppressed`

**Task.** Interpret cell status and determine allowed arithmetic/claim.

**Response/template.** zero/missing/not applicable/suppressed/not yet plus claim.

**Derivation.** Read semantic status marker and footnote; only observed numeric values enter ordinary sums.

**Difficulty.** L1 zero versus blank; L2 symbols/footnotes; L3 suppressed interval; L4 incomplete period.

**Misconceptions/constraints.** Legend for markers always visible. Suppressed values may provide bounds only if stated.

**Feedback.** State exactly what is and is not known.

**Examples.**

1. `0` means observed zero. L1.
2. `—` defined as not applicable cannot be added as zero. L2.
3. `<5` means suppressed bounded count, so exact total may be a range. L3.

**Validation/coverage.** Typed missingness states and range propagation.

### Family `table_chart_value_match`

**Task.** Match table rows/series to marks or identify a transcription mismatch.

**Response/template.** matching or first mismatch.

**Derivation.** Apply chart transform/scale to table semantic values and compare mark encodings.

**Difficulty.** L1 direct bars; L2 reordered categories; L3 normalized/indexed chart; L4 one planted mismatch.

**Misconceptions/constraints.** At most one mismatch unless multi-select named. Use semantic geometry tolerance.

**Feedback.** Link each table cell to its mark.

**Examples.**

1. table A=4 maps to bar height4. L1.
2. chart sorted descending while table alphabetical → match by label, not position. L2.
3. index chart uses base=100, so raw120 may map to index110 depending base raw value. L3.

**Validation/coverage.** Transform then geometry round trip.

### Family `table_supported_claim`

**Task.** Select the strongest claim supported by a table and its scope.

**Response/template.** controlled claim choice.

**Derivation.** Evaluate predicates over exact displayed records, period, population, and missingness.

**Difficulty.** L1 direct comparison; L2 “all/some/most”; L3 incomplete/suppressed; L4 avoid causal/generalized claim.

**Misconceptions/constraints.** Only one maximally informative warranted option. No open prose.

**Feedback.** Cite confirming rows and any limiting rows.

**Examples.**

1. every displayed quarter exceeds target10 → supported for displayed quarters. L1.
2. 3 of5 categories rose → “most displayed categories rose.” L2.
3. one region missing → cannot claim every region rose. L3.

**Validation/coverage.** Claim AST evaluated over semantic table.

### Cross-family progression

Header navigation precedes aggregation. Totals precede denominator-specific percentages. Ranking and change add comparison while missing-state practice limits unjustified conclusions. Table/chart matching transfers exact records into visuals; supported-claim questions integrate scope and quantifiers.

## 4. Category: Bar charts, line charts, and time series

### Category purpose

Read and compare magnitudes, changes, and trends while respecting baselines, grouping, time spacing, and missing observations.

### Learn

Bars compare lengths from a common baseline; grouped bars compare adjacent series; stacked bars emphasize totals and composition but make interior segments harder to compare. Lines connect ordered positions, usually time, and show change between observations—not unobserved causes or necessarily continuous measurement.

### Prerequisites

Axes, legends, tables, absolute/relative change.

### Category boundaries

This category handles categorical/time displays. Distribution bars and scatterplots come later.

### Subcategories

1. Simple and grouped bars
2. Stacked/diverging bars
3. Line values and change
4. Irregular/missing time series
5. Cumulative and indexed series
6. Small multiples and reference lines

### Common misconceptions

- Comparing bar endpoints when baselines differ.
- Confusing grouped series via legend.
- Comparing stacked segment endpoints instead of lengths.
- Treating a line between observations as measured intermediate values.
- Calling any short-term movement a trend.
- Interpreting cumulative total as period amount.

### Family `bar_value_compare`

**Task.** Read, difference, ratio, or rank simple bars.

**Response/template.** numeric/category: `Compare {categories} by {measure}.`

**Derivation.** Invert shared scale at each endpoint; apply named comparison.

**Difficulty.** L1 exact ticks; L2 interpolation; L3 negative/diverging; L4 tie within display precision.

**Misconceptions/constraints.** Common baseline unless baseline is target. Unique visible result.

**Feedback.** Project endpoints to axis and calculate.

**Examples.**

1. A8,B12 → B exceeds A by4. L1.
2. A20,B30 → B is1.5× A. L2.
3. rounded bars both≈7 → no strict rank supported. L3.

**Validation/coverage.** Exact values and displayed resolvability.

### Family `grouped_bar_series_read`

**Task.** Select correct series/category intersection and compare within/across groups.

**Response/template.** numeric/ranking.

**Derivation.** Resolve category position and legend encoding, then read shared axis.

**Difficulty.** L1 two series; L2 reordered legend; L3 missing group bar; L4 cross-category difference-in-differences.

**Misconceptions/constraints.** Patterns/shapes supplement color. Group spacing unmistakable.

**Feedback.** Highlight legend key and target pair.

**Examples.**

1. Q2 Plan B bar=14. L1.
2. Plan A rises4 while B rises1 → A has larger increase. L2.
3. absent B bar marked missing is not zero. L3.

**Validation/coverage.** Series/category key lookup and difference.

### Family `stacked_bar_segment`

**Task.** Calculate segment value from cumulative endpoints or compare segments.

**Response/template.** numeric/comparison.

**Derivation.** Segment value = upper endpoint − lower endpoint; compare lengths, not absolute endpoints.

**Difficulty.** L1 labeled values; L2 read endpoints; L3 non-common baselines; L4 several bars.

**Misconceptions/constraints.** Interior boundaries resolvable. Reject tiny segments.

**Feedback.** Bracket segment and subtract endpoints.

**Examples.**

1. segment spans20 to35 →15. L1.
2. segment ending50 is not necessarily larger than one ending45; starting points matter. L2.
3. compare top segments by their thickness/length. L2.

**Validation/coverage.** Stack component sums and geometry.

### Family `diverging_bar_read`

**Task.** Read positive/negative or two-sided response composition around a central baseline.

**Response/template.** percentage/category comparison.

**Derivation.** Resolve each signed side/segment; compute totals only from compatible components.

**Difficulty.** L1 one category; L2 neutral center; L3 compare net versus total agreement; L4 unequal missing shares.

**Misconceptions/constraints.** Legend labels direction. A 100% scale is explicit.

**Feedback.** Separate positive, neutral, negative and define requested net.

**Examples.**

1. agree60%, disagree25%, neutral15%. L1.
2. net agreement = agree−disagree =35 points when defined. L2.
3. longer agree side does not imply more than50% if baseline is centered after excluding neutral; inspect denominator. L3.

**Validation/coverage.** Composition sum and signed comparison.

### Family `line_value_change`

**Task.** Read values at two positions and compute direction/amount of change.

**Response/template.** endpoints and change.

**Derivation.** Resolve series and dates; `change=end−start`.

**Difficulty.** L1 exact points; L2 interpolation; L3 multiple series; L4 nonzero axis and relative change.

**Misconceptions/constraints.** Prompt distinguishes level, change, and rate.

**Feedback.** Mark endpoints; subtract labeled values.

**Examples.**

1. Jan10 toFeb14 → +4. L1.
2. series A rises while B falls. L2.
3. a steep-looking rise from98 to100 is +2, not “doubling.” L3.

**Validation/coverage.** Endpoint semantic values and exact change.

### Family `line_slope_rate`

**Task.** Compare average rate of change over declared intervals.

**Response/template.** value per time/ranking.

**Derivation.** `(end value−start value)/(elapsed time)`.

**Difficulty.** L1 equal intervals; L2 unequal; L3 negative; L4 choose steepest numeric rate across panels/aspect ratios.

**Misconceptions/constraints.** Use axis units, not visual angle. Intervals have exact dates.

**Feedback.** Show rise/run in data units.

**Examples.**

1. +12 over3 months →4/month. L1.
2. +10 over2 years beats +12 over4 years in average rate. L2.
3. different chart aspect ratios cannot be compared by screen angle. L3.

**Validation/coverage.** Exact duration-normalized slopes.

### Family `step_chart_value`

**Task.** Read a value immediately before, at, or after a change in a step chart.

**Response/template.** numeric with boundary side: `What is the value {before_at_after} {change_time}?`

**Derivation.** Apply the displayed left-continuous or right-continuous convention to horizontal segments and jump markers.

**Difficulty.** L1 away from jump; L2 at right-continuous jump; L3 compare before/after; L4 irregular event times.

**Misconceptions/constraints.** Filled/open endpoint markers and convention are explicit. Do not interpolate along vertical jumps.

**Feedback.** Highlight the horizontal segment owning the queried time.

**Examples.**

1. right-continuous step changes5→8 at t=3; value at t=3 is8. L1.
2. immediately before t=3, value is5. L2.
3. vertical jump represents an instantaneous change under model, not all intermediate values over elapsed time. L3.

**Validation/coverage.** Piecewise-constant function and endpoint semantics.

### Family `area_chart_component`

**Task.** Read an ordinary or stacked area chart and distinguish total height from component thickness.

**Response/template.** total/component value or supported comparison.

**Derivation.** Ordinary area uses baseline-to-boundary height; stacked component uses upper boundary minus lower boundary.

**Difficulty.** L1 one series; L2 stacked component; L3 changing stack order; L4 overlapping transparent areas and limitation.

**Misconceptions/constraints.** Quantitative value comes from vertical thickness, not colored screen area across time. Baseline and stack order visible.

**Feedback.** Take a vertical slice and label boundaries.

**Examples.**

1. filled boundary at12 above zero → value12. L1.
2. stacked band spans20 to35 → component15, total boundary35. L2.
3. total colored area over a time span is not a period total unless integration is explicitly defined. L3.

**Validation/coverage.** Boundary/component/stack-total identities at sampled x-values.

### Family `time_series_missing_gap`

**Task.** Interpret gaps, interpolated segments, or incomplete periods.

**Response/template.** status/claim choice.

**Derivation.** Inspect record missingness and transform metadata.

**Difficulty.** L1 explicit gap; L2 dashed interpolation; L3 partial latest period; L4 compare series with different coverage.

**Misconceptions/constraints.** Line renderer never connects missing values unless declared imputation.

**Feedback.** Distinguish observed, estimated, and absent values.

**Examples.**

1. no March point/line gap → March value unknown. L1.
2. dashed line labeled linear interpolation is estimate, not observation. L2.
3. 2025 through June cannot be directly compared as full year with 2024 total. L3.

**Validation/coverage.** Missingness/estimate style round trip.

### Family `cumulative_vs_period`

**Task.** Convert between cumulative line values and period increments.

**Response/template.** numeric: `How much was added during {interval}?`

**Derivation.** Period increment = later cumulative − earlier cumulative.

**Difficulty.** L1 adjacent points; L2 missing interval; L3 cumulative reset; L4 detect impossible unexplained decrease.

**Misconceptions/constraints.** Cumulative definition and reset policy visible.

**Feedback.** Show total-to-date subtraction.

**Examples.**

1. cumulative40 then55 → period addition15. L1.
2. line at100 means total so far, not that period's100. L1.
3. annual reset at Jan is not a negative event when label declares reset. L3.

**Validation/coverage.** Prefix-sum/increment round trip.

### Family `indexed_series_compare`

**Task.** Read an index chart and compare relative changes from different baselines.

**Response/template.** index/relative-change fields.

**Derivation.** Base period100; index130 means30% above that series' base value.

**Difficulty.** L1 one series; L2 multiple different raw bases; L3 rebase; L4 distinguish index gap from raw gap.

**Misconceptions/constraints.** Base date and formula shown. Never infer raw levels without base values.

**Feedback.** Translate each index into multiplier of its own base.

**Examples.**

1. index115 →15% above base. L1.
2. A index120 and B110 means A grew more relatively, not necessarily has higher raw level. L2.
3. rebasing changes displayed index levels but not underlying relative path. L3.

**Validation/coverage.** Raw/index transform and rebase invariance.

### Family `small_multiple_compare`

**Task.** Compare panels while checking whether axes/domains are shared.

**Response/template.** claim choice/ranking.

**Derivation.** Resolve per-panel scale; compare numeric values, changes, or shapes as requested.

**Difficulty.** L1 shared axes; L2 free y-scales; L3 different date windows; L4 choose repair.

**Misconceptions/constraints.** Scale mode labeled. Distractors compare visual height/slope directly.

**Feedback.** Display panel domains side by side.

**Examples.**

1. shared axes allow direct height comparison. L1.
2. panel maxima10 and1,000 make equal pixel heights incomparable as levels. L2.
3. same shaped relative change can occur at very different absolute levels. L3.

**Validation/coverage.** Panel-scale-aware predicate evaluator.

### Cross-family progression

Simple and grouped bars establish common-baseline reading. Stacks and diverging bars add component boundaries. Line endpoints precede rates, then step-boundary and area-thickness semantics. Missingness precedes cumulative/indexed transforms. Small multiples cap the category by forcing explicit scale comparison rather than shape matching.

## 5. Category: Part-to-whole and composition displays

### Category purpose

Read component shares while preserving the whole, denominator, and limitations of angle/area encodings.

### Learn

A part-to-whole chart is meaningful only when categories are mutually exclusive for the displayed whole and shares use the same denominator. Pie angles total360°. A 100% stacked bar compares proportions even when group totals differ. Treemap area represents share but is harder to compare precisely than a common-position bar.

### Prerequisites

Percentages, legends, stacked bars, and table totals.

### Category boundaries

This category reads bounded compositions. Probability partitions and statistical contingency analysis belong elsewhere.

### Subcategories

1. Pie/donut parts and angles
2. 100% stacked comparisons
3. Treemap areas
4. Waterfall contributions
5. Whole/denominator validity

### Common misconceptions

- Treating pie radius as share.
- Assuming visually similar wedges are equal without labels.
- Comparing raw group counts from 100% bars.
- Comparing treemap side length rather than area.
- Adding overlapping categories as though they partition a whole.
- Confusing waterfall endpoint with individual contribution.

### Family `pie_share_angle`

**Task.** Convert between component amount, share, and pie angle.

**Response/template.** amount/percent/degrees.

**Derivation.** `share=part/whole`; `angle=share×360°`.

**Difficulty.** L1 friendly quarter/half; L2 arbitrary exact percent; L3 missing part; L4 displayed rounding.

**Misconceptions/constraints.** Positive mutually exclusive parts sum to whole. Do not infer from radius.

**Feedback.** Show part/whole then full-circle scaling.

**Examples.**

1. 25 of100 →25% →90°. L1.
2. 30% →108°. L2.
3. other wedges total280° → missing80°=`22.22…%`. L3.

**Validation/coverage.** Exact share-angle round trip and total360.

### Family `pie_slice_compare`

**Task.** Rank or difference pie/donut components using labels and exact shares.

**Response/template.** category/ranking/percentage-point difference.

**Derivation.** Resolve legend and compare semantic shares.

**Difficulty.** L1 labeled distinct slices; L2 close shares; L3 donut with center total; L4 rounded tie.

**Misconceptions/constraints.** Close unlabeled slices are not used for exact ranking. 3D perspective prohibited.

**Feedback.** Show shares as a common-baseline mini bar table.

**Examples.**

1. A40%,B25% → A larger by15 points. L1.
2. center total200 and slice30% → amount60. L2.
3. displayed22% and22% do not support strict order. L3.

**Validation/coverage.** Component share/amount consistency.

### Family `hundred_percent_stack`

**Task.** Compare category proportions across groups in 100% stacked bars.

**Response/template.** share/percentage-point change/category.

**Derivation.** Segment share equals its length on0–100 scale; raw amount requires group total.

**Difficulty.** L1 endpoint segment; L2 interior subtraction; L3 different group totals; L4 missing/other category.

**Misconceptions/constraints.** Never infer raw count from share without total.

**Feedback.** Show proportion and, when given, multiply by group total.

**Examples.**

1. segment0–35 →35%. L1.
2. interior segment40–65 →25%. L2.
3. 50% of group100 is fewer than40% of group200. L3.

**Validation/coverage.** Each group sums100 within rounding policy.

### Family `composition_denominator_change`

**Task.** Explain/compute how excluding, filtering, or adding a category changes shares.

**Response/template.** new percentage and supported claim.

**Derivation.** Recompute each retained part over new denominator.

**Difficulty.** L1 remove category; L2 “unknown” excluded; L3 compare charts with different universes; L4 infer denominator.

**Misconceptions/constraints.** Title/footnote defines whole. Reject causal interpretation.

**Feedback.** Place old/new numerator and denominator side by side.

**Examples.**

1. A30 of100; exclude20 unknown → A becomes37.5% of80. L2.
2. a larger displayed share can result from smaller denominator with unchanged numerator. L2.
3. two pies for “all users” and “paying users” are not direct population shares. L3.

**Validation/coverage.** Filtered partition recalculation.

### Family `treemap_area_read`

**Task.** Interpret nested rectangle areas and hierarchy.

**Response/template.** parent/child, share, or comparison.

**Derivation.** Rectangle area fraction within parent equals value share within parent; nested shares multiply for whole.

**Difficulty.** L1 top-level labeled; L2 nested share; L3 compare nonadjacent rectangles; L4 identify precision limitation.

**Misconceptions/constraints.** Area, not width/height alone. Exact numeric questions expose labels.

**Feedback.** Convert rectangles to labeled area fractions.

**Examples.**

1. A occupies half total area →50%. L1.
2. child X is40% of parent A, A50% total → X20% total. L2.
3. wider but much shorter rectangle may have smaller area. L2.

**Validation/coverage.** Hierarchical area sums and geometry.

### Family `waterfall_contribution`

**Task.** Read sequential positive/negative contributions and final total.

**Response/template.** contribution/running total/missing step.

**Derivation.** Apply signed steps to starting level; connector endpoints are cumulative totals.

**Difficulty.** L1 one step; L2 several signs; L3 subtotal/reset; L4 infer missing contribution.

**Misconceptions/constraints.** Legend and baseline distinguish totals from changes.

**Feedback.** Running arithmetic aligned to bars.

**Examples.**

1. start100,+20,−15 → final105. L1.
2. bar from120 down to110 contributes−10, not110. L2.
3. start50,end80,known changes+40 and−5 → missing−5. L3.

**Validation/coverage.** Signed prefix-sum engine.

### Family `part_whole_validity`

**Task.** Decide whether a proposed part-to-whole display has a coherent partition/denominator.

**Response/template.** valid/invalid plus reason.

**Derivation.** Test mutual exclusivity, exhaustiveness/“other,” nonnegative shares, common denominator, and total within rounding tolerance.

**Difficulty.** L1 sum not100; L2 overlapping categories; L3 different denominators; L4 multi-response data requiring non-partition display.

**Misconceptions/constraints.** Totals of101% may be valid rounding when exact shares sum100; profile states tolerance.

**Feedback.** Show partition test, not just arithmetic.

**Examples.**

1. 40%+35%+25%=100% with exclusive categories → valid. L1.
2. hobbies may overlap, so shares totaling160% should not be a pie. L2.
3. rounded33%,33%,33%=99% may be acceptable with rounding note. L3.

**Validation/coverage.** Category-membership and exact-share partition oracle.

### Cross-family progression

Pie conversion establishes whole/share/angle. Slice comparison and 100% stacks introduce percentage-point reading. Denominator-change questions prevent treating normalized charts as raw counts. Treemaps and waterfalls add area and sequential encodings. Partition validity then asks whether a composition chart is meaningful at all.

## 6. Category: Distribution displays

### Category purpose

Extract counts, intervals, center/spread cues, and shape information without claiming raw detail that aggregation removed.

### Learn

Dot/strip plots show individual observations. Histograms group values into bins; a bar says how many values fall in an interval, not their exact positions. Box plots show five-number summaries, not distribution detail within quarters. Cumulative-frequency curves show how many or what share are at or below a value.

### Prerequisites

Numeric axes, intervals, counts/percentages, and table missingness.

### Category boundaries

This category reads displays. Computing variance, fitting distributions, and inference remain in Probability and Statistics.

### Subcategories

1. Dot/strip plots
2. Histograms and bins
3. Unequal-width histograms
4. Box plots
5. Cumulative distributions
6. Display comparison and limitations

### Common misconceptions

- Treating histogram bars as categories.
- Inferring exact observations inside a bin.
- Using height rather than area for unequal bins.
- Treating a box's width or whisker as frequency.
- Assuming an outlier marker is an error.
- Inferring modality from a box plot.

### Family `dot_plot_count_value`

**Task.** Read frequencies, totals, mode, or ordered positions from a dot plot.

**Response/template.** count/value.

**Derivation.** Each dot is one observation unless weight explicitly declared.

**Difficulty.** L1 count at value; L2 total/mode; L3 stacked groups; L4 median position.

**Misconceptions/constraints.** Dot jitter never changes x-value. Limit24 observations.

**Feedback.** Count highlighted dots and show ordered list when needed.

**Examples.**

1. three dots above5 → frequency3. L1.
2. tallest stack at7 → mode7. L2.
3. 9 dots total → median is5th ordered dot. L3.

**Validation/coverage.** Raw records-to-dot bijection.

### Family `histogram_bin_count`

**Task.** Read count/relative frequency for a declared bin or total range.

**Response/template.** integer/percentage.

**Derivation.** Select bins by boundary rule and sum heights for equal-width frequency histogram.

**Difficulty.** L1 one bin; L2 boundary value; L3 several bins; L4 relative-frequency conversion.

**Misconceptions/constraints.** Boundary convention displayed. Bars touch.

**Feedback.** Highlight interval and inclusion brackets.

**Examples.**

1. `[10,20)` height6 → six values at least10 and below20. L1.
2. value20 belongs to `[20,30)`, not previous bin. L2.
3. counts4+7 across two selected bins →11. L2.

**Validation/coverage.** Raw binning and boundary tests.

### Family `histogram_shape_claim`

**Task.** Select supported claims about concentration, skew cue, gaps, or modal interval.

**Response/template.** controlled claim choice.

**Derivation.** Evaluate bin counts/areas and topology; avoid claims about exact raw mode/mean.

**Difficulty.** L1 modal interval/gap; L2 skew direction; L3 binning sensitivity; L4 compare two shapes.

**Misconceptions/constraints.** Wording says “appears” for coarse shape and “modal interval,” not exact mode.

**Feedback.** Cite bins supporting and limits.

**Examples.**

1. `[20,30)` has greatest count → modal interval. L1.
2. sparse bins extend farther right → right-tail cue. L2.
3. exact largest observation cannot be known from final occupied bin alone. L3.

**Validation/coverage.** Semantic histogram predicates.

### Family `unequal_bin_density`

**Task.** Compute/read frequency density and compare unequal-width bins by area.

**Response/template.** density/frequency/comparison.

**Derivation.** `frequency=density×width`; bar area represents frequency.

**Difficulty.** L1 compute density; L2 infer count; L3 compare tall narrow/short wide; L4 normalized relative density.

**Misconceptions/constraints.** Axis labeled frequency density. Friendly widths/areas.

**Feedback.** Draw width×height rectangle arithmetic.

**Examples.**

1. frequency10,width5 → density2. L1.
2. density3,width4 → frequency12. L2.
3. height4,width2 has area8, less than height3,width4 area12. L3.

**Validation/coverage.** Bin areas sum total frequency.

### Family `box_plot_five_number`

**Task.** Read minimum, Q1, median, Q3, maximum, IQR, or range.

**Response/template.** named numeric fields.

**Derivation.** Invert axis positions; `IQR=Q3−Q1`, `range=max−min`.

**Difficulty.** L1 one landmark; L2 IQR/range; L3 horizontal/reversed; L4 outlier convention.

**Misconceptions/constraints.** Whisker endpoints are labeled as min/max or non-outlier endpoints per profile.

**Feedback.** Label five marks and subtract.

**Examples.**

1. box from20 to35 → IQR15. L1.
2. median line at28. L1.
3. whisker endpoint40 with separate outlier50: displayed maximum observation50, upper non-outlier endpoint40. L3.

**Validation/coverage.** Five-number geometry and declared outliers.

### Family `box_plot_compare`

**Task.** Compare medians, IQRs, ranges, or supported distribution claims across box plots.

**Response/template.** category/claim.

**Derivation.** Read corresponding landmarks on common/per-panel scales.

**Difficulty.** L1 median; L2 spread; L3 overlap does not determine individual ordering; L4 unequal panel axes.

**Misconceptions/constraints.** Do not infer sample size, modality, mean, or every pairwise relation unless shown.

**Feedback.** Mark only the summary components used.

**Examples.**

1. A median30>B median25. L1.
2. A IQR10<B IQR18 → B has wider middle half. L2.
3. overlapping boxes do not imply equal distributions. L3.

**Validation/coverage.** Five-number predicate checker.

### Family `cumulative_frequency_read`

**Task.** Read count/percentage at or below a value, quantile, or interval count from cumulative curve.

**Response/template.** numeric/quantile.

**Derivation.** Evaluate cumulative `F(x)`; interval count uses difference of cumulative values with boundary convention.

**Difficulty.** L1 direct point; L2 inverse median; L3 interval difference; L4 two groups.

**Misconceptions/constraints.** Curve should be nondecreasing. Exact queries align to resolvable grid.

**Feedback.** Project value to curve to cumulative axis, or reverse.

**Examples.**

1. at x=20 cumulative70% →70% at or below20. L1.
2. curve reaches50% at x=14 → median about14. L2.
3. F(30)=.8,F(20)=.5 →30% in `(20,30]`. L3.

**Validation/coverage.** Sorted-data empirical CDF round trip.

### Family `distribution_display_limits`

**Task.** Decide what can/cannot be inferred from dot plot, histogram, or box plot.

**Response/template.** supported/not supported claims.

**Derivation.** Compare claim-required information with representation's retained semantic fields.

**Difficulty.** L1 exact values from dot; L2 histogram aggregation; L3 box summary; L4 compare two encodings.

**Misconceptions/constraints.** Claims use exact information requirements, not vague “detail.”

**Feedback.** State what encoding preserves and discards.

**Examples.**

1. dot plot reveals every displayed observation. L1.
2. histogram cannot reveal exact median unless bin/data happen to make it identifiable. L2.
3. box plot does not show whether distribution is bimodal. L3.

**Validation/coverage.** Representation-information capability matrix.

### Cross-family progression

Dot plots begin with individual records. Equal-width histograms introduce aggregation before unequal-bin density. Box plots replace detail with five-number summaries. Cumulative curves add inverse reading. Limit questions interleave throughout so visual fluency does not become overclaiming.

## 7. Category: Relationships, multivariate displays, and maps

### Category purpose

Read relationships among variables and additional encodings while separating association, group structure, magnitude, and geography.

### Learn

A scatterplot shows paired observations. Direction and form may be visible, but association does not establish causation. Position is generally more precise than area or color. Bubble size normally represents area; heatmap and choropleth values require a legend. Geographic region size is not data magnitude.

### Prerequisites

Axes, legends, rates, distribution limits, and cautious claim language.

### Category boundaries

This category reads bivariate/mapped displays. Correlation/regression calculation, causal study design, and GIS belong elsewhere.

### Subcategories

1. Scatterplot coordinates and association
2. Groups, outliers, and trend lines
3. Bubble and heatmap encodings
4. Choropleth and symbol maps

### Common misconceptions

- Swapping x and y.
- Treating a trend line as every point.
- Inferring causation from visual association.
- Comparing bubble radii as magnitudes.
- Treating darker color as larger without checking legend direction.
- Reading raw counts in maps as risk/rate.

### Family `scatter_point_coordinate`

**Task.** Read or locate a paired point.

**Response/template.** `(x,y)` named fields or selectable point.

**Derivation.** Project point to each respective axis.

**Difficulty.** L1 exact grid; L2 interpolation; L3 log one axis; L4 overlapping points/count annotation.

**Misconceptions/constraints.** Axis variable names explicit. Points resolvable or aggregated count shown.

**Feedback.** Draw orthogonal guides to axes.

**Examples.**

1. point at x=3,y=7 → `(3,7)`. L1.
2. x halfway10–20,y on4 → `(15,4)`. L2.
3. swapping gives a different observation unless axes same variable. L2.

**Validation/coverage.** Data-point to SVG coordinate round trip.

### Family `scatter_association_claim`

**Task.** Classify visible direction/form/strength coarsely and select bounded claims.

**Response/template.** positive/negative/none; linear/curved; controlled claim.

**Derivation.** Use generated exact point set and robust qualitative thresholds; confirm option predicates numerically in oracle.

**Difficulty.** L1 clear direction; L2 nonlinear; L3 clusters; L4 weak/ambiguous as “no clear pattern.”

**Misconceptions/constraints.** Never grade fine subjective strength boundaries. No causal language.

**Feedback.** Trace overall pattern and note deviations.

**Examples.**

1. points rise left-to-right → positive association. L1.
2. U-shaped pattern → strong relationship but not linear direction. L2.
3. association alone does not show x causes y. L2.

**Validation/coverage.** Constructed pattern class plus correlation/nonlinear checks.

### Family `scatter_group_cluster`

**Task.** Compare group patterns or identify aggregation hiding group structure.

**Response/template.** group/claim selection.

**Derivation.** Evaluate per-group and pooled predicates.

**Difficulty.** L1 separate clusters; L2 within-group direction; L3 pooled reversal; L4 missing legend group.

**Misconceptions/constraints.** Groups use shape plus color. Do not demand formal Simpson calculation.

**Feedback.** Show per-group mini summaries and pooled limitation.

**Examples.**

1. triangles occupy higher y than circles at similar x. L1.
2. pooled positive pattern can coexist with flat patterns inside groups. L3.
3. one cluster may indicate a third grouping variable, not proof of cause. L3.

**Validation/coverage.** Group-specific versus pooled predicate oracle.

### Family `scatter_outlier_trendline`

**Task.** Identify an unusual point and read residual direction relative to a supplied trend line.

**Response/template.** point, above/below, approximate residual.

**Derivation.** Compare observed y with line y at same x; residual=`observed−predicted`.

**Difficulty.** L1 above/below; L2 numeric residual; L3 high-leverage versus vertical outlier; L4 line extrapolation.

**Misconceptions/constraints.** “Outlier” means unusual under displayed criterion, not erroneous.

**Feedback.** Draw vertical observed-minus-line segment.

**Examples.**

1. observed12,line prediction9 → residual+3. L1.
2. far-right point can have high leverage even with small residual. L3.
3. trend line beyond observed x-range is extrapolation. L2.

**Validation/coverage.** Exact line/point residual and range.

### Family `bubble_area_encoding`

**Task.** Convert/compare bubble area and encoded magnitude.

**Response/template.** ratio/value.

**Derivation.** Under area encoding, area ratio=value ratio and radius ratio is square root of value ratio.

**Difficulty.** L1 legend sizes; L2 ratio; L3 detect radius-coded error; L4 combine position and size.

**Misconceptions/constraints.** Legend states area. Exact comparison uses labels/constructed ratios.

**Feedback.** Compare circles by area and show radius relation.

**Examples.**

1. value4× requires radius2×. L2.
2. radius2× produces area4×, not value2× under area encoding. L2.
3. bubble x/y and size represent three different variables. L1.

**Validation/coverage.** Circle geometry/value transform.

### Family `heatmap_legend_read`

**Task.** Use continuous/binned color legend to read a cell and compare values.

**Response/template.** interval/category/ranking.

**Derivation.** Resolve row/column then map semantic value through legend thresholds.

**Difficulty.** L1 labeled discrete bins; L2 continuous approximate; L3 reversed palette; L4 missing cell.

**Misconceptions/constraints.** Color never sole accessible cue; cells expose labels/pattern/table. Exact values require annotations.

**Feedback.** Highlight cell and legend band.

**Examples.**

1. cell in band20–30 → value known only in that interval. L1.
2. darker means smaller when legend descends. L2.
3. hatched cell labeled missing is not lowest value. L2.

**Validation/coverage.** Threshold inclusion and accessible-table match.

### Family `choropleth_rate_count`

**Task.** Determine whether a choropleth maps counts or normalized rates and choose valid regional comparison.

**Response/template.** measure/denominator/claim.

**Derivation.** Read title/legend; when rate, compare normalized values, not inferred counts.

**Difficulty.** L1 explicit rate; L2 per-capita conversion with supplied population; L3 count-map audit; L4 unequal region size/population.

**Misconceptions/constraints.** Synthetic geography only. No political/public-health content.

**Feedback.** Separate geographic area, population/exposure, count, and rate.

**Examples.**

1. map legend “per1,000 residents” encodes rate. L1.
2. region rate20/1,000 with population5,000 implies count100 if requested. L2.
3. larger/darker region need not contain more total events when map shows rate. L3.

**Validation/coverage.** Region data, rate transform, legend class.

### Family `symbol_map_compare`

**Task.** Read location and proportional-symbol magnitude on a map.

**Response/template.** region/value ratio.

**Derivation.** Resolve symbol to location and legend area mapping.

**Difficulty.** L1 labeled values; L2 area ratios; L3 overlapping symbols; L4 distinguish symbol from region fill.

**Misconceptions/constraints.** Symbols use non-overlapping or selectable layers; geography is synthetic.

**Feedback.** Isolate symbol and compare to legend reference.

**Examples.**

1. circle matches legend100 → value100. L1.
2. area4× reference → value4×. L2.
3. region's land area does not change symbol value. L2.

**Validation/coverage.** Symbol geometry/value and region-key match.

### Cross-family progression

Coordinates precede qualitative association. Group and outlier families limit pooled/trend claims. Bubble and heatmap exercises introduce less precise size/color channels. Maps then require explicit normalization and separation of data marks from geographic area.

## 8. Category: Uncertainty, denominators, and fair comparison

### Category purpose

Read uncertainty and normalize comparisons so a visible difference is not mistaken for a precise, like-for-like conclusion.

### Learn

A point may be an estimate rather than an exact population value. Error bars and bands mean only what their legend says. Counts depend on population/exposure; percentages depend on denominators; indexed values depend on a base. Always compare compatible units and coverage.

### Prerequisites

Intervals, percentages, rates, chart metadata, and cautious claim language.

### Category boundaries

This category interprets supplied uncertainty and comparison bases. It does not calculate sampling distributions or run significance tests.

### Subcategories

1. Error bars and bands
2. Precision and sample size
3. Counts, rates, and percentages
4. Index/base and coverage normalization
5. Weighted/subgroup comparisons

### Common misconceptions

- Assuming all error bars are confidence intervals.
- Treating estimate endpoints as observed minimum/maximum.
- Declaring significance from overlap alone.
- Comparing counts when exposure differs.
- Confusing percentage points with percent change.
- Averaging subgroup percentages without weights.

### Family `interval_endpoint_width`

**Task.** Read interval endpoints, center, half-width, or full width.

**Response/template.** named numeric fields.

**Derivation.** Invert endpoint positions; width=`upper−lower`; symmetric half-width when declared.

**Difficulty.** L1 labeled endpoints; L2 derive width; L3 asymmetric; L4 log-axis interval.

**Misconceptions/constraints.** Interval meaning stated separately. Exact questions align to scale.

**Feedback.** Label lower, estimate/center, upper.

**Examples.**

1. interval[12,18] → width6. L1.
2. estimate20 with bars−3/+5 →[17,25], asymmetric. L2.
3. interval[10,40] on a log axis has visual midpoint20, the geometric center—not arithmetic center25. L3.

**Validation/coverage.** Endpoint geometry and arithmetic/log-center distinction.

### Family `error_bar_semantics`

**Task.** Interpret an error bar under its explicitly labeled definition.

**Response/template.** controlled claim/endpoint.

**Derivation.** Map legend type to permitted statement: range covers observed extrema; SD describes spread; SE/CI concerns estimate precision under stated model.

**Difficulty.** L1 range; L2 SD versus CI; L3 compare same centers/different meanings; L4 detect missing definition.

**Misconceptions/constraints.** If meaning absent, correct answer is that semantics cannot be determined.

**Feedback.** Quote legend definition and reject incompatible interpretation.

**Examples.**

1. bars labeled min–max[4,11] → observed range4 to11. L1.
2. ±1 SD is not automatically a95% CI. L2.
3. unlabeled error bars do not support a precise probability interpretation. L3.

**Validation/coverage.** Interval-type claim whitelist.

### Family `interval_overlap_claim`

**Task.** Compare supplied intervals and choose what overlap/non-overlap alone supports.

**Response/template.** overlap amount plus bounded claim.

**Derivation.** Compute interval intersection; apply only displayed semantics.

**Difficulty.** L1 disjoint/overlap; L2 nested; L3 confidence intervals; L4 same estimates/different widths.

**Misconceptions/constraints.** Never use overlap as universal significance test. Formal test unavailable unless separately supplied.

**Feedback.** Draw intersection and state inference limit.

**Examples.**

1. [2,5] and[4,8] overlap on[4,5]. L1.
2. non-overlapping ranges mean the displayed ranges do not share values. L2.
3. overlapping95% CIs do not by themselves determine a two-estimate test result. L3.

**Validation/coverage.** Interval arithmetic and semantic claim rules.

### Family `uncertainty_band_read`

**Task.** Read a central series with a range/uncertainty band at a named x-value.

**Response/template.** estimate, lower, upper, membership.

**Derivation.** Resolve x and three semantic series; test value inclusion.

**Difficulty.** L1 one point; L2 changing width; L3 overlapping groups; L4 missing/extrapolated band.

**Misconceptions/constraints.** Shading plus boundary styles/text. Band is not interpreted between x-values beyond stated interpolation.

**Feedback.** Vertical slice through band.

**Examples.**

1. at x=5 center10, band8–13. L1.
2. value12 lies within displayed band. L1.
3. widening future band represents greater displayed uncertainty, not necessarily higher expected value. L3.

**Validation/coverage.** Band functions and point inclusion.

### Family `sample_size_precision_context`

**Task.** Read sample-size annotations and select cautious precision/coverage claims.

**Response/template.** sample size/comparison/claim.

**Derivation.** Extract `n` by group/period; use only supplied rule (e.g. displayed interval widths), not universal quality inference.

**Difficulty.** L1 read n; L2 unequal groups; L3 changing n and interval width; L4 missing/respondent base.

**Misconceptions/constraints.** Larger n alone does not remove bias or prove representativeness.

**Feedback.** Separate amount of data, interval precision, and sampling quality.

**Examples.**

1. label `n=80` means80 observations in defined sample. L1.
2. group A n=500 and B n=20: B estimate may be visibly less precise under same model. L2.
3. huge convenience sample can still be biased. L3.

**Validation/coverage.** Sample metadata and supported-claim matrix.

### Family `count_rate_denominator`

**Task.** Convert/compare raw counts and rates with differing exposure/population.

**Response/template.** count/rate plus justified ranking.

**Derivation.** `rate=count/exposure×rate_base`.

**Difficulty.** L1 same exposure; L2 differing populations; L3 person-time/capacity; L4 choose denominator.

**Misconceptions/constraints.** Exposure positive and relevant. No real risk advice.

**Feedback.** Put numerator/denominator beside each group.

**Examples.**

1. 50 events/1,000 →50 per1,000. L1.
2. A80/4,000=20/1,000; B60/2,000=30/1,000: A has more events but lower rate. L2.
3. per-hour rates require hours, not number of machines alone. L3.

**Validation/coverage.** Exact normalization and rank reversals.

### Family `percentage_point_percent_change`

**Task.** Distinguish percentage-point change from relative percent change.

**Response/template.** two named percentage fields.

**Derivation.** Points=`new−old`; relative=`(new−old)/old×100%`.

**Difficulty.** L1 friendly; L2 decrease; L3 near-zero baseline; L4 claim repair.

**Misconceptions/constraints.** Old nonzero. Wording never says merely “percent difference” when ambiguous.

**Feedback.** Show percentage levels and old baseline.

**Examples.**

1. 20% to30% →+10 points,+50%. L1.
2. 50% to40% →−10 points,−20%. L2.
3. “rose10%” is ambiguous/wrong when chart only shows a10-point rise unless baseline clarifies. L3.

**Validation/coverage.** Exact dual calculation.

### Family `coverage_period_normalize`

**Task.** Normalize totals for unequal observation periods or identify invalid direct comparison.

**Response/template.** rate per period/projected comparison with caveat.

**Derivation.** Divide by covered duration only when constant-rate comparison is declared; otherwise state incomplete coverage.

**Difficulty.** L1 month totals; L2 partial year; L3 seasonality caveat; L4 overlapping windows.

**Misconceptions/constraints.** Projection is never treated as observation. Seasonal contexts block naive annualization unless assumption supplied.

**Feedback.** Show coverage timeline and assumption.

**Examples.**

1. 60 over6 months → average10/month. L1.
2. compare first6 months with prior full year directly → invalid coverage. L2.
3. annualizing summer-only use requires a constant-rate assumption not shown. L3.

**Validation/coverage.** Date coverage and rate transform.

### Family `weighted_aggregate_rate`

**Task.** Combine subgroup rates using subgroup denominators.

**Response/template.** overall rate and comparison.

**Derivation.** Sum numerators/sum denominators, equivalently denominator-weighted rate.

**Difficulty.** L1 equal groups; L2 unequal; L3 infer counts from rates; L4 compare unweighted error.

**Misconceptions/constraints.** Do not average percentages unless weights equal.

**Feedback.** Reconstruct numerators and total denominator.

**Examples.**

1. equal-size groups20% and40% →30%. L1.
2. 10/100 and80/200 →90/300=30%, not25%. L2.
3. group rates alone without sizes cannot determine overall rate. L3.

**Validation/coverage.** Aggregate identity and insufficiency cases.

### Family `subgroup_overall_reversal`

**Task.** Compare subgroup and pooled displays and recognize a composition-driven reversal.

**Response/template.** within-group/overall rankings and controlled explanation.

**Derivation.** Compute exact conditional and pooled rates; attribute arithmetic reversal to different subgroup weights without causal speculation.

**Difficulty.** L1 no reversal; L2 two subgroups; L3 strict reversal; L4 missing weight prevents conclusion.

**Misconceptions/constraints.** Synthetic neutral contexts. “Different composition explains arithmetic result” is not a causal claim.

**Feedback.** Table group rates and weights before pooled total.

**Examples.**

1. A higher in each subgroup but lower overall → strict reversal. L3.
2. equal subgroup weights prevent this particular weighted-average reversal when all within directions agree. L2.
3. without subgroup sizes, pooled rate cannot be reconstructed. L3.

**Validation/coverage.** Strict inequality certificates and weight decomposition.

### Cross-family progression

Interval mechanics precede semantics, then overlap limitations and bands. Sample size is introduced as context, not an automatic quality score. Count/rate and percentage distinctions establish normalization before coverage periods, weighted aggregates, and subgroup reversals.

## 9. Category: Misleading displays and claim auditing

### Category purpose

Diagnose how design, selection, and wording affect interpretation and replace an overclaim with the strongest defensible statement.

### Learn

A chart can be numerically accurate yet visually disproportionate or incomplete. Audit in order:

1. scope/source/period;
2. axis, baseline, and transform;
3. denominator and unit;
4. encoding proportionality;
5. missing/filtering/aggregation;
6. whether the claim matches the displayed evidence.

Describe the consequence rather than guessing intent.

### Prerequisites

All preceding scale, chart, missingness, normalization, and claim-reading skills.

### Category boundaries

This category audits synthetic displays and controlled claims. External fact checking, rhetoric analysis, and accusations of deception are excluded.

### Subcategories

1. Scale and window effects
2. Encoding distortions
3. Selection and omission
4. Comparability and source scope
5. Claim repair

### Common misconceptions

- Calling every nonzero axis misleading.
- Assuming visual steepness equals rate.
- Detecting one flaw and ignoring a still-valid limited claim.
- Treating correlation as causation.
- Assuming omitted data would necessarily reverse the result.
- Attributing malicious intent from the chart alone.

### Family `audit_truncated_bar`

**Task.** Quantify exaggeration from a nonzero bar baseline and evaluate a magnitude claim.

**Response/template.** true/apparent ratio plus verdict.

**Derivation.** Compare data magnitude ratio with displayed length ratio.

**Difficulty.** L1 identify; L2 calculate; L3 close values; L4 repair baseline/alternate dot plot.

**Misconceptions/constraints.** Baseline visible. Wording critiques effect, not intent.

**Feedback.** Overlay zero-baseline version.

**Examples.**

1. values95 and100 are only5.26% apart. L1.
2. baseline90 makes lengths5 and10 → visual2× despite value ratio1.053. L2.
3. claim “B is twice A” is unsupported by values. L2.

**Validation/coverage.** Value/length ratio calculations.

### Family `audit_cherry_picked_window`

**Task.** Compare claims under displayed versus longer supplied time windows.

**Response/template.** trend claim by window and scope-correct wording.

**Derivation.** Compute endpoint/trend predicates for both exact windows.

**Difficulty.** L1 rising short window; L2 longer reversal; L3 cyclic data; L4 choose justified period.

**Misconceptions/constraints.** A short window is not inherently invalid; claim must name it.

**Feedback.** Highlight selected and omitted intervals.

**Examples.**

1. Mar–May rises while Jan–Dec falls overall. L2.
2. “rose from March to May” remains true; “rose throughout year” does not. L2.
3. choosing a window cannot establish why movement occurred. L3.

**Validation/coverage.** Window-specific predicate engine.

### Family `audit_dual_axis`

**Task.** Read two y-axes correctly and determine whether apparent alignment/crossing has invariant meaning.

**Response/template.** paired values and claim verdict.

**Derivation.** Map each series through its own scale; rescale panels to test visual alignment dependence.

**Difficulty.** L1 correct axis; L2 crossing; L3 correlation impression; L4 repair with indexed/small multiples.

**Misconceptions/constraints.** Axes visibly associated with series via style+labels. Do not ban dual axes categorically.

**Feedback.** Separate scales and show alternate valid scaling.

**Examples.**

1. left line uses0–100, right uses0–10. L1.
2. equal pixel height does not mean equal numeric values/units. L2.
3. a crossing can move when either axis range changes, so crossing date may lack data meaning. L3.

**Validation/coverage.** Independent scale inversion and rescaling test.

### Family `audit_aspect_ratio_slope`

**Task.** Decide whether different chart shapes change data rate or only apparent steepness.

**Response/template.** numeric slope and visual-effect claim.

**Derivation.** Calculate slope in units/time, then vary width/height while keeping data fixed.

**Difficulty.** L1 same data two aspect ratios; L2 compare series; L3 slope ranking across panels; L4 recommend common scaling.

**Misconceptions/constraints.** Numeric trend unchanged. Never grade aesthetics.

**Feedback.** Overlay identical endpoints with rise/run values.

**Examples.**

1. stretching vertically makes line steeper visually, not numerically. L1.
2. +10 over5 days remains2/day in both renderings. L2.
3. screen angle across differently scaled panels is invalid comparison. L3.

**Validation/coverage.** Rendering transforms preserve semantic slope.

### Family `audit_unequal_histogram_bins`

**Task.** Detect/count consequences of plotting unequal-width bins by raw height instead of density.

**Response/template.** corrected density/which display valid.

**Derivation.** Compare intended frequency area with renderer heights/widths.

**Difficulty.** L1 identify unequal widths; L2 calculate density; L3 modal-bin reversal; L4 repair axes.

**Misconceptions/constraints.** Exact frequencies supplied/accessibly available.

**Feedback.** Re-render density histogram and compare areas.

**Examples.**

1. width10 count20 → density2. L1.
2. width2 count8 density4 may be taller than width10 count20 density2 despite lower count. L2.
3. raw-count heights with unequal widths make areas misrepresent frequencies. L3.

**Validation/coverage.** Area-frequency proportionality test.

### Family `audit_area_volume_encoding`

**Task.** Identify and correct magnitude distortion when icons/circles/3D objects scale linear dimensions.

**Response/template.** actual visual area/volume ratio versus intended value ratio.

**Derivation.** Area scales by linear factor squared; volume by cubed.

**Difficulty.** L1 doubled icon dimensions; L2 circles; L3 3D volumes; L4 compute correct scale factor.

**Misconceptions/constraints.** Clear shape geometry; 3D used only as flaw target.

**Feedback.** Show exponent relationship.

**Examples.**

1. double width and height →4× area. L1.
2. intended value2× needs circle radius `sqrt(2)×`, not2×. L2.
3. cube side3× produces27× volume. L3.

**Validation/coverage.** Geometry/value proportionality.

### Family `audit_omitted_categories`

**Task.** Evaluate a ranking/share claim when categories are filtered, “other” omitted, or top-N shown.

**Response/template.** scoped claim/insufficiency choice.

**Derivation.** Read filter metadata; evaluate claim over displayed subset versus full data when supplied.

**Difficulty.** L1 top5 label; L2 omitted other; L3 ranking changes; L4 unknown omitted values.

**Misconceptions/constraints.** Do not assert omitted values reverse result unless data establish it.

**Feedback.** State universe and subset explicitly.

**Examples.**

1. tallest among “Top5 products” supports top within displayed five. L1.
2. pie without Other cannot claim displayed categories exhaust all responses. L2.
3. if omitted categories unknown, global largest cannot be determined. L3.

**Validation/coverage.** Filter-aware claim evaluation.

### Family `audit_cumulative_period_mix`

**Task.** Detect comparison between cumulative and period values or mismatched aggregation.

**Response/template.** measure labels and corrected comparison.

**Derivation.** Inspect transform/time grain; convert cumulative differences to periods or aggregate periods consistently.

**Difficulty.** L1 label mismatch; L2 derive increment; L3 monthly versus annual; L4 rolling window.

**Misconceptions/constraints.** Same units alone are insufficient; aggregation semantics visible.

**Feedback.** Align time grain and transform.

**Examples.**

1. year-to-date120 cannot be compared directly with April monthly20 as same kind of value. L1.
2. cumulative March100,April125 → April increment25. L2.
3. rolling12-month total overlaps adjacent periods heavily; consecutive points are not independent annual blocks. L3.

**Validation/coverage.** Transform metadata compatibility.

### Family `audit_color_legend`

**Task.** Diagnose ambiguous, reversed, non-monotone, or inaccessible color encoding and select repair.

**Response/template.** legend interpretation/repair choice.

**Derivation.** Test value-to-color mapping order, category distinctness, and non-color fallback.

**Difficulty.** L1 reverse legend; L2 binned thresholds; L3 rainbow/nonordered; L4 color-vision ambiguity.

**Misconceptions/constraints.** Do not grade personal color naming; semantic swatches have patterns/labels.

**Feedback.** Map values to ordered legend and accessible alternative.

**Examples.**

1. dark-to-light legend descends, so darkest is lowest. L1.
2. adjacent bins both rendered indistinguishably → comparison unsupported visually. L2.
3. sequential magnitude should use ordered luminance/pattern labels rather than arbitrary category colors. L3.

**Validation/coverage.** Legend mapping and simulated contrast/distinguishability checks.

### Family `audit_scope_source_claim`

**Task.** Check whether claim population, period, unit, and provenance match chart title/source/footnote.

**Response/template.** supported/overgeneralized plus repaired claim.

**Derivation.** Parse claim AST and compare each scope slot with chart metadata.

**Difficulty.** L1 wrong year; L2 sample versus population; L3 revised definition/partial coverage; L4 multiple scope defects.

**Misconceptions/constraints.** Source presence does not prove quality; absence limits traceability but does not itself falsify values.

**Feedback.** Side-by-side claim scope and display scope.

**Examples.**

1. chart covers surveyed users, so claim about all residents overgeneralizes. L2.
2. data through June do not establish full-year total. L1.
3. source note says definition changed in2024, limiting before/after comparability. L3.

**Validation/coverage.** Metadata-claim constraint solver.

### Cross-family progression

Scale/window audits reuse exact reading before introducing dual axes and aspect ratio. Histogram and area/volume families test encoding proportionality. Omission, cumulative mismatch, color, and source scope then broaden the audit beyond geometry. Every diagnosis ends with a narrower valid claim or concrete repair.

## 10. Category: Chart selection, construction, and repair

### Category purpose

Choose and build a compact display whose encoding matches the comparison and whose labels make independent verification possible.

### Learn

Choose a chart from the task:

- categories/levels → bar or dot;
- change over ordered time → line;
- part of one coherent whole → part-to-whole, often bar before pie;
- distribution → dot/histogram/box depending retained detail;
- relationship between two quantitative variables → scatter;
- geographic rate pattern → choropleth.

Then choose a truthful transform, readable domain/ticks, explicit units/denominator, direct labels or legend, and an accessible data alternative.

### Prerequisites

All chart families, scale semantics, comparability, and audit skills.

### Category boundaries

Construction uses structured controls and generated data, not freehand design or subjective aesthetics. Dashboard layout and software operation are excluded.

### Subcategories

1. Chart/encoding choice
2. Transform and normalization
3. Axis/domain/tick design
4. Data-to-mark construction
5. Labels, annotations, and accessibility
6. Repair and verification

### Common misconceptions

- Choosing pie for overlapping categories or line for unordered categories.
- Starting magnitude bars away from zero to “show detail.”
- Sorting time chronologically by value.
- Omitting units/denominators because values are labeled.
- Using color alone for identity.
- Repairing one issue while changing the data.

### Family `choose_chart_for_question`

**Task.** Choose the strongest supported chart type for data type and intended comparison.

**Response/template.** single choice plus reason clause.

**Derivation.** Decision schema uses variable types, ordering, number of groups, whole/partition, and task.

**Difficulty.** L1 categories/time; L2 distribution/relationship; L3 several acceptable but one best for precise comparison; L4 reject impossible part-to-whole.

**Misconceptions/constraints.** Distractors violate a named semantic requirement, not merely taste.

**Feedback.** Connect question verb to visual channel.

**Examples.**

1. monthly level over two years → line chart. L1.
2. distribution of50 measurements → histogram/dot depending detail; histogram when shape is goal. L2.
3. overlapping multi-select responses → bar, not pie. L3.

**Validation/coverage.** Data/task-to-encoding rule matrix.

### Family `choose_normalization_transform`

**Task.** Choose count, rate, percentage, index, cumulative, or change transform for a comparison goal.

**Response/template.** transform and formula/denominator.

**Derivation.** Match goal and exposure/base; verify transform from raw records.

**Difficulty.** L1 count versus percent; L2 per-capita; L3 index for relative growth; L4 preserve both raw and normalized context.

**Misconceptions/constraints.** Normalization must have meaningful denominator. Do not normalize merely to force similarity.

**Feedback.** Show what question each transform answers.

**Examples.**

1. compare incidents across unequal populations → rate per population. L1.
2. compare relative growth of differently sized series → base-100 index. L2.
3. compare workload and incidence fairly → show both count and rate, not one pretending to answer both. L3.

**Validation/coverage.** Transform applicability and exact computation.

### Family `design_axis_domain_ticks`

**Task.** Select or complete axis domain, ticks, scale, baseline, unit, and precision.

**Response/template.** structured axis editor.

**Derivation.** Enclose data/reference values, use monotone scale, meaningful tick steps, zero baseline for magnitude bars, and justified readable precision.

**Difficulty.** L1 linear bars; L2 negative range; L3 log multi-decade; L4 outlier/reference tradeoff.

**Misconceptions/constraints.** More ticks are not automatically better. Reject clipped marks and unlabeled transforms.

**Feedback.** Preview chosen scale and list passed/failed criteria.

**Examples.**

1. bars values0–43 → domain0–50,ticks10 is valid. L1.
2. changes−8 to12 → domain perhaps−10–15 with visible zero. L2.
3. values1–100,000 may justify log scale when ratios are the task. L3.

**Validation/coverage.** Domain containment, mapping, tick uniqueness, label collision heuristic.

### Family `construct_bar_from_table`

**Task.** Create/complete bar marks from a small categorical table.

**Response/template.** place/size bars or fill semantic height fields.

**Derivation.** Map each category value from shared zero baseline through axis scale.

**Difficulty.** L1 three bars; L2 grouped; L3 negative/diverging; L4 find one incorrect mark.

**Misconceptions/constraints.** Keyboard numeric alternative required. Order policy stated.

**Feedback.** Table-to-mark guides and baseline check.

**Examples.**

1. A4,B7,C2 → three corresponding lengths. L1.
2. two series per category use legend-consistent grouped positions. L2.
3. −3 extends left/below zero, not encoded as length+3 on positive side. L3.

**Validation/coverage.** Every mark geometry round-trips to table value.

### Family `construct_line_from_table`

**Task.** Plot/complete ordered observations with correct time spacing and missing gaps.

**Response/template.** ordered points/segments.

**Derivation.** Sort by semantic time, map coordinates, connect only allowed adjacent observed records.

**Difficulty.** L1 regular dates; L2 irregular; L3 multiple series; L4 missing/interpolated styles.

**Misconceptions/constraints.** Never sort time by value. No line across missing data without declared transform.

**Feedback.** Compare plotted point list with source rows.

**Examples.**

1. Jan3,Feb5,Mar4 plotted chronologically. L1.
2. Jan,Feb,May use elapsed spacing when scale says date. L2.
3. missing March produces gap. L2.

**Validation/coverage.** Temporal order, coordinate, and segment adjacency.

### Family `design_legend_labels`

**Task.** Match series to distinct accessible styles and repair ambiguous labels/legend.

**Response/template.** style-label matching or direct-label placement.

**Derivation.** Ensure one-to-one mapping, sufficient distinction, consistent order, and no mark occlusion.

**Difficulty.** L1 two series; L2 four/patterns; L3 direct labels; L4 semantic ordering.

**Misconceptions/constraints.** Color alone insufficient. Avoid relying on localized label length assumptions.

**Feedback.** Trace each style through chart and accessible table.

**Examples.**

1. solid circles=A, dashed triangles=B consistently. L1.
2. legend order matches stack order where practical. L2.
3. direct labels at line ends can reduce lookup if unambiguous. L3.

**Validation/coverage.** One-to-one style map and contrast/pattern checks.

### Family `annotation_reference_line`

**Task.** Add/interpret a target, average, event, or threshold annotation without confusing it with data.

**Response/template.** annotation type/value/label.

**Derivation.** Map reference through scale; style separately; label source/meaning.

**Difficulty.** L1 horizontal target; L2 event date; L3 average of displayed values; L4 threshold scope/uncertainty.

**Misconceptions/constraints.** Reference calculation supplied or exact. Annotation never hides marks.

**Feedback.** State whether reference is data, computed summary, or external benchmark.

**Examples.**

1. target10 → horizontal labeled line at10. L1.
2. vertical line at policy-change date marks timing, not proof of causal effect. L2.
3. displayed-series mean line must be labeled mean and derived from exact points. L3.

**Validation/coverage.** Reference semantics and geometry.

### Family `chart_repair_accessible_summary`

**Task.** Repair a flawed chart and produce/select concise accessible text preserving its main evidence and limitations.

**Response/template.** structured repair choices plus controlled summary clauses.

**Derivation.** Keep dataset invariant; correct scale/encoding/labels/missingness; derive summary from claim AST.

**Difficulty.** L1 missing unit; L2 baseline/legend; L3 multiple defects; L4 preserve a valid limited conclusion.

**Misconceptions/constraints.** Exactly specified defects. Summary includes chart type, variables, range/period, main supported comparison, and relevant limitation.

**Feedback.** Before/after checklist and data-invariance proof.

**Examples.**

1. add y-unit and zero baseline to magnitude bars. L1.
2. replace radius-scaled bubbles with area-scaled circles and legend. L2.
3. summary: “Among five displayed regions in2025, rate B was highest; one region is missing, so no all-region claim follows.” L3.

**Validation/coverage.** Repaired chart round-trips to same data; summary predicates all true.

### Cross-family progression

Chart selection begins from the analytical question, followed by normalization and scale design. Bar/line construction makes semantic mapping concrete. Legend and annotation work adds communication. Repair/accessible-summary questions integrate the full pipeline while requiring that underlying data remain unchanged.

## 11. Topic-level progression

### Level 1: Direct reading

- Identify title, axes, unit, legend, category, and period.
- Read exact ticks, cells, simple bars/lines, labeled shares, and point coordinates.
- Distinguish count, percent, zero, and missing.
- Use small displays with one encoding and a common baseline.

### Level 2: Comparison and transformation

- Interpolate on linear axes.
- Calculate differences, ratios, percentage points, rates, segment values, and cumulative increments.
- Read grouped/stacked bars, histograms, box plots, scatterplots, and basic error bars.
- Coordinate table, legend, and chart.

### Level 3: Scale and scope awareness

- Handle truncated/reversed/broken/log/time-irregular axes.
- Compare different denominators, group sizes, time coverage, indexes, and panel scales.
- Interpret uncertainty definitions, missingness, unequal bins, area encodings, and maps.
- Select only claims supported by population, period, and display resolution.

### Level 4: Audit and repair

- Diagnose dual axes, aspect ratio, window selection, omitted categories, aggregation mismatch, and inaccessible encodings.
- Reconstruct missing values/bases from invariants.
- Recognize subgroup/overall reversals and information lost to aggregation.
- Repair a chart without changing its data or overclaiming.

### Level 5: Integrated data-literacy brief

- Inspect a generated table, source note, and one or more charts.
- Verify chart/table consistency.
- calculate the relevant normalized comparison;
- identify the strongest supported and unsupported claims;
- locate one planted design/scope problem or certify the display under the pinned checklist;
- choose/construct a clearer accessible replacement.

Level increases through representational coordination and judgment, not denser pixels or longer tables.

## 12. Adaptive practice guidance

Track family, chart type, scale type, transform, denominator, representation direction, and misconception:

- `unit_ignored`
- `tick_marks_vs_intervals`
- `assume_zero_baseline`
- `linear_read_on_log_axis`
- `up_means_larger`
- `false_precision`
- `blank_as_zero`
- `wrong_percentage_denominator`
- `stack_endpoint_as_segment`
- `line_implies_observation`
- `cumulative_as_period`
- `index_as_raw_level`
- `hist_height_with_unequal_width`
- `boxplot_overclaim`
- `association_as_causation`
- `bubble_radius_as_value`
- `map_area_as_magnitude`
- `error_bar_universal_meaning`
- `count_rate_confusion`
- `points_vs_percent_change`
- `unweighted_percent_average`
- `balanced_visual_means_fair_comparison`

After an error:

- Wrong linear interpolation → isolate one interval before returning to full chart.
- Log error → pair linear/log axes with the same endpoints and ask difference versus ratio.
- Wrong stacked segment → show its two endpoints and request subtraction.
- Missing treated as zero → use identical line charts with observed zero versus gap.
- Count/rate error → display numerator and denominator in a two-row table.
- Causal overclaim → retain same scatterplot but ask which purely descriptive clause is justified.
- Every chart flagged “misleading” → present defensible nonzero line axis and ask for specific consequence.

Suggested session mix:

- 55% current-level mixed chart reading;
- 20% scale/denominator prerequisite repair;
- 15% spaced review across representations;
- 10% audit, inverse, or construction tasks.

Speed matters only after accuracy. Long response time with correct scale inspection should not be penalized as misconception.

## 13. Answer checking and claim semantics

### Numeric and graphical responses

- Derive canonical answers from exact semantic data.
- Use exact arithmetic for counts, ratios, percentages, indexes, bin areas, and dates.
- Use display-aware tolerance only for requested visual estimates.
- Click/drag responses snap to semantic targets within a pixel tolerance, then are graded by target ID/value.
- Never infer a learner's numeric answer by measuring their freehand pixel geometry when structured values are available.

### Controlled claims

Represent claims as an AST:

```text
Claim {
  subject,
  population,
  filter,
  period,
  measure,
  unit,
  comparison,
  direction,
  magnitude,
  quantifier,
  uncertaintyQualifier,
  causalStrength
}
```

Evaluate each slot against the chart model. Distinguish:

- true and supported;
- false;
- numerically possible but not determined;
- overgeneralized beyond scope;
- causal claim unsupported by descriptive display;
- too precise for display.

When several options are true, the prompt asks for all supported claims or defines “strongest” as the most informative claim whose every clause is supported.

### Feedback sequence

1. Restate requested quantity/claim.
2. Identify title, unit, scale, denominator, and relevant series.
3. Extract exact/readable values.
4. Calculate comparison or apply encoding rule.
5. State conclusion and limitation.

Feedback should diagnose the operation:

> You used the bar endpoint `65` as the segment size. This segment starts at `40`, so its share is `65−40=25%`.

> `80` is the event count. The chart asks for events per 1,000; divide by the population `4,000` to obtain `20 per 1,000`.

> The bars overlap, but the legend does not define them as confidence intervals. Their statistical meaning cannot be inferred.

## 14. Rendering, interaction, and accessibility

- Use SVG generated from semantic scales/marks; Canvas may supplement dense views only with semantic hit regions.
- Every chart has an exact accessible table and concise text summary.
- Axis labels, tick labels, legends, source notes, and footnotes are ordinary selectable text where possible.
- Keyboard users can traverse marks in logical order and hear category/series/value/unit/status.
- Focus order follows title → metadata → axes → legend → marks → annotations → source/note.
- Color is supplemented by shape, pattern, dash, direct label, or table.
- Tooltips repeat available data but are never the only access path.
- Responsive views reflow/scroll; they do not shrink text below readable thresholds.
- Zoom does not clip labels or detach legends.
- Missing, estimated, selected, and uncertainty states differ by text/style beyond color.
- Reduced-motion preference disables animated transitions; animation never encodes unavailable values.
- Locale changes number/date formatting and text direction without changing geometry semantics or values.

Charts designed as flawed audit stimuli must remain readable enough to diagnose; accessibility is never intentionally broken as the lesson.

## 15. Implementation architecture

The app is standalone HTML/CSS/JavaScript with no backend, live data, or runtime chart library dependency required.

Recommended modules:

- seeded PRNG and replay token;
- exact rational/decimal/date arithmetic;
- semantic variable/dataset/table models;
- typed missingness and source metadata;
- scale library: linear, log, time, reversed, broken, band;
- transforms: filter, group, aggregate, percentage, rate, index, cumulative, bin, density;
- marks/layout: point, line, rect, area, arc, symbol, text;
- chart-specific semantic validators;
- claim AST and support evaluator;
- controlled flaw mutation/repair engine;
- SVG renderer and accessible table/summary generator;
- visual hit-testing mapped to semantic IDs;
- adaptive scheduler and misconception tagging;
- localization dictionaries for all fragments, units, statuses, and feedback.

Each instance stores:

```js
{
  seed,
  familyId,
  level,
  dataset,
  tableModel,
  chartSpec,
  exactTransforms,
  accessibleTable,
  requestedQuantity,
  canonicalAnswer,
  displayResolution,
  acceptedTolerance,
  claimOptions,
  flawMutation,
  misconceptionTags,
  workedSteps,
  structuralSignature
}
```

Generators create the dataset and question. Independent oracles calculate transforms/claims. Renderer output is a view, never the source of truth.

## 16. Automated validation requirements

Reject an instance unless:

- every axis is monotone on each declared segment and invertible for queried marks;
- data lie within domain unless clipping is the explicit audit target;
- ticks are distinct, ordered, correctly formatted, and sufficient for requested precision;
- geometry round-trips through scale inverse to semantic value within renderer tolerance;
- table, chart, accessible data, source note, and answer share one model;
- legend mappings are one-to-one and accessible without color;
- stack/composition totals satisfy declared denominator/rounding rules;
- histogram bins cover the intended domain without overlap/gaps and areas encode counts under unequal widths;
- cumulative curves match prefix totals and declared reset behavior;
- missing values remain missing through rendering unless a named transform is applied;
- interval/error-bar semantics are present whenever interpreted;
- rates/indexes/weighted aggregates use exact declared bases;
- claim options have audited truth/support statuses and required uniqueness;
- planted flaw has the intended consequence and no accidental second decisive flaw;
- repair preserves semantic data and removes the named defect;
- mark separation and label layout meet readability thresholds.

Independent checks include:

- raw records versus aggregation transform;
- transform output versus accessible table;
- semantic values versus SVG coordinates;
- scale forward/inverse round trip;
- pie angles/stack lengths/treemap areas versus shares;
- histogram raw binning versus displayed areas;
- raw and cumulative/indexed series round trips;
- region counts/rates versus map legend classes;
- interval endpoints versus bar/band geometry;
- claim AST evaluation versus brute-force record predicates;
- flaw mutation before/after metric (e.g. apparent ratio);
- repaired chart versus original dataset checksum.

Test suites require:

- golden fixtures for every family/level;
- fuzz tests across scale domains and locale formats;
- zero/negative/tiny/large value boundaries;
- log powers/minor ticks and broken/reversed axes;
- date spacing, missing observations, and partial periods;
- percentage rounding totals99/100/101;
- unequal histogram bins and boundary values;
- overlapping points and rounded ties;
- count/rate/index rank reversals;
- interval overlap and undefined-error-bar semantics;
- every flaw mutation and a corresponding defensible non-flawed control;
- keyboard/screen-reader semantic traversal;
- deterministic replay and snapshot/data checksum tests.

Developer mode exposes seed, exact dataset, transforms, chart spec, scale domains, mark geometry, claim truth table, flaw provenance, rejection reason, and accessible output.

## 17. Coverage requirements

This specification defines 81 question families:

- 10 anatomy/axis/scale;
- 8 table/lookup;
- 12 bar/line/time-series;
- 7 composition;
- 8 distribution;
- 8 relationship/map;
- 10 uncertainty/normalization;
- 10 audit;
- 8 selection/construction.

The implementation registry must compute and test this count.

Across a representative seeded corpus, cover:

- linear, nonzero, negative, reversed, broken, log, time, and categorical axes;
- count, amount, rate, percentage, percentage-point, index, cumulative, density, and interval values;
- exact ticks, interpolated marks, ranges, missing/suppressed values, and rounded ties;
- categorical, temporal, distributional, relational, hierarchical, and geographic displays;
- common baselines and deliberately non-common baselines;
- same/different denominators, periods, populations, panels, and series bases;
- supported, false, undetermined, overgeneralized, too-precise, and causal-overclaim options;
- forward reading, inverse placement, reconstruction, audit, selection, construction, and repair.

At least 25% of eligible questions should be inverse/audit/construction rather than direct read-off. At least 20% of claim questions should have “cannot determine” or scope limitation as the correct result, but it must not exceed40%. Non-flawed, defensible charts must appear at least as often as intentionally flawed ones in mixed practice.

No chart may exceed:

- 8 categories or 4 series in ordinary practice;
- 24 points for exact dot/scatter identification;
- 12 histogram bins;
- 8 treemap leaves;
- 12 table rows and 8 columns;
- 3 panels for cross-scale comparison;

unless a family explicitly trains overview rather than individual lookup.

## 18. Navigation and v1 priorities

Recommended views:

- **Learn:** anatomy/scale gallery, denominator guide, encoding reference, audit checklist.
- **Practice:** category, chart type, level, direct/inverse/audit filters.
- **Chart lab:** table ↔ chart ↔ claim with optional scaffolding.
- **Audit lab:** diagnose consequence and repair synthetic display.
- **Review:** saved misses by misconception and visual encoding.
- **Reference:** scale formulas, chart capability matrix, missingness and uncertainty glossary.

Minimum satisfying v1:

1. metadata and linear axes;
2. table lookup/totals/percent denominators;
3. simple/grouped/stacked bars;
4. line values, change, missing gaps, and cumulative increments;
5. pie/100% stacks;
6. dot plots, equal-width histograms, and box plots;
7. scatter coordinates and bounded association claims;
8. count versus rate and percentage points;
9. truncated-axis/window/omission audits;
10. chart selection and accessible table/summary.

V1.1 adds log/broken/reversed axes, unequal bins, error bars, maps, and broader repairs. V1.2 adds weighted/subgroup reversals, treemaps/waterfalls, bubble/heatmap displays, and richer construction.

## 19. Topic-level quality checklist

- [ ] Every chart and table derives from one exact semantic dataset.
- [ ] Canonical answers never depend on reverse-measuring rendered pixels.
- [ ] Every axis names variable, unit, scale, domain, direction, and readable ticks.
- [ ] Log axes contain only positive values and teach ratios rather than differences.
- [ ] Truncated/broken/reversed axes are visibly marked.
- [ ] Magnitude bars use zero baselines except explicit consequence/audit cases.
- [ ] Time spacing matches declared elapsed or categorical semantics.
- [ ] Zero, missing, not applicable, suppressed, and incomplete are distinct.
- [ ] Percentage/rate/index/cumulative displays expose denominator/base/transform.
- [ ] Histogram boundaries and unequal-bin density semantics are explicit.
- [ ] Error bars/bands always define their meaning before interpretation.
- [ ] Error-bar overlap is not taught as a universal significance test.
- [ ] Bubble/symbol magnitude is proportional to area under the pinned profile.
- [ ] Choropleth comparisons expose normalization and legend thresholds.
- [ ] Claims preserve period, population, unit, quantifier, uncertainty, and causal limits.
- [ ] “Misleading” feedback describes a measurable consequence, not presumed intent.
- [ ] Defensible unusual charts appear alongside flawed examples.
- [ ] Repairs preserve underlying data and remove the intended defect.
- [ ] Every chart has an accessible table and concise semantic summary.
- [ ] Color is never the sole carrier of identity, order, missingness, or selection.
- [ ] Every family has three instantiated examples and automated fixtures.
- [ ] Difficulty rises through scale/representation/judgment, not illegibility or clutter.
- [ ] All datasets are synthetic, stable, neutral, and safe for offline use.
