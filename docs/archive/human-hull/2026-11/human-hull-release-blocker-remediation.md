# Human / Hull release-blocker remediation

> **Historical first remediation pass.** The owner has since confirmed commercial-use permission for both new photographs; M1/M2 are now fixed and privacy choices are granular. See the [current release-readiness report](human-hull-release-readiness.md) for current status, remaining privacy decisions and the independent legacy learner-image issue. Earlier outstanding-status statements below describe this pass's original state. Publication flags remain disabled by the workflow.

19 November 2026. Local work on `feature/human-hull-redesign`, following a full reading of `human-hull-final-audit.md`.

**Technical consent controls and the reproduced cold-load defect are resolved in local testing. Public release remains NO-GO:** photographic permissions, owner-confirmed privacy information and authorised live release checks are still outstanding. The privacy notice is explicitly a local review draft, not a representation that unknown legal/business facts have been verified.

No commit, push, merge, deployment, real enquiry or external analytics collection event was performed. Neither photograph was published or cleared. No new dependency, framework or unrelated design change was introduced.

## 1. Findings resolved

### H2: default-off optional measurement and accessible controls

The old unconditional Google loader in `script.js` has been replaced by the consent-gated `privacy.js` service. The measurement ID remains **G-FTB362ESXH**. Existing event names remain `generate_lead`, `phone_click`, `whatsapp_click` and `maths_mot_click`.

The chosen implementation is explicit opt-in consent, with Google's **basic** loading model: no Google tag, measurement queue, consent-status ping or analytics event before acceptance. Merely loading a tag with denied consent can still produce cookieless measurements in advanced mode; that model is not used. See [Google's basic/advanced explanation](https://developers.google.com/tag-platform/security/concepts/consent-mode).

Footer links provide the privacy notice and Analytics settings on every content/confirmation page. The settings link works as a notice-section link without JavaScript and becomes an accessible dialog control when enhanced. There is no automatic overlay interrupting the approved pages. Until a visitor actively chooses Allow analytics, optional measurement stays off.

The dialog gives equally styled Allow/Reject choices, no preselected option, initial heading focus, native modal keyboard containment, Escape handling and focus return. It explains both Google Analytics and consent-gated guide campaign attribution. Refusal does not prevent enquiries, downloads or normal browsing. This follows the [ICO's current consent-mechanism guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/?search=iss).

Implementation details:

- A first-party **session** cookie, `hmt_analytics_v1`, remembers only allow/reject; it does not contain a visitor identifier. Browser session restoration can affect its lifetime. No fixed business-record retention period has been invented.
- Google identifier cookies are requested as session cookies using `cookie_expires: 0`, verified against a locally executed copy of the real tag. This does **not** establish Google's server-side retention. [Google documents that cookie setting separately](https://developers.google.com/tag-platform/security/guides/customize-cookies).
- Advertising storage, advertising user data and advertising personalisation default to denied. Google signals/ad-personalisation signals are disabled, advertising data redaction is enabled and URL passthrough is disabled.
- Configured page URLs omit query strings/fragments; configured referrers use the origin only. The app event API accepts only the existing event names and their existing non-personal parameter keys. It does not queue declined interactions for later replay.
- Withdrawal sets Google's documented disable flag, clears this site's two known GA cookies, synchronises other open tabs and leaves unfinished form text intact. It does not reload the page. [Google documents the opt-out flag](https://developers.google.com/tag-platform/security/guides/privacy).
- Already collected/queued consented hits can finish after a choice change; withdrawal cannot recall in-flight data or erase provider records. Tests separately establish that new collection is suppressed after withdrawal, including withdrawal before the tag download finishes.
- If saving the preference is blocked, analytics remains off and an accessible status message explains why. If the privacy script fails completely, `script.js` still handles enquiries and has no independent Google loader.

### Actual data flows and PECR treatment

The [ICO's final storage/access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/?search=iss), finalised 29 April 2026, was checked during this work. Its [statistical-purpose exception](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) is narrow: aggregate service-improvement statistics, restricted individual-level processing, appropriate provider roles/use restrictions, information and a free objection mechanism. It is not a blanket exemption for installing GA4.

This site's existing visitor identifiers and linked event histories, and the guide's person-linked campaign attribution, do not establish those conditions. No evidence of an aggregate-only provider/retention arrangement was available. **No statistical-purpose exception is relied on for either optional measurement flow.** Both require an affirmative analytics choice in this implementation. The essential preference cookie is used solely to remember that requested privacy choice, not as an analytics identifier.

| Flow verified from source and tests | Handling after remediation | Still unverified |
| --- | --- | --- |
| Page/resource requests to Netlify, including ordinary network metadata | Normal hosting continues independently of analytics choice; fonts remain self-hosted | Hosting log retention and contractual/transfer details |
| GA4 on the seven existing analytics-enabled pages | Tag and events blocked until acceptance; existing names/ID preserved | Account retention, enhanced measurement/data sharing/link settings, processor and transfer arrangements |
| Netlify enquiry: name, email, optional phone, service, message and honeypot | Same fields, validation, URL-encoded AJAX POST to `/`, native POST to `/thank-you/`, statuses and success redirect | Actual notification recipients, inbox retention, live delivery and processor arrangements |
| Web3Forms guide: first name, email, tier, resource details, optional marketing choice | Native provider submission, spam field, existing key and production download redirect preserved | Provider recipients/account controls, notification delivery, retention and transfers |
| Guide UTM source/medium/campaign | Same hidden field names; populated only after analytics consent, blank when declined/no JS, cleared on withdrawal and rechecked at submission | Owner's use/retention of attributable guide records |
| Optional email-updates checkbox | Still unchecked by default; choice recorded independently of analytics | Whether/how emails are sent, mailing provider, suppression/deletion process |
| Email, phone and WhatsApp links | Activated only when the visitor chooses a link; no new embedded tracker | Off-site service/account practices |

The previous guide code read campaign parameters unconditionally and attached them to the requester. That is optional measurement rather than necessary PDF delivery. The [ICO explicitly includes link decoration and navigational tracking](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/?search=iss); storing campaign attribution alongside contact details cannot simply be described as anonymous aggregate statistics. The old inline population code is now handled by the same explicit choice. Form/provider contracts remain intact; campaign values are intentionally absent without consent.

No local storage or session storage is introduced. Browser caching of public files and ordinary requested form delivery are separate from optional analytics. Forms do not require an analytics choice or an extra privacy-agreement checkbox. Their appropriate UK GDPR lawful bases and the business's record handling still require owner confirmation.

### H3: cold-load layout stability

The mobile navigation's initial layout is now established by a tiny inline head marker before CSS paints. The main navigation script remains **deferred**. CSS uses that early state, rather than waiting for the later header class to change height. Without JavaScript the full navigation is available; a failed navigation-script request removes the enhancement marker and exposes the links.

Both existing WOFF2 fonts are preloaded. Measured local Arial/Georgia fallback faces use size/vertical-metric adjustments while those fonts arrive. The fallback faces are restricted to Latin text/punctuation so unsupported arrow glyphs retain their original fallback appearance. Primary Inter/Playfair choices, sizes, weights, image dimensions, portrait crop/corners and settled content layouts remain unchanged.

No loading screen, artificial implementation delay, new height animation, blanket transition suppression or hidden-until-loaded page was introduced. A delayed-navigation test confirms content still paints before that deferred script arrives.

## 2. Files changed

Changed existing implementation files, relative to the start of this remediation:

| File(s) | Purpose |
| --- | --- |
| `script.js` | Remove unconditional Google startup; route existing events through the consent gate. Form-handling logic unchanged |
| `navigation.js` | Work with the early layout marker and retain deferred initialisation, menu/focus and link behaviour |
| `styles.css` | Font fallback metrics and early navigation selectors only |
| `index.html` | Font hints, early marker/deferred navigation, privacy loader, footer links and short enquiry processing notice |
| `about-amir/index.html` | Shared head loading hints/marker and privacy footer/loader |
| `gcse-maths-tutor-hull/index.html` | Same shared integration |
| `gcse-maths-tutor-prices/index.html` | Same shared integration |
| `gcse-grade-4-5-maths-support-hull/index.html` | Same shared integration; established URL retained |
| `functional-skills-maths-tutor-hull/index.html` | Same shared integration |
| `maths-mot-hull/index.html` | Same shared integration |
| `year-11-parent-guide/index.html` | Shared integration, linked processing notice, consent-gated attribution replaces unconditional inline population |
| `year-11-parent-guide/download/index.html` | Font hints and privacy footer/loader; no GA or route changes |
| `thank-you/index.html` | Font hints and privacy footer/loader; no GA or form-result changes |
| `scripts/prepare-public.mjs` | Allowlist the three new privacy assets/page; both photograph guards unchanged |

New implementation files: `privacy.js`, `privacy.css`, `privacy/index.html`. The new notice is related to the blocker, uses the existing system, is clearly marked as a draft, and is `noindex,follow` rather than added to the sitemap.

Review artifacts: this report and [mobile settings](visual-review/release-blockers/privacy-settings-390.png) / [desktop settings](visual-review/release-blockers/privacy-settings-1440.png) screenshots. Existing reference/review files and all photograph/image assets are unchanged.

## 3. Before-and-after measurements

Fresh matched tests compare a saved pre-remediation source snapshot with the implementation. Chromium 149 on Windows; loopback HTTP; cache disabled; 150ms latency, 1.6384Mbps download, 675Kbps upload and 4× CPU slowdown at **all** listed widths, including desktop. Analytics unconsented; external requests blocked. Each case has three cold runs. Observe through font readiness plus one second; compute the maximum layout-shift session window (one-second gap/five-second limit), excluding recent-input shifts.

| Case | Before median CLS | After median CLS |
| --- | ---: | ---: |
| Homepage 320px | 0.197195 | 0.000000 |
| Homepage 375px | 0.271763 | 0.000000 |
| Homepage 390px | 0.314429 | 0.000000 |
| Homepage 1440px | 0.000777 | 0.000000 |
| About Amir 390px | 0.122059 | 0.000000 |
| Parent guide 390px | 0.139760 | 0.000000 |

All three observed runs matched within each case: **18 before and 18 final after runs**. These are reproduced measurements under a controlled CDP profile, not a comparison of unlike Lighthouse scores or real-user Core Web Vitals. No INP or field performance claim is made.

Additional targeted single-run stress tests, on otherwise unthrottled loopback at 390px:

| Artificial resource delay used only in the test | Before CLS | After CLS |
| --- | ---: | ---: |
| WOFF2 responses delayed 1200ms | 0.198837 | 0.000539 |
| Deferred navigation delayed 1200ms | 0.230820 | 0.000000 |

In the final navigation-delay test, first contentful paint occurred at approximately 88ms, despite the 1200ms delayed script. The remedy therefore does not wait for that download to hide movement. The font stress test retains a very small residual shift; metric-matched fallbacks are not identical glyphs. Other operating systems/fonts, real networks and longer sessions remain to be checked.

## 4. Privacy and analytics decisions requiring owner confirmation

The notice truthfully describes verified flows and the implemented controls. It cannot be completed as a publishable legal notice by guessing the following:

1. Legal controller identity/trading status and the appropriate contact/postal address. The public Amir/business email/phone details are known; they do not establish a legal entity/address.
2. The chosen lawful bases for enquiry handling and guide-request administration, and any associated legitimate-interest assessment. No basis is asserted as an established business policy.
3. Actual retention/deletion rules or criteria for Netlify submissions, Web3Forms requests, email copies, marketing/suppression records, hosting logs and Google server records. Session cookies are not a substitute for these decisions.
4. Actual notification recipients, inbox services, account access and any forwarding/integration. Source code cannot establish dashboard-side notification settings. Netlify's [notification documentation](https://docs.netlify.com/manage/forms/notifications/) describes configurable routing; no notification setting was changed.
5. Whether guide marketing is sent manually or through a service; who receives what, how opt-outs are honoured and what is retained to respect them. This repository has a consent checkbox, not an implemented mailing-list automation.
6. Provider contracts/roles, account-specific data sharing, locations and international-transfer safeguards. [Web3Forms publishes its own privacy/retention information](https://web3forms.com/privacy); that does not establish Hull Maths Tutor's own email/account retention practice.
7. GA account retention, linked products, advertising/enhanced-measurement settings and consent evidence/recordkeeping. Client restrictions do not constitute an account/legal audit.

The [ICO right-to-be-informed guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/) requires information including controller, purposes/lawful basis, recipients, retention, rights and relevant transfers. The draft explicitly identifies unknowns rather than inventing periods, recipients or legal assurances. Its draft designation must not be removed until those facts are supplied and the notice is reviewed. **H2's technical gate is fixed; the owner-dependent notice approval remains open.**

The settings are deliberately unobtrusive: there is no first-visit banner forcing a decision. This means analytics remains off for visitors who do not actively opt in. That is expected behaviour, not a reason to track by default.

## 5. Accessibility and functionality results

- **44 page/width checks:** all eleven content/utility pages, including the privacy notice, at 320/375/390/1440. No normal-size horizontal overflow, image distortion, missing local resource, broken local link/fragment or browser script error.
- **22 page axe scans** at 390/1440, plus the open dialog at 320/375/390/1440 and a separate privacy-dialog scan: no tested WCAG A/AA violations. This is not WCAG certification.
- Redesigned-page skip links, mobile menu operation/Escape/focus return and FAQ Enter/Space controls pass. The modal starts at the heading without scrolling it out of view on narrow screens; dismissal returns focus to the caller. Both consent choices are reachable and equally prominent.
- All ten pre-existing pages retain their SEO title, description where present, canonical, robots values and JSON-LD values. The sitemap and verification file remain unchanged. Existing internal href destinations, service text, prices and qualifications are preserved.
- **16 complete-region pixel comparisons:** the six unaffected secondary-page main regions at 390/1440, the homepage before the enquiry section at both widths, and the guide hero at both widths are identical to the saved approved implementation. The new processing notes and privacy footer are intentionally outside those unchanged regions. Full-page screenshots were captured before cropping regions; these are not comparisons limited to the first viewport.
- Netlify mocked empty/invalid-email rejection, optional phone, service selection, honeypot payload, duplicate guard, disabled/loading state, HTML success, HTTP/network failures, polite error status, retry and thank-you redirect pass with analytics **allowed and rejected**.
- Consent allowed: one queued `generate_lead` on success and one intended phone/WhatsApp/MOT event per tested click. Consent rejected: those events stay absent while the same successful enquiries still redirect. Measurement ID/event names are unchanged.
- Web3Forms required fields, optional marketing choice, provider POST contract, production redirect and PDF links remain functional under intercepted requests. UTMs are present after consent and blank after refusal/withdrawal. With JavaScript disabled both forms still use native submission; UTM fields remain blank.
- Blocked cookie storage fails closed with an announced explanation. A failed privacy-script request leaves enquiry submission functional and tracking off. A failed navigation-script request exposes all seven navigation links.
- A locally served copy of the real Google tag verifies session-cookie settings, no Google request before opt-in, one initial config, query redaction, no new collection after withdrawal, cross-tab disabling, and rejection before a pending tag download finishes. Form text survives withdrawal. Already consented/in-flight batches cannot be recalled; tests distinguish those from new collection.

One Google library asset was downloaded as bytes for the isolated test. All browser collection requests were intercepted locally and never delivered to Google. All provider POSTs were mocked. No real enquiry, notification or external collection event was sent.

Tests and raw evidence remain in `%TEMP%\human-hull-remediation\`, including before/after measurement JSON, stress results, allowed/denied form results, privacy traces and full-page visual captures. No test library was added to the site.

Local export is deterministic across two runs: **36 files**, including the privacy page/CSS/script. Documentation, screenshots and `design-reference/` remain excluded. The independent photo-guard code is byte-preserved; public packaging without approvals still fails, and no `public/` output was produced. Neither approval flag was set, even temporarily.

## 6. Remaining release blockers and limitations

**Still blocks public release:**

- Separate homepage and About photograph permissions, plus the audit's legacy learner/OG-image provenance review. Neither new-photo flag establishes rights to legacy imagery.
- Owner-confirmed privacy facts and approval of a complete notice. The current `/privacy/` page is explicitly a local draft; it must not be published in that state.
- Authorised deploy-preview tests of actual Netlify registration/delivery/notifications, Web3Forms key/domain/redirect behaviour and GA ingestion. A queued local event or simulated provider response is not proof of delivery. No GA DebugView/Realtime check was performed.

The audit's non-blocking M1 download-header text-enlargement overflow, M2 cross-page service-selection context loss and M3 undefined schema entities remain deliberately outside this targeted remediation. The 200% root-text test still detects the legacy download-header issue; standard 320px reflow passes. These need a conscious fix/defer decision rather than being silently reported as resolved.

Manual physical-device, Safari/Firefox, screen-reader, speech-input, actual 200%/400% zoom, forced-colour and complete focus/contrast smoke tests remain. Future CSP changes must permit or appropriately authorise the tiny head marker/error recovery; otherwise early-state behaviour needs retesting. Recovery from a genuinely missing navigation file intentionally expands the header to keep links available.

No public packaging guard was bypassed or weakened, and no release step was executed.

## 7. Updated recommendation and local review

**CONDITIONAL GO for local technical review. NO-GO for publication.** H3 and the consent/data-gating part of H2 have passed the targeted local checks without changing the approved design. Privacy content cannot be finalised as an established policy until the owner supplies the missing facts; photographic rights remain a separate business task.

Review the [mobile settings](visual-review/release-blockers/privacy-settings-390.png), [desktop settings](visual-review/release-blockers/privacy-settings-1440.png), and the local [privacy notice](http://127.0.0.1:8766/privacy/). The existing loopback preview uses `.local-preview`; refresh it with:

```powershell
node scripts/prepare-public.mjs --local-preview
```

If a server is not already running, serve only that directory:

```powershell
python -m http.server 8766 --bind 127.0.0.1 --directory .local-preview
```

Stop here for owner review. Committing, pushing, generating a public preview, merging and deploying remain unauthorised.
