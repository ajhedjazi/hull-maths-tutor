# Site-wide alignment: visual QA

This document accompanies the experimental alignment-rails branch. It does not claim that browser or device testing has been completed.

## Shared layout rules

- `styles.css` defines `--site-max-width`, `--site-gutter`, and `--site-section-spacing`.
- `.container` and `.site-container` use the same outer content rails.
- Existing `--container-max` and `--container-pad` aliases are retained to reduce disruption to established layouts.
- Full-bleed backgrounds, centred headings, and deliberate inner grids may differ from the outer rails.

## Preview checklist (not yet executed)

At viewport widths 375, 430, 768, 1024, 1440 and 1920 pixels, check:

- Header, hero, section content, cards, images, forms and footer align with the intended outer rails.
- No horizontal overflow or clipped buttons and input fields.
- Text remains readable, and image/text grids stack cleanly on narrow screens.
- Homepage enquiry form, Netlify form detection, honeypot, thank-you page and Maths MOT booking remain functional.
- SEO metadata, internal links and keyboard navigation remain intact.
- Live Classroom and Maths Coach pages are unaffected.

Do not merge into `main` until the preview has been reviewed and functional checks are completed.
