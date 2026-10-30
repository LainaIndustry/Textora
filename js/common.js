/**
 * Textora - Common utilities
 * Shared helpers used by tool scripts and page scripts.
 */
(function () {
  "use strict";

  const T = {};

  // ---- Text statistics -------------------------------------------------
  T.countCharacters = function (text) {
    return text.length;
  };

  T.countCharactersNoSpaces = function (text) {
    return text.replace(/\s/g, "").length;
  };

  T.countWords = function (text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    // Split on whitespace runs. Handles Unicode letters, numbers, punctuation attached to words.
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  T.countSentences = function (text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    // Count sentence-ending punctuation sequences (. ! ? followed by end or whitespace)
    const matches = trimmed.match(/[.!?]+(?=\s|$)/g);
    if (!matches) return 1; // Non-empty text with no punctuation counts as 1 sentence
    return matches.length;
  };

  T.countParagraphs = function (text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\n\s*\n/).filter(function (p) {
      return p.trim().length > 0;
    }).length;
  };

  T.getWordList = function (text) {
    const trimmed = text.trim();
    if (!trimmed) return [];
    return trimmed
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  };

  T.countUniqueWords = function (text) {
    const words = T.getWordList(text);
    return new Set(words).size;
  };

  T.averageWordLength = function (text) {
    const words = T.getWordList(text);
    if (!words.length) return 0;
    const total = words.reduce(function (sum, w) {
      return sum + w.length;
    }, 0);
    return total / words.length;
  };

  T.readingTimeMinutes = function (text, wpm) {
    const words = T.countWords(text);
    const rate = wpm || 238;
    if (words === 0) return 0;
    return words / rate;
  };

  T.speakingTimeMinutes = function (text, wpm) {
    const words = T.countWords(text);
    const rate = wpm || 150;
    if (words === 0) return 0;
    return words / rate;
  };

  T.formatMinutes = function (minutes) {
    if (!minutes || minutes <= 0) return "0 min";
    const totalSeconds = Math.round(minutes * 60);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m === 0) return s + " sec";
    if (s === 0) return m + " min";
    return m + " min " + s + " sec";
  };

  // ---- DOM helpers -----------------------------------------------------
  T.$ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  T.$$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  T.escapeHtml = function (str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  T.setMessage = function (el, message, type) {
    if (!el) return;
    el.textContent = message || "";
    el.className = "form-message" + (type ? " form-message--" + type : "");
  };

  T.copyToClipboard = function (text, onSuccess, onError) {
    if (!text) {
      if (onError) onError("Nothing to copy.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          if (onSuccess) onSuccess();
        },
        function () {
          fallbackCopy(text, onSuccess, onError);
        }
      );
    } else {
      fallbackCopy(text, onSuccess, onError);
    }
  };

  function fallbackCopy(text, onSuccess, onError) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        if (onSuccess) onSuccess();
      } else if (onError) {
        onError("Copy failed. Please select the text and copy manually.");
      }
    } catch (e) {
      if (onError) onError("Copy failed. Please select the text and copy manually.");
    }
  }

  T.downloadText = function (filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "textora-output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // ---- Year injection --------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    const y = new Date().getFullYear();
    T.$$("[data-current-year]").forEach(function (el) {
      el.textContent = y;
    });
    const cfg = window.TEXTORA_CONFIG || {};
    T.$$("[data-brand]").forEach(function (el) {
      if (cfg.brandName) el.textContent = cfg.brandName;
    });
    T.$$("[data-contact-email]").forEach(function (el) {
      if (cfg.contactEmail) {
        if (el.tagName === "A") {
          el.href = "mailto:" + cfg.contactEmail;
          el.textContent = cfg.contactEmail;
        } else {
          el.textContent = cfg.contactEmail;
        }
      }
    });
  });

  window.Textora = T;
})();
