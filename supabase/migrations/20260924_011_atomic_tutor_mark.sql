-- Mark a student's answer and optional misconception in one tutor-owned transaction.
-- The browser supplies only answer/mark identifiers; tutor identity comes from auth.uid().

create or replace function public.mark_student_answer(
  p_answer_id uuid,
  p_is_correct boolean,
  p_misconception_id uuid default null
)
returns setof public.student_answers
language plpgsql
security definer
set search_path = public
as $$
declare
  marked public.student_answers%rowtype;
  owning_tutor uuid;
  session_status text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  if p_answer_id is null or p_is_correct is null then
    raise exception 'Answer and mark are required.';
  end if;

  -- Lock the answer before checking ownership so concurrent marks cannot race.
  select sa.*
  into marked
  from public.student_answers sa
  where sa.id = p_answer_id
  for update;

  if marked.id is null then
    raise exception 'Answer not found.';
  end if;

  select s.tutor_id, s.status
  into owning_tutor, session_status
  from public.session_questions sq
  join public.sessions s on s.id = sq.session_id
  where sq.id = marked.session_question_id;

  if owning_tutor is distinct from auth.uid() then
    raise exception 'Only the tutor for this lesson can mark this answer.';
  end if;

  if session_status is distinct from 'active' then
    raise exception 'This lesson is no longer active.';
  end if;

  if not p_is_correct and p_misconception_id is not null and not exists (
    select 1
    from public.misconceptions m
    where m.id = p_misconception_id
      and m.active = true
  ) then
    raise exception 'Misconception tag is unavailable.';
  end if;

  update public.student_answers
  set is_correct = p_is_correct,
      marked_at = now()
  where id = marked.id
  returning * into marked;

  -- The classroom currently has one misconception picker, so make its saved
  -- diagnosis authoritative on every re-mark rather than accumulating stale tags.
  delete from public.answer_misconceptions
  where answer_id = marked.id;

  if not p_is_correct and p_misconception_id is not null then
    insert into public.answer_misconceptions (answer_id, misconception_id, tagged_by)
    values (marked.id, p_misconception_id, auth.uid());
  end if;

  return next marked;
  return;
end;
$$;

revoke all on function public.mark_student_answer(uuid, boolean, uuid) from public;
grant execute on function public.mark_student_answer(uuid, boolean, uuid) to authenticated;
