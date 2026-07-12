(function () {
  if (window.__brosWhatsappSourceInitialized) return;
  window.__brosWhatsappSourceInitialized = true;

  var AHMAD_PHONE = "6281260139399";
  var SOURCE_MARKER = "[WEB INQUIRY - BROS WISATA]";
  var ATTRIBUTION_KEY = "bros_attribution_v1";

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 90);
  }

  function cleanParam(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 80);
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
    if (path.indexOf("custom-tour") !== -1) return "custom_tour";
    if (path.indexOf("meet-ahmad") !== -1) return "meet_ahmad";
    if (path.indexOf("responsible-travel") !== -1) return "responsible_travel";
    if (path.indexOf("tour-listing") !== -1) return "tour_listing";
    if (
      path.indexOf("private-north-sumatra-tour") !== -1 ||
      path.indexOf("private-tour-sumatra-utara") !== -1 ||
      path.indexOf("pakej-private-tour-sumatera-utara") !== -1 ||
      path.indexOf("bukit-lawang-orangutan-trekking") !== -1 ||
      path.indexOf("wisata-bukit-lawang-orangutan") !== -1 ||
      path.indexOf("lake-toba-samosir-private-tour") !== -1 ||
      path.indexOf("private-tour-lake-toba-samosir") !== -1 ||
      path.indexOf("pakej-lake-toba-samosir") !== -1 ||
      path.indexOf("singapore-to-north-sumatra-tour") !== -1 ||
      path.indexOf("tour-sumatra-utara-dari-singapore") !== -1 ||
      path.indexOf("pakej-sumatera-utara-dari-singapore") !== -1
    ) {
      return "seo_landing";
    }
    if (path.indexOf("destination") !== -1 || path.indexOf("destinasi") !== -1) return "destination";
    if (path.indexOf("paket-") !== -1) return "tour_detail";
    if (path.indexOf("car-rental") !== -1) return "transport_paused";
    if (path.indexOf("about") !== -1) return "about";
    if (path.indexOf("privacy-policy") !== -1 || path.indexOf("terms-of-service") !== -1) return "legal";
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

  function readStoredAttribution() {
    try {
      var raw = window.sessionStorage && window.sessionStorage.getItem(ATTRIBUTION_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writeStoredAttribution(value) {
    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
      }
    } catch (error) {
      // Attribution is helpful, but WhatsApp links must keep working without storage.
    }
  }

  function captureAttribution() {
    try {
      var params = new URLSearchParams(window.location.search || "");
      var current = readStoredAttribution();
      var next = {
        source: cleanParam(params.get("utm_source") || current.source || ""),
        medium: cleanParam(params.get("utm_medium") || current.medium || ""),
        campaign: cleanParam(params.get("utm_campaign") || current.campaign || ""),
        content: cleanParam(params.get("utm_content") || current.content || ""),
        term: cleanParam(params.get("utm_term") || current.term || ""),
        referrer: cleanParam(current.referrer || document.referrer || ""),
        landing_path: cleanParam(current.landing_path || window.location.pathname),
        captured_at: current.captured_at || new Date().toISOString()
      };

      if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) {
        next.ad_click = "google_ads";
        if (!next.source) next.source = "google";
        if (!next.medium) next.medium = "cpc";
      } else {
        next.ad_click = cleanParam(current.ad_click || "");
      }

      if (next.source || next.medium || next.campaign || next.ad_click || next.referrer) {
        writeStoredAttribution(next);
      }
    } catch (error) {
      // Ignore attribution parsing errors.
    }
  }

  function attributionLines() {
    var data = readStoredAttribution();
    var lines = [];
    var traffic = [data.source, data.medium].filter(Boolean).join("/");

    if (traffic) lines.push("Traffic: " + traffic);
    if (data.campaign) lines.push("Campaign: " + data.campaign);
    if (data.content) lines.push("Content: " + data.content);
    if (data.term) lines.push("Keyword: " + data.term);
    if (data.ad_click) lines.push("Ad Click: " + data.ad_click);
    if (data.landing_path && data.landing_path !== window.location.pathname) {
      lines.push("Landing: " + data.landing_path);
    }

    return lines;
  }

  function setClarityContext() {
    var attr = readStoredAttribution();
    withClarity(function (clarity) {
      clarity("set", "site", "broswisata");
      clarity("set", "language", pageLanguage());
      clarity("set", "market", marketSegment());
      clarity("set", "page_type", pageType());
      clarity("set", "page_path", window.location.pathname);
      if (attr.source) clarity("set", "utm_source", attr.source);
      if (attr.medium) clarity("set", "utm_medium", attr.medium);
      if (attr.campaign) clarity("set", "utm_campaign", attr.campaign);
      if (attr.ad_click) clarity("set", "ad_click", attr.ad_click);
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

  function analyticsPayload(anchor) {
    var attr = readStoredAttribution();
    return {
      event_category: "Contact",
      event_label: ctaName(anchor),
      page_path: window.location.pathname,
      page_language: pageLanguage(),
      market_segment: marketSegment(),
      page_type: pageType(),
      traffic_source: attr.source || "",
      traffic_medium: attr.medium || "",
      traffic_campaign: attr.campaign || "",
      ad_click: attr.ad_click || ""
    };
  }

  function trackAnalyticsWhatsapp(anchor) {
    if (typeof window.gtag === "function") {
      var payload = analyticsPayload(anchor);
      window.gtag("event", "whatsapp_click", payload);
      window.gtag("event", "lead_whatsapp_inquiry", payload);
    }

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "WhatsAppLead", analyticsPayload(anchor));
    }
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
    attributionLines().forEach(function (line) {
      lines.push(line);
    });
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
      captureAttribution();
      refreshWhatsappLinks();
      setClarityContext();
    });
  } else {
    captureAttribution();
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
        trackAnalyticsWhatsapp(anchor);
      }
    },
    true
  );
})();
