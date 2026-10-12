-- Send the next live question atomically.
-- Prevents a failed insert from leaving an active lesson with its previous
-- question already completed, and serialises concurrent sends per session.

create or replace function public.send_live_question(
  p_session_id uuid,
  p_question_id uuid
)
returns public.session_questions
language plpgsql
security definer
set search_path = public
as $$
declare
  lesson public.sessions;
  bank_question public.questions;
  next_position integer;
  sent_question public.session_questions;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to send a question.';
  end if;

  if not public.is_tutor() then
    raise exception 'This account is not authorised as a tutor.';
  end if;

  -- Lock the active lesson so two tabs/double-clicks cannot allocate the same
  -- position or interleave completion/insertion work.
  select *
  into lesson
  from public.sessions
  where id = p_session_id
    and tutor_id = auth.uid()
    and status = 'active'
  for update;

  if lesson.id is null then
    raise exception 'Active lesson not found or not owned by this tutor.';
  end if;

  select *
  into bank_question
  from public.questions
  where id = p_question_id
    and active = true;

  if bank_question.id is null then
    raise exception 'Question not found or inactive.';
  end if;

  select coalesce(max(position), 0) + 1
  into next_position
  from public.session_questions
  where session_id = lesson.id;

  update public.session_questions
  set status = 'completed',
      completed_at = coalesce(completed_at, now())
  where session_id = lesson.id
    and status = 'live';

  insert into public.session_questions (
    session_id,
    question_id,
    question_text_snapshot,
    position,
    status
  )
  values (
    lesson.id,
    bank_question.id,
    bank_question.prompt,
    next_position,
    'live'
  )
  returning * into sent_question;

  return sent_question;
end;
$$;

revoke all on function public.send_live_question(uuid, uuid) from public;
grant execute on function public.send_live_question(uuid, uuid) to authenticated;

comment on function public.send_live_question(uuid, uuid) is
  'Atomically completes the current live question and sends the next active bank question for a tutor-owned active lesson.';
