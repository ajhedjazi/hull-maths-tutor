# Human / Hull — final five refinements

19 November 2026. Local implementation on `feature/human-hull-redesign`; no commit, push, merge or deployment.

## Completion status

| Refinement | Status | Result |
|---|---|---|
| Grades 3–5 terminology | Complete | Plural Grades 3–5 labels in links, breadcrumbs, FAQ heading and schema names. Existing “Grades 3 to 5” prose remains. The established `/gcse-grade-4-5-maths-support-hull/` URL, directory, canonical and sitemap entry are unchanged. The legitimate Grade 3→4 and Grade 4→5 teaching sections are retained. |
| Functional Skills pricing | Complete | Service-page summary and pricing section now clearly show £50/hour in person and online tuition from £45/hour. The homepage pricing FAQ now makes the fixed-versus-starting distinction explicit. Offer data matches those rates. |
| GCSE travel supplement | Complete | The GCSE prices page now places the six-mile inclusion and £1-per-additional-mile policy beside the £40 in-person hourly price. The online-price row is unchanged. Existing equivalent policy wording on service pages remains. |
| Maths MOT action wording | Complete | Six links now describe exploration or enquiry according to their existing destinations. £45 pricing, URLs, anchors, WhatsApp link, tracking and forms remain intact. No booking facility or calendar was added. |
| About Amir photograph | Asset audit complete; distinct portrait unavailable | About Amir is preserved unchanged, as instructed for this fallback. No new photo was integrated. A suitable, verified distinct tutor portrait is the sole outstanding asset. |

## Photograph finding

Inspected the repository image inventory, the design-reference image and the existing lesson/hero JPEGs. The only verified Amir portrait supplied for this redesign is the existing homepage photograph, with its responsive copy. Other images do not establish a suitable distinct portrait of the tutor; one includes a recognisable learner. No identity or usage permission was assumed, no substitute was fabricated, and no image was cropped or repurposed for About Amir.

The existing public-packaging restriction is unchanged and still blocks public output without commercial photo-rights confirmation. All work and screenshots remain local.

## Exact files changed in this task

Production content:

1. `index.html` — Functional Skills pricing FAQ wording only; approved layout untouched.
2. `functional-skills-maths-tutor-hull/index.html` — price summary, price heading, online starting price and offer data.
3. `gcse-maths-tutor-prices/index.html` — travel policy and two MOT link labels.
4. `gcse-maths-tutor-hull/index.html` — Grades 3–5 link label and MOT link label.
5. `gcse-grade-4-5-maths-support-hull/index.html` — Grades 3–5 display/schema names and MOT link label.
6. `maths-mot-hull/index.html` — Grades 3–5 link label and two enquiry labels.

Review artifacts:

- `docs/human-hull-final-five-review.md` — this report.
- `docs/visual-review/final-five/{functional-skills-maths-tutor-hull,gcse-maths-tutor-prices,gcse-maths-tutor-hull,gcse-grade-4-5-maths-support-hull,maths-mot-hull,homepage-faq}/{before,after}-{390,1440}.png` — 24 screenshots, linked below.

CSS, JavaScript, navigation, all photo assets, About Amir, the guide/download/thank-you pages, hosting configuration, public-packaging script, sitemap and robots file are unchanged from the start of this task.

## Content and structured-data decisions

- No SEO titles or descriptions required correction. All title, meta, link/canonical and indexing attributes remain unchanged.
- Functional Skills uses separate in-person and online offers. The in-person rate is fixed at £50/hour. Online uses `UnitPriceSpecification.minPrice: 45`, GBP and `unitText: "hour"`, with explicit “from £45 per hour” wording. It does not claim a fixed £45 rate, a maximum rate, a discount or an invented package. The vocabulary was checked against [Schema.org UnitPriceSpecification](https://schema.org/UnitPriceSpecification) and [minPrice](https://schema.org/minPrice).
- Grades schema changes are limited to service/breadcrumb display names. Identifiers, URLs and the wider service information remain unchanged.
- Existing FAQ questions about whether to start with a Maths MOT, and ordinary payment phrases such as “pay as you go”, remain. No rendered link/button offers instant booking. No current page renders the legacy appointment-picker code.

### MOT action-label audit

| Location | Previous label | New label | Unchanged destination |
|---|---|---|---|
| GCSE Maths feature | Book a £45 Maths MOT | Explore the £45 Maths MOT | `/maths-mot-hull/` |
| GCSE prices hero | Book a Maths MOT | Explore the Maths MOT | `/maths-mot-hull/` |
| GCSE prices feature | Book a £45 Maths MOT | Explore the £45 Maths MOT | `/maths-mot-hull/` |
| Grades 3–5 hero | Book a £45 Maths MOT | Explore the £45 Maths MOT | `/maths-mot-hull/` |
| Maths MOT hero | Book a £45 Maths MOT | Ask About the £45 Maths MOT | `/#enquire` |
| Maths MOT offer | Book a Maths MOT | Enquire About a Maths MOT | `/#enquire` |

## Before-and-after screenshots

Full-page screenshots use 1440px desktop and 390px mobile widths. The homepage pair opens its pricing FAQ to expose the copy change; its default closed-FAQ presentation was separately confirmed pixel-identical.

| Page | Desktop before | Desktop after | Mobile before | Mobile after |
|---|---|---|---|---|
| Functional Skills | [Before](visual-review/final-five/functional-skills-maths-tutor-hull/before-1440.png) | [After](visual-review/final-five/functional-skills-maths-tutor-hull/after-1440.png) | [Before](visual-review/final-five/functional-skills-maths-tutor-hull/before-390.png) | [After](visual-review/final-five/functional-skills-maths-tutor-hull/after-390.png) |
| GCSE prices | [Before](visual-review/final-five/gcse-maths-tutor-prices/before-1440.png) | [After](visual-review/final-five/gcse-maths-tutor-prices/after-1440.png) | [Before](visual-review/final-five/gcse-maths-tutor-prices/before-390.png) | [After](visual-review/final-five/gcse-maths-tutor-prices/after-390.png) |
| GCSE Maths | [Before](visual-review/final-five/gcse-maths-tutor-hull/before-1440.png) | [After](visual-review/final-five/gcse-maths-tutor-hull/after-1440.png) | [Before](visual-review/final-five/gcse-maths-tutor-hull/before-390.png) | [After](visual-review/final-five/gcse-maths-tutor-hull/after-390.png) |
| Grades 3–5 | [Before](visual-review/final-five/gcse-grade-4-5-maths-support-hull/before-1440.png) | [After](visual-review/final-five/gcse-grade-4-5-maths-support-hull/after-1440.png) | [Before](visual-review/final-five/gcse-grade-4-5-maths-support-hull/before-390.png) | [After](visual-review/final-five/gcse-grade-4-5-maths-support-hull/after-390.png) |
| Maths MOT | [Before](visual-review/final-five/maths-mot-hull/before-1440.png) | [After](visual-review/final-five/maths-mot-hull/after-1440.png) | [Before](visual-review/final-five/maths-mot-hull/before-390.png) | [After](visual-review/final-five/maths-mot-hull/after-390.png) |
| Homepage pricing FAQ | [Before](visual-review/final-five/homepage-faq/before-1440.png) | [After](visual-review/final-five/homepage-faq/after-1440.png) | [Before](visual-review/final-five/homepage-faq/before-390.png) | [After](visual-review/final-five/homepage-faq/after-390.png) |

## Regression checks passed

- All affected layouts checked at 320, 375, 390, 768, 1024 and 1440px; secondary pages additionally checked at 430px. No horizontal overflow, clipped controls or JavaScript errors. Buttons, form controls and FAQ summaries on affected pages met the tested 44px minimum dimensions.
- Keyboard skip links, menu operation, Escape, breakpoint focus recovery, enquiry focus, native FAQs, sticky-header anchor clearance and no-JavaScript navigation passed.
- Automated axe A/AA-tag checks reported zero violations on all seven secondary pages at desktop/mobile widths and in open-menu/expanded-FAQ states. Homepage default/error checks also passed. A 200% root-text enlargement check at 768px found no horizontal overflow on secondary pages.
- Prices and qualifiers were checked against the requested rates. The travel note is in the in-person £40 row, with no travel charge added to the online row.
- All production link/button labels were audited for misleading MOT booking language. Destinations are unchanged, and both MOT enquiry actions reach the existing homepage form.
- Every production page's SEO metadata, canonical/indexing attributes, link destinations and form/script contracts were compared with the task baseline. JSON-LD parses successfully; only the authorised offer/name changes differ.
- Netlify regression passed native required/email validation, URL-encoded payload and honeypot, pending/disabled state, duplicate-submit prevention, successful redirect/single `generate_lead`, HTTP/network errors, retained field values, status announcements and no-JavaScript POST fallback, using mocked responses.
- Web3Forms regression passed required-field/tier validation, UTM capture, hidden fields/spam control, optional consent both unchecked and checked, mocked native redirect, download-page availability and the existing PDF links.
- Existing `phone_click`, `maths_mot_click`, `whatsapp_click` and `generate_lead` triggers were observed locally. Google Analytics code and event names are unchanged.
- Default homepage, About Amir, Year 11 Parent Guide, download and thank-you pages produced pixel-identical before/after screenshots at 390px and 1440px. Hash checks confirmed all other existing files and assets are unchanged.
- HTML validation introduced no new findings. The homepage passes; inherited secondary/success-page findings remain: raw ampersands, telephone-space/trailing-whitespace rules, checkbox autocomplete and existing success-page markup. These are documented pre-launch audit items, not changes introduced by this task.
- The public-packaging photo-rights gate still rejects public packaging without confirmation. Review artifacts and reference files remain excluded from export. `git diff --check` passed.

Tests used locally available Chromium, axe and HTML validation tools. External requests were blocked; provider responses were mocked. No enquiry, email, WhatsApp message or analytics request was sent to a third party.

## Not completed and readiness

- Distinct About Amir portrait integration: awaiting the suitable authentic asset; About Amir is unchanged. This is the only outstanding asset.
- Commercial image-rights confirmation remains required before public publication.
- Live Netlify/Web3Forms delivery, spam filtering, notifications, GA ingestion, hosted structured-data testing, physical devices, real screen-reader/browser zoom, Safari/Firefox and production performance were not tested locally.

**Ready for a final pre-launch audit**, with the missing portrait, image-rights confirmation and inherited validation findings explicitly recorded. Public launch remains blocked by the existing photograph safeguard. No content or pricing decisions remain open from the four implemented refinements.

Local preview: `http://127.0.0.1:8766/`. To recreate it from the repository root:

```powershell
node scripts/prepare-public.mjs --local-preview
python -m http.server 8766 --bind 127.0.0.1 --directory .local-preview
```

Stop here for review. No release action is authorised by this report.
