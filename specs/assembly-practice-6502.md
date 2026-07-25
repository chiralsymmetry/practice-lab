# 6502 Assembly Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, CPU simulator, assembler/parser, and UI implementers

## 1. Topic overview

### Goal

Develop an exact mental model of the original NMOS MOS Technology 6502: registers and flags, addressing modes, instruction effects, branches, stack/subroutine behavior, decimal arithmetic, interrupts, and cycle costs.

The learner should be able to execute short snippets by hand and explain the decisive address, value, flag, stack byte, or timing penalty.

### Processor contract

The model ID is `mos6502-nmos-v1`:

- original NMOS 6502 behavior;
- 16-bit address space `$0000–$FFFF`, wrapping modulo 65,536;
- 8-bit registers `A`, `X`, `Y`, and `SP`, wrapping modulo 256;
- 16-bit `PC`;
- stack page `$0100–$01FF`;
- little-endian 16-bit memory operands and vectors;
- documented/legal opcodes only;
- binary and NMOS decimal `ADC/SBC`;
- NMOS `JMP (indirect)` page-wrap behavior;
- no 65C02 additions/fixes and no Ricoh 2A03 decimal-mode omission.

Every question displays this model in Learn context. Variant-dependent behavior is never silently mixed.

### Status-register contract

Status layout is `NV-BDIZC`:

| Bit | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| Meaning | N | V | constant 1 in pushed/displayed value | B image | D | I | Z | C |

`N,V,D,I,Z,C` are modeled latches. `B` is not a persistent physical flag on the NMOS 6502; it distinguishes pushed status images:

- `PHP` and `BRK` push bit 4 as 1;
- IRQ/NMI push bit 4 as 0;
- pushed/displayed bit 5 is 1.

Questions may use a pedagogical `P` byte, but feedback must preserve this distinction. Undefined or non-latched pushed bits may not become branch premises.

### Arithmetic contract

Binary `ADC` computes `A + M + C`. `C` is carry out; `V` detects signed two’s-complement overflow; `N/Z` reflect the stored 8-bit result.

Binary `SBC` computes `A - M - (1-C)`. Thus `C=1` means no incoming borrow, and output `C=1` means no borrow occurred. `V` detects signed subtraction overflow.

In NMOS decimal mode:

- accumulator and `C` use NMOS BCD correction;
- `N`, `V`, and `Z` reflect the NMOS binary intermediate behavior, not a cleaned-up 65C02 rule;
- generated operands contain valid packed BCD digits unless invalid-digit behavior is an explicitly excluded implementation test.

Decimal results and flags require an exhaustively validated NMOS oracle; host-language decimal arithmetic is not sufficient.

### Addressing contract

Supported syntax uses conventional `$` hexadecimal and `#` immediate notation:

- implied and accumulator;
- immediate `#$nn`;
- zero page `$nn`;
- zero page indexed `$nn,X` and `$nn,Y`;
- absolute `$nnnn`;
- absolute indexed `$nnnn,X` and `$nnnn,Y`;
- relative branch;
- indirect `($nnnn)` for `JMP`;
- indexed indirect `($nn,X)`;
- indirect indexed `($nn),Y`.

Zero-page indexing and zero-page pointer-byte fetches wrap within page zero. Absolute indexed addresses wrap modulo 65,536. Relative offsets are signed 8-bit displacements from the PC after the branch operand.

For `JMP ($xxFF)`, the high target byte is read from `$xx00`, not `$(xx+1)00`, matching NMOS behavior.

### Stack and control-flow contract

- Push: write to `$0100+SP`, then decrement `SP`.
- Pull: increment `SP`, then read `$0100+SP`.
- `JSR` pushes the address of its last operand byte, high byte then low byte; `RTS` pulls it and adds one.
- `BRK` behaves as a two-byte instruction for the pushed return address and pushes status with B image 1.
- IRQ/NMI push the current PC and status with B image 0, then set `I`.
- NMOS interrupt entry does not automatically clear `D`.
- `RTI` restores status and PC without the `RTS` increment.

Reset sequencing is excluded from initial generated traces.

### Cycle contract

Cycle questions use a versioned table for every documented opcode/addressing-mode pair. Dynamic additions are:

- conditional branch: +1 if taken, another +1 if the taken target crosses a page;
- eligible indexed read instructions: +1 on page crossing;
- stores and read-modify-write instructions use their fixed documented indexed timing rather than the indexed-read rule;
- zero-page wrapping is not a page-cross timing event.

Questions identify the exact opcode form. Interrupt recognition latency, RDY/DMA stalls, bus-level dummy-read addresses, and asynchronous timing are excluded.

### Scope

- all registers and modeled status behavior;
- legal opcode/addressing-mode recognition;
- effective-address and operand calculation;
- loads, stores, transfers, increments/decrements;
- logic, compare, shifts, rotates, `BIT`, binary `ADC/SBC`;
- branch decisions and relative targets;
- stack, `JSR/RTS`, `PHP/PLP`, `BRK/RTI`, simplified IRQ/NMI entry;
- valid-BCD decimal arithmetic;
- base and penalty cycle counting;
- short deterministic multi-instruction traces.

### Exclusions

- undocumented/illegal opcodes;
- 65C02/65C816 instructions or behavior;
- NES-specific memory map, PPU/APU, and DMA;
- a particular computer’s ROM, I/O devices, or reset environment;
- self-modifying code, asynchronous interrupts inside a trace unless scheduled explicitly;
- invalid packed-BCD operands;
- analog/bus timing, dummy reads as observable I/O, and transistor-level behavior;
- assembler directives, macros, linkers, relocations, and source-file syntax beyond instruction parsing;
- free-form program writing or optimization proofs.

### Global answer conventions

- Hexadecimal is canonical, uppercase, and fixed width: `$2A`, `$C010`.
- Accept lowercase hex and optional `0x` on numeric-entry questions.
- Decimal answers are accepted only when the prompt permits them.
- Flag answers use named fields or `N V D I Z C`; unspecified flags are shown `—`, not guessed.
- Memory answers are named address/value pairs.
- Ordered stack bytes show push order and addresses.
- PC values identify whether they are instruction start, next-instruction PC, or target.
- Cycle answers are exact integers under the declared model.

### Difficulty philosophy

Difficulty rises through wrapping, carry/borrow, signed overflow, page crossing, indirection, stack order, and multi-instruction dependency. It must not rise through long programs, giant memory dumps, obscure illegal opcodes, or unexplained hardware variants.

### Generator and oracle

Every item stores opcode, addressing mode, instruction bytes, starting PC, registers, flags, relevant memory, exact reads/writes, final state, cycle count, variant, misconception, and structural signature.

Use byte/word integer arithmetic and a table-driven CPU core. Validate single-step behavior against exhaustive/reference vectors where practical, especially `ADC`, `SBC`, decimal mode, shifts, branches, stack operations, and interrupt status images.

## 2. Category: Registers and status

### Purpose and Learn

Train fixed-width register behavior and distinguish flags changed, preserved, or represented only in a pushed status byte. Eight-bit register arithmetic wraps; `N` copies result bit 7 and `Z` tests whether the result byte is zero.

### Family `status_byte_decode_encode`

**Task.** Convert between a pushed/displayed status byte and named flags.

**Response.** Hex byte or named bits.

**Derivation.** Map `NV1BDIZC`; enforce bit 5 display 1 and declared B image.

**Constraints.** Prompt distinguishes latch flags from pushed B image.

**Difficulty.** Decode; encode; B-image contrast; PHP versus IRQ image.

**Feedback.** Show bit positions.

**Examples.**

1. `$22` → `Z=1`, others N/V/D/I/C=0, bit5=1. L1.
2. `N=1,V=0,D=0,I=1,Z=1,C=0`, B image0 → `$A6`. L2.
3. same latches pushed by PHP versus IRQ → bytes differ only at bit4. L4.

**Validation.** Exhaust all 64 latch combinations and both pushed B images.

### Family `register_wrap_and_nz`

**Task.** Apply an 8-bit register increment/decrement/transfer and report result plus N/Z where affected.

**Response.** Byte and flags.

**Derivation.** Operate modulo256; set N/Z only for instructions documented to do so.

**Constraints.** Contrast flag-setting `TAX/TAY/TXA/TYA/TSX` with flag-preserving `TXS`.

**Examples.**

1. `X=$FF; INX` → `X=$00,Z=1,N=0`. L1.
2. `Y=$00; DEY` → `Y=$FF,Z=0,N=1`. L2.
3. `X=$80; TXS` → `SP=$80`; N/Z unchanged. L3.

**Validation.** Exhaust byte inputs for each supported operation.

### Family `instruction_flag_footprint`

**Task.** Identify which flags an instruction changes, preserves, or supplies from an operand.

**Response.** Three sets: changed/preserved/not applicable.

**Derivation.** Versioned legal-opcode metadata.

**Constraints.** Ask exact opcode form when forms differ; avoid decimal value calculation.

**Examples.**

1. `LDA` changes N,Z. L1.
2. `STA` changes no status flags. L1.
3. `BIT` sets N/V from memory bits 7/6 and Z from `A&M`; it preserves C,D,I. L3.

**Validation.** Opcode-table consistency with simulator write mask.

## 3. Category: Addressing and operands

### Purpose and Learn

Separate instruction syntax, effective address, and operand value. Indexed zero-page arithmetic wraps at `$FF`; indirect pointer bytes in zero page also wrap.

### Family `addressing_mode_classify`

**Task.** Name the addressing mode of a legal instruction operand.

**Response.** Single-choice.

**Constraints.** Instruction must support the displayed mode; accumulator versus implied distinguished.

**Examples.**

1. `LDA #$20` → immediate. L1.
2. `LDA ($40),Y` → indirect indexed. L2.
3. `ASL A` → accumulator, while `ASL $1234` is absolute. L3.

**Distractors.** Zero page versus immediate; `(zp,X)` versus `(zp),Y`; absolute indexed versus indirect.

**Validation.** Assemble through controlled opcode table.

### Family `effective_address_direct_indexed`

**Task.** Compute effective address for zero-page or absolute indexed mode.

**Response.** Address.

**Derivation.** Add index; wrap at 8 bits for zero page or 16 bits for absolute.

**Examples.**

1. `X=$05`, operand `$20,X` → `$25`. L1.
2. `X=$30`, operand `$F0,X` → `$20` in zero page. L2.
3. `Y=$30`, operand `$FFF0,Y` → `$0020`. L3.

**Validation.** Exhaust index addition boundaries.

### Family `effective_address_indirect`

**Task.** Follow `($zp,X)`, `($zp),Y`, or `JMP ($abs)` to an effective address/target.

**Response.** Address plus pointer-byte reads.

**Derivation.** Apply indexed/pointer order, little endian, and the relevant wrap rule.

**Examples.**

1. `X=$04`, `LDA ($20,X)`, memory `$24=$34,$25=$12` → address `$1234`. L2.
2. `Y=$10`, `LDA ($FF),Y`, memory `$00FF=$F8,$0000=$20` → base `$20F8`, address `$2108`. L4.
3. `JMP ($12FF)`, memory `$12FF=$CD,$1200=$AB` → target `$ABCD`. L5.

**Validation.** Independent address calculator and memory-read trace.

### Family `operand_value_fetch`

**Task.** Determine the byte consumed by a read instruction after addressing.

**Response.** Effective address and byte, or immediate byte.

**Constraints.** Show only relevant memory; stores excluded.

**Examples.**

1. `LDA #$7F` → operand `$7F`, no data-memory read. L1.
2. `X=$02`, `LDA $2000,X`, memory `$2002=$A5` → operand `$A5`. L2.
3. indirect-indexed address resolves `$3100`, memory there `$00` → operand `$00`. L3.

**Validation.** Simulator read log.

### Family `relative_branch_target`

**Task.** Decode signed branch displacement and compute target from post-operand PC.

**Response.** Signed offset and target.

**Derivation.** Sign-extend operand byte; add to `PC+2` modulo65536.

**Examples.**

1. branch at `$C000`, operand `$06` → base `$C002`, target `$C008`. L1.
2. branch at `$C010`, operand `$FA` (`-6`) → target `$C00C`. L2.
3. branch at `$FFFE`, operand `$FE` (`-2`) → post-operand PC `$0000`, target `$FFFE`. L4.

**Validation.** Exhaust all 256 offsets at boundary PCs.

## 4. Category: Loads, stores, logic, and bit operations

### Purpose and Learn

Trace one instruction exactly, preserving flags and memory not documented as changed.

### Family `load_store_effect`

**Task.** Execute `LDA/LDX/LDY` or `STA/STX/STY`.

**Response.** Changed register/memory and affected flags.

**Examples.**

1. `LDA #$80` → `A=$80,N=1,Z=0`. L1.
2. `LDX $20` with memory `$20=$00` → `X=$00,Z=1,N=0`. L1.
3. `STA $2000` with `A=$5A` → memory `$2000=$5A`; flags unchanged. L2.

**Validation.** Exhaust values and legal forms.

### Family `logic_instruction_effect`

**Task.** Execute `AND`, `ORA`, or `EOR` on A.

**Response.** A,N,Z.

**Derivation.** Bitwise operation; N/Z from result; other flags preserved.

**Examples.**

1. `A=$F0; AND #$3C` → `$30,N=0,Z=0`. L1.
2. `A=$80; ORA #$01` → `$81,N=1,Z=0`. L1.
3. `A=$AA; EOR #$AA` → `$00,N=0,Z=1`. L2.

**Validation.** Exhaust operand pairs.

### Family `compare_instruction_effect`

**Task.** Execute `CMP/CPX/CPY` and report N,Z,C without storing subtraction.

**Response.** N,Z,C and unsigned relation.

**Derivation.** Compute register−operand modulo256; C=1 iff register≥operand unsigned.

**Examples.**

1. `A=$20; CMP #$20` → `N0,Z1,C1`. L1.
2. `X=$10; CPX #$20` → difference `$F0`, `N1,Z0,C0`. L2.
3. `A=$F0; CMP #$10` → difference `$E0`, `N1,Z0,C1`; unsigned A is greater despite N. L3.

**Validation.** Exhaust pairs.

### Family `shift_rotate_effect`

**Task.** Execute accumulator or memory `ASL/LSR/ROL/ROR`.

**Response.** Result,N,Z,C and memory/register target.

**Derivation.** Shift through C for rotates; outgoing bit enters C.

**Examples.**

1. `A=$81; ASL A` → `A=$02,C1,N0,Z0`. L1.
2. `A=$01; LSR A` → `A=$00,C1,N0,Z1`. L1.
3. `A=$02,C=1; ROR A` → `A=$81,C0,N1,Z0`. L3.

**Validation.** Exhaust values and incoming C.

### Family `bit_instruction_effect`

**Task.** Execute `BIT` and report N,V,Z.

**Response.** N,V,Z.

**Derivation.** N=M7, V=M6, Z=1 iff `(A&M)==0`.

**Examples.**

1. `A=$0F,M=$F0` → `N1,V1,Z1`. L2.
2. `A=$80,M=$80` → `N1,V0,Z0`. L2.
3. `A=$40,M=$C0` → `N1,V1,Z0`. L3.

**Validation.** Exhaust A/M pairs.

## 5. Category: Binary arithmetic and flags

### Purpose and Learn

Carry and signed overflow answer different questions. `SBC` uses inverted borrow: set C before ordinary subtraction without an incoming borrow.

### Family `adc_binary_effect`

**Task.** Execute binary `ADC`.

**Response.** A,N,V,Z,C.

**Derivation.** Exact 9-bit sum and signed overflow formula.

**Examples.**

1. `A=$10,M=$20,C0` → `A=$30,N0,V0,Z0,C0`. L1.
2. `A=$FF,M=$00,C1` → `A=$00,N0,V0,Z1,C1`. L2.
3. `A=$50,M=$50,C0` → `A=$A0,N1,V1,Z0,C0`. L3.

**Validation.** Exhaust 131,072 input triples.

### Family `sbc_binary_effect`

**Task.** Execute binary `SBC`.

**Response.** A,N,V,Z,C.

**Derivation.** `A-M-(1-C)`; output C indicates no borrow.

**Examples.**

1. `A=$30,M=$10,C1` → `A=$20,C1,N0,V0,Z0`. L1.
2. `A=$00,M=$01,C1` → `A=$FF,C0,N1,V0,Z0`. L2.
3. `A=$80,M=$01,C1` → `A=$7F,C1,N0,V1,Z0`. L3.

**Validation.** Exhaust triples.

### Family `carry_overflow_interpretation`

**Task.** Interpret one arithmetic result as unsigned and signed, identifying carry/borrow versus overflow.

**Response.** Named relation/result fields.

**Examples.**

1. `$FF+$01=$00`: unsigned carry C1, signed `-1+1=0`, V0. L2.
2. `$7F+$01=$80`: C0, signed overflow V1. L2.
3. `$80-$01=$7F`: no unsigned borrow C1, signed overflow V1. L3.

**Feedback.** Show unsigned 9-bit and signed mathematical results separately.

**Validation.** Derived from arithmetic oracle.

### Family `decimal_adc_sbc`

**Task.** Execute valid-BCD `ADC` or `SBC` under NMOS decimal mode.

**Response.** A,N,V,Z,C with binary-intermediate explanation.

**Constraints.** Valid packed BCD only; explicitly NMOS; introduced after binary mastery.

**Examples.**

1. `D1,A=$15,M=$27,C0; ADC` → `A=$42,C0`. L3.
2. `D1,A=$50,M=$01,C1; SBC` → `A=$49,C1`. L4.
3. `D1,A=$45,M=$55,C0; ADC` → decimal A `$00`, C1, while NMOS N1,V1,Z0 from binary intermediate `$9A`. L5.

**Validation.** Exhaust all valid-BCD pairs, both C inputs, against NMOS vectors.

## 6. Category: Branches and control flow

### Purpose and Learn

Branch mnemonics inspect one flag; target calculation is independent of whether the branch is taken.

### Family `branch_condition`

**Task.** Decide whether a conditional branch is taken.

**Response.** Yes/no and tested flag.

**Derivation.** `BCC/BCS` C0/C1; `BNE/BEQ` Z0/Z1; `BPL/BMI` N0/N1; `BVC/BVS` V0/V1.

**Examples.**

1. `Z=0; BNE` → taken. L1.
2. `C=1; BCC` → not taken. L1.
3. `N=1,V=0; BVS` → not taken; N is irrelevant. L2.

**Validation.** Exhaust mnemonic/flag combinations.

### Family `branch_pc_and_cycles`

**Task.** Compute final PC and cycles for one branch.

**Response.** Taken, target/next PC, cycles.

**Derivation.** Base2; +1 taken; +1 if taken target differs in high byte from post-operand PC.

**Examples.**

1. at `$2000`, `BEQ +5`, Z0 → PC `$2002`, 2 cycles. L1.
2. at `$2000`, `BEQ +5`, Z1 → PC `$2007`, 3 cycles. L2.
3. at `$20FD`, `BNE +2`, Z0 → base `$20FF`, target `$2101`, 4 cycles. L3.

**Validation.** Branch oracle at all page boundaries.

### Family `jump_call_target`

**Task.** Determine next PC for `JMP`, `JSR`, `RTS`, or `RTI` from supplied operands/stack.

**Response.** PC.

**Examples.**

1. `JMP $3456` → PC `$3456`. L1.
2. `RTS` pulls `$C002` → PC `$C003`. L2.
3. `RTI` pulls PC `$C002` → PC `$C002`, without increment. L3.

**Validation.** Control-flow simulator.

## 7. Category: Stack, subroutines, and interrupts

### Purpose and Learn

The stack grows downward within page 1. Most mistakes come from changing SP in the wrong order or confusing the return address conventions of `JSR/RTS` and interrupt/`RTI`.

### Family `push_pull_trace`

**Task.** Execute `PHA/PLA/PHP/PLP` and report SP, stack memory, and affected state.

**Response.** Named SP/memory/register/flags.

**Examples.**

1. `SP=$FD,A=$42; PHA` → `$01FD=$42,SP=$FC`. L1.
2. `SP=$FC,$01FD=$80; PLA` → `A=$80,SP=$FD,N1,Z0`. L2.
3. `P=$A5,SP=$FF; PHP` → pushed status has bits5 and4 set, then SP `$FE`. L4.

**Validation.** Stack read/write log.

### Family `jsr_rts_trace`

**Task.** Trace subroutine entry/return.

**Response.** PC,SP and pushed/pulled bytes.

**Examples.**

1. `JSR $C123` at `$C000`, SP `$FF` → push `$C0` at `$01FF`, `$02` at `$01FE`, SP `$FD`, PC `$C123`. L3.
2. matching `RTS` → pull `$C002`, then PC `$C003`, SP `$FF`. L3.
3. nested two JSRs from SP `$FF` → SP `$FB` before returns. L4.

**Validation.** Round-trip JSR/RTS properties and wrap tests.

### Family `interrupt_entry`

**Task.** Trace scheduled BRK, IRQ, or NMI entry.

**Response.** pushed PC/status bytes, SP, I, and vector target.

**Derivation.** Push PCH,PCL,status image; set I; fetch little-endian vector (`FFFE` IRQ/BRK, `FFFA` NMI).

**Constraints.** IRQ supplied as accepted/not masked; no asynchronous race.

**Examples.**

1. IRQ at PC `$4000`, SP `$FF`, I0 → push `$40,$00`, status with B0, set I1, load IRQ vector. L4.
2. `BRK` at `$4000` → pushed return PC `$4002`, status B1. L4.
3. NMI vector bytes `$FFFA=$34,$FFFB=$12` → target `$1234`. L3.

**Validation.** Byte-exact entry simulator.

### Family `rti_restore`

**Task.** Execute RTI from a supplied stack frame.

**Response.** restored flags, PC, SP.

**Derivation.** Pull status, PCL, PCH; normalize non-latched B/bit5 representation.

**Examples.**

1. stack restores P `$24`, PC bytes `$34,$12` → PC `$1234`. L2.
2. SP `$FC` before RTI → SP `$FF` after three pulls. L2.
3. frame return `$40FE` → PC `$40FE`, not `$40FF`. L3.

**Validation.** Interrupt-entry/RTI round-trip for latch flags and PC.

## 8. Category: Cycles and short traces

### Purpose and Learn

Count the documented opcode/addressing cost, then add only applicable dynamic penalties. For snippets, execute in order and sum exact instruction cycles.

### Family `instruction_base_cycles`

**Task.** Give cycles for a non-penalty instruction form.

**Response.** Integer.

**Examples.**

1. `LDA #imm` → 2 cycles. L1.
2. `JSR absolute` → 6 cycles. L2.
3. `INC zero page` → 5 cycles. L3.

**Validation.** Legal opcode timing table.

### Family `indexed_page_penalty`

**Task.** Decide page crossing and final cycles for an indexed access.

**Response.** effective address, crossed yes/no, cycles.

**Examples.**

1. `LDA $2000,X`, X `$0F` → `$200F`, 4 cycles. L2.
2. `LDA $20F8,X`, X `$10` → `$2108`, 5 cycles. L3.
3. `STA $20F8,X`, X `$10` → `$2108`, fixed 5 cycles, not “4+1 read penalty.” L4.

**Validation.** Timing metadata distinguishes read/store/RMW classes.

### Family `snippet_cycle_total`

**Task.** Execute a short snippet’s control path and total cycles.

**Response.** Integer cycles plus executed instruction sequence.

**Constraints.** 2–8 instructions; no asynchronous events.

**Examples.**

1. `LDA #$01` then `TAX` → `2+2=4`. L1.
2. `DEX` then taken same-page `BNE` → `2+3=5`. L2.
3. `LDA abs,X` crossing page, then `STA abs,X` → `5+5=10`. L4.

**Validation.** Sum simulator cycle log.

### Family `register_trace_snippet`

**Task.** Trace final registers and flags through 2–8 instructions.

**Response.** Named final state.

**Constraints.** Every read initialized; no undefined inputs; feedback shows each step.

**Examples.**

1. `LDA #$FE; CLC; ADC #$01` → A `$FF`, N1,Z0,C0,V0. L2.
2. `LDX #$00; DEX; INX` → X `$00`, Z1,N0. L2.
3. `LDA #$7F; CLC; ADC #$01; BVS target` → A `$80`, V1, branch taken. L4.

**Validation.** Full-state simulator.

### Family `memory_trace_snippet`

**Task.** Trace final selected memory bytes through loads/stores/RMW operations.

**Response.** Named address/value map and relevant registers.

**Examples.**

1. `LDA #$2A; STA $10` → memory `$0010=$2A`. L1.
2. memory `$20=$FF`; `INC $20` → `$00`, Z1,N0. L2.
3. `LDX #$02; LDA $30,X; EOR #$FF; STA $40,X` with `$32=$0F` → `$42=$F0`. L3.

**Validation.** Memory write log and untouched-memory invariant.

## 9. Cross-family progression

Recommended order:

1. registers/status and simple load/store;
2. direct addressing and operand fetch;
3. logic/compare and shifts;
4. binary ADC/SBC and carry/overflow;
5. relative targets and branch conditions;
6. indirect addressing and wrap behavior;
7. stack push/pull, then JSR/RTS;
8. base cycles and dynamic penalties;
9. short register/memory traces;
10. decimal mode;
11. BRK/IRQ/NMI and RTI.

Interleave minimal contrasts: zero-page versus absolute indexing, carry versus overflow, branch target versus decision, store timing versus read penalty, RTS versus RTI, and PHP/BRK versus IRQ status images.

## 10. Adaptive guidance

Track mastery by opcode, addressing mode, wrap/page-cross type, affected flag, carry/borrow pattern, signed-overflow pattern, branch mnemonic, stack operation, cycle-penalty class, decimal mode, and CPU variant misconception.

| Error | Route to |
|---|---|
| zero-page index produces `$0100+` | zero-page wrap pair |
| `(zp,X)` confused with `(zp),Y` | pointer-before-index contrast |
| indirect high byte read from wrong page | zero-page or JMP-wrap diagnostic |
| branch offset added to instruction start | post-operand PC drill |
| C treated as signed overflow | paired unsigned/signed arithmetic |
| SBC C interpreted as borrow | no-borrow minimal pair |
| store changes N/Z | load/store flag footprint |
| rotate ignores incoming C | shift/rotate contrast |
| TXS changes N/Z | transfer footprint pair |
| SP changed before push | one-byte stack trace |
| RTS returns to pulled address directly | RTS add-one contrast |
| IRQ pushes B1 | PHP/BRK versus IRQ image |
| every indexed cross adds a cycle | read/store timing pair |
| decimal zero result assumed Z1 on NMOS | binary-intermediate decimal diagnostic |

Recommended mix: 40% weakest mechanism, 25% spaced mastery, 20% contrasts, 10% multi-step, 5% variant-sensitive stretch.

## 11. Feedback and visualization

Use register/status tables, 16-bit address addition, zero-page pointer diagrams, bitwise ALU rows, stack-page diagrams, and per-instruction trace tables. Show only relevant memory plus every address actually read/written.

Cycle feedback separates base cycles from named penalties. Decimal feedback shows binary intermediate and decimal correction without pretending NMOS flags follow the corrected byte.

## 12. Implementation and automated validation

- table-driven legal opcode decoder;
- exact 64KiB memory and byte/word wrapping;
- instruction read/write/cycle log;
- separate status-latch and pushed-status-image helpers;
- independent effective-address oracle;
- exhaustive binary ADC/SBC and valid-BCD decimal vectors;
- exhaustive shift/rotate/compare tests;
- branch target/timing tests at every boundary;
- stack push/pull and JSR/RTS round-trips;
- interrupt/RTI frame round-trips;
- timing-table verification for every legal opcode;
- reference-vector comparison for NMOS quirks;
- at least 10,000 seeds per family/level;
- no unresolved operands, uninitialized reads, illegal opcodes, ambiguous assembler syntax, or variant leakage.

The runtime simulator is local JavaScript. Build-time reference tools/tests may validate generated fixtures, but no emulator or backend is loaded by the standalone page.

## 13. Coverage checklist

- [ ] Model is original NMOS 6502.
- [ ] Legal opcodes only.
- [ ] All arithmetic wraps to declared widths.
- [ ] Zero-page pointers and indexing wrap correctly.
- [ ] NMOS indirect-JMP behavior is explicit.
- [ ] B is treated as a pushed status image, not a normal latch.
- [ ] Binary ADC/SBC exhaust carry and overflow patterns.
- [ ] Decimal mode uses NMOS flag behavior.
- [ ] Branch base PC is after the operand.
- [ ] Stack push/pull order is exact.
- [ ] JSR/RTS and interrupt/RTI conventions are distinct.
- [ ] Indexed timing distinguishes reads, stores, and RMW.
- [ ] Every trace initializes all consumed state.
- [ ] Difficulty comes from architecture reasoning, not long code.

## 14. Stable navigation

- Registers & Flags
- Addressing
- Data & Logic
- Arithmetic
- Branches
- Stack & Interrupts
- Cycles & Traces

Stable family identifiers are the backticked names above.
