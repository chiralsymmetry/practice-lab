(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.everydayEconomics.v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var currentQuestion = null;
  var questionStartedAt = 0;
  var pauseStartedAt = 0;
  var answered = false;
  var lastCalculatorValue = null;
  var progress = null;
  var elements = {};

  function detectLocale() {
    if (typeof navigator !== "undefined") {
      if (navigator.languages && navigator.languages.length) return navigator.languages[0];
      if (navigator.language) return navigator.language;
    }
    return TEXT.lang || "en-US";
  }

  var BROWSER_LOCALE = detectLocale();
  var FORMAT_LOCALE = BROWSER_LOCALE;
  var DECIMAL_SEPARATOR = getDecimalSeparator(FORMAT_LOCALE);

  var CURRENCY_FORMATS = {
    usd: { symbol: "$", position: "before" },
    eur: { symbol: "EUR", position: "before" },
    sek: { symbol: "kr", position: "after" },
    gbp: { symbol: "GBP", position: "before" },
    none: { symbol: "", position: "none" }
  };

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }

  function tf(path, values, fallback) {
    return t(path, fallback).replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match;
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundTo(value, decimals) {
    var factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function getDecimalSeparator(locale) {
    if (typeof Intl === "undefined" || !Intl.NumberFormat) return ".";
    var parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    var decimal = parts.find(function (part) {
      return part.type === "decimal";
    });
    return decimal ? decimal.value : ".";
  }

  function formatLocaleNumber(value, minDecimals, maxDecimals) {
    if (typeof Intl === "undefined" || !Intl.NumberFormat) {
      return roundTo(value, maxDecimals).toFixed(minDecimals);
    }
    return new Intl.NumberFormat(FORMAT_LOCALE, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals
    }).format(value);
  }

  function localeForNumberFormat(setting) {
    if (setting === "comma") return "sv-SE";
    if (setting === "point") return "en-US";
    return BROWSER_LOCALE;
  }

  function applyNumberFormatSetting() {
    var setting = progress && progress.settings ? progress.settings.numberFormat : "auto";
    FORMAT_LOCALE = localeForNumberFormat(setting);
    DECIMAL_SEPARATOR = getDecimalSeparator(FORMAT_LOCALE);
  }

  function activeCurrencyId() {
    var setting = progress && progress.settings ? progress.settings.currencyFormat : "auto";
    if (setting !== "auto") return setting;
    var locale = BROWSER_LOCALE.toLowerCase();
    if (locale.indexOf("sv") === 0) return "sek";
    if (locale === "en-gb" || locale.indexOf("en-gb-") === 0) return "gbp";
    if (locale === "en-us" || locale.indexOf("en-us-") === 0) return "usd";
    if (/^(de|fr|es|it|nl|fi|et|lv|lt|pt|el|ga|sk|sl|mt|cy|ga|hr|ro|bg|cs|pl|da|nb|nn|is)/.test(locale)) return "eur";
    return "usd";
  }

  function activeUnitSystem() {
    var setting = progress && progress.settings ? progress.settings.unitSystem : "auto";
    if (setting !== "auto") return setting;
    return BROWSER_LOCALE.toLowerCase().indexOf("en-us") === 0 ? "us" : "metric";
  }

  function money(value) {
    var rounded = roundTo(value, 2);
    var format = CURRENCY_FORMATS[activeCurrencyId()] || CURRENCY_FORMATS.usd;
    var number = formatLocaleNumber(Math.abs(rounded), 2, 2);
    var sign = rounded < 0 ? "-" : "";
    if (format.position === "none") return sign + number;
    if (format.position === "after") return sign + number + " " + format.symbol;
    return sign + format.symbol + number;
  }

  function percent(value) {
    var rounded = roundTo(value, 2);
    return formatLocaleNumber(rounded, rounded % 1 === 0 ? 0 : 2, 2) + "%";
  }

  function formatPercent(value) {
    return Math.round(value) + "%";
  }

  function formatSeconds(ms) {
    if (!ms) return "0s";
    return (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + "s";
  }

  function formatMinutes(ms) {
    if (!ms) return "0m";
    return Math.max(1, Math.round(ms / 60000)) + "m";
  }

  function normalizeSingleSeparator(value, separator) {
    var parts = value.split(separator);
    if (parts.length === 1) return value;
    if (parts.length > 2) {
      var allThousands = parts[0].length >= 1 && parts[0].length <= 3 && parts.slice(1).every(function (part) {
        return /^\d{3}$/.test(part);
      });
      if (allThousands) return parts.join("");
      return parts.slice(0, -1).join("") + "." + parts[parts.length - 1];
    }
    var left = parts[0];
    var right = parts[1];
    if (separator !== DECIMAL_SEPARATOR && right.length === 3 && left.length >= 1 && left.length <= 3) {
      return left + right;
    }
    return left + "." + right;
  }

  function normalizeNumericString(text) {
    var value = String(text || "")
      .trim()
      .replace(/[−–—]/g, "-")
      .replace(/\b(?:kr|sek|usd|eur|gbp|dollars?|euros?|pounds?)\b/gi, "")
      .replace(/[$€£¥%\s_\u00a0']/g, "");
    if (!value) return null;
    var sign = "";
    if (/^[+-]/.test(value)) {
      sign = value[0] === "-" ? "-" : "";
      value = value.slice(1);
    }
    if (!/^[\d.,]+$/.test(value) || !/\d/.test(value)) return null;
    var lastDot = value.lastIndexOf(".");
    var lastComma = value.lastIndexOf(",");
    if (lastDot !== -1 && lastComma !== -1) {
      var decimal = lastDot > lastComma ? "." : ",";
      var thousands = decimal === "." ? "," : ".";
      value = value.replaceAll(thousands, "").replace(decimal, ".");
    } else if (lastComma !== -1) {
      value = normalizeSingleSeparator(value, ",");
    } else if (lastDot !== -1) {
      value = normalizeSingleSeparator(value, ".");
    }
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return null;
    return sign + value;
  }

  function normalizeNumber(text) {
    var value = normalizeNumericString(text);
    if (value === null) return null;
    return Number(value);
  }

  function formatCalculatorResult(value) {
    var rounded = Math.abs(value) < 1e-10 ? 0 : value;
    return formatLocaleNumber(rounded, 0, 8);
  }

  function evaluateCalculatorExpression(text) {
    var source = String(text || "")
      .replace(/\b(?:kr|sek|usd|eur|gbp|dollars?|euros?|pounds?)\b/gi, "")
      .replace(/[×]/g, "*")
      .replace(/[÷]/g, "/");
    var index = 0;

    function skipSpace() {
      while (index < source.length && /[\s_$€£¥]/.test(source[index])) index += 1;
    }

    function parseNumber() {
      skipSpace();
      var start = index;
      while (index < source.length && /[\d.,]/.test(source[index])) index += 1;
      if (start === index) throw new Error("number");
      var normalized = normalizeNumericString(source.slice(start, index));
      if (normalized === null) throw new Error("number");
      return Number(normalized);
    }

    function parsePrimary() {
      skipSpace();
      if (source[index] === "(") {
        index += 1;
        var value = parseExpression();
        skipSpace();
        if (source[index] !== ")") throw new Error("parenthesis");
        index += 1;
        return value;
      }
      return parseNumber();
    }

    function parseFactor() {
      skipSpace();
      var sign = 1;
      while (source[index] === "+" || source[index] === "-") {
        if (source[index] === "-") sign *= -1;
        index += 1;
        skipSpace();
      }
      var value = sign * parsePrimary();
      skipSpace();
      while (source[index] === "%") {
        value /= 100;
        index += 1;
        skipSpace();
      }
      return value;
    }

    function parseTerm() {
      var value = parseFactor();
      while (true) {
        skipSpace();
        var operator = source[index];
        if (operator !== "*" && operator !== "/") break;
        index += 1;
        var right = parseFactor();
        if (operator === "*") value *= right;
        else {
          if (right === 0) throw new Error("division");
          value /= right;
        }
      }
      return value;
    }

    function parseExpression() {
      var value = parseTerm();
      while (true) {
        skipSpace();
        var operator = source[index];
        if (operator !== "+" && operator !== "-") break;
        index += 1;
        var right = parseTerm();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    }

    var result = parseExpression();
    skipSpace();
    if (index !== source.length || !Number.isFinite(result)) throw new Error("expression");
    return result;
  }

  function makeRng(seed) {
    var state = seed >>> 0;
    return {
      next: function () {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
      },
      int: function (min, max) {
        return min + Math.floor(this.next() * (max - min + 1));
      },
      pick: function (items) {
        return items[this.int(0, items.length - 1)];
      }
    };
  }

  function titleFor(id) {
    return t("categories." + id + ".title", id);
  }

  function makeQuestion(categoryId, level, body, expected, promptKey, values, options) {
    options = options || {};
    var display = options.display || (options.kind === "percent" ? percent(expected) : money(expected));
    return {
      categoryId: categoryId,
      level: level,
      promptTitle: t("prompts." + promptKey + ".title", titleFor(categoryId)),
      promptNote: t("prompts." + promptKey + ".note", ""),
      body: body,
      expected: roundTo(expected, options.decimals === undefined ? 2 : options.decimals),
      expectedDisplay: display,
      tolerance: options.tolerance === undefined ? 0.01 : options.tolerance,
      explanation: tf("prompts." + promptKey + ".explanation", values, "")
    };
  }

  function promptBody(promptKey, values, fallback) {
    return tf("prompts." + promptKey + ".body", values, fallback);
  }

  function randomPrice(rng, min, max, step) {
    return rng.int(Math.ceil(min / step), Math.floor(max / step)) * step;
  }

  function unitPriceUnits() {
    return activeUnitSystem() === "us" ? ["lb", "fl oz", "item"] : ["kg", "liter", "item"];
  }

  var CATEGORIES = [
    {
      id: "unitPrices",
      generate: function (level, rng) {
        var unit = rng.pick(unitPriceUnits());
        var quantity = level <= 2 ? rng.pick([2, 3, 4, 5, 6, 8, 10]) : rng.int(3, level === 5 ? 48 : 24);
        var unitPrice = randomPrice(rng, level <= 2 ? 50 : 65, level >= 4 ? 950 : 450, 5) / 100;
        var price = roundTo(unitPrice * quantity, 2);
        var values = {
          price: money(price),
          quantity: quantity,
          unit: unit,
          answer: money(unitPrice)
        };
        return makeQuestion("unitPrices", level, promptBody("unitPrices", values, ""), unitPrice, "unitPrices", values);
      }
    },
    {
      id: "discounts",
      generate: function (level, rng) {
        var price = randomPrice(rng, level <= 2 ? 1000 : 2500, level >= 5 ? 250000 : 90000, 50) / 100;
        var discount = rng.pick(level <= 2 ? [10, 20, 25, 50] : [5, 10, 15, 20, 25, 30, 40]);
        var tax = level <= 2 ? 0 : rng.pick([5, 6, 8, 10, 12]);
        var afterDiscount = price * (1 - discount / 100);
        var answer = afterDiscount * (1 + tax / 100);
        var values = {
          price: money(price),
          discount: percent(discount),
          tax: percent(tax),
          answer: money(answer)
        };
        return makeQuestion("discounts", level, promptBody("discounts", values, ""), answer, "discounts", values);
      }
    },
    {
      id: "percentChange",
      generate: function (level, rng) {
        var oldValue = rng.int(level <= 2 ? 10 : 40, level >= 5 ? 5000 : 800);
        var changePercent = rng.pick(level <= 2 ? [10, 20, 25, 50] : [-40, -25, -20, -15, -10, 5, 10, 12, 15, 20, 25, 35, 50]);
        var newValue = roundTo(oldValue * (1 + changePercent / 100), 2);
        var values = {
          old: formatLocaleNumber(oldValue, 0, 2),
          newValue: formatLocaleNumber(newValue, 0, 2),
          change: formatLocaleNumber(roundTo(newValue - oldValue, 2), 0, 2),
          answer: percent(changePercent)
        };
        return makeQuestion("percentChange", level, promptBody("percentChange", values, ""), changePercent, "percentChange", values, { kind: "percent", display: percent(changePercent), tolerance: 0.05 });
      }
    },
    {
      id: "interest",
      generate: function (level, rng) {
        var principal = randomPrice(rng, level <= 2 ? 10000 : 50000, level >= 5 ? 500000 : 200000, 1000) / 100;
        var rate = rng.pick(level <= 2 ? [2, 5, 10] : [1.5, 2, 3, 4, 5, 6, 8, 10]);
        var years = rng.int(1, level <= 2 ? 3 : level + 2);
        var compound = level >= 3 && rng.next() < 0.7;
        var answer = compound ? principal * Math.pow(1 + rate / 100, years) : principal * (1 + rate / 100 * years);
        var values = {
          principal: money(principal),
          rate: percent(rate),
          years: years,
          kind: compound ? t("prompts.interest.kindCompound", "P(1+r)^t") : t("prompts.interest.kindSimple", "P(1+rt)"),
          answer: money(answer)
        };
        return makeQuestion("interest", level, promptBody("interest", values, ""), answer, "interest", values);
      }
    },
    {
      id: "inflation",
      generate: function (level, rng) {
        var price = randomPrice(rng, level <= 2 ? 1000 : 5000, level >= 5 ? 300000 : 100000, 100) / 100;
        var rate = rng.pick(level <= 2 ? [2, 3, 5] : [1.5, 2, 2.5, 3, 4, 5, 7]);
        var years = rng.int(1, level <= 2 ? 2 : level + 3);
        var answer = price * Math.pow(1 + rate / 100, years);
        var values = {
          price: money(price),
          rate: percent(rate),
          years: years,
          answer: money(answer)
        };
        return makeQuestion("inflation", level, promptBody("inflation", values, ""), answer, "inflation", values);
      }
    },
    {
      id: "subscriptions",
      generate: function (level, rng) {
        var monthly = randomPrice(rng, level <= 2 ? 500 : 900, level >= 5 ? 8000 : 3500, 50) / 100;
        var setup = level <= 2 ? 0 : randomPrice(rng, 0, 10000, 500) / 100;
        var months = rng.pick(level <= 2 ? [3, 6, 12] : [6, 12, 18, 24, 36]);
        var discountMonths = level >= 4 ? rng.pick([0, 1, 2, 3]) : 0;
        var answer = setup + monthly * Math.max(0, months - discountMonths);
        var values = {
          monthly: money(monthly),
          setup: money(setup),
          months: months,
          freeMonths: discountMonths,
          answer: money(answer)
        };
        return makeQuestion("subscriptions", level, promptBody("subscriptions", values, ""), answer, "subscriptions", values);
      }
    },
    {
      id: "expectedValue",
      generate: function (level, rng) {
        var probability = rng.pick(level <= 2 ? [10, 25, 50] : [5, 10, 20, 25, 30, 40, 60, 75]);
        var payoff = randomPrice(rng, level <= 2 ? 1000 : 5000, level >= 5 ? 200000 : 80000, 500) / 100;
        var cost = level <= 2 ? 0 : randomPrice(rng, 0, 3000 * level, 100) / 100;
        var answer = payoff * probability / 100 - cost;
        var values = {
          probability: percent(probability),
          payoff: money(payoff),
          cost: money(cost),
          answer: money(answer)
        };
        return makeQuestion("expectedValue", level, promptBody("expectedValue", values, ""), answer, "expectedValue", values);
      }
    }
  ];

  var LEARN_CARDS = CATEGORIES.map(function (category) {
    return { id: category.id };
  });

  function getCategory(id) {
    return CATEGORIES.find(function (category) {
      return category.id === id;
    }) || CATEGORIES[0];
  }

  function cellKey(categoryId, level) {
    return categoryId + ":" + level;
  }

  function defaultCell() {
    return {
      attempts: 0,
      correct: 0,
      streak: 0,
      recent: [],
      avgMs: 0,
      totalMs: 0,
      lastAt: 0,
      mastery: 0,
      missedAt: 0
    };
  }

  function defaultProgress() {
    var cells = {};
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        cells[cellKey(category.id, level)] = defaultCell();
      });
    });
    return {
      version: 1,
      activeView: "practice",
      settings: {
        adaptive: true,
        numberFormat: "auto",
        currencyFormat: "auto",
        unitSystem: "auto",
        enabledCategories: CATEGORIES.map(function (category) { return category.id; })
      },
      manual: {
        categoryId: CATEGORIES[0].id,
        level: 1
      },
      cells: cells
    };
  }

  function ensureProgressShape(value) {
    var base = defaultProgress();
    value = value && typeof value === "object" ? value : {};
    var merged = Object.assign(base, value);
    merged.settings = Object.assign(base.settings, value.settings || {});
    merged.manual = Object.assign(base.manual, value.manual || {});
    merged.cells = Object.assign(base.cells, value.cells || {});
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var key = cellKey(category.id, level);
        merged.cells[key] = Object.assign(defaultCell(), merged.cells[key] || {});
      });
    });
    if (!getCategory(merged.manual.categoryId)) merged.manual.categoryId = CATEGORIES[0].id;
    merged.manual.level = clamp(Number(merged.manual.level) || 1, 1, 5);
    if (["auto", "point", "comma"].indexOf(merged.settings.numberFormat) === -1) merged.settings.numberFormat = "auto";
    if (["auto", "usd", "eur", "sek", "gbp", "none"].indexOf(merged.settings.currencyFormat) === -1) merged.settings.currencyFormat = "auto";
    if (["auto", "metric", "us"].indexOf(merged.settings.unitSystem) === -1) merged.settings.unitSystem = "auto";
    merged.settings.enabledCategories = merged.settings.enabledCategories.filter(function (id) {
      return CATEGORIES.some(function (category) { return category.id === id; });
    });
    if (merged.settings.enabledCategories.length === 0) merged.settings.enabledCategories = [CATEGORIES[0].id];
    return merged;
  }

  function loadProgress() {
    try {
      return ensureProgressShape(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch (error) {
      return defaultProgress();
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function cellFor(categoryId, level) {
    return progress.cells[cellKey(categoryId, level)];
  }

  function aggregateStats() {
    var attempts = 0;
    var correct = 0;
    var totalMs = 0;
    var masteryTotal = 0;
    var cells = 0;
    var activeCells = 0;
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var cell = cellFor(category.id, level);
        attempts += cell.attempts;
        correct += cell.correct;
        totalMs += cell.totalMs;
        masteryTotal += cell.mastery;
        cells += 1;
        if (cell.attempts > 0) activeCells += 1;
      });
    });
    return {
      attempts: attempts,
      correct: correct,
      totalMs: totalMs,
      activeCells: activeCells,
      mastery: cells ? masteryTotal / cells : 0,
      accuracy: attempts ? correct / attempts * 100 : 0
    };
  }

  function chooseAdaptiveCell() {
    var candidates = [];
    var now = Date.now();
    progress.settings.enabledCategories.forEach(function (categoryId) {
      LEVELS.forEach(function (level) {
        var cell = cellFor(categoryId, level);
        var previous = level === 1 ? { mastery: 100, attempts: 1 } : cellFor(categoryId, level - 1);
        var unlocked = level === 1 || previous.mastery >= 55 || previous.attempts >= 8 || cell.attempts > 0;
        if (!unlocked && level > 2) return;
        var levelBias = cell.attempts === 0 ? (level === 1 ? 40 : level === 2 ? 9 : 2) : 10;
        var weakness = (100 - cell.mastery) / 8;
        var missBoost = cell.missedAt ? Math.max(0, 12 - (now - cell.missedAt) / 60000) : 0;
        var staleBoost = cell.lastAt ? Math.min(8, (now - cell.lastAt) / 86400000) : 6;
        candidates.push({ categoryId: categoryId, level: level, weight: Math.max(0.2, levelBias + weakness + missBoost + staleBoost) });
      });
    });
    var total = candidates.reduce(function (sum, item) { return sum + item.weight; }, 0);
    var roll = Math.random() * total;
    for (var i = 0; i < candidates.length; i += 1) {
      roll -= candidates[i].weight;
      if (roll <= 0) return candidates[i];
    }
    return candidates[0];
  }

  function resetCalculator() {
    if (!elements.calculatorInput || !elements.calculatorOutput) return;
    elements.calculatorInput.value = "";
    lastCalculatorValue = null;
    elements.calculatorOutput.className = "calculator-output";
    elements.calculatorOutput.textContent = t("calculator.ready", "Ready");
  }

  function generateQuestion() {
    var categoryId = progress.manual.categoryId;
    var level = progress.manual.level;
    if (progress.settings.adaptive) {
      var picked = chooseAdaptiveCell();
      categoryId = picked.categoryId;
      level = picked.level;
    }
    var rng = makeRng((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
    currentQuestion = getCategory(categoryId).generate(level, rng);
    questionStartedAt = Date.now();
    pauseStartedAt = 0;
    answered = false;
    renderAll();
    elements.answerInput.value = "";
    resetCalculator();
    if (shouldAutoFocusAnswer()) elements.answerInput.focus();
  }

  function shouldAutoFocusAnswer() {
    return !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }

  function renderQuestion() {
    if (!currentQuestion) return;
    var cell = cellFor(currentQuestion.categoryId, currentQuestion.level);
    elements.questionCategory.textContent = titleFor(currentQuestion.categoryId);
    elements.questionLevel.textContent = "Level " + currentQuestion.level;
    elements.questionMastery.textContent = formatPercent(cell.mastery) + " " + t("practice.masterySuffix", "mastery");
    elements.questionPrompt.innerHTML =
      '<div class="prompt-title">' + escapeHtml(currentQuestion.promptTitle) + '</div>' +
      '<div class="prompt-expression scenario">' + escapeHtml(currentQuestion.body) + '</div>' +
      '<div class="prompt-note">' + escapeHtml(currentQuestion.promptNote) + '</div>';
  }

  function updateCell(correct, elapsedMs) {
    var cell = cellFor(currentQuestion.categoryId, currentQuestion.level);
    cell.attempts += 1;
    cell.correct += correct ? 1 : 0;
    cell.streak = correct ? cell.streak + 1 : 0;
    cell.recent.push(correct ? 1 : 0);
    if (cell.recent.length > 12) cell.recent.shift();
    cell.avgMs = cell.avgMs ? cell.avgMs * 0.75 + elapsedMs * 0.25 : elapsedMs;
    cell.totalMs += elapsedMs;
    cell.lastAt = Date.now();
    if (!correct) cell.missedAt = Date.now();
    var speedFactor = correct ? clamp(1.25 - elapsedMs / 22000, 0.35, 1.05) : 1;
    cell.mastery = clamp(cell.mastery + (correct ? 9 * speedFactor : -15), 0, 100);
  }

  function submitAnswer() {
    if (!currentQuestion || answered) {
      generateQuestion();
      return;
    }
    var normalized = normalizeNumber(elements.answerInput.value);
    var correct = normalized !== null && Math.abs(normalized - currentQuestion.expected) <= currentQuestion.tolerance;
    var elapsedMs = Date.now() - questionStartedAt;
    updateCell(correct, elapsedMs);
    answered = true;
    elements.feedback.className = "feedback " + (correct ? "correct" : "incorrect");
    elements.feedback.innerHTML =
      "<strong>" + escapeHtml(correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite")) + "</strong>" +
      "<span>" + escapeHtml(t("messages.expected", "expected") + ": " + currentQuestion.expectedDisplay + ". " + currentQuestion.explanation + " " + t("messages.time", "Time") + ": " + formatSeconds(elapsedMs)) + "</span>";
    saveProgress();
    renderAll();
  }

  function skipQuestion() {
    generateQuestion();
  }

  function renderPracticeControls() {
    if (elements.categorySelect.options.length !== CATEGORIES.length) {
      elements.categorySelect.innerHTML = "";
      CATEGORIES.forEach(function (category) {
        var option = document.createElement("option");
        option.value = category.id;
        option.textContent = titleFor(category.id);
        elements.categorySelect.appendChild(option);
      });
    }
    elements.levelSelect.innerHTML = "";
    LEVELS.forEach(function (level) {
      var option = document.createElement("option");
      option.value = String(level);
      option.textContent = "Level " + level;
      elements.levelSelect.appendChild(option);
    });
    var activeCategoryId = progress.settings.adaptive && currentQuestion ? currentQuestion.categoryId : progress.manual.categoryId;
    var activeLevel = progress.settings.adaptive && currentQuestion ? currentQuestion.level : progress.manual.level;
    elements.categorySelect.value = activeCategoryId;
    elements.levelSelect.value = String(activeLevel);
    elements.adaptiveModeBtn.classList.toggle("secondary-active", progress.settings.adaptive);
    elements.manualModeBtn.classList.toggle("secondary-active", !progress.settings.adaptive);
  }

  function renderMetrics() {
    if (!currentQuestion) return;
    var cell = cellFor(currentQuestion.categoryId, currentQuestion.level);
    var accuracy = cell.attempts ? cell.correct / cell.attempts * 100 : 0;
    elements.metricMastery.textContent = formatPercent(cell.mastery);
    elements.metricAccuracy.textContent = formatPercent(accuracy);
    elements.metricStreak.textContent = String(cell.streak);
    elements.metricAvgTime.textContent = formatSeconds(cell.avgMs);
    var stats = aggregateStats();
    elements.summaryMastery.textContent = formatPercent(stats.mastery);
    elements.summaryAccuracy.textContent = formatPercent(stats.accuracy);
    elements.summaryAttempts.textContent = String(stats.attempts);
    elements.statTotalAttempts.textContent = String(stats.attempts);
    elements.statTotalCorrect.textContent = String(stats.correct);
    elements.statTotalTime.textContent = formatMinutes(stats.totalMs);
    elements.statActiveCells.textContent = String(stats.activeCells);
  }

  function renderMatrix() {
    var rows = CATEGORIES.map(function (category) {
      var cells = LEVELS.map(function (level) {
        var cell = cellFor(category.id, level);
        var accuracy = cell.attempts ? Math.round(cell.correct / cell.attempts * 100) : 0;
        var className = cell.attempts >= 3 && cell.mastery < 45 ? " weak" : cell.mastery >= 75 ? " ready" : "";
        return '<td><button type="button" class="level-button' + className + '" data-matrix-category="' + category.id + '" data-matrix-level="' + level + '">' +
          "<strong>L" + level + " " + formatPercent(cell.mastery) + "</strong>" +
          '<div class="bar"><span style="width: ' + clamp(cell.mastery, 0, 100) + '%"></span></div>' +
          "<span>" + cell.attempts + " " + t("stats.tries", "tries") + " · " + accuracy + "% " + t("stats.accuracy", "accuracy") + "</span>" +
          "</button></td>";
      }).join("");
      return "<tr><th>" + escapeHtml(titleFor(category.id)) + "</th>" + cells + "</tr>";
    }).join("");
    elements.matrix.innerHTML = "<table><thead><tr><th>Category</th>" + LEVELS.map(function (level) { return "<th>L" + level + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function cellSummaries() {
    var items = [];
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var cell = cellFor(category.id, level);
        if (cell.attempts > 0) items.push({ categoryId: category.id, level: level, cell: cell });
      });
    });
    return items;
  }

  function renderStatsLists() {
    var items = cellSummaries();
    function renderList(list) {
      if (list.length === 0) {
        return '<div class="list-item"><div><strong>' + escapeHtml(t("stats.noAttemptsYet", "No attempts yet")) + '</strong><span>' + escapeHtml(t("stats.noAttemptsHint", "Practice will fill this in.")) + "</span></div></div>";
      }
      return list.slice(0, 6).map(function (item) {
        var accuracy = item.cell.attempts ? Math.round(item.cell.correct / item.cell.attempts * 100) : 0;
        return '<div class="list-item"><div><strong>' + escapeHtml(titleFor(item.categoryId)) + " L" + item.level + '</strong><span>' + item.cell.attempts + " " + t("stats.tries", "tries") + " · " + accuracy + "% " + t("stats.accuracy", "accuracy") + "</span></div><strong>" + formatPercent(item.cell.mastery) + "</strong></div>";
      }).join("");
    }
    elements.weakList.innerHTML = renderList(items.slice().sort(function (a, b) { return a.cell.mastery - b.cell.mastery; }));
    elements.strongList.innerHTML = renderList(items.slice().sort(function (a, b) { return b.cell.mastery - a.cell.mastery; }));
  }

  function renderSettings() {
    elements.numberFormatSelect.value = progress.settings.numberFormat;
    elements.currencyFormatSelect.value = progress.settings.currencyFormat;
    elements.unitSystemSelect.value = progress.settings.unitSystem;
    elements.enabledCategories.innerHTML = CATEGORIES.map(function (category) {
      var checked = progress.settings.enabledCategories.indexOf(category.id) !== -1 ? " checked" : "";
      return '<label class="check-row"><input type="checkbox" data-enabled-category="' + category.id + '"' + checked + '><span>' + escapeHtml(titleFor(category.id)) + "</span></label>";
    }).join("");
  }

  function renderLearn() {
    elements.learnGrid.innerHTML = LEARN_CARDS.map(function (card) {
      var prefix = "learnCards." + card.id + ".";
      var spotlight = currentQuestion && currentQuestion.categoryId === card.id ? " spotlight" : "";
      return '<article class="learn-card' + spotlight + '" id="learn-' + card.id + '">' +
        "<h3>" + escapeHtml(titleFor(card.id)) + "</h3>" +
        "<p><strong>" + escapeHtml(t("learn.concept", "Concept")) + ":</strong> " + escapeHtml(t(prefix + "concept", "")) + "</p>" +
        "<p><strong>" + escapeHtml(t("learn.rules", "Rule of thumb")) + ":</strong> " + escapeHtml(t(prefix + "rules", "")) + "</p>" +
        "<code>" + escapeHtml(t(prefix + "example", "")) + "</code>" +
        "<p><strong>" + escapeHtml(t("learn.format", "Answer format")) + ":</strong> " + escapeHtml(t(prefix + "format", "")) + "</p>" +
        "</article>";
    }).join("");
  }

  function renderAll() {
    renderQuestion();
    renderPracticeControls();
    renderMetrics();
    renderMatrix();
    renderStatsLists();
    renderSettings();
    renderLearn();
    elements.feedback.classList.toggle("hidden", !answered);
  }

  function setView(view) {
    progress.activeView = view;
    document.querySelectorAll(".view").forEach(function (node) {
      node.classList.toggle("active", node.id === "view-" + view);
    });
    document.querySelectorAll(".nav button").forEach(function (button) {
      button.classList.toggle("active", button.dataset.view === view);
    });
    saveProgress();
  }

  function setManualSelection(categoryId, level) {
    progress.settings.adaptive = false;
    progress.manual.categoryId = categoryId;
    progress.manual.level = clamp(Number(level) || 1, 1, 5);
    saveProgress();
    generateQuestion();
  }

  function applyConventionChange() {
    applyNumberFormatSetting();
    localizeDecimalButtons();
    saveProgress();
    generateQuestion();
  }

  function pause() {
    if (pauseStartedAt || !currentQuestion) return;
    pauseStartedAt = Date.now();
    elements.practiceMain.classList.add("paused");
  }

  function resume() {
    if (!pauseStartedAt) return;
    questionStartedAt += Date.now() - pauseStartedAt;
    pauseStartedAt = 0;
    elements.practiceMain.classList.remove("paused");
    if (shouldAutoFocusAnswer()) elements.answerInput.focus();
  }

  function insertIntoInput(input, text) {
    var focused = document.activeElement === input && typeof input.selectionStart === "number";
    var start = focused ? input.selectionStart : input.value.length;
    var end = focused ? input.selectionEnd : input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    if (focused) input.setSelectionRange(start + text.length, start + text.length);
  }

  function insertAtCursor(text) {
    insertIntoInput(elements.answerInput, text);
  }

  function renderCalculatorResult(value) {
    lastCalculatorValue = value;
    elements.calculatorOutput.className = "calculator-output good";
    elements.calculatorOutput.textContent = formatCalculatorResult(value);
  }

  function renderCalculatorError() {
    lastCalculatorValue = null;
    elements.calculatorOutput.className = "calculator-output bad";
    elements.calculatorOutput.textContent = t("calculator.error", "Check expression");
  }

  function evaluateCalculator() {
    try {
      renderCalculatorResult(evaluateCalculatorExpression(elements.calculatorInput.value));
    } catch (error) {
      renderCalculatorError();
    }
  }

  function bindEvents() {
    document.querySelectorAll(".nav button").forEach(function (button) {
      button.addEventListener("click", function () {
        setView(button.dataset.view);
      });
    });
    elements.answerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitAnswer();
    });
    elements.nextBtn.addEventListener("click", generateQuestion);
    elements.skipBtn.addEventListener("click", skipQuestion);
    elements.adaptiveModeBtn.addEventListener("click", function () {
      progress.settings.adaptive = true;
      saveProgress();
      generateQuestion();
    });
    elements.manualModeBtn.addEventListener("click", function () {
      progress.settings.adaptive = false;
      saveProgress();
      generateQuestion();
    });
    elements.categorySelect.addEventListener("change", function () {
      setManualSelection(elements.categorySelect.value, Number(elements.levelSelect.value));
    });
    elements.levelSelect.addEventListener("change", function () {
      setManualSelection(elements.categorySelect.value, Number(elements.levelSelect.value));
    });
    elements.numberFormatSelect.addEventListener("change", function () {
      progress.settings.numberFormat = elements.numberFormatSelect.value;
      applyConventionChange();
    });
    elements.currencyFormatSelect.addEventListener("change", function () {
      progress.settings.currencyFormat = elements.currencyFormatSelect.value;
      applyConventionChange();
    });
    elements.unitSystemSelect.addEventListener("change", function () {
      progress.settings.unitSystem = elements.unitSystemSelect.value;
      applyConventionChange();
    });
    elements.matrix.addEventListener("click", function (event) {
      var button = event.target.closest("[data-matrix-category]");
      if (!button) return;
      setManualSelection(button.dataset.matrixCategory, Number(button.dataset.matrixLevel));
      setView("practice");
    });
    elements.enabledCategories.addEventListener("change", function (event) {
      var input = event.target.closest("[data-enabled-category]");
      if (!input) return;
      var id = input.dataset.enabledCategory;
      if (input.checked && progress.settings.enabledCategories.indexOf(id) === -1) progress.settings.enabledCategories.push(id);
      if (!input.checked) progress.settings.enabledCategories = progress.settings.enabledCategories.filter(function (categoryId) { return categoryId !== id; });
      if (progress.settings.enabledCategories.length === 0) progress.settings.enabledCategories = [id];
      saveProgress();
      renderAll();
    });
    elements.exportBtn.addEventListener("click", function () {
      elements.dataBox.value = JSON.stringify(progress, null, 2);
    });
    elements.copyBtn.addEventListener("click", function () {
      elements.dataBox.select();
      document.execCommand("copy");
    });
    elements.importBtn.addEventListener("click", function () {
      try {
        progress = ensureProgressShape(JSON.parse(elements.dataBox.value));
        applyConventionChange();
      } catch (error) {
        alert(t("messages.invalidJson", "Invalid JSON"));
      }
    });
    elements.resetBtn.addEventListener("click", function () {
      if (!confirm(t("messages.resetConfirm", "Reset all local progress?"))) return;
      progress = defaultProgress();
      applyConventionChange();
    });
    elements.pauseBtn.addEventListener("click", pause);
    elements.resumeBtn.addEventListener("click", resume);
    elements.learnCurrentBtn.addEventListener("click", function () {
      setView("learn");
      renderLearn();
      var node = document.getElementById("learn-" + currentQuestion.categoryId);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    elements.answerKeypad.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.keypadInsert) insertAtCursor(button.dataset.keypadInsert);
      if (button.dataset.keypadAction === "backspace") {
        var value = elements.answerInput.value;
        elements.answerInput.value = value.slice(0, -1);
      }
      if (button.dataset.keypadAction === "clear") elements.answerInput.value = "";
      if (button.dataset.keypadAction === "submit") submitAnswer();
      if (button.dataset.keypadAction === "next") {
        if (answered) generateQuestion();
        else submitAnswer();
      }
    });
    elements.calculatorInput.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      evaluateCalculator();
    });
    elements.calculatorKeys.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.calcInsert) insertIntoInput(elements.calculatorInput, button.dataset.calcInsert);
      if (button.dataset.calcAction === "backspace") {
        var value = elements.calculatorInput.value;
        elements.calculatorInput.value = value.slice(0, -1);
      }
      if (button.dataset.calcAction === "clear") {
        resetCalculator();
      }
      if (button.dataset.calcAction === "evaluate") evaluateCalculator();
    });
    elements.calculatorUseBtn.addEventListener("click", function () {
      if (lastCalculatorValue === null) evaluateCalculator();
      if (lastCalculatorValue === null) return;
      elements.answerInput.value = formatCalculatorResult(lastCalculatorValue);
      if (shouldAutoFocusAnswer()) elements.answerInput.focus();
    });
  }

  function collectElements() {
    [
      "summaryMastery", "summaryAccuracy", "summaryAttempts", "adaptiveModeBtn", "manualModeBtn", "pauseBtn", "learnCurrentBtn",
      "questionCategory", "questionLevel", "questionMastery", "questionPrompt", "answerForm", "answerInput", "submitBtn", "nextBtn",
      "skipBtn", "answerKeypad", "feedback", "pauseOverlay", "resumeBtn", "categorySelect", "levelSelect", "metricMastery",
      "metricAccuracy", "metricStreak", "metricAvgTime", "matrix", "statTotalAttempts", "statTotalCorrect", "statTotalTime",
      "statActiveCells", "weakList", "strongList", "numberFormatSelect", "currencyFormatSelect", "unitSystemSelect", "enabledCategories", "dataBox", "exportBtn", "copyBtn", "importBtn", "resetBtn",
      "learnGrid", "calculatorInput", "calculatorOutput", "calculatorKeys", "calculatorUseBtn"
    ].forEach(function (id) {
      elements[id] = document.getElementById(id);
    });
    elements.practiceMain = document.querySelector(".practice-main");
  }

  function localizeDecimalButtons() {
    document.querySelectorAll('[data-keypad-insert="."], [data-keypad-insert=","], [data-calc-insert="."], [data-calc-insert=","]').forEach(function (button) {
      button.textContent = DECIMAL_SEPARATOR;
      if (button.dataset.keypadInsert) button.dataset.keypadInsert = DECIMAL_SEPARATOR;
      if (button.dataset.calcInsert) button.dataset.calcInsert = DECIMAL_SEPARATOR;
    });
  }

  function init() {
    collectElements();
    progress = loadProgress();
    applyNumberFormatSetting();
    localizeDecimalButtons();
    bindEvents();
    generateQuestion();
    setView(progress.activeView || "practice");
  }

  function runSelfTests() {
    var failures = [];
    function assert(name, condition) {
      if (!condition) failures.push(name);
    }
    assert("normalize money", normalizeNumber("$1,234.50") === 1234.5);
    assert("normalize european money", normalizeNumber("1.234,50") === 1234.5);
    assert("normalize sek suffix", normalizeNumber("1.234,50 kr") === 1234.5);
    assert("normalize decimal comma", normalizeNumber("12,5%") === 12.5);
    assert("normalize percent", normalizeNumber("12.5%") === 12.5);
    assert("normalize invalid", normalizeNumber("12x") === null);
    assert("calculator precedence", evaluateCalculatorExpression("2+3*4") === 14);
    assert("calculator parentheses", evaluateCalculatorExpression("2*(3+4)") === 14);
    assert("calculator decimal comma", evaluateCalculatorExpression("1,5+2") === 3.5);
    assert("calculator percent", evaluateCalculatorExpression("25%*120") === 30);
    assert("calculator currency words", evaluateCalculatorExpression("10 kr + 2") === 12);
    assert("unit settings", unitPriceUnits().length === 3);
    var rng = makeRng(321);
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var q = category.generate(level, rng);
        assert(category.id + " L" + level + " numeric answer", Number.isFinite(q.expected));
        assert(category.id + " L" + level + " display", typeof q.expectedDisplay === "string" && q.expectedDisplay.length > 0);
        assert(category.id + " L" + level + " self check", Math.abs(normalizeNumber(q.expectedDisplay) - q.expected) <= q.tolerance);
      });
    });
    var ev = getCategory("expectedValue").generate(5, makeRng(5));
    assert("expected value may be negative or positive number", Number.isFinite(ev.expected));
    return { ok: failures.length === 0, failures: failures };
  }

  window.runSelfTests = runSelfTests;
  window.PracticeLabEverydayEconomics = {
    categories: CATEGORIES,
    runSelfTests: runSelfTests
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
