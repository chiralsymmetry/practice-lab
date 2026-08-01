    (function () {
      "use strict";

      var STORAGE_KEY = "programmerPractice.v2";
      var LEGACY_STORAGE_KEY = "programmerPractice.v1";
      var TEXT = __LOCALE_TEXT__;
      var LEVELS = [1, 2, 3, 4, 5];
      var recentSignatures = [];
      var recentPrompts = [];
      var progress;
      var sessionRng;
      var currentQuestion = null;
      var currentStartedAt = 0;
      var pausedMs = 0;
      var pauseStartedAt = 0;
      var isPaused = false;
      var submitted = false;
      var learnSpotlightId = null;
      var activeAnswerInput = null;
      var generatedTranslationPairs = null;
      var selectorController = null;
      var keypadButtons = null;
      var KEYPAD_INPUT_BUTTON_IDS = [
        "hexD", "hexE", "hexF", "plus", "hexPrefix",
        "hexA", "hexB", "hexC", "minus", "octalPrefix",
        "digit7", "digit8", "digit9", "space",
        "digit4", "digit5", "digit6",
        "digit1", "digit2", "digit3", "digit0"
      ];
      var KEYPAD_ALLOWED_BY_KIND = {
        binaryPattern: ["digit0", "digit1"],
        hexPattern: ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "hexA", "hexB", "hexC", "hexD", "hexE", "hexF", "hexPrefix"],
        octalPattern: ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "octalPrefix"],
        integer: ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "plus", "minus"],
        hexInteger: ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "hexA", "hexB", "hexC", "hexD", "hexE", "hexF", "plus", "minus", "hexPrefix"],
        positions: ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "space"],
        bytes: ["digit0", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "hexA", "hexB", "hexC", "hexD", "hexE", "hexF", "hexPrefix", "space"]
      };

      function t(path, fallback) {
        var value = path.split(".").reduce(function (current, part) {
          return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
        }, TEXT);
        return value === undefined ? fallback : value;
      }

      function localizeGeneratedString(value) {
        if (TEXT.localeCode === "en" || value === null || value === undefined) return String(value || "");
        if (generatedTranslationPairs === null) {
          generatedTranslationPairs = t("generatedReplacements", []).slice().sort(function (a, b) {
            return b[0].length - a[0].length;
          });
        }
        var output = String(value);
        generatedTranslationPairs.forEach(function (pair, index) {
          output = output.split(pair[0]).join("\uE000" + index + "\uE001");
        });
        generatedTranslationPairs.forEach(function (pair, index) {
          output = output.split("\uE000" + index + "\uE001").join(pair[1]);
        });
        return output;
      }

      function localizeQuestion(question) {
        if (TEXT.localeCode === "en") return question;
        question.prompt.title = localizeGeneratedString(question.prompt.title);
        question.prompt.rows = question.prompt.rows.map(function (row) {
          return row === "none" ? t("answers.none", "none") : localizeGeneratedString(row);
        });
        question.prompt.note = localizeGeneratedString(question.prompt.note);
        question.answer.fields.forEach(function (answerField) {
          answerField.label = localizeGeneratedString(answerField.label);
          if (answerField.options) {
            answerField.options.forEach(function (option) {
              option.label = t("choiceLabels." + option.value, localizeGeneratedString(option.label));
            });
          }
        });
        question.feedback.worked = localizeGeneratedString(question.feedback.worked);
        if (question.familyId === "field_fit") question.feedback.worked = question.feedback.worked.replace(/^A /, "Ett ");
        return question;
      }

      function Rng(seed) {
        this.state = seed >>> 0 || 0x9e3779b9;
      }

      Rng.prototype.next = function () {
        var x = this.state >>> 0;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        this.state = x >>> 0;
        return this.state;
      };

      Rng.prototype.float = function () {
        return this.next() / 4294967296;
      };

      Rng.prototype.int = function (min, max) {
        return min + Math.floor(this.float() * (max - min + 1));
      };

      Rng.prototype.choice = function (values) {
        return values[this.int(0, values.length - 1)];
      };

      Rng.prototype.chance = function (probability) {
        return this.float() < probability;
      };

      Rng.prototype.bigint = function (bits) {
        var out = 0n;
        var chunks = Math.ceil(bits / 32);
        for (var i = 0; i < chunks; i += 1) out = (out << 32n) | BigInt(this.next());
        return out & widthMask(bits);
      };

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function widthMask(width) {
        return (1n << BigInt(width)) - 1n;
      }

      function modulo(value, width) {
        var modulus = 1n << BigInt(width);
        return ((value % modulus) + modulus) % modulus;
      }

      function toSigned(raw, width) {
        raw = modulo(raw, width);
        var sign = 1n << BigInt(width - 1);
        return (raw & sign) ? raw - (1n << BigInt(width)) : raw;
      }

      function signedMin(width) {
        return -(1n << BigInt(width - 1));
      }

      function signedMax(width) {
        return (1n << BigInt(width - 1)) - 1n;
      }

      function digitsFor(width, base) {
        if (base === 2) return width;
        if (base === 8) return Math.ceil(width / 3);
        return Math.ceil(width / 4);
      }

      function fixedDigits(value, width, base) {
        return modulo(value, width).toString(base).toUpperCase().padStart(digitsFor(width, base), "0");
      }

      function groupBinary(text) {
        if (!progress || !progress.settings || !progress.settings.groupBits) return text;
        var offset = text.length % 4;
        var result = "";
        for (var i = 0; i < text.length; i += 1) {
          if (i && (i - offset) % 4 === 0) result += " ";
          result += text[i];
        }
        return result.trim();
      }

      function bin(value, width) {
        return groupBinary(fixedDigits(value, width, 2));
      }

      function hex(value, width) {
        return "0x" + fixedDigits(value, width, 16);
      }

      function oct(value, width) {
        return "0o" + fixedDigits(value, width, 8);
      }

      function byteArray(value, width) {
        var count = width / 8;
        var bytes = [];
        for (var i = count - 1; i >= 0; i -= 1) {
          bytes.push(Number((modulo(value, width) >> BigInt(i * 8)) & 0xFFn).toString(16).toUpperCase().padStart(2, "0"));
        }
        return bytes;
      }

      function memoryPattern(width, rng, topBit) {
        var raw;
        var bytes;
        var attempts = 0;
        do {
          raw = randomNontrivial(rng, width);
          if (topBit === true) raw |= 1n << BigInt(width - 1);
          if (topBit === false) raw &= ~(1n << BigInt(width - 1));
          bytes = byteArray(raw, width);
          attempts += 1;
        } while (attempts < 100 && (new Set(bytes).size < 2 || bytes.join("") === bytes.slice().reverse().join("")));
        return raw;
      }

      function fromBytes(bytes, order) {
        var arranged = order === "little" ? bytes.slice().reverse() : bytes.slice();
        return arranged.reduce(function (value, byte) {
          return (value << 8n) | BigInt(parseInt(byte, 16));
        }, 0n);
      }

      function popcount(value, width) {
        var text = fixedDigits(value, width, 2);
        return text.split("").filter(function (bit) { return bit === "1"; }).length;
      }

      function minimumUnsignedWidth(value) {
        if (value === 0n) return 1;
        return value.toString(2).length;
      }

      function minimumSignedWidth(value) {
        var width = 1;
        while (value < signedMin(width) || value > signedMax(width)) width += 1;
        return width;
      }

      function widthForLevel(level, rng, kind) {
        var sets = kind === "memory"
          ? { 1: [16], 2: [16, 32], 3: [24, 32], 4: [32, 48], 5: [48, 64] }
          : { 1: [4], 2: [8], 3: [12, 16], 4: [24, 32], 5: [48, 64] };
        return rng.choice(sets[level]);
      }

      function compactWidth(level, rng) {
        return rng.choice(level === 1 ? [4] : level === 2 ? [4, 8] : level === 3 ? [8, 12] : level === 4 ? [12, 16] : [16, 24, 32]);
      }

      function displayValue(value, width, representation) {
        if (representation === "binary") return bin(value, width);
        if (representation === "hex") return hex(value, width);
        return String(value);
      }

      function widthBand(width) {
        if (width === null || width === undefined) return "unbounded";
        if (width <= 4) return "1-4";
        if (width <= 8) return "5-8";
        if (width <= 16) return "9-16";
        if (width <= 32) return "17-32";
        return "33-64";
      }

      var CATEGORIES = [
        { id: "representation", title: "Representation", short: "Represent" },
        { id: "fixed-width-arithmetic", title: "Fixed-Width Arithmetic", short: "Arithmetic" },
        { id: "bit-manipulation", title: "Bit Manipulation", short: "Bits" },
        { id: "address-layout-reasoning", title: "Addresses & Layouts", short: "Addresses" },
        { id: "memory-representation", title: "Memory Representation", short: "Memory" }
      ];

      var FAMILY_INFO = [
        ["power_relation", "representation", "Powers", "Power relationships", "Connect bit positions, powers of two, and their binary shape.", "In binary, 2^n is a 1 followed by n zeroes.", "bit 5 = 2^5 = 32"],
        ["power_landmark", "representation", "Powers", "Power landmarks", "Bracket values with neighboring powers of two.", "Use familiar powers as landmarks; do not repeatedly double from one.", "2^9 = 512 < 700 < 1024 = 2^10"],
        ["binary_hex_grouping", "representation", "Bases", "Binary ↔ hexadecimal", "Convert by grouping four bits per hexadecimal digit.", "Preserve leading zeroes whenever the answer is a pattern.", "1010 1111 = 0xAF"],
        ["binary_octal_grouping", "representation", "Bases", "Binary ↔ octal", "Convert by grouping three bits per octal digit.", "Octal is optional and should stay a small part of practice.", "111 101 = 0o75"],
        ["unsigned_base_conversion", "representation", "Bases", "Unsigned base conversion", "Convert unsigned values among decimal, binary, and hexadecimal.", "Separate numeric value answers from exact-width pattern answers.", "8-bit 0xA3 = 163"],
        ["interpret_pattern", "representation", "Views", "Interpret a bit pattern", "Read one pattern as unsigned and as two's complement.", "The top bit has signed weight -2^(n-1).", "8-bit 1111 1101 = unsigned 253, signed -3"],
        ["encode_fixed_width", "representation", "Views", "Encode fixed-width values", "Encode a representable decimal as an exact-width pattern.", "Negative signed values use two's complement; keep leading zeroes.", "-3 in 8 bits = 1111 1101"],
        ["reinterpret_decimal_view", "representation", "Views", "Reinterpret decimal views", "Keep the raw bits and change only signedness.", "For a top-bit-set pattern, signed = unsigned - 2^n.", "8-bit unsigned 253 ↔ signed -3"],
        ["range_boundary", "representation", "Widths & Fit", "Range boundaries", "Recall the useful signed and unsigned boundaries.", "Unsigned: 0..2^n-1. Signed: -2^(n-1)..2^(n-1)-1.", "8-bit signed: -128..127"],
        ["representability", "representation", "Widths & Fit", "Representability", "Decide whether a value fits a stated width and interpretation.", "Compare inclusively with both range endpoints.", "128 does not fit signed 8-bit"],
        ["minimum_width", "representation", "Widths & Fit", "Minimum width", "Find the smallest unsigned or signed width that fits.", "Unsigned zero still needs one bit.", "signed 128 needs 9 bits"],
        ["extend_pattern", "representation", "Extension", "Extend a pattern", "Zero-extend unsigned values or sign-extend signed values.", "Zero extension preserves unsigned value; sign extension preserves signed value.", "4-bit 1001 sign-extends to 1111 1001"],
        ["truncate_pattern", "representation", "Extension", "Truncate a pattern", "Keep the destination's low bits.", "Truncation preserves the value modulo 2^destination-width.", "8-bit 1011 0101 → 4-bit 0101"],
        ["unsigned_fixed_operation", "fixed-width-arithmetic", "Unsigned", "Unsigned add/subtract", "Compute a wrapped result and carry or borrow separately.", "Carry-out is for addition; borrow means left operand < right operand.", "4-bit 1111 + 0001 = 0000, carry yes"],
        ["unsigned_missing_operand", "fixed-width-arithmetic", "Unsigned", "Missing unsigned operand", "Reverse a wrapped addition or subtraction.", "Solve modulo 2^n, then keep exactly n bits.", "x + 0011 = 0001 → x = 1110"],
        ["signed_fixed_operation", "fixed-width-arithmetic", "Signed", "Signed add/subtract", "Compute the bits and classify signed overflow as above, below, or none.", "Signed overflow is a range test, not carry-out.", "0111 + 0001 = 1000, above"],
        ["signed_missing_operand", "fixed-width-arithmetic", "Signed", "Missing signed operand", "Reverse a two's-complement equation.", "The raw pattern equation is modulo 2^n; signed interpretation is separate.", "x - 0011 = 1110 → x = 0001"],
        ["classify_arithmetic_status", "fixed-width-arithmetic", "Status", "Classify arithmetic status", "Distinguish carry, borrow, and signed overflow on the same raw operation.", "Carry and signed overflow are independent facts.", "1111 + 0001: carry yes; signed overflow none"],
        ["bitwise_result", "bit-manipulation", "Bitwise", "Bitwise result", "Apply width-bounded AND, OR, XOR, or NOT.", "Each column is independent; NOT flips exactly the declared width.", "1010 XOR 1100 = 0110"],
        ["xor_missing_operand", "bit-manipulation", "Bitwise", "Missing XOR operand", "Use XOR's self-inverse property.", "If A XOR x = R, then x = A XOR R.", "1010 XOR x = 0110 → x = 1100"],
        ["identify_bitwise_operator", "bit-manipulation", "Bitwise", "Identify bitwise operator", "Infer the operator from operands and result.", "Decisive 11 and differing columns distinguish AND, OR, and XOR.", "1010 ? 1100 = 0110 → XOR"],
        ["shift_result", "bit-manipulation", "Shifts", "Shift result", "Apply logical left/right or arithmetic right shift.", "Left and logical right fill zero; ASR copies the original sign bit.", "1011 ASR 1 = 1101"],
        ["shift_with_carry", "bit-manipulation", "Shifts", "Shift with carry", "Give the result and the last bit shifted out.", "For a multi-bit shift, carry is not the OR of all discarded bits.", "1011 >>> 2 = 0010, carry 1"],
        ["shift_identification", "bit-manipulation", "Shifts", "Identify shift kind/count", "Infer which shift transformed one pattern into another.", "Use discarded bits and fill behavior; do not wrap them around.", "1001 → 0100 is logical right 1"],
        ["rotate_result", "bit-manipulation", "Rotates", "Rotate result", "Rotate within the stated width.", "Rotates wrap discarded bits around the opposite edge.", "1001 ROL 1 = 0011"],
        ["rotate_inverse_and_count", "bit-manipulation", "Rotates", "Rotate inverse/count", "Find the minimal rotation that maps source to result.", "Equivalent counts differ by a multiple of the width.", "1001 → 1100 = ROR 1"],
        ["construct_mask", "bit-manipulation", "Masks", "Construct a mask", "Build single-bit, set-of-bits, or inclusive range masks.", "Range hi..lo contains hi-lo+1 bits.", "bits 5..2 → 0011 1100"],
        ["apply_mask", "bit-manipulation", "Masks", "Apply a mask", "Set, clear, toggle, or keep selected bits.", "Clear uses x & ~mask, with NOT bounded to the width.", "clear bit 2: x & 1011"],
        ["test_masked_flags", "bit-manipulation", "Flags", "Test masked flags", "Distinguish test-single, test-any, test-all, and masked equality.", "Any and all differ when only some selected bits are set.", "(x & mask) == mask means all"],
        ["list_or_decode_flags", "bit-manipulation", "Flags", "List/decode flags", "Move between a flag pattern and its set-bit positions.", "Bit 0 is the rightmost bit; list order does not matter.", "0x25 → bits 0, 2, 5"],
        ["extract_field", "bit-manipulation", "Fields", "Extract a bit field", "Select inclusive hi..lo and right-align it.", "Use (x >>> lo) & ((1 << width)-1).", "0xB6 bits 5..2 → 1101"],
        ["insert_field", "bit-manipulation", "Fields", "Insert a bit field", "Clear the destination field, then place the new field.", "Preserve every bit outside hi..lo.", "clear, shift, mask, then OR"],
        ["field_fit", "bit-manipulation", "Fields", "Field fit", "Decide whether a value fits an unsigned field.", "A w-bit field accepts 0..2^w-1.", "13 fits 4 bits; 16 does not"],
        ["field_expression", "bit-manipulation", "Fields", "Choose a field expression", "Recognize correct extraction or insertion structure.", "Extraction shifts then masks; insertion clears before OR.", "(x >>> lo) & mask"],
        ["programmer_landmark", "address-layout-reasoning", "Landmarks", "Programmer landmarks", "Recognize exact powers of two and their one-less hexadecimal landmarks.", "A 1 followed by k hex zeroes is 2^(4k); one less is a run of F digits.", "0x1000 = 4096; 0x0FFF = 4095"],
        ["base_address_offset", "address-layout-reasoning", "Address Arithmetic", "Base address + offset", "Add a supplied byte offset to an abstract base address.", "Address arithmetic is exact integer arithmetic and does not wrap.", "0x1000 + 0x34 = 0x1034"],
        ["address_distance", "address-layout-reasoning", "Address Arithmetic", "Address distance", "Find the distance or signed displacement between two addresses.", "Subtract the starting address and verify by adding the displacement back.", "0x1200 − 0x1080 = 0x180 bytes"],
        ["alignment_predicate", "address-layout-reasoning", "Alignment", "Alignment predicate", "Decide whether an address is a multiple of an explicitly supplied power of two.", "Aligned means address mod alignment = 0.", "0x1230 is aligned to 16 bytes"],
        ["align_power_two", "address-layout-reasoning", "Alignment", "Align down / up", "Find the closest aligned address at or below or at or above an address.", "Subtract the remainder for down; add its complement for up, unless already aligned.", "0x1237 → down 0x1230, up 0x1240"],
        ["alignment_padding", "address-layout-reasoning", "Alignment", "Alignment padding", "Calculate the smallest padding that makes the next address aligned.", "Padding is 0 when already aligned; otherwise alignment − remainder.", "0x1003 needs 1 byte for 4-byte alignment"],
        ["unit_offset_boundary", "address-layout-reasoning", "Boundaries", "Unit offset & boundary", "Find offsets and containing boundaries under an explicitly supplied unit size.", "Offset = address mod size; base = address − offset.", "0x12D5 in a 64-byte unit: offset 0x15, base 0x12C0"],
        ["range_crosses_boundary", "address-layout-reasoning", "Boundaries", "Range boundary crossing", "Decide whether a positive-length half-open byte range crosses a supplied boundary.", "Compare the containing bases of start and the last touched byte, end − 1.", "[0x1030, 0x1040) does not cross a 64-byte boundary"],
        ["supplied_layout_offset", "address-layout-reasoning", "Layouts", "Supplied layout offsets", "Compute array and field offsets only from a completely supplied layout.", "Use zero-based index × stride plus the stated field offset; never infer hidden padding.", "0x1000 + 3×24 + 8 = 0x1050"],
        ["population_count", "address-layout-reasoning", "Bit Counts & Shapes", "Population count", "Count the 1 bits in a bounded binary or hexadecimal pattern.", "For hexadecimal, count each nibble and add the subtotals.", "popcount(0xB4) = 4"],
        ["mask_shape", "address-layout-reasoning", "Bit Counts & Shapes", "Mask shapes", "Recognize one-hot, contiguous, sparse, and complementary bounded masks.", "Apply the exact stated definition using set-bit count and positions.", "0x20 is one-hot; 0011 1100 is contiguous"],
        ["power_two_remainder", "address-layout-reasoning", "Bit Counts & Shapes", "Power-of-two remainder", "Compute a remainder modulo a supplied power of two using low bits.", "For modulus 2^k, retain the low k bits with mask 2^k−1.", "77 mod 8 = 5; retain low bits 101"],
        ["store_integer_bytes", "memory-representation", "Store", "Store integer bytes", "Write an integer to increasing addresses in big- or little-endian order.", "Endianness reverses byte significance, never bits inside a byte.", "0x1234 little-endian → 34 12"],
        ["load_integer_bytes", "memory-representation", "Load", "Load integer bytes", "Reconstruct a raw value from addressed bytes.", "Select the stated bytes, then apply byte significance.", "34 12 little-endian → 0x1234"],
        ["load_subvalue", "memory-representation", "Subvalue", "Load a subvalue", "Select a byte window at an offset before decoding it.", "Bytes outside the window must not affect the result.", "AA 34 12 BB, offset 1, little 16 → 0x1234"],
        ["signed_load_interpretation", "memory-representation", "Signed load", "Interpret a signed load", "Reconstruct raw bytes first, then interpret two's complement.", "The sign follows the most-significant value byte, not the first displayed byte.", "FE FF little 16 → raw 0xFFFE, signed -2"]
      ];

      var FAMILY_GENERATORS = {};
      var PREREQUISITES = {
        power_landmark: ["power_relation"],
        unsigned_base_conversion: ["binary_hex_grouping"],
        interpret_pattern: ["binary_hex_grouping"],
        encode_fixed_width: ["interpret_pattern"],
        reinterpret_decimal_view: ["interpret_pattern"],
        range_boundary: ["power_relation"],
        representability: ["range_boundary"],
        minimum_width: ["representability"],
        extend_pattern: ["interpret_pattern"],
        truncate_pattern: ["binary_hex_grouping"],
        unsigned_fixed_operation: ["encode_fixed_width"],
        unsigned_missing_operand: ["unsigned_fixed_operation"],
        signed_fixed_operation: ["interpret_pattern", "unsigned_fixed_operation"],
        signed_missing_operand: ["signed_fixed_operation"],
        classify_arithmetic_status: ["unsigned_fixed_operation", "signed_fixed_operation"],
        bitwise_result: ["binary_hex_grouping"],
        xor_missing_operand: ["bitwise_result"],
        identify_bitwise_operator: ["bitwise_result"],
        shift_result: ["bitwise_result"],
        shift_with_carry: ["shift_result"],
        shift_identification: ["shift_result"],
        rotate_result: ["shift_result"],
        rotate_inverse_and_count: ["rotate_result"],
        construct_mask: ["power_relation", "binary_hex_grouping"],
        apply_mask: ["construct_mask", "bitwise_result"],
        test_masked_flags: ["apply_mask"],
        list_or_decode_flags: ["construct_mask"],
        extract_field: ["construct_mask", "shift_result"],
        insert_field: ["extract_field", "apply_mask"],
        field_fit: ["representability"],
        field_expression: ["extract_field"],
        programmer_landmark: ["power_relation", "power_landmark"],
        base_address_offset: ["programmer_landmark"],
        address_distance: ["base_address_offset"],
        alignment_predicate: ["power_relation", "programmer_landmark"],
        align_power_two: ["alignment_predicate"],
        alignment_padding: ["align_power_two"],
        unit_offset_boundary: ["alignment_predicate", "power_two_remainder"],
        range_crosses_boundary: ["unit_offset_boundary"],
        supplied_layout_offset: ["base_address_offset"],
        population_count: ["binary_hex_grouping"],
        mask_shape: ["population_count", "construct_mask"],
        power_two_remainder: ["power_relation", "construct_mask"],
        store_integer_bytes: ["binary_hex_grouping"],
        load_integer_bytes: ["store_integer_bytes"],
        load_subvalue: ["load_integer_bytes"],
        signed_load_interpretation: ["load_integer_bytes", "interpret_pattern"]
      };
      var FAMILIES = FAMILY_INFO.map(function (entry) {
        return {
          id: entry[0],
          categoryId: entry[1],
          subcategoryId: entry[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          subcategory: entry[2],
          title: entry[3],
          learn: { concept: entry[4], rules: entry[5], example: entry[6] },
          levels: LEVELS
        };
      });

      function localizeStaticData() {
        CATEGORIES.forEach(function (category) {
          var labels = t("categories." + category.id, null);
          if (labels) {
            category.title = labels.title || category.title;
            category.short = labels.short || category.short;
          }
        });
        FAMILIES.forEach(function (family) {
          var labels = t("families." + family.id, null);
          if (labels) {
            family.subcategory = labels.subcategory || family.subcategory;
            family.title = labels.title || family.title;
            family.learn.concept = labels.concept || family.learn.concept;
            family.learn.rules = labels.rules || family.learn.rules;
            family.learn.example = labels.example || family.learn.example;
          }
        });
      }

      localizeStaticData();

      function categoryById(id) {
        return CATEGORIES.find(function (category) { return category.id === id; }) || CATEGORIES[0];
      }

      function familyById(id) {
        return FAMILIES.find(function (family) { return family.id === id; }) || FAMILIES[0];
      }

      function familiesForCategory(categoryId) {
        return FAMILIES.filter(function (family) { return family.categoryId === categoryId; });
      }

      function field(id, label, kind, value, options) {
        return { id: id, label: label, kind: kind, value: String(value), options: options || null };
      }

      function prompt(title, rows, note) {
        return { title: title, rows: rows || [], note: note || "" };
      }

      function makeQuestion(familyId, level, width, representation, parameters, promptData, fields, worked, signatureParts, dimensions, misconceptions) {
        var family = familyById(familyId);
        var canonical = {};
        fields.forEach(function (answerField) { canonical[answerField.id] = answerField.value; });
        return {
          categoryId: family.categoryId,
          subcategoryId: family.subcategoryId,
          familyId: familyId,
          level: level,
          width: width,
          representation: representation,
          difficultyDimensions: dimensions || [level <= 2 ? "direct" : "mixed-cue", "width-" + widthBand(width)],
          misconceptionsTargeted: misconceptions || [],
          parameters: parameters,
          canonicalAnswer: canonical,
          structuralSignature: [familyId, widthBand(width)].concat(signatureParts || []).concat([operandShapeSignature(parameters, width)]).join("|"),
          prompt: promptData,
          answer: { fields: fields },
          feedback: {
            correct: family.learn.rules,
            worked: worked
          }
        };
      }

      function operandShapeSignature(parameters, width) {
        if (width === null || width === undefined) return "shape-na";
        var shapes = [];
        Object.keys(parameters).sort().forEach(function (key) {
          var value = parameters[key];
          if (typeof value !== "string" || !/^\d+$/.test(value) || value.length > 22) return;
          try {
            var raw = modulo(BigInt(value), width);
            var count = popcount(raw, width);
            var className = raw === 0n ? "zero" : raw === widthMask(width) ? "all" : count === 1 ? "onehot" : count <= Math.max(2, Math.floor(width / 4)) ? "sparse" : count >= Math.ceil(width * 3 / 4) ? "dense" : "mixed";
            shapes.push(key + ":" + className + ":t" + Number((raw >> BigInt(width - 1)) & 1n) + ":l" + Number(raw & 1n));
          } catch (error) {
            return;
          }
        });
        return shapes.length ? shapes.join(",") : "shape-na";
      }

      function representationForLevel(level, rng) {
        if (level <= 2) return "binary";
        return rng.choice(level >= 4 ? ["binary", "hex", "hex"] : ["binary", "hex"]);
      }

      function patternField(id, label, value, width, representation) {
        if (representation === "hex") return field(id, label, "hexPattern", fixedDigits(value, width, 16), null);
        if (representation === "octal") return field(id, label, "octalPattern", fixedDigits(value, width, 8), null);
        return field(id, label, "binaryPattern", fixedDigits(value, width, 2), null);
      }

      function boolField(id, label, value) {
        return field(id, label, "boolean", value ? "yes" : "no", [
          { value: "yes", label: t("answers.yes", "Yes") },
          { value: "no", label: t("answers.no", "No") }
        ]);
      }

      function choiceField(id, label, value, values) {
        return field(id, label, "choice", value, values.map(function (item) {
          return typeof item === "string" ? { value: item, label: t("choiceLabels." + item, item) } : item;
        }));
      }

      function numericText(value, representation) {
        value = BigInt(value);
        if (representation === "hex") {
          var sign = value < 0n ? "-" : "";
          var magnitude = value < 0n ? -value : value;
          return sign + "0x" + magnitude.toString(16).toUpperCase();
        }
        return value.toString();
      }

      function numericField(id, label, value, representation) {
        return field(id, label, representation === "hex" ? "hexInteger" : "integer", numericText(value, representation));
      }

      function addressRepresentations(level, rng) {
        if (level === 1) {
          var direct = rng.chance(0.5) ? "decimal" : "hex";
          return { shown: direct, answer: direct };
        }
        var shown = rng.chance(level >= 3 ? 0.65 : 0.5) ? "hex" : "decimal";
        return { shown: shown, answer: level >= 3 && rng.chance(0.35) ? (shown === "hex" ? "decimal" : "hex") : shown };
      }

      function integerLog2(value) {
        var exponent = 0;
        var current = BigInt(value);
        while (current > 1n) {
          current >>= 1n;
          exponent += 1;
        }
        return exponent;
      }

      function randomNontrivial(rng, width) {
        var value = rng.bigint(width);
        if (value === 0n || value === widthMask(width)) value ^= 1n << BigInt(rng.int(0, width - 1));
        return value;
      }

      FAMILY_GENERATORS.power_relation = function (level, rng) {
        var maxima = { 1: 8, 2: 16, 3: 32, 4: 48, 5: 63 };
        var k = rng.int(level === 1 ? 1 : 0, maxima[level]);
        var value = 1n << BigInt(k);
        var variant = level >= 3 ? rng.choice(["value", "exponent", "position"]) : rng.choice(["value", "exponent"]);
        if (variant === "value" && k > 20) variant = "exponent";
        var title = variant === "value" ? "What decimal value does this bit contribute?" : variant === "position" ? "Which bit position is set?" : "Find n.";
        var row = variant === "value" ? "bit " + k : variant === "position" ? hex(value, Math.ceil((k + 1) / 4) * 4) : "2^n = " + value;
        var answer = variant === "value" ? value : BigInt(k);
        return makeQuestion("power_relation", level, Math.max(4, k + 1), variant === "position" ? "hex" : "decimal", { exponent: k, value: value.toString(), variant: variant }, prompt(title, [row], "Bit 0 is the rightmost bit."), [field("answer", "Answer", "integer", answer)], "Bit " + k + " has weight 2^" + k + " = " + value + ".", [variant, k <= 8 ? "small" : "landmark"], ["inverse-cue"], ["position-value-confusion"]);
      };

      FAMILY_GENERATORS.power_landmark = function (level, rng) {
        var exponent = rng.int(3, level <= 2 ? 12 : level <= 4 ? 24 : 40);
        var lower = 1n << BigInt(exponent);
        var upper = lower << 1n;
        var offset = BigInt(rng.int(1, 7)) * (lower / 8n || 1n);
        if (offset >= lower) offset = lower - 1n;
        var value = lower + offset;
        var variant = level >= 3 && rng.chance(0.45) ? "ceil" : "bracket";
        if (variant === "ceil") {
          return makeQuestion("power_landmark", level, exponent + 2, "decimal", { value: value.toString(), exponent: exponent }, prompt("Find the smallest power of two at least this large.", [String(value)], "Enter the exponent n in 2^n."), [field("exponent", "n", "integer", exponent + 1)], "2^" + exponent + " = " + lower + " is too small; 2^" + (exponent + 1) + " = " + upper + ".", ["ceil", "above-power"], ["boundary-proximity"], ["nearest-vs-at-least"]);
        }
        return makeQuestion("power_landmark", level, exponent + 2, "decimal", { value: value.toString(), lowerExponent: exponent, upperExponent: exponent + 1 }, prompt("Bracket this value with consecutive powers of two.", [String(value)], "Enter both exponents."), [field("lower", "Lower exponent", "integer", exponent), field("upper", "Upper exponent", "integer", exponent + 1)], "2^" + exponent + " = " + lower + " < " + value + " < " + upper + " = 2^" + (exponent + 1) + ".", ["bracket", "between"], ["two-boundaries"], ["nearest-power-substitution"]);
      };

      FAMILY_GENERATORS.binary_hex_grouping = function (level, rng) {
        var width = widthForLevel(level, rng);
        width = Math.ceil(width / 4) * 4;
        var value = randomNontrivial(rng, width);
        var direction = rng.chance(0.5) ? "binary-to-hex" : "hex-to-binary";
        if (direction === "binary-to-hex") {
          return makeQuestion("binary_hex_grouping", level, width, "binary-to-hex", { value: value.toString() }, prompt("Convert this exact-width binary pattern to hexadecimal.", [bin(value, width)], "Keep all " + digitsFor(width, 16) + " hex digits."), [patternField("pattern", "Hex pattern", value, width, "hex")], "Group from the right in fours: " + bin(value, width) + " = " + hex(value, width) + ".", [direction, "digits-" + digitsFor(width, 16)], ["group-count"], ["dropped-leading-zero"]);
        }
        return makeQuestion("binary_hex_grouping", level, width, "hex-to-binary", { value: value.toString() }, prompt("Expand this hexadecimal pattern to exactly " + width + " bits.", [hex(value, width)], "Each hex digit becomes four bits."), [patternField("pattern", "Binary pattern", value, width, "binary")], hex(value, width) + " expands nibble by nibble to " + bin(value, width) + ".", [direction, "digits-" + digitsFor(width, 16)], ["group-count"], ["dropped-leading-zero"]);
      };

      FAMILY_GENERATORS.binary_octal_grouping = function (level, rng) {
        var widths = level <= 2 ? [6, 9, 12] : level <= 4 ? [12, 15, 18] : [24, 48];
        var width = rng.choice(widths);
        var value = randomNontrivial(rng, width);
        var direction = rng.chance(0.5) ? "binary-to-octal" : "octal-to-binary";
        if (direction === "binary-to-octal") {
          return makeQuestion("binary_octal_grouping", level, width, "binary-to-octal", { value: value.toString() }, prompt("Convert this binary pattern to fixed-width octal.", [bin(value, width)], "Group three bits per octal digit."), [patternField("pattern", "Octal pattern", value, width, "octal")], bin(value, width) + " = " + oct(value, width) + ".", [direction], ["optional-representation"], ["groups-of-four-in-octal"]);
        }
        return makeQuestion("binary_octal_grouping", level, width, "octal-to-binary", { value: value.toString() }, prompt("Expand this octal pattern to exactly " + width + " bits.", [oct(value, width)], "Each octal digit becomes three bits."), [patternField("pattern", "Binary pattern", value, width, "binary")], oct(value, width) + " = " + bin(value, width) + ".", [direction], ["optional-representation"], ["groups-of-four-in-octal"]);
      };

      FAMILY_GENERATORS.unsigned_base_conversion = function (level, rng) {
        var width = widthForLevel(level, rng);
        var value = randomNontrivial(rng, width);
        var variants = level === 1 ? ["decimal-to-binary", "binary-to-decimal"] : ["decimal-to-binary", "binary-to-decimal", "decimal-to-hex", "hex-to-decimal"];
        var variant = rng.choice(variants);
        var source = variant.indexOf("decimal-to") === 0 ? String(value) : variant === "binary-to-decimal" ? bin(value, width) : hex(value, width);
        var target = variant.split("-to-")[1];
        var answer = target === "decimal" ? field("answer", "Unsigned decimal", "integer", value) : patternField("pattern", target === "binary" ? "Binary pattern" : "Hex pattern", value, width, target);
        return makeQuestion("unsigned_base_conversion", level, width, variant, { value: value.toString(), source: variant.split("-to-")[0], target: target }, prompt("Convert this unsigned " + variant.split("-to-")[0] + " value to " + target + ".", [source], target === "decimal" ? "Enter a numeric value." : "Enter an exact " + width + "-bit pattern."), [answer], "All forms have unsigned value " + value + ": " + bin(value, width) + " = " + hex(value, width) + ".", [variant], ["mixed-representation"], ["pattern-vs-value"]);
      };

      FAMILY_GENERATORS.interpret_pattern = function (level, rng) {
        var width = widthForLevel(level, rng);
        var raw = randomNontrivial(rng, width);
        if (level >= 2 && rng.chance(0.65)) raw |= 1n << BigInt(width - 1);
        return makeQuestion("interpret_pattern", level, width, "binary", { raw: raw.toString() }, prompt("Interpret this " + width + "-bit pattern both ways.", [bin(raw, width)], "Give unsigned and two's-complement decimal values."), [field("unsigned", "Unsigned", "integer", raw), field("signed", "Signed", "integer", toSigned(raw, width))], "Unsigned is " + raw + ". The top bit is " + ((raw >> BigInt(width - 1)) & 1n) + ", so signed is " + toSigned(raw, width) + ".", ["top-" + Number(raw >> BigInt(width - 1))], ["dual-interpretation"], ["sign-magnitude"]);
      };

      FAMILY_GENERATORS.encode_fixed_width = function (level, rng) {
        var width = widthForLevel(level, rng);
        var signed = level >= 2 && rng.chance(0.6);
        var raw = randomNontrivial(rng, width);
        var value = signed ? toSigned(raw, width) : raw;
        var representation = representationForLevel(level, rng);
        return makeQuestion("encode_fixed_width", level, width, representation, { value: value.toString(), signed: signed }, prompt("Encode this " + (signed ? "signed two's-complement" : "unsigned") + " value as an exact " + width + "-bit " + representation + " pattern.", [String(value)], "Leading zeroes are required."), [patternField("pattern", representation === "hex" ? "Hex pattern" : "Binary pattern", raw, width, representation)], "Modulo 2^" + width + ", the raw pattern is " + displayValue(raw, width, representation) + ".", [signed ? "signed" : "unsigned", representation], ["inverse"], ["missing-leading-zero"]);
      };

      FAMILY_GENERATORS.reinterpret_decimal_view = function (level, rng) {
        var width = widthForLevel(level, rng);
        var raw = rng.bigint(width) | (1n << BigInt(width - 1));
        var direction = rng.chance(0.5) ? "unsigned-to-signed" : "signed-to-unsigned";
        var source = direction === "unsigned-to-signed" ? raw : toSigned(raw, width);
        var answer = direction === "unsigned-to-signed" ? toSigned(raw, width) : raw;
        return makeQuestion("reinterpret_decimal_view", level, width, "decimal", { raw: raw.toString(), direction: direction }, prompt("Reinterpret the same " + width + " raw bits without changing them.", [(direction === "unsigned-to-signed" ? "unsigned " : "signed ") + source], "Enter the " + (direction === "unsigned-to-signed" ? "signed" : "unsigned") + " decimal view."), [field("answer", "Decimal view", "integer", answer)], "The raw pattern is " + bin(raw, width) + "; its other view is " + answer + ".", [direction, "top-set"], ["inverse"], ["numeric-conversion-instead-of-reinterpretation"]);
      };

      FAMILY_GENERATORS.range_boundary = function (level, rng) {
        var width = widthForLevel(level, rng);
        var type = rng.choice(level === 1 ? ["unsigned-max", "signed-min", "signed-max"] : ["unsigned-max", "signed-min", "signed-max", "pattern-count"]);
        var value = type === "unsigned-max" ? widthMask(width) : type === "signed-min" ? signedMin(width) : type === "signed-max" ? signedMax(width) : 1n << BigInt(width);
        var label = type === "pattern-count" ? "number of distinct patterns" : type.replace("-", " ");
        return makeQuestion("range_boundary", level, width, "decimal", { boundary: type }, prompt("For a " + width + "-bit integer, give the " + label + ".", [], "Enter decimal."), [field("answer", "Answer", "integer", value)], "This boundary follows from 2^" + width + " raw patterns; the answer is " + value + ".", [type], ["boundary-recall"], ["off-by-one"]);
      };

      FAMILY_GENERATORS.representability = function (level, rng) {
        var width = widthForLevel(level, rng);
        var signed = rng.chance(0.55);
        var low = signed ? signedMin(width) : 0n;
        var high = signed ? signedMax(width) : widthMask(width);
        var cases = ["inside", "low", "high", "below", "above"];
        var caseClass = rng.choice(cases);
        var value = caseClass === "low" ? low : caseClass === "high" ? high : caseClass === "below" ? low - BigInt(rng.int(1, 3)) : caseClass === "above" ? high + BigInt(rng.int(1, 3)) : low + BigInt(rng.int(1, Number(high - low > 1000n ? 1000n : high - low)));
        var fits = value >= low && value <= high;
        return makeQuestion("representability", level, width, "decimal", { signed: signed, value: value.toString(), caseClass: caseClass }, prompt("Does this decimal value fit in " + width + "-bit " + (signed ? "two's-complement signed" : "unsigned") + " form?", [String(value)], "The endpoints count as representable."), [boolField("fits", "Fits?", fits)], "The permitted range is " + low + ".." + high + "; " + value + (fits ? " is inside it." : " is outside it."), [signed ? "signed" : "unsigned", caseClass], ["boundary"], ["exclusive-endpoint"]);
      };

      FAMILY_GENERATORS.minimum_width = function (level, rng) {
        var signed = rng.chance(0.55);
        var targetWidth = rng.int(1, level === 1 ? 8 : level === 2 ? 12 : level === 3 ? 20 : level === 4 ? 32 : 63);
        var boundary = rng.choice(["min", "max", "near"]);
        var value;
        if (signed) {
          value = boundary === "min" ? signedMin(targetWidth) : boundary === "max" ? signedMax(targetWidth) : signedMax(targetWidth - 1 < 1 ? 1 : targetWidth - 1) + 1n;
          targetWidth = minimumSignedWidth(value);
        } else {
          value = boundary === "min" ? (targetWidth === 1 ? 0n : 1n << BigInt(targetWidth - 1)) : boundary === "max" ? (1n << BigInt(targetWidth)) - 1n : (1n << BigInt(targetWidth - 1)) + 1n;
          targetWidth = minimumUnsignedWidth(value);
        }
        return makeQuestion("minimum_width", level, targetWidth, "decimal", { signed: signed, value: value.toString(), boundary: boundary }, prompt("What is the minimum bit width for this " + (signed ? "two's-complement signed" : "unsigned") + " value?", [String(value)], "Enter a number of bits."), [field("width", "Bits", "integer", targetWidth)], "At " + targetWidth + " bits the relevant range first includes " + value + ".", [signed ? "signed" : "unsigned", boundary], ["inverse-boundary"], ["unsigned-width-used-for-signed"]);
      };

      FAMILY_GENERATORS.extend_pattern = function (level, rng) {
        var sourceWidth = rng.choice(level <= 2 ? [4, 8] : [4, 8, 12, 16]);
        var destinationWidth = rng.choice([sourceWidth + 4, sourceWidth + 8, Math.min(64, sourceWidth * 2)].filter(function (width, index, array) { return width <= 64 && array.indexOf(width) === index; }));
        var raw = randomNontrivial(rng, sourceWidth);
        var signed = rng.chance(0.55);
        if (signed && level >= 2) raw |= 1n << BigInt(sourceWidth - 1);
        var extended = signed && (raw & (1n << BigInt(sourceWidth - 1)))
          ? raw | (widthMask(destinationWidth) ^ widthMask(sourceWidth))
          : raw;
        var representation = level >= 4 && rng.chance(0.5) ? "hex" : "binary";
        return makeQuestion("extend_pattern", level, destinationWidth, representation, { sourceWidth: sourceWidth, destinationWidth: destinationWidth, signed: signed, raw: raw.toString() }, prompt((signed ? "Sign" : "Zero") + "-extend this " + sourceWidth + "-bit pattern to " + destinationWidth + " bits.", [displayValue(raw, sourceWidth, representation)], signed ? "Preserve its signed value." : "Preserve its unsigned value."), [patternField("pattern", "Extended pattern", extended, destinationWidth, representation)], (signed ? "Copy the sign bit" : "Fill high bits with zero") + ": " + displayValue(extended, destinationWidth, representation) + ".", [signed ? "sign" : "zero", "top-" + Number(raw >> BigInt(sourceWidth - 1))], ["width-change"], ["wrong-extension-kind"]);
      };

      FAMILY_GENERATORS.truncate_pattern = function (level, rng) {
        var destinationWidth = rng.choice(level <= 2 ? [4, 8] : [8, 12, 16]);
        var sourceWidth = Math.min(64, destinationWidth + rng.choice([4, 8, 16]));
        var raw = randomNontrivial(rng, sourceWidth);
        var result = raw & widthMask(destinationWidth);
        var representation = level >= 3 && rng.chance(0.5) ? "hex" : "binary";
        var fields = [patternField("pattern", "Truncated pattern", result, destinationWidth, representation)];
        if (level >= 4) fields.push(field("unsigned", "Unsigned decimal", "integer", result));
        return makeQuestion("truncate_pattern", level, destinationWidth, representation, { sourceWidth: sourceWidth, destinationWidth: destinationWidth, raw: raw.toString() }, prompt("Truncate this " + sourceWidth + "-bit pattern to " + destinationWidth + " bits.", [displayValue(raw, sourceWidth, representation)], "Keep only the low " + destinationWidth + " bits."), fields, "Modulo 2^" + destinationWidth + ", the retained pattern is " + displayValue(result, destinationWidth, representation) + ".", ["truncate", representation], ["modulo"], ["keeping-high-bits"]);
      };

      function arithmeticOperands(level, width, rng, signed) {
        var modulus = 1n << BigInt(width);
        var operation = rng.chance(0.5) ? "add" : "subtract";
        var a;
        var b;
        if (signed) {
          var classes = ["none", "above", "below"];
          var target = rng.choice(classes);
          var lo = signedMin(width);
          var hi = signedMax(width);
          if (target === "above") {
            operation = "add";
            a = hi - BigInt(rng.int(0, 3));
            b = BigInt(rng.int(1, 4));
            if (a + b <= hi) b = hi - a + 1n;
          } else if (target === "below") {
            operation = rng.chance(0.5) ? "add" : "subtract";
            a = lo + BigInt(rng.int(0, 3));
            b = operation === "add" ? -BigInt(rng.int(1, 4)) : BigInt(rng.int(1, 4));
            if ((operation === "add" ? a + b : a - b) >= lo) b = operation === "add" ? lo - a - 1n : a - lo + 1n;
          } else {
            a = BigInt(rng.int(-Math.min(100, Number(-lo)), Math.min(100, Number(hi))));
            b = BigInt(rng.int(-Math.min(30, Number(-lo)), Math.min(30, Number(hi))));
          }
          return { operation: operation, aRaw: modulo(a, width), bRaw: modulo(b, width), exact: operation === "add" ? a + b : a - b };
        }
        a = rng.bigint(width);
        b = rng.bigint(width);
        if (level <= 2) {
          var smallMax = Math.min(15, Number(widthMask(width)));
          a = BigInt(rng.int(0, smallMax));
          b = BigInt(rng.int(0, smallMax));
        }
        return { operation: operation, aRaw: a, bRaw: b, exact: operation === "add" ? a + b : a - b, modulus: modulus };
      }

      FAMILY_GENERATORS.unsigned_fixed_operation = function (level, rng) {
        var width = compactWidth(level, rng);
        var data = arithmeticOperands(level, width, rng, false);
        var result = modulo(data.exact, width);
        var status = data.operation === "add" ? data.exact >= (1n << BigInt(width)) : data.aRaw < data.bRaw;
        var representation = representationForLevel(level, rng);
        var statusName = data.operation === "add" ? "Carry-out?" : "Borrow?";
        return makeQuestion("unsigned_fixed_operation", level, width, representation, { operation: data.operation, left: data.aRaw.toString(), right: data.bRaw.toString(), exact: data.exact.toString() }, prompt(width + "-bit unsigned " + data.operation + ".", [displayValue(data.aRaw, width, representation) + (data.operation === "add" ? " + " : " − ") + displayValue(data.bRaw, width, representation)], "Give the wrapped pattern and " + statusName.toLowerCase()), [patternField("result", "Wrapped result", result, width, representation), boolField("status", statusName, status)], "The exact result is " + data.exact + "; wrapped result " + displayValue(result, width, representation) + ", " + statusName.toLowerCase() + " " + (status ? "yes" : "no") + ".", [data.operation, status ? "status-yes" : "status-no", representation], ["carry-chain", "status"], ["signed-range-applied-to-unsigned"]);
      };

      FAMILY_GENERATORS.unsigned_missing_operand = function (level, rng) {
        var width = compactWidth(level, rng);
        var x = randomNontrivial(rng, width);
        var known = randomNontrivial(rng, width);
        var operation = rng.chance(0.5) ? "add" : "subtract";
        var result = operation === "add" ? modulo(x + known, width) : modulo(x - known, width);
        var representation = representationForLevel(level, rng);
        return makeQuestion("unsigned_missing_operand", level, width, representation, { operation: operation, known: known.toString(), result: result.toString() }, prompt("Find x in this wrapped " + width + "-bit unsigned equation.", ["x " + (operation === "add" ? "+" : "−") + " " + displayValue(known, width, representation) + " = " + displayValue(result, width, representation)], "All patterns are exactly " + width + " bits."), [patternField("x", "x", x, width, representation)], operation === "add" ? "Subtract the known operand modulo 2^" + width + ": x = " + displayValue(x, width, representation) + "." : "Add the known operand modulo 2^" + width + ": x = " + displayValue(x, width, representation) + ".", [operation, representation], ["inverse"], ["ordinary-negative-instead-of-wrap"]);
      };

      FAMILY_GENERATORS.signed_fixed_operation = function (level, rng) {
        var width = compactWidth(level, rng);
        var data = arithmeticOperands(level, width, rng, true);
        var result = modulo(data.exact, width);
        var overflow = data.exact > signedMax(width) ? "above" : data.exact < signedMin(width) ? "below" : "none";
        var representation = representationForLevel(level, rng);
        return makeQuestion("signed_fixed_operation", level, width, representation, { operation: data.operation, leftRaw: data.aRaw.toString(), rightRaw: data.bRaw.toString(), exact: data.exact.toString() }, prompt(width + "-bit two's-complement " + data.operation + ".", [displayValue(data.aRaw, width, representation) + (data.operation === "add" ? " + " : " − ") + displayValue(data.bRaw, width, representation)], "Give result bits and signed overflow direction."), [patternField("result", "Wrapped result", result, width, representation), choiceField("overflow", "Signed overflow", overflow, ["none", "above", "below"])], "Decoded operands are " + toSigned(data.aRaw, width) + " and " + toSigned(data.bRaw, width) + ". Exact result " + data.exact + " versus " + signedMin(width) + ".." + signedMax(width) + " gives " + overflow + ".", [data.operation, overflow, representation], ["signed-range", "status"], ["carry-equals-overflow", "signed-underflow-term"]);
      };

      FAMILY_GENERATORS.signed_missing_operand = function (level, rng) {
        var width = compactWidth(level, rng);
        var x = randomNontrivial(rng, width);
        var known = randomNontrivial(rng, width);
        var operation = rng.chance(0.5) ? "add" : "subtract";
        var result = operation === "add" ? modulo(x + known, width) : modulo(x - known, width);
        var representation = representationForLevel(level, rng);
        var fields = [patternField("x", "x pattern", x, width, representation)];
        if (level >= 4) fields.push(field("signed", "x as signed decimal", "integer", toSigned(x, width)));
        return makeQuestion("signed_missing_operand", level, width, representation, { operation: operation, known: known.toString(), result: result.toString() }, prompt("Find x in this " + width + "-bit two's-complement equation.", ["x " + (operation === "add" ? "+" : "−") + " " + displayValue(known, width, representation) + " = " + displayValue(result, width, representation)], "Solve the raw modulo equation first."), fields, "The raw solution is " + displayValue(x, width, representation) + ", interpreted as signed " + toSigned(x, width) + ".", [operation, representation], ["inverse", "signed-view"], ["solving-only-decoded-decimal"]);
      };

      FAMILY_GENERATORS.classify_arithmetic_status = function (level, rng) {
        var width = compactWidth(level, rng);
        var operation = rng.chance(0.55) ? "add" : "subtract";
        var caseClass = rng.choice(["unsigned-only", "signed-only", "both", "neither"]);
        var a;
        var b;
        var signBit = 1n << BigInt(width - 1);
        if (operation === "add") {
          if (caseClass === "unsigned-only") { a = widthMask(width); b = 1n; }
          if (caseClass === "signed-only") { a = signedMax(width); b = 1n; }
          if (caseClass === "both") { a = signBit; b = signBit; }
          if (caseClass === "neither") {
            var addSmallMax = Math.max(1, Math.min(7, Number(signedMax(width) / 2n)));
            a = BigInt(rng.int(1, addSmallMax));
            b = 1n;
          }
        } else {
          if (caseClass === "unsigned-only") { a = 0n; b = widthMask(width); }
          if (caseClass === "signed-only") { a = signBit; b = 1n; }
          if (caseClass === "both") { a = signedMax(width); b = signBit; }
          if (caseClass === "neither") {
            var subtractSmallMax = Math.max(2, Math.min(9, Number(signedMax(width))));
            a = BigInt(rng.int(2, subtractSmallMax));
            b = 1n;
          }
        }
        var unsignedExact = operation === "add" ? a + b : a - b;
        var signedExact = operation === "add" ? toSigned(a, width) + toSigned(b, width) : toSigned(a, width) - toSigned(b, width);
        var result = modulo(unsignedExact, width);
        var carry = operation === "add" && unsignedExact >= (1n << BigInt(width));
        var borrow = operation === "subtract" && a < b;
        var overflow = signedExact > signedMax(width) ? "above" : signedExact < signedMin(width) ? "below" : "none";
        var representation = representationForLevel(level, rng);
        var fields = [patternField("result", "Wrapped result", result, width, representation)];
        fields.push(operation === "add" ? boolField("carry", "Unsigned carry-out", carry) : boolField("borrow", "Unsigned borrow", borrow));
        fields.push(choiceField("overflow", "Signed overflow", overflow, ["none", "above", "below"]));
        var unsignedStatusText = operation === "add" ? "carry " + (carry ? "yes" : "no") : "borrow " + (borrow ? "yes" : "no");
        var worked = "unsigned: " + a + (operation === "add" ? " + " : " − ") + b + " = " + unsignedExact + " → " + unsignedStatusText + ". signed: " + toSigned(a, width) + (operation === "add" ? " + " : " − ") + toSigned(b, width) + " = " + signedExact + " → overflow " + overflow + ".";
        return makeQuestion("classify_arithmetic_status", level, width, representation, { operation: operation, caseClass: caseClass, left: a.toString(), right: b.toString(), unsignedExact: unsignedExact.toString(), signedExact: signedExact.toString() }, prompt("Classify this raw " + width + "-bit operation.", [displayValue(a, width, representation) + (operation === "add" ? " + " : " − ") + displayValue(b, width, representation)], "Unsigned and signed status are separate."), fields, worked, [operation, caseClass, "s-" + overflow], ["joint-status"], ["carry-equals-overflow"]);
      };

      FAMILY_GENERATORS.bitwise_result = function (level, rng) {
        var width = widthForLevel(level, rng);
        var operation = rng.choice(level === 1 ? ["AND", "OR", "XOR"] : ["AND", "OR", "XOR", "NOT"]);
        var a = randomNontrivial(rng, width);
        var b = randomNontrivial(rng, width);
        var result = operation === "AND" ? a & b : operation === "OR" ? a | b : operation === "XOR" ? a ^ b : (~a) & widthMask(width);
        var representation = representationForLevel(level, rng);
        var expression = operation === "NOT" ? "~" + displayValue(a, width, representation) : displayValue(a, width, representation) + " " + (operation === "AND" ? "&" : operation === "OR" ? "|" : "^") + " " + displayValue(b, width, representation);
        return makeQuestion("bitwise_result", level, width, representation, { operation: operation, left: a.toString(), right: operation === "NOT" ? null : b.toString() }, prompt("Compute this width-bounded " + operation + ".", [expression], "The result remains exactly " + width + " bits."), [patternField("result", "Result", result, width, representation)], "Apply " + operation + " per column. Result: " + displayValue(result, width, representation) + ".", [operation, representation], ["active-columns"], ["xor-as-or", "unbounded-not"]);
      };

      FAMILY_GENERATORS.xor_missing_operand = function (level, rng) {
        var width = widthForLevel(level, rng);
        var a = randomNontrivial(rng, width);
        var x = randomNontrivial(rng, width);
        var result = a ^ x;
        var representation = representationForLevel(level, rng);
        return makeQuestion("xor_missing_operand", level, width, representation, { left: a.toString(), result: result.toString() }, prompt("Find x.", [displayValue(a, width, representation) + " XOR x = " + displayValue(result, width, representation)], "Use the same width throughout."), [patternField("x", "x", x, width, representation)], "XOR both sides with the known operand: x = " + displayValue(a, width, representation) + " XOR " + displayValue(result, width, representation) + " = " + displayValue(x, width, representation) + ".", ["inverse", representation], ["inverse"], ["xor-as-or"]);
      };

      FAMILY_GENERATORS.identify_bitwise_operator = function (level, rng) {
        var width = compactWidth(level, rng);
        var operation = rng.choice(["AND", "OR", "XOR"]);
        var a;
        var b;
        var result;
        var attempts = 0;
        do {
          a = randomNontrivial(rng, width);
          b = randomNontrivial(rng, width);
          result = operation === "AND" ? a & b : operation === "OR" ? a | b : a ^ b;
          attempts += 1;
        } while (attempts < 100 && ["AND", "OR", "XOR"].filter(function (op) {
          return (op === "AND" ? a & b : op === "OR" ? a | b : a ^ b) === result;
        }).length !== 1);
        return makeQuestion("identify_bitwise_operator", level, width, "binary", { left: a.toString(), right: b.toString(), result: result.toString() }, prompt("Which bitwise operator makes this equation true?", [bin(a, width) + "  ?  " + bin(b, width) + "  =  " + bin(result, width)], "Choose one operator."), [choiceField("operator", "Operator", operation, ["AND", "OR", "XOR"])], "Columns containing 11 and differing bits distinguish the operators; here it is " + operation + ".", [operation, "decisive"], ["rule-recognition"], ["xor-as-or"]);
      };

      function shiftValue(raw, width, kind, count) {
        if (kind === "left") return modulo(raw << BigInt(count), width);
        if (kind === "logical-right") return raw >> BigInt(count);
        return modulo(toSigned(raw, width) >> BigInt(count), width);
      }

      function shiftCarry(raw, width, kind, count) {
        if (kind === "left") return Number((raw >> BigInt(width - count)) & 1n);
        return Number((raw >> BigInt(count - 1)) & 1n);
      }

      function shiftSymbol(kind) {
        return kind === "left" ? "<<" : kind === "logical-right" ? ">>>" : "ASR";
      }

      FAMILY_GENERATORS.shift_result = function (level, rng) {
        var width = widthForLevel(level, rng);
        var raw = randomNontrivial(rng, width);
        var kind = rng.choice(level === 1 ? ["left", "logical-right"] : ["left", "logical-right", "arithmetic-right"]);
        if (kind === "arithmetic-right" && level >= 2) raw |= 1n << BigInt(width - 1);
        var count = rng.int(1, Math.min(width - 1, level <= 2 ? 2 : level === 3 ? 4 : Math.floor(width / 2)));
        var result = shiftValue(raw, width, kind, count);
        var representation = representationForLevel(level, rng);
        return makeQuestion("shift_result", level, width, representation, { raw: raw.toString(), kind: kind, count: count }, prompt("Compute this " + width + "-bit shift.", [displayValue(raw, width, representation) + " " + shiftSymbol(kind) + " " + count], "<< fills low bits with zero; >>> fills high bits with zero; ASR copies the sign bit."), [patternField("result", "Result", result, width, representation)], "After " + kind + " by " + count + ", the result is " + displayValue(result, width, representation) + ".", [kind, "count-" + (count === 1 ? "one" : "multi"), representation], ["fill-rule"], ["shift-as-rotate", "logical-vs-arithmetic"]);
      };

      FAMILY_GENERATORS.shift_with_carry = function (level, rng) {
        var width = compactWidth(level, rng);
        var raw = randomNontrivial(rng, width);
        var kind = rng.choice(level <= 2 ? ["left", "logical-right"] : ["left", "logical-right", "arithmetic-right"]);
        if (kind === "arithmetic-right") raw |= 1n << BigInt(width - 1);
        var count = rng.int(1, Math.min(width - 1, level <= 2 ? 2 : 5));
        var result = shiftValue(raw, width, kind, count);
        var carry = shiftCarry(raw, width, kind, count);
        return makeQuestion("shift_with_carry", level, width, "binary", { raw: raw.toString(), kind: kind, count: count }, prompt("Shift and report the last bit shifted out.", [bin(raw, width) + " " + shiftSymbol(kind) + " " + count], "Carry is one bit: the final discarded bit."), [patternField("result", "Result", result, width, "binary"), choiceField("carry", "Carry-out", String(carry), ["0", "1"])], "The result is " + bin(result, width) + ". The last bit shifted out is " + carry + ".", [kind, "count-" + (count === 1 ? "one" : "multi"), "carry-" + carry], ["discarded-ribbon"], ["or-of-discarded-bits"]);
      };

      FAMILY_GENERATORS.shift_identification = function (level, rng) {
        var width = compactWidth(level, rng);
        var raw = randomNontrivial(rng, width);
        var kinds = level === 1 ? ["left", "logical-right"] : ["left", "logical-right", "arithmetic-right"];
        var kind = rng.choice(kinds);
        if (kind === "arithmetic-right") raw |= 1n << BigInt(width - 1);
        var count = rng.int(1, Math.min(width - 1, level <= 2 ? 2 : 4));
        var result = shiftValue(raw, width, kind, count);
        var candidates = [];
        kinds.forEach(function (candidateKind) {
          for (var candidateCount = 1; candidateCount <= Math.min(width - 1, 4); candidateCount += 1) {
            if (shiftValue(raw, width, candidateKind, candidateCount) === result) candidates.push(candidateKind + ":" + candidateCount);
          }
        });
        if (candidates.length !== 1) return FAMILY_GENERATORS.shift_identification(level, rng);
        return makeQuestion("shift_identification", level, width, "binary", { raw: raw.toString(), result: result.toString() }, prompt("Identify the unique shift.", [bin(raw, width) + "  →  " + bin(result, width)], "Counts are 1.." + Math.min(width - 1, 4) + "."), [choiceField("kind", "Shift kind", kind, kinds), field("count", "Count", "integer", count)], "The fill and discarded edge identify " + shiftSymbol(kind) + " " + count + ".", [kind, "count-" + count], ["inverse"], ["shift-as-rotate"]);
      };

      function rotateLeft(raw, width, count) {
        count %= width;
        return modulo((raw << BigInt(count)) | (raw >> BigInt(width - count)), width);
      }

      function rotateRight(raw, width, count) {
        count %= width;
        return modulo((raw >> BigInt(count)) | (raw << BigInt(width - count)), width);
      }

      FAMILY_GENERATORS.rotate_result = function (level, rng) {
        var width = widthForLevel(level, rng);
        var raw = randomNontrivial(rng, width);
        var direction = rng.chance(0.5) ? "ROL" : "ROR";
        var count = rng.int(1, Math.min(width - 1, level <= 2 ? 2 : level === 3 ? 4 : width - 1));
        var result = direction === "ROL" ? rotateLeft(raw, width, count) : rotateRight(raw, width, count);
        var representation = representationForLevel(level, rng);
        return makeQuestion("rotate_result", level, width, representation, { raw: raw.toString(), direction: direction, count: count }, prompt("Compute this " + width + "-bit rotation.", [direction + "(" + displayValue(raw, width, representation) + ", " + count + ")"], "Bits leaving one edge re-enter at the other."), [patternField("result", "Result", result, width, representation)], direction + " by " + count + " gives " + displayValue(result, width, representation) + ".", [direction, "count-" + (count === 1 ? "one" : "multi"), representation], ["wraparound"], ["rotate-as-shift"]);
      };

      FAMILY_GENERATORS.rotate_inverse_and_count = function (level, rng) {
        var width = compactWidth(level, rng);
        var raw;
        var count;
        var direction;
        var result;
        var matches;
        do {
          raw = randomNontrivial(rng, width);
          direction = rng.chance(0.5) ? "ROL" : "ROR";
          count = rng.int(1, Math.max(1, Math.floor((width - 1) / 2)));
          result = direction === "ROL" ? rotateLeft(raw, width, count) : rotateRight(raw, width, count);
          matches = [];
          ["ROL", "ROR"].forEach(function (candidateDirection) {
            for (var candidateCount = 1; candidateCount < width; candidateCount += 1) {
              var candidate = candidateDirection === "ROL" ? rotateLeft(raw, width, candidateCount) : rotateRight(raw, width, candidateCount);
              if (candidate === result) matches.push(candidateDirection + ":" + candidateCount);
            }
          });
        } while (matches.filter(function (item) { return Number(item.split(":")[1]) <= width / 2; }).length !== 1);
        return makeQuestion("rotate_inverse_and_count", level, width, "binary", { raw: raw.toString(), result: result.toString() }, prompt("Find the shortest rotation mapping source to result.", [bin(raw, width) + "  →  " + bin(result, width)], "Choose direction and the smallest positive count."), [choiceField("direction", "Direction", direction, ["ROL", "ROR"]), field("count", "Count", "integer", count)], direction + " " + count + " maps the source to the result. The opposite-direction equivalent is longer.", [direction, "minimal-" + count], ["inverse", "equivalent-count"], ["shift-instead-of-rotate"]);
      };

      function rangeMask(hi, lo) {
        return ((1n << BigInt(hi - lo + 1)) - 1n) << BigInt(lo);
      }

      FAMILY_GENERATORS.construct_mask = function (level, rng) {
        var width = widthForLevel(level, rng);
        var variant = rng.choice(level === 1 ? ["single", "range"] : ["single", "range", "positions"]);
        var positions = [];
        var result = 0n;
        var description;
        if (variant === "single") {
          positions = [rng.int(0, width - 1)];
          result = 1n << BigInt(positions[0]);
          description = "only bit " + positions[0] + " set";
        } else if (variant === "range") {
          var lo = rng.int(0, width - 2);
          var hi = rng.int(lo + 1, Math.min(width - 1, lo + Math.max(1, Math.floor(width / 2))));
          positions = [lo, hi];
          result = rangeMask(hi, lo);
          description = "inclusive bits " + hi + ".." + lo + " set";
        } else {
          var count = rng.int(2, Math.min(5, width));
          while (positions.length < count) {
            var pos = rng.int(0, width - 1);
            if (!positions.includes(pos)) positions.push(pos);
          }
          positions.sort(function (a, b) { return a - b; });
          positions.forEach(function (pos) { result |= 1n << BigInt(pos); });
          description = "only bits " + positions.join(", ") + " set";
        }
        var representation = representationForLevel(level, rng);
        return makeQuestion("construct_mask", level, width, representation, { variant: variant, positions: positions }, prompt("Construct a " + width + "-bit mask with " + description + ".", [], "Bit 0 is rightmost."), [patternField("mask", "Mask", result, width, representation)], "The requested set bits produce " + displayValue(result, width, representation) + ".", [variant, representation, variant === "range" ? "span-" + (positions[1] - positions[0] + 1) : "count-" + positions.length], ["construction"], ["range-off-by-one"]);
      };

      FAMILY_GENERATORS.apply_mask = function (level, rng) {
        var width = widthForLevel(level, rng);
        var x = randomNontrivial(rng, width);
        var maskValue = randomNontrivial(rng, width);
        var operation = rng.choice(["set", "clear", "toggle", "keep"]);
        var result = operation === "set" ? x | maskValue : operation === "clear" ? x & ((~maskValue) & widthMask(width)) : operation === "toggle" ? x ^ maskValue : x & maskValue;
        var representation = representationForLevel(level, rng);
        var symbol = operation === "set" ? "|" : operation === "clear" ? "& ~" : operation === "toggle" ? "^" : "&";
        return makeQuestion("apply_mask", level, width, representation, { operation: operation, x: x.toString(), mask: maskValue.toString() }, prompt(operation[0].toUpperCase() + operation.slice(1) + " the bits selected by this mask.", ["x    = " + displayValue(x, width, representation), "mask = " + displayValue(maskValue, width, representation)], operation + " uses x " + symbol + " mask."), [patternField("result", "Result", result, width, representation)], "Apply " + symbol + " within " + width + " bits: " + displayValue(result, width, representation) + ".", [operation, representation, "overlap-" + (popcount(x & maskValue, width) ? "some" : "none")], ["mask-application"], ["clear-mask-polarity"]);
      };

      FAMILY_GENERATORS.test_masked_flags = function (level, rng) {
        var width = compactWidth(level, rng);
        var x = rng.bigint(width);
        var maskValue = randomNontrivial(rng, width);
        var predicate = rng.choice(level === 1 ? ["single", "any"] : ["single", "any", "all", "equal"]);
        if (predicate === "single") maskValue = 1n << BigInt(rng.int(0, width - 1));
        var expectedValue = rng.bigint(width) & maskValue;
        var result = predicate === "single" || predicate === "any"
          ? (x & maskValue) !== 0n
          : predicate === "all"
            ? (x & maskValue) === maskValue
            : (x & maskValue) === expectedValue;
        var wording = predicate === "single" ? "Is the selected single bit set?" : predicate === "any" ? "Are any selected bits set?" : predicate === "all" ? "Are all selected bits set?" : "Do the masked bits equal the expected pattern?";
        var rows = ["flags    = " + hex(x, width), "mask     = " + hex(maskValue, width)];
        if (predicate === "equal") rows.push("expected = " + hex(expectedValue, width));
        return makeQuestion("test_masked_flags", level, width, "hex", { predicate: predicate, x: x.toString(), mask: maskValue.toString(), expected: expectedValue.toString() }, prompt(wording, rows, "Only bits selected by mask participate."), [boolField("answer", "Answer", result)], "flags & mask = " + hex(x & maskValue, width) + "; predicate " + predicate + " is " + (result ? "true" : "false") + ".", [predicate, result ? "true" : "false", (x & maskValue) !== 0n && (x & maskValue) !== maskValue ? "some-not-all" : "edge"], ["predicate"], ["any-vs-all"]);
      };

      FAMILY_GENERATORS.list_or_decode_flags = function (level, rng) {
        var width = compactWidth(level, rng);
        var positions = [];
        var count = rng.int(level === 1 ? 1 : 0, Math.min(6, width));
        while (positions.length < count) {
          var pos = rng.int(0, width - 1);
          if (!positions.includes(pos)) positions.push(pos);
        }
        positions.sort(function (a, b) { return a - b; });
        var raw = positions.reduce(function (value, pos) { return value | (1n << BigInt(pos)); }, 0n);
        var direction = rng.chance(0.5) ? "pattern-to-list" : "list-to-pattern";
        if (direction === "pattern-to-list") {
          return makeQuestion("list_or_decode_flags", level, width, "hex", { direction: direction, raw: raw.toString() }, prompt("List every set bit position.", [hex(raw, width)], "Bit 0 is rightmost. Enter none for an empty set."), [field("positions", "Positions", "positions", positions.length ? positions.join(",") : "none")], "The set-bit positions are " + (positions.length ? positions.join(", ") : "none") + ".", [direction, "count-" + positions.length], ["inverse"], ["one-indexing"]);
        }
        return makeQuestion("list_or_decode_flags", level, width, "hex", { direction: direction, positions: positions }, prompt("Encode these set bit positions as a " + width + "-bit flag pattern.", [positions.length ? positions.join(", ") : "none"], "All other bits are clear."), [patternField("pattern", "Flag pattern", raw, width, "hex")], "Setting those positions gives " + hex(raw, width) + ".", [direction, "count-" + positions.length], ["inverse"], ["one-indexing"]);
      };

      function randomField(width, rng) {
        var fieldWidth = rng.int(1, Math.min(width, Math.max(2, Math.floor(width / 2))));
        var lo = rng.int(0, width - fieldWidth);
        return { lo: lo, hi: lo + fieldWidth - 1, width: fieldWidth };
      }

      FAMILY_GENERATORS.extract_field = function (level, rng) {
        var width = compactWidth(level, rng);
        var raw = randomNontrivial(rng, width);
        var selected = randomField(width, rng);
        var result = (raw >> BigInt(selected.lo)) & widthMask(selected.width);
        var representation = level <= 2 ? "binary" : rng.choice(["binary", "hex"]);
        return makeQuestion("extract_field", level, selected.width, representation, { containerWidth: width, raw: raw.toString(), hi: selected.hi, lo: selected.lo }, prompt("Extract inclusive field bits " + selected.hi + ".." + selected.lo + " and right-align it.", [displayValue(raw, width, representation)], "The answer is exactly " + selected.width + " bits."), [patternField("field", "Extracted field", result, selected.width, representation)], "Shift right " + selected.lo + ", then mask " + selected.width + " bits: " + displayValue(result, selected.width, representation) + ".", ["field-" + selected.width, selected.lo === 0 ? "low-edge" : selected.hi === width - 1 ? "high-edge" : "middle", representation], ["field-width", "alignment"], ["range-off-by-one"]);
      };

      FAMILY_GENERATORS.insert_field = function (level, rng) {
        var width = compactWidth(level, rng);
        var container = randomNontrivial(rng, width);
        var selected = randomField(width, rng);
        var fieldValue = rng.bigint(selected.width);
        var selectedMask = rangeMask(selected.hi, selected.lo);
        var result = (container & ((~selectedMask) & widthMask(width))) | ((fieldValue << BigInt(selected.lo)) & selectedMask);
        var representation = level <= 2 ? "binary" : rng.choice(["binary", "hex"]);
        return makeQuestion("insert_field", level, width, representation, { container: container.toString(), fieldValue: fieldValue.toString(), hi: selected.hi, lo: selected.lo }, prompt("Insert the field into inclusive bits " + selected.hi + ".." + selected.lo + ".", ["container = " + displayValue(container, width, representation), "field     = " + displayValue(fieldValue, selected.width, representation)], "Preserve every bit outside the field."), [patternField("result", "Updated container", result, width, representation)], "Clear destination mask " + displayValue(selectedMask, width, representation) + ", shift the field by " + selected.lo + ", then OR: " + displayValue(result, width, representation) + ".", ["field-" + selected.width, selected.lo === 0 ? "low-edge" : selected.hi === width - 1 ? "high-edge" : "middle", representation], ["preservation", "multi-step"], ["or-without-clear"]);
      };

      FAMILY_GENERATORS.field_fit = function (level, rng) {
        var fieldWidth = rng.int(1, level === 1 ? 4 : level === 2 ? 8 : level === 3 ? 12 : level === 4 ? 20 : 32);
        var max = (1n << BigInt(fieldWidth)) - 1n;
        var caseClass = rng.choice(["zero", "max", "inside", "one-over", "above"]);
        var value = caseClass === "zero" ? 0n : caseClass === "max" ? max : caseClass === "one-over" ? max + 1n : caseClass === "above" ? max + BigInt(rng.int(2, 20)) : max > 1n ? BigInt(rng.int(1, Number(max > 1000n ? 1000n : max - 1n))) : 0n;
        var fits = value <= max;
        return makeQuestion("field_fit", level, fieldWidth, "decimal", { fieldWidth: fieldWidth, value: value.toString(), caseClass: caseClass }, prompt("Does this unsigned decimal value fit in a " + fieldWidth + "-bit field?", [String(value)], "The maximum is inclusive."), [boolField("fits", "Fits?", fits)], "A " + fieldWidth + "-bit field accepts 0.." + max + "; answer " + (fits ? "yes" : "no") + ".", ["case-" + caseClass], ["boundary"], ["signed-range-applied"]);
      };

      FAMILY_GENERATORS.field_expression = function (level, rng) {
        var variant = rng.chance(0.5) ? "extract" : "insert";
        var correct = variant === "extract" ? "(x >>> lo) & fieldMask" : "(x & ~destMask) | ((value << lo) & destMask)";
        var options = variant === "extract"
          ? [correct, "(x & fieldMask) >>> hi", "(x << lo) & fieldMask", "x | fieldMask"]
          : [correct, "x | (value << lo)", "(x & destMask) | value", "(x ^ destMask) | value"];
        return makeQuestion("field_expression", level, 16, "symbolic", { variant: variant }, prompt("Choose the correct abstract expression for " + variant + "ing an inclusive field.", [], variant === "extract" ? "fieldMask is right-aligned after shifting." : "destMask marks the destination bits."), [choiceField("expression", "Expression", correct, options)], variant === "extract" ? "Right-align first, then mask the field width." : "Clear the destination, align and mask the new value, then combine.", [variant], ["rule-recognition"], ["or-without-clear", "wrong-shift-direction"]);
      };

      FAMILY_GENERATORS.programmer_landmark = function (level, rng) {
        var core = [4, 8, 10, 12, 16];
        var exponent = level <= 2 ? rng.choice(core) : rng.choice([8, 10, 12, 16, 20, 24, 30, 32]);
        var boundary = 1n << BigInt(exponent);
        var oneLess = level >= 2 && rng.chance(0.35);
        var value = oneLess ? boundary - 1n : boundary;
        var shown = rng.chance(0.5) ? "decimal" : "hex";
        var answerRepresentation = shown === "hex" ? "decimal" : "hex";
        var boundaryVariant = oneLess && level >= 3 && rng.chance(0.65);
        var answer = boundaryVariant ? boundary : value;
        var title = boundaryVariant
          ? numericText(value, shown) + " is one less than which power-of-two boundary?"
          : "Write " + numericText(value, shown) + " in " + answerRepresentation + ".";
        return makeQuestion("programmer_landmark", level, null, answerRepresentation, {
          exponent: exponent,
          value: value.toString(),
          boundary: boundary.toString(),
          addressRepresentation: shown,
          answerRepresentation: answerRepresentation,
          variant: boundaryVariant ? "adjacent-boundary" : oneLess ? "one-less-conversion" : "exact-conversion"
        }, prompt(title, [], "Enter a numeric value; leading zeroes are optional."), [
          numericField("answer", "Answer", answer, answerRepresentation)
        ], "2^" + exponent + " = " + boundary + " = " + numericText(boundary, "hex") + (oneLess ? "; one less is " + numericText(value, "hex") + "." : "."), [boundaryVariant ? "boundary" : oneLess ? "one-less" : "exact", shown + "-to-" + answerRepresentation], ["base-direction", "landmark-adjustment"], ["boundary-vs-largest-lower-value", "decimal-looking-hex"]);
      };

      FAMILY_GENERATORS.base_address_offset = function (level, rng) {
        var reps = addressRepresentations(level, rng);
        var offsetMagnitude = BigInt(rng.int(1, level <= 1 ? 63 : level <= 3 ? 511 : 4095));
        var negative = level >= 3 && rng.chance(0.35);
        var offset = negative ? -offsetMagnitude : offsetMagnitude;
        var base = BigInt(rng.int(2, level <= 2 ? 64 : 512)) * 256n + BigInt(rng.int(0, 255));
        if (negative && base < offsetMagnitude) base += offsetMagnitude;
        var answer = base + offset;
        var directionText = negative ? "move " + numericText(offsetMagnitude, reps.shown) + " bytes back" : "add byte offset " + numericText(offset, reps.shown);
        return makeQuestion("base_address_offset", level, null, reps.answer, {
          base: base.toString(),
          offset: offset.toString(),
          addressRepresentation: reps.shown,
          answerRepresentation: reps.answer,
          direction: negative ? "backward" : "forward"
        }, prompt("Starting at address " + numericText(base, reps.shown) + ", " + directionText + ". What address is reached?", [], "Answer in " + reps.answer + "."), [
          numericField("address", "Address", answer, reps.answer)
        ], numericText(base, reps.shown) + (negative ? " − " : " + ") + numericText(offsetMagnitude, reps.shown) + " = " + numericText(answer, reps.answer) + ".", [negative ? "backward" : "forward", reps.shown + "-to-" + reps.answer, Number(base & 0xFFn) + Number(offset & 0xFFn) > 255 ? "low-carry" : "ordinary"], ["direction", "mixed-representation"], ["omitting-base", "wrong-direction"]);
      };

      FAMILY_GENERATORS.address_distance = function (level, rng) {
        var reps = addressRepresentations(level, rng);
        var signed = level >= 3 && rng.chance(0.45);
        var from = BigInt(rng.int(16, 512)) * 256n + BigInt(rng.int(0, 255));
        var magnitude = BigInt(rng.int(1, level <= 2 ? 512 : 4096));
        var backward = signed && rng.chance(0.5) && from >= magnitude;
        var to = backward ? from - magnitude : from + magnitude;
        var displacement = to - from;
        var title = signed
          ? "What signed byte displacement takes address " + numericText(from, reps.shown) + " to address " + numericText(to, reps.shown) + "?"
          : "How many bytes from lower address " + numericText(from, reps.shown) + " to higher address " + numericText(to, reps.shown) + "?";
        return makeQuestion("address_distance", level, null, reps.answer, {
          from: from.toString(),
          to: to.toString(),
          addressRepresentation: reps.shown,
          answerRepresentation: reps.answer,
          variant: signed ? "signed-displacement" : "ordered-distance"
        }, prompt(title, [], "Answer in " + reps.answer + "."), [
          numericField("distance", signed ? "Displacement" : "Distance", signed ? displacement : magnitude, reps.answer)
        ], numericText(to, reps.shown) + " − " + numericText(from, reps.shown) + " = " + numericText(signed ? displacement : magnitude, reps.answer) + "; adding it back reaches the endpoint.", [signed ? backward ? "signed-backward" : "signed-forward" : "ordered", reps.shown + "-to-" + reps.answer], ["inverse-address-arithmetic"], ["reversed-subtraction", "inclusive-plus-one"]);
      };

      FAMILY_GENERATORS.alignment_predicate = function (level, rng) {
        var maxExponent = level <= 1 ? 4 : level === 2 ? 8 : 12;
        var exponent = rng.int(1, maxExponent);
        var alignment = 1n << BigInt(exponent);
        var aligned = rng.chance(0.5);
        var remainderClasses = [1n, alignment - 1n, BigInt(rng.int(1, Math.max(1, Number(alignment - 1n))))];
        var remainder = aligned ? 0n : rng.choice(remainderClasses);
        var address = BigInt(rng.int(1, 128)) * alignment + remainder;
        var representation = level >= 3 && rng.chance(0.4) ? "decimal" : "hex";
        return makeQuestion("alignment_predicate", level, null, "boolean", {
          address: address.toString(),
          alignment: alignment.toString(),
          exponent: exponent,
          remainder: remainder.toString(),
          addressRepresentation: representation,
          answerRepresentation: "boolean"
        }, prompt("Is address " + numericText(address, representation) + " aligned to a " + alignment + "-byte boundary?", [], "Aligned means remainder zero."), [
          boolField("aligned", "Aligned?", aligned)
        ], numericText(address, representation) + " mod " + alignment + " = " + remainder + ", so the answer is " + (aligned ? "yes" : "no") + ".", [aligned ? "aligned" : remainder === 1n ? "remainder-one" : remainder === alignment - 1n ? "remainder-max" : "remainder-interior", "2^" + exponent], ["zero-remainder"], ["dividing-by-exponent", "digit-appearance"]);
      };

      FAMILY_GENERATORS.align_power_two = function (level, rng) {
        var exponent = rng.int(2, level <= 1 ? 4 : level === 2 ? 6 : level === 3 ? 8 : 12);
        var alignment = 1n << BigInt(exponent);
        var alreadyAligned = rng.chance(0.25);
        var remainder = alreadyAligned ? 0n : BigInt(rng.int(1, Number(alignment - 1n)));
        var address = BigInt(rng.int(4, 128)) * alignment + remainder;
        var down = address - remainder;
        var up = remainder === 0n ? address : address + alignment - remainder;
        var representation = level >= 4 && rng.chance(0.4) ? "decimal" : "hex";
        var variant = level >= 3 ? "both" : level === 1 ? "down" : rng.choice(["down", "up"]);
        var fields = variant === "both"
          ? [numericField("down", "Down", down, representation), numericField("up", "Up", up, representation)]
          : [numericField("address", variant === "down" ? "Aligned down" : "Aligned up", variant === "down" ? down : up, representation)];
        var title = variant === "both"
          ? "For address " + numericText(address, representation) + " and " + alignment + "-byte alignment, give down and up."
          : "Align address " + numericText(address, representation) + " " + variant + " to a " + alignment + "-byte boundary.";
        return makeQuestion("align_power_two", level, null, representation, {
          address: address.toString(),
          alignment: alignment.toString(),
          remainder: remainder.toString(),
          down: down.toString(),
          up: up.toString(),
          addressRepresentation: representation,
          answerRepresentation: representation,
          variant: variant
        }, prompt(title, [], "Up means at or above, not strictly above."), fields, "The remainder is " + remainder + ". Down subtracts it to " + numericText(down, representation) + "; up is " + numericText(up, representation) + ".", [variant, alreadyAligned ? "already-aligned" : remainder === alignment - 1n ? "just-below" : "interior"], ["constructive-alignment"], ["always-add-full-alignment", "swapped-endpoints"]);
      };

      FAMILY_GENERATORS.alignment_padding = function (level, rng) {
        var exponent = rng.int(2, level <= 1 ? 4 : level === 2 ? 6 : level === 3 ? 8 : 12);
        var alignment = 1n << BigInt(exponent);
        var paddingClass = rng.choice(["zero", "one", "max", "interior"]);
        var remainder = paddingClass === "zero" ? 0n : paddingClass === "one" ? alignment - 1n : paddingClass === "max" ? 1n : BigInt(rng.int(1, Number(alignment - 1n)));
        var address = BigInt(rng.int(4, 128)) * alignment + remainder;
        var padding = remainder === 0n ? 0n : alignment - remainder;
        var representation = level >= 2 && rng.chance(0.55) ? "hex" : "decimal";
        var answerRepresentation = level >= 3 && rng.chance(0.35) ? (representation === "hex" ? "decimal" : "hex") : representation;
        return makeQuestion("alignment_padding", level, null, answerRepresentation, {
          address: address.toString(),
          alignment: alignment.toString(),
          remainder: remainder.toString(),
          addressRepresentation: representation,
          answerRepresentation: answerRepresentation
        }, prompt("The next free address is " + numericText(address, representation) + ". How many padding bytes are required for " + alignment + "-byte alignment?", [], "Answer in " + answerRepresentation + "."), [
          numericField("padding", "Padding bytes", padding, answerRepresentation)
        ], "The current remainder is " + remainder + "; " + numericText(padding, answerRepresentation) + " more bytes reach " + numericText(address + padding, representation) + ".", [paddingClass, representation + "-to-" + answerRepresentation], ["distance-to-boundary"], ["returning-remainder", "padding-already-aligned"]);
      };

      FAMILY_GENERATORS.unit_offset_boundary = function (level, rng) {
        var role = level === 1 ? "word" : rng.choice(["word", "cache line", "page"]);
        var ranges = role === "word" ? [1, 4] : role === "cache line" ? [4, 8] : [8, 16];
        var exponent = rng.int(ranges[0], Math.max(ranges[0], Math.min(ranges[1], level <= 1 ? 4 : level === 2 ? 8 : level === 3 ? 12 : 16)));
        var size = 1n << BigInt(exponent);
        var offset = rng.choice([0n, 1n, size - 1n, BigInt(rng.int(0, Number(size - 1n)))]);
        var base = BigInt(rng.int(2, 64)) * size;
        var address = base + offset;
        var next = base + size;
        var representation = level >= 2 && rng.chance(0.7) ? "hex" : "decimal";
        var variant = level === 1 ? "offset" : level === 2 ? rng.choice(["offset", "base"]) : rng.choice(["base", "interval", "all"]);
        var fields = variant === "offset" ? [numericField("offset", "Byte offset", offset, representation)]
          : variant === "base" ? [numericField("base", "Containing base", base, representation)]
          : variant === "interval" ? [numericField("base", "Base", base, representation), numericField("nextBoundary", "Next boundary", next, representation)]
          : [numericField("offset", "Byte offset", offset, representation), numericField("base", "Base", base, representation), numericField("nextBoundary", "Next boundary", next, representation)];
        var task = variant === "offset" ? "Give its byte offset within the containing " + role + "."
          : variant === "base" ? "Give the base address of the containing " + role + "."
          : variant === "interval" ? "Give the containing half-open interval [base, next boundary)."
          : "Give its offset, containing base, and next boundary.";
        return makeQuestion("unit_offset_boundary", level, null, representation, {
          role: role,
          unitSize: size.toString(),
          address: address.toString(),
          offset: offset.toString(),
          base: base.toString(),
          nextBoundary: next.toString(),
          addressRepresentation: representation,
          answerRepresentation: representation,
          variant: variant
        }, prompt("A " + role + " is explicitly " + size + " bytes. Address " + numericText(address, representation) + ": " + task, [], "Use the supplied size; no architecture default applies."), fields, numericText(address, representation) + " = " + numericText(base, representation) + " + " + numericText(offset, representation) + "; the next boundary is " + numericText(next, representation) + ".", [role, variant, offset === 0n ? "at-base" : offset === size - 1n ? "at-end" : "interior"], ["unit-decomposition"], ["unstated-standard-size", "absolute-address-as-offset"]);
      };

      FAMILY_GENERATORS.range_crosses_boundary = function (level, rng) {
        var role = level === 1 ? "word" : level === 2 ? rng.choice(["word", "cache line"]) : rng.choice(["word", "cache line", "page"]);
        var exponent = role === "word" ? rng.int(2, 4) : role === "cache line" ? rng.int(4, 8) : rng.int(8, level >= 3 ? 12 : 10);
        var size = 1n << BigInt(exponent);
        var crossing = rng.chance(0.5);
        var base = BigInt(rng.int(2, 64)) * size;
        var offset = rng.choice([0n, 1n, size - 1n, BigInt(rng.int(0, Number(size - 1n)))]);
        var start = base + offset;
        var room = size - offset;
        var crossingExtra = level >= 4 && rng.chance(0.3) ? size + BigInt(rng.int(1, Number(size))) : BigInt(rng.chance(0.3) ? 1 : rng.int(1, Math.max(1, Number(size / 4n))));
        var length = crossing ? room + crossingExtra : BigInt(rng.int(1, Number(room)));
        if (!crossing && rng.chance(0.35)) length = room;
        var end = start + length;
        var last = end - 1n;
        var boundaryCount = last / size - start / size;
        var representation = level >= 2 && rng.chance(0.7) ? "hex" : "decimal";
        var fields = [boolField("crosses", "Crosses?", crossing)];
        if (level >= 4) fields.push(numericField("boundaryCount", "Boundaries crossed", boundaryCount, "decimal"));
        return makeQuestion("range_crosses_boundary", level, null, "boolean", {
          role: role,
          unitSize: size.toString(),
          start: start.toString(),
          length: length.toString(),
          endExclusive: end.toString(),
          last: last.toString(),
          addressRepresentation: representation,
          answerRepresentation: level >= 4 ? "boolean-and-decimal" : "boolean"
        }, prompt("A " + role + " is explicitly " + size + " bytes. Does byte range [" + numericText(start, representation) + ", " + numericText(end, representation) + ") cross a " + role + " boundary?", [], "The range is half-open and has length " + length + " bytes."), fields, "The first byte is " + numericText(start, representation) + " and the last touched byte is " + numericText(last, representation) + "; their containing bases are " + numericText((start / size) * size, representation) + " and " + numericText((last / size) * size, representation) + ".", [crossing ? boundaryCount > 1n ? "multi-cross" : "cross" : end % size === 0n ? "ends-at-boundary" : start % size === 0n ? "starts-at-boundary" : "contained", role], ["half-open-endpoint", "containing-bases"], ["testing-exclusive-end", "boundary-endpoint-always-crosses"]);
      };

      FAMILY_GENERATORS.supplied_layout_offset = function (level, rng) {
        var representation = level >= 3 && rng.chance(0.65) ? "hex" : "decimal";
        if (level === 1) {
          var elementSize = rng.int(1, 16);
          var index = rng.int(0, 12);
          var elementOffset = BigInt(elementSize * index);
          return makeQuestion("supplied_layout_offset", level, null, representation, {
            variant: "array-offset",
            elementSize: elementSize,
            index: index,
            addressRepresentation: representation,
            answerRepresentation: representation,
            zeroBased: true
          }, prompt("A zero-indexed array has " + elementSize + "-byte elements. What is the byte offset of element index " + index + "?", [], "No base address is needed for an offset."), [
            numericField("offset", "Element offset", elementOffset, representation)
          ], index + " × " + elementSize + " = " + numericText(elementOffset, representation) + " bytes.", ["array", index === 0 ? "index-zero" : "index-nonzero"], ["zero-based-stride"], ["one-based-indexing", "returning-address"]);
        }
        if (level === 2) {
          var sizes = [rng.int(1, 4), rng.int(1, 4), rng.int(2, 8), rng.int(2, 12)];
          var names = ["tag", "padding", "count", "payload"];
          var target = rng.int(2, 3);
          var fieldOffset = sizes.slice(0, target).reduce(function (sum, size) { return sum + size; }, 0);
          var layout = names.map(function (name, indexValue) { return name + " " + sizes[indexValue] + " byte" + (sizes[indexValue] === 1 ? "" : "s"); }).join(", ");
          return makeQuestion("supplied_layout_offset", level, null, "decimal", {
            variant: "record-field-offset",
            layout: names.map(function (name, indexValue) { return { name: name, size: sizes[indexValue], padding: name === "padding" }; }),
            field: names[target],
            fieldOffset: fieldOffset,
            addressRepresentation: "decimal",
            answerRepresentation: "decimal",
            implicitPadding: false
          }, prompt("Record layout, sequential with no implicit padding: " + layout + ". What is " + names[target] + "'s byte offset?", [], "Every listed padding byte occupies space; add only preceding entries."), [
            numericField("offset", "Field offset", fieldOffset, "decimal")
          ], names.slice(0, target).map(function (name, indexValue) { return name + " " + sizes[indexValue]; }).join(" + ") + " = " + fieldOffset + ".", ["record", "explicit-padding", "target-" + target], ["supplied-layout-sum"], ["omitting-explicit-padding", "inventing-hidden-padding"]);
        }
        var recordSize = rng.choice([12, 16, 20, 24, 32]);
        var fieldOffsetValue = rng.int(0, recordSize - 4);
        var arrayIndex = rng.int(0, level >= 4 ? 15 : 7);
        var arrayBase = BigInt(rng.int(4, 64)) * 256n;
        var elementContribution = BigInt(arrayIndex * recordSize);
        var address = arrayBase + elementContribution + BigInt(fieldOffsetValue);
        return makeQuestion("supplied_layout_offset", level, null, representation, {
          variant: "array-record-field-address",
          base: arrayBase.toString(),
          recordSize: recordSize,
          index: arrayIndex,
          field: "value",
          fieldOffset: fieldOffsetValue,
          addressRepresentation: representation,
          answerRepresentation: representation,
          zeroBased: true,
          implicitPadding: false
        }, prompt("A zero-indexed record array begins at " + numericText(arrayBase, representation) + ". Each record is explicitly " + recordSize + " bytes; field value has supplied offset " + fieldOffsetValue + ". What is value's address in element " + arrayIndex + "?", [], "Use only the supplied stride and field offset."), [
          numericField("address", "Field address", address, representation)
        ], numericText(arrayBase, representation) + " + " + arrayIndex + " × " + recordSize + " + " + fieldOffsetValue + " = " + numericText(address, representation) + ".", ["array-of-record", arrayIndex === 0 ? "index-zero" : "index-nonzero", fieldOffsetValue === 0 ? "field-zero" : "field-nonzero"], ["stride-plus-field-plus-base"], ["multiplying-field-offset", "omitting-base", "inventing-padding"]);
      };

      FAMILY_GENERATORS.population_count = function (level, rng) {
        var representation = level === 1 ? "binary" : rng.chance(0.7) ? "hex" : "binary";
        var width = level === 1 ? rng.choice([4, 8]) : level === 2 ? rng.choice([8, 12, 16]) : level === 3 ? rng.choice([16, 24, 32]) : rng.choice([32, 48, 64]);
        if (representation === "hex") width = Math.ceil(width / 4) * 4;
        var raw;
        if (level >= 4) {
          raw = 0n;
          var targetCount = rng.int(2, Math.min(8, width - 1));
          while (popcount(raw, width) < targetCount) raw |= 1n << BigInt(rng.int(0, width - 1));
        } else {
          raw = randomNontrivial(rng, width);
        }
        var count = popcount(raw, width);
        var display = displayValue(raw, width, representation);
        var groups = fixedDigits(raw, width, representation === "hex" ? 16 : 2).split("").map(function (digit) {
          return digit + "→" + parseInt(digit, representation === "hex" ? 16 : 2).toString(2).split("").filter(function (bit) { return bit === "1"; }).length;
        });
        return makeQuestion("population_count", level, width, representation, {
          raw: raw.toString(),
          count: count,
          patternRepresentation: representation
        }, prompt("What is the population count (number of 1 bits) of this " + width + "-bit pattern?", [display], "Count set bits, not nonzero digits."), [
          field("count", "Population count", "integer", count)
        ], groups.join(", ") + "; total = " + count + ".", [representation, count <= Math.max(2, width / 4) ? "low" : count >= width * 0.75 ? "high" : "middle", "width-" + width], ["chunked-bit-count"], ["counting-nonzero-digits", "counting-positions"]);
      };

      FAMILY_GENERATORS.mask_shape = function (level, rng) {
        var width = level <= 2 ? 8 : level <= 4 ? 16 : 24;
        var representation = level >= 4 ? "hex" : "binary";
        if (level === 1) {
          var positive = rng.chance(0.5);
          var oneHotMask = 1n << BigInt(rng.int(0, width - 1));
          if (!positive) oneHotMask = rng.chance(0.3) ? 0n : oneHotMask | (1n << BigInt((rng.int(1, width - 1) + integerLog2(oneHotMask)) % width));
          return makeQuestion("mask_shape", level, width, representation, { variant: "one-hot", mask: oneHotMask.toString() }, prompt("Is this " + width + "-bit mask one-hot (exactly one 1 bit)?", [displayValue(oneHotMask, width, representation)], "Zero is not one-hot."), [boolField("oneHot", "One-hot?", positive)], "Its population count is " + popcount(oneHotMask, width) + ", so the answer is " + (positive ? "yes" : "no") + ".", ["one-hot", positive ? "positive" : "negative"], ["popcount-shape"], ["one-nonzero-digit"]);
        }
        if (level === 2) {
          var runLength = rng.int(3, 5);
          var lo = rng.int(0, width - runLength);
          var contiguousMask = widthMask(runLength) << BigInt(lo);
          var contiguous = rng.chance(0.5);
          var candidate = contiguous ? contiguousMask : contiguousMask ^ (1n << BigInt(lo + rng.int(1, runLength - 2)));
          return makeQuestion("mask_shape", level, width, representation, { variant: "contiguous", mask: candidate.toString() }, prompt("Do all 1 bits in this nonzero mask form one contiguous run?", [displayValue(candidate, width, representation)], "A one-bit gap breaks the run."), [boolField("contiguous", "Contiguous?", contiguous)], "The set positions are " + Array.from({ length: width }, function (_, index) { return index; }).filter(function (index) { return (candidate & (1n << BigInt(index))) !== 0n; }).join(", ") + "; answer " + (contiguous ? "yes" : "no") + ".", ["contiguous", contiguous ? "positive" : "one-gap"], ["set-position-run"], ["ignoring-gaps"]);
        }
        if (level === 3) {
          var sparseMax = Math.min(4, Math.floor(width / 4));
          var sparse = rng.chance(0.5);
          var sparseMask = sparse ? (1n | (1n << 3n) | (rng.chance(0.5) ? 0n : 1n << 7n)) : rng.chance(0.5) ? widthMask(sparseMax + 1) : widthMask(sparseMax + 1) << 2n;
          var sparseCount = popcount(sparseMask, width);
          return makeQuestion("mask_shape", level, width, "binary", { variant: "sparse", mask: sparseMask.toString(), sparseMax: sparseMax }, prompt("Here sparse means 2.." + sparseMax + " set bits with at least one zero gap. Is this mask sparse?", [bin(sparseMask, width)], "Apply both the count and gap requirements."), [boolField("sparse", "Sparse?", sparse)], "The population count is " + sparseCount + (sparse ? " and the set bits have a gap; yes." : " and the stated sparse rule is not satisfied; no."), ["sparse", sparse ? "positive" : sparseCount > sparseMax ? "too-many" : "contiguous"], ["explicit-sparse-definition"], ["low-count-without-gap", "ignoring-threshold"]);
        }
        if (level === 4) {
          var left = randomNontrivial(rng, width);
          var complementary = rng.chance(0.5);
          var right = widthMask(width) ^ left;
          if (!complementary) right ^= 1n << BigInt(rng.int(0, width - 1));
          return makeQuestion("mask_shape", level, width, representation, { variant: "complementary", left: left.toString(), right: right.toString() }, prompt("Are these complementary " + width + "-bit masks?", [displayValue(left, width, representation), displayValue(right, width, representation)], "Every visible bit must be opposite."), [boolField("complementary", "Complementary?", complementary)], "Their XOR is " + displayValue(left ^ right, width, representation) + "; the full-width target is " + displayValue(widthMask(width), width, representation) + ".", ["complement", complementary ? "positive" : "one-bit-error"], ["width-bounded-complement"], ["unbounded-complement", "missing-complement-bit"]);
        }
        var maskClass = rng.choice(["one-hot", "contiguous", "sparse", "ordinary"]);
        var rawMask;
        if (maskClass === "one-hot") {
          rawMask = 1n << BigInt(rng.int(0, width - 1));
        } else if (maskClass === "contiguous") {
          var multipleRunLength = rng.int(2, 8);
          rawMask = widthMask(multipleRunLength) << BigInt(rng.int(0, width - multipleRunLength));
        } else if (maskClass === "sparse") {
          rawMask = 1n | (1n << 5n) | (rng.chance(0.5) ? 0n : 1n << 11n);
        } else {
          rawMask = randomNontrivial(rng, width);
        }
        var countValue = popcount(rawMask, width);
        var positions = Array.from({ length: width }, function (_, index) { return index; }).filter(function (index) { return (rawMask & (1n << BigInt(index))) !== 0n; });
        var contiguousValue = positions.length > 0 && positions[positions.length - 1] - positions[0] + 1 === positions.length;
        var sparseLimit = Math.min(4, Math.floor(width / 4));
        var sparseValue = countValue >= 2 && countValue <= sparseLimit && !contiguousValue;
        return makeQuestion("mask_shape", level, width, "hex", { variant: "multiple", mask: rawMask.toString(), sparseMax: sparseLimit }, prompt("Classify this " + width + "-bit mask under the stated definitions.", [hex(rawMask, width)], "One-hot means exactly one set bit; contiguous means a nonzero uninterrupted run; sparse means 2.." + sparseLimit + " bits with a gap."), [boolField("oneHot", "One-hot?", countValue === 1), boolField("contiguous", "Contiguous?", contiguousValue), boolField("sparse", "Sparse?", sparseValue)], "Its population count is " + countValue + " and set positions are " + positions.join(", ") + ".", ["multiple-predicates", maskClass], ["overlapping-predicates"], ["assuming-taxonomy-exclusive"]);
      };

      FAMILY_GENERATORS.power_two_remainder = function (level, rng) {
        var exponent = rng.int(1, level <= 1 ? 4 : level === 2 ? 8 : level === 3 ? 10 : 16);
        var modulus = 1n << BigInt(exponent);
        if (level >= 4 && rng.chance(0.45)) {
          var patternWidth = rng.choice([16, 24, 32].filter(function (width) { return width >= exponent; }));
          var mask = modulus - 1n;
          return makeQuestion("power_two_remainder", level, patternWidth, "hex", {
            variant: "mask",
            modulus: modulus.toString(),
            exponent: exponent,
            patternWidth: patternWidth
          }, prompt("Which " + patternWidth + "-bit mask computes x mod " + modulus + " for non-negative x?", [], "Return an exact-width hexadecimal pattern."), [
            patternField("mask", "Remainder mask", mask, patternWidth, "hex")
          ], modulus + " = 2^" + exponent + ", so the mask is 2^" + exponent + "−1 = " + hex(mask, patternWidth) + ".", ["mask", "2^" + exponent], ["mask-shortcut"], ["using-modulus-as-mask", "wrong-low-bit-count"]);
        }
        var remainderClass = rng.choice(["zero", "one", "max", "interior"]);
        var remainder = remainderClass === "zero" ? 0n : remainderClass === "one" ? 1n : remainderClass === "max" ? modulus - 1n : BigInt(rng.int(1, Number(modulus - 1n)));
        var quotient = BigInt(rng.int(1, level <= 2 ? 32 : 512));
        var value = quotient * modulus + remainder;
        var representation = level === 1 ? "decimal" : rng.chance(0.65) ? "hex" : "decimal";
        return makeQuestion("power_two_remainder", level, null, representation, {
          variant: "numeric",
          value: value.toString(),
          modulus: modulus.toString(),
          exponent: exponent,
          remainder: remainder.toString(),
          addressRepresentation: representation,
          answerRepresentation: representation
        }, prompt("What is " + numericText(value, representation) + " mod " + numericText(modulus, representation) + "?", [], "The modulus is 2^" + exponent + "; answer in " + representation + "."), [
          numericField("remainder", "Remainder", remainder, representation)
        ], "Retain the low " + exponent + " bits using mask " + numericText(modulus - 1n, representation) + "; the remainder is " + numericText(remainder, representation) + ".", ["numeric", remainderClass, exponent % 4 === 0 ? "nibble-aligned" : "non-nibble"], ["low-bit-remainder"], ["modulus-instead-of-mask", "align-down-instead-of-remainder"]);
      };

      FAMILY_GENERATORS.store_integer_bytes = function (level, rng) {
        var width = widthForLevel(level, rng, "memory");
        var raw = memoryPattern(width, rng);
        var order = rng.chance(0.5) ? "big" : "little";
        var address = level >= 3 ? rng.int(16, 240) : 0;
        var bytes = byteArray(raw, width);
        var stored = order === "little" ? bytes.slice().reverse() : bytes;
        return makeQuestion("store_integer_bytes", level, width, "byte-sequence", { raw: raw.toString(), order: order, address: address }, prompt("Store this " + width + "-bit value in " + order + "-endian order.", [hex(raw, width), "addresses " + address + " → " + (address + stored.length - 1)], "Write bytes in increasing-address order."), [field("bytes", "Memory bytes", "bytes", stored.join(" "))], (order === "big" ? "Most" : "Least") + "-significant byte goes first: " + stored.join(" ") + ".", [order, "bytes-" + stored.length, address ? "nonzero-address" : "zero-address"], ["byte-significance"], ["reverse-bits-per-byte"]);
      };

      FAMILY_GENERATORS.load_integer_bytes = function (level, rng) {
        var width = widthForLevel(level, rng, "memory");
        var raw = memoryPattern(width, rng);
        var order = rng.chance(0.5) ? "big" : "little";
        var significant = byteArray(raw, width);
        var memory = order === "little" ? significant.slice().reverse() : significant;
        var address = level >= 3 ? rng.int(16, 240) : 0;
        return makeQuestion("load_integer_bytes", level, width, "byte-sequence-to-hex", { bytes: memory, order: order, address: address }, prompt("Load a " + width + "-bit " + order + "-endian raw value.", ["addresses " + address + " → " + (address + memory.length - 1), memory.join(" ")], "Return an exact-width hexadecimal pattern."), [patternField("pattern", "Raw value", raw, width, "hex")], "Apply " + order + "-endian byte significance: " + hex(raw, width) + ".", [order, "bytes-" + memory.length, address ? "nonzero-address" : "zero-address"], ["inverse"], ["reversing-bits"]);
      };

      FAMILY_GENERATORS.load_subvalue = function (level, rng) {
        var loadWidth = rng.choice(level <= 2 ? [16] : level === 3 ? [16, 24] : [16, 24, 32]);
        var byteCount = loadWidth / 8;
        var outside = rng.int(1, level <= 2 ? 2 : 4);
        var total = byteCount + outside;
        var offset = rng.int(1, outside);
        var memory = [];
        for (var i = 0; i < total; i += 1) memory.push(rng.int(0, 255).toString(16).toUpperCase().padStart(2, "0"));
        var order = rng.chance(0.5) ? "big" : "little";
        var selected = memory.slice(offset, offset + byteCount);
        var raw = fromBytes(selected, order);
        return makeQuestion("load_subvalue", level, loadWidth, "byte-sequence-to-hex", { memory: memory, offset: offset, order: order }, prompt("Load a " + loadWidth + "-bit " + order + "-endian subvalue at byte offset " + offset + ".", ["offsets  0" + Array.from({ length: total - 1 }, function (_, index) { return " " + (index + 1); }).join(" "), "bytes   " + memory.join(" ")], "Select the byte window before decoding."), [patternField("pattern", "Loaded raw value", raw, loadWidth, "hex")], "Selected bytes are " + selected.join(" ") + "; decoded " + order + "-endian they give " + hex(raw, loadWidth) + ".", [order, "offset-" + (offset === 0 ? "zero" : "nonzero"), "bytes-" + byteCount], ["window-selection", "byte-significance"], ["using-whole-array"]);
      };

      FAMILY_GENERATORS.signed_load_interpretation = function (level, rng) {
        var width = widthForLevel(level, rng, "memory");
        var raw = memoryPattern(width, rng, rng.chance(0.5));
        var order = rng.chance(0.5) ? "big" : "little";
        var bytes = byteArray(raw, width);
        var memory = order === "little" ? bytes.slice().reverse() : bytes;
        return makeQuestion("signed_load_interpretation", level, width, "byte-sequence", { memory: memory, order: order }, prompt("Load these bytes as a " + width + "-bit " + order + "-endian signed two's-complement integer.", [memory.join(" ")], "Reconstruct raw bits first, then interpret signed."), [patternField("raw", "Raw hex pattern", raw, width, "hex"), field("signed", "Signed decimal", "integer", toSigned(raw, width))], "Raw reconstruction gives " + hex(raw, width) + ". Its top value bit makes the signed interpretation " + toSigned(raw, width) + ".", [order, toSigned(raw, width) < 0n ? "negative" : "nonnegative", "bytes-" + memory.length], ["two-stage"], ["sign-from-first-displayed-byte"]);
      };

      function serializePrompt(promptData) {
        return [promptData.title].concat(promptData.rows || []).concat([promptData.note || ""]).join("\n");
      }

      function generateQuestion(familyId, level, seed, ignoreHistory) {
        var family = familyById(familyId);
        var generator = FAMILY_GENERATORS[family.id];
        if (!generator) throw new Error("Missing generator for " + family.id);
        var candidate;
        var attempts = 0;
        var localRng = new Rng(seed);
        do {
          candidate = generator(level, localRng);
          candidate = localizeQuestion(candidate);
          candidate.parameters.seed = seed >>> 0;
          candidate.parameters.generationAttempt = attempts;
          attempts += 1;
        } while (!ignoreHistory && attempts < 100 && (recentSignatures.includes(candidate.structuralSignature) || recentPrompts.includes(serializePrompt(candidate.prompt))));
        if (!ignoreHistory && attempts >= 100 && typeof console !== "undefined") console.warn("Question uniqueness fallback", familyId, level, seed);
        validateQuestion(candidate);
        return candidate;
      }

      function validateQuestion(question) {
        var required = ["categoryId", "subcategoryId", "familyId", "level", "width", "representation", "difficultyDimensions", "misconceptionsTargeted", "parameters", "canonicalAnswer", "structuralSignature"];
        required.forEach(function (key) {
          if (question[key] === undefined || (question[key] === null && key !== "width")) throw new Error("Missing question metadata: " + key);
        });
        if (!FAMILY_GENERATORS[question.familyId]) throw new Error("Unknown family " + question.familyId);
        if (!question.answer.fields.length) throw new Error("Question has no answer fields");
        question.answer.fields.forEach(function (answerField) {
          if (!Object.prototype.hasOwnProperty.call(question.canonicalAnswer, answerField.id)) throw new Error("Missing canonical answer field " + answerField.id);
          if ((answerField.kind === "binaryPattern" || answerField.kind === "hexPattern" || answerField.kind === "octalPattern") && answerField.value.length !== digitsFor(questionFieldWidth(question, answerField), answerField.kind === "binaryPattern" ? 2 : answerField.kind === "octalPattern" ? 8 : 16)) {
            throw new Error("Wrong canonical pattern width for " + question.familyId + ":" + answerField.id);
          }
          if (answerField.kind === "choice" || answerField.kind === "boolean") {
            var matches = answerField.options.filter(function (option) { return option.value === answerField.value; });
            if (matches.length !== 1) throw new Error("Choice must have one correct option");
          }
        });
        if (/\{[a-zA-Z][^}]*\}/.test(serializePrompt(question.prompt))) throw new Error("Unresolved placeholder");
      }

      function questionFieldWidth(question, answerField) {
        if (question.familyId === "extract_field") return question.parameters.hi - question.parameters.lo + 1;
        if (question.familyId === "extend_pattern") return question.parameters.destinationWidth;
        if (question.familyId === "truncate_pattern") return question.parameters.destinationWidth;
        return question.width;
      }

      function normalizeDigits(text, kind) {
        var clean = String(text).trim().toLowerCase().replace(/[\s_]/g, "");
        if (kind === "binaryPattern") clean = clean.replace(/^0b/, "");
        if (kind === "hexPattern") clean = clean.replace(/^0x/, "");
        if (kind === "octalPattern") clean = clean.replace(/^0o/, "");
        var pattern = kind === "binaryPattern" ? /^[01]+$/ : kind === "octalPattern" ? /^[0-7]+$/ : /^[0-9a-f]+$/;
        return pattern.test(clean) ? clean.toUpperCase() : null;
      }

      function normalizeInteger(text) {
        var clean = String(text).trim();
        if (!/^[+-]?\d+$/.test(clean)) return null;
        try {
          return BigInt(clean).toString();
        } catch (error) {
          return null;
        }
      }

      function normalizeHexInteger(text) {
        var clean = String(text).trim().toLowerCase().replace(/[\s_]/g, "");
        if (!/^[+-]?(?:0x)?[0-9a-f]+$/.test(clean)) return null;
        var sign = "";
        if (clean[0] === "+" || clean[0] === "-") {
          sign = clean[0];
          clean = clean.slice(1);
        }
        clean = clean.replace(/^0x/, "");
        try {
          var value = BigInt("0x" + clean);
          if (sign === "-") value = -value;
          return value.toString();
        } catch (error) {
          return null;
        }
      }

      function normalizeBoolean(text) {
        var clean = String(text).trim().toLowerCase();
        if (["yes", "true", "1", "ja"].includes(clean)) return "yes";
        if (["no", "false", "0", "nej"].includes(clean)) return "no";
        return null;
      }

      function normalizePositions(text) {
        var clean = String(text).trim().toLowerCase();
        if (clean === "none" || clean === "inga") return "";
        if (!clean || !/^\d+(?:[\s,]+\d+)*$/.test(clean)) return null;
        var values = clean.split(/[\s,]+/).map(Number);
        values = Array.from(new Set(values)).sort(function (a, b) { return a - b; });
        return values.join(",");
      }

      function normalizeBytes(text) {
        var clean = String(text).trim().toUpperCase().replace(/0X/g, "");
        var parts = clean.split(/[\s,-]+/).filter(Boolean);
        if (!parts.length || parts.some(function (part) { return !/^[0-9A-F]{2}$/.test(part); })) return null;
        return parts.join(" ");
      }

      function normalizeFieldAnswer(answerField, value) {
        if (answerField.kind === "integer") return normalizeInteger(value);
        if (answerField.kind === "hexInteger") return normalizeHexInteger(value);
        if (["binaryPattern", "hexPattern", "octalPattern"].includes(answerField.kind)) return normalizeDigits(value, answerField.kind);
        if (answerField.kind === "boolean") return normalizeBoolean(value);
        if (answerField.kind === "positions") return normalizePositions(value);
        if (answerField.kind === "bytes") return normalizeBytes(value);
        if (answerField.kind === "choice") return String(value).trim();
        return String(value).trim();
      }

      function checkQuestion(answers, question) {
        var parts = {};
        var allCorrect = true;
        question.answer.fields.forEach(function (answerField) {
          var normalized = normalizeFieldAnswer(answerField, answers[answerField.id] || "");
          var expected = normalizeFieldAnswer(answerField, answerField.value);
          var correct = normalized !== null && normalized === expected;
          parts[answerField.id] = { correct: correct, normalized: normalized, expected: expected, label: answerField.label };
          if (!correct) allCorrect = false;
        });
        return { correct: allCorrect, parts: parts, expectedText: expectedDisplay(question), explanation: question.feedback.worked };
      }

      function expectedDisplay(question) {
        return question.answer.fields.map(function (answerField) {
          var value = answerField.value;
          if (answerField.kind === "binaryPattern") value = groupBinary(value);
          if (answerField.kind === "hexPattern") value = "0x" + value;
          if (answerField.kind === "octalPattern") value = "0o" + value;
          if (answerField.kind === "positions" && !value) value = t("answers.none", "none");
          if (answerField.options) {
            var selected = answerField.options.find(function (option) { return option.value === answerField.value; });
            if (selected) value = selected.label;
          }
          return answerField.label + " = " + value;
        }).join("; ");
      }

      function createDefaultProgress() {
        var enabled = {};
        CATEGORIES.forEach(function (category) { enabled[category.id] = true; });
        return {
          version: 2,
          view: "practice",
          settings: { adaptive: true, groupBits: true, includeOctal: false, enabled: enabled },
          manual: { categoryId: CATEGORIES[0].id, familyId: FAMILIES[0].id, level: 1 },
          stats: {},
          history: []
        };
      }

      function mergeProgress(base, stored) {
        if (!stored || typeof stored !== "object") return base;
        if (stored.version !== 2) return base;
        base.view = ["practice", "matrix", "stats", "learn", "settings"].includes(stored.view) ? stored.view : base.view;
        if (stored.settings && typeof stored.settings === "object") {
          base.settings.adaptive = stored.settings.adaptive !== false;
          base.settings.groupBits = stored.settings.groupBits !== false;
          base.settings.includeOctal = !!stored.settings.includeOctal;
          if (stored.settings.enabled) Object.assign(base.settings.enabled, stored.settings.enabled);
        }
        if (stored.manual && familyById(stored.manual.familyId).id === stored.manual.familyId) {
          base.manual.categoryId = familyById(stored.manual.familyId).categoryId;
          base.manual.familyId = stored.manual.familyId;
          base.manual.level = clamp(Number(stored.manual.level) || 1, 1, 5);
        }
        if (stored.stats && typeof stored.stats === "object") base.stats = stored.stats;
        if (Array.isArray(stored.history)) base.history = stored.history.slice(-250);
        return base;
      }

      function loadProgress() {
        try {
          var stored = localStorage.getItem(STORAGE_KEY);
          if (stored) return mergeProgress(createDefaultProgress(), JSON.parse(stored));
          if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
            var migrated = createDefaultProgress();
            migrated.history.push({ type: "migration", source: LEGACY_STORAGE_KEY, at: Date.now() });
            return migrated;
          }
        } catch (error) {
          console.warn("Could not load progress", error);
        }
        return createDefaultProgress();
      }

      function saveProgress() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
          console.warn("Could not save progress", error);
        }
      }

      function statKey(familyId, level) {
        return familyId + ":" + level;
      }

      function getStat(familyId, level) {
        var key = statKey(familyId, level);
        if (!progress.stats[key]) progress.stats[key] = { attempts: 0, correct: 0, totalMs: 0, streak: 0, mastery: 0, recent: [], misconceptions: {}, representations: {}, dimensions: {} };
        return progress.stats[key];
      }

      function accuracy(stat) {
        return stat.attempts ? Math.round(100 * stat.correct / stat.attempts) : 0;
      }

      function recentAccuracy(stat) {
        return stat.recent && stat.recent.length ? stat.recent.filter(Boolean).length / stat.recent.length : 0;
      }

      function timeText(ms) {
        if (!ms) return "0s";
        if (ms < 60000) return Math.round(ms / 100) / 10 + "s";
        return Math.round(ms / 6000) / 10 + "m";
      }

      function allCells() {
        var cells = [];
        FAMILIES.forEach(function (family) {
          LEVELS.forEach(function (level) {
            cells.push({ family: family, category: categoryById(family.categoryId), level: level, stat: getStat(family.id, level) });
          });
        });
        return cells;
      }

      function levelUnlocked(familyId, level) {
        if (level === 1) return true;
        var previous = getStat(familyId, level - 1);
        return previous.attempts >= 5 && recentAccuracy(previous) >= 0.8;
      }

      function prerequisitesMet(family) {
        return (PREREQUISITES[family.id] || []).every(function (prerequisiteId) {
          var evidence = LEVELS.reduce(function (result, level) {
            var stat = getStat(prerequisiteId, level);
            result.attempts += stat.attempts;
            result.correct += stat.correct;
            return result;
          }, { attempts: 0, correct: 0 });
          return evidence.attempts >= 3 && evidence.correct / evidence.attempts >= 0.67;
        });
      }

      function eligibleFamilies() {
        return FAMILIES.filter(function (family) {
          if (progress.settings.enabled[family.categoryId] === false) return false;
          if (family.id === "binary_octal_grouping" && !progress.settings.includeOctal) return false;
          return prerequisitesMet(family);
        });
      }

      function chooseAdaptiveCell() {
        var cells = [];
        eligibleFamilies().forEach(function (family) {
          var available = LEVELS.filter(function (level) { return levelUnlocked(family.id, level); });
          var level = available[available.length - 1] || 1;
          if (getStat(family.id, level).attempts >= 7 && recentAccuracy(getStat(family.id, level)) < 0.65 && level > 1) level -= 1;
          cells.push({ family: family, level: level, stat: getStat(family.id, level) });
        });
        if (!cells.length) {
          var enabledFallback = FAMILIES.find(function (family) {
            return progress.settings.enabled[family.categoryId] !== false && (family.id !== "binary_octal_grouping" || progress.settings.includeOctal);
          }) || FAMILIES[0];
          cells = [{ family: enabledFallback, level: 1, stat: getStat(enabledFallback.id, 1) }];
        }
        var mode = sessionRng.int(1, 100);
        if (mode <= 50) {
          cells.sort(function (a, b) { return (a.stat.mastery || 0) - (b.stat.mastery || 0) || a.stat.attempts - b.stat.attempts; });
          return sessionRng.choice(cells.slice(0, Math.min(8, cells.length)));
        }
        if (mode <= 75) {
          var practiced = cells.filter(function (cell) { return cell.stat.attempts >= 5; });
          return sessionRng.choice(practiced.length ? practiced : cells);
        }
        if (mode <= 90) {
          var diagnostic = cells.filter(function (cell) { return cell.stat.recent && recentAccuracy(cell.stat) < 0.8; });
          return sessionRng.choice(diagnostic.length ? diagnostic : cells);
        }
        var stretch = cells.map(function (cell) {
          return { family: cell.family, level: Math.min(5, cell.level + (levelUnlocked(cell.family.id, cell.level + 1) ? 1 : 0)), stat: cell.stat };
        });
        return sessionRng.choice(stretch);
      }

      function startQuestion() {
        if (isPaused) resumePractice();
        var selection = progress.settings.adaptive
          ? chooseAdaptiveCell()
          : { family: familyById(progress.manual.familyId), level: progress.manual.level };
        var seed = sessionRng.next();
        currentQuestion = generateQuestion(selection.family.id, selection.level, seed, false);
        recentSignatures.push(currentQuestion.structuralSignature);
        recentPrompts.push(serializePrompt(currentQuestion.prompt));
        recentSignatures = recentSignatures.slice(-20);
        recentPrompts = recentPrompts.slice(-100);
        currentStartedAt = Date.now();
        pausedMs = 0;
        pauseStartedAt = 0;
        submitted = false;
        renderQuestion();
        renderPracticeControls();
        renderCurrentMetrics();
      }

      function questionElapsedMs() {
        var activePause = isPaused && pauseStartedAt ? Date.now() - pauseStartedAt : 0;
        return Math.max(0, Date.now() - currentStartedAt - pausedMs - activePause);
      }

      function recordResult(question, result, elapsedMs) {
        var stat = getStat(question.familyId, question.level);
        stat.attempts += 1;
        stat.correct += result.correct ? 1 : 0;
        stat.totalMs += elapsedMs;
        stat.streak = result.correct ? stat.streak + 1 : 0;
        stat.recent = (stat.recent || []).concat([result.correct]).slice(-10);
        var recency = recentAccuracy(stat);
        var evidence = Math.min(1, stat.attempts / 5);
        stat.mastery = Math.round(100 * evidence * recency);
        stat.representations[question.representation] = (stat.representations[question.representation] || 0) + 1;
        question.difficultyDimensions.forEach(function (dimension) { stat.dimensions[dimension] = (stat.dimensions[dimension] || 0) + 1; });
        if (!result.correct) {
          question.misconceptionsTargeted.forEach(function (misconception) { stat.misconceptions[misconception] = (stat.misconceptions[misconception] || 0) + 1; });
        }
        progress.history.push({
          at: Date.now(),
          familyId: question.familyId,
          level: question.level,
          seed: question.parameters.seed,
          signature: question.structuralSignature,
          representation: question.representation,
          correct: result.correct,
          elapsedMs: elapsedMs,
          parts: result.parts
        });
        progress.history = progress.history.slice(-250);
        saveProgress();
      }

      function renderPrompt(promptData) {
        var container = document.getElementById("questionPrompt");
        container.innerHTML = "";
        container.classList.toggle("stack", (promptData.rows || []).length > 0);
        var title = document.createElement("div");
        title.textContent = promptData.title;
        container.appendChild(title);
        (promptData.rows || []).forEach(function (row) {
          var line = document.createElement("div");
          line.className = "prompt-row";
          line.textContent = row;
          container.appendChild(line);
        });
        if (promptData.note) {
          var note = document.createElement("div");
          note.className = "prompt-note";
          note.textContent = promptData.note;
          container.appendChild(note);
        }
      }

      function renderAnswerControls() {
        var container = document.getElementById("answerControls");
        container.innerHTML = "";
        activeAnswerInput = null;
        currentQuestion.answer.fields.forEach(function (answerField) {
          var wrapper = document.createElement("div");
          wrapper.className = "answer-control";
          var label = document.createElement("label");
          label.textContent = answerField.label;
          label.htmlFor = "answer-" + answerField.id;
          wrapper.appendChild(label);
          if (answerField.options) {
            var select = document.createElement("select");
            select.id = "answer-" + answerField.id;
            select.dataset.answerField = answerField.id;
            var placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = t("practice.choose", "Choose…");
            select.appendChild(placeholder);
            answerField.options.forEach(function (option) {
              var optionElement = document.createElement("option");
              optionElement.value = option.value;
              optionElement.textContent = option.label;
              select.appendChild(optionElement);
            });
            wrapper.appendChild(select);
          } else {
            var input = document.createElement("input");
            input.id = "answer-" + answerField.id;
            input.dataset.answerField = answerField.id;
            input.type = "text";
            input.autocomplete = "off";
            input.spellcheck = false;
            input.inputMode = answerField.kind === "integer" ? "numeric" : "text";
            input.dataset.inputKind = answerField.kind;
            input.addEventListener("focus", function () {
              activeAnswerInput = input;
              updateKeypadState();
            });
            wrapper.appendChild(input);
            if (!activeAnswerInput) activeAnswerInput = input;
          }
          container.appendChild(wrapper);
        });
        updateKeypadState();
      }

      function keypadAllowedInputIds(kind) {
        return KEYPAD_ALLOWED_BY_KIND[kind] || [];
      }

      function updateKeypadState() {
        if (!keypadButtons) return;
        var editable = Boolean(activeAnswerInput && !activeAnswerInput.disabled && !isPaused && !submitted);
        var allowed = editable ? keypadAllowedInputIds(activeAnswerInput.dataset.inputKind) : [];
        KEYPAD_INPUT_BUTTON_IDS.forEach(function (id) {
          var button = keypadButtons.get(id);
          if (button) button.disabled = !allowed.includes(id);
        });
        ["delete", "clear"].forEach(function (id) {
          var button = keypadButtons.get(id);
          if (button) button.disabled = !editable;
        });
        var submitButton = keypadButtons.get("submit");
        if (submitButton) submitButton.disabled = isPaused;
      }

      function renderQuestion() {
        var family = familyById(currentQuestion.familyId);
        var category = categoryById(currentQuestion.categoryId);
        document.getElementById("questionCategory").textContent = category.title;
        document.getElementById("questionFamily").textContent = family.title;
        document.getElementById("questionLevel").textContent = t("practice.level", "Level") + " " + currentQuestion.level;
        renderPrompt(currentQuestion.prompt);
        renderAnswerControls();
        document.getElementById("feedback").className = "feedback hidden";
        document.getElementById("submitBtn").disabled = false;
        document.getElementById("submitBtn").innerHTML = t("practice.check", "Check") + " <span class=\"key-symbol\">↵</span>";
        document.getElementById("nextBtn").classList.add("hidden");
        document.getElementById("skipBtn").classList.remove("hidden");
        keypadButtons.get("submit").textContent = t("practice.check", "Check");
        renderPauseState();
        window.setTimeout(function () {
          if (activeAnswerInput && shouldAutoFocusAnswer()) activeAnswerInput.focus();
        }, 0);
      }

      function shouldAutoFocusAnswer() {
        return window.matchMedia ? window.matchMedia("(pointer: fine)").matches : true;
      }

      function collectAnswers() {
        var answers = {};
        document.querySelectorAll("[data-answer-field]").forEach(function (control) {
          answers[control.dataset.answerField] = control.value;
        });
        return answers;
      }

      function showFeedback(result, elapsedMs) {
        var feedback = document.getElementById("feedback");
        feedback.className = "feedback " + (result.correct ? "correct" : "incorrect");
        feedback.innerHTML = "";
        var strong = document.createElement("strong");
        strong.textContent = result.correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite");
        feedback.appendChild(strong);
        if (!result.correct) {
          var expected = document.createElement("div");
          expected.className = "expected-code";
          expected.textContent = t("messages.expected", "Expected") + ": " + result.expectedText;
          feedback.appendChild(expected);
          var missed = Object.keys(result.parts).filter(function (id) { return !result.parts[id].correct; }).map(function (id) { return result.parts[id].label; });
          var diagnosis = document.createElement("div");
          diagnosis.textContent = diagnoseAnswer(currentQuestion, result, missed);
          feedback.appendChild(diagnosis);
        }
        var details = document.createElement("div");
        details.textContent = result.explanation + " " + t("messages.time", "Time") + ": " + timeText(elapsedMs) + ".";
        feedback.appendChild(details);
      }

      function diagnoseAnswer(question, result, missed) {
        var wrongPattern = question.answer.fields.find(function (answerField) {
          if (!["binaryPattern", "hexPattern", "octalPattern"].includes(answerField.kind) || result.parts[answerField.id].correct) return false;
          var normalized = result.parts[answerField.id].normalized;
          return normalized && normalized.length !== answerField.value.length;
        });
        if (wrongPattern) return localizeGeneratedString("Keep exactly " + wrongPattern.value.length + " digits: this answer is a fixed-width pattern, not just a numeric value.");
        var resultCorrect = result.parts.result && result.parts.result.correct;
        var statusWrong = ["carry", "borrow", "overflow", "status"].some(function (id) { return result.parts[id] && !result.parts[id].correct; });
        if (resultCorrect && statusWrong) return localizeGeneratedString("Your wrapped result is right. Classify carry, borrow, and signed overflow independently from the exact operation.");
        if (question.familyId === "test_masked_flags") return localizeGeneratedString("Apply the named predicate literally: “any” needs one selected bit; “all” needs every selected bit.");
        if (question.familyId === "insert_field") return localizeGeneratedString("Clear the destination field before OR-ing the aligned replacement; bits outside the field stay unchanged.");
        if (question.familyId.indexOf("load") >= 0 || question.familyId === "store_integer_bytes") return localizeGeneratedString("Keep the bytes intact. Endianness changes byte significance, not bit order inside each byte.");
        return t("messages.checkFields", "Check") + ": " + missed.join(", ") + ". " + question.feedback.correct;
      }

      function submitAnswer(event) {
        event.preventDefault();
        if (!currentQuestion || isPaused) return;
        if (submitted) {
          startQuestion();
          return;
        }
        var result = checkQuestion(collectAnswers(), currentQuestion);
        var elapsedMs = questionElapsedMs();
        recordResult(currentQuestion, result, elapsedMs);
        submitted = true;
        document.querySelectorAll("[data-answer-field]").forEach(function (control) { control.disabled = true; });
        updateKeypadState();
        document.getElementById("submitBtn").innerHTML = t("practice.next", "Next") + " <span class=\"key-symbol\">↵</span>";
        document.getElementById("nextBtn").classList.remove("hidden");
        document.getElementById("skipBtn").classList.add("hidden");
        keypadButtons.get("submit").textContent = t("practice.next", "Next");
        showFeedback(result, elapsedMs);
        renderCurrentMetrics();
        renderSummary();
      }

      function pausePractice() {
        if (isPaused || submitted) return;
        isPaused = true;
        pauseStartedAt = Date.now();
        renderPauseState();
      }

      function resumePractice() {
        if (!isPaused) return;
        pausedMs += Date.now() - pauseStartedAt;
        pauseStartedAt = 0;
        isPaused = false;
        renderPauseState();
      }

      function renderPauseState() {
        document.querySelector(".practice-main").classList.toggle("paused", isPaused);
        document.getElementById("pauseBtn").disabled = isPaused || submitted;
        updateKeypadState();
      }

      function renderModeButtons() {
        document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active", progress.settings.adaptive);
        document.getElementById("manualModeBtn").classList.toggle("secondary-active", !progress.settings.adaptive);
      }

      function renderPracticeControls() {
        var family = currentQuestion ? familyById(currentQuestion.familyId) : familyById(progress.manual.familyId);
        selectorController.render({ familyId: family.id, level: currentQuestion ? currentQuestion.level : progress.manual.level });
      }

      function renderCurrentMetrics() {
        if (!currentQuestion) return;
        var stat = getStat(currentQuestion.familyId, currentQuestion.level);
        document.getElementById("metricMastery").textContent = Math.round(stat.mastery || 0) + "%";
        document.getElementById("metricAccuracy").textContent = accuracy(stat) + "%";
        document.getElementById("metricStreak").textContent = String(stat.streak || 0);
        document.getElementById("metricAvgTime").textContent = timeText(stat.attempts ? stat.totalMs / stat.attempts : 0);
        var mastery = document.getElementById("questionMastery");
        mastery.textContent = Math.round(stat.mastery || 0) + "% " + t("practice.masterySuffix", "mastery");
        mastery.className = "pill " + ((stat.mastery || 0) >= 75 ? "good" : "warn");
      }

      function renderSummary() {
        var cells = allCells();
        var practiced = cells.filter(function (cell) { return cell.stat.attempts > 0; });
        var attempts = practiced.reduce(function (sum, cell) { return sum + cell.stat.attempts; }, 0);
        var correct = practiced.reduce(function (sum, cell) { return sum + cell.stat.correct; }, 0);
        var mastery = practiced.length ? practiced.reduce(function (sum, cell) { return sum + (cell.stat.mastery || 0); }, 0) / practiced.length : 0;
        document.getElementById("summaryMastery").textContent = Math.round(mastery) + "%";
        document.getElementById("summaryAccuracy").textContent = (attempts ? Math.round(100 * correct / attempts) : 0) + "%";
        document.getElementById("summaryAttempts").textContent = String(attempts);
      }

      function renderMatrix() {
        var container = document.getElementById("matrix");
        container.innerHTML = "";
        CATEGORIES.forEach(function (category) {
          var heading = document.createElement("h3");
          heading.className = "matrix-heading";
          heading.textContent = category.title;
          container.appendChild(heading);
          var table = document.createElement("table");
          var thead = document.createElement("thead");
          thead.innerHTML = "<tr><th>" + t("practice.family", "Family") + "</th>" + LEVELS.map(function (level) { return "<th>L" + level + "</th>"; }).join("") + "</tr>";
          table.appendChild(thead);
          var tbody = document.createElement("tbody");
          familiesForCategory(category.id).forEach(function (family) {
            if (family.id === "binary_octal_grouping" && !progress.settings.includeOctal) return;
            var row = document.createElement("tr");
            var name = document.createElement("td");
            name.innerHTML = "<strong></strong><span class=\"subcategory-label\"></span>";
            name.querySelector("strong").textContent = family.title;
            name.querySelector("span").textContent = family.subcategory;
            row.appendChild(name);
            LEVELS.forEach(function (level) {
              var stat = getStat(family.id, level);
              var cell = document.createElement("td");
              cell.className = "level-cell";
              var button = document.createElement("button");
              button.type = "button";
              button.className = "level-button";
              button.dataset.familyId = family.id;
              button.dataset.level = String(level);
              if (stat.attempts >= 3 && stat.mastery < 45) button.classList.add("weak");
              if (stat.mastery >= 75) button.classList.add("ready");
              button.innerHTML = "<strong>" + Math.round(stat.mastery || 0) + "%</strong><span>" + stat.attempts + " " + t("stats.tries", "tries") + "</span><div class=\"bar\"><span style=\"width:" + clamp(stat.mastery || 0, 0, 100) + "%\"></span></div>";
              cell.appendChild(button);
              row.appendChild(cell);
            });
            tbody.appendChild(row);
          });
          table.appendChild(tbody);
          container.appendChild(table);
        });
      }

      function renderStats() {
        var cells = allCells();
        var practiced = cells.filter(function (cell) { return cell.stat.attempts > 0; });
        var totals = practiced.reduce(function (result, cell) {
          result.attempts += cell.stat.attempts;
          result.correct += cell.stat.correct;
          result.totalMs += cell.stat.totalMs;
          return result;
        }, { attempts: 0, correct: 0, totalMs: 0 });
        document.getElementById("statTotalAttempts").textContent = String(totals.attempts);
        document.getElementById("statTotalCorrect").textContent = String(totals.correct);
        document.getElementById("statTotalTime").textContent = timeText(totals.totalMs);
        document.getElementById("statActiveCells").textContent = practiced.length + "/" + allCells().length;
        var weak = practiced.slice().sort(function (a, b) { return (a.stat.mastery || 0) - (b.stat.mastery || 0); }).slice(0, 8);
        var strong = practiced.slice().sort(function (a, b) { return (b.stat.mastery || 0) - (a.stat.mastery || 0); }).slice(0, 8);
        renderRankedList("weakList", weak);
        renderRankedList("strongList", strong);
      }

      function renderRankedList(id, cells) {
        var container = document.getElementById(id);
        container.innerHTML = "";
        if (!cells.length) {
          var empty = document.createElement("div");
          empty.className = "list-item";
          empty.textContent = t("stats.noAttemptsYet", "No attempts yet");
          container.appendChild(empty);
          return;
        }
        cells.forEach(function (cell) {
          var item = document.createElement("button");
          item.type = "button";
          item.className = "list-item";
          item.dataset.familyId = cell.family.id;
          item.dataset.level = String(cell.level);
          item.innerHTML = "<div><strong></strong><span></span></div><span class=\"pill\"></span>";
          item.querySelector("strong").textContent = cell.family.title + " L" + cell.level;
          item.querySelector("div span").textContent = cell.stat.attempts + " " + t("stats.tries", "tries") + ", " + accuracy(cell.stat) + "%";
          item.querySelector(".pill").textContent = Math.round(cell.stat.mastery || 0) + "%";
          container.appendChild(item);
        });
      }

      function renderSettings() {
        document.getElementById("groupBitsToggle").checked = !!progress.settings.groupBits;
        document.getElementById("octalToggle").checked = !!progress.settings.includeOctal;
        var container = document.getElementById("enabledCategories");
        container.innerHTML = "";
        CATEGORIES.forEach(function (category) {
          var label = document.createElement("label");
          label.className = "check-row";
          var input = document.createElement("input");
          input.type = "checkbox";
          input.checked = progress.settings.enabled[category.id] !== false;
          input.dataset.categoryId = category.id;
          var span = document.createElement("span");
          span.textContent = category.title;
          label.appendChild(input);
          label.appendChild(span);
          container.appendChild(label);
        });
      }

      function renderLearn() {
        var container = document.getElementById("learnGrid");
        container.innerHTML = "";
        CATEGORIES.forEach(function (category) {
          var section = document.createElement("section");
          section.className = "learn-category";
          var heading = document.createElement("h2");
          heading.textContent = category.title;
          section.appendChild(heading);
          var grid = document.createElement("div");
          grid.className = "learn-category-grid";
          familiesForCategory(category.id).forEach(function (family) {
            var card = document.createElement("article");
            card.className = "learn-card";
            card.id = "learn-card-" + family.id;
            if (family.id === learnSpotlightId) card.classList.add("spotlight");
            var title = document.createElement("h3");
            title.textContent = family.title;
            var concept = document.createElement("p");
            concept.textContent = family.learn.concept;
            var rules = document.createElement("p");
            rules.textContent = family.learn.rules;
            var example = document.createElement("code");
            example.textContent = family.learn.example;
            card.appendChild(title);
            card.appendChild(concept);
            card.appendChild(rules);
            card.appendChild(example);
            grid.appendChild(card);
          });
          section.appendChild(grid);
          container.appendChild(section);
        });
        if (learnSpotlightId) window.setTimeout(function () {
          var card = document.getElementById("learn-card-" + learnSpotlightId);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
      }

      function renderAll() {
        document.querySelectorAll(".view").forEach(function (view) { view.classList.toggle("active", view.id === "view-" + progress.view); });
        document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("active", button.dataset.view === progress.view); });
        renderSummary();
        renderModeButtons();
        renderPracticeControls();
        renderCurrentMetrics();
        if (progress.view === "matrix") renderMatrix();
        if (progress.view === "stats") renderStats();
        if (progress.view === "settings") renderSettings();
        if (progress.view === "learn") renderLearn();
      }

      function setView(view) {
        if (view !== "learn") learnSpotlightId = null;
        progress.view = view;
        saveProgress();
        renderAll();
        if (view === "practice" && !currentQuestion) startQuestion();
      }

      function setManualSelection(familyId, level) {
        var family = familyById(familyId);
        progress.manual.categoryId = family.categoryId;
        progress.manual.familyId = family.id;
        progress.manual.level = clamp(Number(level) || 1, 1, 5);
        progress.settings.adaptive = false;
        saveProgress();
        startQuestion();
      }

      function copyProgress() {
        var box = document.getElementById("dataBox");
        if (!box.value.trim()) box.value = JSON.stringify(progress, null, 2);
        PracticeLabUI.copyText(box.value);
      }

      function importProgress() {
        var box = document.getElementById("dataBox");
        try {
          progress = mergeProgress(createDefaultProgress(), JSON.parse(box.value));
          saveProgress();
          currentQuestion = null;
          renderAll();
          if (progress.view === "practice") startQuestion();
        } catch (error) {
          box.value = t("messages.invalidJson", "Invalid JSON") + ": " + error.message;
        }
      }

      function resetProgress() {
        if (!window.confirm(t("messages.resetConfirm", "Reset all local progress?"))) return;
        progress = createDefaultProgress();
        saveProgress();
        currentQuestion = null;
        renderAll();
        startQuestion();
      }

      function wireEvents() {
        selectorController = PracticeLabUI.createPracticeSelectors({
          categorySelect: document.getElementById("categorySelect"),
          familySelect: document.getElementById("familySelect"),
          levelSelect: document.getElementById("levelSelect"),
          categories: CATEGORIES,
          families: FAMILIES,
          familyFilter: function (family) { return family.id !== "binary_octal_grouping" || progress.settings.includeOctal; },
          levelLabel: function (level) { return t("practice.level", "Level") + " " + level; },
          onSelect: function (selection) { setManualSelection(selection.familyId, selection.level); }
        });
        var editor = PracticeLabUI.createTextEditor(function () { return isPaused ? null : activeAnswerInput; });
        keypadButtons = PracticeLabUI.renderInputGrid(document.getElementById("answerKeypad"), [
          [["D", editor.insert("D"), { id: "hexD" }], ["E", editor.insert("E"), { id: "hexE" }], ["F", editor.insert("F"), { id: "hexF" }], ["+", editor.insert("+"), { id: "plus", variant: "function" }], ["0x", editor.insert("0x"), { id: "hexPrefix", variant: "function" }]],
          [["A", editor.insert("A"), { id: "hexA" }], ["B", editor.insert("B"), { id: "hexB" }], ["C", editor.insert("C"), { id: "hexC" }], ["-", editor.insert("-"), { id: "minus", variant: "function" }], ["0o", editor.insert("0o"), { id: "octalPrefix", variant: "function" }]],
          [["7", editor.insert("7"), { id: "digit7" }], ["8", editor.insert("8"), { id: "digit8" }], ["9", editor.insert("9"), { id: "digit9" }], ["␣", editor.insert(" "), { id: "space", variant: "function", ariaLabel: "space" }], [t("practice.delete", "Delete"), editor.backspace, { id: "delete", variant: "function" }]],
          [["4", editor.insert("4"), { id: "digit4" }], ["5", editor.insert("5"), { id: "digit5" }], ["6", editor.insert("6"), { id: "digit6" }], [t("practice.clear", "Clear"), editor.clear, { id: "clear", variant: "function" }], ["", function () {}, { disabled: true, ariaLabel: "spacer" }]],
          [["1", editor.insert("1"), { id: "digit1" }], ["2", editor.insert("2"), { id: "digit2" }], ["3", editor.insert("3"), { id: "digit3" }], ["0", editor.insert("0"), { id: "digit0" }], [t("practice.check", "Check"), function () { document.getElementById("answerForm").requestSubmit(); }, { id: "submit", variant: "primary" }]]
        ]);
        document.querySelectorAll("[data-view]").forEach(function (button) {
          button.addEventListener("click", function () { setView(button.dataset.view); });
        });
        document.getElementById("adaptiveModeBtn").addEventListener("click", function () {
          progress.settings.adaptive = true;
          saveProgress();
          startQuestion();
        });
        document.getElementById("manualModeBtn").addEventListener("click", function () {
          progress.settings.adaptive = false;
          saveProgress();
          startQuestion();
        });
        document.getElementById("pauseBtn").addEventListener("click", pausePractice);
        document.getElementById("resumeBtn").addEventListener("click", resumePractice);
        document.getElementById("learnCurrentBtn").addEventListener("click", function () {
          if (!currentQuestion) return;
          learnSpotlightId = currentQuestion.familyId;
          setView("learn");
        });
        document.getElementById("answerForm").addEventListener("submit", submitAnswer);
        document.getElementById("nextBtn").addEventListener("click", startQuestion);
        document.getElementById("skipBtn").addEventListener("click", startQuestion);
        document.addEventListener("keydown", function (event) {
          if (event.key === "Escape" && isPaused) { event.preventDefault(); resumePractice(); return; }
          if (event.key === "Enter" && submitted && progress.view === "practice" && !(event.target && event.target.tagName === "TEXTAREA")) {
            event.preventDefault();
            startQuestion();
          }
        });
        document.getElementById("matrix").addEventListener("click", function (event) {
          var button = event.target.closest("[data-family-id][data-level]");
          if (!button) return;
          setView("practice");
          setManualSelection(button.dataset.familyId, button.dataset.level);
        });
        ["weakList", "strongList"].forEach(function (id) {
          document.getElementById(id).addEventListener("click", function (event) {
            var button = event.target.closest("[data-family-id][data-level]");
            if (!button) return;
            setView("practice");
            setManualSelection(button.dataset.familyId, button.dataset.level);
          });
        });
        document.getElementById("groupBitsToggle").addEventListener("change", function (event) {
          progress.settings.groupBits = event.target.checked;
          saveProgress();
          if (currentQuestion) renderQuestion();
        });
        document.getElementById("octalToggle").addEventListener("change", function (event) {
          progress.settings.includeOctal = event.target.checked;
          saveProgress();
          renderSettings();
        });
        document.getElementById("enabledCategories").addEventListener("change", function (event) {
          if (!event.target.dataset.categoryId) return;
          progress.settings.enabled[event.target.dataset.categoryId] = event.target.checked;
          saveProgress();
        });
        document.getElementById("exportBtn").addEventListener("click", function () { document.getElementById("dataBox").value = JSON.stringify(progress, null, 2); });
        document.getElementById("copyBtn").addEventListener("click", copyProgress);
        document.getElementById("importBtn").addEventListener("click", importProgress);
        document.getElementById("resetBtn").addEventListener("click", resetProgress);
      }

      function runSelfTests() {
        var failures = [];
        function assert(name, condition) {
          if (!condition) failures.push(name);
        }
        assert("50 families", FAMILIES.length === 50);
        assert("50 generators", Object.keys(FAMILY_GENERATORS).length === 50);
        assert("binary keypad has only bits", keypadAllowedInputIds("binaryPattern").join(",") === "digit0,digit1");
        assert("hex pattern keypad has hexadecimal digits and prefix", ["digit0", "digit9", "hexA", "hexF", "hexPrefix"].every(function (id) { return keypadAllowedInputIds("hexPattern").includes(id); }));
        assert("hex pattern keypad excludes signs and octal", ["plus", "minus", "octalPrefix"].every(function (id) { return !keypadAllowedInputIds("hexPattern").includes(id); }));
        assert("integer keypad excludes hexadecimal keys", ["hexA", "hexPrefix", "octalPrefix", "space"].every(function (id) { return !keypadAllowedInputIds("integer").includes(id); }));
        assert("all keypad mappings name real input buttons", Object.keys(KEYPAD_ALLOWED_BY_KIND).every(function (kind) {
          return keypadAllowedInputIds(kind).every(function (id) { return KEYPAD_INPUT_BUTTON_IDS.includes(id); });
        }));
        [4, 8].forEach(function (width) {
          for (var raw = 0n; raw <= widthMask(width); raw += 1n) {
            assert("signed roundtrip " + width + ":" + raw, modulo(toSigned(raw, width), width) === raw);
            for (var count = 1; count < width; count += 1) {
              assert("ROL/ROR inverse " + width + ":" + raw + ":" + count, rotateRight(rotateLeft(raw, width, count), width, count) === raw);
              var repeated = raw;
              var carry = 0;
              for (var step = 0; step < count; step += 1) {
                carry = Number((repeated >> BigInt(width - 1)) & 1n);
                repeated = modulo(repeated << 1n, width);
              }
              assert("left carry formula " + width + ":" + raw + ":" + count, carry === shiftCarry(raw, width, "left", count));
            }
          }
        });
        for (var containerWidth = 2; containerWidth <= 12; containerWidth += 1) {
          var container = BigInt(containerWidth * 37) & widthMask(containerWidth);
          for (var lo = 0; lo < containerWidth; lo += 1) {
            for (var hi = lo; hi < containerWidth; hi += 1) {
              var fieldWidth = hi - lo + 1;
              var selectedMask = rangeMask(hi, lo);
              var value = BigInt(fieldWidth * 3) & widthMask(fieldWidth);
              var inserted = (container & ((~selectedMask) & widthMask(containerWidth))) | ((value << BigInt(lo)) & selectedMask);
              assert("field roundtrip " + containerWidth + ":" + hi + ":" + lo, ((inserted >> BigInt(lo)) & widthMask(fieldWidth)) === value);
              assert("field preservation " + containerWidth + ":" + hi + ":" + lo, (inserted & ((~selectedMask) & widthMask(containerWidth))) === (container & ((~selectedMask) & widthMask(containerWidth))));
            }
          }
        }
        for (var byteA = 0; byteA < 256; byteA += 17) {
          for (var byteB = 0; byteB < 256; byteB += 17) {
            var bytes = [byteA.toString(16).padStart(2, "0"), byteB.toString(16).padStart(2, "0")];
            var rawBig = fromBytes(bytes, "big");
            var rawLittle = fromBytes(bytes, "little");
            assert("big byte inverse", byteArray(rawBig, 16).join("") === bytes.join("").toUpperCase());
            assert("little byte inverse", byteArray(rawLittle, 16).slice().reverse().join("") === bytes.join("").toUpperCase());
          }
        }
        for (var alignment = 2n; alignment <= 4096n; alignment <<= 1n) {
          for (var address = 0n; address < alignment * 2n; address += 1n) {
            var remainder = address % alignment;
            var down = address - remainder;
            var up = remainder === 0n ? address : address + alignment - remainder;
            assert("align down invariant", down % alignment === 0n && down <= address && address - down < alignment);
            assert("align up invariant", up % alignment === 0n && up >= address && up - address < alignment);
            assert("power-two remainder invariant", remainder === (address & (alignment - 1n)));
          }
        }
        for (var maskWidth = 2; maskWidth <= 12; maskWidth += 1) {
          for (var maskValue = 0n; maskValue <= widthMask(maskWidth); maskValue += 1n) {
            var setPositions = Array.from({ length: maskWidth }, function (_, index) { return index; }).filter(function (index) { return (maskValue & (1n << BigInt(index))) !== 0n; });
            assert("popcount positions " + maskWidth + ":" + maskValue, popcount(maskValue, maskWidth) === setPositions.length);
            if (setPositions.length) {
              var contiguous = setPositions[setPositions.length - 1] - setPositions[0] + 1 === setPositions.length;
              var shiftedRun = widthMask(setPositions.length) << BigInt(setPositions[0]);
              assert("contiguous run " + maskWidth + ":" + maskValue, contiguous === (shiftedRun === maskValue));
            }
          }
        }
        FAMILIES.forEach(function (family, familyIndex) {
          LEVELS.forEach(function (level) {
            for (var sample = 0; sample < 40; sample += 1) {
              try {
                var question = generateQuestion(family.id, level, (familyIndex + 1) * 100000 + level * 1000 + sample + 1, true);
                var result = checkQuestion(question.canonicalAnswer, question);
                assert("canonical accepted " + family.id + ":" + level + ":" + sample, result.correct);
                assert("metadata " + family.id, question.categoryId && question.subcategoryId && question.structuralSignature && question.difficultyDimensions.length > 0);
              } catch (error) {
                failures.push("generator " + family.id + ":" + level + ":" + sample + " " + error.message);
              }
            }
          });
        });
        var malformed = generateQuestion("binary_hex_grouping", 2, 12345, true);
        var malformedAnswer = {};
        malformed.answer.fields.forEach(function (answerField) { malformedAnswer[answerField.id] = answerField.value + "0"; });
        assert("over-width pattern rejected", !checkQuestion(malformedAnswer, malformed).correct);
        if (failures.length) {
          console.error("Self tests failed", failures.slice(0, 50), "total", failures.length);
          return { ok: false, failures: failures.slice(0, 100) };
        }
        console.info("Self tests passed: 50 families, exhaustive low-width/address invariants, 10,000 generated instances");
        return { ok: true, failures: [] };
      }

      function init() {
        progress = loadProgress();
        sessionRng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
        wireEvents();
        renderAll();
        if (progress.view === "practice") startQuestion();
      }

      window.runSelfTests = runSelfTests;
      window.ProgrammerPractice = {
        categories: CATEGORIES,
        families: FAMILIES,
        generateQuestion: generateQuestion,
        checkQuestion: checkQuestion,
        runSelfTests: runSelfTests
      };

      document.addEventListener("DOMContentLoaded", init);
    }());
