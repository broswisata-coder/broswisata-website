"""
Hari 1 - Step 2: HTML Cleanup
- Replace Tailwind CDN with local CSS
- Remove inline tailwind config
- Remove inline custom CSS (now in style.css)
- Fix data inconsistencies (jam, email, alamat)
- Remove aggregateRating from JSON-LD
- Fix duplicate og:image tags
"""
import os
import re
import json
from pathlib import Path

ROOT = Path('/home/claude/broswisata-v2')

# Find all HTML files (top level only)
html_files = sorted([f for f in ROOT.glob('*.html')])
print(f"Processing {len(html_files)} HTML files...")
print()

CANONICAL_DATA = {
    'email_primary': 'hello@broswisata.id',
    'email_legacy': 'broswisata@gmail.com',
    'phone': '+62-812-6013-9399',
    'phone_wa': '6281260139399',
    'address': {
        'streetAddress': 'Jl. Ring Road No. 117 B, Kel. Sei Sikambing B',
        'addressLocality': 'Medan Sunggal',
        'addressRegion': 'Sumatera Utara',
        'postalCode': '20122',
        'addressCountry': 'ID'
    },
    'geo': {'latitude': '3.5861596', 'longitude': '98.6271794'},
    'gbp_url': 'https://share.google/Uv9LJLkbDjYHhMzTj',
    'gbp_cid': '15578232527648135807',
}

def clean_html(content, filename):
    changes = []

    # 1. REMOVE Tailwind CDN script
    new = re.sub(
        r'<script\s+src="https://cdn\.tailwindcss\.com"\s*>\s*</script>\s*',
        '',
        content
    )
    if new != content:
        changes.append("Removed Tailwind CDN script")
        content = new

    # 2. REMOVE inline tailwind.config script block
    new = re.sub(
        r'<script>\s*tailwind\.config\s*=\s*\{.*?\}\s*</script>',
        '',
        content,
        flags=re.DOTALL
    )
    if new != content:
        changes.append("Removed inline tailwind.config")
        content = new

    # 3. REMOVE all inline <style>...</style> blocks (custom CSS now in style.css)
    style_count = len(re.findall(r'<style[^>]*>.*?</style>', content, flags=re.DOTALL))
    new = re.sub(r'<style[^>]*>.*?</style>\s*', '', content, flags=re.DOTALL)
    if style_count > 0:
        changes.append(f"Removed {style_count} inline <style> blocks")
        content = new

    # 4. ADD external stylesheet link (just before </head>)
    if 'assets/style.css' not in content:
        link_tag = '<link rel="stylesheet" href="/assets/style.css">\n'
        content = re.sub(r'(\s*</head>)', f'\n{link_tag}\\1', content, count=1)
        changes.append("Added /assets/style.css link")

    # 5. FIX EMAIL: replace broswisata@gmail.com with hello@broswisata.id
    old_email_count = content.count('broswisata@gmail.com')
    if old_email_count > 0:
        content = content.replace('broswisata@gmail.com', 'hello@broswisata.id')
        changes.append(f"Updated {old_email_count} email references to hello@broswisata.id")

    # 6. REMOVE aggregateRating from JSON-LD blocks
    rating_pattern = re.compile(
        r',?\s*"aggregateRating"\s*:\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}',
        flags=re.DOTALL
    )
    rating_count = len(rating_pattern.findall(content))
    if rating_count > 0:
        content = rating_pattern.sub('', content)
        changes.append(f"Removed {rating_count} aggregateRating block(s)")

    # 7. FIX OPENING HOURS: standardize to Mon-Sat 09:00-18:00, Sunday closed
    # Replace any 24/7 opening hours
    new = re.sub(
        r'"openingHoursSpecification"\s*:\s*\{[^{}]*"opens"\s*:\s*"00:00"[^{}]*"closes"\s*:\s*"23:59"[^{}]*\}',
        '''"openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ]''',
        content,
        flags=re.DOTALL
    )
    if new != content:
        changes.append("Fixed opening hours to Mon-Sat 09:00-18:00 (Sun closed)")
        content = new

    # 8. FIX duplicate og:image tags - keep only the first one
    og_image_matches = re.findall(r'<meta\s+property="og:image"\s+content="[^"]+"\s*/?>\s*', content)
    if len(og_image_matches) > 1:
        # Keep first, remove subsequent
        first = og_image_matches[0]
        for dup in og_image_matches[1:]:
            content = content.replace(dup, '', 1)
        changes.append(f"Removed {len(og_image_matches) - 1} duplicate og:image tag(s)")

    # 9. FIX broken Sunday hours wording
    content = content.replace(
        '"Minggu 10:00–16:00"',
        '"Minggu tutup"'
    )

    # 10. UPDATE Google Business Profile URL in sameAs (homepage TravelAgency schema)
    if filename == 'bros-wisata-homepage.html':
        content = content.replace(
            '"https://share.google/Uv9LJLkbDjYHhMzTj"',
            f'"{CANONICAL_DATA["gbp_url"]}"'
        )

    # 11. Add language="en" lang fallback removal preparation
    # (real lang fix happens in Hari 2 with URL split)

    return content, changes


total_changes = 0
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    cleaned, changes = clean_html(original, filepath.name)

    if changes:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f"✓ {filepath.name}")
        for c in changes:
            print(f"    - {c}")
        total_changes += len(changes)
    else:
        print(f"  {filepath.name} (no changes)")

print()
print(f"Total: {total_changes} fixes across {len(html_files)} files")
