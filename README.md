# BROS Wisata Website

Static, multilingual website for **PT BROS INTI WISATA** (`broswisata.id`). The
production site is deployed through Cloudflare Pages and serves Indonesian,
Malay, and English content.

## Project structure

- `id/`, `ms/`, `en/` — localized production HTML.
- `assets/` — shared CSS, JavaScript, images, and downloadable brochures.
- `scripts/generate_seo_pages.py` — regenerates the high-intent SEO landing
  pages and related sitemap entries. Review its diff before committing.
- `scripts/audit_site.py` — read-only local integrity audit.
- `scripts/submit-indexnow.ps1` — submits URLs to IndexNow; this makes external
  requests and should only be run intentionally after deployment.
- `ops/` — internal operations tools. Cloudflare `_headers` and `robots.txt`
  keep this area out of search indexes.
- `_redirects` — clean URLs, legacy redirects, language routes, and the paused
  transport/rental routes.

## Local development

Run a static server from the repository root:

```powershell
python -m http.server 8897 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8897/id/`. Cloudflare extensionless redirects are
not emulated by Python's server, so use the `.html` filename for inner pages
when testing locally.

## Required checks

Run the site audit before every commit:

```powershell
python scripts/audit_site.py
```

Also syntax-check shared JavaScript and smoke-test the three language variants
at desktop and mobile widths. A change is not ready when the audit reports an
error, a local asset is missing, or a form cannot be completed by keyboard.

## Tracking rules

`assets/whatsapp-source.js` is the single source of truth for WhatsApp click
tracking, source attribution, and GA4/Clarity/Meta lead events.

- Do not add page-level `whatsapp_click` listeners.
- Do not fire a `Lead` event on page load.
- Give important WhatsApp links a stable `data-cta` value.
- Let the shared script add the web source marker and UTM/ad attribution.

## Content rules

- Keep ID/MS/EN page sets and hreflang links in parity.
- Treat roles, years of experience, inclusions, wildlife policies, prices, and
  itinerary details as shared facts. Update all affected pages together.
- Do not promise wildlife sightings or direct wildlife contact.
- Transport/rental pages remain paused until fleet, pricing, and SOPs are
  formally approved.

## Delivery workflow

1. Update local `main` with `git pull --ff-only`.
2. Work on a feature branch.
3. Run the audit and local browser smoke tests.
4. Review the complete diff, especially generated or multilingual changes.
5. Merge to `main` only after approval; deployment follows the repository's
   Cloudflare Pages configuration.
