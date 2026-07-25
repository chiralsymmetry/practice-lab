# C++ Mental Execution — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, compiler-validation, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

C++ Mental Execution

### Topic goal

Develop accurate, efficient reading of small C++ programs: trace guaranteed state changes, distinguish objects from aliases and owners, infer types and value categories, resolve overloads and templates, reason about lifetime, and decode declarations and callables.

The learner should build a standards-based mental model rather than predict what one compiler happened to do.

### Scope

The topic includes:

- straight-line state changes, branches, loops, early exits, and short-circuiting;
- prefix/postfix increment only in sequenced, well-defined contexts;
- references, pointers, reseating, indirection, and parameter passing;
- `auto`, references, top-level `const`, `decltype`, and `decltype(auto)`;
- integer promotions, usual arithmetic conversions in portable cases, and initialization/narrowing;
- overload viability/ranking, reference binding, template deduction, forwarding references, and simple partial ordering;
- automatic and temporary object lifetime;
- dangling pointers/references and selected standard-container invalidation rules;
- `std::move` as a cast, `std::unique_ptr`, `std::shared_ptr`, and deterministic destruction order;
- arrays, pointers to arrays/functions/members, aliases, and lambdas;
- classification of ill-formed code, undefined behavior, unspecified behavior, and implementation-defined behavior.

### Language version and abstract environment

All snippets use **ISO C++17**, compiled without vendor extensions. The standard version must be visible in Learn and question metadata.

Unless a snippet states otherwise:

- source is part of one complete translation unit;
- required standard headers are included in the displayed code or a visible fixed preamble;
- execution occurs inside `int main()` after declarations shown at namespace scope;
- ordinary output uses `std::cout` in decimal, without `std::boolalpha`, locale customization, or synchronization changes;
- `std::uint8_t` questions are generated only in an environment where that optional typedef exists and has exactly eight value bits;
- no assumption is made about `sizeof(int)`, signedness of plain `char`, byte order, allocator growth policy, or moved-from container contents;
- inputs and arithmetic are chosen to avoid signed overflow unless overflow is the explicit judgment target;
- no threads, signals, volatile hardware, exceptions, macros, modules, coroutines, or compiler extensions are involved.

### Behavior classification

The app uses these distinct canonical judgments:

| Judgment | Meaning |
|---|---|
| `deterministic` | Well-formed, well-defined, and the requested result is uniquely determined by C++17 plus stated assumptions. |
| `unspecified` | Well-formed and not undefined, but the standard permits more than one result/choice without requiring documentation. |
| `implementation-defined` | Well-formed; implementation chooses and documents one of several possibilities. |
| `undefined behavior` | Execution reaches an operation for which the standard imposes no requirements. |
| `compile error` | The program is ill-formed and a diagnostic is required. |

“Defined” alone is not a sufficient answer for a question whose result is unspecified or implementation-defined. Runtime-output families must generate only `deterministic` programs. Judgment families may use the other classes.

If an ill-formed program also contains text that would cause undefined behavior if it compiled, the canonical result is still `compile error`, but such mixed instances must normally be rejected because they are poor diagnostics.

### Exclusions

Do not include:

- compiler extensions, permissive modes, or implementation-specific ABI/layout questions;
- pre-C++17 or post-C++17 rules unless a version-comparison family is explicitly added later;
- concurrency, atomics, memory ordering, data races, or signal safety;
- exception guarantees, unwinding puzzles, or exception specifications;
- preprocessor expansion, macros with side effects, conditional compilation, or translation phases;
- raw byte/object representation, strict aliasing, union punning, alignment, placement `new`, launder, or allocator internals;
- multiple/virtual inheritance, virtual dispatch during construction/destruction, RTTI, or complex covariant returns;
- concepts, ranges, coroutines, designated initializers, spaceship operator, or other C++20+ features;
- dependent-name lookup, SFINAE puzzles, ADL traps, or metaprogramming whose value is primarily compiler trivia;
- dangling/UB snippets presented as if their observed compiler output were an answer;
- output depending on plain-`char` signedness, integer width, container capacity growth, hash iteration order, address values, or moved-from contents.

Areas excluded here may be worthwhile advanced topics, but they do not belong in a compact everyday code-reading trainer.

### Global answer conventions

Prefer structured controls over permissive free text.

- Numeric/output answers are exact and preserve output order. Whitespace between separate printed tokens is normalized only when the program actually prints a separator.
- Named-state answers use separate fields (`a`, `b`, `result`) rather than one loosely parsed string.
- Behavior judgments use the five canonical buttons above; aliases such as `UB` may be accepted in text fallback.
- Type answers use a choice control or canonical spelling. Whitespace around `*`, `&`, and `&&` is ignored; `const int&` and `int const&` are equivalent.
- Top-level cv/ref qualifiers must not be silently dropped in type answers.
- Overload answers use stable candidate labels shown beside declarations, such as `A: f(int&)`.
- “Compile error” means ill-formed under the displayed C++17 program, not a link error or warning.
- Output strings are case-sensitive when string literals make case observable.

Do not accept a final value alone when the question requests both type and value, or an overload name alone when multiple overloads share that name.

### Difficulty philosophy

Difficulty should increase through:

- tracking aliases separately from values;
- removing explicit state tables after the method is learned;
- combining two independently mastered rules;
- switching from forward execution to diagnosis or inverse questions;
- weakening syntactic cues while keeping code short;
- distinguishing viable from best overloads;
- distinguishing declared type, expression type, and value category;
- following lifetime through one ownership or invalidation event;
- separating a dense declarator into layers.

Difficulty must not increase merely through long loops, many variables, huge values, arbitrary identifier names, deeply nested syntax, large overload sets, or obscure standard-library facts. Each snippet should normally fit on one screen and contain at most one primary trap plus one mastered supporting rule.

### Global generation requirements

Every instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `cppStandard`, `questionKind`, `behaviorClass`, `concepts`, `misconceptionsTargeted`, `parameters`, `code`, `scaffold`, `canonicalAnswer`, `acceptedAnswers`, `workedTrace`, `compilerValidationMode`, and `structuralSignature`.

Generation proceeds as:

1. select a semantic skeleton and target misconception;
2. choose values/types under the skeleton's proof obligations;
3. derive the answer with a semantic evaluator or family-specific rules;
4. render a complete translation unit for validation;
5. compile, and run only when execution is required and known safe;
6. apply rejection and uniqueness checks;
7. render the learner snippet from the validated semantic object.

Cosmetic changes to names or constants do not constitute meaningful variation. Avoid the same structural signature in the last 20 questions and an identical rendered snippet in the last 100.

### Compiler validation policy

Compiler testing supplements, but does not replace, specification reasoning.

- Deterministic snippets must compile with strict C++17 flags on GCC and Clang and, when safe, produce the same expected output.
- Compile-error snippets must fail on both compilers for the intended rule. Diagnostic wording is not graded.
- UB snippets must never be executed as validation. Sanitizers may be supplementary tests, not proof.
- Unspecified and implementation-defined snippets may compile, but observed output must never become the answer.
- Every generated snippet must be reviewed against the normative family derivation; “both compilers agree” is insufficient evidence of portability.

Recommended strict flags include `-std=c++17 -pedantic-errors -Wall -Wextra`; warnings must not be treated as errors unless the family explicitly tests ill-formedness rather than warning policy.

## 2. Category: Runtime State and Control

### Category purpose

Train execution of guaranteed statement order and control flow while maintaining a compact state model.

### Learn

Trace only live variables and update them after each executed full-expression. Prefix increment changes then yields the new value; postfix yields the old value then changes the object. `&&` and `||` evaluate left-to-right and may skip the right operand. `return`, `break`, and `continue` change which statements execute.

Never infer operand evaluation order from postfix syntax. If two side effects are unsequenced, classify the program instead of inventing an output.

### Prerequisites

Basic C++ syntax, integer arithmetic, and Boolean conditions.

### Category boundaries

Aliasing across references/pointers belongs to Aliasing and Parameters. Type-driven overload behavior belongs to Overloads and Templates. Lifetime-invalid execution belongs to Lifetime and Ownership.

### Subcategories

1. Straight-Line State
2. Increment and Short-Circuit
3. Branches and Loops
4. Sequencing and Behavior Judgment

### Common misconceptions

- Treating postfix increment as “increment before everything.”
- Evaluating a skipped right operand of `&&` or `||`.
- Applying an update from a branch that was not taken.
- Incrementing the loop counter after `break` or `return`.
- Assuming function arguments evaluate left-to-right.
- Calling every surprising output undefined behavior.

## 2.1 Subcategory: Straight-Line State

### Family `runtime_state_trace`

**Learner task.** Determine final values after a short sequence of assignments and compound assignments.

**Response mode.** One to three named integer fields.

**Template.**

```cpp
int {aName} = {a0};
int {bName} = {b0};
{statements}
```

Prompt: `What are the final values of {requestedNames}?`

**Derivation.** Execute each full-expression in source order using mathematical integers, after proving every operation fits `int` and every divisor is nonzero.

**Constraints and rejection.** Two to six state-changing statements; at most three live variables. No aliasing, hidden conversion, function call, unsequenced side effect, or dead variable unrelated to the answer. Reject identity updates and traces dominated by arithmetic.

**Difficulty.**

- Level 1: one variable, `=`, `+=`, `-=`.
- Level 2: two variables with right sides read before assignment.
- Level 3: swap-like dependencies without library calls.
- Level 4: one conditional expression already mastered.
- Level 5: ask an intermediate and final state, not more statements.

**Feedback.** Show a statement/state table. Diagnose using an updated right-hand value too early or treating compound assignment as independent.

**Examples.**

1. Code: `int x=4; x+=3; x-=2;` Answer `x=5`. Level 1.
2. Code: `int a=3; int b=5; a+=b; b=a-b;` Answer `a=8, b=3`. Level 2.
3. Code: `int a=2; int b=7; int c=a+b; a=c-b+4; b=c-a;` Answer `a=6, b=3`. Level 3.

**Implementation and validation.** Generate an AST-like statement list and interpret it independently. Compile/run the rendered translation unit and compare requested fields. Coverage balances assignment forms and dependency graphs.

## 2.2 Subcategory: Increment and Short-Circuit

### Family `prefix_postfix_trace`

**Learner task.** Track the yielded value and side effect of prefix or postfix increment/decrement in sequenced statements.

**Response mode.** Named fields for affected variables.

**Template.**

```cpp
int x = {start};
int y = {prefixOrPostfixExpression};
{optionalSequencedUse}
```

**Derivation.** Prefix modifies `x` then yields an lvalue with new value. Postfix yields the old prvalue and schedules the increment as specified within the full-expression; after its initializer completes, `x` has changed.

**Constraints and rejection.** At most one modification of an object per full-expression. No expression such as `x++ + x`, `f(x++,x++)`, or chained mutation. Values avoid overflow.

**Difficulty.** Level 1 compare `y=++x` and `y=x++`. Level 2 one later use of both. Level 3 decrement and conditional context. Level 4 choose equivalent state transition. Level 5 interleave with a mastered reference alias only in Aliasing.

**Feedback.** Separate “value yielded to `y`” from “new stored value of `x`.”

**Examples.**

1. `int x=4; int y=x++;` Answer `x=5, y=4`. Level 1.
2. `int x=4; int y=++x; x+=y;` Answer `x=10, y=5`. Level 2.
3. `int x=3; int y=x--; int z=--x;` Answer `x=1, y=3, z=1`. Level 3.

**Implementation and validation.** Family evaluator models yielded/stored values separately. Compile/run under both compilers. Ensure exactly one side effect per scalar per full-expression.

### Family `short_circuit_trace`

**Learner task.** Determine which Boolean operands execute and the resulting state/value.

**Response mode.** Named state fields plus optional Boolean result.

**Template.**

```cpp
int x = {start};
bool hit = {left} {operator} {right};
```

`{operator}` is `&&` or `||`.

**Derivation.** Evaluate left first. For `&&`, skip right when left is false; for `||`, skip right when left is true. Any side effect in an evaluated operand completes according to its own expression.

**Constraints and rejection.** Each operand independently well-defined; right side has a visible state change in most questions. Balance executed/skipped and true/false results. No overloaded logical operators.

**Difficulty.** Level 1 side-effect-free conditions. Level 2 one postfix side effect on left. Level 3 right side mutates state. Level 4 nested two-operator expression with parentheses. Level 5 asks executed labels/order, not extra arithmetic.

**Feedback.** Mark each operand `evaluated` or `skipped`, then show state.

**Examples.**

1. `int x=0; bool hit=(x==0)||(x++>0);` Answer `x=0, hit=true`; right skipped. Level 2.
2. `int x=1; bool hit=(x++==0)||(++x==3);` Answer `x=3, hit=true`. Level 3.
3. `int x=0; bool hit=(x++!=0)&&((x+=10)>0);` Answer `x=1, hit=false`; right skipped. Level 3.

**Implementation and validation.** Interpret logical AST with explicit sequencing. Compile/run deterministic snippets; coverage crosses operator, left truth, right execution, and side-effect kind.

## 2.3 Subcategory: Branches and Loops

### Family `branch_trace`

**Learner task.** Follow one or two dependent branches and report final state.

**Response mode.** Named integer fields.

**Template.** Complete `if/else if/else` snippet with generated comparisons and bounded arithmetic.

**Derivation.** Evaluate conditions in order until one selected arm, execute only it, then continue after statement.

**Constraints and rejection.** Exactly one primary branch decision; no assignment in condition, dangling-else ambiguity, implicit unsigned conversion, or overflow. Each arm must yield a distinct requested state.

**Difficulty.** Level 1 one `if/else`. Level 2 chained condition. Level 3 condition depends on earlier update. Level 4 nested branch with braces. Level 5 infer which arm from final-state options.

**Feedback.** Show condition truth values only until selected branch; strike skipped arms.

**Examples.**

1. `int x=4; if(x<5) x+=3; else x-=3;` Answer `x=7`. Level 1.
2. `int a=3,b=6; if(a+b>10) ++a; else if(b-a==3) b+=a; else --b;` Answer `a=3,b=9`. Level 2.
3. `int x=5; x-=2; if(x%2==0){x*=3;}else{x+=4;}` Answer `x=7`. Level 3.

**Implementation and validation.** Semantic branch evaluator plus compile/run. Generate distinct arms and verify only one is selected.

### Family `loop_trace`

**Learner task.** Trace a bounded `for` or `while` loop with dependent state.

**Response mode.** One to three named fields.

**Template.** A loop of at most six iterations with explicit initialization, condition, update, and body.

**Derivation.** Record loop-head state, test condition, execute body/control transfer, then loop update when applicable.

**Constraints and rejection.** Guaranteed termination proved by generator. At most three live variables and six iterations. No container invalidation, overflow, unsequenced modification, or arithmetic-heavy nested loops. Every branch pattern should be exercised by some instances.

**Difficulty.** Level 2 fixed-count accumulator. Level 3 state-dependent branch. Level 4 `continue` or `break`. Level 5 early `return` through a small reference-parameter function.

**Feedback.** Show one row per executed iteration including whether update ran. Stop table immediately at `break`/`return`.

**Examples.**

1. `int s=0; for(int i=1;i<=3;++i) s+=i;` Answer `s=6`. Level 2.
2. `int a=1,b=4; for(int i=0;i<3;++i){if(a<b)a+=i+1;else --b;}` Answer `a=4,b=3`. Level 3.
3. `int s=0; for(int i=0;i<6;++i){if(i==2)continue; if(i==4)break; s+=i;}` Answer `s=4`; adds 0,1,3. Level 4.

**Implementation and validation.** Generator supplies a termination bound and independent interpreter. Compile/run both compilers. Coverage balances actual iteration count and control transfer.

## 2.4 Subcategory: Sequencing and Behavior Judgment

### Family `expression_behavior_classification`

**Learner task.** Classify a small expression/program under C++17 without predicting a nonportable output.

**Response mode.** Five-way behavior judgment.

**Template.** `Under ISO C++17, classify this program: deterministic, unspecified, implementation-defined, undefined behavior, or compile error.`

**Generation scope.** Controlled skeletons only:

- unsequenced modifications of one scalar (`i++ + i++`) → UB;
- function arguments with indeterminately sequenced evaluations in C++17 where order affects output → unspecified;
- right shift of negative signed integer → implementation-defined in C++17;
- signed integer overflow or division by zero reached → UB;
- braced narrowing or invalid binding → compile error;
- sequenced comma/logical/conditional examples → deterministic.

**Derivation.** Apply the exact C++17 sequencing, expression, or diagnostic rule associated with the skeleton. Do not generalize from compiler output.

**Constraints and rejection.** One classification cause only. No dead UB in an unexecuted branch unless the skill is reachability, in which case canonical behavior is deterministic and feedback says the bad operation is not evaluated. Avoid cases whose classification changed in a nearby standard unless the C++17 label is prominent.

**Difficulty.** Level 2 deterministic versus UB. Level 3 add compile error. Level 4 add unspecified. Level 5 add implementation-defined and unreachable-danger contrasts.

**Multiple-choice distractors.** The other four canonical classes. Feedback must explain why “unspecified” still has defined program behavior and why a compiler diagnostic/observed result is not a guarantee.

**Examples.**

1. `int i=0; int x=i++ + i++;` Answer `undefined behavior`; modifications are unsequenced. Level 2.
2. `void f(int a,int b){std::cout<<a<<b;} int i=0; f(i++,i++);` Answer `unspecified`; in C++17 argument evaluations are indeterminately sequenced, so output may be `01` or `10`, but there is no unsequenced-modification UB. Level 4.
3. `int x=-4; int y=x>>1;` Answer `implementation-defined` in C++17. Level 5.

**Implementation and validation.** Classification comes from whitelisted proof-carrying skeletons, not execution. Compile deterministic/unspecified/implementation-defined examples; never run UB. Compile-error skeletons must fail on GCC/Clang. Coverage balances all classes without encouraging “everything tricky is UB.”

### Cross-family progression for Runtime State and Control

Straight-line state precedes prefix/postfix. Short-circuiting precedes loops with `continue` or early return. Behavior classification starts with deterministic/UB contrasts and adds unspecified/implementation-defined only after sequencing vocabulary is learned. Never mix a new behavior class into an ordinary output question.

## 3. Category: Aliasing and Parameters

### Category purpose

Train the distinction among an object, a reference alias, a pointer value, and a copied parameter; predict which object each write reaches.

### Learn

A reference is another name for its bound object and cannot be reseated. A pointer stores an address and can be reseated. Passing `int* p` copies the pointer; reseating the local copy does not reseat the caller's pointer. Passing `int*& p` aliases the caller's pointer itself.

Draw an object table and arrows before calculating values.

### Prerequisites

Straight-line state and basic declaration reading.

### Category boundaries

Dangling handles belong to Lifetime. Pointer arithmetic, arrays, ownership, alias analysis/optimization, and strict aliasing are excluded here.

### Subcategories

1. References and Pointer Reseating
2. Parameter Passing
3. Alias Topology

### Common misconceptions

- Treating reference assignment as rebinding.
- Believing reseating a pointer changes a reference created from its old pointee.
- Treating a pointer parameter as pass-by-reference.
- Confusing mutation through a copied pointer with reseating the caller's pointer.
- Assuming two equal values imply aliasing.
- Losing track of which name denotes the pointer object versus pointee.

## 3.1 Subcategory: References and Pointer Reseating

### Family `reference_alias_trace`

**Learner task.** Trace writes through one or more references.

**Response mode.** Named object values.

**Template.** Declarations of objects and `int&`/`const int&` bindings followed by assignments through modifiable aliases.

**Derivation.** Build a fixed binding map at each reference initialization; every reference read/write targets that object. `r=b` assigns `b`'s value into the object referred to by `r`.

**Constraints and rejection.** No dangling references, temporary lifetime issue, or illegal const write. At most two reference aliases and three objects.

**Difficulty.** Level 1 one alias write. Level 2 reference assignment versus rebinding. Level 3 two aliases to same/different object. Level 4 reference returned from a safe function. Level 5 mix const read alias with mutable alias.

**Feedback.** Show binding arrows separately from object values. Diagnose rebinding if the learner updates the wrong later object.

**Examples.**

1. `int a=4; int& r=a; r+=3;` Answer `a=7`. Level 1.
2. `int a=2,b=5; int& r=a; r=b; ++r;` Answer `a=6,b=5`; `r=b` assigns. Level 2.
3. `int a=1,b=2; int& r=a; int& s=r; s+=b; r*=2;` Answer `a=6,b=2`. Level 3.

**Implementation and validation.** Interpret bindings and values as separate graph/state. Compile/run deterministic snippets. Balance assignment-through-reference and alias chains.

### Family `pointer_reseat_trace`

**Learner task.** Track pointer reseating and writes through the current pointee.

**Response mode.** Named object values and optionally selected pointee label.

**Template.** Two/three objects, one pointer, assignments `p=&object`, and dereferences.

**Derivation.** Pointer assignment changes its stored target; `*p` reads/writes the current target only.

**Constraints and rejection.** Pointer always non-null and points to live object. No arithmetic, ownership, arrays, or pointer comparisons.

**Difficulty.** Level 1 one target. Level 2 reseat once. Level 3 reference bound before pointer reseat. Level 4 pointer-to-pointer only in a separate advanced variation. Level 5 infer target from effects.

**Feedback.** Update pointer arrow at each reseat while leaving existing reference arrows unchanged.

**Examples.**

1. `int a=3; int* p=&a; *p+=2;` Answer `a=5`. Level 1.
2. `int a=3,b=7; int* p=&a; p=&b; *p-=2;` Answer `a=3,b=5`. Level 2.
3. `int a=2,b=5; int* p=&a; int& r=*p; p=&b; r+=*p;` Answer `a=7,b=5`. Level 3.

**Implementation and validation.** Pointer-target graph evaluator plus compile/run. Coverage balances original/current pointee and reference-before-reseat.

## 3.2 Subcategory: Parameter Passing

### Family `parameter_passing_trace`

**Learner task.** Predict caller-visible changes for by-value, reference, and pointer parameters.

**Response mode.** Named caller-state fields.

**Template.** One short function and call; parameters selected from `int`, `int&`, `const int&`, `int*`.

**Derivation.** By-value creates a new object. Reference aliases argument. Pointer-by-value creates a pointer copy but dereferencing still reaches caller object; reseating only changes local pointer.

**Constraints and rejection.** Arguments bind legally and remain live. At most three parameters and four writes. No overloads, templates, default arguments, or lifetime transfer.

**Difficulty.** Level 1 one parameter kind. Level 2 compare value/reference. Level 3 pointer mutation versus reseat. Level 4 several parameter modes. Level 5 aliasing arguments only when all writes are sequenced in separate statements.

**Feedback.** Create a call-frame table with parameter object/alias/target.

**Examples.**

1. `void f(int x){++x;} int a=4; f(a);` Answer `a=4`. Level 1.
2. `void f(int& x){x+=3;} int a=4; f(a);` Answer `a=7`. Level 1.
3. `void f(int* p,int& y){p=&y; *p+=2;} int a=3,b=5; int* p=&a; f(p,b); *p+=1;` Answer `a=4,b=7`; caller `p` was not reseated. Level 3.

**Implementation and validation.** Model call frames explicitly; compile/run. Track parameter kind and caller-visible effect.

### Family `pointer_reference_parameter`

**Learner task.** Distinguish passing a pointer by value from passing the pointer object by reference.

**Response mode.** Pointee label plus named object values.

**Template.** Paired functions `void f(int* p,...)` and `void g(int*& p,...)`, presented separately or contrasted.

**Derivation.** `int*&` binds to caller pointer object, so assignment to `p` reseats caller. `int*` copies it.

**Constraints and rejection.** Caller pointer is an lvalue, all pointees live, no ownership. Paired choice snippets must differ only in parameter declarator.

**Difficulty.** Level 3 direct trace. Level 4 compare outputs. Level 5 pointer-to-const qualification only after const types mastered.

**Feedback.** Draw an arrow from reference parameter to caller pointer, then caller pointer to object.

**Examples.**

1. `void f(int* p,int& b){p=&b;} int a=1,b=2; int* p=&a; f(p,b);` Answer `p points to a`. Level 3.
2. `void f(int*& p,int& b){p=&b;} int a=1,b=2; int* p=&a; f(p,b);` Answer `p points to b`. Level 3.
3. `void f(int*& p,int& b){p=&b; *p+=3;} int a=1,b=2; int* p=&a; f(p,b); *p+=4;` Answer `a=1,b=9, p points to b`. Level 4.

**Implementation and validation.** Binding graph includes pointer objects as nodes. Compile/run and validate target labels without comparing raw addresses.

## 3.3 Subcategory: Alias Topology

### Family `alias_relationship`

**Learner task.** Identify which names/handles refer to the same object after declarations and reseating.

**Response mode.** Matching or multiple-choice alias groups.

**Template.** Small declaration block, then `Which names currently designate the same int object?`

**Derivation.** Resolve every reference binding and current pointer target; group handles by object identity, not value.

**Constraints and rejection.** Equal-valued distinct objects deliberately recur. No dangling or null dereference. Exactly one answer partition.

**Difficulty.** Level 2 reference/object pairs. Level 3 pointer reseating. Level 4 two pointers and reference. Level 5 infer topology from a deterministic trace.

**Multiple-choice distractors.** Group by equal value, assume reference rebinding, keep pointer's original target, or treat pointer variable itself as pointee.

**Feedback.** Show object-identity diagram before values.

**Examples.**

1. `int a=3,b=3; int& r=a;` Answer alias group `{a,r}`; `b` is distinct. Level 2.
2. `int a=1,b=2; int* p=&a; int& r=*p; p=&b;` Answer `{a,r}` and `{b,*p}`. Level 3.
3. `int a=1,b=1; int *p=&a,*q=p; p=&b;` Answer `{a,*q}` and `{b,*p}`. Level 4.

**Implementation and validation.** Compare generated object IDs, never values. For choices assert one exact partition. Coverage includes equal-value decoys.

### Cross-family progression for Aliasing and Parameters

References precede pointer reseating. Pointer-by-value follows direct pointers; pointer-by-reference follows all basic parameter modes. Alias-topology questions interleave after tracing because they isolate identity from arithmetic. Lifetime is deliberately absent until the next category.

## 4. Category: Types and Conversions

### Category purpose

Train separation of declared type, deduced type, expression type/value category, and converted stored value.

### Learn

Plain `auto` generally follows by-value template deduction: it drops references and top-level `const`. `auto&` preserves the referred object's constness. `auto&&` with an lvalue initializer is a forwarding-reference context and collapses to an lvalue reference.

`decltype(name)` gives the declared type of an unparenthesized id-expression. Otherwise `decltype(expr)` gives `T&` for an lvalue, `T&&` for an xvalue, and `T` for a prvalue. Small integer operands usually undergo integer promotion. Braced initialization rejects narrowing that `=` or `()` initialization may allow.

### Prerequisites

Declarations, references, and basic expression syntax.

### Category boundaries

Overload consequences belong to Overloads and Templates. Lifetime of a temporary bound by a deduced reference belongs to Lifetime after the type itself is understood.

### Subcategories

1. `auto` Deduction
2. `decltype` and Value Categories
3. Promotions and Arithmetic Conversions
4. Initialization and Narrowing
5. Const and Pointer Qualification

### Common misconceptions

- Preserving top-level `const` in plain `auto`.
- Dropping constness through `auto&`.
- Assuming `auto&&` always means rvalue reference.
- Treating a named rvalue-reference variable as an xvalue expression.
- Assuming `decltype(x)` and `decltype((x))` are equal.
- Believing `std::uint8_t + 1` retains the byte type.
- Treating a warning-producing conversion as a compile error.
- Believing braces merely change syntax rather than narrowing rules.

## 4.1 Subcategory: `auto` Deduction

### Family `auto_type_deduction`

**Learner task.** Determine the exact declared type produced by `auto`, `auto&`, `const auto&`, or `auto&&`.

**Response mode.** Type choice/input.

**Template.**

```cpp
{initializerDeclarations}
{autoForm} x = {initializer};
```

Prompt: `What is the declared type of x?`

**Derivation.**

- Plain `auto`: deduce as by-value template parameter; drop reference and top-level cv.
- `auto&`: require lvalue and preserve pointee cv in deduced base.
- `const auto&`: add top-level const to referred base and bind valid initializer.
- `auto&&`: lvalue initializer deduces `T&` then collapses `T& &&` to `T&`; prvalue/xvalue yields rvalue reference, preserving cv where applicable.

**Constraints and rejection.** No arrays/functions until a controlled variation explicitly covers their special deduction. Initializer remains live where runtime use occurs. Ask declared type, not `decltype((x))`.

**Difficulty.** Level 1 literal/plain auto. Level 2 top-level const dropped. Level 3 `auto&`/`const auto&`. Level 4 `auto&&` lvalue/rvalue. Level 5 mixed initializer value category with const.

**Feedback.** Show placeholder deduction and reference collapsing. Diagnose only the qualifier/reference that differs.

**Examples.**

1. `auto x=42.0;` Answer `double`. Level 1.
2. `const int n=4; auto x=n;` Answer `int`. Level 2.
3. `const int n=4; auto&& x=n;` Answer `const int&`. Level 4.

**Implementation and validation.** Generate canonical types from a type-deduction model. Validate with `static_assert(std::is_same_v<decltype(x), Expected>)` under both compilers. Balance forms and initializer cv/value category.

## 4.2 Subcategory: `decltype` and Value Categories

### Family `decltype_inference`

**Learner task.** Determine `decltype` or a `decltype(auto)` variable's exact declared type.

**Response mode.** Type choice/input.

**Template.** A declaration plus `using R = decltype({expression});` or `decltype(auto) r = {initializer};`.

**Derivation.** Apply the unparenthesized id/member exception first. Otherwise map lvalue→`T&`, xvalue→`T&&`, prvalue→`T`. `decltype(auto)` applies those rules to its initializer exactly.

**Constraints and rejection.** Expressions are valid and their category proven by skeleton. No bit-fields, overloaded comma, proxy references, or dangling return.

**Difficulty.** Level 2 unparenthesized name. Level 3 parenthesized lvalue. Level 4 `std::move` xvalue and `decltype(auto)`. Level 5 member-access exception versus parenthesized member.

**Feedback.** Identify exception/category, then add qualifier/reference.

**Examples.**

1. `int x=0; using R=decltype(x);` Answer `int`. Level 2.
2. `int x=0; using R=decltype((x));` Answer `int&`. Level 3.
3. `const int x=0; decltype(auto) r=(x);` Answer `const int&`. Level 4.

**Implementation and validation.** `static_assert` exact type. Coverage crosses parentheses, cv, and value category.

### Family `value_category`

**Learner task.** Classify a displayed expression as lvalue, xvalue, or prvalue.

**Response mode.** Three-way choice.

**Template.** Declarations plus highlighted expression `{expr}`; prompt `What is its value category?`

**Derivation.** Use expression-category rules: named variables are lvalues even if declared `T&&`; literals of scalar type are prvalues; `std::move(x)` is an xvalue; dereference yields lvalue; a function declared `T&& f()` call is xvalue.

**Constraints and rejection.** Exact type must be valid but not itself the target. Avoid class prvalue materialization subtleties and overloaded operators initially.

**Difficulty.** Level 2 name/literal. Level 3 `*p` and function calls returning references. Level 4 named rvalue reference versus `std::move`. Level 5 member access whose category follows object.

**Feedback.** State category rule and distinguish declared reference type from expression category.

**Examples.**

1. `int x=0;` expression `x` Answer `lvalue`. Level 2.
2. Expression `42` Answer `prvalue`. Level 2.
3. `int&& r=42;` expression `r` Answer `lvalue`; expression `std::move(r)` would be xvalue. Level 4.

**Implementation and validation.** Validate via overload probes accepting `T&`, `T&&`, or fallback without exposing probe code to learner. Balance categories.

## 4.3 Subcategory: Promotions and Arithmetic Conversions

### Family `promoted_type_and_value`

**Learner task.** Determine result type and value after portable integer promotion/usual arithmetic conversion.

**Response mode.** Two fields: type and value.

**Template.** Declarations plus `auto result = {expression};`.

**Derivation.** Apply lvalue-to-rvalue conversion, integral promotions, then usual arithmetic conversions. Compute value only after proving it is representable and portable under the abstract environment.

**Scope.** Safe skeletons include `std::uint8_t + int`, `bool + short`, same-signed small integers, and integer with `double`. Unsigned-width-dependent result values are excluded.

**Constraints and rejection.** No overflow, plain-char signedness, enum quirks, bit-fields, or mixed signed/unsigned value whose numerical result depends on width/rank. If only type is portable, do not ask value.

**Difficulty.** Level 2 two small promoted operands. Level 3 fixed-width byte. Level 4 floating conversion. Level 5 a comparison whose converted operands remain portable.

**Feedback.** Show each promoted type before operation. Diagnose wraparound imagined at operand's storage width.

**Examples.**

1. `short a=7,b=8; auto r=a+b;` Answer `int, 15`. Level 2.
2. `std::uint8_t x=255; auto r=x+1;` Answer `int, 256`. Level 3.
3. `int x=3; auto r=x+0.5;` Answer `double, 3.5`. Level 4.

**Implementation and validation.** Compile-time `static_assert` for type and safe runtime output for value. Whitelist portable type combinations.

### Family `conversion_behavior`

**Learner task.** Judge or compute one explicit implicit conversion whose rule is portable.

**Response mode.** Stored value/type or behavior judgment.

**Template.** One declaration/assignment conversion.

**Derivation.** Apply target-type conversion rules. Floating-to-integer truncates toward zero when representable; out-of-range floating-to-integer is UB. Integer-to-unsigned reduces modulo `2^N`; bool conversion compares with zero.

**Constraints and rejection.** Ask exact value only when target range/width is known or value makes result width-independent. Keep one conversion cause. Braced narrowing belongs to the next family.

**Difficulty.** Level 2 bool/integer. Level 3 representable float-to-int. Level 4 negative-to-unsigned classification/value only under explicit fixed-width type. Level 5 boundary behavior judgment.

**Feedback.** Name conversion direction and range condition. Do not call ordinary truncation a compile error.

**Examples.**

1. `double d=3.9; int x=d;` Answer `x=3`, deterministic. Level 2.
2. `int n=-2; bool b=n;` Answer `b=true`. Level 2.
3. `double d=1e100; int x=d;` Answer `undefined behavior` when conversion executes because value is outside representable range. Level 5.

**Implementation and validation.** Safe deterministic examples compile/run. UB skeletons are not run. Bounds use `std::numeric_limits`; no platform-dependent exact result requested.

## 4.4 Subcategory: Initialization and Narrowing

### Family `initialization_judgment`

**Learner task.** Decide whether one initialization is well-formed and, if so, give stored value.

**Response mode.** Behavior judgment plus optional value field enabled only for deterministic choice.

**Template.** `{targetType} x {initializerSyntax};` with `= expr`, `(expr)`, or `{expr}`.

**Derivation.** Determine viable conversion, then apply list-initialization narrowing prohibition when braces are used. A constant-expression exception is used only where the standard permits it and is explicitly tested.

**Constraints and rejection.** One declaration per judgment so an ill-formed sibling does not poison a whole snippet. No initializer-list constructor overloads in this family.

**Difficulty.** Level 2 `=`/`()`. Level 3 obvious braced narrowing. Level 4 constant-expression boundary exceptions. Level 5 compare three separate declarations via matching.

**Feedback.** Separate conversion result from brace admissibility.

**Examples.**

1. `int x=3.9;` Answer `deterministic, x=3`. Level 2.
2. `int x(3.9);` Answer `deterministic, x=3`. Level 2.
3. `int x{3.9};` Answer `compile error`; narrowing. Level 3.

**Implementation and validation.** Each item is its own translation unit. Deterministic values run; compile-error cases must fail both compilers. Coverage balances syntax and narrowing source/target.

## 4.5 Subcategory: Const and Pointer Qualification

### Family `const_pointer_type`

**Learner task.** Decode pointer/pointee constness or judge an assignment through the pointer.

**Response mode.** Type description/matching or behavior judgment.

**Template.** Declarations using `const int*`, `int* const`, and `const int* const`, followed optionally by a reseat/write.

**Derivation.** Read from identifier outward: cv after `*` qualifies pointer object; cv before base qualifies pointee. Check whether requested operation modifies/reseats the qualified entity.

**Constraints and rejection.** Pointees live; no cast removing const, multiple pointer levels, or volatile.

**Difficulty.** Level 2 decode one qualifier. Level 3 judge write/reseat. Level 4 distinguish two declarations. Level 5 combine with `auto` deduction.

**Feedback.** Present two columns: `pointer reseatable?`, `pointee writable through p?`.

**Examples.**

1. `const int* p=&x;` Answer `pointer to const int; p may be reseated, *p not written through p`. Level 2.
2. `int* const p=&x;` Answer `const pointer to int; p not reseated, *p writable`. Level 2.
3. `int x=1,y=2; int* const p=&x; p=&y;` Answer `compile error`. Level 3.

**Implementation and validation.** Type traits/static assertions plus compile tests for operations. Choice distractors swap pointer/pointee const.

### Cross-family progression for Types and Conversions

Plain `auto` precedes references and `auto&&`. Value categories precede forwarding references in overload resolution. `decltype` follows reference basics. Promotions precede overload conversion ranking. Initialization judgment isolates one declaration at a time. Const-pointer reading supports later ownership/callable declarations.

## 5. Category: Overloads and Templates

### Category purpose

Train the candidate pipeline: form the overload set, test viability, rank conversions, apply template deduction/partial ordering, then select one function or diagnose ambiguity.

### Learn

Do not choose by name or by “template versus non-template” first:

1. collect candidates;
2. determine viability;
3. compare implicit conversion sequences;
4. apply non-template preference only when conversion quality ties;
5. for templates, apply partial ordering when needed.

Lvalues, const lvalues, and rvalues bind differently. A forwarding reference `T&&` can deduce `T` as a reference for lvalue arguments.

### Prerequisites

Exact types, cv/ref qualification, and value categories.

### Category boundaries

No ADL traps, user-defined conversions beyond one named constructor, SFINAE, dependent lookup, concepts, or large overload sets.

### Subcategories

1. Non-Template Overloads
2. Reference Overloads
3. Template Deduction
4. Forwarding
5. Template Ordering and Ambiguity

### Common misconceptions

- Choosing the overload whose parameter “looks closest” without ranking.
- Believing any non-template beats any template.
- Treating top-level const on by-value parameter as an overload distinction.
- Binding non-const lvalue reference to a temporary.
- Deducing `T=const int` for by-value parameter from a const int argument.
- Deducing forwarding-reference `T=int` from an int lvalue.
- Forgetting that a named `T&&` parameter is an lvalue expression.

## 5.1 Subcategory: Non-Template Overloads

### Family `overload_conversion_rank`

**Learner task.** Select the best non-template overload from two or three labeled candidates.

**Response mode.** Candidate label.

**Template.** Labeled overload declarations with simple marker bodies and one call.

**Derivation.** Determine viability, classify each implicit conversion (exact match, promotion, conversion), then select unique best.

**Constraints and rejection.** No user-defined conversions, ellipsis, default arguments, or implementation-dependent types. Exactly one best candidate unless ambiguity is explicit in another family.

**Difficulty.** Level 1 exact type. Level 2 promotion versus conversion. Level 3 qualification/reference effects. Level 4 multiple arguments with one unique dominance. Level 5 diagnose no unique best.

**Feedback.** Provide a candidate table with viability and conversion ranks.

**Examples.**

1. `A: f(int); B: f(double); f(2.5);` Answer `B`. Level 1.
2. `A: f(int); B: f(double); char c{}; f(c);` Answer `A`; integral promotion beats conversion to double. Level 2.
3. `A: f(long); B: f(double); f(1L);` Answer `A`; exact match. Level 2.

**Implementation and validation.** Render marker output and compile/run. For compile-time checks, take address in resolved context where possible. Coverage balances winning position/rank.

## 5.2 Subcategory: Reference Overloads

### Family `reference_overload_resolution`

**Learner task.** Select among `T&`, `const T&`, and `T&&` for lvalue, const lvalue, prvalue, or xvalue argument.

**Response mode.** Candidate label or marker output.

**Derivation.** Determine argument value category/cv, remove nonviable bindings, compare exact bindings.

**Constraints and rejection.** Same base type; no inheritance or conversions. Candidate set labeled and unique.

**Difficulty.** Level 1 lvalue/prvalue. Level 2 const lvalue. Level 3 `std::move`. Level 4 named rvalue-reference variable. Level 5 mixed call sequence.

**Feedback.** State argument category at each call before choosing.

**Examples.**

1. `A:f(int&); B:f(const int&); C:f(int&&); int x; f(x);` Answer `A`. Level 1.
2. Same overloads, `const int x{}; f(x);` Answer `B`. Level 2.
3. Same overloads, `int&& r=1; f(r);` Answer `A`; named `r` is an lvalue. Level 4.

**Implementation and validation.** Marker compile/run and static invocability checks. Balance argument categories.

## 5.3 Subcategory: Template Deduction

### Family `template_argument_deduction`

**Learner task.** Deduce `T` for by-value, `T&`, or `const T&` function-template parameter.

**Response mode.** Canonical type.

**Template.**

```cpp
template<class T> void f({parameterPattern});
{argumentDeclaration}
f({argument});
```

**Derivation.** Apply template argument deduction adjustments for the parameter form. By-value drops top-level cv/ref; `T&` preserves cv in `T`; `const T&` usually deduces unqualified base `T` from const argument.

**Constraints and rejection.** No arrays/functions until a later controlled variation. No explicit template arguments or conversions during deduction.

**Difficulty.** Level 2 by-value. Level 3 `T&` and `const T&`. Level 4 pointer cv. Level 5 arrays by reference with extent as separate field.

**Feedback.** Show adjusted `P` and `A`, then substitution.

**Examples.**

1. `template<class T> void f(T); const int x{}; f(x);` Answer `T=int`. Level 2.
2. `template<class T> void f(T&); const int x{}; f(x);` Answer `T=const int`. Level 3.
3. `template<class T> void f(const T&); const int x{}; f(x);` Answer `T=int`. Level 3.

**Implementation and validation.** Instrument template with a compile-time expected-type assertion generated inside a helper specialization. Avoid relying on compiler type-name strings.

### Family `forwarding_reference_deduction`

**Learner task.** Deduce `T` and the collapsed parameter type for `template<class T> void f(T&&)`.

**Response mode.** Two type fields.

**Derivation.** For lvalue argument of type `U`, `T=U&`; parameter `U&`. For const lvalue, `T=const U&`; parameter `const U&`. For rvalue, `T=U`; parameter `U&&`.

**Constraints and rejection.** `T` is deduced; explicitly supplied `T` and non-deduced `const T&&` are excluded. Ask both fields to prevent hiding reference collapsing.

**Difficulty.** Level 3 int lvalue/prvalue. Level 4 const/xvalue. Level 5 alias types and multiple calls.

**Feedback.** Show special lvalue deduction then collapse rule.

**Examples.**

1. `int x; f(x);` Answer `T=int&, parameter int&`. Level 3.
2. `const int x{}; f(x);` Answer `T=const int&, parameter const int&`. Level 4.
3. `f(42);` Answer `T=int, parameter int&&`. Level 3.

**Implementation and validation.** Instantiate helper assertions for `T` and `decltype(param)`. Coverage balances cv/value category.

## 5.4 Subcategory: Forwarding

### Family `perfect_forwarding_call`

**Learner task.** Determine which sink overload receives an argument passed through `std::forward<T>`.

**Response mode.** Candidate label/marker output.

**Template.**

```cpp
void sink(int&); void sink(const int&); void sink(int&&);
template<class T>
void relay(T&& x) { sink(std::forward<T>(x)); }
```

plus one call.

**Derivation.** Deduce `T`; named `x` is lvalue, but `std::forward<T>(x)` conditionally casts it back to original category.

**Constraints and rejection.** Include `<utility>`. No returning/storing forwarded references. Same base type and unique sink.

**Difficulty.** Level 3 lvalue/prvalue. Level 4 const/xvalue. Level 5 contrast `sink(x)` with `sink(std::forward<T>(x))`.

**Feedback.** Show deduction, named-expression category, forward result, selected sink.

**Examples.**

1. `int n{}; relay(n);` Answer `sink(int&)`. Level 3.
2. `const int n{}; relay(n);` Answer `sink(const int&)`. Level 4.
3. `relay(42);` Answer `sink(int&&)`. Level 3.

**Implementation and validation.** Marker compile/run. Generate paired no-forward variations only when wording identifies which call is asked.

## 5.5 Subcategory: Template Ordering and Ambiguity

### Family `template_vs_nontemplate`

**Learner task.** Select between template and non-template candidates after conversion ranking.

**Response mode.** Candidate label.

**Derivation.** Compare conversion sequences first. Non-template preference resolves only an otherwise equal best match.

**Constraints and rejection.** Two candidates initially; no specialization, ADL, or user conversion. Unique selection.

**Difficulty.** Level 3 equal exact matches. Level 4 template exact versus non-template conversion. Level 5 add one nonviable candidate.

**Feedback.** Explicitly order conversion comparison before template tie-break.

**Examples.**

1. `A:void f(int); B:template<class T> void f(T); f(1);` Answer `A`; equal exact match, non-template preferred. Level 3.
2. `A:void f(long); B:template<class T> void f(T); f(1);` Answer `B`; exact beats conversion. Level 4.
3. `A:void f(const int&); B:template<class T> void f(T&); int x; f(x);` Answer `B`; binding to `int&` is better than qualification conversion. Level 5.

**Implementation and validation.** Marker compile/run under both compilers. Candidate table generated independently.

### Family `template_partial_order_or_ambiguity`

**Learner task.** Select a more specialized simple function template or identify an ambiguous/no-viable call.

**Response mode.** Candidate label or compile error.

**Scope.** Whitelisted skeletons: `f(T)` versus `f(T*)`; `f(T&)` versus `f(const T&)`; and non-template equal-rank ambiguity.

**Derivation.** After viability/conversion ties, apply function-template partial ordering. If no candidate is uniquely best, program is ill-formed due to ambiguity.

**Constraints and rejection.** No SFINAE, variadics, forwarding-reference special cases in the same item, or compiler-dependent diagnostics.

**Difficulty.** Level 3 pointer specialization. Level 4 cv-reference ordering. Level 5 deliberate equal-rank ambiguity.

**Feedback.** Separate overload ranking from template partial ordering; for ambiguity list incomparable candidates.

**Examples.**

1. `A:template<class T> f(T); B:template<class T> f(T*); int* p; f(p);` Answer `B`. Level 3.
2. `A:template<class T> f(T&); B:template<class T> f(const T&); const int x{}; f(x);` Answer `B`. Level 4.
3. `A:void f(long); B:void f(unsigned long); f(0);` Answer `compile error`; ambiguous equal-rank conversions. Level 5.

**Implementation and validation.** Marker compile/run for selected calls; compile-fail validation for ambiguity. Use independent template-rule metadata, not diagnostic parsing.

### Cross-family progression for Overloads and Templates

Non-template ranks precede reference overloads. Template deduction precedes template selection. Forwarding-reference deduction precedes `std::forward`. Partial ordering and ambiguity are last. An incorrect call selection should trigger a one-call candidate table, not a larger overload set.

## 6. Category: Lifetime and Ownership

### Category purpose

Train whether an object is alive, whether a handle remains valid, and which owner controls destruction—without using observed undefined or unspecified results as answers.

### Learn

Scope ends automatic object lifetime; a pointer/reference does not keep the object alive. Binding a local `const T&` or `T&&` directly to a temporary can extend that temporary's lifetime, but returning a reference to a temporary does not.

Container operations have specific invalidation rules. `std::move` is a cast to an xvalue; a move happens only when an operation consumes it. A moved-from standard-library object is valid but often has unspecified state. Moving a `std::unique_ptr` transfers ownership and leaves the source empty.

### Prerequisites

Aliasing, value categories, constructors, and basic standard containers/smart pointers.

### Category boundaries

No custom allocators, placement new, manual storage, weak-memory issues, exception unwinding, cyclic shared ownership, or implementation-specific small-string optimization.

### Subcategories

1. Scope and Dangling Handles
2. Temporary Lifetime
3. Iterator and Reference Invalidation
4. Move Semantics
5. Smart-Pointer Ownership
6. Destruction Order

### Common misconceptions

- Believing a pointer/reference extends object lifetime.
- Assuming any `const&` binding extends a temporary through function return.
- Assuming all container mutations invalidate all iterators, or none.
- Treating `std::move(x)` alone as a move/clear.
- Assuming a moved-from string/vector is empty.
- Dereferencing a moved-from `unique_ptr`.
- Confusing object lifetime with storage still containing old bits.
- Using initializer-list order instead of member declaration order for construction/destruction.

## 6.1 Subcategory: Scope and Dangling Handles

### Family `scope_lifetime_judgment`

**Learner task.** Decide whether a use through a pointer/reference occurs while its object is alive.

**Response mode.** Behavior judgment.

**Template.** Nested block or function-return skeleton with one handle and one requested use.

**Derivation.** Identify object's lifetime begin/end and handle creation/use. Dereference/access after lifetime end is UB; merely having an unused handle is not graded as dereference UB.

**Constraints and rejection.** One lifetime failure cause; no memory reuse, pointer arithmetic, invalid pointer-value comparison, or simultaneous compile error.

**Difficulty.** Level 1 pointer leaves block. Level 2 reference-return to local. Level 3 safe outer object referenced in inner block. Level 4 choose first invalid statement. Level 5 contrast handle existence with dereference.

**Feedback.** Draw lifetime interval and use point. Say the handle may still contain an address but the object is no longer alive.

**Examples.**

1. `int* p; { int x=4; p=&x; } int y=*p;` Answer `undefined behavior`. Level 1.
2. `int x=4; int* p=&x; { int y=*p; }` Answer `deterministic`; `x` remains alive. Level 2.
3. `const int& f(){ int x=7; return x; } int y=f();` Answer `undefined behavior` when initializing `y` through dangling reference. Level 3.

**Implementation and validation.** Proof-carrying lifetime skeletons. Deterministic cases compile/run; UB cases compile but never run. Compiler warnings are not the classification.

## 6.2 Subcategory: Temporary Lifetime

### Family `temporary_lifetime_judgment`

**Learner task.** Determine whether a temporary survives to a requested use and, for deterministic cases, its value.

**Response mode.** Behavior judgment plus optional value.

**Template.** Direct local reference binding, function return, or full-expression use.

**Derivation.** Apply C++17 temporary materialization/lifetime-extension rules for the exact binding context. Direct binding of a local reference variable to a temporary extends to reference lifetime; a temporary bound to a returned reference is destroyed at end of return full-expression.

**Constraints and rejection.** Whitelisted contexts only. Exclude reference members, `new` initializers, conditional expressions with mixed categories, and aggregate-parentheses version differences.

**Difficulty.** Level 2 direct `const&`. Level 3 local `T&&`. Level 4 return-reference non-extension. Level 5 identify end of full-expression.

**Feedback.** Name temporary creation, binding context, and destruction point.

**Examples.**

1. `const int& r=3+4; int y=r;` Answer `deterministic, y=7`; lifetime extends. Level 2.
2. `std::string&& r=std::string("hi"); std::cout<<r;` Answer `deterministic, "hi"`; local rvalue-reference binding extends lifetime. Level 3.
3. `const std::string& f(){ return std::string("hi"); } auto n=f().size();` Answer `undefined behavior`; returned reference dangles. Level 4.

**Implementation and validation.** Static family proofs; run safe cases only. Both compilers must accept well-formed snippets.

## 6.3 Subcategory: Iterator and Reference Invalidation

### Family `container_invalidation_judgment`

**Learner task.** Decide whether a stored iterator/reference remains valid after one standard-container operation.

**Response mode.** Behavior judgment; optional output for deterministic cases.

**Scope.** Whitelisted C++17 rules:

- `vector::erase` invalidates iterators/references at or after erase point;
- `vector::clear` invalidates all element handles;
- `list::erase` invalidates only handles to erased elements;
- non-erasing `list` insertion does not invalidate existing iterators.

Avoid `vector::push_back` unless reallocation/non-reallocation is guaranteed by explicit capacity proof.

**Derivation.** Locate handle position relative to affected element and apply container rule.

**Constraints and rejection.** Container remains alive; iterator is initially valid; no end-iterator dereference, concurrent mutation, or unspecified capacity assumption.

**Difficulty.** Level 2 handle to erased element. Level 3 vector before/after erase point. Level 4 contrast vector/list. Level 5 two handles, classify each separately.

**Feedback.** Mark invalidated range or element.

**Examples.**

1. `vector{1,2,3}; it=begin()+1; erase(begin()); int x=*it;` Answer `undefined behavior`; `it` was after erase point. Level 2.
2. `vector{1,2,3}; it=begin(); erase(begin()+1); int x=*it;` Answer `deterministic, x=1`; iterator before erase point remains valid. Level 3.
3. `list{1,2,3}; it=begin(); jt=next(it); erase(jt); int x=*it;` Answer `deterministic, x=1`. Level 4.

**Implementation and validation.** Generate only enumerated rules. Safe snippets compile/run; UB not run. Include correct headers/qualified names.

## 6.4 Subcategory: Move Semantics

### Family `move_cast_vs_consumption`

**Learner task.** Distinguish an xvalue cast/alias from an actual move construction or assignment.

**Response mode.** Output, alias relationship, or behavior judgment.

**Template.** `std::move` used either to bind `auto&&` or initialize another object.

**Derivation.** `std::move` performs a cast. `auto&& r=std::move(s)` makes `r` refer to `s`; no new object. A move constructor may modify source into a valid but type-specific/unspecified state.

**Constraints and rejection.** Never ask exact moved-from string/vector contents. It is safe to ask whether operations with documented preconditions (assignment, `clear`, destruction) are valid after move.

**Difficulty.** Level 2 alias-only move cast. Level 3 consumed unique owner in smart-pointer family. Level 4 moved-from valid/unspecified distinction. Level 5 compare `sink(s)` and `sink(std::move(s))`.

**Feedback.** Identify the consuming operation, if any, and distinguish valid from specified value.

**Examples.**

1. `std::string s="hi"; auto&& r=std::move(s); std::cout<<s<<" "<<r;` Answer `hi hi`; `r` aliases `s`. Level 2.
2. `std::string s="hi"; std::string t=std::move(s); auto n=s.size();` Question `What can be said about n?` Answer `unspecified`; the operation is well-defined and `n` is valid, but its value is not specified. Level 4.
3. Same move, then `s.clear(); s+="x"; std::cout<<s;` Answer `x`; moved-from string is valid and can be reassigned/cleared. Level 4.

**Implementation and validation.** Safe fixed-output snippets run; unspecified-content questions are judged semantically and never grade observed size. Coverage separates cast-only, consuming move, and post-move validity.

## 6.5 Subcategory: Smart-Pointer Ownership

### Family `unique_ptr_transfer`

**Learner task.** Trace ownership and null state across `unique_ptr` move/reset/release-free subset.

**Response mode.** Owner label, Boolean null fields, or deterministic output.

**Derivation.** Move transfers stored pointer and source becomes null. `reset()` destroys current object and may acquire supplied pointer. Copy is ill-formed.

**Constraints and rejection.** No raw `release()` initially, custom deleters, arrays, exceptions, or dereference of null. Object value stable.

**Difficulty.** Level 2 one move. Level 3 move assignment. Level 4 pass/return by value. Level 5 copy-attempt judgment versus move.

**Feedback.** Show owner timeline and destruction event.

**Examples.**

1. `auto p=std::make_unique<int>(7); auto q=std::move(p);` Answer `p null, q owns 7`. Level 2.
2. Same, `std::cout<<(p==nullptr)<<*q;` Answer `17` under default bool formatting. Level 2.
3. `auto p=std::make_unique<int>(7); auto q=p;` Answer `compile error`; copy constructor deleted. Level 4.

**Implementation and validation.** Compile/run safe outputs and compile-fail copies. Validate null/owner semantics independently.

### Family `shared_ptr_ownership`

**Learner task.** Track shared ownership count and object lifetime through copies and scopes.

**Response mode.** Integer count fields and alive/destroyed judgment.

**Derivation.** Copying a nonempty `shared_ptr` adds an owner; destruction/reset removes one; object is destroyed when last owner releases it. Non-owning raw pointer/reference does not affect count.

**Constraints and rejection.** No aliasing constructor, cycles, weak pointers, threads, custom deleters, or temporary-count sequencing inside one output expression. Query `use_count()` in separate full-expressions.

**Difficulty.** Level 2 one copy. Level 3 nested scope. Level 4 reset. Level 5 raw observer plus owner loss, without dereferencing after destruction.

**Feedback.** Show owner set, not just count arithmetic.

**Examples.**

1. `auto p=make_shared<int>(4); auto q=p;` Answer `use_count=2`. Level 2.
2. `auto p=make_shared<int>(4); {auto q=p;} auto n=p.use_count();` Answer `n=1`. Level 3.
3. `auto p=make_shared<int>(4); auto q=p; p.reset();` Answer `q.use_count()=1; object alive`. Level 4.

**Implementation and validation.** Avoid querying count amid unspecified argument evaluation. Compile/run and compare counts.

## 6.6 Subcategory: Destruction Order

### Family `destruction_order`

**Learner task.** Determine deterministic destruction order for automatic objects, members, and bases.

**Response mode.** Ordered sequence of labels.

**Derivation.** Automatic locals destroy in reverse completion of construction. Complete object destroys destructor body, then members in reverse declaration order, then direct bases in reverse base-specifier order.

**Constraints and rejection.** No exceptions, temporaries with subtle full-expression timing, statics, virtual bases, or optimization-sensitive output. Each destructor appends a unique label.

**Difficulty.** Level 2 locals. Level 3 nested scopes. Level 4 members (declaration order). Level 5 one base plus members.

**Feedback.** Show construction stack then pop order; note initializer-list order does not control member order.

**Examples.**

1. `Trace a("A"); Trace b("B");` at scope exit Answer `B A`. Level 2.
2. `{Trace a("A"); {Trace b("B");} Trace c("C");}` Answer `B C A`. Level 3.
3. `struct S{Trace first{"F"}; Trace second{"S"};};` when `S` dies Answer `S F`; members are destroyed in reverse declaration order. Level 4.

**Implementation and validation.** Generated trace type and full program compile/run. Expected sequence includes only explicitly logged events; coverage crosses scope/member/base.

### Cross-family progression for Lifetime and Ownership

Scope lifetime precedes temporary extension. Iterator invalidation is taught per container/rule, not as generic folklore. `std::move` cast-only examples precede smart-pointer consumption. Unique ownership precedes shared counts. Destruction order follows scope lifetime. If a learner asks “what output does UB produce,” feedback must refuse the premise and return to classification.

## 7. Category: Declarations and Callables

### Category purpose

Train reading dense declarators from the identifier outward and executing simple callable objects after their binding/capture semantics are resolved.

### Learn

Parentheses change which operator binds to the identifier:

```cpp
int* a[4];    // a: array of 4 pointers to int
int (*b)[4];  // b: pointer to array of 4 int
```

Use aliases to expose layers. A pointer-to-member is applied with `.*` to an object or `->*` to a pointer. Lambdas capture by value or reference; `mutable` permits changing the lambda's stored value copy, not the original.

### Prerequisites

Types, references, overload resolution, and object lifetime.

### Category boundaries

No most-vexing-parse puzzles, complex function-returning-function-pointer syntax, macros, `noexcept` type conversions, variadic functions, or ABI/calling-convention syntax.

### Subcategories

1. Arrays and Pointers
2. Aliases and Function Pointers
3. Pointers to Members
4. Lambda Capture
5. Callable Composition

### Common misconceptions

- Reading declarations only left-to-right.
- Missing parentheses around a pointer to array/function.
- Believing a `using` alias textually substitutes without declarator binding.
- Calling a member pointer like an ordinary pointer.
- Treating value capture as a live alias.
- Believing `mutable` changes the external captured object.
- Assuming reference capture extends lifetime.

## 7.1 Subcategory: Arrays and Pointers

### Family `declarator_array_pointer`

**Learner task.** Match names to array/pointer declarator meanings.

**Response mode.** Matching or single-choice.

**Template.** Two to four declarations differing by parentheses.

**Derivation.** Start at identifier; postfix `[]`/`()` binds before prefix `*` absent parentheses. Move outward, then read base type.

**Constraints and rejection.** One pointer level initially; fixed positive extents; no function-returning-array impossibility mixed in unless judgment target.

**Difficulty.** Level 1 array of pointers versus pointer to array. Level 2 pointer to function versus function returning pointer. Level 3 const-pointer layers. Level 4 matching several. Level 5 convert to an equivalent `using` form.

**Feedback.** Draw binding parentheses and read from identifier outward.

**Examples.**

1. `int* a[4]; int (*b)[4];` Answer `a=array of 4 pointers; b=pointer to array of 4 int`. Level 1.
2. `int* f(int); int (*p)(int);` Answer `f=function returning int*; p=pointer to function returning int`. Level 2.
3. `const int* a[3];` Answer `array of 3 pointers to const int`. Level 3.

**Implementation and validation.** Represent declarators as syntax trees and render/parse round-trip. Compile with `static_assert` type traits where expressible.

## 7.2 Subcategory: Aliases and Function Pointers

### Family `type_alias_expansion`

**Learner task.** Determine the type of a declaration using `using` aliases.

**Response mode.** Canonical type or matching.

**Template.** One/two alias definitions and a declaration.

**Derivation.** Resolve alias as a complete type, then apply outer declarator; do not perform unsafe textual substitution.

**Constraints and rejection.** Acyclic aliases, at most two layers, no templates initially.

**Difficulty.** Level 2 scalar pointer aliases. Level 3 array/function aliases. Level 4 const applied to pointer alias. Level 5 nested callable alias.

**Feedback.** Expand one alias layer at a time and identify which entity const qualifies.

**Examples.**

1. `using P=int*; P p;` Answer `p is int*`. Level 2.
2. `using P=int*; const P p=nullptr;` Answer `p is int* const`, not `const int*`. Level 4.
3. `using Row=int[4]; Row* p;` Answer `p is pointer to array of 4 int`. Level 3.

**Implementation and validation.** `static_assert(std::is_same_v<decltype(name),Expected>)`; aliases generated from type AST.

### Family `function_pointer_binding`

**Learner task.** Use a function-pointer target type to select an overload and predict a simple call.

**Response mode.** Selected overload label and/or output.

**Template.** Two overloads, a `using Fn=R(*)(Args...)`, `Fn p=name;`, and call.

**Derivation.** Target function-pointer type supplies overload-resolution context; only matching function type is selected, then ordinary indirect call.

**Constraints and rejection.** Exact matching overload exists uniquely. No default arguments, noexcept distinction, templates, or casts.

**Difficulty.** Level 2 one function. Level 3 overloaded name resolved by target. Level 4 const/reference parameter function type. Level 5 pass pointer as callback.

**Feedback.** Match full return/parameter type before executing body.

**Examples.**

1. `int inc(int x){return x+1;} using F=int(*)(int); F p=inc; p(4);` Answer `5`. Level 2.
2. `int f(int); double f(double); using F=int(*)(int); F p=f;` Answer selects `int f(int)`. Level 3.
3. `int f(int x){return x+1;} double f(double x){return x/2;} using F=double(*)(double); F p=f; p(8.0);` Answer `4.0`. Level 3.

**Implementation and validation.** Compile/run markers/output and `static_assert` pointer type. Balance selected overload.

## 7.3 Subcategory: Pointers to Members

### Family `data_member_pointer`

**Learner task.** Apply a pointer-to-data-member to an object or object pointer.

**Response mode.** Output/value.

**Template.** Simple standard-layout-like struct with two int members, `int S::* pm=&S::member`, then `obj.*pm` or `ptr->*pm`.

**Derivation.** Member pointer identifies a member relative to an object; application selects that member, then normal read/write occurs.

**Constraints and rejection.** Single nonstatic public data member, no inheritance, null member pointer, bit-field, or layout arithmetic.

**Difficulty.** Level 2 read via `.*`. Level 3 write. Level 4 `->*`. Level 5 select member pointer at runtime with deterministic branch.

**Feedback.** Separate member selection from object selection.

**Examples.**

1. `struct S{int x=4; int y=7;}; S s; int S::*p=&S::x; s.*p` Answer `4`. Level 2.
2. Same with `s.*p+=3` Answer `s.x=7,s.y=7`. Level 3.
3. `S s; S* q=&s; int S::*p=&S::y; q->*p` Answer `7`. Level 4.

**Implementation and validation.** Compile/run and compare named fields. No raw representation assumptions.

### Family `member_function_pointer`

**Learner task.** Decode and invoke a pointer to a member function with matching cv qualification.

**Response mode.** Output/value or compile-error judgment.

**Template.** Struct with one/two methods and declaration `R (S::*pm)(Args...) cv = &S::method;`.

**Derivation.** Match complete member-function type, then invoke `(obj.*pm)(args)` or `(ptr->*pm)(args)`. A `const` member function pointer can invoke on const/nonconst object; nonconst cannot invoke on const object.

**Constraints and rejection.** No ref qualifiers, virtual dispatch, overload ambiguity without target context, or noexcept.

**Difficulty.** Level 3 direct call. Level 4 const qualification. Level 5 overloaded method resolved by target type.

**Feedback.** Parse pointer type, object cv, then call syntax.

**Examples.**

1. `struct S{int twice(int x)const{return 2*x;}}; int(S::*p)(int)const=&S::twice; S s; (s.*p)(4);` Answer `8`. Level 3.
2. Same through `S* q=&s; (q->*p)(5);` Answer `10`. Level 4.
3. Nonconst `int(S::*p)()` invoked on `const S s` Answer `compile error`. Level 4.

**Implementation and validation.** Compile/run safe calls and compile-fail cv mismatch. Generate exact target signature.

## 7.4 Subcategory: Lambda Capture

### Family `lambda_capture_trace`

**Learner task.** Predict external and closure-stored state after value/reference captures and calls.

**Response mode.** Output or named external/call-result fields.

**Template.** One/two local integers, lambda with explicit capture list, optional `mutable`, then sequenced calls.

**Derivation.** Value capture initializes closure member at lambda creation; reference capture aliases external object. Non-mutable value captures are read-only inside default `const` call operator; `mutable` allows modifying closure copy.

**Constraints and rejection.** Captured references remain live. No default capture with hidden names, `this`, init-capture ownership, generic parameters, or unspecified evaluation order among calls.

**Difficulty.** Level 2 read value/reference. Level 3 external changes after capture. Level 4 mutable repeated calls. Level 5 mixed value/reference captures.

**Feedback.** Draw external objects and closure members separately.

**Examples.**

1. `int x=1; auto f=[x]{return x;}; x=5; f();` Answer `1`. Level 2.
2. `int x=1; auto f=[&x]{return ++x;}; int r=f();` Answer `x=2,r=2`. Level 3.
3. `int x=1; auto f=[x]()mutable{return ++x;}; x=7; int a=f(); int b=f();` Answer `x=7,a=2,b=3`. Level 4.

**Implementation and validation.** Closure-state evaluator plus compile/run. Never combine two mutating lambda calls as unsequenced function arguments.

## 7.5 Subcategory: Callable Composition

### Family `callable_selection_and_invoke`

**Learner task.** Trace a simple callable passed to a higher-order function or selected conditionally.

**Response mode.** Output/value.

**Template.** A non-generic lambda or function pointer and a one-call helper template `apply(F f,int x){return f(x);}`.

**Derivation.** Resolve callable binding/capture, deduce/copy parameter as specified, invoke once, then compute body.

**Constraints and rejection.** No dangling reference capture, overloaded `operator()`, `std::bind`, type erasure allocation, recursion, or multiple evaluation.

**Difficulty.** Level 3 function pointer callback. Level 4 value-capturing lambda. Level 5 helper takes `F&` versus `F` and a mutable closure, with calls in separate statements.

**Feedback.** Separate callable object copy/alias from invocation.

**Examples.**

1. `int apply(int(*f)(int),int x){return f(x);} int inc(int x){return x+1;} apply(inc,4);` Answer `5`. Level 3.
2. `int k=3; auto f=[k](int x){return x+k;}; apply(f,5);` Answer `8`. Level 4.
3. `auto f=[n=0](int x)mutable{return x+(++n);}; int a=apply(f,10); int b=apply(f,10);` where `apply` takes callable **by value** Answer `a=11,b=11`; each call copies original `f`. Level 5.

**Implementation and validation.** Render full helper signature prominently. Compile/run; coverage contrasts callable by value/reference only after capture mastery.

### Cross-family progression for Declarations and Callables

Array/pointer binding precedes aliases. Function pointers precede member pointers. Lambda capture precedes higher-order copying. Dense syntax is introduced one binding layer at a time; difficulty may not be created by adding irrelevant parentheses or identifiers.

## 8. Topic-level progression

Recommended order:

1. straight-line state, references, and basic `auto`;
2. prefix/postfix in sequenced statements, pointer reseating, branches;
3. short-circuiting, parameter modes, promotions, and non-template overloads;
4. loops, alias topology, reference overloads, `decltype`, and basic lifetime;
5. template deduction, forwarding references, initialization judgment;
6. container invalidation, `std::move`, unique ownership;
7. template ordering, shared ownership, destruction order;
8. member pointers, mutable lambdas, and higher-order callables;
9. behavior classes beyond deterministic/UB.

Useful interleavings after acquisition:

- reference alias trace with `auto&` deduction;
- value category with reference overload resolution;
- forwarding deduction with perfect forwarding;
- pointer reseating with pointer-parameter mode;
- `std::move` expression category with move consumption;
- callable declaration with overload target context.

Keep undefined/unspecified classification separate from ordinary output until the learner understands that non-deterministic code has no single standard output.

## 9. Adaptive practice guidance

### Mastery dimensions

Track:

- family and semantic rule;
- behavior class;
- answer component (state, type, value category, candidate, lifetime, owner);
- cv/ref pattern;
- argument value category;
- parameter-passing mode;
- alias topology;
- control-transfer kind;
- container/operation invalidation rule;
- declaration binding layer;
- misconception.

Category/level aggregates are display summaries only.

### Partial evidence

Multi-field answers update fields independently. Correct value with wrong type targets promotion/deduction, not arithmetic. Correct final objects with wrong pointer target indicates topology weakness. Correct selected overload with wrong `T` indicates memorized outcome rather than deduction and should schedule deduction diagnostics.

### Failure-driven routing

| Observed answer | Likely misconception | Next selection |
|---|---|---|
| Prefix/postfix yielded/stored values swapped | increment timing | paired one-statement trace |
| Right side effect applied despite short circuit | both operands assumed evaluated | explicit evaluated/skipped fields |
| Exact output supplied for unspecified item | compiler-run model | behavior-class contrast |
| Reference assignment treated as rebinding | references reseat | binding-arrow trace |
| Caller pointer treated as reseated by `int*` parameter | pointer parameter not recognized as copy | paired `int*`/`int*&` |
| Plain `auto` retains top-level const | deduction adjustment | plain auto vs auto& pair |
| `auto&&` always answered rvalue reference | reference collapsing | lvalue/prvalue matched calls |
| `decltype(x)` equals `decltype((x))` | entity exception missed | parenthesized pair |
| `uint8_t+1` wraps | promotion missed | type-and-value promotion |
| Brace narrowing marked warning/defined | initialization form | isolated `=`, `()`, `{}` matching |
| Non-template always selected | tie-break applied too early | exact template vs converting non-template |
| Forwarded rvalue selects lvalue sink | named parameter not re-forwarded | `x` versus `forward<T>(x)` |
| Pointer/reference used after scope | handle thought to own | lifetime timeline |
| Moved-from string assumed empty | unspecified state | valid-operation judgment |
| Unique pointer source still owns | copy model | owner timeline |
| Vector iterator before erase marked invalid | “all mutation invalidates all” | before/at/after matching |
| `const P` treated as pointer-to-const | alias textual substitution | alias expansion |
| Mutable value capture changes external | closure copy confused with alias | closure/external fields |

If an answer is wrong because of arithmetic inside a trace, simplify values while preserving semantic structure. If the semantic transition is wrong, keep code length fixed and isolate that transition.

### Scheduling

Recommended mix:

- 45% weakest due semantic rule;
- 25% spaced mastered rules;
- 20% misconception contrasts/prerequisites;
- 10% controlled combination.

At least 80% of ordinary practice should be well-formed and well-defined. Judgment practice should balance its declared classes, but UB must not dominate. Long loop tracing should be rare after control-flow mastery; advanced practice should shift toward type/alias/lifetime reasoning.

## 10. Feedback requirements

Every instance stores:

- canonical answer and behavior class;
- proof/trace steps;
- likely-wrong-answer mappings;
- exact standard rule in concise learner language;
- validation evidence type (compile, run, static assertion, semantic-only).

Feedback must:

- distinguish compilation from runtime;
- refuse to provide an output for UB;
- list allowed outcomes rather than one observed output for unspecified cases when useful;
- state the implementation choice needed for implementation-defined cases;
- identify expression value category before overload selection;
- show object identity/lifetime separately from value;
- keep arithmetic incidental.

Do not cite compiler agreement as the reason a rule is true.

## 11. Implementation requirements

### Semantic skeletons

Use reviewed skeletons with explicit proof obligations. Free-form random token/code generation is prohibited. Parameters may vary identifiers, small values, branch outcomes, cv/ref forms, candidate ordering, and selected members only where the skeleton remains proved.

### Complete translation units

Each instance can render:

- learner view: minimal relevant declarations/statements;
- validation view: complete includes, marker bodies, `main`, stable output separators, and static assertions.

The learner view must not omit a declaration, include, namespace qualification, or enclosing scope that changes semantics. A visible note may replace repetitive fixed preamble only when exact.

### Type representation

Represent types structurally: base, cv qualifiers per level, pointer/reference/array/function/member layers. Render canonical text from structure. Do not parse compiler-specific pretty-function strings as the oracle.

### Runtime safety

Only `deterministic` snippets may execute in automated tests. The runner must use time/resource limits. UB, unspecified-output, and implementation-defined-output snippets compile only as appropriate. Compile-error validation occurs in isolated files.

### Stable standard

Every question metadata and exported progress includes `cppStandard: "c++17"`. Changing the standard requires new family versions or migration; it must not silently change answers to existing seeds.

## 12. Automated validation

### Per-instance checks

1. All placeholders and stable candidate labels are substituted.
2. Learner and validation views share the same semantic AST.
3. Behavior class matches family skeleton.
4. Deterministic answer recomputes from independent interpreter/rules.
5. Required headers and complete scaffold compile under strict C++17.
6. Deterministic safe execution matches on GCC and Clang.
7. Compile-error instances fail both compilers for intended construct.
8. UB instances are never executed.
9. Type answers match generated `static_assert`.
10. Choices are distinct with one correct answer.
11. No requested result depends on excluded implementation properties.
12. Feedback mentions actual identifiers/types/values.

### Exhaustive/property tests

- Exhaust small values for every runtime/alias skeleton.
- Exhaust truth combinations for short-circuit skeletons.
- Prove loop termination and test every generated branch path.
- Enumerate cv/ref/value-category matrices for `auto`, deduction, overloads, and forwarding.
- Static-assert every generated type/declarator equivalence.
- Compile every narrowing and ambiguity skeleton with both compilers.
- Test container invalidation skeletons only according to selected operation/position.
- Round-trip owner-state models through move/copy/reset actions.
- Compare destruction trace to generated construction graph.
- Property-test at least 10,000 seeds per family/level, with compilation samples for every structural signature and full compilation in CI where affordable.

### Sanitizers and diagnostics

ASan/UBSan may run on deterministic snippets as a regression net. They must not run intentionally UB snippets as an answer oracle. Diagnostic text may be logged, but tests assert success/failure, not vendor phrasing.

### Distribution tests

Verify:

- behavior classes meet configured quotas;
- prefix/postfix and short-circuit paths balance;
- loop iteration/control-transfer patterns vary;
- alias target and parameter mode vary;
- cv/ref/value-category matrices receive coverage;
- overload winner labels and ranking reasons balance;
- deterministic lifetime cases are not drowned out by dangling cases;
- vector/list invalidation rules both recur;
- capture modes and callable copy/reference modes vary;
- superficial identifier/constant variation does not satisfy structural diversity.

## 13. Coverage requirements

Across long-run practice:

- runtime questions remain short and semantically purposeful;
- every surprising output is guaranteed by ISO C++17 and stated assumptions;
- undefined, unspecified, implementation-defined, and ill-formed are never conflated;
- references, pointers, pointer parameters, and pointer references are separately mastered;
- type exercises cover qualifier/reference preservation and loss;
- overload exercises expose the full candidate pipeline in increasing depth;
- lifetime exercises include safe and unsafe contrasts;
- moved-from unspecified contents are never assigned a fixed answer;
- declarations progress by binding layers, not visual intimidation;
- compiler validation covers all safe/code-form families on GCC and Clang;
- adaptive selection operates at semantic-rule/misconception level.

## 14. Topic-level quality checklist

- [ ] ISO C++17 is visible and stored in every instance.
- [ ] Runtime-output snippets are deterministic, well-formed, and well-defined.
- [ ] No answer depends on compiler extensions, ABI, integer width, char signedness, capacity growth, addresses, or moved-from contents.
- [ ] Behavior judgments distinguish five canonical classes.
- [ ] UB snippets are never executed for validation.
- [ ] Compile-error snippets isolate one diagnostic rule.
- [ ] Every generated loop has a proven small termination bound.
- [ ] Alias feedback distinguishes bindings/targets from values.
- [ ] Type answers are structurally represented and statically asserted.
- [ ] Braced narrowing is tested in an isolated declaration.
- [ ] Overload families establish viability before ranking/tie-breaking.
- [ ] Forwarding questions show both deduced `T` and collapsed parameter type.
- [ ] Container invalidation uses a whitelisted standard rule.
- [ ] `std::move` is never described as moving by itself.
- [ ] Moved-from valid-but-unspecified state is represented correctly.
- [ ] Member construction/destruction follows declaration order.
- [ ] Every family has three valid examples, rejection rules, feedback, and automated validation.
- [ ] Randomized constants/names do not masquerade as pedagogical variety.
- [ ] Repeated practice improves code-reading judgment rather than compiler-trivia recall.

## 15. Stable identifiers and recommended navigation

The UI may retain the current six category labels:

- Runtime State & Control
- Aliasing & Parameters
- Types & Conversions
- Overloads & Templates
- Lifetime & Ownership
- Declarations & Callables

Stable family identifiers are the backticked names in this specification. Existing category/level history can remain visible, but new mastery records must use family, semantic rule, behavior class, and misconception dimensions.
