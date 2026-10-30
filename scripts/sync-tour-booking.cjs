'use strict';

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const start = '<!-- BROS TOUR BOOKING START -->';
const end = '<!-- BROS TOUR BOOKING END -->';
const styleStart = '<!-- BROS TOUR BOOKING STYLE START -->';
const styleEnd = '<!-- BROS TOUR BOOKING STYLE END -->';
const cssHref = '/assets/tour-booking.css?v=20261030-booking';
const anchor = '<!-- PDF DOWNLOAD CARD -->';
const packageSlugs = [
  'berastagi_3h2m', 'bukit_lawang_4h3m', 'combo_sumut_6h5m',
  'halal_3h2m_medan_toba', 'halal_4h3m_medan_toba', 'halal_5h4m_medan_toba',
  'medan_heritage_3h2m', 'tangkahan_3h2m', 'western_4d3n_jungle',
  'western_5d4n_volcano', 'western_7d6n_ultimate'
];
const locales = {
  id: {
    title: 'Sebelum memesan',
    intro: 'Sebelum membayar deposit, pastikan tiga hal ini jelas.',
    questions: [
      ['Apa yang perlu ada dalam penawaran?', 'Minta penawaran tertulis yang merinci layanan yang termasuk dan tidak termasuk, harga, serta jadwal pembayaran deposit dan pelunasan.'],
      ['Bagaimana jika rencana berubah?', 'Sebelum membayar, tanyakan ketentuan pembatalan dan perubahan jadwal hotel serta aktivitas, termasuk apakah ada komponen yang tidak dapat dikembalikan.'],
      ['Bagaimana perubahan atau refund ditangani?', 'Permintaan perubahan, penjadwalan ulang, atau pengembalian dana ditinjau sesuai konfirmasi pemesanan tertulis dan Syarat & Ketentuan lengkap. Jangan mengasumsikan perubahan bebas biaya atau refund otomatis.']
    ],
    note: 'Ringkasan ini tidak menggantikan ketentuan pemesanan lengkap.',
    terms: 'Baca Syarat & Ketentuan',
    customize: 'Sesuaikan paket ini',
    compare: 'Bandingkan paket'
  },
  en: {
    title: 'Before booking',
    intro: 'Before paying a deposit, make sure these three points are clear.',
    questions: [
      ['What should the quote include?', 'Ask for a written quote listing included and excluded services, the price, and the deposit and balance payment schedule.'],
      ['What if my plans change?', 'Before paying, ask about hotel and activity cancellation and rescheduling conditions, including whether any components are non-refundable.'],
      ['How are changes or refunds handled?', 'Requests for changes, rescheduling, or refunds are assessed under your written booking confirmation and the full Terms & Conditions. Do not assume changes are free or refunds are automatic.']
    ],
    note: 'This summary does not replace the full booking terms.',
    terms: 'Read the Terms & Conditions',
    customize: 'Tailor this package',
    compare: 'Compare packages'
  },
  ms: {
    title: 'Sebelum menempah',
    intro: 'Sebelum membayar deposit, pastikan tiga perkara ini jelas.',
    questions: [
      ['Apakah yang perlu ada dalam sebut harga?', 'Minta sebut harga bertulis yang menyenaraikan perkhidmatan yang termasuk dan tidak termasuk, harga, serta jadual bayaran deposit dan baki.'],
      ['Bagaimana jika rancangan berubah?', 'Sebelum membayar, tanyakan syarat pembatalan dan penjadualan semula hotel serta aktiviti, termasuk sama ada terdapat komponen yang tidak boleh dibayar balik.'],
      ['Bagaimana perubahan atau bayaran balik dikendalikan?', 'Permintaan perubahan, penjadualan semula atau bayaran balik dinilai mengikut pengesahan tempahan bertulis dan Terma & Syarat penuh. Jangan anggap perubahan percuma atau bayaran balik automatik.']
    ],
    note: 'Ringkasan ini tidak menggantikan terma tempahan penuh.',
    terms: 'Baca Terma & Syarat',
    customize: 'Sesuaikan pakej ini',
    compare: 'Bandingkan pakej'
  }
};

const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockPattern = (open, close) => new RegExp(escapeRegex(open) + '[\\s\\S]*?' + escapeRegex(close), 'g');
const occurrences = (html, marker) => html.split(marker).length - 1;
function checkMarkers(html, open, close, relative) {
  const opens = occurrences(html, open), closes = occurrences(html, close);
  assert(opens <= 1 && opens === closes, 'Incomplete or repeated booking markers: ' + relative);
  if (opens) assert(html.indexOf(open) < html.indexOf(close), 'Reversed booking markers: ' + relative);
  return opens === 1;
}

function renderTourBooking(lang, slug) {
  assert(locales[lang] && packageSlugs.includes(slug), 'Unknown package booking locale or route');
  const c = locales[lang];
  const customHref = `/${lang}/bros-wisata-custom-tour?route=${encodeURIComponent(slug)}#custom-tour-form`;
  return `${start}
<section class="tour-booking" id="before-booking" aria-labelledby="tour-booking-title">
  <h2 id="tour-booking-title">${escapeHtml(c.title)}</h2>
  <p class="tour-booking-intro">${escapeHtml(c.intro)}</p>
  <div class="tour-booking-questions">
${c.questions.map(([question, answer]) => `    <details class="tour-booking-question">
      <summary>${escapeHtml(question)}</summary>
      <p>${escapeHtml(answer)}</p>
    </details>`).join('\n')}
  </div>
  <p class="tour-booking-note">${escapeHtml(c.note)}</p>
  <a class="tour-booking-terms" href="/${lang}/terms-of-service" data-cta="tour_booking_terms">${escapeHtml(c.terms)}</a>
  <div class="tour-booking-actions">
    <a class="tour-booking-customize" href="${escapeHtml(customHref)}" data-cta="tour_booking_customize">${escapeHtml(c.customize)}</a>
    <a class="tour-booking-compare" href="/${lang}/bros-wisata-tour-listing#compare-tours" data-cta="tour_booking_compare">${escapeHtml(c.compare)}</a>
  </div>
</section>
${end}`;
}

function stripTourBooking(html) {
  // Each owned insertion includes one following newline. No existing bytes are removed.
  return html
    .replace(new RegExp(escapeRegex(start) + '[\\s\\S]*?' + escapeRegex(end) + '(?:\\r\\n|\\n)?', 'g'), '')
    .replace(new RegExp(escapeRegex(styleStart) + '[\\s\\S]*?' + escapeRegex(styleEnd) + '(?:\\r\\n|\\n)?', 'g'), '')
    .replace(/<div\b[^>]*>/g, tag => tag.replace(/(\bclass=(["']))([^"']*)(\2)/, (_, prefix, quote, classes, close) =>
      prefix + classes.replace(/ tour-booking-gallery-column(?=\s|$)/g, '').replace(/ tour-booking-gallery(?=\s|$)/g, '') + close));
}

function synchronizeGalleryContainment(html, relative) {
  // Find the actual ancestor grid column, not an unrelated matching div.
  const classes = tag => (tag.match(/\bclass=["']([^"']*)["']/)?.[1] || '').split(/\s+/);
  const stack = [], galleries = [];
  for (const match of html.matchAll(/<\/?div\b[^>]*>/g)) {
    if (/^<\/div/i.test(match[0])) { stack.pop(); continue; }
    const node = {tag:match[0], index:match.index, classes:classes(match[0])};
    if (node.classes.includes('ig-carousel')) {
      const columns = stack.filter(parent => parent.classes.includes('lg:col-span-8'));
      assert.equal(columns.length, 1, 'Expected one gallery ancestor grid column: ' + relative);
      galleries.push({carousel:node, column:columns[0]});
    }
    stack.push(node);
  }
  assert(galleries.length <= 1, 'Unexpected multiple package carousels: ' + relative);
  if (!galleries.length) return html;
  const {carousel, column} = galleries[0];
  // PR31 Berastagi classes and behavior are pre-existing and remain untouched.
  if (column.classes.includes('bros-package-gallery-column') && carousel.classes.includes('bros-package-gallery')) return html;
  const additions = [[column, 'tour-booking-gallery-column'], [carousel, 'tour-booking-gallery']]
    .filter(([node, name]) => !node.classes.includes(name))
    .map(([node, name]) => ({...node, updated:node.tag.replace(/(\bclass=(["']))([^"']*)(\2)/, (_, prefix, quote, value, close) => prefix + value + ' ' + name + close)}))
    .sort((a,b) => b.index - a.index);
  for (const item of additions) html = html.slice(0, item.index) + item.updated + html.slice(item.index + item.tag.length);
  return html;
}

function synchronizeTourBooking(original, relative) {
  const target = /^(id|en|ms)\/paket-([a-z0-9_]+)\.html$/.exec(relative);
  assert(target && packageSlugs.includes(target[2]), 'Tour booking is limited to the 33 approved package pages: ' + relative);
  const [, lang, slug] = target;
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  const moduleExists = checkMarkers(original, start, end, relative);
  const styleExists = checkMarkers(original, styleStart, styleEnd, relative);
  const unowned = stripTourBooking(original);
  assert(!/\bid=["'](?:before-booking|tour-booking-title|tour-booking-style)["']/.test(unowned), 'Unowned booking ID collision: ' + relative);
  assert.equal((unowned.match(/<\/head>/gi) || []).length, 1, 'Expected one head: ' + relative);
  assert.equal(occurrences(unowned, anchor), 1, 'Expected one conversion-area anchor: ' + relative);
  const sidebar = unowned.match(/<aside\b[^>]*>[\s\S]*?<\/aside>/g) || [];
  assert.equal(sidebar.filter(s => s.includes(anchor)).length, 1, 'Booking anchor must remain inside the package sidebar: ' + relative);

  const module = renderTourBooking(lang, slug).replace(/\n/g, newline);
  const style = [styleStart, `<link id="tour-booking-style" href="${cssHref}" rel="stylesheet"/>`, styleEnd].join(newline);
  let html = moduleExists
    ? original.replace(blockPattern(start, end), module)
    : original.replace(anchor, module + newline + anchor);
  html = styleExists
    ? html.replace(blockPattern(styleStart, styleEnd), style)
    : html.replace(/<\/head>/i, style + newline + '</head>');
  html = synchronizeGalleryContainment(html, relative);
  assert.equal(stripTourBooking(html), unowned, 'Unrelated package bytes changed: ' + relative);
  return html;
}

function targetFiles() {
  const files = ['id','en','ms'].flatMap(lang => packageSlugs.map(slug => `${lang}/paket-${slug}.html`));
  const found = ['id','en','ms'].flatMap(lang => fs.readdirSync(path.join(root, lang)).filter(name => /^paket-.*\.html$/.test(name)).map(name => `${lang}/${name}`));
  assert.deepEqual(found.sort(), files.slice().sort(), 'Package inventory changed; review the bounded booking scope before running');
  return files;
}

module.exports = {synchronizeTourBooking, renderTourBooking, stripTourBooking, synchronizeGalleryContainment, targetFiles, packageSlugs, locales, cssHref};
if (require.main === module) {
  const args = process.argv.slice(2);
  assert(args.every(arg => arg === '--check'), 'Only --check is supported');
  const check = args.includes('--check');
  // Validate every page before any write, so unexpected markup cannot yield a partial update.
  const updates = targetFiles().map(relative => {
    const original = fs.readFileSync(path.join(root, relative), 'utf8');
    return {relative, original, updated:synchronizeTourBooking(original, relative)};
  }).filter(item => item.original !== item.updated);
  if (check && updates.length) {
    console.error('Tour booking is out of sync: ' + updates.map(item => item.relative).join(', '));
    process.exitCode = 1;
  } else {
    if (!check) for (const item of updates) fs.writeFileSync(path.join(root, item.relative), item.updated, 'utf8');
    console.log(check ? 'Tour booking synchronized across 33 package pages.' : `Applied tour booking to ${updates.length}/33 package pages.`);
  }
}
