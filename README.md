# 🌐 BROS WISATA — Website Deployment Guide

**PT BROS INTI WISATA** · Tour Operator Sumatra Utara · Hub of Sumatra

---

## 📋 Tentang Dokumen Ini

Panduan lengkap untuk deploy website BROS Wisata ke **Cloudflare Pages** (gratis selamanya).
Workflow ini sama dengan yang digunakan untuk `umrohmandiri.blog` dan `mmbtravel.id`.

**Estimasi waktu deploy total:** 30-45 menit (pertama kali)

---

## 🎯 Apa yang Akan Anda Capai

Setelah selesai mengikuti panduan ini, Anda akan punya:

- ✅ Website BROS Wisata **live di internet** (`https://broswisata.com` atau subdomain pilihan Anda)
- ✅ **HTTPS aktif otomatis** (gembok hijau di browser)
- ✅ **CDN global** Cloudflare (loading cepat dari mana saja di dunia)
- ✅ **Auto-deploy** setiap kali update file (drag & drop)
- ✅ **Gratis selamanya** (kecuali domain ~Rp 220.000/tahun)

---

## 📦 Inventory File yang Harus Diupload

Sebelum deploy, pastikan folder Anda berisi semua file ini:

```
bros-wisata-website/
│
├── 🏠 bros-wisata-homepage.html        (Beranda — entry point)
├── 📋 bros-wisata-tour-listing.html    (Katalog 5 paket signature)
├── 📦 paket-medan_heritage_3h2m.html   (Detail Medan Heritage)
├── 📦 paket-bukit_lawang_4h3m.html     (Detail Bukit Lawang)
├── 📦 paket-tangkahan_3h2m.html        (Detail Tangkahan)
├── 📦 paket-berastagi_3h2m.html        (Detail Berastagi)
├── 📦 paket-combo_sumut_6h5m.html      (Detail Combo Sumut Premium)
├── 🚗 bros-wisata-car-rental.html      (Sewa mobil & supir)
├── ✏️ bros-wisata-custom-tour.html     (Custom tour builder)
├── ℹ️ bros-wisata-about.html           (Tentang + B2B section)
├── 📞 bros-wisata-contact.html         (Kontak)
│
├── 🗺️ sitemap.xml                      (SEO sitemap)
├── 🤖 robots.txt                       (SEO crawler rules)
│
├── 📁 assets/
│   ├── 📁 pdf/
│   │   ├── medan_heritage_3h2m.pdf
│   │   ├── bukit_lawang_4h3m.pdf
│   │   ├── tangkahan_3h2m.pdf
│   │   ├── berastagi_3h2m.pdf
│   │   └── combo_sumut_6h5m.pdf
│   │
│   └── 📁 ig/
│       ├── medan_heritage_3h2m/  (8 IG carousel images)
│       ├── bukit_lawang_4h3m/    (8 images)
│       ├── tangkahan_3h2m/        (8 images)
│       ├── berastagi_3h2m/        (8 images)
│       └── combo_sumut_6h5m/      (8 images)
│
└── 📁 bros-wisata-logos/           (23 logo files)
```

**Total:** 11 HTML + 5 PDF + 40 IG images + 23 logos + 2 SEO files = ~80 files

---

## 🚀 PART 1: Setup Cloudflare Account

### Step 1.1 — Buat Akun Cloudflare (jika belum punya)

1. Buka [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Daftar pakai email Anda (rekomendasi: gunakan `broswisata@gmail.com`)
3. Verifikasi email
4. Login ke dashboard

> 💡 **Tips:** Kalau Anda sudah punya akun untuk umrohmandiri.blog atau mmbtravel.id, **gunakan akun yang sama**. Lebih mudah maintenance.

---

## 🌐 PART 2: Beli Domain `broswisata.com`

### Opsi A — Beli via Cloudflare Registrar (RECOMMENDED, paling murah)

1. Login ke Cloudflare dashboard
2. Klik **"Domain Registration"** di sidebar kiri
3. Klik **"Register Domain"**
4. Search: `broswisata.com`
5. Kalau available → klik "Register" (~$8-10/tahun ≈ Rp 130.000 - 165.000)
6. Bayar via kartu kredit atau PayPal
7. Tunggu 5-10 menit untuk propagation

> ⚠️ **Kalau `broswisata.com` sudah dipakai orang:**
> - Coba `.id` extension: `broswisata.id` (~Rp 250.000/tahun di Pandi)
> - Atau `.co.id` (untuk PT, butuh dokumen)
> - Atau `.travel` (premium, ~Rp 1jt/tahun)

### Opsi B — Beli di registrar lain (Namecheap, Niagahoster, dll)

Kalau sudah beli di tempat lain, tidak masalah. Anda tinggal:
1. Login ke registrar tersebut
2. Setting **Nameservers** ke Cloudflare:
   - `dara.ns.cloudflare.com`
   - `theo.ns.cloudflare.com`
3. Tunggu propagation (30 menit - 24 jam)

---

## 📤 PART 3: Deploy ke Cloudflare Pages

### Step 3.1 — Akses Pages Dashboard

1. Login ke [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Sidebar kiri → klik **"Workers & Pages"**
3. Klik tombol **"Create"** di kanan atas
4. Pilih tab **"Pages"**
5. Pilih **"Upload assets"** (bukan "Connect to Git")

### Step 3.2 — Buat Project Baru

1. **Project name:** `broswisata` (akan jadi `broswisata.pages.dev`)
2. Klik **"Create project"**
3. Drag & drop folder `bros-wisata-website` ke area upload
4. **TUNGGU upload selesai** (1-3 menit, tergantung internet)
5. Klik **"Deploy site"**

### Step 3.3 — Tunggu Build

- Cloudflare akan deploy file-file Anda
- Biasanya 30 detik - 2 menit
- Status berubah jadi: **"Success! Your project is live"**

### Step 3.4 — Test Live URL

Klik link `https://broswisata.pages.dev` — website Anda sudah **LIVE!**

> 🎉 **Selamat!** Website Anda sudah online di internet.

---

## 🔗 PART 4: Connect Custom Domain `broswisata.com`

### Step 4.1 — Tambah Custom Domain

1. Di Cloudflare Pages, klik project `broswisata`
2. Klik tab **"Custom domains"**
3. Klik **"Set up a custom domain"**
4. Masukkan: `broswisata.com`
5. Klik **"Continue"**
6. Cloudflare akan auto-setup DNS records
7. Klik **"Activate domain"**

### Step 4.2 — Setup `www` Subdomain (opsional tapi recommended)

1. Klik **"Set up a custom domain"** lagi
2. Masukkan: `www.broswisata.com`
3. Klik **"Continue"** → **"Activate"**

### Step 4.3 — Tunggu Propagation

- DNS propagation: **5-30 menit** biasanya
- HTTPS auto-enabled by Cloudflare (free SSL)
- Test buka `https://broswisata.com` di browser

> ✅ **Indikator success:** Browser tampil **gembok hijau** + URL `https://broswisata.com` bisa diakses.

---

## 🎯 PART 5: Set Default Page (Homepage)

By default, Cloudflare Pages serve `index.html`. Tapi file Anda namanya `bros-wisata-homepage.html`.

### Solusi A — Rename File (RECOMMENDED, paling simple)

**Sebelum upload**, rename file di komputer Anda:
- `bros-wisata-homepage.html` → `index.html`

> ⚠️ **Tapi hati-hati:** Kalau rename ke `index.html`, semua link lain yang point ke `bros-wisata-homepage.html` akan broken.

### Solusi B — Buat `_redirects` File (RECOMMENDED untuk Cloudflare Pages)

Bikin file `_redirects` (tanpa extension) di root folder, isinya:

```
/    /bros-wisata-homepage.html    200
```

Ini akan auto-redirect URL `https://broswisata.com/` ke homepage Anda.

### Solusi C — Pakai `_headers` (Advanced)

Skip ini kalau Anda baru. Solusi A atau B sudah cukup.

---

## 🔄 PART 6: Update Website (Workflow Selanjutnya)

Setelah deploy pertama, untuk update content:

### Untuk Update Kecil (1-2 file):

1. Edit file HTML di komputer Anda (atau via Claude)
2. Login Cloudflare Pages → project `broswisata`
3. Klik **"Create deployment"**
4. Drag & drop **file yang berubah saja** (atau seluruh folder)
5. Tunggu deploy ~1 menit
6. Live!

### Untuk Update Besar (struktur, banyak file):

1. Update folder lokal Anda secara lengkap
2. Drag & drop **seluruh folder** ke Cloudflare Pages
3. Tunggu deploy
4. Live!

> 💡 **Tips:** Cloudflare Pages otomatis simpan **history deploy**. Kalau update bermasalah, klik "Rollback to previous version" — instant revert.

---

## 📊 PART 7: Setup Google Search Console (SEO)

Setelah website live, daftarkan ke Google supaya cepat ter-index.

### Step 7.1 — Tambah Property

1. Buka [https://search.google.com/search-console](https://search.google.com/search-console)
2. Login pakai akun Google (bisa pakai `broswisata@gmail.com`)
3. Klik **"Add property"**
4. Pilih **"URL prefix"** (lebih simple)
5. Masukkan: `https://broswisata.com`
6. Klik **"Continue"**

### Step 7.2 — Verifikasi Ownership

Pilih method **"HTML tag"**:

1. Copy meta tag yang Google kasih (mirip ini):
   ```html
   <meta name="google-site-verification" content="abc123xyz...">
   ```

2. Buka file `bros-wisata-homepage.html` di Claude
3. Minta Claude: *"Tambahkan meta tag verifikasi Google ini ke `<head>` semua HTML page: [paste tag]"*
4. Save & re-deploy ke Cloudflare Pages
5. Kembali ke Google Search Console → klik **"Verify"**

### Step 7.3 — Submit Sitemap

1. Di Search Console → sidebar kiri → **"Sitemaps"**
2. Masukkan: `sitemap.xml`
3. Klik **"Submit"**
4. Tunggu 1-3 hari untuk indexing

> ⚡ **Bonus:** Submit URL khusus untuk faster indexing:
> - Klik "URL Inspection" di sidebar
> - Paste URL homepage
> - Klik "Request Indexing"

---

## 🏢 PART 8: Setup Google Business (Local SEO Medan)

Penting untuk muncul di Google Maps & Local Search.

1. Buka [https://www.google.com/business](https://www.google.com/business)
2. Klik **"Manage now"**
3. Search nama bisnis: **"BROS Wisata"** atau **"PT BROS INTI WISATA"**
4. Kalau belum ada → klik **"Add your business to Google"**
5. Isi data:
   - **Business name:** BROS Wisata
   - **Category:** Travel Agency
   - **Address:** Jl. Ring Road No. 117 B, Medan Sunggal, Medan 20122
   - **Phone:** +62 812-6013-9399
   - **Website:** https://broswisata.com
   - **Hours:** 24/7 (atau sesuai jam operasional)
6. Verifikasi via pos atau telepon (Google akan kirim postcard ke alamat Anda dalam 1-2 minggu)

---

## ⚙️ PART 9: Common Issues & Troubleshooting

### Issue 1: Website tampil 404 atau "Page Not Found"

**Solusi:**
- Pastikan file `index.html` ada di root folder, ATAU
- Pastikan `_redirects` file di-setup (lihat PART 5)
- Cek di Cloudflare Pages → "Deployments" → klik latest → lihat file list

### Issue 2: Image tidak muncul

**Solusi:**
- Cek path image: `assets/ig/...` (case-sensitive!)
- Pastikan folder `assets/` ter-upload
- Buka browser DevTools (F12) → tab "Network" → cari image yang gagal load

### Issue 3: PDF download tidak work

**Solusi:**
- Cek path: `assets/pdf/medan_heritage_3h2m.pdf`
- Pastikan folder `pdf/` ter-upload
- Test direct URL: `https://broswisata.com/assets/pdf/medan_heritage_3h2m.pdf`

### Issue 4: Domain belum bisa diakses

**Solusi:**
- DNS propagation butuh waktu 5 menit - 24 jam
- Cek status: [https://dnschecker.org](https://dnschecker.org) → masukkan domain Anda
- Kalau lebih dari 24 jam masih belum work, cek nameservers di registrar Anda

### Issue 5: HTTPS error / "Not Secure"

**Solusi:**
- Tunggu 5-10 menit setelah connect domain (Cloudflare auto-issue SSL)
- Di Cloudflare dashboard → SSL/TLS → set ke **"Full"** atau **"Full (strict)"**

### Issue 6: Tailwind CSS tidak load (warning di console)

**Penjelasan:** Website Anda pakai Tailwind via CDN (`cdn.tailwindcss.com`).
Browser kasih warning di Developer Console tapi **website tetap functional**.

**Kalau Anda mau hilangkan warning:**
- Setup compiled Tailwind (perlu Node.js + build tools)
- **Tidak rekomendasi** untuk workflow AI-assisted Anda
- Customer **tidak akan lihat warning** (cuma developer)

---

## 📈 PART 10: Performance Tips

### Tip 1 — Optimize Image Size

PDF & IG carousel images saat ini sudah optimized (~50KB rata-rata). Tapi kalau Anda upload foto trip baru:

- **Resize ke 1920px width maksimum** (untuk hero images)
- **Convert ke WebP format** kalau memungkinkan (lebih kecil dari JPG)
- **Compress dengan TinyPNG** ([https://tinypng.com](https://tinypng.com))

### Tip 2 — Enable Cloudflare Auto Minify

1. Cloudflare dashboard → Speed → Optimization
2. Toggle ON: **Auto Minify** (HTML, CSS, JS)
3. Toggle ON: **Brotli** (compression)

### Tip 3 — Set Cache TTL

1. Cloudflare dashboard → Caching → Configuration
2. **Browser Cache TTL:** 4 hours
3. **Edge Cache TTL:** 2 hours

---

## 🆘 PART 11: Bantuan Lebih Lanjut

### Sumber Resmi:

- 📚 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 📺 [Cloudflare Pages YouTube Tutorial](https://www.youtube.com/results?search_query=cloudflare+pages+tutorial)
- 💬 [Cloudflare Community](https://community.cloudflare.com/)

### Untuk Update Content via Claude:

Buka file `UPDATE-GUIDE.md` (ada di folder yang sama) untuk panduan lengkap workflow update content via Claude.

---

## 🎉 Selamat Deploy!

Bapak/Ibu Salim,

Setelah mengikuti panduan ini, BROS Wisata akan **online di internet** dan siap melayani wisatawan ASEAN.

**Reminder strategis dari konsultan:**

1. ✅ **Test website sendiri 1-2 hari** sebelum mulai marketing push
2. ✅ **Minta 2-3 teman** review website (cek typo, bug, UX)
3. ✅ **Test semua link & WhatsApp CTA** (klik dari HP)
4. ✅ **Foto trip real** akan jauh meningkatkan trust (kapanpun siap)
5. ✅ **Sabar dengan SEO** — Google butuh 2-4 minggu untuk index pertama kali

**Hub of Sumatra · Bismillah ✨**

---

**Dokumen dibuat oleh:** Claude (AI consultant)
**Tanggal:** April 2026
**Versi:** 1.0

> Dokumen ini bisa di-update kapan saja via Claude. Cukup minta:
> *"Update README.md untuk reflect [perubahan]"*
