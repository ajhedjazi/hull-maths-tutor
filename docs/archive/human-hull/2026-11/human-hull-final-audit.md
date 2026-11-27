# Human / Hull final pre-launch audit

> **Historical audit snapshot.** The subsequent owner confirmation covers commercial use of both new photographs, without enabling either publication flag. H2/H3/M1/M2 follow-up results and the separate unresolved legacy learner-image investigation are recorded in the [current release-readiness report](human-hull-release-readiness.md). The original evidence and findings below are preserved as the audit baseline, not presented as current unresolved statuses.

Audit date: 19 November 2026. Branch: `feature/human-hull-redesign`.

## 1. Executive summary

**Verdict: NO-GO for public release today.** The redesigned pages render correctly once loaded, preserve their established metadata and routes, and pass the tested local enquiry and guide form contracts. Release still needs separate photographic permissions, an approved privacy/analytics treatment, resolution of reproducible mobile cold-load movement, and genuine provider/browser checks on an authorised preview.

This is an independent inspection of the current working tree, not reliance on earlier review notes. No implementation was changed. This report is the only repository file created during this audit. No commit, push, merge, deployment, permission approval or real test enquiry was performed.

The principal evidence is:

- Local `main`, recorded `origin/main`, the remote `main` SHA returned by `git ls-remote`, and the current Netlify production deployment all agree on `be72d0bf8d535aee5fb2e60d2b4ff41fc32cc444`.
- Ten content/confirmation pages tested at eight widths: **80 layout cases**, with no settled horizontal overflow, missing images or distorted image ratios. Seven secondary pages match their latest review screenshots exactly at 390px and 1440px: **14 pixel comparisons**.
- **20 axe scans** at 390px/1440px found no violations in the selected WCAG A/AA and best-practice rules. This is not WCAG certification. A separate text-enlargement defect and an experimental accessible-name warning remain.
- Mocked Netlify success, HTTP failure, network failure, duplicate prevention, status feedback and the thank-you route pass. Native forms also submit correctly with JavaScript disabled. The guide's consent fields, UTM fields, redirect field and PDF pass local contract tests. Provider delivery and notifications remain unverified.
- Mobile Lighthouse cold-load CLS was **0.253 on the homepage** and **0.126 on About and the guide** in the final isolated runs. Delaying navigation initialisation independently reproduces the header collapse. Settled screenshots do not reveal this defect.

Findings distinguish **verified defects**, **unverified risks**, **business decisions/release prerequisites**, and **optional improvements**. Subjective design changes are not proposed.

## 2. Full repository and page inventory

### Baseline and working tree

`HEAD` is still the production baseline above. Before this audit there were **10 modified tracked files, 85 untracked files, no tracked additions staged, and no tracked deletions**. The implementation is not yet represented by a feature-branch commit. The audit adds this report to that inventory.

Tracked changes against `main`: 808 insertions and 135 deletions across these files:

| File | Reviewed purpose |
| --- | --- |
| `index.html` | Approved homepage layout, portrait, content presentation, service prices and enquiry presentation |
| `about-amir/index.html` | Shared design, genuine portrait markup, responsive layout hooks |
| `gcse-maths-tutor-hull/index.html` | Shared design/navigation and approved terminology/action wording |
| `gcse-maths-tutor-prices/index.html` | Shared design, travel disclosure and action wording |
| `gcse-grade-4-5-maths-support-hull/index.html` | Shared design and Grades 3–5 display/schema labels; established URL retained |
| `functional-skills-maths-tutor-hull/index.html` | Shared design and accurate in-person/online starting-price presentation and offers |
| `maths-mot-hull/index.html` | Shared design, accurate enquiry/exploration action wording |
| `year-11-parent-guide/index.html` | Shared design/navigation; former inline styles moved into shared scoped CSS |
| `styles.css` | Appended scoped Human / Hull design system and portrait treatment; legacy styles retained |
| `render.yaml` | Local static packaging build command and publish directory changed from repository root to `public` |

All changes were inspected, including the homepage/content diff, the appended CSS, all new JavaScript and packaging code. No unrelated implementation change or added dependency was identified. `script.js`, `robots.txt`, `sitemap.xml`, the Google verification file, the download page and the thank-you page are unchanged from `main`.

Untracked implementation/configuration files:

```text
.gitignore
navigation.js
netlify.toml
scripts/prepare-public.mjs
assets/amir-homepage-hero.webp
assets/amir-homepage-hero-600.webp
assets/amir-about-portrait-480.webp
assets/amir-about-portrait-320.webp
```

Untracked reference files, all outside the export:

```text
design-reference/human-hull/DESIGN_AGENT_RULES_DRAFT.md
design-reference/human-hull/DESIGN_SYSTEM_DRAFT.md
design-reference/human-hull/HULL_MATHS_TUTOR_DESIGN_PRINCIPLES_DRAFT.md
design-reference/human-hull/Human_Hull_Full_Homepage_Concept.html
design-reference/human-hull/Human_Hull_Full_Homepage_Design_Proposal.md
design-reference/human-hull/README.md
design-reference/human-hull/desktop_preview.png
design-reference/human-hull/mobile_preview.png
design-reference/human-hull/assets/amir-homepage-hero.webp
design-reference/human-hull/assets/amir-about-portrain.png
```

The source portrait filename really is `portrain`, not `portrait`. Draft documents remain proposals, not newly adopted project rules.

Untracked review documents:

```text
docs/human-hull-phase-1.md
docs/human-hull-refinement-review.md
docs/human-hull-phase-2-review.md
docs/human-hull-final-five-review.md
docs/human-hull-about-portrait-review.md
```

The remaining **62 untracked files** are PNG review screenshots, exhaustively described by these sets:

- `docs/visual-review/human-hull-refined-{390,1440}.png`: 2 files.
- `docs/visual-review/phase-2/{about-amir,gcse-maths-tutor-hull,gcse-maths-tutor-prices,gcse-grade-4-5-maths-support-hull,functional-skills-maths-tutor-hull,maths-mot-hull,year-11-parent-guide}/{before,after}-{390,1440}.png`: 28 files.
- `docs/visual-review/final-five/{functional-skills-maths-tutor-hull,gcse-maths-tutor-prices,gcse-maths-tutor-hull,gcse-grade-4-5-maths-support-hull,maths-mot-hull,homepage-faq}/{before,after}-{390,1440}.png`: 24 files.
- `docs/visual-review/about-portrait/{before,after}-{390,1440}.png`: 4 files.
- `docs/visual-review/about-portrait-treatment/{before,after}-{390,1440}.png`: 4 files.

### Public output and hosting

Two consecutive `node scripts/prepare-public.mjs --local-preview` runs produced identical path/SHA-256 manifests: **33 public files**. These comprise ten content/confirmation HTML files, the verification HTML file, three CSS/JS files, two indexing files and seventeen assets. No reference materials, documentation, screenshots, source PNG, repository files, hosting configuration or test scripts appear in the export. `assets/guides/README.md` is excluded.

The seventeen exported assets are the four new WebPs above, `inter-latin-variable.woff2`, `playfair-display-latin-variable.woff2`, the guide PDF, five `gcse-maths-lesson` JPEG/WebP/AVIF variants, four `hmt-icon` PNG variants, and `hull-maths-tutor-hero.jpg`. Existing unreferenced variants are still copied because `assets/` is an allowlisted directory; see photography review below.

`netlify.toml:2` sets `command = "node scripts/prepare-public.mjs"` and `publish = "public"`. TOML parses correctly. There is no SPA catch-all, added redirect or route renaming. Current production responds with `Server: Netlify`; the connected Netlify project is `hull-maths-tutor`, with forms enabled and production on the baseline commit. No target deployment was created.

`render.yaml:5` uses the same packaging script and `public` directory. This is related safety work, not an accidental hosting migration. Render is not the verified production host. Its header configuration does not configure Netlify, and its static hosting alone would not provide the Netlify enquiry processor. Keep Netlify as the release target unless a separate hosting decision is approved.

There is no package manifest, lockfile, new library, framework or build-system migration. Audit utilities use already cached local tools and live outside the repository.

### Every public HTML page

Eight indexable URLs have unique titles/descriptions, one H1, a matching self-canonical and an exact sitemap entry. The two confirmation pages intentionally have `noindex,follow` and no canonical; neither is in the sitemap.

| URL | Existing title | Indexing / schema |
| --- | --- | --- |
| `/` | Maths Tutor Hull \| GCSE, A-Level & Functional Skills | Indexable; no JSON-LD, same as baseline |
| `/about-amir/` | About Amir Hedjazi \| Maths Tutor in Hull | Indexable; Person, BreadcrumbList |
| `/gcse-maths-tutor-hull/` | GCSE Maths Tutor Hull \| Foundation, Higher & Resits | Indexable; Service, BreadcrumbList |
| `/gcse-maths-tutor-prices/` | GCSE Maths Tutor Prices \| Hull Maths Tutor | Indexable; Service, BreadcrumbList, FAQPage |
| `/gcse-grade-4-5-maths-support-hull/` | GCSE Maths Support Hull for Grades 3-5 \| Hull Maths Tutor | Indexable; Service, BreadcrumbList |
| `/functional-skills-maths-tutor-hull/` | Functional Skills Maths Tutor Hull \| Adult Maths Tuition | Indexable; Service, BreadcrumbList |
| `/maths-mot-hull/` | Maths MOT Hull \| £45 GCSE Maths Assessment | Indexable; Service, BreadcrumbList |
| `/year-11-parent-guide/` | Free Year 11 GCSE Maths Parent Guide \| Hull Maths Tutor | Indexable; WebPage, CreativeWork, BreadcrumbList; existing OG/Twitter metadata |
| `/year-11-parent-guide/download/` | Your Year 11 GCSE Maths Parent Guide \| Hull Maths Tutor | Noindex; no schema; legacy layout |
| `/thank-you/` | Thank you for your enquiry \| Hull Maths Tutor | Noindex; no schema; existing confirmation layout |
| `/googlecf1431cd2c2791c2.html` | Verification response, not a content page | Exact Google verification token retained; H1/title requirements do not apply |

All titles, descriptions where present, canonical values and robots values match `main`. The thank-you page's absent description is appropriate for an unchanged noindex utility page. No new A-Level page exists; A-Level remains a homepage service and enquiry option.

## 3. Tests independently performed

| Test | Result and scope |
| --- | --- |
| Repository integrity | Branch, working tree, full tracked diff, all untracked file groups, remote baseline SHA and production deploy metadata inspected |
| Syntax/hygiene | `node --check` for `script.js`, `navigation.js`, export script; `git diff --check`: pass |
| Export | Two matching 33-file local manifests; public export with both approvals unset fails before output processing |
| Independent permission guards | Executed each exact guard statement separately in a sandbox with an empty environment: each throws its own permission error. No approval flag was set, even temporarily |
| SEO/content | Parsed all ten content HTML documents and baseline versions; inspected verification response, sitemap, robots, JSON-LD and links |
| Links/resources | All local anchor destinations resolve against the export; no broken local links/fragments, duplicate IDs, missing image alt attributes or failed local resources |
| Responsive | All ten content/confirmation pages at 320, 375, 390, 430, 768, 1024, 1440 and 1920px, 900px viewport height |
| Visual review | Fresh 390/1440 full-page captures and hero/footer inspection; exact comparison to latest seven-secondary-page screenshots; homepage compared with approved design reference |
| Accessibility automation | axe WCAG 2 A/AA, 2.1 AA, 2.2 AA and best-practice rules at 390/1440: 20 scans, zero violations |
| Keyboard | Eight redesigned pages: skip-link focus, menu open/close, Escape focus return, reachable last menu link; every FAQ toggled using Enter/Space |
| Small viewport | Open menu at 320×256: last enquiry link can be scrolled into view and focused; Escape closes it |
| Resizing/reflow | All ten pages at 640 and 320 CSS pixels, modelling 200%/400% reflow from 1280px; no overflow. Separate 200% root-text enlargement at 768px finds the download-header defect |
| Focus/anchors | Visible button focus is 3px teal with 5px offset; homepage enquiry, Functional Skills and guide section targets sit below the sticky header |
| Forms/analytics | All provider POSTs intercepted; contract, success/failure, native fallback, event-count and redirect tests described below |
| Performance | Four final isolated Lighthouse 13.4.1 runs, plus cold-load shift observation with delayed navigation |
| Security/privacy | Export text scanned for common private-key/token signatures; asset metadata and visible photographic content inspected; GET-only production/header checks |

Browser: headless Chromium 149 on Windows, Playwright. External requests were blocked for functional/layout tests. One initial HTTP sweep hit `ERR_NO_BUFFER_SPACE`; the completed 80-case sweep used direct interception serving the exact exported bytes. Consequently that sweep verifies rendering, not production CDN behaviour. Separate GET checks verified production resources, and Lighthouse used a real loopback HTTP server on port 8768.

HTML validation finds no new rule categories/counts relative to the corresponding baseline pages. Existing findings include raw ampersands, nonbreaking telephone spacing, whitespace and legacy void/doctype style. No parse-breaking markup was found. Guide honeypot attribute warnings are not evidence of failed provider protection.

Detailed machine-readable results, temporary scripts, fresh screenshots and Lighthouse JSON files are in `%TEMP%\human-hull-final-audit\`. They are not public output or release dependencies.

## 4. Critical findings

No verified critical software/security vulnerability, broken enquiry submission contract or site-wide indexing failure was found in this audit. This is not a penetration-test guarantee. The high-priority release gates below still prevent a public GO decision.

## 5. High-priority findings

### H1 — Photographic publication permissions remain outstanding

- **Severity/type:** High; unresolved business permission and mandatory release prerequisite.
- **Evidence/location:** `scripts/prepare-public.mjs:12` independently guards the homepage photograph; line 19 independently guards the About photograph. `index.html:35` and `about-amir/index.html:59` identify local-testing use. No permission clearance was supplied. The latest brief states the outdoor portrait was originally taken by a friend and subsequently lightly AI-adjusted; local cropping/compression does not resolve ownership or derivative-use rights.
- **Impact:** The approved photographs cannot yet be safely published. The normal public build intentionally fails while approvals are unset.
- **Recommended resolution:** Obtain separate written permission/provenance for the professional school photograph and the friend-taken outdoor portrait, including intended commercial website use and supplied edits. Also resolve the legacy social-preview image provenance described in section 13. Only then should an authorised release operator approve the corresponding flags. Keep both guards intact.
- **Launch blocker:** **Yes.** This is not a request to bypass a build failure.

### H2 — No documented privacy/analytics controls in the website

- **Severity/type:** High; verified implementation/information gap, with a business/legal determination still required. Pre-existing, not introduced by the redesign.
- **Evidence/location:** `script.js:1–13` configures and loads GA immediately. No consent default/gate, objection mechanism or privacy-policy page/link is present in the export. The enquiry at `index.html:93` collects contact details; the guide at `year-11-parent-guide/index.html:113` sends details to Web3Forms. Its short note at line 148 explains marketing choice but is not a complete processing notice.
- **Impact:** Visitors lack clear information and usable controls covering analytics and enquiry/guide processing. This audit cannot clear the privacy position or unseen GA account settings.
- **Recommended resolution:** Have the owner approve an accurate notice covering purposes, providers, retention, rights and contact details, and choose/document an appropriate analytics control model. Do not assume analytics always require a banner or that all analytics are exempt: current [ICO storage/access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) makes the statistical exception conditional, including information and an easy objection route. The tested implementation supplies neither those controls nor a consent mechanism. Account configuration and final legal applicability need review before an approved fix.
- **Launch blocker:** **Yes, pending owner privacy review and an approved remedy.** No tracking or form implementation was changed during this audit.

### H3 — Mobile navigation initialisation causes visible cold-load movement

- **Severity/type:** High; verified visual-stability defect in the shared redesigned header.
- **Evidence/location:** `navigation.js:16–17` reveals the toggle and adds `home-nav-ready` after load; `styles.css:3085–3089` displays the navigation before that class and hides it afterwards. Final isolated mobile Lighthouse CLS: homepage **0.253**, About **0.126**, guide **0.126**. A separate 600ms navigation-script delay moves the top of `main` from about **249px to 77px**. Font swaps add further homepage movement (`styles.css:1–14`).
- **Impact:** Content jumps during loading on slower mobile connections. A user can lose reading position or a tap target. Settled approval screenshots remain correct but do not cover this state.
- **Recommended fix:** Initialise the enhanced navigation state before first paint, while preserving the working no-JavaScript navigation; avoid a height-changing header transition. Review font preload/fallback metrics to reduce the separately measured font movement. Retest cold mobile loads and retain the existing design.
- **Launch blocker:** **Recommended technical release blocker.** Resolve and remeasure before presenting the mobile release as stable. These are local lab results, not field Core Web Vitals.

## 6. Medium-priority findings

### M1 — Legacy download header overflows with enlarged text

- **Severity/type:** Medium; verified accessibility/resizing defect, pre-existing.
- **Evidence/location:** `year-11-parent-guide/download/index.html:24–28` retains the legacy header, unlike the guide page. At 768px with root text enlarged to 200%, document width becomes **927px**, and brand/navigation extend beyond the viewport. Screenshot: `%TEMP%\human-hull-final-audit\download-text-200.png`.
- **Impact:** Readers using larger text need horizontal scrolling on a lead-conversion destination. Default-size scans miss this.
- **Recommended fix:** Apply a compatible wrapping/navigation treatment to that utility header, scoped to avoid altering approved pages. Retest actual browser text/zoom controls and keyboard access. Its native skip link already works: the next Tab after activation reaches “Download the PDF”.
- **Launch blocker:** Not a site-wide release blocker by itself; a known defect that should be resolved before claiming complete resizing accessibility.

### M2 — Secondary-page A-Level navigation loses the service context

- **Severity/type:** Medium; verified conversion/usability defect in the new navigation.
- **Evidence/location:** Secondary headers, for example `about-amir/index.html:53`, link to `/#enquire` with `data-enquiry-service="A-Level Maths"`. `navigation.js:72–75` can update only a form in the current document. Tested About → A-Level navigation lands on the homepage with **GCSE Maths** selected. The homepage's own A-Level CTA correctly selects A-Level.
- **Impact:** A-Level enquiries can arrive miscategorised unless the visitor notices and changes the selection. The message still submits; the route is not broken.
- **Recommended fix:** Carry the intended service through navigation using a validated state/query/fragment contract, then apply it on the homepage. Preserve the form name, field values and established route. Generic Maths MOT → homepage enquiry links also default to GCSE; consider their service context in the same approved fix.
- **Launch blocker:** No; fix is recommended before release to improve lead accuracy.

### M3 — Schema business and website references have no definitions

- **Severity/type:** Medium; verified structured-data completeness defect, pre-existing.
- **Evidence/location:** Seven secondary documents reference `https://hullmathstutor.co.uk/#business`; the guide also references `/#website` (`year-11-parent-guide/index.html:33–34`). Neither ID is defined in any public JSON-LD graph. The homepage has no JSON-LD, including at baseline. Example provider reference: `about-amir/index.html:31`.
- **Impact:** Machines receive incomplete entity relationships. This does not invalidate canonical URLs or prevent indexing.
- **Recommended fix:** Add approved, factually accurate business/site entity definitions using the already referenced IDs, or deliberately revise the references after SEO approval. Do not invent address, opening hours, ratings or credentials.
- **Launch blocker:** No. No established metadata change is required to address it.

## 7. Low-priority findings

### L1 — Shared CSS contains substantial unused rules per page

- **Severity/type:** Low; optional performance/maintenance improvement.
- **Evidence/location:** `styles.css` is 97,849 bytes, versus 53,649 at baseline; gzip-9 size is 16,928 bytes. Human / Hull rules start around line 2859. Lighthouse reports roughly 64–75KiB of unused raw CSS depending on the page. Much of this is shared/legacy presentation, not accidentally included test code.
- **Impact:** Additional blocking stylesheet work and a more complicated cascade.
- **Recommended fix:** After release blockers, consider measured minification and carefully scoped cleanup with regression coverage. Do not remove rules solely because one page marks them unused, and do not introduce a framework/build migration for this.
- **Launch blocker:** No.

### L2 — Optional HTTP hardening and cache policy should be explicit

- **Severity/type:** Low; optional hardening and hosting-maintenance improvement.
- **Evidence/location:** `netlify.toml:2–4` contains build settings only. Production GET responses provide HTTPS/HSTS and `Cache-Control: public,max-age=0,must-revalidate`; no custom CSP, frame policy or `X-Content-Type-Options` was observed on the inspected responses. `render.yaml:7` has a separate asset-immutable/one-day CSS policy, which Netlify does not use.
- **Impact:** No stale-Netlify-asset defect or exploitable injection was demonstrated. Render's immutable unversioned assets would need care if that host were used and filenames later overwritten.
- **Recommended fix:** Consider tested `nosniff`, framing and referrer headers, and a staged CSP compatible with inline guide scripts, GA and both forms. Keep mutable CSS/JS revalidated or version them before long caching. Confirm actual preview/production headers; do not copy Render policy blindly into Netlify.
- **Launch blocker:** No.

### L3 — Experimental brand-label warning requires human interpretation

- **Severity/type:** Low; unverified accessibility risk, pre-existing pattern.
- **Evidence/location:** Desktop Lighthouse's experimental `label-content-name-mismatch` check flags the header brand (`index.html:17`, analogous secondary markup). The visible service strapline is longer than the accessible name “Hull Maths Tutor home”. The main visible business name is included, and the normal axe rule set passes.
- **Impact:** Full speech-input compatibility for the complete visible label has not been established. This warning alone is not proof of a WCAG failure.
- **Recommended check/fix:** Test voice/speech navigation and decide whether the strapline forms part of the control label; align the accessible name if needed without creating an unnecessarily verbose repeated logo announcement.
- **Launch blocker:** No on current evidence; confirm during assistive-technology review.

## 8. SEO and indexing assessment

All eight indexable pages retain their established titles, descriptions, self-canonicals and indexing directives. `robots.txt` permits crawling and points to the unchanged sitemap. No duplicate title/canonical or missing sitemap entry was found. All indexable pages have internal inbound links; utility pages are reached through the appropriate form workflow rather than ordinary marketing navigation.

Each content/confirmation page has exactly one H1. Main heading levels are coherent, including the homepage service headings under an H2. The guide cover is represented as an accessible image; its decorative internal heading does not create a second primary heading. Breadcrumbs and their JSON-LD destinations match the established URLs. There is no unapproved redirect or replacement for `/gcse-grade-4-5-maths-support-hull/`.

Coverage is clear for Hull tuition, GCSE Foundation/Higher/resits, Grades 3–5, A-Level Pure/Statistics/Mechanics, Functional Skills Levels 1/2, the £45 MOT and the Year 11 guide. The editorial homepage H1 is supported by the Hull title, introductory copy and service content; no speculative H1/title rewrite is recommended.

JSON-LD parses successfully. Offers and qualifications match the supplied business facts. Only Functional Skills offer presentation and Grades 3–5 display/schema terminology differ from the baseline schemas, consistent with the approved content refinements. The FAQ schema on the prices page reflects visible answers. Undefined entities are M3; JSON parsing is not a Google rich-result certification.

The guide's existing OG URL/title/description/image and Twitter card remain unchanged; its image resolves. Other pages have no new OG blocks; their absence is not an indexing blocker. Google verification text is exact and the production verification URL returned 200. Search Console ownership/indexing status itself was not accessed.

The PDF is publicly reachable and not access-controlled. `noindex` on the download page does not make the PDF private or guarantee the PDF cannot be indexed. This is a free resource; there is no basis to treat public sharing as a defect without a different business requirement.

## 9. Accessibility assessment

Verified standard-rule results: 20 scans, zero violations, including automated contrast checks. Native controls have names/labels, required fields and email input types. Error feedback uses `role="status"`, `aria-live="polite"` and `aria-atomic="true"`. All public image elements have alt attributes; decorative brand images appropriately use empty alt text where adjacent text names the link. The genuine portraits' descriptions are meaningful.

The redesigned mobile menu has correct expanded state, keyboard operation, Escape close/focus return and a reachable scrollable end at a very short viewport. Native details/summary FAQs open and close with the keyboard. The eight redesigned skip links move focus to `main`. The legacy download page uses native fragment navigation successfully even without `tabindex` on `main`. The simple thank-you page has one principal return link and no repeated navigation to bypass.

Sampled focused controls have visible outlines. On dark sections/footer, accent outlines provide contrast. Sampled section links place the focused section around 108px from the top, below a 77px sticky header. Reduced-motion media rules disable button transitions and both scroll scripts choose automatic scrolling for that preference.

At normal size, every tested page reflows at 320px; the 200%/400% equivalent CSS viewport tests passed. This is **not a physical browser zoom certification**. Root-text enlargement separately found M1. Fixed-pixel text declarations and platform text settings still warrant real-device testing.

Mobile menu links and primary/form buttons have generous targets. Several inline text links measure about 20px high, and the guide consent checkbox is 22×22px with a large associated label. These are not automatically 24px target-size failures: inline/spacing exceptions and the combined label target matter. No standard automated target-size violations were found. Physical thumb/assistive testing remains outstanding, especially on the legacy download navigation.

Remaining manual checks: screen reader announcements and reading order, speech input for L3, actual 200%/400% zoom and mobile text settings, forced colours, contrast of every hover/focus/error state and sticky-header focus during a complete keyboard traversal. No full WCAG 2.2 AA compliance claim is made.

## 10. Forms and lead-generation assessment

### Netlify enquiry

The existing static form is discoverable: `name="enquiry"`, `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`, hidden `form-name=enquiry` and `action="/thank-you/"`. Business fields are `name`, `email`, `phone`, `service`, `message`. Name/email/message are required; phone is optional; all five existing service choices remain.

Read-only Netlify project inspection confirms form detection is enabled and an `enquiry` form is already registered with exactly those business fields plus the honeypot. This supports compatibility, but does not establish notification settings or the result of a future deploy's form parsing. [Netlify's form setup documentation](https://docs.netlify.com/manage/forms/setup/) confirms static detection and URL-encoded AJAX submission requirements.

Independently simulated:

1. Empty required fields and malformed email cause no POST.
2. A valid enquiry with an empty phone produces one URL-encoded POST to `/`, including `form-name`, empty `bot-field` and selected service.
3. While pending, the submit button is disabled, says “Sending request...” and has `aria-busy=true`; repeated submit events do not create another request.
4. A mocked HTTP 200 HTML response succeeds without requiring JSON, queues exactly one `generate_lead`, then navigates to `/thank-you/`.
5. Mock HTTP 500 and network failure show the existing polite live error message, restore the submit control and queue no lead event.
6. With JavaScript disabled, the browser POSTs the same form contract to `/thank-you/`. This is the native Netlify fallback; local success was intercepted, not delivered.

The honeypot field is hidden from keyboard/assistive navigation and included in AJAX data. Actual spam rejection is provider-side and has not been certified by the mock. No live submissions, stored enquiry contents or notification emails were read/sent.

### Parent guide / Web3Forms

The native Web3Forms action, existing access key and hidden redirect are unchanged. The key is an intentionally public submission identifier, not a private API secret; see [Web3Forms access-key guidance](https://docs.web3forms.com/getting-started/faq).

Required first name/email/tier validation passes. The hidden `botcheck` checkbox is unchecked and omitted from normal payloads. Optional marketing consent starts unchecked, is absent when declined and is included only when checked. Query-string UTM source/medium/campaign populate the corresponding hidden fields; the current implementation captures parameters on the guide page itself, not an independently proven cross-page campaign history.

Mock native provider success was represented by a redirect to the local download page. The real submitted redirect value remains `https://hullmathstutor.co.uk/year-11-parent-guide/download/`. A successful local mock does not prove provider key/domain approval, inbox delivery, spam classification or email marketing operations. Errors are handled through native browser/provider navigation, not an AJAX inline status system; that existing contract is preserved.

The PDF is 1,219,985 bytes, has a valid PDF signature/end marker and ten page objects. Both local PDF links resolve; the production PDF GET returned 200 with `application/pdf`. A full PDF accessibility/content audit was not part of this release-page test.

**Preview constraint/business decision:** the guide's absolute redirect leads to production. [Web3Forms redirection documentation](https://docs.web3forms.com/getting-started/customizations/redirection) describes cross-domain redirect restrictions on free plans. The account plan/domain restrictions were not verified. Before an authorised preview submission, decide whether an approved test key/domain/redirect arrangement is needed. Do not count a trip to the old production download page as proof of the redesigned preview download page.

The Maths MOT remains an enquiry route, not a confirmed appointment booking. Its WhatsApp link and homepage-enquiry destinations resolve; no calendar or invented availability has been added.

## 11. Analytics assessment

`script.js` is byte-identical to `main`; measurement ID remains **G-FTB362ESXH**. Each of the seven pages loading it queues exactly one `config` call in the isolated tests. Navigation code contains no GA configuration or additional event handlers for these conversions.

| Event/path | Independent local result |
| --- | --- |
| `generate_lead` | Exactly one on mocked Netlify success; none on mocked HTTP/network failures |
| `phone_click` | One per tested click on each page loading `script.js` |
| `whatsapp_click` | One on the reachable Maths MOT WhatsApp link; no WhatsApp control is present on the other tested pages |
| `maths_mot_click` | One per tested matching link click on each page loading `script.js` |
| Parent guide | No pre-existing GA configuration/download event in guide/download source; none invented by the redesign |

The guide uses its UTM fields rather than `script.js`; guide phone/MOT clicks therefore do not queue these GA events. The download and thank-you pages also lack GA. These are preserved baseline limitations, not broken navigation refactoring. Enhanced measurement and account-level event settings were not inspected, so a one-config source check is not proof of an absence of account-level duplication.

**Measurement disclosure:** three preliminary Lighthouse runs loaded the live GA tag because the CLI blocking patterns were incorrectly passed as one pattern. Their traces show three `page_view` collection requests returning 204, from the local audit URL. No form or lead event was sent. This may add three test page views to the property; no DebugView/Realtime ingestion was verified. The four final runs used explicit separate blocked patterns and recorded no successful external requests. No GA settings or data were altered.

Live preview tests must confirm event arrival and parameters, particularly delivery of `generate_lead` before the immediate redirect. A queued local call is not evidence that a collector received it.

## 12. Performance assessment

Final measurements use Lighthouse **13.4.1**, Chromium **149**, Windows, Node **24.14.1**, a real local static HTTP server, uncompressed responses and cold navigation. GA/Google Analytics requests were blocked. Mobile emulation: 412×823, simulated 150ms RTT, approximately 1.6Mbps throughput, 4× CPU slowdown. Desktop uses the Lighthouse desktop preset, 40ms RTT/10Mbps and 1× CPU. One final run per case; results are lab observations, not statistical guarantees or real-user Core Web Vitals. INP was not measured.

| Case | Performance | Accessibility* | Best practices* | SEO* | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage mobile | 81 | 100 | 100 | 100 | 2.0s | 2.9s | 0ms | 0.253 |
| Homepage desktop | 100 | 100 | 100 | 100 | 0.5s | 0.6s | 0ms | 0.001 |
| About mobile | 90 | 100 | 100 | 100 | 2.0s | 2.9s | 0ms | 0.126 |
| Parent guide mobile | 94 | 100 | 100 | 100 | 1.5s | 2.0s | 0ms | 0.126 |

*Scores do not clear the manual findings, experimental warning or legal/business review. The earlier CLI runs generated valid reports but returned a Windows cleanup `EPERM`; final programmatic runs completed and closed their owned browser normally. The final isolated JSON files, rather than those preliminary runs, supply the table.

The responsive portraits have explicit dimensions and correct aspect ratios. Homepage: 600×450/30,474-byte and 1200×900/87,096-byte WebPs. About: 320×760/52,318-byte and 480×1140/96,614-byte WebPs. Both main images have high fetch priority and async decoding. About's full figure remains visible at every tested width, with the approved opposite-corner treatment; no stretch or extra object-fit crop is introduced.

Inter/Playfair are self-hosted WOFF2 with fallbacks and `font-display:swap`. The guide preloads Playfair; the homepage/About do not. Lighthouse attributes movement both to the header state change and to web-font arrival. H3 addresses this demonstrated issue; merely compressing the photo further would not solve it.

Raw/gzip-9 source sizes: CSS 97,849/16,928 bytes; `script.js` 15,088/4,011; navigation 3,177/1,069. These gzip values are calculated estimates, not measured CDN transfer sizes. GA is the only normal external runtime script on the seven analytics-enabled pages. Web3Forms is contacted on native submission, not initial page load. No application framework or new third-party runtime dependency was introduced.

No browser script errors or broken local resources occurred in the completed page sweep. Production CSS, JS, icon, robots, sitemap, verification and PDF GETs all returned 200. The sampled production design-reference prototype URL returned 404. Future candidate CDN compression/caching and cold-load behaviour still need preview testing.

## 13. Photography and privacy permissions

The two new photographs are separately guarded and **neither is cleared by this audit**. The public packaging path cannot proceed with both approvals unset. Each guard independently throws when tested in isolation with an empty synthetic environment. No `HMT_PHOTO_USAGE_APPROVED` or `HMT_ABOUT_PHOTO_USAGE_APPROVED` value was set by the audit. The supported local-preview path is not publication.

The new homepage crop shows Amir and no visible student face; an indistinct foreground edge does not establish an identifiable pupil. The outdoor About portrait shows Amir alone. Its user-reported prior AI adjustment is part of provenance to review, rather than a claim that the local pipeline generated a replacement.

**Additional asset review is required:** the pre-existing `assets/hull-maths-tutor-hero.jpg` visibly shows a tutor and a young learner's face, is exported, and remains the guide's OG image (`year-11-parent-guide/index.html:17`). Its real/stock/generated origin and any model release were not established. Do not assume it depicts Amir, assume the learner is synthetic, or assume it has permission because it predates the redesign. If it depicts a real identifiable learner, obtain appropriate photographer and image-use permission before continued use. Existing `gcse-maths-lesson` variants show hands without faces. The two new-photo flags do not independently establish rights to these legacy assets.

The new WebPs contain no EXIF; no GPS EXIF was found in the inspected legacy JPEGs. An export text scan found no common private-key, AWS/GitHub/OpenAI-token or JWT signatures. This is a bounded scan, not proof that no possible secret exists. Public contact details, GA measurement ID and the public Web3Forms identifier are expected business configuration, not private credentials. No student records or live enquiry content were accessed.

## 14. Remaining manual checks

These are pending, not reported as passed:

1. Obtain and record separate commercial permissions for both new portraits; establish the legacy OG learner image's provenance/permissions. Verify no identifiable real student is being published without appropriate permission.
2. Approve the privacy/analytics information and controls; inspect GA settings and actual cookies/storage after the approved treatment. Confirm enquiry/guide data handling, retention and marketing opt-out operations.
3. After authorised fixes, cold-load the mobile homepage and several secondary pages under throttling. Confirm stable header height, font behaviour and acceptable lab CLS; do not use only settled screenshots.
4. On an authorised Netlify preview, inspect the deployment's detected `enquiry` field contract and success action. Confirm preview noindex/access settings and that docs, reference materials and temporary files are 404. No public preview before photograph rights are approved.
5. With **explicit permission for real test submissions**, submit one uniquely labelled legitimate enquiry with optional phone omitted; verify the Netlify record, notification email, reply-to and thank-you URL. Repeat a native no-JavaScript submission if permitted. Verify errors and a deliberate honeypot case without treating a mocked rejection as a live test. Avoid rapid spam-like submissions.
6. Agree the guide preview-domain/key/redirect test arrangement first. With permission, submit once with marketing unchecked and once checked, using approved test details. Verify provider delivery, field values/UTMs, consent recording, production-versus-preview redirect, PDF open/save on mobile and spam/error behaviour. Do not subscribe test addresses without authorisation.
7. In GA4 DebugView/Realtime, verify one intended page view, one phone/MOT/WhatsApp event per click where those events are implemented, and one `generate_lead` after a real successful enquiry. Confirm failure produces no lead; check redirect delivery and absence of unintended PII. Do not interpret the three preliminary audit page views as this validation.
8. Smoke-test Chrome/Edge, Firefox and Safari, including a physical iPhone and Android phone, landscape, keyboard-only traversal, menu resize/outside-click behaviour, touch targets, FAQ controls and email/phone/WhatsApp handoff.
9. Use actual 200%/400% zoom and mobile text sizing, including the download page; verify content is not lost or covered by the sticky header. Test NVDA/VoiceOver error announcements, consent labels, reading order, forced colours and speech-label matching.
10. Run Google Rich Results/schema checks on the candidate, Search Console URL inspection as appropriate, and verify canonical/robots/HTTP response headers after deployment. Check the legacy URL directly; do not introduce a replacement redirect.

No real provider delivery, live notification, screen-reader certification, physical-device result, GA DebugView/Realtime result or real-user performance result is implied by the local passes.

## 15. Recommended release sequence

This is a recommendation only; none of these release actions was executed.

1. Confirm photographic permissions separately and resolve legacy image provenance. Record the scope of approval; retain both build safeguards.
2. Approve and resolve H2/H3 and any other accepted fixes. Retest them, including typography/header behaviour and export integrity. Review M1/M2/M3 before deciding what can be deferred.
3. Review the exact intended file list, then authorise a commit on `feature/human-hull-redesign`. Include required untracked implementation files; deliberately select reference/review artifacts rather than blindly staging the directory.
4. Authorise pushing that branch and opening a GitHub pull request against the verified current `main`. Recheck the baseline if upstream moves.
5. Configure/approve the photography flags only after permission evidence exists, and authorise the Netlify deploy preview. Verify the build really publishes `public`, processes the form, excludes private/reference content and keeps the preview out of indexing.
6. Execute the explicitly authorised live form/notification and GA ingestion checks above. Resolve the guide's preview-domain redirect arrangement before submitting.
7. Complete browser, physical mobile and assistive-technology smoke tests; confirm cold-load stability and the production metadata/legacy route contract.
8. Review the actual preview and final PR diff, record any consciously deferred non-blocking findings, and obtain approval to merge.
9. Authorise merge into `main` and confirm Netlify's production deployment: commit SHA, output path, permissions flags, forms, resource headers and live routes. Keep the prior known-good deploy available for an authorised rollback if a release check fails.
10. Check Search Console, analytics and enquiry notifications after launch; monitor for missed leads, provider spam filtering, broken routes and field performance. Do not treat a successful build as proof of successful lead delivery.

## 16. Final GO / CONDITIONAL GO / NO-GO verdict

**NO-GO now.** Publication permissions are unresolved, privacy/analytics controls need an approved treatment, and a reproducible mobile loading-state defect remains. These are concrete release gates; another visual redesign is unnecessary.

The candidate can move to **CONDITIONAL GO for an authorised preview** after H1/H2/H3 are resolved and rechecked, with the provider/browser/manual tests still pending. Public production GO should follow successful live form delivery, GA verification, browser/accessibility smoke tests and explicit release approval. M1–M3 are documented non-site-wide defects for a conscious fix/defer decision.

The approved Human / Hull appearance, genuine portrait treatment, core navigation, metadata, prices and established form contracts have a strong local verification base. This audit authorises no implementation or release step. Stop for owner review.
