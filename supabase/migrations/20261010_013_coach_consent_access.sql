-- Maths Coach: withdraw access when guardian consent is no longer recorded.
-- Apply AFTER 20261010_math_coach_foundation.sql and 20261010_012_coach_mvp.sql.
-- This migration does not delete historical records. Retention remains a separate policy decision.
-- Tutor membership is trusted and unaffected; only student visibility is gated.
begin;

drop policy if exists coach_questions_read on public.coach_questions;
create policy coach_questions_read on public.coach_questions
for select to authenticated using (
  exists (
    select 1 from public.coach_memberships m
    where m.user_id = (select auth.uid()) and m.role = 'tutor'
  )
  or (
    student_id = (select auth.uid())
    and exists (
      select 1 from public.coach_memberships m
      where m.user_id = (select auth.uid()) and m.role = 'student'
        and m.guardian_consent_recorded_at is not null
    )
  )
);

drop policy if exists coach_replies_read on public.coach_replies;
create policy coach_replies_read on public.coach_replies
for select to authenticated using (
  exists (
    select 1 from public.coach_memberships m
    where m.user_id = (select auth.uid()) and m.role = 'tutor'
  )
  or (
    exists (
      select 1 from public.coach_questions q
      join public.coach_memberships m on m.user_id = q.student_id
      where q.id = question_id
        and q.student_id = (select auth.uid())
        and m.role = 'student'
        and m.guardian_consent_recorded_at is not null
    )
  )
);

drop policy if exists coach_images_read on storage.objects;
create policy coach_images_read on storage.objects
for select to authenticated using (
  bucket_id = 'coach-images'
  and (
    exists (
      select 1 from public.coach_memberships m
      where m.user_id = (select auth.uid()) and m.role = 'tutor'
    )
    or (
      exists (
        select 1 from public.coach_memberships m
        where m.user_id = (select auth.uid()) and m.role = 'student'
          and m.guardian_consent_recorded_at is not null
      )
      and (
        (
          (storage.foldername(name))[1] = (select auth.uid())::text
          and exists (
            select 1 from public.coach_questions q
            where q.student_id = (select auth.uid()) and q.image_path = name
          )
        )
        or exists (
          select 1 from public.coach_replies r
          join public.coach_questions q on q.id = r.question_id
          where r.attachment_path = name
            and q.student_id = (select auth.uid())
        )
      )
    )
  )
);

-- The upload policy created in the MVP migration already checks active
-- guardian consent for student uploads. Keep it in place.
commit;

-- Required deployment checks (use distinct authenticated accounts):
-- 1. Student A with consent can read own questions, replies, referenced photos.
-- 2. Student A cannot read student B's questions, replies or photos.
-- 3. Clear student A's guardian_consent_recorded_at as trusted admin.
-- 4. Student A now cannot read old questions, replies or obtain new signed URLs.
-- 5. Student A cannot upload new photos or submit questions.
-- 6. Tutor can still read the retained audit records.
-- 7. Reinstate consent through trusted administration; verify access restores.
-- Note: already-issued signed URLs may remain usable until their 300s expiry.
