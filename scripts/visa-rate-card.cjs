// Customer-facing reference tariffs. Keep research provenance and commercial
// arrangements outside website source. A tariff is not an eligibility decision.
const rates = [
  {code: 'C1', amount: 3500000, basis: 'single', names: ['Wisata', 'Tourism', 'Pelancongan']},
  {code: 'C2', amount: 4500000, basis: 'single', names: ['Kunjungan bisnis', 'Business visits', 'Lawatan perniagaan']},
  {code: 'C6', amount: 4500000, basis: 'single', names: ['Kegiatan sosial', 'Social activities', 'Aktiviti sosial']},
  {code: 'C7', amount: 4500000, basis: 'single', names: ['Penampilan seni & budaya', 'Arts & cultural performances', 'Persembahan seni & budaya']},
  {code: 'C9', amount: 4500000, basis: 'single', names: ['Studi singkat, kursus & pelatihan', 'Short study, courses & training', 'Pengajian singkat, kursus & latihan']},
  {code: 'C15', amount: 4500000, basis: 'single', names: ['Penanganan keadaan darurat', 'Emergency response activities', 'Pengendalian keadaan kecemasan']},
  {code: 'C17', amount: 4500000, basis: 'single', names: ['Audit, kendali mutu & inspeksi', 'Audit, quality control & inspection', 'Audit, kawalan mutu & pemeriksaan']},
  {code: 'D2', amount: 5500000, basis: 'year', names: ['Bisnis · multiple entry', 'Business · multiple entry', 'Perniagaan · berbilang kemasukan']},
  {code: 'D12', amount: 5500000, basis: 'year', names: ['Pra-investasi · multiple entry', 'Pre-investment · multiple entry', 'Pra-pelaburan · berbilang kemasukan']},
  {code: 'D17', amount: 5500000, basis: 'year', names: ['Audit & inspeksi · multiple entry', 'Audit & inspection · multiple entry', 'Audit & pemeriksaan · berbilang kemasukan']},
  {code: 'E28A', amount: 15350000, basis: 'twoYears', names: ['Investor · opsi 2 tahun', 'Investor · 2-year option', 'Pelabur · pilihan 2 tahun']},
];

const labels = {
  id: {
    index: 0, eyebrow: 'Rate card · Indonesia Visa Desk', title: 'Tarif layanan, lebih jelas sejak awal.',
    intro: 'Tarif acuan layanan BROS Wisata dalam rupiah (IDR). Ms Yana akan mengonfirmasi kategori, kelayakan, cakupan dan rincian biaya untuk kebutuhan Anda sebelum pembayaran.',
    jump: 'Lihat rate card visa', ask: 'Tanya tarif ini', more: 'Buka tarif layanan lainnya',
    single: 'Sekali masuk', year: '/ tahun', twoYears: '/ 2 tahun',
    consultationTitle: 'Layanan lain? Konsultasikan dulu.',
    consultation: 'Untuk D1, C12, C13, C16, C18, KITAS kerja, keluarga, pendidikan, penelitian, KITAP, VoA, perpanjangan atau alih status, minta pilihan dan penawaran tertulis dari Ms Yana. Tarif tidak disamaratakan untuk semua varian.',
    disclaimer: 'Ini tarif acuan layanan Bros, bukan daftar tarif resmi pemerintah. Komponen biaya, persyaratan dan harga yang berlaku untuk kasus Anda dijelaskan dalam penawaran tertulis. Label per tahun atau 2 tahun bukan izin untuk tinggal terus-menerus selama periode tersebut; batas setiap masa tinggal mengikuti izin yang diberikan.',
    checked: 'Tarif ditinjau 28 Oktober 2026 · Konfirmasi kembali sebelum membayar.',
    faq: 'Rate card memuat tarif acuan beberapa layanan, mulai Rp3.500.000 untuk C1. Harga dan rincian biaya yang berlaku untuk kebutuhan Anda dikonfirmasi Ms Yana dalam penawaran tertulis. Perkiraan proses bergantung pada kategori, dokumen dan pemeriksaan otoritas; tidak ada proses kilat atau tanggal selesai yang dijamin.',
  },
  en: {
    index: 1, eyebrow: 'Rate card · Indonesia Visa Desk', title: 'Clearer service rates from the start.',
    intro: 'BROS Wisata reference service rates in Indonesian rupiah (IDR). Before payment, Ms Yana will confirm the category, eligibility, scope and fee breakdown for your needs.',
    jump: 'View the visa rate card', ask: 'Enquire about this rate', more: 'View other service rates',
    single: 'Single entry', year: '/ year', twoYears: '/ 2 years',
    consultationTitle: 'Looking for another service?',
    consultation: 'For D1, C12, C13, C16, C18, employment, family, education or research KITAS, KITAP, visa on arrival, extensions or status changes, ask Ms Yana for the options and a written quotation. One rate does not apply to every variant.',
    disclaimer: 'These are Bros reference service rates, not an official government fee schedule. The fee components, requirements and applicable price for your case are explained in a written quotation. A yearly or 2-year price label is not permission to stay continuously for that period; each stay is governed by the permission granted.',
    checked: 'Rates reviewed on 28 October 2026 · Reconfirm before paying.',
    faq: 'The rate card lists reference prices for selected services, starting at Rp3.500.000 for C1. Ms Yana confirms the applicable price and fee breakdown for your needs in a written quotation. Processing estimates depend on the category, documents and official review; express processing or a completion date is not guaranteed.',
  },
  ms: {
    index: 2, eyebrow: 'Rate card · Indonesia Visa Desk', title: 'Kadar perkhidmatan, lebih jelas dari awal.',
    intro: 'Kadar rujukan perkhidmatan BROS Wisata dalam rupiah Indonesia (IDR). Ms Yana akan mengesahkan kategori, kelayakan, skop dan pecahan bayaran untuk keperluan anda sebelum pembayaran.',
    jump: 'Lihat rate card visa', ask: 'Tanya kadar ini', more: 'Buka kadar perkhidmatan lain',
    single: 'Sekali masuk', year: '/ tahun', twoYears: '/ 2 tahun',
    consultationTitle: 'Perlukan perkhidmatan lain?',
    consultation: 'Untuk D1, C12, C13, C16, C18, KITAS pekerjaan, keluarga, pendidikan, penyelidikan, KITAP, visa semasa ketibaan, lanjutan atau pertukaran status, minta pilihan dan sebut harga bertulis daripada Ms Yana. Satu kadar tidak terpakai kepada semua pilihan.',
    disclaimer: 'Ini kadar rujukan perkhidmatan Bros, bukan jadual bayaran rasmi kerajaan. Komponen bayaran, syarat dan harga yang terpakai untuk kes anda dijelaskan dalam sebut harga bertulis. Label setahun atau 2 tahun bukan kebenaran tinggal berterusan sepanjang tempoh itu; setiap tempoh tinggal mengikut permit yang diberikan.',
    checked: 'Kadar disemak pada 28 Oktober 2026 · Sahkan semula sebelum membayar.',
    faq: 'Rate card memaparkan kadar rujukan bagi beberapa perkhidmatan, bermula Rp3.500.000 untuk C1. Ms Yana mengesahkan harga dan pecahan bayaran yang terpakai melalui sebut harga bertulis. Anggaran proses bergantung pada kategori, dokumen dan semakan pihak berkuasa; proses ekspres atau tarikh siap tidak dijamin.',
  },
};

module.exports = {rates, labels};
