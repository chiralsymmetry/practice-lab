(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.electricCircuitsBasics.v1";
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

  var UNIT_FACTORS = {
    v: { family: "voltage", factor: 1 },
    mv: { family: "voltage", factor: 0.001 },
    kv: { family: "voltage", factor: 1000 },
    volt: { family: "voltage", factor: 1 },
    volts: { family: "voltage", factor: 1 },
    a: { family: "current", factor: 1 },
    ma: { family: "current", factor: 0.001 },
    amp: { family: "current", factor: 1 },
    amps: { family: "current", factor: 1 },
    ampere: { family: "current", factor: 1 },
    amperes: { family: "current", factor: 1 },
    w: { family: "power", factor: 1 },
    mw: { family: "power", factor: 0.001 },
    watt: { family: "power", factor: 1 },
    watts: { family: "power", factor: 1 },
    ohm: { family: "resistance", factor: 1 },
    ohms: { family: "resistance", factor: 1 },
    "Ω": { family: "resistance", factor: 1 },
    "ω": { family: "resistance", factor: 1 },
    kohm: { family: "resistance", factor: 1000 },
    kohms: { family: "resistance", factor: 1000 },
    "kΩ": { family: "resistance", factor: 1000 },
    "kω": { family: "resistance", factor: 1000 },
    mohm: { family: "resistance", factor: 1000000 },
    mohms: { family: "resistance", factor: 1000000 },
    "mΩ": { family: "resistance", factor: 1000000 },
    "mω": { family: "resistance", factor: 1000000 }
  };

  var EXPECTED_UNITS = {
    V: { family: "voltage", factor: 1 },
    mV: { family: "voltage", factor: 0.001 },
    A: { family: "current", factor: 1 },
    mA: { family: "current", factor: 0.001 },
    W: { family: "power", factor: 1 },
    mW: { family: "power", factor: 0.001 },
    ohm: { family: "resistance", factor: 1 },
    kohm: { family: "resistance", factor: 1000 }
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
      .replace(/[%\s_\u00a0']/g, "");
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

  function normalizeUnitToken(value) {
    return String(value || "")
      .trim()
      .replace(/Ω/g, "Ω")
      .replace(/\s+/g, "")
      .toLowerCase()
      .replace(/ω/g, "Ω");
  }

  function unitFactorForToken(token) {
    var normalized = normalizeUnitToken(token);
    if (!normalized) return null;
    return UNIT_FACTORS[normalized] || null;
  }

  function normalizeMeasurement(text, expectedUnit) {
    var raw = String(text || "").trim();
    var match = raw.match(/^([+\-−–—]?[\d\s_.,'\u00a0]+)\s*([a-zA-ZΩΩωµ]*)$/);
    if (!match) return normalizeNumber(raw);
    var number = normalizeNumber(match[1]);
    if (number === null) return null;
    var token = match[2];
    if (!token) return number;
    var supplied = unitFactorForToken(token);
    var expected = EXPECTED_UNITS[expectedUnit];
    if (!supplied || !expected || supplied.family !== expected.family) return null;
    return number * supplied.factor / expected.factor;
  }

  function formatCalculatorResult(value) {
    var rounded = Math.abs(value) < 1e-10 ? 0 : value;
    return formatLocaleNumber(rounded, 0, 8);
  }

  function evaluateCalculatorExpression(text) {
    var source = String(text || "")
      .replace(/[ΩΩω]/g, "")
      .replace(/\b(?:ohms?|volts?|amps?|amperes?|watts?|v|a|w|ma|mv|mw|kohms?|mohms?)\b/gi, "")
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

  function unitLabel(unit) {
    return {
      V: "V",
      mV: "mV",
      A: "A",
      mA: "mA",
      W: "W",
      mW: "mW",
      ohm: "Ω",
      kohm: "kΩ"
    }[unit] || unit;
  }

  function decimalsFor(value) {
    var abs = Math.abs(value);
    if (Number.isInteger(roundTo(value, 4))) return 0;
    if (abs >= 100) return 1;
    if (abs >= 10) return 2;
    return 3;
  }

  function plainNumber(value, decimals) {
    var rounded = roundTo(value, decimals);
    return formatLocaleNumber(rounded, Number.isInteger(rounded) ? 0 : decimals, decimals);
  }

  function formatQuantity(value, unit, decimals) {
    decimals = decimals === undefined ? decimalsFor(value) : decimals;
    return plainNumber(value, decimals) + " " + unitLabel(unit);
  }

  function makeQuestion(categoryId, level, body, expected, unit, promptKey, values, options) {
    options = options || {};
    var decimals = options.decimals === undefined ? decimalsFor(expected) : options.decimals;
    var display = options.display || formatQuantity(expected, unit, decimals);
    return {
      categoryId: categoryId,
      level: level,
      promptTitle: t("prompts." + promptKey + ".title", titleFor(categoryId)),
      promptNote: t("prompts." + promptKey + ".note", ""),
      body: body,
      svg: options.svg || "",
      expected: roundTo(expected, decimals),
      expectedUnit: unit,
      expectedDisplay: display,
      tolerance: options.tolerance === undefined ? Math.max(0.01, Math.pow(10, -decimals) * 1.5) : options.tolerance,
      explanation: tf("prompts." + promptKey + ".explanation", values, "")
    };
  }

  function promptBody(promptKey, values, fallback) {
    return tf("prompts." + promptKey + ".body", values, fallback);
  }

  function resistorValues(level) {
    var tables = [
      [10, 20, 50, 100, 200, 500],
      [47, 68, 100, 150, 220, 330, 470, 680, 1000],
      [120, 180, 270, 390, 560, 820, 1200, 2200, 3300],
      [150, 330, 470, 680, 1000, 2200, 4700, 10000, 22000],
      [100, 220, 330, 470, 680, 1000, 2200, 4700, 10000, 47000, 100000]
    ];
    return tables[level - 1];
  }

  function currentMilliampValues(level) {
    return level <= 2 ? [5, 10, 20, 25, 50] : [1, 2, 5, 10, 12, 15, 20, 25, 30, 50, 75, 100];
  }

  function voltageValues(level) {
    return level <= 2 ? [3, 5, 6, 9, 12] : [1.8, 3.3, 5, 9, 12, 15, 18, 24];
  }

  function svgCircuit(kind, labels) {
    function text(x, y, value, anchor) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '">' + escapeHtml(value) + '</text>';
    }
    function resistor(x, y, label) {
      return '<polyline points="' + x + ',' + y + " " + (x + 10) + "," + (y - 12) + " " + (x + 25) + "," + (y + 12) + " " + (x + 40) + "," + (y - 12) + " " + (x + 55) + "," + (y + 12) + " " + (x + 70) + "," + y + '" />' + text(x + 35, y - 22, label);
    }
    var inner = "";
    if (kind === "single") {
      inner += '<path d="M72 150 H132 M248 150 H318 V62 H72 V150" />';
      inner += '<path d="M72 124 V176" /><path d="M58 136 H86 M64 164 H80" />';
      inner += resistor(132, 150, labels.r);
      inner += text(70, 112, labels.v);
      inner += text(232, 116, labels.i);
    } else if (kind === "series") {
      inner += '<path d="M54 150 H92 M298 150 H346 V62 H54 V150" />';
      inner += '<path d="M54 124 V176" /><path d="M40 136 H68 M46 164 H62" />';
      inner += resistor(92, 150, labels.r1);
      inner += resistor(202, 150, labels.r2);
      if (labels.r3) {
        inner += '<path d="M162 150 H202 M272 150 H286 V216 H132 V150" />';
        inner += resistor(132, 216, labels.r3);
      } else {
        inner += '<path d="M162 150 H202 M272 150 H298" />';
      }
      inner += text(54, 112, labels.v);
    } else if (kind === "parallel") {
      inner += '<path d="M62 80 V220 M310 80 V220 M62 80 H132 M242 80 H310 M62 220 H132 M242 220 H310" />';
      inner += '<path d="M62 124 V176" /><path d="M48 136 H76 M54 164 H70" />';
      inner += resistor(132, 80, labels.r1);
      inner += resistor(132, 220, labels.r2);
      inner += text(62, 112, labels.v);
    } else if (kind === "divider") {
      inner += '<path d="M74 52 H220 M220 52 V92 M220 208 V248 H74 V52" />';
      inner += '<path d="M74 116 V184" /><path d="M60 132 H88 M66 168 H82" />';
      inner += resistor(185, 92, labels.r1);
      inner += resistor(185, 208, labels.r2);
      inner += '<path d="M220 150 H316" /><circle cx="220" cy="150" r="4" />';
      inner += text(74, 104, labels.vin);
      inner += text(318, 144, labels.vout, "start");
    } else if (kind === "led") {
      inner += '<path d="M58 150 H112 M292 150 H344 V62 H58 V150" />';
      inner += '<path d="M58 124 V176" /><path d="M44 136 H72 M50 164 H66" />';
      inner += resistor(112, 150, labels.r);
      inner += '<path d="M222 126 L222 174 L262 150 Z M266 126 V174 M272 130 L288 114 M282 130 L298 114" />';
      inner += '<path d="M182 150 H222 M266 150 H292" />';
      inner += text(58, 112, labels.vs);
      inner += text(244, 198, labels.led);
      inner += text(206, 116, labels.i);
    }
    return '<svg class="schematic" viewBox="0 0 380 280" role="img" aria-label="' + escapeHtml(t("practice.schematicAria", "Circuit schematic")) + '">' +
      '<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' + inner + '</g></svg>';
  }

  var CATEGORIES = [
    {
      id: "ohmsLaw",
      generate: function (level, rng) {
        var r = rng.pick(resistorValues(level));
        var iMa = rng.pick(currentMilliampValues(level));
        var v = roundTo(r * iMa / 1000, 3);
        var solve = rng.pick(level === 1 ? ["V", "I"] : ["V", "I", "R"]);
        var expected = solve === "V" ? v : solve === "I" ? iMa : r;
        var unit = solve === "V" ? "V" : solve === "I" ? "mA" : "ohm";
        var values = {
          voltage: solve === "V" ? "?" : formatQuantity(v, "V"),
          current: solve === "I" ? "?" : formatQuantity(iMa, "mA"),
          resistance: solve === "R" ? "?" : formatQuantity(r, "ohm"),
          target: unitLabel(unit),
          answer: formatQuantity(expected, unit)
        };
        return makeQuestion("ohmsLaw", level, promptBody("ohmsLaw", values, ""), expected, unit, "ohmsLaw", values, {
          svg: svgCircuit("single", { v: values.voltage, i: values.current, r: values.resistance })
        });
      }
    },
    {
      id: "power",
      generate: function (level, rng) {
        var r = rng.pick(resistorValues(level));
        var iMa = rng.pick(currentMilliampValues(level));
        var v = roundTo(r * iMa / 1000, 3);
        var answer = v * iMa / 1000;
        var unit = answer < 1 ? "mW" : "W";
        var expected = unit === "mW" ? answer * 1000 : answer;
        var values = {
          voltage: formatQuantity(v, "V"),
          current: formatQuantity(iMa, "mA"),
          resistance: formatQuantity(r, "ohm"),
          target: unitLabel(unit),
          answer: formatQuantity(expected, unit)
        };
        return makeQuestion("power", level, promptBody("power", values, ""), expected, unit, "power", values, {
          svg: svgCircuit("single", { v: values.voltage, i: values.current, r: values.resistance })
        });
      }
    },
    {
      id: "seriesResistance",
      generate: function (level, rng) {
        var valuesTable = resistorValues(level);
        var r1 = rng.pick(valuesTable);
        var r2 = rng.pick(valuesTable);
        var r3 = level >= 3 ? rng.pick(valuesTable) : 0;
        var answer = r1 + r2 + r3;
        var labels = {
          r1: formatQuantity(r1, "ohm"),
          r2: formatQuantity(r2, "ohm"),
          r3: r3 ? formatQuantity(r3, "ohm") : "",
          v: level >= 4 ? formatQuantity(rng.pick(voltageValues(level)), "V") : ""
        };
        var values = {
          r1: labels.r1,
          r2: labels.r2,
          r3: labels.r3,
          answer: formatQuantity(answer, "ohm")
        };
        return makeQuestion("seriesResistance", level, promptBody(r3 ? "seriesResistanceThree" : "seriesResistance", values, ""), answer, "ohm", r3 ? "seriesResistanceThree" : "seriesResistance", values, {
          svg: svgCircuit("series", labels)
        });
      }
    },
    {
      id: "parallelResistance",
      generate: function (level, rng) {
        var valuesTable = resistorValues(level);
        var r1 = rng.pick(valuesTable);
        var r2 = level <= 2 && rng.next() < 0.5 ? r1 : rng.pick(valuesTable);
        var answer = r1 * r2 / (r1 + r2);
        var values = {
          r1: formatQuantity(r1, "ohm"),
          r2: formatQuantity(r2, "ohm"),
          answer: formatQuantity(answer, "ohm", 2)
        };
        return makeQuestion("parallelResistance", level, promptBody("parallelResistance", values, ""), answer, "ohm", "parallelResistance", values, {
          decimals: 2,
          svg: svgCircuit("parallel", { r1: values.r1, r2: values.r2, v: "" })
        });
      }
    },
    {
      id: "voltageDivider",
      generate: function (level, rng) {
        var valuesTable = resistorValues(level);
        var r1 = rng.pick(valuesTable);
        var r2 = rng.pick(valuesTable);
        var vin = rng.pick(voltageValues(level));
        var answer = vin * r2 / (r1 + r2);
        var values = {
          vin: formatQuantity(vin, "V"),
          r1: formatQuantity(r1, "ohm"),
          r2: formatQuantity(r2, "ohm"),
          answer: formatQuantity(answer, "V", 3)
        };
        return makeQuestion("voltageDivider", level, promptBody("voltageDivider", values, ""), answer, "V", "voltageDivider", values, {
          decimals: 3,
          svg: svgCircuit("divider", { vin: values.vin, vout: "Vout = ?", r1: values.r1, r2: values.r2 })
        });
      }
    },
    {
      id: "ledResistor",
      generate: function (level, rng) {
        var vs = rng.pick(level <= 2 ? [5, 9, 12] : [3.3, 5, 9, 12, 15, 24]);
        var vf = rng.pick(level <= 2 ? [2] : [1.8, 2, 2.1, 3.0, 3.2]);
        if (vf >= vs) vf = 2;
        var iMa = rng.pick(level <= 2 ? [5, 10, 20] : [2, 5, 10, 15, 20]);
        var answer = (vs - vf) / (iMa / 1000);
        var values = {
          supply: formatQuantity(vs, "V"),
          forward: formatQuantity(vf, "V"),
          current: formatQuantity(iMa, "mA"),
          answer: formatQuantity(answer, "ohm", 1)
        };
        return makeQuestion("ledResistor", level, promptBody("ledResistor", values, ""), answer, "ohm", "ledResistor", values, {
          decimals: 1,
          svg: svgCircuit("led", { vs: values.supply, led: "LED " + values.forward, i: values.current, r: "R = ?" })
        });
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
      (currentQuestion.svg ? '<div class="schematic-wrap">' + currentQuestion.svg + '</div>' : "") +
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
    var normalized = normalizeMeasurement(elements.answerInput.value, currentQuestion.expectedUnit);
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
      "statActiveCells", "weakList", "strongList", "numberFormatSelect", "enabledCategories", "dataBox", "exportBtn", "copyBtn", "importBtn", "resetBtn",
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
    assert("normalize grouped number", normalizeNumber("1,234.50") === 1234.5);
    assert("normalize european number", normalizeNumber("1.234,50") === 1234.5);
    assert("normalize decimal comma", normalizeNumber("12,5%") === 12.5);
    assert("normalize percent", normalizeNumber("12.5%") === 12.5);
    assert("normalize invalid", normalizeNumber("12x") === null);
    assert("normalize volts", normalizeMeasurement("3.3 V", "V") === 3.3);
    assert("normalize milliamps to mA", normalizeMeasurement("0.02 A", "mA") === 20);
    assert("normalize kohm to ohm", normalizeMeasurement("4.7 kΩ", "ohm") === 4700);
    assert("calculator precedence", evaluateCalculatorExpression("2+3*4") === 14);
    assert("calculator parentheses", evaluateCalculatorExpression("2*(3+4)") === 14);
    assert("calculator decimal comma", evaluateCalculatorExpression("1,5+2") === 3.5);
    assert("calculator percent", evaluateCalculatorExpression("25%*120") === 30);
    assert("calculator unit words", evaluateCalculatorExpression("10 V + 2") === 12);
    var rng = makeRng(321);
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var q = category.generate(level, rng);
        assert(category.id + " L" + level + " numeric answer", Number.isFinite(q.expected));
        assert(category.id + " L" + level + " display", typeof q.expectedDisplay === "string" && q.expectedDisplay.length > 0);
        assert(category.id + " L" + level + " schematic", typeof q.svg === "string" && q.svg.indexOf("<svg") !== -1);
        assert(category.id + " L" + level + " self check", Math.abs(normalizeMeasurement(q.expectedDisplay, q.expectedUnit) - q.expected) <= q.tolerance);
      });
    });
    var divider = getCategory("voltageDivider").generate(5, makeRng(5));
    assert("voltage divider gives voltage", divider.expectedUnit === "V" && Number.isFinite(divider.expected));
    return { ok: failures.length === 0, failures: failures };
  }

  window.runSelfTests = runSelfTests;
  window.PracticeLabElectricCircuitsBasics = {
    categories: CATEGORIES,
    runSelfTests: runSelfTests
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
