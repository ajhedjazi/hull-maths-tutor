# Human / Hull — visual refinement review

19 November 2026. Local changes only, on `feature/human-hull-redesign`.

## Review images

- [1440px desktop, full page](visual-review/human-hull-refined-1440.png)
- [390px mobile, full page](visual-review/human-hull-refined-390.png)

These images include the provisionally approved portrait and are for local review only. Neither documentation nor review images are included in the generated public files.

## What changed

Only `index.html` and the existing homepage-specific part of `styles.css` changed in this refinement. This report and the two screenshots are new review files. JavaScript, service pages, other assets and deployment configuration were not changed.

### Mobile

- Investigation found a 20px layout gap between the services heading and introduction at 320, 375, 390 and 430px, with no reproduced text bounding-box overlap. Their layout now uses explicit grid rows with a 22px gap, a calmer heading scale and balanced wrapping.
- Service descriptions increased from 14.72px to 16px. Pricing now separates online/in-person amounts, uses 20px emphasis and labels the hourly unit at 14px. Descriptions use the full row width; the Grade 3–5 range stays together.
- Service and resource links have 48px target heights. The menu button and navigation rows have at least 48px heights. Visible interactive targets passed a 44 × 44px minimum check at all four narrow mobile widths.
- Mobile section padding reduced from 68px to 54px, with more specific spacing around teaching steps, biography, FAQs and enquiry. The 390px page is approximately 247px shorter overall despite larger service text and controls.
- The final form has a named heading, clearer labels, 52px minimum control heights and a full-width 56px submit button. Native validation, field names, status region and submission code are unchanged.
- The guide illustration sits squarely on narrow screens. No new graphic or photograph was introduced.

### Desktop

- The hero uses deliberate three-line wrapping from 1200px and a slightly calmer type scale. Smaller screens retain fluid wrapping.
- The portrait's visible width at 1440px increased from approximately 667px to 695px, about 4%, through reduced framing space. Its source crop and 4:3 aspect ratio remain unchanged.
- Service prices now give the amount more emphasis than the lesson-format label, with a distinct link underneath.
- Maths MOT groups the £45 price and its existing destination together, separated by a simple rule. The descriptive copy and optional-starting-point wording are unchanged.
- The enquiry form has a clearer heading, larger labels and a stronger full-width submission action.

### Meet Amir

The large repeated 16/7/1:1 credentials display is replaced by a personal explanation of teaching: looking at a learner's working, finding the step where they got stuck, slowing down and explaining a method another way. These details are already supported by the existing About page. The Newcastle degree, PGCE, QTS, 16 years' experience and seven years as Head of Maths remain in supporting prose. No biography, testimonials or outcomes were invented.

## Verification completed

- Chromium screenshots and geometry checks at 320, 375, 390, 430, 768, 1024 and 1440px: no horizontal overflow or services-heading overlap; portrait remains 4:3. Full-page review images were captured at 1440px and 390px and visually inspected.
- Mobile menu opening/closing, Escape, keyboard navigation, outside click, enquiry focus, A-Level selection, breakpoint focus recovery and skip-link checks passed.
- All FAQs passed keyboard opening/closing checks.
- Enquiry validation, pending state, duplicate-submit protection, HTTP/network error handling, retained values, status announcement, successful redirect and single `generate_lead` passed with mocked responses. Native POST fallback passed with JavaScript disabled.
- Local checks observed the existing phone, Maths MOT and WhatsApp events. Guide checks preserved Web3Forms fields, optional consent, UTM capture, redirect and PDF access.
- Automated axe A/AA-tag checks reported zero violations at 390px and 1440px, including open-menu, expanded-FAQ, error and active-navigation states. Reduced-motion checks and 200% root text enlargement at 768px passed. These are not a complete accessibility certification or physical-browser zoom test.
- All nine existing service/resource/success pages produced pixel-identical before/after screenshots at 390px and 1440px compared with the Phase 1 working files captured before this refinement. No page JavaScript errors were observed.
- Source checks confirmed the exact homepage head, form field/status contracts, service descriptions, prices, headline text and every link destination remain intact. The original shared CSS before the homepage block is unchanged. Hash checks confirmed every other existing repository file is unchanged.
- Public packaging still refuses to proceed without confirmed photograph rights. The reference folder, documentation and review images remain excluded from the export.
- Homepage HTML validation and `git diff --check` passed.

All automated browser tests blocked external requests and mocked provider responses. No enquiry or analytics request was sent to a third party.

## Preview and remaining limits

The local preview is available at `http://127.0.0.1:8766/`. To recreate it from the repository root:

```powershell
node scripts/prepare-public.mjs --local-preview
python -m http.server 8766 --bind 127.0.0.1 --directory .local-preview
```

The static server does not process real Netlify submissions. The unchanged parent-guide form still uses its real provider; the automated check used a mock.

Commercial photograph rights remain unconfirmed. Real form detection, spam filtering, email delivery and GA ingestion were not tested. Physical devices, screen readers, Safari/Firefox and production performance remain unverified.

No commit, push, merge or deployment was performed. Awaiting approval before further changes.
