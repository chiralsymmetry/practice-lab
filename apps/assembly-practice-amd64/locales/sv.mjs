const categories = {
  "registers-widths": "Register och bredder", "addressing-syntax": "Adressering och syntax", "integer-instructions": "Heltalsinstruktioner",
  "flags-conditions": "Flaggor och villkor", "stack-calls": "Stack och anrop", "sysv-abi": "System V-ABI", "traces-validity": "Spårning och giltighet"
};

const family = (title, rules, example) => ({ title, learn: { concept: `Öva ${title.toLocaleLowerCase("sv-SE")} enligt amd64-long-sysv-v1.`, rules, example } });
const families = {
  register_alias_identification: family("Registeralias och bitfält", "Alias namnger överlappande delar av ett 64-bitarsregister. AH/BH/CH/DH är bit 15:8; en 32-bitarsskrivning nollställer också bit 63:32.", "EAX är bit 31:0 av RAX och en skrivning nollställer den övre halvan."),
  partial_register_write: family("Skrivningar till delregister", "En 32-bitarsskrivning till ett GPR nollställer den övre halvan. En 8- eller 16-bitarsskrivning bevarar alla bitar utanför sitt fält.", "RAX=0x1122334455667788; mov ax,0xABCD ger 0x112233445566ABCD."),
  zero_sign_extension: family("Noll- och teckenutvidgning", "MOVZX fyller med nollor; MOVSX/MOVSXD upprepar källans teckenbit. En EAX-destination nollställer därefter övre RAX.", "movsxd rax,eax med EAX=0x80000000 ger 0xFFFFFFFF80000000."),
  little_endian_load_store: family("Little-endian-läsning och -lagring", "Den minst signifikanta byten lagras på lägst adress. Läsning och lagring påverkar exakt den angivna bredden.", "Byte 78 56 34 12 läses som 0x12345678."),
  operand_kind_and_width: family("Operandtyp och bredd", "Klassificera register, omedelbart värde och minne var för sig. Instruktionen och den uttryckliga storleken bestämmer en enda operandbredd.", "cmp byte ptr [rdi+1],0 har en 8-bitars minnesdestination och en omedelbar källa."),
  effective_address_bisd: family("Bas-index-skala-förskjutningsadresser", "Beräkna bas + index×skala + teckenförsedd förskjutning modulo 2^64. Skalan är 1,2,4,8 och RSP används inte som index.", "RBX=0x1000, RCX=3: [rbx+rcx*4+8] är 0x1014."),
  rip_relative_address: family("RIP-relativa adresser", "Addera den teckenförsedda förskjutningen till adressen för den följande instruktionen, aldrig till instruktionens början.", "Nästa RIP 0x400007 plus -0x20 är 0x3FFFE7."),
  lea_result: family("LEA-resultat", "LEA beräknar ett adressuttryck, läser inte minne och ändrar inga flaggor. En 32-bitarsdestination nollutvidgar sitt moderregister.", "lea eax,[rdi+rdi*2] med RDI=5 ger RAX=15."),
  intel_att_translation: family("Översättning mellan Intel och AT&T", "AT&T använder källa,destination, prefix för register och omedelbara värden, storlekssuffix och minnessyntaxen disp(base,index,scale).", "Intel add eax,5 blir AT&T addl $5,%eax."),
  mov_instruction_effect: family("MOV-effekter", "MOV kopierar exakt operandbredden och bevarar flaggor. En 32-bitars registerdestination nollställer moderregistrets övre halva.", "mov eax,[m] med dword 0xFFFFFFFF ger RAX=0x00000000FFFFFFFF."),
  add_sub_flags: family("ADD- och SUB-flaggor", "Maskera resultatet till bredden. Härled CF för osignerad carry/lån och OF för teckenoverflow separat. PF använder resultatets lägsta byte.", "8-bitars 0x7F+1 ger 0x80 med CF0 och OF1."),
  adc_sbb_effect: family("ADC och SBB", "ADC beräknar dst+src+CF. SBB beräknar dst-src-CF; x86-CF är det inkommande lånet för SBB.", "8-bitars SBB 0x10,0x01 med CF1 ger 0x0E."),
  logical_test_flags: family("Logiska operationer och TEST", "AND/OR/XOR/TEST nollställer CF/OF, sätter SF/ZF/PF och lämnar AF odefinierad. TEST lagrar inte resultatet.", "test al,0x0F med AL=0x80 sätter ZF1 och bevarar AL."),
  inc_dec_neg_not: family("Unära heltalsinstruktioner", "INC/DEC bevarar CF; NEG är 0−operanden och sätter CF om indata inte var noll; NOT ändrar inga flaggor.", "INC 0xFF med initial CF1 ger 0x00, ZF1 och CF förblir 1."),
  one_bit_shift: family("Enbitsförskjutningar", "Vid antal 1 tar CF emot den bortskjutna biten. SHL/SHR definierar OF från regeln för gammal/ny teckenbit; SAR nollställer OF. AF är odefinierad.", "8-bitars SAR 0x81 ger 0xC0, CF1, OF0."),
  imul_two_operand: family("Tvåoperands-IMUL", "Multiplicera teckenförsedda operander, trunkera till destinationsbredden och sätt CF=OF om hela produkten inte är lika med det teckenutvidgade resultatet. Övriga aritmetikflaggor är odefinierade.", "32-bitars 0x40000000×2 trunkeras till 0x80000000 med CF=OF=1."),
  cmp_flag_relation: family("CMP-relationer", "CMP sätter subtraktionsflaggor för dst−src utan att lagra resultatet. Tolka samma bitar separat som osignerade och teckenförsedda.", "0xFFFFFFFFFFFFFFFF jämfört med 1 är osignerat över men teckenförsett mindre."),
  condition_code_evaluate: family("Utvärdera villkorskoder", "Utvärdera varje Jcc från dess exakta flaggpredikat. Tecknade villkor jämför SF med OF; osignerade villkor använder CF och ZF.", "JL är sant exakt när SF skiljer sig från OF."),
  choose_signed_unsigned_jump: family("Välj tecknat eller osignerat hopp", "Välj villkoret som motsvarar datatolkningen efter cmp a,b: JA/JB är osignerade; JG/JL är tecknade.", "Tecknat a≤b använder JLE; osignerat a>b använder JA."),
  cmp_then_branch: family("CMP följt av hopp", "Beräkna först flaggorna för dst−src. Utvärdera sedan det angivna villkoret och välj mål-RIP eller nästa RIP.", "cmp eax,ebx med 5 och 7 gör JL taget."),
  direct_branch_target: family("Direkta hoppmål", "Ett direkt relativt hopp eller anrop adderar sin teckenförsedda förskjutning till nästa RIP.", "Nästa RIP 0x400105 plus -0x30 ger 0x4000D5."),
  push_pop_effect: family("PUSH och POP", "PUSH subtraherar 8 före lagring av en qword. POP läser en qword före addition av 8 till RSP.", "RSP 0x1000; push rax lagrar vid 0x0FF8."),
  call_ret_trace: family("CALL och RET", "Nära CALL pushar nästa RIP och hoppar. Nära RET poppar qword vid RSP till RIP.", "Ett anrop vid 0x400000 med längd 5 pushar 0x400005."),
  sysv_argument_location: family("System V-argumentplatser", "Heltalsargument 1–6 använder RDI,RSI,RDX,RCX,R8,R9. Vid vanlig ingång börjar argument 7 på [RSP+8]; heltalsretur använder RAX.", "Argument 6 är R9 och argument 7 är [RSP+8]."),
  caller_callee_saved: family("Anropar- och anropsbevarade register", "RBX,RBP,R12–R15 är anropsbevarade. RAX,RCX,RDX,RSI,RDI,R8–R11 är anroparbevarade. RSP måste återställas.", "En funktion som ändrar R12 måste återställa det."),
  stack_alignment: family("Stackjustering", "Före CALL är anroparens RSP mod 16 lika med 0. Den pushade returadressen gör RSP mod 16 lika med 8 vid vanlig funktionsingång.", "Ingång mod16=8; push rbp gör mod16=0."),
  prologue_epilogue_trace: family("Spåra prolog och epilog", "push rbp; mov rbp,rsp skapar en ram. leave betyder mov rsp,rbp; pop rbp. En matchande epilog återställer anroparens tillstånd.", "Ingång RSP 0x0FF8; push rbp gör RSP 0x0FF0."),
  red_zone_usage: family("System V:s red zone", "En lövfunktion får använda 128 byte under oförändrat RSP. Den här modellen nekar levande temporärer i red zone över ett anrop.", "[rsp-16] i en lövfunktion är giltig; [rsp-136] ligger utanför."),
  register_trace_snippet: family("Registerspårning", "Utför en arkitektonisk skrivning i taget och bevara opåverkade registerbitar och flaggor.", "mov al,0x7F; add al,1; movzx eax,al lämnar RAX=0x80 och OF1."),
  memory_trace_snippet: family("Minnesspårning", "Lös varje adress, läs eller skriv exakt dess bredd och bevara varje orörd byte.", "Lagring av 0x12345678 som dword skriver 78 56 34 12."),
  branching_trace_snippet: family("Hopp- och slingespårning", "Utför avgränsat kontrollflöde i ordning. Tecknade och osignerade hopptolkningar förblir uttryckliga.", "inc eax i en slinga till cmp eax,3; jl stoppar med EAX=3."),
  undefined_flag_dependency: family("Beroenden av odefinierade flaggor", "Ett hopp är obestämt endast när det förbrukar en odefinierad nödvändig flagga. Definierade flaggor kan användas även när en annan flagga är odefinierad.", "IMUL lämnar ZF odefinierad, så efterföljande JZ är obestämt."),
  abi_call_trace: family("ABI-anropsspårning", "Skilj arkitektonisk påverkan från ABI-skyldigheter: förlust av anroparbevarade register är anroparens ansvar; skada på anropsbevarade register är ett fel hos den anropade.", "En anropad funktion får ändra R10, men inte ett osparat RBX.")
};

const generatedReplacements = [
  ["value_live_across_nested_call=", "värde_levande_över_nästlat_anrop="], ["value_live_across_call=", "värde_levande_över_anrop="],
  ["unsigned below or equal", "osignerat under eller lika"], ["unsigned above or equal", "osignerat över eller lika"],
  ["signed greater or equal", "tecknat större eller lika"], ["signed less or equal", "tecknat mindre eller lika"],
  ["unsigned below", "osignerat under"], ["unsigned above", "osignerat över"], ["signed greater", "tecknat större"], ["signed less", "tecknat mindre"],
  ["not equal", "inte lika"], ["branch_if=", "hoppa_om="], ["ordinary_function_entry", "vanlig_funktionsingång"], ["integer_argument=", "heltalsargument="], ["integer_return", "heltalsretur"],
  ["context=before_call", "kontext=före_anrop"], ["context=callee_entry", "kontext=funktionsingång"], ["context=nested", "kontext=nästlat_anrop"],
  ["initial_mod16=", "initial_mod16="], ["stack_delta=", "stackförändring="], ["nested_call=", "nästlat_anrop="], ["RSP_changed=", "RSP_ändrat="],
  ["load width=", "läsbredd="], ["store width=", "lagringsbredd="], ["source=", "källa="], ["width=", "bredd="], ["address=", "adress="], ["mapped=", "mappad="], ["length=", "längd="], ["signed=", "tecknat="], ["access=", "åtkomst="],
  ["value=", "värde="], ["live=true", "levande=true"], ["ret (no restore)", "ret (ingen återställning)"],
  ["value_live", "värde_levande"], ["ordinary_entry", "vanlig_ingång"], ["RBX_before=", "RBX_före="], ["R10_before=", "R10_före="], ["callee_clobbers_R10=", "anropad_ändrar_R10="], ["callee: ", "anropad: "]
];

export default {
  code: "sv", lang: "sv", suffix: ".sv",
  text: {
    localeCode: "sv", appTitle: "AMD64-assemblerövning",
    brandSubtitle: "Spåra en kontrollerad delmängd av AMD64 long mode: register, adresser, heltalsflaggor, hopp, stackar och System V-ABI.",
    educationalNote: "Arkitekturmodell: amd64-long-sysv-v1 · Intel-syntax primär · kontrollerad GNU/AT&T-översättning · exakt arkitektoniskt tillstånd, aldrig mikroarkitekturell tidsmodell.",
    summary: { aria: "Sammanfattning av framsteg", mastery: "Snittnivå", accuracy: "Träffsäkerhet", attempts: "Försök" },
    nav: { aria: "Huvudmeny", practice: "Öva", matrix: "Matris", stats: "Statistik", settings: "Inställningar", learn: "Lär dig" },
    practice: {
      modeAria: "Övningsläge", adaptive: "Adaptivt", manual: "Manuellt", pause: "Pausa", paused: "Pausad", learnThis: "Lär dig detta",
      category: "Kategori", family: "Frågefamilj", level: "Nivå", mastery: "0 % behärskning", masterySuffix: "behärskning", check: "Kontrollera",
      next: "Nästa", skip: "Hoppa över", choose: "Välj…", keypadAria: "Hexadecimal svarsknappsats för AMD64", delete: "Radera", clear: "Rensa", space: "Mellanslag",
      nextField: "Flytta till nästa svarsfält", nextFieldShort: "Fält →", pauseText: "Tidtagningen är stoppad för den här frågan.", resume: "Fortsätt",
      controlsAria: "Övningskontroller", masteryMetric: "Behärskning", accuracyMetric: "Träffsäkerhet", streak: "Svit", avgTime: "Snittid"
    },
    matrix: { title: "Färdighetsmatris", intro: "Varje cell öppnar en stabil AMD64-familj på en strukturell svårighetsnivå." },
    stats: { title: "Statistik", intro: "Framsteg följs separat för varje familj och nivå.", totalAttempts: "Totalt antal försök", totalCorrect: "Rätt svar", totalTime: "Total tid", practicedLevels: "Övade nivåer", needsWork: "Behöver övas", strongest: "Starkast", tries: "försök", noAttemptsYet: "Inga försök ännu" },
    settings: { title: "Inställningar", intro: "Lagras lokalt i den här webbläsaren.", adaptiveCategories: "Kategorier i adaptivt läge", data: "Data", dataIntro: "Exportera, importera eller återställ lokala framsteg.", progressJson: "Framsteg som JSON", export: "Exportera", copy: "Kopiera", import: "Importera", reset: "Återställ" },
    messages: { invalidJson: "Ogiltig JSON", copied: "Framstegen kopierades.", resetConfirm: "Återställa alla lokala AMD64-framsteg?", correct: "Rätt", notQuite: "Inte riktigt", expected: "Förväntat", time: "Tid" },
    learn: { title: "Lär dig", intro: "Exakta regler för amd64-long-sysv-v1 och ett representativt exempel för varje familj." },
    prompts: { identify: "Identifiera de exakta arkitekturegenskaperna.", compute: "Beräkna det exakta arkitekturresultatet.", execute: "Utför den visade instruktionen.", trace: "Spåra den visade instruktionssekvensen.", decide: "Avgör enligt det fasta arkitektur- eller ABI-kontraktet.", translate: "Översätt utan att ändra instruktionens semantik." },
    generated: { modelNote: "Alla register, flaggor, minnesbyte, adresser och ABI-fakta som visas är initierat syntetiskt tillstånd.", resultLead: "Exakt resultat" },
    fieldLabels: {
      parent: "64-bitars moderregister", bits: "Bitintervall", zeroUpper: "32-bitarsskrivning nollställer övre halvan", value: "Värde", bytes: "Ordnade byte",
      destinationKind: "Destinationstyp", sourceKind: "Källtyp", width: "Operandbredd", address: "Adress", flagsUnchanged: "Flaggor oförändrade", memoryReads: "Minnesläsningar",
      translation: "Översättning", destination: "Destination", preserved: "Övrigt tillstånd bevarat", result: "Resultat", CF: "CF", PF: "PF", AF: "AF", ZF: "ZF", SF: "SF", OF: "OF",
      unsignedRelation: "Osignerad relation", signedRelation: "Teckenförsedd relation", taken: "Taget", jump: "Hopp", RIP: "RIP", RSP: "RSP", memoryValue: "Qword på stacken",
      location: "Plats", registerClass: "Registerklass", responsibility: "Ansvar", modulus: "RSP mod 16", valid: "ABI-giltig", RBP: "RBP", range: "Byteintervall", path: "Utförd väg", determined: "Bestämdhet", abiValid: "ABI-giltig", state: "Sluttillstånd"
    },
    choiceLabels: {
      yes: "Ja", no: "Nej", register: "Register", memory: "Minne", immediate: "Omedelbart värde", none: "Inget", unchanged: "Oförändrat",
      less: "Mindre", equal: "Lika", greater: "Större", below: "Under", above: "Över", taken: "Taget", notTaken: "Inte taget",
      callerSaved: "Anroparbevarat", calleeSaved: "Anropsbevarat", caller: "Anroparen", callee: "Den anropade", determinedTaken: "Bestämt: taget",
      determinedNotTaken: "Bestämt: inte taget", indeterminate: "Obestämt", valid: "Giltigt", invalid: "Ogiltigt", target: "Mål", fallthrough: "Nästa instruktion"
    },
    categories, families, generatedReplacements
  }
};
