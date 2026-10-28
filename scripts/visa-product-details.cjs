// Original customer-facing service explanations. Prices remain exclusively in
// visa-rate-card.cjs. Document lists are preparation guidance, not a decision
// on eligibility, a complete mandatory checklist, or a promise of approval.
const classification = {
  url: 'https://itjen.kemenimipas.go.id/dokumen/preview/20',
  title: 'Klasifikasi Visa Indonesia — Keputusan Menteri M.IP-08.GR.01.01 Tahun 2025',
};
const officialList = {
  url: 'https://kanwilsultra.imigrasi.go.id/wna/daftar-visa-indonesia',
  title: 'Daftar Visa Indonesia — Imigrasi Sulawesi Tenggara',
};
const investorGuide = {
  url: 'https://bontang.imigrasi.go.id/layanan-publik/kategori/wna/sub/informasi-visa-republik-indonesia',
  title: 'Informasi Visa Republik Indonesia — Imigrasi Bontang',
};
const businessConsularGuide = {
  url: 'https://kemlu.go.id/files/childmenu/additional_file/177212066469a06a5823703_2026__VISA__Requisitos_de_Visa_C1_C4__Ind___ok_.pdf',
  title: 'Informasi Visa C1–C4 — KBRI Mexico City, Februari 2026',
};
const applicationRules = {
  url: 'https://peraturan.bpk.go.id/Download/344251/Permenkumham%20Nomor%2011%20Tahun%202024.pdf',
  title: 'Permenkumham 11 Tahun 2024 — Persyaratan Visa Kunjungan, Pasal 19 dan 24',
};

const products = {
  C1: {
    icon: 'passport', group: 'visit', sources: [investorGuide, classification],
    copy: {
      id: {
        summary: 'Bantuan visa kunjungan sekali masuk bagi WNA yang merencanakan liburan atau kunjungan ke Indonesia, dengan pemeriksaan kebutuhan oleh Ms Yana.',
        purpose: 'Untuk berwisata dan kegiatan kunjungan yang sesuai dengan kategori yang diberikan. Ceritakan rencana sebenarnya, bukan hanya tanggal perjalanan, agar pilihan visa tidak tertukar dengan kebutuhan bekerja atau kegiatan profesional.',
        stay: 'Masa tinggal awal maksimal 60 hari sejak kedatangan. Jendela penggunaan pertama 90 hari sejak penerbitan visa berbeda dari izin tinggal setelah masuk.',
        documents: [
          'Paspor kebangsaan dengan sisa berlaku sekurang-kurangnya 6 bulan; dokumen perjalanan lain perlu pemeriksaan khusus.',
          'Rekening koran 3 bulan terakhir dengan bukti dana hidup minimal setara USD2.000.',
          'Pasfoto berwarna terbaru sesuai format pengajuan yang berlaku.',
          'Tujuan, rencana tanggal, dan lama kunjungan untuk menyusun checklist akhir yang sesuai.',
        ],
        limits: [
          'Kebutuhan penjamin dapat berbeda menurut kewarganegaraan dan dokumen perjalanan; jangan menganggap semua pemohon bebas penjamin.',
          'Visa wisata bukan izin untuk menerima upah dari pekerjaan di Indonesia.',
          'Perpanjangan ditinjau terpisah. Permohonan yang masih diproses tidak otomatis memperpanjang masa tinggal.',
        ],
      },
      en: {
        summary: 'Single-entry visit-visa assistance for foreign nationals planning a holiday or visit to Indonesia, with an initial needs review by Ms Yana.',
        purpose: 'For tourism and visit activities consistent with the category granted. Explain your actual plans, not only your travel dates, so a visit application is not confused with employment or professional-activity requirements.',
        stay: 'The initial stay is up to 60 days from arrival. The 90-day first-use window after visa issuance is different from permission to stay after entry.',
        documents: [
          'A national passport with at least 6 months remaining; other travel documents need a separate review.',
          'Bank statements for the last 3 months showing living funds equivalent to at least USD2,000.',
          'A recent colour photograph in the format required for the application route.',
          'Your purpose, intended dates and length of visit to establish the final checklist.',
        ],
        limits: [
          'Guarantor requirements can vary by nationality and travel document; do not assume every applicant can apply without one.',
          'A tourist visa is not permission to receive wages for work in Indonesia.',
          'Extensions require a separate review. A pending application does not automatically extend permission to stay.',
        ],
      },
      ms: {
        summary: 'Bantuan visa lawatan sekali masuk untuk warga asing yang merancang percutian atau lawatan ke Indonesia, dengan semakan awal oleh Ms Yana.',
        purpose: 'Untuk pelancongan dan aktiviti lawatan yang sepadan dengan kategori yang diberikan. Kongsikan rancangan sebenar, bukan tarikh sahaja, supaya permohonan lawatan tidak dikelirukan dengan keperluan pekerjaan atau aktiviti profesional.',
        stay: 'Tempoh tinggal awal sehingga 60 hari dari ketibaan. Tempoh penggunaan pertama 90 hari selepas visa diterbitkan berbeza daripada kebenaran tinggal selepas masuk.',
        documents: [
          'Pasport kebangsaan yang berbaki sekurang-kurangnya 6 bulan; dokumen perjalanan lain memerlukan semakan khusus.',
          'Penyata bank 3 bulan terkini yang menunjukkan dana sara hidup sekurang-kurangnya bersamaan USD2,000.',
          'Foto berwarna terkini mengikut format laluan permohonan yang berkenaan.',
          'Tujuan, tarikh jangkaan dan tempoh lawatan untuk menentukan senarai dokumen akhir.',
        ],
        limits: [
          'Keperluan penjamin boleh berbeza mengikut kewarganegaraan dan dokumen perjalanan; bukan semua pemohon dikecualikan.',
          'Visa pelancong bukan kebenaran menerima upah daripada pekerjaan di Indonesia.',
          'Lanjutan memerlukan semakan berasingan. Permohonan yang sedang diproses tidak melanjutkan permit tinggal secara automatik.',
        ],
      },
    },
  },
  C2: {
    icon: 'business', group: 'business', sources: [businessConsularGuide, classification],
    copy: {
      id: {
        summary: 'Pilihan kunjungan bisnis sekali masuk untuk agenda yang jelas, seperti rapat, negosiasi, pembelian barang, atau pembahasan perjanjian bisnis.',
        purpose: 'Jelaskan perusahaan yang dikunjungi, hubungan bisnis, lokasi dan kegiatan yang direncanakan. Kunjungan untuk membahas kerja sama tidak sama dengan bekerja rutin, menerima upah, atau mengelola operasional sehari-hari.',
        stay: 'Panduan konsuler C1–C4 menyebut sekali masuk dengan masa tinggal maksimal 60 hari dan penggunaan visa dalam 90 hari setelah penerbitan. Rute pengajuan perlu dikonfirmasi untuk pemohon.',
        documents: [
          'Paspor dan pasfoto terbaru untuk pemeriksaan awal kelayakan dokumen.',
          'Undangan, korespondensi, atau keterangan hubungan dengan pihak bisnis di Indonesia.',
          'Rencana perjalanan, penginapan dan tiket keluar dapat diminta sesuai jalur pengajuan.',
          'Bukti kemampuan membiayai kunjungan serta dokumen penjamin diperiksa menurut profil pemohon.',
        ],
        limits: [
          'Checklist kedutaan atau konsulat tidak otomatis berlaku sama bagi seluruh kewarganegaraan dan jalur eVisa.',
          'C2 bukan izin bekerja umum atau menerima upah dari perusahaan Indonesia.',
          'Agenda tambahan atau perubahan kegiatan perlu ditinjau sebelum pengajuan, bukan setelah visa diterbitkan.',
        ],
      },
      en: {
        summary: 'A single-entry business-visit option for a defined agenda, such as meetings, negotiations, purchasing goods or discussing business agreements.',
        purpose: 'Explain the company you will visit, your business relationship, the locations and planned activities. Visiting to discuss cooperation is different from routine employment, receiving wages or running day-to-day operations.',
        stay: 'The C1–C4 consular guide describes single entry, a stay of up to 60 days and use within 90 days of issuance. Confirm the applicable application route for your case.',
        documents: [
          'Passport and a recent photograph for the initial document review.',
          'An invitation, correspondence or explanation of your relationship with the Indonesian business.',
          'Itinerary, accommodation and an onward or return ticket may be requested by the application route.',
          'Evidence of financial means and guarantor documents are reviewed for the applicant profile.',
        ],
        limits: [
          'An embassy or consular checklist does not automatically apply identically to every nationality or eVisa route.',
          'C2 is not a general work permit or permission to receive wages from an Indonesian company.',
          'Additional activities or changes of purpose need review before applying, not after the visa is issued.',
        ],
      },
      ms: {
        summary: 'Pilihan lawatan perniagaan sekali masuk untuk agenda tertentu seperti mesyuarat, rundingan, pembelian barang atau perbincangan perjanjian perniagaan.',
        purpose: 'Nyatakan syarikat yang dilawati, hubungan perniagaan, lokasi dan aktiviti yang dirancang. Lawatan untuk membincangkan kerjasama berbeza daripada pekerjaan rutin, menerima upah atau mengurus operasi harian.',
        stay: 'Panduan konsular C1–C4 menyatakan sekali masuk, tempoh tinggal sehingga 60 hari dan penggunaan dalam 90 hari selepas penerbitan. Sahkan laluan permohonan yang terpakai untuk kes anda.',
        documents: [
          'Pasport dan foto terkini untuk semakan dokumen awal.',
          'Surat jemputan, surat-menyurat atau penjelasan hubungan dengan perniagaan di Indonesia.',
          'Jadual perjalanan, penginapan dan tiket pulang atau seterusnya mungkin diminta mengikut laluan permohonan.',
          'Bukti kemampuan kewangan dan dokumen penjamin disemak mengikut profil pemohon.',
        ],
        limits: [
          'Senarai kedutaan atau konsulat tidak semestinya terpakai sama kepada semua kewarganegaraan dan laluan eVisa.',
          'C2 bukan permit kerja umum atau kebenaran menerima upah daripada syarikat Indonesia.',
          'Aktiviti tambahan atau perubahan tujuan perlu disemak sebelum permohonan, bukan selepas visa diterbitkan.',
        ],
      },
    },
  },
  C6: {
    icon: 'home', group: 'special', sources: [classification, officialList, applicationRules],
    copy: {
      id: {
        summary: 'Kunjungan untuk kegiatan sosial atau kemanusiaan yang sesuai kategorinya, termasuk rencana kerelawanan yang perlu ditinjau bersama pihak penyelenggara.',
        purpose: 'Ceritakan siapa penyelenggaranya, penerima manfaat, lokasi, durasi kegiatan dan peran Anda. Label relawan saja belum menentukan kelayakan; bentuk kegiatan dan hubungannya dengan organisasi perlu diperiksa sebelum memilih pengajuan.',
        stay: 'Masa tinggal mengikuti subkategori dan izin yang diberikan. Ms Yana meninjau rencana kegiatan dan tanggal sebelum mengonfirmasi ketentuan yang berlaku.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Penjelasan kegiatan sosial, lokasi dan peran yang akan dijalankan.',
          'Siapkan keterangan instansi pemerintah atau lembaga swasta mengenai rincian kegiatan dan perjalanan.',
          'Bukti biaya hidup dan kebutuhan penjamin diperiksa; rekomendasi atau izin sektoral disesuaikan kegiatan.',
        ],
        limits: [
          'Kegiatan harus sesuai izin; status sosial atau relawan bukan izin bekerja umum.',
          'Jangan menganggap semua organisasi dan bentuk kerelawanan memenuhi syarat yang sama.',
          'Persetujuan tetap pada otoritas, dan pengajuan yang sedang diproses tidak otomatis memperpanjang izin tinggal.',
        ],
      },
      en: {
        summary: 'A visit category for relevant social or humanitarian activities, including volunteer plans that need review with the organising institution.',
        purpose: 'Describe the organiser, beneficiaries, location, activity dates and your role. Calling an activity volunteering does not establish eligibility; its actual form and relationship with the organisation need review before selecting the application.',
        stay: 'The stay follows the applicable subcategory and permission granted. Ms Yana reviews your activity plan and dates before confirming the relevant conditions.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'An explanation of the social activity, locations and your intended role.',
          'Prepare a government or private-institution statement detailing the activities and itinerary.',
          'Living-funds evidence and guarantor needs are checked; recommendations or sector permits depend on the activity.',
        ],
        limits: [
          'Activities must match the permission; social or volunteer status is not a general work permit.',
          'Do not assume every organisation or form of volunteering has identical requirements.',
          'Approval remains with the authorities, and a pending application does not automatically extend permission to stay.',
        ],
      },
      ms: {
        summary: 'Kategori lawatan bagi aktiviti sosial atau kemanusiaan yang berkaitan, termasuk rancangan sukarelawan yang perlu disemak bersama organisasi penganjur.',
        purpose: 'Nyatakan penganjur, penerima manfaat, lokasi, tarikh kegiatan dan peranan anda. Menamakan aktiviti sebagai sukarelawan tidak menentukan kelayakan; bentuk sebenar dan hubungan dengan organisasi perlu disemak sebelum memilih permohonan.',
        stay: 'Tempoh tinggal mengikut subkategori dan permit yang diberikan. Ms Yana menyemak rancangan aktiviti serta tarikh sebelum mengesahkan syarat yang berkenaan.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Penjelasan aktiviti sosial, lokasi serta peranan yang dirancang.',
          'Sediakan surat agensi kerajaan atau institusi swasta yang memperincikan aktiviti dan perjalanan.',
          'Bukti dana sara hidup dan keperluan penjamin disemak; syor atau permit sektor mengikut aktiviti.',
        ],
        limits: [
          'Aktiviti mesti sepadan dengan permit; status sosial atau sukarelawan bukan permit kerja umum.',
          'Bukan semua organisasi atau bentuk aktiviti sukarelawan mempunyai syarat yang sama.',
          'Kelulusan kekal pada pihak berkuasa, dan permohonan yang diproses tidak melanjutkan permit tinggal secara automatik.',
        ],
      },
    },
  },
  C7: {
    icon: 'coordinate', group: 'special', sources: [classification, officialList, applicationRules],
    copy: {
      id: {
        summary: 'Jalur kunjungan untuk penampilan seni atau budaya, dengan pemeriksaan subindeks C7 yang tepat sesuai acara, peran dan bentuk keterlibatan Anda.',
        purpose: 'Sampaikan jenis penampilan, penyelenggara, lokasi acara, tanggal dan hubungan kontraktual atau pembayaran bila ada. Kategori seni dan budaya memiliki subindeks; nama acara saja tidak cukup untuk menentukan pilihan visa.',
        stay: 'Masa tinggal dan ketentuan masuk mengikuti subindeks yang dipilih serta izin yang diberikan. Ms Yana memeriksa detail acara sebelum memberikan arahan pengajuan.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Profil penampil atau kelompok, jadwal acara dan penjelasan peran.',
          'Siapkan undangan penyelenggara; jalur musisi atau pendukung tertentu memerlukan pemeriksaan impresariat dan kontrak.',
          'Bukti biaya hidup, penjamin, rekomendasi dan izin kegiatan diperiksa menurut subindeks yang relevan.',
        ],
        limits: [
          'Subindeks C7 harus ditinjau secara spesifik; jangan menganggap semua penampilan memakai syarat yang sama.',
          'Ketentuan imbalan dan kegiatan profesional harus diperiksa, bukan diasumsikan diperbolehkan oleh label seniman.',
          'Persetujuan dan izin masuk tidak dijamin; jangan menganggap permohonan tertunda memperpanjang masa tinggal.',
        ],
      },
      en: {
        summary: 'A visit route for arts or cultural performances, with the relevant C7 sub-index reviewed against the event, your role and the form of participation.',
        purpose: 'Explain the performance, organiser, venue, dates and any contractual or payment arrangement. Arts and cultural categories have sub-indexes; an event name alone is not enough to select the appropriate visa.',
        stay: 'Stay and entry conditions follow the selected sub-index and permission granted. Ms Yana reviews the event details before advising on the application route.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'Performer or group profile, event schedule and an explanation of your role.',
          'Prepare the organiser invitation; certain musician or support routes need an impresariat and contract review.',
          'Living-funds evidence, guarantor, recommendation and activity-permit requirements are checked by sub-index.',
        ],
        limits: [
          'The exact C7 sub-index needs review; not every performance uses the same requirements.',
          'Payment and professional-activity conditions must be checked, not inferred from the label artist.',
          'Approval and entry are not guaranteed; a pending application should not be treated as extending permission to stay.',
        ],
      },
      ms: {
        summary: 'Laluan lawatan untuk persembahan seni atau budaya, dengan semakan subindeks C7 yang sesuai mengikut acara, peranan dan bentuk penyertaan anda.',
        purpose: 'Terangkan persembahan, penganjur, tempat, tarikh serta aturan kontrak atau bayaran jika ada. Kategori seni dan budaya mempunyai subindeks; nama acara sahaja tidak memadai untuk memilih visa yang betul.',
        stay: 'Tempoh tinggal dan syarat kemasukan mengikut subindeks yang dipilih serta permit yang diberikan. Ms Yana menyemak butiran acara sebelum memberi panduan permohonan.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Profil penghibur atau kumpulan, jadual acara dan penjelasan peranan.',
          'Sediakan surat jemputan penganjur; laluan pemuzik atau penyokong tertentu memerlukan semakan impresariat dan kontrak.',
          'Bukti dana sara hidup, penjamin, syor dan permit aktiviti disemak mengikut subindeks.',
        ],
        limits: [
          'Subindeks C7 yang tepat perlu disemak; bukan semua persembahan mempunyai syarat serupa.',
          'Aturan imbuhan dan aktiviti profesional perlu disahkan, bukan dianggap dibenarkan kerana berstatus artis.',
          'Kelulusan dan kemasukan tidak dijamin; permohonan yang diproses tidak boleh dianggap melanjutkan permit tinggal.',
        ],
      },
    },
  },
  C9: {
    icon: 'document', group: 'special', sources: [classification, officialList, applicationRules],
    copy: {
      id: {
        summary: 'Kunjungan untuk studi singkat, kursus atau pelatihan yang sesuai kategorinya, bukan langsung disamakan dengan izin pendidikan jangka panjang.',
        purpose: 'Jelaskan lembaga penerima, materi pembelajaran, lokasi, jadwal dan apakah ada kegiatan praktik. Ms Yana meninjau bentuk program agar belajar singkat tidak tertukar dengan pekerjaan, magang atau program pendidikan yang memerlukan kategori berbeda.',
        stay: 'Masa tinggal ditentukan oleh subkategori dan izin yang diberikan. Jadwal kursus bukan penentu otomatis lama izin; pemeriksaan dilakukan sebelum pengajuan.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Penjelasan program, jadwal pembelajaran dan profil lembaga penerima.',
          'Siapkan bukti terdaftar atau keterangan sebagai peserta dari lembaga penyelenggara.',
          'Bukti biaya hidup dan penjamin diperiksa; rekomendasi atau izin terkait mengikuti kegiatan sebenarnya.',
        ],
        limits: [
          'Jangan menggunakan label pelatihan untuk kegiatan bekerja atau magang yang membutuhkan izin lain.',
          'Perubahan program, lokasi atau kegiatan praktik perlu dikomunikasikan sebelum pengajuan.',
          'Persetujuan tetap pada otoritas; permohonan yang masih diproses tidak otomatis memperpanjang masa tinggal.',
        ],
      },
      en: {
        summary: 'A visit category for relevant short study, courses or training, rather than an automatic substitute for a longer-term education permit.',
        purpose: 'Explain the receiving institution, subject, location, schedule and any practical activities. Ms Yana reviews the programme so short study is not confused with employment, an internship or education requiring a different category.',
        stay: 'The stay is determined by the subcategory and permission granted. Course dates do not automatically set the allowed stay; conditions are reviewed before applying.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'Programme description, learning schedule and receiving-institution details.',
          'Prepare provider-issued registration evidence or confirmation that you are a programme participant.',
          'Living-funds evidence and guarantor needs are checked; recommendations or permits follow the actual activity.',
        ],
        limits: [
          'Do not label employment or an internship as training where another permission is required.',
          'Changes to the programme, location or practical activities need to be explained before applying.',
          'Approval remains with the authorities; a pending application does not automatically extend permission to stay.',
        ],
      },
      ms: {
        summary: 'Kategori lawatan untuk pengajian singkat, kursus atau latihan yang berkaitan, bukan pengganti automatik bagi permit pendidikan jangka panjang.',
        purpose: 'Nyatakan institusi penerima, bidang pembelajaran, lokasi, jadual dan sebarang aktiviti praktikal. Ms Yana menyemak program supaya pengajian singkat tidak dikelirukan dengan pekerjaan, latihan industri atau pengajian yang memerlukan kategori lain.',
        stay: 'Tempoh tinggal ditentukan oleh subkategori dan permit yang diberikan. Tarikh kursus tidak menetapkan tempoh tinggal secara automatik; syarat disemak sebelum permohonan.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Penerangan program, jadual pembelajaran dan butiran institusi penerima.',
          'Sediakan bukti pendaftaran atau pengesahan sebagai peserta daripada institusi penganjur.',
          'Bukti dana sara hidup dan penjamin disemak; syor atau permit berkaitan mengikut aktiviti sebenar.',
        ],
        limits: [
          'Jangan menamakan pekerjaan atau latihan industri sebagai kursus jika kebenaran lain diperlukan.',
          'Perubahan program, lokasi atau aktiviti praktikal perlu dijelaskan sebelum permohonan.',
          'Kelulusan kekal pada pihak berkuasa; permohonan yang diproses tidak melanjutkan permit tinggal secara automatik.',
        ],
      },
    },
  },
  C15: {
    icon: 'review', group: 'special', sources: [classification, officialList, applicationRules],
    copy: {
      id: {
        summary: 'Kategori khusus untuk penanganan pekerjaan darurat atau mendesak yang tidak terencana dan tidak dapat diwakilkan, bukan jalur pekerjaan rutin.',
        purpose: 'Jelaskan kejadian darurat, alasan kehadiran tenaga tersebut diperlukan, lokasi dan pihak yang bertanggung jawab. Ms Yana memeriksa kecocokan kategori sebelum menyarankan dokumen; urgensi komersial saja tidak otomatis memenuhi kategori ini.',
        stay: 'Masa tinggal dan ketentuan pengajuan mengikuti subkategori serta izin yang diberikan. Jangan mengasumsikan layanan ini memiliki proses kilat atau tanggal selesai tertentu.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Uraian keadaan darurat, pekerjaan yang diperlukan dan alasan tidak dapat diwakilkan.',
          'Siapkan keterangan instansi pemerintah atau lembaga swasta mengenai urgensi dan alasan pemohon tidak dapat digantikan.',
          'Bukti biaya hidup, penjamin, rekomendasi dan izin sektor terkait diperiksa sesuai kegiatan.',
        ],
        limits: [
          'C15 bukan izin kerja umum untuk penempatan rutin atau pekerjaan yang telah direncanakan.',
          'Jangan memulai kegiatan dengan mengandalkan pengajuan yang belum disetujui.',
          'Keputusan tetap pada otoritas; proses yang berjalan tidak otomatis memperpanjang izin tinggal.',
        ],
      },
      en: {
        summary: 'A specialist category for unplanned emergency or urgent work that cannot be delegated, not a route for routine employment.',
        purpose: 'Describe the emergency, why that person must attend, the location and responsible organisation. Ms Yana checks category suitability before advising on documents; commercial urgency alone does not automatically establish eligibility.',
        stay: 'Stay and application conditions follow the relevant subcategory and permission granted. This service should not be assumed to offer express processing or a particular completion date.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'An explanation of the emergency, required work and why it cannot be delegated.',
          'Prepare a government or private-institution statement explaining the urgency and why you cannot be replaced.',
          'Living-funds evidence, guarantor, recommendation and sector-permit requirements are checked for the activity.',
        ],
        limits: [
          'C15 is not a general work permit for routine placements or pre-planned employment.',
          'Do not begin activities on the strength of an application that has not been approved.',
          'Decisions remain with the authorities; an ongoing process does not automatically extend permission to stay.',
        ],
      },
      ms: {
        summary: 'Kategori khusus untuk kerja kecemasan atau mendesak yang tidak dirancang dan tidak boleh diwakilkan, bukan laluan pekerjaan rutin.',
        purpose: 'Terangkan kejadian kecemasan, sebab individu itu perlu hadir, lokasi dan organisasi yang bertanggungjawab. Ms Yana menyemak kesesuaian kategori sebelum memberi panduan dokumen; keperluan komersial mendesak sahaja tidak menentukan kelayakan.',
        stay: 'Tempoh tinggal dan syarat permohonan mengikut subkategori serta permit yang diberikan. Jangan menganggap perkhidmatan ini menyediakan proses ekspres atau tarikh siap tertentu.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Penjelasan kecemasan, kerja yang diperlukan dan sebab ia tidak boleh diwakilkan.',
          'Sediakan surat agensi kerajaan atau institusi swasta tentang keadaan mendesak dan sebab pemohon tidak boleh digantikan.',
          'Bukti dana sara hidup, penjamin, syor dan permit sektor disemak mengikut aktiviti.',
        ],
        limits: [
          'C15 bukan permit kerja umum untuk penempatan rutin atau pekerjaan yang telah dirancang.',
          'Jangan memulakan aktiviti berdasarkan permohonan yang belum diluluskan.',
          'Keputusan kekal pada pihak berkuasa; proses yang berjalan tidak melanjutkan permit tinggal secara automatik.',
        ],
      },
    },
  },
  C17: {
    icon: 'review', group: 'special', sources: [classification, officialList, applicationRules],
    copy: {
      id: {
        summary: 'Kunjungan untuk audit, kendali mutu atau inspeksi pada cabang perusahaan dan kegiatan yang sesuai dengan ruang lingkup kategori yang diberikan.',
        purpose: 'Uraikan hubungan perusahaan, lokasi pemeriksaan, obyek audit dan tugas yang dilakukan. Ms Yana meninjau apakah agenda benar-benar berupa kunjungan pemeriksaan, bukan penempatan kerja atau pengawasan operasional terus-menerus.',
        stay: 'Masa tinggal mengikuti subkategori dan izin yang diterbitkan. Rencana audit, jangka kunjungan dan kebutuhan perjalanan berikutnya diperiksa sebelum memilih jalur pengajuan.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Rencana audit atau inspeksi yang menjelaskan lokasi dan tugas pemohon.',
          'Siapkan keterangan pihak penyelenggara yang menjelaskan kegiatan audit, kendali mutu atau inspeksi.',
          'Bukti biaya hidup, penjamin, rekomendasi dan izin sektoral diperiksa sesuai ruang lingkup kegiatan.',
        ],
        limits: [
          'Kegiatan harus sesuai dengan izin; audit tidak boleh dijadikan label untuk pekerjaan lain.',
          'Jika membutuhkan kunjungan berulang, pilihan multiple entry perlu diperiksa secara terpisah.',
          'Hasil pengajuan tidak dijamin, dan pengajuan tertunda tidak otomatis memperpanjang izin tinggal.',
        ],
      },
      en: {
        summary: 'A visit category for audits, quality control or inspections involving company branches and activities within the scope of the permission granted.',
        purpose: 'Describe the company relationship, inspection sites, audit subject and tasks. Ms Yana reviews whether the agenda is genuinely an inspection visit rather than an employment placement or continuous operational supervision.',
        stay: 'The stay follows the applicable subcategory and permission issued. Audit dates, visit length and later travel needs are reviewed before choosing the application route.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'An audit or inspection plan describing the sites and applicant tasks.',
          'Prepare an organiser statement explaining the audit, quality-control or inspection activities.',
          'Living-funds evidence, guarantor, recommendation and sector-permit needs are checked against the activity scope.',
        ],
        limits: [
          'Activities must match the permission; audit must not be used as a label for unrelated work.',
          'If repeat visits are needed, a multiple-entry option requires a separate review.',
          'The application outcome is not guaranteed, and a pending application does not automatically extend permission to stay.',
        ],
      },
      ms: {
        summary: 'Kategori lawatan untuk audit, kawalan mutu atau pemeriksaan melibatkan cawangan syarikat dan aktiviti dalam skop permit yang diberikan.',
        purpose: 'Terangkan hubungan syarikat, lokasi pemeriksaan, perkara yang diaudit dan tugas pemohon. Ms Yana menyemak sama ada agenda itu benar-benar lawatan pemeriksaan, bukan penempatan kerja atau pengawasan operasi berterusan.',
        stay: 'Tempoh tinggal mengikut subkategori dan permit yang diterbitkan. Tarikh audit, tempoh lawatan serta keperluan perjalanan seterusnya disemak sebelum memilih laluan permohonan.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Rancangan audit atau pemeriksaan yang menerangkan lokasi serta tugas pemohon.',
          'Sediakan pengesahan penganjur yang menerangkan aktiviti audit, kawalan mutu atau pemeriksaan.',
          'Bukti dana sara hidup, penjamin, syor dan permit sektor disemak mengikut skop aktiviti.',
        ],
        limits: [
          'Aktiviti mesti sepadan dengan permit; audit bukan label untuk pekerjaan yang tidak berkaitan.',
          'Jika lawatan berulang diperlukan, pilihan berbilang kemasukan perlu disemak secara berasingan.',
          'Hasil permohonan tidak dijamin, dan permohonan yang diproses tidak melanjutkan permit tinggal secara automatik.',
        ],
      },
    },
  },
  D2: {
    icon: 'multiple', group: 'multiple', sources: [classification, officialList],
    copy: {
      id: {
        summary: 'Pilihan kunjungan bisnis beberapa kali bagi pemohon yang membutuhkan perjalanan berulang ke Indonesia dengan agenda dan hubungan bisnis yang jelas.',
        purpose: 'Untuk pembicaraan bisnis, rapat, negosiasi atau kegiatan kunjungan yang sesuai izin. Jelaskan frekuensi perjalanan, perusahaan penerima dan kegiatan di setiap kunjungan, bukan hanya meminta masa berlaku terpanjang.',
        stay: 'Multiple entry memungkinkan beberapa kedatangan dalam ketentuan visa yang diberikan. Masa berlaku visa berbeda dari batas tinggal pada setiap kedatangan; keduanya perlu dikonfirmasi Ms Yana.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Rencana kunjungan berulang, lokasi dan hubungan bisnis dengan pihak penerima.',
          'Undangan atau keterangan perusahaan, rencana perjalanan dan bukti kemampuan pembiayaan dapat diminta.',
          'Kebutuhan penjamin dan checklist akhir diperiksa menurut kewarganegaraan serta jalur pengajuan.',
        ],
        limits: [
          'Tarif berlabel per tahun bukan izin tinggal terus-menerus selama setahun.',
          'D2 bukan izin bekerja rutin, menerima upah atau melakukan pengawasan produksi terus-menerus.',
          'Perubahan kegiatan dan kebutuhan perpanjangan harus ditinjau terpisah; persetujuan tidak dijamin.',
        ],
      },
      en: {
        summary: 'A multiple-entry business-visit option for applicants needing repeat trips to Indonesia with a defined agenda and business relationship.',
        purpose: 'For business discussions, meetings, negotiations or visit activities consistent with the permission granted. Explain travel frequency, receiving companies and activities on each visit, rather than only requesting the longest validity.',
        stay: 'Multiple entry allows repeat arrivals under the visa conditions granted. Visa validity differs from the stay limit on each arrival; Ms Yana must confirm both separately.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'Repeat-visit plans, locations and your business relationship with the receiving organisation.',
          'An invitation or company statement, itinerary and evidence of financial means may be requested.',
          'Guarantor needs and the final checklist are reviewed by nationality and application route.',
        ],
        limits: [
          'A price labelled per year is not permission to stay continuously for a year.',
          'D2 is not permission for routine employment, receiving wages or continuous production supervision.',
          'Activity changes and extension needs require separate review; approval is not guaranteed.',
        ],
      },
      ms: {
        summary: 'Pilihan lawatan perniagaan berbilang kemasukan untuk pemohon yang memerlukan perjalanan berulang ke Indonesia dengan agenda dan hubungan perniagaan yang jelas.',
        purpose: 'Untuk perbincangan perniagaan, mesyuarat, rundingan atau aktiviti lawatan yang sepadan dengan permit. Nyatakan kekerapan perjalanan, syarikat penerima dan aktiviti setiap lawatan, bukan sekadar meminta tempoh sah paling lama.',
        stay: 'Berbilang kemasukan membolehkan ketibaan berulang mengikut syarat visa yang diberikan. Tempoh sah visa berbeza daripada had tinggal setiap ketibaan; Ms Yana perlu mengesahkan kedua-duanya secara berasingan.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Rancangan lawatan berulang, lokasi serta hubungan perniagaan dengan organisasi penerima.',
          'Surat jemputan atau pengesahan syarikat, jadual perjalanan dan bukti kemampuan kewangan mungkin diminta.',
          'Keperluan penjamin serta senarai akhir disemak mengikut kewarganegaraan dan laluan permohonan.',
        ],
        limits: [
          'Kadar berlabel setahun bukan kebenaran tinggal berterusan selama setahun.',
          'D2 bukan kebenaran pekerjaan rutin, menerima upah atau pengawasan pengeluaran berterusan.',
          'Perubahan aktiviti serta keperluan lanjutan memerlukan semakan berasingan; kelulusan tidak dijamin.',
        ],
      },
    },
  },
  D12: {
    icon: 'multiple', group: 'multiple', sources: [classification, officialList],
    copy: {
      id: {
        summary: 'Kunjungan pra-investasi beberapa kali untuk meninjau rencana investasi di Indonesia, dengan ruang lingkup kegiatan dan pihak penerima yang diperiksa terlebih dahulu.',
        purpose: 'Jelaskan rencana peninjauan, studi kelayakan atau persiapan investasi, lokasi dan hubungan dengan calon mitra. Kunjungan persiapan tidak sama dengan memegang izin untuk menjalankan usaha atau bekerja dalam operasionalnya.',
        stay: 'Pilihan multiple entry dan masa berlaku yang sesuai diperiksa terpisah dari batas tinggal setiap kedatangan. Ms Yana mengonfirmasi ketentuan untuk rencana kunjungan Anda.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Penjelasan rencana investasi, tempat yang akan dikunjungi dan jadwal perjalanan berulang.',
          'Keterangan hubungan, undangan atau korespondensi dengan calon mitra dapat diminta.',
          'Dokumen penjamin dan bukti pendukung lain diperiksa sesuai profil serta tujuan pengajuan.',
        ],
        limits: [
          'Pra-investasi bukan izin bekerja, mencari pekerjaan atau menjalankan operasional usaha secara umum.',
          'Tarif per tahun tidak menetapkan masa tinggal terus-menerus selama setahun.',
          'Jika tujuan berubah menjadi investasi atau bekerja, jalur izin yang tepat perlu ditinjau sebelum kegiatan dilakukan.',
        ],
      },
      en: {
        summary: 'A multiple-entry pre-investment visit option for reviewing investment plans in Indonesia, with the activity scope and receiving parties checked in advance.',
        purpose: 'Explain the proposed site visits, feasibility study or investment preparation, locations and relationship with prospective partners. A preparatory visit is different from permission to operate a business or work in its operations.',
        stay: 'The multiple-entry option and suitable visa validity are reviewed separately from the stay limit on each arrival. Ms Yana confirms the conditions for your visit plans.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'An explanation of the investment plan, proposed sites and repeat-travel schedule.',
          'Relationship evidence, an invitation or correspondence with prospective partners may be requested.',
          'Guarantor and other supporting documents are checked for the applicant profile and purpose.',
        ],
        limits: [
          'Pre-investment status is not general permission to work, seek employment or operate a business.',
          'A yearly tariff does not establish permission to stay continuously for a year.',
          'If the purpose changes to investment or employment, the appropriate permission needs review before activities begin.',
        ],
      },
      ms: {
        summary: 'Pilihan lawatan pra-pelaburan berbilang kemasukan untuk meninjau rancangan pelaburan di Indonesia, dengan skop aktiviti dan pihak penerima disemak terlebih dahulu.',
        purpose: 'Terangkan lawatan tapak, kajian kebolehlaksanaan atau persediaan pelaburan, lokasi serta hubungan dengan bakal rakan niaga. Lawatan persediaan berbeza daripada kebenaran mengendalikan perniagaan atau bekerja dalam operasinya.',
        stay: 'Pilihan berbilang kemasukan dan tempoh sah visa disemak berasingan daripada had tinggal setiap ketibaan. Ms Yana mengesahkan syarat untuk rancangan lawatan anda.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Penjelasan rancangan pelaburan, tapak yang dicadangkan dan jadual perjalanan berulang.',
          'Bukti hubungan, surat jemputan atau surat-menyurat dengan bakal rakan niaga mungkin diminta.',
          'Dokumen penjamin dan sokongan lain disemak mengikut profil serta tujuan permohonan.',
        ],
        limits: [
          'Status pra-pelaburan bukan kebenaran umum untuk bekerja, mencari pekerjaan atau menjalankan perniagaan.',
          'Kadar setahun tidak menetapkan kebenaran tinggal berterusan selama setahun.',
          'Jika tujuan berubah kepada pelaburan atau pekerjaan, permit yang sesuai perlu disemak sebelum aktiviti bermula.',
        ],
      },
    },
  },
  D17: {
    icon: 'review', group: 'multiple', sources: [classification, officialList],
    copy: {
      id: {
        summary: 'Pilihan kunjungan beberapa kali untuk agenda audit, kendali mutu atau inspeksi yang berulang dan sesuai ruang lingkup izin yang diberikan.',
        purpose: 'Jelaskan perusahaan yang diperiksa, hubungan antarperusahaan, lokasi, jadwal dan tugas pada setiap kunjungan. Kebutuhan beberapa perjalanan perlu dinilai bersama kegiatan sebenarnya, bukan hanya berdasarkan frekuensi penerbangan.',
        stay: 'Multiple entry tidak berarti izin tinggal tanpa putus. Ms Yana meninjau pilihan masa berlaku dan ketentuan tinggal setiap kedatangan sebelum pengajuan.',
        documents: [
          'Dokumen perjalanan dan pasfoto terbaru untuk pemeriksaan awal.',
          'Rencana audit atau inspeksi yang memuat lokasi, jadwal berulang dan peran pemohon.',
          'Undangan atau keterangan hubungan perusahaan dapat diminta dari pihak penerima.',
          'Kebutuhan penjamin, rekomendasi dan izin terkait diperiksa menurut kegiatan serta pemohon.',
        ],
        limits: [
          'Kegiatan harus tetap sesuai izin; kunjungan audit bukan izin bekerja umum atau penempatan operasional rutin.',
          'Tarif tahunan berbeda dari lama tinggal yang diperbolehkan pada setiap kedatangan.',
          'Perubahan tugas dan kebutuhan perpanjangan ditinjau terpisah; pengajuan tertunda tidak otomatis memperpanjang izin tinggal.',
        ],
      },
      en: {
        summary: 'A multiple-entry option for repeat audit, quality-control or inspection visits within the scope of the permission granted.',
        purpose: 'Explain the companies being inspected, company relationships, locations, schedule and tasks on each visit. The need for repeat travel is reviewed alongside the actual activities, not flight frequency alone.',
        stay: 'Multiple entry does not mean an uninterrupted right to stay. Ms Yana reviews the suitable validity option and stay conditions for each arrival before applying.',
        documents: [
          'Travel document and a recent photograph for the initial review.',
          'An audit or inspection plan with sites, repeat dates and the applicant role.',
          'An invitation or company-relationship statement may be requested from the receiving organisation.',
          'Guarantor, recommendation and related permit needs are checked for the activity and applicant.',
        ],
        limits: [
          'Activities must remain within the permission; an audit visit is not general work or routine operational-placement permission.',
          'An annual tariff differs from the stay allowed on each arrival.',
          'Task changes and extension needs require separate review; a pending application does not automatically extend permission to stay.',
        ],
      },
      ms: {
        summary: 'Pilihan berbilang kemasukan bagi lawatan audit, kawalan mutu atau pemeriksaan berulang dalam skop permit yang diberikan.',
        purpose: 'Nyatakan syarikat yang diperiksa, hubungan antara syarikat, lokasi, jadual serta tugas setiap lawatan. Keperluan perjalanan berulang dinilai bersama aktiviti sebenar, bukan berdasarkan kekerapan penerbangan sahaja.',
        stay: 'Berbilang kemasukan bukan hak tinggal tanpa putus. Ms Yana menyemak pilihan tempoh sah serta syarat tinggal setiap ketibaan sebelum permohonan.',
        documents: [
          'Dokumen perjalanan dan foto terkini untuk semakan awal.',
          'Rancangan audit atau pemeriksaan dengan lokasi, tarikh berulang dan peranan pemohon.',
          'Surat jemputan atau pengesahan hubungan syarikat mungkin diminta daripada organisasi penerima.',
          'Keperluan penjamin, syor dan permit berkaitan disemak mengikut aktiviti serta pemohon.',
        ],
        limits: [
          'Aktiviti mesti kekal dalam skop permit; lawatan audit bukan permit kerja umum atau penempatan operasi rutin.',
          'Kadar tahunan berbeza daripada tempoh tinggal yang dibenarkan bagi setiap ketibaan.',
          'Perubahan tugas dan keperluan lanjutan disemak berasingan; permohonan yang diproses tidak melanjutkan permit secara automatik.',
        ],
      },
    },
  },
  E28A: {
    icon: 'permit', group: 'itas', sources: [investorGuide, classification],
    copy: {
      id: {
        summary: 'Jalur izin tinggal terbatas untuk investor yang memenuhi persyaratan pada perusahaan penjamin di Indonesia. Tarif acuan yang ditampilkan merujuk opsi 2 tahun.',
        purpose: 'Kelayakan ditinjau melalui kepemilikan saham, hubungan dengan perusahaan dan kegiatan investasi yang direncanakan. Memiliki rencana usaha atau membayar jasa pengurusan saja tidak otomatis memenuhi persyaratan investor.',
        stay: 'Informasi resmi menyebut pilihan izin tinggal 1 atau 2 tahun. Opsi yang diajukan, izin masuk kembali dan tanggal berlakunya harus dipastikan; harga di halaman ini bukan tarif untuk seluruh pilihan.',
        documents: [
          'Paspor, pasfoto terbaru dan bukti kemampuan pembiayaan untuk pemeriksaan awal.',
          'Dokumen kepemilikan saham serta dokumen pendirian dan pengesahan perusahaan penjamin.',
          'Dokumen penjamin, rekening perusahaan dan bukti pendukung investasi sesuai kategori.',
          'Surat permohonan, CV dan rencana perjalanan; checklist akhir dikonfirmasi Ms Yana.',
        ],
        limits: [
          'Ambang kepemilikan saham dan persyaratan investasi adalah syarat kelayakan, bukan dana yang termasuk dalam harga layanan.',
          'Investor membutuhkan penjamin; jabatan dan pekerjaan lain perlu diperiksa agar tidak menggunakan kategori yang salah.',
          'Izin investor bukan izin untuk seluruh pekerjaan. Persetujuan, izin masuk dan pilihan masa tinggal tidak dijamin.',
        ],
      },
      en: {
        summary: 'A limited-stay route for investors who meet the requirements of an Indonesian sponsor company. The reference tariff shown applies to the 2-year option.',
        purpose: 'Eligibility is reviewed through shareholding, the company relationship and intended investment activities. A business plan or payment for administrative assistance alone does not automatically meet investor requirements.',
        stay: 'Official information describes 1- or 2-year stay options. Confirm the option applied for, re-entry permission and relevant dates; the price on this page is not a tariff for every option.',
        documents: [
          'Passport, a recent photograph and evidence of financial means for the initial review.',
          'Shareholding evidence and sponsor-company establishment and approval documents.',
          'Guarantor documents, company bank records and category-specific investment evidence.',
          'Application letter, CV and itinerary; Ms Yana confirms the final checklist.',
        ],
        limits: [
          'Shareholding thresholds and investment requirements are eligibility conditions, not money included in the service price.',
          'Investors need a guarantor; company positions and other work need review to avoid the wrong category.',
          'Investor status is not permission for every type of work. Approval, entry and a selected stay option are not guaranteed.',
        ],
      },
      ms: {
        summary: 'Laluan permit tinggal terhad untuk pelabur yang memenuhi syarat pada syarikat penjamin di Indonesia. Kadar rujukan yang dipaparkan adalah untuk pilihan 2 tahun.',
        purpose: 'Kelayakan disemak melalui pemilikan saham, hubungan dengan syarikat dan aktiviti pelaburan yang dirancang. Rancangan perniagaan atau bayaran perkhidmatan pengurusan sahaja tidak memenuhi syarat pelabur secara automatik.',
        stay: 'Maklumat rasmi menyatakan pilihan tinggal 1 atau 2 tahun. Sahkan pilihan permohonan, permit masuk semula serta tarikh yang berkenaan; harga di halaman ini bukan kadar untuk semua pilihan.',
        documents: [
          'Pasport, foto terkini dan bukti kemampuan kewangan untuk semakan awal.',
          'Bukti pemilikan saham serta dokumen penubuhan dan pengesahan syarikat penjamin.',
          'Dokumen penjamin, penyata bank syarikat dan bukti pelaburan mengikut kategori.',
          'Surat permohonan, CV dan jadual perjalanan; Ms Yana mengesahkan senarai akhir.',
        ],
        limits: [
          'Ambang pemilikan saham serta syarat pelaburan ialah syarat kelayakan, bukan dana yang termasuk dalam harga perkhidmatan.',
          'Pelabur memerlukan penjamin; jawatan syarikat dan pekerjaan lain perlu disemak supaya kategori tidak tersalah pilih.',
          'Status pelabur bukan kebenaran untuk semua jenis kerja. Kelulusan, kemasukan serta pilihan tempoh tinggal tidak dijamin.',
        ],
      },
    },
  },
};

module.exports = {products};
