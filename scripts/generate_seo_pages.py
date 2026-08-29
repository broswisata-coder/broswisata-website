from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib.parse import quote
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SITE = "https://broswisata.id"
DEFAULT_LASTMOD = "2026-07-14"
# Keep sitemap dates deterministic and honest. Add an override only when the
# page's main copy, structured data, or internal links change materially.
LASTMOD_OVERRIDES = {
    f"{SITE}/en/": "2026-08-29",
    f"{SITE}/en/bukit-lawang-orangutan-trekking": "2026-08-29",
    f"{SITE}/en/destination-bukit-lawang-tangkahan": "2026-08-29",
    f"{SITE}/en/lake-toba-samosir-private-tour": "2026-08-29",
    f"{SITE}/en/private-north-sumatra-tour": "2026-08-29",
    f"{SITE}/id/destinasi-bukit-lawang-tangkahan": "2026-08-29",
    f"{SITE}/ms/": "2026-08-29",
    f"{SITE}/ms/destinasi-bukit-lawang-tangkahan": "2026-08-29",
    f"{SITE}/ms/pakej-lake-toba-samosir": "2026-08-29",
    f"{SITE}/ms/pakej-private-tour-sumatera-utara": "2026-08-29",
}
LANG_ORDER = ["en", "ms", "id"]


LANG = {
    "en": {
        "html_lang": "en",
        "locale": "en_US",
        "home": "Home",
        "tours": "Tours",
        "rental": "Car Rental",
        "rental_footer": "Car Rental with Driver",
        "custom": "Custom Tour",
        "about": "About",
        "contact": "Contact",
        "whatsapp": "WhatsApp Ahmad",
        "office": "Office",
        "services": "Services",
        "destinations": "Destinations",
        "trust": "Trust",
        "footer_text": "Medan-based North Sumatra tour operator for private eco tours, custom routes, and halal-friendly travel by request.",
        "planning_label": "Planning Hubs",
        "planning_title": "Planning pages for specific searches.",
        "planning_copy": "These pages answer the exact questions travelers search before asking for a quotation. Each route still ends in a private plan with Ahmad.",
        "cta_title": "Tell Ahmad your date, pax, and route idea.",
        "cta_copy": "BROS Wisata prepares private quotations by request because hotel class, route distance, ferry timing, and guest pace can change the final plan.",
        "related": "Related BROS Wisata pages",
    },
    "id": {
        "html_lang": "id",
        "locale": "id_ID",
        "home": "Beranda",
        "tours": "Paket Tour",
        "rental": "Sewa Mobil",
        "rental_footer": "Sewa Mobil + Supir",
        "custom": "Tour Custom",
        "about": "Tentang",
        "contact": "Kontak",
        "whatsapp": "WhatsApp Ahmad",
        "office": "Kantor",
        "services": "Layanan",
        "destinations": "Destinasi",
        "trust": "Trust",
        "footer_text": "Operator tour Sumatra Utara berbasis Medan untuk private eco tour, rute custom, dan perjalanan halal-friendly by request.",
        "planning_label": "Halaman Rencana",
        "planning_title": "Halaman untuk pencarian yang lebih spesifik.",
        "planning_copy": "Halaman ini menjawab pertanyaan yang biasa dicari tamu sebelum minta quotation. Setiap rute tetap disusun private bersama Ahmad.",
        "cta_title": "Ceritakan tanggal, pax, dan ide rute ke Ahmad.",
        "cta_copy": "BROS Wisata menyiapkan quotation private by request karena kelas hotel, jarak rute, jadwal ferry, dan tempo tamu bisa mengubah rencana akhir.",
        "related": "Halaman BROS Wisata terkait",
    },
    "ms": {
        "html_lang": "ms",
        "locale": "ms_MY",
        "home": "Utama",
        "tours": "Pakej Tour",
        "rental": "Sewa Kereta",
        "rental_footer": "Sewa Kereta + Pemandu",
        "custom": "Tour Tersuai",
        "about": "Tentang",
        "contact": "Kontak",
        "whatsapp": "WhatsApp Ahmad",
        "office": "Pejabat",
        "services": "Perkhidmatan",
        "destinations": "Destinasi",
        "trust": "Trust",
        "footer_text": "Operator tour Sumatera Utara dari Medan untuk private eco tour, laluan tersuai, dan perjalanan halal-friendly by request.",
        "planning_label": "Halaman Rancangan",
        "planning_title": "Halaman untuk carian yang lebih spesifik.",
        "planning_copy": "Halaman ini menjawab soalan yang biasa dicari tetamu sebelum minta sebut harga. Setiap laluan tetap disusun private bersama Ahmad.",
        "cta_title": "Ceritakan tarikh, pax, dan idea laluan kepada Ahmad.",
        "cta_copy": "BROS Wisata menyediakan sebut harga private by request kerana kelas hotel, jarak laluan, jadual ferry, dan tempo tetamu boleh mengubah rancangan akhir.",
        "related": "Halaman BROS Wisata berkaitan",
    },
}


HUBS = [
    {
        "key": "private-north-sumatra-tour",
        "image": "/assets/gallery/gallery_10_group_joy.jpg",
        "image_alt": {
            "en": "Private North Sumatra guests with BROS Wisata local team",
            "id": "Tamu private tour Sumatra Utara bersama tim lokal BROS Wisata",
            "ms": "Tetamu private tour Sumatera Utara bersama pasukan lokal BROS Wisata",
        },
        "slugs": {
            "en": "private-north-sumatra-tour",
            "id": "private-tour-sumatra-utara",
            "ms": "pakej-private-tour-sumatera-utara",
        },
        "copy": {
            "en": {
                "title": "Private North Sumatra Tour from Medan | BROS Wisata",
                "description": "Build a private North Sumatra tour from Medan with Ahmad: Lake Toba, Bukit Lawang, Berastagi, local guides, hotel fit, halal options, and a custom quote.",
                "keywords": "private North Sumatra tour, Medan private tour, Lake Toba Bukit Lawang tour, custom Sumatra itinerary",
                "kicker": "Private North Sumatra Tour",
                "h1": "Plan a private North Sumatra tour around your group.",
                "intro": "BROS Wisata designs private routes from Medan for travelers who want Lake Toba, Bukit Lawang, Berastagi, Tangkahan, Samosir, and meaningful local stops. Ahmad checks the flight timing, road sequence, hotel fit, guide availability, and guest pace before the itinerary is quoted.",
                "cta_text": "Plan my private tour",
                "wa": "Hi Ahmad, I found BROS Wisata from the Private North Sumatra Tour page. My travel date, pax, hotel style, and route idea are:",
                "stats": [("Route", "Medan, jungle, highlands, lake"), ("Style", "Private, flexible, by request"), ("Best for", "Europe, Singapore, Malaysia")],
                "sections": [
                    ("Start with arrival and departure", ["Most routes can begin at Kualanamu International Airport or a Medan hotel, but the landing time determines how far the group should travel on day one.", "An early departure may require the final night in Medan; a later flight can allow a direct airport transfer when road time remains realistic.", "Share the flight number, travel date, pax, luggage, and any fixed hotel nights before route design begins.", "Ahmad uses those details to avoid a first or final day that looks possible on paper but feels rushed on the road."]),
                    ("Choose a route length that fits", ["A 4D3N trip normally works best when the group focuses on either Bukit Lawang or Lake Toba instead of trying to cover both.", "A 5D4N plan can combine Berastagi with Lake Toba, or give Bukit Lawang a more comfortable arrival and trekking rhythm.", "A 6D5N or longer route is better for Bukit Lawang, Berastagi, Samosir, and Lake Toba in one private journey.", "Tangkahan, extra trekking, village visits, or a slower Samosir stay usually need additional time rather than a tighter schedule."]),
                    ("Match the trip to the guests", ["Couples and solo travelers often value a flexible driver-guide arrangement and smaller lodges with local character.", "Families may need shorter walks, connecting or extra-bed room planning, familiar meal stops, and more recovery time between drives.", "Malaysia and Singapore guests can request halal-friendly food planning and prayer-time awareness without changing the private character of the tour.", "Long-haul guests can ask for a quieter eco pace, stronger nature focus, or a mix of rainforest, highlands, and Batak culture."]),
                    ("What Ahmad checks before quoting", ["Road sequence and realistic transfer time between Medan, Bukit Lawang, Berastagi, Lake Toba, and the agreed final drop-off.", "Hotel or lodge availability that matches the requested comfort level, room composition, and travel market.", "Local guide availability for jungle trekking, cultural interpretation, or other activities that require destination knowledge.", "Weather, ferry timing, guest fitness, halal needs, and optional activities that could change the safest daily flow."]),
                    ("What the quotation clarifies", ["The written quote lists the route, included transport, confirmed or proposed hotel category, guide arrangement, meals, and activities.", "Exclusions, deposit timing, balance terms, and cancellation conditions are stated before the booking is treated as confirmed.", "The same duration can price differently because travel date, room type, route distance, group size, and guide needs change the operating cost.", "This quotation-led approach keeps the plan transparent and avoids promising a fixed marketplace price before the ground details are checked."]),
                ],
                "faqs": [
                    ("Can the route start and end at Kualanamu Airport?", "Yes. Most private routes can start from Kualanamu International Airport or a Medan hotel."),
                    ("Do you serve solo travelers?", "Yes. Solo private tours are possible with a custom quotation based on route, guide, and room requirements."),
                    ("Can the trip be halal-friendly?", "Yes. BROS Wisata can plan halal-friendly stops, prayer timing, and suitable food choices for Malaysia and Singapore guests."),
                    ("How many days do I need for Bukit Lawang and Lake Toba?", "A 6D5N or longer route is usually more comfortable when Bukit Lawang, Berastagi, Samosir, and Lake Toba are combined."),
                    ("Why is there no fixed package price?", "The final cost depends on travel date, pax, room composition, hotel level, route distance, and guide requirements, so BROS Wisata checks the ground plan before quoting."),
                ],
            },
            "id": {
                "title": "Private Tour Sumatra Utara dari Medan | BROS Wisata",
                "description": "Rencanakan private tour Sumatra Utara dari Medan bersama Ahmad: Lake Toba, Bukit Lawang, Berastagi, Tangkahan, Samosir, halal stop, dan quotation custom.",
                "keywords": "private tour Sumatra Utara, tour Medan private, Lake Toba Bukit Lawang, itinerary Sumatra Utara",
                "kicker": "Private Tour Sumatra Utara",
                "h1": "Rute Sumatra Utara lebih enak kalau disusun mengikuti grup Anda.",
                "intro": "BROS Wisata menyusun rute private dari Medan untuk tamu yang ingin Lake Toba, Bukit Lawang, Berastagi, Tangkahan, Samosir, dan stop lokal tanpa merasa seperti ikut paket generik.",
                "cta_text": "Rencanakan private tour",
                "wa": "Halo Ahmad, saya menemukan BROS Wisata dari halaman Private Tour Sumatra Utara. Tanggal, jumlah pax, gaya hotel, dan ide rute saya:",
                "stats": [("Rute", "Medan, jungle, highland, lake"), ("Gaya", "Private, fleksibel, by request"), ("Cocok", "Eropa, Singapore, Malaysia")],
                "sections": [
                    ("Yang Ahmad cek sebelum quotation", ["Waktu tempuh realistis antara Medan, Bukit Lawang, Berastagi, dan Lake Toba.", "Kelas hotel atau lodge yang cocok dengan level kenyamanan tamu.", "Ketersediaan guide lokal untuk jungle, volcano, dan stop budaya.", "Stop halal-friendly atau tempo eco yang lebih pelan bila dibutuhkan."]),
                    ("Contoh ide rute", ["4H3M Bukit Lawang jungle dan arrival Medan.", "5H4M Berastagi highland dan private tour Lake Toba.", "6H5M Sumatra Utara lengkap dengan Bukit Lawang, Berastagi, Samosir, dan Lake Toba.", "Itinerary custom untuk solo, couple, keluarga, atau small group."]),
                    ("Kenapa harga by request", ["Durasi yang sama bisa berbeda biaya tergantung kelas hotel, tanggal, jarak rute, dan jumlah tamu.", "Quotation yang fair disiapkan setelah tanggal, pax, dan level kenyamanan jelas.", "Ini menjaga trip terasa premium dan transparan, bukan sekadar harga marketplace."]),
                ],
                "faqs": [
                    ("Bisa mulai dari Bandara Kualanamu?", "Bisa. Sebagian besar rute private bisa mulai dari Bandara Kualanamu atau hotel di Medan."),
                    ("Bisa untuk solo traveler?", "Bisa. Solo private tour dapat dibuat dengan quotation custom sesuai rute, guide, dan kebutuhan kamar."),
                    ("Bisa dibuat halal-friendly?", "Bisa. BROS Wisata dapat mengatur stop halal-friendly, waktu shalat, dan pilihan makan yang cocok untuk tamu Malaysia/Singapore."),
                ],
            },
            "ms": {
                "title": "Pakej Private Tour Sumatera Utara dari Medan | BROS Wisata",
                "description": "Rancang private tour Sumatera Utara dari Medan bersama Ahmad: Lake Toba, Bukit Lawang, Berastagi, guide lokal, hotel, halal stop, dan sebut harga.",
                "keywords": "pakej private tour Sumatera Utara, tour Medan private, Lake Toba Bukit Lawang, itinerary Sumatera Utara",
                "kicker": "Private Tour Sumatera Utara",
                "h1": "Rancang private tour Sumatera Utara mengikut kumpulan anda.",
                "intro": "BROS Wisata menyusun laluan private dari Medan untuk tetamu yang mahu Lake Toba, Bukit Lawang, Berastagi, Tangkahan, Samosir, dan pengalaman lokal. Ahmad menyemak waktu flight, urutan jalan, tahap hotel, guide, dan tempo kumpulan sebelum sebut harga dihantar.",
                "cta_text": "Rancang private tour",
                "wa": "Hai Ahmad, saya jumpa BROS Wisata dari halaman Pakej Private Tour Sumatera Utara. Tarikh, bilangan pax, gaya hotel, dan idea laluan saya:",
                "stats": [("Laluan", "Medan, jungle, highland, lake"), ("Gaya", "Private, fleksibel, by request"), ("Sesuai", "Malaysia, Singapore, Eropah")],
                "sections": [
                    ("Mulakan dengan flight dan drop-off", ["Kebanyakan laluan boleh bermula dari Kualanamu International Airport atau hotel Medan, tetapi waktu ketibaan menentukan sejauh mana kumpulan patut bergerak pada hari pertama.", "Flight awal boleh memerlukan final night di Medan; flight lewat kadang-kadang membolehkan transfer terus jika masa jalan masih realistik.", "Kirim nombor flight, tarikh, pax, bagasi, dan malam hotel yang sudah ditempah sebelum itinerary disusun.", "Butiran ini membantu Ahmad mengelakkan hari pertama atau terakhir yang nampak mudah di atas kertas tetapi terlalu rushing di jalan."]),
                    ("Pilih tempoh laluan yang sesuai", ["Pakej 4H3M biasanya lebih baik fokus sama ada Bukit Lawang atau Lake Toba, bukan memaksa kedua-duanya dalam masa singkat.", "Pakej 5H4M boleh menggabungkan Berastagi dan Lake Toba, atau memberi tempo lebih selesa untuk ketibaan dan trekking Bukit Lawang.", "Pakej 6H5M atau lebih panjang lebih sesuai untuk Bukit Lawang, Berastagi, Samosir, dan Lake Toba dalam satu perjalanan private.", "Tangkahan, extra trekking, lawatan kampung, atau stay Samosir yang santai biasanya perlukan tambahan masa."]),
                    ("Sesuaikan dengan karakter tetamu", ["Pasangan dan solo traveler selalunya menghargai aturan driver-guide fleksibel serta lodge kecil yang mempunyai karakter lokal.", "Keluarga mungkin perlukan jalan kaki lebih pendek, susunan connecting room atau extra bed, stop makanan familiar, dan masa rehat antara transfer.", "Tetamu Malaysia dan Singapore boleh meminta planning makanan halal-friendly serta perhatian pada waktu solat tanpa mengubah gaya private tour.", "Tetamu jarak jauh boleh memilih tempo eco yang tenang, fokus alam yang lebih kuat, atau gabungan rainforest, highland, dan budaya Batak."]),
                    ("Apa Ahmad semak sebelum sebut harga", ["Urutan jalan dan masa transfer realistik antara Medan, Bukit Lawang, Berastagi, Lake Toba, serta final drop-off yang dipersetujui.", "Ketersediaan hotel atau lodge yang sepadan dengan tahap keselesaan, susunan bilik, dan pasaran tetamu.", "Ketersediaan guide lokal untuk jungle trekking, interpretasi budaya, atau aktiviti yang perlukan pengetahuan destinasi.", "Cuaca, ferry, fitness tetamu, keperluan halal, dan aktiviti pilihan yang boleh mengubah aliran harian paling selamat."]),
                    ("Apa yang dijelaskan dalam sebut harga", ["Sebutharga bertulis menyatakan laluan, transport, hotel yang dicadang atau disahkan, aturan guide, makan, dan aktiviti yang termasuk.", "Exclusion, jadual deposit, balance, dan syarat pembatalan dinyatakan sebelum tempahan dianggap confirmed.", "Tempoh yang sama boleh berbeza kos kerana tarikh, jenis bilik, jarak laluan, jumlah tetamu, dan keperluan guide mengubah kos operasi.", "Pendekatan quotation-led ini lebih telus daripada menjanjikan satu harga marketplace sebelum ground arrangement disemak."]),
                ],
                "faqs": [
                    ("Boleh mula dari Lapangan Terbang Kualanamu?", "Boleh. Kebanyakan laluan private boleh bermula dari Kualanamu International Airport atau hotel di Medan."),
                    ("Boleh untuk solo traveler?", "Boleh. Solo private tour boleh dibuat dengan sebut harga tersuai mengikut laluan, guide, dan keperluan bilik."),
                    ("Boleh dibuat halal-friendly?", "Boleh. BROS Wisata boleh mengatur stop halal-friendly, waktu solat, dan pilihan makanan sesuai untuk tetamu Malaysia/Singapore."),
                    ("Berapa hari untuk Bukit Lawang dan Lake Toba?", "Pakej 6H5M atau lebih panjang biasanya lebih selesa apabila Bukit Lawang, Berastagi, Samosir, dan Lake Toba digabungkan."),
                    ("Kenapa tiada harga pakej tetap?", "Kos akhir bergantung pada tarikh, pax, susunan bilik, tahap hotel, jarak laluan, dan keperluan guide, jadi ground plan disemak sebelum sebut harga dibuat."),
                ],
            },
        },
    },
    {
        "key": "bukit-lawang-orangutan-trekking",
        "image": "/assets/gallery/bukit-lawang-orangutan-field-ahmad.jpg",
        "image_alt": {
            "en": "Bukit Lawang orangutan field documentation with Ahmad's local route team",
            "id": "Dokumentasi lapangan orangutan Bukit Lawang bersama tim rute lokal Ahmad",
            "ms": "Dokumentasi lapangan orangutan Bukit Lawang bersama pasukan laluan lokal Ahmad",
        },
        "slugs": {
            "en": "bukit-lawang-orangutan-trekking",
            "id": "wisata-bukit-lawang-orangutan",
            "ms": "bukit-lawang-orangutan-trekking",
        },
        "copy": {
            "en": {
                "title": "Bukit Lawang Orangutan Trekking & Private Tours | BROS Wisata",
                "description": "Plan a private Bukit Lawang orangutan trek from Medan with local guides, ethical wildlife practice, realistic trail options, and routes onward to Lake Toba.",
                "keywords": "Bukit Lawang orangutan trekking, Bukit Lawang tours, Bukit Lawang guide, Sumatra orangutan tour, ethical orangutan trekking",
                "kicker": "Bukit Lawang Orangutan Trekking",
                "h1": "Private Bukit Lawang orangutan trekking with a local guide.",
                "intro": "Bukit Lawang is the main gateway to rainforest trekking on the eastern edge of Gunung Leuser National Park. BROS Wisata coordinates the Medan transfer, lodge timing, and a local jungle guide, then matches the trail length to guest fitness, weather, and honest wildlife expectations.",
                "cta_text": "Ask Ahmad about Bukit Lawang",
                "wa": "Hi Ahmad, I found BROS Wisata from the Bukit Lawang Orangutan Trekking page. My date, pax, fitness level, and route idea are:",
                "stats": [("Access", "About 3.5 hours from Medan"), ("Focus", "Rainforest, local guide, river"), ("Ethic", "No feeding, no chasing wildlife")],
                "sections": [
                    ("Choose the right trekking level", ["A shorter guided trek can introduce the rainforest to first-time visitors, families, or guests who prefer a lighter physical day.", "A half-day or full-day route gives more trail time, but the guide still adapts the pace to heat, rain, mud, river conditions, and group fitness.", "An overnight jungle option requires a separate equipment, camp, porter, and safety check; it should be requested before the quotation is prepared.", "River tubing is optional and only operates when the local guide considers the water level, weather, and guest ability suitable."]),
                    ("Medan to Bukit Lawang logistics", ["The road transfer from Medan usually takes around three and a half hours, but airport timing, city traffic, road works, and weather can extend the journey.", "A very late arrival is often better followed by a Medan night instead of forcing a tiring road transfer after the flight.", "Lodges sit around the Bahorok riverside area, so luggage size, walking access, and room comfort should be discussed before booking.", "BROS Wisata confirms the pickup point, vehicle fit, lodge plan, guide meeting, and next transfer in one written itinerary."]),
                    ("Bukit Lawang to Lake Toba", ["Travelers searching for Bukit Lawang to Lake Toba should treat it as a multi-stop North Sumatra route, not a short transfer between nearby attractions.", "Berastagi can be used as a highland stop between the rainforest and Lake Toba when the total trip has enough days and the road sequence works.", "A 5D4N version is possible for selected flight times and a compact pace, while 6D5N or longer gives Bukit Lawang, Berastagi, Samosir, and Lake Toba more breathing room.", "The final order is checked against trekking day, ferry or Samosir access, hotel availability, and the airport or Medan drop-off requested by the guest."]),
                    ("Responsible wildlife practice", ["Orangutans and other wildlife are free-ranging, so sightings, distance, and duration can never be guaranteed.", "Guests must follow the local guide, keep a respectful distance, and never feed, touch, call, chase, or crowd an animal for a photograph.", "Trail choice may change when wildlife, weather, river conditions, or park guidance make another route more responsible.", "A strong tour is measured by safe observation and local knowledge, not by promising a staged encounter."]),
                    ("What to send for a quotation", ["Share travel date, pax, pickup point, flight timing, and whether Bukit Lawang is the full trip or part of a Lake Toba route.", "Tell Ahmad the preferred trek length, normal walking ability, child ages, knee or mobility concerns, and interest in tubing or an overnight trek.", "Add the lodge style, room composition, luggage amount, meal preference, and desired final drop-off.", "The quote is prepared after the vehicle, lodge, local guide, route timing, and optional activities are checked for the requested date."]),
                ],
                "faqs": [
                    ("Is Bukit Lawang suitable for first-time trekkers?", "Often yes, if the trekking level is matched to your fitness and the route is not overloaded."),
                    ("Can I travel from Bukit Lawang to Lake Toba?", "Yes. The more comfortable plan usually includes enough time for a highland stop such as Berastagi before Samosir or Lake Toba; the exact order depends on flight, road, and hotel timing."),
                    ("Can you guarantee seeing orangutans?", "No responsible operator should guarantee wildlife. The route can be planned well, but wildlife remains natural."),
                    ("How long is the transfer from Medan to Bukit Lawang?", "Allow roughly three and a half hours in normal conditions, with extra margin for airport timing, Medan traffic, road works, weather, and rest stops."),
                    ("What should I send before asking for a quote?", "Send the date, pax, pickup and drop-off, flight details, preferred trekking level, fitness or mobility notes, lodge style, and whether Lake Toba is part of the route."),
                ],
            },
            "id": {
                "title": "Wisata Bukit Lawang Orangutan Trekking | BROS Wisata",
                "description": "Private trekking orangutan Bukit Lawang dari Medan dengan guide lokal, jarak aman satwa, jungle lodge, river tubing, dan quotation by request.",
                "keywords": "wisata Bukit Lawang orangutan, trekking orangutan Sumatra, private guide Gunung Leuser, eco tour Bukit Lawang",
                "kicker": "Bukit Lawang Orangutan Trekking",
                "h1": "Rute jungle yang baik harus terasa hati-hati, bukan ramai dipaksakan.",
                "intro": "Bukit Lawang adalah salah satu rute eco-tourism paling kuat di Sumatra Utara. BROS Wisata membantu menyusun private trekking bersama partner guide lokal, tempo realistis, dan ekspektasi satwa yang jujur.",
                "cta_text": "Tanya Ahmad soal Bukit Lawang",
                "wa": "Halo Ahmad, saya menemukan BROS Wisata dari halaman Wisata Bukit Lawang Orangutan. Tanggal, jumlah pax, fitness level, dan ide rute saya:",
                "stats": [("Akses", "Sekitar 3,5 jam dari Medan"), ("Fokus", "Rainforest, guide lokal, sungai"), ("Etik", "Tidak memberi makan atau mengejar satwa")],
                "sections": [
                    ("Tamu yang paling cocok", ["Tamu yang ingin rainforest dan wildlife dengan rute yang lebih pelan dan hati-hati.", "Couple, solo traveler, keluarga, dan small group dengan fitness normal.", "Tamu yang lebih percaya pada planning jujur daripada janji satwa pasti terlihat."]),
                    ("Opsi rute", ["Day trek dengan lodge tepi sungai dan transfer Medan.", "2H1M jungle trekking atau jungle camp by request.", "Bukit Lawang dikombinasikan dengan Tangkahan, Berastagi, atau Lake Toba.", "Tempo fleksibel mengikuti cuaca, kondisi trail, dan fitness tamu."]),
                    ("Catatan responsible travel", ["Satwa liar tidak dijamin dan tidak boleh dipaksa.", "Tamu mengikuti instruksi guide lokal, menjaga jarak, dan tidak memberi makan.", "BROS Wisata memprioritaskan partner lokal dan feasibility rute sebelum quotation."]),
                ],
                "faqs": [
                    ("Cocok untuk pemula?", "Sering cocok, asalkan level trekking disesuaikan dengan fitness dan rute tidak dipadatkan berlebihan."),
                    ("Bisa digabung dengan Lake Toba?", "Bisa. Rute 5H4M atau 6H5M dapat menggabungkan Bukit Lawang dengan Berastagi, Samosir, dan Lake Toba."),
                    ("Bisa menjamin lihat orangutan?", "Tidak ada operator bertanggung jawab yang seharusnya menjamin satwa liar. Rute bisa direncanakan baik, tapi wildlife tetap natural."),
                ],
            },
            "ms": {
                "title": "Bukit Lawang Orangutan Trekking dengan Guide Lokal | BROS Wisata",
                "description": "Private trekking orangutan Bukit Lawang dari Medan dengan guide lokal, jarak aman wildlife, jungle lodge, river tubing, dan sebut harga by request.",
                "keywords": "Bukit Lawang orangutan trekking, trekking orangutan Sumatera, private guide Gunung Leuser, eco tour Bukit Lawang",
                "kicker": "Bukit Lawang Orangutan Trekking",
                "h1": "Laluan jungle yang baik patut terasa berhati-hati, bukan terlalu padat.",
                "intro": "Bukit Lawang ialah salah satu laluan eco-tourism paling kuat di Sumatera Utara. BROS Wisata membantu susun private trekking bersama partner guide lokal, tempo realistik, dan jangkaan wildlife yang jujur.",
                "cta_text": "Tanya Ahmad tentang Bukit Lawang",
                "wa": "Hai Ahmad, saya jumpa BROS Wisata dari halaman Bukit Lawang Orangutan Trekking. Tarikh, bilangan pax, fitness level, dan idea laluan saya:",
                "stats": [("Akses", "Sekitar 3.5 jam dari Medan"), ("Fokus", "Rainforest, guide lokal, sungai"), ("Etika", "Tidak memberi makan atau mengejar wildlife")],
                "sections": [
                    ("Tetamu yang paling sesuai", ["Tetamu yang mahu rainforest dan wildlife dengan laluan yang lebih santai dan berhati-hati.", "Pasangan, solo traveler, keluarga, dan small group dengan fitness biasa.", "Tetamu yang lebih percaya pada planning jujur berbanding janji wildlife pasti kelihatan."]),
                    ("Pilihan laluan", ["Day trek dengan lodge tepi sungai dan transfer Medan.", "2H1M jungle trekking atau jungle camp by request.", "Bukit Lawang digabung dengan Tangkahan, Berastagi, atau Lake Toba.", "Tempo fleksibel mengikut cuaca, keadaan trail, dan fitness tetamu."]),
                    ("Nota responsible travel", ["Wildlife tidak dijamin dan tidak patut dipaksa.", "Tetamu ikut arahan guide lokal, menjaga jarak, dan tidak memberi makan.", "BROS Wisata mengutamakan partner lokal dan feasibility laluan sebelum sebut harga."]),
                ],
                "faqs": [
                    ("Sesuai untuk beginner?", "Selalunya sesuai, jika tahap trekking disesuaikan dengan fitness dan laluan tidak terlalu padat."),
                    ("Boleh gabung dengan Lake Toba?", "Boleh. Laluan 5H4M atau 6H5M boleh gabungkan Bukit Lawang dengan Berastagi, Samosir, dan Lake Toba."),
                    ("Boleh jamin lihat orangutan?", "Tiada operator bertanggungjawab yang patut menjamin wildlife. Laluan boleh dirancang baik, tapi wildlife tetap natural."),
                ],
            },
        },
    },
    {
        "key": "lake-toba-samosir-private-tour",
        "image": "/assets/gallery/gallery_03_samosir_port.jpg",
        "image_alt": {
            "en": "Samosir Island and Lake Toba private tour route",
            "id": "Rute private tour Pulau Samosir dan Lake Toba",
            "ms": "Laluan private tour Pulau Samosir dan Lake Toba",
        },
        "slugs": {
            "en": "lake-toba-samosir-private-tour",
            "id": "private-tour-lake-toba-samosir",
            "ms": "pakej-lake-toba-samosir",
        },
        "copy": {
            "en": {
                "title": "Lake Toba and Samosir Private Tour | BROS Wisata",
                "description": "Plan a private Lake Toba and Samosir tour from Medan with Berastagi, Sipiso-Piso, Batak culture, realistic road timing, and a custom quotation.",
                "keywords": "Lake Toba private tour, Samosir Island tour, Medan to Lake Toba tour, Sipiso Piso Berastagi Samosir",
                "kicker": "Lake Toba and Samosir Private Tour",
                "h1": "Plan a private Lake Toba and Samosir tour from Medan.",
                "intro": "Lake Toba works best as a private route when the long road journey, Berastagi highland stops, Samosir access, hotel location, and final flight are planned together. BROS Wisata checks those moving parts before Ahmad sends a custom quotation.",
                "cta_text": "Plan my Lake Toba route",
                "wa": "Hi Ahmad, I found BROS Wisata from the Lake Toba and Samosir page. My date, pax, hotel style, and Lake Toba route idea are:",
                "stats": [("Route", "Medan, Berastagi, Sipiso-Piso, Samosir"), ("Pace", "2 to 4 nights recommended"), ("Good for", "Families, couples, private groups")],
                "sections": [
                    ("Medan to Lake Toba route planning", ["The road journey is part of the experience, so arrival time and the first overnight stop matter as much as the destination list.", "Berastagi and Sipiso-Piso fit naturally when the group has enough daylight and does not overload the first day after a flight.", "The route may use Parapat, Samosir, or another agreed lake-side base depending on hotel preference and the activities requested.", "Traffic, weather, rest stops, and ferry or lake-crossing arrangements are treated as planning variables rather than fixed promises."]),
                    ("How many nights to allow", ["A 3D2N route is the compact option and normally requires a focused plan with limited detours.", "A 4D3N trip gives more room for Medan, Berastagi, Sipiso-Piso, Lake Toba, and Samosir without turning every day into a transfer day.", "A 5D4N route suits families or guests who want more time for Batak culture, a quieter lake stay, or a final Medan night.", "A 6D5N or longer itinerary is more realistic when Bukit Lawang, jungle trekking, or Tangkahan is added."]),
                    ("Samosir stay and local experience", ["Hotel location affects how easily the group reaches village, museum, viewpoint, food, and cultural stops around Samosir.", "Ahmad can shape the day around Batak history, local communities, scenery, or a slower family pace rather than repeating one fixed circuit.", "Meal preferences and halal-friendly requirements should be shared early because suitable stops depend on the daily route.", "Activities remain subject to opening times, local conditions, and the interests and mobility of the guests."]),
                    ("Vehicle, hotel, and room fit", ["The vehicle is matched to pax, luggage, road sequence, and whether the trip begins at Kualanamu Airport or a Medan hotel.", "Hotel proposals reflect comfort level, room composition, travel date, and whether the guests value lake view, access, or a quieter setting.", "Families should state child ages and whether they prefer shared bedding, an extra bed, or separate rooms before the quotation is issued.", "The confirmed booking document records the agreed route, inclusions, hotel arrangement, and pickup or drop-off point."]),
                    ("Before requesting your quote", ["Send the travel date, pax, flight number, pickup point, final drop-off, luggage, and preferred number of nights at Lake Toba.", "List must-see places and tell us whether Bukit Lawang, Berastagi, or a final Medan night is essential.", "Share the hotel level, room types, dietary needs, walking ability, and any children or senior travelers in the group.", "BROS Wisata then checks road flow, hotel availability, local arrangements, and the private transport plan before pricing."]),
                ],
                "faqs": [
                    ("How many nights should I stay at Lake Toba?", "Two nights is more comfortable than one if you want Samosir, culture stops, and a less rushed drive."),
                    ("Can Lake Toba be combined with Bukit Lawang?", "Yes, but it is better as a 6D5N or longer private route."),
                    ("Can BROS Wisata arrange final drop-off in Medan?", "Yes. Final drop-off can be Medan city hotel, Kualanamu Airport, or another agreed point."),
                    ("Can Berastagi and Sipiso-Piso be included?", "Yes. They fit well on many private routes when flight time, daylight, road conditions, and the planned overnight stop allow a comfortable pace."),
                    ("Is the vehicle private throughout the tour?", "The quotation states the agreed private transport arrangement, route, pickup, and final drop-off so the inclusions are clear before confirmation."),
                ],
            },
            "id": {
                "title": "Private Tour Lake Toba dan Samosir | BROS Wisata",
                "description": "Private tour Lake Toba dan Samosir dari Medan dengan Berastagi, Sipiso-Piso, jadwal ferry, budaya Batak, dan quotation custom.",
                "keywords": "private tour Lake Toba, tour Pulau Samosir, Medan ke Lake Toba, Sipiso Piso Berastagi Samosir",
                "kicker": "Private Tour Lake Toba dan Samosir",
                "h1": "Lake Toba lebih pantas dinikmati pelan, bukan sekadar foto singkat.",
                "intro": "BROS Wisata menyusun rute Lake Toba dan Samosir dengan memperhitungkan ferry, waktu tempuh, kenyamanan hotel, stop highland, dan pengalaman budaya Batak yang cocok untuk grup Anda.",
                "cta_text": "Susun rute Lake Toba",
                "wa": "Halo Ahmad, saya menemukan BROS Wisata dari halaman Private Tour Lake Toba dan Samosir. Tanggal, jumlah pax, gaya hotel, dan ide rute Lake Toba saya:",
                "stats": [("Rute", "Medan, Berastagi, Sipiso-Piso, Samosir"), ("Tempo", "Disarankan 2 sampai 4 malam"), ("Cocok", "Keluarga, couple, private group")],
                "sections": [
                    ("Yang beda dari planning Lake Toba", ["Waktu tempuh dari Medan cukup panjang, jadi tempo rute penting.", "Jadwal ferry dan lokasi hotel Samosir perlu dicek sebelum quotation.", "Berastagi dan Sipiso-Piso bisa masuk bila rute tidak dipaksakan.", "Preferensi makan, level kenyamanan, dan final drop-off perlu jelas sejak awal."]),
                    ("Gaya rute umum", ["3H2M fast Lake Toba route untuk tamu dengan waktu terbatas.", "4H3M Medan, Berastagi, Lake Toba, dan Samosir.", "5H4M halal-friendly family route untuk tamu Malaysia atau Singapore.", "6H5M rute gabungan dengan Bukit Lawang atau Tangkahan."]),
                    ("Pertanyaan yang sering muncul", ["Berapa malam ideal di Samosir?", "Bisa termasuk Berastagi dan Sipiso-Piso?", "Apakah private driver ikut sepanjang trip?", "Bisa final night di Medan sebelum flight pagi?"]),
                ],
                "faqs": [
                    ("Berapa malam ideal di Lake Toba?", "Dua malam lebih nyaman daripada satu malam bila ingin Samosir, stop budaya, dan perjalanan tidak terlalu terburu-buru."),
                    ("Bisa digabung dengan Bukit Lawang?", "Bisa, tapi lebih ideal sebagai rute private 6H5M atau lebih panjang."),
                    ("Bisa drop-off akhir di Medan?", "Bisa. Final drop-off dapat di hotel Medan, Bandara Kualanamu, atau titik lain yang disepakati."),
                ],
            },
            "ms": {
                "title": "Pakej Lake Toba dan Samosir Private Tour | BROS Wisata",
                "description": "Rancang private tour Lake Toba dan Samosir dari Medan dengan Berastagi, Sipiso-Piso, budaya Batak, masa jalan realistik, dan sebut harga tersuai.",
                "keywords": "pakej Lake Toba, tour Pulau Samosir, Medan ke Lake Toba, Sipiso Piso Berastagi Samosir",
                "kicker": "Lake Toba dan Samosir Private Tour",
                "h1": "Rancang private tour Lake Toba dan Samosir dari Medan.",
                "intro": "Lake Toba paling selesa dijelajahi apabila perjalanan jalan darat, stop Berastagi, akses Samosir, lokasi hotel, dan waktu flight akhir dirancang sebagai satu laluan. BROS Wisata menyemak semua butiran itu sebelum Ahmad menghantar sebut harga tersuai.",
                "cta_text": "Susun laluan Lake Toba",
                "wa": "Hai Ahmad, saya jumpa BROS Wisata dari halaman Pakej Lake Toba dan Samosir. Tarikh, bilangan pax, gaya hotel, dan idea laluan Lake Toba saya:",
                "stats": [("Laluan", "Medan, Berastagi, Sipiso-Piso, Samosir"), ("Tempo", "Disaran 2 hingga 4 malam"), ("Sesuai", "Keluarga, pasangan, private group")],
                "sections": [
                    ("Planning Medan ke Lake Toba", ["Perjalanan jalan darat adalah sebahagian daripada pengalaman, jadi waktu ketibaan dan lokasi malam pertama sama penting dengan senarai destinasi.", "Berastagi dan Sipiso-Piso sesuai dimasukkan apabila ada waktu siang yang cukup dan hari pertama selepas flight tidak terlalu padat.", "Laluan boleh menggunakan Parapat, Samosir, atau lokasi tepi tasik lain mengikut hotel dan aktiviti yang dipilih.", "Trafik, cuaca, rest stop, dan urusan ferry atau penyeberangan tasik diambil kira sebagai keadaan operasi, bukan janji waktu tetap."]),
                    ("Berapa malam yang sesuai", ["Pakej 3H2M ialah pilihan ringkas dan biasanya perlu fokus pada stop utama dengan detour yang minimum.", "Pakej 4H3M memberi ruang lebih baik untuk Medan, Berastagi, Sipiso-Piso, Lake Toba, dan Samosir tanpa setiap hari terasa seperti hari transfer.", "Pakej 5H4M sesuai untuk keluarga atau tetamu yang mahu lebih masa untuk budaya Batak, suasana tasik, atau final night di Medan.", "Pakej 6H5M atau lebih panjang lebih realistik jika Bukit Lawang, jungle trekking, atau Tangkahan turut dimasukkan."]),
                    ("Penginapan Samosir dan pengalaman lokal", ["Lokasi hotel mempengaruhi akses ke kampung, muzium, viewpoint, tempat makan, dan stop budaya di sekitar Samosir.", "Ahmad boleh susun hari mengikut minat kepada sejarah Batak, komuniti lokal, pemandangan, atau tempo keluarga yang lebih santai.", "Keperluan makanan dan pilihan halal-friendly perlu diberitahu awal kerana stop yang sesuai bergantung pada laluan harian.", "Aktiviti tertakluk pada waktu operasi, keadaan lokal, minat tetamu, dan tahap mobiliti kumpulan."]),
                    ("Kenderaan, hotel, dan susunan bilik", ["Kenderaan dipadankan dengan pax, bagasi, urutan laluan, dan sama ada perjalanan bermula di Kualanamu Airport atau hotel Medan.", "Cadangan hotel mengambil kira tahap keselesaan, susunan bilik, tarikh perjalanan, dan pilihan lake view, akses, atau suasana lebih tenang.", "Keluarga perlu menyatakan umur anak serta pilihan shared bedding, extra bed, atau bilik berasingan sebelum sebut harga dibuat.", "Dokumen tempahan merekodkan laluan, inclusion, susunan hotel, serta titik pickup dan drop-off yang sudah dipersetujui."]),
                    ("Sebelum minta sebut harga", ["Kirim tarikh, pax, nombor flight, titik pickup, final drop-off, jumlah bagasi, dan berapa malam yang diinginkan di Lake Toba.", "Senaraikan tempat wajib dan beritahu jika Bukit Lawang, Berastagi, atau final night Medan mesti dimasukkan.", "Kirim tahap hotel, jenis bilik, keperluan makanan, kemampuan berjalan, serta maklumat anak atau warga emas dalam kumpulan.", "BROS Wisata kemudian menyemak aliran jalan, ketersediaan hotel, urusan lokal, dan private transport sebelum menentukan harga."]),
                ],
                "faqs": [
                    ("Berapa malam ideal di Lake Toba?", "Dua malam lebih selesa daripada satu malam jika mahu Samosir, stop budaya, dan perjalanan tidak terlalu rushing."),
                    ("Boleh gabung dengan Bukit Lawang?", "Boleh, tapi lebih ideal sebagai laluan private 6H5M atau lebih panjang."),
                    ("Boleh drop-off akhir di Medan?", "Boleh. Final drop-off boleh di hotel Medan, Kualanamu Airport, atau titik lain yang dipersetujui."),
                    ("Boleh masukkan Berastagi dan Sipiso-Piso?", "Boleh. Kedua-duanya sesuai dalam banyak laluan private apabila waktu flight, cahaya siang, keadaan jalan, dan lokasi penginapan membolehkan tempo yang selesa."),
                    ("Adakah kenderaan private sepanjang tour?", "Sebutharga menyatakan susunan private transport, laluan, pickup, dan final drop-off yang dipersetujui supaya inclusion jelas sebelum confirmation."),
                ],
            },
        },
    },
    {
        "key": "singapore-to-north-sumatra-tour",
        "image": "/assets/gallery/gallery_12_sipiso_waterfall.jpg",
        "image_alt": {
            "en": "North Sumatra private route for Singapore travelers",
            "id": "Rute private Sumatra Utara untuk tamu Singapore",
            "ms": "Laluan private Sumatera Utara untuk tetamu Singapore",
        },
        "slugs": {
            "en": "singapore-to-north-sumatra-tour",
            "id": "tour-sumatra-utara-dari-singapore",
            "ms": "pakej-sumatera-utara-dari-singapore",
        },
        "copy": {
            "en": {
                "title": "Singapore to North Sumatra Private Tour | BROS Wisata",
                "description": "Private North Sumatra tour planning for Singapore travelers flying SIN-KNO: Medan arrival, Lake Toba, Bukit Lawang, Berastagi, solo or small-group quotation.",
                "keywords": "Singapore to North Sumatra tour, SIN KNO Medan private tour, Singapore Lake Toba tour, Singapore Bukit Lawang tour",
                "kicker": "Singapore to North Sumatra",
                "h1": "A short flight from Singapore can become a proper Sumatra private trip.",
                "intro": "For Singapore travelers, North Sumatra works well as a private route when arrival timing, road transfer, guide schedule, and final Medan night are planned carefully.",
                "cta_text": "Plan from Singapore",
                "wa": "Hi Ahmad, I found BROS Wisata from the Singapore to North Sumatra page. My flight/date, pax, hotel style, and route idea are:",
                "stats": [("Airport", "SIN to KNO arrival planning"), ("Trip style", "Solo, couple, small group"), ("Focus", "Lake Toba, jungle, highlands")],
                "sections": [
                    ("Why Singapore travelers need a private plan", ["Arrival time at Kualanamu affects whether the first night should be in Medan or outside the city.", "Solo and small-group trips need realistic driver, room, and guide costing.", "Final drop-off can be Medan city hotel when the guest arranges an extra night.", "Wise or bank transfer receipts can be handled professionally through BROS Wisata ops documents."]),
                    ("Good route lengths", ["4D3N for Bukit Lawang or Lake Toba focus.", "5D4N for Berastagi and Lake Toba with a better pace.", "6D5N for Bukit Lawang, Berastagi, Lake Toba, and Samosir.", "Custom trip for solo female travelers who want clear guide and transport coordination."]),
                    ("Before you request a quote", ["Share flight number and arrival time.", "Share whether you prefer comfort, eco lodge, or simple local stay.", "Tell us if final night in Medan is self-arranged.", "Share hiking fitness and must-see places."]),
                ],
                "faqs": [
                    ("Can BROS Wisata handle one-pax Singapore guests?", "Yes. One-pax private trips are possible with a custom quote and clear ground arrangement."),
                    ("Can I pay 50% deposit first?", "For confirmed bookings, deposit and balance terms can be stated in the booking confirmation and payment receipt."),
                    ("Can the balance be paid during the trip?", "It can be arranged when agreed in writing before the trip, for example during the Lake Toba or Samosir stay."),
                ],
            },
            "id": {
                "title": "Tour Sumatra Utara dari Singapore | BROS Wisata",
                "description": "Private tour Sumatra Utara untuk tamu Singapore rute SIN-KNO: arrival Medan, Lake Toba, Bukit Lawang, Berastagi, solo atau small-group quotation.",
                "keywords": "tour Sumatra Utara dari Singapore, SIN KNO Medan private tour, Singapore Lake Toba, Singapore Bukit Lawang",
                "kicker": "Singapore ke Sumatra Utara",
                "h1": "Flight pendek dari Singapore bisa jadi private trip Sumatra yang rapi.",
                "intro": "Untuk tamu Singapore, Sumatra Utara cocok dibuat private route bila jam arrival, road transfer, jadwal guide, dan final night Medan direncanakan sejak awal.",
                "cta_text": "Rencanakan dari Singapore",
                "wa": "Halo Ahmad, saya menemukan BROS Wisata dari halaman Tour Sumatra Utara dari Singapore. Flight/tanggal, jumlah pax, gaya hotel, dan ide rute saya:",
                "stats": [("Airport", "Planning arrival SIN ke KNO"), ("Gaya trip", "Solo, couple, small group"), ("Fokus", "Lake Toba, jungle, highland")],
                "sections": [
                    ("Kenapa tamu Singapore butuh private plan", ["Jam arrival Kualanamu menentukan apakah malam pertama sebaiknya di Medan atau langsung keluar kota.", "Trip solo dan small group perlu costing driver, kamar, dan guide yang realistis.", "Final drop-off bisa di hotel Medan bila tamu mengatur extra night sendiri.", "Receipt Wise atau bank transfer bisa ditangani rapi lewat dokumen ops BROS Wisata."]),
                    ("Durasi rute yang cocok", ["4H3M untuk fokus Bukit Lawang atau Lake Toba.", "5H4M untuk Berastagi dan Lake Toba dengan tempo lebih nyaman.", "6H5M untuk Bukit Lawang, Berastagi, Lake Toba, dan Samosir.", "Custom trip untuk solo female traveler yang butuh koordinasi guide dan transport jelas."]),
                    ("Sebelum minta quote", ["Kirim flight number dan jam arrival.", "Kirim preferensi comfort, eco lodge, atau simple local stay.", "Beritahu bila final night Medan diatur sendiri.", "Kirim fitness hiking dan destinasi wajib."]),
                ],
                "faqs": [
                    ("Bisa handle tamu Singapore 1 pax?", "Bisa. One-pax private trip bisa dibuat dengan custom quote dan ground arrangement yang jelas."),
                    ("Bisa DP 50% dulu?", "Untuk confirmed booking, ketentuan deposit dan balance bisa tertulis di booking confirmation dan payment receipt."),
                    ("Bisa bayar sisa saat trip?", "Bisa bila disepakati tertulis sebelum trip, misalnya saat stay Lake Toba atau Samosir."),
                ],
            },
            "ms": {
                "title": "Pakej Sumatera Utara dari Singapore | BROS Wisata",
                "description": "Private tour Sumatera Utara untuk tetamu Singapore laluan SIN-KNO: arrival Medan, Lake Toba, Bukit Lawang, Berastagi, solo atau small-group quotation.",
                "keywords": "pakej Sumatera Utara dari Singapore, SIN KNO Medan private tour, Singapore Lake Toba, Singapore Bukit Lawang",
                "kicker": "Singapore ke Sumatera Utara",
                "h1": "Flight singkat dari Singapore boleh jadi private trip Sumatera yang tersusun.",
                "intro": "Untuk tetamu Singapore, Sumatera Utara sesuai dibuat private route bila waktu arrival, road transfer, jadual guide, dan final night Medan dirancang sejak awal.",
                "cta_text": "Rancang dari Singapore",
                "wa": "Hai Ahmad, saya jumpa BROS Wisata dari halaman Pakej Sumatera Utara dari Singapore. Flight/tarikh, bilangan pax, gaya hotel, dan idea laluan saya:",
                "stats": [("Airport", "Planning arrival SIN ke KNO"), ("Gaya trip", "Solo, pasangan, small group"), ("Fokus", "Lake Toba, jungle, highland")],
                "sections": [
                    ("Kenapa tetamu Singapore perlu private plan", ["Waktu arrival Kualanamu menentukan sama ada malam pertama lebih baik di Medan atau terus keluar kota.", "Trip solo dan small group perlu costing driver, bilik, dan guide yang realistik.", "Final drop-off boleh di hotel Medan jika tetamu urus extra night sendiri.", "Receipt Wise atau bank transfer boleh ditangani kemas melalui dokumen ops BROS Wisata."]),
                    ("Tempoh laluan yang sesuai", ["4H3M untuk fokus Bukit Lawang atau Lake Toba.", "5H4M untuk Berastagi dan Lake Toba dengan tempo lebih selesa.", "6H5M untuk Bukit Lawang, Berastagi, Lake Toba, dan Samosir.", "Custom trip untuk solo female traveler yang perlukan koordinasi guide dan transport jelas."]),
                    ("Sebelum minta sebut harga", ["Kirim flight number dan waktu arrival.", "Kirim preferensi comfort, eco lodge, atau simple local stay.", "Maklumkan jika final night Medan diurus sendiri.", "Kirim fitness hiking dan destinasi wajib."]),
                ],
                "faqs": [
                    ("Boleh handle tetamu Singapore 1 pax?", "Boleh. One-pax private trip boleh dibuat dengan custom quote dan ground arrangement yang jelas."),
                    ("Boleh deposit 50% dulu?", "Untuk confirmed booking, syarat deposit dan balance boleh dinyatakan dalam booking confirmation dan payment receipt."),
                    ("Boleh bayar baki semasa trip?", "Boleh jika disepakati secara bertulis sebelum trip, contohnya semasa stay Lake Toba atau Samosir."),
                ],
            },
        },
    },
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def abs_url(path: str) -> str:
    return SITE + path


def analytics_snippet() -> str:
    return """
<!-- Google Analytics 4 -->
<script src="/assets/analytics.js"></script>
<!-- Microsoft Clarity -->
<script type="text/javascript">
  window.addEventListener('load', function() {
    window.setTimeout(function() {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "wles2u2nk2");
    }, 1800);
  });
</script>""".strip()


def page_url(hub: dict, lang: str) -> str:
    return f"{SITE}/{lang}/{hub['slugs'][lang]}"


def page_path(hub: dict, lang: str) -> Path:
    return ROOT / lang / f"{hub['slugs'][lang]}.html"


def nav(lang: str) -> str:
    label = LANG[lang]
    return f"""
<div class="seo-topbar"><div class="seo-shell seo-topbar-inner"><span>Medan, North Sumatra, Indonesia</span><span>PT BROS INTI WISATA</span></div></div>
<nav class="seo-nav">
  <div class="seo-shell seo-nav-inner">
    <a class="seo-brand" href="/{lang}/" aria-label="BROS Wisata home">
      <img src="/bros-wisata-logos/bros-wisata-logo-horizontal-small-300px.png" alt="BROS Wisata logo"/>
    </a>
    <div class="seo-nav-links">
      <a href="/{lang}/">{esc(label['home'])}</a>
      <a href="/{lang}/bros-wisata-tour-listing">{esc(label['tours'])}</a>
      <a href="/{lang}/bros-wisata-car-rental">{esc(label['rental'])}</a>
      <a href="/{lang}/bros-wisata-custom-tour">{esc(label['custom'])}</a>
      <a href="/{lang}/meet-ahmad">Ahmad</a>
      <a href="/{lang}/bros-wisata-contact">{esc(label['contact'])}</a>
    </div>
    <a class="seo-nav-cta" href="https://wa.me/6281260139399?text={quote('Hi Ahmad, I want to plan a private North Sumatra tour. My date, pax, and route idea are:')}" target="_blank" rel="noopener">{esc(label['whatsapp'])}</a>
  </div>
</nav>""".strip()


def slug_for(key: str, lang: str) -> str:
    for hub in HUBS:
        if hub["key"] == key:
            return hub["slugs"][lang]
    raise KeyError(key)


def footer(lang: str) -> str:
    label = LANG[lang]
    return f"""
<footer class="seo-footer">
  <div class="seo-shell seo-footer-grid">
    <div>
      <img class="seo-footer-logo" src="/bros-wisata-logos/bros-wisata-logo-horizontal-white-small-300px.png" alt="BROS Wisata logo"/>
      <p>{esc(label['footer_text'])}</p>
    </div>
    <div>
      <h2>{esc(label['destinations'])}</h2>
      <a href="/{lang}/{slug_for('lake-toba-samosir-private-tour', lang)}">Lake Toba</a>
      <a href="/{lang}/{slug_for('bukit-lawang-orangutan-trekking', lang)}">Bukit Lawang</a>
      <a href="/{lang}/bros-wisata-tour-listing">Berastagi</a>
      <a href="/{lang}/bros-wisata-tour-listing">Tangkahan</a>
    </div>
    <div>
      <h2>{esc(label['services'])}</h2>
      <a href="/{lang}/{slug_for('private-north-sumatra-tour', lang)}">{esc(label['custom'])}</a>
      <a href="/{lang}/bros-wisata-tour-listing">{esc(label['tours'])}</a>
      <a href="/{lang}/bros-wisata-car-rental">{esc(label['rental_footer'])}</a>
      <a href="/{lang}/meet-ahmad">Meet Ahmad</a>
      <a href="/{lang}/responsible-travel">Responsible Travel</a>
    </div>
    <div>
      <h2>{esc(label['office'])}</h2>
      <p>Jl. Ring Road No. 117 B<br/>Medan Sunggal, Medan 20122<br/>North Sumatra, Indonesia</p>
      <p>WhatsApp: +62 812-6013-9399<br/>Email: hello@broswisata.id</p>
    </div>
  </div>
  <div class="seo-shell seo-footer-bottom">Copyright 2026 PT BROS INTI WISATA. NIB 2502250049355.</div>
</footer>""".strip()


def cards(items: list[str]) -> str:
    return "\n".join(f"<li>{esc(item)}</li>" for item in items)


def stat_cards(stats: list[tuple[str, str]]) -> str:
    return "\n".join(
        f"<article><strong>{esc(k)}</strong><span>{esc(v)}</span></article>" for k, v in stats
    )


def section_cards(sections: list[tuple[str, list[str]]]) -> str:
    out = []
    for title, items in sections:
        out.append(
            f"""<article class="seo-route-card">
  <h2>{esc(title)}</h2>
  <ul>{cards(items)}</ul>
</article>"""
        )
    return "\n".join(out)


def faq_markup(faqs: list[tuple[str, str]]) -> str:
    return "\n".join(
        f"""<article>
  <h3>{esc(q)}</h3>
  <p>{esc(a)}</p>
</article>"""
        for q, a in faqs
    )


def schema_for(hub: dict, lang: str) -> str:
    c = hub["copy"][lang]
    canonical = page_url(hub, lang)
    graph = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": c["title"],
            "url": canonical,
            "description": c["description"],
            "inLanguage": lang,
            "publisher": {"@type": "Organization", "name": "BROS Wisata", "url": SITE},
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": LANG[lang]["home"], "item": f"{SITE}/{lang}/"},
                {"@type": "ListItem", "position": 2, "name": c["kicker"], "item": canonical},
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": ["Service", "TouristTrip"],
            "name": c["kicker"],
            "url": canonical,
            "description": c["description"],
            "provider": {
                "@type": "TravelAgency",
                "name": "BROS Wisata",
                "url": SITE,
                "telephone": "+62-812-6013-9399",
            },
            "areaServed": [
                {"@type": "Place", "name": "Medan"},
                {"@type": "Place", "name": "North Sumatra"},
                {"@type": "Place", "name": "Lake Toba"},
                {"@type": "Place", "name": "Bukit Lawang"},
            ],
            "offers": {
                "@type": "Offer",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "IDR",
                    "description": "Private quotation by request based on travel date, group size, hotel category, and route.",
                },
                "availability": "https://schema.org/InStock",
                "url": canonical,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": q,
                    "acceptedAnswer": {"@type": "Answer", "text": a},
                }
                for q, a in c["faqs"]
            ],
        },
    ]
    return json.dumps(graph, ensure_ascii=False, separators=(",", ":"))


def build_page(hub: dict, lang: str) -> str:
    c = hub["copy"][lang]
    label = LANG[lang]
    canonical = page_url(hub, lang)
    og_image = abs_url(f"/assets/og/{lang}/{hub['slugs'][lang]}.jpg")
    social_title = re.sub(
        r"\s*(?:\||—|–)\s*BROS\s+Wisata.*$", "", c["title"], flags=re.IGNORECASE
    ).strip()
    social_alt = {
        "en": f"BROS Wisata preview for {social_title}, featuring North Sumatra travel imagery.",
        "id": f"Pratinjau BROS Wisata untuk {social_title} dengan visual perjalanan Sumatra Utara.",
        "ms": f"Pratonton BROS Wisata untuk {social_title} dengan visual perjalanan Sumatera Utara.",
    }[lang]
    alternates = "\n".join(
        [f'<link href="{page_url(hub, "en")}" hreflang="x-default" rel="alternate"/>']
        + [f'<link href="{page_url(hub, alt_lang)}" hreflang="{alt_lang}" rel="alternate"/>' for alt_lang in LANG_ORDER]
    )
    related = []
    for other in HUBS:
        if other["key"] != hub["key"]:
            oc = other["copy"][lang]
            related.append(f'<a href="/{lang}/{other["slugs"][lang]}">{esc(oc["kicker"])}</a>')
    related.append(f'<a href="/{lang}/meet-ahmad">Meet Ahmad</a>')
    related.append(f'<a href="/{lang}/responsible-travel">Responsible Travel</a>')
    related_links = "\n".join(related)
    wa_href = "https://wa.me/6281260139399?text=" + quote(c["wa"])
    return f"""<!DOCTYPE html>
<html lang="{label['html_lang']}">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>{esc(c['title'])}</title>
<meta content="{esc(c['title'])}" name="title"/>
<meta content="{esc(c['description'])}" name="description"/>
<meta content="{esc(c['keywords'])}" name="keywords"/>
<meta content="PT BROS INTI WISATA" name="author"/>
<meta content="index, follow, max-image-preview:large" name="robots"/>
<link href="{canonical}" rel="canonical"/>
{alternates}
<meta content="website" property="og:type"/>
<meta content="{canonical}" property="og:url"/>
<meta content="{esc(c['title'])}" property="og:title"/>
<meta content="{esc(c['description'])}" property="og:description"/>
<meta content="{og_image}" property="og:image"/>
<meta content="image/jpeg" property="og:image:type"/>
<meta content="1200" property="og:image:width"/>
<meta content="630" property="og:image:height"/>
<meta content="{esc(social_alt)}" property="og:image:alt"/>
<meta content="summary_large_image" name="twitter:card"/>
<meta content="{og_image}" name="twitter:image"/>
<meta content="{esc(social_alt)}" name="twitter:image:alt"/>
<meta content="{label['locale']}" property="og:locale"/>
<meta content="BROS Wisata" property="og:site_name"/>
<meta content="{esc(c['title'])}" name="twitter:title"/>
<meta content="{esc(c['description'])}" name="twitter:description"/>
<link href="/bros-wisata-logos/bros-wisata-icon-square-favicon-32px.png" rel="icon" sizes="32x32" type="image/png"/>
<link href="/bros-wisata-logos/bros-wisata-icon-square-favicon-64px.png" rel="icon" sizes="64x64" type="image/png"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&amp;family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="/assets/style.css" rel="stylesheet"/>
<script type="application/ld+json">{schema_for(hub, lang)}</script>
{analytics_snippet()}
</head>
<body class="seo-page">
{nav(lang)}
<main>
<section class="seo-hero">
  <div class="seo-shell seo-hero-grid">
    <div class="seo-hero-copy">
      <div class="seo-kicker">{esc(c['kicker'])}</div>
      <h1>{esc(c['h1'])}</h1>
      <p>{esc(c['intro'])}</p>
      <div class="seo-hero-actions">
        <a class="seo-primary" href="{wa_href}" target="_blank" rel="noopener">{esc(c['cta_text'])}</a>
        <a class="seo-secondary" href="/{lang}/bros-wisata-tour-listing">{esc(label['tours'])}</a>
      </div>
    </div>
    <figure class="seo-hero-photo">
      <img src="{hub['image']}" alt="{esc(hub['image_alt'][lang])}" loading="eager" decoding="async"/>
      <figcaption>{esc(hub['image_alt'][lang])}</figcaption>
    </figure>
  </div>
</section>
<section class="seo-stat-band">
  <div class="seo-shell seo-stats">{stat_cards(c['stats'])}</div>
</section>
<section class="seo-content-band">
  <div class="seo-shell">
    <div class="seo-section-head">
      <div class="seo-kicker">Route Planning</div>
      <h2>{esc(c['kicker'])}</h2>
      <p>{esc(c['description'])}</p>
    </div>
    <div class="seo-route-grid">{section_cards(c['sections'])}</div>
  </div>
</section>
<section class="seo-faq-band">
  <div class="seo-shell">
    <div class="seo-section-head">
      <div class="seo-kicker">FAQ</div>
      <h2>{esc(label['planning_title'])}</h2>
      <p>{esc(label['planning_copy'])}</p>
    </div>
    <div class="seo-faq-grid">{faq_markup(c['faqs'])}</div>
  </div>
</section>
<section class="seo-related">
  <div class="seo-shell seo-related-inner">
    <div>
      <div class="seo-kicker">{esc(label['related'])}</div>
      <h2>{esc(label['cta_title'])}</h2>
      <p>{esc(label['cta_copy'])}</p>
    </div>
    <div class="seo-related-links">{related_links}</div>
  </div>
</section>
</main>
<a class="seo-wa-float" href="{wa_href}" target="_blank" rel="noopener" aria-label="WhatsApp BROS Wisata">WA</a>
{footer(lang)}
<script src="/assets/whatsapp-source.js" defer></script>
</body>
</html>
"""


def planning_section(lang: str) -> str:
    label = LANG[lang]
    cards_html = []
    for hub in HUBS:
        c = hub["copy"][lang]
        cards_html.append(
            f"""<article class="seo-hub-card">
  <a href="/{lang}/{hub['slugs'][lang]}">
    <span>{esc(c['kicker'])}</span>
    <strong>{esc(c['title'].split('|')[0].strip())}</strong>
    <p>{esc(c['description'])}</p>
  </a>
</article>"""
        )
    return f"""
<!-- SEO INTENT HUBS START -->
<section class="seo-hub-list">
  <div class="seo-shell">
    <div class="seo-section-head">
      <div class="seo-kicker">{esc(label['planning_label'])}</div>
      <h2>{esc(label['planning_title'])}</h2>
      <p>{esc(label['planning_copy'])}</p>
    </div>
    <div class="seo-hub-grid">
      {''.join(cards_html)}
    </div>
  </div>
</section>
<!-- SEO INTENT HUBS END -->
""".strip()


def upsert_index_sections() -> None:
    marker = "<!-- ======= CTA BANNER ======= -->"
    pattern = re.compile(r"\n?<!-- SEO INTENT HUBS START -->.*?<!-- SEO INTENT HUBS END -->\n?", re.S)
    for lang in LANG:
        path = ROOT / lang / "index.html"
        text = path.read_text(encoding="utf-8")
        section = "\n" + planning_section(lang) + "\n"
        if pattern.search(text):
            text = pattern.sub(section, text)
        elif marker in text:
            text = text.replace(marker, section + marker, 1)
        else:
            text = text.replace("</main>", section + "</main>", 1)
        path.write_text(text, encoding="utf-8")


def attrs(tag: str) -> dict[str, str]:
    return {m.group(1).lower(): m.group(2) for m in re.finditer(r"([a-zA-Z:-]+)\s*=\s*[\"']([^\"']*)[\"']", tag)}


def extract_links(text: str) -> tuple[str | None, list[tuple[str, str]]]:
    canonical = None
    alternates: list[tuple[str, str]] = []
    for tag in re.findall(r"<link\b[^>]*>", text, re.I):
        a = attrs(tag)
        rel = a.get("rel", "").lower()
        href = a.get("href")
        if not href:
            continue
        if "canonical" in rel:
            canonical = href
        if "alternate" in rel and "hreflang" in a:
            alternates.append((a["hreflang"], href))
    return canonical, alternates


def include_html(path: Path, text: str) -> bool:
    if path.name == "bros-wisata-homepage.html":
        return False
    if 'content="noindex' in text.lower():
        return False
    return True


def sitemap_priority(url: str) -> tuple[str, str]:
    if re.search(r"/(en|ms|id)/$", url):
        return "weekly", "1.00"
    if any(hub["slugs"][lang] in url for hub in HUBS for lang in LANG):
        return "weekly", "0.92"
    if "paket-" in url or "tour-listing" in url or "custom-tour" in url or "car-rental" in url:
        return "weekly", "0.85"
    if "privacy" in url or "terms" in url:
        return "yearly", "0.30"
    return "monthly", "0.70"


def sitemap_lastmod(url: str) -> str:
    return LASTMOD_OVERRIDES.get(url, DEFAULT_LASTMOD)


def regenerate_sitemap() -> None:
    ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    ET.register_namespace("xhtml", "http://www.w3.org/1999/xhtml")
    urlset = ET.Element("{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")
    seen: set[str] = set()
    records: list[tuple[str, list[tuple[str, str]]]] = []
    for lang in LANG_ORDER:
        for path in sorted((ROOT / lang).glob("*.html")):
            text = path.read_text(encoding="utf-8", errors="ignore")
            if not include_html(path, text):
                continue
            canonical, alternates = extract_links(text)
            if not canonical or canonical in seen:
                continue
            seen.add(canonical)
            records.append((canonical, alternates))
    records.sort(key=lambda row: (0 if re.search(r"/(en|ms|id)/$", row[0]) else 1, row[0]))
    for canonical, alternates in records:
        node = ET.SubElement(urlset, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        ET.SubElement(node, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text = canonical
        ET.SubElement(node, "{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod").text = sitemap_lastmod(canonical)
        changefreq, priority = sitemap_priority(canonical)
        ET.SubElement(node, "{http://www.sitemaps.org/schemas/sitemap/0.9}changefreq").text = changefreq
        ET.SubElement(node, "{http://www.sitemaps.org/schemas/sitemap/0.9}priority").text = priority
        alt_seen: set[tuple[str, str]] = set()
        for hreflang, href in alternates:
            key = (hreflang, href)
            if key in alt_seen:
                continue
            alt_seen.add(key)
            ET.SubElement(
                node,
                "{http://www.w3.org/1999/xhtml}link",
                {"rel": "alternate", "hreflang": hreflang, "href": href},
            )
    ET.indent(urlset, space="  ")
    tree = ET.ElementTree(urlset)
    tree.write(ROOT / "sitemap.xml", encoding="utf-8", xml_declaration=True)


def write_pages() -> None:
    for hub in HUBS:
        for lang in LANG:
            page_path(hub, lang).write_text(build_page(hub, lang), encoding="utf-8")


def main() -> None:
    write_pages()
    upsert_index_sections()
    regenerate_sitemap()


if __name__ == "__main__":
    main()
