/**
 * Textora - Text comparison tool
 * Line-based diff with additions/removals highlighted.
 */
(function () {
  "use strict";

  const S = window.Textora;

  function lcsDiff(a, b) {
    // Simple LCS-based diff on lines
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, function () {
      return new Array(m + 1).fill(0);
    });
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
        else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const result = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        result.push({ type: "same", text: a[i] });
        i++; j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        result.push({ type: "removed", text: a[i] });
        i++;
      } else {
        result.push({ type: "added", text: b[j] });
        j++;
      }
    }
    while (i < n) { result.push({ type: "removed", text: a[i] }); i++; }
    while (j < m) { result.push({ type: "added", text: b[j] }); j++; }
    return result;
  }

  function init() {
    const root = document.querySelector("[data-comparison]");
    if (!root) return;

    const left = root.querySelector("[data-text-left]");
    const right = root.querySelector("[data-text-right]");
    const run = root.querySelector("[data-run]");
    const output = root.querySelector("[data-comparison-output]");
    const summary = root.querySelector("[data-comparison-summary]");
    const msg = root.querySelector("[data-message]");

    if (!left || !right || !output) return;

    function compare() {
      const a = left.value.split(/\r?\n/);
      const b = right.value.split(/\r?\n/);
      const diff = lcsDiff(a, b);
      let added = 0, removed = 0;
      const html = diff
        .map(function (d) {
          if (d.type === "added") added++;
          if (d.type === "removed") removed++;
          const cls = d.type === "added" ? "diff-added" : d.type === "removed" ? "diff-removed" : "diff-same";
          const sign = d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  ";
          return '<div class="diff-line ' + cls + '">' + S.escapeHtml(sign + d.text) + "</div>";
        })
        .join("");
      output.innerHTML = html || '<p class="muted">No content to compare.</p>';
      if (summary) {
        summary.textContent = added + " line(s) added, " + removed + " line(s) removed.";
      }
      S.setMessage(msg, "Comparison complete.", "success");
    }

    if (run) run.addEventListener("click", compare);
    left.addEventListener("input", compare);
    right.addEventListener("input", compare);
    compare();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
