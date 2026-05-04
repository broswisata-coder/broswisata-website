"""
Hari 2 - Step 3: Generate proper multilingual sitemap with hreflang annotations
Ref: https://developers.google.com/search/docs/specialty/international/localized-versions
"""
from pathlib import Path
from datetime import date

ROOT = Path('/home/claude/broswisata-v2')
TODAY = date.today().isoformat()
BASE_URL = 'https://broswisata.id'
LANGS = ['id', 'ms', 'en']

# Page priorities and change frequency
PAGES = [
    # filename, priority, changefreq
    ('bros-wisata-homepage.html',          '1.0', 'weekly'),
    ('bros-wisata-tour-listing.html',      '0.9', 'weekly'),
    ('bros-wisata-car-rental.html',        '0.9', 'weekly'),
    ('bros-wisata-custom-tour.html',       '0.8', 'monthly'),
    ('bros-wisata-about.html',             '0.7', 'monthly'),
    ('bros-wisata-contact.html',           '0.6', 'monthly'),
    # Signature 5 packages (high priority)
    ('paket-medan_heritage_3h2m.html',     '0.85', 'monthly'),
    ('paket-bukit_lawang_4h3m.html',       '0.85', 'monthly'),
    ('paket-tangkahan_3h2m.html',          '0.85', 'monthly'),
    ('paket-berastagi_3h2m.html',          '0.85', 'monthly'),
    ('paket-combo_sumut_6h5m.html',        '0.9',  'monthly'),
    # Western Eco packages
    ('paket-western_4d3n_jungle.html',     '0.85', 'monthly'),
    ('paket-western_5d4n_volcano.html',    '0.85', 'monthly'),
    ('paket-western_7d6n_ultimate.html',   '0.9',  'monthly'),
    # Halal Malaysia packages
    ('paket-halal_3h2m_medan_toba.html',   '0.85', 'monthly'),
    ('paket-halal_4h3m_medan_toba.html',   '0.85', 'monthly'),
    ('paket-halal_5h4m_medan_toba.html',   '0.85', 'monthly'),
]


def build_sitemap():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    lines.append('        xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    lines.append('        xmlns:image="http://www.google.com/schemas/sitemaps-image/1.0">')
    lines.append('')
    
    # Generate one <url> entry per page per language
    for filename, priority, changefreq in PAGES:
        for lang in LANGS:
            url = f'{BASE_URL}/{lang}/{filename}'
            lines.append('  <url>')
            lines.append(f'    <loc>{url}</loc>')
            lines.append(f'    <lastmod>{TODAY}</lastmod>')
            lines.append(f'    <changefreq>{changefreq}</changefreq>')
            lines.append(f'    <priority>{priority}</priority>')
            
            # Add hreflang alternates for each language
            for alt_lang in LANGS:
                alt_url = f'{BASE_URL}/{alt_lang}/{filename}'
                lines.append(f'    <xhtml:link rel="alternate" hreflang="{alt_lang}" href="{alt_url}"/>')
            
            # x-default to ID version
            xdefault_url = f'{BASE_URL}/id/{filename}'
            lines.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{xdefault_url}"/>')
            
            lines.append('  </url>')
            lines.append('')
    
    lines.append('</urlset>')
    return '\n'.join(lines)


def main():
    sitemap = build_sitemap()
    output = ROOT / 'sitemap.xml'
    with open(output, 'w', encoding='utf-8') as f:
        f.write(sitemap)
    
    # Stats
    url_count = sitemap.count('<url>')
    hreflang_count = sitemap.count('xhtml:link')
    
    print(f"✓ sitemap.xml regenerated")
    print(f"  URLs: {url_count}")
    print(f"  hreflang annotations: {hreflang_count}")
    print(f"  Languages: {', '.join(LANGS)}")
    print(f"  File size: {output.stat().st_size} bytes")


if __name__ == '__main__':
    main()
