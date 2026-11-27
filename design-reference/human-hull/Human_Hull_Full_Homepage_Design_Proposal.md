# Hull Maths Tutor — Human / Hull
## Complete homepage design proposal · For approval, not implementation
**Date:** 13 November 2026  
**Status:** Design concept only. No repository, Netlify, or production changes made.

## 0. Missing design references — checked before design
The repository `ajhedjazi/hull-maths-tutor` on `main` currently has no files with these names:

1. `HULL_MATHS_TUTOR_DESIGN_PRINCIPLES.md` — researched usability and design principles. **Missing.**
2. `DESIGN_AGENT_RULES.md` — operational guardrails for AI coding agents. **Missing.**
3. `DESIGN_SYSTEM.md` — approved design tokens, typography, patterns, imagery guidance. **Missing.**
4. `AGENTS.md` — root-level pointers telling Codex to consult the above files. **Missing.**

`docs/site-alignment-qa.md` **exists**, but concerns layout-rail checks and is not a substitute for the documents above.

Two separate, explicitly **draft** guardrail documents accompany this proposal. They must be reviewed and approved before becoming the repository's authoritative instructions. Do not create a root `AGENTS.md` pointing to unapproved design rules.

## 1. Creative thesis
**A local teaching practice, not a tutoring platform.** The person teaching the lessons should be at the centre of the site. The website should make it easy to understand who Amir is, which maths tuition he offers, how his sessions work, what they cost and how to enquire.

**Design keywords:** personable, grounded, editorial, warm, thoughtful, confident, unmistakably maths-related.  
**Anti-keywords:** template-like, overly corporate, futuristic, dense, childish, gimmicky, stock-photo-heavy.

**Signature direction:** natural cream space, a large expressive editorial headline, an authentic portrait of Amir, crisp no-nonsense pricing rows, mathematical working on paper, and one high-contrast lime Maths MOT feature. The visual rhythm changes intentionally between sections; no repeated round-corner card grid.

## 2. User needs, not guesses about conversions
- **GCSE parent:** know qualifications, cost, level supported, and how to enquire.
- **A-Level learner/parent:** establish that Pure Maths, Statistics and Mechanics are supported, with prices and accessible contact.
- **Adult Functional Skills learner:** see Level 1/2 support, simple wording and a welcoming, non-schoolish experience.

We have not conducted a user study proving the new page converts better. These are plausible user needs based on the services and existing enquiries. Validate with user feedback and actual leads after launch.

## 3. Brand system to preserve
- Deep teal: `#0B4344` (primary)
- Cream: `#F5F1E8` (background)
- Lime: `#B7D438` (accent)
- Dark ink: `#102A2A` (body text)
- Teal interactive: `#0F5D5E` (links/accent)
- Muted text: `#526969`
- Proposed neutral surfaces `#FBFAF6`, `#E2ECE5` (design choices, not verified existing tokens)

**Typography:** keep existing self-hosted Inter and Playfair Display where suitable. The local demonstration uses browser-safe font fallbacks; it is not a typeface approval. Use Playfair for a few expressive headings and Inter for explanatory content, prices, forms, labels and navigation. No arbitrary font combinations.  
**Geometry:** square-corner buttons and ruled editorial sections can provide a more personal character than a site full of rounded cards. Changes in rhythm should be purposeful, not random.

Sample measured WCAG contrast ratios (computed from these flat colours, not full-page accessibility certification): `#102A2A` on `#F5F1E8` ≈ 13.44:1; `#0B4344` on `#B7D438` ≈ 6.57:1; `#526969` on `#F5F1E8` ≈ 5.20:1. **Do not use lime text on cream** for important information; its contrast is only ≈ 1.49:1.

## 4. Complete homepage — proposed content order

### 01. Header
- Actual Hull Maths Tutor logo/wordmark, never the demonstration's temporary `HMT` square.
- Navigation: GCSE Maths, A-Level enquiry, Functional Skills, Maths MOT, Meet Amir, Enquire.
- Desktop horizontal; mobile **fully accessible menu**, not simply hidden navigation links.
- Header may retain existing sticky behaviour, but must not obscure anchors or keyboard focus.
- Correct existing old subtitle `GCSE & Functional Skills` so A-Level isn't omitted.

### 02. Hero — first impression
**Eyebrow:** `Hull based. Personally taught.`  
**H1:** `Maths help that makes sense.` (existing, retained in essence; stylised with a line break or italic treatment)  
**Support:** `One-to-one GCSE, A-Level and Functional Skills maths tuition in Hull and online. Clear explanations, at your pace, from a teacher who knows the subject.`  
**Primary CTA:** `Ask about tuition` -> `#enquire`  
**Secondary CTA:** `Meet your tutor` -> About section or existing About page  
**Imagery:** authentic, well-lit photograph of Amir in a real teaching context. The prototype uses an **obvious illustrated placeholder**, not a claimed photograph.

**Art direction for portrait:** natural expression; believable teaching space; neutral/teal clothing if appropriate; no invented students, staged stock handshake or generic classroom photo. Obtain consent for any recognisable student and do not expose private pupil information.

### 03. Credibility ribbon
Four short, truthful claims: `16 years' teaching experience`; `7 years as Head of Maths`; `Maths degree + PGCE`; `DBS checked`. Preserve DBS wording only if correct and supported. Each item reads independently and reflows in narrow layouts.

### 04. What I teach — three editorial service rows
Avoid three identical app-like cards. Each row shows the service, a clear description, visible prices and a direct route.

- **GCSE Maths:** Foundation, Higher, resits and support for building towards Grades 3–5. **£40 in person / £35 online**. Production link `/gcse-maths-tutor-hull/`.
- **A-Level Maths:** Pure Maths, Statistics and Mechanics for Year 12, Year 13 and resit students. **£50 in person / £45 online**. Link to existing A-Level enquiry form choice; do not invent a new A-Level page.
- **Functional Skills:** Level 1 and Level 2 for adults and young people. **From £45 online / £50 in person**. Production link `/functional-skills-maths-tutor-hull/`.

Use the currently approved wording/prices, rather than treating any visual-prototype simplification as a source of truth.

### 05. How lessons work
**Heading:** `Good maths teaching starts by listening.`  
Three factual, modest steps: identify the difficult topic; explain step by step; practise with purpose.  
Beside the text, use a genuine close-up of handwritten maths working or a real whiteboard with permission. The prototype uses a **clearly illustrative paper composition**.

### 06. Meet Amir — personal trust
**Heading:** `Hello, I'm Amir.`  
Short, first-person account: qualified maths teacher; Mathematics and Statistics degree; PGCE Secondary Mathematics; 16 years' secondary maths teaching; 7 years as Head of Maths. Keep detail of 3 years as Second in Department on `/about-amir/` or a short supporting line.

Do not claim 16 years teaching A-Level. Do not invent results, reviews, guarantees or awards. Avoid overwhelming the user with a CV.

### 07. Maths MOT — clear differentiator
Use the lime accent as a **deliberate, one-off feature**. GCSE Maths MOT, one-hour in-person check-up, £45. Link `/maths-mot-hull/`; no suggestion that the MOT is mandatory before tuition.

### 08. Free Year 11 parent guide
A compact, tangible printed-guide visual (not stock ebook graphics), short description, link `/year-11-parent-guide/`. Retain current lead-capture behaviour without promising unsupported outcomes.

### 09. FAQs
Four initial questions: where tuition takes place; A-Level teaching coverage; whether Maths MOT is required; pricing. Use native `<details>` where possible. **No sticky heading behaviour** on the homepage. Keep existing working keyboard interaction.

### 10. Enquiry and footer
A personal, reassuring enquiry section with visible contact method and the existing Netlify form. Preserve current form names and field choices, spam/honeypot, success route, accessible error feedback and newly configured Netlify email notifications. The demonstration intentionally **does not send an enquiry**.

## 5. Interaction and layout principles
- 1440/1024 desktop: editorial two-column hero; wide ruled service list; asymmetrical but readable sections.
- 768 tablet: stack or reduce complex side-by-side sections; maintain obvious primary CTA.
- 390/375/320 mobile: functional menu, no horizontal overflow, visible prices, readable headings, easy enquiry path.
- Hover effects subtle and reversible. No obligatory page-reveal animation.
- Obey `prefers-reduced-motion`; ensure focus isn't obscured by headers.
- Photography uses explicit crop guidance and meaningful alt text; decorative artwork can use empty alt.
- Any interaction not present in the prototype must be validated against production behaviour.

## 6. What the visual prototype actually demonstrates
The standalone `Human_Hull_Full_Homepage_Concept.html` contains an entire page layout and responsive CSS, with working anchor links and native FAQ expansion. It has a prototype-only form and a sample mobile menu. It does not contain real portrait photography, the final logo asset, Netlify form handling, full analytics, performance optimisation or cross-browser/device testing. It is **not** a deployable replacement for the production website.

## 7. Evidence versus judgement
**Mandatory accessibility baseline:** WCAG 2.2 AA (contrast, reflow at 320 CSS pixels, focus visibility, keyboard operation and identifiable inputs). Primary source: https://www.w3.org/TR/WCAG22/.

**User-centred content and plain language:** GOV.UK Service Manual: https://www.gov.uk/service-manual/service-standard/point-1-understand-user-needs and https://www.gov.uk/service-manual/design/writing-for-user-interfaces. ONS guidance on front-loading: https://service-manual.ons.gov.uk/content/writing-for-users/structuring-content.

**Design preference, not proven conversion science:** editorial serif heading, lime feature block, real photograph of Amir, borders instead of cards, mathematical worksheet visual. These need aesthetic approval and ideally user testing.

## 8. Pre-implementation approval gates
1. User selects/approves the visual direction and exact homepage copy.
2. Obtain or plan a genuine portrait (or choose a different approved hero treatment).
3. Confirm real brand logo and typography usage.
4. Approve final design tokens and document them in `DESIGN_SYSTEM.md`.
5. Finalise `HULL_MATHS_TUTOR_DESIGN_PRINCIPLES.md` and `DESIGN_AGENT_RULES.md` and reference from `AGENTS.md`.
6. Create a fresh branch from updated `main`, not the already merged SEO feature branch.
7. Build a proper staging preview; preserve page URLs, metadata, forms, lead emails and analytics.
8. Test 320/375/390/768/1024/1440, keyboard, focus, zoom/reflow, HTML validity, and actual Netlify form processing in an approved environment.
9. Require explicit user approval before merge/deployment.

**Open design question for approval:** Is the authentic personal portrait the defining hero feature, or should it remain a strong secondary visual with a more mathematical hero treatment?
