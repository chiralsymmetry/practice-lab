(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.cppMentalExecution.v2";
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
      .replace(/[;]+$/g, "")
      .replace(/[,_]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*([=,&*<>:+\-|^])\s*/g, "$1")
      .toLowerCase();
  }

  function answerSet(expected, aliases) {
    var values = [expected].concat(aliases || []);
    return values.map(normalizeAnswer).filter(Boolean);
  }

  function pairAnswer(names, values) {
    return names.map(function (name, index) {
      return name + "=" + values[index];
    }).join(" ");
  }

  function pairAliases(names, values) {
    return [
      values.map(String).join(" "),
      names.map(function (name, index) { return name + " " + values[index]; }).join(" "),
      names.map(function (name, index) { return name + "==" + values[index]; }).join(" ")
    ];
  }

  function judgementAnswer(kind) {
    return t("answers." + kind, kind);
  }

  function judgementAliases(kind) {
    if (kind === "defined") return ["defined", "well-defined", "defined behavior", "ok", "valid", "giltigt", "väldefinierat"];
    if (kind === "undefinedBehavior") return ["undefined behavior", "undefined", "ub", "odefinierat beteende", "odefinierat"];
    if (kind === "compileError") return ["compile error", "compiler error", "does not compile", "error", "kompileringsfel", "kompilerar inte", "fel"];
    return [];
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

  function makeQuestion(categoryId, level, code, answer, promptKey, values, aliases) {
    values = values || {};
    return {
      categoryId: categoryId,
      level: level,
      promptTitle: tf("prompts." + promptKey + ".title", values, titleFor(categoryId)),
      promptNote: tf("prompts." + promptKey + ".note", values, "Enter the answer."),
      code: code,
      expected: String(answer),
      aliases: answerSet(String(answer), aliases),
      explanation: tf("prompts." + promptKey + ".explanation", values, "Expected: " + answer + ".")
    };
  }

  var CATEGORIES = [
    {
      id: "runtime",
      generate: function (level, rng) {
        var x = rng.int(level, 5 * level + 4);
        var a = rng.int(1, 4 + level);
        var b = rng.int(2, 5 + level);
        var answer;
        var code;
        var aliases = [];
        var promptKey = "runtimeValue";
        var values = { variable: "x" };
        if (level === 1) {
          answer = (x + a) - b;
          code = "int x = " + x + ";\nx += " + a + ";\nx -= " + b + ";";
        } else if (level === 2) {
          var kind2 = rng.int(0, 3);
          if (kind2 === 0) {
            code = "int x = " + x + ";\nint y = ++x;\nx += y;";
            answer = 2 * x + 2;
          } else if (kind2 === 1) {
            code = "int x = " + x + ";\nint y = x++;\nx += y;";
            answer = 2 * x + 1;
          } else if (kind2 === 2) {
            var k2 = rng.int(2, 6);
            code = "int x = " + x + ";\nint y = x++ + " + k2 + ";\nx += y;";
            answer = 2 * x + k2 + 1;
          } else {
            code = "int x = " + x + ";\nint y = --x;\nx *= 2;\nx += y;";
            answer = 3 * (x - 1);
          }
        } else if (level === 3) {
          var kind3 = rng.int(0, 4);
          values.variable = "a";
          if (kind3 === 0) {
            code = "int a = 0;\nbool hit = (a++ == 0) || (++a == 2);";
            answer = 1;
          } else if (kind3 === 1) {
            code = "int a = 1;\nbool hit = (a++ == 0) || (++a == 3);";
            answer = 3;
          } else if (kind3 === 2) {
            code = "int a = 0;\nbool hit = (a++ != 0) && (++a == 2);";
            answer = 1;
          } else if (kind3 === 3) {
            code = "int a = 1;\nbool hit = (++a == 2) && (a++ == 2);";
            answer = 3;
          } else {
            code = "int a = 2;\nbool hit = (a++ == 2) || ((a += 10) > 0);";
            answer = 3;
          }
        } else if (level === 4) {
          var startA4 = rng.int(1, 3);
          var startB4 = rng.int(3, 6);
          var aa = startA4;
          var bb = startB4;
          for (var i = 0; i < 4; i += 1) {
            if (aa < bb) {
              aa += i + 1;
            } else {
              bb += aa % 3;
              aa -= 1;
            }
          }
          answer = pairAnswer(["a", "b"], [aa, bb]);
          aliases = pairAliases(["a", "b"], [aa, bb]);
          promptKey = "runtimePair";
          values = { names: "a and b", answer: answer };
          code = "int a = " + startA4 + ";\nint b = " + startB4 + ";\n\nfor (int i = 0; i < 4; ++i) {\n  if (a < b) {\n    a += i + 1;\n  } else {\n    b += a % 3;\n    --a;\n  }\n}";
        } else {
          var startA = rng.int(2, 5);
          var startB = rng.int(7, 11);
          var limit = rng.int(4, 6);
          var finalA = startA;
          var finalB = startB;
          var r = 0;
          var returned = false;
          for (var j = 0; j < limit; j += 1) {
            finalA += j;
            if (finalA > finalB) {
              finalB += finalA;
              r = finalB;
              returned = true;
              break;
            }
          }
          if (!returned) r = finalA + finalB;
          answer = pairAnswer(["a", "b", "r"], [finalA, finalB, r]);
          aliases = pairAliases(["a", "b", "r"], [finalA, finalB, r]);
          promptKey = "runtimeTriple";
          values = { names: "a, b, and r", answer: answer };
          code = "int step(int& a, int& b) {\n  for (int i = 0; i < " + limit + "; ++i) {\n    a += i;\n    if (a > b) {\n      b += a;\n      return b;\n    }\n  }\n  return a + b;\n}\n\nint a = " + startA + ";\nint b = " + startB + ";\nint r = step(a, b);";
        }
        values.answer = answer;
        return makeQuestion("runtime", level, code, answer, promptKey, values, aliases);
      }
    },
    {
      id: "aliasing",
      generate: function (level, rng) {
        var a = rng.int(2, 8 + level);
        var b = rng.int(1, 6 + level);
        var answer;
        var code;
        var aliases = [];
        var promptKey = "aliasValue";
        var values = { variable: "a" };
        if (level <= 2) {
          if (level === 1) {
            if (rng.int(0, 1) === 0) {
              answer = a + b;
              code = "int a = " + a + ";\nint& r = a;\nr += " + b + ";";
            } else {
              answer = a - b;
              code = "int a = " + a + ";\nint& r = a;\nr -= " + b + ";";
            }
          } else {
            values.variable = "b";
            var kind2 = rng.int(0, 3);
            if (kind2 === 0) {
              answer = b + 1;
              code = "int a = " + a + ";\nint b = " + b + ";\nint* p = &a;\np = &b;\n*p += 1;";
            } else if (kind2 === 1) {
              answer = b - 1;
              code = "int a = " + a + ";\nint b = " + b + ";\nint* p = &a;\np = &b;\n*p -= 1;";
            } else if (kind2 === 2) {
              var k2 = rng.int(2, 5);
              answer = b + k2;
              code = "int a = " + a + ";\nint b = " + b + ";\nint* p = &a;\np = &b;\n*p += " + k2 + ";";
            } else {
              answer = a;
              values.variable = "a";
              code = "int a = " + a + ";\nint b = " + b + ";\nint* p = &a;\np = &b;\n*p += 1;";
            }
          }
        } else if (level === 3) {
          var aa = a + b;
          var bb = -a;
          answer = pairAnswer(["a", "b"], [aa, bb]);
          aliases = pairAliases(["a", "b"], [aa, bb]);
          promptKey = "aliasPair";
          code = "int a = " + a + ";\nint b = " + b + ";\n\nint* p = &a;\nint& r = *p;\n\np = &b;\nr += *p;\n*p -= a;";
        } else if (level === 4) {
          var finalA = a + 1;
          var finalB = b + 2;
          answer = pairAnswer(["a", "b"], [finalA, finalB]);
          aliases = pairAliases(["a", "b"], [finalA, finalB]);
          promptKey = "aliasPair";
          code = "void reseat(int* p, int& y) {\n  p = &y;\n  *p += 2;\n}\n\nint a = " + a + ";\nint b = " + b + ";\nint* p = &a;\n\nreseat(p, b);\n*p += 1;";
        } else {
          var outA = a;
          var outB = b + 2 * (a + 1);
          answer = pairAnswer(["a", "b"], [outA, outB]);
          aliases = pairAliases(["a", "b"], [outA, outB]);
          promptKey = "aliasPair";
          code = "void step(int x, int& y, int* p) {\n  ++x;\n  y += x;\n  p = &y;\n  *p += x;\n}\n\nint a = " + a + ";\nint b = " + b + ";\n\nstep(a, b, &a);";
        }
        values.answer = answer;
        return makeQuestion("aliasing", level, code, answer, promptKey, values, aliases);
      }
    },
    {
      id: "types",
      generate: function (level, rng) {
        var code;
        var answer;
        var aliases = [];
        var promptKey = "types";
        if (level === 1) {
          if (rng.int(0, 1) === 0) {
            answer = "int";
            code = "auto x = 42;";
          } else {
            answer = "double";
            code = "auto x = 42.0;";
          }
        } else if (level === 2) {
          answer = "int";
          code = "const int value = 42;\nauto x = value;";
          aliases = ["non-const int"];
        } else if (level === 3) {
          answer = "int 256";
          aliases = ["int, 256", "type int value 256", "int value 256", "256 int"];
          promptKey = "typeAndValue";
          code = "#include <cstdint>\n\nstd::uint8_t x = 255;\nauto y = x + 1;";
        } else if (level === 4) {
          answer = judgementAnswer("compileError");
          aliases = judgementAliases("compileError");
          promptKey = "typeJudgement";
          code = "double d = 3.9;\n\nint a = d;\nint b(d);\nint c{d};";
        } else {
          answer = "int&";
          aliases = ["int &", "reference to int"];
          code = "int value = 42;\nauto&& x = value;";
        }
        return makeQuestion("types", level, code, answer, promptKey, { answer: answer }, aliases);
      }
    },
    {
      id: "resolution",
      generate: function (level, rng) {
        var code;
        var answer;
        var aliases = [];
        var promptKey = "resolutionOutput";
        if (level === 1) {
          answer = "double";
          code = "void f(int)    { std::cout << \"int\"; }\nvoid f(double) { std::cout << \"double\"; }\n\nf(2.5);";
        } else if (level === 2) {
          answer = "LCRR";
          aliases = ["L C R R", "l c r r"];
          code = "#include <utility>\n\nvoid f(int&)       { std::cout << \"L\"; }\nvoid f(const int&) { std::cout << \"C\"; }\nvoid f(int&&)      { std::cout << \"R\"; }\n\nint x = 0;\nconst int cx = 0;\n\nf(x);\nf(cx);\nf(0);\nf(std::move(x));";
        } else if (level === 3) {
          answer = "pointer";
          code = "template<class T>\nvoid show(T) {\n  std::cout << \"value\";\n}\n\ntemplate<class T>\nvoid show(T*) {\n  std::cout << \"pointer\";\n}\n\nint x = 0;\nshow(&x);";
        } else if (level === 4) {
          answer = "int";
          promptKey = "resolutionType";
          code = "template<class T>\nvoid by_const_ref(const T&);\n\nconst int x = 0;\nby_const_ref(x);";
        } else {
          answer = "template";
          aliases = ["function template", "T"];
          code = "void f(long) {\n  std::cout << \"long\";\n}\n\ntemplate<class T>\nvoid f(T) {\n  std::cout << \"template\";\n}\n\nf(1);";
        }
        return makeQuestion("resolution", level, code, answer, promptKey, { answer: answer }, aliases);
      }
    },
    {
      id: "lifetime",
      generate: function (level, rng) {
        var code;
        var answer;
        var aliases = [];
        var promptKey = "lifetimeJudge";
        if (level === 1) {
          answer = judgementAnswer("undefinedBehavior");
          aliases = judgementAliases("undefinedBehavior");
          code = "int* p = nullptr;\n\n{\n  int x = 4;\n  p = &x;\n}\n\nint y = *p;";
        } else if (level === 2) {
          answer = judgementAnswer("defined");
          aliases = judgementAliases("defined");
          code = "const int& r = 3 + 4;\nint y = r;";
        } else if (level === 3) {
          answer = judgementAnswer("undefinedBehavior");
          aliases = judgementAliases("undefinedBehavior");
          code = "#include <vector>\n\nstd::vector<int> values{1, 2, 3};\nauto it = values.begin() + 1;\n\nvalues.erase(values.begin());\nint x = *it;";
        } else if (level === 4) {
          answer = "hi hi";
          promptKey = "lifetimeOutput";
          code = "#include <iostream>\n#include <string>\n#include <utility>\n\nstd::string s = \"hi\";\nauto&& r = std::move(s);\n\nstd::cout << s << \" \" << r;";
        } else {
          answer = "17";
          aliases = ["1 7", "true 7"];
          promptKey = "lifetimeOutput";
          code = "#include <iostream>\n#include <memory>\n\nstd::unique_ptr<int> p(new int(7));\nauto q = std::move(p);\n\nstd::cout << (p == nullptr) << *q;";
        }
        return makeQuestion("lifetime", level, code, answer, promptKey, { answer: answer }, aliases);
      }
    },
    {
      id: "declarations",
      generate: function (level, rng) {
        var n = rng.int(3, 7);
        var answer;
        var aliases = [];
        var code;
        var promptKey = "declarations";
        if (level === 1) {
          answer = "a";
          aliases = ["int* a[4]", "a is array", "a[]"];
          code = "int* a[4];\nint (*b)[4];";
        } else if (level === 2) {
          answer = String(n + 1);
          code = "int convert(int x) {\n  return x + 1;\n}\n\ndouble convert(double x) {\n  return x / 2;\n}\n\nusing Converter = int (*)(int);\nConverter p = convert;\n\nstd::cout << p(" + n + ");";
          promptKey = "declarationsOutput";
        } else if (level === 3) {
          answer = String(n + 2);
          code = "struct S {\n  int x = " + (n + 2) + ";\n  int y = " + n + ";\n};\n\nS s;\nint S::* p = &S::x;\n\nstd::cout << s.*p;";
          promptKey = "declarationsOutput";
        } else if (level === 4) {
          answer = String(n * 2);
          code = "struct S {\n  int twice(int x) const { return x * 2; }\n};\n\nS s;\nint (S::*pm)(int) const = &S::twice;\n\nstd::cout << (s.*pm)(" + n + ");";
          promptKey = "declarationsOutput";
        } else {
          var external = rng.int(4, 8);
          answer = "2 " + external;
          aliases = ["2," + external];
          code = "int x = 1;\n\nauto f = [x]() mutable {\n  return ++x;\n};\n\nx = " + external + ";\nstd::cout << f() << \" \" << x;";
          promptKey = "declarationsOutput";
        }
        return makeQuestion("declarations", level, code, answer, promptKey, { answer: answer }, aliases);
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

  function hasCategory(id) {
    return CATEGORIES.some(function (category) {
      return category.id === id;
    });
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
    if (!hasCategory(merged.manual.categoryId)) merged.manual.categoryId = CATEGORIES[0].id;
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
      '<pre class="prompt-code"><code>' + escapeHtml(currentQuestion.code) + '</code></pre>' +
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
    var normalized = normalizeAnswer(elements.answerInput.value);
    var correct = currentQuestion.aliases.indexOf(normalized) !== -1;
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
    assert("normalize spaces", normalizeAnswer(" const int & ; ") === "const int&");
    assert("normalize comma", normalizeAnswer("1, 2") === "1 2");
    assert("alias set", answerSet("const int&", ["const int &"]).indexOf("const int&") !== -1);
    var rng = makeRng(123);
    CATEGORIES.forEach(function (category) {
      LEVELS.forEach(function (level) {
        var q = category.generate(level, rng);
        assert(category.id + " L" + level + " code", q.code.indexOf("\n") !== -1 || q.code.length > 0);
        assert(category.id + " L" + level + " expected", q.expected.length > 0);
        assert(category.id + " L" + level + " self check", q.aliases.indexOf(normalizeAnswer(q.expected)) !== -1);
      });
    });
    var runtime = getCategory("runtime").generate(4, makeRng(1));
    assert("runtime pair alias", runtime.aliases.indexOf(normalizeAnswer(runtime.expected)) !== -1);
    var runtimeL1 = getCategory("runtime").generate(1, makeRng(3));
    assert("runtime prompt interpolation", runtimeL1.promptNote.indexOf("{") === -1 && runtimeL1.promptNote.indexOf("}") === -1);
    var runtimeL2Answers = {};
    var runtimeL3Answers = {};
    for (var seed = 1; seed <= 24; seed += 1) {
      runtimeL2Answers[getCategory("runtime").generate(2, makeRng(seed)).expected] = true;
      runtimeL3Answers[getCategory("runtime").generate(3, makeRng(seed)).expected] = true;
    }
    assert("runtime L2 varies", Object.keys(runtimeL2Answers).length > 3);
    assert("runtime L3 varies", Object.keys(runtimeL3Answers).length > 1);
    var aliasing = getCategory("aliasing").generate(3, makeRng(2));
    assert("aliasing pair answer", aliasing.expected.indexOf("a=") !== -1 && aliasing.expected.indexOf("b=") !== -1);
    var aliasL1HasPlus = false;
    var aliasL1HasMinus = false;
    var aliasL2Answers = {};
    var aliasL2Variables = {};
    for (var aliasSeed = 1; aliasSeed <= 32; aliasSeed += 1) {
      var aliasL1 = getCategory("aliasing").generate(1, makeRng(aliasSeed));
      aliasL1HasPlus = aliasL1HasPlus || aliasL1.code.indexOf("r +=") !== -1;
      aliasL1HasMinus = aliasL1HasMinus || aliasL1.code.indexOf("r -=") !== -1;
      var aliasL2 = getCategory("aliasing").generate(2, makeRng(aliasSeed));
      aliasL2Answers[aliasL2.expected] = true;
      aliasL2Variables[aliasL2.promptNote] = true;
    }
    assert("aliasing L1 plus and minus", aliasL1HasPlus && aliasL1HasMinus);
    assert("aliasing L2 varies", Object.keys(aliasL2Answers).length > 3 && Object.keys(aliasL2Variables).length > 1);
    var type = getCategory("types").generate(4, makeRng(4));
    assert("compile error alias", type.aliases.indexOf("error") !== -1);
    var resolution = getCategory("resolution").generate(2, makeRng(5));
    assert("resolution output", resolution.aliases.indexOf("lcrr") !== -1);
    var lifetime = getCategory("lifetime").generate(1, makeRng(6));
    assert("ub alias", lifetime.aliases.indexOf("ub") !== -1);
    var declarations = getCategory("declarations").generate(1, makeRng(7));
    assert("declaration expected", declarations.expected === "a");
    return { ok: failures.length === 0, failures: failures };
  }

  window.runSelfTests = runSelfTests;
  window.PracticeLabCppMentalExecution = {
    categories: CATEGORIES,
    runSelfTests: runSelfTests
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
