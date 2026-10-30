"use strict";

// Generates only comparison sections on the three listing pages and public route
// preset JSON on the three custom-tour pages. No sitemap or package-page writes.
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const { languages, destinationKeys, routes } = require("./tour-route-catalog.cjs");
const root = path.resolve(__dirname, "..");
const markers = {
  directoryStart: "<!-- BROS PACKAGE DIRECTORY START -->",
  directoryEnd: "<!-- BROS PACKAGE DIRECTORY END -->",
  comparisonStart: "<!-- BROS TOUR COMPARISON START -->",
  comparisonEnd: "<!-- BROS TOUR COMPARISON END -->",
  presetsStart: "<!-- BROS TOUR PRESETS START -->",
  presetsEnd: "<!-- BROS TOUR PRESETS END -->",
  jumpStart: "<!-- BROS TOUR COMPARISON JUMP START -->",
  jumpEnd: "<!-- BROS TOUR COMPARISON JUMP END -->",
};
const styleId = "bros-tour-comparison-style";
const styleLink = `<link href="/assets/tour-comparison.css?v=20261030" id="${styleId}" rel="stylesheet"/>`;
const copy = {
  id: {
    eyebrow: "Pilih berdasarkan perjalanan, bukan hanya jumlah hari",
    title: "Bandingkan 11 rute tour",
    intro: "Urutan tujuan dan aktivitas tiap paket berbeda. Gunakan perbandingan ini untuk memilih titik awal, lalu sesuaikan bersama tim BROS melalui penawaran private.",
    route: "Urutan rute", consideration: "Pertimbangan memilih", detail: "Baca itinerary harian", custom: "Sesuaikan rute ini",
    jump: "Bandingkan 11 rute sebelum memilih",
    note: "Rute ini adalah referensi, bukan konfirmasi pemesanan. Aktivitas hutan, pendakian, dan sungai mengikuti kondisi serta penilaian keselamatan pemandu; satwa liar tidak dapat dijamin terlihat. Rute, jadwal, fasilitas, dan harga akhir dikonfirmasi dalam penawaran.",
  },
  en: {
    eyebrow: "Choose the journey, not just the number of days",
    title: "Compare 11 tour routes",
    intro: "Each package has a different destination order and activity mix. Use this comparison to choose a starting point, then tailor it with the BROS team through a private quotation.",
    route: "Route order", consideration: "What to consider", detail: "Read the daily itinerary", custom: "Tailor this route",
    jump: "Compare 11 routes before choosing",
    note: "These routes are references, not booking confirmations. Rainforest, volcano, and river activities depend on conditions and the guide’s safety assessment; wildlife sightings are not guaranteed. The final route, schedule, inclusions, and price are confirmed in your quotation.",
  },
  ms: {
    eyebrow: "Pilih perjalanan, bukan sekadar bilangan hari",
    title: "Bandingkan 11 laluan pelancongan",
    intro: "Setiap pakej mempunyai susunan destinasi dan aktiviti yang berbeza. Gunakan perbandingan ini sebagai titik permulaan, kemudian sesuaikan bersama pasukan BROS melalui sebut harga peribadi.",
    route: "Susunan laluan", consideration: "Perkara untuk dipertimbangkan", detail: "Baca itinerari harian", custom: "Sesuaikan laluan ini",
    jump: "Bandingkan 11 laluan sebelum memilih",
    note: "Laluan ini sebagai rujukan, bukan pengesahan tempahan. Aktiviti hutan, pendakian dan sungai tertakluk pada keadaan serta penilaian keselamatan pemandu; penampakan hidupan liar tidak dijamin. Laluan, jadual, kemudahan dan harga akhir disahkan dalam sebut harga.",
  },
};

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function lineEnding(source) { return source.includes("\r\n") ? "\r\n" : "\n"; }
function count(source, token) { return source.split(token).length - 1; }
function getBlock(source, start, end) {
  assert.equal(count(source, start), 1, `Expected one ${start}`);
  assert.equal(count(source, end), 1, `Expected one ${end}`);
  const first = source.indexOf(start);
  const last = source.indexOf(end);
  assert(last > first, `Invalid marker order: ${start}`);
  return source.slice(first, last + end.length);
}
function upsertBlock(source, start, end, block, insertionAnchor) {
  if (source.includes(start) || source.includes(end)) {
    return source.replace(getBlock(source, start, end), block);
  }
  assert.equal(count(source, insertionAnchor), 1, `Missing or ambiguous anchor: ${insertionAnchor}`);
  return source.replace(insertionAnchor, `${insertionAnchor}${lineEnding(source)}${block}`);
}
function duration(route, lang) {
  return lang === "en" ? `${route.days}D${route.nights}N` : `${route.days}H${route.nights}M`;
}
function detailPath(lang, route) { return `/${lang}/paket-${route.slug}`; }

function buildPresets(lang) {
  assert(languages.includes(lang), `Unsupported language: ${lang}`);
  return Object.fromEntries(routes.map((route) => [route.slug, {
    title: `${route[lang].title} ${duration(route, lang)}`,
    days: route.days,
    destinations: [...route.destinations],
    detailPath: detailPath(lang, route),
    routeSummary: route[lang].routeSummary,
  }]));
}
function safeJson(value) {
  // Escaping < also prevents a future catalog value closing this script element.
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function renderComparison(lang) {
  const c = copy[lang];
  assert(c, `Unsupported language: ${lang}`);
  // Put the two multi-region routes next to each other, so their different
  // direction and Tangkahan inclusion can be compared at a glance.
  const featured = ["combo_sumut_6h5m", "western_7d6n_ultimate"];
  const displayRoutes = [...featured.map(slug => routes.find(route => route.slug === slug)), ...routes.filter(route => !featured.includes(route.slug))];
  const cards = displayRoutes.map((route) => {
    const text = route[lang];
    const titleId = `compare-${route.slug}`;
    const customPath = `/${lang}/bros-wisata-custom-tour?route=${encodeURIComponent(route.slug)}#custom-tour-form`;
    return `        <li class="bros-tour-comparison__item">
          <article class="bros-tour-comparison__card" aria-labelledby="${titleId}">
            <header>
              <p class="bros-tour-comparison__duration">${duration(route, lang)}</p>
              <h3 id="${titleId}">${escapeHtml(text.title)}</h3>
            </header>
            <dl>
              <div><dt>${c.route}</dt><dd>${escapeHtml(text.routeSummary)}</dd></div>
              <div><dt>${c.consideration}</dt><dd>${escapeHtml(text.consideration)}</dd></div>
            </dl>
            <div class="bros-tour-comparison__actions">
              <a class="bros-tour-comparison__detail" href="${detailPath(lang, route)}" data-cta="tour_comparison_detail" data-route="${route.slug}" aria-label="${escapeHtml(`${c.detail}: ${text.title} ${duration(route, lang)}`)}">${c.detail}<span aria-hidden="true"> →</span></a>
              <a class="bros-tour-comparison__custom" href="${customPath}" data-cta="tour_comparison_customize" data-route="${route.slug}" aria-label="${escapeHtml(`${c.custom}: ${text.title} ${duration(route, lang)}`)}">${c.custom}</a>
            </div>
          </article>
        </li>`;
  }).join("\n");
  return `${markers.comparisonStart}
    <section class="bros-tour-comparison" id="compare-tours" aria-labelledby="compare-tours-title">
      <header class="bros-tour-comparison__heading">
        <p class="bros-tour-comparison__eyebrow">${c.eyebrow}</p>
        <h2 id="compare-tours-title">${c.title}</h2>
        <p>${c.intro}</p>
      </header>
      <ul class="bros-tour-comparison__list">
${cards}
      </ul>
      <p class="bros-tour-comparison__note">${c.note}</p>
    </section>
    ${markers.comparisonEnd}`;
}
function transformListing(source, lang) {
  const directory = getBlock(source, markers.directoryStart, markers.directoryEnd);
  const block = renderComparison(lang).replace(/\n/g, lineEnding(source));
  let after = upsertBlock(source, markers.comparisonStart, markers.comparisonEnd, block, markers.directoryEnd);
  const jump = `${markers.jumpStart}\n      <a class="bros-tour-comparison__jump" href="#compare-tours" data-cta="tour_comparison_jump">${escapeHtml(copy[lang].jump)} <span aria-hidden="true">↓</span></a>\n      ${markers.jumpEnd}`.replace(/\n/g, lineEnding(source));
  if (after.includes(markers.jumpStart) || after.includes(markers.jumpEnd)) {
    after = after.replace(getBlock(after, markers.jumpStart, markers.jumpEnd), jump);
  } else {
    const jumpAnchor = '      <div class="quote-chip-row">';
    assert.equal(count(after, jumpAnchor), 1, 'Expected one listing hero chip row');
    after = after.replace(jumpAnchor, jump + lineEnding(source) + jumpAnchor);
  }
  const stylePattern = new RegExp(`<link\\b[^>]*\\bid=["']${styleId}["'][^>]*>`, "g");
  const matches = after.match(stylePattern) || [];
  assert(matches.length <= 1, "Duplicate comparison stylesheet");
  if (matches.length) after = after.replace(stylePattern, styleLink);
  else {
    assert.equal(count(after, "</head>"), 1, "Missing or ambiguous head");
    after = after.replace("</head>", `${styleLink}${lineEnding(source)}</head>`);
  }
  assert.equal(getBlock(after, markers.directoryStart, markers.directoryEnd), directory, "Existing package directory changed");
  return after;
}
function transformCustom(source, lang) {
  const block = `${markers.presetsStart}\n<script type="application/json" id="bros-tour-presets">\n${safeJson(buildPresets(lang))}\n</script>\n${markers.presetsEnd}`.replace(/\n/g, lineEnding(source));
  if (source.includes(markers.presetsStart) || source.includes(markers.presetsEnd)) {
    return source.replace(getBlock(source, markers.presetsStart, markers.presetsEnd), block);
  }
  assert(!source.includes('id="bros-tour-presets"') && !source.includes("id='bros-tour-presets'"), "Unmanaged preset element exists");
  const clientScripts = source.match(/<script\b[^>]*\bsrc=["']\/assets\/custom-tour\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>/g) || [];
  assert.equal(clientScripts.length, 1, "Expected one custom-tour client script");
  return source.replace(clientScripts[0], `${block}${lineEnding(source)}${clientScripts[0]}`);
}
function validateCatalog(base = root) {
  assert.equal(routes.length, 11, "Expected exactly 11 existing tour routes");
  assert.equal(new Set(routes.map((route) => route.slug)).size, routes.length, "Duplicate route slug");
  for (const route of routes) {
    assert(/^[a-z0-9_]+$/.test(route.slug), `Invalid route slug: ${route.slug}`);
    assert(Number.isInteger(route.days) && route.days >= 3 && route.days <= 7, `Invalid duration: ${route.slug}`);
    assert.equal(route.nights, route.days - 1, `Invalid nights: ${route.slug}`);
    assert(route.destinations.length && new Set(route.destinations).size === route.destinations.length, `Invalid destinations: ${route.slug}`);
    route.destinations.forEach((key) => assert(destinationKeys.includes(key), `Unknown destination: ${key}`));
    for (const lang of languages) {
      for (const field of ["title", "routeSummary", "consideration"]) assert.equal(typeof route[lang][field], "string", `Missing ${lang}.${field}`);
      const relative = `${lang}/paket-${route.slug}.html`;
      const html = fs.readFileSync(path.join(base, relative), "utf8");
      assert(html.includes(`href="https://broswisata.id${detailPath(lang, route)}" rel="canonical"`), `Unexpected canonical: ${relative}`);
      const days = [...html.matchAll(/>\s*(?:DAY|HARI)\s+([1-7])\s*</gi)].map((match) => Number(match[1]));
      assert.deepEqual(days, Array.from({ length: route.days }, (_, i) => i + 1), `Itinerary day count changed: ${relative}`);
    }
  }
}
function main() {
  assert(process.argv.slice(2).every((arg) => arg === "--check"), "Usage: node scripts/sync-tour-comparison.cjs [--check]");
  const checkOnly = process.argv.includes("--check");
  validateCatalog();
  let stale = false;
  for (const lang of languages) {
    for (const [name, transform] of [["bros-wisata-tour-listing", transformListing], ["bros-wisata-custom-tour", transformCustom]]) {
      const relative = `${lang}/${name}.html`;
      const filename = path.join(root, relative);
      const before = fs.readFileSync(filename, "utf8");
      const after = transform(before, lang);
      assert.equal(transform(after, lang), after, `Non-idempotent generation: ${relative}`);
      if (before === after) continue;
      if (checkOnly) { stale = true; console.error(`Out of sync: ${relative}`); }
      else { fs.writeFileSync(filename, after); console.log(`Updated ${relative}`); }
    }
  }
  if (stale) process.exitCode = 1;
  else console.log(checkOnly ? "Tour comparison and presets are in sync." : "Tour comparison and presets synchronized.");
}

module.exports = { buildPresets, renderComparison, transformListing, transformCustom, validateCatalog, safeJson, markers };
if (require.main === module) main();
