export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    localeCode: "en",
    appTitle: "AMD64 Assembly Practice",
    brandSubtitle: "Trace a controlled AMD64 long-mode subset: registers, addresses, integer flags, branches, stacks, and the System V ABI.",
    educationalNote: "Architecture model: amd64-long-sysv-v1 · Intel syntax primary · controlled GNU/AT&T translation · exact architectural state, never microarchitectural timing.",
    summary: { aria: "Progress summary", mastery: "Avg mastery", accuracy: "Accuracy", attempts: "Attempts" },
    nav: { aria: "Main", practice: "Practice", matrix: "Matrix", stats: "Stats", settings: "Settings", learn: "Learn" },
    practice: {
      modeAria: "Practice mode", adaptive: "Adaptive", manual: "Manual", pause: "Pause", paused: "Paused",
      learnThis: "Learn this", category: "Category", family: "Question family", level: "Level", mastery: "0% mastery",
      masterySuffix: "mastery", check: "Check", next: "Next", skip: "Skip", choose: "Choose…", keypadAria: "AMD64 hexadecimal answer keypad",
      delete: "Del", clear: "Clear", space: "Space", nextField: "Move to the next answer field", nextFieldShort: "Field →",
      pauseText: "The timer is stopped for this question.", resume: "Resume", controlsAria: "Practice controls",
      masteryMetric: "Mastery", accuracyMetric: "Accuracy", streak: "Streak", avgTime: "Avg time"
    },
    matrix: { title: "Skill Matrix", intro: "Every cell opens one stable AMD64 family at one structural difficulty level." },
    stats: {
      title: "Stats", intro: "Progress is tracked independently for every family and level.", totalAttempts: "Total attempts",
      totalCorrect: "Total correct", totalTime: "Total time", practicedLevels: "Practiced levels", needsWork: "Needs Work",
      strongest: "Strongest", tries: "tries", noAttemptsYet: "No attempts yet"
    },
    settings: {
      title: "Settings", intro: "Stored locally in this browser.", adaptiveCategories: "Adaptive categories", data: "Data",
      dataIntro: "Export, import, or reset local progress.", progressJson: "Progress JSON", export: "Export", copy: "Copy",
      import: "Import", reset: "Reset"
    },
    messages: {
      invalidJson: "Invalid JSON", copied: "Progress copied.", resetConfirm: "Reset all local AMD64 progress?", correct: "Correct",
      notQuite: "Not quite", expected: "Expected", time: "Time"
    },
    learn: { title: "Learn", intro: "Exact amd64-long-sysv-v1 rules and a representative example for every family." },
    prompts: { identify: "Identify the exact architectural properties.", compute: "Compute the exact architectural result.", execute: "Execute the displayed instruction.", trace: "Trace the displayed instruction sequence.", decide: "Decide under the pinned architecture or ABI contract.", translate: "Translate without changing the instruction semantics." },
    generated: { modelNote: "All registers, flags, memory bytes, addresses, and ABI facts shown here are initialized synthetic state.", resultLead: "Exact result" },
    fieldLabels: {
      parent: "64-bit parent", bits: "Bit range", zeroUpper: "32-bit write clears upper half", value: "Value", bytes: "Ordered bytes",
      destinationKind: "Destination kind", sourceKind: "Source kind", width: "Operand width", address: "Address", flagsUnchanged: "Flags unchanged",
      memoryReads: "Memory reads", translation: "Translation", destination: "Destination", preserved: "Other state preserved", result: "Result",
      CF: "CF", PF: "PF", AF: "AF", ZF: "ZF", SF: "SF", OF: "OF", unsignedRelation: "Unsigned relation",
      signedRelation: "Signed relation", taken: "Taken", jump: "Jump", RIP: "RIP", RSP: "RSP", memoryValue: "Stack qword",
      location: "Location", registerClass: "Register class", responsibility: "Responsibility", modulus: "RSP mod 16", valid: "ABI-valid",
      RBP: "RBP", range: "Byte range", path: "Executed path", determined: "Determination", abiValid: "ABI-valid", state: "Final state"
    },
    choiceLabels: {
      yes: "Yes", no: "No", register: "Register", memory: "Memory", immediate: "Immediate", none: "None", unchanged: "Unchanged",
      less: "Less", equal: "Equal", greater: "Greater", below: "Below", above: "Above", taken: "Taken", notTaken: "Not taken",
      callerSaved: "Caller-saved", calleeSaved: "Callee-saved", caller: "Caller", callee: "Callee", determinedTaken: "Determined: taken",
      determinedNotTaken: "Determined: not taken", indeterminate: "Indeterminate", valid: "Valid", invalid: "Invalid"
    }
  }
};
