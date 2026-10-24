(function () {
  "use strict";
  if (window.BrosStats) return;

  var SESSION_KEY = "bros_stats_session_v1";
  var OPTOUT_KEY = "bros_stats_optout_v1";
  var TIMEOUT = 30 * 60 * 1000;
  var enabled = false;
  var pending = [];
  var memorySession = null;
  var optedOut = false;
  var storageWorks = true;
  var pageSent = false;
  var configPending = false;
  var canonical = document.querySelector('link[rel="canonical"]');
  var path = window.location.pathname.replace(/\.html$/, "");
  var language = (path.match(/^\/(id|en|ms)(?:\/|$)/) || [])[1] || "en";
  var production = /^(www\.)?broswisata\.id$/.test(window.location.hostname);
  try {
    if (canonical) {
      var url = new URL(canonical.href);
      if (url.hostname === "broswisata.id") path = url.pathname;
    }
    optedOut = window.localStorage.getItem(OPTOUT_KEY) === "1";
  } catch (error) { storageWorks = false; }

  function browserPreference() {
    return navigator.globalPrivacyControl === true ||
      navigator.doNotTrack === "1" || window.doNotTrack === "1";
  }

  function eligible() {
    return production && /^\/(id|en|ms)\//.test(path) && !optedOut && !browserPreference();
  }

  function uuid() {
    if (!window.crypto || !window.crypto.getRandomValues) return null;
    if (window.crypto.randomUUID) return window.crypto.randomUUID();
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    return Array.from(bytes, function (b, i) {
      return ([4, 6, 8, 10].indexOf(i) >= 0 ? "-" : "") + b.toString(16).padStart(2, "0");
    }).join("");
  }

  function source() {
    var params = new URLSearchParams(window.location.search);
    var campaign = String(params.get("utm_source") || "").toLowerCase();
    if (params.has("gclid") || /^(google|google_ads|adwords)$/.test(campaign)) return "google";
    if (/^(bing|microsoft)$/.test(campaign)) return "bing";
    if (/^(facebook|fb|meta)$/.test(campaign)) return "facebook";
    if (/^(instagram|ig)$/.test(campaign)) return "instagram";
    if (campaign) return "other";
    try {
      if (!document.referrer) return "direct";
      var host = new URL(document.referrer).hostname;
      if (/(^|\.)google\.[a-z.]+$/.test(host)) return "google";
      if (/(^|\.)bing\.com$/.test(host)) return "bing";
      if (/(^|\.)(facebook\.com|fb\.com)$/.test(host)) return "facebook";
      if (/(^|\.)instagram\.com$/.test(host)) return "instagram";
      if (/^(www\.)?broswisata\.id$/.test(host)) return "internal";
      return "other";
    } catch (error) { return "other"; }
  }

  function session() {
    var current = memorySession;
    try {
      current = JSON.parse(window.sessionStorage.getItem(SESSION_KEY)) || current;
    } catch (error) { /* An in-memory visit still works without browser storage. */ }
    if (!current || !/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(current.id || "") ||
        !Number.isFinite(current.until) || current.until <= Date.now()) {
      current = { id: uuid(), until: Date.now() + TIMEOUT, source: source() };
    }
    if (!current.id) return null;
    current.until = Date.now() + TIMEOUT;
    if (["direct", "google", "bing", "facebook", "instagram", "other", "internal"].indexOf(current.source) < 0) {
      current.source = "other";
    }
    memorySession = current;
    try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(current)); } catch (error) { /* Optional. */ }
    return current;
  }

  function device() {
    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean") {
      return navigator.userAgentData.mobile ? "mobile" : "desktop";
    }
    if (/iPad|Tablet/i.test(navigator.userAgent)) return "tablet";
    return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop";
  }

  function send(event, target) {
    if (!enabled || !eligible()) return false;
    var current = session();
    var id = uuid();
    if (!current || !id) return false;
    var payload = { id: id, event: event, session: current.id, path: path,
      source: current.source, device: device() };
    if (target) payload.target = target;
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon("/api/stats/event", new Blob([body], { type: "text/plain" }))) return true;
      window.fetch("/api/stats/event", { method: "POST", body: body, keepalive: true,
        credentials: "omit", headers: { "Content-Type": "application/json" } }).catch(function () {});
      return true;
    } catch (error) { return false; }
  }

  function track(event, target) {
    if (["page_view", "whatsapp_click", "package_select"].indexOf(event) < 0 || !eligible()) return false;
    if (event === "package_select" && !/^paket-[a-z0-9_]+$/.test(target || "")) return false;
    if (event !== "package_select") target = undefined;
    if (enabled) return send(event, target);
    if (configPending && pending.length < 10) pending.push([event, target]);
    return false;
  }

  function bootstrap() {
    if (!eligible() || configPending || enabled) return;
    configPending = true;
    window.fetch("/api/stats/config", { credentials: "omit", cache: "no-store" })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (data) {
        enabled = !!(data && data.enabled === true && eligible());
        if (!enabled) { pending = []; return; }
        if (!pageSent) { send("page_view"); pageSent = true; }
        pending.splice(0).forEach(function (item) { send(item[0], item[1]); });
      })
      .catch(function () { pending = []; })
      .finally(function () { configPending = false; });
  }

  var copy = {
    id: { off: "Statistik Bros dinonaktifkan di browser ini.", on: "Statistik Bros diizinkan di browser ini.",
      browser: "Statistik Bros tidak dikirim karena preferensi privasi browser.", disable: "Nonaktifkan statistik Bros", enable: "Izinkan statistik Bros", temporary: "Pilihan hanya berlaku untuk halaman ini karena penyimpanan browser tidak tersedia." },
    en: { off: "Bros statistics are disabled in this browser.", on: "Bros statistics are allowed in this browser.",
      browser: "Bros statistics are not sent because of your browser privacy preference.", disable: "Disable Bros statistics", enable: "Allow Bros statistics", temporary: "This choice only applies to this page because browser storage is unavailable." },
    ms: { off: "Statistik Bros dinyahaktifkan dalam pelayar ini.", on: "Statistik Bros dibenarkan dalam pelayar ini.",
      browser: "Statistik Bros tidak dihantar kerana pilihan privasi pelayar anda.", disable: "Nyahaktifkan statistik Bros", enable: "Benarkan statistik Bros", temporary: "Pilihan hanya terpakai pada halaman ini kerana storan pelayar tidak tersedia." }
  };

  function preferences() {
    var button = document.querySelector("[data-bros-stats-toggle]");
    var status = document.querySelector("[data-bros-stats-status]");
    if (!button || !status) return;
    var c = copy[language];
    function render() {
      button.disabled = browserPreference();
      button.textContent = optedOut ? c.enable : c.disable;
      status.textContent = browserPreference() ? c.browser : (optedOut ? c.off : c.on);
      if (!storageWorks) status.textContent += " " + c.temporary;
    }
    button.addEventListener("click", function () {
      optedOut = !optedOut;
      try { window.localStorage.setItem(OPTOUT_KEY, optedOut ? "1" : "0"); } catch (error) { storageWorks = false; }
      if (optedOut) {
        enabled = false; pending = []; memorySession = null;
        try { window.sessionStorage.removeItem(SESSION_KEY); } catch (error) { /* Optional. */ }
      } else { bootstrap(); }
      render();
    });
    render();
  }

  window.BrosStats = { track: track };
  function ready() {
    preferences();
    bootstrap();
    document.addEventListener("click", function (event) {
      var anchor = event.target.closest && event.target.closest("a[href]");
      if (!anchor) return;
      try {
        var target = new URL(anchor.href, window.location.href);
        if (target.origin !== window.location.origin) return;
        var match = target.pathname.match(/^\/(id|en|ms)\/(paket-[a-z0-9_]+)(?:\.html)?\/?$/);
        if (match) track("package_select", match[2]);
      } catch (error) { /* Links remain usable if their URL cannot be parsed. */ }
    }, true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})();
