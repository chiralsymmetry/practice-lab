(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var generatedTranslationPairs = null;
  var STORAGE_KEY = "practiceLab.cppMentalExecution.v3";
  var LEGACY_KEY = "practiceLab.cppMentalExecution.v2";
  var CPP_STANDARD = "c++17";
  var LEVELS = [1, 2, 3, 4, 5];
  var progress;
  var currentQuestion;
  var startedAt = 0;
  var pauseStartedAt = 0;
  var pausedMs = 0;
  var answered = false;
  var activeInput = null;
  var recentSignatures = [];
  var recentPrompts = [];
  var elements = {};
  var selectorController;

  function t(path, fallback) {
    var value = path.split(".").reduce(function (node, key) {
      return node && Object.prototype.hasOwnProperty.call(node, key) ? node[key] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }

  function L(en, sv) { return t("localeCode", "en") === "sv" ? sv : en; }
  function localizeGeneratedString(value) {
    if (value === undefined || value === null || t("localeCode", "en") === "en") return value === undefined || value === null ? "" : String(value);
    if (!generatedTranslationPairs) {
      generatedTranslationPairs = (t("generatedReplacements", []) || []).slice().sort(function (a, b) {
        return b[0].length - a[0].length;
      });
    }
    var output = String(value);
    generatedTranslationPairs.forEach(function (pair, index) {
      output = output.split(pair[0]).join("\uE000" + index + "\uE001");
    });
    generatedTranslationPairs.forEach(function (pair, index) {
      output = output.split("\uE000" + index + "\uE001").join(pair[1]);
    });
    return output;
  }
  function localizeQuestion(question) {
    question.prompt.title = localizeGeneratedString(question.prompt.title);
    question.prompt.note = localizeGeneratedString(question.prompt.note);
    question.answer.fields.forEach(function (field) {
      field.label = localizeGeneratedString(field.label);
      if (t("localeCode", "en") === "sv" && field.id === "value" && field.label === "value") field.label = "Värde";
      if (field.kind === "choice") {
        field.options.forEach(function (option) { option.label = localizeGeneratedString(option.label); });
      }
    });
    question.workedTrace = question.workedTrace.map(localizeGeneratedString);
    question.rule = localizeGeneratedString(question.rule);
    if (question.allowedOutcomes) question.allowedOutcomes = question.allowedOutcomes.map(localizeGeneratedString);
    if (t("localeCode", "en") === "sv") {
      question.code = question.code
        .replace("// What are s and r now?", "// Vilka värden har s och r nu?")
        .replace("// p is not dereferenced", "// p derefereras inte")
        .replaceAll("// scope ends", "// scopet avslutas")
        .replace("// outer scope ends", "// det yttre scopet avslutas")
        .replace("// expression:", "// uttryck:");
    }
    return question;
  }
  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
  function formatSeconds(ms) { return ms ? (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + "s" : "0s"; }
  function formatMinutes(ms) { return ms ? Math.max(1, Math.round(ms / 60000)) + "m" : "0m"; }

  function Rng(seed) {
    var mixed = seed >>> 0;
    mixed ^= mixed >>> 16;
    mixed = Math.imul(mixed, 0x7feb352d);
    mixed ^= mixed >>> 15;
    mixed = Math.imul(mixed, 0x846ca68b);
    mixed ^= mixed >>> 16;
    this.state = mixed >>> 0 || 0x9e3779b9;
  }
  Rng.prototype.next = function () { this.state = (this.state * 1664525 + 1013904223) >>> 0; return this.state; };
  Rng.prototype.int = function (low, high) { return low + Math.floor(this.next() / 4294967296 * (high - low + 1)); };
  Rng.prototype.pick = function (items) { return items[this.int(0, items.length - 1)]; };
  Rng.prototype.shuffle = function (items) {
    items = items.slice();
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = this.int(0, i), temp = items[i]; items[i] = items[j]; items[j] = temp;
    }
    return items;
  };

  var CATEGORIES = [
    { id: "runtime", title: "Runtime State & Control" },
    { id: "aliasing", title: "Aliasing & Parameters" },
    { id: "types", title: "Types & Conversions" },
    { id: "resolution", title: "Overloads & Templates" },
    { id: "lifetime", title: "Lifetime & Ownership" },
    { id: "declarations", title: "Declarations & Callables" },
    { id: "practical", title: "Practical C++17 Operations" }
  ];

  var FAMILY_DATA = [
    ["runtime_state_trace", "runtime", "Straight-line state", "Tillstånd steg för steg", [1,2,3,4,5], "State trace", "Tillståndsspårning", "Execute full-expressions in source order and keep only live state.", "Kör fullständiga uttryck i källkodsordning och följ bara levande tillstånd."],
    ["prefix_postfix_trace", "runtime", "Increment and decrement", "Inkrement och dekrement", [1,2,3,4,5], "Prefix / postfix", "Prefix / postfix", "Separate the value yielded by an expression from the value stored afterward.", "Skilj värdet uttrycket ger från värdet som lagras efteråt."],
    ["short_circuit_trace", "runtime", "Short-circuit", "Kortslutning", [1,2,3,4,5], "Short-circuit trace", "Kortslutningsspårning", "&& and || evaluate left-to-right and may skip the right operand.", "&& och || evalueras från vänster till höger och kan hoppa över höger operand."],
    ["branch_trace", "runtime", "Branches", "Villkor", [1,2,3,4,5], "Branch trace", "Villkorsspårning", "Evaluate conditions only until an arm is selected.", "Evaluera villkor bara tills en gren har valts."],
    ["loop_trace", "runtime", "Loops", "Loopar", [2,3,4,5], "Loop trace", "Loopspårning", "Record the loop-head state; break and continue decide whether the update runs.", "Notera tillståndet vid loophuvudet; break och continue avgör om uppdateringen körs."],
    ["expression_behavior_classification", "runtime", "Behavior judgment", "Beteendebedömning", [1,2,3,4,5], "Behavior class", "Beteendeklass", "A nonportable program has a behavior class, not a guessed compiler output.", "Ett icke-portabelt program har en beteendeklass, inte en gissad kompilatorutdata."],

    ["reference_alias_trace", "aliasing", "References", "Referenser", [1,2,3,4,5], "Reference aliases", "Referensalias", "A reference binding is fixed; assignment through it changes its object.", "En referensbindning är fast; tilldelning genom den ändrar objektet."],
    ["pointer_reseat_trace", "aliasing", "Pointer reseating", "Ompakning av pekare", [1,2,3,4,5], "Pointer reseating", "Pekarompekning", "Pointer assignment changes the target; existing references do not follow.", "Pekartilldelning ändrar målet; befintliga referenser följer inte med."],
    ["parameter_passing_trace", "aliasing", "Parameter passing", "Parameteröverföring", [1,2,3,4,5], "Parameter modes", "Parameterlägen", "Values are copied, references alias, and pointer values are themselves copied.", "Värden kopieras, referenser är alias och pekarvärden kopieras i sin tur."],
    ["pointer_reference_parameter", "aliasing", "Pointer reference parameters", "Pekarreferensparametrar", [3,4,5], "int* versus int*&", "int* kontra int*&", "int*& aliases the caller's pointer object and can reseat it.", "int*& är ett alias till anroparens pekarobjekt och kan peka om det."],
    ["alias_relationship", "aliasing", "Alias topology", "Aliastopologi", [2,3,4,5], "Alias relationships", "Aliasrelationer", "Group handles by object identity, never merely by equal value.", "Gruppera handtag efter objektidentitet, aldrig bara efter lika värde."],

    ["auto_type_deduction", "types", "auto deduction", "auto-deduktion", [1,2,3,4,5], "auto type", "auto-typ", "Plain auto drops top-level cv/ref; auto&& applies reference collapsing.", "Vanlig auto tar bort cv/ref på toppnivå; auto&& använder referenskollapsning."],
    ["decltype_inference", "types", "decltype", "decltype", [2,3,4,5], "decltype", "decltype", "Apply the unparenthesized-name exception before mapping value category to references.", "Använd undantaget för oparenteserat namn före värdekategorins referensregel."],
    ["value_category", "types", "Value categories", "Värdekategorier", [2,3,4,5], "Value category", "Värdekategori", "Named variables are lvalues; std::move produces an xvalue; scalar literals are prvalues.", "Namngivna variabler är lvalues; std::move ger xvalue; skalära literaler är prvalues."],
    ["promoted_type_and_value", "types", "Promotions", "Promotioner", [2,3,4,5], "Promoted type & value", "Promoverad typ och värde", "Promote operands before computing the result.", "Promovera operanderna innan resultatet beräknas."],
    ["conversion_behavior", "types", "Conversions", "Konverteringar", [2,3,4,5], "Conversion behavior", "Konverteringsbeteende", "Check the target range before assigning a value or behavior class.", "Kontrollera måltypens intervall innan värde eller beteendeklass anges."],
    ["initialization_judgment", "types", "Initialization", "Initiering", [2,3,4,5], "Initialization judgment", "Initieringsbedömning", "List initialization rejects narrowing that = and () may perform.", "Listinitiering avvisar narrowing som = och () kan utföra."],
    ["const_pointer_type", "types", "Pointer qualification", "Pekarkvalificering", [2,3,4,5], "Pointer constness", "Pekarkonstans", "Read from the identifier outward: const may qualify the pointer or pointee.", "Läs utåt från identifieraren: const kan kvalificera pekaren eller det utpekade."],

    ["overload_conversion_rank", "resolution", "Conversion ranking", "Konverteringsrang", [1,2,3,4,5], "Overload ranking", "Overload-rangordning", "Determine viability, then rank exact match, promotion, and conversion.", "Avgör användbarhet och rangordna sedan exakt träff, promotion och konvertering."],
    ["reference_overload_resolution", "resolution", "Reference overloads", "Referensoverloads", [1,2,3,4,5], "Reference overload", "Referensoverload", "Classify argument cv and value category before choosing a binding.", "Klassificera argumentets cv och värdekategori innan bindningen väljs."],
    ["template_argument_deduction", "resolution", "Template deduction", "Templatededuktion", [2,3,4,5], "Template argument", "Templateargument", "Adjust parameter and argument types, then substitute.", "Justera parameter- och argumenttyper och substituera sedan."],
    ["forwarding_reference_deduction", "resolution", "Forwarding references", "Forwarding-referenser", [3,4,5], "Forwarding deduction", "Forwarding-deduktion", "For an lvalue U, T becomes U& and T&& collapses to U&.", "För en lvalue U blir T U& och T&& kollapsar till U&."],
    ["perfect_forwarding_call", "resolution", "Perfect forwarding", "Perfect forwarding", [3,4,5], "Forwarded call", "Vidarebefordrat anrop", "std::forward restores the caller's value category.", "std::forward återställer anroparens värdekategori."],
    ["template_vs_nontemplate", "resolution", "Template tie-break", "Templateutslagning", [3,4,5], "Template vs non-template", "Template kontra icke-template", "Conversion quality is compared before the non-template tie-break.", "Konverteringskvalitet jämförs före utslagning till icke-template."],
    ["template_partial_order_or_ambiguity", "resolution", "Partial ordering", "Partiell ordning", [3,4,5], "Ordering or ambiguity", "Ordning eller tvetydighet", "After viability and ranking, partial ordering may select a specialization—or leave ambiguity.", "Efter användbarhet och rangordning kan partiell ordning välja en specialisering—eller lämna tvetydighet."],

    ["scope_lifetime_judgment", "lifetime", "Scope lifetime", "Scope-livstid", [1,2,3,4,5], "Scope lifetime", "Scope-livstid", "A handle does not keep an automatic object alive.", "Ett handtag håller inte ett automatiskt objekt levande."],
    ["temporary_lifetime_judgment", "lifetime", "Temporary lifetime", "Temporär livstid", [2,3,4,5], "Temporary lifetime", "Temporär livstid", "Lifetime extension depends on the exact binding context.", "Livstidsförlängning beror på det exakta bindningssammanhanget."],
    ["container_invalidation_judgment", "lifetime", "Container invalidation", "Containerinvalidering", [2,3,4,5], "Iterator validity", "Iteratorgiltighet", "Apply the selected container operation's exact invalidation rule.", "Använd den valda containeroperationens exakta invalideringsregel."],
    ["move_cast_vs_consumption", "lifetime", "Move semantics", "Flyttsemantik", [2,3,4,5], "move: cast or consumption", "move: cast eller konsumtion", "std::move is a cast; another operation must consume the xvalue.", "std::move är en cast; en annan operation måste konsumera xvalue-uttrycket."],
    ["unique_ptr_transfer", "lifetime", "Unique ownership", "Unikt ägarskap", [2,3,4,5], "unique_ptr ownership", "unique_ptr-ägarskap", "Moving transfers ownership and nulls the source; copying is ill-formed.", "Flytt överför ägarskap och nollställer källan; kopiering är ill-formed."],
    ["shared_ptr_ownership", "lifetime", "Shared ownership", "Delat ägarskap", [2,3,4,5], "shared_ptr ownership", "shared_ptr-ägarskap", "Count owners, not observers; the object dies when the last owner releases it.", "Räkna ägare, inte observatörer; objektet dör när sista ägaren släpper det."],
    ["destruction_order", "lifetime", "Destruction", "Destruktion", [2,3,4,5], "Destruction order", "Destruktionsordning", "Destroy completed constructions in reverse order; members follow reverse declaration order.", "Förstör färdiga konstruktioner i omvänd ordning; medlemmar följer omvänd deklarationsordning."],

    ["declarator_array_pointer", "declarations", "Declarators", "Deklaratorer", [1,2,3,4,5], "Arrays and pointers", "Arrayer och pekare", "Start at the identifier and read binding layers outward.", "Börja vid identifieraren och läs bindningslagren utåt."],
    ["type_alias_expansion", "declarations", "Type aliases", "Typalias", [2,3,4,5], "Alias expansion", "Aliasexpansion", "An alias is a complete type, not text to substitute.", "Ett alias är en fullständig typ, inte text som ska ersättas."],
    ["function_pointer_binding", "declarations", "Function pointers", "Funktionspekare", [2,3,4,5], "Function pointer", "Funktionspekare", "The target pointer type supplies context to select an overload.", "Målpekarens typ ger kontext för att välja en overload."],
    ["data_member_pointer", "declarations", "Data member pointers", "Datamedlemspekare", [2,3,4,5], "Data member pointer", "Datamedlemspekare", "Select the object, then apply the member pointer with .* or ->*.", "Välj objektet och applicera sedan medlemspekaren med .* eller ->*."],
    ["member_function_pointer", "declarations", "Member function pointers", "Medlemsfunktionspekare", [3,4,5], "Member function pointer", "Medlemsfunktionspekare", "Match the full cv-qualified member-function type before invoking it.", "Matcha hela den cv-kvalificerade medlemsfunktionstypen före anrop."],
    ["lambda_capture_trace", "declarations", "Lambda capture", "Lambdacapture", [2,3,4,5], "Lambda capture", "Lambdacapture", "Keep closure members separate from referenced external objects.", "Håll closure-medlemmar åtskilda från externa objekt som refereras."],
    ["callable_selection_and_invoke", "declarations", "Callable composition", "Callable-komposition", [3,4,5], "Callable invocation", "Callable-anrop", "Track whether the helper copies or aliases the callable before invoking it.", "Följ om hjälpfunktionen kopierar eller aliaserar callable-objektet före anrop."],

    ["block_scope_shadow_trace", "practical", "Block scope and static locals", "Blockscope och statiska lokaler", [1,2,3,4,5], "Scope & shadowing", "Scope och skuggning", "Resolve each use to the nearest active declaration; shadowing creates a different object.", "Knyt varje användning till närmaste aktiva deklaration; skuggning skapar ett annat objekt."],
    ["static_local_trace", "practical", "Block scope and static locals", "Blockscope och statiska lokaler", [1,2,3,4,5], "Static local state", "Statiskt lokalt tillstånd", "A function-local static initializes once and preserves its value across later calls.", "En funktionslokal static initieras en gång och bevarar värdet mellan senare anrop."],
    ["value_copy_independence_trace", "practical", "Value copies and special members", "Värdekopior och specialmedlemmar", [1,2,3,4,5], "Value copy or alias", "Värdekopia eller alias", "A copied object has independent identity; a reference still denotes the source object.", "Ett kopierat objekt har egen identitet; en referens betecknar fortfarande källobjektet."],
    ["special_member_event_trace", "practical", "Value copies and special members", "Värdekopior och specialmedlemmar", [1,2,3,4,5], "Special-member events", "Specialmedlemshändelser", "Distinguish construction from assignment, then destroy automatic objects in reverse order.", "Skilj konstruktion från tilldelning och förstör sedan automatiska objekt i omvänd ordning."],
    ["vector_content_trace", "practical", "Vector contents", "Vectorinnehåll", [1,2,3,4,5], "Vector operations", "Vectoroperationer", "Track logical element order after bounded mutation; do not predict capacity.", "Följ elementens logiska ordning efter begränsade ändringar; förutsäg inte capacity."],
    ["string_content_and_lookup_trace", "practical", "String operations", "Strängoperationer", [1,2,3,4,5], "String operations", "Strängoperationer", "String positions are zero-based and pos,count uses a count, not an ending index.", "Strängpositioner börjar på noll och pos,count använder ett antal, inte ett slutindex."],
    ["ordered_map_trace", "practical", "Ordered map operations", "Ordnade map-operationer", [1,2,3,4,5], "Ordered map", "Ordnad map", "std::map lookup, insertion, update, and iteration follow unique keys in comparator order.", "Uppslagning, infogning, uppdatering och iteration i std::map följer unika nycklar i jämförelseordning."],
    ["uint32_bitwise_trace", "practical", "Fixed-width bit operations", "Bitoperationer med fast bredd", [1,2,3,4,5], "32-bit bitwise result", "32-bitars bitresultat", "Evaluate bitwise operators over the stated pinned unsigned 32-bit type.", "Beräkna bitoperatorer över den angivna fixerade 32-bitars osignerade typen."],
    ["bit_expression_selection", "practical", "Fixed-width bit operations", "Bitoperationer med fast bredd", [1,2,3,4,5], "Choose a bit expression", "Välj ett bituttryck", "Match set, clear, toggle, test, extract, and insert intents to their per-bit invariants.", "Matcha sätt, rensa, växla, testa, extrahera och infoga mot deras bitvisa invarianta egenskaper."]
  ];

  var FAMILIES = FAMILY_DATA.map(function (row) {
    return {
      id: row[0], categoryId: row[1], subcategoryId: row[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"), subcategory: L(row[2], row[3]),
      title: L(row[5], row[6]), levels: row[4], learn: L(row[7], row[8])
    };
  });
  CATEGORIES.forEach(function (category) { category.title = t("categories." + category.id + ".title", category.title); });
  function categoryById(id) { return CATEGORIES.find(function (item) { return item.id === id; }) || CATEGORIES[0]; }
  function familyById(id) { return FAMILIES.find(function (item) { return item.id === id; }) || FAMILIES[0]; }
  function familiesForCategory(id) { return FAMILIES.filter(function (item) { return item.categoryId === id; }); }

  var BEHAVIORS = ["deterministic", "unspecified", "implementation-defined", "undefined behavior", "compile error"];
  function behaviorLabel(value) {
    var labels = {
      "deterministic": L("deterministic", "deterministiskt"),
      "unspecified": L("unspecified", "ospecificerat"),
      "implementation-defined": L("implementation-defined", "implementationsdefinierat"),
      "undefined behavior": L("undefined behavior", "odefinierat beteende"),
      "compile error": L("compile error", "kompileringsfel")
    };
    return labels[value] || value;
  }
  function options(values) { return values.map(function (value) { return { value: value, label: value }; }); }
  function choiceField(id, label, value, values, aliases) {
    return { id: id, label: label, kind: "choice", value: String(value), options: values.map(function (item) {
      return typeof item === "string" ? { value: item, label: item } : item;
    }), aliases: aliases || [] };
  }
  function behaviorField(value) {
    return choiceField("behavior", L("Behavior", "Beteende"), value, BEHAVIORS.map(function (item) {
      return { value: item, label: behaviorLabel(item) };
    }));
  }
  function truthField(id, label, value) {
    return choiceField(id, label, String(value), [
      { value: "true", label: "true" },
      { value: "false", label: "false" }
    ], value ? ["1", "yes", "ja"] : ["0", "no", "nej"]);
  }
  function textField(id, label, value, kind, aliases) {
    return { id: id, label: label, kind: kind || "text", value: String(value), aliases: aliases || [] };
  }
  function intField(id, value) { return textField(id, id, value, "integer"); }
  function sequenceField(id, label, values) {
    var rendered = "[" + values.join(", ") + "]";
    return textField(id, label, rendered, "sequence", [values.join(" "), values.join(","), values.join(", ")]);
  }
  function hex32(value) { return "0x" + (value >>> 0).toString(16).toUpperCase().padStart(8, "0"); }
  function typeField(id, label, value, extra) {
    var pool = ["int", "const int", "int&", "const int&", "int&&", "const int&&", "double", "bool", "int*", "const int*", "int* const", "const int* const"];
    (extra || []).forEach(function (item) { if (!pool.includes(item)) pool.push(item); });
    if (!pool.includes(value)) pool.push(value);
    return choiceField(id, label, value, pool);
  }
  function candidateField(value, candidates) {
    return choiceField("candidate", L("Selected candidate", "Vald kandidat"), value, candidates);
  }

  function makeQuestion(familyId, level, data) {
    var family = familyById(familyId);
    var behaviorClass = data.behaviorClass || "deterministic";
    var fields = data.fields;
    var answerObject = {};
    fields.forEach(function (field) { answerObject[field.id] = field.value; });
    return {
      categoryId: family.categoryId,
      subcategoryId: family.subcategoryId,
      familyId: familyId,
      level: level,
      cppStandard: CPP_STANDARD,
      questionKind: data.questionKind || (fields.length > 1 ? "structured" : fields[0].kind),
      behaviorClass: behaviorClass,
      concepts: data.concepts || [familyId],
      misconceptionsTargeted: data.misconceptions || ["rule-confusion"],
      misconception: (data.misconceptions || ["rule-confusion"])[0],
      parameters: data.parameters || {},
      code: data.code,
      scaffold: data.scaffold || "ISO C++17; required standard headers and main() are supplied by the validation fixture.",
      canonicalAnswer: answerObject,
      acceptedAnswers: fields.reduce(function (result, field) { result[field.id] = [field.value].concat(field.aliases || []); return result; }, {}),
      workedTrace: data.steps || [],
      compilerValidationMode: data.validation || (behaviorClass === "deterministic" ? "dual-compiler compile-and-run fixture" : behaviorClass === "compile error" ? "dual-compiler compile-fail fixture" : "semantic proof; compile only; never execute"),
      structuralSignature: [familyId, data.signature || "base"].join("|"),
      prompt: {
        title: data.title || family.title,
        note: data.note || L("Answer the requested question.", "Besvara frågan.")
      },
      answer: { fields: fields },
      rule: data.rule || family.learn,
      allowedOutcomes: data.allowedOutcomes || null
    };
  }

  var GENERATORS = {};
  function progressive(level, rng, count, firstLevel, initialCount) {
    var available = Math.min(count, (initialCount || 1) + Math.max(0, level - (firstLevel || 1)));
    return rng.int(0, available - 1);
  }
  function stateQuestion(id, level, code, values, steps, signature, note) {
    return makeQuestion(id, level, {
      code: code,
      fields: Object.keys(values).map(function (name) { return intField(name, values[name]); }),
      steps: steps,
      signature: signature,
      note: note || L("Give the final value of each named object.", "Ange slutvärdet för varje namngivet objekt."),
      misconceptions: ["state-order"]
    });
  }
  function classifyQuestion(id, level, code, behavior, steps, signature, rule, outcomes) {
    return makeQuestion(id, level, {
      code: code, fields: [behaviorField(behavior)], behaviorClass: behavior,
      steps: steps, signature: signature, rule: rule, allowedOutcomes: outcomes,
      note: L("Classify this program under ISO C++17.", "Klassificera programmet enligt ISO C++17."),
      misconceptions: ["compiler-output-model"]
    });
  }

  GENERATORS.runtime_state_trace = function (level, rng) {
    var a = rng.int(2, 8), b = rng.int(2, 7), k = rng.int(1, 4), which;
    which = progressive(level, rng, 3, 1);
    if (which === 0) return stateQuestion("runtime_state_trace", level,
      "int x = " + a + ";\nx += " + b + ";\nx -= " + k + ";",
      { x: a + b - k }, ["x starts " + a, "x=" + (a+b), "x=" + (a+b-k)], "one-variable");
    if (which === 1) return stateQuestion("runtime_state_trace", level,
      "int x = " + a + ";\nint y = x + " + k + ";\nx = y - 1;\ny += x;",
      { x: a + k - 1, y: 2 * (a + k) - 1 }, ["y=" + (a+k), "x=" + (a+k-1), "y=" + (2*(a+k)-1)], "read-before-write");
    return stateQuestion("runtime_state_trace", level,
      "int a = " + a + ";\nint b = " + b + ";\nint c = a + b;\na = c - a;\nb = c - b;",
      { a: b, b: a, c: a+b }, ["c=" + (a+b), "a reads old a → " + b, "b reads old b → " + a], "swap-like");
  };

  GENERATORS.prefix_postfix_trace = function (level, rng) {
    var start = rng.int(2, 9), which = progressive(level, rng, 4, 1), code, values, steps;
    if (which === 0) { code = "int x = " + start + ";\nint y = x++;"; values = {x:start+1,y:start}; steps=["x++ yields "+start, "x becomes "+(start+1)]; }
    else if (which === 1) { code = "int x = " + start + ";\nint y = ++x;\nx += y;"; values={x:2*(start+1),y:start+1}; steps=["++x stores and yields "+(start+1), "x adds y → "+(2*(start+1))]; }
    else if (which === 2) { code = "int x = " + start + ";\nint y = x--;\nint z = --x;"; values={x:start-2,y:start,z:start-2}; steps=["x-- yields "+start+" then stores "+(start-1), "--x stores and yields "+(start-2)]; }
    else { code = "int x = " + start + ";\nint y = ++x;\nint z = y++;\nx += z;"; values={x:2*start+2,y:start+2,z:start+1}; steps=["y gets "+(start+1), "y++ yields "+(start+1)+" then stores "+(start+2), "x="+(2*start+2)]; }
    return stateQuestion("prefix_postfix_trace", level, code, values, steps, "yield-store-"+which);
  };

  GENERATORS.short_circuit_trace = function (level, rng) {
    var which = progressive(level, rng, 5, 1), code, x, hit, steps;
    if (which === 0) { code="int x = 2;\nbool hit = (x > 0) && (x < 5);"; x=2;hit=true;steps=["left is true","right is evaluated and true","x remains 2"]; }
    else if (which === 1) { code="int x = 0;\nbool hit = (x == 0) || (x++ > 0);"; x=0;hit=true;steps=["left is true","right is skipped","x remains 0"]; }
    else if (which === 2) { code="int x = 1;\nbool hit = (x++ == 0) || (++x == 3);";x=3;hit=true;steps=["left yields false; x becomes 2","right executes; x becomes 3","hit=true"]; }
    else if (which === 3) { code="int x = 0;\nbool hit = (x++ != 0) && ((x += 10) > 0);";x=1;hit=false;steps=["left is false; x becomes 1","right is skipped","hit=false"]; }
    else { code="int x = 1;\nbool hit = (++x == 2) && (x++ == 2);";x=3;hit=true;steps=["left increments x to 2 and is true","right yields 2 then x becomes 3","hit=true"]; }
    return makeQuestion("short_circuit_trace", level, {code:code,fields:[intField("x",x),truthField("hit","hit",hit)],steps:steps,signature:"path-"+which,note:L("Give final x and hit.", "Ange slutligt x och hit."),misconceptions:["short-circuit-executes-right"]});
  };

  GENERATORS.branch_trace = function (level, rng) {
    var a=rng.int(2,8), b=rng.int(3,9), k=rng.int(1,4), code, outA=a, outB=b, arm, which=progressive(level,rng,3,1);
    if(which===0){code="int a = "+a+";\nint b = "+b+";\nif (a < b) a += "+k+";\nelse b += "+k+";";if(a<b){outA+=k;arm="if";}else{outB+=k;arm="else";}}
    else if(which===1){code="int a = "+a+";\nint b = "+b+";\nif (a + b > 12) ++a;\nelse if (b - a >= 2) b += a;\nelse --b;";if(a+b>12){outA++;arm="if";}else if(b-a>=2){outB+=a;arm="else-if";}else{outB--;arm="else";}}
    else {var x=a; x-=2; var out=x%2===0?x*3:x+4;return stateQuestion("branch_trace",level,"int x = "+a+";\nx -= 2;\nif (x % 2 == 0) {\n  x *= 3;\n} else {\n  x += 4;\n}",{x:out},["x="+x,(x%2===0?"even → multiply":"odd → add"),"x="+out],"dependent-condition");}
    return stateQuestion("branch_trace",level,code,{a:outA,b:outB},["selected "+arm,"a="+outA+", b="+outB],"arm-"+arm);
  };

  GENERATORS.loop_trace = function (level, rng) {
    var n=rng.int(3,6), which=progressive(level,rng,3,2), i, s=0;
    if(which===0){for(i=1;i<=n;i++)s+=i;return stateQuestion("loop_trace",level,"int s = 0;\nfor (int i = 1; i <= "+n+"; ++i) {\n  s += i;\n}",{s:s},["add "+Array.from({length:n},function(_,j){return j+1;}).join(", "),"s="+s],"fixed-accumulator");}
    if(which===1){for(i=0;i<n;i++){if(i===2)continue;s+=i;}return stateQuestion("loop_trace",level,"int s = 0;\nfor (int i = 0; i < "+n+"; ++i) {\n  if (i == 2) continue;\n  s += i;\n}",{s:s},["i=2 skips body addition","loop update still runs","s="+s],"continue");}
    var limit=Math.max(4,n);for(i=0;i<limit;i++){if(i===3)break;s+=i;}return stateQuestion("loop_trace",level,"int s = 0;\nfor (int i = 0; i < "+limit+"; ++i) {\n  if (i == 3) break;\n  s += i;\n}",{s:s},["add 0, 1, 2","break before adding 3","s=3"],"break");
  };

  GENERATORS.expression_behavior_classification = function (level, rng) {
    var cases=[
      ["int i = 0;\n++i;\nint x = i;", "deterministic", ["Each modification is in a separate full-expression.","x=1."], "sequenced"],
      ["int i = 0;\nint x = i++ + i++;", "undefined behavior", ["Two modifications of i are unsequenced.","Do not predict output."], "unsequenced"],
      ["double d = 3.5;\nint x{d};", "compile error", ["Braced conversion from double to int is narrowing.","The declaration is ill-formed."], "narrowing"],
      ["void f(int a, int b) { std::cout << a << b; }\nint i = 0;\nf(i++, i++);", "unspecified", ["The argument evaluations are indeterminately sequenced in C++17.","Either argument may be evaluated first; there is no UB."], "argument-order"],
      ["int n = -8;\nint x = n >> 1;", "implementation-defined", ["C++17 leaves right shift of a negative signed integer implementation-defined.","The implementation must document its choice."], "negative-right-shift"]
    ];
    var row=cases[progressive(level,rng,cases.length,1,2)];
    return classifyQuestion("expression_behavior_classification",level,row[0],row[1],row[2],row[3]);
  };

  GENERATORS.reference_alias_trace = function (level,rng) {
    var a=rng.int(1,7),b=rng.int(2,8),k=rng.int(1,4),which=progressive(level,rng,3,1);
    if(which===0)return stateQuestion("reference_alias_trace",level,"int a = "+a+";\nint& r = a;\nr += "+k+";",{a:a+k},["r binds a","write through r → a="+(a+k)],"one-alias");
    if(which===1)return stateQuestion("reference_alias_trace",level,"int a = "+a+";\nint b = "+b+";\nint& r = a;\nr = b;\n++r;",{a:b+1,b:b},["r=b assigns b's value into a","r still binds a","++r → a="+(b+1)],"assign-not-rebind");
    return stateQuestion("reference_alias_trace",level,"int a = "+a+";\nint b = "+b+";\nint& r = a;\nint& s = r;\ns += b;\nr *= 2;",{a:2*(a+b),b:b},["r and s both bind a","s+=b → a="+(a+b),"r*=2 → a="+(2*(a+b))],"alias-chain");
  };

  GENERATORS.pointer_reseat_trace = function (level,rng) {
    var a=rng.int(2,7),b=rng.int(4,9),k=rng.int(1,3),which=progressive(level,rng,3,1);
    if(which===0)return stateQuestion("pointer_reseat_trace",level,"int a = "+a+";\nint* p = &a;\n*p += "+k+";",{a:a+k},["p→a","*p writes a"],"one-target");
    if(which===1)return stateQuestion("pointer_reseat_trace",level,"int a = "+a+";\nint b = "+b+";\nint* p = &a;\np = &b;\n*p -= "+k+";",{a:a,b:b-k},["p initially →a","p reseats →b","write changes b"],"reseat");
    return stateQuestion("pointer_reseat_trace",level,"int a = "+a+";\nint b = "+b+";\nint* p = &a;\nint& r = *p;\np = &b;\nr += *p;",{a:a+b,b:b},["r binds a","p reseats to b","r += *p changes a"],"reference-before-reseat");
  };

  GENERATORS.parameter_passing_trace = function(level,rng){
    var a=rng.int(2,7),b=rng.int(3,8),k=rng.int(1,4),which=progressive(level,rng,3,1);
    if(which===0){var ref=level>1&&rng.int(0,1);return stateQuestion("parameter_passing_trace",level,"void f(int"+(ref?"&":"")+" x) { x += "+k+"; }\nint a = "+a+";\nf(a);",{a:ref?a+k:a},[ref?"x aliases a":"x is a copy",ref?"a changes":"a does not change"],ref?"reference":"value");}
    if(which===1)return stateQuestion("parameter_passing_trace",level,"void f(int* p) { *p += "+k+"; }\nint a = "+a+";\nf(&a);",{a:a+k},["p is copied","the copy still points to a","*p changes a"],"pointer-write");
    return stateQuestion("parameter_passing_trace",level,"void f(int* p, int& y) {\n  p = &y;\n  *p += 2;\n}\nint a = "+a+";\nint b = "+b+";\nint* p = &a;\nf(p, b);\n*p += 1;",{a:a+1,b:b+2},["parameter p is a copy and reseats to b","b gains 2","caller p still points to a; a gains 1"],"pointer-copy-reseat");
  };

  GENERATORS.pointer_reference_parameter=function(level,rng){
    var a=rng.int(1,5),b=rng.int(2,7),byRef=rng.int(0,1)===1,code="void f(int*"+(byRef?"&":"")+" p, int& b) {\n  p = &b;\n  *p += 3;\n}\nint a = "+a+";\nint b = "+b+";\nint* p = &a;\nf(p, b);\n*p += 4;",finalA=byRef?a:a+4,finalB=byRef?b+7:b+3,target=byRef?"b":"a";
    return makeQuestion("pointer_reference_parameter",level,{code:code,fields:[intField("a",finalA),intField("b",finalB),choiceField("target",L("p points to","p pekar på"),target,["a","b"])],steps:[byRef?"int*& aliases caller p":"int* copies caller p","inside f, b gains 3","after return, *p adds 4 to "+target],signature:byRef?"pointer-reference":"pointer-value",misconceptions:["pointer-parameter-copy"]});
  };

  GENERATORS.alias_relationship=function(level,rng){
    var which=progressive(level,rng,3,2),code,answer,choices,steps;
    if(which===0){code="int a = 3;\nint b = 3;\nint& r = a;";answer="{a, r}; {b}";choices=["{a, r}; {b}","{a, b, r}","{a}; {b, r}"];steps=["a and b have equal values but are different objects","r binds a"];}
    else if(which===1){code="int a = 1;\nint b = 2;\nint* p = &a;\nint& r = *p;\np = &b;";answer="{a, r}; {b, *p}";choices=["{a, r}; {b, *p}","{a}; {b, r, *p}","{a, *p}; {b, r}"];steps=["r binds a before reseating","p now points to b"];}
    else{code="int a = 1;\nint b = 1;\nint* p = &a;\nint* q = p;\np = &b;";answer="{a, *q}; {b, *p}";choices=["{a, *q}; {b, *p}","{a, b, *p, *q}","{a, *p}; {b, *q}"];steps=["q keeps target a","p reseats to b","equal values do not imply identity"];}
    return makeQuestion("alias_relationship",level,{code:code,fields:[choiceField("groups",L("Alias groups","Aliasgrupper"),answer,choices)],steps:steps,signature:"topology-"+which,misconceptions:["equal-value-is-alias"]});
  };

  GENERATORS.auto_type_deduction=function(level,rng){
    var cases=[
      ["auto x = 42.0;","double",["Plain auto deduces the literal's type."],"plain-double"],
      ["const int n = 4;\nauto x = n;","int",["By-value auto drops top-level const."],"drop-const"],
      ["const int n = 4;\nauto& x = n;","const int&",["auto& preserves the initializer's const qualification."],"auto-ref"],
      ["int n = 4;\nauto&& x = n;","int&",["n is an lvalue, so auto deduces int&.","int& && collapses to int&."],"forward-lvalue"],
      ["const int n = 4;\nauto&& x = std::move(n);","const int&&",["std::move(n) is a const int xvalue.","auto&& becomes const int&&."],"forward-const-xvalue"]
    ],row=cases[progressive(level,rng,cases.length,1)];
    return makeQuestion("auto_type_deduction",level,{code:row[0],fields:[typeField("type",L("Declared type of x","Deklarerad typ för x"),row[1])],steps:row[2],signature:row[3],validation:"dual-compiler static_assert fixture",misconceptions:["auto-retains-top-level-const"]});
  };

  GENERATORS.decltype_inference=function(level,rng){
    var cases=[
      ["int x = 0;\nusing R = decltype(x);","int",["Unparenthesized id-expression exception: use x's declared type."],"id-exception"],
      ["int x = 0;\nusing R = decltype((x));","int&",["(x) is an lvalue expression.","decltype(lvalue) is T&."],"parenthesized"],
      ["const int x = 0;\ndecltype(auto) r = (x);","const int&",["The initializer is a parenthesized const lvalue.","decltype(auto) preserves const int&."],"decltype-auto"],
      ["int x = 0;\nusing R = decltype(std::move(x));","int&&",["std::move(x) is an xvalue.","decltype(xvalue) is T&&."],"xvalue"]
    ],row=cases[progressive(level,rng,cases.length,2)];
    return makeQuestion("decltype_inference",level,{code:row[0],fields:[typeField("type",L("Type of R/r","Typ för R/r"),row[1])],steps:row[2],signature:row[3],validation:"dual-compiler static_assert fixture",misconceptions:["decltype-parentheses"]});
  };

  GENERATORS.value_category=function(level,rng){
    var cases=[
      ["int x = 0;\n// expression: x","lvalue","A named variable expression is an lvalue.","named"],
      ["// expression: 42","prvalue","A scalar literal is a prvalue.","literal"],
      ["int x = 0;\n// expression: std::move(x)","xvalue","std::move casts x to an xvalue.","move"],
      ["int&& r = 42;\n// expression: r","lvalue","A named variable is an lvalue even when its declared type is int&&.","named-rref"],
      ["int x = 0;\nint* p = &x;\n// expression: *p","lvalue","Built-in dereference yields an lvalue.","deref"]
    ],row=cases[progressive(level,rng,cases.length,2,2)];
    return makeQuestion("value_category",level,{code:row[0],fields:[choiceField("category",L("Value category","Värdekategori"),row[1],["lvalue","xvalue","prvalue"])],steps:[row[2]],signature:row[3],validation:"dual-compiler overload-probe fixture",misconceptions:["declared-reference-is-category"]});
  };

  GENERATORS.promoted_type_and_value=function(level,rng){
    var n=rng.int(2,20),which=progressive(level,rng,3,2),code,type,value,steps;
    if(which===0){code="short a = "+n+";\nshort b = "+(n+1)+";\nauto result = a + b;";type="int";value=2*n+1;steps=["Both short operands promote to int.","Compute "+n+"+"+(n+1)+"="+value+"."];}
    else if(which===1){code="#include <cstdint>\nstd::uint8_t x = 255;\nauto result = x + 1;";type="int";value=256;steps=["uint8_t promotes to int in the stated environment.","The arithmetic is 255+1 in int, so no byte wrap."];}
    else{code="int x = "+n+";\nauto result = x + 0.5;";type="double";value=n+0.5;steps=["int converts to double.","Compute in double."];}
    return makeQuestion("promoted_type_and_value",level,{code:code,fields:[typeField("type",L("Type of result","Typ för result"),type),textField("value",L("Value of result","Värde för result"),value,"number")],steps:steps,signature:"promotion-"+which,validation:"dual-compiler static_assert and run fixture",misconceptions:["small-type-wraparound"]});
  };

  GENERATORS.conversion_behavior=function(level,rng){
    var which=progressive(level,rng,3,2,2);
    if(which===0){var x=rng.int(1,9)+0.75;return makeQuestion("conversion_behavior",level,{code:"double d = "+x+";\nint result = d;",fields:[intField("result",Math.trunc(x))],steps:["Floating-to-integer conversion truncates toward zero.","The value is representable."],signature:"float-int-safe"});}
    if(which===1)return makeQuestion("conversion_behavior",level,{code:"int n = -2;\nbool result = n;",fields:[truthField("result","result",true)],steps:["Any nonzero integer converts to true."],signature:"int-bool"});
    return classifyQuestion("conversion_behavior",level,"double d = 1e100;\nint result = d;","undefined behavior",["The floating value is outside int's representable range.","Executing the conversion has undefined behavior."],"float-int-out-of-range");
  };

  GENERATORS.initialization_judgment=function(level,rng){
    var syntax=progressive(level,rng,3,2,2),code=syntax===0?"int x = 3.9;":syntax===1?"int x(3.9);":"int x{3.9};",behavior=syntax===2?"compile error":"deterministic",fields=[behaviorField(behavior)];
    if(behavior==="deterministic")fields.push(intField("x",3));
    return makeQuestion("initialization_judgment",level,{code:code,fields:fields,behaviorClass:behavior,steps:behavior==="compile error"?["Braces apply the narrowing prohibition.","double to int is narrowing, so the declaration is ill-formed."]:["This initialization permits the conversion.","3.9 truncates to 3."],signature:["copy","direct","list"][syntax],validation:behavior==="compile error"?"dual-compiler compile-fail fixture":"dual-compiler compile-and-run fixture",misconceptions:["brace-narrowing-is-warning"]});
  };

  GENERATORS.const_pointer_type=function(level,rng){
    var cases=[
      ["int x = 1;\nconst int* p = &x;","pointer to const int",["p may be reseated.","*p cannot be written through p."],"pointee-const"],
      ["int x = 1;\nint* const p = &x;","const pointer to int",["p cannot be reseated.","*p is writable."],"pointer-const"],
      ["int x = 1;\nconst int* const p = &x;","const pointer to const int",["Neither reseating p nor writing *p is allowed."],"both-const"]
    ],row=cases[progressive(level,rng,cases.length,2,2)],choices=["pointer to const int","const pointer to int","const pointer to const int","pointer to int"];
    if(level>=3&&rng.int(0,3)===0)return classifyQuestion("const_pointer_type",level,"int x=1, y=2;\nint* const p = &x;\np = &y;","compile error",["const after * qualifies the pointer object.","p cannot be reseated."],"illegal-reseat");
    return makeQuestion("const_pointer_type",level,{code:row[0],fields:[choiceField("meaning",L("Meaning of p","Betydelse av p"),row[1],choices)],steps:row[2],signature:row[3],validation:"dual-compiler static_assert fixture",misconceptions:["pointer-pointee-const-swap"]});
  };

  GENERATORS.overload_conversion_rank=function(level,rng){
    var cases=[
      ["A: void f(int);\nB: void f(double);\n\nf(2.5);","B",["B is an exact match; A needs conversion."],"double-exact"],
      ["A: void f(int);\nB: void f(double);\n\nchar c{};\nf(c);","A",["char→int is an integral promotion.","Promotion beats conversion to double."],"promotion"],
      ["A: void f(long);\nB: void f(double);\n\nf(1L);","A",["A is exact; B needs conversion."],"long-exact"],
      ["A: void f(long);\nB: void f(unsigned long);\n\nf(0);","compile error",["Both conversions have equal rank.","There is no unique best candidate."],"ambiguous"]
    ],row=cases[progressive(level,rng,cases.length,1)],fields=row[1]==="compile error"?[behaviorField("compile error")]:[candidateField(row[1],["A","B"])];
    return makeQuestion("overload_conversion_rank",level,{code:row[0],fields:fields,behaviorClass:row[1]==="compile error"?"compile error":"deterministic",steps:row[2],signature:row[3],validation:row[1]==="compile error"?"dual-compiler compile-fail fixture":"dual-compiler compile-and-run marker fixture",misconceptions:["candidate-order-over-rank"]});
  };

  GENERATORS.reference_overload_resolution=function(level,rng){
    var cases=[
      ["int x = 0;\nf(x);","A","x is a non-const lvalue.","lvalue"],
      ["f(0);","C","The literal is a prvalue.","prvalue"],
      ["const int x = 0;\nf(x);","B","x is a const lvalue.","const-lvalue"],
      ["int x = 0;\nf(std::move(x));","C","std::move(x) is an xvalue.","xvalue"],
      ["int&& r = 1;\nf(r);","A","Named r is an lvalue expression.","named-rref"]
    ],row=cases[progressive(level,rng,cases.length,1,2)],pre="A: void f(int&);\nB: void f(const int&);\nC: void f(int&&);\n\n";
    return makeQuestion("reference_overload_resolution",level,{code:pre+row[0],fields:[candidateField(row[1],["A","B","C"])],steps:[row[2],"Only compatible reference bindings remain viable."],signature:row[3],validation:"dual-compiler compile-and-run marker fixture",misconceptions:["rvalue-reference-name-is-rvalue"]});
  };

  GENERATORS.template_argument_deduction=function(level,rng){
    var cases=[
      ["template<class T> void f(T);\nconst int x{};\nf(x);","int","By-value deduction drops top-level const.","by-value"],
      ["template<class T> void f(T&);\nconst int x{};\nf(x);","const int","T& preserves const in T.","lref"],
      ["template<class T> void f(const T&);\nconst int x{};\nf(x);","int","The parameter's const is part of the pattern; T is int.","const-lref"],
      ["template<class T> void f(T*);\nconst int* p{};\nf(p);","const int","Matching T* against const int* gives T=const int.","pointer-cv"]
    ],row=cases[progressive(level,rng,cases.length,2)];
    return makeQuestion("template_argument_deduction",level,{code:row[0],fields:[typeField("T","T",row[1])],steps:[row[2]],signature:row[3],validation:"dual-compiler static_assert fixture",misconceptions:["template-cv-adjustment"]});
  };

  GENERATORS.forwarding_reference_deduction=function(level,rng){
    var cases=[
      ["int x{};\nf(x);","int&","int&",["x is an lvalue, so T=int&.","int& && collapses to int&."],"lvalue"],
      ["const int x{};\nf(x);","const int&","const int&",["A const lvalue gives T=const int&.","Reference collapse keeps const int&."],"const-lvalue"],
      ["f(42);","int","int&&",["The prvalue gives T=int.","The parameter is int&&."],"prvalue"],
      ["int x{};\nf(std::move(x));","int","int&&",["The xvalue gives T=int.","The parameter is int&&."],"xvalue"]
    ],row=cases[progressive(level,rng,cases.length,3,2)];
    return makeQuestion("forwarding_reference_deduction",level,{code:"template<class T> void f(T&&);\n"+row[0],fields:[typeField("T","T",row[1]),typeField("parameter",L("Collapsed parameter type","Kollapsad parametertyp"),row[2])],steps:row[3],signature:row[4],validation:"dual-compiler static_assert fixture",misconceptions:["auto-rref-always-rvalue"]});
  };

  GENERATORS.perfect_forwarding_call=function(level,rng){
    var cases=[
      ["int n{};\nrelay(n);","A",["T=int&","forward<T>(x) is int lvalue","select A"],"lvalue"],
      ["const int n{};\nrelay(n);","B",["T=const int&","forward<T>(x) is const int lvalue","select B"],"const-lvalue"],
      ["relay(42);","C",["T=int","forward<T>(x) is int xvalue","select C"],"prvalue"]
    ],row=cases[progressive(level,rng,cases.length,3,2)],pre="A: void sink(int&);\nB: void sink(const int&);\nC: void sink(int&&);\n\ntemplate<class T>\nvoid relay(T&& x) {\n  sink(std::forward<T>(x));\n}\n\n";
    return makeQuestion("perfect_forwarding_call",level,{code:pre+row[0],fields:[candidateField(row[1],["A","B","C"])],steps:row[2],signature:row[3],validation:"dual-compiler compile-and-run marker fixture",misconceptions:["named-forwarding-parameter-category"]});
  };

  GENERATORS.template_vs_nontemplate=function(level,rng){
    var cases=[
      ["A: void f(int);\nB: template<class T> void f(T);\n\nf(1);","A",["Both are exact matches.","The non-template wins the tie."],"equal"],
      ["A: void f(long);\nB: template<class T> void f(T);\n\nf(1);","B",["B is exact.","A needs conversion; template status cannot overcome that."],"template-better"],
      ["A: void f(const int&);\nB: template<class T> void f(T&);\n\nint x{};\nf(x);","B",["B binds directly to int&.","A adds const qualification."],"reference-quality"]
    ],row=cases[progressive(level,rng,cases.length,3)];
    return makeQuestion("template_vs_nontemplate",level,{code:row[0],fields:[candidateField(row[1],["A","B"])],steps:row[2],signature:row[3],validation:"dual-compiler compile-and-run marker fixture",misconceptions:["non-template-always-wins"]});
  };

  GENERATORS.template_partial_order_or_ambiguity=function(level,rng){
    var cases=[
      ["A: template<class T> void f(T);\nB: template<class T> void f(T*);\n\nint* p{};\nf(p);","B",["Both templates are viable.","T* is more specialized for a pointer argument."],"pointer-specialization"],
      ["A: template<class T> void f(T&);\nB: template<class T> void f(const T&);\n\nconst int x{};\nf(x);","B",["Both bind exactly.","The const-reference pattern is more specialized here."],"const-specialization"],
      ["A: void f(long);\nB: void f(unsigned long);\n\nf(0);","compile error",["Both candidates need equal-rank conversions.","Neither is better; the call is ambiguous."],"ambiguity"]
    ],row=cases[progressive(level,rng,cases.length,3)],fields=row[1]==="compile error"?[behaviorField("compile error")]:[candidateField(row[1],["A","B"])];
    return makeQuestion("template_partial_order_or_ambiguity",level,{code:row[0],fields:fields,behaviorClass:row[1]==="compile error"?"compile error":"deterministic",steps:row[2],signature:row[3],validation:row[1]==="compile error"?"dual-compiler compile-fail fixture":"dual-compiler compile-and-run marker fixture",misconceptions:["partial-order-before-viability"]});
  };

  GENERATORS.scope_lifetime_judgment=function(level,rng){
    var cases=[
      ["int* p;\n{\n  int x = 4;\n  p = &x;\n}\nint y = *p;","undefined behavior",["x's lifetime ends at the closing brace.","Dereferencing p afterward accesses no live object."],"dangling"],
      ["int x = 4;\nint* p = &x;\n{\n  int y = *p;\n}","deterministic",["x belongs to the outer scope and remains alive.","The dereference is valid."],"outer-safe"],
      ["const int& f() {\n  int x = 7;\n  return x;\n}\nint y = f();","undefined behavior",["x dies when f returns.","The returned reference dangles before y is initialized."],"return-local"],
      ["int* p;\n{\n  int x = 4;\n  p = &x;\n}\n// p is not dereferenced","deterministic",["The handle remains unused.","This snippet does not perform an invalid access."],"unused-handle"]
    ],row=cases[progressive(level,rng,cases.length,1,2)];
    return classifyQuestion("scope_lifetime_judgment",level,row[0],row[1],row[2],row[3]);
  };

  GENERATORS.temporary_lifetime_judgment=function(level,rng){
    var cases=[
      ["const int& r = 3 + 4;\nint y = r;","deterministic",["Direct binding extends the temporary to r's lifetime.","y becomes 7."],"const-ref",7],
      ["std::string&& r = std::string(\"hi\");\nauto n = r.size();","deterministic",["Direct local rvalue-reference binding extends the temporary.","n is 2."],"rvalue-ref",2],
      ["const std::string& f() {\n  return std::string(\"hi\");\n}\nauto n = f().size();","undefined behavior",["The returned reference does not extend the temporary.","The temporary dies at the end of the return full-expression."],"return-ref",null]
    ],row=cases[progressive(level,rng,cases.length,2)],fields=[behaviorField(row[1])];
    if(row[4]!==null)fields.push(intField("value",row[4]));
    return makeQuestion("temporary_lifetime_judgment",level,{code:row[0],fields:fields,behaviorClass:row[1],steps:row[2],signature:row[3],validation:row[1]==="deterministic"?"dual-compiler compile-and-run fixture":"semantic proof; compile only; never execute",misconceptions:["all-reference-bindings-extend"]});
  };

  GENERATORS.container_invalidation_judgment=function(level,rng){
    var cases=[
      ["std::vector<int> v{1,2,3};\nauto it = v.begin() + 1;\nv.erase(v.begin());\nint x = *it;","undefined behavior",["vector::erase invalidates handles at or after the erase point.","it was after the erased element."],"vector-after",null],
      ["std::vector<int> v{1,2,3};\nauto it = v.begin();\nv.erase(v.begin() + 1);\nint x = *it;","deterministic",["it is before the erased position.","It remains valid and x=1."],"vector-before",1],
      ["std::list<int> v{1,2,3};\nauto it = v.begin();\nauto jt = std::next(it);\nv.erase(jt);\nint x = *it;","deterministic",["list::erase invalidates only handles to the erased element.","it remains valid and x=1."],"list-other",1],
      ["std::list<int> v{1,2,3};\nauto it = v.begin();\nv.insert(v.end(), 4);\nint x = *it;","deterministic",["list insertion does not invalidate existing iterators.","x remains 1."],"list-insert",1]
    ],row=cases[progressive(level,rng,cases.length,2)],fields=[behaviorField(row[1])];
    if(row[4]!==null)fields.push(intField("x",row[4]));
    return makeQuestion("container_invalidation_judgment",level,{code:row[0],fields:fields,behaviorClass:row[1],steps:row[2],signature:row[3],validation:row[1]==="deterministic"?"dual-compiler compile-and-run fixture":"semantic proof; compile only; never execute",misconceptions:["all-container-mutation-invalidates-all"]});
  };

  GENERATORS.move_cast_vs_consumption=function(level,rng){
    var cases=[
      ["std::string s = \"hi\";\nauto&& r = std::move(s);\n// What are s and r now?","hi","hi",["std::move only casts.","r aliases s; no move construction occurs."],"cast-only"],
      ["std::string s = \"hi\";\nstd::string t = std::move(s);\nauto n = s.size();","unspecified",null,["t's construction consumes the xvalue.","s remains valid, but its content and size are unspecified."],"consumed"],
      ["std::string s = \"hi\";\nstd::string t = std::move(s);\ns.clear();\ns += \"x\";","x",null,["s is valid after the move.","clear and assignment establish the specified value x."],"post-move-use"]
    ],row=cases[progressive(level,rng,cases.length,2)];
    if(row[1]==="unspecified")return classifyQuestion("move_cast_vs_consumption",level,row[0],"unspecified",row[3],row[4],null,["Any valid std::string size/content allowed by its moved-from state."]);
    var fields=row[2]!==null?[textField("s","s",row[1]),textField("r","r",row[2])]:[textField("s","s",row[1])];
    return makeQuestion("move_cast_vs_consumption",level,{code:row[0],fields:fields,steps:row[3],signature:row[4],misconceptions:["std-move-moves-by-itself"]});
  };

  GENERATORS.unique_ptr_transfer=function(level,rng){
    var value=rng.int(2,9),which=progressive(level,rng,3,2);
    if(which===2)return classifyQuestion("unique_ptr_transfer",level,"auto p = std::make_unique<int>("+value+");\nauto q = p;","compile error",["unique_ptr's copy constructor is deleted.","Use std::move to transfer ownership."],"copy");
    if(which===0)return makeQuestion("unique_ptr_transfer",level,{code:"auto p = std::make_unique<int>("+value+");\nauto q = std::move(p);",fields:[truthField("p_null",L("p is null","p är null"),true),choiceField("owner",L("Owner of "+value,"Ägare av "+value),"q",["p","q","neither"])],steps:["p initially owns the object","move construction transfers ownership to q","p becomes null"],signature:"move-construct",misconceptions:["unique-source-still-owns"]});
    return makeQuestion("unique_ptr_transfer",level,{code:"auto p = std::make_unique<int>("+value+");\nauto q = std::make_unique<int>(1);\nq = std::move(p);",fields:[truthField("p_null",L("p is null","p är null"),true),choiceField("owner",L("Owner of "+value,"Ägare av "+value),"q",["p","q","neither"])],steps:["q releases its former object","ownership transfers from p to q","p becomes null"],signature:"move-assign",misconceptions:["unique-source-still-owns"]});
  };

  GENERATORS.shared_ptr_ownership=function(level,rng){
    var which=progressive(level,rng,3,2);
    if(which===0)return makeQuestion("shared_ptr_ownership",level,{code:"auto p = std::make_shared<int>(4);\nauto q = p;\nauto n = p.use_count();",fields:[intField("n",2),choiceField("object",L("Object state","Objekttillstånd"),"alive",["alive","destroyed"])],steps:["owners={p,q}","use_count=2","object alive"],signature:"copy"});
    if(which===1)return makeQuestion("shared_ptr_ownership",level,{code:"auto p = std::make_shared<int>(4);\n{\n  auto q = p;\n}\nauto n = p.use_count();",fields:[intField("n",1),choiceField("object",L("Object state","Objekttillstånd"),"alive",["alive","destroyed"])],steps:["inside scope owners={p,q}","q is destroyed at block end","owners={p}; count=1"],signature:"scope"});
    return makeQuestion("shared_ptr_ownership",level,{code:"auto p = std::make_shared<int>(4);\nauto q = p;\np.reset();\nauto n = q.use_count();",fields:[intField("n",1),choiceField("object",L("Object state","Objekttillstånd"),"alive",["alive","destroyed"])],steps:["owners={p,q}","p.reset removes one owner","q remains; object alive"],signature:"reset"});
  };

  GENERATORS.destruction_order=function(level,rng){
    var cases=[
      ["Trace a(\"A\");\nTrace b(\"B\");\n// scope ends","B A",["construction stack: A, B","pop: B, A"],"locals"],
      ["Trace a(\"A\");\n{\n  Trace b(\"B\");\n}\nTrace c(\"C\");\n// outer scope ends","B C A",["B dies at inner block end","then outer locals die C, A"],"nested"],
      ["struct S {\n  Trace first{\"F\"};\n  Trace second{\"S\"};\n};\nS object;\n// scope ends","S F",["members were declared F then S","members destroy in reverse declaration order"],"members"],
      ["struct Base { ~Base() { log(\"Base\"); } };\nstruct D : Base {\n  Trace first{\"F\"};\n  Trace second{\"S\"};\n  ~D() { log(\"D\"); }\n};\nD object;\n// scope ends","D S F Base",["D destructor body logs first","members destroy S then F","base destroys last"],"base-members"]
    ],row=cases[progressive(level,rng,cases.length,2)];
    return makeQuestion("destruction_order",level,{code:row[0],fields:[textField("order",L("Destruction order","Destruktionsordning"),row[1],"sequence")],steps:row[2],signature:row[3],misconceptions:["initializer-list-controls-destruction"]});
  };

  GENERATORS.declarator_array_pointer=function(level,rng){
    var cases=[
      ["int* a[4];\nint (*b)[4];","a",["[] binds to a before *: a is an array of pointers.","Parentheses make * bind to b first."],"array-pointer",L("Which name is an array of four pointers?","Vilket namn är en array med fyra pekare?")],
      ["int* f(int);\nint (*p)(int);","p",["f is a function returning int*.","p is a pointer to a function returning int."],"function-pointer",L("Which name is a pointer to a function returning int?","Vilket namn är en pekare till en funktion som returnerar int?")],
      ["const int* a[3];\nconst int (*b)[3];","a",["a binds [] first: array of pointers to const int.","b binds * inside parentheses: pointer to array."],"const-array",L("Which name is an array of pointers to const int?","Vilket namn är en array med pekare till const int?")]
    ],row=cases[progressive(level,rng,cases.length,1)];
    return makeQuestion("declarator_array_pointer",level,{code:row[0],fields:[choiceField("name",L("Name","Namn"),row[1],["a","b","f","p"].filter(function(x){return row[0].includes(" "+x+"[")||row[0].includes(" "+x+"(")||row[0].includes("(*"+x+")");}))],steps:row[2],signature:row[3],note:row[4],validation:"dual-compiler static_assert fixture",misconceptions:["declarator-parentheses"]});
  };

  GENERATORS.type_alias_expansion=function(level,rng){
    var cases=[
      ["using P = int*;\nP p;","int*",["P is the complete type int*."],"pointer"],
      ["using P = int*;\nconst P p = nullptr;","int* const",["Apply const to the alias P as a whole.","The pointer is const, not the pointee."],"const-alias"],
      ["using Row = int[4];\nRow* p;","pointer to array of 4 int",["Row is an array type.","Row* is a pointer to that array."],"array-alias"],
      ["using Fn = int(int);\nusing P = Fn*;\nP p;","pointer to function int(int)",["Fn is a function type.","P is a pointer to that function type."],"function-alias"]
    ],row=cases[progressive(level,rng,cases.length,2)];
    var choices=["int*","const int*","int* const","pointer to array of 4 int","pointer to function int(int)"];
    return makeQuestion("type_alias_expansion",level,{code:row[0],fields:[choiceField("type",L("Type of p","Typ för p"),row[1],choices)],steps:row[2],signature:row[3],validation:"dual-compiler static_assert fixture",misconceptions:["alias-text-substitution"]});
  };

  GENERATORS.function_pointer_binding=function(level,rng){
    var which=progressive(level,rng,3,2),code,value,selected,steps;
    if(which===0){code="int inc(int x) { return x + 1; }\nusing F = int(*)(int);\nF p = inc;\nint result = p(4);";value="5";selected="inc";steps=["F exactly matches inc","indirect call computes 4+1"];}
    else if(which===1){code="int f(int x) { return x + 2; }\ndouble f(double x) { return x / 2; }\nusing F = int(*)(int);\nF p = f;\nint result = p(4);";value="6";selected="int f(int)";steps=["Target F selects int f(int)","call computes 6"];}
    else{code="int f(int x) { return x + 1; }\ndouble f(double x) { return x / 2; }\nusing F = double(*)(double);\nF p = f;\ndouble result = p(8.0);";value="4";selected="double f(double)";steps=["Target F selects double f(double)","call computes 4.0"];}
    return makeQuestion("function_pointer_binding",level,{code:code,fields:[textField("selected",L("Selected overload","Vald overload"),selected),textField("result","result",value,"number")],steps:steps,signature:"target-"+which,validation:"dual-compiler static_assert and run fixture",misconceptions:["overload-name-has-one-function"]});
  };

  GENERATORS.data_member_pointer=function(level,rng){
    var x=rng.int(2,7),y=rng.int(5,10),which=progressive(level,rng,3,2);
    if(which===0)return makeQuestion("data_member_pointer",level,{code:"struct S { int x = "+x+"; int y = "+y+"; };\nS s;\nint S::* p = &S::x;\nint result = s.*p;",fields:[intField("result",x)],steps:["p selects member x","s supplies the object","read s.x"],signature:"dot-star"});
    if(which===1)return stateQuestion("data_member_pointer",level,"struct S { int x = "+x+"; int y = "+y+"; };\nS s;\nint S::* p = &S::x;\ns.*p += 3;",{x:x+3,y:y},["p selects x","s.*p writes s.x"],"write");
    return makeQuestion("data_member_pointer",level,{code:"struct S { int x = "+x+"; int y = "+y+"; };\nS s;\nS* q = &s;\nint S::* p = &S::y;\nint result = q->*p;",fields:[intField("result",y)],steps:["q selects object s","p selects member y","read s.y"],signature:"arrow-star"});
  };

  GENERATORS.member_function_pointer=function(level,rng){
    var which=progressive(level,rng,3,3,2);
    if(which===2)return classifyQuestion("member_function_pointer",level,"struct S { int value() { return 4; } };\nint (S::*p)() = &S::value;\nconst S s;\nint result = (s.*p)();","compile error",["p points to a non-const member function.","A non-const member function cannot be invoked on const s."],"const-mismatch");
    var arg=rng.int(3,7),arrow=which===1,code="struct S {\n  int twice(int x) const { return 2 * x; }\n};\nint (S::*p)(int) const = &S::twice;\nS s;\n"+(arrow?"S* q = &s;\nint result = (q->*p)("+arg+");":"int result = (s.*p)("+arg+");");
    return makeQuestion("member_function_pointer",level,{code:code,fields:[intField("result",2*arg)],steps:["p matches the const-qualified member-function type",arrow?"q->*p selects the member on *q":"s.*p selects the member on s","twice("+arg+")="+(2*arg)],signature:arrow?"arrow-call":"dot-call",validation:"dual-compiler static_assert and run fixture",misconceptions:["member-function-cv"]});
  };

  GENERATORS.lambda_capture_trace=function(level,rng){
    var x=rng.int(1,5),which=progressive(level,rng,3,2);
    if(which===0)return makeQuestion("lambda_capture_trace",level,{code:"int x = "+x+";\nauto f = [x] { return x; };\nx = "+(x+4)+";\nint r = f();",fields:[intField("x",x+4),intField("r",x)],steps:["closure stores a copy x="+x,"external x changes to "+(x+4),"f reads closure copy"],signature:"value-capture",misconceptions:["value-capture-aliases"]});
    if(which===1)return makeQuestion("lambda_capture_trace",level,{code:"int x = "+x+";\nauto f = [&x] { return ++x; };\nint r = f();",fields:[intField("x",x+1),intField("r",x+1)],steps:["closure stores a reference to external x","++x changes the external object"],signature:"reference-capture"});
    return makeQuestion("lambda_capture_trace",level,{code:"int x = "+x+";\nauto f = [x]() mutable { return ++x; };\nx = "+(x+6)+";\nint a = f();\nint b = f();",fields:[intField("x",x+6),intField("a",x+1),intField("b",x+2)],steps:["closure copy starts at "+x,"external x becomes "+(x+6),"mutable calls advance closure copy to "+(x+1)+" then "+(x+2)],signature:"mutable-value",misconceptions:["mutable-capture-changes-external"]});
  };

  GENERATORS.callable_selection_and_invoke=function(level,rng){
    var which=progressive(level,rng,3,3);
    if(which===0)return makeQuestion("callable_selection_and_invoke",level,{code:"int inc(int x) { return x + 1; }\nint apply(int (*f)(int), int x) { return f(x); }\nint result = apply(inc, 4);",fields:[intField("result",5)],steps:["apply receives pointer to inc","invoke once with 4","result=5"],signature:"function-pointer"});
    if(which===1){var k=rng.int(2,5);return makeQuestion("callable_selection_and_invoke",level,{code:"template<class F>\nint apply(F f, int x) { return f(x); }\nint k = "+k+";\nauto f = [k](int x) { return x + k; };\nint result = apply(f, 5);",fields:[intField("result",5+k)],steps:["apply copies the callable","capture k="+k+" is part of the closure","invoke with 5"],signature:"value-lambda"});}
    return makeQuestion("callable_selection_and_invoke",level,{code:"template<class F>\nint apply(F f, int x) { return f(x); }\nauto f = [n=0](int x) mutable { return x + (++n); };\nint a = apply(f, 10);\nint b = apply(f, 10);",fields:[intField("a",11),intField("b",11)],steps:["Each apply call copies original f with n=0","each copy increments its own n to 1","both calls return 11"],signature:"callable-copy",misconceptions:["callable-copy-shares-state"]});
  };

  GENERATORS.block_scope_shadow_trace=function(level,rng){
    var a=rng.int(2,7),b=rng.int(4,9),k=rng.int(1,4),which=progressive(level,rng,4,1);
    if(which===0)return makeQuestion("block_scope_shadow_trace",level,{code:"int x = "+a+";\nint inside = 0;\n{\n  int x = "+b+";\n  inside = x;\n}\nint after = x;",fields:[intField("inside",b),intField("after",a)],steps:[L("The inner declaration creates a second x.","Den inre deklarationen skapar ett andra x."),L("Leaving the block reveals the outer x again.","När blocket lämnas blir yttre x synligt igen.")],signature:"one-shadow",misconceptions:["shadow-is-assignment"]});
    if(which===1)return makeQuestion("block_scope_shadow_trace",level,{code:"int x = "+a+";\nint inner = 0;\n{\n  int x = "+b+";\n  x += "+k+";\n  inner = x;\n}\nx *= 2;",fields:[intField("x",a*2),intField("inner",b+k)],steps:[L("Only the inner x receives the addition.","Bara det inre x får additionen."),L("After block exit, x names the outer object.","Efter blockslutet betecknar x det yttre objektet.")],signature:"mutate-both",misconceptions:["shadow-is-assignment"]});
    if(which===2)return makeQuestion("block_scope_shadow_trace",level,{code:"int x = "+a+";\nint y = "+b+";\nint inner = 0;\n{\n  int x = y + "+k+";\n  y = x - 1;\n  inner = x;\n}\nx += y;",fields:[intField("x",a+b+k-1),intField("y",b+k-1),intField("inner",b+k)],steps:[L("The inner x starts from y, not from outer x.","Det inre x startar från y, inte från yttre x."),L("The final x += y updates the outer x.","Det sista x += y uppdaterar yttre x.")],signature:"dependent-shadow",misconceptions:["nearest-declaration"]});
    return makeQuestion("block_scope_shadow_trace",level,{code:"int x = "+a+";\nint middle = 0;\nint inner = 0;\n{\n  int x = "+(a+k)+";\n  middle = x;\n  {\n    int x = middle + "+b+";\n    inner = x;\n  }\n}\nint outer = x;",fields:[intField("middle",a+k),intField("inner",a+k+b),intField("outer",a)],steps:[L("Each block pushes a distinct x binding.","Varje block lägger till en separat x-bindning."),L("Bindings are removed in reverse block order.","Bindningarna tas bort i omvänd blockordning.")],signature:"double-shadow",misconceptions:["nearest-declaration"]});
  };

  GENERATORS.static_local_trace=function(level,rng){
    var start=rng.int(2,7),a=rng.int(1,4),b=rng.int(2,5),which=progressive(level,rng,4,1),code,values,steps;
    if(which===0){code="int next() {\n  static int n = "+start+";\n  return n++;\n}\nint a = next();\nint b = next();\nint c = next();";values=[start,start+1,start+2];steps=[L("n initializes once.","n initieras en gång."),L("Each postfix increment stores the next persistent value.","Varje postfixinkrement lagrar nästa bestående värde.")];}
    else if(which===1){code="int next(int seed) {\n  static int n = seed;\n  return n++;\n}\nint a = next("+start+");\nint b = next("+(start+9)+");";values=[start,start+1];steps=[L("The first call supplies the initializer.","Det första anropet ger initieringsvärdet."),L("The later seed is ignored for initialization.","Det senare seed-värdet ignoreras vid initieringen.")];}
    else if(which===2){code="int add(int x) {\n  static int total = x;\n  total += x;\n  return total;\n}\nint a = add("+a+");\nint b = add("+b+");\nint c = add(1);";values=[2*a,2*a+b,2*a+b+1];steps=[L("total initializes from the first argument, then that call adds it again.","total initieras från första argumentet och samma anrop adderar det igen."),L("Later calls reuse total.","Senare anrop återanvänder total.")];}
    else{code="int step(int x) {\n  if (x < 0) return -1;\n  static int n = 10;\n  n += x;\n  return n;\n}\nint a = step(-1);\nint b = step("+a+");\nint c = step("+b+");";values=[-1,10+a,10+a+b];steps=[L("The first call returns before reaching the static declaration.","Det första anropet returnerar innan static-deklarationen nås."),L("n initializes on the first reached declaration.","n initieras första gången deklarationen nås.")];}
    return makeQuestion("static_local_trace",level,{code:code,fields:[sequenceField("returns",L("Return values","Returvärden"),values)],steps:steps,signature:"static-"+which,note:L("Enter the returned values in call order.","Ange returvärdena i anropsordning."),misconceptions:["static-reinitializes"]});
  };

  GENERATORS.value_copy_independence_trace=function(level,rng){
    var a=rng.int(1,6),b=rng.int(4,9),k=rng.int(1,4),which=progressive(level,rng,3,1),prefix="struct Pair { int first; int second; };\n";
    if(which===0)return makeQuestion("value_copy_independence_trace",level,{code:prefix+"Pair a{"+a+", "+b+"};\nPair copy = a;\ncopy.first += "+k+";",fields:[intField("a.first",a),intField("a.second",b),intField("copy.first",a+k),intField("copy.second",b)],steps:[L("copy construction creates a distinct Pair.","Kopieringskonstruktion skapar ett separat Pair-objekt."),L("The write reaches copy only.","Skrivningen når bara copy.")],signature:"copy-construct",misconceptions:["copy-is-alias"]});
    if(which===1)return makeQuestion("value_copy_independence_trace",level,{code:prefix+"Pair a{"+a+", "+b+"};\nPair copy{8, 9};\ncopy = a;\na.second += "+k+";",fields:[intField("a.first",a),intField("a.second",b+k),intField("copy.first",a),intField("copy.second",b)],steps:[L("Copy assignment transfers both member values.","Kopieringstilldelning överför båda medlemsvärdena."),L("The two objects remain independent afterward.","Objekten förblir oberoende därefter.")],signature:"copy-assign",misconceptions:["assignment-rebinds-object"]});
    return makeQuestion("value_copy_independence_trace",level,{code:prefix+"Pair a{"+a+", "+b+"};\nPair copy = a;\nPair& alias = a;\ncopy.second -= "+k+";\nalias.first += "+k+";",fields:[intField("a.first",a+k),intField("a.second",b),intField("copy.first",a),intField("copy.second",b-k)],steps:[L("copy owns a separate pair of members.","copy äger ett separat medlemspar."),L("alias denotes a, so its write changes a.","alias betecknar a, så dess skrivning ändrar a.")],signature:"copy-vs-alias",misconceptions:["copy-is-alias"]});
  };

  GENERATORS.special_member_event_trace=function(level,rng){
    var a=rng.int(2,7),b=rng.int(8,12),which=progressive(level,rng,5,1);
    var definition="struct Trace {\n  int value;\n  explicit Trace(int v) : value(v) { std::cout << \"ctor(\" << value << \") \"; }\n  Trace(const Trace& other) : value(other.value) { std::cout << \"copy(\" << value << \") \"; }\n  Trace(Trace&& other) : value(other.value) { other.value = -1; std::cout << \"move(\" << value << \") \"; }\n  Trace& operator=(const Trace& other) { value = other.value; std::cout << \"copy=(\" << value << \") \"; return *this; }\n  Trace& operator=(Trace&& other) { value = other.value; other.value = -1; std::cout << \"move=(\" << value << \") \"; return *this; }\n  ~Trace() { std::cout << \"dtor(\" << value << \") \"; }\n};\n\n";
    var body,events,signature;
    if(which===0){body="{\n  Trace a("+a+");\n}";events=["ctor("+a+")","dtor("+a+")"];signature="direct";}
    else if(which===1){body="{\n  Trace a("+a+");\n  Trace b = a;\n}";events=["ctor("+a+")","copy("+a+")","dtor("+a+")","dtor("+a+")"];signature="copy-construct";}
    else if(which===2){body="{\n  Trace a("+a+");\n  Trace b("+b+");\n  b = a;\n}";events=["ctor("+a+")","ctor("+b+")","copy=("+a+")","dtor("+a+")","dtor("+a+")"];signature="copy-assign";}
    else if(which===3){body="{\n  Trace a("+a+");\n  Trace b(std::move(a));\n}";events=["ctor("+a+")","move("+a+")","dtor("+a+")","dtor(-1)"];signature="move-construct";}
    else{body="{\n  Trace a("+a+");\n  Trace b("+b+");\n  b = std::move(a);\n}";events=["ctor("+a+")","ctor("+b+")","move=("+a+")","dtor("+a+")","dtor(-1)"];signature="move-assign";}
    return makeQuestion("special_member_event_trace",level,{code:definition+body,fields:[sequenceField("events",L("Event sequence","Händelseföljd"),events)],steps:[L("A declaration constructs a new object; operator= assigns an existing object.","En deklaration konstruerar ett nytt objekt; operator= tilldelar ett befintligt objekt."),L("The displayed move body explicitly sets the source to -1.","Den visade move-kroppen sätter uttryckligen källan till -1."),L("Block locals are destroyed in reverse construction order.","Blocklokaler förstörs i omvänd konstruktionsordning.")],signature:signature,note:L("Enter event tokens in execution order.","Ange händelsetoken i körordning."),misconceptions:["construction-vs-assignment"]});
  };

  GENERATORS.vector_content_trace=function(level,rng){
    var a=rng.int(0,5),b=rng.int(6,10),c=rng.int(11,15),d=rng.int(16,20),e=rng.int(21,25),which=progressive(level,rng,5,1),code,values,steps;
    if(which===0){code="std::vector<int> v{"+a+", "+b+"};\nv.push_back("+c+");\nv[0] = "+d+";";values=[d,b,c];steps=[L("push_back appends at the end.","push_back lägger till sist."),L("Indexed assignment replaces one existing element.","Indexerad tilldelning ersätter ett befintligt element.")];}
    else if(which===1){code="std::vector<int> v{"+a+", "+c+"};\nv.insert(v.begin() + 1, "+b+");";values=[a,b,c];steps=[L("insert places the new value before index 1.","insert placerar det nya värdet före index 1.")];}
    else if(which===2){code="std::vector<int> v{"+a+", "+b+", "+c+", "+d+"};\nv.erase(v.begin() + 1);\nv[1] = "+e+";";values=[a,e,d];steps=[L("erase removes the old index 1.","erase tar bort det gamla index 1."),L("Later indices use the shortened vector.","Senare index använder den förkortade vektorn.")];}
    else if(which===3){code="std::vector<int> v{"+a+", "+b+", "+c+", "+d+", "+e+"};\nv.erase(v.begin() + 1, v.begin() + 4);\nv.insert(v.begin() + 1, "+c+");";values=[a,c,e];steps=[L("The half-open range removes indices 1, 2, and 3.","Det halvöppna intervallet tar bort index 1, 2 och 3."),L("Insertion uses the current vector.","Infogningen använder den aktuella vektorn.")];}
    else{code="std::vector<int> v{"+a+", "+b+", "+c+"};\nv.push_back("+d+");\nv.insert(v.begin() + 1, "+e+");\nv.erase(v.begin() + 2);\nv[3] = "+b+";";values=[a,e,c,b];steps=[L("Track contents after each operation; indices shift after insert and erase.","Följ innehållet efter varje operation; index flyttas efter insert och erase."),L("Capacity is irrelevant to the requested contents.","Capacity saknar betydelse för det efterfrågade innehållet.")];}
    return makeQuestion("vector_content_trace",level,{code:code,fields:[sequenceField("v",L("Final v","Slutligt v"),values)],steps:steps,signature:"vector-"+which,note:L("Enter the final vector contents in order.","Ange vektorns slutliga innehåll i ordning."),misconceptions:["stale-container-index"]});
  };

  GENERATORS.string_content_and_lookup_trace=function(level,rng){
    var which=progressive(level,rng,5,1),code,field,steps,signature;
    if(which===0){var bases=["planet","window","coding"],base=rng.pick(bases),pos=rng.int(1,2),count=rng.int(2,3),part=base.slice(pos,pos+count);code="std::string s = \""+base+"\";\nstd::string part = s.substr("+pos+", "+count+");";field=textField("part","part",part,"text",["\""+part+"\""]);steps=[L("Start at the zero-based position and take at most count characters.","Börja vid den nollbaserade positionen och ta högst count tecken.")];signature="substr";}
    else if(which===1){var found=rng.int(0,2)===0?-1:1,needle=found<0?"xyz":"ana";code="std::string s = \"banana\";\nstd::size_t found = s.find(\""+needle+"\");";field=textField("found",L("First match","Första träff"),found<0?"not found":found,"text",found<0?["npos",L("not found","hittades inte")]:[]);steps=[found<0?L("The needle does not occur; report not found, not a numeric npos.","Söksträngen finns inte; ange hittades inte, inte ett numeriskt npos."):L("find returns the first overlapping match at index 1.","find returnerar den första överlappande träffen vid index 1.")];signature=found<0?"find-miss":"find-overlap";}
    else if(which===2){var inserted=rng.pick(["XY","42","go"]);code="std::string s = \"abcd\";\ns.insert(2, \""+inserted+"\");";var insertedResult="ab"+inserted+"cd";field=textField("s","s",insertedResult,"text",["\""+insertedResult+"\""]);steps=[L("insert places text before the current position 2.","insert placerar text före den aktuella positionen 2.")];signature="insert";}
    else if(which===3){code="std::string s = \"abcdef\";\ns.erase(1, 2);\ns.replace(1, 2, \"XY\");";field=textField("s","s","aXYf","text",["\"aXYf\""]);steps=[L("erase removes b and c, leaving adef.","erase tar bort b och c och lämnar adef."),L("replace removes de and inserts XY.","replace tar bort de och infogar XY.")];signature="erase-replace";}
    else{code="std::string s = \"abcdef\";\ns.erase(1, 2);\ns.insert(2, \"XY\");\ns.replace(0, 1, \"Q\");";field=textField("s","s","QdXYef","text",["\"QdXYef\""]);steps=[L("Every position is interpreted on the current string.","Varje position tolkas på den aktuella strängen."),L("The successive contents are adef, adXYef, QdXYef.","Det stegvisa innehållet är adef, adXYef, QdXYef.")];signature="combined";}
    return makeQuestion("string_content_and_lookup_trace",level,{code:code,fields:[field],steps:steps,signature:signature,note:L("Give the requested string or lookup result.","Ange den efterfrågade strängen eller sökresultatet."),misconceptions:["position-count-is-end"]});
  };

  GENERATORS.ordered_map_trace=function(level,rng){
    var a=rng.int(2,5),b=rng.int(6,9),which=progressive(level,rng,5,1),code,fields,steps,signature,pairs;
    if(which===0){var hit=rng.int(0,2)!==0,key=hit?2:3;code="std::map<int, int> m{{2, "+a+"}, {1, "+b+"}};\nauto it = m.find("+key+");";fields=[choiceField("lookup",L("Lookup","Uppslagning"),hit?"found":"not found",[{value:"found",label:L("found","hittad")},{value:"not found",label:L("not found","hittades inte")}])];if(hit)fields.push(intField("value",a));steps=[hit?L("find locates key 2 without inserting.","find hittar nyckel 2 utan att infoga."):L("find misses key 3 and does not insert it.","find missar nyckel 3 och infogar den inte.")];signature=hit?"find-hit":"find-miss";}
    else if(which===1){code="std::map<int, int> m{{3, "+b+"}, {1, "+a+"}};\nm.insert({2, 5});";pairs=["1:"+a,"2:5","3:"+b];fields=[sequenceField("m",L("Iteration order","Iterationsordning"),pairs)];steps=[L("The new key is inserted.","Den nya nyckeln infogas."),L("Range-for visits ascending keys 1, 2, 3.","Range-for besöker stigande nycklar 1, 2, 3.")];signature="insert";}
    else if(which===2){code="std::map<int, int> m{{3, "+b+"}, {1, "+a+"}};\nm.insert({2, 5});\nm.insert({1, 99});";pairs=["1:"+a,"2:5","3:"+b];fields=[sequenceField("m",L("Iteration order","Iterationsordning"),pairs)];steps=[L("insert adds missing key 2.","insert lägger till den saknade nyckeln 2."),L("Duplicate insert does not overwrite key 1.","En duplicerad insert skriver inte över nyckel 1.")];signature="duplicate-insert";}
    else if(which===3){code="std::map<int, int> m{{4, "+b+"}, {1, "+a+"}};\nm[3] += 5;\nm[1] = 7;";pairs=["1:7","3:5","4:"+b];fields=[sequenceField("m",L("Iteration order","Iterationsordning"),pairs)];steps=[L("Missing key 3 is inserted with int value 0, then gains 5.","Den saknade nyckeln 3 infogas med int-värdet 0 och ökas sedan med 5."),L("operator[] assignment updates key 1.","Tilldelning via operator[] uppdaterar nyckel 1.")];signature="default-insert-update";}
    else{code="std::map<int, int> m{{5, "+a+"}, {2, "+b+"}};\nm[4] = 8;\nm.insert({1, 3});\nm[5] += 2;";pairs=["1:3","2:"+b,"4:8","5:"+(a+2)];fields=[sequenceField("m",L("Iteration order","Iterationsordning"),pairs)];steps=[L("Assignment inserts key 4 and insert adds key 1.","Tilldelning infogar nyckel 4 och insert lägger till nyckel 1."),L("Iteration sorts by key, not insertion order.","Iteration sorterar efter nyckel, inte infogningsordning.")];signature="mixed-map";}
    return makeQuestion("ordered_map_trace",level,{code:code,fields:fields,steps:steps,signature:signature,note:L("Report the lookup or the key:value pairs in iteration order.","Ange uppslagningen eller nyckel:värde-paren i iterationsordning."),misconceptions:["map-insertion-order"]});
  };

  GENERATORS.uint32_bitwise_trace=function(level,rng){
    var values=[0x12345678,0xA5A50F0F,0x0F0F00FF,0xC33055AA],masks=[0x00FF00FF,0x0FF00FF0,0x3333CCCC,0xF00000F0],value=values[rng.int(0,values.length-1)]>>>0,mask=masks[rng.int(0,masks.length-1)]>>>0,which=progressive(level,rng,5,1),expression,result,signature,steps;
    if(which===0){expression="value & mask";result=(value&mask)>>>0;signature="and";steps=[L("AND keeps only positions that are 1 in both rows.","AND behåller bara positioner som är 1 i båda raderna.")];}
    else if(which===1){expression="value | mask";result=(value|mask)>>>0;signature="or";steps=[L("OR sets every position selected by either row.","OR sätter varje position som väljs av någon rad.")];}
    else if(which===2){expression="value ^ mask";result=(value^mask)>>>0;signature="xor";steps=[L("XOR sets positions where the two rows differ.","XOR sätter positioner där de två raderna skiljer sig.")];}
    else if(which===3){expression="~value";result=(~value)>>>0;signature="not";steps=[L("Complement flips all 32 positions, including leading zeroes.","Komplement växlar alla 32 positioner, inklusive inledande nollor.")];}
    else{var shift=rng.int(1,7);expression="(value >> "+shift+") ^ mask";result=((value>>>shift)^mask)>>>0;signature="shift-xor";steps=[L("Unsigned right shift fills with zero.","Osignerat högerskift fyller med noll."),L("Apply XOR after the shift.","Utför XOR efter skiftet.")];}
    var code="#include <cstdint>\n#include <type_traits>\nstatic_assert(std::is_same_v<decltype(+std::uint32_t{}), std::uint32_t>);\n\nstd::uint32_t value = std::uint32_t{"+hex32(value)+"};\nstd::uint32_t mask = std::uint32_t{"+hex32(mask)+"};\nstd::uint32_t result = "+expression+";";
    return makeQuestion("uint32_bitwise_trace",level,{code:code,fields:[textField("result","result",hex32(result),"text")],steps:steps.concat([L("Materialize and format exactly 32 unsigned bits.","Materialisera och formatera exakt 32 osignerade bitar.")]),signature:signature,note:L("Assume the validated uint32_t condition shown. Give eight hex digits.","Anta det visade validerade uint32_t-villkoret. Ange åtta hexsiffror."),validation:"development/build dual-compiler static_assert fixture",misconceptions:["logical-vs-bitwise"]});
  };

  GENERATORS.bit_expression_selection=function(level,rng){
    var which=progressive(level,rng,6,1,2),correct,choices,prompt,extra="",signature;
    if(which===0){correct="value | mask";choices=[correct,"value & mask","value ^ mask","value & ~mask"];prompt=L("Which expression sets every bit selected by mask?","Vilket uttryck sätter varje bit som väljs av mask?");signature="set";}
    else if(which===1){correct="value & ~mask";choices=[correct,"value | mask","value ^ mask","value & mask"];prompt=L("Which expression clears every bit selected by mask?","Vilket uttryck rensar varje bit som väljs av mask?");signature="clear";}
    else if(which===2){correct="value ^ mask";choices=[correct,"value | mask","value & mask","value & ~mask"];prompt=L("Which expression toggles every bit selected by mask?","Vilket uttryck växlar varje bit som väljs av mask?");signature="toggle";}
    else if(which===3){correct="(value & mask) != 0";choices=[correct,"value && mask","value == mask","(value | mask) != 0"];prompt=L("Which expression tests whether any selected bit is 1?","Vilket uttryck testar om någon vald bit är 1?");signature="test-any";}
    else if(which===4){correct="(value >> offset) & fieldMask";choices=[correct,"(value << offset) & fieldMask","value >> (offset & fieldMask)","(value & fieldMask) >> offset"];prompt=L("Which expression extracts the field beginning at offset?","Vilket uttryck extraherar fältet som börjar vid offset?");extra="\nstd::uint32_t fieldMask = std::uint32_t{0x0000000F};\nint offset = 8;";signature="extract";}
    else{correct="(value & ~(fieldMask << offset)) | ((fieldValue & fieldMask) << offset)";choices=[correct,"value | (fieldValue << offset)","(value & ~(fieldMask << offset)) | (fieldValue & fieldMask)","(value & ~fieldMask) | (fieldValue << offset)"];prompt=L("Which expression replaces the field beginning at offset?","Vilket uttryck ersätter fältet som börjar vid offset?");extra="\nstd::uint32_t fieldMask = std::uint32_t{0x0000000F};\nstd::uint32_t fieldValue = std::uint32_t{0x00000005};\nint offset = 8;";signature="insert";}
    var code="#include <cstdint>\n#include <type_traits>\nstatic_assert(std::is_same_v<decltype(+std::uint32_t{}), std::uint32_t>);\n\nstd::uint32_t value = std::uint32_t{0xA5A55A5A};\nstd::uint32_t mask = std::uint32_t{0x0000000F};"+extra;
    return makeQuestion("bit_expression_selection",level,{code:code,fields:[choiceField("expression",L("Expression","Uttryck"),correct,rng.shuffle(choices))],steps:signature==="insert"?[L("Clear the destination field first.","Rensa målfältet först."),L("Mask and shift fieldValue, then combine with OR.","Maskera och skifta fieldValue och kombinera sedan med OR.")]:[L("Apply the requested invariant independently at each selected bit.","Tillämpa den efterfrågade invarianten separat på varje vald bit.")],signature:signature,title:L("Choose the C++ bit expression.","Välj C++-uttrycket för bitoperationen."),note:prompt,validation:"development/build dual-compiler static_assert fixture",misconceptions:["bit-operation-selection"]});
  };

  function generateQuestion(familyId, level, seed, bypassRecent) {
    var family=familyById(familyId), generator=GENERATORS[family.id];
    if(!generator)throw new Error("Missing generator: "+family.id);
    if(!family.levels.includes(level))level=family.levels[0];
    var attempt=0,question,key;
    do{
      var actualSeed=(seed+attempt*2654435761)>>>0;
      question=localizeQuestion(generator(level,new Rng(actualSeed)));
      question.parameters.seed=actualSeed;
      key=question.code+"|"+JSON.stringify(question.canonicalAnswer);
      attempt+=1;
    }while(!bypassRecent&&attempt<60&&(recentSignatures.includes(question.structuralSignature)||recentPrompts.includes(key)));
    question.promptKey=key;
    return question;
  }

  function normalize(value, kind) {
    var result=String(value===undefined?"":value).trim().toLowerCase();
    if(kind==="integer"||kind==="number")return result.replace(/^\+/,"").replace(",",".");
    if(kind==="sequence")return result.replace(/[,\u2192]+/g," ").replace(/\s+/g," ");
    if(kind==="type"||kind==="choice"||kind==="text"){
      result=result.replace(/\bint const\b/g,"const int").replace(/\s*([*&(),{};])\s*/g,"$1").replace(/\s+/g," ");
    }
    return result;
  }
  function checkQuestion(answers, question) {
    var results=question.answer.fields.map(function(field){
      var given=normalize(answers[field.id],field.kind);
      var accepted=[field.value].concat(field.aliases||[]).map(function(value){return normalize(value,field.kind);});
      return {field:field,given:given,correct:accepted.includes(given)};
    });
    return {
      correct:results.every(function(item){return item.correct;}),
      fields:results,
      expected:results.map(function(item){
        var option=item.field.kind==="choice"&&item.field.options.find(function(candidate){return candidate.value===item.field.value;});
        return item.field.label+" = "+(option?option.label:item.field.value);
      }).join("; "),
      diagnosis:results.filter(function(item){return !item.correct;}).map(function(item){return item.field.label;}).join(", ")
    };
  }

  function emptyCell(){return{attempts:0,correct:0,totalMs:0,streak:0,recent:[],mastery:0,lastAt:0,misconceptions:{}};}
  function defaultProgress(){
    var enabled={};CATEGORIES.forEach(function(category){enabled[category.id]=true;});
    return{version:3,cppStandard:CPP_STANDARD,activeView:"practice",settings:{adaptive:true,enabledCategories:enabled},manual:{familyId:FAMILIES[0].id,level:FAMILIES[0].levels[0]},cells:{},history:[],legacyCategoryTotals:{}};
  }
  function migrateLegacy(old){
    var fresh=defaultProgress(),totals={};
    if(old&&old.cells)Object.keys(old.cells).forEach(function(key){var category=key.split(":")[0],cell=old.cells[key];if(!totals[category])totals[category]={attempts:0,correct:0,totalMs:0};totals[category].attempts+=cell.attempts||0;totals[category].correct+=cell.correct||0;totals[category].totalMs+=cell.totalMs||0;});
    fresh.legacyCategoryTotals=totals;return fresh;
  }
  function ensureProgress(value){
    if(!value||value.version!==3)return defaultProgress();
    var base=defaultProgress(),merged=Object.assign(base,value);merged.settings=Object.assign(base.settings,value.settings||{});merged.manual=Object.assign(base.manual,value.manual||{});merged.cells=value.cells||{};merged.history=Array.isArray(value.history)?value.history:[];merged.legacyCategoryTotals=value.legacyCategoryTotals||{};
    if(!FAMILIES.some(function(f){return f.id===merged.manual.familyId;}))merged.manual=base.manual;
    return merged;
  }
  function loadProgress(){try{var saved=localStorage.getItem(STORAGE_KEY);if(saved)return ensureProgress(JSON.parse(saved));var old=localStorage.getItem(LEGACY_KEY);if(old){var migrated=migrateLegacy(JSON.parse(old));localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated));return migrated;}}catch(error){}return defaultProgress();}
  function saveProgress(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));}catch(error){}}
  function cellFor(familyId,level){var key=familyId+":"+level;if(!progress.cells[key])progress.cells[key]=emptyCell();return progress.cells[key];}
  function recentAccuracy(cell){return cell.recent.length?cell.recent.filter(Boolean).length/cell.recent.length:0;}
  function aggregate(){
    var result={attempts:0,correct:0,totalMs:0,mastery:0,count:0,active:0};
    FAMILIES.forEach(function(f){f.levels.forEach(function(level){var c=cellFor(f.id,level);result.attempts+=c.attempts;result.correct+=c.correct;result.totalMs+=c.totalMs;result.mastery+=c.mastery;result.count+=1;if(c.attempts)result.active+=1;});});
    result.accuracy=result.attempts?result.correct/result.attempts*100:0;result.mastery=result.count?result.mastery/result.count:0;return result;
  }
  function eligibleFamilies(){return FAMILIES.filter(function(f){return progress.settings.enabledCategories[f.categoryId]!==false;});}
  function chooseAdaptive(){
    var candidates=[];eligibleFamilies().forEach(function(f){var available=f.levels.filter(function(level,index){if(!index)return true;var prior=cellFor(f.id,f.levels[index-1]);return prior.attempts>=5&&recentAccuracy(prior)>=0.8;}),level=available[available.length-1],cell=cellFor(f.id,level);candidates.push({family:f,level:level,cell:cell});});
    if(!candidates.length)candidates=[{family:FAMILIES[0],level:1,cell:cellFor(FAMILIES[0].id,1)}];
    candidates.sort(function(a,b){return a.cell.mastery-b.cell.mastery||a.cell.attempts-b.cell.attempts;});
    var roll=Math.random();if(roll<0.45)return candidates[Math.floor(Math.random()*Math.min(8,candidates.length))];
    if(roll<0.70){var practiced=candidates.filter(function(c){return c.cell.attempts>=5;});return practiced.length?practiced[Math.floor(Math.random()*practiced.length)]:candidates[0];}
    if(roll<0.90){var missed=candidates.filter(function(c){return c.cell.recent.length&&recentAccuracy(c.cell)<0.8;});return missed.length?missed[Math.floor(Math.random()*missed.length)]:candidates[0];}
    return candidates[Math.floor(Math.random()*candidates.length)];
  }

  function startQuestion(){
    resume();var selected=progress.settings.adaptive?chooseAdaptive():{family:familyById(progress.manual.familyId),level:progress.manual.level};
    currentQuestion=generateQuestion(selected.family.id,selected.level,(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0,false);
    recentSignatures.push(currentQuestion.structuralSignature);recentPrompts.push(currentQuestion.promptKey);recentSignatures=recentSignatures.slice(-20);recentPrompts=recentPrompts.slice(-100);
    startedAt=Date.now();pausedMs=0;answered=false;renderAll();if(activeInput&&window.matchMedia&&window.matchMedia("(pointer: fine)").matches)activeInput.focus();
  }
  function renderPrompt(){
    elements.questionPrompt.innerHTML='<div class="standard-note">ISO C++17 · '+escapeHtml(t("practice.scaffold","required headers and main() supplied"))+'</div><div class="prompt-title">'+escapeHtml(currentQuestion.prompt.title)+'</div><pre class="prompt-code"><code>'+escapeHtml(currentQuestion.code)+'</code></pre><div class="prompt-note">'+escapeHtml(currentQuestion.prompt.note)+'</div>';
  }
  function renderAnswerControls(){
    elements.answerControls.innerHTML="";activeInput=null;
    currentQuestion.answer.fields.forEach(function(field,index){
      var wrapper=document.createElement("div");wrapper.className="answer-control";
      var label=document.createElement("label");label.htmlFor="answer-"+field.id;label.textContent=field.label;wrapper.appendChild(label);
      var control;
      if(field.kind==="choice"){control=document.createElement("select");var blank=document.createElement("option");blank.value="";blank.textContent=t("practice.choose","Choose…");control.appendChild(blank);field.options.forEach(function(option){var node=document.createElement("option");node.value=option.value;node.textContent=option.label;control.appendChild(node);});}
      else{control=document.createElement("input");control.type="text";control.autocomplete="off";control.spellcheck=false;control.inputMode=field.kind==="integer"||field.kind==="number"?"decimal":"text";control.addEventListener("focus",function(){activeInput=control;});if(index===0)activeInput=control;}
      control.id="answer-"+field.id;control.dataset.answerField=field.id;wrapper.appendChild(control);elements.answerControls.appendChild(wrapper);
    });
  }
  function renderQuestion(){
    if(!currentQuestion)return;var family=familyById(currentQuestion.familyId),cell=cellFor(family.id,currentQuestion.level);
    elements.questionCategory.textContent=categoryById(family.categoryId).title;elements.questionFamily.textContent=family.title;elements.questionLevel.textContent=t("practice.level","Level")+" "+currentQuestion.level;elements.questionMastery.textContent=Math.round(cell.mastery)+"% "+t("practice.masterySuffix","mastery");
    renderPrompt();renderAnswerControls();elements.feedback.className="feedback hidden";elements.submitBtn.disabled=false;elements.nextBtn.classList.add("hidden");elements.skipBtn.classList.remove("hidden");elements.answerKeypad.classList.toggle("hidden",currentQuestion.answer.fields.every(function(field){return field.kind==="choice";}));
  }
  function renderSelectors(){
    var family=progress.settings.adaptive&&currentQuestion?familyById(currentQuestion.familyId):familyById(progress.manual.familyId),shownLevel=progress.settings.adaptive&&currentQuestion?currentQuestion.level:progress.manual.level;
    selectorController.render({familyId:family.id,level:shownLevel});
    elements.adaptiveModeBtn.classList.toggle("secondary-active",progress.settings.adaptive);elements.manualModeBtn.classList.toggle("secondary-active",!progress.settings.adaptive);
  }
  function renderSummary(){
    var totals=aggregate();elements.summaryMastery.textContent=Math.round(totals.mastery)+"%";elements.summaryAccuracy.textContent=Math.round(totals.accuracy)+"%";elements.summaryAttempts.textContent=totals.attempts;
    if(currentQuestion){var cell=cellFor(currentQuestion.familyId,currentQuestion.level);elements.metricMastery.textContent=Math.round(cell.mastery)+"%";elements.metricAccuracy.textContent=(cell.attempts?Math.round(cell.correct/cell.attempts*100):0)+"%";elements.metricStreak.textContent=cell.streak;elements.metricAvgTime.textContent=cell.attempts?formatSeconds(cell.totalMs/cell.attempts):"0s";}
  }
  function renderMatrix(){
    var html='<table><thead><tr><th>'+L("Family","Familj")+'</th>'+LEVELS.map(function(level){return"<th>L"+level+"</th>";}).join("")+"</tr></thead><tbody>";
    CATEGORIES.forEach(function(category){html+='<tr class="matrix-heading"><td colspan="6">'+escapeHtml(category.title)+"</td></tr>";familiesForCategory(category.id).forEach(function(family){html+="<tr><td>"+escapeHtml(family.title)+'<span class="subcategory-label">'+escapeHtml(family.subcategory)+"</span></td>";LEVELS.forEach(function(level){if(!family.levels.includes(level)){html+='<td class="unavailable-cell">—</td>';return;}var cell=cellFor(family.id,level);html+='<td><button class="level-button '+(cell.mastery>=70?"ready":cell.attempts?"weak":"")+'" data-family="'+family.id+'" data-level="'+level+'"><strong>'+Math.round(cell.mastery)+"%</strong><span>"+cell.attempts+" "+t("stats.tries","tries")+"</span></button></td>";});html+="</tr>";});});
    elements.matrix.innerHTML=html+"</tbody></table>";
  }
  function renderStats(){
    var totals=aggregate();elements.statTotalAttempts.textContent=totals.attempts;elements.statTotalCorrect.textContent=totals.correct;elements.statTotalTime.textContent=formatMinutes(totals.totalMs);elements.statActiveCells.textContent=totals.active;
    var cells=[];FAMILIES.forEach(function(family){family.levels.forEach(function(level){var cell=cellFor(family.id,level);if(cell.attempts)cells.push({f:family,level:level,c:cell});});});cells.sort(function(a,b){return a.c.mastery-b.c.mastery;});
    function list(items){return items.length?items.map(function(item){return'<button class="list-item" data-family="'+item.f.id+'" data-level="'+item.level+'"><strong>'+escapeHtml(item.f.title)+" · L"+item.level+"</strong><span>"+Math.round(item.c.mastery)+"% "+t("practice.masterySuffix","mastery")+" · "+item.c.attempts+" "+t("stats.tries","tries")+"</span></button>";}).join(""):'<div class="list-item"><strong>'+t("stats.noAttemptsYet","No attempts yet")+"</strong></div>";}
    elements.weakList.innerHTML=list(cells.slice(0,5));elements.strongList.innerHTML=list(cells.slice().reverse().slice(0,5));
  }
  function renderLearn(){
    elements.learnGrid.innerHTML=CATEGORIES.map(function(category){return'<section><div class="section-head"><h2>'+escapeHtml(category.title)+'</h2></div><div class="learn-category-grid">'+familiesForCategory(category.id).map(function(family){return'<article class="learn-card" id="learn-'+family.id+'"><h3>'+escapeHtml(family.title)+'</h3><p>'+escapeHtml(family.learn)+'</p><code>'+escapeHtml(family.id)+" · "+CPP_STANDARD+"</code></article>";}).join("")+"</div></section>";}).join("");
  }
  function renderSettings(){elements.enabledCategories.innerHTML=CATEGORIES.map(function(category){return'<label class="check-row"><input type="checkbox" data-enabled="'+category.id+'" '+(progress.settings.enabledCategories[category.id]!==false?"checked":"")+'><span>'+escapeHtml(category.title)+"</span></label>";}).join("");}
  function renderAll(){renderQuestion();renderSelectors();renderSummary();renderMatrix();renderStats();renderLearn();renderSettings();}
  function collectAnswers(){var result={};document.querySelectorAll("[data-answer-field]").forEach(function(control){result[control.dataset.answerField]=control.value;});return result;}
  function submit(event){
    if(event)event.preventDefault();if(answered||pauseStartedAt)return;var result=checkQuestion(collectAnswers(),currentQuestion),duration=Date.now()-startedAt-pausedMs,cell=cellFor(currentQuestion.familyId,currentQuestion.level);
    cell.attempts+=1;cell.correct+=result.correct?1:0;cell.streak=result.correct?cell.streak+1:0;cell.recent=cell.recent.concat([result.correct]).slice(-10);cell.totalMs+=duration;cell.lastAt=Date.now();cell.mastery=Math.round(Math.min(1,cell.attempts/5)*recentAccuracy(cell)*100);
    result.fields.filter(function(item){return !item.correct;}).forEach(function(){cell.misconceptions[currentQuestion.misconception]=(cell.misconceptions[currentQuestion.misconception]||0)+1;});
    progress.history.push({at:Date.now(),familyId:currentQuestion.familyId,categoryId:currentQuestion.categoryId,behaviorClass:currentQuestion.behaviorClass,cppStandard:CPP_STANDARD,level:currentQuestion.level,seed:currentQuestion.parameters.seed,correct:result.correct,elapsedMs:duration,signature:currentQuestion.structuralSignature});progress.history=progress.history.slice(-400);saveProgress();answered=true;
    var detail=!result.correct?'<div class="feedback-detail">'+escapeHtml(L("Check: ","Kontrollera: ")+result.diagnosis)+'</div><div class="feedback-detail">'+escapeHtml(t("messages.expected","Expected")+": "+result.expected)+"</div>":"";
    var outcomes=currentQuestion.allowedOutcomes?'<div class="rule-note">'+escapeHtml(L("Allowed outcomes: ","Tillåtna utfall: ")+currentQuestion.allowedOutcomes.join("; "))+"</div>":"";
    elements.feedback.className="feedback "+(result.correct?"correct":"incorrect");elements.feedback.innerHTML="<strong>"+(result.correct?t("messages.correct","Correct"):t("messages.notQuite","Not quite"))+"</strong>"+detail+'<div class="worked-trace">'+currentQuestion.workedTrace.map(escapeHtml).join("<br>")+"</div><div class=\"rule-note\">"+escapeHtml(currentQuestion.rule)+"</div>"+outcomes+'<span class="feedback-time">'+escapeHtml(t("messages.time","Time")+": "+formatSeconds(duration))+"</span>";
    elements.submitBtn.disabled=true;elements.skipBtn.classList.add("hidden");elements.nextBtn.classList.remove("hidden");renderSummary();renderMatrix();renderStats();
  }
  function setManual(familyId,level){var family=familyById(familyId);progress.settings.adaptive=false;progress.manual={familyId:family.id,level:family.levels.includes(level)?level:family.levels[0]};saveProgress();startQuestion();}
  function setView(name){progress.activeView=name;saveProgress();document.querySelectorAll(".view").forEach(function(view){view.classList.toggle("active",view.id==="view-"+name);});document.querySelectorAll("[data-view]").forEach(function(button){button.classList.toggle("active",button.dataset.view===name);});}
  function pause(){if(pauseStartedAt||answered)return;pauseStartedAt=Date.now();elements.practiceMain.classList.add("paused");}
  function resume(){if(!pauseStartedAt)return;pausedMs+=Date.now()-pauseStartedAt;pauseStartedAt=0;elements.practiceMain.classList.remove("paused");}
  function exportData(){elements.dataBox.value=JSON.stringify(progress,null,2);}
  function importData(){try{progress=ensureProgress(JSON.parse(elements.dataBox.value));saveProgress();startQuestion();}catch(error){alert(t("messages.invalidJson","Invalid JSON"));}}
  function cache(){
    ["summaryMastery","summaryAccuracy","summaryAttempts","adaptiveModeBtn","manualModeBtn","pauseBtn","learnCurrentBtn","questionCategory","questionFamily","questionLevel","questionMastery","questionPrompt","answerForm","answerControls","submitBtn","nextBtn","skipBtn","answerKeypad","feedback","resumeBtn","categorySelect","familySelect","levelSelect","metricMastery","metricAccuracy","metricStreak","metricAvgTime","matrix","statTotalAttempts","statTotalCorrect","statTotalTime","statActiveCells","weakList","strongList","enabledCategories","dataBox","exportBtn","copyBtn","importBtn","resetBtn","learnGrid"].forEach(function(id){elements[id]=document.getElementById(id);});elements.practiceMain=document.querySelector(".practice-main");
  }
  function bind(){
    selectorController=PracticeLabUI.createPracticeSelectors({categorySelect:elements.categorySelect,familySelect:elements.familySelect,levelSelect:elements.levelSelect,categories:CATEGORIES,families:FAMILIES,levelLabel:function(level){return t("practice.level","Level")+" "+level;},onSelect:function(selection){setManual(selection.familyId,selection.level);}});
    var editor=PracticeLabUI.createTextEditor(function(){return activeInput;});
    PracticeLabUI.renderInputGrid(elements.answerKeypad,[
      [["7",editor.insert("7")],["8",editor.insert("8")],["9",editor.insert("9")],[t("practice.delete","Delete"),editor.backspace,{variant:"function"}]],
      [["4",editor.insert("4")],["5",editor.insert("5")],["6",editor.insert("6")],[t("practice.clear","Clear"),editor.clear,{variant:"function"}]],
      [["1",editor.insert("1")],["2",editor.insert("2")],["3",editor.insert("3")],["&",editor.insert("&"),{variant:"function"}]],
      [["0",editor.insert("0")],["␣",editor.insert(" "),{variant:"function",ariaLabel:"space"}],["int",editor.insert("int"),{variant:"function"}],["double",editor.insert("double"),{variant:"function"}]],
      [["const",editor.insert("const "),{variant:"function"}],[t("answers.yes","Yes"),editor.insert(t("answers.yes","Yes")),{variant:"function"}],[t("answers.no","No"),editor.insert(t("answers.no","No")),{variant:"function"}],[t("answers.defined","Defined"),editor.insert(t("answers.defined","Defined")),{variant:"function"}]],
      [["UB",editor.insert("UB"),{variant:"function"}],[t("answers.compileError","Compile error"),editor.insert(t("answers.compileError","Compile error")),{variant:"function"}],["template",editor.insert("template"),{variant:"function"}],[t("practice.check","Check"),submit,{variant:"primary"}]],
      [["↵",function(){answered?startQuestion():submit();},{variant:"function",colspan:4}]]
    ]);
    document.querySelectorAll("[data-view]").forEach(function(button){button.addEventListener("click",function(){setView(button.dataset.view);});});elements.answerForm.addEventListener("submit",submit);elements.nextBtn.addEventListener("click",startQuestion);elements.skipBtn.addEventListener("click",startQuestion);elements.adaptiveModeBtn.addEventListener("click",function(){progress.settings.adaptive=true;saveProgress();startQuestion();});elements.manualModeBtn.addEventListener("click",function(){progress.settings.adaptive=false;saveProgress();startQuestion();});elements.pauseBtn.addEventListener("click",pause);elements.resumeBtn.addEventListener("click",resume);
    elements.matrix.addEventListener("click",function(event){var button=event.target.closest("[data-family]");if(button){setView("practice");setManual(button.dataset.family,Number(button.dataset.level));}});["weakList","strongList"].forEach(function(id){elements[id].addEventListener("click",function(event){var button=event.target.closest("[data-family]");if(button){setView("practice");setManual(button.dataset.family,Number(button.dataset.level));}});});
    elements.enabledCategories.addEventListener("change",function(event){if(event.target.dataset.enabled){progress.settings.enabledCategories[event.target.dataset.enabled]=event.target.checked;saveProgress();}});elements.learnCurrentBtn.addEventListener("click",function(){setView("learn");var node=document.getElementById("learn-"+currentQuestion.familyId);if(node)node.scrollIntoView({behavior:"smooth",block:"center"});});
    elements.exportBtn.addEventListener("click",exportData);elements.copyBtn.addEventListener("click",function(){PracticeLabUI.copyText(elements.dataBox.value||JSON.stringify(progress,null,2));});elements.importBtn.addEventListener("click",importData);elements.resetBtn.addEventListener("click",function(){if(confirm(t("messages.resetConfirm","Reset all local progress?"))){progress=defaultProgress();saveProgress();startQuestion();}});
  }
  function init(){cache();progress=loadProgress();bind();startQuestion();setView(progress.activeView||"practice");}

  function runSelfTests(){
    var failures=[];function assert(name,condition){if(!condition)failures.push(name);}
    assert("48 families",FAMILIES.length===48);assert("48 generators",Object.keys(GENERATORS).length===48);
    var specFields=["categoryId","subcategoryId","familyId","level","cppStandard","questionKind","behaviorClass","concepts","misconceptionsTargeted","parameters","code","scaffold","canonicalAnswer","acceptedAnswers","workedTrace","compilerValidationMode","structuralSignature"];
    FAMILIES.forEach(function(family,index){family.levels.forEach(function(level){for(var sample=0;sample<60;sample+=1){try{var question=generateQuestion(family.id,level,(index+1)*100000+level*1000+sample,true),answers={};question.answer.fields.forEach(function(field){answers[field.id]=field.value;});assert("canonical "+family.id+":"+level+":"+sample,checkQuestion(answers,question).correct);specFields.forEach(function(key){assert("metadata "+family.id+" "+key,question[key]!==undefined);});assert("standard "+family.id,question.cppStandard==="c++17");assert("code "+family.id,Boolean(question.code));if(question.behaviorClass!=="deterministic")assert("unsafe not run "+family.id,!question.compilerValidationMode.includes("compile-and-run"));}catch(error){failures.push("generator "+family.id+":"+level+":"+sample+" "+error.message);}}});});
    var behaviorSeen={};for(var i=0;i<500;i+=1){var q=generateQuestion("expression_behavior_classification",5,i,true);behaviorSeen[q.behaviorClass]=true;}BEHAVIORS.forEach(function(kind){assert("behavior coverage "+kind,behaviorSeen[kind]);});
    var migrated=migrateLegacy({cells:{"runtime:1":{attempts:3,correct:2,totalMs:500}}});assert("legacy totals",migrated.legacyCategoryTotals.runtime.attempts===3);assert("fresh family cells",Object.keys(migrated.cells).length===0);
    if(failures.length){console.error("C++ mental-execution self-tests failed",failures.slice(0,80),"total",failures.length);return{ok:false,failures:failures.slice(0,120)};}
    console.info("C++ mental-execution self-tests passed: 48 families, five behavior classes, generated canonical-answer and metadata sample");
    return{ok:true,failures:[]};
  }

  window.runSelfTests=runSelfTests;
  window.PracticeLabCppMentalExecution={cppStandard:CPP_STANDARD,categories:CATEGORIES,families:FAMILIES,generateQuestion:generateQuestion,checkQuestion:checkQuestion,runSelfTests:runSelfTests};
  if(typeof document!=="undefined"&&document.addEventListener)document.addEventListener("DOMContentLoaded",init);
}());
