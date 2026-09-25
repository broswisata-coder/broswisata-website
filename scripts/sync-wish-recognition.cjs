const fs = require('node:fs');
const path = require('node:path');

// Selection and category are grounded in the organizer's Top 25 announcement
// supplied by BROS. Do not imply an award, certification, or finalized product.
const root = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const start = '<!-- ======= WISH 2026 RECOGNITION ======= -->';
const end = '<!-- ======= END WISH 2026 RECOGNITION ======= -->';
const stylesheet = '<link href="/assets/wish-recognition.css" rel="stylesheet"/>';
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
  },
};

function escape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function section(locale, detailed) {
  const text = labels[locale];
  const body = detailed
    ? `<p class="wish-recognition__copy">${escape(text.detail)}</p>
<dl class="wish-recognition__pillars">
${text.pillars.map(([title, copy]) => `<div><dt>${escape(title)}</dt><dd>${escape(copy)}</dd></div>`).join('\n')}
</dl>
<p class="wish-recognition__note">${escape(text.note)}</p>`
    : `<a class="wish-recognition__link" href="/${locale}/bros-wisata-about#wish-2026">${escape(text.link)} <span aria-hidden="true">&nbsp;→</span></a>`;
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
</section>
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
    if (!updated.includes(stylesheet)) updated = updated.replace('</head>', stylesheet + newline + '</head>');
    if (updated !== original) updates.push({file, relative, updated});
  }
}

if (checkOnly && updates.length) throw new Error(`WISH content differs: ${updates.map(x => x.relative).join(', ')}`);
if (!checkOnly) for (const update of updates) fs.writeFileSync(update.file, update.updated, 'utf8');
console.log(checkOnly ? 'WISH recognition is synchronized across ID, MS, and EN.' : `Updated WISH recognition in ${updates.length} pages.`);
