/**
 * Textora - Lorem Ipsum generator
 */
(function () {
  "use strict";

  const S = window.Textora;

  const WORDS = (
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud " +
    "exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute " +
    "irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur " +
    "excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt " +
    "mollit anim id est laborum"
  ).split(" ");

  function randomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  function generateParagraph(sentences) {
    const parts = [];
    for (let i = 0; i < sentences; i++) {
      const len = 8 + Math.floor(Math.random() * 12);
      const words = [];
      for (let j = 0; j < len; j++) words.push(randomWord());
      parts.push(
        words.join(" ").replace(/^\w/, function (c) {
          return c.toUpperCase();
        }) + "."
      );
    }
    return parts.join(" ");
  }

  function init() {
    const root = document.querySelector("[data-lorem]");
    if (!root) return;

    const count = root.querySelector("[data-lorem-count]");
    const unit = root.querySelector("[data-lorem-unit]");
    const startLorem = root.querySelector("[data-lorem-start]");
    const generate = root.querySelector("[data-lorem-generate]");
    const output = root.querySelector("[data-lorem-output]");
    const copyBtn = root.querySelector("[data-copy]");
    const clearBtn = root.querySelector("[data-clear]");
    const dlBtn = root.querySelector("[data-download]");
    const msg = root.querySelector("[data-message]");

    if (!generate || !output) return;

    function build() {
      const n = parseInt(count && count.value, 10) || 5;
      const u = unit ? unit.value : "paragraphs";
      let text = "";

      if (u === "paragraphs") {
        text = Array.from({ length: n }, function () {
          return generateParagraph(4 + Math.floor(Math.random() * 3));
        }).join("\n\n");
      } else if (u === "sentences") {
        text = generateParagraph(n);
      } else if (u === "words") {
        const words = [];
        for (let i = 0; i < n; i++) words.push(randomWord());
        text = words.join(" ").replace(/^\w/, function (c) {
          return c.toUpperCase();
        }) + ".";
      } else if (u === "paragraphs-html") {
        text = Array.from({ length: n }, function () {
          return "<p>" + generateParagraph(4 + Math.floor(Math.random() * 3)) + "</p>";
        }).join("\n");
      }

      if (startLorem && startLorem.checked && !/^lorem ipsum/i.test(text)) {
        text = "Lorem ipsum " + text.charAt(0).toLowerCase() + text.slice(1);
      }

      output.value = text;
      S.setMessage(msg, "Generated " + n + " " + u + ".", "success");
    }

    generate.addEventListener("click", build);
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
        output.value = "";
        S.setMessage(msg, "Cleared.", "success");
      });
    }
    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        if (!output.value) {
          S.setMessage(msg, "Nothing to download.", "error");
          return;
        }
        S.downloadText("textora-lorem-ipsum.txt", output.value);
      });
    }

    build();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
