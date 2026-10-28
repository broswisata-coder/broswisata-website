const fs = require('node:fs');
const path = require('node:path');
const {synchronizePage, locales: navigationLabels} = require('./sync-global-rental-navigation.cjs');
const {rates, labels: rateLabels, formatRateAmount} = require('./visa-rate-card.cjs');
const {icon} = require('./visa-illustrations.cjs');
const {countryMark,typeBadge,entryLabel} = require('./visa-visuals.cjs');
const {productCodes: categoryProducts, copy: categoryCopy} = require('./visa-category-details.cjs');
const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
const date = '2026-10-28';
const phone = '6281370233750';
const sharedScript = '/assets/whatsapp-source.js?v=20261028-visa-details';
const sourceLinks = {
  immigration: 'https://kanwilsultra.imigrasi.go.id/wna/daftar-visa-indonesia',
  portal: 'https://evisa.imigrasi.go.id/',
};
const copy = {
  id: {
    langName: 'Bahasa Indonesia', locale: 'id_ID', home: 'Beranda', skip: 'Langsung ke isi',
    title: 'Visa Indonesia untuk WNA | BROS Wisata',
    description: 'Layanan visa dan izin tinggal Indonesia untuk WNA dari BROS Wisata. Konsultasi tarif, dokumen dan pilihan layanan dengan Ms Yana, PIC visa Bros.',
    eyebrow: 'Visa Indonesia untuk warga negara asing',
    heading: 'Rencana ke Indonesia. Urusan visa lebih terarah.',
    intro: 'Urus kebutuhan visa dan izin tinggal Indonesia melalui BROS Wisata. Ms Yana membantu pemeriksaan kebutuhan, dokumen, pilihan layanan, dan koordinasi pengajuan Anda dalam satu jalur komunikasi.',
    chat: 'Konsultasi visa dengan Ms Yana', view: 'Lihat pilihan layanan',
    desk: 'Kontak khusus layanan visa', role: 'PIC Visa BROS Wisata', deskNote: 'BROS Wisata · Indonesia Visa Desk',
    deskCopy: 'Satu kontak untuk pemeriksaan kebutuhan dan koordinasi layanan visa Anda.',
    status: ['Untuk WNA masuk / tinggal di Indonesia', 'Permohonan baru & layanan izin tinggal', 'Rincian layanan melalui konsultasi'],
    servicesEyebrow: 'Temukan jalur yang sesuai', servicesTitle: 'Layanan visa & izin tinggal Indonesia',
    servicesIntro: 'Pilihan di bawah adalah kelompok layanan, bukan penetapan kelayakan. Jenis visa, sponsor, kegiatan yang diizinkan, dan ketentuan izin tinggal perlu diperiksa untuk setiap pemohon.',
    cardChat: 'Tanyakan layanan ini',
    services: [
      ['visit', 'Wisata & kunjungan', 'Bantuan pengurusan untuk rencana berwisata atau berkunjung. Periksa terlebih dahulu apakah Anda memerlukan visa atau memenuhi fasilitas masuk tertentu.'],
      ['business', 'Kunjungan bisnis', 'Untuk pembicaraan bisnis, rapat, atau kegiatan kunjungan yang sesuai. Visa kunjungan bisnis bukan pengganti izin untuk bekerja di Indonesia.'],
      ['multiple', 'Kunjungan beberapa kali', 'Konsultasi kebutuhan multiple entry bagi perjalanan berulang. Tujuan kunjungan dan ketentuan setiap masa tinggal tetap perlu diperiksa.'],
      ['itas', 'ITAS / KITAS', 'Konsultasi izin tinggal terbatas sesuai tujuan, seperti keluarga, investasi, bekerja, atau pendidikan. Dokumen penjamin dan persyaratan terkait diperiksa sesuai kategori.'],
      ['itap', 'ITAP / KITAP', 'Pemeriksaan awal kebutuhan izin tinggal tetap dan dokumen pendukung. Kelayakan tidak otomatis mengikuti kepemilikan visa atau izin tinggal sebelumnya.'],
      ['extension', 'Perpanjangan & alih status', 'Tinjauan izin tinggal yang sedang dimiliki dan kemungkinan layanan yang tersedia. Tidak semua fasilitas masuk dapat diperpanjang atau dialihstatuskan.'],
    ],
    scopeNote: 'Layanan ini khusus visa dan izin tinggal Indonesia untuk WNA, bukan visa negara lain bagi pemegang paspor Indonesia.',
    processEyebrow: 'Langkah yang jelas', processTitle: 'Dari konsultasi ke pengajuan',
    steps: [
      ['Ceritakan kebutuhan', 'Sampaikan kewarganegaraan, tujuan, perkiraan kedatangan, lama tinggal, dan apakah Anda sudah berada di Indonesia.'],
      ['Periksa opsi & penawaran', 'Ms Yana meninjau kategori layanan, checklist dokumen, rincian biaya, dan perkiraan proses yang berlaku untuk kasus Anda.'],
      ['Konfirmasi sebelum mengirim', 'Pahami cakupan layanan dan ketentuan pembayaran. Konfirmasikan penerima, tujuan penggunaan, dan kanal pengiriman sebelum menyerahkan dokumen pribadi.'],
      ['Koordinasi pengajuan', 'Setelah persyaratan dan layanan disepakati, tim Bros mengoordinasikan proses administrasi. Permintaan tambahan dan keputusan tetap mengikuti otoritas berwenang.'],
    ],
    prepareTitle: 'Siapkan informasi awal ini.',
    prepareCopy: 'Belum perlu mengirim foto paspor untuk memulai percakapan. Informasi dasar membantu Ms Yana meninjau kebutuhan Anda terlebih dahulu.',
    checklist: ['Kewarganegaraan dan jenis dokumen perjalanan', 'Tujuan sebenarnya selama berada di Indonesia', 'Rencana tanggal datang dan lama tinggal', 'Lokasi Anda saat ini: di luar / di dalam Indonesia', 'Jika sudah di Indonesia: jenis izin dan tanggal berakhirnya', 'Kebutuhan keluarga, perusahaan, atau penjamin bila relevan'],
    privacyTitle: 'Dokumen pribadi, setelah ada arahan.',
    privacyCopy: 'Checklist akhir dapat mencakup paspor, foto, rencana perjalanan, atau dokumen penjamin sesuai kategori. Jangan mengirim nomor paspor, berkas identitas, data perbankan, kata sandi, atau OTP melalui formulir umum website atau pesan awal.',
    privacyLink: 'Baca kebijakan privasi',
    boundaryTitle: 'Bantuan administrasi, bukan penerbit visa.',
    boundaryCopy: 'BROS Wisata menangani komunikasi layanan dan koordinasi administrasi pengajuan Anda melalui Ms Yana. Kami bukan kantor Imigrasi dan tidak menjanjikan persetujuan visa atau izin masuk. Keputusan berada pada otoritas Imigrasi Indonesia.',
    quoteTitle: 'Minta rincian sebelum membayar.',
    quoteCopy: 'Biaya resmi imigrasi dan biaya jasa pengurusan bukan hal yang sama. Minta penawaran tertulis yang menjelaskan cakupan, komponen biaya, ketentuan pembayaran, pembatalan, dan pengembalian yang berlaku sebelum menyetujui layanan.',
    timingCopy: 'Perkiraan proses mengikuti kategori, kelengkapan dokumen, dan pemeriksaan otoritas. Jangan menganggap pengajuan yang sedang diproses otomatis memperpanjang izin tinggal.',
    faqTitle: 'Pertanyaan sebelum mengurus visa',
    faq: [
      ['Apakah ini layanan visa masuk Indonesia?', 'Ya. Layanan ini membantu kebutuhan visa dan izin tinggal Indonesia untuk warga negara asing. Halaman ini tidak menawarkan visa keluar negeri bagi pemegang paspor Indonesia.'],
      ['Siapa yang saya hubungi untuk visa Bros?', 'PIC layanan visa BROS Wisata adalah Ms Yana melalui WhatsApp +62 813-7023-3750. Hubungi Ms Yana untuk pemeriksaan kebutuhan dan koordinasi pengurusan visa. Kontak tour Bros tetap terpisah.'],
      ['Apakah semua pemohon memerlukan jenis visa yang sama?', 'Tidak. Kewarganegaraan, dokumen perjalanan, tujuan kegiatan, lama tinggal, dan status imigrasi saat ini memengaruhi pilihan yang tersedia. Fasilitas bebas visa atau visa saat kedatangan tidak berlaku universal.'],
      ['Berapa harga dan lama prosesnya?', rateLabels.id.faq],
      ['Apakah visa wisata atau bisnis bisa digunakan untuk bekerja?', 'Jangan menganggap visa kunjungan sebagai izin bekerja. Kegiatan harus sesuai dengan izin yang diberikan; rencana bekerja perlu ditinjau melalui kategori dan persyaratan yang sesuai.'],
      ['Apakah izin tinggal saya pasti bisa diperpanjang?', 'Tidak. Kemungkinan perpanjangan atau alih status tergantung jenis izin dan ketentuan yang berlaku. Hubungi Ms Yana sebelum izin berakhir; proses tertentu dapat memerlukan foto, wawancara, atau kehadiran di kantor imigrasi.'],
      ['Apakah persetujuan visa dan masuk Indonesia dijamin?', 'Tidak. BROS Wisata membantu proses administrasi, bukan menentukan hasil. Persetujuan visa serta keputusan masuk Indonesia merupakan kewenangan otoritas berwenang.'],
    ],
    finalTitle: 'Mulai dari rencana Anda.', finalCopy: 'Ceritakan tujuan dan jadwal. Ms Yana membantu meninjau layanan yang perlu didiskusikan untuk kebutuhan visa Indonesia Anda.',
    tourLink: 'Butuh private tour? Hubungi tim perjalanan Bros',
    refsTitle: 'Rujukan & pembaruan', refs: ['Informasi kategori visa Imigrasi', 'Portal resmi eVisa Indonesia'],
    reviewed: 'Informasi umum ditinjau 28 Oktober 2026. Ketentuan dan ketersediaan layanan perlu dikonfirmasi kembali sebelum pengajuan.',
    homeEyebrow: 'Layanan tambahan · Visa Indonesia', homeTitle: 'Ke Indonesia, dengan persiapan visa yang tepat.',
    homeCopy: 'BROS Wisata melayani bantuan pengurusan visa dan izin tinggal Indonesia untuk WNA. Konsultasikan tujuan, pilihan layanan, tarif, dan dokumen dengan Ms Yana, PIC visa Bros.',
    homeView: 'Kenali layanan visa Indonesia',
    message: 'Halo Ms Yana, saya ingin konsultasi layanan visa Indonesia BROS Wisata. Kewarganegaraan: __. Tujuan: __. Rencana datang: __. Lama tinggal: __. Saat ini berada di: __.',
    interest: 'Kebutuhan layanan',
  },
  en: {
    langName: 'English', locale: 'en_US', home: 'Home', skip: 'Skip to content',
    title: 'Indonesia Visa Services | BROS Wisata',
    description: 'Indonesia visa and stay-permit services from BROS Wisata. Discuss rates, documents and service options with Ms Yana, your dedicated Bros visa contact.',
    eyebrow: 'Indonesia visa services for foreign nationals',
    heading: 'Your Indonesia plans. A clearer visa journey.',
    intro: 'Arrange your Indonesian visa and stay-permit needs through BROS Wisata. Ms Yana is your single point of contact for the initial review, document checklist, service options and application coordination.',
    chat: 'Discuss your visa with Ms Yana', view: 'Explore the services',
    desk: 'Your dedicated visa contact', role: 'BROS Wisata Visa Contact', deskNote: 'BROS Wisata · Indonesia Visa Desk',
    deskCopy: 'One contact for the initial review and coordination of your visa-service needs.',
    status: ['For foreign nationals entering / staying in Indonesia', 'New applications & stay-permit services', 'Service details confirmed after consultation'],
    servicesEyebrow: 'Find the relevant route', servicesTitle: 'Indonesia visa & stay-permit services',
    servicesIntro: 'These are service groups, not a decision on eligibility. The visa type, sponsor requirements, permitted activities and stay conditions need to be checked for each applicant.',
    cardChat: 'Ask about this service',
    services: [
      ['visit', 'Tourism & visits', 'Assistance for a holiday or visit to Indonesia. First check whether you need a visa or qualify for an applicable entry facility.'],
      ['business', 'Business visits', 'For business discussions, meetings or other permitted visit activities. A business-visit visa is not a substitute for permission to work in Indonesia.'],
      ['multiple', 'Multiple-entry visits', 'Discuss options for repeat trips. The purpose of each visit and the conditions for each stay still need to be checked.'],
      ['itas', 'ITAS / KITAS', 'Limited-stay consultation for purposes such as family, investment, employment or education. Guarantor documents and related requirements depend on the applicable category.'],
      ['itap', 'ITAP / KITAP', 'An initial review of permanent-stay needs and supporting documents. Eligibility does not follow automatically from holding a previous visa or stay permit.'],
      ['extension', 'Extensions & status changes', 'A review of your current permit and potentially available services. Not every entry facility can be extended or converted.'],
    ],
    scopeNote: 'This service concerns Indonesian visas and stay permits for foreign nationals, not overseas visas for Indonesian passport holders.',
    processEyebrow: 'A clear next step', processTitle: 'From consultation to application',
    steps: [
      ['Share your plans', 'Tell us your nationality, purpose, intended arrival, length of stay and whether you are already in Indonesia.'],
      ['Review options & quotation', 'Ms Yana reviews the relevant service category, document checklist, fee breakdown and processing estimate for your case.'],
      ['Confirm before sending', 'Understand the service scope and payment terms. Confirm the recipient, intended use and delivery channel before sharing personal documents.'],
      ['Coordinate the application', 'After the requirements and service are agreed, the Bros team coordinates the administrative process. Further requests and decisions remain subject to the authorities.'],
    ],
    prepareTitle: 'Start with these details.',
    prepareCopy: 'You do not need to send a passport photo to start the conversation. Basic information lets Ms Yana review your needs first.',
    checklist: ['Nationality and type of travel document', 'Your actual intended activities in Indonesia', 'Intended arrival date and length of stay', 'Current location: outside / inside Indonesia', 'If already in Indonesia: current permit type and expiry', 'Relevant family, company or guarantor requirements'],
    privacyTitle: 'Personal documents, only after guidance.',
    privacyCopy: 'The final checklist may include a passport, photograph, itinerary or guarantor documents for the relevant category. Do not send passport numbers, identity files, banking data, passwords or one-time codes through general website forms or your first message.',
    privacyLink: 'Read the privacy policy',
    boundaryTitle: 'Administrative assistance, not visa issuance.',
    boundaryCopy: 'BROS Wisata handles service communication and administrative coordination through Ms Yana. We are not an Immigration office and do not promise visa approval or entry. Decisions remain with the Indonesian immigration authorities.',
    quoteTitle: 'Ask for a breakdown before paying.',
    quoteCopy: 'Official immigration fees and administrative service fees are different. Request a written quotation explaining the scope, fee components, payment, cancellation and applicable refund terms before agreeing to the service.',
    timingCopy: 'Estimates depend on the category, complete documents and official review. A pending application should not be treated as an automatic extension of your stay permission.',
    faqTitle: 'Before you start your visa enquiry',
    faq: [
      ['Is this an inbound Indonesia visa service?', 'Yes. The service assists foreign nationals with Indonesian visas and stay permits. This page does not offer overseas visas for Indonesian passport holders.'],
      ['Who is the Bros visa contact?', 'The BROS Wisata visa contact is Ms Yana on WhatsApp +62 813-7023-3750. Contact Ms Yana for the initial review and visa-service coordination. The Bros tour contact remains separate.'],
      ['Does every applicant need the same visa?', 'No. Nationality, travel document, actual activities, length of stay and current immigration status affect the available options. Visa-free entry or visa on arrival is not available universally.'],
      ['What does it cost and how long does it take?', rateLabels.en.faq],
      ['Can a tourist or business-visit visa be used for work?', 'Do not treat a visit visa as permission to work. Your activities must match the permission granted; employment plans need to be reviewed under the appropriate category and requirements.'],
      ['Can my stay permit definitely be extended?', 'No. Extension or status-change options depend on the permit and applicable rules. Contact Ms Yana before your permission expires; certain processes may require photographs, an interview or attendance at an immigration office.'],
      ['Are visa approval and entry to Indonesia guaranteed?', 'No. BROS Wisata assists with administration, not the outcome. Visa approval and permission to enter Indonesia remain decisions of the competent authorities.'],
    ],
    finalTitle: 'Begin with your Indonesia plans.', finalCopy: 'Share your purpose and dates. Ms Yana will help review the service options to discuss for your Indonesian visa needs.',
    tourLink: 'Need a private tour? Contact the Bros travel team',
    refsTitle: 'References & updates', refs: ['Official immigration visa categories', 'Official Indonesia eVisa portal'],
    reviewed: 'General information reviewed on 28 October 2026. Rules and service availability must be reconfirmed before applying.',
    homeEyebrow: 'Additional services · Indonesia visas', homeTitle: 'Indonesia plans begin with the right visa preparation.',
    homeCopy: 'BROS Wisata offers Indonesian visa and stay-permit assistance for foreign nationals. Discuss your purpose, service options, rates and documents with Ms Yana, the Bros visa contact.',
    homeView: 'Explore Indonesia visa assistance',
    message: 'Hello Ms Yana, I would like to discuss BROS Wisata Indonesia visa services. Nationality: __. Purpose: __. Intended arrival: __. Length of stay: __. Current location: __.',
    interest: 'Service of interest',
  },
  ms: {
    langName: 'Bahasa Melayu', locale: 'ms_MY', home: 'Utama', skip: 'Terus ke kandungan',
    title: 'Perkhidmatan Visa Indonesia | BROS Wisata',
    description: 'Perkhidmatan visa dan permit tinggal Indonesia daripada BROS Wisata. Semak kadar, dokumen dan pilihan perkhidmatan dengan Ms Yana, PIC visa Bros.',
    eyebrow: 'Visa Indonesia untuk warga asing',
    heading: 'Rancangan ke Indonesia. Urusan visa lebih teratur.',
    intro: 'Urus keperluan visa dan permit tinggal Indonesia melalui BROS Wisata. Ms Yana menjadi satu hubungan untuk semakan awal, senarai dokumen, pilihan perkhidmatan dan penyelarasan permohonan anda.',
    chat: 'Bincangkan visa dengan Ms Yana', view: 'Lihat pilihan perkhidmatan',
    desk: 'Hubungan khusus perkhidmatan visa', role: 'PIC Visa BROS Wisata', deskNote: 'BROS Wisata · Indonesia Visa Desk',
    deskCopy: 'Satu hubungan untuk semakan awal dan penyelarasan keperluan perkhidmatan visa anda.',
    status: ['Untuk warga asing masuk / tinggal di Indonesia', 'Permohonan baharu & urusan permit tinggal', 'Butiran perkhidmatan selepas perbincangan'],
    servicesEyebrow: 'Cari pilihan yang sesuai', servicesTitle: 'Perkhidmatan visa & permit tinggal Indonesia',
    servicesIntro: 'Pilihan berikut ialah kumpulan perkhidmatan, bukan keputusan kelayakan. Jenis visa, keperluan penjamin, aktiviti yang dibenarkan dan syarat permit perlu disemak bagi setiap pemohon.',
    cardChat: 'Tanya tentang perkhidmatan ini',
    services: [
      ['visit', 'Pelancongan & lawatan', 'Bantuan untuk percutian atau lawatan ke Indonesia. Semak dahulu sama ada anda memerlukan visa atau layak menggunakan kemudahan masuk tertentu.'],
      ['business', 'Lawatan perniagaan', 'Untuk perbincangan perniagaan, mesyuarat atau aktiviti lawatan yang dibenarkan. Visa lawatan perniagaan bukan pengganti kebenaran bekerja di Indonesia.'],
      ['multiple', 'Lawatan berbilang kemasukan', 'Bincangkan pilihan untuk perjalanan berulang. Tujuan setiap lawatan dan syarat bagi setiap tempoh tinggal masih perlu disemak.'],
      ['itas', 'ITAS / KITAS', 'Perbincangan permit tinggal terhad untuk tujuan seperti keluarga, pelaburan, pekerjaan atau pendidikan. Dokumen penjamin dan syarat berkaitan bergantung pada kategori yang sesuai.'],
      ['itap', 'ITAP / KITAP', 'Semakan awal keperluan permit tinggal tetap serta dokumen sokongan. Kelayakan tidak terhasil secara automatik daripada visa atau permit terdahulu.'],
      ['extension', 'Lanjutan & pertukaran status', 'Semakan permit semasa dan kemungkinan perkhidmatan yang tersedia. Tidak semua kemudahan masuk boleh dilanjutkan atau ditukar status.'],
    ],
    scopeNote: 'Perkhidmatan ini khusus untuk visa dan permit tinggal Indonesia bagi warga asing, bukan visa negara lain untuk pemegang pasport Indonesia.',
    processEyebrow: 'Langkah yang jelas', processTitle: 'Daripada perbincangan ke permohonan',
    steps: [
      ['Kongsikan rancangan', 'Nyatakan kewarganegaraan, tujuan, jangkaan ketibaan, tempoh tinggal dan sama ada anda sudah berada di Indonesia.'],
      ['Semak pilihan & sebut harga', 'Ms Yana menyemak kategori perkhidmatan, senarai dokumen, pecahan bayaran dan anggaran proses bagi kes anda.'],
      ['Sahkan sebelum menghantar', 'Fahami skop perkhidmatan dan syarat bayaran. Sahkan penerima, tujuan penggunaan dan saluran penghantaran sebelum berkongsi dokumen peribadi.'],
      ['Penyelarasan permohonan', 'Selepas syarat dan perkhidmatan dipersetujui, pasukan Bros menyelaras proses pentadbiran. Permintaan tambahan dan keputusan tertakluk kepada pihak berkuasa.'],
    ],
    prepareTitle: 'Mulakan dengan maklumat ini.',
    prepareCopy: 'Anda belum perlu menghantar gambar pasport untuk memulakan perbualan. Maklumat asas membantu Ms Yana menyemak keperluan anda dahulu.',
    checklist: ['Kewarganegaraan dan jenis dokumen perjalanan', 'Aktiviti sebenar yang dirancang di Indonesia', 'Tarikh jangkaan tiba dan tempoh tinggal', 'Lokasi semasa: di luar / di dalam Indonesia', 'Jika di Indonesia: jenis permit semasa dan tarikh tamat', 'Keperluan keluarga, syarikat atau penjamin jika berkaitan'],
    privacyTitle: 'Dokumen peribadi, selepas ada panduan.',
    privacyCopy: 'Senarai akhir mungkin merangkumi pasport, foto, jadual perjalanan atau dokumen penjamin mengikut kategori. Jangan hantar nombor pasport, fail identiti, maklumat perbankan, kata laluan atau OTP melalui borang umum laman web atau mesej pertama.',
    privacyLink: 'Baca dasar privasi',
    boundaryTitle: 'Bantuan pentadbiran, bukan penerbit visa.',
    boundaryCopy: 'BROS Wisata mengendalikan komunikasi perkhidmatan dan penyelarasan pentadbiran melalui Ms Yana. Kami bukan pejabat Imigrasi dan tidak menjanjikan kelulusan visa atau kebenaran masuk. Keputusan kekal pada pihak berkuasa Imigrasi Indonesia.',
    quoteTitle: 'Minta pecahan bayaran sebelum membayar.',
    quoteCopy: 'Bayaran rasmi imigrasi dan bayaran perkhidmatan pengurusan adalah berbeza. Minta sebut harga bertulis yang menerangkan skop, komponen bayaran, syarat pembayaran, pembatalan dan pemulangan yang terpakai sebelum bersetuju.',
    timingCopy: 'Anggaran proses bergantung pada kategori, dokumen lengkap dan semakan pihak berkuasa. Permohonan yang sedang diproses tidak harus dianggap melanjutkan permit tinggal secara automatik.',
    faqTitle: 'Sebelum memulakan urusan visa',
    faq: [
      ['Adakah ini perkhidmatan visa masuk Indonesia?', 'Ya. Perkhidmatan ini membantu warga asing dengan visa dan permit tinggal Indonesia. Halaman ini tidak menawarkan visa luar negara bagi pemegang pasport Indonesia.'],
      ['Siapakah PIC visa Bros?', 'PIC visa BROS Wisata ialah Ms Yana melalui WhatsApp +62 813-7023-3750. Hubungi Ms Yana untuk semakan awal dan penyelarasan urusan visa. Hubungan tour Bros kekal berasingan.'],
      ['Adakah semua pemohon memerlukan visa yang sama?', 'Tidak. Kewarganegaraan, dokumen perjalanan, aktiviti sebenar, tempoh tinggal dan status imigrasi semasa mempengaruhi pilihan yang tersedia. Kemudahan bebas visa atau visa semasa ketibaan tidak terpakai kepada semua orang.'],
      ['Berapakah bayaran dan tempoh proses?', rateLabels.ms.faq],
      ['Bolehkah visa pelancong atau lawatan perniagaan digunakan untuk bekerja?', 'Jangan anggap visa lawatan sebagai kebenaran bekerja. Aktiviti mesti sepadan dengan kebenaran yang diberikan; rancangan bekerja perlu disemak di bawah kategori dan syarat yang sesuai.'],
      ['Adakah permit tinggal saya pasti boleh dilanjutkan?', 'Tidak. Pilihan lanjutan atau pertukaran status bergantung pada permit dan peraturan yang terpakai. Hubungi Ms Yana sebelum permit tamat; proses tertentu mungkin memerlukan foto, temu duga atau kehadiran di pejabat imigrasi.'],
      ['Adakah kelulusan visa dan kemasukan Indonesia dijamin?', 'Tidak. BROS Wisata membantu urusan pentadbiran, bukan menentukan hasil. Kelulusan visa dan keputusan masuk Indonesia ialah bidang kuasa pihak berkuasa yang berkenaan.'],
    ],
    finalTitle: 'Mulakan dengan rancangan anda.', finalCopy: 'Kongsikan tujuan dan tarikh. Ms Yana membantu menyemak pilihan perkhidmatan untuk dibincangkan bagi keperluan visa Indonesia anda.',
    tourLink: 'Perlukan private tour? Hubungi pasukan perjalanan Bros',
    refsTitle: 'Rujukan & kemas kini', refs: ['Kategori visa rasmi Imigrasi', 'Portal eVisa Indonesia rasmi'],
    reviewed: 'Maklumat umum disemak pada 28 Oktober 2026. Peraturan dan ketersediaan perkhidmatan perlu disahkan semula sebelum permohonan.',
    homeEyebrow: 'Perkhidmatan tambahan · Visa Indonesia', homeTitle: 'Ke Indonesia, dengan persediaan visa yang tepat.',
    homeCopy: 'BROS Wisata menyediakan bantuan visa dan permit tinggal Indonesia untuk warga asing. Bincangkan tujuan, pilihan perkhidmatan, kadar dan dokumen dengan Ms Yana, PIC visa Bros.',
    homeView: 'Kenali perkhidmatan visa Indonesia',
    message: 'Hai Ms Yana, saya ingin berbincang tentang perkhidmatan visa Indonesia BROS Wisata. Kewarganegaraan: __. Tujuan: __. Jangkaan ketibaan: __. Tempoh tinggal: __. Lokasi semasa: __.',
    interest: 'Perkhidmatan diperlukan',
  },
};
const escape = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const updates = [];
function save(relative, content) {
  const file = path.join(root, relative);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') === content.replace(/\r\n/g, '\n')) return;
  // Social-image metadata is owned by sync_social_previews.py. The independent
  // social-preview check validates those fields rather than this content check.
  if (check && relative.endsWith('/indonesia-visa.html') && fs.existsSync(file)) {
    const normalized = html => html.split(/\r?\n/).filter(line => line.trim() && !/^<meta\b[^>]*(?:og:image|twitter:image|twitter:card)/.test(line)).join('\n');
    if (normalized(fs.readFileSync(file, 'utf8')) === normalized(content)) return;
  }
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) updates.push({file, relative, content});
}
function whatsapp(c, key, label = c.chat, extra = '') {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(c.message + (extra ? ' ' + c.interest + ': ' + extra + '.' : ''))}`;
  return `<a class="visa-button" href="${escape(href)}" data-cta="visa_${key}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
}
function pricing(lang, c) {
  const l = rateLabels[lang];
  const featuredCodes = ['C1', 'C2', 'D2'];
  const name = r => r.names[l.index];
  const detail = {id:'Lihat detail visa',en:'Read visa details',ms:'Baca butiran visa'}[lang];
  const link = r => `<a class="visa-text-link visa-detail-link" href="/${lang}/indonesia-visa-${r.code.toLowerCase()}" data-cta="visa_detail_${r.code.toLowerCase()}" aria-label="${escape(detail + ': ' + r.code + ' · ' + name(r))}">${escape(detail)} <span aria-hidden="true">→</span></a>`;
  const featured = featuredCodes.map(code => rates.find(r => r.code === code));
  const others = rates.filter(r => !featuredCodes.includes(r.code));
  return `<section class="visa-section visa-pricing" id="visa-pricing" aria-labelledby="visa-pricing-title"><div class="visa-shell">
<div class="visa-pricing-heading"><div class="visa-section-heading"><p class="visa-eyebrow">${escape(l.eyebrow)}</p><h2 class="font-display" id="visa-pricing-title">${escape(l.title)}</h2><p>${escape(l.intro)}</p></div>${countryMark(lang)}</div>
<div class="visa-featured-rates">${featured.map(r => `<article class="visa-rate-card" data-visa-rate="${r.code}" data-rate-idr="${r.amount}"><div class="visa-rate-top">${typeBadge(r)}${entryLabel(r,lang)}</div><h3 class="visa-type-name">${escape(name(r))}</h3><p class="visa-rate-amount">${formatRateAmount(r,lang)}</p>${link(r)}</article>`).join('\n')}</div>
<details class="visa-rate-directory"><summary>${escape(l.more)} <span class="visa-rate-count">${others.length}</span></summary><ul class="visa-rate-list">${others.map(r => `<li data-visa-rate="${r.code}" data-rate-idr="${r.amount}"><div class="visa-rate-identity">${typeBadge(r)}<div><h3 class="visa-type-name">${escape(name(r))}</h3>${entryLabel(r,lang)}</div></div><p class="visa-rate-amount">${formatRateAmount(r,lang)}</p>${link(r)}</li>`).join('\n')}</ul></details>
<p class="visa-usd-note">${escape(l.usdNote)}</p>
<div class="visa-rate-consultation"><div><h3>${escape(l.consultationTitle)}</h3><p>${escape(l.consultation)}</p></div>${whatsapp(c, 'rate_consultation')}</div>
<p class="visa-note">${escape(l.disclaimer)}</p><p class="visa-small visa-rate-reviewed">${escape(l.checked)}</p>
</div></section>`;
}
function serviceCards(lang,c) {
  const l=categoryCopy[lang];
  return c.services.map(([key,title,description],i)=>{
    const related=categoryProducts[key].map(code=>{
      const r=rates.find(r=>r.code===code);
      return `<li><a class="visa-text-link visa-detail-link" href="/${lang}/indonesia-visa-${code.toLowerCase()}">${code} · ${escape(r.names[rateLabels[lang].index])} <span aria-hidden="true">→</span></a></li>`;
    }).join('');
    return `<details class="visa-service-card"><summary><span class="visa-service-top">${icon(['passport','business','multiple','permit','home','extension'][i])}<span class="visa-service-no" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></span><span class="visa-category-name">${escape(title)}</span><span class="visa-category-description">${escape(description)}</span><span class="visa-category-toggle">${escape(l.read)} <span aria-hidden="true">+</span></span></summary><div class="visa-category-body"><h3>${escape(title)}</h3><h4>${escape(l.prepare)}</h4><p>${escape(l.notes[key])}</p><p>${escape(l.basic)}</p>${related?`<h4>${escape(l.products)}</h4><ul>${related}</ul>`:''}${whatsapp(c,key,c.cardChat,title).replace('class="visa-button"','class="visa-text-link"')}</div></details>`;
  }).join('\n');
}
function schema(lang, c) {
  const url = `https://broswisata.id/${lang}/indonesia-visa`;
  return {
    '@context': 'https://schema.org', '@graph': [
      {'@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, dateModified: date,
        primaryImageOfPage: {'@type': 'ImageObject', url: `https://broswisata.id/assets/og/${lang}/indonesia-visa.jpg`, width: 1200, height: 630},
        mainEntity: {'@id': url + '#service'}},
      {'@type': 'Service', '@id': url + '#service', name: c.servicesTitle, description: c.intro, url,
        serviceType: 'Indonesia visa and stay-permit administrative assistance', areaServed: {'@type': 'Country', name: 'Indonesia'},
        provider: {'@type': 'Organization', '@id': 'https://broswisata.id/#localbusiness', name: 'BROS Wisata', url: 'https://broswisata.id',
          logo: 'https://broswisata.id/bros-wisata-logos/bros-wisata-logo-horizontal.svg',
          contactPoint: {'@type': 'ContactPoint', name: 'Ms Yana', contactType: 'Indonesia visa services', telephone: '+62-813-7023-3750', url: `https://wa.me/${phone}`}}},
      {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name: c.home, item: `https://broswisata.id/${lang}/`},
        {'@type': 'ListItem', position: 2, name: c.servicesTitle, item: url},
      ]},
      {'@type': 'FAQPage', '@id': url + '#faq', mainEntity: c.faq.map(([q, a]) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a}}))},
    ],
  };
}
function page(lang, c, homepage) {
  const url = `https://broswisata.id/${lang}/indonesia-visa`;
  let header = homepage.slice(homepage.indexOf('<body'), homepage.indexOf('<main'));
  header = header.replace(/<body[^>]*>/, '<body class="bg-bros-cream visa-page">');
  header = header.replace(/href="#([^\"]+)"/g, `href="/${lang}/#$1"`);
  header = header.replace(/<a\b(?=[^>]*id="lang-(?:id|my|en)")[^>]*>/g, tag => {
    const target = {id: 'id', my: 'ms', en: 'en'}[tag.match(/id="lang-(id|my|en)"/)[1]];
    return tag.replace(/href="[^"]+"/, `href="/${target}/indonesia-visa"`);
  });
  const tourLabel = {id: 'WhatsApp Tour', en: 'Tour WhatsApp', ms: 'WhatsApp Tour'}[lang];
  header = header.replace(/<a\b(?=[^>]*href="https:\/\/wa\.me\/6281260139399)[^>]*>[\s\S]*?<\/a>/g, anchor =>
    anchor.replace(/WhatsApp Kami|WhatsApp Us|📱 WhatsApp/g, label => label.startsWith('📱') ? '📱 ' + tourLabel : tourLabel));
  header = header.replace(/(<body[^>]*>)/, `$1\n<a class="visa-skip" href="#main-content">${escape(c.skip)}</a>`);
  // The global navigation remains a general tour contact. Visa-specific CTAs
  // below deliberately use Ms Yana; the company's Ahmad contact is unchanged.
  const footer = homepage.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  const menu = homepage.match(/<script>\s*\/\/ ===== MOBILE MENU =====[\s\S]*?<\/script>/)?.[0];
  if (!footer || !menu) throw new Error(`Missing shared shell in ${lang}/index.html`);
  const analyticsBlock = homepage.split('<!-- ===== ANALYTICS & TRACKING ===== -->')[1]?.split('</head>')[0] || '';
  // Local previews must not send production pageviews or advertising events.
  // Reuse the installed tracking scripts only on the two production hostnames.
  const productionHost = '(location.hostname === "broswisata.id" || location.hostname === "www.broswisata.id")';
  const analytics = [...analyticsBlock.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map(([, attrs, code]) => {
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    const body = src ? `const s = document.createElement('script'); s.src = ${JSON.stringify(src)}; document.head.appendChild(s);` : code;
    return `<script>if ${productionHost} {\n${body}\n}</script>`;
  }).join('\n');
  const fonts = [...homepage.slice(0, homepage.indexOf('</head>')).matchAll(/<link\b[^>]*(?:fonts.googleapis.com|fonts.gstatic.com)[^>]*>/g)].map(match => match[0]).join('\n');
  const alternates = ['en', 'id', 'ms'].map(other => `<link rel="alternate" hreflang="${other}" href="https://broswisata.id/${other}/indonesia-visa"/>`).join('\n');
  const body = `<main id="main-content">
<section class="visa-hero" id="visa-intro" aria-labelledby="visa-title">
<div class="visa-shell">
<div class="visa-hero-grid">
<div><div class="visa-heading-meta">${countryMark(lang)}<p class="visa-eyebrow">${escape(c.eyebrow)}</p></div>
<h1 class="visa-title font-display" id="visa-title">${escape(c.heading)}</h1>
<p class="visa-lead">${escape(c.intro)}</p>
<div class="visa-actions">${whatsapp(c, 'hero')}<a class="visa-text-link" href="#visa-pricing">${escape(rateLabels[lang].jump)} <span aria-hidden="true">↓</span></a></div>
</div>
<aside class="visa-desk-card" aria-labelledby="visa-desk-name">
<img src="/bros-wisata-logos/bros-wisata-logo-horizontal-white.svg" width="300" height="80" alt="BROS Wisata — Hub of Sumatra"/>
<p class="visa-eyebrow">${escape(c.desk)}</p><div class="visa-desk-top"><img class="visa-person-avatar" src="/assets/visa/ms-yana-avatar-v1.webp" width="80" height="80" alt="${lang==='en'?'Illustrated avatar for Ms Yana':'Ilustrasi avatar Ms Yana'}" decoding="async"/><div><h2 id="visa-desk-name">Ms Yana</h2><p>${escape(c.role)}</p></div></div>
<div class="visa-desk-illustration"><div><p>${escape(c.deskCopy)}</p><div class="visa-travel-motif" aria-hidden="true">${icon('passport')}${icon('coordinate')}</div></div><img class="visa-mascot" src="/assets/visa/bros-visa-companion.webp" width="512" height="768" alt="" aria-hidden="true" decoding="async"/></div><a class="visa-desk-phone" href="https://wa.me/${phone}?text=${encodeURIComponent(c.message)}" data-cta="visa_desk_phone" target="_blank" rel="noopener noreferrer">${icon('chat')}<span>+62 813-7023-3750</span> <span aria-hidden="true">↗</span></a>
<div class="visa-partner">${escape(c.deskNote)}</div>
</aside>
</div><ul class="visa-strip">${c.status.map(s => `<li>${escape(s)}</li>`).join('')}</ul>
</div></section>
${pricing(lang, c)}
<section class="visa-section visa-section--white" id="visa-services" aria-labelledby="visa-services-title"><div class="visa-shell">
<div class="visa-section-heading"><p class="visa-eyebrow">${escape(c.servicesEyebrow)}</p><h2 class="font-display" id="visa-services-title">${escape(c.servicesTitle)}</h2><p>${escape(c.servicesIntro)}</p></div>
<div class="visa-services-grid">${serviceCards(lang,c)}</div>
<p class="visa-note">${escape(c.scopeNote)}</p></div></section>
<section class="visa-section" id="visa-process" aria-labelledby="visa-process-title"><div class="visa-shell">
<div class="visa-section-heading"><p class="visa-eyebrow">${escape(c.processEyebrow)}</p><h2 class="font-display" id="visa-process-title">${escape(c.processTitle)}</h2></div>
<ol class="visa-step-grid">${c.steps.map(([title, description], i) => `<li class="visa-step"><div class="visa-step-top">${icon(['chat','review','document','coordinate'][i])}<span class="visa-step-no" aria-hidden="true">${i + 1}</span></div><h3>${escape(title)}</h3><p>${escape(description)}</p></li>`).join('\n')}</ol>
</div></section>
<section class="visa-section visa-section--white" id="visa-prepare" aria-labelledby="visa-prepare-title"><div class="visa-shell visa-check-grid">
<div><h2 class="font-display" id="visa-prepare-title">${escape(c.prepareTitle)}</h2><p>${escape(c.prepareCopy)}</p><ul class="visa-check-list">${c.checklist.map(line => `<li>${escape(line)}</li>`).join('')}</ul></div>
<aside class="visa-note"><h3>${escape(c.privacyTitle)}</h3><p>${escape(c.privacyCopy)}</p><a class="visa-text-link" href="/${lang}/privacy-policy#visa-data-guidance">${escape(c.privacyLink)} <span aria-hidden="true">→</span></a></aside>
</div></section>
<section class="visa-section" id="visa-partnership" aria-labelledby="visa-partner-title"><div class="visa-shell visa-partner-grid">
<div><p class="visa-eyebrow">BROS WISATA · INDONESIA VISA DESK</p><h2 class="font-display" id="visa-partner-title">${escape(c.boundaryTitle)}</h2><p>${escape(c.boundaryCopy)}</p>${whatsapp(c, 'service_team')}</div>
<div class="visa-note"><h3>${escape(c.quoteTitle)}</h3><p>${escape(c.quoteCopy)}</p><p class="visa-small">${escape(c.timingCopy)}</p></div>
</div></section>
<section class="visa-section visa-section--white" id="visa-faq" aria-labelledby="visa-faq-title"><div class="visa-shell">
<div class="visa-section-heading"><h2 class="font-display" id="visa-faq-title">${escape(c.faqTitle)}</h2></div><div class="visa-faq">${c.faq.map(([q, a]) => `<details><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('\n')}</div>
</div></section>
<section class="visa-section visa-final" id="visa-contact" aria-labelledby="visa-contact-title"><div class="visa-shell visa-check-grid"><div><p class="visa-eyebrow">${escape(c.desk)}</p><h2 class="font-display" id="visa-contact-title">${escape(c.finalTitle)}</h2><p>${escape(c.finalCopy)}</p></div><div><p class="visa-contact-name">Ms Yana</p><p>+62 813-7023-3750</p>${whatsapp(c, 'contact')}<p><a class="visa-text-link" href="/${lang}/bros-wisata-contact">${escape(c.tourLink)} <span aria-hidden="true">→</span></a></p></div></div></section>
<section class="visa-section visa-sources" aria-labelledby="visa-refs-title"><div class="visa-shell"><h2 id="visa-refs-title">${escape(c.refsTitle)}</h2><ul class="visa-source-links">${Object.values(sourceLinks).map((href, i) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${escape(c.refs[i])} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul><p class="visa-small">${escape(c.reviewed)}</p></div></section>
</main>`;
  const html = `<!DOCTYPE html>
<html lang="${lang}"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escape(c.title)}</title>
<meta name="title" content="${escape(c.title)}"/>
<meta name="description" content="${escape(c.description)}"/>
<meta name="author" content="PT BROS INTI WISATA"/>
<meta name="robots" content="index, follow"/>
<meta name="language" content="${c.langName}"/>
<link rel="canonical" href="${url}"/>
<link rel="alternate" hreflang="x-default" href="https://broswisata.id/en/indonesia-visa"/>
${alternates}
<meta property="og:type" content="website"/>
<meta property="og:url" content="${url}"/>
<meta property="og:title" content="${escape(c.servicesTitle + ' — BROS Wisata')}"/>
<meta property="og:description" content="${escape(c.description)}"/>
<meta property="og:image" content="https://broswisata.id/assets/og/${lang}/indonesia-visa.jpg"/>
<meta property="og:image:type" content="image/jpeg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="${escape(c.servicesTitle + ' — BROS Wisata')}"/>
<meta property="og:site_name" content="BROS Wisata — Hub of Sumatra"/>
<meta property="og:locale" content="${c.locale}"/>
${Object.values(copy).filter(other => other !== c).map(other => `<meta property="og:locale:alternate" content="${other.locale}"/>`).join('\n')}
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escape(c.servicesTitle + ' — BROS Wisata')}"/>
<meta name="twitter:description" content="${escape(c.description)}"/>
<meta name="twitter:image" content="https://broswisata.id/assets/og/${lang}/indonesia-visa.jpg"/>
<meta name="twitter:image:alt" content="${escape(c.servicesTitle + ' — BROS Wisata')}"/>
<link href="/bros-wisata-logos/bros-wisata-icon-square-favicon-32px.png" rel="icon" sizes="32x32" type="image/png"/>
<link href="/bros-wisata-logos/bros-wisata-icon-round-large-512px.png" rel="apple-touch-icon"/>
${fonts}
<link href="/assets/style.css" rel="stylesheet"/>
<link href="/assets/bros-ui.css" rel="stylesheet"/>
<link href="/assets/visa-services.css?v=20261028-yana" rel="stylesheet"/>
<script type="application/ld+json">${JSON.stringify(schema(lang, c), null, 2).replace(/</g, '\\u003c')}</script>
${analytics}
</head>
${header}
${body}
${footer}
${whatsapp(c, 'floating', 'Visa · Ms Yana').replace('class="visa-button"', 'class="visa-float"')}
${menu.replace("if (e.key === 'Escape') closeMenu();", "if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) { closeMenu(); mobileBtn.focus(); }")}
<script src="${sharedScript}" defer></script>
</body></html>
`;
  return synchronizePage(html, lang, navigationLabels[lang], `${lang}/indonesia-visa.html`);
}
function homeBand(lang, c) {
  return `<!-- INDONESIA VISA SERVICE START -->
<section class="visa-home-band" id="indonesia-visa-service" aria-labelledby="visa-home-title"><div class="visa-shell visa-home-grid">
<div class="visa-home-copy"><p class="visa-eyebrow">${escape(c.homeEyebrow)}</p><h2 class="font-display" id="visa-home-title">${escape(c.homeTitle)}</h2><p>${escape(c.homeCopy)}</p><a class="visa-text-link" href="/${lang}/indonesia-visa">${escape(c.homeView)} <span aria-hidden="true">→</span></a></div>
<div class="visa-home-contact"><p class="visa-eyebrow">${escape(c.desk)}</p><div class="visa-home-person"><img class="visa-person-avatar" src="/assets/visa/ms-yana-avatar-v1.webp" width="80" height="80" alt="${lang==='en'?'Illustrated avatar for Ms Yana':'Ilustrasi avatar Ms Yana'}" loading="lazy" decoding="async"/><div><h3>Ms Yana</h3><p>+62 813-7023-3750</p></div></div>${whatsapp(c, 'homepage')}<p class="visa-small">${escape(c.deskNote)}</p></div>
</div></section>
<!-- INDONESIA VISA SERVICE END -->`;
}

for (const [lang, c] of Object.entries(copy)) {
  const homepage = fs.readFileSync(path.join(root, lang, 'index.html'), 'utf8');
  save(`${lang}/indonesia-visa.html`, page(lang, c, homepage));
  for (const file of ['index.html', 'bros-wisata-homepage.html']) {
    const original = fs.readFileSync(path.join(root, lang, file), 'utf8');
    const newline = original.includes('\r\n') ? '\r\n' : '\n';
    let html = original.replace(/\r\n/g, '\n');
    const block = homeBand(lang, c);
    if (html.includes('<!-- INDONESIA VISA SERVICE START -->')) {
      html = html.replace(/<!-- INDONESIA VISA SERVICE START -->[\s\S]*?<!-- INDONESIA VISA SERVICE END -->/, block);
    } else {
      const anchor = '<!-- ======= GOOGLE REVIEWS ======= -->';
      if (!html.includes(anchor)) throw new Error(`Missing home entry anchor ${lang}/${file}`);
      html = html.replace(anchor, block + '\n' + anchor);
    }
    if (!html.includes('/assets/visa-services.css')) html = html.replace('</head>', '<link href="/assets/visa-services.css?v=20261028-yana" rel="stylesheet"/>\n</head>');
    html = html.replace(/(<link\b[^>]*href="\/assets\/visa-services\.css)(?:\?[^\"]*)?"/g, '$1?v=20261028-yana"');
    save(`${lang}/${file}`, html.replace(/\n/g, newline));
  }
}

if (check && updates.length) throw new Error(`Visa content differs: ${updates.map(x => x.relative).join(', ')}`);
if (!check) for (const update of updates) fs.writeFileSync(update.file, update.content, 'utf8');
console.log(check ? 'Visa service content is synchronized in ID, EN and MS.' : `Generated visa service content in ${updates.length} files.`);
