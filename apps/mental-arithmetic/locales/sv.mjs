export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    localeCode: "sv",
    locale: "sv-SE",
    appTitle: "Huvudräkning",
    brandSubtitle: "Bygg snabba och flexibla huvudräkningsstrategier utan skriftliga algoritmer.",
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
      family: "Frågetyp",
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
      title: "Färdighetsmatris",
      intro: "Varje cell öppnar en strategifamilj på en nivå som stöds."
    },
    stats: {
      title: "Statistik",
      intro: "Ny nivå följs per familj och strategi; migrerade kategorisummor finns kvar i totalhistoriken.",
      totalAttempts: "Totalt antal försök",
      totalCorrect: "Totalt rätt",
      totalTime: "Total tid",
      practicedLevels: "Övade nivåer",
      needsWork: "Behöver övas",
      strongest: "Starkast",
      tries: "försök",
      noAttemptsYet: "Inga familjeförsök än"
    },
    categories: {
      addition: { title: "Addition" },
      subtraction: { title: "Subtraktion" },
      multiplication: { title: "Multiplikation" },
      division: { title: "Division" },
      complements: { title: "Komplement" },
      percentages: { title: "Procent" }
    },
    families: {
      add_place_values: {
        subcategory: "Addition med två termer",
        title: "Positionsaddition",
        strategy: "uppdelning efter platsvärde",
        rules: "Dela upp den mindre lätthanterliga termen i delar efter platsvärde.",
        example: "346 + 278 = 346 + 200 + 70 + 8 = 624"
      },
      add_missing_addend: {
        subcategory: "Addition med två termer",
        title: "Saknad term",
        strategy: "omvänd addition",
        rules: "Använd subtraktion eller räkna uppåt från den synliga termen.",
        example: "47 + ? = 83; 47 + 36 = 83"
      },
      add_bridge_landmark: {
        subcategory: "Bryggning och kompensation",
        title: "Brygga via ett riktmärke",
        strategy: "brygga via ett runt riktmärke",
        rules: "Dela upp en term så att du först når ett jämnt tiotal, hundratal eller tusental.",
        example: "68 + 47 = 68 + 32 + 15 = 115"
      },
      add_compensate_round: {
        subcategory: "Bryggning och kompensation",
        title: "Kompenserad addition",
        strategy: "avrunda och kompensera",
        rules: "Ersätt en nästan rund term och återställ sedan den lilla förändringen.",
        example: "398 + 27 = 400 + 25 = 425"
      },
      add_compatible_group: {
        subcategory: "Gruppering av flera termer",
        title: "Kompatibel gruppering",
        strategy: "ordna om och gruppera",
        rules: "Para ihop termer som ger runda summor innan du lägger till resten.",
        example: "240 + 360 + 60 = 240 + 420 = 660"
      },
      subtract_place_values: {
        subcategory: "Uppdelning",
        title: "Positionssubtraktion",
        strategy: "uppdelad subtraktion",
        rules: "Subtrahera lätthanterliga delar utan att ändra operandernas ordning.",
        example: "624 − 278 = 624 − 200 − 70 − 8 = 346"
      },
      subtract_equal_compensation: {
        subcategory: "Kompensation",
        title: "Likformig kompensation",
        strategy: "likformig kompensation",
        rules: "Differensen bevaras om du lägger till samma belopp till båda operanderna.",
        example: "503 − 198 = 505 − 200 = 305"
      },
      subtract_count_up: {
        subcategory: "Uppräkning",
        title: "Räkna upp en differens",
        strategy: "räkna upp via riktmärken",
        rules: "När talen ligger nära varandra kan du räkna uppåt från det mindre till det större.",
        example: "487 → 500 är 13; 500 → 532 är 32; totalt 45"
      },
      subtract_missing_term: {
        subcategory: "Saknade termer",
        title: "Saknad term i subtraktion",
        strategy: "omvänd subtraktion",
        rules: "Ta hänsyn till vilken sida som saknas; subtraktion är inte kommutativ.",
        example: "? − 28 = 45 ger 73; 73 − ? = 45 ger 28"
      },
      multiplication_fact: {
        subcategory: "Grundfakta",
        title: "Multiplikationstabeller",
        strategy: "direkt och omvänd tabellkunskap",
        rules: "Träna tabellerna till och med 12 × 12 i båda operandordningarna.",
        example: "8 × 7 = 56; 56 ÷ 8 = 7"
      },
      multiply_distribute: {
        subcategory: "Distributivitet",
        title: "Distributiv multiplikation",
        strategy: "distribuera kring ett riktmärke",
        rules: "Dela upp en faktor i en rund del och en liten korrigering.",
        example: "23 × 19 = 23 × 20 − 23 = 437"
      },
      multiply_near_square: {
        subcategory: "Distributivitet",
        title: "Produkter nära kvadrater",
        strategy: "kvadratskillnad",
        rules: "Använd (c−d)(c+d) = c²−d².",
        example: "18 × 22 = 20² − 2² = 396"
      },
      multiply_double_half: {
        subcategory: "Dubblering och halvering",
        title: "Dubblera och halvera",
        strategy: "produktbevarande dubblering och halvering",
        rules: "Halvera den ena faktorn och dubblera den andra; produkten förblir densamma.",
        example: "16 × 25 = 8 × 50 = 4 × 100 = 400"
      },
      multiply_landmark: {
        subcategory: "Riktmärkesmultiplikatorer",
        title: "Riktmärkesmultiplikatorer",
        strategy: "riktmärkesmultiplikator",
        rules: "Använd närliggande tiotal eller hundratal, eller exakt halvering och fjärdedelning.",
        example: "48 × 25 = 48 × 100 ÷ 4 = 1 200"
      },
      divide_exact_quotient: {
        subcategory: "Exakta kvoter",
        title: "Exakt kvot",
        strategy: "saknad multiplikationsfaktor",
        rules: "Skriv om en exakt division som divisor × ? = dividend.",
        example: "756 ÷ 12 frågar efter 12 × ? = 756"
      },
      divide_factorized: {
        subcategory: "Faktoromvandlingar",
        title: "Faktoriserad division",
        strategy: "dividera med faktorer",
        rules: "Faktorisera divisorn och dividera i två eller tre exakta steg.",
        example: "1 800 ÷ 45 = ÷5 och sedan ÷9 = 40"
      },
      divide_scale_both: {
        subcategory: "Skalningsomvandlingar",
        title: "Skala båda termerna",
        strategy: "skala dividend och divisor lika",
        rules: "Multiplicera eller dividera båda termerna med samma faktor för att få en lätthanterlig divisor.",
        example: "375 ÷ 25 = 1 500 ÷ 100 = 15"
      },
      division_missing_term: {
        subcategory: "Saknade termer",
        title: "Saknad term i division",
        strategy: "omvänd division",
        rules: "Använd dividend = divisor × kvot.",
        example: "? ÷ 8 = 7 ger 56; 56 ÷ ? = 7 ger 8"
      },
      complement_to_landmark: {
        subcategory: "Angivet riktmärke",
        title: "Komplement till ett riktmärke",
        strategy: "komplement till angivet mål",
        rules: "Räkna uppåt till målet som anges i ekvationen.",
        example: "637 + ? = 1 000 ger 363"
      },
      complement_next_multiple: {
        subcategory: "Nästa multipel",
        title: "Komplement till nästa multipel",
        strategy: "strikt nästa multipel",
        rules: "Nästa multipel är strikt större; från en exakt multipel krävs ett helt steg.",
        example: "Från 200 till nästa multipel av 100 behövs 100, inte 0"
      },
      complement_two_stage: {
        subcategory: "Uppdelade vägar",
        title: "Komplement i två steg",
        strategy: "räkna upp i etapper",
        rules: "Hoppa till ett mellanliggande runt tal och sedan till slutmålet.",
        example: "684 → 700 är 16; 700 → 1 000 är 300; totalt 316"
      },
      percentage_benchmark: {
        subcategory: "Referensprocent",
        title: "Referensprocent",
        strategy: "referensbråk",
        rules: "Använd 50 % = hälften, 25 % = en fjärdedel, 20 % = en femtedel, 10 % = en tiondel, 5 % = en tjugondel och 1 % = en hundradel.",
        example: "25 % av 360 = 360 ÷ 4 = 90"
      },
      percentage_composite: {
        subcategory: "Sammansatta procenttal",
        title: "Sammansatt procenttal",
        strategy: "addera eller subtrahera referensdelar",
        rules: "Beräkna varje del från det ursprungliga grundvärdet och kombinera dem sedan.",
        example: "15 % av 240 = 10 % + 5 % = 24 + 12 = 36"
      },
      percentage_swap_or_scale: {
        subcategory: "Skalning och kommutativitet",
        title: "Byt eller skala procent",
        strategy: "byt p % av b mot b % av p",
        rules: "p % av b är lika med b % av p; använd den lätthanterligare riktningen.",
        example: "18 % av 50 = 50 % av 18 = 9"
      },
      percentage_missing_base: {
        subcategory: "Omvänd procentberäkning",
        title: "Saknat grundvärde",
        strategy: "återskapa helheten",
        rules: "Använd den omvända operationen för samma referensprocent.",
        example: "25 % av ? = 45; helheten är 45 × 4 = 180"
      },
      percentage_missing_percent: {
        subcategory: "Omvänd procentberäkning",
        title: "Saknad procentsats",
        strategy: "återskapa heltalsprocenten",
        rules: "Beräkna det exakta förhållandet mellan delen och helheten och multiplicera med 100.",
        example: "45 är hur många procent av 180? 25"
      }
    },
    generatedReplacements: [
      ["Build it from benchmark percentages of the original base.", "Bygg upp den från referensprocent av det ursprungliga grundvärdet."],
      ["A commutative percentage swap makes this friendlier.", "Ett kommutativt procentbyte gör beräkningen enklare."],
      ["If the value is already a multiple, move one full interval.", "Om talet redan är en multipel går du ett helt intervall vidare."],
      ["The factors are equally spaced around ", "Faktorerna ligger lika långt från "],
      ["Scale dividend and divisor by the same factor.", "Skala dividend och divisor med samma faktor."],
      ["Enter the integer only; omit the % sign.", "Skriv bara heltalet utan procenttecken."],
      ["A near-round addend offers a short route.", "En nästan rund term ger en kort beräkningsväg."],
      ["Choose the product-preserving transform.", "Välj den produktbevarande omvandlingen."],
      ["Subtraction is ordered; identify the missing role.", "Subtraktion har en bestämd ordning; identifiera den saknade rollen."],
      ["Use the corresponding multiplication fact.", "Använd motsvarande multiplikationsfakta."],
      ["Choose a useful intermediate landmark.", "Välj ett lämpligt mellanliggande riktmärke."],
      ["Build it from benchmark percentages", "Bygg upp den från referensprocent"],
      ["Choose a short benchmark decomposition.", "Välj en kort uppdelning i referensprocent."],
      ["A commutative percentage swap", "Ett kommutativt procentbyte"],
      ["Use inverse subtraction or count up.", "Använd omvänd subtraktion eller räkna uppåt."],
      ["Reorder and group compatible addends.", "Ordna om och gruppera kompatibla termer."],
      ["Scale dividend and divisor", "Skala dividend och divisor"],
      ["Split one addend by place value.", "Dela upp en term efter platsvärde."],
      ["Choose a short place-value route.", "Välj en kort väg via platsvärden."],
      ["Use: ", "Använd: "],
      ["Replace ", "Ersätt "],
      [" with ", " med "],
      [", then correct.", " och korrigera sedan."],
      ["Look for a round landmark.", "Sök efter ett runt riktmärke."],
      ["First bridge to ", "Brygga först till "],
      ["add back ", "lägg tillbaka "],
      ["subtract ", "subtrahera "],
      ["Subtract by place-value chunks.", "Subtrahera i delar efter platsvärde."],
      ["Keep the operand order.", "Behåll operandernas ordning."],
      ["Shift both operands by ", "Flytta båda operanderna med "],
      ["Look for equal compensation.", "Sök efter likformig kompensation."],
      ["These values are close; count upward.", "Talen ligger nära varandra; räkna uppåt."],
      ["Count up through ", "Räkna upp via "],
      ["Distribute around ", "Distribuera kring "],
      ["Choose a useful nearby landmark.", "Välj ett lämpligt närliggande riktmärke."],
      ["Look for a near-square pair.", "Sök efter ett par nära en kvadrat."],
      ["Halve one factor and double the other.", "Halvera den ena faktorn och dubblera den andra."],
      ["Choose a landmark route.", "Välj en väg via ett riktmärke."],
      ["Rewrite as ", "Skriv om som "],
      ["Factor ", "Faktorisera "],
      [" as ", " som "],
      [" on both: ", " på båda: "],
      ["Use dividend = divisor × quotient.", "Använd dividend = divisor × kvot."],
      ["Count up to the stated target.", "Räkna upp till det angivna målet."],
      [" → next multiple of ", " → nästa multipel av "],
      ["Choose a useful intermediate landmark.", "Välj ett lämpligt mellanliggande riktmärke."],
      ["Use the benchmark: ", "Använd referensen: "],
      ["scale from 1%", "skala från 1 %"],
      ["divide by ", "dividera med "],
      ["take three quarters", "ta tre fjärdedelar"],
      ["keep the whole", "behåll helheten"],
      ["Choose a short benchmark decomposition.", "Välj en kort uppdelning i referensprocent."],
      ["combine → ", "kombinera → "],
      ["Swap it to ", "Byt till "],
      ["Reverse the benchmark percentage.", "Vänd på referensprocenten."],
      [" is what integer percent of ", " är hur många heltalsprocent av "],
      ["% of ", " % av "],
      [" is ", " är "],
      ["then ", "sedan "],
      ["×10 plus half of ×10", "×10 plus hälften av ×10"],
      ["×10 minus one group", "×10 minus en grupp"],
      ["×10 plus one group", "×10 plus en grupp"],
      ["×100 minus one group", "×100 minus en grupp"],
      ["×100 plus one group", "×100 plus en grupp"],
      ["×100 then quarter", "×100, sedan en fjärdedel"],
      ["×100 then halve", "×100, sedan hälften"],
      ["×1000 then divide by 8", "×1000, sedan dividera med 8"],
      ["×3 then ×25", "×3, sedan ×25"],
      ["×10 then halve", "×10, sedan hälften"]
    ],
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
      reset: "Nollställ",
      resetConfirm: "Nollställ alla lokala framsteg?"
    },
    learn: {
      title: "Lär",
      intro: "Avsedd huvudräkningsstrategi och ett liknande exempel för varje frågetyp."
    },
    question: {
      compute: "Räkna i huvudet.",
      missing: "Hitta det saknade heltalet.",
      missingFactor: "Hitta den saknade faktorn.",
      complement: "Hitta komplementet.",
      nextMultiple: "Hur mycket behövs till nästa strikt större multipel?",
      missingPercent: "Hitta det saknade heltalsprocenttalet."
    },
    feedback: {
      correct: "Rätt",
      notQuite: "Inte riktigt",
      expected: "Förväntat",
      time: "Tid",
      integerOnly: "Skriv ett exakt heltal utan enhet eller uttryck.",
      lostCarry: "Resultatet saknar en tiotal-, hundratal- eller tusentalsövergång.",
      compensation: "Du avrundade rätt men återställde inte den lilla förändringen.",
      omittedAddend: "Summan saknar en term; markera varje term när du grupperar.",
      reversedSign: "Beloppet är rätt, men subtraktionen följer operandernas visade ordning.",
      equalCompensation: "Flytta båda operanderna lika mycket; annars ändras differensen.",
      addedFactors: "Svaret adderar faktorerna; multiplikation kräver en produktstrategi.",
      distribution: "Du hittade landmärkesprodukten men missade korrigeringen.",
      doubleHalf: "Halvera en faktor och dubblera den andra samtidigt.",
      incompleteFactorization: "Det är första divisionssteget; dividera även med den återstående faktorn.",
      strictNext: "”Nästa” är strikt större, så en exakt multipel kräver ett helt intervall.",
      fivePercent: "Division med 5 ger 20 %; 5 % är en tjugondel.",
      rateVsDifference: "Frågan gäller en andel, inte skillnaden mellan helhet och del.",
      route: "Använd den visade huvudräkningsvägen och håll varje delresultat exakt.",
      invalidJson: "Ogiltig JSON"
    }
  }
};
