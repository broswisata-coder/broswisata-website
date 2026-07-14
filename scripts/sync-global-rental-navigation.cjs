const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

const locales = {
  id: {
    navLabel: "Sewa Mobil",
    footerLabel: "Sewa Mobil + Supir",
    servicesLabel: "Layanan",
    homeLabel: "Beranda",
    toursLabel: "Paket Tour",
    customLabel: "Custom Tour",
    aboutLabel: "Tentang",
    contactLabel: "Kontak",
    whatsappLabel: "WhatsApp Kami",
  },
  en: {
    navLabel: "Car Rental",
    footerLabel: "Car Rental with Driver",
    servicesLabel: "Services",
    homeLabel: "Home",
    toursLabel: "Tour Packages",
    customLabel: "Custom Tour",
    aboutLabel: "About",
    contactLabel: "Contact",
    whatsappLabel: "WhatsApp Us",
  },
  ms: {
    navLabel: "Sewa Kereta",
    footerLabel: "Sewa Kereta + Pemandu",
    servicesLabel: "Perkhidmatan",
    homeLabel: "Utama",
    toursLabel: "Pakej Tour",
    customLabel: "Tour Tersuai",
    aboutLabel: "Tentang",
    contactLabel: "Hubungi",
    whatsappLabel: "WhatsApp Kami",
  },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countHref(fragment, href) {
  const pattern = new RegExp(`href=["']${escapeRegex(href)}["']`, "g");
  return (fragment.match(pattern) || []).length;
}

function anchorsForHref(fragment, href) {
  const pattern = new RegExp(
    `<a\\b(?=[^>]*href=["']${escapeRegex(href)}["'])[^>]*>[\\s\\S]*?<\\/a>`,
    "g",
  );
  return fragment.match(pattern) || [];
}

function anchorHasLabel(anchor, label) {
  const visibleText = anchor.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return visibleText.includes(label);
}

function replaceRange(html, section, replacement) {
  return html.slice(0, section.start) + replacement + html.slice(section.end);
}

function taggedSections(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, "g");
  return [...html.matchAll(pattern)].map((match) => ({
    content: match[0],
    start: match.index,
    end: match.index + match[0].length,
  }));
}

function primaryNavSection(html, tourHref, relativePath) {
  const matches = taggedSections(html, "nav").filter(({ content }) => {
    const openingTag = content.match(/^<nav\b[^>]*>/)?.[0] || "";
    const primaryClass = /class=["'][^"']*(?:seo-nav|sticky|fixed)(?:\s|["'])/.test(openingTag);
    return primaryClass && content.includes(`href="${tourHref}"`);
  });

  if (matches.length !== 1) {
    throw new Error(
      `${relativePath}: expected one primary navigation containing ${tourHref}, found ${matches.length}`,
    );
  }
  return matches[0];
}

function navLink({ href, label, mobile, seo, fixed, active }) {
  if (seo) {
    return `<a href="${href}">${label}</a>`;
  }

  if (mobile) {
    const classes = active
      ? "py-3 border-b border-bros-charcoal/10 text-bros-blue font-bold font-medium"
      : "py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium";
    return `<a class="${classes}" href="${href}">${label}</a>`;
  }

  const classes = active
    ? "text-sm font-medium text-bros-blue border-b-2 border-bros-blue pb-1"
    : fixed
      ? "text-bros-charcoal hover:text-bros-blue font-medium"
      : "text-sm font-medium text-bros-charcoal hover:text-bros-blue transition";
  return `<a class="${classes}" href="${href}">\n${label}\n</a>`;
}

function updatePrimaryNav(html, locale, labels, relativePath) {
  const tourHref = `/${locale}/bros-wisata-tour-listing`;
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const section = primaryNavSection(html, tourHref, relativePath);
  let nav = section.content;
  const openingTag = nav.match(/^<nav\b[^>]*>/)?.[0] || "";
  const seo = /class=["'][^"']*seo-nav/.test(openingTag);
  const fixed = /class=["'][^"']*fixed/.test(openingTag);
  const active = path.basename(relativePath) === "bros-wisata-car-rental.html";
  const mobileMenuOffset = nav.indexOf('id="mobile-menu"');
  const tourAnchorPattern = new RegExp(
    `<a\\b(?=[^>]*href=["']${escapeRegex(tourHref)}["'])[^>]*>[\\s\\S]*?<\\/a>`,
    "g",
  );
  const tourMatches = [...nav.matchAll(tourAnchorPattern)];

  if (tourMatches.length < 1 || tourMatches.length > 2) {
    throw new Error(
      `${relativePath}: expected one or two tour links in primary navigation, found ${tourMatches.length}`,
    );
  }

  const existingRentalLinks = countHref(nav, rentalHref);
  if (existingRentalLinks === 0) {
    nav = nav.replace(tourAnchorPattern, (anchor, offset) => {
      const mobile = mobileMenuOffset >= 0 && offset > mobileMenuOffset;
      const link = navLink({ href: rentalHref, label: labels.navLabel, mobile, seo, fixed, active });
      return `${anchor}\n${link}`;
    });
  } else if (existingRentalLinks !== tourMatches.length) {
    throw new Error(
      `${relativePath}: expected ${tourMatches.length} rental links in primary navigation, found ${existingRentalLinks}`,
    );
  }

  nav = nav
    .replace(
      "hidden lg:flex items-center gap-8",
      "hidden lg:flex items-center gap-4 xl:gap-8",
    )
    .replace(
      "hidden lg:flex items-center gap-5 xl:gap-8",
      "hidden lg:flex items-center gap-4 xl:gap-8",
    );

  if (countHref(nav, rentalHref) !== tourMatches.length) {
    throw new Error(`${relativePath}: failed to synchronize primary rental navigation`);
  }
  if (anchorsForHref(nav, rentalHref).some((anchor) => !anchorHasLabel(anchor, labels.navLabel))) {
    throw new Error(`${relativePath}: primary rental navigation has the wrong localized label`);
  }

  return {
    html: replaceRange(html, section, nav),
    mobileInsideNav: mobileMenuOffset >= 0,
  };
}

function mobileMenuSection(html, relativePath) {
  const opening = html.match(/<div\b[^>]*id=["']mobile-menu["'][^>]*>/);
  if (!opening || opening.index === undefined) {
    return null;
  }
  const closingIndex = html.indexOf("</div>", opening.index);
  if (closingIndex < 0) {
    throw new Error(`${relativePath}: mobile menu closing tag not found`);
  }
  return {
    content: html.slice(opening.index, closingIndex + "</div>".length),
    start: opening.index,
    end: closingIndex + "</div>".length,
  };
}

function missingMobileMenuMarkup(locale, labels, whatsappHref) {
  return `<div class="hidden flex-col lg:hidden bg-white border-t border-bros-charcoal/10 shadow-lg fixed top-20 left-0 right-0 py-4 px-4 overflow-y-auto" id="mobile-menu" style="z-index: 9999; max-height: calc(100vh - 80px); background-color: #ffffff;">
<a class="py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium" href="/${locale}/">${labels.homeLabel}</a>
<a class="py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium" href="/${locale}/bros-wisata-tour-listing">${labels.toursLabel}</a>
<a class="py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium" href="/${locale}/bros-wisata-custom-tour">${labels.customLabel}</a>
<a class="py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium" href="/${locale}/bros-wisata-car-rental">${labels.navLabel}</a>
<a class="py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium" href="/${locale}/bros-wisata-about">${labels.aboutLabel}</a>
<a class="py-3 border-b border-bros-charcoal/10 text-bros-charcoal font-medium" href="/${locale}/bros-wisata-contact">${labels.contactLabel}</a>
<a class="mt-3 bg-bros-blue text-white text-center py-3 font-bold rounded-sm" href="${whatsappHref}" rel="noopener noreferrer" target="_blank">📱 ${labels.whatsappLabel}</a>
</div>`;
}

function missingMobileMenuBehavior() {
  return `<script data-global-mobile-menu>
(function () {
  var button = document.getElementById("mobile-menu-btn");
  var menu = document.getElementById("mobile-menu");
  var openIcon = document.getElementById("menu-icon-open");
  var closeIcon = document.getElementById("menu-icon-close");
  if (!button || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    menu.classList.toggle("flex", open);
    button.setAttribute("aria-expanded", String(open));
    if (openIcon) openIcon.style.display = open ? "none" : "block";
    if (closeIcon) closeIcon.style.display = open ? "block" : "none";
  }

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(menu.classList.contains("hidden"));
  });
  document.addEventListener("click", function (event) {
    if (!button.contains(event.target) && !menu.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !menu.classList.contains("hidden")) {
      setOpen(false);
      button.focus();
    }
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setOpen(false); });
  });
})();
</script>`;
}

function createMissingMobileMenu(html, locale, labels, relativePath) {
  if (!html.includes('id="mobile-menu-btn"')) {
    return html;
  }

  const tourHref = `/${locale}/bros-wisata-tour-listing`;
  const nav = primaryNavSection(html, tourHref, relativePath);
  const whatsappHref = nav.content.match(/href=["'](https:\/\/wa\.me\/[^"']+)["']/)?.[1];
  if (!whatsappHref) {
    throw new Error(`${relativePath}: WhatsApp URL not found in primary navigation`);
  }

  let navWithMobileMenu = nav.content.replace(
    /(<button\b(?=[^>]*id=["']mobile-menu-btn["'])(?![^>]*aria-controls=)[^>]*)(>)/,
    '$1 aria-controls="mobile-menu"$2',
  );
  navWithMobileMenu = navWithMobileMenu.replace(
    /<\/nav>\s*$/,
    `${missingMobileMenuMarkup(locale, labels, whatsappHref)}\n</nav>`,
  );
  let updated = replaceRange(html, nav, navWithMobileMenu);
  if (!updated.includes("data-global-mobile-menu")) {
    updated = updated.replace("</body>", `${missingMobileMenuBehavior()}\n</body>`);
  }
  return updated;
}

function updateExternalMobileMenu(html, locale, labels, relativePath, mobileInsideNav) {
  if (mobileInsideNav) {
    return html;
  }

  const section = mobileMenuSection(html, relativePath);
  if (!section) {
    return createMissingMobileMenu(html, locale, labels, relativePath);
  }

  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const customHref = `/${locale}/bros-wisata-custom-tour`;
  const tourHref = `/${locale}/bros-wisata-tour-listing`;
  const active = path.basename(relativePath) === "bros-wisata-car-rental.html";
  let mobile = section.content;
  const existingRentalLinks = countHref(mobile, rentalHref);

  if (existingRentalLinks === 0) {
    const insertionHref = mobile.includes(`href="${customHref}"`) ? customHref : tourHref;
    const anchorPattern = new RegExp(
      `<a\\b(?=[^>]*href=["']${escapeRegex(insertionHref)}["'])[^>]*>[\\s\\S]*?<\\/a>`,
    );
    if (!anchorPattern.test(mobile)) {
      throw new Error(`${relativePath}: mobile navigation insertion point not found`);
    }
    const link = navLink({
      href: rentalHref,
      label: labels.navLabel,
      mobile: true,
      seo: false,
      fixed: false,
      active,
    });
    mobile = mobile.replace(anchorPattern, (anchor) => `${anchor}\n${link}`);
  } else if (existingRentalLinks !== 1) {
    throw new Error(`${relativePath}: expected one rental link in external mobile menu`);
  }

  if (anchorsForHref(mobile, rentalHref).some((anchor) => !anchorHasLabel(anchor, labels.navLabel))) {
    throw new Error(`${relativePath}: mobile rental navigation has the wrong localized label`);
  }

  return replaceRange(html, section, mobile);
}

function updateRichFooter(footer, locale, labels, relativePath) {
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const customHref = `/${locale}/bros-wisata-custom-tour`;
  const lists = taggedSections(footer, "ul").filter(({ content }) =>
    content.includes(`href="${customHref}"`),
  );

  if (lists.length !== 1) {
    throw new Error(`${relativePath}: expected one services list in rich footer, found ${lists.length}`);
  }

  const list = lists[0];
  let services = list.content;
  if (countHref(services, rentalHref) === 0) {
    const customItemPattern = new RegExp(
      `<li>\\s*<a\\b(?=[^>]*href=["']${escapeRegex(customHref)}["'])[^>]*>[\\s\\S]*?<\\/a>\\s*<\\/li>`,
    );
    if (!customItemPattern.test(services)) {
      throw new Error(`${relativePath}: custom-tour footer item not found`);
    }
    const rentalItem = `<li><a class="hover:text-bros-gold transition" href="${rentalHref}">${labels.footerLabel}</a></li>`;
    services = services.replace(
      customItemPattern,
      (customItem) => `${customItem}\n${rentalItem}`,
    );
  }

  if (countHref(services, rentalHref) !== 1) {
    throw new Error(`${relativePath}: rich footer rental link is not unique`);
  }
  return replaceRange(footer, list, services);
}

function updateSeoFooter(footer, locale, labels, relativePath) {
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const tourHref = `/${locale}/bros-wisata-tour-listing`;
  const serviceBlockPattern = new RegExp(
    `<div>\\s*<h2>${escapeRegex(labels.servicesLabel)}<\\/h2>[\\s\\S]*?<\\/div>`,
  );
  const serviceBlock = footer.match(serviceBlockPattern)?.[0];
  if (!serviceBlock) {
    throw new Error(`${relativePath}: SEO services footer block not found`);
  }

  let updatedBlock = serviceBlock;
  if (countHref(updatedBlock, rentalHref) === 0) {
    const tourAnchorPattern = new RegExp(
      `<a\\b(?=[^>]*href=["']${escapeRegex(tourHref)}["'])[^>]*>[\\s\\S]*?<\\/a>`,
    );
    if (!tourAnchorPattern.test(updatedBlock)) {
      throw new Error(`${relativePath}: SEO footer tour link not found`);
    }
    const rentalLink = `<a href="${rentalHref}">${labels.footerLabel}</a>`;
    updatedBlock = updatedBlock.replace(
      tourAnchorPattern,
      (tourAnchor) => `${tourAnchor}\n      ${rentalLink}`,
    );
  }

  if (countHref(updatedBlock, rentalHref) !== 1) {
    throw new Error(`${relativePath}: SEO footer rental link is not unique`);
  }
  return footer.replace(serviceBlockPattern, updatedBlock);
}

function updateCompactFooter(footer, locale, labels, relativePath) {
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  if (countHref(footer, rentalHref) === 0) {
    const innerClosingIndex = footer.lastIndexOf("</div>");
    if (innerClosingIndex < 0) {
      throw new Error(`${relativePath}: compact footer container not found`);
    }
    const rentalLink = `<p class="text-xs mt-4"><a class="text-bros-gold hover:text-white transition" href="${rentalHref}">${labels.footerLabel}</a></p>\n`;
    footer =
      footer.slice(0, innerClosingIndex) + rentalLink + footer.slice(innerClosingIndex);
  }

  if (countHref(footer, rentalHref) !== 1) {
    throw new Error(`${relativePath}: compact footer rental link is not unique`);
  }
  return footer;
}

function updateFooter(html, locale, labels, relativePath) {
  const footers = taggedSections(html, "footer");
  if (footers.length !== 1) {
    throw new Error(`${relativePath}: expected one footer, found ${footers.length}`);
  }

  const section = footers[0];
  let footer = section.content;
  const rentalHref = `/${locale}/bros-wisata-car-rental`;
  const customHref = `/${locale}/bros-wisata-custom-tour`;
  const isSeoFooter = /<footer\b[^>]*class=["'][^"']*seo-footer/.test(footer);
  const isRichFooter = footer.includes(`href="${customHref}"`);
  const isCompactFooter = /<footer\b[^>]*class=["'][^"']*py-12/.test(footer);

  if (isSeoFooter) {
    footer = updateSeoFooter(footer, locale, labels, relativePath);
  } else if (isRichFooter) {
    footer = updateRichFooter(footer, locale, labels, relativePath);
  } else if (isCompactFooter) {
    footer = updateCompactFooter(footer, locale, labels, relativePath);
  } else {
    throw new Error(`${relativePath}: unrecognized footer variant`);
  }

  if (countHref(footer, rentalHref) < 1) {
    throw new Error(`${relativePath}: footer is missing its rental link`);
  }
  if (anchorsForHref(footer, rentalHref).some((anchor) => !anchorHasLabel(anchor, labels.footerLabel))) {
    throw new Error(`${relativePath}: footer rental link has the wrong localized label`);
  }

  return replaceRange(html, section, footer);
}

function synchronizePage(original, locale, labels, relativePath) {
  const navResult = updatePrimaryNav(original, locale, labels, relativePath);
  let updated = updateExternalMobileMenu(
    navResult.html,
    locale,
    labels,
    relativePath,
    navResult.mobileInsideNav,
  );
  updated = updateFooter(updated, locale, labels, relativePath);
  for (const otherLocale of Object.keys(locales).filter((candidate) => candidate !== locale)) {
    const wrongHref = `/${otherLocale}/bros-wisata-car-rental`;
    if (updated.includes(`href="${wrongHref}"`)) {
      throw new Error(`${relativePath}: contains wrong-locale rental link ${wrongHref}`);
    }
  }
  return updated;
}

const updates = [];
let pageCount = 0;
const localePageCounts = [];

for (const [locale, labels] of Object.entries(locales)) {
  const localeDirectory = path.join(root, locale);
  const files = fs
    .readdirSync(localeDirectory)
    .filter((file) => file.endsWith(".html"))
    .sort();
  localePageCounts.push(files.length);

  for (const file of files) {
    pageCount += 1;
    const absolutePath = path.join(localeDirectory, file);
    const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
    const original = fs.readFileSync(absolutePath, "utf8");
    const updated = synchronizePage(original, locale, labels, relativePath);
    if (updated !== original) {
      updates.push({ absolutePath, relativePath, content: updated });
    }
  }
}

if (localePageCounts.some((count) => count < 1 || count !== localePageCounts[0])) {
  throw new Error(`Localized page counts are unbalanced: ${localePageCounts.join(", ")}`);
}

if (checkOnly) {
  if (updates.length > 0) {
    throw new Error(
      `Global rental navigation is not synchronized in: ${updates.map((item) => item.relativePath).join(", ")}`,
    );
  }
  console.log(`Global rental navigation check passed for all ${pageCount} localized HTML pages.`);
  process.exit(0);
}

for (const update of updates) {
  fs.writeFileSync(update.absolutePath, update.content, "utf8");
}

console.log(
  updates.length === 0
    ? "Global rental navigation already synchronized."
    : `Updated global rental navigation in ${updates.length} HTML pages.`,
);
