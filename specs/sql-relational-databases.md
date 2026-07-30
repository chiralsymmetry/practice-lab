# SQL and Relational Databases — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, teaching-SQL parser/evaluator, relational-model oracle, table renderer, answer-checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

SQL and Relational Databases

### Topic goal

Develop reliable mental execution and relational reasoning for small databases. The learner should become able to:

- read schemas, rows, keys, and relationships precisely;
- predict query results as bags, sets, or ordered sequences as appropriate;
- trace expression evaluation, filtering, and SQL’s three-valued `NULL` logic;
- distinguish `WHERE`, `ON`, `HAVING`, and projection effects;
- reason about `DISTINCT`, ordering, pagination, joins, groups, and aggregates;
- use subqueries, `EXISTS`, `IN`, and set operations without `NULL` traps;
- predict inserts, updates, deletes, constraints, and small transaction traces;
- recognize functional dependencies, normalization problems, and lossless decompositions;
- choose useful indexes and interpret bounded query-plan consequences;
- write or complete controlled queries whose results can be checked semantically.

The core activity is not memorizing keywords. It is following data through a declared relational execution model.

### Audience and prerequisites

The learner should know:

- tables, rows, columns, simple data types;
- Boolean `AND`, `OR`, and `NOT`;
- arithmetic and comparisons;
- basic programming-style expressions.

No server administration or prior database course is required. Later schema-design and planning categories assume earlier query fluency.

### Scope

The topic includes:

- relations/tables, attributes/columns, tuples/rows, domains/types, schemas, bags, sets, and result ordering;
- candidate, primary, alternate, composite, natural, surrogate, and foreign keys;
- `SELECT`, projection, aliases, scalar expressions, `CASE`, `COALESCE`, and controlled string operations;
- `WHERE`, comparison predicates, `BETWEEN`, `IN`, `LIKE`, and three-valued logic;
- `NULL`, `IS NULL`, `IS [NOT] DISTINCT FROM`, unknown truth values, and context-specific treatment;
- `DISTINCT`, `ORDER BY`, explicit null placement, multiple sort keys, `LIMIT`, and `OFFSET`;
- `CROSS`, `INNER`, and `LEFT` joins, self joins, many-to-many joins, and join cardinality;
- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, and `HAVING`;
- scalar, correlated, and uncorrelated subqueries; `EXISTS`, `IN`, `NOT IN`, `ANY`, and `ALL` in bounded forms;
- `UNION [ALL]`, `INTERSECT`, and `EXCEPT`;
- `INSERT`, `UPDATE`, `DELETE`, defaults, generated identifiers only when supplied, and declarative constraints;
- transaction atomicity and small read-committed/snapshot schedules under an explicit toy model;
- functional dependencies, anomalies, 1NF/2NF/3NF/BCNF at a controlled level, junction tables, and lossless decomposition;
- B-tree index prefixes, selectivity, covering indexes, full scans/index scans/lookups, and bounded plan comparison.

### Exclusions

Do not include in the initial app:

- vendor-specific SQL trivia without a displayed dialect;
- unrestricted DDL, stored procedures, triggers, user-defined functions, dynamic SQL, or procedural extensions;
- window functions, recursive CTEs, pivots, temporal tables, arrays, JSON/XML querying, full-text search, or geospatial SQL;
- arbitrary date/time-zone behavior, locale collation, floating-point edge cases, regular expressions, or vendor-specific string functions;
- database installation, server operations, replication, backup, sharding, distributed consensus, or cloud-product configuration;
- detailed cost estimation, storage-engine internals, buffer replacement, lock-manager implementation, or optimizer hints;
- unrestricted serializability theory or long concurrent schedules;
- real credentials, production schemas, personal data, injection payload construction, or destructive real-system actions;
- open-ended schema design essays or query-style grading where many materially different requirements are plausible;
- queries whose answer depends on unspecified row order, collation, null ordering, isolation level, implicit conversion, or optimizer behavior.

### Teaching dialect: `PracticeSQL-1`

`PracticeSQL-1` is a versioned, strict, offline teaching dialect modeled on portable SQL behavior. It is not claimed to be identical to SQLite, PostgreSQL, MySQL, SQL Server, or Oracle.

#### Supported scalar types

- `INTEGER`: arbitrary-precision signed integer;
- `DECIMAL(p,s)`: exact fixed-point decimal stored as scaled integer;
- `TEXT`: Unicode string compared by binary code-point collation;
- `BOOLEAN`: `TRUE` or `FALSE`, distinct from integers;
- `NULL`: absence/unknown marker, not a value of another type.

Dates/times and approximate floats are excluded initially. Columns are statically typed. No implicit text-number/Boolean-number coercion occurs.

#### Numeric and text operations

- `+ - *` use exact promoted numeric arithmetic.
- `/` returns an exact decimal/rational result; division by zero is a runtime query error.
- String concatenation is `||`.
- Any ordinary arithmetic or concatenation operand `NULL` produces `NULL`.
- Text comparison is case-sensitive binary code-point comparison.
- `LIKE` supports `%` for zero or more code points and `_` for exactly one; an optional explicit `ESCAPE` character is supported.
- `LOWER`, locale-aware case folding, regex, and implementation-specific collations are excluded.

#### Query grammar

Supported query shape:

```sql
SELECT [DISTINCT] select_item [, ...]
FROM table_reference
     [CROSS JOIN ... | [INNER] JOIN ... ON predicate | LEFT JOIN ... ON predicate]*
[WHERE predicate]
[GROUP BY group_expression [, ...]]
[HAVING predicate]
[ORDER BY order_expression [ASC|DESC] [NULLS FIRST|NULLS LAST] [, ...]]
[LIMIT nonnegative_integer [OFFSET nonnegative_integer]]
```

Also supported in bounded families:

- `CASE WHEN ... THEN ... [ELSE ...] END`;
- `COALESCE`;
- scalar and predicate subqueries;
- `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT`;
- `INSERT`, `UPDATE`, and `DELETE`.

No `SELECT *` expansion ambiguity is allowed in joined write-query questions; when used for early reading, column order follows schema/table order and join table order.

#### Name resolution and aliases

- Unquoted identifiers are case-insensitive and normalized to lowercase.
- Double-quoted identifiers are case-sensitive; generated core questions avoid them.
- String literals use single quotes; embedded quote is doubled.
- Table aliases hide the original table name within that query block.
- Ambiguous unqualified column references are errors.
- Select-list aliases are visible to `ORDER BY` only, not `WHERE`, `ON`, `GROUP BY`, or `HAVING`.
- `ORDER BY` may use a select alias; positional `ORDER BY 1` is excluded.
- Correlated names resolve from innermost query block outward.

### Logical query-processing contract

Conceptual evaluation order is:

1. `FROM` and joins (`ON` during each join);
2. `WHERE`;
3. grouping and aggregate calculation;
4. `HAVING`;
5. select-list expression evaluation/projection;
6. `DISTINCT`;
7. `ORDER BY`;
8. `OFFSET`;
9. `LIMIT`.

This is a semantic learning model, not a claim about physical optimizer execution. A correct optimizer may reorder operations while preserving results.

### Bag, set, and order semantics

- Base tables have unique physical rows only if constraints/data happen to make them unique; query results are bags by default.
- Projection retains duplicates.
- `DISTINCT` removes duplicate result rows.
- `UNION`, `INTERSECT`, and `EXCEPT` use set semantics; `UNION ALL` retains multiplicity.
- For duplicate elimination/grouping/set operations, two `NULL`s compare as **not distinct** and therefore belong to the same duplicate/group class.
- Without `ORDER BY`, result row order is unspecified. Prediction answers are graded as unordered bags with multiplicity.
- With `ORDER BY`, the answer is an ordered sequence.
- A non-unique sort key does not define order among peers. If the prompt asks for the complete ordered sequence, it must include a deterministic tie-breaker; otherwise peer rows are graded as equivalence classes/permitted orders.
- `LIMIT/OFFSET` without deterministic ordering is rejected from generated result-prediction questions.

### `NULL` and three-valued logic

Truth values are `TRUE`, `FALSE`, and `UNKNOWN`.

Ordinary comparisons with `NULL`, including `NULL=NULL` and `NULL<>NULL`, yield `UNKNOWN`.

| p | q | p AND q | p OR q |
|---|---|---:|---:|
| T | T | T | T |
| T | F | F | T |
| T | U | U | T |
| F | T | F | T |
| F | F | F | F |
| F | U | F | U |
| U | T | U | T |
| U | F | F | U |
| U | U | U | U |

`NOT TRUE=FALSE`, `NOT FALSE=TRUE`, `NOT UNKNOWN=UNKNOWN`.

Context rules:

- `WHERE`, `ON`, and `HAVING` retain/match only `TRUE`; both `FALSE` and `UNKNOWN` fail.
- `CASE WHEN predicate` takes the branch only for `TRUE`.
- A `CHECK` constraint fails only on `FALSE`; `TRUE` and `UNKNOWN` pass. Use `NOT NULL` separately when absence is forbidden.
- `IS NULL`/`IS NOT NULL` always return Boolean.
- `IS NOT DISTINCT FROM` treats two `NULL`s as equal and one-null pairs as unequal; `IS DISTINCT FROM` is its negation.
- Evaluation order/short-circuiting of Boolean expressions is not promised. Queries that rely on short-circuiting to avoid an error are rejected.

### Predicate semantics

- `x BETWEEN a AND b` means `x>=a AND x<=b`, inclusive.
- `x IN (v1,...,vn)` is the three-valued disjunction of equalities.
- `x NOT IN (...)` is `NOT(x IN (...))`; a list/subquery containing `NULL` can make the result `UNKNOWN` when no equal non-null item is found.
- `EXISTS(subquery)` is `TRUE` iff the subquery returns at least one row; selected values, including `NULL`, do not matter.
- `x IN (subquery)` uses the subquery’s one column.
- `ANY`/`ALL` use three-valued quantified comparisons; generated instances display the rule before introduction.
- Empty-set rules: `comparison ANY(empty)=FALSE`, `comparison ALL(empty)=TRUE`, `EXISTS(empty)=FALSE`.

### Aggregate and grouping semantics

- `COUNT(*)` counts rows.
- `COUNT(expr)` counts rows where `expr IS NOT NULL`.
- `SUM`, `AVG`, `MIN`, and `MAX` ignore `NULL`.
- Over zero qualifying non-null values: `COUNT(expr)=0`; other supported aggregates return `NULL`.
- Without `GROUP BY`, an aggregate query forms one group, even over zero input rows.
- `GROUP BY` places all `NULL` keys into one group.
- Every selected nonaggregate expression must be structurally/group-function dependent on displayed group expressions under the strict v1 rule; core generation simply requires it to appear in `GROUP BY`.
- Nested aggregates in one query block are excluded.
- `WHERE` filters rows before grouping; `HAVING` filters groups after aggregation.

### Join semantics

- `CROSS JOIN` is Cartesian product.
- `INNER JOIN ... ON p` emits combined row pairs where `p=TRUE`.
- `LEFT JOIN` first forms matching pairs where `ON=TRUE`; if a left row has no matches, it emits one row with every right column padded `NULL`.
- A right row whose join key is `NULL` does not match a left `NULL` under `=`.
- A predicate in `ON` affects matching/padding; moving it to `WHERE` may remove padded rows and change results.
- `USING` and `NATURAL JOIN` are excluded initially to avoid hidden column merging.
- `RIGHT` and `FULL OUTER JOIN` are excluded initially; they may be simulated by table-role reversal/controlled set composition but are not syntax families.

### Constraint and transaction contract

- `PRIMARY KEY` is unique and non-null; composite primary keys require every component non-null.
- `UNIQUE` permits multiple rows with `NULL` in a constrained nullable column under PracticeSQL-1; non-null key tuples must be unique.
- `FOREIGN KEY` accepts a row when any referencing component is `NULL`; otherwise the referenced candidate-key row must exist.
- Delete/update actions are explicitly `RESTRICT`, `CASCADE`, or `SET NULL`.
- `CHECK` follows the three-valued rule above.
- Statement constraint checking is atomic: a failing statement changes no rows.
- Transactions are all-or-nothing. Generated schedules explicitly use the declared toy isolation model (`read_committed` or `snapshot_v1`).
- `snapshot_v1`: each transaction reads a snapshot as of its first read plus its own writes; concurrent conflicting writes to the same row make the later committer abort.

### Global answer conventions

Result tables are semantic values:

- column names/order must match the select list;
- row order is ignored unless ordered by contract;
- duplicate multiplicity always matters unless set/`DISTINCT`;
- `NULL` is entered/displayed as a special null token, not empty text, `0`, or the string `'NULL'`;
- exact numeric values compare exactly after decimal normalization;
- text is case-sensitive;
- Booleans display `TRUE/FALSE/UNKNOWN`;
- runtime/compile errors use a controlled error category, not vendor wording;
- unordered query solutions are graded by semantic execution, not string formatting;
- structured query-builder answers may vary in whitespace, capitalization, harmless parentheses, aliases, join order where equivalence is proved, and predicate order;
- free-form SQL is accepted only inside the supported grammar and is graded against the generated fixtures plus structural requirements when the prompt requires a construct.

### Difficulty philosophy

Difficulty should rise through:

- tracking multiplicity and unspecified order;
- three-valued logic and context;
- several join matches or missing matches;
- separating row filtering from group filtering;
- correlated subquery scope;
- constraints interacting with `NULL`;
- predicting state across a short transaction;
- choosing keys/decompositions/index prefixes from explicit workloads;
- translating among tables, SQL, relational operations, and results.

Difficulty must not rise through:

- large tables or long result sets;
- keyword trivia;
- vendor quirks outside the dialect;
- opaque business stories;
- dozens of columns;
- hand-sorting large data;
- formatting-sensitive grading;
- optimizer behavior not fixed by semantics;
- ambiguous unordered results;
- queries requiring a full production SQL engine.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | One table, projection/filter, direct key, or one aggregate |
| 2 | Two predicates, duplicates/order, simple join/group, or one constraint |
| 3 | `NULL` interaction, outer join, HAVING, subquery, or multirow mutation |
| 4 | Correlation, anti-join/null trap, transaction trace, normalization, or index prefix |
| 5 | Mixed query phases, equivalence/counterexample, bounded schema/workload synthesis |

### Generator and oracle model

Every instance stores:

`dialectVersion`, `schema`, `constraints`, `tableBags`, `queryAST`, `logicalPlan`, `transactionState`, `expectedColumns`, `expectedBagOrSequence`, `errorCategory`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedTrace`, `structuralSignature`, and `oracleVersion`.

Generation order:

1. choose a family and misconception;
2. construct a small schema/data fixture backward from a desired distinction;
3. build a typed SQL/relational AST;
4. execute with the local semantic evaluator;
5. cross-check with independent relational operators and build-time reference engines where semantics align;
6. generate distractors by one named semantic error;
7. reject ambiguity, excessive output, accidental query equivalence, or dialect mismatch;
8. render schema, tables, query, result controls, and trace.

The standalone app never connects to or embeds a writable real database. All tables are synthetic in-memory fixtures. A bundled read-only evaluator/interpreter runs locally; build-time validation may compare compatible cases against SQLite and PostgreSQL containers, but neither is required at runtime.

## 2. Category: Relations, schemas, keys, and table reading

### Category purpose

Build the relational vocabulary needed to reason about identity, allowed values, and relationships before executing SQL.

### Learn

A schema defines columns and constraints; an instance is the current rows. A key uniquely identifies rows. A foreign key references a candidate key in another table. Rows are not inherently ordered.

### Common misconceptions

- Treating row position as identity/order.
- Assuming any unique-looking sample column is a declared key.
- Calling a nonminimal superkey a candidate key.
- Requiring foreign-key values themselves to be unique.
- Confusing `NULL` with empty string or zero.

### Family `schema_row_column_read`

**Task.** Identify relation, row, column, type, or cell from a schema and fixture.

**Response and template.** Matching/value: `In {table}, what is {requested_object}?`

**Derivation.** Direct semantic lookup by stable row/column ID.

**Difficulty.** L1 one table; L2 several similarly named columns; L3 distinguish schema fact from current data.

**Examples.**

1. `users(id INTEGER,name TEXT)` → `name` has type TEXT. L1.
2. Row `(2,'Bo')`, column `name` → `'Bo'`. L2.
3. No current NULLs in `email` does not imply `email NOT NULL` without schema constraint. L3.

**Distractors and validation.** Row/column swap or infer constraint from data. Exact schema/instance lookup.

### Family `candidate_superkey`

**Task.** Classify attribute sets as candidate key, nonminimal superkey, or not a superkey under declared dependencies/data.

**Response and template.** Choice/multiple-choice: `Which attribute sets are candidate keys for {relation} given {FDs_or_constraints}?`

**Derivation.** Compute attribute closure; superkey closure contains all attributes; candidate key is minimal.

**Difficulty.** L1 declared unique; L2 composite; L3 closure/minimality.

**Examples.**

1. `id` declared primary key → `{id}` candidate. L1.
2. `(country,local_number)` unique, neither alone → composite candidate. L2.
3. If `A→B,B→C`, `{A}` key for `(A,B,C)`; `{A,B}` superkey but not candidate. L3.

**Distractors and validation.** Unique in sample only or nonminimal key. Exact closure/minimality.

### Family `primary_foreign_key_map`

**Task.** Identify referenced/referencing columns and relationship cardinality permitted by constraints.

**Response and template.** Matching/cardinality: `For FK {definition}, map child to parent and classify possible relationship.`

**Derivation.** Read constraint; uniqueness/nullability on referencing columns determines one/many/optional.

**Difficulty.** L1 simple FK; L2 nullable; L3 composite/unique child FK.

**Examples.**

1. `orders.customer_id→customers.id` → many orders may reference one customer. L1.
2. Nullable FK permits an order with no referenced customer. L2.
3. Unique non-null `profiles.user_id` FK → at most one profile per user and every profile has one user. L3.

**Distractors and validation.** Reverse arrow or claim FK unique. Constraint graph oracle.

### Family `key_constraint_validity`

**Task.** Decide whether proposed rows satisfy primary/unique/foreign constraints.

**Response and template.** Accept/reject with reason: `Can {row} be inserted into {schema_state}?`

**Derivation.** Type/null check, primary/unique tuple check, then foreign-key existence under dialect rules.

**Difficulty.** L1 duplicate primary; L2 nullable unique/FK; L3 composite constraint.

**Examples.**

1. Existing id 3; insert id 3 → reject primary-key duplicate. L1.
2. Nullable UNIQUE email already has NULL; another NULL → allowed in PracticeSQL-1. L2.
3. Composite FK `(shop_id,product_id)=(2,7)` absent in parent key → reject. L3.

**Distractors and validation.** Treat NULLs equal for UNIQUE or require FK unique. Constraint evaluator.

### Family `bag_set_order_distinction`

**Task.** State whether duplicates/order are semantically meaningful for a displayed table/query relation.

**Response and template.** Choice: `Which statement about {base_or_result} is guaranteed?`

**Derivation.** Inspect constraints and query clauses; base/result default is unordered bag.

**Difficulty.** L1 no order; L2 projection duplicates; L3 key projection/set operation.

**Examples.**

1. Table display order does not guarantee future query order. L1.
2. `SELECT city FROM users` may contain duplicate cities. L2.
3. `SELECT id FROM users` has no duplicates if id is key, but still no order. L3.

**Distractors and validation.** UI row order or “relations always sets” oversimplification. Semantic contract.

### Family `relational_operation_recognition`

**Task.** Match SQL fragments to selection, projection, join, grouping, or duplicate elimination.

**Response and template.** Matching: `Which relational operation is primarily performed by {clause}?`

**Derivation.** Typed query AST operator mapping.

**Difficulty.** L1 `WHERE`/select list; L2 join/distinct; L3 distinguish logical phase from physical execution.

**Examples.**

1. `WHERE active=TRUE` → selection/filter. L1.
2. `SELECT DISTINCT city` → projection plus duplicate elimination. L2.
3. Optimizer may implement selection later/earlier physically, but logical `WHERE` semantics remain selection. L3.

**Distractors and validation.** Keyword-name association to wrong phase. AST operator map.

### Family `relationship_junction_table`

**Task.** Recognize/complete a junction schema for many-to-many relationships.

**Response and template.** Schema choice: `Which schema correctly represents {relationship}?`

**Derivation.** Junction carries FKs to both parents and normally composite key/unique pair.

**Difficulty.** L1 identify; L2 add relationship attributes; L3 distinguish one-to-many alternative.

**Examples.**

1. Students↔courses → `enrollment(student_id,course_id)` with both FKs. L1.
2. Add `grade` to enrollment, not student/course. L2.
3. Composite PK prevents duplicate same student-course enrollment while allowing each side many rows. L3.

**Distractors and validation.** Repeating list column or one FK unique. Schema-constraint model.

### Cross-family progression

Schema/table reading precedes keys. Candidate-key minimality precedes primary/foreign mapping. Constraint validity and bag/order semantics are introduced before query execution. Junction tables prepare many-to-many join multiplication.

## 3. Category: SELECT expressions and filtering

### Category purpose

Build row-by-row evaluation of projection and predicates before `NULL` complicates the truth model.

### Learn

`FROM` supplies rows; `WHERE` keeps rows whose predicate is `TRUE`; the select list computes output columns. Projection does not remove duplicates unless `DISTINCT` appears.

### Common misconceptions

- Applying the select list before filtering.
- Treating selected aliases as visible in `WHERE`.
- Using output order from base-table display.
- Believing `BETWEEN` excludes endpoints.
- Treating `%`/`_` in `LIKE` as regex.
- Assuming Boolean precedence is left-to-right.

### Family `select_projection`

**Task.** Predict selected columns/expressions from one small table.

**Response and template.** Unordered result table: `{table}\n{query}\nWhat result bag is returned?`

**Derivation.** For every input row, evaluate select expressions in list order; retain multiplicity.

**Difficulty.** L1 columns; L2 arithmetic/concatenation; L3 aliases/CASE.

**Examples.**

1. rows `(id,name)=(1,'Ana'),(2,'Bo')`; `SELECT name` → `{'Ana','Bo'}`. L1.
2. prices 4,7; `SELECT price*2 AS doubled` → `{8,14}`. L2.
3. scores 40,75; `CASE WHEN score>=60 THEN 'pass' ELSE 'fail' END` → `{'fail','pass'}`. L3.

**Distractors and validation.** Include unselected columns or deduplicate. Typed AST evaluator.

### Family `where_comparison_filter`

**Task.** Predict rows retained by simple comparisons.

**Response and template.** Row selection/result: `Which rows survive WHERE {predicate}?`

**Derivation.** Evaluate predicate per row; retain only TRUE.

**Difficulty.** L1 one comparison; L2 conjunction/range; L3 arithmetic expression.

**Examples.**

1. ages 17,18,24; `age>=18` → 18,24. L1.
2. prices 5,10,15; `price>5 AND price<15` → 10. L2.
3. `(qty*price)>=20` on `(2,9),(4,5)` → only `(4,5)`. L3.

**Distractors and validation.** Include boundary wrongly or compare selected alias. Per-row trace.

### Family `boolean_precedence`

**Task.** Evaluate/filter with `NOT`, `AND`, `OR` precedence and parentheses.

**Response and template.** Truth/result rows: `Evaluate {predicate} for {rows}.`

**Derivation.** `NOT` binds strongest, then `AND`, then `OR`; parentheses override.

**Difficulty.** L1 direct; L2 mixed without parentheses; L3 contrast two parenthesizations.

**Examples.**

1. `TRUE OR FALSE AND FALSE` → TRUE. L1.
2. With `active=TRUE,admin=FALSE`, `NOT active OR admin` → FALSE. L2.
3. `a OR (b AND c)` differs from `(a OR b) AND c` at `a=T,b=F,c=F`. L3.

**Distractors and validation.** Strict left-to-right or `OR` before `AND`. AST truth evaluator.

### Family `between_in_filter`

**Task.** Predict results of `BETWEEN`, `IN`, and negated variants without NULL initially.

**Response and template.** Result bag: `Evaluate WHERE {predicate} on {values}.`

**Derivation.** Expand to inclusive comparisons/disjunction; apply NOT if present.

**Difficulty.** L1 BETWEEN; L2 IN; L3 NOT/combined.

**Examples.**

1. values 1,2,3; `x BETWEEN 1 AND 2` → 1,2. L1.
2. `x IN (1,3)` → 1,3. L2.
3. `x NOT BETWEEN 2 AND 4` on 1..5 → 1,5. L3.

**Distractors and validation.** Exclusive BETWEEN or range interpretation of IN. Predicate expansion oracle.

### Family `like_filter`

**Task.** Match text using `%`, `_`, and explicit escape.

**Response and template.** String set: `Which strings match {pattern} under binary collation?`

**Derivation.** Whole-string LIKE matcher over code points.

**Difficulty.** L1 prefix/suffix; L2 underscore/case; L3 escaped wildcard.

**Examples.**

1. `'Ada','Adam','Bo'` with `'Ada%'` → Ada,Adam. L1.
2. `'cat','coat','Cat'` with `'c_t'` → cat only. L2.
3. escape `!`; pattern `'10!%%' ESCAPE '!'` matches text beginning `10%`. L3.

**Distractors and validation.** Regex semantics, case folding, `_` many chars. Independent matcher/reference fixtures.

### Family `case_coalesce_expression`

**Task.** Predict `CASE`/`COALESCE` values for rows.

**Response and template.** Result column: `Evaluate {expression} for each row.`

**Derivation.** CASE tests in order and selects first TRUE; COALESCE returns first non-NULL.

**Difficulty.** L1 COALESCE; L2 searched CASE; L3 overlapping branches/order.

**Examples.**

1. `COALESCE(NULL,'x','y')` → `'x'`. L1.
2. score 85 with branches `>=90 A,>=60 P,ELSE F` → P. L2.
3. x=12 with `WHEN x>0 THEN 'positive' WHEN x>10 THEN 'large'` → positive (first TRUE). L3.

**Distractors and validation.** Last nonnull/most specific branch. Expression evaluator.

### Family `alias_scope_error`

**Task.** Decide whether a query is valid under alias/name-resolution rules and repair one scope error.

**Response and template.** Error/choice: `Is {query} valid in PracticeSQL-1?`

**Derivation.** Resolve names by phase/query block; detect ambiguity.

**Difficulty.** L1 ORDER BY alias valid; L2 WHERE alias invalid; L3 joined ambiguous column.

**Examples.**

1. `SELECT price*2 AS p FROM items ORDER BY p` → valid. L1.
2. same with `WHERE p>10` → invalid alias scope. L2.
3. `SELECT id FROM a JOIN b ON a.id=b.id` → ambiguous if both expose id. L3.

**Distractors and validation.** Vendor-permissive behavior. Static resolver.

### Family `write_single_table_filter`

**Task.** Construct a controlled SELECT/WHERE query for a precise requirement.

**Response and template.** Query builder: `From {schema}, return {columns} for rows satisfying {requirement}.`

**Derivation.** Execute learner AST against generated fixture suite; require projection and predicate semantics, not cosmetic syntax.

**Difficulty.** L1 one equality; L2 range/AND; L3 LIKE/OR with parentheses.

**Examples.**

1. names of active users → `SELECT name FROM users WHERE active=TRUE`. L1.
2. ids with score 60 through 80 inclusive → `WHERE score BETWEEN 60 AND 80`. L2.
3. names starting A or B and active → `WHERE active=TRUE AND (name LIKE 'A%' OR name LIKE 'B%')`. L3.

**Distractors and validation.** Generated hidden fixtures distinguish boundary/precedence errors; structural requirement plus semantic execution.

### Cross-family progression

Projection precedes filtering; comparisons precede Boolean combinations. BETWEEN/IN/LIKE follow ordinary comparisons. CASE/COALESCE begin scalar control. Alias-scope diagnostics and query construction consolidate before NULL logic.

## 4. Category: `NULL` and three-valued logic

### Category purpose

Build an exact mental model of unknown rather than treating `NULL` as a special ordinary value.

### Learn

Ordinary comparisons with `NULL` produce `UNKNOWN`. `WHERE` keeps only TRUE. Use `IS NULL`, not `=NULL`. `FALSE AND UNKNOWN` is FALSE; `TRUE OR UNKNOWN` is TRUE. Different SQL contexts treat UNKNOWN differently.

### Common misconceptions

- `NULL=NULL` is TRUE.
- `NULL<>5` is TRUE.
- UNKNOWN is the same as FALSE everywhere.
- `NOT UNKNOWN` is TRUE.
- `col=NULL` tests missing values.
- `NOT IN` is a safe anti-join when subquery may contain NULL.

### Family `null_comparison`

**Task.** Evaluate ordinary and null-safe comparisons.

**Response and template.** T/F/U: `Evaluate {comparison}.`

**Derivation.** Ordinary comparison with any NULL → UNKNOWN; `IS [NOT] DISTINCT FROM` uses null-safe table.

**Difficulty.** L1 equality; L2 inequalities; L3 null-safe contrast.

**Examples.**

1. `NULL=3` → UNKNOWN. L1.
2. `NULL=NULL` → UNKNOWN. L2.
3. `NULL IS NOT DISTINCT FROM NULL` → TRUE. L3.

**Distractors and validation.** Treat NULL as a value or false. Truth-table oracle.

### Family `three_valued_boolean`

**Task.** Evaluate AND/OR/NOT with UNKNOWN.

**Response and template.** T/F/U: `Evaluate {predicate} under {assignments}.`

**Derivation.** Apply normative 3VL tables and precedence.

**Difficulty.** L1 one operator; L2 nested; L3 equivalent/not-equivalent classical rewrites.

**Examples.**

1. `TRUE AND UNKNOWN` → UNKNOWN. L1.
2. `FALSE AND UNKNOWN` → FALSE. L2.
3. `UNKNOWN OR NOT UNKNOWN` → UNKNOWN, not classical TRUE. L3.

**Distractors and validation.** Collapse U to F or use excluded-middle. Exhaustive three-valued evaluator.

### Family `where_unknown_filter`

**Task.** Predict rows retained when predicates can be UNKNOWN.

**Response and template.** Result bag: `Which rows survive WHERE {predicate}?`

**Derivation.** Evaluate each predicate T/F/U; keep T only.

**Difficulty.** L1 nullable comparison; L2 AND/OR; L3 NOT predicate.

**Examples.**

1. ages `20,NULL`; `age>=18` → only 20. L1.
2. `(active=TRUE OR role='admin')`: a NULL active admin survives because OR TRUE. L2.
3. `NOT(score<60)` excludes score NULL because NOT UNKNOWN=UNKNOWN. L3.

**Distractors and validation.** Keep UNKNOWN or treat NOT U as T. Row truth trace.

### Family `is_null_predicate`

**Task.** Use/predict `IS NULL` and `IS NOT NULL`.

**Response and template.** Result/query choice: `Which predicate returns {desired_rows}?`

**Derivation.** Direct null-presence Boolean test.

**Difficulty.** L1 direct; L2 combine with other condition; L3 distinguish empty string/zero.

**Examples.**

1. `email IS NULL` selects missing email. L1.
2. `email IS NOT NULL AND active=TRUE` selects present active. L2.
3. Values `NULL,'' ,'NULL'`; `IS NULL` selects only actual NULL. L3.

**Distractors and validation.** `=NULL`, empty text, string NULL. Typed value oracle.

### Family `null_arithmetic_case`

**Task.** Predict null propagation through arithmetic, concatenation, CASE, and COALESCE.

**Response and template.** Value: `Evaluate {expression}.`

**Derivation.** Strict ordinary operators propagate NULL; CASE takes TRUE branch only; COALESCE selects first non-null.

**Difficulty.** L1 arithmetic; L2 concat/CASE; L3 nested COALESCE.

**Examples.**

1. `5+NULL` → NULL. L1.
2. `CASE WHEN NULL=0 THEN 'zero' ELSE 'other' END` → other. L2.
3. `COALESCE(NULL,2+NULL,7)` → 7. L3.

**Distractors and validation.** Treat NULL as zero/empty or CASE U as true. AST evaluator.

### Family `null_in_not_in`

**Task.** Evaluate IN/NOT IN with nullable operands/lists.

**Response and template.** T/F/U/result rows: `Evaluate {value} {IN_or_NOT_IN} ({list}).`

**Derivation.** IN is OR of equalities; a match yields TRUE, no match plus NULL yields UNKNOWN; NOT negates 3VL result.

**Difficulty.** L1 non-null list; L2 NULL plus match/no match; L3 nullable left.

**Examples.**

1. `2 IN (1,2,NULL)` → TRUE. L1.
2. `3 IN (1,2,NULL)` → UNKNOWN. L2.
3. `3 NOT IN (1,2,NULL)` → UNKNOWN, so WHERE rejects it. L3.

**Distractors and validation.** Ignore NULL or call no-match false before U. Disjunction expansion.

### Family `unknown_contexts`

**Task.** Predict how the same UNKNOWN predicate behaves in WHERE/ON/HAVING/CHECK/CASE.

**Response and template.** Matching: `Predicate {p} evaluates UNKNOWN. What happens in {context}?`

**Derivation.** Apply context rule.

**Difficulty.** L1 WHERE/CASE; L2 CHECK; L3 compare contexts.

**Examples.**

1. WHERE UNKNOWN → row removed. L1.
2. CHECK UNKNOWN → constraint passes. L2.
3. LEFT JOIN ON UNKNOWN → no match, then left row may be NULL-padded. L3.

**Distractors and validation.** Universal UNKNOWN=false or universal pass. Context evaluator.

### Family `repair_null_bug`

**Task.** Replace a null-incorrect predicate with a semantically correct one.

**Response and template.** Clause/query choice: `The intent is {intent}; repair {predicate}.`

**Derivation.** Map intent to IS NULL, IS DISTINCT FROM, COALESCE only when a replacement default is semantically declared, or NOT EXISTS.

**Difficulty.** L1 `=NULL`; L2 null-safe inequality; L3 NOT IN anti-join.

**Examples.**

1. missing email: `email=NULL` → `email IS NULL`. L1.
2. include values unequal to 5 including NULL → `x IS DISTINCT FROM 5`. L2.
3. ids absent from nullable child keys → correlated `NOT EXISTS`, not `NOT IN`. L3.

**Distractors and validation.** Cosmetic rewrite preserving bug. Hidden fixtures cover null/non-null cases.

### Cross-family progression

Comparison and Boolean truth tables precede row filtering. IS NULL and propagation follow. IN/NOT IN is withheld until ordinary IN is fluent. Context contrasts and bug repair consolidate; later joins/aggregates/subqueries reuse these semantics.

## 5. Category: Duplicates, ordering, and pagination

### Category purpose

Build correct bag/set/order reasoning and deterministic result prediction.

### Learn

SQL retains duplicate rows unless `DISTINCT` or a set operation removes them. `ORDER BY` is the only query-level ordering guarantee. Sort ties require another key for deterministic order. LIMIT selects after ordering.

### Common misconceptions

- Projection automatically deduplicates.
- Base insertion/display order is guaranteed.
- DISTINCT applies to one column independently of the rest of selected row.
- DESC reverses every key, not only the annotated one.
- LIMIT before ORDER BY.
- NULL placement is portable without explicit syntax.

### Family `projection_multiplicity`

**Task.** Predict duplicate multiplicities after projection.

**Response and template.** Unordered bag: `What bag does SELECT {columns} return?`

**Derivation.** Map every input row, retaining one output per row.

**Difficulty.** L1 one duplicate; L2 expression collapses rows; L3 key versus nonkey projection.

**Examples.**

1. cities A,A,B → `SELECT city` returns A twice, B once. L1.
2. x `1,−1,2`; `SELECT x*x` → 1 twice,4 once. L2.
3. selecting primary key cannot duplicate on valid table. L3.

**Distractors and validation.** Set semantics. Bag counter oracle.

### Family `distinct_result`

**Task.** Predict DISTINCT rows including NULL/combined columns.

**Response and template.** Unordered set-table: `What does SELECT DISTINCT {items} return?`

**Derivation.** Project, then collapse rows whose every column is not distinct.

**Difficulty.** L1 one column; L2 multiple columns; L3 repeated NULL.

**Examples.**

1. A,A,B → DISTINCT A,B. L1.
2. pairs `(A,1),(A,2),(A,1)` → `(A,1),(A,2)`. L2.
3. NULL,NULL,1 → NULL once and 1 once. L3.

**Distractors and validation.** Distinct first column only or retain NULL copies. Row-key canonicalizer.

### Family `order_by_single_multi`

**Task.** Predict ordered rows with one/multiple sort keys.

**Response and template.** Ordered table: `Execute {query_with_order}.`

**Derivation.** Stable semantic comparison by keys left-to-right; only use prior input order for implementation internally, never as tie guarantee.

**Difficulty.** L1 ASC; L2 DESC/secondary; L3 expression/alias key.

**Examples.**

1. values 3,1,2 ORDER BY x → 1,2,3. L1.
2. rows `(A,2),(B,1),(A,1)` ORDER BY letter ASC,n DESC → `(A,2),(A,1),(B,1)`. L2.
3. `SELECT x,-x AS k ... ORDER BY k` orders x descending. L3.

**Distractors and validation.** Sort every key same direction or lexical numeric. Comparator oracle.

### Family `null_ordering_explicit`

**Task.** Predict explicit NULL placement.

**Response and template.** Ordered sequence: `ORDER BY {col} {direction} NULLS {FIRST_or_LAST}.`

**Derivation.** Partition null/non-null per explicit placement; sort non-null by direction.

**Difficulty.** L1 ASC; L2 DESC; L3 secondary key among null peers.

**Examples.**

1. `2,NULL,1` ASC NULLS LAST → `1,2,NULL`. L1.
2. same DESC NULLS FIRST → `NULL,2,1`. L2.
3. ORDER BY score NULLS LAST,id ASC determines null peer order by id. L3.

**Distractors and validation.** Vendor default or reverse NULLS with DESC. Explicit comparator.

### Family `sort_tie_determinism`

**Task.** Decide whether order is fully determined or enumerate permitted peer orders.

**Response and template.** Yes/no/peer groups: `Does ORDER BY {keys} uniquely determine these result rows?`

**Derivation.** Compare projected rows’ sort-key tuples; unequal result rows sharing tuple are unordered peers.

**Difficulty.** L1 unique key; L2 tie; L3 hidden expression collision.

**Examples.**

1. ORDER BY primary key → deterministic. L1.
2. two different names share same age under ORDER BY age → their order unspecified. L2.
3. For x values 1,2,3,4, `ORDER BY CASE WHEN x<3 THEN 0 ELSE 1 END` leaves peer groups `{1,2}` and `{3,4}` internally unordered. L3.

**Distractors and validation.** Stable base display assumption. Key-tuple grouping.

### Family `limit_offset`

**Task.** Predict pagination after deterministic ordering.

**Response and template.** Ordered table: `Execute {ORDER_BY_LIMIT_OFFSET_query}.`

**Derivation.** Sort, discard OFFSET rows, take LIMIT rows.

**Difficulty.** L1 limit; L2 offset; L3 page boundary/multiple keys.

**Examples.**

1. sorted 1..5 LIMIT 2 → 1,2. L1.
2. LIMIT 2 OFFSET 2 → 3,4. L2.
3. Rows `(1,90),(2,90),(3,80),(4,70),(5,70)` ordered by score DESC,id ASC; OFFSET 1 LIMIT 3 → `(2,90),(3,80),(4,70)`. L3.

**Distractors and validation.** Limit before sort or one-based offset. Ordered evaluator.

### Cross-family progression

Bag projection precedes DISTINCT. Single-key sort precedes multiple keys and explicit NULL placement. Tie determinism is interleaved before LIMIT/OFFSET so pagination is never taught on unstable order.

## 6. Category: Joins and row multiplication

### Category purpose

Build precise pair matching, multiplicity, padding, and predicate-placement reasoning.

### Learn

A join considers row pairs. Inner join keeps pairs where `ON` is TRUE. A left join additionally emits one NULL-padded row for each unmatched left row. Duplicate matching keys multiply rows.

### Common misconceptions

- One input row can match at most one row.
- NULL keys match each other with `=`.
- LEFT JOIN always returns exactly the left row count.
- WHERE on right columns preserves unmatched left rows.
- Join cardinality follows relationship story rather than actual rows/constraints.
- Missing ON defaults to sensible key matching.

### Family `cross_join_result`

**Task.** Predict Cartesian-product rows/count.

**Response and template.** Bag/count: `Execute A CROSS JOIN B.`

**Derivation.** Emit every ordered pair; multiplicity product.

**Difficulty.** L1 count; L2 exact projected rows; L3 duplicates/projection collapse.

**Examples.**

1. A has 2 rows, B 3 → 6 joined rows. L1.
2. A `{1,2}`, B `{x,y}` → `(1,x),(1,y),(2,x),(2,y)`. L2.
3. Project constant from 2×3 cross join → six duplicate constants. L3.

**Distractors and validation.** Add row counts or zip rows. Nested-loop bag oracle.

### Family `inner_join_result`

**Task.** Predict inner equijoin result and multiplicity.

**Response and template.** Bag table: `{tables}\nSELECT ... FROM A JOIN B ON {predicate}.`

**Derivation.** Evaluate ON for each pair; emit TRUE pairs then project.

**Difficulty.** L1 one-to-one; L2 unmatched; L3 duplicate keys many-to-many.

**Examples.**

1. A ids 1,2; B ids 2,3 → match id2 only. L1.
2. Customers `{(1,'A')}` and orders `{(10,1),(11,1)}` → projecting customer name after join returns `'A'` twice. L2.
3. A has two key=1 rows, B three key=1 rows → six matches. L3.

**Distractors and validation.** One match per key or include unmatched. Pair evaluator.

### Family `join_null_keys`

**Task.** Predict join matches when keys contain NULL or use null-safe comparison.

**Response and template.** Bag: `Join {tables} ON {key_predicate}.`

**Derivation.** `NULL=NULL` under `=` is UNKNOWN and not a match; null-safe predicate can match.

**Difficulty.** L1 one NULL; L2 both NULL; L3 compare `=` with `IS NOT DISTINCT FROM`.

**Examples.**

1. A.k=NULL,B.k=NULL ON `A.k=B.k` → no pair. L1.
2. A NULL in LEFT JOIN → padded output row. L2.
3. ON `A.k IS NOT DISTINCT FROM B.k` → NULL pair matches. L3.

**Distractors and validation.** Treat null keys equal automatically. 3VL join oracle.

### Family `left_join_result`

**Task.** Predict matched and padded rows, including multiplicity.

**Response and template.** Bag table: `Execute {left_join_query}.`

**Derivation.** Emit TRUE matches; exactly one all-right-NULL padded row only when a left row has zero matches.

**Difficulty.** L1 unmatched; L2 multiple matches; L3 existing right row contains NULL versus padded row.

**Examples.**

1. left ids 1,2; right id2 → `(1,NULL),(2,right2)`. L1.
2. left id1 matches two right rows → two outputs, no padded third. L2.
3. matched right value NULL is observationally similar in projection but still a real match; include a right PK marker to distinguish. L3.

**Distractors and validation.** Pad every left once or left count exact. Outer-join construction oracle.

### Family `on_vs_where_outer_join`

**Task.** Compare right-side predicate in ON versus WHERE for a LEFT JOIN.

**Response and template.** Two result bags/claim: `Compare query A {ON_filter} and query B {WHERE_filter}.`

**Derivation.** ON limits matches then permits padding; WHERE filters the joined/padded rows afterward.

**Difficulty.** L1 unmatched row; L2 matching right row fails filter; L3 null-tolerant WHERE.

**Examples.**

1. `ON ... AND r.active=TRUE` retains unmatched left as padded. L1.
2. `ON ... WHERE r.active=TRUE` removes padded rows (UNKNOWN). L2.
3. `WHERE r.active=TRUE OR r.id IS NULL` preserves padded rows but has caveats if matched row’s id nullable (PK is nonnull in fixture). L3.

**Distractors and validation.** Clauses interchangeable. Phase trace.

### Family `self_join`

**Task.** Predict/construct a self join using aliases for parent/manager relationships or pairs.

**Response and template.** Result/query: `Join {table} to itself to return {relationship}.`

**Derivation.** Treat aliases as independent table instances; apply FK/pair predicate.

**Difficulty.** L1 employee-manager; L2 LEFT self join roots; L3 unordered pair suppression.

**Examples.**

1. employees `(1,A,NULL),(2,B,1)` → B joins manager A. L1.
2. LEFT self join includes A with manager NULL. L2.
3. pairs of distinct users once use `a.id<b.id`, yielding C(n,2). L3.

**Distractors and validation.** Alias name resolution or duplicate mirrored pairs. Alias-expanded evaluator.

### Family `many_to_many_join`

**Task.** Trace a parent–junction–parent join.

**Response and template.** Bag table: `Using {junction_schema_and_rows}, return {relationship_rows}.`

**Derivation.** Join junction to each parent by FKs; multiplicity follows junction rows/constraints.

**Difficulty.** L1 one bridge; L2 several rows; L3 filter one side/aggregate handoff.

**Examples.**

1. enrollment `(s1,c2)` → student1/course2 pair. L1.
2. student1 has three enrollment rows → three course rows. L2.
3. two students share course2 → course2 appears twice when projecting courses without DISTINCT. L3.

**Distractors and validation.** Direct unkeyed parent join or implicit dedup. Three-table evaluator.

### Family `join_cardinality_bounds`

**Task.** Determine exact/bounded join row count from constraints or small frequency tables.

**Response and template.** Count/range: `Given key frequencies/constraints, how many rows can/will the join return?`

**Derivation.** Inner equijoin count `Σ_k countA(k)countB(k)` for nonnull keys; outer adds unmatched left counts.

**Difficulty.** L1 PK/FK; L2 frequency multiplication; L3 bound under nullable/optional relation.

**Examples.**

1. 5 child rows each valid nonnull FK join parent PK → 5. L1.
2. A key counts `{x:2}`, B `{x:3}` → 6. L2.
3. LEFT JOIN adds each unmatched left row once, not per absent candidate. L3.

**Distractors and validation.** Min/max/add counts. Frequency formula and enumeration.

### Family `write_join_query`

**Task.** Construct a join query for a precise relationship.

**Response and template.** Structured SQL: `Return {columns} from {relationship}.`

**Derivation.** Parse and execute against hidden fixture suite; require intended join type/key/predicate placement.

**Difficulty.** L1 inner FK join; L2 LEFT optional relation; L3 junction/self join.

**Examples.**

1. order id and customer name → join `orders.customer_id=customers.id`. L1.
2. all customers including no orders → customers LEFT JOIN orders. L2.
3. student/course names → students→enrollment→courses. L3.

**Distractors and validation.** Wrong key/direction/join type. Counterexample fixtures distinguish semantics.

### Cross-family progression

CROSS JOIN makes pair formation explicit. Inner joins precede NULL keys and left padding. ON-versus-WHERE follows left joins immediately. Self/junction joins and cardinality build on multiplicity. Query construction comes last.

## 7. Category: Aggregation, grouping, and HAVING

### Category purpose

Build the distinction between input rows, non-null aggregate inputs, groups, and output rows.

### Learn

Aggregates summarize rows. `COUNT(*)` counts rows; `COUNT(x)` counts non-null x. `WHERE` removes rows before grouping; `HAVING` removes groups after aggregate calculation. A grouped query normally emits one row per surviving group.

### Common misconceptions

- COUNT(expr) counts NULL.
- SUM/AVG treat NULL as zero.
- AVG is sum divided by total rows.
- WHERE can use aggregate values.
- HAVING filters individual rows.
- Grouping by NULL creates one group per NULL.
- A LEFT JOIN count should use COUNT(*) for zero-child parents.

### Family `aggregate_single_group`

**Task.** Predict COUNT/SUM/AVG/MIN/MAX over one input bag.

**Response and template.** One result row: `Execute SELECT {aggregates} FROM {table} [WHERE ...].`

**Derivation.** Form one group after WHERE and apply null-ignoring rules.

**Difficulty.** L1 COUNT/SUM; L2 AVG/MIN/MAX; L3 several aggregates reveal differences.

**Examples.**

1. values 2,3,5 → COUNT(*) 3,SUM 10. L1.
2. 2,NULL,6 → AVG 4,COUNT(x) 2,COUNT(*) 3. L2.
3. no qualifying rows → COUNT(*) 0,SUM(x) NULL. L3.

**Distractors and validation.** Empty SUM zero or NULL as zero. Aggregate fold oracle.

### Family `count_star_expression_distinct`

**Task.** Compare `COUNT(*)`, `COUNT(expr)`, and `COUNT(DISTINCT expr)`.

**Response and template.** Named integers: `For {rows}, find the three counts.`

**Derivation.** Row count; nonnull expression count; distinct nonnull expression classes.

**Difficulty.** L1 no NULL; L2 NULL; L3 duplicates and computed expression.

**Examples.**

1. x `1,1,2` → 3,3,2. L1.
2. x `1,NULL,1` → 3,2,1. L2.
3. x `1,−1,NULL`; count distinct `x*x` → 1. L3.

**Distractors and validation.** COUNT(DISTINCT) includes NULL or dedups rows first. Bag-class oracle.

### Family `group_by_result`

**Task.** Predict one-row-per-group aggregate results.

**Response and template.** Unordered result table: `Execute {GROUP_BY_query}.`

**Derivation.** Partition filtered rows by not-distinct group keys; aggregate each partition.

**Difficulty.** L1 count by one key; L2 multiple aggregates; L3 NULL/composite key.

**Examples.**

1. depts A,A,B → counts `(A,2),(B,1)`. L1.
2. sales `(A,2),(A,5),(B,4)` → sums A7,B4. L2.
3. category NULL twice → one NULL group count2. L3.

**Distractors and validation.** One output per row or separate nulls. Partition oracle.

### Family `where_before_group`

**Task.** Predict effect of pre-group filtering.

**Response and template.** Result table: `Trace WHERE then GROUP BY in {query}.`

**Derivation.** Retain TRUE input rows, then partition/aggregate.

**Difficulty.** L1 direct filter; L2 removes a whole group; L3 nullable predicate.

**Examples.**

1. group sales but WHERE amount>0 excludes refunds before SUM. L1.
2. only B rows fail WHERE → no B output group. L2.
3. WHERE score>=60 excludes NULL scores before COUNT(*). L3.

**Distractors and validation.** Aggregate then filter or output zero group. Phase evaluator.

### Family `having_group_filter`

**Task.** Predict groups retained by HAVING or choose WHERE versus HAVING.

**Response and template.** Result/query choice: `Execute {GROUP_BY_HAVING_query}.`

**Derivation.** Build aggregate row per group, evaluate HAVING T/F/U, retain T.

**Difficulty.** L1 count threshold; L2 aggregate expression; L3 WHERE+HAVING contrast.

**Examples.**

1. `HAVING COUNT(*)>=2` keeps only groups with at least two rows. L1.
2. `HAVING AVG(score)>70` ignores null scores in AVG. L2.
3. `WHERE active` removes rows; `HAVING COUNT(*)>1` then removes small groups. L3.

**Distractors and validation.** Use WHERE aggregate or filter rows with group predicate. Phase trace.

### Family `grouping_validity`

**Task.** Determine whether a grouped SELECT is valid under strict grouping.

**Response and template.** Valid/error: `Is {query} valid?`

**Derivation.** Every selected nonaggregate core expression must appear in GROUP BY; aggregates may reference group rows.

**Difficulty.** L1 obvious; L2 expression/alias; L3 joined columns.

**Examples.**

1. `SELECT dept,COUNT(*) ... GROUP BY dept` valid. L1.
2. `SELECT dept,name,COUNT(*) GROUP BY dept` invalid. L2.
3. `SELECT price*2 AS p,COUNT(*) FROM items GROUP BY p` is invalid in v1; use `GROUP BY price*2`. L3.

**Distractors and validation.** SQLite-style arbitrary bare column. Static group checker.

### Family `outer_join_zero_count`

**Task.** Count child rows per parent while retaining zero-child parents.

**Response and template.** Result table: `Predict {LEFT_JOIN_GROUP_query}.`

**Derivation.** LEFT JOIN creates one padded row; `COUNT(child.nonnull_key)` yields zero while COUNT(*) yields one.

**Difficulty.** L1 one missing child; L2 several; L3 ON filter versus WHERE.

**Examples.**

1. parent A no child → COUNT(child.id)=0. L1.
2. A two children,B none → `(A,2),(B,0)`. L2.
3. Parent A has only an inactive child: predicate `child.active=TRUE` in ON yields `(A,0)` with `COUNT(child.id)`; in WHERE it removes A. L3.

**Distractors and validation.** COUNT(*) or inner join. Join-then-group oracle.

### Family `write_aggregate_query`

**Task.** Construct grouped query for a precise summary.

**Response and template.** Structured SQL: `Return {summary_requirement}.`

**Derivation.** Execute against hidden fixtures; require grouping/filter phase semantically.

**Difficulty.** L1 count by key; L2 HAVING; L3 LEFT zero count.

**Examples.**

1. total amount per customer → GROUP BY customer_id,SUM(amount). L1.
2. only customers with at least 3 orders → HAVING COUNT(*)>=3. L2.
3. all customers and active-order count → LEFT JOIN with active in ON, COUNT(order.id). L3.

**Distractors and validation.** WHERE aggregate or COUNT*. Hidden fixtures include NULL/zero/multiple cases.

### Cross-family progression

Single-group aggregates precede count variants and GROUP BY. WHERE-before-group precedes HAVING. Strict validity is interleaved. LEFT-zero counting combines joins only after both prerequisites; query writing comes last.

## 8. Category: Subqueries and set operations

### Category purpose

Build nested-scope, existence, quantified-comparison, and set-versus-bag reasoning.

### Learn

A scalar subquery must return one column and at most one row. `EXISTS` asks whether any row exists, ignoring selected values. Correlated subqueries run semantically per outer row. Set operations align columns by position.

### Common misconceptions

- EXISTS cares whether selected value is non-null.
- A correlated subquery is evaluated once globally.
- NOT IN equals NOT EXISTS with nullable data.
- Scalar subquery may return many rows.
- UNION ALL removes duplicates.
- Set operations match columns by name instead of position.

### Family `scalar_subquery`

**Task.** Predict/validate a scalar subquery used in expression/comparison.

**Response and template.** Value/result/error: `Execute {query_with_scalar_subquery}.`

**Derivation.** Evaluate subquery: zero rows→NULL, one row→cell value, more than one→cardinality error.

**Difficulty.** L1 one aggregate row; L2 zero row; L3 multirow error.

**Examples.**

1. `price>(SELECT AVG(price) FROM items)` uses one aggregate row. L1.
2. `5=(SELECT x FROM t WHERE FALSE)` → scalar subquery NULL, comparison UNKNOWN. L2.
3. With t.x rows 1,2, `5=(SELECT x FROM t)` → runtime cardinality error. L3.

**Distractors and validation.** First row chosen or zero→0. Query-block evaluator.

### Family `exists_subquery`

**Task.** Predict EXISTS/NOT EXISTS.

**Response and template.** Boolean/result rows: `Evaluate {EXISTS_predicate}.`

**Derivation.** TRUE iff subquery result has at least one row before projection value interpretation.

**Difficulty.** L1 uncorrelated; L2 selected NULL; L3 NOT EXISTS.

**Examples.**

1. subquery returns one row → EXISTS TRUE. L1.
2. A one-row table has `x=NULL`; `EXISTS(SELECT x FROM one_row)` → TRUE. L2.
3. no child rows → NOT EXISTS child query TRUE. L3.

**Distractors and validation.** Inspect selected NULL/zero. Cardinality oracle.

### Family `correlated_exists`

**Task.** Predict rows selected by correlated EXISTS.

**Response and template.** Outer row bag: `Execute {outer_query_with_correlated_exists}.`

**Derivation.** For each outer row, bind correlation variables, execute inner block, test existence.

**Difficulty.** L1 parent has child; L2 additional inner filter; L3 alias shadow/scope.

**Examples.**

1. Customers ids 1,2 and one order for customer 2: correlated EXISTS selects id 2. L1.
2. Orders `(customer_id,amount)=(1,50),(2,120)`; correlated EXISTS with amount>100 selects customer 2. L2.
3. inner alias hides same-named table; qualification preserves outer reference. L3.

**Distractors and validation.** Global any-order test or join multiplicity. Per-outer-row trace.

### Family `in_subquery`

**Task.** Predict IN/NOT IN results from a one-column subquery including NULL.

**Response and template.** T/F/U/result bag: `Evaluate {value} IN ({subquery_result}).`

**Derivation.** Apply 3VL IN semantics to result bag values; duplicates do not affect truth.

**Difficulty.** L1 match; L2 no match; L3 NULL trap.

**Examples.**

1. `2 IN {1,2,2}` → TRUE. L1.
2. `3 IN {1,2}` → FALSE. L2.
3. `3 NOT IN {1,2,NULL}` → UNKNOWN. L3.

**Distractors and validation.** NULL ignored or duplicates change answer. Predicate oracle.

### Family `any_all_quantifier`

**Task.** Evaluate a bounded comparison with ANY/ALL, including empty/null sets.

**Response and template.** T/F/U: `Evaluate {x} {op} {ANY_or_ALL} ({values}).`

**Derivation.** ANY is 3VL OR; ALL is 3VL AND across comparisons; apply empty identities.

**Difficulty.** L1 ordinary set; L2 empty; L3 NULL mixture.

**Examples.**

1. `5>ANY(2,7)` → TRUE. L1.
2. `5>ALL(empty)` → TRUE. L2.
3. `5>ALL(2,NULL)` → UNKNOWN. L3.

**Distractors and validation.** Compare only min/max without null/empty care. Quantified fold oracle.

### Family `union_all_union`

**Task.** Predict multiplicity under UNION ALL versus UNION.

**Response and template.** Bag/set table: `Combine {left_result} {operator} {right_result}.`

**Derivation.** ALL concatenates bags; UNION collapses not-distinct rows.

**Difficulty.** L1 disjoint; L2 duplicates; L3 NULL/multicolumn.

**Examples.**

1. `{1,2} UNION ALL {2,3}` → `1,2,2,3`. L1.
2. UNION → `1,2,3`. L2.
3. NULL in both under UNION → one NULL. L3.

**Distractors and validation.** Reverse ALL behavior. Bag/set counter.

### Family `intersect_except`

**Task.** Predict INTERSECT/EXCEPT set results.

**Response and template.** Unordered set: `{left} {INTERSECT_or_EXCEPT} {right}.`

**Derivation.** Convert each input to not-distinct set; intersection/difference.

**Difficulty.** L1 ordinary; L2 duplicates; L3 NULL/multi-column.

**Examples.**

1. `{1,2,3} INTERSECT {2,3,4}` → `{2,3}`. L1.
2. `{1,1,2} EXCEPT {2}` → `{1}`. L2.
3. `{NULL,1} EXCEPT {NULL}` → `{1}`. L3.

**Distractors and validation.** Bag subtraction multiplicity. Canonical row set.

### Family `set_operation_validity`

**Task.** Check compatible column count/types and result column naming/order.

**Response and template.** Valid/error/matching: `Is {compound_query} valid, and what are output columns?`

**Derivation.** Arms need same column count and compatible types by position; names from first arm.

**Difficulty.** L1 count; L2 type; L3 names/order.

**Examples.**

1. one INTEGER column UNION one INTEGER → valid. L1.
2. two columns UNION one → error. L2.
3. `SELECT id AS a,name AS b UNION SELECT id AS x,name AS y` → output names a,b. L3.

**Distractors and validation.** Match by name/reorder automatically. Static type/schema checker.

### Cross-family progression

Scalar and EXISTS semantics precede correlation. IN follows earlier NULL logic; ANY/ALL follows IN. UNION ALL versus UNION precedes INTERSECT/EXCEPT. Validity questions are interleaved before query construction in later mixed practice.

## 9. Category: Data changes, constraints, and transactions

### Category purpose

Build safe prediction of state changes and declarative integrity without touching a real database.

### Learn

INSERT adds rows, UPDATE changes every qualifying row, and DELETE removes every qualifying row. Constraints validate the resulting statement atomically. Transactions group statements into all-or-nothing units and define which committed state each read can see.

### Common misconceptions

- UPDATE/DELETE affects one row by default.
- SET expressions see earlier assignments from same SET list.
- CHECK rejects UNKNOWN.
- Foreign-key NULL must reference a row.
- A failing multirow statement keeps successful rows.
- Uncommitted writes are visible to other transactions.

### Family `insert_defaults_constraints`

**Task.** Predict inserted row or constraint failure with defaults/nulls.

**Response and template.** New row/error: `Execute INSERT {statement} on {schema_state}.`

**Derivation.** Map named columns, fill defaults then nullable NULLs, enforce types/constraints atomically.

**Difficulty.** L1 explicit values; L2 omitted/default; L3 one constraint failure.

**Examples.**

1. insert `(id=3,name='Cy')` → row added. L1.
2. omitted `active DEFAULT TRUE` → stored TRUE. L2.
3. omitted NOT NULL name with no default → reject, no row. L3.

**Distractors and validation.** Empty string for omitted or partial insert. State-transition/constraint oracle.

### Family `update_result`

**Task.** Predict rows/values changed by UPDATE.

**Response and template.** Final table/count: `Execute UPDATE {table} SET {assignments} WHERE {predicate}.`

**Derivation.** Select TRUE rows from pre-statement snapshot; evaluate all SET RHS from each old row; validate final table.

**Difficulty.** L1 one row; L2 several/expression; L3 simultaneous assignments.

**Examples.**

1. balances 5,8 WHERE id=1 SET balance=6 → one row. L1.
2. `SET price=price*2 WHERE category='A'` changes every A row. L2.
3. `SET a=b,b=a` swaps old values under v1 simultaneous semantics. L3.

**Distractors and validation.** First matching row only/sequential SET. State diff.

### Family `delete_result`

**Task.** Predict deleted rows and referential action.

**Response and template.** Final tables/error: `Execute DELETE ... WHERE ... under {FK_action}.`

**Derivation.** Identify TRUE target rows, apply RESTRICT/CASCADE/SET NULL recursively within bounded graph, validate atomically.

**Difficulty.** L1 no FK; L2 restrict; L3 cascade/set null.

**Examples.**

1. delete WHERE inactive TRUE removes all inactive rows. L1.
2. parent with child under RESTRICT → statement fails. L2.
3. parent delete under CASCADE removes its two child rows. L3.

**Distractors and validation.** Delete one/leave orphans. Referential transition oracle.

### Family `check_not_null_unique`

**Task.** Decide constraint outcome, especially UNKNOWN.

**Response and template.** Accept/reject: `Does row {row} satisfy {constraints}?`

**Derivation.** NOT NULL direct; CHECK rejects only FALSE; UNIQUE compares nonnull tuples.

**Difficulty.** L1 NOT NULL; L2 CHECK; L3 nullable UNIQUE/composite.

**Examples.**

1. age NULL under `CHECK(age>=0)` alone → passes UNKNOWN. L1.
2. add `age NOT NULL` → rejects. L2.
3. nullable unique code permits multiple NULLs but rejects duplicate `'A'`. L3.

**Distractors and validation.** CHECK implies NOT NULL. Constraint evaluator.

### Family `foreign_key_action`

**Task.** Predict FK acceptance and update/delete actions.

**Response and template.** Accept/final state: `{parent_child_state}; perform {mutation}.`

**Derivation.** Validate nonnull reference or apply declared action.

**Difficulty.** L1 insert reference; L2 nullable; L3 cascade/set null.

**Examples.**

1. child parent_id=9 absent → reject. L1.
2. parent_id=NULL on nullable FK → allowed. L2.
3. parent id changes 2→5 under ON UPDATE CASCADE → child references become 5. L3.

**Distractors and validation.** Auto-create parent or reject NULL. Constraint graph transition.

### Family `statement_atomicity`

**Task.** Predict state after a multirow statement where one resulting row violates a constraint.

**Response and template.** Final state/error: `Execute {statement}; one affected row would {violation}.`

**Derivation.** Compute tentative full statement, validate; on failure restore pre-statement state.

**Difficulty.** L1 multirow insert; L2 update; L3 cascade chain.

**Examples.**

1. insert two rows, second duplicate PK → neither inserted. L1.
2. update all codes to same UNIQUE value → statement fails, none changed. L2.
3. cascading action ends in NOT NULL violation → entire statement rolls back. L3.

**Distractors and validation.** Keep prefix of successful rows. Snapshot/state equality.

### Family `transaction_commit_rollback`

**Task.** Trace own writes, COMMIT, and ROLLBACK in one transaction.

**Response and template.** State/read values: `Trace {transaction_steps}.`

**Derivation.** Apply writes to transaction-local state; COMMIT publishes; ROLLBACK discards.

**Difficulty.** L1 rollback; L2 read-own-write; L3 statement error then explicit transaction policy shown.

**Examples.**

1. update 5→7 then ROLLBACK → committed 5. L1.
2. transaction reads 7 after its own update before COMMIT. L2.
3. two successful statements then ROLLBACK → neither persists. L3.

**Distractors and validation.** Immediate global writes. Versioned state machine.

### Family `isolation_schedule`

**Task.** Predict reads/commit outcome in short read-committed or snapshot_v1 schedule.

**Response and template.** Ordered values/outcome: `Under {isolation}, trace T1/T2 schedule {steps}.`

**Derivation.** Apply declared visibility/snapshot/conflict rules exactly.

**Difficulty.** L1 read committed after commit; L2 snapshot repeat read; L3 write conflict abort.

**Examples.**

1. read_committed: T1 reads 5; T2 commits 7; T1 next statement reads 7. L1.
2. snapshot_v1: same schedule, T1 reads 5 again. L2.
3. both snapshot transactions update same row; first commits, later conflicting committer aborts. L3.

**Distractors and validation.** Dirty reads or mixed isolation folklore. MVCC toy simulator.

### Cross-family progression

INSERT/UPDATE/DELETE start with isolated state. Constraint semantics follow, then statement atomicity. Single-transaction commit/rollback precedes two-transaction isolation. Every mutation remains synthetic and recoverable in-memory.

## 10. Category: Relational design and normalization

### Category purpose

Build schema reasoning from dependencies and anomalies rather than memorized normal-form slogans.

### Learn

Functional dependency `X→Y` means equal X values require equal Y values. Normalization separates facts so each fact is stored once while preserving dependencies/joins. A decomposition must not invent or lose rows when rejoined.

### Common misconceptions

- A dependency is inferred from one small sample.
- Every determinant is a key.
- 1NF means “no NULL.”
- Any decomposition is lossless.
- A foreign key automatically removes update anomalies.
- Surrogate keys alone make a design normalized.

### Family `functional_dependency_check`

**Task.** Determine whether displayed data violates a proposed FD or provide violating pair.

**Response and template.** Yes/no/row pair: `Does instance {rows} satisfy X→Y?`

**Derivation.** Group rows by X; Y must be constant within each group (core nonnull fixtures).

**Difficulty.** L1 one determinant; L2 composite; L3 distinguish satisfaction in instance from schema guarantee.

**Examples.**

1. `(A,1),(A,1),(B,2)` satisfies X→Y. L1.
2. `(A,1),(A,2)` violates; those rows witness. L2.
3. Current satisfaction does not prove business-rule FD. L3.

**Distractors and validation.** Reverse FD or unique Y. Pair enumerator.

### Family `attribute_closure`

**Task.** Compute attribute closure and determine superkey.

**Response and template.** Attribute set: `Given FDs {fds}, find {X}+ and say whether X is a superkey.`

**Derivation.** Repeatedly add RHS whose LHS subset of closure until fixed point.

**Difficulty.** L1 one dependency; L2 chain; L3 composite LHS/extraneous start.

**Examples.**

1. A→B on (A,B,C): A+={A,B}, not key. L1.
2. A→B,B→C → A+={A,B,C}, key. L2.
3. AB→C,C→D on (A,B,C,D): AB+=all; A alone not. L3.

**Distractors and validation.** One pass only or reverse dependencies. Fixed-point oracle.

### Family `anomaly_identification`

**Task.** Identify update/insert/delete anomaly in a redundant relation.

**Response and template.** Choice: `{table_and_dependency}; what anomaly occurs in {operation}?`

**Derivation.** Compare logical fact multiplicity and operation consequence.

**Difficulty.** L1 update duplicate; L2 insert; L3 delete last occurrence.

**Examples.**

1. Department phone repeated per employee; phone change needs many rows → update anomaly. L1.
2. Cannot store department before first employee → insert anomaly. L2.
3. Deleting last employee loses department phone → delete anomaly. L3.

**Distractors and validation.** Query performance/security labels. Authored dependency scenario.

### Family `normal_form_classify`

**Task.** Classify bounded relation as 1NF/2NF/3NF/BCNF or identify violating dependency.

**Response and template.** Choice/FD: `Given keys and FDs, what highest normal form is guaranteed?`

**Derivation.** Apply versioned definitions: atomic attributes; no partial nonprime dependency for 2NF; no transitive nonprime dependency under 3NF criterion; every nontrivial determinant superkey for BCNF.

**Difficulty.** L1 partial dependency; L2 transitive; L3 3NF-but-not-BCNF case.

**Examples.**

1. key AB and A→C nonprime → violates 2NF. L1.
2. key A, A→B,B→C nonprime C → violates 3NF. L2.
3. keys AB,BC and C→A: 3NF (A prime) but C not superkey, so not BCNF. L3.

**Distractors and validation.** Surrogate-key shortcut. Candidate-key/FD oracle.

### Family `decompose_schema`

**Task.** Choose/complete a decomposition removing a named dependency anomaly.

**Response and template.** Relation sets/keys: `Decompose R{attrs} using {dependency}.`

**Derivation.** Standard binary decomposition `R1=X∪Y`, `R2=R−(Y−X)` for declared case; mark keys/FKs.

**Difficulty.** L1 transitive split; L2 composite partial; L3 BCNF step.

**Examples.**

1. Employee(emp,dept,dept_phone), dept→phone → Dept(dept,phone)+Employee(emp,dept). L1.
2. Enrollment(student,course,student_name), student→name → Student+Enrollment. L2.
3. R(A,B,C), B→C → R1(B,C),R2(A,B). L3.

**Distractors and validation.** Drop determinant or duplicate same redundancy. Dependency/projection check.

### Family `lossless_join_check`

**Task.** Determine whether a binary decomposition is lossless or demonstrate spurious rows.

**Response and template.** Yes/no/result: `Is decomposition R1,R2 lossless under {FDs}?`

**Derivation.** For binary decomposition, intersection functionally determines R1 or R2; fixture variant executes natural equijoin on shared attributes.

**Difficulty.** L1 key intersection; L2 lossy counterexample; L3 FD closure proof.

**Examples.**

1. R(A,B,C)→AB and BC with B→C: B determines BC, lossless. L1.
2. `AB={(a1,b),(a2,b)}` and `BC={(b,c1),(b,c2)}` rejoin to four A-C combinations, possibly adding two spurious rows. L2.
3. Compute `(R1∩R2)+` to test containment. L3.

**Distractors and validation.** Shared column alone guarantees lossless. Chase/binary criterion plus fixture join.

### Family `schema_relationship_design`

**Task.** Choose a normalized schema for one-to-many/many-to-many/optional attributes.

**Response and template.** Schema choice: `Which design represents {requirements} without repeating groups?`

**Derivation.** Map entities/relationships, place FK on many side, junction for many-to-many, constraints for cardinality.

**Difficulty.** L1 one-to-many; L2 many-to-many attributes; L3 optional one-to-one.

**Examples.**

1. Customer has many orders → customer_id FK in orders. L1.
2. Students/courses with enrollment_date → junction carries date. L2.
3. Optional at-most-one profile → profile.user_id UNIQUE FK or nullable unique FK per declared ownership. L3.

**Distractors and validation.** Comma-separated IDs or unique many-side FK. Schema requirement solver.

### Cross-family progression

FD instance checks precede closure. Anomalies give motivation before normal-form classification. Decomposition follows violations; lossless checking follows decomposition. Relationship design reuses keys/FKs/junctions from the first category.

## 11. Category: Indexes and bounded query planning

### Category purpose

Build practical reasoning about access paths without teaching optimizer folklore as certainty.

### Learn

An index is an additional ordered structure. A composite B-tree is ordered by its leading columns. An index can reduce examined rows, but writes maintain it and low-selectivity predicates may not benefit. Plans are chosen from an explicitly supplied toy cost model.

### Common misconceptions

- An index changes query result/order without ORDER BY.
- Any indexed column guarantees index use.
- Composite index works equally for any contained column.
- More indexes are always better.
- Foreign keys are automatically indexed in every DBMS.
- EXPLAIN cost is runtime in universal units.

### Family `btree_prefix_usability`

**Task.** Decide which predicates/orderings can use a composite B-tree prefix.

**Response and template.** Multiple-choice: `Index on ({cols}); which query access/order requirements can use its ordered prefix?`

**Derivation.** Equality can consume leading keys; first range stops later search-key narrowing under v1; order compatibility follows remaining key order.

**Difficulty.** L1 leading key; L2 equality then range; L3 missing leading key/order.

**Examples.**

1. index `(a,b)`, predicate `a=3` → usable prefix. L1.
2. `a=3 AND b>5` → equality a then range b. L2.
3. predicate `b=5` alone → no ordered prefix search in v1. L3.

**Distractors and validation.** Any indexed column usable identically. Prefix-rule engine.

### Family `index_lookup_trace`

**Task.** Trace qualifying index entries and optional table lookups in a tiny sorted index.

**Response and template.** Entry/row set: `Using displayed index {entries}, find entries examined/rows fetched for {predicate}.`

**Derivation.** Binary-search conceptual start, scan bounded range, fetch row IDs unless covered.

**Difficulty.** L1 equality; L2 range; L3 composite prefix and residual filter.

**Examples.**

1. index keys 1,3,3,8; key=3 → two entries. L1.
2. key>=3 AND key<8 → two 3 entries. L2.
3. Index `(a,b)` entries `(1,9),(2,4),(2,8),(3,4)`; query `a>=2 AND b=4` examines three range entries and returns two. L3.

**Distractors and validation.** One entry per key or result count=examined. Exact sorted-entry simulator.

### Family `covering_index`

**Task.** Decide whether an index covers selected/predicate columns under a declared entry schema.

**Response and template.** Yes/no: `Can {query} be answered from index ({keys}) INCLUDE ({included}) without table lookup?`

**Derivation.** Every needed column must be present in index entry; visibility/storage caveats excluded by toy model.

**Difficulty.** L1 selected key; L2 included column; L3 one missing residual/projected column.

**Examples.**

1. index `(email,id)`, select id WHERE email=... → covered. L1.
2. index `(dept) INCLUDE(name)`, select name by dept → covered. L2.
3. select salary too → not covered. L3.

**Distractors and validation.** Predicate columns only or PK magically included unless shown. Column-set oracle.

### Family `selectivity_plan_choice`

**Task.** Choose scan versus index lookup from supplied exact toy costs.

**Response and template.** Plan/cost: `Given table pages={P}, matches={m}, costs {model}, choose lower-cost plan.`

**Derivation.** Evaluate displayed formulas, no hidden optimizer assumptions.

**Difficulty.** L1 direct; L2 lookup per match; L3 covering versus noncovering.

**Examples.**

1. full scan 100, index fixed 4 + 2 lookups → 6, choose index. L1.
2. 80 lookups at cost2 plus fixed4 →164, choose scan100. L2.
3. covering index cost10 versus noncovering70/full100 → covering. L3.

**Distractors and validation.** “Index always” or compare rows not costs. Exact arithmetic.

### Family `index_write_tradeoff`

**Task.** Select useful indexes for a displayed read/write workload and identify maintenance cost.

**Response and template.** Multiple-choice: `Given workload {queries,writes}, which index is justified under {costs}?`

**Derivation.** Sum supplied query savings and per-write maintenance; respect redundancy/prefix.

**Difficulty.** L1 one read; L2 writes; L3 redundant composite/single index.

**Examples.**

1. frequent email equality, rare writes → email index useful. L1.
2. never-filtered low-cardinality flag with heavy writes and negative supplied benefit → no index. L2.
3. `(a,b)` may make separate `(a)` redundant for shown workload, but not `(b)`. L3.

**Distractors and validation.** Index every column. Workload-cost calculator.

### Family `plan_semantics_distinction`

**Task.** Distinguish logical query result from physical plan/order claims.

**Response and template.** Claim choice: `Which statement is guaranteed by {query_and_plan}?`

**Derivation.** Query semantics determine result; plan affects method/cost; output order only ORDER BY.

**Difficulty.** L1 plan same result; L2 index scan order; L3 optimizer rewrite equivalence.

**Examples.**

1. Full scan and index scan must return same bag for same correct query. L1.
2. Index scan does not guarantee output order without ORDER BY. L2.
3. Pushing an inner-join filter may preserve result, but outer-join predicate moves require semantic proof. L3.

**Distractors and validation.** Physical order/cost as semantic difference. Relational equivalence checker.

### Cross-family progression

Prefix usability precedes entry traces and covering. Cost-based choices use supplied formulas only. Workload tradeoffs follow individual plans. Logical-versus-physical distinction is interleaved so index practice never changes SQL result semantics.

## 12. Topic-wide progression

Recommended order:

1. schemas, rows/columns, keys, foreign keys, and bag/order meaning;
2. one-table projection, expressions, comparisons, and filtering;
3. full `NULL`/three-valued logic and context rules;
4. duplicates, DISTINCT, deterministic sorting, and pagination;
5. cross/inner joins, multiplicity, NULL keys, and LEFT JOIN;
6. aggregates, grouping, WHERE/HAVING, and zero-child counts;
7. scalar/EXISTS/IN subqueries and set operations;
8. writes, constraints, statement atomicity, and transactions;
9. functional dependencies, normalization, decomposition, and losslessness;
10. indexes, access traces, covering, and supplied-cost planning;
11. mixed queries combining at most three mastered phases.

Prerequisite gates:

- bags/order and schema typing gate query prediction;
- ordinary predicates gate three-valued logic;
- three-valued logic gates outer joins, nullable aggregates, and subqueries;
- pair multiplication gates all joins;
- joins and count semantics gate grouped outer joins;
- scope/aliases gate correlated subqueries;
- key/FK rules gate mutations and normalization;
- query semantics gate plan-versus-result reasoning.

Interleave:

- result prediction with query construction;
- query phase with “why this row disappeared/duplicated” diagnosis;
- non-null and nullable versions of the same predicate/join/aggregate;
- bag and set variants;
- inner and outer versions of the same relationship;
- WHERE and HAVING; ON and WHERE;
- NOT IN and NOT EXISTS;
- logical result and physical access path.

Mixed items should display at most 8 input rows per table, 3 tables, 8 result rows, and 3 essential semantic phases. Longer workflows become stepwise traces with partial credit.

## 13. Adaptive practice guidance

Track:

`family`, `queryPhase`, `operator`, `valueType`, `nullPresence`, `truthValue`, `bagMultiplicity`, `orderingContract`, `joinType`, `matchCardinality`, `aggregate`, `groupKey`, `subqueryCorrelation`, `constraintType`, `transactionModel`, `normalForm`, `indexPrefix`, and `misconception`.

| Error pattern | Diagnosis | Follow-up |
|---|---|---|
| silently deduplicates projection | set model applied to bag | projection multiplicity before DISTINCT |
| preserves displayed base order | order assumed | unordered bag control then ORDER BY |
| uses alias in WHERE | phase/scope confusion | logical-order name-resolution item |
| `BETWEEN` endpoints omitted | range semantics | boundary fixture |
| NULL comparison treated false | U collapsed to F | comparison truth before WHERE context |
| `NOT UNKNOWN=TRUE` | classical negation | 3VL truth-table cell |
| `=NULL` | NULL as ordinary value | IS NULL contrast |
| CHECK rejects NULL comparison | contexts conflated | WHERE versus CHECK same predicate |
| NOT IN drops null issue | quantified U missed | IN expansion then NOT EXISTS repair |
| one match per join key | join multiplicity | 2×3 duplicate-key fixture |
| LEFT JOIN emits exactly left count | multi-match/padding model | matched-two/unmatched contrast |
| right filter in WHERE preserves left rows | ON/WHERE phase confusion | paired queries trace |
| COUNT(x)=COUNT(*) | null aggregate input missed | same rows, three COUNT forms |
| AVG divides by all rows | NULL treated zero | SUM/count(nonnull) decomposition |
| HAVING filters rows | group phase confusion | WHERE then GROUP trace |
| EXISTS(NULL)=FALSE | selected value inspected | SELECT NULL existence item |
| correlated subquery run once | outer binding missed | per-outer-row trace table |
| UNION ALL deduplicates | ALL semantics reversed | multiplicity comparison |
| UPDATE affects one row | imperative row model | predicate-selected row set |
| failing multirow statement partly persists | atomicity missed | tentative-state/rollback trace |
| current unique sample implies key | instance/schema confusion | FD/key counterfixture |
| surrogate key implies 3NF | dependency ignored | anomaly/FD item |
| shared decomposition attribute implies lossless | join dependency missed | spurious-row fixture |
| any index column is searchable | left-prefix missed | composite-prefix matching |
| index scan guarantees order | physical/logical conflation | same plan without ORDER BY |

Selection: 35% weakest misconception/family, 25% spaced mastery, 15% phase/representation transfer, 10% NULL contrast, 10% query construction or error diagnosis, 5% mixed synthesis.

If a result has the right distinct values but wrong multiplicities, record a bag error rather than broad query failure. If all rows are correct but ordering differs without ORDER BY, accept it; if the app expected order, that is a generator defect.

## 14. Feedback and worked traces

Worked query traces should show only relevant phases:

1. schema/name/type resolution;
2. FROM/join candidate pairs and ON T/F/U;
3. WHERE truth per row;
4. groups and aggregate inputs;
5. HAVING truth;
6. selected output row values;
7. DISTINCT multiplicities;
8. sort keys/peer groups;
9. offset/limit.

Diagnostic examples:

> `age<>18` is UNKNOWN when age is NULL. WHERE keeps only TRUE, so that row is removed.

> The left row matches two right rows, so it produces two joined rows. LEFT JOIN adds padding only when there are zero matches.

> `COUNT(*)` counts the padded row. Count the non-null child key to report zero children.

> The subquery contains NULL. With no equality match, `IN` is UNKNOWN; applying NOT leaves UNKNOWN.

> The index may change how rows are found, but without ORDER BY it does not guarantee their output order.

For query construction, report semantic differences using the smallest counterexample row. Do not prefer keyword capitalization, alias spelling, join syntax style, or predicate order when equivalent in the supported grammar.

## 15. Rendering, interaction, and accessibility

- Tables use semantic HTML with caption, column headers, types, constraints, and explicit row identifiers outside query data.
- NULL uses a labeled visual token and screen-reader text “SQL null”; empty string uses `''`.
- Duplicate rows remain individually represented or carry an explicit multiplicity badge accessible as text.
- Unordered results are labeled “row order does not matter”; ordered answers expose position.
- Query code uses syntax highlighting plus plain text; color is never required to identify a clause.
- Join traces provide paired-row tables and accessible match status.
- Three-valued truth controls expose TRUE/FALSE/UNKNOWN, not three unlabeled colors.
- Horizontal scrolling preserves headers; small-screen tables can focus one row/phase at a time.
- Query builders are keyboard operable and preserve nested parentheses/scope.
- State/transaction timelines have a textual event sequence.

## 16. Generator and implementation requirements

### Typed relational AST

Use semantic nodes, not string rewriting:

```text
ScalarExpr := Literal | ColumnRef | Unary | Binary | Case | Coalesce | ScalarSubquery
Predicate  := Compare | IsNull | IsDistinct | And | Or | Not | Between | In | Exists | Quantified
FromNode   := TableScan | CrossJoin | InnerJoin | LeftJoin | SubqueryScan
Query      := From + Where + Group + Having + Project + Distinct + Order + Slice
Value      := Integer | Decimal | Text | Boolean | Null
```

Every expression carries static type/nullability. Every result row is an ordered value vector; result collections explicitly use bag/set/ordered-peer semantics.

### Independent evaluators

The production query evaluator and validator must not merely call one code path twice.

- relational evaluator: phase-based AST interpreter;
- independent oracle: composable bag operators and exhaustive pair/group enumeration;
- build-time compatible fixtures: compare with PostgreSQL and SQLite only where both match PracticeSQL-1 semantics;
- dialect-specific cases such as UNIQUE NULL behavior, alias scope, exact division, and explicit NULL ordering use authored truth fixtures, not cross-engine majority vote.

Reference-engine validation means generated queries are pretested during development/builds. The standalone page does not contain a server or dynamically invoke a database compiler.

### Query-construction checking

For learner queries:

- parse/type-check under the bounded grammar;
- run against the visible fixture;
- run against multiple hidden counterexample fixtures generated from the requirement;
- enforce structural constraints only when pedagogically requested (for example “use NOT EXISTS”);
- reject unsafe/unsupported syntax clearly;
- accept semantically equivalent supported queries;
- do not claim universal equivalence from one fixture.

### Safety and offline operation

- Tables are immutable templates copied to an in-memory sandbox per question.
- Mutations affect only that sandbox and reset instantly.
- No network, filesystem, browser storage database, credentials, or user data are queried.
- The SQL text is parsed, never passed to `eval` or a real database connection.
- Scenarios avoid real personal identifiers and production-destructive framing.

## 17. Automated validation

For every instance:

- schema constraints are internally consistent;
- base fixtures satisfy constraints unless violation is the explicit target;
- all names resolve exactly or produce the intended controlled error;
- types/nullability match every AST operation;
- result column count/names/types match;
- bag multiplicities are exact;
- unordered versus ordered answer mode is correct;
- every full-order question has deterministic tie-breaking;
- LIMIT/OFFSET prediction has deterministic ordering;
- T/F/U traces agree with truth tables;
- join pairs/padding and group partitions are independently enumerated;
- aggregate empty/null cases follow the contract;
- subquery cardinality/correlation and set column compatibility are checked;
- mutation statements are atomic and final state satisfies constraints;
- transaction versions/conflicts follow declared toy isolation;
- FD closures, candidate keys, normal forms, and decomposition properties are independently recomputed;
- index entries/prefix/cost calculations agree;
- each distractor is distinct and reproduces a named misconception;
- every choice set has one correct/best answer;
- all placeholders, code, tables, and worked traces agree.

Fuzz/property minimums:

- 100,000 scalar/predicate/3VL cases;
- 100,000 one-table bag/order queries;
- 100,000 join fixtures across match multiplicities and NULL;
- 50,000 group/aggregate/HAVING queries;
- 50,000 subquery/set-operation queries;
- 50,000 mutation/constraint/transaction transitions;
- 25,000 FD/normalization/decomposition cases;
- 25,000 index/plan cases;
- every authored scope/error/query-construction template.

## 18. Coverage requirements

Balance:

- INTEGER/DECIMAL/TEXT/BOOLEAN/NULL values;
- TRUE/FALSE/UNKNOWN in each predicate context;
- duplicate-free and duplicate-heavy results;
- unordered, fully ordered, and tie-peer outputs;
- inner/left/cross/self/junction joins;
- zero/one/many matches and nullable keys;
- COUNT forms and all supported aggregates including empty/all-null groups;
- WHERE/HAVING and ON/WHERE contrasts;
- correlated/uncorrelated, EXISTS/IN/NOT EXISTS/NOT IN, and empty subqueries;
- set and bag operators with duplicates/NULL;
- accepted/rejected writes and all FK actions;
- read_committed/snapshot visibility and conflict cases;
- single/composite keys, partial/transitive dependencies, 3NF/BCNF contrasts, lossless/lossy decompositions;
- leading/nonleading/range/covering index cases and scan/index cost outcomes.

Within a session: suppress exact repeats for 100 questions and structural repeats for 20; no more than two consecutive questions with the same schema shape; include at least one NULL-bearing item per four query questions after unlock and one result-order/multiplicity diagnostic per six.

## 19. Topic-level quality checklist

- [ ] Every question states/uses `PracticeSQL-1`.
- [ ] Unordered results are graded as bags with multiplicity.
- [ ] Ordered predictions have deterministic tie-breakers or peer-aware grading.
- [ ] NULL, empty string, zero, and `'NULL'` remain distinct.
- [ ] Three-valued logic is exact in WHERE/ON/HAVING/CHECK/CASE.
- [ ] `NOT IN` nullable behavior is explicitly practiced.
- [ ] COUNT/aggregate NULL and empty-input rules are correct.
- [ ] LEFT JOIN padding and ON-versus-WHERE are validated.
- [ ] Strict GROUP BY and alias scope do not inherit vendor quirks.
- [ ] Query-construction grading uses hidden counterexample fixtures.
- [ ] Mutations are synthetic, atomic, and offline.
- [ ] Transactions name a versioned isolation model.
- [ ] Normalization answers derive from keys/FDs, not slogans.
- [ ] Index questions separate logical result from access plan.
- [ ] Reference databases are build-time validators, not runtime dependencies.
- [ ] Every family has at least three examples and validation.
- [ ] Difficulty increases through relational reasoning rather than table size.
- [ ] Accessibility preserves NULL, duplicates, order, and query scope.
- [ ] The app never connects to real data or executes SQL externally.
- [ ] Repeated practice improves actual query prediction and schema reasoning.

## 20. Stable navigation

1. `relations` — Relations, Schemas & Keys
2. `select-filter` — SELECT & Filtering
3. `null-logic` — NULL & Three-Valued Logic
4. `order-duplicates` — Duplicates, Ordering & Pagination
5. `joins` — Joins & Multiplicity
6. `aggregation` — Aggregation & Grouping
7. `subqueries-sets` — Subqueries & Set Operations
8. `mutations` — Data Changes & Transactions
9. `design` — Relational Design & Normalization
10. `indexes` — Indexes & Query Planning

Family identifiers are stable persistence/analytics keys and must not be translated or silently repurposed.
