# About Amir portrait — local review

Implemented on `feature/human-hull-redesign`. No commit, push or deployment.

## Photograph and layout

- Actual supplied source: `design-reference/human-hull/assets/amir-about-portrain.png` (the supplied filename uses `portrain`). The source remains unchanged.
- A rectangular crop at `(390, 52, 870, 1192)` removes the circular white surround while retaining Amir's head, clothing, hands and trainers. No AI generation, retouching or proportion changes were used.
- WebP derivatives: `assets/amir-about-portrait-320.webp` (320 × 760, 52,318 bytes) and `assets/amir-about-portrait-480.webp` (480 × 1140, 96,614 bytes).
- Responsive `srcset`, explicit image dimensions and descriptive alt text are included. The browser displays the complete rectangular crop without additional CSS cropping.
- Desktop: portrait beside the opening biography and existing experience summary. Mobile: introduction, portrait, then experience summary. Existing Human / Hull typography, rules and colours remain in use.

## Files changed for this task

- `about-amir/index.html`: portrait markup and scoped layout hook.
- `styles.css`: About-only responsive portrait layout.
- `scripts/prepare-public.mjs`: separate About photograph permission gate.
- Two WebP assets listed above, this review note and four screenshots below.

All other pre-existing files remain unchanged relative to the start of this task, including the homepage HTML and photograph, other pages, analytics, navigation and form scripts.

## Permission safeguards

Commercial-use permission is still unconfirmed. The image is for local review only.

The original homepage public-packaging safeguard remains intact. Public packaging now also requires `HMT_ABOUT_PHOTO_USAGE_APPROVED=true`, independently of `HMT_PHOTO_USAGE_APPROVED=true`. Neither approval has been set by this task. Do not approve either flag until the relevant photograph's usage rights are confirmed. Local export continues to exclude `design-reference/` and `docs/`.

## Verification

- Chromium checks at 320, 375, 390, 430, 768, 1024 and 1440px: no horizontal overflow; image loads at its natural ratio; mobile reading order and desktop placement correct.
- Automated WCAG A/AA checks: no violations at those widths. Keyboard skip link, mobile navigation, Escape/focus return and enquiry navigation passed. Text enlarged to 200% at 768px without horizontal overflow.
- About SEO/schema head is byte-identical to the pre-change version. Existing main text, qualifications and links are unchanged. Local links and anchor targets resolve.
- Nine other pages have byte-identical before/after screenshots at 390 and 1440px (18 comparisons), including the homepage, service pages, guide/download and thank-you page.
- No browser script errors or new HTML validation findings. Three pre-existing HTML findings remain. JavaScript syntax and `git diff --check` pass.
- Permission gates tested independently without producing a public build. Source photo and all pre-existing image assets are unchanged.

Automated accessibility checks do not replace assistive-technology testing. Physical mobile devices, Safari and Firefox were not tested. No live form submissions were sent; this task does not alter forms or their handling. Photographer permission remains outstanding.

## Screenshots

| Width | Before | After |
| --- | --- | --- |
| 1440px | [Desktop before](visual-review/about-portrait/before-1440.png) | [Desktop after](visual-review/about-portrait/after-1440.png) |
| 390px | [Mobile before](visual-review/about-portrait/before-390.png) | [Mobile after](visual-review/about-portrait/after-390.png) |

## Local preview

The current preview is available at <http://127.0.0.1:8766/about-amir/>.

To recreate it from the repository root:

```powershell
node scripts/prepare-public.mjs --local-preview
python -m http.server 8766 --bind 127.0.0.1 --directory .local-preview
```

If the existing preview server is still running, only the first command is needed to refresh the exported files.
