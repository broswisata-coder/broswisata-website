(function () {
  "use strict";

  var form = document.querySelector("[data-custom-tour-form]");
  if (!form) return;

  var language = form.getAttribute("data-lang") || "en";
  var copy = {
    id: {
      locale: "id-ID",
      empty: "Belum diisi",
      stepStatus: "Langkah {current} dari {total}: {label}",
      progressLabels: ["Destinasi", "Detail perjalanan", "Preferensi", "Kontak dan ringkasan"],
      errors: {
        required: "Bagian ini wajib diisi.",
        email: "Masukkan alamat email yang valid.",
        phone: "Masukkan nomor WhatsApp yang valid (8–15 digit).",
        destinations: "Pilih setidaknya satu destinasi.",
        hotelStyle: "Pilih gaya hotel dan kenyamanan.",
        accommodation: "Pilih tipe akomodasi.",
        consent: "Persetujuan privasi diperlukan untuk melanjutkan.",
        date: "Pilih tanggal keberangkatan hari ini atau setelahnya."
      },
      labels: {
        destinations: "Destinasi",
        specific_places: "Tempat/keinginan wajib",
        departure_date: "Tanggal berangkat",
        duration: "Durasi",
        travelers: "Jumlah tamu",
        children: "Anak",
        hotel_style: "Gaya hotel",
        accommodation: "Tipe akomodasi",
        interests: "Minat dan aktivitas",
        needs: "Kebutuhan khusus",
        full_name: "Nama",
        country: "Negara asal",
        customer_whatsapp: "WhatsApp pelanggan",
        email: "Email",
        notes: "Catatan tambahan"
      },
      messageTitle: "[PERMINTAAN CUSTOM TOUR]",
      messageIntro: "Halo BROS Wisata, saya ingin meminta rancangan itinerary pribadi berdasarkan detail berikut:",
      draftNotice: "WhatsApp dibuka dengan draf pesan. Pesan tidak dikirim otomatis.",
      route: {
        label: "Rute awal yang bisa disesuaikan",
        reference: "Rute referensi",
        state: "Status rute",
        editable: "Titik awal saja, bukan rute tetap. Destinasi dan durasi boleh diubah.",
        changed: "Referensi, bukan rute tetap. Destinasi atau durasi sudah Anda ubah; tim akan menyesuaikan rancangan.",
        detail: "Lihat detail paket",
        compare: "Bandingkan paket",
        clear: "Hapus referensi rute",
        cleared: "Referensi rute dihapus. Pilihan dan isian Anda tetap tersimpan di formulir ini."
      }
    },
    ms: {
      locale: "ms-MY",
      empty: "Belum diisi",
      stepStatus: "Langkah {current} daripada {total}: {label}",
      progressLabels: ["Destinasi", "Butiran perjalanan", "Pilihan", "Hubungan dan ringkasan"],
      errors: {
        required: "Bahagian ini wajib diisi.",
        email: "Masukkan alamat e-mel yang sah.",
        phone: "Masukkan nombor WhatsApp yang sah (8–15 digit).",
        destinations: "Pilih sekurang-kurangnya satu destinasi.",
        hotelStyle: "Pilih gaya hotel dan keselesaan.",
        accommodation: "Pilih jenis penginapan.",
        consent: "Persetujuan privasi diperlukan untuk meneruskan.",
        date: "Pilih tarikh berlepas hari ini atau selepasnya."
      },
      labels: {
        destinations: "Destinasi",
        specific_places: "Tempat/permintaan wajib",
        departure_date: "Tarikh berlepas",
        duration: "Tempoh",
        travelers: "Jumlah tetamu",
        children: "Kanak-kanak",
        hotel_style: "Gaya hotel",
        accommodation: "Jenis penginapan",
        interests: "Minat dan aktiviti",
        needs: "Keperluan khas",
        full_name: "Nama",
        country: "Negara asal",
        customer_whatsapp: "WhatsApp pelanggan",
        email: "E-mel",
        notes: "Catatan tambahan"
      },
      messageTitle: "[PERMINTAAN CUSTOM TOUR]",
      messageIntro: "Hai BROS Wisata, saya ingin meminta itinerari peribadi berdasarkan butiran berikut:",
      draftNotice: "WhatsApp dibuka dengan draf mesej. Mesej tidak dihantar secara automatik.",
      route: {
        label: "Laluan awal yang boleh disesuaikan",
        reference: "Laluan rujukan",
        state: "Status laluan",
        editable: "Titik permulaan sahaja, bukan laluan tetap. Destinasi dan tempoh boleh diubah.",
        changed: "Rujukan, bukan laluan tetap. Destinasi atau tempoh telah anda ubah; pasukan akan menyesuaikan itinerari.",
        detail: "Lihat butiran pakej",
        compare: "Bandingkan pakej",
        clear: "Buang rujukan laluan",
        cleared: "Rujukan laluan dibuang. Pilihan dan isian anda kekal dalam borang ini."
      }
    },
    en: {
      locale: "en-GB",
      empty: "Not specified",
      stepStatus: "Step {current} of {total}: {label}",
      progressLabels: ["Destinations", "Trip details", "Preferences", "Contact and summary"],
      errors: {
        required: "This field is required.",
        email: "Enter a valid email address.",
        phone: "Enter a valid WhatsApp number (8–15 digits).",
        destinations: "Choose at least one destination.",
        hotelStyle: "Choose a hotel and comfort style.",
        accommodation: "Choose an accommodation type.",
        consent: "Privacy consent is required to continue.",
        date: "Choose a departure date from today onwards."
      },
      labels: {
        destinations: "Destinations",
        specific_places: "Must-see places/requests",
        departure_date: "Departure date",
        duration: "Duration",
        travelers: "Travellers",
        children: "Children",
        hotel_style: "Hotel style",
        accommodation: "Accommodation type",
        interests: "Interests and activities",
        needs: "Special requirements",
        full_name: "Name",
        country: "Country of origin",
        customer_whatsapp: "Customer WhatsApp",
        email: "Email",
        notes: "Additional notes"
      },
      messageTitle: "[CUSTOM TOUR REQUEST]",
      messageIntro: "Hi BROS Wisata, I would like a personalised itinerary based on the following details:",
      draftNotice: "WhatsApp opens with a message draft. Nothing is sent automatically.",
      route: {
        label: "An editable starting route",
        reference: "Reference route",
        state: "Route status",
        editable: "A starting point, not a fixed route. You can change the destinations and duration.",
        changed: "Reference only, not a fixed route. You changed the destinations or duration; our team will tailor the itinerary.",
        detail: "View package details",
        compare: "Compare packages",
        clear: "Remove route reference",
        cleared: "Route reference removed. Your choices and entries remain in this form."
      }
    }
  }[language] || null;

  if (!copy) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var indicators = Array.prototype.slice.call(form.querySelectorAll("[data-step-indicator]"));
  var status = form.querySelector("[data-step-status]");
  var summary = form.querySelector("[data-summary]");
  var whatsappLink = form.querySelector("[data-whatsapp-link]");
  var currentStep = 0;
  var routeContext = null;
  var routeBanner = null;
  var routeStatus = null;
  var languageLinks = [];

  form.noValidate = true;
  form.classList.add("custom-tour-ready");
  setMinimumDate();
  applyRoutePreset();
  syncCards();
  showStep(0, false);

  form.querySelectorAll("[data-next]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (validateStep(currentStep, true)) showStep(currentStep + 1, true);
    });
  });

  form.querySelectorAll("[data-back]").forEach(function (button) {
    button.addEventListener("click", function () {
      showStep(currentStep - 1, true);
    });
  });

  form.addEventListener("change", function () {
    syncCards();
    clearResolvedErrors();
    updateRouteStatus();
    renderSummary();
  });

  form.addEventListener("input", function (event) {
    clearControlError(event.target);
    updateRouteStatus();
    renderSummary();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    for (var index = 0; index < steps.length; index += 1) {
      if (!validateStep(index, false)) {
        showStep(index, true);
        validateStep(index, true);
        return;
      }
    }

    renderSummary();
    whatsappLink.setAttribute("href", buildWhatsappUrl());
    whatsappLink.click();

    if (status) {
      status.textContent = copy.draftNotice;
      status.classList.remove("ct-sr-only");
    }
  });

  function showStep(index, moveFocus) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach(function (step, stepIndex) {
      step.hidden = stepIndex !== currentStep;
    });

    indicators.forEach(function (indicator, indicatorIndex) {
      var number = indicatorIndex + 1;
      indicator.classList.toggle("active", indicatorIndex === currentStep);
      indicator.classList.toggle("complete", indicatorIndex < currentStep);
      indicator.classList.toggle("pending", indicatorIndex > currentStep);
      indicator.textContent = indicatorIndex < currentStep ? "✓" : String(number);

      if (indicatorIndex === currentStep) {
        indicator.setAttribute("aria-current", "step");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });

    if (currentStep === steps.length - 1) renderSummary();

    if (status) {
      status.textContent = copy.stepStatus
        .replace("{current}", String(currentStep + 1))
        .replace("{total}", String(steps.length))
        .replace("{label}", copy.progressLabels[currentStep]);
    }

    if (moveFocus) {
      var heading = steps[currentStep].querySelector("h2");
      steps[currentStep].scrollIntoView({ behavior: "smooth", block: "start" });
      if (heading) {
        window.setTimeout(function () {
          heading.focus({ preventScroll: true });
        }, 250);
      }
    }
  }

  function validateStep(index, shouldFocus) {
    var step = steps[index];
    var valid = true;
    var firstInvalid = null;
    var handledGroups = {};

    clearStepErrors(step);

    if (index === 0 && checked("destinations").length === 0) {
      valid = false;
      firstInvalid = showGroupError("destinations", copy.errors.destinations) || firstInvalid;
    }

    if (index === 1 && checked("hotel_style").length === 0) {
      valid = false;
      firstInvalid = showGroupError("hotel_style", copy.errors.hotelStyle) || firstInvalid;
    }

    if (index === 2 && checked("accommodation").length === 0) {
      valid = false;
      firstInvalid = showGroupError("accommodation", copy.errors.accommodation) || firstInvalid;
    }

    Array.prototype.slice.call(step.querySelectorAll("[required]")).forEach(function (control) {
      if ((control.type === "radio" || control.type === "checkbox") && control.name !== "privacy_consent") {
        if (handledGroups[control.name]) return;
        handledGroups[control.name] = true;
        return;
      }

      var message = controlError(control);
      if (!message) return;

      valid = false;
      showControlError(control, message);
      firstInvalid = firstInvalid || control;
    });

    if (shouldFocus && firstInvalid) firstInvalid.focus();
    return valid;
  }

  function controlError(control) {
    var raw = String(control.value || "").trim();

    if (control.name === "privacy_consent" && !control.checked) return copy.errors.consent;
    if (control.required && !raw) return copy.errors.required;
    if (control.type === "email" && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return copy.errors.email;

    if (control.name === "customer_whatsapp" && raw) {
      var digits = raw.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) return copy.errors.phone;
    }

    if (control.name === "departure_date" && raw && control.min && raw < control.min) return copy.errors.date;
    return "";
  }

  function showControlError(control, message) {
    var errorId = control.id + "-error";
    var error = document.getElementById(errorId);

    if (!error) {
      error = document.createElement("p");
      error.id = errorId;
      error.className = "ct-error";
      error.setAttribute("role", "alert");
      control.insertAdjacentElement("afterend", error);
    }

    error.textContent = message;
    error.hidden = false;
    control.setAttribute("aria-invalid", "true");
    control.setAttribute("aria-describedby", errorId);
  }

  function showGroupError(name, message) {
    var error = form.querySelector('[data-error-for="' + name + '"]');
    var controls = Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]'));

    if (error) {
      error.textContent = message;
      error.hidden = false;
      error.setAttribute("role", "alert");
    }

    controls.forEach(function (control) {
      control.setAttribute("aria-invalid", "true");
      if (error) control.setAttribute("aria-describedby", error.id);
    });

    return controls[0] || null;
  }

  function clearStepErrors(step) {
    step.querySelectorAll(".ct-error").forEach(function (error) {
      error.textContent = "";
      error.hidden = true;
    });
    step.querySelectorAll('[aria-invalid="true"]').forEach(function (control) {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    });
  }

  function clearControlError(control) {
    if (!control || !control.id || !control.hasAttribute("aria-invalid")) return;
    if (controlError(control)) return;

    var error = document.getElementById(control.id + "-error");
    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-describedby");
  }

  function clearResolvedErrors() {
    ["destinations", "hotel_style", "accommodation"].forEach(function (name) {
      if (checked(name).length === 0) return;
      var error = form.querySelector('[data-error-for="' + name + '"]');
      if (error) {
        error.textContent = "";
        error.hidden = true;
      }
      form.querySelectorAll('[name="' + name + '"]').forEach(function (control) {
        control.removeAttribute("aria-invalid");
        control.removeAttribute("aria-describedby");
      });
    });
  }

  function setMinimumDate() {
    var date = field("departure_date");
    if (!date) return;
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");
    date.min = year + "-" + month + "-" + day;
  }

  function applyRoutePreset() {
    var source = document.getElementById("bros-tour-presets");
    if (!source || source.getAttribute("type") !== "application/json") return;

    try {
      var url = new URL(window.location.href);
      var routes = url.searchParams.getAll("route");
      if (routes.length !== 1 || !/^[a-z0-9][a-z0-9_-]{0,99}$/.test(routes[0])) return;
      var slug = routes[0];
      var raw = source.textContent || "";
      if (raw.length > 65536) return;
      var presets = JSON.parse(raw);
      if (!presets || Array.isArray(presets) || !Object.prototype.hasOwnProperty.call(presets, slug)) return;
      var preset = presets[slug];
      var allowedDestinations = ["medan_city", "toba_samosir", "berastagi_karo", "bukit_lawang", "tangkahan"];
      if (!preset || typeof preset.title !== "string" || !preset.title.trim() || preset.title.length > 250) return;
      if (!Number.isInteger(preset.days) || preset.days < 3 || preset.days > 60) return;
      if (!Array.isArray(preset.destinations) || !preset.destinations.length || preset.destinations.length > allowedDestinations.length) return;
      if (preset.destinations.some(function (destination, index) {
        return allowedDestinations.indexOf(destination) < 0 || preset.destinations.indexOf(destination) !== index;
      })) return;
      if (typeof preset.detailPath !== "string" || !new RegExp("^/" + language + "/paket-[a-z0-9_-]+$").test(preset.detailPath)) return;
      if (typeof preset.routeSummary !== "string" || preset.routeSummary.length > 600) return;

      var duration = field("duration");
      if (!duration || !duration.options) return;
      var expectedDays = Math.min(preset.days, 7);
      var durationOption = Array.prototype.slice.call(duration.options).find(function (option) {
        return parseInt(option.value, 10) === expectedDays;
      });
      if (!durationOption) return;
      var destinations = Array.prototype.slice.call(form.querySelectorAll('[name="destinations"]'));
      if (!preset.destinations.every(function (destination) {
        return destinations.some(function (control) { return control.value === destination; });
      })) return;

      // Apply trusted route preferences once. Later user input is never re-prefilled.
      destinations.forEach(function (control) {
        control.checked = preset.destinations.indexOf(control.value) >= 0;
      });
      duration.value = durationOption.value;
      routeContext = {
        slug: slug,
        title: preset.title,
        description: preset.routeSummary,
        detailPath: preset.detailPath,
        destinations: preset.destinations.slice().sort().join("|"),
        duration: duration.value
      };
      renderRouteBanner();
      preserveRouteLanguageLinks();
    } catch (error) {
      // Malformed, missing or unknown route data leaves the ordinary form untouched.
    }
  }

  function routeHasChanged() {
    return routeContext && (value("duration") !== routeContext.duration || checked("destinations").map(function (control) {
      return control.value;
    }).sort().join("|") !== routeContext.destinations);
  }

  function routeStateText() {
    return routeHasChanged() ? copy.route.changed : copy.route.editable;
  }

  function renderRouteBanner() {
    routeBanner = document.createElement("section");
    routeBanner.className = "ct-route-banner";
    routeBanner.setAttribute("aria-label", copy.route.label);
    var label = document.createElement("p");
    label.className = "ct-route-label";
    label.textContent = copy.route.label;
    var title = document.createElement("h2");
    title.className = "ct-route-title";
    title.textContent = routeContext.title;
    var description = document.createElement("p");
    description.className = "ct-route-description";
    description.textContent = routeContext.description;
    routeStatus = document.createElement("p");
    routeStatus.className = "ct-route-status";
    routeStatus.setAttribute("role", "status");
    routeStatus.setAttribute("aria-live", "polite");
    routeStatus.textContent = routeStateText();
    var actions = document.createElement("div");
    actions.className = "ct-route-actions";
    var detail = document.createElement("a");
    detail.href = routeContext.detailPath;
    detail.textContent = copy.route.detail;
    var compare = document.createElement("a");
    compare.href = "/" + language + "/bros-wisata-tour-listing#compare-tours";
    compare.textContent = copy.route.compare;
    var clear = document.createElement("button");
    clear.type = "button";
    clear.textContent = copy.route.clear;
    clear.addEventListener("click", clearRouteContext);
    actions.appendChild(detail);
    actions.appendChild(compare);
    actions.appendChild(clear);
    [label, title, description, routeStatus, actions].forEach(function (element) { routeBanner.appendChild(element); });
    form.insertBefore(routeBanner, form.firstChild);
  }

  function updateRouteStatus() {
    if (routeContext && routeStatus) routeStatus.textContent = routeStateText();
  }

  function preserveRouteLanguageLinks() {
    ["lang-id", "lang-my", "lang-en"].forEach(function (id) {
      var link = document.getElementById(id);
      if (!link) return;
      var href = link.getAttribute("href") || "";
      if (!/^\/(id|ms|en)\/bros-wisata-custom-tour(?:\.html)?\/?$/.test(href)) return;
      languageLinks.push({ element: link, href: href });
      // Share only the recognized route. Never copy arbitrary queries or private form values.
      link.setAttribute("href", href + "?route=" + encodeURIComponent(routeContext.slug));
    });
  }

  function clearRouteContext() {
    routeContext = null;
    if (routeBanner) routeBanner.remove();
    routeBanner = null;
    routeStatus = null;
    languageLinks.forEach(function (link) { link.element.setAttribute("href", link.href); });
    languageLinks = [];
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete("route");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch (error) {
      // Removing the optional URL context must not interfere with form entries.
    }
    renderSummary();
    if (status) status.textContent = copy.route.cleared;
    var heading = steps[currentStep] && steps[currentStep].querySelector("h2");
    if (heading) heading.focus({ preventScroll: true });
  }

  function syncCards() {
    form.querySelectorAll(".ct-card").forEach(function (card) {
      var input = card.querySelector("input");
      if (!input) return;
      card.classList.toggle("is-selected", input.checked);
      card.classList.toggle("selected", input.checked);
    });
  }

  function field(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function value(name) {
    var control = field(name);
    return control ? String(control.value || "").trim() : "";
  }

  function selectedText(name) {
    var control = field(name);
    if (!control || !control.options || control.selectedIndex < 0) return "";
    if (!String(control.options[control.selectedIndex].value || "").trim()) return "";
    return String(control.options[control.selectedIndex].textContent || "").trim();
  }

  function checked(name) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]:checked'));
  }

  function selectedChoices(name) {
    return checked(name).map(function (control) {
      return control.getAttribute("data-choice") || control.value;
    });
  }

  function displayDate(raw) {
    if (!raw) return "";
    try {
      return new Intl.DateTimeFormat(copy.locale, {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(raw + "T00:00:00"));
    } catch (error) {
      return raw;
    }
  }

  function summaryRows() {
    var rows = [
      [copy.labels.destinations, selectedChoices("destinations").join(", ")],
      [copy.labels.specific_places, value("specific_places")],
      [copy.labels.departure_date, displayDate(value("departure_date"))],
      [copy.labels.duration, selectedText("duration")],
      [copy.labels.travelers, selectedText("travelers")],
      [copy.labels.children, selectedText("children")],
      [copy.labels.hotel_style, selectedChoices("hotel_style").join(", ")],
      [copy.labels.accommodation, selectedChoices("accommodation").join(", ")],
      [copy.labels.interests, selectedChoices("interests").join(", ")],
      [copy.labels.needs, selectedChoices("needs").join(", ")],
      [copy.labels.full_name, value("full_name")],
      [copy.labels.country, selectedText("country")],
      [copy.labels.customer_whatsapp, value("customer_whatsapp")],
      [copy.labels.email, value("email")],
      [copy.labels.notes, value("notes")]
    ];
    if (routeContext) {
      rows.unshift([copy.route.state, routeStateText()]);
      rows.unshift([copy.route.reference, routeContext.title + (routeContext.description ? " — " + routeContext.description : "")]);
    }
    return rows;
  }

  function renderSummary() {
    if (!summary) return;
    summary.replaceChildren();

    summaryRows().forEach(function (row) {
      var wrapper = document.createElement("div");
      var term = document.createElement("dt");
      var description = document.createElement("dd");
      wrapper.className = "ct-summary-row";
      term.textContent = row[0];
      description.textContent = row[1] || copy.empty;
      wrapper.appendChild(term);
      wrapper.appendChild(description);
      summary.appendChild(wrapper);
    });
  }

  function buildWhatsappUrl() {
    var lines = [copy.messageTitle, copy.messageIntro, ""];
    summaryRows().forEach(function (row) {
      lines.push(row[0] + ": " + (row[1] || copy.empty));
    });
    return "https://wa.me/6281260139399?text=" + encodeURIComponent(lines.join("\n"));
  }
})();
