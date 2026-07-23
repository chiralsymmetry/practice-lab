export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    appTitle: "C++-kodläsning",
    brandSubtitle: "Spåra, bind, härled, lös upp och bedöm små C++-snuttar.",
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
      runtime: { title: "Körtillstånd och kontrollflöde", short: "Kör" },
      aliasing: { title: "Alias och parametrar", short: "Alias" },
      types: { title: "Typer och konverteringar", short: "Typ" },
      resolution: { title: "Overloads och templates", short: "Anrop" },
      lifetime: { title: "Livstid och ägarskap", short: "Liv" },
      declarations: { title: "Deklarationer och callables", short: "Dekl" }
    },
    learnCards: {
      runtime: {
        concept: "Körspårning handlar om tillståndsändringar och garanterat kontrollflöde, inte bara längre loopar.",
        rules: "Följ bara levande variabler och uppdatera dem i den ordning satserna faktiskt körs. Kortslutande operatorer hoppar över höger sida när vänster sida avgör resultatet.",
        example: "a++ ger det gamla värdet och muterar a; använd inte postfix-syntax för att gissa ordningen mellan orelaterade uttryck.",
        format: "Skriv ett värde, eller värden som a=3 b=5."
      },
      aliasing: {
        concept: "Aliasfrågor tränar modellen av namn, objekt, adresser, referenser och pekarvärden.",
        rules: "En referens förblir bunden till sitt ursprungliga objekt. En pekare kan pekas om. En pekarparameter som int* p skickas själv som värde.",
        example: "int& r = *p; p = &b; gör att r fortfarande är bunden till objektet den först namngav.",
        format: "Skriv efterfrågat värde eller värden, till exempel a=7 b=-2."
      },
      types: {
        concept: "C++-typläsning kombinerar deklarerad typ, uttryckstyp, initieringsform och implicita konverteringar.",
        rules: "Vanlig auto beter sig oftast som template-deduktion för värdeparameter: referenser och top-level const tas bort. Listinitiering avvisar narrowing.",
        example: "std::uint8_t x = 255; auto y = x + 1; ger y typen int och värdet 256.",
        format: "Skriv härledd typ, typ och värde, eller en bedömning som kompileringsfel."
      },
      resolution: {
        concept: "Ett anrop väljs från användbara kandidater, inte bara från funktionsnamnet.",
        rules: "Referensbindning, exakta träffar, konverteringar och template-deduktion påverkar vilken overload som vinner.",
        example: "En int-lvalue föredrar int&, en const int-lvalue föredrar const int&, och en literal kan binda till int&&.",
        format: "Skriv vald utdata, overloadsort eller deducerad templatetyp."
      },
      lifetime: {
        concept: "Livstidsfrågor handlar om huruvida handles fortfarande pekar på levande objekt och om ägarskap har ändrats.",
        rules: "Hängande pekare och invaliderade iteratorer är odefinierat beteende. std::move är bara en cast; flytten sker när en annan operation använder den.",
        example: "Efter auto q = std::move(p) är p tom och q äger objektet.",
        format: "Skriv väldefinierat, UB, kompileringsfel eller den synliga utdatan."
      },
      declarations: {
        concept: "Deklarationer och callables döljer ofta enkla operationer bakom tät C++-syntax.",
        rules: "Läs deklarationer utåt från identifieraren. Funktionspekare, medlemspekare, lambdor och overload-set lägger till var sitt bindningssteg.",
        example: "int* a[4] är en array med fyra pekare; int (*b)[4] är en pekare till en array med fyra int.",
        format: "Skriv valt namn eller den synliga utdatan."
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
      intro: "Korta påminnelser för att läsa vanliga, väldefinierade C++17-liknande snuttar. Livstids- och bedömningsövningar markerar undantag uttryckligen.",
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
      no: "nej",
      defined: "väldefinierat",
      undefinedBehavior: "odefinierat beteende",
      compileError: "kompileringsfel"
    },
    prompts: {
      runtimeValue: {
        title: "Spåra körtillståndet.",
        note: "Vad är slutvärdet för {variable}?",
        explanation: "När de körda satserna spåras blir svaret {answer}."
      },
      runtimePair: {
        title: "Spåra den beroende loopen.",
        note: "Vilka slutvärden har a och b?",
        explanation: "Slutvärdena är {answer}."
      },
      runtimeTriple: {
        title: "Spåra tidig return.",
        note: "Vilka slutvärden har a, b och r?",
        explanation: "Slutvärdena är {answer}."
      },
      aliasValue: {
        title: "Spåra aliaset.",
        note: "Vad är slutvärdet för {variable}?",
        explanation: "Slutvärdet är {answer}."
      },
      aliasPair: {
        title: "Spåra alias och parametrar.",
        note: "Vilka slutvärden har a och b?",
        explanation: "Referenser förblir bundna och pekarparametrar kopieras, så slutvärdena är {answer}."
      },
      types: {
        title: "Härled typen.",
        note: "Vilken typ har x?",
        explanation: "Svaret är {answer}."
      },
      typeAndValue: {
        title: "Härled typ och värde.",
        note: "Vilken typ och vilket värde har y?",
        explanation: "Integer promotion ger {answer}."
      },
      typeJudgement: {
        title: "Bedöm initieringen.",
        note: "Kompilerar detta? Skriv väldefinierat, UB eller kompileringsfel.",
        explanation: "Rätt bedömning är {answer}."
      },
      resolutionOutput: {
        title: "Lös upp anropet.",
        note: "Vad skrivs ut?",
        explanation: "Det valda anropet skriver {answer}."
      },
      resolutionType: {
        title: "Deducera templateargumentet.",
        note: "Vad är T?",
        explanation: "Template-deduktion ger T = {answer}."
      },
      lifetimeJudge: {
        title: "Bedöm livstid och giltighet.",
        note: "Skriv väldefinierat, UB eller kompileringsfel.",
        explanation: "Rätt bedömning är {answer}."
      },
      lifetimeOutput: {
        title: "Spåra ägarskap och utdata.",
        note: "Vad skrivs ut?",
        explanation: "Den synliga utdatan är {answer}."
      },
      declarations: {
        title: "Avkoda deklarationen.",
        note: "Vilket namn är arrayen med fyra pekare?",
        explanation: "Svaret är {answer}."
      },
      declarationsOutput: {
        title: "Spåra callable-objektet.",
        note: "Vad skrivs ut?",
        explanation: "Den synliga utdatan är {answer}."
      }
    }
  }
};
