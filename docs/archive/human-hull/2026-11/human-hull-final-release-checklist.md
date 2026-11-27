# Human / Hull — final Netlify release checklist

19 November 2026. **Procedure only; no release action has been performed.** Work stays on `feature/human-hull-redesign`. Every approval below is a separate recorded decision, not implied permission from this checklist. Keep the approved design, routes and both independent photo guards.

## 1. Approve the privacy notice

- [ ] Review the actual local `/privacy/` page, the [lawful-basis/LIA and account review](human-hull-privacy-owner-review.md), [retention procedure](../../../maintenance/retention-procedure.md) and [approved attribution-removal decision](human-hull-attribution-proposal.md). The local simplification is approved; it is no longer an unanswered owner choice.
- [ ] Confirm the direct-download disclosure, tuition enquiry/hosting facts, historical-record handling, recipients, provider/transfer facts, deletion arrangements and consent evidence. The owner has removed future guide-form collection; that necessity question no longer blocks the resource workflow. Adopt the final lawful bases and public retention wording. Record Amir's approval/version/date; only then replace the draft/unknown wording. No residential address or legal certification is invented.

## 2. Verify provider settings and retention

- [ ] Complete the owner/account checklist with dated evidence: Netlify notification/access settings; historical Web3Forms storage, recipients/copies and deletion controls; actual mail/forwarding; GA4 retention, enhanced measurement, Ads/product links and data sharing.
- [ ] Confirm there is no guide form/key/endpoint in the candidate. No future guide submission can trigger a mailing-list integration through this resource page. Preserve historical records and consent evidence; do not delete a provider account or its history. Approve and schedule monthly/look-ahead housekeeping; confirm provider backups and a workable earlier Web3Forms deletion route. Do not advertise the proposed limits until this is operable.

## 3. Review the exact intended Git change

- [ ] Verify branch and current `main`/remote baseline without overwriting the working tree. Review `git status --short`, tracked diffs and required untracked implementation files individually. Do not blindly stage reference PNGs, review captures, temp utilities, generated `public`/`.local-preview`, account evidence or personal data.
- [ ] Re-run relevant local syntax, SEO/link, form/privacy, accessibility/responsive, visual and export checks. Confirm the retired learner JPEG and all documentation/reference files are absent from the candidate export. Resolve/defer original M3/L1–L3 explicitly; no speculative SEO/CSS cleanup is needed for this release.
- [ ] Before authorising a push, inspect Git-connected automatic deployment behaviour. A push/PR may trigger Netlify. Verify builds cannot publish the candidate before the separately authorised preview step; do not assume remote photo flags are unset merely because the local workflow never enabled them. No automatic merge/production publication is acceptable.

## 4. Commit and push only after authorisation

- [ ] Obtain explicit approval for the concrete reviewed file list and commit on `feature/human-hull-redesign`. Check the staged diff and commit contents. Then obtain/record push authorisation and push that feature branch only. Do not merge `main` or alter production as part of this step.

## 5. Open and review the pull request

- [ ] Open the authorised PR against the verified current `main`. Explain the approved redesign, privacy/form changes, remaining preview tests and deployment restrictions. Attach relevant local evidence. Keep merge blocked until the preview/manual checks and final approval are complete.

## 6. Authorise photo-build configuration separately

- [ ] Retain the owner's separate commercial-use confirmations for homepage and About. Confirm the social derivative is within intended use. Do not remove/short-circuit either guard.
- [ ] Only with explicit operator authorisation, configure **both** existing photo approval variables for the intended preview **build** context: `HMT_PHOTO_USAGE_APPROVED` and `HMT_ABOUT_PHOTO_USAGE_APPROVED`. Do not enable them globally or for production by default. A single approved variable must still leave the other independent check enforced. This document does not set either value.

## 7. Build the authorised Netlify Deploy Preview

- [ ] Confirm the build command remains `node scripts/prepare-public.mjs` and publish directory `public`. Never deploy the repository root or `.local-preview`; never use local-preview mode to bypass the public guards.
- [ ] Check the deploy's branch/commit SHA, build result and exact preview URL. Inspect generated paths/asset hashes: required pages, CSS/JS/fonts/PDF and approved-photo variants/social JPEG present; docs, design references, source PNGs, test utilities, README and legacy learner JPEG absent. Request the old learner URL and representative excluded paths on the actual preview; they must not be served or redirected to unrelated content.
- [ ] Inspect detected `enquiry` field names/honeypot and thank-you action for this **deploy**, not just the currently live site. Preserve its established contract.

## 8. Verify preview indexing and access

- [ ] Check the actual `X-Robots-Tag: noindex` response on preview pages. Netlify documents this default for Deploy Previews, not the newest branch deploy; do not treat those types as interchangeable. Leave approved production canonicals intact. See [Netlify preview behaviour](https://docs.netlify.com/deploy/deploy-overview/).
- [ ] Agree appropriate password/team-login protection and verify unauthorised access on the preview URL, using capabilities available on the account. Noindex is not access control. Ensure any access setting is scoped as intended and does not accidentally restrict production. No access configuration was changed locally.

## 9. Authorised real Netlify enquiry test

- [ ] Obtain explicit permission for each genuine provider test and use an owner-approved test inbox/details. Send one clearly labelled legitimate enquiry, omitting the optional phone. Verify one stored record, exact service/fields/honeypot, expected notification recipient/reply-to and the **preview** thank-you destination. Do not use rapid or spam-like test traffic.
- [ ] If authorised, verify native no-JavaScript submission and an agreed spam/error case. Keep destructive/provider deletion tests separate. Mocks do not prove delivery, spam classification or inbox configuration. Agree treatment of the genuine test record under the retention process.

## 10. Direct guide download - no provider submission test

- [ ] Open `/year-11-parent-guide/` on the exact preview. Confirm both prominent Download Free Guide links point to the existing PDF with a native `download` attribute; check the browser-open alternative. There must be no guide form, required name/email/tier fields, Web3Forms key/endpoint or new collection event.
- [ ] Download/save and open the actual PDF with JavaScript disabled, analytics refused, and analytics allowed. Verify the PDF response/MIME/signature and file availability, keyboard focus, touch targets, browser/physical-mobile behaviour and error response if the file cannot be fetched. Do not add a form or analytics gate to perform this check.
- [ ] Visit `/year-11-parent-guide/download/` directly as an older bookmark and verify both existing PDF links and the rest of that route. Confirm retained `#get-guide` section links still resolve on the main guide page. Production canonicals/indexing remain unchanged.
- [ ] **No Web3Forms live submission, preview key, domain or redirect arrangement is required for this new flow.** Earlier instructions to substitute a test key/redirect are superseded. Historical account access/retention is a separate owner task; do not delete records or submit a request to prove a retired integration works.

## 11. GA4 consent and ingestion

- [ ] First refuse analytics: inspect network/storage on cold loads, interaction, successful tuition enquiries and direct guide downloads. No Google tag, consent ping, collection or replayed declined event should occur; essential forms must still work. All old v1/v2 grants must leave the new analytics-only `hmt_analytics_v3` choice off until fresh opt-in. Test blocked storage, unknown v3 values, withdrawal with unfinished form text and absence of any guide form/details and direct download access even when analytics is refused.
- [ ] With separate permission for actual analytics collection, use the agreed test/internal-traffic arrangement and opt in. In GA4 DebugView/Realtime confirm one intended config/page view and the established `phone_click`, `whatsapp_click`, `maths_mot_click` and `generate_lead` paths where implemented. Confirm success/redirect delivery and no lead on failure; review enhanced-measurement form events to avoid misinterpreting duplication. Do not claim a guide/download event exists: those pages currently have no GA configuration.
- [ ] Withdraw through the same settings link, verify new collection stops and known cookies clear; test another open tab. An already in-flight consented request is not recallable. Record account evidence without copying visitor data into Git.

## 12. Browser/mobile/accessibility smoke checks

- [ ] Check 320/375/390/768/1440, a physical iPhone/Android, Safari/Firefox/Chromium and landscape. Test cold/throttled header/font stability, photograph crops, overflow, keyboard menu/skip links/FAQ, focus visibility/return and errors, real text enlargement/200%/400% zoom, NVDA/VoiceOver and forced colours. Compare to approved Human / Hull review captures; do not use these checks to start another redesign.
- [ ] Confirm all established metadata, canonical/robots values, internal/breadcrumb links, prices/qualifications, download/PDF and telephone/email/WhatsApp handoffs. Check actual resource MIME/cache/compression behaviour. No field-performance or WCAG certification follows from a local lab pass.

## 13. Final production approval

- [ ] Resolve preview failures; review the exact final PR/artifact including the absence of any retired guide key/endpoint/form or test-only settings. Record consciously deferred non-blockers. Obtain explicit approval to merge and to launch this commit. Configure the two **production** photo flags only with separate authorisation. Agree how to prevent a merge from publishing ahead of that approval.
- [ ] Record the production deploy ID/SHA and an evaluated rollback target. Check the approved notice/version, direct guide PDF links and old download route, routes/canonicals/indexing, legacy-image 404, forms, consent behaviour and PDF on the live release. No genuine test or account alteration is implied by this checklist.

## 14. Monitoring and rollback

- [ ] After the authorised release, monitor tuition enquiry notifications/errors/spam, guide/PDF availability, consented GA events, missing resources, Search Console and field layout/performance. Agree the owner/operator, review times and escalation route; no specific monitoring period is asserted as existing policy.
- [ ] If a material release regression occurs, stop further automatic publication and contact the owner. With authorisation, use Netlify Deploys to republish the **previously evaluated safe deploy**, record its ID/SHA and repeat the affected lead/privacy/route checks. Do not delete submissions while rolling back static files.
- [ ] Do not blindly restore the old live baseline: it predates consent gating and retirement of the learner photo. If no safe rollback artifact exists, agree a restricted-access response or targeted corrective release retaining privacy/photo protections; do not reintroduce those risks to achieve a cosmetic rollback. Preserve evidence, resolve the fault locally and require approval before redeployment.
