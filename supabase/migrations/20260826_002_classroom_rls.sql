-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.rooms enable row level security;
alter table public.skills enable row level security;
alter table public.questions enable row level security;
alter table public.question_skills enable row level security;
alter table public.misconceptions enable row level security;
alter table public.sessions enable row level security;
alter table public.session_questions enable row level security;
alter table public.student_answers enable row level security;
alter table public.answer_misconceptions enable row level security;
alter table public.student_skill_mastery enable row level security;

-- Rooms
drop policy if exists "rooms_select_participants" on public.rooms;
create policy "rooms_select_participants"
on public.rooms for select
to authenticated
using (tutor_id = auth.uid() or student_id = auth.uid());

drop policy if exists "rooms_insert_tutor" on public.rooms;
create policy "rooms_insert_tutor"
on public.rooms for insert
to authenticated
with check (tutor_id = auth.uid() and public.is_tutor());

drop policy if exists "rooms_update_tutor" on public.rooms;
create policy "rooms_update_tutor"
on public.rooms for update
to authenticated
using (tutor_id = auth.uid())
with check (tutor_id = auth.uid() and public.is_tutor());

-- Curriculum content is readable only by signed-in users, including anonymous students.
drop policy if exists "skills_read_authenticated" on public.skills;
create policy "skills_read_authenticated"
on public.skills for select
to authenticated
using (true);

drop policy if exists "questions_read_authenticated" on public.questions;
create policy "questions_read_authenticated"
on public.questions for select
to authenticated
using (active = true);

drop policy if exists "question_skills_read_authenticated" on public.question_skills;
create policy "question_skills_read_authenticated"
on public.question_skills for select
to authenticated
using (true);

drop policy if exists "misconceptions_read_authenticated" on public.misconceptions;
create policy "misconceptions_read_authenticated"
on public.misconceptions for select
to authenticated
using (active = true);

-- Sessions
drop policy if exists "sessions_select_participants" on public.sessions;
create policy "sessions_select_participants"
on public.sessions for select
to authenticated
using (tutor_id = auth.uid() or student_id = auth.uid());

drop policy if exists "sessions_insert_tutor" on public.sessions;
create policy "sessions_insert_tutor"
on public.sessions for insert
to authenticated
with check (tutor_id = auth.uid() and public.is_tutor());

drop policy if exists "sessions_update_tutor" on public.sessions;
create policy "sessions_update_tutor"
on public.sessions for update
to authenticated
using (tutor_id = auth.uid())
with check (tutor_id = auth.uid() and public.is_tutor());

-- Session questions
drop policy if exists "session_questions_select_participants" on public.session_questions;
create policy "session_questions_select_participants"
on public.session_questions for select
to authenticated
using (
  exists (
    select 1
    from public.sessions s
    where s.id = session_questions.session_id
      and (s.tutor_id = auth.uid() or s.student_id = auth.uid())
  )
);

drop policy if exists "session_questions_insert_tutor" on public.session_questions;
create policy "session_questions_insert_tutor"
on public.session_questions for insert
to authenticated
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = session_questions.session_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
);

drop policy if exists "session_questions_update_tutor" on public.session_questions;
create policy "session_questions_update_tutor"
on public.session_questions for update
to authenticated
using (
  exists (
    select 1
    from public.sessions s
    where s.id = session_questions.session_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
)
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = session_questions.session_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
);

-- Student answers
drop policy if exists "student_answers_select_participants" on public.student_answers;
create policy "student_answers_select_participants"
on public.student_answers for select
to authenticated
using (
  student_id = auth.uid()
  or exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and s.tutor_id = auth.uid()
  )
);

drop policy if exists "student_answers_insert_student" on public.student_answers;
create policy "student_answers_insert_student"
on public.student_answers for insert
to authenticated
with check (
  student_id = auth.uid()
  and exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and s.student_id = auth.uid()
      and s.status = 'active'
  )
);

drop policy if exists "student_answers_update_student_unmarked" on public.student_answers;
create policy "student_answers_update_student_unmarked"
on public.student_answers for update
to authenticated
using (student_id = auth.uid() and is_correct is null)
with check (student_id = auth.uid() and is_correct is null);

drop policy if exists "student_answers_update_tutor" on public.student_answers;
create policy "student_answers_update_tutor"
on public.student_answers for update
to authenticated
using (
  exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
)
with check (
  exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
);

-- Misconception tags
drop policy if exists "answer_misconceptions_select_participants" on public.answer_misconceptions;
create policy "answer_misconceptions_select_participants"
on public.answer_misconceptions for select
to authenticated
using (
  exists (
    select 1
    from public.student_answers a
    join public.session_questions sq on sq.id = a.session_question_id
    join public.sessions s on s.id = sq.session_id
    where a.id = answer_misconceptions.answer_id
      and (s.tutor_id = auth.uid() or a.student_id = auth.uid())
  )
);

drop policy if exists "answer_misconceptions_insert_tutor" on public.answer_misconceptions;
create policy "answer_misconceptions_insert_tutor"
on public.answer_misconceptions for insert
to authenticated
with check (
  tagged_by = auth.uid()
  and exists (
    select 1
    from public.student_answers a
    join public.session_questions sq on sq.id = a.session_question_id
    join public.sessions s on s.id = sq.session_id
    where a.id = answer_misconceptions.answer_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
);

drop policy if exists "answer_misconceptions_update_tutor" on public.answer_misconceptions;
create policy "answer_misconceptions_update_tutor"
on public.answer_misconceptions for update
to authenticated
using (
  exists (
    select 1
    from public.student_answers a
    join public.session_questions sq on sq.id = a.session_question_id
    join public.sessions s on s.id = sq.session_id
    where a.id = answer_misconceptions.answer_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
)
with check (
  tagged_by = auth.uid()
  and exists (
    select 1
    from public.student_answers a
    join public.session_questions sq on sq.id = a.session_question_id
    join public.sessions s on s.id = sq.session_id
    where a.id = answer_misconceptions.answer_id
      and s.tutor_id = auth.uid()
      and public.is_tutor()
  )
);

-- Mastery can be seen by the student or their tutor in a room.
drop policy if exists "mastery_select_student_or_tutor" on public.student_skill_mastery;
create policy "mastery_select_student_or_tutor"
on public.student_skill_mastery for select
to authenticated
using (
  student_id = auth.uid()
  or exists (
    select 1 from public.rooms r
    where r.student_id = student_skill_mastery.student_id
      and r.tutor_id = auth.uid()
      and public.is_tutor()
  )
);
