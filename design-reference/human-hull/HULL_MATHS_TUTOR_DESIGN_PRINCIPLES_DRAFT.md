# Hull Maths Tutor — Design Principles (DRAFT)
**Status:** Provisional research-backed starter; NOT adopted into the repository. Requires source review, user approval and expansion before being renamed `HULL_MATHS_TUTOR_DESIGN_PRINCIPLES.md`.

## 1. Purpose
Make Hull Maths Tutor distinctive without making it difficult for busy parents, GCSE/A-Level students or adult Functional Skills learners to understand or use.

## 2. Rule categories
- `[REQUIRED]` Accessibility, content accuracy, existing business requirements.
- `[EVIDENCE]` Credible usability patterns supported by published guidance.
- `[PREFERENCE]` Deliberate visual choices of the proposed Human / Hull direction.
- `[HYPOTHESIS]` Predicted impact needing evaluation with users and enquiries.

## 3. Design principles
1. **[REQUIRED] Start with the task.** The visitor must find tuition type, location, price, credentials and enquiry route without deciphering decorative UI.
2. **[EVIDENCE] Write plainly.** Use descriptive headings, short sentences, familiar language and concise instructions. Don't write an essay in the hero.
3. **[EVIDENCE] Front-load important information.** Put service offerings and teacher identity near the top, rather than after long storytelling.
4. **[REQUIRED] Meet WCAG 2.2 AA as a target.** Specifically verify contrast, keyboard function, responsive reflow, accessible names, focus not obscured, logical reading order, usable errors.
5. **[PREFERENCE] Make the person visible.** Use an authentic, consented photo of the actual tutor, not a stranger, synthetic substitute or generic stock classroom.
6. **[PREFERENCE] Keep the brand recognisable.** Deep teal, warm cream and controlled lime. Do not introduce a competing colour palette without approval.
7. **[PREFERENCE] Use editorial hierarchy.** Headings should have contrast in scale and line length; use varied section rhythms intentionally, not monotonous equal cards.
8. **[PREFERENCE] Use mathematics as content, not decoration.** If showing worked examples, use mathematically correct and pedagogically meaningful examples; use real teaching materials when possible.
9. **[REQUIRED] Be scrupulously factual.** Qualifications, fees, teaching experience, safeguarding claims and lesson formats must be verifiable. No fictional reviews or guarantees.
10. **[REQUIRED] Protect core functionality.** Netlify enquiries, spam protection, feedback on failures, thank-you flow, email notifications, internal links, analytics and SEO tags remain operational.
11. **[HYPOTHESIS] Distinctive photography and editorial design may improve trust.** Test with actual users and measure qualified enquiries; don't assert a guaranteed uplift.

## 4. Starter token reference (from current repository)
- Primary teal `#0B4344`; cream `#F5F1E8`; lime `#B7D438`; ink `#102A2A`; muted text `#526969`; link teal `#0F5D5E`.
- Existing font families: Inter and Playfair Display.
- Original site alignment tokens: `--site-max-width:1180px`, `--site-gutter:28px`. Any departure needs explicit rationale.
- New neutral surface examples in the prototype are **not approved tokens**.

## 5. Design anti-patterns
- Identical rounded cards in every section.
- Fake photographs of the tutor or invented success stories.
- Excessive gradient and generic icon decoration.
- Mobile navigation links hidden without a usable menu.
- Sticky headings obscuring content.
- Prices split across pages without a clear route to find them.
- Buttons that have no action, or forms showing success before an accepted response.
- Unreadable lime-on-cream body text (sample measured contrast ≈1.49:1).

## 6. Research / sources to verify and expand
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- GOV.UK user needs: https://www.gov.uk/service-manual/service-standard/point-1-understand-user-needs
- GOV.UK writing for interfaces: https://www.gov.uk/service-manual/design/writing-for-user-interfaces
- ONS user-centred content: https://service-manual.ons.gov.uk/content/writing-for-users/user-needs
- ONS information hierarchy: https://service-manual.ons.gov.uk/content/writing-for-users/structuring-content

**Evidence limit:** These sources do not establish that a particular aesthetic, serif font or personal portrait automatically improves leads. Those are design hypotheses to test.
