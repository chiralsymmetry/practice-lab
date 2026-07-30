(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var generatedTranslationPairs = null;
  var STORAGE_KEY = "practiceLab.floatingPointPractice.v2";
  var LEGACY_KEY = "practiceLab.floatingPointPractice.v1";
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

  function t(path, fallback) {
    var value = path.split(".").reduce(function (node, key) {
      return node && Object.prototype.hasOwnProperty.call(node, key) ? node[key] : undefined;
    }, TEXT);
    return value === undefined ? fallback : value;
  }

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
    question.prompt.rows = question.prompt.rows.map(localizeGeneratedString);
    question.prompt.note = localizeGeneratedString(question.prompt.note);
    question.answer.fields.forEach(function (field) {
      field.label = localizeGeneratedString(field.label);
      if (field.kind === "choice") {
        field.options.forEach(function (option) { option.label = localizeGeneratedString(option.label); });
      }
    });
    question.workedSteps = question.workedSteps.map(localizeGeneratedString);
    question.interpretation = localizeGeneratedString(question.interpretation);
    return question;
  }

  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  function gcd(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b) { var next = a % b; a = b; b = next; }
    return a;
  }
  function rat(n, d) {
    n = BigInt(n); d = d === undefined ? 1n : BigInt(d);
    if (!d) throw new Error("zero denominator");
    if (!n) return { n: 0n, d: 1n };
    if (d < 0n) { n = -n; d = -d; }
    var divisor = gcd(n, d);
    return { n: n / divisor, d: d / divisor };
  }
  function add(a, b) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b) { return rat(a.n * b.n, a.d * b.d); }
  function div(a, b) { return rat(a.n * b.d, a.d * b.n); }
  function neg(a) { return rat(-a.n, a.d); }
  function absRat(a) { return rat(a.n < 0n ? -a.n : a.n, a.d); }
  function cmp(a, b) {
    var left = a.n * b.d, right = b.n * a.d;
    return left < right ? -1 : left > right ? 1 : 0;
  }
  function pow2(exponent) {
    return exponent >= 0 ? rat(1n << BigInt(exponent)) : rat(1n, 1n << BigInt(-exponent));
  }
  function scalePow2(value, exponent) { return mul(value, pow2(exponent)); }
  function rationalText(value) { return value.d === 1n ? String(value.n) : String(value.n) + "/" + String(value.d); }
  function compactExactText(value) {
    if (!value.n) return "0";
    var sign=value.n<0n?"-":"",numerator=value.n<0n?-value.n:value.n,denominator=value.d,exponent=0;
    while(numerator%2n===0n){numerator/=2n;exponent+=1;}
    while(denominator%2n===0n){denominator/=2n;exponent-=1;}
    if(denominator!==1n||String(numerator).length>4)return rationalText(value);
    var coefficient=sign+String(numerator);
    if(exponent===0)return coefficient;
    if(numerator===1n)return sign+"2^"+exponent;
    return coefficient+"×2^"+exponent;
  }
  function roundEvenPositive(value) {
    if (value.n < 0n) throw new Error("positive rounding only");
    var quotient = value.n / value.d;
    var twice = (value.n % value.d) * 2n;
    if (twice > value.d || (twice === value.d && quotient % 2n)) quotient += 1n;
    return quotient;
  }
  function floorLog2(value) {
    if (value.n <= 0n) throw new Error("log domain");
    var exponent = value.n.toString(2).length - value.d.toString(2).length;
    while (cmp(value, pow2(exponent)) < 0) exponent -= 1;
    while (cmp(value, pow2(exponent + 1)) >= 0) exponent += 1;
    return exponent;
  }

  function Rng(seed) { this.state = seed >>> 0 || 0x9e3779b9; }
  Rng.prototype.next = function () { this.state = (this.state * 1664525 + 1013904223) >>> 0; return this.state; };
  Rng.prototype.int = function (low, high) { return low + this.next() % (high - low + 1); };
  Rng.prototype.pick = function (items) { return items[this.int(0, items.length - 1)]; };
  Rng.prototype.chance = function (p) { return this.next() / 4294967296 < p; };
  Rng.prototype.shuffle = function (items) {
    items = items.slice();
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = this.int(0, i), tmp = items[i]; items[i] = items[j]; items[j] = tmp;
    }
    return items;
  };

  var FORMATS = [
    { id: "fp4", label: "FP4", bits: 4, e: 2, f: 1, bias: 1, p: 2 },
    { id: "fp6", label: "FP6", bits: 6, e: 3, f: 2, bias: 3, p: 3 },
    { id: "fp8", label: "FP8", bits: 8, e: 4, f: 3, bias: 7, p: 4 },
    { id: "fp16", label: "binary16 / FP16", bits: 16, e: 5, f: 10, bias: 15, p: 11 },
    { id: "bf16", label: "bfloat16 / BF16", bits: 16, e: 8, f: 7, bias: 127, p: 8 },
    { id: "fp32", label: "binary32 / FP32", bits: 32, e: 8, f: 23, bias: 127, p: 24 }
  ];
  function formatById(id) { return FORMATS.find(function (format) { return format.id === id; }) || FORMATS[0]; }
  function formatsForLevel(level) {
    if (level === 1) return [FORMATS[0]];
    if (level === 2) return FORMATS.slice(0, 2);
    if (level === 3) return FORMATS.slice(0, 3);
    if (level === 4) return FORMATS.slice(1, 5);
    return FORMATS.slice(2);
  }
  function chooseFormat(level, rng) { return rng.pick(formatsForLevel(level)); }
  function maxE(format) { return (1n << BigInt(format.e)) - 1n; }
  function maxF(format) { return (1n << BigInt(format.f)) - 1n; }
  function signMask(format) { return 1n << BigInt(format.bits - 1); }
  function rawFromFields(format, sign, exponent, fraction) {
    return BigInt(sign) * signMask(format) + BigInt(exponent) * (1n << BigInt(format.f)) + BigInt(fraction);
  }
  function decode(format, raw) {
    raw = BigInt(raw);
    var sign = Number(raw / signMask(format));
    var exponent = (raw >> BigInt(format.f)) & maxE(format);
    var fraction = raw & maxF(format);
    var kind, value = null, effectiveExponent = null, significand = null;
    if (!exponent && !fraction) { kind = "zero"; value = rat(0n); }
    else if (!exponent) {
      kind = "subnormal";
      effectiveExponent = 1 - format.bias;
      significand = rat(fraction, 1n << BigInt(format.f));
      value = scalePow2(significand, effectiveExponent);
    } else if (exponent === maxE(format)) kind = fraction ? "NaN" : "infinity";
    else {
      kind = "normal";
      effectiveExponent = Number(exponent) - format.bias;
      significand = rat((1n << BigInt(format.f)) + fraction, 1n << BigInt(format.f));
      value = scalePow2(significand, effectiveExponent);
    }
    if (value && sign) value = neg(value);
    return { raw: raw, sign: sign, exponent: exponent, fraction: fraction, kind: kind, value: value, effectiveExponent: effectiveExponent, significand: significand };
  }
  function bits(raw, width) { return BigInt(raw).toString(2).padStart(width, "0"); }
  function groupedBits(format, raw) {
    var text = bits(raw, format.bits);
    return text.slice(0, 1) + " " + text.slice(1, 1 + format.e) + " " + text.slice(1 + format.e);
  }
  function hex(raw, width) { return BigInt(raw).toString(16).toUpperCase().padStart(Math.ceil(width / 4), "0"); }
  function pattern(format, raw, representation) {
    if (representation === "hex" || (format.bits >= 16 && representation !== "bits")) return "0x" + hex(raw, format.bits);
    return representation === "fields" ? groupedBits(format, raw) : bits(raw, format.bits);
  }
  function formatSpec(format) {
    return format.label + ": 1 sign, " + format.e + " exponent, " + format.f + " fraction bits; bias " + format.bias + "; precision p=" + format.p;
  }
  function signedSpecial(decoded) {
    if (decoded.kind === "zero") return decoded.sign ? "-0" : "+0";
    if (decoded.kind === "infinity") return decoded.sign ? "-∞" : "+∞";
    return decoded.kind;
  }
  function minSubnormal(format) { return pow2(1 - format.bias - format.f); }
  function minNormal(format) { return pow2(1 - format.bias); }
  function maxFinite(format) {
    return scalePow2(rat((1n << BigInt(format.f + 1)) - 1n, 1n << BigInt(format.f)), Number(maxE(format) - 1n) - format.bias);
  }
  function ulp(format, exponent) { return pow2(exponent - format.f); }
  function encodeExact(format, value, negativeZero) {
    if (!value.n) return rawFromFields(format, negativeZero ? 1 : 0, 0, 0);
    var sign = value.n < 0n ? 1 : 0;
    var magnitude = absRat(value);
    if (cmp(magnitude, maxFinite(format)) > 0) return null;
    if (cmp(magnitude, minNormal(format)) < 0) {
      var quotient = div(magnitude, minSubnormal(format));
      if (quotient.d !== 1n || quotient.n < 1n || quotient.n > maxF(format)) return null;
      return rawFromFields(format, sign, 0, quotient.n);
    }
    var exponent = floorLog2(magnitude);
    var scaled = div(magnitude, ulp(format, exponent));
    if (scaled.d !== 1n) return null;
    var retained = scaled.n;
    var leading = 1n << BigInt(format.f);
    if (retained < leading || retained >= leading * 2n) return null;
    var stored = BigInt(exponent + format.bias);
    if (stored <= 0n || stored >= maxE(format)) return null;
    return rawFromFields(format, sign, stored, retained - leading);
  }
  function roundToFormat(format, value, negativeZero) {
    if (!value.n) return { raw: rawFromFields(format, negativeZero ? 1 : 0, 0, 0), exact: true, overflow: false };
    var sign = value.n < 0n ? 1 : 0;
    var magnitude = absRat(value);
    var overflowMidpoint = add(maxFinite(format), div(ulp(format, Number(maxE(format) - 1n) - format.bias), rat(2)));
    if (cmp(magnitude, overflowMidpoint) >= 0) return { raw: rawFromFields(format, sign, maxE(format), 0), exact: false, overflow: true };
    var quantum, exponent = null;
    if (cmp(magnitude, minNormal(format)) < 0) quantum = minSubnormal(format);
    else { exponent = floorLog2(magnitude); quantum = ulp(format, exponent); }
    var retained = roundEvenPositive(div(magnitude, quantum));
    if (!retained) return { raw: rawFromFields(format, sign, 0, 0), exact: false, overflow: false };
    var leading = 1n << BigInt(format.f);
    var raw;
    if (exponent === null && retained < leading) raw = rawFromFields(format, sign, 0, retained);
    else {
      if (exponent === null) exponent = 1 - format.bias;
      if (retained === leading * 2n) { retained = leading; exponent += 1; }
      var stored = BigInt(exponent + format.bias);
      if (stored >= maxE(format)) raw = rawFromFields(format, sign, maxE(format), 0);
      else raw = rawFromFields(format, sign, stored, retained - leading);
    }
    var decoded = decode(format, raw);
    return { raw: raw, exact: decoded.value ? cmp(decoded.value, value) === 0 : false, overflow: decoded.kind === "infinity" };
  }
  function neighbors(format, value) {
    var rounded = roundToFormat(format, value);
    var center = decode(format, rounded.raw);
    if (!center.value) return { lower: null, upper: null, rounded: center };
    var raw = rounded.raw, sign = center.sign, lowerRaw, upperRaw;
    if (!sign) {
      lowerRaw = raw ? raw - 1n : signMask(format) + 1n;
      upperRaw = raw + 1n;
    } else {
      lowerRaw = raw + 1n;
      upperRaw = raw === signMask(format) ? 1n : raw - 1n;
    }
    return { lower: decode(format, lowerRaw), upper: decode(format, upperRaw), rounded: center };
  }
  function finiteRawSamples(format, includeSubnormal) {
    var samples = [];
    var exponents = [1n, BigInt(format.bias), maxE(format) - 1n].filter(function (value, index, list) { return value > 0n && value < maxE(format) && list.indexOf(value) === index; });
    exponents.forEach(function (exponent) {
      [0n, format.f ? 1n << BigInt(format.f - 1) : 0n, maxF(format)].forEach(function (fraction) {
        [0, 1].forEach(function (sign) { samples.push(rawFromFields(format, sign, exponent, fraction)); });
      });
    });
    if (includeSubnormal) [1n, maxF(format)].forEach(function (fraction) { [0, 1].forEach(function (sign) { samples.push(rawFromFields(format, sign, 0, fraction)); }); });
    return samples;
  }
  function classRaw(format, kind, sign, rng) {
    if (kind === "zero") return rawFromFields(format, sign, 0, 0);
    if (kind === "subnormal") return rawFromFields(format, sign, 0, rng.int(1, Number(maxF(format))));
    if (kind === "infinity") return rawFromFields(format, sign, maxE(format), 0);
    if (kind === "NaN") return rawFromFields(format, sign, maxE(format), rng.int(1, Number(maxF(format))));
    return rawFromFields(format, sign, rng.int(1, Number(maxE(format) - 1n)), rng.int(0, Number(maxF(format))));
  }

  var CATEGORIES = [
    { id: "classify", title: "Classify Floats" },
    { id: "decode", title: "Decode Value" },
    { id: "encode", title: "Encode Value" },
    { id: "spacing", title: "Exponent & Spacing" },
    { id: "exactness", title: "Exactness" },
    { id: "will-change", title: "Will It Change?" }
  ];
  var FAMILY_DATA = [
    ["classify_pattern", "classify", "Classification", "Classify pattern", [1,2,3,4,5], "Exponent zero selects zero/subnormal; exponent all ones selects infinity/NaN."],
    ["extract_fields", "classify", "Fields", "Extract fields", [1,2,3,4], "Slice the sign, stored exponent, and trailing fraction at the declared widths."],
    ["special_sign", "classify", "Signed specials", "Signed zero and infinity", [1,2,3], "The sign changes the signed value, not the class."],
    ["decode_normal", "decode", "Normal decode", "Decode a normal", [1,2,3,4,5], "Normals use (−1)^s(1+F/2^f)2^(E−bias)."],
    ["decode_subnormal", "decode", "Subnormal decode", "Decode a subnormal", [1,2,3,4], "Subnormals omit the hidden one and use exponent 1−bias."],
    ["decode_components", "decode", "Components", "Decode components", [2,3,4], "Keep stored exponent, effective exponent, significand, and value distinct."],
    ["encode_exact_finite", "encode", "Exact encode", "Encode an exact finite value", [1,2,3,4], "Normalize the exact value, then store only trailing fraction bits."],
    ["encode_special", "encode", "Special encode", "Encode a special value", [1,2,3], "Zeros use all-zero exponent/fraction; infinities use all-one exponent and zero fraction."],
    ["round_to_format", "encode", "Nearest-even", "Round to a format", [2,3,4,5], "Compare exact distances to adjacent values; ties select an even retained significand."],
    ["round_to_bfloat16", "encode", "bfloat16 conversion", "Round to bfloat16", [1,2,3,4,5], "Decode the source exactly, then round once to bfloat16; discarding binary32 low bits is not rounding."],
    ["compare_binary16_bfloat16_rounding", "encode", "Format contrast", "Compare binary16 and bfloat16 rounding", [2,3,4,5], "Round independently, then compare decoded classes and exact values rather than raw 16-bit patterns."],
    ["rounding_boundary_result", "encode", "Boundary rounding", "Round at a boundary", [3,4,5], "Nearest-even covers zero/subnormal, subnormal/normal, and finite/infinity boundaries."],
    ["remove_exponent_bias", "spacing", "Exponent bias", "Remove or apply bias", [1,2,3,4], "For normals, e=E−bias and E=e+bias."],
    ["ulp_spacing", "spacing", "Spacing", "ULP spacing", [1,2,3,4], "Normal spacing near 2^e is 2^(e−(p−1)); subnormal spacing is constant."],
    ["compare_binary16_bfloat16_spacing", "spacing", "Format contrast", "Compare binary16 and bfloat16 spacing", [2,3,4,5], "At the same exact value, compare independently constructed successors; subnormal behavior can reverse the usual precision ordering."],
    ["adjacent_values", "spacing", "Neighbors", "Adjacent values", [2,3,4,5], "Step to the exact predecessor or successor, respecting sign and boundaries."],
    ["format_extrema", "spacing", "Range", "Format extrema", [1,2,3,4], "Read exact endpoints from boundary fields."],
    ["compare_binary16_bfloat16_capability", "spacing", "Range versus precision", "Compare range and precision", [1,2,3,4,5], "Exponent bits control range; significand bits control normal precision; local spacing also depends on magnitude."],
    ["choose_binary16_or_bfloat16", "spacing", "Practical tradeoff", "Choose binary16 or bfloat16", [2,3,4,5], "Translate exact numerical requirements into independent range and resolution tests without hardware claims."],
    ["rational_exactness", "exactness", "Rationals", "Rational exactness", [1,2,3,4], "A power-of-two denominator is necessary, but precision and range must also fit."],
    ["integer_exactness", "exactness", "Integers", "Integer exactness", [2,3,4], "Above 2^p, integers must align with the local spacing."],
    ["largest_consecutive_integer", "exactness", "Integer boundary", "Largest consecutive integer", [1,2,3,4], "Every integer through 2^p is exact; 2^p+1 is the first missing positive integer."],
    ["operation_exactness", "exactness", "Operations", "Operation-result exactness", [3,4,5], "Compute the mathematical result exactly before testing the target lattice."],
    ["addition_changes_value", "will-change", "Absorption", "Does addition change it?", [2,3,4,5], "Round exact x+y; half-ULP ties depend on retained parity."],
    ["rounded_addition_result", "will-change", "Rounded arithmetic", "Rounded addition result", [2,3,4,5], "Perform the exact operation, then round once to the declared format."],
    ["absorption_threshold", "will-change", "Absorption", "Absorption threshold", [3,4,5], "Test ordered increments; the first change depends on half-spacing and parity."],
    ["non_associativity", "will-change", "Evaluation order", "Non-associativity", [4,5], "Round after every explicitly parenthesized operation."],
    ["special_arithmetic_result", "will-change", "Special results", "Special arithmetic result", [3,4,5], "Use the declared IEEE-style special-result rule rather than ordinary algebra."]
  ];
  var FAMILIES = FAMILY_DATA.map(function (row) {
    return { id: row[0], categoryId: row[1], subcategoryId: row[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"), subcategory: row[2], title: row[3], levels: row[4], learn: row[5] };
  });
  function categoryById(id) { return CATEGORIES.find(function (item) { return item.id === id; }) || CATEGORIES[0]; }
  function familyById(id) { return FAMILIES.find(function (item) { return item.id === id; }) || FAMILIES[0]; }
  function familiesForCategory(id) { return FAMILIES.filter(function (item) { return item.categoryId === id; }); }
  CATEGORIES.forEach(function (category) { category.title = t("categories." + category.id + ".title", category.title); });
  FAMILIES.forEach(function (family) {
    family.subcategory = t("families." + family.id + ".subcategory", family.subcategory);
    family.title = t("families." + family.id + ".title", family.title);
    family.learn = t("families." + family.id + ".learn", family.learn);
  });

  function choiceField(id, label, value, options) {
    return { id: id, label: label, kind: "choice", value: value, options: options.map(function (option) { return typeof option === "string" ? { value: option, label: option } : option; }) };
  }
  function textField(id, label, kind, value, meta) { return Object.assign({ id: id, label: label, kind: kind, value: String(value) }, meta || {}); }
  function rationalField(id, label, value) { return textField(id, label, "rational", rationalText(value), { exact: rationalText(value), display: compactExactText(value) }); }
  function integerField(id, label, value) { return textField(id, label, "integer", value); }
  function bitsField(id, label, format, raw) { return textField(id, label, "bits", bits(raw, format.bits), { formatId: format.id }); }
  function prompt(title, rows, note) { return { title: title, rows: rows, note: note }; }
  function makeQuestion(familyId, level, format, parameters, promptData, fields, steps, signature, meta) {
    var family = familyById(familyId);
    return {
      categoryId: family.categoryId,
      subcategoryId: family.subcategoryId,
      familyId: familyId,
      level: level,
      format: format.id,
      rawBits: meta.rawBits === undefined ? null : String(meta.rawBits),
      exactValue: meta.exactValue || null,
      valueClass: meta.valueClass || null,
      fields: meta.fields || null,
      roundingMode: "nearest, ties to even",
      semanticFamily: familyId,
      misconception: meta.misconception || "relationship",
      structuralSignature: [familyId, format.id].concat(signature || []).join("|"),
      parameters: parameters,
      prompt: promptData,
      answer: { fields: fields },
      workedSteps: steps,
      interpretation: meta.interpretation || ""
    };
  }

  var GENERATORS = {};
  var DERIVERS = {};
  function representation(level, format) { return level === 1 ? "fields" : level >= 3 && format.bits >= 8 ? "hex" : "bits"; }
  function classOptions() { return ["zero", "subnormal", "normal", "infinity", "NaN"]; }
  function finiteDisplay(decoded) { return decoded.kind === "zero" ? signedSpecial(decoded) : rationalText(decoded.value); }

  GENERATORS.classify_pattern = function (level, rng) {
    var format = chooseFormat(level, rng), kinds = ["zero","subnormal","normal","infinity","NaN"];
    var count = level === 5 ? 3 : 1, rows = [], fields = [], raws = [], classes = [];
    for (var i = 0; i < count; i += 1) {
      var kind = kinds[(rng.int(0, kinds.length - 1) + i) % kinds.length];
      var raw = classRaw(format, kind, rng.int(0,1), rng), decoded = decode(format, raw);
      rows.push((count > 1 ? String.fromCharCode(65+i) + ": " : "") + pattern(format, raw, representation(level, format)));
      fields.push(choiceField("class" + i, count > 1 ? "Class " + String.fromCharCode(65+i) : "Class", decoded.kind, classOptions()));
      raws.push(String(raw)); classes.push(decoded.kind);
    }
    return makeQuestion("classify_pattern", level, format, { raws: raws, classes: classes }, prompt("Classify the pattern" + (count > 1 ? "s" : "") + ".", [formatSpec(format)].concat(rows), "The sign does not change the class."), fields, ["Split sign | exponent | fraction.", "All-zero exponent: zero/subnormal; all-one exponent: infinity/NaN.", "Use the fraction to choose within the pair."], ["count-"+count, classes.join("-"), representation(level, format)], { rawBits: raws.join(","), valueClass: classes.join(","), misconception: "reserved-exponent-boundaries" });
  };
  DERIVERS.classify_pattern = function (p, format) {
    var result = {}; p.raws.forEach(function (raw, i) { result["class"+i] = decode(format, raw).kind; }); return result;
  };

  GENERATORS.extract_fields = function (level, rng) {
    var format = chooseFormat(level, rng), raw = BigInt(rng.next()) & ((1n << BigInt(format.bits)) - 1n), decoded = decode(format, raw);
    var numeric = level >= 4;
    return makeQuestion("extract_fields", level, format, { raw: String(raw), numeric: numeric }, prompt("Extract the stored fields.", [formatSpec(format), "Pattern: " + pattern(format, raw, level === 1 ? "fields" : level >= 3 ? "hex" : "bits")], numeric ? "Give each field as an unsigned integer." : "Retain the exact field widths."), [
      integerField("sign", "Sign", decoded.sign),
      textField("exponent", "Stored exponent", numeric ? "integer" : "fieldbits", numeric ? decoded.exponent : bits(decoded.exponent, format.e), { width: format.e }),
      textField("fraction", "Fraction field", numeric ? "integer" : "fieldbits", numeric ? decoded.fraction : bits(decoded.fraction, format.f), { width: format.f })
    ], ["Boundary widths: 1 | " + format.e + " | " + format.f + ".", "Reassembly gives " + bits(raw, format.bits) + "."], [numeric ? "numeric" : "bits", representation(level,format)], { rawBits: raw, fields: { sign: decoded.sign, exponent: String(decoded.exponent), fraction: String(decoded.fraction) }, valueClass: decoded.kind, misconception: "field-boundaries" });
  };
  DERIVERS.extract_fields = function (p, format) {
    var d = decode(format, p.raw);
    return { sign: String(d.sign), exponent: p.numeric ? String(d.exponent) : bits(d.exponent, format.e), fraction: p.numeric ? String(d.fraction) : bits(d.fraction, format.f) };
  };

  GENERATORS.special_sign = function (level, rng) {
    var format = chooseFormat(level, rng), kind = level === 1 ? "zero" : rng.pick(["zero","infinity"]), sign = rng.int(0,1);
    var raw = classRaw(format, kind, sign, rng), decoded = decode(format, raw);
    return makeQuestion("special_sign", level, format, { raw: String(raw) }, prompt("Give the signed special value.", [formatSpec(format), "Pattern: " + pattern(format, raw, level >= 3 ? "hex" : "fields")], "Keep +0 and -0 distinct."), [choiceField("value", "Signed value", signedSpecial(decoded), ["+0","-0","+∞","-∞"])], ["Class: " + decoded.kind + ".", "Sign bit " + sign + " gives " + signedSpecial(decoded) + "."], [kind,"sign-"+sign], { rawBits: raw, valueClass: kind, fields: { sign: sign }, misconception: "class-versus-sign" });
  };
  DERIVERS.special_sign = function (p, format) { return { value: signedSpecial(decode(format, p.raw)) }; };

  function normalRaw(format, rng, sparse) {
    var exponent = sparse ? rng.pick([1, format.bias, Number(maxE(format)-1n)]) : rng.int(1, Number(maxE(format)-1n));
    var fractions = [0, 1, Number(maxF(format)), format.f ? Number(1n << BigInt(format.f-1)) : 0];
    return rawFromFields(format, rng.int(0,1), exponent, rng.pick(fractions));
  }
  GENERATORS.decode_normal = function (level, rng) {
    var format = chooseFormat(level, rng), raw = normalRaw(format, rng, level >= 4), decoded = decode(format, raw);
    return makeQuestion("decode_normal", level, format, { raw: String(raw) }, prompt("Decode this normal value exactly.", [formatSpec(format), "Pattern: " + pattern(format, raw, level >= 4 ? "hex" : level === 1 ? "fields" : "bits")], "Enter an exact integer, fraction, terminating decimal, mixed number, or power-of-two form."), [rationalField("value","Exact value",decoded.value)], ["e = " + decoded.exponent + " − " + format.bias + " = " + decoded.effectiveExponent + ".", "significand = " + rationalText(decoded.significand) + " (hidden one included).", "value = " + (decoded.sign ? "−" : "") + rationalText(decoded.significand) + " × 2^" + decoded.effectiveExponent + " = " + compactExactText(decoded.value) + "."], ["sign-"+decoded.sign,"e-"+(decoded.effectiveExponent<0?"neg":"nonneg"),representation(level,format)], { rawBits: raw, exactValue: rationalText(decoded.value), valueClass: "normal", fields: { sign: decoded.sign, exponent: String(decoded.exponent), fraction: String(decoded.fraction) }, misconception: "hidden-one" });
  };
  DERIVERS.decode_normal = function (p, format) { return { value: rationalText(decode(format,p.raw).value) }; };

  GENERATORS.decode_subnormal = function (level, rng) {
    var format = chooseFormat(level, rng), fraction = rng.pick([1n, maxF(format), format.f > 1 ? 1n << BigInt(format.f-1) : 1n]);
    var raw = rawFromFields(format, level >= 3 ? rng.int(0,1) : 0, 0, fraction), decoded = decode(format,raw);
    return makeQuestion("decode_subnormal", level, format, { raw: String(raw) }, prompt("Decode this subnormal exactly.", [formatSpec(format), "Pattern: " + pattern(format,raw,level>=4?"hex":level===1?"fields":"bits")], "There is no hidden leading one; exact power-of-two forms are accepted."), [rationalField("value","Exact value",decoded.value)], ["effective exponent = 1 − bias = " + decoded.effectiveExponent + ".", "significand = F/2^f = " + rationalText(decoded.significand) + ".", "value = " + compactExactText(decoded.value) + "."], ["sign-"+decoded.sign,"fraction-"+(fraction===1n?"min":fraction===maxF(format)?"max":"middle")], { rawBits: raw, exactValue: rationalText(decoded.value), valueClass: "subnormal", fields: { sign:decoded.sign, exponent:"0", fraction:String(fraction) }, misconception: "subnormal-hidden-one" });
  };
  DERIVERS.decode_subnormal = DERIVERS.decode_normal;

  GENERATORS.decode_components = function (level, rng) {
    var format = chooseFormat(level,rng), useSub = level>=3 && rng.chance(0.5);
    var raw = useSub ? rawFromFields(format,rng.int(0,1),0,rng.int(1,Number(maxF(format)))) : normalRaw(format,rng,false);
    var decoded=decode(format,raw);
    return makeQuestion("decode_components",level,format,{raw:String(raw)},prompt("Decode the named components.",[formatSpec(format),"Pattern: "+pattern(format,raw,level>=4?"hex":"bits")],"For a subnormal, report effective exponent 1−bias."),[
      integerField("exponent","Effective exponent",decoded.effectiveExponent),
      rationalField("significand","Unsigned significand",decoded.significand),
      rationalField("value","Signed exact value",decoded.value)
    ],["effective exponent: "+decoded.effectiveExponent+".","significand: "+rationalText(decoded.significand)+".","signed product: "+rationalText(decoded.value)+"."],[decoded.kind,"sign-"+decoded.sign],{rawBits:raw,exactValue:rationalText(decoded.value),valueClass:decoded.kind,fields:{sign:decoded.sign,exponent:String(decoded.exponent),fraction:String(decoded.fraction)},misconception:"stored-versus-effective-exponent"});
  };
  DERIVERS.decode_components=function(p,format){var d=decode(format,p.raw);return{exponent:String(d.effectiveExponent),significand:rationalText(d.significand),value:rationalText(d.value)};};

  GENERATORS.encode_exact_finite=function(level,rng){
    var format=chooseFormat(level,rng), raws=finiteRawSamples(format,level>=2).filter(function(raw){var d=decode(format,raw);return d.kind==="normal"||(level>=2&&d.kind==="subnormal");});
    var raw=rng.pick(raws),d=decode(format,raw);
    return makeQuestion("encode_exact_finite",level,format,{value:rationalText(d.value)},prompt("Encode this exactly representable finite value.",[formatSpec(format),"Value: "+rationalText(d.value)],level>=4?"Give exact-width binary or hexadecimal.":"Give the complete bit pattern."),[bitsField("bits","Encoding",format,raw)],["normalize magnitude and choose sign "+d.sign+".","stored exponent "+d.exponent+", trailing fraction "+bits(d.fraction,format.f)+".","encoding: "+pattern(format,raw,level>=4?"hex":"fields")+"."],["class-"+d.kind,"sign-"+d.sign],{rawBits:raw,exactValue:rationalText(d.value),valueClass:d.kind,fields:{sign:d.sign,exponent:String(d.exponent),fraction:String(d.fraction)},misconception:"storing-hidden-one"});
  };
  DERIVERS.encode_exact_finite=function(p,format){return{bits:bits(encodeExact(format,parseRational(p.value)),format.bits)};};

  function canonicalNan(format){return rawFromFields(format,0,maxE(format),1n<<BigInt(format.f-1));}
  function binary32ToBfloat16Raw(raw) {
    raw = BigInt(raw);
    var source = formatById("fp32"), target = formatById("bf16"), decoded = decode(source, raw);
    if (decoded.kind === "NaN") return canonicalNan(target);
    if (decoded.kind === "infinity") return rawFromFields(target, decoded.sign, maxE(target), 0);
    if (decoded.kind === "zero") return rawFromFields(target, decoded.sign, 0, 0);
    var upper = raw / 65536n, lower = raw % 65536n;
    if (lower > 32768n || (lower === 32768n && upper % 2n)) upper += 1n;
    return upper;
  }
  GENERATORS.encode_special=function(level,rng){
    var format=chooseFormat(level,rng), values=level===1?["+0","-0"]:level===2?["+0","-0","+∞","-∞"]:["+0","-0","+∞","-∞","canonical NaN"];
    var value=rng.pick(values),raw=value==="canonical NaN"?canonicalNan(format):rawFromFields(format,value[0]==="-"?1:0,value.indexOf("∞")>=0?maxE(format):0,0);
    return makeQuestion("encode_special",level,format,{value:value},prompt("Encode the stated special value.",[formatSpec(format),"Value: "+value,value==="canonical NaN"?"Canonical NaN uses fraction 1 followed by zeros.":""],"Give the complete pattern."),[bitsField("bits","Encoding",format,raw)],["choose sign bit from the stated sign.","choose reserved exponent/fraction fields.","encoding: "+pattern(format,raw,level>=3?"hex":"fields")+"."],[value.replace(/\s/g,"-")],{rawBits:raw,valueClass:value.indexOf("NaN")>=0?"NaN":value.indexOf("∞")>=0?"infinity":"zero",misconception:"special-fields"});
  };
  DERIVERS.encode_special=function(p,format){var value=p.value,raw=value==="canonical NaN"?canonicalNan(format):rawFromFields(format,value[0]==="-"?1:0,value.indexOf("∞")>=0?maxE(format):0,0);return{bits:bits(raw,format.bits)};};

  function midpoint(a,b){return div(add(a,b),rat(2));}
  function roundingCase(format,rng,tie){
    var candidates=finiteRawSamples(format,false).filter(function(candidate){var decoded=decode(format,candidate);return !decoded.sign&&decoded.kind==="normal"&&!(decoded.exponent===maxE(format)-1n&&decoded.fraction===maxF(format));});
    var raw=rng.pick(candidates),d=decode(format,raw);
    var next=decode(format,raw+1n),mid=midpoint(d.value,next.value);
    var value=tie?mid:add(d.value,mul(sub(next.value,d.value),rat(rng.pick([1,3]),4)));
    var rr=roundToFormat(format,value);
    return{value:value,lower:d,upper:next,rounded:decode(format,rr.raw),tie:tie};
  }
  GENERATORS.round_to_format=function(level,rng){
    var format=chooseFormat(level,rng),c=roundingCase(format,rng,level>=3&&rng.chance(0.55));
    return makeQuestion("round_to_format",level,format,{value:rationalText(c.value)},prompt("Round the exact value to the format.",[formatSpec(format),"Exact value: "+rationalText(c.value),"Mode: nearest, ties to even"],"Give the resulting complete encoding."),[bitsField("bits","Rounded encoding",format,c.rounded.raw)],["neighbors: "+rationalText(c.lower.value)+" and "+rationalText(c.upper.value)+".",c.tie?"equal distances; retained parity selects "+rationalText(c.rounded.value)+".":"the nearer neighbor is "+rationalText(c.rounded.value)+".","encoding: "+pattern(format,c.rounded.raw,level>=4?"hex":"bits")+"."],[c.tie?"tie":"non-tie","winner-"+(c.rounded.raw===c.lower.raw?"lower":"upper")],{rawBits:c.rounded.raw,exactValue:rationalText(c.value),valueClass:c.rounded.kind,misconception:c.tie?"ties-always-up":"truncation"});
  };
  DERIVERS.round_to_format=function(p,format){return{bits:bits(roundToFormat(format,parseRational(p.value)).raw,format.bits)};};

  function decodedResultText(decoded) {
    return decoded.kind === "normal" || decoded.kind === "subnormal" ? compactExactText(decoded.value) : signedSpecial(decoded);
  }
  function bfloat16RoundingCases() {
    var format = formatById("bf16"), one = decode(format, 0x3F80n).value;
    return {
      exact: { value: decode(format, 0x3FC0n).value, relation: "already exact" },
      "non-tie": { value: add(one, rat(5,1024)), relation: "strictly nearer the upper neighbor" },
      "tie-lower": { value: midpoint(decode(format,0x3F80n).value,decode(format,0x3F81n).value), relation: "midpoint; lower retained significand is even" },
      "tie-upper": { value: midpoint(decode(format,0x3F81n).value,decode(format,0x3F82n).value), relation: "midpoint; upper retained significand is even" },
      carry: { value: midpoint(decode(format,0x3FFFn).value,decode(format,0x4000n).value), relation: "midpoint; even endpoint carries into the next binade" },
      underflow: { value: div(minSubnormal(format),rat(2)), relation: "zero/subnormal midpoint; zero is even" },
      "negative-underflow": { value: neg(div(minSubnormal(format),rat(2))), relation: "negative zero/subnormal midpoint; signed zero is even" },
      "normal-boundary": { value: midpoint(decode(format,0x007Fn).value,decode(format,0x0080n).value), relation: "subnormal/normal midpoint; smallest normal is even" },
      overflow: { value: add(maxFinite(format),div(ulp(format,127),rat(2))), relation: "max-finite/infinity midpoint; the overflow endpoint is even" },
      "negative-overflow": { value: neg(add(maxFinite(format),div(ulp(format,127),rat(2)))), relation: "negative max-finite/infinity midpoint; the overflow endpoint is even" }
    };
  }
  GENERATORS.round_to_bfloat16=function(level,rng){
    var format=formatById("bf16"),sourceFormat=formatById("fp32"),all=bfloat16RoundingCases();
    var ids=level===1?["exact"]:level===2?["exact","non-tie"]:level===3?["non-tie","tie-lower","tie-upper"]:level===4?["tie-lower","tie-upper","carry","normal-boundary"]:["tie-lower","tie-upper","carry","underflow","negative-underflow","normal-boundary","overflow","negative-overflow"];
    var caseId=rng.pick(ids),selected=all[caseId],sourceRaw=encodeExact(sourceFormat,selected.value),sourceKind=level>=4&&sourceRaw!==null&&rng.chance(.7)?"binary32":"rational";
    var rounded=decode(format,roundToFormat(format,selected.value).raw),rows=[formatSpec(format)];
    if(sourceKind==="binary32")rows.push("Binary32 source: 0x"+hex(sourceRaw,32));
    else rows.push("Exact source: "+compactExactText(selected.value));
    rows.push("Mode: nearest, ties to even");
    var steps=["source value = "+compactExactText(selected.value)+"."];
    if(sourceKind==="binary32"){
      var integerRaw=binary32ToBfloat16Raw(sourceRaw),upper=sourceRaw/65536n,lower=sourceRaw%65536n;
      if(integerRaw!==rounded.raw)throw new Error("binary32/bfloat16 integer oracle mismatch");
      steps.push("binary32 upper half = 0x"+hex(upper,16)+", lower half = 0x"+hex(lower,16)+".");
    }
    steps.push(selected.relation+"; nearest-even gives "+decodedResultText(rounded)+".");
    steps.push("bfloat16 encoding: 0x"+hex(rounded.raw,16)+".");
    return makeQuestion("round_to_bfloat16",level,format,{sourceKind:sourceKind,value:rationalText(selected.value),sourceRaw:sourceRaw===null?null:String(sourceRaw)},prompt("Round exactly to bfloat16.",rows,"Give the complete bfloat16 encoding; do not merely discard binary32 low bits."),[bitsField("bits","bfloat16 encoding",format,rounded.raw)],steps,[caseId,sourceKind,"result-"+rounded.kind],{rawBits:rounded.raw,exactValue:rationalText(selected.value),valueClass:rounded.kind,misconception:sourceKind==="binary32"?"truncate-binary32":"ties-always-up"});
  };
  DERIVERS.round_to_bfloat16=function(p){
    var format=formatById("bf16"),value=p.sourceKind==="binary32"?decode(formatById("fp32"),p.sourceRaw).value:parseRational(p.value);
    return{bits:bits(roundToFormat(format,value).raw,format.bits)};
  };

  function sameDecodedValue(left,right) {
    if(left.kind!==right.kind)return false;
    if(left.kind==="NaN")return false;
    if(left.kind==="zero"||left.kind==="infinity")return left.sign===right.sign;
    return cmp(left.value,right.value)===0;
  }
  function binary16Bfloat16Round(value) {
    var fp16=formatById("fp16"),bf16=formatById("bf16");
    var left=decode(fp16,roundToFormat(fp16,value).raw),right=decode(bf16,roundToFormat(bf16,value).raw);
    return{fp16:left,bf16:right,same:sameDecodedValue(left,right)};
  }
  GENERATORS.compare_binary16_bfloat16_rounding=function(level,rng){
    var format=formatById("bf16"),cases={
      "shared-exact":rat(3,2),
      "shared-inexact":add(rat(1),pow2(-12)),
      precision:rat(257),
      midpoint:add(rat(1),pow2(-8)),
      "binary16-overflow":rat(65520),
      "binary16-zero":pow2(-130)
    };
    var ids=level===2?["shared-exact","shared-inexact"]:level===3?["shared-inexact","precision","midpoint"]:level===4?["shared-inexact","precision","midpoint","binary16-zero"]:Object.keys(cases);
    var caseId=rng.pick(ids),value=cases[caseId],result=binary16Bfloat16Round(value);
    return makeQuestion("compare_binary16_bfloat16_rounding",level,format,{value:rationalText(value)},prompt("Compare binary16 and bfloat16 rounding.",["Exact source: "+compactExactText(value),formatSpec(formatById("fp16")),formatSpec(format)],"Round independently with nearest-even; compare decoded values, not raw patterns."),[
      bitsField("fp16","binary16 encoding",formatById("fp16"),result.fp16.raw),
      bitsField("bf16","bfloat16 encoding",format,result.bf16.raw),
      choiceField("relationship","Same exact value?",result.same?"same":"different",["same","different"])
    ],["binary16 result = "+decodedResultText(result.fp16)+" (0x"+hex(result.fp16.raw,16)+").","bfloat16 result = "+decodedResultText(result.bf16)+" (0x"+hex(result.bf16.raw,16)+").","decoded results are "+(result.same?"the same exact value.":"different.")],[caseId,result.same?"same":"different",result.fp16.kind+"-"+result.bf16.kind],{rawBits:String(result.fp16.raw)+","+String(result.bf16.raw),exactValue:rationalText(value),valueClass:result.fp16.kind+","+result.bf16.kind,misconception:"same-width-same-layout"});
  };
  DERIVERS.compare_binary16_bfloat16_rounding=function(p){
    var result=binary16Bfloat16Round(parseRational(p.value));
    return{fp16:bits(result.fp16.raw,16),bf16:bits(result.bf16.raw,16),relationship:result.same?"same":"different"};
  };

  GENERATORS.rounding_boundary_result=function(level,rng){
    var format=chooseFormat(level,rng),kind=rng.pick(level===3?["zero","normal"]:level===4?["zero","normal"]:["zero","normal","overflow"]),value,expected;
    if(kind==="zero"){value=div(minSubnormal(format),rat(2));expected="+0";}
    else if(kind==="normal"){value=midpoint(decode(format,rawFromFields(format,0,0,maxF(format))).value,minNormal(format));expected=rationalText(minNormal(format));}
    else{value=add(maxFinite(format),div(ulp(format,Number(maxE(format)-1n)-format.bias),rat(2)));expected="+∞";}
    var rounded=decode(format,roundToFormat(format,value).raw);
    return makeQuestion("rounding_boundary_result",level,format,{value:rationalText(value)},prompt("Determine the nearest-even boundary result.",[formatSpec(format),"Exact positive value: "+rationalText(value),"Boundary: "+kind],"Choose the signed special or enter the exact finite value."),[textField("result","Rounded result",rounded.kind==="zero"?"+0":rounded.kind==="infinity"?"+∞":"rational",rounded.kind==="zero"?"+0":rounded.kind==="infinity"?"+∞":rationalText(rounded.value))],["locate the "+kind+" boundary.","the value is exactly at its midpoint.","nearest-even gives "+expected+"."],[kind],{rawBits:rounded.raw,exactValue:rationalText(value),valueClass:rounded.kind,misconception:"boundary-rounding"});
  };
  DERIVERS.rounding_boundary_result=function(p,format){var d=decode(format,roundToFormat(format,parseRational(p.value)).raw);return{result:d.kind==="zero"?"+0":d.kind==="infinity"?"+∞":rationalText(d.value)};};

  GENERATORS.remove_exponent_bias=function(level,rng){
    var format=chooseFormat(level,rng),inverse=level>=2&&rng.chance(0.5),stored=rng.int(1,Number(maxE(format)-1n)),unbiased=stored-format.bias;
    return makeQuestion("remove_exponent_bias",level,format,{inverse:inverse,stored:stored,unbiased:unbiased},prompt(inverse?"Apply the exponent bias.":"Remove the exponent bias.",[formatSpec(format),inverse?"Desired unbiased exponent: "+unbiased:"Stored exponent: "+(level>=3?bits(stored,format.e):stored)],inverse?"Give stored exponent as an unsigned integer.":"Give the signed unbiased exponent."),[integerField("answer",inverse?"Stored exponent":"Unbiased exponent",inverse?stored:unbiased)],["e = E − bias.",""+(inverse?unbiased+" + "+format.bias:stored+" − "+format.bias)+" = "+(inverse?stored:unbiased)+"."],[inverse?"inverse":"direct","sign-"+(unbiased<0?"negative":"nonnegative")],{fields:{exponent:String(stored)},misconception:"forgot-bias"});
  };
  DERIVERS.remove_exponent_bias=function(p){return{answer:String(p.inverse?p.stored:p.unbiased)};};

  GENERATORS.ulp_spacing=function(level,rng){
    var format=chooseFormat(level,rng),subnormal=level>=3&&rng.chance(0.3),exponent=subnormal?1-format.bias:rng.pick([-3,-1,0,1,3,format.id==="fp32"?20:2]);
    var spacing=subnormal?minSubnormal(format):ulp(format,exponent);
    return makeQuestion("ulp_spacing",level,format,{subnormal:subnormal,exponent:exponent},prompt("Find the adjacent representable spacing.",[formatSpec(format),subnormal?"Region: subnormal":"Normal binade near 2^"+exponent],"Give an exact value; this is spacing at the stated magnitude, not a universal epsilon."),[rationalField("spacing","ULP spacing",spacing)],[subnormal?"spacing = 2^(1−bias−f).":"spacing = 2^(e−(p−1)).","spacing = "+rationalText(spacing)+"."],[subnormal?"subnormal":"normal","e-"+exponent],{exactValue:rationalText(spacing),misconception:"ulp-is-epsilon"});
  };
  DERIVERS.ulp_spacing=function(p,format){return{spacing:rationalText(p.subnormal?minSubnormal(format):ulp(format,p.exponent))};};

  function upwardSpacing(format,value) {
    var raw=encodeExact(format,value,false);
    if(raw===null)throw new Error("spacing value is not exact");
    var next=decode(format,raw+1n);
    if(!next.value)throw new Error("spacing successor is not finite");
    return sub(next.value,value);
  }
  function spacingComparison(value) {
    var fp16Spacing=upwardSpacing(formatById("fp16"),value),bf16Spacing=upwardSpacing(formatById("bf16"),value),ordering=cmp(fp16Spacing,bf16Spacing);
    return{fp16:fp16Spacing,bf16:bf16Spacing,winner:ordering<0?"binary16":ordering>0?"bfloat16":"equal"};
  }
  GENERATORS.compare_binary16_bfloat16_spacing=function(level,rng){
    var format=formatById("bf16"),exponents=level===2?[0,5]:level===3?[-14,-10,0,10]:level===4?[-20,-17,-14,0]:[-24,-20,-17,-14,0,15];
    var exponent=rng.pick(exponents),value=pow2(exponent),result=spacingComparison(value);
    return makeQuestion("compare_binary16_bfloat16_spacing",level,format,{exponent:exponent},prompt("Compare upward spacing at the same exact value.",["Shared value: 2^"+exponent+" = "+rationalText(value),formatSpec(formatById("fp16")),formatSpec(format)],"Give both exact successor gaps; at powers of two, use upward spacing."),[
      rationalField("fp16","binary16 upward spacing",result.fp16),
      rationalField("bf16","bfloat16 upward spacing",result.bf16),
      choiceField("winner","Finer spacing",result.winner,["binary16","bfloat16","equal"])
    ],["binary16 upward spacing = "+rationalText(result.fp16)+".","bfloat16 upward spacing = "+rationalText(result.bf16)+".","finer spacing: "+result.winner+"."],["e-"+exponent,result.winner,exponent<-14?"binary16-subnormal":"shared-normal"],{exactValue:rationalText(value),valueClass:exponent<-14?"subnormal/normal":"normal/normal",misconception:"binary16-always-finer"});
  };
  DERIVERS.compare_binary16_bfloat16_spacing=function(p){
    var result=spacingComparison(pow2(p.exponent));
    return{fp16:rationalText(result.fp16),bf16:rationalText(result.bf16),winner:result.winner};
  };

  GENERATORS.adjacent_values=function(level,rng){
    var format=chooseFormat(level,rng),raw;
    if(level>=3&&rng.chance(0.4))raw=rawFromFields(format,0,1,0);
    else raw=normalRaw(format,rng,false);
    var d=decode(format,raw),direction=rng.pick(["predecessor","successor"]),n=neighbors(format,d.value),target=direction==="predecessor"?n.lower:n.upper;
    if(!target||!target.value)return GENERATORS.adjacent_values(level,rng);
    return makeQuestion("adjacent_values",level,format,{raw:String(raw),direction:direction},prompt("Find the exact "+direction+".",[formatSpec(format),"Starting value: "+rationalText(d.value)+" ("+pattern(format,raw,level>=5?"hex":"bits")+")"],"Enter the adjacent finite value exactly."),[rationalField("value",direction,target.value)],["decode the starting pattern exactly.","step one representable value in numeric order.",""+direction+" = "+rationalText(target.value)+"."],[direction,d.sign?"negative":"positive",d.kind],{rawBits:raw,exactValue:rationalText(target.value),valueClass:target.kind,misconception:"sign-aware-neighbor"});
  };
  DERIVERS.adjacent_values=function(p,format){var d=decode(format,p.raw),n=neighbors(format,d.value),target=p.direction==="predecessor"?n.lower:n.upper;return{value:rationalText(target.value)};};

  GENERATORS.format_extrema=function(level,rng){
    var format=chooseFormat(level,rng),kinds=level===1?["smallest-subnormal","smallest-normal"]:["smallest-subnormal","smallest-normal","largest-finite","normal-exponent-min","normal-exponent-max"],kind=rng.pick(kinds),value,endpoint=null,isExponent=kind.indexOf("exponent")>=0;
    if(kind==="smallest-subnormal")endpoint=minSubnormal(format);
    else if(kind==="smallest-normal")endpoint=minNormal(format);
    else if(kind==="largest-finite")endpoint=maxFinite(format);
    value=endpoint?rationalText(endpoint):kind==="normal-exponent-min"?String(1-format.bias):String(Number(maxE(format)-1n)-format.bias);
    return makeQuestion("format_extrema",level,format,{kind:kind},prompt("Give the requested format endpoint.",[formatSpec(format),"Endpoint: "+kind.replace(/-/g," ")],"Use an exact integer, fraction, or power-of-two form."),[isExponent?integerField("answer","Exact endpoint",value):rationalField("answer","Exact endpoint",endpoint)],["select the boundary field pattern.","decode using the "+(kind.indexOf("subnormal")>=0?"subnormal":"normal")+" rule.","endpoint = "+(endpoint?compactExactText(endpoint):value)+"."],[kind],{exactValue:value,misconception:"range-boundary"});
  };
  DERIVERS.format_extrema=function(p,format){var value=p.kind==="smallest-subnormal"?rationalText(minSubnormal(format)):p.kind==="smallest-normal"?rationalText(minNormal(format)):p.kind==="largest-finite"?rationalText(maxFinite(format)):p.kind==="normal-exponent-min"?String(1-format.bias):String(Number(maxE(format)-1n)-format.bias);return{answer:value};};

  function capabilityComparison(kind,exponent) {
    var fp16=formatById("fp16"),bf16=formatById("bf16"),answer,detail;
    if(kind==="max-finite"){answer="bfloat16";detail="maximum finite: binary16 "+compactExactText(maxFinite(fp16))+", bfloat16 "+compactExactText(maxFinite(bf16));}
    else if(kind==="min-subnormal"){answer="bfloat16";detail="minimum positive subnormal: binary16 "+compactExactText(minSubnormal(fp16))+", bfloat16 "+compactExactText(minSubnormal(bf16));}
    else if(kind==="normal-range"){answer="bfloat16";detail="normal exponents: binary16 −14..15, bfloat16 −126..127";}
    else if(kind==="normal-precision"){answer="binary16";detail="normal precision: binary16 p=11, bfloat16 p=8";}
    else if(kind==="consecutive-integers"){answer="binary16";detail="consecutive integers: binary16 through 2048, bfloat16 through 256";}
    else{var spacing=spacingComparison(pow2(exponent));answer=spacing.winner;detail="at 2^"+exponent+": binary16 spacing "+rationalText(spacing.fp16)+", bfloat16 spacing "+rationalText(spacing.bf16);}
    return{answer:answer,detail:detail};
  }
  GENERATORS.compare_binary16_bfloat16_capability=function(level,rng){
    var format=formatById("bf16"),kinds=level===1?["max-finite","normal-precision"]:level===2?["max-finite","min-subnormal","normal-range","normal-precision","consecutive-integers"]:level===3?["normal-range","normal-precision","consecutive-integers","spacing"]:["max-finite","min-subnormal","normal-range","normal-precision","consecutive-integers","spacing"];
    var kind=rng.pick(kinds),exponents=level>=4?[-20,-17,-14,0,10]:[-14,0,10],exponent=kind==="spacing"?rng.pick(exponents):0,result=capabilityComparison(kind,exponent);
    var title=kind==="max-finite"?"Which format has the larger maximum finite magnitude?":kind==="min-subnormal"?"Which format reaches the smaller positive nonzero magnitude?":kind==="normal-range"?"Which format has the wider normal exponent range?":kind==="normal-precision"?"Which format has greater normal significand precision?":kind==="consecutive-integers"?"Which format represents more consecutive integers exactly?":"Which format has finer upward spacing at 2^"+exponent+"?";
    return makeQuestion("compare_binary16_bfloat16_capability",level,format,{kind:kind,exponent:exponent},prompt(title,[formatSpec(formatById("fp16")),formatSpec(format)],"Choose using exact range, precision, or local-spacing facts."),[choiceField("answer","Format",result.answer,["binary16","bfloat16","equal"])],[result.detail+".","answer: "+result.answer+"."],[kind,kind==="spacing"?"e-"+exponent:"direct",result.answer],{exactValue:null,valueClass:null,misconception:"range-versus-precision"});
  };
  DERIVERS.compare_binary16_bfloat16_capability=function(p){return{answer:capabilityComparison(p.kind,p.exponent).answer};};

  function distinguishes(format,left,right) {
    return roundToFormat(format,left).raw!==roundToFormat(format,right).raw;
  }
  function meetsFormatRequirement(caseId,format) {
    if(caseId==="integers-1000")return (1n<<BigInt(format.p))>=1000n&&cmp(maxFinite(format),rat(1000))>=0;
    if(caseId==="range-2^100")return cmp(maxFinite(format),pow2(100))>=0;
    if(caseId==="range-and-precision")return cmp(maxFinite(format),pow2(100))>=0&&distinguishes(format,rat(1),add(rat(1),pow2(-9)));
    if(caseId==="shared-requirement")return cmp(maxFinite(format),pow2(10))>=0&&distinguishes(format,rat(1),add(rat(1),pow2(-7)));
    return decode(format,roundToFormat(format,pow2(-100)).raw).kind!=="zero";
  }
  function requirementAnswer(caseId) {
    var fp16=meetsFormatRequirement(caseId,formatById("fp16")),bf16=meetsFormatRequirement(caseId,formatById("bf16"));
    return{fp16:fp16,bf16:bf16,answer:fp16&&bf16?"both":fp16?"binary16":bf16?"bfloat16":"neither"};
  }
  GENERATORS.choose_binary16_or_bfloat16=function(level,rng){
    var format=formatById("bf16"),descriptions={
      "integers-1000":"Every integer from 0 through 1000 must be exact.",
      "range-2^100":"The format must represent 2^100 finitely; no finer resolution is required.",
      "range-and-precision":"The same format must represent 2^100 finitely and distinguish 1 from 1+2^-9.",
      "shared-requirement":"The format must represent 2^10 finitely and distinguish 1 from 1+2^-7.",
      "tiny-nonzero":"The exact value 2^-100 must remain finite and nonzero."
    };
    var ids=level===2?["integers-1000","range-2^100"]:level===3?["integers-1000","range-2^100","shared-requirement"]:level===4?Object.keys(descriptions).slice(0,4):Object.keys(descriptions);
    var caseId=rng.pick(ids),result=requirementAnswer(caseId);
    return makeQuestion("choose_binary16_or_bfloat16",level,format,{caseId:caseId},prompt("Choose a format from exact numerical requirements.",[descriptions[caseId]],"Ignore hardware performance; test binary16 and bfloat16 independently."),[choiceField("answer","Satisfying format",result.answer,["binary16","bfloat16","both","neither"])],["binary16: "+(result.fp16?"passes all requirements.":"fails at least one requirement."),"bfloat16: "+(result.bf16?"passes all requirements.":"fails at least one requirement."),"answer: "+result.answer+"."],[caseId,result.answer],{exactValue:null,valueClass:null,misconception:"range-versus-precision-requirement"});
  };
  DERIVERS.choose_binary16_or_bfloat16=function(p){return{answer:requirementAnswer(p.caseId).answer};};

  function isExact(format,value){return encodeExact(format,value,false)!==null;}
  GENERATORS.rational_exactness=function(level,rng){
    var format=chooseFormat(level,rng),cases=[rat(1,10),rat(3,8),rat(1,2),rat(7,16),mul(minSubnormal(format),rat(3)),div(minSubnormal(format),rat(2)),add(maxFinite(format),ulp(format,Number(maxE(format)-1n)-format.bias))],value=rng.pick(cases),exact=isExact(format,value);
    return makeQuestion("rational_exactness",level,format,{value:rationalText(value)},prompt("Is this rational exactly representable?",[formatSpec(format),"Value: "+rationalText(value)],"Consider denominator, precision alignment, and range."),[choiceField("answer","Exactly representable?",exact?"yes":"no",["yes","no"])],["reduce the rational: "+rationalText(value)+".",exact?"it lands on the format lattice.":"it fails denominator, spacing alignment, or range.","answer: "+(exact?"yes":"no")+"."],[exact?"exact":"inexact",value.d&(value.d-1n)?"denominator-trap":"precision-or-range"],{exactValue:rationalText(value),misconception:"power-of-two-is-sufficient"});
  };
  DERIVERS.rational_exactness=function(p,format){return{answer:isExact(format,parseRational(p.value))?"yes":"no"};};

  GENERATORS.integer_exactness=function(level,rng){
    var format=chooseFormat(level,rng),threshold=1n<<BigInt(format.p),values=[threshold-1n,threshold,threshold+1n,threshold+2n],value=rng.pick(values),exact=isExact(format,rat(value));
    return makeQuestion("integer_exactness",level,format,{value:String(value)},prompt("Is this integer exactly representable?",[formatSpec(format),"Integer: "+value],"Use the spacing in its binade, not only its size."),[choiceField("answer","Exactly representable?",exact?"yes":"no",["yes","no"])],["consecutive-integer threshold: 2^p = "+threshold+".","local lattice test for "+value+": "+(exact?"aligned":"not aligned")+".","answer: "+(exact?"yes":"no")+"."],[value===threshold?"threshold":value===threshold+1n?"one-above":"nearby",exact?"exact":"gap"],{exactValue:String(value),misconception:"integer-threshold-off-by-one"});
  };
  DERIVERS.integer_exactness=function(p,format){return{answer:isExact(format,rat(p.value))?"yes":"no"};};

  GENERATORS.largest_consecutive_integer=function(level,rng){
    var compare=level===4,format=compare?formatById("bf16"):level===3?rng.pick([formatById("fp16"),formatById("bf16")]):chooseFormat(level,rng);
    if(compare){
      var fp16=1n<<BigInt(formatById("fp16").p),bf16=1n<<BigInt(format.p);
      return makeQuestion("largest_consecutive_integer",level,format,{compare:true},prompt("Give both consecutive-integer boundaries.",[formatSpec(formatById("fp16")),formatSpec(format)],"For each format, find the largest N such that every integer from 0 through N is exact."),[integerField("fp16","binary16 N",fp16),integerField("bf16","bfloat16 N",bf16)],["binary16: 2^11 = "+fp16+".","bfloat16: 2^8 = "+bf16+".","the next odd integer is the first missing one in each format."],["comparison","2048-versus-256"],{exactValue:String(fp16)+","+String(bf16),misconception:"fraction-bits-only"});
    }
    var threshold=1n<<BigInt(format.p);
    return makeQuestion("largest_consecutive_integer",level,format,{compare:false},prompt("Find the consecutive-integer boundary.",[formatSpec(format)],"Give the largest N such that every integer from 0 through N is exactly representable."),[integerField("answer","Largest consecutive N",threshold)],["precision p = "+format.p+".","N = 2^p = "+threshold+".","N+1 = "+(threshold+1n)+" is not representable, although some larger integers are."],["single",format.id,"p-"+format.p],{exactValue:String(threshold),misconception:"largest-finite-versus-consecutive"});
  };
  DERIVERS.largest_consecutive_integer=function(p,format){
    if(p.compare)return{fp16:String(1n<<BigInt(formatById("fp16").p)),bf16:String(1n<<BigInt(formatById("bf16").p))};
    return{answer:String(1n<<BigInt(format.p))};
  };

  function parseRational(text) {
    text=String(text).trim().replace(/\s+/g," ");
    var power=text.match(/^(-?\d+)?\s*(?:×|\*)?\s*2\^(-?\d+)$/);
    if(power){
      var coefficient=power[1]===undefined||power[1]===""?1n:BigInt(power[1]),powerValue=pow2(Number(power[2]));
      return mul(rat(coefficient),powerValue);
    }
    var signedPower=text.match(/^(-)2\^(-?\d+)$/);
    if(signedPower)return neg(pow2(Number(signedPower[2])));
    var mixed=text.match(/^(-?\d+) ([0-9]+)\/([0-9]+)$/);
    if(mixed){var whole=BigInt(mixed[1]),den=BigInt(mixed[3]);return rat(whole*den+(whole<0n?-1n:1n)*BigInt(mixed[2]),den);}
    var fraction=text.match(/^(-?\d+)\/(\d+)$/); if(fraction)return rat(fraction[1],fraction[2]);
    var decimal=text.match(/^(-?)(\d+)(?:\.(\d+))?$/); if(!decimal)return null;
    var tail=decimal[3]||"",number=BigInt(decimal[2]+tail);if(decimal[1])number=-number;return rat(number,10n**BigInt(tail.length));
  }
  function operation(a,b,op){return op==="+"?add(a,b):op==="-"?sub(a,b):mul(a,b);}
  GENERATORS.operation_exactness=function(level,rng){
    var format=chooseFormat(level,rng),op=level===3?"+":rng.pick(["+","-","×"]),a=rng.pick([rat(1),rat(1,2),rat(3,2),pow2(format.p)]),b=rng.pick([rat(1,4),rat(1,1n<<BigInt(format.p)),rat(3,2),rat(-1)]),result=operation(a,b,op),exact=isExact(format,result);
    return makeQuestion("operation_exactness",level,format,{a:rationalText(a),b:rationalText(b),op:op},prompt("Is the exact mathematical result representable?",[formatSpec(format),rationalText(a)+" "+op+" "+rationalText(b)],"Evaluate exactly before considering stored rounding."),[choiceField("answer","Exact result representable?",exact?"yes":"no",["yes","no"])],["mathematical result = "+rationalText(result)+".","format lattice test: "+(exact?"exact":"inexact")+"."],[op,exact?"exact":"inexact"],{exactValue:rationalText(result),misconception:"rounded-versus-mathematical-result"});
  };
  DERIVERS.operation_exactness=function(p,format){return{answer:isExact(format,operation(parseRational(p.a),parseRational(p.b),p.op))?"yes":"no"};};

  function additionCase(format,rng,oddBase) {
    var minimum=1-format.bias,maximum=Number(maxE(format)-1n)-format.bias;
    var exponentChoices=[0,1,format.id==="fp32"?20:2].filter(function(value){return value>=minimum&&value<=maximum&&(!oddBase||value<maximum);});
    if(!exponentChoices.length)exponentChoices=[minimum];
    var exponent=rng.pick(exponentChoices),baseRaw=rawFromFields(format,0,exponent+format.bias,oddBase?1:0),base=decode(format,baseRaw),spacing=ulp(format,exponent);
    var multiplier=rng.pick([rat(1,4),rat(1,2),rat(3,4),rat(1)]),increment=mul(spacing,multiplier);
    return{baseRaw:baseRaw,base:base,increment:increment,spacing:spacing,result:decode(format,roundToFormat(format,add(base.value,increment)).raw)};
  }
  GENERATORS.addition_changes_value=function(level,rng){
    var format=chooseFormat(level,rng),c=additionCase(format,rng,level>=3&&rng.chance(.5)),changes=c.result.raw!==c.baseRaw;
    return makeQuestion("addition_changes_value",level,format,{baseRaw:String(c.baseRaw),increment:rationalText(c.increment)},prompt("Will the stored value change after this addition?",[formatSpec(format),"x = "+rationalText(c.base.value),"exact increment y = "+rationalText(c.increment),"operation: round(x+y)"],"Use nearest-even, including parity at a half-ULP tie."),[choiceField("answer","Stored value changes?",changes?"yes":"no",["yes","no"])],["local spacing = "+rationalText(c.spacing)+".","exact sum = "+rationalText(add(c.base.value,c.increment))+".","rounded result = "+rationalText(c.result.value)+"; "+(changes?"changes":"does not change")+"."],[changes?"change":"absorbed",cmp(c.increment,div(c.spacing,rat(2)))===0?"tie":"non-tie"],{rawBits:c.baseRaw,exactValue:rationalText(add(c.base.value,c.increment)),valueClass:"normal",misconception:"half-ulp-always-changes"});
  };
  DERIVERS.addition_changes_value=function(p,format){var base=decode(format,p.baseRaw),result=roundToFormat(format,add(base.value,parseRational(p.increment)));return{answer:result.raw!==base.raw?"yes":"no"};};

  GENERATORS.rounded_addition_result=function(level,rng){
    var format=chooseFormat(level,rng),c=additionCase(format,rng,level>=3&&rng.chance(.5)),subtract=level>=4&&rng.chance(.3),increment=subtract?neg(c.increment):c.increment,exact=add(c.base.value,increment),rounded=decode(format,roundToFormat(format,exact).raw);
    return makeQuestion("rounded_addition_result",level,format,{baseRaw:String(c.baseRaw),increment:rationalText(increment)},prompt("Give the stored result of this format operation.",[formatSpec(format),rationalText(c.base.value)+(increment.n<0n?" − ":" + ")+rationalText(absRat(increment))],"Compute exactly, then round once to nearest-even."),[rationalField("result","Stored finite result",rounded.value)],["exact result = "+rationalText(exact)+".","round once on the "+format.label+" lattice.","stored result = "+rationalText(rounded.value)+"."],[subtract?"subtraction":"addition",rounded.raw===c.baseRaw?"absorbed":"changed"],{rawBits:rounded.raw,exactValue:rationalText(exact),valueClass:rounded.kind,misconception:"double-rounding"});
  };
  DERIVERS.rounded_addition_result=function(p,format){var base=decode(format,p.baseRaw),d=decode(format,roundToFormat(format,add(base.value,parseRational(p.increment))).raw);return{result:rationalText(d.value)};};

  GENERATORS.absorption_threshold=function(level,rng){
    var format=chooseFormat(level,rng),c=additionCase(format,rng,level>=4),candidates=[div(c.spacing,rat(4)),div(c.spacing,rat(2)),c.spacing],first=candidates.find(function(increment){return roundToFormat(format,add(c.base.value,increment)).raw!==c.baseRaw;});
    return makeQuestion("absorption_threshold",level,format,{baseRaw:String(c.baseRaw),candidates:candidates.map(rationalText)},prompt("Choose the smallest positive increment that changes the stored value.",[formatSpec(format),"Base x = "+rationalText(c.base.value),"Candidates: "+candidates.map(rationalText).join(", ")],"Candidates are ordered by magnitude."),[choiceField("increment","First-changing increment",rationalText(first),candidates.map(rationalText))],candidates.map(function(increment){return rationalText(increment)+" → "+(roundToFormat(format,add(c.base.value,increment)).raw===c.baseRaw?"no change":"changes");}),["parity-"+(c.base.fraction%2n?"odd":"even")],{rawBits:c.baseRaw,exactValue:rationalText(first),valueClass:"normal",misconception:"half-ulp-parity"});
  };
  DERIVERS.absorption_threshold=function(p,format){var base=decode(format,p.baseRaw),first=p.candidates.map(parseRational).find(function(increment){return roundToFormat(format,add(base.value,increment)).raw!==base.raw;});return{increment:rationalText(first)};};

  function roundedBinary(format,a,b,op){return decode(format,roundToFormat(format,operation(a,b,op)).raw).value;}
  GENERATORS.non_associativity=function(level,rng){
    var format=chooseFormat(level,rng),large=level===5&&format.id==="fp32"?rat(16777216):pow2(format.p),small=rat(1),negative=neg(large);
    var left=roundedBinary(format,roundedBinary(format,large,small,"+"),negative,"+"),right=roundedBinary(format,large,roundedBinary(format,small,negative,"+"),"+");
    if(cmp(left,right)===0)return GENERATORS.non_associativity(level,new Rng(rng.next()+1));
    return makeQuestion("non_associativity",level,format,{large:rationalText(large)},prompt("Evaluate both explicitly parenthesized format operations.",[formatSpec(format),"A: ("+rationalText(large)+" + 1) + ("+rationalText(negative)+")","B: "+rationalText(large)+" + (1 + "+rationalText(negative)+")"],"Round after each shown addition; no reassociation."),[rationalField("a","Result A",left),rationalField("b","Result B",right)],["A rounds its first sum, then gives "+rationalText(left)+".","B rounds its inner sum, then gives "+rationalText(right)+".","The results differ because each intermediate is stored."],["landmark-"+format.id],{exactValue:rationalText(left)+","+rationalText(right),misconception:"real-arithmetic-associativity"});
  };
  DERIVERS.non_associativity=function(p,format){var large=parseRational(p.large),negative=neg(large);return{a:rationalText(roundedBinary(format,roundedBinary(format,large,rat(1),"+"),negative,"+")),b:rationalText(roundedBinary(format,large,roundedBinary(format,rat(1),negative,"+"),"+"))};};

  GENERATORS.special_arithmetic_result=function(level,rng){
    var format=chooseFormat(level,rng),cases=[
      {id:"overflow",expression:"largest finite + largest finite",result:"+∞",rule:"finite overflow rounds to positive infinity"},
      {id:"inf-cancel",expression:"+∞ + (−∞)",result:"NaN",rule:"opposite infinities in addition are invalid"},
      {id:"zero-div-zero",expression:"+0 / +0",result:"NaN",rule:"zero divided by zero is invalid"},
      {id:"negative-over-infinity",expression:"−1 / +∞",result:"-0",rule:"finite nonzero divided by infinity is signed zero"}
    ],selected=rng.pick(level===3?[cases[0],cases[3]]:level===4?cases.slice(0,3):cases);
    return makeQuestion("special_arithmetic_result",level,format,{caseId:selected.id},prompt("Classify the explicitly modeled special result.",[formatSpec(format),"Operation: "+selected.expression],"No exception flags or NaN payload details are in scope."),[choiceField("result","Result",selected.result,["+∞","-∞","+0","-0","NaN"])],[selected.rule+".","result: "+selected.result+"."],[selected.id],{valueClass:selected.result==="NaN"?"NaN":selected.result.indexOf("∞")>=0?"infinity":"zero",misconception:"ordinary-algebra-on-specials"});
  };
  DERIVERS.special_arithmetic_result=function(p){return{result:{overflow:"+∞","inf-cancel":"NaN","zero-div-zero":"NaN","negative-over-infinity":"-0"}[p.caseId]};};

  function normalizeBits(text,format){
    var value=String(text||"").trim().replace(/[\s_]/g,"");
    if(/^0b/i.test(value))value=value.slice(2);
    if(/^[01]+$/.test(value)&&value.length===format.bits)return value;
    if(format.bits>=16){if(/^0x/i.test(value))value=value.slice(2);if(new RegExp("^[0-9a-fA-F]{"+Math.ceil(format.bits/4)+"}$").test(value))return bits(BigInt("0x"+value),format.bits);}
    return null;
  }
  function normalizeField(field,text){
    if(field.kind==="choice")return String(text||"").trim();
    if(field.kind==="bits")return normalizeBits(text,formatById(field.formatId));
    if(field.kind==="fieldbits"){var value=String(text||"").replace(/[\s_]/g,"");return new RegExp("^[01]{"+field.width+"}$").test(value)?value:null;}
    if(field.kind==="integer"){var parsed=parseRational(text);return parsed&&parsed.d===1n?String(parsed.n):null;}
    if(field.kind==="rational"){var rationalValue=parseRational(text);return rationalValue?rationalText(rationalValue):null;}
    if(field.kind==="special"){var special=String(text||"").trim().replace(/inf(?:inity)?/i,"∞").replace(/^∞$/,"+∞");return special;}
    return String(text||"").trim();
  }
  function validateQuestion(question){
    ["format","rawBits","exactValue","valueClass","fields","roundingMode","semanticFamily","misconception","structuralSignature"].forEach(function(key){if(question[key]===undefined)throw new Error("Missing metadata "+key);});
    if(!GENERATORS[question.familyId]||!DERIVERS[question.familyId])throw new Error("Missing implementation "+question.familyId);
    if(!question.answer.fields.length||!question.workedSteps.length||question.workedSteps.length>4)throw new Error("Invalid answer/worked steps");
    var derived=DERIVERS[question.familyId](question.parameters,formatById(question.format));
    question.answer.fields.forEach(function(field){
      if(!Object.prototype.hasOwnProperty.call(derived,field.id))throw new Error("Missing derivation "+field.id);
      if(String(derived[field.id])!==String(field.value))throw new Error("Derivation mismatch "+field.id+": "+derived[field.id]+" vs "+field.value);
      if(field.kind==="choice"&&field.options.filter(function(option){return option.value===field.value;}).length!==1)throw new Error("Choice uniqueness");
    });
    if(/\{[^}]+\}/.test([question.prompt.title].concat(question.prompt.rows,[question.prompt.note]).join(" ")))throw new Error("Placeholder");
  }
  function generateQuestion(familyId,level,seed,ignoreHistory){
    var family=familyById(familyId);if(!family.levels.includes(level))level=family.levels.reduce(function(best,candidate){return Math.abs(candidate-level)<Math.abs(best-level)?candidate:best;},family.levels[0]);
    var rng=new Rng(seed),question,tries=0;
    do{question=localizeQuestion(GENERATORS[family.id](level,rng));question.parameters.seed=seed>>>0;tries+=1;}while(!ignoreHistory&&tries<100&&(recentSignatures.includes(question.structuralSignature)||recentPrompts.includes(promptKey(question))));
    validateQuestion(question);return question;
  }
  function promptKey(question){return[question.prompt.title].concat(question.prompt.rows,[question.prompt.note]).join("\n");}
  function checkQuestion(answers,question){
    var parts={},correct=true;
    question.answer.fields.forEach(function(field){var actual=normalizeField(field,answers[field.id]),ok=actual!==null&&actual===field.value;parts[field.id]={label:field.label,actual:actual,expected:field.value,correct:ok};if(!ok)correct=false;});
    return{correct:correct,parts:parts,expected:question.answer.fields.map(function(field){return field.label+" = "+displayField(field);}).join("; "),diagnosis:diagnose(question,parts)};
  }
  function displayField(field){
    if(field.kind==="bits"){var format=formatById(field.formatId),raw=BigInt("0b"+field.value);return format.bits>=16?"0x"+hex(raw,format.bits):groupedBits(format,raw);}
    if(field.kind==="choice"){var option=field.options.find(function(item){return item.value===field.value;});return option?option.label:field.value;}
    if(field.kind==="rational"&&field.display)return field.display;
    return field.value;
  }
  function diagnose(question,parts){
    var correct=Object.keys(parts).filter(function(id){return parts[id].correct;}),wrong=Object.keys(parts).filter(function(id){return!parts[id].correct;});
    if(correct.length&&wrong.length)return localizeGeneratedString(correct.map(function(id){return parts[id].label;}).join(", ")+" is correct. Recheck "+wrong.map(function(id){return parts[id].label;}).join(", ")+".");
    if(question.familyId.indexOf("classify")>=0)return localizeGeneratedString("Inspect exponent and fraction reserved patterns; sign does not determine the class.");
    if(question.familyId.indexOf("subnormal")>=0)return localizeGeneratedString("Subnormals have no hidden one and use effective exponent 1−bias.");
    if(question.familyId.indexOf("decode")>=0||question.familyId.indexOf("encode")>=0)return localizeGeneratedString("Keep sign, biased exponent, hidden bit, and exact power-of-two scaling separate.");
    if(question.familyId.indexOf("exactness")>=0||question.familyId==="largest_consecutive_integer")return localizeGeneratedString("Check reduced denominator, local spacing alignment, range, and the 2^p consecutive-integer boundary.");
    if(question.familyId.indexOf("binary16_bfloat16")>=0||question.familyId==="choose_binary16_or_bfloat16")return localizeGeneratedString("Test binary16 and bfloat16 independently; separate exponent range from significand precision.");
    if(["round_to_format","round_to_bfloat16","rounding_boundary_result","addition_changes_value","rounded_addition_result","absorption_threshold"].includes(question.familyId))return localizeGeneratedString("Compare exact neighbors and apply nearest-even; a half-ULP tie depends on retained parity.");
    return localizeGeneratedString("Recheck the exact field relationship and target-format rounding.");
  }

  function defaultCell(){return{attempts:0,correct:0,streak:0,recent:[],totalMs:0,lastAt:0,mastery:0,dimensions:{},misconceptions:{}};}
  function defaultProgress(){var enabled={};CATEGORIES.forEach(function(c){enabled[c.id]=true;});return{version:2,activeView:"practice",settings:{adaptive:true,enabledCategories:enabled},manual:{familyId:FAMILIES[0].id,level:1},cells:{},history:[],legacyCategoryTotals:{}};}
  function migrateLegacy(legacy){
    var next=defaultProgress();if(!legacy||typeof legacy!=="object")return next;
    next.activeView=legacy.activeView||"practice";
    if(legacy.settings&&Array.isArray(legacy.settings.enabledCategories)){CATEGORIES.forEach(function(c){next.settings.enabledCategories[c.id]=legacy.settings.enabledCategories.includes(c.id);});}
    CATEGORIES.forEach(function(category){var total={attempts:0,correct:0,totalMs:0};LEVELS.forEach(function(level){var cell=legacy.cells&&legacy.cells[category.id+":"+level];if(cell){total.attempts+=Number(cell.attempts)||0;total.correct+=Number(cell.correct)||0;total.totalMs+=Number(cell.totalMs)||0;}});if(total.attempts)next.legacyCategoryTotals[category.id]=total;});
    return next;
  }
  function ensureProgress(value){var base=defaultProgress();if(!value||value.version!==2)return base;var merged=Object.assign(base,value);merged.settings=Object.assign(base.settings,value.settings||{});merged.manual=Object.assign(base.manual,value.manual||{});merged.cells=value.cells||{};merged.history=Array.isArray(value.history)?value.history:[];merged.legacyCategoryTotals=value.legacyCategoryTotals||{};if(!FAMILIES.some(function(f){return f.id===merged.manual.familyId;}))merged.manual=base.manual;return merged;}
  function loadProgress(){try{var stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(stored)return ensureProgress(stored);var legacy=JSON.parse(localStorage.getItem(LEGACY_KEY)||"null");return migrateLegacy(legacy);}catch(error){return defaultProgress();}}
  function saveProgress(){localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));}
  function cellKey(familyId,level){return familyId+":"+level;}
  function cellFor(familyId,level){var key=cellKey(familyId,level);if(!progress.cells[key])progress.cells[key]=defaultCell();return progress.cells[key];}
  function recentAccuracy(cell){return cell.recent.length?cell.recent.filter(Boolean).length/cell.recent.length:0;}
  function aggregate(){
    var result={attempts:0,correct:0,totalMs:0,active:0,mastery:0,count:0};
    Object.keys(progress.legacyCategoryTotals||{}).forEach(function(id){var c=progress.legacyCategoryTotals[id];result.attempts+=c.attempts;result.correct+=c.correct;result.totalMs+=c.totalMs;});
    FAMILIES.forEach(function(f){f.levels.forEach(function(level){var c=cellFor(f.id,level);result.attempts+=c.attempts;result.correct+=c.correct;result.totalMs+=c.totalMs;result.mastery+=c.mastery;result.count+=1;if(c.attempts)result.active+=1;});});
    result.accuracy=result.attempts?result.correct/result.attempts*100:0;result.mastery=result.count?result.mastery/result.count:0;return result;
  }
  function eligibleFamilies(){return FAMILIES.filter(function(f){return progress.settings.enabledCategories[f.categoryId]!==false;});}
  function chooseAdaptive(){
    var candidates=[];eligibleFamilies().forEach(function(f){var available=f.levels.filter(function(level,index){if(!index)return true;var prior=cellFor(f.id,f.levels[index-1]);return prior.attempts>=5&&recentAccuracy(prior)>=.8;});var level=available[available.length-1],cell=cellFor(f.id,level);candidates.push({family:f,level:level,cell:cell});});
    if(!candidates.length)candidates=[{family:FAMILIES[0],level:1,cell:cellFor(FAMILIES[0].id,1)}];
    candidates.sort(function(a,b){return a.cell.mastery-b.cell.mastery||a.cell.attempts-b.cell.attempts;});
    var roll=Math.random();if(roll<.45)return candidates[Math.floor(Math.random()*Math.min(6,candidates.length))];if(roll<.7){var practiced=candidates.filter(function(c){return c.cell.attempts>=5;});return practiced.length?practiced[Math.floor(Math.random()*practiced.length)]:candidates[0];}if(roll<.9){var missed=candidates.filter(function(c){return c.cell.recent.length&&recentAccuracy(c.cell)<.8;});return missed.length?missed[Math.floor(Math.random()*missed.length)]:candidates[0];}return candidates[Math.floor(Math.random()*candidates.length)];
  }
  function startQuestion(){
    resume();var selected=progress.settings.adaptive?chooseAdaptive():{family:familyById(progress.manual.familyId),level:progress.manual.level};
    currentQuestion=generateQuestion(selected.family.id,selected.level,(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0,false);
    recentSignatures.push(currentQuestion.structuralSignature);recentPrompts.push(promptKey(currentQuestion));recentSignatures=recentSignatures.slice(-20);recentPrompts=recentPrompts.slice(-100);
    startedAt=Date.now();pausedMs=0;answered=false;renderAll();if(activeInput&&window.matchMedia&&window.matchMedia("(pointer: fine)").matches)activeInput.focus();
  }
  function renderPrompt(){
    elements.questionPrompt.innerHTML="";
    var title=document.createElement("div");title.className="prompt-title";title.textContent=currentQuestion.prompt.title;elements.questionPrompt.appendChild(title);
    currentQuestion.prompt.rows.filter(Boolean).forEach(function(row){var line=document.createElement("div");line.className="prompt-row";line.textContent=row;elements.questionPrompt.appendChild(line);});
    var note=document.createElement("div");note.className="prompt-note";note.textContent=currentQuestion.prompt.note;elements.questionPrompt.appendChild(note);
  }
  function renderAnswerControls(){
    elements.answerControls.innerHTML="";activeInput=null;
    currentQuestion.answer.fields.forEach(function(field,index){var wrapper=document.createElement("div");wrapper.className="answer-control";var label=document.createElement("label");label.htmlFor="answer-"+field.id;label.textContent=field.label;wrapper.appendChild(label);var control;
      if(field.kind==="choice"){control=document.createElement("select");var blank=document.createElement("option");blank.value="";blank.textContent=t("practice.choose","Choose…");control.appendChild(blank);field.options.forEach(function(option){var node=document.createElement("option");node.value=option.value;node.textContent=option.label;control.appendChild(node);});}
      else{control=document.createElement("input");control.type="text";control.autocomplete="off";control.spellcheck=false;control.inputMode=field.kind==="integer"?"numeric":"text";control.addEventListener("focus",function(){activeInput=control;});if(index===0)activeInput=control;}
      control.id="answer-"+field.id;control.dataset.answerField=field.id;wrapper.appendChild(control);elements.answerControls.appendChild(wrapper);
    });
  }
  function renderQuestion(){
    if(!currentQuestion)return;var family=familyById(currentQuestion.familyId),cell=cellFor(family.id,currentQuestion.level);
    elements.questionCategory.textContent=categoryById(family.categoryId).title;elements.questionFamily.textContent=family.title;elements.questionLevel.textContent=t("practice.level","Level")+" "+currentQuestion.level;elements.questionMastery.textContent=Math.round(cell.mastery)+"% "+t("practice.masterySuffix","mastery");
    renderPrompt();renderAnswerControls();elements.feedback.className="feedback hidden";elements.submitBtn.disabled=false;elements.nextBtn.classList.add("hidden");elements.skipBtn.classList.remove("hidden");elements.answerKeypad.classList.toggle("hidden",currentQuestion.answer.fields.every(function(field){return field.kind==="choice";}));
  }
  function renderSelectors(){
    elements.categorySelect.innerHTML="";CATEGORIES.forEach(function(c){var o=document.createElement("option");o.value=c.id;o.textContent=c.title;elements.categorySelect.appendChild(o);});
    var family=progress.settings.adaptive&&currentQuestion?familyById(currentQuestion.familyId):familyById(progress.manual.familyId),shownLevel=progress.settings.adaptive&&currentQuestion?currentQuestion.level:progress.manual.level;elements.categorySelect.value=family.categoryId;elements.familySelect.innerHTML="";familiesForCategory(family.categoryId).forEach(function(f){var o=document.createElement("option");o.value=f.id;o.textContent=f.title;elements.familySelect.appendChild(o);});elements.familySelect.value=family.id;
    elements.levelSelect.innerHTML="";family.levels.forEach(function(level){var o=document.createElement("option");o.value=level;o.textContent=t("practice.level","Level")+" "+level;elements.levelSelect.appendChild(o);});elements.levelSelect.value=shownLevel;
    elements.categorySelect.disabled=progress.settings.adaptive;elements.familySelect.disabled=progress.settings.adaptive;elements.levelSelect.disabled=progress.settings.adaptive;elements.adaptiveModeBtn.classList.toggle("secondary-active",progress.settings.adaptive);elements.manualModeBtn.classList.toggle("secondary-active",!progress.settings.adaptive);
  }
  function renderSummary(){
    var totals=aggregate();elements.summaryMastery.textContent=Math.round(totals.mastery)+"%";elements.summaryAccuracy.textContent=Math.round(totals.accuracy)+"%";elements.summaryAttempts.textContent=totals.attempts;
    if(currentQuestion){var c=cellFor(currentQuestion.familyId,currentQuestion.level);elements.metricMastery.textContent=Math.round(c.mastery)+"%";elements.metricAccuracy.textContent=(c.attempts?Math.round(c.correct/c.attempts*100):0)+"%";elements.metricStreak.textContent=c.streak;elements.metricAvgTime.textContent=c.attempts?Math.round(c.totalMs/c.attempts/100)/10+"s":"0s";}
  }
  function renderMatrix(){
    var html='<table><thead><tr><th>Family</th>'+LEVELS.map(function(l){return"<th>L"+l+"</th>";}).join("")+"</tr></thead><tbody>";
    CATEGORIES.forEach(function(category){html+='<tr class="matrix-heading"><td colspan="6">'+category.title+"</td></tr>";familiesForCategory(category.id).forEach(function(f){html+="<tr><td>"+f.title+'<span class="subcategory-label">'+f.subcategory+"</span></td>";LEVELS.forEach(function(level){if(!f.levels.includes(level)){html+='<td class="unavailable-cell">—</td>';return;}var c=cellFor(f.id,level);html+='<td><button class="level-button '+(c.mastery>=70?"ready":c.attempts?"weak":"")+'" data-family="'+f.id+'" data-level="'+level+'"><strong>'+Math.round(c.mastery)+'%</strong><span>'+c.attempts+" tries</span></button></td>";});html+="</tr>";});});elements.matrix.innerHTML=html+"</tbody></table>";
  }
  function renderStats(){
    var totals=aggregate();elements.statTotalAttempts.textContent=totals.attempts;elements.statTotalCorrect.textContent=totals.correct;elements.statTotalTime.textContent=Math.round(totals.totalMs/60000)+"m";elements.statActiveCells.textContent=totals.active;
    var cells=[];FAMILIES.forEach(function(f){f.levels.forEach(function(level){var c=cellFor(f.id,level);if(c.attempts)cells.push({f:f,level:level,c:c});});});cells.sort(function(a,b){return a.c.mastery-b.c.mastery;});
    function list(items){return items.length?items.map(function(item){return'<button class="list-item" data-family="'+item.f.id+'" data-level="'+item.level+'"><strong>'+item.f.title+" · L"+item.level+"</strong><span>"+Math.round(item.c.mastery)+"% mastery · "+item.c.attempts+" tries</span></button>";}).join(""):'<div class="list-item"><strong>'+t("stats.noAttemptsYet","No attempts yet")+"</strong></div>";}
    elements.weakList.innerHTML=list(cells.slice(0,5));elements.strongList.innerHTML=list(cells.slice().reverse().slice(0,5));
  }
  function renderLearn(){
    elements.learnGrid.innerHTML=CATEGORIES.map(function(category){return'<section><div class="section-head"><h2>'+category.title+'</h2></div><div class="learn-category-grid">'+familiesForCategory(category.id).map(function(f){return'<article class="learn-card" id="learn-'+f.id+'"><h3>'+f.title+'</h3><p>'+f.learn+'</p><code>'+formatSpec(FORMATS[Math.min(2,FORMATS.length-1)])+'</code></article>';}).join("")+"</div></section>";}).join("");
  }
  function renderSettings(){
    elements.enabledCategories.innerHTML=CATEGORIES.map(function(c){return'<label class="check-row"><input type="checkbox" data-enabled="'+c.id+'" '+(progress.settings.enabledCategories[c.id]!==false?"checked":"")+"><span>"+c.title+"</span></label>";}).join("");
  }
  function renderAll(){renderQuestion();renderSelectors();renderSummary();renderMatrix();renderStats();renderLearn();renderSettings();}
  function collectAnswers(){var result={};document.querySelectorAll("[data-answer-field]").forEach(function(control){result[control.dataset.answerField]=control.value;});return result;}
  function submit(event){
    if(event)event.preventDefault();if(answered||pauseStartedAt)return;var result=checkQuestion(collectAnswers(),currentQuestion),duration=Date.now()-startedAt-pausedMs,cell=cellFor(currentQuestion.familyId,currentQuestion.level);
    cell.attempts+=1;cell.correct+=result.correct?1:0;cell.streak=result.correct?cell.streak+1:0;cell.recent=cell.recent.concat([result.correct]).slice(-10);cell.totalMs+=duration;cell.lastAt=Date.now();cell.mastery=Math.round(Math.min(1,cell.attempts/5)*recentAccuracy(cell)*100);if(!result.correct)cell.misconceptions[currentQuestion.misconception]=(cell.misconceptions[currentQuestion.misconception]||0)+1;
    progress.history.push({at:Date.now(),familyId:currentQuestion.familyId,format:currentQuestion.format,level:currentQuestion.level,seed:currentQuestion.parameters.seed,correct:result.correct,elapsedMs:duration,signature:currentQuestion.structuralSignature});progress.history=progress.history.slice(-300);saveProgress();answered=true;
    elements.feedback.className="feedback "+(result.correct?"correct":"incorrect");elements.feedback.innerHTML="<strong>"+(result.correct?t("messages.correct","Correct"):t("messages.notQuite","Not quite"))+"</strong>"+(!result.correct?"<div>"+result.diagnosis+"</div><div>"+t("messages.expected","Expected")+": "+result.expected+"</div>":"")+'<div class="worked-route">'+currentQuestion.workedSteps.join(" → ")+"</div>"+(currentQuestion.interpretation?'<div class="interpretation">'+currentQuestion.interpretation+"</div>":"")+'<span class="feedback-time">'+t("messages.time","Time")+": "+Math.round(duration/100)/10+"s</span>";
    elements.submitBtn.disabled=true;elements.skipBtn.classList.add("hidden");elements.nextBtn.classList.remove("hidden");renderSummary();renderMatrix();renderStats();
  }
  function setManual(familyId,level){var f=familyById(familyId);progress.settings.adaptive=false;progress.manual={familyId:f.id,level:f.levels.includes(level)?level:f.levels[0]};saveProgress();startQuestion();}
  function setView(name){progress.activeView=name;saveProgress();document.querySelectorAll(".view").forEach(function(v){v.classList.toggle("active",v.id==="view-"+name);});document.querySelectorAll("[data-view]").forEach(function(b){b.classList.toggle("active",b.dataset.view===name);});}
  function pause(){if(pauseStartedAt||answered)return;pauseStartedAt=Date.now();elements.practiceMain.classList.add("paused");}
  function resume(){if(!pauseStartedAt)return;pausedMs+=Date.now()-pauseStartedAt;pauseStartedAt=0;elements.practiceMain.classList.remove("paused");}
  function keypad(event){var button=event.target.closest("button");if(!button)return;if(button.dataset.keypadAction==="submit"){submit();return;}if(button.dataset.keypadAction==="next"){answered?startQuestion():submit();return;}if(!activeInput)return;if(button.dataset.keypadAction==="clear")activeInput.value="";else if(button.dataset.keypadAction==="backspace")activeInput.value=activeInput.value.slice(0,-1);else if(button.dataset.keypadInsert)activeInput.value+=button.dataset.keypadInsert;}
  function exportData(){elements.dataBox.value=JSON.stringify(progress,null,2);}
  function importData(){try{progress=ensureProgress(JSON.parse(elements.dataBox.value));saveProgress();startQuestion();}catch(error){alert(t("messages.invalidJson","Invalid JSON"));}}
  function cache(){
    ["summaryMastery","summaryAccuracy","summaryAttempts","adaptiveModeBtn","manualModeBtn","pauseBtn","learnCurrentBtn","questionCategory","questionFamily","questionLevel","questionMastery","questionPrompt","answerForm","answerControls","submitBtn","nextBtn","skipBtn","answerKeypad","feedback","resumeBtn","categorySelect","familySelect","levelSelect","metricMastery","metricAccuracy","metricStreak","metricAvgTime","matrix","statTotalAttempts","statTotalCorrect","statTotalTime","statActiveCells","weakList","strongList","enabledCategories","dataBox","exportBtn","copyBtn","importBtn","resetBtn","learnGrid"].forEach(function(id){elements[id]=document.getElementById(id);});elements.practiceMain=document.querySelector(".practice-main");
  }
  function bind(){
    document.querySelectorAll("[data-view]").forEach(function(b){b.addEventListener("click",function(){setView(b.dataset.view);});});elements.answerForm.addEventListener("submit",submit);elements.nextBtn.addEventListener("click",startQuestion);elements.skipBtn.addEventListener("click",startQuestion);elements.adaptiveModeBtn.addEventListener("click",function(){progress.settings.adaptive=true;saveProgress();startQuestion();});elements.manualModeBtn.addEventListener("click",function(){progress.settings.adaptive=false;saveProgress();startQuestion();});elements.pauseBtn.addEventListener("click",pause);elements.resumeBtn.addEventListener("click",resume);
    elements.categorySelect.addEventListener("change",function(){var f=familiesForCategory(elements.categorySelect.value)[0];setManual(f.id,f.levels[0]);});elements.familySelect.addEventListener("change",function(){var f=familyById(elements.familySelect.value);setManual(f.id,f.levels[0]);});elements.levelSelect.addEventListener("change",function(){setManual(elements.familySelect.value,Number(elements.levelSelect.value));});
    elements.matrix.addEventListener("click",function(e){var b=e.target.closest("[data-family]");if(b){setView("practice");setManual(b.dataset.family,Number(b.dataset.level));}});["weakList","strongList"].forEach(function(id){elements[id].addEventListener("click",function(e){var b=e.target.closest("[data-family]");if(b){setView("practice");setManual(b.dataset.family,Number(b.dataset.level));}});});
    elements.enabledCategories.addEventListener("change",function(e){if(e.target.dataset.enabled){progress.settings.enabledCategories[e.target.dataset.enabled]=e.target.checked;saveProgress();}});elements.answerKeypad.addEventListener("click",keypad);elements.learnCurrentBtn.addEventListener("click",function(){setView("learn");var node=document.getElementById("learn-"+currentQuestion.familyId);if(node)node.scrollIntoView({behavior:"smooth",block:"center"});});
    elements.exportBtn.addEventListener("click",exportData);elements.copyBtn.addEventListener("click",function(){elements.dataBox.select();document.execCommand("copy");});elements.importBtn.addEventListener("click",importData);elements.resetBtn.addEventListener("click",function(){if(confirm(t("messages.resetConfirm","Reset all local progress?"))){progress=defaultProgress();saveProgress();startQuestion();}});
  }
  function init(){cache();progress=loadProgress();bind();startQuestion();setView(progress.activeView||"practice");}

  function runSelfTests(){
    var failures=[];function assert(name,condition){if(!condition)failures.push(name);}
    assert("28 families",FAMILIES.length===28);assert("28 generators",Object.keys(GENERATORS).length===28);assert("28 derivers",Object.keys(DERIVERS).length===28);
    var fp4=formatById("fp4"),fp6=formatById("fp6"),fp8=formatById("fp8"),fp16=formatById("fp16"),bf16=formatById("bf16"),fp32=formatById("fp32");
    assert("fp4 one",rationalText(decode(fp4,2).value)==="1");assert("fp4 subnormal",rationalText(decode(fp4,1).value)==="1/2");assert("fp4 infinity",decode(fp4,6).kind==="infinity");assert("fp4 nan",decode(fp4,7).kind==="NaN");
    assert("fp16 max",rationalText(maxFinite(fp16))==="65504");assert("fp32 integer threshold",isExact(fp32,rat(16777216))&&!isExact(fp32,rat(16777217)));assert("fp32 ulp",rationalText(ulp(fp32,20))==="1/8");
    assert("bf16 fields",bf16.bits===16&&bf16.e===8&&bf16.f===7&&bf16.bias===127&&bf16.p===8);assert("bf16 min subnormal",cmp(minSubnormal(bf16),pow2(-133))===0);assert("bf16 min normal",cmp(minNormal(bf16),pow2(-126))===0);assert("bf16 max finite",cmp(maxFinite(bf16),mul(rat(255),pow2(120)))===0);assert("bf16 canonical nan",canonicalNan(bf16)===0x7FC0n);
    assert("bf16 consecutive integers",isExact(bf16,rat(256))&&!isExact(bf16,rat(257))&&isExact(bf16,rat(258)));assert("bf16 round 257",roundToFormat(bf16,rat(257)).raw===0x4380n);assert("bf16 overflow tie",roundToFormat(bf16,add(maxFinite(bf16),pow2(119))).raw===0x7F80n);assert("bf16 signed boundaries",roundToFormat(bf16,neg(div(minSubnormal(bf16),rat(2)))).raw===0x8000n&&roundToFormat(bf16,neg(add(maxFinite(bf16),pow2(119)))).raw===0xFF80n);
    assert("binary32 to bf16 tie lower",binary32ToBfloat16Raw(0x3F808000n)===0x3F80n);assert("binary32 to bf16 tie upper",binary32ToBfloat16Raw(0x3F818000n)===0x3F82n);assert("binary32 to bf16 nan",binary32ToBfloat16Raw(0x7F800001n)===0x7FC0n);
    assert("format spacing normal",spacingComparison(rat(1)).winner==="binary16");assert("format spacing subnormal",spacingComparison(pow2(-20)).winner==="bfloat16");assert("format spacing equal",spacingComparison(pow2(-17)).winner==="equal");
    assert("tie even down",decode(fp4,roundToFormat(fp4,rat(5,4)).raw).value.n===1n);assert("underflow tie zero",decode(fp4,roundToFormat(fp4,rat(1,4)).raw).kind==="zero");assert("overflow tie",decode(fp16,roundToFormat(fp16,rat(65520)).raw).kind==="infinity");
    assert("bits exact width",normalizeBits("0b0010",fp4)==="0010");assert("bits reject short",normalizeBits("10",fp4)===null);assert("fp16 hex",normalizeBits("0x3C00",fp16)===bits(0x3c00,16));assert("bf16 hex",normalizeBits("0x3FC0",bf16)===bits(0x3fc0,16));assert("fraction parser",rationalText(parseRational("1 1/2"))==="3/2");assert("power parser",cmp(parseRational("3×2^-133"),mul(rat(3),pow2(-133)))===0&&cmp(parseRational("-2^7"),rat(-128))===0);assert("compact exact",compactExactText(minSubnormal(bf16))==="2^-133"&&compactExactText(maxFinite(bf16))==="255×2^120");
    [fp4,fp6,fp8,bf16].forEach(function(format){var limit=1n<<BigInt(format.bits);for(var raw=0n;raw<limit;raw+=1n){var d=decode(format,raw),rebuilt=rawFromFields(format,d.sign,d.exponent,d.fraction);assert(format.id+" fields "+raw,rebuilt===raw);if(d.value){var encoded=encodeExact(format,d.value,d.kind==="zero"&&d.sign);assert(format.id+" roundtrip "+raw,encoded===raw);}}});
    FAMILIES.forEach(function(family,index){family.levels.forEach(function(level){for(var sample=0;sample<80;sample+=1){try{var q=generateQuestion(family.id,level,(index+1)*100000+level*1000+sample,true),answers={};q.answer.fields.forEach(function(field){answers[field.id]=field.kind==="bits"?(formatById(field.formatId).bits>=16?"0x"+hex(BigInt("0b"+field.value),formatById(field.formatId).bits):field.value):field.value;});assert("canonical "+family.id+" "+level+" "+sample,checkQuestion(answers,q).correct);}catch(error){failures.push("generator "+family.id+":"+level+":"+sample+" "+error.message);}}});});
    var migrated=migrateLegacy({cells:{"decode:1":{attempts:3,correct:2,totalMs:500}}});assert("legacy totals",migrated.legacyCategoryTotals.decode.attempts===3);assert("fresh family cells",Object.keys(migrated.cells).length===0);
    if(failures.length){console.error("Floating-point self-tests failed",failures.slice(0,60),"total",failures.length);return{ok:false,failures:failures.slice(0,100)};}
    console.info("Floating-point self-tests passed: 28 families, exhaustive FP4/FP6/FP8/bfloat16 field and finite round-trips, generated property sample");return{ok:true,failures:[]};
  }

  window.runSelfTests=runSelfTests;
  window.PracticeLabFloatingPointPractice={formats:FORMATS,categories:CATEGORIES,families:FAMILIES,generateQuestion:generateQuestion,checkQuestion:checkQuestion,runSelfTests:runSelfTests};
  if(typeof document!=="undefined"&&document.addEventListener)document.addEventListener("DOMContentLoaded",init);
}());
