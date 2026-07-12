(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.floatingPointPractice.v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var currentQuestion = null;
  var questionStartedAt = 0;
  var pauseStartedAt = 0;
  var answered = false;
  var progress = null;
  var elements = {};

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

  function normalizeAnswer(text) {
    return String(text || "")
      .trim()
      .toLowerCase()
      .replace(/\u221e/g, "inf")
      .replace(/_/g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s*,\s*/g, " ")
      .replace(/^0b([01 ]+)$/, "$1")
      .replace(/^0x([0-9a-f]+)$/, "$1");
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

  function shortFor(id) {
    return t("categories." + id + ".short", titleFor(id));
  }

  function makeQuestion(categoryId, level, expression, expected, promptKey, values) {
    var accepted = Array.isArray(expected.accepted) ? expected.accepted : [expected.display];
    return {
      categoryId: categoryId,
      level: level,
      promptTitle: t("prompts." + promptKey + ".title", titleFor(categoryId)),
      promptNote: t("prompts." + promptKey + ".note", "Enter the answer."),
      expression: expression,
      expected: expected.display,
      accepted: accepted.map(normalizeAnswer),
      explanation: tf("prompts." + promptKey + ".explanation", values, expected.display),
      quickInput: expected.quickInput || null
    };
  }

  var FORMATS = [
    { id: "fp4", label: "FP4", bits: 4, expBits: 2, fracBits: 1, bias: 1, precisionBits: 2 },
    { id: "fp6", label: "FP6", bits: 6, expBits: 3, fracBits: 2, bias: 3, precisionBits: 3 },
    { id: "fp8", label: "FP8", bits: 8, expBits: 4, fracBits: 3, bias: 7, precisionBits: 4 },
    { id: "fp16", label: "FP16", bits: 16, expBits: 5, fracBits: 10, bias: 15, precisionBits: 11 },
    { id: "fp32", label: "FP32 / C++ float", bits: 32, expBits: 8, fracBits: 23, bias: 127, precisionBits: 24 }
  ];

  function formatForLevel(level) {
    return FORMATS[clamp(level, 1, 5) - 1];
  }

  function pow2(exp) {
    return Math.pow(2, exp);
  }

  function pow2Big(exp) {
    return 1n << BigInt(exp);
  }

  function bits(value, width) {
    return Math.trunc(value).toString(2).padStart(width, "0");
  }

  function spacedBits(value, width) {
    return bits(value, width).replace(/(.{4})/g, "$1 ").trim();
  }

  function hexBits(value, width) {
    return Math.trunc(value).toString(16).padStart(Math.ceil(width / 4), "0").toUpperCase();
  }

  function patternFor(format, raw) {
    if (format.bits <= 8) return spacedBits(raw, format.bits);
    return "0x" + hexBits(raw, format.bits);
  }

  function formatSpec(format) {
    return format.label + "\n" + tf("prompts.common.formatSpec", {
      signBits: 1,
      expBits: format.expBits,
      fracBits: format.fracBits,
      bias: format.bias,
      precisionBits: format.precisionBits
    }, "sign 1, exponent " + format.expBits + ", fraction " + format.fracBits + ", bias " + format.bias);
  }

  function gcdBig(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
      var t = a % b;
      a = b;
      b = t;
    }
    return a;
  }

  function rational(num, den) {
    if (num === 0n) return { num: 0n, den: 1n };
    if (den < 0n) {
      num = -num;
      den = -den;
    }
    var g = gcdBig(num, den);
    return { num: num / g, den: den / g };
  }

  function rationalFromMantissa(sign, mantissa, exponent) {
    var num = BigInt(mantissa);
    var den = 1n;
    if (exponent >= 0) num *= pow2Big(exponent);
    else den *= pow2Big(-exponent);
    if (sign) num = -num;
    return rational(num, den);
  }

  function rationalDisplay(value) {
    if (value.den === 1n) return String(value.num);
    return String(value.num) + "/" + String(value.den);
  }

  function decimalDisplay(value) {
    return String(Number(value.num) / Number(value.den));
  }

  function parseDecimalToRational(text) {
    var value = normalizeAnswer(text);
    var mixed = value.match(/^(-?\d+) ([0-9]+)\/([0-9]+)$/);
    if (mixed) {
      var whole = BigInt(mixed[1]);
      var numerator = BigInt(mixed[2]);
      var denominator = BigInt(mixed[3]);
      if (denominator === 0n) return null;
      var sign = whole < 0n ? -1n : 1n;
      return rational(whole * denominator + sign * numerator, denominator);
    }
    var fraction = value.match(/^(-?[0-9]+)\/([0-9]+)$/);
    if (fraction) {
      var den = BigInt(fraction[2]);
      if (den === 0n) return null;
      return rational(BigInt(fraction[1]), den);
    }
    var decimal = value.match(/^(-?)([0-9]+)(?:\.([0-9]+))?$/);
    if (!decimal) return null;
    var decimals = decimal[3] || "";
    var num = BigInt(decimal[2] + decimals);
    var denPow = 1n;
    for (var i = 0; i < decimals.length; i += 1) denPow *= 10n;
    if (decimal[1]) num = -num;
    return rational(num, denPow);
  }

  function equivalentRationalAnswer(expected, text) {
    var actual = parseDecimalToRational(text);
    if (!actual) return false;
    return actual.num === expected.num && actual.den === expected.den;
  }

  function decodeToy(format, raw) {
    var sign = Math.floor(raw / pow2(format.bits - 1)) & 1;
    var expMask = pow2(format.expBits) - 1;
    var fracMask = pow2(format.fracBits) - 1;
    var exp = Math.floor(raw / pow2(format.fracBits)) & expMask;
    var frac = raw % pow2(format.fracBits);
    var maxExp = expMask;
    if (exp === 0 && frac === 0) return { raw: raw, sign: sign, exp: exp, frac: frac, kind: "zero", display: sign ? "-0" : "0" };
    if (exp === maxExp && frac === 0) return { raw: raw, sign: sign, exp: exp, frac: frac, kind: "infinity", display: sign ? "-inf" : "inf" };
    if (exp === maxExp) return { raw: raw, sign: sign, exp: exp, frac: frac, kind: "nan", display: "nan" };
    var exponent = exp === 0 ? 1 - format.bias - format.fracBits : exp - format.bias - format.fracBits;
    var mantissa = exp === 0 ? frac : pow2(format.fracBits) + frac;
    var value = rationalFromMantissa(sign, mantissa, exponent);
    return {
      raw: raw,
      sign: sign,
      exp: exp,
      frac: frac,
      kind: exp === 0 ? "subnormal" : "normal",
      unbiased: exp === 0 ? 1 - format.bias : exp - format.bias,
      value: value,
      display: rationalDisplay(value)
    };
  }

  function allToyFinite(format) {
    var values = [];
    for (var raw = 0; raw < pow2(format.bits); raw += 1) {
      var decoded = decodeToy(format, raw);
      if (decoded.kind === "normal" || decoded.kind === "subnormal" || decoded.kind === "zero") {
        values.push({ raw: raw, decoded: decoded });
      }
    }
    return values;
  }

  function classSynonyms(kind, sign) {
    if (kind === "infinity") return sign ? ["infinity", "inf", "i", "-inf", "negative infinity", "-infinity"] : ["infinity", "inf", "i", "+inf", "positive infinity", "+infinity"];
    if (kind === "nan") return ["nan", "not a number"];
    if (kind === "zero") return sign ? ["zero", "z", "-0", "negative zero"] : ["zero", "z", "0", "+0", "positive zero"];
    if (kind === "subnormal") return sign ? ["subnormal", "s", "-sub", "-subnormal", "negative subnormal"] : ["subnormal", "s", "+sub", "+subnormal", "positive subnormal"];
    if (kind === "normal") return sign ? ["normal", "n", "-normal", "negative normal"] : ["normal", "n", "+normal", "positive normal"];
    return [kind];
  }

  function classSignNote(decoded) {
    if (!decoded.sign || decoded.kind === "nan") return "";
    if (decoded.kind === "normal" || decoded.kind === "subnormal") {
      return " " + t("prompts.classify.negativeFiniteSignNote", "Sign bit 1 makes the value negative, but the class is still based on exponent and fraction.");
    }
    return " " + t("prompts.classify.signedSpecialSignNote", "Sign bit 1 affects the signed value, but the class name stays the same.");
  }

  function valueAnswer(decoded) {
    var accepted = [decoded.display];
    if (decoded.value && decoded.value.den !== 1n) {
      accepted.push(decimalDisplay(decoded.value));
      var absNum = decoded.value.num < 0n ? -decoded.value.num : decoded.value.num;
      if (absNum > decoded.value.den && absNum % decoded.value.den !== 0n) {
        var whole = decoded.value.num / decoded.value.den;
        var remainder = absNum % decoded.value.den;
        accepted.push(String(whole) + " " + String(remainder) + "/" + String(decoded.value.den));
      }
    }
    return { display: decoded.display, accepted: accepted };
  }

  function rawFromFields(format, sign, exp, frac) {
    return sign * pow2(format.bits - 1) + exp * pow2(format.fracBits) + frac;
  }

  function classificationBuckets(format) {
    var maxExp = pow2(format.expBits) - 1;
    var fracMax = pow2(format.fracBits) - 1;
    var normalExp = Math.max(1, Math.min(maxExp - 1, Math.floor(maxExp / 2)));
    return [
      { bucket: "positive zero", raw: rawFromFields(format, 0, 0, 0) },
      { bucket: "negative zero", raw: rawFromFields(format, 1, 0, 0) },
      { bucket: "positive infinity", raw: rawFromFields(format, 0, maxExp, 0) },
      { bucket: "negative infinity", raw: rawFromFields(format, 1, maxExp, 0) },
      { bucket: "nan", raw: rawFromFields(format, 0, maxExp, Math.max(1, Math.ceil(fracMax / 2))) },
      { bucket: "positive subnormal", raw: rawFromFields(format, 0, 0, Math.max(1, Math.min(fracMax, 1))) },
      { bucket: "negative subnormal", raw: rawFromFields(format, 1, 0, Math.max(1, Math.min(fracMax, fracMax))) },
      { bucket: "positive normal", raw: rawFromFields(format, 0, normalExp, 0) },
      { bucket: "negative normal", raw: rawFromFields(format, 1, normalExp, Math.min(fracMax, Math.max(0, Math.floor(fracMax / 2)))) }
    ];
  }

  function finiteExamples(format, includeSpecial) {
    var examples = [];
    if (format.bits <= 8) {
      allToyFinite(format).forEach(function (item) {
        if (includeSpecial || item.decoded.kind === "normal") examples.push(item);
      });
    } else {
      [
        rawFromFields(format, 0, format.bias, 0),
        rawFromFields(format, 1, format.bias, 0),
        rawFromFields(format, 0, format.bias + 1, 0),
        rawFromFields(format, 1, format.bias + 1, 0),
        rawFromFields(format, 0, format.bias - 1, 0),
        rawFromFields(format, 0, format.bias, pow2(format.fracBits - 1)),
        rawFromFields(format, 1, format.bias, pow2(format.fracBits - 1)),
        rawFromFields(format, 0, 0, pow2(format.fracBits - 1))
      ].forEach(function (raw) {
        examples.push({ raw: raw, decoded: decodeToy(format, raw) });
      });
    }
    return examples;
  }

  function patternExpression(format, raw) {
    return formatSpec(format) + "\n" + tf("prompts.common.bits", { bits: patternFor(format, raw) }, "Bits: " + patternFor(format, raw));
  }

  function genClassify(level, rng) {
    var format = formatForLevel(level);
    var bucket = rng.pick(classificationBuckets(format));
    var raw = bucket.raw;
    var decoded = decodeToy(format, raw);
    return makeQuestion("classify", level, patternExpression(format, raw), {
      display: decoded.kind,
      accepted: classSynonyms(decoded.kind, decoded.sign),
      quickInput: ["n", "s", "z", "i", "nan"]
    }, "classify", {
      kind: decoded.kind,
      sign: decoded.sign,
      signNote: classSignNote(decoded),
      bucket: bucket.bucket,
      exponent: bits(decoded.exp, format.expBits),
      fraction: bits(decoded.frac, format.fracBits)
    });
  }

  function genDecode(level, rng) {
    var format = formatForLevel(level);
    var values = finiteExamples(format, level >= 2).filter(function (item) {
      return level >= 2 || item.decoded.kind === "normal";
    });
    var picked = rng.pick(values);
    return makeQuestion("decode", level, patternExpression(format, picked.raw), valueAnswer(picked.decoded), "decode", {
      format: format.label,
      value: picked.decoded.display,
      kind: picked.decoded.kind
    });
  }

  function genEncode(level, rng) {
    var format = formatForLevel(level);
    var values = finiteExamples(format, true).filter(function (item) {
      return level >= 2 || item.decoded.kind === "normal";
    });
    if (level >= 2) {
      classificationBuckets(format).forEach(function (bucket) {
        var decoded = decodeToy(format, bucket.raw);
        if (decoded.kind === "infinity" || decoded.kind === "zero" || decoded.kind === "nan") {
          values.push({ raw: bucket.raw, decoded: decoded });
        }
      });
    }
    var picked = rng.pick(values);
    var answer = bits(picked.raw, format.bits);
    return makeQuestion("encode", level, formatSpec(format) + "\n" + tf("prompts.common.value", { value: picked.decoded.display }, "Value: " + picked.decoded.display), {
      display: patternFor(format, picked.raw),
      accepted: [answer, spacedBits(picked.raw, format.bits), "0b" + answer, hexBits(picked.raw, format.bits), "0x" + hexBits(picked.raw, format.bits)]
    }, "encode", {
      bits: patternFor(format, picked.raw),
      value: picked.decoded.display
    });
  }

  function spacingFraction(format, unbiasedExponent) {
    return rationalFromMantissa(0, 1, unbiasedExponent - (format.precisionBits - 1));
  }

  function spacingDisplay(format, unbiasedExponent) {
    return rationalDisplay(spacingFraction(format, unbiasedExponent));
  }

  function genSpacing(level, rng) {
    var format = formatForLevel(level);
    if (rng.next() < 0.45) {
      var maxExp = pow2(format.expBits) - 2;
      var exp = rng.int(1, Math.max(1, maxExp));
      var unbiased = exp - format.bias;
      return makeQuestion("spacing", level, formatSpec(format) + "\n" + tf("prompts.common.exponentField", { exponent: bits(exp, format.expBits) }, "Exponent field: " + bits(exp, format.expBits)), {
        display: String(unbiased),
        accepted: [String(unbiased)]
      }, "bias", {
        exponent: bits(exp, format.expBits),
        bias: format.bias,
        unbiased: unbiased
      });
    }
    var exponentChoices = level <= 3 ? [-2, -1, 0, 1, 2, 3] : [-10, -4, 0, 1, 10, 13, 20, 30];
    var e = rng.pick(exponentChoices);
    var answer = spacingDisplay(format, e);
    return makeQuestion("spacing", level, formatSpec(format) + "\n" + tf("prompts.common.nearPower", { power: e }, "Near 2^" + e), {
      display: answer,
      accepted: [answer, decimalDisplay(spacingFraction(format, e))]
    }, "spacing", {
      format: format.label,
      power: e,
      precision: format.precisionBits,
      spacing: answer
    });
  }

  function isBinaryExact(value) {
    var den = value.den;
    while (den > 1n && den % 2n === 0n) den /= 2n;
    return den === 1n;
  }

  function compareRational(a, b) {
    var left = a.num * b.den;
    var right = b.num * a.den;
    return left < right ? -1 : left > right ? 1 : 0;
  }

  function rationalAbs(value) {
    return { num: value.num < 0n ? -value.num : value.num, den: value.den };
  }

  function rationalDivides(value, unit) {
    return (value.num * unit.den) % (value.den * unit.num) === 0n;
  }

  function rationalQuotient(value, unit) {
    return (value.num * unit.den) / (value.den * unit.num);
  }

  function floorLog2Rational(value) {
    var estimate = Math.floor(Math.log2(Number(value.num) / Number(value.den)));
    while (compareRational(value, rationalFromMantissa(0, 1, estimate + 1)) >= 0) estimate += 1;
    while (compareRational(value, rationalFromMantissa(0, 1, estimate)) < 0) estimate -= 1;
    return estimate;
  }

  function exactRationalForFormat(format, value) {
    value = rationalAbs(value);
    if (value.num === 0n) return true;
    if (!isBinaryExact(value)) return false;
    var maxFinite = rationalFromMantissa(0, pow2(format.fracBits + 1) - 1, pow2(format.expBits) - 2 - format.bias - format.fracBits);
    if (compareRational(value, maxFinite) > 0) return false;
    var minNormal = rationalFromMantissa(0, 1, 1 - format.bias);
    if (compareRational(value, minNormal) < 0) {
      var subnormalUnit = rationalFromMantissa(0, 1, 1 - format.bias - format.fracBits);
      if (!rationalDivides(value, subnormalUnit)) return false;
      var units = rationalQuotient(value, subnormalUnit);
      return units > 0n && units < pow2Big(format.fracBits);
    }
    var exponent = floorLog2Rational(value);
    var spacing = spacingFraction(format, exponent);
    return rationalDivides(value, spacing);
  }

  function integerExactForFormat(format, value) {
    return exactRationalForFormat(format, rational(value, 1n));
  }

  function yesNoAnswer(value) {
    return value
      ? { display: t("answers.yes", "yes"), accepted: ["yes", "y", "true", "1", "ja", "j"] }
      : { display: t("answers.no", "no"), accepted: ["no", "n", "false", "0", "nej"] };
  }

  function genExactness(level, rng) {
    var format = formatForLevel(level);
    var options = [
      { label: "1/2", value: rational(1n, 2n) },
      { label: "3/8", value: rational(3n, 8n) },
      { label: "1/10", value: rational(1n, 10n) },
      { label: "0.1", value: rational(1n, 10n) },
      { label: "0.25", value: rational(1n, 4n) },
      { label: "0.2", value: rational(1n, 5n) },
      { label: "0.375", value: rational(3n, 8n) },
      { label: "7/16", value: rational(7n, 16n) }
    ];
    var threshold = pow2Big(format.precisionBits);
    options.push({ label: String(threshold), integer: threshold });
    options.push({ label: String(threshold + 1n), integer: threshold + 1n });
    options.push({ label: String(threshold + 2n), integer: threshold + 2n });
    var picked = rng.pick(options);
    var exact = picked.integer !== undefined ? integerExactForFormat(format, picked.integer) : exactRationalForFormat(format, picked.value);
    return makeQuestion("exactness", level, formatSpec(format) + "\n" + tf("prompts.common.value", { value: picked.label }, "Value: " + picked.label), yesNoAnswer(exact), "exactness", {
      format: format.label,
      value: picked.label,
      result: exact ? "exactly representable" : "not exactly representable"
    });
  }

  function willChange(format, baseExponent, incrementFraction) {
    var spacing = spacingFraction(format, baseExponent);
    var halfSpacing = rational(spacing.num, spacing.den * 2n);
    return incrementFraction.num * halfSpacing.den > halfSpacing.num * incrementFraction.den;
  }

  function genWillChange(level, rng) {
    var format = formatForLevel(level);
    var casesByLevel = {
      1: [
        { x: "1", e: 0, y: rational(1n, 8n) },
        { x: "1", e: 0, y: rational(3n, 8n) },
        { x: "2", e: 1, y: rational(1n, 4n) }
      ],
      2: [
        { x: "1", e: 0, y: rational(1n, 16n) },
        { x: "1", e: 0, y: rational(1n, 4n) },
        { x: "16", e: 4, y: rational(1n, 1n) }
      ],
      3: [
        { x: "1", e: 0, y: rational(1n, 32n) },
        { x: "1", e: 0, y: rational(1n, 8n) },
        { x: "16", e: 4, y: rational(3n, 2n) }
      ],
      4: [
        { x: "1", e: 0, y: rational(1n, 4096n) },
        { x: "1", e: 0, y: rational(1n, 1024n) },
        { x: "10000", e: 13, y: rational(1n, 1n) }
      ],
      5: [
        { x: "1000", e: 9, y: rational(1n, 100000n) },
        { x: "10000", e: 13, y: rational(1n, 10000n) },
        { x: "1000000", e: 19, y: rational(1n, 100n) },
        { x: "1000000000", e: 29, y: rational(1n, 1n) }
      ]
    };
    var picked = rng.pick(casesByLevel[level]);
    var changes = willChange(format, picked.e, picked.y);
    return makeQuestion("will-change", level, formatSpec(format) + "\n" + tf("prompts.common.addition", { x: picked.x, y: rationalDisplay(picked.y) }, picked.x + " + " + rationalDisplay(picked.y)), yesNoAnswer(changes), "willChange", {
      format: format.label,
      x: picked.x,
      y: rationalDisplay(picked.y),
      spacing: rationalDisplay(spacingFraction(format, picked.e)),
      result: changes ? "changes" : "does not change"
    });
  }

  var CATEGORIES = [
    {
      id: "classify",
      generate: function (level, rng) {
        return genClassify(level, rng);
      }
    },
    {
      id: "decode",
      generate: function (level, rng) {
        return genDecode(level, rng);
      }
    },
    {
      id: "encode",
      generate: function (level, rng) {
        return genEncode(level, rng);
      }
    },
    {
      id: "spacing",
      generate: function (level, rng) {
        return genSpacing(level, rng);
      }
    },
    {
      id: "exactness",
      generate: function (level, rng) {
        return genExactness(level, rng);
      }
    },
    {
      id: "will-change",
      generate: function (level, rng) {
        return genWillChange(level, rng);
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
        var lockedPenalty = unlocked ? 1 : 0.12;
        candidates.push({ categoryId: categoryId, level: level, weight: Math.max(0.2, (levelBias + weakness + missBoost + staleBoost) * lockedPenalty) });
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
      '<div class="prompt-expression">' + escapeHtml(currentQuestion.expression) + '</div>' +
      '<div class="prompt-note">' + escapeHtml(currentQuestion.promptNote) + '</div>';
  }

  function keypadButton(label, attrs, className) {
    var attrText = Object.keys(attrs).map(function (key) {
      return " " + key + '="' + escapeHtml(attrs[key]) + '"';
    }).join("");
    return '<button type="button"' + attrText + (className ? ' class="' + escapeHtml(className) + '"' : "") + ">" + escapeHtml(label) + "</button>";
  }

  function renderDefaultKeypad() {
    elements.answerKeypad.className = "keypad";
    elements.answerKeypad.innerHTML = [
      keypadButton("D", { "data-keypad-insert": "D" }),
      keypadButton("E", { "data-keypad-insert": "E" }),
      keypadButton("F", { "data-keypad-insert": "F" }),
      keypadButton(t("practice.delete", "Del"), { "data-keypad-action": "backspace" }, "function"),
      keypadButton("A", { "data-keypad-insert": "A" }),
      keypadButton("B", { "data-keypad-insert": "B" }),
      keypadButton("C", { "data-keypad-insert": "C" }),
      keypadButton(t("practice.clear", "Clear"), { "data-keypad-action": "clear" }, "function"),
      keypadButton("7", { "data-keypad-insert": "7" }),
      keypadButton("8", { "data-keypad-insert": "8" }),
      keypadButton("9", { "data-keypad-insert": "9" }),
      keypadButton("/", { "data-keypad-insert": "/" }, "function"),
      keypadButton("4", { "data-keypad-insert": "4" }),
      keypadButton("5", { "data-keypad-insert": "5" }),
      keypadButton("6", { "data-keypad-insert": "6" }),
      keypadButton(".", { "data-keypad-insert": "." }, "function"),
      keypadButton("1", { "data-keypad-insert": "1" }),
      keypadButton("2", { "data-keypad-insert": "2" }),
      keypadButton("3", { "data-keypad-insert": "3" }),
      keypadButton("-", { "data-keypad-insert": "-" }, "function"),
      keypadButton("0", { "data-keypad-insert": "0" }),
      keypadButton("␣", { "data-keypad-insert": " " }, "function"),
      keypadButton(t("practice.check", "Check"), { "data-keypad-action": "submit" }, "primary function submit"),
      keypadButton("↵", { "data-keypad-action": "next" }, "function")
    ].join("");
  }

  function renderWordKeypad(words) {
    elements.answerKeypad.className = "keypad word-keypad";
    elements.answerKeypad.innerHTML = words.map(function (word) {
      return keypadButton(word, { "data-keypad-set": word }, "word");
    }).concat([
      keypadButton(t("practice.clear", "Clear"), { "data-keypad-action": "clear" }, "function"),
      keypadButton(t("practice.check", "Check"), { "data-keypad-action": "submit" }, "primary function submit"),
      keypadButton("↵", { "data-keypad-action": "next" }, "function")
    ]).join("");
  }

  function renderAnswerKeypad() {
    if (currentQuestion && currentQuestion.quickInput && currentQuestion.quickInput.length) {
      renderWordKeypad(currentQuestion.quickInput);
    } else {
      renderDefaultKeypad();
    }
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
    var speedFactor = correct ? clamp(1.25 - elapsedMs / 18000, 0.35, 1.05) : 1;
    cell.mastery = clamp(cell.mastery + (correct ? 9 * speedFactor : -15), 0, 100);
  }

  function submitAnswer() {
    if (!currentQuestion || answered) {
      generateQuestion();
      return;
    }
    var normalized = normalizeAnswer(elements.answerInput.value);
    var correct = currentQuestion.accepted.indexOf(normalized) !== -1;
    var elapsedMs = Date.now() - questionStartedAt;
    updateCell(correct, elapsedMs);
    answered = true;
    elements.feedback.className = "feedback " + (correct ? "correct" : "incorrect");
    elements.feedback.innerHTML =
      "<strong>" + escapeHtml(correct ? t("messages.correct", "Correct") : t("messages.notQuite", "Not quite")) + "</strong>" +
      "<span>" + escapeHtml(t("messages.expected", "expected") + ": " + currentQuestion.expected + ". " + currentQuestion.explanation + " " + t("messages.time", "Time") + ": " + formatSeconds(elapsedMs)) + "</span>";
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
    renderAnswerKeypad();
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

  function insertAtCursor(text) {
    var input = elements.answerInput;
    var focused = document.activeElement === input && typeof input.selectionStart === "number";
    var start = focused ? input.selectionStart : input.value.length;
    var end = focused ? input.selectionEnd : input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    if (focused) input.setSelectionRange(start + text.length, start + text.length);
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
        saveProgress();
        generateQuestion();
      } catch (error) {
        alert(t("messages.invalidJson", "Invalid JSON"));
      }
    });
    elements.resetBtn.addEventListener("click", function () {
      if (!confirm(t("messages.resetConfirm", "Reset all local progress?"))) return;
      progress = defaultProgress();
      saveProgress();
      generateQuestion();
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
      if (button.dataset.keypadSet) {
        elements.answerInput.value = button.dataset.keypadSet;
      }
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
  }

  function collectElements() {
    [
      "summaryMastery", "summaryAccuracy", "summaryAttempts", "adaptiveModeBtn", "manualModeBtn", "pauseBtn", "learnCurrentBtn",
      "questionCategory", "questionLevel", "questionMastery", "questionPrompt", "answerForm", "answerInput", "submitBtn", "nextBtn",
      "skipBtn", "answerKeypad", "feedback", "pauseOverlay", "resumeBtn", "categorySelect", "levelSelect", "metricMastery",
      "metricAccuracy", "metricStreak", "metricAvgTime", "matrix", "statTotalAttempts", "statTotalCorrect", "statTotalTime",
      "statActiveCells", "weakList", "strongList", "enabledCategories", "dataBox", "exportBtn", "copyBtn", "importBtn", "resetBtn",
      "learnGrid"
    ].forEach(function (id) {
      elements[id] = document.getElementById(id);
    });
    elements.practiceMain = document.querySelector(".practice-main");
  }

  function init() {
    collectElements();
    progress = loadProgress();
    bindEvents();
    generateQuestion();
    setView(progress.activeView || "practice");
  }

  function runSelfTests() {
    var failures = [];
    function assert(name, condition) {
      if (!condition) failures.push(name);
    }
    assert("normalize binary prefix", normalizeAnswer("0b1010") === "1010");
    assert("normalize hex prefix", normalizeAnswer("0x3F800000") === "3f800000");
    assert("normalize fraction", normalizeAnswer(" -1 / 2 ") === "-1/2");
    assert("normalize infinity", normalizeAnswer("∞") === "inf");
    var fp4 = FORMATS[0];
    assert("fp4 positive one", decodeToy(fp4, parseInt("0010", 2)).display === "1");
    assert("fp4 negative two", decodeToy(fp4, parseInt("1100", 2)).display === "-2");
    assert("fp4 subnormal half", decodeToy(fp4, parseInt("0001", 2)).display === "1/2");
    assert("fp4 infinity", decodeToy(fp4, parseInt("0110", 2)).kind === "infinity");
    assert("fp4 nan", decodeToy(fp4, parseInt("0111", 2)).kind === "nan");
    var negativeSubnormal = makeQuestion("classify", 1, "", {
      display: decodeToy(fp4, parseInt("1001", 2)).kind,
      accepted: classSynonyms("subnormal", 1),
      quickInput: ["n", "s", "z", "i", "nan"]
    }, "classify", {
      kind: "subnormal",
      signNote: classSignNote(decodeToy(fp4, parseInt("1001", 2))),
      exponent: "00",
      fraction: "1"
    });
    assert("negative subnormal canonical class", negativeSubnormal.expected === "subnormal");
    assert("classification quick input has five tokens", negativeSubnormal.quickInput.join(" ") === "n s z i nan");
    assert("negative subnormal accepts single-letter class", negativeSubnormal.accepted.indexOf("s") !== -1);
    assert("negative subnormal accepts shorthand", negativeSubnormal.accepted.indexOf("-sub") !== -1);
    var negativeInfinity = makeQuestion("classify", 1, "", {
      display: decodeToy(fp4, parseInt("1110", 2)).kind,
      accepted: classSynonyms("infinity", 1)
    }, "classify", {
      kind: "infinity",
      signNote: classSignNote(decodeToy(fp4, parseInt("1110", 2))),
      exponent: "11",
      fraction: "0"
    });
    assert("negative infinity canonical class", negativeInfinity.expected === "infinity");
    assert("negative infinity accepts class abbreviation", negativeInfinity.accepted.indexOf("inf") !== -1);
    assert("negative infinity accepts single-letter class", negativeInfinity.accepted.indexOf("i") !== -1);
    assert("negative infinity accepts signed answer", negativeInfinity.accepted.indexOf("-inf") !== -1);
    assert("zero accepts single-letter class", classSynonyms("zero", 1).indexOf("z") !== -1);
    assert("normal accepts single-letter class", classSynonyms("normal", 0).indexOf("n") !== -1);
    assert("nan does not accept n", classSynonyms("nan", 0).indexOf("n") === -1);
    var fp6 = FORMATS[1];
    var fp8 = FORMATS[2];
    assert("fp6 positive one", decodeToy(fp6, rawFromFields(fp6, 0, fp6.bias, 0)).display === "1");
    assert("fp6 negative subnormal", decodeToy(fp6, rawFromFields(fp6, 1, 0, 1)).kind === "subnormal");
    assert("fp8 negative infinity", decodeToy(fp8, rawFromFields(fp8, 1, pow2(fp8.expBits) - 1, 0)).display === "-inf");
    var threeHalves = rational(3n, 2n);
    assert("fraction alias decimal", equivalentRationalAnswer(threeHalves, "1.5"));
    assert("fraction alias mixed", equivalentRationalAnswer(threeHalves, "1 1/2"));
    assert("fp4 half exact", exactRationalForFormat(fp4, rational(1n, 2n)));
    assert("fp4 three eighths not exact", !exactRationalForFormat(fp4, rational(3n, 8n)));
    assert("fp4 four overflows", !integerExactForFormat(fp4, 4n));
    var fp32 = FORMATS[4];
    assert("fp32 2^24 exact", integerExactForFormat(fp32, 16777216n));
    assert("fp32 2^24 + 1 not exact", !integerExactForFormat(fp32, 16777217n));
    assert("fp32 spacing near 1", spacingDisplay(fp32, 0) === "1/8388608");
    assert("fp32 spacing near 10000", spacingDisplay(fp32, 13) === "1/1024");
    assert("fp32 spacing near 1000000", spacingDisplay(fp32, 19) === "1/16");
    assert("fp32 spacing near 1e9", spacingDisplay(fp32, 29) === "64");
    assert("fp32 1000000 + 0.01 unchanged", !willChange(fp32, 19, rational(1n, 100n)));
    FORMATS.forEach(function (format) {
      var seen = {};
      classificationBuckets(format).forEach(function (bucket) {
        var decoded = decodeToy(format, bucket.raw);
        seen[decoded.kind + ":" + decoded.sign] = true;
      });
      assert(format.label + " classification includes positive zero", seen["zero:0"]);
      assert(format.label + " classification includes negative zero", seen["zero:1"]);
      assert(format.label + " classification includes positive infinity", seen["infinity:0"]);
      assert(format.label + " classification includes negative infinity", seen["infinity:1"]);
      assert(format.label + " classification includes nan", Object.keys(seen).some(function (key) { return key.indexOf("nan:") === 0; }));
      assert(format.label + " classification includes normal", seen["normal:0"] || seen["normal:1"]);
      assert(format.label + " classification includes subnormal", seen["subnormal:0"] || seen["subnormal:1"]);
    });
    var rng = makeRng(123);
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var q = category.generate(level, rng);
        assert(category.id + " L" + level + " expected display", typeof q.expected === "string" && q.expected.length > 0);
        assert(category.id + " L" + level + " accepted answer", q.accepted.indexOf(normalizeAnswer(q.expected)) !== -1);
      });
    });
    return { ok: failures.length === 0, failures: failures };
  }

  window.runSelfTests = runSelfTests;
  window.PracticeLabFloatingPointPractice = {
    categories: CATEGORIES,
    runSelfTests: runSelfTests
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
