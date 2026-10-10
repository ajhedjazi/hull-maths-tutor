-- Maths Coach foundation: private student questions and tutor-reviewed replies.
-- Apply after existing classroom migrations. Provision coach_memberships through
-- a trusted administrative process only, after checking guardian consent.
-- No browser client may grant itself tutor/student access.
begin;

create table if not exists public.coach_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'tutor')),
  guardian_consent_recorded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.coach_questions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.coach_memberships(user_id),
  question_text text not null default '',
  help_type text not null check (help_type in ('start', 'halfway', 'check', 'explanation')),
  student_note text not null default '',
  image_path text,
  topic text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'answered', 'discuss_in_lesson')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coach_question_has_content check (
    length(btrim(question_text)) > 0 or image_path is not null
  ),
  constraint coach_question_image_owned check (
    image_path is null or
    (image_path like student_id::text || '/%' and
     image_path not like '%..%' and length(image_path) <= 512)
  )
);

create table if not exists public.coach_replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.coach_questions(id) on delete cascade,
  tutor_id uuid not null references public.coach_memberships(user_id),
  body text not null check (length(btrim(body)) > 0),
  attachment_path text,
  created_at timestamptz not null default now()
);

create index if not exists coach_questions_student_created_idx
  on public.coach_questions (student_id, created_at desc);
create index if not exists coach_questions_status_created_idx
  on public.coach_questions (status, created_at desc);
create index if not exists coach_replies_question_created_idx
  on public.coach_replies (question_id, created_at);

alter table public.coach_memberships enable row level security;
alter table public.coach_questions enable row level security;
alter table public.coach_replies enable row level security;

-- Memberships are provisioned by trusted admin tooling, never by a student.
create policy coach_memberships_read_self on public.coach_memberships
  for select to authenticated using (user_id = (select auth.uid()));

-- Only explicitly enrolled students may submit; guardian consent must be
-- recorded for this initial under-18-safe enrolment model.
create policy coach_questions_student_insert on public.coach_questions
  for insert to authenticated with check (
    student_id = (select auth.uid()) and
    exists (select 1 from public.coach_memberships m
      where m.user_id = (select auth.uid()) and m.role = 'student'
        and m.guardian_consent_recorded_at is not null)
  );

create policy coach_questions_read on public.coach_questions
  for select to authenticated using (
    student_id = (select auth.uid()) or
    exists (select 1 from public.coach_memberships m
      where m.user_id = (select auth.uid()) and m.role = 'tutor')
  );

-- Only tutors can triage; students cannot rewrite submitted questions.
create policy coach_questions_tutor_update on public.coach_questions
  for update to authenticated
  using (exists (select 1 from public.coach_memberships m
    where m.user_id = (select auth.uid()) and m.role = 'tutor'))
  with check (exists (select 1 from public.coach_memberships m
    where m.user_id = (select auth.uid()) and m.role = 'tutor'));

create policy coach_replies_read on public.coach_replies
  for select to authenticated using (
    exists (select 1 from public.coach_questions q
      where q.id = question_id and q.student_id = (select auth.uid()))
    or exists (select 1 from public.coach_memberships m
      where m.user_id = (select auth.uid()) and m.role = 'tutor')
  );

create policy coach_replies_tutor_insert on public.coach_replies
  for insert to authenticated with check (
    tutor_id = (select auth.uid()) and
    exists (select 1 from public.coach_memberships m
      where m.user_id = (select auth.uid()) and m.role = 'tutor')
  );

-- Replies are append-only. No client update/delete policy: preserve audit history.
-- Questions have no client delete policy for the same reason.
-- Image storage policies are intentionally NOT opened here; uploads must remain
-- disabled until a private bucket and path-scoped storage policies are deployed.
commit;
