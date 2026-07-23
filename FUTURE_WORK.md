# Future Work

This repo can hold multiple small, offline, single-HTML practice apps. The current app is focused on programmer low-level numeracy: bits, bases, fixed-width integers, masks, shifts, rotations, and endian memory order.

The strength of this app style is dynamic generated practice: the app can create fresh values, check exact answers, adapt difficulty, and track category-level progress. Static Q-and-A material is usually better in a flashcard system such as Anki unless the app adds generation, interaction, simulation, or immediate structured checking.

## Current App: Programmer Low-Level Numeracy

Low-hanging improvements:

- Add more programmer-relevant decimal drills:
  - Multiples of 8, 16, 32, 64, 256, 1024.
  - Hex-friendly decimal anchors, such as 15, 16, 31, 32, 63, 64, 127, 128, 255, 256.
  - Address and offset arithmetic, such as `base + offset`, alignment padding, and page/word boundaries.
  - Modulo and remainder practice for powers of two.
  - Signed and unsigned range calculations from bit width.
- Add more answer-shape helpers:
  - Optional separate fields for result and overflow/carry status.
  - Category-aware keypad presets.
  - A setting to hide/show keypad hint dimming.
- Add more bit-manipulation patterns:
  - Extract bit field.
  - Insert bit field.
  - Align up/down to a power-of-two boundary.
  - Count set bits for small widths.
  - Recognize one-hot masks and contiguous masks.
- Add optional code-context prompts:
  - Show tiny C-like snippets that exercise the same numeracy, such as casts, masks, shifts, assertions, and endian byte views.
  - Keep these as a context layer rather than replacing the direct mathy drills.
  - Avoid full C/C++ language traps unless a prompt explicitly says it is about language semantics.
- Add rotate-through-carry as an advanced shift/rotate topic.

Probably avoid for this app:

- Broad decimal mental arithmetic as a main category. It is useful, but it changes the identity of this app from low-level programmer numeracy to general number training.
- Static explanation-heavy material beyond concise Learn cards. Long explanations belong in notes or docs; static recall belongs in flashcards.

## Sister App: Floating Point Practice

Floating point is a strong fit for generated practice because the rules are precise, surprising, and scalable. Tiny custom formats can make the mechanism visible before moving up to real-world formats such as C++ `float`.

This could either be a sister app or an advanced extension of the low-level numeracy app. It should probably be separate if it grows into IEEE 754 behavior, C++ snippets, rounding, and numerical pitfalls.

Possible formats:

- FP4:
  - Very small toy format for first exposure.
  - Sign bit, tiny exponent, tiny fraction.
  - Enough to show sign, exponent bias, significand, zero, overflow, and rounding.
- FP6 and FP8:
  - More values, but still small enough to enumerate visually.
  - Good for conversion tables, adjacent values, and spacing/ULP questions.
- FP16 and bfloat16:
  - Real practical formats.
  - Good for machine-learning and graphics-adjacent intuition.
- FP32:
  - C++ `float`.
  - Sign/exponent/fraction bits, decimal approximations, special values, and common bugs.
- FP64:
  - C++ `double`.
  - Same concepts at a larger scale, with more emphasis on precision and error.

Possible categories:

- Bit layout:
  - Split a bit pattern into sign, exponent, and fraction fields.
  - Decode exponent bias.
  - Identify normal, subnormal, zero, infinity, or NaN.
  - Convert between bit pattern, hex, and value for small formats.
- Value conversion:
  - Encode a small decimal or rational value into FP4/FP6/FP8.
  - Decode a toy floating-point value into exact rational form.
  - Give the nearest representable value.
  - Identify the next larger or next smaller representable value.
- Rounding:
  - Round to nearest, ties to even.
  - Round toward zero, `+inf`, or `-inf` later.
  - Identify whether a value rounds up, down, or exactly.
  - Show guard/round/sticky-bit style questions at higher levels.
- Spacing and precision:
  - ULP size at a given magnitude.
  - Machine epsilon.
  - Why large numbers have bigger gaps.
  - Which integers are exactly representable.
- Arithmetic:
  - Addition and subtraction in small formats.
  - Multiplication by powers of two.
  - Overflow to infinity.
  - Underflow to subnormal or zero.
  - Loss of low bits when adding numbers with very different magnitudes.
- Numerical behavior:
  - Non-associativity: `(a + b) + c` vs `a + (b + c)`.
  - Cancellation.
  - Comparing floats.
  - Why `0.1 + 0.2` surprises people.
  - Choosing tolerances for approximate equality.
- C++ `float` context:
  - Interpret `float` bit patterns such as `0x3f800000`.
  - Predict whether a value is exactly representable.
  - Classify `NaN`, `inf`, `-0.0`, normal, and subnormal values.
  - Tiny snippets involving `float`, `double`, casts, comparisons, and literals.

Good dynamic fits:

- Render a toy floating-point layout and ask what each field means.
- Generate all values in FP4 or FP6 and ask for ordering, nearest value, or spacing.
- Show a C++ `float` hex pattern and ask for sign/exponent/category/value.
- Ask which of several decimal values are exactly representable.
- Ask whether an operation produces exact result, rounded result, overflow, underflow, infinity, or NaN.

Low-hanging fruit:

- FP4/FP6 bit decoding.
- Toy-format conversion to exact rational values.
- Normal vs subnormal vs zero vs infinity vs NaN classification.
- Exponent bias practice.
- Powers of two and exact representability.
- FP32 sign/exponent/fraction field interpretation.

Needs careful limits:

- Use exact integer/rational arithmetic internally for toy formats instead of relying on JavaScript `Number` behavior.
- Be explicit about the chosen format: exponent bits, fraction bits, bias, subnormal support, infinities/NaNs, and rounding mode.
- Keep decimal formatting controlled; many answers should be exact fractions or structured fields rather than long decimal strings.
- IEEE 754 has many edge cases, so real `float`/`double` questions should start with classification and representation before full arithmetic.
- C++ adds its own wrinkles: literal types, promotions, casts, library formatting, floating-point environment, and compiler optimizations.

Recommendation:

- Start with FP4 and FP6 as transparent teaching formats.
- Add a visual bit-field renderer early.
- Build exact encode/decode helpers first, then add rounding and arithmetic.
- Treat C++ `float` as a later bridge from the toy formats to practical programming questions.

## Sister App: C++ Mental Execution

C++ is a strong fit for dynamic practice, but the best shape is not "write a whole program." It is small mental execution puzzles: given a short snippet, predict final values, output, types, overloads, aliases, ownership, or whether the snippet is valid.

This would complement the low-level numeracy app nicely. Some bitwise snippets could be shared in spirit, but a C++ app should make language rules the main object of practice.

Possible categories:

- State tracing:
  - Final values after assignment, arithmetic, prefix/postfix `++` and `--`, compound assignment, integer division, modulo, and operator precedence.
  - Predict `std::cout` output for short snippets.
  - Avoid undefined behavior in normal compute-the-result questions.
- Bitwise C++:
  - `&`, `|`, `^`, `~`, `<<`, `>>`.
  - Set, clear, toggle, and test flags.
  - Choose the correct line to manipulate a mask without changing other bits.
  - Use fixed-width types such as `uint8_t`, `int8_t`, `uint16_t`, and `uint32_t`.
- Pointers and references:
  - Track what pointer points to.
  - Track which variable a reference aliases.
  - Predict final values after dereference assignment.
  - Distinguish assigning through a reference from reseating a reference.
- Scope, lifetime, and shadowing:
  - Nested blocks.
  - Local variables and shadowing.
  - `static` local variables.
  - Which variables exist at a given point.
- Functions:
  - Pass by value, reference, pointer, and `const&`.
  - Return values.
  - Choose the function signature needed to mutate a caller's variable.
- Types and deduction:
  - `auto`, `auto&`, `const auto&`.
  - `const`, references, and value copying.
  - Small, rule-based type inference questions.
- Overload resolution:
  - Start with simple overloads such as `int`, `double`, `float`, `const int&`, and `int&`.
  - Add rvalue references and templates only after the basics.
- Arrays, pointer arithmetic, and indexing:
  - Array contents after pointer movement and mutation.
  - Relationship between arrays, pointers, indexing, and memory.
- Structs and objects:
  - Value semantics and member access.
  - Difference between copying an object and binding a reference.
- Constructors, copies, and destructors:
  - Trace constructor/destructor print order for carefully chosen snippets.
  - Be explicit about the C++ standard and avoid copy-elision-dependent examples in early levels.
- Ownership and RAII:
  - `unique_ptr` ownership after `std::move`.
  - `shared_ptr` reference counts after copy/reset.
  - Moved-from states and ownership reasoning.
- Containers and strings:
  - `vector` contents after `push_back`, assignment, `erase`, and `insert`.
  - `map` or `unordered_map` lookup/update basics.
  - `std::string` `erase`, `insert`, `substr`, `find`, and `replace`.
- Control flow:
  - Loops with small bounds.
  - `if`, `break`, `continue`, and modulo conditions.
  - Nested loops at higher levels.
- Correctness classification:
  - Compiles or not?
  - Well-defined, undefined behavior, implementation-defined, unspecified, or logical bug?
  - Use this for uninitialized variables, null or dangling pointers, out-of-bounds access, signed overflow, invalidated iterators, and suspicious use-after-move cases.

Good dynamic fits:

- Show a snippet and ask for final variable values.
- Show a snippet and ask what is printed.
- Show code plus a simple memory diagram and ask what points to what.
- Ask which overload is called.
- Ask which type is deduced.
- Ask which line of code achieves a goal, such as setting bit 3.
- Use multiple-choice for compile/UB/type questions where typed answers would be awkward.

Low-hanging fruit:

- Trace expression/state questions with integers only.
- Bitwise C++ questions using fixed-width unsigned types.
- Pointer/reference aliasing with two or three variables.
- Pass by value/reference/pointer.
- Compile error vs valid for `const` and reference binding.

Needs careful limits:

- Do not attempt a general C++ parser or arbitrary C++ execution engine.
- Use strict templates where the generator controls the grammar and the answer.
- Be explicit about assumptions such as C++17/C++20, fixed-width types, arithmetic right shift, and integer size.
- Avoid undefined behavior in ordinary value-tracing questions; make UB its own category.
- Template deduction, overload resolution, copy elision, iterator invalidation, and move semantics are valuable but should be scoped tightly.

Recommendation:

- Start with a "Trace C++ State" app: small snippets, final values, output, pointers/references, function calls, and bitwise operations.
- Build generators like `generatePointerQuestion()`, `generateBitmaskQuestion()`, `generatePassByReferenceQuestion()`, and `generateAutoDeductionQuestion()` rather than a general compiler.
- Reuse the single-file app pattern: progress by category/level, concise Learn cards, adaptive practice, typed answers where natural, and multiple-choice where language classification is cleaner.

## Sister App: Mental Arithmetic

A separate single-file app could focus on integer head arithmetic while reusing the same pattern: generated questions, exact checking, adaptive category-level progress, and a mobile keypad.

Possible categories:

- Addition and subtraction:
  - Two-digit, three-digit, and mixed-size integer arithmetic.
  - Carry/borrow-heavy variants.
  - Negative integer variants.
- Multiplication:
  - Single-digit times multi-digit.
  - Multiplication by 11, 12, 15, 25, 50, 75, 125.
  - Powers-of-two and powers-of-ten scaling.
- Division and remainders:
  - Exact division.
  - Quotient and remainder.
  - Divisibility tests.
- Modular arithmetic:
  - Modulo small integers.
  - Modulo powers of two.
  - Clock arithmetic.
- Estimation:
  - Approximate product or quotient.
  - Bounds and sanity checks.
- Programmer-adjacent arithmetic:
  - Byte/KiB/MiB/GiB conversions.
  - Address offsets.
  - Alignment padding.
  - Percent and ratio calculations useful for performance work.

Low-hanging fruit:

- Exact integer answers are easy to generate and check.
- Difficulty can scale by operand size, number of operations, carries/borrows, signs, and time pressure.
- The keypad already fits this app well.

Avoid or postpone:

- Free-form multi-step explanations.
- Floating-point mental arithmetic unless the answer tolerance and rounding rules are very clear.

## Sister App: Theoretical CS and Algorithms

This app would cover more abstract computer science topics, but should lean into dynamic questions rather than static definitions.

Possible categories:

- Big-O classification:
  - Compare growth rates.
  - Simplify expressions such as `O(3n^2 + n log n + 40)`.
  - Identify dominant term.
- Recurrences:
  - Simple Master Theorem cases.
  - Expand small recurrences for concrete `n`.
- Data structure operation costs:
  - Arrays, linked lists, hash tables, heaps, trees.
  - Best/average/worst-case distinctions.
- Graph algorithms:
  - Trace BFS/DFS order on generated small graphs.
  - Dijkstra on small weighted graphs.
  - Topological sort on small DAGs.
- Logic and discrete math:
  - Truth tables.
  - De Morgan transformations.
  - Small counting/probability questions.

Good dynamic fits:

- Generated graphs, tables, traces, and symbolic expressions.
- Exact answers such as orderings, simplified complexity classes, or selected choices.

Better as flashcards:

- Static definitions.
- Named theorem recall.
- Vocabulary-only prompts.

Harder parts:

- Checking free-form proofs.
- Judging ambiguous asymptotic reasoning.
- Rendering and interacting with graphs in a single file without making the UI too heavy.

## Sister App: Shell, Regex, and Admin Practice

This is a strong fit for generated interactive drills because concrete commands and patterns can be checked against generated examples.

Possible categories:

- Shell basics:
  - Path navigation.
  - Globs.
  - Quoting.
  - Pipes and redirection.
  - Exit status and boolean command chaining.
- Text tools:
  - `grep`, `sed`, `awk`, `cut`, `sort`, `uniq`, `wc`, `find`, `xargs`.
  - Choose the command output for a generated input file.
  - Fill in one missing option or argument.
- Regex:
  - Match or reject generated strings.
  - Write a pattern for a described language.
  - Identify capture groups.
  - Replace with backreferences.
- Files and permissions:
  - `chmod` symbolic and octal modes.
  - Ownership and permission interpretation.
  - Relative paths and symlink behavior.
- Networking/admin basics:
  - Ports and URLs.
  - HTTP status codes if kept dynamic.
  - CIDR/subnet arithmetic as a possible separate category.

Low-hanging fruit:

- Regex matching can be generated and checked locally.
- Permission bits fit naturally with the existing bit practice.
- Shell command output can be simulated for small toy files.

Harder parts:

- A faithful shell is too large to reimplement.
- Real command execution in-browser is not available offline.
- Need to avoid teaching brittle one-liners without context.

## Sister App: Assembly Practice

This is high-value and likely worth its own app. It can start with simple generated questions and later grow into lightweight simulation.

### 6502

Why it is attractive:

- Small, elegant ISA.
- Few registers.
- Addressing modes are teachable and drillable.
- Cycle counts and flags are manageable.

Possible categories:

- Registers and flags:
  - A, X, Y, SP, PC, N, V, B, D, I, Z, C.
  - Given an operation, identify affected flags.
- Addressing modes:
  - Immediate, zero page, absolute, indexed, indirect, indexed indirect, indirect indexed.
  - Given syntax, name the addressing mode.
  - Given registers/memory, compute effective address.
- Instruction effects:
  - `LDA`, `STA`, `ADC`, `SBC`, `AND`, `ORA`, `EOR`, `ASL`, `LSR`, `ROL`, `ROR`, `INC`, `DEC`, branches.
  - Predict resulting register/flag values for one instruction.
- Branches:
  - Signed relative offsets.
  - Branch taken/not taken from flags.
- Stack:
  - `PHA`, `PLA`, `JSR`, `RTS`, interrupts later.

Low-hanging fruit:

- Syntax recognition.
- Addressing mode drills.
- Effective address calculation.
- One-instruction register/flag effects.

Needs simulation:

- Multi-instruction traces.
- Stack and subroutine behavior.
- Decimal mode correctness.
- Interrupt behavior.
- Accurate cycle counting with page-crossing penalties.

### x86-64

Why it is attractive:

- Major real-world architecture.
- Teaches registers, calling conventions, addressing modes, flags, stack discipline, and instruction syntax.

Scope control is essential because x86-64 is huge.

Possible categories:

- Registers:
  - General registers and subregisters: `rax/eax/ax/al`, etc.
  - Caller-saved vs callee-saved registers for one ABI at a time.
- Syntax:
  - Intel vs AT&T operand order.
  - Size suffixes and memory operand notation.
  - Translate small examples between Intel and AT&T.
- Addressing:
  - Base + index * scale + displacement.
  - Compute effective address.
- Flags:
  - Which flags matter after `cmp`, `test`, `add`, `sub`.
  - Signed vs unsigned conditional jumps.
- Stack and calls:
  - `call`, `ret`, `push`, `pop`.
  - Stack pointer changes.
  - Simple function prologue/epilogue recognition.
- Instruction effects:
  - `mov`, `lea`, `add`, `sub`, `and`, `or`, `xor`, shifts, compares, conditional branches.

Low-hanging fruit:

- Register naming and subregister relationships.
- Effective address calculations.
- Conditional jump selection after `cmp`.
- Intel/AT&T syntax recognition and small translations.

Needs simulation or careful limits:

- Multi-instruction execution with flags.
- Partial-register behavior.
- Undefined/implementation-specific flags.
- Full memory model.
- Floating point, SIMD, atomics, privileged instructions.

Recommendation:

- Start with 6502 for a first assembly app because a satisfying v1 is much smaller.
- For x86-64, explicitly choose a subset and one syntax first, likely Intel syntax, then add AT&T as a translation category.

## Sister App: Electric Circuits and Electronics

This is a strong fit for the same single-file app style because generated circuits can be visual, dynamic, and still exactly checkable when the scope is controlled. The browser is enough for generated SVG schematics, typed numeric answers, unit normalization, and small graph-based circuit questions.

Possible categories:

- Schematic symbols and labels:
  - Identify resistor, capacitor, inductor, diode, LED, switch, battery, ground, op-amp, BJT, MOSFET, fuse, lamp, and speaker symbols.
  - Interpret labels such as `R1`, `C2`, `VCC`, `GND`, `VIN`, `VOUT`, `NC`, `NO`, `COM`.
  - Recognize polarity markings on diodes, LEDs, electrolytic capacitors, batteries, and transistor pins.
  - Match generated symbols to names, values, and units.
- Units and prefixes:
  - Convert between `ohm`, `kOhm`, `MOhm`, `F`, `uF`, `nF`, `pF`, `V`, `mV`, `A`, `mA`, and `uA`.
  - Interpret resistor color codes.
  - Read compact component labels, such as capacitor codes or `4k7` resistor notation.
- Ohm's law and power:
  - Use a generated schematic to solve for `V`, `I`, or `R` in context.
  - Use `P = VI`, `P = I^2R`, or `P = V^2/R` to choose or check component ratings.
  - Decide whether a resistor power rating is sufficient in a shown circuit.
  - Prefer "choose the component value/rating" prompts over naked formula drills once the basics are introduced.
- Series and parallel networks:
  - Equivalent resistance or capacitance for small generated networks.
  - Voltage and current in simple series/parallel circuits.
  - Identify whether two components are in series, parallel, or neither.
- Circuit interpretation:
  - Trace current paths in a generated schematic.
  - Identify nodes that are electrically the same.
  - Locate open circuits and shorts.
  - Predict whether an LED lights in a simple circuit.
  - Identify pull-up and pull-down resistors.
- Common building blocks:
  - Voltage dividers.
  - LED current-limiting resistors.
  - RC time constants.
  - First-order low-pass and high-pass filters.
  - Simple transistor or MOSFET switch behavior.
  - Basic op-amp comparator and ideal negative-feedback cases.
- Laws and methods:
  - Kirchhoff's current law at one generated node.
  - Kirchhoff's voltage law around one generated loop.
  - Thevenin/Norton equivalents for very small circuits later.

Good dynamic fits:

- Render a generated schematic and ask for one calculated value.
- Render a generated schematic and ask the learner to choose a component value or rating, such as `R1`, an LED series resistor, a pull-up resistor, or a resistor wattage.
- Highlight a node or component and ask what it is connected to.
- Show a symbol and ask for the name, polarity, or likely pin labels.
- Ask for answers with unit-aware tolerance, for example `2.2 kOhm`, `2200`, or `2.2k`.
- Generate deliberately simple circuits from known templates rather than arbitrary schematics.

Low-hanging fruit:

- Symbol recognition and label interpretation.
- Unit conversion and engineering prefixes.
- Ohm's law.
- Power dissipation.
- Voltage dividers.
- Series/parallel resistor networks.
- LED resistor sizing.
- RC time constants.

Needs simulation or careful limits:

- Arbitrary circuits should wait until there is at least a small nodal-analysis solver.
- Real diode, BJT, and MOSFET behavior can get nonlinear quickly.
- Op-amp circuits need explicit idealized assumptions.
- AC analysis, transient simulation, oscillators, filters beyond first order, and SPICE-like behavior are too large for an early version.
- Real electronics also involves tolerances, parasitics, power limits, heat, measurement error, and safety; a drill app should be clear when it is using idealized textbook behavior.

Recommendation:

- Start with generated SVG schematics from a limited set of templates.
- Use exact internal graph data for checking, and treat the drawing as the user-facing view.
- Add a small unit parser early so numeric answers feel natural.
- Delay full simulation until the template-based version proves useful.

## Sister App: Economics and Applied Everyday Math

Economics and applied personal-math questions are a good fit because the app can generate realistic scenarios instead of isolated formulas. This could sit near Mental Arithmetic, but it has a different flavor: choosing, comparing, estimating, and interpreting quantities in context.

Possible categories:

- Interest and compounding:
  - Simple interest.
  - Compound interest.
  - Monthly vs yearly rates.
  - Rule-of-72 style estimates.
  - Loan balances and total paid for small examples.
- Inflation and purchasing power:
  - Adjust a price by an inflation rate.
  - Compare nominal and real changes.
  - Estimate whether a raise beats inflation.
- Price comparison:
  - Unit price.
  - Discounts.
  - Multi-buy offers.
  - Shipping and tax included/excluded.
  - Compare subscriptions or recurring costs over time.
- Percent changes:
  - Increase/decrease by a percent.
  - Reverse a percent change.
  - Difference between percentage points and percent change.
  - Successive changes, such as `+20%` then `-20%`.
- Budget and cashflow:
  - Monthly vs yearly totals.
  - Savings rate.
  - Runway from balance and burn rate.
  - Split bills, tips, and taxes.
- Probability and expected value:
  - Simple expected value.
  - Break-even probability.
  - Risk/reward comparisons.
  - Warranties and insurance as simplified expected-value drills.
- Indexes and ratios:
  - Convert between index values and percentage changes.
  - Compare ratios.
  - Scale recipes, quantities, or rates.

Good dynamic fits:

- Generate small realistic stories and ask for one number.
- Ask which option is cheaper or better over a specified time horizon.
- Ask for a rough estimate first, then exact calculation at higher levels.
- Show a compact table of offers, prices, rates, or payments and ask for comparison.
- Use unit-aware answer checking for money, percentages, and time.

Low-hanging fruit:

- Percent changes.
- Unit prices.
- Discounts and sales tax.
- Simple and compound interest.
- Monthly/yearly conversion.
- Rule-of-72 estimates.

Needs careful limits:

- Avoid pretending to give financial advice. Keep it explicitly as arithmetic and interpretation practice.
- Use fictional numbers and scenarios.
- Be clear about assumptions: rate period, compounding period, tax included/excluded, fees, inflation horizon, and rounding.
- Real loans, investments, taxes, and insurance have legal and regional details that should not be implied by simplified drills.

Recommendation:

- Start as an "Applied Math" or "Everyday Economics" app rather than a finance-advice app.
- Share ideas with Mental Arithmetic, but keep contextual comparison and interpretation as the main identity.
- Add tables early because comparing options is more interesting than naked formula drills.

## Sister App: Physics and Chemistry Practice

Physics and chemistry can work well when questions are generated from controlled templates with units, diagrams, and exact answer rules. They should probably start as separate focused apps if they grow, but a shared "Science Practice" prototype could explore the common infrastructure: unit parsing, formula templates, generated diagrams, and dimensional reasoning.

### Physics

Possible categories:

- Units and dimensions:
  - SI prefixes.
  - Unit conversion.
  - Dimensional analysis.
  - Identify compatible units.
- Mechanics:
  - Speed, distance, and time.
  - Constant acceleration.
  - Force, mass, and acceleration.
  - Work, energy, and power.
  - Momentum for simple one-dimensional cases.
- Waves and sound:
  - Frequency, wavelength, and speed.
  - Period and frequency.
  - Basic decibel comparisons later.
- Electricity:
  - Ohm's law and power overlap with the electronics app.
  - Charge, current, voltage, resistance, and energy.
- Graph interpretation:
  - Position/time and velocity/time graphs.
  - Slope and area under simple generated graphs.

Good dynamic fits:

- Generate a small diagram or graph and ask for one quantity.
- Ask which formula applies, then ask for the numeric answer.
- Use unit-aware checking with tolerances for rounded answers.
- Scale difficulty by number of steps, unit conversions, and whether diagrams are included.

### Chemistry

Possible categories:

- Periodic table basics:
  - Atomic number, mass number, protons, neutrons, electrons.
  - Ions and charge.
  - Groups and periods for common elements.
- Formula interpretation:
  - Count atoms in a chemical formula.
  - Molar mass for small compounds.
  - Percent composition.
- Moles and stoichiometry:
  - Convert grams, moles, and particles.
  - Balance small chemical equations.
  - Use coefficients for simple reaction amounts.
- Solutions:
  - Molarity.
  - Dilution with `C1V1 = C2V2`.
  - Mass concentration.
- Acids and bases later:
  - pH and pOH for simple powers of ten.
  - Strong acid/base assumptions only.

Good dynamic fits:

- Generate formulas and ask for atom counts, molar mass, or composition.
- Generate a small balanced reaction and ask for a missing amount.
- Render molecule/formula text cleanly with subscripts.
- Use multiple-choice for symbolic balancing early, typed numbers for quantities.

Needs careful limits:

- Chemistry parsing can get complex; start with generated formulas from a safe grammar.
- Real chemistry has significant figures, phases, equilibrium, thermodynamics, and lab safety concerns that need explicit scope.
- Physics formulas should state assumptions such as frictionless motion, constant acceleration, ideal behavior, or one-dimensional motion.
- Unit handling should be built early, because otherwise science questions become frustratingly picky.

Recommendation:

- Start with physics units and one-step mechanics if building a science app soon.
- Start chemistry with formula parsing, molar mass, and atom counts before balancing or stoichiometry.
- Reuse generated SVG/table rendering patterns from electronics and economics where possible.

## Sister App: Calculus and Symbolic Math Practice

Calculus is feasible and potentially a very good fit, but it has one important boundary: generating calculus questions is much easier than accepting arbitrary symbolic answers. A useful app should not try to become a full computer algebra system. It should use a controlled expression grammar, exact internally generated answers, and answer checking that accepts common equivalent forms without promising unlimited symbolic reasoning.

Possible categories:

- Derivatives:
  - Constants and powers.
  - Polynomial derivatives.
  - Sums and scalar multiples.
  - Product rule.
  - Quotient rule.
  - Chain rule.
  - Basic trig, exponential, and logarithmic derivatives.
- Antiderivatives:
  - Power rule.
  - Simple polynomial antiderivatives.
  - Basic `sin`, `cos`, `exp`, and `1/x`.
  - Include the constant of integration in a controlled way later.
- Limits:
  - Direct substitution.
  - One-sided limits from generated graphs or tables.
  - Factor-and-cancel polynomial limits.
  - Limits involving simple rational expressions.
- Numerical calculus:
  - Secant slope.
  - Tangent slope from a formula at a point.
  - Riemann sums.
  - Trapezoid estimates.
  - Newton's method iterations.
- Rule recognition:
  - Which rule applies?
  - Identify inner and outer functions for chain rule.
  - Choose the next correct transformation step.
- Graph interpretation:
  - Estimate derivative sign from a generated curve.
  - Match function and derivative shapes.
  - Identify increasing/decreasing and concavity from simple generated graphs.

Difficulty model:

- L1:
  - `d/dx x^n`, constants, and simple monomials.
  - Mostly integer coefficients and positive powers.
- L2:
  - Polynomial derivatives and antiderivatives.
  - Sums, differences, scalar multiples, and simple evaluation at a point.
- L3:
  - Product rule, quotient rule, and simple chain rule.
  - Expressions still generated from a small grammar.
- L4:
  - Trig, `exp`, `ln`, nested chain rule, and simple limits.
  - More emphasis on recognizing the rule and simplifying enough.
- L5:
  - Mixed expressions, multi-step prompts, derivative evaluation, limits, and numerical methods.

Answer checking options:

- Structured fields:
  - Useful for early levels, such as entering coefficient and exponent.
  - Very robust, but less natural for full expressions.
- Constrained text parser:
  - Support a small grammar: integers, `x`, `+`, `-`, `*`, `/`, `^`, parentheses, `sin`, `cos`, `exp`, and `ln`.
  - Parse the learner's answer and the expected answer into expression trees.
  - Normalize obvious forms such as constant folding, term ordering for simple sums, and removal of redundant `*1` or `+0`.
- Numerical equivalence checks:
  - Evaluate both expressions at several safe random `x` values.
  - Avoid points where either expression is undefined.
  - Useful as a practical fallback for equivalent forms such as `12x^3 - 4x` and `4x(3x^2 - 1)`.
  - Not a proof of equality, but good enough for controlled generated expressions when combined with parser limits.
- Multiple-choice:
  - Good for rule recognition, valid next step, graph interpretation, and ambiguous symbolic cases.

Good dynamic fits:

- Generate an expression and ask for its derivative.
- Generate a derivative and ask which original function could have produced it.
- Generate a function and a point, then ask for the derivative value at that point.
- Generate a short step-by-step transformation and ask for the missing step.
- Render a generated graph and ask about slope, tangent sign, concavity, or matching derivative shape.
- Ask which rule applies before asking for the resulting expression.

Low-hanging fruit:

- Polynomial differentiation.
- Polynomial antiderivatives.
- Derivative-at-a-point questions.
- Rule recognition.
- Simple numerical slope and Riemann sum questions.
- A tiny expression parser for controlled polynomial expressions.

Needs careful limits:

- Do not attempt a general-purpose CAS.
- State the accepted syntax clearly in the Learn card and answer feedback.
- Avoid arbitrary simplification expectations.
- Avoid functions or domains that make equivalence checking fragile until the parser and evaluator are stronger.
- Be careful with division by zero and undefined `ln`/trig edge cases in numerical checks.
- If multiple constants of integration are accepted, the checker needs to understand equivalence up to a constant.

Recommendation:

- Start with a "Calculus Fluency" app focused on derivatives of generated polynomial expressions.
- Add a small expression parser and evaluator before adding trig/log/exp.
- Use numerical equivalence at safe sample points as a pragmatic checking layer, not as the only line of defense.
- Add multiple-choice rule recognition early because it gives useful practice without requiring a full symbolic checker.

## Other App Ideas

- Git practice:
  - Interpret status/log graphs.
  - Predict effects of merge/rebase/reset in toy commit graphs.
  - Low-hanging fruit: generated commit DAG questions.
  - Hard part: avoiding destructive-command confusion.
- HTTP and web basics:
  - Request/response anatomy.
  - Status code families.
  - Cache header interpretation.
  - Good dynamic fit when using generated request/response examples.
- SQL practice:
  - Predict query results on small generated tables.
  - Joins, grouping, filtering, ordering.
  - Needs a small in-browser relational evaluator or very limited query subset.
- Networking numeracy:
  - CIDR ranges, subnet masks, host counts.
  - Port/protocol recognition.
  - Binary/decimal crossover makes it adjacent to the current app.
- Unicode and text encoding:
  - ASCII, UTF-8 byte sequences, code points.
  - Dynamic byte/codepoint conversion questions.
  - Needs careful scope to avoid huge Unicode surface area.

## Possible Later Non-Technical Apps

The core project focus should stay on generated practice for technical and computing fluency at first. Non-technical domains can still fit later if they benefit strongly from generation, exact checking, interaction, or simulation.

### Japanese Practice

Japanese is personally interesting and could be a good later app because several beginner-to-intermediate skills are dynamic, structured, and checkable without becoming a general translation engine. It would also exercise the localization and text-input parts of Practice Lab in a useful way.

Possible categories:

- Counting and numbers:
  - Convert between Arabic numerals and Japanese readings.
  - Practice large number units such as `万`, `億`, and `兆`.
  - Choose the correct counter reading for generated quantities.
  - Practice sound changes such as `いっぽん`, `さんぼん`, `ろっぴゃく`, and `はっせん`.
- Dates and time:
  - Months, days of the month, weekdays, years, and eras later.
  - Convert generated dates to Japanese readings.
  - Interpret Japanese date strings.
  - Practice relative dates such as today, tomorrow, yesterday, next week, and last month.
- Kana and readings:
  - Hiragana/katakana recognition.
  - Kana-to-romaji and romaji-to-kana if useful, though many apps already cover this.
  - Small minimal-pair drills for long vowels, small `っ`, and contracted sounds.
- Particles and sentence patterns:
  - Fill in `は`, `が`, `を`, `に`, `で`, `へ`, `と`, `も`, and `の` in controlled sentences.
  - Translate or construct very small template sentences.
  - Example template: `XはYです`, where `X` is a generated noun and `Y` is a generated noun or adjective.
- Adjectives and basic conjugation:
  - `い`-adjective present/past/negative forms.
  - `な`-adjective and noun sentence forms.
  - Polite vs plain forms later.
- Verb forms later:
  - Dictionary, `ます`, negative, past, `て` form, potential, and volitional.
  - Start from tightly controlled verb groups rather than open-ended translation.

Good dynamic fits:

- Generated number/date prompts with exact checking.
- Generated sentence templates with controlled vocabulary and grammar.
- Multiple-choice or button-based answers for particles and conjugation categories.
- Mixed-direction drills: read, write, choose, and interpret.
- Optional romaji acceptance at low levels, then kana/kanji-first answers later.

Needs careful limits:

- Do not attempt free-form machine translation.
- Keep grammar prompts template-based, with generated nouns/adjectives/verbs from a known vocabulary table.
- Be explicit about accepted writing systems for each category: romaji, kana, kanji, or mixed.
- Japanese has many valid phrasings; open translation answers can become frustrating unless the app controls the expected form tightly.
- Static vocabulary memorization may still be better in Anki unless the app adds generated context, conjugation, counters, or date/number mechanics.

Recommendation:

- Start with "Japanese Numbers & Dates" rather than a broad grammar app.
- Add counters once basic number reading works.
- Keep the wider grammar practice as a minor controlled-template mode until the answer checker has proven pleasant.

### Music Practice

Music is a plausible later app because many skills are dynamic and visual, and several can be checked exactly. There are already many music apps, so this should not drive the shared architecture early, but it is worth keeping as a possible "same engine, different domain" experiment.

Possible categories:

- Note names on staff:
  - Treble, bass, and later alto/tenor clef.
  - Ledger lines.
  - Accidentals.
- Intervals:
  - Identify interval size and quality.
  - Build an interval above or below a given note.
  - Invert intervals.
- Keys, scales, and modes:
  - Key signatures.
  - Major/minor scales.
  - Modes.
  - Relative and parallel keys.
- Chords and harmony:
  - Triads and seventh chords.
  - Inversions.
  - Roman numeral analysis.
  - Nashville numbers.
  - Generated chord progressions.
- Rhythm:
  - Count beats in generated measures.
  - Identify note/rest durations.
  - Fill missing counts.
- Instruments:
  - Fretboard note finding.
  - Keyboard note finding.
  - Transposition for instruments.
- Ear training later:
  - Intervals.
  - Chords.
  - Rhythms.
  - Melodic fragments.

Good dynamic fits:

- Generated staff notation as SVG.
- Generated keyboard or fretboard diagrams.
- Exact answers for note names, intervals, chords, keys, and counts.
- Audio-backed prompts later if the app grows beyond pure visual/theory practice.

Design note:

- Keep music outside the first architecture decisions. A good framework for bits, C++, assembly, electronics, and shell practice will likely still support music later through categories, levels, generated prompts, SVG rendering, Learn cards, localization, and progress tracking.

## General Design Notes

- Prefer generated questions with exact or structured checking.
- Keep each app focused enough that progress categories mean something.
- Use the same persistence pattern if apps share one directory, but separate storage keys per app.
- A future launcher page could link to each single-file app.
- Static recall should usually go to Anki; dynamic checking, generated examples, and simulation justify a custom app.

## Build and Source Layout

The published apps should remain standalone HTML files that can be opened directly in a browser. The source does not need to stay as one giant hand-edited file forever.

Project constraints:

- No Node.js ecosystem.
- No `npm`.
- No external packages.
- Prefer shell scripts plus Bun when generation or JS-aware tests are useful.
- Keep build tooling small, local, and boring.

Recommended shape:

- `apps/<app-id>/template.html` for the app shell and markup.
- `apps/<app-id>/style.css` for CSS.
- `apps/<app-id>/main.js` for app behavior.
- `tools/build.sh` as the shell entry point.
- `tools/build.mjs` as a package-free Bun script that inlines CSS and JS.
- `tools/test.sh` and `tools/test.mjs` for package-free smoke tests and self-tests.
- Root-level HTML files remain the easy-to-open generated artifacts.

Reasons to generate the HTML:

- Easier editing when apps grow past a few thousand lines.
- Shared components can be factored out later without copy-paste.
- Pure logic can be tested outside the browser.
- Localization can move strings out of markup and scattered prompt generators.
- The final distribution story stays simple: one HTML file per app.
