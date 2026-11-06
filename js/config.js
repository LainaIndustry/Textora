/**
 * Textora - Site Configuration
 * Central configuration for branding, domain, contact, and advertising.
 */
const TEXTORA_CONFIG = {
  // Brand
  brandName: "Textora",
  brandTagline: "Free Online Text Tools",

  // Production domain (no trailing slash)
  siteUrl: "https://textora.example.com",

  // Contact — MUST be a real, monitored email you control
  contactEmail: "textora1counter@gmail.com",

  // Advertising (Google AdSense)
  // IMPORTANT: Keep adsEnabled = false until AdSense approval is granted.
  adsEnabled: false,
  adsensePublisherId: "",
  adsenseAutoAds: false,

  // Reading / speaking assumptions
  defaultReadingWPM: 238,
  defaultSpeakingWPM: 150,

  // Footer
  copyrightStartYear: 2025
};

if (typeof window !== "undefined") {
  window.TEXTORA_CONFIG = TEXTORA_CONFIG;
}
