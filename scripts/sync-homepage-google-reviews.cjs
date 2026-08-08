const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const profileUrl = "https://share.google/Uv9LJLkbDjYHhMzTj";
const reviewUrl = "https://g.page/r/CX9qI0qT4zLYEAE/review";

const reviews = [
  {
    initials: "QL",
    name: "Quanji L",
    quote: "Thanks Ahmed for your smooth transport to and fro Lake Loba!",
  },
  {
    initials: "HG",
    name: "Hazz Gaming",
    quote: "Highly recommend, very responsible and friendly guide",
  },
  {
    initials: "SR",
    name: "Sri Rahayu",
    quote:
      "Sangat merekomendasikan Bros Wisata untuk urusan perjalanan bisnis atau corporate tour.",
  },
];

const locales = {
  id: {
    files: ["id/index.html", "id/bros-wisata-homepage.html"],
    eyebrow: "Ulasan Google Tamu",
    title: "Ulasan asli dari tamu BROS.",
    intro:
      "Pengalaman yang dibagikan langsung melalui profil Google Business BROS Wisata.",
    basedOn: "Berdasarkan 5 ulasan Google",
    updated: "Rating diperbarui 8 Agustus 2026",
    original: "Ditampilkan dalam bahasa asli reviewer.",
    source: "Lihat di Google",
    allReviews: "Lihat semua ulasan",
    writeReview: "Tulis ulasan Google",
    ratingLabel: "Rating Google 4,4 dari 5 berdasarkan 5 ulasan",
  },
  en: {
    files: ["en/index.html", "en/bros-wisata-homepage.html"],
    eyebrow: "Guest Google Reviews",
    title: "Real reviews from BROS guests.",
    intro:
      "Experiences shared directly through the BROS Wisata Google Business profile.",
    basedOn: "Based on 5 Google reviews",
    updated: "Rating updated 8 August 2026",
    original: "Shown in each reviewer's original language.",
    source: "View on Google",
    allReviews: "See all reviews",
    writeReview: "Write a Google review",
    ratingLabel: "Google rating 4.4 out of 5 based on 5 reviews",
  },
  ms: {
    files: ["ms/index.html", "ms/bros-wisata-homepage.html"],
    eyebrow: "Ulasan Google Tetamu",
    title: "Ulasan sebenar daripada tetamu BROS.",
    intro:
      "Pengalaman yang dikongsi terus melalui profil Google Business BROS Wisata.",
    basedOn: "Berdasarkan 5 ulasan Google",
    updated: "Rating dikemas kini 8 Ogos 2026",
    original: "Dipaparkan dalam bahasa asal pengulas.",
    source: "Lihat di Google",
    allReviews: "Lihat semua ulasan",
    writeReview: "Tulis ulasan Google",
    ratingLabel: "Rating Google 4.4 daripada 5 berdasarkan 5 ulasan",
  },
};

function reviewCards(labels) {
  const accents = ["border-bros-gold", "border-bros-blue", "border-bros-navy"];
  const avatarColors = [
    "bg-bros-blue text-white",
    "bg-bros-gold text-bros-navy",
    "bg-bros-navy text-white",
  ];

  return reviews
    .map(
      (review, index) => `<article class="bg-white p-7 sm:p-8 border-t-4 ${accents[index]} shadow-sm flex flex-col h-full">
<div class="flex items-center justify-between gap-4 mb-5">
<div class="flex items-center gap-3 min-w-0">
<div class="w-11 h-11 ${avatarColors[index]} rounded-full flex items-center justify-center font-bold text-sm shrink-0" aria-hidden="true">${review.initials}</div>
<div class="min-w-0">
<h3 class="font-semibold text-bros-navy truncate">${review.name}</h3>
<div class="text-bros-gold tracking-[0.12em] text-sm" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
</div>
</div>
<span class="text-[10px] uppercase tracking-[0.16em] text-bros-blue font-bold">Google</span>
</div>
<blockquote class="text-bros-charcoal leading-relaxed flex-1">&ldquo;${review.quote}&rdquo;</blockquote>
<a class="mt-6 text-xs font-bold text-bros-blue hover:text-bros-navy transition inline-flex items-center gap-1" href="${profileUrl}" rel="noopener noreferrer" target="_blank">${labels.source} <span aria-hidden="true">&#8599;</span></a>
</article>`,
    )
    .join("\n");
}

function reviewsSection(labels) {
  return `<!-- ======= GOOGLE REVIEWS ======= -->
<section class="py-24 lg:py-28 bg-bros-cream" id="google-reviews">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12">
<div class="lg:col-span-8">
<div class="text-bros-blue text-xs tracking-[0.3em] uppercase font-bold mb-5">&#10022; ${labels.eyebrow}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-bros-navy leading-[0.95] mb-5">${labels.title}</h2>
<p class="text-bros-charcoal/70 max-w-2xl leading-relaxed">${labels.intro}</p>
</div>
<div class="lg:col-span-4 bg-white border border-bros-charcoal/10 p-6 shadow-sm" aria-label="${labels.ratingLabel}">
<div class="flex items-end justify-between gap-4">
<div>
<div class="text-xs uppercase tracking-[0.18em] text-bros-charcoal/60 font-bold mb-2">Google Reviews</div>
<div class="font-display text-5xl font-bold text-bros-navy leading-none">4.4<span class="text-lg text-bros-charcoal/50">/5</span></div>
</div>
<div class="text-bros-gold text-xl tracking-[0.1em]" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
</div>
<p class="text-xs text-bros-charcoal/65 mt-4">${labels.basedOn}<br/>${labels.updated}</p>
</div>
</div>
<div class="grid md:grid-cols-3 gap-6">
${reviewCards(labels)}
</div>
<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
<a class="w-full sm:w-auto inline-flex items-center justify-center bg-bros-blue text-white px-6 py-3.5 font-bold hover:bg-bros-navy transition" href="${profileUrl}" rel="noopener noreferrer" target="_blank">${labels.allReviews} <span class="ml-2" aria-hidden="true">&#8599;</span></a>
<a class="w-full sm:w-auto inline-flex items-center justify-center border border-bros-blue text-bros-blue px-6 py-3.5 font-bold hover:bg-bros-blue hover:text-white transition" href="${reviewUrl}" rel="noopener noreferrer" target="_blank">${labels.writeReview}</a>
</div>
<p class="text-center text-xs text-bros-charcoal/55 mt-5">${labels.original}</p>
</div>
</section>`;
}

function synchronizeHomepage(original, labels, relativePath) {
  const pattern = /<!-- ======= (?:TESTIMONIALS|GOOGLE REVIEWS) ======= -->\s*<section\b[\s\S]*?<\/section>\s*(?=<!-- ======= REAL CUSTOMER GALLERY ======= -->)/;
  const matches = original.match(pattern);
  if (!matches) {
    throw new Error(`${relativePath}: testimonial section was not found`);
  }
  const newline = matches[0].includes("\r\n") ? "\r\n" : "\n";
  const replacement = `${reviewsSection(labels).replace(/\n/g, newline)}${newline}`;
  return original.replace(pattern, replacement);
}

const updates = [];
for (const labels of Object.values(locales)) {
  for (const relativePath of labels.files) {
    const absolutePath = path.join(root, relativePath);
    const original = fs.readFileSync(absolutePath, "utf8");
    const updated = synchronizeHomepage(original, labels, relativePath);
    if (updated !== original) {
      updates.push({ absolutePath, relativePath, content: updated });
    }
  }
}

if (checkOnly) {
  if (updates.length > 0) {
    throw new Error(
      `Homepage Google reviews are not synchronized in: ${updates.map((item) => item.relativePath).join(", ")}`,
    );
  }
  console.log("Homepage Google reviews are synchronized across ID, EN, and MS.");
  process.exit(0);
}

for (const update of updates) {
  fs.writeFileSync(update.absolutePath, update.content, "utf8");
}

console.log(
  updates.length === 0
    ? "Homepage Google reviews already synchronized."
    : `Updated homepage Google reviews in ${updates.length} files.`,
);
