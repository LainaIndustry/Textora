/**
 * Textora - Navigation
 * Mobile menu toggle, dropdowns, focus management.
 */
(function () {
  "use strict";

  function init() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-primary-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Dropdown toggles
    document.querySelectorAll("[data-dropdown-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const parent = btn.closest(".nav-dropdown");
        if (!parent) return;
        const isOpen = parent.classList.contains("is-open");
        // close siblings
        document.querySelectorAll(".nav-dropdown.is-open").forEach(function (d) {
          d.classList.remove("is-open");
          const b = d.querySelector("[data-dropdown-toggle]");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          parent.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-dropdown")) {
        document.querySelectorAll(".nav-dropdown.is-open").forEach(function (d) {
          d.classList.remove("is-open");
          const b = d.querySelector("[data-dropdown-toggle]");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
