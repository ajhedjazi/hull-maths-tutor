# Parent Guide attribution simplification — approved local decision

19 November 2026. The owner explicitly answered **“Approve the local simplification”** to the concrete proposal below. It is now implemented locally, separately from the previously approved removal of the marketing checkbox. This decision does not approve publication or provider/account changes.

**Subsequent owner decision:** the entire guide form and Web3Forms integration are now removed in favour of a direct PDF download. This supersedes the required name/email/tier and provider-contract preservation bullets below, which record the earlier approved step. The analytics-only choice and no-migration policy remain current. Historical records are untouched. See the [current release-readiness report](human-hull-release-readiness.md).

## Approved change, implemented locally

- Remove the guide's three hidden `UTM Source`, `UTM Medium` and `UTM Campaign` fields and their population/submission handler.
- Remove the separate Guide campaign attribution choice. Keep a single, initially off Website analytics checkbox, equally prominent reject/save actions, withdrawal and the existing accessible dialog.
- Use the analytics-only `hmt_analytics_v3` session preference with `allow`/`reject` values. Treat every obsolete v1/v2 choice, including `campaign`, `both` and `analytics`, as insufficient for this new version. Only a fresh affirmative analytics choice can enable GA4. There is no transfer from campaign consent to analytics consent. Missing/unknown preferences keep analytics off and clear writable known GA cookies.
- Keep the existing GA measurement ID and event names. Preserve URL/referrer redaction and the current seven analytics-enabled pages. Do not add analytics to the guide or download page, invent download events or weaken redaction to obtain campaign reports.
- Preserve the guide's required first name/email/tier, public provider key, native action, spam field, resource/subject fields, production redirect and PDF. Existing notification records and historical consent evidence are untouched.

## Business implications

Future guide notifications will no longer identify which source/medium/campaign produced an individual request. Any provider integration expecting those optional fields needs owner review. Existing analytics on tuition pages can continue after opt-in, but the guide/download pages currently have no GA configuration and query strings are redacted. Exact guide-request or campaign reporting is therefore not promised. Introducing it would require a separately reviewed measurement change.

There is no irreversible provider/data operation in this change. No historical submission, marketing-consent record, account setting or mailing list is deleted or changed. Obsolete cookies are ignored rather than promoted into new permission. The local source change itself is reversible. No launch or publication is authorised.

**Status: owner-approved and implemented locally.** There is now only one optional measurement purpose. Rejection also sends the existing compatible stop message to already-open v2/v3 tabs; a previously loaded old page otherwise needs a refresh to receive the new code. No claim is made that a new script can remotely rewrite an already-loaded document. Current verification and remaining privacy/provider decisions are recorded in the [release-readiness report](human-hull-release-readiness.md).
