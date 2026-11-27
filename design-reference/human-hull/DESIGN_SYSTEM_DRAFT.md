# Hull Maths Tutor — Human / Hull Design System (DRAFT)
**Status:** Candidate system for a concept, not approved production tokens.

## Brand colours
| Token | Hex | Purpose |
|---|---|---|
| Teal primary | `#0B4344` | Header, brand blocks, key buttons |
| Cream | `#F5F1E8` | Main background |
| Lime | `#B7D438` | Focus/accent and one Maths MOT feature |
| Ink | `#102A2A` | Main body copy |
| Interactive teal | `#0F5D5E` | Links/secondary highlights |
| Muted | `#526969` | Supporting information |
| Off-white candidate | `#FBFAF6` | Editorial contrast sections (pending approval) |
| Pale green candidate | `#E2ECE5` | Enquiry section (pending approval) |

## Typography
- Existing self-hosted Inter for body, nav, forms, labels.
- Existing self-hosted Playfair Display for a limited number of editorial headlines (concept prototype uses Georgia fallback).
- H1 can retain `Maths help that makes sense.` with expressive typography, not keyword-stuffed replacement.
- Do not render essential labels in tiny uppercase text; examples in prototype must be checked at mobile and 200% zoom.

## Layout
- Keep one strong content rail near the existing `1180px` maximum; new full-bleed portrait sections are allowed only if content remains aligned.
- Prefer ruled service rows to repeated rounded panels.
- Use large margins as hierarchy, not wasted space. Tighter text rhythm for FAQ and enquiry.
- Mobile must have functional menu and all service information; no horizontal overflow.

## Images
- Hero: actual image of Amir in authentic teaching space. Crop with subject off-centre to permit editorial typography nearby.
- Secondary: genuine maths workings or lesson equipment with no identifiable student details.
- Year 11 parent guide can use a faithful cover mockup, not invented content.
- Original logo must replace `HMT` placeholder in prototype.

## Components and states
- Flat rectangular buttons with visible hover/focus behaviour; meaningful labels.
- Accordion uses native details or equally accessible implementation; FAQ heading scrolls normally.
- Enquiry form reuses actual Netlify fields, honeypot, validation and error/status announcement.
- Ensure the true brand logo and full navigation remain available at all sizes.

## Decision backlog
1. Approve authentic photography plan.
2. Decide whether to keep present sticky header on desktop/mobile.
3. Finalize Playfair/Inter scale and exact token variants after live visual tests.
4. Approve service row vs card design, the lime MOT feature and the copy.
5. Verify accessibility and actual lead form on deploy preview before merge.
