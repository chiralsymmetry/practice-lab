    (function () {
      "use strict";

      var STORAGE_KEY = "programmerPractice.v1";
      var TEXT = __LOCALE_TEXT__;
      var LEVELS = [-1, 0, 1, 2, 3, 4, 5];
      var CORE_LEVELS = [1, 2, 3, 4, 5];
      var LEVEL_BITS = {
        "-1": [1],
        0: [2],
        1: [4],
        2: [8],
        3: [12, 16],
        4: [24, 32],
        5: [48, 64]
      };
      var STATUS_WORDS = ["none", "overflow", "underflow"];

      var progress;
      var rng;
      var currentQuestion = null;
      var currentStartedAt = 0;
      var pausedMs = 0;
      var pauseStartedAt = 0;
      var isPaused = false;
      var submitted = false;
      var learnSpotlightId = null;

      function t(path, fallback) {
        var value = path.split(".").reduce(function (current, part) {
          return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
        }, TEXT);
        return value === undefined ? fallback : value;
      }

      var CATEGORIES = [
        {
          id: "powers",
          title: "Powers of Two",
          short: "2^n",
          levels: 5,
          generate: genPowers,
          check: checkExpected
        },
        {
          id: "numeric-views",
          title: "Signed and Unsigned Views",
          short: "Views",
          levels: 5,
          generate: genNumericViews,
          check: checkExpected
        },
        {
          id: "base-bits",
          title: "Bits, Hex, and Octal",
          short: "Bases",
          levels: 5,
          generate: genBaseBits,
          check: checkExpected
        },
        {
          id: "signed-add",
          title: "Two's Complement Addition",
          short: "S Add",
          levels: 5,
          generate: genSignedAdd,
          check: checkExpected
        },
        {
          id: "signed-sub",
          title: "Two's Complement Subtraction",
          short: "S Sub",
          levels: 5,
          generate: genSignedSub,
          check: checkExpected
        },
        {
          id: "unsigned-add",
          title: "Unsigned Addition",
          short: "U Add",
          levels: 5,
          generate: genUnsignedAdd,
          check: checkExpected
        },
        {
          id: "unsigned-sub",
          title: "Unsigned Subtraction",
          short: "U Sub",
          levels: 5,
          generate: genUnsignedSub,
          check: checkExpected
        },
        {
          id: "bitwise",
          title: "Binary Arithmetic and Bitwise",
          short: "Ops",
          levels: 5,
          generate: genBitwise,
          check: checkExpected
        },
        {
          id: "shifts",
          title: "Shifts",
          short: "Shift",
          levels: 5,
          generate: genShifts,
          check: checkExpected
        },
        {
          id: "rotates",
          title: "Rotates",
          short: "Rot",
          levels: 5,
          generate: genRotates,
          check: checkExpected
        },
        {
          id: "endian",
          title: "Endian Memory Order",
          short: "Endian",
          levels: CORE_LEVELS,
          generate: genEndian,
          check: checkExpected
        },
        {
          id: "masks",
          title: "Masks and Flags",
          short: "Masks",
          levels: 5,
          generate: genMasks,
          check: checkExpected
        },
        {
          id: "ranges",
          title: "N-bit Ranges",
          short: "Range",
          levels: 5,
          generate: genRanges,
          check: checkExpected
        },
        {
          id: "extension",
          title: "Extension and Truncation",
          short: "Ext",
          levels: 5,
          generate: genExtension,
          check: checkExpected
        }
      ];

      var LEARN_CARDS = {
        "powers": {
          concept: "Powers of two mark bit positions and common storage sizes.",
          rules: "2^n has one 1 bit followed by n zero bits.",
          example: "2^8 = 256\n1024 = 2^10",
          format: "Decimal number, or exponent n when asked."
        },
        "numeric-views": {
          concept: "The same fixed-width bits can be read as unsigned or signed two's complement.",
          rules: "Unsigned is 0..2^n-1. Signed uses the top bit as negative weight -2^(n-1).",
          example: "8-bit 11111111\nunsigned 255\nsigned -1",
          format: "Decimal value or exact n-bit pattern."
        },
        "base-bits": {
          concept: "Binary groups naturally into hexadecimal nibbles and octal triples.",
          rules: "1 hex digit = 4 bits. 1 octal digit = 3 bits.",
          example: "1010 1111 = 0xAF\n111 101 = 0o75",
          format: "Bits, 0x hex, or 0o octal; spacing is accepted."
        },
        "signed-add": {
          concept: "Two's complement addition wraps to the fixed width; overflow says the exact signed result did not fit.",
          rules: "Overflow: two positives produce a negative. Underflow: two negatives produce a positive.",
          example: "4-bit signed: 0111 + 0001 = 1000 +\nExact 8 is above signed max 7.",
          format: "Result bits plus status: + overflow, - underflow, 0 none."
        },
        "signed-sub": {
          concept: "Two's complement subtraction also wraps; compare the exact answer to the signed range.",
          rules: "For n bits, signed range is -2^(n-1)..2^(n-1)-1.",
          example: "4-bit signed: 1000 - 0001 = 0111 -\nExact -9 is below signed min -8.",
          format: "Result bits plus status: + overflow, - underflow, 0 none."
        },
        "unsigned-add": {
          concept: "Unsigned addition wraps modulo 2^n.",
          rules: "Overflow means the exact result is above 2^n-1.",
          example: "4-bit unsigned: 1111 + 0001 = 0000 +",
          format: "Result bits plus status: + overflow, 0 none."
        },
        "unsigned-sub": {
          concept: "Unsigned subtraction wraps modulo 2^n when subtracting below zero.",
          rules: "Underflow means left operand is smaller than right operand.",
          example: "4-bit unsigned: 0000 - 0001 = 1111 -",
          format: "Result bits plus status: - underflow, 0 none."
        },
        "bitwise": {
          concept: "Bitwise operators act independently on each bit.",
          rules: "& keeps shared 1s, | keeps either 1, ^ keeps different bits, ~ flips bits.",
          example: "1010 & 1100 = 1000\n1010 ^ 1100 = 0110",
          format: "Exact fixed-width result bits."
        },
        "shifts": {
          concept: "Shifts move bits, fill empty positions, and discard shifted-out bits.",
          rules: "Left and logical right fill with 0. Arithmetic right fills with the sign bit. Carry-out is the last bit shifted out.",
          example: "1011 >>> 1 = 0101 carry 1\n1011 >> 1 = 1101 carry 1",
          format: "Result bits, or result bits plus carry-out bit when asked."
        },
        "rotates": {
          concept: "Rotates shift bits around the ends instead of discarding them.",
          rules: "Rotate left moves high bits to the low end. Rotate right moves low bits to the high end.",
          example: "1001 rol 1 = 0011\n1001 ror 1 = 1100",
          format: "Exact fixed-width result bits."
        },
        "endian": {
          concept: "Endianness is byte order in memory, not bit order inside each byte.",
          rules: "Big-endian stores most significant byte first. Little-endian stores least significant byte first.",
          example: "0x12345678\nbig: 12 34 56 78\nlittle: 78 56 34 12",
          format: "Hex bytes, or 8-bit byte groups when asked."
        },
        "masks": {
          concept: "Masks select, set, clear, toggle, or test specific bits.",
          rules: "Bit positions are 0-indexed: bit 0 is the rightmost bit. Set with |, clear with & ~mask, toggle with ^, test with &.",
          example: "Set bit 2: x | 0b0100\nClear bit 2: x & 0b1011",
          format: "Usually hex result; for tests, answer 1 or 0."
        },
        "ranges": {
          concept: "Fixed-width integer ranges come from how many bit patterns exist.",
          rules: "Unsigned max is 2^n-1. Signed min/max are -2^(n-1) and 2^(n-1)-1.",
          example: "8-bit unsigned max 255\n8-bit signed range -128..127",
          format: "Decimal number."
        },
        "extension": {
          concept: "Extension widens a value; truncation keeps only low bits.",
          rules: "Zero extension fills high bits with 0. Sign extension copies the sign bit.",
          example: "Sign-extend 1001 to 8 bits: 11111001\nZero-extend 1001: 00001001",
          format: "Exact destination-width bit pattern."
        }
      };

      function localizeStaticData() {
        CATEGORIES.forEach(function (category) {
          var labels = t("categories." + category.id, null);
          if (!labels) return;
          category.title = labels.title || category.title;
          category.short = labels.short || category.short;
        });

        var cards = t("learnCards", null);
        if (cards) {
          Object.keys(LEARN_CARDS).forEach(function (id) {
            if (cards[id]) LEARN_CARDS[id] = cards[id];
          });
        }
      }

      localizeStaticData();

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

      Rng.prototype.chance = function (probability) {
        return this.float() < probability;
      };

      Rng.prototype.choice = function (items) {
        return items[this.int(0, items.length - 1)];
      };

      Rng.prototype.bigint = function (bits) {
        var chunks = Math.ceil(bits / 32);
        var out = 0n;
        for (var i = 0; i < chunks; i += 1) {
          out = (out << 32n) | BigInt(this.next());
        }
        return out & mask(bits);
      };

      function q(categoryId, level, prompt, expected, explanation, meta) {
        return {
          categoryId: categoryId,
          level: level,
          prompt: prompt,
          expected: expected,
          explanation: explanation,
          meta: meta || {}
        };
      }

      function levelLabel(level) {
        if (level === -1) return "1-bit";
        if (level === 0) return "2-bit";
        return t("practice.level", "Level") + " " + level;
      }

      function getLevels(category) {
        return Array.isArray(category.levels) ? category.levels : LEVELS;
      }

      function closestLevel(category, requestedLevel) {
        var levels = getLevels(category);
        if (levels.includes(requestedLevel)) return requestedLevel;
        return levels.reduce(function (best, level) {
          return Math.abs(level - requestedLevel) < Math.abs(best - requestedLevel) ? level : best;
        }, levels[0]);
      }

      function getCategory(id) {
        return CATEGORIES.find(function (category) {
          return category.id === id;
        }) || CATEGORIES[0];
      }

      function statKey(categoryId, level) {
        return categoryId + ":" + level;
      }

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function mask(bits) {
        return (1n << BigInt(bits)) - 1n;
      }

      function modulo(value, bits) {
        var mod = 1n << BigInt(bits);
        return ((value % mod) + mod) % mod;
      }

      function toUnsigned(value, bits) {
        return modulo(value, bits);
      }

      function toSigned(raw, bits) {
        raw = toUnsigned(raw, bits);
        var sign = 1n << BigInt(bits - 1);
        return (raw & sign) !== 0n ? raw - (1n << BigInt(bits)) : raw;
      }

      function signedMin(bits) {
        return -(1n << BigInt(bits - 1));
      }

      function signedMax(bits) {
        return (1n << BigInt(bits - 1)) - 1n;
      }

      function unsignedMax(bits) {
        return mask(bits);
      }

      function signedStatus(exact, bits) {
        if (exact > signedMax(bits)) return "overflow";
        if (exact < signedMin(bits)) return "underflow";
        return "none";
      }

      function unsignedStatusAdd(exact, bits) {
        return exact > unsignedMax(bits) ? "overflow" : "none";
      }

      function unsignedStatusSub(left, right) {
        return left < right ? "underflow" : "none";
      }

      function bitsForLevel(level, localRng) {
        return localRng.choice(LEVEL_BITS[level]);
      }

      function groupedBits(bits) {
        if (!getSettings().groupBits) return bits;
        var offset = bits.length % 4;
        var result = "";
        for (var i = 0; i < bits.length; i += 1) {
          if (i > 0 && (i - offset) % 4 === 0) result += " ";
          result += bits[i];
        }
        return result.trim();
      }

      function formatBits(value, bits) {
        return toUnsigned(value, bits).toString(2).padStart(bits, "0");
      }

      function bitsText(value, bits) {
        return groupedBits(formatBits(value, bits));
      }

      function hexDigitsForBits(bits) {
        return Math.ceil(bits / 4);
      }

      function octDigitsForBits(bits) {
        return Math.ceil(bits / 3);
      }

      function formatHex(value, bits) {
        return toUnsigned(value, bits).toString(16).toUpperCase().padStart(hexDigitsForBits(bits), "0");
      }

      function formatOctal(value, bits) {
        return toUnsigned(value, bits).toString(8).padStart(octDigitsForBits(bits), "0");
      }

      function byteHex(value, bits) {
        var hex = formatHex(value, bits);
        if (hex.length % 2 !== 0) hex = "0" + hex;
        var bytes = [];
        for (var i = 0; i < hex.length; i += 2) {
          bytes.push(hex.slice(i, i + 2));
        }
        return bytes;
      }

      function byteBits(bytes) {
        return bytes.map(function (byte) {
          return parseInt(byte, 16).toString(2).padStart(8, "0");
        });
      }

      function hexDisplay(value, bits) {
        return "0x" + formatHex(value, bits);
      }

      function parseDecimal(text) {
        var clean = String(text).trim();
        if (!/^[+-]?\d+$/.test(clean)) return null;
        try {
          return BigInt(clean);
        } catch (error) {
          return null;
        }
      }

      function parseBaseDigits(text, base, prefixPattern) {
        var clean = String(text).trim().toLowerCase();
        clean = clean.replace(prefixPattern, "");
        clean = clean.replace(/[\s_,]/g, "");
        var pattern = base === 2 ? /^[01]+$/ : base === 8 ? /^[0-7]+$/ : /^[0-9a-f]+$/;
        if (!pattern.test(clean)) return null;
        var value = 0n;
        for (var i = 0; i < clean.length; i += 1) {
          var digit = parseInt(clean[i], base);
          value = value * BigInt(base) + BigInt(digit);
        }
        return value;
      }

      function normalizeBits(text) {
        var clean = String(text).trim().toLowerCase();
        clean = clean.replace(/0b/g, "");
        clean = clean.replace(/[\s_,]/g, "");
        return /^[01]+$/.test(clean) ? clean : null;
      }

      function normalizeHex(text) {
        var clean = String(text).trim().toUpperCase();
        clean = clean.replace(/0X/g, "");
        clean = clean.replace(/[\s_,]/g, "");
        return /^[0-9A-F]+$/.test(clean) ? clean : null;
      }

      function normalizeOctal(text) {
        var clean = String(text).trim().toLowerCase();
        clean = clean.replace(/0o/g, "");
        clean = clean.replace(/[\s_,]/g, "");
        return /^[0-7]+$/.test(clean) ? clean : null;
      }

      function normalizeByteList(text) {
        var clean = String(text).trim().toUpperCase();
        clean = clean.replace(/0X/g, "");
        clean = clean.replace(/[^0-9A-F]/g, "");
        if (clean.length === 0 || clean.length % 2 !== 0) return null;
        var bytes = [];
        for (var i = 0; i < clean.length; i += 2) {
          bytes.push(clean.slice(i, i + 2));
        }
        return bytes;
      }

      function normalizeNumberList(text) {
        var clean = String(text).trim();
        if (clean.length === 0 || clean.toLowerCase() === "none") return [];
        return clean.split(/[\s,]+/)
          .filter(Boolean)
          .map(function (part) {
            return /^\d+$/.test(part) ? Number(part) : NaN;
          })
          .filter(function (value) {
            return Number.isFinite(value);
          })
          .sort(function (a, b) {
            return a - b;
          });
      }

      function detectStatus(text) {
        var clean = String(text).toLowerCase();
        if (/\+/.test(clean)) return "overflow";
        if (/-/.test(clean)) return "underflow";
        if (/\b0\b/.test(clean)) return "none";
        if (/\bnone\b|\bok\b|\bno\s+(over|under)?flow\b/.test(clean)) return "none";
        if (/\bunderflow\b/.test(clean)) return "underflow";
        if (/\boverflow\b/.test(clean)) return "overflow";
        return null;
      }

      function withoutStatus(text, status) {
        if (!status) return text;
        var clean = String(text);
        if (status === "overflow") clean = clean.replace(/\+/g, " ");
        if (status === "underflow") clean = clean.replace(/-/g, " ");
        if (status === "none") {
          clean = clean.replace(/\bnone\b|\bok\b|\b0\b|\bno\s+(over|under)?flow\b/gi, " ");
        } else {
          clean = clean.replace(new RegExp("\\b" + status + "\\b", "gi"), " ");
        }
        return clean;
      }

      function expectedDisplay(expected) {
        if (expected.kind === "decimal") return String(expected.value);
        if (expected.kind === "binary") return groupedBits(expected.bits);
        if (expected.kind === "carryBits") return groupedBits(expected.bits) + " " + expected.carry;
        if (expected.kind === "hex") return "0x" + expected.hex;
        if (expected.kind === "octal") return "0o" + expected.octal;
        if (expected.kind === "statusBits") return groupedBits(expected.bits) + " " + statusSymbol(expected.status) + " (" + expected.status + ")";
        if (expected.kind === "bytes") return expected.bytes.join(" ");
        if (expected.kind === "binaryBytes") return expected.groups.join(" ");
        if (expected.kind === "choice") return expected.display;
        if (expected.kind === "list") return expected.values.length ? expected.values.join(", ") : "none";
        return String(expected.display || "");
      }

      function statusSymbol(status) {
        if (status === "overflow") return "+";
        if (status === "underflow") return "-";
        return "0";
      }

      function parseStatusBitsAnswer(answer) {
        var clean = String(answer).trim();
        var status = null;
        var bitsPart = "";
        var symbol = clean.match(/^(.*?)([+-])$/);
        if (symbol) {
          status = symbol[2] === "+" ? "overflow" : "underflow";
          bitsPart = symbol[1];
        } else {
          var word = clean.match(/^(.*?)(?:\s+)(overflow|underflow|none|ok|0)$/i);
          if (word) {
            status = word[2].toLowerCase();
            if (status === "ok" || status === "0") status = "none";
            bitsPart = word[1];
          }
        }
        if (!status) return null;
        return {
          bits: normalizeBits(bitsPart),
          status: status
        };
      }

      function parseCarryBitsAnswer(answer) {
        var clean = String(answer).trim();
        var match = clean.match(/^(.*?)(?:\s+)([01])$/);
        if (!match) return null;
        return {
          bits: normalizeBits(match[1]),
          carry: Number(match[2])
        };
      }

      function rowPrompt(title, rows, note) {
        return {
          title: title,
          rows: rows,
          note: note || ""
        };
      }

      function checkExpected(answer, question) {
        var expected = question.expected;
        var correct = false;
        var normalized = String(answer).trim();

        if (expected.kind === "decimal") {
          var decimal = parseDecimal(answer);
          correct = decimal !== null && decimal === expected.value;
          normalized = decimal === null ? normalized : String(decimal);
        }

        if (expected.kind === "binary") {
          var bits = normalizeBits(answer);
          correct = bits === expected.bits;
          normalized = bits || normalized;
        }

        if (expected.kind === "carryBits") {
          var parsedCarryBits = parseCarryBitsAnswer(answer);
          correct = !!parsedCarryBits && parsedCarryBits.bits === expected.bits && parsedCarryBits.carry === expected.carry;
          normalized = parsedCarryBits ? (parsedCarryBits.bits || "") + " " + parsedCarryBits.carry : normalized;
        }

        if (expected.kind === "hex") {
          var hex = normalizeHex(answer);
          var expectedValue = parseBaseDigits(expected.hex, 16, /^0x/);
          var actualValue = hex === null ? null : parseBaseDigits(hex, 16, /^0x/);
          correct = actualValue !== null && actualValue === expectedValue;
          normalized = hex ? "0x" + hex : normalized;
        }

        if (expected.kind === "octal") {
          var octal = normalizeOctal(answer);
          var expectedOctalValue = parseBaseDigits(expected.octal, 8, /^0o/);
          var actualOctalValue = octal === null ? null : parseBaseDigits(octal, 8, /^0o/);
          correct = actualOctalValue !== null && actualOctalValue === expectedOctalValue;
          normalized = octal ? "0o" + octal : normalized;
        }

        if (expected.kind === "statusBits") {
          var parsedStatusBits = parseStatusBitsAnswer(answer);
          correct = !!parsedStatusBits && parsedStatusBits.status === expected.status && parsedStatusBits.bits === expected.bits;
          normalized = parsedStatusBits ? (parsedStatusBits.bits || "") + " " + statusSymbol(parsedStatusBits.status) + " (" + parsedStatusBits.status + ")" : normalized;
        }

        if (expected.kind === "bytes") {
          var bytes = normalizeByteList(answer);
          correct = !!bytes && bytes.join(" ") === expected.bytes.join(" ");
          normalized = bytes ? bytes.join(" ") : normalized;
        }

        if (expected.kind === "binaryBytes") {
          var inputBits = normalizeBits(answer);
          correct = inputBits === expected.groups.join("");
          normalized = inputBits ? groupedBits(inputBits) : normalized;
        }

        if (expected.kind === "choice") {
          var clean = String(answer).trim().toLowerCase();
          correct = expected.accept.includes(clean);
          normalized = clean;
        }

        if (expected.kind === "list") {
          var list = normalizeNumberList(answer);
          correct = list.join(",") === expected.values.join(",");
          normalized = list.length ? list.join(", ") : "none";
        }

        return {
          correct: correct,
          normalizedAnswer: normalized,
          expectedText: expectedDisplay(expected),
          explanation: question.explanation
        };
      }

      function genPowers(level, localRng) {
        var maxExpByLevel = {
          "-1": 1,
          0: 3,
          1: 8,
          2: 12,
          3: 20,
          4: 32,
          5: 63
        };
        var maxExp = maxExpByLevel[level];
        var exp = localRng.int(0, maxExp);
        var value = 1n << BigInt(exp);
        var variant = localRng.choice(level >= 3 ? ["compute", "identify", "near"] : ["compute", "identify"]);
        if (variant === "near" && exp < 4) variant = "compute";
        if (variant === "identify") {
          return q("powers", level, rowPrompt("Find the exponent n.", [
            "2^n = " + value
          ], "Enter n."), {
            kind: "decimal",
            value: BigInt(exp)
          }, "2^" + exp + " equals " + value + ".");
        }
        if (variant === "near") {
          var offset = BigInt(localRng.choice([-3, -2, -1, 1, 2, 3])) * (1n << BigInt(exp - 4));
          var near = value + offset;
          if (near < 1n) near = value + 1n;
          return q("powers", level, rowPrompt("Find the closest power of two.", [
            String(near)
          ], "Enter the exponent n."), {
            kind: "decimal",
            value: BigInt(exp)
          }, "The closest listed power is 2^" + exp + " = " + value + ".");
        }
        return q("powers", level, rowPrompt("Compute this power of two.", [
          "2^" + exp
        ], "Enter decimal."), {
          kind: "decimal",
          value: value
        }, "2^" + exp + " equals " + value + ".");
      }

      function genNumericViews(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var raw = localRng.bigint(bits);
        var signed = toSigned(raw, bits);
        var unsigned = toUnsigned(raw, bits);
        var variant = localRng.choice(["bitsToUnsigned", "bitsToSigned", "unsignedToSigned", "signedToUnsigned", "signedToBits", "unsignedToBits"]);
        if (variant === "bitsToUnsigned") {
          return q("numeric-views", level, rowPrompt("Convert this " + bits + "-bit pattern to unsigned decimal.", [
            bitsText(raw, bits)
          ], "Enter unsigned decimal."), {
            kind: "decimal",
            value: unsigned
          }, "As unsigned, the bit pattern is " + unsigned + ".");
        }
        if (variant === "bitsToSigned") {
          return q("numeric-views", level, rowPrompt("Convert this " + bits + "-bit pattern to signed decimal.", [
            bitsText(raw, bits)
          ], "Use two's complement. Enter signed decimal."), {
            kind: "decimal",
            value: signed
          }, "The sign bit gives signed value " + signed + ".");
        }
        if (variant === "unsignedToSigned") {
          return q("numeric-views", level, rowPrompt("Interpret this " + bits + "-bit unsigned value as signed.", [
            String(unsigned)
          ], "Enter the two's complement signed decimal value."), {
            kind: "decimal",
            value: signed
          }, "The same bits are " + bitsText(raw, bits) + ", which is signed " + signed + ".");
        }
        if (variant === "signedToUnsigned") {
          return q("numeric-views", level, rowPrompt("Interpret this " + bits + "-bit signed value as unsigned.", [
            String(signed)
          ], "Enter unsigned decimal."), {
            kind: "decimal",
            value: unsigned
          }, "The same bits are " + bitsText(raw, bits) + ", which is unsigned " + unsigned + ".");
        }
        if (variant === "signedToBits") {
          return q("numeric-views", level, rowPrompt("Encode this signed value as " + bits + "-bit two's complement.", [
            String(signed)
          ], "Enter " + bits + " bits."), {
            kind: "binary",
            bits: formatBits(raw, bits)
          }, "The " + bits + "-bit encoding is " + bitsText(raw, bits) + ".");
        }
        return q("numeric-views", level, rowPrompt("Encode this unsigned value as " + bits + " bits.", [
          String(unsigned)
        ], "Enter " + bits + " bits."), {
          kind: "binary",
          bits: formatBits(raw, bits)
        }, "The " + bits + "-bit encoding is " + bitsText(raw, bits) + ".");
      }

      function genBaseBits(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var raw = localRng.bigint(bits);
        var variants = ["bitsToHex", "hexToBits", "bitsToOctal", "octalToBits"];
        var variant = localRng.choice(variants);
        if (variant === "bitsToHex") {
          return q("base-bits", level, rowPrompt("Convert this " + bits + "-bit pattern to hexadecimal.", [
            bitsText(raw, bits)
          ], "Enter hex."), {
            kind: "hex",
            hex: formatHex(raw, bits)
          }, "Grouped in nibbles, the value is 0x" + formatHex(raw, bits) + ".");
        }
        if (variant === "hexToBits") {
          return q("base-bits", level, rowPrompt("Convert this hexadecimal value to " + bits + " bits.", [
            hexDisplay(raw, bits)
          ], "Enter " + bits + " bits."), {
            kind: "binary",
            bits: formatBits(raw, bits)
          }, "Each hex digit expands to four bits: " + bitsText(raw, bits) + ".");
        }
        if (variant === "bitsToOctal") {
          return q("base-bits", level, rowPrompt("Convert this " + bits + "-bit pattern to octal.", [
            bitsText(raw, bits)
          ], "Enter octal."), {
            kind: "octal",
            octal: formatOctal(raw, bits)
          }, "Grouped in threes, the value is 0o" + formatOctal(raw, bits) + ".");
        }
        return q("base-bits", level, rowPrompt("Convert this octal value to " + bits + " bits.", [
          "0o" + formatOctal(raw, bits)
        ], "Enter " + bits + " bits."), {
          kind: "binary",
          bits: formatBits(raw, bits)
        }, "Each octal digit expands to three bits, then trims to " + bits + " bits: " + bitsText(raw, bits) + ".");
      }

      function signedOperands(bits, localRng, operation) {
        var target = localRng.chance(0.35) ? localRng.choice(["overflow", "underflow"]) : "any";
        var a;
        var b;
        if (operation === "add" && target === "overflow") {
          a = signedMax(bits) - BigInt(localRng.int(0, 3));
          b = BigInt(localRng.int(1, 4));
          return [toSigned(a, bits), toSigned(b, bits)];
        }
        if (operation === "add" && target === "underflow") {
          a = signedMin(bits) + BigInt(localRng.int(0, 3));
          b = -BigInt(localRng.int(1, 4));
          return [toSigned(a, bits), toSigned(b, bits)];
        }
        if (operation === "sub" && target === "overflow") {
          a = signedMax(bits) - BigInt(localRng.int(0, 3));
          b = -BigInt(localRng.int(1, 4));
          return [toSigned(a, bits), toSigned(b, bits)];
        }
        if (operation === "sub" && target === "underflow") {
          a = signedMin(bits) + BigInt(localRng.int(0, 3));
          b = BigInt(localRng.int(1, 4));
          return [toSigned(a, bits), toSigned(b, bits)];
        }
        for (var i = 0; i < 24; i += 1) {
          a = toSigned(localRng.bigint(bits), bits);
          b = toSigned(localRng.bigint(bits), bits);
          var exact = operation === "add" ? a + b : a - b;
          if (target !== "any" || signedStatus(exact, bits) === "none") return [a, b];
        }
        return [toSigned(localRng.bigint(bits), bits), toSigned(localRng.bigint(bits), bits)];
      }

      function genSignedAdd(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var pair = signedOperands(bits, localRng, "add");
        var a = pair[0];
        var b = pair[1];
        var exact = a + b;
        var status = signedStatus(exact, bits);
        var wrapped = toUnsigned(exact, bits);
        return q("signed-add", level, rowPrompt(bits + "-bit two's complement addition", [
          "  " + bitsText(toUnsigned(a, bits), bits) + "  (" + a + ")",
          "+ " + bitsText(toUnsigned(b, bits), bits) + "  (" + b + ")"
        ], "Enter result bits plus status: + overflow, - underflow, 0 none."), {
          kind: "statusBits",
          bits: formatBits(wrapped, bits),
          status: status
        }, signedExplanation(exact, wrapped, bits, status));
      }

      function genSignedSub(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var pair = signedOperands(bits, localRng, "sub");
        var a = pair[0];
        var b = pair[1];
        var exact = a - b;
        var status = signedStatus(exact, bits);
        var wrapped = toUnsigned(exact, bits);
        return q("signed-sub", level, rowPrompt(bits + "-bit two's complement subtraction", [
          "  " + bitsText(toUnsigned(a, bits), bits) + "  (" + a + ")",
          "- " + bitsText(toUnsigned(b, bits), bits) + "  (" + b + ")"
        ], "Enter result bits plus status: + overflow, - underflow, 0 none."), {
          kind: "statusBits",
          bits: formatBits(wrapped, bits),
          status: status
        }, signedExplanation(exact, wrapped, bits, status));
      }

      function signedExplanation(exact, wrapped, bits, status) {
        var range = "[" + signedMin(bits) + ", " + signedMax(bits) + "]";
        return "Exact result " + exact + " against signed range " + range + "; wrapped bits " + bitsText(wrapped, bits) + ", status " + status + ".";
      }

      function genUnsignedAdd(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var max = unsignedMax(bits);
        var a = localRng.bigint(bits);
        var b = localRng.bigint(bits);
        if (localRng.chance(0.35)) {
          a = max - BigInt(localRng.int(0, 8));
          b = BigInt(localRng.int(1, 12));
          a = toUnsigned(a, bits);
          b = toUnsigned(b, bits);
        }
        var exact = a + b;
        var status = unsignedStatusAdd(exact, bits);
        var wrapped = toUnsigned(exact, bits);
        return q("unsigned-add", level, rowPrompt(bits + "-bit unsigned addition", [
          "  " + bitsText(a, bits) + "  (" + a + ")",
          "+ " + bitsText(b, bits) + "  (" + b + ")"
        ], "Enter result bits plus status: + overflow, 0 none."), {
          kind: "statusBits",
          bits: formatBits(wrapped, bits),
          status: status
        }, "Max is " + max + "; exact result " + exact + " wraps to " + bitsText(wrapped, bits) + " with status " + status + ".");
      }

      function genUnsignedSub(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var a = localRng.bigint(bits);
        var b = localRng.bigint(bits);
        if (localRng.chance(0.35)) {
          a = BigInt(localRng.int(0, 8));
          b = a + BigInt(localRng.int(1, 12));
          a = toUnsigned(a, bits);
          b = toUnsigned(b, bits);
        }
        var exact = a - b;
        var status = unsignedStatusSub(a, b);
        var wrapped = toUnsigned(exact, bits);
        return q("unsigned-sub", level, rowPrompt(bits + "-bit unsigned subtraction", [
          "  " + bitsText(a, bits) + "  (" + a + ")",
          "- " + bitsText(b, bits) + "  (" + b + ")"
        ], "Enter result bits plus status: - underflow, 0 none."), {
          kind: "statusBits",
          bits: formatBits(wrapped, bits),
          status: status
        }, "Subtraction below zero underflows; wrapped bits are " + bitsText(wrapped, bits) + " with status " + status + ".");
      }

      function genBitwise(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var ops = level <= 1 ? ["+", "-", "&", "|", "^"] : ["+", "-", "&", "|", "^", "~"];
        var op = localRng.choice(ops);
        var a = localRng.bigint(bits);
        var b = localRng.bigint(bits);
        var result;
        var prompt;
        if (op === "~") {
          result = mask(bits) ^ a;
          prompt = rowPrompt(bits + "-bit binary bitwise NOT", [
            "~ " + bitsText(a, bits)
          ], "Enter wrapped result bits.");
        } else {
          if (op === "+") result = a + b;
          if (op === "-") result = a - b;
          if (op === "&") result = a & b;
          if (op === "|") result = a | b;
          if (op === "^") result = a ^ b;
          prompt = rowPrompt(bits + "-bit binary operation", [
            "  " + bitsText(a, bits),
            op + " " + bitsText(b, bits)
          ], "Enter wrapped result bits.");
        }
        var wrapped = toUnsigned(result, bits);
        return q("bitwise", level, prompt, {
          kind: "binary",
          bits: formatBits(wrapped, bits)
        }, "The fixed-width result is " + bitsText(wrapped, bits) + ".");
      }

      function genShifts(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var raw = localRng.bigint(bits);
        var maxShift = level <= 2 ? Math.max(1, Math.floor(bits / 2)) : bits - 1;
        var amount = localRng.int(1, maxShift);
        var variant = localRng.choice(["left", "logicalRight", "arithmeticRight"]);
        var askCarry = level >= 3 && localRng.chance(0.45);
        var result;
        var prompt;
        var carry;
        if (variant === "left") {
          result = toUnsigned(raw << BigInt(amount), bits);
          carry = Number((raw >> BigInt(bits - amount)) & 1n);
          prompt = rowPrompt("Left-shift this " + bits + "-bit pattern.", [
            bitsText(raw, bits) + " << " + amount
          ], "Enter result bits" + (askCarry ? " and carry-out bit." : "."));
        } else if (variant === "logicalRight") {
          result = raw >> BigInt(amount);
          carry = Number((raw >> BigInt(amount - 1)) & 1n);
          prompt = rowPrompt("Logical right-shift this " + bits + "-bit pattern.", [
            bitsText(raw, bits) + " >>> " + amount
          ], "Enter result bits" + (askCarry ? " and carry-out bit." : "."));
        } else {
          result = toUnsigned(toSigned(raw, bits) >> BigInt(amount), bits);
          carry = Number((raw >> BigInt(amount - 1)) & 1n);
          prompt = rowPrompt("Arithmetic right-shift this " + bits + "-bit pattern.", [
            bitsText(raw, bits) + " >> " + amount
          ], "Enter result bits" + (askCarry ? " and carry-out bit." : "."));
        }
        if (askCarry) {
          return q("shifts", level, prompt, {
            kind: "carryBits",
            bits: formatBits(result, bits),
            carry: carry
          }, "The shifted result is " + bitsText(result, bits) + "; carry-out is the last bit shifted out, " + carry + ".");
        }
        return q("shifts", level, prompt, {
          kind: "binary",
          bits: formatBits(result, bits)
        }, "The shifted " + bits + "-bit result is " + bitsText(result, bits) + ".");
      }

      function genRotates(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var raw = localRng.bigint(bits);
        var maxRotate = bits === 1 ? 1 : bits - 1;
        var amount = localRng.int(1, maxRotate);
        var variant = localRng.choice(["left", "right"]);
        var normalized = amount % bits;
        var result;
        var prompt;
        if (variant === "left") {
          result = normalized === 0 ? raw : ((raw << BigInt(normalized)) | (raw >> BigInt(bits - normalized))) & mask(bits);
          prompt = rowPrompt("Rotate this " + bits + "-bit pattern left.", [
            bitsText(raw, bits) + " rol " + amount
          ], "Enter result bits.");
        } else {
          result = normalized === 0 ? raw : ((raw >> BigInt(normalized)) | (raw << BigInt(bits - normalized))) & mask(bits);
          prompt = rowPrompt("Rotate this " + bits + "-bit pattern right.", [
            bitsText(raw, bits) + " ror " + amount
          ], "Enter result bits.");
        }
        return q("rotates", level, prompt, {
          kind: "binary",
          bits: formatBits(result, bits)
        }, "Rotation wraps shifted-out bits around; result " + bitsText(result, bits) + ".");
      }

      function genEndian(level, localRng) {
        var byteOptions = {
          1: [2],
          2: [2, 4],
          3: [4],
          4: [4, 8],
          5: [8]
        };
        var byteCount = localRng.choice(byteOptions[level]);
        var bits = byteCount * 8;
        var raw = localRng.bigint(bits);
        var bytes = byteHex(raw, bits);
        var order = localRng.choice(["little", "big"]);
        var memory = order === "little" ? bytes.slice().reverse() : bytes.slice();
        var hardBits = level >= 4 && localRng.chance(0.45);
        if (hardBits) {
          return q("endian", level, rowPrompt("Write the " + order + "-endian memory byte bits.", [
            hexDisplay(raw, bits)
          ], "Enter 8-bit groups in memory order."), {
            kind: "binaryBytes",
            groups: byteBits(memory)
          }, order + "-endian memory bytes are " + memory.join(" ") + ".");
        }
        return q("endian", level, rowPrompt("Write the " + order + "-endian memory bytes.", [
          hexDisplay(raw, bits)
        ], "Enter hex bytes in memory order."), {
          kind: "bytes",
          bytes: memory
        }, order + "-endian memory bytes are " + memory.join(" ") + ".");
      }

      function genMasks(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var bitNote = "Bit 0 is rightmost.";
        var maxPosition = bits - 1;
        var maskVariants = ["single", "range", "set", "clear", "toggle", "test"];
        if (level >= 3 && bits <= 16) maskVariants.push("list");
        var variant = localRng.choice(maskVariants);
        var pos = localRng.int(0, maxPosition);
        var value = localRng.bigint(bits);
        if (variant === "single") {
          var single = 1n << BigInt(pos);
          return q("masks", level, rowPrompt("Create a " + bits + "-bit mask with one bit set.", [
            "bit " + pos
          ], bitNote + " Enter hex."), {
            kind: "hex",
            hex: formatHex(single, bits)
          }, "Bit " + pos + " is mask " + hexDisplay(single, bits) + ".");
        }
        if (variant === "range") {
          var lo = localRng.int(0, Math.max(0, maxPosition - 1));
          var hi = localRng.int(lo, Math.min(maxPosition, lo + Math.max(1, Math.floor(bits / 4))));
          var rangeMask = ((1n << BigInt(hi - lo + 1)) - 1n) << BigInt(lo);
          return q("masks", level, rowPrompt("Create a " + bits + "-bit mask with this bit range set.", [
            "bits " + lo + " through " + hi
          ], bitNote + " Enter hex."), {
            kind: "hex",
            hex: formatHex(rangeMask, bits)
          }, "The range mask is " + hexDisplay(rangeMask, bits) + ".");
        }
        if (variant === "set") {
          var setResult = value | (1n << BigInt(pos));
          return q("masks", level, rowPrompt("Set one bit in these " + bits + "-bit flags.", [
            hexDisplay(value, bits),
            "set bit " + pos
          ], bitNote + " Enter hex result."), {
            kind: "hex",
            hex: formatHex(setResult, bits)
          }, "Setting bit " + pos + " gives " + hexDisplay(setResult, bits) + ".");
        }
        if (variant === "clear") {
          var clearResult = value & (mask(bits) ^ (1n << BigInt(pos)));
          return q("masks", level, rowPrompt("Clear one bit in these " + bits + "-bit flags.", [
            hexDisplay(value, bits),
            "clear bit " + pos
          ], bitNote + " Enter hex result."), {
            kind: "hex",
            hex: formatHex(clearResult, bits)
          }, "Clearing bit " + pos + " gives " + hexDisplay(clearResult, bits) + ".");
        }
        if (variant === "toggle") {
          var toggleResult = value ^ (1n << BigInt(pos));
          return q("masks", level, rowPrompt("Toggle one bit in these " + bits + "-bit flags.", [
            hexDisplay(value, bits),
            "toggle bit " + pos
          ], bitNote + " Enter hex result."), {
            kind: "hex",
            hex: formatHex(toggleResult, bits)
          }, "Toggling bit " + pos + " gives " + hexDisplay(toggleResult, bits) + ".");
        }
        if (variant === "test") {
          var isSet = (value & (1n << BigInt(pos))) !== 0n;
          return q("masks", level, rowPrompt("Test whether this bit is set.", [
            bits + "-bit flags " + hexDisplay(value, bits),
            "bit " + pos
          ], bitNote + " Enter 1 or 0."), {
            kind: "choice",
            accept: isSet ? ["1", "set", "yes", "true"] : ["0", "clear", "no", "false"],
            display: isSet ? "1" : "0"
          }, "Bit " + pos + " is " + (isSet ? "set" : "clear") + ".");
        }
        var positions = [];
        for (var i = 0; i < bits; i += 1) {
          if ((value & (1n << BigInt(i))) !== 0n) positions.push(i);
        }
        return q("masks", level, rowPrompt("List the set bit positions in these " + bits + "-bit flags.", [
          hexDisplay(value, bits)
        ], bitNote + " Enter positions."), {
          kind: "list",
          values: positions
        }, "Set bit positions are " + (positions.length ? positions.join(", ") : "none") + ".");
      }

      function genRanges(level, localRng) {
        var bits = bitsForLevel(level, localRng);
        var variant = localRng.choice(["signedMin", "signedMax", "unsignedMin", "unsignedMax"]);
        if (variant === "signedMin") {
          return q("ranges", level, rowPrompt("Give the signed minimum for this width.", [
            bits + "-bit"
          ], "Enter decimal."), {
            kind: "decimal",
            value: signedMin(bits)
          }, "Signed minimum is -2^" + (bits - 1) + " = " + signedMin(bits) + ".");
        }
        if (variant === "signedMax") {
          return q("ranges", level, rowPrompt("Give the signed maximum for this width.", [
            bits + "-bit"
          ], "Enter decimal."), {
            kind: "decimal",
            value: signedMax(bits)
          }, "Signed maximum is 2^" + (bits - 1) + " - 1 = " + signedMax(bits) + ".");
        }
        if (variant === "unsignedMin") {
          return q("ranges", level, rowPrompt("Give the unsigned minimum for this width.", [
            bits + "-bit"
          ], "Enter decimal."), {
            kind: "decimal",
            value: 0n
          }, "Unsigned minimum is 0.");
        }
        return q("ranges", level, rowPrompt("Give the unsigned maximum for this width.", [
          bits + "-bit"
        ], "Enter decimal."), {
          kind: "decimal",
          value: unsignedMax(bits)
        }, "Unsigned maximum is 2^" + bits + " - 1 = " + unsignedMax(bits) + ".");
      }

      function genExtension(level, localRng) {
        var pairs = {
          "-1": [[1, 2]],
          0: [[2, 4]],
          1: [[4, 8]],
          2: [[8, 16]],
          3: [[8, 16], [12, 24]],
          4: [[16, 32], [24, 32]],
          5: [[32, 64], [48, 64]]
        };
        var pair = localRng.choice(pairs[level]);
        var srcBits = pair[0];
        var destBits = pair[1];
        var raw = localRng.bigint(srcBits);
        var variant = localRng.choice(["sign", "zero", "truncate"]);
        if (variant === "truncate") {
          var wide = localRng.bigint(destBits);
          var truncated = toUnsigned(wide, srcBits);
          return q("extension", level, rowPrompt("Truncate this pattern to " + srcBits + " bits.", [
            destBits + "-bit " + bitsText(wide, destBits)
          ], "Enter the low " + srcBits + " bits."), {
            kind: "binary",
            bits: formatBits(truncated, srcBits)
          }, "Keeping the low " + srcBits + " bits gives " + bitsText(truncated, srcBits) + ".");
        }
        if (variant === "sign") {
          var signed = toSigned(raw, srcBits);
          var signExtended = toUnsigned(signed, destBits);
          return q("extension", level, rowPrompt("Sign-extend this pattern to " + destBits + " bits.", [
            srcBits + "-bit " + bitsText(raw, srcBits)
          ], "Enter the " + destBits + "-bit result."), {
            kind: "binary",
            bits: formatBits(signExtended, destBits)
          }, "Sign extension preserves value " + signed + ": " + bitsText(signExtended, destBits) + ".");
        }
        var zeroExtended = toUnsigned(raw, destBits);
        return q("extension", level, rowPrompt("Zero-extend this pattern to " + destBits + " bits.", [
          srcBits + "-bit " + bitsText(raw, srcBits)
        ], "Enter the " + destBits + "-bit result."), {
          kind: "binary",
          bits: formatBits(zeroExtended, destBits)
        }, "Zero extension fills high bits with zero: " + bitsText(zeroExtended, destBits) + ".");
      }

      function createDefaultProgress() {
        var enabled = {};
        CATEGORIES.forEach(function (category) {
          enabled[category.id] = true;
        });
        return {
          version: 1,
          view: "practice",
          manual: {
            categoryId: CATEGORIES[0].id,
            level: 1
          },
          stats: {},
          settings: {
            groupBits: true,
            adaptive: true,
            enabled: enabled
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }

      function loadProgress() {
        var fallback = createDefaultProgress();
        try {
          var stored = localStorage.getItem(STORAGE_KEY);
          if (!stored) return fallback;
          return mergeProgress(fallback, JSON.parse(stored));
        } catch (error) {
          return fallback;
        }
      }

      function mergeProgress(fallback, stored) {
        if (!stored || typeof stored !== "object") return fallback;
        var merged = Object.assign({}, fallback, stored);
        merged.manual = Object.assign({}, fallback.manual, stored.manual || {});
        merged.settings = Object.assign({}, fallback.settings, stored.settings || {});
        merged.settings.enabled = Object.assign({}, fallback.settings.enabled, (stored.settings && stored.settings.enabled) || {});
        merged.stats = stored.stats && typeof stored.stats === "object" ? stored.stats : {};
        merged.version = 1;
        if (!getCategory(merged.manual.categoryId)) merged.manual.categoryId = CATEGORIES[0].id;
        merged.manual.level = closestLevel(getCategory(merged.manual.categoryId), Number(merged.manual.level));
        return merged;
      }

      function saveProgress() {
        progress.updatedAt = Date.now();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
          console.warn("Could not save progress", error);
        }
      }

      function getSettings() {
        return progress ? progress.settings : { groupBits: true, adaptive: true, enabled: {} };
      }

      function getStat(categoryId, level) {
        var key = statKey(categoryId, level);
        if (!progress.stats[key]) {
          progress.stats[key] = {
            attempts: 0,
            correct: 0,
            streak: 0,
            recent: [],
            avgMs: 0,
            totalMs: 0,
            mastery: 0,
            lastPracticed: 0,
            lastMissed: 0
          };
        }
        return progress.stats[key];
      }

      function allCells() {
        var cells = [];
        CATEGORIES.forEach(function (category) {
          getLevels(category).forEach(function (level) {
            cells.push({
              category: category,
              level: level,
              stat: getStat(category.id, level)
            });
          });
        });
        return cells;
      }

      function accuracy(stat) {
        return stat.attempts ? Math.round((stat.correct / stat.attempts) * 100) : 0;
      }

      function recentAccuracy(stat) {
        if (!stat.recent || stat.recent.length === 0) return accuracy(stat);
        var sum = stat.recent.reduce(function (total, item) {
          return total + item;
        }, 0);
        return Math.round((sum / stat.recent.length) * 100);
      }

      function timeText(ms) {
        if (!ms) return "0s";
        var seconds = Math.round(ms / 1000);
        if (seconds < 60) return seconds + "s";
        var minutes = Math.round(seconds / 60);
        if (minutes < 60) return minutes + "m";
        return Math.round(minutes / 60) + "h";
      }

      function isAdaptiveLevelUnlocked(categoryId, levels, index) {
        if (index === 0) return true;
        var stat = getStat(categoryId, levels[index]);
        if (stat.attempts > 0) return true;
        var previous = getStat(categoryId, levels[index - 1]);
        return previous.attempts >= 3 && Number(previous.mastery || 0) >= 45;
      }

      function chooseAdaptiveCell() {
        var now = Date.now();
        var weighted = [];
        CATEGORIES.forEach(function (category) {
          if (progress.settings.enabled[category.id] === false) return;
          var categoryLevels = getLevels(category);
          categoryLevels.forEach(function (level, index) {
            if (!isAdaptiveLevelUnlocked(category.id, categoryLevels, index)) return;
            var stat = getStat(category.id, level);
            var mastery = Number(stat.mastery || 0);
            var newBonus = stat.attempts < 3 ? 45 : 0;
            var missedSoon = stat.lastMissed && now - stat.lastMissed < 86400000 ? 25 : 0;
            var staleDays = stat.lastPracticed ? Math.min(30, Math.floor((now - stat.lastPracticed) / 86400000) * 2) : 18;
            var levelPenalty = index * 10;
            var weight = Math.max(2, (100 - mastery) + newBonus + missedSoon + staleDays - levelPenalty);
            weighted.push({ category: category, level: level, weight: weight });
          });
        });
        if (weighted.length === 0) {
          return { category: getCategory(progress.manual.categoryId), level: progress.manual.level };
        }
        var total = weighted.reduce(function (sum, item) {
          return sum + item.weight;
        }, 0);
        var pick = rng.float() * total;
        for (var i = 0; i < weighted.length; i += 1) {
          pick -= weighted[i].weight;
          if (pick <= 0) return weighted[i];
        }
        return weighted[weighted.length - 1];
      }

      function startQuestion() {
        var selection;
        if (progress.settings.adaptive) {
          selection = chooseAdaptiveCell();
        } else {
          selection = {
            category: getCategory(progress.manual.categoryId),
            level: closestLevel(getCategory(progress.manual.categoryId), progress.manual.level)
          };
        }
        currentQuestion = selection.category.generate(selection.level, rng);
        currentStartedAt = performance.now();
        pausedMs = 0;
        pauseStartedAt = 0;
        isPaused = false;
        submitted = false;
        renderQuestion();
        saveProgress();
      }

      function recordResult(question, correct, elapsedMs) {
        var stat = getStat(question.categoryId, question.level);
        stat.attempts += 1;
        if (correct) stat.correct += 1;
        stat.streak = correct ? stat.streak + 1 : 0;
        stat.recent = Array.isArray(stat.recent) ? stat.recent : [];
        stat.recent.push(correct ? 1 : 0);
        if (stat.recent.length > 12) stat.recent.shift();
        stat.avgMs = stat.avgMs ? Math.round((stat.avgMs * (stat.attempts - 1) + elapsedMs) / stat.attempts) : Math.round(elapsedMs);
        stat.totalMs += Math.round(elapsedMs);
        stat.lastPracticed = Date.now();
        if (!correct) stat.lastMissed = Date.now();
        var delta = 0;
        if (correct) {
          delta = elapsedMs <= 8000 ? 8 : elapsedMs <= 20000 ? 5 : 3;
          if (stat.streak >= 3) delta += 2;
          if (stat.attempts <= 3) delta += 4;
        } else {
          delta = stat.mastery >= 80 ? -13 : -10;
        }
        stat.mastery = clamp(Math.round((stat.mastery || 0) + delta), 0, 100);
        saveProgress();
      }

      function renderQuestion() {
        if (!currentQuestion) return;
        var category = getCategory(currentQuestion.categoryId);
        var stat = getStat(currentQuestion.categoryId, currentQuestion.level);
        document.getElementById("questionCategory").textContent = category.title;
        document.getElementById("questionLevel").textContent = levelLabel(currentQuestion.level);
        document.getElementById("questionMastery").textContent = Math.round(stat.mastery || 0) + "% " + t("practice.masterySuffix", "mastery");
        document.getElementById("questionMastery").className = "pill " + (stat.mastery >= 70 ? "good" : "warn");
        renderPrompt(currentQuestion.prompt);
        document.getElementById("answerInput").value = "";
        document.getElementById("answerInput").disabled = false;
        document.getElementById("submitBtn").disabled = false;
        document.getElementById("submitBtn").innerHTML = t("practice.check", "Check") + " <span class=\"key-symbol\">↵</span>";
        document.querySelector("[data-keypad-action=\"submit\"]").textContent = t("practice.check", "Check");
        renderPauseState();
        updateKeypadHints();
        document.getElementById("feedback").className = "feedback hidden";
        document.getElementById("feedback").innerHTML = "";
        renderModeButtons();
        renderPracticeControls();
        renderCurrentMetrics();
        renderSummary();
        window.setTimeout(function () {
          if (shouldAutoFocusAnswer()) document.getElementById("answerInput").focus();
        }, 0);
      }

      function shouldAutoFocusAnswer() {
        return !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      }

      function usefulKeypadInserts(expected) {
        var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var hex = digits.concat(["A", "B", "C", "D", "E", "F", "0x", " "]);
        var octal = ["0", "1", "2", "3", "4", "5", "6", "7", "0o", " "];
        if (!expected) return hex.concat(["+", "-"]);
        if (expected.kind === "binary" || expected.kind === "binaryBytes") return ["0", "1", " "];
        if (expected.kind === "carryBits" || expected.kind === "statusBits") return ["0", "1", " ", "+", "-"];
        if (expected.kind === "hex" || expected.kind === "bytes") return hex;
        if (expected.kind === "octal") return octal;
        if (expected.kind === "decimal") return digits.concat(["-"]);
        if (expected.kind === "list") return digits.concat([" "]);
        if (expected.kind === "choice") return ["0", "1"];
        return hex.concat(["+", "-"]);
      }

      function updateKeypadHints() {
        var useful = new Set(usefulKeypadInserts(currentQuestion && currentQuestion.expected));
        document.querySelectorAll("#answerKeypad [data-keypad-insert]").forEach(function (button) {
          button.classList.toggle("muted-key", !useful.has(button.dataset.keypadInsert));
        });
      }

      function questionElapsedMs() {
        var activePause = isPaused ? performance.now() - pauseStartedAt : 0;
        return Math.max(1, Math.round(performance.now() - currentStartedAt - pausedMs - activePause));
      }

      function renderPauseState() {
        document.querySelector(".practice-main").classList.toggle("paused", isPaused);
        document.getElementById("pauseBtn").disabled = !currentQuestion || submitted;
        document.getElementById("pauseBtn").textContent = isPaused ? t("practice.paused", "Paused") : t("practice.pause", "Pause");
      }

      function pausePractice() {
        if (!currentQuestion || submitted || isPaused) return;
        isPaused = true;
        pauseStartedAt = performance.now();
        renderPauseState();
        document.getElementById("resumeBtn").focus();
      }

      function resumePractice() {
        if (!isPaused) return;
        pausedMs += performance.now() - pauseStartedAt;
        pauseStartedAt = 0;
        isPaused = false;
        renderPauseState();
        if (shouldAutoFocusAnswer()) document.getElementById("answerInput").focus();
      }

      function renderPrompt(prompt) {
        var container = document.getElementById("questionPrompt");
        container.className = "prompt";
        container.innerHTML = "";
        if (typeof prompt === "string") {
          container.textContent = prompt;
          return;
        }
        container.classList.add("stack");
        var lines = [prompt.title || ""].concat(prompt.rows || []);
        container.appendChild(document.createTextNode(lines.join("\n")));
        if (prompt.note) {
          var note = document.createElement("div");
          note.className = "prompt-note";
          note.textContent = prompt.note;
          container.appendChild(note);
        }
      }

      function renderModeButtons() {
        document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active", progress.settings.adaptive);
        document.getElementById("manualModeBtn").classList.toggle("secondary-active", !progress.settings.adaptive);
      }

      function renderPracticeControls() {
        var categorySelect = document.getElementById("categorySelect");
        if (categorySelect.options.length !== CATEGORIES.length) {
          categorySelect.innerHTML = "";
          CATEGORIES.forEach(function (category) {
            var option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.title;
            categorySelect.appendChild(option);
          });
        }
        categorySelect.value = progress.manual.categoryId;
        var levelSelect = document.getElementById("levelSelect");
        var category = getCategory(progress.manual.categoryId);
        var levels = getLevels(category);
        var optionValues = Array.from(levelSelect.options).map(function (option) {
          return Number(option.value);
        });
        var needsOptions = optionValues.length !== levels.length || optionValues.some(function (value, index) {
          return value !== levels[index];
        });
        if (needsOptions) {
          levelSelect.innerHTML = "";
          levels.forEach(function (level) {
            var option = document.createElement("option");
            option.value = String(level);
            option.textContent = levelLabel(level);
            levelSelect.appendChild(option);
          });
        }
        progress.manual.level = closestLevel(category, progress.manual.level);
        levelSelect.value = String(progress.manual.level);
      }

      function renderCurrentMetrics() {
        var stat = currentQuestion ? getStat(currentQuestion.categoryId, currentQuestion.level) : getStat(progress.manual.categoryId, progress.manual.level);
        document.getElementById("metricMastery").textContent = Math.round(stat.mastery || 0) + "%";
        document.getElementById("metricAccuracy").textContent = accuracy(stat) + "%";
        document.getElementById("metricStreak").textContent = String(stat.streak || 0);
        document.getElementById("metricAvgTime").textContent = timeText(stat.avgMs || 0);
      }

      function renderSummary() {
        var cells = allCells();
        var totals = cells.reduce(function (acc, cell) {
          acc.attempts += cell.stat.attempts || 0;
          acc.correct += cell.stat.correct || 0;
          acc.mastery += cell.stat.mastery || 0;
          return acc;
        }, { attempts: 0, correct: 0, mastery: 0 });
        document.getElementById("summaryMastery").textContent = Math.round(totals.mastery / cells.length) + "%";
        document.getElementById("summaryAccuracy").textContent = totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) + "%" : "0%";
        document.getElementById("summaryAttempts").textContent = String(totals.attempts);
      }

      function renderMatrix() {
        var container = document.getElementById("matrix");
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var header = document.createElement("tr");
        [t("practice.category", "Category")].concat(LEVELS.map(levelLabel)).forEach(function (label) {
          var th = document.createElement("th");
          th.textContent = label;
          header.appendChild(th);
        });
        thead.appendChild(header);
        table.appendChild(thead);
        var tbody = document.createElement("tbody");
        CATEGORIES.forEach(function (category) {
          var row = document.createElement("tr");
          var label = document.createElement("td");
          label.innerHTML = "<strong></strong><br><span></span>";
          label.querySelector("strong").textContent = category.title;
          label.querySelector("span").textContent = category.short;
          row.appendChild(label);
          LEVELS.forEach(function (level) {
            var td = document.createElement("td");
            td.className = "level-cell";
            if (!getLevels(category).includes(level)) {
              td.textContent = "-";
              row.appendChild(td);
              return;
            }
            var stat = getStat(category.id, level);
            var button = document.createElement("button");
            button.type = "button";
            button.className = "level-button";
            if (stat.attempts >= 3 && stat.mastery < 45) button.classList.add("weak");
            if (stat.mastery >= 75) button.classList.add("ready");
            button.dataset.categoryId = category.id;
            button.dataset.level = String(level);
            button.innerHTML = "<strong></strong><span></span><div class=\"bar\"><span></span></div>";
            button.querySelector("strong").textContent = Math.round(stat.mastery || 0) + "%";
            button.querySelectorAll("span")[0].textContent = (stat.attempts || 0) + " " + t("stats.tries", "tries") + ", " + accuracy(stat) + "%";
            button.querySelector(".bar span").style.width = clamp(stat.mastery || 0, 0, 100) + "%";
            td.appendChild(button);
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        container.innerHTML = "";
        container.appendChild(table);
      }

      function renderStats() {
        var cells = allCells();
        var practiced = cells.filter(function (cell) {
          return cell.stat.attempts > 0;
        });
        var totals = cells.reduce(function (acc, cell) {
          acc.attempts += cell.stat.attempts || 0;
          acc.correct += cell.stat.correct || 0;
          acc.totalMs += cell.stat.totalMs || 0;
          return acc;
        }, { attempts: 0, correct: 0, totalMs: 0 });
        document.getElementById("statTotalAttempts").textContent = String(totals.attempts);
        document.getElementById("statTotalCorrect").textContent = String(totals.correct);
        document.getElementById("statTotalTime").textContent = timeText(totals.totalMs);
        document.getElementById("statActiveCells").textContent = practiced.length + "/" + cells.length;
        var weak = practiced.slice().sort(function (a, b) {
          return (a.stat.mastery || 0) - (b.stat.mastery || 0) || recentAccuracy(a.stat) - recentAccuracy(b.stat);
        }).slice(0, 8);
        var strong = practiced.slice().sort(function (a, b) {
          return (b.stat.mastery || 0) - (a.stat.mastery || 0) || recentAccuracy(b.stat) - recentAccuracy(a.stat);
        }).slice(0, 8);
        renderRankedList("weakList", weak);
        renderRankedList("strongList", strong);
      }

      function renderRankedList(id, cells) {
        var container = document.getElementById(id);
        container.innerHTML = "";
        if (cells.length === 0) {
          var empty = document.createElement("div");
          empty.className = "list-item";
          empty.innerHTML = "<div><strong></strong><span></span></div>";
          empty.querySelector("strong").textContent = t("stats.noAttemptsYet", "No attempts yet");
          empty.querySelector("span").textContent = t("stats.noAttemptsHint", "Practice will fill this in.");
          container.appendChild(empty);
          return;
        }
        cells.forEach(function (cell) {
          var item = document.createElement("button");
          item.type = "button";
          item.className = "list-item";
          item.dataset.categoryId = cell.category.id;
          item.dataset.level = String(cell.level);
          item.innerHTML = "<div><strong></strong><span></span></div><span class=\"pill\"></span>";
          item.querySelector("strong").textContent = cell.category.title + " L" + cell.level;
          item.querySelector("span").textContent = cell.stat.attempts + " " + t("stats.tries", "tries") + ", " + accuracy(cell.stat) + "% " + t("stats.accuracy", "accuracy");
          item.querySelector(".pill").textContent = Math.round(cell.stat.mastery || 0) + "%";
          container.appendChild(item);
        });
      }

      function renderSettings() {
        document.getElementById("groupBitsToggle").checked = !!progress.settings.groupBits;
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
          var cardData = LEARN_CARDS[category.id];
          if (!cardData) return;
          var card = document.createElement("article");
          card.className = "learn-card";
          card.id = "learn-card-" + category.id;
          if (category.id === learnSpotlightId) card.classList.add("spotlight");
          var title = document.createElement("h3");
          title.textContent = category.title;
          var concept = document.createElement("p");
          concept.textContent = cardData.concept;
          var rules = document.createElement("p");
          rules.textContent = cardData.rules;
          var example = document.createElement("code");
          example.textContent = cardData.example;
          var format = document.createElement("p");
          format.textContent = t("learn.answerFormat", "Answer format") + ": " + cardData.format;
          card.appendChild(title);
          card.appendChild(concept);
          card.appendChild(rules);
          card.appendChild(example);
          card.appendChild(format);
          container.appendChild(card);
        });
        if (learnSpotlightId) {
          window.setTimeout(function () {
            var card = document.getElementById("learn-card-" + learnSpotlightId);
            if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 0);
        }
      }

      function renderAll() {
        document.querySelectorAll(".view").forEach(function (view) {
          view.classList.toggle("active", view.id === "view-" + progress.view);
        });
        document.querySelectorAll("[data-view]").forEach(function (button) {
          button.classList.toggle("active", button.dataset.view === progress.view);
        });
        renderSummary();
        renderModeButtons();
        renderPracticeControls();
        renderCurrentMetrics();
        if (progress.view === "matrix") renderMatrix();
        if (progress.view === "stats") renderStats();
        if (progress.view === "learn") renderLearn();
        if (progress.view === "settings") renderSettings();
      }

      function setView(view) {
        if (view !== "learn") learnSpotlightId = null;
        progress.view = view;
        saveProgress();
        renderAll();
        if (view === "practice" && !currentQuestion) startQuestion();
      }

      function showCurrentLearnCard() {
        if (!currentQuestion) return;
        learnSpotlightId = currentQuestion.categoryId;
        setView("learn");
      }

      function setManualSelection(categoryId, level) {
        var category = getCategory(categoryId);
        progress.manual.categoryId = category.id;
        progress.manual.level = closestLevel(category, Number(level));
        progress.settings.adaptive = false;
        saveProgress();
        startQuestion();
      }

      function showFeedback(result, elapsedMs) {
        var feedback = document.getElementById("feedback");
        feedback.className = "feedback " + (result.correct ? "correct" : "incorrect");
        feedback.classList.remove("hidden");
        var verdict = result.correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite");
        feedback.innerHTML = "";
        var strong = document.createElement("strong");
        strong.textContent = verdict + " - " + t("messages.expected", "expected") + " " + result.expectedText;
        var details = document.createElement("div");
        details.textContent = result.explanation + " " + t("messages.time", "Time") + ": " + timeText(elapsedMs) + ".";
        feedback.appendChild(strong);
        feedback.appendChild(details);
      }

      function submitAnswer(event) {
        event.preventDefault();
        if (!currentQuestion) return;
        if (isPaused) return;
        if (submitted) {
          startQuestion();
          return;
        }
        var answer = document.getElementById("answerInput").value;
        var category = getCategory(currentQuestion.categoryId);
        var result = category.check(answer, currentQuestion);
        var elapsedMs = questionElapsedMs();
        recordResult(currentQuestion, result.correct, elapsedMs);
        submitted = true;
        document.getElementById("answerInput").disabled = true;
        document.getElementById("submitBtn").innerHTML = t("practice.next", "Next") + " <span class=\"key-symbol\">↵</span>";
        document.getElementById("submitBtn").focus();
        document.querySelector("[data-keypad-action=\"submit\"]").textContent = t("practice.next", "Next");
        renderPauseState();
        showFeedback(result, elapsedMs);
        renderCurrentMetrics();
        renderSummary();
      }

      function skipQuestion() {
        if (isPaused) return;
        startQuestion();
      }

      function insertIntoAnswer(text) {
        var input = document.getElementById("answerInput");
        if (input.disabled || isPaused) return;
        var start = document.activeElement === input && typeof input.selectionStart === "number" ? input.selectionStart : input.value.length;
        var end = document.activeElement === input && typeof input.selectionEnd === "number" ? input.selectionEnd : input.value.length;
        input.value = input.value.slice(0, start) + text + input.value.slice(end);
        var next = start + text.length;
        if (document.activeElement === input) input.setSelectionRange(next, next);
      }

      function backspaceAnswer() {
        var input = document.getElementById("answerInput");
        if (input.disabled || isPaused || input.value.length === 0) return;
        var focused = document.activeElement === input && typeof input.selectionStart === "number";
        var start = focused ? input.selectionStart : input.value.length;
        var end = focused ? input.selectionEnd : input.value.length;
        if (start !== end) {
          input.value = input.value.slice(0, start) + input.value.slice(end);
          if (focused) input.setSelectionRange(start, start);
          return;
        }
        if (start === 0) return;
        input.value = input.value.slice(0, start - 1) + input.value.slice(start);
        if (focused) input.setSelectionRange(start - 1, start - 1);
      }

      function handleKeypad(event) {
        var button = event.target.closest("button");
        if (!button) return;
        event.preventDefault();
        var insert = button.dataset.keypadInsert;
        var action = button.dataset.keypadAction;
        if (insert !== undefined) {
          insertIntoAnswer(insert);
          return;
        }
        if (action === "backspace") backspaceAnswer();
        if (action === "clear" && !isPaused && !document.getElementById("answerInput").disabled) document.getElementById("answerInput").value = "";
        if (action === "submit") document.getElementById("answerForm").requestSubmit();
      }

      function wireEvents() {
        document.querySelectorAll("[data-view]").forEach(function (button) {
          button.addEventListener("click", function () {
            setView(button.dataset.view);
          });
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
        document.getElementById("learnCurrentBtn").addEventListener("click", showCurrentLearnCard);
        document.getElementById("categorySelect").addEventListener("change", function (event) {
          setManualSelection(event.target.value, progress.manual.level);
        });
        document.getElementById("levelSelect").addEventListener("change", function (event) {
          setManualSelection(progress.manual.categoryId, Number(event.target.value));
        });
        document.getElementById("answerForm").addEventListener("submit", submitAnswer);
        document.getElementById("answerKeypad").addEventListener("pointerdown", function (event) {
          event.preventDefault();
        });
        document.getElementById("answerKeypad").addEventListener("click", handleKeypad);
        document.addEventListener("keydown", function (event) {
          if (event.key === "Escape" && isPaused) {
            event.preventDefault();
            resumePractice();
            return;
          }
          if (event.key !== "Enter" || !submitted || progress.view !== "practice") return;
          if (event.target && ["TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
          event.preventDefault();
          startQuestion();
        });
        document.getElementById("nextBtn").addEventListener("click", startQuestion);
        document.getElementById("skipBtn").addEventListener("click", skipQuestion);
        document.getElementById("matrix").addEventListener("click", function (event) {
          var button = event.target.closest("[data-category-id][data-level]");
          if (!button) return;
          setView("practice");
          setManualSelection(button.dataset.categoryId, Number(button.dataset.level));
        });
        document.getElementById("weakList").addEventListener("click", rankedListClick);
        document.getElementById("strongList").addEventListener("click", rankedListClick);
        document.getElementById("groupBitsToggle").addEventListener("change", function (event) {
          progress.settings.groupBits = event.target.checked;
          saveProgress();
          if (currentQuestion) renderQuestion();
        });
        document.getElementById("enabledCategories").addEventListener("change", function (event) {
          if (!event.target.dataset.categoryId) return;
          progress.settings.enabled[event.target.dataset.categoryId] = event.target.checked;
          saveProgress();
        });
        document.getElementById("exportBtn").addEventListener("click", function () {
          document.getElementById("dataBox").value = JSON.stringify(progress, null, 2);
        });
        document.getElementById("copyBtn").addEventListener("click", copyProgress);
        document.getElementById("importBtn").addEventListener("click", importProgress);
        document.getElementById("resetBtn").addEventListener("click", resetProgress);
      }

      function rankedListClick(event) {
        var button = event.target.closest("[data-category-id][data-level]");
        if (!button) return;
        setView("practice");
        setManualSelection(button.dataset.categoryId, Number(button.dataset.level));
      }

      function copyProgress() {
        var box = document.getElementById("dataBox");
        if (!box.value.trim()) box.value = JSON.stringify(progress, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(box.value).catch(function () {
            box.select();
          });
        } else {
          box.select();
        }
      }

      function importProgress() {
        var box = document.getElementById("dataBox");
        try {
          var imported = JSON.parse(box.value);
          progress = mergeProgress(createDefaultProgress(), imported);
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

      function runSelfTests() {
        var failures = [];
        function assert(name, condition) {
          if (!condition) failures.push(name);
        }
        [4, 8, 16, 32, 64].forEach(function (bits) {
          assert(bits + "-bit signed min", signedMin(bits) === -(1n << BigInt(bits - 1)));
          assert(bits + "-bit signed max", signedMax(bits) === (1n << BigInt(bits - 1)) - 1n);
          assert(bits + "-bit unsigned max", unsignedMax(bits) === (1n << BigInt(bits)) - 1n);
          var maxPlusOne = signedMax(bits) + 1n;
          assert(bits + "-bit signed add overflow", signedStatus(maxPlusOne, bits) === "overflow");
          assert(bits + "-bit signed max+1 wraps to min", toSigned(maxPlusOne, bits) === signedMin(bits));
          var minMinusOne = signedMin(bits) - 1n;
          assert(bits + "-bit signed sub underflow", signedStatus(minMinusOne, bits) === "underflow");
          assert(bits + "-bit unsigned add overflow", unsignedStatusAdd(unsignedMax(bits) + 1n, bits) === "overflow");
          assert(bits + "-bit unsigned add wraps zero", toUnsigned(unsignedMax(bits) + 1n, bits) === 0n);
          assert(bits + "-bit unsigned sub underflow", unsignedStatusSub(0n, 1n) === "underflow");
          assert(bits + "-bit unsigned sub wraps max", toUnsigned(-1n, bits) === unsignedMax(bits));
        });
        assert("logical right shift", formatBits(0b1000n >> 1n, 4) === "0100");
        assert("arithmetic right shift", formatBits(toUnsigned(toSigned(0b1000n, 4) >> 1n, 4), 4) === "1100");
        assert("left shift wraps", formatBits(0b1001n << 1n, 4) === "0010");
        assert("left shift carry", Number((0b1001n >> BigInt(4 - 1)) & 1n) === 1);
        assert("right shift carry", Number((0b1001n >> BigInt(1 - 1)) & 1n) === 1);
        assert("rotate left", formatBits(((0b1001n << 1n) | (0b1001n >> 3n)) & mask(4), 4) === "0011");
        assert("rotate right", formatBits(((0b1001n >> 1n) | (0b1001n << 3n)) & mask(4), 4) === "1100");
        assert("carry bits parse", parseCarryBitsAnswer("0101 1").bits === "0101" && parseCarryBitsAnswer("0101 1").carry === 1);
        var bytes = byteHex(0x1234A0B1n, 32);
        assert("big endian bytes", bytes.join(" ") === "12 34 A0 B1");
        assert("little endian bytes", bytes.slice().reverse().join(" ") === "B1 A0 34 12");
        if (failures.length) {
          console.error("Self tests failed", failures);
          return { ok: false, failures: failures };
        }
        console.info("Self tests passed");
        return { ok: true, failures: [] };
      }

      function init() {
        progress = loadProgress();
        rng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
        wireEvents();
        renderPracticeControls();
        renderAll();
        if (progress.view === "practice") startQuestion();
      }

      window.runSelfTests = runSelfTests;
      window.ProgrammerPractice = {
        categories: CATEGORIES,
        runSelfTests: runSelfTests
      };

      document.addEventListener("DOMContentLoaded", init);
    }());
