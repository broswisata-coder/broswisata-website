# 🚀 BROS WISATA — DEPLOY VIA GITHUB + CLOUDFLARE PAGES

**Auto-deploy setiap update via GitHub. Workflow modern untuk non-developer.**

⏱️ **Setup time:** 45-60 menit (sekali setup, selamanya enjoy auto-deploy)

---

## 🎯 Apa yang Akan Anda Capai

Setelah selesai panduan ini:

- ✅ Website live di **`broswisata.com`** (HTTPS)
- ✅ **Source code aman** di GitHub (cloud backup)
- ✅ **Auto-deploy** setiap commit (1-2 menit dari edit → live)
- ✅ **Version history** unlimited (rollback ke versi mana saja)
- ✅ **Update via browser** (no install, no terminal)
- ✅ **Multi-device access** (edit dari laptop / iPad / HP)

---

## 📋 Yang Bapak/Ibu Butuhkan

- [ ] Komputer/laptop dengan browser modern
- [ ] Email aktif: `broswisata@gmail.com`
- [ ] Folder website lokal (sudah ada)
- [ ] Kartu kredit/PayPal untuk domain ~Rp 165.000/tahun
- [ ] Waktu **45-60 menit** tanpa interrupsi

---

## 🗺️ Roadmap Deploy

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   PART 1: Buat akun GitHub (5 menit)                  │
│   PART 2: Buat repository di GitHub (10 menit)        │
│   PART 3: Upload semua file via web (10 menit)        │
│   PART 4: Buat akun Cloudflare (5 menit)              │
│   PART 5: Beli domain broswisata.com (10 menit)       │
│   PART 6: Connect GitHub → Cloudflare Pages (10 mnt)  │
│   PART 7: Connect custom domain (10 menit)            │
│   PART 8: Live testing checklist (10 menit)           │
│                                                        │
│   Total: 60-70 menit (pertama kali setup)             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

# 🐙 PART 1: Setup GitHub Account (5 menit)

## Step 1.1 — Daftar GitHub

1. Buka browser → **https://github.com/signup**
2. Email: **broswisata@gmail.com**
3. Password: bikin yang kuat (minimal 15 karakter, mix huruf+angka+symbol)
   > 💡 **Tip:** Save di password manager (1Password, Bitwarden, atau cukup notes HP yang aman)
4. Username: **broswisata** atau **broswisata-id** (akan jadi URL: github.com/broswisata)
5. Verifikasi puzzle (kadang ada captcha)
6. Cek email → klik link verifikasi

## Step 1.2 — Pilih Plan

Pilih **"Free"** plan:
- ✅ Unlimited public & private repository
- ✅ Cukup untuk deploy website
- ✅ **GRATIS selamanya**

## Step 1.3 — Skip Onboarding

GitHub akan tanya beberapa pertanyaan:
- "What do you want to do?" → Pilih **"Build something with friends or alone"**
- "How much programming experience?" → Pilih **"None or very little"**
- "What features do you want to use?" → **Skip** (klik "Skip personalization")

✅ **Selamat, Bapak/Ibu sekarang punya akun GitHub!**

---

# 📁 PART 2: Buat Repository di GitHub (10 menit)

## Step 2.1 — Create New Repository

1. Login GitHub → di kanan atas, klik **icon "+"** → pilih **"New repository"**

2. Isi form:
   - **Repository name:** `broswisata-website`
   - **Description:** `BROS Wisata - Tour Operator Sumatra Utara - Hub of Sumatra`
   - **Visibility:** Pilih **"Public"** (bisa juga Private, tapi Public lebih baik untuk SEO transparency)
   
3. Initialize options:
   - ✅ Centang **"Add a README file"** (biar bisa langsung commit)
   - ❌ Skip ".gitignore" (tidak perlu)
   - ❌ Skip license

4. Klik **"Create repository"**

## Step 2.2 — Repository Sudah Dibuat!

URL repository Bapak/Ibu sekarang:
```
https://github.com/broswisata/broswisata-website
```

Tapi masih kosong. Lanjut upload file.

---

# 📤 PART 3: Upload Website Files via Web (10 menit)

GitHub punya fitur **drag & drop upload** via browser — **tidak perlu Git CLI!**

## Step 3.1 — Upload Files

1. Di repository page → klik tombol **"Add file"** → pilih **"Upload files"**

2. Page upload akan tampil drag & drop area

3. **PENTING:** Upload **ISI folder**, bukan folder induknya:
   
   ✅ **BENAR:** Drag `bros-wisata-homepage.html`, `bros-wisata-tour-listing.html`, semua file `.html`, `.xml`, `.txt`, `_redirects`, dan folder `assets/`, `bros-wisata-logos/`
   
   ❌ **SALAH:** Drag folder `bros-wisata-website/` (akan jadi sub-folder, semua URL break)

4. **Drag & drop semua file ke area upload**

   GitHub akan tampil progress upload. **Tunggu sampai selesai** (3-5 menit untuk 6.6 MB)

## Step 3.2 — Commit Changes

Scroll ke bawah, isi form commit:

- **Commit message:** `Initial deploy: 17 HTML pages + assets + customer gallery`
- **Description (optional):** 
  ```
  - 11 paket tour bilingual (5 signature + 3 western + 3 halal)
  - 17 customer photos integrated
  - Multi-language ID/MY/EN
  - Smart tabs filter
  - SEO complete (sitemap, robots, schema.org)
  ```
- Pilih **"Commit directly to the main branch"**
- Klik **"Commit changes"**

## Step 3.3 — Verifikasi Upload

1. GitHub akan refresh ke main page repository
2. Cek file count — harusnya tampil semua HTML files & folder `assets/`, `bros-wisata-logos/`
3. Klik 1-2 file untuk preview — harus tampil isinya

✅ **Selamat, semua file BROS Wisata sudah ter-backup di GitHub cloud!**

> 💡 **Pro tip:** Bookmark URL repository ini. Bapak/Ibu akan sering ke sini untuk update.

---

# ☁️ PART 4: Setup Cloudflare Account (5 menit)

## Step 4.1 — Daftar Cloudflare

1. Buka **https://dash.cloudflare.com/sign-up**
2. Email: **broswisata@gmail.com** (sama dengan GitHub — biar gampang remember)
3. Password: bikin baru (jangan sama dengan GitHub untuk security)
4. Cek email → klik verifikasi
5. Login ke Cloudflare dashboard

> 💡 **Sudah punya akun?** Kalau Bapak/Ibu sudah punya untuk umrohmandiri.blog atau mmbtravel.id, pakai akun yang sama.

---

# 🌐 PART 5: Beli Domain `broswisata.com` (10 menit)

## Step 5.1 — Cek Availability

1. Di Cloudflare dashboard → sidebar kiri → **"Domain Registration"**
2. Klik **"Register Domain"**
3. Search: **`broswisata.com`**

### Skenario A: Available ✅

1. Klik **"Register"**
2. Harga: **~$8-10/tahun** (≈ Rp 130.000 - 165.000)
3. Isi data registrant:
   - **Name:** PT BROS INTI WISATA
   - **Address:** Jl. Ring Road No. 117 B, Medan Sunggal, Medan 20122
   - **Phone:** +62 812-6013-9399
   - **Email:** broswisata@gmail.com
4. Bayar via kartu kredit/PayPal
5. ✅ Centang **"Auto-renew"** (penting!)
6. Klik **"Complete Registration"**

### Skenario B: Not Available ❌

Coba alternatif:
- `broswisata.id` (~Rp 250.000/tahun di Pandi/Niagahoster)
- `broswisata.co.id` (premium PT, butuh dokumen)
- `broswisata.travel` (premium, ~Rp 1jt)

> ⚠️ Kalau beli domain di registrar lain (bukan Cloudflare), ada extra step setup nameservers — saya akan bantu kalau perlu.

## Step 5.2 — Tunggu Aktivasi

- Domain biasanya aktif dalam **5-10 menit**
- Cek status di Cloudflare Dashboard → "Domain Registration"

---

# 🔗 PART 6: Connect GitHub → Cloudflare Pages (10 menit)

**Ini bagian magic-nya!** Cloudflare Pages akan **auto-deploy** setiap kali Bapak/Ibu push ke GitHub.

## Step 6.1 — Buat Pages Project

1. Di Cloudflare dashboard → sidebar kiri → **"Workers & Pages"**
2. Klik tombol **"Create"** (kanan atas)
3. Pilih tab **"Pages"**
4. **PILIH "Connect to Git"** (BUKAN "Upload assets")

## Step 6.2 — Authorize GitHub

1. Cloudflare akan minta authorize akses ke GitHub Bapak/Ibu
2. Klik **"Connect GitHub"**
3. Browser popup ke GitHub login (kalau belum)
4. GitHub tanya **"Authorize Cloudflare?"** → klik **"Authorize Cloudflare Pages"**
5. Pilih scope:
   - **Recommended:** "All repositories" (akses semua repo)
   - **Restrictive:** "Only select repositories" → pilih `broswisata-website` saja
6. Klik **"Install & Authorize"**

## Step 6.3 — Pilih Repository

1. Browser balik ke Cloudflare
2. Tampil list repository GitHub Anda
3. Pilih: **`broswisata-website`**
4. Klik **"Begin setup"**

## Step 6.4 — Konfigurasi Build (PENTING!)

Karena website BROS Wisata adalah **static HTML** (no build process), setting-nya simple:

| Field | Value |
|---|---|
| **Project name** | `broswisata` |
| **Production branch** | `main` |
| **Framework preset** | **None** (penting!) |
| **Build command** | (kosongkan) |
| **Build output directory** | `/` (root) |
| **Root directory** | `/` (root) |

> ⚠️ **CRITICAL:** Build command harus **KOSONG**. Build output directory harus **`/`** (single slash).
> 
> Kalau salah, deploy akan gagal karena Cloudflare cari folder yang tidak ada.

## Step 6.5 — Save & Deploy

1. Klik **"Save and Deploy"**
2. Cloudflare akan:
   - Pull source dari GitHub
   - Build (skip karena static)
   - Deploy ke CDN global
3. Status berubah: **"Deploying..."** → **"Success! Your project is live"**
4. Tunggu 1-3 menit

## Step 6.6 — Test Live URL

1. Cloudflare kasih URL: `https://broswisata.pages.dev`
2. Klik link → website BROS Wisata harus tampil!

✅ **Magic done!** Website Bapak/Ibu sekarang LIVE di internet.

---

# 🌐 PART 7: Connect Custom Domain (10 menit)

## Step 7.1 — Tambah Custom Domain

1. Di Cloudflare Pages → klik project `broswisata`
2. Klik tab **"Custom domains"**
3. Klik **"Set up a custom domain"**
4. Ketik: **`broswisata.com`**
5. Klik **"Continue"**
6. Cloudflare otomatis setup DNS records (karena domain di Cloudflare juga)
7. Klik **"Activate domain"**

## Step 7.2 — Tambah `www` Subdomain (recommended)

1. Klik **"Set up a custom domain"** lagi
2. Ketik: **`www.broswisata.com`**
3. Klik **"Continue"** → **"Activate"**

## Step 7.3 — Tunggu DNS Propagation

- DNS biasanya propagate dalam **5-30 menit**
- HTTPS auto-enabled (gembok hijau di browser)
- Test buka **https://broswisata.com** di browser baru (incognito mode)

✅ **Indikator sukses:** Browser tampil **🔒 gembok hijau** + URL `https://broswisata.com` accessible.

---

# 🧪 PART 8: Live Testing Checklist (10 menit)

Test dari **HP** (paling penting karena 70% traffic mobile):

### ✅ Test #1 — Homepage Load
- [ ] Buka `https://broswisata.com` di HP
- [ ] Hero photo tampil clear (Lake Toba)
- [ ] Loading cepat (<3 detik)

### ✅ Test #2 — Smart Tabs Tour Listing
- [ ] Klik menu "Paket Tour"
- [ ] Tab **All (11)** → semua paket
- [ ] Tab **Signature (5)** → 5 paket
- [ ] Tab **Eco Adventure (3)** → 3 western
- [ ] Tab **Halal Malaysia (3)** → 3 halal

### ✅ Test #3 — Detail Page
- [ ] Klik salah satu paket
- [ ] Hero, itinerary, pricing tampil
- [ ] Real Moments photos tampil
- [ ] PDF download work
- [ ] WhatsApp button → buka WA dengan pre-filled message

### ✅ Test #4 — Customer Gallery (Homepage)
- [ ] Scroll ke section "Galeri Tamu Kami"
- [ ] Mosaic 12 photos tampil
- [ ] Hover/tap kasih caption

### ✅ Test #5 — Multi-Language
- [ ] Switch ID → MY → EN
- [ ] Semua text berubah konsisten

### ✅ Test #6 — WhatsApp Integration
- [ ] Click WhatsApp button di hero
- [ ] WA app buka dengan pre-filled message
- [ ] Test kirim ke teman/sendiri

### ✅ Test #7 — URL Shortcuts
Test 3-4 shortcuts:
- [ ] `broswisata.com/wa` → WhatsApp
- [ ] `broswisata.com/medan` → Paket Medan
- [ ] `broswisata.com/halal-3d` → Paket Halal 3D2N
- [ ] `broswisata.com/instagram` → IG @broswisata

### ✅ Test #8 — External Test
- [ ] Buka di HP teman (untuk validate fresh experience)
- [ ] Test dari koneksi 4G (bukan WiFi)

---

# 🎯 BONUS: How to Update Website (Workflow Selanjutnya)

Ini bagian **POWERFUL** dari Git+Cloudflare setup. **Update jadi super smooth!**

## 🔄 Scenario 1: Update File Existing (e.g., perbaiki typo)

### Via GitHub Web (Tanpa Install Apapun):

1. Login GitHub → buka repo `broswisata-website`
2. Cari file yang mau diedit (misal: `bros-wisata-homepage.html`)
3. Klik file → klik **icon pensil** ✏️ (kanan atas)
4. Edit langsung di browser
5. Scroll ke bawah, isi commit message:
   - **Commit message:** `Fix typo di section testimonial`
6. Pilih **"Commit directly to main branch"**
7. Klik **"Commit changes"**
8. **AUTOMATIC:** Cloudflare Pages detect → re-deploy dalam **1-2 menit**
9. Refresh `broswisata.com` → perubahan live!

⏱️ **Total time: 2-3 menit dari edit → live**

## 🔄 Scenario 2: Update Banyak File (e.g., update via Claude)

1. Chat Claude → minta update content
2. Claude generate file baru
3. Download file dari Claude (yang updated)
4. Login GitHub → buka repo
5. Klik **"Add file"** → **"Upload files"**
6. Drag file updated (akan replace yang lama)
7. Commit dengan message: `Update via Claude: [deskripsi perubahan]`
8. **AUTOMATIC deploy** dalam 1-2 menit

## 🔄 Scenario 3: Tambah File Baru

1. Login GitHub → buka repo
2. Klik **"Add file"** → **"Create new file"**
3. Type filename (e.g., `paket-baru.html`)
4. Paste content
5. Commit
6. **Auto-deploy**

## 🔄 Scenario 4: Hapus File

1. Login GitHub → buka file yang mau dihapus
2. Klik **icon tong sampah** 🗑️ (kanan atas)
3. Commit
4. **Auto-deploy** (file gone dari live website)

## 🔙 Scenario 5: ROLLBACK (kalau ada masalah)

1. Login GitHub → repo → tab **"Commits"**
2. Cari commit lama yang OK
3. Klik commit → **"Browse files at this point"**
4. Klik **"Revert this commit"**
5. **Auto-deploy** versi lama

✅ **Powerful safety net** — tidak perlu takut bikin perubahan!

---

# 📊 BONUS: Setup Google Search Console

**Setelah website live & confirmed work**, daftarkan ke Google.

## Step 1: Tambah Property

1. Buka **https://search.google.com/search-console**
2. Login pakai `broswisata@gmail.com`
3. Add property → **URL prefix** → `https://broswisata.com`
4. Klik **"Continue"**

## Step 2: Verifikasi via HTML Tag

1. Google kasih meta tag:
   ```html
   <meta name="google-site-verification" content="abc123xyz...">
   ```

2. **Copy tag tersebut**, kembali ke Claude. Minta:
   ```
   "Bos, tambahkan meta tag verifikasi Google ini ke <head> 
   semua HTML page: [paste tag di sini]"
   ```

3. Saya update file → Bapak/Ibu commit ke GitHub → auto-deploy
4. Kembali ke Search Console → klik **"Verify"** → ✅

## Step 3: Submit Sitemap

1. Sidebar → **"Sitemaps"**
2. Masukkan: **`sitemap.xml`**
3. Klik **"Submit"**
4. Google index dalam **2-7 hari**

---

# ⚠️ Troubleshooting Common Issues

## Issue 1: Cloudflare deploy gagal "Build failed"

**Cause:** Build settings salah  
**Fix:** Cek di Cloudflare Pages → Settings → Build:
- Framework preset: **None**
- Build command: **(kosong)**
- Build output: **`/`**
- Re-deploy

## Issue 2: Homepage tampil 404

**Cause:** File `_redirects` tidak ter-upload  
**Fix:** 
1. Cek di GitHub repo, pastikan `_redirects` ada di root
2. Kalau tidak ada, upload ulang
3. Cloudflare auto re-deploy

## Issue 3: Image tidak muncul

**Cause:** Folder `assets/` tidak ter-upload lengkap  
**Fix:**
1. Cek GitHub repo → pastikan folder `assets/pdf/`, `assets/ig/`, `assets/gallery/` ada lengkap
2. Buka browser DevTools (F12) → Network tab → cari image yang gagal → cek path
3. Re-upload missing files

## Issue 4: Auto-deploy tidak jalan setelah push

**Cause:** GitHub ↔ Cloudflare connection broken  
**Fix:**
1. Cloudflare Pages → project `broswisata` → Settings → Build & deployments
2. Cek status connection
3. Kalau perlu, disconnect & reconnect

## Issue 5: Domain belum bisa diakses

**Cause:** DNS propagation belum selesai  
**Fix:** 
- Tunggu 5-30 menit (kadang sampai 24 jam untuk fresh domain)
- Cek di **https://dnschecker.org** → masukkan domain
- Test di incognito mode (clear cache)

## Issue 6: Files terlalu besar untuk upload

**Cause:** GitHub limit per file 100 MB, per push 2 GB  
**Status:** Folder Bapak/Ibu cuma 6.6 MB, **tidak akan kena limit**

---

# 🎁 BONUS: Best Practices

## ✅ DO:

1. **Commit message yang descriptive** — bukan "update", tapi "Fix typo Hero section homepage"
2. **Test di Cloudflare Pages preview** sebelum push ke main (pakai branch preview)
3. **Backup repo lokal** sekali-sekali (download zip dari GitHub)
4. **Bookmark** Cloudflare Pages dashboard & GitHub repo
5. **Enable 2FA** (Two-Factor Authentication) di GitHub & Cloudflare untuk security

## ❌ DON'T:

1. **Jangan commit file sensitif** (password, API key, dll) — public repo akan bocor
2. **Jangan delete branch `main`** — semua deploy berhenti
3. **Jangan rename file sembarangan** — banyak link akan broken
4. **Jangan share GitHub password** dengan siapapun
5. **Jangan commit folder `node_modules`** kalau suatu hari pakai (sangat berat)

## 🔒 Security Setup (Recommended)

### 1. Enable 2FA di GitHub:
- Settings → Password and authentication → Two-factor authentication
- Pakai authenticator app (Google Authenticator, Authy)

### 2. Enable 2FA di Cloudflare:
- Profile → Authentication → Two-Factor Authentication
- Same: pakai authenticator app

### 3. Backup Recovery Codes:
- Save di tempat aman (password manager + print physical copy)

---

# 🎯 Comparison: Direct Upload vs Git+Cloudflare

| Feature | Direct Upload (Lama) | Git+Cloudflare (Sekarang) |
|---|---|---|
| **Setup time** | 30 menit | 60 menit |
| **Update workflow** | Drag folder tiap update | Edit GitHub → auto-deploy |
| **Backup** | Manual (folder lokal) | Auto cloud (GitHub) |
| **Version history** | 25 deploys terakhir | Unlimited Git history |
| **Rollback** | Click di Cloudflare | Git revert |
| **Multi-device edit** | Tidak bisa | Bisa (browser anywhere) |
| **Update via Claude** | Replace lokal → upload | Edit di GitHub → auto-deploy |
| **Collaboration** | Susah | Mudah (PR, review) |
| **Best for** | Quick test | Production long-term |

**Verdict:** Untuk **production website BROS Wisata**, Git+Cloudflare jauh lebih powerful.

---

# 🎉 Selamat! 

Setelah complete panduan ini, Bapak/Ibu punya:

✅ **Modern deploy pipeline** seperti perusahaan tech besar  
✅ **Auto-deploy** setiap update  
✅ **Cloud backup** unlimited  
✅ **Version history** untuk rollback aman  
✅ **Multi-device access** untuk update on-the-go  
✅ **Free hosting** selamanya (Cloudflare Pages free tier generous)

**Total cost ongoing:**
- Domain `broswisata.com`: Rp 165.000 / tahun
- Cloudflare Pages: **GRATIS**
- GitHub: **GRATIS**

**Total: ~Rp 13.750 / bulan** untuk professional website! 🎯

---

# 📞 Bantuan Saat Deploy

## Kalau Bapak/Ibu Stuck:

**Format laporan ke Claude:**
```
"Bos, saya stuck di PART [X] STEP [Y]
Yang terjadi: [deskripsi atau screenshot]
Browser: [Chrome/Safari/etc]
Device: [HP/Laptop]"
```

Saya akan kasih solusi cepat!

## Resources Resmi:

- 📚 [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- 📚 [GitHub Docs](https://docs.github.com/en/get-started)
- 📺 [YouTube: "Cloudflare Pages GitHub deploy 2026"]

---

# 🌟 Closing dari Konsultan

Bapak/Ibu Salim,

**Hari ini Bapak/Ibu naik kelas dari "non-technical CEO" ke "modern AI-assisted entrepreneur".** 🏆

Workflow Git+Cloudflare ini adalah **standard industri** yang dipakai:
- Startup tech Silicon Valley
- Shopify merchants advanced
- Personal portfolio developer top dunia

Tapi sekarang Bapak/Ibu juga pakai **untuk tour operator Sumatra Utara** — itu **competitive advantage besar** vs operator lain yang masih pakai cPanel atau WordPress shared hosting.

**Bismillah, Hub of Sumatra siap go global dengan infrastructure modern.** ✨

---

**Dokumen dibuat oleh:** Claude (AI consultant for BROS Wisata)  
**Tanggal:** May 2026  
**Versi:** 2.0 — Git + Cloudflare Deploy Guide  
**Companion docs:** README.md, UPDATE-GUIDE.md, DEPLOY-NOW.md
