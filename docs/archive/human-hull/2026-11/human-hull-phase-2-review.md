# Human / Hull — Phase 2 review

Completed locally on `feature/human-hull-redesign`, 19 November 2026. No commit, push, merge or deployment was performed.

## Before-and-after screenshots

Full-page Chromium captures, at 1440px desktop and 390px mobile. All 28 files are local review artifacts, excluded from public packaging.

| Page | Desktop before | Desktop after | Mobile before | Mobile after |
|---|---|---|---|---|
| About Amir | [Before](visual-review/phase-2/about-amir/before-1440.png) | [After](visual-review/phase-2/about-amir/after-1440.png) | [Before](visual-review/phase-2/about-amir/before-390.png) | [After](visual-review/phase-2/about-amir/after-390.png) |
| GCSE Maths | [Before](visual-review/phase-2/gcse-maths-tutor-hull/before-1440.png) | [After](visual-review/phase-2/gcse-maths-tutor-hull/after-1440.png) | [Before](visual-review/phase-2/gcse-maths-tutor-hull/before-390.png) | [After](visual-review/phase-2/gcse-maths-tutor-hull/after-390.png) |
| GCSE tuition prices | [Before](visual-review/phase-2/gcse-maths-tutor-prices/before-1440.png) | [After](visual-review/phase-2/gcse-maths-tutor-prices/after-1440.png) | [Before](visual-review/phase-2/gcse-maths-tutor-prices/before-390.png) | [After](visual-review/phase-2/gcse-maths-tutor-prices/after-390.png) |
| Grades 3–5 support | [Before](visual-review/phase-2/gcse-grade-4-5-maths-support-hull/before-1440.png) | [After](visual-review/phase-2/gcse-grade-4-5-maths-support-hull/after-1440.png) | [Before](visual-review/phase-2/gcse-grade-4-5-maths-support-hull/before-390.png) | [After](visual-review/phase-2/gcse-grade-4-5-maths-support-hull/after-390.png) |
| Functional Skills | [Before](visual-review/phase-2/functional-skills-maths-tutor-hull/before-1440.png) | [After](visual-review/phase-2/functional-skills-maths-tutor-hull/after-1440.png) | [Before](visual-review/phase-2/functional-skills-maths-tutor-hull/before-390.png) | [After](visual-review/phase-2/functional-skills-maths-tutor-hull/after-390.png) |
| Maths MOT | [Before](visual-review/phase-2/maths-mot-hull/before-1440.png) | [After](visual-review/phase-2/maths-mot-hull/after-1440.png) | [Before](visual-review/phase-2/maths-mot-hull/before-390.png) | [After](visual-review/phase-2/maths-mot-hull/after-390.png) |
| Year 11 Parent Guide | [Before](visual-review/phase-2/year-11-parent-guide/before-1440.png) | [After](visual-review/phase-2/year-11-parent-guide/after-1440.png) | [Before](visual-review/phase-2/year-11-parent-guide/before-390.png) | [After](visual-review/phase-2/year-11-parent-guide/after-390.png) |

## Presentation changes

- A shared `human-site` scope now supplies the approved homepage's colours, fonts, navigation, buttons and focus treatment. `human-page` supplies reusable secondary-page layouts. The homepage retains its existing appearance.
- Cream editorial heroes, flat information ledgers, ruled teaching rows, readable prices and native FAQ controls replace the previous grid backgrounds, rounded diagnostic panels and small cards.
- About Amir has an open profile introduction and horizontal desktop credentials ledger. Functional Skills and Grades 3–5 use the approved pale-green surface. Maths MOT has a lime assessment hero and a four-step desktop process. The guide keeps its existing cover/content with a restrained printed-resource treatment and a light form.
- Headings, substantive page text, prices, qualifications, breadcrumbs and existing link destinations are preserved. No portrait is repeated on secondary pages and no new photography or A-Level page was introduced.
- Headers use the approved navigation, including an A-Level enquiry link, correct active-page semantics where a matching primary link exists, and the full service subtitle. Existing footer contact information and links remain.
- The guide's inline presentation CSS moved into the shared stylesheet. Its inline UTM script, Web3Forms form and consent wording are unchanged.

## Code changes

- Presentation hooks, shared header/menu markup and `navigation.js` includes in the seven scoped HTML pages.
- `styles.css`: existing homepage styles promoted to the shared scope; reusable secondary hero variants, content rows, pricing, FAQ, resource/form and footer layouts added.
- `navigation.js`: the existing homepage navigation enhancement extracted into a standalone shared script. It also handles native in-page links on the guide without loading analytics there.
- `script.js`: existing analytics and enquiry code retained verbatim; navigation moved to the separate script.
- `index.html`: only the shared scope class and navigation-script include added in Phase 2. Its approved layout/content were not redesigned.
- `scripts/prepare-public.mjs`: `navigation.js` added to the existing public-file allowlist. The photograph-rights gate and exclusions remain intact.
- This report and the screenshot files.

No library, framework, build-system migration or new public route was added. The guide download and thank-you page sources remain unchanged.

## Verification

- Captured every secondary page before and after at desktop/mobile widths and reviewed the resulting layouts. The approved homepage, guide download and thank-you page produced pixel-identical before/after screenshots at 390px and 1440px.
- All seven pages passed layout overflow checks at 320, 375, 390, 430, 768, 1024 and 1440px. No page JavaScript errors were observed.
- Automated axe checks reported zero violations for the tested WCAG A/AA tags at 390px and 1440px on every page. Open-menu and expanded-FAQ checks also passed. A 200% root-text enlargement check at 768px found no horizontal overflow on any page. These checks do not constitute full accessibility certification or physical-browser zoom testing.
- Keyboard skip links, menu Enter/Space/Tab/Escape, 48px mobile navigation rows, enquiry navigation and all FAQ controls passed on every page. No-JavaScript navigation remained available at 320px on all seven pages.
- Functional Skills and guide in-page links passed focus and sticky-header clearance checks.
- Existing internal page destinations and fragment targets were checked. Both Maths MOT booking links reach the homepage's enquiry form.
- The homepage enquiry regression passed mocked successful and failed submissions, validation, pending state, duplicate-submit prevention, retained values, status announcements, one `generate_lead` event, redirect and no-JavaScript native POST fallback. Existing phone, MOT and WhatsApp tracking events were observed locally.
- The guide passed mocked native Web3Forms submission with both optional-consent states, required-name/email/tier validation, UTM capture, existing hidden fields/spam control, configured download redirect and PDF access. No real submission was sent.
- Source contracts confirmed every scoped page's head metadata, structured data, main headings and text, breadcrumbs, form attributes/fields, inline scripts and existing link destinations are unchanged. Prices and qualifications therefore remain unchanged too.
- Public packaging still refuses to proceed without the photo-usage confirmation flag. Reference files, documentation and review screenshots are excluded from the generated public files.
- JavaScript syntax and `git diff --check` passed. HTML validation introduced no new findings; existing raw ampersands, telephone-spacing/trailing-whitespace warnings and the guide bot-check checkbox's `autocomplete` attribute remain. These were kept out of the presentation change to preserve the existing metadata/form contract.

Tests used existing local Chromium, axe and HTML validation tools without adding application dependencies. Automated browser tests blocked external requests; provider responses and analytics delivery were mocked or intercepted.

## Business decisions and remaining limits

1. **Functional Skills pricing:** the homepage advertises “From £45 online / £50 in person”; the service page and its schema retain the existing £50 presentation and invitation to ask about online support. Confirm whether the online starting rate should also be stated on that service page before a separate copy/schema update.
2. **Travel-price clarity:** GCSE/Functional Skills service pages retain the six-mile inclusion and £1-per-extra-mile wording. The GCSE prices page retains its existing wording without repeating the travel supplement. Decide whether to repeat the policy there; no pricing policy was changed in Phase 2.
3. **Photograph rights:** commercial rights remain unconfirmed. Public packaging remains blocked. No new photographs were used on these pages.

Live Netlify detection/spam filtering, notification delivery, Web3Forms delivery, GA ingestion, physical-device/screen-reader testing, Safari/Firefox and production performance measurements remain unverified. No live provider/account settings were changed.

## Local review

The preview runs at `http://127.0.0.1:8766/`; append any existing route, for example `/about-amir/` or `/year-11-parent-guide/`.

To recreate it from the repository root:

```powershell
node scripts/prepare-public.mjs --local-preview
python -m http.server 8766 --bind 127.0.0.1 --directory .local-preview
```

The static preview does not process Netlify forms. The guide form retains its real provider URL, so use the local mocked tests rather than submitting it just to review presentation.

Phase 2 stops here for review. No further page, business-copy or release changes are approved by this implementation.
