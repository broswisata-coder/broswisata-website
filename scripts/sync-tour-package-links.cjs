const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const updated = "2026-10-21";
const start = "<!-- BROS PACKAGE DIRECTORY START -->";
const end = "<!-- BROS PACKAGE DIRECTORY END -->";
const packages = [
  ["paket-halal_3h2m_medan_toba", "Medan–Toba Halal", 3, 2],
  ["paket-halal_4h3m_medan_toba", "Medan–Toba Halal", 4, 3],
  ["paket-halal_5h4m_medan_toba", "Medan–Toba Halal", 5, 4],
  ["paket-combo_sumut_6h5m", "Jelajah Sumatra Utara", 6, 5],
  ["paket-bukit_lawang_4h3m", "Bukit Lawang", 4, 3],
  ["paket-tangkahan_3h2m", "Tangkahan", 3, 2],
  ["paket-berastagi_3h2m", "Berastagi", 3, 2],
  ["paket-western_4d3n_jungle", "Jungle & Eco Tour", 4, 3],
  ["paket-western_5d4n_volcano", "Volcano Adventure", 5, 4],
  ["paket-medan_heritage_3h2m", "Medan Heritage", 3, 2],
  ["paket-western_7d6n_ultimate", "Ultimate Sumatra", 7, 6],
];
const locales = {
  id: {
    heading: "Jelajahi detail paket tour",
    intro: "Baca rute dan itinerary harian sebelum meminta penawaran. Itinerary ini menjadi referensi; penyesuaian rute, aktivitas, fasilitas, dan harga akhir dikonfirmasi dalam quotation private.",
    groups: ["Danau Toba & Samosir", "Hutan & dataran tinggi", "Budaya & jelajah lengkap"],
    detail: "Lihat detail paket",
  },
  ms: {
    heading: "Lihat butiran pakej pelancongan",
    intro: "Semak laluan dan itinerari harian sebelum meminta sebut harga. Itinerari ini sebagai rujukan; penyesuaian laluan, aktiviti, kemudahan dan harga akhir disahkan dalam sebut harga peribadi.",
    groups: ["Danau Toba & Samosir", "Hutan & tanah tinggi", "Budaya & jelajah lengkap"],
    detail: "Lihat itinerari pakej",
  },
  en: {
    heading: "Explore the full tour itineraries",
    intro: "Read the routes and day-by-day itineraries before requesting a quote. These are starting points; route changes, activities, inclusions, and final prices are confirmed in your private quotation.",
    groups: ["Lake Toba & Samosir", "Rainforest & highlands", "Culture & the complete journey"],
    detail: "View tour itinerary",
  },
};
const esc = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
let stale = false;
function save(relative, before, after) {
  // Windows checkouts may mix CRLF with generator-owned LF blocks. A cosmetic
  // synchronization must not treat line endings alone as package-content drift.
  if (before.replace(/\r\n/g, '\n') === after.replace(/\r\n/g, '\n')) return;
  if (checkOnly) {
    stale = true;
    console.error(`Out of sync: ${relative}`);
  } else {
    fs.writeFileSync(path.join(root, relative), after);
    console.log(`Updated ${relative}`);
  }
}

for (const [lang, copy] of Object.entries(locales)) {
  const relative = `${lang}/bros-wisata-tour-listing.html`;
  const before = fs.readFileSync(path.join(root, relative), "utf8");
  const groups = [packages.slice(0, 4), packages.slice(4, 9), packages.slice(9)];
  const directory = `${start}
    <nav class="quote-package-index" id="itinerary-paket" aria-labelledby="package-index-title">
      <h2 id="package-index-title">${copy.heading}</h2>
      <p>${copy.intro}</p>
      <div class="quote-package-groups">
${groups.map((items, i) => `        <div>
          <h3>${esc(copy.groups[i])}</h3>
          <ul>
${items.map(([slug, name, days, nights]) => {
    const target = fs.readFileSync(path.join(root, lang, `${slug}.html`), "utf8");
    const url = `https://broswisata.id/${lang}/${slug}`;
    if (!target.includes(`href="${url}" rel="canonical"`)) throw new Error(`Unexpected canonical: ${url}`);
    const label = slug === "paket-combo_sumut_6h5m"
      ? ({ en: "North Sumatra Grand Tour", id: name, ms: "Jelajah Sumatera Utara" }[lang]) : name;
    const duration = lang === "en" ? `${days}D${nights}N` : `${days}H${nights}M`;
    return `            <li><a href="/${lang}/${slug}">${esc(label)} <span>${duration}</span></a></li>`;
  }).join("\n")}
          </ul>
        </div>`).join("\n")}
      </div>
    </nav>
    ${end}`;
  let after = before;
  if (after.includes(start)) {
    if (!after.includes(end)) throw new Error(`Incomplete package directory: ${relative}`);
    after = after.replace(/<!-- BROS PACKAGE DIRECTORY START -->[\s\S]*?<!-- BROS PACKAGE DIRECTORY END -->/, directory);
  } else {
    const anchor = '    <div class="quote-tour-grid">';
    if (!after.includes(anchor)) throw new Error(`Missing tour grid: ${relative}`);
    after = after.replace(anchor, `    ${directory}\n${anchor}`);
  }
  // Only these cards match published detail itineraries. Keep custom-duration
  // cards on WhatsApp rather than silently sending 3/5/9-day trips to other routes.
  const matchingCards = [
    [{ en: "North Sumatra Grand Tour 6D5N", id: "Jelajah Sumatra Utara 6H5M", ms: "Jelajah Sumatera Utara 6H5M" }[lang], "paket-combo_sumut_6h5m"],
    [lang === "en" ? "7D6N Complete North Sumatra Adventure" : "7H6M Complete North Sumatra Adventure", "paket-western_7d6n_ultimate"],
  ];
  for (const [heading, slug] of matchingCards) {
    let found = false;
    after = after.replace(/<article class="quote-tour-card[^\"]*">[\s\S]*?<\/article>/g, (card) => {
      if (!card.includes(`<h3>${heading}</h3>`)) return card;
      found = true;
      const marker = '          <div class="quote-card-actions">';
      const link = `<a class="quote-btn detail" href="/${lang}/${slug}" aria-label="${copy.detail}: ${heading}">${copy.detail}</a>`;
      if (card.includes('class="quote-btn detail"')) {
        return card.replace(/<a class="quote-btn detail"[^>]*>[\s\S]*?<\/a>/, link);
      }
      return card.replace(marker, `${marker}\n            ${link}`);
    });
    if (!found) throw new Error(`Missing matching card: ${lang}/${heading}`);
  }
  after = after.replace(/href="\/assets\/bros-ui\.css(?:\?[^\"]*)?"/, 'href="/assets/bros-ui.css?v=20261018-tour-links"');
  const waLinks = (html) => html.match(/href="https:\/\/wa\.me\/[^\"]*"/g) || [];
  if (JSON.stringify(waLinks(before)) !== JSON.stringify(waLinks(after))) throw new Error(`WhatsApp links changed: ${relative}`);
  save(relative, before, after);
}

const sitemapFile = "sitemap.xml";
const sitemapBefore = fs.readFileSync(path.join(root, sitemapFile), "utf8");
const sitemapAfter = sitemapBefore.replace(/(<loc>https:\/\/broswisata\.id\/(?:id|en|ms)\/bros-wisata-tour-listing<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/g, `$1${updated}$2`);
save(sitemapFile, sitemapBefore, sitemapAfter);
if (stale) process.exitCode = 1;
else console.log(checkOnly ? "Tour package links are in sync." : "Tour package links synchronized.");
