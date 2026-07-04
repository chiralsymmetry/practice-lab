export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "Programmer Practice",
    brandSubtitle: "Bits, bases, fixed-width arithmetic, masks, shifts, and memory order.",
    summary: {
      aria: "Progress summary",
      mastery: "Avg mastery",
      accuracy: "Accuracy",
      attempts: "Attempts"
    },
    nav: {
      aria: "Main",
      practice: "Practice",
      matrix: "Matrix",
      stats: "Stats",
      learn: "Learn",
      settings: "Settings"
    },
    practice: {
      modeAria: "Practice mode",
      adaptive: "Adaptive",
      manual: "Manual",
      pause: "Pause",
      paused: "Paused",
      learnThis: "Learn this",
      category: "Category",
      level: "Level",
      mastery: "0% mastery",
      masterySuffix: "mastery",
      answer: "Answer",
      check: "Check",
      next: "Next",
      skip: "Skip",
      keypadAria: "Answer keypad",
      delete: "Del",
      clear: "Clear",
      pauseText: "The timer is stopped for this question.",
      resume: "Resume",
      controlsAria: "Practice controls",
      masteryMetric: "Mastery",
      accuracyMetric: "Accuracy",
      streak: "Streak",
      avgTime: "Avg time"
    },
    matrix: {
      title: "Category Matrix",
      intro: "Each level cell opens manual practice for that category."
    },
    stats: {
      title: "Stats",
      intro: "Progress across all stored category levels.",
      totalAttempts: "Total attempts",
      totalCorrect: "Total correct",
      totalTime: "Total time",
      practicedLevels: "Practiced levels",
      needsWork: "Needs Work",
      strongest: "Strongest",
      tries: "tries",
      accuracy: "accuracy",
      noAttemptsYet: "No attempts yet",
      noAttemptsHint: "Practice will fill this in."
    },
    categories: {
      "powers": { title: "Powers of Two", short: "2^n" },
      "numeric-views": { title: "Signed and Unsigned Views", short: "Views" },
      "base-bits": { title: "Bits, Hex, and Octal", short: "Bases" },
      "signed-add": { title: "Two's Complement Addition", short: "S Add" },
      "signed-sub": { title: "Two's Complement Subtraction", short: "S Sub" },
      "unsigned-add": { title: "Unsigned Addition", short: "U Add" },
      "unsigned-sub": { title: "Unsigned Subtraction", short: "U Sub" },
      "bitwise": { title: "Binary Arithmetic and Bitwise", short: "Ops" },
      "shifts": { title: "Shifts", short: "Shift" },
      "rotates": { title: "Rotates", short: "Rot" },
      "endian": { title: "Endian Memory Order", short: "Endian" },
      "masks": { title: "Masks and Flags", short: "Masks" },
      "ranges": { title: "N-bit Ranges", short: "Range" },
      "extension": { title: "Extension and Truncation", short: "Ext" }
    },
    learnCards: {
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
    },
    settings: {
      title: "Settings",
      intro: "Stored locally in this browser.",
      groupBits: "Group binary digits in fours",
      adaptiveCategories: "Adaptive categories",
      data: "Data",
      dataIntro: "Export, import, or reset local progress.",
      progressJson: "Progress JSON",
      export: "Export",
      copy: "Copy",
      import: "Import",
      reset: "Reset"
    },
    messages: {
      invalidJson: "Invalid JSON",
      resetConfirm: "Reset all local progress?",
      correct: "Correct",
      notQuite: "Not quite",
      expected: "expected",
      time: "Time"
    },
    learn: {
      title: "Learn",
      intro: "Compact reminders for the drills, including expected answer formats.",
      answerFormat: "Answer format"
    }
  }
};
