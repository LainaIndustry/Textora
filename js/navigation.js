/**
 * Textora - Navigation
 * Mobile menu toggle, hover-to-open dropdowns on desktop,
 * click/keyboard fallback, Escape to close, outside click to close.
 */
(function () {
  "use strict";

  function init() {
    // -------- Mobile hamburger --------
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-primary-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        nav.classList.toggle("is-open", !expanded);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });

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
    }

    // -------- Dropdowns --------
    var dropdowns = Array.prototype.slice.call(
      document.querySelectorAll(".nav-dropdown")
    );

    function closeAll(except) {
      dropdowns.forEach(function (d) {
        if (d !== except) {
          d.classList.remove("is-open");
          var b = d.querySelector("[data-dropdown-toggle]");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    }

    dropdowns.forEach(function (parent) {
      var btn = parent.querySelector("[data-dropdown-toggle]");
      if (!btn) return;

      // Click / tap toggles
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = parent.classList.contains("is-open");
        closeAll(parent);
        if (isOpen) {
          parent.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        } else {
          parent.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });

      // Hover to open (desktop, hover-capable devices only)
      var closeTimer;
      var canHover =
        window.matchMedia &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (canHover) {
        parent.addEventListener("mouseenter", function () {
          clearTimeout(closeTimer);
          closeAll(parent);
          parent.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        });

        parent.addEventListener("mouseleave", function () {
          clearTimeout(closeTimer);
          closeTimer = setTimeout(function () {
            parent.classList.remove("is-open");
            btn.setAttribute("aria-expanded", "false");
          }, 150);
        });
      }

      // Keyboard: focus anywhere in the parent opens it
      parent.addEventListener("focusin", function () {
        parent.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      });
      parent.addEventListener("focusout", function (e) {
        if (!parent.contains(e.relatedTarget)) {
          parent.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Escape closes any open dropdown
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAll(null);
      }
    });

    // Click outside closes all dropdowns
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-dropdown")) {
        closeAll(null);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
