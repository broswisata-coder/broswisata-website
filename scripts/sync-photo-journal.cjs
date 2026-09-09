// The September 2026 collection uses the supplied photographs at their original ratio.
// Run with --check to verify the published ID, EN and MS sections without writing.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const base = '/assets/gallery/sumatra-2026-09/';
const photos = [
  { slug: 'lake-toba-bays', source: '16.10.42',
    id: ['Teluk dan perbukitan Danau Toba', 'Lekuk tepian danau, perbukitan hijau, dan awan yang bergerak di atas Danau Toba.'],
    en: ['Lake Toba bays and hills', 'Curving shores, green hills, and clouds over Lake Toba.'],
    ms: ['Teluk dan bukit Danau Toba', 'Lengkung tepian tasik, bukit menghijau, dan awan di atas Danau Toba.'] },
  { slug: 'sipiso-piso-valley', source: '16.10.41',
    id: ['Sipiso-Piso dari atas lembah', 'Aliran air terjun yang ramping di antara tebing dan bentang hijau dataran tinggi.'],
    en: ['Sipiso-Piso from the valley rim', 'A slender waterfall framed by cliffs and the green highlands.'],
    ms: ['Sipiso-Piso dari atas lembah', 'Aliran air terjun yang ramping di antara tebing dan kehijauan tanah tinggi.'] },
  { slug: 'mountain-dawn-clouds', source: '16.10.39',
    id: ['Fajar di atas awan', 'Cahaya pertama di cakrawala, sementara lampu permukiman masih terlihat di lembah.'],
    en: ['Dawn above the clouds', 'First light on the horizon, with village lights still visible in the valley.'],
    ms: ['Fajar di atas awan', 'Cahaya pertama di kaki langit, sementara lampu penempatan masih kelihatan di lembah.'] },
  { slug: 'mountain-sunrise', source: '16.10.38',
    id: ['Matahari pagi di pegunungan', 'Sinar keemasan muncul di atas lautan awan dan siluet punggungan.'],
    en: ['Morning light in the mountains', 'Golden sunlight above a sea of clouds and mountain silhouettes.'],
    ms: ['Matahari pagi di pergunungan', 'Sinar keemasan muncul di atas lautan awan dan siluet banjaran.'] },
  { slug: 'coffee-cherries', source: '16.10.36',
    id: ['Buah kopi di ranting', 'Dari hijau hingga kemerahan: detail buah kopi sebelum menjadi secangkir minuman.'],
    en: ['Coffee cherries on the branch', 'From green to red: a closer look at coffee before it reaches the cup.'],
    ms: ['Buah kopi di ranting', 'Daripada hijau hingga kemerahan: buah kopi sebelum menjadi secawan minuman.'] },
  { slug: 'local-fruit-market', source: '16.10.34',
    id: ['Warna-warni pasar buah', 'Salak, manggis, alpukat, dan aneka buah memenuhi lapak pasar.'],
    en: ['Colours of the fruit market', 'Snake fruit, mangosteens, avocados, and other fruit fill a market stall.'],
    ms: ['Warna-warni pasar buah', 'Salak, manggis, avokado, dan pelbagai buah memenuhi gerai pasar.'] },
  { slug: 'lake-evening-sky', source: '16.10.33 (1)',
    id: ['Langit jingga di tepi danau', 'Warna hangat di awan berpadu dengan riak air dan siluet perbukitan.'],
    en: ['An orange sky by the lake', 'Warm cloud colours above rippling water and a silhouette of hills.'],
    ms: ['Langit jingga di tepi tasik', 'Warna hangat pada awan berpadu dengan riak air dan siluet bukit.'] },
  { slug: 'waterfall-green-hillside', source: '16.10.33',
    id: ['Air terjun di lereng hijau', 'Air mengalir melebar di permukaan batu, dikelilingi pepohonan dan rerumputan.'],
    en: ['A waterfall on a green hillside', 'Water fans across the rock face, surrounded by trees and grass.'],
    ms: ['Air terjun di lereng hijau', 'Air mengalir melebar di permukaan batu, dikelilingi pokok dan rumput.'] },
  { slug: 'white-flower-highlands', source: '16.10.32',
    id: ['Detail kecil di dataran tinggi', 'Bunga putih di antara dedaunan, dengan pegunungan sebagai latar.'],
    en: ['Small details in the highlands', 'A white flower among green leaves, with mountains in the background.'],
    ms: ['Perincian kecil di tanah tinggi', 'Bunga putih di celah dedaun, dengan pergunungan sebagai latar.'] },
];
const locales = {
  id: { kicker: 'Koleksi foto terbaru', title: 'Dari tepian danau ke atas awan.', intro: 'Potret Danau Toba, air terjun, fajar di pegunungan, dan warna kehidupan lokal dari koleksi perjalanan BROS Wisata.', all: 'Lihat semua 9 foto', cta: 'Rancang perjalanan Anda', fullIntro: 'Sembilan sudut perjalanan: panorama danau, air terjun, pegunungan, kopi, pasar buah, dan detail alam yang mengisi perjalanan.' },
  en: { kicker: 'Latest photo collection', title: 'From lakeside views to a sea of clouds.', intro: 'Lake Toba, waterfalls, mountain dawns, and local colour from the BROS Wisata travel collection.', all: 'View all 9 photos', cta: 'Plan your trip', fullIntro: 'Nine views from the journey: lakes, waterfalls, mountains, coffee, fruit markets, and small details in nature.' },
  ms: { kicker: 'Koleksi foto terkini', title: 'Dari tepian tasik ke atas awan.', intro: 'Potret Danau Toba, air terjun, fajar di pergunungan, dan warna kehidupan tempatan daripada koleksi perjalanan BROS Wisata.', all: 'Lihat semua 9 foto', cta: 'Rancang perjalanan anda', fullIntro: 'Sembilan sudut perjalanan: panorama tasik, air terjun, pergunungan, kopi, pasar buah, dan perincian alam sepanjang perjalanan.' },
};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
function card(photo, lang) {
  const [title, caption] = photo[lang];
  return `<figure class="photo-journal__card">
<picture><source type="image/webp" srcset="${base}${photo.slug}-600.webp 600w, ${base}${photo.slug}.webp 1200w" sizes="(max-width:650px) calc(100vw - 40px), (max-width:1280px) calc((100vw - 96px) / 3), 395px"/>
<img src="${base}${photo.slug}.jpg" width="1200" height="1600" alt="${escape(title + '. ' + caption)}" loading="lazy" decoding="async"/></picture>
<figcaption><strong>${escape(title)}</strong>${escape(caption)}</figcaption>
</figure>`;
}
function section(lang, full) {
  const t = locales[lang];
  const selected = full ? photos : [photos[0], photos[3], photos[5]];
  const link = full ? `/${lang}/bros-wisata-custom-tour` : `/${lang}/meet-ahmad#foto-terbaru`;
  const button = `<a class="photo-journal__link" href="${link}">${full ? t.cta : t.all}<span aria-hidden="true">&#8594;</span></a>`;
  return `<!-- PHOTO JOURNAL START -->
<section class="photo-journal" id="foto-terbaru" aria-labelledby="photo-journal-title">
<div class="photo-journal__inner">
<div class="photo-journal__head"><div>
<p class="photo-journal__kicker">${t.kicker}</p>
<h2 id="photo-journal-title">${t.title}</h2>
<p class="photo-journal__intro">${full ? t.fullIntro : t.intro}</p>
</div>${full ? '' : button}</div>
<div class="photo-journal__grid">
${selected.map(photo => card(photo, lang)).join('\n')}
</div>
${full ? `<div class="photo-journal__footer">${button}</div>` : ''}
</div></section>
<!-- PHOTO JOURNAL END -->`;
}
function sync() {
  const changed = [];
  for (const lang of Object.keys(locales)) {
    for (const name of ['index.html', 'bros-wisata-homepage.html', 'meet-ahmad.html']) {
      const relative = `${lang}/${name}`;
      const filename = path.join(root, relative);
      const original = fs.readFileSync(filename, 'utf8');
      const nl = original.includes('\r\n') ? '\r\n' : '\n';
      const full = name === 'meet-ahmad.html';
      let content = original;
      const css = '<link href="/assets/photo-journal.css?v=20260909" rel="stylesheet"/>';
      if (!content.includes(css)) content = content.replace('</head>', `${css}${nl}</head>`);
      const markup = section(lang, full).replace(/\n/g, nl);
      if (content.includes('<!-- PHOTO JOURNAL START -->')) {
        content = content.replace(/<!-- PHOTO JOURNAL START -->[\s\S]*?<!-- PHOTO JOURNAL END -->/, markup);
      } else {
        const anchor = full ? /<section class="trust-band"><div class="trust-shell"><div class="trust-section-head"><h2>(?:Catatan lapangan|Field notes)/ : /<!-- ======= [^\r\n]+ ======= -->\r?\n(?=<section class="home-faq")/;
        if (!anchor.test(content)) throw new Error(`Missing insertion point: ${relative}`);
        content = content.replace(anchor, match => `${markup}${nl}${match}`);
      }
      if (content !== original) {
        changed.push(relative);
        if (!checkOnly) fs.writeFileSync(filename, content, 'utf8');
      }
    }
  }
  if (checkOnly && changed.length) throw new Error(`Photo journal out of sync: ${changed.join(', ')}`);
  console.log(checkOnly ? 'Photo journal synchronized across 9 localized pages.' : `Photo journal updated in ${changed.length} pages.`);
}
if (require.main === module) sync();
module.exports = { photos };
