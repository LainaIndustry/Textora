/**
 * Textora - Advertising Loader
 * Loads Google AdSense only when explicitly enabled in config.
 * No third-party ad scripts are loaded while adsEnabled is false.
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

  function renderPlaceholders() {
    const slots = document.querySelectorAll("[data-ad-slot]");
    slots.forEach(function (slot) {
      if (cfg.adsEnabled && cfg.adsensePublisherId) {
        // Populate real ad unit
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
          /* ignore */
        }
      } else {
        // Development placeholder: clearly labeled, hidden from assistive tech
        slot.innerHTML =
          '<div class="ad-placeholder" aria-hidden="true">' +
          '<span class="ad-placeholder__label">Ad space</span>' +
          '<span class="ad-placeholder__hint">Reserved for Google AdSense after approval</span>' +
          "</div>";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadAdSense();
    renderPlaceholders();
  });
})();
