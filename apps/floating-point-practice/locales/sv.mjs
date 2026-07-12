export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    appTitle: "Flyttalsövning",
    brandSubtitle: "Små flyttalsformat, IEEE-liknande fält, exakta bråk och flyttalens små egenheter.",
    summary: {
      aria: "Framstegssammanfattning",
      mastery: "Snittstyrka",
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
      pause: "Pausa",
      paused: "Pausat",
      learnThis: "Lär detta",
      category: "Kategori",
      level: "Nivå",
      mastery: "0% styrka",
      masterySuffix: "styrka",
      answer: "Svar",
      check: "Rätta",
      next: "Nästa",
      skip: "Hoppa över",
      keypadAria: "Svarsknappsats",
      delete: "Radera",
      clear: "Töm",
      pauseText: "Tidtagningen är stoppad för den här frågan.",
      resume: "Fortsätt",
      controlsAria: "Övningskontroller",
      masteryMetric: "Styrka",
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
      noAttemptsYet: "Inga försök ännu",
      noAttemptsHint: "Övning fyller i detta."
    },
    categories: {
      classify: { title: "Klassificera flyttal", short: "Klass" },
      decode: { title: "Avkoda värde", short: "Avkoda" },
      encode: { title: "Koda värde", short: "Koda" },
      spacing: { title: "Exponent och avstånd", short: "Avstånd" },
      exactness: { title: "Exakthet", short: "Exakt" },
      "will-change": { title: "Ändras värdet?", short: "Ändras" }
    },
    learnCards: {
      classify: {
        concept: "Exponentfältet avgör om värdet är normaliserat, subnormalt, noll, oändlighet eller NaN.",
        rules: "Exponent med bara ettor är oändlighet eller NaN. Exponent med bara nollor är noll eller subnormal. Tecknet påverkar värdet, inte klassens namn.",
        example: "FP4 0110 och 1110 är båda infinity; FP4 0001 och 1001 är båda subnormal.",
        format: "Skriv normal, subnormal, zero, infinity eller nan."
      },
      decode: {
        concept: "Små format gör flyttalsvärden tydliga nog att avkoda exakt.",
        rules: "Normaliserade värden har en implicit inledande etta. Subnormaler har inte det.",
        example: "FP4 0001 = 1/2; FP4 0010 = 1; FP6 kan också visa värden som 3/2.",
        format: "Skriv ett exakt heltal eller bråk. Decimalform och blandad form som 1.5 eller 1 1/2 accepteras när de är exakta."
      },
      encode: {
        concept: "Kodning är avkodning baklänges: välj tecken, biasad exponent och fraktionsbitar.",
        rules: "De genererade värdena är representerbara i det visade formatet. NaN använder ett representativt NaN-mönster.",
        example: "I FP4 kodas värdet 1 som 0010 och -0 som 1000.",
        format: "Skriv hela bitmönstret. Hex accepteras för FP16 och FP32."
      },
      spacing: {
        concept: "Inom ett intervall mellan två potenser av två har närliggande flyttal jämnt avstånd.",
        rules: "För normaliserade värden nära 2^e är avståndet 2^(e - (precisionsbitar - 1)).",
        example: "FP32 nära 2^20 har avståndet 2^(20 - 23) = 1/8.",
        format: "Skriv en obiasad exponent eller ett exakt avstånd, till exempel 1/8."
      },
      exactness: {
        concept: "Binära flyttal kan bara representera bråk exakt när den förkortade nämnaren är en tvåpotens.",
        rules: "Heltal är exakta så länge precisionen räcker och värdet ligger inom formatets område.",
        example: "0.5 och 3/8 är exakta; 0.1 är inte exakt. FP32 representerar 16777216 exakt men inte 16777217.",
        format: "Skriv ja eller nej."
      },
      "will-change": {
        concept: "Att addera ett litet tal till ett stort flyttal kanske inte ändrar det lagrade värdet.",
        rules: "Om ökningen är mindre än halva det lokala avståndet avrundar round-to-nearest tillbaka till det gamla värdet.",
        example: "För FP32 nära 1000000 är avståndet 1/16, så +0.01 ändrar inte värdet.",
        format: "Skriv ja eller nej."
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
      intro: "Kompakta påminnelser för övningar om flyttalsrepresentation.",
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
    answers: {
      yes: "ja",
      no: "nej"
    },
    prompts: {
      common: {
        formatSpec: "tecken {signBits}, exponent {expBits}, fraktion {fracBits}, bias {bias}, precision {precisionBits}",
        bits: "Bitar: {bits}",
        value: "Värde: {value}",
        exponentField: "Exponentfält: {exponent}",
        nearPower: "Nära 2^{power}",
        addition: "{x} + {y}"
      },
      classify: {
        title: "Klassificera detta flyttalsmönster.",
        note: "Skriv normal, subnormal, zero, infinity eller nan.",
        explanation: "Exponent {exponent} och fraktion {fraction} klassificerar det som {kind}.{signNote}",
        negativeFiniteSignNote: "Teckenbit 1 gör värdet negativt, men klassen avgörs fortfarande av exponent och fraktion.",
        signedSpecialSignNote: "Teckenbit 1 påverkar det signerade värdet, men klassnamnet är detsamma."
      },
      decode: {
        title: "Avkoda detta flyttalsvärde.",
        note: "Skriv det exakta värdet som heltal, bråk, decimalform eller blandad form.",
        explanation: "Mönstret är ett {kind}-värde lika med {value}."
      },
      encode: {
        title: "Koda detta flyttalsvärde.",
        note: "Skriv hela bitmönstret.",
        explanation: "{value} kodas som {bits}."
      },
      bias: {
        title: "Ta bort exponentens bias.",
        note: "Skriv den obiasade exponenten som signed decimal.",
        explanation: "Lagrad exponent {exponent} minus bias {bias} ger {unbiased}."
      },
      spacing: {
        title: "Hitta avståndet nära den här storleken.",
        note: "Skriv exakt ULP-avstånd.",
        explanation: "{format} har {precision} precisionsbitar, så avståndet nära 2^{power} är {spacing}."
      },
      exactness: {
        title: "Kan värdet representeras exakt?",
        note: "Skriv ja eller nej.",
        explanation: "I {format} är {value}: {result}."
      },
      willChange: {
        title: "Ändras det lagrade värdet?",
        note: "Anta round-to-nearest. Skriv ja eller nej.",
        explanation: "Nära {x} är avståndet i {format} {spacing}; att addera {y} {result}."
      }
    }
  }
};
