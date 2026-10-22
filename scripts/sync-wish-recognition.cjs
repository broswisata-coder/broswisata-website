const fs = require('node:fs');
const path = require('node:path');

// Selection and category are grounded in the organizer's Top 25 announcement
// supplied by BROS. Do not imply an award, certification, or finalized product.
const root = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const start = '<!-- ======= WISH 2026 RECOGNITION ======= -->';
const end = '<!-- ======= END WISH 2026 RECOGNITION ======= -->';
const stylesheet = '<link href="/assets/wish-recognition.css?v=20261022-pitching" rel="stylesheet"/>';
// BROS confirmed public use of the supplied catalog on 18 Oct 2026.
// Link to the organizer's shared copy, without claiming this Pre Final is final.
const catalogUrl = 'https://drive.google.com/file/d/1duBC6OKA1vzYe9fNBNjHhfwBsOFC5Vsm/view';
const catalogPreview = '/assets/events/wish-2026/catalog-bros-preview-20261018.webp';
// Supplied event photographs retain their original framing. A booth visit is
// documentation, not an endorsement or a claim of a formal partnership.
const photos = [
  {key: 'pitching', base: 'wish-2026-indra-pitching', width: 1280, height: 852, smallWidth: 640},
  {key: 'concept', base: 'wish-2026-indra-7d6n', width: 1280, height: 852, smallWidth: 640},
  {key: 'discussion', base: 'wish-2026-indra-discussion', width: 1280, height: 852, smallWidth: 640},
  {key: 'group', base: 'wish-2026-group', width: 1600, height: 1200, smallWidth: 800},
  {key: 'team', base: 'wish-2026-bros-team', width: 1280, height: 576, smallWidth: 640},
  {key: 'booth', base: 'witf-2026-booth-visit', width: 1280, height: 576, smallWidth: 640},
];
const route = 'Medan/Kualanamu – Bukit Lawang – Berastagi – Samosir/Danau Toba – Medan';
const labels = {
  id: {
    eyebrow: 'Pengembangan wisata tematik · Gastronomi',
    title: 'Bros Wisata terpilih sebagai Top 25 WISH 2026',
    shortTitle: 'Bros Wisata, Top 25 WISH 2026',
    shortIntro: 'Mewakili Bros Wisata, Pak Indra mempresentasikan konsep perjalanan gastronomi Sumatra Utara 7 hari 6 malam di Demoday WISH 2026. Konsep yang sedang dikembangkan ini menghubungkan asal pangan, pengetahuan lokal, dan cerita masyarakat. Lihat dokumentasi dan gagasannya dalam katalog WISH 2026.',
    intro: 'Bros Wisata terpilih sebagai salah satu dari 25 peserta Demoday WISH 2026 dalam kategori Gastronomi. Mewakili Bros Wisata, Pak Indra mempresentasikan konsep perjalanan gastronomi Sumatra Utara 7 hari 6 malam yang menghubungkan asal pangan, pengetahuan lokal, dan kehidupan masyarakat pembuatnya.',
    link: 'Tentang perjalanan kami di WISH',
    detail: 'Proses mentoring dan penyusunan storyline membantu kami mempertajam rancangan perjalanan 7 hari 6 malam di rute ' + route + '. Fokusnya bukan hanya mencicipi makanan, tetapi memahami hubungan antara sajian, tempat, dan orang-orang di baliknya.',
    pillars: [
      ['Asal pangan', 'Mengenal bahan setempat dan hubungannya dengan lingkungan tempat pangan tumbuh.'],
      ['Pengetahuan yang diwariskan', 'Menelusuri cerita, cara mengolah, dan pengetahuan kuliner yang diteruskan antargenerasi.'],
      ['Kehidupan masyarakat', 'Menghadirkan cerita masyarakat pembuat pangan sebagai bagian dari pengalaman perjalanan.'],
    ],
    note: 'Pengalaman gastronomi ini sedang dikembangkan. Detail hidangan, mitra, dan kegiatan akan dikonfirmasi sebelum ditawarkan sebagai bagian dari paket perjalanan.',
    gallery: {
      short: 'Pak Indra mempresentasikan konsep perjalanan Bros di Demoday WISH 2026.',
      title: 'Momen Bros di WISH & WITF 2026',
      intro: 'Presentasi konsep perjalanan oleh Pak Indra, momen berbicara dalam forum, kebersamaan di panggung WISH, dan kunjungan perwakilan Bros Wisata di area pameran WITF 2026.',
      link: 'Lihat dokumentasi Bros di WISH & WITF 2026',
      open: 'Lihat foto ukuran penuh (tab baru)',
      photos: {
        pitching: {caption: 'Pak Indra mempresentasikan konsep perjalanan Bros Wisata di Demoday WISH 2026.', alt: 'Pak Indra berdiri di panggung saat presentasi, dengan huruf WISH menyala di bagian depan panggung.'},
        concept: {caption: 'Konsep gastronomi 7 hari 6 malam: Medan/Kualanamu – Bukit Lawang – Berastagi – Samosir/Danau Toba – Medan.', alt: 'Pak Indra mempresentasikan slide konsep perjalanan gastronomi Sumatra Utara 7 hari 6 malam di panggung WISH 2026.'},
        discussion: {caption: 'Pak Indra berbicara dalam forum WISH 2026.', alt: 'Pak Indra memegang mikrofon sambil berdiri di antara peserta forum WISH 2026.'},
        group: {caption: 'Kebersamaan di panggung WISH 2026.', alt: 'Foto bersama di atas panggung dengan latar WISH 2026.'},
        team: {caption: 'Tim Bros Wisata di area panggung WISH.', alt: 'Tim Bros Wisata berfoto di area panggung dengan latar WISH 2026.'},
        booth: {caption: 'Kunjungan perwakilan Bros Wisata ke booth Sobek Bali.', alt: 'Dua perwakilan Bros Wisata berfoto di booth Sobek Bali dalam pameran WITF 2026.'},
      },
    },
    catalog: {
      eyebrow: 'Kenali gagasan perjalanan kami',
      title: 'Bros Wisata dalam katalog WISH 2026',
      copy: 'Profil Bros memperkenalkan perjalanan gastronomi 7 hari 6 malam di Sumatra Utara: dari asal bahan pangan hingga kisah masyarakat di balik hidangan. Baca profil kami bersama peserta WISH lainnya dalam katalog.',
      meta: 'Katalog berbahasa Indonesia · Profil Bros: halaman PDF 52–53 (halaman cetak 50–51).',
      link: 'Lihat katalog WISH 2026',
      open: 'Lihat katalog WISH 2026, PDF berbahasa Indonesia (tab baru)',
      alt: 'Cuplikan halaman profil Bros Wisata dalam katalog WISH 2026, menampilkan buah tropis, sajian lokal, rumah tradisional, dan air terjun.',
      source: 'Cuplikan profil Bros · Sumber: Katalog WISH 2026.',
      followup: 'Untuk diskusi lanjutan setelah WITF 2026 atau peluang kerja sama perjalanan Sumatra Utara, hubungi tim Bros.',
      chat: 'Diskusikan kerja sama',
      message: 'Halo BROS Wisata, saya melihat profil Bros dalam katalog WISH 2026 dan ingin berdiskusi tentang kerja sama perjalanan Sumatra Utara. Nama/perusahaan: __. Rencana kerja sama: __.',
    },
  },
  ms: {
    eyebrow: 'Pembangunan pelancongan bertema · Gastronomi',
    title: 'Bros Wisata terpilih dalam Top 25 WISH 2026',
    shortTitle: 'Bros Wisata dalam Top 25 WISH 2026',
    shortIntro: 'Mewakili Bros Wisata, Pak Indra membentangkan konsep perjalanan gastronomi Sumatera Utara 7 hari 6 malam di Demoday WISH 2026. Konsep yang sedang dibangunkan ini menghubungkan asal-usul makanan, pengetahuan tempatan dan kisah masyarakat. Lihat dokumentasi serta konsepnya dalam katalog WISH 2026.',
    intro: 'Bros Wisata terpilih sebagai salah satu daripada 25 peserta Demoday WISH 2026 dalam kategori Gastronomi. Mewakili Bros Wisata, Pak Indra membentangkan konsep perjalanan gastronomi Sumatera Utara 7 hari 6 malam yang menghubungkan asal-usul makanan, pengetahuan tempatan dan kehidupan masyarakat yang menghasilkannya.',
    link: 'Perjalanan kami dalam WISH',
    detail: 'Proses bimbingan dan penyediaan jalan cerita membantu kami memperhalus rancangan perjalanan 7 hari 6 malam melalui laluan ' + route + '. Tumpuannya bukan sekadar mencuba makanan, tetapi memahami hubungan antara hidangan, tempat dan masyarakat di sebaliknya.',
    pillars: [
      ['Asal-usul makanan', 'Mengenali bahan tempatan serta hubungannya dengan persekitaran tempat bahan itu dihasilkan.'],
      ['Pengetahuan yang diwarisi', 'Meneroka cerita, cara penyediaan dan pengetahuan kulinari yang diwarisi turun-temurun.'],
      ['Kehidupan masyarakat', 'Menjadikan kisah masyarakat penghasil makanan sebahagian daripada pengalaman perjalanan.'],
    ],
    note: 'Pengalaman gastronomi ini sedang dibangunkan. Hidangan, rakan tempatan dan aktiviti akan disahkan sebelum ditawarkan sebagai sebahagian daripada pakej perjalanan.',
    gallery: {
      short: 'Pak Indra membentangkan konsep perjalanan Bros di Demoday WISH 2026.',
      title: 'Momen Bros di WISH & WITF 2026',
      intro: 'Pembentangan konsep perjalanan oleh Pak Indra, momen beliau bercakap dalam forum, kebersamaan di pentas WISH dan kunjungan wakil Bros Wisata di kawasan pameran WITF 2026.',
      link: 'Lihat dokumentasi Bros di WISH & WITF 2026',
      open: 'Lihat foto bersaiz penuh (tab baharu)',
      photos: {
        pitching: {caption: 'Pak Indra membentangkan konsep perjalanan Bros Wisata di Demoday WISH 2026.', alt: 'Pak Indra berdiri di pentas semasa pembentangan, dengan huruf WISH berlampu di bahagian hadapan pentas.'},
        concept: {caption: 'Konsep gastronomi 7 hari 6 malam: Medan/Kualanamu – Bukit Lawang – Berastagi – Samosir/Danau Toba – Medan.', alt: 'Pak Indra membentangkan slaid konsep perjalanan gastronomi Sumatera Utara 7 hari 6 malam di pentas WISH 2026.'},
        discussion: {caption: 'Pak Indra bercakap dalam forum WISH 2026.', alt: 'Pak Indra memegang mikrofon sambil berdiri di antara peserta forum WISH 2026.'},
        group: {caption: 'Kebersamaan di pentas WISH 2026.', alt: 'Foto berkumpulan di atas pentas berlatar WISH 2026.'},
        team: {caption: 'Pasukan Bros Wisata di kawasan pentas WISH.', alt: 'Ahli pasukan Bros Wisata bergambar di kawasan pentas berlatar WISH 2026.'},
        booth: {caption: 'Kunjungan wakil Bros Wisata ke reruai Sobek Bali.', alt: 'Dua wakil Bros Wisata bergambar di reruai Sobek Bali semasa pameran WITF 2026.'},
      },
    },
    catalog: {
      eyebrow: 'Kenali konsep perjalanan kami',
      title: 'Bros Wisata dalam katalog WISH 2026',
      copy: 'Profil Bros memperkenalkan perjalanan gastronomi 7 hari 6 malam di Sumatera Utara: daripada asal-usul bahan makanan hingga kisah masyarakat di sebalik hidangan. Baca profil kami bersama peserta WISH yang lain dalam katalog.',
      meta: 'Katalog dalam bahasa Indonesia · Profil Bros: halaman PDF 52–53 (halaman bercetak 50–51).',
      link: 'Lihat katalog WISH 2026',
      open: 'Lihat katalog WISH 2026, PDF dalam bahasa Indonesia (tab baharu)',
      alt: 'Pratonton halaman profil Bros Wisata dalam katalog WISH 2026, memaparkan buah-buahan tropika, hidangan tempatan, rumah tradisional dan air terjun.',
      source: 'Pratonton profil Bros · Sumber: Katalog WISH 2026.',
      followup: 'Untuk perbincangan susulan selepas WITF 2026 atau peluang kerjasama perjalanan Sumatera Utara, hubungi pasukan Bros.',
      chat: 'Bincangkan kerjasama',
      message: 'Hai BROS Wisata, saya melihat profil Bros dalam katalog WISH 2026 dan ingin berbincang tentang kerjasama perjalanan Sumatera Utara. Nama/syarikat: __. Cadangan kerjasama: __.',
    },
  },
  en: {
    eyebrow: 'Themed travel development · Gastronomy',
    title: 'Bros Wisata selected for the WISH 2026 Top 25',
    shortTitle: 'Bros Wisata in the WISH 2026 Top 25',
    shortIntro: 'Representing Bros Wisata, Pak Indra presented our 7-day, 6-night North Sumatra gastronomy travel concept at Demoday WISH 2026. Still under development, the concept connects food origins, local knowledge, and community stories. Explore the photos and our idea in the WISH 2026 catalog.',
    intro: 'Bros Wisata was selected as one of 25 Demoday WISH 2026 participants in the Gastronomy category. Representing Bros Wisata, Pak Indra presented our 7-day, 6-night North Sumatra gastronomy travel concept, connecting food origins, local knowledge, and the lives of the people who produce it.',
    link: 'Our journey with WISH',
    detail: 'Mentoring and storyline development have helped us shape a 7-day, 6-night journey through Medan/Kualanamu, Bukit Lawang, Berastagi, Samosir/Lake Toba, and back to Medan. The focus goes beyond tasting food to explore the connections between dishes, places, and people.',
    pillars: [
      ['Origins of food', 'Discovering local ingredients and their connection to the landscapes where they are grown.'],
      ['Knowledge passed down', 'Exploring stories, preparation methods, and culinary knowledge shared across generations.'],
      ['Community life', 'Making the stories of local food producers part of the travel experience.'],
    ],
    note: 'This gastronomy experience is under development. Dishes, local partners, and activities will be confirmed before being offered as part of a tour package.',
    gallery: {
      short: 'Pak Indra presenting the Bros travel concept at Demoday WISH 2026.',
      title: 'Bros moments at WISH & WITF 2026',
      intro: 'Pak Indra presenting the travel concept and speaking in the forum, shared moments on the WISH stage, and visits by Bros Wisata representatives around the WITF 2026 exhibition.',
      link: 'See Bros photos from WISH & WITF 2026',
      open: 'View full-size photo (new tab)',
      photos: {
        pitching: {caption: 'Pak Indra presenting the Bros Wisata travel concept at Demoday WISH 2026.', alt: 'Pak Indra standing on stage during his presentation, with illuminated WISH letters at the front of the stage.'},
        concept: {caption: 'The 7-day, 6-night gastronomy concept: Medan/Kualanamu – Bukit Lawang – Berastagi – Samosir/Lake Toba – Medan.', alt: 'Pak Indra presenting a slide about the 7-day, 6-night North Sumatra gastronomy travel concept on the WISH 2026 stage.'},
        discussion: {caption: 'Pak Indra speaking in the WISH 2026 forum.', alt: 'Pak Indra holding a microphone while standing among participants in the WISH 2026 forum.'},
        group: {caption: 'A group moment on the WISH 2026 stage.', alt: 'A group photograph on stage with a WISH 2026 backdrop.'},
        team: {caption: 'The Bros Wisata team at the WISH stage area.', alt: 'Bros Wisata team members photographed in the stage area with a WISH 2026 backdrop.'},
        booth: {caption: 'Bros Wisata representatives visiting the Sobek Bali booth.', alt: 'Two Bros Wisata representatives photographed at the Sobek Bali booth during WITF 2026.'},
      },
    },
    catalog: {
      eyebrow: 'Discover our travel concept',
      title: 'Bros Wisata in the WISH 2026 catalog',
      copy: 'Our profile introduces a 7-day, 6-night gastronomy journey through North Sumatra, from the origins of local ingredients to the communities behind each dish. Read about Bros and other WISH participants in the catalog.',
      meta: 'Indonesian-language catalog · Bros profile: PDF pages 52–53 (printed pages 50–51).',
      link: 'View WISH 2026 catalog',
      open: 'View WISH 2026 catalog, Indonesian-language PDF (new tab)',
      alt: 'Preview of the Bros Wisata profile in the WISH 2026 catalog, showing tropical fruit, a local dish, a traditional house, and a waterfall.',
      source: 'Bros profile preview · Source: WISH 2026 catalog.',
      followup: 'For follow-up conversations after WITF 2026 or North Sumatra travel partnerships, get in touch with the Bros team.',
      chat: 'Discuss a partnership',
      message: 'Hi BROS Wisata, I saw your profile in the WISH 2026 catalog and would like to discuss a North Sumatra travel partnership. Name/company: __. Partnership idea: __.',
    },
  },
};

function escape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function catalogLink(text, location) {
  const c = text.catalog;
  return `<a class="wish-recognition__link wish-recognition__link--primary" href="${catalogUrl}" data-cta="wish_catalog_${location}" target="_blank" rel="noopener noreferrer" aria-label="${escape(c.open)}">${escape(c.link)} <span aria-hidden="true">&nbsp;↗</span></a>`;
}

function photoImage(photo, alt, sizes) {
  const base = '/assets/events/wish-2026/' + photo.base;
  return `<img src="${base}-${photo.smallWidth}.webp" srcset="${base}-${photo.smallWidth}.webp ${photo.smallWidth}w, ${base}-${photo.width}.webp ${photo.width}w" sizes="${sizes}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escape(alt)}"/>`;
}

function homepagePhoto(locale, text) {
  const photo = photos.find(item => item.key === 'pitching');
  return `<figure class="wish-recognition__photo">
<a class="wish-photo-link" href="/${locale}/bros-wisata-about#dokumentasi-wish-2026" aria-label="${escape(text.gallery.link)}">${photoImage(photo, text.gallery.photos.pitching.alt, '(max-width: 700px) calc(100vw - 5rem), 500px')}</a>
<figcaption>${escape(text.gallery.short)}</figcaption>
</figure>`;
}

function galleryDetails(text) {
  const g = text.gallery;
  return `<section class="wish-gallery" id="dokumentasi-wish-2026" aria-labelledby="wish-gallery-title">
<h3 class="font-display" id="wish-gallery-title">${escape(g.title)}</h3>
<p class="wish-recognition__copy">${escape(g.intro)}</p>
<div class="wish-gallery__grid">
${photos.map(photo => {
  const label = g.photos[photo.key];
  const sizes = '(max-width: 700px) calc(100vw - 5rem), (max-width: 1280px) calc((100vw - 8.5rem) / 2), 556px';
  return `<figure>
<a class="wish-photo-link" href="/assets/events/wish-2026/${photo.base}-${photo.width}.webp" target="_blank" rel="noopener noreferrer" aria-label="${escape(label.caption + ' ' + g.open)}">${photoImage(photo, label.alt, sizes)}</a>
<figcaption>${escape(label.caption)}</figcaption>
</figure>`;
}).join('\n')}
</div>
</section>`;
}

function catalogDetails(text) {
  const c = text.catalog;
  const whatsapp = 'https://wa.me/6281260139399?text=' + encodeURIComponent(c.message);
  return `<div class="wish-catalog" id="katalog-wish-2026" aria-labelledby="wish-catalog-title">
<span class="wish-catalog__legacy-anchor" id="booth-wish-2026" aria-hidden="true"></span>
<div>
<p class="wish-recognition__eyebrow">${escape(c.eyebrow)}</p>
<h3 class="font-display" id="wish-catalog-title">${escape(c.title)}</h3>
<p class="wish-recognition__copy">${escape(c.copy)}</p>
<p class="wish-catalog__meta">${escape(c.meta)}</p>
${catalogLink(text, 'about')}
<p class="wish-recognition__note">${escape(c.followup)}</p>
<a class="wish-recognition__link" href="${escape(whatsapp)}" data-cta="wish_partnership" target="_blank" rel="noopener noreferrer">${escape(c.chat)} <span aria-hidden="true">&nbsp;→</span></a>
</div>
<figure>
<a class="wish-catalog__preview" href="${catalogUrl}" target="_blank" rel="noopener noreferrer" aria-label="${escape(c.open)}"><img src="${catalogPreview}" width="619" height="1100" loading="lazy" decoding="async" alt="${escape(c.alt)}"/></a>
<figcaption>${escape(c.source)}</figcaption>
</figure>
</div>`;
}

function section(locale, detailed) {
  const text = labels[locale];
  const body = detailed
    ? `<p class="wish-recognition__copy">${escape(text.detail)}</p>
<dl class="wish-recognition__pillars">
${text.pillars.map(([title, copy]) => `<div><dt>${escape(title)}</dt><dd>${escape(copy)}</dd></div>`).join('\n')}
</dl>
<p class="wish-recognition__note">${escape(text.note)}</p>`
    : `<div class="wish-recognition__links">${catalogLink(text, 'homepage')}
<a class="wish-recognition__link" href="/${locale}/bros-wisata-about#wish-2026">${escape(text.link)} <span aria-hidden="true">&nbsp;→</span></a></div>`;
  return `${start}
<section class="wish-recognition${detailed ? '' : ' wish-recognition--photo'}" id="wish-2026" aria-labelledby="wish-2026-title">
<div class="wish-recognition__shell">
${detailed ? '<div class="wish-recognition__mark" aria-hidden="true"><strong class="font-display">Top 25</strong><span>WISH 2026</span></div>' : homepagePhoto(locale, text)}
<div>
<p class="wish-recognition__eyebrow">${escape(text.eyebrow)}</p>
<h2 class="font-display" id="wish-2026-title">${escape(detailed ? text.title : text.shortTitle)}</h2>
<p class="wish-recognition__copy">${escape(detailed ? text.intro : text.shortIntro)}</p>
${body}
</div>
</div>
${detailed ? galleryDetails(text) + '\n' + catalogDetails(text) + '\n' : ''}</section>
${end}`;
}

const updates = [];
for (const locale of Object.keys(labels)) {
  for (const name of ['index.html', 'bros-wisata-homepage.html', 'bros-wisata-about.html']) {
    const relative = `${locale}/${name}`;
    const file = path.join(root, relative);
    const original = fs.readFileSync(file, 'utf8');
    const newline = original.includes('\r\n') ? '\r\n' : '\n';
    const detailed = name === 'bros-wisata-about.html';
    const block = section(locale, detailed).replace(/\n/g, newline);
    let updated = original;
    if (updated.includes(start)) {
      if (!updated.includes(end)) throw new Error(`Incomplete WISH block: ${relative}`);
      updated = updated.slice(0, updated.indexOf(start)) + block + updated.slice(updated.indexOf(end) + end.length);
    } else {
      const anchor = detailed
        ? '<section class="py-24 lg:py-32 bg-bros-cream">'
        : '<!-- ======= CAR RENTAL ======= -->';
      if (!updated.includes(anchor)) throw new Error(`Missing section anchor: ${relative}`);
      updated = updated.replace(anchor, block + newline + anchor);
    }
    const cssLink = /<link href="\/assets\/wish-recognition\.css(?:\?[^\"]*)?" rel="stylesheet"\/>/;
    if (cssLink.test(updated)) updated = updated.replace(cssLink, stylesheet);
    else updated = updated.replace('</head>', stylesheet + newline + '</head>');
    if (updated !== original) updates.push({file, relative, updated});
  }
}

if (checkOnly && updates.length) throw new Error(`WISH content differs: ${updates.map(x => x.relative).join(', ')}`);
if (!checkOnly) for (const update of updates) fs.writeFileSync(update.file, update.updated, 'utf8');
console.log(checkOnly ? 'WISH recognition is synchronized across ID, MS, and EN.' : `Updated WISH recognition in ${updates.length} pages.`);
