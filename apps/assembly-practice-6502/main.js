(function () {
  "use strict";

  var STORAGE_KEY = "practiceLab.assembly6502.v1";
  var MODEL_ID = "mos6502-nmos-v1";
  var TEXT = __LOCALE_TEXT__;
  var LEVELS = [1, 2, 3, 4, 5];
  var progress;
  var rng;
  var currentQuestion = null;
  var currentStartedAt = 0;
  var pausedMs = 0;
  var pauseStartedAt = 0;
  var isPaused = false;
  var submitted = false;
  var activeAnswerInput = null;
  var selectorController = null;
  var keypadButtons = null;
  var learnSpotlightId = null;
  var recentSignatures = [];

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }

  function Rng(seed) { this.state = seed >>> 0 || 0x6502c0de; }
  Rng.prototype.next = function () { var x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state; };
  Rng.prototype.int = function (min, max) { return min + (this.next() % (max - min + 1)); };
  Rng.prototype.choice = function (items) { return items[this.int(0, items.length - 1)]; };
  Rng.prototype.chance = function (numerator, denominator) { return this.int(1, denominator || 2) <= (numerator || 1); };

  function byte(value) { return value & 0xFF; }
  function word(value) { return value & 0xFFFF; }
  function signed8(value) { value = byte(value); return value < 0x80 ? value : value - 0x100; }
  function h2(value) { return "$" + byte(value).toString(16).toUpperCase().padStart(2, "0"); }
  function h4(value) { return "$" + word(value).toString(16).toUpperCase().padStart(4, "0"); }
  function bit(value) { return value ? 1 : 0; }
  function nz(value) { value = byte(value); return { N: bit(value & 0x80), Z: bit(value === 0) }; }
  function pageCrossed(base, address) { return (base & 0xFF00) !== (address & 0xFF00); }
  function randomByte(r) { return r.int(0, 255); }
  function edgeByte(r) { return r.chance(2, 3) ? r.choice([0, 1, 0x7F, 0x80, 0xFE, 0xFF, 0x0F, 0xF0]) : randomByte(r); }
  function randomWord(r) { return word((r.next() & 0xFFFF)); }
  function edgeWord(r) { return r.chance(1, 2) ? r.choice([0, 1, 0x00FF, 0x0100, 0x12FF, 0x20F8, 0x7FFF, 0xFFFE, 0xFFFF]) : randomWord(r); }
  function validBcd(r) { return (r.int(0, 9) << 4) | r.int(0, 9); }

  function flags(overrides) {
    return Object.assign({ N: 0, V: 0, D: 0, I: 0, Z: 0, C: 0 }, overrides || {});
  }
  function statusByte(p, breakImage) {
    return (p.N << 7) | (p.V << 6) | 0x20 | (bit(breakImage) << 4) | (p.D << 3) | (p.I << 2) | (p.Z << 1) | p.C;
  }
  function decodeStatus(value) {
    return { N: bit(value & 0x80), V: bit(value & 0x40), B: bit(value & 0x10), D: bit(value & 0x08), I: bit(value & 0x04), Z: bit(value & 0x02), C: bit(value & 0x01) };
  }

  function adcBinary(a, m, carry) {
    var total = a + m + carry;
    var result = byte(total);
    return { A: result, N: bit(result & 0x80), V: bit((~(a ^ m) & (a ^ result) & 0x80) !== 0), Z: bit(result === 0), C: bit(total > 0xFF), binary: result };
  }
  function sbcBinary(a, m, carry) {
    var exact = a - m - (1 - carry);
    var result = byte(exact);
    return { A: result, N: bit(result & 0x80), V: bit(((a ^ m) & (a ^ result) & 0x80) !== 0), Z: bit(result === 0), C: bit(exact >= 0), binary: result };
  }
  function adcDecimalNmos(a, m, carry) {
    var binary = adcBinary(a, m, carry);
    var low = (a & 0x0F) + (m & 0x0F) + carry;
    if (low >= 10) low = ((low + 6) & 0x0F) + 0x10;
    var intermediate = (a & 0xF0) + (m & 0xF0) + low;
    var result = intermediate;
    if (result >= 0xA0) result += 0x60;
    return { A: byte(result), C: bit(result > 0xFF), N: bit(intermediate & 0x80), V: bit((~(a ^ m) & (a ^ intermediate) & 0x80) !== 0), Z: binary.Z, binary: binary.A, intermediate: byte(intermediate) };
  }
  function sbcDecimalNmos(a, m, carry) {
    var binary = sbcBinary(a, m, carry);
    var exact = a - m - (1 - carry);
    var adjusted = exact;
    if ((a & 0x0F) - (1 - carry) < (m & 0x0F)) adjusted -= 0x06;
    if (exact < 0) adjusted -= 0x60;
    return { A: byte(adjusted), C: bit(exact >= 0), N: binary.N, V: binary.V, Z: binary.Z, binary: binary.A, intermediate: binary.A };
  }

  var BRANCHES = {
    BCC: ["C", 0], BCS: ["C", 1], BNE: ["Z", 0], BEQ: ["Z", 1],
    BPL: ["N", 0], BMI: ["N", 1], BVC: ["V", 0], BVS: ["V", 1]
  };
  function branchTaken(mnemonic, p) { var rule = BRANCHES[mnemonic]; return p[rule[0]] === rule[1]; }
  function branchInfo(pc, offsetByte, taken) {
    var base = word(pc + 2);
    var target = word(base + signed8(offsetByte));
    var crossed = pageCrossed(base, target);
    return { base: base, offset: signed8(offsetByte), target: target, pc: taken ? target : base, cycles: 2 + (taken ? 1 : 0) + (taken && crossed ? 1 : 0), crossed: crossed };
  }

  var MODE_INFO = {
    IMP: ["implied", 1], ACC: ["accumulator", 1], IMM: ["immediate", 2], ZP: ["zero page", 2], ZPX: ["zero page indexed X", 2], ZPY: ["zero page indexed Y", 2],
    ABS: ["absolute", 3], ABSX: ["absolute indexed X", 3], ABSY: ["absolute indexed Y", 3], IND: ["indirect", 3], XIND: ["indexed indirect", 2], INDY: ["indirect indexed", 2], REL: ["relative", 2]
  };
  var OPCODE_ROWS = (
    "00 BRK IMP 7;01 ORA XIND 6;05 ORA ZP 3;06 ASL ZP 5;08 PHP IMP 3;09 ORA IMM 2;0A ASL ACC 2;0D ORA ABS 4;0E ASL ABS 6;" +
    "10 BPL REL 2;11 ORA INDY 5P;15 ORA ZPX 4;16 ASL ZPX 6;18 CLC IMP 2;19 ORA ABSY 4P;1D ORA ABSX 4P;1E ASL ABSX 7;" +
    "20 JSR ABS 6;21 AND XIND 6;24 BIT ZP 3;25 AND ZP 3;26 ROL ZP 5;28 PLP IMP 4;29 AND IMM 2;2A ROL ACC 2;2C BIT ABS 4;2D AND ABS 4;2E ROL ABS 6;" +
    "30 BMI REL 2;31 AND INDY 5P;35 AND ZPX 4;36 ROL ZPX 6;38 SEC IMP 2;39 AND ABSY 4P;3D AND ABSX 4P;3E ROL ABSX 7;" +
    "40 RTI IMP 6;41 EOR XIND 6;45 EOR ZP 3;46 LSR ZP 5;48 PHA IMP 3;49 EOR IMM 2;4A LSR ACC 2;4C JMP ABS 3;4D EOR ABS 4;4E LSR ABS 6;" +
    "50 BVC REL 2;51 EOR INDY 5P;55 EOR ZPX 4;56 LSR ZPX 6;58 CLI IMP 2;59 EOR ABSY 4P;5D EOR ABSX 4P;5E LSR ABSX 7;" +
    "60 RTS IMP 6;61 ADC XIND 6;65 ADC ZP 3;66 ROR ZP 5;68 PLA IMP 4;69 ADC IMM 2;6A ROR ACC 2;6C JMP IND 5;6D ADC ABS 4;6E ROR ABS 6;" +
    "70 BVS REL 2;71 ADC INDY 5P;75 ADC ZPX 4;76 ROR ZPX 6;78 SEI IMP 2;79 ADC ABSY 4P;7D ADC ABSX 4P;7E ROR ABSX 7;" +
    "81 STA XIND 6;84 STY ZP 3;85 STA ZP 3;86 STX ZP 3;88 DEY IMP 2;8A TXA IMP 2;8C STY ABS 4;8D STA ABS 4;8E STX ABS 4;" +
    "90 BCC REL 2;91 STA INDY 6;94 STY ZPX 4;95 STA ZPX 4;96 STX ZPY 4;98 TYA IMP 2;99 STA ABSY 5;9A TXS IMP 2;9D STA ABSX 5;" +
    "A0 LDY IMM 2;A1 LDA XIND 6;A2 LDX IMM 2;A4 LDY ZP 3;A5 LDA ZP 3;A6 LDX ZP 3;A8 TAY IMP 2;A9 LDA IMM 2;AA TAX IMP 2;AC LDY ABS 4;AD LDA ABS 4;AE LDX ABS 4;" +
    "B0 BCS REL 2;B1 LDA INDY 5P;B4 LDY ZPX 4;B5 LDA ZPX 4;B6 LDX ZPY 4;B8 CLV IMP 2;B9 LDA ABSY 4P;BA TSX IMP 2;BC LDY ABSX 4P;BD LDA ABSX 4P;BE LDX ABSY 4P;" +
    "C0 CPY IMM 2;C1 CMP XIND 6;C4 CPY ZP 3;C5 CMP ZP 3;C6 DEC ZP 5;C8 INY IMP 2;C9 CMP IMM 2;CA DEX IMP 2;CC CPY ABS 4;CD CMP ABS 4;CE DEC ABS 6;" +
    "D0 BNE REL 2;D1 CMP INDY 5P;D5 CMP ZPX 4;D6 DEC ZPX 6;D8 CLD IMP 2;D9 CMP ABSY 4P;DD CMP ABSX 4P;DE DEC ABSX 7;" +
    "E0 CPX IMM 2;E1 SBC XIND 6;E4 CPX ZP 3;E5 SBC ZP 3;E6 INC ZP 5;E8 INX IMP 2;E9 SBC IMM 2;EA NOP IMP 2;EC CPX ABS 4;ED SBC ABS 4;EE INC ABS 6;" +
    "F0 BEQ REL 2;F1 SBC INDY 5P;F5 SBC ZPX 4;F6 INC ZPX 6;F8 SED IMP 2;F9 SBC ABSY 4P;FD SBC ABSX 4P;FE INC ABSX 7"
  ).split(";").map(function (row) {
    var parts = row.split(" "), timing = parts[3];
    return { opcode: parseInt(parts[0], 16), mnemonic: parts[1], mode: parts[2], cycles: parseInt(timing, 10), pagePenalty: timing.endsWith("P"), bytes: MODE_INFO[parts[2]][1] };
  });
  function formatOpcodeForm(entry) {
    var operand = { IMP: "", ACC: " A", IMM: " #$20", ZP: " $20", ZPX: " $20,X", ZPY: " $20,Y", ABS: " $1234", ABSX: " $1234,X", ABSY: " $1234,Y", IND: " ($1234)", XIND: " ($20,X)", INDY: " ($20),Y", REL: " $C010" }[entry.mode];
    return entry.mnemonic + operand;
  }
  function sampleInstructionBytes(entry) {
    if (entry.bytes === 1) return [entry.opcode];
    if (entry.bytes === 2) return [entry.opcode, 0x20];
    return [entry.opcode, 0x34, 0x12];
  }

  function flagFootprint(mnemonic) {
    if (["ADC", "SBC"].includes(mnemonic)) return "N,V,Z,C";
    if (["ASL", "LSR", "ROL", "ROR", "CMP", "CPX", "CPY"].includes(mnemonic)) return "N,Z,C";
    if (["LDA", "LDX", "LDY", "TAX", "TAY", "TSX", "TXA", "TYA", "INC", "DEC", "INX", "INY", "DEX", "DEY", "PLA"].includes(mnemonic)) return "N,Z";
    if (mnemonic === "BIT") return "N,V,Z";
    if (["PLP", "RTI"].includes(mnemonic)) return "N,V,D,I,Z,C";
    if (["CLC", "SEC"].includes(mnemonic)) return "C";
    if (mnemonic === "CLV") return "V";
    if (["CLD", "SED"].includes(mnemonic)) return "D";
    if (["CLI", "SEI", "BRK"].includes(mnemonic)) return "I";
    return "none";
  }

  var CATEGORIES = [
    { id: "registers-status", title: "Registers & Flags" },
    { id: "addressing", title: "Addressing" },
    { id: "data-logic", title: "Data & Logic" },
    { id: "arithmetic", title: "Arithmetic" },
    { id: "branches", title: "Branches" },
    { id: "stack-interrupts", title: "Stack & Interrupts" },
    { id: "cycles-traces", title: "Cycles & Traces" }
  ];

  function family(id, categoryId, title, concept, rules, example) {
    return { id: id, categoryId: categoryId, title: title, levels: LEVELS.slice(), learn: { concept: concept, rules: rules, example: example } };
  }
  var FAMILIES = [
    family("status_byte_decode_encode", "registers-status", "Status byte encode/decode", "Read pushed status images without treating B as a persistent latch.", "Pushed/displayed status is NV1BDIZC; bit 5 is 1 and B is an image selected by the push source.", "$A6 means N1 V0 B0 D0 I1 Z1 C0."),
    family("register_wrap_and_nz", "registers-status", "Register wrap and N/Z", "Apply 8-bit register operations and their exact flag footprint.", "A, X, Y, and SP wrap modulo 256. TXS preserves N/Z; the other displayed transfers set them.", "X=$FF; INX gives X=$00, N0, Z1."),
    family("instruction_flag_footprint", "registers-status", "Instruction flag footprint", "Know which latches an instruction changes and which it preserves.", "Stores change no flags; BIT takes N/V from memory and Z from A&M.", "STA preserves every status latch."),
    family("addressing_mode_classify", "addressing", "Classify addressing mode", "Distinguish legal 6502 operand forms.", "Parentheses and the position of X/Y distinguish indexed-indirect from indirect-indexed.", "LDA ($40),Y is indirect indexed."),
    family("effective_address_direct_indexed", "addressing", "Direct/indexed address", "Compute zero-page and absolute indexed effective addresses.", "Zero-page indexing wraps at $FF; absolute indexing wraps at $FFFF.", "$F0,X with X=$30 addresses $20."),
    family("effective_address_indirect", "addressing", "Indirect effective address", "Follow little-endian pointers with the correct wrap rule.", "Zero-page pointer bytes wrap inside page zero; JMP ($xxFF) reads the high byte from $xx00 on NMOS 6502.", "($FF),Y reads its pointer high byte from $00."),
    family("operand_value_fetch", "addressing", "Fetch operand value", "Separate effective address from the byte read there.", "Immediate mode consumes the instruction byte; memory modes resolve an address and then read it.", "LDA $2000,X with X=$02 reads memory[$2002]."),
    family("relative_branch_target", "addressing", "Relative branch target", "Sign-extend a branch byte and add it to the post-operand PC.", "The branch base is PC+2, not the opcode address.", "$FA is -6."),
    family("load_store_effect", "data-logic", "Load/store effect", "Execute loads and stores without inventing side effects.", "Loads set N/Z; stores preserve all flags.", "LDA #$80 sets N1 Z0."),
    family("logic_instruction_effect", "data-logic", "Logic instruction effect", "Apply AND, ORA, or EOR to A.", "N/Z come from the stored 8-bit result; other flags are preserved.", "$AA EOR $AA gives $00, Z1."),
    family("compare_instruction_effect", "data-logic", "Compare effect", "Use subtraction flags without storing the difference.", "C means register >= operand unsigned; N is the temporary difference sign bit.", "$F0 CMP $10 gives C1 but N1."),
    family("shift_rotate_effect", "data-logic", "Shift/rotate effect", "Trace ASL, LSR, ROL, and ROR through carry.", "Rotates consume old C; all four operations put the outgoing bit in C and set N/Z.", "$02 with C1 ROR becomes $81."),
    family("bit_instruction_effect", "data-logic", "BIT effect", "Compute BIT's three independent flag sources.", "N=M7, V=M6, and Z tests whether A&M is zero.", "A=$0F, M=$F0 gives N1 V1 Z1."),
    family("adc_binary_effect", "arithmetic", "Binary ADC", "Add two bytes and carry with unsigned carry and signed overflow.", "C is ninth-bit carry; V reports same-sign inputs producing an opposite-sign result.", "$50+$50 gives $A0, V1, C0."),
    family("sbc_binary_effect", "arithmetic", "Binary SBC", "Subtract using the 6502's inverted-borrow carry convention.", "SBC computes A-M-(1-C); output C1 means no borrow.", "$00-$01 with C1 gives $FF, C0."),
    family("carry_overflow_interpretation", "arithmetic", "Carry versus overflow", "Interpret the same result in unsigned and signed arithmetic.", "Carry/borrow and V answer different questions and may disagree.", "$7F+$01 has C0 but V1."),
    family("decimal_adc_sbc", "arithmetic", "NMOS decimal ADC/SBC", "Execute valid packed-BCD arithmetic under original NMOS rules.", "A and C use BCD correction; N/V/Z come from NMOS binary/intermediate behavior.", "$45+$55 gives decimal $00 C1, but NMOS N1 V1 Z0."),
    family("branch_condition", "branches", "Branch condition", "Identify the one flag tested by each branch mnemonic.", "BCC/BCS use C, BNE/BEQ use Z, BPL/BMI use N, BVC/BVS use V.", "Z0 makes BNE taken."),
    family("branch_pc_and_cycles", "branches", "Branch PC and cycles", "Combine branch decision, relative target, and timing.", "Branches cost 2, +1 if taken, +1 more for a taken page crossing.", "Taken same-page branch costs 3."),
    family("jump_call_target", "branches", "Jump/call/return target", "Distinguish JMP, JSR, RTS, and RTI next-PC rules.", "RTS adds one to its pulled word; RTI does not.", "RTS pulling $C002 continues at $C003."),
    family("push_pull_trace", "stack-interrupts", "Push/pull trace", "Apply stack write/read order inside page 1.", "Push writes at $0100+SP then decrements; pull increments then reads.", "SP=$FD; PHA writes $01FD then leaves SP=$FC."),
    family("jsr_rts_trace", "stack-interrupts", "JSR/RTS trace", "Trace the 6502's unusual saved return address.", "JSR pushes its last operand-byte address high then low; RTS pulls and adds one.", "JSR at $C000 saves $C002."),
    family("interrupt_entry", "stack-interrupts", "Interrupt entry", "Build an exact BRK, IRQ, or NMI frame.", "Push PCH, PCL, status; BRK uses return PC+2 and B1, IRQ/NMI use current PC and B0; then set I.", "NMI vector is read from $FFFA/$FFFB."),
    family("rti_restore", "stack-interrupts", "RTI restore", "Restore status and PC from an interrupt frame.", "RTI pulls status, PCL, PCH and does not add one.", "SP=$FC becomes $FF after RTI."),
    family("instruction_base_cycles", "cycles-traces", "Base instruction cycles", "Recall documented timing for exact opcode forms.", "Use the opcode/addressing pair; do not add penalties when the prompt excludes them.", "LDA immediate costs 2; JSR absolute costs 6."),
    family("indexed_page_penalty", "cycles-traces", "Indexed page penalty", "Apply page-cross penalties only to eligible indexed reads.", "Stores and read-modify-write forms have fixed indexed timing.", "LDA abs,X may be 4+1; STA abs,X is fixed 5."),
    family("snippet_cycle_total", "cycles-traces", "Snippet cycle total", "Follow a short deterministic path and add exact instruction costs.", "Count only executed instructions and named dynamic penalties.", "LDA #imm; TAX costs 2+2=4."),
    family("register_trace_snippet", "cycles-traces", "Register trace", "Execute a short initialized register/flag snippet.", "Every instruction applies in order; preserved flags stay preserved.", "LDA #$FE; CLC; ADC #$01 leaves A=$FF."),
    family("memory_trace_snippet", "cycles-traces", "Memory trace", "Follow initialized reads and exact writes through a short snippet.", "Report only selected final bytes and preserve untouched memory.", "LDA #$2A; STA $10 writes $0010=$2A.")
  ];

  var generatedTranslationPairs = null;
  function translateGenerated(value) {
    if (TEXT.localeCode === "en" || value === null || value === undefined) return String(value || "");
    if (generatedTranslationPairs === null) {
      generatedTranslationPairs = (TEXT.generatedReplacements || []).slice().sort(function (a, b) { return b[0].length - a[0].length; });
    }
    var output = String(value);
    generatedTranslationPairs.forEach(function (pair, index) { output = output.split(pair[0]).join("\uE100" + index + "\uE101"); });
    generatedTranslationPairs.forEach(function (pair, index) { output = output.split("\uE100" + index + "\uE101").join(pair[1]); });
    return output;
  }
  function localizeStaticData() {
    if (TEXT.localeCode === "en") return;
    CATEGORIES.forEach(function (category) { if (TEXT.categories && TEXT.categories[category.id]) category.title = TEXT.categories[category.id]; });
    FAMILIES.forEach(function (fam) {
      var localized = TEXT.families && TEXT.families[fam.id];
      if (!localized) return;
      fam.title = localized.title; fam.learn.concept = localized.concept; fam.learn.rules = localized.rules; fam.learn.example = localized.example;
    });
  }
  function localizeQuestion(item) {
    if (TEXT.localeCode === "en") return item;
    item.prompt.title = translateGenerated(item.prompt.title);
    item.prompt.rows = item.prompt.rows.map(translateGenerated);
    item.prompt.note = translateGenerated(item.prompt.note);
    item.fields.forEach(function (answerField) {
      answerField.label = (TEXT.fieldLabels && TEXT.fieldLabels[answerField.label]) || translateGenerated(answerField.label);
      if (answerField.options) answerField.options.forEach(function (option) { option.label = (TEXT.choiceLabels && TEXT.choiceLabels[option.value]) || translateGenerated(option.label); });
    });
    item.explanation = translateGenerated(item.explanation);
    return item;
  }
  localizeStaticData();

  function categoryById(id) { return CATEGORIES.find(function (item) { return item.id === id; }) || CATEGORIES[0]; }
  function familyById(id) { return FAMILIES.find(function (item) { return item.id === id; }) || FAMILIES[0]; }

  function prompt(title, rows, note) { return { title: title, rows: rows || [], note: note || "" }; }
  function field(id, label, kind, answer, options) { return { id: id, label: label, kind: kind, answer: String(answer), options: options || null }; }
  function byteField(id, label, value) { return field(id, label, "byte", h2(value)); }
  function wordField(id, label, value) { return field(id, label, "word", h4(value)); }
  function intField(id, label, value) { return field(id, label, "integer", value); }
  function choiceField(id, label, answer, values) { return field(id, label, "choice", answer, values.map(function (value) { return { value: String(value), label: String(value) }; })); }
  function flagField(id, label, value) { return choiceField(id, label, String(bit(value)), ["0", "1"]); }
  function yesNoField(id, label, value) { return choiceField(id, label, value ? "yes" : "no", ["yes", "no"]); }
  function question(familyId, level, promptData, fields, explanation, signature, metadata) {
    var fam = familyById(familyId);
    var canonical = {};
    fields.forEach(function (item) { canonical[item.id] = item.answer; });
    return localizeQuestion({
      modelId: MODEL_ID, familyId: familyId, categoryId: fam.categoryId, level: level,
      prompt: promptData, fields: fields, canonicalAnswer: canonical, explanation: explanation,
      structuralSignature: [familyId, level].concat(signature || []).join("|"), metadata: metadata || {}
    });
  }

  var GENERATORS = {};

  GENERATORS.status_byte_decode_encode = function (level, r) {
    var p = flags({ N: r.int(0, 1), V: r.int(0, 1), D: r.int(0, 1), I: r.int(0, 1), Z: r.int(0, 1), C: r.int(0, 1) });
    var b = r.int(0, 1);
    if (level >= 4 && r.chance()) {
      var php = statusByte(p, 1);
      var irq = statusByte(p, 0);
      return question("status_byte_decode_encode", level,
        prompt("Encode the same latch flags as two pushed status images.", ["N" + p.N + " V" + p.V + " D" + p.D + " I" + p.I + " Z" + p.Z + " C" + p.C], "B is an image bit, not a persistent latch."),
        [byteField("php", "PHP image", php), byteField("irq", "IRQ image", irq)],
        "NV1BDIZC gives PHP " + h2(php) + " (B=1) and IRQ " + h2(irq) + " (B=0).", ["contrast", statusByte(p, 0)]);
    }
    if (level >= 2 && r.chance()) {
      var encoded = statusByte(p, b);
      return question("status_byte_decode_encode", level,
        prompt("Encode this pushed/displayed status image.", ["N" + p.N + " V" + p.V + " B-image" + b + " D" + p.D + " I" + p.I + " Z" + p.Z + " C" + p.C], "Bit 5 is displayed as 1."),
        [byteField("status", "Status byte", encoded)], "Placing the bits as NV1BDIZC gives " + h2(encoded) + ".", ["encode", encoded]);
    }
    var value = statusByte(p, b);
    var decoded = decodeStatus(value);
    return question("status_byte_decode_encode", level,
      prompt("Decode this pushed/displayed status byte.", [h2(value), "layout NV1BDIZC"], "Report the B image separately from the six modeled latches."),
      [flagField("N", "N", decoded.N), flagField("V", "V", decoded.V), flagField("B", "B image", decoded.B), flagField("D", "D", decoded.D), flagField("I", "I", decoded.I), flagField("Z", "Z", decoded.Z), flagField("C", "C", decoded.C)],
      h2(value) + " = " + value.toString(2).padStart(8, "0") + " in NV1BDIZC order.", ["decode", value]);
  };

  GENERATORS.register_wrap_and_nz = function (level, r) {
    var operations = level <= 1 ? ["INX", "DEX", "INY", "DEY"] : ["INX", "DEX", "INY", "DEY", "TAX", "TAY", "TXA", "TYA", "TSX", "TXS"];
    var op = r.choice(operations);
    var state = { A: edgeByte(r), X: edgeByte(r), Y: edgeByte(r), SP: edgeByte(r), N: r.int(0, 1), Z: r.int(0, 1) };
    var target = op.includes("X") && !["TXA", "TXS"].includes(op) ? "X" : op.includes("Y") && op !== "TYA" ? "Y" : op === "TXA" || op === "TYA" ? "A" : "SP";
    var result;
    if (op === "INX") result = byte(state.X + 1);
    else if (op === "DEX") result = byte(state.X - 1);
    else if (op === "INY") result = byte(state.Y + 1);
    else if (op === "DEY") result = byte(state.Y - 1);
    else if (op === "TAX") result = state.A;
    else if (op === "TAY") result = state.A;
    else if (op === "TXA") result = state.X;
    else if (op === "TYA") result = state.Y;
    else if (op === "TSX") result = state.SP;
    else result = state.X;
    var afterNz = op === "TXS" ? { N: state.N, Z: state.Z } : nz(result);
    return question("register_wrap_and_nz", level,
      prompt("Execute one register instruction.", ["A=" + h2(state.A) + " X=" + h2(state.X) + " Y=" + h2(state.Y) + " SP=" + h2(state.SP), "initial N" + state.N + " Z" + state.Z, op], op === "TXS" ? "TXS preserves N and Z." : "Report N/Z after the instruction."),
      [byteField("result", target, result), flagField("N", "N", afterNz.N), flagField("Z", "Z", afterNz.Z)],
      op + " leaves " + target + "=" + h2(result) + ", N=" + afterNz.N + ", Z=" + afterNz.Z + ".", [op, state[target], result]);
  };

  GENERATORS.instruction_flag_footprint = function (level, r) {
    var entries = OPCODE_ROWS.filter(function (entry) { return level >= 3 || !["BIT", "PLP", "RTI", "SBC"].includes(entry.mnemonic); });
    var entry = r.choice(entries), op = entry.mnemonic, answer = flagFootprint(op);
    var options = Array.from(new Set([answer, "none", "N,Z", "N,Z,C", "N,V,Z", "N,V,Z,C", "C", "I", "N,V,D,I,Z,C"]));
    return question("instruction_flag_footprint", level,
      prompt("Which modeled status latches can this exact instruction form change?", [formatOpcodeForm(entry), "opcode " + h2(entry.opcode)], "Choose the complete set; B is not a modeled latch."),
      [choiceField("flags", "Changed flags", answer, options)], op + " changes " + answer + "; every other modeled latch is preserved.", [entry.opcode], { opcode: entry.opcode, mode: entry.mode, instructionBytes: sampleInstructionBytes(entry) });
  };

  GENERATORS.addressing_mode_classify = function (level, r) {
    var allowedModes = level === 1 ? ["IMP", "ACC", "IMM", "ZP", "ABS"] : level === 2 ? ["IMP", "ACC", "IMM", "ZP", "ZPX", "ZPY", "ABS", "ABSX", "ABSY", "REL"] : Object.keys(MODE_INFO);
    var entry = r.choice(OPCODE_ROWS.filter(function (item) { return allowedModes.includes(item.mode); }));
    var answer = MODE_INFO[entry.mode][0], options = Object.keys(MODE_INFO).map(function (mode) { return MODE_INFO[mode][0]; });
    return question("addressing_mode_classify", level, prompt("Name the addressing mode.", [formatOpcodeForm(entry), "opcode " + h2(entry.opcode)], "This is one of the 151 documented opcode forms in the declared NMOS table."),
      [choiceField("mode", "Addressing mode", answer, options)], formatOpcodeForm(entry) + " uses " + answer + " addressing and occupies " + entry.bytes + " byte" + (entry.bytes === 1 ? "" : "s") + ".", [entry.opcode], { opcode: entry.opcode, mode: entry.mode, instructionBytes: sampleInstructionBytes(entry) });
  };

  GENERATORS.effective_address_direct_indexed = function (level, r) {
    var zeroPage = level <= 2 || r.chance();
    var indexName = r.choice(["X", "Y"]);
    var index = edgeByte(r);
    var base = zeroPage ? edgeByte(r) : edgeWord(r);
    if (level >= 2 && r.chance()) base = zeroPage ? r.int(0xE0, 0xFF) : word((r.int(0, 255) << 8) | r.int(0xE0, 0xFF));
    var address = zeroPage ? byte(base + index) : word(base + index);
    var operand = (zeroPage ? h2(base) : h4(base)) + "," + indexName;
    return question("effective_address_direct_indexed", level, prompt("Compute the effective address.", [indexName + "=" + h2(index), operand], zeroPage ? "Zero-page indexing wraps within page zero." : "Absolute indexing wraps modulo 65536."),
      [zeroPage ? byteField("address", "Effective address", address) : wordField("address", "Effective address", address)],
      (zeroPage ? "8-bit" : "16-bit") + " addition gives " + (zeroPage ? h2(address) : h4(address)) + ".", [zeroPage ? "zp" : "abs", base, index]);
  };

  GENERATORS.effective_address_indirect = function (level, r) {
    var variant = level >= 5 ? r.choice(["pre", "post", "jmpBug"]) : level >= 3 ? r.choice(["pre", "post"]) : "pre";
    if (variant === "jmpBug") {
      var pointer = (r.int(0, 255) << 8) | 0xFF;
      var lo = edgeByte(r), hi = edgeByte(r), target = lo | (hi << 8);
      return question("effective_address_indirect", level, prompt("Resolve the NMOS indirect JMP target.", ["JMP (" + h4(pointer) + ")", h4(pointer) + "=" + h2(lo), h4(pointer & 0xFF00) + "=" + h2(hi)], "The NMOS page-wrap behavior is part of the declared model."),
        [wordField("target", "Target", target)], "Low comes from " + h4(pointer) + "; high wraps to " + h4(pointer & 0xFF00) + ", giving " + h4(target) + ".", [variant, pointer, target]);
    }
    var zp = edgeByte(r), index = edgeByte(r), loAddress, hiAddress, loValue = edgeByte(r), hiValue = edgeByte(r), baseAddress, effective;
    if (variant === "pre") {
      loAddress = byte(zp + index); hiAddress = byte(loAddress + 1); baseAddress = loValue | (hiValue << 8); effective = baseAddress;
      return question("effective_address_indirect", level, prompt("Resolve the indexed-indirect effective address.", ["X=" + h2(index) + ", operand (" + h2(zp) + ",X)", h2(loAddress) + "=" + h2(loValue) + ", " + h2(hiAddress) + "=" + h2(hiValue)], "Add X in zero page before reading the little-endian pointer."),
        [byteField("pointerLow", "Pointer low address", loAddress), byteField("pointerHigh", "Pointer high address", hiAddress), wordField("address", "Effective address", effective)],
        h2(zp) + "+" + h2(index) + " wraps to " + h2(loAddress) + "; pointer bytes form " + h4(effective) + ".", [variant, zp, index, effective]);
    }
    loAddress = zp; hiAddress = byte(zp + 1); baseAddress = loValue | (hiValue << 8); effective = word(baseAddress + index);
    return question("effective_address_indirect", level, prompt("Resolve the indirect-indexed effective address.", ["Y=" + h2(index) + ", operand (" + h2(zp) + "),Y", h2(loAddress) + "=" + h2(loValue) + ", " + h2(hiAddress) + "=" + h2(hiValue)], "Read the zero-page pointer first, then add Y."),
      [wordField("base", "Pointer value", baseAddress), wordField("address", "Effective address", effective)],
      "The pointer is " + h4(baseAddress) + "; adding Y gives " + h4(effective) + ".", [variant, zp, index, effective]);
  };

  GENERATORS.operand_value_fetch = function (level, r) {
    if (level === 1 && r.chance()) {
      var immediate = edgeByte(r);
      return question("operand_value_fetch", level, prompt("Which byte does this instruction consume?", ["LDA #" + h2(immediate)], "Immediate mode performs no data-memory read."),
        [byteField("value", "Operand byte", immediate)], "The immediate operand byte is " + h2(immediate) + ".", ["imm", immediate]);
    }
    var index = edgeByte(r), base = level >= 3 ? edgeWord(r) : word(0x2000 + r.int(0, 0xDF)), address = word(base + index), value = edgeByte(r);
    return question("operand_value_fetch", level, prompt("Resolve the address and fetch the operand byte.", ["X=" + h2(index), "LDA " + h4(base) + ",X", h4(address) + "=" + h2(value)], "Only the relevant initialized memory byte is shown."),
      [wordField("address", "Effective address", address), byteField("value", "Operand byte", value)], "The indexed address is " + h4(address) + ", whose byte is " + h2(value) + ".", ["absx", base, index, value]);
  };

  GENERATORS.relative_branch_target = function (level, r) {
    var pc = level >= 4 ? r.choice([0xFFFE, 0xFFFF, 0x00FE, 0x7FFF]) : edgeWord(r);
    var offset = level === 1 ? r.int(0, 20) : edgeByte(r);
    var info = branchInfo(pc, offset, true);
    return question("relative_branch_target", level, prompt("Decode the signed displacement and compute the branch target.", ["opcode PC=" + h4(pc), "operand byte=" + h2(offset)], "Add the displacement to the post-operand PC."),
      [intField("offset", "Signed offset", info.offset), wordField("base", "PC after operand", info.base), wordField("target", "Target", info.target)],
      h4(info.base) + " + " + info.offset + " = " + h4(info.target) + " modulo 65536.", [pc, offset]);
  };

  GENERATORS.load_store_effect = function (level, r) {
    var load = r.chance();
    var register = r.choice(["A", "X", "Y"]);
    var value = edgeByte(r);
    if (load) {
      var op = "LD" + register;
      var resultNz = nz(value);
      var source = level === 1 ? "#" + h2(value) : h2(r.int(0x10, 0xEF));
      var rows = [op + " " + source];
      if (source[0] !== "#") rows.push("memory[" + source + "]=" + h2(value));
      return question("load_store_effect", level, prompt("Execute the load.", rows, "Loads set N and Z from the byte loaded."),
        [byteField("register", register, value), flagField("N", "N", resultNz.N), flagField("Z", "Z", resultNz.Z)],
        op + " stores " + h2(value) + " in " + register + " and sets N=" + resultNz.N + ", Z=" + resultNz.Z + ".", [op, value]);
    }
    var storeOp = "ST" + register;
    var address = level >= 3 ? edgeWord(r) : r.int(0x10, 0xEF);
    var priorN = r.int(0, 1), priorZ = r.int(0, 1);
    return question("load_store_effect", level, prompt("Execute the store.", [register + "=" + h2(value), "N" + priorN + " Z" + priorZ, storeOp + " " + (address <= 0xFF ? h2(address) : h4(address))], "Stores preserve status flags."),
      [byteField("memory", "Stored byte", value), flagField("N", "N after", priorN), flagField("Z", "Z after", priorZ)],
      "Memory receives " + h2(value) + "; N and Z remain " + priorN + " and " + priorZ + ".", [storeOp, address, value]);
  };

  GENERATORS.logic_instruction_effect = function (level, r) {
    var op = r.choice(["AND", "ORA", "EOR"]), a = edgeByte(r), m = edgeByte(r);
    var result = op === "AND" ? a & m : op === "ORA" ? a | m : a ^ m;
    var resultNz = nz(result);
    return question("logic_instruction_effect", level, prompt("Execute the accumulator logic instruction.", ["A=" + h2(a), op + " #" + h2(m)], "Other status latches are preserved."),
      [byteField("A", "A", result), flagField("N", "N", resultNz.N), flagField("Z", "Z", resultNz.Z)],
      h2(a) + " " + op + " " + h2(m) + " = " + h2(result) + ", so N=" + resultNz.N + " and Z=" + resultNz.Z + ".", [op, a, m]);
  };

  GENERATORS.compare_instruction_effect = function (level, r) {
    var op = r.choice(["CMP", "CPX", "CPY"]), register = op === "CMP" ? "A" : op === "CPX" ? "X" : "Y";
    var left = edgeByte(r), right = edgeByte(r), difference = byte(left - right), resultNz = nz(difference), carry = bit(left >= right);
    var relation = left === right ? "equal" : left > right ? "greater unsigned" : "less unsigned";
    return question("compare_instruction_effect", level, prompt("Execute the compare without changing the register.", [register + "=" + h2(left), op + " #" + h2(right)], "C is the unsigned no-borrow result."),
      [flagField("N", "N", resultNz.N), flagField("Z", "Z", resultNz.Z), flagField("C", "C", carry), choiceField("relation", "Unsigned relation", relation, ["less unsigned", "equal", "greater unsigned"])],
      "Temporary difference " + h2(difference) + " gives N=" + resultNz.N + ", Z=" + resultNz.Z + "; unsigned relation is " + relation + ", so C=" + carry + ".", [op, left, right]);
  };

  function shiftResult(op, value, carryIn) {
    var result, carryOut;
    if (op === "ASL") { carryOut = bit(value & 0x80); result = byte(value << 1); }
    else if (op === "LSR") { carryOut = bit(value & 1); result = value >>> 1; }
    else if (op === "ROL") { carryOut = bit(value & 0x80); result = byte((value << 1) | carryIn); }
    else { carryOut = bit(value & 1); result = (value >>> 1) | (carryIn << 7); }
    return Object.assign({ result: result, C: carryOut }, nz(result));
  }
  GENERATORS.shift_rotate_effect = function (level, r) {
    var op = r.choice(level <= 1 ? ["ASL", "LSR"] : ["ASL", "LSR", "ROL", "ROR"]), value = edgeByte(r), carryIn = r.int(0, 1), memory = level >= 3 && r.chance();
    var result = shiftResult(op, value, carryIn), operand = memory ? h2(r.int(0x10, 0xEF)) : "A";
    var rows = [(memory ? "memory[" + operand + "]=" : "A=") + h2(value), "C=" + carryIn, op + " " + operand];
    return question("shift_rotate_effect", level, prompt("Execute the shift or rotate.", rows, "For a rotate, old C enters the vacated bit."),
      [byteField("result", memory ? "Memory result" : "A", result.result), flagField("N", "N", result.N), flagField("Z", "Z", result.Z), flagField("C", "C", result.C)],
      op + " gives " + h2(result.result) + "; outgoing bit C=" + result.C + ", N=" + result.N + ", Z=" + result.Z + ".", [op, value, carryIn, memory ? "mem" : "A"]);
  };

  GENERATORS.bit_instruction_effect = function (level, r) {
    var a = edgeByte(r), m = edgeByte(r), n = bit(m & 0x80), v = bit(m & 0x40), z = bit((a & m) === 0);
    return question("bit_instruction_effect", level, prompt("Execute BIT.", ["A=" + h2(a), "M=" + h2(m)], "N and V copy memory bits; Z tests A AND M."),
      [flagField("N", "N", n), flagField("V", "V", v), flagField("Z", "Z", z)],
      "M7=" + n + ", M6=" + v + ", and A&M=" + h2(a & m) + ", so Z=" + z + ".", [a, m]);
  };

  function arithmeticFields(result) {
    return [byteField("A", "A", result.A), flagField("N", "N", result.N), flagField("V", "V", result.V), flagField("Z", "Z", result.Z), flagField("C", "C", result.C)];
  }
  GENERATORS.adc_binary_effect = function (level, r) {
    var a = edgeByte(r), m = edgeByte(r), carry = r.int(0, 1);
    if (level >= 3 && r.chance()) { a = r.choice([0x40, 0x50, 0x70, 0x80, 0x90, 0xC0]); m = r.choice([0x20, 0x40, 0x50, 0x80, 0xA0]); }
    var result = adcBinary(a, m, carry);
    return question("adc_binary_effect", level, prompt("Execute binary ADC (D=0).", ["A=" + h2(a) + " M=" + h2(m) + " C=" + carry], "Report the stored byte and N,V,Z,C."), arithmeticFields(result),
      "Exact unsigned sum is " + (a + m + carry) + "; stored A=" + h2(result.A) + ", N" + result.N + " V" + result.V + " Z" + result.Z + " C" + result.C + ".", [a, m, carry]);
  };

  GENERATORS.sbc_binary_effect = function (level, r) {
    var a = edgeByte(r), m = edgeByte(r), carry = r.int(0, 1);
    if (level >= 3 && r.chance()) { a = r.choice([0, 0x7F, 0x80, 0x90]); m = r.choice([1, 0x7F, 0x80, 0xFF]); }
    var result = sbcBinary(a, m, carry), exact = a - m - (1 - carry);
    return question("sbc_binary_effect", level, prompt("Execute binary SBC (D=0).", ["A=" + h2(a) + " M=" + h2(m) + " C=" + carry], "Remember: C=1 means no incoming borrow."), arithmeticFields(result),
      "Exact subtraction is " + exact + "; stored A=" + h2(result.A) + ", and output C=" + result.C + " means " + (result.C ? "no borrow" : "borrow") + ". N" + result.N + " V" + result.V + " Z" + result.Z + ".", [a, m, carry]);
  };

  GENERATORS.carry_overflow_interpretation = function (level, r) {
    var op = r.choice(["ADC", "SBC"]), a = edgeByte(r), m = edgeByte(r), carry = r.int(0, 1);
    if (level >= 2 && r.chance()) { var pair = r.choice([[0xFF, 1], [0x7F, 1], [0x80, 1], [0x50, 0x50]]); a = pair[0]; m = pair[1]; carry = 1; }
    var result = op === "ADC" ? adcBinary(a, m, carry) : sbcBinary(a, m, carry);
    var signedA = signed8(a), signedM = signed8(m), signedExact = op === "ADC" ? signedA + signedM + carry : signedA - signedM - (1 - carry);
    var unsignedStatus = op === "ADC" ? (result.C ? "carry" : "no carry") : (result.C ? "no borrow" : "borrow");
    return question("carry_overflow_interpretation", level, prompt("Interpret the binary arithmetic status both ways.", ["A=" + h2(a) + " M=" + h2(m) + " C=" + carry, op], "Carry/borrow is unsigned; V is signed overflow."),
      [byteField("result", "Stored result", result.A), choiceField("unsigned", "Unsigned status", unsignedStatus, ["carry", "no carry", "borrow", "no borrow"]), flagField("V", "Signed overflow V", result.V)],
      "Stored result is " + h2(result.A) + ". Unsigned status: " + unsignedStatus + ". Signed mathematical result " + signedExact + (result.V ? " is outside -128..127" : " fits -128..127") + ".", [op, a, m, carry]);
  };

  GENERATORS.decimal_adc_sbc = function (level, r) {
    var op = level <= 3 ? "ADC" : r.choice(["ADC", "SBC"]), a = validBcd(r), m = validBcd(r), carry = r.int(0, 1);
    if (level >= 5 && op === "ADC" && r.chance()) { a = 0x45; m = 0x55; carry = 0; }
    var result = op === "ADC" ? adcDecimalNmos(a, m, carry) : sbcDecimalNmos(a, m, carry);
    return question("decimal_adc_sbc", level, prompt("Execute valid-BCD arithmetic on the original NMOS 6502.", ["D=1 A=" + h2(a) + " M=" + h2(m) + " C=" + carry, op], "A/C use BCD correction; N/V/Z follow NMOS intermediate behavior."), arithmeticFields(result),
      "Binary intermediate is " + h2(result.binary) + "; BCD-corrected A=" + h2(result.A) + ", C" + result.C + ". NMOS flags are N" + result.N + " V" + result.V + " Z" + result.Z + ".", [op, a, m, carry]);
  };

  GENERATORS.branch_condition = function (level, r) {
    var mnemonic = r.choice(Object.keys(BRANCHES)), p = flags({ N: r.int(0, 1), V: r.int(0, 1), Z: r.int(0, 1), C: r.int(0, 1) });
    var rule = BRANCHES[mnemonic], taken = branchTaken(mnemonic, p);
    return question("branch_condition", level, prompt("Will this conditional branch be taken?", ["N" + p.N + " V" + p.V + " Z" + p.Z + " C" + p.C, mnemonic], "Only one displayed flag is tested."),
      [yesNoField("taken", "Taken?", taken), choiceField("flag", "Tested flag", rule[0], ["N", "V", "Z", "C"])],
      mnemonic + " tests " + rule[0] + " for " + rule[1] + "; it is " + (taken ? "taken" : "not taken") + ".", [mnemonic, p[rule[0]]]);
  };

  GENERATORS.branch_pc_and_cycles = function (level, r) {
    var mnemonic = r.choice(Object.keys(BRANCHES)), p = flags({ N: r.int(0, 1), V: r.int(0, 1), Z: r.int(0, 1), C: r.int(0, 1) });
    var taken = branchTaken(mnemonic, p), pc = level >= 3 && r.chance() ? word((r.int(0, 255) << 8) | r.choice([0xFD, 0xFE, 0xFF])) : edgeWord(r);
    var offset = level === 1 ? r.int(0, 12) : edgeByte(r), info = branchInfo(pc, offset, taken);
    return question("branch_pc_and_cycles", level, prompt("Execute the branch and count its cycles.", ["PC=" + h4(pc) + " operand=" + h2(offset), "N" + p.N + " V" + p.V + " Z" + p.Z + " C" + p.C, mnemonic], "Base cost is 2 cycles."),
      [yesNoField("taken", "Taken?", taken), wordField("pc", "Final PC", info.pc), intField("cycles", "Cycles", info.cycles)],
      (taken ? "Taken to " + h4(info.target) : "Not taken; continue at " + h4(info.base)) + ". Cycles = 2" + (taken ? "+1" : "") + (taken && info.crossed ? "+1 page cross" : "") + " = " + info.cycles + ".", [mnemonic, pc, offset, taken]);
  };

  GENERATORS.jump_call_target = function (level, r) {
    var op = level === 1 ? "JMP" : r.choice(["JMP", "JSR", "RTS", "RTI"]), supplied = edgeWord(r), target;
    if (op === "JMP" || op === "JSR") target = supplied;
    else if (op === "RTS") target = word(supplied + 1);
    else target = supplied;
    var rows = op === "JMP" || op === "JSR" ? [op + " " + h4(supplied)] : [op + " pulls PC word " + h4(supplied)];
    return question("jump_call_target", level, prompt("What is the next PC?", rows, op === "RTS" ? "RTS adds one after pulling." : op === "RTI" ? "RTI does not add one." : "Use the supplied absolute target."),
      [wordField("pc", "Next PC", target)], op + " continues at " + h4(target) + ".", [op, supplied]);
  };

  GENERATORS.push_pull_trace = function (level, r) {
    var op = level <= 1 ? "PHA" : r.choice(["PHA", "PLA", "PHP", "PLP"]), sp = edgeByte(r), a = edgeByte(r), p = flags({ N: r.int(0, 1), V: r.int(0, 1), D: r.int(0, 1), I: r.int(0, 1), Z: r.int(0, 1), C: r.int(0, 1) });
    if (op === "PHA" || op === "PHP") {
      var pushed = op === "PHA" ? a : statusByte(p, 1), address = 0x0100 | sp, finalSp = byte(sp - 1);
      return question("push_pull_trace", level, prompt("Execute the stack push.", ["SP=" + h2(sp), op === "PHA" ? "A=" + h2(a) : "latches N" + p.N + " V" + p.V + " D" + p.D + " I" + p.I + " Z" + p.Z + " C" + p.C, op], "Push writes first, then decrements SP."),
        [wordField("address", "Write address", address), byteField("value", "Pushed byte", pushed), byteField("SP", "Final SP", finalSp)],
        op + " writes " + h2(pushed) + " to " + h4(address) + " then leaves SP=" + h2(finalSp) + ".", [op, sp, pushed]);
    }
    var readAddress = 0x0100 | byte(sp + 1), pulled = edgeByte(r), afterSp = byte(sp + 1);
    if (op === "PLA") {
      var pulledNz = nz(pulled);
      return question("push_pull_trace", level, prompt("Execute the stack pull.", ["SP=" + h2(sp), h4(readAddress) + "=" + h2(pulled), "PLA"], "Pull increments SP before reading."),
        [byteField("A", "A", pulled), byteField("SP", "Final SP", afterSp), flagField("N", "N", pulledNz.N), flagField("Z", "Z", pulledNz.Z)],
        "SP increments to " + h2(afterSp) + "; PLA reads " + h2(pulled) + " from " + h4(readAddress) + " and sets N/Z.", [op, sp, pulled]);
    }
    var decoded = decodeStatus(pulled);
    return question("push_pull_trace", level, prompt("Execute PLP from this initialized stack byte.", ["SP=" + h2(sp), h4(readAddress) + "=" + h2(pulled), "PLP"], "B and displayed bit 5 are not persistent modeled latches."),
      [byteField("SP", "Final SP", afterSp), flagField("N", "N", decoded.N), flagField("V", "V", decoded.V), flagField("D", "D", decoded.D), flagField("I", "I", decoded.I), flagField("Z", "Z", decoded.Z), flagField("C", "C", decoded.C)],
      "PLP increments SP, reads " + h2(pulled) + ", and restores N,V,D,I,Z,C from that image.", [op, sp, pulled]);
  };

  GENERATORS.jsr_rts_trace = function (level, r) {
    var pc = level >= 4 ? edgeWord(r) : word(0xC000 + r.int(0, 0xEF)), target = edgeWord(r), sp = edgeByte(r), saved = word(pc + 2);
    if (r.chance()) {
      return question("jsr_rts_trace", level, prompt("Trace JSR entry.", ["PC=" + h4(pc) + " SP=" + h2(sp), "JSR " + h4(target)], "JSR pushes the address of its last operand byte, high byte then low byte."),
        [wordField("highAddress", "High-byte write", 0x0100 | sp), byteField("high", "High byte", saved >>> 8), wordField("lowAddress", "Low-byte write", 0x0100 | byte(sp - 1)), byteField("low", "Low byte", saved), byteField("SP", "Final SP", byte(sp - 2)), wordField("PC", "Final PC", target)],
        "Saved word is PC+2=" + h4(saved) + ". Push " + h2(saved >>> 8) + " then " + h2(saved) + "; enter " + h4(target) + ".", ["JSR", pc, sp, target]);
    }
    var stackSp = byte(sp - 2), lowAddress = 0x0100 | byte(stackSp + 1), highAddress = 0x0100 | byte(stackSp + 2), finalPc = word(saved + 1);
    return question("jsr_rts_trace", level, prompt("Trace the matching RTS.", ["SP=" + h2(stackSp), h4(lowAddress) + "=" + h2(saved), h4(highAddress) + "=" + h2(saved >>> 8), "RTS"], "RTS pulls low then high and adds one."),
      [wordField("pulled", "Pulled word", saved), byteField("SP", "Final SP", sp), wordField("PC", "Final PC", finalPc)],
      "RTS reconstructs " + h4(saved) + ", adds one, and continues at " + h4(finalPc) + ".", ["RTS", saved, stackSp]);
  };

  GENERATORS.interrupt_entry = function (level, r) {
    var kind = level <= 3 ? "NMI" : r.choice(["BRK", "IRQ", "NMI"]), pc = edgeWord(r), sp = edgeByte(r), p = flags({ N: r.int(0, 1), V: r.int(0, 1), D: r.int(0, 1), I: kind === "IRQ" ? 0 : r.int(0, 1), Z: r.int(0, 1), C: r.int(0, 1) });
    var returnPc = kind === "BRK" ? word(pc + 2) : pc, pushedStatus = statusByte(p, kind === "BRK"), vector = kind === "NMI" ? 0xFFFA : 0xFFFE, vectorLo = edgeByte(r), vectorHi = edgeByte(r), target = vectorLo | (vectorHi << 8);
    return question("interrupt_entry", level, prompt("Trace scheduled " + kind + " entry.", ["PC=" + h4(pc) + " SP=" + h2(sp), "P latches: N" + p.N + " V" + p.V + " D" + p.D + " I" + p.I + " Z" + p.Z + " C" + p.C, h4(vector) + "=" + h2(vectorLo) + " " + h4(vector + 1) + "=" + h2(vectorHi)], "Push order is PCH, PCL, status; NMOS entry does not clear D."),
      [byteField("pch", "Pushed PCH", returnPc >>> 8), byteField("pcl", "Pushed PCL", returnPc), byteField("status", "Pushed status", pushedStatus), byteField("SP", "Final SP", byte(sp - 3)), flagField("I", "Final I", 1), wordField("PC", "Vector target", target)],
      kind + " pushes return PC " + h4(returnPc) + " and status " + h2(pushedStatus) + " (B image " + (kind === "BRK" ? 1 : 0) + "), sets I, then loads " + h4(target) + ".", [kind, pc, sp, target]);
  };

  GENERATORS.rti_restore = function (level, r) {
    var sp = edgeByte(r), status = edgeByte(r) | 0x20, pcl = edgeByte(r), pch = edgeByte(r), pc = pcl | (pch << 8), decoded = decodeStatus(status);
    var statusAddress = 0x0100 | byte(sp + 1), pclAddress = 0x0100 | byte(sp + 2), pchAddress = 0x0100 | byte(sp + 3);
    return question("rti_restore", level, prompt("Execute RTI from this initialized stack frame.", ["SP=" + h2(sp), h4(statusAddress) + "=" + h2(status), h4(pclAddress) + "=" + h2(pcl), h4(pchAddress) + "=" + h2(pch)], "Pull status, PCL, PCH; RTI does not add one."),
      [byteField("SP", "Final SP", byte(sp + 3)), wordField("PC", "Final PC", pc), flagField("N", "N", decoded.N), flagField("V", "V", decoded.V), flagField("D", "D", decoded.D), flagField("I", "I", decoded.I), flagField("Z", "Z", decoded.Z), flagField("C", "C", decoded.C)],
      "RTI restores latch flags from " + h2(status) + ", reconstructs PC=" + h4(pc) + ", and leaves SP=" + h2(byte(sp + 3)) + ".", [sp, status, pc]);
  };

  GENERATORS.instruction_base_cycles = function (level, r) {
    var pool = OPCODE_ROWS.filter(function (entry) {
      if (entry.mode === "REL" || entry.pagePenalty) return false;
      return level >= 3 || !["BRK", "RTI", "PLP", "IND", "XIND", "INDY"].includes(entry.mnemonic) && !["IND", "XIND", "INDY"].includes(entry.mode);
    });
    var entry = r.choice(pool), form = formatOpcodeForm(entry);
    return question("instruction_base_cycles", level, prompt("Give the documented fixed cycle count.", [form, "opcode " + h2(entry.opcode)], "This opcode form has no dynamic page-cross or branch penalty."),
      [intField("cycles", "Cycles", entry.cycles)], form + " costs " + entry.cycles + " cycles.", [entry.opcode], { opcode: entry.opcode, mode: entry.mode, instructionBytes: sampleInstructionBytes(entry), baseCycles: entry.cycles });
  };

  GENERATORS.indexed_page_penalty = function (level, r) {
    var store = level >= 4 && r.chance(), op = store ? "STA" : r.choice(["LDA", "ADC", "AND", "EOR"]), base = edgeWord(r), index = edgeByte(r);
    if (level >= 3 && r.chance()) base = word((r.int(0, 255) << 8) | r.int(0xE8, 0xFF));
    var address = word(base + index), crossed = pageCrossed(base, address), cycles = store ? 5 : 4 + bit(crossed);
    var opcodeEntry = OPCODE_ROWS.find(function (entry) { return entry.mnemonic === op && entry.mode === "ABSX"; });
    return question("indexed_page_penalty", level, prompt("Compute the indexed address and exact cycles.", ["X=" + h2(index), op + " " + h4(base) + ",X", "opcode " + h2(opcodeEntry.opcode)], store ? "Absolute-indexed stores have fixed timing." : "Eligible indexed reads add one cycle on page crossing."),
      [wordField("address", "Effective address", address), yesNoField("crossed", "Page crossed?", crossed), intField("cycles", "Cycles", cycles)],
      h4(base) + "+" + h2(index) + "=" + h4(address) + ". " + (store ? "STA abs,X is fixed at 5 cycles." : "Read timing is 4" + (crossed ? "+1" : "") + "=" + cycles + "."), [op, base, index], { opcode: opcodeEntry.opcode, mode: opcodeEntry.mode, instructionBytes: [opcodeEntry.opcode, byte(base), byte(base >>> 8)], baseCycles: opcodeEntry.cycles, pagePenalty: opcodeEntry.pagePenalty });
  };

  GENERATORS.snippet_cycle_total = function (level, r) {
    var variant = level === 1 ? 0 : r.int(0, level >= 4 ? 3 : 2), rows, cycles, sequence, detail = "";
    if (variant === 0) { var immediate = edgeByte(r); rows = ["LDA #" + h2(immediate) + "    ; 2", "TAX         ; 2"]; cycles = 4; sequence = "LDA,TAX"; detail = String(immediate); }
    else if (variant === 1) { var x = r.choice([1, 2]); rows = ["X=" + h2(x), "DEX         ; 2", "BNE target  ; " + (x === 1 ? "not taken 2" : "taken 3")]; cycles = x === 1 ? 4 : 5; sequence = x === 1 ? "DEX,BNE-not" : "DEX,BNE-taken"; }
    else if (variant === 2) { rows = ["LDA $20F8,X ; page-cross read 5", "STA $30F8,X ; indexed store 5", "X=$10"]; cycles = 10; sequence = "LDA-cross,STA"; }
    else { rows = ["CLC         ; 2", "LDA #$7F    ; 2", "ADC #$01    ; 2", "BVS target  ; taken same-page 3"]; cycles = 9; sequence = "CLC,LDA,ADC,BVS"; }
    return question("snippet_cycle_total", level, prompt("Follow the shown path and total the cycles.", rows, "All dynamic outcomes needed for timing are supplied."),
      [intField("cycles", "Total cycles", cycles)], "Executed sequence " + sequence + " totals " + cycles + " cycles.", [variant, sequence, detail]);
  };

  GENERATORS.register_trace_snippet = function (level, r) {
    var variant = level === 1 ? 0 : r.int(0, level >= 4 ? 3 : 2), rows, a = 0, x = 0, p = flags(), explanation;
    if (variant === 0) { a = edgeByte(r); var add = edgeByte(r); var result = adcBinary(a, add, 0); rows = ["initial X=$00", "LDA #" + h2(a), "CLC", "ADC #" + h2(add)]; a = result.A; p = flags(result); explanation = "ADC yields A=" + h2(a) + ", N" + p.N + " V" + p.V + " Z" + p.Z + " C" + p.C + "."; }
    else if (variant === 1) { rows = ["initial A=$00 V0 C0", "LDX #$00", "DEX", "INX"]; x = 0; p = flags({ N: 0, Z: 1 }); explanation = "DEX wraps to $FF, then INX wraps to $00 and sets Z."; }
    else if (variant === 2) { var initial = edgeByte(r); rows = ["initial X=$00 V0 C0", "LDA #" + h2(initial), "TAX", "INX", "TXA"]; x = byte(initial + 1); a = x; p = flags(nz(a)); explanation = "A transfers through X, X increments, then returns to A=" + h2(a) + "."; }
    else { rows = ["initial X=$00", "LDA #$7F", "CLC", "ADC #$01", "BVS target"]; a = 0x80; p = flags({ N: 1, V: 1, Z: 0, C: 0 }); explanation = "ADC gives $80 with signed overflow, so BVS is taken."; }
    return question("register_trace_snippet", level, prompt("Execute the register trace.", rows, "All consumed state is initialized."),
      [byteField("A", "Final A", a), byteField("X", "Final X", x), flagField("N", "N", p.N), flagField("V", "V", p.V), flagField("Z", "Z", p.Z), flagField("C", "C", p.C)], explanation, [variant].concat(rows));
  };

  GENERATORS.memory_trace_snippet = function (level, r) {
    var variant = level === 1 ? 0 : r.int(0, 2), rows, address, value, a, x = 0, p = flags(), explanation;
    if (variant === 0) { value = edgeByte(r); address = r.int(0x10, 0xEF); rows = ["initial X=$00", "LDA #" + h2(value), "STA " + h2(address)]; a = value; p = flags(nz(value)); explanation = "LDA loads " + h2(value) + "; STA writes it to " + h4(address) + "."; }
    else if (variant === 1) { address = r.int(0x10, 0xEF); var before = edgeByte(r); value = byte(before + 1); p = flags(nz(value)); a = 0; rows = ["initial A=$00 X=$00", "memory[" + h2(address) + "]=" + h2(before), "INC " + h2(address)]; explanation = "INC wraps " + h2(before) + " to " + h2(value) + " and sets N/Z."; }
    else { x = r.int(1, 5); var source = 0x30 + x, destination = 0x40 + x, sourceValue = edgeByte(r); a = byte(sourceValue ^ 0xFF); address = destination; value = a; p = flags(nz(a)); rows = ["X=" + h2(x) + " memory[" + h2(source) + "]=" + h2(sourceValue), "LDA $30,X", "EOR #$FF", "STA $40,X"]; explanation = "Read " + h2(sourceValue) + " from " + h4(source) + ", invert to " + h2(value) + ", write " + h4(destination) + "."; }
    return question("memory_trace_snippet", level, prompt("Execute the initialized memory trace.", rows, "Report the selected final byte and relevant state."),
      [wordField("address", "Written address", address), byteField("memory", "Final memory byte", value), byteField("A", "Final A", a), byteField("X", "Final X", x), flagField("N", "N", p.N), flagField("Z", "Z", p.Z)], explanation, [variant].concat(rows));
  };

  function generateQuestion(familyId, level, seed, ignoreHistory) {
    var generator = GENERATORS[familyId];
    if (!generator) throw new Error("Unknown family " + familyId);
    var local = new Rng(seed);
    var candidate;
    for (var attempt = 0; attempt < 80; attempt += 1) {
      candidate = generator(level, local);
      validateQuestion(candidate);
      if (ignoreHistory || !recentSignatures.includes(candidate.structuralSignature)) return candidate;
    }
    return candidate;
  }

  function validateQuestion(item) {
    if (!item || item.modelId !== MODEL_ID) throw new Error("Wrong processor model");
    if (!GENERATORS[item.familyId] || !categoryById(item.categoryId)) throw new Error("Unknown question identity");
    if (!LEVELS.includes(item.level) || !item.prompt || !item.prompt.title || !item.fields.length) throw new Error("Incomplete question");
    var ids = new Set();
    item.fields.forEach(function (answerField) {
      if (!answerField.id || ids.has(answerField.id)) throw new Error("Duplicate answer field");
      ids.add(answerField.id);
      if (!Object.prototype.hasOwnProperty.call(item.canonicalAnswer, answerField.id)) throw new Error("Missing canonical answer");
      if (answerField.options && !answerField.options.some(function (option) { return option.value === answerField.answer; })) throw new Error("Choice answer absent");
    });
    if (/undefined|NaN/.test(JSON.stringify(item))) throw new Error("Unresolved generated value");
  }

  function normalizeHex(value, digits) {
    var clean = String(value).trim().toUpperCase().replace(/^\$/, "").replace(/^0X/, "").replace(/_/g, "");
    if (!/^[0-9A-F]+$/.test(clean) || clean.length > digits) return null;
    return "$" + clean.padStart(digits, "0");
  }
  function normalizeField(answerField, value) {
    if (answerField.kind === "byte") return normalizeHex(value, 2);
    if (answerField.kind === "word") return normalizeHex(value, 4);
    if (answerField.kind === "integer") {
      var clean = String(value).trim();
      return /^[+-]?\d+$/.test(clean) ? String(Number(clean)) : null;
    }
    if (answerField.kind === "choice") return String(value).trim();
    return String(value).trim().replace(/\s+/g, " ").toUpperCase();
  }
  function checkQuestion(answers, item) {
    var parts = {}, correct = true;
    item.fields.forEach(function (answerField) {
      var actual = normalizeField(answerField, answers[answerField.id] || "");
      var expected = normalizeField(answerField, answerField.answer);
      var fieldCorrect = actual !== null && actual === expected;
      parts[answerField.id] = { correct: fieldCorrect, actual: actual, expected: expected, label: answerField.label };
      correct = correct && fieldCorrect;
    });
    return { correct: correct, parts: parts, expectedText: item.fields.map(function (answerField) {
      var option = answerField.options && answerField.options.find(function (candidate) { return candidate.value === answerField.answer; });
      return answerField.label + "=" + (option ? option.label : answerField.answer);
    }).join(", ") };
  }

  function defaultStat() { return { attempts: 0, correct: 0, totalMs: 0, streak: 0, recent: [], mastery: 0 }; }
  function defaultProgress() {
    var enabled = {};
    CATEGORIES.forEach(function (category) { enabled[category.id] = true; });
    return { version: 1, view: "practice", settings: { adaptive: true, enabled: enabled }, manual: { familyId: FAMILIES[0].id, level: 1 }, stats: {} };
  }
  function mergeProgress(stored) {
    var base = defaultProgress();
    if (!stored || typeof stored !== "object") return base;
    if (["practice", "matrix", "stats", "settings", "learn"].includes(stored.view)) base.view = stored.view;
    if (stored.settings) {
      base.settings.adaptive = stored.settings.adaptive !== false;
      CATEGORIES.forEach(function (category) { if (stored.settings.enabled && stored.settings.enabled[category.id] === false) base.settings.enabled[category.id] = false; });
    }
    if (stored.manual && FAMILIES.some(function (familyItem) { return familyItem.id === stored.manual.familyId; })) {
      base.manual.familyId = stored.manual.familyId;
      base.manual.level = Math.max(1, Math.min(5, Number(stored.manual.level) || 1));
    }
    if (stored.stats && typeof stored.stats === "object") {
      Object.keys(stored.stats).forEach(function (key) {
        var value = stored.stats[key];
        if (!value || typeof value !== "object") return;
        base.stats[key] = {
          attempts: Math.max(0, Number(value.attempts) || 0), correct: Math.max(0, Number(value.correct) || 0),
          totalMs: Math.max(0, Number(value.totalMs) || 0), streak: Math.max(0, Number(value.streak) || 0),
          recent: Array.isArray(value.recent) ? value.recent.slice(-10).map(Boolean) : [], mastery: Math.max(0, Math.min(100, Number(value.mastery) || 0))
        };
      });
    }
    return base;
  }
  function loadProgress() { try { return mergeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch (error) { return defaultProgress(); } }
  function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  function statKey(familyId, level) { return familyId + ":" + level; }
  function getStat(familyId, level) { var key = statKey(familyId, level); if (!progress.stats[key]) progress.stats[key] = defaultStat(); return progress.stats[key]; }
  function recentAccuracy(stat) { return stat.recent.length ? stat.recent.filter(Boolean).length / stat.recent.length : 0; }
  function updateMastery(stat) { var evidence = Math.min(1, stat.attempts / 5); stat.mastery = Math.round(100 * evidence * (stat.recent.length ? recentAccuracy(stat) : stat.correct / Math.max(1, stat.attempts))); }
  function timeText(ms) { return PracticeLabUI.formatSeconds(ms); }

  function enabledCells() {
    var cells = [];
    FAMILIES.forEach(function (familyItem) {
      if (!progress.settings.enabled[familyItem.categoryId]) return;
      var levels = PracticeLabUI.unlockedLevels(LEVELS, function (level) { return getStat(familyItem.id, level); });
      var level = levels[levels.length - 1];
      cells.push({ family: familyItem, level: level, stat: getStat(familyItem.id, level) });
    });
    return cells;
  }
  function chooseAdaptiveCell() {
    var cells = enabledCells();
    if (!cells.length) { progress.settings.enabled[CATEGORIES[0].id] = true; cells = enabledCells(); }
    var untried = cells.filter(function (cell) { return cell.stat.attempts === 0; });
    if (untried.length) return rng.choice(untried.slice(0, 20));
    return cells.slice().sort(function (a, b) {
      var aScore = a.stat.mastery + Math.min(20, a.stat.attempts), bScore = b.stat.mastery + Math.min(20, b.stat.attempts);
      return aScore - bScore;
    })[rng.int(0, Math.min(7, cells.length - 1))];
  }

  function startQuestion() {
    if (isPaused) resumePractice();
    var selection = progress.settings.adaptive ? chooseAdaptiveCell() : { family: familyById(progress.manual.familyId), level: progress.manual.level };
    currentQuestion = generateQuestion(selection.family.id, selection.level, rng.next(), false);
    recentSignatures.push(currentQuestion.structuralSignature);
    recentSignatures = recentSignatures.slice(-30);
    currentStartedAt = Date.now(); pausedMs = 0; pauseStartedAt = 0; submitted = false;
    renderQuestion(); renderPracticeControls(); renderCurrentMetrics();
  }
  function elapsedMs() { return Math.max(0, Date.now() - currentStartedAt - pausedMs - (isPaused && pauseStartedAt ? Date.now() - pauseStartedAt : 0)); }

  function renderPrompt(promptData) {
    var container = document.getElementById("questionPrompt");
    container.replaceChildren();
    var title = document.createElement("div"); title.textContent = promptData.title; container.appendChild(title);
    promptData.rows.forEach(function (row) { var line = document.createElement("div"); line.className = "prompt-row"; line.textContent = row; container.appendChild(line); });
    if (promptData.note) { var note = document.createElement("div"); note.className = "prompt-note"; note.textContent = promptData.note; container.appendChild(note); }
  }

  function answerTextInputs() { return Array.from(document.querySelectorAll("#answerControls input[data-answer-field]")); }
  function setActiveInput(input, focusOnDesktop) {
    activeAnswerInput = input || null;
    answerTextInputs().forEach(function (candidate) { candidate.classList.toggle("active-keypad-target", candidate === activeAnswerInput); });
    updateKeypadState();
    if (focusOnDesktop && activeAnswerInput && (!window.matchMedia || window.matchMedia("(pointer: fine)").matches)) activeAnswerInput.focus();
  }
  function selectNextInput() {
    var inputs = answerTextInputs().filter(function (input) { return !input.disabled; });
    if (inputs.length < 2) return;
    var index = inputs.indexOf(activeAnswerInput);
    setActiveInput(inputs[(index + 1 + inputs.length) % inputs.length], true);
  }

  function renderAnswerControls() {
    var container = document.getElementById("answerControls"); container.replaceChildren(); activeAnswerInput = null;
    currentQuestion.fields.forEach(function (answerField) {
      var wrapper = document.createElement("div"); wrapper.className = "answer-control";
      var label = document.createElement("label"); label.textContent = answerField.label; label.htmlFor = "answer-" + answerField.id; wrapper.appendChild(label);
      if (answerField.options) {
        var select = document.createElement("select"); select.id = "answer-" + answerField.id; select.dataset.answerField = answerField.id;
        var placeholder = document.createElement("option"); placeholder.value = ""; placeholder.textContent = t("practice.choose", "Choose…"); select.appendChild(placeholder);
        answerField.options.forEach(function (option) { var element = document.createElement("option"); element.value = option.value; element.textContent = option.label; select.appendChild(element); });
        wrapper.appendChild(select);
      } else {
        var input = document.createElement("input"); input.id = "answer-" + answerField.id; input.dataset.answerField = answerField.id; input.dataset.inputKind = answerField.kind;
        input.type = "text"; input.autocomplete = "off"; input.spellcheck = false; input.inputMode = answerField.kind === "integer" ? "numeric" : "text";
        input.addEventListener("focus", function () { setActiveInput(input, false); }); wrapper.appendChild(input); if (!activeAnswerInput) activeAnswerInput = input;
      }
      container.appendChild(wrapper);
    });
    setActiveInput(activeAnswerInput, false);
  }

  var KEYPAD_DATA_IDS = ["hexD", "hexE", "hexF", "dollar", "hexA", "hexB", "hexC", "plus", "digit7", "digit8", "digit9", "minus", "digit4", "digit5", "digit6", "hexPrefix", "digit1", "digit2", "digit3", "digit0"];
  function allowedKeypadIds(kind) {
    var digits = ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9"];
    if (kind === "integer") return digits.concat(["plus", "minus"]);
    if (kind === "byte" || kind === "word") return digits.concat(["hexA", "hexB", "hexC", "hexD", "hexE", "hexF", "dollar", "hexPrefix"]);
    return [];
  }
  function updateKeypadState() {
    if (!keypadButtons) return;
    var editable = Boolean(activeAnswerInput && !activeAnswerInput.disabled && !isPaused && !submitted), allowed = editable ? allowedKeypadIds(activeAnswerInput.dataset.inputKind) : [];
    KEYPAD_DATA_IDS.forEach(function (id) { var button = keypadButtons.get(id); if (button) button.disabled = !allowed.includes(id); });
    ["delete", "clear"].forEach(function (id) { keypadButtons.get(id).disabled = !editable; });
    keypadButtons.get("nextField").disabled = !editable || answerTextInputs().length < 2;
    keypadButtons.get("submit").disabled = isPaused;
  }

  function renderQuestion() {
    var fam = familyById(currentQuestion.familyId);
    document.getElementById("questionCategory").textContent = categoryById(fam.categoryId).title;
    document.getElementById("questionFamily").textContent = fam.title;
    document.getElementById("questionLevel").textContent = t("practice.level", "Level") + " " + currentQuestion.level;
    renderPrompt(currentQuestion.prompt); renderAnswerControls();
    document.getElementById("feedback").className = "feedback hidden";
    document.getElementById("submitBtn").disabled = false;
    document.getElementById("submitBtn").innerHTML = t("practice.check", "Check") + " <span class=\"key-symbol\">↵</span>";
    document.getElementById("nextBtn").classList.add("hidden"); document.getElementById("skipBtn").classList.remove("hidden");
    keypadButtons.get("submit").textContent = t("practice.check", "Check"); renderPauseState();
    window.setTimeout(function () { if (activeAnswerInput && (!window.matchMedia || window.matchMedia("(pointer: fine)").matches)) activeAnswerInput.focus(); }, 0);
  }

  function collectAnswers() { var answers = {}; document.querySelectorAll("[data-answer-field]").forEach(function (control) { answers[control.dataset.answerField] = control.value; }); return answers; }
  function submitAnswer(event) {
    event.preventDefault(); if (!currentQuestion || isPaused) return; if (submitted) { startQuestion(); return; }
    var result = checkQuestion(collectAnswers(), currentQuestion), duration = elapsedMs(), stat = getStat(currentQuestion.familyId, currentQuestion.level);
    stat.attempts += 1; stat.correct += result.correct ? 1 : 0; stat.totalMs += duration; stat.streak = result.correct ? stat.streak + 1 : 0; stat.recent = stat.recent.concat([result.correct]).slice(-10); updateMastery(stat); saveProgress();
    submitted = true; document.querySelectorAll("[data-answer-field]").forEach(function (control) { control.disabled = true; }); updateKeypadState();
    document.getElementById("submitBtn").innerHTML = t("practice.next", "Next") + " <span class=\"key-symbol\">↵</span>";
    document.getElementById("nextBtn").classList.remove("hidden"); document.getElementById("skipBtn").classList.add("hidden"); keypadButtons.get("submit").textContent = t("practice.next", "Next");
    var feedback = document.getElementById("feedback"); feedback.className = "feedback " + (result.correct ? "correct" : "incorrect"); feedback.replaceChildren();
    var strong = document.createElement("strong"); strong.textContent = result.correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite"); feedback.appendChild(strong);
    if (!result.correct) { var expected = document.createElement("div"); expected.className = "expected-code"; expected.textContent = t("messages.expected", "Expected") + ": " + result.expectedText; feedback.appendChild(expected); }
    var detail = document.createElement("div"); detail.className = "feedback-detail"; detail.textContent = currentQuestion.explanation + " " + t("messages.time", "Time") + ": " + timeText(duration) + "."; feedback.appendChild(detail);
    renderCurrentMetrics(); renderSummary();
  }

  function pausePractice() { if (isPaused || submitted) return; isPaused = true; pauseStartedAt = Date.now(); renderPauseState(); }
  function resumePractice() { if (!isPaused) return; pausedMs += Date.now() - pauseStartedAt; pauseStartedAt = 0; isPaused = false; renderPauseState(); }
  function renderPauseState() { document.querySelector(".practice-main").classList.toggle("paused", isPaused); document.getElementById("pauseBtn").disabled = isPaused || submitted; updateKeypadState(); }

  function aggregate() {
    var total = { attempts: 0, correct: 0, totalMs: 0, masteryTotal: 0, practiced: 0 };
    Object.keys(progress.stats).forEach(function (key) { var stat = progress.stats[key]; total.attempts += stat.attempts; total.correct += stat.correct; total.totalMs += stat.totalMs; if (stat.attempts) { total.masteryTotal += stat.mastery; total.practiced += 1; } });
    return total;
  }
  function renderSummary() {
    var total = aggregate();
    document.getElementById("summaryMastery").textContent = (total.practiced ? Math.round(total.masteryTotal / total.practiced) : 0) + "%";
    document.getElementById("summaryAccuracy").textContent = (total.attempts ? Math.round(100 * total.correct / total.attempts) : 0) + "%";
    document.getElementById("summaryAttempts").textContent = total.attempts;
  }
  function renderCurrentMetrics() {
    if (!currentQuestion) return;
    var stat = getStat(currentQuestion.familyId, currentQuestion.level);
    document.getElementById("questionMastery").textContent = stat.mastery + "% " + t("practice.masterySuffix", "mastery");
    document.getElementById("metricMastery").textContent = stat.mastery + "%";
    document.getElementById("metricAccuracy").textContent = (stat.attempts ? Math.round(100 * stat.correct / stat.attempts) : 0) + "%";
    document.getElementById("metricStreak").textContent = stat.streak;
    document.getElementById("metricAvgTime").textContent = stat.attempts ? timeText(stat.totalMs / stat.attempts) : "0s";
  }
  function renderPracticeControls() {
    var fam = currentQuestion ? familyById(currentQuestion.familyId) : familyById(progress.manual.familyId);
    selectorController.render({ familyId: fam.id, level: currentQuestion ? currentQuestion.level : progress.manual.level });
    document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active", progress.settings.adaptive);
    document.getElementById("manualModeBtn").classList.toggle("secondary-active", !progress.settings.adaptive);
  }
  function setManualSelection(familyId, level) {
    progress.manual.familyId = familyById(familyId).id; progress.manual.level = Math.max(1, Math.min(5, Number(level) || 1)); progress.settings.adaptive = false; saveProgress(); startQuestion();
  }

  function renderMatrix() {
    var container = document.getElementById("matrix"); container.replaceChildren();
    var table = document.createElement("table"), head = document.createElement("thead"), headRow = document.createElement("tr");
    [t("practice.family", "Family")].concat(LEVELS.map(function (level) { return "L" + level; })).forEach(function (label) { var th = document.createElement("th"); th.textContent = label; headRow.appendChild(th); });
    head.appendChild(headRow); table.appendChild(head); var body = document.createElement("tbody");
    CATEGORIES.forEach(function (category) {
      var categoryRow = document.createElement("tr"), categoryCell = document.createElement("th"); categoryCell.colSpan = 6; categoryCell.textContent = category.title; categoryRow.appendChild(categoryCell); body.appendChild(categoryRow);
      FAMILIES.filter(function (fam) { return fam.categoryId === category.id; }).forEach(function (fam) {
        var row = document.createElement("tr"), name = document.createElement("td"); name.textContent = fam.title; row.appendChild(name);
        LEVELS.forEach(function (level) { var stat = getStat(fam.id, level), cell = document.createElement("td"), button = document.createElement("button"); button.type = "button"; button.className = "level-button " + (stat.mastery >= 80 ? "ready" : stat.attempts ? "weak" : ""); button.dataset.familyId = fam.id; button.dataset.level = level; button.innerHTML = "L" + level + "<br><span>" + stat.mastery + "% · " + stat.attempts + "</span>"; cell.appendChild(button); row.appendChild(cell); });
        body.appendChild(row);
      });
    });
    table.appendChild(body); container.appendChild(table);
  }

  function renderStats() {
    var total = aggregate();
    document.getElementById("statTotalAttempts").textContent = total.attempts; document.getElementById("statTotalCorrect").textContent = total.correct;
    document.getElementById("statTotalTime").textContent = PracticeLabUI.formatMinutes(total.totalMs); document.getElementById("statActiveCells").textContent = total.practiced;
    var cells = Object.keys(progress.stats).map(function (key) { var parts = key.split(":"), fam = FAMILIES.find(function (item) { return item.id === parts[0]; }); return fam ? { family: fam, level: Number(parts[1]), stat: progress.stats[key] } : null; }).filter(function (cell) { return cell && cell.stat.attempts; });
    cells.sort(function (a, b) { return a.stat.mastery - b.stat.mastery; });
    function fill(id, selected) { var container = document.getElementById(id); container.replaceChildren(); if (!selected.length) { var empty = document.createElement("p"); empty.textContent = t("stats.noAttemptsYet", "No attempts yet"); container.appendChild(empty); return; } selected.forEach(function (cell) { var button = document.createElement("button"); button.type = "button"; button.dataset.familyId = cell.family.id; button.dataset.level = cell.level; button.textContent = cell.family.title + " · L" + cell.level + " · " + cell.stat.mastery + "% (" + cell.stat.attempts + " " + t("stats.tries", "tries") + ")"; container.appendChild(button); }); }
    fill("weakList", cells.slice(0, 8)); fill("strongList", cells.slice().reverse().slice(0, 8));
  }

  function renderSettings() {
    var container = document.getElementById("enabledCategories"); container.replaceChildren();
    CATEGORIES.forEach(function (category) { var row = document.createElement("div"); row.className = "check-row"; var label = document.createElement("label"), input = document.createElement("input"), span = document.createElement("span"); input.type = "checkbox"; input.checked = progress.settings.enabled[category.id] !== false; input.dataset.categoryId = category.id; span.textContent = category.title; label.appendChild(input); label.appendChild(span); row.appendChild(label); container.appendChild(row); });
  }

  function renderLearn() {
    var container = document.getElementById("learnGrid"); container.replaceChildren();
    FAMILIES.forEach(function (fam) { var card = document.createElement("article"); card.id = "learn-" + fam.id; card.className = "learn-card" + (learnSpotlightId === fam.id ? " spotlight" : ""); var heading = document.createElement("h3"); heading.textContent = fam.title; var concept = document.createElement("p"); concept.textContent = fam.learn.concept; var rules = document.createElement("p"); rules.textContent = fam.learn.rules; var example = document.createElement("code"); example.textContent = fam.learn.example; card.appendChild(heading); card.appendChild(concept); card.appendChild(rules); card.appendChild(example); container.appendChild(card); });
  }

  function setView(view) {
    progress.view = view; saveProgress();
    document.querySelectorAll(".view").forEach(function (element) { element.classList.toggle("active", element.id === "view-" + view); });
    document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("active", button.dataset.view === view); });
    if (view === "matrix") renderMatrix(); if (view === "stats") renderStats(); if (view === "settings") renderSettings(); if (view === "learn") { renderLearn(); if (learnSpotlightId) { var card = document.getElementById("learn-" + learnSpotlightId); if (card) card.scrollIntoView({ block: "center" }); } }
    if (view === "practice" && !currentQuestion) startQuestion();
  }
  function renderAll() { renderSummary(); renderPracticeControls(); renderMatrix(); renderStats(); renderSettings(); renderLearn(); setView(progress.view); }

  function wireEvents() {
    selectorController = PracticeLabUI.createPracticeSelectors({ categorySelect: document.getElementById("categorySelect"), familySelect: document.getElementById("familySelect"), levelSelect: document.getElementById("levelSelect"), categories: CATEGORIES, families: FAMILIES, levelLabel: function (level) { return t("practice.level", "Level") + " " + level; }, onSelect: function (selection) { setManualSelection(selection.familyId, selection.level); } });
    var editor = PracticeLabUI.createTextEditor(function () { return isPaused ? null : activeAnswerInput; });
    keypadButtons = PracticeLabUI.renderInputGrid(document.getElementById("answerKeypad"), [
      [["D", editor.insert("D"), { id: "hexD" }], ["E", editor.insert("E"), { id: "hexE" }], ["F", editor.insert("F"), { id: "hexF" }], ["$", editor.insert("$"), { id: "dollar", variant: "function" }], [t("practice.delete", "Del"), editor.backspace, { id: "delete", variant: "function" }]],
      [["A", editor.insert("A"), { id: "hexA" }], ["B", editor.insert("B"), { id: "hexB" }], ["C", editor.insert("C"), { id: "hexC" }], ["+", editor.insert("+"), { id: "plus", variant: "function" }], [t("practice.clear", "Clear"), editor.clear, { id: "clear", variant: "function" }]],
      [["7", editor.insert("7"), { id: "digit7" }], ["8", editor.insert("8"), { id: "digit8" }], ["9", editor.insert("9"), { id: "digit9" }], ["-", editor.insert("-"), { id: "minus", variant: "function" }], [t("practice.nextFieldShort", "Field →"), selectNextInput, { id: "nextField", variant: "function", ariaLabel: t("practice.nextField", "Next answer field") }]],
      [["4", editor.insert("4"), { id: "digit4" }], ["5", editor.insert("5"), { id: "digit5" }], ["6", editor.insert("6"), { id: "digit6" }], ["0x", editor.insert("0x"), { id: "hexPrefix", variant: "function" }], ["", function () {}, { disabled: true, ariaLabel: "spacer" }]],
      [["1", editor.insert("1"), { id: "digit1" }], ["2", editor.insert("2"), { id: "digit2" }], ["3", editor.insert("3"), { id: "digit3" }], ["0", editor.insert("0"), { id: "digit0" }], [t("practice.check", "Check"), function () { document.getElementById("answerForm").requestSubmit(); }, { id: "submit", variant: "primary" }]]
    ]);
    document.querySelectorAll("[data-view]").forEach(function (button) { button.addEventListener("click", function () { setView(button.dataset.view); }); });
    document.getElementById("adaptiveModeBtn").addEventListener("click", function () { progress.settings.adaptive = true; saveProgress(); startQuestion(); });
    document.getElementById("manualModeBtn").addEventListener("click", function () { progress.settings.adaptive = false; saveProgress(); startQuestion(); });
    document.getElementById("pauseBtn").addEventListener("click", pausePractice); document.getElementById("resumeBtn").addEventListener("click", resumePractice);
    document.getElementById("learnCurrentBtn").addEventListener("click", function () { if (!currentQuestion) return; learnSpotlightId = currentQuestion.familyId; setView("learn"); });
    document.getElementById("answerForm").addEventListener("submit", submitAnswer); document.getElementById("nextBtn").addEventListener("click", startQuestion); document.getElementById("skipBtn").addEventListener("click", startQuestion);
    document.getElementById("matrix").addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManualSelection(button.dataset.familyId, button.dataset.level); } });
    ["weakList", "strongList"].forEach(function (id) { document.getElementById(id).addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManualSelection(button.dataset.familyId, button.dataset.level); } }); });
    document.getElementById("enabledCategories").addEventListener("change", function (event) { if (event.target.dataset.categoryId) { progress.settings.enabled[event.target.dataset.categoryId] = event.target.checked; saveProgress(); } });
    document.getElementById("exportBtn").addEventListener("click", function () { document.getElementById("dataBox").value = JSON.stringify(progress, null, 2); });
    document.getElementById("copyBtn").addEventListener("click", function () { var box = document.getElementById("dataBox"); if (!box.value) box.value = JSON.stringify(progress, null, 2); PracticeLabUI.copyText(box.value); });
    document.getElementById("importBtn").addEventListener("click", function () { try { progress = mergeProgress(JSON.parse(document.getElementById("dataBox").value)); saveProgress(); currentQuestion = null; renderAll(); } catch (error) { document.getElementById("dataBox").value = t("messages.invalidJson", "Invalid JSON") + ": " + error.message; } });
    document.getElementById("resetBtn").addEventListener("click", function () { if (window.confirm(t("messages.resetConfirm", "Reset all local progress?"))) { progress = defaultProgress(); saveProgress(); currentQuestion = null; renderAll(); } });
    document.addEventListener("keydown", function (event) { if (event.key === "Enter" && submitted && progress.view === "practice") { event.preventDefault(); startQuestion(); } });
  }

  function runSelfTests() {
    var failures = [];
    function assert(name, condition) { if (!condition) failures.push(name); }
    assert("29 families", FAMILIES.length === 29); assert("29 generators", Object.keys(GENERATORS).length === 29);
    if (TEXT.localeCode === "sv") {
      assert("Swedish category coverage", CATEGORIES.every(function (category) { return TEXT.categories && TEXT.categories[category.id]; }));
      assert("Swedish family coverage", FAMILIES.every(function (fam) { return TEXT.families && TEXT.families[fam.id]; }));
    }
    assert("151 documented opcode forms", OPCODE_ROWS.length === 151);
    assert("unique documented opcode bytes", new Set(OPCODE_ROWS.map(function (entry) { return entry.opcode; })).size === 151);
    assert("opcode metadata complete", OPCODE_ROWS.every(function (entry) { return MODE_INFO[entry.mode] && entry.bytes === MODE_INFO[entry.mode][1] && entry.cycles >= 2 && entry.cycles <= 7; }));
    assert("NMOS opcode landmarks", OPCODE_ROWS.some(function (entry) { return entry.opcode === 0x6C && entry.mnemonic === "JMP" && entry.mode === "IND" && entry.cycles === 5; }) && OPCODE_ROWS.some(function (entry) { return entry.opcode === 0xF9 && entry.mnemonic === "SBC" && entry.mode === "ABSY" && entry.pagePenalty; }));
    for (var latch = 0; latch < 64; latch += 1) {
      var p = flags({ N: bit(latch & 32), V: bit(latch & 16), D: bit(latch & 8), I: bit(latch & 4), Z: bit(latch & 2), C: bit(latch & 1) });
      [0, 1].forEach(function (b) { var encoded = statusByte(p, b), decoded = decodeStatus(encoded); assert("status bit5 " + latch + b, (encoded & 0x20) !== 0); assert("status B " + latch + b, decoded.B === b); assert("status latches " + latch + b, decoded.N === p.N && decoded.V === p.V && decoded.D === p.D && decoded.I === p.I && decoded.Z === p.Z && decoded.C === p.C); });
    }
    for (var a = 0; a < 256; a += 1) for (var m = 0; m < 256; m += 1) for (var c = 0; c < 2; c += 1) {
      var add = adcBinary(a, m, c), sum = a + m + c; assert("ADC result " + a + ":" + m + ":" + c, add.A === byte(sum) && add.C === bit(sum > 255));
      var sub = sbcBinary(a, m, c), difference = a - m - (1 - c); assert("SBC result " + a + ":" + m + ":" + c, sub.A === byte(difference) && sub.C === bit(difference >= 0));
    }
    for (var tensA = 0; tensA < 10; tensA += 1) for (var onesA = 0; onesA < 10; onesA += 1) for (var tensM = 0; tensM < 10; tensM += 1) for (var onesM = 0; onesM < 10; onesM += 1) for (var carry = 0; carry < 2; carry += 1) {
      var bcdA = (tensA << 4) | onesA, bcdM = (tensM << 4) | onesM, decimalA = tensA * 10 + onesA, decimalM = tensM * 10 + onesM;
      var decimalAdd = adcDecimalNmos(bcdA, bcdM, carry), exactAdd = decimalA + decimalM + carry, expectedAdd = exactAdd % 100;
      assert("BCD ADC " + bcdA + ":" + bcdM + ":" + carry, decimalAdd.A === (((Math.floor(expectedAdd / 10)) << 4) | (expectedAdd % 10)) && decimalAdd.C === bit(exactAdd >= 100));
      var decimalSub = sbcDecimalNmos(bcdA, bcdM, carry), exactSub = decimalA - decimalM - (1 - carry), wrappedSub = ((exactSub % 100) + 100) % 100;
      assert("BCD SBC " + bcdA + ":" + bcdM + ":" + carry, decimalSub.A === (((Math.floor(wrappedSub / 10)) << 4) | (wrappedSub % 10)) && decimalSub.C === bit(exactSub >= 0));
    }
    for (var shiftValue = 0; shiftValue < 256; shiftValue += 1) for (var carryIn = 0; carryIn < 2; carryIn += 1) {
      assert("ROL/ROR carry " + shiftValue + carryIn, shiftResult("ROL", shiftValue, carryIn).C === bit(shiftValue & 0x80) && shiftResult("ROR", shiftValue, carryIn).C === bit(shiftValue & 1));
    }
    [0, 1, 0x7F, 0x80, 0xFE, 0xFF].forEach(function (offset) { [0, 1, 0x00FE, 0x00FF, 0xFFFE, 0xFFFF].forEach(function (pc) { var info = branchInfo(pc, offset, true); assert("branch target " + pc + ":" + offset, info.target === word(pc + 2 + signed8(offset))); }); });
    var englishLeakPattern = /\b(?:the|this|which|what|execute|compute|report|stored|result|final|cycles|taken|memory|writes?|reads?|gives|sets|preserves|pointer|branch|target|page|instruction|unsigned|signed|less|greater|equal|after|before|with|without|from|then|only|all|does|has|have|means|outgoing|leaves|none|layout|output|pulls|latches|placing|changes|uses|occupies|temporary|exact|continue|saved|reconstructs|loads|wraps|invert)\b/i;
    FAMILIES.forEach(function (fam, familyIndex) { LEVELS.forEach(function (level) { for (var sample = 0; sample < 80; sample += 1) { try {
      var item = generateQuestion(fam.id, level, (familyIndex + 1) * 100000 + level * 1000 + sample, true);
      assert("canonical " + fam.id + ":" + level + ":" + sample, checkQuestion(item.canonicalAnswer, item).correct);
      if (TEXT.localeCode === "sv") {
        var localizedText = [item.prompt.title].concat(item.prompt.rows, [item.prompt.note, item.explanation], item.fields.map(function (answerField) { return answerField.label; }), item.fields.reduce(function (labels, answerField) { return labels.concat((answerField.options || []).map(function (option) { return option.label; })); }, [])).join(" ");
        assert("Swedish generated text " + fam.id + ":" + level + ":" + sample, !englishLeakPattern.test(localizedText));
      }
    } catch (error) { failures.push("generator " + fam.id + ":" + level + ":" + sample + " " + error.message); } } }); });
    if (failures.length) { console.error("6502 self-tests failed", failures.slice(0, 80), "total", failures.length); return { ok: false, failures: failures.slice(0, 100) }; }
    console.info("6502 self-tests passed: 29 families, exhaustive binary ADC/SBC, valid-BCD arithmetic, status images, shifts, branch boundaries, 11,600 generated instances");
    return { ok: true, failures: [] };
  }

  function init() {
    progress = loadProgress(); rng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0); wireEvents(); renderAll();
  }

  window.runSelfTests = runSelfTests;
  window.Assembly6502Practice = { modelId: MODEL_ID, categories: CATEGORIES, families: FAMILIES, generateQuestion: generateQuestion, checkQuestion: checkQuestion, runSelfTests: runSelfTests, oracles: { adcBinary: adcBinary, sbcBinary: sbcBinary, adcDecimalNmos: adcDecimalNmos, sbcDecimalNmos: sbcDecimalNmos, branchInfo: branchInfo } };
  document.addEventListener("DOMContentLoaded", init);
}());
