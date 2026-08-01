(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.everydayEconomics.v2";
  var LEGACY_STORAGE_KEY = "practiceLab.everydayEconomics.v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var CURRENCY_FORMATS = {
    usd: { symbol: "$", position: "before" },
    eur: { symbol: "EUR", position: "before" },
    sek: { symbol: "kr", position: "after" },
    gbp: { symbol: "GBP", position: "before" },
    none: { symbol: "", position: "none" }
  };
  var progress;
  var sessionRng;
  var currentQuestion = null;
  var currentStartedAt = 0;
  var pauseStartedAt = 0;
  var pausedMs = 0;
  var answered = false;
  var activeAnswerInput = null;
  var calculatorValue = null;
  var recentSignatures = [];
  var recentPrompts = [];
  var learnSpotlightId = null;
  var elements = {};
  var selectorController;
  var keypadButtons;
  var generatedTranslationPairs = null;

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }

  function localizeGeneratedString(value) {
    if (TEXT.localeCode === "en" || value === null || value === undefined) return String(value || "");
    if (generatedTranslationPairs === null) {
      generatedTranslationPairs = t("generatedReplacements", []).slice().sort(function (a, b) {
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
    if (TEXT.localeCode === "en") return question;
    question.prompt.title = localizeGeneratedString(question.prompt.title);
    question.prompt.rows = question.prompt.rows.map(localizeGeneratedString);
    question.prompt.note = localizeGeneratedString(question.prompt.note);
    question.answer.fields.forEach(function (answerField) {
      answerField.label = localizeGeneratedString(answerField.label);
      if (answerField.options) {
        answerField.options.forEach(function (option) {
          option.label = localizeGeneratedString(option.label);
        });
      }
    });
    question.workedSteps = question.workedSteps.map(localizeGeneratedString);
    question.interpretation = localizeGeneratedString(question.interpretation);
    return question;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function gcdBig(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b) {
      var temp = a % b;
      a = b;
      b = temp;
    }
    return a || 1n;
  }

  function rat(numerator, denominator) {
    numerator = BigInt(numerator);
    denominator = BigInt(denominator === undefined ? 1 : denominator);
    if (denominator === 0n) throw new Error("zero denominator");
    if (denominator < 0n) {
      numerator = -numerator;
      denominator = -denominator;
    }
    var divisor = gcdBig(numerator, denominator);
    return { n: numerator / divisor, d: denominator / divisor };
  }

  function addRat(a, b) {
    return rat(a.n * b.d + b.n * a.d, a.d * b.d);
  }

  function subRat(a, b) {
    return rat(a.n * b.d - b.n * a.d, a.d * b.d);
  }

  function mulRat(a, b) {
    return rat(a.n * b.n, a.d * b.d);
  }

  function divRat(a, b) {
    if (b.n === 0n) throw new Error("division by zero");
    return rat(a.n * b.d, a.d * b.n);
  }

  function powRat(base, exponent) {
    var result = rat(1n);
    for (var i = 0; i < exponent; i += 1) result = mulRat(result, base);
    return result;
  }

  function compareRat(a, b) {
    var difference = a.n * b.d - b.n * a.d;
    return difference < 0n ? -1 : difference > 0n ? 1 : 0;
  }

  function rationalText(value) {
    return value.d === 1n ? value.n.toString() : value.n + "/" + value.d;
  }

  function roundHalfAway(value, scale) {
    var scaledNumerator = value.n * BigInt(scale);
    var negative = scaledNumerator < 0n;
    var magnitude = negative ? -scaledNumerator : scaledNumerator;
    var quotient = magnitude / value.d;
    var remainder = magnitude % value.d;
    if (remainder * 2n >= value.d) quotient += 1n;
    return negative ? -quotient : quotient;
  }

  function moneyRat(cents) {
    return rat(BigInt(cents), 100n);
  }

  function rateRat(rateBasisPoints) {
    return rat(BigInt(rateBasisPoints), 10000n);
  }

  function factorRat(rateBasisPoints) {
    return addRat(rat(1n), rateRat(rateBasisPoints));
  }

  function percentPoints(ratio) {
    return mulRat(ratio, rat(100n));
  }

  function centsOf(exactMoney) {
    return roundHalfAway(exactMoney, 100);
  }

  function basisPointsOf(exactPercentPoints) {
    return roundHalfAway(exactPercentPoints, 100);
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

  Rng.prototype.pick = function (values) {
    return values[this.int(0, values.length - 1)];
  };

  Rng.prototype.chance = function (probability) {
    return this.float() < probability;
  };

  Rng.prototype.shuffle = function (values) {
    var copy = values.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = this.int(0, i);
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  };

  function browserLocale() {
    var builtLocale = t("locale", null);
    if (builtLocale) return builtLocale;
    if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
    return "en-US";
  }

  function configuredLocale() {
    var setting = progress && progress.settings ? progress.settings.numberFormat : "auto";
    if (setting === "comma") return "sv-SE";
    if (setting === "point") return "en-US";
    return browserLocale();
  }

  function decimalSeparator() {
    return configuredLocale().toLowerCase().indexOf("sv") === 0 ? "," : ".";
  }

  function groupingSeparator() {
    return decimalSeparator() === "," ? "." : ",";
  }

  function activeCurrencyId() {
    var setting = progress && progress.settings ? progress.settings.currencyFormat : "auto";
    if (setting && setting !== "auto") return setting;
    var locale = browserLocale().toLowerCase();
    if (locale.indexOf("sv") === 0) return "sek";
    if (locale.indexOf("en-gb") === 0) return "gbp";
    if (/^(de|fr|es|it|nl|fi|et|lv|lt|pt|el|sk|sl|mt|hr|ro|bg|cs|pl|da|nb|nn|is)/.test(locale)) return "eur";
    return "usd";
  }

  function activeUnitSystem() {
    var setting = progress && progress.settings ? progress.settings.unitSystem : "auto";
    if (setting && setting !== "auto") return setting;
    return browserLocale().toLowerCase().indexOf("en-us") === 0 ? "us" : "metric";
  }

  function formatScaled(scaled, precision) {
    scaled = BigInt(scaled);
    var negative = scaled < 0n;
    var magnitude = negative ? -scaled : scaled;
    var scale = 10n ** BigInt(precision);
    var whole = magnitude / scale;
    var fraction = (magnitude % scale).toString().padStart(precision, "0");
    var grouped = Number(whole).toLocaleString(configuredLocale(), { maximumFractionDigits: 0 });
    return (negative && magnitude !== 0n ? "-" : "") + grouped + (precision ? decimalSeparator() + fraction : "");
  }

  function moneyFromCents(cents) {
    var format = CURRENCY_FORMATS[activeCurrencyId()] || CURRENCY_FORMATS.usd;
    var text = formatScaled(cents, 2);
    if (format.position === "none") return text;
    if (format.position === "after") return text + " " + format.symbol;
    return format.symbol + text;
  }

  function percentFromBasisPoints(value) {
    var bp = BigInt(value);
    var precision = bp % 100n === 0n ? 0 : bp % 10n === 0n ? 1 : 2;
    return formatScaled(bp / (precision === 0 ? 100n : precision === 1 ? 10n : 1n), precision) + "%";
  }

  function decimalFromScaled(value, precision) {
    var scaled = BigInt(value);
    while (precision > 0 && scaled % 10n === 0n) {
      scaled /= 10n;
      precision -= 1;
    }
    return formatScaled(scaled, precision);
  }

  function rateLabel(rateBasisPoints) {
    return percentFromBasisPoints(rateBasisPoints);
  }

  function fieldMoney(id, label, exact, unit) {
    return { id: id, label: label, kind: "money", value: centsOf(exact).toString(), exact: rationalText(exact), precision: 2, unit: unit || "currency" };
  }

  function fieldPercent(id, label, exactPercent, exactInteger) {
    var value = basisPointsOf(exactPercent);
    if (exactInteger) value = (value / 100n) * 100n;
    return { id: id, label: label, kind: "percent", value: value.toString(), exact: rationalText(exactPercent), precision: exactInteger ? 0 : 2, unit: "percent" };
  }

  function fieldDecimal(id, label, exact, precision, unit) {
    return { id: id, label: label, kind: "decimal", value: roundHalfAway(exact, 10n ** BigInt(precision)).toString(), exact: rationalText(exact), precision: precision, unit: unit || "number" };
  }

  function fieldInteger(id, label, value, unit) {
    return { id: id, label: label, kind: "integer", value: BigInt(value).toString(), exact: BigInt(value).toString(), precision: 0, unit: unit || "count" };
  }

  function fieldChoice(id, label, value, options) {
    return {
      id: id,
      label: label,
      kind: "choice",
      value: value,
      exact: value,
      precision: 0,
      unit: "choice",
      options: options.map(function (option) { return typeof option === "string" ? { value: option, label: option } : option; })
    };
  }

  var CATEGORIES = [
    { id: "unit-prices", title: "Unit Prices" },
    { id: "discounts-tax", title: "Discounts and Tax" },
    { id: "percent-change", title: "Percent Change" },
    { id: "interest", title: "Interest" },
    { id: "inflation", title: "Inflation and Purchasing Power" },
    { id: "subscriptions", title: "Subscriptions" },
    { id: "expected-value", title: "Expected Value" },
    { id: "shared-bills", title: "Shared Bills and Explicit Charges" }
  ];

  var FAMILY_DATA = [
    ["unit_price_direct", "unit-prices", "Direct Unit Price", "Direct unit price", [1, 2, 3, 4, 5], "Normalize package price by a compatible quantity.", "price ÷ normalized quantity"],
    ["unit_price_compare", "unit-prices", "Offer Comparison", "Compare unit prices", [1, 2, 3, 4, 5], "Compare exact unit-price rationals on one common unit.", "cross-multiply before rounding"],
    ["unit_price_missing_value", "unit-prices", "Inverse Package Relationships", "Missing package value", [1, 2, 3, 4, 5], "Recover price or quantity from an exact unit price.", "price = unit price × quantity"],
    ["discount_single", "discounts-tax", "Single Adjustment", "Single discount", [1, 2, 3, 4, 5], "Separate the removed amount from the remaining sale price.", "sale factor = 1 − discount rate"],
    ["tax_single", "discounts-tax", "Single Adjustment", "Single fictional tax", [1, 2, 3, 4, 5], "Separate tax added from total after tax.", "total factor = 1 + tax rate"],
    ["discount_then_tax", "discounts-tax", "Multi-Stage Adjustments", "Discount, then tax", [2, 3, 4, 5], "Apply tax to the explicitly discounted taxable subtotal.", "original × remaining factor × tax factor"],
    ["successive_discounts", "discounts-tax", "Multi-Stage Adjustments", "Successive discounts", [2, 3, 4, 5], "Multiply remaining-price factors; do not add discount rates.", "(1−d₁)(1−d₂)"],
    ["price_before_adjustment", "discounts-tax", "Inverse Prices", "Price before adjustment", [2, 3, 4, 5], "Divide by the full remaining or growth factor.", "original = final ÷ factor"],
    ["percent_change_direct", "percent-change", "Direct Change", "Signed percent change", [1, 2, 3, 4, 5], "Use the original value as denominator.", "(new−old) ÷ old"],
    ["absolute_vs_percent_change", "percent-change", "Direct Change", "Absolute versus percent change", [1, 2, 3, 4], "Keep source-unit change distinct from relative percent change.", "absolute = new−old; percent = absolute÷old"],
    ["value_after_percent_change", "percent-change", "Forward and Inverse", "Value after percent change", [1, 2, 3, 4, 5], "Apply a signed growth or remaining factor.", "new = old(1+r)"],
    ["original_before_percent_change", "percent-change", "Forward and Inverse", "Original before percent change", [2, 3, 4, 5], "Invert the original change factor.", "old = new ÷ (1+r)"],
    ["successive_percent_changes", "percent-change", "Successive Changes", "Successive percent changes", [2, 3, 4, 5], "Update the base and multiply stage factors.", "(1+r₁)(1+r₂)"],
    ["reverse_change_comparison", "percent-change", "Successive Changes", "Forward versus reverse change", [2, 3, 4, 5], "Changing direction changes the denominator.", "low→high and high→low use different bases"],
    ["interest_one_period", "interest", "One-Period Interest", "One-period interest", [1, 2, 3, 4], "Distinguish interest earned from ending balance.", "interest = principal × annual rate"],
    ["simple_interest_multi_period", "interest", "Simple Interest", "Multi-period simple interest", [2, 3, 4, 5], "Use the original principal as the base every year.", "balance = P(1+rt)"],
    ["compound_interest_annual", "interest", "Annual Compound Interest", "Annual compound interest", [2, 3, 4, 5], "Apply the annual factor to the current exact balance.", "balance = P(1+r)^t"],
    ["simple_vs_compound", "interest", "Comparison and Inverse", "Simple versus compound", [2, 3, 4, 5], "Compare both models on one principal, rate, and horizon.", "compound adds interest-on-interest"],
    ["interest_missing_principal", "interest", "Comparison and Inverse", "Missing principal", [3, 4, 5], "Divide an exact ending balance by the stated growth factor.", "P = balance ÷ growth factor"],
    ["inflated_future_price", "inflation", "Future Nominal Prices", "Future nominal price", [1, 2, 3, 4, 5], "Compound the fictional annual price factor.", "future nominal = today × (1+i)^t"],
    ["cumulative_inflation_rate", "inflation", "Cumulative Inflation", "Cumulative inflation rate", [2, 3, 4, 5], "Convert a multi-year compound factor back to a cumulative rate.", "cumulative = (1+i)^t−1"],
    ["purchasing_power", "inflation", "Purchasing Power", "Purchasing power", [2, 3, 4, 5], "Deflate future nominal money into today's currency.", "today-value = future nominal ÷ (1+i)^t"],
    ["real_change_from_nominal", "inflation", "Real Change", "Real change from nominal", [3, 4, 5], "Compare nominal growth with price growth using a factor ratio.", "real factor = nominal factor ÷ inflation factor"],
    ["base_100_index_interpret", "inflation", "Base-100 Index Interpretation", "Interpret a base-100 index", [1, 2, 3, 4], "Keep an index-point movement distinct from its percent change.", "percent change = point change ÷ starting index"],
    ["subscription_total", "subscriptions", "Single-Plan Total", "Subscription total", [1, 2, 3, 4, 5], "Separate fixed, monthly, promotional, and annual charges.", "total over stated access horizon"],
    ["subscription_effective_monthly", "subscriptions", "Effective Monthly Cost", "Effective monthly cost", [2, 3, 4, 5], "Divide total cost by access months, not billed months.", "effective monthly = total ÷ access months"],
    ["subscription_compare", "subscriptions", "Common-Horizon Comparison", "Compare subscriptions", [1, 2, 3, 4, 5], "Put every plan on the identical access horizon.", "lower stated cost over the named horizon"],
    ["subscription_break_even", "subscriptions", "Break-Even Duration", "Subscription break-even", [3, 4, 5], "Find and verify the first whole month satisfying the stated inequality.", "check month m−1 and month m"],
    ["expected_value_single_reward", "expected-value", "One Reward and Cost", "Single-reward expected value", [1, 2, 3, 4, 5], "Weight gross reward, then subtract a certain cost once.", "EV = p×reward−cost"],
    ["expected_value_multiple_outcomes", "expected-value", "Multiple Outcomes", "Multiple-outcome expected value", [2, 3, 4, 5], "Weight every mutually exclusive net outcome.", "EV = Σ pᵢxᵢ"],
    ["expected_value_compare", "expected-value", "Comparing Options", "Compare expected values", [2, 3, 4, 5], "Compare exact long-run averages rather than maximum payoff.", "choose the larger exact EV"],
    ["expected_value_break_even", "expected-value", "Break-Even Probability or Cost", "Expected-value break-even", [2, 3, 4, 5], "Solve p×reward−cost = 0 and interpret the threshold.", "break-even equality"],
    ["bill_charges_total", "shared-bills", "Bill Total from Explicit Charge Bases", "Total explicit bill charges", [1, 2, 3, 4, 5], "Bind every tip, surcharge, and fictional-tax rate to its named base.", "bill total = eligible subtotal + each charge once"],
    ["shared_bill_allocate", "shared-bills", "Equal and Proportional Allocation", "Allocate a shared bill", [1, 2, 3, 4, 5], "Apply the stated allocation policy and reconcile every minor unit.", "participant shares sum exactly to bill total"]
  ];

  var FAMILIES = FAMILY_DATA.map(function (entry) {
    return {
      id: entry[0],
      categoryId: entry[1],
      subcategoryId: entry[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subcategory: entry[2],
      title: entry[3],
      levels: entry[4],
      learn: { rule: entry[5], formula: entry[6] }
    };
  });

  var PREREQUISITES = {
    unit_price_compare: ["unit_price_direct"],
    unit_price_missing_value: ["unit_price_direct"],
    tax_single: ["discount_single"],
    discount_then_tax: ["discount_single", "tax_single"],
    successive_discounts: ["discount_single"],
    price_before_adjustment: ["discount_single", "tax_single"],
    percent_change_direct: ["discount_single"],
    absolute_vs_percent_change: ["percent_change_direct"],
    value_after_percent_change: ["percent_change_direct"],
    original_before_percent_change: ["value_after_percent_change"],
    successive_percent_changes: ["value_after_percent_change"],
    reverse_change_comparison: ["percent_change_direct"],
    interest_one_period: ["value_after_percent_change"],
    simple_interest_multi_period: ["interest_one_period"],
    compound_interest_annual: ["interest_one_period"],
    simple_vs_compound: ["simple_interest_multi_period", "compound_interest_annual"],
    interest_missing_principal: ["compound_interest_annual"],
    inflated_future_price: ["compound_interest_annual"],
    cumulative_inflation_rate: ["inflated_future_price"],
    purchasing_power: ["inflated_future_price"],
    real_change_from_nominal: ["purchasing_power", "percent_change_direct"],
    base_100_index_interpret: ["percent_change_direct"],
    subscription_effective_monthly: ["subscription_total"],
    subscription_compare: ["subscription_total"],
    subscription_break_even: ["subscription_compare"],
    expected_value_multiple_outcomes: ["expected_value_single_reward"],
    expected_value_compare: ["expected_value_single_reward"],
    expected_value_break_even: ["expected_value_single_reward"],
    bill_charges_total: ["tax_single"],
    shared_bill_allocate: ["bill_charges_total"]
  };

  var GENERATORS = {};
  var DERIVERS = {};

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
    var categoryLocaleKeys = {
      "unit-prices": "unitPrices",
      "discounts-tax": "discounts",
      "percent-change": "percentChange",
      interest: "interest",
      inflation: "inflation",
      subscriptions: "subscriptions",
      "expected-value": "expectedValue",
      "shared-bills": "sharedBills"
    };
    CATEGORIES.forEach(function (category) {
      var localized = t("categories." + categoryLocaleKeys[category.id], null);
      if (localized) category.title = localized.title || category.title;
    });
    FAMILIES.forEach(function (family) {
      var localized = t("families." + family.id, null);
      if (localized) {
        family.subcategory = localized.subcategory || family.subcategory;
        family.title = localized.title || family.title;
        family.learn.rule = localized.rule || family.learn.rule;
        family.learn.formula = localized.formula || family.learn.formula;
      }
    });
  }

  localizeStaticData();

  function prompt(title, rows, note) {
    return { title: title, rows: rows || [], note: note || "" };
  }

  function makeQuestion(familyId, level, answerKind, parameters, promptData, fields, workedSteps, signatureParts, meta, misconceptions) {
    var family = familyById(familyId);
    var exactAnswer = {};
    var roundedAnswer = {};
    fields.forEach(function (answerField) {
      exactAnswer[answerField.id] = answerField.exact;
      roundedAnswer[answerField.id] = answerField.value;
    });
    var question = {
      categoryId: family.categoryId,
      subcategoryId: family.subcategoryId,
      familyId: familyId,
      level: level,
      answerKind: answerKind,
      currencyPrecision: 2,
      units: meta.units || fields.map(function (field) { return field.unit; }),
      timeBasis: meta.timeBasis || "none",
      roundingStage: meta.roundingStage || "final-only",
      difficultyDimensions: meta.difficultyDimensions || [level <= 2 ? "direct" : level >= 4 ? "interpret-or-invert" : "mixed"],
      misconceptionsTargeted: misconceptions || [],
      parameters: parameters,
      exactAnswer: exactAnswer,
      roundedAnswer: roundedAnswer,
      workedSteps: workedSteps,
      structuralSignature: [familyId].concat(signatureParts || []).join("|"),
      prompt: promptData,
      answer: { fields: fields },
      interpretation: meta.interpretation || ""
    };
    validateQuestion(question);
    return question;
  }

  function rateSet(level, kind) {
    if (kind === "tax") return level <= 2 ? [500, 1000] : level === 3 ? [600, 800, 1200] : [550, 625, 750, 825, 1200];
    if (kind === "interest") return level <= 2 ? [200, 500, 1000] : level === 3 ? [250, 400, 750] : [125, 250, 350, 475, 625];
    if (kind === "inflation") return level <= 2 ? [200, 500, 1000] : [150, 250, 350, 475, 600];
    return level <= 2 ? [1000, 2500, 5000] : level === 3 ? [500, 1500, 2000, 3000, 4000] : [750, 1250, 1750, 2250, 3750];
  }

  function friendlyMoney(rng, level, multiple) {
    multiple = multiple || 100;
    var maxUnits = level <= 2 ? 200 : level === 3 ? 500 : 2000;
    return BigInt(rng.int(2, maxUnits)) * BigInt(multiple);
  }

  function centsParam(value) {
    return BigInt(value).toString();
  }

  function exactMoneyFromParams(cents) {
    return moneyRat(BigInt(cents));
  }

  function quantityScenario(level, rng) {
    var system = activeUnitSystem();
    if (level <= 2) {
      var items = rng.chance(0.4);
      var quantity = rng.int(2, 20);
      return { displayQuantity: String(quantity), displayUnit: items ? "items" : system === "us" ? "lb" : "kg", comparisonUnit: items ? "item" : system === "us" ? "lb" : "kg", normalized: rat(quantity), conversion: "none" };
    }
    if (system === "us") {
      var ounces = rng.pick([8, 12, 16, 24, 32, 40]);
      return { displayQuantity: String(ounces), displayUnit: "oz", comparisonUnit: "lb", normalized: rat(ounces, 16), conversion: "oz-to-lb" };
    }
    var mass = rng.chance(0.5);
    var small = rng.pick([250, 400, 500, 600, 750, 800, 1250, 1500]);
    if (level === 4) {
      return { displayQuantity: String(small), displayUnit: mass ? "g" : "mL", comparisonUnit: mass ? "100 g" : "100 mL", normalized: rat(small, 100), conversion: mass ? "g-to-100g" : "ml-to-100ml" };
    }
    return { displayQuantity: String(small), displayUnit: mass ? "g" : "mL", comparisonUnit: mass ? "kg" : "L", normalized: rat(small, 1000), conversion: mass ? "g-to-kg" : "ml-to-l" };
  }

  GENERATORS.unit_price_direct = function (level, rng) {
    var quantity = quantityScenario(level, rng);
    var targetUnitCents = BigInt(rng.int(level === 5 ? 75 : 100, level <= 2 ? 2500 : 5000));
    var exactPriceCents = mulRat(rat(targetUnitCents), quantity.normalized);
    var packageCents = level === 5 ? BigInt(rng.int(199, 4999)) : roundHalfAway(exactPriceCents, 1);
    var exactUnitPrice = divRat(moneyRat(packageCents), quantity.normalized);
    return makeQuestion("unit_price_direct", level, "unit-price", { packageCents: centsParam(packageCents), quantityN: quantity.normalized.n.toString(), quantityD: quantity.normalized.d.toString(), displayQuantity: quantity.displayQuantity, displayUnit: quantity.displayUnit, comparisonUnit: quantity.comparisonUnit, conversion: quantity.conversion }, prompt("Calculate the unit price.", [moneyFromCents(packageCents) + " for " + quantity.displayQuantity + " " + quantity.displayUnit], "Price per " + quantity.comparisonUnit + "; round only the final answer to 2 decimals."), [fieldMoney("unitPrice", "Price per " + quantity.comparisonUnit, exactUnitPrice, "currency/" + quantity.comparisonUnit)], [quantity.conversion === "none" ? "quantity = " + quantity.displayQuantity + " " + quantity.displayUnit : quantity.displayQuantity + " " + quantity.displayUnit + " = " + rationalText(quantity.normalized) + " " + quantity.comparisonUnit, moneyFromCents(packageCents) + " ÷ " + rationalText(quantity.normalized) + " = " + moneyFromCents(centsOf(exactUnitPrice)) + "/" + quantity.comparisonUnit], [quantity.conversion, level === 5 ? "rounded" : "friendly"], { units: [quantity.displayUnit, quantity.comparisonUnit], interpretation: "This is the stated price per " + quantity.comparisonUnit + "." }, ["reversed-division", "unit-conversion"]);
  };

  DERIVERS.unit_price_direct = function (p) {
    return { unitPrice: divRat(moneyRat(p.packageCents), rat(p.quantityN, p.quantityD)) };
  };

  function offerUnitPrice(offer) {
    return divRat(moneyRat(offer.priceCents), rat(offer.quantityN, offer.quantityD));
  }

  GENERATORS.unit_price_compare = function (level, rng) {
    var count = level >= 4 ? 3 : 2;
    var baseScenario = quantityScenario(level, rng);
    var offers = [];
    for (var i = 0; i < count; i += 1) {
      var normalized = level === 1 ? baseScenario.normalized : mulRat(baseScenario.normalized, rat(rng.int(1, 4), rng.int(1, 3)));
      if (normalized.n <= 0n) normalized = rat(i + 1);
      var unitCents = BigInt(300 + i * 37 + rng.int(0, 20));
      var priceCents = roundHalfAway(mulRat(rat(unitCents), normalized), 1);
      if (level === 5 && i === 1) priceCents += BigInt(rng.pick([-75, 125]));
      offers.push({ id: String.fromCharCode(65 + i), priceCents: priceCents.toString(), quantityN: normalized.n.toString(), quantityD: normalized.d.toString() });
    }
    var prices = offers.map(offerUnitPrice);
    var winnerIndex = prices.reduce(function (best, value, index) { return compareRat(value, prices[best]) < 0 ? index : best; }, 0);
    var sorted = prices.slice().sort(compareRat);
    if (compareRat(sorted[0], sorted[1]) === 0 || centsOf(subRat(sorted[1], sorted[0])) === 0n) return GENERATORS.unit_price_compare(level, rng);
    var winner = offers[winnerIndex].id;
    var difference = subRat(sorted[1], sorted[0]);
    var rows = offers.map(function (offer) {
      return "Offer " + offer.id + ": " + moneyFromCents(offer.priceCents) + " for " + decimalFromScaled(roundHalfAway(rat(offer.quantityN, offer.quantityD), 100), 2) + " " + baseScenario.comparisonUnit;
    });
    var fields = [fieldChoice("offer", "Cheaper per " + baseScenario.comparisonUnit, winner, offers.map(function (offer) { return { value: offer.id, label: "Offer " + offer.id }; }))];
    if (level >= 4) fields.push(fieldMoney("difference", "Savings per " + baseScenario.comparisonUnit, difference, "currency/" + baseScenario.comparisonUnit));
    return makeQuestion("unit_price_compare", level, level >= 4 ? "choice-and-money" : "choice", { offers: offers, comparisonUnit: baseScenario.comparisonUnit }, prompt("Which offer is cheaper per stated unit?", rows, "Assume equal quality. Compare exact unit prices; use the same " + baseScenario.comparisonUnit + " basis."), fields, offers.map(function (offer, index) { return offer.id + ": " + moneyFromCents(centsOf(prices[index])) + "/" + baseScenario.comparisonUnit; }).concat(["Lower stated unit cost: Offer " + winner]), ["offers-" + count, "winner-" + winner, level === 5 ? "fee-or-coupon" : "plain"], { units: ["currency/" + baseScenario.comparisonUnit], interpretation: "Offer " + winner + " is cheaper per stated " + baseScenario.comparisonUnit + ", not necessarily better in every respect." }, ["compared-package-price", "larger-is-always-cheaper"]);
  };

  DERIVERS.unit_price_compare = function (p) {
    var prices = p.offers.map(offerUnitPrice);
    var winnerIndex = prices.reduce(function (best, value, index) { return compareRat(value, prices[best]) < 0 ? index : best; }, 0);
    var sorted = prices.slice().sort(compareRat);
    return { offer: p.offers[winnerIndex].id, difference: subRat(sorted[1], sorted[0]) };
  };

  GENERATORS.unit_price_missing_value = function (level, rng) {
    var quantity = quantityScenario(Math.max(1, level - 1), rng);
    var unitCents = BigInt(rng.int(100, 2500));
    var priceExact = mulRat(moneyRat(unitCents), quantity.normalized);
    var missingPrice = level === 1 || rng.chance(0.55);
    if (missingPrice) {
      return makeQuestion("unit_price_missing_value", level, "money", { direction: "price", unitCents: unitCents.toString(), quantityN: quantity.normalized.n.toString(), quantityD: quantity.normalized.d.toString(), comparisonUnit: quantity.comparisonUnit }, prompt("Find the package price.", [moneyFromCents(unitCents) + " per " + quantity.comparisonUnit, rationalText(quantity.normalized) + " " + quantity.comparisonUnit], "Round only the final money amount to 2 decimals."), [fieldMoney("price", "Package price", priceExact)], [moneyFromCents(unitCents) + " × " + rationalText(quantity.normalized) + " = " + moneyFromCents(centsOf(priceExact))], ["missing-price", quantity.conversion], { units: ["currency", quantity.comparisonUnit], interpretation: "This recovers the stated package price." }, ["divided-instead-of-multiplied"]);
    }
    var packageCents = roundHalfAway(priceExact, 100);
    var exactQuantity = divRat(moneyRat(packageCents), moneyRat(unitCents));
    return makeQuestion("unit_price_missing_value", level, "quantity", { direction: "quantity", packageCents: packageCents.toString(), unitCents: unitCents.toString(), comparisonUnit: quantity.comparisonUnit }, prompt("Find the exact package quantity.", [moneyFromCents(packageCents) + " package price", moneyFromCents(unitCents) + " per " + quantity.comparisonUnit], "Give quantity in " + quantity.comparisonUnit + "."), [fieldDecimal("quantity", "Quantity (" + quantity.comparisonUnit + ")", exactQuantity, 2, quantity.comparisonUnit)], [moneyFromCents(packageCents) + " ÷ " + moneyFromCents(unitCents) + " = " + decimalFromScaled(roundHalfAway(exactQuantity, 100), 2) + " " + quantity.comparisonUnit], ["missing-quantity", quantity.conversion], { units: [quantity.comparisonUnit], interpretation: "This recovers quantity from package price divided by unit price." }, ["multiplied-instead-of-divided"]);
  };

  DERIVERS.unit_price_missing_value = function (p) {
    if (p.direction === "price") return { price: mulRat(moneyRat(p.unitCents), rat(p.quantityN, p.quantityD)) };
    return { quantity: divRat(moneyRat(p.packageCents), moneyRat(p.unitCents)) };
  };

  function singleAdjustment(level, rng, kind) {
    var rate = rng.pick(rateSet(level, kind === "tax" ? "tax" : "discount"));
    var baseCents = friendlyMoney(rng, level, level <= 3 ? 100 : 1);
    var base = moneyRat(baseCents);
    var amount = mulRat(base, rateRat(rate));
    var final = kind === "tax" ? addRat(base, amount) : subRat(base, amount);
    var requestAmount = level === 1 ? true : rng.chance(0.5);
    return { rate: rate, baseCents: baseCents, amount: amount, final: final, request: requestAmount ? "amount" : "final" };
  }

  GENERATORS.discount_single = function (level, rng) {
    var data = singleAdjustment(level, rng, "discount");
    var exact = data.request === "amount" ? data.amount : data.final;
    return makeQuestion("discount_single", level, "money", { priceCents: data.baseCents.toString(), rateBp: data.rate, request: data.request }, prompt("Calculate the requested discount result.", ["Original price: " + moneyFromCents(data.baseCents), "Discount: " + rateLabel(data.rate)], data.request === "amount" ? "Give the discount amount removed." : "Give the sale price before tax."), [fieldMoney("answer", data.request === "amount" ? "Discount amount" : "Sale price", exact)], ["discount base: " + moneyFromCents(data.baseCents), "removed: " + moneyFromCents(centsOf(data.amount)), "remaining: " + moneyFromCents(centsOf(data.final))], ["request-" + data.request, "rate-" + data.rate, data.baseCents % 100n ? "rounded" : "exact"], { units: ["currency"], interpretation: data.request === "amount" ? "This is the amount removed." : "This is the remaining price before tax." }, ["amount-vs-final"]);
  };

  DERIVERS.discount_single = function (p) {
    var price = moneyRat(p.priceCents);
    var amount = mulRat(price, rateRat(p.rateBp));
    return { answer: p.request === "amount" ? amount : subRat(price, amount) };
  };

  GENERATORS.tax_single = function (level, rng) {
    var data = singleAdjustment(level, rng, "tax");
    var exact = data.request === "amount" ? data.amount : data.final;
    return makeQuestion("tax_single", level, "money", { subtotalCents: data.baseCents.toString(), rateBp: data.rate, request: data.request }, prompt("Calculate the requested fictional tax result.", ["Pre-tax subtotal: " + moneyFromCents(data.baseCents), "Fictional tax rate: " + rateLabel(data.rate)], data.request === "amount" ? "Give tax added." : "Give total after tax."), [fieldMoney("answer", data.request === "amount" ? "Tax amount" : "Total after tax", exact)], ["tax base: " + moneyFromCents(data.baseCents), "tax: " + moneyFromCents(centsOf(data.amount)), "total: " + moneyFromCents(centsOf(data.final))], ["request-" + data.request, "rate-" + data.rate], { units: ["currency"], interpretation: "This rate is generated for practice and is not a current tax rule." }, ["amount-vs-total", "wrong-tax-base"]);
  };

  DERIVERS.tax_single = function (p) {
    var subtotal = moneyRat(p.subtotalCents);
    var amount = mulRat(subtotal, rateRat(p.rateBp));
    return { answer: p.request === "amount" ? amount : addRat(subtotal, amount) };
  };

  GENERATORS.discount_then_tax = function (level, rng) {
    var priceCents = friendlyMoney(rng, level, level <= 3 ? 100 : 1);
    var discountBp = rng.pick(rateSet(level, "discount"));
    var taxBp = rng.pick(rateSet(level, "tax"));
    var price = moneyRat(priceCents);
    var subtotal = mulRat(price, subRat(rat(1n), rateRat(discountBp)));
    var tax = mulRat(subtotal, rateRat(taxBp));
    var final = addRat(subtotal, tax);
    var fields = level >= 4
      ? [fieldMoney("subtotal", "Discounted taxable subtotal", subtotal), fieldMoney("tax", "Tax on subtotal", tax), fieldMoney("final", "Final price", final)]
      : [fieldMoney("final", "Final price", final)];
    return makeQuestion("discount_then_tax", level, level >= 4 ? "multi-money" : "money", { priceCents: priceCents.toString(), discountBp: discountBp, taxBp: taxBp }, prompt("Apply the discount, then the fictional tax.", ["Original: " + moneyFromCents(priceCents), "Discount: " + rateLabel(discountBp), "Tax on discounted subtotal: " + rateLabel(taxBp)], "Retain exact intermediate values; round requested money fields to 2 decimals."), fields, ["discounted subtotal: " + moneyFromCents(centsOf(subtotal)), "tax base is that subtotal; tax: " + moneyFromCents(centsOf(tax)), "final: " + moneyFromCents(centsOf(final))], ["two-stages", "d" + discountBp, "t" + taxBp], { units: ["currency"], timeBasis: "none", interpretation: "The fictional tax is applied to the discounted subtotal." }, ["tax-on-original", "added-signed-rates"]);
  };

  DERIVERS.discount_then_tax = function (p) {
    var price = moneyRat(p.priceCents);
    var subtotal = mulRat(price, subRat(rat(1n), rateRat(p.discountBp)));
    var tax = mulRat(subtotal, rateRat(p.taxBp));
    return { subtotal: subtotal, tax: tax, final: addRat(subtotal, tax) };
  };

  GENERATORS.successive_discounts = function (level, rng) {
    var priceCents = friendlyMoney(rng, level, 100);
    var d1 = rng.pick(rateSet(level, "discount"));
    var d2 = level === 2 ? d1 : rng.pick(rateSet(level, "discount"));
    var remaining = mulRat(subRat(rat(1n), rateRat(d1)), subRat(rat(1n), rateRat(d2)));
    var final = mulRat(moneyRat(priceCents), remaining);
    var equivalent = percentPoints(subRat(rat(1n), remaining));
    var requestPercent = level >= 4 && rng.chance(0.55);
    var fields = requestPercent ? [fieldPercent("answer", "Equivalent total discount", equivalent)] : [fieldMoney("answer", "Final price", final)];
    return makeQuestion("successive_discounts", level, requestPercent ? "percent" : "money", { priceCents: priceCents.toString(), d1Bp: d1, d2Bp: d2, request: requestPercent ? "percent" : "final" }, prompt("Apply two successive discounts.", ["Starting price: " + moneyFromCents(priceCents), "First discount: " + rateLabel(d1), "Second discount on the reduced price: " + rateLabel(d2)], requestPercent ? "Give the equivalent total discount." : "Give the final price."), fields, ["remaining factor = (1−" + rateLabel(d1) + ")(1−" + rateLabel(d2) + ")", "final: " + moneyFromCents(centsOf(final)), "equivalent discount: " + percentFromBasisPoints(basisPointsOf(equivalent))], ["request-" + (requestPercent ? "percent" : "final"), "rates-" + d1 + "-" + d2], { units: requestPercent ? ["percent"] : ["currency"], interpretation: "The second discount uses the already reduced price." }, ["added-discount-rates"]);
  };

  DERIVERS.successive_discounts = function (p) {
    var remaining = mulRat(subRat(rat(1n), rateRat(p.d1Bp)), subRat(rat(1n), rateRat(p.d2Bp)));
    return { answer: p.request === "percent" ? percentPoints(subRat(rat(1n), remaining)) : mulRat(moneyRat(p.priceCents), remaining) };
  };

  GENERATORS.price_before_adjustment = function (level, rng) {
    var originalCents = friendlyMoney(rng, level, 100);
    var kind = level >= 4 && rng.chance(0.5) ? "tax" : "discount";
    var rate = rng.pick(rateSet(level, kind));
    var factor = kind === "tax" ? factorRat(rate) : subRat(rat(1n), rateRat(rate));
    var final = mulRat(moneyRat(originalCents), factor);
    if (mulRat(final, rat(100n)).d !== 1n) return GENERATORS.price_before_adjustment(level, rng);
    return makeQuestion("price_before_adjustment", level, "money", { originalCents: originalCents.toString(), rateBp: rate, kind: kind, exactFinalN: final.n.toString(), exactFinalD: final.d.toString() }, prompt("Recover the exact price before adjustment.", [kind === "tax" ? "Exact total after fictional tax: " + moneyFromCents(centsOf(final)) : "Exact sale price after discount: " + moneyFromCents(centsOf(final)), (kind === "tax" ? "Tax rate: " : "Discount rate: ") + rateLabel(rate)], "Divide by the full " + (kind === "tax" ? "growth" : "remaining-price") + " factor."), [fieldMoney("original", kind === "tax" ? "Pre-tax price" : "Original price", moneyRat(originalCents))], ["factor: " + rationalText(factor), moneyFromCents(centsOf(final)) + " ÷ factor = " + moneyFromCents(originalCents)], [kind, "rate-" + rate], { units: ["currency"], interpretation: "This reverses one explicitly stated adjustment." }, ["added-rate-back"]);
  };

  DERIVERS.price_before_adjustment = function (p) {
    var factor = p.kind === "tax" ? factorRat(p.rateBp) : subRat(rat(1n), rateRat(p.rateBp));
    return { original: divRat(rat(p.exactFinalN, p.exactFinalD), factor) };
  };

  function changeScenario(level, rng) {
    var rates = level === 1 ? [1000, 2000, 2500, 5000] : level === 2 ? [-1000, -2000, -2500, -5000] : [-3750, -2250, -1250, 750, 1250, 1750, 3333];
    var rate = rng.pick(rates);
    var oldCents = friendlyMoney(rng, level, level <= 3 ? 100 : 1);
    var exactNew = mulRat(moneyRat(oldCents), factorRat(rate));
    return { oldCents: oldCents, rateBp: rate, exactNew: exactNew };
  }

  GENERATORS.percent_change_direct = function (level, rng) {
    var scenario = changeScenario(level, rng);
    var newCents = centsOf(scenario.exactNew);
    var exactRate = percentPoints(divRat(subRat(moneyRat(newCents), moneyRat(scenario.oldCents)), moneyRat(scenario.oldCents)));
    return makeQuestion("percent_change_direct", level, "percent", { oldCents: scenario.oldCents.toString(), newCents: newCents.toString() }, prompt("Find the signed percent change.", ["Old value: " + moneyFromCents(scenario.oldCents), "New value: " + moneyFromCents(newCents)], "Use old value as the denominator; round the percent to 2 decimals."), [fieldPercent("change", "Signed percent change", exactRate)], ["absolute change: " + moneyFromCents(newCents - scenario.oldCents), "change ÷ old × 100 = " + percentFromBasisPoints(basisPointsOf(exactRate))], [scenario.rateBp < 0 ? "decrease" : "increase", level >= 3 ? "rounded" : "friendly"], { units: ["percent"], interpretation: "The sign states direction relative to the old value." }, ["new-denominator", "dropped-sign"]);
  };

  DERIVERS.percent_change_direct = function (p) {
    return { change: percentPoints(divRat(subRat(moneyRat(p.newCents), moneyRat(p.oldCents)), moneyRat(p.oldCents))) };
  };

  GENERATORS.absolute_vs_percent_change = function (level, rng) {
    var scenario = changeScenario(level, rng);
    var newCents = centsOf(scenario.exactNew);
    var absolute = subRat(moneyRat(newCents), moneyRat(scenario.oldCents));
    var relative = percentPoints(divRat(absolute, moneyRat(scenario.oldCents)));
    if (centsOf(absolute) === basisPointsOf(relative)) return GENERATORS.absolute_vs_percent_change(level, rng);
    return makeQuestion("absolute_vs_percent_change", level, "money-and-percent", { oldCents: scenario.oldCents.toString(), newCents: newCents.toString() }, prompt("Give both forms of change.", ["Old: " + moneyFromCents(scenario.oldCents), "New: " + moneyFromCents(newCents)], "Absolute change keeps currency units; percent change uses the old value."), [fieldMoney("absolute", "Absolute change", absolute), fieldPercent("percent", "Signed percent change", relative)], ["absolute: new − old = " + moneyFromCents(centsOf(absolute)), "percent: absolute ÷ old = " + percentFromBasisPoints(basisPointsOf(relative))], [scenario.rateBp < 0 ? "decrease" : "increase", "two-fields"], { units: ["currency", "percent"], interpretation: "These are different descriptions of the same change." }, ["swapped-fields", "new-denominator"]);
  };

  DERIVERS.absolute_vs_percent_change = function (p) {
    var absolute = subRat(moneyRat(p.newCents), moneyRat(p.oldCents));
    return { absolute: absolute, percent: percentPoints(divRat(absolute, moneyRat(p.oldCents))) };
  };

  GENERATORS.value_after_percent_change = function (level, rng) {
    var scenario = changeScenario(level, rng);
    return makeQuestion("value_after_percent_change", level, "money", { oldCents: scenario.oldCents.toString(), rateBp: scenario.rateBp }, prompt("Find the new value after the signed change.", ["Old value: " + moneyFromCents(scenario.oldCents), "Change: " + rateLabel(scenario.rateBp)], "Use the growth/remaining factor and round only the final money amount."), [fieldMoney("newValue", "New value", scenario.exactNew)], ["factor: " + rationalText(factorRat(scenario.rateBp)), moneyFromCents(scenario.oldCents) + " × factor = " + moneyFromCents(centsOf(scenario.exactNew))], [scenario.rateBp < 0 ? "decrease" : "increase", "rate-" + scenario.rateBp], { units: ["currency"], interpretation: "The change is relative to the old value." }, ["added-rate-number"]);
  };

  DERIVERS.value_after_percent_change = function (p) {
    return { newValue: mulRat(moneyRat(p.oldCents), factorRat(p.rateBp)) };
  };

  GENERATORS.original_before_percent_change = function (level, rng) {
    var scenario = changeScenario(level, rng);
    var exactNew = scenario.exactNew;
    if (mulRat(exactNew, rat(100n)).d !== 1n) return GENERATORS.original_before_percent_change(level, rng);
    return makeQuestion("original_before_percent_change", level, "money", { originalCents: scenario.oldCents.toString(), rateBp: scenario.rateBp, exactNewN: exactNew.n.toString(), exactNewD: exactNew.d.toString() }, prompt("Recover the original value.", ["Exact value after change: " + moneyFromCents(centsOf(exactNew)), "Signed change: " + rateLabel(scenario.rateBp)], "Divide by the original change factor; do not merely apply the opposite rate."), [fieldMoney("original", "Original value", moneyRat(scenario.oldCents))], ["factor: " + rationalText(factorRat(scenario.rateBp)), "exact new ÷ factor = " + moneyFromCents(scenario.oldCents)], [scenario.rateBp < 0 ? "reverse-decrease" : "reverse-increase", "rate-" + scenario.rateBp], { units: ["currency"], interpretation: "The displayed new amount is declared exact for this inverse exercise." }, ["opposite-rate-instead-of-inverse"]);
  };

  DERIVERS.original_before_percent_change = function (p) {
    return { original: divRat(rat(p.exactNewN, p.exactNewD), factorRat(p.rateBp)) };
  };

  GENERATORS.successive_percent_changes = function (level, rng) {
    var startCents = friendlyMoney(rng, level, 100);
    var rate1 = rng.pick(level === 2 ? [1000, 2000, 2500] : [-2000, -1000, 1000, 2000, 2500]);
    var rate2 = level === 2 ? rng.pick([1000, 2000]) : rng.pick([-2500, -2000, -1000, 1000, 1500, 2000]);
    var combined = mulRat(factorRat(rate1), factorRat(rate2));
    if (compareRat(combined, factorRat(rate1 + rate2)) === 0) return GENERATORS.successive_percent_changes(level, rng);
    var final = mulRat(moneyRat(startCents), combined);
    var net = percentPoints(subRat(combined, rat(1n)));
    var requestNet = level >= 4 && rng.chance(0.5);
    return makeQuestion("successive_percent_changes", level, requestNet ? "percent" : "money", { startCents: startCents.toString(), rate1Bp: rate1, rate2Bp: rate2, request: requestNet ? "net" : "final" }, prompt("Apply two successive percent changes.", ["Start: " + moneyFromCents(startCents), "First change: " + rateLabel(rate1), "Second change from the new value: " + rateLabel(rate2)], requestNet ? "Give the net signed percent change." : "Give the final value."), [requestNet ? fieldPercent("answer", "Net signed change", net) : fieldMoney("answer", "Final value", final)], ["combined factor: " + rationalText(combined), "final: " + moneyFromCents(centsOf(final)), "net: " + percentFromBasisPoints(basisPointsOf(net))], ["request-" + (requestNet ? "net" : "final"), "directions-" + Math.sign(rate1) + "-" + Math.sign(rate2)], { units: requestNet ? ["percent"] : ["currency"], interpretation: "Each rate uses the value at that stage." }, ["added-rates", "equal-opposites-cancel"]);
  };

  DERIVERS.successive_percent_changes = function (p) {
    var combined = mulRat(factorRat(p.rate1Bp), factorRat(p.rate2Bp));
    return { answer: p.request === "net" ? percentPoints(subRat(combined, rat(1n))) : mulRat(moneyRat(p.startCents), combined) };
  };

  GENERATORS.reverse_change_comparison = function (level, rng) {
    var low = BigInt(rng.int(20, level <= 2 ? 100 : 500)) * 100n;
    var ratioBp = rng.pick(level === 2 ? [2500, 5000, 10000] : [1250, 2000, 2500, 3333, 5000]);
    var high = centsOf(mulRat(moneyRat(low), factorRat(ratioBp)));
    var forward = percentPoints(divRat(subRat(moneyRat(high), moneyRat(low)), moneyRat(low)));
    var reverse = percentPoints(divRat(subRat(moneyRat(low), moneyRat(high)), moneyRat(high)));
    return makeQuestion("reverse_change_comparison", level, "two-percent", { lowCents: low.toString(), highCents: high.toString() }, prompt("Compare forward and reverse signed percent changes.", [moneyFromCents(low) + " → " + moneyFromCents(high), moneyFromCents(high) + " → " + moneyFromCents(low)], "Each direction uses its own starting value as denominator."), [fieldPercent("forward", "Forward change", forward), fieldPercent("reverse", "Reverse change", reverse)], ["forward denominator: " + moneyFromCents(low) + " → " + percentFromBasisPoints(basisPointsOf(forward)), "reverse denominator: " + moneyFromCents(high) + " → " + percentFromBasisPoints(basisPointsOf(reverse))], ["ratio-" + ratioBp, "two-directions"], { units: ["percent"], interpretation: "Opposite absolute changes need not be opposite percentages." }, ["equal-opposite-percent"]);
  };

  DERIVERS.reverse_change_comparison = function (p) {
    var low = moneyRat(p.lowCents);
    var high = moneyRat(p.highCents);
    return { forward: percentPoints(divRat(subRat(high, low), low)), reverse: percentPoints(divRat(subRat(low, high), high)) };
  };

  function interestScenario(level, rng) {
    return {
      principalCents: friendlyMoney(rng, level, level <= 3 ? 100 : 1),
      rateBp: rng.pick(rateSet(level, "interest")),
      years: level <= 2 ? 2 : level === 3 ? rng.int(2, 4) : rng.int(3, 8)
    };
  }

  GENERATORS.interest_one_period = function (level, rng) {
    var scenario = interestScenario(level, rng);
    scenario.years = 1;
    var principal = moneyRat(scenario.principalCents);
    var interest = mulRat(principal, rateRat(scenario.rateBp));
    var balance = addRat(principal, interest);
    var request = level === 1 ? "interest" : rng.chance(0.5) ? "interest" : "balance";
    return makeQuestion("interest_one_period", level, "money", { principalCents: scenario.principalCents.toString(), rateBp: scenario.rateBp, request: request }, prompt("Calculate one year of stated annual interest.", ["Principal: " + moneyFromCents(scenario.principalCents), "Annual rate: " + rateLabel(scenario.rateBp), "Time: 1 year"], request === "interest" ? "Give interest earned only." : "Give ending balance including principal."), [fieldMoney("answer", request === "interest" ? "Interest earned" : "Ending balance", request === "interest" ? interest : balance)], ["principal: " + moneyFromCents(scenario.principalCents), "interest: " + moneyFromCents(centsOf(interest)), "balance: " + moneyFromCents(centsOf(balance))], ["request-" + request, "rate-" + scenario.rateBp], { units: ["currency"], timeBasis: "annual, 1 year", interpretation: "This is a fictional fixed annual rate." }, ["interest-vs-balance"]);
  };

  DERIVERS.interest_one_period = function (p) {
    var principal = moneyRat(p.principalCents);
    var interest = mulRat(principal, rateRat(p.rateBp));
    return { answer: p.request === "interest" ? interest : addRat(principal, interest) };
  };

  GENERATORS.simple_interest_multi_period = function (level, rng) {
    var s = interestScenario(level, rng);
    var principal = moneyRat(s.principalCents);
    var interest = mulRat(mulRat(principal, rateRat(s.rateBp)), rat(s.years));
    var balance = addRat(principal, interest);
    var request = rng.chance(0.5) ? "interest" : "balance";
    return makeQuestion("simple_interest_multi_period", level, "money", { principalCents: s.principalCents.toString(), rateBp: s.rateBp, years: s.years, request: request }, prompt("Use simple interest over the stated horizon.", ["Principal: " + moneyFromCents(s.principalCents), "Simple annual rate: " + rateLabel(s.rateBp), "Time: " + s.years + " years"], request === "interest" ? "Give total interest only." : "Give ending balance including principal."), [fieldMoney("answer", request === "interest" ? "Total simple interest" : "Simple-interest balance", request === "interest" ? interest : balance)], ["same yearly interest: " + moneyFromCents(centsOf(mulRat(principal, rateRat(s.rateBp)))), "total interest: " + moneyFromCents(centsOf(interest)), "balance: " + moneyFromCents(centsOf(balance))], ["request-" + request, "years-" + s.years, "rate-" + s.rateBp], { units: ["currency"], timeBasis: "annual simple, " + s.years + " years", interpretation: "Simple interest uses the original principal every year." }, ["compounded-simple", "interest-vs-balance"]);
  };

  DERIVERS.simple_interest_multi_period = function (p) {
    var principal = moneyRat(p.principalCents);
    var interest = mulRat(mulRat(principal, rateRat(p.rateBp)), rat(p.years));
    return { answer: p.request === "interest" ? interest : addRat(principal, interest) };
  };

  GENERATORS.compound_interest_annual = function (level, rng) {
    var s = interestScenario(level, rng);
    var factor = powRat(factorRat(s.rateBp), s.years);
    var balance = mulRat(moneyRat(s.principalCents), factor);
    var interest = subRat(balance, moneyRat(s.principalCents));
    var request = level >= 4 && rng.chance(0.5) ? "interest" : "balance";
    return makeQuestion("compound_interest_annual", level, "money", { principalCents: s.principalCents.toString(), rateBp: s.rateBp, years: s.years, request: request }, prompt("Use annual compounding.", ["Principal: " + moneyFromCents(s.principalCents), "Fictional annual rate: " + rateLabel(s.rateBp), "Time: " + s.years + " years"], request === "balance" ? "Give ending balance." : "Give total interest; round only the final amount."), [fieldMoney("answer", request === "balance" ? "Compound balance" : "Total compound interest", request === "balance" ? balance : interest)], ["annual factor: " + rationalText(factorRat(s.rateBp)), "multi-year factor: " + rationalText(factor), "balance: " + moneyFromCents(centsOf(balance)) + "; interest: " + moneyFromCents(centsOf(interest))], ["request-" + request, "years-" + s.years, "rate-" + s.rateBp], { units: ["currency"], timeBasis: "annual compound, " + s.years + " years", interpretation: "The rate applies to each year's current exact balance." }, ["used-simple-interest", "interest-vs-balance"]);
  };

  DERIVERS.compound_interest_annual = function (p) {
    var balance = mulRat(moneyRat(p.principalCents), powRat(factorRat(p.rateBp), p.years));
    return { answer: p.request === "balance" ? balance : subRat(balance, moneyRat(p.principalCents)) };
  };

  GENERATORS.simple_vs_compound = function (level, rng) {
    var s = interestScenario(level, rng);
    var principal = moneyRat(s.principalCents);
    var simple = mulRat(principal, addRat(rat(1n), mulRat(rateRat(s.rateBp), rat(s.years))));
    var compound = mulRat(principal, powRat(factorRat(s.rateBp), s.years));
    var difference = subRat(compound, simple);
    if (centsOf(difference) === 0n) return GENERATORS.simple_vs_compound(level, rng);
    return makeQuestion("simple_vs_compound", level, "multi-money", { principalCents: s.principalCents.toString(), rateBp: s.rateBp, years: s.years }, prompt("Compare simple and annually compounded balances.", ["Principal: " + moneyFromCents(s.principalCents), "Annual rate: " + rateLabel(s.rateBp), "Horizon: " + s.years + " years"], "Give both balances and compound-minus-simple difference."), [fieldMoney("simple", "Simple balance", simple), fieldMoney("compound", "Compound balance", compound), fieldMoney("difference", "Compound minus simple", difference)], ["simple: " + moneyFromCents(centsOf(simple)), "compound: " + moneyFromCents(centsOf(compound)), "interest-on-interest difference: " + moneyFromCents(centsOf(difference))], ["years-" + s.years, "rate-" + s.rateBp], { units: ["currency"], timeBasis: "same annual rate and " + s.years + "-year horizon", interpretation: "This compares only the two stated mathematical models." }, ["models-confused"]);
  };

  DERIVERS.simple_vs_compound = function (p) {
    var principal = moneyRat(p.principalCents);
    var simple = mulRat(principal, addRat(rat(1n), mulRat(rateRat(p.rateBp), rat(p.years))));
    var compound = mulRat(principal, powRat(factorRat(p.rateBp), p.years));
    return { simple: simple, compound: compound, difference: subRat(compound, simple) };
  };

  GENERATORS.interest_missing_principal = function (level, rng) {
    var s = interestScenario(level, rng);
    s.years = level === 3 ? 1 : level === 4 ? rng.int(2, 5) : 2;
    var kind = level === 5 ? "compound" : "simple";
    var factor = kind === "compound" ? powRat(factorRat(s.rateBp), s.years) : addRat(rat(1n), mulRat(rateRat(s.rateBp), rat(s.years)));
    var balance = mulRat(moneyRat(s.principalCents), factor);
    return makeQuestion("interest_missing_principal", level, "money", { principalCents: s.principalCents.toString(), rateBp: s.rateBp, years: s.years, kind: kind, balanceN: balance.n.toString(), balanceD: balance.d.toString() }, prompt("Recover the original principal.", ["Exact ending balance: " + moneyFromCents(centsOf(balance)), "Model: " + (kind === "compound" ? "annually compounded" : "simple") + " at " + rateLabel(s.rateBp), "Horizon: " + s.years + " years"], "Divide by the full stated growth factor."), [fieldMoney("principal", "Principal", moneyRat(s.principalCents))], ["growth factor: " + rationalText(factor), "exact balance ÷ factor = " + moneyFromCents(s.principalCents)], [kind, "years-" + s.years], { units: ["currency"], timeBasis: kind + " annual, " + s.years + " years", interpretation: "The ending balance is declared exact for this inverse exercise." }, ["subtracted-interest-instead-of-dividing"]);
  };

  DERIVERS.interest_missing_principal = function (p) {
    var factor = p.kind === "compound" ? powRat(factorRat(p.rateBp), p.years) : addRat(rat(1n), mulRat(rateRat(p.rateBp), rat(p.years)));
    return { principal: divRat(rat(p.balanceN, p.balanceD), factor) };
  };

  function inflationScenario(level, rng) {
    return { amountCents: friendlyMoney(rng, level, level <= 3 ? 100 : 1), rateBp: rng.pick(rateSet(level, "inflation")), years: level === 1 ? 1 : level === 2 ? 2 : rng.int(2, level >= 4 ? 6 : 4) };
  }

  GENERATORS.inflated_future_price = function (level, rng) {
    var s = inflationScenario(level, rng);
    var factor = powRat(factorRat(s.rateBp), s.years);
    var future = mulRat(moneyRat(s.amountCents), factor);
    return makeQuestion("inflated_future_price", level, "money", { todayCents: s.amountCents.toString(), rateBp: s.rateBp, years: s.years }, prompt("Calculate the future nominal price in this simplified model.", ["Today's price: " + moneyFromCents(s.amountCents), "Fictional constant annual inflation: " + rateLabel(s.rateBp), "Horizon: " + s.years + " years"], "Compound annually; round only the final nominal price."), [fieldMoney("future", "Future nominal price", future)], ["inflation factor: " + rationalText(factor), "today × factor = " + moneyFromCents(centsOf(future))], ["years-" + s.years, "rate-" + s.rateBp], { units: ["currency"], timeBasis: "constant annual inflation, " + s.years + " years", interpretation: "This is a generated nominal-price exercise, not a forecast." }, ["used-simple-inflation"]);
  };

  DERIVERS.inflated_future_price = function (p) {
    return { future: mulRat(moneyRat(p.todayCents), powRat(factorRat(p.rateBp), p.years)) };
  };

  GENERATORS.cumulative_inflation_rate = function (level, rng) {
    var s = inflationScenario(level, rng);
    var cumulative = percentPoints(subRat(powRat(factorRat(s.rateBp), s.years), rat(1n)));
    return makeQuestion("cumulative_inflation_rate", level, "percent", { rateBp: s.rateBp, years: s.years }, prompt("Find cumulative inflation over the full horizon.", ["Fictional constant annual rate: " + rateLabel(s.rateBp), "Horizon: " + s.years + " years"], "Compound the annual factor; round the cumulative percentage to 2 decimals."), [fieldPercent("cumulative", "Cumulative inflation", cumulative)], ["factor: (1 + annual rate)^" + s.years, "cumulative: " + percentFromBasisPoints(basisPointsOf(cumulative))], ["years-" + s.years, "rate-" + s.rateBp], { units: ["percent"], timeBasis: "constant annual inflation, " + s.years + " years", interpretation: "This is cumulative nominal price growth in the stated model." }, ["rate-times-years"]);
  };

  DERIVERS.cumulative_inflation_rate = function (p) {
    return { cumulative: percentPoints(subRat(powRat(factorRat(p.rateBp), p.years), rat(1n))) };
  };

  GENERATORS.purchasing_power = function (level, rng) {
    var s = inflationScenario(level, rng);
    var factor = powRat(factorRat(s.rateBp), s.years);
    var direction = level >= 4 && rng.chance(0.5) ? "today-value" : "preserve";
    if (direction === "preserve") {
      var requiredFuture = mulRat(moneyRat(s.amountCents), factor);
      return makeQuestion("purchasing_power", level, "money", { direction: direction, amountCents: s.amountCents.toString(), rateBp: s.rateBp, years: s.years }, prompt("Find the future nominal amount that preserves today's purchasing power.", ["Today's amount: " + moneyFromCents(s.amountCents), "Fictional annual inflation: " + rateLabel(s.rateBp), "Horizon: " + s.years + " years"], "Multiply by the cumulative price factor."), [fieldMoney("answer", "Required future nominal amount", requiredFuture)], ["cumulative factor: " + rationalText(factor), "today's amount × factor = " + moneyFromCents(centsOf(requiredFuture))], [direction, "years-" + s.years], { units: ["currency"], timeBasis: s.years + " years", interpretation: "This preserves purchasing power only in the simplified stated model." }, ["divided-when-preserving"]);
    }
    var todayValue = divRat(moneyRat(s.amountCents), factor);
    return makeQuestion("purchasing_power", level, "money", { direction: direction, amountCents: s.amountCents.toString(), rateBp: s.rateBp, years: s.years }, prompt("Express the future nominal amount in today's purchasing-power terms.", ["Future nominal amount: " + moneyFromCents(s.amountCents), "Fictional annual inflation: " + rateLabel(s.rateBp), "Horizon: " + s.years + " years"], "Deflate by dividing by the cumulative price factor."), [fieldMoney("answer", "Today's purchasing-power value", todayValue)], ["cumulative factor: " + rationalText(factor), "future nominal ÷ factor = " + moneyFromCents(centsOf(todayValue))], [direction, "years-" + s.years], { units: ["currency"], timeBasis: s.years + " years", interpretation: "This is a today-value purchasing-power comparison, not a forecast." }, ["multiplied-when-deflating"]);
  };

  DERIVERS.purchasing_power = function (p) {
    var factor = powRat(factorRat(p.rateBp), p.years);
    return { answer: p.direction === "preserve" ? mulRat(moneyRat(p.amountCents), factor) : divRat(moneyRat(p.amountCents), factor) };
  };

  GENERATORS.real_change_from_nominal = function (level, rng) {
    var nominalBp = rng.pick([200, 500, 800, 1000, 1200, 1500]);
    var inflationBp = rng.pick([200, 300, 500, 700, 1000]);
    if (nominalBp === inflationBp && !rng.chance(0.2)) inflationBp += 100;
    var realFactor = divRat(factorRat(nominalBp), factorRat(inflationBp));
    var realPercent = percentPoints(subRat(realFactor, rat(1n)));
    return makeQuestion("real_change_from_nominal", level, "percent", { nominalBp: nominalBp, inflationBp: inflationBp }, prompt("Find the exact real percent change for one year.", ["Nominal amount change: " + rateLabel(nominalBp), "Fictional price inflation: " + rateLabel(inflationBp)], "Use the factor ratio, not simple rate subtraction; round to 2 decimals."), [fieldPercent("real", "Real signed change", realPercent)], ["real factor = " + rationalText(factorRat(nominalBp)) + " ÷ " + rationalText(factorRat(inflationBp)), "real change: " + percentFromBasisPoints(basisPointsOf(realPercent))], [compareRat(realPercent, rat(0n)) < 0 ? "real-decrease" : compareRat(realPercent, rat(0n)) > 0 ? "real-increase" : "unchanged"], { units: ["percent"], timeBasis: "one year", interpretation: "This compares nominal growth with price growth in a simplified model." }, ["subtracted-rates-as-exact"]);
  };

  DERIVERS.real_change_from_nominal = function (p) {
    return { real: percentPoints(subRat(divRat(factorRat(p.nominalBp), factorRat(p.inflationBp)), rat(1n))) };
  };

  function indexValueText(value) {
    return decimalFromScaled(roundHalfAway(value, 10), 1);
  }

  function indexPeriodPair(rng) {
    if (rng.chance(0.5)) {
      var year = rng.int(2021, 2028);
      return { start: String(year), end: String(year + 1), base: String(year - 1) };
    }
    var quarter = rng.int(1, 3);
    return { start: "Year A Q" + quarter, end: "Year A Q" + (quarter + 1), base: "Base period" };
  }

  GENERATORS.base_100_index_interpret = function (level, rng) {
    var periods = indexPeriodPair(rng);
    var start;
    var end;
    var change;
    var percent;
    var fields;
    var rows;
    var steps;
    var mode;
    if (level === 1) {
      mode = "base";
      start = rat(100);
      end = rat(rng.pick([72, 80, 90, 110, 118, 125, 140, 160]));
      change = subRat(end, start);
      percent = percentPoints(divRat(change, start));
      fields = [fieldPercent("percentChange", "Change from base period", percent)];
      rows = ["Fictional Cost Index A: " + periods.base + " = 100", periods.end + " index value: " + indexValueText(end)];
      steps = ["index-point change: " + rationalText(change), "percent change from 100: " + percentFromBasisPoints(basisPointsOf(percent))];
    } else if (level === 3 && rng.chance(0.45)) {
      mode = "forward";
      start = rat(rng.pick([825, 1125, 1200, 1375, 1500]), 10);
      var rateBp = rng.pick([-1250, -1000, -500, 500, 800, 1000, 1250, 2000]);
      percent = rat(rateBp, 100);
      end = mulRat(start, factorRat(rateBp));
      fields = [fieldDecimal("endIndex", "New index value", end, 1, "index")];
      rows = ["Fictional Cost Index C at " + periods.start + ": " + indexValueText(start), "Stated change to " + periods.end + ": " + rateLabel(rateBp)];
      steps = ["growth factor: " + rationalText(factorRat(rateBp)), "new index: " + indexValueText(start) + " × factor = " + indexValueText(end)];
    } else {
      mode = level >= 4 ? "points-and-percent" : "interval";
      start = level >= 3 ? rat(rng.pick([825, 1125, 1200, 1250, 1375, 1500, 1625]), 10) : rat(rng.pick([80, 120, 125, 150, 160]));
      var intervalRateBp = rng.pick(level >= 3 ? [-1250, -1000, -500, 400, 500, 800, 1000, 1250] : [-2000, -1000, -500, 500, 1000, 2000, 2500]);
      end = rat(roundHalfAway(mulRat(start, factorRat(intervalRateBp)), 10), 10);
      change = subRat(end, start);
      percent = percentPoints(divRat(change, start));
      fields = mode === "points-and-percent"
        ? [fieldDecimal("indexPointChange", "Signed change in index points", change, 1, "index points"), fieldPercent("percentChange", "Signed percent change", percent)]
        : [fieldPercent("percentChange", "Signed percent change", percent)];
      rows = ["Fictional Cost Index B at " + periods.start + ": " + indexValueText(start), "At " + periods.end + ": " + indexValueText(end)];
      steps = ["index-point change: " + indexValueText(end) + " − " + indexValueText(start) + " = " + indexValueText(change), "percent change: point change ÷ starting index = " + percentFromBasisPoints(basisPointsOf(percent))];
    }
    return makeQuestion(
      "base_100_index_interpret",
      level,
      fields.length > 1 ? "decimal-and-percent" : fields[0].kind,
      { mode: mode, startN: start.n.toString(), startD: start.d.toString(), endN: end.n.toString(), endD: end.d.toString() },
      prompt(
        mode === "forward" ? "Construct the new fictional index value." : mode === "points-and-percent" ? "Give the index-point and percent changes." : "Interpret the fictional base-100 index.",
        rows,
        mode === "base" ? "The index base is exactly 100." : mode === "forward" ? "Apply the stated percent to the starting index." : "Use the starting index as the percent-change denominator; index points are not percentages."
      ),
      fields,
      steps,
      [mode, compareRat(end, start) > 0 ? "increase" : "decrease", start.n === 100n * start.d ? "start-100" : "start-not-100"],
      { units: fields.map(function (field) { return field.unit; }), timeBasis: (mode === "base" ? periods.base : periods.start) + " to " + periods.end, interpretation: "These are fictional index values for arithmetic interpretation, not current data or a forecast." },
      ["index-points-as-percent", "ending-index-denominator", "sign-reversal"]
    );
  };

  DERIVERS.base_100_index_interpret = function (p) {
    var start = rat(p.startN, p.startD);
    var end = rat(p.endN, p.endD);
    var pointChange = subRat(end, start);
    var result = { indexPointChange: pointChange, percentChange: percentPoints(divRat(pointChange, start)), endIndex: end };
    return result;
  };

  function subscriptionPlan(rng, level, id) {
    var monthly = BigInt(rng.int(5, level <= 2 ? 30 : 80)) * 100n;
    var setup = level >= 2 ? BigInt(rng.pick([0, 500, 1000, 2500, 5000])) : 0n;
    var free = level >= 3 ? rng.pick([0, 1, 2, 3]) : 0;
    var annual = level >= 4 ? BigInt(rng.pick([0, 1200, 2400, 3600])) : 0n;
    return { id: id, monthlyCents: monthly.toString(), setupCents: setup.toString(), freeMonths: free, annualFeeCents: annual.toString() };
  }

  function subscriptionTotalExact(plan, months) {
    var billedMonths = Math.max(0, months - Number(plan.freeMonths));
    var annualCharges = BigInt(plan.annualFeeCents) ? Math.ceil(months / 12) : 0;
    return moneyRat(BigInt(plan.setupCents) + BigInt(plan.monthlyCents) * BigInt(billedMonths) + BigInt(plan.annualFeeCents) * BigInt(annualCharges));
  }

  function planLine(plan) {
    var pieces = [moneyFromCents(plan.monthlyCents) + "/month"];
    if (BigInt(plan.setupCents)) pieces.push(moneyFromCents(plan.setupCents) + " setup");
    if (plan.freeMonths) pieces.push(plan.freeMonths + " free access month" + (plan.freeMonths === 1 ? "" : "s"));
    if (BigInt(plan.annualFeeCents)) pieces.push(moneyFromCents(plan.annualFeeCents) + " annual fee per started 12 months");
    return "Plan " + plan.id + ": " + pieces.join("; ");
  }

  GENERATORS.subscription_total = function (level, rng) {
    var months = level === 1 ? rng.pick([6, 12]) : level <= 3 ? rng.pick([6, 12, 18, 24]) : rng.pick([18, 24, 30, 36]);
    var plan = subscriptionPlan(rng, level, "A");
    var total = subscriptionTotalExact(plan, months);
    return makeQuestion("subscription_total", level, "money", { plan: plan, months: months }, prompt("Calculate total stated subscription cost.", [planLine(plan), "Access horizon: " + months + " months"], "Free months reduce monthly charges only. Annual fee, if any, is charged per started 12 months."), [fieldMoney("total", "Total over " + months + " months", total)], ["billed months: " + Math.max(0, months - plan.freeMonths), "fixed + monthly + annual charges", "total: " + moneyFromCents(centsOf(total))], ["months-" + months, plan.freeMonths ? "promotion" : "no-promotion", BigInt(plan.annualFeeCents) ? "annual-fee" : "no-annual"], { units: ["currency"], timeBasis: months + " access months", interpretation: "This is total stated cost over exactly " + months + " access months." }, ["omitted-setup", "free-month-base"]);
  };

  DERIVERS.subscription_total = function (p) {
    return { total: subscriptionTotalExact(p.plan, p.months) };
  };

  GENERATORS.subscription_effective_monthly = function (level, rng) {
    var months = level <= 2 ? 12 : rng.pick([12, 18, 24, 30, 36]);
    var plan = subscriptionPlan(rng, Math.max(2, level), "A");
    var total = subscriptionTotalExact(plan, months);
    var effective = divRat(total, rat(months));
    return makeQuestion("subscription_effective_monthly", level, "money", { plan: plan, months: months }, prompt("Find effective monthly cost over the access horizon.", [planLine(plan), "Access horizon: " + months + " months"], "Divide total stated cost by all access months, including free months."), [fieldMoney("effective", "Effective cost per access month", effective, "currency/month")], ["total stated cost: " + moneyFromCents(centsOf(total)), moneyFromCents(centsOf(total)) + " ÷ " + months + " = " + moneyFromCents(centsOf(effective)) + "/month"], ["months-" + months, plan.freeMonths ? "promotion" : "no-promotion"], { units: ["currency/month"], timeBasis: months + " access months", interpretation: "This is average stated cost per access month over the named horizon." }, ["divided-by-billed-months", "omitted-fixed-fee"]);
  };

  DERIVERS.subscription_effective_monthly = function (p) {
    return { effective: divRat(subscriptionTotalExact(p.plan, p.months), rat(p.months)) };
  };

  GENERATORS.subscription_compare = function (level, rng) {
    var months = level === 1 ? 12 : rng.pick(level <= 3 ? [12, 18, 24] : [18, 24, 30, 36]);
    var count = level === 5 ? 3 : 2;
    var plans = [];
    for (var i = 0; i < count; i += 1) plans.push(subscriptionPlan(rng, level, String.fromCharCode(65 + i)));
    var totals = plans.map(function (plan) { return subscriptionTotalExact(plan, months); });
    var winnerIndex = totals.reduce(function (best, value, index) { return compareRat(value, totals[best]) < 0 ? index : best; }, 0);
    var sorted = totals.slice().sort(compareRat);
    if (compareRat(sorted[0], sorted[1]) === 0 || centsOf(subRat(sorted[1], sorted[0])) === 0n) return GENERATORS.subscription_compare(level, rng);
    var winner = plans[winnerIndex].id;
    return makeQuestion("subscription_compare", level, "choice-and-money", { plans: plans, months: months }, prompt("Compare plans over one common access horizon.", plans.map(planLine).concat(["Access horizon for every plan: " + months + " months"]), "Choose lower stated total cost and give savings versus the next-cheapest plan."), [fieldChoice("plan", "Lower stated cost", winner, plans.map(function (plan) { return { value: plan.id, label: "Plan " + plan.id }; })), fieldMoney("savings", "Savings over horizon", subRat(sorted[1], sorted[0]))], plans.map(function (plan, index) { return plan.id + " total: " + moneyFromCents(centsOf(totals[index])); }).concat(["lower stated cost: Plan " + winner]), ["plans-" + count, "months-" + months, "winner-" + winner], { units: ["choice", "currency"], timeBasis: months + " access months", interpretation: "Plan " + winner + " has lower stated cost over this horizon only." }, ["compared-monthly-only", "omitted-setup"]);
  };

  DERIVERS.subscription_compare = function (p) {
    var totals = p.plans.map(function (plan) { return subscriptionTotalExact(plan, p.months); });
    var winnerIndex = totals.reduce(function (best, value, index) { return compareRat(value, totals[best]) < 0 ? index : best; }, 0);
    var sorted = totals.slice().sort(compareRat);
    return { plan: p.plans[winnerIndex].id, savings: subRat(sorted[1], sorted[0]) };
  };

  GENERATORS.subscription_break_even = function (level, rng) {
    var lowMonthly = BigInt(rng.int(5, 25)) * 100n;
    var monthlyDifference = BigInt(rng.int(3, 15)) * 100n;
    var highSetup = BigInt(rng.int(2, 18)) * monthlyDifference + BigInt(level === 5 ? rng.int(1, 99) : 0);
    var planA = { id: "A", monthlyCents: lowMonthly.toString(), setupCents: highSetup.toString(), freeMonths: 0, annualFeeCents: "0" };
    var planB = { id: "B", monthlyCents: (lowMonthly + monthlyDifference).toString(), setupCents: "0", freeMonths: 0, annualFeeCents: "0" };
    var crossing = divRat(moneyRat(highSetup), moneyRat(monthlyDifference));
    var month = Number((crossing.n + crossing.d - 1n) / crossing.d);
    if (month < 2) return GENERATORS.subscription_break_even(level, rng);
    return makeQuestion("subscription_break_even", level, "integer", { planA: planA, planB: planB, month: month }, prompt("Find the first whole access month when Plan A costs no more than Plan B.", [planLine(planA), planLine(planB)], "Equality qualifies. Verify both the previous month and the answer month."), [fieldInteger("month", "First whole month", month, "month")], ["exact crossing: " + rationalText(crossing) + " months", "month " + (month - 1) + ": A " + moneyFromCents(centsOf(subscriptionTotalExact(planA, month - 1))) + ", B " + moneyFromCents(centsOf(subscriptionTotalExact(planB, month - 1))), "month " + month + ": A " + moneyFromCents(centsOf(subscriptionTotalExact(planA, month))) + ", B " + moneyFromCents(centsOf(subscriptionTotalExact(planB, month)))], [level === 5 ? "fractional-crossing" : "whole-crossing", "month-" + (month <= 6 ? "early" : "later")], { units: ["month"], timeBasis: "whole access months", interpretation: "This is the first whole month satisfying the stated cost inequality." }, ["off-by-one-month", "ignored-setup"]);
  };

  DERIVERS.subscription_break_even = function (p) {
    var difference = BigInt(p.planB.monthlyCents) - BigInt(p.planA.monthlyCents);
    var setupDifference = BigInt(p.planA.setupCents) - BigInt(p.planB.setupCents);
    var crossing = rat(setupDifference, difference);
    return { month: Number((crossing.n + crossing.d - 1n) / crossing.d) };
  };

  GENERATORS.expected_value_single_reward = function (level, rng) {
    var probability = rng.pick(level <= 2 ? [10, 25, 50, 75] : [5, 15, 20, 30, 40, 60, 80]);
    var rewardCents = BigInt(rng.int(5, level <= 2 ? 50 : 250)) * 100n;
    var expectedGross = mulRat(moneyRat(rewardCents), rat(probability, 100));
    var costCents = level === 1 ? 0n : level === 2 ? BigInt(rng.int(1, Math.max(1, Number(centsOf(expectedGross) / 200n)))) * 100n : BigInt(rng.int(0, Math.max(1, Number(centsOf(expectedGross) / 50n)))) * 50n;
    var net = subRat(expectedGross, moneyRat(costCents));
    return makeQuestion("expected_value_single_reward", level, "money", { probability: probability, rewardCents: rewardCents.toString(), costCents: costCents.toString() }, prompt("Calculate net expected monetary value.", [probability + "%: gross reward " + moneyFromCents(rewardCents), (100 - probability) + "%: gross reward " + moneyFromCents(0), "Certain entry cost: " + moneyFromCents(costCents)], "Weight gross reward, then subtract the certain cost once. Round final EV to 2 decimals."), [fieldMoney("ev", "Net expected value", net)], ["expected gross: " + probability + "% × " + moneyFromCents(rewardCents) + " = " + moneyFromCents(centsOf(expectedGross)), "net EV: gross EV − certain cost = " + moneyFromCents(centsOf(net))], [net.n < 0n ? "negative" : net.n > 0n ? "positive" : "zero", "cost-" + (costCents ? "present" : "none")], { units: ["currency"], timeBasis: "one stated trial distribution", interpretation: "Expected value is a long-run average, not a guaranteed one-trial outcome." }, ["weighted-cost", "gross-vs-net"]);
  };

  DERIVERS.expected_value_single_reward = function (p) {
    return { ev: subRat(mulRat(moneyRat(p.rewardCents), rat(p.probability, 100)), moneyRat(p.costCents)) };
  };

  GENERATORS.expected_value_multiple_outcomes = function (level, rng) {
    var probabilities = level === 2 ? [50, 50] : level === 3 ? [20, 30, 50] : level === 4 ? [15, 25, 60] : [10, 20, 30, 40];
    probabilities = rng.shuffle(probabilities);
    var outcomes = probabilities.map(function (probability, index) {
      var sign = index === probabilities.length - 1 && level >= 3 ? -1 : 1;
      return { probability: probability, netCents: (BigInt(sign * rng.int(sign < 0 ? 1 : 0, level <= 3 ? 50 : 150)) * 100n).toString() };
    });
    var ev = outcomes.reduce(function (sum, outcome) {
      return addRat(sum, mulRat(moneyRat(outcome.netCents), rat(outcome.probability, 100)));
    }, rat(0n));
    var steps = outcomes.map(function (outcome) { return outcome.probability + "% × " + moneyFromCents(outcome.netCents); });
    steps[steps.length - 1] += "; sum = " + moneyFromCents(centsOf(ev));
    return makeQuestion("expected_value_multiple_outcomes", level, "money", { outcomes: outcomes }, prompt("Calculate expected value of the complete net-outcome distribution.", outcomes.map(function (outcome) { return outcome.probability + "%: net outcome " + moneyFromCents(outcome.netCents); }), "Probabilities sum to 100%. Weight every mutually exclusive net outcome."), [fieldMoney("ev", "Expected value", ev)], steps, ["outcomes-" + outcomes.length, ev.n < 0n ? "negative" : ev.n > 0n ? "positive" : "zero"], { units: ["currency"], timeBasis: "one complete stated distribution", interpretation: "Expected value is a long-run average, not a guaranteed outcome." }, ["unweighted-average", "omitted-outcome"]);
  };

  DERIVERS.expected_value_multiple_outcomes = function (p) {
    return { ev: p.outcomes.reduce(function (sum, outcome) { return addRat(sum, mulRat(moneyRat(outcome.netCents), rat(outcome.probability, 100))); }, rat(0n)) };
  };

  function simpleEvOption(id, probability, rewardCents, costCents) {
    return { id: id, probability: probability, rewardCents: BigInt(rewardCents).toString(), costCents: BigInt(costCents).toString() };
  }

  function optionEv(option) {
    return subRat(mulRat(moneyRat(option.rewardCents), rat(option.probability, 100)), moneyRat(option.costCents));
  }

  function optionLine(option) {
    return "Option " + option.id + ": " + option.probability + "% chance of gross " + moneyFromCents(option.rewardCents) + "; certain cost " + moneyFromCents(option.costCents) + "; otherwise gross 0";
  }

  GENERATORS.expected_value_compare = function (level, rng) {
    var a = simpleEvOption("A", rng.pick([10, 20, 25, 50, 75]), BigInt(rng.int(10, 100)) * 100n, BigInt(rng.int(0, 10)) * 100n);
    var b = simpleEvOption("B", rng.pick([10, 20, 25, 50, 75]), BigInt(rng.int(10, 120)) * 100n, BigInt(rng.int(0, 10)) * 100n);
    var evA = optionEv(a);
    var evB = optionEv(b);
    if (compareRat(evA, evB) === 0 || centsOf(subRat(evA, evB)) === 0n) return GENERATORS.expected_value_compare(level, rng);
    var winner = compareRat(evA, evB) > 0 ? "A" : "B";
    var difference = compareRat(evA, evB) > 0 ? subRat(evA, evB) : subRat(evB, evA);
    return makeQuestion("expected_value_compare", level, "choice-and-money", { options: [a, b] }, prompt("Compare the two net expected values.", [optionLine(a), optionLine(b)], "Choose the higher long-run average and give the EV difference."), [fieldChoice("option", "Higher expected value", winner, [{ value: "A", label: "Option A" }, { value: "B", label: "Option B" }]), fieldMoney("difference", "EV difference", difference)], ["A EV: " + moneyFromCents(centsOf(evA)), "B EV: " + moneyFromCents(centsOf(evB)), "higher EV: Option " + winner + " by " + moneyFromCents(centsOf(difference))], ["winner-" + winner, "max-payoff-" + (BigInt(a.rewardCents) > BigInt(b.rewardCents) ? "A" : "B")], { units: ["choice", "currency"], timeBasis: "same one-trial distribution basis", interpretation: "This ranks stated long-run averages, not risk or suitability." }, ["maximum-payoff-choice", "weighted-cost"]);
  };

  DERIVERS.expected_value_compare = function (p) {
    var evA = optionEv(p.options[0]);
    var evB = optionEv(p.options[1]);
    return { option: compareRat(evA, evB) > 0 ? "A" : "B", difference: compareRat(evA, evB) > 0 ? subRat(evA, evB) : subRat(evB, evA) };
  };

  GENERATORS.expected_value_break_even = function (level, rng) {
    var rewardCents = BigInt(rng.int(10, 200)) * 100n;
    var probability = rng.pick([10, 20, 25, 30, 40, 50, 60, 75]);
    var cost = mulRat(moneyRat(rewardCents), rat(probability, 100));
    var requestProbability = level >= 3 && rng.chance(0.6);
    if (!requestProbability) {
      return makeQuestion("expected_value_break_even", level, "money", { request: "cost", rewardCents: rewardCents.toString(), probability: probability }, prompt("Find the break-even certain cost.", [probability + "% chance of gross reward " + moneyFromCents(rewardCents), "Otherwise gross reward " + moneyFromCents(0)], "Find the cost that makes net EV exactly zero."), [fieldMoney("answer", "Break-even cost", cost)], ["p × reward − cost = 0", "cost = " + moneyFromCents(centsOf(cost))], ["request-cost", "probability-" + probability], { units: ["currency"], interpretation: "At equality the stated net EV is zero, not positive." }, ["cost-weighted-by-probability"]);
    }
    var costCents = centsOf(cost);
    if (level >= 5) costCents += BigInt(rng.int(1, 99));
    var exactProbability = percentPoints(divRat(moneyRat(costCents), moneyRat(rewardCents)));
    var whole = level >= 5;
    var field = whole ? fieldInteger("answer", "Minimum whole-percent probability", (basisPointsOf(exactProbability) + 99n) / 100n, "percent") : fieldPercent("answer", "Exact break-even probability", exactProbability);
    return makeQuestion("expected_value_break_even", level, whole ? "integer-percent" : "percent", { request: whole ? "minimum-whole-percent" : "probability", rewardCents: rewardCents.toString(), costCents: costCents.toString() }, prompt("Find the break-even win probability.", ["Gross reward: " + moneyFromCents(rewardCents), "Certain cost: " + moneyFromCents(costCents), "Otherwise gross reward: " + moneyFromCents(0)], whole ? "Give the minimum whole-percent probability for non-negative EV." : "Give the exact break-even percentage, rounded to 2 decimals."), [field], ["p × reward − cost = 0", "exact threshold: " + percentFromBasisPoints(basisPointsOf(exactProbability)), whole ? "round upward to the first whole percent that is non-negative" : "equality gives zero EV"], [whole ? "minimum-whole" : "exact-probability"], { units: ["percent"], interpretation: "The threshold describes this stated EV equality only." }, ["probability-as-decimal-fraction"]);
  };

  DERIVERS.expected_value_break_even = function (p) {
    if (p.request === "cost") return { answer: mulRat(moneyRat(p.rewardCents), rat(p.probability, 100)) };
    var exact = percentPoints(divRat(moneyRat(p.costCents), moneyRat(p.rewardCents)));
    if (p.request === "minimum-whole-percent") return { answer: Number((basisPointsOf(exact) + 99n) / 100n) };
    return { answer: exact };
  };

  function chargeDisplayLabel(row) {
    if (row.type === "tip") return row.displayAs === "gratuity" ? "Gratuity" : "Tip";
    if (row.type === "tax") return "Fictional tax";
    return "Surcharge";
  }

  function chargeBaseLabel(row) {
    return row.baseIds.map(function (id) {
      if (id === "eligibleSubtotal") return "eligible subtotal";
      return id === "surcharge" ? "surcharge" : id === "tip" ? "tip/gratuity" : "fictional tax";
    }).join(" plus ");
  }

  function deriveChargeLedger(parameters) {
    var values = { eligibleSubtotal: moneyRat(parameters.eligibleSubtotalCents) };
    var rows = [];
    parameters.chargeRows.forEach(function (row) {
      var exact;
      if (row.kind === "fixed") {
        exact = moneyRat(row.fixedCents);
      } else {
        var base = row.baseIds.reduce(function (sum, id) { return addRat(sum, values[id]); }, rat(0n));
        exact = mulRat(base, rateRat(row.rateBp));
      }
      if (parameters.roundingPolicy === "line-rounded") exact = moneyRat(centsOf(exact));
      values[row.id] = exact;
      rows.push({ id: row.id, exact: exact });
    });
    var total = rows.reduce(function (sum, row) { return addRat(sum, row.exact); }, values.eligibleSubtotal);
    values.billTotal = total;
    return { values: values, rows: rows, total: total };
  }

  function chargeRowPrompt(row) {
    var label = chargeDisplayLabel(row);
    if (row.kind === "fixed") return label + ": fixed " + moneyFromCents(row.fixedCents);
    return label + ": " + rateLabel(row.rateBp) + " of " + chargeBaseLabel(row);
  }

  function makeBillChargeRows(level, rng) {
    var tipLabel = rng.chance(0.5) ? "tip" : "gratuity";
    if (level === 1) {
      return [{ id: "tip", type: "tip", displayAs: tipLabel, kind: "rate", rateBp: rng.pick([1000, 1500, 2000]), baseIds: ["eligibleSubtotal"] }];
    }
    if (level === 2) {
      var useFixed = rng.chance(0.5);
      return [
        { id: "surcharge", type: "surcharge", kind: useFixed ? "fixed" : "rate", fixedCents: useFixed ? String(rng.pick([100, 200, 500])) : undefined, rateBp: useFixed ? undefined : rng.pick([500, 1000]), baseIds: useFixed ? [] : ["eligibleSubtotal"] },
        { id: "tip", type: "tip", displayAs: tipLabel, kind: "rate", rateBp: rng.pick([1000, 1500, 2000]), baseIds: ["eligibleSubtotal"] }
      ];
    }
    if (level === 3) {
      return [
        { id: "surcharge", type: "surcharge", kind: "rate", rateBp: rng.pick([500, 750, 1000]), baseIds: ["eligibleSubtotal"] },
        { id: "tax", type: "tax", kind: "rate", rateBp: rng.pick([500, 600, 800, 1000]), baseIds: ["eligibleSubtotal", "surcharge"] }
      ];
    }
    return [
      { id: "tip", type: "tip", displayAs: tipLabel, kind: "rate", rateBp: rng.pick(level >= 5 ? [1250, 1750, 1850, 2250] : [1000, 1500, 2000]), baseIds: ["eligibleSubtotal"] },
      level >= 5 && rng.chance(0.5)
        ? { id: "surcharge", type: "surcharge", kind: "fixed", fixedCents: String(rng.pick([125, 200, 350, 500])), baseIds: [] }
        : { id: "surcharge", type: "surcharge", kind: "rate", rateBp: rng.pick([500, 750, 1000]), baseIds: ["eligibleSubtotal"] },
      { id: "tax", type: "tax", kind: "rate", rateBp: rng.pick(level >= 5 ? [550, 625, 725, 825] : [500, 800, 1000]), baseIds: ["eligibleSubtotal", "surcharge"] }
    ];
  }

  GENERATORS.bill_charges_total = function (level, rng) {
    var eligibleSubtotalCents = level >= 5 ? BigInt(rng.int(1001, 50000)) : BigInt(rng.int(10, level <= 2 ? 150 : 500)) * 100n;
    var parameters = {
      eligibleSubtotalCents: eligibleSubtotalCents.toString(),
      chargeRows: makeBillChargeRows(level, rng),
      roundingPolicy: level >= 5 ? "line-rounded" : "final-only"
    };
    var ledger = deriveChargeLedger(parameters);
    var requestedRows = level >= 4 ? parameters.chargeRows : level === 1 ? parameters.chargeRows : [];
    var fields = requestedRows.map(function (row) {
      return fieldMoney(row.id, chargeDisplayLabel(row), ledger.values[row.id]);
    });
    fields.push(fieldMoney("billTotal", "Bill total", ledger.total));
    var workedSteps = parameters.chargeRows.map(function (row) {
      return chargeDisplayLabel(row) + ": " + moneyFromCents(centsOf(ledger.values[row.id]));
    });
    workedSteps.push("eligible subtotal plus each charge once = " + moneyFromCents(centsOf(ledger.total)));
    return makeQuestion(
      "bill_charges_total",
      level,
      fields.length > 1 ? "multi-money" : "money",
      parameters,
      prompt(
        "Calculate the fictional bill charges.",
        ["Eligible subtotal: " + moneyFromCents(eligibleSubtotalCents)].concat(parameters.chargeRows.map(chargeRowPrompt)),
        (parameters.roundingPolicy === "line-rounded" ? "Round each charge line to the currency minor unit before adding." : "Keep exact intermediate values and round only requested final amounts.") + " Rates and labels are fictional arithmetic inputs, not tax or tipping guidance."
      ),
      fields,
      workedSteps,
      [parameters.chargeRows.map(function (row) { return row.type + "-" + row.kind; }).join(","), parameters.roundingPolicy, fields.length > 1 ? "all-fields" : "total-only"],
      { units: ["currency"], roundingStage: parameters.roundingPolicy, difficultyDimensions: ["charge-count-" + parameters.chargeRows.length, "named-bases", parameters.roundingPolicy], interpretation: "This is a fictional charge ledger for arithmetic practice, not a statement of customary or legal charges." },
      ["one-base-for-all", "omitted-charge", "double-counted-charge", "fixed-fee-as-percent"]
    );
  };

  DERIVERS.bill_charges_total = function (p) {
    return deriveChargeLedger(p).values;
  };

  function buildSharedBillScenario(level, rng) {
    var count = level === 1 ? rng.int(2, 4) : level >= 5 ? 4 : rng.int(2, Math.min(4, level + 1));
    var participants = [];
    if (level === 1) {
      var equalShareCents = BigInt(rng.int(8, 80)) * 100n;
      for (var equalIndex = 0; equalIndex < count; equalIndex += 1) {
        participants.push({ id: String.fromCharCode(65 + equalIndex), eligibleCents: equalShareCents.toString() });
      }
      return {
        mode: "equal-total",
        eligibleSubtotalCents: (equalShareCents * BigInt(count)).toString(),
        participants: participants,
        chargeRows: [],
        roundingPolicy: "line-rounded"
      };
    }
    var totalEligible = 0n;
    for (var i = 0; i < count; i += 1) {
      var cents = level >= 4 ? BigInt(rng.int(501, 5000) + i) : BigInt(rng.int(8, 50) + i * 3) * 100n;
      while (participants.some(function (participant) { return BigInt(participant.eligibleCents) === cents; })) cents += level >= 4 ? 1n : 100n;
      participants.push({ id: String.fromCharCode(65 + i), eligibleCents: cents.toString() });
      totalEligible += cents;
    }
    var tipLabel = rng.chance(0.5) ? "tip" : "gratuity";
    var chargeRows;
    if (level === 2) {
      chargeRows = [{ id: "tip", type: "tip", displayAs: tipLabel, kind: "rate", rateBp: rng.pick([1000, 1500, 2000]), baseIds: ["eligibleSubtotal"], allocation: "proportional" }];
    } else if (level === 3) {
      chargeRows = [
        { id: "tip", type: "tip", displayAs: tipLabel, kind: "rate", rateBp: rng.pick([1000, 1500, 2000]), baseIds: ["eligibleSubtotal"], allocation: "proportional" },
        { id: "tax", type: "tax", kind: "rate", rateBp: rng.pick([500, 800, 1000]), baseIds: ["eligibleSubtotal"], allocation: "proportional" }
      ];
    } else {
      chargeRows = [
        { id: "tip", type: "tip", displayAs: tipLabel, kind: "rate", rateBp: rng.pick([1250, 1500, 1750, 2000]), baseIds: ["eligibleSubtotal"], allocation: "proportional" },
        { id: "surcharge", type: "surcharge", kind: "fixed", fixedCents: String(rng.pick([100, 200, 500, 700])), baseIds: [], allocation: "equal" },
        { id: "tax", type: "tax", kind: "rate", rateBp: rng.pick([500, 625, 800, 1000]), baseIds: ["eligibleSubtotal", "surcharge"], allocation: "proportional" }
      ];
    }
    return {
      mode: level >= 4 ? "mixed" : "proportional",
      eligibleSubtotalCents: totalEligible.toString(),
      participants: participants,
      chargeRows: chargeRows,
      roundingPolicy: "line-rounded"
    };
  }

  function floorPositive(value) {
    if (value.n < 0n) throw new Error("negative allocation");
    return value.n / value.d;
  }

  function deriveSharedAllocation(parameters) {
    var ledger = deriveChargeLedger(parameters);
    var totalCents = centsOf(ledger.total);
    var count = parameters.participants.length;
    var exactShares;
    if (parameters.mode === "equal-total") {
      exactShares = parameters.participants.map(function (participant) {
        return { id: participant.id, cents: rat(totalCents, count) };
      });
    } else {
      var eligibleTotal = BigInt(parameters.eligibleSubtotalCents);
      exactShares = parameters.participants.map(function (participant) {
        var eligible = BigInt(participant.eligibleCents);
        var share = rat(eligible);
        parameters.chargeRows.forEach(function (row) {
          var chargeCents = centsOf(ledger.values[row.id]);
          share = addRat(share, row.allocation === "equal" ? rat(chargeCents, count) : mulRat(rat(chargeCents), rat(eligible, eligibleTotal)));
        });
        return { id: participant.id, cents: share };
      });
    }
    var floors = {};
    var floorSum = 0n;
    exactShares.forEach(function (entry) {
      floors[entry.id] = floorPositive(entry.cents);
      floorSum += floors[entry.id];
    });
    var remaining = totalCents - floorSum;
    var ranked = exactShares.slice().sort(function (a, b) {
      var aRemainder = a.cents.n % a.cents.d;
      var bRemainder = b.cents.n % b.cents.d;
      var comparison = aRemainder * b.cents.d - bRemainder * a.cents.d;
      return comparison === 0n ? a.id.localeCompare(b.id) : comparison > 0n ? -1 : 1;
    });
    for (var i = 0; i < Number(remaining); i += 1) floors[ranked[i].id] += 1n;
    var values = {};
    parameters.participants.forEach(function (participant) { values["person" + participant.id] = moneyRat(floors[participant.id]); });
    values.allocationTotal = moneyRat(totalCents);
    return { values: values, exactShares: exactShares, roundedCents: floors, remaining: remaining, ledger: ledger };
  }

  GENERATORS.shared_bill_allocate = function (level, rng) {
    var parameters = buildSharedBillScenario(level, rng);
    var allocation = deriveSharedAllocation(parameters);
    var participantRows = parameters.mode === "equal-total"
      ? ["Participants: " + parameters.participants.map(function (participant) { return "Person " + participant.id; }).join(", ")]
      : parameters.participants.map(function (participant) { return "Person " + participant.id + " eligible subtotal: " + moneyFromCents(participant.eligibleCents); });
    var chargeRows = parameters.chargeRows.map(function (row) {
      var policy = row.allocation === "equal" ? "split equally" : "allocate in proportion to eligible subtotal";
      var calculation = level >= 5 ? chargeRowPrompt(row) : chargeDisplayLabel(row) + ": " + moneyFromCents(centsOf(allocation.ledger.values[row.id]));
      return calculation + "; " + policy;
    });
    var fields = parameters.participants.map(function (participant) {
      return fieldMoney("person" + participant.id, "Person " + participant.id + " final share", allocation.values["person" + participant.id]);
    });
    if (level >= 4) fields.push(fieldMoney("allocationTotal", "Allocation total", allocation.values.allocationTotal));
    var policyText = parameters.mode === "equal-total" ? "Split the complete bill total equally." : parameters.mode === "proportional" ? "Keep each person's own eligible subtotal; allocate every listed charge proportionally." : "Keep each person's own eligible subtotal; split fixed surcharge equally and allocate percentage charges proportionally.";
    var remainderText = allocation.remaining
      ? "Round exact shares down to minor units, then assign remaining units by largest fractional remainder; ties go to the earlier person ID."
      : "All participant shares reconcile exactly at the currency minor unit.";
    var workedSteps = parameters.mode === "equal-total"
      ? ["complete bill total: " + moneyFromCents(centsOf(allocation.ledger.total)), "divide by " + parameters.participants.length + " participants", "reconciled shares sum to " + moneyFromCents(centsOf(allocation.ledger.total))]
      : ["eligible subtotal: " + moneyFromCents(parameters.eligibleSubtotalCents), "apply each row's stated equal or proportional policy", remainderText, "reconciled shares sum to " + moneyFromCents(centsOf(allocation.ledger.total))];
    return makeQuestion(
      "shared_bill_allocate",
      level,
      fields.length > 1 ? "multi-money" : "money",
      parameters,
      prompt(
        "Allocate the fictional shared bill.",
        participantRows.concat(chargeRows, ["Complete bill total: " + moneyFromCents(centsOf(allocation.ledger.total)), "Allocation policy: " + policyText]),
        (parameters.chargeRows.length ? "Round each charge line to the currency minor unit before allocation. " : "") + remainderText + " This is a stated arithmetic policy, not a claim about fairness or custom."
      ),
      fields,
      workedSteps,
      [parameters.mode, "people-" + parameters.participants.length, allocation.remaining ? "remainder" : "exact", parameters.chargeRows.map(function (row) { return row.type + "-" + row.allocation; }).join(",")],
      { units: ["currency"], roundingStage: "line-rounded charges then largest-remainder allocation", difficultyDimensions: ["people-" + parameters.participants.length, parameters.mode, allocation.remaining ? "minor-unit-remainder" : "exact-minor-unit"], interpretation: "The shares follow only the displayed fictional allocation policy and sum exactly to the bill total." },
      ["equal-instead-of-proportional", "proportional-instead-of-equal", "omitted-charge", "independent-rounding"]
    );
  };

  DERIVERS.shared_bill_allocate = function (p) {
    return deriveSharedAllocation(p).values;
  };

  function validateQuestion(question) {
    ["categoryId", "subcategoryId", "familyId", "level", "answerKind", "currencyPrecision", "units", "timeBasis", "roundingStage", "difficultyDimensions", "misconceptionsTargeted", "parameters", "exactAnswer", "roundedAnswer", "workedSteps", "structuralSignature"].forEach(function (key) {
      if (question[key] === undefined || question[key] === null) throw new Error("Missing metadata " + key);
    });
    if (!GENERATORS[question.familyId] || !DERIVERS[question.familyId]) throw new Error("Missing family implementation " + question.familyId);
    if (!familyById(question.familyId).levels.includes(question.level)) throw new Error("Unsupported family level");
    if (!question.answer.fields.length || !question.workedSteps.length || question.workedSteps.length > 4) throw new Error("Invalid answer or worked steps");
    if (/\{[a-zA-Z][^}]*\}/.test([question.prompt.title].concat(question.prompt.rows, [question.prompt.note]).join(" "))) throw new Error("Unresolved placeholder");
    question.answer.fields.forEach(function (answerField) {
      if (answerField.kind === "choice") {
        if (answerField.options.filter(function (option) { return option.value === answerField.value; }).length !== 1) throw new Error("Choice has non-unique answer");
      }
    });
    var derived = DERIVERS[question.familyId](question.parameters);
    question.answer.fields.forEach(function (answerField) {
      if (!Object.prototype.hasOwnProperty.call(derived, answerField.id)) throw new Error("Missing independent field derivation " + answerField.id);
      if (answerField.kind === "choice") {
        if (derived[answerField.id] !== answerField.value) throw new Error("Choice derivation mismatch");
      } else if (answerField.kind === "integer") {
        if (BigInt(derived[answerField.id]) !== BigInt(answerField.value)) throw new Error("Integer derivation mismatch");
      } else {
        var scale = answerField.kind === "money" || answerField.kind === "percent" ? 100 : 10n ** BigInt(answerField.precision);
        if (roundHalfAway(derived[answerField.id], scale) !== BigInt(answerField.value)) throw new Error("Rounded derivation mismatch " + answerField.id);
      }
    });
    if (question.familyId === "expected_value_multiple_outcomes") {
      if (question.parameters.outcomes.reduce(function (sum, outcome) { return sum + outcome.probability; }, 0) !== 100) throw new Error("Incomplete probability distribution");
    }
    if (question.familyId === "base_100_index_interpret") {
      if (BigInt(question.parameters.startN) <= 0n || BigInt(question.parameters.endN) <= 0n) throw new Error("Index values must be positive");
      if (question.parameters.mode !== "base" && BigInt(question.parameters.startN) === 100n * BigInt(question.parameters.startD)) throw new Error("Non-base index interval starts at 100");
      if (question.parameters.mode !== "forward") {
        var visibleStart = rat(question.parameters.startN, question.parameters.startD);
        var visibleEnd = rat(question.parameters.endN, question.parameters.endD);
        if (compareRat(visibleStart, rat(roundHalfAway(visibleStart, 10), 10)) !== 0 || compareRat(visibleEnd, rat(roundHalfAway(visibleEnd, 10), 10)) !== 0) throw new Error("Displayed index inputs lose semantic precision");
      }
    }
    if (question.familyId === "bill_charges_total" || question.familyId === "shared_bill_allocate") {
      var chargeLedger = deriveChargeLedger(question.parameters);
      var chargeSum = question.parameters.chargeRows.reduce(function (sum, row) { return addRat(sum, chargeLedger.values[row.id]); }, moneyRat(question.parameters.eligibleSubtotalCents));
      if (compareRat(chargeSum, chargeLedger.total) !== 0) throw new Error("Charge ledger does not reconcile");
    }
    if (question.familyId === "shared_bill_allocate") {
      var allocation = deriveSharedAllocation(question.parameters);
      var allocated = question.parameters.participants.reduce(function (sum, participant) {
        return addRat(sum, allocation.values["person" + participant.id]);
      }, rat(0n));
      if (compareRat(allocated, allocation.values.allocationTotal) !== 0) throw new Error("Shared bill allocation does not reconcile");
      if (BigInt(question.parameters.eligibleSubtotalCents) !== question.parameters.participants.reduce(function (sum, participant) { return sum + BigInt(participant.eligibleCents); }, 0n)) throw new Error("Participant subtotals do not reconcile");
    }
  }

  function generateQuestion(familyId, level, seed, ignoreHistory) {
    var family = familyById(familyId);
    if (!family.levels.includes(level)) level = family.levels.reduce(function (best, candidate) { return Math.abs(candidate - level) < Math.abs(best - level) ? candidate : best; }, family.levels[0]);
    var rng = new Rng(seed);
    var candidate;
    var attempts = 0;
    do {
      candidate = GENERATORS[familyId](level, rng);
      candidate = localizeQuestion(candidate);
      candidate.parameters.seed = seed >>> 0;
      candidate.parameters.generationAttempt = attempts;
      attempts += 1;
    } while (!ignoreHistory && attempts < 100 && (recentSignatures.includes(candidate.structuralSignature) || recentPrompts.includes(renderedPromptKey(candidate))));
    if (!ignoreHistory && attempts >= 100 && typeof console !== "undefined") console.warn("Question uniqueness fallback", familyId, level, seed);
    validateQuestion(candidate);
    return candidate;
  }

  function renderedPromptKey(question) {
    return [question.prompt.title].concat(question.prompt.rows, [question.prompt.note]).join("\n");
  }

  function stripAffixes(text, kind) {
    var value = String(text === undefined ? "" : text).trim().replace(/[−–—]/g, "-");
    var tokens = value.match(/\b(?:kr|sek|usd|eur|gbp|dollars?|euros?|pounds?)\b|[$€£¥]/gi) || [];
    var allowedCurrency = {
      usd: /^(?:usd|dollars?|\$)$/i,
      eur: /^(?:eur|euros?|€)$/i,
      sek: /^(?:sek|kr)$/i,
      gbp: /^(?:gbp|pounds?|£)$/i,
      none: /$a/
    }[activeCurrencyId()];
    if (tokens.length && (kind !== "money" || tokens.some(function (token) { return !allowedCurrency.test(token); }))) return null;
    if (kind === "money") value = value.replace(/\b(?:kr|sek|usd|eur|gbp|dollars?|euros?|pounds?)\b/gi, "").replace(/[$€£¥]/g, "").trim();
    if (kind === "percent") value = value.replace(/%\s*$/, "").trim();
    else if (/%/.test(value)) return null;
    if (kind === "money" || kind === "decimal") value = value.replace(/\s*\/\s*[a-zA-Z0-9 ]+$/, "").trim();
    return value;
  }

  function parseLocalizedRational(text, kind) {
    var value = stripAffixes(text, kind);
    if (value === null || !value) return null;
    value = value.replace(/[\s_\u00a0']/g, "");
    var sign = 1n;
    if (value[0] === "+" || value[0] === "-") {
      if (value[0] === "-") sign = -1n;
      value = value.slice(1);
    }
    if (!value || /[+-]/.test(value)) return null;
    var decimal = decimalSeparator();
    var grouping = groupingSeparator();
    if ((value.match(new RegExp("\\" + decimal, "g")) || []).length > 1) return null;
    var parts = value.split(decimal);
    var integerPart = parts[0];
    var fractionalPart = parts.length === 2 ? parts[1] : "";
    if (fractionalPart && (!/^\d+$/.test(fractionalPart) || fractionalPart.indexOf(grouping) >= 0)) return null;
    if (integerPart.indexOf(grouping) >= 0) {
      var groups = integerPart.split(grouping);
      if (!/^\d{1,3}$/.test(groups[0]) || groups.slice(1).some(function (group) { return !/^\d{3}$/.test(group); })) return null;
      integerPart = groups.join("");
    }
    if (!/^\d+$/.test(integerPart)) return null;
    var digits = integerPart + fractionalPart;
    return rat(sign * BigInt(digits), 10n ** BigInt(fractionalPart.length));
  }

  function normalizeAnswerField(answerField, text) {
    if (answerField.kind === "choice") return String(text || "").trim();
    var parsed = parseLocalizedRational(text, answerField.kind);
    if (!parsed) return null;
    if (answerField.kind === "integer") return parsed.d === 1n ? parsed.n.toString() : null;
    var scale = answerField.kind === "money" || answerField.kind === "percent" ? 100 : 10n ** BigInt(answerField.precision);
    return roundHalfAway(parsed, scale).toString();
  }

  function expectedFieldDisplay(answerField) {
    if (answerField.kind === "money") return moneyFromCents(answerField.value);
    if (answerField.kind === "percent") return percentFromBasisPoints(answerField.value);
    if (answerField.kind === "decimal") return decimalFromScaled(answerField.value, answerField.precision) + (answerField.unit && answerField.unit !== "number" ? " " + answerField.unit : "");
    if (answerField.kind === "integer") return answerField.value + (answerField.unit === "month" ? " months" : answerField.unit === "percent" ? "%" : "");
    var option = answerField.options.find(function (item) { return item.value === answerField.value; });
    return option ? option.label : answerField.value;
  }

  function checkQuestion(answers, question) {
    var parts = {};
    var correct = true;
    question.answer.fields.forEach(function (answerField) {
      var normalized = normalizeAnswerField(answerField, answers[answerField.id]);
      var fieldCorrect = normalized !== null && normalized === answerField.value;
      parts[answerField.id] = { label: answerField.label, normalized: normalized, expected: answerField.value, correct: fieldCorrect };
      if (!fieldCorrect) correct = false;
    });
    return {
      correct: correct,
      parts: parts,
      expectedText: question.answer.fields.map(function (answerField) {
        return answerField.label + " = " + localizeGeneratedString(expectedFieldDisplay(answerField));
      }).join("; "),
      diagnosis: diagnose(question, parts)
    };
  }

  function diagnose(question, parts) {
    var wrong = Object.keys(parts).filter(function (id) { return !parts[id].correct; });
    var correct = Object.keys(parts).filter(function (id) { return parts[id].correct; });
    if (correct.length && wrong.length) return localizeGeneratedString("The " + correct.map(function (id) { return parts[id].label; }).join(", ") + " stage is correct. Recheck " + wrong.map(function (id) { return parts[id].label; }).join(", ") + " using its named base and unit.");
    var family = question.familyId;
    if (family.indexOf("unit_price") === 0) return localizeGeneratedString("Normalize quantity to the comparison unit, then divide price by quantity—not the reverse.");
    if (["discount_single", "tax_single"].includes(family)) return localizeGeneratedString("Identify whether the prompt asks for the percentage amount or the final total.");
    if (["discount_then_tax", "successive_discounts", "successive_percent_changes"].includes(family)) return localizeGeneratedString("Each stage uses its updated base; multiply stage factors instead of adding signed rates.");
    if (family.indexOf("percent_change") >= 0 || family === "reverse_change_comparison") return localizeGeneratedString("Percent change divides by the original value for that direction.");
    if (family.indexOf("interest") >= 0 || family === "simple_vs_compound") return localizeGeneratedString("Keep principal, interest, balance, annual basis, and model distinct.");
    if (["inflated_future_price", "cumulative_inflation_rate"].includes(family)) return localizeGeneratedString("Constant annual inflation compounds through the stated horizon.");
    if (["purchasing_power", "real_change_from_nominal"].includes(family)) return localizeGeneratedString("Nominal and real values move in opposite calculation directions: deflate by division.");
    if (family === "base_100_index_interpret") return localizeGeneratedString("Index points are not percentages: divide the signed point change by the starting index.");
    if (family.indexOf("subscription") === 0) return localizeGeneratedString("Use the identical access horizon and include every explicitly stated fixed and recurring charge.");
    if (family.indexOf("expected_value") === 0) return localizeGeneratedString("Weight every outcome by its probability; subtract a certain cost once.");
    if (family === "bill_charges_total") return localizeGeneratedString("Apply each fictional charge to its explicitly named base, then include each charge once.");
    if (family === "shared_bill_allocate") return localizeGeneratedString("Use the displayed equal or proportional policy, then reconcile participant shares to the exact bill total.");
    return localizeGeneratedString("Recheck the exact relationship, units, and final-only rounding.");
  }

  function defaultCell() {
    return { attempts: 0, correct: 0, recent: [], streak: 0, totalMs: 0, mastery: 0, calculatorUses: 0, answerKinds: {}, dimensions: {}, misconceptions: {} };
  }

  function defaultProgress() {
    var enabled = {};
    CATEGORIES.forEach(function (category) { enabled[category.id] = true; });
    return {
      version: 2,
      activeView: "practice",
      settings: { adaptive: true, numberFormat: "auto", currencyFormat: "auto", unitSystem: "auto", enabledCategories: enabled },
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
      var legacyId = category.id === "unit-prices" ? "unit-prices" : category.id === "discounts-tax" ? "discounts-tax" : category.id;
      var total = { attempts: 0, correct: 0, totalMs: 0 };
      LEVELS.forEach(function (level) {
        var cell = legacy.cells[legacyId + ":" + level] || {};
        total.attempts += Number(cell.attempts) || 0;
        total.correct += Number(cell.correct) || 0;
        total.totalMs += Number(cell.totalMs) || 0;
      });
      if (total.attempts) migrated.legacyCategoryTotals[category.id] = total;
    });
    if (legacy.settings) {
      ["numberFormat", "currencyFormat", "unitSystem"].forEach(function (key) {
        if (legacy.settings[key]) migrated.settings[key] = legacy.settings[key];
      });
    }
    migrated.history.push({ type: "legacy-category-migration", at: Date.now() });
    return migrated;
  }

  function mergeProgress(base, stored) {
    if (!stored || stored.version !== 2) return base;
    base.activeView = ["practice", "matrix", "stats", "learn", "settings"].includes(stored.activeView) ? stored.activeView : "practice";
    if (stored.settings) {
      ["adaptive", "numberFormat", "currencyFormat", "unitSystem"].forEach(function (key) {
        if (stored.settings[key] !== undefined) base.settings[key] = stored.settings[key];
      });
      if (stored.settings.enabledCategories) Object.assign(base.settings.enabledCategories, stored.settings.enabledCategories);
    }
    if (stored.manual && FAMILIES.some(function (family) { return family.id === stored.manual.familyId; })) {
      var family = familyById(stored.manual.familyId);
      base.manual.categoryId = family.categoryId;
      base.manual.familyId = family.id;
      base.manual.level = family.levels.includes(Number(stored.manual.level)) ? Number(stored.manual.level) : family.levels[0];
    }
    if (stored.cells) base.cells = stored.cells;
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

  function levelUnlocked(family, level) {
    var index = family.levels.indexOf(level);
    if (index <= 0) return true;
    var previous = getCell(family.id, family.levels[index - 1]);
    return previous.attempts >= 5 && recentAccuracy(previous) >= 0.8;
  }

  function prerequisitesMet(family) {
    return (PREREQUISITES[family.id] || []).every(function (prerequisiteId) {
      var totals = familyById(prerequisiteId).levels.reduce(function (result, level) {
        var cell = getCell(prerequisiteId, level);
        result.attempts += cell.attempts;
        result.correct += cell.correct;
        return result;
      }, { attempts: 0, correct: 0 });
      return totals.attempts >= 3 && totals.correct / totals.attempts >= 0.67;
    });
  }

  function eligibleFamilies() {
    return FAMILIES.filter(function (family) {
      return progress.settings.enabledCategories[family.categoryId] !== false && prerequisitesMet(family);
    });
  }

  function chooseAdaptive() {
    var families = eligibleFamilies();
    if (!families.length) families = FAMILIES.filter(function (family) { return progress.settings.enabledCategories[family.categoryId] !== false && !(PREREQUISITES[family.id] || []).length; });
    if (!families.length) families = [FAMILIES[0]];
    var cells = families.map(function (family) {
      var available = family.levels.filter(function (level) { return levelUnlocked(family, level); });
      var level = available[available.length - 1] || family.levels[0];
      return { family: family, level: level, cell: getCell(family.id, level) };
    });
    var roll = sessionRng.int(1, 100);
    if (roll <= 45) {
      cells.sort(function (a, b) { return (a.cell.mastery || 0) - (b.cell.mastery || 0) || a.cell.attempts - b.cell.attempts; });
      return sessionRng.pick(cells.slice(0, Math.min(7, cells.length)));
    }
    if (roll <= 70) {
      var practiced = cells.filter(function (item) { return item.cell.attempts >= 5; });
      return sessionRng.pick(practiced.length ? practiced : cells);
    }
    if (roll <= 90) {
      var diagnostics = cells.filter(function (item) { return item.cell.attempts && recentAccuracy(item.cell) < 0.8; });
      return sessionRng.pick(diagnostics.length ? diagnostics : cells);
    }
    var stretch = sessionRng.pick(cells);
    var nextIndex = stretch.family.levels.indexOf(stretch.level) + 1;
    if (nextIndex < stretch.family.levels.length && levelUnlocked(stretch.family, stretch.family.levels[nextIndex])) stretch.level = stretch.family.levels[nextIndex];
    return stretch;
  }

  function closestLevel(family, requested) {
    return family.levels.reduce(function (best, level) { return Math.abs(level - requested) < Math.abs(best - requested) ? level : best; }, family.levels[0]);
  }

  function startQuestion() {
    resumePractice();
    var selected = progress.settings.adaptive ? chooseAdaptive() : { family: familyById(progress.manual.familyId), level: progress.manual.level };
    currentQuestion = generateQuestion(selected.family.id, selected.level, sessionRng.next(), false);
    recentSignatures.push(currentQuestion.structuralSignature);
    recentPrompts.push(renderedPromptKey(currentQuestion));
    recentSignatures = recentSignatures.slice(-20);
    recentPrompts = recentPrompts.slice(-100);
    currentStartedAt = Date.now();
    pausedMs = 0;
    answered = false;
    renderQuestion();
    renderPracticeControls();
    renderCurrentMetrics();
  }

  function elapsedMs() {
    var activePause = pauseStartedAt ? Date.now() - pauseStartedAt : 0;
    return Math.max(0, Date.now() - currentStartedAt - pausedMs - activePause);
  }

  function pausePractice() {
    if (pauseStartedAt || answered) return;
    pauseStartedAt = Date.now();
    elements.practiceMain.classList.add("paused");
    elements.pauseBtn.disabled = true;
  }

  function resumePractice() {
    if (pauseStartedAt) pausedMs += Date.now() - pauseStartedAt;
    pauseStartedAt = 0;
    if (elements.practiceMain) elements.practiceMain.classList.remove("paused");
    if (elements.pauseBtn) elements.pauseBtn.disabled = answered;
  }

  function timeText(ms) {
    if (!ms) return "0s";
    if (ms < 60000) return Math.round(ms / 100) / 10 + "s";
    return Math.round(ms / 6000) / 10 + "m";
  }

  function recordResult(result, duration) {
    var cell = getCell(currentQuestion.familyId, currentQuestion.level);
    cell.attempts += 1;
    cell.correct += result.correct ? 1 : 0;
    cell.streak = result.correct ? cell.streak + 1 : 0;
    cell.recent = cell.recent.concat([result.correct]).slice(-10);
    cell.totalMs += duration;
    cell.mastery = Math.round(Math.min(1, cell.attempts / 5) * recentAccuracy(cell) * 100);
    cell.answerKinds[currentQuestion.answerKind] = (cell.answerKinds[currentQuestion.answerKind] || 0) + 1;
    currentQuestion.difficultyDimensions.forEach(function (dimension) { cell.dimensions[dimension] = (cell.dimensions[dimension] || 0) + 1; });
    if (!result.correct) currentQuestion.misconceptionsTargeted.forEach(function (name) { cell.misconceptions[name] = (cell.misconceptions[name] || 0) + 1; });
    progress.history.push({ at: Date.now(), familyId: currentQuestion.familyId, level: currentQuestion.level, seed: currentQuestion.parameters.seed, answerKind: currentQuestion.answerKind, signature: currentQuestion.structuralSignature, correct: result.correct, elapsedMs: duration, parts: result.parts });
    progress.history = progress.history.slice(-300);
    saveProgress();
  }

  function renderPrompt(promptData) {
    elements.questionPrompt.innerHTML = "";
    elements.questionPrompt.classList.add("stack");
    var title = document.createElement("div");
    title.className = "prompt-title";
    title.textContent = promptData.title;
    elements.questionPrompt.appendChild(title);
    promptData.rows.forEach(function (row) {
      var line = document.createElement("div");
      line.className = "prompt-row";
      line.textContent = row;
      elements.questionPrompt.appendChild(line);
    });
    var note = document.createElement("div");
    note.className = "prompt-note";
    note.textContent = promptData.note + " " + t("practice.decimalConvention", "Decimal convention") + ": " +
      (decimalSeparator() === "," ? t("practice.decimalComma", "comma") : t("practice.decimalPoint", "point")) + ".";
    elements.questionPrompt.appendChild(note);
  }

  function renderAnswerControls() {
    elements.answerControls.innerHTML = "";
    activeAnswerInput = null;
    currentQuestion.answer.fields.forEach(function (answerField, index) {
      var wrapper = document.createElement("div");
      wrapper.className = "answer-control";
      var label = document.createElement("label");
      label.htmlFor = "answer-" + answerField.id;
      label.textContent = answerField.label;
      wrapper.appendChild(label);
      if (answerField.options) {
        var select = document.createElement("select");
        select.id = "answer-" + answerField.id;
        select.dataset.answerField = answerField.id;
        var blank = document.createElement("option");
        blank.value = "";
        blank.textContent = t("practice.choose", "Choose…");
        select.appendChild(blank);
        answerField.options.forEach(function (option) {
          var element = document.createElement("option");
          element.value = option.value;
          element.textContent = option.label;
          select.appendChild(element);
        });
        wrapper.appendChild(select);
      } else {
        var input = document.createElement("input");
        input.id = "answer-" + answerField.id;
        input.dataset.answerField = answerField.id;
        input.type = "text";
        input.autocomplete = "off";
        input.spellcheck = false;
        input.inputMode = answerField.kind === "integer" ? "numeric" : "decimal";
        input.addEventListener("focus", function () { activeAnswerInput = input; });
        wrapper.appendChild(input);
        if (index === 0) activeAnswerInput = input;
      }
      elements.answerControls.appendChild(wrapper);
    });
  }

  function renderQuestion() {
    var family = familyById(currentQuestion.familyId);
    elements.questionCategory.textContent = categoryById(currentQuestion.categoryId).title;
    elements.questionFamily.textContent = family.title;
    elements.questionLevel.textContent = t("practice.level", "Level") + " " + currentQuestion.level;
    renderPrompt(currentQuestion.prompt);
    renderAnswerControls();
    elements.feedback.className = "feedback hidden";
    elements.submitBtn.disabled = false;
    elements.submitBtn.innerHTML = t("practice.check", "Check") + " <span class=\"key-symbol\">↵</span>";
    elements.nextBtn.classList.add("hidden");
    elements.skipBtn.classList.remove("hidden");
    elements.pauseBtn.disabled = false;
    keypadButtons.get("submit").textContent = t("practice.check", "Check");
    var decimalKey = keypadButtons.get("decimal");
    decimalKey.textContent = decimalSeparator();
    if (activeAnswerInput && window.matchMedia && window.matchMedia("(pointer: fine)").matches) activeAnswerInput.focus();
  }

  function collectAnswers() {
    var answers = {};
    document.querySelectorAll("[data-answer-field]").forEach(function (control) { answers[control.dataset.answerField] = control.value; });
    return answers;
  }

  function showFeedback(result, duration) {
    elements.feedback.className = "feedback " + (result.correct ? "correct" : "incorrect");
    elements.feedback.innerHTML = "";
    var verdict = document.createElement("strong");
    verdict.textContent = result.correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite");
    elements.feedback.appendChild(verdict);
    if (!result.correct) {
      var diagnosis = document.createElement("div");
      diagnosis.textContent = result.diagnosis;
      elements.feedback.appendChild(diagnosis);
      var expected = document.createElement("div");
      expected.className = "expected-code";
      expected.textContent = t("messages.expected", "Expected") + ": " + result.expectedText;
      elements.feedback.appendChild(expected);
    }
    var worked = document.createElement("div");
    worked.className = "worked-route";
    worked.textContent = currentQuestion.workedSteps.join(" → ");
    elements.feedback.appendChild(worked);
    if (currentQuestion.interpretation) {
      var interpretation = document.createElement("div");
      interpretation.className = "interpretation";
      interpretation.textContent = currentQuestion.interpretation;
      elements.feedback.appendChild(interpretation);
    }
    var timing = document.createElement("span");
    timing.className = "feedback-time";
    timing.textContent = t("messages.time", "Time") + ": " + timeText(duration);
    elements.feedback.appendChild(timing);
  }

  function submitAnswer(event) {
    event.preventDefault();
    if (!currentQuestion || pauseStartedAt) return;
    if (answered) {
      startQuestion();
      return;
    }
    var result = checkQuestion(collectAnswers(), currentQuestion);
    var duration = elapsedMs();
    recordResult(result, duration);
    answered = true;
    document.querySelectorAll("[data-answer-field]").forEach(function (control) { control.disabled = true; });
    elements.submitBtn.innerHTML = t("practice.next", "Next") + " <span class=\"key-symbol\">↵</span>";
    elements.nextBtn.classList.remove("hidden");
    elements.skipBtn.classList.add("hidden");
    elements.pauseBtn.disabled = true;
    keypadButtons.get("submit").textContent = t("practice.next", "Next");
    showFeedback(result, duration);
    renderCurrentMetrics();
    renderSummary();
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

  function renderPracticeControls() {
    var activeFamily = currentQuestion ? familyById(currentQuestion.familyId) : familyById(progress.manual.familyId);
    selectorController.render({ familyId: activeFamily.id, level: currentQuestion ? currentQuestion.level : progress.manual.level });
    elements.adaptiveModeBtn.classList.toggle("secondary-active", progress.settings.adaptive);
    elements.manualModeBtn.classList.toggle("secondary-active", !progress.settings.adaptive);
  }

  function renderCurrentMetrics() {
    if (!currentQuestion) return;
    var cell = getCell(currentQuestion.familyId, currentQuestion.level);
    elements.metricMastery.textContent = Math.round(cell.mastery || 0) + "%";
    elements.metricAccuracy.textContent = accuracy(cell) + "%";
    elements.metricStreak.textContent = String(cell.streak || 0);
    elements.metricAvgTime.textContent = timeText(cell.attempts ? cell.totalMs / cell.attempts : 0);
    elements.questionMastery.textContent = Math.round(cell.mastery || 0) + "% " + t("practice.masterySuffix", "mastery");
    elements.questionMastery.className = "pill " + ((cell.mastery || 0) >= 75 ? "good" : "warn");
  }

  function familyCells() {
    var output = [];
    FAMILIES.forEach(function (family) { family.levels.forEach(function (level) { output.push({ family: family, category: categoryById(family.categoryId), level: level, cell: getCell(family.id, level) }); }); });
    return output;
  }

  function legacyTotals() {
    return Object.keys(progress.legacyCategoryTotals || {}).reduce(function (total, id) {
      var value = progress.legacyCategoryTotals[id];
      total.attempts += value.attempts || 0;
      total.correct += value.correct || 0;
      total.totalMs += value.totalMs || 0;
      return total;
    }, { attempts: 0, correct: 0, totalMs: 0 });
  }

  function renderSummary() {
    var practiced = familyCells().filter(function (entry) { return entry.cell.attempts; });
    var totals = practiced.reduce(function (total, entry) { total.attempts += entry.cell.attempts; total.correct += entry.cell.correct; return total; }, legacyTotals());
    var mastery = practiced.length ? practiced.reduce(function (sum, entry) { return sum + (entry.cell.mastery || 0); }, 0) / practiced.length : 0;
    elements.summaryMastery.textContent = Math.round(mastery) + "%";
    elements.summaryAccuracy.textContent = (totals.attempts ? Math.round(totals.correct * 100 / totals.attempts) : 0) + "%";
    elements.summaryAttempts.textContent = String(totals.attempts);
  }

  function renderMatrix() {
    elements.matrix.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var heading = document.createElement("h3");
      heading.className = "matrix-heading";
      heading.textContent = category.title;
      elements.matrix.appendChild(heading);
      var table = document.createElement("table");
      var head = document.createElement("thead");
      head.innerHTML = "<tr><th>" + t("practice.family", "Family") + "</th>" + LEVELS.map(function (level) { return "<th>L" + level + "</th>"; }).join("") + "</tr>";
      table.appendChild(head);
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
    var totals = practiced.reduce(function (total, entry) { total.attempts += entry.cell.attempts; total.correct += entry.cell.correct; total.totalMs += entry.cell.totalMs; return total; }, legacyTotals());
    elements.statTotalAttempts.textContent = String(totals.attempts);
    elements.statTotalCorrect.textContent = String(totals.correct);
    elements.statTotalTime.textContent = timeText(totals.totalMs);
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
      empty.textContent = t("stats.noAttemptsYet", "No family attempts yet");
      container.appendChild(empty);
      return;
    }
    cells.forEach(function (entry) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "list-item";
      item.dataset.familyId = entry.family.id;
      item.dataset.level = String(entry.level);
      item.innerHTML = "<div><strong></strong><span></span></div><span class=\"pill\"></span>";
      item.querySelector("strong").textContent = entry.family.title + " L" + entry.level;
      item.querySelector("div span").textContent = entry.cell.attempts + " " + t("stats.tries", "tries") + ", " + accuracy(entry.cell) + "%";
      item.querySelector(".pill").textContent = Math.round(entry.cell.mastery || 0) + "%";
      container.appendChild(item);
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
        if (learnSpotlightId === family.id) card.classList.add("spotlight");
        var title = document.createElement("h3");
        title.textContent = family.title;
        var rule = document.createElement("p");
        rule.textContent = family.learn.rule;
        var formula = document.createElement("code");
        formula.textContent = family.learn.formula;
        card.appendChild(title);
        card.appendChild(rule);
        card.appendChild(formula);
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
    elements.numberFormatSelect.value = progress.settings.numberFormat;
    elements.currencyFormatSelect.value = progress.settings.currencyFormat;
    elements.unitSystemSelect.value = progress.settings.unitSystem;
    elements.enabledCategories.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var label = document.createElement("label");
      label.className = "check-row";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = progress.settings.enabledCategories[category.id] !== false;
      input.dataset.categoryId = category.id;
      var span = document.createElement("span");
      span.textContent = category.title;
      label.appendChild(input);
      label.appendChild(span);
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

  function evaluateCalculatorExpression(source) {
    source = String(source || "").replace(/×/g, "*").replace(/÷/g, "/");
    var index = 0;
    function skip() { while (/\s/.test(source[index] || "")) index += 1; }
    function number() {
      skip();
      var start = index;
      while (/[\d.,]/.test(source[index] || "")) index += 1;
      var parsed = parseLocalizedRational(source.slice(start, index), "decimal");
      if (!parsed) throw new Error("number");
      return Number(parsed.n) / Number(parsed.d);
    }
    function primary() {
      skip();
      if (source[index] === "(") {
        index += 1;
        var result = expression();
        skip();
        if (source[index] !== ")") throw new Error("parenthesis");
        index += 1;
        return result;
      }
      return number();
    }
    function factor() {
      skip();
      var sign = 1;
      while (source[index] === "+" || source[index] === "-") {
        if (source[index] === "-") sign *= -1;
        index += 1;
        skip();
      }
      var result = sign * primary();
      skip();
      while (source[index] === "%") { result /= 100; index += 1; skip(); }
      return result;
    }
    function term() {
      var result = factor();
      while (true) {
        skip();
        var operator = source[index];
        if (operator !== "*" && operator !== "/") break;
        index += 1;
        var right = factor();
        if (operator === "/" && right === 0) throw new Error("division");
        result = operator === "*" ? result * right : result / right;
      }
      return result;
    }
    function expression() {
      var result = term();
      while (true) {
        skip();
        var operator = source[index];
        if (operator !== "+" && operator !== "-") break;
        index += 1;
        var right = term();
        result = operator === "+" ? result + right : result - right;
      }
      return result;
    }
    var result = expression();
    skip();
    if (index !== source.length || !Number.isFinite(result)) throw new Error("expression");
    return result;
  }

  function calculatorEvaluate() {
    try {
      calculatorValue = evaluateCalculatorExpression(elements.calculatorInput.value);
      elements.calculatorOutput.textContent = Number(calculatorValue).toLocaleString(configuredLocale(), { maximumFractionDigits: 8 });
    } catch (error) {
      calculatorValue = null;
      elements.calculatorOutput.textContent = t("calculator.invalid", "Invalid expression");
    }
  }

  function useCalculatorValue() {
    if (calculatorValue === null || !activeAnswerInput || activeAnswerInput.disabled) return;
    activeAnswerInput.value = String(calculatorValue).replace(".", decimalSeparator());
    activeAnswerInput.focus();
    var cell = currentQuestion ? getCell(currentQuestion.familyId, currentQuestion.level) : null;
    if (cell) { cell.calculatorUses += 1; saveProgress(); }
  }

  function exportProgress() {
    elements.dataBox.value = JSON.stringify(progress, null, 2);
  }

  function importProgress() {
    try {
      progress = mergeProgress(defaultProgress(), JSON.parse(elements.dataBox.value));
      saveProgress();
      currentQuestion = null;
      renderAll();
      startQuestion();
    } catch (error) {
      elements.dataBox.value = t("messages.invalidJson", "Invalid JSON") + ": " + error.message;
    }
  }

  function copyProgress() {
    if (!elements.dataBox.value.trim()) exportProgress();
    PracticeLabUI.copyText(elements.dataBox.value);
  }

  function resetProgress() {
    if (!window.confirm(t("messages.resetConfirm", "Reset all local progress?"))) return;
    progress = defaultProgress();
    saveProgress();
    currentQuestion = null;
    renderAll();
    startQuestion();
  }

  function cacheElements() {
    [
      "pauseBtn", "adaptiveModeBtn", "manualModeBtn", "questionCategory", "questionFamily", "questionLevel", "questionMastery", "questionPrompt",
      "answerForm", "answerControls", "answerKeypad", "submitBtn", "nextBtn", "skipBtn", "feedback", "categorySelect", "familySelect", "levelSelect",
      "metricMastery", "metricAccuracy", "metricStreak", "metricAvgTime", "summaryMastery", "summaryAccuracy", "summaryAttempts",
      "matrix", "statTotalAttempts", "statTotalCorrect", "statTotalTime", "statActiveCells", "weakList", "strongList",
      "numberFormatSelect", "currencyFormatSelect", "unitSystemSelect", "enabledCategories", "dataBox", "learnGrid",
      "calculatorInput", "calculatorOutput", "calculatorKeys"
    ].forEach(function (id) { elements[id] = document.getElementById(id); });
    elements.practiceMain = document.querySelector(".practice-main");
  }

  function wireEvents() {
    selectorController = PracticeLabUI.createPracticeSelectors({
      categorySelect: elements.categorySelect,
      familySelect: elements.familySelect,
      levelSelect: elements.levelSelect,
      categories: CATEGORIES,
      families: FAMILIES,
      levelLabel: function (level) { return t("practice.level", "Level") + " " + level; },
      onSelect: function (selection) { setManual(selection.familyId, selection.level); }
    });
    var answerEditor = PracticeLabUI.createTextEditor(function () { return activeAnswerInput; });
    var calculatorEditor = PracticeLabUI.createTextEditor(function () { return elements.calculatorInput; });
    keypadButtons = PracticeLabUI.renderInputGrid(elements.answerKeypad, [
      [["7", answerEditor.insert("7")], ["8", answerEditor.insert("8")], ["9", answerEditor.insert("9")], [t("practice.delete", "Delete"), answerEditor.backspace, { variant: "function" }]],
      [["4", answerEditor.insert("4")], ["5", answerEditor.insert("5")], ["6", answerEditor.insert("6")], [t("practice.clear", "Clear"), answerEditor.clear, { variant: "function" }]],
      [["1", answerEditor.insert("1")], ["2", answerEditor.insert("2")], ["3", answerEditor.insert("3")], ["-", answerEditor.insert("-"), { variant: "function" }]],
      [["0", answerEditor.insert("0")], [decimalSeparator(), function () { answerEditor.insert(decimalSeparator())(); }, { id: "decimal" }], [t("practice.check", "Check"), function () { elements.answerForm.requestSubmit(); }, { id: "submit", variant: "primary" }], ["↵", function () { elements.answerForm.requestSubmit(); }, { variant: "function" }]]
    ]);
    PracticeLabUI.renderInputGrid(elements.calculatorKeys, [
      [["7", calculatorEditor.insert("7")], ["8", calculatorEditor.insert("8")], ["9", calculatorEditor.insert("9")], ["/", calculatorEditor.insert("/"), { variant: "function" }], ["(", calculatorEditor.insert("("), { variant: "function" }]],
      [["4", calculatorEditor.insert("4")], ["5", calculatorEditor.insert("5")], ["6", calculatorEditor.insert("6")], ["*", calculatorEditor.insert("*"), { variant: "function" }], [")", calculatorEditor.insert(")"), { variant: "function" }]],
      [["1", calculatorEditor.insert("1")], ["2", calculatorEditor.insert("2")], ["3", calculatorEditor.insert("3")], ["-", calculatorEditor.insert("-"), { variant: "function" }], ["%", calculatorEditor.insert("%"), { variant: "function" }]],
      [["0", calculatorEditor.insert("0")], [".", function () { calculatorEditor.insert(decimalSeparator())(); }], [t("calculator.delete", "Delete"), calculatorEditor.backspace, { variant: "function" }], ["+", calculatorEditor.insert("+"), { variant: "function" }], ["=", calculatorEvaluate, { variant: "primary" }]],
      [[t("calculator.clear", "Clear"), function () { elements.calculatorInput.value = ""; calculatorValue = null; elements.calculatorOutput.textContent = t("calculator.ready", "Ready"); }, { variant: "function", colspan: 5 }]]
    ]);
    document.querySelectorAll("[data-view]").forEach(function (button) { button.addEventListener("click", function () { setView(button.dataset.view); }); });
    elements.adaptiveModeBtn.addEventListener("click", function () { progress.settings.adaptive = true; saveProgress(); startQuestion(); });
    elements.manualModeBtn.addEventListener("click", function () { progress.settings.adaptive = false; saveProgress(); startQuestion(); });
    elements.pauseBtn.addEventListener("click", pausePractice);
    document.getElementById("resumeBtn").addEventListener("click", resumePractice);
    document.getElementById("learnCurrentBtn").addEventListener("click", function () { if (currentQuestion) { learnSpotlightId = currentQuestion.familyId; setView("learn"); } });
    elements.answerForm.addEventListener("submit", submitAnswer);
    elements.nextBtn.addEventListener("click", startQuestion);
    elements.skipBtn.addEventListener("click", startQuestion);
    elements.matrix.addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManual(button.dataset.familyId, Number(button.dataset.level)); } });
    ["weakList", "strongList"].forEach(function (id) { elements[id].addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManual(button.dataset.familyId, Number(button.dataset.level)); } }); });
    ["numberFormatSelect", "currencyFormatSelect", "unitSystemSelect"].forEach(function (id) {
      elements[id].addEventListener("change", function (event) {
        var key = id === "numberFormatSelect" ? "numberFormat" : id === "currencyFormatSelect" ? "currencyFormat" : "unitSystem";
        progress.settings[key] = event.target.value;
        saveProgress();
        if (currentQuestion && key !== "unitSystem") {
          currentQuestion = generateQuestion(currentQuestion.familyId, currentQuestion.level, currentQuestion.parameters.seed, true);
          renderQuestion();
        }
      });
    });
    elements.enabledCategories.addEventListener("change", function (event) { if (event.target.dataset.categoryId) { progress.settings.enabledCategories[event.target.dataset.categoryId] = event.target.checked; saveProgress(); } });
    elements.calculatorInput.addEventListener("keydown", function (event) { if (event.key === "Enter") { event.preventDefault(); calculatorEvaluate(); } });
    document.getElementById("calculatorUseBtn").addEventListener("click", useCalculatorValue);
    document.getElementById("exportBtn").addEventListener("click", exportProgress);
    document.getElementById("copyBtn").addEventListener("click", copyProgress);
    document.getElementById("importBtn").addEventListener("click", importProgress);
    document.getElementById("resetBtn").addEventListener("click", resetProgress);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && pauseStartedAt) { event.preventDefault(); resumePractice(); }
      if (event.key === "Enter" && answered && progress.activeView === "practice" && event.target !== elements.calculatorInput) { event.preventDefault(); startQuestion(); }
    });
  }

  function runSelfTests() {
    var failures = [];
    function assert(name, condition) { if (!condition) failures.push(name); }
    assert("8 categories", CATEGORIES.length === 8);
    assert("34 families", FAMILIES.length === 34);
    assert("34 generators", Object.keys(GENERATORS).length === 34);
    assert("34 derivers", Object.keys(DERIVERS).length === 34);
    assert("half away positive", roundHalfAway(rat(1005, 1000), 100) === 101n);
    assert("half away negative", roundHalfAway(rat(-1005, 1000), 100) === -101n);
    assert("successive factor", compareRat(mulRat(factorRat(2000), factorRat(-2000)), rat(96, 100)) === 0);
    assert("simple formula", centsOf(mulRat(moneyRat(10000), addRat(rat(1n), mulRat(rateRat(500), rat(2))))) === 11000n);
    assert("compound formula", centsOf(mulRat(moneyRat(10000), powRat(factorRat(500), 2))) === 11025n);
    var planA = { monthlyCents: "1000", setupCents: "3000", freeMonths: 0, annualFeeCents: "0" };
    var planB = { monthlyCents: "1500", setupCents: "0", freeMonths: 0, annualFeeCents: "0" };
    assert("break-even previous", compareRat(subscriptionTotalExact(planA, 5), subscriptionTotalExact(planB, 5)) > 0);
    assert("break-even month", compareRat(subscriptionTotalExact(planA, 6), subscriptionTotalExact(planB, 6)) <= 0);
    var indexQuestion = GENERATORS.base_100_index_interpret(4, new Rng(120126));
    assert("index point/percent units differ", indexQuestion.answer.fields.some(function (field) { return field.id === "indexPointChange"; }) && indexQuestion.answer.fields.some(function (field) { return field.id === "percentChange"; }));
    var billParameters = {
      eligibleSubtotalCents: "8000",
      chargeRows: [
        { id: "surcharge", type: "surcharge", kind: "rate", rateBp: 1000, baseIds: ["eligibleSubtotal"] },
        { id: "tax", type: "tax", kind: "rate", rateBp: 500, baseIds: ["eligibleSubtotal", "surcharge"] }
      ],
      roundingPolicy: "final-only"
    };
    assert("charge ledger bases", centsOf(deriveChargeLedger(billParameters).total) === 9240n);
    var allocationParameters = {
      mode: "equal-total",
      eligibleSubtotalCents: "3100",
      participants: [{ id: "A", eligibleCents: "1000" }, { id: "B", eligibleCents: "1000" }, { id: "C", eligibleCents: "1100" }],
      chargeRows: [],
      roundingPolicy: "line-rounded"
    };
    var allocated = deriveSharedAllocation(allocationParameters);
    assert("allocation largest remainder", centsOf(allocated.values.personA) === 1034n && centsOf(allocated.values.personB) === 1033n && centsOf(allocated.values.personC) === 1033n);
    assert("allocation conservation", centsOf(addRat(addRat(allocated.values.personA, allocated.values.personB), allocated.values.personC)) === 3100n);
    progress = defaultProgress();
    progress.settings.numberFormat = "point";
    assert("point decimal", rationalText(parseLocalizedRational("1,234.50", "money")) === "2469/2");
    assert("point ambiguity follows grouping", rationalText(parseLocalizedRational("1,234", "money")) === "1234");
    assert("point rejects malformed grouping", parseLocalizedRational("12,34", "money") === null);
    progress.settings.numberFormat = "comma";
    assert("comma decimal", rationalText(parseLocalizedRational("1.234,50", "money")) === "2469/2");
    assert("comma ambiguity follows decimal", rationalText(parseLocalizedRational("1,234", "money")) === "617/500");
    assert("money rejects percent", parseLocalizedRational("12%", "money") === null);
    progress.settings.currencyFormat = "usd";
    assert("money accepts configured currency", rationalText(parseLocalizedRational("$12,50", "money")) === "25/2");
    assert("money rejects other currency", parseLocalizedRational("€12,50", "money") === null);
    assert("percent rejects currency", parseLocalizedRational("$12,50", "percent") === null);
    FAMILIES.forEach(function (family, familyIndex) {
      family.levels.forEach(function (level) {
        for (var sample = 0; sample < 60; sample += 1) {
          try {
            progress.settings.unitSystem = sample % 2 ? "metric" : "us";
            var question = generateQuestion(family.id, level, (familyIndex + 1) * 100000 + level * 1000 + sample + 1, true);
            var canonical = {};
            question.answer.fields.forEach(function (field) {
              if (field.kind === "money") canonical[field.id] = formatScaled(field.value, 2);
              else if (field.kind === "percent") canonical[field.id] = formatScaled(field.value, 2) + "%";
              else if (field.kind === "decimal") canonical[field.id] = formatScaled(field.value, field.precision);
              else canonical[field.id] = field.value;
            });
            assert("canonical accepted " + family.id + ":" + level + ":" + sample, checkQuestion(canonical, question).correct);
            assert("metadata " + family.id, question.units.length && question.workedSteps.length && question.roundingStage);
          } catch (error) {
            failures.push("generator " + family.id + ":" + level + ":" + sample + " " + error.message);
          }
        }
      });
    });
    var migration = migrateLegacy({ cells: { "interest:1": { attempts: 4, correct: 3, totalMs: 900 } }, settings: { numberFormat: "comma" } });
    assert("legacy totals retained", migration.legacyCategoryTotals.interest.attempts === 4);
    assert("legacy family mastery fresh", Object.keys(migration.cells).length === 0);
    if (failures.length) {
      console.error("Everyday economics self-tests failed", failures.slice(0, 50), "total", failures.length);
      return { ok: false, failures: failures.slice(0, 100) };
    }
    console.info("Everyday economics self-tests passed: 34 families, exact rational arithmetic, localized parser, generated property sample");
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
  window.EverydayEconomicsPractice = {
    categories: CATEGORIES,
    families: FAMILIES,
    generateQuestion: generateQuestion,
    checkQuestion: checkQuestion,
    runSelfTests: runSelfTests
  };

  document.addEventListener("DOMContentLoaded", init);
}());
