# Digital Logic and Computer Architecture — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, digital-circuit simulator, timing-diagram renderer, datapath/pipeline simulator, memory-hierarchy oracle, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Digital Logic and Computer Architecture

### Topic goal

Develop the ability to reason fluently from Boolean signals up through the structures of a working computer. The learner should become able to:

- evaluate and construct gate networks;
- move among truth tables, Boolean expressions, and schematics;
- analyze combinational arithmetic and routing circuits;
- trace latches, flip-flops, registers, counters, and finite-state machines;
- reason about propagation delay, clock constraints, and synchronous timing;
- follow instructions through a processor datapath and its control signals;
- identify pipeline hazards and determine forwarding, stalls, and flushes;
- trace cache, TLB, page-table, and memory behavior;
- calculate latency, throughput, CPI, speedup, and bandwidth under explicit models;
- connect programmer-visible behavior to the digital hardware that implements it.

The app should train exact mental models, not merely terminology such as “a cache is fast memory.”

### Position within Practice Lab

This topic is the bridge among four existing areas:

- **Programmer Low-Level Numeracy** supplies fixed-width bit patterns, signed representations, masks, shifts, and byte interpretation.
- **Electric Circuits** supplies voltage, current, transistor-switch, threshold, timing-component, and practical-interface foundations.
- **Assembly Practice** supplies programmer-visible registers, instructions, flags, addressing, calls, and execution traces.
- **C++ Mental Execution** supplies source-language behavior whose implementation eventually becomes instructions and machine state.

This app owns the intervening hardware abstractions: gates, combinational and sequential blocks, clocked state, datapaths, microoperations, pipelines, and memory hierarchies.

### Audience and prerequisites

The learner should know:

- binary and hexadecimal notation;
- unsigned and two’s-complement interpretation;
- bitwise AND, OR, XOR, and NOT;
- simple addition and subtraction;
- the idea that assembly instructions read and update registers and memory.

Early gate exercises may be used without all prerequisites. Later processor and memory categories assume the low-level numeracy and assembly foundations.

### Scope

The topic includes:

- ideal active-high and active-low digital signals;
- NOT, AND, OR, XOR, NAND, NOR, XNOR, buffers, tri-state outputs, and gate bubbles;
- truth tables, Boolean expressions, gate schematics, and controlled Boolean simplification;
- sum-of-products, product-of-sums, minterms, maxterms, Karnaugh maps up to four variables, and declared don’t-care inputs;
- multiplexers, demultiplexers, decoders, encoders, priority encoders, comparators, parity circuits, and simple programmable logic;
- half adders, full adders, ripple-carry addition, carry lookahead at a conceptual/small exact level, subtraction, overflow, ALUs, and shifters;
- SR latches, D latches, D/T/JK flip-flops, registers, shift registers, synchronous counters, and explicitly bounded asynchronous counters;
- setup, hold, clock-to-Q, propagation delay, critical paths, maximum clock rate, clock skew under a declared convention, and simple static hazards;
- Moore and Mealy machines, transition tables, state diagrams, output traces, state encodings, and small sequence detectors;
- instruction fields and control words for a declared teaching ISA;
- single-cycle and multicycle datapaths, register file use, ALU selection, memory access, writeback, branch decisions, and microoperation traces;
- classic in-order pipelines, occupancy diagrams, structural/data/control hazards, forwarding, stalls, flushing, and CPI;
- byte/word address breakdown, SRAM/DRAM organization at an abstract level, cache mapping, tags, sets, blocks, replacement, write policies, and average memory access time;
- virtual addresses, pages, page tables, TLBs, permissions, page faults, and small multi-level translation walks;
- CPU performance equations, Amdahl’s law, throughput, bandwidth, and bottleneck reasoning;
- polling, interrupts, memory-mapped I/O, DMA, and simple bus arbitration;
- bounded multicore cache-coherence traces and false sharing.

The intended ceiling is a strong introductory computer organization and architecture course. Advanced topics may appear as carefully constrained Level 5 families, but the app must remain mentally solvable and exactly checkable.

### Exclusions

Do not include in the initial app:

- transistor-level construction of gates, semiconductor device physics, noise margins, or analog waveform analysis already belonging to Electric Circuits;
- arbitrary base conversion, mask arithmetic, endianness drills, or fixed-width arithmetic without a hardware-structure purpose;
- architecture-specific assembly execution already covered by the 6502 and AMD64 apps;
- unrestricted Verilog, VHDL, SystemVerilog, FPGA-tool, synthesis, placement, or timing-closure questions;
- arbitrary logic minimization requiring industrial CAD tools;
- Karnaugh maps above four variables;
- analog PLLs, clock generation, signal integrity, transmission lines, PCB layout, or power-delivery networks;
- metastability probability calculations without a fully declared toy model;
- asynchronous-circuit synthesis, delay-insensitive logic, or formal clock-domain-crossing verification;
- floating-point datapath implementation in the initial version;
- microcode or control stores tied to proprietary real processors;
- undocumented x86 microarchitecture, vendor-specific cache details, or claims inferred from current product marketing;
- unrestricted out-of-order execution, register renaming, reorder buffers, speculative side channels, branch-predictor research, GPU SIMT architecture, vector ISA design, or NoC topology in the initial version;
- operating-system replacement algorithms or general concurrency beyond what is needed for memory translation and bounded coherence traces;
- questions whose correctness depends on unstated compiler, ABI, operating-system, cache, or timing behavior;
- static inventor/date/acronym trivia.

### Global digital model

Unless a family declares otherwise:

- Logic uses the two stable values `0` and `1`.
- `0` means false/deasserted and `1` true/asserted.
- `X` means unknown and `Z` high impedance only in families that explicitly introduce four-state or tri-state behavior. Neither is a third Boolean truth value.
- AND is `·` or `∧`, OR is `+` or `∨`, XOR is `⊕`, and NOT is an overbar, leading `¬`, or postfix prime. A question uses one displayed convention consistently.
- `A_n`, `/A`, a bar over `A`, or a bubble may denote an active-low signal only when the legend declares that convention.
- A bubble on a gate pin semantically inverts that pin.
- Gates are ideal and have zero delay unless the prompt supplies delays.
- Fan-out has no electrical loading effect in the ideal logic categories.
- Simultaneous combinational evaluation means evaluation to a stable fixed point in an acyclic network.
- Combinational networks generated for ordinary questions are acyclic.
- Buses are ordered from most significant bit to least significant bit unless indices are displayed otherwise.
- Bit widths are explicit. Results are truncated to the destination width only where a destination is shown.
- Arithmetic circuits use modulo `2^w` bit-vector results plus separately named carry/borrow/overflow outputs.

### Sequential and clock model

Unless explicitly varied:

- State changes on the rising clock edge.
- Flip-flop inputs are sampled immediately before the active edge.
- Nonblocking, simultaneous state update semantics apply: every next-state value is computed from the same old state.
- A D flip-flop has `Q_next=D`.
- A T flip-flop holds for `T=0` and toggles for `T=1`.
- A JK flip-flop holds for `00`, resets for `01`, sets for `10`, and toggles for `11`.
- An active synchronous reset affects state only at the active clock edge.
- An active asynchronous reset affects state immediately, independent of the clock.
- Clock-enable behavior is explicit and has priority below reset unless the prompt states a different priority.
- Timing diagrams label sampling edges, and values exactly on an edge are not inferred from drawing position alone.
- Setup and hold questions use explicitly supplied timing numbers and a declared clock-skew sign convention.

### Timing model

Timing questions must state whether each delay is:

- contamination/minimum delay `t_cd`;
- propagation/maximum delay `t_pd`;
- clock-to-Q minimum/maximum;
- setup time;
- hold time.

For the default same-clock-domain register path:

```text
Tclk ≥ t_clk→Q,max + t_comb,max + t_setup + t_skew_penalty
```

The prompt must define the skew term. The recommended convention is:

```text
t_skew = capture-clock arrival − launch-clock arrival
setup requirement: Tclk ≥ t_clk→Q,max + t_comb,max + t_setup − t_skew
hold requirement:  t_clk→Q,min + t_comb,min ≥ t_hold + t_skew
```

Positive skew helps setup and hurts hold under this convention.

Combinational path delay is the maximum sum along a sensitizable input-to-output path. Introductory questions may state that every structural path is sensitizable. Hazard questions use a supplied transport-delay event model; the learner is never expected to infer analog pulse filtering.

### Teaching processor contract

Datapath and pipeline families use either a completely displayed local machine model or the default teaching machine `PL16`.

`PL16` has:

- 16-bit fixed-width instructions and 16-bit data;
- byte-addressed memory;
- 16-bit virtual/program addresses;
- eight 16-bit registers `R0..R7`;
- `R0` reads as zero and discards writes;
- two register-read ports and one register-write port;
- a program counter `PC`;
- fixed instruction length of two bytes, so sequential `PC_next=PC+2`;
- load/store architecture;
- aligned 16-bit loads/stores in basic datapath questions;
- two’s-complement signed immediates where the instruction format says `simm`;
- branch displacement measured in instructions relative to `PC+2`;
- no delay slot;
- precise exceptions only in families that introduce them.

The minimum semantic instruction subset is:

```text
ADD  rd, rs, rt      rd = rs + rt
SUB  rd, rs, rt      rd = rs - rt
AND  rd, rs, rt
OR   rd, rs, rt
XOR  rd, rs, rt
ADDI rd, rs, simm
LD   rd, disp(rs)
ST   rt, disp(rs)
BEQ  rs, rt, off
BNE  rs, rt, off
J    target
```

Exact bit layouts are supplied by each encoding question and versioned in implementation data. The app must not make learners memorize an invented opcode table before showing it.

### Default pipeline contract

The default `PL16-P5` pipeline has:

1. `IF`: instruction fetch and next-PC selection;
2. `ID`: decode and register read;
3. `EX`: ALU/address/branch comparison;
4. `MEM`: data-memory access;
5. `WB`: register writeback.

Unless a family varies the model:

- stages take one cycle;
- each stage accepts at most one instruction per cycle;
- separate instruction and data memories eliminate IF/MEM structural conflict;
- register writes occur early enough in a cycle for ID reads in that same cycle to see them;
- forwarding paths are explicitly listed by the prompt;
- load data becomes available after MEM;
- branches resolve in EX;
- prediction is “not taken”;
- a taken branch flushes younger instructions in IF and ID;
- exceptions and cache misses are absent unless named.

Pipeline questions must display any departure from this contract beside the exercise.

### Memory-hierarchy contract

- Addresses are non-negative fixed-width byte addresses.
- A cache block contains `B=2^b` bytes.
- A cache with `S=2^s` sets uses `b` block-offset bits and `s` set-index bits; the remaining high bits form the tag.
- Direct-mapped means one line per set.
- `E`-way set associative means `E` lines per set.
- Fully associative means one set.
- Replacement policy is explicit: normally true LRU for small traces, otherwise FIFO or a displayed pseudo-LRU rule.
- Initial cache/TLB contents are shown or stated empty.
- Write allocation and write policy are separately declared.
- Every trace states whether accesses are byte, word, or block operations and whether an access may cross a block/page boundary.
- Average memory access time questions state serial versus parallel tag/data/TLB lookup assumptions.

### Virtual-memory contract

- Pages have power-of-two sizes.
- Virtual and physical address widths are explicit.
- Page-table entries show validity/presence, physical page number, and relevant permissions.
- A page fault is distinct from a TLB miss and a cache miss.
- A TLB caches translations, not data.
- Translation occurs before physically indexed cache access unless a family explicitly introduces a virtually indexed scheme.
- Multi-level walks show the exact split of virtual-page-number fields.
- The operating system’s replacement policy and disk latency are out of scope unless supplied as toy data.

### Global answer conventions

- Ignore surrounding whitespace.
- Accept binary with optional `0b`, hexadecimal with optional `0x`, and digit separators when the requested representation permits them.
- Fixed-width bit-vector answers must preserve the requested width.
- Boolean answers accept `0/1`, `low/high`, or semantic controls as declared.
- Multi-output circuits use named fields; never require an unlabeled concatenation.
- Gate-network and Boolean-expression answers are compared semantically when equivalence is the task, structurally when a particular implementation constraint is requested.
- Equivalent minimized expressions are accepted if they satisfy the requested form and gate constraints.
- Truth-table rows use displayed input order with binary count from all-zero upward unless the prompt explicitly uses a different order.
- State traces use one named value per cycle/edge.
- Cache/TLB traces use structured hit/miss, set, tag, victim, and state fields.
- Cycle numbers are one-based in displays but internal arrays may be zero-based.
- `KiB=2^10` bytes and `MiB=2^20` bytes; decimal `kB/MB` appear only when explicitly requested.
- Times and frequencies accept compatible SI units.
- Exact rational CPI/speedup answers may be entered as fractions or sufficiently precise decimals under the stated tolerance.
- Multiple valid state encodings, minimized circuits, or schedules must all be accepted unless the prompt fixes a canonical policy.

### Diagram semantics

- Gate schematics show every signal direction, inversion bubble, bus width, and pin label needed to solve.
- Crossing wires connect only when a junction dot is present.
- Timing diagrams have labeled time/edge columns and an accessible table equivalent.
- State diagrams show transition conditions and whether outputs belong to states or edges.
- Datapaths distinguish data buses from control lines using both line style and labels, not color alone.
- Multiplexer inputs have visible selector values.
- Pipeline diagrams label instruction, stage, and cycle axes.
- Cache/TLB tables expose valid, dirty, tag, replacement-order, and coherence fields where relevant.
- Address bit fields use explicit inclusive bit indices.
- Graphics are generated from semantic objects; geometry must not carry hidden meaning.

### Difficulty philosophy

Difficulty should rise through:

- translating among truth tables, expressions, and circuits;
- more interacting but independently understood blocks;
- inverse design instead of only forward evaluation;
- state dependencies across edges or cycles;
- selecting the relevant critical path;
- simultaneous pipeline and memory state;
- meaningful policy contrasts;
- weaker scaffolding and mixed representations;
- identifying which hardware assumption changes an answer.

Difficulty must not rise through:

- huge truth tables;
- excessive gate count;
- unlabeled schematics;
- arbitrary opcode memorization;
- very long instruction or cache traces;
- enormous addresses;
- arithmetic better suited to a calculator;
- obscure commercial processor trivia;
- accidental ambiguity about timing, replacement, forwarding, or write policy.

Most exercises should require at most three essential reasoning stages. Longer traces should ask several locally checkable subquestions rather than one fragile final value.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | One gate/block, one edge, direct field split, or one formula substitution |
| 2 | Small acyclic networks, two-bit arithmetic, short state/cache traces, direct control signals |
| 3 | Inverse construction, four-bit datapaths, timing constraints, hazards, associativity/replacement |
| 4 | Mixed blocks, FSM design, multicycle/pipeline interactions, TLB plus page table |
| 5 | Policy contrasts, bounded optimization, combined hierarchy reasoning, coherence, and performance trade-offs |

Each instance also records independent dimensions such as gate depth, fan-in, state count, trace length, associativity, hazard distance, and representation direction.

### Generator and oracle model

Every instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `semanticCircuit`, `inputState`, `initialState`, `clockModel`, `machineModel`, `memoryModel`, `trace`, `requestedQuantity`, `canonicalAnswer`, `equivalenceMode`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `structuralSignature`, `modelVersion`, and `oracleVersion`.

Generation order:

1. build a typed semantic graph, transition system, instruction stream, or hierarchy state;
2. solve it with an exact reference simulator;
3. validate it with an independently implemented oracle or exhaustive enumeration;
4. construct distractors from named misconceptions;
5. render the semantic object as SVG, table, waveform, or text.

All runtime generation and checking must work locally in the standalone page. Build-time validation may use external HDL simulators or architecture models, but they are not shipped as runtime dependencies.

## 2. Category: Gates, signals, and truth tables

### Category purpose

Build immediate fluency with digital signals and gate behavior, including active-low notation and multi-gate evaluation.

### Learn

AND requires every input to be `1`; OR requires at least one; XOR is `1` for odd parity; NAND, NOR, and XNOR invert those results. A pin bubble means inversion. Active-low names describe assertion, not a different voltage arithmetic.

### Prerequisites

Binary digits and simple bitwise operators.

### Common misconceptions

- Treating XOR as OR.
- Ignoring a bubble or applying it twice.
- Reading `_n` as “currently zero” rather than “asserted when zero.”
- Confusing `X` unknown with a don’t-care design condition.
- Propagating values in drawing order rather than dependency order.

### Families

### Family `gate_output`

**Task.** Compute one gate’s output from 1–4 inputs.

**Response.** `0/1`; `X/Z` only in declared four-state variants.

**Template.** `For the shown {gate_type} gate with {input_values}, what is Y?`

**Generation and difficulty.** L1 NOT/two-input AND/OR; L2 XOR and complemented gates; L3 bubbles/3–4 inputs; L4 active-low interpretation; L5 a declared unknown/high-impedance case.

**Derivation.** Apply the exact truth function after pin inversions, then output inversion.

**Distractors and feedback.** XOR-as-OR, ignored bubble, double inversion, active-low assertion confusion. Feedback shows pin-normalized inputs and the base gate before output inversion.

**Examples.**

1. `AND(1,0)` → `0`. L1.
2. `XOR(1,1)` → `0`. L2.
3. NAND with bubbled first input, raw inputs `A=0,B=1` → internal `1,1`, output `0`. L3.

**Validation.** Exhaust every input row for every supported gate/pin-inversion configuration.

### Family `gate_truth_table`

**Task.** Complete or recognize the truth table of a gate.

**Response.** One output control per row or single-choice gate name.

**Template.** `Complete Y for the displayed {n}-input gate.`

**Generation.** Two-input tables dominate; three-input parity and majority-like derived blocks appear later.

**Derivation.** Enumerate inputs in displayed binary order and evaluate.

**Constraints.** At most eight rows. Gate-identification choices must have distinct columns.

**Examples.**

1. AND → `0001` for `00,01,10,11`. L1.
2. XOR → `0110`. L1.
3. Three-input XOR → `1` on odd-popcount rows. L3.

**Validation.** Truth-column bit mask checked against row evaluator.

### Family `gate_network_trace`

**Task.** Evaluate every named intermediate and output in a small acyclic network.

**Response.** Multiple named Boolean fields.

**Template.** `Given {inputs}, find {intermediates_and_outputs}.`

**Generation.** Semantic DAGs of 2–8 gates, depth 2–5, balanced across reconvergent and tree-shaped networks.

**Derivation.** Topologically evaluate the graph.

**Constraints.** Every requested node lies on an output path; reject decorative gates and networks whose entire behavior collapses trivially at the current level.

**Examples.**

1. `N1=A∧B; Y=¬N1`, `A=B=1` → `N1=1,Y=0`. L1.
2. `Y=(A⊕B)∧C`, `1,0,1` → `1`. L2.
3. Reconvergent `N=¬A; Y=(A∧B)∨(N∧C)` with supplied inputs. L3.

**Validation.** DAG acyclicity, exhaustive network truth table, and renderer-edge agreement.

### Family `active_low_signal`

**Task.** Determine physical level, assertion state, or logical effect of an active-low control.

**Response.** Named `level` and/or `asserted` fields.

**Template.** `{signal_name} is {level}. Is the function asserted, and what does the controlled block do?`

**Generation.** Resets, enables, chip selects, and output enables; no electrical threshold arithmetic.

**Derivation.** Decode the naming/bubble convention, then apply block behavior.

**Examples.**

1. `RESET_n=0` → reset asserted. L1.
2. `/CS=1` → chip not selected. L1.
3. Active-low enable entering a bubbled enable pin: detect cancellation. L3.

**Validation.** Truth-table enumeration for signal level, assertion, and block state.

### Family `tri_state_bus`

**Task.** Resolve a shared bus driven by enabled tri-state outputs and identify high impedance or contention.

**Response.** Bus value from `0/1/Z/X` plus a contention flag.

**Template.** `Given the shown output-enable and data signals, what is the shared bus value?`

**Generation.** One to four drivers. L1 one enabled driver; L2 no enabled driver; L3 two same-valued drivers; L4 conflicting drivers; L5 multi-bit bus with per-driver enable.

**Derivation.** Disabled drivers contribute `Z`. No active driver resolves to `Z`; one or more identical active values resolve to that value; conflicting active `0` and `1` resolve to `X` and flag contention under the declared ideal four-state model.

**Distractors and feedback.** Treat `Z` as zero, allow the last drawn driver to win, ignore an active-low output enable, or report `X` merely because two equal drivers are enabled. Feedback lists each driver’s enabled state before resolving the bus.

**Examples.**

1. Driver A enabled with data `1`, driver B disabled → bus `1`. L1.
2. Both drivers disabled → bus `Z`. L2.
3. Enabled drivers supply `0` and `1` → bus `X`, contention. L4.

**Validation.** Exhaust every enable/data combination for up to four one-bit drivers and compare each bit independently for bus variants.

### Family `universal_gate_realization`

**Task.** Choose or complete a NAND-only or NOR-only realization of a Boolean function.

**Response.** Circuit choice or structured gate connections.

**Template.** `Implement {function} using only {NAND_or_NOR} gates.`

**Generation.** NOT, AND, OR, XOR at later levels; 2–6 gates.

**Derivation.** Apply De Morgan transformations and verify truth-table equivalence.

**Distractors.** Missing final inversion, NAND/NOR duality swap, tied-input misuse.

**Examples.**

1. `¬A = NAND(A,A)`. L1.
2. `A∧B = NAND(NAND(A,B),NAND(A,B))`. L2.
3. NOR-only `A∧B = NOR(NOR(A,A),NOR(B,B))`. L3.

**Validation.** Exhaustive equivalence and gate-type constraint.

## 3. Category: Boolean design and combinational blocks

### Category purpose

Train movement among behavior, Boolean formulas, and reusable combinational structures.

### Learn

A combinational output depends only on current inputs. Truth tables can be written as minterms or maxterms and simplified without changing behavior. Multiplexers route one input; decoders select one coded output; encoders perform the inverse under declared validity assumptions.

### Common misconceptions

- Confusing minterm row numbers with binary input order.
- Using don’t-care rows as required ones.
- Grouping nonadjacent Karnaugh cells.
- Swapping mux data inputs and selector codes.
- Assuming an ordinary encoder can resolve multiple asserted inputs.
- Confusing demultiplexing with decoding.

### Family `representation_translation`

**Task.** Translate among truth table, Boolean expression, and gate schematic.

**Response.** Expression builder, table column, or schematic choice.

**Template.** `Which {target_representation} implements {source_representation}?`

**Generation.** Two to four inputs; expression grammar NOT/AND/OR/XOR; canonical SOP/POS or structurally constrained target.

**Derivation.** Convert source to a complete truth bit mask and compare targets semantically.

**Examples.**

1. Table `0001` → `A∧B`. L1.
2. `A⊕B` → table `0110`. L2.
3. A bubbled NAND schematic → simplified expression. L3.

**Validation.** Exhaustively compare all representations.

### Family `canonical_sop_pos`

**Task.** Construct canonical sum-of-products or product-of-sums from specified rows.

**Response.** Structured minterm/maxterm selection or formula builder.

**Template.** `For F({variables})=Σm({indices}), give canonical SOP.`

**Generation.** 2–4 variables and balanced output density.

**Derivation.** For each `1` row create its minterm; for each `0` row create its maxterm.

**Distractors.** Complement row bits backward, confuse minterm/maxterm, omit a row.

**Examples.**

1. `Σm(1)` for `A,B` → `¬A·B`. L1.
2. `Σm(1,2)` → `¬A·B + A·¬B`. L2.
3. Convert `ΠM(0,3,5)` for three variables to canonical POS. L3.

**Validation.** Parse and exhaustively compare; assert canonical term completeness when requested.

### Family `kmap_minimize`

**Task.** Minimize a 2–4-variable function using a Karnaugh map.

**Response.** Group selection plus equivalent expression.

**Template.** `Minimize F with ones {ones} and don’t-cares {dc}.`

**Generation.** Construct backward from desired prime implicants; use Gray-code map ordering.

**Derivation.** Enumerate valid power-of-two wraparound groups, prime implicants, and minimum covers by literal count then term count; accept tied minima.

**Constraints.** Don’t-cares may aid groups but need not be covered. Reject instances with excessive tied answers at early levels.

**Examples.**

1. Adjacent two-variable ones `m0,m1` → `¬A`. L1.
2. Four-cell wraparound group → one-literal result. L2.
3. Four variables with one don’t-care enabling a larger group. L4.

**Validation.** Exhaustive function equivalence and independent exact cover solver.

### Family `multiplexer_route`

**Task.** Determine a mux output, selected input, or selector value.

**Response.** Bit value, input label, or selector bits.

**Template.** `For the shown {n}:1 mux, S={selector}, what reaches Y?`

**Generation.** 2:1, 4:1, 8:1; active-low enable and mux trees later.

**Derivation.** Interpret selector as displayed binary index after enable logic.

**Examples.**

1. 2:1, `S=0` → `D0`. L1.
2. 4:1, `S1S0=10` → `D2`. L2.
3. Two-level mux tree with one disabled branch. L4.

**Validation.** Enumerate selector/enable combinations and compare diagram pin ordering.

### Family `mux_function_implementation`

**Task.** Fill mux data inputs so selectors implement a target Boolean function.

**Response.** Named data-input values from `0,1,X,¬X`.

**Template.** `Use {selectors} as mux selects. What should D0...Dn be to implement {function}?`

**Generation.** Shannon decomposition with one remaining variable at higher levels.

**Derivation.** Restrict the target function for each selector assignment.

**Examples.**

1. 2:1 mux implements `A⊕B` with `S=A`: `D0=B,D1=¬B`. L2.
2. 4:1 mux with `A,B` selectors implements a three-variable function using `C/¬C`. L3.
3. Choose a smaller selector set using don’t-cares. L5.

**Validation.** Exhaustive target/mux equivalence.

### Family `decoder_encoder_trace`

**Task.** Trace a decoder, ordinary encoder, or priority encoder.

**Response.** One-hot vector, code, and valid flag.

**Template.** `Given {inputs}, determine {outputs} for the shown {block}.`

**Generation.** 2-to-4 and 3-to-8 decoders; 4-to-2/8-to-3 priority encoders; active-low variants.

**Derivation.** Apply enable, code ordering, and declared priority.

**Examples.**

1. 2-to-4 decoder, input `10` → `Y2=1`. L1.
2. Active-low decoder output for `011`. L2.
3. Priority encoder inputs `D5=D2=1`, highest-index priority → code `101`. L3.

**Validation.** Exhaust all input patterns; ordinary encoder rejects multiple-hot cases unless invalidity is the answer.

### Family `comparator_parity`

**Task.** Determine magnitude-comparator or parity-generator/checker outputs.

**Response.** `A<B`, `A=B`, `A>B` outputs or parity bit/error.

**Template.** `For {bit_vectors}, determine the shown comparator/parity outputs.`

**Generation.** 1–8 bits; unsigned by default, signed only when explicit; even/odd parity.

**Examples.**

1. `10₂` vs `01₂` unsigned → `A>B`. L1.
2. Required even parity bit for `1011` → `1`. L2.
3. Cascaded nibble comparators or signed/unsigned contrast. L4.

**Validation.** Integer comparison/popcount oracle plus gate-network equivalence.

## 4. Category: Arithmetic circuits and ALUs

### Category purpose

Connect bit-vector arithmetic to the gates and datapaths that produce sums, carries, overflow, and selected ALU functions.

### Learn

A full adder computes:

```text
S = A⊕B⊕Cin
Cout = AB + Cin(A⊕B)
```

Carry out and signed overflow are different. An ALU combines candidate results and selects one with control signals.

### Common misconceptions

- Equating carry out with signed overflow.
- Sending each ripple carry to the wrong bit.
- Forgetting two’s-complement subtraction uses inversion plus carry-in one.
- Treating an arithmetic right shift as a rotate.
- Reading ALU control bits without the displayed code table.

### Family `adder_cell`

**Task.** Compute half-adder or full-adder outputs, or recover one missing input.

**Response.** Named `S`, `Cout`, and optional missing bit.

**Generation.** Exhaustive one-bit rows; gate-level implementation variants.

**Examples.**

1. Half adder `1+1` → `S=0,C=1`. L1.
2. Full adder `A=1,B=0,Cin=1` → `S=0,Cout=1`. L1.
3. Given `B,Cin,S,Cout`, recover unique `A` or report ambiguity. L3.

**Validation.** Integer sum `A+B+Cin` and exhaustive circuit check.

### Family `ripple_carry_trace`

**Task.** Trace every sum and carry through a 2–8-bit ripple adder.

**Response.** Fixed-width sum and carry-chain fields.

**Template.** `Add {A}+{B} with Cin={c}; give S, c1...cw.`

**Derivation.** Apply full-adder recurrence from LSB upward.

**Difficulty.** Sparse carries; one long propagation; carry generation/kill; mixed signed interpretation.

**Examples.**

1. 2-bit `01+01` → `10`. L1.
2. 4-bit `0111+0001` → carry propagates through three stages. L2.
3. Identify the first generate/kill stage in an 8-bit trace. L4.

**Validation.** Per-stage oracle plus whole-vector modular sum.

### Family `carry_lookahead`

**Task.** Compute bit/group generate and propagate signals and carries.

**Response.** Named `Gi`, `Pi`, and carry fields.

**Template.** `Using P={declared_definition} and G=A·B, compute the carries.`

**Generation.** Two- and four-bit blocks; explicitly choose `P=A⊕B` or `P=A∨B`.

**Derivation.** Expand `C_{i+1}=G_i+P_iC_i`.

**Examples.**

1. One bit with `A=B=1` → generate. L2.
2. Four-bit group-propagate calculation. L3.
3. Determine whether incoming carry reaches group output. L4.

**Validation.** Compare lookahead equations with ripple addition for all small input patterns.

### Family `subtraction_and_flags`

**Task.** Trace an adder-subtractor and classify carry/borrow, zero, negative, and signed overflow.

**Response.** Result bit vector plus named flags.

**Template.** `The circuit computes A + (B XOR SUB) + SUB. For {inputs}, find result and flags.`

**Generation.** Width 2–8; flags follow a displayed convention.

**Examples.**

1. `SUB=1`, `0101−0011` → `0010`. L1.
2. Unsigned `0010−0101` → wrapped result and borrow classification. L2.
3. Signed `0111+0001` at 4 bits → overflow without confusing carry. L3.

**Validation.** BigInt bit-vector oracle and independent sign-rule overflow check.

### Family `alu_control_trace`

**Task.** Determine the output and flags of a small ALU under a displayed control word.

**Response.** Function name, result, and flags.

**Template.** `{control_table}; A={A}, B={B}, control={code}. Find Y and flags.`

**Generation.** Functions ADD/SUB/AND/OR/XOR/pass/shift; widths 4–16.

**Constraints.** The control table is always visible; the exercise tests selection and behavior, not invented-opcode recall.

**Examples.**

1. Control selects AND for `1010,1100` → `1000`. L1.
2. SUB produces zero and sets Z. L2.
3. Control decomposed into invert-B, Cin, operation, and output-invert signals. L4.

**Validation.** Function-table dispatch and independent selected-operation oracle.

### Family `barrel_shifter_route`

**Task.** Trace a staged mux-based shifter or choose controls for a requested shift/rotate.

**Response.** Result and stage-control bits.

**Generation.** Width 4–16, stages for shifts 1/2/4/8; logical, arithmetic, rotate explicitly selected.

**Examples.**

1. 4-bit left shift by 1. L1.
2. 8-bit shift by 5 activates stages 1 and 4. L2.
3. Arithmetic-right versus rotate-right result on a negative bit pattern. L3.

**Validation.** Bit-vector operation and per-stage mux-network comparison.

## 5. Category: Storage, clocks, and sequential timing

### Category purpose

Train the central distinction between combinational value and stored state, then make synchronous timing constraints concrete.

### Learn

A latch is level-sensitive; a flip-flop samples on an edge. All flip-flops in one synchronous state update conceptually at once. Correct logic values are insufficient if data arrives too late for setup or changes too soon for hold.

### Common misconceptions

- Updating flip-flops one at a time and feeding new state into the same edge.
- Treating a D latch as edge-triggered.
- Confusing synchronous and asynchronous reset.
- Applying clock enable before reset despite declared priority.
- Adding every gate delay instead of the critical path.
- Assuming a slower clock fixes hold time.

### Family `latch_trace`

**Task.** Trace an SR or D latch over a small level-sensitive waveform.

**Response.** Q per interval and invalid/hold/open state.

**Generation.** D latches first; gated SR later; intervals avoid ambiguous simultaneous changes unless explicitly analyzed.

**Examples.**

1. D latch `EN=1,D=1` → Q becomes 1. L1.
2. `EN=0` while D changes → Q holds. L1.
3. SR latch enters forbidden input under declared NOR/NAND implementation. L3.

**Validation.** Interval event simulation and truth-table cross-check.

### Family `flip_flop_next_state`

**Task.** Compute D/T/JK flip-flop next state from current state and inputs.

**Response.** `Q_next`.

**Examples.**

1. D=0 → next Q=0. L1.
2. T=1,Q=1 → next Q=0. L1.
3. JK=11 toggles; include active enable/reset priority. L3.

**Validation.** Exhaustive characteristic tables.

### Family `register_edge_trace`

**Task.** Trace a multi-bit register across clock edges with enable and reset.

**Response.** State after each edge.

**Template.** `Given the waveform/table, fill Q after edges E1...En.`

**Generation.** 2–8 bits, 3–8 edges, sync/async reset stated.

**Examples.**

1. Enabled D register captures `1010`. L1.
2. Disabled edge holds old value. L2.
3. Async reset asserted between edges changes Q immediately. L3.

**Validation.** Event-ordered simulator; ensure waveform and table encode identical events.

### Family `shift_register_trace`

**Task.** Trace serial/parallel input and output through a shift register.

**Response.** Register contents and emitted bit sequence.

**Generation.** SISO/SIPO/PISO, left/right direction, explicit bit-entry end.

**Examples.**

1. 4-bit right shift, serial-in 1. L1.
2. Shift the sequence `1,0,1` into an empty SIPO. L2.
3. Parallel load then serial extraction with enable pauses. L3.

**Validation.** Exact array shift simulation.

### Family `counter_trace`

**Task.** Trace or design a binary/modulo/up-down counter.

**Response.** State sequence, terminal count, or next-state logic choice.

**Generation.** 2–6 bits; synchronous counters dominate; ripple counters explicitly labeled.

**Examples.**

1. 2-bit up counter from `10` for three edges → `11,00,01`. L1.
2. Mod-6 counter reset behavior. L2.
3. Up/down counter with enable and terminal-count output. L3.

**Validation.** State recurrence and reachability; reject ambiguous reset priority.

### Family `critical_path_delay`

**Task.** Find a combinational critical path and maximum delay.

**Response.** Path choice and time.

**Generation.** DAGs of 3–12 gates with per-type or per-instance delays.

**Derivation.** Longest-path dynamic programming from inputs to outputs.

**Examples.**

1. Two serial 2 ns gates → 4 ns. L1.
2. Compare parallel paths and select the longer. L2.
3. Reconvergent network with input arrival times. L4.

**Validation.** Independent DAG longest-path oracle and path-sum verification.

### Family `setup_hold_clock`

**Task.** Determine setup/hold satisfaction or maximum clock frequency for a register path.

**Response.** Time/frequency and pass/fail fields.

**Generation.** Declared `clk→Q`, combinational min/max, setup, hold, and skew.

**Examples.**

1. `1+6+2=9 ns` minimum period → `111.11 MHz`. L2.
2. Minimum data arrival `1.5 ns`, hold `1 ns` → pass. L2.
3. Positive skew helps setup but creates a hold violation under the normative convention. L4.

**Validation.** Direct inequality oracle; unit-normalization tests; explicitly verify that changing period cannot repair a hold violation.

### Family `hazard_glitch_trace`

**Task.** Identify a static hazard or trace a glitch under supplied gate delays.

**Response.** Hazard type, output event sequence, or redundant consensus term.

**Generation.** Small reconvergent SOP/POS networks with one input transition.

**Derivation.** Discrete transport-delay event simulation and Boolean consensus analysis.

**Examples.**

1. `AB + ¬AC` for a transition in A with `B=C=1` → static-1 hazard. L3.
2. Add consensus term `BC` to remove it. L4.
3. Equalized path delays produce no visible glitch under the supplied event model. L4.

**Validation.** Event simulator plus exhaustive before/after stable truth check.

## 6. Category: Finite-state machines

### Category purpose

Train systematic reasoning about next state, outputs, encodings, and sequence behavior.

### Learn

An FSM combines stored state with combinational next-state logic. Moore outputs depend only on state; Mealy outputs may also depend on current input. A trace applies the current state and input, observes the defined output timing, then updates state at the clock edge.

### Common misconceptions

- Producing next-state output before/after the wrong edge.
- Treating a Mealy output as state-only.
- Losing overlapping sequence matches.
- Assuming state names imply binary codes.
- Encoding unreachable states without a declared recovery rule.

### Family `fsm_transition_trace`

**Task.** Trace state across an input sequence.

**Response.** State before/after each edge.

**Generation.** 2–6 states, binary or small symbolic input, deterministic complete transition function.

**Examples.**

1. Two-state toggle-on-1 machine. L1.
2. Saturating counter state machine. L2.
3. Four-state machine with reset and an unreachable distractor. L3.

**Validation.** Deterministic transition simulation.

### Family `fsm_output_trace`

**Task.** Trace Moore or Mealy outputs with state.

**Response.** Output per interval/edge.

**Generation.** Output timing diagram states whether Mealy output is sampled before the edge.

**Examples.**

1. Moore output 1 only in state S2. L1.
2. Mealy edge label `input/output`. L2.
3. Compare Moore one-cycle-later indication with Mealy immediate indication. L3.

**Validation.** Semantic output function and waveform renderer agreement.

### Family `transition_table_diagram`

**Task.** Convert between state diagram, transition table, and next-state equations.

**Response.** Structured table or diagram choice.

**Generation.** 2–5 states; every transition accounted for.

**Examples.**

1. Fill one missing table cell from a diagram. L1.
2. Choose a diagram matching a complete table. L2.
3. Derive next-state bits for a fixed encoding. L4.

**Validation.** Normalize all forms to one transition relation and compare.

### Family `sequence_detector`

**Task.** Trace or complete a detector for a bit pattern, with overlap policy explicit.

**Response.** Detection outputs, missing transition, or matching FSM.

**Generation.** Patterns length 2–5; Moore/Mealy and overlap/no-overlap balanced.

**Examples.**

1. Detect `10` without overlap. L2.
2. Detect `101` with overlap in `10101` → two detections. L3.
3. Fill failure transition using longest suffix that is a pattern prefix. L4.

**Validation.** Compare FSM output with direct string-pattern oracle.

### Family `state_encoding`

**Task.** Apply or compare binary, one-hot, or supplied state encodings.

**Response.** Code assignments, flip-flop count, or encoded next state.

**Generation.** 3–8 states; fixed encoding when exact equations are requested.

**Examples.**

1. Minimum binary flip-flops for 5 states → 3. L1.
2. One-hot encoding for 5 states → 5 flip-flops. L2.
3. Trace an illegal code under a supplied recovery transition. L4.

**Validation.** Code uniqueness, width, and transition equivalence.

## 7. Category: Processor datapaths and control

### Category purpose

Connect an instruction’s architectural meaning to the data movements and controls that implement it.

### Learn

An instruction selects register operands, an ALU function, optional memory access, a destination, and the next PC. Control signals steer multiplexers and enable state elements. A multicycle processor performs the same architectural operation as a sequence of microoperations.

### Common misconceptions

- Confusing a register number with its stored value.
- Using the immediate as a destination.
- Writing a register for a store or branch.
- Reading memory at the wrong stage/address.
- Computing a branch target from the wrong PC base.
- Treating a disabled write-enable as writing zero.

### Family `instruction_field_decode`

**Task.** Split a displayed instruction word into fields and interpret them using a supplied format table.

**Response.** Named opcode/register/immediate fields.

**Generation.** PL16 formats with visible bit indices; binary/hex display.

**Examples.**

1. Extract `rd` from bits `[8:6]`. L1.
2. Sign-extend a displayed 6-bit immediate in an ADDI format. L2.
3. Identify which of two formats applies from opcode. L3.

**Validation.** Bit-slice oracle and re-encode round trip.

### Family `single_cycle_control`

**Task.** Set control signals for an instruction in a displayed single-cycle datapath.

**Response.** Structured control word.

**Signals.** Typical fields: `RegWrite`, `MemRead`, `MemWrite`, `ALUSrc`, `ResultSrc`, `Branch`, `Jump`, `ALUOp`.

**Examples.**

1. ADD → register operands, ALU add, write ALU result. L1.
2. LD → immediate address, memory read, memory-to-register writeback. L2.
3. BEQ → compare, no register write, conditional PC selection. L3.

**Validation.** Execute datapath under control word and compare architectural instruction semantics.

### Family `datapath_value_trace`

**Task.** Compute named values on a single-cycle datapath for one instruction.

**Response.** Register-port values, extended immediate, ALU inputs/output, memory/writeback value, and next PC.

**Generation.** Small exact register/memory states; only relevant nodes requested at early levels.

**Examples.**

1. `ADD R3,R1,R2` with values 4 and 5 → ALU/writeback 9. L1.
2. `LD R2,6(R1)` → effective address and loaded value. L2.
3. Taken BEQ → comparison result and target from `PC+2`. L3.

**Validation.** Datapath graph simulation and independent ISA-state transition.

### Family `multicycle_microoperations`

**Task.** Order or trace microoperations for a multicycle instruction.

**Response.** Ordered stages and intermediate-register values.

**Template.** `Using the displayed multicycle datapath, trace {instruction}.`

**Generation.** Fetch/decode/address/memory/execute/writeback sequences, 3–6 cycles.

**Examples.**

1. Fetch: `IR←M[PC]; PC←PC+2`. L1.
2. LD uses address calculation, memory read, register writeback. L2.
3. Compare LD and ST control sequences and identify shared prefix. L3.

**Validation.** Microoperation interpreter must reproduce architectural state.

### Family `branch_jump_pc`

**Task.** Determine sequential, branch, or jump next PC and the selecting condition.

**Response.** Target address, taken flag, next PC.

**Generation.** PL16 aligned addresses and signed instruction offsets.

**Examples.**

1. Not-taken branch at `0x0100` → `0x0102`. L1.
2. Offset `−3` means target `(PC+2)−6`. L2.
3. Select among branch/jump/exception PC sources under a priority table. L4.

**Validation.** Exact fixed-width address arithmetic and alignment checks.

### Family `control_failure_effect`

**Task.** Predict the architectural symptom of one incorrect/stuck control signal.

**Response.** State differences or affected instruction classes.

**Generation.** One fault at a time: RegWrite stuck low, MemWrite asserted, ALUSrc wrong, ResultSrc wrong.

**Examples.**

1. RegWrite stuck 0 → arithmetic result not committed. L2.
2. ALUSrc selects register instead of immediate for LD → wrong address. L3.
3. Determine which listed instruction is unaffected by MemRead stuck low. L4.

**Validation.** Differential simulation of correct and faulty datapaths over generated states; ensure claimed effect is observable.

## 8. Category: Pipelining and hazards

### Category purpose

Train cycle-accurate reasoning about overlapping instructions and the mechanisms that preserve architectural correctness.

### Learn

Pipelining improves throughput by overlapping stages; it does not make one instruction traverse fewer logical stages. Hazards arise from resource conflicts, data dependencies, and control changes. Forwarding uses a value as soon as it exists; a stall waits; a flush discards wrong-path work.

### Common misconceptions

- Equating pipeline depth with speedup for a short stream.
- Forwarding load data before MEM produces it.
- Stalling the producer rather than the consumer/front end.
- Forwarding to a store’s address but not its data, or vice versa.
- Counting flushed instructions as completed.
- Applying branch penalties without the declared resolution/prediction model.

### Family `pipeline_occupancy`

**Task.** Complete a stage-by-cycle pipeline diagram without hazards.

**Response.** Structured grid or completion cycle.

**Generation.** 2–8 instructions, 3–5 stages.

**Examples.**

1. Five stages, one instruction completes in cycle 5. L1.
2. Four independent instructions complete by cycle 8. L1.
3. Insert an explicit multi-cycle EX occupancy. L4.

**Validation.** Resource-capacity and stage-order simulator.

### Family `dependency_classification`

**Task.** Identify RAW, WAR, WAW, or no register dependency between instructions and whether it is a hazard in the declared in-order pipeline.

**Response.** Dependency type and hazard yes/no.

**Examples.**

1. Producer writes R1, next reads R1 → RAW. L1.
2. Earlier reads R2, later writes R2 → WAR dependency but no hazard in basic in-order P5. L3.
3. Loads/stores with same computed address create memory dependence. L4.

**Validation.** Def/use set analysis plus pipeline timing.

### Family `forwarding_selection`

**Task.** Choose the source of each ALU/store operand from register file or forwarding path.

**Response.** Named mux selections.

**Generation.** ALU-ALU, ALU-store, two competing producers, newest-writer priority.

**Examples.**

1. ADD result forwarded EX/MEM to next ADD. L2.
2. Two prior instructions write same register; forward newest. L3.
3. Store-data forwarding distinguished from address forwarding. L4.

**Validation.** Compare forwarded execution with sequential ISA oracle.

### Family `stall_insertion`

**Task.** Determine required bubbles/stalls for dependencies under listed forwarding paths.

**Response.** Stall count and pipeline grid.

**Generation.** Load-use, no-forwarding ALU dependencies, structural memory conflict variants.

**Examples.**

1. Full ALU forwarding, adjacent ADD dependency → 0 stalls. L2.
2. Adjacent LD-use in PL16-P5 → 1 stall. L2.
3. Unified single-ported memory creates IF/MEM structural stall. L4.

**Validation.** Cycle simulator must prevent every consumer from reading before availability.

### Family `control_hazard_flush`

**Task.** Trace branch prediction, resolution, flushes, and correct next fetch.

**Response.** Prediction correctness, flushed instructions, penalty, next PC.

**Generation.** Static not-taken/taken, resolution in ID/EX/MEM, short instruction streams.

**Examples.**

1. Not-taken branch under not-taken prediction → no flush. L2.
2. Taken branch resolved EX → flush IF and ID younger work. L2.
3. Compare earlier resolution with delayed resolution. L4.

**Validation.** Wrong-path instructions must never commit; compare final architectural state with sequential execution.

### Family `pipeline_cpi`

**Task.** Calculate cycles, CPI, or throughput for an instruction mix with stated penalties.

**Response.** Integer/rational/decimal.

**Template.** `Base CPI={x}; {frequency}% incur {penalty} cycles. Find CPI.`

**Generation.** Fill/drain effects for short streams; steady-state weighted penalties; cache/branch penalties later.

**Examples.**

1. Five-stage pipeline, 10 independent instructions → 14 cycles. L1.
2. Base 1 plus 20% branches × 2-cycle mispredict × 25% mispredict rate → `1.1`. L3.
3. Combine load-use and branch penalties with explicitly non-overlapping events. L4.

**Validation.** Exact rational expectation and discrete trace comparison for finite streams.

## 9. Category: Caches and physical memory

### Category purpose

Build exact address-to-cache reasoning and distinguish capacity, block size, associativity, replacement, and write behavior.

### Learn

The block offset chooses a byte inside a block, the set index chooses a set, and the tag identifies which memory block occupies a line. A hit requires a valid matching tag. Larger blocks exploit spatial locality; associativity changes placement conflicts but not total capacity by itself.

### Common misconceptions

- Using byte offset bits as set bits.
- Treating block number as byte address.
- Matching tag without checking valid bit.
- Assuming associativity changes block size.
- Updating LRU on misses only.
- Confusing write-back dirty eviction with write-through.
- Calling every repeated address a hit despite eviction.

### Family `cache_geometry`

**Task.** Derive block count, set count, offset/index/tag widths from capacity, block size, associativity, and address width.

**Response.** Multiple named integers.

**Examples.**

1. 1 KiB direct-mapped, 16-byte blocks → 64 sets, 4 offset bits, 6 index bits. L1.
2. Same capacity 4-way → 16 sets, 4 index bits. L2.
3. Solve capacity from field widths and associativity. L3.

**Validation.** Power-of-two identities and reconstructed capacity.

### Family `cache_address_split`

**Task.** Split an address into tag, set, and block offset.

**Response.** Fixed-width fields in binary/hex.

**Generation.** 8–32-bit toy addresses; bit indices always shown.

**Examples.**

1. 8-bit address, 4-byte block, 4 sets. L1.
2. Hex address split with 16-byte blocks and 16 sets. L2.
3. Recover possible addresses from tag/set and offset range. L4.

**Validation.** Bit slicing and reassembly.

### Family `cache_hit_miss_trace`

**Task.** Trace accesses through direct-mapped or set-associative cache.

**Response.** Hit/miss, set/tag, victim, and final table per access.

**Generation.** 3–12 accesses; locality, compulsory, conflict, and capacity patterns; initial state explicit.

**Examples.**

1. Empty cache first access → miss, repeat → hit. L1.
2. Two blocks map to same direct-mapped set and evict. L2.
3. 2-way LRU trace where third block selects victim. L3.

**Validation.** Independent cache simulators and cache invariants.

### Family `replacement_policy_trace`

**Task.** Compare or apply LRU, FIFO, or supplied replacement policy.

**Response.** Victim and updated order.

**Generation.** One set with 2–4 ways to isolate policy reasoning.

**Examples.**

1. 2-way LRU after accesses A,B,A then miss C → evict B. L2.
2. FIFO on same trace → evict A. L3.
3. Select an access sequence that makes LRU and FIFO differ. L5.

**Validation.** Policy-specific ordered state.

### Family `cache_write_policy`

**Task.** Trace write-through/write-back and write-allocate/no-write-allocate behavior.

**Response.** Hit/miss, cache update, dirty bit, and lower-memory transactions.

**Examples.**

1. Write-through hit → cache and memory written. L2.
2. Write-back hit → cache updated and dirty set. L2.
3. Dirty eviction plus no-write-allocate miss accounting. L4.

**Validation.** Cache/memory state equivalence after all required writebacks.

### Family `amat`

**Task.** Calculate average memory access time for a declared hierarchy.

**Response.** Time.

**Template.** `AMAT = hit time + miss rate × miss penalty`, extended recursively for multiple levels.

**Examples.**

1. `1 ns + 5%×40 ns = 3 ns`. L1.
2. Two cache levels with conditional L2 miss rate. L3.
3. Distinguish local from global miss rate. L4.

**Validation.** Exact probability tree; reject ambiguous overlapping latency models.

### Family `memory_array_organization`

**Task.** Derive capacity, address-line count, data width, chip count, or chip-select behavior for an SRAM/ROM-like memory organization.

**Response.** Multiple named integer fields or a chip-select choice.

**Template.** `Using {chip_geometry}, construct or analyze a memory with {target_geometry}.`

**Generation.** Power-of-two depths and widths; chips may be combined in parallel to increase word width or in banks to increase depth. Address decoding and byte enables are explicit at higher levels.

**Derivation.** A `2^n × w` chip stores `2^n` words of `w` bits and needs `n` intra-chip address bits. Parallel chips share address/control and concatenate data bits; deeper banks share low address bits while high bits select a bank.

**Distractors and feedback.** Add widths when depth should multiply, send high selector bits to every chip as local address, count bytes as bits, or confuse chip enable with output enable. Feedback separates depth expansion from width expansion.

**Examples.**

1. A `256×8` memory stores `2048` bits and uses 8 address lines. L1.
2. Two `1K×8` chips in parallel form `1K×16`. L2.
3. Build `4K×16` from `1K×8` chips → 8 chips: two per bank and four banks. L3.

**Validation.** Reconstruct total addressable words, word width, total bits, local-address mapping, and exactly one selected depth bank for every address.

### Family `memory_bank_row_trace`

**Task.** Map addresses to memory banks/rows or trace simplified DRAM row-buffer hits.

**Response.** Bank, row, column, row hit/miss.

**Generation.** Explicit address mapping and open-page policy.

**Examples.**

1. Low-order bank interleaving across sequential words. L2.
2. Same open row → row-buffer hit. L3.
3. Bank conflict versus parallel-bank accesses. L4.

**Validation.** Address mapping and per-bank open-row simulator.

## 10. Category: Virtual memory and protection

### Category purpose

Train the complete path from virtual address through TLB/page table to physical address and permission outcome.

### Learn

The page offset is unchanged by translation. The virtual page number indexes a translation; the physical page number replaces it. A TLB miss may still find a present page-table entry. A page fault means the required mapping is not presently usable, not merely that a cache was missed.

### Common misconceptions

- Translating the page offset.
- Calling every TLB miss a page fault.
- Treating a valid TLB entry as bypassing permissions.
- Using virtual-page number as a byte address into a page table without entry-size scaling.
- Concatenating page fields in the wrong order.
- Confusing not-present with read-only.

### Family `page_address_split`

**Task.** Split a virtual or physical address into page number and offset.

**Response.** Named fixed-width fields.

**Examples.**

1. 16-bit VA, 256-byte pages → 8-bit VPN/offset. L1.
2. 4 KiB pages → 12 offset bits. L1.
3. Determine page size from offset field. L2.

**Validation.** Bit slicing and reassembly.

### Family `single_level_translation`

**Task.** Translate a virtual address using a displayed page table.

**Response.** VPN, PPN, offset, physical address, or page fault.

**Examples.**

1. Present mapping VPN 3→PPN 9; preserve offset. L1.
2. Not-present PTE → page fault. L2.
3. Permission denies write despite presence. L3.

**Validation.** PTE lookup, permission, and concatenation oracle.

### Family `multilevel_page_walk`

**Task.** Trace indices and memory references in a small two- or three-level page table.

**Response.** Per-level index/PTE/address and final result.

**Generation.** 12–24-bit toy addresses; entry size/table-base arithmetic explicit.

**Examples.**

1. Split VPN into two 4-bit indices. L2.
2. Compute address of second-level PTE from table base plus index×entry size. L3.
3. Stop at an invalid intermediate entry. L4.

**Validation.** Semantic tree walk and flat-map translation comparison.

### Family `tlb_trace`

**Task.** Trace TLB hits/misses, replacement, and page-table walks.

**Response.** Hit/miss, PPN, victim, and walk required.

**Generation.** 2–8-entry direct/fully associative TLB, LRU/FIFO explicit.

**Examples.**

1. Empty TLB access → miss, table hit, fill. L1.
2. Same VPN later → TLB hit. L2.
3. Context/ASID distinction or replacement trace. L4.

**Validation.** TLB simulator plus page-table oracle; TLB entries never fabricated without valid mapping.

### Family `translation_access_outcome`

**Task.** Classify a memory access across TLB, page-table, permissions, and cache.

**Response.** Ordered outcome trace: TLB status, fault/protection result, PA, cache status.

**Generation.** One access with all hierarchy state shown; cache considered only if translation succeeds.

**Examples.**

1. TLB hit then cache hit. L2.
2. TLB miss, page-table present, fill, cache miss. L3.
3. TLB hit with read-only entry on write → protection fault, no cache access. L4.

**Validation.** Layered simulator enforces early termination and exact ordering.

## 11. Category: Performance, I/O, and multicore foundations

### Category purpose

Connect architectural mechanisms to measurable execution time and introduce bounded device/multicore state without drifting into product trivia.

### Learn

```text
CPU time = instruction count × CPI × clock period
         = instruction count × CPI / clock rate
```

Latency and throughput are different. Amdahl’s law limits whole-program speedup. Polling repeatedly asks a device; interrupts notify the CPU; DMA moves blocks without a CPU load/store for each word. Coherence tracks which cached copies are valid and writable.

### Common misconceptions

- Comparing clock rates without instruction count/CPI.
- Averaging speedups arithmetically.
- Confusing bandwidth with latency.
- Counting DMA as zero CPU involvement.
- Treating memory-mapped I/O as ordinary cacheable RAM without the supplied attributes.
- Confusing coherence with synchronization.
- Missing false sharing because threads use different variables in one block.

### Family `cpu_time_equation`

**Task.** Solve for CPU time, instruction count, CPI, clock rate, or speedup.

**Response.** Numeric with units.

**Examples.**

1. `10^6` instructions, CPI 2, 1 GHz → `2 ms`. L1.
2. Compare two machines with different instruction count/CPI/rate. L2.
3. Infer CPI from measured time and retired instructions. L3.

**Validation.** Exact rational dimensional arithmetic.

### Family `amdahl_speedup`

**Task.** Calculate total speedup or required accelerated fraction/factor.

**Response.** Exact/decimal.

**Template.** `Speedup=1/((1−f)+f/s).`

**Examples.**

1. Half program doubled → `1/(.5+.25)=1.333...`. L2.
2. Infinite acceleration of 80% → maximum speedup 5. L3.
3. Compare two optimizations affecting different fractions. L4.

**Validation.** Rational oracle, monotonicity/property tests.

### Family `latency_throughput_bandwidth`

**Task.** Distinguish and calculate operation latency, steady-state throughput, or transfer time.

**Response.** Time/rate and semantic choice.

**Examples.**

1. Pipeline accepts one item/cycle at 500 MHz → 500 Mitems/s. L1.
2. Transfer 64 KiB over 1 GiB/s plus fixed latency. L2.
3. Identify bottleneck in producer/link/consumer chain. L3.

**Validation.** Unit-aware rate equations and min-throughput bottleneck.

### Family `io_method_trace`

**Task.** Compare or trace polling, interrupt-driven I/O, and DMA under supplied event costs.

**Response.** CPU busy time, event order, transfer count, or best method under stated objective.

**Examples.**

1. Poll every 10 µs until device ready at 35 µs → checks at 0,10,20,30,40 under declared schedule. L2.
2. Interrupt incurs fixed handler cost after readiness. L3.
3. DMA setup plus completion interrupt versus programmed transfer of N words. L4.

**Validation.** Discrete-event schedule; prompt declares whether first poll occurs at time zero.

### Family `memory_mapped_io`

**Task.** Determine which address selects a device register and the effect of read/write controls.

**Response.** Device/register selection, transaction type, side effect.

**Generation.** Small address-decoder maps, alignment and width explicit.

**Examples.**

1. Address falls inside UART register range. L1.
2. Low address bits select one of four registers. L2.
3. Read-to-clear status register under supplied semantics. L3.

**Validation.** Range/decode oracle and device-state transition.

### Family `bus_arbitration`

**Task.** Trace grants and wait time under round-robin or fixed-priority arbitration.

**Response.** Granted requester per cycle and queue state.

**Generation.** 2–4 masters, 3–10 cycles, request arrivals explicit.

**Examples.**

1. Fixed priority chooses highest active request. L1.
2. Round robin resumes after last grant. L2.
3. Determine starvation possibility from a request stream. L4.

**Validation.** Policy simulator and fairness invariants where applicable.

### Family `coherence_state_trace`

**Task.** Trace a small MSI/MESI-like coherence protocol using the displayed transition table.

**Response.** Per-cache line state, bus transaction, and memory-owner status.

**Generation.** Two cores, one or two blocks, reads/writes/evictions; protocol table always visible.

**Examples.**

1. Both invalid; core 0 read → shared/exclusive per declared protocol. L3.
2. Core 1 read of modified line triggers supplied downgrade/writeback behavior. L4.
3. Core 0 write invalidates other shared copy. L4.

**Validation.** Protocol transition simulator; invariant that at most one cache holds a writable-exclusive state.

### Family `false_sharing`

**Task.** Determine whether accesses to distinct variables cause coherence traffic because they share a cache block.

**Response.** Same-block decision, invalidation count, or improved layout choice.

**Generation.** Explicit addresses/block size and two-core access sequence.

**Examples.**

1. Addresses 0x100 and 0x104 in a 64-byte block → same block. L2.
2. Alternating writes to different words in that block → false sharing. L3.
3. Choose padding/alignment that separates them while respecting given constraints. L4.

**Validation.** Address-to-block mapping and coherence trace; distinguish true sharing of one location from false sharing.

## 12. Cross-family progression

Recommended order:

1. direct gate output and truth tables;
2. gate networks and active-low notation;
3. representation translation and canonical SOP/POS;
4. muxes, decoders, comparators, and parity;
5. adder cells, ripple carry, flags, ALUs, and shifters;
6. latches, flip-flops, registers, shift registers, and counters;
7. critical paths and setup/hold after state elements are understood;
8. FSM traces before transition-table conversion or state encoding;
9. instruction fields before control words;
10. single-cycle value flow before multicycle microoperations;
11. hazard-free pipeline occupancy before forwarding/stalls/flushes;
12. cache geometry before access traces and write policies;
13. single-level translation before TLBs and multi-level walks;
14. performance equations after pipeline/cache mechanisms provide concrete causes;
15. I/O and coherence as bounded advanced categories.

Useful interleaving:

- gate truth tables with expression/schematic translation;
- active-low signals with decoder/memory enables;
- fixed-width status from numeracy with adder circuits;
- register edge traces with FSMs;
- datapath control with the corresponding assembly instruction;
- pipeline dependency classification with assembly register def/use;
- cache address splitting with low-level bit-field extraction;
- TLB/page fields with cache fields, while contrasting their meanings;
- performance equations immediately after the mechanism being measured.

Keep these separate until prerequisites are stable:

- hazards after basic pipeline occupancy;
- hold timing after setup/critical-path reasoning;
- K-map don’t-cares after canonical forms;
- coherence after single-cache traces;
- combined TLB/cache outcomes after each hierarchy is mastered alone.

## 13. Adaptive practice guidance

Track mastery by:

- category, family, and response direction;
- gate type, inversion location, fan-in, and network depth;
- truth-table density and representation pair;
- minimization law/group pattern;
- combinational block type and selector/code convention;
- arithmetic width, carry-chain shape, and signedness;
- state-element type, reset/enable priority, edge count, and timing constraint;
- FSM type, state count, overlap, and representation;
- instruction class, datapath node, and control signal;
- dependency type, producer distance, forwarding availability, and branch outcome;
- cache geometry, associativity, policy, locality pattern, and miss cause;
- page size, walk depth, TLB policy, and permission outcome;
- performance formula variable and mechanism;
- misconception identifier.

Failure routing:

| Error pattern | Follow-up |
|---|---|
| XOR answered like OR | gate truth rows where both inputs are 1 |
| ignores inversion bubble | one base gate with one highlighted bubble |
| active-low assertion reversed | paired level/asserted fields |
| mux input off by one | selector-to-index table before mux tree |
| invalid K-map group | adjacency/wraparound group validation |
| carry confused with overflow | same bit pattern interpreted unsigned and signed |
| sequentially updates registers on one edge | two-register swap demonstrating simultaneous update |
| thinks slower clock fixes hold | minimal hold inequality with varied period |
| Moore/Mealy output shifted a cycle | same transition rendered in both forms |
| store sets RegWrite | direct control-word contrast with load |
| branch base uses current PC | explicit `PC`, `PC+2`, offset table |
| forwards load from EX | load-use availability timeline |
| repeated address assumed hit | direct-mapped eviction contrast |
| TLB miss called page fault | present PTE after TLB miss |
| translates page offset | address field replacement exercise |
| clock rate alone determines speed | matched CPU-time tuples |
| coherence confused with locking | state trace that is coherent but still races |

Slow but correct traces should reduce item count while preserving the same dependency or conflict pattern. Multi-mechanism failures should route to the earliest incorrect layer.

Recommended mix:

- 35% weakest family/dimension;
- 25% spaced review;
- 20% misconception contrasts;
- 10% inverse/design tasks;
- 10% cross-layer transfer.

Do not infer mastery of a block from truth-table recognition alone; require both forward trace and at least one inverse/design or integration task.

## 14. Feedback and visualization requirements

Feedback should reveal the decisive structure:

- gate-by-gate values in topological order;
- highlighted inversion bubbles and active-low assertion;
- truth-table rows tied to minterms/K-map cells;
- mux selector path;
- carry values above each adder stage;
- old-state/next-state columns at every clock edge;
- highlighted critical path and timing inequality;
- FSM current/input/output/next rows;
- datapath path with active controls and numeric values;
- pipeline grid with producer, consumer, forwarded value, bubbles, and flushed cells;
- address bit-field brackets;
- cache/TLB table before and after each access;
- page-walk addresses and entries;
- performance equation with consistent units;
- coherence state transitions beside each bus event.

Incorrect feedback should diagnose a recognizable model:

- “You selected D3, but selector `10₂` chooses D2.”
- “Carry out is 1, but the signed operands have different signs, so signed overflow is impossible.”
- “All registers sample old state on the same edge.”
- “The load value is unavailable until the end of MEM.”
- “This is a TLB miss followed by a present page-table entry, not a page fault.”

Do not explain a result by saying merely that the simulator produced it.

## 15. Interaction and accessibility requirements

- Gate, datapath, and state diagrams have complete text/table equivalents.
- Every wire is keyboard-focusable when a question asks the learner to select it.
- Bus widths and bit indices are announced by assistive technology.
- Truth tables use real headers.
- Timing diagrams provide one column per event/edge in accessible form.
- Pipeline and cache grids support row/column navigation.
- Drag-to-connect or drag-to-order interactions have click and keyboard alternatives.
- Active-low state is conveyed by label and bubble, never color alone.
- `0`, `1`, `X`, and `Z` remain visually distinguishable.
- At narrow widths, diagrams may scroll or reflow only at block boundaries; wires must not become ambiguous.
- Control tables remain visible while answering datapath questions.

## 16. Implementation requirements

- Typed semantic graph for gates and combinational blocks.
- Exact bit-vector type backed by `BigInt` for widths above safe bitwise JavaScript operations.
- Topological combinational evaluator.
- Event-queue timing simulator for declared delay questions.
- Simultaneous-update sequential simulator.
- FSM representation independent of state names/geometry.
- Exact Boolean-equivalence engine by exhaustive enumeration up to the declared input cap.
- Exact-cover helper for four-variable K-map minima.
- Teaching-ISA interpreter independent of the datapath simulator.
- Pipeline simulator independently checked against sequential architectural execution.
- Cache, TLB, page-table, DRAM-bank, bus, and coherence models as versioned pure state machines.
- Exact rational arithmetic for CPI, AMAT, and speedup.
- Deterministic seeded generation.
- Structural signatures that ignore cosmetic wire layout, signal names, register names where renaming is semantic, and irrelevant numeric formatting.
- Backward construction for desired carry chains, hazards, cache conflicts, K-map groups, timing violations, and coherence events.
- Localized legends/templates separated from semantic control identifiers.
- No runtime HDL compiler, assembler, native execution, backend, or network dependency.

## 17. Automated validation

For every generated family:

- resolve every placeholder and label;
- verify answer format and units;
- ensure every choice is distinct after normalization;
- require exactly one correct choice unless multiple-answer semantics are explicit;
- verify worked solution against the semantic trace;
- reject repeated structural signatures in the recent-history window.

Logic/circuit validation:

- exhaustively enumerate supported gate and small-network inputs;
- compare formulas, truth tables, and circuits;
- verify K-map covers and literal minima;
- compare arithmetic circuits with bit-vector arithmetic;
- assert combinational DAG acyclicity.

Sequential/timing validation:

- compare characteristic-table and event simulation;
- verify simultaneous state update;
- check counter/FSM reachability and completeness;
- recompute critical paths independently;
- test setup/hold boundary equalities and skew sign;
- compare hazard event trace with stable Boolean behavior.

Processor/pipeline validation:

- re-encode/decode instruction fields;
- run datapath/microoperations and compare with ISA interpreter;
- validate control words for every instruction class;
- compare pipeline committed state with sequential state;
- assert no flushed or invalid instruction commits;
- verify every forwarded operand comes from the newest available producer;
- verify stalls are sufficient and minimal under the declared policy.

Memory validation:

- reconstruct capacity and address from split fields;
- run independent cache/TLB implementations on each trace;
- maintain valid/dirty/tag/replacement invariants;
- compare multilevel translation with a flat mapping;
- ensure fault/protection outcomes stop later accesses;
- verify coherence single-writer/multiple-reader invariants.

Performance/I/O validation:

- use exact units and rational arithmetic;
- compare analytic CPI/AMAT results with enumerated weighted events;
- verify discrete I/O/bus schedules;
- test Amdahl bounds and monotonicity.

Run at least 10,000 seeds per family/level, with additional exhaustive tests for all feasible small gate, adder, flip-flop, address-field, and protocol states. Test SVG/table rendering at narrow and wide viewports and verify locale changes never alter canonical answers.

## 18. Coverage requirements

- Every basic gate receives all decisive truth rows.
- XOR/XNOR and active-low notation recur often enough to prevent OR/inversion shortcuts.
- Tri-state buses balance driven, floating, equal-driver, and contention cases.
- Truth table, expression, and schematic directions are balanced.
- SOP/POS and K-map practice includes wraparound and don’t-care cases.
- Mux, decoder, encoder, comparator, and parity blocks all appear both alone and in small compositions.
- Carry chains include no carry, generation, propagation, and kill.
- Carry and signed overflow are regularly contrasted.
- D/T/JK behavior, reset, enable, and simultaneous update all recur.
- Setup and hold include pass, exact-boundary, and fail cases.
- FSMs balance Moore/Mealy and overlapping/non-overlapping detection.
- Every PL16 instruction class activates its relevant datapath/control paths.
- Pipeline practice balances no-hazard, forwarding, load-use, structural, and control cases.
- Cache practice balances compulsory, conflict, capacity, and policy-dependent outcomes.
- Memory-array organization covers both width expansion and depth/bank expansion.
- Direct-mapped and set-associative caches both recur.
- TLB hit, TLB miss/page present, page fault, and protection fault all recur distinctly.
- Performance questions vary the unknown rather than always asking for time.
- I/O includes polling, interrupt, and DMA comparisons under explicit goals.
- Coherence includes read sharing, write invalidation, dirty ownership transfer, and false sharing.
- Cross-layer questions introduce at most one unmastered mechanism.
- Cosmetic rewiring, renamed states, or changed addresses must not count as meaningful novelty.

## 19. Topic-level quality checklist

- [ ] The app forms a coherent bridge from signals to computer systems.
- [ ] Boundaries with numeracy, circuits, assembly, and algorithms are explicit.
- [ ] Every exercise uses a declared digital, timing, ISA, pipeline, or memory model.
- [ ] Schematics never hide connectivity in drawing geometry.
- [ ] Active-low notation is explicit.
- [ ] Bit widths and signedness are always known where relevant.
- [ ] Carry, borrow, and overflow conventions are not conflated.
- [ ] State updates are simultaneous unless a ripple/asynchronous model is stated.
- [ ] Clock edge, reset type, and enable priority are visible.
- [ ] Timing questions distinguish minimum and maximum delay.
- [ ] FSM output timing and overlap policy are explicit.
- [ ] Invented instruction encodings are displayed rather than expected from memory.
- [ ] Datapath answers reproduce the declared architectural semantics.
- [ ] Forwarding, branch resolution, and register-file timing are stated.
- [ ] Cache geometry, initial contents, replacement, and write policy are visible.
- [ ] TLB miss, page fault, and cache miss remain distinct.
- [ ] Performance equations use consistent units and event assumptions.
- [ ] Multicore questions use a displayed protocol.
- [ ] Distractors correspond to named misconceptions.
- [ ] Worked feedback exposes state/value flow.
- [ ] Every oracle is local and independently testable.
- [ ] Difficulty comes from reasoning, not diagram clutter or trace length.

## 20. Stable navigation

Recommended learner-facing categories:

1. Gates & Signals
2. Combinational Logic
3. Arithmetic Circuits
4. Registers & Timing
5. State Machines
6. Datapaths & Control
7. Pipelining
8. Caches & Memory
9. Virtual Memory
10. Performance, I/O & Multicore

Stable family identifiers are the backticked identifiers in this specification. Progress must be tracked below category level, especially by misconception, hardware model, representation direction, and policy variant.

Recommended app identifier and files:

```text
apps/digital-logic-computer-architecture/
specs/digital-logic-computer-architecture.md
dist/digital-logic-computer-architecture.html
dist/digital-logic-computer-architecture.sv.html
```
