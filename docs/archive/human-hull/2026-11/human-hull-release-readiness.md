# Human / Hull - current release readiness and plan

19 November 2026. Branch `feature/human-hull-redesign`. Updated for the owner's superseding approval: **the Parent Guide is now a free, direct PDF download with no form or Web3Forms integration**. Earlier required name/email/tier and guide-provider preview instructions no longer apply to future downloads. The historical [final audit](human-hull-final-audit.md) and [first remediation](human-hull-release-blocker-remediation.md) remain evidence of their original states.

**Local result: direct-download implementation ready for review. Public release remains NO-GO pending the remaining privacy notice/account confirmations and authorised release checks.** Removing the guide form resolves the future collection/necessity question and removes the Web3Forms submission/redirect test dependency. It does not delete historical records or remove the independent photo safeguards.

No commit, push, merge, deployment, publication flag, real enquiry, actual analytics collection, customer-data deletion, provider/account change, blog or advice-section work was performed.

## A. Implemented and locally verified

### Direct resource access

- `/year-11-parent-guide/` has no form, first-name/email/tier fields, spam field, Web3Forms key/action, resource/subject submission fields or provider redirect. Nothing is POSTed to obtain the PDF.
- Both the hero and former form area offer a prominent native **Download Free Guide** link to `/assets/guides/year-11-gcse-maths-parent-guide.pdf`, using `download`. The panel also offers a normal browser-open link. No JavaScript, analytics choice, email address, account or subscription is required.
- The existing Human / Hull layout, colours, typography, cover treatment, header/footer and section order are retained. The former form is replaced by a scoped download panel sharing its approved border/padding treatment. Supporting copy accurately says no sign-up/contact details are needed. The existing `#get-guide` anchor is retained for older section links.
- `/year-11-parent-guide/download/` is **byte-identical to the starting version** and remains functional for older links. Its download and browser-open links use the same PDF. No redirect, route rename or mandatory trip through that page is introduced.
- The PDF bytes, filename, public URL and packaging are unchanged: 1,219,985 bytes, PDF MIME/signature verified. The existing 10-page resource is not rewritten or represented as newly accessibility-certified.

Review: [mobile full page](visual-review/direct-guide/guide-page-390.png), [desktop full page](visual-review/direct-guide/guide-page-1440.png), [mobile download section](visual-review/direct-guide/guide-download-390.png), [desktop download section](visual-review/direct-guide/guide-download-1440.png), [mobile privacy draft](visual-review/direct-guide/privacy-390.png), [desktop privacy draft](visual-review/direct-guide/privacy-1440.png).

### Privacy and historical records

The notice now describes future downloads as form-free and independent of JavaScript/analytics consent. It explains that ordinary page/PDF requests can still generate hosting/network information; no claim of zero personal-data processing or anonymous server logs is made.

Web3Forms is described only in relation to records from the former guide form. Historical submissions, emails, exports and consent evidence remain untouched. The proposed 90-day guide-record schedule now applies only to those historical records and is still conditional on an operable deletion process. Future downloads create no guide-form records. Tuition enquiry processing and the proposed 12-month unsuccessful-enquiry limit remain separate.

The [owner privacy review](human-hull-privacy-owner-review.md), [retention procedure](../../../maintenance/retention-procedure.md), [earlier attribution decision](human-hull-attribution-proposal.md) and [final release checklist](human-hull-final-release-checklist.md) are updated to reflect this superseding instruction. The future guide-form LIA/necessary-email issue is resolved by ending collection, not by claiming the earlier assessment passed. Historical-record purpose, retention and provider facts still need review.

Amir Hedjazi's confirmed sole-trader identity and contact details remain. The notice is still labelled **owner review draft, not approved for publication** for the genuinely unresolved tuition/hosting/analytics/historical-record facts. Current [ICO data-minimisation guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/) and [privacy-information guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/) were consulted; their update notices are acknowledged. This is an implementation review, not legal certification.

### Protected functionality and permissions

- The Netlify tuition enquiry form, validation, honeypot, field names, AJAX/native POST targets, statuses and thank-you route are unchanged. Prices, qualifications, established links and business claims are unchanged.
- `privacy.js` is byte-identical to the starting version: GA4 `G-FTB362ESXH`, existing event names, default-off `hmt_analytics_v3`, fresh opt-in/obsolete-version rejection, redaction, withdrawal and cross-tab controls are preserved. No new download event or GA configuration is added to guide/download pages; neither page loads Google Analytics even with analytics allowed.
- Both new-photo commercial permissions remain owner-confirmed. `HMT_PHOTO_USAGE_APPROVED` and `HMT_ABOUT_PHOTO_USAGE_APPROVED` guards remain independent and unchanged; no flag was enabled.
- The approved 1200 x 630 social JPEG remains. The unverified legacy learner JPEG remains excluded from packaging, not presumed cleared. Existing image/font bytes and portrait treatments are untouched.
- Two local exports produce identical **36-file manifests**. Docs, reference materials, review screenshots, source PNGs and the retired learner JPEG are absent. Both exact photo guards reject independently without approval; the normal public path rejects before output with both flags omitted. No `public/` directory was created.

### Fresh regression results for the direct-download change

| Check | Result |
| --- | --- |
| Native PDF downloads | **24 successful downloads**, each byte-identical to the source, covering no JavaScript, undecided, reject and allow preferences at 390/1440. Both current download links and the older download route tested; PDF response 200 / application/pdf verified; **zero POSTs or external requests** in this resource suite |
| Guide/SEO integrity | No guide form, provider key/action or collection fields. All eleven pages' titles, descriptions, canonicals, robots, OG values and JSON-LD unchanged; internal links/fragments resolve |
| Responsive | Eleven pages at 320/375/390/768/1440: **55 layout cases**, no normal-size horizontal overflow, missing resources or browser script errors |
| Accessibility/keyboard | **22 page axe scans** plus five open-settings width checks with no tested violations; menu/skip link/FAQ, modal focus/withdrawal, and keyboard Enter on the new download link pass |
| Reflow | Equivalent 200%/400% reflow and 200% root-text checks pass, including the retained download header; physical browser/assistive testing remains separate |
| Netlify mock regressions | Required/email validation, optional phone, service/honeypot payload, duplicate/loading/busy state, success/redirect, HTTP/network failure and live error/retry pass with analytics allowed and refused. Native no-JavaScript enquiry fallback passes; no genuine enquiry is sent |
| Service/navigation | 28 desktop/mobile A-Level/MOT link activations, Ctrl/new-tab, invalid parameters and two mocked service payloads pass |
| Privacy script unavailable | Google remains absent and the mocked tuition enquiry still succeeds |
| Analytics | Current consent/version, redaction, rejection/withdrawal, current/legacy-tab signalling, blocked storage and delayed tag cases pass using local test bytes/intercepted responses. Guide has no form or GA even with an allowed preference and campaign query parameters |
| Visual comparison | **20 identical comparisons:** nine unaffected full pages and the unchanged guide cover at 390/1440. Four guide/privacy full-page differences are the intended direct-download/copy change. Header, navigation, photographs and unrelated approved layouts remain intact |
| Export/syntax | Deterministic 36-file output, independent photo guards and legacy exclusion pass; Node syntax and `git diff --check` pass |

The baseline is the working tree immediately before this new instruction. Raw scripts/results, saved test PDFs and before/after captures are in `%TEMP%\human-hull-direct-guide\`; no test dependency is added. This suite validates static/browser behaviour, not future CDN settings or real notification delivery.

### Earlier layout-stability evidence retained

No JavaScript, font, header-loading or image code changed in this task. Cold-load CLS was not remeasured for the direct-download markup/scoped-panel CSS change. The figures below explicitly belong to the preceding analytics-only remediation:

H3 head marker, deferred navigation, preloads and metric-adjusted fallbacks remain unchanged. In the preceding analytics-only follow-up, the consent-loading change was checked in a matched cold-load comparison: **18 before and 18 after runs**. Chromium 149 on Windows, loopback HTTP, cache off, 150ms latency, 1.6384Mbps down/675Kbps up, CPU 4x at all widths, observing through font readiness plus one second. CLS is the largest session window, excluding recent-input shifts. The before version is the already stable two-purpose implementation immediately before this simplification, not the original faulty pre-H3 site. External requests were blocked and neither version had analytics consent.

| Earlier analytics-only case | Before median CLS | Analytics-only median CLS |
| --- | ---: | ---: |
| Home 320 | 0.000000 | 0.000000 |
| Home 375 | 0.000000 | 0.000000 |
| Home 390 | 0.000000 | 0.000000 |
| Home 1440 | 0.000000 | 0.000000 |
| About 390 | 0.000000 | 0.000000 |
| Guide 390 | 0.000000 | 0.000000 |

All three runs matched within each case, with no measured overflow. These are bounded lab results, not field metrics or all-browser certification. Raw observations and source-node shift records are in the preceding `%TEMP%\human-hull-analytics-only\` evidence folder.

For context, the preceding H3 remediation used the same profile and three runs per case, and resolved the original defect as follows:

| Case | Pre-H3 median CLS | Remediated median CLS |
| --- | ---: | ---: |
| Home 320 | 0.197195 | 0.000000 |
| Home 375 | 0.271763 | 0.000000 |
| Home 390 | 0.314429 | 0.000000 |
| Home 1440 | 0.000777 | 0.000000 |
| About 390 | 0.122059 | 0.000000 |
| Guide 390 | 0.139760 | 0.000000 |

Prior artificial 1200ms font delay: 0.198837 to 0.000539; navigation delay: 0.307082 to zero. Small exceptional-delay font movement remains a documented lab limit, not field certification.

M1 previously reduced 200%-root-text download widths from 941/1354/1501 to 768/1024/1440 respectively; 320/375/390 stayed within viewport. Fresh resizing regression still passes. M2 validated service-query preselection remains unchanged and is retested above. Original M3 incomplete schema entities and low-priority audit recommendations are not speculatively altered.

## B. Owner/provider facts still requiring confirmation

**Resolved by this instruction:** whether to collect future guide details, the need for a guide-form lawful basis/mandatory-email justification, and a Web3Forms preview key/domain/redirect arrangement. There is no replacement provider submission to authorise or test.

Still confirm:

1. Approve complete privacy wording and lawful-basis reasoning for tuition enquiries, ordinary hosting/analytics and any retained historical records. A parent's contract is not automatically the basis for every child's detail. No new guide-form basis is needed.
2. Confirm the proposed retention/deletion process for tuition enquiries and historical guide/email/export/consent records, active-student/financial exceptions and provider-controlled logs/backups. No historical deletion, account closure or key revocation has been performed here.
3. Verify Netlify enquiry recipients, account access, actual inbox/forwarding arrangements, and relevant processor/UK-transfer facts. Historical Web3Forms storage/access/retention remains a separate records-management question, not a dependency for new PDF downloads.
4. Verify GA4 retention, enhanced measurement, linked products/data sharing and proportionate consent/version evidence. Existing source-side restrictions are not an account audit. Confirm any appropriate final contact details without inventing a postal address.

The earlier read-only Netlify check confirmed Forms enabled and its deployed enquiry field/honeypot contract. It did not establish notification delivery, recipients or a future preview. No provider account or private record was read/changed in this direct-download task.

## C. Outstanding preview/manual checks

Follow the updated [release checklist](human-hull-final-release-checklist.md): approved privacy wording/settings, reviewed file list and separately authorised Git/PR/photo-flag/preview steps still precede publication.

- Check the actual preview artifact, noindex/access policy, PDF MIME/availability, current and older guide URLs, resource exclusions and legacy-image 404. Download/save/open on physical mobile and browsers, with no JavaScript and no analytics consent.
- With separate authorisation only, verify genuine Netlify enquiry record/notification/reply-to/thank-you behaviour and GA ingestion/counts where consent permits it. No Web3Forms guide submission, email delivery or production-versus-preview redirect test is required for the new direct flow.
- Complete Safari/Firefox/Chromium, physical iPhone/Android, screen-reader/speech/forced-colour and actual zoom/text-size smoke tests. The unchanged PDF is not newly accessibility-certified. No field CWV/INP or blanket WCAG claim follows from these lab checks.

## D. Verdict and changed files

**CONDITIONAL GO for local review; NO-GO for public release until the remaining notice/account and authorised release checks are complete.** The former future guide-form necessity and provider-redirect blockers are removed. No redesign or blog/advice work is needed for this change.

Changed in this task:

- `year-11-parent-guide/index.html`: replace the form/provider configuration with direct PDF links, truthful supporting copy and a reusable download panel; retain section anchor, SEO and all other guide content.
- `styles.css`: minimal guide-panel selectors sharing the existing approved border/padding/button treatment, scoped to this component; no optional refactor.
- `privacy/index.html`: describe form-free future downloads and separate historical records/hosting metadata; existing SEO untouched.
- This report, `docs/human-hull-retention-procedure.md`, `docs/human-hull-privacy-owner-review.md`, `docs/human-hull-final-release-checklist.md` and a superseding note in `docs/human-hull-attribution-proposal.md`.
- Eight local review PNGs in `docs/visual-review/direct-guide/`.

All application JavaScript, homepage/other service pages, old download route, PDF/images/fonts, hosting/indexing configuration and photo guards remain byte-identical to this task's starting snapshot. The existing broad redesign remains uncommitted and preserved.

Local preview: `node scripts/prepare-public.mjs --local-preview`, then <http://127.0.0.1:8766/year-11-parent-guide/>. The older URL <http://127.0.0.1:8766/year-11-parent-guide/download/> still works. Stop for review; no release action is authorised by this report.
