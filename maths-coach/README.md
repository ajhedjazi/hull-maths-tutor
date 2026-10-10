# Maths Coach MVP

Reuses the static site and public Supabase configuration in `classroom/config.js`.
Entry point: `/maths-coach/`. No AI output is generated or automatically sent.

## Activate

1. Apply `20261010_math_coach_foundation.sql` if not already applied, followed by
   `20261010_012_coach_mvp.sql` in Supabase using trusted administrative access.
   The existing foundation migration is not rerunnable (its policies are created directly).
2. Add the real deployed `/maths-coach/` URL to Supabase Auth redirect allowlist.
3. Invite accounts using trusted Supabase administration. Add each auth UUID to
   `coach_memberships` with role `tutor` or `student`. Record guardian consent
   before setting `guardian_consent_recorded_at`. No self-enrolment is permitted.
   Adults may be enrolled after recording the appropriate access consent through
   the administrative process; the MVP has no automatic age determination.
4. Deploy this branch through the existing hosting workflow. This change does not
   apply database migrations or modify hosting configuration automatically.

## Verify before student use

Use two enrolled student accounts, a tutor account and an unenrolled account.
Verify magic-link login, typed and photo question submission, history, topic/status
filters, signed image viewing, tutor reply/annotated image and refresh to see replies.
Verify student A cannot read student B's rows or images, an unenrolled user cannot
submit/read, and students cannot change submitted content, triage, insert replies
or self-enrol. Confirm original questions and replies cannot be updated/deleted.
Test these rules through direct Supabase API requests, not only hidden UI controls.
Test mobile layout and expired-session recovery with actual accounts.

Replies are visible in portal on refresh; email/push notifications are not provided.
Parent-linked accounts, learning plans, AI drafts and membership billing are deferred.
Student filters use account UUIDs because no safe student-name directory exists yet.
Storage is private, signed links last five minutes, images cannot be overwritten.
A failed question/reply database write after upload can leave a private orphan image;
trusted administration should reconcile unreferenced uploads under a retention policy.
Before onboarding, Amir must settle retention/deletion handling and guardian access.

Run `npm test` for classroom regressions and `node --test maths-coach/*.test.mjs`
for submission validation. Neither command verifies deployed RLS/storage policies.
