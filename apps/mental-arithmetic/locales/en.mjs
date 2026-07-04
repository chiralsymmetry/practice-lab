export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "Mental Arithmetic",
    brandSubtitle: "Fast integer arithmetic drills for everyday head calculation.",
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
      addition: { title: "Addition", short: "Add" },
      subtraction: { title: "Subtraction", short: "Sub" },
      multiplication: { title: "Multiplication", short: "Mul" },
      division: { title: "Division", short: "Div" },
      complements: { title: "Complements", short: "Comp" },
      percentages: { title: "Percentages", short: "Pct" }
    },
    learnCards: {
      addition: {
        concept: "Addition speed often comes from splitting one number into friendly pieces.",
        rules: "Bridge through 10, 100, or 1000 when it reduces carrying.",
        example: "68 + 47 = 68 + 32 + 15 = 115",
        format: "Enter the integer result."
      },
      subtraction: {
        concept: "Subtraction is easier when you count distance or compensate both sides.",
        rules: "Adding the same amount to both operands keeps the difference unchanged.",
        example: "103 - 78 = 105 - 80 = 25",
        format: "Enter the integer result."
      },
      multiplication: {
        concept: "Use nearby round numbers, doubling, halving, and small facts.",
        rules: "Distribute: a * (b + c) = a*b + a*c.",
        example: "24 * 16 = 24 * (8 * 2) = 384",
        format: "Enter the integer product."
      },
      division: {
        concept: "These drills use exact division, so the answer is an integer quotient.",
        rules: "Think of division as finding the missing factor.",
        example: "144 / 12 = 12 because 12 * 12 = 144",
        format: "Enter the integer quotient."
      },
      complements: {
        concept: "Complements build fast number sense for making round totals.",
        rules: "Find the amount needed to reach 10, 100, 1000, or another target.",
        example: "73 needs 27 to reach 100",
        format: "Enter the missing amount."
      },
      percentages: {
        concept: "Many percentages are fractions with friendlier mental forms.",
        rules: "10% is divide by 10, 5% is half of 10%, 25% is a quarter.",
        example: "15% of 80 = 10% of 80 + 5% of 80 = 12",
        format: "Enter the integer result."
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
      intro: "Compact reminders for the mental strategies behind each drill.",
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
    prompts: {
      addition: {
        title: "Add these numbers.",
        note: "Enter the sum.",
        explanation: "{a} + {b} = {answer}."
      },
      subtraction: {
        title: "Subtract these numbers.",
        note: "Enter the difference.",
        explanation: "{a} - {b} = {answer}."
      },
      multiplication: {
        title: "Multiply these numbers.",
        note: "Enter the product.",
        explanation: "{a} * {b} = {answer}."
      },
      division: {
        title: "Divide these numbers.",
        note: "Enter the exact integer quotient.",
        explanation: "{dividend} / {divisor} = {answer}."
      },
      complements: {
        title: "Find the complement.",
        note: "Enter the missing amount.",
        explanation: "{value} + {answer} = {target}."
      },
      percentages: {
        title: "Compute the percentage.",
        note: "Enter the integer result.",
        explanation: "{percent}% of {base} = {answer}."
      }
    }
  }
};
