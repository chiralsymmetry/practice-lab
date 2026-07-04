(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.mentalArithmetic.v1";
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
    var value = String(text || "").trim().replace(/[\s,_]/g, "");
    if (!/^[+-]?\d+$/.test(value)) return null;
    return Number(value);
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

  function rangeFor(categoryId, level) {
    var table = {
      addition: [[1, 9], [10, 99], [50, 499], [100, 999], [1000, 9999]],
      subtraction: [[1, 9], [10, 99], [50, 499], [100, 999], [1000, 9999]],
      multiplication: [[2, 9], [4, 12], [10, 25], [12, 99], [50, 999]],
      division: [[2, 9], [4, 12], [10, 25], [12, 99], [50, 999]],
      complements: [[10, 10], [100, 100], [100, 500], [1000, 1000], [1000, 10000]],
      percentages: [[10, 100], [20, 200], [50, 500], [100, 1000], [200, 5000]]
    };
    return table[categoryId][level - 1];
  }

  function titleFor(id) {
    return t("categories." + id + ".title", id);
  }

  function shortFor(id) {
    return t("categories." + id + ".short", titleFor(id));
  }

  function makeQuestion(categoryId, level, expression, answer, promptKey, values) {
    return {
      categoryId: categoryId,
      level: level,
      promptTitle: t("prompts." + promptKey + ".title", titleFor(categoryId)),
      promptNote: t("prompts." + promptKey + ".note", "Enter the answer."),
      expression: expression,
      expected: answer,
      explanation: tf("prompts." + promptKey + ".explanation", values, expression + " = " + answer + ".")
    };
  }

  var CATEGORIES = [
    {
      id: "addition",
      generate: function (level, rng) {
        var range = rangeFor("addition", level);
        var a = rng.int(range[0], range[1]);
        var b = rng.int(range[0], range[1]);
        if (level >= 3 && rng.next() < 0.35) b = 100 * Math.ceil(b / 100) - a % 100;
        return makeQuestion("addition", level, a + " + " + b, a + b, "addition", { a: a, b: b, answer: a + b });
      }
    },
    {
      id: "subtraction",
      generate: function (level, rng) {
        var range = rangeFor("subtraction", level);
        var a = rng.int(range[0], range[1]);
        var b = rng.int(range[0], range[1]);
        if (rng.next() < 0.75 && a < b) {
          var temp = a;
          a = b;
          b = temp;
        }
        return makeQuestion("subtraction", level, a + " - " + b, a - b, "subtraction", { a: a, b: b, answer: a - b });
      }
    },
    {
      id: "multiplication",
      generate: function (level, rng) {
        var range = rangeFor("multiplication", level);
        var a = rng.int(range[0], range[1]);
        var b;
        if (level <= 2) b = rng.int(2, level === 1 ? 9 : 12);
        else if (level === 3) b = rng.pick([11, 12, 15, 20, 25]);
        else if (level === 4) b = rng.int(12, 99);
        else b = rng.pick([25, 50, 75, 99, 101, 125]);
        return makeQuestion("multiplication", level, a + " * " + b, a * b, "multiplication", { a: a, b: b, answer: a * b });
      }
    },
    {
      id: "division",
      generate: function (level, rng) {
        var range = rangeFor("division", level);
        var divisor = rng.int(range[0], range[1]);
        var quotient = level <= 2 ? rng.int(2, 12) : rng.int(5, level === 5 ? 999 : 99);
        var dividend = divisor * quotient;
        return makeQuestion("division", level, dividend + " / " + divisor, quotient, "division", { dividend: dividend, divisor: divisor, answer: quotient });
      }
    },
    {
      id: "complements",
      generate: function (level, rng) {
        var targets = level === 1 ? [10] : level === 2 ? [100] : level === 3 ? [100, 500] : level === 4 ? [1000] : [1000, 10000];
        var target = rng.pick(targets);
        var value = rng.int(1, target - 1);
        if (level <= 2) value = rng.int(1, 9) * (target === 10 ? 1 : 10) + rng.int(0, target === 10 ? 0 : 9);
        var answer = target - value;
        return makeQuestion("complements", level, value + " + ? = " + target, answer, "complements", { value: value, target: target, answer: answer });
      }
    },
    {
      id: "percentages",
      generate: function (level, rng) {
        var percents = level === 1 ? [10, 50] : level === 2 ? [5, 10, 25, 50] : level === 3 ? [12, 15, 20, 25, 75] : level === 4 ? [12, 15, 30, 35, 75] : [2, 3, 6, 12, 15, 18, 24, 75];
        var percent = rng.pick(percents);
        var scale = level <= 2 ? 10 : level <= 4 ? 20 : 50;
        var base = rng.int(2, 20 * level) * scale;
        while ((base * percent) % 100 !== 0) base += scale;
        var answer = base * percent / 100;
        return makeQuestion("percentages", level, percent + "% of " + base, answer, "percentages", { percent: percent, base: base, answer: answer });
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
    elements.answerInput.focus();
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
    var normalized = normalizeInteger(elements.answerInput.value);
    var correct = normalized === currentQuestion.expected;
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
    elements.answerInput.focus();
  }

  function insertAtCursor(text) {
    var input = elements.answerInput;
    var start = input.selectionStart || input.value.length;
    var end = input.selectionEnd || input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    input.setSelectionRange(start + text.length, start + text.length);
    input.focus({ preventScroll: true });
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
    assert("normalize positive", normalizeInteger("1 234") === 1234);
    assert("normalize negative", normalizeInteger("-42") === -42);
    assert("normalize invalid", normalizeInteger("12x") === null);
    var rng = makeRng(123);
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var q = category.generate(level, rng);
        assert(category.id + " L" + level + " integer answer", Number.isInteger(q.expected));
        assert(category.id + " L" + level + " self check", normalizeInteger(String(q.expected)) === q.expected);
      });
    });
    var add = getCategory("addition").generate(1, makeRng(1));
    assert("addition explanation", add.explanation.indexOf(String(add.expected)) !== -1);
    var div = getCategory("division").generate(5, makeRng(5));
    assert("division exact", Number.isInteger(div.expected));
    var pct = getCategory("percentages").generate(5, makeRng(9));
    assert("percentage exact", Number.isInteger(pct.expected));
    return { ok: failures.length === 0, failures: failures };
  }

  window.runSelfTests = runSelfTests;
  window.PracticeLabMentalArithmetic = {
    categories: CATEGORIES,
    runSelfTests: runSelfTests
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
