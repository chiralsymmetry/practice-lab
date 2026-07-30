# Spreadsheet Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, workbook-grid renderer, formula parser/evaluator, pivot engine, answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Spreadsheet Practice

### Topic goal

Develop reliable mental execution, construction, and auditing of small spreadsheets.

The learner should become able to:

- navigate cells, ranges, tables, sheets, names, types, and missing values;
- predict how relative, absolute, and mixed references change when formulas are copied;
- evaluate and write formulas without relying on accidental coercion;
- select suitable aggregation, conditional, lookup, text, and date functions;
- reason about sorting, filtering, tables, and dynamic-array results;
- configure and interpret pivot tables from source records;
- trace precedents/dependents, diagnose common errors, and repair copied formulas;
- distinguish displayed formatting from stored values;
- design small input/calculation/output layouts that remain correct when data change;
- verify formulas from invariants rather than trusting plausible-looking totals.

The app should train transferable spreadsheet reasoning, not memorization of ribbon locations or one vendor's keyboard shortcuts.

### Relationship to neighboring Practice Lab topics

- **Data Literacy and Chart Reading** owns general chart interpretation, visual encodings, and misleading-display audits.
- **Accounting and Bookkeeping** owns double-entry logic, statements, and bookkeeping records.
- **SQL and Relational Databases** owns relational query semantics, joins, grouping, `NULL`, schema design, and transactions.
- **Everyday Economics**, **Mental Arithmetic**, and **Algebra Fluency** own domain/general calculations.

Spreadsheet Practice owns grid/reference mechanics, formula semantics, workbook transformations, pivot configuration, and spreadsheet-specific auditing. Contexts may use small sales, inventory, time, project, or accounting tables, but the spreadsheet operation remains the trained skill.

### Audience and prerequisites

Early categories assume:

- basic arithmetic and percentages;
- row/column table reading;
- familiarity with a computer grid is helpful but not required.

Later categories locally introduce:

- Boolean conditions;
- exact and approximate lookup;
- grouping/aggregation;
- date parts;
- pivot dimensions/measures.

No Excel, Google Sheets, LibreOffice, database, or programming installation is required.

### Scope

The initial model ID is `spreadsheet-practice-v1`. It includes:

- grid coordinates, A1 references, inclusive rectangular ranges, sheets, named ranges, structured table references, and typed values;
- relative `A1`, absolute `$A$1`, and mixed `$A1`/`A$1` references;
- copy/fill transformations horizontally, vertically, and across rectangular targets;
- cross-sheet references and bounded insertion/deletion effects under an explicit profile;
- arithmetic, comparison, concatenation, Boolean logic, precedence, percentages, and explicit rounding;
- core functions: `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `COUNTA`, `IF`, `IFS`, `AND`, `OR`, `NOT`, `IFERROR`, `ROUND`, `ROUNDUP`, `ROUNDDOWN`;
- conditional aggregation: `SUMIF`, `COUNTIF`, `AVERAGEIF`, `SUMIFS`, `COUNTIFS`, and `AVERAGEIFS`;
- lookup/reference: exact/approximate `XLOOKUP`, exact/approximate `VLOOKUP`, `INDEX`, `MATCH`;
- text/date: `&`, `CONCAT`, `TEXTJOIN`, `LEFT`, `RIGHT`, `MID`, `LEN`, `TRIM`, `DATE`, `YEAR`, `MONTH`, `DAY`, and declared date differences;
- tables, calculated columns, sorting, multi-key sorting, filtering, deduplication, validation, and structured references;
- optional dynamic arrays: `FILTER`, `SORT`, `UNIQUE`, `SEQUENCE`, and spill-range reasoning;
- pivot fields assigned to Filters, Rows, Columns, and Values; Sum/Count/Average/Min/Max; grouping, filters, grand/subtotals, percentages of totals, source changes, and drill-down reasoning;
- dependency graphs, formula consistency, common error values, circular references, hidden/filtered-row effects, hard-coded constants, and first-error diagnosis;
- bounded chart-source preparation and formula/pivot output reconciliation with the dedicated chart-literacy app;
- synthetic workbooks generated and checked entirely offline.

The intended ceiling is strong general office/analytical spreadsheet fluency, not advanced financial modeling or software automation.

### Exclusions

Do not include:

- vendor ribbon/menu navigation, icon-location recall, keyboard-shortcut trivia, certification-exam trivia, or version-specific UI screenshots;
- VBA, Office Scripts, Apps Script, macros, add-ins, custom functions, Power Query, DAX, Power Pivot/data models, Solver, or external API/database connections;
- live collaboration, comments, permissions, sharing, cloud storage, workbook recovery, or change-history workflows;
- current external data, stock/finance data types, geography data types, web imports, or volatile network functions;
- financial/tax/accounting advice or real personal/business records;
- unrestricted Excel/Sheets formula compatibility or undocumented coercion behavior;
- 1900/1904 date-serial quirks, timezone/DST calculations, locale-dependent serial parsing, or floating-point edge trivia;
- array formulas requiring legacy entry keystrokes;
- general statistics, accounting, database querying, or chart-design content without a spreadsheet-specific operation;
- giant worksheets, manual scanning of hundreds of rows, arbitrary free-form formulas, or runtime execution of an actual vendor spreadsheet engine.

### Normative spreadsheet profile

#### Grid and coordinates

- The workbook has sheets with unique case-insensitive names and preserved display capitalization.
- Default bounded grid is columns `A..ZZ` and rows `1..999`.
- Cell `A1` is column A, row1.
- Range `A1:C3` is inclusive and rectangular; normalized semantics do not depend on which corner is written first unless the task explicitly asks syntax validity.
- Whole-row/whole-column references are excluded from v1 formulas.
- Sheet qualification uses `Sheet2!A1`; names containing spaces use `'Sales 2025'!A1`.
- Three-dimensional sheet ranges, external-workbook references, implicit intersection, and union/intersection range operators are excluded.

#### A1 reference anchors

For a reference copied by displacement `(Δrow,Δcolumn)`:

- `A1`: move row and column;
- `$A$1`: move neither;
- `$A1`: move row only;
- `A$1`: move column only.

Copying applies the displacement independently to every reference component, including both endpoints of a range and references on another sheet. The referenced sheet name stays fixed unless a separately declared sheet-copy family applies. A shifted coordinate outside the grid becomes `#REF!`.

Copy/fill is distinct from moving/cutting. V1 grades copy/fill only; insertion/deletion uses a separately pinned structural-edit rule and is never inferred from vendor behavior.

#### Values and types

Canonical scalar types:

```text
Blank
Number(exact decimal/rational)
Text(Unicode string)
Boolean(TRUE|FALSE)
Date(year,month,day)
Error(code)
```

An empty string `""` is Text of length0 and is not Blank. Display formatting does not change stored type/value.

Dates are semantic calendar dates; displayed formatting may vary. Date serial numbers are hidden from learner-facing questions. Generated dates use the Gregorian calendar and valid explicit components.

Supported errors:

```text
#DIV/0!  #N/A  #REF!  #VALUE!  #NAME?  #SPILL!  #CIRC!
```

`#CIRC!` is this app's pedagogical label for a circular dependency; vendors may display a warning or different behavior.

#### Formula grammar

Canonical formula syntax uses English function names, comma argument separators, period decimal separator, and formulas beginning with `=`.

```text
Formula      := "=" Expression
Expression   := literals, references, ranges, calls, parentheses,
                arithmetic, concatenation, comparisons
PercentLiteral := Number "%"
Reference    := A1Reference | StructuredReference | NamedRange
A1Reference  := [Sheet "!"] ["$"] Column ["$"] Row
Range        := A1Reference ":" A1Reference
StructuredReference := TableName "[" StructuredSelector "]"
Call         := Name "(" [Expression ("," Expression)*] ")"
```

Operators supported:

```text
^
* /
+ -
&
= <> < <= > >=
```

Parentheses take precedence. Exponentiation precedes multiplication/division, which precede addition/subtraction, concatenation, then comparisons. Operators at the same arithmetic level associate left-to-right except exponentiation is right-associative. The generator parenthesizes unary-minus/exponent combinations rather than relying on cross-vendor precedence.

A percent literal such as `15%` is an atomic numeric literal equal to exact `0.15`; v1 does not apply postfix `%` to arbitrary expressions or references.

The evaluator does not use JavaScript truthiness. Comparison and coercion rules are explicit:

- arithmetic requires numeric values or an Error;
- comparison operands have the same type in v1 unless explicit conversion is taught;
- text equality is case-insensitive in the core profile;
- `&` converts scalar Number/Boolean/Date using a declared invariant display formatter;
- Boolean conditions require Boolean values;
- errors propagate unless a supported error-handling function intercepts them.

#### Range/function semantics

- `SUM(range)` sums numeric cells and ignores Blank/Text/Boolean.
- `AVERAGE(range)` averages numeric cells, ignores Blank/Text/Boolean, and returns `#DIV/0!` if none.
- `MIN`/`MAX` use numeric cells and return `0` for no numeric cells only when this explicitly pinned profile is shown; generators normally avoid empty numeric sets.
- `COUNT(range)` counts Number and Date cells. Dates remain semantically typed and their implementation serial is never learner-facing.
- `COUNTA(range)` counts every non-Blank value, including `""`, Boolean, and Error.
- Scalar `IF(condition,when_true,when_false)` evaluates only the selected branch in this profile.
- `AND`/`OR` receive Boolean scalars and do not coerce.
- `IFERROR(value,fallback)` returns fallback for any supported Error, otherwise value.
- `ROUND(x,n)` uses decimal round-half-away-from-zero; `ROUNDUP` moves away from zero and `ROUNDDOWN` toward zero at the declared decimal place.

Function-specific sections below pin criteria, lookup, text, date, and dynamic-array behavior.

#### Criteria grammar

Conditional functions accept:

```text
exact number/text/Boolean
"=x"  "<>x"  ">x"  ">=x"  "<x"  "<=x"
text wildcard "*" and "?"
escape "~" before wildcard/tilde
```

Comparisons are type-compatible and text matching is case-insensitive. Blank criteria are generated only in explicit blank/empty-string families.

In `SUMIFS(sum_range, criteria_range1, criterion1, ...)`, every range has the same shape; each row/cell must satisfy all criteria (logical AND).

#### Lookup semantics

- Exact match returns the first matching source row.
- `XLOOKUP(key,lookup_range,return_range,"not found",0)` is the canonical exact form.
- `XLOOKUP(key,lookup_range,return_range,"not found",-1)` is approximate “exact or next smaller.” Under this profile it finds the greatest key `≤ key` without depending on source order, though generated band tables are normally sorted for readability. Duplicate thresholds are rejected unless duplicate behavior is the target.
- `VLOOKUP(key,table,col,FALSE)` is exact; `TRUE` is approximate-next-smaller under sorted first column.
- `MATCH(key,range,0)` returns one-based position of first exact match.
- `INDEX(range,row,[column])` is one-based within the supplied range.
- `#N/A` represents no lookup match.

No fuzzy matching, binary-search performance questions, wildcard lookup, reverse-search mode, or vendor-specific omitted-argument defaults in v1.

#### Dynamic-array semantics

- `FILTER(array,include,[if_empty])` retains rows whose aligned Boolean include value is TRUE and preserves source order. With no matches it returns `if_empty` when supplied, otherwise `#N/A` in this profile.
- `SORT(array,[sort_column],[ascending])` performs a stable typed sort, defaults to first column ascending, and requires every optional argument explicitly in questions where it matters.
- `UNIQUE(array)` retains the first occurrence of each exact row/value in source order.
- `SEQUENCE(rows,[columns],[start],[step])` fills row-major, defaulting to one column, start1, step1.
- A dynamic array spills from its formula anchor into the exact output rectangle. Any nonblank/non-owned cell in that rectangle yields `#SPILL!`; spill formulas are edited only at the anchor.

#### Pivot semantics

A pivot source is a rectangular record table with unique field names and one header row. Fields have semantic roles:

- **dimension**: grouping key placed in Rows, Columns, or Filters;
- **measure**: numeric/nonblank values aggregated in Values;
- **calculated display**: `% of row`, `% of column`, `% of grand total`, or running total in a named order.

Blank dimension values form explicit `(blank)` groups unless filtered. Aggregations:

- Sum: numeric nonblank values;
- Count Values: every nonblank value;
- Count Numbers: Number and Date values;
- Average: numeric sum/numeric count, blank if count0;
- Min/Max: numeric values, blank if none.

Pivot results are derived from source records after filters. Subtotals/grand totals aggregate source rows, not rounded visible cells. Display rounding occurs last. Source changes do not affect a saved pivot result until an explicit Refresh action in refresh-reasoning families.

### Global answer conventions

- Surrounding whitespace is ignored.
- Formula answers require leading `=` but feedback can suggest it if omitted.
- Function names, cell columns, sheet names, and named ranges compare case-insensitively.
- String literal contents compare according to the question, normally case-sensitive as data even though equality matching is case-insensitive.
- Harmless redundant parentheses and whitespace are accepted.
- Formula equivalence is structural when reference behavior is the skill; two formulas producing the same current value are not equivalent if they copy differently.
- Formula equivalence may be semantic for direct calculation questions within the supported grammar and tested input domain.
- Cell/range answers use structured reference controls or parsed A1 syntax.
- Numeric answers accept exact fractions/decimals; percentages accept a `%` form when requested.
- Error answers use selectable codes.
- Arrays/tables are compared by dimensions, types, and cell values; ordering matters unless the transform promises a set.
- Pivot configurations are checked by semantic field roles/settings, not visual drag order where order is irrelevant.

### Difficulty philosophy

Difficulty should increase through:

- removing explicit cell highlighting;
- copying in two dimensions with mixed anchors;
- coordinating ranges, criteria, and lookup return fields;
- separating stored value from display formatting;
- handling Blank versus `""` versus Error;
- moving between cell formula, filled region, table, and pivot representations;
- reconstructing a formula from observed copy behavior;
- diagnosing a plausible but wrong result;
- tracing dependencies across sheets;
- selecting an aggregation/lookup/pivot configuration from a question.

It must not increase through huge grids, deeply nested formulas, obscure function catalogs, volatile state, vendor quirks, mouse-precision tasks, long manual arithmetic, arbitrary business jargon, or visually hunting for one cell among hundreds.

### Shared family contract

Every family below includes:

- **Task** and trainable spreadsheet operation;
- **Response/template** with semantic placeholders;
- **Derivation** as normative evaluation/transformation;
- **Difficulty** through meaningful dimensions;
- **Misconceptions/constraints** and rejection rules;
- **Feedback** exposing reference/value/dependency reasoning;
- **Examples** with at least three instantiated cases;
- **Validation/coverage** naming independent checks and distributions.

All grid values, formulas, formatted displays, pivot results, errors, and feedback derive from one immutable workbook model. Reject instances with unsupported coercion, ambiguous locale syntax, circularity unless targeted, duplicate lookup ambiguity, multiple correct pivot configurations not accepted, or arithmetic dominating the spreadsheet skill.

## 2. Category: Grid, values, ranges, and workbook structure

### Category purpose

Build an exact mental model of the grid and distinguish addresses, values, displays, types, and rectangular data structure.

### Learn

A cell address names a location; a cell value is stored there; formatting controls appearance. `B3:D5` includes every cell in columns B–D and rows3–5. Blank is not zero and `""` is not Blank. Formulas begin with `=`.

### Prerequisites

Rows, columns, simple tables, and basic data types.

### Category boundaries

This category reads structure without copy transformations or complex formulas.

### Subcategories

1. Cell/range coordinates
2. Value versus display
3. Types and missingness
4. Sheet/name qualification
5. Table shape and headers

### Common misconceptions

- Reversing row and column.
- Excluding the final row/column of a range.
- Treating formatted percentages as stored whole percentages.
- Treating blank, zero, and empty string as identical.
- Omitting quotes around sheet names with spaces.
- Including a table header in a data aggregation unintentionally.

### Family `cell_address_locate`

**Task.** Locate/name a cell from row and column.

**Response/template.** A1 reference or selectable cell.

**Derivation.** Convert column letters and one-based row.

**Difficulty.** L1 A–Z; L2 AA–ZZ; L3 transposed visual headers; L4 infer row/column from formula context.

**Misconceptions/constraints.** No R1C1 notation. Grid remains small enough to navigate.

**Feedback.** Trace column then row.

**Examples.**

1. column C,row4 → C4. L1.
2. cell AB12 → column AB,row12. L2.
3. `D7` is not row D,column7. L1.

**Validation/coverage.** Column-number/A1 round trip.

### Family `range_cells_enumerate`

**Task.** Enumerate/count cells in a rectangular range.

**Response/template.** count or selectable set.

**Derivation.** Normalize corners; rows=`|r2−r1|+1`, columns likewise; product/count.

**Difficulty.** L1 single row/column; L2 rectangle; L3 reversed corners accepted profile; L4 missing cell identification.

**Misconceptions/constraints.** Endpoints inclusive. At most20 cells for enumeration.

**Feedback.** Shade rectangle and show dimensions.

**Examples.**

1. A1:A4 →4 cells. L1.
2. B2:D4 →3×3=9 cells. L2.
3. C3:C3 →one cell. L1.

**Validation/coverage.** Exact coordinate set.

### Family `range_value_extract`

**Task.** Return values/types in row-major order from a range.

**Response/template.** mini-grid/ordered array.

**Derivation.** Resolve inclusive cells left-to-right then top-to-bottom while preserving Blank/Error.

**Difficulty.** L1 one row; L2 rectangle; L3 cross-sheet; L4 formula results versus displayed literals.

**Misconceptions/constraints.** Do not skip blanks. Formula view/result view explicitly selected.

**Feedback.** Highlight cell-to-output mapping.

**Examples.**

1. A1:C1 values2,blank,5 → `[2,Blank,5]`. L1.
2. B2:C3 yields2×2 array in row-major layout. L2.
3. formula cell displays8 but formula-view request returns `=B1*2`. L3.

**Validation/coverage.** Grid slice exact types/dimensions.

### Family `stored_value_display_format`

**Task.** Distinguish stored numeric value from percentage/currency/date/rounded display.

**Response/template.** stored value and displayed value.

**Derivation.** Apply declared formatter without changing semantic scalar.

**Difficulty.** L1 percent; L2 decimal places; L3 date/text; L4 formula uses unrounded stored value.

**Misconceptions/constraints.** Formatting rules explicit. Dates avoid serials.

**Feedback.** Show value → format → display pipeline.

**Examples.**

1. stored0.25, percent format →25%. L1.
2. stored1.236, two decimals →1.24 while later arithmetic still uses1.236. L2.
3. currency display `$10.00` remains Number10, not Text. L2.

**Validation/coverage.** Formatter and type invariance.

### Family `blank_zero_empty_string`

**Task.** Classify cells and predict `COUNT`/`COUNTA` implications.

**Response/template.** Blank/Number0/Text"" plus count flags.

**Derivation.** Use typed cell state and normative count semantics.

**Difficulty.** L1 blank vs0; L2 `""`; L3 formula returning `""`; L4 range counts.

**Misconceptions/constraints.** Visual emptiness alone is insufficient; formula bar/type metadata available when targeted.

**Feedback.** Table of type, display, COUNT, COUNTA behavior.

**Examples.**

1. true Blank → COUNT no, COUNTA no. L1.
2. Number0 → COUNT yes, COUNTA yes. L1.
3. Text"" → COUNT no, COUNTA yes. L2.

**Validation/coverage.** Type predicates and count functions.

### Family `sheet_reference_syntax`

**Task.** Construct/parse a reference to another sheet.

**Response/template.** A1 formula fragment.

**Derivation.** Add sheet qualifier and quote/escape names with spaces/punctuation.

**Difficulty.** L1 simple name; L2 spaces; L3 apostrophe escaped by doubled apostrophe; L4 range/named sheet.

**Misconceptions/constraints.** Workbook-external syntax excluded.

**Feedback.** Separate sheet token from cell/range.

**Examples.**

1. Sheet2 cell B4 → `Sheet2!B4`. L1.
2. Sales 2025 cell C7 → `'Sales 2025'!C7`. L2.
3. sheet `Owner's` → `'Owner''s'!A1` under pinned syntax. L3.

**Validation/coverage.** Parser/formatter round trip.

### Family `named_range_resolve`

**Task.** Resolve/use a workbook- or sheet-scoped named range.

**Response/template.** target range/value or formula.

**Derivation.** Apply nearest scope and name table; evaluate referenced range.

**Difficulty.** L1 one workbook name; L2 formula use; L3 sheet-local shadows workbook name; L4 invalid/missing name.

**Misconceptions/constraints.** Scope displayed. Names cannot resemble cell addresses.

**Feedback.** Show name → scope → reference.

**Examples.**

1. `TaxRate=$B$2` resolves to B2. L1.
2. `=A5*TaxRate` uses named cell. L2.
3. local `Rate` on Sheet2 overrides workbook `Rate` there. L3.

**Validation/coverage.** Symbol-table resolution.

### Family `rectangular_table_validity`

**Task.** Decide whether a range forms a valid source table for sort/filter/pivot.

**Response/template.** valid/invalid plus first defect.

**Derivation.** Require one header row, unique nonblank field names, consistent rectangular records, no merged cells, and typed rows allowed.

**Difficulty.** L1 valid; L2 blank/duplicate header; L3 embedded subtotal/blank row; L4 multirow header repair.

**Misconceptions/constraints.** Blank field values are allowed; blank field names are not.

**Feedback.** Highlight structural defect and repair.

**Examples.**

1. unique headers Name,Region,Amount and records → valid. L1.
2. two columns both named Amount → invalid for pinned table model. L2.
3. title row above headers must be excluded from source range. L3.

**Validation/coverage.** Table-schema validator.

### Family `structured_reference_resolve`

**Task.** Interpret a bounded structured table reference.

**Response/template.** cell/range/value: `In table Sales, resolve {reference}.`

**Derivation.** `Sales[Amount]` selects data column; `[@Amount]` selects current row; headers/totals only when explicit tokens provided.

**Difficulty.** L1 column; L2 current row; L3 calculated column; L4 header versus data range.

**Misconceptions/constraints.** Pinned subset shown in Learn; vendor extensions excluded.

**Feedback.** Highlight table region and current row.

**Examples.**

1. `Sales[Amount]` → all data cells in Amount, excluding header. L1.
2. `[@Qty]` in row7 → Qty cell of current table row. L2.
3. `=SUM(Sales[Amount])` sums data column. L2.

**Validation/coverage.** Table-schema expansion to A1 ranges.

### Cross-family progression

Cell and range coordinates precede values. Stored/display and blank distinctions establish the typed model before function use. Sheet/name references extend location semantics. Table validity and structured references prepare later sort/filter, calculated-column, and pivot work.

## 3. Category: Relative, absolute, and mixed references

### Category purpose

Predict and construct formulas that copy correctly across rows and columns.

### Learn

`$` locks the coordinate immediately after it. When copying from B2 to D5, displacement is +2 columns,+3 rows:

```text
A1    -> C4
$A$1  -> $A$1
$A1   -> $A4
A$1   -> C$1
```

Apply the displacement to reference coordinates, not to the values currently stored there.

### Prerequisites

A1 addresses, ranges, sheets, and simple formulas.

### Category boundaries

This category grades reference transformation and copy-safe construction. Formula computation is secondary.

### Subcategories

1. Copy displacement
2. Absolute/mixed anchors
3. Ranges and cross-sheet references
4. Two-dimensional fills
5. Formula repair and inverse anchoring

### Common misconceptions

- Treating `$` as locking the whole reference regardless of placement.
- Moving an unlocked row when copying horizontally even though row displacement is zero.
- Changing values rather than addresses.
- Shifting only one range endpoint.
- Assuming a formula that works in one cell will fill correctly.

### Family `copy_relative_reference`

**Task.** Transform relative references under a copy displacement.

**Response/template.** resulting formula/reference.

**Derivation.** Add displacement to every unlocked row/column.

**Difficulty.** L1 one direction; L2 two dimensions; L3 multiple refs; L4 boundary `#REF!`.

**Misconceptions/constraints.** Source/destination explicit. No move semantics.

**Feedback.** Show `(Δcol,Δrow)` and each coordinate.

**Examples.**

1. copy `=A1` from B1 to B4 → `=A4`. L1.
2. copy `=B2+C3` from D4 to F7 → `=D5+E6`. L2.
3. copying A1 reference one column left from source that would reach before A → `#REF!`. L3.

**Validation/coverage.** Formula AST transformation and coordinate bounds.

### Family `copy_absolute_reference`

**Task.** Preserve fully absolute references while other parts move.

**Response/template.** resulting formula.

**Derivation.** `$col` and `$row` receive no displacement.

**Difficulty.** L1 single `$A$1`; L2 combined relative; L3 range; L4 cross-sheet.

**Misconceptions/constraints.** `$` is anchor syntax, not currency formatting.

**Feedback.** Mark locked coordinates.

**Examples.**

1. `=$B$2` copied anywhere remains `=$B$2`. L1.
2. `=A5*$B$2` copied down one → `=A6*$B$2`. L2.
3. `=SUM($A$1:$A$5)` remains fixed. L2.

**Validation/coverage.** Locked-coordinate invariance.

### Family `copy_mixed_reference`

**Task.** Transform `$A1` and `A$1` references.

**Response/template.** resulting formula/reference.

**Derivation.** Move only unlocked coordinate.

**Difficulty.** L1 one mixed ref; L2 both types; L3 multiple directions; L4 range endpoints mixed differently.

**Misconceptions/constraints.** Distractors lock wrong dimension.

**Feedback.** Two-column row/column lock table.

**Examples.**

1. `$A1` copied down3/right2 → `$A4`. L1.
2. `A$1` same displacement → `C$1`. L1.
3. `=$A2*B$1` from B2 to D5 → `=$A5*D$1`. L3.

**Validation/coverage.** Independent row/column anchor truth table.

### Family `copy_range_reference`

**Task.** Transform inclusive range endpoints during copy.

**Response/template.** resulting formula/range.

**Derivation.** Apply displacement/locks independently to each endpoint.

**Difficulty.** L1 relative range; L2 absolute; L3 mixed anchors; L4 multiple ranges.

**Misconceptions/constraints.** Preserve range shape for same-anchor patterns; reject invalid endpoints unless error target.

**Feedback.** Transform start and end separately.

**Examples.**

1. `=SUM(A1:A3)` copied one row down → `=SUM(A2:A4)`. L1.
2. `$A$1:B3` copied right1 → `$A$1:C3`. L2.
3. `A$1:$C5` copied down2/right1 → `B$1:$C7`. L3.

**Validation/coverage.** Endpoint AST transformation.

### Family `copy_cross_sheet_reference`

**Task.** Copy formulas containing sheet-qualified references.

**Response/template.** resulting formula.

**Derivation.** Keep sheet qualifier; transform its A1 row/column by locks/displacement.

**Difficulty.** L1 absolute external sheet; L2 relative; L3 quoted sheet/range; L4 local+cross-sheet mix.

**Misconceptions/constraints.** Copying formula between sheets does not retarget explicit sheet name.

**Feedback.** Separate qualifier and coordinate anchors.

**Examples.**

1. `=Rates!$B$2` stays fixed. L1.
2. `=Data!A2` copied down → `=Data!A3`. L2.
3. copying to another sheet still references explicit `Data!`. L3.

**Validation/coverage.** Sheet token invariance plus coordinate transform.

### Family `fill_two_dimensional_table`

**Task.** Predict formulas across a multiplication/rate table using mixed anchors.

**Response/template.** fill selected cells or entire small grid.

**Derivation.** Apply source-to-each-target displacement independently.

**Difficulty.** L1 one row/column; L2 2D with `$A2*B$1`; L3 extra fixed parameter; L4 locate inconsistent cell.

**Misconceptions/constraints.** Maximum4×4 output. Headers clearly outside formula region.

**Feedback.** Show how row header and column header anchors differ.

**Examples.**

1. B2 `=$A2*B$1`; at D4 → `=$A4*D$1`. L2.
2. fill down keeps column A; fill right keeps row1. L2.
3. `$A$2*B$1` incorrectly fixes all rows to A2. L3.

**Validation/coverage.** Per-target transformation and evaluated table.

### Family `choose_anchors_for_fill`

**Task.** Construct a formula at the seed cell that copies to satisfy a declared grid.

**Response/template.** formula input.

**Derivation.** Infer which semantic inputs vary by output row/column and anchor complementary coordinates.

**Difficulty.** L1 fixed tax rate down column; L2 2D table; L3 cross-sheet constant; L4 several candidate formulas same seed value.

**Misconceptions/constraints.** Grade copy behavior across entire test region, not seed value alone.

**Feedback.** Counterexample destination for wrong anchor.

**Examples.**

1. row amount in A2 times fixed B1, fill down in C → `=A2*$B$1`. L1.
2. 2D table row header A2 and column header B1 → `=$A2*B$1`. L2.
3. `=A2*B1` may work at seed but drifts both inputs. L2.

**Validation/coverage.** Evaluate candidate over hidden fill test set.

### Family `infer_source_formula_from_copy`

**Task.** Reconstruct possible source formula from copied destination and displacement.

**Response/template.** source formula/reference or anchor choice.

**Derivation.** Reverse displacement on unlocked coordinates; use observed invariant coordinates to infer locks when enough copies shown.

**Difficulty.** L1 known anchor types; L2 infer from two copies; L3 nonunique answer; L4 identify insufficiency.

**Misconceptions/constraints.** If several anchors fit observations, correct answer is set/insufficient, not arbitrary.

**Feedback.** Reverse-transform and show ambiguity.

**Examples.**

1. one-row copy result `=A3` from `=A2`. L1.
2. formulas down remain `$B$1` → compatible with full absolute anchor. L2.
3. horizontal copies cannot reveal whether row was locked, since Δrow=0. L3.

**Validation/coverage.** Enumerate anchor patterns consistent with observations.

### Family `repair_copied_formula`

**Task.** Find and repair one formula in a filled region that breaks the intended pattern.

**Response/template.** target cell and corrected formula.

**Derivation.** Derive expected formula from seed/canonical neighbor using displacement; compare ASTs.

**Difficulty.** L1 one shifted row; L2 wrong `$`; L3 overwritten constant; L4 several plausible results but one structural mismatch.

**Misconceptions/constraints.** Exactly one primary mutation. Formatting differences ignored.

**Feedback.** Show expected versus actual reference transformation.

**Examples.**

1. C3 should be `=A3*$B$1` but is `=A3*B2` → fix anchor. L2.
2. one cell contains literal120 amid formulas → overwritten formula. L2.
3. displayed values coincidentally equal; structural audit still finds drift. L3.

**Validation/coverage.** Mutation provenance and normalized formula pattern.

### Family `structural_insert_delete_reference`

**Task.** Predict references after inserting/deleting rows/columns under the pinned structural-edit rule.

**Response/template.** resulting formula/error.

**Derivation.** References to moved cells follow them; deleted referenced cells become `#REF!`; expanding range behavior follows explicit boundary rule.

**Difficulty.** L1 insert above; L2 delete referenced row; L3 range boundary; L4 distinguish copy from structural edit.

**Misconceptions/constraints.** Rule printed because vendors/options differ. No tables in same instance.

**Feedback.** Animate old cells to new addresses and retarget references.

**Examples.**

1. insert row above referenced A3; cell moves to A4 and reference follows A4. L1.
2. delete the only referenced cell row → `#REF!`. L2.
3. copy changes relative address by displacement; insert follows moved target—different operation. L3.

**Validation/coverage.** Grid-edit mapping and formula retargeting.

### Cross-family progression

Relative and absolute transformations precede mixed anchors and ranges. Cross-sheet formulas reuse the same coordinate rules. Two-dimensional fills come only after mixed anchors, followed by constructive and inverse tasks. Repair detects structural correctness even when current values hide the error. Insert/delete remains an explicitly separate advanced operation.

## 4. Category: Formula evaluation, logic, formatting, and errors

### Category purpose

Evaluate supported scalar formulas from typed cell values and distinguish computation from display.

### Learn

Read formulas from innermost parentheses/functions outward, respect operator precedence, and propagate typed errors. A formula result may be formatted as currency/percent/date without changing its stored value. Conditions are Boolean; avoid relying on hidden coercion.

### Prerequisites

Cell/range resolution, types, references, arithmetic, and comparisons.

### Category boundaries

This category focuses on scalar formulas. Aggregations, lookups, text/date, and arrays have dedicated categories.

### Subcategories

1. Arithmetic and precedence
2. Comparisons and Boolean logic
3. Conditional branching
4. Rounding and display
5. Error propagation/handling

### Common misconceptions

- Calculating left-to-right without precedence.
- Comparing displayed rounded values instead of stored values.
- Confusing `=` formula prefix with equality comparison.
- Treating text `"0"` as Number0.
- Evaluating both IF branches and propagating an unselected error.
- Using formatting as rounding.

### Family `arithmetic_formula_evaluate`

**Task.** Evaluate a scalar arithmetic formula with references.

**Response/template.** number/error.

**Derivation.** Resolve references, apply precedence and exact arithmetic.

**Difficulty.** L1 one operation; L2 precedence; L3 exponent/parentheses; L4 cross-sheet cells.

**Misconceptions/constraints.** Avoid ambiguous unary exponent syntax.

**Feedback.** Substitute values then AST order.

**Examples.**

1. A1=4,B1=3; `=A1+B1*2` →10. L1.
2. `=(4+3)*2` →14. L2.
3. `=2^3^2` →512 under right association. L3.

**Validation/coverage.** Independent AST and rational evaluator.

### Family `percent_formula_evaluate`

**Task.** Evaluate percentage arithmetic and separate stored decimal from display.

**Response/template.** stored number/percent display.

**Derivation.** Percent literal `p%` is exact `p/100`; evaluate before formatting.

**Difficulty.** L1 percent of value; L2 rate cell; L3 percentage change; L4 double-percent mistake.

**Misconceptions/constraints.** Percent literal grammar explicitly supported. No locale ambiguity.

**Feedback.** Convert percent to factor.

**Examples.**

1. `=200*15%` →30. L1.
2. A1=200,B1 stored0.15 → `=A1*B1`=30. L2.
3. B1 displayed15% should not be divided by100 again. L2.

**Validation/coverage.** Exact percent literal/value.

### Family `comparison_formula`

**Task.** Evaluate numeric/text/date comparisons.

**Response/template.** TRUE/FALSE/Error.

**Derivation.** Resolve same-type operands and comparison operator.

**Difficulty.** L1 numeric; L2 text equality; L3 dates; L4 displayed-versus-stored boundary.

**Misconceptions/constraints.** No cross-type comparisons. Text equality case-insensitive.

**Feedback.** Show operand types and exact stored values.

**Examples.**

1. A1=5; `=A1>=4` →TRUE. L1.
2. `="North"="north"` →TRUE under profile. L2.
3. stored1.004 displayed1.00; comparison `>1` is TRUE. L3.

**Validation/coverage.** Typed comparator.

### Family `boolean_logic_formula`

**Task.** Evaluate `AND`, `OR`, and `NOT`.

**Response/template.** TRUE/FALSE.

**Derivation.** Evaluate Boolean arguments according to truth tables.

**Difficulty.** L1 two conditions; L2 nested NOT; L3 combined comparisons; L4 diagnose wrong connective.

**Misconceptions/constraints.** Arguments are Boolean; no numeric truthiness.

**Feedback.** List condition results before connective.

**Examples.**

1. `=AND(TRUE,FALSE)` →FALSE. L1.
2. `=OR(A1>10,B1="Yes")` with false,true →TRUE. L2.
3. `=NOT(AND(TRUE,TRUE))` →FALSE. L2.

**Validation/coverage.** Boolean AST truth table.

### Family `if_formula_branch`

**Task.** Evaluate/write a scalar `IF`.

**Response/template.** result or formula.

**Derivation.** Evaluate condition, then only selected branch.

**Difficulty.** L1 literal outputs; L2 cell computations; L3 nested IF/IFS; L4 boundary operator.

**Misconceptions/constraints.** Conditions uniquely define categories. At most3 branches.

**Feedback.** Show condition result and chosen branch.

**Examples.**

1. A1=8; `=IF(A1>=5,"Pass","Retry")` →Pass. L1.
2. A1=5 with `>` rather than `>=` →false branch. L2.
3. unselected branch `1/0` does not error under pinned lazy scalar IF. L3.

**Validation/coverage.** Branch trace and boundary cases.

### Family `ifs_band_classify`

**Task.** Evaluate/construct ordered multi-condition classification.

**Response/template.** label/formula.

**Derivation.** Test conditions in order; return first TRUE result.

**Difficulty.** L1 descending thresholds; L2 gaps/overlap audit; L3 boundary; L4 repair order.

**Misconceptions/constraints.** A final TRUE default required when coverage intended.

**Feedback.** Show condition sequence and first match.

**Examples.**

1. score92 with thresholds≥90 A,≥80 B →A. L1.
2. score85 returns B after first false/second true. L2.
3. testing `>=60` before `>=90` misclassifies95; reorder high to low. L3.

**Validation/coverage.** Decision-list evaluator and domain coverage.

### Family `round_function_result`

**Task.** Evaluate `ROUND`, `ROUNDUP`, or `ROUNDDOWN`.

**Response/template.** number.

**Derivation.** Apply declared decimal place and direction to exact value.

**Difficulty.** L1 positive decimals; L2 negative `n` tens/hundreds; L3 negative values; L4 compare formatting.

**Misconceptions/constraints.** Round-half-away-from-zero pinned.

**Feedback.** Identify target digit and discarded part.

**Examples.**

1. `=ROUND(2.345,2)` →2.35. L1.
2. `=ROUND(126,-1)` →130. L2.
3. displaying1.24 does not make stored1.236 equal `ROUND(1.236,2)` until formula rounds it. L3.

**Validation/coverage.** Exact decimal rounding.

### Family `error_origin_propagation`

**Task.** Identify the first error and predict propagation through dependent formula.

**Response/template.** error code/source cell.

**Derivation.** Evaluate dependency AST; arithmetic propagates first deterministic argument error under declared order.

**Difficulty.** L1 divide zero; L2 invalid ref/text; L3 chain; L4 several errors with first causal source.

**Misconceptions/constraints.** Evaluation order and source graph explicit.

**Feedback.** Trace dependency path.

**Examples.**

1. `=5/0` →`#DIV/0!`. L1.
2. `=A1+2` with A1=`#REF!` →`#REF!`. L2.
3. displayed downstream errors may share one upstream cause. L3.

**Validation/coverage.** Typed error evaluator and provenance.

### Family `iferror_formula`

**Task.** Evaluate/write `IFERROR` and judge when fallback hides useful defects.

**Response/template.** result/formula/diagnosis.

**Derivation.** Evaluate first argument; on Error return fallback.

**Difficulty.** L1 fallback; L2 no error; L3 lookup fallback; L4 audit overly broad handling.

**Misconceptions/constraints.** Feedback distinguishes user-facing absence from hidden formula defect.

**Feedback.** Show underlying result then interception.

**Examples.**

1. `=IFERROR(5/0,0)` →0. L1.
2. `=IFERROR(5/2,0)` →2.5. L1.
3. replacing every error with0 can conceal a broken reference, so repair may target source instead. L3.

**Validation/coverage.** Error/nonerror branch fixtures.

### Family `formula_vs_display_audit`

**Task.** Decide why displayed values appear equal/different despite stored formula results.

**Response/template.** stored values, displays, comparison verdict.

**Derivation.** Evaluate formulas exactly, then formats separately.

**Difficulty.** L1 decimal rounding; L2 percentages; L3 conditional formatting; L4 sum of displayed versus stored.

**Misconceptions/constraints.** Formatting never changes value. Conditional formatting is visual only.

**Feedback.** Two-layer stored/display table.

**Examples.**

1. stored values1.231 and1.234 both display1.23 at two decimal places, but the stored values differ. L1.
2. cells display10% but stored .096 and .104; exact comparison differs. L2.
3. sum uses stored values, so may differ from sum of individually displayed rounded numbers. L3.

**Validation/coverage.** Formula evaluator then formatter; examples prevalidated.

### Cross-family progression

Arithmetic and percentages establish scalar evaluation. Comparisons feed Boolean logic, then IF/IFS. Rounding follows exact values and is contrasted with display formatting. Error propagation precedes IFERROR so learners repair causes rather than reflexively hide them.

## 5. Category: Aggregation and conditional calculation

### Category purpose

Select and evaluate range aggregations while preserving numeric types, criteria, shapes, and denominator logic.

### Learn

Aggregation summarizes a range. `SUM` adds numeric cells; `AVERAGE` divides numeric sum by numeric count; `COUNT` counts numbers; `COUNTA` counts nonblank values. Conditional functions filter rows/cells by criteria before aggregating. Multiple `IFS` criteria are ANDed.

### Prerequisites

Ranges, types, comparisons, Boolean conditions, and exact arithmetic.

### Category boundaries

This category computes from ranges. Pivot tables later perform the same ideas through a field configuration.

### Subcategories

1. Core aggregation
2. Count/type distinctions
3. Conditional single criteria
4. Multiple criteria
5. Aggregation auditing

### Common misconceptions

- Dividing average by all cells including blanks/text.
- Confusing COUNT and COUNTA.
- Including header/total rows.
- Applying criterion to sum range rather than criteria range.
- OR-ing multiple `SUMIFS` criteria that are actually AND.
- Using mismatched range shapes.

### Family `sum_range_evaluate`

**Task.** Evaluate/write `SUM` over one or more ranges/scalars.

**Response/template.** number/formula.

**Derivation.** Enumerate numeric values, ignore permitted nonnumeric cells, sum exactly.

**Difficulty.** L1 contiguous numeric; L2 blanks/text; L3 multiple arguments; L4 avoid total-row double count.

**Misconceptions/constraints.** At most12 data cells.

**Feedback.** Highlight included numbers.

**Examples.**

1. 2,3,5 →`=SUM(A1:A3)`=10. L1.
2. 2,Blank,"x",4 →sum6. L2.
3. summing data plus its displayed subtotal double-counts. L3.

**Validation/coverage.** Exact fold over typed values.

### Family `average_range_evaluate`

**Task.** Evaluate/write `AVERAGE`.

**Response/template.** number/error/formula.

**Derivation.** Numeric sum divided by numeric count.

**Difficulty.** L1 all numeric; L2 blanks/text/zero; L3 weighted-average distractor; L4 no numeric cells.

**Misconceptions/constraints.** Zero counts as numeric; blank does not.

**Feedback.** Show numerator and numeric count.

**Examples.**

1. 2,4,6 →4. L1.
2. 2,Blank,0,4 →2 because three numeric cells sum6. L2.
3. no numeric values →`#DIV/0!`. L3.

**Validation/coverage.** Sum/count identity.

### Family `min_max_range`

**Task.** Find/evaluate `MIN` or `MAX` with typed cells.

**Response/template.** number/formula.

**Derivation.** Select extreme among numeric cells.

**Difficulty.** L1 positive; L2 negatives/zero; L3 blanks/text; L4 missing extreme after filter.

**Misconceptions/constraints.** Nonempty numeric set by default.

**Feedback.** List included candidates in order.

**Examples.**

1. 3,8,5 →MAX8. L1.
2. −4,0,−2 →MIN−4. L2.
3. text `"100"` ignored in numeric range profile. L3.

**Validation/coverage.** Numeric-type filter and order.

### Family `count_counta_compare`

**Task.** Compute and contrast `COUNT` and `COUNTA`.

**Response/template.** two integer fields.

**Derivation.** Apply normative numeric/nonblank predicates.

**Difficulty.** L1 numbers/text; L2 blank/`""`; L3 errors/Booleans; L4 infer cell types from counts.

**Misconceptions/constraints.** Dates count in both `COUNT` and `COUNTA` under the pinned profile; Boolean/Error count only in `COUNTA`.

**Feedback.** Per-cell contribution table.

**Examples.**

1. [1,"x",Blank] →COUNT1,COUNTA2. L1.
2. [0,"",Blank] →COUNT1,COUNTA2. L2.
3. [Date2025-01-01,TRUE,#N/A] →COUNT1,COUNTA3. L3.

**Validation/coverage.** Typed count predicates.

### Family `sumif_single_criterion`

**Task.** Evaluate/write `SUMIF`.

**Response/template.** number/formula.

**Derivation.** Test each criteria-range cell; sum aligned numeric sum-range cell for matches.

**Difficulty.** L1 exact text; L2 numeric comparison; L3 wildcard; L4 omitted sum_range uses criteria range.

**Misconceptions/constraints.** Ranges same shape and alignment visible.

**Feedback.** Row match flags and included values.

**Examples.**

1. regions N,S,N and amounts5,7,4; criterion"N" →9. L1.
2. values2,5,8 with criterion">=5" →13. L2.
3. criterion `"A*"` matches text beginning A. L3.

**Validation/coverage.** Criteria parser and row-wise oracle.

### Family `countif_averageif`

**Task.** Evaluate/write `COUNTIF` or `AVERAGEIF`.

**Response/template.** count/average/formula.

**Derivation.** Match criterion; count matches or average aligned numeric values.

**Difficulty.** L1 count exact; L2 average; L3 blank/empty criteria; L4 no numeric matched values.

**Misconceptions/constraints.** Average denominator is matched numeric cells, not all matches with nonnumeric outputs.

**Feedback.** Match set then aggregation.

**Examples.**

1. statuses Open,Closed,Open →COUNTIF Open=2. L1.
2. groups A,B,A; scores10,20,30 →AVERAGEIF A=20. L2.
3. matched output Blank is excluded from average denominator. L3.

**Validation/coverage.** Filtered count/sum/count.

### Family `sumifs_multiple_criteria`

**Task.** Evaluate/write `SUMIFS` with AND criteria.

**Response/template.** number/formula.

**Derivation.** Align rows, require all predicates, sum matching numeric measure.

**Difficulty.** L1 two equality criteria; L2 inequality+text; L3 dates; L4 same field bounded interval.

**Misconceptions/constraints.** All ranges identical shape. Criteria order in formula semantically irrelevant by pairs.

**Feedback.** Truth table per row.

**Examples.**

1. Region=N AND Product=A →sum selected amounts. L1.
2. Amount criterion `>=10` and status Open. L2.
3. date between bounds uses two criteria on same date range. L3.

**Validation/coverage.** Predicate conjunction and exact sum.

### Family `countifs_averageifs`

**Task.** Evaluate/write multi-criteria count/average.

**Response/template.** integer/number/formula.

**Derivation.** Conjunct predicates; count rows or average aligned numeric values.

**Difficulty.** L1 two criteria; L2 numeric average; L3 exclusion/`<>`; L4 no matches.

**Misconceptions/constraints.** Average no numeric matches →`#DIV/0!`.

**Feedback.** Filtered row table and denominator.

**Examples.**

1. count Region=N,Status=Open. L1.
2. average score for Group=A and score `>0`. L2.
3. no matching numeric rows →`#DIV/0!` for AVERAGEIFS. L3.

**Validation/coverage.** Shared filter engine and aggregation.

### Family `aggregation_range_repair`

**Task.** Detect/repair off-by-one, header, total-row, or mismatched aggregation ranges.

**Response/template.** corrected formula and defect.

**Derivation.** Compare formula range with semantic table data region and aligned fields.

**Difficulty.** L1 missing last row; L2 includes total/header; L3 misaligned criteria; L4 copied range drift.

**Misconceptions/constraints.** Exactly one primary defect. Current values may hide it.

**Feedback.** Highlight intended versus actual cells.

**Examples.**

1. data A2:A10 but formula `SUM(A2:A9)` omits last row. L1.
2. `SUM(A2:A11)` where A11 is subtotal double-counts. L2.
3. SUMIFS sum rows2:10 but criteria rows3:11 →shape aligns yet records misalign; repair. L3.

**Validation/coverage.** Semantic field-row alignment.

### Family `subtotal_filtered_rows`

**Task.** Predict a pinned `SUBTOTAL`-style aggregation over filtered/hidden rows.

**Response/template.** number and included-row set.

**Derivation.** Apply declared function code/profile: filtered rows excluded; manually hidden rows included/excluded as explicitly specified.

**Difficulty.** L1 filtered only; L2 hidden policy; L3 nested subtotal ignored; L4 compare ordinary SUM.

**Misconceptions/constraints.** Because vendor function codes vary in recall burden, prompt displays meaning/profile rather than testing code numbers in v1.

**Feedback.** Mark visible/included rows.

**Examples.**

1. visible values2,5 with filtered7 →subtotal7. L1.
2. ordinary SUM includes filtered7 →14. L2.
3. nested subtotal row is excluded under displayed profile to avoid double count. L3.

**Validation/coverage.** Visibility-aware aggregation engine.

### Cross-family progression

SUM/AVERAGE/MIN/MAX establish typed aggregation; COUNT/COUNTA reinforces missingness. Single-criterion functions precede multi-criteria AND logic. Repair questions check range alignment. Filter-aware subtotal is delayed until ordinary range aggregation is stable.

## 6. Category: Lookups, text, and dates

### Category purpose

Retrieve aligned records and transform common text/date fields without relying on ambiguous coercion or hidden sort assumptions.

### Learn

A lookup needs a key range, a return range, and a match rule. Exact match finds the first equal key. Approximate-next-smaller finds the greatest key not exceeding the target; legacy approximate `VLOOKUP` requires a sorted first column, while the pinned `XLOOKUP` rule does not. `INDEX` returns a position; `MATCH` finds a position.

Text functions operate on Unicode code points in this simplified profile. Dates are typed calendar values built/read through date functions, not locale-parsed text or visible serials.

### Prerequisites

Ranges, types, errors, comparisons, and formula construction.

### Category boundaries

This category handles one-table lookups and bounded transformations. Database joins, fuzzy matching, regex, timezone arithmetic, and general parsing are excluded.

### Subcategories

1. Exact and approximate lookups
2. INDEX/MATCH composition
3. Lookup diagnosis
4. Text extraction/assembly
5. Date construction/components
6. Date intervals and criteria

### Common misconceptions

- Omitting exact-match mode and accidentally accepting an approximate row.
- Returning from the wrong column.
- Assuming legacy approximate `VLOOKUP` works on unsorted keys.
- Treating duplicate keys as all matches rather than first match.
- Counting bytes rather than characters.
- Treating formatted date text as a typed Date.

### Family `xlookup_exact`

**Task.** Evaluate/write an exact `XLOOKUP`.

**Response/template.** value/error/formula.

**Derivation.** Scan lookup range in order; return aligned first exact match; use supplied not-found fallback or `#N/A`.

**Difficulty.** L1 unique numeric key; L2 text; L3 duplicate-first behavior; L4 not found/fallback.

**Misconceptions/constraints.** Lookup/return ranges same length. Exact mode0 explicit.

**Feedback.** Highlight matching source row and aligned return cell.

**Examples.**

1. IDs 10,20,30; key20 returns aligned name B. L1.
2. `North` matches `north` under case-insensitive profile. L2.
3. no key → declared `"Missing"` fallback, otherwise `#N/A`. L2.

**Validation/coverage.** Ordered exact-match oracle.

### Family `lookup_approximate_band`

**Task.** Evaluate an approximate-next-smaller lookup such as a rate/grade band.

**Response/template.** matched key/returned label.

**Derivation.** From sorted ascending thresholds, choose greatest threshold `≤key`.

**Difficulty.** L1 exact threshold; L2 between; L3 below minimum; L4 boundary/negative thresholds.

**Misconceptions/constraints.** Unique sorted keys; below-min returns `#N/A` unless fallback.

**Feedback.** Bracket target between thresholds.

**Examples.**

1. thresholds0,60,80,90; score85 → threshold80 label B. L1.
2. score90 → exact threshold90. L2.
3. score−1 below minimum0 →`#N/A`. L3.

**Validation/coverage.** Binary/linear lookup cross-check and order precondition.

### Family `vlookup_column_index`

**Task.** Evaluate/write bounded `VLOOKUP` and choose correct return-column index.

**Response/template.** value/formula/index.

**Derivation.** Match in first table column; count columns one-based to return index.

**Difficulty.** L1 two columns exact; L2 wider table; L3 approximate; L4 key not leftmost → reject/choose different method.

**Misconceptions/constraints.** Fourth argument always explicit. At most6 columns.

**Feedback.** Number columns from table's first column.

**Examples.**

1. table A:D, return D →index4. L1.
2. exact `=VLOOKUP(key,A2:D8,3,FALSE)` returns column C. L2.
3. desired key is in C and return is A → VLOOKUP profile cannot look left; use XLOOKUP/INDEX-MATCH. L3.

**Validation/coverage.** Table coordinate and match oracle.

### Family `index_match_exact`

**Task.** Compose/evaluate `INDEX` with exact `MATCH`.

**Response/template.** position/value/formula.

**Derivation.** `MATCH` yields one-based row position; `INDEX` retrieves aligned item.

**Difficulty.** L1 MATCH alone; L2 composition; L3 horizontal/2D INDEX; L4 wrong range alignment.

**Misconceptions/constraints.** Equal alignment/length for common one-dimensional variant.

**Feedback.** Find position, then use position in return range.

**Examples.**

1. MATCH C in[A,B,C] →3. L1.
2. INDEX values[5,8,9] at MATCH B=2 →8. L2.
3. INDEX table row2,column3 returns cell at relative position, not sheet row2/C globally. L3.

**Validation/coverage.** Position and retrieval round trip.

### Family `lookup_formula_audit`

**Task.** Diagnose wrong match mode, sort order, range anchoring, duplicate key, or return alignment.

**Response/template.** defect and repaired formula/data rule.

**Derivation.** Compare formula configuration to lookup intent and source invariants.

**Difficulty.** L1 wrong column; L2 approximate unsorted; L3 copied ranges drift; L4 duplicate ambiguity.

**Misconceptions/constraints.** Exactly one primary defect. Expected uniqueness stated.

**Feedback.** Show counterexample key.

**Examples.**

1. approximate VLOOKUP on unsorted thresholds → invalid; sort or exact mode. L2.
2. return range starts one row below lookup range → misaligned result. L2.
3. lookup ranges copied down without `$` drift from source table. L3.

**Validation/coverage.** Mutation tests against hidden key set.

### Family `text_extract`

**Task.** Evaluate/write `LEFT`, `RIGHT`, or `MID`.

**Response/template.** text/formula.

**Derivation.** Use one-based character positions; preserve spaces; `MID(text,start,count)`.

**Difficulty.** L1 ASCII; L2 spaces/punctuation; L3 Unicode code points; L4 out-of-range/empty result.

**Misconceptions/constraints.** No grapheme/byte edge cases beyond declared code-point profile.

**Feedback.** Number characters.

**Examples.**

1. `LEFT("ABCDE",2)` →`AB`. L1.
2. `RIGHT("AB-123",3)` →`123`. L2.
3. `MID("ABCDE",2,3)` →`BCD`. L2.

**Validation/coverage.** Unicode-safe slice oracle.

### Family `concat_textjoin`

**Task.** Build/evaluate text using `&`, `CONCAT`, or `TEXTJOIN`.

**Response/template.** text/formula.

**Derivation.** Format scalar operands invariantly; concatenate in argument/range order; TEXTJOIN uses delimiter and explicit ignore-empty rule.

**Difficulty.** L1 two texts; L2 separators; L3 blanks versus `""`; L4 numeric/date formatting caveat.

**Misconceptions/constraints.** If presentation-specific formatting is needed, input is already Text; `TEXT` function excluded v1.

**Feedback.** Show pieces including literal separators.

**Examples.**

1. `"A"&"-"&"B"` →`A-B`. L1.
2. TEXTJOIN `", "`, ignore empty TRUE over[A,Blank,C] →`A, C`. L2.
3. missing separator yields `North2025`, not `North 2025`. L2.

**Validation/coverage.** Ordered string assembly and empty policy.

### Family `len_trim_clean_text`

**Task.** Evaluate `LEN`/`TRIM` and diagnose visually similar text mismatches.

**Response/template.** length/cleaned text.

**Derivation.** `LEN` counts code points; `TRIM` removes leading/trailing ASCII spaces and collapses repeated internal ASCII spaces to one under profile.

**Difficulty.** L1 length; L2 leading/trailing; L3 repeated internal; L4 nonbreaking-space explicitly not removed.

**Misconceptions/constraints.** `CLEAN` excluded; whitespace set pinned.

**Feedback.** Render visible space markers.

**Examples.**

1. LEN `"ABC"` →3. L1.
2. TRIM `"  A   B "` →`"A B"`. L2.
3. visually hidden nonbreaking space remains under ASCII-TRIM profile. L3.

**Validation/coverage.** Code-point and whitespace transform.

### Family `date_construct_parts`

**Task.** Build a Date with `DATE` or extract `YEAR`/`MONTH`/`DAY`.

**Response/template.** Date/integer/formula.

**Derivation.** Validate Gregorian components; extraction returns semantic fields.

**Difficulty.** L1 extract; L2 construct; L3 leap day; L4 invalid date error.

**Misconceptions/constraints.** DATE arguments are year,month,day; no vendor overflow normalization in v1.

**Feedback.** Show typed date components.

**Examples.**

1. YEAR(2025-07-14) →2025. L1.
2. `DATE(2024,2,29)` →2024-02-29. L2.
3. `DATE(2025,2,29)` →`#VALUE!` under strict profile. L3.

**Validation/coverage.** Gregorian date library and leap rules.

### Family `date_interval_criteria`

**Task.** Compute declared elapsed days/month buckets or write date-range criteria.

**Response/template.** integer/formula.

**Derivation.** Day difference uses exact dates; month grouping uses YEAR/MONTH keys; conditional range uses `>=start` and `<next_period`.

**Difficulty.** L1 days; L2 month filter; L3 year boundary; L4 inclusive/exclusive end.

**Misconceptions/constraints.** No ambiguous “months between” without formula definition.

**Feedback.** Timeline with interval endpoints.

**Examples.**

1. 2025-01-01 to2025-01-11 →10 elapsed days. L1.
2. January filter: date `>=2025-01-01` and `<2025-02-01`. L2.
3. using `<=2025-01-31` can be safe for Date-only values here, but next-period exclusive generalizes more clearly. L3.

**Validation/coverage.** Date arithmetic and criteria selection.

### Cross-family progression

Exact lookup precedes approximate bands and VLOOKUP column indexing. INDEX/MATCH exposes position/retrieval separately. Lookup audit then tests hidden assumptions. Text extraction precedes assembly/cleanup. Typed date construction precedes interval criteria, avoiding locale text/serial traps.

## 7. Category: Tables, sorting, filtering, validation, and dynamic arrays

### Category purpose

Transform record tables predictably while preserving row integrity and understanding formula spill results.

### Learn

Sort moves complete records, not isolated cells. Multi-key sorting applies the second key only within ties of the first. Filtering hides/excludes rows without deleting them. Deduplication needs an explicit key. Table calculated columns fill one row-relative formula. Dynamic-array formulas return a rectangular result that spills into neighboring cells only when space is clear.

### Prerequisites

Valid tables, structured references, comparisons, formulas, and missingness.

### Category boundaries

This category manipulates one local table. Relational joins and database updates belong in SQL. Vendor UI gestures are excluded.

### Subcategories

1. Sorting and row integrity
2. Filtering and deduplication
3. Calculated columns/expansion
4. Validation
5. Dynamic arrays and spills

### Common misconceptions

- Sorting one column without its records.
- Reversing secondary sort priority.
- Treating filtered-out rows as deleted.
- Deduplicating by entire row when business key differs.
- Writing different formulas manually in a calculated column.
- Overwriting cells inside a spill range.

### Family `sort_single_key`

**Task.** Predict table row order after sorting one field.

**Response/template.** ordered record IDs.

**Derivation.** Stable sort by typed key/direction; Blank placement explicitly pinned last.

**Difficulty.** L1 numeric ascending; L2 text/date; L3 descending/blank; L4 ties preserve source order.

**Misconceptions/constraints.** Entire rows move. Stable tie rule displayed.

**Feedback.** Show keys beside IDs before/after.

**Examples.**

1. values3,1,2 → IDs reorder by1,2,3. L1.
2. descending dates latest first. L2.
3. equal keys retain original order under stable profile. L3.

**Validation/coverage.** Typed stable-sort oracle.

### Family `sort_multi_key`

**Task.** Predict/configure primary and secondary sort.

**Response/template.** ordered IDs or key sequence.

**Derivation.** Compare primary; only ties use secondary, then stable source order.

**Difficulty.** L1 two fields same direction; L2 mixed directions; L3 three keys; L4 infer keys from output.

**Misconceptions/constraints.** At most8 rows/3 keys.

**Feedback.** Group by primary then sort within groups.

**Examples.**

1. Region ascending, Amount descending. L1.
2. secondary Name order does not move rows across Region groups. L2.
3. infer that repeated primary groups were sorted by Date newest first. L3.

**Validation/coverage.** Comparator chain and inverse candidate testing.

### Family `filter_rows_result`

**Task.** Select visible rows after one or more filters.

**Response/template.** record-ID set/order.

**Derivation.** Evaluate row predicates; preserve source order unless sort also declared.

**Difficulty.** L1 equality; L2 numeric interval; L3 AND/OR filter UI explicitly defined; L4 blank/error.

**Misconceptions/constraints.** Filtered rows remain in source. Predicate logic shown.

**Feedback.** Row truth table.

**Examples.**

1. Region=N retains matching IDs. L1.
2. Amount≥10 AND Status=Open. L2.
3. clearing filter restores rows without undoing data. L2.

**Validation/coverage.** Shared criteria predicate engine.

### Family `deduplicate_by_key`

**Task.** Determine retained/removed records under a declared deduplication key/order.

**Response/template.** retained IDs and duplicate groups.

**Derivation.** Form key tuple; retain first/last as stated.

**Difficulty.** L1 one field; L2 composite key; L3 keep latest after sort; L4 distinguish identical rows from key duplicates.

**Misconceptions/constraints.** Policy explicit. No probabilistic/fuzzy entity matching.

**Feedback.** Group records by key and mark survivor.

**Examples.**

1. IDs A,A,B keep first → first A and B. L1.
2. key `(Customer,Date)` treats same customer different dates as distinct. L2.
3. sort newest then keep first retains latest record. L3.

**Validation/coverage.** Key-tuple grouping.

### Family `table_calculated_column`

**Task.** Predict/construct formula for a calculated table column.

**Response/template.** structured formula and output column.

**Derivation.** Evaluate same row-relative structured formula for every data row.

**Difficulty.** L1 multiplication; L2 IF; L3 fixed named parameter; L4 inconsistent override detection.

**Misconceptions/constraints.** Header/total rows excluded from row formula.

**Feedback.** Expand `[@Field]` per row.

**Examples.**

1. `=[@Qty]*[@Price]` calculates each row amount. L1.
2. adding a source row extends formula under table profile. L2.
3. one literal in formula column is an override/inconsistency. L3.

**Validation/coverage.** Structured-to-row formula expansion.

### Family `data_validation_rule`

**Task.** Evaluate/design a bounded validation rule for allowed values.

**Response/template.** accept/reject or rule choice.

**Derivation.** Apply list, numeric interval, date interval, or custom Boolean formula relative to active cell.

**Difficulty.** L1 list; L2 range; L3 custom duplicate check supplied helper; L4 blanks policy.

**Misconceptions/constraints.** Validation prevents/flags input under stated mode; it does not clean existing data automatically.

**Feedback.** Substitute candidate into rule.

**Examples.**

1. list `{Open,Closed}` rejects Pending. L1.
2. whole number1–10 accepts10, rejects10.5. L2.
3. allowing blanks is separate from range condition. L2.

**Validation/coverage.** Typed predicate and boundary fixtures.

### Family `dynamic_filter_spill`

**Task.** Predict `FILTER` array shape/values and spill target.

**Response/template.** output mini-table/range/error.

**Derivation.** Select matching rows/columns preserving order; place from anchor across required rectangle.

**Difficulty.** L1 one column; L2 records; L3 no matches fallback; L4 blocked spill.

**Misconceptions/constraints.** Dynamic-array profile explicit. Any occupied target cell causes `#SPILL!`.

**Feedback.** Show Boolean include vector and spill rectangle.

**Examples.**

1. filter values[2,5,8] by>4 →[5,8]. L1.
2. two matching 3-column records spill2×3. L2.
3. occupied cell in spill rectangle →`#SPILL!`, source remains unchanged. L3.

**Validation/coverage.** Array filter and grid occupancy.

### Family `dynamic_unique_sort_sequence`

**Task.** Evaluate compositions of `UNIQUE`, `SORT`, or `SEQUENCE`.

**Response/template.** array/range.

**Derivation.** UNIQUE keeps first occurrence order; SORT uses pinned rules; SEQUENCE generates declared rows/columns/start/step.

**Difficulty.** L1 one function; L2 SORT(UNIQUE); L3 2D sequence; L4 spill/empty.

**Misconceptions/constraints.** Stable semantics explicit. At most12 output cells.

**Feedback.** Show intermediate arrays.

**Examples.**

1. UNIQUE[A,B,A,C] →[A,B,C]. L1.
2. SORT(UNIQUE[3,1,3,2]) →[1,2,3]. L2.
3. SEQUENCE(2,3,10,5) → rows `[10,15,20]`, `[25,30,35]`. L3.

**Validation/coverage.** Independent array transform engine.

### Cross-family progression

Single-key sort precedes comparator chains. Filtering precedes deduplication so row selection and identity remain separate. Calculated columns connect tables to formulas; validation controls future input. Dynamic FILTER then generalizes row selection into a spill result, followed by composable UNIQUE/SORT/SEQUENCE arrays.

## 8. Category: Pivot-table reasoning

### Category purpose

Translate an analytical question into dimension/measure placement and derive pivot values exactly from source records.

### Learn

A pivot table groups source rows by dimensions and aggregates measures. Rows and Columns determine the grid; Filters restrict source records; Values define aggregation. “Count” is not “Sum,” and average is computed from source sum/count, not by averaging displayed subgroup averages. Percent-of-total displays divide a cell by the appropriate filtered total.

### Prerequisites

Valid record tables, filtering, grouping, aggregation, percentages, and dates.

### Category boundaries

This category uses one flat source table and classic pivots. Data models, relationships, DAX, calculated fields/items, cube functions, and external sources are excluded.

### Subcategories

1. Field roles/configuration
2. One- and two-dimensional aggregation
3. Blank/count/average semantics
4. Filters, grouping, totals
5. Percent/running displays
6. Refresh, drill-down, and audit

### Common misconceptions

- Placing a numeric measure in Rows when a sum is wanted.
- Assuming a pivot cell copies a visible source row rather than aggregates.
- Confusing Count Values with Count Numbers.
- Averaging subgroup averages without subgroup counts.
- Calculating `% of row` using grand total.
- Assuming source edits instantly update an unrefreshed pivot.

### Family `pivot_field_roles`

**Task.** Assign source fields to Rows, Columns, Filters, and Values for a stated question.

**Response/template.** semantic field-role configuration.

**Derivation.** Identify grouping dimensions, restriction dimensions, and requested aggregated measure.

**Difficulty.** L1 one row/one value; L2 row+column; L3 filter; L4 several valid layouts accepted by semantic equivalence.

**Misconceptions/constraints.** Question wording specifies output grain. Values require aggregation.

**Feedback.** Translate “for each X, by Y, total Z, where W” into areas.

**Examples.**

1. total Sales by Region → Rows Region; Values Sum Sales. L1.
2. average Score by Team and Quarter → Rows Team; Columns Quarter; Values Average Score. L2.
3. same report for Year=2025 adds Filter Year. L2.

**Validation/coverage.** Question-intent schema and accepted layout symmetries.

### Family `pivot_sum_count`

**Task.** Calculate cells/grand total using Sum, Count Values, or Count Numbers.

**Response/template.** pivot mini-table.

**Derivation.** Filter/group source rows and apply pinned aggregation.

**Difficulty.** L1 sum; L2 count; L3 blanks/text; L4 infer aggregation from results.

**Misconceptions/constraints.** Aggregation named in header (`Sum of Amount`, etc.).

**Feedback.** Show source rows contributing to selected cell.

**Examples.**

1. Region N amounts5,7 →Sum12. L1.
2. three nonblank Order IDs →Count Values3. L1.
3. values2,"x",Blank →Count Numbers1, Count Values2. L3.

**Validation/coverage.** Shared group aggregation engine.

### Family `pivot_average_weighting`

**Task.** Calculate pivot averages and grand averages from source records.

**Response/template.** average/count fields.

**Derivation.** Per group and grand total use numeric sum/numeric count from source.

**Difficulty.** L1 equal groups; L2 unequal counts; L3 blanks; L4 reconstruct source sum/count.

**Misconceptions/constraints.** Never average displayed group averages unless counts equal.

**Feedback.** Show group sums/counts and grand weighted calculation.

**Examples.**

1. group values2,4 →Average3. L1.
2. averages10(n1) and20(n3) →grand17.5, not15. L2.
3. blank measure excluded from numeric count. L2.

**Validation/coverage.** Source-level sum/count invariant.

### Family `pivot_two_dimensions`

**Task.** Build/complete a Rows×Columns pivot.

**Response/template.** matrix with headers/totals.

**Derivation.** Group by tuple `(rowKey,columnKey)` and aggregate.

**Difficulty.** L1 2×2 sum; L2 missing combination; L3 multi-level row dimension; L4 transpose layout.

**Misconceptions/constraints.** Missing group combination displays blank or0 according to explicit profile; default blank.

**Feedback.** Highlight source rows for one cell then generalize.

**Examples.**

1. Region×Quarter sums form matrix. L1.
2. no South/Q2 record →blank, not source row with zero. L2.
3. swapping Rows/Columns transposes values without changing group totals. L3.

**Validation/coverage.** Tuple-group map and transpose identity.

### Family `pivot_filter_effect`

**Task.** Apply report/item/value filters and recompute pivot cells/totals.

**Response/template.** visible groups and values.

**Derivation.** Filter source/group set as specified before aggregation; value filter uses aggregated result under pinned order.

**Difficulty.** L1 report filter; L2 item selection; L3 top/value filter; L4 several filters ANDed.

**Misconceptions/constraints.** Filter order/semantics explicit. Hidden source rows versus pivot filters distinguished.

**Feedback.** Show retained source IDs and regroup.

**Examples.**

1. Year=2025 excludes 2024 rows before sums. L1.
2. Region items N,S excludes W. L2.
3. value filter total≥10 applies after group aggregation. L3.

**Validation/coverage.** Filter pipeline and group oracle.

### Family `pivot_date_grouping`

**Task.** Group typed dates by year, quarter, or month and aggregate.

**Response/template.** grouped labels/table.

**Derivation.** Extract calendar part; quarter=`floor((month−1)/3)+1`; retain year when needed across multiple years.

**Difficulty.** L1 month one year; L2 quarter; L3 year+month hierarchy; L4 partial periods.

**Misconceptions/constraints.** Typed Dates only. Month alone across years is explicitly combined or nested by Year.

**Feedback.** Map each date to bucket.

**Examples.**

1. 2025-02-10 →2025 Q1. L1.
2. Nov/Dec2024 group Q4 2024. L2.
3. grouping by Month alone combines January across years; use Year+Month when separation intended. L3.

**Validation/coverage.** Calendar bucket function.

### Family `pivot_subtotal_grand_total`

**Task.** Compute/interpret subtotals and grand totals for nested dimensions.

**Response/template.** missing totals/table audit.

**Derivation.** Aggregate source rows for each parent and all filtered rows; do not sum rounded averages.

**Difficulty.** L1 additive sum; L2 nested rows; L3 averages/counts; L4 suppressed subtotal.

**Misconceptions/constraints.** Total aggregation inherits measure operation.

**Feedback.** Expand parent group to contributing source records.

**Examples.**

1. product sums4+6 under Region N →subtotal10. L1.
2. grand Sum equals source sum after filters. L2.
3. grand Average is source average, not sum of child averages. L3.

**Validation/coverage.** Hierarchical group-set invariants.

### Family `pivot_percent_of_total`

**Task.** Calculate/display value as percentage of row, column, parent, or grand total.

**Response/template.** percentage and denominator label.

**Derivation.** Divide base aggregate by explicitly selected total within filtered pivot.

**Difficulty.** L1 grand; L2 row/column; L3 parent; L4 zero denominator.

**Misconceptions/constraints.** Denominator highlighted. Zero denominator yields `#DIV/0!`/blank per displayed profile.

**Feedback.** Show numerator cell and denominator margin.

**Examples.**

1. cell20, grand100 →20% of grand. L1.
2. cell20,row total50 →40% of row. L2.
3. same cell may be25% of column; label matters. L3.

**Validation/coverage.** Exact margin ratios and 100% sum tolerance.

### Family `pivot_running_total`

**Task.** Compute running total or difference from previous along a named ordered base field.

**Response/template.** sequence/table.

**Derivation.** Sort base items by declared semantic order; prefix-sum or adjacent difference within reset group.

**Difficulty.** L1 months; L2 reset per region; L3 missing periods; L4 wrong lexical month order.

**Misconceptions/constraints.** Base order explicit; running totals use unrounded base values.

**Feedback.** Show order and prefix accumulation.

**Examples.**

1. monthly2,5,3 →running2,7,10. L1.
2. each Region restarts at first month. L2.
3. alphabetical Apr,Aug,… is invalid chronological order for running total. L3.

**Validation/coverage.** Ordered partition prefix engine.

### Family `pivot_refresh_state`

**Task.** Predict pivot before/after source edit and refresh.

**Response/template.** stale/current values and needed action.

**Derivation.** Pivot holds cached snapshot until explicit Refresh; refresh re-reads current source range/table.

**Difficulty.** L1 edit existing row; L2 added table row; L3 added row outside fixed range; L4 source deletion.

**Misconceptions/constraints.** Refresh model declared. External refresh excluded.

**Feedback.** Show cached versus current source version and range membership.

**Examples.**

1. source amount5→8; before refresh pivot remains old, after uses8. L1.
2. new row in source Table included after refresh. L2.
3. new row outside fixed source range remains excluded even after refresh until source range changes. L3.

**Validation/coverage.** Versioned source snapshots.

### Family `pivot_drilldown_records`

**Task.** Identify source records contributing to one pivot cell.

**Response/template.** record-ID set.

**Derivation.** Apply pivot filters plus cell row/column dimension predicates.

**Difficulty.** L1 one dimension; L2 two; L3 nested/filter; L4 blank group.

**Misconceptions/constraints.** Drill-down shows contributing source rows, not a reversible unique aggregate decomposition without source.

**Feedback.** Predicate checklist per record.

**Examples.**

1. Region=N cell includes all filtered N rows. L1.
2. N/Q2 cell requires both predicates. L2.
3. `(blank)` group includes records whose dimension is Blank, not empty-text unless profile groups it separately. L3.

**Validation/coverage.** Cell predicate/source-ID oracle.

### Family `pivot_audit_configuration`

**Task.** Diagnose wrong field area, aggregation, filter, grouping, denominator, source range, or refresh state.

**Response/template.** first defect and repair.

**Derivation.** Compare pivot spec/result to requested analytical question and source truth.

**Difficulty.** L1 Sum versus Count; L2 field swapped; L3 percent denominator; L4 stale/incomplete source.

**Misconceptions/constraints.** Exactly one primary injected defect; result may look plausible.

**Feedback.** Requirements table: grain, filter, measure, aggregation, display, source.

**Examples.**

1. question asks total Amount but Values uses Count → change to Sum. L1.
2. Month in Filters instead of Columns fails requested month comparison. L2.
3. totals omit added rows because fixed source ends above them. L3.

**Validation/coverage.** Mutation provenance and independent pivot recomputation.

### Cross-family progression

Field placement precedes arithmetic. Sum/count and average semantics come before two-dimensional pivots. Filters and date grouping change source membership/group keys; totals follow. Percentage and running displays are introduced only after base aggregates are trusted. Refresh and drill-down expose provenance, and configuration audit integrates the whole pivot pipeline.

## 9. Category: Formula auditing, dependencies, and workbook design

### Category purpose

Trace how values are produced, locate the earliest structural defect, and design small workbooks whose assumptions and checks remain visible.

### Learn

A plausible result is not proof of a correct formula. Inspect precedents, reference patterns, ranges, types, and invariants. Direct precedents feed a formula; transitive precedents feed its dependencies. Circular references have no ordinary acyclic evaluation order. Hard-coded constants and duplicated logic make updates harder to audit.

### Prerequisites

All reference, formula, range, table, lookup, and pivot concepts.

### Category boundaries

This category audits bounded synthetic workbooks. Formal software testing, version control, collaboration review, security, and professional model assurance are excluded.

### Subcategories

1. Dependency graphs
2. Error and circularity diagnosis
3. Formula-pattern consistency
4. Range/source completeness
5. Assumptions and invariants
6. Workbook structure and first-error tracing

### Common misconceptions

- Trusting a value because it “looks reasonable.”
- Treating every downstream error cell as an independent defect.
- Repairing a symptom instead of the earliest bad precedent.
- Copying hard-coded rates through formulas.
- Ignoring hidden/filtered rows or added rows outside a fixed range.
- Assuming checks that currently equal zero will always do so if formulas are wrong in compensating ways.

### Family `direct_transitive_precedents`

**Task.** Identify direct and transitive precedents of a target formula.

**Response/template.** two cell sets/dependency edges.

**Derivation.** Parse reference edges; direct=immediate incoming, transitive=reachable ancestors.

**Difficulty.** L1 one level; L2 chain/branch; L3 ranges/cross-sheet; L4 exclude unused cells.

**Misconceptions/constraints.** Volatile/indirect references excluded.

**Feedback.** Highlight dependency graph by distance.

**Examples.**

1. C1=`A1+B1` → direct A1,B1. L1.
2. D1=`C1*2`; transitive includes C1,A1,B1. L2.
3. adjacent formatted cells not referenced are not precedents. L2.

**Validation/coverage.** Formula-AST graph reachability.

### Family `direct_transitive_dependents`

**Task.** Identify cells affected by changing a source cell.

**Response/template.** direct/transitive dependent sets or evaluation order.

**Derivation.** Follow outgoing dependency edges; topologically order affected subgraph.

**Difficulty.** L1 chain; L2 fan-out/fan-in; L3 cross-sheet; L4 unaffected lookalike formula.

**Misconceptions/constraints.** Only formulas referencing source directly/transitively count.

**Feedback.** Animate propagation in topological order.

**Examples.**

1. A1 feeds B1 and C1 → both direct dependents. L1.
2. D1 uses B1 → D1 transitive dependent of A1. L2.
3. E1 with a literal equal to A1 is not dependent. L2.

**Validation/coverage.** Reverse-graph reachability.

### Family `formula_evaluation_trace`

**Task.** Complete a stepwise trace through a small acyclic dependency graph.

**Response/template.** ordered cell results.

**Derivation.** Topologically evaluate each formula from typed precedents.

**Difficulty.** L1 linear chain; L2 branch; L3 error propagation; L4 several valid independent evaluation orders accepted.

**Misconceptions/constraints.** At most8 formula cells. Order requirements respect partial order.

**Feedback.** Show dependency-ready cells at each step.

**Examples.**

1. A1=2,B1=`A1+3`=5,C1=`B1*2`=10. L1.
2. independent B1/C1 may evaluate in either order before D1. L2.
3. upstream `#DIV/0!` propagates to dependent arithmetic. L3.

**Validation/coverage.** DAG topological evaluator.

### Family `circular_reference_detect`

**Task.** Identify a circular dependency and cells in the cycle.

**Response/template.** yes/no and cycle sequence.

**Derivation.** Find strongly connected components/self-loops in dependency graph.

**Difficulty.** L1 self-reference; L2 two cells; L3 longer cross-sheet; L4 dependent outside cycle versus cycle member.

**Misconceptions/constraints.** Iterative calculation disabled; result `#CIRC!`.

**Feedback.** Trace references until a cell repeats.

**Examples.**

1. A1=`A1+1` →self-cycle. L1.
2. A1=`B1`,B1=`A1` →two-cell cycle. L2.
3. C1 depends on cyclic A1 but is not itself necessarily in the strongly connected cycle; it receives error. L3.

**Validation/coverage.** SCC algorithm and error propagation.

### Family `spreadsheet_error_diagnose`

**Task.** Map a displayed error to the supported immediate cause and repair.

**Response/template.** error code/cause/repair.

**Derivation.** Inspect formula AST, references, types, lookup/spill/dependency state.

**Difficulty.** L1 divide/ref; L2 value/name/N/A; L3 spill/circular; L4 same error from multiple possible causes narrowed by workbook.

**Misconceptions/constraints.** Error meanings pinned; no vendor-specific warnings.

**Feedback.** Show failing operation, not a generic definition.

**Examples.**

1. denominator cell0 →`#DIV/0!`. L1.
2. lookup key absent →`#N/A`. L2.
3. spill target occupied →`#SPILL!`, clear/move blocker rather than change source array. L3.

**Validation/coverage.** Deliberate typed-failure fixtures.

### Family `formula_pattern_consistency`

**Task.** Identify outlier formula in a row/column/2D fill pattern.

**Response/template.** target cell and expected normalized formula.

**Derivation.** Translate formulas to relative R1C1-like internal patterns or derive from seed displacement.

**Difficulty.** L1 one row shift; L2 mixed refs; L3 equivalent syntax; L4 intentional subtotal exception.

**Misconceptions/constraints.** Metadata distinguishes data rows from subtotal/header exceptions.

**Feedback.** Normalize every formula relative to its host.

**Examples.**

1. B2=`A2*2`,B3=`A3*2`,B4=`A3*2` →B4 inconsistent. L1.
2. `$B$1` constant is consistent across fills. L2.
3. subtotal formula may intentionally differ and is excluded from calculated-column pattern. L3.

**Validation/coverage.** Host-relative AST normalization.

### Family `hardcoded_constant_audit`

**Task.** Detect a duplicated/hard-coded assumption and replace it with a reference/name.

**Response/template.** affected formulas and repaired formula.

**Derivation.** Compare literal constants with declared input parameter and update requirement.

**Difficulty.** L1 repeated tax rate; L2 mixed literals; L3 one intentional threshold versus assumption; L4 hidden inconsistency after parameter change.

**Misconceptions/constraints.** Not every literal is bad (`0`, `1`, structural constants may be appropriate). Intent metadata explicit.

**Feedback.** Change assumption and show which formulas update/fail.

**Examples.**

1. formulas `=A2*0.2` repeated; replace0.2 with `$B$1`/TaxRate. L1.
2. one formula still uses old0.18 after input changed0.2 → audit catches. L2.
3. divisor12 for months/year can remain structural under declared model. L3.

**Validation/coverage.** Parameter mutation and expected dependent changes.

### Family `cross_sheet_reconciliation`

**Task.** Reconcile summary cells with detailed source sheets.

**Response/template.** difference/check formula and first mismatch.

**Derivation.** Independently aggregate detail and compare to summary with exact or declared tolerance.

**Difficulty.** L1 one total; L2 categories; L3 omitted sheet/range; L4 rounding timing.

**Misconceptions/constraints.** Summary must not be oracle for itself.

**Feedback.** Show detail total, summary value, difference.

**Examples.**

1. detail sum1,200 versus summary1,150 →difference50. L1.
2. summary formula omits December sheet →repair range/reference. L2.
3. check `=Summary!B2-SUM(Detail!B2:B20)` should equal0. L2.

**Validation/coverage.** Independent source aggregation.

### Family `hidden_filtered_range_audit`

**Task.** Determine whether hidden/filtered rows contribute to a formula/pivot.

**Response/template.** included IDs/value.

**Derivation.** Apply function-specific visibility semantics and pivot/source filters.

**Difficulty.** L1 SUM includes filtered; L2 SUBTOTAL excludes; L3 manual hidden profile; L4 pivot filter versus worksheet filter.

**Misconceptions/constraints.** Visibility policy printed. Hidden is not deleted.

**Feedback.** Mark each row included/excluded by operation.

**Examples.**

1. ordinary SUM includes filtered-out row. L1.
2. pinned SUBTOTAL excludes filtered row. L2.
3. pivot built from table may still include worksheet-hidden rows unless pivot filter/source profile excludes them. L3.

**Validation/coverage.** Operation-specific row-membership oracle.

### Family `source_range_completeness`

**Task.** Audit whether formulas/pivots/charts include all intended records and only intended records.

**Response/template.** missing/extra cells/rows and repaired range.

**Derivation.** Compare referenced source range/table with semantic dataset membership.

**Difficulty.** L1 last row omitted; L2 header/total included; L3 new rows outside fixed range; L4 disjoint period sheets.

**Misconceptions/constraints.** Intended dataset explicitly defined.

**Feedback.** Overlay source boundary and intended records.

**Examples.**

1. data rows2:25 but SUM ends24 →row25 omitted. L1.
2. chart includes total row as another category →extra record. L2.
3. table source auto-expands; fixed A1:C10 does not include row11. L3.

**Validation/coverage.** Set comparison of source record IDs.

### Family `invariant_check_formula`

**Task.** Construct/evaluate a control total or invariant check.

**Response/template.** check formula/status.

**Derivation.** Derive independent equality/range constraint such as components−total=0, percentages sum100%, opening+flows=closing.

**Difficulty.** L1 total difference; L2 multi-sheet; L3 tolerance/rounding; L4 compensating-errors limitation.

**Misconceptions/constraints.** Passing check is evidence for one invariant, not proof workbook fully correct.

**Feedback.** State invariant and what it cannot detect.

**Examples.**

1. `=SUM(parts)-reported_total` expected0. L1.
2. category shares sum100% within displayed rounding tolerance. L2.
3. two offsetting wrong values can pass a total check, so row-level checks may still be needed. L3.

**Validation/coverage.** Independently generated invariant predicates.

### Family `workbook_first_error`

**Task.** Trace a compact workbook and identify the earliest root defect producing downstream symptoms.

**Response/template.** sheet/cell, defect, repair, affected outputs.

**Derivation.** Compare each formula/source/pivot stage with immutable truth in dependency order; use mutation provenance.

**Difficulty.** L1 formula→summary; L2 cross-sheet; L3 pivot/chart downstream; L4 plausible compensating result.

**Misconceptions/constraints.** One primary planted defect. At most4 sheets/20 formula cells.

**Feedback.** Root-cause graph separates defect from consequences.

**Examples.**

1. source correct, copied formula drifts at C5, summary wrong →C5 first error. L2.
2. lookup range omits last key; downstream pivot groups missing category →lookup/source-range defect first. L3.
3. chart reflects wrong summary faithfully; chart is consequence, not root defect. L3.

**Validation/coverage.** End-to-end mutation lineage.

### Family `workbook_layout_design`

**Task.** Choose/repair a small workbook layout separating inputs, calculations, outputs, and checks.

**Response/template.** block/sheet role assignment and formula-link choices.

**Derivation.** Ensure single source of assumptions, explicit labels/units, no duplicated inputs, protected formula zones conceptually, and visible checks.

**Difficulty.** L1 label inputs; L2 separate output; L3 multi-sheet flow; L4 compare maintainability under change.

**Misconceptions/constraints.** No subjective aesthetics. Every preferred choice satisfies explicit change/audit requirement.

**Feedback.** Simulate one assumption/data change.

**Examples.**

1. tax rate entered once and referenced, not repeated. L1.
2. raw data sheet feeds calculation/pivot, which feeds report; report does not overwrite raw data. L2.
3. check cells near output expose reconciliation status. L3.

**Validation/coverage.** Layout dependency-policy rules and change simulation.

### Cross-family progression

Precedents/dependents establish graph vocabulary before evaluation traces and cycles. Error diagnosis and formula-pattern checks follow. Hard-coded assumptions, cross-sheet reconciliation, visibility, and source completeness broaden auditing. Invariant checks teach bounded assurance. First-error and layout design cap the category with root-cause/change-resilience reasoning.

## 10. Category: Spreadsheet outputs, conditional formatting, and chart sources

### Category purpose

Prepare trustworthy outputs and reason about spreadsheet-specific formatting/chart source behavior without duplicating general chart literacy.

### Learn

Conditional formatting changes appearance, not stored value. Spreadsheet charts read values/categories/series from a source range or pivot; changing source membership, orientation, filters, or cached pivot changes the chart. Verify the source table and formulas before interpreting the picture.

### Prerequisites

Stored/display values, formulas, tables, filters, pivots, and source-range auditing.

### Category boundaries

This category owns spreadsheet linkage and configuration. Axis reading, visual encodings, and misleading-chart design belong in Data Literacy and Chart Reading.

### Subcategories

1. Conditional formatting
2. Chart source/orientation
3. Filtered/hidden chart data
4. Pivot-linked outputs
5. Output reconciliation

### Common misconceptions

- Treating a color/icon as the stored value.
- Applying a relative conditional rule from the wrong active cell.
- Swapping categories and series.
- Assuming a chart includes newly added rows.
- Assuming a refreshed chart can fix an incorrect source formula.
- Interpreting a pivot chart before checking pivot aggregation/filter.

### Family `conditional_format_rule`

**Task.** Predict which cells receive a format from value/cell/formula rule.

**Response/template.** cell set/style.

**Derivation.** Evaluate rule per target; custom formula is copied relative to top-left active cell under displayed rule.

**Difficulty.** L1 threshold; L2 mixed anchors; L3 duplicate/top-N supplied rank; L4 several ordered rules.

**Misconceptions/constraints.** Formatting does not modify value. Rule precedence/stop-if-true explicit.

**Feedback.** Show per-cell condition and reference transformation.

**Examples.**

1. format values<0 →negative cells highlighted. L1.
2. formula `=$A2="Late"` applied B2:D6 locks status column A, varies row. L2.
3. highlighted cell still stores original number. L1.

**Validation/coverage.** Rule evaluator and style assignment.

### Family `chart_source_range`

**Task.** Identify/repair records/categories/series included by a chart source range.

**Response/template.** source range and included record IDs.

**Derivation.** Resolve source rectangle/table, headers, blanks, and chart orientation profile.

**Difficulty.** L1 simple table; L2 omitted last row; L3 total row; L4 noncontiguous excluded v1/choose staging range.

**Misconceptions/constraints.** Exact chart output shown accessibly; source semantics pinned.

**Feedback.** Highlight source cells mapped to chart.

**Examples.**

1. A1:B5 includes header plus4 categories. L1.
2. data extends row6 but fixed source ends5 →new category absent. L2.
3. total row included becomes misleading extra category; exclude it. L3.

**Validation/coverage.** Source cell-to-chart data mapping.

### Family `chart_series_orientation`

**Task.** Predict/choose whether rows or columns become series/categories.

**Response/template.** legend series and category axis labels.

**Derivation.** Apply explicit “series in rows/columns” setting to header matrix.

**Difficulty.** L1 one series; L2 matrix; L3 switch row/column; L4 choose orientation for question.

**Misconceptions/constraints.** No vendor auto-detection ambiguity; setting displayed.

**Feedback.** Color-code header roles accessibly.

**Examples.**

1. first column Months, next columns Plan A/B with series-in-columns →two series, month categories. L1.
2. switch orientation →month series and plan categories. L2.
3. intended compare plans over time favors plan series/month categories. L3.

**Validation/coverage.** Matrix orientation transform.

### Family `chart_filtered_hidden_rows`

**Task.** Predict chart values when source rows are filtered/hidden under declared inclusion setting.

**Response/template.** included IDs/chart table.

**Derivation.** Apply chart's `includeHidden/filtered` policy after source selection.

**Difficulty.** L1 filtered excluded; L2 hidden included; L3 missing gap versus zero; L4 source table filter+pivot.

**Misconceptions/constraints.** Policy visible because vendors differ.

**Feedback.** Mark source visibility and chart inclusion separately.

**Examples.**

1. profile excludes filtered rows →filtered category disappears. L1.
2. hidden rows included under setting still appear. L2.
3. blank value creates gap/blank, not zero, under chart profile. L3.

**Validation/coverage.** Visibility membership and accessible chart table.

### Family `pivot_chart_linkage`

**Task.** Predict chart changes from pivot field/filter/refresh changes.

**Response/template.** resulting chart series/categories/values.

**Derivation.** Recompute/version pivot then map its visible output to chart.

**Difficulty.** L1 pivot filter; L2 field move; L3 percent-of-total; L4 stale pivot.

**Misconceptions/constraints.** Chart never bypasses pivot's aggregation.

**Feedback.** Source → pivot → chart pipeline.

**Examples.**

1. pivot Year filter2025 makes chart show2025 aggregates. L1.
2. move Quarter Columns→Rows changes chart categories/series under setting. L2.
3. source edit without pivot refresh leaves pivot chart stale. L3.

**Validation/coverage.** Versioned pivot/chart projection.

### Family `output_chart_reconcile`

**Task.** Determine whether displayed report cells and chart agree with source/formula/pivot truth and locate first mismatch.

**Response/template.** pass/fail per layer and repair.

**Derivation.** Independently recompute source transform, output table, and chart data table.

**Difficulty.** L1 chart transcription; L2 wrong formula; L3 stale pivot; L4 formatting/rounding apparent mismatch.

**Misconceptions/constraints.** One primary defect. General visual claims remain in chart-literacy app.

**Feedback.** Three-column source/output/chart reconciliation.

**Examples.**

1. output cell10, chart data10 →agree. L1.
2. chart shows8 because source range points to prior column →chart source defect. L2.
3. chart faithfully plots wrong formula output; formula is root defect. L3.

**Validation/coverage.** Independent layer checks and mutation lineage.

### Cross-family progression

Conditional formatting reinforces value/display separation. Chart source range precedes orientation and visibility. Pivot chart linkage reuses pivot state. Final reconciliation keeps the focus on spreadsheet provenance; learners use the dedicated chart app for broader visual judgment.

## 11. Topic-level progression

### Level 1: Grid and direct formulas

- Locate cells/ranges and distinguish values from formatting.
- Evaluate arithmetic, SUM/AVERAGE, COUNT/COUNTA, simple IF, and exact lookups.
- Copy purely relative or absolute references in one direction.
- Sort/filter a few records and configure a one-dimensional Sum pivot.

### Level 2: Copy-safe structured work

- Use mixed anchors and copy formulas in two dimensions.
- Work with blanks, empty strings, errors, rounding, conditional criteria, text/date parts, and tables.
- Build exact lookups and calculated columns.
- Configure two-dimensional pivots with filters/totals.
- Trace short dependency chains.

### Level 3: Inverse and diagnostic reasoning

- Choose anchors from fill intent and reconstruct formulas from copies.
- Use multi-criteria aggregation, approximate lookup, INDEX/MATCH, dynamic spills, and grouped dates.
- Distinguish pivot Count/Sum/Average and percentage denominators.
- Diagnose pattern drift, source-range omissions, stale pivots, hidden-row effects, and display-versus-value differences.

### Level 4: Integrated workbook audit

- Coordinate multiple sheets, names, tables, pivots, and outputs.
- Repair formula/reference errors whose current value appears plausible.
- Audit duplicate keys, sorted approximate lookups, weighted pivot totals, running order, and refresh/source membership.
- Construct independent reconciliation/control checks.

### Level 5: Bounded workbook lab

- Inspect a generated workbook requirement and data table.
- create/fill formulas under a supported grammar;
- transform/filter/lookup records;
- configure a pivot/report;
- verify output/chart linkage;
- find one planted root defect or certify all declared invariants;
- repair the workbook while preserving source data and requirements.

Difficulty rises through reference dimensions, representation transfer, weaker cues, dependencies, and diagnosis—not more rows or longer formulas.

## 12. Adaptive practice guidance

Track mastery by family, function, reference anchor pattern, copy direction, type/error, criteria/lookup mode, table transform, pivot role/aggregation, and misconception:

- `row_column_swapped`
- `range_endpoint_excluded`
- `format_changes_value`
- `blank_zero_empty_same`
- `dollar_locks_everything`
- `wrong_mixed_dimension`
- `one_range_endpoint_shifted`
- `current_value_equivalence`
- `precedence_left_to_right`
- `percentage_divided_twice`
- `if_both_branches`
- `count_counta_confused`
- `average_includes_blank`
- `sumifs_or_instead_of_and`
- `lookup_default_approximate`
- `lookup_unsorted`
- `wrong_return_column`
- `sort_column_not_rows`
- `filter_means_delete`
- `spill_overwrites_cells`
- `pivot_count_vs_sum`
- `average_of_averages`
- `wrong_percent_total`
- `pivot_refresh_assumed`
- `downstream_symptom_as_root`
- `hidden_rows_ignored`

After an error:

- Wrong mixed reference → split the reference into row/column locks before another fill.
- Formula right only in seed → test one horizontal and one vertical destination.
- COUNT/COUNTA confusion → present Number0, Blank, `""`, Text, Boolean, Error side by side.
- Approximate lookup error → place key between two sorted thresholds.
- Multi-key sort error → group primary ties visually before secondary ordering.
- Pivot average error → reveal source sums and counts.
- Stale pivot confusion → show snapshot version and current source version.
- Root-cause error → collapse downstream dependents and ask for first failing cell.

Suggested session mix:

- 55% current-level mixed formulas/workflows;
- 20% reference/type prerequisite repair;
- 15% spaced review;
- 10% inverse/audit/design tasks.

Typing syntax errors should not erase evidence of correct reference reasoning; tag syntax and semantics separately.

## 13. Answer checking and worked feedback

### Formula parsing and equivalence

1. Parse the submitted canonical formula into an AST.
2. Report syntax errors with token/location.
3. Resolve sheet/name/table symbols.
4. Type-check supported operations.
5. Compare structural reference behavior when copy semantics matter.
6. Evaluate against the visible workbook and hidden safe test cases when semantic equivalence is allowed.

For anchor/copy questions, `=A2*$B$1` is not equivalent to a literal result or `=A2*0.2`, even if current B1 is0.2. For direct result questions, any supported formula producing the same typed value across declared cases may be accepted.

### Values, arrays, and errors

- Compare Number exactly before requested display rounding.
- Preserve Text, Boolean, Date, Blank, empty string, and Error distinctions.
- Arrays require identical dimensions/order/types.
- Record-ID sets ignore order only for filters/drill-down tasks that define sets.
- Sort results preserve order and stable-tie semantics.
- Pivot result checking uses source-derived unrounded aggregates.

### Partial diagnosis

Check separately:

- syntax;
- referenced cells/ranges;
- anchors/copy behavior;
- operation/function;
- criteria/match mode;
- type/error behavior;
- current value;
- fill-region/pivot/output invariants.

Feedback examples:

> Your result is correct in C2, but `B1` is relative. Copied to C3 it becomes `B2`. Use `$B$1` for the fixed rate.

> The pivot grand average is not the average of `10` and `20`. Those groups contain 1 and 3 records, so the source-level average is `(10×1+20×3)/4=17.5`.

> The chart matches the summary cell. The earlier error is the summary formula ending at row24 while the source has row25.

### Worked solution patterns

Reference:

```text
source → destination displacement → row/column locks → transformed formula
```

Formula:

```text
resolve references → establish types → evaluate inner operations → format result
```

Pivot:

```text
filter source → form group keys → aggregate source rows → totals/display transform
```

Audit:

```text
requirement → source membership → formula/dependency → output invariant → first mismatch
```

## 14. Rendering, interaction, and accessibility

- Render semantic HTML grid/table with row/column headers and a synchronized formula bar.
- Keyboard navigation supports arrows, Page keys, name-box jump, and structured answer controls without requiring vendor shortcuts.
- Screen readers announce address, displayed value, stored type/value when relevant, formula, and edit state.
- Formula references receive non-color outlines/patterns synchronized with formula tokens.
- Copy/fill animations are optional; static source/destination displacement tables contain the same information.
- Pivot builder provides keyboard-selectable field areas and a textual configuration summary.
- Hidden/filtered rows remain discoverable through an accessible status summary when relevant.
- Error codes are announced with expanded meaning.
- Spill ranges expose anchor, dimensions, and blocker cell.
- Charts always include their source data table; conditional formatting has a textual rule/result list.
- Locale affects ordinary prose/value display, but canonical formula exercises retain their declared English/comma/period profile unless a separate locale profile is explicitly selected.
- Narrow screens focus a small window around relevant cells rather than shrinking a large sheet.

No exercise requires pixel-perfect dragging, color recognition, hover-only content, or scanning an enormous grid.

## 15. Implementation architecture

The standalone HTML/CSS/JavaScript app uses a bounded local spreadsheet interpreter, not an embedded third-party office suite or backend compiler.

Recommended modules:

- seeded PRNG/replay token;
- exact decimal/rational arithmetic;
- typed scalar/error/date values;
- workbook/sheet/grid/table/name model;
- canonical formula tokenizer/parser/AST formatter;
- A1/structured reference resolver and copy transformer;
- dependency graph/SCC/topological evaluator;
- supported scalar/range/function library;
- criteria and lookup engines;
- sort/filter/deduplicate/table/dynamic-array transforms;
- pivot grouping/aggregation/display engine with versioned cache;
- conditional-format/chart-source projection;
- deliberate mutation/root-cause provenance engine;
- adaptive scheduler and misconception tags;
- localized prose/value dictionaries.

Each instance stores:

```js
{
  seed,
  familyId,
  level,
  profileVersion,
  workbook,
  activeSheet,
  activeCell,
  operation,
  sourceSnapshotVersion,
  formulaAST,
  expectedTypedValue,
  expectedArray,
  expectedReferences,
  fillTestRegion,
  pivotSpec,
  expectedPivot,
  mutation,
  misconceptionTags,
  workedTrace,
  structuralSignature
}
```

Generators construct semantic workbooks; independent oracles solve operations. Rendering never parses displayed prose back into data/formulas.

## 16. Automated validation requirements

Reject an instance unless:

- every formula parses, resolves, and uses only supported semantics;
- reference copy transformations remain in bounds or intentionally yield `#REF!`;
- expected formulas are unique under requested structural behavior or all equivalents are accepted;
- dependency graph is acyclic unless circularity targeted;
- typed operations avoid undeclared coercion;
- dates are valid and comparison/interval semantics explicit;
- criteria and aligned ranges have valid shapes;
- lookup match mode, sort/uniqueness preconditions, and fallback are explicit;
- dynamic-array spill region is exact and blocker intentional;
- table headers/source ranges are structurally valid;
- sort/filter/deduplicate output preserves complete record rows;
- pivot source/configuration yields unique grouping and aggregation;
- pivot totals derive from source values before display rounding;
- refresh questions distinguish cache/source versions;
- planted defect has one primary root cause and expected downstream effects;
- chart/output projection agrees with its source layer when not intentionally flawed;
- distractors correspond to named mutations and remain distinct.

Independent checks should include:

- formula AST evaluator versus direct hand-coded operation;
- A1 copy transformer forward/reverse round trips;
- host-relative formula normalization versus fill transformation;
- range function versus enumerated included values;
- conditional aggregation versus explicit row truth table;
- lookup result versus source scan;
- sort/filter/dedup transform versus record-ID set/order invariants;
- dynamic array versus direct array construction;
- pivot engine versus independent group-map aggregation;
- pivot grand totals versus filtered source aggregates;
- dependency graph result versus recursive memoized evaluator;
- correction mutation plus repair versus pristine workbook checksum;
- output/chart data versus source projection.

Test suites require:

- golden fixtures for every family and level;
- property/fuzz tests over all four anchor combinations and copy directions;
- grid-boundary and `#REF!` cases;
- Blank/0/`""`/Text/Boolean/Error matrices;
- operator precedence and exact rounding boundaries;
- criteria wildcard/escape and multi-criteria fixtures;
- exact/approximate lookup boundaries, missing and duplicate keys;
- leap dates and date interval endpoints;
- stable multi-key sorts, filters, composite dedup keys;
- spill shapes/blockers;
- pivot blanks, Count Values/Numbers, weighted averages, empty combinations, percentages, grouping, filters, stale refresh;
- cycles and downstream error provenance;
- formula-pattern false friends with coincident values;
- locale/display formatting and accessibility snapshots;
- deterministic replay.

Developer mode exposes seed, workbook JSON, formula AST, resolved references, dependency graph, typed evaluation trace, source record IDs, pivot groups/cache version, mutation lineage, and rejection reason.

## 17. Coverage requirements

This specification defines 88 question families:

- 9 grid/value/range/workbook-structure;
- 10 reference/copy;
- 10 scalar formula/logic/error;
- 10 aggregation/conditional;
- 10 lookup/text/date;
- 8 table/transform/dynamic-array;
- 12 pivot-table;
- 13 audit/dependency/design;
- 6 output/format/chart-source.

The implementation registry must compute and test this inventory.

Across a representative seeded corpus, cover:

- every combination of relative/absolute row/column anchors;
- horizontal, vertical, diagonal, and rectangular fills;
- single references, ranges, names, tables, and cross-sheet references;
- Number, Text, Boolean, Date, Blank, empty string, and each supported Error;
- exact values and distinct formatted displays;
- direct formula evaluation, construction, inverse inference, copy, repair, and audit;
- equality/inequality/text/wildcard criteria and multi-criteria conjunction;
- exact, approximate, found, not-found, duplicate, and invalid-sort lookup cases;
- stable sorts, filters, key deduplication, validation, and spill behavior;
- pivot Sum, Count Values, Count Numbers, Average, Min, Max;
- row/column/filter dimensions, subtotals/grand totals, blank groups, date groups, percentages, running totals, drill-down, refresh;
- correct, stale, incomplete, hidden, structurally inconsistent, and circular workbook states.

At least 25% of eligible questions should require construction, inverse reasoning, repair, or audit. At least 20% of formula-reference questions must use mixed anchors. At least 30% of advanced audit cases should currently display a plausible value despite structural error.

Ordinary practice limits:

- visible grid window at most15×10;
- source table at most12 rows/8 fields;
- formula nesting depth at most4;
- range aggregation at most20 cells;
- dynamic output at most20 cells;
- dependency graph at most20 formula nodes;
- pivot source at most20 rows, result at most8×8;
- workbook at most4 sheets.

## 18. Navigation and v1 priorities

Recommended views:

- **Learn:** grid/types, reference-anchor simulator, function semantics, table/pivot field guide.
- **Practice:** category, family, level, formula/pivot/audit filters.
- **Formula lab:** edit seed formula, preview fill, evaluate hidden test cells.
- **Table lab:** sort/filter/lookup/aggregate a generated record table.
- **Pivot lab:** configure fields and inspect contributing source rows.
- **Audit lab:** trace dependencies and repair one root defect.
- **Reference:** canonical grammar, functions, errors, criteria, lookup/pivot rules.

Minimum satisfying v1:

1. cell/range/type/display fundamentals;
2. relative, absolute, and mixed copy/fill;
3. arithmetic, comparisons, IF, errors, rounding;
4. SUM/AVERAGE/COUNT/COUNTA and SUMIF/SUMIFS;
5. exact XLOOKUP/VLOOKUP and basic text/date;
6. sort/filter/tables;
7. pivot field roles, Sum/Count/Average, two dimensions, filters/totals;
8. precedents, formula consistency, source completeness, and first-error feedback.

V1.1 adds approximate/INDEX-MATCH, validation, dynamic arrays, richer pivot display calculations and refresh. V1.2 adds structural edits, advanced text/date, deeper audits, and chart/output linkage.

## 19. Topic-level quality checklist

- [ ] Canonical formula grammar and every supported function have pinned semantics.
- [ ] Questions never depend on undocumented vendor coercion or omitted lookup defaults.
- [ ] Copy/fill is clearly distinguished from move and structural insertion/deletion.
- [ ] Every anchor question checks copied behavior, not only the seed cell's current value.
- [ ] Ranges are inclusive and every endpoint transforms correctly.
- [ ] Blank, zero, empty string, Text, Boolean, Date, and Error remain distinct.
- [ ] Formatting never changes stored value in the semantic model.
- [ ] Formula parser reports syntax separately from semantic mistakes.
- [ ] Conditional ranges align by shape and source record.
- [ ] Approximate `VLOOKUP` requires sorted ascending keys; `XLOOKUP` match mode is explicit and follows its separately pinned rule.
- [ ] Duplicate exact-match behavior and not-found behavior are explicit.
- [ ] Sort/filter/deduplicate operations preserve complete records.
- [ ] Spill results have exact shape and blockers produce `#SPILL!`.
- [ ] Pivot field roles, filters, aggregation, blank handling, totals, and display denominator are explicit.
- [ ] Pivot averages/totals derive from unrounded source records.
- [ ] Refresh questions track source and cache versions.
- [ ] Audit feedback identifies the earliest root defect rather than every consequence.
- [ ] Passing checks are described as bounded evidence, not proof of full correctness.
- [ ] Output/chart questions reconcile source → formula/pivot → chart data.
- [ ] Every family has three instantiated examples and automated fixtures.
- [ ] Difficulty rises through reference/dependency/representation reasoning, not grid size or obscure functions.
- [ ] All workbooks are synthetic, offline, and free of personal or live business data.
- [ ] The app teaches transferable spreadsheet reasoning rather than vendor UI trivia.
