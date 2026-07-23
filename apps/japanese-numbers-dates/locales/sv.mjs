export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    appTitle: "Japanska tal och datum",
    brandSubtitle: "Öva japanska läsningar för tal, räknare, månader, datum och veckodagar.",
    summary: {
      aria: "Sammanfattning av framsteg",
      mastery: "Snittnivå",
      accuracy: "Träffsäkerhet",
      attempts: "Försök"
    },
    nav: {
      aria: "Huvudmeny",
      practice: "Öva",
      matrix: "Matris",
      stats: "Statistik",
      learn: "Lär",
      settings: "Inställningar"
    },
    practice: {
      modeAria: "Övningsläge",
      adaptive: "Adaptivt",
      manual: "Manuellt",
      pause: "Paus",
      paused: "Pausat",
      learnThis: "Lär detta",
      category: "Kategori",
      level: "Nivå",
      mastery: "0% nivå",
      masterySuffix: "nivå",
      answer: "Svar",
      check: "Rätta",
      next: "Nästa",
      skip: "Hoppa över",
      keypadAria: "Svarsknappar",
      delete: "Radera",
      clear: "Töm",
      pauseText: "Tidtagningen är stoppad för den här frågan.",
      resume: "Fortsätt",
      controlsAria: "Övningskontroller",
      masteryMetric: "Nivå",
      accuracyMetric: "Träffsäkerhet",
      streak: "Svit",
      avgTime: "Snittid"
    },
    matrix: {
      title: "Kategorimatris",
      intro: "Varje nivåcell öppnar manuell övning för den kategorin."
    },
    stats: {
      title: "Statistik",
      intro: "Framsteg över alla sparade kategorinivåer.",
      totalAttempts: "Totalt antal försök",
      totalCorrect: "Totalt rätt",
      totalTime: "Total tid",
      practicedLevels: "Övade nivåer",
      needsWork: "Behöver övas",
      strongest: "Starkast",
      tries: "försök",
      accuracy: "träffsäkerhet",
      noAttemptsYet: "Inga försök än",
      noAttemptsHint: "Övning fyller i detta."
    },
    categories: {
      numberReading: { title: "Talläsning", short: "Läs" },
      numberValue: { title: "Talvärde", short: "Värde" },
      dates: { title: "Datum", short: "Datum" },
      calendarWords: { title: "Kalenderord", short: "Kal" },
      counters: { title: "Räknare", short: "Räkn" }
    },
    counterLabels: {
      people: "personer",
      flat: "platta saker",
      long: "långa saker",
      small: "små saker",
      books: "böcker",
      times: "gånger"
    },
    calendar: {
      monthNames: {
        1: "januari",
        2: "februari",
        3: "mars",
        4: "april",
        5: "maj",
        6: "juni",
        7: "juli",
        8: "augusti",
        9: "september",
        10: "oktober",
        11: "november",
        12: "december"
      },
      weekdayNames: {
        0: "måndag",
        1: "tisdag",
        2: "onsdag",
        3: "torsdag",
        4: "fredag",
        5: "lördag",
        6: "söndag"
      },
      relative: {
        dayBeforeYesterday: "i förrgår",
        yesterday: "igår",
        today: "idag",
        tomorrow: "imorgon",
        dayAfterTomorrow: "i övermorgon"
      }
    },
    learnCards: {
      numberReading: {
        concept: "Japanska grupperar stora tal i tiotusental, så 10 000 är いちまん.",
        rules: "Lär dig de oregelbundna hundra- och tusentalen tidigt: さんびゃく, ろっぴゃく, はっぴゃく, さんぜん, はっせん.",
        example: "3 456 -> さんぜんよんひゃくごじゅうろく",
        format: "Skriv kana eller romaji. Mellanslag och bindestreck i romaji ignoreras."
      },
      numberValue: {
        concept: "Att läsa japanska tal tillbaka till arabiska siffror bygger snabb igenkänning.",
        rules: "Lyssna efter enhetsorden じゅう, ひゃく, せん och まん.",
        example: "にせんさんびゃく -> 2300",
        format: "Skriv arabiska siffror."
      },
      dates: {
        concept: "Månader är oftast tal + がつ, men april, juli och september har särskilda läsningar.",
        rules: "Många datumdagar är särskilda: ついたち, ふつか, みっか, よっか, とおか, はつか.",
        example: "4/1 -> しがつついたち",
        format: "Skriv kana eller romaji för läsningar; skriv M/D när datumvärdet efterfrågas."
      },
      calendarWords: {
        concept: "Kalenderord blandar månadsläsningar, veckodagskanji och några nyttiga relativa dagar.",
        rules: "Veckodagsordningen här är måndag = 1 till söndag = 7.",
        example: "onsdag -> 水曜日 / すいようび",
        format: "Skriv efterfrågat japanskt ord, tal eller offset."
      },
      counters: {
        concept: "Räknare ändrar uttalet av både talet och räknaren.",
        rules: "De oregelbundna läsningarna är själva poängen: ひとり, ふたり, いっぽん, さんぼん, ろっぽん, いっこ, はっこ.",
        example: "3 långa saker -> さんぼん",
        format: "Skriv kana eller romaji."
      }
    },
    settings: {
      title: "Inställningar",
      intro: "Sparas lokalt i den här webbläsaren.",
      adaptiveCategories: "Adaptiva kategorier",
      data: "Data",
      dataIntro: "Exportera, importera eller nollställ lokala framsteg.",
      progressJson: "Framsteg som JSON",
      export: "Exportera",
      copy: "Kopiera",
      import: "Importera",
      reset: "Nollställ"
    },
    learn: {
      title: "Lär",
      intro: "Korta påminnelser för varje japansk övningstyp.",
      concept: "Begrepp",
      rules: "Tumregel",
      example: "Exempel",
      format: "Svarsformat"
    },
    messages: {
      invalidJson: "Ogiltig JSON",
      resetConfirm: "Nollställ alla lokala framsteg?",
      correct: "Rätt",
      notQuite: "Inte riktigt",
      expected: "förväntat",
      time: "Tid"
    },
    prompts: {
      numberReading: {
        title: "Skriv talet på japanska.",
        note: "Skriv kana eller romaji.",
        explanation: "{n} är {answer}."
      },
      numberValue: {
        title: "Läs det japanska talet.",
        note: "Skriv arabiska siffror.",
        explanation: "{reading} är {n}."
      },
      monthReading: {
        title: "Skriv månadens läsning.",
        note: "Skriv kana eller romaji.",
        explanation: "{month}月 är {answer}."
      },
      dayReading: {
        title: "Skriv datumdagens läsning.",
        note: "Skriv kana eller romaji.",
        explanation: "{day}日 är {answer}."
      },
      dateReading: {
        title: "Skriv datumet på japanska.",
        note: "Skriv månadens och dagens läsning.",
        explanation: "{month}/{day} är {answer}."
      },
      dateValue: {
        title: "Tolka det japanska datumet.",
        note: "Skriv M/D.",
        explanation: "Datumet är {answer}."
      },
      monthNumber: {
        title: "Tolka den japanska månaden.",
        note: "Skriv månadsnumret.",
        explanation: "{reading} är månad {month}."
      },
      weekdayJapanese: {
        title: "Skriv veckodagen på japanska.",
        note: "Skriv kanji, kana eller romaji.",
        explanation: "{weekday} är {answer}."
      },
      weekdayNumber: {
        title: "Tolka den japanska veckodagen.",
        note: "Skriv 1 för måndag till 7 för söndag.",
        explanation: "{weekday} är veckodag {answer}."
      },
      relativeJapanese: {
        title: "Skriv den relativa dagen på japanska.",
        note: "Skriv kana eller romaji.",
        explanation: "{word} är {answer}."
      },
      relativeOffset: {
        title: "Tolka den relativa dagen.",
        note: "Skriv dagsoffset: igår är -1, idag är 0, imorgon är 1.",
        explanation: "{word} har offset {answer}."
      },
      counterReading: {
        title: "Skriv räknarfrasen.",
        note: "Skriv kana eller romaji.",
        explanation: "{count} {label} är {answer}."
      }
    }
  }
};
