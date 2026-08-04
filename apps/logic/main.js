(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.logic.v1";
  var MODEL_ID = "classical-logic-finite-v1";
  var ORACLE_VERSION = "logic-exhaustive-oracle-v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var progress, rng, currentQuestion = null, currentStartedAt = 0, pausedMs = 0, pauseStartedAt = 0;
  var submitted = false, isPaused = false, activeAnswerInput = null, selectorController = null, keypadButtons = null;
  var learnSpotlightId = null, recentSignatures = [];

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }
  function Rng(seed) { this.state = (Number(seed) >>> 0) || 0x10C1CA1; }
  Rng.prototype.next = function () { var x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state; };
  Rng.prototype.int = function (min, max) { return min + (this.next() % (max - min + 1)); };
  Rng.prototype.pick = function (values) { return values[this.int(0, values.length - 1)]; };
  Rng.prototype.bool = function () { return Boolean(this.next() & 1); };
  Rng.prototype.shuffle = function (values) { var out = values.slice(); for (var i = out.length - 1; i > 0; i -= 1) { var j = this.int(0, i), x = out[i]; out[i] = out[j]; out[j] = x; } return out; };

  var CATEGORIES = [
    { id: "symbols", title: t("categories.symbols", "Symbols & Scope") },
    { id: "truth", title: t("categories.truth", "Truth Conditions") },
    { id: "equivalence", title: t("categories.equivalence", "Equivalence") },
    { id: "arguments", title: t("categories.arguments", "Arguments & Rules") },
    { id: "proofs", title: t("categories.proofs", "Short Proofs") },
    { id: "quantifiers", title: t("categories.quantifiers", "Quantifiers & Models") }
  ];
  var FAMILY_IDS = {
    symbols: ["symbolize_proposition", "verbalize_formula", "identify_main_connective", "scope_parenthesization", "conditional_direction"],
    truth: ["evaluate_formula_assignment", "connective_missing_value", "truth_table_column", "classify_formula", "satisfying_assignment", "premise_set_consistency"],
    equivalence: ["negate_formula", "conditional_forms", "equivalent_rewrite", "equivalence_decision", "equivalence_counterassignment", "normal_form_conversion"],
    arguments: ["infer_rule_conclusion", "identify_inference_rule", "complete_argument", "argument_validity", "argument_countermodel", "valid_form_or_fallacy", "symbolized_natural_argument"],
    proofs: ["justify_proof_line", "choose_next_proof_step", "fill_proof_gap", "order_proof_steps", "assumption_discharge"],
    quantifiers: ["symbolize_quantified_sentence", "negate_quantified_formula", "evaluate_unary_model", "evaluate_relation_model", "quantifier_order_contrast", "witness_or_counterexample", "quantified_inference", "categorical_argument_validity"]
  };
  var FAMILIES = [];
  Object.keys(FAMILY_IDS).forEach(function (categoryId) {
    FAMILY_IDS[categoryId].forEach(function (id) {
      var data = t("families." + id, {});
      FAMILIES.push({ id: id, categoryId: categoryId, title: data.title || id, levels: LEVELS, learn: { concept: data.rule || "", rules: t("generated.trap", "Common trap:") + " " + categoryTrap(categoryId), example: data.example || "" } });
    });
  });
  function categoryTrap(categoryId) {
    var traps = {
      symbols: TEXT.localeCode === "sv" ? "Läs inte den första synliga symbolen som huvudkonnektiv och vänd inte på ”endast om”." : "Do not treat the first visible symbol as the root or reverse ‘only if’.",
      truth: TEXT.localeCode === "sv" ? "En falsk antecedent gör en materiell implikation sann; en enda rad klassificerar inte en hel formel." : "A false antecedent makes a material conditional true; one row does not classify a whole formula.",
      equivalence: TEXT.localeCode === "sv" ? "En omskrivning måste bevara alla rader, och begärd normalform är ett separat syntaktiskt krav." : "A rewrite must preserve every row, and a requested normal form is a separate syntactic requirement.",
      arguments: TEXT.localeCode === "sv" ? "Rimlighet och sanna slutsatser ersätter inte giltighetstestet; motmodellen måste göra alla premisser sanna." : "Plausibility and a true conclusion do not replace validity; a countermodel must make every premise true.",
      proofs: TEXT.localeCode === "sv" ? "Rader i ett stängt delbevis är inte längre tillgängliga utanför dess räckvidd." : "Lines inside a closed subproof are not accessible outside its scope.",
      quantifiers: TEXT.localeCode === "sv" ? "Universella påståenden medför inte existens och relationens argumentordning spelar roll." : "Universal claims do not imply existence, and relation argument order matters."
    };
    return traps[categoryId];
  }
  function familyById(id) { return FAMILIES.find(function (item) { return item.id === id; }) || FAMILIES[0]; }
  function categoryById(id) { return CATEGORIES.find(function (item) { return item.id === id; }) || CATEGORIES[0]; }

  /* Propositional AST and exact oracles. */
  function atom(name) { return { op: "atom", name: name }; }
  function not(a) { return { op: "not", a: a }; }
  function and(a, b) { return { op: "and", a: a, b: b }; }
  function or(a, b) { return { op: "or", a: a, b: b }; }
  function imp(a, b) { return { op: "imp", a: a, b: b }; }
  function iff(a, b) { return { op: "iff", a: a, b: b }; }
  var SIGNS = { not: "¬", and: "∧", or: "∨", imp: "→", iff: "↔" };
  function propText(node) {
    if (node.op === "atom") return node.name;
    if (node.op === "not") return "¬" + (node.a.op === "atom" || node.a.op === "not" ? propText(node.a) : "(" + propText(node.a) + ")");
    return "(" + propText(node.a) + " " + SIGNS[node.op] + " " + propText(node.b) + ")";
  }
  function propEval(node, env) {
    if (node.op === "atom") return Boolean(env[node.name]);
    if (node.op === "not") return !propEval(node.a, env);
    var a = propEval(node.a, env), b = propEval(node.b, env);
    if (node.op === "and") return a && b;
    if (node.op === "or") return a || b;
    if (node.op === "imp") return !a || b;
    return a === b;
  }
  function propVars(node, set) { set = set || new Set(); if (node.op === "atom") set.add(node.name); else { propVars(node.a, set); if (node.b) propVars(node.b, set); } return Array.from(set).sort(); }
  function truthRows(vars) { var rows = []; for (var mask = (1 << vars.length) - 1; mask >= 0; mask -= 1) { var env = {}; vars.forEach(function (name, index) { env[name] = Boolean(mask & (1 << (vars.length - index - 1))); }); rows.push(env); } return rows; }
  function truthColumn(node, vars) { return truthRows(vars || propVars(node)).map(function (env) { return propEval(node, env); }); }
  function equivalent(a, b) { var vars = Array.from(new Set(propVars(a).concat(propVars(b)))).sort(); return truthRows(vars).every(function (env) { return propEval(a, env) === propEval(b, env); }); }
  function counterRows(a, b) { var vars = Array.from(new Set(propVars(a).concat(propVars(b)))).sort(); return truthRows(vars).filter(function (env) { return propEval(a, env) !== propEval(b, env); }); }
  function argumentCountermodels(premises, conclusion) { var vars = Array.from(new Set(premises.flatMap(function (premise) { return propVars(premise); }).concat(propVars(conclusion)))).sort(); return truthRows(vars).filter(function (env) { return premises.every(function (p) { return propEval(p, env); }) && !propEval(conclusion, env); }); }
  function sameAst(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function isLiteral(node) { return node.op === "atom" || (node.op === "not" && node.a.op === "atom"); }
  function isCnf(node) { if (isLiteral(node)) return true; if (node.op === "or") return cnfClause(node); if (node.op === "and") return isCnf(node.a) && isCnf(node.b); return false; }
  function cnfClause(node) { return isLiteral(node) || (node.op === "or" && cnfClause(node.a) && cnfClause(node.b)); }
  function astKey(node) { return JSON.stringify(node); }
  function assignmentText(env) { return Object.keys(env).sort().map(function (key) { return key + "=" + (env[key] ? "T" : "F"); }).join(", "); }

  function scopeAccessible(source, target) {
    if (source.scopePath.length > target.scopePath.length) return false;
    return source.scopePath.every(function (scope, index) { return target.scopePath[index] === scope; });
  }
  function validateProofLine(lines, index) {
    var line=lines[index];if(!line||!line.formula||!Array.isArray(line.scopePath)||!Array.isArray(line.citations))return false;
    if(line.rule==="premise")return line.scopePath.length===0&&line.citations.length===0;
    if(line.rule==="assumption")return line.scopePath.length>0&&line.citations.length===0;
    var cited=line.citations.map(function(i){return lines[i];});if(cited.some(function(x,i){return!x||line.citations[i]>=index||!scopeAccessible(x,line);}))return false;
    if(line.rule==="andE")return cited.length===1&&cited[0].formula.op==="and"&&(sameAst(line.formula,cited[0].formula.a)||sameAst(line.formula,cited[0].formula.b));
    if(line.rule==="andI")return cited.length===2&&(sameAst(line.formula,and(cited[0].formula,cited[1].formula))||sameAst(line.formula,and(cited[1].formula,cited[0].formula)));
    if(line.rule==="impE")return cited.length===2&&cited.some(function(x,i){var other=cited[1-i];return x.formula.op==="imp"&&sameAst(x.formula.a,other.formula)&&sameAst(x.formula.b,line.formula);});
    if(line.rule==="notE")return cited.length===2&&((cited[0].formula.op==="not"&&sameAst(cited[0].formula.a,cited[1].formula))||(cited[1].formula.op==="not"&&sameAst(cited[1].formula.a,cited[0].formula)))&&line.formula.op==="bottom";
    if(line.rule==="impI"||line.rule==="notI"){var range=line.range;if(!range||range.start>=range.end||range.end>=index)return false;var first=lines[range.start],last=lines[range.end];if(!first||first.rule!=="assumption"||!last||first.scopePath.length!==line.scopePath.length+1||!scopeAccessible(line,first)||!scopeAccessible(first,last))return false;return line.rule==="impI"?line.formula.op==="imp"&&sameAst(line.formula.a,first.formula)&&sameAst(line.formula.b,last.formula):line.formula.op==="not"&&sameAst(line.formula.a,first.formula)&&last.formula.op==="bottom";}
    if(line.rule==="iffI"){var ranges=line.ranges;if(!Array.isArray(ranges)||ranges.length!==2||line.formula.op!=="iff")return false;function direction(range,a,b){var first=lines[range.start],last=lines[range.end];return first&&last&&first.rule==="assumption"&&first.scopePath.length===line.scopePath.length+1&&scopeAccessible(line,first)&&scopeAccessible(first,last)&&sameAst(first.formula,a)&&sameAst(last.formula,b);}return direction(ranges[0],line.formula.a,line.formula.b)&&direction(ranges[1],line.formula.b,line.formula.a);}
    return false;
  }
  function validateProof(lines) { return Array.isArray(lines)&&lines.length>0&&lines.every(function(_,index){return validateProofLine(lines,index);}); }
  function bottom(){return{op:"bottom"};}

  function tokenizeFormula(source) {
    var text = String(source || "").normalize("NFKC").replace(/<->|↔/g, " ↔ ").replace(/->|→/g, " → ").replace(/\biff\b/gi, " ↔ ").replace(/\bnot\b/gi, " ¬ ").replace(/[!~]/g, " ¬ ").replace(/\band\b/gi, " ∧ ").replace(/&/g, " ∧ ").replace(/\bor\b/gi, " ∨ ").replace(/\|/g, " ∨ ");
    var tokens = text.match(/[PQRSABCD]|[¬∧∨→↔()]|⊤|⊥/gi) || [];
    if (tokens.join("").toUpperCase() !== text.replace(/\s+/g, "").toUpperCase()) return null;
    return tokens.map(function (token) { return /^[a-z]$/i.test(token) ? token.toUpperCase() : token; });
  }
  function parseFormula(source) {
    var tokens = tokenizeFormula(source); if (!tokens) return null; var at = 0;
    function primary() { var token = tokens[at++]; if (/^[PQRSABCD]$/.test(token || "")) return atom(token); if (token === "(") { var node = biconditional(); if (tokens[at++] !== ")") throw new Error("parenthesis"); return node; } throw new Error("atom"); }
    function negation() { if (tokens[at] === "¬") { at += 1; return not(negation()); } return primary(); }
    function conjunction() { var node = negation(); while (tokens[at] === "∧") { at += 1; node = and(node, negation()); } return node; }
    function disjunction() { var node = conjunction(); while (tokens[at] === "∨") { at += 1; node = or(node, conjunction()); } return node; }
    function implication() { var node = disjunction(); if (tokens[at] === "→") { at += 1; node = imp(node, implication()); } return node; }
    function biconditional() { var node = implication(); if (tokens[at] === "↔") { at += 1; node = iff(node, implication()); if (tokens[at] === "↔") throw new Error("chained iff"); } return node; }
    try { var result = biconditional(); return at === tokens.length ? result : null; } catch (error) { return null; }
  }

  /* Finite first-order semantic objects and evaluator. */
  function pred(name, x) { return { op: "pred", name: name, args: [x] }; }
  function rel(name, x, y) { return { op: "pred", name: name, args: [x, y] }; }
  function qnot(a) { return { op: "not", a: a }; }
  function qand(a, b) { return { op: "and", a: a, b: b }; }
  function qimp(a, b) { return { op: "imp", a: a, b: b }; }
  function all(v, body) { return { op: "all", v: v, body: body }; }
  function some(v, body) { return { op: "some", v: v, body: body }; }
  function folText(node) {
    if (node.op === "pred") return node.name + "(" + node.args.join(",") + ")";
    if (node.op === "not") return "¬" + folText(node.a);
    if (node.op === "and" || node.op === "imp") return "(" + folText(node.a) + (node.op === "and" ? " ∧ " : " → ") + folText(node.b) + ")";
    return (node.op === "all" ? "∀" : "∃") + node.v + " " + folText(node.body);
  }
  function folEval(node, model, env) {
    env = env || {};
    if (node.op === "pred") { var args = node.args.map(function (term) { return env[term] || model.constants[term] || term; }); var ext = model.predicates[node.name] || []; return ext.some(function (item) { return Array.isArray(item) ? item.join("\u0000") === args.join("\u0000") : item === args[0]; }); }
    if (node.op === "not") return !folEval(node.a, model, env);
    if (node.op === "and") return folEval(node.a, model, env) && folEval(node.b, model, env);
    if (node.op === "imp") return !folEval(node.a, model, env) || folEval(node.b, model, env);
    if (node.op === "all") return model.domain.every(function (value) { var next = Object.assign({}, env); next[node.v] = value; return folEval(node.body, model, next); });
    return model.domain.some(function (value) { var next = Object.assign({}, env); next[node.v] = value; return folEval(node.body, model, next); });
  }

  function choiceField(id, label, answer, options, accepted) { return { id: id, label: label, kind: "choice", answer: String(answer), accepted: (accepted || [answer]).map(String), options: options.map(function (item) { return { value: String(item[0]), label: String(item[1]) }; }) }; }
  function formulaField(id, label, target, mode) { return { id: id, label: label, kind: "formula", answer: propText(target), target: target, mode: mode || "ast" }; }
  function yesNoField(value) { return choiceField("answer", t("generated.question", "Answer"), value ? "yes" : "no", [["yes", t("generated.yes", "Yes")], ["no", t("generated.no", "No")]]); }
  function tfField(value) { return choiceField("answer", t("generated.truthValue", "Truth value"), value ? "T" : "F", [["T", t("generated.true", "True") + " (T)"], ["F", t("generated.false", "False") + " (F)"]]); }
  function formulaOptions(nodes) { return nodes.map(function (node) { return [astKey(node), propText(node)]; }); }
  function envOptions(vars) { return truthRows(vars).map(function (env) { return [assignmentText(env), assignmentText(env)]; }); }
  function block(kind, text, extra) { return Object.assign({ kind: kind, text: text }, extra || {}); }
  function output(title, blocks, fields, explanation, signature, semantic) { return { title: title, blocks: blocks, fields: fields, explanation: explanation, signature: signature, semantic: semantic || {} }; }
  function title(key) { return t("generated." + key, t("generated.question", "Choose or enter the exact answer.")); }
  function shuffledUnique(r, values) { var seen = new Set(); return r.shuffle(values).filter(function (value) { var key = typeof value === "string" ? value : astKey(value); if (seen.has(key)) return false; seen.add(key); return true; }); }
  function connectiveName(op) { return SIGNS[op] || op; }
  function conditionalFormName(form) {
    if (TEXT.localeCode !== "sv") return form;
    return { converse: "omvändning", inverse: "invers", contrapositive: "kontraposition" }[form] || form;
  }
  function inferenceName(short) {
    var english = { MP: "modus ponens", MT: "modus tollens", AC: "affirming the consequent", DA: "denying the antecedent", HS: "hypothetical syllogism", DS: "disjunctive syllogism" };
    var swedish = { MP: "modus ponens", MT: "modus tollens", AC: "bekräftande av konsekventen", DA: "förnekande av antecedenten", HS: "hypotetisk syllogism", DS: "disjunktiv syllogism" };
    return (TEXT.localeCode === "sv" ? swedish : english)[short];
  }
  function localizeProofLines(lines) {
    if (TEXT.localeCode !== "sv") return lines;
    return lines.map(function (line) { return line.replaceAll("Premise", "Premiss").replaceAll("Goal", "Mål").replaceAll("Assume", "Anta"); });
  }
  function levelParts(level, r) {
    var names = r.shuffle(["P", "Q", "R", "S"]), a = atom(names[0]), b = atom(names[1]), c = atom(names[2]);
    if (level >= 3) a = r.bool() ? and(a, c) : or(a, c);
    if (level >= 4) b = r.bool() ? imp(b, not(c)) : and(not(b), c);
    if (level >= 5) a = r.bool() ? imp(a, b) : iff(a, b);
    return { a: a, b: b, c: c, names: names };
  }
  function semanticSentence(kind) { return t("generated." + ({ and:"andSentence", or:"orSentence", not:"notSentence", imp:"ifSentence", only:"onlyIfSentence", iff:"iffSentence", neither:"neitherSentence" }[kind]), kind); }
  function argumentText(premises, conclusion) { return t("generated.premises", "Premises") + ": " + premises.map(propText).join(", ") + "\n" + t("generated.conclusion", "Conclusion") + ": " + propText(conclusion); }
  function proofText(lines) { return lines.map(function (line, index) { return (index + 1) + ". " + line; }).join("\n"); }

  function scenario(id, level, r) {
    var p = levelParts(level, r), P = atom("P"), Q = atom("Q"), R = atom("R"), source, target, variants, env, vars, column, options, correct, premises, conclusion, counters, model, formula, values, mode, form;
    switch (id) {
    case "symbolize_proposition":
      variants = [{ kind:"and", ast:and(P,Q) }, { kind:"or", ast:or(P,Q) }, { kind:"imp", ast:imp(P,Q) }, { kind:"only", ast:imp(P,Q) }, { kind:"iff", ast:iff(P,Q) }, { kind:"neither", ast:and(not(P),not(Q)) }]; var sv = variants[(r.int(0, 99) + level) % Math.min(variants.length, level + 2)];
      return output(title("symbolize"), [block("note", t("generated.legend", "Legend") + ": P, Q"), block("formula", "“" + semanticSentence(sv.kind) + "”")], [formulaField("answer", t("generated.formula", "Formula"), sv.ast, "ast")], familyById(id).learn.concept, sv.kind + ":" + r.int(0, 2), { formulaAst: sv.ast });
    case "verbalize_formula":
      variants = [{ kind:"and", ast:and(P,Q) }, { kind:"or", ast:or(P,Q) }, { kind:"not", ast:not(P) }, { kind:"imp", ast:imp(P,Q) }, { kind:"iff", ast:iff(P,Q) }, { kind:"neither", ast:and(not(P),not(Q)) }]; var vv = variants[(r.int(0, 99) + level) % variants.length];
      options = variants.map(function (v) { return [v.kind, semanticSentence(v.kind)]; });
      return output(title("verbalize"), [block("formula", propText(vv.ast))], [choiceField("answer", t("generated.question", "Answer"), vv.kind, options)], familyById(id).learn.concept, vv.kind + ":" + r.int(0, 2), { formulaAst: vv.ast });
    case "identify_main_connective":
      source = level < 2 ? (r.bool() ? and(P,Q) : not(P)) : level < 4 ? imp(not(P), and(Q,R)) : iff(imp(P,Q), or(not(R),P));
      options = [[source.op, connectiveName(source.op) + " — " + (TEXT.localeCode === "sv" ? "ytterst" : "outermost")]].concat(["not","and","or","imp","iff"].filter(function (op) { return op !== source.op; }).slice(0,3).map(function (op) { return [op, connectiveName(op)]; }));
      return output(title("mainConnective"), [block("formula", propText(source))], [choiceField("answer", t("generated.question", "Answer"), source.op, options)], familyById(id).learn.concept, source.op + ":" + level + ":" + r.int(0,2), { formulaAst: source, sourceSpan: "root" });
    case "scope_parenthesization":
      source = level < 2 ? and(not(P),Q) : level < 4 ? imp(or(P,Q),R) : imp(P,imp(Q,or(not(R),atom("S"))));
      variants = shuffledUnique(r, [source, level < 2 ? not(and(P,Q)) : imp(P,or(Q,R)), level < 4 ? or(P,imp(Q,R)) : imp(imp(P,Q),or(not(R),atom("S"))), or(and(P,Q),R)]).slice(0,4);
      return output(title("parenthesize"), [block("formula", level < 2 ? "¬P ∧ Q" : level < 4 ? "P ∨ Q → R" : "P → Q → ¬R ∨ S")], [choiceField("answer", t("generated.formula", "Formula"), astKey(source), formulaOptions(variants))], familyById(id).learn.concept, propText(source) + ":" + r.int(0,2), { formulaAst: source });
    case "conditional_direction":
      mode = r.pick(["if", "only", "required"]); options = [["P-Q", "P " + (TEXT.localeCode === "sv" ? "tillräcklig; Q nödvändig" : "sufficient; Q necessary")], ["Q-P", "Q " + (TEXT.localeCode === "sv" ? "tillräcklig; P nödvändig" : "sufficient; P necessary")], ["both-n", TEXT.localeCode === "sv" ? "Båda nödvändiga" : "Both necessary"], ["both-s", TEXT.localeCode === "sv" ? "Båda tillräckliga" : "Both sufficient"]];
      correct = mode === "if" || mode === "only" ? "P-Q" : "Q-P";
      return output(title("conditionalRoles"), [block("note", mode === "if" ? semanticSentence("imp") : mode === "only" ? semanticSentence("only") : (TEXT.localeCode === "sv" ? "P kräver Q." : "P requires Q."))], [choiceField("answer", t("generated.question", "Answer"), correct, options)], familyById(id).learn.concept, mode + ":" + r.int(0,2), { formulaAst: correct === "P-Q" ? imp(P,Q) : imp(Q,P) });

    case "evaluate_formula_assignment":
      source = level === 1 ? r.pick([not(P),and(P,Q),or(P,Q)]) : level < 4 ? r.pick([imp(P,Q),iff(P,Q),or(imp(P,Q),and(Q,R))]) : imp(p.a, or(p.b,p.c)); vars = propVars(source); env = {}; vars.forEach(function (name) { env[name] = r.bool(); });
      return output(title("truthValue"), [block("note", t("generated.assignment", "Assignment") + ": " + assignmentText(env)), block("formula", propText(source))], [tfField(propEval(source,env))], familyById(id).learn.concept, propText(source) + ":" + assignmentText(env), { formulaAst: source, assignment: env });
    case "connective_missing_value":
      form = r.pick(["and-left", "or-right", "imp-left", "imp-right", "iff-left"]); var known = r.bool(), result = r.bool(), works = [false,true].filter(function (missing) { if(form==="and-left")return (missing&&known)===result;if(form==="or-right")return (known||missing)===result;if(form==="imp-left")return (!missing||known)===result;if(form==="imp-right")return (!known||missing)===result;return(missing===known)===result; });
      var expression = form==="and-left"?"? ∧ "+(known?"T":"F"):form==="or-right"?(known?"T":"F")+" ∨ ?":form==="imp-left"?"? → "+(known?"T":"F"):form==="imp-right"?(known?"T":"F")+" → ?":"? ↔ "+(known?"T":"F"); correct=works.length===2?"N":works[0]?"T":"F";
      return output(title("missing"), [block("formula", expression + " = " + (result?"T":"F"))], [choiceField("answer", t("generated.question","Answer"),correct,[["T",t("generated.determinedT","Determined: T")],["F",t("generated.determinedF","Determined: F")],["N",t("generated.notDetermined","Not determined")]])], familyById(id).learn.concept, form+":"+known+":"+result, { candidates:works });
    case "truth_table_column":
      source = level < 2 ? r.pick([and(P,Q),or(P,Q)]) : level < 4 ? r.pick([imp(P,Q),iff(P,Q),or(not(P),Q)]) : imp(or(P,Q),and(not(P),R)); vars=propVars(source); column=truthColumn(source,vars).map(function(v){return v?"T":"F";}).join(","); options=shuffledUnique(r,[column,column.split(",").map(function(v){return v==="T"?"F":"T";}).join(","),column.split(",").reverse().join(","),truthColumn(or(P,Q),vars.slice(0,2)).map(function(v){return v?"T":"F";}).join(",")]).map(function(v){return[v,v];});
      return output(title("completeColumn"), [block("note", vars.join(", ")+" · "+(TEXT.localeCode==="sv"?"radordning T före F":"row order T before F")), block("formula",propText(source))], [choiceField("answer",t("generated.question","Answer"),column,options)], familyById(id).learn.concept,propText(source)+":"+r.int(0,2),{formulaAst:source,vars:vars,column:column});
    case "classify_formula":
      variants=[{a:or(P,not(P)),c:"tautology"},{a:and(P,not(P)),c:"contradiction"},{a:imp(P,Q),c:"contingency"},{a:iff(and(P,Q),and(Q,P)),c:"tautology"},{a:and(imp(P,Q),imp(Q,P)),c:"contingency"}]; var cv=variants[(r.int(0,99)+level)%variants.length];
      return output(title("classify"),[block("formula",propText(cv.a))],[choiceField("answer",t("generated.question","Answer"),cv.c,[["tautology",t("generated.tautology","Tautology")],["contradiction",t("generated.contradiction","Contradiction")],["contingency",t("generated.contingency","Contingency")]])],familyById(id).learn.concept,propText(cv.a)+":"+r.int(0,2),{formulaAst:cv.a,truthColumn:truthColumn(cv.a)});
    case "satisfying_assignment":
      source=level<2?and(P,Q):level<4?imp(P,Q):imp(or(P,Q),and(R,not(P))); vars=propVars(source); mode=r.bool(); values=truthRows(vars).filter(function(e){return propEval(source,e)===mode;}); options=envOptions(vars);
      return output(title("satisfy"),[block("note",mode?(TEXT.localeCode==="sv"?"Gör formeln sann":"Make the formula true"):(TEXT.localeCode==="sv"?"Gör formeln falsk":"Make the formula false")),block("formula",propText(source))],[choiceField("answer",t("generated.assignment","Assignment"),assignmentText(values[0]),options,values.map(assignmentText))],familyById(id).learn.concept,propText(source)+":"+mode+":"+r.int(0,2),{formulaAst:source,acceptedAssignments:values});
    case "premise_set_consistency":
      premises=r.bool()?(level<3?[imp(P,Q),P,not(Q)]:[or(P,Q),imp(P,R),imp(Q,R),not(R)]):(level<3?[P,Q]:[or(P,Q),not(P)]); correct=truthRows(["P","Q","R"]).some(function(e){return premises.every(function(x){return propEval(x,e);});});
      return output(title("consistent"),[block("formula",premises.map(propText).join("\n"))],[choiceField("answer",t("generated.question","Answer"),correct?"yes":"no",[["yes",t("generated.consistentYes","Consistent")],["no",t("generated.consistentNo","Inconsistent")]])],familyById(id).learn.concept,premises.map(propText).join(";")+":"+r.int(0,2),{premiseAsts:premises});

    case "negate_formula":
      source=level<2?r.pick([and(P,Q),or(P,Q)]):level<4?r.pick([imp(P,Q),iff(P,Q)]):imp(or(P,Q),R); target=not(source);
      return output(title("negate"),[block("formula","¬("+propText(source)+")")],[formulaField("answer",t("generated.formula","Formula"),target,"equivalent")],familyById(id).learn.concept,propText(source)+":"+r.int(0,2),{formulaAst:source,targetAst:target});
    case "conditional_forms":
      source=imp(p.a,p.b); form=r.pick(["converse","inverse","contrapositive"]); target=form==="converse"?imp(p.b,p.a):form==="inverse"?imp(not(p.a),not(p.b)):imp(not(p.b),not(p.a));
      return output(title("conditionalForm"),[block("note",conditionalFormName(form)),block("formula",propText(source))],[formulaField("answer",t("generated.formula","Formula"),target,"ast")],familyById(id).learn.concept,form+":"+propText(source)+":"+r.int(0,2),{formulaAst:source,targetAst:target,form:form});
    case "equivalent_rewrite":
      variants=[{s:not(not(P)),a:P},{s:imp(P,Q),a:or(not(P),Q)},{s:not(and(P,Q)),a:or(not(P),not(Q))},{s:or(P,and(P,Q)),a:P}]; var rw=variants[(r.int(0,99)+level)%Math.min(variants.length,level+1)]; options=shuffledUnique(r,[rw.a,imp(Q,P),and(not(P),Q),not(rw.a)]).slice(0,4);
      return output(title("rewrite"),[block("formula",propText(rw.s))],[choiceField("answer",t("generated.formula","Formula"),astKey(rw.a),formulaOptions(options))],familyById(id).learn.concept,propText(rw.s)+":"+r.int(0,2),{formulaAst:rw.s,targetAst:rw.a});
    case "equivalence_decision":
      variants=[{a:imp(P,Q),b:or(not(P),Q)},{a:imp(P,Q),b:imp(Q,P)},{a:not(and(P,Q)),b:or(not(P),not(Q))},{a:not(and(P,Q)),b:and(not(P),not(Q))},{a:not(iff(P,Q)),b:and(or(P,Q),not(and(P,Q)))}]; var ed=variants[(r.int(0,99)+level)%variants.length]; correct=equivalent(ed.a,ed.b);
      return output(title("equivalent"),[block("formula",propText(ed.a)+"\n≟\n"+propText(ed.b))],[yesNoField(correct)],familyById(id).learn.concept,propText(ed.a)+":"+propText(ed.b)+":"+r.int(0,2),{leftAst:ed.a,rightAst:ed.b,counterAssignments:counterRows(ed.a,ed.b)});
    case "equivalence_counterassignment":
      variants=[{a:imp(P,Q),b:imp(Q,P)},{a:not(and(P,Q)),b:and(not(P),not(Q))},{a:or(P,and(Q,R)),b:and(or(P,Q),R)}]; var ec=variants[(r.int(0,99)+level)%variants.length]; vars=Array.from(new Set(propVars(ec.a).concat(propVars(ec.b)))).sort(); values=counterRows(ec.a,ec.b);
      return output(title("counterassignment"),[block("formula",propText(ec.a)+"\n≠\n"+propText(ec.b))],[choiceField("answer",t("generated.assignment","Assignment"),assignmentText(values[0]),envOptions(vars),values.map(assignmentText))],familyById(id).learn.concept,propText(ec.a)+":"+r.int(0,2),{leftAst:ec.a,rightAst:ec.b,acceptedAssignments:values});
    case "normal_form_conversion":
      variants=[{s:imp(P,Q),a:or(not(P),Q)},{s:not(or(P,Q)),a:and(not(P),not(Q))},{s:and(imp(P,Q),imp(R,P)),a:and(or(not(P),Q),or(not(R),P))}]; var nf=variants[(r.int(0,99)+level)%variants.length];
      return output(title("normalForm"),[block("note","CNF"),block("formula",propText(nf.s))],[formulaField("answer",t("generated.formula","Formula"),nf.a,"cnf")],familyById(id).learn.concept,propText(nf.s)+":"+r.int(0,2),{formulaAst:nf.s,targetAst:nf.a,requiredForm:"CNF"});

    case "infer_rule_conclusion":
    case "identify_inference_rule":
    case "complete_argument":
    case "argument_validity":
    case "argument_countermodel":
    case "valid_form_or_fallacy":
    case "symbolized_natural_argument":
      return argumentScenario(id,level,r,p);
    case "justify_proof_line":
    case "choose_next_proof_step":
    case "fill_proof_gap":
    case "order_proof_steps":
    case "assumption_discharge":
      return proofScenario(id,level,r);
    default:
      return quantifierScenario(id,level,r);
    }
  }

  function argumentScenario(id, level, r, p) {
    var A=p.a,B=p.b,C=p.c,schemas=[
      {name:inferenceName("MP"),short:"MP",premises:[imp(A,B),A],conclusion:B,valid:true},
      {name:inferenceName("MT"),short:"MT",premises:[imp(A,B),not(B)],conclusion:not(A),valid:true},
      {name:inferenceName("AC"),short:"AC",premises:[imp(A,B),B],conclusion:A,valid:false},
      {name:inferenceName("DA"),short:"DA",premises:[imp(A,B),not(A)],conclusion:not(B),valid:false},
      {name:inferenceName("HS"),short:"HS",premises:[imp(A,B),imp(B,C)],conclusion:imp(A,C),valid:true},
      {name:inferenceName("DS"),short:"DS",premises:[or(A,B),not(A)],conclusion:B,valid:true}
    ];
    var available=schemas.slice(0,Math.min(schemas.length,2+level)),schema=available[r.int(0,available.length-1)], options, counters=argumentCountermodels(schema.premises,schema.conclusion), labels=schemas.map(function(x){return[x.short,x.name];});
    if(id==="infer_rule_conclusion")return output(title("infer"),[block("formula",schema.premises.map(propText).join("\n"))],[choiceField("answer",t("generated.conclusion","Conclusion"),astKey(schema.conclusion),formulaOptions(shuffledUnique(r,[schema.conclusion,A,B,not(A),not(B),imp(A,C)]).slice(0,4)))],familyById(id).learn.concept,schema.short+":"+propText(A)+":"+r.int(0,2),{premiseAsts:schema.premises,conclusionAst:schema.conclusion,ruleId:schema.short});
    if(id==="identify_inference_rule")return output(title("identifyRule"),[block("formula",argumentText(schema.premises,schema.conclusion))],[choiceField("answer",t("generated.question","Answer"),schema.short,labels)],familyById(id).learn.concept,schema.short+":"+propText(A)+":"+r.int(0,2),{ruleId:schema.short});
    if(id==="complete_argument"){var missing=schema.premises[1],shown=[schema.premises[0]];return output(title("completeArgument"),[block("note",schema.name),block("formula",propText(shown[0])+"\n?\n∴ "+propText(schema.conclusion))],[choiceField("answer",t("generated.formula","Formula"),astKey(missing),formulaOptions(shuffledUnique(r,[missing,A,B,not(A),not(B)]).slice(0,4)))],familyById(id).learn.concept,schema.short+":"+propText(A)+":"+r.int(0,2),{ruleId:schema.short,missingAst:missing});}
    if(id==="argument_validity")return output(title("validity"),[block("formula",argumentText(schema.premises,schema.conclusion))],[yesNoField(schema.valid)],familyById(id).learn.concept,schema.short+":"+propText(A)+":"+r.int(0,2),{premiseAsts:schema.premises,conclusionAst:schema.conclusion,countermodels:counters});
    if(id==="argument_countermodel"){if(schema.valid)schema=schemas[r.bool()?2:3];counters=argumentCountermodels(schema.premises,schema.conclusion);if(!counters.length){var fixedP=atom("P"),fixedQ=atom("Q");schema={name:inferenceName("AC"),short:"AC",premises:[imp(fixedP,fixedQ),fixedQ],conclusion:fixedP,valid:false};counters=argumentCountermodels(schema.premises,schema.conclusion);}var vars=Array.from(new Set(schema.premises.flatMap(function (premise) { return propVars(premise); }).concat(propVars(schema.conclusion)))).sort();return output(title("countermodel"),[block("formula",argumentText(schema.premises,schema.conclusion))],[choiceField("answer",t("generated.assignment","Assignment"),assignmentText(counters[0]),envOptions(vars),counters.map(assignmentText))],familyById(id).learn.concept,schema.short+":"+propText(schema.premises[0])+":"+r.int(0,2),{premiseAsts:schema.premises,conclusionAst:schema.conclusion,countermodels:counters});}
    if(id==="valid_form_or_fallacy")return output(title("classifyForm"),[block("formula",argumentText(schema.premises,schema.conclusion))],[choiceField("answer",t("generated.question","Answer"),schema.short,labels)],familyById(id).learn.concept,schema.short+":"+propText(A)+":"+r.int(0,2),{ruleId:schema.short,valid:schema.valid});
    var natural=(TEXT.localeCode==="sv"?"Om P så Q. ":"If P, then Q. ")+(schema.short==="MP"?(TEXT.localeCode==="sv"?"P. Alltså Q.":"P. Therefore Q."):schema.short==="MT"?(TEXT.localeCode==="sv"?"Inte Q. Alltså inte P.":"Not Q. Therefore not P."):(TEXT.localeCode==="sv"?"Q. Alltså P.":"Q. Therefore P."));
    return output(title("naturalArgument"),[block("note",natural),block("formula",argumentText(schema.premises,schema.conclusion))],[choiceField("answer",t("generated.question","Answer"),schema.valid?"valid":"invalid",[["valid",t("generated.valid","Valid")],["invalid",t("generated.invalid","Invalid")]])],familyById(id).learn.concept,schema.short+":"+r.int(0,3),{premiseAsts:schema.premises,conclusionAst:schema.conclusion,valid:schema.valid});
  }

  function proofScenario(id, level, r) {
    var P=atom("P"),Q=atom("Q"),R=atom("R"), variant=(r.int(0,99)+level)%3, lines, answer, options;
    function directProof(kind){if(kind===0)return[{formula:and(P,Q),rule:"premise",citations:[],scopePath:[]},{formula:P,rule:"andE",citations:[0],scopePath:[]}];if(kind===1)return[{formula:imp(P,Q),rule:"premise",citations:[],scopePath:[]},{formula:P,rule:"premise",citations:[],scopePath:[]},{formula:Q,rule:"impE",citations:[0,1],scopePath:[]}];return[{formula:P,rule:"premise",citations:[],scopePath:[]},{formula:Q,rule:"premise",citations:[],scopePath:[]},{formula:and(P,Q),rule:"andI",citations:[0,1],scopePath:[]}];}
    function dischargeProof(kind){if(kind===0)return[{formula:Q,rule:"premise",citations:[],scopePath:[]},{formula:P,rule:"assumption",citations:[],scopePath:[1]},{formula:and(P,Q),rule:"andI",citations:[1,0],scopePath:[1]},{formula:Q,rule:"andE",citations:[2],scopePath:[1]},{formula:imp(P,Q),rule:"impI",citations:[],scopePath:[],range:{start:1,end:3}}];if(kind===1)return[{formula:not(P),rule:"premise",citations:[],scopePath:[]},{formula:P,rule:"assumption",citations:[],scopePath:[1]},{formula:bottom(),rule:"notE",citations:[1,0],scopePath:[1]},{formula:not(P),rule:"notI",citations:[],scopePath:[],range:{start:1,end:2}}];return[{formula:imp(P,Q),rule:"premise",citations:[],scopePath:[]},{formula:imp(Q,P),rule:"premise",citations:[],scopePath:[]},{formula:P,rule:"assumption",citations:[],scopePath:[1]},{formula:Q,rule:"impE",citations:[0,2],scopePath:[1]},{formula:Q,rule:"assumption",citations:[],scopePath:[2]},{formula:P,rule:"impE",citations:[1,4],scopePath:[2]},{formula:iff(P,Q),rule:"iffI",citations:[],scopePath:[],ranges:[{start:2,end:3},{start:4,end:5}]}];}
    if(id==="justify_proof_line"){
      lines=localizeProofLines(variant===0?["P ∧ Q    Premise","P          ?"]:variant===1?["P → Q    Premise","P          Premise","Q          ?"]:["P          Premise","Q          Premise","P ∧ Q      ?"]);
      answer=variant===0?"andE":variant===1?"impE":"andI"; options=[["andE","∧E, 1"],["impE","→E, 1,2"],["andI","∧I, 1,2"],["invalid",TEXT.localeCode==="sv"?"Ogiltig referens":"Invalid citation"]];
      var proof=directProof(variant);return output(title("justify"),[block("proof",proofText(lines))],[choiceField("answer",t("generated.question","Answer"),answer,options)],familyById(id).learn.concept,answer+":"+r.int(0,3),{proofState:{lines:proof,target:proof.length-1,validated:validateProof(proof)}});
    }
    if(id==="choose_next_proof_step"){
      lines=localizeProofLines(variant===0?["P ∧ Q    Premise","Goal: Q"]:variant===1?["P → Q    Premise","P          Premise","Goal: Q"]:["P → Q","Q → R","P","Goal: R"]);
      answer=variant===0?"Q-andE":variant===1?"Q-impE":"Q-impE"; options=[["Q-andE","Q, ∧E"],["Q-impE","Q, →E"],["P-AC",TEXT.localeCode==="sv"?"P från konsekventen":"P from the consequent"],["R-assume",TEXT.localeCode==="sv"?"Anta R":"Assume R"]];
      var nextProof=variant===2?directProof(1):directProof(variant);return output(title("nextStep"),[block("proof",proofText(lines))],[choiceField("answer",t("generated.question","Answer"),answer,options)],familyById(id).learn.concept,answer+":"+variant+":"+r.int(0,2),{proofState:{lines:nextProof,goal:variant===2?R:Q,validated:validateProof(nextProof)}});
    }
    if(id==="fill_proof_gap"){
      lines=localizeProofLines(variant===0?["P ∧ Q    Premise","?          ∧E 1"]:variant===1?["P → Q    Premise","P          Premise","?          →E 1,2"]:["P → Q","Q → R","P","?          →E","R          →E"]);
      answer=variant===2?Q:(variant===1?Q:P); options=formulaOptions(shuffledUnique(r,[answer,P,Q,R,not(P)]).slice(0,4));
      var gapProof=directProof(variant===2?1:variant);return output(title("proofGap"),[block("proof",proofText(lines))],[choiceField("answer",t("generated.formula","Formula"),astKey(answer),options)],familyById(id).learn.concept,astKey(answer)+":"+variant+":"+r.int(0,2),{proofState:{lines:gapProof,missingAst:answer,validated:validateProof(gapProof)}});
    }
    if(id==="order_proof_steps"){
      options=[["Q,R",TEXT.localeCode==="sv"?"Härled Q; härled sedan R":"Derive Q; then derive R"],["R,Q",TEXT.localeCode==="sv"?"Härled R; härled sedan Q":"Derive R; then derive Q"],["R",TEXT.localeCode==="sv"?"Härled bara R":"Derive only R"]];
      var orderProof=[{formula:P,rule:"premise",citations:[],scopePath:[]},{formula:imp(P,Q),rule:"premise",citations:[],scopePath:[]},{formula:imp(Q,R),rule:"premise",citations:[],scopePath:[]},{formula:Q,rule:"impE",citations:[1,0],scopePath:[]},{formula:R,rule:"impE",citations:[2,3],scopePath:[]}];return output(title("proofOrder"),[block("proof",proofText(["P","P → Q","Q → R",TEXT.localeCode==="sv"?"Ordna de härledda raderna Q och R":"Order the derived lines Q and R"]))],[choiceField("answer",t("generated.question","Answer"),"Q,R",options)],familyById(id).learn.concept,"chain:"+variant+":"+r.int(0,2),{proofState:{lines:orderProof,dependencies:{Q:["P","P→Q"],R:["Q","Q→R"]},validated:validateProof(orderProof)}});
    }
    answer=variant===0?imp(P,Q):variant===1?not(P):iff(P,Q); options=shuffledUnique(r,[answer,imp(Q,P),Q,not(Q)]).slice(0,4);
    lines=localizeProofLines(variant===0?["Assume P","…","Q"]:variant===1?["Assume P","…","⊥"]:["Assume P … Q","Assume Q … P"]);
    var discharged=dischargeProof(variant);return output(title("discharge"),[block("proof",proofText(lines))],[choiceField("answer",t("generated.formula","Formula"),astKey(answer),formulaOptions(options))],familyById(id).learn.concept,astKey(answer)+":"+r.int(0,3),{proofState:{lines:discharged,dischargedConclusion:answer,validated:validateProof(discharged)}});
  }

  function modelBlock(model) {
    var lines=[t("generated.domain","Domain")+": {"+model.domain.join(",")+"}"];
    Object.keys(model.predicates).forEach(function(name){var ext=model.predicates[name];lines.push(name+"={"+ext.map(function(x){return Array.isArray(x)?"("+x.join(",")+")":x;}).join(",")+"}");});
    return block("model",lines.join("\n"));
  }
  function quantifierScenario(id, level, r) {
    var P=pred("P","x"),A=pred("A","x"),B=pred("B","x"),sentence,correct,options,model,formula,values,first,second;
    if(id==="symbolize_quantified_sentence"){
      var kind=r.pick(level<4?["every","someNot"]:["every","someNot","relSome"]); correct=kind==="every"?"∀x(A(x)→B(x))":kind==="someNot"?"∃x(A(x)∧¬B(x))":"∀x(A(x)→∃y(B(y)∧R(x,y)))"; sentence=kind==="every"?t("generated.sentenceEvery","Every A is B."):kind==="someNot"?t("generated.sentenceSomeNot","Some A is not B."):t("generated.sentenceEveryRelSome","Every A relates to some B."); options=[["∀x(A(x)→B(x))","∀x(A(x)→B(x))"],["∀x(A(x)∧B(x))","∀x(A(x)∧B(x))"],["∃x(A(x)∧¬B(x))","∃x(A(x)∧¬B(x))"],["∀x(A(x)→∃y(B(y)∧R(x,y)))","∀x(A(x)→∃y(B(y)∧R(x,y)))"]];
      return output(title("quantify"),[block("note",sentence)],[choiceField("answer",t("generated.formula","Formula"),correct,options)],familyById(id).learn.concept,kind+":"+r.int(0,3),{formulaText:correct});
    }
    if(id==="negate_quantified_formula"){
      var neg=r.pick(level<3?["all","some"]:["all","some","nested"]); var shown=neg==="all"?"¬∀x P(x)":neg==="some"?"¬∃x P(x)":"¬∀x∃y R(x,y)"; correct=neg==="all"?"∃x¬P(x)":neg==="some"?"∀x¬P(x)":"∃x∀y¬R(x,y)"; options=[["∃x¬P(x)","∃x¬P(x)"],["∀x¬P(x)","∀x¬P(x)"],["∀x∃y¬R(x,y)","∀x∃y¬R(x,y)"],["∃x∀y¬R(x,y)","∃x∀y¬R(x,y)"]];
      return output(title("quantifierNegation"),[block("formula",shown)],[choiceField("answer",t("generated.formula","Formula"),correct,options)],familyById(id).learn.concept,neg+":"+r.int(0,3),{formulaText:shown,targetText:correct});
    }
    if(id==="evaluate_unary_model" || id==="witness_or_counterexample"){
      var domain=level<3?["a","b","c"]:["a","b","c","d"], ext=r.shuffle(domain).slice(0,r.int(0,domain.length)); model={domain:domain,constants:{},predicates:{P:ext,A:r.shuffle(domain).slice(0,r.int(0,domain.length)),B:r.shuffle(domain).slice(0,r.int(0,domain.length))}}; var existential=r.bool(); formula=existential?some("x",P):all("x",P);
      if(id==="evaluate_unary_model")return output(title("evaluateModel"),[modelBlock(model),block("formula",folText(formula))],[tfField(folEval(formula,model))],familyById(id).learn.concept,folText(formula)+":"+ext.join("")+":"+r.int(0,2),{domainModel:model,formulaAst:formula});
      values=domain.filter(function(x){return existential?ext.includes(x):!ext.includes(x);}); options=domain.map(function(x){return[x,x];});options.push(["none",t("generated.noWitness","None")]);correct=values.length?values[0]:"none";
      return output(title("witness"),[modelBlock(model),block("formula",folText(formula))],[choiceField("answer",t("generated.question","Answer"),correct,options,values.length?values:["none"])],familyById(id).learn.concept,folText(formula)+":"+ext.join("")+":"+r.int(0,2),{domainModel:model,formulaAst:formula,acceptedElements:values});
    }
    if(id==="evaluate_relation_model" || id==="quantifier_order_contrast"){
      var d=level<4?["a","b","c"]:["a","b","c","d"], pairs=[];d.forEach(function(x,i){if(r.bool()||i===0)pairs.push([x,d[(i+1+r.int(0,d.length-2))%d.length]]);});model={domain:d,constants:{},predicates:{R:pairs}};first=all("x",some("y",rel("R","x","y")));second=some("y",all("x",rel("R","x","y")));
      if(id==="evaluate_relation_model"){formula=r.bool()?first:second;return output(title("evaluateModel"),[modelBlock(model),block("formula",folText(formula))],[tfField(folEval(formula,model))],familyById(id).learn.concept,folText(formula)+":"+pairs.map(function(x){return x.join("");}).join("-")+":"+r.int(0,2),{domainModel:model,formulaAst:formula});}
      correct=(folEval(first,model)?"T":"F")+","+(folEval(second,model)?"T":"F");options=[["T,T","T, T"],["T,F","T, F"],["F,T","F, T"],["F,F","F, F"]];return output(title("compareOrder"),[modelBlock(model),block("formula",folText(first)+"\n"+folText(second))],[choiceField("answer",t("generated.question","Answer"),correct,options)],familyById(id).learn.concept,correct+":"+pairs.map(function(x){return x.join("");}).join("-")+":"+r.int(0,2),{domainModel:model,formulaA:first,formulaB:second});
    }
    if(id==="quantified_inference"){
      var qi=r.pick(["ui","eg","bad"]); var shown=qi==="ui"?"∀x(A(x)→B(x)), A(a) ∴ ?":qi==="eg"?"P(a) ∴ ?":"∃xP(x) ∴ ?";correct=qi==="ui"?"B(a)":qi==="eg"?"∃xP(x)":"No specific P(a) follows";options=[["B(a)","B(a)"],["∃xP(x)","∃xP(x)"],["P(a)","P(a)"],["No specific P(a) follows",TEXT.localeCode==="sv"?"Inget bestämt P(a) följer":"No specific P(a) follows"]];return output(title("quantifiedInference"),[block("formula",shown)],[choiceField("answer",t("generated.conclusion","Conclusion"),correct,options)],familyById(id).learn.concept,qi+":"+r.int(0,4),{schemaId:qi});
    }
    var cat=r.pick(["chain","existentialTrap","disjoint"]),valid=cat!=="existentialTrap";var text=cat==="chain"?(TEXT.localeCode==="sv"?"Varje A är B. Varje B är C. Alltså är varje A C.":"Every A is B. Every B is C. Therefore every A is C."):cat==="existentialTrap"?(TEXT.localeCode==="sv"?"Varje A är B. Något B är C. Alltså är något A C.":"Every A is B. Some B is C. Therefore some A is C."):(TEXT.localeCode==="sv"?"Inget A är B. Något C är A. Alltså är något C inte B.":"No A is B. Some C is A. Therefore some C is not B.");
    return output(title("categorical"),[block("note",t("generated.modernSemantics","Modern semantics")),block("formula",text)],[yesNoField(valid)],familyById(id).learn.concept,cat+":"+r.int(0,4),{schemaId:cat,valid:valid});
  }

  function canonicalFromFields(fields) { var out={}; fields.forEach(function(field){out[field.id]=field.answer;}); return out; }
  function expectedText(fields) { return fields.map(function(field){var option=(field.options||[]).find(function(item){return item.value===String(field.answer);});return field.label+": "+(option?option.label:field.answer);}).join("; "); }
  function generateQuestion(familyId, level, seed) {
    var family=familyById(familyId),safeLevel=Math.max(1,Math.min(5,Number(level)||1)),data=scenario(family.id,safeLevel,new Rng(seed));if(!data)throw new Error("Missing logic scenario: "+family.id);
    var canonical=canonicalFromFields(data.fields),explanation=t("generated.worked","Decisive reasoning:")+" "+data.explanation;
    return {familyId:family.id,categoryId:family.categoryId,level:safeLevel,prompt:{title:data.title,blocks:data.blocks,note:t("generated.question","Choose or enter the exact answer.")},fields:data.fields,canonicalAnswer:canonical,expectedText:expectedText(data.fields),explanation:explanation,structuralSignature:family.id+":"+data.signature,metadata:{modelId:MODEL_ID,oracleVersion:ORACLE_VERSION,formulaAst:data.semantic.formulaAst||null,premiseAsts:data.semantic.premiseAsts||null,conclusionAst:data.semantic.conclusionAst||null,domainModel:data.semantic.domainModel||null,proofState:data.semantic.proofState||null,canonicalAnswer:canonical,equivalenceMode:data.fields.some(function(f){return f.mode==="equivalent"||f.mode==="cnf";}),difficultyDimensions:["level-"+safeLevel,family.categoryId],misconceptionsTargeted:[family.id],workedSolution:explanation,structuralSignature:data.signature,notationVersion:"logic-notation-v1",oracleVersion:ORACLE_VERSION,semantic:data.semantic}};
  }
  function checkQuestion(answers, question) {
    try {
      var correct=question.fields.every(function(field){var value=String(answers&&answers[field.id]!==undefined?answers[field.id]:"").trim();if(field.kind==="choice")return field.accepted.includes(value);var parsed=parseFormula(value);if(!parsed)return false;if(field.mode==="equivalent")return equivalent(parsed,field.target);if(field.mode==="cnf")return equivalent(parsed,field.target)&&isCnf(parsed);return sameAst(parsed,field.target);});
      return {correct:correct,expectedText:question.expectedText};
    } catch(error){return{correct:false,expectedText:question.expectedText};}
  }

  function defaultStat(){return{attempts:0,correct:0,totalMs:0,streak:0,recent:[],mastery:0};}
  function defaultProgress(){var enabled={};CATEGORIES.forEach(function(c){enabled[c.id]=true;});return{version:1,view:"practice",settings:{adaptive:true,enabled:enabled},manual:{familyId:FAMILIES[0].id,level:1},stats:{}};}
  function mergeProgress(raw){var out=defaultProgress();if(!raw||typeof raw!=="object")return out;if(["practice","matrix","stats","settings","learn"].includes(raw.view))out.view=raw.view;if(raw.settings&&typeof raw.settings==="object"){out.settings.adaptive=raw.settings.adaptive!==false;CATEGORIES.forEach(function(c){if(raw.settings.enabled&&raw.settings.enabled[c.id]===false)out.settings.enabled[c.id]=false;});}if(raw.manual&&familyById(raw.manual.familyId).id===raw.manual.familyId){out.manual.familyId=raw.manual.familyId;out.manual.level=Math.max(1,Math.min(5,Number(raw.manual.level)||1));}if(raw.stats&&typeof raw.stats==="object")Object.keys(raw.stats).forEach(function(key){var item=raw.stats[key];if(!item||typeof item!=="object")return;var parts=key.split(":"),family=FAMILIES.find(function(f){return f.id===parts[0];}),level=Number(parts[1]);if(!family||!family.levels.includes(level))return;out.stats[key]={attempts:Math.max(0,Number(item.attempts)||0),correct:Math.max(0,Number(item.correct)||0),totalMs:Math.max(0,Number(item.totalMs)||0),streak:Math.max(0,Number(item.streak)||0),recent:Array.isArray(item.recent)?item.recent.slice(-10).map(Boolean):[],mastery:Math.max(0,Math.min(100,Number(item.mastery)||0))};});return out;}
  function loadProgress(){return mergeProgress(PracticeLabUI.readJson(STORAGE_KEY,null));}
  function saveProgress(){PracticeLabUI.writeJson(STORAGE_KEY,progress);}
  function getStat(familyId,level){var key=familyId+":"+level;if(!progress.stats[key])progress.stats[key]=defaultStat();return progress.stats[key];}
  function updateMastery(stat){var recent=stat.recent.length?stat.recent.filter(Boolean).length/stat.recent.length:0,evidence=Math.min(1,stat.attempts/5);stat.mastery=Math.round(100*recent*evidence);}
  function aggregate(){var out={attempts:0,correct:0,totalMs:0,practiced:0,masteryTotal:0};Object.values(progress.stats).forEach(function(s){out.attempts+=s.attempts;out.correct+=s.correct;out.totalMs+=s.totalMs;if(s.attempts){out.practiced+=1;out.masteryTotal+=s.mastery;}});return out;}
  function adaptiveCell(){var enabled=CATEGORIES.filter(function(c){return progress.settings.enabled[c.id]!==false;}).map(function(c){return c.id;});if(!enabled.length)enabled=CATEGORIES.map(function(c){return c.id;});var cells=[];FAMILIES.filter(function(f){return enabled.includes(f.categoryId);}).forEach(function(f){var unlocked=PracticeLabUI.unlockedLevels(f.levels,function(level){return getStat(f.id,level);});var level=unlocked[unlocked.length-1]||f.levels[0],s=getStat(f.id,level);cells.push({family:f,level:level,score:(s.attempts===0?-1000:s.mastery)+rng.int(0,14)});});cells.sort(function(a,b){return a.score-b.score;});return cells[rng.int(0,Math.min(3,cells.length-1))]||{family:FAMILIES[0],level:1};}
  function nextSeed(){return rng.next();}
  function startQuestion(){var cell=progress.settings.adaptive?adaptiveCell():{family:familyById(progress.manual.familyId),level:progress.manual.level};var question,tries=0;do{question=generateQuestion(cell.family.id,cell.level,nextSeed());tries+=1;}while(recentSignatures.includes(question.structuralSignature)&&tries<12);recentSignatures.push(question.structuralSignature);recentSignatures=recentSignatures.slice(-12);currentQuestion=question;submitted=false;isPaused=false;pausedMs=0;pauseStartedAt=0;currentStartedAt=Date.now();renderQuestion();renderPracticeControls();renderCurrentMetrics();saveProgress();}
  function elapsedMs(){return Math.max(0,(isPaused?pauseStartedAt:Date.now())-currentStartedAt-pausedMs);}

  function renderPrompt(prompt){var container=document.getElementById("questionPrompt");container.replaceChildren();var heading=document.createElement("div");heading.className="prompt-title";heading.textContent=prompt.title;container.appendChild(heading);prompt.blocks.forEach(function(item){if(item.kind==="table"){var wrap=document.createElement("div"),table=document.createElement("table");wrap.className="logic-table-wrap";table.className="logic-table";(item.rows||[]).forEach(function(row,index){var tr=document.createElement("tr");row.forEach(function(value){var cell=document.createElement(index===0?"th":"td");cell.textContent=value;tr.appendChild(cell);});table.appendChild(tr);});wrap.appendChild(table);container.appendChild(wrap);}else{var element=document.createElement(item.kind==="formula"||item.kind==="proof"?"pre":"div");element.className="logic-block "+(item.kind==="formula"?"logic-formula":item.kind==="proof"?"logic-proof":item.kind==="model"?"logic-model":"");element.textContent=item.text;container.appendChild(element);}});if(prompt.note){var note=document.createElement("div");note.className="prompt-note";note.textContent=prompt.note;container.appendChild(note);}}
  function renderAnswerControls(){var container=document.getElementById("answerFields");container.replaceChildren();activeAnswerInput=null;currentQuestion.fields.forEach(function(field,index){var wrap=document.createElement("div"),label=document.createElement("label");wrap.className="answer-field";label.textContent=field.label;label.htmlFor="answer-"+field.id;wrap.appendChild(label);var control;if(field.kind==="choice"){control=document.createElement("select");var empty=document.createElement("option");empty.value="";empty.textContent=t("practice.choose","Choose…");control.appendChild(empty);field.options.forEach(function(option){var item=document.createElement("option");item.value=option.value;item.textContent=option.label;control.appendChild(item);});}else{control=document.createElement("input");control.type="text";control.inputMode="none";control.autocomplete="off";control.spellcheck=false;control.className="logic-formula";}control.id="answer-"+field.id;control.dataset.answerField=field.id;control.addEventListener("focus",function(){setActiveInput(control);});control.addEventListener("pointerdown",function(){setActiveInput(control);});wrap.appendChild(control);container.appendChild(wrap);if(index===0&&field.kind!=="choice")activeAnswerInput=control;});updateKeypad();}
  function setActiveInput(input){if(!input||input.tagName!=="INPUT")return;activeAnswerInput=input;document.querySelectorAll(".answer-field").forEach(function(item){item.classList.toggle("active-target",item.contains(input));});updateKeypad();}
  function textInputs(){return Array.from(document.querySelectorAll('input[data-answer-field]:not([disabled])'));}
  function nextInput(){var inputs=textInputs();if(!inputs.length)return;var index=Math.max(0,inputs.indexOf(activeAnswerInput));setActiveInput(inputs[(index+1)%inputs.length]);if(window.matchMedia&&window.matchMedia("(pointer: fine)").matches)inputs[(index+1)%inputs.length].focus();}
  function updateKeypad(){if(!keypadButtons)return;var visible=currentQuestion&&currentQuestion.fields.some(function(f){return f.kind!=="choice";});document.getElementById("answerKeypad").classList.toggle("hidden",!visible);var editable=visible&&!submitted&&!isPaused;["atomP","atomQ","atomR","atomS","not","and","or","imp","iff","leftParen","rightParen","delete","clear"].forEach(function(id){var b=keypadButtons.get(id);if(b)b.disabled=!editable;});keypadButtons.get("nextField").disabled=!editable||textInputs().length<2;keypadButtons.get("submit").disabled=isPaused;}
  function renderQuestion(){var family=familyById(currentQuestion.familyId);document.getElementById("questionCategory").textContent=categoryById(family.categoryId).title;document.getElementById("questionFamily").textContent=family.title;document.getElementById("questionLevel").textContent=t("practice.level","Level")+" "+currentQuestion.level;renderPrompt(currentQuestion.prompt);renderAnswerControls();document.getElementById("feedback").className="feedback hidden";document.getElementById("submitBtn").disabled=false;document.getElementById("submitBtn").innerHTML=PracticeLabUI.escapeHtml(t("practice.check","Check"))+' <span class="key-symbol">↵</span>';document.getElementById("nextBtn").classList.add("hidden");document.getElementById("skipBtn").classList.remove("hidden");keypadButtons.get("submit").textContent=t("practice.check","Check");renderPauseState();}
  function collectAnswers(){var answers={};document.querySelectorAll("[data-answer-field]").forEach(function(element){answers[element.dataset.answerField]=element.value;});return answers;}
  function submitAnswer(event){event.preventDefault();if(!currentQuestion||isPaused)return;if(submitted){startQuestion();return;}var result=checkQuestion(collectAnswers(),currentQuestion),duration=elapsedMs(),stat=getStat(currentQuestion.familyId,currentQuestion.level);stat.attempts+=1;stat.correct+=result.correct?1:0;stat.totalMs+=duration;stat.streak=result.correct?stat.streak+1:0;stat.recent=stat.recent.concat([result.correct]).slice(-10);updateMastery(stat);saveProgress();submitted=true;document.querySelectorAll("[data-answer-field]").forEach(function(element){element.disabled=true;});updateKeypad();document.getElementById("submitBtn").innerHTML=PracticeLabUI.escapeHtml(t("practice.next","Next"))+' <span class="key-symbol">↵</span>';document.getElementById("nextBtn").classList.remove("hidden");document.getElementById("skipBtn").classList.add("hidden");keypadButtons.get("submit").textContent=t("practice.next","Next");var feedback=document.getElementById("feedback");feedback.className="feedback "+(result.correct?"correct":"incorrect");feedback.replaceChildren();var strong=document.createElement("strong");strong.textContent=result.correct?t("messages.correct","Correct"):t("messages.notQuite","Not quite");feedback.appendChild(strong);if(!result.correct){var expected=document.createElement("div");expected.className="expected-code";expected.textContent=t("messages.expected","Expected")+": "+result.expectedText;feedback.appendChild(expected);}var detail=document.createElement("div");detail.className="feedback-detail";detail.textContent=currentQuestion.explanation+" "+t("messages.time","Time")+": "+PracticeLabUI.formatSeconds(duration)+".";feedback.appendChild(detail);renderCurrentMetrics();renderSummary();}
  function pausePractice(){if(isPaused||submitted)return;isPaused=true;pauseStartedAt=Date.now();renderPauseState();}
  function resumePractice(){if(!isPaused)return;pausedMs+=Date.now()-pauseStartedAt;pauseStartedAt=0;isPaused=false;renderPauseState();}
  function renderPauseState(){var main=document.querySelector(".practice-main");if(main)main.classList.toggle("paused",isPaused);document.getElementById("pauseBtn").disabled=isPaused||submitted;updateKeypad();}
  function renderSummary(){var total=aggregate();document.getElementById("summaryMastery").textContent=(total.practiced?Math.round(total.masteryTotal/total.practiced):0)+"%";document.getElementById("summaryAccuracy").textContent=(total.attempts?Math.round(100*total.correct/total.attempts):0)+"%";document.getElementById("summaryAttempts").textContent=total.attempts;}
  function renderCurrentMetrics(){if(!currentQuestion)return;var stat=getStat(currentQuestion.familyId,currentQuestion.level);document.getElementById("currentMastery").textContent=stat.mastery+"%";document.getElementById("currentAccuracy").textContent=(stat.attempts?Math.round(100*stat.correct/stat.attempts):0)+"%";document.getElementById("currentStreak").textContent=stat.streak;document.getElementById("currentAverage").textContent=stat.attempts?PracticeLabUI.formatSeconds(stat.totalMs/stat.attempts):"—";document.getElementById("questionMastery").textContent=stat.mastery+"% "+t("practice.masterySuffix","mastery");}
  function renderPracticeControls(){document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active",progress.settings.adaptive);document.getElementById("manualModeBtn").classList.toggle("secondary-active",!progress.settings.adaptive);if(selectorController)selectorController.render(currentQuestion?{familyId:currentQuestion.familyId,level:currentQuestion.level}:progress.manual);}
  function setManualSelection(familyId,level){progress.settings.adaptive=false;progress.manual.familyId=familyById(familyId).id;progress.manual.level=Math.max(1,Math.min(5,Number(level)||1));saveProgress();startQuestion();}
  function renderMatrix(){var container=document.getElementById("matrix");container.replaceChildren();var table=document.createElement("table"),head=document.createElement("thead"),hr=document.createElement("tr"),blank=document.createElement("th");blank.textContent=t("practice.family","Question family");hr.appendChild(blank);LEVELS.forEach(function(level){var th=document.createElement("th");th.textContent="L"+level;hr.appendChild(th);});head.appendChild(hr);table.appendChild(head);var body=document.createElement("tbody");CATEGORIES.forEach(function(category){var cr=document.createElement("tr"),cc=document.createElement("th");cc.colSpan=6;cc.textContent=category.title;cr.appendChild(cc);body.appendChild(cr);FAMILIES.filter(function(f){return f.categoryId===category.id;}).forEach(function(f){var row=document.createElement("tr"),name=document.createElement("td");name.textContent=f.title;row.appendChild(name);LEVELS.forEach(function(level){var stat=getStat(f.id,level),cell=document.createElement("td"),button=document.createElement("button");button.type="button";button.className="level-button "+(stat.mastery>=80?"ready":stat.attempts?"weak":"");button.dataset.familyId=f.id;button.dataset.level=level;button.innerHTML="L"+level+"<br><span>"+stat.mastery+"% · "+stat.attempts+"</span>";cell.appendChild(button);row.appendChild(cell);});body.appendChild(row);});});table.appendChild(body);container.appendChild(table);}
  function renderStats(){var total=aggregate();document.getElementById("statTotalAttempts").textContent=total.attempts;document.getElementById("statTotalCorrect").textContent=total.correct;document.getElementById("statTotalTime").textContent=PracticeLabUI.formatMinutes(total.totalMs);document.getElementById("statActiveCells").textContent=total.practiced;var cells=Object.keys(progress.stats).map(function(key){var parts=key.split(":"),family=FAMILIES.find(function(f){return f.id===parts[0];});return family?{family:family,level:Number(parts[1]),stat:progress.stats[key]}:null;}).filter(function(cell){return cell&&cell.stat.attempts;});cells.sort(function(a,b){return a.stat.mastery-b.stat.mastery;});function fill(id,selected){var container=document.getElementById(id);container.replaceChildren();if(!selected.length){var empty=document.createElement("p");empty.textContent=t("stats.noAttemptsYet","No attempts yet");container.appendChild(empty);return;}selected.forEach(function(cell){var button=document.createElement("button");button.type="button";button.dataset.familyId=cell.family.id;button.dataset.level=cell.level;button.textContent=cell.family.title+" · L"+cell.level+" · "+cell.stat.mastery+"% ("+cell.stat.attempts+" "+t("stats.tries","tries")+")";container.appendChild(button);});}fill("weakList",cells.slice(0,8));fill("strongList",cells.slice().reverse().slice(0,8));}
  function renderSettings(){var container=document.getElementById("enabledCategories");container.replaceChildren();CATEGORIES.forEach(function(category){var row=document.createElement("div"),label=document.createElement("label"),input=document.createElement("input"),span=document.createElement("span");row.className="check-row";input.type="checkbox";input.checked=progress.settings.enabled[category.id]!==false;input.dataset.categoryId=category.id;span.textContent=category.title;label.appendChild(input);label.appendChild(span);row.appendChild(label);container.appendChild(row);});}
  function renderLearn(){var container=document.getElementById("learnGrid");container.replaceChildren();FAMILIES.forEach(function(family){var card=document.createElement("article"),heading=document.createElement("h3"),concept=document.createElement("p"),rules=document.createElement("p"),example=document.createElement("code");card.id="learn-"+family.id;card.className="learn-card"+(learnSpotlightId===family.id?" spotlight":"");heading.textContent=family.title;concept.textContent=family.learn.concept;rules.textContent=family.learn.rules;example.textContent=family.learn.example;card.appendChild(heading);card.appendChild(concept);card.appendChild(rules);card.appendChild(example);container.appendChild(card);});}
  function setView(view){progress.view=view;saveProgress();document.querySelectorAll(".view").forEach(function(element){element.classList.toggle("active",element.id==="view-"+view);});document.querySelectorAll("[data-view]").forEach(function(button){button.classList.toggle("active",button.dataset.view===view);});if(view==="matrix")renderMatrix();if(view==="stats")renderStats();if(view==="settings")renderSettings();if(view==="learn"){renderLearn();if(learnSpotlightId){var card=document.getElementById("learn-"+learnSpotlightId);if(card)card.scrollIntoView({block:"center"});}}if(view==="practice"&&!currentQuestion)startQuestion();}
  function renderAll(){renderSummary();renderPracticeControls();renderMatrix();renderStats();renderSettings();renderLearn();setView(progress.view);}
  function wireEvents(){selectorController=PracticeLabUI.createPracticeSelectors({categorySelect:document.getElementById("categorySelect"),familySelect:document.getElementById("familySelect"),levelSelect:document.getElementById("levelSelect"),categories:CATEGORIES,families:FAMILIES,levelLabel:function(level){return t("practice.level","Level")+" "+level;},onSelect:function(selection){setManualSelection(selection.familyId,selection.level);}});var editor=PracticeLabUI.createTextEditor(function(){return isPaused?null:activeAnswerInput;}),sv=TEXT.localeCode==="sv";keypadButtons=PracticeLabUI.renderInputGrid(document.getElementById("answerKeypad"),[[["P",editor.insert("P"),{id:"atomP"}],["Q",editor.insert("Q"),{id:"atomQ"}],["R",editor.insert("R"),{id:"atomR"}],["S",editor.insert("S"),{id:"atomS"}],["¬",editor.insert("¬"),{id:"not",ariaLabel:sv?"negation":"negation"}]],[["∧",editor.insert("∧"),{id:"and",ariaLabel:sv?"konjunktion":"conjunction"}],["∨",editor.insert("∨"),{id:"or",ariaLabel:sv?"disjunktion":"disjunction"}],["→",editor.insert("→"),{id:"imp",ariaLabel:sv?"implikation":"conditional"}],["↔",editor.insert("↔"),{id:"iff",ariaLabel:sv?"ekvivalens":"biconditional"}],[t("practice.delete","Del"),editor.backspace,{id:"delete",variant:"function"}]],[["(",editor.insert("("),{id:"leftParen"}],[")",editor.insert(")"),{id:"rightParen"}],[t("practice.clear","Clear"),editor.clear,{id:"clear",variant:"function"}],[t("practice.nextFieldShort","Field →"),nextInput,{id:"nextField",variant:"function",ariaLabel:t("practice.nextField","Next answer field")}],[t("practice.check","Check"),function(){document.getElementById("answerForm").requestSubmit();},{id:"submit",variant:"primary"}]]]);document.querySelectorAll("[data-view]").forEach(function(button){button.addEventListener("click",function(){setView(button.dataset.view);});});document.getElementById("adaptiveModeBtn").addEventListener("click",function(){progress.settings.adaptive=true;saveProgress();startQuestion();});document.getElementById("manualModeBtn").addEventListener("click",function(){progress.settings.adaptive=false;saveProgress();startQuestion();});document.getElementById("pauseBtn").addEventListener("click",pausePractice);document.getElementById("resumeBtn").addEventListener("click",resumePractice);document.getElementById("learnCurrentBtn").addEventListener("click",function(){if(currentQuestion){learnSpotlightId=currentQuestion.familyId;setView("learn");}});document.getElementById("answerForm").addEventListener("submit",submitAnswer);document.getElementById("nextBtn").addEventListener("click",startQuestion);document.getElementById("skipBtn").addEventListener("click",startQuestion);document.getElementById("matrix").addEventListener("click",function(event){var button=event.target.closest("[data-family-id][data-level]");if(button){setView("practice");setManualSelection(button.dataset.familyId,button.dataset.level);}});["weakList","strongList"].forEach(function(id){document.getElementById(id).addEventListener("click",function(event){var button=event.target.closest("[data-family-id][data-level]");if(button){setView("practice");setManualSelection(button.dataset.familyId,button.dataset.level);}});});document.getElementById("enabledCategories").addEventListener("change",function(event){if(event.target.dataset.categoryId){progress.settings.enabled[event.target.dataset.categoryId]=event.target.checked;saveProgress();}});document.getElementById("exportBtn").addEventListener("click",function(){document.getElementById("dataBox").value=JSON.stringify(progress,null,2);});document.getElementById("copyBtn").addEventListener("click",function(){var box=document.getElementById("dataBox");if(!box.value)box.value=JSON.stringify(progress,null,2);PracticeLabUI.copyText(box.value);});document.getElementById("importBtn").addEventListener("click",function(){try{progress=mergeProgress(JSON.parse(document.getElementById("dataBox").value));saveProgress();currentQuestion=null;renderAll();}catch(error){document.getElementById("dataBox").value=t("messages.invalidJson","Invalid JSON")+": "+error.message;}});document.getElementById("resetBtn").addEventListener("click",function(){if(window.confirm(t("messages.resetConfirm","Reset all local progress?"))){progress=defaultProgress();saveProgress();currentQuestion=null;renderAll();}});document.addEventListener("keydown",function(event){if(event.key==="Enter"&&submitted&&progress.view==="practice"){event.preventDefault();startQuestion();}});}

  function runSelfTests(){var failures=[];function assert(condition,message){if(!condition&&failures.length<150)failures.push(message);}assert(CATEGORIES.length===6,"six categories");assert(FAMILIES.length===37,"all 37 specified families");assert(new Set(FAMILIES.map(function(f){return f.id;})).size===37,"unique family ids");assert(propEval(imp(atom("P"),atom("Q")),{P:true,Q:false})===false,"implication T F");assert(propEval(imp(atom("P"),atom("Q")),{P:false,Q:false})===true,"implication F F");assert(equivalent(imp(atom("P"),atom("Q")),or(not(atom("P")),atom("Q"))),"implication equivalence");assert(parseFormula("P -> Q")&&sameAst(parseFormula("P -> Q"),imp(atom("P"),atom("Q"))),"ASCII parser");assert(!parseFormula("P nonsense Q"),"malformed parser rejection");var tiny={domain:["a","b"],constants:{},predicates:{P:["a"]}};assert(folEval(some("x",pred("P","x")),tiny)&&!folEval(all("x",pred("P","x")),tiny),"finite quantifier landmark");var closed=[{formula:atom("P"),rule:"assumption",citations:[],scopePath:[1]},{formula:atom("P"),rule:"andE",citations:[0],scopePath:[]}];assert(!validateProofLine(closed,1),"closed subproof citation rejected");if(TEXT.localeCode!=="en"){assert(CATEGORIES.every(function(c){return Boolean(t("categories."+c.id,null));}),"localized categories");assert(FAMILIES.every(function(f){var x=t("families."+f.id,null);return x&&x.title&&x.rule&&x.example;}),"localized families");}FAMILIES.forEach(function(family,index){LEVELS.forEach(function(level){var signatures=new Set();for(var sample=0;sample<40;sample+=1){var seed=((index+1)*100000+level*1000+sample+1)>>>0;try{var question=generateQuestion(family.id,level,seed);assert(checkQuestion(question.canonicalAnswer,question).correct,"canonical "+family.id+":"+level+":"+seed);assert(!checkQuestion({},question).correct,"empty answer "+family.id+":"+level);assert(question.metadata.modelId===MODEL_ID&&question.metadata.oracleVersion===ORACLE_VERSION,"metadata "+family.id);if(family.categoryId==="proofs")assert(question.metadata.proofState&&question.metadata.proofState.validated&&validateProof(question.metadata.proofState.lines),"validated proof "+family.id+":"+level);signatures.add(question.structuralSignature);}catch(error){failures.push(family.id+" L"+level+" seed "+seed+": "+error.message);}}assert(signatures.size>=2,"structural variation "+family.id+":"+level);});});if(failures.length){console.error("Logic self-tests failed",failures);return{ok:false,failures:failures};}console.info("Logic self-tests passed: 37 families, exact propositional/argument/proof/finite-model oracles, and 7,400 generated questions"+(TEXT.localeCode==="sv"?" with complete Swedish family content":""));return{ok:true,failures:[]};}
  function init(){progress=loadProgress();rng=new Rng((Date.now()^Math.floor(Math.random()*0xFFFFFFFF))>>>0);wireEvents();renderAll();}
  window.runSelfTests=runSelfTests;
  window.LogicPractice={modelId:MODEL_ID,oracleVersion:ORACLE_VERSION,categories:CATEGORIES,families:FAMILIES,generateQuestion:generateQuestion,checkQuestion:checkQuestion,runSelfTests:runSelfTests,oracles:{parseFormula:parseFormula,propText:propText,propEval:propEval,truthRows:truthRows,truthColumn:truthColumn,equivalent:equivalent,counterRows:counterRows,argumentCountermodels:argumentCountermodels,folEval:folEval,isCnf:isCnf,validateProofLine:validateProofLine,validateProof:validateProof},constructors:{atom:atom,not:not,and:and,or:or,imp:imp,iff:iff,pred:pred,rel:rel,all:all,some:some}};
  document.addEventListener("DOMContentLoaded",init);
}());
