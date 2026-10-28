// Readable category guidance. Individual product pages carry their own sources.
const productCodes = {visit:['C1'],business:['C2','D2'],multiple:['D2','D12','D17'],itas:['E28A'],itap:[],extension:[]};
const copy = {
  id: {
    read:'Lihat detail layanan', products:'Pilihan yang bisa dibaca', prepare:'Yang perlu ditinjau',
    basic:'Mulai dari kewarganegaraan, tujuan sebenarnya, rencana datang, lama tinggal, serta lokasi Anda saat ini. Dokumen akhir mengikuti kategori dan kondisi pemohon.',
    notes:{
      visit:'Periksa pilihan visa sesuai tujuan dan kewarganegaraan. C1 adalah salah satu pilihan wisata, bukan kewajiban bagi semua pelancong; fasilitas bebas visa atau VoA perlu diperiksa terpisah.',
      business:'Jelaskan apakah Anda akan rapat, bernegosiasi, membeli barang atau melakukan kegiatan lain. Undangan dan hubungan dengan pihak di Indonesia membantu peninjauan; kunjungan bisnis bukan izin kerja umum.',
      multiple:'Pilih tujuan dan pola perjalanan berulang terlebih dahulu. Masa berlaku visa, batas tinggal setiap kedatangan, dan label tarif tahunan adalah tiga hal berbeda.',
      itas:'Keluarga, investasi, bekerja dan pendidikan memiliki jalur serta dokumen berbeda. Detail E28A di bawah khusus investor; tidak mewakili seluruh pilihan KITAS.',
      itap:'Sampaikan jenis izin yang sedang dimiliki, riwayat izin, dan dasar permohonan yang ingin diperiksa. Memegang KITAS tidak otomatis memenuhi syarat KITAP; Ms Yana meninjau kategori serta dokumen penjamin atau hubungan yang relevan.',
      extension:'Siapkan jenis izin saat ini, tanggal berakhir, lokasi di Indonesia dan tujuan berikutnya. Tidak semua fasilitas masuk dapat diperpanjang atau dialihstatuskan; proses dapat memerlukan kehadiran di kantor imigrasi. Permohonan yang masih diproses bukan perpanjangan otomatis.',
    },
  },
  en: {
    read:'Read service details',products:'Options you can read about',prepare:'What needs review',
    basic:'Start with your nationality, actual purpose, intended arrival, length of stay and current location. The final documents depend on the category and applicant.',
    notes:{
      visit:'Check the route for your purpose and nationality. C1 is one tourism option, not a requirement for every traveller; visa-free entry or visa on arrival must be checked separately.',
      business:'Explain whether you plan meetings, negotiations, purchases or another activity. Invitations and your relationship with the Indonesian host help the review; a business visit is not general work permission.',
      multiple:'Begin with the purpose and pattern of repeat trips. Visa validity, the stay allowed on each arrival and a yearly service-rate label are three different things.',
      itas:'Family, investment, employment and education follow different routes and document requirements. The E28A detail below is specifically for investors, not every KITAS option.',
      itap:'Share your current permit type, permit history and proposed basis for review. Holding KITAS does not automatically establish KITAP eligibility; Ms Yana reviews the relevant category, guarantor or relationship documents.',
      extension:'Prepare your current permit type, expiry date, location in Indonesia and next purpose. Not every entry facility can be extended or converted; attendance at an immigration office may be needed. A pending application is not an automatic extension.',
    },
  },
  ms: {
    read:'Baca butiran perkhidmatan',products:'Pilihan yang boleh dibaca',prepare:'Perkara untuk disemak',
    basic:'Mulakan dengan kewarganegaraan, tujuan sebenar, jangkaan ketibaan, tempoh tinggal dan lokasi semasa. Dokumen akhir bergantung pada kategori serta keadaan pemohon.',
    notes:{
      visit:'Semak pilihan mengikut tujuan dan kewarganegaraan. C1 ialah salah satu pilihan pelancongan, bukan keperluan semua pelancong; kemudahan bebas visa atau visa semasa ketibaan perlu disemak berasingan.',
      business:'Jelaskan sama ada anda akan bermesyuarat, berunding, membeli barang atau menjalankan aktiviti lain. Undangan dan hubungan dengan pihak di Indonesia membantu semakan; lawatan perniagaan bukan kebenaran bekerja secara umum.',
      multiple:'Mulakan dengan tujuan dan corak perjalanan berulang. Tempoh sah visa, had tinggal setiap ketibaan dan label kadar tahunan ialah tiga perkara berbeza.',
      itas:'Keluarga, pelaburan, pekerjaan dan pendidikan mempunyai laluan serta dokumen berbeza. Butiran E28A di bawah khusus untuk pelabur, bukan semua pilihan KITAS.',
      itap:'Nyatakan jenis permit semasa, sejarah permit dan asas permohonan untuk disemak. Memegang KITAS tidak secara automatik melayakkan KITAP; Ms Yana menyemak kategori serta dokumen penjamin atau hubungan yang berkaitan.',
      extension:'Sediakan jenis permit semasa, tarikh tamat, lokasi di Indonesia dan tujuan seterusnya. Tidak semua kemudahan masuk boleh dilanjutkan atau ditukar status; kehadiran di pejabat imigrasi mungkin diperlukan. Permohonan yang sedang diproses bukan lanjutan automatik.',
    },
  },
};
module.exports = {productCodes,copy};
