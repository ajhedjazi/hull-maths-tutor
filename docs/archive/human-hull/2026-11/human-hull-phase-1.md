# Human / Hull — Phase 1 review

Implemented locally on `feature/human-hull-redesign`, 18 November 2026.
No commit, push, merge, remote preview or deployment was performed.

## Scope and files

- `index.html`: homepage only, preserving its original head and all original link destinations. New editorial portrait hero, credibility ribbon, priced service rows, teaching steps, biography, MOT feature, guide preview, FAQs, enquiry and footer.
- `styles.css`: appended `.human-home` styles; the previous stylesheet is retained unchanged.
- `script.js`: appended homepage-only navigation enhancement and A-Level enquiry selection. Existing analytics and submission code is retained unchanged.
- `assets/amir-homepage-hero.webp`: byte-for-byte copy of the supplied 1200 × 900 reference photograph, 87,096 bytes.
- `assets/amir-homepage-hero-600.webp`: 600 × 450 responsive variant, 30,474 bytes, with the same crop and aspect ratio.
- `scripts/prepare-public.mjs`, `netlify.toml`, `render.yaml`, `.gitignore`: dependency-free static packaging; generated output is ignored by Git. Existing Render cache headers are retained.
- This document: review, QA and local-preview instructions.

No service, guide, download or thank-you page source was changed. No existing SEO file, verification file, PDF or structured-data block was changed. The draft reference documents remain proposals.

## Deliberate differences from the concept

- Real brand icon and existing Inter/Playfair Display replace the concept's temporary wordmark and Georgia headings. The existing font asset supplies normal styles; the browser synthesizes the italic emphasis.
- Existing service, About, MOT, prices and parent-guide destinations remain functional. A-Level leads to the homepage enquiry and selects its existing service option.
- The full production navigation is preserved, with a mobile disclosure below 1100px to accommodate its extra destinations. It supports Escape and restores focus when resizing hides a focused control. With JavaScript disabled, the links remain visible.
- The teaching section uses three ruled steps rather than an illustrative worksheet or an unprovided secondary photograph.
- The parent-guide cover is a typographic illustration using its real title and topic, rather than a raster reproduction of the PDF cover.
- The existing optional phone field and learner-age FAQ are retained. An A-Level FAQ is added using existing service information.
- Qualifications use the existing production information. No unconfirmed Second in Department claim, testimonials or results were added.
- The original Netlify form replaces the prototype's demo form. Homepage form errors use dark red on the new light background, and focus indicators use teal on light surfaces and lime on dark surfaces.

## Local preview

From the repository root, run:

```powershell
node scripts/prepare-public.mjs --local-preview
python -m http.server 8766 --bind 127.0.0.1 --directory .local-preview
```

Open `http://127.0.0.1:8766/`. Stop the server with Ctrl+C when finished.
If that port is already serving this preview, simply open the URL. After editing source files, rerun the first command and refresh the browser.

The Python server serves static files and does not process real Netlify submissions. A manual enquiry on it will show the production form's error message. The parent-guide form still points to its real Web3Forms provider: do not submit it merely to preview the styling.

## Public-file exclusion and photograph rights

The configured Netlify and Render build commands both run `node scripts/prepare-public.mjs` and publish `public/`, rather than publishing the repository root. The script copies an explicit list of production routes and assets. It excludes `design-reference/`, documentation, scripts, Git files and asset README files.

The photograph is approved **only for local design testing**. Public packaging currently fails intentionally unless commercial usage rights have been confirmed and `HMT_PHOTO_USAGE_APPROVED=true` has been explicitly configured. This variable was not set. `--local-preview` writes to the separate `.local-preview/` directory and does not deploy anything.

Any future manual upload must also use the approved generated output, never the repository root. Actual hosting settings and delivery behaviour still need review before a separately authorized release.

## Checks completed

Testing used locally available Playwright/Chromium, axe-core and html-validate without adding application dependencies. Automated browser tests blocked external requests and mocked provider responses; no test enquiry or analytics request was sent to a third party.

- Homepage HTML validation, JavaScript syntax checks and `git diff --check` passed.
- Screenshots and geometry checks at 320, 375, 390, 768, 1024 and 1440px: no horizontal overflow; photograph remains 4:3. Desktop/mobile full-page screenshots and a six-width hero contact sheet were visually reviewed.
- Keyboard skip link; menu Enter/Space, Tab, Escape, outside click, link close and breakpoint focus recovery; enquiry anchor clearance and A-Level selection passed.
- All five native FAQ controls opened and closed by keyboard.
- Native required/email validation, URL-encoded POST fields, empty honeypot serialization, pending/disabled state, duplicate-submit prevention, HTTP/network failures, preserved input values, live status, successful redirect and single `generate_lead` event passed with mocked responses.
- Mobile navigation and native form POST fallback passed with JavaScript disabled (reduced motion enabled for deterministic automated scrolling).
- `phone_click`, `maths_mot_click` and the unchanged MOT page's `whatsapp_click` events were observed locally, without sending them to Google.
- The unchanged Web3Forms guide flow passed a mocked request check: UTM capture, optional consent, form payload, configured redirect, download page and PDF availability.
- axe checks found zero violations for the tested WCAG A/AA tags at 390px and 1440px, including open menu, expanded FAQs, visible form error and active desktop navigation states. This is not a full accessibility certification.
- Reduced-motion styling and scrolling passed. 200% root text enlargement at 768px produced no horizontal overflow; this is not a claim of physical-browser zoom testing.
- Calculated contrast: ink/cream 13.44:1; muted/paper 5.61:1; teal/lime 6.57:1; input border/white 3.02:1; error text/paper 8.46:1; teal focus/paper 10.58:1.
- All nine existing service/resource/success pages produced pixel-identical before/after full-page screenshots at 390px and 1440px when comparing the original shared CSS/JS with the appended versions. No JavaScript errors were observed.
- Original homepage head, form contract and link destinations were compared with Git HEAD. Other page sources, SEO files and existing assets were checked against their original hashes.
- Local export contains the production routes and assets, with no reference folder, docs or scripts. Default public packaging refuses to proceed without the image-rights flag.

## Still unverified / awaiting review

- Commercial rights for the photograph; public packaging remains blocked.
- Real Netlify form detection, spam filtering, notification delivery and GA ingestion. Local mocked responses cannot establish those outcomes.
- Physical-device use, screen-reader review, Safari/Firefox, real browser zoom and production network/Core Web Vitals measurements.
- The existing Functional Skills service page still shows £50 in person without listing the homepage's online starting price. It is intentionally unchanged in Phase 1.
- Existing homepage structured-data omissions and missing analytics on the guide/download/thank-you pages remain unchanged, as agreed for the visual scope.

Await homepage review before any further page redesign or release work.
