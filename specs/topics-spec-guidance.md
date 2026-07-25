# Dynamic Practice Topic Specification

## 1. Topic Overview

### Topic Name

The human-readable name of the subject.

Example:

> Powers of Two

### Topic Goal

Describe what the learner should become faster, more accurate, or more confident at doing.

Focus on trainable performance rather than broad understanding.

Example:

> Develop immediate recall of common powers of two and the ability to move fluently between exponents and values.

### Scope

Describe what the topic includes.

Be explicit about:

* concepts covered
* expected prior knowledge
* numerical or conceptual range
* relevant conventions
* assumed notation

### Exclusions

Describe nearby material that is deliberately excluded.

This prevents the implementation model from expanding the topic arbitrarily.

Example:

> Do not include logarithms, floating-point approximations, negative exponents, or general exponentiation.

### Global Answer Conventions

Specify conventions that apply across the topic.

Examples:

* whether surrounding whitespace is ignored
* whether answers are case-sensitive
* accepted numeric formats
* whether leading zeroes are accepted
* whether equivalent mathematical forms are accepted
* whether answers may contain units
* how multiple values are separated

### Difficulty Philosophy

Explain what genuinely makes exercises harder in this topic.

Also state which forms of artificial difficulty should not be used.

Example:

> Difficulty should increase through weaker recall cues, inversion of familiar relationships, and combinations of independently learned facts. It should not increase merely by using larger typography, longer wording, or arbitrary time pressure.

---

# 2. Category: `{category name}`

## Category Purpose

Describe the cognitive operation trained by this category.

Avoid defining the category only by naming its textbook subject.

Weak:

> This category covers XOR.

Better:

> This category trains recognition of which bits differ and the ability to predict or construct the result of toggling selected bits.

## Learn

Provide the concise instructional text shown to the learner.

The Learn text should include:

* the central concept
* the minimum rules needed for the exercises
* one or two representative examples
* common traps when relevant
* the expected answer style

It should not attempt to be a complete textbook treatment.

## Prerequisites

List knowledge assumed from earlier categories or subcategories.

## Category Boundaries

Clarify what belongs here and what should instead appear in another category.

## Subcategories

List the subcategories in their intended pedagogical order.

---

# 3. Subcategory: `{subcategory name}`

## Skill

State precisely what the learner practices.

Example:

> Given two bit patterns, determine the result of applying XOR bit by bit.

## Mental Operation

Describe what the learner should do mentally.

Example:

> Compare corresponding bits and emit 1 when they differ and 0 when they match.

## Common Misconceptions

List the specific incorrect mental models that exercises should expose.

For each misconception, briefly explain how it may appear in an incorrect answer.

Example:

* Treating XOR as OR and setting a result bit whenever either input bit is 1.
* Treating XOR as inequality over the complete number rather than independently over each bit.
* Forgetting that `1 XOR 1` is `0`.

## Generation Scope

Define the conceptual and numerical space from which exercises may be generated.

Specify matters such as:

* allowed value ranges
* permitted representations
* operand counts
* permitted syntax
* whether zero is allowed
* whether duplicate operands are allowed
* assumptions about signedness, width, units, or precision

## Difficulty Dimensions

Describe the independent dimensions that may make an instance harder.

Examples:

* number of active bits
* amount of visual alignment
* conversion between representations
* presence of irrelevant bits
* inversion of the requested relationship
* number of interacting rules
* strength of contextual cues

Do not define difficulty only as a single integer range.

## Question Families

List every supported question family.

---

# 4. Question Family: `{stable identifier and name}`

Each question family represents one repeatable form of reasoning. It must be capable of generating many meaningful instances without relying on cosmetic variation.

Example identifier:

> `xor_compute_result`

## Learner Task

Describe in one sentence what the learner must determine.

Example:

> Compute the bit pattern produced by XORing two binary values.

## Relationship to the Skill

Explain why repeated practice of this family improves the target skill.

## Response Mode

Specify the interaction format separately from the semantic task.

Allowed modes may include:

* integer input
* decimal-number input
* binary-string input
* hexadecimal-string input
* short text
* yes/no
* single-choice
* multiple-choice
* ordered sequence
* matching
* multiple named fields

## Question Template

Provide the exact preferred wording and placeholder syntax.

Use braces for generated values.

Example:

> What is `{left}` XOR `{right}`?

For code questions, provide the complete code template in a fenced code block.

Do not leave pedagogically significant wording decisions to the implementation model.

## Placeholder Definitions

Define every placeholder used by the question template.

For each placeholder, specify:

* semantic meaning
* data type
* permitted range or set
* display representation
* relationship to other placeholders

Example:

### `{left}`

A non-negative integer displayed as an 8-bit binary value.

Range:

> `00000000` through `11111111`

The displayed value must always contain exactly eight bits.

### `{right}`

A second independently generated 8-bit binary value.

It may equal `{left}` only when such instances remain pedagogically useful.

## Answer Template

Specify how the correct answer is internally represented and, when useful, how it is shown in feedback.

Example:

> `{answer}`

Feedback sentence:

> `{left}` XOR `{right}` is `{answer}`.

## Answer Derivation

Describe the exact algorithm used to compute the answer.

This should be sufficiently precise that the implementation model does not need to infer the underlying rule.

Example:

> Parse `{left}` and `{right}` as unsigned 8-bit values. Compute their bitwise exclusive OR. Format the result as exactly eight binary digits.

For code-reading exercises, describe the evaluation process and all relevant language assumptions.

## Accepted Answers

Define all accepted input forms.

Example:

* exactly eight binary digits
* optional `0b` prefix
* surrounding whitespace ignored
* internal spaces not accepted

If only one representation is accepted, state that explicitly.

## Instance Constraints

State conditions that every generated instance must satisfy.

Examples:

* The result must not always equal either operand.
* At least two bit positions must differ.
* The answer must fit within the stated width.
* The generated code must be well-defined under C++17.
* The question must have exactly one correct interpretation.

## Rejection Rules

Describe generated instances that must be discarded even though they technically satisfy the parameter ranges.

Examples:

* Reject instances where the intended operation has no visible effect.
* Reject instances whose answer can be guessed from a superficial pattern.
* Reject instances that duplicate another active question after formatting.
* Reject instances dominated by tedious arithmetic unrelated to the target skill.
* Reject code instances containing accidental undefined or unspecified behavior.
* Reject instances in which two intended difficulty mechanisms cancel each other out.

## Controlled Variations

List meaningful variants that may be used within the same question family.

Each variation must preserve the same central mental operation.

Example:

* binary operands and binary answer
* hexadecimal operands and hexadecimal answer
* binary operands and decimal answer
* one operand presented as a named mask
* missing operand instead of missing result

Do not treat changes in names, whitespace, or irrelevant story wording as meaningful variation.

## Difficulty Levels

Define levels through qualitative changes in reasoning.

### Level 1

Describe:

* permitted parameter range
* available cues
* number of reasoning steps
* excluded complications

### Level 2

Describe the new reasoning demand introduced relative to Level 1.

### Level 3

Describe the additional interaction, weaker cue, inversion, or competing misconception.

Continue only for levels that represent genuinely distinct cognitive demands.

Increasing a loop bound, digit count, or operand size is insufficient unless that increase changes the mental strategy required.

## Multiple-Choice Distractors

Include this section only when the response mode uses choices.

Describe how incorrect choices are generated from known misconceptions.

Each distractor should correspond to a plausible reasoning error.

Example:

* the bitwise OR result
* the bitwise AND result
* one operand copied unchanged
* the XOR result with leading zeroes incorrectly removed

Avoid arbitrary nearby numbers unless numerical proximity is itself the relevant misconception.

## Feedback

### Correct Feedback

Specify the concise confirmation shown after a correct answer.

### Incorrect Feedback

Explain how feedback should diagnose the likely misconception.

Where possible, compare the learner's answer with recognizable alternative computations.

Example:

> Your answer matches bitwise OR. XOR produces 1 only when the two input bits differ.

### Worked Solution

Describe the optional step-by-step solution.

The solution should expose the intended mental method rather than merely restating the final answer.

## Examples

Provide at least three fully instantiated examples:

1. a straightforward instance
2. a representative middle-difficulty instance
3. an instance near the upper intended difficulty

For each example, include:

* rendered question
* correct answer
* brief derivation
* difficulty level
* misconception targeted, when applicable

Examples validate the specification. They do not replace the generation rules.

## Implementation Notes

Include any details needed by the implementation model.

Examples:

* formatting requirements
* randomization strategy
* required helper functions
* numeric types
* overflow handling
* escaping rules
* code syntax highlighting
* whether values should be generated independently or constructed backward from an answer
* whether all instances should be prevalidated

Do not prescribe a software architecture unless it is educationally significant.

## Automated Validation

Describe checks that should run against generated instances.

Examples:

* recompute the answer independently
* verify that all placeholders were substituted
* verify that the answer satisfies the declared format
* test that every multiple-choice question has exactly one correct choice
* compile generated C++ snippets under the declared standard
* run well-defined snippets and compare actual output with the expected answer
* ensure rejection rules are enforced
* test many random seeds for accidental degeneracy

## Coverage Requirements

Describe how the generator should distribute questions across the available space.

Examples:

* avoid excessive concentration around zero and powers of two
* balance cases where result bits are set and cleared
* ensure every declared misconception appears regularly
* prevent the easiest variation from dominating random selection
* track recently shown structural patterns and reduce immediate repetition

---

# 5. Cross-Family Progression

Explain how the question families within the category relate to one another.

Specify:

* recommended introduction order
* which families establish prerequisites
* which families should be interleaved
* which families should remain separate until basic mastery
* how earlier skills are reused in later exercises

Example:

> Direct XOR computation should precede missing-operand questions. Once direct computation is reliable, the two families should be interleaved because inverse questions test whether the learner understands XOR as a reversible relationship rather than as a memorized forward procedure.

---

# 6. Adaptive Practice Guidance

Describe which failure patterns should influence future question selection.

Examples:

* repeated OR-like answers should increase exercises contrasting OR and XOR
* errors only during hexadecimal presentation should trigger representation-conversion practice
* slow but correct answers should retain the skill while reducing unnecessary scaffolding
* failures involving several concepts should lead to simpler diagnostic questions rather than merely easier numbers

Specify whether mastery is tracked by:

* category
* subcategory
* question family
* misconception
* representation
* difficulty dimension

Prefer tracking misconception-level weaknesses when possible.

---

# 7. Topic-Level Quality Checklist

Before accepting the topic specification, verify:

* Every category corresponds to a meaningful trainable skill.
* Every subcategory has a distinct pedagogical purpose.
* Every question family can generate many non-trivial instances.
* Difficulty increases through reasoning rather than tedium.
* Question wording is precise and unambiguous.
* Answer derivation is fully specified.
* Accepted answer formats are explicit.
* Degenerate instances have rejection rules.
* Multiple-choice distractors correspond to plausible mistakes.
* Feedback explains mental models rather than only revealing answers.
* Examples cover the declared generation space.
* Implementation does not require Codex to invent educational content.
* Automated tests can verify generated questions and answers.
* Solving many generated instances should produce a real improvement in performance.

---

# Required Specification Depth

Do not stop after listing categories and example questions.

For every question family, reason explicitly about:

* the exact skill trained
* likely misconceptions
* the dimensions of variation
* the derivation of the correct answer
* the construction of plausible incorrect answers
* difficulty progression
* invalid or low-value generated instances
* implementation validation

When an area does not support a strong dynamic generator, say so and either narrow it, redesign it, or recommend that it not be included.
