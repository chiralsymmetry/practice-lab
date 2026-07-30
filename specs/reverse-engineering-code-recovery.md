# Reverse Engineering and Code Recovery — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, instruction/CFG/data-flow oracle, pseudocode-IR checker, disassembly renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Reverse Engineering and Code Recovery

### Topic goal

Develop disciplined static-analysis skills for recovering structure and behavior from small disassemblies. The learner should become able to:

- read a listing as addresses, instructions, operands, and control transfers rather than as undifferentiated text;
- find basic-block leaders and boundaries;
- construct and inspect control-flow graphs;
- distinguish conditional, unconditional, call, return, fallthrough, and indirect edges;
- recognize likely function entries, exits, tail calls, wrappers, and calling-convention roles;
- track stack-pointer changes, frame slots, saved registers, arguments, and local values;
- follow definitions, uses, constants, flags, ranges, liveness, and simple memory aliases;
- recover conditionals, loops, short-circuit expressions, switches, and branchless selections;
- infer plausible expressions, array/structure accesses, widths, signedness, and variable roles;
- recognize common compiler transformations without memorizing byte signatures;
- state what symbols, relocations, cross-references, and code patterns establish—and what they do not;
- construct a behaviorally justified pseudocode summary while preserving uncertainty and alternative explanations.

The emphasis is several-instruction and whole-function reasoning. Single-instruction execution remains the responsibility of the assembly-practice apps.

### Relationship to neighboring Practice Lab topics

- **AMD64 Assembly Practice** supplies exact instruction, flag, stack, and System V ABI semantics.
- **6502 Assembly Practice** supplies a smaller contrasting ISA but is not the initial recovery profile.
- **Programmer Low-Level Numeracy** supplies fixed-width arithmetic, bit interpretation, and addresses.
- **Digital Logic and Computer Architecture** explains how instructions and memory are implemented.
- **C++ Mental Execution** supplies source-level control flow, values, and language rules.
- **Admin Practice** may teach command-line tools, but this app teaches analysis of the produced listing.

This topic owns the layer between machine execution and source-like structure. “Interpret these bytes” alone is assembly/encoding practice; “what blocks, data flow, constructs, and behavior does this listing support?” is code recovery.

### Audience and prerequisites

The intended learner ranges from a confident assembly beginner to an intermediate static analyst.

Expected prerequisites:

- hexadecimal and signed/unsigned fixed-width values;
- registers, memory operands, flags, `cmp/test`, conditional branches, `call`, `ret`, and stack growth;
- the basic System V AMD64 integer calling convention;
- elementary source constructs such as `if`, loops, arrays, functions, and return values.

Every question may link to a refresher. Early levels annotate instruction effects and ABI roles so the app can also consolidate assembly knowledge without becoming an opcode quiz.

### Concrete v1 machine and binary profile

The initial profile ID is:

```text
amd64-sysv-elf64-static-v1
```

It pins:

- AMD64 64-bit long mode;
- System V AMD64 ABI;
- ELF64-like symbols, sections, relocations, and imports;
- little-endian byte-addressed memory;
- LP64 data model;
- canonical Intel syntax;
- integer/pointer general-purpose instructions from the AMD64 Assembly Practice subset;
- direct control flow, bounded indirect target sets, and ordinary near calls/returns;
- static analysis only;
- exact instruction boundaries supplied by validated fixture metadata.

The architecture semantics inherit `amd64-long-sysv-v1` from the AMD64 assembly specification. If the two documents differ, this spec narrows the allowed instruction set but does not redefine an instruction.

A future profile may add AArch64/AAPCS64 or 6502, but no question may silently mix instruction semantics, ABI, object format, or compiler conventions. Architecture-neutral families operate on normalized metadata while rendering one named concrete profile.

### Listing contract

A listing row has:

```text
ListingRow {
  address
  bytes?          // optional display; always present in oracle metadata
  length
  instructionAST
  symbol?
  relocation?
  sourceHint?     // only in explicitly scaffolded questions
}
```

Canonical rendering:

```text
0000000000401000:  85 ff          test edi, edi
0000000000401002:  7e 06          jle  0x40100a
0000000000401004:  8d 47 ff       lea  eax, [rdi-1]
0000000000401007:  c3             ret
0000000000401008:  ...
```

Addresses and bytes are hexadecimal. Instruction width is obtained from metadata, not guessed by character count. Labels are semantic aliases for addresses; relocating the fixture changes displayed addresses and resolved PC-relative operands but not its structural answer.

### Instruction and state contract

The instruction subset initially includes:

- `mov`, `movzx`, `movsx/movsxd`, `lea`;
- `add`, `sub`, `inc`, `dec`, `neg`, controlled `imul`;
- `and`, `or`, `xor`, `not`, `test`;
- controlled shifts;
- `cmp`;
- direct and bounded indirect `jmp`;
- the conditional jumps defined in the AMD64 assembly spec;
- `cmovcc` and `setcc` in explicitly taught recovery families;
- `push`, `pop`, `call`, `leave`, `ret`;
- `nop` and alignment padding as metadata;
- controlled RIP-relative loads/addresses.

Every consumed register, flag, and memory location is initialized or represented as an explicit symbolic input. Undefined architectural flags remain unknown. A branch that consumes an undefined/unknown flag has an unknown successor unless the task is to identify that uncertainty.

The app does not execute native code. A table-driven JavaScript interpreter operates on the controlled instruction AST.

### Intraprocedural control-flow contract

A basic block is a maximal sequence of decoded instructions with:

- one entry at its first instruction;
- no branch target in its interior;
- no intraprocedural branch, return, tail-call, or nonreturning transfer before its final instruction; an ordinary returning call may occur inside the block;
- one or more explicitly modeled successor edges only from the terminator/fallthrough rule.

Leaders are:

1. the function entry;
2. every resolved direct branch target inside the function;
3. every resolved indirect target supplied by metadata;
4. the instruction following a conditional/unconditional branch, return, tail call, or known nonreturning call when it is decoded and inside the function, even if unreachable;
5. a separately referenced instruction entry established by symbol/relocation metadata.

Ordinary direct `call` does not end an intraprocedural basic block in this teaching profile. Its return-site instruction is not a leader solely because it follows a call. A nonreturning call, tail call, or exceptional transfer is only modeled when metadata explicitly identifies it.

Terminator successors:

| Terminator | Intraprocedural successors |
|---|---|
| ordinary non-branch instruction | next instruction |
| conditional branch | taken target and fallthrough |
| unconditional direct jump | target |
| bounded indirect jump | declared target set |
| return | none |
| ordinary call | fallthrough after the call; call edge is shown separately |
| known nonreturning call | none |
| tail call | no intraprocedural successor; interprocedural call/tail edge |

Exception, signal, long-jump, and asynchronous edges are excluded.

### Function and ABI recovery contract

Function boundaries are facts only when supplied by trusted symbol/section fixture metadata. Otherwise they are hypotheses supported by evidence such as:

- direct call targets;
- valid entry decoding;
- stack/ABI behavior;
- reachability;
- padding/alignment;
- independent references;
- returns or tail calls.

A prologue is evidence, not a requirement. Leaf functions, frame-pointer omission, shrink wrapping, shared epilogues, tail calls, and inlining mean familiar byte patterns cannot be universal boundary rules.

System V integer/pointer arguments use `RDI, RSI, RDX, RCX, R8, R9`; return uses `RAX`; saved-register and alignment rules match the assembly spec. Calls may clobber caller-saved registers and flags unless the fixture supplies a more precise summary.

### Stack-frame contract

On ordinary function entry:

```text
entryRSP = SP0
[SP0]    = return address
SP0 mod 16 = 8
```

Stack state is tracked symbolically as deltas from `SP0`. A frame slot is an interval `{base, offset, width, lifetime, roleHypothesis}`. Overlapping intervals may alias; equal textual offsets using different frame bases are not assumed equal until normalized.

Initial generated functions use constant stack adjustments. Dynamic `alloca`, stack probing, split stacks, asynchronous unwinding, exception landing pads, and red-zone values live across calls are excluded. Frame-pointer omission is included. Stack canaries may appear as an explicitly taught compiler/runtime idiom with the guard source and failure call already annotated as trusted fixture metadata.

### Data-flow and memory contract

Each instruction exposes exact:

```text
reads
writes
flagReads
flagWrites
memoryReads
memoryWrites
```

Register writes respect subregister overlap and 32-bit zero extension. Calls use their declared summaries. Data-flow families operate on the control-flow graph with:

- reaching definitions as may-sets;
- liveness as may-be-used-before-redefinition;
- constants and intervals joined conservatively;
- `unknown` when paths disagree beyond the active abstract domain;
- memory objects identified by base object plus byte interval.

Two accesses are definitely disjoint only when their objects differ or their same-object byte intervals do not overlap. They definitely alias only when normalized object and interval are identical. Otherwise the answer is `may alias`.

### Recovered pseudocode IR

The app never grades unrestricted C. Source-like answers use:

```text
Function(params, locals, body)

Statement :=
  Assign | Store | If | While | DoWhile
  Break | Continue | Return | CallStmt

Expression :=
  Var | Const | Load | AddressOf | Cast
  Unary | Binary | Compare | Select | CallExpr
```

Every expression has width and signedness metadata. Memory loads/stores retain width and base-object identity. Boolean short-circuiting is structural; it is not flattened to eager bitwise operations.

Normalization permits alpha-renaming of synthetic variables, harmless parenthesization, canonical commutative operand ordering where valid, and equivalent negated conditions. It does not erase signedness, width, side-effect order, overflow behavior, aliasing, or short-circuit semantics.

### Meaning of “intent”

Disassembly generally cannot reveal original:

- variable and function names;
- comments;
- source language or exact syntax;
- typedefs, class names, or signedness not manifested in behavior;
- whether an optimization was written by the programmer or introduced by a compiler;
- business purpose beyond the observable inputs, effects, calls, and outputs.

Therefore graded “intent” means one of:

1. an exact structural fact;
2. a behavioral summary over the declared input domain;
3. a controlled pseudocode AST equivalent under the fixture semantics;
4. a ranked hypothesis with cited evidence;
5. `insufficient evidence` or a set of accepted alternatives.

Feedback must say “this function computes/behaves like…” rather than “the programmer wrote…” unless source provenance is explicitly supplied.

### Compiler-fixture contract

Fixtures originate from small reviewed semantic templates such as:

```text
abs, min, max, clamp
is_power_of_two
sum_array, count_matches, find_first
bounded_string_length
array_index, structure_field_update
if/else, while, do/while, counted_loop
short_circuit_and/or
small switch
wrapper, tail call, helper call
```

Build-time pipelines may compile templates with pinned compiler/version/flags, disassemble them with pinned tools, and compare them against the independent semantic oracle. The standalone page bundles only validated listing metadata and the JavaScript analysis oracle. It contains no compiler, native executor, backend, or runtime network dependency.

Compiler output is evidence that a fixture is realistic, not the definition of its meaning. Every accepted pseudocode answer must also pass structural and behavioral validation.

### Evidence and confidence

Every recovery claim stores:

```text
Claim {
  proposition
  status: established | supported | possible | contradicted | insufficient
  evidence[]
  counterevidence[]
  assumptions[]
}
```

Trusted symbols/relocations establish only their specified facts. Debug names are excluded from ordinary recovery questions. A string cross-reference supports a relationship but does not prove full function purpose. A common idiom supports a hypothesis but may have other equivalent sources.

### Safety, legality, and content policy

The app uses only synthetic, public-domain, or explicitly licensed benign fixtures. It must not include or solicit:

- arbitrary uploaded binaries;
- real malware, ransomware, spyware, credential theft, persistence, command-and-control, or evasion;
- exploit development, vulnerability weaponization, ROP construction, shellcode, or memory-corruption payloads;
- authentication, authorization, payment, license, DRM, anti-cheat, or device-lock bypass;
- anti-debugging/anti-analysis implementation, packer unpacking, or obfuscation intended to conceal harmful behavior;
- extraction of secrets, personal data, proprietary algorithms, or copyrighted program assets;
- target attribution or claims about an identifiable developer based on binaries.

Benign defensive recognition may label an already described unsafe pattern only in a separately reviewed future module. The core app is about program structure and code recovery, not defeating protections.

### Scope

The topic includes:

- listing fields, instruction extent, targets, fallthrough, and read/write roles;
- code/data/alignment distinctions when fixture metadata makes them decidable;
- basic blocks, CFG edges, reachability, predecessors, dominators, back edges, and natural loops;
- function candidates, calls, exits, prologues/epilogues, tail calls, wrappers, and ABI roles;
- stack deltas, frame slots, frame-pointer omission, saved state, and canary recognition;
- reaching definitions, use–def chains, constants, ranges, liveness, dead writes, flags, and simple aliases;
- recovery of structured conditionals, loops, short circuiting, switches, jump tables, and conditional moves;
- expression, signedness/width, array, structure, pointer, bitmask, and bounded string-scan hypotheses;
- common optimization idioms and alternate-source awareness;
- symbols, relocations, imports, cross-references, indirect target sets, confidence, and evidence audits;
- whole-function summaries and structured pseudocode for functions normally containing 2–20 basic blocks and 3–80 instructions.

### Exclusions

Do not include initially:

- unrestricted raw-byte disassembly, recursive traversal over unknown blobs, or guessing an ISA/mode;
- malformed/overlapping x86 instruction streams, intentional desynchronization, packed or self-modifying code;
- exception handling, C++ RTTI/vtables, virtual dispatch, templates, closures, coroutines, TLS, varargs, or aggregate ABI classification;
- floating point, SIMD/vector, atomics, concurrency, syscalls, privileged code, or kernel binaries;
- dynamic tracing, emulation of operating systems, debugging live processes, decompiling arbitrary files, or patching binaries;
- link-time optimization across many functions, whole-program points-to analysis, or interprocedural recursion beyond supplied call summaries;
- exact source reconstruction, unrestricted type recovery, name recovery, or natural-language intent grading;
- compiler/version fingerprinting as fact from a short idiom;
- performance conclusions from static instruction count;
- unbounded loops or path explosion in learner-facing simulation;
- questions whose answer depends on unspecified memory, undefined flags, external state, or implementation folklore.

### Global answer conventions

- Addresses use hexadecimal; surrounding whitespace and hex letter case are ignored.
- Address answers normalize optional leading zeroes and `0x`; width-sensitive values retain their declared width.
- Instruction and register names are case-insensitive; semantic operand order remains significant.
- Block answers use stable block IDs backed by start addresses.
- Sets of blocks, edges, definitions, or targets are order-insensitive; paths and instruction sequences are ordered.
- An edge answer is `{sourceBlock, targetBlock, kind}`.
- Stack offsets are signed byte offsets from the named base (`SP0`, current `RSP`, or `RBP`).
- Pseudocode is submitted through structured AST/chips. Free text may be a learner note but is not graded.
- Equivalent conditions such as `x >= y` and `!(x < y)` are accepted only after width/signedness and side effects are proven identical.
- `unknown`, `may alias`, `possible`, and `insufficient evidence` are first-class answers, never treated as failure to guess.
- Symbols are matched by semantic ID when names are shown; original names are never required unless directly present in the listing.

### Difficulty philosophy

Difficulty should increase through:

- fewer annotations and weaker symbolic cues;
- more basic blocks and merge points;
- indirect rather than immediate dependence;
- multiple reaching definitions;
- signed/unsigned and width-sensitive distinctions;
- frame-pointer omission and shared epilogues;
- compiler transformations that preserve behavior while obscuring source shape;
- alternative valid structures or hypotheses;
- combining CFG, data flow, stack, and ABI evidence;
- moving from selecting a summary to constructing a pseudocode AST.

It must not increase through giant listings, obscure opcodes, unreadable addresses, deliberate disassembler desynchronization, malicious obfuscation, arbitrary compiler trivia, hidden calling conventions, time pressure, or expecting exact original source.

### Shared generation and rejection rules

Generate the source-independent semantic program and normalized CFG first, then realize a validated instruction listing. Reject an instance when:

- any instruction is illegal, ambiguously sized, or outside the active profile;
- any consumed architectural state is neither initialized nor explicit symbolic input;
- a direct target is not an instruction boundary;
- CFG successors disagree with terminator semantics;
- an ordinary unique-answer task has multiple valid parses/summaries;
- a supposedly ambiguous task fails to include the complete accepted set;
- an optimization changes behavior in the declared fixed-width domain;
- a call summary omits a read, write, clobber, return, or nonreturn property needed by the answer;
- stack accesses escape mapped fixture objects;
- a pseudocode candidate changes side-effect order, width, signedness, or short-circuit behavior;
- an intent label depends on names or real-world assumptions rather than observable behavior;
- a distractor is behaviorally equivalent to the answer;
- the example resembles prohibited operational content;
- the explanation cannot cite exact listing/CFG/data-flow evidence;
- the structural signature duplicates another active question.

## 2. Category: Reading disassembly listings

### Category purpose

Train accurate extraction of addresses, instruction extents, targets, and local effects before higher-level interpretation.

### Learn

A listing row has an address, encoded bytes, and one decoded instruction. The next sequential address is `address + length`. Direct branch displacements are resolved by the fixture. Read and write sets—not mnemonic resemblance—tell later analysis what values flow.

### Prerequisites

Hexadecimal arithmetic and the AMD64 register/instruction subset.

### Category boundaries

This category stays local to one or a few rows. Block formation begins in Category 3; raw arbitrary-byte decoding is excluded.

### Subcategories

1. Listing coordinates
2. Targets and fallthrough
3. Instruction roles and state effects
4. Code/data and alignment evidence

### Common misconceptions

- Every printed line is one byte.
- A branch target is its displacement or the address of the branch itself.
- A call has no fallthrough address.
- `cmp` writes its destination.
- `lea` reads memory.
- Any bytes in an executable section must be instructions.

### Family `listing_field_read`

**Task.** Extract address, bytes, length, mnemonic, or operands from a row. **Response/template.** Named fields.

**Derivation.** Read normalized listing metadata. **Difficulty.** L1 one field; L2 several rows; L3 prefixes/long immediates with exact column alignment.

**Misconceptions/constraints.** Typography never encodes the answer by color alone. **Feedback.** Highlight the requested column and semantic value.

**Examples.** 1. `401000: 31 c0 xor eax,eax` → address `0x401000`. L1. 2. bytes `48 83 ec 08` → length 4. L1. 3. `lea eax,[rdi+4]` → destination `eax`, source address expression. L2.

**Validation/coverage.** Rendered row round-trips to its metadata.

### Family `listing_instruction_extent`

**Task.** Mark the byte interval occupied by a decoded instruction. **Response/template.** Start/end or byte selection.

**Derivation.** Interval is `[address,address+length)`. **Difficulty.** L1 one row; L2 adjacent variable lengths; L3 find instruction containing a supplied byte address.

**Misconceptions/constraints.** End is exclusive in feedback; no overlapping decoding. **Feedback.** Draw byte ruler.

**Examples.** 1. address `0x1000`, length 3 → bytes `0x1000..0x1002`. L1. 2. next row begins `0x1007` after a 5-byte row at `0x1002`. L2. 3. byte `0x2004` lies inside row `[0x2002,0x2006)`. L2.

**Validation/coverage.** Sorted intervals are disjoint and next addresses agree.

### Family `listing_direct_target`

**Task.** Resolve a displayed direct branch/call target. **Response/template.** Address input or target-row selection.

**Derivation.** Use resolved target metadata or `nextRIP + signed displacement` when that arithmetic is the lesson. **Difficulty.** L1 symbolic target; L2 forward displacement; L3 negative displacement.

**Misconceptions/constraints.** Prompt supplies length/displacement encoding; no arbitrary x86 decoding. **Feedback.** Show next RIP then signed addition.

**Examples.** 1. `jmp 0x401020` → `0x401020`. L1. 2. next RIP `0x1005`, displacement `+0x0b` → `0x1010`. L2. 3. next RIP `0x2020`, displacement `-0x18` → `0x2008`. L2.

**Validation/coverage.** Target equals an instruction boundary or declared external symbol.

### Family `listing_fallthrough_address`

**Task.** Find the sequential/fallthrough address and decide whether it is reachable. **Response/template.** Address plus yes/no/conditional.

**Derivation.** Compute `address+length`; apply instruction control semantics. **Difficulty.** L1 ordinary/conditional; L2 call/unconditional jump; L3 known noreturn call.

**Misconceptions/constraints.** Physical next row and CFG successor are distinct. **Feedback.** State both next address and reachability rule.

**Examples.** 1. conditional at `0x1000` length 2 → fallthrough `0x1002`. L1. 2. direct `jmp` has next row but no fallthrough edge. L2. 3. ordinary `call` returns to next instruction in intraprocedural model. L2.

**Validation/coverage.** Control class determines fallthrough independently of layout.

### Family `listing_instruction_role`

**Task.** Classify an instruction as computation, memory access, comparison, control transfer, call, return, or padding. **Response/template.** Single choice.

**Derivation.** Map instruction AST/opcode metadata to semantic role. **Difficulty.** L1 obvious; L2 `lea/test`; L3 multi-role primary-purpose distinction.

**Misconceptions/constraints.** `lea` is address computation; `test` is comparison-like flag production. **Feedback.** List architectural effects.

**Examples.** 1. `add eax,3` → computation. L1. 2. `test edi,edi` → comparison/flag production. L2. 3. `call helper` → call plus control transfer, canonical role `call`. L2.

**Validation/coverage.** Role table covers every active opcode.

### Family `listing_read_write_set`

**Task.** Identify registers, flags, and memory read/written by one instruction. **Response/template.** Structured sets.

**Derivation.** Query exact instruction semantics including partial-register effects. **Difficulty.** L1 move; L2 arithmetic/addressing; L3 stack/call.

**Misconceptions/constraints.** Address registers are reads; `cmp` writes flags; `lea` does not read memory. **Feedback.** Separate inputs, address inputs, and outputs.

**Examples.** 1. `mov eax,[rdi]` reads RDI/memory, writes RAX. L2. 2. `cmp ecx,edx` reads ECX/EDX, writes arithmetic flags. L1. 3. `push rbx` reads RBX/RSP, writes RSP and stack memory. L3.

**Validation/coverage.** Interpreter access log equals static metadata.

### Family `listing_flag_chain`

**Task.** Link a conditional consumer to the instruction that defines its relevant flags. **Response/template.** Producer-row selection plus flag names.

**Derivation.** Walk backward within the block through instructions preserving/overwriting each needed flag. **Difficulty.** L1 adjacent `cmp`; L2 preserving instruction; L3 partial flag writes/unknown.

**Misconceptions/constraints.** Nearest arithmetic instruction may not define every flag. **Feedback.** Draw per-flag def-use arrows.

**Examples.** 1. `cmp eax,ebx; jl L` → `cmp`, SF/OF. L1. 2. `cmp; mov; je` → `cmp` still defines ZF. L2. 3. undefined required flag → producer exists but outcome unknown. L3.

**Validation/coverage.** Per-flag reaching-definition oracle.

### Family `listing_address_purpose`

**Task.** Distinguish an effective address used as a value from one dereferenced as memory. **Response/template.** Address/load/store classification plus expression.

**Derivation.** Inspect operand kind and `lea` semantics. **Difficulty.** L1 `lea` versus `mov`; L2 indexed address; L3 RIP-relative address versus loaded pointer.

**Misconceptions/constraints.** Brackets in Intel syntax are interpreted by opcode/operand semantics. **Feedback.** State whether memory is touched.

**Examples.** 1. `lea rax,[rdi+8]` → address value, no load. L1. 2. `mov eax,[rdi+8]` → 4-byte load. L1. 3. RIP-relative `lea` gets object address while `mov` loads its contents. L2.

**Validation/coverage.** Memory access log distinguishes paired fixtures.

### Family `listing_code_data_padding`

**Task.** Classify a labeled region as decoded code, referenced data, or alignment padding from supplied evidence. **Response/template.** Region choice plus decisive evidence.

**Derivation.** Use trusted section/relocation/reference metadata and reachability; bytes alone are not decisive. **Difficulty.** L2 symbol/section; L3 embedded jump table; L4 insufficient evidence.

**Misconceptions/constraints.** Executable-section membership is evidence, not proof. **Feedback.** Rank the available evidence.

**Examples.** 1. branch target with valid decoded rows → code. L2. 2. relocation-referenced table of addresses → data. L3. 3. unreferenced zero bytes between aligned functions → supported padding, not established without metadata. L3.

**Validation/coverage.** Answer status matches fixture provenance.

### Family `listing_alignment_audit`

**Task.** Find the first invalid row/target in a proposed listing. **Response/template.** Row selection and reason.

**Derivation.** Check contiguous extents, instruction boundaries, target validity, operand legality, and mode. **Difficulty.** L1 overlap/gap; L2 target into instruction; L3 wrong length cascades.

**Misconceptions/constraints.** Exactly one injected root fault; downstream shifts are consequences. **Feedback.** Reconstruct valid boundaries.

**Examples.** 1. two rows overlap one byte → invalid extent. L1. 2. jump targets middle of a decoded instruction → invalid fixture. L2. 3. one wrong length causes all later addresses to drift → identify first row. L3.

**Validation/coverage.** Mutation tests for every listing invariant.

### Cross-family progression

Read fields and extents first, then targets and fallthrough. Add read/write and flag chains before code/data evidence and listing audits.

## 3. Category: Basic blocks and control-flow graphs

### Category purpose

Train recovery of intraprocedural control structure from branch and target relationships.

### Learn

A basic block has one entry and no internal control transfer. Leaders include the function entry, branch targets, and decoded instructions after branches. A conditional branch has taken and fallthrough successors; a return has none. Calls are shown separately and do not split ordinary intraprocedural blocks in this profile.

### Prerequisites

Instruction extents, targets, fallthrough, conditions, and local flag chains.

### Category boundaries

This category recovers graph structure, not yet source `if`/loop syntax. Function discovery belongs in Category 4.

### Subcategories

1. Leaders and boundaries
2. Edges and graph construction
3. Reachability and dominance
4. Loops and audits

### Common misconceptions

- Every label or call starts a new block.
- A conditional branch has only its taken target.
- An unconditional jump falls through.
- Every backward edge is necessarily a loop.
- A visually earlier block dominates a later block.
- Unreachable decoded bytes cease to have boundaries.

### Family `cfg_leader_identify`

**Task.** Select all block leaders in a function region. **Response/template.** Address set.

**Derivation.** Apply the normative leader rules to decoded targets and terminators. **Difficulty.** L1 one conditional; L2 several branches; L3 unreachable post-jump row/indirect targets.

**Misconceptions/constraints.** Calls alone do not split blocks. **Feedback.** Tag each leader by rule.

**Examples.** 1. entry plus conditional target/fallthrough → three leaders. L1. 2. ordinary call return site is not a leader solely for that reason. L2. 3. decoded row after unconditional jump is still a leader though unreachable. L3.

**Validation/coverage.** Independently recompute complete leader set.

### Family `cfg_block_boundary`

**Task.** Partition a listing into maximal basic blocks. **Response/template.** Boundary placement or row grouping.

**Derivation.** Start at each leader and stop at next leader or terminator. **Difficulty.** L1 one branch; L2 shared target; L3 call inside block/unreachable tail.

**Misconceptions/constraints.** No overlapping blocks in the core profile. **Feedback.** Show leader and terminator of each block.

**Examples.** 1. `cmp; je; add; ret; sub; ret` partitions at branch target/fallthrough. L2. 2. call remains inside its block. L2. 3. one-instruction return block is valid. L1.

**Validation/coverage.** Every decoded code row belongs to exactly one block.

### Family `cfg_block_successors`

**Task.** List a block's intraprocedural successors. **Response/template.** Block set.

**Derivation.** Inspect final instruction and resolve target/fallthrough under the contract. **Difficulty.** L1 return/jump; L2 conditional; L3 bounded indirect/noreturn call.

**Misconceptions/constraints.** Call edge is not an intraprocedural successor. **Feedback.** Annotate terminator and each successor rule.

**Examples.** 1. `ret` → empty set. L1. 2. `jne B3` → `{B3, fallthrough}`. L1. 3. jump table with declared targets → complete target set. L3.

**Validation/coverage.** Successors equal normalized CFG adjacency.

### Family `cfg_edge_kind`

**Task.** Label an edge as taken, fallthrough, unconditional, indirect-case, call, return-site, or tail-call. **Response/template.** Edge label choice.

**Derivation.** Derive from terminator/call site metadata. **Difficulty.** L1 conditional pair; L2 call versus tail call; L3 indirect case.

**Misconceptions/constraints.** Interprocedural edges are rendered separately. **Feedback.** Cite source instruction.

**Examples.** 1. false path after `je` → fallthrough. L1. 2. `jmp helper` at function exit with ABI-compatible state → tail-call edge when metadata confirms. L3. 3. `call helper` → call edge plus intraprocedural continuation. L2.

**Validation/coverage.** Edge kind matches graph layer and source row.

### Family `cfg_branch_path_condition`

**Task.** State the path condition for each successor of a conditional block. **Response/template.** Match edge to normalized comparison.

**Derivation.** Combine flag producer semantics with `Jcc`, preserving signedness/width. **Difficulty.** L1 `je`; L2 signed/unsigned; L3 inverted fallthrough expression.

**Misconceptions/constraints.** `cmp a,b` means `a-b`; both edges receive complementary conditions. **Feedback.** Show compare, flag test, normalized relation.

**Examples.** 1. `cmp edi,0; jle B` → taken `x<=0` signed. L1. 2. `cmp eax,edx; ja B` → taken `x>y` unsigned. L2. 3. fallthrough of `jne` → equality. L2.

**Validation/coverage.** Exhaustive bounded-value branch truth test.

### Family `cfg_terminator_classify`

**Task.** Identify why and how a block terminates. **Response/template.** Terminator class and row selection.

**Derivation.** Use last decoded instruction plus noreturn/tail metadata. **Difficulty.** L1 branch/return; L2 ordinary call not terminator; L3 noreturn/tail/indirect.

**Misconceptions/constraints.** Last visible row is not automatically terminator if listing is truncated. **Feedback.** State successor cardinality.

**Examples.** 1. `ret` → return, zero successors. L1. 2. `call f; add...` → call is not block terminator. L2. 3. call to trusted `abort` summary → nonreturning terminator. L3.

**Validation/coverage.** Block end and successor count agree.

### Family `cfg_build_graph`

**Task.** Construct the complete CFG from pre-partitioned blocks. **Response/template.** Accessible graph-edge editor.

**Derivation.** Add exactly the successor edges from every block. **Difficulty.** L1 diamond; L2 loop; L3 indirect/shared exits/unreachable component.

**Misconceptions/constraints.** Layout position is not an edge. **Feedback.** Identify missing/extraneous edge by terminator.

**Examples.** 1. one `if` diamond with four blocks. L1. 2. loop header/body/exit. L2. 3. switch dispatch to three shared-return cases. L3.

**Validation/coverage.** Normalized edge set exact; layout-independent.

### Family `cfg_predecessor_query`

**Task.** Find all predecessors or classify a join point. **Response/template.** Block set/count.

**Derivation.** Reverse adjacency of the oracle CFG. **Difficulty.** L1 one/two predecessors; L2 loop header; L3 unreachable/multiple case edges.

**Misconceptions/constraints.** Predecessor means direct incoming edge, not any ancestor. **Feedback.** Highlight incoming edges only.

**Examples.** 1. diamond merge has two predecessors. L1. 2. loop header has entry and back-edge predecessors. L2. 3. switch cases sharing exit create several predecessors. L3.

**Validation/coverage.** Reverse graph query.

### Family `cfg_reachability`

**Task.** Determine reachable blocks/paths from an entry under unknown or supplied inputs. **Response/template.** Block set or reachable/unreachable/conditional.

**Derivation.** Graph traversal, optionally pruning edges with proven path conditions. **Difficulty.** L1 structural reachability; L2 known constant; L3 contradictory path predicates.

**Misconceptions/constraints.** Decoded does not mean reachable; unknown condition keeps both paths. **Feedback.** Show traversal and pruned edge reason.

**Examples.** 1. row after unconditional jump with no incoming edge → unreachable. L1. 2. `x=0` prunes `x!=0` branch. L2. 3. graph-reachable but path-infeasible block distinguished at L3. L3.

**Validation/coverage.** Structural and predicate-aware modes stored separately.

### Family `cfg_dominator`

**Task.** Determine whether block A dominates block B or find immediate dominator. **Response/template.** Yes/no or block choice.

**Derivation.** Fixed-point dominator sets from the declared entry over reachable CFG. **Difficulty.** L2 linear/diamond; L3 loop/multiple merges; L4 unreachable excluded.

**Misconceptions/constraints.** Earlier address/order is not dominance. **Feedback.** Show whether every entry-to-B path passes A.

**Examples.** 1. entry dominates every reachable block. L1. 2. either arm of a diamond does not dominate merge. L2. 3. loop header dominates body. L2.

**Validation/coverage.** Independent iterative and path-enumeration checks on small graphs.

### Family `cfg_natural_loop`

**Task.** Identify a back edge and natural-loop node set. **Response/template.** Edge plus block set.

**Derivation.** Edge `n→h` is a back edge when `h` dominates `n`; collect `h`, `n`, and reverse-reachable predecessors to `n` without passing `h`. **Difficulty.** L2 single loop; L3 nested/shared exit; L4 backward non-back-edge contrast.

**Misconceptions/constraints.** Backward address alone is insufficient. **Feedback.** Show dominance and loop collection.

**Examples.** 1. body→header with header dominating body → back edge. L2. 2. header/body set forms loop. L2. 3. backward edge whose target does not dominate source → not a natural-loop back edge. L3.

**Validation/coverage.** Dominator-based oracle and loop-set recomputation.

### Family `cfg_graph_audit`

**Task.** Find an incorrect boundary, edge, label, reachability, or dominance claim. **Response/template.** Select fault and repair.

**Derivation.** Compare proposal with decoded listing and graph analyses. **Difficulty.** L1 missing fallthrough; L2 call split/extraneous edge; L3 dominance/loop fault.

**Misconceptions/constraints.** One injected primary fault. **Feedback.** Trace from source terminator or graph invariant.

**Examples.** 1. conditional has only taken edge → missing fallthrough. L1. 2. unconditional jump given fallthrough → extraneous edge. L1. 3. backward edge labeled loop without dominance → unsupported. L3.

**Validation/coverage.** Mutation suite covers each CFG invariant.

### Cross-family progression

Find leaders before grouping blocks, and group blocks before drawing edges. Reachability precedes dominance; dominance precedes natural-loop recovery. Calls remain visually separate throughout.

## 4. Category: Functions, calls, and ABI evidence

### Category purpose

Train recovery of function-level regions and call interfaces without relying on a single prologue signature.

### Learn

A direct call target strongly supports a function entry, but optimized functions may have no traditional prologue. Arguments and return values are inferred from the pinned ABI plus actual reads/writes. A jump at the end may be a tail call; a tiny function may be a wrapper or thunk.

### Prerequisites

CFG construction, stack/call semantics, and System V ABI basics.

### Category boundaries

This category identifies functions and interfaces. Detailed frame-slot analysis belongs in Category 5; interprocedural whole-program analysis is excluded.

### Subcategories

1. Entry/exit evidence
2. Prologues and epilogues
3. Arguments, returns, and saved state
4. Tail calls, wrappers, and audits

### Common misconceptions

- Every function begins with `push rbp; mov rbp,rsp`.
- Every `ret` uniquely marks a function end.
- Every jump target is a function.
- Register contents at a call are all arguments.
- Callee-saved means the caller may assume the callee will change it.
- Any final jump is necessarily a tail call.

### Family `call_target_fallthrough`

**Task.** Separate a call target, return site, and intraprocedural continuation. **Response/template.** Three address fields/edge labels.

**Derivation.** Target comes from call operand; return site is next RIP; continuation follows call summary. **Difficulty.** L1 direct call; L2 call inside block; L3 known noreturn.

**Misconceptions/constraints.** Stack return address and callee address are distinct. **Feedback.** Draw call and continuation edges.

**Examples.** 1. call at `0x1000` length 5 to `0x2000` → return site `0x1005`. L1. 2. ordinary call continues in same block. L2. 3. trusted noreturn call has no continuation. L3.

**Validation/coverage.** Interpreter call event and graph metadata agree.

### Family `function_entry_evidence`

**Task.** Rank candidate function entries from supplied evidence. **Response/template.** Established/supported/possible/contradicted for each address.

**Derivation.** Apply evidence policy: trusted symbol, relocation/call reference, valid decode, reachability, alignment, ABI-consistent state. **Difficulty.** L2 symbol/direct call; L3 stripped candidates; L4 conflicting/insufficient.

**Misconceptions/constraints.** Prologue bytes alone never establish entry. **Feedback.** List evidence and assumptions.

**Examples.** 1. trusted function symbol → established. L1. 2. direct call target with valid decode → strongly supported. L2. 3. aligned prologue-like bytes inside reachable block → contradicted as separate entry. L3.

**Validation/coverage.** Claim status derived from fixture evidence graph.

### Family `function_exit_identify`

**Task.** Select all exits from a candidate function. **Response/template.** Row/block set plus exit kind.

**Derivation.** Find returns, known noreturn transfers, and confirmed tail calls reachable from entry. **Difficulty.** L1 one `ret`; L2 shared/two returns; L3 tail/noreturn.

**Misconceptions/constraints.** Unreachable `ret` bytes do not count as reachable exits unless asked structurally. **Feedback.** Trace each exit path.

**Examples.** 1. one reachable `ret` → return exit. L1. 2. two branch-specific returns → both exits. L2. 3. final confirmed tail jump → tail exit. L3.

**Validation/coverage.** Reachable CFG plus interprocedural edge kind.

### Family `function_prologue_epilogue`

**Task.** Recognize and explain a frame setup/teardown pattern. **Response/template.** Span selection plus stack effects.

**Derivation.** Symbolically execute RSP/RBP and saved-register operations. **Difficulty.** L1 classic frame; L2 extra saves/alignment; L3 absent/shared epilogue.

**Misconceptions/constraints.** Pattern is not required for function identity. **Feedback.** Show before/after stack diagram.

**Examples.** 1. `push rbp; mov rbp,rsp` → establishes frame pointer. L1. 2. `leave; ret` → restore RSP/RBP then return. L2. 3. leaf `lea eax,[rdi+1]; ret` → valid function with no prologue. L2.

**Validation/coverage.** Architectural trace and ABI restore check.

### Family `abi_argument_recover`

**Task.** Identify which entry values are used as parameters and their roles. **Response/template.** Register/stack-location to synthetic parameter mapping.

**Derivation.** Start from ABI locations, follow uses before redefinition, and apply call summaries. **Difficulty.** L1 one/two registers; L2 unused/formally unknown args; L3 stack arg.

**Misconceptions/constraints.** An ABI register is only a recovered input if its incoming value is used. **Feedback.** Show first-use chains.

**Examples.** 1. EDI read before write → first integer parameter used. L1. 2. RSI overwritten before read → no evidence second incoming value matters. L2. 3. `[SP0+8]` read as seventh integer argument under profile. L3.

**Validation/coverage.** Symbolic input taint reaches an observable use.

### Family `abi_return_recover`

**Task.** Recover possible return values at each exit. **Response/template.** Expression per exit or no-value/unknown.

**Derivation.** Find reaching RAX/EAX definition at every ordinary return, respecting width. **Difficulty.** L1 constant/copy; L2 branch merge; L3 call result/partial write.

**Misconceptions/constraints.** RAX contents do not imply meaningful return for a declared void summary. **Feedback.** Trace each reaching definition.

**Examples.** 1. `xor eax,eax; ret` → returns integer zero. L1. 2. branches set EAX 1/0 → conditional boolean-like return. L2. 3. `call f; ret` → returns callee result when summary/type candidates allow. L3.

**Validation/coverage.** Reaching-def and concrete path execution agree.

### Family `abi_saved_register_reasoning`

**Task.** Determine whether a function preserves required registers and identify save/restore pairs. **Response/template.** Register set and valid/invalid.

**Derivation.** Compare entry/exit values of callee-saved registers over all paths. **Difficulty.** L1 one push/pop; L2 stack-slot saves/shared epilogue; L3 path-sensitive restore.

**Misconceptions/constraints.** Caller-saved clobbers are not callee violations. **Feedback.** Match each saved value across exits.

**Examples.** 1. `push rbx ... pop rbx` all paths → preserved. L1. 2. RBX modified without restoration → violation. L2. 3. R10 clobbered → allowed. L1.

**Validation/coverage.** Symbolic entry values equal exit values for required registers.

### Family `abi_callsite_alignment`

**Task.** Verify RSP alignment at a call site. **Response/template.** RSP residue and valid/invalid.

**Derivation.** Trace stack delta from entry and require caller RSP mod 16 = 0 immediately before `call`. **Difficulty.** L1 constant subtraction; L2 pushes; L3 two paths merge.

**Misconceptions/constraints.** Callee-entry residue is 8, not pre-call residue. **Feedback.** Show modular stack trace.

**Examples.** 1. entry residue 8; `sub rsp,8` → pre-call 0, valid. L1. 2. unmatched push changes residue. L2. 3. two paths with different residues → invalid/unknown unless reconciled. L3.

**Validation/coverage.** Path-sensitive delta modulo 16.

### Family `function_tail_call`

**Task.** Decide whether a final jump is a confirmed tail call, ordinary intraprocedural jump, or only a possibility. **Response/template.** Three-way status plus evidence.

**Derivation.** Check target function evidence, no local successor, restored frame/saved state, ABI-compatible arguments, and metadata. **Difficulty.** L2 symbolic external jump; L3 stripped target; L4 ambiguous shared code.

**Misconceptions/constraints.** Final position alone is insufficient. **Feedback.** Checklist each criterion.

**Examples.** 1. restored frame then `jmp known_function` → confirmed tail call. L2. 2. jump to local block → intraprocedural. L1. 3. jump outside region without target evidence → possible, not established. L3.

**Validation/coverage.** Claim system preserves uncertainty.

### Family `function_wrapper_thunk`

**Task.** Recognize a small wrapper/thunk and summarize its transformation. **Response/template.** Controlled summary AST.

**Derivation.** Trace parameter rearrangement/constants and final call/tail call. **Difficulty.** L2 direct forwarding; L3 default argument or reordered args; L4 return adjustment.

**Misconceptions/constraints.** Do not infer business purpose from imported name alone. **Feedback.** Show caller inputs to callee inputs/output.

**Examples.** 1. function immediately jumps to imported `f` → forwarding thunk. L1. 2. sets ESI=0 then calls `f(rdi,0)` → default-argument wrapper. L2. 3. calls `f`, adds 1 to EAX, returns → result-adjusting wrapper. L3.

**Validation/coverage.** Symbolic composition equals summary.

### Family `function_boundary_audit`

**Task.** Diagnose an unsupported entry/end/interface claim. **Response/template.** Claim selection and corrected confidence.

**Derivation.** Compare claim with symbols, xrefs, CFG reachability, ABI state, and exits. **Difficulty.** L1 prologue assumption; L2 split shared epilogue; L3 tail/inlining ambiguity.

**Misconceptions/constraints.** Exactly one primary overclaim or contradiction. **Feedback.** Separate fact from heuristic.

**Examples.** 1. “No prologue, so not a function” → false. L1. 2. every `ret` treated as unique function end → unsupported. L2. 3. inlined body labeled a separate called function despite no entry edge → contradicted. L3.

**Validation/coverage.** Evidence-status mutation suite.

### Cross-family progression

Separate call target and continuation first. Recover entries/exits and frames before parameters/returns. Tail calls and wrappers appear only after ABI restoration and evidence confidence are reliable.

## 5. Category: Stack frames and local storage

### Category purpose

Train symbolic reconstruction of call frames, saved state, arguments, and local storage across a function.

### Learn

Track `RSP` as a signed delta from entry `SP0`, one instruction at a time. Normalize each memory access to its frame base and byte interval. The same offset can mean different storage before and after an adjustment; different-looking RSP/RBP expressions can denote the same slot.

### Prerequisites

Push/pop/call/ret semantics, ABI alignment, function entry/exit, and little-endian widths.

### Category boundaries

This category recovers stack organization. General register data flow belongs in Category 6. Dynamic allocation and exception unwinding are excluded.

### Subcategories

1. Stack deltas and normalization
2. Slot roles and lifetimes
3. Frame-pointer omission and canaries
4. Whole-frame diagrams and audits

### Common misconceptions

- `RSP` always points to the return address.
- `[rbp-8]` and `[rsp+8]` can never be the same slot.
- Every stack write is a local variable.
- Reusing a slot means one source variable has changed type.
- A frame pointer is necessary for stack access.
- A canary check reveals all details of the original source.

### Family `stack_delta_trace`

**Task.** Compute RSP delta from `SP0` at selected rows. **Response/template.** Signed byte offsets.

**Derivation.** Symbolically execute push/pop/sub/add/leave/call-state rules. **Difficulty.** L1 one adjustment; L2 saves+allocation; L3 paths/shared epilogue.

**Misconceptions/constraints.** Listing begins at ordinary callee entry; no hidden pushes. **Feedback.** Show a delta column beside rows.

**Examples.** 1. `push rbp` → `SP0-8`. L1. 2. then `sub rsp,0x20` → `SP0-40`. L2. 3. `leave` after classic frame restores RSP to `SP0`, then `ret`. L3.

**Validation/coverage.** Architectural trace and symbolic delta agree on every path.

### Family `stack_slot_role`

**Task.** Classify a normalized slot as saved register, local, spill, outgoing argument, incoming stack argument, return address, or unknown. **Response/template.** Role choice with confidence.

**Derivation.** Use entry location, write/read sequence, save/restore matching, and call-site position. **Difficulty.** L1 return/saved register; L2 local/outgoing; L3 spill versus local uncertainty.

**Misconceptions/constraints.** Compiler temporaries and source locals may be indistinguishable; accept unknown. **Feedback.** Cite lifetime and uses.

**Examples.** 1. `[SP0]` at entry → return address. L1. 2. value of RBX stored then restored → saved-register slot. L2. 3. short-lived computed value stored/reloaded → spill or local; insufficient evidence for original source variable. L3.

**Validation/coverage.** Role status follows evidence rules, not offset pattern alone.

### Family `stack_offset_normalize`

**Task.** Decide whether two stack operands refer to the same bytes. **Response/template.** Same/disjoint/overlap plus normalized intervals.

**Derivation.** Substitute known RSP/RBP deltas and operand widths relative to `SP0`. **Difficulty.** L1 same base; L2 RSP after adjustment; L3 RBP/RSP equivalence and partial overlap.

**Misconceptions/constraints.** Width matters; textual offset equality is insufficient. **Feedback.** Draw both intervals on one frame ruler.

**Examples.** 1. with `rsp=SP0-32`, `[rsp+8]` → `[SP0-24]`. L1. 2. `rbp=SP0-8`; `[rbp-8]` equals `[SP0-16]`. L2. 3. 8-byte slot at -16 overlaps 4-byte slot at -12. L3.

**Validation/coverage.** Exact interval arithmetic.

### Family `stack_saved_register_slot`

**Task.** Match saved callee-register values to save and restore accesses. **Response/template.** Edge matching.

**Derivation.** Follow symbolic entry values through stack stores/loads to exits. **Difficulty.** L1 push/pop; L2 mov-based save; L3 shared epilogue/path merge.

**Misconceptions/constraints.** Equal offsets at different deltas are normalized first. **Feedback.** Draw value-flow path through the slot.

**Examples.** 1. `push rbx ... pop rbx` → matched. L1. 2. `mov [rsp+8],r12 ... mov r12,[rsp+8]` → matched. L2. 3. one exit skips restore → unmatched ABI violation. L3.

**Validation/coverage.** Entry symbolic value reaches same register on every ordinary return.

### Family `stack_slot_lifetime`

**Task.** Mark a stack slot's live interval and detect reuse. **Response/template.** Row interval(s) and reuse yes/no.

**Derivation.** From each defining store to last reachable read before overwrite, path-sensitively within bounded CFG. **Difficulty.** L2 straight line; L3 branches; L4 nonoverlapping reuse.

**Misconceptions/constraints.** Machine slot lifetime is not proof of source variable lifetime. **Feedback.** Timeline stores, reads, and kills.

**Examples.** 1. store row 3, loads rows 5/7, overwrite 9 → live through 7. L2. 2. same slot used for a different temporary after overwrite → reuse. L3. 3. branch-specific uses join conservatively. L3.

**Validation/coverage.** Memory def-use and path reachability.

### Family `stack_frame_pointer_omission`

**Task.** Recover stack slots in a function that uses RSP rather than RBP as a fixed frame pointer. **Response/template.** Normalized slot map.

**Derivation.** Track every RSP delta and normalize each access to `SP0`. **Difficulty.** L2 one allocation; L3 pushes/calls; L4 path-balanced changes.

**Misconceptions/constraints.** Absence of RBP frame does not mean absence of locals. **Feedback.** Annotate RSP delta at each access.

**Examples.** 1. `sub rsp,16; mov [rsp+4],edi` → local at `SP0-12`. L2. 2. push before allocation shifts later textual offsets. L3. 3. balanced branch adjustments recover same merge delta. L4.

**Validation/coverage.** Normalized addresses equal concrete interpreter addresses for randomized SP0.

### Family `stack_outgoing_arguments`

**Task.** Identify stack-passed call arguments and distinguish them from locals. **Response/template.** Call-site argument map.

**Derivation.** Normalize pre-call RSP, apply ABI locations, and trace reaching values. **Difficulty.** L2 seventh argument; L3 several stack args/alignment padding.

**Misconceptions/constraints.** `[SP0+8]` is incoming seventh arg at callee entry, not universally at caller. **Feedback.** Show caller-before-call and callee-entry views.

**Examples.** 1. caller stores value at pre-call `[rsp]` for seventh integer arg under fixture convention. L2. 2. callee reads `[SP0+8]`. L2. 3. padding slot is not an argument. L3.

**Validation/coverage.** Call transfer model maps caller bytes to callee locations.

### Family `stack_canary_pattern`

**Task.** Recognize and explain a supplied stack-canary check. **Response/template.** Select guard load, saved slot, check, and failure edge.

**Derivation.** Match trusted guard-source metadata, prologue store, epilogue comparison, and noreturn failure call. **Difficulty.** L3 canonical pattern; L4 shared epilogue/optimized comparison.

**Misconceptions/constraints.** This identifies a protection pattern, not the vulnerable variable or exploitability. **Feedback.** Trace guard value without operational bypass details.

**Examples.** 1. load trusted guard then store in frame → canary setup. L3. 2. compare saved/current guard before return → check. L3. 3. mismatch branch to known noreturn failure helper → failure path. L3.

**Validation/coverage.** Pattern requires all semantic components; byte signature alone rejected.

### Family `stack_frame_diagram`

**Task.** Construct a frame diagram at a selected program point. **Response/template.** Ordered interval placement with roles/values.

**Derivation.** Combine current RSP, SP0, mapped slots, widths, and live symbolic values. **Difficulty.** L2 simple frame; L3 saves+locals+outgoing args; L4 reused/overlapping widths.

**Misconceptions/constraints.** Diagram address direction is labeled; empty padding is distinct from unknown data. **Feedback.** Animate each stack operation.

**Examples.** 1. return address plus saved RBP. L1. 2. add 16-byte local area and saved RBX. L2. 3. show pre-call outgoing arg and alignment padding. L3.

**Validation/coverage.** Diagram intervals exactly cover oracle objects without invented fields.

### Family `stack_recovery_audit`

**Task.** Find an error in a proposed stack delta, alias, role, or diagram. **Response/template.** Select annotation and repair.

**Derivation.** Compare with symbolic stack and memory-def-use oracles. **Difficulty.** L1 sign error; L2 stale RSP offset; L3 overlapping/reused slot overclaim.

**Misconceptions/constraints.** One primary fault. **Feedback.** Recompute from nearest known delta.

**Examples.** 1. `sub rsp,16` labeled `SP0+16` → sign error. L1. 2. pre/post-push `[rsp+8]` treated same → normalization error. L2. 3. reused slot asserted to be one source variable → unsupported. L3.

**Validation/coverage.** Mutation suite spans deltas, bases, widths, lifetimes, and confidence.

### Cross-family progression

Trace deltas before assigning roles. Normalize aliases before lifetimes. Frame-pointer omission and outgoing arguments precede whole diagrams; canary recognition remains a late, non-operational pattern lesson.

## 6. Category: Data flow and abstract values

### Category purpose

Train path-aware tracking of where values come from, where they are used, and what can safely be inferred.

### Learn

A use may have one or several reaching definitions. At a merge, different constants usually become an unknown or a range rather than one guessed value. Liveness asks whether an old value may be used later; dead writes can disappear without changing observable behavior.

### Prerequisites

Instruction read/write sets, CFGs, register overlap, stack normalization, and calls.

### Category boundaries

This category computes machine-level facts. Mapping those facts to source constructs begins in Category 7.

### Subcategories

1. Definitions and uses
2. Constants, copies, and ranges
3. Liveness and dead writes
4. Aliases, flags, and audits

### Common misconceptions

- The nearest textual write always reaches a use.
- Values from different branches can be arbitrarily chosen at a merge.
- A register name denotes one permanent variable.
- Every write matters.
- Same base register means alias; different base register means disjoint.
- Flags remain valid across any instruction or call.

### Family `dataflow_reaching_definition`

**Task.** Find all definitions that may reach a selected use. **Response/template.** Instruction-row set.

**Derivation.** Forward may-analysis with kill/gen sets, register-slice overlap, and CFG joins. **Difficulty.** L1 straight line; L2 branch merge; L3 partial register/call clobber.

**Misconceptions/constraints.** Textual order outside reachable paths is irrelevant. **Feedback.** Draw def-use paths.

**Examples.** 1. last EAX write before read in one block → one def. L1. 2. two branch arms set EAX → two reaching defs at merge. L2. 3. AL write partially modifies prior RAX definition → combined slice provenance. L3.

**Validation/coverage.** Fixed-point analysis checked against bounded path enumeration.

### Family `dataflow_use_def_chain`

**Task.** List uses reached by a selected definition before it is killed. **Response/template.** Row/operand set.

**Derivation.** Follow CFG paths until overlapping redefinition; include may-uses. **Difficulty.** L1 one block; L2 branch; L3 memory slot/call summary.

**Misconceptions/constraints.** A textual later use may be unreachable or killed. **Feedback.** Highlight propagation and kill points.

**Examples.** 1. `mov eax,edi; add eax,1` → add uses definition. L1. 2. both branch tests use same incoming value. L2. 3. call consumes RDI then clobbers it per summary. L3.

**Validation/coverage.** Bidirectional consistency with reaching definitions.

### Family `dataflow_constant_propagation`

**Task.** Determine a register/slot constant at a selected point. **Response/template.** Fixed-width value or unknown.

**Derivation.** Interpret constant operations; join equal constants as same and unequal as unknown. **Difficulty.** L1 linear arithmetic; L2 equal branch values; L3 width/mask/call.

**Misconceptions/constraints.** Do not choose one path without a proven condition. **Feedback.** Show expression fold and joins.

**Examples.** 1. `mov eax,3; add eax,4` → 7. L1. 2. both arms set EAX=1 → 1 at merge. L2. 3. arms set 1/2 → unknown. L2.

**Validation/coverage.** Abstract result overapproximates all concrete bounded executions.

### Family `dataflow_copy_propagation`

**Task.** Trace which symbolic input/value a copied register represents. **Response/template.** Source symbol/expression.

**Derivation.** Follow copy and lossless extension chains until redefinition, join, or semantic operation. **Difficulty.** L1 mov chain; L2 width extension; L3 branch copies/renaming.

**Misconceptions/constraints.** Truncation and sign extension may change value. **Feedback.** Collapse safe copy chain and mark transformations.

**Examples.** 1. `mov eax,edi; mov ecx,eax` → ECX holds low32(arg1). L1. 2. `movsxd rax,edi` → sign-extended arg1. L2. 3. copy register reused later → chain ends at kill. L2.

**Validation/coverage.** Symbolic expressions match interpreter across boundary inputs.

### Family `dataflow_value_range`

**Task.** Infer an interval or branch refinement for a symbolic value. **Response/template.** Inclusive bounds/signedness or unknown.

**Derivation.** Start from type-domain interval and intersect with normalized branch predicates along the path. **Difficulty.** L2 one bound; L3 two checks; L4 merge/wrap-sensitive exclusion.

**Misconceptions/constraints.** Signed and unsigned domains are explicit; avoid unsound wrap arithmetic. **Feedback.** Show each intersection.

**Examples.** 1. signed `x>=0` path → `[0,INT_MAX]`. L2. 2. then `x<10` → `[0,9]`. L2. 3. unsigned `x<=255` → `[0,255]`. L2.

**Validation/coverage.** Exhaustive small-width or SMT/build-time boundary validation.

### Family `dataflow_liveness`

**Task.** Decide whether a register/slot value is live at a point. **Response/template.** Live/dead plus next-use set.

**Derivation.** Backward may-liveness from uses, subtracting kills and applying call summaries. **Difficulty.** L1 straight line; L2 branch; L3 loop/call.

**Misconceptions/constraints.** Register being nonzero/present does not mean live. **Feedback.** Trace backward from uses.

**Examples.** 1. EAX used by next add → live. L1. 2. overwritten before any use → dead. L1. 3. used on only one branch → live before branch. L2.

**Validation/coverage.** Data-flow fixed point and bounded-path check.

### Family `dataflow_dead_write`

**Task.** Identify a write whose value cannot affect any observable behavior. **Response/template.** Row selection or none.

**Derivation.** A write is dead when overwritten/unobserved on all paths before any read, memory effect, return, or relevant call. **Difficulty.** L1 overwritten register; L2 branch; L3 flags/partial writes.

**Misconceptions/constraints.** Instruction may still have other live effects; removal is valid only if all effects are dead. **Feedback.** List each written component and its fate.

**Examples.** 1. `mov eax,1; mov eax,2` → first register write dead. L1. 2. `add` result dead but flags used → instruction not removable. L2. 3. store to externally visible memory is not dead under default observability. L2.

**Validation/coverage.** Effect-level liveness, not destination-only heuristic.

### Family `dataflow_register_renaming`

**Task.** Group machine register live ranges into distinct synthetic variables. **Response/template.** Assign variable IDs to definition/use clusters.

**Derivation.** Each definition starts a value; uses link to reaching defs; nonoverlapping unrelated definitions may receive different variable IDs. **Difficulty.** L2 sequential reuse; L3 branch merge; L4 copy/coalescing choice.

**Misconceptions/constraints.** Hardware register identity does not imply one source variable. **Feedback.** Show live-range intervals.

**Examples.** 1. EAX holds input-derived temp, later unrelated constant → two variables. L2. 2. two branch definitions merged for one result → one joined pseudovariable. L3. 3. RDX reused across calls → separate ranges. L3.

**Validation/coverage.** SSA-like value graph validates groupings; alpha-renaming accepted.

### Family `dataflow_memory_alias`

**Task.** Classify two accesses as definitely same, definitely disjoint, or may alias. **Response/template.** Three-way choice plus intervals.

**Derivation.** Normalize object identities and byte intervals; use explicit pointer-equality/range facts. **Difficulty.** L1 same stack slot; L2 adjacent array elements; L3 two pointer inputs.

**Misconceptions/constraints.** Different registers may hold same pointer; same base with disjoint intervals is disjoint. **Feedback.** Display normalized objects/ranges.

**Examples.** 1. same normalized 4-byte slot → definitely same. L1. 2. array offsets 0..3 and 4..7 → disjoint. L2. 3. `[rdi]` and `[rsi]` with no relation → may alias. L2.

**Validation/coverage.** Interval/object relation oracle.

### Family `dataflow_flag_provenance`

**Task.** Recover the value comparison or operation represented by flags at a later branch/set/cmov. **Response/template.** Producer, relevant flags, normalized predicate.

**Derivation.** Per-flag reaching definitions plus condition-code semantics. **Difficulty.** L1 adjacent cmp; L2 intervening preserving ops; L3 partial overwrite/merge.

**Misconceptions/constraints.** A single “flags value” is not tracked monolithically. **Feedback.** Draw separate flag arrows.

**Examples.** 1. `cmp edi,esi; jl` → signed arg1<arg2. L1. 2. `cmp; mov; setne` retains ZF provenance. L2. 3. one path redefines flags → merged predicate unknown. L3.

**Validation/coverage.** Three-valued per-flag data flow and branch truth tests.

### Family `dataflow_analysis_audit`

**Task.** Diagnose an unsound def-use, constant, liveness, alias, or flag claim. **Response/template.** Select claim and correction.

**Derivation.** Compare with fixed-point analyses and concrete witnesses. **Difficulty.** L1 missed kill; L2 merge; L3 alias/partial register.

**Misconceptions/constraints.** One primary error; feedback provides counterpath where useful. **Feedback.** State may versus must distinction.

**Examples.** 1. nearest textual def crosses a killing write → wrong. L1. 2. one branch constant asserted after merge → unsound. L2. 3. different pointer registers declared disjoint without evidence → unsound. L3.

**Validation/coverage.** Every bad claim has a generated witness path/state.

### Cross-family progression

Definitions and uses come first, then constants/copies. Ranges and liveness precede dead-write reasoning. Register renaming, memory aliasing, and flag provenance culminate in audits.

## 7. Category: Recovering structured control flow

### Category purpose

Train mapping from CFG regions and path predicates to source-like control constructs while retaining irreducible or ambiguous alternatives.

### Learn

An `if` is a branch whose paths reconverge; a loop needs a header, back edge, and exit. Compiler layout may invert a condition or place either arm first. Recover structure from edges, dominance, and postdominance—not address order or one mnemonic.

### Prerequisites

Complete CFGs, branch predicates, reachability, dominance, natural loops, and basic data flow.

### Category boundaries

This category recovers control skeletons. Expressions and data structures inside statements belong in Category 8.

### Subcategories

1. Conditionals
2. Loops
3. Short-circuit and multiway flow
4. Branchless control and audits

### Common misconceptions

- Taken target always corresponds to source `then`.
- Backward jump always means `while`.
- One source construct has one assembly layout.
- Two tests in sequence necessarily mean eager `and`.
- A jump table proves a source `switch`.
- Any CFG can be forced into clean structured pseudocode.

### Family `recover_if_then`

**Task.** Identify a single-arm conditional region and build `if` pseudocode. **Response/template.** Select condition/body/join.

**Derivation.** Find branch with one arm flowing directly to nearest common postdominator and the other executing body. **Difficulty.** L1 forward skip; L2 inverted branch; L3 body laid out at target.

**Misconceptions/constraints.** Condition may need negation. **Feedback.** Overlay CFG region and normalized condition.

**Examples.** 1. `je join` skips body → `if (x!=y) body`. L1. 2. taken edge enters body → keep condition. L2. 3. body returns, so no reconvergent join but one-arm guard recognized. L3.

**Validation/coverage.** Pseudocode CFG is isomorphic after normalization.

### Family `recover_if_else`

**Task.** Recover condition, two arms, and merge of a diamond. **Response/template.** Structured `If` AST.

**Derivation.** Identify branch successors and nearest common postdominator; map predicates to arms. **Difficulty.** L1 clean diamond; L2 one arm fallthrough/inverted; L3 arm returns.

**Misconceptions/constraints.** Address order does not name then/else. **Feedback.** Color both paths and merge.

**Examples.** 1. compare then set EAX in two arms → conditional assignment. L1. 2. branch mnemonic inverted relative to chosen readable condition. L2. 3. early-return guard plus remaining path represented without fake else. L3.

**Validation/coverage.** AST lowering reproduces edges and predicates.

### Family `recover_condition_invert`

**Task.** Rewrite a branch condition to a source-friendly equivalent or complement. **Response/template.** Condition choice/structured comparison.

**Derivation.** Apply exact signed/unsigned condition complement table and operand order. **Difficulty.** L1 equality; L2 relational; L3 swapped operands/De Morgan for pair.

**Misconceptions/constraints.** Signedness and width cannot change. **Feedback.** Show truth-table equivalence.

**Examples.** 1. fallthrough of `je` → `!=`. L1. 2. complement of signed `<` → `>=`. L2. 3. unsigned `a>b` swapped → `b<a`. L3.

**Validation/coverage.** Exhaustive boundary-value equivalence.

### Family `recover_while_loop`

**Task.** Recover a pre-test `while` loop. **Response/template.** Header condition, body set, exit.

**Derivation.** Natural loop with condition in header, one successor outside, and back edge from body/latch. **Difficulty.** L1 one body block; L2 inverted exit test; L3 multiple latches normalized.

**Misconceptions/constraints.** Do not infer iteration count without data flow. **Feedback.** Mark header, latch, exit, and continue edge.

**Examples.** 1. header tests `i<n`, false exits → `while(i<n)`. L1. 2. `jge exit` means loop while `<`. L2. 3. two continue paths share header. L3.

**Validation/coverage.** Lowered loop CFG/predicates match original.

### Family `recover_do_while`

**Task.** Recover a post-test loop and distinguish it from `while`. **Response/template.** `DoWhile` AST.

**Derivation.** Entry flows through body before latch condition; latch back edge is conditional. **Difficulty.** L2 one block; L3 multi-block body/negated latch.

**Misconceptions/constraints.** At-least-once execution is decisive. **Feedback.** Trace first iteration before condition.

**Examples.** 1. body then `dec; jne body` → do/while-like loop. L2. 2. entry cannot bypass body → at least once. L2. 3. negated latch condition normalized. L3.

**Validation/coverage.** Zero-iteration test distinguishes rejected while candidate.

### Family `recover_counted_loop`

**Task.** Recover induction variable, initialization, bound, and step. **Response/template.** Four named fields plus loop form.

**Derivation.** Identify loop-carried definition, update, header/latch compare, and initial reaching definition. **Difficulty.** L2 increment by one; L3 other stride/signedness; L4 pointer induction.

**Misconceptions/constraints.** Do not assume `for` was original; label “counted-loop equivalent.” **Feedback.** Draw induction recurrence.

**Examples.** 1. `i=0; i<n; i++`. L2. 2. descending `i=n-1; i>=0; --i` with signed domain. L3. 3. pointer advances 4 bytes to end pointer. L4.

**Validation/coverage.** Symbolic recurrence and bounded executions match.

### Family `recover_break_continue`

**Task.** Identify edges equivalent to `break` or `continue` within a natural loop. **Response/template.** Edge labels.

**Derivation.** Edge from loop body to loop exit is break-like; edge to header/latch is continue-like, subject to structured region. **Difficulty.** L2 one early edge; L3 nested loops; L4 shared cleanup excluded initially.

**Misconceptions/constraints.** Target nearest loop by containment, not address. **Feedback.** Highlight enclosing loop and target.

**Examples.** 1. body→exit edge → break. L2. 2. body→header → continue. L2. 3. edge exits inner but remains in outer → inner break only. L3.

**Validation/coverage.** Loop nesting forest determines labels.

### Family `recover_short_circuit`

**Task.** Recover `&&` or `||` evaluation from chained conditional blocks. **Response/template.** Boolean expression tree plus evaluation order.

**Derivation.** Follow early-false/early-true edges and side-effecting operand blocks. **Difficulty.** L2 two predicates; L3 mixed/nested; L4 shared outcome blocks.

**Misconceptions/constraints.** Must preserve skipped evaluations and order. **Feedback.** Show which paths avoid second operand.

**Examples.** 1. false first test jumps to false result → `A && B`. L2. 2. true first test jumps to true result → `A || B`. L2. 3. `A && (B || C)` from nested graph. L3.

**Validation/coverage.** Exhaustive truth/side-effect trace equivalence.

### Family `recover_switch_chain`

**Task.** Recognize a compare-and-branch multiway selection and recover cases/default. **Response/template.** Case-value to block map.

**Derivation.** Collect mutually exclusive equality/range tests converging on case regions. **Difficulty.** L2 two/three cases; L3 shared case bodies/range checks.

**Misconceptions/constraints.** Could originate from if/else chain; call it switch-like selection unless provenance given. **Feedback.** Table predicates and targets.

**Examples.** 1. `x==1`, `x==2`, else → two cases/default. L2. 2. cases 1 and 2 share target. L3. 3. sparse values use comparison chain. L3.

**Validation/coverage.** Case predicates disjoint and cover declared domain with default.

### Family `recover_jump_table`

**Task.** Recover a bounded jump-table dispatch. **Response/template.** Index range, table base, case-target map, default.

**Derivation.** Identify bounds check, normalized index, scaled table load, and bounded indirect jump metadata. **Difficulty.** L3 dense zero-based; L4 biased index/shared targets.

**Misconceptions/constraints.** Table metadata is supplied/validated; no arbitrary memory guessing. Jump table supports switch-like behavior, not exact source syntax. **Feedback.** Walk bounds then index.

**Examples.** 1. `if x>3 default; jmp table[x]` → cases 0–3. L3. 2. subtract 5 then bound 2 → original cases 5–7. L4. 3. repeated target means shared case body. L4.

**Validation/coverage.** Every in-range index resolves to declared instruction boundary.

### Family `recover_conditional_select`

**Task.** Translate `cmovcc`/`setcc` or arithmetic selection into controlled branchless pseudocode. **Response/template.** `Select(condition,a,b)` or boolean assignment.

**Derivation.** Trace flag predicate and old/new destination values. **Difficulty.** L2 `setcc`; L3 `cmov`; L4 masked select.

**Misconceptions/constraints.** Both candidate values may be evaluated even when one selected; do not introduce short circuit. **Feedback.** Show predicate and value alternatives.

**Examples.** 1. `sete al` after compare → boolean equality result. L2. 2. `mov eax,b; cmp; cmovl eax,c` → select c if signed condition else b. L3. 3. bit-mask blend with pure operands → branchless select. L4.

**Validation/coverage.** Exhaustive condition/value simulation.

### Family `recover_control_audit`

**Task.** Find where proposed structured pseudocode changes the CFG, path condition, or evaluation order. **Response/template.** AST node selection and repair.

**Derivation.** Lower proposed AST to CFG and compare normalized graphs plus side-effect traces. **Difficulty.** L1 inverted arm; L2 while/do-while; L3 short circuit/switch.

**Misconceptions/constraints.** Different but equivalent structuring is accepted. **Feedback.** Provide distinguishing input/path.

**Examples.** 1. then/else swapped without condition inversion → wrong. L1. 2. do/while rewritten as while changes zero-iteration behavior. L2. 3. `&&` rewritten as eager `&` executes skipped call. L3.

**Validation/coverage.** Counterexample generated for every rejected candidate.

### Cross-family progression

Recover diamonds before loops. Pre-test and post-test loops precede induction variables and break/continue. Short-circuit chains precede switches; jump tables and branchless selection are late extensions.

## 8. Category: Recovering expressions, data access, and type evidence

### Category purpose

Train reconstruction of computations and memory organization while distinguishing manifested machine facts from uncertain source types.

### Learn

Widths, extensions, comparison conditions, and address formulas reveal useful type constraints. `[base + index*4]` supports four-byte elements, but does not by itself reveal whether they are signed integers, floats, IDs, or structure fields. Recover the narrowest behaviorally supported claim.

### Prerequisites

Data flow, effective addresses, fixed-width arithmetic, branch predicates, stack/object normalization, and structured control.

### Category boundaries

This category infers expressions and layout. Exact debug types, class hierarchies, and unrestricted source declarations are excluded.

### Subcategories

1. Expression trees and numeric interpretation
2. Arrays, structures, and pointers
3. Bitmasks, scans, and type hypotheses
4. Recovery audits

### Common misconceptions

- Assembly evaluation order is the original source parenthesization.
- `jl` and `jb` express the same type relation.
- A 32-bit load proves a signed `int`.
- Scale 4 always means an array of `int`.
- Any constant offset is a structure field.
- A null-terminated scan proves a specific library call or source language.

### Family `expression_tree_recover`

**Task.** Build a width-aware expression tree for a straight-line value. **Response/template.** Structured expression AST.

**Derivation.** Substitute reaching symbolic definitions, preserving operation width/order and stopping at inputs/loads/calls. **Difficulty.** L1 two operations; L2 reused temporaries; L3 truncation/extension.

**Misconceptions/constraints.** Algebraic rewrites accepted only if fixed-width equivalent. **Feedback.** Expand one definition at a time.

**Examples.** 1. `eax=edi; eax+=3` → `u32(arg1+3)`. L1. 2. `lea eax,[rdi+rdi*2]` → `3*arg1` modulo 32 bits. L2. 3. byte load, sign extend, add → preserve signed extension node. L3.

**Validation/coverage.** AST interpreter equals instruction trace on boundary/random inputs.

### Family `type_signed_unsigned_evidence`

**Task.** Infer signed, unsigned, either, or insufficient comparison interpretation. **Response/template.** Four-way status with evidence.

**Derivation.** Read condition code and operand widths; distinguish comparison interpretation from storage type. **Difficulty.** L1 `jl/jb`; L2 equality; L3 mixed extension evidence.

**Misconceptions/constraints.** Equality gives no signedness evidence; one comparison need not establish declared source type. **Feedback.** State exact manifested relation.

**Examples.** 1. `cmp edi,esi; jl` → signed comparison evidence. L1. 2. `jb` → unsigned comparison evidence. L1. 3. `je` → compatible with either; insufficient. L2.

**Validation/coverage.** Condition table and type-claim confidence.

### Family `type_width_extension`

**Task.** Recover value width and extension/truncation semantics. **Response/template.** Width plus zero/sign/truncate/preserve.

**Derivation.** Follow load/register widths and explicit/implicit extension rules. **Difficulty.** L1 byte/word load; L2 32→64 zeroing; L3 narrow store/reload.

**Misconceptions/constraints.** Machine width is fact; source type name remains hypothesis. **Feedback.** Draw bit slices.

**Examples.** 1. `movzx eax,byte [rdi]` → zero-extend 8→32 then RAX zeroed. L1. 2. `movsx eax,byte [...]` → sign-extend. L1. 3. `mov eax,edi` discards incoming upper 32 bits. L2.

**Validation/coverage.** Bit-vector oracle across extrema.

### Family `data_array_access`

**Task.** Recover array base, index, element stride, and access kind. **Response/template.** Four named fields.

**Derivation.** Normalize base+index*scale+displacement and load/store width; relate loop induction when supplied. **Difficulty.** L1 direct index; L2 biased index/base; L3 pointer induction.

**Misconceptions/constraints.** Stride supports element-size hypothesis but may include structure layout; label confidence. **Feedback.** Render address equation.

**Examples.** 1. `mov eax,[rdi+rcx*4]` → base rdi, index rcx, stride 4, load. L1. 2. `[rdi+rcx*8+16]` → biased region/field hypothesis. L2. 3. pointer increments 4 each loop → sequential 4-byte elements. L3.

**Validation/coverage.** Address formula and concrete randomized addresses.

### Family `data_structure_field`

**Task.** Group constant-offset accesses into a candidate structure layout. **Response/template.** Field interval diagram with confidence.

**Derivation.** Same base-object provenance plus stable offsets/widths; overlapping accesses may be subfields/unions/typed views. **Difficulty.** L2 two disjoint fields; L3 nested pointer; L4 overlap uncertainty.

**Misconceptions/constraints.** Field names/types are synthetic; padding versus unused data may be unknown. **Feedback.** Show observed accesses only.

**Examples.** 1. loads at base+0 width4 and base+8 width8 → two field candidates. L2. 2. pointer loaded at +8 then dereferenced → pointer-like field evidence. L3. 3. width8 and width4 overlap → cannot assert two disjoint source fields. L4.

**Validation/coverage.** Interval layout contains every observed access.

### Family `data_pointer_chase`

**Task.** Recover levels of indirection and access path. **Response/template.** Load/address chain.

**Derivation.** Follow values used as subsequent memory bases. **Difficulty.** L1 one load; L2 two levels; L3 null check/field offset.

**Misconceptions/constraints.** Address calculation is not dereference; alias uncertainty retained. **Feedback.** Draw object/pointer arrows.

**Examples.** 1. `rax=[rdi]; eax=[rax+4]` → load pointer then 4-byte field. L2. 2. `lea rax,[rdi+8]` → address of field, no pointer load. L1. 3. test loaded pointer before dereference → nullable path evidence. L3.

**Validation/coverage.** Memory-event dependency chain exact.

### Family `data_stride_shape`

**Task.** Infer plausible element/record stride from address sequences. **Response/template.** Byte stride and supported interpretations.

**Derivation.** Extract induction increment/scale and accessed offset set. **Difficulty.** L1 power-of-two elements; L2 record stride not legal scale; L3 multiple fields per iteration.

**Misconceptions/constraints.** Stride does not uniquely determine type. **Feedback.** Compare addresses across iterations.

**Examples.** 1. pointer `+=8` each iteration → stride 8. L1. 2. pointer `+=24`, accesses +0/+8 → 24-byte record candidate. L2. 3. index*4 plus field offset → 4-byte spacing, meaning unknown. L2.

**Validation/coverage.** Symbolic recurrence and observed intervals.

### Family `data_bitmask_enum`

**Task.** Recover tests/updates on bit flags or small enum-like values. **Response/template.** Mask, operation, condition, and cautious role label.

**Derivation.** Normalize AND/OR/XOR/test/compare expressions and branch predicate. **Difficulty.** L1 single-bit test; L2 set/clear/toggle; L3 multi-bit field.

**Misconceptions/constraints.** A constant comparison alone does not prove source `enum`; labels say “enum-like.” **Feedback.** Show affected bits.

**Examples.** 1. `test edi,4; jne` → test whether bit 2 set. L1. 2. `or edi,8` → set bit 3. L1. 3. `(x & 0x30)>>4` → extract two-bit field. L3.

**Validation/coverage.** Exhaustive small-bit truth table.

### Family `data_bounded_scan`

**Task.** Recover the behavior of a bounded byte/element scan. **Response/template.** Select summary and stop conditions.

**Derivation.** Identify pointer/index induction, load width, match/terminator test, and explicit bound. **Difficulty.** L2 terminator scan; L3 find-first/count; L4 two stop conditions.

**Misconceptions/constraints.** Use bounded synthetic buffers; do not claim exact library function. **Feedback.** Trace one iteration and exits.

**Examples.** 1. advance bytes until zero or bound → bounded string-length-like scan. L2. 2. return index of target byte else -1 → find-first. L3. 3. count matching 32-bit elements over n → count-matches. L3.

**Validation/coverage.** Exhaustive short arrays and boundary lengths.

### Family `data_bounds_check`

**Task.** Recover a bounds predicate protecting an access. **Response/template.** Range plus guarded access.

**Derivation.** Combine predecessor branch constraints with index domain and access path. **Difficulty.** L2 unsigned upper bound; L3 signed lower+upper; L4 biased index.

**Misconceptions/constraints.** Presence of a compare does not prove security purpose; describe structural guarding only. **Feedback.** Show which paths reach access.

**Examples.** 1. unsigned `index < length` dominates array load → upper-bound guard. L2. 2. signed `index>=0 && index<n` → two-sided guard. L3. 3. subtract 5 then unsigned compare implements range 5..9. L4.

**Validation/coverage.** Path predicate implies in-range access for all bounded values.

### Family `type_hypothesis_rank`

**Task.** Rank candidate source-like types from observed widths, operations, and uses. **Response/template.** Supported/possible/contradicted for each candidate.

**Derivation.** Apply explicit constraints: width, signed comparison, arithmetic, dereference, alignment; preserve equivalent candidates. **Difficulty.** L2 width-only; L3 signedness/pointer use; L4 conflicting casts/reuse.

**Misconceptions/constraints.** Never require exact typedef/name. **Feedback.** Separate facts from candidate interpretations.

**Examples.** 1. 64-bit value used as mapped address → pointer-like strongly supported. L2. 2. 32-bit equality-only value → signed/unsigned both possible. L2. 3. sign-extended byte then signed compare → signed 8-bit origin supported. L3.

**Validation/coverage.** Constraint solver status and generated source candidates.

### Family `expression_data_audit`

**Task.** Find an overclaim or semantic error in recovered expression/layout/type pseudocode. **Response/template.** Node/claim selection and repair.

**Derivation.** Compare candidate AST and claims with bit-vector, memory, and evidence oracles. **Difficulty.** L1 wrong operator; L2 signedness/width; L3 alias/layout/type overclaim.

**Misconceptions/constraints.** One primary error; equivalent algebra accepted. **Feedback.** Give distinguishing boundary input or evidence gap.

**Examples.** 1. `lea` rendered as load → wrong. L1. 2. unsigned branch rendered signed → counterexample `0xffffffff`. L2. 3. stride 4 asserted “definitely int array” → overclaim. L2.

**Validation/coverage.** Every rejection has concrete counterexample or confidence-rule violation.

### Cross-family progression

Recover pure expression trees before type evidence. Width and signedness precede arrays/structures. Pointer chains, masks, scans, and guards culminate in cautious type/layout audits.

## 9. Category: Compiler idioms and optimization-aware recovery

### Category purpose

Train recognition of behavior preserved across common code-generation transformations without treating one byte pattern as one source statement.

### Learn

Optimizers fold constants, remove dead work, combine arithmetic, invert branches, inline helpers, and choose branchless forms. Recognize the resulting semantics. The same machine idiom can come from several source expressions, and the same source can compile many ways.

### Prerequisites

Expression recovery, CFG structure, data flow, fixed-width semantics, and function calls.

### Category boundaries

This is semantic idiom recognition, not compiler fingerprinting, performance prediction, or deobfuscation.

### Subcategories

1. Tests and arithmetic identities
2. Branchless and strength-reduced forms
3. Code motion, inlining, and cold paths
4. Optimization audits

### Common misconceptions

- XOR-zero always proves a source assignment of literal zero.
- Multiplication by a constant must appear as `imul`.
- Branchless code always runs faster.
- Missing source operations were never present.
- Inlined code remains a separately called function.
- An unusual pattern uniquely identifies a compiler/version.

### Family `idiom_zero_boolean_test`

**Task.** Normalize common zero/nonzero and boolean-materialization idioms. **Response/template.** Controlled predicate/expression.

**Derivation.** Apply exact semantics of `test x,x`, `or x,x`, `xor reg,reg`, and `setcc` sequences. **Difficulty.** L1 zero test; L2 boolean result; L3 width/partial register.

**Misconceptions/constraints.** Clearing register destroys prior value; zero-test instructions differ in writes. **Feedback.** Show effects and predicate.

**Examples.** 1. `test edi,edi; je` → `arg1==0`. L1. 2. `xor eax,eax` → EAX/RAX zero. L1. 3. `test; setne al; movzx eax,al` → normalize to boolean nonzero. L2.

**Validation/coverage.** Exhaustive small-width semantics and flag/write effects.

### Family `idiom_arithmetic_identity`

**Task.** Recover a compact arithmetic expression from an instruction idiom. **Response/template.** Expression AST.

**Derivation.** Compose LEA/add/sub/neg shifts under fixed width. **Difficulty.** L1 add/sub; L2 `lea` multiply-add; L3 several terms.

**Misconceptions/constraints.** Do not simplify across signed-overflow assumptions not present in bit-vector semantics. **Feedback.** Expand coefficients.

**Examples.** 1. `lea eax,[rdi+rdi*2]` → `3*x` modulo 32. L2. 2. `neg eax; add eax,5` → `5-x`. L2. 3. `lea rax,[rdi+rsi*4+8]` → address/arithmetic expression. L3.

**Validation/coverage.** Bit-vector equivalence.

### Family `idiom_power_of_two`

**Task.** Recognize power-of-two tests, scaling, alignment, or remainder idioms. **Response/template.** Select behavior and preconditions.

**Derivation.** Apply mask/shift identities with declared unsigned/fixed-width domains. **Difficulty.** L2 mask/remainder; L3 power-of-two predicate; L4 signed caveats.

**Misconceptions/constraints.** `(x&(x-1))==0` also accepts zero unless excluded. **Feedback.** Show decisive bit patterns/precondition.

**Examples.** 1. `x & 7` → unsigned remainder mod 8. L1. 2. `(x+15)&~15` → round up to 16 under no-wrap precondition. L3. 3. `x!=0 && (x&(x-1))==0` → power of two. L3.

**Validation/coverage.** Exhaustive bounded domain including zero/max.

### Family `idiom_branchless_boolean`

**Task.** Recover boolean or selection behavior from arithmetic/mask code without branches. **Response/template.** `Compare`, `Select`, or normalized 0/1 expression.

**Derivation.** Trace flags/masks and prove output set. **Difficulty.** L2 `setcc`; L3 mask select; L4 sign-bit arithmetic.

**Misconceptions/constraints.** Avoid implementation-defined source shifts unless pseudocode explicitly uses bit vectors. **Feedback.** Table condition versus output.

**Examples.** 1. `setl al` → 0/1 signed-less result. L2. 2. all-zero/all-one mask selects two pure values. L3. 3. `neg; sbb` mask idiom only under exact flag trace. L4.

**Validation/coverage.** Exhaustive flags and operand boundaries.

### Family `idiom_strength_reduction`

**Task.** Recognize a multiplication/division-like computation realized with shifts/adds or reciprocal-free power-of-two operations. **Response/template.** Source-like operation plus exact domain/preconditions.

**Derivation.** Bit-vector equivalence with rounding/sign rules. **Difficulty.** L2 multiplication; L3 unsigned division; L4 signed correction sequence.

**Misconceptions/constraints.** Shift and signed division rounding may differ. **Feedback.** Compare boundary/negative cases.

**Examples.** 1. `shl eax,2` → multiply by 4 modulo 32. L1. 2. unsigned `shr eax,3` → floor divide by 8. L2. 3. signed bias+SAR sequence → truncation-toward-zero division when proven. L4.

**Validation/coverage.** Exhaustive small widths and boundary-focused 32-bit tests.

### Family `idiom_code_motion`

**Task.** Identify a loop-invariant computation or hoisted check and explain its relation to the loop. **Response/template.** Instruction/expression selection plus invariant reason.

**Derivation.** Verify operands' definitions dominate loop and are not modified within it. **Difficulty.** L2 constant/base; L3 load with nonalias proof; L4 branch preheader.

**Misconceptions/constraints.** Visual placement outside loop is not enough; memory invariance needs alias evidence. **Feedback.** Show definitions and loop writes.

**Examples.** 1. constant stride computed in preheader → invariant. L2. 2. array base address computed once outside loop. L2. 3. load cannot be called invariant when loop may alias-write it. L3.

**Validation/coverage.** Loop def/use and alias oracle.

### Family `idiom_inlining`

**Task.** Recognize behavior equivalent to an inlined known helper versus an actual call. **Response/template.** Supported/possible/not supported with region mapping.

**Derivation.** Compare subgraph semantics to reviewed helper template and absence/presence of call boundary. **Difficulty.** L2 tiny helper; L3 helper with branch; L4 several equivalent sources.

**Misconceptions/constraints.** Semantic match does not establish compiler action or original function existence. **Feedback.** Say “equivalent to inlined helper,” not historical certainty.

**Examples.** 1. clamp body embedded with no call → clamp-like region; inlining possible. L2. 2. direct call remains → not inlined at that site. L1. 3. repeated sequence supports shared helper hypothesis but does not prove source. L3.

**Validation/coverage.** Semantic graph equivalence and confidence rules.

### Family `idiom_cold_error_path`

**Task.** Identify a likely cold/nonreturning validation path from branch layout and trusted call metadata. **Response/template.** Path selection plus evidence.

**Derivation.** Use noreturn/import summary, rare-path annotation only if supplied, and main-flow continuation. **Difficulty.** L2 guard+abort; L3 shared failure block; L4 probability unknown.

**Misconceptions/constraints.** Address layout alone does not establish frequency. **Feedback.** Separate nonreturn fact from coldness hypothesis.

**Examples.** 1. failed guard calls trusted noreturn helper → error exit established. L2. 2. several checks share it → shared failure block. L3. 3. “cold” remains possible unless profile/metadata says so. L3.

**Validation/coverage.** Claim status tied to metadata, not layout heuristic.

### Family `idiom_removed_redundancy`

**Task.** Explain why an expected source-level operation or variable may be absent. **Response/template.** Optimization explanation choice supported by semantic comparison.

**Derivation.** Compare unoptimized template IR with optimized fixture: constant fold, dead-code elimination, copy elimination, common subexpression. **Difficulty.** L2 one removal; L3 merged operations; L4 several possible histories.

**Misconceptions/constraints.** Never claim exact transformation when multiple histories yield same code. **Feedback.** Show equivalent observable behavior.

**Examples.** 1. unused assignment absent → consistent with dead-store elimination. L2. 2. constant branch removed → constant folding. L2. 3. one computation reused → common-subexpression-like, not historical proof. L3.

**Validation/coverage.** Source templates and optimized semantics equivalent.

### Family `idiom_analysis_audit`

**Task.** Diagnose an overconfident or semantically wrong compiler-idiom claim. **Response/template.** Claim selection and cautious correction.

**Derivation.** Check bit-vector equivalence, preconditions, and evidence confidence. **Difficulty.** L1 pattern mismatch; L2 missing zero/signed caveat; L3 compiler-history claim.

**Misconceptions/constraints.** One primary fault. **Feedback.** Give counterexample or alternate source.

**Examples.** 1. `x&(x-1)==0` called power-of-two without excluding zero → incomplete. L2. 2. SAR called signed `/2` for all negatives → rounding error. L3. 3. idiom said to prove compiler version → unsupported. L2.

**Validation/coverage.** Counterexample generator and claim-status audit.

### Cross-family progression

Begin with tests and arithmetic, then power-of-two and branchless forms. Code motion and inlining require CFG/data flow; historical/compiler claims remain explicitly uncertain.

## 10. Category: Symbols, relocations, cross-references, and uncertainty

### Category purpose

Train evidence-based use of binary metadata and indirect references without mistaking convenient labels for recovered semantics.

### Learn

Symbols, imports, relocations, and cross-references can strongly constrain an analysis. A relocation can establish which object an address refers to; an imported function summary can establish call effects. A nearby string or familiar symbol does not by itself prove the whole function's purpose.

### Prerequisites

Functions, calls, address expressions, CFGs, and evidence-confidence states.

### Category boundaries

This category uses fixture metadata, not full ELF parsing or tool-specific command memorization.

### Subcategories

1. Symbol and relocation evidence
2. Imports and cross-references
3. Indirect targets
4. Confidence and evidence audits

### Common misconceptions

- Stripped binaries contain no useful structure.
- A symbol name is always truthful and complete.
- Referencing a string proves the function's purpose.
- Every indirect call target is unknowable.
- Heuristics become facts when several weak cues agree.

### Family `evidence_symbol_scope`

**Task.** State exactly what a symbol/section label establishes. **Response/template.** Claim status choice.

**Derivation.** Read symbol kind, binding, extent, trust level, and section metadata. **Difficulty.** L1 trusted function symbol; L2 local/object symbol; L3 stripped/incomplete extents.

**Misconceptions/constraints.** Names may aid display but do not replace behavioral analysis. **Feedback.** List guaranteed and nonguaranteed facts.

**Examples.** 1. trusted function symbol at address → entry established. L1. 2. symbol size bounds bytes in fixture but not semantic exits. L2. 3. no symbol → function may still exist. L1.

**Validation/coverage.** Metadata schema determines allowed claims.

### Family `evidence_relocation_reference`

**Task.** Resolve a relocation-backed code/data reference and describe its kind. **Response/template.** Target object/symbol plus address-versus-content role.

**Derivation.** Apply pre-resolved relocation record to instruction operand. **Difficulty.** L2 RIP-relative object; L3 pointer table/import slot; L4 addend.

**Misconceptions/constraints.** Learner need not perform linker internals beyond shown rule. **Feedback.** Show place, addend, resolved target.

**Examples.** 1. RIP-relative LEA relocation to `table` → table address. L2. 2. load through import slot → loaded target pointer. L3. 3. relocation plus field addend → interior address. L3.

**Validation/coverage.** Relocation resolution matches bundled object metadata.

### Family `evidence_import_call`

**Task.** Use a declared import summary to refine arguments, clobbers, return, and nonreturn behavior. **Response/template.** Call-effect fields.

**Derivation.** Compose ABI locations with trusted summary. **Difficulty.** L1 pure helper; L2 memory read/write; L3 nonreturn/nullable result.

**Misconceptions/constraints.** Function name alone is not summary; fixture supplies reviewed contract. **Feedback.** Separate ABI defaults from import-specific effects.

**Examples.** 1. declared `length(ptr)` reads bytes and returns size in RAX. L2. 2. declared pure compare does not write pointed objects. L2. 3. declared failure helper does not return. L2.

**Validation/coverage.** Summary-driven interpreter and data-flow clobbers.

### Family `evidence_string_xref`

**Task.** Interpret what a string/data cross-reference supports about a code region. **Response/template.** Supported/possible/unsupported claim.

**Derivation.** Trace address reaching a call/store/compare and combine with call summary. **Difficulty.** L2 direct print-like call; L3 table/shared string; L4 nearby but unreferenced.

**Misconceptions/constraints.** Strings are benign synthetic messages; no secrets. **Feedback.** Show exact use chain.

**Examples.** 1. address of “invalid input” passed to declared logging helper → error-message use supported. L2. 2. string merely adjacent in section → no relationship. L1. 3. shared xref from two functions → does not assign both same purpose. L3.

**Validation/coverage.** Cross-reference and reaching-argument chain.

### Family `evidence_indirect_target_set`

**Task.** Recover the bounded possible targets of an indirect call/jump from supplied table/value facts. **Response/template.** Address/symbol set.

**Derivation.** Propagate pointer candidates or enumerate in-range table entries. **Difficulty.** L2 two constants; L3 jump table; L4 may-target unknown included.

**Misconceptions/constraints.** No speculative arbitrary target scanning. **Feedback.** Trace each candidate provenance.

**Examples.** 1. branch assigns RAX=&f or &g then `call rax` → `{f,g}`. L2. 2. bounded table indices 0..2 → three targets. L3. 3. unconstrained input pointer → unknown, not “all functions.” L3.

**Validation/coverage.** Candidate-set abstract interpretation.

### Family `evidence_confidence_rank`

**Task.** Rank competing recovery claims by evidence and assumptions. **Response/template.** Ordered claims or status per claim.

**Derivation.** Apply established/supported/possible/contradicted/insufficient rubric. **Difficulty.** L2 direct versus pattern evidence; L3 several weak cues; L4 contradictory cue.

**Misconceptions/constraints.** Confidence is categorical and justified, not a fake percentage. **Feedback.** Evidence table.

**Examples.** 1. direct branch target is code boundary established by trusted listing. L1. 2. classic prologue alone makes function entry possible. L2. 3. behavioral equivalence to `max` supports max-like summary but not original name. L3.

**Validation/coverage.** Rule-based status with required evidence IDs.

### Family `evidence_analysis_audit`

**Task.** Find an evidence claim that exceeds what symbols/xrefs/patterns establish. **Response/template.** Claim selection and downgraded/repaired statement.

**Derivation.** Verify evidence entailment and assumptions. **Difficulty.** L1 proximity error; L2 name overtrust; L3 combined weak evidence.

**Misconceptions/constraints.** One primary overclaim; no real-person attribution. **Feedback.** State strongest warranted claim.

**Examples.** 1. nearby string treated as referenced → unsupported. L1. 2. import name treated as full behavior without summary → unsupported. L2. 3. familiar idiom treated as exact source/compiler proof → downgrade to possible. L3.

**Validation/coverage.** Each bad claim has an explicit counterfixture.

### Cross-family progression

Start with trusted symbols and resolved relocations, then imports and xrefs. Indirect target sets precede confidence ranking; auditing teaches the learner to stop at the evidence boundary.

## 11. Category: Integrated code recovery

### Category purpose

Combine structural, data-flow, ABI, and evidence skills into cautious whole-function behavioral recovery.

### Learn

A useful recovery report answers: What are the inputs and observable effects? What values are returned? What control structure and memory accesses implement them? Which facts are certain, which summaries are equivalent, and which source details cannot be known?

### Prerequisites

Mastery of the relevant earlier categories. Integrated items introduce no more than one new idiom.

### Category boundaries

Functions remain small, benign, bounded, and generated. Free-form decompilation and arbitrary binaries remain excluded.

### Subcategories

1. Behavioral summaries
2. Structured pseudocode
3. Variable roles and competing recoveries
4. Evidence reports

### Common misconceptions

- A plausible story is enough to name a function.
- Decompiled syntax is the original source.
- Equivalent pseudocode must use the same variables and loop form.
- More detailed recovery is always more accurate.
- One passing example proves equivalence.

### Family `integrated_function_summary`

**Task.** Select or assemble the strongest supported input/effect/output summary. **Response/template.** Controlled summary fields.

**Derivation.** Compose ABI inputs, reachable effects, loop/condition semantics, calls, and return expressions. **Difficulty.** L2 one branch; L3 bounded loop; L4 memory+helper.

**Misconceptions/constraints.** Labels describe observable behavior, not application purpose. **Feedback.** Cite blocks/def-use chains for every clause.

**Examples.** 1. “returns larger signed 32-bit input” for max-like function. L2. 2. “sums n 32-bit elements and returns modulo-32 result.” L3. 3. “returns first matching index or -1 without writing input.” L4.

**Validation/coverage.** Summary schema evaluated against exhaustive/bounded fixtures.

### Family `integrated_pseudocode_build`

**Task.** Construct complete structured pseudocode AST for a small function. **Response/template.** Block/AST editor.

**Derivation.** Combine structured CFG recovery, expressions, variables, memory effects, and returns; normalize accepted equivalents. **Difficulty.** L2 straight/if; L3 loop; L4 loop+conditional/call.

**Misconceptions/constraints.** Preserve fixed-width semantics and effects; alpha-renaming allowed. **Feedback.** Map each AST node back to blocks/instructions.

**Examples.** 1. absolute-value-like branch and return. L2. 2. counted sum loop. L3. 3. bounded find-first with early return. L4.

**Validation/coverage.** Lowered AST CFG plus behavioral equivalence on exhaustive small domains/random boundaries.

### Family `integrated_variable_roles`

**Task.** Assign cautious semantic roles to recovered values, such as index, bound, accumulator, pointer, flag, result, or temporary. **Response/template.** Value-node to role mapping with confidence.

**Derivation.** Use recurrence, comparisons, address use, aggregation, and return/effect chains. **Difficulty.** L2 obvious induction/accumulator; L3 reused registers; L4 multiple plausible roles.

**Misconceptions/constraints.** Roles are synthetic and alpha-renamable; never claim original names. **Feedback.** Cite behavior defining each role.

**Examples.** 1. starts 0, increments, compared to n, indexes array → index. L2. 2. starts 0, repeatedly adds elements, returned → accumulator/result. L2. 3. pointer advances with index; either pointer iterator or derived address accepted. L3.

**Validation/coverage.** Role constraints and accepted alternative set.

### Family `integrated_candidate_compare`

**Task.** Compare two plausible recoveries and identify whether they are equivalent, one is stronger, or one is wrong. **Response/template.** Relation plus distinguishing input/evidence.

**Derivation.** Compare AST semantics, CFG effects, claim assumptions, and supported domains. **Difficulty.** L2 loop-form equivalence; L3 signed boundary/short circuit; L4 type-detail overclaim.

**Misconceptions/constraints.** Syntactic difference alone is not semantic difference. **Feedback.** Produce proof mapping or counterexample.

**Examples.** 1. `while` and equivalent `for` over same recurrence → equivalent. L2. 2. signed max versus unsigned max differ at high-bit input. L3. 3. “array of int” versus “4-byte elements” → latter is better supported. L3.

**Validation/coverage.** Equivalence checker/counterexample generator plus evidence lattice.

### Family `integrated_recovery_report`

**Task.** Complete a compact evidence-linked report for a 5–20-block function. **Response/template.** Sections for boundaries, CFG, interface, frame, behavior, uncertainties, and evidence.

**Derivation.** Query all analysis layers and require each claim to link to supporting node/edge/row. **Difficulty.** L3 scaffolded fields; L4 partial construction; L5 mixed alternatives/unknowns.

**Misconceptions/constraints.** Detail unsupported by evidence lowers correctness; no unrestricted prose grading. **Feedback.** Layered report diff with counterexamples.

**Examples.** 1. four-block clamp-like function with no stack frame. L3. 2. loop summing structure fields with one call summary. L4. 3. switch-like dispatcher where source `switch` versus if-chain remains unknown. L5.

**Validation/coverage.** Cross-layer invariant suite; every claim has evidence or explicit assumption.

### Cross-family progression

Start with selected summaries, then complete ASTs and variable roles. Candidate comparison teaches equivalence and restraint before the final evidence-linked recovery report.

## 12. Topic-level progression

### Level 1: Listing and local facts

- read addresses, lengths, operands, and next addresses;
- classify local instruction effects;
- resolve direct targets and simple flag chains;
- identify obvious leaders, blocks, and edges;
- trace simple stack deltas and ABI inputs.

### Level 2: Graphs and function structure

- construct diamonds and small loops;
- distinguish call, return-site, and tail hypotheses;
- recover classic/omitted frames and slots;
- compute straight-line def-use, constants, and expression trees;
- recover one `if`, loop, or array access.

### Level 3: Path-sensitive recovery

- dominance, natural loops, multiple reaching definitions, liveness, and aliases;
- shared exits, wrappers, short-circuiting, switch chains, and jump tables;
- type constraints, pointer chains, scans, bounds, and compiler idioms;
- evidence confidence and alternate structures.

### Level 4: Optimization-aware synthesis

- frame-pointer omission with calls and reused slots;
- branchless/strength-reduced forms and code motion;
- structured pseudocode with loops, effects, and calls;
- compare behavioral candidates with counterexamples;
- retain unknowns rather than invent source details.

### Level 5: Evidence-linked recovery

- analyze 5–20-block, 10–80-instruction synthetic functions;
- produce a complete structured report;
- justify every claim by listing, graph, data-flow, ABI, or metadata evidence;
- distinguish established behavior, supported hypotheses, possible alternatives, and insufficient evidence.

Mastery is tracked separately for listing, CFG, ABI/functions, stack, data flow, control recovery, data/type recovery, idioms, evidence, and synthesis.

## 13. Adaptive guidance

| Error | Route to |
|---|---|
| target uses branch address instead of next RIP | direct-target arithmetic pair |
| row after call always made a leader | call-versus-branch boundary contrast |
| conditional missing fallthrough | two-successor diagram |
| backward edge called loop automatically | dominance-before-back-edge drill |
| classic prologue required | leaf/frame-pointer-omission contrast |
| all ABI registers called parameters | incoming-use analysis |
| stack offset sign/delta wrong | SP0 ruler trace |
| nearest textual definition selected | branch-merge reaching-definition drill |
| one path constant guessed at merge | join-lattice visualization |
| register treated as permanent variable | live-range renaming |
| taken target assumed source `then` | condition inversion pair |
| while/do-while confused | zero-iteration contrast |
| eager and short-circuit conflated | side-effect trace |
| scale/width promoted to exact type | evidence-confidence downgrade |
| idiom treated as compiler fingerprint | alternate-source examples |
| plausible story replaces behavior | summary fields tied to evidence |

Recommended mix after onboarding: 35% weakest mechanism, 25% spaced review, 20% contrast pairs, 15% multi-layer synthesis, 5% evidence/uncertainty audits.

Hints reveal layers in order: instruction effects, targets, block boundaries, CFG, def-use, then source-like structure. A hint must not reveal an original-source fiction.

## 14. Answer checking and feedback

### Structured checking

Use:

- address/row/block selection;
- node/edge sets;
- path ordering;
- named stack/ABI fields;
- expression/statement AST editors;
- interval diagrams;
- claim status and evidence-link controls.

Free-form prose and arbitrary C are not graded.

### Graph and analysis normalization

- Block identity is start address plus fixture version.
- Graph layout coordinates are ignored.
- Edge sets normalize by source, target, and kind.
- Dominators, loops, liveness, reaching defs, and aliases are recomputed rather than copied from authored answers.
- Pseudocode alpha-renaming and safe condition inversion are accepted.
- `for`, `while`, and certain guard-clause forms may be accepted as equivalent when lowering yields the same control/effect semantics.
- Ordering differences are rejected when calls, loads/stores, faults in the declared model, or short-circuit effects could differ.

### Behavioral equivalence

Use multiple layers:

1. exact AST normalization for simple forms;
2. CFG/effect graph equivalence;
3. exhaustive execution for small finite domains;
4. boundary-focused and deterministic randomized execution for wider domains;
5. build-time solver/cross-tool validation where useful.

Testing is evidence, not a proof for unrestricted programs. Accepted families are designed so the structural oracle supplies the proof obligation.

### Feedback order

Feedback should:

1. state the strongest correct fact or summary;
2. point to exact rows/blocks/edges;
3. show stack/data-flow/condition derivation;
4. identify the learner's likely misconception;
5. give a distinguishing input or counterpath when rejecting a plausible candidate;
6. list accepted alternatives and remaining uncertainty.

## 15. Rendering and accessibility requirements

- Listing columns remain aligned at zoom without relying on spaces alone; semantic cells use proper markup.
- Addresses, bytes, mnemonics, operands, symbols, and comments can be independently toggled to control scaffolding.
- Each instruction has an accessible verbal effect summary.
- CFGs use semantic SVG/HTML with synchronized block-list and edge-table views.
- Graph nodes/edges are keyboard navigable and announce predecessor/successor/kind.
- Taken/fallthrough/call edges differ by label/pattern as well as color.
- Selecting a row highlights its block, def-use chains, stack effects, and pseudocode mapping across views.
- Stack grows in a clearly labeled direction and has a table alternative.
- AST construction supports keyboard/chip controls without drag-and-drop.
- Long listings provide sticky addresses, minimap/outline, block collapse, and focus mode.
- No essential task uses rapid animation, tiny hex text, or color-only aliases.

## 16. Generator and implementation architecture

### Semantic-first fixture

```text
RecoveryFixture {
  seed
  contentVersion
  architectureProfile
  abiProfile
  objectProfile
  compilerProvenance?
  semanticProgramIR
  acceptedPseudocodeIR[]
  instructionRows[]
  functions[]
  cfg
  callGraph
  stackObjects[]
  symbols[]
  relocations[]
  callSummaries[]
  analysisFacts
  acceptedClaims[]
  misconceptionTags[]
}
```

Generation order:

1. choose benign semantic template and typed bit-vector domain;
2. generate source-independent IR and observable behavior;
3. lower through controlled compiler-pattern transforms or select a validated build fixture;
4. parse disassembly into instruction AST;
5. build blocks, CFG, call/stack/data-flow facts independently;
6. validate behavior against semantic IR;
7. derive questions, distractors, hints, and explanations.

### Offline/runtime constraint

The standalone app bundles fixtures and table-driven JavaScript analyzers. Compilers, assemblers, disassemblers, ELF tools, and solvers may be used only in reproducible development/build tests. They do not run in the learner's browser, and no backend is required.

### Localization

Mnemonics, register names, addresses, symbols that belong to the fixture, and pseudocode operators remain invariant. UI instructions, role names, confidence labels, summaries, hints, and feedback are localizable. Localized prose must not change signedness, edge polarity, may/must status, or evidence strength.

## 17. Automated validation

For every fixture:

- instruction rows parse uniquely under the pinned profile;
- bytes, length, next RIP, operands, and disassembly metadata agree;
- all direct/declared indirect targets are valid boundaries;
- block partition covers each code instruction exactly once;
- CFG successors match every terminator and call summary;
- reachability, predecessors, dominators, postdominators, and natural loops recompute;
- function candidates and claim confidence use only declared evidence;
- every path to ordinary return restores RSP and callee-saved state as required;
- call-site alignment and argument locations validate;
- stack accesses normalize to mapped intervals and declared lifetimes;
- reaching definitions, liveness, constants, ranges, aliases, and flag provenance reach fixed points;
- abstract results overapproximate all bounded concrete traces;
- pseudocode lowering preserves CFG, branch predicates, side-effect order, widths, signedness, and memory objects;
- accepted alternatives are equivalent in the declared domain;
- every rejected candidate has a structural mismatch, evidence violation, or concrete counterexample;
- every loop has a proven fixture bound for dynamic validation;
- symbols, relocations, xrefs, and call summaries resolve;
- every explanation references the same oracle facts;
- safety/content filters pass.

Build/regression testing:

- assemble/disassemble round trips for every allowed instruction form;
- dual disassembler agreement on boundaries for generated fixtures, with manual fixture oracle decisive on disagreement;
- interpreter versus compiled reference behavior on deterministic boundary/random cases;
- exhaustive small-width branch, condition-inversion, bitmask, and idiom identities;
- graph algorithms cross-checked by independent implementations on small CFGs;
- stack normalization randomized over valid SP0 bases;
- path enumeration cross-checks data-flow facts on small acyclic/bounded-loop graphs;
- mutation tests for every listing, CFG, ABI, stack, data-flow, AST, and evidence invariant;
- at least `10,000` deterministic seeds per combinatorial family/level;
- content scans preventing real secrets, proprietary binaries, operational abuse, or unsafe imported samples.

No validator may promote “two tools agree” into proof of source intent.

## 18. Coverage requirements

The initial specification defines exactly 100 stable families:

| Category | Families |
|---|---:|
| Reading disassembly listings | 10 |
| Basic blocks and control-flow graphs | 12 |
| Functions, calls, and ABI evidence | 11 |
| Stack frames and local storage | 10 |
| Data flow and abstract values | 11 |
| Recovering structured control flow | 12 |
| Recovering expressions, data access, and type evidence | 12 |
| Compiler idioms and optimization-aware recovery | 10 |
| Symbols, relocations, cross-references, and uncertainty | 7 |
| Integrated code recovery | 5 |
| **Total** | **100** |

Across a long mixed session:

- at least 60% of questions involve more than one instruction;
- at least 30% after Level 2 involve a complete CFG region;
- direct/conditional/unconditional/call/return/indirect edges all recur;
- signed and unsigned path conditions appear in deliberate contrast;
- prologue-free functions and frame-pointer omission prevent signature dependence;
- unique and multiple reaching-definition cases are balanced;
- `unknown`, `may alias`, `possible`, and `insufficient evidence` appear as correct answers;
- `if`, guard, while, do/while, counted loop, short circuit, chain dispatch, jump table, and branchless select all appear;
- accepted equivalent pseudocode forms recur;
- at least 20% of advanced recovery items explicitly ask what cannot be recovered;
- integrated items combine no more than three newly interacting mechanisms;
- all content remains synthetic/licensed and benign.

## 19. Recommended views and v1 priorities

Recommended navigation:

1. Listings
2. Blocks & CFG
3. Functions & ABI
4. Stack Frames
5. Data Flow
6. Control Recovery
7. Data & Types
8. Idioms & Evidence
9. Code Recovery Lab

Recommended v1:

- 15–40-instruction AMD64 listings;
- direct branches/calls and ordinary returns;
- leaders, block boundaries, edges, diamonds, and one natural loop;
- classic and omitted frame pointers with constant stack size;
- first six integer arguments and RAX returns;
- reaching definitions, constants, and simple liveness;
- `if`, guard, while, counted loop, short circuit;
- expression trees, array indexing, widths, and signedness evidence;
- selected summaries and small structured pseudocode;
- evidence confidence and explicit unknowns.

Defer jump tables, indirect calls, canaries, stack arguments, complex slot reuse, pointer-rich structures, ordered optimization idioms, and 20-block integrated reports until the v1 oracles and UI are proven.

## 20. Topic-level quality checklist

- [ ] The app trains multi-instruction structure and behavior, not duplicate opcode trivia.
- [ ] Architecture, ABI, object format, syntax, and compiler provenance are explicit.
- [ ] Basic-block leader and call-splitting rules are pinned.
- [ ] Call, continuation, tail, and intraprocedural edges remain distinct.
- [ ] Function boundaries are hypotheses unless trusted metadata establishes them.
- [ ] Prologues are evidence, never universal requirements.
- [ ] Stack slots are normalized by base, delta, width, and lifetime.
- [ ] Register reuse does not force one source variable.
- [ ] Data-flow joins are conservative and expose unknowns.
- [ ] Signedness and width are preserved through every recovery.
- [ ] CFG structure, dominance, and path predicates drive control recovery.
- [ ] Short-circuit/effect order is never flattened unsafely.
- [ ] Jump-table and indirect targets are bounded by fixture metadata.
- [ ] Type and intent claims stop at the available evidence.
- [ ] Accepted pseudocode is structured and behaviorally validated.
- [ ] Equivalent alternatives are accepted; exact original source is never promised.
- [ ] Compilers/disassemblers run only during development validation.
- [ ] The standalone app contains no native executor, backend, or runtime compiler.
- [ ] Fixtures are synthetic/licensed, benign, and non-operational.
- [ ] Every distractor represents a named misconception.
- [ ] Every family has difficulty progression, three examples, feedback, and validation.
