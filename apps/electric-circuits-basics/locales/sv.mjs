export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    appTitle: "Grunder i elektriska kretsar",
    brandSubtitle: "Genererade DC-övningar för Ohms lag, effekt, resistorer, spänningsdelare och LED.",
    summary: {
      aria: "Sammanfattning av framsteg",
      mastery: "Snittstyrka",
      accuracy: "Träffsäkerhet",
      attempts: "Försök"
    },
    nav: {
      aria: "Huvudnavigation",
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
      paused: "Pausad",
      learnThis: "Lär detta",
      category: "Kategori",
      level: "Nivå",
      mastery: "0% styrka",
      masterySuffix: "styrka",
      answer: "Svar",
      check: "Kontrollera",
      next: "Nästa",
      skip: "Hoppa över",
      keypadAria: "Svarsknappar",
      delete: "Radera",
      clear: "Rensa",
      pauseText: "Timern är stoppad för den här frågan.",
      resume: "Fortsätt",
      controlsAria: "Övningskontroller",
      masteryMetric: "Styrka",
      accuracyMetric: "Träffsäkerhet",
      streak: "Rad",
      avgTime: "Snittid",
      schematicAria: "Kretsschema"
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
      ohmsLaw: { title: "Ohms lag", short: "Ohm" },
      power: { title: "Effekt", short: "Effekt" },
      seriesResistance: { title: "Serieresistans", short: "Serie" },
      parallelResistance: { title: "Parallellresistans", short: "Parall" },
      voltageDivider: { title: "Spänningsdelare", short: "Delare" },
      ledResistor: { title: "LED-resistor", short: "LED" }
    },
    learnCards: {
      ohmsLaw: {
        concept: "Spänning, ström och resistans hänger ihop i en ideal resistor.",
        rules: "V = I * R. Skriv om till I = V / R eller R = V / I.",
        example: "20 mA genom 220 Ω ger ett spänningsfall på 4,4 V.",
        format: "Ange den efterfrågade enheten. Enheter är frivilliga; kompatibla enheter som A och mA accepteras."
      },
      power: {
        concept: "Effekt är hur snabbt en komponent omsätter energi.",
        rules: "P = V * I. Med Ohms lag blir det också P = I^2R eller P = V^2/R.",
        example: "5 V vid 20 mA är 0,1 W, eller 100 mW.",
        format: "Ange watt eller milliwatt enligt frågan."
      },
      seriesResistance: {
        concept: "Seriekopplade resistorer delar samma strömväg.",
        rules: "Addera resistanserna: Rtotal = R1 + R2 + ...",
        example: "220 Ω + 330 Ω = 550 Ω.",
        format: "Ange ohm. kΩ accepteras när värdet är ekvivalent."
      },
      parallelResistance: {
        concept: "Parallellkopplade resistorer ger flera strömvägar.",
        rules: "För två resistorer: Rtotal = R1*R2/(R1+R2). Totalen är alltid lägre än den minsta grenen.",
        example: "Två resistorer på 1 kΩ parallellt blir 500 Ω.",
        format: "Ange ohm, oftast avrundat till hundradelar."
      },
      voltageDivider: {
        concept: "En tvåresistorsdelare tar ut en andel av inspänningen.",
        rules: "Vout = Vin * R2 / (R1 + R2) när Vout mäts över R2.",
        example: "5 V med lika stora resistorer ger 2,5 V i mittpunkten.",
        format: "Ange volt, oftast avrundat till tusendelar."
      },
      ledResistor: {
        concept: "En LED-serieresistor tar spänningsfallet som lysdioden inte använder.",
        rules: "R = (Vsupply - Vforward) / I. Strömmen ska vara i ampere i formeln.",
        example: "5 V matning, 2 V LED och 20 mA ger 150 Ω.",
        format: "Ange ohm, oftast avrundat till tiondelar."
      }
    },
    settings: {
      title: "Inställningar",
      intro: "Sparas lokalt i den här webbläsaren.",
      numberFormat: "Talformat",
      numberFormatAuto: "Auto",
      numberFormatPoint: "1.23",
      numberFormatComma: "1,23",
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
      title: "Miniräknare",
      keypadAria: "Miniräknarknappar",
      ready: "Redo",
      use: "Använd",
      delete: "Radera",
      clear: "Rensa",
      error: "Kontrollera uttrycket"
    },
    learn: {
      title: "Lär",
      intro: "Korta påminnelser för idealiserade DC-övningar. De här övningarna ignorerar tolerans, värme, parasiter och säkerhetsgränser om frågan inte uttryckligen nämner dem.",
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
      ohmsLaw: {
        title: "Lös det saknade värdet med Ohms lag.",
        body: "Spänning: {voltage}\nStröm: {current}\nResistans: {resistance}\nVilket är det saknade värdet i {target}?",
        note: "Ange det efterfrågade värdet; kompatibla enheter accepteras.",
        explanation: "Med V = I * R får vi {answer}."
      },
      power: {
        title: "Beräkna den omsatta effekten.",
        body: "Spänning: {voltage}\nStröm: {current}\nResistans: {resistance}\nVad är effekten i {target}?",
        note: "Ange effekt i den efterfrågade enheten.",
        explanation: "P = V * I, så effekten är {answer}."
      },
      seriesResistance: {
        title: "Kombinera serieresistorer.",
        body: "R1 = {r1}\nR2 = {r2}\nVad är total resistans?",
        note: "Ange resistans i ohm.",
        explanation: "Serieresistorer adderas direkt: {answer}."
      },
      seriesResistanceThree: {
        title: "Kombinera serieresistorer.",
        body: "R1 = {r1}\nR2 = {r2}\nR3 = {r3}\nVad är total resistans?",
        note: "Ange resistans i ohm.",
        explanation: "Serieresistorer adderas direkt: {answer}."
      },
      parallelResistance: {
        title: "Kombinera parallellresistorer.",
        body: "R1 = {r1}\nR2 = {r2}\nVad är ekvivalent resistans?",
        note: "Ange resistans i ohm, avrundat till hundradelar.",
        explanation: "För två parallella resistorer är R = R1*R2/(R1+R2), vilket ger {answer}."
      },
      voltageDivider: {
        title: "Beräkna delningsspänningen.",
        body: "Vin = {vin}\nR1 = {r1}\nR2 = {r2}\nVout mäts över R2.\nVad är Vout?",
        note: "Ange volt, avrundat till tusendelar.",
        explanation: "Vout = Vin * R2 / (R1 + R2), så Vout är {answer}."
      },
      ledResistor: {
        title: "Välj LED-serieresistor.",
        body: "Matningsspänning: {supply}\nLED framspänning: {forward}\nMålström: {current}\nVilken serieresistans behövs?",
        note: "Ange resistans i ohm, avrundat till tiondelar.",
        explanation: "Resistorn tar matningen minus LED-spänningen. R = (Vs - Vf) / I = {answer}."
      }
    }
  }
};
