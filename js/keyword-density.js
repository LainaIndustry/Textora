/**
 * Textora - Keyword density & word frequency
 */
(function () {
  "use strict";

  const STOP_WORDS = new Set([
    "a","an","and","are","as","at","be","but","by","for","from","has","have","he","her",
    "his","i","in","is","it","its","of","on","or","that","the","their","they","this","to",
    "was","were","will","with","you","your","we","our","us","me","my","mine","them","those",
    "these","there","here","what","which","who","whom","whose","when","where","why","how",
    "all","any","both","each","few","more","most","other","some","such","no","nor","not",
    "only","own","same","so","than","too","very","can","just","should","now","also","into",
    "about","after","before","over","under","again","further","then","once","if","because",
    "while","during","through","above","below","up","down","out","off","between","against",
    "am","been","being","do","does","did","doing","had","having","could","would","might",
    "must","shall","may","its","it's"
  ]);

  function init() {
    const root = document.querySelector("[data-keyword-density]");
    if (!root) return;

    const input = root.querySelector("[data-text-input]");
    const results = root.querySelector("[data-keyword-results]");
    const excludeStop = root.querySelector("[data-exclude-stop]");
    const totalEl = root.querySelector("[data-keyword-total]");
    const emptyEl = root.querySelector("[data-keyword-empty]");

    if (!input || !results) return;

    const S = window.Textora;

    function analyze() {
      const text = input.value;
      const words = S.getWordList(text);
      const denominator = words.length;

      if (totalEl) totalEl.textContent = denominator.toLocaleString();

      if (!denominator) {
        results.innerHTML = "";
        if (emptyEl) emptyEl.hidden = false;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;

      const stop = excludeStop && excludeStop.checked;
      const counts = new Map();
      words.forEach(function (w) {
        if (stop && STOP_WORDS.has(w)) return;
        counts.set(w, (counts.get(w) || 0) + 1);
      });

      const sorted = Array.from(counts.entries())
        .sort(function (a, b) {
          if (b[1] !== a[1]) return b[1] - a[1];
          return a[0].localeCompare(b[0]);
        })
        .slice(0, 25);

      const max = sorted.length ? sorted[0][1] : 1;

      const rows = sorted
        .map(function (entry) {
          const word = entry[0];
          const count = entry[1];
          const pct = ((count / denominator) * 100).toFixed(2);
          const width = Math.max(4, Math.round((count / max) * 100));
          return (
            '<tr>' +
            "<td>" + S.escapeHtml(word) + "</td>" +
            "<td>" + count + "</td>" +
            "<td>" + pct + "%</td>" +
            '<td><span class="bar" style="width:' + width + '%" aria-hidden="true"></span></td>' +
            "</tr>"
          );
        })
        .join("");

      results.innerHTML =
        '<table class="keyword-table">' +
        "<thead><tr><th>Word</th><th>Count</th><th>Density</th><th>Frequency</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    input.addEventListener("input", analyze);
    if (excludeStop) excludeStop.addEventListener("change", analyze);
    analyze();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
