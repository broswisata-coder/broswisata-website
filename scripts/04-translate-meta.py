"""
Hari 2 - Step 4: Translate <title>, meta description, OG tags per language
These are CRITICAL for SEO — they're what shows up in Google SERP and social shares.
"""
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path('/home/claude/broswisata-v2')

# Translation map keyed by filename
# Each value has 3 languages: id (default, kept), ms, en
TRANSLATIONS = {
    'bros-wisata-homepage.html': {
        'id': {
            'title': 'BROS Wisata — Tour Operator Medan & Sewa Mobil Sumatra Utara | Hub of Sumatra',
            'description': 'Operator tour resmi spesialis Sumatra Utara untuk wisatawan ASEAN dan Eropa. 11 paket: Medan Heritage, Bukit Lawang Orangutan, Tangkahan, Berastagi, Lake Toba. Sewa mobil + supir, airport transfer Kualanamu. WhatsApp +62 812-6013-9399.',
            'keywords': 'tour medan, tour sumatra utara, paket tour danau toba, paket tour bukit lawang, paket tour berastagi, paket tour tangkahan, sewa mobil medan, BROS Wisata, hub of sumatra, tour operator medan, paket halal Malaysia',
            'og_title': 'BROS Wisata — Hub of Sumatra | Tour Operator Spesialis Sumatra Utara',
            'og_description': '11 paket tour Sumatra Utara untuk wisatawan ASEAN & Eropa. Quote on Request. PDF dwi-bahasa EN/MY tersedia.',
        },
        'ms': {
            'title': 'BROS Wisata — Pakej Tour Sumatera Utara & Sewa Kereta dari Medan | Hub of Sumatra',
            'description': 'Operator tour rasmi pakar Sumatera Utara untuk pelancong Malaysia. 11 pakej: Medan Heritage, Bukit Lawang Orangutan, Tangkahan, Berastagi, Tasik Toba. Pakej halal-friendly, pemandu Bahasa Melayu, sewa kereta + pemandu. WhatsApp +62 812-6013-9399.',
            'keywords': 'tour medan, pakej tour sumatera utara, pakej tasik toba, pakej bukit lawang orangutan, pakej halal Malaysia, sewa kereta medan, tour operator medan, percutian halal Indonesia, BROS Wisata',
            'og_title': 'BROS Wisata — Hub of Sumatra | Pakej Tour Sumatera Utara untuk Pelancong Malaysia',
            'og_description': '11 pakej tour Sumatera Utara dengan pemandu Bahasa Melayu. Halal-friendly. Quote on Request. PDF dwi-bahasa EN/MY.',
        },
        'en': {
            'title': 'BROS Wisata — North Sumatra Tour Operator & Car Rental from Medan | Hub of Sumatra',
            'description': 'Licensed tour operator specializing in North Sumatra for international travelers. 11 signature packages: Medan Heritage, Bukit Lawang Orangutan, Tangkahan Eco, Berastagi Highlands, Lake Toba. English-speaking guides, car rental with driver, Kualanamu airport transfer. WhatsApp +62 812-6013-9399.',
            'keywords': 'medan tour, north sumatra tour, lake toba tour, bukit lawang orangutan trekking, tangkahan elephant tour, berastagi tour, car rental medan, sumatra travel agency, indonesia tour operator, eco tour sumatra, BROS Wisata',
            'og_title': 'BROS Wisata — Hub of Sumatra | North Sumatra Tour Specialist',
            'og_description': '11 signature North Sumatra tour packages for international travelers. Quote on Request. Bilingual EN/MY brochures available.',
        },
    },
    'bros-wisata-contact.html': {
        'id': {
            'title': 'Hubungi BROS Wisata Medan — WhatsApp +62 812-6013-9399 | Tour Operator',
            'description': 'Hubungi BROS Wisata di Medan untuk inquiry paket tour Sumatra Utara, sewa mobil, atau partnership agen. WhatsApp respon dalam 1-2 jam. Email hello@broswisata.id.',
            'keywords': 'kontak BROS Wisata, hubungi tour medan, alamat BROS Wisata Medan, WhatsApp tour sumatra utara',
            'og_title': 'Hubungi BROS Wisata — Tour Operator Medan',
            'og_description': 'Konsultasi gratis paket tour Sumatra Utara via WhatsApp. Respon dalam 1-2 jam. Kantor di Medan.',
        },
        'ms': {
            'title': 'Hubungi BROS Wisata Medan — WhatsApp +62 812-6013-9399 | Tour Operator',
            'description': 'Hubungi BROS Wisata di Medan untuk pertanyaan pakej tour Sumatera Utara, sewa kereta, atau kerjasama ejen. WhatsApp dijawab dalam 1-2 jam. Email hello@broswisata.id.',
            'keywords': 'kenalan BROS Wisata, hubungi tour medan, alamat BROS Wisata Medan, WhatsApp tour sumatera utara, ejen pelancongan medan',
            'og_title': 'Hubungi BROS Wisata — Tour Operator Medan',
            'og_description': 'Konsultasi percuma pakej tour Sumatera Utara via WhatsApp. Dijawab dalam 1-2 jam. Pejabat di Medan.',
        },
        'en': {
            'title': 'Contact BROS Wisata Medan — WhatsApp +62 812-6013-9399 | Tour Operator',
            'description': 'Contact BROS Wisata in Medan for North Sumatra tour inquiries, car rental, or agent partnership. WhatsApp reply within 1-2 hours. Email hello@broswisata.id.',
            'keywords': 'contact BROS Wisata, medan tour operator contact, BROS Wisata Medan address, north sumatra tour WhatsApp',
            'og_title': 'Contact BROS Wisata — Medan Tour Operator',
            'og_description': 'Free North Sumatra tour consultation via WhatsApp. Reply within 1-2 hours. Office in Medan.',
        },
    },
    'bros-wisata-about.html': {
        'id': {
            'title': 'Tentang BROS Wisata — 20+ Tahun Tour Operator Spesialis Sumatra Utara',
            'description': 'Sejak 2005 di Medan, BROS Wisata melayani wisatawan domestik, ASEAN, dan internasional dengan 11 paket signature Sumatra Utara. Lisensi resmi PT BROS INTI WISATA, NIB 2502250049355.',
            'keywords': 'tentang BROS Wisata, sejarah tour operator medan, PT BROS INTI WISATA, lisensi tour sumatra utara',
            'og_title': 'Tentang BROS Wisata — Tour Operator Medan Sejak 2005',
            'og_description': '20+ tahun pengalaman membawa wisatawan menjelajahi Sumatra Utara. Lisensi resmi, halal-friendly, multilingual.',
        },
        'ms': {
            'title': 'Tentang BROS Wisata — 20+ Tahun Tour Operator Pakar Sumatera Utara',
            'description': 'Sejak 2005 di Medan, BROS Wisata melayani pelancong tempatan, ASEAN, dan antarabangsa dengan 11 pakej eksklusif Sumatera Utara. Lesen rasmi PT BROS INTI WISATA.',
            'keywords': 'tentang BROS Wisata, sejarah tour operator medan, lesen tour sumatera utara, ejen pelancongan Medan',
            'og_title': 'Tentang BROS Wisata — Tour Operator Medan Sejak 2005',
            'og_description': '20+ tahun pengalaman membawa pelancong meneroka Sumatera Utara. Lesen rasmi, halal-friendly, pemandu pelbagai bahasa.',
        },
        'en': {
            'title': 'About BROS Wisata — 20+ Years North Sumatra Tour Specialist',
            'description': 'Since 2005 based in Medan, BROS Wisata has served domestic, ASEAN, and international travelers with 11 signature North Sumatra packages. Licensed by PT BROS INTI WISATA.',
            'keywords': 'about BROS Wisata, medan tour operator history, north sumatra licensed tour operator, BROS Inti Wisata',
            'og_title': 'About BROS Wisata — Medan Tour Operator Since 2005',
            'og_description': '20+ years guiding travelers through North Sumatra. Licensed, halal-friendly, multilingual guides.',
        },
    },
    'bros-wisata-tour-listing.html': {
        'id': {
            'title': 'Semua Paket Tour Sumatra Utara — 11 Pilihan | BROS Wisata',
            'description': 'Lihat 11 paket signature BROS Wisata: Medan Heritage, Bukit Lawang Orangutan, Tangkahan, Berastagi, Combo Sumut, Western Eco, Halal Malaysia. Quote on Request, kustom jadwal & budget.',
            'keywords': 'semua paket tour sumatra utara, daftar paket tour medan, BROS Wisata paket lengkap',
            'og_title': 'Semua Paket Tour Sumatra Utara — BROS Wisata',
            'og_description': '11 paket signature dari Medan Heritage sampai Combo Sumut. Personal consultation via WhatsApp.',
        },
        'ms': {
            'title': 'Semua Pakej Tour Sumatera Utara — 11 Pilihan | BROS Wisata',
            'description': 'Lihat 11 pakej eksklusif BROS Wisata: Medan Heritage, Bukit Lawang Orangutan, Tangkahan, Berastagi, Combo Sumut, Western Eco, Halal Malaysia. Quote on Request, kustom jadual & bajet.',
            'keywords': 'semua pakej tour sumatera utara, senarai pakej tour medan, BROS Wisata pakej lengkap',
            'og_title': 'Semua Pakej Tour Sumatera Utara — BROS Wisata',
            'og_description': '11 pakej eksklusif dari Medan Heritage sehingga Combo Sumut. Konsultasi peribadi via WhatsApp.',
        },
        'en': {
            'title': 'All North Sumatra Tour Packages — 11 Options | BROS Wisata',
            'description': 'Browse 11 signature BROS Wisata packages: Medan Heritage, Bukit Lawang Orangutan, Tangkahan Eco, Berastagi Highlands, Sumut Combo, Western Eco, Halal Malaysia. Quote on Request, custom schedule & budget.',
            'keywords': 'all north sumatra tour packages, medan tour package list, BROS Wisata complete packages, sumatra tour catalog',
            'og_title': 'All North Sumatra Tour Packages — BROS Wisata',
            'og_description': '11 signature packages from Medan Heritage to Sumut Combo. Personal consultation via WhatsApp.',
        },
    },
    'bros-wisata-car-rental.html': {
        'id': {
            'title': 'Sewa Mobil + Supir di Medan — Avanza, Innova, Hiace | BROS Wisata',
            'description': 'Sewa mobil dengan supir di Medan & Sumatra Utara. Armada Avanza, Innova, Hiace, Alphard. Untuk antar bandara Kualanamu, day tour, multi-day trip. WhatsApp +62 812-6013-9399.',
            'keywords': 'sewa mobil medan, rental mobil sumatra utara, sewa mobil + supir kualanamu, sewa hiace medan, sewa innova medan',
            'og_title': 'Sewa Mobil + Supir Medan — BROS Wisata',
            'og_description': 'Avanza, Innova, Hiace, Alphard untuk tour Sumatra Utara dan antar bandara Kualanamu.',
        },
        'ms': {
            'title': 'Sewa Kereta + Pemandu di Medan — Avanza, Innova, Hiace | BROS Wisata',
            'description': 'Sewa kereta dengan pemandu di Medan & Sumatera Utara. Armada Avanza, Innova, Hiace, Alphard. Untuk pengangkutan Lapangan Terbang Kualanamu, tour harian, multi-day trip. WhatsApp +62 812-6013-9399.',
            'keywords': 'sewa kereta medan, sewa kereta sumatera utara, sewa kereta + pemandu kualanamu, sewa hiace medan',
            'og_title': 'Sewa Kereta + Pemandu Medan — BROS Wisata',
            'og_description': 'Avanza, Innova, Hiace, Alphard untuk tour Sumatera Utara dan pengangkutan Lapangan Terbang Kualanamu.',
        },
        'en': {
            'title': 'Car Rental with Driver in Medan — Avanza, Innova, Hiace | BROS Wisata',
            'description': 'Car rental with driver in Medan & North Sumatra. Fleet of Avanza, Innova, Hiace, Alphard. For Kualanamu airport transfer, day tours, multi-day trips. WhatsApp +62 812-6013-9399.',
            'keywords': 'medan car rental, north sumatra car hire, kualanamu airport transfer, hiace rental medan, innova rental medan',
            'og_title': 'Car Rental with Driver Medan — BROS Wisata',
            'og_description': 'Avanza, Innova, Hiace, Alphard for North Sumatra tours and Kualanamu airport transfers.',
        },
    },
    'bros-wisata-custom-tour.html': {
        'id': {
            'title': 'Custom Tour Sumatra Utara — Itinerary Sesuai Kebutuhan | BROS Wisata',
            'description': 'Buat itinerary tour Sumatra Utara sesuai keinginan, durasi, dan budget Anda. Tim BROS Wisata akan rancang custom tour dengan personal consultation. WhatsApp untuk konsultasi.',
            'keywords': 'custom tour sumatra utara, itinerary tour pribadi medan, custom paket tour BROS Wisata',
            'og_title': 'Custom Tour Sumatra Utara — Itinerary Anda Sendiri',
            'og_description': 'Rancang tour Sumatra Utara sesuai keinginan: durasi, destinasi, budget. Konsultasi gratis.',
        },
        'ms': {
            'title': 'Custom Tour Sumatera Utara — Itinerari Mengikut Keperluan | BROS Wisata',
            'description': 'Buat itinerari tour Sumatera Utara mengikut kehendak, tempoh, dan bajet anda. Pasukan BROS Wisata akan rancang custom tour dengan konsultasi peribadi. WhatsApp untuk konsultasi.',
            'keywords': 'custom tour sumatera utara, itinerari tour persendirian medan, custom pakej tour BROS Wisata',
            'og_title': 'Custom Tour Sumatera Utara — Itinerari Anda Sendiri',
            'og_description': 'Rancang tour Sumatera Utara mengikut kehendak: tempoh, destinasi, bajet. Konsultasi percuma.',
        },
        'en': {
            'title': 'Custom Tour North Sumatra — Tailor-Made Itinerary | BROS Wisata',
            'description': 'Build a North Sumatra tour itinerary based on your preferences, duration, and budget. BROS Wisata team designs custom tours with personal consultation. WhatsApp for free consultation.',
            'keywords': 'custom north sumatra tour, tailor-made medan itinerary, BROS Wisata custom packages, private sumatra tour',
            'og_title': 'Custom North Sumatra Tour — Your Own Itinerary',
            'og_description': 'Design your North Sumatra tour: duration, destinations, budget. Free consultation.',
        },
    },
    'paket-bukit_lawang_4h3m.html': {
        'id': {
            'title': 'Paket Tour Bukit Lawang Orangutan 4H3M — Trekking Gunung Leuser | BROS Wisata',
            'description': 'Trekking orangutan liar di Taman Nasional Gunung Leuser (UNESCO). 4 hari 3 malam: Medan → Bukit Lawang → tubing Sungai Bahorok → eco-lodge. Halal-friendly, pemandu jungle berlisensi.',
            'keywords': 'paket bukit lawang, tour orangutan sumatra, trekking gunung leuser, bukit lawang 4 hari 3 malam, tubing bahorok',
            'og_title': 'Bukit Lawang Orangutan 4D3N — BROS Wisata',
            'og_description': 'Trekking orangutan liar di hutan Leuser UNESCO. Eco-lodge tepi sungai. Tubing Bahorok.',
        },
        'ms': {
            'title': 'Pakej Tour Bukit Lawang Orangutan 4H3M — Trekking Gunung Leuser | BROS Wisata',
            'description': 'Trekking orangutan liar di Taman Negara Gunung Leuser (UNESCO). 4 hari 3 malam: Medan → Bukit Lawang → tubing Sungai Bahorok → eco-lodge. Halal-friendly, pemandu jungle berlesen.',
            'keywords': 'pakej bukit lawang, tour orangutan sumatera, trekking gunung leuser, bukit lawang 4 hari 3 malam, tubing bahorok',
            'og_title': 'Bukit Lawang Orangutan 4D3N — BROS Wisata',
            'og_description': 'Trekking orangutan liar di hutan Leuser UNESCO. Eco-lodge tepi sungai. Tubing Bahorok.',
        },
        'en': {
            'title': 'Bukit Lawang Orangutan Tour 4D3N — Gunung Leuser Trekking | BROS Wisata',
            'description': 'Wild orangutan trekking in Gunung Leuser National Park (UNESCO). 4 days 3 nights: Medan → Bukit Lawang → Bahorok River tubing → eco-lodge. Halal-friendly, licensed jungle guides.',
            'keywords': 'bukit lawang tour, sumatra orangutan tour, gunung leuser trekking, bukit lawang 4 days 3 nights, bahorok tubing',
            'og_title': 'Bukit Lawang Orangutan 4D3N — BROS Wisata',
            'og_description': 'Wild orangutan trekking in UNESCO Leuser forest. Riverside eco-lodge. Bahorok tubing.',
        },
    },
    # For other paket pages, generate generic translations programmatically
}


def get_default_translation(filename, lang):
    """Generate default translation for paket pages without explicit entry."""
    package_name_map = {
        'paket-medan_heritage_3h2m.html': {
            'id': {'title': 'Medan Heritage Tour 3H2M — Kuliner & Budaya', 'desc': 'Eksplorasi Medan tua: Tjong A Fie Mansion, Maimoon Palace, kuliner Lombok kandang. 3 hari 2 malam halal-friendly.'},
            'ms': {'title': 'Medan Heritage Tour 3H2M — Kuliner & Budaya', 'desc': 'Eksplorasi Medan tua: Tjong A Fie Mansion, Istana Maimoon, kuliner halal. 3 hari 2 malam.'},
            'en': {'title': 'Medan Heritage Tour 3D2N — Cuisine & Culture', 'desc': 'Explore old Medan: Tjong A Fie Mansion, Maimoon Palace, local cuisine. 3 days 2 nights halal-friendly.'},
        },
        'paket-tangkahan_3h2m.html': {
            'id': {'title': 'Tangkahan Eco Tour 3H2M — Mandi Gajah Sumatra', 'desc': 'Mandi gajah, jungle trekking, gua kalong di Tangkahan, "Hidden Paradise" Leuser. 3 hari 2 malam.'},
            'ms': {'title': 'Tangkahan Eco Tour 3H2M — Mandi Gajah Sumatera', 'desc': 'Mandi gajah, jungle trekking, gua kalong di Tangkahan, "Hidden Paradise" Leuser. 3 hari 2 malam.'},
            'en': {'title': 'Tangkahan Eco Tour 3D2N — Elephant Bathing Sumatra', 'desc': 'Elephant bathing, jungle trekking, bat caves at Tangkahan, the "Hidden Paradise" of Leuser. 3 days 2 nights.'},
        },
        'paket-berastagi_3h2m.html': {
            'id': {'title': 'Berastagi Highland Tour 3H2M — Gunung Sibayak & Kebun Jeruk', 'desc': 'Pendakian Gunung Sibayak, kebun jeruk, pasar buah Berastagi, desa Lingga. 3 hari 2 malam.'},
            'ms': {'title': 'Berastagi Highland Tour 3H2M — Gunung Sibayak & Kebun Limau', 'desc': 'Pendakian Gunung Sibayak, kebun limau, pasar buah Berastagi, kampung Lingga. 3 hari 2 malam.'},
            'en': {'title': 'Berastagi Highland Tour 3D2N — Mount Sibayak & Orange Orchards', 'desc': 'Mt Sibayak hiking, orange orchards, Berastagi fruit market, Lingga traditional village. 3 days 2 nights.'},
        },
        'paket-combo_sumut_6h5m.html': {
            'id': {'title': 'Combo Sumut Lengkap 6H5M — North Sumatra Grand Tour', 'desc': 'Tour terlengkap: Medan + Bukit Lawang + Tangkahan + Berastagi + Lake Toba dalam 6 hari 5 malam.'},
            'ms': {'title': 'Combo Sumut Lengkap 6H5M — Sumatera Utara Grand Tour', 'desc': 'Tour terlengkap: Medan + Bukit Lawang + Tangkahan + Berastagi + Tasik Toba dalam 6 hari 5 malam.'},
            'en': {'title': 'Sumut Grand Combo 6D5N — Complete North Sumatra Tour', 'desc': 'Most comprehensive: Medan + Bukit Lawang + Tangkahan + Berastagi + Lake Toba in 6 days 5 nights.'},
        },
        'paket-halal_3h2m_medan_toba.html': {
            'id': {'title': 'Paket Halal Medan-Toba 3H2M — Untuk Keluarga Muslim', 'desc': 'Paket halal singkat Medan + Lake Toba 3 hari 2 malam. Restoran halal, pemandu Bahasa Melayu, hotel pilihan 3-tier.'},
            'ms': {'title': 'Pakej Halal Medan-Toba 3H2M — Untuk Keluarga Muslim Malaysia', 'desc': 'Pakej halal pendek Medan + Tasik Toba 3 hari 2 malam. Restoran halal, pemandu Bahasa Melayu, hotel pilihan 3-tier.'},
            'en': {'title': 'Halal Medan-Toba Package 3D2N — For Muslim Travelers', 'desc': 'Short halal getaway Medan + Lake Toba 3 days 2 nights. Halal restaurants, Malay-speaking guide, 3-tier hotel choices.'},
        },
        'paket-halal_4h3m_medan_toba.html': {
            'id': {'title': 'Paket Halal Medan-Toba 4H3M — Lengkap Halal Family', 'desc': 'Paket halal Medan + Lake Toba 4 hari 3 malam. Restoran halal, pemandu Bahasa Melayu, includes Samosir Island.'},
            'ms': {'title': 'Pakej Halal Medan-Toba 4H3M — Lengkap Halal Family', 'desc': 'Pakej halal Medan + Tasik Toba 4 hari 3 malam. Restoran halal, pemandu Bahasa Melayu, termasuk Pulau Samosir.'},
            'en': {'title': 'Halal Medan-Toba Package 4D3N — Complete Halal Family Tour', 'desc': 'Halal Medan + Lake Toba 4 days 3 nights. Halal restaurants, Malay-speaking guide, includes Samosir Island.'},
        },
        'paket-halal_5h4m_medan_toba.html': {
            'id': {'title': 'Paket Halal Medan-Toba 5H4M — Premium Halal Tour', 'desc': 'Paket halal premium Medan + Berastagi + Lake Toba 5 hari 4 malam. Mosque visits, halal kitchen guarantee.'},
            'ms': {'title': 'Pakej Halal Medan-Toba 5H4M — Premium Halal Tour', 'desc': 'Pakej halal premium Medan + Berastagi + Tasik Toba 5 hari 4 malam. Lawatan masjid, jaminan dapur halal.'},
            'en': {'title': 'Halal Medan-Toba Package 5D4N — Premium Halal Tour', 'desc': 'Premium halal Medan + Berastagi + Lake Toba 5 days 4 nights. Mosque visits, certified halal kitchens.'},
        },
        'paket-western_4d3n_jungle.html': {
            'id': {'title': 'Western Eco Jungle Tour 4D3N — Bukit Lawang Adventure', 'desc': 'Tour 4 hari 3 malam khusus traveler Eropa: orangutan trekking, jungle camping, Bahorok rafting.'},
            'ms': {'title': 'Western Eco Jungle Tour 4D3N — Bukit Lawang Adventure', 'desc': 'Tour 4 hari 3 malam khusus pelancong Eropah: trekking orangutan, jungle camping, rafting Bahorok.'},
            'en': {'title': 'Western Eco Jungle Tour 4D3N — Bukit Lawang Adventure', 'desc': 'Tailored 4-day jungle adventure for Western travelers: orangutan trekking, jungle camping, Bahorok rafting.'},
        },
        'paket-western_5d4n_volcano.html': {
            'id': {'title': 'Western Volcano Adventure 5D4N — Sibayak & Sinabung', 'desc': 'Tour 5 hari 4 malam khusus traveler Eropa: pendakian volcano Sibayak, hot springs, kebun jeruk.'},
            'ms': {'title': 'Western Volcano Adventure 5D4N — Sibayak & Sinabung', 'desc': 'Tour 5 hari 4 malam khusus pelancong Eropah: pendakian gunung berapi Sibayak, kolam panas, kebun limau.'},
            'en': {'title': 'Western Volcano Adventure 5D4N — Sibayak & Sinabung', 'desc': 'Tailored 5-day volcano adventure: Sibayak summit hike, natural hot springs, highland orange orchards.'},
        },
        'paket-western_7d6n_ultimate.html': {
            'id': {'title': 'Ultimate Sumatra 7D6N — Adventure for Western Travelers', 'desc': 'Tour 7 hari 6 malam paling komplit: jungle, volcano, lake, culture. Khusus traveler Eropa & Western.'},
            'ms': {'title': 'Ultimate Sumatra 7D6N — Adventure for Western Travelers', 'desc': 'Tour 7 hari 6 malam paling lengkap: jungle, gunung berapi, tasik, budaya. Khusus pelancong Eropah & Barat.'},
            'en': {'title': 'Ultimate Sumatra 7D6N — Adventure for Western Travelers', 'desc': 'The most comprehensive 7-day tour: jungle, volcano, lake, culture. Tailored for Western travelers.'},
        },
    }
    
    if filename in package_name_map and lang in package_name_map[filename]:
        data = package_name_map[filename][lang]
        return {
            'title': f'{data["title"]} | BROS Wisata',
            'description': f'{data["desc"]} Quote on Request via WhatsApp +62 812-6013-9399.',
            'keywords': f'{filename.replace("paket-", "").replace(".html", "").replace("_", " ")} BROS Wisata',
            'og_title': data['title'],
            'og_description': data['desc'],
        }
    return None


def update_meta_tags(soup, translation):
    """Update title, description, keywords, OG tags, Twitter tags."""
    if not translation:
        return False
    
    changes = 0
    
    # <title>
    title = soup.find('title')
    if title:
        title.string = translation['title']
        changes += 1
    
    # meta name="title"
    meta_title = soup.find('meta', attrs={'name': 'title'})
    if meta_title:
        meta_title['content'] = translation['title']
        changes += 1
    
    # meta description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc:
        meta_desc['content'] = translation['description']
        changes += 1
    
    # meta keywords
    meta_kw = soup.find('meta', attrs={'name': 'keywords'})
    if meta_kw and 'keywords' in translation:
        meta_kw['content'] = translation['keywords']
        changes += 1
    
    # OG title
    og_title = soup.find('meta', property='og:title')
    if og_title:
        og_title['content'] = translation.get('og_title', translation['title'])
        changes += 1
    
    # OG description
    og_desc = soup.find('meta', property='og:description')
    if og_desc:
        og_desc['content'] = translation.get('og_description', translation['description'])
        changes += 1
    
    # Twitter title
    tw_title = soup.find('meta', attrs={'name': 'twitter:title'})
    if tw_title:
        tw_title['content'] = translation.get('og_title', translation['title'])
        changes += 1
    
    # Twitter description
    tw_desc = soup.find('meta', attrs={'name': 'twitter:description'})
    if tw_desc:
        tw_desc['content'] = translation.get('og_description', translation['description'])
        changes += 1
    
    return changes


def main():
    total_changes = 0
    files_updated = 0
    
    for lang in ['id', 'ms', 'en']:
        lang_dir = ROOT / lang
        if not lang_dir.exists():
            continue
        
        print(f"\n=== Processing /{lang}/ ===")
        for filepath in sorted(lang_dir.glob('*.html')):
            filename = filepath.name
            
            # Get translation: explicit dict first, then default for paket pages
            translation = None
            if filename in TRANSLATIONS:
                translation = TRANSLATIONS[filename].get(lang)
            
            if not translation:
                translation = get_default_translation(filename, lang)
            
            if not translation:
                print(f"  ⚠ {filename}: no translation defined")
                continue
            
            with open(filepath, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            changes = update_meta_tags(soup, translation)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            
            if changes:
                files_updated += 1
                total_changes += changes
                print(f"  ✓ {filename}: {changes} meta tags translated")
    
    print(f"\nTotal: {total_changes} meta tags translated across {files_updated} files")


if __name__ == '__main__':
    main()
