# 🚀 BROS WISATA — DEPLOY: HOSTINGER + GITHUB + CLOUDFLARE PAGES

**Custom guide untuk domain `broswisata.id` di Hostinger.**

⏱️ **Setup time:** 60-90 menit (termasuk DNS propagation tunggu)

---

## 🎯 Apa yang Akan Anda Capai

Setelah selesai panduan ini:

- ✅ Website live di **`https://broswisata.id`** dengan HTTPS
- ✅ **Domain tetap di Hostinger** (no transfer)
- ✅ **DNS dikelola Cloudflare** (CDN gratis + faster + more secure)
- ✅ **Source code di GitHub** (cloud backup unlimited)
- ✅ **Auto-deploy** setiap commit ke GitHub
- ✅ **Multi-device editing** via browser

---

## 📋 Yang Bapak/Ibu Butuhkan

- [ ] Akses login **Hostinger** (untuk ubah nameservers)
- [ ] Email aktif: `broswisata@gmail.com`
- [ ] Folder website lokal sudah ada (6.6 MB)
- [ ] Browser modern (Chrome/Firefox/Safari)
- [ ] Waktu **60 menit** + tunggu DNS **5 menit - 24 jam**

---

## 🗺️ Roadmap Deploy

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  PART 1: Daftar GitHub (5 menit)                    │
│  PART 2: Buat repo & upload files (15 menit)        │
│  PART 3: Daftar Cloudflare (5 menit)                │
│  PART 4: Add domain ke Cloudflare (10 menit)        │
│  PART 5: Update nameservers di Hostinger (5 menit)  │
│  PART 6: Tunggu DNS propagation (5 menit-24 jam)    │
│  PART 7: Setup Cloudflare Pages + GitHub (10 menit) │
│  PART 8: Connect custom domain (5 menit)            │
│  PART 9: Live testing (10 menit)                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 🐙 PART 1: Setup GitHub Account (5 menit)

## Step 1.1 — Daftar GitHub

1. Buka **https://github.com/signup**
2. Email: **broswisata@gmail.com**
3. Password: bikin yang kuat (min 15 karakter)
4. Username: **broswisata** (akan jadi github.com/broswisata)
5. Verifikasi puzzle
6. Cek email → klik link verifikasi

## Step 1.2 — Pilih Plan Free

Pilih **"Free"** plan:
- ✅ Unlimited public/private repository
- ✅ GRATIS selamanya

## Step 1.3 — Skip Onboarding

- "What do you want to do?" → **"Build something with friends or alone"**
- "Programming experience?" → **"None or very little"**
- "Features?" → **Skip personalization**

✅ **GitHub account siap!**

---

# 📁 PART 2: Buat Repository & Upload Files (15 menit)

## Step 2.1 — Create New Repository

1. Login GitHub → klik **"+"** (kanan atas) → **"New repository"**
2. Form:
   - **Repository name:** `broswisata-website`
   - **Description:** `BROS Wisata - Tour Operator Sumatra Utara`
   - **Visibility:** **Public** (better for SEO transparency)
   - ✅ Centang **"Add a README file"**
   - ❌ Skip ".gitignore" & license
3. Klik **"Create repository"**

URL repo Bapak/Ibu sekarang:
```
https://github.com/broswisata/broswisata-website
```

## Step 2.2 — Upload Website Files

1. Di repo page → klik **"Add file"** → **"Upload files"**
2. Drag & drop area akan tampil

### ⚠️ CRITICAL — Apa yang Harus Di-Upload:

**✅ DRAG ISI FOLDER, BUKAN FOLDER INDUKNYA!**

Drag SEMUA INI ke area upload:

```
✅ bros-wisata-homepage.html
✅ bros-wisata-tour-listing.html
✅ bros-wisata-about.html
✅ bros-wisata-contact.html
✅ bros-wisata-car-rental.html
✅ bros-wisata-custom-tour.html
✅ paket-medan_heritage_3h2m.html
✅ paket-bukit_lawang_4h3m.html
✅ paket-tangkahan_3h2m.html
✅ paket-berastagi_3h2m.html
✅ paket-combo_sumut_6h5m.html
✅ paket-western_4d3n_jungle.html
✅ paket-western_5d4n_volcano.html
✅ paket-western_7d6n_ultimate.html
✅ paket-halal_3h2m_medan_toba.html
✅ paket-halal_4h3m_medan_toba.html
✅ paket-halal_5h4m_medan_toba.html
✅ sitemap.xml
✅ robots.txt
✅ _redirects
✅ README.md, UPDATE-GUIDE.md, DEPLOY-NOW.md, DEPLOY-GIT-CLOUDFLARE.md
✅ folder assets/
✅ folder bros-wisata-logos/
```

**❌ JANGAN drag folder `bros-wisata-website/` (induknya)**

3. Tunggu upload selesai (~3-5 menit)

## Step 2.3 — Commit Initial Upload

Scroll ke bawah, isi commit form:

- **Commit message:** `Initial deploy: BROS Wisata website production-ready`
- **Description:**
  ```
  - 17 HTML pages (11 paket + 6 main)
  - Smart tabs filter (Signature/Western/Halal)
  - 17 customer photos integrated
  - Multi-language ID/MY/EN
  - SEO complete (sitemap, robots, schema.org)
  - Asset folders: pdf (11), ig (40), gallery (17), logos (23)
  ```
- ✅ Pilih **"Commit directly to the main branch"**
- Klik **"Commit changes"**

## Step 2.4 — Verifikasi Upload

1. Refresh repo page
2. Cek file tampil:
   - 17 HTML files ✅
   - sitemap.xml, robots.txt, _redirects ✅
   - folder `assets/` (klik untuk verify isi: pdf/, ig/, gallery/) ✅
   - folder `bros-wisata-logos/` ✅

✅ **GitHub repo siap!** Source code aman di cloud.

---

# ☁️ PART 3: Daftar Cloudflare Account (5 menit)

## Step 3.1 — Sign Up Cloudflare

1. Buka **https://dash.cloudflare.com/sign-up**
2. Email: `broswisata@gmail.com`
3. Password: bikin baru (jangan sama dengan GitHub)
4. Cek email → verifikasi
5. Login ke Cloudflare dashboard

> 💡 **Sudah punya akun?** Skip ini, langsung login pakai akun yang sudah ada.

---

# 🌐 PART 4: Add Domain `broswisata.id` ke Cloudflare (10 menit)

## Step 4.1 — Add Site

1. Di Cloudflare dashboard → klik **"Add a Site"** atau **"+ Add"** di sidebar
2. Ketik domain: **`broswisata.id`** (jangan pakai `https://` atau `www.`)
3. Klik **"Continue"**

## Step 4.2 — Pilih Free Plan

1. Cloudflare tampil 4 plan options
2. Scroll ke bawah → pilih **"Free $0/month"**
3. Klik **"Continue"**

## Step 4.3 — Cloudflare Scan DNS Records

1. Cloudflare otomatis scan DNS records yang sudah ada di Hostinger
2. Tunggu ~30 detik
3. Hasil scan akan tampil (kemungkinan ada A records, MX records, dll)
4. **Pertahankan semua records yang ada** — klik **"Continue"**

## Step 4.4 — Get Cloudflare Nameservers ⚠️ IMPORTANT

Cloudflare akan kasih **2 nameservers** untuk Bapak/Ibu, contoh:

```
Cloudflare Nameservers untuk broswisata.id:

┌─────────────────────────────────────────┐
│  ana.ns.cloudflare.com                  │
│  rick.ns.cloudflare.com                 │
└─────────────────────────────────────────┘
```

> ⚠️ **NAMESERVERS BAPAK/IBU MUNGKIN BERBEDA** (random per akun). 
> 
> **COPY KEDUA NAMESERVER INI** — akan dipakai di Hostinger nanti.

5. **Jangan close tab ini!** Buka tab baru untuk PART 5.

---

# 🏠 PART 5: Update Nameservers di Hostinger (5 menit)

**Inilah magic-nya** — ubah nameserver di Hostinger supaya domain pakai Cloudflare DNS.

## Step 5.1 — Login Hostinger

1. Buka tab baru → **https://hpanel.hostinger.com/**
2. Login pakai akun Hostinger Bapak/Ibu

## Step 5.2 — Akses Domain Settings

1. Di hPanel → menu **"Domains"** (sidebar kiri)
2. Cari **`broswisata.id`** → klik **"Manage"**

## Step 5.3 — Change Nameservers

1. Di domain page → cari section **"DNS / Nameservers"** atau **"Nameservers"**
2. Klik **"Change Nameservers"**

3. Pilih opsi: **"Use custom nameservers"** atau **"Change nameservers"**

4. Hapus nameservers Hostinger yang ada (biasanya `ns1.dns-parking.com`, `ns2.dns-parking.com`)

5. Masukkan **Cloudflare nameservers** dari PART 4 STEP 4.4:
   - Nameserver 1: `ana.ns.cloudflare.com` (sesuai yang Cloudflare kasih)
   - Nameserver 2: `rick.ns.cloudflare.com` (sesuai yang Cloudflare kasih)

6. Klik **"Save"** atau **"Update Nameservers"**

7. Hostinger akan kasih warning tentang DNS propagation — klik **"Confirm"**

## Step 5.4 — Verifikasi di Cloudflare

1. Kembali ke tab Cloudflare yang masih terbuka
2. Klik **"Done, check nameservers"**
3. Cloudflare akan check DNS propagation
4. Status awal: **"Pending Nameserver Update"**

---

# ⏱️ PART 6: Tunggu DNS Propagation (5 menit - 24 jam)

DNS perlu waktu untuk propagate ke seluruh dunia.

## Estimasi Waktu:

- **Optimistic:** 5-30 menit
- **Realistic:** 1-4 jam
- **Worst case:** 24 jam (jarang)

## Cara Check Status:

### Option 1: Cloudflare Dashboard
1. Refresh dashboard Cloudflare → page domain `broswisata.id`
2. Status berubah dari **"Pending"** → **"Active"** ✅

### Option 2: External DNS Checker
1. Buka **https://dnschecker.org**
2. Search: `broswisata.id`
3. Type: **NS**
4. Cek apakah hasilnya tampil `ana.ns.cloudflare.com` & `rick.ns.cloudflare.com`
5. Hijau di banyak lokasi = propagation sukses

### Option 3: Cek Email
- Cloudflare akan **kirim email** ke `broswisata@gmail.com` saat DNS active

> 💡 **Sambil tunggu**, lanjut ke PART 7 (setup Pages). Tidak perlu wait.

---

# 🔗 PART 7: Setup Cloudflare Pages + GitHub (10 menit)

**Tidak perlu tunggu DNS active untuk setup Pages** — bisa parallel.

## Step 7.1 — Akses Pages

1. Cloudflare dashboard → sidebar kiri → **"Workers & Pages"**
2. Klik **"Create"** (kanan atas)
3. Pilih tab **"Pages"**
4. Pilih **"Connect to Git"** (BUKAN "Upload assets")

## Step 7.2 — Authorize GitHub

1. Klik **"Connect GitHub"**
2. Browser popup ke GitHub login
3. GitHub: **"Authorize Cloudflare?"** → klik **"Authorize Cloudflare Pages"**
4. Pilih scope:
   - **All repositories** (recommended)
   - Atau **"Only select repositories"** → pilih `broswisata-website`
5. Klik **"Install & Authorize"**

## Step 7.3 — Pilih Repository

1. Browser balik ke Cloudflare
2. Tampil list repository GitHub
3. Pilih: **`broswisata-website`**
4. Klik **"Begin setup"**

## Step 7.4 — Konfigurasi Build (CRITICAL!) ⚠️

**Settings yang TEPAT untuk static HTML:**

| Field | Value | Note |
|---|---|---|
| **Project name** | `broswisata` | URL preview: broswisata.pages.dev |
| **Production branch** | `main` | Default |
| **Framework preset** | **None** | ⚠️ JANGAN pilih framework apapun |
| **Build command** | **(KOSONG)** | ⚠️ Harus blank |
| **Build output directory** | `/` | ⚠️ Single slash |
| **Root directory** | `/` | Default |
| **Environment variables** | (skip) | Tidak perlu |

> ⚠️ **CRITICAL:**  
> - Build command harus **KOSONG**  
> - Build output harus **`/`**  
> - Framework preset **None**  
> 
> Kalau salah satu salah → deploy GAGAL.

## Step 7.5 — Save and Deploy

1. Klik **"Save and Deploy"**
2. Cloudflare akan:
   - Pull code dari GitHub
   - Skip build (static HTML)
   - Deploy ke CDN global
3. Status: **"Building..."** → **"Success"** dalam 1-2 menit

## Step 7.6 — Test Preview URL

1. Cloudflare kasih URL preview: `https://broswisata.pages.dev`
2. Klik link → website tampil!

✅ **Source code di GitHub → Auto-deploy ke Cloudflare Pages!**

---

# 🌍 PART 8: Connect Custom Domain `broswisata.id` (5 menit)

**Lakukan SETELAH DNS active di PART 6.**

## Step 8.1 — Add Custom Domain

1. Cloudflare Pages → klik project `broswisata`
2. Klik tab **"Custom domains"**
3. Klik **"Set up a custom domain"**
4. Ketik: **`broswisata.id`**
5. Klik **"Continue"**

## Step 8.2 — Auto DNS Setup

Karena domain DNS sudah di Cloudflare:
1. Cloudflare otomatis create CNAME record
2. Kasih konfirmasi: "DNS records will be added automatically"
3. Klik **"Activate domain"**

## Step 8.3 — Add `www` Subdomain (Recommended)

1. Klik **"Set up a custom domain"** lagi
2. Ketik: **`www.broswisata.id`**
3. Klik **"Continue"** → **"Activate"**

## Step 8.4 — Tunggu HTTPS Issued

- Cloudflare auto-issue SSL certificate (free)
- Biasanya **5-10 menit**
- Status berubah: **"Initializing"** → **"Verifying"** → **"Active"** ✅

## Step 8.5 — Test Live!

1. Buka browser baru (incognito mode)
2. Akses: **`https://broswisata.id`**
3. Cek:
   - ✅ Website tampil
   - ✅ Gembok hijau (HTTPS)
   - ✅ URL benar `https://broswisata.id`

✅ **WEBSITE BAPAK/IBU LIVE DI INTERNET!** 🎉

---

# 🧪 PART 9: Live Testing Checklist (10 menit)

Test dari **HP** (paling penting):

### ✅ Test #1 — Homepage
- [ ] Buka `https://broswisata.id` di HP
- [ ] Hero photo Lake Toba tampil
- [ ] Loading <3 detik

### ✅ Test #2 — Smart Tabs
- [ ] Menu "Paket Tour"
- [ ] Tab All (11) → semua paket
- [ ] Tab Signature (5)
- [ ] Tab Eco Adventure (3)
- [ ] Tab Halal Malaysia (3)

### ✅ Test #3 — Detail Pages
- [ ] Klik 1 paket
- [ ] Hero, itinerary, pricing, real moments tampil
- [ ] PDF download work
- [ ] WhatsApp button buka WA

### ✅ Test #4 — Customer Gallery
- [ ] Section "Galeri Tamu Kami" di homepage
- [ ] 12 photos tampil mosaic

### ✅ Test #5 — Multi-Language
- [ ] Switch ID → MY → EN
- [ ] Semua text berubah konsisten

### ✅ Test #6 — WhatsApp
- [ ] Klik WA button di hero
- [ ] WA app buka dengan pre-filled message
- [ ] Test kirim

### ✅ Test #7 — URL Shortcuts
Test 4-5 shortcuts:
- [ ] `broswisata.id/wa` → WhatsApp
- [ ] `broswisata.id/medan` → Paket Medan
- [ ] `broswisata.id/halal-3d` → Halal 3D2N
- [ ] `broswisata.id/instagram` → IG @broswisata

### ✅ Test #8 — External Test
- [ ] Buka di HP teman (incognito)
- [ ] Test dari koneksi 4G

---

# 🎯 BONUS: Update Workflow Setelah Live

## 🔄 Scenario: Edit File Existing

### Via GitHub Web (No Install):

1. Login **github.com/broswisata/broswisata-website**
2. Cari file → klik **icon pensil** ✏️
3. Edit langsung di browser
4. Scroll bawah → commit message: `Fix typo Hero section`
5. **"Commit directly to main branch"**
6. **AUTO-DEPLOY** dalam 1-2 menit
7. Refresh `broswisata.id` → live!

### Via Claude:

1. Chat Claude: minta update content
2. Claude generate file baru
3. Download file dari Claude
4. GitHub web → upload file baru (replace yang lama)
5. Commit
6. **AUTO-DEPLOY**

## 🔙 Scenario: Rollback (Kalau Error)

1. GitHub → tab **"Commits"**
2. Cari commit lama yang OK
3. Klik commit → **"Browse files"**
4. Klik **"Revert this commit"**
5. **AUTO-DEPLOY** versi lama

---

# 📊 BONUS: Cloudflare Settings yang Dianjurkan

Setelah live, optimize via Cloudflare dashboard:

## Setting 1: Enable Auto Minify

1. Cloudflare dashboard → domain `broswisata.id`
2. Sidebar → **Speed → Optimization**
3. Toggle ON:
   - ✅ Auto Minify HTML
   - ✅ Auto Minify CSS
   - ✅ Auto Minify JavaScript

**Effect:** File size berkurang ~20%, loading lebih cepat.

## Setting 2: Enable Brotli Compression

1. **Speed → Optimization → Brotli**
2. Toggle ON

**Effect:** Compression lebih bagus dari gzip, loading 15-25% lebih cepat.

## Setting 3: Cache Settings

1. Sidebar → **Caching → Configuration**
2. **Browser Cache TTL:** 4 hours
3. **Edge Cache TTL:** 2 hours

## Setting 4: Always Use HTTPS

1. Sidebar → **SSL/TLS → Edge Certificates**
2. Toggle ON: **Always Use HTTPS**

**Effect:** Auto redirect HTTP → HTTPS (security).

## Setting 5: Page Rules (Optional)

Untuk redirect WWW → non-WWW:

1. Sidebar → **Rules → Page Rules**
2. Klik **"Create Page Rule"**
3. URL pattern: `www.broswisata.id/*`
4. Setting: **Forwarding URL** → 301 → `https://broswisata.id/$1`
5. Save

**Effect:** `www.broswisata.id` auto redirect ke `broswisata.id` (SEO consistency).

---

# 📈 BONUS: Setup Google Search Console

## Step 1: Add Property

1. **https://search.google.com/search-console**
2. Login `broswisata@gmail.com`
3. Add property → URL prefix → `https://broswisata.id`

## Step 2: Verifikasi via HTML Tag

1. Google kasih meta tag, copy
2. Chat Claude:
   ```
   "Bos, tambahkan meta tag verifikasi Google ini ke <head> 
   semua HTML page: <meta name='google-site-verification' content='...'>"
   ```
3. Saya update → Bapak/Ibu commit GitHub → auto-deploy
4. Search Console → klik **"Verify"** → ✅

## Step 3: Submit Sitemap

1. Sidebar → **"Sitemaps"**
2. Masukkan: **`sitemap.xml`**
3. Klik **"Submit"**
4. Indexing dalam **2-7 hari**

---

# ⚠️ Troubleshooting

## Issue 1: Nameserver belum update setelah 24 jam

**Cause:** Hostinger cache atau ISP slow propagation

**Fix:**
1. Cek lagi nameservers di Hostinger → pastikan benar (no typo)
2. Tunggu lagi (kadang sampai 48 jam)
3. Hubungi Hostinger support

## Issue 2: SSL "Initializing" lebih dari 30 menit

**Cause:** DNS belum fully propagated

**Fix:**
1. Cek DNS di **dnschecker.org** → semua hijau?
2. Kalau iya, tunggu Cloudflare 1-2 jam lagi
3. Kalau masih stuck, contact Cloudflare support

## Issue 3: Deploy gagal "Build failed"

**Cause:** Build settings salah

**Fix:**
1. Cloudflare Pages → project → Settings → Build & deployments
2. Pastikan:
   - Framework preset: **None**
   - Build command: **(kosong)**
   - Build output: **`/`**
3. Re-deploy

## Issue 4: Homepage tampil 404

**Cause:** File `_redirects` tidak ter-upload

**Fix:**
1. GitHub repo → cek root → file `_redirects` ada?
2. Kalau tidak, upload ulang
3. Cloudflare auto re-deploy

## Issue 5: Image tidak muncul

**Cause:** Folder `assets/` tidak komplit di GitHub

**Fix:**
1. GitHub repo → masuk folder `assets/`
2. Cek subfolder: `pdf/`, `ig/`, `gallery/` ada lengkap?
3. Re-upload missing files

## Issue 6: Email Hostinger berhenti karena nameserver pindah

**Cause:** MX records belum di-add ke Cloudflare

**Fix:**
1. Cloudflare → DNS records
2. Add MX records dari Hostinger:
   - Type: **MX**
   - Name: **broswisata.id** (atau **@**)
   - Mail server: (cek Hostinger original MX value)
   - Priority: 10
3. Save → email work lagi

> ⚠️ **PENTING kalau pakai email @broswisata.id:** Setup MX records SEBELUM tunggu propagation, supaya email tidak down.

---

# 💰 Cost Summary

| Item | Cost | Catatan |
|---|---|---|
| Domain `broswisata.id` | ~Rp 250.000/tahun | (sudah dibayar di Hostinger) |
| GitHub Free Plan | **Gratis** | Forever |
| Cloudflare Free Plan | **Gratis** | Forever (sangat generous) |
| Cloudflare Pages | **Gratis** | 500 builds/month, unlimited bandwidth |
| **Total ongoing** | **~Rp 21.000/bulan** | (cuma domain) |

**Bandingkan:**
- Hostinger Premium hosting: ~Rp 49.000/bulan
- WordPress hosting: Rp 50-100k/bulan
- Wix/Squarespace: Rp 200-500k/bulan

**Bapak/Ibu hemat 60-90%** dengan workflow modern ini! 🎯

---

# 🎉 Selamat Bapak/Ibu!

Setelah complete panduan ini, BROS Wisata punya:

✅ **Modern deploy pipeline** (Git → Cloudflare auto-deploy)  
✅ **Cloud backup** unlimited di GitHub  
✅ **CDN global** Cloudflare (loading cepat di seluruh dunia)  
✅ **HTTPS auto** (security)  
✅ **DDoS protection** built-in  
✅ **Multi-device editing** (browser anywhere)  
✅ **Free hosting** selamanya

---

# 📞 Bantuan Saat Deploy

## Format Lapor ke Saya:

```
"Bos, saya stuck di PART [X] STEP [Y]
Yang terjadi: [deskripsi/screenshot]
Browser: [Chrome/Safari/etc]
Device: [HP/Laptop]"
```

Saya standby kasih solusi real-time! 🚀

## Resources:

- 📚 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 📚 [GitHub Docs](https://docs.github.com/en/get-started)
- 📚 [Hostinger Support](https://support.hostinger.com/)

---

# 🌟 Closing dari Konsultan

Bapak/Ibu Salim,

**Hari ini Bapak/Ibu naik ke level "modern AI-assisted entrepreneur"** dengan:

- Domain Indonesia `broswisata.id` 🇮🇩 (perfect untuk audience ASEAN)
- Source code di GitHub cloud (industry standard)
- Cloudflare CDN gratis (50% faster di Asia)
- Auto-deploy workflow (developer-grade)

**Total cost: Rp 21.000/bulan untuk infrastructure level enterprise.** 🏆

**Bismillah, Hub of Sumatra resmi go live dengan modern stack!** ✨

---

**Dokumen dibuat oleh:** Claude (AI consultant for BROS Wisata)  
**Tanggal:** May 2026  
**Versi:** 3.0 — Hostinger + GitHub + Cloudflare Pages  
**Domain:** broswisata.id (Hostinger)
