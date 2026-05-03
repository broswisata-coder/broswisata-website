# 🚀 BROS WISATA — DEPLOY HARI INI

**Quick Action Guide untuk deploy ke Cloudflare Pages.**

⏱️ **Estimated time: 30-45 menit** (pertama kali, termasuk beli domain)

---

## ✅ Pre-Deploy Checklist (5 menit)

Sebelum deploy, pastikan Bapak/Ibu siapkan:

- [ ] **Komputer/laptop** dengan koneksi internet stabil
- [ ] **Email aktif** (rekomendasi: `broswisata@gmail.com`)
- [ ] **Kartu kredit/debit** atau **PayPal** (untuk beli domain ~Rp 165.000/tahun)
- [ ] **Folder website** sudah di-download ke komputer (semua 17 HTML + assets)
- [ ] **WhatsApp di HP** (untuk test setelah live)

### 📦 Cek Folder Website Bapak/Ibu

Sebelum mulai, **double-check** folder website lengkap:

```
bros-wisata-website/                   ← Folder ini akan di-drag ke Cloudflare
│
├── 17 HTML files
├── README.md, UPDATE-GUIDE.md
├── sitemap.xml, robots.txt, _redirects
├── assets/
│   ├── pdf/ (11 files)
│   ├── ig/ (40 images)
│   └── gallery/ (17 photos)
└── bros-wisata-logos/ (23 files)
```

**Total size: ~6.6 MB** (super ringan, deploy cepat)

---

## 🌐 PART 1: Beli Domain `broswisata.com` (10 menit)

### Step 1.1 — Buat Akun Cloudflare

1. Buka browser → ke **https://dash.cloudflare.com/sign-up**
2. Daftar pakai email Anda (rekomendasi: `broswisata@gmail.com`)
3. Cek email → klik link verifikasi
4. Login ke dashboard Cloudflare

> 💡 **Pro tip:** Kalau Bapak/Ibu sudah punya akun Cloudflare untuk `umrohmandiri.blog` atau `mmbtravel.id`, **pakai akun yang sama**. Lebih mudah maintenance — semua domain di 1 dashboard.

### Step 1.2 — Beli Domain

1. Di sidebar kiri Cloudflare → klik **"Domain Registration"**
2. Klik tombol **"Register Domain"** (warna biru)
3. Search box: ketik `broswisata.com`
4. Status akan tampil:
   - ✅ **AVAILABLE** → klik "Register" 
   - ❌ **NOT AVAILABLE** → coba alternatif:
     - `broswisata.id` (~Rp 250.000/tahun)
     - `broswisata.co.id` (butuh dokumen PT, ~Rp 200.000)
     - `broswisata.travel` (premium, ~Rp 1jt)

5. Isi data registrant:
   - Nama: **PT BROS INTI WISATA**
   - Address: **Jl. Ring Road No. 117 B, Medan Sunggal, Medan 20122**
   - Phone: **+62 812-6013-9399**
   - Email: **broswisata@gmail.com**

6. Bayar (kartu kredit/PayPal) → **~$8-10/tahun**
7. **Klik "Register"** — domain langsung aktif dalam 5 menit

> ⚠️ **Penting:** Centang opsi **"Auto-renew"** supaya domain tidak hangus di tahun berikutnya.

---

## 📤 PART 2: Deploy ke Cloudflare Pages (15 menit)

### Step 2.1 — Akses Pages

1. Di Cloudflare dashboard → sidebar kiri → **"Workers & Pages"**
2. Klik tombol **"Create"** (warna biru di kanan atas)
3. Pilih tab **"Pages"**
4. Pilih **"Upload assets"** (BUKAN "Connect to Git")

### Step 2.2 — Buat Project

1. **Project name:** ketik `broswisata`
   - Akan jadi URL sementara: `broswisata.pages.dev`
2. Klik **"Create project"**

### Step 2.3 — Upload Folder

1. Page akan tampil **drag & drop area**
2. Buka **Finder/File Explorer** di komputer Bapak/Ibu
3. Pilih **SELURUH ISI folder** `bros-wisata-website` (Ctrl+A atau Cmd+A)
4. **Drag** semua file & folder ke drag area Cloudflare

> ⚠️ **PENTING:** Drag **ISI folder**, BUKAN folder-nya sendiri. 
> 
> ✅ **BENAR:** Drag `bros-wisata-homepage.html`, `bros-wisata-tour-listing.html`, folder `assets/`, folder `bros-wisata-logos/`, dll
> 
> ❌ **SALAH:** Drag folder `bros-wisata-website/` (akan jadi sub-folder, semua URL break)

5. Tunggu upload selesai (1-3 menit untuk 6.6 MB)
6. Klik **"Deploy site"**

### Step 2.4 — Tunggu Build

- Cloudflare process file...
- Status: **"Deploying..."** → **"Success! Your project is live"**
- Biasanya 30 detik - 2 menit

### Step 2.5 — Test Live URL Pertama

1. Cloudflare kasih URL: `https://broswisata.pages.dev`
2. Klik link tersebut
3. **Website Bapak/Ibu sudah LIVE!** 🎉

> ⚠️ **Tapi tunggu** — homepage default Cloudflare cari `index.html`. Kalau Bapak/Ibu lihat 404 atau file list, jangan panik. Lanjut ke **PART 3** untuk fix routing.

---

## 🎯 PART 3: Set Default Homepage (5 menit)

File `_redirects` yang sudah saya bikin **akan handle ini otomatis**. Cek apakah work:

### Test 1 — Buka URL Cloudflare
```
https://broswisata.pages.dev
```

**Expected:** Tampil homepage BROS Wisata.

**Kalau tampil 404:**
- Pastikan file `_redirects` ter-upload (cek di Cloudflare Pages → Deployments → file list)
- Kalau tidak ada, re-upload folder dengan `_redirects` included
- Re-deploy

### Test 2 — Test Shortcuts URL

File `_redirects` sudah saya setup shortcuts berikut. Test satu-satu:

| URL Pendek | Tujuan |
|---|---|
| `broswisata.pages.dev/wa` | → WhatsApp Bapak/Ibu |
| `broswisata.pages.dev/medan` | → Paket Medan Heritage |
| `broswisata.pages.dev/bukit-lawang` | → Paket Bukit Lawang |
| `broswisata.pages.dev/halal-3d` | → Paket Halal 3D2N |
| `broswisata.pages.dev/instagram` | → IG @broswisata |

**Kalau semua work** → routing sukses ✅

---

## 🔗 PART 4: Connect Domain `broswisata.com` (10 menit)

### Step 4.1 — Tambah Custom Domain

1. Di Cloudflare Pages → klik project `broswisata`
2. Klik tab **"Custom domains"**
3. Klik **"Set up a custom domain"**
4. Ketik: `broswisata.com`
5. Klik **"Continue"**
6. Cloudflare otomatis setup DNS (karena domain dibeli di Cloudflare juga)
7. Klik **"Activate domain"**

### Step 4.2 — Tambah `www` Subdomain

1. Klik **"Set up a custom domain"** lagi
2. Ketik: `www.broswisata.com`
3. Klik **"Continue"** → **"Activate"**

### Step 4.3 — Tunggu Propagation

- DNS propagation: **5-30 menit** biasanya
- HTTPS auto-enabled by Cloudflare (free SSL — gembok hijau)
- Test buka `https://broswisata.com` di browser baru (incognito/private window)

> ✅ **Indikator success:** Browser tampil **gembok hijau** + URL `https://broswisata.com` bisa diakses dari HP & desktop.

---

## 🧪 PART 5: Live Testing Checklist (10 menit)

Setelah `broswisata.com` live, test pakai HP:

### ✅ Test #1 — Mobile Experience (paling penting!)
- [ ] Buka `https://broswisata.com` di HP browser
- [ ] Hero photo tampil clear
- [ ] Menu navigation work
- [ ] Switch language ID/MY/EN work
- [ ] Scroll sampai bawah, semua section tampil

### ✅ Test #2 — Tour Listing & Smart Tabs
- [ ] Klik menu "Paket Tour"
- [ ] Tab **All (11)** tampil semua paket
- [ ] Klik tab **Signature (5)** → cuma 5 paket
- [ ] Klik tab **Eco Adventure (3)** → cuma 3 western
- [ ] Klik tab **Halal Malaysia (3)** → cuma 3 halal

### ✅ Test #3 — Detail Page
- [ ] Klik salah satu paket card
- [ ] Detail page tampil lengkap (hero, itinerary, pricing, real moments)
- [ ] Real Moments photos tampil
- [ ] PDF download button work
- [ ] WhatsApp button → buka WA dengan pre-filled message

### ✅ Test #4 — Customer Gallery (Homepage)
- [ ] Scroll homepage sampai section "Galeri Tamu Kami"
- [ ] 8-12 photos tampil mosaic grid
- [ ] Hover kasih caption (di desktop)
- [ ] Click → buka detail page yang relevan

### ✅ Test #5 — WhatsApp Integration
- [ ] Click WhatsApp button di hero
- [ ] WA app buka dengan pre-filled message
- [ ] Kirim pesan test ke nomor sendiri (atau teman)
- [ ] Pastikan message diterima dengan format benar

### ✅ Test #6 — Multi-Language
- [ ] Switch ke **MY (Malay)** → semua text berubah
- [ ] Switch ke **EN (English)** → semua text berubah
- [ ] Switch back ke **ID** → kembali Indonesia

### ✅ Test #7 — PDF Downloads
- [ ] Klik "Download PDF" di salah satu paket detail
- [ ] PDF terbuka di browser atau ter-download
- [ ] Cek 3-4 paket berbeda

### ✅ Test #8 — Privacy Test (External)
- [ ] Buka di HP teman (incognito mode)
- [ ] Pastikan website tampil sama
- [ ] Test dari koneksi 4G (bukan WiFi)

---

## 📊 PART 6: Setup Google Search Console (5 menit)

Setelah website live & confirmed work, daftarkan ke Google supaya cepat ter-index.

### Step 6.1 — Tambah Property

1. Buka **https://search.google.com/search-console**
2. Login pakai akun Google (`broswisata@gmail.com`)
3. Klik **"Add property"**
4. Pilih **"URL prefix"**
5. Masukkan: `https://broswisata.com`
6. Klik **"Continue"**

### Step 6.2 — Verifikasi (HTML Tag Method)

1. Google kasih meta tag (mirip ini):
   ```html
   <meta name="google-site-verification" content="abc123xyz...">
   ```

2. **Copy tag tersebut**, lalu kembali ke chat Claude. Minta:
   > *"Bos, tambahkan meta tag verifikasi Google ini ke `<head>` semua HTML page: [paste tag di sini]"*

3. Saya update file → Bapak/Ibu re-upload ke Cloudflare → re-deploy

4. Kembali ke Google Search Console → klik **"Verify"**

### Step 6.3 — Submit Sitemap

1. Sidebar kiri → klik **"Sitemaps"**
2. Masukkan: `sitemap.xml`
3. Klik **"Submit"**

> ⏱️ **Indexing time:** Google butuh **2-7 hari** untuk index pertama kali. Sabar!

---

## 🏢 PART 7: Setup Google Business (10 menit, optional tapi penting)

Untuk Local SEO Medan + Google Maps visibility.

1. Buka **https://www.google.com/business**
2. Klik **"Manage now"**
3. Search nama bisnis: **"BROS Wisata"** atau **"PT BROS INTI WISATA"**
4. Kalau **belum ada** → klik **"Add your business to Google"**
5. Isi data:
   - **Business name:** BROS Wisata
   - **Category:** Travel Agency
   - **Address:** Jl. Ring Road No. 117 B, Medan Sunggal, Medan 20122
   - **Phone:** +62 812-6013-9399
   - **Website:** https://broswisata.com
   - **Hours:** 24/7 (atau sesuai jam operasional)
6. **Verifikasi:** Google akan kirim **postcard ke alamat fisik** Bapak/Ibu (biasanya 1-2 minggu)
7. Setelah postcard datang, masukkan kode → bisnis terverifikasi

> 🎯 **Kenapa penting:** Setelah verified, BROS Wisata muncul di **Google Maps** + **Google Search "tour Medan"** dengan **rich panel** (foto, jam buka, telepon, review).

---

## ⚠️ Troubleshooting Common Issues

### Issue 1: Homepage tampil 404
**Cause:** File `_redirects` tidak ter-upload  
**Fix:** Re-upload folder pastikan `_redirects` ada di root (bukan di sub-folder)

### Issue 2: Image tidak muncul
**Cause:** Folder `assets/` tidak ter-upload, atau case-sensitive issue  
**Fix:** Cek path di browser DevTools (F12 → Network tab) → cari image yang gagal load → pastikan file ada

### Issue 3: PDF download gagal
**Cause:** Path PDF salah atau file tidak ter-upload  
**Fix:** Test direct URL: `https://broswisata.com/assets/pdf/medan_heritage_3h2m.pdf`

### Issue 4: Custom domain belum bisa diakses
**Cause:** DNS propagation belum selesai  
**Fix:** Tunggu 5-30 menit. Cek di **https://dnschecker.org** → masukkan domain Bapak/Ibu

### Issue 5: HTTPS error / "Not Secure"
**Cause:** SSL belum di-issue Cloudflare  
**Fix:** Tunggu 5-10 menit setelah connect domain. Cek di Cloudflare → SSL/TLS → set ke **"Full"**

### Issue 6: Console warning "cdn.tailwindcss.com should not be used in production"
**Cause:** Kita pakai Tailwind via CDN (intentional choice)  
**Status:** ⚠️ Warning normal, **website tetap functional**. Customer tidak akan lihat warning ini.

---

## 🎉 Selamat Deploy!

### Setelah Live, Action Items:

#### 📅 HARI INI (setelah deploy):
- [ ] Test website dari **HP & desktop**
- [ ] Test **WhatsApp button** di hero & detail pages
- [ ] Test **PDF download** di 2-3 paket
- [ ] Share URL ke 2-3 teman → minta feedback

#### 📅 MINGGU INI:
- [ ] Submit sitemap ke **Google Search Console**
- [ ] Daftar **Google Business** (Local SEO Medan)
- [ ] Update **Instagram bio** dengan link `broswisata.com`
- [ ] Update **Facebook page** dengan link
- [ ] Update **WhatsApp Business** profile dengan link

#### 📅 MINGGU 2:
- [ ] Submit URL ke **TripAdvisor for Business**
- [ ] Posting di IG dengan link website
- [ ] Hubungi 2-3 agen Malaysia → kasih link untuk B2B partnership
- [ ] Test deploy update via Claude (bikin perubahan kecil → re-deploy)

#### 📅 BULAN 1-2:
- [ ] Monitor **Google Analytics** (kalau setup)
- [ ] Review **Google Search Console** untuk keyword performance
- [ ] Collect **customer testimonial** baru
- [ ] Tambah **foto trip terbaru** (replace placeholder kalau perlu)
- [ ] Update content via UPDATE-GUIDE.md workflow

---

## 🆘 Bantuan Saat Deploy

### Kalau Stuck di Tengah Jalan:

**Option A — Chat Claude:**
```
"Bos, saya stuck di step [X]. Error message: [paste error / screenshot]"
```

**Option B — Cek Cloudflare Community:**
- https://community.cloudflare.com/

**Option C — Video Tutorial:**
- Search YouTube: "Cloudflare Pages tutorial 2026"

---

## 📝 Important Notes

### File `_redirects` — Special Cloudflare Pages Feature

File `_redirects` di root folder akan **otomatis di-recognize** oleh Cloudflare Pages. Isinya:

```
/    /bros-wisata-homepage.html    200    ← Root → homepage
/wa  https://wa.me/6281260139399   302    ← WA shortcut
... dst
```

**Tidak perlu konfigurasi tambahan** — Cloudflare baca otomatis.

### File `sitemap.xml` & `robots.txt`

Sudah ter-setup. Cloudflare akan serve di:
- `https://broswisata.com/sitemap.xml`
- `https://broswisata.com/robots.txt`

Submit ke Google Search Console → Google index lebih cepat.

### Tailwind CSS via CDN

Website pakai **CDN Tailwind**, BUKAN compiled. Trade-off:

✅ **Pro:**
- Update via Claude tetap mudah (tidak perlu build tools)
- File HTML self-contained
- Workflow AI-assisted preserved

⚠️ **Con:**
- Browser console kasih warning (developer-only, customer tidak lihat)
- Initial load slightly slower (cache after first visit OK)

**Status:** Acceptable untuk Phase 1. Kalau scale besar, bisa upgrade nanti.

---

## 🌟 Closing dari Konsultan

Bapak/Ibu Salim,

**Setelah Bapak/Ibu deploy hari ini**, BROS Wisata akan menjadi:
- ✅ **Tour operator pertama Sumut** dengan smart-tabs filter dual-segment
- ✅ **Authentic real photos** customer (bukan stock)
- ✅ **Full bilingual** ID/MY/EN dengan balance perfect
- ✅ **SEO-ready** dengan schema.org & sitemap
- ✅ **Mobile-first** responsive
- ✅ **WhatsApp-integrated** untuk conversion

**20 tahun pengalaman lapangan + AI-assisted website = competitive advantage besar.**

**Bismillah, semoga setiap visitor jadi customer & rezeki halal mengalir untuk PT BROS INTI WISATA.** 🤲

---

**Dokumen dibuat oleh:** Claude (AI consultant for BROS Wisata)  
**Tanggal:** May 2026  
**Versi:** 1.0 — Quick Deploy Guide  
**Companion:** README.md (full reference) + UPDATE-GUIDE.md (post-launch workflow)
