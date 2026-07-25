# AMD64 Assembly Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, architectural simulator, assembler/parser, and UI implementers

## 1. Topic overview

### Goal

Develop an exact working model of a useful AMD64 subset: register aliases, operand widths, effective addresses, integer instruction and flag effects, signed/unsigned conditions, stack/call behavior, and the System V AMD64 calling convention.

The app trains architectural reasoning. It does not pretend that the entire x86 family or a particular processor’s performance can fit into one small simulator.

### Architecture contract

The model ID is `amd64-long-sysv-v1`:

- AMD64 64-bit long mode;
- user-mode integer instructions only;
- 64-bit general-purpose registers `RAX…R15`, `RSP`, `RBP`, and `RIP`;
- little-endian byte-addressed memory;
- canonical Intel syntax for production;
- controlled GNU/AT&T syntax translation;
- System V AMD64 ABI for calling-convention questions;
- exact architectural results, not microarchitectural timing.

All memory addresses used for access are mapped and canonical in generated traces. Address-size overrides, segmentation effects, paging, faults, privilege levels, and concurrency are excluded.

### Register-width contract

Register families include:

- `RAX/EAX/AX/AL` and `AH`;
- corresponding legacy `RBX/RCX/RDX` families;
- `RSI/ESI/SI/SIL`, `RDI/EDI/DI/DIL`, `RBP/EBP/BP/BPL`, `RSP/ESP/SP/SPL`;
- `R8/R8D/R8W/R8B` through `R15`.

Writing a 32-bit GPR zeroes the upper 32 bits of its 64-bit parent. Writing an 8- or 16-bit subregister preserves all other bits. High-byte registers `AH/BH/CH/DH` are recognized, but generated encoding questions never combine them with an instruction requiring a REX prefix.

All arithmetic is modulo the operand width unless signed widening or full-product behavior is explicitly stated.

### Flags contract

The modeled `RFLAGS` subset is:

- `CF`: unsigned carry/borrow;
- `PF`: even parity of the low result byte;
- `AF`: carry/borrow between bits 3 and 4;
- `ZF`: result zero;
- `SF`: result sign bit;
- `OF`: signed overflow;
- `DF`: string direction, recognized but string instructions excluded initially.

For `ADD`, `SUB`, and `CMP`, all six arithmetic flags above are computed. `CMP dst,src` sets flags as if `dst-src` and stores no result.

`AND/OR/XOR/TEST` clear CF and OF, set SF/ZF/PF from the result, and leave AF undefined. `TEST` stores no result.

`INC/DEC` preserve CF and set the other arithmetic flags as documented. `NOT` changes no flags. `NEG` sets CF iff the input was nonzero and has the normal subtraction flags for `0−operand`.

Initial shift questions use count 1:

- `SHL`: CF=old MSB; OF=new MSB XOR CF;
- `SHR`: CF=old LSB; OF=old MSB;
- `SAR`: CF=old LSB; OF=0.

SF/ZF/PF reflect the result and AF is undefined. Multi-bit shift flag edge cases are excluded until a separately versioned family.

Undefined flags are represented as `?`. A generated trace may not use an undefined flag as a premise unless the learner’s task is to identify that the result is indeterminate.

### Addressing contract

General Intel memory form:

`[base + index*scale + displacement]`

where scale is `1,2,4,8`. Address arithmetic is 64-bit. `RSP` is not generated as an index. Segment overrides and 16-bit addressing are excluded.

RIP-relative addressing uses the address of the following instruction:

`target = next_RIP + signed_displacement`.

The prompt supplies instruction length or `next_RIP`; learners are not expected to infer arbitrary encoding lengths.

`LEA` computes the address expression without reading memory and changes no flags.

### Memory and operand contract

- Memory operand width is explicit through the destination/source register or `byte/word/dword/qword ptr`.
- Loads/stores read/write exactly that width in little-endian order.
- Unaligned ordinary integer accesses are architecturally permitted in this model.
- Memory-to-memory forms are rejected unless the instruction explicitly supports them.
- Immediate extension rules are supplied by opcode metadata; ambiguous assembly source is not generated.
- Every consumed register, flag, and memory byte is initialized.

### Control-flow contract

Conditional jumps use flags exactly:

| Relation | Condition |
|---|---|
| equal `JE/JZ` | ZF=1 |
| not equal `JNE/JNZ` | ZF=0 |
| unsigned below `JB/JC/JNAE` | CF=1 |
| unsigned below-or-equal `JBE` | CF=1 or ZF=1 |
| unsigned above `JA` | CF=0 and ZF=0 |
| unsigned above-or-equal `JAE/JNC` | CF=0 |
| signed less `JL` | SF≠OF |
| signed less-or-equal `JLE` | ZF=1 or SF≠OF |
| signed greater `JG` | ZF=0 and SF=OF |
| signed greater-or-equal `JGE` | SF=OF |
| sign/parity/overflow | the named flag condition |

Direct branch/call targets are supplied symbolically or as resolved displacements. `CALL` pushes the following RIP; `RET` pops RIP.

### Stack and ABI contract

Architectural stack operations:

- `push r64`: `RSP-=8`, then store 8 bytes;
- `pop r64`: load 8 bytes, then `RSP+=8`;
- near `call`: push next RIP, then branch;
- near `ret`: pop RIP.

System V AMD64 integer/pointer arguments 1–6 use `RDI,RSI,RDX,RCX,R8,R9`; later stack arguments begin at `[RSP+8]` on ordinary function entry because `[RSP]` holds the return address. Integer return values up to 64 bits use RAX.

Caller-saved: `RAX,RCX,RDX,RSI,RDI,R8,R9,R10,R11`.

Callee-saved: `RBX,RBP,R12,R13,R14,R15`; RSP must be restored.

Before a call, the caller has `RSP mod 16 = 0`; after the call’s pushed return address, ordinary callee entry has `RSP mod 16 = 8`. The 128 bytes below RSP form the System V red zone under its declared constraints. Windows x64 shadow space and calling convention are excluded.

### Syntax contract

Intel canonical:

`mnemonic destination, source`

AT&T controlled form:

- registers use `%`;
- immediates use `$`;
- common integer size suffixes are `b,w,l,q`;
- source precedes destination;
- memory is `disp(base,index,scale)`.

Translation questions use GNU assembler-compatible forms with explicit sizes and no syntax corner cases.

### Scope

- register/subregister relationships and writes;
- zero/sign extension and little-endian loads/stores;
- Intel operand classification and Intel↔AT&T translation;
- base/index/scale/displacement and RIP-relative addresses;
- `MOV`, `MOVZX`, `MOVSX/MOVSXD`, `LEA`;
- `ADD`, `SUB`, `ADC`, `SBB`, `INC`, `DEC`, `NEG`, `CMP`;
- `AND`, `OR`, `XOR`, `NOT`, `TEST`;
- one-bit `SHL`, `SHR`, `SAR`;
- controlled two-operand `IMUL`;
- conditional branches and short deterministic traces;
- `PUSH`, `POP`, near `CALL`, near `RET`;
- System V integer arguments, return, saved registers, stack alignment, and basic frame patterns.

### Exclusions

- generic cycle counts, instruction latency, throughput, µops, ports, cache effects, and branch prediction;
- 16/32-bit modes, real mode, segmentation, paging, faults, exceptions, interrupts, and privileged/system instructions;
- x87, MMX, SIMD/vector, floating point, atomics, locks, fences, and memory ordering;
- string instructions, REP prefixes, bit-test family, BMI/ADX, cryptographic extensions, and AVX-512;
- indirect-branch security mechanisms, CET, retpolines, and speculative execution;
- Windows x64 ABI, kernel syscall ABI, varargs, aggregate classification, TLS models, PLT/GOT/linker relocations;
- full machine-code encoding/decoding;
- undefined flag guessing or assembler-dependent ambiguous syntax;
- arbitrary user programs or real execution.

### Global answer conventions

- Hex values are fixed-width where width matters: `0x80`, `0x0000000080000000`.
- Accept upper/lowercase hex and optional digit separators.
- Register names are case-insensitive.
- Flag answers use named fields and preserve `?` for undefined.
- Signed and unsigned interpretations are explicitly labeled.
- Memory answers use ordered address/byte fields.
- Instruction translations ignore cosmetic whitespace but not operand order, prefixes, or size.
- ABI register sets are unordered.
- A trace answer includes only requested state but the oracle stores full state.

### Difficulty philosophy

Difficulty rises through partial-register preservation, carry/overflow contrasts, address composition, signed/unsigned condition selection, stack-state dependency, and ABI invariants. It must not rise through obscure encodings, long listings, uninitialized flags, giant constants, or microarchitecture trivia.

### Generator and oracle

Every item stores instruction AST, operand widths, decoded operands, initial architectural state, exact read/write set, resulting flags including undefinedness, next RIP, ABI model, misconception, and structural signature.

Use BigInt masked to operand/address width. A table-driven interpreter is canonical. Build-time assembly/disassembly checks may validate controlled syntax, but runtime remains local JavaScript.

## 2. Category: Registers, widths, and memory bytes

### Purpose and Learn

The same physical register has overlapping names. The exceptional rule worth making automatic is that a 32-bit write clears the upper half; 8/16-bit writes do not.

### Family `register_alias_identification`

**Task.** Identify parent/subregister and bit range.

**Response.** Register choice and bit range.

**Examples.**

1. `AL` → bits7:0 of RAX. L1.
2. `EAX` → bits31:0 of RAX; writes clear bits63:32. L2.
3. `R9W` → bits15:0 of R9. L2.

**Distractors.** AH position, R8 naming, 32-bit preservation misconception.

**Validation.** Register-slice metadata.

### Family `partial_register_write`

**Task.** Apply an 8-, 16-, or 32-bit write to a 64-bit parent.

**Response.** Full 64-bit register.

**Examples.**

1. RAX `0x1122334455667788`; `mov al,0xFF` → `0x11223344556677FF`. L1.
2. same; `mov ax,0xABCD` → `0x112233445566ABCD`. L2.
3. same; `mov eax,0xAABBCCDD` → `0x00000000AABBCCDD`. L2.

**Validation.** Exhaust slice masks and 32-bit zero extension.

### Family `zero_sign_extension`

**Task.** Execute a controlled zero/sign-extending move.

**Response.** Destination value.

**Examples.**

1. byte `0xFF`; `movzx eax, byte ptr [m]` → RAX `0x00000000000000FF`. L1.
2. same; `movsx rax, byte ptr [m]` → `0xFFFFFFFFFFFFFFFF`. L2.
3. EAX `0x80000000`; `movsxd rax,eax` → `0xFFFFFFFF80000000`. L3.

**Validation.** Exhaust source-width boundary values.

### Family `little_endian_load_store`

**Task.** Convert between multibyte memory and register value.

**Response.** Register or ordered bytes.

**Examples.**

1. bytes at `0x1000`: `78 56 34 12`; load EAX → `0x12345678`, upper RAX zero. L1.
2. store AX `0xBEEF` at `0x2000` → bytes `EF BE`. L1.
3. qword bytes `08 07 06 05 04 03 02 01` → `0x0102030405060708`. L2.

**Validation.** Width-aware endian round-trip.

## 3. Category: Operands, addressing, and syntax

### Purpose and Learn

An address expression computes a number; a memory operand dereferences it. `LEA` stops after computing the number. Syntax translation changes notation and operand order, not instruction meaning.

### Family `operand_kind_and_width`

**Task.** Classify operands as register, immediate, or memory and identify width.

**Response.** Named fields.

**Examples.**

1. `mov eax,5` → destination 32-bit register, source immediate. L1.
2. `mov rax,qword ptr [rbx]` → 64-bit memory read. L1.
3. `cmp byte ptr [rdi+1],0` → 8-bit memory operand and encodable immediate. L3.

**Validation.** Controlled Intel parser and opcode legality.

### Family `effective_address_bisd`

**Task.** Compute base+index×scale+displacement effective address.

**Response.** 64-bit address.

**Examples.**

1. RBX `0x1000`, RCX3; `[rbx+rcx*4+8]` → `0x1014`. L1.
2. RBP `0x2000`, RSI `0x10`; `[rbp+rsi*8-0x20]` → `0x2060`. L2.
3. R8 `0x100000`, R9 `0xFF`; `[r8+r9*2+0x102]` → `0x100300`. L3.

**Validation.** BigInt expression evaluator and scale legality.

### Family `rip_relative_address`

**Task.** Compute RIP-relative target using next RIP.

**Response.** Address.

**Examples.**

1. next RIP `0x400007`, displacement `+0x20` → `0x400027`. L1.
2. next RIP `0x400007`, displacement `-0x20` → `0x3FFFE7`. L2.
3. instruction starts `0x500000`, length7, displacement `-7` → target `0x500000`. L3.

**Validation.** Signed displacement arithmetic.

### Family `lea_result`

**Task.** Execute LEA without memory access.

**Response.** Destination register and unchanged flags.

**Examples.**

1. RBX `0x1000`, RCX3; `lea rax,[rbx+rcx*4+8]` → RAX `0x1014`. L1.
2. `lea eax,[rdi+rdi*2]` with RDI5 → EAX15 and full RAX zero-extended. L2.
3. address `0xDEAD` is unmapped; `lea rax,[rbx]` with RBX `0xDEAD` still succeeds and does not read memory. L3.

**Validation.** Address oracle and empty memory-read log.

### Family `intel_att_translation`

**Task.** Translate one controlled instruction between Intel and GNU AT&T syntax.

**Response.** Constrained assembly text.

**Derivation.** Reverse source/destination, add register/immediate markers, size suffix, and translate memory notation.

**Examples.**

1. Intel `add eax,5` → AT&T `addl $5,%eax`. L1.
2. Intel `mov rax,[rbx+rcx*4+8]` → AT&T `movq 8(%rbx,%rcx,4),%rax`. L3.
3. AT&T `cmpq %rbx,%rax` → Intel `cmp rax,rbx`. L2.

**Validation.** Round-trip semantic AST and build-time assembler fixtures.

## 4. Category: Integer instructions and flags

### Purpose and Learn

Compute the width-limited result first, then derive unsigned carry/borrow and signed overflow separately. Preserve or mark undefined every flag according to the instruction.

### Family `mov_instruction_effect`

**Task.** Execute a scalar MOV between register/memory/immediate forms.

**Response.** Changed destination and memory/register preservation.

**Examples.**

1. `mov rax,rbx`, RBX `0x42` → RAX `0x42`; flags unchanged. L1.
2. `mov dword ptr [0x1000],eax`, EAX `0x12345678` → bytes `78 56 34 12`. L2.
3. `mov eax,dword ptr [m]` value `0xFFFFFFFF` → RAX `0x00000000FFFFFFFF`. L2.

**Validation.** Width/read/write metadata.

### Family `add_sub_flags`

**Task.** Execute ADD or SUB and report CF,PF,AF,ZF,SF,OF.

**Response.** Result and six flags.

**Examples.**

1. 8-bit `0x7F+0x01` → `0x80`, CF0,PF0,AF1,ZF0,SF1,OF1. L2.
2. 8-bit `0xFF+0x01` → `0x00`, CF1,PF1,AF1,ZF1,SF0,OF0. L2.
3. 8-bit `0x80-0x01` → `0x7F`, CF0,PF0,AF1,ZF0,SF0,OF1. L3.

**Validation.** Exhaust 8/16-bit pairs and boundary-focused 32/64-bit vectors.

### Family `adc_sbb_effect`

**Task.** Execute ADC/SBB with incoming CF.

**Response.** Result and arithmetic flags.

**Derivation.** `ADC dst+src+CF`; `SBB dst-src-CF` (unlike 6502 SBC).

**Examples.**

1. 8-bit `ADC 0x10,0x20` with CF1 → `0x31`. L1.
2. 8-bit `SBB 0x10,0x01` with CF1 → `0x0E`, CF0. L2.
3. 8-bit `ADC 0xFF,0x00` with CF1 → `0x00`, CF1,ZF1. L2.

**Validation.** Exhaust input triples.

### Family `logical_test_flags`

**Task.** Execute AND/OR/XOR/TEST and track result plus defined/undefined flags.

**Response.** Destination and CF,OF,SF,ZF,PF,AF.

**Examples.**

1. `xor eax,eax` → RAX0, CF0,OF0,SF0,ZF1,PF1,AF?. L1.
2. AL `0x80`; `test al,0x0F` → AL unchanged, test result0, ZF1,CF0,OF0. L2.
3. `or al,0x01` from `0x80` → `0x81`, SF1,ZF0,PF1,CF0,OF0,AF?. L2.

**Validation.** Exhaust result bytes and write masks.

### Family `inc_dec_neg_not`

**Task.** Execute unary integer instruction with exact flag preservation.

**Response.** Result and relevant flags.

**Examples.**

1. 8-bit `INC 0xFF`, initial CF1 → `0x00`, ZF1,OF0, CF remains1. L2.
2. 8-bit `NEG 0x01` → `0xFF`, CF1,SF1,ZF0,OF0. L2.
3. 8-bit `NOT 0x55` → `0xAA`; all flags unchanged. L1.

**Validation.** Exhaust input values and preserved-CF tests.

### Family `one_bit_shift`

**Task.** Execute SHL/SHR/SAR by one.

**Response.** Result and defined flags.

**Examples.**

1. 8-bit `SHL 0x81,1` → `0x02`, CF1,OF1,SF0,ZF0,PF0. L2.
2. 8-bit `SHR 0x81,1` → `0x40`, CF1,OF1. L2.
3. 8-bit `SAR 0x81,1` → `0xC0`, CF1,OF0,SF1. L3.

**Validation.** Exhaust values at supported widths.

### Family `imul_two_operand`

**Task.** Execute signed two-operand IMUL, truncate to destination width, and set CF/OF for fit.

**Response.** Destination,CF,OF; other arithmetic flags `?`.

**Derivation.** Compute full signed product; CF=OF=0 iff it equals sign-extension of truncated result.

**Examples.**

1. 32-bit `1000*20` → 20000, CF0,OF0. L2.
2. 32-bit `0x40000000*2` → `0x80000000`, CF1,OF1. L3.
3. 16-bit `-3*7` → `0xFFEB` (-21), CF0,OF0. L3.

**Validation.** BigInt full/truncated product.

### Family `cmp_flag_relation`

**Task.** Execute CMP and interpret signed and unsigned relations.

**Response.** Flags plus both relations.

**Examples.**

1. RAX5,RBX7; `cmp rax,rbx` → CF1,ZF0,SF1,OF0; unsigned below and signed less. L1.
2. RAX7,RBX5; `cmp rax,rbx` → CF0,ZF0; unsigned above and signed greater. L1.
3. RAX `0xFFFFFFFFFFFFFFFF`, RBX1; `cmp rax,rbx` → unsigned above but signed less. L3.

**Validation.** Compare flags against BigInt signed/unsigned relations.

## 5. Category: Conditions and control flow

### Purpose and Learn

The same CMP flags support different signed and unsigned branches. Choose the relation that matches the data interpretation.

### Family `condition_code_evaluate`

**Task.** Decide whether a named Jcc/SETcc condition is true from flags.

**Response.** Yes/no.

**Examples.**

1. ZF1; `JNE` → not taken. L1.
2. CF1,ZF0; `JB` → taken, `JA` not. L2.
3. SF1,OF1,ZF0; `JL` → not taken because SF=OF. L3.

**Validation.** Exhaust relevant flag combinations and aliases.

### Family `choose_signed_unsigned_jump`

**Task.** Select a conditional jump for a stated comparison relation.

**Response.** Single-choice mnemonic/alias class.

**Examples.**

1. branch if equal → `JE`. L1.
2. branch if unsigned `a>b` after `cmp a,b` → `JA`. L2.
3. branch if signed `a≤b` → `JLE`. L2.

**Distractors.** `JA/JG`, `JB/JL`, operand-order reversal.

**Validation.** Relation-to-condition table.

### Family `cmp_then_branch`

**Task.** Execute CMP then determine branch and next RIP.

**Response.** Flags, taken, RIP.

**Examples.**

1. EAX5, EBX7; `cmp eax,ebx; jl target` → taken. L1.
2. same; `ja target` → not taken. L2.
3. RAX `-1`, RBX1; `cmp rax,rbx; ja U; jl S` → `ja` is taken if evaluated first; signed `jl` condition is also true from the same flags. L4.

**Constraints.** Multi-branch snippets define actual sequential control flow; condition-comparison variants may ask several predicates without executing them.

**Validation.** Flag and control-flow simulator.

### Family `direct_branch_target`

**Task.** Compute direct relative branch/call target from next RIP and signed displacement.

**Response.** Address.

**Examples.**

1. next RIP `0x400105`, displacement `+0x20` → `0x400125`. L1.
2. next RIP `0x400105`, displacement `-0x30` → `0x4000D5`. L2.
3. call at `0x500000`, length5, rel32 `-0x105` → next `0x500005`, target `0x4FFF00`. L3.

**Validation.** Signed displacement BigInt arithmetic.

## 6. Category: Stack, calls, and System V ABI

### Purpose and Learn

The stack grows toward lower addresses. CALL/RET manipulate return addresses automatically. ABI rules are a software contract layered on top of those architectural effects.

### Family `push_pop_effect`

**Task.** Trace RSP and memory/register for PUSH/POP.

**Response.** RSP and qword bytes/value.

**Examples.**

1. RSP `0x1000`, RAX `0x1122`; `push rax` → RSP `0x0FF8`, qword value `0x1122` stored there. L1.
2. memory qword `[0x0FF8]=0xAABB`; `pop rbx` → RBX `0xAABB`, RSP `0x1000`. L1.
3. `push rax; pop rcx` with stable memory → RCX gets original RAX and RSP is restored. L2.

**Validation.** Stack memory simulator.

### Family `call_ret_trace`

**Task.** Trace near CALL and RET.

**Response.** RIP,RSP,return-address memory.

**Examples.**

1. call at `0x400000`, length5, target `0x401000`, RSP `0x1000` → store `0x400005` at `0x0FF8`, RIP target. L2.
2. matching `ret` → RIP `0x400005`, RSP `0x1000`. L2.
3. two nested calls lower RSP by16 before either return. L3.

**Validation.** Call/ret round-trip.

### Family `sysv_argument_location`

**Task.** Locate integer/pointer argument or return value under System V AMD64.

**Response.** Register or stack address.

**Examples.**

1. argument1 → RDI. L1.
2. argument6 → R9. L1.
3. at function entry, argument7 → qword `[RSP+8]`; return address is `[RSP]`. L3.

**Validation.** Versioned ABI table.

### Family `caller_callee_saved`

**Task.** Classify registers and determine required save/restore responsibility.

**Response.** Register set or responsible party.

**Examples.**

1. RBX → callee-saved. L1.
2. R10 → caller-saved. L1.
3. function modifies R12 and calls another function while needing RCX later → it must restore R12 for its caller and preserve RCX itself across the nested call. L4.

**Validation.** ABI register-set metadata.

### Family `stack_alignment`

**Task.** Compute RSP modulo16 and determine call-site ABI alignment.

**Response.** RSP/modulus and valid yes/no.

**Examples.**

1. caller RSP `0x7FFFFFFFE000` before call → aligned (`mod16=0`). L1.
2. callee entry after pushed return address → RSP ends in `...FF8`, `mod16=8`. L2.
3. entry mod16=8; `push rbp` then `sub rsp,24` → before a nested call mod16=8, so not aligned. L3.

**Validation.** Modular stack-delta oracle.

### Family `prologue_epilogue_trace`

**Task.** Trace a basic frame setup/teardown and verify restored state.

**Response.** RSP,RBP and saved memory.

**Examples.**

1. entry RSP `0x0FF8`; `push rbp; mov rbp,rsp` → RSP/RBP `0x0FF0`. L1.
2. then `sub rsp,32` → RSP `0x0FD0`, still aligned for a call. L2.
3. matching `leave; ret` restores caller RBP, then pops return RIP. L3.

**Constraints.** `leave` modeled as `mov rsp,rbp; pop rbp`.

**Validation.** Stack/frame simulator and restoration invariant.

### Family `red_zone_usage`

**Task.** Decide whether a use of bytes below RSP fits the System V red-zone contract.

**Response.** Yes/no and byte range.

**Examples.**

1. leaf function uses `[rsp-16]` without changing RSP → within 128-byte red zone. L2.
2. uses `[rsp-136]` → outside red zone. L2.
3. stores a live temporary in red zone then calls another function → unsafe under this practice rule; callees may use overlapping space. L3.

**Validation.** Offset-range and call-presence checks.

## 7. Category: Multi-instruction traces and validity

### Purpose and Learn

Trace one architectural write at a time. A correct simulator preserves unaffected bits and flags and refuses to invent values for undefined state.

### Family `register_trace_snippet`

**Task.** Trace final registers/flags through 2–8 instructions.

**Response.** Named final state.

**Examples.**

1. `mov eax,0xFFFFFFFF; add rax,1` → RAX `0x0000000100000000`. L2.
2. `xor ecx,ecx; dec ecx` → RCX `0x00000000FFFFFFFF`, SF1,ZF0. L3.
3. `mov al,0x7F; add al,1; movzx eax,al` → RAX `0x80`; flags remain from ADD, including OF1. L4.

**Validation.** Full-state interpreter.

### Family `memory_trace_snippet`

**Task.** Trace selected memory bytes and registers.

**Response.** Address/byte map plus registers.

**Examples.**

1. `mov eax,0x12345678; mov [0x1000],eax` → `78 56 34 12`. L1.
2. bytes `FF 00 00 00`; `movzx eax,byte ptr [m]; add eax,1` → RAX `0x100`. L2.
3. RBX `0x2000`, RCX2; `mov word ptr [rbx+rcx*2],0xABCD` → bytes at `0x2004`: `CD AB`. L3.

**Validation.** Read/write log and untouched-byte assertion.

### Family `branching_trace_snippet`

**Task.** Execute a short compare/branch snippet and report path/final state.

**Response.** Executed labels and final registers.

**Examples.**

1. EAX3; `cmp eax,5; jl small` → `small` path. L1.
2. EAX `0xFFFFFFFF`; `cmp eax,1; ja above` → above path unsigned. L2.
3. EAX0; loop `inc eax; cmp eax,3; jl loop` → final EAX3 after three iterations. L3.

**Validation.** Bounded control-flow interpreter; loops have proven small bound.

### Family `undefined_flag_dependency`

**Task.** Decide whether a later condition is determined after instructions that leave flags undefined.

**Response.** Determined result or indeterminate.

**Examples.**

1. `xor eax,eax; jz target` → determined taken; ZF1. L1.
2. `imul eax,ecx; jz target` → indeterminate because two-operand IMUL leaves ZF undefined. L3.
3. `and eax,ebx; jc target` → determined not taken because AND clears CF, despite AF being undefined. L3.

**Validation.** Three-valued flag propagation.

### Family `abi_call_trace`

**Task.** Trace a small caller/callee interaction with arguments, clobbers, saves, and return.

**Response.** Register/stack state and ABI-valid yes/no.

**Constraints.** One call, integer args only, declared callee behavior.

**Examples.**

1. caller places 4,5 in RDI,RSI; callee returns their sum in RAX → 9. L2.
2. callee changes RBX without saving → ABI violation. L2.
3. caller needs R10 after call but does not save it; callee clobbers R10 → caller’s assumed value is lost, no ABI violation by callee. L4.

**Validation.** ABI contract checker plus architectural trace.

## 8. Cross-family progression

Recommended order:

1. register aliases and partial writes;
2. endian memory and MOV;
3. effective addresses and LEA;
4. ADD/SUB flags;
5. CMP and simple conditions;
6. signed/unsigned branch contrasts;
7. logical/unary/shift instructions;
8. stack PUSH/POP and CALL/RET;
9. System V arguments and saved registers;
10. stack alignment/prologues/red zone;
11. syntax translation;
12. multi-instruction and ABI traces;
13. IMUL and undefined-flag validity.

Interleave the decisive contrasts: EAX versus AX writes, LEA versus load, CF versus OF, JA versus JG, SBB versus 6502-style borrow conventions, architectural CALL effects versus ABI obligations, and defined versus undefined flags.

## 9. Adaptive guidance

Track mastery by operand width, register family/slice, instruction, flag pattern, address component, syntax direction, signedness, condition code, stack delta, ABI register class, and undefined-state dependency.

| Error | Route to |
|---|---|
| EAX write preserves upper half | 32-bit zero-extension pair |
| AX write clears upper half | 16-bit preservation pair |
| memory bytes read big-endian | load/store byte diagram |
| LEA dereferences memory | LEA versus MOV minimal pair |
| RIP displacement added to start RIP | next-RIP target drill |
| CF used for signed comparison | JA/JG or JB/JL contrast |
| CMP operands reversed mentally | show explicit `dst-src` |
| SBB uses inverted borrow | x86 `SBB dst-src-CF` diagnostic |
| INC changes CF | preserved-CF unary pair |
| TEST changes destination | TEST/AND write-mask contrast |
| PUSH stores before decrement incorrectly | stack micro-trace |
| CALL return address is call start | next-RIP stack item |
| 7th argument assigned a register | ABI location sequence |
| caller expects RBX clobber | saved-register responsibility |
| callee entry assumed 16-aligned | before-call versus entry pair |
| branch uses undefined ZF | undefined-dependency family |

Recommended mix: 40% weakest mechanism, 25% spaced mastery, 20% contrast pairs, 10% multi-step, 5% ABI/syntax stretch.

## 10. Feedback and visualization

Use overlapping register diagrams, fixed-width ALU rows, flag derivation tables, base/index/scale address equations, little-endian byte strips, stack arrows, and ABI register maps.

For every instruction, distinguish architectural inputs, defined writes, preserved state, and undefined outputs. Do not show a plausible concrete value for an undefined flag.

## 11. Implementation and automated validation

- controlled Intel and AT&T parsers producing one semantic AST;
- table-driven instruction legality, operand width, immediate extension, and flag-write masks;
- BigInt arithmetic masked to 8/16/32/64 bits;
- exact signed/unsigned conversion helpers;
- exhaustive 8/16-bit ADD/SUB/ADC/SBB/shift/unary vectors;
- boundary-focused 32/64-bit tests;
- parity and auxiliary-carry tests;
- register-slice exhaustive tests;
- endian read/write round-trips;
- address and RIP-relative property tests;
- assembler/disassembler fixture validation for syntax translations;
- branch truth-table exhaustion;
- stack CALL/RET round-trips;
- ABI saved-register, argument-location, and alignment invariants;
- three-valued undefined-flag propagation;
- at least 10,000 seeds per family/level;
- reject illegal operand combinations, memory-to-memory accidents, uninitialized reads, noncanonical accesses, ambiguous sizes, and undefined control premises.

No runtime assembler, native code execution, backend, or microarchitecture model is included.

## 12. Coverage checklist

- [ ] Model is AMD64 long mode with System V ABI.
- [ ] Intel syntax is canonical and AT&T translation is controlled.
- [ ] 32-bit writes zero upper halves; 8/16-bit writes preserve them.
- [ ] Every operand width is known.
- [ ] Memory is little-endian.
- [ ] LEA never dereferences.
- [ ] RIP-relative addressing uses next RIP.
- [ ] CF and OF are derived and taught separately.
- [ ] CMP is modeled as destination minus source.
- [ ] Signed and unsigned Jcc families recur in contrast.
- [ ] Undefined flags remain unknown.
- [ ] Stack grows downward and CALL pushes next RIP.
- [ ] ABI arguments, saved registers, alignment, and red zone are explicit.
- [ ] Generic cycle counting is excluded.
- [ ] Every trace initializes all consumed state.
- [ ] Difficulty comes from architectural interaction, not ISA trivia.

## 13. Stable navigation

- Registers & Widths
- Addressing & Syntax
- Integer Instructions
- Flags & Conditions
- Stack & Calls
- System V ABI
- Traces & Validity

Stable family identifiers are the backticked names above.
