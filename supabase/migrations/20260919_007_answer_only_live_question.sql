-- Prevent stale/replayed student submissions from changing completed questions.
-- Students may insert or edit only their own unmarked answer while both the
-- lesson session and the target session question are live. Tutors retain the
-- existing marking policy from 002_classroom_rls.sql.

begin;

drop policy if exists "student_answers_insert_student" on public.student_answers;
create policy "student_answers_insert_student"
on public.student_answers for insert
to authenticated
with check (
  student_id = auth.uid()
  and is_correct is null
  and marked_at is null
  and exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and sq.status = 'live'
      and s.student_id = auth.uid()
      and s.status = 'active'
  )
);

drop policy if exists "student_answers_update_student_unmarked" on public.student_answers;
create policy "student_answers_update_student_unmarked"
on public.student_answers for update
to authenticated
using (
  student_id = auth.uid()
  and is_correct is null
  and marked_at is null
  and exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and sq.status = 'live'
      and s.student_id = auth.uid()
      and s.status = 'active'
  )
)
with check (
  student_id = auth.uid()
  and is_correct is null
  and marked_at is null
  and exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = student_answers.session_question_id
      and sq.status = 'live'
      and s.student_id = auth.uid()
      and s.status = 'active'
  )
);

commit;
