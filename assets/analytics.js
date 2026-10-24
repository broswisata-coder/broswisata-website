(function () {
  "use strict";

  if (window.__brosAnalyticsInitialized) return;
  window.__brosAnalyticsInitialized = true;

  // First-party statistics stay disabled until the protected backend is configured.
  // This does not create another Google tag or another WhatsApp click listener.
  if (!document.querySelector('script[src="/assets/bros-stats.js"]')) {
    var statsScript = document.createElement("script");
    statsScript.async = true;
    statsScript.src = "/assets/bros-stats.js";
    document.head.appendChild(statsScript);
  }

  var MEASUREMENT_ID = "G-JVH9HY8P8P";

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });

  if (
    !document.querySelector(
      'script[src*="googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID + '"]'
    )
  ) {
    var script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }
})();
