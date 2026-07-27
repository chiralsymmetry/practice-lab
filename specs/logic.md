# Logic — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, symbolic-expression parser, finite-model oracle, proof-step checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Logic

### Topic goal

Develop fluent, reliable formal reasoning. The learner should become able to:

- read and write common logical symbols without hesitation;
- determine truth conditions rather than relying on how plausible a sentence sounds;
- recognize and apply valid inference patterns such as modus ponens and modus tollens;
- distinguish a valid argument from tempting invalid forms such as affirming the consequent;
- transform propositions using equivalence laws;
- construct and check short propositional proofs;
- reason correctly about `all`, `some`, `none`, and nested quantifiers;
- find a counterexample, witness, truth assignment, or finite model when one is decisive.

The app trains concrete acts of reasoning. It is not primarily a vocabulary quiz or a survey of the history and philosophy of logic.

### Audience and prerequisites

The initial audience is an adult learner from beginner through a solid introductory undergraduate level.

Expected prerequisites:

- reading short controlled English sentences;
- distinguishing a statement from a question or command;
- comfort with tables and parentheses;
- elementary set membership for finite-model questions.

No algebra, programming, or prior proof course is required. Early levels introduce notation before using it in longer arguments.

### Scope

The topic includes:

- propositional variables and the symbols `¬`, `∧`, `∨`, `→`, and `↔`;
- inclusive disjunction, material implication, biconditional, and explicit connective scope;
- translation between controlled natural language and symbolic propositions;
- truth assignments, truth tables, tautology, contradiction, contingency, satisfiability, consistency, and logical equivalence;
- De Morgan laws, double negation, implication elimination, contraposition, commutativity, associativity, distributivity, absorption, and selected identity laws;
- conjunctive and disjunctive normal form for small formulas;
- arguments, premises, conclusions, validity, soundness as a separately stated concept, and countermodels;
- modus ponens, modus tollens, hypothetical syllogism, disjunctive syllogism, conjunction, simplification, addition, resolution, and selected constructive dilemmas;
- affirming the consequent, denying the antecedent, illicit disjunction, and other generated near-miss forms;
- short Fitch-style propositional derivations using a declared rule set;
- conditional proof, proof by contradiction, and disjunction elimination in tightly controlled proof questions;
- predicate symbols, constants, variables, finite nonempty domains, `∀`, `∃`, identity, and predicate negation;
- controlled translation, quantifier negation, quantifier order, finite-model evaluation, witnesses, counterexamples, and elementary quantified inference;
- categorical forms such as “Every A is B,” “No A is B,” “Some A is B,” and “Some A is not B,” interpreted through predicate logic.

The intended ceiling is introductory formal logic. Upper levels may combine propositional and first-order reasoning, but every generated problem must still have a small, exact, locally checkable answer.

### Exclusions

Do not include in the initial app:

- arbitrary free-form proof entry or automated grading of unrestricted proofs;
- informal-fallacy diagnosis in long political, legal, advertising, or emotionally loaded passages;
- deciding whether real-world premises are factually true;
- rhetoric, debate technique, persuasion, or argument quality beyond formal validity and explicitly supplied premise truth;
- Aristotelian existential-import conventions unless a question explicitly introduces and labels them;
- nonclassical logics, including intuitionistic, paraconsistent, many-valued, fuzzy, relevance, temporal, deontic, or modal logic;
- proof theory beyond the declared natural-deduction subset;
- sequent calculus, semantic tableaux, resolution refutation as a general proof procedure, SAT-solver internals, or automated theorem-proving strategy;
- Gödel incompleteness, metalogical completeness/compactness proofs, Löwenheim–Skolem theorems, model theory over infinite structures, or computability theory;
- second-order logic, type theory, lambda calculus, set-theoretic paradoxes, or formal foundations;
- function symbols in first-order terms initially, except as a later explicitly versioned extension;
- quantifier alternation deeper than three or formulas whose difficulty is mostly symbol transcription;
- domains whose intended membership depends on outside knowledge;
- “or” in natural-language templates when exclusive versus inclusive meaning is not explicitly controlled;
- self-referential statements, semantic paradoxes, and vague predicates;
- hidden assumptions from conversational implicature, tense, presupposition, or pronoun resolution.

Digital logic gates and Boolean bit operations belong in computer/electronics topics. This app may use the same truth functions, but its focus is formal reasoning and arguments.

### Normative logical notation

The canonical notation is:

| Symbol | Meaning | Canonical reading |
|---|---|---|
| `¬P` | negation | not P |
| `P ∧ Q` | conjunction | P and Q |
| `P ∨ Q` | inclusive disjunction | P or Q, or both |
| `P → Q` | material conditional | if P, then Q |
| `P ↔ Q` | biconditional | P if and only if Q |
| `⊤` | truth constant | true |
| `⊥` | falsity/contradiction | false |
| `∀x P(x)` | universal quantification | every object is P |
| `∃x P(x)` | existential quantification | at least one object is P |
| `x = y` | identity | x and y denote the same object |
| `Γ ⊢ φ` | syntactic derivability | φ is derivable from Γ |
| `Γ ⊨ φ` | semantic consequence | every model of Γ is a model of φ |

`∨` is always inclusive. `P → Q` is false only when `P` is true and `Q` is false. A biconditional is true when its two sides have the same truth value.

Canonical truth symbols are `T` and `F`.

When parentheses are omitted in an exercise specifically about precedence, use:

1. `¬`
2. `∧`
3. `∨`
4. `→`
5. `↔`

`→` associates to the right. Chained biconditionals must be parenthesized; the app must not rely on an associativity convention for `↔`. Outside precedence exercises, propositions should be fully parenthesized except for harmless associative chains such as `P ∧ Q ∧ R`.

The UI should display `∴` only as a visual marker before an argument conclusion. It is not an operator inside a proposition.

### Normative semantic model

- The logic is classical and bivalent: every proposition under an assignment is exactly `T` or `F`.
- Propositional variables normally use `P`, `Q`, `R`, and `S`.
- Truth-table rows use lexicographic order with `T` before `F`. For `(P,Q)`, the order is `TT, TF, FT, FF`.
- An argument is valid exactly when no assignment or model makes every premise true and the conclusion false.
- A proposition is satisfiable if at least one assignment makes it true.
- A set of propositions is consistent if at least one assignment makes all of them true.
- `P` and `Q` are logically equivalent exactly when they have the same truth value under every assignment.
- A countermodel to an argument must make every premise true and the conclusion false.
- Validity does not imply that the premises are actually true. Soundness means validity plus true premises, and the app may assess soundness only when premise truth is explicitly supplied rather than assumed from the world.

### Normative first-order model

- Every domain is finite, explicitly displayed, nonempty, and small enough to enumerate.
- Unary predicates are displayed as named subsets of the domain.
- Binary predicates are displayed as sets of ordered pairs or as a labeled relation table/diagram.
- Constants visibly denote named domain elements.
- Variables range over the entire displayed domain.
- Predicate extensions and constant denotations are complete; no outside facts are needed.
- `∀x φ(x)` is true when `φ` is true for every domain element.
- `∃x φ(x)` is true when `φ` is true for at least one domain element.
- `¬∀x φ` is equivalent to `∃x ¬φ`; `¬∃x φ` is equivalent to `∀x ¬φ`.
- Quantifier order is significant: `∀x∃y R(x,y)` and `∃y∀x R(x,y)` are not generally equivalent.
- The app uses modern first-order semantics with no existential import from a universal claim. `∀x(A(x)→B(x))` may be true when no object is `A`.
- Bound variables may be alpha-renamed without changing meaning, provided variable capture is avoided.

### Natural-language template contract

Translation questions use a controlled micro-language. Every simple proposition or predicate has a visible legend, for example:

```text
P: The server is reachable.
Q: The cache is warm.
```

or:

```text
Domain: the displayed animals
C(x): x is a cat
S(x): x is sleeping
```

Permitted propositional sentence frames include:

- `P and Q`
- `P or Q, or both`
- `not P`
- `if P, then Q`
- `P only if Q`
- `P if Q`
- `P if and only if Q`
- `neither P nor Q`
- `P unless Q`, only after the app explicitly teaches its stipulated material reading
- nested combinations with explicit punctuation and scope cues.

The generator must not assume that ordinary English “or” is inclusive unless the prompt says “or both” or the Learn card establishes the convention immediately beside the task.

Permitted quantified frames include:

- `Every A is B`
- `No A is B`
- `Some A is B`
- `Some A is not B`
- `Every A relates to some B`
- `Some B is related to by every A`, with the relation direction made explicit.

Names and surface stories may vary, but the semantic form—not the story wording—defines the structural signature.

### Formula grammar and parsing

The internal proposition grammar is:

```text
Prop :=
    Atom
  | Top
  | Bottom
  | Not(Prop)
  | And(Prop, Prop)
  | Or(Prop, Prop)
  | Implies(Prop, Prop)
  | Iff(Prop, Prop)
```

The initial first-order grammar is:

```text
Term := Variable | Constant

Formula :=
    Predicate(Term, ...)
  | Equal(Term, Term)
  | Not(Formula)
  | And(Formula, Formula)
  | Or(Formula, Formula)
  | Implies(Formula, Formula)
  | Iff(Formula, Formula)
  | ForAll(Variable, Formula)
  | Exists(Variable, Formula)
```

Predicate arity is one or two. Function terms are excluded.

Semantic ASTs must be generated first and rendered afterward. The app must never derive the answer by reparsing its own display string as the sole oracle.

### Natural-deduction rule set

The initial proof system uses these visible rule labels:

- `Premise`
- `Assumption`
- `∧ Introduction` (`∧I`)
- `∧ Elimination` (`∧E`)
- `∨ Introduction` (`∨I`)
- `∨ Elimination` (`∨E`)
- `→ Introduction` (`→I`)
- `→ Elimination` (`→E`, modus ponens)
- `¬ Introduction` (`¬I`)
- `¬ Elimination` (`¬E`)
- `↔ Introduction` (`↔I`)
- `↔ Elimination` (`↔E`)
- `⊥ Elimination` (`⊥E`)
- `Classical contradiction` (`RAA`)

The exact schemas are:

| Rule | Accessible inputs or subproofs | Result |
|---|---|---|
| `∧I` | `A`, `B` | `A∧B` |
| `∧E` | `A∧B` | either `A` or `B` |
| `∨I` | `A` | `A∨B` or `B∨A` |
| `∨E` | `A∨B`; subproof `A ... C`; subproof `B ... C` | `C` |
| `→I` | subproof `A ... B` | `A→B` |
| `→E` | `A→B`, `A` | `B` |
| `¬I` | subproof `A ... ⊥` | `¬A` |
| `¬E` | `A`, `¬A` | `⊥` |
| `↔I` | subproof `A ... B`; subproof `B ... A` | `A↔B` |
| `↔E` | `A↔B` with `A`, or `A↔B` with `B` | respectively `B` or `A` |
| `⊥E` | `⊥` | any formula `A` |
| `RAA` | subproof `¬A ... ⊥` | `A` |

`RAA` makes the proof system explicitly classical. It should be introduced only at higher levels and labeled rather than smuggled in as an unstated double-negation step.

The implementation must store each line as a formula AST, rule identifier, cited line numbers/ranges, and assumption scope. A line is legal only if its cited formulas match the exact schema of the named rule and every cited line is accessible in the current scope.

Named argument-form drills may additionally use:

- modus ponens (`P→Q, P ∴ Q`);
- modus tollens (`P→Q, ¬Q ∴ ¬P`);
- hypothetical syllogism (`P→Q, Q→R ∴ P→R`);
- disjunctive syllogism (`P∨Q, ¬P ∴ Q`, and its symmetric form);
- conjunction (`P, Q ∴ P∧Q`);
- simplification (`P∧Q ∴ P` or `Q`);
- addition (`P ∴ P∨Q`);
- resolution (`P∨Q, ¬P∨R ∴ Q∨R`);
- constructive dilemma in a fully displayed form.

Named rules are pedagogical shortcuts over the proof system. The app must not silently treat an invalid form as a rule.

### Global answer conventions

- Ignore surrounding whitespace.
- Unicode-normalize visually equivalent logical symbols and common keyboard aliases.
- Accept `!`, `~`, or `not` for `¬`; `&` or `and` for `∧`; `|` or `or` for `∨`; `->` for `→`; and `<->` or `iff` for `↔` only in symbolic text fields.
- Accept `forall` for `∀` and `exists` for `∃`.
- Do not accept ambiguous `v` as disjunction when it may be confused with a variable.
- Boolean answers accept `T/F`, `true/false`, or semantic buttons.
- Formula answers are compared as ASTs after parsing and alpha-normalization, not as raw strings.
- If a task asks for an equivalent formula, semantic equivalence within the declared grammar is sufficient unless a required form such as CNF is stated.
- If CNF or DNF is required, the answer must both be equivalent and satisfy the requested syntactic form.
- Truth assignments use named fields or a table; never require position-dependent strings such as `TFFT` without headers.
- A set of premises is unordered.
- Proof sequences are ordered and line references are semantic.
- Rule-name answers accept the canonical name and displayed abbreviation.
- Natural-language translation tasks should normally use structured formula builders or multiple choice. Free-form English paraphrases are not automatically graded.
- Multiple valid witnesses or countermodels must all be accepted. If the UI uses single-choice, every listed correct witness must be collapsed into one semantic answer or only one must be offered.

### Difficulty philosophy

Difficulty should increase through:

- weaker cues about which connective or rule applies;
- deeper but still readable scope;
- interaction between two independently mastered connectives;
- forward versus inverse use of a rule;
- distinguishing validity from a near-miss fallacy;
- moving between syntax, truth conditions, and argument structure;
- finding rather than merely checking a countermodel;
- nested quantifiers and changes in quantifier order;
- assumption scope and discharge in short proofs;
- combining at most two or three mastered transformations.

Difficulty must not increase through:

- excessively long formulas;
- more than four propositional variables in ordinary drills;
- huge truth tables;
- arbitrary symbol fonts or cramped typography;
- deliberately confusing variable names;
- long fictional stories;
- outside factual knowledge;
- time pressure;
- repetitive mechanical rows after the target insight is already demonstrated.

### Topic-wide level model

| Level | Typical reasoning |
|---|---|
| 1 | One connective, one rule, direct symbol recognition, or one quantifier over a tiny model |
| 2 | Two connectives, a complete two-variable truth table, direct modus ponens/tollens, or one categorical quantifier |
| 3 | Nested scope, inverse/missing-piece questions, equivalence transformations, three-premise arguments, or two quantifiers without alternation |
| 4 | Countermodels, CNF/DNF, short proof gaps, quantifier alternation, and deliberate valid/invalid contrasts |
| 5 | Mixed semantic/syntactic reasoning, assumption discharge, compact three-variable arguments, and finite first-order countermodels |

Level is metadata, not a substitute for recording independent difficulty dimensions.

### Generator and oracle model

Every question instance stores at least:

`categoryId`, `subcategoryId`, `familyId`, `level`, `formulaAst`, `premiseAsts`, `conclusionAst`, `freeVariables`, `domainModel`, `proofState`, `canonicalAnswer`, `equivalenceMode`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `structuralSignature`, `notationVersion`, and `oracleVersion`.

Only fields relevant to the family need non-null values.

The generator should:

1. construct a semantic AST, argument schema, proof state, or finite model;
2. derive the canonical answer with an exact evaluator;
3. independently validate the result by exhaustive truth assignments or finite-domain enumeration;
4. generate distractors from named misconception transforms;
5. render symbols, text, tables, and diagrams from the semantic object.

All generation and checking must run locally in the standalone HTML/JavaScript app. No backend, network service, language model, or general theorem prover is required at runtime.

## 2. Category: Symbols, translation, and scope

### Category purpose

Build a dependable connection between ordinary controlled sentences, logical symbols, and the tree structure of a formula. Learners should see `P→Q` as a directional claim with a specific antecedent and consequent, not as decorative notation.

### Learn

Logical connectives combine complete propositions:

- `¬P`: not P;
- `P∧Q`: both P and Q;
- `P∨Q`: P or Q, possibly both;
- `P→Q`: if P, then Q;
- `P↔Q`: P exactly when Q.

“P only if Q” means `P→Q`; Q is necessary for P. “P if Q” means `Q→P`; Q is sufficient for P. Parentheses show which parts a connective joins.

### Prerequisites

None.

### Common misconceptions

- Reversing `P→Q` when translating “P only if Q.”
- Treating `P∨Q` as exclusive.
- Translating “neither P nor Q” as `¬P∨¬Q` rather than `¬P∧¬Q`.
- Applying negation to only the nearest atom when it scopes over a compound.
- Reading the visually first connective as the main connective.
- Treating `↔` as merely one direction of implication.

### Subcategories

1. Connective recognition
2. Controlled-language symbolization
3. Formula verbalization
4. Scope and parse structure
5. Conditional direction

### Family `symbolize_proposition`

**Skill and learner task.** Translate one controlled-language proposition into a symbolic formula.

**Response mode.** Structured formula builder; single-choice at Levels 1–2; constrained symbolic text later.

**Question template.**

```text
{legend}

Symbolize: “{sentence}”
```

**Generation.** Construct a proposition AST from 1–4 atoms, then render it through a sentence frame whose scope is unambiguous. Level 1 uses one connective. Level 2 introduces “only if,” “if and only if,” and neither/nor. Levels 3–5 nest connectives and may invert the surface order of clauses.

**Answer derivation.** Return the source AST, alpha-normalized only where applicable.

**Constraints and rejection rules.**

- Every sentence must have one intended formula under the displayed convention.
- Punctuation or clause boundaries must make nested scope clear.
- Reject unnatural generated prose, accidental real-world implication, and frames where “unless” has more than one plausible reading.
- Do not create difficulty merely by replacing a short atomic legend with a long sentence.

**Distractors.** Converse conditional; inverse conditional; exclusive-or reading; swapped De Morgan connective; negation with too narrow a scope.

**Feedback.** Identify the main connective, then translate each side. For a conditional, explicitly name antecedent and consequent.

**Examples.**

1. `P: It is raining. Q: The pavement is wet.` “It is raining and the pavement is wet.” → `P∧Q`. L1.
2. “The alarm sounds only if the sensor is active.” → `A→S`. L2; targets reversal of “only if.”
3. “If the cache is warm, then the request is fast or the fallback runs, or both.” → `C→(F∨B)`. L3.

**Validation.** Parse the rendered correct answer back to an AST as a supplementary round-trip test. Exhaustively distinguish every distractor from the answer; reject accidental equivalence.

### Family `verbalize_formula`

**Skill and learner task.** Choose the controlled-language sentence that exactly matches a displayed formula.

**Response mode.** Single-choice.

**Question template.** `Which sentence expresses {formula} under the legend below?`

**Generation.** Generate a formula with 1–3 connectives and render one correct sentence plus misconception-based paraphrases.

**Answer derivation.** The correct option is the one whose template AST equals the displayed AST.

**Constraints and rejection rules.** Options must differ semantically, not merely stylistically. Reject pairs that are equivalent under commutativity unless both are intentionally treated as correct.

**Distractors.** Narrower/wider negation; converse; inverse; “and”/“or” swap; one missing direction of a biconditional.

**Feedback.** Show the formula split at its main connective and pair each subformula with its clause.

**Examples.**

1. `¬P` → “P is not the case.” L1.
2. `P→Q` → “P only if Q.” L2.
3. `¬(P∧(Q∨R))` → “It is not the case that both P and either Q or R hold.” L4.

**Validation.** Convert every option to its predefined AST and require exactly one exact or declared-equivalent match.

### Family `identify_main_connective`

**Skill and learner task.** Identify the connective with widest scope in a formula.

**Response mode.** Select a displayed operator occurrence, or single-choice by operator and position.

**Question template.** `Which connective is the main connective of {formula}?`

**Generation.** Use fully parenthesized formulas initially, then precedence-rendered formulas at later levels. Include repeated occurrences of the same operator so position matters.

**Answer derivation.** Return the root operator of the AST and its source span.

**Constraints and rejection rules.** The selected occurrence must be visually addressable. Do not ask only for an operator name if the same symbol occurs more than once and the occurrence matters.

**Distractors.** Innermost operator; first visible operator; negation nearest the first atom; highest-precedence operator.

**Feedback.** Bracket the left and right child of the root operation.

**Examples.**

1. `P∧Q` → `∧`. L1.
2. `¬P→Q` → `→`, because it parses as `(¬P)→Q`. L2.
3. `(P→Q)↔(¬R∨P)` → the central `↔`. L3.

**Validation.** Derive the highlighted source span from the renderer’s AST annotations, not by searching the display string.

### Family `scope_parenthesization`

**Skill and learner task.** Insert parentheses or choose a parse tree that gives a requested reading.

**Response mode.** Single-choice parse tree; structured parenthesis placement.

**Question template.** `Parenthesize {unparenthesized_formula} using the stated precedence rules.`

Alternative: `Which formula means “{scoped_sentence}”?`

**Generation.** Use 2–4 connectives. Later levels contrast formulas that contain the same atoms and operators but differ only in structure.

**Answer derivation.** Apply the normative precedence and associativity table, or use the AST specified by the requested reading.

**Constraints and rejection rules.** Chained biconditionals are excluded. Avoid cases where associativity makes multiple displayed choices equivalent unless equivalence rather than parsing is the task.

**Distractors.** Left-associate implication; make the first operator the root; give negation too-wide scope; ignore precedence.

**Feedback.** Apply one precedence boundary at a time and show the resulting tree.

**Examples.**

1. `¬P∧Q` → `(¬P)∧Q`. L1.
2. `P∨Q→R` → `(P∨Q)→R`. L2.
3. `P→Q→¬R∨S` → `P→(Q→((¬R)∨S))`. L4.

**Validation.** Parse with the declared precedence parser and compare ASTs. Ensure each distractor parses and is structurally distinct.

### Family `conditional_direction`

**Skill and learner task.** Map necessary/sufficient language to antecedent and consequent.

**Response mode.** Two named fields (`antecedent`, `consequent`) or single-choice formula.

**Question template.** `In “{conditional_sentence},” which condition is sufficient and which is necessary?`

**Generation.** Use `if`, `only if`, `provided that`, `whenever`, and explicitly taught necessary/sufficient frames. Keep atomic clause meanings neutral.

**Answer derivation.** Normalize the language frame to `antecedent→consequent`; the antecedent is sufficient and the consequent necessary for that conditional claim.

**Constraints and rejection rules.** Do not use “unless” in this family until its convention is separately taught. Avoid causal wording that invites world knowledge.

**Distractors.** Reverse both roles; label both conditions necessary; label both sufficient; confuse the grammatical “if” clause in “P if Q.”

**Feedback.** Rewrite the sentence as a canonical “If ..., then ...” sentence.

**Examples.**

1. “If P, then Q” → P sufficient, Q necessary. L1.
2. “P only if Q” → P sufficient, Q necessary. L2.
3. “R is required for S” → `S→R`; S sufficient, R necessary. L3.

**Validation.** Every phrase frame has a versioned semantic mapping and unit tests in both directions.

## 3. Category: Truth conditions and semantic classification

### Category purpose

Train exact evaluation of formulas and recognition of semantic properties. The learner should be able to explain why a conditional with a false antecedent is true and why one satisfying row is enough to refute a contradiction claim.

### Learn

A connective is determined by its truth conditions. Evaluate an inner subformula before the connective that contains it. A tautology is true on every row, a contradiction false on every row, and a contingency true on some rows and false on others.

To test an argument semantically, look specifically for a row where every premise is true and the conclusion is false.

### Prerequisites

Symbols, scope, and the connective truth conditions.

### Common misconceptions

- Treating implication as causation or as conjunction.
- Marking `F→F` false.
- Treating biconditional as disjunction.
- Negating only one part of a subformula.
- Classifying a formula from one row.
- Confusing “not a tautology” with “a contradiction.”
- Confusing satisfiability of each separate premise with consistency of all premises together.

### Subcategories

1. One-row evaluation
2. Truth-table construction
3. Tautology, contradiction, and contingency
4. Satisfiability and consistency
5. Semantic comparison

### Family `evaluate_formula_assignment`

**Task.** Evaluate a proposition under a displayed truth assignment.

**Response mode.** `T/F`.

**Question template.**

```text
{assignment}

What is the truth value of {formula}?
```

**Generation.** Use 1–4 variables and 1–6 connective nodes. Select assignments to exercise decisive cases, especially `T→F`, false antecedents, equal/unequal biconditional sides, and short-circuit-looking but semantically nested forms.

**Derivation.** Recursively evaluate the AST bottom-up.

**Constraints and rejection rules.** Every variable in the formula has exactly one displayed value. At upper levels, reject formulas whose answer is determined by a single repeated constant unless that shortcut is the intended skill.

**Distractors.** The opposite truth value, with misconception tags inferred from the evaluation trace rather than arbitrary choice.

**Feedback.** Show a compact subformula table in dependency order.

**Examples.**

1. `P=F`; `¬P` → `T`. L1.
2. `P=F,Q=F`; `P→Q` → `T`. L2; targets implication-as-conjunction.
3. `P=T,Q=F,R=T`; `(P→Q)∨(Q↔R)` → `F`. L3.

**Validation.** Compare recursive evaluation with an independently generated bit-mask truth column.

### Family `connective_missing_value`

**Task.** Recover a missing operand truth value from a connective result.

**Response mode.** `T/F`, or `determined/not determined` with a value field.

**Question template.** `{left} {operator} {right} is {result}. What can be concluded about {missing_operand}?`

**Generation.** Generate backward from a truth-table row. Some upper-level instances intentionally have two possible missing values, and the correct response is “not determined.”

**Derivation.** Enumerate the two candidate values for the missing operand and retain those producing the stated result.

**Constraints and rejection rules.** The response mode must distinguish unique from non-unique recovery. Do not silently choose one value when both work.

**Distractors.** Assume every connective is invertible; reverse implication; apply arithmetic-style cancellation.

**Feedback.** Display the two relevant truth-table rows.

**Examples.**

1. `T∧?=T` → `T`. L1.
2. `F→?=T` → not determined. L2.
3. `?↔F=F` → `T`. L2.

**Validation.** Exhaustively enumerate candidate Boolean values.

### Family `truth_table_column`

**Task.** Complete the truth column for a formula in canonical row order.

**Response mode.** One `T/F` control per row.

**Question template.** `Complete the final column for {formula}.`

**Generation.** Use two variables at early levels and three at later levels. Intermediate subcolumns may be shown as scaffolding or omitted as a difficulty dimension.

**Derivation.** Enumerate assignments in canonical order and evaluate the AST.

**Constraints and rejection rules.** Ordinary practice is capped at eight rows. Four-variable questions may ask only selected diagnostic rows, not a full 16-row transcription.

**Distractors.** Per-row choices are binary; diagnostic feedback compares the supplied column with columns produced by known wrong parses or swapped connectives.

**Feedback.** Reveal intermediate subformula columns and highlight the first divergence.

**Examples.**

1. `P∧Q` over `TT,TF,FT,FF` → `T,F,F,F`. L1.
2. `P→Q` → `T,F,T,T`. L2.
3. `(P∨Q)→(¬P∧R)` over three variables → the exact eight-value column. L4.

**Validation.** Bit-mask evaluator must equal row-by-row recursive evaluation. Verify headers and row order.

### Family `classify_formula`

**Task.** Classify a formula as tautology, contradiction, or contingency.

**Response mode.** Three-way choice.

**Question template.** `Is {formula} a tautology, a contradiction, or a contingency?`

**Generation.** Construct from known equivalence schemas and random small ASTs, then classify exhaustively. Balance all three classes.

**Derivation.** Evaluate every assignment. All true means tautology; all false contradiction; otherwise contingency.

**Constraints and rejection rules.** Reject accidental duplicates and formulas whose classification is visually trivial at higher levels unless they test a newly introduced law.

**Distractors.** The other two semantic classes.

**Feedback.** For a contingency, show one satisfying and one falsifying assignment. For a failed tautology/contradiction claim, show the decisive counter-row.

**Examples.**

1. `P∨¬P` → tautology. L1.
2. `P∧¬P` → contradiction. L1.
3. `(P→Q)∧(Q→P)` → contingency. L3.

**Validation.** Exhaustive assignment oracle; generation coverage must remain balanced.

### Family `satisfying_assignment`

**Task.** Find or recognize an assignment that makes a proposition true or false as requested.

**Response mode.** Named truth-value fields; single-choice assignment at early levels.

**Question template.** `Give an assignment that makes {formula} {target_truth}.`

**Generation.** Construct formulas with at least one target assignment. Later levels may request a falsifying row for a claimed tautology.

**Derivation.** Enumerate assignments and accept any assignment with the target evaluation.

**Constraints and rejection rules.** Reject impossible targets unless the task explicitly expects “none.” Do not require the generator’s first witness.

**Distractors.** Assignments produced by reversing an implication, ignoring a negation, or satisfying only one conjunct.

**Feedback.** Substitute the learner’s assignment and evaluate the formula.

**Examples.**

1. Make `P∧Q` true → `P=T,Q=T`. L1.
2. Make `P→Q` false → `P=T,Q=F`. L2.
3. Falsify `(P∨Q)→(R∧¬P)` → any assignment with antecedent true and consequent false. L4.

**Validation.** Grade semantically; enumerate all accepted assignments and verify at least one exists.

### Family `premise_set_consistency`

**Task.** Decide whether a finite set of propositions can all be true together and, when consistent, provide a joint assignment.

**Response mode.** `consistent/inconsistent`; optional assignment fields.

**Question template.** `Are these propositions jointly consistent? {premises}`

**Generation.** Build premise sets around a latent satisfying assignment or a minimal contradiction. Use 2–4 variables and 2–5 premises.

**Derivation.** Intersect the truth sets of all premises.

**Constraints and rejection rules.** At higher levels, avoid inconsistency caused only by an immediate `P,¬P` pair unless it is diagnostic. When requesting a witness, accept every joint model.

**Distractors.** Judge each premise separately; confuse an individually contingent premise with an inconsistent set; treat contrary atoms as merely uncertain.

**Feedback.** Give a joint model or identify a small inconsistent core.

**Examples.**

1. `{P, Q}` → consistent; `P=T,Q=T`. L1.
2. `{P→Q, P, ¬Q}` → inconsistent. L2.
3. `{P∨Q, P→R, Q→R, ¬R}` → inconsistent. L4.

**Validation.** Exhaustive intersection plus independent SAT-by-enumeration implementation; verify any displayed inconsistent core really is inconsistent.

## 4. Category: Equivalence and formula transformation

### Category purpose

Train meaning-preserving symbolic transformations. The learner should learn laws as reusable operations and verify them by truth conditions, not merely memorize their names.

### Learn

Equivalent formulas have identical truth values on every assignment. Important transformations include:

```text
¬(P∧Q) ≡ ¬P∨¬Q
¬(P∨Q) ≡ ¬P∧¬Q
P→Q ≡ ¬P∨Q
¬(P→Q) ≡ P∧¬Q
P↔Q ≡ (P→Q)∧(Q→P)
P→Q ≡ ¬Q→¬P
```

An equivalent rewrite preserves meaning. The converse `Q→P` and inverse `¬P→¬Q` are equivalent to each other, but not generally to `P→Q`.

### Prerequisites

Truth conditions and formula scope.

### Common misconceptions

- Negating each operand without swapping `∧` and `∨`.
- Treating the converse as the contrapositive.
- Replacing `P→Q` with `P∧Q`.
- Negating a conditional as `¬P→¬Q`.
- Calling formulas equivalent because they match on one assignment.
- Producing a formula that is equivalent but not in the requested normal form.

### Subcategories

1. De Morgan and negation
2. Conditional forms
3. Named equivalence laws
4. CNF and DNF
5. Counterexamples to equivalence

### Family `negate_formula`

**Task.** Produce or choose a formula equivalent to the negation of a displayed proposition.

**Response mode.** Structured formula builder or single-choice.

**Question template.** `Which formula is equivalent to ¬({formula})?`

**Generation.** Begin with conjunction/disjunction, then conditionals, biconditionals, and nested combinations. Generate the answer by pushing negations inward only as far as the requested level requires.

**Derivation.** Apply the operator-specific negation rule recursively, including `¬(P→Q)≡P∧¬Q`.

**Constraints and rejection rules.** The expected answer must not depend on a preferred cosmetic ordering. Accept every semantically equivalent answer unless “negation normal form” is required.

**Distractors.** Negate operands without swapping; negate antecedent instead of consequent; negate only one side; produce the inverse.

**Feedback.** Name the outer connective and show the law applied at that boundary.

**Examples.**

1. Negate `P∧Q` → `¬P∨¬Q`. L1.
2. Negate `P→Q` → `P∧¬Q`. L2.
3. Negate `∀`-free formula `(P∨Q)→R` → `(P∨Q)∧¬R`, optionally then NNF. L4.

**Validation.** Exhaustively verify equivalence to `¬formula`; validate any requested syntactic normal form.

### Family `conditional_forms`

**Task.** Identify or construct the converse, inverse, or contrapositive of a conditional.

**Response mode.** Single-choice or structured formula.

**Question template.** `What is the {form_name} of {antecedent}→{consequent}?`

**Generation.** Antecedent and consequent may be atoms initially and small subformulas later.

**Derivation.**

- converse: `Q→P`;
- inverse: `¬P→¬Q`;
- contrapositive: `¬Q→¬P`.

**Constraints and rejection rules.** Reject cases where `P` and `Q` are equivalent, identical, or symmetric enough to make forms collapse accidentally.

**Distractors.** The other two forms and the original.

**Feedback.** Show a two-column antecedent/consequent transformation and state that only the contrapositive is generally equivalent to the original.

**Examples.**

1. Contrapositive of `P→Q` → `¬Q→¬P`. L1.
2. Converse of `(P∧R)→Q` → `Q→(P∧R)`. L2.
3. Inverse of `¬P→(Q∨R)` → `¬¬P→¬(Q∨R)`, optionally simplified to `P→(¬Q∧¬R)`. L4.

**Validation.** AST transform plus exhaustive relation checks among all four forms.

### Family `equivalent_rewrite`

**Task.** Choose the one formula equivalent to a source formula or identify the law used in a valid rewrite.

**Response mode.** Single-choice formula or rule name.

**Question template.** `Which expression is logically equivalent to {formula}?`

Alternative: `{before} was rewritten as {after}. Which law justifies the step?`

**Generation.** Apply one named law at a selected AST location. Later levels combine two transformations but retain a visible intermediate in feedback.

**Derivation.** Rewrite the selected subtree, then canonicalize harmless association/order only for comparison.

**Constraints and rejection rules.** Exactly one choice may be equivalent unless the task explicitly asks for all equivalent choices. Reject distractors that become equivalent because of absorption or constants.

**Distractors.** A one-symbol error matching a known misconception, a valid law applied in the wrong direction/location, converse, inverse, or distribution error.

**Feedback.** Highlight the changed subtree and state the law.

**Examples.**

1. `¬¬P` → `P` by double negation. L1.
2. `P→Q` → `¬P∨Q` by implication. L2.
3. `P∨(P∧Q)` → `P` by absorption. L4.

**Validation.** Exhaustive equivalence and exact law-schema matching.

### Family `equivalence_decision`

**Task.** Decide whether two formulas are logically equivalent.

**Response mode.** Yes/no.

**Question template.** `Are {left} and {right} logically equivalent?`

**Generation.** Positive pairs come from controlled law sequences. Negative pairs come from one plausible faulty transformation and must have at least one clear counter-row.

**Derivation.** Compare full truth columns.

**Constraints and rejection rules.** Balance yes/no. Reject negative pairs whose only differing row is too obscure for the current level unless countermodel search is the intended difficulty.

**Feedback.** If yes, show a rewrite chain or matching columns. If no, show the smallest canonical counter-assignment.

**Examples.**

1. `P→Q` and `¬P∨Q` → yes. L2.
2. `P→Q` and `Q→P` → no; `P=T,Q=F`. L2.
3. `¬(P↔Q)` and `(P∨Q)∧¬(P∧Q)` → yes. L4.

**Validation.** Exhaustive comparison; verify positive rewrite chains and negative counterexamples independently.

### Family `equivalence_counterassignment`

**Task.** Supply a truth assignment showing that two formulas are not equivalent.

**Response mode.** Named truth-value fields.

**Question template.** `Find an assignment on which {left} and {right} have different truth values.`

**Generation.** Begin with a known faulty transformation, enumerate distinguishing rows, and render one or more accepted counterassignments.

**Derivation.** Evaluate both formulas over all assignments and accept any row where values differ.

**Constraints and rejection rules.** Require at least one counterassignment. Reject equivalent pairs. Avoid four variables.

**Feedback.** Substitute the learner’s row into both formulas side by side.

**Examples.**

1. `P→Q` versus `Q→P` → `P=T,Q=F`. L2.
2. `¬(P∧Q)` versus `¬P∧¬Q` → `P=T,Q=F` or `F,T`. L3.
3. `P∨(Q∧R)` versus `(P∨Q)∧R` → for example `P=T,Q=F,R=F`. L4.

**Validation.** Semantic grading over all accepted rows.

### Family `normal_form_conversion`

**Task.** Convert a small proposition to conjunctive normal form (CNF) or disjunctive normal form (DNF).

**Response mode.** Structured clause editor; single-choice at first exposure.

**Question template.** `Give an equivalent {CNF_or_DNF} formula for {formula}.`

**Generation.** Use 2–3 variables. Early items require implication elimination and De Morgan; later items may derive canonical clauses from a truth table.

**Derivation.** Eliminate `→/↔`, push negation to atoms, distribute as required, remove duplicate literals/clauses, and optionally apply absorption. The answer need not be canonical unless the prompt says “canonical CNF/DNF.”

**Constraints and rejection rules.** Avoid exponential output. Cap at four clauses/terms and three literals per clause/term. Reject tautology/contradiction unless constants are explicitly supported in the answer editor.

**Distractors.** Correct equivalent in the wrong normal form; swapped distribution; De Morgan error; omitted falsifying/satisfying row.

**Feedback.** Show the transformation stages and verify with a small truth table.

**Examples.**

1. `P→Q` in CNF → `¬P∨Q`. L2.
2. `¬(P∨Q)` in CNF → `¬P∧¬Q`. L2.
3. `(P→Q)∧(R→P)` in CNF → `(¬P∨Q)∧(¬R∨P)`. L4.

**Validation.** Check both semantic equivalence and syntactic normal-form predicates. Do not compare only to one generated string.

## 5. Category: Arguments, inference rules, and fallacies

### Category purpose

Train movement from premises to conclusions and the semantic test for validity. Rule-name recall is secondary; the learner must recognize what a rule licenses and when a superficially similar pattern does not.

### Learn

An argument is valid when true premises cannot accompany a false conclusion.

```text
P→Q, P ∴ Q       modus ponens
P→Q, ¬Q ∴ ¬P     modus tollens
P→Q, Q→R ∴ P→R   hypothetical syllogism
P∨Q, ¬P ∴ Q       disjunctive syllogism
```

`P→Q, Q ∴ P` is affirming the consequent and is invalid. `P→Q, ¬P ∴ ¬Q` is denying the antecedent and is invalid.

### Prerequisites

Translation, truth conditions, and conditional direction.

### Common misconceptions

- Matching a few symbols while ignoring their roles.
- Confusing modus tollens with denying the antecedent.
- Treating a valid conclusion as the only true statement that follows.
- Assuming a plausible conclusion makes an argument valid.
- Rejecting an argument because one premise is actually false.
- Accepting an argument because all displayed sentences sound true.
- Offering an assignment that falsifies a premise as a countermodel.

### Subcategories

1. Direct rule application
2. Rule identification
3. Missing premises and conclusions
4. Validity and countermodels
5. Formal fallacies
6. Controlled natural-language arguments

### Family `infer_rule_conclusion`

**Task.** Derive the immediate conclusion licensed by a named or recognizable inference pattern.

**Response mode.** Structured formula choice or builder.

**Question template.**

```text
{premises}

What follows by one application of {rule_or_blank}?
```

**Generation.** Instantiate rule schemas with atoms or small formulas. Omit the rule name at higher levels.

**Derivation.** Unify the premises with each supported rule schema and instantiate the conclusion.

**Constraints and rejection rules.** There must be one intended one-step conclusion among the options. If several rules apply, name the requested rule or accept every valid listed conclusion.

**Distractors.** Converse/inverse conclusion, negation dropped, wrong disjunct retained, conjunction weakened incorrectly.

**Feedback.** Display the abstract schema above the instantiated premises.

**Examples.**

1. `P→Q, P` → `Q` by modus ponens. L1.
2. `R→(P∧Q), ¬(P∧Q)` → `¬R` by modus tollens. L3.
3. `(P∨Q)→R, R→S` → `(P∨Q)→S` by hypothetical syllogism. L4.

**Validation.** Exact schema unification and independent semantic entailment check.

### Family `identify_inference_rule`

**Task.** Name the rule instantiated by a one-step valid argument.

**Response mode.** Single-choice rule name.

**Question template.** `Which inference rule has this form? {premises} ∴ {conclusion}`

**Generation.** Instantiate supported schemas while varying formula complexity and premise order.

**Derivation.** Match the argument against normalized rule schemas, including symmetric variants.

**Constraints and rejection rules.** Avoid instances matching two displayed names unless both names are accepted aliases. Do not rely on the order of conjunction/disjunction operands unless the rule requires it.

**Distractors.** A nearby invalid form; another rule sharing one premise shape; equivalence law rather than inference rule.

**Feedback.** Replace the concrete subformulas by metavariables to expose the pattern.

**Examples.**

1. `P→Q, ¬Q ∴ ¬P` → modus tollens. L1.
2. `P∨Q, ¬Q ∴ P` → disjunctive syllogism. L2.
3. `P∨Q, ¬P∨R ∴ Q∨R` → resolution. L4.

**Validation.** Schema matcher plus semantic validity.

### Family `complete_argument`

**Task.** Fill a missing premise or conclusion so that a specified rule applies.

**Response mode.** Single-choice or structured formula.

**Question template.**

```text
{premise_1}
{missing_line}
∴ {conclusion}

Choose the missing line that makes this an instance of {rule}.
```

**Generation.** Generate a complete rule instance, hide one component, and produce misconception alternatives.

**Derivation.** Solve the rule-schema unification constraint.

**Constraints and rejection rules.** Exactly one option must satisfy the named schema. Reject cases where commutative variants create duplicate correct options.

**Distractors.** Negation on wrong formula; consequent in place of antecedent; converse conditional; unrelated but semantically compatible claim.

**Feedback.** Align each line with its place in the rule schema.

**Examples.**

1. `P→Q, ?, ∴ Q` by modus ponens → `P`. L1.
2. `P→Q, ?, ∴ ¬P` by modus tollens → `¬Q`. L2.
3. `P∨Q, ?, ∴ Q` by disjunctive syllogism → `¬P`. L2.

**Validation.** Reconstruct the full instance and require exact schema match plus validity.

### Family `argument_validity`

**Task.** Decide whether a propositional argument is valid.

**Response mode.** Valid/invalid.

**Question template.** `Is this argument formally valid? {premises} ∴ {conclusion}`

**Generation.** Valid arguments come from rule chains or entailment-selected formulas. Invalid arguments are generated with a guaranteed countermodel and often resemble a known valid form.

**Derivation.** Search every truth assignment for premises all true and conclusion false.

**Constraints and rejection rules.** Use 1–4 variables and 1–5 premises. Balance valid and invalid instances. Reject invalid arguments whose only countermodel is too complex for the current level.

**Distractors.** Binary choice; feedback tags whether the learner likely judged plausibility or matched a fallacy.

**Feedback.** Valid: show a short rule chain or absence of counter-rows in a compact table. Invalid: show one countermodel.

**Examples.**

1. `P→Q, P ∴ Q` → valid. L1.
2. `P→Q, Q ∴ P` → invalid; `P=F,Q=T`. L2.
3. `P∨Q, P→R, Q→R ∴ R` → valid. L4.

**Validation.** Exhaustive semantic oracle. If a proof is displayed, validate every proof line separately.

### Family `argument_countermodel`

**Task.** Find an assignment that proves an argument invalid.

**Response mode.** Named truth-value fields or single-choice assignment.

**Question template.** `Find a countermodel: make every premise true and the conclusion false.`

**Generation.** Start from a target assignment, construct premises true there and a conclusion false there, then ensure the argument is not accidentally valid.

**Derivation.** Accept any assignment satisfying the countermodel condition.

**Constraints and rejection rules.** Every generated argument must have at least one countermodel. At Level 2 the invalidity should match a named fallacy; later levels may require coordinating three premises.

**Distractors.** Falsifies one premise; makes conclusion true; tests only the conditional premise.

**Feedback.** Provide a premise-by-premise table under the learner’s assignment.

**Examples.**

1. `P→Q, Q ∴ P` → `P=F,Q=T`. L2.
2. `P→Q, ¬P ∴ ¬Q` → `P=F,Q=T`. L2.
3. `P∨Q, P→R ∴ R` → `P=F,Q=T,R=F`. L3.

**Validation.** Semantic grading and explicit assertion that every premise is true and conclusion false.

### Family `valid_form_or_fallacy`

**Task.** Distinguish a valid conditional inference from a closely matched formal fallacy.

**Response mode.** Four-way choice: modus ponens / modus tollens / affirming the consequent / denying the antecedent.

**Question template.** `Classify the argument form: {premises} ∴ {conclusion}`

**Generation.** Use the same conditional `A→B` and vary the second premise/conclusion. Regularly present minimal pairs with identical surface vocabulary.

**Derivation.** Normalize each formula to the `A/B` roles and compare the polarity/position pattern.

**Constraints and rejection rules.** `A` and `B` must be non-equivalent and visibly distinguishable. Avoid conditionals whose converse happens to be true by formula structure.

**Distractors.** The other three named patterns.

**Feedback.** Use a role table:

```text
Given: A→B
Second premise: A / ¬B / B / ¬A
Claimed conclusion: B / ¬A / A / ¬B
```

**Examples.**

1. `P→Q, P ∴ Q` → modus ponens. L1.
2. `P→Q, ¬Q ∴ ¬P` → modus tollens. L1.
3. `(P∨R)→Q, Q ∴ P∨R` → affirming the consequent. L3.

**Validation.** Schema classification and semantic confirmation of valid versus invalid forms.

### Family `symbolized_natural_argument`

**Task.** Translate a short controlled argument and assess or complete its form.

**Response mode.** Multiple named formula fields followed by valid/invalid or conclusion choice.

**Question template.**

```text
{legend}

{natural_language_argument}

Symbolize the argument, then classify it.
```

**Generation.** Render a rule or fallacy schema through neutral sentence templates. Keep all factual content stipulated by the legend.

**Derivation.** Parse via the source semantic schema, then apply the validity oracle.

**Constraints and rejection rules.** No pronoun ambiguity, suppressed premise, causal interpretation, or outside factual judgment. Keep to 2–3 premises.

**Distractors.** Translation reversal and rule/fallacy confusion should be tracked separately.

**Feedback.** First show the symbolization, then the formal classification. Do not conflate a translation error with a validity error.

**Examples.**

1. “If the lamp is on, power is present. The lamp is on. Therefore power is present.” → `L→P,L∴P`, valid. L2.
2. “If the test passes, deployment starts. Deployment did not start. Therefore the test did not pass.” → modus tollens, valid. L2.
3. “If the key fits, the door opens. The door opens. Therefore the key fits.” → affirming the consequent, invalid. L3.

**Validation.** The surface renderer retains an exact source AST; validate every generated argument semantically.

## 6. Category: Short natural-deduction proofs

### Category purpose

Train local proof judgment: what a rule permits, which earlier lines it may cite, and how assumptions are scoped. The app should make proof structure visible without requiring a general proof-search engine or unrestricted proof editor.

### Learn

A proof line is justified by a rule and accessible earlier lines. Rules operate on formula structure:

- from `P` and `Q`, infer `P∧Q`;
- from `P∧Q`, infer either conjunct;
- from `P→Q` and `P`, infer `Q`;
- to prove `P→Q`, assume `P`, derive `Q`, then discharge the assumption;
- to prove `¬P`, assume `P`, derive `⊥`, then discharge the assumption.

An assumption is available only inside its subproof. A closed subproof may support a discharged conclusion but its internal lines are not freely reusable outside.

### Prerequisites

Formula structure, inference rules, and validity.

### Common misconceptions

- Citing a line that occurs later or lies inside a closed subproof.
- Using `∧I` when `∧E` is required.
- Applying `→E` without the antecedent.
- Inferring the antecedent from a conditional and its consequent.
- Treating an assumption as a premise.
- Closing a conditional proof with the wrong antecedent or consequent.
- Deriving arbitrary `⊥` without an explicit contradiction.

### Proof-size contract

- Levels 1–2: 3–5 lines, no nested subproof.
- Level 3: one subproof, at most 7 lines.
- Levels 4–5: at most two nested scopes and 10 displayed lines.
- Every generated proof has a short pedagogically intended route, even if other valid proofs exist.
- The app grades local steps or structured sequences, not arbitrary typed proof text.

### Family `justify_proof_line`

**Task.** Select the rule and cited lines that justify one proof line.

**Response mode.** Rule choice plus line-number fields.

**Question template.** `How is line {line_number}, {formula}, justified?`

**Generation.** Generate a valid proof, select a non-premise line, and hide its justification.

**Derivation.** Check all supported rule schemas against accessible prior lines.

**Constraints and rejection rules.** Prefer lines with one intended minimal justification. If multiple justifications are valid, accept all or construct a less ambiguous proof state.

**Distractors.** Correct rule with inaccessible line; inverse rule; one missing citation; premise/assumption confusion.

**Feedback.** Substitute cited formulas into the rule schema.

**Examples.**

1. `1. P∧Q Premise; 2. P ?` → `∧E, 1`. L1.
2. `1. P→Q; 2. P; 3. Q ?` → `→E, 1,2`. L1.
3. A line outside a closed subproof citing an internal line → invalid citation. L4.

**Validation.** Scope-aware rule checker; require referenced lines to precede the target.

### Family `choose_next_proof_step`

**Task.** Choose a legal and goal-directed next line in a partial proof.

**Response mode.** Single-choice formula-plus-justification.

**Question template.** `Which option is a valid next step toward {goal}?`

**Generation.** Backward-generate a short proof, expose a prefix, and use the next intended step as the answer.

**Derivation.** Verify legality under the rule checker and that the selected option lies on a known completion to the goal.

**Constraints and rejection rules.** Distractors may be legal but irrelevant only at upper levels. At lower levels, exactly one option should be legal. Never call one valid proof route wrong merely because another was intended.

**Distractors.** Affirm consequent; cite unavailable conjunction; introduce wrong disjunct; assume the goal without opening the required proof form.

**Feedback.** Explain both legality and how the step reduces the remaining goal.

**Examples.**

1. Premises `P∧Q`, goal `Q` → derive `Q` by `∧E`. L1.
2. Premises `P→Q`, `Q→R`, `P`, goal `R` → derive `Q` by `→E`. L2.
3. Goal `P→R` → open a subproof assuming `P`. L3.

**Validation.** Every answer choice is classified independently as illegal, legal but non-completing within the bound, or legal and completing.

### Family `fill_proof_gap`

**Task.** Fill one missing formula in an otherwise complete proof.

**Response mode.** Structured formula choice or builder.

**Question template.** `What formula belongs on line {line_number}?`

**Generation.** Remove a nontrivial intermediate line from a validated proof while retaining its justification or surrounding dependencies.

**Derivation.** Unify the stated rule with cited lines and later uses.

**Constraints and rejection rules.** Exactly one semantic formula should satisfy all visible constraints. Reject gaps where any of several equivalent formulas would work unless all are accepted.

**Distractors.** A premise copied unchanged; wrong conjunct; converse; correct formula with negation misplaced.

**Feedback.** Work from both the cited earlier lines and the later line that consumes the gap.

**Examples.**

1. `P∧Q ⟹ [gap]` by `∧E`, then use it as `P` → `P`. L1.
2. `P→Q, P, [gap], Q→R, R` → `Q`. L2.
3. Inside an assumption `P`, derive `[gap]`, close with `P→Q` → gap `Q`. L3.

**Validation.** Proof checker must validate the completed proof end to end.

### Family `order_proof_steps`

**Task.** Arrange a small set of derived lines into a legal proof order.

**Response mode.** Ordered sequence.

**Question template.** `Order these proof steps so every line is justified before it is used.`

**Generation.** Generate a proof dependency DAG, shuffle non-premise lines, and ask for a topological order.

**Derivation.** A valid answer is any topological ordering that respects dependencies and proof scope.

**Constraints and rejection rules.** Accept multiple legal orders. Reject sets in which ordering is arbitrary and teaches no dependency. Keep 3–6 movable steps.

**Distractors.** The interface does not need fixed distractors; incorrect feedback identifies the first line whose dependencies are unavailable.

**Feedback.** Show dependency arrows or cited-line prerequisites.

**Examples.**

1. From `P∧Q`, derive `P`, derive `Q`, then `P∧Q`; multiple first-two orders accepted. L2.
2. `P`, `P→Q`, `Q→R`: derive Q before R. L2.
3. One subproof whose final conditional must occur after the subproof closes. L4.

**Validation.** Apply the scope-aware checker in the learner’s order and accept every valid topological sequence.

### Family `assumption_discharge`

**Task.** Determine which conclusion may be drawn when a displayed subproof closes.

**Response mode.** Formula choice plus rule.

**Question template.**

```text
Assume {assumption}.
...
Derive {subproof_result}.

What may be concluded outside the subproof?
```

**Generation.** Use `→I`, `¬I`, `∨E`, and at upper levels `↔I`.

**Derivation.** Apply the discharge rule to the assumption range and result.

**Constraints and rejection rules.** Every subproof boundary is visually explicit and available in an accessible text form. Do not ask for a conclusion requiring an undeclared classical rule.

**Distractors.** Export the internal result directly; reverse conditional; negate wrong formula; retain the assumption as an undischarged premise.

**Feedback.** Draw the subproof box and identify exactly which assumption is discharged.

**Examples.**

1. Assume `P`, derive `Q` → conclude `P→Q` by `→I`. L3.
2. Assume `P`, derive `⊥` → conclude `¬P` by `¬I`. L3.
3. Assume `P`, derive `Q`; assume `Q`, derive `P` → conclude `P↔Q` by `↔I`. L5.

**Validation.** Validate the complete proof object, cited ranges, and scope closure.

## 7. Category: Quantifiers and finite predicate models

### Category purpose

Build correct reasoning about “all,” “some,” “none,” and relationships among objects. The learner should become sensitive to quantifier scope, vacuous truth, and the difference between one witness for everyone and possibly different witnesses for each object.

### Learn

`∀x P(x)` says every object in the domain has property P. `∃x P(x)` says at least one does.

```text
¬∀x P(x) ≡ ∃x ¬P(x)
¬∃x P(x) ≡ ∀x ¬P(x)
```

“Every A is B” is `∀x(A(x)→B(x))`. “Some A is not B” is `∃x(A(x)∧¬B(x))`.

Quantifier order matters:

- `∀x∃y R(x,y)`: each x has some related y, possibly a different y;
- `∃y∀x R(x,y)`: one y is related to every x.

### Prerequisites

Propositional connectives, especially implication and negation.

### Common misconceptions

- Translating “Every A is B” with conjunction rather than implication.
- Translating “Some A is B” with implication rather than conjunction.
- Negating `∀` or `∃` without swapping the quantifier.
- Treating a universal statement as existentially committing.
- Assuming the witness for `∃` must be unique.
- Swapping the arguments of a binary relation.
- Treating `∀x∃y` and `∃y∀x` as equivalent.
- Using one existential premise as if it named a known arbitrary object.

### Subcategories

1. Categorical translation
2. Quantifier negation
3. Finite unary models
4. Binary relations and quantifier order
5. Witnesses and counterexamples
6. Quantified inference

### Family `symbolize_quantified_sentence`

**Task.** Translate a controlled quantified sentence into first-order notation.

**Response mode.** Structured quantifier/formula builder; single-choice at early levels.

**Question template.**

```text
Domain: {domain_description}
{predicate_legend}

Symbolize: “{sentence}”
```

**Generation.** Use categorical frames first, then one binary predicate and at most two quantifiers.

**Derivation.** Instantiate the versioned language-frame AST.

**Constraints and rejection rules.** Relation direction and domain restriction must be explicit. Avoid bare plurals, “only,” and ambiguous relative clauses unless their templates are separately specified.

**Distractors.** `∧` versus `→`; `∀` versus `∃`; negation in wrong scope; relation arguments reversed.

**Feedback.** Separate domain restriction from asserted property and explain why universal restriction uses implication while existential restriction uses conjunction.

**Examples.**

1. “Every cat sleeps.” → `∀x(C(x)→S(x))`. L2.
2. “Some cat does not sleep.” → `∃x(C(x)∧¬S(x))`. L2.
3. “Every student admires some musician.” → `∀x(S(x)→∃y(M(y)∧A(x,y)))`. L4.

**Validation.** Compare ASTs up to alpha-renaming; exhaustively distinguish distractors on generated finite models.

### Family `negate_quantified_formula`

**Task.** Move a negation through one or more quantifiers and state an equivalent formula.

**Response mode.** Structured formula builder or single-choice.

**Question template.** `Rewrite the negation of {quantified_formula} with negation applied only to the predicate matrix.`

**Generation.** One quantifier at Levels 1–2, two alternating quantifiers at Levels 3–4, and restricted categorical formulas at Level 5.

**Derivation.** Swap `∀↔∃` at each crossed quantifier and negate the matrix, then apply propositional De Morgan laws if requested.

**Constraints and rejection rules.** Alpha-renamed equivalents are accepted. Prevent variable capture. Do not require a preferred predicate ordering.

**Distractors.** Keep quantifier unchanged; swap only outer quantifier; negate predicate without moving negation; reverse relation arguments.

**Feedback.** Animate or list each boundary crossed: “not every” becomes “some not.”

**Examples.**

1. `¬∀x P(x)` → `∃x¬P(x)`. L1.
2. `¬∃x(P(x)∧Q(x))` → `∀x(¬P(x)∨¬Q(x))`. L3.
3. `¬∀x∃y R(x,y)` → `∃x∀y¬R(x,y)`. L4.

**Validation.** Enumerate multiple finite domains and predicate extensions as a semantic property test in addition to AST transformation.

### Family `evaluate_unary_model`

**Task.** Evaluate a quantified formula in a displayed finite model of unary predicates.

**Response mode.** True/false.

**Question template.**

```text
Domain: {elements}
{predicate_extensions}

Is {formula} true in this model?
```

**Generation.** Domains contain 1–6 labeled elements. Predicate extensions are explicit subsets. Include empty predicate extensions to train vacuous truth.

**Derivation.** Enumerate the domain for each quantifier and recursively evaluate the matrix.

**Constraints and rejection rules.** The domain itself is never empty. The representation must distinguish an empty predicate extension from missing data.

**Distractors.** Binary answer, with feedback diagnosing existential import, one overlooked element, or mistaken set inclusion.

**Feedback.** Universal: list checked elements and first counterexample if any. Existential: show a witness or state that none exists.

**Examples.**

1. Domain `{a,b}`, `P={a,b}`: `∀xP(x)` → true. L1.
2. Domain `{a,b}`, `A=∅`, `B={a}`: `∀x(A(x)→B(x))` → true vacuously. L3.
3. `A={a,c}`, `B={b,c}`: `∃x(A(x)∧B(x))` → true, witness `c`. L3.

**Validation.** Independent subset-based and recursive evaluators.

### Family `evaluate_relation_model`

**Task.** Evaluate a formula with a binary relation in a finite table or diagram.

**Response mode.** True/false.

**Question template.**

```text
Domain: {elements}
R contains: {ordered_pairs}

Is {formula} true?
```

**Generation.** Domains contain 2–5 elements. Relation graphs must include a text list of ordered pairs. Generate models to distinguish quantifier order and argument direction.

**Derivation.** Enumerate bound-variable tuples and test ordered-pair membership.

**Constraints and rejection rules.** Arrow direction must be visible. Self-relations may appear only when intentionally relevant. Graph geometry carries no meaning beyond labeled arrows.

**Distractors.** Reverse each pair; use same witness for all x; overlook self-pair; swap quantifier order.

**Feedback.** Show a witness map for `∀x∃y`, one common witness for `∃y∀x`, or the first failed object.

**Examples.**

1. Domain `{a,b}`, `R={(a,b)}`: `∃x∃yR(x,y)` → true. L1.
2. `R={(a,b),(b,a)}`: `∀x∃yR(x,y)` → true. L3.
3. Same relation: `∃y∀xR(x,y)` → false. L4.

**Validation.** Tuple enumeration and graph/list rendering agreement.

### Family `quantifier_order_contrast`

**Task.** Distinguish the meanings or truth values of formulas differing only in quantifier order.

**Response mode.** Matching, two truth-value fields, or “equivalent/not equivalent.”

**Question template.** `Compare {formula_a} and {formula_b} in the displayed model.`

**Generation.** Primarily contrast `∀x∃yR(x,y)` with `∃y∀xR(x,y)`, then restricted variants.

**Derivation.** Evaluate both formulas and record witness structure.

**Constraints and rejection rules.** At least half of generated models should make the formulas differ; otherwise the contrast loses value. When they have the same truth value in one model, do not call them logically equivalent.

**Distractors.** Same truth means equivalent; different witnesses prohibited; reverse relation direction.

**Feedback.** For each x, list a possible y, then separately ask whether one y works for every x.

**Examples.**

1. Every person has some favorite book versus some book is everyone’s favorite. Explain semantic difference. L2.
2. Relation cycle on `{a,b,c}` → `∀x∃yR(x,y)` true, `∃y∀xR(x,y)` false. L3.
3. Universal relation → both true in this model, but not logically equivalent. L4.

**Validation.** Finite-model evaluation plus separate logical-equivalence oracle over a generated suite of small models.

### Family `witness_or_counterexample`

**Task.** Select an element that witnesses an existential statement or refutes a universal statement.

**Response mode.** Element choice; allow multiple correct elements.

**Question template.** `Choose a {witness_or_counterexample} for {formula} in this model.`

**Generation.** Construct models with 1–3 correct elements and explicit “none” only when appropriate.

**Derivation.** Evaluate the open matrix for each domain element under the variable binding.

**Constraints and rejection rules.** Accept every correct element. Do not mark a second valid witness wrong. Balance unique and multiple-witness cases.

**Distractors.** Element satisfies only one conjunct; relation arguments reversed; element is in the restricted class but fails the property.

**Feedback.** Substitute the chosen element into the matrix.

**Examples.**

1. `P={a,c}`: witness for `∃xP(x)` → `a` or `c`. L1.
2. `P={a,b}`, domain `{a,b,c}`: counterexample to `∀xP(x)` → `c`. L2.
3. For `∀x∃yR(x,y)`, choose the x lacking any outgoing R-edge as a counterexample. L4.

**Validation.** Enumerate the exact accepted element set.

### Family `quantified_inference`

**Task.** Determine what follows from quantified premises using elementary instantiation/generalization patterns.

**Response mode.** Single-choice formula.

**Question template.** `Which conclusion follows from {premises}?`

**Generation.** Valid schemas include universal instantiation, existential generalization, and categorical chains:

```text
∀x(A(x)→B(x)), A(a) ∴ B(a)
P(a) ∴ ∃xP(x)
∀x(A(x)→B(x)), ∀x(B(x)→C(x)) ∴ ∀x(A(x)→C(x))
```

Invalid near-misses include existential-to-specific-object inference and converse category inclusion.

**Derivation.** Evaluate schema legality and independently test semantic consequence over small finite models.

**Constraints and rejection rules.** Constant names must have visible denotations when a model is used. Do not use unrestricted universal generalization in generated questions unless arbitrary-object conditions are represented explicitly.

**Distractors.** Infer `P(a)` from `∃xP(x)`; reverse universal implication; infer existence from a universal premise alone; reuse an existential witness across unrelated existential premises.

**Feedback.** State whether the premise concerns every object, at least one unspecified object, or the named object.

**Examples.**

1. `∀x(C(x)→M(x)), C(a)` → `M(a)`. L2.
2. `M(a)` → `∃xM(x)`. L2.
3. `∃x(C(x)∧M(x))` does not entail `C(a)` for a named `a`. L3.

**Validation.** Rule-schema checker plus exhaustive search over bounded finite models for every offered conclusion.

### Family `categorical_argument_validity`

**Task.** Decide whether a short categorical argument is valid under modern first-order semantics.

**Response mode.** Valid/invalid; optional finite countermodel selection.

**Question template.**

```text
{categorical_premises}
Therefore, {categorical_conclusion}.

Is the argument valid?
```

**Generation.** Translate categorical sentences to unary-predicate formulas. Include valid inclusion chains and invalid reversals, existential-import traps, and disjointness errors.

**Derivation.** Search finite set models over a small abstract domain for a countermodel; valid templates should also have a short inclusion/existence derivation.

**Constraints and rejection rules.** State that modern first-order semantics is used. Do not assume any category is nonempty unless an existential premise says so. Use abstract class labels or neutral nouns.

**Distractors.** Treat “all” as reversible; infer existence from universals; swap “no A is B” with “no B is A” only where symmetry actually holds; mishandle “some.”

**Feedback.** Show set inclusion/disjointness and either propagate a witness or display a finite countermodel.

**Examples.**

1. Every A is B; every B is C; therefore every A is C → valid. L2.
2. Every A is B; some B is C; therefore some A is C → invalid. L3.
3. No A is B; some C is A; therefore some C is not B → valid. L4.

**Validation.** Formula translation plus exhaustive model search over domains of size 1–4; validate known schema classifications.

## 8. Cross-family progression

Recommended introduction order:

1. recognize one connective and translate direct sentences;
2. identify main connective and conditional direction;
3. evaluate one row before constructing truth-table columns;
4. classify formulas only after the learner can find satisfying and falsifying rows;
5. introduce De Morgan and implication rewrites, then equivalence decisions;
6. teach modus ponens and modus tollens as minimal pairs with affirming the consequent and denying the antecedent;
7. move from named one-step rules to validity and explicit countermodels;
8. introduce local proof-line justification before gap filling or assumption discharge;
9. introduce `∀/∃` translation through categorical forms;
10. practice finite unary models and quantifier negation before binary relations;
11. contrast `∀x∃y` with `∃y∀x`;
12. finish with quantified inference and categorical argument validity.

Recommended interleaving:

- conditional translation with conditional truth rows;
- De Morgan transformation with formula negation;
- modus tollens with countermodels for denying the antecedent;
- validity decisions with countermodel construction;
- existential statements with witness selection;
- universal statements with counterexample selection;
- proof-rule naming with actual line justification.

Keep these separated until prerequisites are stable:

- CNF/DNF after basic equivalence;
- assumption discharge after direct proof rules;
- quantifier alternation after single-quantifier evaluation;
- categorical validity after modern existential-import behavior is understood.

Static symbol-name recall should be a brief onboarding aid, not a dominant adaptive family.

## 9. Adaptive practice guidance

Track mastery by:

- family and category;
- connective and connective position;
- translation frame (`if`, `only if`, `iff`, neither/nor);
- formula depth and main connective;
- truth-table misconception signature;
- inference rule or fallacy;
- forward, inverse, completion, and countermodel response direction;
- equivalence law and transformed AST location;
- proof rule, citation count, and scope depth;
- quantifier type, alternation pattern, predicate arity, and relation direction;
- vacuous-truth, existential-import, witness, and counterexample errors.

Failure routing:

| Observed error | Diagnostic follow-up |
|---|---|
| reverses “only if” | paired `conditional_direction` items with canonical “if ..., then ...” rewrite |
| treats `∨` as exclusive | rows where both disjuncts are true |
| marks false-antecedent implication false | minimal `F→T` and `F→F` evaluation |
| negates `P∧Q` as `¬P∧¬Q` | matched De Morgan transformations and counterassignment |
| calls converse equivalent | original/converse counterassignment |
| confuses modus tollens with denying antecedent | four-form minimal contrast |
| says invalid but cannot give countermodel | guided named truth fields with premise status |
| countermodel falsifies a premise | one-row argument table highlighting the requirement |
| cites closed-subproof line | proof-scope accessibility drill |
| uses `∧I`/`∧E` backward | direct line-justification minimal pairs |
| translates every A is B with `∧` | empty-A finite model and implication translation |
| infers existence from universal | vacuous-truth model with empty predicate extension |
| fails to swap quantifier under negation | verbal “not every / none” contrast |
| conflates `∀x∃y` and `∃y∀x` | relation with different witnesses and no common witness |
| selects only generator’s witness | multiple-witness questions with semantic grading |

Slow but correct answers should retain the same logical structure while reducing formula depth or displayed proof/model size. A multi-step failure should route to the smallest discriminating family, not merely reduce the level globally.

Recommended adaptive mix:

- 35% weakest family/dimension;
- 25% spaced review of mastered material;
- 20% misconception-targeted contrasts;
- 10% inverse or counterexample tasks;
- 10% mixed transfer between symbols, natural language, semantics, and proofs.

Do not infer mastery of a rule from rule-name recognition alone. Require at least one application and one validity/countermodel form.

## 10. Feedback and visualization requirements

Feedback should reveal the decisive logical structure:

- AST brackets for connective scope;
- compact truth subcolumns rather than only the final truth value;
- antecedent/consequent role tables;
- one explicit satisfying assignment or countermodel;
- law name plus highlighted rewritten subtree;
- abstract rule schema aligned with concrete premises;
- proof lines with citations and assumption boxes;
- finite-domain membership tables;
- relation matrices or arrow diagrams with a text equivalent;
- witness maps for `∀x∃y`;
- set-inclusion diagrams for categorical arguments.

Every visual must have an equivalent semantic table or text representation. Color must not be the only indication of truth, falsity, scope, or accessibility.

Correct feedback should be concise first, with an expandable derivation. Incorrect feedback should say what requirement failed, for example:

- “This is the converse, not the contrapositive.”
- “Your row makes premise 2 false, so it is not a countermodel.”
- “That line is inside a closed assumption.”
- “This object is an A, but it is not a B, so it refutes the universal claim.”

Do not reveal only a rule name when the learner’s error concerns role mapping or truth conditions.

## 11. Interaction and accessibility requirements

- Logical symbols must be insertable without a physical symbol keyboard.
- Every symbol button has an accessible name and textual tooltip.
- Formula builders operate on semantic nodes, support keyboard navigation, and visibly indicate current scope.
- Parentheses and negation scope must remain legible at narrow screen widths.
- Truth tables use real row/column headers.
- Proof lines expose line number, indentation/scope, formula, rule, and citations to assistive technology.
- Relation diagrams include ordered-pair text.
- Drag-to-order interactions must also support buttons and keyboard reordering.
- `T` and `F` must include text or shape cues, not color alone.
- Natural-language legends remain visible while answering.
- On small screens, a formula may wrap only at semantic boundaries; operators must not be orphaned ambiguously.

## 12. Implementation requirements

- Use semantic ASTs for all propositions and first-order formulas.
- Maintain source-span annotations for selecting connective occurrences.
- Use exact Boolean bit masks for propositional truth columns.
- Use exhaustive enumeration for at most four propositional variables and small finite first-order domains.
- Use a versioned rule-schema matcher for named inferences.
- Use a scope-aware proof checker; line indentation alone is not the oracle.
- Alpha-normalize bound variables before formula comparison.
- Implement capture-avoiding substitution even though the initial term grammar is small.
- Store predicate extensions as sets/bitsets and binary relations as ordered-pair bit matrices.
- Generate equivalent formulas by valid AST rewrites, not by string replacement.
- Generate invalid transformations and arguments from named misconception transforms, then verify they are genuinely non-equivalent or invalid.
- Generate proof questions backward from a validated complete proof.
- Use deterministic seeded generation.
- Use structural signatures that ignore atom names, story nouns, whitespace, and commutative display order where appropriate.
- Prevent immediate repetition of the same schema with only renamed variables.
- Keep English sentence frames in locale data so translation does not alter logical semantics.
- Localized natural-language templates must receive semantic round-trip tests; do not translate operators by ad hoc substring replacement.
- No runtime compiler, backend, network request, external CAS, SAT service, or theorem-proving service.

### Suggested internal semantic objects

```text
TruthAssignment := Map<AtomId, Boolean>

Argument := {
  premises: Prop[],
  conclusion: Prop
}

FiniteModel := {
  domain: ElementId[],
  constants: Map<ConstantId, ElementId>,
  unaryPredicates: Map<PredicateId, Set<ElementId>>,
  binaryPredicates: Map<PredicateId, Set<Pair<ElementId, ElementId>>>
}

ProofLine := {
  formula: Formula,
  rule: RuleId,
  citations: LineOrRangeRef[],
  scopePath: ScopeId[]
}
```

### Distractor provenance

Every distractor should carry a misconception identifier, such as:

`conditional_reversal`, `exclusive_or`, `narrow_negation`, `de_morgan_no_swap`, `affirm_consequent`, `deny_antecedent`, `premise_false_countermodel`, `existential_import`, `quantifier_no_swap`, `relation_reversal`, or `closed_scope_citation`.

Arbitrary neighboring formulas are not acceptable distractors.

## 13. Automated validation

For every generated proposition:

- verify every displayed atom is defined in the legend;
- verify every placeholder is resolved;
- compare recursive evaluation with bit-mask evaluation;
- verify truth-table row order and headers;
- verify requested satisfying/falsifying assignments exist;
- verify semantic classifications exhaustively.

For every equivalence question:

- evaluate both formulas over all assignments;
- verify exactly the intended choices are equivalent;
- verify non-equivalent distractors have stored counterassignments;
- verify requested CNF/DNF shape independently of equivalence;
- verify rewrite-law applications match a legal AST location.

For every argument:

- exhaustively test validity;
- store and recheck a countermodel for every invalid argument;
- verify a displayed countermodel makes all premises true and conclusion false;
- schema-match every named rule;
- reject valid arguments accidentally generated as fallacy distractors.

For every proof:

- check every line in order;
- validate rule schema, citation arity, cited formula structure, line order, and scope accessibility;
- verify all discharged assumptions and cited ranges;
- confirm the final line matches the goal;
- enumerate alternative accepted justifications or eliminate ambiguity;
- test reordered-answer grading against all dependency-respecting orders.

For every finite-model question:

- verify domain nonemptiness;
- verify constants denote domain members;
- verify predicate extensions and relation pairs contain only domain members;
- compare recursive quantifier evaluation with explicit tuple enumeration;
- enumerate all accepted witnesses/counterexamples;
- verify relation diagram, table, and ordered-pair text agree;
- test alpha-renamed answers;
- search multiple small models to distinguish purportedly non-equivalent quantified formulas.

Generator-level tests:

- run at least 10,000 deterministic seeds per family and level;
- ensure all choices are distinct after rendering and normalization;
- ensure exactly one correct choice unless multiple-answer semantics are explicit;
- monitor outcome and misconception balance;
- reject structural duplicates within the recent-history window;
- assert formula depth, proof length, domain size, and output length caps;
- render every generated formula at narrow and wide viewport test sizes;
- preserve canonical answers across all supported locales.

## 14. Coverage requirements

- Every connective appears both alone and nested under another connective.
- Implication practice balances all four truth rows, with false-antecedent cases recurring often.
- “If,” “only if,” and biconditional translations receive independent coverage.
- Main-connective questions include repeated operators and negation scope.
- Tautology, contradiction, and contingency remain balanced.
- Satisfying and falsifying assignment families accept all valid assignments.
- Both De Morgan laws and both directions of their use recur.
- Original, converse, inverse, and contrapositive appear in balanced contrasts.
- Modus ponens, modus tollens, hypothetical syllogism, and disjunctive syllogism receive core coverage.
- Affirming the consequent and denying the antecedent are regularly paired with their valid near neighbors.
- Validity questions balance rule-recognizable arguments and semantic multi-premise arguments.
- Every invalid argument has a learner-readable countermodel.
- Proof practice covers introduction and elimination directions rather than only rule names.
- Scope errors occur often enough to teach subproof boundaries.
- Universal and existential claims balance true and false finite models.
- Empty predicate extensions recur to test vacuous truth, while the domain remains nonempty.
- Quantifier-negation practice swaps both `∀→∃` and `∃→∀`.
- Relation models balance different-witness, common-witness, and failed-witness cases.
- Categorical arguments include both valid inclusion chains and existential-import traps.
- No easiest surface template should exceed 20% of a family’s recent questions.
- Combined questions introduce at most one unmastered mechanism.

## 15. Topic-level quality checklist

- [ ] Every category trains a repeatable act of reasoning.
- [ ] Static terminology recall is supporting material, not the core exercise.
- [ ] Every question has a semantic object independent of its rendering.
- [ ] Logical notation and precedence are explicit.
- [ ] Inclusive disjunction and material implication conventions are visible.
- [ ] Controlled English has exactly one intended parse.
- [ ] Formula answers are AST-checked rather than string-compared.
- [ ] Equivalent answers are accepted when the task permits them.
- [ ] Truth-table order is deterministic and accessible.
- [ ] Every invalid argument has a verified countermodel.
- [ ] Validity is not confused with premise truth or soundness.
- [ ] Named fallacies are trained through valid/invalid minimal pairs.
- [ ] Proof questions are scope-aware and do not require one arbitrary proof route.
- [ ] First-order domains are finite, explicit, and nonempty.
- [ ] Universal claims do not silently receive existential import.
- [ ] Relation direction and quantifier order are visually explicit.
- [ ] Multiple witnesses and counterexamples are graded semantically.
- [ ] Distractors correspond to named misconceptions.
- [ ] Feedback exposes the decisive reasoning step.
- [ ] Difficulty rises through structure, inversion, and interaction rather than length.
- [ ] All generation and checking work offline in one standalone page.
- [ ] Automated tests can recompute every answer independently.

## 16. Stable navigation

Recommended learner-facing categories:

1. Symbols & Scope
2. Truth Conditions
3. Equivalence
4. Arguments & Rules
5. Short Proofs
6. Quantifiers & Models

Stable family identifiers are the backticked identifiers in this specification. Progress should be tracked at family, misconception, connective/rule, representation direction, and difficulty-dimension level; category-only mastery is too coarse.

Recommended app identifier and files:

```text
apps/logic/
specs/logic.md
dist/logic.html
dist/logic.sv.html
```
