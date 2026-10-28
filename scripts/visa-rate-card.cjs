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

// Static budget estimates, not USD quotations or a payment-currency offer.
// The dated calculation receipt and rate provenance remain internal.
const usdEstimates = {
  C1: 205,
  C2: 260,
  C6: 260,
  C7: 260,
  C9: 260,
  C15: 260,
  C17: 260,
  D2: 320,
  D12: 320,
  D17: 320,
  E28A: 885,
};

const labels = {
  id: {
    index: 0, eyebrow: 'Rate card · Indonesia Visa Desk', title: 'Tarif layanan, lebih jelas sejak awal.',
    intro: 'Tarif acuan BROS Wisata tetap dalam rupiah (IDR), dengan estimasi anggaran USD sebagai informasi tambahan. Kategori, kelayakan dan rincian biaya dikonfirmasi Ms Yana sebelum pembayaran.',
    usdNote: 'Estimasi anggaran USD memakai acuan Bank Notes Mandiri 28 Oktober 2026 dengan cadangan fluktuasi kurs dan pembulatan. Bukan penawaran atau tagihan USD; tarif dan penagihan tetap Rupiah (IDR). Jumlah akhir mengikuti penawaran tertulis.',
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
    intro: 'BROS Wisata reference rates remain in Indonesian rupiah (IDR), with a supplementary USD budget estimate. Ms Yana confirms the category, eligibility and fee breakdown before payment.',
    usdNote: 'USD budget estimates use the Mandiri Bank Notes reference dated 28 October 2026 with an exchange-rate allowance and rounding. They are not USD quotations or payment offers; prices and invoices remain in IDR. The written quotation determines the final amount.',
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
    intro: 'Kadar rujukan BROS Wisata kekal dalam rupiah Indonesia (IDR), dengan anggaran bajet USD sebagai maklumat tambahan. Ms Yana mengesahkan kategori, kelayakan dan pecahan bayaran sebelum pembayaran.',
    usdNote: 'Anggaran bajet USD menggunakan rujukan Bank Notes Mandiri 28 Oktober 2026 dengan peruntukan turun naik kadar tukaran dan pembundaran. Bukan sebut harga atau tawaran pembayaran USD; kadar dan invois kekal dalam IDR. Jumlah akhir mengikut sebut harga bertulis.',
    jump: 'Lihat rate card visa', ask: 'Tanya kadar ini', more: 'Buka kadar perkhidmatan lain',
    single: 'Sekali masuk', year: '/ tahun', twoYears: '/ 2 tahun',
    consultationTitle: 'Perlukan perkhidmatan lain?',
    consultation: 'Untuk D1, C12, C13, C16, C18, KITAS pekerjaan, keluarga, pendidikan, penyelidikan, KITAP, visa semasa ketibaan, lanjutan atau pertukaran status, minta pilihan dan sebut harga bertulis daripada Ms Yana. Satu kadar tidak terpakai kepada semua pilihan.',
    disclaimer: 'Ini kadar rujukan perkhidmatan Bros, bukan jadual bayaran rasmi kerajaan. Komponen bayaran, syarat dan harga yang terpakai untuk kes anda dijelaskan dalam sebut harga bertulis. Label setahun atau 2 tahun bukan kebenaran tinggal berterusan sepanjang tempoh itu; setiap tempoh tinggal mengikut permit yang diberikan.',
    checked: 'Kadar disemak pada 28 Oktober 2026 · Sahkan semula sebelum membayar.',
    faq: 'Rate card memaparkan kadar rujukan bagi beberapa perkhidmatan, bermula Rp3.500.000 untuk C1. Ms Yana mengesahkan harga dan pecahan bayaran yang terpakai melalui sebut harga bertulis. Anggaran proses bergantung pada kategori, dokumen dan semakan pihak berkuasa; proses ekspres atau tarikh siap tidak dijamin.',
  },
};

function formatRateAmount(rate, lang) {
  const l = labels[lang];
  const estimate = usdEstimates[rate.code];
  if (!l || !Number.isFinite(estimate)) throw new Error('Unknown visa rate or language');
  const amount = `Rp${new Intl.NumberFormat('id-ID').format(rate.amount)}`;
  const period = rate.basis === 'single' ? '' : l[rate.basis];
  if (typeof period !== 'string') throw new Error('Unknown visa rate period: ' + rate.basis);
  const prefix = {id: 'Estimasi', en: 'Approx.', ms: 'Anggaran'}[lang];
  const periodMarkup = period ? `<span>${period}</span>` : '';
  const estimatePeriod = period ? ` ${period}` : '';
  return `${amount}${periodMarkup}<span class="visa-usd-estimate" data-currency="USD" data-estimate-usd="${estimate}">${prefix} US$${estimate}${estimatePeriod}</span>`;
}

module.exports = {rates, labels, usdEstimates, formatRateAmount};
