# 🔄 BROS WISATA — Content Update Guide via Claude

**Workflow untuk update website tanpa hire developer.**

---

## 📋 Tentang Dokumen Ini

Panduan ini membantu Bapak/Ibu Salim **update konten website BROS Wisata** secara mandiri menggunakan Claude AI (sama seperti workflow `umrohmandiri.blog`).

**Prinsipnya:** Anda chat dengan Claude → Claude generate file HTML baru → Anda copy-paste & deploy.

**Tidak perlu:**
- ❌ Skill coding
- ❌ Tools development complex
- ❌ Hire developer
- ❌ Subscription mahal

**Yang Anda perlu:**
- ✅ Akun Claude.ai (gratis atau Pro)
- ✅ Akun Cloudflare Pages (sudah setup di README.md)
- ✅ Browser

---

## 🎯 Common Update Scenarios

Berikut **scenarios paling umum** yang akan Anda lakukan, dengan template prompt yang siap pakai.

### 📌 Daftar Scenarios:

1. [Tambah Paket Tour Baru](#1-tambah-paket-tour-baru)
2. [Update Harga / Pricing Strategy](#2-update-harga--pricing-strategy)
3. [Ganti Foto IG Carousel](#3-ganti-foto-ig-carousel)
4. [Tambah Testimonial Customer](#4-tambah-testimonial-customer)
5. [Update Itinerary Existing](#5-update-itinerary-existing)
6. [Tambah Halaman Baru (Blog/FAQ)](#6-tambah-halaman-baru)
7. [Update Kontak / Alamat](#7-update-kontak--alamat)
8. [Update Logo / Brand](#8-update-logo--brand)
9. [SEO Optimization](#9-seo-optimization)
10. [Bug Fix / Visual Issues](#10-bug-fix--visual-issues)

---

## 1. 📦 Tambah Paket Tour Baru

### 🎯 Saat Bapak/Ibu Mau:
- Tambah paket tour baru (misal: "Samosir Cultural Tour 4D3N")
- Expand portfolio dari 5 → 6 paket signature

### 📝 Template Prompt untuk Claude:

```
Bos, saya mau tambah paket baru:

NAMA: [Nama Paket dalam ID/MY/EN]
DURASI: [contoh: 4D3N]
BADGE: [BEST SELLER / POPULAR / PREMIUM / kosong]
TAGLINE: [1 kalimat pendek catchy]
HOOK: [2-3 kalimat description]

HIGHLIGHTS (4-6 items):
- [highlight 1]
- [highlight 2]
- [highlight 3]
- [highlight 4]

ITINERARY:
Day 1: [Route] - [items per day]
Day 2: [Route] - [items per day]
Day 3: [Route] - [items per day]
...

INCLUSIONS: [daftar yang termasuk]
EXCLUSIONS: [daftar yang tidak termasuk]

Tolong:
1. Generate file detail page baru `paket-[nama]_[durasi].html`
2. Update `bros-wisata-tour-listing.html` untuk include paket baru
3. Update stats homepage "5 Paket" → "6 Paket Signature"
4. Update `sitemap.xml` untuk include URL baru
5. Update About B2B section untuk list paket baru

Pastikan:
- Bilingual ID/MY/EN
- "Quote on Request" (no public pricing)
- Tone konsisten dengan paket signature lain
- Schema.org TouristTrip include itinerary
```

### 📦 Hasil yang Anda Dapat:
- 1 file `paket-[id-baru].html` baru
- 4 file ter-update: tour-listing, homepage, about, sitemap
- Total: ~5 files untuk Anda copy-paste & deploy

### ⏱️ Waktu Pengerjaan:
- Claude: 5-10 menit
- Deploy: 5 menit

---

## 2. 💰 Update Harga / Pricing Strategy

### 🎯 Saat Bapak/Ibu Mau:
- Ganti dari "Quote on Request" jadi tampil harga (misalnya untuk season Lebaran)
- Tambah pricing tier (Standard / Premium / VIP)
- Update mata uang (tambah USD, JPY)

### 📝 Template Prompt untuk Claude:

```
Bos, saya mau update pricing strategy:

CHANGE: [Quote on Request] → [Tampil harga "From RM XXX"]

DATA HARGA per paket:
- Medan Heritage 3D2N: From RM 850 / SGD 280 / USD 220
- Bukit Lawang 4D3N: From RM 1,200 / SGD 400 / USD 320
- Tangkahan 3D2N: From RM 1,100 / SGD 365 / USD 290
- Berastagi 3D2N: From RM 750 / SGD 250 / USD 200
- Combo Sumut 6D5N: From RM 2,500 / SGD 825 / USD 660

DISCLAIMER: "Harga per pax berdasarkan grup minimal 4 orang. Harga final via WhatsApp."

Tolong update:
1. Semua 5 detail pages (sidebar pricing card)
2. Tour listing (cards)
3. Homepage featured packages

Pastikan:
- Currency switcher tetap ID/MY/EN
- "Sebut Harga" tetap ada sebagai option
- WhatsApp CTA pre-filled message disesuaikan
```

### 📦 Hasil:
- 7 file ter-update (5 detail + listing + homepage)

---

## 3. 📸 Ganti Foto IG Carousel

### 🎯 Saat Bapak/Ibu Mau:
- Replace placeholder IG images dengan foto trip real
- Update IG carousel dengan foto musim baru

### 📝 Template Prompt untuk Claude:

**Step 1 — Upload foto baru ke chat Claude:**

```
Bos, ini foto trip Bukit Lawang Maret 2026:

[upload 4 foto: cover, highlights, itinerary, cta]

Foto-foto ini untuk paket Bukit Lawang 4D3N. Tolong:
1. Suggest crop ratio yang tepat (square 1:1 untuk IG carousel)
2. Generate placeholder file paths supaya saya tinggal save:
   - assets/ig/bukit_lawang_4h3m/en/01_cover.png
   - assets/ig/bukit_lawang_4h3m/en/02_highlights.png
   - assets/ig/bukit_lawang_4h3m/en/03_itinerary.png
   - assets/ig/bukit_lawang_4h3m/en/04_cta.png
   (sama untuk versi /my/)

Setelah saya save 8 file (4 EN + 4 MY), file HTML tidak perlu diubah karena path-nya sudah benar.
```

### 📦 Workflow:
1. Edit foto di Canva / Photoshop dengan ratio 1:1 (1080x1080)
2. Save dengan nama exact: `01_cover.png`, `02_highlights.png`, dll
3. Upload ke folder `assets/ig/[paket-id]/en/` dan `/my/`
4. Re-deploy ke Cloudflare Pages

**Tidak perlu chat Claude untuk update file HTML** — karena saya sudah pakai relative path.

---

## 4. ⭐ Tambah Testimonial Customer

### 🎯 Saat Bapak/Ibu Mau:
- Tambah review/testimonial customer di About atau homepage
- Tampilkan rating bintang dari customer puas

### 📝 Template Prompt untuk Claude:

```
Bos, saya mau tambah 3 testimonial baru di homepage/about:

TESTIMONIAL 1:
- Nama: Sarah Tan
- Asal: Kuala Lumpur, Malaysia
- Rating: 5/5
- Quote (EN): "Our 6D5N Sumut tour was unforgettable. Guide was knowledgeable, vehicle clean, food halal & delicious."
- Quote (MY): "Tour 6D5N Sumut kami tidak akan dilupakan. Pemandu pakar, kereta bersih, makanan halal & enak."
- Tour: Combo Sumut 6D5N (Maret 2026)

TESTIMONIAL 2:
[...]

TESTIMONIAL 3:
[...]

Tolong:
1. Tambah section "Apa Kata Tamu" di Homepage (sebelum CTA)
2. Atau tambah di About page (setelah Tim section)
3. Visual: card style dengan foto avatar (placeholder), bintang, quote
4. Bilingual ID/MY/EN
5. Update aggregateRating di schema.org TravelAgency
```

### 📦 Hasil:
- 1-2 file ter-update (homepage + about)

---

## 5. 📅 Update Itinerary Existing

### 🎯 Saat Bapak/Ibu Mau:
- Ganti restoran karena sudah tutup
- Tambah aktivitas baru (misal: cooking class)
- Reorder day order
- Update destinasi (misal: ganti dari A ke B)

### 📝 Template Prompt untuk Claude:

```
Bos, saya mau update itinerary paket Medan Heritage 3D2N:

CHANGE Day 2:
SEBELUM:
- Day 2 sore: Restoran Tip Top untuk dinner
- Day 2 malam: jalan-jalan Pasar Merdeka

SESUDAH:
- Day 2 sore: Cooking class masakan Medan di Hotel
- Day 2 malam: Restoran Soto Kesawan untuk dinner
- Day 2 night: Tjong A Fie Mansion night tour

Tolong:
1. Update file paket-medan_heritage_3h2m.html
2. Update juga di PDF kalau ada (atau notice saya untuk re-generate PDF)
3. Pastikan bilingual ID/MY/EN konsisten
```

### 📦 Hasil:
- 1 file detail page ter-update
- Note: PDF perlu re-generate manual (atau kirim ke saya untuk handle)

---

## 6. 🆕 Tambah Halaman Baru (Blog / FAQ)

### 🎯 Saat Bapak/Ibu Mau:
- Tambah Blog section untuk content marketing
- Tambah FAQ page untuk SEO long-tail
- Tambah Testimonial dedicated page

### 📝 Template Prompt untuk Claude:

```
Bos, saya mau tambah halaman FAQ baru:

NAMA FILE: bros-wisata-faq.html
TUJUAN: Jawab pertanyaan umum wisatawan ASEAN sebelum mereka WhatsApp

KATEGORI FAQ:
1. Booking & Payment (5 questions)
2. Tour Operations (4 questions)
3. Customization (3 questions)
4. Refund & Cancellation (3 questions)
5. Documentation (Visa, Halal, dll)

TONE: Friendly tapi professional
BAHASA: ID/MY/EN

Tolong:
1. Generate file bros-wisata-faq.html
2. Update navigation di semua page (tambah link "FAQ")
3. Update sitemap.xml
4. Add FAQ schema.org untuk SEO rich snippets
5. Setiap FAQ ada CTA "Masih ada pertanyaan? WhatsApp kami"
```

### 📦 Hasil:
- 1 file baru `bros-wisata-faq.html`
- 11 file ter-update (semua page yang punya nav)
- 1 file sitemap.xml ter-update

---

## 7. 📞 Update Kontak / Alamat

### 🎯 Saat Bapak/Ibu Mau:
- Pindah kantor (alamat baru)
- Ganti nomor WhatsApp
- Tambah nomor telepon kantor
- Update email

### 📝 Template Prompt untuk Claude:

```
Bos, kontak BROS Wisata berubah:

LAMA:
- WhatsApp: +62 812-6013-9399
- Email: broswisata@gmail.com
- Address: Jl. Ring Road No. 117 B, Medan Sunggal

BARU:
- WhatsApp: +62 [nomor baru]
- Email: hello@broswisata.com (custom domain)
- Address: [alamat baru lengkap]
- Tambah: Telepon kantor +62 [nomor]

Tolong update di SEMUA file (11 HTML pages + sitemap):
1. Footer
2. Contact page
3. About page legalitas
4. Schema.org TravelAgency
5. WhatsApp CTA links (semua hardcoded link wa.me)
6. Email mailto: links
```

### 📦 Hasil:
- ~12 files ter-update
- ⚠️ Critical: Pastikan WhatsApp pre-filled message juga diupdate

---

## 8. 🎨 Update Logo / Brand

### 🎯 Saat Bapak/Ibu Mau:
- Refresh logo (warna baru, shape baru)
- Ganti tagline
- Update color palette

### 📝 Template Prompt untuk Claude:

```
Bos, brand BROS Wisata refresh:

LOGO:
- Lama: Mountain "M" icon (navy + gold)
- Baru: [upload file SVG/PNG baru]

WARNA:
- Lama: bros-blue #0F47B0, bros-navy #0A2E70, bros-gold #E8A317
- Baru: [color hex codes baru]

TAGLINE:
- Lama: "Hub of Sumatra"
- Baru: [tagline baru kalau ganti]

TYPOGRAPHY:
- Lama: Bricolage Grotesque (display) + Plus Jakarta Sans (body)
- Baru: [tetap atau ganti]

Tolong update di:
1. Semua nav & footer 11 HTML pages
2. Tailwind config di setiap page
3. Generate logo SVG inline yang baru
4. Update brand sheet (00-BRAND-SHEET.html)
5. Update meta tags og:image kalau perlu
```

### ⚠️ Warning:
**Brand refresh adalah keputusan strategis.** Sebelum eksekusi, diskusikan dengan saya dulu untuk validate consistency.

---

## 9. 🔍 SEO Optimization

### 🎯 Saat Bapak/Ibu Mau:
- Boost ranking untuk keyword tertentu
- Tambah blog content untuk SEO
- Optimize meta descriptions
- Add schema.org untuk rich results

### 📝 Template Prompt untuk Claude:

```
Bos, saya mau improve SEO untuk keyword "tour Lake Toba Malaysia":

CURRENT RANKING: [cek di Google Search Console]
TARGET: Top 5

Tolong:
1. Audit current meta description Toba-related pages
2. Suggest improvement untuk:
   - Title (60 char max)
   - Description (160 char max)
   - H1 / H2 hierarchy
   - Internal linking strategy
3. Suggest 3-5 long-tail keyword variations
4. Update schema.org untuk include FAQ untuk Toba tour

Apakah perlu bikin landing page khusus "lake-toba-tour-malaysia.html"?
```

### 📦 Hasil:
- Audit report
- Suggested updates
- New landing page (opsional)

---

## 10. 🐛 Bug Fix / Visual Issues

### 🎯 Saat Bapak/Ibu Nemu:
- Layout pecah di HP / desktop
- Image tidak muncul
- Link broken
- Spelling/grammar error
- Inkonsistensi (seperti yang Bapak/Ibu sering nemu!)

### 📝 Template Prompt untuk Claude:

```
Bos, saya nemu bug di [nama page]:

ISSUE: [deskripsi masalah]

REPRODUCE:
1. Buka [file HTML]
2. Scroll ke section [...]
3. Lihat di [browser / device]

EXPECTED: [apa yang seharusnya tampil]
ACTUAL: [apa yang terjadi]

[upload screenshot kalau perlu]

Tolong:
1. Identify root cause
2. Fix the bug
3. Audit similar issues di file lain (proactive)
4. Confirm fixed dengan re-test
```

### 💡 Pro Tip:
**Selalu upload screenshot** kalau bug visual. Jauh lebih cepat untuk saya identify.

---

## 🔄 General Workflow (Setiap Update)

### Workflow Standar:

```
1. Buka chat Claude.ai
2. Paste salah satu template prompt di atas (sesuaikan content)
3. Tambah: "Beri saya semua file yang perlu di-update"
4. Tunggu Claude generate (1-5 menit)
5. Download / copy semua file
6. Replace file di folder lokal Anda
7. Login Cloudflare Pages
8. Drag & drop seluruh folder (atau file yang berubah saja)
9. Tunggu deploy ~1 menit
10. Test live: https://broswisata.com
11. Done! ✅
```

### Estimated Time per Update Type:

| Update Type | Claude Time | Deploy Time | Total |
|---|---|---|---|
| Tambah paket baru | 10 menit | 5 menit | **15 menit** |
| Update pricing | 5 menit | 5 menit | **10 menit** |
| Update kontak | 3 menit | 5 menit | **8 menit** |
| Bug fix kecil | 2 menit | 5 menit | **7 menit** |
| Tambah halaman baru | 15 menit | 5 menit | **20 menit** |
| Update foto | 0 menit (Claude) | 10 menit (resize + deploy) | **10 menit** |

**Average update workflow:** **10-15 menit** dari ide → live di internet.

---

## 💡 Best Practices

### ✅ DO:

1. **Selalu screenshot bug** sebelum minta fix — saya bisa lebih akurat
2. **Test di HP & desktop** setelah deploy — 70% traffic dari mobile
3. **Backup folder lokal** sebelum major update — Cloudflare Pages punya history, tapi local backup lebih aman
4. **Update sitemap.xml** setiap tambah halaman baru — penting untuk SEO
5. **Verify language balance ID/MY/EN** — saya bantu audit kalau Anda minta
6. **Re-deploy setelah ada perubahan** — Cloudflare Pages tidak auto-detect, harus manual deploy

### ❌ DON'T:

1. **Jangan rename file** sembarangan — banyak link akan broken
2. **Jangan hapus folder `assets/`** — semua image akan hilang
3. **Jangan edit `_redirects` file** tanpa paham — bisa bikin redirect loop
4. **Jangan upload file >5MB** — Cloudflare Pages ada size limit
5. **Jangan share kredensial Cloudflare** dengan siapapun — termasuk saya

---

## 🎯 Strategic Update Calendar (Suggestion)

Berdasarkan pengalaman 30+ tahun di travel industry, ini suggested update frequency:

### 🗓️ Monthly:
- ✅ Tambah 2-4 testimonial customer baru
- ✅ Update IG carousel dengan foto trip terbaru
- ✅ Add 1 blog post (untuk SEO long-term)

### 🗓️ Quarterly:
- ✅ Review pricing (sesuai season ASEAN)
- ✅ Audit SEO performance via Google Search Console
- ✅ Refresh hero images kalau ada season change

### 🗓️ Yearly:
- ✅ Major content refresh (rewrite copywriting)
- ✅ Brand audit (logo, colors, tone)
- ✅ Performance audit (Lighthouse score)

### 🗓️ As Needed:
- ✅ Add paket baru (saat business expand)
- ✅ Update kontak (kalau pindah office)
- ✅ Bug fix (kapanpun nemu)

---

## 📞 Bantuan Lanjutan

### Untuk Update Standard:
Pakai template prompt di dokumen ini.

### Untuk Strategic Decision:
Chat Claude dengan context: *"Sebagai konsultan travel 30+ tahun, advise saya tentang [decision]"*

### Untuk Major Refactor:
Diskusikan dulu dengan saya untuk plan eksekusi yang tepat.

---

## 🎁 Bonus: Common Phrases yang Saya Pahami

Saya (Claude) familiar dengan istilah-istilah ini, jadi Anda bisa pakai natural:

- "**Quote on Request**" / "**Sebut Harga**" — pricing strategy wholesale
- "**Hub of Sumatra**" — tagline BROS
- "**5 paket signature**" — current product portfolio
- "**Sumatra Utara focus**" — geographic scope
- "**B2B agen partner**" — wholesale audience (Malaysia/Singapore/Brunei)
- "**Multi-language ID/MY/EN**" — bilingual standard
- "**Schema.org TouristTrip**" — SEO structured data
- "**Cloudflare Pages**" — hosting platform

Anda tidak perlu jelaskan ulang setiap kali — saya inget context.

---

## 🌟 Closing — Strategic Mindset

Bapak/Ibu Salim,

**Workflow AI-assisted ini adalah competitive advantage besar untuk BROS Wisata.**

Banyak operator tour bersaing yang:
- Hire freelance developer Rp 5-10jt setiap update kecil
- Atau pakai dashboard custom yang ribet
- Atau pakai Wix/Squarespace yang generic

Sedangkan Anda:
- ✅ Update kapanpun via chat (5-15 menit)
- ✅ Cost: Rp 0 (gratis Claude tier basic)
- ✅ Quality control 100% di tangan Anda
- ✅ Brand consistency terjaga
- ✅ SEO terus optimal

**Repeat the winning formula** dari `umrohmandiri.blog`. Anda sudah prove model ini works.

**Hub of Sumatra · Bismillah ✨**

---

**Dokumen dibuat oleh:** Claude (AI consultant for BROS Wisata)
**Tanggal:** April 2026
**Versi:** 1.0

> Dokumen ini bisa di-update kapan saja via Claude. Cukup minta:
> *"Update UPDATE-GUIDE.md untuk tambah scenario [X]"*
