-- Submit or revise the signed-in student's answer to the current live question.
-- Keeping the ownership/live-state checks and upsert in one database function
-- makes retries idempotent and prevents a stale client from editing a marked or
-- completed answer between separate browser-side checks and writes.

begin;

create or replace function public.submit_student_answer(
  p_session_question_id uuid,
  p_answer_text text default '',
  p_working_text text default ''
)
returns public.student_answers
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing public.student_answers%rowtype;
  v_result public.student_answers%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_session_question_id is null then
    raise exception 'Question is required';
  end if;

  if nullif(btrim(coalesce(p_answer_text, '')), '') is null
     and nullif(btrim(coalesce(p_working_text, '')), '') is null then
    raise exception 'Add some working or an answer first';
  end if;

  -- Lock any existing answer so marking and a student retry cannot race.
  select *
  into v_existing
  from public.student_answers
  where session_question_id = p_session_question_id
    and student_id = v_user_id
  for update;

  if found and (v_existing.is_correct is not null or v_existing.marked_at is not null) then
    raise exception 'This answer has already been marked';
  end if;

  -- Re-check the authoritative live state immediately before the write.
  if not exists (
    select 1
    from public.session_questions sq
    join public.sessions s on s.id = sq.session_id
    where sq.id = p_session_question_id
      and sq.status = 'live'
      and s.status = 'active'
      and s.student_id = v_user_id
  ) then
    raise exception 'This question is no longer live';
  end if;

  insert into public.student_answers (
    session_question_id,
    student_id,
    answer_text,
    working_text,
    submitted_at
  ) values (
    p_session_question_id,
    v_user_id,
    btrim(coalesce(p_answer_text, '')),
    btrim(coalesce(p_working_text, '')),
    now()
  )
  on conflict (session_question_id, student_id) do update
  set answer_text = excluded.answer_text,
      working_text = excluded.working_text,
      submitted_at = excluded.submitted_at
  returning * into v_result;

  return v_result;
end;
$$;

revoke all on function public.submit_student_answer(uuid, text, text) from public;
grant execute on function public.submit_student_answer(uuid, text, text) to authenticated;

commit;
