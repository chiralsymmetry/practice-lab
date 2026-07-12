export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "Floating Point Practice",
    brandSubtitle: "Toy formats, IEEE-style fields, exact fractions, and the strange little rules of floats.",
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
      classify: { title: "Classify Floats", short: "Class" },
      decode: { title: "Decode Value", short: "Decode" },
      encode: { title: "Encode Value", short: "Encode" },
      spacing: { title: "Exponent & Spacing", short: "Spacing" },
      exactness: { title: "Exactness", short: "Exact" },
      "will-change": { title: "Will It Change?", short: "Change" }
    },
    learnCards: {
      classify: {
        concept: "The exponent field decides whether a value is normal, subnormal, zero, infinity, or NaN.",
        rules: "All-ones exponent is infinity or NaN. All-zero exponent is zero or subnormal. The sign affects the value, not the class name.",
        example: "FP4 0110 and 1110 are both infinity; FP4 0001 and 1001 are both subnormal.",
        format: "Enter normal, subnormal, zero, infinity, or nan."
      },
      decode: {
        concept: "Small formats make floating-point values visible enough to decode exactly.",
        rules: "Normal values have an implicit leading 1. Subnormals do not.",
        example: "FP4 0001 = 1/2; FP4 0010 = 1; FP6 can also show values such as 3/2.",
        format: "Enter an exact integer or fraction. Decimal and mixed forms like 1.5 or 1 1/2 are accepted when exact."
      },
      encode: {
        concept: "Encoding reverses decoding: choose sign, biased exponent, and fraction bits.",
        rules: "The generated values are representable in the shown format. NaN uses one representative NaN pattern.",
        example: "In FP4, value 1 encodes as 0010 and -0 encodes as 1000.",
        format: "Enter the complete bit pattern. Hex is accepted for FP16 and FP32."
      },
      spacing: {
        concept: "Within a power-of-two band, adjacent floating-point numbers are evenly spaced.",
        rules: "For normal values near 2^e, spacing is 2^(e - (precision bits - 1)).",
        example: "FP32 near 2^20 has spacing 2^(20 - 23) = 1/8.",
        format: "Enter an unbiased exponent or an exact spacing such as 1/8."
      },
      exactness: {
        concept: "Binary floating point represents fractions exactly only when the reduced denominator is a power of two.",
        rules: "Integers are exact while there are enough precision bits and the value is within range.",
        example: "0.5 and 3/8 are exact; 0.1 is not. FP32 represents 16777216 exactly but not 16777217.",
        format: "Enter yes or no."
      },
      "will-change": {
        concept: "Adding a small number to a large float may not change the stored value.",
        rules: "If the increment is less than half the local spacing, round-to-nearest keeps the old value.",
        example: "For FP32 near 1000000, spacing is 1/16, so adding 0.01 does not change it.",
        format: "Enter yes or no."
      }
    },
    settings: {
      title: "Settings",
      intro: "Stored locally in this browser.",
      adaptiveCategories: "Adaptive categories",
      data: "Data",
      dataIntro: "Export, import, or reset local progress.",
      progressJson: "Progress JSON",
      export: "Export",
      copy: "Copy",
      import: "Import",
      reset: "Reset"
    },
    learn: {
      title: "Learn",
      intro: "Compact reminders for floating-point representation drills.",
      concept: "Concept",
      rules: "Rule of thumb",
      example: "Example",
      format: "Answer format"
    },
    messages: {
      invalidJson: "Invalid JSON",
      resetConfirm: "Reset all local progress?",
      correct: "Correct",
      notQuite: "Not quite",
      expected: "expected",
      time: "Time"
    },
    answers: {
      yes: "yes",
      no: "no"
    },
    prompts: {
      common: {
        formatSpec: "sign {signBits}, exponent {expBits}, fraction {fracBits}, bias {bias}, precision {precisionBits}",
        bits: "Bits: {bits}",
        value: "Value: {value}",
        exponentField: "Exponent field: {exponent}",
        nearPower: "Near 2^{power}",
        addition: "{x} + {y}"
      },
      classify: {
        title: "Classify this floating-point pattern.",
        note: "Enter normal, subnormal, zero, infinity, or nan.",
        explanation: "Exponent {exponent} and fraction {fraction} classify it as {kind}.{signNote}",
        negativeFiniteSignNote: "Sign bit 1 makes the value negative, but the class is still based on exponent and fraction.",
        signedSpecialSignNote: "Sign bit 1 affects the signed value, but the class name stays the same."
      },
      decode: {
        title: "Decode this floating-point value.",
        note: "Enter the exact value as an integer or fraction.",
        explanation: "This pattern is a {kind} value equal to {value}."
      },
      encode: {
        title: "Encode this floating-point value.",
        note: "Enter the complete bit pattern.",
        explanation: "{value} is encoded as {bits}."
      },
      bias: {
        title: "Remove the exponent bias.",
        note: "Enter the unbiased exponent as signed decimal.",
        explanation: "Stored exponent {exponent} minus bias {bias} gives {unbiased}."
      },
      spacing: {
        title: "Find the spacing near this magnitude.",
        note: "Enter the exact ULP spacing.",
        explanation: "{format} has {precision} precision bits, so spacing near 2^{power} is {spacing}."
      },
      exactness: {
        title: "Is this value exactly representable?",
        note: "Enter yes or no.",
        explanation: "In {format}, {value} is {result}."
      },
      willChange: {
        title: "Will the stored value change?",
        note: "Assume round-to-nearest. Enter yes or no.",
        explanation: "Near {x}, {format} spacing is {spacing}; adding {y} {result}."
      }
    }
  }
};
