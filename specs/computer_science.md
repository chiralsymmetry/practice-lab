# Computer Science: Algorithms and Discrete Reasoning — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, visualization, answer-parser, and UI implementers

## 1. Topic overview

### Goal

Develop quick, reliable reasoning about algorithm growth, recurrences, data-structure costs and state changes, graph-algorithm traces, propositional logic, and finite counting/probability.

The learner should become better at carrying out small exact analyses—not merely recalling definitions or theorem names.

### Scope

- asymptotic comparison and simplification;
- dominant terms, tight growth classes, and simple loop analysis;
- exact recurrence evaluation and recursion-tree structure;
- divide-and-conquer recurrences covered by a declared Master Theorem subset;
- operation costs for explicitly modeled arrays, linked lists, hash tables, binary heaps, and binary search trees;
- small state traces for resizing arrays, heaps, BSTs, and hash tables;
- BFS, DFS, connected components, Dijkstra, shortest-path reconstruction, and topological sorting;
- propositional evaluation, truth-table columns, equivalence, De Morgan transformations, and controlled quantifier negation;
- product/sum rules, permutations, combinations, constrained bit strings, inclusion–exclusion, pigeonhole reasoning, and exact finite probability.

Expected prior knowledge:

- integer arithmetic, exponents, and logarithms;
- arrays and basic pseudocode;
- vertices and edges;
- fractions;
- Boolean true/false.

### Exclusions

- free-form proofs and proof grading;
- static definition, theorem-name, inventor, or vocabulary recall;
- undecidability, computability, formal languages, automata, and complexity classes beyond elementary time/space growth;
- amortized-analysis proofs by potential or accounting methods;
- randomized data structures and randomized algorithms beyond explicitly finite probability questions;
- red-black, AVL, B-tree, trie, union–find, Fibonacci-heap, and bloom-filter internals in the initial version;
- negative-weight shortest paths, Bellman–Ford, Floyd–Warshall, A*, maximum flow, matching, and NP-completeness reductions;
- graph questions whose answer depends on an unstated neighbor or tie-breaking order;
- calculus-based limits, Stirling derivations, measure-theoretic probability, continuous distributions, and simulation-estimated answers;
- symbolic algebra broad enough to require a computer algebra system;
- user-authored code execution or arbitrary pseudocode interpretation.

### Normative asymptotic model

- `n` is a positive integer tending to infinity.
- Unless stated otherwise, functions are eventually nonnegative.
- Logarithm bases are fixed constants greater than one and therefore equivalent in `Θ` expressions. Concrete recurrence depths declare a base.
- A request for a **tight growth class** expects `Θ`, not merely any valid `O` upper bound.
- A request to **simplify the displayed O-bound** expects the least standard class obtained from its nonnegative terms, while retaining the `O` wrapper.
- Constant factors and lower-order additive terms are discarded only in an asymptotic question.
- Expressions with cancellation, negative leading coefficients, oscillation, or undefined domains are not generated.
- Canonical class vocabulary initially includes:
  `Θ(1)`, `Θ(log log n)`, `Θ(log^k n)`, `Θ(n^a log^b n)`, `Θ(c^n)`, and `Θ(n!)`,
  with small positive rational/integer `a,b,k` and constant `c>1`.

### Normative algorithm and cost model

Pseudocode has mathematical integer semantics. Every loop declares whether its upper bound is inclusive and how its control variable changes. Primitive comparison, assignment, arithmetic, array access, and pointer follow are unit cost unless a prompt explicitly counts one selected operation.

Data-structure prompts name the implementation and available handles. The initial models are:

- **dynamic array:** contiguous storage; indexed access `Θ(1)`; capacity doubles on a full append; an append that does not resize is worst-case `Θ(1)`; append is amortized `Θ(1)`;
- **singly linked list:** head pointer always present; tail pointer only when stated; given-node handles are available only when stated;
- **separate-chaining hash table:** bucket array plus declared within-bucket insertion order; expected costs assume a bounded load factor and standard uniform hashing; worst case permits all keys in one bucket;
- **linear-probing hash table:** declared table length, hash function, wraparound, and tombstone policy;
- **binary min-heap:** zero-indexed array, parent `floor((i-1)/2)`, children `2i+1,2i+2`; equal keys use the stable rule declared in the prompt;
- **plain BST:** no balancing and no duplicate keys unless duplicate policy is explicitly taught; height is measured in edges, so a one-node tree has height 0.

Cost answers distinguish `best`, `expected/average`, `amortized`, and `worst`. These labels are not interchangeable.

For cost questions, hash insertion means insert-or-update in a map/set and therefore checks whether the key already exists. A blind “prepend without duplicate checking” operation is used only in a concrete trace that explicitly requests it.

### Normative graph model

- Vertices use unique short labels, normally `A–H`.
- A graph is explicitly directed or undirected.
- Adjacency lists are ordered by ascending vertex label unless a different visible order is declared.
- BFS marks a vertex discovered when it is enqueued.
- Recursive DFS marks on entry and records preorder.
- A traversal from a start vertex visits only its reachable component unless the prompt says “full traversal.”
- Full traversal restarts from the smallest unvisited label.
- Dijkstra uses nonnegative integer edge weights, settles the smallest tentative distance, and breaks equal-distance ties by smallest vertex label.
- Equal-length shortest paths use the smallest predecessor label only when the prompt asks for one canonical path.
- Kahn topological sort chooses the smallest currently zero-indegree label.
- `∞` denotes unreachable distance.

### Normative logic and probability model

Logic notation:

- `¬` not;
- `∧` and;
- `∨` inclusive or;
- `→` implication;
- `↔` equivalence.

Expressions are fully parenthesized except for a displayed precedence reminder. Truth-table row order is lexicographic with `T` before `F`: for `(p,q)`, `TT, TF, FT, FF`.

Finite probability treats equally likely outcomes only when explicitly stated. All probability answers are exact reduced fractions. Ordered and unordered selections are distinguished in the prompt. Sampling with or without replacement is always stated.

### Global answer conventions

- Ignore surrounding whitespace and Unicode-normalize common mathematical symbols.
- Accept `Theta`, `Θ`, `O`, and `Omega/Ω` only when the requested relation matches.
- Accept `log(n)`, `log n`, and `lg n` as equivalent in asymptotic answers unless a concrete base is required.
- Superscripts and caret exponents are equivalent: `n²` and `n^2`.
- Ordered sequences accept comma, space, or arrow separators.
- Sets ignore element order and duplicates are rejected.
- Named distance/predecessor tables use named fields, not position-dependent prose.
- Boolean answers use controls or `T/F`; accept `true/false`.
- Fractions must be exact; equivalent unreduced fractions may be accepted and normalized.
- `∞`, `inf`, and `unreachable` are equivalent only for graph-distance fields.
- Multiple correct mathematical objects are accepted only when the family is designed for them. Otherwise a deterministic rule is displayed.

### Difficulty philosophy

Difficulty should increase through interacting concepts, weaker scaffolding, inverse questions, meaningful edge cases, and longer dependency chains. It should not increase merely through larger graph drawings, huge coefficients, deep arithmetic, long expressions, or deliberately awkward notation.

Examples of genuine progression:

- identify a dominant term → order several growth classes → analyze a loop;
- expand a recurrence → reason about one tree level → derive the final class;
- recall one operation cost → select a structure under a workload → trace its state;
- traverse a tree-like graph → handle cycles and cross edges → reconstruct a shortest path;
- evaluate one proposition → generate a truth-table column → detect equivalence;
- apply a product rule → choose between permutation/combination → count constrained objects.

### Generator and oracle model

Every item stores:

- stable category, subcategory, and family identifiers;
- semantic input independent of rendering;
- exact answer object;
- algorithm/model version;
- tie-breaking policy;
- misconception tags;
- difficulty dimensions;
- structural signature for repetition suppression;
- derivation trace used for feedback.

Use exact integers/BigInt and reduced rational arithmetic. Generate complex instances backward from desired pedagogical properties where rejection sampling would be unreliable. A second independently written oracle should validate graph traces, recurrence values, and logic/probability answers.

## 2. Category: Asymptotic growth

### Category purpose

Train recognition of which parts of an algorithmic cost matter as input grows and when one growth class eventually dominates another.

### Learn

For a sum of eventually nonnegative terms, the fastest-growing term determines the tight class. Constants do not affect the class:

- `3n² + n log n + 40` is `Θ(n²)`;
- `7 log n + 100` is `Θ(log n)`;
- `n³ + 2ⁿ` is `Θ(2ⁿ)`.

`O(g)` means an upper bound, whereas `Θ(g)` means a tight bound. The app will say which one it wants.

### Prerequisites

Powers, logarithms, and algebraic simplification.

### Category boundaries

Recurrences belong to the next category. Concrete operation counts may be used to derive a class, but language/runtime-specific benchmarking is excluded.

### Subcategories

1. Dominant terms
2. Expression normalization
3. Growth comparison and ordering
4. Loop analysis
5. Meaning of asymptotic relations

### Family `dominant_term`

**Skill and learner task.** Select the term that determines the tight growth of a nonnegative sum.

**Response mode.** Single-choice.

**Question template.** `Which term dominates as n→∞ in {expression}?`

**Placeholders.** `{expression}` contains 2–5 positive terms from the canonical class vocabulary, with nonzero constant coefficients.

**Answer derivation.** Normalize each term and select its maximum asymptotic equivalence class.

**Instance constraints and rejection rules.** Exactly one displayed term must occupy the maximal class unless the question explicitly asks for all co-dominant terms. Reject dominance caused only by combining identical terms.

**Difficulty.** Polynomial powers; log factors; roots/fractional powers; exponentials; factorial and disguised equivalents.

**Distractors.** Largest coefficient, visually longest term, largest value at a small `n`, or one class immediately below the answer.

**Feedback.** Order all displayed terms by eventual growth and state that coefficients are irrelevant.

**Examples.**

1. `7n + 30` → `7n`. L1.
2. `2n² + 9n log n + 400` → `2n²`. L2.
3. `n³ + 2ⁿ + n²log⁴n` → `2ⁿ`. L4.

**Implementation and validation.** Compare normalized symbolic rank tuples; numerically sampling a few `n` values is not an oracle.

### Family `simplify_asymptotic_expression`

**Skill and learner task.** Simplify a stated asymptotic expression to a canonical class.

**Response mode.** Symbolic short text or single-choice at early levels.

**Question template.** `Give the simplest standard form of {bound_expression}.`

**Answer derivation.** Algebraically normalize products/quotients and logarithm powers, then retain the dominant nonnegative term while preserving the requested `O` or `Θ` relation.

**Accepted answers.** Algebraically equivalent canonical forms, such as `Θ(n log n)` and `Theta(n*log(n))`.

**Instance constraints and rejection rules.** No cancellation, zero coefficients, ambiguous multivariable limits, or hidden domain violations.

**Difficulty.** Remove constants; select from sums; simplify products; simplify quotients; combine transformations.

**Feedback.** Show normalization before dominance.

**Examples.**

1. `O(3n²+n log n+40)` → `O(n²)`. L1.
2. `Θ((n+1)(log n+7))` → `Θ(n log n)`. L3.
3. `O((n³+n²log n)/n)` → `O(n²)`. L4.

**Implementation and validation.** Parse only a controlled expression grammar and normalize to symbolic exponent tuples.

### Family `compare_growth_rates`

**Skill and learner task.** Decide which of two functions grows faster or whether they are in the same `Θ` class.

**Response mode.** Three-way control: left faster / same class / right faster.

**Question template.** `Compare {left} and {right} as n→∞.`

**Answer derivation.** Normalize both expressions and compare their growth hierarchy.

**Instance constraints and rejection rules.** Include equivalent-looking forms regularly. Avoid bases or exponents requiring advanced limit proofs outside the declared hierarchy.

**Difficulty.** Different polynomial powers; polynomial versus log factors; equivalent log transformations; exponential bases; factorial contrasts.

**Feedback.** Provide a standard ordering chain or equivalence transformation.

**Examples.**

1. `n` versus `n log n` → right faster. L1.
2. `n log(n³)` versus `n log n` → same `Θ` class. L3.
3. `2ⁿn³` versus `n!` → right faster. L5.

**Implementation and validation.** Symbolic hierarchy comparison; property tests for symmetry and equivalence.

### Family `order_growth_set`

**Skill and learner task.** Arrange several functions from slowest to fastest, grouping asymptotically equivalent functions.

**Response mode.** Ordered groups.

**Question template.** `Order these by asymptotic growth, slowest first: {functions}.`

**Answer derivation.** Normalize, sort by growth class, and group equal classes.

**Instance constraints and rejection rules.** 3–6 functions; at most two equivalence groups at introductory levels; all functions visually distinct.

**Difficulty.** No equalities; one equality; logs and fractional powers; exponentials; six-way mixed hierarchy.

**Feedback.** Show the canonical chain with `=` for same class and `<` for strict dominance.

**Examples.**

1. `1, log n, n` → `1 < log n < n`. L1.
2. `n, √n, log²n, n log n` → `log²n < √n < n < n log n`. L3.
3. `log(n²), log n, n^0.5, n!, 2ⁿ` → `{log(n²),log n} < √n < 2ⁿ < n!`. L5.

**Implementation and validation.** Canonical rank sorting with equivalence-group comparison; accept order permutations only within an explicitly grouped equal class.

### Family `loop_growth`

**Skill and learner task.** Determine the tight running-time class of controlled pseudocode loops.

**Response mode.** Symbolic complexity.

**Question template.**

```text
What is the tight running time in n?
{pseudocode}
```

**Placeholder definitions.** `{pseudocode}` is generated from a small AST of counted loops, geometric loops, triangular nests, sequential blocks, and explicitly independent/dependent bounds.

**Answer derivation.** Determine each loop’s iteration count, multiply nested counts where appropriate, sum sequential blocks, and take the tight class.

**Instance constraints and rejection rules.** Loop variables and bounds are immutable except for their shown updates. No overflow, early exits, hidden costs, mutation of `n`, or language-specific integer behavior.

**Difficulty.** Single linear/geometric loop; rectangular nest; sequential dominance; triangular dependent bound; mixed geometric inner loop.

**Misconceptions and feedback.** Diagnose adding nested loop counts, multiplying sequential loops, treating doubling as linear, or assuming every two-loop program is quadratic.

**Examples.**

1. `for i=0; i<n; i++: work()` → `Θ(n)`. L1.
2. `i=1; while i<n: work(); i=2i` → `Θ(log n)`. L2.
3. `for i=1..n: for j=1..i: work()` → `Θ(n²)`. L4.

**Implementation and validation.** Evaluate exact iteration counts for many concrete `n` from the AST and compare with the symbolic derivation as a supplementary test.

### Family `asymptotic_statement_truth`

**Skill and learner task.** Decide whether a concrete `O`, `Ω`, or `Θ` statement is true.

**Response mode.** Yes/no.

**Question template.** `True or false: {left} ∈ {relation}({right}).`

**Answer derivation.** Compare normalized classes: `O` permits equal or slower, `Ω` equal or faster, and `Θ` only equal.

**Instance constraints and rejection rules.** Eventually nonnegative functions only; no request for a proof witness or exact constants.

**Difficulty.** Equal-class Θ; strict O; strict Ω; false direction; expression normalization first.

**Feedback.** State both tight classes before applying the relation.

**Examples.**

1. `n ∈ O(n²)` → true. L1.
2. `3n²+5n ∈ Θ(n²)` → true. L2.
3. `2ⁿ ∈ O(n¹⁰)` → false. L3.

**Implementation and validation.** Truth table over normalized class order; ensure false/true and relation types are balanced.

## 3. Category: Recurrences

### Category purpose

Train movement between recursive definitions, concrete values, recursion-tree structure, and asymptotic solutions.

### Learn

A recurrence describes a problem in terms of smaller instances. For

`T(n)=aT(n/b)+f(n)`,

recursion depth, number of nodes, and work per node can be reasoned about separately. The Master Theorem family in this app compares `f(n)` with `n^(log_b a)` under explicitly supported regular cases.

### Prerequisites

Asymptotic growth and logarithms.

### Category boundaries

The app applies a declared subset of recurrence techniques. It does not ask for free-form recurrence invention or proof of bounds.

### Recurrence conventions

- Divide-and-conquer exact questions use `n=b^k` and integer subproblem sizes.
- A base value such as `T(1)=c` is always shown.
- Each internal node incurs the displayed nonrecursive cost once.
- Concrete evaluation uses exact integers.
- Supported Master forms initially use `a≥1`, integer `b≥2`, and `f(n)=Θ(n^d log^k n)` with parameters chosen for a directly supported case.

For `p=log_b a`, the supported cases are:

- `d<p` → `T(n)=Θ(n^p)`;
- `d=p`, with integer `k≥0` → `T(n)=Θ(n^p log^(k+1)n)`;
- `d>p` and the regularity check `a·f(n/b)≤c·f(n)` for some fixed `c<1` → `T(n)=Θ(f(n))`.

The generator must verify these symbolic conditions. It may not label a recurrence “Master case 1/2/3” merely from a memorized surface pattern.

### Subcategories

1. Concrete evaluation
2. Tree depth and node counts
3. Per-level work
4. Tight solution

### Family `recurrence_concrete_value`

**Skill and learner task.** Evaluate a recurrence for a small valid input.

**Response mode.** Integer input.

**Question template.** `Given {recurrence} and {base_case}, compute T({n}).`

**Answer derivation.** Memoized exact recursive evaluation or iterative expansion.

**Instance constraints and rejection rules.** Values fit a safe display range; recursive calls reach a declared base exactly; arithmetic remains secondary to recurrence structure.

**Difficulty.** One branch; two branches; nonconstant combine cost; deeper power input; linear-decrease recurrence.

**Feedback.** Show the expansion table from base upward, not only a fully expanded unreadable expression.

**Examples.**

1. `T(1)=1, T(n)=T(n/2)+1; T(16)` → `5`. L1.
2. `T(1)=2, T(n)=2T(n/2)+n; T(8)` → `40`. L3.
3. `T(0)=0, T(n)=T(n-1)+2n; T(4)` → `20`. L4.

**Implementation and validation.** Compare recursive and bottom-up evaluators.

### Family `recursion_tree_shape`

**Skill and learner task.** Determine depth, node count at a level, or leaf count for a balanced recurrence.

**Response mode.** Integer or exact power expression.

**Question template.** `For {recurrence} with n={n}, find {requested_tree_quantity}.`

**Answer derivation.** Depth is `log_b n`; level `i` has `a^i` nodes; leaves are `a^(log_b n)`.

**Instance constraints and rejection rules.** `n` is an exact power of `b`; root is level 0; leaf depth convention appears in the prompt.

**Difficulty.** Depth; nodes at shown level; leaves; inverse missing parameter; combine quantities.

**Feedback.** Draw a compact level table rather than a large literal tree.

**Examples.**

1. `T(n)=2T(n/2)+…, n=8` → leaf depth `3`. L1.
2. same recurrence, nodes at level 2 → `4`. L2.
3. `T(n)=3T(n/3)+…, n=81` → `81` leaves. L3.

**Implementation and validation.** Integer exponentiation and recurrence-tree enumeration for small cases.

### Family `recursion_level_work`

**Skill and learner task.** Compute the total nonrecursive work performed at one recursion-tree level.

**Response mode.** Symbolic expression in `n` and level `i`, or numeric value.

**Question template.** `In {recurrence}, what is the combine work at level {level}?`

**Answer derivation.** Multiply nodes `a^i` by per-node work `f(n/b^i)` and simplify.

**Instance constraints and rejection rules.** Requested level is internal. Controlled polynomial/logarithmic `f`; no rounding subproblem sizes.

**Difficulty.** Constant per level; increasing/decreasing geometric work; numeric level; symbolic `i`; compare adjacent levels.

**Feedback.** Show `node count × work per node`.

**Examples.**

1. `2T(n/2)+n`, level `i` → `n`. L2.
2. `4T(n/2)+n`, level `i` → `n·2^i`. L3.
3. `3T(n/3)+n²`, level `i` → `n²/3^i`. L4.

**Implementation and validation.** Symbolic simplifier plus numeric tree checks at several powers of `b`.

### Family `master_recurrence_class`

**Skill and learner task.** Determine the tight class of a supported divide-and-conquer recurrence.

**Response mode.** Symbolic `Θ` expression.

**Question template.** `Solve asymptotically: {recurrence}, with {base_case}.`

**Answer derivation.** Compute `p=log_b a`, compare `f(n)` with `n^p`, select the supported Master case, and form the result.

**Instance constraints and rejection rules.** Generate only cases satisfying the declared theorem subset and any needed regularity condition. Reject `T(n-1)`, unequal subproblem sizes, negative work, and boundary forms outside the implemented rule table.

**Difficulty.** Obvious leaf-dominated; balanced; root-dominated; logarithmic factor at equality; disguised `a,b`.

**Distractors.** `Θ(f(n))` without comparison, `Θ(n^p)` in every case, omitted log factor, or `log_a b` instead of `log_b a`.

**Feedback.** Show `n^(log_b a)`, the comparison, case, and result.

**Examples.**

1. `T(n)=2T(n/2)+n` → `Θ(n log n)`. L2.
2. `T(n)=4T(n/2)+n` → `Θ(n²)`. L3.
3. `T(n)=2T(n/2)+n²` → `Θ(n²)`. L4.

**Implementation and validation.** Symbolic case oracle plus recursion-level sum verification on supported parameter grids.

## 4. Category: Data structures

### Category purpose

Train selection of the right cost model and prediction of concrete state changes under precisely specified implementations.

### Learn

An operation has no meaningful complexity without an implementation and condition. “Insert” can be `Θ(1)`, expected `Θ(1)`, amortized `Θ(1)`, `Θ(log n)`, or `Θ(n)` depending on structure, position, and guarantee.

For trace questions, follow the declared representation exactly: heap array indices, hash collision policy, resize rule, or BST insertion comparison.

### Prerequisites

Asymptotic categories, arrays, pointers/references, and basic trees.

### Category boundaries

Language library guarantees are excluded. Prompts use the normative abstract structures above.

### Normative cost table

The table below supplies the initial answer oracle. A prompt may specialize it by stating stronger information such as a node handle, current tree height, or a successful/unsuccessful search.

| Structure and operation | Required case | Cost |
|---|---|---|
| dynamic array indexed read/write | worst | `Θ(1)` |
| dynamic array linear search | best / worst | `Θ(1) / Θ(n)` |
| dynamic array successful linear search, target position uniform | expected | `Θ(n)` |
| dynamic array append | amortized / worst single append | `Θ(1) / Θ(n)` |
| dynamic array insert/delete at arbitrary index | worst | `Θ(n)` |
| singly linked list indexed access or search | worst | `Θ(n)` |
| singly linked list prepend | worst | `Θ(1)` |
| singly linked list append without/with tail pointer | worst | `Θ(n) / Θ(1)` |
| singly linked list insert after a supplied node handle | worst | `Θ(1)` |
| separate-chaining hash lookup/insert at bounded load | expected / worst | `Θ(1) / Θ(n)` |
| linear-probing lookup/insert at bounded load | expected / worst | `Θ(1) / Θ(n)` |
| binary min-heap peek-min | worst | `Θ(1)` |
| binary min-heap insert or extract-min | worst | `Θ(log n)` |
| binary min-heap search for arbitrary key | worst | `Θ(n)` |
| bottom-up binary heap construction from `n` items | worst | `Θ(n)` |
| plain BST search/insert/delete | in terms of height | `Θ(h)` |
| balanced-height BST search/insert/delete | worst | `Θ(log n)` |
| plain BST full traversal | worst | `Θ(n)` |

Deletion from a singly linked list is asked only with enough information to make the pointer-update cost unambiguous. Hash insertion costs assume no table resize unless resize is explicitly part of the question.

### Subcategories

1. Operation costs
2. Workload comparison
3. Dynamic arrays
4. Heaps
5. BSTs
6. Hash tables

### Family `data_structure_operation_cost`

**Skill and learner task.** Give the requested best, expected, amortized, or worst-case cost of one operation under a stated structure model.

**Response mode.** Single-choice complexity.

**Question template.** `For {structure_model}, what is the {case_kind} time for {operation}?`

**Answer derivation.** Look up or derive the operation cost using the stated access handles and invariant.

**Instance constraints and rejection rules.** Case kind and implementation always explicit. Never ask an unqualified “cost of hash lookup” or “linked-list insertion.”

**Difficulty.** Direct access/search; handle-sensitive linked operation; amortized dynamic-array append; expected/worst hash contrast; heap/BST height reasoning.

**Distractors.** Same operation under another structure, wrong case kind, or confusion between build and repeated insert.

**Feedback.** Name the action that dominates: traversal, shifting, resizing, probing, or height.

**Examples.**

1. dynamic-array indexed read, worst case → `Θ(1)`. L1.
2. singly linked list without tail pointer, append, worst case → `Θ(n)`. L2.
3. separate-chaining hash lookup at bounded load, expected versus worst → `Θ(1)` versus `Θ(n)`. L4.

**Implementation and validation.** Versioned reviewed cost matrix with constraint checks.

### Family `workload_cost_comparison`

**Skill and learner task.** Compare structures or derive total asymptotic cost for a generated operation workload.

**Response mode.** Single-choice structure or symbolic complexity.

**Question template.** `{workload}. Under {models}, which choice has the lowest stated asymptotic cost?`

**Answer derivation.** Multiply each operation frequency by its applicable cost, add phases, simplify, and compare.

**Instance constraints and rejection rules.** Workloads state whether order, duplicates, worst-case guarantee, and indexing are required. Exactly one choice must be asymptotically preferable unless “tie” is offered.

**Difficulty.** One dominant operation; two phases; amortized versus worst; memory/order constraint; competing equal leading classes.

**Feedback.** Show a cost expression per candidate.

**Examples.**

1. `n` appends followed by `n` indexed reads → dynamic array total `Θ(n)`. L2.
2. insert `n` keys into a binary heap, then extract all → `Θ(n log n)` via repeated operations. L3.
3. `n` membership queries after building from `n` keys: hash set expected `Θ(n)` query total versus balanced BST `Θ(n log n)`. L4.

**Implementation and validation.** Symbolically aggregate the cost matrix and verify unique choice.

### Family `dynamic_array_resize_trace`

**Skill and learner task.** Predict capacity, state, or element-copy count during append operations.

**Response mode.** Named integer fields and/or ordered array.

**Question template.** `A dynamic array has {state}, size {size}, capacity {capacity}, and doubles when full. After {operations}, give {requested}.`

**Answer derivation.** Before each append, resize if `size=capacity`, copy existing elements, then write the appended value.

**Instance constraints and rejection rules.** Initial state consistent; capacity positive; no implementation-dependent allocator behavior. State exactly whether the final write counts as a copy.

**Difficulty.** No resize; one resize; several appends crossing once; multiple crossings; total-copy count.

**Feedback.** Show size/capacity after each operation.

**Examples.**

1. size 3, capacity 4, append one → size 4, capacity 4, `0` old-element copies. L1.
2. `[A,B,C,D]`, size/capacity 4, append E → capacity 8, `4` old-element copies. L2.
3. empty capacity 1, append A–E → final capacity 8 and total old-element copies `1+2+4=7`. L4.

**Implementation and validation.** Direct array simulator and copy-accounting oracle.

### Family `binary_heap_trace`

**Skill and learner task.** Trace insert or extract-min in a binary min-heap.

**Response mode.** Ordered array.

**Question template.** `Starting with min-heap {heap}, perform {operations}. Give the final level-order array.`

**Answer derivation.** Use append-and-sift-up for insert; root replacement and sift-down for extract-min, choosing the smaller child and declared tie rule.

**Instance constraints and rejection rules.** Input heap valid; keys unique initially; at most 8 elements displayed; operations never extract from empty.

**Difficulty.** No swap; one sift; multi-level sift; several operations; equal-key policy.

**Feedback.** Animate or list each swap.

**Examples.**

1. insert `3` into `[1,5,4]` → `[1,3,4,5]`. L2.
2. insert `7,3,5,1` into empty heap → `[1,3,5,7]`. L3.
3. extract-min from `[1,4,2,7,6,5]` → `[2,4,5,7,6]`. L4.

**Implementation and validation.** Simulator plus heap-invariant assertion after every step.

### Family `bst_trace`

**Skill and learner task.** Trace plain BST insertion/search or derive height/traversal.

**Response mode.** Ordered sequence, integer height, or small tree selection.

**Question template.** `Insert/search {keys} in an initially {initial_tree} plain BST. Give {requested}.`

**Answer derivation.** Compare at each node; smaller goes left, larger right; no rebalancing.

**Instance constraints and rejection rules.** Unique comparable keys; height convention stated; renderings derive from semantic tree rather than screen position.

**Difficulty.** Search path; balanced-looking insertion; skew; traversal after insertions; height and failed search.

**Feedback.** Show comparison path and resulting child link.

**Examples.**

1. insert `5,2,8,1,3`; preorder → `5,2,1,3,8`. L2.
2. in the resulting tree, search for `3` → path `5,2,3`. L2.
3. insert `1,2,3,4,5`; height in edges → `4`. L3.

**Implementation and validation.** Tree simulator, unique-key assertion, and independent traversal.

### Family `hash_table_trace`

**Skill and learner task.** Trace insert/search under a declared collision strategy.

**Response mode.** Bucket table, slot array, or probe sequence.

**Question template.** `Using {hash_model}, perform {operations}. Give {requested}.`

**Answer derivation.** Evaluate the displayed hash function and apply separate chaining or linear probing exactly.

**Instance constraints and rejection rules.** Table length and insertion order shown; no resize unless explicitly modeled; linear-probing load kept below 1; deletion excluded initially.

**Difficulty.** No collision; one collision; collision chain; wraparound; unsuccessful search.

**Feedback.** Show home bucket and each collision/probe.

**Examples.**

1. append-to-chain hashing, `m=5`, `h(k)=k mod 5`, insert `7,12,4` → bucket 2 `[7,12]`, bucket 4 `[4]`. L2.
2. linear probing, `m=7`, insert `10,17,24` → slots 3,4,5. L3.
3. same table, search `31` → probes `3,4,5,6` and stops at empty slot 6. L4.

**Implementation and validation.** Concrete simulator and table-invariant checks.

## 5. Category: Graph algorithms

### Category purpose

Train precise execution of graph algorithms on small generated instances while separating algorithm behavior from drawing layout.

### Learn

Traversal order is not determined by a graph alone. This app always declares neighbor order and tie rules. BFS uses a queue and discovers by layers; DFS follows one branch recursively; Dijkstra repeatedly settles the smallest tentative distance; topological sorting repeatedly removes zero-indegree vertices.

### Prerequisites

Queues, stacks/recursion, sets, and nonnegative addition.

### Category boundaries

Graphs remain small enough to reason about mentally. Visual layout carries no semantic order. Weighted shortest-path questions never contain negative edges.

### Rendering requirements

- Render graphs as compact inline SVG generated locally, with no external library.
- Also provide an accessible adjacency-list or edge-table view.
- Directed edges have visible arrowheads; weights appear next to edges.
- Avoid overlapping labels and ambiguous edge crossings.
- Highlight the start vertex and optionally the current frontier in worked solutions.
- All algorithms operate on the semantic graph, never SVG coordinates.

### Subcategories

1. BFS and reachability
2. DFS
3. Components
4. Shortest paths
5. DAG ordering

### Family `bfs_visit_order`

**Skill and learner task.** Produce BFS dequeue/visit order from a start vertex.

**Response mode.** Ordered sequence.

**Question template.** `Run BFS from {start}. Visit neighbors in {neighbor_order}. Give dequeue order.`

**Answer derivation.** Mark start discovered, enqueue it, then repeatedly dequeue and enqueue undiscovered neighbors in order.

**Instance constraints and rejection rules.** 4–8 vertices; reachable subgraph contains a branch; cycles permitted; answer definition says dequeue order.

**Difficulty.** Tree; shared child; cycle; distracting unreachable vertex; custom visible adjacency order.

**Feedback.** Show queue and discovered set after each dequeue.

**Examples.**

1. edges `{A-B,A-C,B-D,C-E}`, start A → `A,B,C,D,E`. L1.
2. edges `{A-B,A-C,B-D,C-D,D-E}`, start A → `A,B,C,D,E`. L2; D is enqueued once.
3. directed edges `{A→C,A→B,B→E,C→D,D→B}`, start A, label order → `A,B,C,E,D`. L4.

**Implementation and validation.** Independent queue simulation and reachability-size check.

### Family `bfs_layers_predecessors`

**Skill and learner task.** Give unweighted distances/layers or the canonical BFS predecessor tree.

**Response mode.** Named fields per vertex.

**Question template.** `Run BFS from {start}. Give {distances_or_predecessors}.`

**Answer derivation.** Assign distance 0 to start and `distance+1` on first discovery; predecessor is the discovering vertex.

**Instance constraints and rejection rules.** Tie-breaking shown; include `∞` only after reachable cases are mastered.

**Difficulty.** Layer table; shared child with predecessor tie; directed reachability; disconnected vertex; reconstruct path.

**Feedback.** Display vertices grouped by layer.

**Examples.**

1. path `A-B-C-D`, start A → distances `A0,B1,C2,D3`. L1.
2. edges `{A-B,A-C,B-D,C-D}`, start A → predecessor of D is B under label order. L3.
3. directed `{A→B,C→A}`, start A → `A0,B1,C∞`. L3.

**Implementation and validation.** BFS oracle and predecessor-edge/distance invariants.

### Family `dfs_preorder`

**Skill and learner task.** Produce recursive DFS preorder.

**Response mode.** Ordered sequence.

**Question template.** `Run recursive DFS from {start}, considering neighbors in {neighbor_order}. Give preorder.`

**Answer derivation.** Record a vertex when entered, then recursively visit each undiscovered neighbor in order.

**Instance constraints and rejection rules.** State recursive preorder; do not mix push-all iterative-stack variants. Include cycles only with explicit discovered behavior.

**Difficulty.** Tree; back edge; cross edge; directed graph; full traversal with restart.

**Feedback.** Show recursion stack and skipped visited edges.

**Examples.**

1. `{A-B,A-C,B-D,C-E}`, start A → `A,B,D,C,E`. L1.
2. `{A-B,A-C,B-C,C-D}`, start A → `A,B,C,D`. L2.
3. directed `{A→C,A→B,B→D,C→D,E→A}`, full traversal → `A,B,D,C,E`. L4.

**Implementation and validation.** Recursive oracle and permutation/reachability checks.

### Family `connected_components`

**Skill and learner task.** Count or list connected components in an undirected graph.

**Response mode.** Integer or unordered groups.

**Question template.** `Find the connected components of {graph}.`

**Answer derivation.** Repeated BFS/DFS from the smallest unvisited vertex.

**Instance constraints and rejection rules.** Undirected only; isolated vertices explicit; weak/strong components of directed graphs excluded.

**Difficulty.** One component; isolated vertex; several similarly sized components; component listing; edge addition/removal effect.

**Feedback.** Color each component and show restart vertices.

**Examples.**

1. vertices `A,B,C`, edge `{A-B}` → `{A,B},{C}`. L1.
2. edges `{A-B,B-C,D-E}` → 2 components. L2.
3. edges `{A-B,C-D,E-F,F-G}` plus isolated H → `{A,B},{C,D},{E,F,G},{H}`. L3.

**Implementation and validation.** Component partition must cover every vertex exactly once and contain no cross-component edge.

### Family `dijkstra_distance_table`

**Skill and learner task.** Compute final shortest distances or one selected intermediate Dijkstra state.

**Response mode.** Named distance fields.

**Question template.** `Run Dijkstra from {source}. Give {requested_distances}.`

**Answer derivation.** Initialize source 0, others ∞; repeatedly settle the minimum `(distance,label)` and relax outgoing edges.

**Instance constraints and rejection rules.** Nonnegative integer weights; 4–7 vertices; avoid excessive arithmetic; zero-weight edges introduced only at higher levels.

**Difficulty.** Unique path; relaxation improves a tentative value; equal-distance tie; directed graph; unreachable vertex/intermediate state.

**Feedback.** Show settled vertex and successful relaxations in a table.

**Examples.**

1. `A-B:2, B-C:3, A-C:8`, source A → `A0,B2,C5`. L1.
2. `A-B:4,A-C:1,C-B:2,B-D:1,C-D:5` → `A0,C1,B3,D4`. L3.
3. directed `A→B:2,C→B:1` from A → `A0,B2,C∞`. L3.

**Implementation and validation.** Heap-free reference Dijkstra and triangle-inequality checks over all edges.

### Family `dijkstra_shortest_path`

**Skill and learner task.** Reconstruct the canonical shortest path and its weight.

**Response mode.** Ordered vertex sequence plus integer distance.

**Question template.** `Using Dijkstra and the stated tie rule, find a shortest path from {source} to {target}.`

**Answer derivation.** Maintain predecessor on a strict improvement; on an equal improvement apply the declared predecessor rule; backtrack target to source.

**Instance constraints and rejection rules.** Target reachable unless “no path” is the explicit answer. If multiple shortest paths exist, show tie policy or accept all valid shortest paths.

**Difficulty.** Direct versus detour; several relaxations; equal paths; directed; distracting heavy edges.

**Feedback.** Show predecessor updates and sum the chosen path edges.

**Examples.**

1. `A-B:2,B-C:3,A-C:8` → `A,B,C`, cost 5. L1.
2. `A-B:4,A-C:1,C-B:2,B-D:1,C-D:5` → `A,C,B,D`, cost 4. L3.
3. `A→B:2,A→C:2,B→D:3,C→D:3`, smallest predecessor tie → `A,B,D`, cost 5. L4.

**Implementation and validation.** Recalculate path weight, verify every edge, and compare with final distance.

### Family `topological_order`

**Skill and learner task.** Produce the deterministic Kahn order or validate a candidate topological order.

**Response mode.** Ordered sequence or yes/no.

**Question templates.**

- `Topologically sort this DAG using smallest-label Kahn tie-breaking.`
- `Is {candidate} a valid topological order of {dag}?`

**Answer derivation.** Maintain indegrees and a sorted zero-indegree set; for validity, ensure each directed edge’s source precedes its target.

**Instance constraints and rejection rules.** Production form uses DAGs. Candidate-validity variants may include one cyclic graph only when “no topological order” is offered. Every production answer includes tie rule.

**Difficulty.** Chain; several initial choices; choices appearing later; candidate validity; cycle detection.

**Distractors.** DFS order, reversed dependency, or valid except for one edge.

**Feedback.** Show zero-indegree choices and indegree updates, or identify the first violated edge.

**Examples.**

1. `A→B→C` → `A,B,C`. L1.
2. `{A→C,B→C,C→D}` → `A,B,C,D`. L2.
3. candidate `B,A,D,C` for `{A→C,B→C,B→D}` → valid. L3.

**Implementation and validation.** Kahn oracle; candidate permutation and edge-order checks.

## 6. Category: Logic

### Category purpose

Train exact evaluation and transformation of Boolean structure rather than memorization of connective names.

### Learn

Evaluate from the innermost parentheses outward. `p→q` is false only when `p` is true and `q` is false. De Morgan’s laws both negate each part and swap `∧/∨`:

- `¬(p∧q) ≡ ¬p∨¬q`
- `¬(p∨q) ≡ ¬p∧¬q`

Two expressions are equivalent only if every truth-table row agrees.

### Prerequisites

Boolean values and set-like grouping.

### Category boundaries

No open proof writing, modal logic, three-valued logic, or circuit minimization.

### Subcategories

1. Expression evaluation
2. Truth tables
3. Transformations and equivalence
4. Controlled quantifier negation

### Family `boolean_expression_value`

**Skill and learner task.** Evaluate a proposition under a supplied truth assignment.

**Response mode.** True/false.

**Question template.** `Given {assignment}, evaluate {expression}.`

**Answer derivation.** Recursively evaluate the expression AST using the normative truth functions.

**Instance constraints and rejection rules.** 1–4 variables; all variables assigned; fully parenthesized at early levels; avoid redundant subexpressions unless targeting simplification.

**Difficulty.** One connective; negation; implication; nested mixed operators; repeated variable dependency.

**Distractors.** For choice explanations, implication-as-causal/and, exclusive-or interpretation of `∨`, or missed negation.

**Feedback.** Show intermediate truth values on the expression tree.

**Examples.**

1. `p=T, q=F; p∧q` → `F`. L1.
2. `p=T, q=F; ¬p∨q` → `F`. L2.
3. `p=F,q=T,r=F; (p→q)∧¬(q∧r)` → `T`. L4.

**Implementation and validation.** AST evaluator plus independently enumerated connective truth tables.

### Family `truth_table_column`

**Skill and learner task.** Produce the truth values of an expression for all rows in declared order.

**Response mode.** Ordered T/F sequence.

**Question template.** `Complete the output column for {expression}; rows are {row_order}.`

**Answer derivation.** Enumerate assignments and evaluate the AST per row.

**Instance constraints and rejection rules.** 2 variables initially, 3 later; maximum 8 rows; row order always visible.

**Difficulty.** Two-variable connective; nested expression; implication/equivalence; three variables; identify satisfying-row count.

**Feedback.** Show subexpression columns where helpful.

**Examples.**

1. `p∧q`, rows `TT,TF,FT,FF` → `T,F,F,F`. L1.
2. `p∧¬q` → `F,T,F,F`. L2.
3. `(p→q)↔(¬q→¬p)` → `T,T,T,T`. L4.

**Implementation and validation.** Exhaustive evaluation; output length exactly `2^variables`.

### Family `logical_transformation`

**Skill and learner task.** Select or produce a controlled equivalent expression after removing an outer negation or implication.

**Response mode.** Single-choice; symbolic short text only from a constrained grammar.

**Question template.** `Which expression is equivalent to {expression}?`

**Answer derivation.** Apply one or more declared rewrite rules: De Morgan, double negation, implication elimination, or quantifier negation.

**Instance constraints and rejection rules.** Exactly one choice equivalent; transformations small enough to verify by truth table or finite template semantics.

**Difficulty.** One De Morgan step; nested negation; implication plus negation; quantified predicate; multi-step controlled rewrite.

**Distractors.** Negate without swapping connective, swap without negating, reverse implication, or retain wrong quantifier.

**Feedback.** Name and show each rewrite step.

**Examples.**

1. `¬(p∧q)` → `¬p∨¬q`. L1.
2. `¬(p→q)` → `p∧¬q`. L3.
3. `¬∀x(P(x)→Q(x))` → `∃x(P(x)∧¬Q(x))`. L5.

**Implementation and validation.** Truth-table equivalence for propositional forms; finite-domain model checks for quantifier templates.

### Family `logical_equivalence`

**Skill and learner task.** Decide whether two propositions are logically equivalent and identify a counterexample assignment when not.

**Response mode.** Yes/no, optionally followed by named truth values.

**Question template.** `Are {left} and {right} logically equivalent?`

**Answer derivation.** Exhaustively compare all assignments; if unequal, choose the first row in normative order as canonical counterexample.

**Instance constraints and rejection rules.** 1–3 variables; balance equivalent/non-equivalent pairs; reject pairs identical after cosmetic formatting only.

**Difficulty.** Known one-step law; distributivity; implication/contrapositive; near-miss; counterexample production.

**Feedback.** Show either a compact shared truth table or the first differing row.

**Examples.**

1. `p→q` and `¬p∨q` → equivalent. L2.
2. `p∨(q∧r)` and `(p∨q)∧(p∨r)` → equivalent. L3.
3. `p→q` and `q→p` → not equivalent; `p=T,q=F` is a counterexample. L3.

**Implementation and validation.** Exhaustive truth assignments.

## 7. Category: Counting and finite probability

### Category purpose

Train selection of an appropriate exact counting model and conversion of favorable/possible counts into probability.

### Learn

Use the product rule for sequential independent choices and the sum rule for disjoint alternatives. Ordering matters for permutations but not combinations:

- ordered selection: `P(n,k)=n!/(n-k)!`;
- unordered selection: `C(n,k)=n!/(k!(n-k)!)`.

For equally likely finite outcomes,

`P(event)=favorable outcomes / total outcomes`.

State restrictions—replacement, order, repetition, and conditioning—before calculating.

### Prerequisites

Integer multiplication, factorials, fractions, and sets.

### Category boundaries

No continuous probability, normal approximations, statistical estimation, or ambiguous natural-language probability.

### Subcategories

1. Sum and product rules
2. Arrangements and selections
3. Constrained bit strings
4. Inclusion–exclusion and pigeonhole
5. Exact probability

### Family `sum_product_count`

**Skill and learner task.** Count outcomes using one or two applications of the sum/product rules.

**Response mode.** Integer input.

**Question template.** `{controlled_counting_scenario} How many outcomes are possible?`

**Answer derivation.** Build a short choice tree; multiply along branches and add disjoint branches.

**Instance constraints and rejection rules.** Choices and dependencies explicit; alternatives added only when disjoint or corrected for overlap.

**Difficulty.** One product; one sum; unequal branches; one forbidden category; mixed sum/product.

**Feedback.** Show the choice tree or branch arithmetic.

**Examples.**

1. 3 shirts and 4 trousers → `3×4=12` outfits. L1.
2. binary strings of length 5 → `2⁵=32`. L1.
3. identifiers are one of 3 letters followed by 2 digits, or one of 4 reserved words → `3×10×10+4=304`. L3.

**Implementation and validation.** Scenario AST with exact recursive count.

### Family `permutation_combination`

**Skill and learner task.** Count ordered arrangements or unordered selections, including limited repeated-item cases.

**Response mode.** Integer input.

**Question template.** `{selection_scenario} How many distinct results?`

**Answer derivation.** Determine whether order matters and repetition is allowed, then apply the declared factorial/binomial/multiset formula.

**Instance constraints and rejection rules.** Small values with exact integer result; prompt states distinctness and replacement. Avoid huge factorial typing.

**Difficulty.** Full permutation; choose subset; partial ordered selection; repetition allowed; repeated symbols.

**Distractors.** Swap `P/C`, use `n^k` when no replacement, or forget duplicate division.

**Feedback.** Explicitly answer “does order matter?” and “can an item repeat?” first.

**Examples.**

1. arrange 5 distinct tasks → `5!=120`. L1.
2. choose 3 of 8 servers → `C(8,3)=56`. L2.
3. distinct arrangements of `LEVEL` → `5!/(2!·2!)=30`. L4.

**Implementation and validation.** BigInt factorial/binomial oracle and brute-force enumeration for small cases.

### Family `constrained_bit_strings`

**Skill and learner task.** Count fixed-length bit strings satisfying a controlled constraint.

**Response mode.** Integer input.

**Question template.** `How many length-{length} bit strings satisfy {constraint}?`

**Answer derivation.** Use free-position powers, binomial selection, complement counting, or a small recurrence/DP depending on constraint type.

**Instance constraints and rejection rules.** Length 1–16; one primary constraint initially; generated answer verified by exhaustive enumeration.

**Difficulty.** Fixed endpoints; exact number of ones; at least/at most via sums; no adjacent ones; combined endpoint and weight constraint.

**Feedback.** Identify free positions or show the short recurrence.

**Examples.**

1. length 8, begins and ends with 1 → `2⁶=64`. L1.
2. length 6, exactly two 1s → `C(6,2)=15`. L2.
3. length 5, no consecutive 1s → `13`. L4.

**Implementation and validation.** Formula/DP oracle plus exhaustive bit-mask enumeration.

### Family `inclusion_exclusion_two_sets`

**Skill and learner task.** Compute a union, intersection, or neither count from two-set data.

**Response mode.** Integer input.

**Question template.** `In a universe of {total}, {a_count} have A, {b_count} have B, and {intersection} have both. Find {requested}.`

**Answer derivation.** `|A∪B|=|A|+|B|-|A∩B|`; neither is total minus union; only-A/only-B subtract intersection.

**Instance constraints and rejection rules.** Counts must describe a realizable set system: intersection no larger than either set and union no larger than total.

**Difficulty.** Union; only one set; neither; missing intersection; inverse unknown.

**Distractors.** Double-count intersection, subtract twice, or confuse “A or B” with exclusive or.

**Feedback.** Show a two-set region table or Venn counts.

**Examples.**

1. `|A|=8, |B|=7, |A∩B|=3` → union `12`. L1.
2. total 20 with same counts → neither `8`. L2.
3. union 30, `|A|=18, |B|=17` → intersection `5`. L3.

**Implementation and validation.** Construct region counts first, then derive all displayed totals.

### Family `pigeonhole_guarantee`

**Skill and learner task.** Find the minimum number of objects that guarantees a stated bucket occupancy.

**Response mode.** Integer input.

**Question template.** `With {bins} possible categories, how many selections guarantee at least {target} in one category?`

**Answer derivation.** Maximize selections without reaching target: `(target-1)×bins`; add 1.

**Instance constraints and rejection rules.** Every object belongs to exactly one of the declared bins; all distributions otherwise possible.

**Difficulty.** Guarantee duplicate; higher occupancy; inverse bins; contextual mapping; distinguish guarantee from possibility.

**Feedback.** Show the fullest avoiding distribution, then one more object.

**Examples.**

1. 7 weekdays → `8` people guarantee two share a weekday. L1.
2. 5 buckets → `11` objects guarantee at least 3 in one bucket. L2.
3. 12 hash buckets → `37` keys guarantee at least 4 in one bucket. L3.

**Implementation and validation.** Closed-form oracle and brute-force occupancy checks for small parameters.

### Family `finite_probability`

**Skill and learner task.** Compute an exact probability in a small equally likely finite sample space, optionally under a stated condition.

**Response mode.** Reduced fraction input.

**Question template.** `{probability_scenario} What is the exact probability of {event}?`

**Answer derivation.** Enumerate or count the relevant sample space, apply any condition by restricting it, count favorable outcomes, and reduce the fraction.

**Instance constraints and rejection rules.** Equiprobability stated; replacement/order explicit; denominator small enough for a transparent solution; impossible conditioning events rejected.

**Difficulty.** One die/choice; two independent events; without replacement; conditional sample space; counting formula required.

**Distractors.** Add instead of multiply, assume replacement, divide by the unconditional denominator, or count unordered outcomes as equiprobable when they are not.

**Feedback.** Show the sample-space definition, favorable count, total count, and reduction.

**Examples.**

1. fair six-sided die, even result → `3/6=1/2`. L1.
2. bag with 3 red and 2 blue, without replacement: second red given first red → `2/4=1/2`. L3.
3. two fair dice: sum 8 given at least one die is 3 → `2/11`. L5.

**Implementation and validation.** Exact rational oracle plus exhaustive outcome enumeration for every generated instance.

## 8. Cross-family progression

Recommended order:

1. dominant terms and pairwise growth;
2. asymptotic expression simplification;
3. simple loop costs;
4. concrete recurrence values;
5. recursion-tree shape and level work;
6. Master recurrence classes;
7. operation costs with explicit models;
8. array/heap/BST/hash state traces;
9. BFS, then DFS and components;
10. Dijkstra after BFS distance mastery;
11. topological sort after directed traversal;
12. Boolean evaluation, then truth tables and equivalence;
13. product/sum counting before combinations;
14. inclusion–exclusion and finite probability;
15. mixed review that asks the learner to choose the applicable model.

Interleave forward and inverse questions only after direct forms are reliable. Keep cost-case distinctions (`expected/amortized/worst`) in contrast sets. Graph algorithms should share some generated graphs across separate questions so learners can compare behavior without redrawing mental state, but the app must not expose answers from one item in another.

## 9. Adaptive practice guidance

Track mastery by:

- category, family, and response direction;
- normalized growth-class pair;
- asymptotic relation kind;
- loop-shape AST;
- recurrence `a,b,f` comparison and Master case;
- cost regime and structure/operation;
- trace operation and number of state transitions;
- graph direction, density, cycle/cross-edge pattern, and tie type;
- logic connective and misconception;
- counting model, order/replacement status, and constraint type;
- probability denominator construction and conditioning.

Failure routing:

| Error pattern | Next practice |
|---|---|
| chooses largest coefficient as dominant | same terms with reversed coefficients |
| treats `O` as exact equality | paired `O`/`Θ` truth statements |
| multiplies sequential-loop costs | sequential versus nested minimal pair |
| calls a doubling loop linear | exact iteration counts before class |
| swaps `log_b a` | recurrence tree leaf-count diagnostic |
| always answers `f(n)` for recurrence | compare `f(n)` with `n^(log_b a)` |
| confuses amortized and worst append | resize trace followed by cost question |
| says linked insertion is always `Θ(1)` | with/without node-handle contrast |
| gives hash lookup as unqualified `Θ(1)` | expected versus adversarial collision pair |
| heap search answered `Θ(log n)` | heap order versus BST order contrast |
| BFS vertex appears twice | mark-on-enqueue shared-child diagnostic |
| DFS answer resembles BFS layers | same graph side-by-side trace |
| Dijkstra settles by label rather than distance | one decisive tentative-distance contrast |
| topological answer violates one edge | candidate validation around that edge |
| treats implication as conjunction | rows `TF` and `FT` diagnostic |
| applies De Morgan without swapping | matched two-choice transformation |
| uses permutations for unordered choice | same objects with order explicitly toggled |
| assumes replacement | matched with/without-replacement probability |
| uses unconditional denominator | explicitly enumerate conditioned sample space |

Slow but correct traces should reduce graph/state size while preserving the same branching or collision structure. Multi-concept failures should route to the smallest diagnostic family, not merely lower all numerical parameters.

Recommended adaptive mix: 40% weakest family/dimension, 25% spaced mastery, 20% misconception contrasts, 10% inverse/validation forms, and 5% combined stretch.

## 10. Feedback and visualization requirements

Feedback should expose the state or comparison that makes the answer inevitable:

- growth-class ordering rather than sampled values;
- normalized term table for asymptotics;
- recursion-tree level table;
- explicit cost expression per structure;
- size/capacity, heap swap, BST path, or hash probe trace;
- BFS queue and DFS stack;
- Dijkstra tentative/settled table;
- Kahn zero-indegree set;
- truth-table subcolumns;
- counting choice tree, region table, or finite outcome list.

Visuals must remain small and useful:

- tables for state transitions and exact mappings;
- trees for recurrences/BSTs only when they clarify structure;
- SVG graphs with text fallback;
- no decorative charts;
- no animation required to understand a final answer;
- keyboard and screen-reader access to every semantic value.

Do not explain a result by saying that the app ran the algorithm. Show the relevant mental steps.

## 11. Implementation requirements

- controlled ASTs for asymptotic expressions, loops, recurrences, and propositions;
- canonical symbolic normalization rather than free-form CAS parsing;
- BigInt factorial, binomial, recurrence, and counting helpers;
- reduced BigInt rational probability;
- semantic graph object separated from SVG rendering;
- deterministic queue, stack, priority, and zero-indegree tie policies;
- versioned data-structure cost table;
- deterministic seeded generation;
- structural signatures that ignore cosmetic labels;
- backward construction for questions requiring a unique dominant term, unique best structure, specific collision pattern, or chosen misconception;
- no compiler, backend, network call, or external graph package at runtime.

The standalone app may precompute questions during build/test for validation, but normal use generates and solves them locally in JavaScript from semantic templates.

## 12. Automated validation

- Normalize every generated asymptotic expression and verify the displayed answer relation.
- Property-test comparison antisymmetry, transitivity, and equivalence grouping.
- Evaluate loop ASTs for concrete `n` as a supplementary check on symbolic classes.
- Compare recursive and bottom-up recurrence evaluators.
- Enumerate small recursion trees and compare depth, node, and level-work formulas.
- Verify every Master instance satisfies the declared supported-case preconditions.
- Validate every data-structure cost question against the versioned model.
- Assert dynamic-array, heap, BST, and hash invariants after each trace step.
- Confirm workload questions have one correct best choice or an explicit tie.
- Run BFS/DFS/Dijkstra/Kahn through independent reference implementations.
- Verify traversal answers contain exactly the intended reachable vertices once.
- Verify Dijkstra predecessor paths exist and sum to the final distance.
- Verify every generated topological order respects every edge.
- Exhaustively enumerate truth assignments for all logic questions.
- Verify transformation choices have exactly one equivalent answer.
- Brute-force small combinatorial objects and compare formulas/DP.
- Validate inclusion–exclusion inputs by constructing region sizes.
- Brute-force small pigeonhole distributions at the threshold boundary.
- Enumerate finite probability spaces and reduce exact fractions.
- Ensure all placeholders resolve and all answer aliases normalize uniquely.
- Test at least 10,000 seeds per family/level for ambiguity, degeneration, excessive repetition, and rendering overflow.

## 13. Coverage requirements

- Growth practice balances strict comparisons and same-class equivalences.
- `O`, `Ω`, and `Θ` all appear, with `Θ` dominant for tight-analysis questions.
- Loop practice balances sequential, nested, dependent-bound, and geometric forms.
- All supported Master cases recur without one parameter pattern dominating.
- Cost questions regularly contrast expected, amortized, and worst case.
- Every traced data structure receives both easy and structurally interesting operations.
- Graph practice balances directed/undirected, reachable/unreachable, and tie/no-tie cases.
- BFS/DFS graphs include shared children and cycles often enough to test visited-state reasoning.
- Dijkstra includes successful re-relaxation and equal-distance cases.
- Topological practice includes multiple available vertices and candidate validation.
- Every logic connective and both De Morgan laws recur.
- Equivalent and non-equivalent proposition pairs remain balanced.
- Counting practice balances ordered/unordered and replacement/no-replacement distinctions.
- Probability practice balances direct, compound, and conditioned spaces.
- Combined questions introduce at most one unmastered mechanism.
- Recent structural signatures prevent the same problem with only renamed vertices or changed coefficients.

## 14. Topic-level quality checklist

- [ ] Every question performs a generated computation, trace, comparison, or validation.
- [ ] Static definition and theorem-name recall are excluded.
- [ ] Asymptotic prompts distinguish upper bounds from tight bounds.
- [ ] Expression grammar excludes cancellation and undefined domains.
- [ ] Recurrence base cases and valid input domains are explicit.
- [ ] Master Theorem instances satisfy the implemented theorem subset.
- [ ] Data-structure implementation and case kind are always named.
- [ ] Expected, amortized, and worst-case costs are never conflated.
- [ ] Graph direction, start vertex, adjacency order, and tie rules are visible.
- [ ] Graph geometry carries no hidden semantics.
- [ ] Dijkstra never receives a negative edge.
- [ ] Topological production questions use DAGs.
- [ ] Logic expressions are unambiguous and machine-checkable.
- [ ] Counting questions state order, repetition, and replacement.
- [ ] Probability answers are exact reduced fractions.
- [ ] Multiple-choice distractors correspond to recognizable misconceptions.
- [ ] Worked solutions expose the intended mental operation.
- [ ] Every family has at least three validated examples.
- [ ] The offline standalone page needs no external package or backend.

## 15. Stable navigation

Recommended learner-facing categories:

- Asymptotic Growth
- Recurrences
- Data Structures
- Graph Algorithms
- Logic
- Counting & Probability

Stable family identifiers are the backticked identifiers above. Track progress at family and misconception level; category-only mastery is too coarse for this topic.
