(function (global) {
  "use strict";

  var gridBindings = new WeakMap();

  function requireElement(value, name) {
    if (!value || typeof value.appendChild !== "function") {
      throw new TypeError((name || "element") + " must be a DOM element");
    }
    return value;
  }

  function cacheElements(ids, root) {
    var scope = root || document;
    var result = {};
    ids.forEach(function (id) {
      var element = scope.getElementById(id);
      if (!element) throw new Error("Missing element #" + id);
      result[id] = element;
    });
    return result;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatSeconds(milliseconds) {
    return Math.max(0, milliseconds / 1000).toFixed(1) + "s";
  }

  function formatMinutes(milliseconds) {
    return Math.max(0, Math.round(milliseconds / 60000)) + "m";
  }

  function readJson(key, storage) {
    try {
      var raw = (storage || global.localStorage).getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function writeJson(key, value, storage) {
    try {
      (storage || global.localStorage).setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function unlockedLevels(levels, getStat, options) {
    if (!Array.isArray(levels)) throw new TypeError("levels must be an array");
    if (typeof getStat !== "function") throw new TypeError("getStat must be a function");
    if (!levels.length) return [];
    var settings = options || {};
    var minimumAttempts = settings.minimumAttempts === undefined ? 5 : Number(settings.minimumAttempts);
    var masteryThreshold = settings.masteryThreshold === undefined ? 80 : Number(settings.masteryThreshold);
    var unlocked = [levels[0]];
    for (var index = 1; index < levels.length; index += 1) {
      var previous = getStat(levels[index - 1]) || {};
      if (Number(previous.attempts) < minimumAttempts || Number(previous.mastery) < masteryThreshold) break;
      unlocked.push(levels[index]);
    }
    return unlocked;
  }

  async function copyText(text, documentObject, navigatorObject) {
    var nav = navigatorObject || global.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
      try {
        await nav.clipboard.writeText(String(text));
        return true;
      } catch (error) {
        // The fallback also works for file:// pages where Clipboard may be denied.
      }
    }
    var doc = documentObject || global.document;
    if (!doc || typeof doc.createElement !== "function") return false;
    var textarea = doc.createElement("textarea");
    textarea.value = String(text);
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    doc.body.appendChild(textarea);
    textarea.select();
    var copied = false;
    try { copied = doc.execCommand("copy"); } catch (error) {}
    textarea.remove();
    return copied;
  }

  function validateCell(cell, rowIndex, columnIndex) {
    if (!Array.isArray(cell) || cell.length < 2 || cell.length > 3) {
      throw new TypeError("Input cell " + rowIndex + ":" + columnIndex + " must be [label, callback, options?]");
    }
    if (typeof cell[1] !== "function") {
      throw new TypeError("Input cell " + rowIndex + ":" + columnIndex + " callback must be a function");
    }
    var options = cell[2] === undefined ? {} : cell[2];
    if (!options || typeof options !== "object" || Array.isArray(options)) {
      throw new TypeError("Input cell " + rowIndex + ":" + columnIndex + " options must be an object");
    }
    if (options.variant && !["default", "function", "primary"].includes(options.variant)) {
      throw new TypeError("Unknown input-cell variant: " + options.variant);
    }
    if (options.colspan !== undefined && (!Number.isInteger(options.colspan) || options.colspan < 1)) {
      throw new TypeError("Input-cell colspan must be a positive integer");
    }
    return options;
  }

  function renderInputGrid(container, rows, options) {
    requireElement(container, "container");
    if (!Array.isArray(rows) || rows.some(function (row) { return !Array.isArray(row); })) {
      throw new TypeError("rows must be an array of input-cell rows");
    }
    var previous = gridBindings.get(container);
    if (previous) container.removeEventListener("pointerdown", previous);
    var preserveFocus = function (event) {
      if (event.target && event.target.closest && event.target.closest("button")) event.preventDefault();
    };
    container.addEventListener("pointerdown", preserveFocus);
    gridBindings.set(container, preserveFocus);
    container.replaceChildren();
    container.classList.add("input-grid");
    if (options && options.ariaLabel) container.setAttribute("aria-label", options.ariaLabel);

    var namedButtons = new Map();
    rows.forEach(function (row, rowIndex) {
      var rowElement = container.ownerDocument.createElement("div");
      rowElement.className = "input-grid-row";
      row.forEach(function (cell, columnIndex) {
        var cellOptions = validateCell(cell, rowIndex, columnIndex);
        var button = container.ownerDocument.createElement("button");
        button.type = "button";
        button.textContent = String(cell[0]);
        button.disabled = Boolean(cellOptions.disabled);
        if (cellOptions.variant && cellOptions.variant !== "default") button.classList.add(cellOptions.variant);
        if (cellOptions.colspan) button.style.gridColumn = "span " + cellOptions.colspan;
        if (cellOptions.ariaLabel) button.setAttribute("aria-label", cellOptions.ariaLabel);
        if (cellOptions.id) {
          if (namedButtons.has(cellOptions.id)) throw new Error("Duplicate input-cell id: " + cellOptions.id);
          button.dataset.inputId = cellOptions.id;
          namedButtons.set(cellOptions.id, button);
        }
        button.addEventListener("click", function (event) { cell[1](event, button); });
        rowElement.appendChild(button);
      });
      container.appendChild(rowElement);
    });
    return namedButtons;
  }

  function createInputEvent(target) {
    var view = target.ownerDocument && target.ownerDocument.defaultView;
    var EventConstructor = view && view.Event ? view.Event : global.Event;
    return typeof EventConstructor === "function" ? new EventConstructor("input", { bubbles: true }) : null;
  }

  function createTextEditor(getTarget) {
    if (typeof getTarget !== "function") throw new TypeError("getTarget must be a function");

    function target() {
      var value = getTarget();
      return value && typeof value.value === "string" && !value.disabled ? value : null;
    }

    function selection(input) {
      var start = typeof input.selectionStart === "number" ? input.selectionStart : input.value.length;
      var end = typeof input.selectionEnd === "number" ? input.selectionEnd : start;
      return [start, end];
    }

    function finish(input, caret) {
      if (typeof input.setSelectionRange === "function") input.setSelectionRange(caret, caret);
      var event = createInputEvent(input);
      if (event && typeof input.dispatchEvent === "function") input.dispatchEvent(event);
    }

    function insertValue(text) {
      return function () {
        var input = target();
        if (!input) return;
        var range = selection(input);
        var value = String(text);
        input.value = input.value.slice(0, range[0]) + value + input.value.slice(range[1]);
        finish(input, range[0] + value.length);
      };
    }

    function backspace() {
      var input = target();
      if (!input) return;
      var range = selection(input);
      var start = range[0];
      if (start === range[1] && start > 0) {
        var prefix = Array.from(input.value.slice(0, start));
        prefix.pop();
        var shortened = prefix.join("");
        start = shortened.length;
        input.value = shortened + input.value.slice(range[1]);
      } else {
        input.value = input.value.slice(0, start) + input.value.slice(range[1]);
      }
      finish(input, start);
    }

    function clear() {
      var input = target();
      if (!input) return;
      input.value = "";
      finish(input, 0);
    }

    return Object.freeze({ insert: insertValue, backspace: backspace, clear: clear });
  }

  function createPracticeSelectors(config) {
    var categorySelect = requireElement(config.categorySelect, "categorySelect");
    var familySelect = requireElement(config.familySelect, "familySelect");
    var levelSelect = requireElement(config.levelSelect, "levelSelect");
    var categories = config.categories || [];
    var families = config.families || [];
    var levelLabel = config.levelLabel || function (level) { return "Level " + level; };
    if (typeof config.onSelect !== "function") throw new TypeError("onSelect must be a function");
    var current = null;

    function familyById(id) { return families.find(function (family) { return family.id === id; }); }
    function categoryFamilies(id) { return families.filter(function (family) { return family.categoryId === id && (!config.familyFilter || config.familyFilter(family)); }); }
    function addOption(select, value, label) {
      var option = select.ownerDocument.createElement("option");
      option.value = String(value);
      option.textContent = String(label);
      select.appendChild(option);
    }
    function render(state) {
      var family = familyById(state.familyId) || families[0];
      if (!family) throw new Error("Practice selectors require at least one family");
      var levels = family.levels || [];
      var level = levels.includes(Number(state.level)) ? Number(state.level) : levels[0];
      current = { categoryId: family.categoryId, familyId: family.id, level: level };
      categorySelect.replaceChildren();
      categories.forEach(function (category) { addOption(categorySelect, category.id, category.title); });
      categorySelect.value = current.categoryId;
      familySelect.replaceChildren();
      categoryFamilies(current.categoryId).forEach(function (item) { addOption(familySelect, item.id, item.title); });
      familySelect.value = current.familyId;
      levelSelect.replaceChildren();
      levels.forEach(function (item) { addOption(levelSelect, item, levelLabel(item)); });
      levelSelect.value = String(current.level);
      categorySelect.disabled = false;
      familySelect.disabled = false;
      levelSelect.disabled = false;
      return current;
    }
    function emit(source, family, level) {
      var state = render({ familyId: family.id, level: level });
      config.onSelect({ categoryId: state.categoryId, familyId: state.familyId, level: state.level, source: source });
    }
    function onCategory() {
      var family = categoryFamilies(categorySelect.value)[0];
      if (family) emit("category", family, (family.levels || [1])[0]);
    }
    function onFamily() {
      var family = familyById(familySelect.value);
      if (family) emit("family", family, (family.levels || [1])[0]);
    }
    function onLevel() {
      var family = familyById(familySelect.value) || familyById(current && current.familyId);
      if (family) emit("level", family, Number(levelSelect.value));
    }
    categorySelect.addEventListener("change", onCategory);
    familySelect.addEventListener("change", onFamily);
    levelSelect.addEventListener("change", onLevel);
    return Object.freeze({
      render: render,
      destroy: function () {
        categorySelect.removeEventListener("change", onCategory);
        familySelect.removeEventListener("change", onFamily);
        levelSelect.removeEventListener("change", onLevel);
      }
    });
  }

  global.PracticeLabUI = Object.freeze({
    cacheElements: cacheElements,
    escapeHtml: escapeHtml,
    formatSeconds: formatSeconds,
    formatMinutes: formatMinutes,
    readJson: readJson,
    writeJson: writeJson,
    unlockedLevels: unlockedLevels,
    copyText: copyText,
    renderInputGrid: renderInputGrid,
    createTextEditor: createTextEditor,
    createPracticeSelectors: createPracticeSelectors
  });
})(window);
