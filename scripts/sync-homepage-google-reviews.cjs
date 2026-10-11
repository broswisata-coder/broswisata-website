const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const profileUrl = "https://share.google/Uv9LJLkbDjYHhMzTj";
const reviewUrl = "https://g.page/r/CX9qI0qT4zLYEAE/review";
// Verified against the public Google Maps profile on 11 October 2026.
// This is a dated snapshot, not a live Google rating widget.
const googleRating = { value: 4.7, count: 10 };
const reviewsPageUrl =
  "https://www.google.com/maps/place/Bros+Wisata/@3.5861596,98.6271794,17z/data=!4m8!3m7!1s0x30312fecda7f828b:0xd832e3934a236a7f!8m2!3d3.5861596!4d98.6271794!9m1!1b1!16s%2Fg%2F11m5qcc1q1";

const reviews = [
  {
    initials: "SL",
    name: "Steven Lie",
    quote:
      "Bukit Lawang holds a special place in my heart. My brother Ahmad is a wonderful, experienced, and friendly guide.",
    excerpt: true,
    url: reviewsPageUrl,
  },
  {
    initials: "LO",
    name: "Ling Oh",
    quote:
      "I had a wonderful experience with this tour agency and especially with Ahmad, who was incredibly attentive and accommodating throughout my 6-day trip.",
    excerpt: true,
    url: reviewsPageUrl,
  },
  {
    initials: "BT",
    name: "Bob Tian",
    quote: "very good service and reasonableb price",
  },
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
];

const locales = {
  id: {
    files: ["id/index.html", "id/bros-wisata-homepage.html"],
    eyebrow: "Ulasan Google Tamu",
    title: "Ulasan asli dari tamu BROS.",
    intro:
      "Pengalaman yang dibagikan langsung melalui profil Google Business BROS Wisata.",
    basedOn: `Berdasarkan ${googleRating.count} ulasan Google`,
    updated: "Rating diverifikasi 11 Oktober 2026",
    original: "Kutipan ulasan ditampilkan dalam bahasa asli reviewer.",
    excerpt: "Kutipan ulasan",
    aboutRating: "Rating Google",
    ratingValue: "4,7",
    source: "Lihat di Google",
    allReviews: "Lihat semua ulasan",
    writeReview: "Tulis ulasan Google",
    ratingLabel: `Rating Google 4,7 dari 5 berdasarkan ${googleRating.count} ulasan`,
  },
  en: {
    files: ["en/index.html", "en/bros-wisata-homepage.html"],
    eyebrow: "Guest Google Reviews",
    title: "Real reviews from BROS guests.",
    intro:
      "Experiences shared directly through the BROS Wisata Google Business profile.",
    basedOn: `Based on ${googleRating.count} Google reviews`,
    updated: "Rating verified 11 October 2026",
    original: "Review excerpts shown in each reviewer's original language.",
    excerpt: "Review excerpt",
    aboutRating: "Google rating",
    ratingValue: "4.7",
    source: "View on Google",
    allReviews: "See all reviews",
    writeReview: "Write a Google review",
    ratingLabel: `Google rating 4.7 out of 5 based on ${googleRating.count} reviews`,
  },
  ms: {
    files: ["ms/index.html", "ms/bros-wisata-homepage.html"],
    eyebrow: "Ulasan Google Tetamu",
    title: "Ulasan sebenar daripada tetamu BROS.",
    intro:
      "Pengalaman yang dikongsi terus melalui profil Google Business BROS Wisata.",
    basedOn: `Berdasarkan ${googleRating.count} ulasan Google`,
    updated: "Rating disahkan 11 Oktober 2026",
    original: "Petikan ulasan dipaparkan dalam bahasa asal pengulas.",
    excerpt: "Petikan ulasan",
    aboutRating: "Penilaian Google",
    ratingValue: "4.7",
    source: "Lihat di Google",
    allReviews: "Lihat semua ulasan",
    writeReview: "Tulis ulasan Google",
    ratingLabel: `Rating Google 4.7 daripada 5 berdasarkan ${googleRating.count} ulasan`,
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );
}

function reviewCards(labels) {
  const accents = ["border-bros-gold", "border-bros-blue", "border-bros-navy"];
  const avatarColors = [
    "bg-bros-blue text-white",
    "bg-bros-gold text-bros-navy",
    "bg-bros-navy text-white",
  ];

  return reviews
    .map(
      (review, index) => `<article class="bg-white p-7 sm:p-8 border-t-4 ${accents[index % accents.length]} shadow-sm flex flex-col h-full">
<div class="flex items-center justify-between gap-4 mb-5">
<div class="flex items-center gap-3 min-w-0">
<div class="w-10 h-10 ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center font-bold text-sm" style="flex-shrink:0" aria-hidden="true">${escapeHtml(review.initials)}</div>
<div class="min-w-0">
<h3 class="font-semibold text-bros-navy truncate">${escapeHtml(review.name)}</h3>
<div class="text-bros-gold tracking-[0.12em] text-sm" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
</div>
</div>
<span class="text-[10px] uppercase tracking-[0.16em] text-bros-blue font-bold">Google</span>
</div>
${review.excerpt ? `<p class="text-[10px] uppercase tracking-[0.12em] text-bros-charcoal/55 font-bold mb-3">${labels.excerpt}</p>\n` : ""}<blockquote lang="en" class="text-bros-charcoal leading-relaxed flex-1">&ldquo;${escapeHtml(review.quote)}&rdquo;</blockquote>
<a class="mt-6 text-xs font-bold text-bros-blue hover:text-bros-navy transition inline-flex items-center gap-1" href="${escapeHtml(review.url || profileUrl)}" rel="noopener noreferrer" target="_blank">${labels.source} <span aria-hidden="true">&#8599;</span></a>
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
<div class="font-display text-5xl font-bold text-bros-navy leading-none">${labels.ratingValue}<span class="text-lg text-bros-charcoal/50">/5</span></div>
</div>
<div class="relative inline-block text-xl tracking-[0.1em] leading-none whitespace-nowrap" aria-hidden="true"><span class="text-bros-charcoal/20">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="absolute top-0 left-0 overflow-hidden whitespace-nowrap text-bros-gold" style="width:${(googleRating.value / 5) * 100}%">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
</div>
<p class="text-xs text-bros-charcoal/65 mt-4">${labels.basedOn}<br/>${labels.updated}</p>
</div>
</div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

function synchronizeAbout(original, labels, relativePath) {
  const newline = original.includes("\r\n") ? "\r\n" : "\n";
  const heroPattern = /(<div class="font-display text-3xl lg:text-5xl font-bold text-bros-navy">)[0-9.,]+(<\/div>\s*<div class="text-xs tracking-wider uppercase text-bros-charcoal\/70 mt-2 font-medium">)\s*(?:Rating Rata-rata|Average Rating|Penilaian Purata|Rating Google|Google rating|Penilaian Google)\s*<\/div>/;
  const badgePattern = /<div class="font-display text-2xl font-bold text-bros-blue">★ [0-9.,]+<\/div>\s*<div class="text-bros-charcoal\/60 mt-1">Google Reviews<\/div>(?:\s*<p class="text-\[10px\] text-bros-charcoal\/55 mt-2">[\s\S]*?<\/p>)?/;
  if (!heroPattern.test(original) || !badgePattern.test(original)) {
    throw new Error(`${relativePath}: Google rating locations were not found`);
  }
  return original
    .replace(heroPattern, (_, before, after) => `${before}${labels.ratingValue}${after}${newline}${labels.aboutRating}${newline}</div>`)
    .replace(badgePattern, `<div class="font-display text-2xl font-bold text-bros-blue">★ ${labels.ratingValue}</div>${newline}<div class="text-bros-charcoal/60 mt-1">Google Reviews</div>${newline}<p class="text-[10px] text-bros-charcoal/55 mt-2">${labels.basedOn}<br/>${labels.updated}</p>`);
}

const updates = [];
for (const [locale, labels] of Object.entries(locales)) {
  for (const relativePath of labels.files) {
    const absolutePath = path.join(root, relativePath);
    const original = fs.readFileSync(absolutePath, "utf8");
    const updated = synchronizeHomepage(original, labels, relativePath);
    if (updated !== original) {
      updates.push({ absolutePath, relativePath, content: updated });
    }
  }
  const relativePath = `${locale}/bros-wisata-about.html`;
  const absolutePath = path.join(root, relativePath);
  const original = fs.readFileSync(absolutePath, "utf8");
  const updated = synchronizeAbout(original, labels, relativePath);
  if (updated !== original) {
    updates.push({ absolutePath, relativePath, content: updated });
  }
}

if (checkOnly) {
  if (updates.length > 0) {
    throw new Error(
      `Google reviews and About ratings are not synchronized in: ${updates.map((item) => item.relativePath).join(", ")}`,
    );
  }
  console.log("Google reviews and About ratings are synchronized across ID, EN, and MS.");
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
