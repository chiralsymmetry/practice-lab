(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.mentalArithmetic.v2";
  var LEGACY_STORAGE_KEY = "practiceLab.mentalArithmetic.v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var ANSWER_LIMIT = 10000000n;
  var currentQuestion = null;
  var questionStartedAt = 0;
  var pauseStartedAt = 0;
  var pausedMs = 0;
  var answered = false;
  var progress = null;
  var sessionRng = null;
  var recentSignatures = [];
  var recentExpressions = [];
  var learnSpotlightId = null;
  var elements = {};

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function Rng(seed) {
    this.state = seed >>> 0 || 0x9e3779b9;
  }

  Rng.prototype.next = function () {
    var x = this.state >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state;
  };

  Rng.prototype.float = function () {
    return this.next() / 4294967296;
  };

  Rng.prototype.int = function (min, max) {
    return min + Math.floor(this.float() * (max - min + 1));
  };

  Rng.prototype.pick = function (items) {
    return items[this.int(0, items.length - 1)];
  };

  Rng.prototype.chance = function (probability) {
    return this.float() < probability;
  };

  Rng.prototype.shuffle = function (items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = this.int(0, i);
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  };

  function digitBand(value) {
    var length = Math.abs(Number(value)).toString().length;
    return length <= 1 ? "ones" : length === 2 ? "tens" : length === 3 ? "hundreds" : length === 4 ? "thousands" : "ten-thousands";
  }

  function formatInteger(value) {
    return Number(value).toLocaleString(t("locale", "en-US"));
  }

  function formatSeconds(ms) {
    if (!ms) return "0s";
    return (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + "s";
  }

  function formatMinutes(ms) {
    if (!ms) return "0m";
    return Math.max(1, Math.round(ms / 60000)) + "m";
  }

  function normalizeInteger(text) {
    var clean = String(text === undefined ? "" : text).trim().replace(/[\s,_]/g, "");
    if (!/^[+-]?\d+$/.test(clean)) return null;
    try {
      var value = BigInt(clean);
      if (value > ANSWER_LIMIT || value < -ANSWER_LIMIT) return null;
      return value.toString();
    } catch (error) {
      return null;
    }
  }

  var CATEGORIES = [
    { id: "addition", title: "Addition" },
    { id: "subtraction", title: "Subtraction" },
    { id: "multiplication", title: "Multiplication" },
    { id: "division", title: "Division" },
    { id: "complements", title: "Complements" },
    { id: "percentages", title: "Percentages" }
  ];

  var FAMILY_DATA = [
    ["add_place_values", "addition", "Two-Addend Addition", "Place-value addition", [1, 2, 3, 4, 5], "place-value decomposition", "Split the less friendly addend into place-value chunks.", "346 + 278 = 346 + 200 + 70 + 8 = 624"],
    ["add_missing_addend", "addition", "Two-Addend Addition", "Missing addend", [1, 2, 3, 4, 5], "inverse addition", "Use subtraction or count up from the visible addend.", "47 + ? = 83; 47 + 36 = 83"],
    ["add_bridge_landmark", "addition", "Bridging and Compensation", "Bridge a landmark", [1, 2, 3, 4, 5], "bridge through a round landmark", "Split one addend to reach a round ten, hundred, or thousand first.", "68 + 47 = 68 + 32 + 15 = 115"],
    ["add_compensate_round", "addition", "Bridging and Compensation", "Compensated addition", [1, 2, 3, 4, 5], "round and compensate", "Replace a near-round addend, then undo the small change.", "398 + 27 = 400 + 25 = 425"],
    ["add_compatible_group", "addition", "Multi-Addend Grouping", "Compatible grouping", [1, 2, 3, 4, 5], "reorder and group", "Pair addends that make round totals before adding the remainder.", "240 + 360 + 60 = 240 + 420 = 660"],
    ["subtract_place_values", "subtraction", "Decomposition", "Place-value subtraction", [1, 2, 3, 4, 5], "subtraction decomposition", "Subtract convenient chunks while preserving operand order.", "624 − 278 = 624 − 200 − 70 − 8 = 346"],
    ["subtract_equal_compensation", "subtraction", "Compensation", "Equal compensation", [1, 2, 3, 4, 5], "equal compensation", "Adding the same amount to both operands preserves their difference.", "503 − 198 = 505 − 200 = 305"],
    ["subtract_count_up", "subtraction", "Counting Up", "Count up a difference", [1, 2, 3, 4, 5], "count up through landmarks", "For nearby values, count upward from the smaller to the larger.", "487 → 500 is 13; 500 → 532 is 32; total 45"],
    ["subtract_missing_term", "subtraction", "Missing Terms", "Missing subtraction term", [1, 2, 3, 4, 5], "inverse subtraction", "Respect which side is missing; subtraction is not commutative.", "? − 28 = 45 gives 73; 73 − ? = 45 gives 28"],
    ["multiplication_fact", "multiplication", "Core Facts", "Multiplication facts", [1, 2, 3, 4], "fact recall and inverse recall", "Recall facts through 12×12 in both operand orders.", "8 × 7 = 56; 56 ÷ 8 = 7"],
    ["multiply_distribute", "multiplication", "Distribution", "Distributive multiplication", [2, 3, 4, 5], "distribute around a landmark", "Split a factor into a round part and a small correction.", "23 × 19 = 23 × 20 − 23 = 437"],
    ["multiply_near_square", "multiplication", "Distribution", "Near-square products", [3, 4, 5], "difference of squares", "Use (c−d)(c+d) = c²−d².", "18 × 22 = 20² − 2² = 396"],
    ["multiply_double_half", "multiplication", "Doubling and Halving", "Double and halve", [2, 3, 4, 5], "product-preserving double/half", "Halve one factor and double the other; the product stays equal.", "16 × 25 = 8 × 50 = 4 × 100 = 400"],
    ["multiply_landmark", "multiplication", "Landmark Multipliers", "Landmark multipliers", [1, 2, 3, 4, 5], "landmark multiplier", "Use nearby tens/hundreds or exact halving/quartering.", "48 × 25 = 48 × 100 ÷ 4 = 1,200"],
    ["divide_exact_quotient", "division", "Exact Quotients", "Exact quotient", [1, 2, 3, 4, 5], "missing multiplication factor", "Rewrite exact division as divisor × ? = dividend.", "756 ÷ 12 asks 12 × ? = 756"],
    ["divide_factorized", "division", "Factor Transformations", "Factorized division", [2, 3, 4, 5], "divide by factors", "Factor the divisor and divide in two or three exact steps.", "1,800 ÷ 45 = ÷5 then ÷9 = 40"],
    ["divide_scale_both", "division", "Scale Transformations", "Scale both terms", [2, 3, 4, 5], "scale dividend and divisor equally", "Multiply or divide both terms by the same factor to make a friendly divisor.", "375 ÷ 25 = 1,500 ÷ 100 = 15"],
    ["division_missing_term", "division", "Missing Terms", "Missing division term", [1, 2, 3, 4, 5], "inverse division", "Use dividend = divisor × quotient.", "? ÷ 8 = 7 gives 56; 56 ÷ ? = 7 gives 8"],
    ["complement_to_landmark", "complements", "Stated Landmark", "Complement to a landmark", [1, 2, 3, 4, 5], "complement to stated target", "Count up to the target named in the equation.", "637 + ? = 1,000 gives 363"],
    ["complement_next_multiple", "complements", "Next Multiple", "Complement to next multiple", [1, 2, 3, 4, 5], "strict next multiple", "The next multiple is strictly greater; an exact multiple needs a full step.", "200 to the next multiple of 100 needs 100, not 0"],
    ["complement_two_stage", "complements", "Decomposed Paths", "Two-stage complement", [2, 3, 4, 5], "count up in stages", "Jump to an intermediate round value, then to the final target.", "684 → 700 is 16; 700 → 1,000 is 300; total 316"],
    ["percentage_benchmark", "percentages", "Benchmark Percentages", "Benchmark percentage", [1, 2, 3, 4, 5], "benchmark fraction", "Use 50%=half, 25%=quarter, 20%=fifth, 10%=tenth, 5%=twentieth, and 1%=hundredth.", "25% of 360 = 360 ÷ 4 = 90"],
    ["percentage_composite", "percentages", "Composite Percentages", "Composite percentage", [2, 3, 4, 5], "add or subtract benchmark components", "Compute every component from the original base, then combine.", "15% of 240 = 10% + 5% = 24 + 12 = 36"],
    ["percentage_swap_or_scale", "percentages", "Scaling and Commutativity", "Swap or scale percentage", [3, 4, 5], "swap p% of b to b% of p", "p% of b equals b% of p; use the friendlier direction.", "18% of 50 = 50% of 18 = 9"],
    ["percentage_missing_base", "percentages", "Inverse Percentages", "Missing percentage base", [2, 3, 4, 5], "recover the whole", "Use the inverse of the same benchmark percentage.", "25% of ? = 45; the whole is 45 × 4 = 180"],
    ["percentage_missing_percent", "percentages", "Inverse Percentages", "Missing percentage rate", [2, 3, 4, 5], "recover the integer rate", "Find the exact part-to-whole ratio and multiply by 100.", "45 is what percent of 180? 25"]
  ];

  var FAMILIES = FAMILY_DATA.map(function (entry) {
    return {
      id: entry[0],
      categoryId: entry[1],
      subcategory: entry[2],
      title: entry[3],
      levels: entry[4],
      strategy: entry[5],
      learn: { rules: entry[6], example: entry[7] }
    };
  });

  var PREREQUISITES = {
    add_missing_addend: ["add_place_values"],
    add_bridge_landmark: ["add_place_values", "complement_to_landmark"],
    add_compensate_round: ["add_bridge_landmark"],
    add_compatible_group: ["add_place_values"],
    subtract_place_values: ["add_place_values"],
    subtract_equal_compensation: ["subtract_place_values"],
    subtract_count_up: ["complement_to_landmark", "subtract_place_values"],
    subtract_missing_term: ["subtract_place_values"],
    multiply_distribute: ["multiplication_fact"],
    multiply_near_square: ["multiply_distribute"],
    multiply_double_half: ["multiplication_fact"],
    multiply_landmark: ["multiplication_fact"],
    divide_exact_quotient: ["multiplication_fact"],
    divide_factorized: ["divide_exact_quotient"],
    divide_scale_both: ["divide_exact_quotient"],
    division_missing_term: ["divide_exact_quotient"],
    complement_two_stage: ["complement_to_landmark"],
    percentage_benchmark: ["divide_exact_quotient"],
    percentage_composite: ["percentage_benchmark"],
    percentage_swap_or_scale: ["percentage_benchmark"],
    percentage_missing_base: ["percentage_benchmark"],
    percentage_missing_percent: ["percentage_benchmark"]
  };

  var GENERATORS = {};

  function categoryById(id) {
    return CATEGORIES.find(function (category) { return category.id === id; }) || CATEGORIES[0];
  }

  function familyById(id) {
    return FAMILIES.find(function (family) { return family.id === id; }) || FAMILIES[0];
  }

  function familiesForCategory(categoryId) {
    return FAMILIES.filter(function (family) { return family.categoryId === categoryId; });
  }

  function localizeStaticData() {
    CATEGORIES.forEach(function (category) {
      var localized = t("categories." + category.id, null);
      if (localized) category.title = localized.title || category.title;
    });
    FAMILIES.forEach(function (family) {
      var localized = t("families." + family.id, null);
      if (localized) family.title = localized.title || family.title;
    });
  }

  localizeStaticData();

  function makeQuestion(familyId, level, strategy, parameters, title, expression, note, answer, workedSteps, signatureParts, misconceptions, cost) {
    var family = familyById(familyId);
    var canonical = BigInt(answer);
    var mentalCost = Object.assign({ recalledFacts: 0, decompositions: 0, boundaryJumps: 0, intermediateTotals: workedSteps.length }, cost || {});
    var question = {
      categoryId: family.categoryId,
      subcategoryId: family.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      familyId: familyId,
      level: level,
      strategy: strategy,
      difficultyDimensions: [
        "magnitude-" + digitBand(canonical),
        level <= 2 ? "explicit-cue" : level >= 4 ? "cue-removed" : "mixed-cue"
      ],
      misconceptionsTargeted: misconceptions || [],
      parameters: parameters,
      canonicalAnswer: canonical.toString(),
      workedSteps: workedSteps,
      mentalCost: mentalCost,
      structuralSignature: [familyId, strategy, digitBand(canonical)].concat(signatureParts || []).join("|"),
      prompt: { title: title, expression: expression, note: note },
      expected: canonical.toString()
    };
    validateQuestion(question);
    return question;
  }

  function activeDigits(value) {
    return String(Math.abs(value)).replace(/0/g, "").length;
  }

  function placeChunks(value) {
    var chunks = [];
    var remaining = Math.abs(value);
    var place = Math.pow(10, Math.max(0, String(remaining).length - 1));
    while (place >= 1) {
      var chunk = Math.floor(remaining / place) * place;
      if (chunk) chunks.push(chunk);
      remaining %= place;
      place /= 10;
    }
    return chunks;
  }

  function carryCount(a, b) {
    var carry = 0;
    var count = 0;
    while (a || b) {
      var total = a % 10 + b % 10 + carry;
      carry = total >= 10 ? 1 : 0;
      if (carry) count += 1;
      a = Math.floor(a / 10);
      b = Math.floor(b / 10);
    }
    return count;
  }

  function pow10(exponent) {
    return Math.pow(10, exponent);
  }

  function roundTargets(level) {
    return level === 1 ? [10, 20] : level === 2 ? [50, 100] : level === 3 ? [100, 500, 1000] : level === 4 ? [250, 500, 1000, 2500] : [1000, 5000, 10000, 25000];
  }

  function sparseNumber(level, rng) {
    if (level === 1) return rng.int(2, 48);
    if (level === 2) return rng.int(12, 99) + rng.pick([0, 100, 200]);
    if (level === 3) return rng.int(1, 9) * 100 + rng.int(1, 9) * 10 + rng.int(0, 9);
    if (level === 4) return rng.int(1, 9) * 1000 + rng.int(0, 9) * 100 + rng.int(1, 9);
    return rng.int(1, 9) * 10000 + rng.int(1, 9) * 1000 + rng.int(0, 9) * 100 + rng.pick([0, 50]);
  }

  GENERATORS.add_place_values = function (level, rng) {
    var a;
    var b;
    if (level === 1) {
      a = rng.int(6, 49);
      b = rng.int(2, 29);
    } else if (level === 2) {
      a = rng.int(30, 399);
      b = rng.int(1, 9) * 10 + rng.int(1, 9);
    } else if (level === 3) {
      a = rng.int(120, 699);
      b = rng.int(1, 4) * 100 + rng.int(1, 9) * 10 + rng.int(1, 9);
    } else {
      a = sparseNumber(level, rng);
      b = sparseNumber(level - 1, rng);
    }
    var answer = a + b;
    var chunks = placeChunks(b);
    if (level >= 4 && chunks.length > 3) return GENERATORS.add_place_values(level, rng);
    var steps = [];
    var total = a;
    chunks.forEach(function (chunk) {
      total += chunk;
      steps.push((chunk >= 0 ? "+ " : "− ") + Math.abs(chunk) + " → " + total);
    });
    return makeQuestion("add_place_values", level, "place-value decomposition", { a: a, b: b }, t("question.compute", "Compute mentally."), formatInteger(a) + " + " + formatInteger(b), level <= 2 ? "Split one addend by place value." : "Choose a short place-value route.", answer, steps, ["carries-" + carryCount(a, b), "active-" + activeDigits(b)], ["lost-carry", "place-alignment"], { decompositions: 1 });
  };

  GENERATORS.add_missing_addend = function (level, rng) {
    var maximum = level === 1 ? 20 : level === 2 ? 99 : level === 3 ? 500 : level === 4 ? 2000 : 50000;
    var known = rng.int(2, Math.max(3, Math.floor(maximum * 0.7)));
    var missing = rng.int(1, Math.max(2, Math.floor(maximum * 0.4)));
    var total = known + missing;
    var missingFirst = rng.chance(0.5);
    return makeQuestion("add_missing_addend", level, "inverse addition", { known: known, missing: missing, total: total, missingPosition: missingFirst ? "left" : "right" }, t("question.missing", "Find the missing integer."), missingFirst ? "? + " + formatInteger(known) + " = " + formatInteger(total) : formatInteger(known) + " + ? = " + formatInteger(total), "Use inverse subtraction or count up.", missing, [formatInteger(total) + " − " + formatInteger(known) + " = " + formatInteger(missing)], [missingFirst ? "missing-left" : "missing-right", "boundary-" + (carryCount(known, missing) ? "crossed" : "none")], ["returned-total", "returned-known"], { boundaryJumps: carryCount(known, missing) ? 1 : 0 });
  };

  GENERATORS.add_bridge_landmark = function (level, rng) {
    var target = rng.pick(roundTargets(level));
    var gapMax = target <= 20 ? 9 : target <= 100 ? 30 : target <= 1000 ? 120 : 400;
    var gap = rng.int(2, Math.max(2, Math.min(gapMax, Math.floor(target / 3))));
    var remainder = rng.int(1, Math.max(2, Math.min(gapMax, Math.floor(target / 4))));
    var a = target - gap;
    var b = gap + remainder;
    var swapped = level >= 3 && rng.chance(0.5);
    return makeQuestion("add_bridge_landmark", level, "bridge through " + target, { a: a, b: b, target: target, gap: gap, remainder: remainder }, t("question.compute", "Compute mentally."), swapped ? formatInteger(b) + " + " + formatInteger(a) : formatInteger(a) + " + " + formatInteger(b), level <= 2 ? "First bridge to " + formatInteger(target) + "." : "Look for a round landmark.", a + b, [formatInteger(a) + " + " + formatInteger(gap) + " = " + formatInteger(target), formatInteger(target) + " + " + formatInteger(remainder) + " = " + formatInteger(a + b)], ["target-" + digitBand(target), swapped ? "bridge-second" : "bridge-first", "gap-" + digitBand(gap)], ["lost-bridge-component"], { decompositions: 1, boundaryJumps: 1, intermediateTotals: 2 });
  };

  GENERATORS.add_compensate_round = function (level, rng) {
    var rounds = level === 1 ? [10, 20] : level === 2 ? [50, 100] : level === 3 ? [100, 200, 500] : level === 4 ? [300, 500, 1000, 2500] : [1000, 2500, 5000, 10000];
    var round = rng.pick(rounds);
    var deviation = rng.int(1, level <= 2 ? 3 : level <= 4 ? 9 : 25) * (rng.chance(0.5) ? 1 : -1);
    var near = round + deviation;
    var a = rng.int(Math.max(2, Math.floor(round / 10)), Math.max(5, Math.floor(round * 0.8)));
    var answer = a + near;
    var corrected = a + round;
    return makeQuestion("add_compensate_round", level, "round and compensate", { a: a, near: near, round: round, deviation: deviation }, t("question.compute", "Compute mentally."), formatInteger(a) + " + " + formatInteger(near), level <= 2 ? "Replace " + formatInteger(near) + " with " + formatInteger(round) + ", then correct." : "A near-round addend offers a short route.", answer, [formatInteger(a) + " + " + formatInteger(round) + " = " + formatInteger(corrected), deviation > 0 ? "add back " + deviation + " → " + formatInteger(answer) : "subtract " + Math.abs(deviation) + " → " + formatInteger(answer)], ["correction-" + (deviation > 0 ? "positive" : "negative"), "round-" + digitBand(round)], ["omitted-compensation"], { decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.add_compatible_group = function (level, rng) {
    var landmark = level === 1 ? 10 : level === 2 ? 100 : level === 3 ? 100 : level === 4 ? 500 : 1000;
    var pairA = rng.int(Math.max(1, Math.floor(landmark * 0.15)), Math.floor(landmark * 0.75));
    var pairB = landmark - pairA;
    var secondPair = level >= 3;
    var pairC = secondPair ? rng.int(Math.max(1, Math.floor(landmark * 0.2)), Math.floor(landmark * 0.8)) : 0;
    var pairD = secondPair ? landmark - pairC : 0;
    var extraCount = level === 1 ? 1 : level === 2 ? 2 : level >= 4 ? 1 : 0;
    var extras = [];
    for (var i = 0; i < extraCount; i += 1) extras.push(rng.int(2, Math.max(3, Math.floor(landmark / (level <= 2 ? 4 : 2)))));
    var addends = rng.shuffle([pairA, pairB].concat(secondPair ? [pairC, pairD] : []).concat(extras));
    var extraSum = extras.reduce(function (sum, value) { return sum + value; }, 0);
    var answer = landmark * (secondPair ? 2 : 1) + extraSum;
    var steps = [formatInteger(pairA) + " + " + formatInteger(pairB) + " = " + formatInteger(landmark)];
    if (secondPair) steps.push(formatInteger(pairC) + " + " + formatInteger(pairD) + " = " + formatInteger(landmark));
    steps.push((secondPair ? formatInteger(landmark) + " + " + formatInteger(landmark) : formatInteger(landmark)) + (extras.length ? " + " + extras.map(formatInteger).join(" + ") : "") + " = " + formatInteger(answer));
    return makeQuestion("add_compatible_group", level, "reorder and group", { addends: addends, landmark: landmark, compatiblePairs: secondPair ? [[pairA, pairB], [pairC, pairD]] : [[pairA, pairB]] }, t("question.compute", "Compute mentally."), addends.map(formatInteger).join(" + "), "Reorder and group compatible addends.", answer, steps, ["count-" + addends.length, "landmark-" + digitBand(landmark), secondPair ? "two-groups" : "one-group"], ["omitted-addend"], { decompositions: secondPair ? 2 : 1, intermediateTotals: steps.length });
  };

  GENERATORS.subtract_place_values = function (level, rng) {
    var a = sparseNumber(level, rng);
    var b = sparseNumber(Math.max(1, level - 1), rng);
    var negative = level >= 4 && rng.chance(0.3);
    if (!negative) {
      if (a < b) { var temp = a; a = b; b = temp; }
    } else {
      b = sparseNumber(level, rng);
      a = b - rng.pick(level === 4 ? [25, 50, 100, 250] : [50, 100, 250, 500, 1000]);
      if (a < 0) return GENERATORS.subtract_place_values(level, rng);
    }
    var answer = a - b;
    var chunks = placeChunks(b);
    var total = a;
    var steps = [];
    chunks.forEach(function (chunk) {
      total -= chunk;
      steps.push("− " + formatInteger(chunk) + " → " + formatInteger(total));
    });
    return makeQuestion("subtract_place_values", level, "subtraction decomposition", { a: a, b: b }, t("question.compute", "Compute mentally."), formatInteger(a) + " − " + formatInteger(b), level <= 2 ? "Subtract by place-value chunks." : "Keep the operand order.", answer, steps, [answer < 0 ? "negative" : "nonnegative", "active-" + activeDigits(b)], ["reversed-sign", "lost-borrow"], { decompositions: 1 });
  };

  GENERATORS.subtract_equal_compensation = function (level, rng) {
    var round = rng.pick(level === 1 ? [10, 20] : level === 2 ? [50, 100] : level === 3 ? [100, 200, 500] : level === 4 ? [500, 1000, 2500] : [1000, 5000, 10000]);
    var deviation = rng.int(1, level <= 2 ? 4 : level <= 4 ? 12 : 30) * (rng.chance(0.5) ? 1 : -1);
    var b = round + deviation;
    var answer = rng.int(level >= 4 && rng.chance(0.25) ? -Math.floor(round / 2) : 5, Math.max(6, Math.floor(round * 0.8)));
    var a = b + answer;
    if (a < 0 || b < 0) return GENERATORS.subtract_equal_compensation(level, rng);
    var shift = round - b;
    return makeQuestion("subtract_equal_compensation", level, "equal compensation", { a: a, b: b, round: round, shift: shift }, t("question.compute", "Compute mentally."), formatInteger(a) + " − " + formatInteger(b), level <= 2 ? "Shift both operands by " + formatInteger(shift) + "." : "Look for equal compensation.", answer, [formatInteger(a) + (shift >= 0 ? " + " : " − ") + Math.abs(shift) + " = " + formatInteger(a + shift), formatInteger(b) + (shift >= 0 ? " + " : " − ") + Math.abs(shift) + " = " + formatInteger(round), formatInteger(a + shift) + " − " + formatInteger(round) + " = " + formatInteger(answer)], ["shift-" + (shift > 0 ? "up" : "down"), answer < 0 ? "negative" : "nonnegative"], ["unequal-compensation"], { decompositions: 1, intermediateTotals: 3 });
  };

  GENERATORS.subtract_count_up = function (level, rng) {
    var base = rng.pick(roundTargets(level));
    var below = rng.int(1, Math.max(2, Math.floor(base / 5)));
    var above = rng.int(1, Math.max(2, Math.floor(base / 4)));
    var low = base - below;
    var high = base + above;
    return makeQuestion("subtract_count_up", level, "count up through " + base, { high: high, low: low, landmark: base, firstJump: below, secondJump: above }, t("question.compute", "Compute the difference mentally."), formatInteger(high) + " − " + formatInteger(low), level <= 2 ? "Count up through " + formatInteger(base) + "." : "These values are close; count upward.", high - low, [formatInteger(low) + " → " + formatInteger(base) + " is " + formatInteger(below), formatInteger(base) + " → " + formatInteger(high) + " is " + formatInteger(above), formatInteger(below) + " + " + formatInteger(above) + " = " + formatInteger(high - low)], ["landmark-" + digitBand(base), "distance-" + digitBand(high - low)], ["subtracted-in-wrong-direction"], { boundaryJumps: 2, intermediateTotals: 3 });
  };

  GENERATORS.subtract_missing_term = function (level, rng) {
    var maximum = level === 1 ? 20 : level === 2 ? 100 : level === 3 ? 1000 : level === 4 ? 5000 : 50000;
    var b = rng.int(1, Math.floor(maximum * 0.55));
    var difference = rng.int(level >= 4 && rng.chance(0.25) ? -Math.floor(maximum * 0.25) : 1, Math.floor(maximum * 0.4));
    var a = b + difference;
    if (a < 0) return GENERATORS.subtract_missing_term(level, rng);
    var missingMinuend = level === 1 || rng.chance(0.5);
    var expression = missingMinuend ? "? − " + formatInteger(b) + " = " + formatInteger(difference) : formatInteger(a) + " − ? = " + formatInteger(difference);
    var answer = missingMinuend ? a : b;
    var step = missingMinuend ? formatInteger(difference) + " + " + formatInteger(b) + " = " + formatInteger(a) : formatInteger(a) + " − " + formatInteger(difference) + " = " + formatInteger(b);
    return makeQuestion("subtract_missing_term", level, "inverse subtraction", { a: a, b: b, difference: difference, missingPosition: missingMinuend ? "minuend" : "subtrahend" }, t("question.missing", "Find the missing integer."), expression, "Subtraction is ordered; identify the missing role.", answer, [step], [missingMinuend ? "missing-minuend" : "missing-subtrahend", difference < 0 ? "negative-result" : "nonnegative-result"], ["treated-subtraction-as-commutative"], { recalledFacts: 1 });
  };

  GENERATORS.multiplication_fact = function (level, rng) {
    var factors = level === 1 ? [2, 5, 10] : level === 2 ? [2, 3, 4, 5, 6, 7, 8, 9, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var a = rng.pick(factors);
    var b = rng.pick(factors);
    var product = a * b;
    var inverse = level === 4 && rng.chance(0.4);
    var swapped = rng.chance(0.5);
    var expression = inverse ? formatInteger(product) + " ÷ " + formatInteger(a) : swapped ? formatInteger(b) + " × " + formatInteger(a) : formatInteger(a) + " × " + formatInteger(b);
    return makeQuestion("multiplication_fact", level, inverse ? "inverse fact recall" : "fact recall", { a: a, b: b, product: product, inverse: inverse, swapped: swapped }, inverse ? t("question.missingFactor", "Recover the missing factor.") : t("question.compute", "Compute mentally."), expression, "Use the corresponding multiplication fact.", inverse ? b : product, [formatInteger(a) + " × " + formatInteger(b) + " = " + formatInteger(product)], [inverse ? "inverse" : "forward", "pair-" + Math.min(a, b) + "-" + Math.max(a, b), swapped ? "swapped" : "ordered"], ["added-instead-of-multiplied", "factor-role-confusion"], { recalledFacts: 1 });
  };

  GENERATORS.multiply_distribute = function (level, rng) {
    var landmarks = level === 2 ? [10, 20] : level === 3 ? [10, 20, 50] : level === 4 ? [50, 100, 200] : [100, 200, 500];
    var landmark = rng.pick(landmarks);
    var deviation = rng.int(1, level <= 3 ? 2 : 5) * (rng.chance(0.5) ? 1 : -1);
    var factor = landmark + deviation;
    var a = rng.int(level === 2 ? 3 : 8, level <= 3 ? 35 : level === 4 ? 90 : 250);
    var main = a * landmark;
    var correction = a * Math.abs(deviation);
    var answer = a * factor;
    return makeQuestion("multiply_distribute", level, "distribute around " + landmark, { a: a, factor: factor, landmark: landmark, deviation: deviation }, t("question.compute", "Compute mentally."), formatInteger(a) + " × " + formatInteger(factor), level <= 3 ? "Distribute around " + formatInteger(landmark) + "." : "Choose a useful nearby landmark.", answer, [formatInteger(a) + " × " + formatInteger(landmark) + " = " + formatInteger(main), deviation > 0 ? "+ " + formatInteger(correction) + " = " + formatInteger(answer) : "− " + formatInteger(correction) + " = " + formatInteger(answer)], ["deviation-" + (deviation > 0 ? "plus" : "minus"), "landmark-" + digitBand(landmark)], ["undistributed-deviation"], { recalledFacts: 2, decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.multiply_near_square = function (level, rng) {
    var centers = level === 3 ? [10, 20] : level === 4 ? [20, 50, 100] : [50, 100, 200, 500];
    var center = rng.pick(centers);
    var offset = rng.int(1, level === 3 ? 1 : level === 4 ? 3 : 5);
    var left = center - offset;
    var right = center + offset;
    var answer = left * right;
    return makeQuestion("multiply_near_square", level, "difference of squares", { center: center, offset: offset, left: left, right: right }, t("question.compute", "Compute mentally."), formatInteger(left) + " × " + formatInteger(right), level === 3 ? "The factors are equally spaced around " + formatInteger(center) + "." : "Look for a near-square pair.", answer, [formatInteger(center) + "² = " + formatInteger(center * center), formatInteger(center * center) + " − " + formatInteger(offset * offset) + " = " + formatInteger(answer)], ["center-" + digitBand(center), "offset-" + offset], ["added-square-offset"], { recalledFacts: 2, decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.multiply_double_half = function (level, rng) {
    var friendly = rng.pick(level === 2 ? [5, 25] : level === 3 ? [5, 25, 50] : level === 4 ? [15, 25, 50, 125] : [25, 50, 125, 250]);
    var transforms = level === 2 ? 1 : level === 3 ? rng.int(1, 2) : rng.int(1, 3);
    var a = rng.int(2, level <= 3 ? 30 : 120) * Math.pow(2, transforms);
    var b = friendly;
    var transformedA = a;
    var transformedB = b;
    var steps = [];
    for (var i = 0; i < transforms; i += 1) {
      transformedA /= 2;
      transformedB *= 2;
      steps.push(formatInteger(transformedA) + " × " + formatInteger(transformedB));
    }
    var answer = a * b;
    steps[steps.length - 1] += " = " + formatInteger(answer);
    return makeQuestion("multiply_double_half", level, "double and halve", { a: a, b: b, transforms: transforms }, t("question.compute", "Compute mentally."), formatInteger(a) + " × " + formatInteger(b), level <= 3 ? "Halve one factor and double the other." : "Choose the product-preserving transform.", answer, steps, ["transforms-" + transforms, "friendly-" + friendly], ["changed-only-one-factor"], { decompositions: transforms, intermediateTotals: transforms });
  };

  function landmarkStrategy(multiplier) {
    if (multiplier === 5) return "×10 then halve";
    if (multiplier === 9) return "×10 minus one group";
    if (multiplier === 11) return "×10 plus one group";
    if (multiplier === 15) return "×10 plus half of ×10";
    if (multiplier === 25) return "×100 then quarter";
    if (multiplier === 50) return "×100 then halve";
    if (multiplier === 75) return "×3 then ×25";
    if (multiplier === 99) return "×100 minus one group";
    if (multiplier === 101) return "×100 plus one group";
    return "×1000 then divide by 8";
  }

  GENERATORS.multiply_landmark = function (level, rng) {
    var sets = { 1: [5, 9, 11], 2: [15, 25, 50], 3: [5, 9, 11, 15, 25, 50], 4: [75, 99, 101], 5: [75, 99, 101, 125] };
    var multiplier = rng.pick(sets[level]);
    var required = [25, 50].includes(multiplier) ? 4 : multiplier === 125 ? 8 : multiplier === 75 ? 4 : 1;
    var a = rng.int(2, level <= 2 ? 40 : level <= 4 ? 120 : 400) * required;
    var answer = a * multiplier;
    var main;
    var steps;
    if ([9, 11, 99, 101].includes(multiplier)) {
      var round = multiplier < 20 ? 10 : 100;
      main = a * round;
      steps = [formatInteger(a) + " × " + round + " = " + formatInteger(main), (multiplier < round ? "− " : "+ ") + formatInteger(a) + " = " + formatInteger(answer)];
    } else if (multiplier === 5 || multiplier === 50) {
      main = a * (multiplier * 2);
      steps = [formatInteger(a) + " × " + formatInteger(multiplier * 2) + " = " + formatInteger(main), formatInteger(main) + " ÷ 2 = " + formatInteger(answer)];
    } else if (multiplier === 25 || multiplier === 125) {
      var scale = multiplier === 25 ? 100 : 1000;
      var divisor = multiplier === 25 ? 4 : 8;
      main = a * scale;
      steps = [formatInteger(a) + " × " + scale + " = " + formatInteger(main), formatInteger(main) + " ÷ " + divisor + " = " + formatInteger(answer)];
    } else {
      steps = [landmarkStrategy(multiplier), formatInteger(a) + " × " + multiplier + " = " + formatInteger(answer)];
    }
    return makeQuestion("multiply_landmark", level, "landmark multiplier " + multiplier, { a: a, multiplier: multiplier }, t("question.compute", "Compute mentally."), formatInteger(a) + " × " + formatInteger(multiplier), level <= 2 ? "Use: " + landmarkStrategy(multiplier) + "." : "Choose a landmark route.", answer, steps, ["multiplier-" + multiplier, "operand-" + digitBand(a)], ["landmark-correction-omitted"], { recalledFacts: 2, decompositions: 1, intermediateTotals: steps.length });
  };

  GENERATORS.divide_exact_quotient = function (level, rng) {
    var divisors = level === 1 ? [2, 3, 4, 5, 10] : level === 2 ? [4, 6, 7, 8, 9, 11, 12] : level === 3 ? [12, 15, 20, 25, 50] : level === 4 ? [12, 16, 18, 24, 25, 40, 50] : [25, 40, 50, 75, 99, 125];
    var divisor = rng.pick(divisors);
    var quotient = rng.int(2, level <= 2 ? 12 : level === 3 ? 40 : level === 4 ? 120 : 400);
    var dividend = divisor * quotient;
    return makeQuestion("divide_exact_quotient", level, "missing multiplication factor", { dividend: dividend, divisor: divisor, quotient: quotient }, t("question.compute", "Compute mentally."), formatInteger(dividend) + " ÷ " + formatInteger(divisor), "Rewrite as " + formatInteger(divisor) + " × ? = " + formatInteger(dividend) + ".", quotient, [formatInteger(divisor) + " × " + formatInteger(quotient) + " = " + formatInteger(dividend)], ["divisor-" + digitBand(divisor), "quotient-" + digitBand(quotient)], ["returned-divisor"], { recalledFacts: 1 });
  };

  GENERATORS.divide_factorized = function (level, rng) {
    var pairs = level === 2 ? [[2, 3], [2, 5], [3, 4]] : level === 3 ? [[3, 5], [4, 5], [4, 25]] : level === 4 ? [[4, 6], [5, 9], [8, 5], [4, 25]] : [[4, 25], [5, 15], [8, 9], [10, 25]];
    var pair = rng.pick(pairs);
    var divisor = pair[0] * pair[1];
    var quotient = rng.int(2, level <= 3 ? 50 : 200);
    var dividend = divisor * quotient;
    var intermediate = dividend / pair[0];
    return makeQuestion("divide_factorized", level, "divide by factors", { dividend: dividend, divisor: divisor, factors: pair, quotient: quotient }, t("question.compute", "Compute mentally."), formatInteger(dividend) + " ÷ " + formatInteger(divisor), "Factor " + divisor + " as " + pair[0] + " × " + pair[1] + ".", quotient, [formatInteger(dividend) + " ÷ " + pair[0] + " = " + formatInteger(intermediate), formatInteger(intermediate) + " ÷ " + pair[1] + " = " + formatInteger(quotient)], ["factors-" + pair.join("x"), "quotient-" + digitBand(quotient)], ["stopped-after-one-factor"], { recalledFacts: 2, decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.divide_scale_both = function (level, rng) {
    var divisor = rng.pick(level === 2 ? [10, 20, 50] : level === 3 ? [25, 50] : level === 4 ? [25, 50, 125] : [25, 40, 50, 125, 250]);
    var quotient = rng.int(2, level <= 3 ? 40 : 160);
    var dividend = divisor * quotient;
    var scale;
    var mode;
    if (divisor === 25) { scale = 4; mode = "multiply"; }
    else if (divisor === 50) { scale = 2; mode = "multiply"; }
    else if (divisor === 125) { scale = 8; mode = "multiply"; }
    else if (divisor === 250) { scale = 4; mode = "multiply"; }
    else { scale = 10; mode = "divide"; dividend *= 10; divisor *= 10; }
    var transformedDividend = mode === "multiply" ? dividend * scale : dividend / scale;
    var transformedDivisor = mode === "multiply" ? divisor * scale : divisor / scale;
    if (!Number.isInteger(transformedDividend) || !Number.isInteger(transformedDivisor)) return GENERATORS.divide_scale_both(level, rng);
    return makeQuestion("divide_scale_both", level, "scale both terms", { dividend: dividend, divisor: divisor, scale: scale, mode: mode, quotient: quotient }, t("question.compute", "Compute mentally."), formatInteger(dividend) + " ÷ " + formatInteger(divisor), "Scale dividend and divisor by the same factor.", quotient, [(mode === "multiply" ? "×" : "÷") + scale + " on both: " + formatInteger(transformedDividend) + " ÷ " + formatInteger(transformedDivisor), "= " + formatInteger(quotient)], ["scale-" + mode + "-" + scale, "divisor-" + divisor], ["scaled-only-one-term"], { decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.division_missing_term = function (level, rng) {
    var divisor = rng.int(2, level <= 2 ? 12 : level === 3 ? 25 : 80);
    var quotient = rng.int(2, level <= 2 ? 12 : level === 3 ? 40 : 150);
    var dividend = divisor * quotient;
    var missing = level === 1 ? "dividend" : level === 2 ? rng.pick(["dividend", "divisor"]) : rng.pick(["dividend", "divisor"]);
    var expression = missing === "dividend" ? "? ÷ " + formatInteger(divisor) + " = " + formatInteger(quotient) : formatInteger(dividend) + " ÷ ? = " + formatInteger(quotient);
    var answer = missing === "dividend" ? dividend : divisor;
    return makeQuestion("division_missing_term", level, "inverse division", { dividend: dividend, divisor: divisor, quotient: quotient, missing: missing }, t("question.missing", "Find the missing integer."), expression, "Use dividend = divisor × quotient.", answer, [formatInteger(divisor) + " × " + formatInteger(quotient) + " = " + formatInteger(dividend)], ["missing-" + missing, "factor-" + digitBand(divisor)], ["factor-role-confusion"], { recalledFacts: 1 });
  };

  GENERATORS.complement_to_landmark = function (level, rng) {
    var target = rng.pick(roundTargets(level));
    var complement = rng.int(1, Math.max(2, Math.floor(target * 0.8)));
    var value = target - complement;
    return makeQuestion("complement_to_landmark", level, "complement to stated target", { value: value, target: target, complement: complement }, t("question.complement", "Find the complement."), formatInteger(value) + " + ? = " + formatInteger(target), "Count up to the stated target.", complement, [formatInteger(value) + " → " + formatInteger(target) + " is " + formatInteger(complement)], ["target-" + digitBand(target), "remainder-" + (complement < target / 3 ? "low" : complement > target * 2 / 3 ? "high" : "middle")], ["wrong-target-scale"], { boundaryJumps: 1 });
  };

  GENERATORS.complement_next_multiple = function (level, rng) {
    var multiple = rng.pick(level === 1 ? [10] : level === 2 ? [10, 100] : level === 3 ? [25, 50, 100] : level === 4 ? [250, 500] : [500, 1000]);
    var quotient = rng.int(1, level <= 2 ? 9 : level <= 4 ? 30 : 100);
    var exact = rng.chance(0.2);
    var remainder = exact ? 0 : rng.int(1, multiple - 1);
    var value = quotient * multiple + remainder;
    var answer = exact ? multiple : multiple - remainder;
    var next = value + answer;
    return makeQuestion("complement_next_multiple", level, "strict next multiple", { value: value, multiple: multiple, remainder: remainder, next: next }, t("question.nextMultiple", "How much reaches the next strictly greater multiple?"), formatInteger(value) + " → next multiple of " + formatInteger(multiple), "If the value is already a multiple, move one full interval.", answer, [formatInteger(value) + " + " + formatInteger(answer) + " = " + formatInteger(next)], ["unit-" + multiple, exact ? "exact-multiple" : "between"], ["zero-on-exact-multiple"], { boundaryJumps: 1 });
  };

  GENERATORS.complement_two_stage = function (level, rng) {
    var target = rng.pick(level === 2 ? [100] : level === 3 ? [500, 1000] : level === 4 ? [1000, 2500, 5000] : [5000, 10000, 25000]);
    var intermediateUnit = target <= 100 ? 10 : target <= 1000 ? 100 : 1000;
    var intermediate = target - rng.int(1, Math.max(1, Math.floor(target / intermediateUnit) - 1)) * intermediateUnit;
    var firstJump = rng.int(1, Math.max(2, Math.floor(intermediateUnit * 0.8)));
    var value = intermediate - firstJump;
    var secondJump = target - intermediate;
    var answer = firstJump + secondJump;
    return makeQuestion("complement_two_stage", level, "count up in stages", { value: value, intermediate: intermediate, target: target, firstJump: firstJump, secondJump: secondJump }, t("question.complement", "Find the complement."), formatInteger(value) + " + ? = " + formatInteger(target), level <= 3 ? "Count up through " + formatInteger(intermediate) + "." : "Choose a useful intermediate landmark.", answer, [formatInteger(value) + " → " + formatInteger(intermediate) + " is " + formatInteger(firstJump), formatInteger(intermediate) + " → " + formatInteger(target) + " is " + formatInteger(secondJump), formatInteger(firstJump) + " + " + formatInteger(secondJump) + " = " + formatInteger(answer)], ["target-" + digitBand(target), "intermediate-" + digitBand(intermediate)], ["stopped-at-intermediate"], { boundaryJumps: 2, intermediateTotals: 3 });
  };

  var PERCENT_STRATEGIES = {
    1: "divide by 100",
    2: "divide by 50",
    5: "divide by 20",
    10: "divide by 10",
    20: "divide by 5",
    25: "divide by 4",
    50: "divide by 2",
    75: "take three quarters",
    100: "keep the whole"
  };

  function friendlyBase(percent, level, rng) {
    var unit = 100 / gcd(percent, 100);
    return unit * rng.int(2, level <= 2 ? 20 : level === 3 ? 50 : level === 4 ? 150 : 500);
  }

  function gcd(a, b) {
    while (b) {
      var temp = a % b;
      a = b;
      b = temp;
    }
    return Math.abs(a);
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  GENERATORS.percentage_benchmark = function (level, rng) {
    var sets = { 1: [10, 50, 100], 2: [5, 10, 20, 25, 50], 3: [1, 2, 5, 10, 20, 25, 50, 75], 4: [1, 2, 5, 10, 20, 25, 50, 75], 5: [1, 2, 5, 10, 20, 25, 50, 75] };
    var percent = rng.pick(sets[level]);
    var base = friendlyBase(percent, level, rng);
    var answer = base * percent / 100;
    return makeQuestion("percentage_benchmark", level, "benchmark " + percent + "%", { percent: percent, base: base }, t("question.compute", "Compute mentally."), percent + "% of " + formatInteger(base), "Use the benchmark: " + (PERCENT_STRATEGIES[percent] || "scale from 1%") + ".", answer, [formatInteger(base) + " × " + percent + " ÷ 100 = " + formatInteger(answer)], ["percent-" + percent, "base-" + digitBand(base)], ["five-vs-twenty-percent"], { recalledFacts: 1 });
  };

  var COMPOSITE_PARTS = {
    12: [[10, 2]],
    15: [[10, 5]],
    18: [[20, -2]],
    30: [[20, 10]],
    35: [[25, 10]],
    45: [[50, -5]],
    65: [[50, 10, 5]],
    85: [[100, -15]]
  };

  GENERATORS.percentage_composite = function (level, rng) {
    var candidates = level === 2 ? [15, 30] : level === 3 ? [12, 15, 18, 35, 45] : level === 4 ? [12, 18, 35, 45, 65] : [12, 18, 35, 45, 65, 85];
    var percent = rng.pick(candidates);
    var parts = COMPOSITE_PARTS[percent][0];
    var required = parts.reduce(function (result, part) { return lcm(result, 100 / gcd(Math.abs(part), 100)); }, 1);
    var base = required * rng.int(2, level <= 3 ? 30 : 100);
    var componentValues = parts.map(function (part) { return base * Math.abs(part) / 100; });
    var answer = base * percent / 100;
    var expression = parts.map(function (part, index) {
      return (index && part > 0 ? "+ " : part < 0 ? "− " : "") + Math.abs(part) + "% = " + formatInteger(componentValues[index]);
    }).join("; ");
    return makeQuestion("percentage_composite", level, "benchmark decomposition " + parts.join(","), { percent: percent, base: base, parts: parts, componentValues: componentValues }, t("question.compute", "Compute mentally."), percent + "% of " + formatInteger(base), level <= 3 ? "Build it from benchmark percentages of the original base." : "Choose a short benchmark decomposition.", answer, [expression, "combine → " + formatInteger(answer)], ["percent-" + percent, "parts-" + parts.join("_")], ["chained-base-error"], { recalledFacts: parts.length, decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.percentage_swap_or_scale = function (level, rng) {
    var percent = rng.pick(level === 3 ? [12, 15, 18, 20, 24] : [12, 15, 18, 24, 25, 32, 40]);
    var bases = [25, 50, 75, 100];
    var base = rng.pick(bases);
    while ((percent * base) % 100 !== 0) base = rng.pick(bases);
    var answer = percent * base / 100;
    return makeQuestion("percentage_swap_or_scale", level, "swap percentage operands", { percent: percent, base: base }, t("question.compute", "Compute mentally."), percent + "% of " + formatInteger(base), level === 3 ? "Swap it to " + base + "% of " + percent + "." : "A commutative percentage swap makes this friendlier.", answer, [percent + "% of " + base + " = " + base + "% of " + percent, base + "% of " + percent + " = " + answer], ["percent-" + percent, "swapped-benchmark-" + base], ["percentage-swap-not-recognized"], { recalledFacts: 1, decompositions: 1, intermediateTotals: 2 });
  };

  GENERATORS.percentage_missing_base = function (level, rng) {
    var sets = level === 2 ? [25, 50] : level === 3 ? [10, 20, 25, 50, 75] : level === 4 ? [5, 10, 15, 20, 25, 50, 75] : [5, 10, 15, 20, 25, 35, 50, 75];
    var percent = rng.pick(sets);
    var base = friendlyBase(percent, level, rng);
    var part = base * percent / 100;
    return makeQuestion("percentage_missing_base", level, "recover base from " + percent + "%", { percent: percent, base: base, part: part }, t("question.missing", "Find the missing integer."), percent + "% of ? = " + formatInteger(part), "Reverse the benchmark percentage.", base, [formatInteger(part) + " × 100 ÷ " + percent + " = " + formatInteger(base)], ["percent-" + percent, "base-" + digitBand(base)], ["returned-part", "percent-treated-as-difference"], { recalledFacts: 1 });
  };

  GENERATORS.percentage_missing_percent = function (level, rng) {
    var sets = level === 2 ? [25, 50] : level === 3 ? [10, 20, 25, 50, 75] : level === 4 ? [5, 12, 15, 18, 25, 35, 50, 75] : [2, 5, 12, 15, 18, 24, 35, 45, 75];
    var percent = rng.pick(sets);
    var base = friendlyBase(percent, level, rng);
    var part = base * percent / 100;
    return makeQuestion("percentage_missing_percent", level, "recover percentage rate", { percent: percent, base: base, part: part }, t("question.missingPercent", "Find the missing integer percentage."), formatInteger(part) + " is what integer percent of " + formatInteger(base) + "?", "Enter the integer only; omit the % sign.", percent, [formatInteger(part) + " × 100 ÷ " + formatInteger(base) + " = " + percent], ["percent-" + percent, "scale-" + gcd(part, base)], ["difference-instead-of-rate"], { recalledFacts: 1 });
  };

  function validateQuestion(question) {
    ["categoryId", "subcategoryId", "familyId", "level", "strategy", "difficultyDimensions", "misconceptionsTargeted", "parameters", "canonicalAnswer", "workedSteps", "structuralSignature"].forEach(function (key) {
      if (question[key] === undefined || question[key] === null) throw new Error("Missing question metadata " + key);
    });
    if (!GENERATORS[question.familyId]) throw new Error("Missing generator " + question.familyId);
    if (!familyById(question.familyId).levels.includes(question.level)) throw new Error("Unsupported level");
    if (!question.prompt.expression || /\{[^}]+\}/.test(question.prompt.expression + question.prompt.title + question.prompt.note)) throw new Error("Invalid prompt");
    var answer = BigInt(question.canonicalAnswer);
    if (answer > ANSWER_LIMIT || answer < -ANSWER_LIMIT) throw new Error("Answer outside learner-facing ceiling");
    if (question.mentalCost.intermediateTotals > 4 || question.workedSteps.length > 4) throw new Error("Mental route too long");
    var lastWorkedStep = String(question.workedSteps[question.workedSteps.length - 1]);
    if (!lastWorkedStep.includes(question.canonicalAnswer) && !lastWorkedStep.includes(formatInteger(question.canonicalAnswer))) throw new Error("Worked route does not end at canonical answer");
    if (normalizeInteger(question.canonicalAnswer) !== question.canonicalAnswer) throw new Error("Canonical parser failure");
    if (BigInt(deriveExpected(question)) !== answer) throw new Error("Independent answer derivation failed");
    if (question.familyId.indexOf("divide") >= 0 || question.familyId === "division_missing_term") {
      var p = question.parameters;
      if (p.dividend !== undefined && p.divisor !== undefined && p.quotient !== undefined && p.dividend !== p.divisor * p.quotient) throw new Error("Inexact division relationship");
    }
    if (question.categoryId === "percentages") {
      var percent = question.parameters.percent;
      var base = question.parameters.base;
      if (percent !== undefined && base !== undefined && (percent * base) % 100 !== 0) throw new Error("Nonintegral percentage");
    }
  }

  function deriveExpected(question) {
    var p = question.parameters;
    if (question.familyId === "add_place_values") return p.a + p.b;
    if (question.familyId === "add_missing_addend") return p.missing;
    if (question.familyId === "add_bridge_landmark") return p.a + p.b;
    if (question.familyId === "add_compensate_round") return p.a + p.near;
    if (question.familyId === "add_compatible_group") return p.addends.reduce(function (sum, value) { return sum + value; }, 0);
    if (question.familyId === "subtract_place_values" || question.familyId === "subtract_equal_compensation") return p.a - p.b;
    if (question.familyId === "subtract_count_up") return p.high - p.low;
    if (question.familyId === "subtract_missing_term") return p.missingPosition === "minuend" ? p.a : p.b;
    if (question.familyId === "multiplication_fact") return p.inverse ? p.b : p.product;
    if (question.familyId === "multiply_distribute") return p.a * p.factor;
    if (question.familyId === "multiply_near_square") return p.left * p.right;
    if (question.familyId === "multiply_double_half") return p.a * p.b;
    if (question.familyId === "multiply_landmark") return p.a * p.multiplier;
    if (["divide_exact_quotient", "divide_factorized", "divide_scale_both"].includes(question.familyId)) return p.quotient;
    if (question.familyId === "division_missing_term") return p.missing === "dividend" ? p.dividend : p.divisor;
    if (question.familyId === "complement_to_landmark") return p.target - p.value;
    if (question.familyId === "complement_next_multiple") return p.next - p.value;
    if (question.familyId === "complement_two_stage") return p.target - p.value;
    if (["percentage_benchmark", "percentage_composite", "percentage_swap_or_scale"].includes(question.familyId)) return p.base * p.percent / 100;
    if (question.familyId === "percentage_missing_base") return p.base;
    if (question.familyId === "percentage_missing_percent") return p.percent;
    throw new Error("No independent derivation for " + question.familyId);
  }

  function generateQuestion(familyId, level, seed, ignoreHistory) {
    var family = familyById(familyId);
    if (!family.levels.includes(level)) level = family.levels.reduce(function (best, candidate) {
      return Math.abs(candidate - level) < Math.abs(best - level) ? candidate : best;
    }, family.levels[0]);
    var rng = new Rng(seed);
    var candidate;
    var attempts = 0;
    do {
      candidate = GENERATORS[familyId](level, rng);
      candidate.parameters.seed = seed >>> 0;
      candidate.parameters.generationAttempt = attempts;
      attempts += 1;
    } while (!ignoreHistory && attempts < 100 && (recentSignatures.includes(candidate.structuralSignature) || recentExpressions.includes(candidate.prompt.expression)));
    if (!ignoreHistory && attempts >= 100 && typeof console !== "undefined") console.warn("Question uniqueness fallback", familyId, level, seed);
    validateQuestion(candidate);
    return candidate;
  }

  function checkQuestion(answer, question) {
    var normalized = normalizeInteger(answer);
    return {
      correct: normalized !== null && normalized === question.canonicalAnswer,
      normalized: normalized,
      expected: question.canonicalAnswer,
      diagnosis: normalized === null ? t("feedback.integerOnly", "Enter one exact integer with no units or expression.") : diagnose(question, BigInt(normalized)),
      worked: question.workedSteps.join(" → ")
    };
  }

  function diagnose(question, answer) {
    var expected = BigInt(question.canonicalAnswer);
    var p = question.parameters;
    if (question.familyId.indexOf("add_") === 0 && [10n, 100n, 1000n].includes(expected - answer)) return t("feedback.lostCarry", "The result is short by a place-value bridge; keep the carried ten, hundred, or thousand.");
    if (question.familyId === "add_compensate_round" && answer === BigInt(p.a + p.round)) return t("feedback.compensation", "You rounded correctly but did not undo the small change.");
    if (question.familyId === "add_compatible_group" && p.addends.some(function (value) { return BigInt(p.addends.reduce(function (sum, item) { return sum + item; }, 0) - value) === answer; })) return t("feedback.omittedAddend", "Your total omits one addend; mark each member after grouping it.");
    if (question.categoryId === "subtraction" && answer === -expected) return t("feedback.reversedSign", "The magnitude is right, but subtraction keeps the displayed operand order.");
    if (question.familyId === "subtract_equal_compensation") return t("feedback.equalCompensation", "Shift both operands by the same amount; changing only one changes the difference.");
    if (question.categoryId === "multiplication" && p.a !== undefined && (answer === BigInt(p.a + (p.b || p.factor || p.multiplier || 0)))) return t("feedback.addedFactors", "This answer adds the factors; multiplication needs equal groups or a product strategy.");
    if (question.familyId === "multiply_distribute" && answer === BigInt(p.a * p.landmark)) return t("feedback.distribution", "You found the landmark product but omitted the distributed correction.");
    if (question.familyId === "multiply_double_half") return t("feedback.doubleHalf", "Halve one factor and double the other together so the product stays unchanged.");
    if (question.familyId === "divide_factorized" && answer === BigInt(p.dividend / p.factors[0])) return t("feedback.incompleteFactorization", "That is the first exact division step; divide by the remaining factor too.");
    if (question.familyId === "complement_next_multiple" && p.remainder === 0 && answer === 0n) return t("feedback.strictNext", "“Next” is strictly greater, so an exact multiple needs one full interval.");
    if (question.categoryId === "percentages" && p.percent === 5 && answer === BigInt(p.base / 5)) return t("feedback.fivePercent", "Dividing by 5 gives 20%; 5% is one twentieth.");
    if (question.familyId === "percentage_missing_percent" && answer === BigInt(p.base - p.part)) return t("feedback.rateVsDifference", "The question asks for a rate, not the numerical difference between whole and part.");
    return t("feedback.route", "Use the shown mental route and keep each intermediate exact.");
  }

  function defaultCell() {
    return { attempts: 0, correct: 0, streak: 0, recent: [], totalMs: 0, mastery: 0, strategies: {}, misconceptions: {} };
  }

  function defaultProgress() {
    var enabled = {};
    CATEGORIES.forEach(function (category) { enabled[category.id] = true; });
    return {
      version: 2,
      activeView: "practice",
      settings: { adaptive: true, enabledCategories: enabled },
      manual: { categoryId: CATEGORIES[0].id, familyId: FAMILIES[0].id, level: 1 },
      cells: {},
      history: [],
      legacyCategoryTotals: {}
    };
  }

  function migrateLegacy(legacy) {
    var migrated = defaultProgress();
    if (!legacy || !legacy.cells) return migrated;
    CATEGORIES.forEach(function (category) {
      var total = { attempts: 0, correct: 0, totalMs: 0 };
      LEVELS.forEach(function (level) {
        var cell = legacy.cells[category.id + ":" + level] || {};
        total.attempts += Number(cell.attempts) || 0;
        total.correct += Number(cell.correct) || 0;
        total.totalMs += Number(cell.totalMs) || 0;
      });
      if (total.attempts) migrated.legacyCategoryTotals[category.id] = total;
    });
    migrated.history.push({ type: "legacy-category-migration", at: Date.now() });
    return migrated;
  }

  function mergeProgress(base, stored) {
    if (!stored || stored.version !== 2) return base;
    base.activeView = ["practice", "matrix", "stats", "learn", "settings"].includes(stored.activeView) ? stored.activeView : "practice";
    if (stored.settings) {
      base.settings.adaptive = stored.settings.adaptive !== false;
      if (stored.settings.enabledCategories) Object.assign(base.settings.enabledCategories, stored.settings.enabledCategories);
    }
    if (stored.manual && FAMILIES.some(function (family) { return family.id === stored.manual.familyId; })) {
      var family = familyById(stored.manual.familyId);
      base.manual.categoryId = family.categoryId;
      base.manual.familyId = family.id;
      base.manual.level = family.levels.includes(Number(stored.manual.level)) ? Number(stored.manual.level) : family.levels[0];
    }
    if (stored.cells && typeof stored.cells === "object") base.cells = stored.cells;
    if (Array.isArray(stored.history)) base.history = stored.history.slice(-300);
    if (stored.legacyCategoryTotals) base.legacyCategoryTotals = stored.legacyCategoryTotals;
    return base;
  }

  function loadProgress() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return mergeProgress(defaultProgress(), JSON.parse(stored));
      var legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) return migrateLegacy(JSON.parse(legacy));
    } catch (error) {
      console.warn("Could not load progress", error);
    }
    return defaultProgress();
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn("Could not save progress", error);
    }
  }

  function cellKey(familyId, level) {
    return familyId + ":" + level;
  }

  function getCell(familyId, level) {
    var key = cellKey(familyId, level);
    if (!progress.cells[key]) progress.cells[key] = defaultCell();
    return progress.cells[key];
  }

  function accuracy(cell) {
    return cell.attempts ? Math.round(cell.correct * 100 / cell.attempts) : 0;
  }

  function recentAccuracy(cell) {
    return cell.recent.length ? cell.recent.filter(Boolean).length / cell.recent.length : 0;
  }

  function closestLevel(family, level) {
    return family.levels.reduce(function (best, candidate) {
      return Math.abs(candidate - level) < Math.abs(best - level) ? candidate : best;
    }, family.levels[0]);
  }

  function levelUnlocked(family, level) {
    var index = family.levels.indexOf(level);
    if (index <= 0) return true;
    var previous = getCell(family.id, family.levels[index - 1]);
    return previous.attempts >= 5 && recentAccuracy(previous) >= 0.8;
  }

  function prerequisiteEvidence(familyId) {
    return (PREREQUISITES[familyId] || []).every(function (prerequisiteId) {
      var totals = familyById(prerequisiteId).levels.reduce(function (result, level) {
        var cell = getCell(prerequisiteId, level);
        result.attempts += cell.attempts;
        result.correct += cell.correct;
        return result;
      }, { attempts: 0, correct: 0 });
      return totals.attempts >= 3 && totals.correct / totals.attempts >= 0.67;
    });
  }

  function enabledFamilies() {
    return FAMILIES.filter(function (family) {
      return progress.settings.enabledCategories[family.categoryId] !== false && prerequisiteEvidence(family.id);
    });
  }

  function optionalShareTooHigh() {
    var recent = progress.history.filter(function (entry) { return entry.familyId; }).slice(-30);
    if (recent.length < 10) return false;
    var optional = recent.filter(function (entry) { return ["multiply_near_square", "percentage_swap_or_scale"].includes(entry.familyId); }).length;
    return optional / recent.length >= 0.1;
  }

  function chooseAdaptive() {
    var families = enabledFamilies();
    if (optionalShareTooHigh()) families = families.filter(function (family) { return !["multiply_near_square", "percentage_swap_or_scale"].includes(family.id); });
    if (!families.length) {
      families = FAMILIES.filter(function (family) { return progress.settings.enabledCategories[family.categoryId] !== false && !(PREREQUISITES[family.id] || []).length; });
    }
    if (!families.length) families = [FAMILIES[0]];
    var cells = families.map(function (family) {
      var unlocked = family.levels.filter(function (level) { return levelUnlocked(family, level); });
      var level = unlocked[unlocked.length - 1] || family.levels[0];
      return { family: family, level: level, cell: getCell(family.id, level) };
    });
    var roll = sessionRng.int(1, 100);
    if (roll <= 50) {
      cells.sort(function (a, b) { return (a.cell.mastery || 0) - (b.cell.mastery || 0) || a.cell.attempts - b.cell.attempts; });
      return sessionRng.pick(cells.slice(0, Math.min(6, cells.length)));
    }
    if (roll <= 75) {
      var practiced = cells.filter(function (item) { return item.cell.attempts >= 5; });
      return sessionRng.pick(practiced.length ? practiced : cells);
    }
    if (roll <= 90) {
      var shaky = cells.filter(function (item) { return item.cell.attempts && recentAccuracy(item.cell) < 0.8; });
      return sessionRng.pick(shaky.length ? shaky : cells);
    }
    var stretch = sessionRng.pick(cells);
    var nextIndex = stretch.family.levels.indexOf(stretch.level) + 1;
    if (nextIndex < stretch.family.levels.length && levelUnlocked(stretch.family, stretch.family.levels[nextIndex])) stretch.level = stretch.family.levels[nextIndex];
    return stretch;
  }

  function startQuestion() {
    resumeTimer();
    var selected = progress.settings.adaptive
      ? chooseAdaptive()
      : { family: familyById(progress.manual.familyId), level: progress.manual.level };
    var seed = sessionRng.next();
    currentQuestion = generateQuestion(selected.family.id, selected.level, seed, false);
    recentSignatures.push(currentQuestion.structuralSignature);
    recentExpressions.push(currentQuestion.prompt.expression);
    recentSignatures = recentSignatures.slice(-15);
    recentExpressions = recentExpressions.slice(-100);
    answered = false;
    pausedMs = 0;
    pauseStartedAt = 0;
    questionStartedAt = Date.now();
    renderQuestion();
    renderPracticeControls();
    renderCurrentMetrics();
  }

  function elapsedMs() {
    var activePause = pauseStartedAt ? Date.now() - pauseStartedAt : 0;
    return Math.max(0, Date.now() - questionStartedAt - pausedMs - activePause);
  }

  function pauseTimer() {
    if (pauseStartedAt || answered) return;
    pauseStartedAt = Date.now();
    elements.practiceMain.classList.add("paused");
    elements.pauseBtn.disabled = true;
  }

  function resumeTimer() {
    if (pauseStartedAt) pausedMs += Date.now() - pauseStartedAt;
    pauseStartedAt = 0;
    if (elements.practiceMain) elements.practiceMain.classList.remove("paused");
    if (elements.pauseBtn) elements.pauseBtn.disabled = false;
  }

  function recordResult(result, duration) {
    var cell = getCell(currentQuestion.familyId, currentQuestion.level);
    cell.attempts += 1;
    cell.correct += result.correct ? 1 : 0;
    cell.streak = result.correct ? cell.streak + 1 : 0;
    cell.recent = cell.recent.concat([result.correct]).slice(-10);
    cell.totalMs += duration;
    cell.mastery = Math.round(Math.min(1, cell.attempts / 5) * recentAccuracy(cell) * 100);
    cell.strategies[currentQuestion.strategy] = (cell.strategies[currentQuestion.strategy] || 0) + 1;
    if (!result.correct) currentQuestion.misconceptionsTargeted.forEach(function (name) { cell.misconceptions[name] = (cell.misconceptions[name] || 0) + 1; });
    progress.history.push({
      at: Date.now(),
      familyId: currentQuestion.familyId,
      level: currentQuestion.level,
      strategy: currentQuestion.strategy,
      signature: currentQuestion.structuralSignature,
      seed: currentQuestion.parameters.seed,
      correct: result.correct,
      normalizedAnswer: result.normalized,
      elapsedMs: duration
    });
    progress.history = progress.history.slice(-300);
    saveProgress();
  }

  function renderQuestion() {
    var family = familyById(currentQuestion.familyId);
    elements.questionCategory.textContent = categoryById(currentQuestion.categoryId).title;
    elements.questionFamily.textContent = family.title;
    elements.questionLevel.textContent = t("practice.level", "Level") + " " + currentQuestion.level;
    elements.questionPrompt.innerHTML = "";
    var title = document.createElement("div");
    title.className = "prompt-title";
    title.textContent = currentQuestion.prompt.title;
    var expression = document.createElement("div");
    expression.className = "prompt-expression";
    expression.textContent = currentQuestion.prompt.expression;
    var note = document.createElement("div");
    note.className = "prompt-note";
    note.textContent = currentQuestion.prompt.note;
    elements.questionPrompt.appendChild(title);
    elements.questionPrompt.appendChild(expression);
    elements.questionPrompt.appendChild(note);
    elements.answerInput.value = "";
    elements.answerInput.disabled = false;
    elements.submitBtn.disabled = false;
    elements.submitBtn.innerHTML = t("practice.check", "Check") + " <span class=\"key-symbol\">↵</span>";
    elements.nextBtn.classList.add("hidden");
    elements.skipBtn.classList.remove("hidden");
    elements.feedback.className = "feedback hidden";
    elements.pauseBtn.disabled = false;
    document.querySelector("[data-keypad-action=\"submit\"]").textContent = t("practice.check", "Check");
    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) elements.answerInput.focus();
  }

  function showFeedback(result, duration) {
    elements.feedback.className = "feedback " + (result.correct ? "correct" : "incorrect");
    elements.feedback.innerHTML = "";
    var verdict = document.createElement("strong");
    verdict.textContent = result.correct ? t("feedback.correct", "Correct") : t("feedback.notQuite", "Not quite");
    elements.feedback.appendChild(verdict);
    if (!result.correct) {
      var diagnosis = document.createElement("div");
      diagnosis.textContent = result.diagnosis;
      elements.feedback.appendChild(diagnosis);
    }
    var route = document.createElement("div");
    route.className = "worked-route";
    route.textContent = (result.correct ? "" : t("feedback.expected", "Expected") + " " + formatInteger(result.expected) + ". ") + result.worked;
    elements.feedback.appendChild(route);
    var timing = document.createElement("span");
    timing.className = "feedback-time";
    timing.textContent = t("feedback.time", "Time") + ": " + formatSeconds(duration);
    elements.feedback.appendChild(timing);
  }

  function submitAnswer(event) {
    event.preventDefault();
    if (!currentQuestion || pauseStartedAt) return;
    if (answered) {
      startQuestion();
      return;
    }
    var result = checkQuestion(elements.answerInput.value, currentQuestion);
    var duration = elapsedMs();
    recordResult(result, duration);
    answered = true;
    elements.answerInput.disabled = true;
    elements.submitBtn.innerHTML = t("practice.next", "Next") + " <span class=\"key-symbol\">↵</span>";
    elements.nextBtn.classList.remove("hidden");
    elements.skipBtn.classList.add("hidden");
    elements.pauseBtn.disabled = true;
    document.querySelector("[data-keypad-action=\"submit\"]").textContent = t("practice.next", "Next");
    showFeedback(result, duration);
    renderCurrentMetrics();
    renderSummary();
  }

  function renderPracticeControls() {
    var activeFamily = currentQuestion ? familyById(currentQuestion.familyId) : familyById(progress.manual.familyId);
    var categoryId = currentQuestion && progress.settings.adaptive ? currentQuestion.categoryId : progress.manual.categoryId;
    elements.categorySelect.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.title;
      option.selected = category.id === categoryId;
      elements.categorySelect.appendChild(option);
    });
    elements.familySelect.innerHTML = "";
    familiesForCategory(categoryId).forEach(function (family) {
      var option = document.createElement("option");
      option.value = family.id;
      option.textContent = family.title;
      option.selected = family.id === activeFamily.id;
      elements.familySelect.appendChild(option);
    });
    elements.levelSelect.innerHTML = "";
    activeFamily.levels.forEach(function (level) {
      var option = document.createElement("option");
      option.value = String(level);
      option.textContent = t("practice.level", "Level") + " " + level;
      option.selected = currentQuestion ? currentQuestion.level === level : progress.manual.level === level;
      elements.levelSelect.appendChild(option);
    });
    elements.categorySelect.disabled = progress.settings.adaptive;
    elements.familySelect.disabled = progress.settings.adaptive;
    elements.levelSelect.disabled = progress.settings.adaptive;
    elements.adaptiveModeBtn.classList.toggle("secondary-active", progress.settings.adaptive);
    elements.manualModeBtn.classList.toggle("secondary-active", !progress.settings.adaptive);
  }

  function setManual(familyId, level) {
    var family = familyById(familyId);
    progress.settings.adaptive = false;
    progress.manual.categoryId = family.categoryId;
    progress.manual.familyId = family.id;
    progress.manual.level = closestLevel(family, Number(level) || family.levels[0]);
    saveProgress();
    startQuestion();
  }

  function renderCurrentMetrics() {
    if (!currentQuestion) return;
    var cell = getCell(currentQuestion.familyId, currentQuestion.level);
    elements.metricMastery.textContent = Math.round(cell.mastery || 0) + "%";
    elements.metricAccuracy.textContent = accuracy(cell) + "%";
    elements.metricStreak.textContent = String(cell.streak || 0);
    elements.metricAvgTime.textContent = formatSeconds(cell.attempts ? cell.totalMs / cell.attempts : 0);
    elements.questionMastery.textContent = Math.round(cell.mastery || 0) + "% " + t("practice.masterySuffix", "mastery");
    elements.questionMastery.className = "pill " + ((cell.mastery || 0) >= 75 ? "good" : "warn");
  }

  function familyCells() {
    var output = [];
    FAMILIES.forEach(function (family) {
      family.levels.forEach(function (level) {
        output.push({ family: family, category: categoryById(family.categoryId), level: level, cell: getCell(family.id, level) });
      });
    });
    return output;
  }

  function historicalTotals() {
    return Object.keys(progress.legacyCategoryTotals || {}).reduce(function (total, categoryId) {
      var legacy = progress.legacyCategoryTotals[categoryId];
      total.attempts += legacy.attempts || 0;
      total.correct += legacy.correct || 0;
      total.totalMs += legacy.totalMs || 0;
      return total;
    }, { attempts: 0, correct: 0, totalMs: 0 });
  }

  function renderSummary() {
    var cells = familyCells();
    var practiced = cells.filter(function (entry) { return entry.cell.attempts; });
    var totals = practiced.reduce(function (total, entry) {
      total.attempts += entry.cell.attempts;
      total.correct += entry.cell.correct;
      return total;
    }, { attempts: 0, correct: 0 });
    var legacy = historicalTotals();
    var shownAttempts = totals.attempts + legacy.attempts;
    var shownCorrect = totals.correct + legacy.correct;
    var mastery = practiced.length ? practiced.reduce(function (sum, entry) { return sum + (entry.cell.mastery || 0); }, 0) / practiced.length : 0;
    elements.summaryMastery.textContent = Math.round(mastery) + "%";
    elements.summaryAccuracy.textContent = (shownAttempts ? Math.round(shownCorrect * 100 / shownAttempts) : 0) + "%";
    elements.summaryAttempts.textContent = String(shownAttempts);
  }

  function renderMatrix() {
    elements.matrix.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var heading = document.createElement("h3");
      heading.className = "matrix-heading";
      heading.textContent = category.title;
      elements.matrix.appendChild(heading);
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>" + t("practice.family", "Family") + "</th>" + LEVELS.map(function (level) { return "<th>L" + level + "</th>"; }).join("") + "</tr>";
      table.appendChild(thead);
      var body = document.createElement("tbody");
      familiesForCategory(category.id).forEach(function (family) {
        var row = document.createElement("tr");
        var name = document.createElement("td");
        name.innerHTML = "<strong></strong><span class=\"subcategory-label\"></span>";
        name.querySelector("strong").textContent = family.title;
        name.querySelector("span").textContent = family.subcategory;
        row.appendChild(name);
        LEVELS.forEach(function (level) {
          var td = document.createElement("td");
          td.className = "level-cell";
          if (!family.levels.includes(level)) {
            td.classList.add("unavailable-cell");
            td.textContent = "—";
          } else {
            var cell = getCell(family.id, level);
            var button = document.createElement("button");
            button.type = "button";
            button.className = "level-button";
            button.dataset.familyId = family.id;
            button.dataset.level = String(level);
            if (cell.attempts >= 3 && cell.mastery < 45) button.classList.add("weak");
            if (cell.mastery >= 75) button.classList.add("ready");
            button.innerHTML = "<strong>" + Math.round(cell.mastery || 0) + "%</strong><span>" + cell.attempts + " " + t("stats.tries", "tries") + "</span><div class=\"bar\"><span style=\"width:" + clamp(cell.mastery || 0, 0, 100) + "%\"></span></div>";
            td.appendChild(button);
          }
          row.appendChild(td);
        });
        body.appendChild(row);
      });
      table.appendChild(body);
      elements.matrix.appendChild(table);
    });
  }

  function renderStats() {
    var cells = familyCells();
    var practiced = cells.filter(function (entry) { return entry.cell.attempts; });
    var totals = practiced.reduce(function (total, entry) {
      total.attempts += entry.cell.attempts;
      total.correct += entry.cell.correct;
      total.totalMs += entry.cell.totalMs;
      return total;
    }, historicalTotals());
    elements.statTotalAttempts.textContent = String(totals.attempts);
    elements.statTotalCorrect.textContent = String(totals.correct);
    elements.statTotalTime.textContent = formatMinutes(totals.totalMs);
    elements.statActiveCells.textContent = practiced.length + "/" + cells.length;
    renderRanked("weakList", practiced.slice().sort(function (a, b) { return (a.cell.mastery || 0) - (b.cell.mastery || 0); }).slice(0, 8));
    renderRanked("strongList", practiced.slice().sort(function (a, b) { return (b.cell.mastery || 0) - (a.cell.mastery || 0); }).slice(0, 8));
  }

  function renderRanked(id, cells) {
    var container = elements[id];
    container.innerHTML = "";
    if (!cells.length) {
      var empty = document.createElement("div");
      empty.className = "list-item";
      empty.textContent = t("stats.noAttemptsYet", "No attempts yet");
      container.appendChild(empty);
      return;
    }
    cells.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "list-item";
      button.dataset.familyId = entry.family.id;
      button.dataset.level = String(entry.level);
      button.innerHTML = "<div><strong></strong><span></span></div><span class=\"pill\"></span>";
      button.querySelector("strong").textContent = entry.family.title + " L" + entry.level;
      button.querySelector("div span").textContent = entry.cell.attempts + " " + t("stats.tries", "tries") + ", " + accuracy(entry.cell) + "%";
      button.querySelector(".pill").textContent = Math.round(entry.cell.mastery || 0) + "%";
      container.appendChild(button);
    });
  }

  function renderLearn() {
    elements.learnGrid.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var section = document.createElement("section");
      section.className = "learn-category";
      var heading = document.createElement("h2");
      heading.textContent = category.title;
      section.appendChild(heading);
      var grid = document.createElement("div");
      grid.className = "learn-category-grid";
      familiesForCategory(category.id).forEach(function (family) {
        var card = document.createElement("article");
        card.className = "learn-card";
        card.id = "learn-card-" + family.id;
        if (family.id === learnSpotlightId) card.classList.add("spotlight");
        var title = document.createElement("h3");
        title.textContent = family.title;
        var strategy = document.createElement("span");
        strategy.className = "pill";
        strategy.textContent = family.strategy;
        var rules = document.createElement("p");
        rules.textContent = family.learn.rules;
        var example = document.createElement("code");
        example.textContent = family.learn.example;
        card.appendChild(title);
        card.appendChild(strategy);
        card.appendChild(rules);
        card.appendChild(example);
        grid.appendChild(card);
      });
      section.appendChild(grid);
      elements.learnGrid.appendChild(section);
    });
    if (learnSpotlightId) window.setTimeout(function () {
      var card = document.getElementById("learn-card-" + learnSpotlightId);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function renderSettings() {
    elements.enabledCategories.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var label = document.createElement("label");
      label.className = "check-row";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = progress.settings.enabledCategories[category.id] !== false;
      input.dataset.categoryId = category.id;
      var text = document.createElement("span");
      text.textContent = category.title;
      label.appendChild(input);
      label.appendChild(text);
      elements.enabledCategories.appendChild(label);
    });
  }

  function renderAll() {
    document.querySelectorAll(".view").forEach(function (view) { view.classList.toggle("active", view.id === "view-" + progress.activeView); });
    document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("active", button.dataset.view === progress.activeView); });
    renderSummary();
    renderPracticeControls();
    renderCurrentMetrics();
    if (progress.activeView === "matrix") renderMatrix();
    if (progress.activeView === "stats") renderStats();
    if (progress.activeView === "learn") renderLearn();
    if (progress.activeView === "settings") renderSettings();
  }

  function setView(view) {
    if (view !== "learn") learnSpotlightId = null;
    progress.activeView = view;
    saveProgress();
    renderAll();
  }

  function keypadClick(event) {
    var button = event.target.closest("button");
    if (!button || elements.answerInput.disabled || pauseStartedAt) return;
    if (button.dataset.keypadInsert !== undefined) {
      var start = elements.answerInput.selectionStart === null ? elements.answerInput.value.length : elements.answerInput.selectionStart;
      var end = elements.answerInput.selectionEnd === null ? start : elements.answerInput.selectionEnd;
      elements.answerInput.value = elements.answerInput.value.slice(0, start) + button.dataset.keypadInsert + elements.answerInput.value.slice(end);
      elements.answerInput.focus();
    }
    if (button.dataset.keypadAction === "backspace") elements.answerInput.value = elements.answerInput.value.slice(0, -1);
    if (button.dataset.keypadAction === "clear") elements.answerInput.value = "";
    if (button.dataset.keypadAction === "submit" || button.dataset.keypadAction === "next") elements.answerForm.requestSubmit();
  }

  function exportProgress() {
    elements.dataBox.value = JSON.stringify(progress, null, 2);
  }

  function copyProgress() {
    if (!elements.dataBox.value.trim()) exportProgress();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(elements.dataBox.value).catch(function () { elements.dataBox.select(); });
    else elements.dataBox.select();
  }

  function importProgress() {
    try {
      progress = mergeProgress(defaultProgress(), JSON.parse(elements.dataBox.value));
      saveProgress();
      currentQuestion = null;
      renderAll();
      startQuestion();
    } catch (error) {
      elements.dataBox.value = t("feedback.invalidJson", "Invalid JSON") + ": " + error.message;
    }
  }

  function resetProgress() {
    if (!window.confirm(t("settings.resetConfirm", "Reset all local progress?"))) return;
    progress = defaultProgress();
    saveProgress();
    currentQuestion = null;
    renderAll();
    startQuestion();
  }

  function cacheElements() {
    [
      "practiceMain", "pauseBtn", "adaptiveModeBtn", "manualModeBtn", "questionCategory", "questionFamily", "questionLevel", "questionMastery",
      "questionPrompt", "answerForm", "answerInput", "submitBtn", "nextBtn", "skipBtn", "feedback", "categorySelect", "familySelect", "levelSelect",
      "metricMastery", "metricAccuracy", "metricStreak", "metricAvgTime", "summaryMastery", "summaryAccuracy", "summaryAttempts",
      "matrix", "statTotalAttempts", "statTotalCorrect", "statTotalTime", "statActiveCells", "weakList", "strongList",
      "enabledCategories", "dataBox", "learnGrid"
    ].forEach(function (id) { elements[id] = document.getElementById(id); });
    elements.practiceMain = document.querySelector(".practice-main");
  }

  function wireEvents() {
    document.querySelectorAll("[data-view]").forEach(function (button) {
      button.addEventListener("click", function () { setView(button.dataset.view); });
    });
    elements.adaptiveModeBtn.addEventListener("click", function () { progress.settings.adaptive = true; saveProgress(); startQuestion(); });
    elements.manualModeBtn.addEventListener("click", function () { progress.settings.adaptive = false; saveProgress(); startQuestion(); });
    elements.pauseBtn.addEventListener("click", pauseTimer);
    document.getElementById("resumeBtn").addEventListener("click", resumeTimer);
    document.getElementById("learnCurrentBtn").addEventListener("click", function () {
      if (!currentQuestion) return;
      learnSpotlightId = currentQuestion.familyId;
      setView("learn");
    });
    elements.categorySelect.addEventListener("change", function (event) {
      var family = familiesForCategory(event.target.value)[0];
      setManual(family.id, family.levels[0]);
    });
    elements.familySelect.addEventListener("change", function (event) { setManual(event.target.value, familyById(event.target.value).levels[0]); });
    elements.levelSelect.addEventListener("change", function (event) { setManual(elements.familySelect.value, Number(event.target.value)); });
    elements.answerForm.addEventListener("submit", submitAnswer);
    document.getElementById("answerKeypad").addEventListener("pointerdown", function (event) { event.preventDefault(); });
    document.getElementById("answerKeypad").addEventListener("click", keypadClick);
    elements.nextBtn.addEventListener("click", startQuestion);
    elements.skipBtn.addEventListener("click", startQuestion);
    elements.matrix.addEventListener("click", function (event) {
      var button = event.target.closest("[data-family-id][data-level]");
      if (!button) return;
      setView("practice");
      setManual(button.dataset.familyId, Number(button.dataset.level));
    });
    ["weakList", "strongList"].forEach(function (id) {
      elements[id].addEventListener("click", function (event) {
        var button = event.target.closest("[data-family-id][data-level]");
        if (!button) return;
        setView("practice");
        setManual(button.dataset.familyId, Number(button.dataset.level));
      });
    });
    elements.enabledCategories.addEventListener("change", function (event) {
      if (!event.target.dataset.categoryId) return;
      progress.settings.enabledCategories[event.target.dataset.categoryId] = event.target.checked;
      saveProgress();
    });
    document.getElementById("exportBtn").addEventListener("click", exportProgress);
    document.getElementById("copyBtn").addEventListener("click", copyProgress);
    document.getElementById("importBtn").addEventListener("click", importProgress);
    document.getElementById("resetBtn").addEventListener("click", resetProgress);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && pauseStartedAt) { event.preventDefault(); resumeTimer(); }
      if (event.key === "Enter" && answered && progress.activeView === "practice") { event.preventDefault(); startQuestion(); }
    });
  }

  function runSelfTests() {
    var failures = [];
    function assert(name, condition) {
      if (!condition) failures.push(name);
    }
    assert("26 families", FAMILIES.length === 26);
    assert("26 generators", Object.keys(GENERATORS).length === 26);
    for (var a = 0; a <= 100; a += 1) {
      for (var b = 0; b <= 100; b += 1) {
        assert("addition inverse " + a + ":" + b, a + b - a === b);
        assert("subtraction inverse " + a + ":" + b, a - b + b === a);
      }
    }
    for (var factorA = 2; factorA <= 12; factorA += 1) {
      for (var factorB = 2; factorB <= 12; factorB += 1) {
        assert("fact commute " + factorA + ":" + factorB, factorA * factorB === factorB * factorA);
        assert("division inverse " + factorA + ":" + factorB, factorA * factorB / factorA === factorB);
      }
    }
    for (var target = 10; target <= 1000; target *= 10) {
      for (var value = 0; value < target; value += 1) assert("complement " + target + ":" + value, value + (target - value) === target);
    }
    [1, 2, 5, 10, 20, 25, 50, 75, 100].forEach(function (percent) {
      for (var base = 1; base <= 1000; base += 1) {
        if ((percent * base) % 100 === 0) assert("percentage " + percent + ":" + base, base * percent / 100 === (base / (100 / gcd(percent, 100))) * (percent / gcd(percent, 100)));
      }
    });
    FAMILIES.forEach(function (family, familyIndex) {
      family.levels.forEach(function (level) {
        for (var sample = 0; sample < 100; sample += 1) {
          try {
            var question = generateQuestion(family.id, level, (familyIndex + 1) * 100000 + level * 1000 + sample + 1, true);
            assert("canonical accepted " + family.id + ":" + level + ":" + sample, checkQuestion(question.canonicalAnswer, question).correct);
            assert("metadata " + family.id, question.strategy && question.workedSteps.length && question.mentalCost.intermediateTotals <= 4);
            if (question.familyId.indexOf("divide") >= 0) assert("exact division " + family.id, Number.isInteger(question.parameters.dividend / question.parameters.divisor));
            if (question.categoryId === "percentages") assert("integral percent " + family.id, (question.parameters.percent * question.parameters.base) % 100 === 0);
          } catch (error) {
            failures.push("generator " + family.id + ":" + level + ":" + sample + " " + error.message);
          }
        }
      });
    });
    assert("grouped integer accepted", normalizeInteger("  +1_234,567 ") === "1234567");
    assert("negative zero normalized", normalizeInteger("-0") === "0");
    assert("decimal rejected", normalizeInteger("12.0") === null);
    assert("scientific rejected", normalizeInteger("1e3") === null);
    assert("percent sign rejected", normalizeInteger("25%") === null);
    assert("words rejected", normalizeInteger("twelve") === null);
    var migration = migrateLegacy({ cells: { "addition:1": { attempts: 7, correct: 5, totalMs: 1200 } } });
    assert("legacy attempts retained", migration.legacyCategoryTotals.addition.attempts === 7);
    assert("legacy family mastery starts fresh", Object.keys(migration.cells).length === 0);
    if (failures.length) {
      console.error("Mental arithmetic self-tests failed", failures.slice(0, 50), "total", failures.length);
      return { ok: false, failures: failures.slice(0, 100) };
    }
    console.info("Mental arithmetic self-tests passed: 26 families and " + FAMILIES.reduce(function (count, family) { return count + family.levels.length * 100; }, 0) + " generated instances");
    return { ok: true, failures: [] };
  }

  function init() {
    cacheElements();
    progress = loadProgress();
    sessionRng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
    wireEvents();
    renderAll();
    startQuestion();
  }

  window.runSelfTests = runSelfTests;
  window.MentalArithmeticPractice = {
    categories: CATEGORIES,
    families: FAMILIES,
    generateQuestion: generateQuestion,
    checkQuestion: checkQuestion,
    runSelfTests: runSelfTests
  };

  document.addEventListener("DOMContentLoaded", init);
}());
