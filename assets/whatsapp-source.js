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
    document.addEventListener("DOMContentLoaded", refreshWhatsappLinks);
  } else {
    refreshWhatsappLinks();
  }

  document.addEventListener(
    "click",
    function (event) {
      var anchor = event.target.closest && event.target.closest('a[href*="wa.me"]');
      if (anchor) updateWhatsappLink(anchor);
    },
    true
  );
})();
