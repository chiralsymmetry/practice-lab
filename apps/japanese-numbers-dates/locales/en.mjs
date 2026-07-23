export default {
  code: "en",
  lang: "en",
  suffix: "",
  text: {
    appTitle: "Japanese Numbers & Dates",
    brandSubtitle: "Practice Japanese readings for numbers, counters, months, dates, and weekdays.",
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
      numberReading: { title: "Number Reading", short: "Read" },
      numberValue: { title: "Number Value", short: "Value" },
      dates: { title: "Dates", short: "Dates" },
      calendarWords: { title: "Calendar Words", short: "Cal" },
      counters: { title: "Counters", short: "Count" }
    },
    counterLabels: {
      people: "people",
      flat: "flat things",
      long: "long things",
      small: "small things",
      books: "books",
      times: "times"
    },
    calendar: {
      monthNames: {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
      },
      weekdayNames: {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday"
      },
      relative: {
        dayBeforeYesterday: "the day before yesterday",
        yesterday: "yesterday",
        today: "today",
        tomorrow: "tomorrow",
        dayAfterTomorrow: "the day after tomorrow"
      }
    },
    learnCards: {
      numberReading: {
        concept: "Japanese groups large numbers by ten-thousands, so 10,000 is いちまん.",
        rules: "Learn the irregular hundreds and thousands early: さんびゃく, ろっぴゃく, はっぴゃく, さんぜん, はっせん.",
        example: "3,456 -> さんぜんよんひゃくごじゅうろく",
        format: "Enter kana or romaji. Spaces and hyphens in romaji are ignored."
      },
      numberValue: {
        concept: "Reading Japanese numbers backwards into Arabic numerals builds fast recognition.",
        rules: "Listen for the unit words じゅう, ひゃく, せん, and まん.",
        example: "にせんさんびゃく -> 2300",
        format: "Enter an Arabic numeral."
      },
      dates: {
        concept: "Months are mostly number + がつ, but April, July, and September use special readings.",
        rules: "Many days of the month are special: ついたち, ふつか, みっか, よっか, とおか, はつか.",
        example: "4/1 -> しがつついたち",
        format: "Enter kana or romaji for readings; enter M/D when asked for a date value."
      },
      calendarWords: {
        concept: "Calendar words mix numeric month readings, weekday kanji, and a few useful relative-day words.",
        rules: "Weekday order here is Monday = 1 through Sunday = 7.",
        example: "Wednesday -> 水曜日 / すいようび",
        format: "Enter the requested Japanese word, number, or offset."
      },
      counters: {
        concept: "Counters change the pronunciation of both the number and the counter.",
        rules: "Irregular readings are the point: ひとり, ふたり, いっぽん, さんぼん, ろっぽん, いっこ, はっこ.",
        example: "3 long things -> さんぼん",
        format: "Enter kana or romaji."
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
      intro: "Compact reminders for each Japanese drill type.",
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
      numberReading: {
        title: "Write this number in Japanese.",
        note: "Enter kana or romaji.",
        explanation: "{n} is {answer}."
      },
      numberValue: {
        title: "Read this Japanese number.",
        note: "Enter the Arabic numeral.",
        explanation: "{reading} is {n}."
      },
      monthReading: {
        title: "Write the month reading.",
        note: "Enter kana or romaji.",
        explanation: "{month}月 is {answer}."
      },
      dayReading: {
        title: "Write the day-of-month reading.",
        note: "Enter kana or romaji.",
        explanation: "{day}日 is {answer}."
      },
      dateReading: {
        title: "Write this date in Japanese.",
        note: "Enter the month and day reading.",
        explanation: "{month}/{day} is {answer}."
      },
      dateValue: {
        title: "Interpret this Japanese date.",
        note: "Enter M/D.",
        explanation: "The date is {answer}."
      },
      monthNumber: {
        title: "Interpret this Japanese month.",
        note: "Enter the month number.",
        explanation: "{reading} is month {month}."
      },
      weekdayJapanese: {
        title: "Write the weekday in Japanese.",
        note: "Enter kanji, kana, or romaji.",
        explanation: "{weekday} is {answer}."
      },
      weekdayNumber: {
        title: "Interpret this Japanese weekday.",
        note: "Enter 1 for Monday through 7 for Sunday.",
        explanation: "{weekday} is weekday {answer}."
      },
      relativeJapanese: {
        title: "Write the relative day in Japanese.",
        note: "Enter kana or romaji.",
        explanation: "{word} is {answer}."
      },
      relativeOffset: {
        title: "Interpret this relative day.",
        note: "Enter the day offset: yesterday is -1, today is 0, tomorrow is 1.",
        explanation: "{word} has offset {answer}."
      },
      counterReading: {
        title: "Write the counter phrase.",
        note: "Enter kana or romaji.",
        explanation: "{count} {label} is {answer}."
      }
    }
  }
};
