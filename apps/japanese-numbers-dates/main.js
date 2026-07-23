(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.japaneseNumbersDates.v1";
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

  function normalizeInteger(text) {
    var value = String(text || "").trim().normalize("NFKC").replace(/[\s,_]/g, "");
    if (!/^[+-]?\d+$/.test(value)) return null;
    return Number(value);
  }

  function normalizeText(text) {
    return String(text || "")
      .trim()
      .normalize("NFKC")
      .toLowerCase()
      .replaceAll("ā", "aa")
      .replaceAll("ī", "ii")
      .replaceAll("ū", "uu")
      .replaceAll("ē", "ee")
      .replaceAll("ō", "ou")
      .replace(/[、。.,_\-'\s]/g, "");
  }

  function parseDateAnswer(text) {
    var value = String(text || "").trim().normalize("NFKC");
    var match = value.match(/^0?(\d{1,2})\s*(?:\/|-|\.|\s)\s*0?(\d{1,2})$/);
    if (!match) return null;
    return Number(match[1]) + "/" + Number(match[2]);
  }

  function answerSet(question) {
    return [question.expected].concat(question.aliases || []).map(normalizeText);
  }

  function checkAnswer(answer, question) {
    if (question.answerKind === "integer") return normalizeInteger(answer) === question.expected;
    if (question.answerKind === "date") return parseDateAnswer(answer) === question.expected;
    return answerSet(question).indexOf(normalizeText(answer)) !== -1;
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

  var KANA_ONES = ["ゼロ", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"];
  var ROMAJI_ONES = ["zero", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu"];
  var MONTH_KANA = ["", "いちがつ", "にがつ", "さんがつ", "しがつ", "ごがつ", "ろくがつ", "しちがつ", "はちがつ", "くがつ", "じゅうがつ", "じゅういちがつ", "じゅうにがつ"];
  var MONTH_ROMAJI = ["", "ichigatsu", "nigatsu", "sangatsu", "shigatsu", "gogatsu", "rokugatsu", "shichigatsu", "hachigatsu", "kugatsu", "juugatsu", "juuichigatsu", "juunigatsu"];
  var DAY_KANA = ["", "ついたち", "ふつか", "みっか", "よっか", "いつか", "むいか", "なのか", "ようか", "ここのか", "とおか", "じゅういちにち", "じゅうににち", "じゅうさんにち", "じゅうよっか", "じゅうごにち", "じゅうろくにち", "じゅうしちにち", "じゅうはちにち", "じゅうくにち", "はつか", "にじゅういちにち", "にじゅうににち", "にじゅうさんにち", "にじゅうよっか", "にじゅうごにち", "にじゅうろくにち", "にじゅうしちにち", "にじゅうはちにち", "にじゅうくにち", "さんじゅうにち", "さんじゅういちにち"];
  var DAY_ROMAJI = ["", "tsuitachi", "futsuka", "mikka", "yokka", "itsuka", "muika", "nanoka", "youka", "kokonoka", "tooka", "juuichinichi", "juuninichi", "juusannichi", "juuyokka", "juugonichi", "juurokunichi", "juushichinichi", "juuhachinichi", "juukunichi", "hatsuka", "nijuuichinichi", "nijuuninichi", "nijuusannichi", "nijuuyokka", "nijuugonichi", "nijuurokunichi", "nijuushichinichi", "nijuuhachinichi", "nijuukunichi", "sanjuunichi", "sanjuuichinichi"];
  var WEEKDAY_KANJI = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"];
  var WEEKDAY_KANA = ["げつようび", "かようび", "すいようび", "もくようび", "きんようび", "どようび", "にちようび"];
  var WEEKDAY_ROMAJI = ["getsuyoubi", "kayoubi", "suiyoubi", "mokuyoubi", "kinyoubi", "doyoubi", "nichiyoubi"];
  var RELATIVE_DAYS = [
    { offset: -2, kana: "おととい", romaji: "ototoi", key: "dayBeforeYesterday" },
    { offset: -1, kana: "きのう", romaji: "kinou", key: "yesterday" },
    { offset: 0, kana: "きょう", romaji: "kyou", key: "today" },
    { offset: 1, kana: "あした", romaji: "ashita", key: "tomorrow" },
    { offset: 2, kana: "あさって", romaji: "asatte", key: "dayAfterTomorrow" }
  ];

  function kanaBelow10000(n) {
    if (n === 0) return KANA_ONES[0];
    var parts = [];
    var thousands = Math.floor(n / 1000);
    var hundreds = Math.floor(n % 1000 / 100);
    var tens = Math.floor(n % 100 / 10);
    var ones = n % 10;
    if (thousands) parts.push({ 1: "せん", 3: "さんぜん", 8: "はっせん" }[thousands] || KANA_ONES[thousands] + "せん");
    if (hundreds) parts.push({ 1: "ひゃく", 3: "さんびゃく", 6: "ろっぴゃく", 8: "はっぴゃく" }[hundreds] || KANA_ONES[hundreds] + "ひゃく");
    if (tens) parts.push(tens === 1 ? "じゅう" : KANA_ONES[tens] + "じゅう");
    if (ones) parts.push(KANA_ONES[ones]);
    return parts.join("");
  }

  function romajiBelow10000(n) {
    if (n === 0) return ROMAJI_ONES[0];
    var parts = [];
    var thousands = Math.floor(n / 1000);
    var hundreds = Math.floor(n % 1000 / 100);
    var tens = Math.floor(n % 100 / 10);
    var ones = n % 10;
    if (thousands) parts.push({ 1: "sen", 3: "sanzen", 8: "hassen" }[thousands] || ROMAJI_ONES[thousands] + " sen");
    if (hundreds) parts.push({ 1: "hyaku", 3: "sanbyaku", 6: "roppyaku", 8: "happyaku" }[hundreds] || ROMAJI_ONES[hundreds] + " hyaku");
    if (tens) parts.push(tens === 1 ? "juu" : ROMAJI_ONES[tens] + " juu");
    if (ones) parts.push(ROMAJI_ONES[ones]);
    return parts.join(" ");
  }

  function kanaNumber(n) {
    if (n < 10000) return kanaBelow10000(n);
    var high = Math.floor(n / 10000);
    var low = n % 10000;
    return kanaBelow10000(high) + "まん" + (low ? kanaBelow10000(low) : "");
  }

  function romajiNumber(n) {
    if (n < 10000) return romajiBelow10000(n);
    var high = Math.floor(n / 10000);
    var low = n % 10000;
    return romajiBelow10000(high) + " man" + (low ? " " + romajiBelow10000(low) : "");
  }

  function numberRange(level) {
    return [[0, 10], [11, 99], [100, 999], [1000, 9999], [10000, 99999]][level - 1];
  }

  function titleFor(id) {
    return t("categories." + id + ".title", id);
  }

  function shortFor(id) {
    return t("categories." + id + ".short", titleFor(id));
  }

  function makeQuestion(categoryId, level, promptKey, expression, expected, aliases, values, answerKind) {
    values = values || {};
    return {
      categoryId: categoryId,
      level: level,
      promptTitle: tf("prompts." + promptKey + ".title", values, titleFor(categoryId)),
      promptNote: tf("prompts." + promptKey + ".note", values, "Enter the answer."),
      expression: expression,
      expected: expected,
      aliases: aliases || [],
      answerKind: answerKind || "text",
      explanation: tf("prompts." + promptKey + ".explanation", values, String(expected))
    };
  }

  function counterTables() {
    return {
      people: [
        ["ひとり", "hitori"], ["ふたり", "futari"], ["さんにん", "sannin"], ["よにん", "yonin"], ["ごにん", "gonin"],
        ["ろくにん", "rokunin"], ["ななにん", "nananin"], ["はちにん", "hachinin"], ["きゅうにん", "kyuunin"], ["じゅうにん", "juunin"]
      ],
      flat: [
        ["いちまい", "ichimai"], ["にまい", "nimai"], ["さんまい", "sanmai"], ["よんまい", "yonmai"], ["ごまい", "gomai"],
        ["ろくまい", "rokumai"], ["ななまい", "nanamai"], ["はちまい", "hachimai"], ["きゅうまい", "kyuumai"], ["じゅうまい", "juumai"]
      ],
      long: [
        ["いっぽん", "ippon"], ["にほん", "nihon"], ["さんぼん", "sanbon"], ["よんほん", "yonhon"], ["ごほん", "gohon"],
        ["ろっぽん", "roppon"], ["ななほん", "nanahon"], ["はっぽん", "happon"], ["きゅうほん", "kyuuhon"], ["じゅっぽん", "juppon", "juppon"]
      ],
      small: [
        ["いっこ", "ikko"], ["にこ", "niko"], ["さんこ", "sanko"], ["よんこ", "yonko"], ["ごこ", "goko"],
        ["ろっこ", "rokko"], ["ななこ", "nanako"], ["はっこ", "hakko"], ["きゅうこ", "kyuuko"], ["じゅっこ", "jukko", "jikko"]
      ],
      books: [
        ["いっさつ", "issatsu"], ["にさつ", "nisatsu"], ["さんさつ", "sansatsu"], ["よんさつ", "yonsatsu"], ["ごさつ", "gosatsu"],
        ["ろくさつ", "rokusatsu"], ["ななさつ", "nanasatsu"], ["はっさつ", "hassatsu"], ["きゅうさつ", "kyuusatsu"], ["じゅっさつ", "jussatsu"]
      ],
      times: [
        ["いっかい", "ikkai"], ["にかい", "nikai"], ["さんかい", "sankai"], ["よんかい", "yonkai"], ["ごかい", "gokai"],
        ["ろっかい", "rokkai"], ["ななかい", "nanakai"], ["はっかい", "hakkai"], ["きゅうかい", "kyuukai"], ["じゅっかい", "jukkai"]
      ]
    };
  }

  function counterChoices(level) {
    if (level === 1) return ["people"];
    if (level === 2) return ["people", "flat"];
    if (level === 3) return ["flat", "long", "small"];
    if (level === 4) return ["long", "small", "books", "times"];
    return ["people", "flat", "long", "small", "books", "times"];
  }

  function counterLabel(id) {
    return t("counterLabels." + id, id);
  }

  var CATEGORIES = [
    {
      id: "numberReading",
      generate: function (level, rng) {
        var range = numberRange(level);
        var n = rng.int(range[0], range[1]);
        var expected = kanaNumber(n);
        return makeQuestion("numberReading", level, "numberReading", String(n), expected, [romajiNumber(n)], { n: n, answer: expected });
      }
    },
    {
      id: "numberValue",
      generate: function (level, rng) {
        var range = numberRange(level);
        var n = rng.int(range[0], range[1]);
        return makeQuestion("numberValue", level, "numberValue", kanaNumber(n), n, [], { n: n, reading: kanaNumber(n) }, "integer");
      }
    },
    {
      id: "dates",
      generate: function (level, rng) {
        if (level === 1) {
          var month = rng.int(1, 12);
          return makeQuestion("dates", level, "monthReading", month + "月", MONTH_KANA[month], [MONTH_ROMAJI[month]], { month: month, answer: MONTH_KANA[month] });
        }
        if (level === 2) {
          var day = rng.int(1, 31);
          return makeQuestion("dates", level, "dayReading", day + "日", DAY_KANA[day], [DAY_ROMAJI[day]], { day: day, answer: DAY_KANA[day] });
        }
        if (level <= 4) {
          var m = rng.int(1, 12);
          var d = rng.int(1, 28);
          var expected = MONTH_KANA[m] + DAY_KANA[d];
          return makeQuestion("dates", level, "dateReading", m + "/" + d, expected, [MONTH_ROMAJI[m] + " " + DAY_ROMAJI[d]], { month: m, day: d, answer: expected });
        }
        var month2 = rng.int(1, 12);
        var day2 = rng.int(1, 28);
        var dateKey = month2 + "/" + day2;
        return makeQuestion("dates", level, "dateValue", MONTH_KANA[month2] + " " + DAY_KANA[day2], dateKey, [month2 + "-" + day2, month2 + " " + day2], { month: month2, day: day2, answer: dateKey }, "date");
      }
    },
    {
      id: "calendarWords",
      generate: function (level, rng) {
        if (level <= 2) {
          var month = rng.int(1, 12);
          if (level === 1) return makeQuestion("calendarWords", level, "monthNumber", MONTH_KANA[month], month, [], { month: month, reading: MONTH_KANA[month] }, "integer");
          return makeQuestion("calendarWords", level, "monthReading", t("calendar.monthNames." + month, "month " + month), MONTH_KANA[month], [MONTH_ROMAJI[month]], { month: month, answer: MONTH_KANA[month] });
        }
        if (level <= 4) {
          var index = rng.int(0, 6);
          if (level === 3) {
            return makeQuestion("calendarWords", level, "weekdayJapanese", t("calendar.weekdayNames." + index, WEEKDAY_KANJI[index]), WEEKDAY_KANJI[index], [WEEKDAY_KANA[index], WEEKDAY_ROMAJI[index]], { weekday: t("calendar.weekdayNames." + index, WEEKDAY_KANJI[index]), answer: WEEKDAY_KANJI[index] });
          }
          return makeQuestion("calendarWords", level, "weekdayNumber", WEEKDAY_KANA[index], index + 1, [], { weekday: WEEKDAY_KANA[index], answer: index + 1 }, "integer");
        }
        var item = rng.pick(RELATIVE_DAYS);
        if (rng.int(0, 1) === 0) {
          return makeQuestion("calendarWords", level, "relativeJapanese", t("calendar.relative." + item.key, item.key), item.kana, [item.romaji], { word: t("calendar.relative." + item.key, item.key), answer: item.kana });
        }
        return makeQuestion("calendarWords", level, "relativeOffset", item.kana, item.offset, [], { word: item.kana, answer: item.offset }, "integer");
      }
    },
    {
      id: "counters",
      generate: function (level, rng) {
        var tables = counterTables();
        var counter = rng.pick(counterChoices(level));
        var count = rng.int(1, level <= 2 ? 5 : 10);
        var entry = tables[counter][count - 1];
        var label = counterLabel(counter);
        var expected = entry[0];
        var aliases = entry.slice(1);
        return makeQuestion("counters", level, "counterReading", count + " " + label, expected, aliases, { count: count, label: label, answer: expected });
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
    elements.questionLevel.textContent = t("practice.level", "Level") + " " + currentQuestion.level;
    elements.questionMastery.textContent = formatPercent(cell.mastery) + " " + t("practice.masterySuffix", "mastery");
    elements.questionPrompt.innerHTML =
      '<div class="prompt-title">' + escapeHtml(currentQuestion.promptTitle) + '</div>' +
      '<div class="prompt-expression">' + escapeHtml(currentQuestion.expression) + '</div>' +
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
    var speedFactor = correct ? clamp(1.25 - elapsedMs / 18000, 0.35, 1.05) : 1;
    cell.mastery = clamp(cell.mastery + (correct ? 9 * speedFactor : -15), 0, 100);
  }

  function submitAnswer() {
    if (!currentQuestion || answered) {
      generateQuestion();
      return;
    }
    var correct = checkAnswer(elements.answerInput.value, currentQuestion);
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
      option.textContent = t("practice.level", "Level") + " " + level;
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
    elements.matrix.innerHTML = "<table><thead><tr><th>" + escapeHtml(t("practice.category", "Category")) + "</th>" + LEVELS.map(function (level) { return "<th>L" + level + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody></table>";
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
    assert("normalize romaji spaces", normalizeText("san byaku") === normalizeText("sanbyaku"));
    assert("normalize macron", normalizeText("kyō") === normalizeText("kyou"));
    assert("date slash", parseDateAnswer("04/01") === "4/1");
    assert("date space", parseDateAnswer("4 1") === "4/1");
    assert("number 0", kanaNumber(0) === "ゼロ");
    assert("number 300", kanaNumber(300) === "さんびゃく");
    assert("number 600", kanaNumber(600) === "ろっぴゃく");
    assert("number 8000", kanaNumber(8000) === "はっせん");
    assert("number 10000", kanaNumber(10000) === "いちまん");
    assert("romaji 345", normalizeText(romajiNumber(345)) === "sanbyakuyonjuugo");
    var q = makeQuestion("numberReading", 1, "numberReading", "3", "さん", ["san"], { n: 3, answer: "さん" });
    assert("kana answer", checkAnswer("さん", q));
    assert("romaji answer", checkAnswer("san", q));
    assert("romaji spaced answer", checkAnswer("s a n", q));
    var date = makeQuestion("dates", 5, "dateValue", "しがつ ついたち", "4/1", [], { answer: "4/1" }, "date");
    assert("date answer dash", checkAnswer("04-01", date));
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var generated = category.generate(level, makeRng(level * 100 + category.id.length));
        assert(category.id + " L" + level + " prompt", generated.promptTitle.indexOf("{") === -1);
        assert(category.id + " L" + level + " self check", checkAnswer(String(generated.expected), generated));
      });
    });
    return { ok: failures.length === 0, failures: failures };
  }

  window.runSelfTests = runSelfTests;
  window.PracticeLabJapaneseNumbersDates = {
    categories: CATEGORIES,
    kanaNumber: kanaNumber,
    romajiNumber: romajiNumber,
    runSelfTests: runSelfTests
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
