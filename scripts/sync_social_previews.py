#!/usr/bin/env python3
"""Generate and synchronize BROS Wisata social preview metadata.

The generated images are deterministic 1200 x 630 JPEG files suitable for
WhatsApp, Facebook, LinkedIn, and X large-card previews. Run with ``--check``
in CI or during audits to detect stale HTML or image assets.
"""

from __future__ import annotations

import argparse
import hashlib
import html as html_module
import io
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ("id", "ms", "en")
SITE_ORIGIN = "https://broswisata.id"
OG_WIDTH = 1200
OG_HEIGHT = 630

NAVY = "#08275f"
BLUE = "#0f47b0"
GOLD = "#e8a317"
CREAM = "#f7f3ea"
WHITE = "#ffffff"
MUTED = "#d8e5ff"

LOGO_PATH = (
    ROOT
    / "bros-wisata-logos"
    / "bros-wisata-logo-horizontal-white-large-2000px.png"
)
FONT_REGULAR = next(
    (
        candidate
        for candidate in (
            Path("C:/Windows/Fonts/arial.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        )
        if candidate.exists()
    ),
    Path("DejaVuSans.ttf"),
)
FONT_BOLD = next(
    (
        candidate
        for candidate in (
            Path("C:/Windows/Fonts/arialbd.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        )
        if candidate.exists()
    ),
    Path("DejaVuSans-Bold.ttf"),
)

META_KEYS = {
    "og:image",
    "og:image:secure_url",
    "og:image:type",
    "og:image:width",
    "og:image:height",
    "og:image:alt",
    "twitter:card",
    "twitter:image",
    "twitter:image:alt",
}

COPY = {
    "en": {
        "eyebrow": "PRIVATE TOURS • NORTH SUMATRA",
        "location": "Medan • Lake Toba • Bukit Lawang",
        "alt": "BROS Wisata preview for {title}, featuring North Sumatra travel imagery.",
        "categories": {
            "home": "LOCAL EXPERTS, PERSONAL JOURNEYS",
            "about": "ABOUT BROS WISATA",
            "contact": "PLAN WITH A LOCAL TEAM",
            "custom": "TAILOR-MADE PRIVATE TOUR",
            "tours": "CURATED TOUR PACKAGES",
            "car": "CAR RENTAL WITH DRIVER",
            "orangutan": "RESPONSIBLE WILDLIFE EXPERIENCE",
            "guide": "MEET YOUR LOCAL GUIDE",
            "volcano": "HIGHLANDS & VOLCANOES",
            "toba": "LAKE TOBA & SAMOSIR",
            "heritage": "MEDAN CULTURE & FLAVOURS",
            "tangkahan": "RAINFOREST & ELEPHANT CONSERVATION",
            "singapore": "NORTH SUMATRA FROM SINGAPORE",
            "policy": "TRAVEL INFORMATION",
            "visa": "INDONESIA VISA SERVICES",
        },
        "visa": {
            "eyebrow": "APPLICATION ASSISTANCE • BROS WISATA",
            "location": "Ms Yana • +62 813-7023-3750",
            "alt": "BROS Wisata preview for {title}: Indonesia visa assistance, contact Ms Yana at +62 813-7023-3750. Illustrated document, not an issued visa.",
            "panel_subtitle": "VISA ASSISTANCE",
            "panel_steps": ("Purpose of visit", "Document review", "Coordination"),
            "panel_contact": "CONSULT MS YANA",
            "panel_note": "Independent application assistance",
        },
    },
    "id": {
        "eyebrow": "PRIVATE TOUR • SUMATRA UTARA",
        "location": "Medan • Danau Toba • Bukit Lawang",
        "alt": "Pratinjau BROS Wisata untuk {title} dengan visual perjalanan Sumatra Utara.",
        "categories": {
            "home": "PAKAR LOKAL, PERJALANAN PERSONAL",
            "about": "TENTANG BROS WISATA",
            "contact": "RENCANAKAN DENGAN TIM LOKAL",
            "custom": "PRIVATE TOUR SESUAI KEBUTUHAN",
            "tours": "PILIHAN PAKET WISATA",
            "car": "SEWA MOBIL DENGAN SOPIR",
            "orangutan": "WISATA SATWA BERTANGGUNG JAWAB",
            "guide": "KENALI PEMANDU LOKAL ANDA",
            "volcano": "DATARAN TINGGI & GUNUNG API",
            "toba": "DANAU TOBA & SAMOSIR",
            "heritage": "BUDAYA & CITA RASA MEDAN",
            "tangkahan": "HUTAN HUJAN & KONSERVASI GAJAH",
            "singapore": "SUMATRA UTARA DARI SINGAPURA",
            "policy": "INFORMASI PERJALANAN",
            "visa": "LAYANAN VISA INDONESIA",
        },
        "visa": {
            "eyebrow": "PENDAMPINGAN PENGAJUAN • BROS WISATA",
            "location": "Ms Yana • +62 813-7023-3750",
            "alt": "Pratinjau BROS Wisata untuk {title}: layanan visa Indonesia, hubungi Ms Yana di +62 813-7023-3750. Ilustrasi dokumen, bukan visa yang telah diterbitkan.",
            "panel_subtitle": "PENDAMPINGAN VISA",
            "panel_steps": ("Tujuan kunjungan", "Pemeriksaan berkas", "Koordinasi"),
            "panel_contact": "KONSULTASI MS YANA",
            "panel_note": "Bantuan administrasi independen",
        },
    },
    "ms": {
        "eyebrow": "PAKEJ PERSENDIRIAN • SUMATERA UTARA",
        "location": "Medan • Danau Toba • Bukit Lawang",
        "alt": "Pratonton BROS Wisata untuk {title} dengan visual perjalanan Sumatera Utara.",
        "categories": {
            "home": "PAKAR TEMPATAN, PERJALANAN PERIBADI",
            "about": "TENTANG BROS WISATA",
            "contact": "RANCANG BERSAMA PASUKAN TEMPATAN",
            "custom": "PAKEJ PERSENDIRIAN KHAS",
            "tours": "PILIHAN PAKEJ PELANCONGAN",
            "car": "SEWA KERETA DENGAN PEMANDU",
            "orangutan": "PENGALAMAN HIDUPAN LIAR BERTANGGUNGJAWAB",
            "guide": "KENALI PEMANDU TEMPATAN ANDA",
            "volcano": "TANAH TINGGI & GUNUNG BERAPI",
            "toba": "DANAU TOBA & SAMOSIR",
            "heritage": "BUDAYA & CITA RASA MEDAN",
            "tangkahan": "HUTAN HUJAN & PEMULIHARAAN GAJAH",
            "singapore": "SUMATERA UTARA DARI SINGAPURA",
            "policy": "MAKLUMAT PERJALANAN",
            "visa": "PERKHIDMATAN VISA INDONESIA",
        },
        "visa": {
            "eyebrow": "BANTUAN PERMOHONAN • BROS WISATA",
            "location": "Ms Yana • +62 813-7023-3750",
            "alt": "Pratonton BROS Wisata untuk {title}: perkhidmatan visa Indonesia, hubungi Ms Yana di +62 813-7023-3750. Ilustrasi dokumen, bukan visa yang telah dikeluarkan.",
            "panel_subtitle": "BANTUAN VISA",
            "panel_steps": ("Tujuan lawatan", "Semakan dokumen", "Penyelarasan"),
            "panel_contact": "HUBUNGI MS YANA",
            "panel_note": "Khidmat pengurusan visa",
        },
    },
}


def parse_attributes(tag: str) -> dict[str, str]:
    return {
        key.lower(): html_module.unescape(value)
        for key, _, value in re.findall(
            r"([:\w-]+)\s*=\s*([\"'])(.*?)\2", tag, flags=re.DOTALL
        )
    }


def find_meta(html: str, key: str) -> str | None:
    for match in re.finditer(r"<meta\b[^>]*>", html, flags=re.IGNORECASE):
        attrs = parse_attributes(match.group(0))
        identifier = (attrs.get("property") or attrs.get("name") or "").lower()
        if identifier == key.lower():
            return attrs.get("content", "").strip()
    return None


def clean_title(title: str) -> str:
    cleaned = re.sub(
        r"\s*(?:\||—|–)\s*BROS\s+Wisata.*$", "", title, flags=re.IGNORECASE
    ).strip()
    return cleaned or "BROS Wisata"


def page_title(html: str) -> str:
    title = find_meta(html, "og:title")
    if not title:
        match = re.search(r"<title>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
        title = html_module.unescape(match.group(1).strip()) if match else "BROS Wisata"
    return clean_title(title)


def category_for(stem: str) -> str:
    value = stem.lower().replace("_", "-")
    if value == "indonesia-visa":
        return "visa"
    if value in {"index", "bros-wisata-homepage"}:
        return "home"
    if "car-rental" in value or "sewa-mobil" in value or "kereta-sewa" in value:
        return "car"
    if "about" in value or "tentang" in value:
        return "about"
    if "contact" in value or "kontak" in value or "hubungi" in value:
        return "contact"
    if "custom" in value or "kustom" in value or "khas" in value:
        return "custom"
    if "listing" in value or "daftar" in value or "senarai" in value:
        return "tours"
    if "meet-ahmad" in value:
        return "guide"
    if "responsible" in value or "bertanggung" in value or "bukit-lawang" in value or "jungle" in value:
        return "orangutan"
    if "tangkahan" in value:
        return "tangkahan"
    if "berastagi" in value or "volcano" in value:
        return "volcano"
    if "heritage" in value or "warisan" in value:
        return "heritage"
    if "singapore" in value or "singapura" in value:
        return "singapore"
    if "privacy" in value or "terms" in value or "privasi" in value or "terma" in value or "ketentuan" in value:
        return "policy"
    if "toba" in value or "samosir" in value or "sumut" in value or "sumatera" in value or "halal" in value or "combo" in value:
        return "toba"
    return "home"


def source_for(stem: str, category: str) -> tuple[Path, bool]:
    assets = ROOT / "assets"
    field_photos = assets / "gallery" / "field-september-2026"
    if category == "car":
        return assets / "cars" / "toyota-innova-reborn.webp", True
    if category in {"about", "guide"}:
        return assets / "gallery" / "team-ahmad-salim-guest.jpg", False
    if category == "orangutan":
        return (
            assets
            / "gallery"
            / "ahmad-field-2026"
            / "bukit-lawang-orangutan-tree.jpg",
            False,
        )
    if category == "tangkahan":
        return (
            assets
            / "gallery"
            / "ahmad-field-2026"
            / "bukit-lawang-river-landscape.jpg",
            False,
        )
    if category == "volcano":
        return (
            assets
            / "gallery"
            / "ahmad-field-2026"
            / "ahmad-sibayak-summit-guest.jpg",
            False,
        )
    if category == "heritage":
        return field_photos / "medan-fruit-market.jpg", False
    if category == "custom":
        return field_photos / "coffee-cherries.jpg", False
    if category == "tours":
        return field_photos / "lake-toba-sunset.jpg", False
    if category == "singapore":
        return field_photos / "lake-toba-sunset.jpg", False
    if category == "policy":
        return field_photos / "highland-flower.jpg", False
    return field_photos / "lake-toba-panorama.jpg", False


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def fit_logo(image: Image.Image, width: int, height: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((width, height), Image.Resampling.LANCZOS)
    return result


def wrap_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    selected_font: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), candidate, font=selected_font)
        if current and bbox[2] - bbox[0] > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def title_layout(
    draw: ImageDraw.ImageDraw, title: str, max_width: int
) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    for size in range(55, 35, -2):
        selected = font(FONT_BOLD, size)
        lines = wrap_text(draw, title, selected, max_width)
        if len(lines) <= 3:
            return selected, lines
    selected = font(FONT_BOLD, 34)
    lines = wrap_text(draw, title, selected, max_width)
    if len(lines) > 3:
        lines = lines[:3]
        while draw.textbbox((0, 0), lines[-1] + "…", font=selected)[2] > max_width:
            lines[-1] = " ".join(lines[-1].split()[:-1])
        lines[-1] += "…"
    return selected, lines


def make_visa_panel(lang: str, width: int, height: int) -> Image.Image:
    """Draw a branded intake-document illustration, never an official visa."""
    copy = COPY[lang]["visa"]
    panel = Image.new("RGB", (width, height), CREAM)
    draw = ImageDraw.Draw(panel)
    draw.ellipse((width - 140, -105, width + 160, 195), fill="#e5ebf7")
    draw.ellipse((-140, height - 145, 125, height + 120), fill="#eee3c9")

    left, top, right, bottom = 60, 87, width - 50, height - 85
    draw.rounded_rectangle((left + 12, top + 14, right + 12, bottom + 14), radius=20, fill="#d8dfeb")
    draw.rounded_rectangle((left, top, right, bottom), radius=20, fill=WHITE, outline="#ccd8eb", width=2)
    draw.rounded_rectangle((left, top, right, top + 13), radius=6, fill=BLUE)
    x = left + 26
    draw.text((x, top + 36), "INDONESIA", font=font(FONT_BOLD, 29), fill=NAVY)
    draw.text((x, top + 81), copy["panel_subtitle"], font=font(FONT_BOLD, 17), fill=BLUE)
    draw.rectangle((x, top + 116, x + 62, top + 120), fill=GOLD)

    for index, label in enumerate(copy["panel_steps"], start=1):
        y = top + 151 + (index - 1) * 67
        draw.rounded_rectangle((x, y, right - 25, y + 49), radius=8, fill="#f1f5fb")
        draw.text((x + 12, y + 14), f"0{index}", font=font(FONT_BOLD, 15), fill=BLUE)
        draw.text((x + 49, y + 14), label, font=font(FONT_REGULAR, 16), fill=NAVY)

    draw.rounded_rectangle((x, bottom - 69, right - 25, bottom - 24), radius=8, fill=NAVY)
    draw.text((x + 14, bottom - 54), copy["panel_contact"], font=font(FONT_BOLD, 15), fill=WHITE)
    note_font = font(FONT_REGULAR, 14)
    note_width = draw.textbbox((0, 0), copy["panel_note"], font=note_font)[2]
    draw.text(((width - note_width) // 2, height - 42), copy["panel_note"], font=note_font, fill=NAVY)
    return panel


def preview_alt(lang: str, stem: str, title: str) -> str:
    copy = COPY[lang]
    template = copy["visa"]["alt"] if category_for(stem) == "visa" else copy["alt"]
    return template.format(title=title)


def make_preview(lang: str, stem: str, title: str) -> bytes:
    canvas = Image.new("RGB", (OG_WIDTH, OG_HEIGHT), NAVY)
    draw = ImageDraw.Draw(canvas)
    photo_x = 742
    photo_width = OG_WIDTH - photo_x
    category = category_for(stem)
    if category == "visa":
        panel = make_visa_panel(lang, photo_width, OG_HEIGHT)
    else:
        source_path, contain = source_for(stem, category)
        if not source_path.exists():
            raise FileNotFoundError(f"Missing preview source: {source_path}")

        source = Image.open(source_path).convert("RGB")
        if contain:
            panel = Image.new("RGB", (photo_width, OG_HEIGHT), CREAM)
            vehicle = source.copy()
            vehicle.thumbnail((photo_width - 54, 430), Image.Resampling.LANCZOS)
            x = (photo_width - vehicle.width) // 2
            y = (OG_HEIGHT - vehicle.height) // 2 - 12
            panel.paste(vehicle, (x, y))
        else:
            panel = ImageOps.fit(
                source,
                (photo_width, OG_HEIGHT),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.48),
            )
            panel = ImageEnhance.Color(panel).enhance(0.92)
            panel = ImageEnhance.Contrast(panel).enhance(1.05)
    canvas.paste(panel, (photo_x, 0))

    # A clear gold edge separates the copy from the photographic panel.
    draw.rectangle((photo_x - 9, 0, photo_x, OG_HEIGHT), fill=GOLD)
    draw.polygon(
        [(photo_x - 74, OG_HEIGHT), (photo_x, OG_HEIGHT), (photo_x, 498)],
        fill=BLUE,
    )

    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo = fit_logo(logo, 282, 72)
    canvas.paste(logo, (68, 54), logo)

    copy = COPY[lang]
    service_copy = copy["visa"] if category == "visa" else copy
    eyebrow_font = font(FONT_BOLD, 18)
    draw.text((68, 164), copy["categories"][category], font=eyebrow_font, fill=GOLD)

    selected_font, lines = title_layout(draw, title, 610)
    line_height = selected_font.size + 10
    title_y = 206
    for index, line in enumerate(lines):
        draw.text(
            (68, title_y + index * line_height),
            line,
            font=selected_font,
            fill=WHITE,
        )

    divider_y = min(462, title_y + len(lines) * line_height + 26)
    draw.rectangle((68, divider_y, 132, divider_y + 5), fill=GOLD)
    sub_font = font(FONT_REGULAR, 21)
    draw.text((68, divider_y + 27), service_copy["eyebrow"], font=sub_font, fill=MUTED)

    bottom_font = font(FONT_BOLD, 19)
    draw.text((68, 568), "broswisata.id", font=bottom_font, fill=WHITE)
    location_bbox = draw.textbbox((0, 0), service_copy["location"], font=font(FONT_REGULAR, 18))
    draw.text(
        (688 - (location_bbox[2] - location_bbox[0]), 570),
        service_copy["location"],
        font=font(FONT_REGULAR, 18),
        fill=MUTED,
    )

    buffer = io.BytesIO()
    canvas.save(
        buffer,
        format="JPEG",
        quality=88,
        optimize=True,
        progressive=True,
        subsampling=1,
    )
    return buffer.getvalue()


def meta_identifier(line: str) -> str | None:
    if "<meta" not in line.lower():
        return None
    attrs = parse_attributes(line)
    value = attrs.get("property") or attrs.get("name")
    return value.lower() if value else None


def sync_html(html: str, lang: str, image_url: str, alt: str) -> str:
    newline = "\r\n" if "\r\n" in html else "\n"
    lines = html.splitlines()
    filtered = [line for line in lines if meta_identifier(line) not in META_KEYS]
    insert_at = next(
        (
            index + 1
            for index, line in enumerate(filtered)
            if meta_identifier(line) == "og:description"
        ),
        None,
    )
    if insert_at is None:
        raise ValueError("Cannot find og:description metadata insertion point")

    escaped_url = html_module.escape(image_url, quote=True)
    escaped_alt = html_module.escape(alt, quote=True)
    block = [
        f'<meta content="{escaped_url}" property="og:image"/>',
        '<meta content="image/jpeg" property="og:image:type"/>',
        f'<meta content="{OG_WIDTH}" property="og:image:width"/>',
        f'<meta content="{OG_HEIGHT}" property="og:image:height"/>',
        f'<meta content="{escaped_alt}" property="og:image:alt"/>',
        '<meta content="summary_large_image" name="twitter:card"/>',
        f'<meta content="{escaped_url}" name="twitter:image"/>',
        f'<meta content="{escaped_alt}" name="twitter:image:alt"/>',
    ]
    filtered[insert_at:insert_at] = block
    return newline.join(filtered) + newline


def asset_stem(page: Path) -> str:
    return "home" if page.stem == "index" else page.stem


def fingerprint(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:12]


def run(check: bool, only_stem: str | None = None) -> int:
    stale: list[str] = []
    changed_html = 0
    changed_images = 0
    processed = 0

    for lang in LANGUAGES:
        for page in sorted((ROOT / lang).rglob("*.html")):
            if only_stem and page.stem != only_stem:
                continue
            processed += 1
            original = page.read_text(encoding="utf-8")
            title = page_title(original)
            stem = asset_stem(page)
            relative_asset = Path("assets") / "og" / lang / f"{stem}.jpg"
            image_path = ROOT / relative_asset
            image_url = f"{SITE_ORIGIN}/{relative_asset.as_posix()}"
            alt = preview_alt(lang, page.stem, title)

            image_bytes = make_preview(lang, page.stem, title)
            current_image = image_path.read_bytes() if image_path.exists() else None
            if current_image != image_bytes:
                changed_images += 1
                stale.append(
                    f"image {relative_asset.as_posix()} ({fingerprint(image_bytes)})"
                )
                if not check:
                    image_path.parent.mkdir(parents=True, exist_ok=True)
                    image_path.write_bytes(image_bytes)

            updated = sync_html(original, lang, image_url, alt)
            if updated != original:
                changed_html += 1
                stale.append(f"html  {page.relative_to(ROOT).as_posix()}")
                if not check:
                    page.write_text(updated, encoding="utf-8", newline="")

    if check and stale:
        print("Social preview files are stale:")
        for item in stale:
            print(f"- {item}")
        print(
            f"FAIL: {changed_html} HTML and {changed_images} image file(s) need synchronization."
        )
        return 1

    action = "Verified" if check else "Synchronized"
    print(
        f"{action} {processed} pages; "
        f"HTML changes: {changed_html}; image changes: {changed_images}."
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--only-stem",
        help="Limit generation/checks to a single page stem without changing other previews.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Report stale files without changing them.",
    )
    args = parser.parse_args()
    return run(check=args.check, only_stem=args.only_stem)


if __name__ == "__main__":
    sys.exit(main())
