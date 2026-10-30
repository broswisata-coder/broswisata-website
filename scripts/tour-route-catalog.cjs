"use strict";

// Public, non-personal reference data. The 33 localized paket-*.html itineraries
// remain authoritative; keep this deliberately free of prices and hotel promises.
// Route order was checked against their visible day-by-day itineraries.
const languages = ["id", "en", "ms"];
const destinationKeys = ["medan_city", "toba_samosir", "berastagi_karo", "bukit_lawang", "tangkahan"];

const routes = [
  {
    slug: "halal_3h2m_medan_toba", days: 3, nights: 2,
    destinations: ["toba_samosir", "berastagi_karo", "medan_city"],
    id: {
      title: "Medan–Toba Halal",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Pilihan singkat untuk danau dan kota. Hari kedua menggabungkan kunjungan Samosir dan perjalanan melalui Berastagi ke Medan; diskusikan ritme perjalanan sebelum memilih.",
    },
    en: {
      title: "Medan–Toba Halal",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "A short lake-and-city route. Day two combines Samosir with the road journey through Berastagi to Medan; discuss the travel pace before choosing.",
    },
    ms: {
      title: "Percutian Medan–Toba",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Pilihan singkat untuk tasik dan bandar. Hari kedua menggabungkan lawatan Samosir dan perjalanan melalui Berastagi ke Medan; bincangkan rentak perjalanan sebelum memilih.",
    },
  },
  {
    slug: "halal_4h3m_medan_toba", days: 4, nights: 3,
    destinations: ["toba_samosir", "berastagi_karo", "medan_city"],
    id: {
      title: "Medan–Toba Halal",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Rute danau, dataran tinggi, dan kota dengan satu malam di Berastagi. Cocok dipertimbangkan jika Anda ingin memisahkan perjalanan Berastagi–Medan dari kunjungan Samosir.",
    },
    en: {
      title: "Medan–Toba Halal",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Lake, highlands, and city with a Berastagi overnight. Consider this if you want the Berastagi–Medan journey on a separate day from the Samosir visit.",
    },
    ms: {
      title: "Percutian Medan–Toba",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Tasik, tanah tinggi dan bandar dengan satu malam di Berastagi. Pertimbangkan laluan ini jika anda mahu perjalanan Berastagi–Medan pada hari berasingan daripada lawatan Samosir.",
    },
  },
  {
    slug: "halal_5h4m_medan_toba", days: 5, nights: 4,
    destinations: ["toba_samosir", "berastagi_karo", "medan_city"],
    id: {
      title: "Medan–Toba Halal Extended",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Rute danau yang dilanjutkan dengan satu hari khusus city tour dan belanja di Medan. Bukan tambahan malam di Samosir; lihat pembagian hari sebelum meminta penawaran.",
    },
    en: {
      title: "Medan–Toba Halal Extended",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "The lake route followed by a dedicated Medan city-and-shopping day. It is not an extra Samosir overnight; check the daily allocation before requesting a quote.",
    },
    ms: {
      title: "Percutian Medan–Toba Extended",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Medan → Kualanamu",
      consideration: "Laluan tasik diikuti satu hari khusus lawatan bandar dan beli-belah di Medan. Bukan tambahan malam di Samosir; semak pembahagian hari sebelum meminta sebut harga.",
    },
  },
  {
    slug: "combo_sumut_6h5m", days: 6, nights: 5,
    destinations: ["toba_samosir", "berastagi_karo", "bukit_lawang"],
    id: {
      title: "Jelajah Sumatra Utara",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Bukit Lawang → Kualanamu",
      consideration: "Danau lebih dulu, lalu dataran tinggi dan trekking hutan. Tidak melewati Tangkahan. Cocokkan waktu penerbangan pulang dengan perjalanan dari Bukit Lawang.",
    },
    en: {
      title: "North Sumatra Grand Tour",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Bukit Lawang → Kualanamu",
      consideration: "Lake first, then highlands and rainforest trekking. This route does not include Tangkahan. Match your departure flight with the return journey from Bukit Lawang.",
    },
    ms: {
      title: "Jelajah Sumatera Utara",
      routeSummary: "Kualanamu → Parapat / Samosir → Berastagi → Bukit Lawang → Kualanamu",
      consideration: "Tasik dahulu, kemudian tanah tinggi dan trekking hutan. Laluan ini tidak melalui Tangkahan. Padankan waktu penerbangan pulang dengan perjalanan dari Bukit Lawang.",
    },
  },
  {
    slug: "bukit_lawang_4h3m", days: 4, nights: 3,
    destinations: ["bukit_lawang"],
    id: {
      title: "Trekking Hutan Bukit Lawang",
      routeSummary: "Kualanamu → Bukit Lawang → Kualanamu",
      consideration: "Fokus tinggal di Bukit Lawang, trekking, dan area sungai / gua; bukan rute Tangkahan atau Danau Toba. Kesiapan berjalan dan kondisi sungai perlu dibahas.",
    },
    en: {
      title: "Bukit Lawang Rainforest Trek",
      routeSummary: "Kualanamu → Bukit Lawang → Kualanamu",
      consideration: "A Bukit Lawang stay focused on trekking and the river / cave area, not Tangkahan or Lake Toba. Discuss walking ability and river conditions when planning.",
    },
    ms: {
      title: "Kembara Hutan Bukit Lawang",
      routeSummary: "Kualanamu → Bukit Lawang → Kualanamu",
      consideration: "Fokus bermalam di Bukit Lawang, trekking dan kawasan sungai / gua; bukan laluan Tangkahan atau Tasik Toba. Bincangkan kemampuan berjalan dan keadaan sungai semasa merancang.",
    },
  },
  {
    slug: "tangkahan_3h2m", days: 3, nights: 2,
    destinations: ["tangkahan"],
    id: {
      title: "Jelajah Rimba Tangkahan",
      routeSummary: "Kualanamu → Tangkahan → Kualanamu",
      consideration: "Fokus Tangkahan dengan trekking singkat dan tubing jika kondisi aman. Pengamatan gajah hanya dari jarak aman jika kegiatan konservasi berlangsung, tanpa kontak langsung.",
    },
    en: {
      title: "Tangkahan Rainforest Escape",
      routeSummary: "Kualanamu → Tangkahan → Kualanamu",
      consideration: "Tangkahan-focused, with a short trek and tubing only when safe. Elephant viewing is distance-based only if conservation activity is underway, with no direct contact.",
    },
    ms: {
      title: "Kembara Hutan Tangkahan",
      routeSummary: "Kualanamu → Tangkahan → Kualanamu",
      consideration: "Fokus Tangkahan dengan trekking singkat dan tubing jika keadaan selamat. Pemerhatian gajah hanya dari jarak selamat jika aktiviti pemuliharaan berlangsung, tanpa sentuhan langsung.",
    },
  },
  {
    slug: "berastagi_3h2m", days: 3, nights: 2,
    destinations: ["berastagi_karo"],
    id: {
      title: "Tanah Tinggi Berastagi",
      routeSummary: "Kualanamu → Berastagi / Sipiso-piso → Kualanamu",
      consideration: "Fokus pasar, air terjun, dan pemandian air panas di dataran tinggi. Itinerary ini bukan paket trekking Sibayak; sampaikan jika Anda ingin menambahkan pendakian.",
    },
    en: {
      title: "Berastagi Highlands",
      routeSummary: "Kualanamu → Berastagi / Sipiso-piso → Kualanamu",
      consideration: "Highland markets, waterfall, and hot springs. This itinerary is not the Sibayak trekking package; tell us if you would like to add a hike.",
    },
    ms: {
      title: "Tanah Tinggi Berastagi",
      routeSummary: "Kualanamu → Berastagi / Sipiso-piso → Kualanamu",
      consideration: "Fokus pasar, air terjun dan kolam air panas di tanah tinggi. Itinerari ini bukan pakej trekking Sibayak; maklumkan jika anda ingin menambah pendakian.",
    },
  },
  {
    slug: "western_4d3n_jungle", days: 4, nights: 3,
    destinations: ["bukit_lawang", "tangkahan", "medan_city"],
    id: {
      title: "Jungle & Wildlife Getaway",
      routeSummary: "Kualanamu → Bukit Lawang → Tangkahan → Medan → Kualanamu",
      consideration: "Dua kawasan hutan lalu warisan kota Medan, bukan rute danau. Pertimbangkan trekking dan perjalanan off-road; kemunculan satwa tidak dapat dijamin.",
    },
    en: {
      title: "Jungle & Wildlife Getaway",
      routeSummary: "Kualanamu → Bukit Lawang → Tangkahan → Medan → Kualanamu",
      consideration: "Two rainforest areas followed by Medan heritage, without the lake. Consider the trek and off-road travel; wildlife sightings cannot be guaranteed.",
    },
    ms: {
      title: "Jungle & Wildlife Getaway",
      routeSummary: "Kualanamu → Bukit Lawang → Tangkahan → Medan → Kualanamu",
      consideration: "Dua kawasan hutan diikuti warisan bandar Medan, tanpa tasik. Pertimbangkan trekking dan perjalanan off-road; penampakan hidupan liar tidak dapat dijamin.",
    },
  },
  {
    slug: "western_5d4n_volcano", days: 5, nights: 4,
    destinations: ["bukit_lawang", "berastagi_karo"],
    id: {
      title: "Orangutan & Volcano Adventure",
      routeSummary: "Kualanamu → Bukit Lawang → Berastagi / Sibayak → Medan → Kualanamu",
      consideration: "Trekking hutan dan pendakian Sibayak, lalu bermalam terakhir di Medan. Tidak melewati Tangkahan atau Danau Toba; bahas kesiapan fisik dan kondisi jalur.",
    },
    en: {
      title: "Orangutan & Volcano Adventure",
      routeSummary: "Kualanamu → Bukit Lawang → Berastagi / Sibayak → Medan → Kualanamu",
      consideration: "Rainforest trekking and a Sibayak hike, then a final Medan overnight. No Tangkahan or Lake Toba; discuss fitness and trail conditions before confirming.",
    },
    ms: {
      title: "Orangutan & Volcano Adventure",
      routeSummary: "Kualanamu → Bukit Lawang → Berastagi / Sibayak → Medan → Kualanamu",
      consideration: "Trekking hutan dan pendakian Sibayak, diikuti malam terakhir di Medan. Tidak melalui Tangkahan atau Tasik Toba; bincangkan kecergasan dan keadaan laluan.",
    },
  },
  {
    slug: "medan_heritage_3h2m", days: 3, nights: 2,
    destinations: ["medan_city"],
    id: {
      title: "Warisan Medan & Kuliner",
      routeSummary: "Kualanamu → Medan / Kesawan / pusat kota → Kualanamu",
      consideration: "Fokus warisan kota, kuliner, dan belanja tanpa perjalanan ke hutan atau danau. Sampaikan kebutuhan makanan, alergi, dan mobilitas saat meminta penawaran.",
    },
    en: {
      title: "Medan Heritage & Culinary",
      routeSummary: "Kualanamu → Medan / Kesawan / city centre → Kualanamu",
      consideration: "City heritage, food, and shopping without a rainforest or lake journey. Share dietary needs, allergies, and mobility considerations in your quote request.",
    },
    ms: {
      title: "Warisan Medan & Kuliner",
      routeSummary: "Kualanamu → Medan / Kesawan / pusat bandar → Kualanamu",
      consideration: "Fokus warisan bandar, makanan dan beli-belah tanpa perjalanan ke hutan atau tasik. Nyatakan keperluan makanan, alahan dan mobiliti semasa meminta sebut harga.",
    },
  },
  {
    slug: "western_7d6n_ultimate", days: 7, nights: 6,
    destinations: ["tangkahan", "bukit_lawang", "berastagi_karo", "toba_samosir"],
    id: {
      title: "Ultimate North Sumatra Eco-Tour",
      routeSummary: "Kualanamu → Tangkahan → Bukit Lawang → Berastagi / Sibayak → Samosir / Danau Toba → Kualanamu",
      consideration: "Hutan lebih dulu, lalu gunung dan danau, dengan satu hari eksplorasi Samosir. Melibatkan perjalanan off-road, trekking hutan, dan pendakian; bukan sekadar versi lebih lama dari rute 6 hari.",
    },
    en: {
      title: "Ultimate North Sumatra Eco-Tour",
      routeSummary: "Kualanamu → Tangkahan → Bukit Lawang → Berastagi / Sibayak → Samosir / Lake Toba → Kualanamu",
      consideration: "Forest first, then volcano and lake, with a Samosir exploration day. Includes off-road travel, rainforest trekking, and a hike; not simply a longer version of the 6-day route.",
    },
    ms: {
      title: "Ultimate North Sumatra Eco-Tour",
      routeSummary: "Kualanamu → Tangkahan → Bukit Lawang → Berastagi / Sibayak → Samosir / Tasik Toba → Kualanamu",
      consideration: "Hutan dahulu, kemudian gunung dan tasik, dengan satu hari penerokaan Samosir. Melibatkan perjalanan off-road, trekking hutan dan pendakian; bukan sekadar versi lebih lama bagi laluan 6 hari.",
    },
  },
];

module.exports = { languages, destinationKeys, routes };
