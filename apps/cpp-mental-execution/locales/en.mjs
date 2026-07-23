export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "C++ Code Reading",
    brandSubtitle: "Trace, bind, infer, resolve, and judge small C++ snippets.",
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
      runtime: { title: "Runtime State & Control", short: "Run" },
      aliasing: { title: "Aliasing & Parameters", short: "Alias" },
      types: { title: "Types & Conversions", short: "Type" },
      resolution: { title: "Overloads & Templates", short: "Call" },
      lifetime: { title: "Lifetime & Ownership", short: "Life" },
      declarations: { title: "Declarations & Callables", short: "Decl" }
    },
    learnCards: {
      runtime: {
        concept: "Runtime tracing is about state changes and guaranteed control flow, not just doing a longer loop.",
        rules: "Track only live variables, then update them in the order the statements actually execute. Short-circuit operators skip the right side when the left side decides the result.",
        example: "a++ yields the old value and mutates a; do not use postfix syntax to infer unrelated evaluation order.",
        format: "Enter one value, or values like a=3 b=5."
      },
      aliasing: {
        concept: "Aliasing questions train the model of names, objects, addresses, references, and pointer values.",
        rules: "A reference stays bound to its original object. A pointer can be reseated. A pointer parameter such as int* p is itself passed by value.",
        example: "int& r = *p; p = &b; leaves r bound to the object it first named.",
        format: "Enter the requested value or values, for example a=7 b=-2."
      },
      types: {
        concept: "C++ type reading combines declared type, expression type, initialization form, and implicit conversions.",
        rules: "Plain auto usually acts like by-value template deduction: references and top-level const are dropped. List initialization rejects narrowing.",
        example: "std::uint8_t x = 255; auto y = x + 1; gives y type int and value 256.",
        format: "Enter the deduced type, a type and value, or a judgement such as compile error."
      },
      resolution: {
        concept: "A call is chosen from viable candidates, not just from the function name.",
        rules: "Reference binding, exact matches, conversions, and template deduction all affect which overload wins.",
        example: "An int lvalue prefers int&, a const int lvalue prefers const int&, and a literal can bind to int&&.",
        format: "Enter the selected output, overload kind, or deduced template type."
      },
      lifetime: {
        concept: "Lifetime questions ask whether handles still refer to live objects, and whether ownership changed.",
        rules: "Dangling pointers and invalidated iterators are undefined behavior. std::move is only a cast; the move happens when another operation consumes it.",
        example: "After auto q = std::move(p), p is empty and q owns the object.",
        format: "Enter defined, UB, compile error, or the visible output."
      },
      declarations: {
        concept: "Declarations and callables often hide simple operations behind dense C++ syntax.",
        rules: "Read declarations from the identifier outward. Function pointers, member pointers, lambdas, and overload sets each add one binding step.",
        example: "int* a[4] is an array of four pointers; int (*b)[4] is a pointer to an array of four int.",
        format: "Enter the selected name or the visible output."
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
      intro: "Compact reminders for reading ordinary, well-defined C++17-style snippets. Lifetime and judgement drills mark exceptions explicitly.",
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
      no: "no",
      defined: "defined",
      undefinedBehavior: "undefined behavior",
      compileError: "compile error"
    },
    prompts: {
      runtimeValue: {
        title: "Trace the runtime state.",
        note: "What is the final value of {variable}?",
        explanation: "Tracing the executed statements gives {answer}."
      },
      runtimePair: {
        title: "Trace the dependent loop.",
        note: "What are the final values of a and b?",
        explanation: "The final values are {answer}."
      },
      runtimeTriple: {
        title: "Trace the early return.",
        note: "What are the final values of a, b, and r?",
        explanation: "The final values are {answer}."
      },
      aliasValue: {
        title: "Trace the alias.",
        note: "What is the final value of {variable}?",
        explanation: "The final value is {answer}."
      },
      aliasPair: {
        title: "Trace the aliases and parameters.",
        note: "What are the final values of a and b?",
        explanation: "References stay bound and pointer parameters are copied, so the final values are {answer}."
      },
      types: {
        title: "Infer the type.",
        note: "What is the type of x?",
        explanation: "The answer is {answer}."
      },
      typeAndValue: {
        title: "Infer the type and value.",
        note: "What type and value does y have?",
        explanation: "Integer promotion gives {answer}."
      },
      typeJudgement: {
        title: "Judge the initialization.",
        note: "Does this compile? Enter defined, UB, or compile error.",
        explanation: "The correct judgement is {answer}."
      },
      resolutionOutput: {
        title: "Resolve the call.",
        note: "What is printed?",
        explanation: "The selected call prints {answer}."
      },
      resolutionType: {
        title: "Deduce the template argument.",
        note: "What is T?",
        explanation: "Template deduction gives T = {answer}."
      },
      lifetimeJudge: {
        title: "Judge lifetime and validity.",
        note: "Enter defined, UB, or compile error.",
        explanation: "The correct judgement is {answer}."
      },
      lifetimeOutput: {
        title: "Trace ownership and output.",
        note: "What is printed?",
        explanation: "The visible output is {answer}."
      },
      declarations: {
        title: "Decode the declaration.",
        note: "Which name is the array of four pointers?",
        explanation: "The answer is {answer}."
      },
      declarationsOutput: {
        title: "Trace the callable.",
        note: "What is printed?",
        explanation: "The visible output is {answer}."
      }
    }
  }
};
