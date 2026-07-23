export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "Electric Circuits Basics",
    brandSubtitle: "Generated DC circuit drills for Ohm's law, power, resistors, dividers, and LEDs.",
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
      avgTime: "Avg time",
      schematicAria: "Circuit schematic"
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
      ohmsLaw: { title: "Ohm's Law", short: "Ohm" },
      power: { title: "Power", short: "Power" },
      seriesResistance: { title: "Series Resistance", short: "Series" },
      parallelResistance: { title: "Parallel Resistance", short: "Parallel" },
      voltageDivider: { title: "Voltage Divider", short: "Divider" },
      ledResistor: { title: "LED Resistor", short: "LED" }
    },
    learnCards: {
      ohmsLaw: {
        concept: "Voltage, current, and resistance are tied together in a simple ideal resistor.",
        rules: "V = I * R. Rearrange to I = V / R or R = V / I.",
        example: "20 mA through 220 Ω drops 4.4 V.",
        format: "Enter the requested unit. Units are optional; compatible units like A vs mA are accepted."
      },
      power: {
        concept: "Power is the rate at which the circuit element dissipates energy.",
        rules: "P = V * I. With Ohm's law, P = I^2R or P = V^2/R.",
        example: "5 V at 20 mA is 0.1 W, or 100 mW.",
        format: "Enter watts or milliwatts as requested."
      },
      seriesResistance: {
        concept: "Series resistors share one current path.",
        rules: "Add the resistance values: Rtotal = R1 + R2 + ...",
        example: "220 Ω + 330 Ω = 550 Ω.",
        format: "Enter ohms. kΩ input is accepted when equivalent."
      },
      parallelResistance: {
        concept: "Parallel resistors create multiple current paths.",
        rules: "For two resistors: Rtotal = R1*R2/(R1+R2). The total is always below the smallest branch.",
        example: "Two 1 kΩ resistors in parallel make 500 Ω.",
        format: "Enter ohms, usually rounded to hundredths."
      },
      voltageDivider: {
        concept: "A two-resistor divider taps a fraction of the input voltage.",
        rules: "Vout = Vin * R2 / (R1 + R2) when Vout is measured across R2.",
        example: "5 V with equal resistors gives 2.5 V at the midpoint.",
        format: "Enter volts, usually rounded to thousandths."
      },
      ledResistor: {
        concept: "An LED series resistor drops the supply voltage that the LED does not use.",
        rules: "R = (Vsupply - Vforward) / I. Current must be in amps for the formula.",
        example: "5 V supply, 2 V LED, 20 mA gives 150 Ω.",
        format: "Enter ohms, usually rounded to tenths."
      }
    },
    settings: {
      title: "Settings",
      intro: "Stored locally in this browser.",
      numberFormat: "Number format",
      numberFormatAuto: "Auto",
      numberFormatPoint: "1.23",
      numberFormatComma: "1,23",
      adaptiveCategories: "Adaptive categories",
      data: "Data",
      dataIntro: "Export, import, or reset local progress.",
      progressJson: "Progress JSON",
      export: "Export",
      copy: "Copy",
      import: "Import",
      reset: "Reset"
    },
    calculator: {
      title: "Calculator",
      keypadAria: "Calculator keypad",
      ready: "Ready",
      use: "Use",
      delete: "Del",
      clear: "Clear",
      error: "Check expression"
    },
    learn: {
      title: "Learn",
      intro: "Compact reminders for idealized DC circuit drills. These exercises ignore tolerance, heat, parasitics, and safety limits unless a question explicitly mentions them.",
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
      ohmsLaw: {
        title: "Solve the missing Ohm's law value.",
        body: "Voltage: {voltage}\nCurrent: {current}\nResistance: {resistance}\nWhat is the missing value in {target}?",
        note: "Enter the requested value; compatible units are accepted.",
        explanation: "Using V = I * R gives {answer}."
      },
      power: {
        title: "Find the dissipated power.",
        body: "Voltage: {voltage}\nCurrent: {current}\nResistance: {resistance}\nWhat is the power in {target}?",
        note: "Enter power in the requested unit.",
        explanation: "P = V * I, so the power is {answer}."
      },
      seriesResistance: {
        title: "Combine series resistors.",
        body: "R1 = {r1}\nR2 = {r2}\nWhat is the total resistance?",
        note: "Enter resistance in ohms.",
        explanation: "Series resistors add directly: {answer}."
      },
      seriesResistanceThree: {
        title: "Combine series resistors.",
        body: "R1 = {r1}\nR2 = {r2}\nR3 = {r3}\nWhat is the total resistance?",
        note: "Enter resistance in ohms.",
        explanation: "Series resistors add directly: {answer}."
      },
      parallelResistance: {
        title: "Combine parallel resistors.",
        body: "R1 = {r1}\nR2 = {r2}\nWhat is the equivalent resistance?",
        note: "Enter resistance in ohms, rounded to hundredths.",
        explanation: "For two parallel resistors, R = R1*R2/(R1+R2), which gives {answer}."
      },
      voltageDivider: {
        title: "Find the divider output.",
        body: "Vin = {vin}\nR1 = {r1}\nR2 = {r2}\nVout is across R2.\nWhat is Vout?",
        note: "Enter volts, rounded to thousandths.",
        explanation: "Vout = Vin * R2 / (R1 + R2), so Vout is {answer}."
      },
      ledResistor: {
        title: "Choose the LED series resistor.",
        body: "Supply voltage: {supply}\nLED forward voltage: {forward}\nTarget current: {current}\nWhat series resistance is needed?",
        note: "Enter resistance in ohms, rounded to tenths.",
        explanation: "The resistor drops supply minus LED voltage. R = (Vs - Vf) / I = {answer}."
      }
    }
  }
};
