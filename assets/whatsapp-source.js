(function () {
  var AHMAD_PHONE = "6281260139399";
  var SOURCE_MARKER = "[WEB INQUIRY - BROS WISATA]";

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 90);
  }

  function pageLanguage() {
    var path = window.location.pathname;
    if (path.indexOf("/id/") === 0) return "ID";
    if (path.indexOf("/ms/") === 0) return "MS";
    return "EN";
  }

  function marketSegment() {
    var lang = pageLanguage();
    if (lang === "MS") return "malaysia_singapore";
    if (lang === "ID") return "indonesia_domestic";
    return "europe_global";
  }

  function pageType() {
    var path = window.location.pathname;
    if (/\/(en|id|ms)\/?$/.test(path)) return "homepage";
    if (path.indexOf("contact") !== -1) return "contact";
    if (path.indexOf("meet-ahmad") !== -1) return "meet_ahmad";
    if (path.indexOf("responsible-travel") !== -1) return "responsible_travel";
    if (path.indexOf("tour-listing") !== -1) return "tour_listing";
    if (path.indexOf("destination") !== -1 || path.indexOf("destinasi") !== -1) return "destination";
    if (path.indexOf("paket-") !== -1) return "tour_detail";
    if (path.indexOf("car-rental") !== -1) return "transport_paused";
    if (path.indexOf("about") !== -1) return "about";
    return "content";
  }

  function withClarity(callback) {
    if (typeof window.clarity === "function") {
      callback(window.clarity);
      return;
    }

    window.clarity = function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    callback(window.clarity);
  }

  function setClarityContext() {
    withClarity(function (clarity) {
      clarity("set", "site", "broswisata");
      clarity("set", "language", pageLanguage());
      clarity("set", "market", marketSegment());
      clarity("set", "page_type", pageType());
      clarity("set", "page_path", window.location.pathname);
    });
  }

  function trackClarityWhatsapp(anchor) {
    var cta = ctaName(anchor);
    var section = sectionName(anchor) || "none";
    withClarity(function (clarity) {
      clarity("set", "last_whatsapp_cta", cta);
      clarity("set", "last_whatsapp_section", section);
      clarity("set", "last_whatsapp_page", window.location.pathname);
      clarity("event", "whatsapp_click");
      clarity("event", "lead_whatsapp_inquiry");
      clarity("upgrade", "lead_whatsapp_inquiry");
    });
  }

  function sectionName(anchor) {
    var section = anchor.closest && anchor.closest("section[id]");
    return section ? section.id : "";
  }

  function ctaName(anchor) {
    return cleanText(
      anchor.getAttribute("data-cta") ||
        anchor.getAttribute("aria-label") ||
        anchor.textContent ||
        "whatsapp_cta"
    );
  }

  function sourceHeader(anchor) {
    var lang = pageLanguage();
    var section = sectionName(anchor);
    var lines = [
      SOURCE_MARKER,
      "Source: broswisata.id" + window.location.pathname,
      "Language: " + lang,
      "CTA: " + ctaName(anchor)
    ];

    if (section) lines.push("Section: " + section);
    lines.push("");
    return lines.join("\n");
  }

  function isAhmadWhatsapp(url) {
    return (
      /(^|\D)6281260139399(\D|$)/.test(url.pathname + url.search) ||
      url.href.indexOf(AHMAD_PHONE) !== -1
    );
  }

  function updateWhatsappLink(anchor) {
    var rawHref = anchor.getAttribute("href");
    if (!rawHref || rawHref.indexOf("wa.me") === -1) return;

    try {
      var url = new URL(rawHref, window.location.href);
      if (!isAhmadWhatsapp(url)) return;

      var currentText = url.searchParams.get("text") || "";
      if (currentText.indexOf(SOURCE_MARKER) !== -1) return;

      var message = sourceHeader(anchor) + currentText;
      url.searchParams.set("text", message);
      anchor.setAttribute("href", url.toString());
      anchor.setAttribute("data-web-source-ready", "true");
    } catch (error) {
      // Keep the original link usable if URL parsing fails.
    }
  }

  function refreshWhatsappLinks() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(updateWhatsappLink);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      refreshWhatsappLinks();
      setClarityContext();
    });
  } else {
    refreshWhatsappLinks();
    setClarityContext();
  }

  document.addEventListener(
    "click",
    function (event) {
      var anchor = event.target.closest && event.target.closest('a[href*="wa.me"]');
      if (anchor) {
        updateWhatsappLink(anchor);
        trackClarityWhatsapp(anchor);
      }
    },
    true
  );
})();
