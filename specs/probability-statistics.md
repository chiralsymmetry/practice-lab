# Probability and Statistics — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, exact-probability oracle, statistical-computation helper, chart renderer, answer-checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Probability and Statistics

### Topic goal

Develop reliable intuition and computational fluency for reasoning under uncertainty and learning from data. The learner should become able to:

- describe a small dataset without losing its structure;
- construct and count sample spaces;
- apply complement, addition, multiplication, conditional-probability, and total-probability rules;
- distinguish independence from mutual exclusivity and reverse conditionals correctly;
- use Bayes’ theorem in probability, natural-frequency, odds, and multi-hypothesis forms;
- calculate and interpret expected value, variance, and common probability distributions;
- reason about samples, sampling distributions, standard errors, and the central limit theorem;
- construct and correctly interpret common confidence intervals;
- formulate and interpret bounded hypothesis tests without common p-value fallacies;
- analyze association, regression, contingency tables, experiments, bias, and confounding;
- communicate what a calculation does and does not establish.

The app should train decisions and mental models as well as formulas. A learner who can substitute numbers into Bayes’ theorem but still ignores base rates has not mastered the Bayes category.

### Position within Practice Lab

This topic owns general uncertainty and data reasoning. It may reuse:

- arithmetic, percentages, ratios, and weighted averages from **Mental Arithmetic**;
- expected monetary value as a context from **Everyday Economics**;
- finite counting and truth-table ideas from **Computer Science** and **Logic**;
- functions, areas, and simple sums from **Calculus**;
- vectors and least-squares ideas from **Linear Algebra**.

Those apps need not be completed first. Probability and Statistics must teach the locally required rule. It must not turn most questions into arithmetic endurance or repeat domain-specific investment, physics, or economics exercises without a statistical purpose.

### Audience and prerequisites

The primary range is practical numeracy through a solid first undergraduate course. The learner should know:

- fractions, decimals, percentages, ratios, and order of operations;
- simple algebra, including solving a one-variable linear equation;
- powers and square roots;
- reading axes and tables;
- summation notation by the time advanced categories are unlocked.

Calculus is not required for the core path. Continuous-density questions use areas and supplied CDFs before any integration. An optional advanced variant may ask for a simple integral only when Calculus is an explicit prerequisite.

### Scope

The topic includes:

- categorical and quantitative variables; populations, samples, parameters, and statistics;
- frequency tables, histograms, bar charts, dot plots, box plots, and scatterplots;
- mean, median, mode, weighted mean, range, interquartile range, variance, standard deviation, percentiles, z-scores, and transformation effects;
- finite sample spaces, multiplication/addition principles, permutations, combinations, and counting-based probabilities;
- events, complements, unions, intersections, conditional probability, independence, partitions, trees, and sampling with or without replacement;
- Bayes’ theorem using formulas, tables, trees, natural frequencies, odds, likelihood ratios, repeated evidence, and several hypotheses;
- discrete random variables, PMFs, CDFs, expectation, variance, covariance in bounded contexts, and linear transformations;
- Bernoulli, binomial, geometric, hypergeometric, and Poisson models;
- continuous density and CDF interpretation; uniform, exponential, and normal models;
- standardization, normal probabilities and quantiles, and declared normal approximations;
- random sampling, selection and measurement bias, estimator behavior, sampling distributions, standard error, law of large numbers, central limit theorem, and small bootstrap demonstrations;
- point estimation, margin of error, confidence intervals for one mean or proportion, and sample-size planning under declared assumptions;
- one-sample and two-sample inference in tightly controlled z/t/proportion settings, paired-versus-independent recognition, chi-square tables, errors, power, and p-values;
- contingency tables, covariance, correlation, least-squares regression with one predictor, residuals, coefficient of determination, extrapolation, outliers, and Simpson’s paradox;
- observational studies, randomized experiments, controls, blinding, confounding, and multiplicity at a conceptual/numerical level.

### Exclusions

Do not include in the initial app:

- probability puzzles that depend on misleading wording rather than a declared random mechanism;
- measure-theoretic probability, sigma-algebras, almost-sure convergence, or formal stochastic-process theory;
- unrestricted symbolic integration or derivation of distribution formulas;
- moment-generating functions, characteristic functions, order statistics, or asymptotic proofs;
- Markov chains, queues, time series, survival analysis, reliability engineering, Bayesian networks, MCMC, or hidden-state models;
- multivariable regression, generalized linear models, ANOVA beyond a possible later bounded category, mixed models, nonparametric test catalogues, or machine-learning model selection;
- arbitrary real datasets requiring network access, political interpretation, private information, or changing facts;
- medical diagnostic, legal, financial, or public-policy advice;
- claims that a p-value, confidence interval, Bayes factor, or correlation settles a substantive question without assumptions;
- rote biographies, named-paradox trivia, table memorization, or manual calculation with large datasets;
- free-form proof grading or open-ended research-design essays.

Static definitions may appear in Learn cards or as brief diagnostics, but they must not dominate practice.

### Normative probability model

- A sample space `Ω` contains the possible outcomes of a declared random experiment.
- An event is a subset of `Ω`.
- `P(A)` denotes probability; `Aᶜ` is the complement; `A∩B` is intersection; `A∪B` is union.
- `P(A|B)=P(A∩B)/P(B)` only when `P(B)>0`.
- Events are independent exactly when `P(A∩B)=P(A)P(B)`. When the relevant probabilities are positive, equivalent conditional equalities may be used.
- Mutually exclusive events have `P(A∩B)=0`; nonzero mutually exclusive events are not independent.
- “At least one” normally invites a complement, but the app must not imply that this is the only valid method.
- A fair die, shuffled deck, random digit, random sample, or independent trial is fair/random/independent only when the prompt says so.
- Selection from a finite collection is uniform only when explicitly stated.
- Sampling “without replacement” changes later probabilities; “with replacement” restores the selected item before the next draw.
- Ordered and unordered outcomes are distinguished in the semantic model even if a renderer uses similar objects.

Whenever equally likely outcomes are used to compute `favorable/total`, the generator must establish equal likelihood. It must never apply counting ratios to a non-uniform sample space.

### Normative statistical model

- A **population** is the target collection; a **sample** is the observed subset.
- A **parameter** describes a population or probability model. A **statistic** is computed from sample data.
- Variable types are categorical nominal, categorical ordinal, quantitative discrete, or quantitative continuous. Context may determine the classification.
- Unless stated otherwise, observations in a raw dataset are equally weighted.
- The arithmetic mean is `x̄=(Σx_i)/n`.
- For ordered data, the median is the middle value for odd `n` and the mean of the two middle values for even `n`.
- Quartiles use the **median-of-halves method excluding the overall median** when `n` is odd. A prompt using another convention must display it. Avoid datasets where competing conventions silently change an unlabelled answer.
- Population variance is `σ²=(Σ(x_i−μ)²)/N`; sample variance is `s²=(Σ(x_i−x̄)²)/(n−1)`.
- Population and sample standard deviations are the non-negative square roots of their respective variances.
- A z-score is `(x−μ)/σ` for a population/model or `(x−x̄)/s` only when the prompt explicitly requests sample standardization.
- Covariance and correlation questions state whether population or sample formulas apply.
- Simple regression uses ordinary least squares with an intercept unless the prompt says otherwise.

Data are generated from semantic records, not parsed back from rounded chart geometry.

### Random-variable and distribution conventions

- An uppercase symbol such as `X` denotes a random variable; lowercase `x` denotes a realized or possible value.
- A discrete PMF satisfies `p(x)≥0` and `Σp(x)=1`.
- A CDF is `F(x)=P(X≤x)`.
- `E[X]=Σxp(x)` for generated discrete cases. Variance is `Var(X)=E[X²]−E[X]²`.
- `SD(X)=sqrt(Var(X))`; variance carries squared units and standard deviation carries the original unit.
- `E[aX+b]=aE[X]+b` without an independence assumption.
- `Var(aX+b)=a²Var(X)`.
- `Var(X+Y)=Var(X)+Var(Y)` only when `X,Y` are independent or their covariance is accounted for.
- Binomial `X~Bin(n,p)` counts successes in `n` independent Bernoulli trials with constant success probability `p`.
- Geometric `X~Geom(p)` uses the **trial number of the first success**, so support is `1,2,...` and `E[X]=1/p`.
- Hypergeometric questions state population size, success count, draws, and no replacement.
- Poisson `X~Pois(λ)` counts events under the declared model; `E[X]=Var(X)=λ`.
- Exponential `X~Exp(λ)` uses rate `λ`, mean `1/λ`, and survival probability `P(X>t)=e^(−λt)`.
- Normal distributions use `N(μ,σ²)`, with the second parameter explicitly being variance. UI labels should also show `SD=σ` to prevent notation mistakes.

### Bayes and evidence conventions

Bayes questions distinguish:

- **prior** `P(H)`;
- **likelihood** `P(E|H)`;
- **marginal evidence** `P(E)`;
- **posterior** `P(H|E)`;
- **likelihood ratio** `P(E|H₁)/P(E|H₀)`;
- **prior odds** and **posterior odds**.

For diagnostic-style questions:

- sensitivity is `P(+|condition)`;
- specificity is `P(−|no condition)`;
- false-positive rate is `1−specificity`;
- positive predictive value is `P(condition|+)`.

Fictional, non-medical labels are preferred. If a familiar diagnostic context is used, it must be explicitly pedagogical and contain no personal recommendation.

Evidence items are conditionally independent given each hypothesis only when stated. Sequential odds multiplication may use the product of likelihood ratios only under that assumption.

### Inference conventions

- Sampling or assignment mechanisms are part of the question, never background decoration.
- A standard error is the standard deviation of a statistic’s sampling distribution, not the standard deviation of the raw observations.
- A frequentist confidence level describes long-run coverage of the method. Once an interval is calculated, the fixed parameter is not assigned a frequentist probability.
- A Bayesian credible interval may use a posterior-probability statement, but only in a family that supplies a prior and posterior model and names the interval “credible.”
- A p-value is the probability, under `H₀` and model assumptions, of a test statistic at least as extreme as observed in the direction(s) specified by `H₁`.
- A p-value is not `P(H₀|data)`, the probability the result arose “by chance,” or effect size.
- `α` is selected before seeing the test result in ordinary test-decision questions.
- Rejecting `H₀` means the data are sufficiently incompatible with `H₀` under the declared rule; failing to reject does not prove `H₀`.
- Type I error is rejecting a true `H₀`; Type II error is failing to reject a false `H₀`; power is `1−β`.
- Test families must state assumptions and whether alternatives are left-tailed, right-tailed, or two-sided.
- Practical significance and statistical significance are separate judgments.

The app must use “statistically significant at level α,” not the unqualified word “significant,” in formal feedback.

### Exact arithmetic, tables, and rounding

Use arbitrary-precision integer and rational arithmetic for finite probabilities, counts, exact means, and exact variances whenever practical:

```text
Rational := { numerator: BigInt, denominator: positive BigInt }
```

Normalize rationals by greatest common divisor. Combinatorial counts use `BigInt`.

Transcendental distribution values may use audited local implementations or versioned precomputed CDF/quantile tables. Every displayed probability stores an unrounded canonical value.

Default rules:

- surrounding whitespace is ignored;
- probabilities accept reduced or unreduced fractions, decimals, or percentages unless a representation is requested;
- percentages may include `%`; without `%`, the expected interpretation is made explicit in the field label;
- exact answers remain exact unless the prompt requests a decimal;
- decimal tolerance is the larger of half a unit in the last requested place and `1e−10` absolute;
- intermediate values must not be rounded unless the prompt instructs it;
- a learner answer produced by carrying the displayed precision receives tolerance consistent with that display;
- counts are non-negative integers and do not accept percentages;
- multiple values use named fields, not an ambiguous comma string;
- intervals use structured endpoints and open/closed controls;
- “between” is avoided unless inclusion of endpoints is immaterial or explicitly stated.

### Response and equivalence modes

Supported modes include:

- integer, rational/probability, decimal, percentage, and short numeric fields;
- single-choice and multiple-choice;
- ordered sequence and matching;
- event-expression builder;
- table cells or named fields;
- selectable regions/bars/points with an accessible table equivalent;
- short controlled text from a finite semantic vocabulary;
- formula assembly from supported tokens.

Do not require arbitrary prose to grade statistical interpretation. Interpretation questions use carefully authored semantic options, claim classification, or fillable controlled clauses.

Equivalent probability expressions are accepted if their exact evaluated values match and the task did not request a specific form. A question asking the learner to choose a rule or construct a model is graded structurally as well as numerically.

### Visual and data-display semantics

- Bar charts have separated category bars; histograms use adjoining interval bins.
- Every axis shows variable, unit, scale, and meaningful tick labels.
- Truncated axes are visibly marked and never used to manufacture a perceptual trick without asking about that exact issue.
- Histograms declare interval boundary conventions, normally `[a,b)`, with the final bin optionally closed.
- Box plots use the topic’s declared quartile convention and expose the five-number summary to assistive technology.
- Scatterplots are generated from exact point coordinates and have a table alternative.
- Probability trees label branch conditionals and preserve sibling sums of `1`.
- Venn diagrams have a region table alternative.
- Normal curves label the mean, requested cut points, and shaded region; shading is never the sole signal.
- Randomization/sampling animations are optional illustrations, never the answer oracle.
- Color is not the only carrier of group, sign, selection, or tail information.

### Difficulty philosophy

Difficulty should rise through:

- moving among verbal, tabular, symbolic, graphical, and natural-frequency representations;
- recognizing the correct sample space or conditioning set;
- distinguishing similar-looking but different quantities;
- inverse questions and missing components;
- more stages of dependent updating;
- deciding which model or inference procedure applies;
- interpreting a numerical result within its assumptions;
- combining at most two or three mastered ideas;
- reducing scaffolding after demonstrated mastery.

Difficulty must not rise through:

- huge datasets or long arithmetic;
- factorial-sized counts done by enumeration;
- obscure card/deck conventions;
- tiny illegible plots;
- gratuitously awkward decimals;
- withholding the random mechanism;
- ambiguous causal language;
- use of a more advanced distribution table without support;
- “gotcha” wording or paradox names;
- forcing a calculator for arithmetic unrelated to the target.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | Read one display, one-step complement/mean/count, or direct definition with visible structure |
| 2 | Two-step event rules, small combinations, direct distribution formula, or one standardization |
| 3 | Conditional reasoning, Bayes with a table/tree, sampling distributions, or a complete confidence interval |
| 4 | Representation transfer, model/test selection, sequential evidence, regression interpretation, or assumption diagnosis |
| 5 | Multi-hypothesis Bayes, mixed uncertainty, power/design trade-offs, Simpson’s paradox, and bounded synthesis |

Each instance also records independent dimensions: sample-space size, event overlap, dependency depth, number of hypotheses, data size, arithmetic form, representation, tail count, parameter-known status, and interpretation load.

### Generator and oracle model

Every instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `scenarioModel`, `populationModel`, `samplingModel`, `semanticData`, `eventAST`, `givensExact`, `requestedQuantity`, `canonicalAnswer`, `answerMode`, `equivalenceMode`, `roundingPolicy`, `assumptions`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedSolution`, `structuralSignature`, `modelVersion`, and `oracleVersion`.

Generation order:

1. choose a family and misconception target;
2. construct an exact probability/data/sampling model backward from friendly latent values;
3. derive every displayed representation from that semantic model;
4. solve with the primary exact or numerical oracle;
5. cross-check with an independent enumeration, algebraic identity, simulation-in-tests, or second numerical method;
6. generate distractors by named misconception transforms;
7. reject degenerate or accidentally ambiguous instances;
8. render text, controls, tables, and diagrams.

The standalone app performs generation and checking locally. It has no backend and must not fetch distribution tables, datasets, or statistical packages at runtime. Large randomized validation and comparison with trusted statistical libraries may happen during development/build time.

## 2. Category: Data, summaries, and displays

### Category purpose

Build the ability to identify what data represent, calculate compact summaries, and preserve the distinction between center, spread, position, shape, and display.

### Learn

Categorical variables name groups; quantitative variables measure or count. A summary is useful only for a suitable variable and question. Mean uses every value and is pulled by extremes; median depends on order and is resistant. Standard deviation describes typical distance from the mean, while IQR describes the middle half. A graph must be read from its scale and bin definitions, not its silhouette alone.

### Prerequisites

Arithmetic with fractions/decimals and reading axes.

### Common misconceptions

- Calling any numeric label quantitative, such as a postal code.
- Dividing a weighted sum by the number of groups instead of total weight.
- Forgetting to sort before finding median/quartiles.
- Mixing sample and population variance denominators.
- Reporting variance in original rather than squared units.
- Treating a histogram bin’s height as its exact individual values.
- Assuming similar means imply similar distributions.

### Subcategories

Variable and study units; frequency; center; spread and position; transformation; display interpretation.

### Family `classify_variable_and_unit`

**Task.** Identify observational unit, variable type, or suitable summary for a generated description.

**Response and template.** Single-choice/matching: `In this study, {observation_description} is recorded. What is the observational unit, and what type is {variable}?`

**Derivation.** Classification follows the semantic variable schema, not the surface presence of digits. The observational unit is the entity represented by one record.

**Generation.** Use a versioned library of unambiguous contexts with authored unit, variable-type, and suitable-summary labels.

**Difficulty.** L1 categorical versus quantitative; L2 nominal/ordinal/discrete/continuous; L3 identifier-versus-measure and multiple variables.

**Distractors, constraints, and feedback.** Distractors confuse a variable with its value, sample with unit, ordinal with numeric, or count with continuous measure. Avoid disputed cases. Feedback names what one row represents and what operations are meaningful.

**Examples.**

1. Each book’s genre → unit `book`, variable `categorical nominal`. L1.
2. Each customer’s 1–5 satisfaction rating → unit `customer`, `categorical ordinal`. L2.
3. A runner’s bib number and finish time → bib `identifier/nominal`, time `quantitative continuous`. L3.

**Validation.** Every context has authored semantic labels and allowed summaries; all distractors must differ semantically.

### Family `frequency_and_relative_frequency`

**Task.** Complete or interpret counts, proportions, percentages, and cumulative frequencies.

**Response and template.** Table cell/probability: `Complete the missing {frequency_kind} in the table of {variable}.`

**Derivation.** Count exact records; relative frequency is `count/n`; cumulative frequency follows displayed category/bin order.

**Difficulty.** L1 one count; L2 missing total or percentage; L3 cumulative table with one value inferred from other cells.

**Distractors, constraints, and feedback.** Use wrong denominator, percent/fraction confusion, or non-cumulative count. Counts remain manageable and categories exhaustive. Feedback shows numerator and total.

**Examples.**

1. 6 red among 20 → relative frequency `0.3=30%`. L1.
2. Frequencies `4,?,7`, total `16` → missing `5`. L2.
3. Cumulative counts `3,8,?`, total `12` → final cumulative `12`. L3.

**Validation.** Row counts equal totals, relative frequencies sum to `1` exactly before rounding, and cumulative values are monotone.

### Family `center_from_data`

**Task.** Compute or compare mean, median, and mode for a small dataset.

**Response and template.** Named numeric fields: `For {data}, find the {requested_centers}.`

**Derivation.** Sort a copy for median/mode; compute exact rational mean from original values.

**Difficulty.** L1 odd-size integer median/unique mode; L2 even size and non-integer mean; L3 missing value or effect of an outlier.

**Distractors, constraints, and feedback.** Unsorted middle, divide by wrong `n`, mode as largest value, or use one middle value for even `n`. Allow “no mode” or multiple modes when explicitly requested.

**Examples.**

1. `2,3,3,7,10` → mean `5`, median `3`, mode `3`. L1.
2. `1,4,6,9` → mean `5`, median `5`. L2.
3. Mean of `4,7,x,9` is `7` → `x=8`. L3.

**Validation.** Independent sort-and-scan and frequency-map oracles; verify declared modal multiplicity.

### Family `weighted_mean`

**Task.** Calculate a weighted mean or recover a missing score/weight.

**Response and template.** Decimal/rational: `{values} have weights {weights}. What is the weighted mean?`

**Derivation.** `Σw_ix_i/Σw_i`; percentages are normalized if their exact sum is `100%`.

**Difficulty.** L1 integer frequency weights; L2 percentage weights; L3 inverse missing component.

**Distractors, constraints, and feedback.** Ordinary unweighted mean, sum without denominator, or divide by number of groups. Reject negative weights and zero total weight.

**Examples.**

1. Scores `70,90` with weights `1,3` → `85`. L1.
2. `80` at `40%`, `95` at `60%` → `89`. L2.
3. Grades `80,90,x` weighted `20%,30%,50%` average `88` → `x=90`. L3.

**Validation.** Exact rational computation and substitution check for inverse questions.

### Family `spread_and_five_number_summary`

**Task.** Compute range, quartiles, IQR, variance, or standard deviation under a named convention.

**Response and template.** Named numeric fields: `Using {population_or_sample} formulas, find {requested_spread} for {data}.`

**Derivation.** Apply the normative sorted-data and variance definitions. Prefer values engineered for exact integer/rational variance or a requested rounded square root.

**Difficulty.** L1 range/five-number summary; L2 IQR/population variance; L3 sample variance or compare two datasets.

**Distractors, constraints, and feedback.** Wrong denominator, missing square root, unsorted quartiles, range instead of IQR. State units.

**Examples.**

1. `1,2,4,7,9` → range `8`, `Q1=1.5`, median `4`, `Q3=8`, IQR `6.5`. L1.
2. Population `1,3,5` → variance `8/3`. L2.
3. Sample `2,4,6` → `s²=4`, `s=2`. L3.

**Validation.** Exact two-pass variance and independently checked identity `E[X²]−E[X]²` for population data; quartile renderer follows declared method.

### Family `standardize_and_transform_data`

**Task.** Compute a z-score or determine how a linear transformation changes summaries.

**Response and template.** Numeric/matching: `Every value is transformed by y={a}x+{b}. What happens to {summary}?`

**Derivation.** Center transforms as `a*center+b`; non-negative spread scales by `|a|`; variance by `a²`; z-score uses the declared mean and SD.

**Difficulty.** L1 z-score; L2 positive scale/shift; L3 negative scale and ordered summaries.

**Distractors, constraints, and feedback.** Add shift to SD, scale variance by `a`, ignore `|a|`, or reverse z numerator. SD must be positive.

**Examples.**

1. `x=70, μ=60, σ=5` → `z=2`. L1.
2. Add `10` to every value → mean/median +10, SD unchanged. L2.
3. `y=−2x+3` → variance multiplied by `4`; quartile order reverses. L3.

**Validation.** Transform the raw semantic data as an independent check against formula-derived summaries.

### Family `read_compare_displays`

**Task.** Extract a value or select a justified comparison from a histogram, box plot, dot plot, or bar chart.

**Response and template.** Numeric or claim choice: `Based only on the displayed {chart_type}, which statement is supported?`

**Derivation.** Read exact chart metadata: counts from dots/bars, interval counts from histogram bins, or five-number values from box plots.

**Difficulty.** L1 direct read; L2 compare center/spread/shape; L3 identify what cannot be inferred or diagnose a scale/binning effect.

**Distractors, constraints, and feedback.** Confuse bar/histogram, infer individual values within bins, equate range with IQR, or infer causation. Every chart has a data/table equivalent.

**Examples.**

1. Bar height at category B is `7` → frequency `7`. L1.
2. Box plot A has larger IQR but equal medians to B → select that claim. L2.
3. Two histograms use different bin widths → exact modal raw value cannot be inferred. L3.

**Validation.** Rendered geometry round-trips to semantic values; supported choice is true and every distractor is false or unjustified.

### Cross-family progression

Classification and frequency precede center. Center and sorted position precede spread. Interleave raw-data calculations with displays so the learner does not treat graphs and formulas as separate subjects. Transformation questions follow direct summaries; claims about distribution shape wait until basic graph reading is reliable.

## 3. Category: Counting and sample spaces

### Category purpose

Train construction of the correct possibility space before probability arithmetic, with explicit attention to order, repetition, and equal likelihood.

### Learn

Use the addition principle for disjoint alternatives and the multiplication principle for sequential choices. A permutation cares about order; a combination does not. `nPr=n!/(n−r)!` and `nCr=n!/[r!(n−r)!]`. Counting gives probability by `favorable/total` only when elementary outcomes are equally likely.

### Prerequisites

Non-negative integers and fractions.

### Common misconceptions

- Omitting outcomes or counting one twice.
- Treating ordered sequences as unordered selections.
- Allowing repetition when selection is without replacement.
- Multiplying counts for alternatives that should be added.
- Dividing favorable counts by a total containing differently weighted outcomes.

### Subcategories

Enumeration; addition/product principles; permutations; combinations; counting-based probability.

### Family `enumerate_sample_space`

**Task.** List, count, or recognize all outcomes of a small random experiment.

**Response and template.** Ordered/unordered token set: `{experiment}. Which set is the complete sample space?`

**Derivation.** Cartesian-product or explicit finite generator with semantic tuples; canonical display order is lexicographic but grading is set-based unless order is the outcome.

**Difficulty.** L1 one device; L2 two devices; L3 unequal branch structure or constrained sequences.

**Distractors, constraints, and feedback.** Missing mirrored ordered pair, duplicated set outcome, or impossible outcome. Keep complete spaces at most 16 displayed outcomes.

**Examples.**

1. One coin → `{H,T}`. L1.
2. Coin then die `{1,2}` → `{H1,H2,T1,T2}`. L2.
3. Two draws from `{A,B,C}` without replacement → six ordered pairs. L3.

**Validation.** Compare learner set to exhaustively generated semantic outcome set.

### Family `addition_and_product_principles`

**Task.** Count alternatives or staged constructions without full enumeration.

**Response and template.** Integer: `How many {objects} can be formed under these rules: {rules}?`

**Derivation.** Build an acyclic choice tree; multiply along a path and add disjoint terminal path counts.

**Difficulty.** L1 uniform stages; L2 separate cases; L3 one constrained stage with case split.

**Distractors, constraints, and feedback.** Add instead of multiply, multiply instead of add, or include forbidden branch. Reject wording with overlapping cases.

**Examples.**

1. 3 shirts and 2 trousers → `6` outfits. L1.
2. Choose one of 4 teas or 3 coffees → `7`. L1.
3. Three-character codes: first A/B, then digit; if A, 2 suffixes, if B, 4 → `20+40=60`. L3.

**Validation.** Exhaustively instantiate constructions for small parameters and compare count.

### Family `permutation_count`

**Task.** Count ordered arrangements or fill ordered roles.

**Response and template.** Integer: `In how many ways can {r} ordered positions be filled from {n} distinct items {replacement_rule}?`

**Derivation.** Without replacement `nPr`; with replacement `n^r`; repeated-symbol arrangements use `n!/(m1!...mk!)` only in the declared variation.

**Difficulty.** L1 arrange all; L2 select ordered subset; L3 repeated symbols or one fixed/forbidden position.

**Distractors, constraints, and feedback.** `nCr`, `n^r` under no replacement, or `n!` regardless of `r`.

**Examples.**

1. Arrange 4 distinct books → `24`. L1.
2. Gold/silver/bronze from 8 runners → `8P3=336`. L2.
3. Arrange letters of `LEVEL` → `5!/(2!2!)=30`. L3.

**Validation.** BigInt formula plus exhaustive enumeration at test-size parameters.

### Family `combination_count`

**Task.** Count unordered selections satisfying small constraints.

**Response and template.** Integer: `How many groups of {r} can be selected from {n} distinct items {constraint}?`

**Derivation.** Use `nCr`; constrained cases sum disjoint products of combinations.

**Difficulty.** L1 direct `nCr`; L2 include/exclude a named item; L3 composition constraints across two types.

**Distractors, constraints, and feedback.** `nPr`, off-by-one pool, or failure to combine category choices.

**Examples.**

1. Choose 2 of 5 → `10`. L1.
2. Choose 3 of 7 including Ana → `C(6,2)=15`. L2.
3. Choose 4 from 5 red and 4 blue with exactly 2 red → `C(5,2)C(4,2)=60`. L3.

**Validation.** Formula and bit-subset enumerator agree; constraints create at least one but not all subsets at upper levels.

### Family `counting_probability`

**Task.** Compute an event probability from an explicitly uniform finite space.

**Response and template.** Probability: `A result is chosen uniformly from {space_description}. What is P({event})?`

**Derivation.** Count satisfying semantic outcomes and divide by total, then reduce.

**Difficulty.** L1 one property; L2 combination/permutation event; L3 complement or overlapping cases.

**Distractors, constraints, and feedback.** Favorable count alone, inverted ratio, ordered/unordered mismatch. “Uniformly” must appear or be guaranteed by the physical model.

**Examples.**

1. Uniform integer 1–10 is even → `5/10=1/2`. L1.
2. Two fair dice sum to 7 → `6/36=1/6`. L2.
3. Five-card subset from 8 items contains at least one of 2 marked → `1−C(6,5)/C(8,5)=25/28`. L3.

**Validation.** Exhaustive weighted outcome enumeration; all elementary weights equal before count ratio is permitted.

### Family `choose_counting_model`

**Task.** Select the correct counting expression before evaluating it.

**Response and template.** Single-choice/formula builder: `Which expression counts {selection_description}?`

**Derivation.** Semantic flags `ordered`, `replacement`, `distinct`, and `compositionConstraint` determine the formula tree.

**Difficulty.** L1 permutation versus combination; L2 replacement; L3 sum/product of constrained terms.

**Distractors, constraints, and feedback.** Each option flips exactly one semantic flag. Do not accept two algebraically identical options.

**Examples.**

1. Choose a 3-person committee from 10 → `C(10,3)`. L1.
2. Create a 4-digit PIN with repetition → `10^4`. L2.
3. Choose at least 2 women in a 4-person group from 5 women/6 men → `Σ_(k=2)^4 C(5,k)C(6,4−k)`. L3.

**Validation.** Evaluate expressions and compare to exhaustive model; require exactly one semantically and numerically correct choice.

### Cross-family progression

Small enumeration establishes outcome semantics. Addition/product rules replace enumeration, followed by ordered and unordered formula families. Interleave `choose_counting_model` before computation. Counting probability comes only after learners demonstrate that they can identify the correct total space.

## 4. Category: Probability laws, dependence, and repeated trials

### Category purpose

Build flexible event algebra and make the denominator, overlap, and dependence visible in every multi-event calculation.

### Learn

`P(Aᶜ)=1−P(A)`. Addition uses `P(A∪B)=P(A)+P(B)−P(A∩B)`. Conditional probability restricts the universe to `B`. Multiplication uses `P(A∩B)=P(A)P(B|A)`. A partition gives `P(E)=ΣP(E|H_i)P(H_i)`. Independence is a property to check, not a default.

### Prerequisites

Events, fractions, and small sample spaces.

### Common misconceptions

- Adding overlapping events without subtracting intersection.
- Swapping `P(A|B)` and `P(B|A)`.
- Using the original sample-space denominator after conditioning.
- Multiplying marginal probabilities when events are dependent.
- Calling mutually exclusive events independent.
- Treating successive no-replacement draws as identical trials.

### Subcategories

Complements; union/intersection; conditional probability; independence; trees; total probability; replacement.

### Family `complement_probability`

**Task.** Compute a complement or an “at least one/none” probability.

**Response and template.** Probability: `Given P({event})={p}, what is P(not {event})?` or `What is P(at least one {success}) in {trials}?`

**Derivation.** `1−P(A)`; for independent repeated trials, `1−(1−p)^n`.

**Difficulty.** L1 direct complement; L2 none/at-least-one; L3 non-identical independent failure probabilities.

**Distractors, constraints, and feedback.** Return `p`, use `p^n`, or add trial probabilities. Repeated-trial independence must be stated.

**Examples.**

1. `P(rain)=0.3` → `P(no rain)=0.7`. L1.
2. At least one 6 in two fair rolls → `1−(5/6)²=11/36`. L2.
3. Independent success rates `.2,.3,.5` → at least one `1−.8·.7·.5=.72`. L3.

**Validation.** Exact complement plus exhaustive Bernoulli-vector enumeration for repeated variants.

### Family `addition_rule`

**Task.** Compute union, intersection, or an unknown component of the addition rule.

**Response and template.** Probability/named fields: `P(A)={a}, P(B)={b}, P(A∩B)={i}. Find P({target}).`

**Derivation.** Rearrange `P(A∪B)=P(A)+P(B)−P(A∩B)`.

**Difficulty.** L1 disjoint union; L2 overlapping union; L3 solve for intersection or one marginal.

**Distractors, constraints, and feedback.** Add without subtracting, subtract intersection twice, confuse union/intersection. Generate only feasible probability triples.

**Examples.**

1. Disjoint `P(A)=.2,P(B)=.3` → union `.5`. L1.
2. `.6,.5,.2` → union `.9`. L2.
3. union `.75`, marginals `.45,.5` → intersection `.2`. L3.

**Validation.** Construct from four non-negative Venn-region masses summing to `1`, then derive givens.

### Family `joint_marginal_table`

**Task.** Extract or complete joint, marginal, and union probabilities from a two-way table.

**Response and template.** Table cells/probability: `Using the table, find P({event_expression}).`

**Derivation.** Sum exact counts or masses over the selected cells and divide by the appropriate grand total.

**Difficulty.** L1 one joint/marginal; L2 union; L3 missing cell inferred from margins.

**Distractors, constraints, and feedback.** Wrong row/column, cell count divided by row total when unconditional, or union without overlap correction.

**Examples.**

1. 12 of 40 are A and B → `P(A∩B)=3/10`. L1.
2. Row A total 20, column B total 18, intersection 8 of 50 → union `30/50=3/5`. L2.
3. Grand total 100 and margins determine missing cell `17`. L3.

**Validation.** All cell/margin sums agree; event AST selects exact cell set.

### Family `conditional_probability`

**Task.** Compute or identify a conditional probability from counts, a table, or event probabilities.

**Response and template.** Probability: `Given that {condition} occurred, what is P({target}|{condition})?`

**Derivation.** Restrict to condition set: `P(target∩condition)/P(condition)`.

**Difficulty.** L1 row/table count; L2 symbolic givens; L3 compare both directions.

**Distractors, constraints, and feedback.** Grand-total denominator, reversed conditional, or intersection alone. Condition mass must be positive.

**Examples.**

1. Among 20 blue items, 5 are large → `P(large|blue)=1/4`. L1.
2. `P(A∩B)=.12,P(B)=.3` → `P(A|B)=.4`. L2.
3. From the same table calculate `P(A|B)` and `P(B|A)` and compare. L3.

**Validation.** Direct ratio plus filtered weighted-outcome enumeration.

### Family `independence_check`

**Task.** Decide whether events are independent or solve a value that makes them independent.

**Response and template.** Yes/no or probability: `Are A and B independent given {probabilities_or_table}?`

**Derivation.** Test exact equality `P(A∩B)=P(A)P(B)`; inverse cases solve that equality.

**Difficulty.** L1 known product; L2 table; L3 pairwise versus mutual independence or missing cell.

**Distractors, constraints, and feedback.** “They overlap,” “they are not equal,” or “they are disjoint” as false criteria. Do not use rounded values near equality.

**Examples.**

1. `.5,.4,.2` → independent. L1.
2. Fair die: even and greater than 3 → intersection `2/6`, product `(3/6)(3/6)=1/4`; not independent. L2.
3. Three events can be pairwise independent without mutual independence; classify from a displayed 8-cell model. L3.

**Validation.** Exact region-mass oracle; advanced model verifies all required subset intersections.

### Family `probability_tree_trace`

**Task.** Complete branch probabilities or compute a leaf/event probability from a tree.

**Response and template.** Tree fields/probability: `Complete the tree and find P({leaf_or_event}).`

**Derivation.** Sibling branches sum to `1`; multiply along each root-to-leaf path; add disjoint requested leaves.

**Difficulty.** L1 one path; L2 sum leaves; L3 missing branch or posterior direction reserved for Bayes follow-up.

**Distractors, constraints, and feedback.** Add along path, multiply across alternatives, or use unconditional second-stage probability.

**Examples.**

1. `P(A)=.4,P(B|A)=.5` → leaf `AB=.2`. L1.
2. Two success routes `.3·.8 + .7·.2=.38`. L2.
3. Recover `P(E|Hᶜ)=.1` from sibling `.9`, then total. L3.

**Validation.** Each sibling group sums exactly to `1`; leaf probabilities sum to `1`.

### Family `total_probability`

**Task.** Compute a marginal probability across a partition or recover a missing likelihood.

**Response and template.** Probability: `{H_i} partition the cases. Given {priors_and_likelihoods}, find P({evidence}).`

**Derivation.** `P(E)=Σ_i P(E|H_i)P(H_i)`.

**Difficulty.** L1 two groups; L2 three groups; L3 solve one missing conditional.

**Distractors, constraints, and feedback.** Average likelihoods unweighted, multiply all terms, omit a group. Priors must be non-negative and sum to `1`.

**Examples.**

1. `.6` from source A with defect `.02`, `.4` from B with `.05` → defect `.032`. L1.
2. Three weather states with priors/late rates → weighted sum. L2.
3. Total `.1`, priors `.25/.75`, first likelihood `.28` → second `.04`. L3.

**Validation.** Exact partition mixture and inverse substitution; missing likelihood constrained to `[0,1]`.

### Family `replacement_and_dependent_draws`

**Task.** Compute a short ordered/unordered draw probability with or without replacement.

**Response and template.** Probability: `From {inventory}, draw {k} items {replacement_rule}. What is P({event})?`

**Derivation.** Update counts after every no-replacement draw; multiply path conditionals; add order paths for unordered events.

**Difficulty.** L1 ordered two draws; L2 either order; L3 three draws or compare replacement policies.

**Distractors, constraints, and feedback.** Reuse initial denominator, count one order only, or apply no-replacement depletion under replacement.

**Examples.**

1. 3 red/2 blue, two red without replacement → `(3/5)(2/4)=3/10`. L1.
2. One red and one blue in either order → `3/5·2/4+2/5·3/4=3/5`. L2.
3. Compare two successes with replacement `(3/5)²` versus without `3/10`. L3.

**Validation.** Sequential state enumerator and hypergeometric oracle agree where order is discarded.

### Cross-family progression

Direct complements and Venn-region addition come first. Tables make joint and conditional denominators concrete. Trees then combine conditionals across stages, followed by independence, total probability, and no-replacement comparisons. Conditional probability and total probability are prerequisites for Bayes.

## 5. Category: Bayes’ theorem and evidence

### Category purpose

Train inversion of conditional probabilities while preserving base rates, and develop an evidence-updating model that scales from concrete counts to odds and several hypotheses.

### Learn

Bayes’ theorem is:

```text
P(H|E) = P(E|H)P(H) / P(E)
P(E)   = Σ_i P(E|H_i)P(H_i)
```

Natural frequencies often make it clearest: among all cases with the evidence, what fraction came from the hypothesis? In odds form:

```text
posterior odds = prior odds × likelihood ratio
```

A high `P(E|H)` does not imply a high `P(H|E)` when `H` is rare or `E` is also common without `H`.

### Prerequisites

Conditional probability, probability trees, total probability, ratios.

### Common misconceptions

- Reversing `P(E|H)` into `P(H|E)`.
- Ignoring the prior/base rate.
- Using specificity as the false-positive rate.
- Dividing by `P(H)` rather than the evidence total.
- Treating the likelihood or likelihood ratio as a posterior.
- Multiplying likelihood ratios for evidence that was not declared conditionally independent.
- Renormalizing two hypotheses while silently discarding a third.

### Subcategories

Reverse conditionals; natural frequencies; formula/table Bayes; base rates; odds and likelihood ratios; sequential and multi-hypothesis updating.

### Family `distinguish_reverse_conditionals`

**Task.** Match verbal statements, notation, and denominators for `P(E|H)` versus `P(H|E)`.

**Response and template.** Matching/single-choice: `Which expression means “among {condition_set}, the fraction that {target}”?`

**Derivation.** The phrase after “among/given” defines the denominator; intersection is the numerator.

**Difficulty.** L1 notation match; L2 table denominator; L3 explain which quantity a supplied rate represents using controlled clauses.

**Distractors, constraints, and feedback.** Reverse conditional, joint probability, or marginal. Do not use ambiguous prose such as “chance of H and E.”

**Examples.**

1. “Positive among faulty” → `P(+|faulty)`. L1.
2. 18 positives among 20 faulty → sensitivity `18/20`; not PPV. L2.
3. “Of all alerts, how many are real?” → `P(real|alert)`. L3.

**Validation.** Semantic roles determine notation and exact filtered denominator.

### Family `bayes_natural_frequencies`

**Task.** Convert rates to expected counts and obtain a posterior from the evidence column.

**Response and template.** Table fields/probability: `Out of {population_size} cases, complete the frequency table and find the fraction of {evidence} cases that are {hypothesis}.`

**Derivation.** Generate a population size making all branch counts integral; posterior is true-evidence count divided by all evidence counts.

**Difficulty.** L1 table mostly filled; L2 construct both branches; L3 compare two tests/groups.

**Distractors, constraints, and feedback.** Sensitivity copied as posterior, false-positive branch omitted, or total population denominator.

**Examples.**

1. 1000 items, 10% faulty, alert 80% of faulty and 5% of sound → `80/(80+45)=64%`. L1.
2. 1% rare, 90% hit, 10% false alert among 10,000 → `90/(90+990)=1/12`. L2.
3. Two inspectors with different rates → compute and compare PPV from two frequency tables. L3.

**Validation.** Count tree and probability-form Bayes oracle agree exactly.

### Family `bayes_formula_update`

**Task.** Compute a two-hypothesis posterior from a prior, likelihood, and false-positive likelihood.

**Response and template.** Probability: `P(H)={prior}, P(E|H)={hit}, P(E|Hᶜ)={false}. Find P(H|E).`

**Derivation.** `hit*prior / [hit*prior + false*(1−prior)]`.

**Difficulty.** L1 friendly fractions; L2 decimals/percentages; L3 negative evidence using complements or recover a prior.

**Distractors, constraints, and feedback.** `hit`, `hit*prior`, reverse ratio, omit complement prior, confuse specificity with false-positive rate.

**Examples.**

1. `.2,.75,.1` → `.15/(.15+.08)=15/23`. L1.
2. prior `2%`, sensitivity `95%`, specificity `90%` → `.019/(.019+.098)≈16.24%`. L2.
3. Given a negative result, use `P(−|H)=1−sensitivity` and specificity. L3.

**Validation.** Formula, tree, and normalized joint-mass implementations agree.

### Family `base_rate_effect`

**Task.** Predict or calculate how changing only the prior changes a posterior.

**Response and template.** Comparison/ordered choice: `The likelihoods stay fixed. Which population gives the higher P(H|E), and by how much?`

**Derivation.** Apply the same likelihoods to each prior; optionally compare posterior odds.

**Difficulty.** L1 qualitative direction; L2 calculate two posteriors; L3 find prior threshold for a target posterior.

**Distractors, constraints, and feedback.** Claim posterior unchanged, equals sensitivity, or moves opposite to prior.

**Examples.**

1. Same test, prevalence 20% versus 2% → higher PPV at 20%. L1.
2. Hit `.8`, false `.1`: priors `.1` and `.5` → posteriors `8/17` and `8/9`. L2.
3. Solve prior giving posterior `.5`: prior odds must equal inverse likelihood ratio. L3.

**Validation.** Exact monotonicity in prior for informative likelihoods; threshold substituted back.

### Family `posterior_odds_likelihood_ratio`

**Task.** Update prior odds with a likelihood ratio or recover one component.

**Response and template.** Ratio/probability fields: `Prior odds for H₁:H₀ are {odds}. Evidence has LR={lr}. Find posterior odds and probability.`

**Derivation.** Multiply odds by LR, reduce ratio, then convert `a:b` to `a/(a+b)`.

**Difficulty.** L1 integer ratios; L2 probability-to-odds conversion; L3 negative evidence or missing LR.

**Distractors, constraints, and feedback.** Add LR, treat LR as probability, reverse odds, fail to normalize.

**Examples.**

1. Prior `1:4`, LR `3` → posterior `3:4`, probability `3/7`. L1.
2. Prior `.2` gives odds `1:4`; LR `.5` → `1:8`, probability `1/9`. L2.
3. Prior odds `2:3`, posterior `5:3` → LR `2.5`. L3.

**Validation.** Odds and direct Bayes calculations agree for reconstructed likelihood pairs.

### Family `sequential_bayes_evidence`

**Task.** Update posterior odds after two or three conditionally independent evidence items.

**Response and template.** Ordered table: `Starting from {prior_odds}, update after evidence with likelihood ratios {lr_sequence}.`

**Derivation.** Multiply odds successively by each LR; display intermediate odds and final probability.

**Difficulty.** L1 two integer LRs; L2 mixed evidence with LR below one; L3 compare evidence order and identify that final odds are order-invariant under assumptions.

**Distractors, constraints, and feedback.** Add LRs, discard prior after first update, or force every evidence item to support H.

**Examples.**

1. `1:9`, LRs `3,2` → `6:9=2:3`, posterior `.4`. L1.
2. `1:1`, LRs `5,.2` → `1:1`; evidence cancels in odds. L2.
3. LRs `2,4,1/2` → total LR `4`, independent of order. L3.

**Validation.** Sequential and product calculations agree. Prompt explicitly states conditional independence; otherwise reject.

### Family `multi_hypothesis_bayes`

**Task.** Update and normalize probabilities for three or four mutually exclusive exhaustive hypotheses.

**Response and template.** Named probability fields/ranking: `Given priors {priors} and likelihoods P(E|H_i)={likelihoods}, find P(H_i|E).`

**Derivation.** Compute weights `w_i=P(E|H_i)P(H_i)` and normalize by `Σw_i`.

**Difficulty.** L1 rank posterior weights; L2 calculate three posteriors; L3 sequential update with a second likelihood vector.

**Distractors, constraints, and feedback.** Normalize likelihoods without priors, keep unnormalized weights, omit a hypothesis, or renormalize only top two.

**Examples.**

1. Equal priors and likelihoods `.1,.3,.6` → posterior same proportions. L1.
2. Priors `.5,.3,.2`, likelihoods `.2,.4,.5` → weights `.1,.12,.1`, posteriors `5/16,3/8,5/16`. L2.
3. Normalize three weights, then apply a second declared conditionally independent evidence vector. L3.

**Validation.** Posterior entries are non-negative and sum exactly to `1`; independent vectorized and table-joint oracles agree.

### Family `bayes_information_selection`

**Task.** Identify which missing quantity is required or which supplied quantity is irrelevant for a requested posterior.

**Response and template.** Multiple-choice: `To determine P({H}|{E}), which additional quantity is required?`

**Derivation.** Inspect the Bayes dependency graph: prior plus all likelihoods needed to compute evidence normalization.

**Difficulty.** L1 identify prior; L2 distinguish specificity/false-positive; L3 multi-hypothesis missing likelihood or conditional-independence requirement.

**Distractors, constraints, and feedback.** Reverse conditional, unrelated marginal, raw sample size when exact rates suffice, or an insufficient overall accuracy.

**Examples.**

1. Sensitivity and false-positive rate known, prevalence missing → need prevalence. L1.
2. Sensitivity and specificity known → false-positive is derivable, not additionally required. L2.
3. To multiply two LRs, need conditional independence given each hypothesis or the joint likelihood. L3.

**Validation.** Symbolic dependency solver proves sufficiency of correct information set and insufficiency of each distractor set.

### Cross-family progression

Start with language and denominators, then natural frequencies, then formula Bayes. Interleave base-rate contrasts immediately. Odds follow two-hypothesis fluency; sequential updating requires odds, and multi-hypothesis updating comes last. Information-selection questions diagnose understanding throughout and should precede harder arithmetic after an error.

## 6. Category: Discrete random variables and distributions

### Category purpose

Connect outcome probabilities to numerical quantities, long-run averages, variability, and reusable models for counts and waiting times.

### Learn

A random variable assigns a number to each outcome. Its PMF lists `P(X=x)` and must be non-negative and sum to `1`. Expectation is a probability-weighted mean, not necessarily a possible result. Variance measures squared distance from the mean. Distribution names are justified by the random mechanism, not by a familiar-looking formula.

### Prerequisites

Weighted means, probability rules, combinations, independent trials.

### Common misconceptions

- Treating `X` as an event rather than a numerical mapping.
- Forgetting to weight values when finding expectation.
- Assuming expectation must be attainable.
- Using `E[X²]` as variance or forgetting to square deviations.
- Adding variances without independence/covariance information.
- Calling every success count binomial.
- Using a binomial model for no-replacement sampling from a small population.
- Confusing geometric trial number with failures before success.

### Subcategories

PMFs/CDFs; expectation and variance; transformations; sums; Bernoulli/binomial; geometric; hypergeometric; Poisson.

### Family `discrete_pmf_complete_validate`

**Task.** Complete a missing PMF probability or decide whether a table is a valid PMF.

**Response and template.** Probability/yes-no: `For the displayed table of X, find p({x}) so that it is a valid PMF.`

**Derivation.** Require each mass `≥0` and total exactly `1`; missing mass is `1−sum(known)`.

**Difficulty.** L1 one missing mass; L2 symbolic linear mass; L3 identify multiple validity failures.

**Distractors and feedback.** Normalize incorrectly, allow negative mass, or require probabilities to be equal. Feedback shows the mass sum.

**Examples.**

1. Masses `.2,.5,?` → `.3`. L1.
2. Masses `k,2k,3k` → `k=1/6`. L2.
3. Table includes `−.1` and sums to `1` → invalid because non-negativity fails. L3.

**Validation.** Exact rational sum and non-negativity checks; symbolic solutions substituted.

### Family `discrete_cdf_probability`

**Task.** Build/read a discrete CDF or derive interval/point probability from it.

**Response and template.** Table/probability: `Given F(x)=P(X≤x), find P({interval_event}).`

**Derivation.** Cumulative sums; `P(a<X≤b)=F(b)−F(a)` and point mass is the jump.

**Difficulty.** L1 CDF from PMF; L2 interval from CDF; L3 recover PMF jumps.

**Distractors and feedback.** Strict/non-strict endpoint error, use CDF value as point mass, or subtract in reverse.

**Examples.**

1. PMF at `0,1,2` is `.2,.3,.5` → `F(1)=.5`. L1.
2. `F(4)=.8,F(1)=.25` → `P(1<X≤4)=.55`. L2.
3. CDF jumps from `.4` to `.7` at 3 → `P(X=3)=.3`. L3.

**Validation.** PMF↔CDF round-trip; CDF monotone, right-continuous in semantic step representation, ending at `1`.

### Family `expected_value`

**Task.** Compute an expectation or recover one PMF value/outcome from a target expectation.

**Response and template.** Rational/decimal: `For {pmf_or_payoff_table}, find E[X].`

**Derivation.** Exact `Σxp(x)`.

**Difficulty.** L1 two outcomes; L2 3–6 outcomes/payoff table; L3 inverse or conditional expectation over a displayed subset.

**Distractors and feedback.** Unweighted mean, most likely value, sum of payoffs, or probability-weighted absolute values.

**Examples.**

1. `X=0,1` with probabilities `.7,.3` → `.3`. L1.
2. Fair die payoff `X=face` → `3.5`, not a possible face. L2.
3. `X=0,2,5`, masses `.2,p,.8−p`, `E[X]=3.6` → `p=.2`. L3.

**Validation.** Exact dot product and inverse substitution; masses remain valid.

### Family `variance_standard_deviation`

**Task.** Compute variance/SD or compare spread of discrete distributions.

**Response and template.** Numeric: `For the PMF of X, find Var(X) and SD(X).`

**Derivation.** Independently compute `Σ(x−μ)²p(x)` and `E[X²]−μ²`.

**Difficulty.** L1 supplied mean; L2 derive mean and variance; L3 compare equal-mean distributions or inverse scale.

**Distractors and feedback.** `E[X²]`, mean absolute deviation, variance without subtracting `μ²`, or variance reported as SD.

**Examples.**

1. Bernoulli `.25` → variance `.25·.75=3/16`. L1.
2. `X=−1,1` equally likely → mean `0`, variance `1`, SD `1`. L2.
3. Compare `±1` and `±3` equally likely → second has variance `9` versus `1`. L3.

**Validation.** Both exact variance identities agree and result is non-negative.

### Family `linear_transform_and_sum`

**Task.** Find expectation/variance after affine transformation or sum of variables.

**Response and template.** Named numeric fields: `Given {moments_and_dependence}, find E({expression}) and Var({expression}).`

**Derivation.** Use linearity of expectation; scale variance by squared coefficients; add covariance term `2abCov(X,Y)` or use zero covariance only when stated.

**Difficulty.** L1 `aX+b`; L2 independent sum; L3 supplied covariance or detect insufficient information.

**Distractors and feedback.** Add `b` to variance, scale variance by `a`, or assume independence. Feedback names which steps do and do not require independence.

**Examples.**

1. `E[X]=3,Var(X)=4`, `Y=2X+1` → `E[Y]=7,Var(Y)=16`. L1.
2. Independent variances `2,5` → `Var(X+Y)=7`. L2.
3. `Var(X)=2,Var(Y)=3,Cov=−1` → `Var(X+Y)=3`. L3.

**Validation.** Formula oracle plus finite joint-distribution construction for test cases.

### Family `binomial_model_and_probability`

**Task.** Recognize a binomial mechanism and compute an exact/range count probability or moments.

**Response and template.** Model choice/probability: `{experiment}. Is X binomial? If so, find P({count_event}).`

**Derivation.** Verify fixed `n`, two outcomes, independent trials, constant `p`; use `C(n,k)p^k(1−p)^(n−k)`, sums, `np`, `np(1−p)`.

**Difficulty.** L1 identify/model and `P(X=k)`; L2 at most/at least; L3 inverse parameter or contrast invalid mechanism.

**Distractors and feedback.** Omit combination, swap exponents, use binomial for no replacement/changing `p`.

**Examples.**

1. 4 independent trials, `p=.5`, exactly 2 → `6/16=3/8`. L1.
2. `X~Bin(10,.2)` → `E[X]=2`, variance `1.6`. L2.
3. Draw 5 from 20 without replacement → not binomial; trials are dependent. L3.

**Validation.** PMF sums to `1`; formula agrees with Bernoulli-vector enumeration for small `n`.

### Family `geometric_waiting_time`

**Task.** Compute first-success, tail, or expected waiting time under the declared geometric convention.

**Response and template.** Probability/number: `Independent trials have success probability {p}. What is P(first success on trial {k})?`

**Derivation.** `(1−p)^(k−1)p`; tail `P(X>k)=(1−p)^k`; mean `1/p`.

**Difficulty.** L1 first success; L2 tail/mean; L3 memoryless conditional or distinguish trial/failure convention.

**Distractors and feedback.** `p^k`, exponent `k`, binomial combination factor, or mean `(1−p)/p`.

**Examples.**

1. `p=.25`, first success on 3 → `.75²·.25=9/64`. L1.
2. `P(X>4)` at `.2` → `.8⁴`. L2.
3. `P(X>7|X>5)=P(X>2)=.8²` at `.2`. L3.

**Validation.** Sequence probabilities plus bounded simulation/property tests; support starts at 1.

### Family `hypergeometric_probability`

**Task.** Compute success counts in uniform sampling without replacement.

**Response and template.** Probability: `A population has N={N}, K={K} successes. Draw n={n} without replacement. Find P(X={k}).`

**Derivation.** `C(K,k)C(N−K,n−k)/C(N,n)`.

**Difficulty.** L1 exact `k`; L2 at least/at most; L3 compare binomial approximation/model.

**Distractors and feedback.** Binomial substitution, ordered denominator, impossible count, or omit failures chosen.

**Examples.**

1. 3 marked/7 unmarked, draw 2, exactly 1 → `C(3,1)C(7,1)/C(10,2)=7/15`. L1.
2. At least one marked → complement `1−C(7,2)/C(10,2)=8/15`. L2.
3. Explain why `Bin(2,.3)` differs: without replacement changes probability. L3.

**Validation.** Combination formula, subset enumeration, and support bounds agree.

### Family `poisson_count`

**Task.** Compute a Poisson count probability, moments, or rescale a rate across exposure.

**Response and template.** Probability/number: `Events follow a Poisson model at rate {rate}. Over {exposure}, find P({count_event}).`

**Derivation.** Set `λ=rate×exposure`; use `e^(−λ)λ^k/k!`; mean and variance `λ`.

**Difficulty.** L1 set λ/moments; L2 exact count/zero complement; L3 compare exposures or a declared binomial approximation.

**Distractors and feedback.** Use rate without exposure, omit factorial/exponential, or use `1−P(0)` for “exactly one.”

**Examples.**

1. Rate 2/hour for 3 hours → `λ=6`. L1.
2. `λ=2`, zero events → `e^(−2)≈.1353`. L2.
3. `λ=.5`, at least one → `1−e^(−.5)`. L3.

**Validation.** Stable log-space numerical oracle; recurrence `p(k+1)=p(k)λ/(k+1)` cross-check.

### Cross-family progression

PMFs and weighted means precede variance. Affine transforms follow direct moments. Binomial comes after independence and combinations; geometric contrasts count versus wait; hypergeometric contrasts replacement; Poisson introduces rate/exposure. Interleave model-recognition with calculations so distribution labels never become pure formula cues.

## 7. Category: Continuous variables, normal models, and approximation

### Category purpose

Train area-based probability, standardization, and controlled use of common continuous models without making integration or table lookup the central skill.

### Learn

For a continuous random variable, probability is area under a non-negative density whose total area is `1`; probability at one exact point is `0`. A CDF gives area to the left. Uniform density is constant on its interval. Standardizing a normal value converts it to `Z~N(0,1)`.

### Prerequisites

Intervals, area of rectangles/triangles, random variables, basic exponentials for the exponential family.

### Common misconceptions

- Reading density height as probability.
- Assigning positive probability to one point in a continuous model.
- Subtracting CDF values in the wrong order.
- Using variance where the normal z-score needs SD.
- Shading the wrong normal tail or doubling a one-sided probability incorrectly.
- Applying a continuity correction in the wrong direction.

### Subcategories

Density/CDF; uniform and exponential; standard normal; normal quantiles; approximation.

### Family `density_area_probability`

**Task.** Validate a piecewise density or compute interval probability as geometric area.

**Response and template.** Probability/parameter: `The density is shown. Find P({interval})` or `find c so total area is 1`.

**Derivation.** Sum rectangle/triangle/trapezoid areas over the interval; point endpoints do not change continuous probability.

**Difficulty.** L1 rectangle; L2 piecewise geometry; L3 solve height/compare density height to probability.

**Distractors and feedback.** Use height alone, include entire shape, or claim point mass.

**Examples.**

1. Density `.5` on `[0,2]`; `P(.5≤X≤1.5)=.5`. L1.
2. Triangle base 2 must have height 1 for total area 1. L2.
3. `P(X=1)=0` despite positive density at 1. L3.

**Validation.** Exact polygon clipping/area and full-area normalization.

### Family `continuous_cdf_interval`

**Task.** Obtain interval/tail probabilities or density-region meaning from a supplied CDF.

**Response and template.** Probability: `Given F({a})={fa} and F({b})={fb}, find P({event}).`

**Derivation.** `P(a<X≤b)=F(b)−F(a)`, left `F(b)`, right `1−F(a)`.

**Difficulty.** L1 left/right; L2 interval; L3 quantile/inverse read from graph/table.

**Distractors and feedback.** Add CDF values, reverse subtraction, use `F(a)` for right tail.

**Examples.**

1. `F(3)=.7` → `P(X>3)=.3`. L1.
2. `F(4)=.9,F(1)=.2` → interval `.7`. L2.
3. Smallest displayed `x` with `F(x)≥.75` → 75th percentile. L3.

**Validation.** CDF monotonicity and agreement with density-area oracle for generated piecewise densities.

### Family `uniform_distribution`

**Task.** Compute probability, mean, or inverse interval length for `Uniform(a,b)`.

**Response and template.** Numeric: `X is uniform on [{a},{b}]. Find {target}.`

**Derivation.** Probability is overlap length divided by `b−a`; mean `(a+b)/2`; variance `(b−a)²/12`.

**Difficulty.** L1 interval probability; L2 moments; L3 clipped interval or inverse endpoint.

**Distractors and feedback.** Favorable length without division, total length inverted, or midpoint confused with half-width.

**Examples.**

1. Uniform `[0,10]`, `P(2≤X≤5)=3/10`. L1.
2. Uniform `[2,8]` → mean `5`, variance `3`. L2.
3. Uniform `[−2,4]`, `P(X>1)=1/2`. L3.

**Validation.** Exact interval intersection and formula oracle.

### Family `exponential_waiting_time`

**Task.** Compute exponential tail/interval probabilities, mean, or use memorylessness.

**Response and template.** Probability/time: `X~Exp(rate={lambda}). Find {tail_or_mean}.`

**Derivation.** `P(X>t)=e^(−λt)`, CDF `1−e^(−λt)`, mean `1/λ`.

**Difficulty.** L1 mean/tail formula; L2 numeric interval; L3 conditional memoryless probability or rate-unit conversion.

**Distractors and feedback.** Use Poisson count formula, reciprocal exponent, or confuse mean with rate.

**Examples.**

1. `λ=.5/hour` → mean `2 hours`. L1.
2. `P(X≤3)=1−e^(−1.5)`. L2.
3. `P(X>8|X>5)=P(X>3)=e^(−3λ)`. L3.

**Validation.** CDF/survival complement and numerical monotonicity; units cancel in exponent.

### Family `normal_standardize_probability`

**Task.** Convert values to z-scores and obtain a normal interval/tail probability.

**Response and template.** z/probability fields: `X~N({mu},{variance}) (SD={sigma}). Find z for x={x} and P({event}).`

**Derivation.** `z=(x−μ)/σ`; use versioned standard-normal CDF `Φ`, with complements/differences by tail.

**Difficulty.** L1 z-score; L2 one tail; L3 two-sided/interval or compare different scales.

**Distractors and feedback.** Divide by variance, reverse sign, wrong tail, or double the wrong region.

**Examples.**

1. `μ=50,σ=10,x=70` → `z=2`. L1.
2. `P(X≤60)` for same model → `Φ(1)≈.8413`. L2.
3. `P(|X−50|>20)=2[1−Φ(2)]≈.0455`. L3.

**Validation.** Symmetry `Φ(−z)=1−Φ(z)`, monotonicity, and comparison with a second local approximation/table.

### Family `normal_quantile`

**Task.** Find a cutoff from a cumulative/tail probability or construct a symmetric central interval.

**Response and template.** Number: `For X~N({mu},{variance}), find c such that P({event_with_c})={probability}.`

**Derivation.** Obtain `z=Φ⁻¹(q)` from a local quantile oracle and transform `x=μ+zσ`.

**Difficulty.** L1 supplied standard-normal quantile; L2 one-tail inverse; L3 central interval/two cutoffs.

**Distractors and feedback.** Use `q` as z, wrong tail quantile, omit mean, or multiply by variance.

**Examples.**

1. Given `z_.975=1.96`, standard-normal central 95% → `[-1.96,1.96]`. L1.
2. `N(100,15²)`, 90th percentile with `z≈1.2816` → `119.22`. L2.
3. Central 90% uses `.95` upper quantile, not `.90`. L3.

**Validation.** CDF of returned cutoff matches target within strict oracle tolerance.

### Family `normal_approximation_discrete`

**Task.** Decide whether and apply a declared normal approximation to binomial or Poisson counts with continuity correction.

**Response and template.** Choice/probability: `Approximate P({discrete_event}) using Y~N({mu},{variance}) and a continuity correction.`

**Derivation.** Map integer boundaries to half-units, standardize, and use `Φ`. The prompt supplies or asks to verify an adequacy rule such as `np≥10` and `n(1−p)≥10`.

**Difficulty.** L1 select corrected boundary; L2 calculate one tail; L3 interval or judge adequacy.

**Distractors and feedback.** No correction, correction wrong direction, wrong variance, or approximate despite failed declared rule.

**Examples.**

1. `P(X≤20)` → continuous boundary `20.5`. L1.
2. `P(X≥21)` → boundary `20.5`, right tail. L2.
3. `Bin(20,.05)` fails `np≥10`; do not use under the declared rule. L3.

**Validation.** Boundary AST, normal oracle, and comparison against exact discrete probability in tests; reject gross-error instances.

### Cross-family progression

Geometric density and CDF reading come before named models. Uniform establishes length ratios; exponential contrasts continuous waiting with geometric trials. Standardization precedes normal tails, which precede quantiles. Approximation is last and must always include a quality condition and exact-distribution validation in tests.

## 8. Category: Sampling, bias, and sampling distributions

### Category purpose

Replace “a sample is a smaller population” with a precise model of how samples are obtained and why statistics vary.

### Learn

Random sampling supports generalization to a population; random assignment supports causal comparison. A statistic changes from sample to sample. Its sampling distribution has a center and standard error. Larger independent samples usually reduce standard error, but do not repair selection or measurement bias.

### Prerequisites

Population/sample distinction, mean/proportion, random variables, normal model.

### Common misconceptions

- Confusing random sampling with random assignment.
- Believing a large convenience sample is automatically representative.
- Treating sample SD and standard error as the same quantity.
- Claiming a larger sample eliminates all uncertainty or bias.
- Applying the CLT to raw data rather than to a statistic.
- Assuming simulated frequency must approach truth monotonically.

### Family `identify_sampling_design_bias`

**Task.** Classify a sampling method and identify the specific bias it can introduce.

**Response and template.** Matching/claim choice: `{study_sampling_description}. What design is used, and which limitation follows?`

**Derivation.** Versioned scenario semantics mark simple random, stratified, cluster, systematic, convenience, voluntary-response, undercoverage, nonresponse, or measurement bias.

**Difficulty.** L1 method recognition; L2 bias mechanism; L3 distinguish selection from measurement and propose a controlled repair.

**Examples.**

1. Survey visitors who click a website poll → voluntary-response bias. L1.
2. Randomly sample within each age group → stratified sample. L2.
3. Perfectly random sample with a leading question → sampling unbiased, measurement may be biased. L3.

**Distractors and validation.** Distractors name a real but absent bias. Authored causal chain must be explicit; avoid scenarios with several equally dominant labels.

### Family `law_large_numbers_simulation`

**Task.** Interpret or continue a generated running relative-frequency/mean trace.

**Response and template.** Claim choice/interval: `After {n} trials the running proportion is {value}. Which statement is justified?`

**Derivation.** Replay deterministic PRNG outcomes; LLN claims concern convergence tendency, not guaranteed next movement or exact equality.

**Difficulty.** L1 compute running frequency; L2 compare variability at sample sizes; L3 reject gambler’s fallacy/monotone-convergence claim.

**Examples.**

1. 18 successes in 30 → running proportion `.6`. L1.
2. Later trace usually fluctuates less in proportion, though not monotonically. L2.
3. Ten failures do not make next independent success more likely. L3.

**Validation.** Replay seed exactly; interpretation choices checked against formal probability claims.

### Family `sampling_distribution_enumeration`

**Task.** Enumerate a statistic over all small equally likely samples and form its sampling distribution.

**Response and template.** Table: `From population {values}, take samples of size {n} {replacement_rule}. Complete the distribution of {statistic}.`

**Derivation.** Enumerate ordered draws or uniform subsets as declared, compute statistic, aggregate exact masses.

**Difficulty.** L1 size-2 mean; L2 without replacement; L3 compare statistic bias/spread.

**Examples.**

1. Draw one from `{1,3}` → sample mean distribution `{1:.5,3:.5}`. L1.
2. Two with replacement from `{0,2}` → means `0,1,2` with `.25,.5,.25`. L2.
3. Enumerate sample range and note it underestimates population range on average. L3.

**Validation.** Exhaustive sample generator; masses sum to 1 and expected statistic is independently computed.

### Family `bootstrap_resample`

**Task.** Trace a bootstrap resample or calculate a bootstrap estimate/SE from a small displayed replicate set.

**Response and template.** Ordered sample/numeric: `From observed sample {data}, use bootstrap indices {indices} to form the resample and compute {statistic}.`

**Derivation.** Draw `n` observations with replacement from the observed `n`-value sample; compute the statistic. For supplied bootstrap replicates, estimate SE using their sample SD under the displayed convention.

**Difficulty.** L1 construct one resample; L2 compute its statistic; L3 summarize a small replicate distribution and distinguish it from the population distribution.

**Examples.**

1. Data `[2,5,9]`, indices `[2,2,1]` (one-based) → resample `[5,5,2]`. L1.
2. Its mean is `4`. L2.
3. Bootstrap means `[3,4,4,5]` → mean `4`, sample SD `sqrt(2/3)`. L3.

**Distractors and validation.** Sampling without replacement, drawing from an invented population, or dividing replicate spread by `√B` again. Replay indices exactly and compare statistic/SD with independent routines.

### Family `sample_mean_standard_error`

**Task.** Find center/SE or a probability for the sample mean under stated assumptions.

**Response and template.** Numeric: `Population μ={mu}, σ={sigma}; independent sample n={n}. Find E[x̄], SE(x̄), and {optional_probability}.`

**Derivation.** `E[x̄]=μ`, `SE=σ/√n`; normal probability is exact for a normal population and an approximation under a declared CLT condition.

**Difficulty.** L1 center/SE; L2 normal probability; L3 compare sample sizes or solve `n`.

**Examples.**

1. `μ=40,σ=12,n=36` → center `40`, SE `2`. L1.
2. Normal population: `P(x̄>44)=P(Z>2)`. L2.
3. Halving SE requires quadrupling `n`. L3.

**Distractors and validation.** Use `σ/n`, sample SD as raw spread, or shift center. Formula plus generated-sample simulation in tests.

### Family `sample_proportion_standard_error`

**Task.** Find mean/SE or normal probability for a sample proportion.

**Response and template.** Numeric: `Independent Bernoulli population p={p}, sample n={n}. Find E[p̂] and SE(p̂).`

**Derivation.** `E[p̂]=p`, `SE=sqrt[p(1−p)/n]`; normal use requires a displayed success/failure rule.

**Difficulty.** L1 moments; L2 probability; L3 choose `n` or detect approximation failure.

**Examples.**

1. `p=.4,n=100` → SE `sqrt(.0024)≈.049`. L1.
2. Standardize `p̂=.5` using that SE. L2.
3. `p=.02,n=50` fails expected-success count 10. L3.

**Validation.** Binomial scaling oracle and exact-binomial comparison for approximation variants.

### Family `central_limit_theorem_reasoning`

**Task.** Decide when a sampling distribution is approximately normal and distinguish its shape from population/data shape.

**Response and template.** Claim choice: `{population_shape}, n={n}, {independence_info}. Which statement about the distribution of x̄ is supported?`

**Derivation.** Exact normality for normal populations; otherwise apply only the prompt’s versioned adequacy rule and independence/sample-fraction condition.

**Difficulty.** L1 normal population; L2 large sample from skewed population; L3 failed conditions or compare raw and mean distributions.

**Examples.**

1. Normal population, any `n` → sample mean normal. L1.
2. Strongly skewed population with sufficiently large declared `n` → mean approximately normal. L2.
3. CLT does not make the individual observations normal. L3.

**Validation.** Scenario templates carry theorem-condition certificates; no universal hard `n` is implied outside the declared rule.

### Cross-family progression

Sampling design precedes sampling formulas. Small exact enumeration gives meaning to a sampling distribution, after which mean/proportion standard errors are introduced. LLN and CLT are contrasted repeatedly: LLN concerns concentration/convergence; CLT concerns standardized distribution shape.

## 9. Category: Estimation and confidence

### Category purpose

Train construction of estimates and intervals while preserving the assumptions and long-run meaning of confidence.

### Learn

A common interval has the form `estimate ± critical value × standard error`. Confidence level controls the critical value; sample size controls standard error. The formula changes with the parameter, known/unknown variability, design, and sample size. Report the parameter and units, not only two endpoints.

### Prerequisites

Sampling distributions, z/normal quantiles, sample mean/proportion.

### Common misconceptions

- Using raw SD as margin of error.
- Using z when a t procedure is specified for unknown population SD.
- Putting a sample value where the null/model parameter belongs in an SE formula, or vice versa.
- Saying a frequentist interval gives a probability that the fixed parameter lies inside.
- Claiming 95% of observations lie in a 95% confidence interval for a mean.
- Believing higher confidence makes an interval narrower.
- Believing large `n` repairs biased data.

### Family `point_estimate_and_bias`

**Task.** Match a parameter to an estimator or determine estimator bias from a small sampling distribution.

**Response and template.** Matching/numeric: `The sampling distribution of T is {table}. Estimate its bias for parameter θ={theta}.`

**Derivation.** `bias(T)=E[T]−θ`; estimator labels follow semantic parameter mappings.

**Difficulty.** L1 statistic-to-parameter; L2 compute bias; L3 compare bias and variability/MSE from small tables.

**Examples.**

1. `p̂` estimates population proportion `p`. L1.
2. `E[T]=12,θ=10` → bias `2`. L2.
3. Compare unbiased high-variance and slightly biased low-variance estimators using supplied MSE. L3.

**Validation.** Exact sampling-distribution moment oracle and semantic mapping.

### Family `margin_of_error_components`

**Task.** Identify/calculate estimate, SE, critical value, and margin of error.

**Response and template.** Named fields: `For {interval_inputs}, fill estimate, SE, critical value, and ME.`

**Derivation.** Family-specific `SE`; `ME=critical×SE`.

**Difficulty.** L1 supplied SE/critical; L2 derive SE; L3 recover `n` or critical value from ME.

**Examples.**

1. SE `2`, critical `1.96` → ME `3.92`. L1.
2. `σ=12,n=36` → SE `2`, then ME. L2.
3. ME `1.96`, `σ=10`, 95% z → `n=100`. L3.

**Validation.** Exact/sufficient-precision algebra and inverse substitution.

### Family `mean_confidence_interval`

**Task.** Construct a one-mean z or t interval under explicitly satisfied assumptions.

**Response and template.** Endpoint fields: `{sample_summary}. Construct a {confidence}% {z_or_t} interval for μ.`

**Derivation.** `x̄ ± critical×(σ/√n)` for z or `x̄ ± t* s/√n` for supplied/locally tabulated t critical with `df=n−1`.

**Difficulty.** L1 components supplied; L2 choose z versus t; L3 compare confidence/sample-size effects.

**Examples.**

1. `x̄=50,SE=2,z*=1.96` → `(46.08,53.92)`. L1.
2. `n=16,x̄=20,s=4,t*=2.131` → `20±2.131`. L2.
3. Same data: 99% interval wider than 95%. L3.

**Validation.** Endpoint recomputation, ordering, df/critical-table agreement, and assumptions certificate.

### Family `proportion_confidence_interval`

**Task.** Construct a one-proportion interval with the specified method.

**Response and template.** Endpoint fields: `x={successes} of n={n}. Construct a {confidence}% {method} interval for p.`

**Derivation.** For Wilson with `z=z*`, use:

```text
center = [p̂ + z²/(2n)] / [1 + z²/n]
half   = z/[1 + z²/n] × sqrt[p̂(1−p̂)/n + z²/(4n²)]
interval = center ± half
```

A textbook Wald variant `p̂±z*sqrt[p̂(1−p̂)/n]` is allowed only when named and its declared adequacy conditions pass.

**Difficulty.** L1 supplied `p̂`/SE Wald; L2 full Wilson computation via helper fields; L3 compare methods near boundaries.

**Examples.**

1. `p̂=.6,SE=.05,z*=1.96` Wald → `(.502,.698)`. L1.
2. Compute Wilson for `8/10` with displayed formula. L2.
3. For `1/10`, explain why naïve Wald is fragile and use requested Wilson. L3.

**Distractors and validation.** Wrong SE, percent/count confusion, endpoints outside `[0,1]` accepted blindly. Cross-check trusted formula implementation.

### Family `confidence_interval_interpretation`

**Task.** Select the valid frequentist interpretation and diagnose invalid claims.

**Response and template.** Claim classification: `A {confidence}% interval for {parameter} is {interval}. Which statement is correct?`

**Derivation.** Correct option refers to the long-run coverage procedure and the parameter/context; optional practical conclusion must be bounded by interval.

**Difficulty.** L1 choose interpretation; L2 distinguish observations/statistic/parameter; L3 evaluate repeated intervals or practical threshold.

**Examples.**

1. Valid: “Methods used this way capture μ in about 95% of repeated samples.” L1.
2. Invalid: “95% of individual values lie in the interval.” L2.
3. If interval for effect crosses a practical threshold, data do not rule out values on either side. L3.

**Validation.** Authored claims map to formal quantifier/target schemas; exactly one fully valid option.

### Family `sample_size_for_precision`

**Task.** Find minimum sample size for a requested margin of error under a declared planning model.

**Response and template.** Integer: `What minimum n gives ME≤{target} at {confidence}, given {planning_inputs}?`

**Derivation.** Mean: `n≥(z*σ/ME)²`; proportion: `n≥z*² p*(1−p*)/ME²`, using `p*=.5` when conservative planning is requested. Always round up.

**Difficulty.** L1 mean; L2 proportion; L3 finite population correction only when formula supplied.

**Examples.**

1. `z*=2,σ=10,ME=2` → `n≥100`. L1.
2. 95%, conservative proportion, ME `.05` → ceil `384.16=385`. L2.
3. Raw result `72.01` → `73`, never 72. L3.

**Validation.** Check chosen `n` meets target and `n−1` fails (when `n>1`).

### Family `credible_vs_confidence_interval`

**Task.** Distinguish a Bayesian credible interval from a frequentist confidence interval in a supplied model.

**Response and template.** Matching/claim choice: `{procedure_description}. Which probability/coverage statement is licensed?`

**Derivation.** Semantic model marks posterior distribution versus repeated-sampling procedure.

**Difficulty.** L1 terminology; L2 statement choice; L3 same numeric endpoints with different inferential meanings.

**Examples.**

1. Posterior has 95% mass in `[a,b]` → 95% credible interval. L1.
2. Repeated-sample method with 95% coverage → confidence interval. L2.
3. Identical `[2,5]` endpoints do not make the interpretations interchangeable. L3.

**Validation.** Claim templates are formally typed by probability target and repeated-sampling/posterior model.

### Cross-family progression

Estimator targets and interval components come first. Mean intervals precede proportions; interpretation is interleaved with every construction family. Sample-size questions follow margin of error. The credible/confidence contrast unlocks only after Bayes and confidence-interpretation fluency.

## 10. Category: Hypothesis tests, errors, and power

### Category purpose

Train the logic of testing as a conditional compatibility calculation, not a machine for proving hypotheses.

### Learn

State `H₀`, `H₁`, and the tail before calculating. A test statistic measures distance from the null in standard-error units. The p-value is computed under `H₀` in the direction(s) of `H₁`. Compare it with preselected `α`, then state a contextual conclusion with calibrated language.

### Prerequisites

Normal/t distributions, standard error, conditional probability, confidence intervals.

### Common misconceptions

- Putting the sample statistic in `H₀`.
- Using equality in the alternative rather than null.
- Choosing a one-sided tail after seeing the result.
- Calling the p-value `P(H₀|data)`.
- Saying “accept H₀” after failure to reject.
- Equating small p-value with large or important effect.
- Confusing Type I/II errors and power.
- Selecting a test from outcome type alone while ignoring pairing/design.

### Family `form_hypotheses_and_tail`

**Task.** Construct/select `H₀`, `H₁`, and tail from a controlled research claim.

**Response and template.** Formula choice/matching: `{claim_and_parameter_definition}. Choose H₀, H₁, and test tail.`

**Derivation.** Null contains equality at benchmark `θ₀`; alternative mirrors “less,” “greater,” or “different.”

**Difficulty.** L1 one mean/proportion; L2 translate contextual direction; L3 distinguish pre-registered one-sided from post-hoc direction.

**Examples.**

1. “Mean differs from 50” → `H₀:μ=50,H₁:μ≠50`, two-sided. L1.
2. “Defect rate is below .04” → `H₁:p<.04`, left. L2.
3. Observed increase alone does not license changing a two-sided plan to right-sided. L3.

**Validation.** Claim AST maps uniquely to parameter, benchmark, comparison, and tail.

### Family `one_sample_test_statistic`

**Task.** Compute z/t statistic for a one-mean or one-proportion test under supplied conditions.

**Response and template.** Numeric: `Under H₀:{parameter}={null}, with {sample_summary}, find {statistic}.`

**Derivation.** Mean z/t `(x̄−μ₀)/(σ/√n or s/√n)`; proportion z `(p̂−p₀)/sqrt[p₀(1−p₀)/n]`.

**Difficulty.** L1 SE supplied; L2 choose null-based SE; L3 sign/tail interpretation or t degrees of freedom.

**Examples.**

1. `x̄=54,μ₀=50,SE=2` → `z=2`. L1.
2. `p̂=.55,p₀=.5,n=100` → `z=1`. L2.
3. `n=16,x̄=18,μ₀=20,s=4` → `t=−2,df=15`. L3.

**Distractors and validation.** Reverse numerator, use sample proportion inside null SE, omit `√n`. Recompute and cross-check sign.

### Family `two_sample_difference_inference`

**Task.** Compute a standardized difference or confidence interval for two independent groups or paired differences under a displayed procedure.

**Response and template.** Numeric/endpoints: `{design_and_summaries}. Using {displayed_procedure}, estimate/test {parameter_difference}.`

**Derivation.** Independent means use estimate `x̄₁−x̄₂` and displayed Welch SE `sqrt(s₁²/n₁+s₂²/n₂)`; paired data first form within-pair differences and then use one-sample inference on those differences. Independent proportions use the displayed pooled null SE for a test or unpooled SE for an interval.

**Difficulty.** L1 calculate a difference; L2 use supplied SE/critical value; L3 choose paired versus independent and pooled-null versus unpooled interval SE.

**Examples.**

1. Means `12` and `9` → estimated difference `3`. L1.
2. Independent estimate `3`, SE `1.2` → test statistic against zero `2.5`. L2.
3. Before/after on the same six people → analyze six differences, not two independent samples. L3.

**Distractors and validation.** Add means, reverse requested order, treat pairs as independent, or pool proportion SE in an interval. Recompute from raw generated data and verify the displayed procedure’s assumptions.

### Family `p_value_from_statistic`

**Task.** Obtain/identify a p-value from a test statistic and declared tail.

**Response and template.** Probability: `Test statistic {value} follows {null_distribution}. Find the {tail} p-value.`

**Derivation.** Left `F(t)`, right `1−F(t)`, two-sided `2 min(F(t),1−F(t))` for symmetric continuous null distributions.

**Difficulty.** L1 supplied tail area; L2 normal CDF; L3 t table/range or exact discrete p-value with enumerated null distribution.

**Examples.**

1. Right-tailed z=2, `Φ(2)=.97725` → `.02275`. L1.
2. Two-sided z=−1.96 → about `.05`. L2.
3. Exact null masses supplied: sum outcomes at least as extreme under the declared statistic. L3.

**Validation.** Independent CDF/tail implementations; p-value in `[0,1]`; discrete extremeness rule explicit.

### Family `test_decision_context`

**Task.** Compare p-value with α and state the strongest warranted contextual conclusion.

**Response and template.** Two fields: `p={p}, α={alpha}. Decision? Contextual conclusion?`

**Derivation.** Reject iff `p≤α` under declared convention; conclusion mirrors alternative or says insufficient evidence.

**Difficulty.** L1 decision; L2 contextual wording; L3 separate statistical and practical significance using effect/threshold.

**Examples.**

1. `.03≤.05` → reject `H₀`. L1.
2. `.12>.05` → fail to reject; not “prove no difference.” L2.
3. Tiny p-value with effect `.01` below practical threshold → statistically but not practically important under threshold. L3.

**Validation.** Exact comparison before displayed rounding; semantic conclusion options checked against decision and claim.

### Family `type_errors_and_power`

**Task.** Identify Type I/II error in context or calculate simple power/error probabilities from a supplied decision rule.

**Response and template.** Matching/probability: `Under decision rule {rule}, classify {wrong_decision} or find {alpha_beta_power}.`

**Derivation.** Evaluate rejection-region probability under null for α and under stated alternative for power; `β=1−power`.

**Difficulty.** L1 contextual classification; L2 supplied two-state table; L3 normal cutoff and power under one alternative.

**Examples.**

1. Reject “process meets standard” when it truly does → Type I. L1.
2. Power `.8` → β `.2` at that alternative. L2.
3. Compute right-tail rejection probability under shifted normal alternative. L3.

**Distractors and validation.** Swap error types, say `1−α` is power, or omit specific alternative. Distribution-area oracle verifies rates.

### Family `choose_inference_procedure`

**Task.** Select a suitable bounded procedure from parameter, design, sample structure, and assumptions.

**Response and template.** Single-choice: `{study_and_data_description}. Which procedure fits best?`

**Derivation.** Decision schema uses outcome type, number of groups, pairing, known σ, count adequacy, and question target.

**Difficulty.** L1 mean versus proportion; L2 one/two sample; L3 paired versus independent or chi-square association.

**Examples.**

1. One quantitative sample, unknown σ → one-sample t. L1.
2. Before/after values on same people → paired t on differences. L2.
3. Two categorical variables in a contingency table → chi-square association. L3.

**Validation.** Correct procedure’s assumptions satisfied; every distractor violates a named feature.

### Family `chi_square_table`

**Task.** Compute expected counts, contributions, statistic, degrees of freedom, or decision for goodness-of-fit/independence.

**Response and template.** Table/numeric: `For observed table {O}, complete expected counts and χ²=Σ(O−E)²/E.`

**Derivation.** GOF expected counts from declared proportions; independence `E_ij=row_i total×column_j total/grand total`; `df=k−1` or `(r−1)(c−1)`.

**Difficulty.** L1 one expected count; L2 full small statistic; L3 supplied critical/p-value decision and assumption check.

**Examples.**

1. 100 cases equally expected across 4 groups → each `25`. L1.
2. `2×2` table expected cell from margins → row×column/total. L2.
3. `χ²=6.1,df=2,p=.047` → reject at `.05`, not at `.01`. L3.

**Validation.** Expected margins reproduce observed margins; contributions non-negative; second numerical sum agrees.

### Cross-family progression

Hypotheses/tails precede statistics; p-values precede decisions. Interpretation is interleaved after every numeric question. Error/power questions follow decision logic. Procedure selection is used diagnostically before mixed tests, and chi-square enters only after contingency tables.

## 11. Category: Association, regression, and study reasoning

### Category purpose

Train the distinction between description, prediction, association, and causation while making simple bivariate calculations fluent.

### Learn

Correlation describes linear direction and strength and is unitless; it is not causation. Least-squares regression predicts a response from an explanatory variable. A residual is observed minus predicted. Random assignment supports causal comparison; random sampling supports population generalization. Aggregation, confounding, outliers, and multiple testing can change conclusions.

### Prerequisites

Data displays, mean/SD, conditional proportions, inference concepts.

### Common misconceptions

- Inferring causation from correlation.
- Claiming `r=.8` means “80% correlated” or 80% change.
- Swapping explanatory and response variables without changing the regression.
- Computing residual as predicted minus observed.
- Interpreting an intercept far outside the data range.
- Extrapolating without qualification.
- Treating a lurking variable as proof of one particular causal story.
- Ignoring group composition in Simpson’s paradox.

### Family `contingency_association`

**Task.** Compare conditional proportions and decide whether a two-way table shows association.

**Response and template.** Probability/choice: `Compute {row-conditioned rates}. Are the variables associated in this table?`

**Derivation.** Compare response proportions within explanatory groups; equality means empirical independence in the displayed table.

**Difficulty.** L1 one rate; L2 risk difference/ratio; L3 direction across several groups.

**Examples.**

1. Success `30/50` in A versus `20/50` in B → difference `.2`. L1.
2. Risk ratio `.6/.4=1.5`. L2.
3. Equal conditional distributions across all rows → no association in table. L3.

**Validation.** Exact table ratios and independence product check.

### Family `covariance_correlation`

**Task.** Determine sign or calculate covariance/correlation from small data or standardized summaries.

**Response and template.** Numeric/choice: `For paired data {points}, find {covariance_or_r} using {sample_or_population} convention.`

**Derivation.** Center products; sample covariance divides by `n−1`; `r=s_xy/(s_xs_y)` for nonzero SDs.

**Difficulty.** L1 sign from scatter; L2 exact covariance; L3 correlation from z-score products/transformation effects.

**Examples.**

1. Points rising left-to-right → positive covariance. L1.
2. `(1,1),(2,3),(3,5)` → `r=1`. L2.
3. Replace `Y` by `−2Y+5` → correlation sign flips, magnitude unchanged. L3.

**Validation.** Centered-dot and raw-sum formulas agree; enforce `−1≤r≤1`.

### Family `least_squares_line`

**Task.** Calculate a least-squares slope/intercept or fit a tiny dataset.

**Response and template.** Named fields: `Given x̄,ȳ,s_x,s_y,r, find ŷ=b₀+b₁x.`

**Derivation.** `b₁=r(s_y/s_x)`, `b₀=ȳ−b₁x̄`; raw-data variant minimizes exact squared residuals.

**Difficulty.** L1 supplied summaries; L2 raw 3–5 points; L3 transformation or reverse missing summary.

**Examples.**

1. `r=.5,s_y=4,s_x=2` → slope `1`. L1.
2. With `x̄=3,ȳ=7,b₁=1` → intercept `4`. L2.
3. Verify fitted line passes through `(x̄,ȳ)`. L3.

**Validation.** Normal equations, centroid property, and independent exact least-squares solution.

### Family `regression_interpretation`

**Task.** Select a context-correct interpretation of slope/intercept and identify extrapolation.

**Response and template.** Claim choice: `For ŷ={b0}+{b1}x, where {units_and_range}, which statement is justified?`

**Derivation.** Slope units are response units per explanatory unit; intercept is predicted response at `x=0`, meaningful only if context/range permits.

**Difficulty.** L1 slope; L2 intercept caveat; L3 extrapolation and association-only language.

**Examples.**

1. Slope `2 kg/year` → predicted weight increases 2 kg per additional year in fitted range. L1.
2. Intercept at age 0 when data are ages 30–60 may lack practical meaning. L2.
3. Prediction at x=100 outside x range 0–10 is extrapolation. L3.

**Validation.** Units and range come from semantic model; only one option preserves direction, units, scope, and causal status.

### Family `prediction_residual_r_squared`

**Task.** Calculate prediction/residual or interpret `R²` for simple regression.

**Response and template.** Numeric/claim: `Using {line}, predict at x={x}; observed y={y}. Find residual and interpret R²={r2}.`

**Derivation.** `ŷ=b₀+b₁x`; residual `e=y−ŷ`; `R²=r²` for simple intercept regression and is proportion of sample response variation accounted for by the fitted linear model.

**Difficulty.** L1 prediction; L2 residual; L3 R² and remaining-variation statement.

**Examples.**

1. `ŷ=2+3x,x=4` → `14`. L1.
2. Observed `11`, predicted `14` → residual `−3`. L2.
3. `R²=.64` → 64% of observed response variation accounted for in sample, not 64% causal. L3.

**Validation.** Exact line evaluation; raw fit has residual sum zero when intercept included (within numerical tolerance).

### Family `outlier_influence`

**Task.** Predict or compute how a generated point changes mean, median, correlation, or regression.

**Response and template.** Comparison: `A point {point} is added. Which summaries change in the displayed way?`

**Derivation.** Recompute summaries exactly before/after; classify leverage by x-position and influence by fitted-line change.

**Difficulty.** L1 center robustness; L2 correlation change; L3 high leverage versus large residual.

**Examples.**

1. Add extreme high value → mean rises more than median. L1.
2. Add point continuing the linear trend → |r| may increase. L2.
3. Far-x point on current line has high leverage but little influence on this fit. L3.

**Validation.** Exact before/after statistics; reject cases where claimed qualitative change is too small after rounding.

### Family `simpsons_paradox`

**Task.** Compare aggregated and stratified rates and identify a reversal caused by group composition.

**Response and template.** Table/named rates: `Compute rates overall and within each stratum. Which comparison reverses?`

**Derivation.** Exact conditional rates by group and pooled totals; generation constructs a genuine strict reversal.

**Difficulty.** L1 read group rates; L2 compute pooled rate; L3 explain with controlled “different group weights” clause.

**Examples.**

1. Treatment A higher in each severity group but lower overall due to more severe cases. L3.
2. Departments show equal within-group rates but unequal aggregate rates. L2.
3. No reversal: pooled and every stratum point same direction—do not label paradox. L2.

**Validation.** Strict inequality certificates within every stratum and opposite pooled inequality.

### Family `study_design_causality`

**Task.** Determine what population/causal conclusion a study design supports and identify confounding controls.

**Response and template.** Multiple-choice/matching: `{sampling_assignment_blinding_description}. Which conclusion is supported?`

**Derivation.** Random sampling controls selection for generalization; random assignment balances confounders in expectation for causal comparison; blinding targets behavior/measurement bias.

**Difficulty.** L1 sampling versus assignment; L2 controls/blinding; L3 factorial combination of generalization and causation.

**Examples.**

1. Random sample, no intervention → population association, not causation. L1.
2. Random assignment of volunteers → causal inference for study participants; limited generalization. L2.
3. Random population sample plus random assignment → strongest support for both. L3.

**Validation.** Design-feature truth table controls conclusions; distractors each overclaim one missing property.

### Family `multiplicity_and_selective_reporting`

**Task.** Calculate familywise false-positive probability in an independent toy model or diagnose multiple-testing/selective-reporting risk.

**Response and template.** Probability/claim: `Under {m} independent true null tests at α={alpha}, what is P(at least one rejection)?`

**Derivation.** `1−(1−α)^m` under explicitly stated independence; Bonferroni threshold `α/m` when requested.

**Difficulty.** L1 qualitative risk; L2 numeric independent model; L3 Bonferroni or pre-specified versus selected analysis.

**Examples.**

1. More tests create more chances for at least one false positive. L1.
2. 10 independent tests at `.05` → `1−.95^10≈.401`. L2.
3. Family α `.05` over 5 tests → Bonferroni per-test `.01`. L3.

**Validation.** Complement oracle/enumeration; independence limitation appears in prompt and feedback.

### Cross-family progression

Contingency-table conditionals precede chi-square and Simpson’s paradox. Scatterplot sign precedes covariance, which precedes fitting and interpretation. Residuals and `R²` follow a fitted line. Design/causality questions are interleaved with association so calculation never silently becomes causal evidence. Multiplicity belongs after p-value fluency.

## 12. Topic-wide progression

Recommended introduction order:

1. variable types, frequency, center, and graph reading;
2. sample-space enumeration, addition/product principles, and combinations;
3. complements, unions, joint tables, conditionals, trees, and independence;
4. natural-frequency and formula Bayes, followed by base-rate contrasts;
5. PMFs, expectation, variance, binomial/geometric/hypergeometric models;
6. density/CDF area, uniform/exponential, and normal standardization;
7. sampling design, exact sampling distributions, SE, LLN, and CLT;
8. point estimates, confidence intervals, interpretation, and precision planning;
9. hypotheses, test statistics, p-values, decisions, errors, and procedure choice;
10. association, regression, study design, Simpson’s paradox, and multiplicity;
11. odds/sequential/multi-hypothesis Bayes and mixed statistical reasoning.

Recommended prerequisite gates:

- conditional probability gates all computational Bayes families;
- multiplication/combinations/independence gate binomial probability;
- PMF expectation gates distribution moments;
- normal standardization gates sample-mean probabilities and z inference;
- sampling distributions gate confidence intervals and tests;
- p-value interpretation gates multiplicity;
- conditional table fluency gates chi-square and Simpson’s paradox;
- scatterplot/correlation fluency gates regression interpretation.

Interleave rather than isolate:

- numeric and interpretive questions about the same result;
- tables, trees, formulas, and natural frequencies for one conditional model;
- binomial versus hypergeometric and geometric versus exponential contrasts;
- raw SD, sampling SE, and interval ME comparisons;
- confidence-interval and compatible two-sided-test conclusions;
- aggregate and stratified data;
- observational and experimental versions of similar scenarios;
- exact finite answers and simulation as a check, never as competing truths.

Mixed questions should contain no more than three essential reasoning stages. A long investigation should be a sequence of locally graded steps: model → calculation → interpretation, with partial mastery credit.

## 13. Adaptive practice guidance

Track mastery by:

`category`, `family`, `representation`, `operationDirection`, `denominatorType`, `dependencyDepth`, `distribution`, `samplingDesign`, `parameter`, `tail`, `intervalFramework`, `assumption`, `calculationStep`, `interpretationClaim`, and `misconception`.

Do not collapse these into one “statistics level.” A learner may calculate accurately yet systematically make invalid interpretations.

| Error pattern | Likely diagnosis | Follow-up |
|---|---|---|
| uses total instead of conditioned count | denominator not restricted | highlight eligible row, then retry conditional |
| gives `P(E|H)` for `P(H|E)` | reverse-conditional confusion | natural-frequency table before formula Bayes |
| omits false-positive branch | evidence normalization missing | complete both tree leaves into evidence |
| posterior ignores rare prior | base-rate neglect | same likelihoods with two contrasted priors |
| adds probabilities for intersection | event-rule selection | tree path multiply versus leaf sum |
| multiplies marginals without support | assumed independence | paired dependent/independent table |
| uses binomial without replacement | mechanism-model mismatch | compare binomial and hypergeometric setup |
| expectation is unweighted mean | random-variable weighting | two-outcome payoff table with visible masses |
| variance answer equals `E[X²]` | missing squared-mean subtraction | structured `E[X], E[X²]` fields |
| uses variance as normal denominator | `σ²` versus `σ` confusion | notation match then z-score |
| reports positive point probability for density | density/probability conflation | area of shrinking intervals around point |
| uses `σ/n` as SE | square-root scaling missed | sample-size ratio questions |
| claims larger sample fixes bias | variability/bias conflation | same biased method at two sizes |
| treats CLT as raw-data normality | statistic/population confusion | side-by-side raw and mean distributions |
| says 95% of observations are in CI | target confusion | match prediction/data/parameter intervals |
| says 95% probability parameter is in CI | framework confusion | confidence versus credible pair |
| uses sample statistic in null SE | null-model simulation missed | label “computed under H₀” inputs |
| p-value read as `P(H₀|data)` | inverse probability confusion | contrast p-value with Bayes posterior |
| “accept H₀” | test-decision overclaim | evidence-language choice after non-rejection |
| small p implies important effect | magnitude/evidence conflation | effect plus practical threshold |
| swaps Type I/II | truth/decision axes confused | 2×2 truth-by-decision table |
| `r=.7` interpreted as 70% | correlation-scale misconception | choose unitless direction/strength claim |
| residual sign reversed | observed-minus-predicted order | place observation and prediction on vertical line |
| causal claim from observational data | design ignored | same association under randomized/nonrandom designs |
| pooled rate used despite strata reversal | aggregation bias | calculate within-group rates first |

Selection guidance after prerequisites:

- 35% weakest due family/misconception;
- 25% spaced mastered material;
- 15% representation transfer;
- 10% interpretation paired with a recent calculation;
- 10% prerequisite diagnostics;
- 5% mixed synthesis.

Slow but correct calculation should trigger more fluent arithmetic forms without lowering conceptual level. Fast formula use followed by interpretation errors should increase claim-classification, not repeat larger computations. When a mixed item fails, decompose it at the earliest uncertain decision: sample space, model, denominator, formula, arithmetic, or conclusion.

## 14. Feedback and worked-solution requirements

Every worked solution should show only the stages relevant to the skill:

1. identify the target quantity/parameter and conditioning set;
2. state the random, distributional, sampling, or design assumptions being used;
3. choose the rule/model and explain why it applies;
4. substitute exact values with labels;
5. calculate without premature rounding;
6. report units/format and a bounded interpretation;
7. perform a useful check: complement, total mass, range, sign, simulation, or inverse substitution.

Diagnostic feedback should name the learner’s likely operation:

> `90%` is the sensitivity, `P(alert|faulty)`. The question asks for the reverse conditional, `P(faulty|alert)`, whose denominator includes false alerts.

> You multiplied the two marginal probabilities. That is valid only under independence; these draws are without replacement, so the second red probability changes.

> Your `12` is the standard deviation of individual values. The sample mean’s standard error is `12/√36=2`.

> A p-value of `.03` is calculated assuming the null model. It is not a 3% probability that the null hypothesis is true.

Correct feedback should confirm both number and meaning:

> Correct: the posterior is `15/23≈65.2%`. Of the total evidence mass `.23`, `.15` comes from `H`.

For rounding-only errors, show the unrounded value and requested rounding without marking the underlying reasoning as a conceptual failure. For a valid alternative method, accept it and show the app’s shorter method as an option, not a correction.

## 15. Rendering, interaction, and accessibility

- Use semantic HTML tables with row/column headers for data, probability, and contingency tables.
- Every SVG/chart has a text summary and exact accessible data table.
- Keyboard users can select chart regions, tree branches, formula tokens, and table cells.
- Math has MathML or equivalent accessible linear text from the same expression AST.
- Screen-reader phrasing distinguishes `P of A given B`, `A intersect B`, complement, population sigma, sample s, x-bar, p-hat, and chi-square.
- Probabilities and units are never distinguished only by color.
- Histograms expose bin boundaries and counts; box plots expose the five-number summary; scatterplots expose points.
- Tooltips may define a term but must not be required to solve.
- Numeric fields state expected form and rounding beside the field.
- Tables remain usable at narrow widths through focused rows/columns rather than illegible scaling.
- Motion in simulations is optional, pausable, and accompanied by a deterministic step/table mode.
- Scenario names and demographic categories should be varied, respectful, and irrelevant to the numeric answer unless the category itself is the variable.

## 16. Generator and implementation requirements

### Semantic-first construction

Generate latent exact models before prose:

- Venn-region mass vector;
- weighted outcome list;
- probability tree/partition;
- finite joint distribution;
- PMF/CDF;
- parametric distribution with versioned parameterization;
- raw dataset and variable schema;
- population plus sampling/assignment mechanism;
- interval/test model;
- paired point set or contingency cube.

Derive every number, diagram, answer, distractor, and solution from that object. Never independently randomize totals and cells, priors and complements, or chart labels and raw data.

Backward generation is preferred when it creates readable instances:

- choose integer branch counts, then derive rates;
- choose exact Venn regions, then derive marginals;
- choose a friendly mean/variance or regression line, then construct data;
- choose posterior weights, then derive compatible priors/likelihoods;
- choose test statistic/SE, then derive a sample statistic;
- choose interval endpoints/ME, then derive a compatible center.

### Local numerical engine

The standalone page should include:

- `BigInt` combinations/permutations with cancellation to avoid factorial overflow;
- normalized rational arithmetic;
- stable binomial/Poisson recurrence or log-PMF evaluation;
- standard-normal CDF and inverse with documented maximum error;
- Student-t CDF/quantiles for bounded degrees of freedom if t calculation is enabled;
- chi-square tail computation/table for bounded degrees of freedom;
- deterministic seeded PRNG for simulation and fixtures;
- numerically stable one-pass display statistics plus exact/two-pass oracle paths;
- semantic interval/tail and event ASTs.

No `eval`, `Function`, remote library, live dataset, backend, runtime compiler, or network lookup is permitted. If an accurate distribution routine is too large for v1, the family must supply a versioned local table or provide the needed critical/CDF values; it must not fake precision.

### Distractor provenance

Every distractor stores a misconception identifier and the transformation used, such as:

`reverseConditional`, `wrongDenominatorGrandTotal`, `ignoreOverlap`, `assumeIndependence`, `addAlongTreePath`, `permutationForCombination`, `omitBinomialCoefficient`, `varianceVsSD`, `rawSDVsSE`, `wrongTail`, `pValueAsPosterior`, `acceptNull`, `residualSign`, or `causalOverclaim`.

Reject distractors that:

- equal the answer after normalization/rounding;
- become correct under another reasonable interpretation of ambiguous wording;
- rely on arithmetic slips with no statistical meaning;
- disclose the answer through length, precision, or grammatical agreement;
- repeat the same misconception twice in one choice set.

### Scenario language

Scenario text is assembled from audited templates with explicit semantic roles. It must:

- state selection, replacement, independence, timing, and grouping when relevant;
- define success/event labels without moral implication;
- avoid medical, legal, credit, hiring, or investment recommendations;
- avoid stereotyped group-performance associations;
- keep narrative detail minimal and stable under localization;
- preserve exact conditioning direction in translation.

## 17. Automated validation

For every generated instance:

- all placeholders are substituted and parse to the expected semantic types;
- exact probabilities are in `[0,1]`;
- complete outcome/region/leaf/PMF masses sum exactly to `1`;
- event expressions select the intended outcome subset;
- conditional denominators are positive;
- partitions are mutually exclusive and exhaustive;
- count expressions are non-negative integers and enumeration agrees for test-sized parameters;
- every named distribution’s mechanism and parameters satisfy its definition;
- all displayed table margins, chart values, and raw data agree;
- sample/population formula convention matches wording and notation;
- exact and displayed rounded answers remain within the declared tolerance;
- every multiple-choice item has exactly one correct choice;
- each distractor is distinct and reproduces its named misconception;
- inverse-generated values substitute back successfully;
- worked-solution intermediate values lead to the canonical answer;
- assumptions shown to the learner are sufficient for every theorem/procedure used.

Family-specific property tests:

- Bayes: formula, frequency table, tree, joint table, and odds agree;
- binomial: PMF mass sums to `1` and small cases match enumeration;
- geometric/exponential: memoryless identities hold numerically/exactly as applicable;
- hypergeometric: support and subset enumeration agree;
- Poisson/normal/t/chi-square: compare local routines over a fixed grid with a trusted development-time library and version error bounds;
- sampling distributions: exhaustive small-population result agrees with moment identities;
- confidence intervals: endpoint formulas and inverse ME/sample-size checks agree;
- hypothesis tests: tail, p-value, and decision are internally consistent before rounding;
- regression: normal equations, centroid property, residual identities, and `R²` relation hold;
- Simpson instances: every stratum has one strict direction and aggregate has the strict reverse;
- charts: screenshot/DOM geometry tests agree with accessible table values.

Run seeded fuzz/property tests over at least:

- 100,000 exact finite probability/counting instances;
- 50,000 Bayes/conditional models, including extreme but displayable priors;
- 50,000 PMF/distribution instances;
- 25,000 interval/test instances across tails and decisions;
- 25,000 data/regression/table instances;
- every authored interpretation and design scenario in all supported locales.

No item should enter production merely because its primary generator can reproduce its own answer.

## 18. Coverage requirements

Track a rolling coverage matrix and prevent easiest variants from dominating.

Required balance:

- categorical/discrete/continuous variable types;
- odd/even data counts, sample/population spread, symmetric/skewed/outlier cases;
- ordered/unordered and replacement/no-replacement counting;
- disjoint/overlapping/independent/dependent event pairs;
- direct/reverse conditionals and all table conditioning directions;
- Bayes posteriors below, near, and above priors; supporting and opposing evidence; two and 3–4 hypotheses;
- exact fraction, decimal, percentage, table, tree, formula, odds, and natural-frequency representations;
- valid and invalid binomial mechanisms;
- central/left/right/two-sided probability regions;
- sampling bias and variability as separate causes;
- z/t, mean/proportion, confidence/credible, and construction/interpretation;
- left/right/two-sided tests, reject/fail-to-reject, Type I/II/power;
- positive/negative/near-zero correlation and influential/non-influential unusual points;
- random sample only, random assignment only, both, and neither;
- aggregate/stratified conclusions with and without reversal.

Within a session:

- do not repeat an exact numeric instance within 100 questions;
- suppress the same structural signature for 20 questions;
- do not show more than two consecutive questions with the same representation;
- ensure at least one interpretation item per four calculation items in inference categories;
- ensure at least one model-selection/assumption item per five named-distribution questions;
- rotate scenario frames without changing difficulty invisibly.

## 19. Topic-level quality checklist

Before implementation acceptance, verify:

- [ ] Every family trains a repeatable decision or calculation, not vocabulary recall alone.
- [ ] Random mechanisms, independence, replacement, and equal likelihood are explicit.
- [ ] Quartile, variance, distribution, tail, and rounding conventions are explicit.
- [ ] Bayes includes natural frequencies, base rates, odds, repeated evidence, and multiple hypotheses.
- [ ] Frequentist confidence and Bayesian credibility are not conflated.
- [ ] P-value feedback never states or implies a posterior probability of `H₀`.
- [ ] Statistical and practical significance remain distinct.
- [ ] Sampling and assignment support only appropriately bounded claims.
- [ ] Model-recognition questions accompany formula calculations.
- [ ] Every question can be solved from locally displayed information.
- [ ] Numeric engines have documented error and independent development-time checks.
- [ ] Exact finite questions use exact arithmetic.
- [ ] Multiple valid answer forms are accepted when semantics match.
- [ ] Every choice distractor maps to a plausible misconception.
- [ ] Every family has at least three examples spanning its intended levels.
- [ ] Charts and interactive regions have complete nonvisual equivalents.
- [ ] Difficulty increases through reasoning, not dataset size or arithmetic burden.
- [ ] Generation avoids high-stakes advice, stereotypes, and changing external facts.
- [ ] Adaptive tracking preserves conceptual and interpretive weaknesses separately.
- [ ] Solving many generated instances should improve real probabilistic/statistical judgment.

## 20. Stable navigation

Recommended app category order and stable IDs:

1. `data` — Data, Summaries & Displays
2. `counting` — Counting & Sample Spaces
3. `probability` — Probability Laws
4. `bayes` — Bayes & Evidence
5. `discrete` — Discrete Random Variables
6. `continuous` — Continuous & Normal Models
7. `sampling` — Sampling & Sampling Distributions
8. `estimation` — Estimation & Confidence
9. `testing` — Hypothesis Tests
10. `association` — Association, Regression & Design

Family identifiers in this document are stable persistence/analytics keys. Display labels may be localized; identifiers must not be translated or silently reused for a different semantic task.
