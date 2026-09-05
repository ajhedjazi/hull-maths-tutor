-- Hull Maths Tutor: Live Classroom Milestone 1
-- Core loop: room -> question -> student working/answer -> tutor diagnosis -> skill mastery.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Rooms (compatible with the earlier room migration if it has already run)
-- ---------------------------------------------------------------------------
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  tutor_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid references auth.users(id) on delete set null,
  student_display_name text,
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint check_room_code_format check (room_code ~ '^[A-Z0-9]{6}$')
);

create index if not exists idx_rooms_room_code on public.rooms (room_code);
create index if not exists idx_rooms_tutor_id on public.rooms (tutor_id);
create index if not exists idx_rooms_student_id on public.rooms (student_id);

-- Tutor allowlist. Keep this table server-side; clients do not get a read policy.
-- After the tutor has authenticated once, add the email used for tutoring, e.g.:
-- insert into public.tutor_access (email) values ('your-tutor-email@example.com') on conflict do nothing;
create table if not exists public.tutor_access (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.tutor_access enable row level security;

create or replace function public.is_tutor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tutor_access ta
    where lower(ta.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

revoke all on function public.is_tutor() from public;
grant execute on function public.is_tutor() to authenticated;

-- ---------------------------------------------------------------------------
-- Diagnostic curriculum model
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  strand text not null,
  topic text not null,
  skill_name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  prompt text not null,
  answer_type text not null default 'free_text'
    check (answer_type in ('free_text', 'number', 'multiple_choice')),
  calculator_allowed boolean not null default false,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.question_skills (
  question_id uuid not null references public.questions(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  weight numeric(4,3) not null default 1.000 check (weight > 0 and weight <= 1),
  primary key (question_id, skill_id)
);

create table if not exists public.misconceptions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Live lesson model
-- ---------------------------------------------------------------------------
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  tutor_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid references auth.users(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'ended')),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create unique index if not exists idx_one_active_session_per_room
  on public.sessions (room_id)
  where status = 'active';
create index if not exists idx_sessions_tutor on public.sessions (tutor_id, started_at desc);
create index if not exists idx_sessions_student on public.sessions (student_id, started_at desc);

create table if not exists public.session_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  question_id uuid references public.questions(id) on delete set null,
  question_text_snapshot text not null,
  position integer not null,
  status text not null default 'live' check (status in ('queued', 'live', 'completed', 'skipped')),
  sent_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (session_id, position)
);

create index if not exists idx_session_questions_session
  on public.session_questions (session_id, position desc);

create table if not exists public.student_answers (
  id uuid primary key default gen_random_uuid(),
  session_question_id uuid not null references public.session_questions(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  answer_text text,
  working_text text,
  is_correct boolean,
  tutor_feedback text,
  submitted_at timestamptz not null default now(),
  marked_at timestamptz,
  unique (session_question_id, student_id)
);

create index if not exists idx_student_answers_question
  on public.student_answers (session_question_id);
create index if not exists idx_student_answers_student
  on public.student_answers (student_id, submitted_at desc);

create table if not exists public.answer_misconceptions (
  answer_id uuid not null references public.student_answers(id) on delete cascade,
  misconception_id uuid not null references public.misconceptions(id) on delete cascade,
  tagged_by uuid not null references auth.users(id) on delete cascade,
  tagged_at timestamptz not null default now(),
  primary key (answer_id, misconception_id)
);

create table if not exists public.student_skill_mastery (
  student_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  attempts integer not null default 0 check (attempts >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  mastery_percent numeric(5,2) not null default 0 check (mastery_percent between 0 and 100),
  last_assessed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, skill_id),
  constraint correct_not_above_attempts check (correct_count <= attempts)
);
