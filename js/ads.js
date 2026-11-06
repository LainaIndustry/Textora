/**
 * Textora - Advertising Loader
 * Loads Google AdSense only when explicitly enabled in config.
 * No third-party ad scripts are loaded while adsEnabled is false.
 * No placeholder boxes are rendered while adsEnabled is false.
 */
(function () {
  "use strict";

  const cfg = window.TEXTORA_CONFIG || {};

  function loadAdSense() {
    if (!cfg.adsEnabled) return;
    if (!cfg.adsensePublisherId) {
      console.warn("[Textora] adsEnabled is true but adsensePublisherId is empty.");
      return;
    }
    if (document.querySelector('script[data-textora-adsense]')) return;

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      encodeURIComponent(cfg.adsensePublisherId);
    script.crossOrigin = "anonymous";
    script.setAttribute("data-textora-adsense", "true");
    document.head.appendChild(script);
  }

  function renderSlots() {
    const slots = document.querySelectorAll("[data-ad-slot]");
    slots.forEach(function (slot) {
      // Clear any previous content
      slot.innerHTML = "";

      if (cfg.adsEnabled && cfg.adsensePublisherId) {
        // Populate a real ad unit
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", cfg.adsensePublisherId);
        ins.setAttribute("data-ad-slot", slot.getAttribute("data-ad-slot") || "");
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        slot.appendChild(ins);
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          /* AdSense not loaded yet; will retry on next push */
        }
      }
      // When adsEnabled is false: render nothing at all.
      // The container stays in the DOM (empty), takes up zero height,
      // and no "Ad space" placeholder box is shown to visitors.
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadAdSense();
    renderSlots();
  });
})();
