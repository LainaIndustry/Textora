/**
 * Textora - Text transformation tools
 * Handles: case conversion, space removal, duplicate line removal,
 * find & replace, sorting, reversal, line break removal.
 */
(function () {
  "use strict";

  const S = window.Textora;

  function bindTransform(root) {
    const input = root.querySelector("[data-text-input]");
    const output = root.querySelector("[data-text-output]");
    const action = root.getAttribute("data-transform");
    const runBtn = root.querySelector("[data-run]");
    const copyBtn = root.querySelector("[data-copy]");
    const clearBtn = root.querySelector("[data-clear]");
    const dlBtn = root.querySelector("[data-download]");
    const msg = root.querySelector("[data-message]");

    if (!input || !output) return;

    // Additional controls
    const findInput = root.querySelector("[data-find]");
    const replaceInput = root.querySelector("[data-replace]");
    const matchCase = root.querySelector("[data-match-case]");
    const useRegex = root.querySelector("[data-use-regex]");
    const sortOrder = root.querySelector("[data-sort-order]");
    const removeEmpty = root.querySelector("[data-remove-empty]");

    function transform(text) {
      switch (action) {
        case "uppercase":
          return text.toUpperCase();
        case "lowercase":
          return text.toLowerCase();
        case "titlecase":
          return text.replace(/\w\S*/g, function (w) {
            return w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
          });
        case "sentencecase":
          return text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s+\w)/g, function (c) {
              return c.toUpperCase();
            });
        case "remove-extra-spaces":
          return text
            .replace(/[ \t]+/g, " ")
            .replace(/ *\n */g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        case "remove-line-breaks":
          return text.replace(/\r?\n+/g, " ").replace(/[ \t]+/g, " ").trim();
        case "reverse":
          return text.split("").reverse().join("");
        case "reverse-lines":
          return text.split(/\r?\n/).reverse().join("\n");
        case "reverse-words":
          return text.split(/\s+/).reverse().join(" ");
        case "remove-duplicate-lines": {
          const lines = text.split(/\r?\n/);
          const seen = new Set();
          const out = [];
          lines.forEach(function (line) {
            if (removeEmpty && removeEmpty.checked && !line.trim()) return;
            if (!seen.has(line)) {
              seen.add(line);
              out.push(line);
            }
          });
          return out.join("\n");
        }
        case "sort-lines": {
          const lines = text.split(/\r?\n/).filter(function (l) {
            return !(removeEmpty && removeEmpty.checked && !l.trim());
          });
          const order = sortOrder ? sortOrder.value : "asc";
          lines.sort(function (a, b) {
            return a.localeCompare(b);
          });
          if (order === "desc") lines.reverse();
          if (order === "numeric") lines.sort(function (a, b) { return parseFloat(a) - parseFloat(b); });
          if (order === "length") lines.sort(function (a, b) { return a.length - b.length; });
          return lines.join("\n");
        }
        case "find-replace": {
          if (!findInput || !findInput.value) return text;
          const find = findInput.value;
          const repl = replaceInput ? replaceInput.value : "";
          if (useRegex && useRegex.checked) {
            try {
              const flags = matchCase && matchCase.checked ? "g" : "gi";
              const re = new RegExp(find, flags);
              return text.replace(re, repl);
            } catch (e) {
              S.setMessage(msg, "Invalid regular expression: " + e.message, "error");
              return text;
            }
          }
          if (matchCase && matchCase.checked) {
            return text.split(find).join(repl);
          }
          const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          return text.replace(re, repl);
        }
        default:
          return text;
      }
    }

    function run() {
      const result = transform(input.value);
      output.value = result;
      if (msg) S.setMessage(msg, result ? "Done." : "Enter text to transform.", result ? "success" : "info");
    }

    if (runBtn) runBtn.addEventListener("click", run);
    input.addEventListener("input", function () {
      if (runBtn) return; // require explicit run for some tools
      run();
    });

    // Auto-run tools (most transformations): only run on demand for find/replace & sort
    const autoRun = ["uppercase", "lowercase", "titlecase", "sentencecase", "remove-extra-spaces", "remove-line-breaks", "reverse", "reverse-lines", "reverse-words", "remove-duplicate-lines"].indexOf(action) !== -1;
    if (autoRun) {
      input.addEventListener("input", run);
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        S.copyToClipboard(output.value, function () {
          S.setMessage(msg, "Copied to clipboard.", "success");
        }, function (err) {
          S.setMessage(msg, err, "error");
        });
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        output.value = "";
        if (findInput) findInput.value = "";
        if (replaceInput) replaceInput.value = "";
        S.setMessage(msg, "Cleared.", "success");
        input.focus();
      });
    }
    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        if (!output.value) {
          S.setMessage(msg, "Nothing to download.", "error");
          return;
        }
        S.downloadText("textora-" + action + ".txt", output.value);
        S.setMessage(msg, "Download started.", "success");
      });
    }

    // Initial run
    run();
  }

  function init() {
    document.querySelectorAll("[data-transform]").forEach(bindTransform);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
