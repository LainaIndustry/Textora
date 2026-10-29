/**
 * Textora - Site Configuration
 * Central configuration for branding, domain, contact, and advertising.
 * Update these values before production deployment.
 */
const TEXTORA_CONFIG = {
  // Brand
  brandName: "Textora",
  brandTagline: "Free Online Text Tools",

  // Production domain (no trailing slash)
  siteUrl: "https://YOURDOMAIN.com",

  // Contact
  contactEmail: "contact@YOURDOMAIN.com",

  // Advertising (Google AdSense)
  // IMPORTANT: Keep adsEnabled = false until AdSense approval is granted.
  adsEnabled: false,
  adsensePublisherId: "", // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  adsenseAutoAds: false,

  // Reading / speaking assumptions
  defaultReadingWPM: 238,
  defaultSpeakingWPM: 150,

  // Footer
  copyrightStartYear: 2025
};

// Make available globally in browser
if (typeof window !== "undefined") {
  window.TEXTORA_CONFIG = TEXTORA_CONFIG;
}
