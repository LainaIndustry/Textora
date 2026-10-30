/**
 * Textora - Text statistics page bindings
 * Used by sentence-counter, paragraph-counter, reading-time, speaking-time.
 */
(function () {
  "use strict";

  function init() {
    document.querySelectorAll("[data-stat-tool]").forEach(function (root) {
      const input = root.querySelector("[data-text-input]");
      if (!input) return;
      const S = window.Textora;
      const type = root.getAttribute("data-stat-tool");

      const out = root.querySelector("[data-stat-output]");
      const wordsEl = root.querySelector("[data-stat-words]");
      const charsEl = root.querySelector("[data-stat-chars]");
      const extraEl = root.querySelector("[data-stat-extra]");
      const wpmInput = root.querySelector("[data-wpm-input]");

      function update() {
        const text = input.value;
        const words = S.countWords(text);

        if (wordsEl) wordsEl.textContent = words.toLocaleString();
        if (charsEl) charsEl.textContent = S.countCharacters(text).toLocaleString();

        if (type === "sentence") {
          if (out) out.textContent = S.countSentences(text);
        } else if (type === "paragraph") {
          if (out) out.textContent = S.countParagraphs(text);
        } else if (type === "reading" || type === "speaking") {
          const wpm = wpmInput ? parseInt(wpmInput.value, 10) || (type === "reading" ? 238 : 150) : (type === "reading" ? 238 : 150);
          const minutes = type === "reading" ? S.readingTimeMinutes(text, wpm) : S.speakingTimeMinutes(text, wpm);
          if (out) out.textContent = S.formatMinutes(minutes);
          if (extraEl) extraEl.textContent = wpm + " words per minute assumed";
        }
      }

      input.addEventListener("input", update);
      if (wpmInput) wpmInput.addEventListener("input", update);

      const clearBtn = root.querySelector("[data-clear]");
      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          input.value = "";
          update();
          input.focus();
        });
      }

      update();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
