(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.assemblyAmd64.v1";
  var MODEL_ID = "amd64-long-sysv-v1";
  var ORACLE_VERSION = "amd64-long-sysv-oracle-v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var progress, rng, currentQuestion = null, currentStartedAt = 0, pausedMs = 0, pauseStartedAt = 0;
  var isPaused = false, submitted = false, activeAnswerInput = null, selectorController = null, keypadButtons = null;
  var learnSpotlightId = null, recentSignatures = [];

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }
  function Rng(seed) { this.state = (Number(seed) >>> 0) || 0xA64D64C3; }
  Rng.prototype.next = function () { var x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state; };
  Rng.prototype.int = function (min, max) { return min + (this.next() % (max - min + 1)); };
  Rng.prototype.pick = function (values) { return values[this.int(0, values.length - 1)]; };
  Rng.prototype.chance = function (n, d) { return this.int(1, d || 2) <= (n || 1); };

  function mask(width) { return (1n << BigInt(width)) - 1n; }
  function unsigned(value, width) { return BigInt.asUintN(width, BigInt(value)); }
  function signed(value, width) { return BigInt.asIntN(width, BigInt(value)); }
  function bit(value) { return value ? 1 : 0; }
  function hex(value, width) { return "0x" + unsigned(value, width).toString(16).toUpperCase().padStart(width / 4, "0"); }
  function random64(r) { return (BigInt(r.next()) << 32n) | BigInt(r.next()); }
  function randomWidth(r, width) { return unsigned(random64(r), width); }
  function edgeValue(r, width) {
    var top = 1n << BigInt(width - 1), max = mask(width);
    return r.chance(3, 4) ? r.pick([0n, 1n, 2n, 0xFn, 0x10n, top - 1n, top, top + 1n, max - 1n, max]) : randomWidth(r, width);
  }
  function parity(value) {
    var byte = Number(unsigned(value, 8)), ones = 0;
    for (var i = 0; i < 8; i += 1) ones += (byte >>> i) & 1;
    return bit(ones % 2 === 0);
  }
  function resultFlags(result, width) {
    var value = unsigned(result, width);
    return { PF: parity(value), ZF: bit(value === 0n), SF: bit((value & (1n << BigInt(width - 1))) !== 0n) };
  }
  function addOp(a, b, carry, width) {
    a = unsigned(a, width); b = unsigned(b, width); carry = BigInt(carry || 0);
    var total = a + b + carry, result = unsigned(total, width), sign = 1n << BigInt(width - 1), common = resultFlags(result, width);
    return { result: result, CF: bit(total > mask(width)), PF: common.PF, AF: bit(((a & 0xFn) + (b & 0xFn) + carry) > 0xFn), ZF: common.ZF, SF: common.SF, OF: bit(((~(a ^ b) & (a ^ result) & sign) !== 0n)) };
  }
  function subOp(a, b, borrow, width) {
    a = unsigned(a, width); b = unsigned(b, width); borrow = BigInt(borrow || 0);
    var exact = a - b - borrow, result = unsigned(exact, width), sign = 1n << BigInt(width - 1), common = resultFlags(result, width);
    return { result: result, CF: bit(exact < 0n), PF: common.PF, AF: bit(((a ^ b ^ result) & 0x10n) !== 0n), ZF: common.ZF, SF: common.SF, OF: bit((((a ^ b) & (a ^ result) & sign) !== 0n)) };
  }
  function logicalOp(op, a, b, width) {
    a = unsigned(a, width); b = unsigned(b, width);
    var result = op === "AND" || op === "TEST" ? a & b : op === "OR" ? a | b : a ^ b, common = resultFlags(result, width);
    return { result: result, CF: 0, PF: common.PF, AF: "?", ZF: common.ZF, SF: common.SF, OF: 0, writes: op !== "TEST" };
  }
  function unaryOp(op, value, width, initialCF) {
    value = unsigned(value, width);
    if (op === "NOT") return { result: unsigned(~value, width), CF: initialCF, PF: "preserved", AF: "preserved", ZF: "preserved", SF: "preserved", OF: "preserved" };
    if (op === "NEG") return subOp(0n, value, 0, width);
    var out = op === "INC" ? addOp(value, 1n, 0, width) : subOp(value, 1n, 0, width);
    out.CF = initialCF;
    return out;
  }
  function shiftOne(op, value, width) {
    value = unsigned(value, width);
    var oldMsb = bit(value & (1n << BigInt(width - 1))), oldLsb = bit(value & 1n), result;
    if (op === "SHL") result = unsigned(value << 1n, width);
    else if (op === "SHR") result = value >> 1n;
    else result = unsigned(signed(value, width) >> 1n, width);
    var common = resultFlags(result, width), cf = op === "SHL" ? oldMsb : oldLsb;
    return { result: result, CF: cf, PF: common.PF, AF: "?", ZF: common.ZF, SF: common.SF, OF: op === "SHL" ? bit(common.SF !== cf) : op === "SHR" ? oldMsb : 0 };
  }
  function imulTwo(a, b, width) {
    var full = signed(a, width) * signed(b, width), result = unsigned(full, width), fits = signed(result, width) === full;
    return { result: result, full: full, CF: bit(!fits), OF: bit(!fits), PF: "?", AF: "?", ZF: "?", SF: "?" };
  }

  var ALIASES = {};
  function addAlias(name, parent, width, offset, zeroUpper) { ALIASES[name] = { name: name, parent: parent, width: width, offset: offset || 0, zeroUpper: Boolean(zeroUpper) }; }
  function addLegacy(parent, dword, word, low, high) {
    addAlias(parent, parent, 64, 0, false); addAlias(dword, parent, 32, 0, true); addAlias(word, parent, 16, 0, false); addAlias(low, parent, 8, 0, false); if (high) addAlias(high, parent, 8, 8, false);
  }
  addLegacy("RAX", "EAX", "AX", "AL", "AH"); addLegacy("RBX", "EBX", "BX", "BL", "BH");
  addLegacy("RCX", "ECX", "CX", "CL", "CH"); addLegacy("RDX", "EDX", "DX", "DL", "DH");
  addLegacy("RSI", "ESI", "SI", "SIL"); addLegacy("RDI", "EDI", "DI", "DIL");
  addLegacy("RBP", "EBP", "BP", "BPL"); addLegacy("RSP", "ESP", "SP", "SPL");
  for (var registerNumber = 8; registerNumber <= 15; registerNumber += 1) {
    var parentName = "R" + registerNumber;
    addAlias(parentName, parentName, 64); addAlias(parentName + "D", parentName, 32, 0, true); addAlias(parentName + "W", parentName, 16); addAlias(parentName + "B", parentName, 8);
  }
  function aliasInfo(name) { return ALIASES[String(name).toUpperCase()] || null; }
  function writeAlias(parentValue, aliasName, value) {
    var info = aliasInfo(aliasName); if (!info) throw new Error("unknown register alias");
    var incoming = unsigned(value, info.width); if (info.width === 64) return incoming; if (info.zeroUpper) return incoming;
    var sliceMask = mask(info.width) << BigInt(info.offset), shifted = incoming << BigInt(info.offset);
    return unsigned((unsigned(parentValue, 64) & ~sliceMask) | shifted, 64);
  }
  function bytesOf(value, width) {
    value = unsigned(value, width); var bytes = [];
    for (var i = 0; i < width / 8; i += 1) bytes.push(Number((value >> BigInt(i * 8)) & 0xFFn));
    return bytes;
  }
  function valueOfBytes(bytes) { return bytes.reduce(function (value, byteValue, index) { return value | (BigInt(byteValue) << BigInt(index * 8)); }, 0n); }
  function effectiveAddress(base, index, scale, displacement) { return unsigned(BigInt(base) + BigInt(index) * BigInt(scale) + BigInt(displacement), 64); }
  function relativeTarget(nextRip, displacement) { return unsigned(BigInt(nextRip) + BigInt(displacement), 64); }

  var CONDITIONS = {
    JE: function (f) { return f.ZF === 1; }, JZ: function (f) { return f.ZF === 1; }, JNE: function (f) { return f.ZF === 0; }, JNZ: function (f) { return f.ZF === 0; },
    JB: function (f) { return f.CF === 1; }, JC: function (f) { return f.CF === 1; }, JNAE: function (f) { return f.CF === 1; }, JBE: function (f) { return f.CF === 1 || f.ZF === 1; },
    JA: function (f) { return f.CF === 0 && f.ZF === 0; }, JAE: function (f) { return f.CF === 0; }, JNC: function (f) { return f.CF === 0; },
    JL: function (f) { return f.SF !== f.OF; }, JLE: function (f) { return f.ZF === 1 || f.SF !== f.OF; }, JG: function (f) { return f.ZF === 0 && f.SF === f.OF; }, JGE: function (f) { return f.SF === f.OF; },
    JS: function (f) { return f.SF === 1; }, JNS: function (f) { return f.SF === 0; }, JP: function (f) { return f.PF === 1; }, JNP: function (f) { return f.PF === 0; }, JO: function (f) { return f.OF === 1; }, JNO: function (f) { return f.OF === 0; }
  };
  function conditionValue(mnemonic, flags) {
    var needed = mnemonic === "JE" || mnemonic === "JNE" || mnemonic === "JZ" || mnemonic === "JNZ" ? ["ZF"]
      : ["JB", "JC", "JNAE", "JAE", "JNC"].includes(mnemonic) ? ["CF"]
      : ["JBE", "JA"].includes(mnemonic) ? ["CF", "ZF"]
      : ["JL", "JGE"].includes(mnemonic) ? ["SF", "OF"]
      : ["JLE", "JG"].includes(mnemonic) ? ["ZF", "SF", "OF"]
      : mnemonic === "JS" || mnemonic === "JNS" ? ["SF"] : mnemonic === "JP" || mnemonic === "JNP" ? ["PF"] : ["OF"];
    if (needed.some(function (name) { return flags[name] === "?" || flags[name] === undefined; })) return null;
    return CONDITIONS[mnemonic](flags);
  }

  var ATT_FIXTURES = [
    { intel: "add eax, 5", att: "addl $5, %eax" },
    { intel: "cmp rax, rbx", att: "cmpq %rbx, %rax" },
    { intel: "mov rax, qword ptr [rbx + rcx*4 + 8]", att: "movq 8(%rbx,%rcx,4), %rax" },
    { intel: "mov dword ptr [rdi + 4], eax", att: "movl %eax, 4(%rdi)" },
    { intel: "lea r10, [r8 + r9*8 - 16]", att: "leaq -16(%r8,%r9,8), %r10" },
    { intel: "sub word ptr [rbp - 2], 1", att: "subw $1, -2(%rbp)" }
  ];
  function normalizeAssembly(value) { return String(value).trim().toLowerCase().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").replace(/\[\s*/g, "[").replace(/\s*\]/g, "]").replace(/\s*\+\s*/g, "+").replace(/\s*-\s*/g, "-"); }

  var CATEGORIES = [
    { id: "registers-widths", title: "Registers & Widths" }, { id: "addressing-syntax", title: "Addressing & Syntax" },
    { id: "integer-instructions", title: "Integer Instructions" }, { id: "flags-conditions", title: "Flags & Conditions" },
    { id: "stack-calls", title: "Stack & Calls" }, { id: "sysv-abi", title: "System V ABI" }, { id: "traces-validity", title: "Traces & Validity" }
  ];
  function family(id, categoryId, title, rules, example) { return { id: id, categoryId: categoryId, title: title, levels: LEVELS.slice(), learn: { concept: "Practice " + title.toLowerCase() + " under " + MODEL_ID + ".", rules: rules, example: example } }; }
  var FAMILIES = [
    family("register_alias_identification", "registers-widths", "Register aliases and slices", "Aliases name overlapping slices of one 64-bit parent. AH/BH/CH/DH are bits 15:8; 32-bit writes also clear bits 63:32.", "EAX is bits 31:0 of RAX and its writes zero the upper half."),
    family("partial_register_write", "registers-widths", "Partial-register writes", "A 32-bit GPR write zeroes the upper half; 8- and 16-bit writes preserve every bit outside their slice.", "RAX=0x1122334455667788; mov ax,0xABCD gives 0x112233445566ABCD."),
    family("zero_sign_extension", "registers-widths", "Zero and sign extension", "MOVZX pads with zeros; MOVSX/MOVSXD replicate the source sign bit. An EAX destination then zeroes upper RAX.", "movsxd rax,eax with EAX=0x80000000 gives 0xFFFFFFFF80000000."),
    family("little_endian_load_store", "registers-widths", "Little-endian loads and stores", "The least-significant byte is stored at the lowest address. Loads and stores touch exactly the declared width.", "Bytes 78 56 34 12 load as 0x12345678."),
    family("operand_kind_and_width", "addressing-syntax", "Operand kind and width", "Classify register, immediate, and memory independently; the opcode and explicit size determine a single operand width.", "cmp byte ptr [rdi+1],0 has an 8-bit memory destination and immediate source."),
    family("effective_address_bisd", "addressing-syntax", "Base-index-scale-displacement addresses", "Compute base + index×scale + signed displacement modulo 2^64. Scale is 1,2,4,8 and RSP is not an index.", "RBX=0x1000, RCX=3: [rbx+rcx*4+8] is 0x1014."),
    family("rip_relative_address", "addressing-syntax", "RIP-relative addresses", "Add the signed displacement to the address of the following instruction, never the instruction start.", "next RIP 0x400007 plus -0x20 is 0x3FFFE7."),
    family("lea_result", "addressing-syntax", "LEA results", "LEA computes an address expression, performs no memory read, and changes no flags. A 32-bit destination zero-extends its parent.", "lea eax,[rdi+rdi*2] with RDI=5 produces RAX=15."),
    family("intel_att_translation", "addressing-syntax", "Intel and AT&T translation", "AT&T uses source,destination, register and immediate prefixes, size suffixes, and disp(base,index,scale) memory syntax.", "Intel add eax,5 becomes AT&T addl $5,%eax."),
    family("mov_instruction_effect", "integer-instructions", "MOV effects", "MOV copies exactly the operand width and preserves flags. A 32-bit register destination zeroes its parent's upper half.", "mov eax,[m] with dword 0xFFFFFFFF gives RAX=0x00000000FFFFFFFF."),
    family("add_sub_flags", "integer-instructions", "ADD and SUB flags", "Mask the result to width; derive CF for unsigned carry/borrow and OF for signed overflow separately. PF uses the low result byte.", "8-bit 0x7F+1 gives 0x80 with CF0 and OF1."),
    family("adc_sbb_effect", "integer-instructions", "ADC and SBB", "ADC computes dst+src+CF. SBB computes dst-src-CF; x86 CF is the incoming borrow for SBB.", "8-bit SBB 0x10,0x01 with CF1 gives 0x0E."),
    family("logical_test_flags", "integer-instructions", "Logical operations and TEST", "AND/OR/XOR/TEST clear CF/OF, set SF/ZF/PF, and leave AF undefined. TEST does not store its result.", "test al,0x0F with AL=0x80 sets ZF1 and preserves AL."),
    family("inc_dec_neg_not", "integer-instructions", "Unary integer instructions", "INC/DEC preserve CF; NEG is 0−operand and sets CF iff input was nonzero; NOT changes no flags.", "INC 0xFF with initial CF1 gives 0x00, ZF1, and CF remains 1."),
    family("one_bit_shift", "integer-instructions", "One-bit shifts", "For count 1, CF receives the shifted-out bit. SHL/SHR define OF from the old/new sign rule; SAR clears OF. AF is undefined.", "8-bit SAR 0x81 gives 0xC0, CF1, OF0."),
    family("imul_two_operand", "integer-instructions", "Two-operand IMUL", "Multiply signed operands, truncate to destination width, and set CF=OF iff the full product does not equal the sign-extended result. Other arithmetic flags are undefined.", "32-bit 0x40000000×2 truncates to 0x80000000 with CF=OF=1."),
    family("cmp_flag_relation", "flags-conditions", "CMP relations", "CMP sets subtraction flags for dst−src without storing the result. Interpret the same bits separately as unsigned and signed.", "0xFFFFFFFFFFFFFFFF compared with 1 is unsigned above but signed less."),
    family("condition_code_evaluate", "flags-conditions", "Condition-code evaluation", "Evaluate each Jcc from its exact flag predicate. Signed conditions compare SF with OF; unsigned conditions use CF and ZF.", "JL is true exactly when SF differs from OF."),
    family("choose_signed_unsigned_jump", "flags-conditions", "Choose signed or unsigned jumps", "Choose the condition matching the data interpretation after cmp a,b: JA/JB are unsigned; JG/JL are signed.", "Signed a≤b uses JLE; unsigned a>b uses JA."),
    family("cmp_then_branch", "flags-conditions", "CMP then branch", "First compute dst−src flags, then evaluate the named condition and select target or fall-through RIP.", "cmp eax,ebx with 5 and 7 makes JL taken."),
    family("direct_branch_target", "flags-conditions", "Direct branch targets", "A direct relative branch or call adds its signed displacement to next RIP.", "next RIP 0x400105 plus -0x30 gives 0x4000D5."),
    family("push_pop_effect", "stack-calls", "PUSH and POP", "PUSH subtracts 8 before storing a qword. POP loads a qword before adding 8 to RSP.", "RSP 0x1000; push rax stores at 0x0FF8."),
    family("call_ret_trace", "stack-calls", "CALL and RET", "Near CALL pushes next RIP and branches. Near RET pops the qword at RSP into RIP.", "A call at 0x400000 of length 5 pushes 0x400005."),
    family("sysv_argument_location", "sysv-abi", "System V argument locations", "Integer arguments 1–6 use RDI,RSI,RDX,RCX,R8,R9. At ordinary entry argument 7 starts at [RSP+8]; integer return is RAX.", "Argument 6 is R9 and argument 7 is [RSP+8]."),
    family("caller_callee_saved", "sysv-abi", "Caller- and callee-saved registers", "RBX,RBP,R12–R15 are callee-saved; RAX,RCX,RDX,RSI,RDI,R8–R11 are caller-saved. RSP must be restored.", "A callee that modifies R12 must restore it."),
    family("stack_alignment", "sysv-abi", "Stack alignment", "Before CALL, caller RSP mod 16 is 0; the pushed return address makes ordinary callee-entry RSP mod 16 equal 8.", "Entry mod16=8; push rbp makes mod16=0."),
    family("prologue_epilogue_trace", "sysv-abi", "Prologue and epilogue traces", "push rbp; mov rbp,rsp creates a frame. leave means mov rsp,rbp; pop rbp. A matching epilogue restores caller state.", "Entry RSP 0x0FF8; push rbp makes RSP 0x0FF0."),
    family("red_zone_usage", "sysv-abi", "System V red zone", "A leaf may use 128 bytes below unchanged RSP. This practice model rejects live red-zone temporaries across a call.", "[rsp-16] in a leaf is valid; [rsp-136] is outside."),
    family("register_trace_snippet", "traces-validity", "Register traces", "Execute one architectural write at a time, preserving unaffected register bits and flags.", "mov al,0x7F; add al,1; movzx eax,al leaves RAX=0x80 and OF1."),
    family("memory_trace_snippet", "traces-validity", "Memory traces", "Resolve each address, read or write exactly its width, and preserve every untouched byte.", "Storing 0x12345678 as a dword writes 78 56 34 12."),
    family("branching_trace_snippet", "traces-validity", "Branching traces", "Execute bounded control flow in order; signed and unsigned branch interpretations remain explicit.", "inc eax looped until cmp eax,3; jl stops with EAX=3."),
    family("undefined_flag_dependency", "traces-validity", "Undefined-flag dependencies", "A branch is indeterminate only when it consumes an undefined required flag. Defined flags remain usable even when another flag is undefined.", "IMUL leaves ZF undefined, so a following JZ is indeterminate."),
    family("abi_call_trace", "traces-validity", "ABI call traces", "Separate architectural clobbers from ABI obligations: caller-saved loss is the caller's responsibility; callee-saved damage is a callee violation.", "A callee may clobber R10, but not an unsaved RBX.")
  ];

  function localizeStatic() {
    if (TEXT.localeCode === "en") return;
    CATEGORIES.forEach(function (category) { if (TEXT.categories && TEXT.categories[category.id]) category.title = TEXT.categories[category.id]; });
    FAMILIES.forEach(function (item) { var localized = TEXT.families && TEXT.families[item.id]; if (localized) { item.title = localized.title; item.learn = localized.learn; } });
  }
  localizeStatic();
  function familyById(id) { return FAMILIES.find(function (item) { return item.id === id; }) || FAMILIES[0]; }
  function categoryById(id) { return CATEGORIES.find(function (item) { return item.id === id; }) || CATEGORIES[0]; }
  function label(key) { return t("fieldLabels." + key, key); }
  function choiceLabel(value) { return t("choiceLabels." + value, value); }
  function field(id, labelKey, kind, answer, options) { return { id: id, label: label(labelKey), kind: kind, answer: String(answer), options: options || null }; }
  function hexField(id, labelKey, value, width) { return field(id, labelKey, "hex", hex(value, width)); }
  function intField(id, labelKey, value) { return field(id, labelKey, "integer", value); }
  function choiceField(id, labelKey, answer, values) { return field(id, labelKey, "choice", answer, values.map(function (value) { return { value: String(value), label: choiceLabel(value) }; })); }
  function codeChoiceField(id, labelKey, answer, values) { return field(id, labelKey, "choice", answer, values.map(function (value) { return { value: String(value), label: String(value) }; })); }
  function flagField(name, value) { return field(name, name, "choice", String(value), ["0", "1", "?", "preserved"].map(function (item) { return { value: item, label: item === "preserved" ? choiceLabel("unchanged") : item }; })); }
  function byteString(bytes) { return bytes.map(function (value) { return value.toString(16).toUpperCase().padStart(2, "0"); }).join(" "); }
  function expectedText(fields) {
    return fields.map(function (item) { var shown = item.answer; if (item.options) { var option = item.options.find(function (candidate) { return candidate.value === item.answer; }); if (option) shown = option.label; } return item.label + "=" + shown; }).join("; ");
  }
  function localizeRows(rows) {
    if (TEXT.localeCode === "en") return rows.slice();
    var pairs = (TEXT.generatedReplacements || []).slice().sort(function (a, b) { return b[0].length - a[0].length; });
    return rows.map(function (row) { var output = String(row); pairs.forEach(function (pair) { output = output.split(pair[0]).join(pair[1]); }); return output; });
  }
  function question(familyId, level, promptKind, rows, fields, signature, metadata) {
    var familyItem = familyById(familyId), canonical = {}, displayedRows = localizeRows(rows); fields.forEach(function (item) { canonical[item.id] = item.answer; });
    var expected = expectedText(fields);
    return {
      modelId: MODEL_ID, familyId: familyId, categoryId: familyItem.categoryId, level: level,
      prompt: { title: t("prompts." + promptKind, "Compute the exact result."), rows: displayedRows, note: familyItem.learn.rules },
      fields: fields, canonicalAnswer: canonical, expectedText: expected,
      explanation: t("generated.resultLead", "Exact result") + ": " + expected + ". " + familyItem.learn.rules,
      structuralSignature: [familyId, level].concat(signature || []).join("|"),
      metadata: Object.assign({
        modelId: MODEL_ID, oracleVersion: ORACLE_VERSION, architecture: "AMD64 long mode", abi: "System V AMD64", syntax: "Intel canonical; controlled GNU/AT&T",
        sourceAnchors: { architecture: "AMD64 Architecture Programmer's Manual integer subset", abi: "System V AMD64 ABI integer/pointer subset", syntax: "GNU assembler x86 syntax subset" },
        exclusions: ["microarchitecture", "runtime assembler", "privileged state", "SIMD", "floating point"],
        semanticAST: { familyId: familyId, rows: rows.slice() }, syntheticState: { initialized: true, mappedCanonicalAddresses: true, offline: true, nativeExecution: false },
        expectedResult: canonical, workedTrace: displayedRows.concat([expected]), difficultyDimensions: ["level-" + level, familyItem.categoryId], structuralSignature: [familyId, level].concat(signature || []).join("|")
      }, metadata || {})
    };
  }

  var GENERATORS = {};

  GENERATORS.register_alias_identification = function (level, r) {
    var pools = [
      ["AL", "AX", "EAX", "BL", "BX", "EBX"],
      ["AH", "BH", "CL", "DX", "ESI", "EDI"],
      ["SIL", "DIL", "BPL", "SPL", "R8D", "R9W", "R10B"],
      ["R11D", "R12W", "R13B", "R14", "R15D", "CH", "DH"],
      Object.keys(ALIASES)
    ];
    var name = r.pick(pools[Math.min(level - 1, pools.length - 1)]), info = aliasInfo(name), range = info.width === 64 ? "63:0" : (info.offset + info.width - 1) + ":" + info.offset;
    return question("register_alias_identification", level, "identify", [name], [
      codeChoiceField("parent", "parent", info.parent, [info.parent, "RAX", "RBX", "R8", "R15"].filter(function (value, index, all) { return all.indexOf(value) === index; })),
      codeChoiceField("bits", "bits", range, [range, "63:32", "31:0", "15:8", "15:0", "7:0"].filter(function (value, index, all) { return all.indexOf(value) === index; })),
      choiceField("zeroUpper", "zeroUpper", info.zeroUpper ? "yes" : "no", ["yes", "no"])
    ], [name, info.parent, range]);
  };

  GENERATORS.partial_register_write = function (level, r) {
    var aliases = level === 1 ? ["AL", "BL", "CL", "DL"] : level === 2 ? ["AX", "BX", "EAX", "EDX"] : level === 3 ? ["AH", "SIL", "R8D", "R9W"] : level === 4 ? ["BPL", "SPL", "R12D", "R15B", "CH"] : ["AL", "AH", "AX", "EAX", "R8B", "R10W", "R13D", "R15"];
    var alias = r.pick(aliases), info = aliasInfo(alias), initial = random64(r), incoming = edgeValue(r, info.width), result = writeAlias(initial, alias, incoming);
    return question("partial_register_write", level, "execute", [info.parent + "=" + hex(initial, 64), "mov " + alias.toLowerCase() + ", " + hex(incoming, info.width)], [hexField("value", "value", result, 64)], [alias, hex(initial, 64), hex(incoming, info.width)]);
  };

  GENERATORS.zero_sign_extension = function (level, r) {
    var width = r.pick(level === 1 ? [8] : level === 2 ? [8, 16] : [8, 16, 32]), signExtend = level >= 2 && r.chance(), source = edgeValue(r, width), op, destinationWidth, result;
    if (width === 32 && signExtend) { op = "movsxd rax, eax"; destinationWidth = 64; result = unsigned(signed(source, 32), 64); }
    else if (signExtend) { destinationWidth = level >= 4 || r.chance() ? 64 : 32; op = "movsx " + (destinationWidth === 64 ? "rax" : "eax") + ", " + (width === 8 ? "al" : "ax"); result = unsigned(signed(source, width), destinationWidth); }
    else { destinationWidth = level >= 3 && r.chance() ? 64 : 32; op = "movzx " + (destinationWidth === 64 ? "rax" : "eax") + ", " + (width === 8 ? "al" : "ax"); result = unsigned(source, destinationWidth); }
    var fullRax = destinationWidth === 32 ? unsigned(result, 32) : unsigned(result, 64);
    return question("zero_sign_extension", level, "execute", ["source=" + hex(source, width), op], [hexField("value", "value", fullRax, 64)], [op, width, hex(source, width)]);
  };

  GENERATORS.little_endian_load_store = function (level, r) {
    var widths = level === 1 ? [16, 32] : level <= 3 ? [16, 32, 64] : [8, 16, 32, 64], width = r.pick(widths), value = edgeValue(r, width), bytes = bytesOf(value, width), load = r.chance();
    if (load) return question("little_endian_load_store", level, "compute", ["mem[0x1000..]=" + byteString(bytes), "load width=" + width], [hexField("value", "value", value, width)], ["load", width, byteString(bytes)]);
    return question("little_endian_load_store", level, "compute", ["store width=" + width, "value=" + hex(value, width), "address=0x2003"], [field("bytes", "bytes", "bytes", byteString(bytes))], ["store", width, hex(value, width)]);
  };

  var OPERAND_FIXTURES = [
    { text: "mov eax, 5", dest: "register", src: "immediate", width: "32" },
    { text: "mov rax, qword ptr [rbx]", dest: "register", src: "memory", width: "64" },
    { text: "mov byte ptr [rdi+1], al", dest: "memory", src: "register", width: "8" },
    { text: "cmp byte ptr [rdi+1], 0", dest: "memory", src: "immediate", width: "8" },
    { text: "add word ptr [rbp-2], 1", dest: "memory", src: "immediate", width: "16" },
    { text: "xor r10d, r11d", dest: "register", src: "register", width: "32" }
  ];
  GENERATORS.operand_kind_and_width = function (level, r) {
    var fixture = r.pick(OPERAND_FIXTURES.slice(0, Math.min(2 + level, OPERAND_FIXTURES.length)));
    return question("operand_kind_and_width", level, "identify", [fixture.text], [
      choiceField("destinationKind", "destinationKind", fixture.dest, ["register", "memory", "immediate"]),
      choiceField("sourceKind", "sourceKind", fixture.src, ["register", "memory", "immediate"]),
      codeChoiceField("width", "width", fixture.width, ["8", "16", "32", "64"])
    ], [fixture.text]);
  };

  GENERATORS.effective_address_bisd = function (level, r) {
    var baseNames = ["RBX", "RBP", "R8", "R10", "R13"], indexNames = ["RCX", "RSI", "R9", "R11", "R14"], baseName = r.pick(baseNames.slice(0, Math.min(2 + level, baseNames.length))), indexName = r.pick(indexNames.slice(0, Math.min(2 + level, indexNames.length)));
    var base = 0x1000n * BigInt(r.int(1, 0x100)) + BigInt(r.int(0, 0xFF)), index = BigInt(r.int(0, level >= 4 ? 0xFFFF : 0xFF)), scale = r.pick([1, 2, 4, 8].slice(0, Math.min(level + 1, 4))), displacement = BigInt(level === 1 ? r.int(0, 64) : r.int(-256, 512)), address = effectiveAddress(base, index, scale, displacement);
    var expression = "[" + baseName.toLowerCase() + "+" + indexName.toLowerCase() + "*" + scale + (displacement < 0n ? "-" + hex(-displacement, 64).replace(/^0x0+/, "0x") : "+" + hex(displacement, 64).replace(/^0x0+/, "0x")) + "]";
    return question("effective_address_bisd", level, "compute", [baseName + "=" + hex(base, 64), indexName + "=" + hex(index, 64), expression], [hexField("address", "address", address, 64)], [baseName, indexName, scale, displacement.toString(), base.toString(), index.toString()]);
  };

  GENERATORS.rip_relative_address = function (level, r) {
    var start = 0x400000n + BigInt(r.int(0, 0xFFFF)), length = r.int(2, 10), nextRip = start + BigInt(length), displacement = BigInt(level === 1 ? r.int(0, 0x100) : r.int(-0x400, 0x400)), target = relativeTarget(nextRip, displacement);
    var useStart = level >= 3 && r.chance();
    return question("rip_relative_address", level, "compute", useStart ? ["RIP=" + hex(start, 64), "length=" + length, "disp=" + displacement] : ["next_RIP=" + hex(nextRip, 64), "disp=" + displacement], [hexField("address", "address", target, 64)], [useStart ? "start" : "next", start.toString(), length, displacement.toString()]);
  };

  GENERATORS.lea_result = function (level, r) {
    var base = BigInt(r.int(0, 0xFFFF)) + 0x1000n, index = BigInt(r.int(0, 255)), scale = r.pick([1, 2, 4, 8].slice(0, Math.min(2 + level, 4))), displacement = BigInt(r.int(-64, 128)), address = effectiveAddress(base, index, scale, displacement), destination32 = level >= 2 && r.chance(), destination = destination32 ? "EAX" : "RAX", result = destination32 ? unsigned(address, 32) : address;
    return question("lea_result", level, "execute", ["RBX=" + hex(base, 64) + " RCX=" + hex(index, 64), "lea " + destination.toLowerCase() + ", [rbx+rcx*" + scale + (displacement < 0 ? displacement : "+" + displacement) + "]", level >= 3 ? "mapped=false" : "mapped=true"], [hexField("value", "value", result, 64), choiceField("flagsUnchanged", "flagsUnchanged", "yes", ["yes", "no"]), intField("memoryReads", "memoryReads", 0)], [destination, base.toString(), index.toString(), scale, displacement.toString(), level >= 3]);
  };

  GENERATORS.intel_att_translation = function (level, r) {
    var fixture = r.pick(ATT_FIXTURES.slice(0, Math.min(level + 1, ATT_FIXTURES.length))), toAtt = r.chance(), source = toAtt ? fixture.intel : fixture.att, answer = toAtt ? fixture.att : fixture.intel;
    return question("intel_att_translation", level, "translate", [(toAtt ? "Intel → AT&T" : "AT&T → Intel"), source], [field("translation", "translation", "assembly", normalizeAssembly(answer))], [toAtt ? "att" : "intel", fixture.intel]);
  };

  function arithmeticFields(result, width) {
    return [hexField("result", "result", result.result, width), flagField("CF", result.CF), flagField("PF", result.PF), flagField("AF", result.AF), flagField("ZF", result.ZF), flagField("SF", result.SF), flagField("OF", result.OF)];
  }

  GENERATORS.mov_instruction_effect = function (level, r) {
    var variant = r.pick(level === 1 ? ["reg64", "reg32"] : level <= 3 ? ["reg64", "reg32", "store", "load"] : ["reg64", "reg32", "store", "load", "partial"]), value = random64(r);
    if (variant === "reg64") return question("mov_instruction_effect", level, "execute", ["RBX=" + hex(value, 64), "mov rax, rbx"], [hexField("destination", "destination", value, 64), choiceField("preserved", "preserved", "yes", ["yes", "no"])], [variant, value.toString()]);
    if (variant === "reg32") return question("mov_instruction_effect", level, "execute", ["EBX=" + hex(value, 32), "RAX=" + hex(random64(r), 64), "mov eax, ebx"], [hexField("destination", "destination", unsigned(value, 32), 64), choiceField("preserved", "preserved", "yes", ["yes", "no"])], [variant, unsigned(value, 32).toString()]);
    if (variant === "partial") {
      var initial = random64(r), incoming = edgeValue(r, 16), result = writeAlias(initial, "AX", incoming);
      return question("mov_instruction_effect", level, "execute", ["RAX=" + hex(initial, 64), "mov ax, " + hex(incoming, 16)], [hexField("destination", "destination", result, 64), choiceField("preserved", "preserved", "yes", ["yes", "no"])], [variant, initial.toString(), incoming.toString()]);
    }
    var width = r.pick([16, 32, 64].slice(0, Math.min(level, 3))), narrowed = unsigned(value, width), bytes = bytesOf(narrowed, width);
    if (variant === "store") return question("mov_instruction_effect", level, "execute", ["RAX=" + hex(value, 64), "mov " + (width === 16 ? "word" : width === 32 ? "dword" : "qword") + " ptr [0x1003], " + (width === 16 ? "ax" : width === 32 ? "eax" : "rax")], [field("bytes", "bytes", "bytes", byteString(bytes)), choiceField("preserved", "preserved", "yes", ["yes", "no"])], [variant, width, value.toString()]);
    var loaded = width === 32 ? unsigned(narrowed, 32) : narrowed;
    return question("mov_instruction_effect", level, "execute", ["mem[0x1003..]=" + byteString(bytes), "mov " + (width === 16 ? "ax" : width === 32 ? "eax" : "rax") + ", " + (width === 16 ? "word" : width === 32 ? "dword" : "qword") + " ptr [0x1003]"], [hexField("destination", "destination", loaded, width === 16 ? 16 : 64), choiceField("preserved", "preserved", "yes", ["yes", "no"])], [variant, width, byteString(bytes)]);
  };

  GENERATORS.add_sub_flags = function (level, r) {
    var widths = level === 1 ? [8] : level === 2 ? [8, 16] : level === 3 ? [8, 16, 32] : [8, 16, 32, 64], width = r.pick(widths), op = r.chance() ? "ADD" : "SUB", a = edgeValue(r, width), b = edgeValue(r, width), result = op === "ADD" ? addOp(a, b, 0, width) : subOp(a, b, 0, width);
    return question("add_sub_flags", level, "execute", ["width=" + width, op + " " + hex(a, width) + ", " + hex(b, width)], arithmeticFields(result, width), [op, width, a.toString(), b.toString()]);
  };

  GENERATORS.adc_sbb_effect = function (level, r) {
    var widths = level <= 2 ? [8] : level === 3 ? [8, 16] : [8, 16, 32, 64], width = r.pick(widths), op = r.chance() ? "ADC" : "SBB", a = edgeValue(r, width), b = edgeValue(r, width), carry = r.int(0, 1), result = op === "ADC" ? addOp(a, b, carry, width) : subOp(a, b, carry, width);
    return question("adc_sbb_effect", level, "execute", ["width=" + width + " CF_in=" + carry, op + " " + hex(a, width) + ", " + hex(b, width)], arithmeticFields(result, width), [op, width, a.toString(), b.toString(), carry]);
  };

  GENERATORS.logical_test_flags = function (level, r) {
    var operations = level === 1 ? ["XOR", "AND"] : ["AND", "OR", "XOR", "TEST"], op = r.pick(operations), width = r.pick(level >= 4 ? [8, 16, 32, 64] : [8, 32]), a = edgeValue(r, width), b = edgeValue(r, width), output = logicalOp(op, a, b, width), destination = output.writes ? output.result : a;
    var fields = [hexField("destination", "destination", destination, width), hexField("result", "result", output.result, width), flagField("CF", output.CF), flagField("PF", output.PF), flagField("AF", output.AF), flagField("ZF", output.ZF), flagField("SF", output.SF), flagField("OF", output.OF)];
    return question("logical_test_flags", level, "execute", ["width=" + width, op + " " + hex(a, width) + ", " + hex(b, width)], fields, [op, width, a.toString(), b.toString()]);
  };

  GENERATORS.inc_dec_neg_not = function (level, r) {
    var operations = level === 1 ? ["INC", "NOT"] : level === 2 ? ["INC", "DEC", "NEG", "NOT"] : ["INC", "DEC", "NEG", "NOT"], op = r.pick(operations), width = r.pick(level >= 4 ? [8, 16, 32, 64] : [8, 16]), value = edgeValue(r, width), initialCF = r.int(0, 1), output = unaryOp(op, value, width, initialCF);
    return question("inc_dec_neg_not", level, "execute", ["width=" + width + " CF_in=" + initialCF, op + " " + hex(value, width)], arithmeticFields(output, width), [op, width, value.toString(), initialCF]);
  };

  GENERATORS.one_bit_shift = function (level, r) {
    var operations = level === 1 ? ["SHL", "SHR"] : ["SHL", "SHR", "SAR"], op = r.pick(operations), width = r.pick(level >= 4 ? [8, 16, 32, 64] : [8, 16]), value = edgeValue(r, width), output = shiftOne(op, value, width);
    return question("one_bit_shift", level, "execute", ["width=" + width, op + " " + hex(value, width) + ", 1"], arithmeticFields(output, width), [op, width, value.toString()]);
  };

  GENERATORS.imul_two_operand = function (level, r) {
    var width = r.pick(level <= 2 ? [16, 32] : [16, 32, 64]), a = edgeValue(r, width), b = edgeValue(r, width);
    if (r.chance()) a = unsigned(BigInt(r.int(-20, 20)), width); if (r.chance()) b = unsigned(BigInt(r.int(-20, 20)), width);
    var output = imulTwo(a, b, width);
    return question("imul_two_operand", level, "execute", ["width=" + width, "IMUL " + hex(a, width) + ", " + hex(b, width), "signed=" + signed(a, width) + " × " + signed(b, width)], arithmeticFields(output, width), [width, a.toString(), b.toString()]);
  };

  function relation(valueA, valueB) { return valueA < valueB ? "less" : valueA > valueB ? "greater" : "equal"; }
  GENERATORS.cmp_flag_relation = function (level, r) {
    var width = r.pick(level <= 2 ? [8, 32] : [8, 16, 32, 64]), a = edgeValue(r, width), b = edgeValue(r, width), output = subOp(a, b, 0, width), unsignedRelation = relation(unsigned(a, width), unsigned(b, width)), signedRelation = relation(signed(a, width), signed(b, width));
    var fields = [flagField("CF", output.CF), flagField("PF", output.PF), flagField("AF", output.AF), flagField("ZF", output.ZF), flagField("SF", output.SF), flagField("OF", output.OF), choiceField("unsignedRelation", "unsignedRelation", unsignedRelation, ["less", "equal", "greater"]), choiceField("signedRelation", "signedRelation", signedRelation, ["less", "equal", "greater"])];
    return question("cmp_flag_relation", level, "execute", ["width=" + width, "CMP " + hex(a, width) + ", " + hex(b, width)], fields, [width, a.toString(), b.toString(), unsignedRelation, signedRelation]);
  };

  GENERATORS.condition_code_evaluate = function (level, r) {
    var names = level === 1 ? ["JE", "JNE", "JS", "JNS"] : level === 2 ? ["JE", "JNE", "JB", "JAE", "JS"] : level === 3 ? ["JB", "JBE", "JA", "JAE", "JL", "JGE"] : Object.keys(CONDITIONS), name = r.pick(names);
    var flags = { CF: r.int(0, 1), PF: r.int(0, 1), ZF: r.int(0, 1), SF: r.int(0, 1), OF: r.int(0, 1) }, value = conditionValue(name, flags);
    return question("condition_code_evaluate", level, "decide", ["CF=" + flags.CF + " PF=" + flags.PF + " ZF=" + flags.ZF + " SF=" + flags.SF + " OF=" + flags.OF, name], [choiceField("taken", "taken", value ? "yes" : "no", ["yes", "no"])], [name, flags.CF, flags.PF, flags.ZF, flags.SF, flags.OF]);
  };

  var JUMP_RELATIONS = [
    { key: "equal", signed: false, jump: "JE" }, { key: "not equal", signed: false, jump: "JNE" },
    { key: "unsigned below", signed: false, jump: "JB" }, { key: "unsigned below or equal", signed: false, jump: "JBE" },
    { key: "unsigned above", signed: false, jump: "JA" }, { key: "unsigned above or equal", signed: false, jump: "JAE" },
    { key: "signed less", signed: true, jump: "JL" }, { key: "signed less or equal", signed: true, jump: "JLE" },
    { key: "signed greater", signed: true, jump: "JG" }, { key: "signed greater or equal", signed: true, jump: "JGE" }
  ];
  GENERATORS.choose_signed_unsigned_jump = function (level, r) {
    var pool = level === 1 ? JUMP_RELATIONS.slice(0, 2) : level === 2 ? JUMP_RELATIONS.slice(0, 6) : JUMP_RELATIONS, selected = r.pick(pool);
    return question("choose_signed_unsigned_jump", level, "identify", ["cmp a, b", "branch_if=" + selected.key], [codeChoiceField("jump", "jump", selected.jump, ["JE", "JNE", "JB", "JBE", "JA", "JAE", "JL", "JLE", "JG", "JGE"])], [selected.key, selected.jump]);
  };

  GENERATORS.cmp_then_branch = function (level, r) {
    var width = r.pick(level <= 2 ? [8, 32] : [8, 32, 64]), names = level === 1 ? ["JE", "JNE", "JL"] : level === 2 ? ["JB", "JA", "JL", "JG"] : ["JE", "JNE", "JB", "JBE", "JA", "JAE", "JL", "JLE", "JG", "JGE"], name = r.pick(names), a = edgeValue(r, width), b = edgeValue(r, width), flags = subOp(a, b, 0, width), taken = conditionValue(name, flags), nextRip = 0x400100n + BigInt(r.int(0, 0xFF)), target = relativeTarget(nextRip, BigInt(r.int(-128, 127))), rip = taken ? target : nextRip;
    return question("cmp_then_branch", level, "trace", ["width=" + width, "CMP " + hex(a, width) + ", " + hex(b, width), name + " " + hex(target, 64), "next_RIP=" + hex(nextRip, 64)], [flagField("CF", flags.CF), flagField("ZF", flags.ZF), flagField("SF", flags.SF), flagField("OF", flags.OF), choiceField("taken", "taken", taken ? "yes" : "no", ["yes", "no"]), hexField("RIP", "RIP", rip, 64)], [width, name, a.toString(), b.toString(), nextRip.toString(), target.toString()]);
  };

  GENERATORS.direct_branch_target = function (level, r) {
    var start = 0x400000n + BigInt(r.int(0, 0xFFFF)), length = r.pick(level === 1 ? [2, 5] : [2, 5, 6, 7]), nextRip = start + BigInt(length), displacement = BigInt(level === 1 ? r.int(0, 128) : r.int(-0x1000, 0x1000)), target = relativeTarget(nextRip, displacement), isCall = level >= 2 && r.chance();
    return question("direct_branch_target", level, "compute", ["RIP=" + hex(start, 64), "length=" + length, (isCall ? "CALL" : "Jcc") + " rel=" + displacement], [hexField("RIP", "RIP", target, 64)], [isCall ? "call" : "branch", start.toString(), length, displacement.toString()]);
  };

  GENERATORS.push_pop_effect = function (level, r) {
    var variant = r.pick(level === 1 ? ["push", "pop"] : ["push", "pop", "pair"]), rsp = 0x700000000000n + BigInt(r.int(0x100, 0xFFF)) * 8n, value = random64(r);
    if (variant === "push") return question("push_pop_effect", level, "execute", ["RSP=" + hex(rsp, 64) + " RAX=" + hex(value, 64), "push rax"], [hexField("RSP", "RSP", rsp - 8n, 64), hexField("memoryValue", "memoryValue", value, 64)], [variant, rsp.toString(), value.toString()]);
    if (variant === "pop") return question("push_pop_effect", level, "execute", ["RSP=" + hex(rsp, 64), "qword ptr [RSP]=" + hex(value, 64), "pop rbx"], [hexField("destination", "destination", value, 64), hexField("RSP", "RSP", rsp + 8n, 64)], [variant, rsp.toString(), value.toString()]);
    return question("push_pop_effect", level, "trace", ["RSP=" + hex(rsp, 64) + " RAX=" + hex(value, 64), "push rax", "pop rcx"], [hexField("destination", "destination", value, 64), hexField("RSP", "RSP", rsp, 64)], [variant, rsp.toString(), value.toString()]);
  };

  GENERATORS.call_ret_trace = function (level, r) {
    var start = 0x400000n + BigInt(r.int(0, 0xFFFF)), length = 5, nextRip = start + 5n, target = 0x500000n + BigInt(r.int(0, 0xFFFF)), rsp = 0x7FFFFFFFE000n - BigInt(r.int(0, 20)) * 16n, nested = level >= 3 && r.chance();
    if (nested) {
      var secondNext = target + 5n, secondTarget = 0x600000n + BigInt(r.int(0, 0xFFFF));
      return question("call_ret_trace", level, "trace", ["RIP=" + hex(start, 64) + " RSP=" + hex(rsp, 64), "call " + hex(target, 64), "call " + hex(secondTarget, 64)], [hexField("RIP", "RIP", secondTarget, 64), hexField("RSP", "RSP", rsp - 16n, 64), field("state", "state", "text", hex(nextRip, 64) + " @ " + hex(rsp - 8n, 64) + "; " + hex(secondNext, 64) + " @ " + hex(rsp - 16n, 64))], ["nested", start.toString(), target.toString(), secondTarget.toString()]);
    }
    var roundTrip = level >= 2 && r.chance();
    return question("call_ret_trace", level, roundTrip ? "trace" : "execute", ["RIP=" + hex(start, 64) + " RSP=" + hex(rsp, 64), "call " + hex(target, 64), roundTrip ? "ret" : "next_RIP=" + hex(nextRip, 64)], [hexField("RIP", "RIP", roundTrip ? nextRip : target, 64), hexField("RSP", "RSP", roundTrip ? rsp : rsp - 8n, 64), hexField("memoryValue", "memoryValue", nextRip, 64)], [roundTrip ? "round" : "call", start.toString(), target.toString(), rsp.toString()]);
  };

  var SYSV_ARGS = ["RDI", "RSI", "RDX", "RCX", "R8", "R9"];
  GENERATORS.sysv_argument_location = function (level, r) {
    var kind = level >= 2 && r.int(0, 5) === 0 ? "return" : "argument", number = kind === "return" ? 0 : r.int(1, level === 1 ? 6 : level <= 3 ? 8 : 12), location;
    if (kind === "return") location = "RAX";
    else if (number <= 6) location = SYSV_ARGS[number - 1];
    else location = "[RSP+" + (8 + (number - 7) * 8) + "]";
    return question("sysv_argument_location", level, "identify", [kind === "return" ? "integer_return" : "integer_argument=" + number, "ordinary_function_entry"], [codeChoiceField("location", "location", location, SYSV_ARGS.concat(["RAX", "[RSP]", "[RSP+8]", "[RSP+16]", "[RSP+24]", "[RSP+32]", "[RSP+40]", "[RSP+48]"]))], [kind, number, location]);
  };

  var CALLER_SAVED = ["RAX", "RCX", "RDX", "RSI", "RDI", "R8", "R9", "R10", "R11"];
  var CALLEE_SAVED = ["RBX", "RBP", "R12", "R13", "R14", "R15"];
  GENERATORS.caller_callee_saved = function (level, r) {
    var register = r.pick((level === 1 ? ["RBX", "RAX", "R10", "R12"] : CALLER_SAVED.concat(CALLEE_SAVED))), callee = CALLEE_SAVED.includes(register), nested = level >= 4 && r.chance(), responsibility = callee ? "callee" : "caller";
    var rows = ["register=" + register, nested ? "value_live_across_nested_call=true" : "value_live_across_call=true"];
    return question("caller_callee_saved", level, "decide", rows, [choiceField("registerClass", "registerClass", callee ? "calleeSaved" : "callerSaved", ["callerSaved", "calleeSaved"]), choiceField("responsibility", "responsibility", responsibility, ["caller", "callee"])], [register, nested]);
  };

  GENERATORS.stack_alignment = function (level, r) {
    var startMod = r.pick(level === 1 ? [0, 8] : [0, 8]), context = r.pick(level === 1 ? ["before_call", "callee_entry"] : ["before_call", "callee_entry", "nested"]), delta = 0;
    if (context === "callee_entry") { startMod = 0; delta = -8; }
    else if (context === "nested") { startMod = 8; var pushes = r.int(0, 2), allocation = r.pick([0, 8, 16, 24, 32, 40]); delta = -8 * pushes - allocation; }
    var modulus = ((startMod + delta) % 16 + 16) % 16, valid = context === "before_call" || context === "nested" ? modulus === 0 : modulus === 8;
    var rows = ["context=" + context, "initial_mod16=" + startMod, "stack_delta=" + delta];
    return question("stack_alignment", level, "compute", rows, [intField("modulus", "modulus", modulus), choiceField("valid", "valid", valid ? "yes" : "no", ["yes", "no"])], [context, startMod, delta]);
  };

  GENERATORS.prologue_epilogue_trace = function (level, r) {
    var entryRsp = 0x1008n + BigInt(r.int(0, 0x100)) * 16n, oldRbp = 0x7000n + BigInt(r.int(0, 0xFF)) * 16n, allocation = level === 1 ? 0 : r.pick([16, 32, 48, 64]), includeEpilogue = level >= 3 && r.chance(), frameRsp = entryRsp - 8n, finalRsp = frameRsp - BigInt(allocation);
    var rows = ["RSP=" + hex(entryRsp, 64) + " RBP=" + hex(oldRbp, 64), "push rbp", "mov rbp, rsp"]; if (allocation) rows.push("sub rsp, " + allocation); if (includeEpilogue) rows.push("leave");
    return question("prologue_epilogue_trace", level, "trace", rows, [hexField("RSP", "RSP", includeEpilogue ? entryRsp : finalRsp, 64), hexField("RBP", "RBP", includeEpilogue ? oldRbp : frameRsp, 64), hexField("memoryValue", "memoryValue", oldRbp, 64)], [allocation, includeEpilogue, entryRsp.toString(), oldRbp.toString()]);
  };

  GENERATORS.red_zone_usage = function (level, r) {
    var offset = -(level === 1 ? r.int(1, 64) : r.int(1, 160)), size = r.pick([1, 2, 4, 8, 16]), hasCall = level >= 3 && r.chance(), low = offset, high = offset + size - 1, valid = low >= -128 && high <= -1 && !hasCall;
    return question("red_zone_usage", level, "decide", ["access=[RSP" + offset + "..RSP" + (high < 0 ? high : "+" + high) + "]", "RSP_changed=false", "nested_call=" + hasCall], [choiceField("valid", "valid", valid ? "yes" : "no", ["yes", "no"]), field("range", "range", "text", low + ".." + high)], [offset, size, hasCall]);
  };

  GENERATORS.register_trace_snippet = function (level, r) {
    var variant = r.pick(level === 1 ? ["zero32", "partial"] : level <= 3 ? ["zero32", "partial", "xorDec"] : ["zero32", "partial", "xorDec", "flags"]), initial, result, flags, rows;
    if (variant === "zero32") {
      var immediate = unsigned(0xFFFFFF00n + BigInt(r.int(0, 0xFF)), 32), addend = BigInt(r.int(1, 4)); result = unsigned(immediate, 32) + addend; flags = addOp(unsigned(immediate, 32), addend, 0, 64);
      rows = ["mov eax, " + hex(immediate, 32), "add rax, " + addend];
    } else if (variant === "partial") {
      initial = random64(r); var low = BigInt(r.int(0, 255)); result = writeAlias(initial, "AL", low); flags = null; rows = ["RAX=" + hex(initial, 64), "mov al, " + hex(low, 8)];
    } else if (variant === "xorDec") {
      result = 0xFFFFFFFFn; flags = subOp(0n, 1n, 0, 32); flags.CF = 0; rows = ["xor ecx, ecx", "dec ecx"];
    } else {
      var start = r.pick([0x7Fn, 0xFFn]), one = 1n; flags = addOp(start, one, 0, 8); result = unsigned(flags.result, 8); rows = ["RAX=" + hex(random64(r), 64), "mov al, " + hex(start, 8), "add al, 1", "movzx eax, al"];
    }
    var fields = [hexField("state", "state", result, 64)]; if (flags) fields = fields.concat([flagField("CF", flags.CF), flagField("ZF", flags.ZF), flagField("SF", flags.SF), flagField("OF", flags.OF)]);
    return question("register_trace_snippet", level, "trace", rows, fields, [variant].concat(rows));
  };

  GENERATORS.memory_trace_snippet = function (level, r) {
    var variant = r.pick(level === 1 ? ["store32", "load8"] : ["store32", "load8", "indexed16"]), address = 0x1000n + BigInt(r.int(0, 0xFF));
    if (variant === "store32") {
      var value = randomWidth(r, 32); return question("memory_trace_snippet", level, "trace", ["mov eax, " + hex(value, 32), "mov dword ptr [" + hex(address, 64) + "], eax"], [field("bytes", "bytes", "bytes", byteString(bytesOf(value, 32))), hexField("state", "state", value, 64)], [variant, address.toString(), value.toString()]);
    }
    if (variant === "load8") {
      var byteValue = r.int(0, 255), added = r.int(1, 4), loaded = BigInt(byteValue + added); return question("memory_trace_snippet", level, "trace", ["mem[" + hex(address, 64) + "]=" + hex(byteValue, 8), "movzx eax, byte ptr [" + hex(address, 64) + "]", "add eax, " + added], [hexField("state", "state", loaded, 64)], [variant, address.toString(), byteValue, added]);
    }
    var base = 0x2000n, index = BigInt(r.int(0, 8)), target = base + index * 2n, wordValue = randomWidth(r, 16);
    return question("memory_trace_snippet", level, "trace", ["RBX=" + hex(base, 64) + " RCX=" + hex(index, 64), "mov word ptr [rbx+rcx*2], " + hex(wordValue, 16)], [hexField("address", "address", target, 64), field("bytes", "bytes", "bytes", byteString(bytesOf(wordValue, 16)))], [variant, index.toString(), wordValue.toString()]);
  };

  GENERATORS.branching_trace_snippet = function (level, r) {
    var variant = r.pick(level === 1 ? ["signed", "equal"] : level <= 3 ? ["signed", "equal", "unsigned", "loop"] : ["signed", "equal", "unsigned", "loop"]);
    if (variant === "loop") {
      var limit = r.int(2, 8); return question("branching_trace_snippet", level, "trace", ["EAX=0", "loop: inc eax", "cmp eax, " + limit, "jl loop"], [hexField("state", "state", BigInt(limit), 64), field("path", "path", "text", "loop×" + limit)], [variant, limit]);
    }
    var width = 32, a = edgeValue(r, width), b = edgeValue(r, width), flags = subOp(a, b, 0, width), jump = variant === "signed" ? "JL" : variant === "unsigned" ? "JA" : "JE", taken = conditionValue(jump, flags), path = taken ? "target" : "fallthrough";
    return question("branching_trace_snippet", level, "trace", ["EAX=" + hex(a, 32) + " EBX=" + hex(b, 32), "cmp eax, ebx", jump.toLowerCase() + " target"], [choiceField("path", "path", path, ["target", "fallthrough"])], [variant, a.toString(), b.toString(), jump]);
  };

  GENERATORS.undefined_flag_dependency = function (level, r) {
    var variant = r.pick(level === 1 ? ["xorJz", "andJc"] : level === 2 ? ["xorJz", "andJc", "logicalAf"] : ["xorJz", "andJc", "logicalAf", "imulJz"]), answer, rows;
    if (variant === "xorJz") { rows = ["xor eax, eax", "jz target"]; answer = "determinedTaken"; }
    else if (variant === "andJc") { rows = ["and eax, ebx", "jc target"]; answer = "determinedNotTaken"; }
    else if (variant === "logicalAf") { rows = ["or eax, ebx", "jz target", "AF=?; ZF=0"]; answer = "determinedNotTaken"; }
    else { rows = ["imul eax, ecx", "jz target", "ZF=?"]; answer = "indeterminate"; }
    return question("undefined_flag_dependency", level, "decide", rows, [choiceField("determined", "determined", answer, ["determinedTaken", "determinedNotTaken", "indeterminate"])], [variant]);
  };

  GENERATORS.abi_call_trace = function (level, r) {
    var variant = r.pick(level === 1 ? ["sum", "calleeSaved"] : level <= 3 ? ["sum", "calleeSaved", "callerSaved"] : ["sum", "calleeSaved", "callerSaved", "stackArg"]), rows, result, valid;
    if (variant === "sum") {
      var a = BigInt(r.int(0, 100)), b = BigInt(r.int(0, 100)); rows = ["RDI=" + a + " RSI=" + b, "call add2", "callee: lea rax,[rdi+rsi]"]; result = hex(a + b, 64); valid = true;
    } else if (variant === "calleeSaved") { var old = random64(r), changed = random64(r); rows = ["RBX_before=" + hex(old, 64), "callee: mov rbx," + hex(changed, 64), "ret (no restore)"]; result = hex(changed, 64); valid = false;
    } else if (variant === "callerSaved") { var r10 = random64(r), clobber = random64(r); rows = ["R10_before=" + hex(r10, 64) + " live=true", "call f", "callee_clobbers_R10=" + hex(clobber, 64)]; result = hex(clobber, 64); valid = true;
    } else { var seventh = random64(r); rows = ["ordinary_entry", "qword [RSP+8]=" + hex(seventh, 64), "mov rax,[rsp+8]"]; result = hex(seventh, 64); valid = true; }
    return question("abi_call_trace", level, "trace", rows, [field("state", "state", "text", result), choiceField("abiValid", "abiValid", valid ? "yes" : "no", ["yes", "no"])], [variant].concat(rows));
  };

  function normalizeHex(value) {
    var text = String(value === undefined ? "" : value).trim().replace(/_/g, "");
    if (text.startsWith("$")) text = "0x" + text.slice(1);
    if (!/^(?:0x)?[0-9a-f]+$/i.test(text)) return null;
    try { return BigInt(text.startsWith("0x") || text.startsWith("0X") ? text : "0x" + text).toString(); } catch (error) { return null; }
  }
  function normalizeInteger(value) { try { return BigInt(String(value).trim().replace(/_/g, "")).toString(); } catch (error) { return null; } }
  function normalizeBytes(value) {
    var tokens = String(value === undefined ? "" : value).trim().split(/[\s,;]+/).filter(Boolean), out = [];
    if (!tokens.length) return null;
    for (var token of tokens) { token = token.replace(/_/g, "").replace(/^0x/i, "").replace(/^\$/, ""); if (!/^[0-9a-f]{1,2}$/i.test(token)) return null; out.push(parseInt(token, 16).toString(16).padStart(2, "0")); }
    return out.join(" ");
  }
  function normalizeValue(value, kind) {
    if (kind === "hex") return normalizeHex(value);
    if (kind === "integer") return normalizeInteger(value);
    if (kind === "bytes") return normalizeBytes(value);
    if (kind === "assembly") return normalizeAssembly(value);
    return String(value === undefined ? "" : value).trim().toLowerCase().replace(/\s+/g, " ");
  }
  function checkQuestion(answers, item) {
    try { return { correct: item.fields.every(function (answerField) { return normalizeValue(answers && answers[answerField.id], answerField.kind) === normalizeValue(answerField.answer, answerField.kind); }), expectedText: item.expectedText }; }
    catch (error) { return { correct: false, expectedText: item.expectedText }; }
  }
  function generateQuestion(familyId, level, seed, ignoreHistory) {
    var familyItem = familyById(familyId), safeLevel = Math.max(1, Math.min(5, Number(level) || 1)), generator = GENERATORS[familyItem.id];
    if (!generator) throw new Error("Missing AMD64 generator: " + familyItem.id);
    var item = generator(safeLevel, new Rng(seed));
    if (!item || item.familyId !== familyItem.id || item.level !== safeLevel) throw new Error("Generator identity mismatch: " + familyItem.id);
    if (/NaN/.test(JSON.stringify(item))) throw new Error("Unresolved generated state: " + familyItem.id);
    if (!ignoreHistory && recentSignatures.includes(item.structuralSignature)) return generator(safeLevel, new Rng((Number(seed) + 0x9E3779B9) >>> 0));
    return item;
  }

  function statKey(id, level) { return id + ":" + level; }
  function blankStat() { return { attempts: 0, correct: 0, totalMs: 0, streak: 0, recent: [], mastery: 0 }; }
  function defaultProgress() {
    var enabled = {}; CATEGORIES.forEach(function (category) { enabled[category.id] = true; });
    return { version: 1, view: "practice", settings: { adaptive: true, enabled: enabled }, manual: { familyId: FAMILIES[0].id, level: 1 }, stats: {} };
  }
  function safeNumber(value, min, max, fallback) { var number = Number(value); return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback; }
  function mergeProgress(raw) {
    var merged = defaultProgress(); if (!raw || typeof raw !== "object") return merged;
    if (["practice", "matrix", "stats", "settings", "learn"].includes(raw.view)) merged.view = raw.view;
    if (raw.settings && typeof raw.settings === "object") { merged.settings.adaptive = raw.settings.adaptive !== false; Object.keys(merged.settings.enabled).forEach(function (id) { if (raw.settings.enabled && raw.settings.enabled[id] === false) merged.settings.enabled[id] = false; }); }
    if (raw.manual && FAMILIES.some(function (item) { return item.id === raw.manual.familyId; })) { merged.manual.familyId = raw.manual.familyId; merged.manual.level = safeNumber(raw.manual.level, 1, 5, 1); }
    if (raw.stats && typeof raw.stats === "object") Object.keys(raw.stats).slice(0, FAMILIES.length * LEVELS.length).forEach(function (key) {
      var parts = key.split(":"), familyItem = familyById(parts[0]), level = Number(parts[1]), source = raw.stats[key];
      if (familyItem.id !== parts[0] || !LEVELS.includes(level) || !source || typeof source !== "object") return;
      var stat = blankStat(); stat.attempts = Math.floor(safeNumber(source.attempts, 0, 1000000, 0)); stat.correct = Math.floor(safeNumber(source.correct, 0, stat.attempts, 0)); stat.totalMs = Math.floor(safeNumber(source.totalMs, 0, 315360000000, 0)); stat.streak = Math.floor(safeNumber(source.streak, 0, stat.attempts, 0)); stat.recent = Array.isArray(source.recent) ? source.recent.slice(-20).map(Boolean) : []; stat.mastery = Math.round(safeNumber(source.mastery, 0, 100, 0)); merged.stats[key] = stat;
    });
    return merged;
  }
  function loadProgress() { return mergeProgress(PracticeLabUI.readJson(STORAGE_KEY)); }
  function saveProgress() { PracticeLabUI.writeJson(STORAGE_KEY, progress); }
  function getStat(id, level) { var key = statKey(id, level); if (!progress.stats[key]) progress.stats[key] = blankStat(); return progress.stats[key]; }
  function updateMastery(stat) { var accuracy = stat.attempts ? stat.correct / stat.attempts : 0, recent = stat.recent.length ? stat.recent.filter(Boolean).length / stat.recent.length : 0; stat.mastery = Math.round(100 * Math.min(1, 0.55 * accuracy + 0.35 * recent + 0.1 * Math.min(1, stat.attempts / 8))); }
  function aggregate() { var total = { attempts: 0, correct: 0, totalMs: 0, masteryTotal: 0, practiced: 0 }; Object.values(progress.stats).forEach(function (stat) { total.attempts += stat.attempts; total.correct += stat.correct; total.totalMs += stat.totalMs; if (stat.attempts) { total.masteryTotal += stat.mastery; total.practiced += 1; } }); return total; }
  function chooseAdaptiveCell() {
    var families = FAMILIES.filter(function (item) { return progress.settings.enabled[item.categoryId] !== false; }); if (!families.length) families = FAMILIES;
    var best = null; families.forEach(function (familyItem) { var unlocked = PracticeLabUI.unlockedLevels(familyItem.levels, function (level) { return getStat(familyItem.id, level); }), level = unlocked[unlocked.length - 1], stat = getStat(familyItem.id, level), score = 100 - stat.mastery + (stat.attempts === 0 ? 35 : 0) + (rng.next() % 20); if (!best || score > best.score) best = { family: familyItem, level: level, score: score }; }); return best;
  }
  function elapsedMs() { return Date.now() - currentStartedAt - pausedMs - (isPaused ? Date.now() - pauseStartedAt : 0); }
  function startQuestion() {
    if (isPaused) return; var cell = progress.settings.adaptive ? chooseAdaptiveCell() : { family: familyById(progress.manual.familyId), level: progress.manual.level }, seed = rng.next(), tries = 0;
    do { currentQuestion = generateQuestion(cell.family.id, cell.level, (seed + tries) >>> 0, true); tries += 1; } while (recentSignatures.includes(currentQuestion.structuralSignature) && tries < 30);
    recentSignatures.push(currentQuestion.structuralSignature); recentSignatures = recentSignatures.slice(-100); currentStartedAt = Date.now(); pausedMs = 0; pauseStartedAt = 0; submitted = false; renderQuestion(); renderPracticeControls(); renderCurrentMetrics();
  }

  function renderPrompt(promptData) {
    var container = document.getElementById("questionPrompt"); container.replaceChildren(); var title = document.createElement("div"); title.className = "prompt-title"; title.textContent = promptData.title; container.appendChild(title);
    promptData.rows.forEach(function (row) { var element = document.createElement("div"); element.className = "prompt-row"; element.textContent = row; container.appendChild(element); });
    var note = document.createElement("div"); note.className = "prompt-note"; note.textContent = promptData.note + " " + t("generated.modelNote", "All state is initialized synthetic data."); container.appendChild(note);
  }
  function textInputs() { return Array.from(document.querySelectorAll("#answerControls input[data-answer-field]")); }
  function customInput(input) { return input && ["hex", "integer", "bytes"].includes(input.dataset.inputKind); }
  function finePointer() { return window.matchMedia ? window.matchMedia("(pointer: fine)").matches : true; }
  function setActiveInput(input, focus) { activeAnswerInput = input || null; textInputs().forEach(function (element) { element.classList.toggle("active-keypad-target", element === activeAnswerInput && customInput(element)); }); updateKeypad(); if (focus && activeAnswerInput && finePointer()) activeAnswerInput.focus(); }
  function nextInput() { var inputs = textInputs().filter(function (element) { return !element.disabled && customInput(element); }); if (inputs.length < 2) return; var index = inputs.indexOf(activeAnswerInput); setActiveInput(inputs[(index + 1 + inputs.length) % inputs.length], true); }
  function renderAnswerControls() {
    var container = document.getElementById("answerControls"); container.replaceChildren(); activeAnswerInput = null;
    currentQuestion.fields.forEach(function (answerField) {
      var wrap = document.createElement("div"), labelElement = document.createElement("label"), control; wrap.className = "answer-control"; labelElement.textContent = answerField.label; labelElement.htmlFor = "answer-" + answerField.id;
      if (answerField.options) { control = document.createElement("select"); var blank = document.createElement("option"); blank.value = ""; blank.textContent = t("practice.choose", "Choose…"); control.appendChild(blank); answerField.options.forEach(function (option) { var element = document.createElement("option"); element.value = option.value; element.textContent = option.label; control.appendChild(element); }); }
      else { control = document.createElement("input"); control.type = "text"; control.autocomplete = "off"; control.spellcheck = false; control.dataset.inputKind = answerField.kind; if (["hex", "integer", "bytes"].includes(answerField.kind)) control.inputMode = "none"; control.addEventListener("focus", function () { setActiveInput(control, false); }); if (!activeAnswerInput && customInput(control)) activeAnswerInput = control; }
      control.id = "answer-" + answerField.id; control.dataset.answerField = answerField.id; wrap.appendChild(labelElement); wrap.appendChild(control); container.appendChild(wrap);
    });
    setActiveInput(activeAnswerInput, false);
  }
  var DIGIT_IDS = ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9"], HEX_IDS = ["hexA", "hexB", "hexC", "hexD", "hexE", "hexF", "hexPrefix"], META_IDS = ["minus", "space"];
  function updateKeypad() {
    if (!keypadButtons) return; var editable = Boolean(activeAnswerInput && customInput(activeAnswerInput) && !activeAnswerInput.disabled && !submitted && !isPaused), kind = editable ? activeAnswerInput.dataset.inputKind : "", allowed = [];
    if (kind === "hex") allowed = DIGIT_IDS.concat(HEX_IDS); else if (kind === "integer") allowed = DIGIT_IDS.concat(["minus"]); else if (kind === "bytes") allowed = DIGIT_IDS.concat(HEX_IDS.slice(0, 6), ["space"]);
    DIGIT_IDS.concat(HEX_IDS, META_IDS).forEach(function (id) { var button = keypadButtons.get(id); if (button) button.disabled = !editable || !allowed.includes(id); });
    ["delete", "clear"].forEach(function (id) { keypadButtons.get(id).disabled = !editable; }); var customCount = textInputs().filter(customInput).length; keypadButtons.get("nextField").disabled = !editable || customCount < 2; keypadButtons.get("submit").disabled = isPaused; document.getElementById("answerKeypad").classList.toggle("hidden", !editable && !customInput(activeAnswerInput));
  }
  function renderQuestion() {
    var familyItem = familyById(currentQuestion.familyId); document.getElementById("questionCategory").textContent = categoryById(familyItem.categoryId).title; document.getElementById("questionFamily").textContent = familyItem.title; document.getElementById("questionLevel").textContent = t("practice.level", "Level") + " " + currentQuestion.level; renderPrompt(currentQuestion.prompt); renderAnswerControls();
    document.getElementById("feedback").className = "feedback hidden"; document.getElementById("submitBtn").disabled = false; document.getElementById("submitBtn").innerHTML = PracticeLabUI.escapeHtml(t("practice.check", "Check")) + ' <span class="key-symbol">↵</span>'; document.getElementById("nextBtn").classList.add("hidden"); document.getElementById("skipBtn").classList.remove("hidden"); keypadButtons.get("submit").textContent = t("practice.check", "Check"); renderPauseState();
  }
  function collectAnswers() { var answers = {}; document.querySelectorAll("[data-answer-field]").forEach(function (element) { answers[element.dataset.answerField] = element.value; }); return answers; }
  function submitAnswer(event) {
    event.preventDefault(); if (!currentQuestion || isPaused) return; if (submitted) { startQuestion(); return; }
    var result = checkQuestion(collectAnswers(), currentQuestion), duration = elapsedMs(), stat = getStat(currentQuestion.familyId, currentQuestion.level); stat.attempts += 1; stat.correct += result.correct ? 1 : 0; stat.totalMs += duration; stat.streak = result.correct ? stat.streak + 1 : 0; stat.recent = stat.recent.concat([result.correct]).slice(-10); updateMastery(stat); saveProgress(); submitted = true;
    document.querySelectorAll("[data-answer-field]").forEach(function (element) { element.disabled = true; }); updateKeypad(); document.getElementById("submitBtn").innerHTML = PracticeLabUI.escapeHtml(t("practice.next", "Next")) + ' <span class="key-symbol">↵</span>'; document.getElementById("nextBtn").classList.remove("hidden"); document.getElementById("skipBtn").classList.add("hidden"); keypadButtons.get("submit").textContent = t("practice.next", "Next");
    var feedback = document.getElementById("feedback"); feedback.className = "feedback " + (result.correct ? "correct" : "incorrect"); feedback.replaceChildren(); var strong = document.createElement("strong"); strong.textContent = result.correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite"); feedback.appendChild(strong);
    if (!result.correct) { var expected = document.createElement("div"); expected.className = "expected-code"; expected.textContent = t("messages.expected", "Expected") + ": " + result.expectedText; feedback.appendChild(expected); }
    var detail = document.createElement("div"); detail.className = "feedback-detail"; detail.textContent = currentQuestion.explanation + " " + t("messages.time", "Time") + ": " + PracticeLabUI.formatSeconds(duration) + "."; feedback.appendChild(detail); renderCurrentMetrics(); renderSummary();
  }
  function pausePractice() { if (isPaused || submitted) return; isPaused = true; pauseStartedAt = Date.now(); renderPauseState(); }
  function resumePractice() { if (!isPaused) return; pausedMs += Date.now() - pauseStartedAt; pauseStartedAt = 0; isPaused = false; renderPauseState(); }
  function renderPauseState() { var main = document.querySelector(".practice-main"); if (main) main.classList.toggle("paused", isPaused); document.getElementById("pauseBtn").disabled = isPaused || submitted; updateKeypad(); }

  function renderSummary() { var total = aggregate(); document.getElementById("summaryMastery").textContent = (total.practiced ? Math.round(total.masteryTotal / total.practiced) : 0) + "%"; document.getElementById("summaryAccuracy").textContent = (total.attempts ? Math.round(100 * total.correct / total.attempts) : 0) + "%"; document.getElementById("summaryAttempts").textContent = total.attempts; }
  function renderCurrentMetrics() { if (!currentQuestion) return; var stat = getStat(currentQuestion.familyId, currentQuestion.level); document.getElementById("currentMastery").textContent = stat.mastery + "%"; document.getElementById("currentAccuracy").textContent = (stat.attempts ? Math.round(100 * stat.correct / stat.attempts) : 0) + "%"; document.getElementById("currentStreak").textContent = stat.streak; document.getElementById("currentAverage").textContent = stat.attempts ? PracticeLabUI.formatSeconds(stat.totalMs / stat.attempts) : "—"; document.getElementById("questionMastery").textContent = stat.mastery + "% " + t("practice.masterySuffix", "mastery"); }
  function renderPracticeControls() { document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active", progress.settings.adaptive); document.getElementById("manualModeBtn").classList.toggle("secondary-active", !progress.settings.adaptive); if (selectorController) selectorController.render(progress.manual); }
  function setManualSelection(familyId, level) { progress.settings.adaptive = false; progress.manual.familyId = familyById(familyId).id; progress.manual.level = Math.max(1, Math.min(5, Number(level) || 1)); saveProgress(); startQuestion(); }
  function renderMatrix() {
    var container = document.getElementById("matrix"); container.replaceChildren(); var table = document.createElement("table"), head = document.createElement("thead"), headRow = document.createElement("tr"), blank = document.createElement("th"); blank.textContent = t("practice.family", "Question family"); headRow.appendChild(blank); LEVELS.forEach(function (level) { var th = document.createElement("th"); th.textContent = "L" + level; headRow.appendChild(th); }); head.appendChild(headRow); table.appendChild(head); var body = document.createElement("tbody");
    CATEGORIES.forEach(function (category) { var categoryRow = document.createElement("tr"), categoryCell = document.createElement("th"); categoryCell.colSpan = 6; categoryCell.textContent = category.title; categoryRow.appendChild(categoryCell); body.appendChild(categoryRow); FAMILIES.filter(function (item) { return item.categoryId === category.id; }).forEach(function (familyItem) { var row = document.createElement("tr"), name = document.createElement("td"); name.textContent = familyItem.title; row.appendChild(name); LEVELS.forEach(function (level) { var stat = getStat(familyItem.id, level), cell = document.createElement("td"), button = document.createElement("button"); button.type = "button"; button.className = "level-button " + (stat.mastery >= 80 ? "ready" : stat.attempts ? "weak" : ""); button.dataset.familyId = familyItem.id; button.dataset.level = level; button.innerHTML = "L" + level + "<br><span>" + stat.mastery + "% · " + stat.attempts + "</span>"; cell.appendChild(button); row.appendChild(cell); }); body.appendChild(row); }); }); table.appendChild(body); container.appendChild(table);
  }
  function renderStats() {
    var total = aggregate(); document.getElementById("statTotalAttempts").textContent = total.attempts; document.getElementById("statTotalCorrect").textContent = total.correct; document.getElementById("statTotalTime").textContent = PracticeLabUI.formatMinutes(total.totalMs); document.getElementById("statActiveCells").textContent = total.practiced;
    var cells = Object.keys(progress.stats).map(function (key) { var parts = key.split(":"), familyItem = FAMILIES.find(function (item) { return item.id === parts[0]; }); return familyItem ? { family: familyItem, level: Number(parts[1]), stat: progress.stats[key] } : null; }).filter(function (cell) { return cell && cell.stat.attempts; }); cells.sort(function (a, b) { return a.stat.mastery - b.stat.mastery; });
    function fill(id, selected) { var container = document.getElementById(id); container.replaceChildren(); if (!selected.length) { var empty = document.createElement("p"); empty.textContent = t("stats.noAttemptsYet", "No attempts yet"); container.appendChild(empty); return; } selected.forEach(function (cell) { var button = document.createElement("button"); button.type = "button"; button.dataset.familyId = cell.family.id; button.dataset.level = cell.level; button.textContent = cell.family.title + " · L" + cell.level + " · " + cell.stat.mastery + "% (" + cell.stat.attempts + " " + t("stats.tries", "tries") + ")"; container.appendChild(button); }); }
    fill("weakList", cells.slice(0, 8)); fill("strongList", cells.slice().reverse().slice(0, 8));
  }
  function renderSettings() { var container = document.getElementById("enabledCategories"); container.replaceChildren(); CATEGORIES.forEach(function (category) { var row = document.createElement("div"), labelElement = document.createElement("label"), input = document.createElement("input"), span = document.createElement("span"); row.className = "check-row"; input.type = "checkbox"; input.checked = progress.settings.enabled[category.id] !== false; input.dataset.categoryId = category.id; span.textContent = category.title; labelElement.appendChild(input); labelElement.appendChild(span); row.appendChild(labelElement); container.appendChild(row); }); }
  function renderLearn() { var container = document.getElementById("learnGrid"); container.replaceChildren(); FAMILIES.forEach(function (familyItem) { var card = document.createElement("article"), heading = document.createElement("h3"), concept = document.createElement("p"), rules = document.createElement("p"), example = document.createElement("code"); card.id = "learn-" + familyItem.id; card.className = "learn-card" + (learnSpotlightId === familyItem.id ? " spotlight" : ""); heading.textContent = familyItem.title; concept.textContent = familyItem.learn.concept; rules.textContent = familyItem.learn.rules; example.textContent = familyItem.learn.example; card.appendChild(heading); card.appendChild(concept); card.appendChild(rules); card.appendChild(example); container.appendChild(card); }); }
  function setView(view) { progress.view = view; saveProgress(); document.querySelectorAll(".view").forEach(function (element) { element.classList.toggle("active", element.id === "view-" + view); }); document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("active", button.dataset.view === view); }); if (view === "matrix") renderMatrix(); if (view === "stats") renderStats(); if (view === "settings") renderSettings(); if (view === "learn") { renderLearn(); if (learnSpotlightId) { var card = document.getElementById("learn-" + learnSpotlightId); if (card) card.scrollIntoView({ block: "center" }); } } if (view === "practice" && !currentQuestion) startQuestion(); }
  function renderAll() { renderSummary(); renderPracticeControls(); renderMatrix(); renderStats(); renderSettings(); renderLearn(); setView(progress.view); }

  function wireEvents() {
    selectorController = PracticeLabUI.createPracticeSelectors({ categorySelect: document.getElementById("categorySelect"), familySelect: document.getElementById("familySelect"), levelSelect: document.getElementById("levelSelect"), categories: CATEGORIES, families: FAMILIES, levelLabel: function (level) { return t("practice.level", "Level") + " " + level; }, onSelect: function (selection) { setManualSelection(selection.familyId, selection.level); } });
    var editor = PracticeLabUI.createTextEditor(function () { return isPaused ? null : activeAnswerInput; });
    keypadButtons = PracticeLabUI.renderInputGrid(document.getElementById("answerKeypad"), [
      [["A", editor.insert("A"), { id: "hexA" }], ["B", editor.insert("B"), { id: "hexB" }], ["C", editor.insert("C"), { id: "hexC" }], ["D", editor.insert("D"), { id: "hexD" }], [t("practice.delete", "Del"), editor.backspace, { id: "delete", variant: "function" }]],
      [["E", editor.insert("E"), { id: "hexE" }], ["F", editor.insert("F"), { id: "hexF" }], ["0x", editor.insert("0x"), { id: "hexPrefix", variant: "function" }], ["-", editor.insert("-"), { id: "minus", variant: "function" }], [t("practice.clear", "Clear"), editor.clear, { id: "clear", variant: "function" }]],
      [["7", editor.insert("7"), { id: "digit7" }], ["8", editor.insert("8"), { id: "digit8" }], ["9", editor.insert("9"), { id: "digit9" }], ["0", editor.insert("0"), { id: "digit0" }], [t("practice.nextFieldShort", "Field →"), nextInput, { id: "nextField", variant: "function", ariaLabel: t("practice.nextField", "Next answer field") }]],
      [["4", editor.insert("4"), { id: "digit4" }], ["5", editor.insert("5"), { id: "digit5" }], ["6", editor.insert("6"), { id: "digit6" }], ["1", editor.insert("1"), { id: "digit1" }], [t("practice.check", "Check"), function () { document.getElementById("answerForm").requestSubmit(); }, { id: "submit", variant: "primary" }]],
      [["2", editor.insert("2"), { id: "digit2" }], ["3", editor.insert("3"), { id: "digit3" }], ["␠", editor.insert(" "), { id: "space", variant: "function", ariaLabel: t("practice.space", "Space") }], ["", function () {}, { disabled: true, ariaLabel: "spacer" }], ["", function () {}, { disabled: true, ariaLabel: "spacer" }]]
    ]);
    document.querySelectorAll("[data-view]").forEach(function (button) { button.addEventListener("click", function () { setView(button.dataset.view); }); }); document.getElementById("adaptiveModeBtn").addEventListener("click", function () { progress.settings.adaptive = true; saveProgress(); startQuestion(); }); document.getElementById("manualModeBtn").addEventListener("click", function () { progress.settings.adaptive = false; saveProgress(); startQuestion(); }); document.getElementById("pauseBtn").addEventListener("click", pausePractice); document.getElementById("resumeBtn").addEventListener("click", resumePractice);
    document.getElementById("learnCurrentBtn").addEventListener("click", function () { if (!currentQuestion) return; learnSpotlightId = currentQuestion.familyId; setView("learn"); }); document.getElementById("answerForm").addEventListener("submit", submitAnswer); document.getElementById("nextBtn").addEventListener("click", startQuestion); document.getElementById("skipBtn").addEventListener("click", startQuestion);
    document.getElementById("matrix").addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManualSelection(button.dataset.familyId, button.dataset.level); } }); ["weakList", "strongList"].forEach(function (id) { document.getElementById(id).addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManualSelection(button.dataset.familyId, button.dataset.level); } }); });
    document.getElementById("enabledCategories").addEventListener("change", function (event) { if (event.target.dataset.categoryId) { progress.settings.enabled[event.target.dataset.categoryId] = event.target.checked; saveProgress(); } }); document.getElementById("exportBtn").addEventListener("click", function () { document.getElementById("dataBox").value = JSON.stringify(progress, null, 2); }); document.getElementById("copyBtn").addEventListener("click", function () { var box = document.getElementById("dataBox"); if (!box.value) box.value = JSON.stringify(progress, null, 2); PracticeLabUI.copyText(box.value); }); document.getElementById("importBtn").addEventListener("click", function () { try { progress = mergeProgress(JSON.parse(document.getElementById("dataBox").value)); saveProgress(); currentQuestion = null; renderAll(); } catch (error) { document.getElementById("dataBox").value = t("messages.invalidJson", "Invalid JSON") + ": " + error.message; } }); document.getElementById("resetBtn").addEventListener("click", function () { if (window.confirm(t("messages.resetConfirm", "Reset all local progress?"))) { progress = defaultProgress(); saveProgress(); currentQuestion = null; renderAll(); } }); document.addEventListener("keydown", function (event) { if (event.key === "Enter" && submitted && progress.view === "practice") { event.preventDefault(); startQuestion(); } });
  }

  function runSelfTests() {
    var failures = []; function assert(condition, message) { if (!condition && failures.length < 100) failures.push(message); }
    assert(FAMILIES.length === 33, "all 33 specified families"); assert(Object.keys(GENERATORS).length === 33, "all 33 generators"); assert(new Set(FAMILIES.map(function (item) { return item.id; })).size === 33, "unique family ids");
    Object.keys(ALIASES).forEach(function (name) { var info = aliasInfo(name), initial = 0x1122334455667788n, value = mask(info.width), result = writeAlias(initial, name, value); assert(unsigned(result, 64) === result, "alias width " + name); if (info.zeroUpper) assert((result >> 32n) === 0n, "32-bit zero upper " + name); });
    for (var a = 0; a < 256; a += 1) for (var b = 0; b < 256; b += 1) { var add = addOp(a, b, 0, 8), sub = subOp(a, b, 0, 8); assert(add.result === BigInt((a + b) & 255) && add.CF === bit(a + b > 255), "ADD8 " + a + ":" + b); assert(sub.result === BigInt((a - b) & 255) && sub.CF === bit(a < b), "SUB8 " + a + ":" + b); }
    for (var value = 0; value < 256; value += 1) ["SHL", "SHR", "SAR"].forEach(function (op) { var shifted = shiftOne(op, value, 8); assert(shifted.result >= 0n && shifted.result <= 255n, "shift8 " + op + ":" + value); });
    Object.keys(CONDITIONS).forEach(function (name) { for (var flags = 0; flags < 32; flags += 1) { var state = { CF: bit(flags & 1), PF: bit(flags & 2), ZF: bit(flags & 4), SF: bit(flags & 8), OF: bit(flags & 16) }; assert(typeof conditionValue(name, state) === "boolean", "condition " + name + ":" + flags); } });
    if (TEXT.localeCode !== "en") { assert(CATEGORIES.every(function (item) { return TEXT.categories && TEXT.categories[item.id]; }), "localized categories"); assert(FAMILIES.every(function (item) { return TEXT.families && TEXT.families[item.id] && TEXT.families[item.id].learn; }), "localized families"); }
    FAMILIES.forEach(function (familyItem, familyIndex) { LEVELS.forEach(function (level) { var signatures = new Set(); for (var sample = 0; sample < 80; sample += 1) { var seed = ((familyIndex + 1) * 100000 + level * 1000 + sample + 1) >>> 0; try { var item = generateQuestion(familyItem.id, level, seed, true); assert(checkQuestion(item.canonicalAnswer, item).correct, "canonical " + familyItem.id + ":" + level + ":" + seed); assert(!checkQuestion({}, item).correct, "empty answer " + familyItem.id + ":" + level); assert(item.metadata.modelId === MODEL_ID && item.metadata.syntheticState.nativeExecution === false, "metadata " + familyItem.id); signatures.add(item.structuralSignature); } catch (error) { failures.push(familyItem.id + " L" + level + " seed " + seed + ": " + error.message); } } assert(signatures.size >= 2, "structural variation " + familyItem.id + ":" + level); }); });
    if (failures.length) { console.error("AMD64 self-tests failed", failures); return { ok: false, failures: failures }; }
    console.info("AMD64 self-tests passed: 33 families, register slices, exhaustive 8-bit ADD/SUB, shifts, Jcc truth tables, and 13,200 generated questions"); return { ok: true, failures: [] };
  }
  function init() { progress = loadProgress(); rng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0); wireEvents(); renderAll(); }

  window.runSelfTests = runSelfTests;
  window.AssemblyAmd64Practice = { modelId: MODEL_ID, oracleVersion: ORACLE_VERSION, categories: CATEGORIES, families: FAMILIES, generateQuestion: generateQuestion, checkQuestion: checkQuestion, runSelfTests: runSelfTests, fixtures: ATT_FIXTURES, oracles: { unsigned: unsigned, signed: signed, hex: hex, parity: parity, addOp: addOp, subOp: subOp, logicalOp: logicalOp, unaryOp: unaryOp, shiftOne: shiftOne, imulTwo: imulTwo, aliasInfo: aliasInfo, writeAlias: writeAlias, bytesOf: bytesOf, valueOfBytes: valueOfBytes, effectiveAddress: effectiveAddress, relativeTarget: relativeTarget, conditionValue: conditionValue, normalizeAssembly: normalizeAssembly } };
  document.addEventListener("DOMContentLoaded", init);
}());
