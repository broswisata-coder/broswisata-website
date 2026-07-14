const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const pauseMarker =
  "<!-- CAR RENTAL TEMP PAUSED: vendor transport/rental content is paused while fleet and pricing are updated. -->";

const locales = {
  id: {
    files: ["id/index.html", "id/bros-wisata-homepage.html"],
    rentalFile: "id/bros-wisata-car-rental.html",
    navLabel: "Sewa Mobil",
    footerLabel: "Sewa Mobil + Supir",
    eyebrow: "Transportasi privat",
    title: "Rental mobil untuk rute Sumatra Utara.",
    copy: "Avanza, Innova, Hiace, Fortuner hingga Alphard dengan supir. Pilih berdasarkan jumlah tamu, bagasi, dan rute; unit aktual dikonfirmasi sebelum pembayaran.",
    viewFleet: "Lihat 7 pilihan armada",
    availability: "Cek ketersediaan",
    highlights: ["Dengan supir", "Airport & multi-hari", "Quote tertulis"],
    imageAlt: "Ilustrasi resmi Toyota Innova untuk layanan rental mobil BROS Wisata",
    imageNote: "Contoh model resmi · unit aktual sesuai ketersediaan",
    whatsapp:
      "https://wa.me/6281260139399?text=%5BCAR-HOME%5D%20Halo%20BROS%20Wisata%2C%20saya%20ingin%20cek%20ketersediaan%20mobil%20%2B%20supir.%20Tanggal%3A%20__%20%7C%20Jemput%3A%20__%20%7C%20Tujuan%3A%20__%20%7C%20Jumlah%20tamu%3A%20__.",
  },
  en: {
    files: ["en/index.html", "en/bros-wisata-homepage.html"],
    rentalFile: "en/bros-wisata-car-rental.html",
    navLabel: "Car Rental",
    footerLabel: "Car Rental with Driver",
    eyebrow: "Private transport",
    title: "The right vehicle for North Sumatra.",
    copy: "Choose from Avanza, Innova, Hiace, Fortuner and Alphard with a driver. We match the vehicle to your guest count, luggage and route; the actual unit is confirmed before payment.",
    viewFleet: "View 7 vehicle options",
    availability: "Check availability",
    highlights: ["Driver included", "Airport & multi-day", "Written quote"],
    imageAlt: "Official Toyota Innova model illustration for BROS Wisata car rental",
    imageNote: "Official model example · actual unit subject to availability",
    whatsapp:
      "https://wa.me/6281260139399?text=%5BCAR-HOME%5D%20Hi%20BROS%20Wisata%2C%20I%20would%20like%20to%20check%20car%20%2B%20driver%20availability.%20Date%3A%20__%20%7C%20Pickup%3A%20__%20%7C%20Route%3A%20__%20%7C%20Guests%3A%20__.",
  },
  ms: {
    files: ["ms/index.html", "ms/bros-wisata-homepage.html"],
    rentalFile: "ms/bros-wisata-car-rental.html",
    navLabel: "Sewa Kereta",
    footerLabel: "Sewa Kereta + Pemandu",
    eyebrow: "Pengangkutan persendirian",
    title: "Kenderaan yang tepat untuk Sumatera Utara.",
    copy: "Pilih Avanza, Innova, Hiace, Fortuner hingga Alphard dengan pemandu. Kami padankan kenderaan mengikut jumlah tetamu, bagasi dan laluan; unit sebenar disahkan sebelum bayaran.",
    viewFleet: "Lihat 7 pilihan kenderaan",
    availability: "Semak ketersediaan",
    highlights: ["Pemandu disertakan", "Airport & berbilang hari", "Sebut harga bertulis"],
    imageAlt: "Ilustrasi rasmi Toyota Innova untuk sewa kereta BROS Wisata",
    imageNote: "Contoh model rasmi · unit sebenar mengikut ketersediaan",
    whatsapp:
      "https://wa.me/6281260139399?text=%5BCAR-HOME%5D%20Hai%20BROS%20Wisata%2C%20saya%20ingin%20semak%20ketersediaan%20kereta%20%2B%20pemandu.%20Tarikh%3A%20__%20%7C%20Jemput%3A%20__%20%7C%20Laluan%3A%20__%20%7C%20Tetamu%3A%20__.",
  },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceSection(html, section, replacement) {
  return html.slice(0, section.start) + replacement + html.slice(section.end);
}

function findTaggedSection(html, tagName, predicate, file) {
  const pattern = new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, "g");
  const matches = [...html.matchAll(pattern)].filter((match) => predicate(match[0]));
  if (matches.length !== 1) {
    throw new Error(`${file}: expected one matching <${tagName}>, found ${matches.length}`);
  }
  return {
    content: matches[0][0],
    start: matches[0].index,
    end: matches[0].index + matches[0][0].length,
  };
}

function insertAfterAnchor(fragment, anchorHref, insertion, file) {
  const anchorPattern = new RegExp(
    `<a\\b(?=[^>]*href=["']${escapeRegex(anchorHref)}["'])[^>]*>[\\s\\S]*?<\\/a>`,
  );
  const matches = fragment.match(anchorPattern);
  if (!matches) {
    throw new Error(`${file}: anchor ${anchorHref} not found`);
  }
  return fragment.replace(anchorPattern, (anchor) => `${anchor}\n${insertion}`);
}

function updatePrimaryNav(html, locale, labels, file, active = false) {
  const tourHref = `/${locale}/bros-wisata-tour-listing`;
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const section = findTaggedSection(
    html,
    "nav",
    (nav) => nav.includes("sticky") && nav.includes(`href="${tourHref}"`),
    file,
  );
  let nav = section.content;

  if (!nav.includes(`href="${rentalHref}"`)) {
    const classes = active
      ? "text-sm font-medium text-bros-blue border-b-2 border-bros-blue pb-1"
      : "text-sm font-medium text-bros-charcoal hover:text-bros-blue transition";
    const link = `<a class="${classes}" href="${rentalHref}">\n${labels.navLabel}\n</a>`;
    nav = insertAfterAnchor(nav, tourHref, link, file);
  }

  nav = nav.replace(
    "hidden lg:flex items-center gap-8",
    "hidden lg:flex items-center gap-5 xl:gap-8",
  );
  return replaceSection(html, section, nav);
}

function updateMobileMenu(html, locale, labels, file, active = false) {
  const customHref = `/${locale}/bros-wisata-custom-tour`;
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const opening = html.match(/<div\b[^>]*id=["']mobile-menu["'][^>]*>/);
  if (!opening || opening.index === undefined) {
    throw new Error(`${file}: mobile menu not found`);
  }
  const end = html.indexOf("</div>", opening.index) + "</div>".length;
  if (end < "</div>".length) {
    throw new Error(`${file}: mobile menu closing tag not found`);
  }
  const section = {
    start: opening.index,
    end,
    content: html.slice(opening.index, end),
  };
  let mobile = section.content;

  if (!mobile.includes(`href="${rentalHref}"`)) {
    const classes = active
      ? "py-3 border-b border-bros-charcoal/10 text-bros-blue font-bold font-medium"
      : "py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium";
    const link = `<a class="${classes}" href="${rentalHref}">${labels.navLabel}</a>`;
    mobile = insertAfterAnchor(mobile, customHref, link, file);
  }

  return replaceSection(html, section, mobile);
}

function updateFooter(html, locale, labels, file) {
  const customHref = `/${locale}/bros-wisata-custom-tour`;
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const section = findTaggedSection(
    html,
    "footer",
    (footer) => footer.includes(`href="${customHref}"`),
    file,
  );
  let footer = section.content;

  if (!footer.includes(`href="${rentalHref}"`)) {
    const itemPattern = new RegExp(
      `<li>\\s*<a\\b(?=[^>]*href=["']${escapeRegex(customHref)}["'])[^>]*>[\\s\\S]*?<\\/a>\\s*<\\/li>`,
    );
    if (!itemPattern.test(footer)) {
      throw new Error(`${file}: custom-tour footer item not found`);
    }
    const item = `<li><a class="hover:text-bros-gold transition" href="${rentalHref}">${labels.footerLabel}</a></li>`;
    footer = footer.replace(itemPattern, (customItem) => `${customItem}\n${item}`);
  }

  return replaceSection(html, section, footer);
}

function serviceBand(locale, labels) {
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const chips = labels.highlights
    .map(
      (highlight) =>
        `<span class="border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold">${highlight}</span>`,
    )
    .join("\n");

  return `<!-- ======= CAR RENTAL ======= -->
<section class="py-20 lg:py-24 bg-white" id="car-rental-service">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid lg:grid-cols-12 overflow-hidden bg-bros-navy text-white shadow-xl">
<div class="lg:col-span-7 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
<div class="text-bros-gold text-xs tracking-[0.3em] uppercase font-bold mb-5">✦ ${labels.eyebrow}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] mb-6">${labels.title}</h2>
<p class="text-white/75 leading-relaxed max-w-2xl">${labels.copy}</p>
<div class="flex flex-col sm:flex-row gap-3 mt-8">
<a class="inline-flex items-center justify-center gap-2 bg-bros-gold text-bros-navy px-6 py-3.5 font-bold hover:bg-white transition" href="${rentalHref}">${labels.viewFleet} <span aria-hidden="true">→</span></a>
<a class="inline-flex items-center justify-center border border-white/30 px-6 py-3.5 font-bold hover:bg-white/10 transition" data-cta="car_rental_home_quote" href="${labels.whatsapp}" rel="noopener noreferrer" target="_blank">${labels.availability}</a>
</div>
<div class="flex flex-wrap gap-2 mt-7">
${chips}
</div>
</div>
<div class="lg:col-span-5 bg-bros-cream p-8 sm:p-10 flex flex-col justify-center min-h-[340px]">
<img alt="${labels.imageAlt}" class="w-full h-auto object-contain" decoding="async" height="800" loading="lazy" src="/assets/cars/toyota-innova-reborn.webp" width="1200"/>
<p class="mt-4 text-center text-xs font-semibold tracking-wide text-bros-charcoal/70">${labels.imageNote}</p>
</div>
</div>
</div>
</section>`;
}

function updateHomepage(html, locale, labels, file) {
  let updated = updatePrimaryNav(html, locale, labels, file);
  updated = updateMobileMenu(updated, locale, labels, file);
  updated = updateFooter(updated, locale, labels, file);
  const band = serviceBand(locale, labels);

  if (updated.includes(pauseMarker)) {
    updated = updated.replace(pauseMarker, band);
  } else {
    const bandPattern = /(?:<!-- ======= CAR RENTAL ======= -->\s*)+<section\b[^>]*id=["']car-rental-service["'][^>]*>[\s\S]*?<\/section>/;
    if (!bandPattern.test(updated)) {
      throw new Error(`${file}: rental service band and pause marker are both missing`);
    }
    updated = updated.replace(bandPattern, band);
  }

  return updated;
}

const updates = [];
for (const [locale, labels] of Object.entries(locales)) {
  for (const relativePath of labels.files) {
    const absolutePath = path.join(root, relativePath);
    const original = fs.readFileSync(absolutePath, "utf8");
    const updated = updateHomepage(original, locale, labels, relativePath);
    if (updated !== original) {
      updates.push({ absolutePath, relativePath, content: updated });
    }
  }

  const rentalPath = labels.rentalFile;
  const rentalAbsolutePath = path.join(root, rentalPath);
  const rentalOriginal = fs.readFileSync(rentalAbsolutePath, "utf8");
  let rentalUpdated = updatePrimaryNav(rentalOriginal, locale, labels, rentalPath, true);
  rentalUpdated = updateMobileMenu(rentalUpdated, locale, labels, rentalPath, true);
  rentalUpdated = updateFooter(rentalUpdated, locale, labels, rentalPath);
  if (rentalUpdated !== rentalOriginal) {
    updates.push({ absolutePath: rentalAbsolutePath, relativePath: rentalPath, content: rentalUpdated });
  }
}

if (checkOnly) {
  if (updates.length > 0) {
    throw new Error(`Homepage rental entry is not synchronized in: ${updates.map((item) => item.relativePath).join(", ")}`);
  }
  console.log("Homepage rental entry and active rental-page navigation are synchronized.");
  process.exit(0);
}

for (const update of updates) {
  fs.writeFileSync(update.absolutePath, update.content, "utf8");
}

console.log(
  updates.length === 0
    ? "Homepage rental entry already synchronized."
    : `Updated homepage rental entry in ${updates.length} files.`,
);
