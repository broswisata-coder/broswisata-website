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
      draftNotice: "WhatsApp dibuka dengan draf pesan. Pesan tidak dikirim otomatis."
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
      draftNotice: "WhatsApp dibuka dengan draf mesej. Mesej tidak dihantar secara automatik."
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
      draftNotice: "WhatsApp opens with a message draft. Nothing is sent automatically."
    }
  }[language] || null;

  if (!copy) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var indicators = Array.prototype.slice.call(form.querySelectorAll("[data-step-indicator]"));
  var status = form.querySelector("[data-step-status]");
  var summary = form.querySelector("[data-summary]");
  var whatsappLink = form.querySelector("[data-whatsapp-link]");
  var currentStep = 0;

  form.noValidate = true;
  form.classList.add("custom-tour-ready");
  setMinimumDate();
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
    renderSummary();
  });

  form.addEventListener("input", function (event) {
    clearControlError(event.target);
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
    return [
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
