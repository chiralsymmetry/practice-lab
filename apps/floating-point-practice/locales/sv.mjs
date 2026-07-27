export default {
  code: "sv",
  lang: "sv",
  suffix: ".sv",
  text: {
    localeCode: "sv",
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
      family: "Frågetyp",
      choose: "Välj…",
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
    families: {
      classify_pattern: {
        subcategory: "Klassificering",
        title: "Klassificera bitmönster",
        learn: "En exponent med bara nollor ger noll eller subnormal; en exponent med bara ettor ger oändlighet eller NaN."
      },
      extract_fields: {
        subcategory: "Fält",
        title: "Dela upp fälten",
        learn: "Dela upp tecken, lagrad exponent och efterföljande fraktionsbitar enligt de angivna fältbredderna."
      },
      special_sign: {
        subcategory: "Tecknade specialvärden",
        title: "Tecknad noll och oändlighet",
        learn: "Tecknet ändrar det tecknade värdet men inte värdeklassen."
      },
      decode_normal: {
        subcategory: "Avkoda normalvärde",
        title: "Avkoda ett normalvärde",
        learn: "Normalvärden använder (−1)^s(1+F/2^f)2^(E−bias)."
      },
      decode_subnormal: {
        subcategory: "Avkoda subnormal",
        title: "Avkoda en subnormal",
        learn: "Subnormaler saknar den implicita ettan och använder exponenten 1−bias."
      },
      decode_components: {
        subcategory: "Komponenter",
        title: "Avkoda komponenter",
        learn: "Håll isär lagrad exponent, effektiv exponent, signifikand och värde."
      },
      encode_exact_finite: {
        subcategory: "Exakt kodning",
        title: "Koda ett exakt ändligt värde",
        learn: "Normalisera det exakta värdet och lagra sedan endast de efterföljande fraktionsbitarna."
      },
      encode_special: {
        subcategory: "Koda specialvärde",
        title: "Koda ett specialvärde",
        learn: "Nollor har exponent och fraktion med bara nollor; oändligheter har exponent med bara ettor och fraktion noll."
      },
      round_to_format: {
        subcategory: "Närmaste jämna",
        title: "Avrunda till ett format",
        learn: "Jämför de exakta avstånden till grannvärdena; vid lika avstånd väljs en jämn bibehållen signifikand."
      },
      rounding_boundary_result: {
        subcategory: "Avrundning vid gräns",
        title: "Avrunda vid en gräns",
        learn: "Närmaste jämna gäller även vid gränserna noll/subnormal, subnormal/normal och ändligt/oändlighet."
      },
      remove_exponent_bias: {
        subcategory: "Exponentbias",
        title: "Ta bort eller lägg till bias",
        learn: "För normalvärden gäller e=E−bias och E=e+bias."
      },
      ulp_spacing: {
        subcategory: "Avstånd",
        title: "ULP-avstånd",
        learn: "Normalt avstånd nära 2^e är 2^(e−(p−1)); det subnormala avståndet är konstant."
      },
      adjacent_values: {
        subcategory: "Grannvärden",
        title: "Intilliggande värden",
        learn: "Gå till den exakta föregångaren eller efterföljaren med hänsyn till tecken och gränser."
      },
      format_extrema: {
        subcategory: "Värdeområde",
        title: "Formatets gränsvärden",
        learn: "Avläs exakta ändpunkter från fältmönstren vid gränserna."
      },
      rational_exactness: {
        subcategory: "Bråktal",
        title: "Exakthet för bråktal",
        learn: "En nämnare som är en tvåpotens är nödvändig, men precision och värdeområde måste också räcka."
      },
      integer_exactness: {
        subcategory: "Heltal",
        title: "Exakthet för heltal",
        learn: "Ovanför 2^p måste heltal ligga i linje med det lokala avståndet."
      },
      operation_exactness: {
        subcategory: "Operationer",
        title: "Exakthet för operationsresultat",
        learn: "Beräkna först det matematiska resultatet exakt och pröva sedan om det ligger på målformatets värdegitter."
      },
      addition_changes_value: {
        subcategory: "Absorption",
        title: "Ändrar additionen värdet?",
        learn: "Avrunda det exakta x+y; vid ett halvt ULP beror resultatet på den bibehållna signifikandens paritet."
      },
      rounded_addition_result: {
        subcategory: "Avrundad aritmetik",
        title: "Avrundat additionsresultat",
        learn: "Utför den exakta operationen och avrunda sedan en gång till det angivna formatet."
      },
      absorption_threshold: {
        subcategory: "Absorption",
        title: "Absorptionströskel",
        learn: "Pröva ökningarna i storleksordning; den första ändringen beror på halva avståndet och pariteten."
      },
      non_associativity: {
        subcategory: "Beräkningsordning",
        title: "Icke-associativitet",
        learn: "Avrunda efter varje uttryckligen parentesindelad operation."
      },
      special_arithmetic_result: {
        subcategory: "Specialresultat",
        title: "Resultat med specialvärden",
        learn: "Använd den angivna IEEE-liknande regeln för specialresultat i stället för vanlig algebra."
      }
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
    generatedReplacements: [
      ["Inspect exponent and fraction reserved patterns; sign does not determine the class.", "Granska exponentens och fraktionens reserverade mönster; tecknet avgör inte klassen."],
      ["Keep sign, biased exponent, hidden bit, and exact power-of-two scaling separate.", "Håll isär tecken, biasad exponent, implicit bit och exakt skalning med en tvåpotens."],
      ["Compare exact neighbors and apply nearest-even; a half-ULP tie depends on retained parity.", "Jämför de exakta grannvärdena och använd närmaste jämna; lika avstånd vid ett halvt ULP avgörs av den bibehållna pariteten."],
      ["Subnormals have no hidden one and use effective exponent 1−bias.", "Subnormaler saknar en implicit etta och använder den effektiva exponenten 1−bias."],
      ["Check reduced denominator, local spacing alignment, and range.", "Kontrollera den förkortade nämnaren, anpassningen till det lokala avståndet och värdeområdet."],
      ["Recheck the exact field relationship and target-format rounding.", "Kontrollera den exakta relationen mellan fälten och avrundningen till målformatet igen."],
      ["No exception flags or NaN payload details are in scope.", "Undantagsflaggor och detaljer om NaN-nyttolasten ingår inte."],
      ["Choose the smallest positive increment that changes the stored value.", "Välj den minsta positiva ökningen som ändrar det lagrade värdet."],
      ["Evaluate both explicitly parenthesized format operations.", "Beräkna båda de uttryckligen parentesindelade formatoperationerna."],
      ["Choose the signed special or enter the exact finite value.", "Välj det tecknade specialvärdet eller ange det exakta ändliga värdet."],
      ["Give an exact value; this is spacing at the stated magnitude, not a universal epsilon.", "Ange ett exakt värde; detta är avståndet vid den angivna storleken, inte ett universellt epsilon."],
      ["Enter an integer, reduced fraction, mixed number, or exact terminating decimal.", "Ange ett heltal, förkortat bråk, blandat tal eller exakt ändlig decimalutveckling."],
      ["Use nearest-even, including parity at a half-ULP tie.", "Använd närmaste jämna, inklusive pariteten vid lika avstånd på ett halvt ULP."],
      ["All-zero exponent: zero/subnormal; all-one exponent: infinity/NaN.", "Exponent med bara nollor: noll/subnormal; exponent med bara ettor: oändlighet/NaN."],
      ["A rounds its first sum, then gives ", "A avrundar sin första summa och ger sedan "],
      ["B rounds its inner sum, then gives ", "B avrundar sin inre summa och ger sedan "],
      ["The results differ because each intermediate is stored.", "Resultaten skiljer sig eftersom varje mellanresultat lagras."],
      ["Will the stored value change after this addition?", "Kommer det lagrade värdet att ändras efter additionen?"],
      ["Give the stored result of this format operation.", "Ange det lagrade resultatet av formatoperationen."],
      ["Determine the nearest-even boundary result.", "Bestäm gränsresultatet med avrundning till närmaste jämna."],
      ["Is the exact mathematical result representable?", "Kan det exakta matematiska resultatet representeras?"],
      ["Classify the explicitly modeled special result.", "Klassificera det uttryckligen modellerade specialresultatet."],
      ["Enter the adjacent finite value exactly.", "Ange det intilliggande ändliga värdet exakt."],
      ["Consider denominator, precision alignment, and range.", "Ta hänsyn till nämnare, precisionsanpassning och värdeområde."],
      ["Compute exactly, then round once to nearest-even.", "Beräkna exakt och avrunda sedan en gång till närmaste jämna."],
      ["Use the spacing in its binade, not only its size.", "Använd avståndet i dess binad, inte bara talets storlek."],
      ["Evaluate exactly before considering stored rounding.", "Beräkna exakt innan du tar hänsyn till lagrad avrundning."],
      ["Candidates are ordered by magnitude.", "Kandidaterna är ordnade efter storlek."],
      ["Round after each shown addition; no reassociation.", "Avrunda efter varje visad addition; ändra inte associationen."],
      ["Give each field as an unsigned integer.", "Ange varje fält som ett teckenlöst heltal."],
      ["Enter the complete pattern.", "Ange hela bitmönstret."],
      ["Give exact-width binary or hexadecimal.", "Ange binärt eller hexadecimalt med exakt bredd."],
      ["Give the complete bit pattern.", "Ange hela bitmönstret."],
      ["Give the resulting complete encoding.", "Ange den fullständiga resulterande kodningen."],
      ["Give the complete pattern.", "Ange hela bitmönstret."],
      ["Retain the exact field widths.", "Behåll fältens exakta bredder."],
      ["For a subnormal, report effective exponent 1−bias.", "För en subnormal ska den effektiva exponenten 1−bias anges."],
      ["Canonical NaN uses fraction 1 followed by zeros.", "Kanoniskt NaN använder fraktionen 1 följd av nollor."],
      ["The sign does not change the class.", "Tecknet ändrar inte klassen."],
      ["There is no hidden leading one.", "Det finns ingen implicit inledande etta."],
      ["Keep +0 and -0 distinct.", "Håll isär +0 och -0."],
      ["Use an exact fraction/integer.", "Använd ett exakt bråk eller heltal."],
      ["Give stored exponent as an unsigned integer.", "Ange den lagrade exponenten som ett teckenlöst heltal."],
      ["Give the signed unbiased exponent.", "Ange den tecknade obiasade exponenten."],
      ["Classify the patterns.", "Klassificera bitmönstren."],
      ["Classify the pattern.", "Klassificera bitmönstret."],
      ["Extract the stored fields.", "Dela upp de lagrade fälten."],
      ["Give the signed special value.", "Ange det tecknade specialvärdet."],
      ["Decode this normal value exactly.", "Avkoda normalvärdet exakt."],
      ["Decode this subnormal exactly.", "Avkoda subnormalen exakt."],
      ["Decode the named components.", "Avkoda de angivna komponenterna."],
      ["Encode this exactly representable finite value.", "Koda det exakt representerbara ändliga värdet."],
      ["Encode the stated special value.", "Koda det angivna specialvärdet."],
      ["Round the exact value to the format.", "Avrunda det exakta värdet till formatet."],
      ["Apply the exponent bias.", "Lägg till exponentens bias."],
      ["Remove the exponent bias.", "Ta bort exponentens bias."],
      ["Find the adjacent representable spacing.", "Bestäm avståndet mellan intilliggande representerbara värden."],
      ["Give the requested format endpoint.", "Ange formatets efterfrågade gränsvärde."],
      ["Is this rational exactly representable?", "Kan bråktalet representeras exakt?"],
      ["Is this integer exactly representable?", "Kan heltalet representeras exakt?"],
      ["select the boundary field pattern.", "välj fältmönstret vid gränsen."],
      ["step one representable value in numeric order.", "gå ett representerbart värde i numerisk ordning."],
      ["decode using the ", "avkoda med "],
      [" rule.", "-regeln."],
      ["Find the exact ", "Bestäm den exakta "],
      ["decode the starting pattern exactly.", "avkoda startmönstret exakt."],
      ["normalize magnitude and choose sign ", "normalisera absolutbeloppet och välj tecken "],
      ["choose sign bit from the stated sign.", "välj teckenbit från det angivna tecknet."],
      ["choose reserved exponent/fraction fields.", "välj de reserverade exponent- och fraktionsfälten."],
      ["Split sign | exponent | fraction.", "Dela upp tecken | exponent | fraktion."],
      ["Use the fraction to choose within the pair.", "Använd fraktionen för att välja inom paret."],
      ["Boundary widths: ", "Fältbredder: "],
      ["Reassembly gives ", "Återsammansättning ger "],
      ["Class: ", "Klass: "],
      ["Sign bit ", "Teckenbit "],
      [" gives ", " ger "],
      ["effective exponent = 1 − bias = ", "effektiv exponent = 1 − bias = "],
      ["effective exponent: ", "effektiv exponent: "],
      ["Unsigned significand", "Teckenlös signifikand"],
      ["Signed exact value", "Tecknat exakt värde"],
      ["Effective exponent", "Effektiv exponent"],
      ["significand = ", "signifikand = "],
      ["significand: ", "signifikand: "],
      ["signed product: ", "tecknad produkt: "],
      ["hidden one included", "implicit etta inkluderad"],
      ["stored exponent ", "lagrad exponent "],
      ["trailing fraction ", "efterföljande fraktion "],
      ["encoding: ", "kodning: "],
      ["neighbors: ", "grannvärden: "],
      ["equal distances; retained parity selects ", "lika avstånd; den bibehållna pariteten väljer "],
      ["the nearer neighbor is ", "det närmare grannvärdet är "],
      ["locate the ", "lokalisera gränsen för "],
      [" boundary.", "."],
      ["the value is exactly at its midpoint.", "värdet ligger exakt i mittpunkten."],
      ["nearest-even gives ", "närmaste jämna ger "],
      ["spacing = ", "avstånd = "],
      ["reduce the rational: ", "förkorta bråktalet: "],
      ["it lands on the format lattice.", "det ligger på formatets värdegitter."],
      ["it fails denominator, spacing alignment, or range.", "det uppfyller inte kraven på nämnare, avståndsanpassning eller värdeområde."],
      ["consecutive-integer threshold: ", "gräns för konsekutiva heltal: "],
      ["local lattice test for ", "lokalt gittertest för "],
      ["not aligned", "inte anpassat"],
      ["aligned", "anpassat"],
      ["mathematical result = ", "matematiskt resultat = "],
      ["format lattice test: ", "test mot formatets värdegitter: "],
      ["local spacing = ", "lokalt avstånd = "],
      ["exact sum = ", "exakt summa = "],
      ["rounded result = ", "avrundat resultat = "],
      ["does not change", "ändras inte"],
      ["no change", "ingen ändring"],
      ["changes", "ändras"],
      ["exact result = ", "exakt resultat = "],
      ["round once on the ", "avrunda en gång på "],
      [" lattice.", "-gittret."],
      ["stored result = ", "lagrat resultat = "],
      ["endpoint = ", "gränsvärde = "],
      ["finite overflow rounds to positive infinity", "ändligt spill avrundas till positiv oändlighet"],
      ["opposite infinities in addition are invalid", "motsatta oändligheter i en addition är ogiltiga"],
      ["zero divided by zero is invalid", "noll dividerat med noll är ogiltigt"],
      ["finite nonzero divided by infinity is signed zero", "ett ändligt värde skilt från noll dividerat med oändlighet ger tecknad noll"],
      ["largest finite + largest finite", "största ändliga + största ändliga"],
      ["Result A", "Resultat A"],
      ["Result B", "Resultat B"],
      ["Rounded encoding", "Avrundad kodning"],
      ["Rounded result", "Avrundat resultat"],
      ["Stored finite result", "Lagrat ändligt resultat"],
      ["First-changing increment", "Första ökning som ändrar"],
      ["Stored value changes?", "Ändras det lagrade värdet?"],
      ["Exact result representable?", "Kan det exakta resultatet representeras?"],
      ["Exactly representable?", "Exakt representerbart?"],
      ["Exact positive value: ", "Exakt positivt värde: "],
      ["Exact value: ", "Exakt värde: "],
      ["Exact value", "Exakt värde"],
      ["Exact endpoint", "Exakt gränsvärde"],
      ["Signed value", "Tecknat värde"],
      ["Stored exponent", "Lagrad exponent"],
      ["Unbiased exponent", "Obiasad exponent"],
      ["Desired unbiased exponent: ", "Önskad obiasad exponent: "],
      ["Pattern: ", "Bitmönster: "],
      ["Value: ", "Värde: "],
      ["Integer: ", "Heltal: "],
      ["Endpoint: ", "Gränsvärde: "],
      ["Boundary: ", "Gräns: "],
      ["Region: ", "Område: "],
      ["Starting value: ", "Startvärde: "],
      ["Base x = ", "Basvärde x = "],
      ["Candidates: ", "Kandidater: "],
      ["exact increment y = ", "exakt ökning y = "],
      ["operation: round(x+y)", "operation: avrunda(x+y)"],
      ["Operation: ", "Operation: "],
      ["Result", "Resultat"],
      ["Mode: nearest, ties to even", "Läge: närmaste, lika avstånd till jämnt"],
      ["Normal binade near ", "Normal binad nära "],
      ["ULP spacing", "ULP-avstånd"],
      ["Fraction field", "Fraktionsfält"],
      ["Encoding", "Kodning"],
      ["Sign", "Tecken"],
      ["Class ", "Klass "],
      ["Class", "Klass"],
      ["1 sign, ", "1 teckenbit, "],
      ["1 fraction bits; bias ", "1 fraktionsbit; bias "],
      [" exponent, ", " exponentbitar, "],
      [" fraction bits; bias ", " fraktionsbitar; bias "],
      ["; precision p=", "; precision p="],
      ["predecessor", "föregångare"],
      ["successor", "efterföljare"],
      ["smallest subnormal", "minsta subnormal"],
      ["smallest normal", "minsta normalvärde"],
      ["largest finite", "största ändliga värde"],
      ["normal exponent min", "minsta normalexponent"],
      ["normal exponent max", "största normalexponent"],
      ["subnormal", "subnormal"],
      ["infinity", "oändlighet"],
      ["overflow", "spill"],
      ["normal", "normalvärde"],
      ["canonical NaN", "kanoniskt NaN"],
      ["answer: ", "svar: "],
      ["result: ", "resultat: "],
      ["value = ", "värde = "],
      ["is correct. Recheck ", "är rätt. Kontrollera "],
      ["zero", "noll"],
      ["yes", "ja"],
      ["no", "nej"],
      ["exact", "exakt"],
      ["inexact", "inte exakt"],
      ["and", "och"]
    ],
    prompts: {
      common: {
        formatSpec: "tecken {signBits}, exponent {expBits}, fraktion {fracBits}, bias {bias}, precision {precisionBits}",
        bits: "Bitar: {bits}",
        value: "Värde: {value}",
        exponentField: "Exponentfält: {exponent}",
        nearPower: "Nära 2^{power}",
        addition: "Uttryck: {x} + {y}"
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
