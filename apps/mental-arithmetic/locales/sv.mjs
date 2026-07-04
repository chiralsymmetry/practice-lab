export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    appTitle: "Huvudrakning",
    brandSubtitle: "Snabba heltalsövningar för vardaglig huvudräkning.",
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
      addition: { title: "Addition", short: "Add" },
      subtraction: { title: "Subtraktion", short: "Sub" },
      multiplication: { title: "Multiplikation", short: "Mul" },
      division: { title: "Division", short: "Div" },
      complements: { title: "Komplement", short: "Komp" },
      percentages: { title: "Procent", short: "Proc" }
    },
    learnCards: {
      addition: {
        concept: "Snabb addition bygger ofta på att dela upp ett tal i vänliga delar.",
        rules: "Gå via 10, 100 eller 1000 när det minskar bäringen.",
        example: "68 + 47 = 68 + 32 + 15 = 115",
        format: "Skriv heltalssvaret."
      },
      subtraction: {
        concept: "Subtraktion blir lättare när du räknar avstånd eller kompenserar båda talen.",
        rules: "Om du lägger till samma tal på båda sidor är differensen oförändrad.",
        example: "103 - 78 = 105 - 80 = 25",
        format: "Skriv heltalssvaret."
      },
      multiplication: {
        concept: "Använd närliggande runda tal, dubblering, halvering och små tabellkunskaper.",
        rules: "Fördela: a * (b + c) = a*b + a*c.",
        example: "24 * 16 = 24 * (8 * 2) = 384",
        format: "Skriv heltalsprodukten."
      },
      division: {
        concept: "De här övningarna använder exakt division, så svaret är en heltalskvot.",
        rules: "Tänk på division som att hitta den saknade faktorn.",
        example: "144 / 12 = 12 eftersom 12 * 12 = 144",
        format: "Skriv heltalskvoten."
      },
      complements: {
        concept: "Komplement bygger taluppfattning för att snabbt nå runda totalsummor.",
        rules: "Hitta vad som saknas för att nå 10, 100, 1000 eller ett annat mål.",
        example: "73 behöver 27 för att nå 100",
        format: "Skriv det saknade talet."
      },
      percentages: {
        concept: "Många procenttal är bråk med vänligare huvudräkningsformer.",
        rules: "10% är dela med 10, 5% är hälften av 10%, och 25% är en fjärdedel.",
        example: "15% av 80 = 10% av 80 + 5% av 80 = 12",
        format: "Skriv heltalssvaret."
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
      intro: "Korta påminnelser om huvudräkningsstrategierna bakom varje övning.",
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
      addition: {
        title: "Addera talen.",
        note: "Skriv summan.",
        explanation: "{a} + {b} = {answer}."
      },
      subtraction: {
        title: "Subtrahera talen.",
        note: "Skriv differensen.",
        explanation: "{a} - {b} = {answer}."
      },
      multiplication: {
        title: "Multiplicera talen.",
        note: "Skriv produkten.",
        explanation: "{a} * {b} = {answer}."
      },
      division: {
        title: "Dividera talen.",
        note: "Skriv den exakta heltalskvoten.",
        explanation: "{dividend} / {divisor} = {answer}."
      },
      complements: {
        title: "Hitta komplementet.",
        note: "Skriv det saknade talet.",
        explanation: "{value} + {answer} = {target}."
      },
      percentages: {
        title: "Beräkna procenttalet.",
        note: "Skriv heltalssvaret.",
        explanation: "{percent}% av {base} = {answer}."
      }
    }
  }
};
