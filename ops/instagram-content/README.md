# BROS Wisata Instagram Content Kit

Internal content kit for @broswisata.

Positioning:
- Private North Sumatra tours from Medan.
- Local route planning with Ahmad.
- Eco tourism, halal-friendly trips, and custom itineraries.
- Target travelers: Europe, Malaysia, Singapore.
- Do not lead with cheap prices. Lead with trust, field knowledge, safety, route logic, and guest fit.

Recommended profile bio:

Private North Sumatra tours from Medan
Bukit Lawang | Lake Toba | Berastagi
Local route planning with Ahmad
Custom quote by WhatsApp

Alternative short bio for Instagram:

BROS WISATA | Hub of Sumatra
Private North Sumatra tours
Lake Toba | Bukit Lawang | Berastagi
Plan your trip with Ahmad

Recommended bio link:

https://broswisata.id/en/?utm_source=instagram&utm_medium=bio&utm_campaign=ig_profile

Alternative direct WhatsApp link:

https://broswisata.id/wa-en

Content rhythm:
- 4 feed posts per week.
- 1 Reel per week.
- 3 to 5 Story sequences per week.
- Pin 3 posts: Meet Ahmad, Bukit Lawang Eco Tour, Custom North Sumatra Tour.

Content pillars:
- Local trust: Ahmad, route checking, guest handling.
- Destination education: Bukit Lawang, Tangkahan, Berastagi, Lake Toba, Medan.
- Responsible travel: wildlife distance, local guide partners, realistic pacing.
- Trip planning: best route order, travel time, what to pack, halal stops.
- Conversion: request quote, custom itinerary, private tour.
- Social proof: guest moments, documentation, behind the scenes.

How to use:
1. Open `content-calendar-30-days.md`.
2. Pick today's post.
3. Use the mapped image or carousel from `asset-map.csv`.
4. Copy the matching caption from `caption-bank.md`.
5. Use the matching Story or Reel script from `reels-story-scripts.md`.
6. Put tracking text in the WhatsApp CTA, for example: "I found BROS Wisata from Instagram post: Bukit Lawang".

## Rebuilding the 6D5N Grand Tour carousel

The editable source for the branded EN/ID/MY carousel is:

- `carousel-combo-sumut-6d5n.html`

The HTML template consumes the shared package copy in `carousel-package-data.js`. Keep package names, durations, highlights, itinerary summaries, and responsible-travel notes in that data file so the combo and legacy-package renders stay aligned.

Render all 12 PNG slides and their WebP derivatives with:

```text
node ops/instagram-content/render-carousel.cjs
```

The renderer requires `playwright`, `sharp`, and a local Google Chrome installation. It writes 1080×1080 assets to `assets/ig/combo_sumut_6h5m/{en,id,my}/`. Update the copy in the HTML source, then render both PNG and WebP together so website previews and manual Instagram uploads stay aligned.

## Rebuilding the legacy package carousel suite

Render the branded Medan Heritage, Bukit Lawang, Berastagi, and Tangkahan carousel suites with:

```text
node ops/instagram-content/render-package-suite.cjs
```

The suite writes EN/ID/MY versions of all four slides as 1080×1080 PNG and WebP files under `assets/ig/<package>/{en,id,my}/`. Use the PNG files for manual Instagram uploads and keep the matching WebP files for website previews.

Admin rule:
- Prices should not be the headline.
- Never guarantee wildlife sightings.
- Do not post guest faces without consent.
- Do not post bank account details on Instagram.
- Use quote-by-request language for tours.
- Use English for Europe/Singapore posts and Malay for Malaysia-focused posts.
- Current official Instagram handle: @broswisata.
