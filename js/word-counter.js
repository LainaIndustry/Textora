/**
 * Textora - Word Counter (homepage editor + word-counter tool page)
 */
(function () {
  "use strict";

  function initEditor() {
    const root = document.querySelector("[data-word-counter]");
    if (!root) return;

    const input = root.querySelector("[data-text-input]");
    if (!input) return;

    const S = window.Textora;
    const fields = {
      words: root.querySelector("[data-stat-words]"),
      chars: root.querySelector("[data-stat-chars]"),
      charsNoSpaces: root.querySelector("[data-stat-chars-no-spaces]"),
      sentences: root.querySelector("[data-stat-sentences]"),
      paragraphs: root.querySelector("[data-stat-paragraphs]"),
      unique: root.querySelector("[data-stat-unique]"),
      avgLen: root.querySelector("[data-stat-avg-length]"),
      reading: root.querySelector("[data-stat-reading]"),
      speaking: root.querySelector("[data-stat-speaking]")
    };

    const goalInput = root.querySelector("[data-goal-input]");
    const goalProgress = root.querySelector("[data-goal-progress]");
    const goalStatus = root.querySelector("[data-goal-status]");
    const message = root.querySelector("[data-editor-message]");

    function update() {
      const text = input.value;
      const words = S.countWords(text);

      if (fields.words) fields.words.textContent = words.toLocaleString();
      if (fields.chars) fields.chars.textContent = S.countCharacters(text).toLocaleString();
      if (fields.charsNoSpaces)
        fields.charsNoSpaces.textContent = S.countCharactersNoSpaces(text).toLocaleString();
      if (fields.sentences) fields.sentences.textContent = S.countSentences(text);
      if (fields.paragraphs) fields.paragraphs.textContent = S.countParagraphs(text);
      if (fields.unique) fields.unique.textContent = S.countUniqueWords(text);
      if (fields.avgLen) fields.avgLen.textContent = S.averageWordLength(text).toFixed(1);
      if (fields.reading)
        fields.reading.textContent = S.formatMinutes(
          S.readingTimeMinutes(text, window.TEXTORA_CONFIG.defaultReadingWPM)
        );
      if (fields.speaking)
        fields.speaking.textContent = S.formatMinutes(
          S.speakingTimeMinutes(text, window.TEXTORA_CONFIG.defaultSpeakingWPM)
        );

      updateGoal(words);
    }

    function updateGoal(words) {
      if (!goalInput || !goalProgress) return;
      const goal = parseInt(goalInput.value, 10);
      if (!goal || goal <= 0) {
        goalProgress.textContent = "";
        if (goalStatus) goalStatus.textContent = "";
        return;
      }
      const pct = Math.min(100, Math.round((words / goal) * 100));
      goalProgress.style.width = pct + "%";
      goalProgress.setAttribute("aria-valuenow", String(pct));
      if (goalStatus) {
        goalStatus.textContent = words + " / " + goal + " words (" + pct + "%)";
      }
    }

    input.addEventListener("input", update);
    if (goalInput) goalInput.addEventListener("input", update);

    // Clear
    const clearBtn = root.querySelector("[data-clear]");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        update();
        S.setMessage(message, "Text cleared.", "success");
        input.focus();
      });
    }

    // Copy
    const copyBtn = root.querySelector("[data-copy]");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        S.copyToClipboard(
          input.value,
          function () {
            S.setMessage(message, "Text copied to clipboard.", "success");
          },
          function (err) {
            S.setMessage(message, err, "error");
          }
        );
      });
    }

    // Download
    const dlBtn = root.querySelector("[data-download]");
    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        if (!input.value.trim()) {
          S.setMessage(message, "Nothing to download. Enter some text first.", "error");
          return;
        }
        S.downloadText("textora-text.txt", input.value);
        S.setMessage(message, "Download started.", "success");
      });
    }

    // Paste helper
    const pasteBtn = root.querySelector("[data-paste]");
    if (pasteBtn) {
      pasteBtn.addEventListener("click", function () {
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then(
            function (txt) {
              input.value = txt;
              update();
              S.setMessage(message, "Pasted from clipboard.", "success");
            },
            function () {
              S.setMessage(
                message,
                "Clipboard read permission denied. Please paste manually (Ctrl/Cmd + V).",
                "error"
              );
            }
          );
        } else {
          S.setMessage(message, "Paste manually using Ctrl/Cmd + V.", "info");
          input.focus();
        }
      });
    }

    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditor);
  } else {
    initEditor();
  }
})();
