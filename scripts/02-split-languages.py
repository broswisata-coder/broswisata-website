"""
Hari 2 - Step 2: Split HTML files into language-specific versions
- Each HTML file → 3 versions (id, ms, en)
- Restructure folder: /id/, /ms/, /en/
- Update <html lang>, canonical, hreflang
- Update internal links to /lang/ prefix
- Replace JS toggle with <a> language switcher
- Translate WhatsApp prefilled messages
"""
import os
import re
import shutil
from pathlib import Path
from copy import copy
from bs4 import BeautifulSoup, NavigableString

ROOT = Path('/home/claude/broswisata-v2')
LANGS = ['id', 'ms', 'en']
LANG_MAP = {
    'id': {'html': 'id', 'data': 'id', 'pretty': 'Indonesia',  'short': 'ID', 'og_locale': 'id_ID'},
    'ms': {'html': 'ms', 'data': 'my', 'pretty': 'Malaysia',   'short': 'MY', 'og_locale': 'ms_MY'},  # data attr uses "my"
    'en': {'html': 'en', 'data': 'en', 'pretty': 'English',    'short': 'EN', 'og_locale': 'en_US'},
}

# WhatsApp message templates per language
WA_MESSAGES = {
    'id': 'Halo BROS Wisata, saya tertarik dengan paket tour Sumatra Utara. Mohon info lengkap.',
    'ms': 'Hai BROS Wisata, saya berminat dengan pakej tour Sumatera Utara. Mohon maklumat lengkap.',
    'en': 'Hi BROS Wisata, I am interested in your Sumatra tour packages. Please send me more info.',
}

# All top-level HTML files to process
HTML_FILES = [
    'bros-wisata-homepage.html',
    'bros-wisata-about.html',
    'bros-wisata-car-rental.html',
    'bros-wisata-contact.html',
    'bros-wisata-custom-tour.html',
    'bros-wisata-tour-listing.html',
    'paket-berastagi_3h2m.html',
    'paket-bukit_lawang_4h3m.html',
    'paket-combo_sumut_6h5m.html',
    'paket-halal_3h2m_medan_toba.html',
    'paket-halal_4h3m_medan_toba.html',
    'paket-halal_5h4m_medan_toba.html',
    'paket-medan_heritage_3h2m.html',
    'paket-tangkahan_3h2m.html',
    'paket-western_4d3n_jungle.html',
    'paket-western_5d4n_volcano.html',
    'paket-western_7d6n_ultimate.html',
]

# All HTML pages (relative paths used in <a href>)
INTERNAL_LINKS = set(HTML_FILES)


def process_lang_elements(soup, target_lang_data):
    """
    For all data-lang-content and data-lang-block elements:
    - Keep matching: unwrap (replace with inner content)
    - Non-matching: decompose (delete)
    """
    # Process data-lang-content (inline)
    for el in soup.find_all(attrs={'data-lang-content': True}):
        if el.get('data-lang-content') == target_lang_data:
            # Keep contents, unwrap
            el.unwrap()
        else:
            el.decompose()
    
    # Process data-lang-block (block-level)
    for el in soup.find_all(attrs={'data-lang-block': True}):
        if el.get('data-lang-block') == target_lang_data:
            el.unwrap()
        else:
            el.decompose()


def update_html_lang(soup, lang_code):
    """Update <html lang="..."> attribute."""
    html_tag = soup.find('html')
    if html_tag:
        html_tag['lang'] = lang_code  # 'id', 'ms', or 'en'


def update_canonical_and_add_hreflang(soup, current_filename, target_lang):
    """
    Update canonical to /lang/filename.html
    Add hreflang alternates for all 3 langs + x-default
    """
    head = soup.find('head')
    if not head:
        return
    
    base_url = 'https://broswisata.id'
    
    # Update canonical
    canonical = soup.find('link', rel='canonical')
    if canonical:
        canonical['href'] = f'{base_url}/{target_lang}/{current_filename}'
    
    # Remove existing hreflang (if any)
    for el in soup.find_all('link', rel='alternate'):
        if el.get('hreflang'):
            el.decompose()
    
    # Add hreflang for all 3 languages
    for lang in LANGS:
        link = soup.new_tag('link', rel='alternate')
        link['hreflang'] = lang
        link['href'] = f'{base_url}/{lang}/{current_filename}'
        # Insert after canonical, or at end of head
        if canonical:
            canonical.insert_after(link)
            canonical.insert_after('\n')
        else:
            head.append(link)
    
    # Add x-default (points to ID version as default)
    xdefault = soup.new_tag('link', rel='alternate')
    xdefault['hreflang'] = 'x-default'
    xdefault['href'] = f'{base_url}/id/{current_filename}'
    if canonical:
        canonical.insert_after(xdefault)
        canonical.insert_after('\n')


def update_og_locale(soup, target_lang):
    """Update og:locale to match the target language."""
    og_locale_main = LANG_MAP[target_lang]['og_locale']
    
    # Update og:locale (primary)
    og_locale = soup.find('meta', property='og:locale')
    if og_locale:
        og_locale['content'] = og_locale_main
    
    # Remove old og:locale:alternate
    for el in soup.find_all('meta', property='og:locale:alternate'):
        el.decompose()
    
    # Add og:locale:alternate for other langs
    if og_locale:
        for lang in LANGS:
            if lang != target_lang:
                alt = soup.new_tag('meta', property='og:locale:alternate')
                alt['content'] = LANG_MAP[lang]['og_locale']
                og_locale.insert_after(alt)
                og_locale.insert_after('\n')


def update_internal_links(soup, target_lang):
    """
    Update all internal HTML links to use /lang/ prefix.
    Examples:
      bros-wisata-homepage.html → /id/bros-wisata-homepage.html (for ID version)
      paket-bukit_lawang_4h3m.html → /id/paket-bukit_lawang_4h3m.html
      assets/... → /assets/... (absolute, no lang prefix)
    """
    for a in soup.find_all('a', href=True):
        href = a['href']
        # Skip external links
        if href.startswith(('http://', 'https://', 'mailto:', 'tel:', '#')):
            continue
        # Skip anchor-only links
        if href.startswith('#'):
            continue
        
        # Strip query strings for matching
        path_part = href.split('#')[0].split('?')[0]
        
        # If it's an internal HTML file, prefix with /lang/
        if path_part in INTERNAL_LINKS:
            # Preserve any anchor or query
            anchor = ''
            if '#' in href:
                anchor = '#' + href.split('#', 1)[1]
            a['href'] = f'/{target_lang}/{path_part}{anchor}'
    
    # Update absolute URLs to broswisata.id/file.html → broswisata.id/lang/file.html
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('https://broswisata.id/') and not href.startswith(f'https://broswisata.id/{target_lang}/'):
            # Check if it's an HTML file (not asset)
            for fname in INTERNAL_LINKS:
                if href.endswith(f'/{fname}'):
                    a['href'] = f'https://broswisata.id/{target_lang}/{fname}'
                    break


def update_asset_paths(soup):
    """
    Update relative asset paths to absolute (with leading /):
      assets/... → /assets/...
      bros-wisata-logos/... → /bros-wisata-logos/...
    This ensures assets work from /id/, /ms/, /en/ subdirs.
    """
    asset_prefixes = ('assets/', 'bros-wisata-logos/')
    
    # Update <img src="...">
    for img in soup.find_all('img', src=True):
        src = img['src']
        if any(src.startswith(p) for p in asset_prefixes):
            img['src'] = '/' + src
    
    # Update <link href="..."> (favicons etc, but not the stylesheet which is already /assets/style.css)
    for link in soup.find_all('link', href=True):
        href = link['href']
        if any(href.startswith(p) for p in asset_prefixes):
            link['href'] = '/' + href
    
    # Update <a href="assets/pdf/..."> for PDF downloads
    for a in soup.find_all('a', href=True):
        href = a['href']
        if any(href.startswith(p) for p in asset_prefixes):
            a['href'] = '/' + href
    
    # Update <source srcset="..."> in <picture>
    for src in soup.find_all('source', srcset=True):
        srcset = src['srcset']
        # Handle multi-value srcset
        new_parts = []
        for part in srcset.split(','):
            part = part.strip()
            if any(part.split(' ')[0].startswith(p) for p in asset_prefixes):
                new_parts.append('/' + part)
            else:
                new_parts.append(part)
        src['srcset'] = ', '.join(new_parts)


def replace_language_switcher(soup, current_filename, target_lang):
    """
    Replace JS-based language toggle (buttons with onclick="setLang(...)")
    with proper <a href> links to language versions.
    Also remove inline setLang() script.
    """
    # Find buttons with onclick="setLang('xx')"
    for btn in soup.find_all('button', onclick=True):
        onclick = btn.get('onclick', '')
        match = re.match(r"setLang\('(\w+)'\)", onclick)
        if match:
            btn_lang = match.group(1)  # 'id', 'my', or 'en'
            # Map 'my' (old data attr) to 'ms' (folder name)
            target_folder = 'ms' if btn_lang == 'my' else btn_lang
            
            # Create new <a> tag
            new_a = soup.new_tag('a', href=f'/{target_folder}/{current_filename}')
            
            # Copy classes
            classes = btn.get('class', [])
            # Mark current language as active
            if target_folder == target_lang:
                if 'active' not in classes:
                    classes.append('active')
            else:
                classes = [c for c in classes if c != 'active']
            new_a['class'] = classes
            
            # Copy id if present
            if btn.get('id'):
                new_a['id'] = btn['id']
            
            # Copy inner content
            for child in btn.children:
                new_a.append(copy(child))
            
            # Replace
            btn.replace_with(new_a)
    
    # Remove inline setLang script
    for script in soup.find_all('script'):
        if script.string and 'setLang' in script.string and 'function setLang' in script.string:
            script.decompose()
    
    # Also handle data-lang attribute style (used in tour pages)
    # <button data-lang="id" class="lang-btn active...">ID</button>
    for btn in soup.find_all('button', attrs={'data-lang': True}):
        btn_lang = btn['data-lang']  # 'id', 'my', 'en'
        target_folder = 'ms' if btn_lang == 'my' else btn_lang
        
        new_a = soup.new_tag('a', href=f'/{target_folder}/{current_filename}')
        classes = btn.get('class', [])
        if target_folder == target_lang:
            if 'active' not in classes:
                classes.append('active')
        else:
            classes = [c for c in classes if c != 'active']
        new_a['class'] = classes
        
        for child in btn.children:
            new_a.append(copy(child))
        
        btn.replace_with(new_a)


def update_whatsapp_messages(soup, target_lang):
    """
    Replace WhatsApp pre-filled messages (URL-encoded) with appropriate language.
    """
    from urllib.parse import quote
    
    target_msg = quote(WA_MESSAGES[target_lang])
    
    # Pattern: wa.me/PHONE?text=ENCODED_MESSAGE
    pattern = re.compile(r'(https?://wa\.me/\d+\?text=)([^"\']+)')
    
    for a in soup.find_all('a', href=True):
        href = a['href']
        if 'wa.me/' in href and '?text=' in href:
            # Replace text after ?text=
            new_href = pattern.sub(rf'\g<1>{target_msg}', href)
            a['href'] = new_href


def add_lang_link_to_homepage_redirect(soup, target_lang):
    """
    For root index.html (later), or to add a hint about other lang versions.
    Skipped for now — handled by _redirects.
    """
    pass


def fix_logo_link(soup, target_lang):
    """
    Logo link in nav — should go to /lang/ homepage, not just '#' or root.
    """
    for a in soup.find_all('a', href=True):
        # Logo usually has flex + items-center and contains BROS WISATA text
        if a.get('href') in ('#', '/', ''):
            text = a.get_text(strip=True)
            if 'BROS WISATA' in text or 'BROS Wisata' in text:
                a['href'] = f'/{target_lang}/bros-wisata-homepage.html'


def remove_lang_only_scripts(soup):
    """Remove obsolete inline scripts that only handled language toggle."""
    for script in soup.find_all('script'):
        if script.string:
            content = script.string.strip()
            # Remove standalone setLang functions
            if content.startswith('function setLang') or 'setLang(' in content:
                # Check if this script ONLY handles language
                if 'setLang' in content and not any(kw in content for kw in ['mobile-menu', 'IntersectionObserver', 'fetch(', 'addEventListener(\'submit\'']):
                    script.decompose()


def process_file(filename, target_lang):
    """Process a single file for a target language."""
    src = ROOT / filename
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse with BS4 — use 'html.parser' to preserve more original formatting
    soup = BeautifulSoup(content, 'html.parser')
    
    target_data_attr = LANG_MAP[target_lang]['data']  # 'id', 'my', or 'en'
    
    # 1. Process lang elements (unwrap match, decompose others)
    process_lang_elements(soup, target_data_attr)
    
    # 2. Update html lang attribute
    update_html_lang(soup, target_lang)
    
    # 3. Update canonical + add hreflang alternates
    update_canonical_and_add_hreflang(soup, filename, target_lang)
    
    # 4. Update og:locale + alternates
    update_og_locale(soup, target_lang)
    
    # 5. Update internal HTML links (add /lang/ prefix)
    update_internal_links(soup, target_lang)
    
    # 6. Update asset paths to absolute
    update_asset_paths(soup)
    
    # 7. Replace JS language switcher with <a> links
    replace_language_switcher(soup, filename, target_lang)
    
    # 8. Translate WhatsApp messages
    update_whatsapp_messages(soup, target_lang)
    
    # 9. Fix logo link to point to /lang/homepage
    fix_logo_link(soup, target_lang)
    
    # 10. Remove obsolete lang-toggle scripts
    remove_lang_only_scripts(soup)
    
    # Output
    output_dir = ROOT / target_lang
    output_dir.mkdir(exist_ok=True)
    output_path = output_dir / filename
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    return output_path


def main():
    print(f"Processing {len(HTML_FILES)} files × {len(LANGS)} langs = {len(HTML_FILES) * len(LANGS)} output files\n")
    
    # Clean existing lang directories
    for lang in LANGS:
        lang_dir = ROOT / lang
        if lang_dir.exists():
            shutil.rmtree(lang_dir)
    
    counts = {'id': 0, 'ms': 0, 'en': 0}
    sizes_before = 0
    sizes_after = {'id': 0, 'ms': 0, 'en': 0}
    
    for filename in HTML_FILES:
        src_path = ROOT / filename
        if not src_path.exists():
            print(f"⚠ {filename} not found, skipping")
            continue
        
        sizes_before += src_path.stat().st_size
        
        for lang in LANGS:
            try:
                output_path = process_file(filename, lang)
                counts[lang] += 1
                sizes_after[lang] += output_path.stat().st_size
            except Exception as e:
                print(f"✗ {filename} → {lang}: {e}")
                continue
        
        print(f"✓ {filename} → /id/, /ms/, /en/")
    
    print()
    print(f"Generated: {sum(counts.values())} files")
    for lang in LANGS:
        print(f"  /{lang}/: {counts[lang]} files, {sizes_after[lang] / 1024:.1f} KB total")
    
    print()
    print(f"Original total: {sizes_before / 1024:.1f} KB (per language)")
    avg_after = sum(sizes_after.values()) / 3
    print(f"Average per-lang now: {avg_after / 1024:.1f} KB")
    print(f"Reduction per page: {(1 - avg_after/sizes_before) * 100:.1f}%")
    print()
    
    # Verify hreflang count
    print("=== Verification ===")
    for lang in LANGS:
        sample = ROOT / lang / 'bros-wisata-homepage.html'
        with open(sample) as f:
            content = f.read()
        hreflang_count = content.count('hreflang=')
        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', content)
        html_lang = re.search(r'<html lang="([^"]+)"', content)
        print(f"  /{lang}/: hreflang={hreflang_count}, canonical={canonical.group(1) if canonical else 'MISSING'}, html lang={html_lang.group(1) if html_lang else 'MISSING'}")


if __name__ == '__main__':
    main()
