export default {
  code: "sv",
  lang: "sv-SE",
  suffix: ".sv",
  text: {
    appTitle: "Programmeringsövning",
    brandSubtitle: "Bitar, talbaser, heltal med fast bredd, masker, skift och minnesordning.",
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
      learn: "Lär dig",
      settings: "Inställningar"
    },
    practice: {
      modeAria: "Övningsläge",
      adaptive: "Adaptiv",
      manual: "Manuell",
      pause: "Paus",
      paused: "Pausad",
      learnThis: "Lär dig detta",
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
      pauseText: "Timern är stoppad för den här frågan.",
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
      totalCorrect: "Totalt antal rätt",
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
      "powers": { title: "Tvåpotenser", short: "2^n" },
      "numeric-views": { title: "Signed och unsigned", short: "Vyer" },
      "base-bits": { title: "Bitar, hex och oktalt", short: "Baser" },
      "signed-add": { title: "Tvåkomplementsaddition", short: "S add" },
      "signed-sub": { title: "Tvåkomplementssubtraktion", short: "S sub" },
      "unsigned-add": { title: "Unsigned addition", short: "U add" },
      "unsigned-sub": { title: "Unsigned subtraktion", short: "U sub" },
      "bitwise": { title: "Binär aritmetik och bitoperatorer", short: "Op" },
      "shifts": { title: "Skift", short: "Skift" },
      "rotates": { title: "Rotationer", short: "Rot" },
      "endian": { title: "Endian-minnesordning", short: "Endian" },
      "masks": { title: "Masker och flaggor", short: "Masker" },
      "ranges": { title: "N-bitars intervall", short: "Intervall" },
      "extension": { title: "Utökning och trunkering", short: "Utök" }
    },
    learnCards: {
      "powers": {
        concept: "Tvåpotenser markerar bitpositioner och vanliga lagringsstorlekar.",
        rules: "2^n har en etta följd av n nollbitar.",
        example: "2^8 = 256\n1024 = 2^10",
        format: "Decimaltal, eller exponenten n när den efterfrågas."
      },
      "numeric-views": {
        concept: "Samma bitar med fast bredd kan läsas som unsigned eller signed tvåkomplement.",
        rules: "Unsigned är 0..2^n-1. Signed använder toppbiten som negativ vikt -2^(n-1).",
        example: "8-bit 11111111\nunsigned 255\nsigned -1",
        format: "Decimalt värde eller exakt n-bitarsmönster."
      },
      "base-bits": {
        concept: "Binärt grupperas naturligt i hexadecimala nibbles och oktala tripplar.",
        rules: "1 hexsiffra = 4 bitar. 1 oktal siffra = 3 bitar.",
        example: "1010 1111 = 0xAF\n111 101 = 0o75",
        format: "Bitar, 0x-hex eller 0o-oktalt; mellanrum accepteras."
      },
      "signed-add": {
        concept: "Tvåkomplementsaddition wrappar till den fasta bredden; overflow säger att det exakta signed-resultatet inte fick plats.",
        rules: "Overflow: två positiva tal ger ett negativt. Underflow: två negativa tal ger ett positivt.",
        example: "4-bit signed: 0111 + 0001 = 1000 +\nExakt 8 är över signed max 7.",
        format: "Resultatbitar plus status: + overflow, - underflow, 0 none."
      },
      "signed-sub": {
        concept: "Tvåkomplementssubtraktion wrappar också; jämför det exakta svaret med signed-intervallet.",
        rules: "För n bitar är signed-intervallet -2^(n-1)..2^(n-1)-1.",
        example: "4-bit signed: 1000 - 0001 = 0111 -\nExakt -9 är under signed min -8.",
        format: "Resultatbitar plus status: + overflow, - underflow, 0 none."
      },
      "unsigned-add": {
        concept: "Unsigned addition wrappar modulo 2^n.",
        rules: "Overflow betyder att det exakta resultatet är över 2^n-1.",
        example: "4-bit unsigned: 1111 + 0001 = 0000 +",
        format: "Resultatbitar plus status: + overflow, 0 none."
      },
      "unsigned-sub": {
        concept: "Unsigned subtraktion wrappar modulo 2^n när subtraktionen går under noll.",
        rules: "Underflow betyder att vänster operand är mindre än höger operand.",
        example: "4-bit unsigned: 0000 - 0001 = 1111 -",
        format: "Resultatbitar plus status: - underflow, 0 none."
      },
      "bitwise": {
        concept: "Bitoperatorer arbetar oberoende på varje bit.",
        rules: "& behåller gemensamma ettor, | behåller någon etta, ^ behåller olika bitar, ~ inverterar bitar.",
        example: "1010 & 1100 = 1000\n1010 ^ 1100 = 0110",
        format: "Exakta resultatbitar med fast bredd."
      },
      "shifts": {
        concept: "Skift flyttar bitar, fyller tomma positioner och kastar bort bitar som skiftas ut.",
        rules: "Vänsterskift och logiskt högerskift fyller med 0. Aritmetiskt högerskift fyller med teckenbiten. Carry-out är den sista biten som skiftades ut.",
        example: "1011 >>> 1 = 0101 carry 1\n1011 >> 1 = 1101 carry 1",
        format: "Resultatbitar, eller resultatbitar plus carry-out-bit när det efterfrågas."
      },
      "rotates": {
        concept: "Rotationer skiftar bitar runt ändarna i stället för att kasta bort dem.",
        rules: "Rotate left flyttar höga bitar till den låga änden. Rotate right flyttar låga bitar till den höga änden.",
        example: "1001 rol 1 = 0011\n1001 ror 1 = 1100",
        format: "Exakta resultatbitar med fast bredd."
      },
      "endian": {
        concept: "Endianness är byteordning i minnet, inte bitordning inuti varje byte.",
        rules: "Big-endian lagrar mest signifikanta byte först. Little-endian lagrar minst signifikanta byte först.",
        example: "0x12345678\nbig: 12 34 56 78\nlittle: 78 56 34 12",
        format: "Hexbytes, eller 8-bitars bytegrupper när det efterfrågas."
      },
      "masks": {
        concept: "Masker väljer, sätter, rensar, togglar eller testar specifika bitar.",
        rules: "Bitpositioner är 0-indexerade: bit 0 är biten längst till höger. Sätt med |, rensa med & ~mask, toggla med ^, testa med &.",
        example: "Sätt bit 2: x | 0b0100\nRensa bit 2: x & 0b1011",
        format: "Oftast hexresultat; för tester, svara 1 eller 0."
      },
      "ranges": {
        concept: "Intervall för heltal med fast bredd kommer från hur många bitmönster som finns.",
        rules: "Unsigned max är 2^n-1. Signed min/max är -2^(n-1) och 2^(n-1)-1.",
        example: "8-bit unsigned max 255\n8-bit signed intervall -128..127",
        format: "Decimaltal."
      },
      "extension": {
        concept: "Utökning breddar ett värde; trunkering behåller bara låga bitar.",
        rules: "Nollutökning fyller höga bitar med 0. Teckenutökning kopierar teckenbiten.",
        example: "Teckenutöka 1001 till 8 bitar: 11111001\nNollutöka 1001: 00001001",
        format: "Exakt bitmönster med målbredden."
      }
    },
    settings: {
      title: "Inställningar",
      intro: "Sparas lokalt i den här webbläsaren.",
      groupBits: "Gruppera binära siffror i fyror",
      adaptiveCategories: "Adaptiva kategorier",
      data: "Data",
      dataIntro: "Exportera, importera eller nollställ lokala framsteg.",
      progressJson: "Framsteg som JSON",
      export: "Exportera",
      copy: "Kopiera",
      import: "Importera",
      reset: "Nollställ"
    },
    messages: {
      invalidJson: "Ogiltig JSON",
      resetConfirm: "Nollställ alla lokala framsteg?",
      correct: "Rätt",
      notQuite: "Inte riktigt",
      expected: "förväntat",
      time: "Tid"
    },
    learn: {
      title: "Lär dig",
      intro: "Korta påminnelser för övningarna, inklusive förväntade svarsformat.",
      answerFormat: "Svarsformat"
    }
  }
};
