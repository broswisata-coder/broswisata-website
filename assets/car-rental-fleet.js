(function () {
  "use strict";

  function track(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  function initFleetFilter() {
    var filterBar = document.querySelector("[data-fleet-filter]");
    if (!filterBar) return;

    var buttons = Array.prototype.slice.call(
      filterBar.querySelectorAll("[data-fleet-filter-button]")
    );
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-fleet-item]")
    );
    var count = document.querySelector("[data-fleet-count]");
    var countTemplate = count ? count.getAttribute("data-count-template") : "{count}";

    function applyFilter(filter, label) {
      var visible = 0;

      buttons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-filter") === filter ? "true" : "false"
        );
      });

      cards.forEach(function (card) {
        var matches =
          filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !matches);
        card.setAttribute("aria-hidden", matches ? "false" : "true");
        if (matches) visible += 1;
      });

      if (count) {
        count.textContent = countTemplate.replace("{count}", String(visible));
      }

      track("fleet_filter", {
        fleet_filter: filter,
        fleet_filter_label: label || filter,
        visible_vehicles: visible,
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(
          button.getAttribute("data-filter") || "all",
          button.textContent.trim()
        );
      });
    });

    applyFilter("all", "All");
  }

  function initVehicleTracking() {
    document.querySelectorAll("[data-vehicle-cta]").forEach(function (link) {
      link.addEventListener("click", function () {
        track("select_vehicle", {
          vehicle_name: link.getAttribute("data-vehicle") || "unknown",
          vehicle_category: link.getAttribute("data-category") || "unknown",
          lead_code: link.getAttribute("data-lead-code") || "CAR-PAGE",
          page_language: document.documentElement.lang || "unknown",
        });
      });
    });
  }

  function init() {
    initFleetFilter();
    initVehicleTracking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
