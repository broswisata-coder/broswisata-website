(function () {
  const STORAGE_KEY = "brosOpsDocumentsV1";
  const DRAFT_KEY = "brosOpsDraftV1";
  const SEQ_KEY = "brosOpsSequenceV1";
  const COMPANY = {
    name: "PT BROS INTI WISATA",
    brand: "BROS WISATA",
    tagline: "HUB OF SUMATRA",
    nib: "2502250049355",
    address: "Jl. Ring Road No. 117 B, Medan Sunggal, Medan 20122, North Sumatra, Indonesia",
    phone: "+62 812-6013-9399",
    email: "hello@broswisata.id",
    website: "broswisata.id",
    logo: "/bros-wisata-logos/bros-wisata-logo-horizontal.svg"
  };
  const TYPES = {
    quote: { title: "Quotation", print: "QUOTATION", prefix: "QUO" },
    invoice: { title: "Invoice", print: "INVOICE", prefix: "INV" },
    receipt: { title: "Payment Receipt", print: "PAYMENT RECEIPT", prefix: "REC" },
    booking: { title: "Booking Confirmation", print: "BOOKING CONFIRMATION", prefix: "BKG" }
  };
  const DEFAULT_NOTES = [
    "Prices are private and based on travel date, hotel category, group size, route, and local availability.",
    "A deposit confirms the booking. Balance payment follows the agreed due date.",
    "Any change in itinerary, hotel class, ferry schedule, guest count, or activity permit may change the final quotation."
  ].join("\n");
  const DEFAULT_ITEMS = [
    { desc: "Private North Sumatra tour arrangement", qty: 1, unit: "package", price: 0 },
    { desc: "Private transport, driver, and route coordination", qty: 1, unit: "package", price: 0 },
    { desc: "Local guide / activity coordination", qty: 1, unit: "package", price: 0 }
  ];

  const $ = (id) => document.getElementById(id);
  const fields = [
    "doc-type", "doc-status", "doc-number", "currency", "issue-date", "due-date",
    "guest-name", "guest-nationality", "guest-email", "guest-phone", "pax", "tour-language",
    "travel-start", "travel-end", "route", "pickup", "owner", "discount", "service-fee",
    "deposit-percent", "amount-received", "received-date", "payment-method",
    "payment-reference", "bank-details", "notes"
  ];

  let state = defaultState();
  let selectedId = null;

  function today(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: "quote",
      status: "Draft",
      number: "",
      currency: "USD",
      issueDate: today(),
      dueDate: today(7),
      guestName: "",
      guestNationality: "",
      guestEmail: "",
      guestPhone: "",
      pax: 2,
      tourLanguage: "English",
      travelStart: "",
      travelEnd: "",
      route: "Bukit Lawang - Tangkahan - Lake Toba",
      pickup: "Kualanamu Airport / Medan hotel",
      owner: "Ahmad / BROS Wisata team",
      items: clone(DEFAULT_ITEMS),
      discount: 0,
      serviceFee: 0,
      depositPercent: 30,
      amountReceived: 0,
      receivedDate: today(),
      paymentMethod: "",
      paymentReference: "",
      bankDetails: "",
      notes: DEFAULT_NOTES,
      updatedAt: new Date().toISOString()
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadStore(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function nextNumber(type) {
    const d = new Date();
    const day = d.toISOString().slice(0, 10).replace(/-/g, "");
    const sequences = loadStore(SEQ_KEY, {});
    const prefix = TYPES[type].prefix;
    const key = `${prefix}-${day}`;
    sequences[key] = (sequences[key] || 0) + 1;
    saveStore(SEQ_KEY, sequences);
    return `BW-${prefix}-${day}-${String(sequences[key]).padStart(3, "0")}`;
  }

  function setInitialState() {
    const draft = loadStore(DRAFT_KEY, null);
    state = draft || defaultState();
    if (!state.number) state.number = nextNumber(state.type);
    selectedId = state.id;
    bindToForm();
    renderItems();
    renderSavedList();
    renderPreview();
  }

  function bindToForm() {
    $("doc-type").value = state.type;
    $("doc-status").value = state.status;
    $("doc-number").value = state.number;
    $("currency").value = state.currency;
    $("issue-date").value = state.issueDate;
    $("due-date").value = state.dueDate;
    $("guest-name").value = state.guestName;
    $("guest-nationality").value = state.guestNationality;
    $("guest-email").value = state.guestEmail;
    $("guest-phone").value = state.guestPhone;
    $("pax").value = state.pax;
    $("tour-language").value = state.tourLanguage;
    $("travel-start").value = state.travelStart;
    $("travel-end").value = state.travelEnd;
    $("route").value = state.route;
    $("pickup").value = state.pickup;
    $("owner").value = state.owner;
    $("discount").value = state.discount;
    $("service-fee").value = state.serviceFee;
    $("deposit-percent").value = state.depositPercent;
    $("amount-received").value = state.amountReceived;
    $("received-date").value = state.receivedDate;
    $("payment-method").value = state.paymentMethod;
    $("payment-reference").value = state.paymentReference;
    $("bank-details").value = state.bankDetails;
    $("notes").value = state.notes;
  }

  function readFromForm() {
    state.type = $("doc-type").value;
    state.status = $("doc-status").value;
    state.number = $("doc-number").value.trim();
    state.currency = $("currency").value;
    state.issueDate = $("issue-date").value;
    state.dueDate = $("due-date").value;
    state.guestName = $("guest-name").value.trim();
    state.guestNationality = $("guest-nationality").value.trim();
    state.guestEmail = $("guest-email").value.trim();
    state.guestPhone = $("guest-phone").value.trim();
    state.pax = toNumber($("pax").value, 0);
    state.tourLanguage = $("tour-language").value;
    state.travelStart = $("travel-start").value;
    state.travelEnd = $("travel-end").value;
    state.route = $("route").value.trim();
    state.pickup = $("pickup").value.trim();
    state.owner = $("owner").value.trim();
    state.discount = toNumber($("discount").value, 0);
    state.serviceFee = toNumber($("service-fee").value, 0);
    state.depositPercent = toNumber($("deposit-percent").value, 0);
    state.amountReceived = toNumber($("amount-received").value, 0);
    state.receivedDate = $("received-date").value;
    state.paymentMethod = $("payment-method").value.trim();
    state.paymentReference = $("payment-reference").value.trim();
    state.bankDetails = $("bank-details").value.trim();
    state.notes = $("notes").value.trim();
    state.updatedAt = new Date().toISOString();
  }

  function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function renderItems() {
    const editor = $("items-editor");
    editor.innerHTML = "";
    state.items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <input data-item="${index}" data-key="desc" type="text" value="${escapeAttr(item.desc)}" placeholder="Description"/>
        <input data-item="${index}" data-key="qty" min="0" step="0.01" type="number" value="${escapeAttr(item.qty)}" aria-label="Qty"/>
        <input data-item="${index}" data-key="unit" type="text" value="${escapeAttr(item.unit)}" aria-label="Unit"/>
        <input data-item="${index}" data-key="price" min="0" step="0.01" type="number" value="${escapeAttr(item.price)}" aria-label="Unit price"/>
        <button class="remove-item" data-remove="${index}" type="button" aria-label="Remove item">x</button>
      `;
      editor.appendChild(row);
    });
  }

  function calculations() {
    const subtotal = state.items.reduce((sum, item) => sum + toNumber(item.qty) * toNumber(item.price), 0);
    const total = Math.max(0, subtotal - state.discount + state.serviceFee);
    const deposit = total * Math.min(Math.max(state.depositPercent, 0), 100) / 100;
    const balance = Math.max(0, total - state.amountReceived);
    return { subtotal, total, deposit, balance };
  }

  function money(amount) {
    const noDecimal = state.currency === "IDR";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: state.currency,
        maximumFractionDigits: noDecimal ? 0 : 2
      }).format(amount || 0);
    } catch (error) {
      return `${state.currency} ${(amount || 0).toLocaleString("en-US")}`;
    }
  }

  function dateText(value) {
    if (!value) return "-";
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  function renderPreview() {
    const type = TYPES[state.type];
    const calc = calculations();
    $("preview-title-label").textContent = type.title;
    const rows = state.items.map((item, index) => {
      const qty = toNumber(item.qty);
      const price = toNumber(item.price);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.desc || "-")}</td>
          <td>${escapeHtml(qty)} ${escapeHtml(item.unit || "")}</td>
          <td>${money(price)}</td>
          <td>${money(qty * price)}</td>
        </tr>
      `;
    }).join("");

    const receiptBlock = state.type === "receipt" || state.amountReceived > 0 ? `
      <section class="doc-section">
        <h3>Payment Received</h3>
        <div class="payment-box">
          <div class="mini-card"><span>Received</span><strong>${money(state.amountReceived)}</strong></div>
          <div class="mini-card"><span>Date</span><strong>${dateText(state.receivedDate)}</strong></div>
          <div class="mini-card"><span>Method</span><strong>${escapeHtml(state.paymentMethod || "-")}</strong></div>
        </div>
        ${state.paymentReference ? `<p class="notes" style="margin-top:.75rem"><strong>Reference:</strong> ${escapeHtml(state.paymentReference)}</p>` : ""}
      </section>
    ` : "";

    $("doc-preview").innerHTML = `
      <header class="doc-header">
        <div>
          <div class="doc-logo">
            <img class="doc-logo-image" src="${COMPANY.logo}" alt="BROS Wisata logo"/>
          </div>
          <div class="doc-company">
            ${COMPANY.name}<br/>
            NIB ${COMPANY.nib}<br/>
            ${COMPANY.address}<br/>
            ${COMPANY.phone} | ${COMPANY.email} | ${COMPANY.website}
          </div>
        </div>
        <div class="doc-title-block">
          <div class="doc-title">${type.print}</div>
          <span class="status-pill">${escapeHtml(state.status)}</span>
          <div class="doc-meta">
            <div class="doc-meta-row"><span>No.</span><strong>${escapeHtml(state.number || "-")}</strong></div>
            <div class="doc-meta-row"><span>Issued</span><strong>${dateText(state.issueDate)}</strong></div>
            <div class="doc-meta-row"><span>Due</span><strong>${dateText(state.dueDate)}</strong></div>
          </div>
        </div>
      </header>

      <section class="doc-grid">
        <div class="doc-box">
          <h3>Bill To / Guest</h3>
          <p>
            <strong>${escapeHtml(state.guestName || "Guest name")}</strong><br/>
            ${escapeHtml(state.guestNationality || "Nationality")}<br/>
            ${escapeHtml(state.guestEmail || "Email")}<br/>
            ${escapeHtml(state.guestPhone || "WhatsApp")}
          </p>
        </div>
        <div class="doc-box">
          <h3>Trip Details</h3>
          <p>
            <strong>${escapeHtml(state.route || "Custom North Sumatra private tour")}</strong><br/>
            ${dateText(state.travelStart)} - ${dateText(state.travelEnd)}<br/>
            Pax: ${escapeHtml(state.pax || "-")} | Language: ${escapeHtml(state.tourLanguage)}<br/>
            Pickup: ${escapeHtml(state.pickup || "-")}<br/>
            Owner/Guide: ${escapeHtml(state.owner || "-")}
          </p>
        </div>
      </section>

      <section class="doc-section">
        <h3>Commercial Details</h3>
        <table class="doc-table">
          <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="totals">
          <div class="doc-total"><span>Subtotal</span><strong>${money(calc.subtotal)}</strong></div>
          <div class="doc-total"><span>Discount</span><strong>${money(state.discount)}</strong></div>
          <div class="doc-total"><span>Service / Tax</span><strong>${money(state.serviceFee)}</strong></div>
          <div class="doc-total grand"><span>Total</span><strong>${money(calc.total)}</strong></div>
          <div class="doc-total"><span>Suggested Deposit (${state.depositPercent || 0}%)</span><strong>${money(calc.deposit)}</strong></div>
          <div class="doc-total"><span>Balance After Payment</span><strong>${money(calc.balance)}</strong></div>
        </div>
      </section>

      ${receiptBlock}

      <section class="doc-section">
        <h3>Payment Instruction</h3>
        <p class="notes">${escapeHtml(state.bankDetails || "Add official bank account, Wise instruction, or payment link before sending this document.")}</p>
      </section>

      <section class="doc-section">
        <h3>Notes and Terms</h3>
        <p class="notes">${escapeHtml(state.notes || DEFAULT_NOTES)}</p>
      </section>

      <footer class="doc-footer">
        <span>Prepared by ${COMPANY.brand} for private North Sumatra travel arrangements.</span>
        <span>${COMPANY.name} | ${COMPANY.website}</span>
      </footer>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function updateDraft() {
    readFromForm();
    saveStore(DRAFT_KEY, state);
    renderPreview();
    $("autosave-state").textContent = `Autosaved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function saveDocument() {
    readFromForm();
    if (!state.number) {
      state.number = nextNumber(state.type);
      $("doc-number").value = state.number;
    }
    const docs = loadStore(STORAGE_KEY, []);
    const existing = docs.findIndex((doc) => doc.id === state.id);
    if (existing >= 0) docs[existing] = clone(state);
    else docs.unshift(clone(state));
    saveStore(STORAGE_KEY, docs);
    saveStore(DRAFT_KEY, state);
    selectedId = state.id;
    renderSavedList();
    renderPreview();
    $("autosave-state").textContent = "Saved";
  }

  function renderSavedList() {
    const docs = loadStore(STORAGE_KEY, []);
    const list = $("saved-list");
    if (!docs.length) {
      list.innerHTML = '<p class="panel-note">No saved document yet.</p>';
      return;
    }
    list.innerHTML = docs.map((doc) => `
      <button class="saved-item ${doc.id === selectedId ? "active" : ""}" data-load="${escapeAttr(doc.id)}" type="button">
        <strong>${escapeHtml(doc.number || "(no number)")} - ${escapeHtml(doc.guestName || "Guest")}</strong>
        <span>${escapeHtml(TYPES[doc.type]?.title || doc.type)} | ${escapeHtml(doc.status)} | ${moneyWithCurrency(doc, calcTotal(doc))}</span>
      </button>
    `).join("");
  }

  function calcTotal(doc) {
    const subtotal = (doc.items || []).reduce((sum, item) => sum + toNumber(item.qty) * toNumber(item.price), 0);
    return Math.max(0, subtotal - toNumber(doc.discount) + toNumber(doc.serviceFee));
  }

  function moneyWithCurrency(doc, amount) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: doc.currency || "USD",
        maximumFractionDigits: doc.currency === "IDR" ? 0 : 2
      }).format(amount || 0);
    } catch (error) {
      return `${doc.currency || "USD"} ${(amount || 0).toLocaleString("en-US")}`;
    }
  }

  function loadDocument(id) {
    const docs = loadStore(STORAGE_KEY, []);
    const doc = docs.find((entry) => entry.id === id);
    if (!doc) return;
    state = clone(doc);
    selectedId = state.id;
    bindToForm();
    renderItems();
    renderSavedList();
    renderPreview();
    saveStore(DRAFT_KEY, state);
    $("autosave-state").textContent = "Loaded";
  }

  function deleteSelected() {
    if (!selectedId) return;
    const docs = loadStore(STORAGE_KEY, []).filter((doc) => doc.id !== selectedId);
    saveStore(STORAGE_KEY, docs);
    state = defaultState();
    state.number = nextNumber(state.type);
    selectedId = state.id;
    bindToForm();
    renderItems();
    renderSavedList();
    renderPreview();
    saveStore(DRAFT_KEY, state);
  }

  function newDocument() {
    state = defaultState();
    state.number = nextNumber(state.type);
    selectedId = state.id;
    bindToForm();
    renderItems();
    renderSavedList();
    renderPreview();
    saveStore(DRAFT_KEY, state);
  }

  function exportJson() {
    readFromForm();
    const docs = loadStore(STORAGE_KEY, []);
    const payload = {
      exportedAt: new Date().toISOString(),
      current: state,
      saved: docs
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bros-ops-${state.number || today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyWhatsAppText() {
    readFromForm();
    const calc = calculations();
    const type = TYPES[state.type].title;
    const text = [
      `Hi ${state.guestName || "there"}, this is BROS Wisata.`,
      `We have prepared your ${type.toLowerCase()} ${state.number}.`,
      `Trip: ${state.route || "Custom North Sumatra private tour"}`,
      `Travel date: ${dateText(state.travelStart)} - ${dateText(state.travelEnd)}`,
      `Guests: ${state.pax || "-"}`,
      `Total: ${money(calc.total)}`,
      state.amountReceived > 0 ? `Payment received: ${money(state.amountReceived)}` : `Suggested deposit: ${money(calc.deposit)}`,
      `Please review the attached PDF. Thank you.`
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      $("autosave-state").textContent = "WhatsApp text copied";
    } catch (error) {
      $("autosave-state").textContent = "Copy failed";
      window.prompt("Copy WhatsApp text", text);
    }
  }

  function setupEvents() {
    fields.forEach((id) => {
      $(id).addEventListener("input", updateDraft);
      $(id).addEventListener("change", () => {
        if (id === "doc-type") {
          const newType = $("doc-type").value;
          const expectedPrefix = `-${TYPES[newType].prefix}-`;
          state.type = newType;
          if (!state.number.includes(expectedPrefix)) {
            state.number = nextNumber(state.type);
            $("doc-number").value = state.number;
          }
        }
        if (!state.number) {
          state.number = nextNumber(state.type);
          $("doc-number").value = state.number;
        }
        updateDraft();
      });
    });

    $("items-editor").addEventListener("input", (event) => {
      const input = event.target.closest("[data-item]");
      if (!input) return;
      const index = Number(input.dataset.item);
      const key = input.dataset.key;
      if (!state.items[index]) return;
      state.items[index][key] = key === "desc" || key === "unit" ? input.value : toNumber(input.value, 0);
      updateDraft();
    });

    $("items-editor").addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      const index = Number(button.dataset.remove);
      state.items.splice(index, 1);
      if (!state.items.length) state.items.push({ desc: "", qty: 1, unit: "item", price: 0 });
      renderItems();
      updateDraft();
    });

    $("btn-add-item").addEventListener("click", () => {
      state.items.push({ desc: "", qty: 1, unit: "item", price: 0 });
      renderItems();
      updateDraft();
    });
    $("btn-save").addEventListener("click", saveDocument);
    $("btn-new").addEventListener("click", newDocument);
    $("btn-print").addEventListener("click", () => {
      readFromForm();
      renderPreview();
      window.print();
    });
    $("btn-export").addEventListener("click", exportJson);
    $("btn-copy-wa").addEventListener("click", copyWhatsAppText);
    $("btn-delete").addEventListener("click", deleteSelected);
    $("saved-list").addEventListener("click", (event) => {
      const item = event.target.closest("[data-load]");
      if (item) loadDocument(item.dataset.load);
    });
  }

  setInitialState();
  setupEvents();
})();
