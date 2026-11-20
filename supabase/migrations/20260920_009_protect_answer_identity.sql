-- Keep the ownership and question identity of a submitted answer immutable.
-- RLS decides who may update an answer, while this trigger prevents an allowed
-- updater from moving that answer to a different student or question.
-- This protects the one-answer-per-student-per-question invariant used by the
-- live classroom and avoids accidental/crafted reassignment during marking.

begin;

create or replace function public.protect_student_answer_identity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.student_id is distinct from old.student_id then
    raise exception 'student_id cannot be changed after an answer is submitted.';
  end if;

  if new.session_question_id is distinct from old.session_question_id then
    raise exception 'session_question_id cannot be changed after an answer is submitted.';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_student_answer_identity on public.student_answers;
create trigger protect_student_answer_identity
before update on public.student_answers
for each row
execute function public.protect_student_answer_identity();

commit;
