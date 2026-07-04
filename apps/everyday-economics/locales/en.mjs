export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "Everyday Economics",
    brandSubtitle: "Applied math drills for prices, percentages, interest, inflation, and simple risk.",
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
      unitPrices: { title: "Unit Prices", short: "Unit" },
      discounts: { title: "Discounts and Tax", short: "Sale" },
      percentChange: { title: "Percent Change", short: "% Chg" },
      interest: { title: "Interest", short: "Int" },
      inflation: { title: "Inflation", short: "Infl" },
      subscriptions: { title: "Subscriptions", short: "Sub" },
      expectedValue: { title: "Expected Value", short: "EV" }
    },
    learnCards: {
      unitPrices: {
        concept: "Unit price makes differently sized offers comparable.",
        rules: "Divide total price by quantity. The lower unit price is cheaper per unit.",
        example: "$6.00 for 3 kg means $2.00/kg.",
        format: "Usually money rounded to cents."
      },
      discounts: {
        concept: "Discounts reduce the price before tax unless the question says otherwise.",
        rules: "A p% discount means paying 100-p percent of the original price.",
        example: "$80 at 25% off is $60 before tax.",
        format: "Money rounded to cents."
      },
      percentChange: {
        concept: "Percent change compares the change to the original value.",
        rules: "(new - old) / old * 100.",
        example: "50 to 60 is a 20% increase.",
        format: "Percent number; the percent sign is optional."
      },
      interest: {
        concept: "Interest grows money by a rate over time.",
        rules: "Simple interest: P(1+rt). Compound interest: P(1+r)^t for yearly compounding.",
        example: "$100 at 5% for 2 years compounds to $110.25.",
        format: "Money rounded to cents."
      },
      inflation: {
        concept: "Inflation changes purchasing power and nominal prices.",
        rules: "Apply the rate like any other percent increase, often repeatedly over years.",
        example: "$100 with 3% inflation becomes $103 after one year.",
        format: "Money rounded to cents, or percent when asked."
      },
      subscriptions: {
        concept: "Recurring costs are easier to compare over a shared time horizon.",
        rules: "Convert everything to the requested number of months, then compare totals.",
        example: "$12/month for 12 months is $144/year.",
        format: "Money rounded to cents."
      },
      expectedValue: {
        concept: "Expected value is the long-run average outcome from probabilities and payoffs.",
        rules: "Multiply each outcome by its probability, then add.",
        example: "25% chance of $20 has expected value $5.",
        format: "Money rounded to cents."
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
      intro: "Compact reminders for the applied math behind each drill. These are arithmetic exercises, not financial advice.",
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
      unitPrices: {
        title: "Find the unit price.",
        note: "Enter the price per unit, rounded to cents.",
        explanation: "{price} / {quantity} = {answer} per {unit}."
      },
      discounts: {
        title: "Find the final price.",
        note: "Enter money rounded to cents.",
        explanation: "After {discount}% off, tax of {tax}% is applied. Final price: {answer}."
      },
      percentChange: {
        title: "Find the percent change.",
        note: "Enter the percent change; the percent sign is optional.",
        explanation: "Change is {change} over original {old}, so percent change is {answer}."
      },
      interest: {
        title: "Find the ending balance.",
        note: "Enter money rounded to cents.",
        explanation: "{kind} interest gives an ending balance of {answer}."
      },
      inflation: {
        title: "Adjust for inflation.",
        note: "Enter money rounded to cents.",
        explanation: "Applying {rate}% inflation for {years} years gives {answer}."
      },
      subscriptions: {
        title: "Compare the subscription cost.",
        note: "Enter the total cost over the requested period.",
        explanation: "The total over {months} months is {answer}."
      },
      expectedValue: {
        title: "Find the expected value.",
        note: "Enter money rounded to cents.",
        explanation: "{probability}% * {payoff} minus the certain cost {cost} gives {answer}."
      }
    }
  }
};
