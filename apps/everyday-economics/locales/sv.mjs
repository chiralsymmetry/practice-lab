export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    appTitle: "Vardagsekonomi",
    brandSubtitle: "Tillämpade matteövningar för priser, procent, ränta, inflation och enkel risk.",
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
      unitPrices: { title: "Jämförpris", short: "Enhet" },
      discounts: { title: "Rabatt och skatt", short: "Rabatt" },
      percentChange: { title: "Procentuell förändring", short: "% ändr" },
      interest: { title: "Ränta", short: "Ränta" },
      inflation: { title: "Inflation", short: "Infl" },
      subscriptions: { title: "Abonnemang", short: "Abonn" },
      expectedValue: { title: "Väntevärde", short: "VV" }
    },
    learnCards: {
      unitPrices: {
        concept: "Jämförpris gör erbjudanden med olika storlek jämförbara.",
        rules: "Dela totalpriset med mängden. Lägre pris per enhet är billigare per enhet.",
        example: "60,00 kr för 3 kg betyder 20,00 kr/kg.",
        format: "Vanligen ett värde avrundat till hundradelar."
      },
      discounts: {
        concept: "Rabatter minskar priset före skatt om frågan inte säger något annat.",
        rules: "p% rabatt betyder att du betalar 100-p procent av ursprungspriset.",
        example: "800 kr med 25% rabatt blir 600 kr före skatt.",
        format: "Pengar avrundade till hundradelar."
      },
      percentChange: {
        concept: "Procentuell förändring jämför förändringen med ursprungsvärdet.",
        rules: "(nytt - gammalt) / gammalt * 100.",
        example: "50 till 60 är en ökning med 20%.",
        format: "Procenttal; procenttecknet är valfritt."
      },
      interest: {
        concept: "Ränta får pengar att växa med en sats över tid.",
        rules: "Enkel ränta: P(1+rt). Ränta på ränta: P(1+r)^t för årlig kapitalisering.",
        example: "100 kr med 5% i 2 år växer med ränta på ränta till 110,25 kr.",
        format: "Pengar avrundade till hundradelar."
      },
      inflation: {
        concept: "Inflation ändrar köpkraft och nominella priser.",
        rules: "Använd satsen som en vanlig procentuell ökning, ofta upprepat över flera år.",
        example: "100 kr med 3% inflation blir 103 kr efter ett år.",
        format: "Pengar avrundade till hundradelar, eller procent när frågan ber om det."
      },
      subscriptions: {
        concept: "Återkommande kostnader är lättare att jämföra över samma tidsperiod.",
        rules: "Räkna om allt till det efterfrågade antalet månader och jämför totalerna.",
        example: "120 kr/månad i 12 månader är 1440 kr/år.",
        format: "Pengar avrundade till hundradelar."
      },
      expectedValue: {
        concept: "Väntevärde är det långsiktiga genomsnittliga utfallet från sannolikheter och utbetalningar.",
        rules: "Multiplicera varje utfall med dess sannolikhet och summera.",
        example: "25% chans till 200 kr har väntevärde 50 kr.",
        format: "Pengar avrundade till hundradelar."
      }
    },
    settings: {
      title: "Inställningar",
      intro: "Sparas lokalt i den här webbläsaren.",
      numberFormat: "Talformat",
      numberFormatAuto: "Auto",
      numberFormatPoint: "1.23",
      numberFormatComma: "1,23",
      currencyFormat: "Valuta",
      currencyFormatAuto: "Auto",
      currencyFormatUsd: "$",
      currencyFormatEur: "EUR",
      currencyFormatSek: "kr",
      currencyFormatGbp: "GBP",
      currencyFormatNone: "Ingen",
      unitSystem: "Enheter",
      unitSystemAuto: "Auto",
      unitSystemMetric: "Metriskt",
      unitSystemUs: "USA",
      adaptiveCategories: "Adaptiva kategorier",
      data: "Data",
      dataIntro: "Exportera, importera eller nollställ lokala framsteg.",
      progressJson: "Framsteg som JSON",
      export: "Exportera",
      copy: "Kopiera",
      import: "Importera",
      reset: "Nollställ"
    },
    calculator: {
      title: "Kalkylator",
      keypadAria: "Kalkylatorknappar",
      ready: "Redo",
      use: "Använd",
      delete: "Radera",
      clear: "Töm",
      error: "Kontrollera uttrycket"
    },
    learn: {
      title: "Lär",
      intro: "Korta påminnelser om den tillämpade matematiken bakom varje övning. Det här är räkneövningar, inte ekonomisk rådgivning.",
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
      unitPrices: {
        title: "Räkna ut jämförpriset.",
        body: "{price} för {quantity} {unit}\nVad är priset per {unit}?",
        note: "Skriv priset per enhet, avrundat till hundradelar.",
        explanation: "{price} / {quantity} = {answer} per {unit}."
      },
      discounts: {
        title: "Räkna ut slutpriset.",
        body: "Ursprungspris: {price}\nRabatt: {discount}\nSkatt efter rabatt: {tax}\nVad är slutpriset?",
        note: "Skriv pengar avrundade till hundradelar.",
        explanation: "Efter {discount} rabatt läggs {tax} skatt på. Slutpris: {answer}."
      },
      percentChange: {
        title: "Räkna ut den procentuella förändringen.",
        body: "Gammalt värde: {old}\nNytt värde: {newValue}\nVad är den procentuella förändringen?",
        note: "Skriv den procentuella förändringen; procenttecknet är valfritt.",
        explanation: "Förändringen är {change} från ursprungsvärdet {old}, alltså är förändringen {answer}."
      },
      interest: {
        title: "Räkna ut slutsaldot.",
        body: "Startbelopp: {principal}\nRänta: {rate} per år\nTid: {years} år\nRäntetyp: {kind}\nVad är slutsaldot?",
        note: "Skriv pengar avrundade till hundradelar.",
        kindSimple: "enkel",
        kindCompound: "årlig ränta på ränta",
        explanation: "{kind} ränta ger slutsaldot {answer}."
      },
      inflation: {
        title: "Justera för inflation.",
        body: "Dagens pris: {price}\nInflation: {rate} per år\nTid: {years} år\nVad är det framtida nominella priset?",
        note: "Skriv pengar avrundade till hundradelar.",
        explanation: "{rate} inflation i {years} år ger {answer}."
      },
      subscriptions: {
        title: "Jämför abonnemangskostnaden.",
        body: "Månadspris: {monthly}\nStartavgift: {setup}\nPeriod: {months} månader\nGratismånader: {freeMonths}\nVad är totalkostnaden?",
        note: "Skriv totalkostnaden över den efterfrågade perioden.",
        explanation: "Totalt över {months} månader blir {answer}."
      },
      expectedValue: {
        title: "Räkna ut väntevärdet.",
        body: "{probability} chans att få {payoff}\nSäker kostnad: {cost}\nVad är väntevärdet?",
        note: "Skriv pengar avrundade till hundradelar.",
        explanation: "{probability} * {payoff} minus den säkra kostnaden {cost} ger {answer}."
      }
    }
  }
};
