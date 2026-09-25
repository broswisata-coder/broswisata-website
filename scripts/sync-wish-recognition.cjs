const fs = require('node:fs');
const path = require('node:path');

// Selection and category are grounded in the organizer's Top 25 announcement
// supplied by BROS. Do not imply an award, certification, or finalized product.
const root = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const start = '<!-- ======= WISH 2026 RECOGNITION ======= -->';
const end = '<!-- ======= END WISH 2026 RECOGNITION ======= -->';
const stylesheet = '<link href="/assets/wish-recognition.css?v=20260925-booth" rel="stylesheet"/>';
// Source: organizer's Information WISH 2026-1.pdf, page 4, layout 22 Sep 2026.
// Publish only the floor-plan page, not the complete participant information PDF.
const floorPlan = '/assets/events/wish-2026/witf-layout-booth-71-20260922.jpg';
const route = 'Medan/Kualanamu – Bukit Lawang – Berastagi – Samosir/Danau Toba – Medan';
const labels = {
  id: {
    eyebrow: 'Pengembangan wisata tematik · Gastronomi',
    title: 'Bros Wisata terpilih sebagai Top 25 WISH 2026',
    intro: 'Bros Wisata terpilih sebagai salah satu dari 25 peserta Demoday WISH 2026 dalam kategori Gastronomi. Melalui program ini, kami mengembangkan perjalanan Sumatra Utara yang menghubungkan asal pangan, pengetahuan lokal, dan kehidupan masyarakat pembuatnya.',
    link: 'Tentang perjalanan kami di WISH',
    detail: 'Proses mentoring dan penyusunan storyline membantu kami mempertajam rancangan perjalanan 7 hari 6 malam di rute ' + route + '. Fokusnya bukan hanya mencicipi makanan, tetapi memahami hubungan antara sajian, tempat, dan orang-orang di baliknya.',
    pillars: [
      ['Asal pangan', 'Mengenal bahan setempat dan hubungannya dengan lingkungan tempat pangan tumbuh.'],
      ['Pengetahuan yang diwariskan', 'Menelusuri cerita, cara mengolah, dan pengetahuan kuliner yang diteruskan antargenerasi.'],
      ['Kehidupan masyarakat', 'Menghadirkan cerita masyarakat pembuat pangan sebagai bagian dari pengalaman perjalanan.'],
    ],
    note: 'Pengalaman gastronomi ini sedang dikembangkan. Detail hidangan, mitra, dan kegiatan akan dikonfirmasi sebelum ditawarkan sebagai bagian dari paket perjalanan.',
    booth: {
      short: 'WITF 2026 · Booth bersama WISH No. 71',
      title: 'Temui Bros di booth bersama WISH No. 71',
      dates: '15–17 Oktober 2026',
      venue: 'Grand Ballroom, JIExpo Jakarta',
      copy: 'Bros Wisata bergabung di booth WISH yang digunakan bersama oleh 25 peserta. Pada denah panitia, booth No. 71 berada di antara booth 70 dan 72, di sebelah kanan area Main Stage.',
      link: 'Lokasi dan denah booth',
      full: 'Lihat denah ukuran penuh (tab baru)',
      alt: 'Denah WITF dari panitia, versi 22 September 2026, menunjukkan booth bersama WISH No. 71 di sebelah kanan Main Stage.',
      source: 'Sumber: Panitia WISH 2026, halaman 4 dokumen informasi peserta.',
      version: 'Denah versi 22 September 2026. Lokasi mengikuti pembaruan panitia jika ada perubahan.',
      chat: 'Jadwalkan pertemuan via WhatsApp',
      message: 'Halo BROS Wisata, saya ingin menjadwalkan pertemuan di booth bersama WISH No. 71 saat WITF 2026 (15–17 Oktober). Nama/perusahaan: __. Tanggal dan waktu pilihan: __.',
    },
  },
  ms: {
    eyebrow: 'Pembangunan pelancongan bertema · Gastronomi',
    title: 'Bros Wisata terpilih dalam Top 25 WISH 2026',
    intro: 'Bros Wisata terpilih sebagai salah satu daripada 25 peserta Demoday WISH 2026 dalam kategori Gastronomi. Melalui program ini, kami membangunkan pengalaman perjalanan di Sumatera Utara yang menghubungkan asal-usul makanan, pengetahuan tempatan dan kehidupan masyarakat yang menghasilkannya.',
    link: 'Perjalanan kami dalam WISH',
    detail: 'Proses bimbingan dan penyediaan jalan cerita membantu kami memperhalus rancangan perjalanan 7 hari 6 malam melalui laluan ' + route + '. Tumpuannya bukan sekadar mencuba makanan, tetapi memahami hubungan antara hidangan, tempat dan masyarakat di sebaliknya.',
    pillars: [
      ['Asal-usul makanan', 'Mengenali bahan tempatan serta hubungannya dengan persekitaran tempat bahan itu dihasilkan.'],
      ['Pengetahuan yang diwarisi', 'Meneroka cerita, cara penyediaan dan pengetahuan kulinari yang diwarisi turun-temurun.'],
      ['Kehidupan masyarakat', 'Menjadikan kisah masyarakat penghasil makanan sebahagian daripada pengalaman perjalanan.'],
    ],
    note: 'Pengalaman gastronomi ini sedang dibangunkan. Hidangan, rakan tempatan dan aktiviti akan disahkan sebelum ditawarkan sebagai sebahagian daripada pakej perjalanan.',
    booth: {
      short: 'WITF 2026 · Reruai bersama WISH No. 71',
      title: 'Temui Bros di reruai bersama WISH No. 71',
      dates: '15–17 Oktober 2026',
      venue: 'Grand Ballroom, JIExpo Jakarta',
      copy: 'Bros Wisata menyertai reruai WISH yang dikongsi oleh 25 peserta. Dalam pelan penganjur, reruai No. 71 terletak di antara reruai 70 dan 72, di sebelah kanan kawasan Main Stage.',
      link: 'Lokasi dan pelan reruai',
      full: 'Lihat pelan bersaiz penuh (tab baharu)',
      alt: 'Pelan WITF daripada penganjur, versi 22 September 2026, menunjukkan reruai bersama WISH No. 71 di sebelah kanan Main Stage.',
      source: 'Sumber: Penganjur WISH 2026, halaman 4 dokumen maklumat peserta.',
      version: 'Pelan versi 22 September 2026. Lokasi reruai tertakluk pada perubahan mengikut kemas kini penganjur.',
      chat: 'Atur pertemuan melalui WhatsApp',
      message: 'Hai BROS Wisata, saya ingin mengatur pertemuan di reruai bersama WISH No. 71 semasa WITF 2026 (15–17 Oktober). Nama/syarikat: __. Tarikh dan masa pilihan: __.',
    },
  },
  en: {
    eyebrow: 'Themed travel development · Gastronomy',
    title: 'Bros Wisata selected for the WISH 2026 Top 25',
    intro: 'Bros Wisata has been selected as one of 25 Demoday WISH 2026 participants in the Gastronomy category. Through the program, we are developing a North Sumatra journey that connects the origins of food, local knowledge, and the lives of the people who produce it.',
    link: 'Our journey with WISH',
    detail: 'Mentoring and storyline development are helping us shape a 7-day, 6-night journey through Medan/Kualanamu, Bukit Lawang, Berastagi, Samosir/Lake Toba, and back to Medan. The focus goes beyond tasting food to explore the connections between dishes, places, and people.',
    pillars: [
      ['Origins of food', 'Discovering local ingredients and their connection to the landscapes where they are grown.'],
      ['Knowledge passed down', 'Exploring stories, preparation methods, and culinary knowledge shared across generations.'],
      ['Community life', 'Making the stories of local food producers part of the travel experience.'],
    ],
    note: 'This gastronomy experience is under development. Dishes, local partners, and activities will be confirmed before being offered as part of a tour package.',
    booth: {
      short: 'WITF 2026 · Shared WISH booth No. 71',
      title: 'Meet Bros at the shared WISH booth, No. 71',
      dates: '15–17 October 2026',
      venue: 'Grand Ballroom, JIExpo Jakarta',
      copy: 'Bros Wisata joins the WISH booth shared by 25 participants. On the organizer’s floor plan, booth No. 71 is between booths 70 and 72, to the right of the Main Stage area.',
      link: 'Booth location and floor plan',
      full: 'View full-size floor plan (new tab)',
      alt: 'Organizer’s WITF floor plan dated 22 September 2026, showing the shared WISH booth No. 71 to the right of the Main Stage.',
      source: 'Source: WISH 2026 organizer, page 4 of the participant information document.',
      version: 'Floor plan dated 22 September 2026. Booth location is subject to change based on organizer updates.',
      chat: 'Arrange a meeting via WhatsApp',
      message: 'Hi BROS Wisata, I would like to arrange a meeting at the shared WISH booth No. 71 during WITF 2026 (15–17 October). Name/company: __. Preferred date and time: __.',
    },
  },
};

function escape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function boothDetails(text) {
  const b = text.booth;
  const whatsapp = 'https://wa.me/6281260139399?text=' + encodeURIComponent(b.message);
  return `<div class="wish-booth" id="booth-wish-2026" aria-labelledby="wish-booth-title">
<div>
<p class="wish-recognition__eyebrow">WITF 2026 · ${escape(b.dates)}</p>
<h3 id="wish-booth-title">${escape(b.title)}</h3>
<p class="wish-booth__venue">${escape(b.venue)}</p>
<p class="wish-recognition__copy">${escape(b.copy)}</p>
<p class="wish-recognition__note">${escape(b.version)}</p>
<a class="wish-recognition__link" href="${escape(whatsapp)}" data-cta="wish_booth_meeting" target="_blank" rel="noopener noreferrer">${escape(b.chat)}</a>
</div>
<figure>
<a class="wish-booth__map-link" href="${floorPlan}" target="_blank" rel="noopener noreferrer" aria-label="${escape(b.full)}"><img src="${floorPlan}" width="2400" height="1350" loading="lazy" decoding="async" alt="${escape(b.alt)}"/></a>
<figcaption>${escape(b.source)}</figcaption>
<a class="wish-recognition__link" href="${floorPlan}" target="_blank" rel="noopener noreferrer">${escape(b.full)}</a>
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
    : `<p class="wish-recognition__visit"><strong>${escape(text.booth.short)}</strong><br/>${escape(text.booth.dates)} · ${escape(text.booth.venue)}</p>
<div class="wish-recognition__links"><a class="wish-recognition__link" href="/${locale}/bros-wisata-about#wish-2026">${escape(text.link)} <span aria-hidden="true">&nbsp;→</span></a>
<a class="wish-recognition__link" href="/${locale}/bros-wisata-about#booth-wish-2026">${escape(text.booth.link)} <span aria-hidden="true">&nbsp;→</span></a></div>`;
  return `${start}
<section class="wish-recognition" id="wish-2026" aria-labelledby="wish-2026-title">
<div class="wish-recognition__shell">
<div class="wish-recognition__mark" aria-hidden="true"><strong class="font-display">Top 25</strong><span>WISH 2026</span></div>
<div>
<p class="wish-recognition__eyebrow">${escape(text.eyebrow)}</p>
<h2 class="font-display" id="wish-2026-title">${escape(text.title)}</h2>
<p class="wish-recognition__copy">${escape(text.intro)}</p>
${body}
</div>
</div>
${detailed ? boothDetails(text) + '\n' : ''}</section>
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
