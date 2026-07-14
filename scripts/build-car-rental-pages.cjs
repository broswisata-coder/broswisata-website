const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const vehicles = [
  {
    id: "avanza",
    name: "Toyota Avanza",
    category: "family",
    image: "/assets/cars/toyota-avanza.webp",
    leadCode: "CAR-AVANZA",
  },
  {
    id: "innova",
    name: "Toyota Innova Reborn",
    category: "premium",
    image: "/assets/cars/toyota-innova-reborn.webp",
    leadCode: "CAR-INNOVA",
  },
  {
    id: "hiace",
    name: "Toyota Hiace Commuter",
    category: "group",
    image: "/assets/cars/toyota-hiace-commuter.webp",
    leadCode: "CAR-HIACE",
  },
  {
    id: "brio",
    name: "Honda Brio",
    category: "family",
    image: "/assets/cars/honda-brio.webp",
    leadCode: "CAR-BRIO",
  },
  {
    id: "calya",
    name: "Toyota Calya",
    category: "family",
    image: "/assets/cars/toyota-calya.webp",
    leadCode: "CAR-CALYA",
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    category: "premium",
    image: "/assets/cars/toyota-fortuner.webp",
    leadCode: "CAR-FORTUNER",
  },
  {
    id: "alphard",
    name: "Toyota Alphard",
    category: "premium",
    image: "/assets/cars/toyota-alphard.webp",
    leadCode: "CAR-ALPHARD",
  },
];

const copy = {
  id: {
    file: "id/bros-wisata-car-rental.html",
    heroEyebrow: "Rental mobil dengan supir di Medan",
    heroTitle: "Armada yang tepat.<br/><em>Rute yang masuk akal.</em>",
    heroCopy:
      "Pilih kendaraan berdasarkan jumlah tamu, bagasi, dan rute—bukan hanya jumlah kursi. BROS membantu mencocokkan armada untuk penjemputan Kualanamu, perjalanan harian, dan rute multi-hari di Sumatra Utara.",
    viewFleet: "Lihat armada",
    checkAvailability: "Cek ketersediaan",
    trust: ["Dengan supir", "Quote tertulis", "Rute disesuaikan"],
    visualHead: "Contoh model resmi",
    visualTag: "Comfort MPV",
    heroImageAlt: "Ilustrasi resmi Toyota Innova",
    prompt: ["Tanggal perjalanan", "Jumlah tamu", "Waktu penerbangan", "Bagasi & tujuan"],
    fleetEyebrow: "Pilihan armada",
    fleetTitle: "Pilih sesuai kebutuhan perjalanan.",
    fleetIntro:
      "Gunakan filter untuk mempersempit pilihan. Seluruh layanan pada halaman ini menggunakan supir; tipe dan unit aktual akan dikonfirmasi sebelum pembayaran.",
    filterLabel: "Filter pilihan armada",
    filters: {
      all: "Semua armada",
      family: "Kota & keluarga",
      premium: "Nyaman & premium",
      group: "Rombongan",
    },
    countTemplate: "Menampilkan {count} pilihan kendaraan.",
    imageAltPrefix: "Ilustrasi resmi model",
    driverIncluded: "Supir termasuk",
    recommendedLabel: "Tamu nyaman",
    bestForLabel: "Ideal untuk",
    serviceLabel: "Layanan dengan supir",
    vehicleCta: "Pilih unit ini",
    leadCodeLabel: "Kode lead",
    vehicleMessage(name, code) {
      return `[${code}] Halo BROS Wisata, saya tertarik dengan ${name} untuk sewa mobil + supir. Tanggal: __ | Jemput: __ | Tujuan: __ | Jumlah tamu: __ | Bagasi: __. Mohon cek ketersediaan dan tarif final.`;
    },
    genericMessage:
      "[CAR-PAGE] Halo BROS Wisata, saya membutuhkan mobil + supir. Tanggal: __ | Jemput: __ | Tujuan: __ | Jumlah tamu: __ | Bagasi: __. Mohon rekomendasi armada dan tarif final.",
    vehicleDetails: {
      avanza: {
        type: "Compact MPV",
        intro: "Pilihan praktis untuk perjalanan kota dan keluarga kecil dengan bagasi ringan.",
        recommended: "1–5 tamu",
        best: "Medan & transfer bandara",
      },
      innova: {
        type: "Comfort MPV",
        intro: "Kabin lebih nyaman untuk perjalanan antarkota dan rute beberapa hari.",
        recommended: "1–5 tamu",
        best: "Overland Sumatra Utara",
      },
      hiace: {
        type: "Group Minibus",
        intro: "Menjaga keluarga besar atau rombongan tetap bepergian dalam satu kendaraan.",
        recommended: "8–12 tamu",
        best: "Rombongan & tour grup",
      },
      brio: {
        type: "City Car",
        intro: "Ringkas untuk tamu solo atau pasangan yang beraktivitas di sekitar Medan.",
        recommended: "1–3 tamu",
        best: "Kota & bagasi ringan",
      },
      calya: {
        type: "Family MPV",
        intro: "Pilihan bernilai baik untuk keluarga kecil dan perjalanan dengan tempo santai.",
        recommended: "1–5 tamu",
        best: "Keluarga & rute kota",
      },
      fortuner: {
        type: "Premium SUV",
        intro: "Posisi duduk tinggi dan kabin premium untuk perjalanan jarak jauh.",
        recommended: "1–5 tamu",
        best: "Perjalanan premium",
      },
      alphard: {
        type: "Luxury MPV",
        intro: "Kabin eksekutif untuk transfer VIP dan perjalanan dengan prioritas kenyamanan.",
        recommended: "1–5 tamu",
        best: "VIP & executive transfer",
      },
    },
    disclaimerLead: "Catatan foto:",
    disclaimerText:
      "gambar merupakan ilustrasi model resmi Toyota Astra Motor dan Honda Indonesia. Varian, tahun, warna, konfigurasi kursi, serta unit aktual mengikuti ketersediaan dan dikonfirmasi tertulis sebelum pembayaran.",
    serviceEyebrow: "Jenis perjalanan",
    serviceTitle: "Satu armada untuk tiga kebutuhan utama.",
    services: [
      {
        title: "Penjemputan Kualanamu",
        body: "Kirim nomor penerbangan, waktu tiba, titik antar, jumlah tamu, dan bagasi agar unit dapat disesuaikan.",
      },
      {
        title: "Sewa harian & antarkota",
        body: "Untuk Medan, Berastagi, Danau Toba, Bukit Lawang, atau rute lain yang disusun berdasarkan waktu perjalanan nyata.",
      },
      {
        title: "Perjalanan multi-hari",
        body: "Kami cek kecocokan armada, rute, jam penggunaan, dan kebutuhan supir sebelum mengirim quote final.",
      },
    ],
    processEyebrow: "Cara meminta quote",
    processTitle: "Satu pesan yang lengkap mempercepat pengecekan.",
    processIntro:
      "Tarif tidak ditampilkan sebagai angka tetap karena dipengaruhi tanggal, rute, durasi, dan unit yang tersedia.",
    process: [
      {
        title: "Kirim detail perjalanan",
        body: "Tanggal, jam, titik jemput, tujuan, tamu, bagasi, dan pilihan mobil bila ada.",
      },
      {
        title: "Kami cek unit & rute",
        body: "Tim mencocokkan kendaraan dengan kapasitas nyaman dan kondisi perjalanan.",
      },
      {
        title: "Terima quote tertulis",
        body: "Quote menjelaskan item yang termasuk, tidak termasuk, jam penggunaan, dan ketentuan terkait.",
      },
      {
        title: "Konfirmasi resmi",
        body: "Bayar hanya ke rekening BNI resmi yang tercantum pada invoice atau konfirmasi tertulis BROS.",
      },
    ],
    faqEyebrow: "Sebelum booking",
    faqTitle: "Hal penting yang perlu diketahui.",
    faqs: [
      {
        q: "Apakah tersedia lepas kunci?",
        a: "Halaman ini khusus layanan kendaraan dengan supir. Bila kebutuhan Anda berbeda, sampaikan melalui WhatsApp agar tim dapat mengecek opsi yang benar tanpa menjanjikan unit terlebih dahulu.",
      },
      {
        q: "Apakah BBM, tol, parkir, dan overtime sudah termasuk?",
        a: "Jangan diasumsikan otomatis. Quote tertulis akan menyebutkan secara jelas kendaraan, supir, BBM, tol atau parkir, batas jam, overtime, serta akomodasi supir bila rutenya multi-hari.",
      },
      {
        q: "Bagaimana memilih mobil yang tepat?",
        a: "Kirim jumlah tamu, jumlah dan ukuran bagasi, rute, serta preferensi kenyamanan. Kami akan merekomendasikan kapasitas nyaman, bukan sekadar jumlah kursi maksimum.",
      },
      {
        q: "Apakah mobil pada foto pasti sama dengan unit yang datang?",
        a: "Foto adalah ilustrasi model resmi. Model, varian, warna, tahun, dan konfigurasi kursi aktual mengikuti ketersediaan dan akan dikonfirmasi tertulis sebelum pembayaran.",
      },
      {
        q: "Bisa jemput di Bandara Kualanamu?",
        a: "Bisa diatur dengan pemesanan sebelumnya. Kirim nomor penerbangan, jadwal tiba, nama penumpang utama, tujuan, jumlah tamu, dan bagasi.",
      },
      {
        q: "Bagaimana kebijakan perubahan atau pembatalan?",
        a: "Ketentuan mengikuti konfirmasi booking tertulis dan Syarat & Ketentuan BROS yang berlaku. Mohon tinjau ketentuannya sebelum membayar deposit.",
      },
    ],
    finalEyebrow: "Butuh rekomendasi armada?",
    finalTitle: "Kirim tanggal, rute, tamu, dan bagasi.",
    finalBody: "Kami akan mengecek pilihan kendaraan yang realistis dan mengirim quote tertulis melalui WhatsApp.",
    finalCta: "Mulai di WhatsApp",
    mobileKicker: "Butuh kendaraan?",
    mobileTitle: "Cek ketersediaan",
  },
  en: {
    file: "en/bros-wisata-car-rental.html",
    heroEyebrow: "Car rental with driver in Medan",
    heroTitle: "The right vehicle.<br/><em>A route that works.</em>",
    heroCopy:
      "Choose by guest count, luggage, and route—not seat count alone. BROS matches vehicles for Kualanamu pick-ups, day journeys, and multi-day travel across North Sumatra.",
    viewFleet: "View the fleet",
    checkAvailability: "Check availability",
    trust: ["Driver included", "Written quote", "Route-matched"],
    visualHead: "Official model example",
    visualTag: "Comfort MPV",
    heroImageAlt: "Official Toyota Innova model illustration",
    prompt: ["Travel dates", "Guest count", "Flight times", "Luggage & route"],
    fleetEyebrow: "Vehicle options",
    fleetTitle: "Choose for the journey—not just the seats.",
    fleetIntro:
      "Use the filters to narrow the choice. Every service on this page includes a driver; the actual unit and specification are confirmed before payment.",
    filterLabel: "Filter vehicle options",
    filters: {
      all: "All vehicles",
      family: "City & family",
      premium: "Comfort & premium",
      group: "Group travel",
    },
    countTemplate: "Showing {count} vehicle options.",
    imageAltPrefix: "Official model illustration of",
    driverIncluded: "Driver included",
    recommendedLabel: "Comfort group",
    bestForLabel: "Best for",
    serviceLabel: "Chauffeured service",
    vehicleCta: "Choose this vehicle",
    leadCodeLabel: "Lead code",
    vehicleMessage(name, code) {
      return `[${code}] Hi BROS Wisata, I am interested in ${name} with driver. Date: __ | Pick-up: __ | Destination: __ | Guests: __ | Luggage: __. Please check availability and the final rate.`;
    },
    genericMessage:
      "[CAR-PAGE] Hi BROS Wisata, I need a car with driver. Date: __ | Pick-up: __ | Destination: __ | Guests: __ | Luggage: __. Please recommend a suitable vehicle and final rate.",
    vehicleDetails: {
      avanza: {
        type: "Compact MPV",
        intro: "A practical option for city travel and smaller families carrying light luggage.",
        recommended: "1–5 guests",
        best: "Medan & airport transfer",
      },
      innova: {
        type: "Comfort MPV",
        intro: "More cabin comfort for intercity journeys and multi-day North Sumatra routes.",
        recommended: "1–5 guests",
        best: "North Sumatra overland",
      },
      hiace: {
        type: "Group Minibus",
        intro: "Keeps larger families or groups travelling together in one vehicle.",
        recommended: "8–12 guests",
        best: "Families & tour groups",
      },
      brio: {
        type: "City Car",
        intro: "Compact for solo travellers or couples moving around Medan with light bags.",
        recommended: "1–3 guests",
        best: "City & light luggage",
      },
      calya: {
        type: "Family MPV",
        intro: "A value-focused choice for smaller families and easy-paced city travel.",
        recommended: "1–5 guests",
        best: "Families & city routes",
      },
      fortuner: {
        type: "Premium SUV",
        intro: "A higher seating position and premium cabin for longer journeys.",
        recommended: "1–5 guests",
        best: "Premium road journeys",
      },
      alphard: {
        type: "Luxury MPV",
        intro: "An executive cabin for VIP transfers and comfort-led travel.",
        recommended: "1–5 guests",
        best: "VIP & executive transfer",
      },
    },
    disclaimerLead: "Image note:",
    disclaimerText:
      "images are official model illustrations from Toyota Astra Motor and Honda Indonesia. The actual variant, year, colour, seating configuration, and available unit are confirmed in writing before payment.",
    serviceEyebrow: "Journey types",
    serviceTitle: "One fleet for three core travel needs.",
    services: [
      {
        title: "Kualanamu airport pick-up",
        body: "Send the flight number, arrival time, drop-off point, guest count, and luggage so the vehicle can be matched properly.",
      },
      {
        title: "Daily hire & intercity routes",
        body: "For Medan, Berastagi, Lake Toba, Bukit Lawang, or another route planned around realistic road time.",
      },
      {
        title: "Multi-day journeys",
        body: "We check vehicle fit, route, operating hours, and driver requirements before sending the final quote.",
      },
    ],
    processEyebrow: "Requesting a quote",
    processTitle: "One complete message makes the check faster.",
    processIntro:
      "Rates are not shown as fixed figures because dates, route, duration, and available units all affect the final quote.",
    process: [
      {
        title: "Send trip details",
        body: "Date, time, pick-up, destination, guests, luggage, and preferred vehicle if you have one.",
      },
      {
        title: "We check vehicle & route",
        body: "The team matches the vehicle to comfortable capacity and the actual journey.",
      },
      {
        title: "Receive a written quote",
        body: "The quote states inclusions, exclusions, operating hours, and relevant terms.",
      },
      {
        title: "Confirm through BROS",
        body: "Pay only to the official BNI account shown on a BROS invoice or written confirmation.",
      },
    ],
    faqEyebrow: "Before booking",
    faqTitle: "Important details to know.",
    faqs: [
      {
        q: "Do you offer self-drive rental?",
        a: "This page is for chauffeured vehicle service. If your requirement is different, message the team so they can check the correct option without promising a unit in advance.",
      },
      {
        q: "Are fuel, tolls, parking, and overtime included?",
        a: "Do not assume they are automatically included. The written quote will state the vehicle, driver, fuel, tolls or parking, operating-hour limit, overtime, and driver accommodation where relevant.",
      },
      {
        q: "How do I choose the right vehicle?",
        a: "Send the number of guests, luggage quantity and size, route, and comfort preference. We recommend for comfortable capacity, not simply the maximum number of seats.",
      },
      {
        q: "Will the exact vehicle match the image?",
        a: "The images are official model illustrations. The actual model, variant, colour, year, and seating configuration depend on availability and are confirmed in writing before payment.",
      },
      {
        q: "Can you arrange a Kualanamu airport pick-up?",
        a: "It can be arranged with advance booking. Send the flight number, arrival time, lead passenger name, destination, guest count, and luggage.",
      },
      {
        q: "What is the change or cancellation policy?",
        a: "The applicable terms follow the written booking confirmation and current BROS Terms & Conditions. Please review them before paying a deposit.",
      },
    ],
    finalEyebrow: "Need a vehicle recommendation?",
    finalTitle: "Send your dates, route, guests, and luggage.",
    finalBody: "We will check a realistic vehicle option and send a written quote through WhatsApp.",
    finalCta: "Start on WhatsApp",
    mobileKicker: "Need a vehicle?",
    mobileTitle: "Check availability",
  },
  ms: {
    file: "ms/bros-wisata-car-rental.html",
    heroEyebrow: "Sewa kereta dengan pemandu di Medan",
    heroTitle: "Kenderaan yang tepat.<br/><em>Laluan yang munasabah.</em>",
    heroCopy:
      "Pilih mengikut jumlah tetamu, bagasi, dan laluan—bukan jumlah tempat duduk semata-mata. BROS memadankan kenderaan untuk jemputan Kualanamu, perjalanan harian, dan trip beberapa hari di Sumatera Utara.",
    viewFleet: "Lihat armada",
    checkAvailability: "Semak ketersediaan",
    trust: ["Pemandu disertakan", "Sebut harga bertulis", "Laluan disesuaikan"],
    visualHead: "Contoh model rasmi",
    visualTag: "Comfort MPV",
    heroImageAlt: "Ilustrasi rasmi Toyota Innova",
    prompt: ["Tarikh perjalanan", "Jumlah tetamu", "Waktu penerbangan", "Bagasi & destinasi"],
    fleetEyebrow: "Pilihan armada",
    fleetTitle: "Pilih untuk perjalanan—bukan kerusi sahaja.",
    fleetIntro:
      "Gunakan penapis untuk mengecilkan pilihan. Semua perkhidmatan pada halaman ini disertakan pemandu; unit dan spesifikasi sebenar disahkan sebelum bayaran.",
    filterLabel: "Tapis pilihan armada",
    filters: {
      all: "Semua armada",
      family: "Bandar & keluarga",
      premium: "Selesa & premium",
      group: "Rombongan",
    },
    countTemplate: "Memaparkan {count} pilihan kenderaan.",
    imageAltPrefix: "Ilustrasi model rasmi",
    driverIncluded: "Pemandu disertakan",
    recommendedLabel: "Tetamu selesa",
    bestForLabel: "Sesuai untuk",
    serviceLabel: "Perkhidmatan dengan pemandu",
    vehicleCta: "Pilih unit ini",
    leadCodeLabel: "Kod lead",
    vehicleMessage(name, code) {
      return `[${code}] Hai BROS Wisata, saya berminat dengan ${name} bersama pemandu. Tarikh: __ | Jemput: __ | Destinasi: __ | Tetamu: __ | Bagasi: __. Mohon semak ketersediaan dan kadar akhir.`;
    },
    genericMessage:
      "[CAR-PAGE] Hai BROS Wisata, saya perlukan kereta dengan pemandu. Tarikh: __ | Jemput: __ | Destinasi: __ | Tetamu: __ | Bagasi: __. Mohon cadangkan armada yang sesuai dan kadar akhir.",
    vehicleDetails: {
      avanza: {
        type: "Compact MPV",
        intro: "Pilihan praktikal untuk perjalanan bandar dan keluarga kecil dengan bagasi ringan.",
        recommended: "1–5 tetamu",
        best: "Medan & transfer lapangan terbang",
      },
      innova: {
        type: "Comfort MPV",
        intro: "Kabin lebih selesa untuk perjalanan antara bandar dan trip beberapa hari.",
        recommended: "1–5 tetamu",
        best: "Overland Sumatera Utara",
      },
      hiace: {
        type: "Group Minibus",
        intro: "Membolehkan keluarga besar atau rombongan bergerak bersama dalam satu kenderaan.",
        recommended: "8–12 tetamu",
        best: "Keluarga & kumpulan tour",
      },
      brio: {
        type: "City Car",
        intro: "Kompak untuk tetamu solo atau pasangan bergerak di sekitar Medan dengan bagasi ringan.",
        recommended: "1–3 tetamu",
        best: "Bandar & bagasi ringan",
      },
      calya: {
        type: "Family MPV",
        intro: "Pilihan bernilai untuk keluarga kecil dan perjalanan bandar yang santai.",
        recommended: "1–5 tetamu",
        best: "Keluarga & laluan bandar",
      },
      fortuner: {
        type: "Premium SUV",
        intro: "Posisi duduk tinggi dan kabin premium untuk perjalanan lebih jauh.",
        recommended: "1–5 tetamu",
        best: "Perjalanan jalan raya premium",
      },
      alphard: {
        type: "Luxury MPV",
        intro: "Kabin eksekutif untuk transfer VIP dan perjalanan yang mengutamakan keselesaan.",
        recommended: "1–5 tetamu",
        best: "VIP & executive transfer",
      },
    },
    disclaimerLead: "Nota gambar:",
    disclaimerText:
      "gambar ialah ilustrasi model rasmi Toyota Astra Motor dan Honda Indonesia. Varian, tahun, warna, susunan tempat duduk, dan unit sebenar bergantung pada ketersediaan serta disahkan secara bertulis sebelum bayaran.",
    serviceEyebrow: "Jenis perjalanan",
    serviceTitle: "Satu armada untuk tiga keperluan utama.",
    services: [
      {
        title: "Jemputan Kualanamu",
        body: "Hantar nombor penerbangan, waktu tiba, lokasi hantar, jumlah tetamu, dan bagasi supaya kenderaan dapat dipadankan dengan betul.",
      },
      {
        title: "Sewa harian & antara bandar",
        body: "Untuk Medan, Berastagi, Danau Toba, Bukit Lawang, atau laluan lain yang dirancang mengikut masa jalan sebenar.",
      },
      {
        title: "Perjalanan beberapa hari",
        body: "Kami menyemak kesesuaian kenderaan, laluan, waktu penggunaan, dan keperluan pemandu sebelum menghantar kadar akhir.",
      },
    ],
    processEyebrow: "Cara meminta sebut harga",
    processTitle: "Satu mesej lengkap mempercepatkan semakan.",
    processIntro:
      "Kadar tidak dipaparkan sebagai angka tetap kerana tarikh, laluan, tempoh, dan unit tersedia mempengaruhi harga akhir.",
    process: [
      {
        title: "Hantar butiran perjalanan",
        body: "Tarikh, waktu, lokasi jemput, destinasi, tetamu, bagasi, dan pilihan kenderaan jika ada.",
      },
      {
        title: "Kami semak unit & laluan",
        body: "Pasukan memadankan kenderaan dengan kapasiti selesa dan keadaan perjalanan sebenar.",
      },
      {
        title: "Terima sebut harga bertulis",
        body: "Sebut harga menyatakan item termasuk, tidak termasuk, waktu penggunaan, dan syarat berkaitan.",
      },
      {
        title: "Sahkan melalui BROS",
        body: "Bayar hanya ke akaun BNI rasmi yang tertera pada invois atau pengesahan bertulis BROS.",
      },
    ],
    faqEyebrow: "Sebelum tempahan",
    faqTitle: "Perkara penting untuk diketahui.",
    faqs: [
      {
        q: "Adakah sewa pandu sendiri tersedia?",
        a: "Halaman ini khusus untuk perkhidmatan kenderaan dengan pemandu. Jika keperluan anda berbeza, mesej pasukan supaya pilihan yang betul dapat disemak tanpa menjanjikan unit terlebih dahulu.",
      },
      {
        q: "Adakah minyak, tol, parkir, dan overtime termasuk?",
        a: "Jangan anggap semuanya termasuk secara automatik. Sebut harga bertulis akan menyatakan kenderaan, pemandu, minyak, tol atau parkir, had waktu, overtime, dan penginapan pemandu jika berkaitan.",
      },
      {
        q: "Bagaimana memilih kenderaan yang sesuai?",
        a: "Hantar jumlah tetamu, kuantiti dan saiz bagasi, laluan, serta keutamaan keselesaan. Kami mencadangkan kapasiti yang selesa, bukan hanya jumlah kerusi maksimum.",
      },
      {
        q: "Adakah kenderaan sebenar sama seperti gambar?",
        a: "Gambar ialah ilustrasi model rasmi. Model, varian, warna, tahun, dan susunan tempat duduk sebenar bergantung pada ketersediaan dan disahkan bertulis sebelum bayaran.",
      },
      {
        q: "Boleh aturkan jemputan di Lapangan Terbang Kualanamu?",
        a: "Boleh diatur dengan tempahan awal. Hantar nombor penerbangan, waktu tiba, nama penumpang utama, destinasi, jumlah tetamu, dan bagasi.",
      },
      {
        q: "Bagaimana polisi perubahan atau pembatalan?",
        a: "Syarat yang terpakai mengikut pengesahan tempahan bertulis dan Terma & Syarat BROS semasa. Sila semak sebelum membayar deposit.",
      },
    ],
    finalEyebrow: "Perlukan cadangan armada?",
    finalTitle: "Hantar tarikh, laluan, tetamu, dan bagasi.",
    finalBody: "Kami akan menyemak pilihan kenderaan yang realistik dan menghantar sebut harga bertulis melalui WhatsApp.",
    finalCta: "Mulakan di WhatsApp",
    mobileKicker: "Perlukan kenderaan?",
    mobileTitle: "Semak ketersediaan",
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function whatsappLink(message) {
  return `https://wa.me/6281260139399?text=${encodeURIComponent(message)}`;
}

function renderVehicleCard(vehicle, c) {
  const detail = c.vehicleDetails[vehicle.id];
  const href = whatsappLink(c.vehicleMessage(vehicle.name, vehicle.leadCode));

  return `<article class="fleet-card" data-fleet-item data-category="${vehicle.category}">
<div class="fleet-card-media">
<span class="fleet-card-badge">${escapeHtml(c.driverIncluded)}</span>
<img alt="${escapeHtml(`${c.imageAltPrefix} ${vehicle.name}`)}" decoding="async" height="800" loading="lazy" src="${vehicle.image}" width="1200"/>
</div>
<div class="fleet-card-body">
<p class="fleet-card-type">${escapeHtml(detail.type)}</p>
<h3>${escapeHtml(vehicle.name)}</h3>
<p class="fleet-card-intro">${escapeHtml(detail.intro)}</p>
<dl class="fleet-card-specs">
<div><dt>${escapeHtml(c.recommendedLabel)}</dt><dd>${escapeHtml(detail.recommended)}</dd></div>
<div><dt>${escapeHtml(c.bestForLabel)}</dt><dd>${escapeHtml(detail.best)}</dd></div>
</dl>
<p class="fleet-card-service">${escapeHtml(c.serviceLabel)}</p>
<a class="fleet-card-cta" data-category="${vehicle.category}" data-cta="car_rental_vehicle_quote" data-lead-code="${vehicle.leadCode}" data-vehicle="${escapeHtml(vehicle.name)}" data-vehicle-cta href="${href}" rel="noopener noreferrer" target="_blank">
<span>${escapeHtml(c.vehicleCta)}</span><span aria-hidden="true">→</span>
</a>
<p class="fleet-card-code">${escapeHtml(c.leadCodeLabel)}: ${vehicle.leadCode}</p>
</div>
</article>`;
}

function renderMain(lang, c) {
  const genericHref = whatsappLink(c.genericMessage);
  const filterButtons = Object.entries(c.filters)
    .map(
      ([filter, label], index) =>
        `<button aria-pressed="${index === 0 ? "true" : "false"}" class="fleet-filter-button" data-filter="${filter}" data-fleet-filter-button type="button">${escapeHtml(label)}</button>`
    )
    .join("\n");
  const cards = vehicles.map((vehicle) => renderVehicleCard(vehicle, c)).join("\n");
  const services = c.services
    .map(
      (service, index) => `<article class="rental-service-card">
<span class="rental-service-number">0${index + 1}</span>
<h3>${escapeHtml(service.title)}</h3>
<p>${escapeHtml(service.body)}</p>
</article>`
    )
    .join("\n");
  const process = c.process
    .map(
      (step, index) => `<article class="rental-process-card">
<span class="rental-process-number">0${index + 1}</span>
<h3>${escapeHtml(step.title)}</h3>
<p>${escapeHtml(step.body)}</p>
</article>`
    )
    .join("\n");
  const faqs = c.faqs
    .map(
      (item) => `<details>
<summary>${escapeHtml(item.q)}</summary>
<p>${escapeHtml(item.a)}</p>
</details>`
    )
    .join("\n");
  const trust = c.trust
    .map((item) => `<span class="rental-trust-chip">${escapeHtml(item)}</span>`)
    .join("\n");
  const prompt = c.prompt
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("\n");

  return `<main id="main-content">
<section class="rental-hero text-white">
<div class="rental-hero-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div>
<div class="rental-eyebrow">${escapeHtml(c.heroEyebrow)}</div>
<h1 class="rental-hero-title">${c.heroTitle}</h1>
<p class="rental-hero-copy">${escapeHtml(c.heroCopy)}</p>
<div class="flex flex-col sm:flex-row gap-3 mt-8">
<a class="inline-flex items-center justify-center gap-2 bg-bros-gold text-bros-navy px-7 py-4 font-bold hover:bg-white transition" href="#fleet">${escapeHtml(c.viewFleet)} <span aria-hidden="true">↓</span></a>
<a class="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 text-white px-7 py-4 font-bold hover:bg-white/20 transition" data-cta="car_rental_quote" href="${genericHref}" rel="noopener noreferrer" target="_blank">${escapeHtml(c.checkAvailability)} <span aria-hidden="true">→</span></a>
</div>
<div class="rental-trust-row" aria-label="Service highlights">
${trust}
</div>
</div>
<div class="rental-hero-visual">
<div class="rental-hero-visual-head"><span>${escapeHtml(c.visualHead)}</span><span>${escapeHtml(c.visualTag)}</span></div>
<img alt="${escapeHtml(c.heroImageAlt)}" decoding="async" fetchpriority="high" height="800" src="/assets/cars/toyota-innova-reborn.webp" width="1200"/>
<div class="rental-quote-prompt">
${prompt}
</div>
</div>
</div>
</section>

<section class="py-20 lg:py-28 bg-bros-cream" id="fleet">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
<div class="lg:col-span-7 min-w-0">
<div class="text-bros-blue text-xs tracking-[0.3em] uppercase font-bold mb-5">✦ ${escapeHtml(c.fleetEyebrow)}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-bros-navy leading-[0.95]">${escapeHtml(c.fleetTitle)}</h2>
</div>
<div class="lg:col-span-5 min-w-0">
<p class="text-bros-charcoal/75 leading-relaxed">${escapeHtml(c.fleetIntro)}</p>
</div>
</div>
<div aria-label="${escapeHtml(c.filterLabel)}" class="fleet-filter-bar" data-fleet-filter role="group">
${filterButtons}
</div>
<p aria-live="polite" class="fleet-count" data-count-template="${escapeHtml(c.countTemplate)}" data-fleet-count>${escapeHtml(c.countTemplate.replace("{count}", String(vehicles.length)))}</p>
<div class="fleet-grid">
${cards}
</div>
<p class="fleet-disclaimer"><span><strong>${escapeHtml(c.disclaimerLead)}</strong> ${escapeHtml(c.disclaimerText)}</span></p>
</div>
</section>

<section class="py-20 lg:py-28 bg-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="max-w-3xl mb-12">
<div class="text-bros-blue text-xs tracking-[0.3em] uppercase font-bold mb-5">✦ ${escapeHtml(c.serviceEyebrow)}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-bros-navy leading-[0.95]">${escapeHtml(c.serviceTitle)}</h2>
</div>
<div class="rental-service-grid">
${services}
</div>
</div>
</section>

<section class="py-20 lg:py-28 bg-bros-navy text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
<div class="lg:col-span-7 min-w-0">
<div class="text-bros-gold text-xs tracking-[0.3em] uppercase font-bold mb-5">✦ ${escapeHtml(c.processEyebrow)}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95]">${escapeHtml(c.processTitle)}</h2>
</div>
<div class="lg:col-span-5 min-w-0 flex items-end">
<p class="text-white/70 leading-relaxed">${escapeHtml(c.processIntro)}</p>
</div>
</div>
<div class="rental-process-grid">
${process}
</div>
</div>
</section>

<section class="py-20 lg:py-28 bg-white">
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="max-w-3xl mb-10">
<div class="text-bros-blue text-xs tracking-[0.3em] uppercase font-bold mb-5">✦ ${escapeHtml(c.faqEyebrow)}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-bros-navy leading-[0.95]">${escapeHtml(c.faqTitle)}</h2>
</div>
<div class="rental-faq">
${faqs}
</div>
</div>
</section>

<section class="py-20 lg:py-24 bg-bros-blue text-white">
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
<div class="text-bros-gold text-xs tracking-[0.3em] uppercase font-bold mb-5">✦ ${escapeHtml(c.finalEyebrow)}</div>
<h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95]">${escapeHtml(c.finalTitle)}</h2>
<p class="max-w-2xl mx-auto mt-6 text-white/75 leading-relaxed">${escapeHtml(c.finalBody)}</p>
<a class="inline-flex items-center justify-center gap-2 mt-8 bg-bros-gold text-bros-navy px-7 py-4 font-bold hover:bg-white transition" data-cta="car_rental_quote" href="${genericHref}" rel="noopener noreferrer" target="_blank">${escapeHtml(c.finalCta)} <span aria-hidden="true">→</span></a>
</div>
</section>
</main>`;
}

function renderMobileSticky(c) {
  const genericHref = whatsappLink(c.genericMessage);
  return `<!-- MOBILE STICKY CTA -->
<div class="mobile-sticky-cta">
<div class="flex items-center justify-between gap-3">
<div class="rental-mobile-copy">
<div class="text-[10px] tracking-wider uppercase text-bros-charcoal/70 font-semibold">${escapeHtml(c.mobileKicker)}</div>
<div class="font-display text-lg font-bold text-bros-navy leading-tight">${escapeHtml(c.mobileTitle)}</div>
</div>
<a class="bg-emerald-900 text-white px-5 py-3 rounded-sm font-bold text-sm flex items-center gap-2" data-cta="car_rental_quote" href="${genericHref}" rel="noopener noreferrer" target="_blank">WhatsApp</a>
</div>
</div>
<!-- FLOATING WHATSAPP -->`;
}

for (const [lang, c] of Object.entries(copy)) {
  const filePath = path.join(root, c.file);
  const original = fs.readFileSync(filePath, "utf8");
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  let html = original.replace(/\r\n/g, "\n");

  if (!html.includes('/assets/car-rental-fleet.css')) {
    html = html.replace(
      '<link href="/assets/style.css" rel="stylesheet"/>',
      '<link href="/assets/style.css" rel="stylesheet"/>\n<link href="/assets/car-rental-fleet.css" rel="stylesheet"/>'
    );
  }

  if (!html.includes('/assets/car-rental-fleet.js')) {
    html = html.replace(
      '<script src="/assets/whatsapp-source.js" defer></script>',
      '<script src="/assets/car-rental-fleet.js" defer></script>\n<script src="/assets/whatsapp-source.js" defer></script>'
    );
  }

  html = html.replace(
    /<main id="main-content">[\s\S]*?<\/main>/,
    renderMain(lang, c)
  );
  html = html.replace(
    /<!-- MOBILE STICKY CTA -->[\s\S]*?<!-- FLOATING WHATSAPP -->/,
    renderMobileSticky(c)
  );
  html = html.replace(
    /"paymentAccepted": "[^"]*"/,
    '"paymentAccepted": "Bank transfer after written confirmation"'
  );

  const normalizedOriginal = original.replace(/\r\n/g, "\n");
  if (html === normalizedOriginal) {
    console.log(`No changes needed for ${c.file}`);
    continue;
  }

  fs.writeFileSync(filePath, html.replace(/\n/g, eol), "utf8");
  console.log(`Updated ${c.file}`);
}
