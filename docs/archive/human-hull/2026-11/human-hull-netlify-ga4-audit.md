# Human / Hull — Netlify and GA4 pre-launch account audit

19 November 2026 · `feature/human-hull-redesign` · read-only inspection.

## 1. Executive summary

**Hold creation of the deploy preview pending the owner actions below. Public release remains NO-GO.** The correct Netlify project, production repository/branch, enquiry form and intended notification recipient are verified in the account. The GA4 account, property and stream match the website. This does **not** establish notification delivery, final privacy approval or the remaining GA4 account settings.

**ISSUE FOUND:** Netlify displays an overdue-payment/service-interruption warning. Its only listed team owner has **“No 2FA”** in the Netlify member view, and team MFA enforcement is not enabled. Preview visibility is **Public**. None of these settings was changed.

**ISSUE FOUND:** Netlify's dashboard still has no build command and publishes `.`. The local candidate declares the safe packaging command and `public` directory in `netlify.toml`, but that file is currently untracked and is not in the deployed production commit. The candidate must include it and the packaging script before an authorised build. File configuration takes precedence when present; the dashboard values alone do not prove a correctly packaged candidate. See [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

Read the existing [release-readiness report](human-hull-release-readiness.md) alongside this supplement. No website/configuration edits, account-setting changes, submissions, analytics test events, builds, photo flags, commits, pushes, merges or deployments were performed. Only this report was added.

Evidence: authenticated Netlify connector metadata and native dashboard views; authenticated GA4 dashboard views; current source; a TLS-validated, non-executing GET of the production homepage; existing local export inspection. No submission API or submission-detail record was opened. Netlify's project overview unexpectedly displayed an enquiry preview; inspection moved to configuration and that content was excluded from the audit and this report. No historical enquiry contents are reproduced.

The desktop capture helper later failed twice with `window crop is outside captured monitor`. Dashboard inspection stopped. Settings not reached are explicitly unverified below; source code is never used as evidence of their account-side values.

## 2. Netlify project and deployment settings

| Setting | Status and observed value |
| --- | --- |
| Project / site ID | **VERIFIED IN ACCOUNT:** `hull-maths-tutor` / `ae79c6d9-5c00-4e01-af23-1e929e9f27d2` |
| Team | **VERIFIED IN ACCOUNT:** Aesthetic Flow (`ajhedjazi`); dashboard plan label Personal |
| Connected repository | **VERIFIED IN ACCOUNT:** `github.com/ajhedjazi/hull-maths-tutor` |
| Production branch | **VERIFIED IN ACCOUNT:** `main`; the local feature branch is not production |
| Current published production | **VERIFIED IN ACCOUNT:** ready deploy `6af68c8e755e6efbf16acfbc`, commit `be72d0bf8d535aee5fb2e60d2b4ff41fc32cc444`, published 13 November 2026 |
| Dashboard build settings | **VERIFIED IN ACCOUNT:** base `/`, build command Not set, publish `.`, package directory Not set, functions directory `netlify/functions`, Node 24; builds Active; build logs public |
| Candidate build settings | **VERIFIED IN SOURCE:** [netlify.toml](../netlify.toml:1) declares `node scripts/prepare-public.mjs` and `public`. These are not verified deployed settings |
| Candidate package boundary | **VERIFIED IN SOURCE:** [prepare-public.mjs](../scripts/prepare-public.mjs:27) copies an explicit website allowlist; excludes docs/reference files and the retired learner JPEG. No build executed in this audit |
| Custom domains | **VERIFIED IN ACCOUNT:** `hullmathstutor.co.uk` primary, `www.hullmathstutor.co.uk` redirects to primary; Netlify subdomain `hull-maths-tutor.netlify.app`; Netlify DNS shown |
| HTTPS | **VERIFIED IN ACCOUNT:** Let's Encrypt enabled for the apex/wildcard. Independent HTTPS GET returned 200, Netlify server header and HSTS `max-age=31536000`, with default certificate validation enabled. This GET executed no website JavaScript |
| Deploy Previews | **VERIFIED IN ACCOUNT:** any pull request targeting production/branch-deploy branches; untrusted deploys require approval. **No Human / Hull preview was created or verified** |
| Branch deployments | **VERIFIED IN ACCOUNT:** only `feature/live-classroom-m1` and `feature/site-wide-alignment-rails` listed; Human / Hull is not an automatic branch-deploy branch |
| Preview access | **VERIFIED IN ACCOUNT / ISSUE FOUND:** Public. A preview URL or noindex directive does not provide private access. An owner-approved visibility/access decision is needed before publishing a draft preview |
| Deploy controls | **VERIFIED IN ACCOUNT:** Git/API/CLI/MCP deployment methods allowed; no build hook listed. Opening a PR/pushing can start configured builds; do not treat that as a harmless preparatory step |
| Billing | **ISSUE FOUND:** team overdue-payment warning says service may be interrupted. Live homepage still returned 200. No payment details inspected; no interruption date inferred |

**VERIFIED IN SOURCE:** separate homepage and About-photo checks remain at [prepare-public.mjs](../scripts/prepare-public.mjs:12) and [line 19](../scripts/prepare-public.mjs:19). Both permissions are owner-confirmed in the release documentation. Neither `HMT_PHOTO_USAGE_APPROVED` nor `HMT_ABOUT_PHOTO_USAGE_APPROVED` was enabled or bypassed. Hosting environment values were not retrieved. Publishing either photo still requires the separately authorised release step. The legacy learner JPEG remains excluded by source; no new public output was generated.

**UNVERIFIED — MANUAL CHECK REQUIRED:** the future preview's resolved build settings, deploy context, artifact contents, protection/noindex response, form detection, PDF MIME type and routes. A candidate build must fail safely without the separately authorised photo flags, never fall back to publishing the repository root.

## 3. Form detection and notification recipients

| Setting | Status and evidence |
| --- | --- |
| Detection / registration | **VERIFIED IN ACCOUNT:** Forms enabled, detection enabled, one collecting form; `enquiry`, ID `6aca5d824f8e25000888aa23` |
| Recognised fields | **VERIFIED IN ACCOUNT:** `bot-field`, `name` (text), `email` (email), `phone` (tel), `service` (select), `message` (textarea) |
| Spam controls | **VERIFIED IN ACCOUNT:** honeypot enabled, reCAPTCHA false. **UNVERIFIED — MANUAL CHECK REQUIRED:** real classification/storage outcome; no spam/verified submission contents inspected |
| Notification | **VERIFIED IN ACCOUNT:** Forms → Submission notifications shows one entry: email `mathstutoringhull@gmail.com` on new submission from `enquiry`. No pending-confirmation or disabled marker visible |
| Additional destinations | **VERIFIED IN ACCOUNT:** no second email/webhook entry visible on that notification page. **UNVERIFIED — MANUAL CHECK REQUIRED:** expanded notification details/CCs, email forwarding and integrations outside that listing |
| Actual delivery / reply-to | **UNVERIFIED — MANUAL CHECK REQUIRED:** inbox receipt, spam-folder placement, reply-to, saved record and timing. No email or genuine enquiry sent |

Netlify documents notifications for verified submissions and recipient-confirmation requirements for external addresses. Do not recreate the notification or add the business address as a team member merely because delivery is untested. Configuration is present; a separately authorised hosted test is what remains. See [form notifications](https://docs.netlify.com/manage/forms/notifications/) and [spam handling](https://docs.netlify.com/manage/forms/spam-filters/).

**VERIFIED IN SOURCE:** the current tuition contract at [index.html](../index.html:98) retains `name="enquiry"`, `data-netlify="true"`, hidden `form-name=enquiry`, honeypot `bot-field`, POST method and native action `/thank-you/`. Name, valid email and message are required; phone is optional. Services remain GCSE Maths, A-Level Maths, Functional Skills Maths, Maths MOT and Not sure yet. The honeypot is excluded from keyboard navigation and visually hidden.

**VERIFIED IN SOURCE:** [script.js](../script.js:383) preserves validation, duplicate-submit/loading protection, URL-encoded AJAX POST to `/`, all form fields, non-2xx failure handling, retry feedback in a polite live region and successful redirect to `/thank-you/`. `generate_lead` occurs only after an HTTP success response, subject to analytics opt-in. That response is **not independent proof** that a non-spam record was stored or a notification delivered. Without JavaScript, the native form posts to `/thank-you/` for Netlify processing; future preview handling remains untested.

**VERIFIED IN SOURCE:** [navigation.js](../navigation.js:10) retains the whitelist-based A-Level/Maths MOT query preselection. The guide has no form or Web3Forms integration and links directly to the existing PDF; its older `/year-11-parent-guide/download/` route remains.

## 4. Netlify access and retention

| Setting | Status and observed value |
| --- | --- |
| Listed members | **VERIFIED IN ACCOUNT:** team Members lists one member, Amir Hedjazi, Owner, all projects; zero reviewers. Project member view agrees. No unexpected listed collaborator observed |
| Saved submission access | **VERIFIED IN ACCOUNT:** the owner has project access. **UNVERIFIED — MANUAL CHECK REQUIRED:** all effective access via applications/tokens/export destinations/provider support; the member list is not a complete downstream-access audit |
| Account protection | **ISSUE FOUND:** owner row says “No 2FA”; API reports team MFA not enforced. GitHub/Google identity-provider MFA was not inspected and must not be inferred |
| Retention | **UNVERIFIED — MANUAL CHECK REQUIRED:** form-submission automatic deletion/plan controls, backup expiry and provider logs. The observed **90-day deploy-artifact deletion is not form retention** |
| Deletion process | **VERIFIED IN SOURCE:** [proposed procedure](../../../maintenance/retention-procedure.md) separates Netlify, historical Web3Forms, email, exports and exceptions. **UNVERIFIED — MANUAL CHECK REQUIRED:** owner can operate it and provider-controlled copies are accurately described |
| Export integrations | **UNVERIFIED — MANUAL CHECK REQUIRED:** full installed-app/build-plugin inventory, tokens, Slack/Zapier/n8n or other forwarding. No extra destination appeared in the inspected form notification list; that does not prove no integration exists |

Netlify supports deleting individual submissions; that is not evidence that this account automatically applies a 12-month limit. No deletion controls were activated and no record was deleted. See [submission management](https://docs.netlify.com/manage/forms/submissions/). The owner should address Netlify-native protection and check their sign-in provider separately; see [user security settings](https://docs.netlify.com/manage/accounts-and-billing/user-settings/) and [team MFA](https://docs.netlify.com/manage/security/secure-netlify-access/enforce-2fa/).

## 5. GA4 website implementation

The following findings concern the **local candidate**, not proof that the old production deploy or a future preview runs these bytes.

| Check | Status and evidence |
| --- | --- |
| ID / loader | **VERIFIED IN SOURCE:** [privacy.js](../privacy.js:3) uses `G-FTB362ESXH`; one guarded initialisation per document. No second loader/configuration found in current public source |
| Before opt-in | **VERIFIED IN SOURCE:** Google script insertion and event calls require an explicit current `allow` cookie and an analytics-enabled page. No Google tag, analytics queue or denied-consent ping is created before opt-in |
| Choice / repeat visits | **VERIFIED IN SOURCE:** `hmt_analytics_v3` first-party session cookie, Lax and Secure on HTTPS; only exact `allow` authorises. Old v1/v2/unknown choices do not migrate. Blocked preference storage fails closed. Browser session restoration can preserve session cookies; no fixed lifetime promised |
| Withdrawal | **VERIFIED IN SOURCE:** disables future GA collection using the measurement opt-out flag, clears known writable GA cookies and synchronises current tabs via BroadcastChannel/pageshow/visibility checks. Cannot recall already queued/in-flight data or erase Google history |
| Advertising restrictions | **VERIFIED IN SOURCE:** advertising storage/user-data/personalisation denied; Google Signals and ad-personalisation signals disabled in tag configuration; URL passthrough off. These are not verification of corresponding account controls |
| Page/referrer minimisation | **VERIFIED IN SOURCE:** configured page URL omits query/hash; configured referrer reduced to origin; GA cookies requested as session-based. This does not certify every remotely configured enhanced event or eliminate ordinary network information |
| Explicit event payloads | **VERIFIED IN SOURCE:** four event-name allowlist and four parameter-key allowlist; current callers send fixed labels/path values, not enquiry contents. No contact-form name/email/phone/message payload found in explicit GA calls |
| Duplicate events | **VERIFIED IN SOURCE:** no manual second `page_view`, second GA loader or history push/replace call found. **UNVERIFIED — MANUAL CHECK REQUIRED:** actual ingestion/counting and any remaining remote tag settings |
| Essential functionality | **VERIFIED IN SOURCE:** enquiry processing does not require analytics permission; guide/download links are native PDF links. No local/session-storage tracking or form-content persistence found |
| Page coverage | **VERIFIED IN SOURCE:** all eleven main pages load privacy controls once; seven tuition pages enable analytics. Guide, older download, thank-you and privacy pages have no analytics-enabling attribute and do not load GA even when allowed |

Existing events are preserved at [script.js](../script.js:36): `phone_click` on telephone links; `whatsapp_click` on WhatsApp links; `maths_mot_click` on matching Maths MOT links; [generate_lead](../script.js:455) after successful enquiry response. Rejected/absent consent suppresses those events, not the underlying action. No new guide-download event or individual campaign attribution was added.

**Prior local test evidence, not tests performed in this account audit:** the preceding direct-guide suite recorded nine mocked enquiry checks with analytics allowed and nine refused, eleven isolated analytics checks and 24 byte-matched native PDF downloads (no JavaScript/undecided/reject/allow at 390/1440). Relevant scripts/form/packager/old-download files still match that evidence byte-for-byte. Analytics collection was intercepted there; these results do not establish Google ingestion or Netlify delivery. Current source and existing export were read, not rebuilt; 19 exported text files received a bounded secret-pattern scan with zero findings. This is not a comprehensive security certification.

**UNVERIFIED — MANUAL CHECK REQUIRED:** fresh hosted network behaviour, withdrawal and repeat-session behaviour in the actual preview, physical browsers, successful processing/email delivery and Google event counts. No live analytics test event or form submission was triggered during this audit.

## 6. GA4 property/account settings

| Setting | Status and actual account evidence |
| --- | --- |
| Account | **VERIFIED IN ACCOUNT:** Hull Maths Tutor, `405931259` |
| Property | **VERIFIED IN ACCOUNT:** Hull Maths Tutor, `551503422` |
| Web stream | **VERIFIED IN ACCOUNT:** Hull Maths Tutor Website, `15495162893`, `https://hullmathstutor.co.uk`, `G-FTB362ESXH` |
| Receiving data | **VERIFIED IN ACCOUNT:** active in past 48 hours. Existing traffic only; no test event sent and no attribution to the local candidate inferred |
| Enhanced measurement | **VERIFIED IN ACCOUNT:** enabled; all seven options active: page views, scrolls, outbound clicks, site search, video engagement, file downloads, form interactions |
| Page-view detail | **VERIFIED IN ACCOUNT:** page loads and browser-history changes checked. Static-source inspection found no history push/replace call; the setting alone is not evidence of duplicate views |
| Data redaction | **VERIFIED IN ACCOUNT:** email active; URL-query-parameter-key redaction inactive. This is additional filtering, not proof that all personal information is excluded |
| Connected site tags | **VERIFIED IN ACCOUNT:** zero connected |
| Custom creation / modification | **VERIFIED IN ACCOUNT:** “No custom events yet” and “No modifications yet” in the respective lists; no creation/modification rule seen |
| Retention / reset on activity | **UNVERIFIED — MANUAL CHECK REQUIRED:** actual period and reset setting were not reached |
| Google Signals | **UNVERIFIED — MANUAL CHECK REQUIRED:** account collection/region settings were not reached; client-side false is a separate finding |
| Advertising personalisation / user-provided data | **UNVERIFIED — MANUAL CHECK REQUIRED:** account controls and regional settings were not reached |
| Google Ads / other product links | **UNVERIFIED — MANUAL CHECK REQUIRED:** actual linked products, destinations and exports, including BigQuery, not inspected |
| Account data sharing | **UNVERIFIED — MANUAL CHECK REQUIRED:** actual sharing checkboxes not inspected |
| Internal traffic | **UNVERIFIED — MANUAL CHECK REQUIRED:** defined traffic rules and data-filter states not inspected |
| Developer/test traffic | **UNVERIFIED — MANUAL CHECK REQUIRED:** filter presence/state not inspected |
| Unwanted referrals / cross-domain | **UNVERIFIED — MANUAL CHECK REQUIRED:** tag settings not reached. A help link opened instead and was closed; no value inferred |
| `generate_lead` key event | **UNVERIFIED — MANUAL CHECK REQUIRED:** key-event designation/counting method not reached; emitting the event does not establish that designation |
| Account/property permissions | **UNVERIFIED — MANUAL CHECK REQUIRED:** authenticated access worked, but role lists/inheritance not inspected. No claim of sole ownership or absence of unexpected editors |

**Account review concern, not a proven data leak:** automatic form interactions can produce `form_submit` independently of successful Netlify processing. Do not use it as a substitute for `generate_lead`. Site-search measurement can examine query parameters even though the site's explicit page-location configuration is minimised. Confirm that only necessary, disclosed measurement is retained and inspect generated parameters in a separately authorised, interception-only test. No evidence here establishes that enquiry text was sent to Google. See [enhanced measurement](https://support.google.com/analytics/answer/9216061).

## 7. Privacy consistency

**VERIFIED IN SOURCE:** [the notice](../privacy/index.html:32) remains an owner-review draft. It correctly separates optional analytics from tuition enquiries, describes direct form-free PDF downloads and historical Web3Forms records, acknowledges hosting/network data, and makes the 12-month/90-day schedules conditional on workable deletion. It does not rely on a statistical-purpose exemption or claim UK-only hosting.

**ISSUE FOUND — publication wording still needs review:** the draft says the actual Netlify recipient remains unverified. This audit now verifies the configured recipient, but delivery, email forwarding, additional copies and provider arrangements remain unverified. Update that distinction when the owner authorises final notice changes; no website text was edited in this read-only task.

The owner must answer these questions before approving publication:

- Do you approve the proposed lawful-basis reasoning for tuition enquiries, third-party/child information and retained historical records, and the final contact details? Sole-trader identity and the business email are already confirmed; no invented postal address is needed.
- Can you implement the proposed 12-month unsuccessful-enquiry and 90-day historical-guide schedules across Netlify, historical Web3Forms, Gmail, exports and recoverable copies? Who performs each review, and what separate active-student/financial exceptions apply?
- Which inboxes, forwarding rules, mail clients, connected applications and exports actually receive or retain enquiries/historical guide records? The configured Netlify recipient is established; downstream arrangements are not.
- What retention, backups/logs, processor terms and relevant UK international-transfer safeguards apply to these particular Netlify, Google/email and historical Web3Forms accounts? No account-specific transfer assessment was established here.
- What are the actual GA4 retention/reset, sharing, Signals/advertising, user-provided-data and linked-product settings, and which necessary settings do you approve disclosing? Do not substitute a cookie lifetime for Google's server retention.
- What proportionate evidence/process will document analytics consent and changes? The current session choice is a technical control, not an independently verified consent-recordkeeping policy.

The earlier individual guide-attribution decision is superseded: there is no new guide form, mailing subscription, campaign field or Web3Forms request to approve. Historical records remain untouched. No new guide-form lawful-basis or provider-redirect test is required.

## 8. Verified facts

- **VERIFIED IN ACCOUNT:** correct project/domain/HTTPS, GitHub repository, main production commit, active registered enquiry fields/honeypot, configured intended email, one listed Netlify owner, current public preview policy, and the observed billing/2FA issues.
- **VERIFIED IN ACCOUNT:** matching GA4 identity, enabled enhanced measurements, email redaction, zero connected site tags and no custom-event creation/modification rules.
- **VERIFIED IN SOURCE:** preserved enquiry contract/event names, opt-in gating and withdrawal code, direct guide PDF/older route, isolated packaging boundary and independent photo guards.
- **VERIFIED IN SOURCE:** final SHA-256 comparison of all 22 initially captured source/config/generated-entry files found **zero changes**. All local report links resolve, all twelve requested sections are present, and `git diff --check` found no whitespace errors (Git emitted existing LF/CRLF conversion warnings). Prior regression evidence is explicitly historical, not re-labelled as new tests.

Safe local notes and the initial hashes are under `%TEMP%\human-hull-account-audit\`. Dashboard tables were read directly; no customer-data screenshots or raw deployment payloads/tokens are included in this report.

## 9. Unverified account facts

**UNVERIFIED — MANUAL CHECK REQUIRED:** actual notification delivery/reply-to; expanded notification recipients/CCs; mail forwarding; comprehensive app/token/export access; form retention/backups and deletion operation; GA4 retention, collection/advertising/sharing, product links, traffic filters, tag domains/referrals, key-event flag and all effective account/property access; provider/transfer facts; future preview artifact and real provider handling.

These are unknowns, not failed tests or evidence that the settings are wrong. Netlify billing and its displayed native 2FA status are observed issues. The root publish default and public preview policy are observed release risks requiring explicit handling.

## 10. Exact owner-facing dashboard instructions

Use the existing project/property, not a new account. Inspect first; any setting change or hosted submission/event test is outside this audit's authorisation.

| Priority | Where to go | What to establish |
| --- | --- | --- |
| Before preview | Netlify → Aesthetic Flow → Usage & billing; follow the overdue-payment warning | Resolve/confirm good standing and availability; no payment/card values belong in the repo |
| Before preview | Netlify avatar → User settings → Security → Two-factor authentication; separately Aesthetic Flow → Team settings → Members | Secure the owner login, confirm recovery access privately and check GitHub sign-in protection. Only Amir should have the intended Owner/all-projects role unless you recognise another authorised person |
| Before preview | Netlify → `hull-maths-tutor` → Project configuration → Developer settings → Continuous deployment → Build settings; then Branches and deploy contexts | Candidate includes TOML/packager/assets. Resolved build must use `node scripts/prepare-public.mjs` and `public`; never root. Confirm intended PR/context and avoid pushing/opening a PR before build/photo authorisation |
| Before preview | Same project → Project configuration → General → Visibility / site protection | Confirm the presently Public preview policy is acceptable or arrange supported protection separately. Verify who can open the eventual preview; noindex is not a password. See [Netlify access protection](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/) |
| Before hosted form test | [Project → Forms → Submission notifications](https://app.netlify.com/projects/hull-maths-tutor/forms?tab=notifications) → existing `enquiry` email notification → Options/edit details, without saving unnecessary changes | Confirm only intended recipients/CCs, no pending confirmation and no webhook destinations. Then Gmail → Settings → See all settings → Forwarding and POP/IMAP, and Filters and Blocked Addresses: identify forwarding rules without sharing messages |
| Privacy sign-off | Project configuration → Integrations/installed extensions; team → Applications/connected apps; Forms → Submission notifications | Identify every submission export/forwarding integration and who owns its destination. Interface labels may vary; do not confuse the build-plugin catalogue with installed plugins |
| Privacy sign-off | Netlify → Forms → `enquiry` → submission management, performed by the owner privately; provider support/terms for backup/log limits | Confirm individual deletion is operable and record whether automatic retention exists on this plan. Do not delete the form. Review historical Web3Forms/email/export copies separately |
| GA4 privacy sign-off | Analytics → Admin → select account `405931259`, property `551503422` → Data collection and modification → Data retention | Record actual user/event periods and reset-on-new-activity state; decide/disclose suitable values, rather than assuming 2 or 14 months. Aggregated reports are a separate scope: [Google retention guidance](https://support.google.com/analytics/answer/7667196) |
| GA4 privacy sign-off | Admin → Data collection and modification → Data collection | Record Google Signals, regional collection, advanced advertising-personalisation and user-provided-data settings. Labels can differ with Google's 2026 rollout; source-side denial does not establish account-side values. See [Signals controls](https://support.google.com/analytics/answer/9445345) |
| GA4 privacy sign-off | Admin → Account → Account details → Data sharing settings | Record each actual sharing checkbox; justify permitted sharing. [Google sharing settings](https://support.google.com/analytics/answer/1011397) |
| GA4 privacy/access sign-off | Admin → Product links → Google Ads links, BigQuery links, Search Console links and each other populated product-link table | Record links/exports and authorised users/purposes; do not assume all tables empty or create links |
| GA4 privacy/access sign-off | Admin → Account → Account access management; Property → Property access management | Check direct and inherited users/groups/service accounts, roles and restrictions; recognise every administrator/editor. Report roles privately, not personal email lists in Git. [Google access management](https://support.google.com/analytics/answer/9305587) |
| Before analytics validation | Admin → Data collection and modification → Data streams → Hull Maths Tutor Website → Configure tag settings → Show all → Configure your domains / Define internal traffic / List unwanted referrals | Record cross-domain entries, internal-rule presence and referrals. Keep IP values private. Check other destinations/automatic collection rules. Do not change these merely to satisfy an audit checkbox. [Google tag settings](https://support.google.com/analytics/answer/12131703) |
| Before analytics validation | Admin → Data collection and modification → Data filters | Record internal and developer filters and each Testing/Active/Inactive state; account for preview/test traffic. Active exclusions affect incoming data, so do not toggle casually. [Google filter guidance](https://support.google.com/analytics/answer/13296761) |
| Before analytics validation | Admin → Data display → Events → Key events | Is `generate_lead` marked as a key event, with the intended counting method? Do not mark generic `form_submit` as a successful enquiry. Preserve the four existing event names. [Key events](https://support.google.com/analytics/answer/13128484) |

After a **separately authorised** preview exists, inspect its build log and published artifact, form detection and routing first. Only with separate permission conduct one clearly labelled owner-controlled hosted enquiry and confirm record, inbox/reply-to and thank-you result. No such test is authorised or performed by this report. Keep customer details and secrets out of screenshots/logs. Analytics network validation should initially block collection; actual GA ingestion requires its own permission and valid opt-in.

## 11. Remaining release blockers

1. **ISSUE FOUND:** overdue Netlify payment warning and displayed absence of native 2FA need owner resolution/verification. No service suspension or compromise is asserted.
2. **ISSUE FOUND:** public preview access and legacy dashboard root publishing require a concrete approved preview/build plan. Include the untracked candidate config/packager in the reviewed file set; do not publish source/docs/reference material.
3. **UNVERIFIED — MANUAL CHECK REQUIRED:** remaining GA4 account-side privacy/access controls and processor/retention facts. Finish these checks and owner notice approval before publication; current draft is explicitly not approved.
4. **UNVERIFIED — MANUAL CHECK REQUIRED:** owner-operated retention/deletion across stored records and email/exports. No automatic 12-month/90-day enforcement was verified.
5. **UNVERIFIED — MANUAL CHECK REQUIRED:** actual hosted enquiry processing/notification delivery and preview artifact checks. These are post-preview validation gates, not evidence of a broken configured notification.
6. **VERIFIED IN SOURCE:** photo permission checks remain independent. Permissions are owner-confirmed, but activating either publication flag and the Git/PR/build/release steps still need separate authorisation. No permission gap for the two new images is asserted; the excluded legacy learner image is not presumed cleared.

## 12. Recommended next step

Complete the priority owner/account checks and approve the final privacy facts; review the exact candidate file set and preview access/build plan. Then authorise the controlled preview steps separately, retaining both photo gates. Validate the hosted artifact and essential form delivery before considering production release. No redesign or optional tracking/SEO work is needed.

### Owner checklist

1. Resolve Netlify's billing warning, secure the owner login and confirm recovery/sign-in access.
2. Approve preview visibility and the `public` packaging plan; retain both independent photo gates and separately authorise any Git/PR/build actions.
3. Check notification details, Gmail forwarding, connected exports and who can access saved submissions; the intended Netlify recipient is already verified.
4. Complete the GA4 retention, sharing/advertising, links, filters, key-event and access checks in section 10; record actual values.
5. Confirm deletion responsibilities/provider arrangements and approve the final privacy wording, including historical guide records.
6. After separate preview/test authorisation, verify artifact isolation and a controlled enquiry's stored record/inbox/reply-to; do not infer delivery from local mocks or configuration.
