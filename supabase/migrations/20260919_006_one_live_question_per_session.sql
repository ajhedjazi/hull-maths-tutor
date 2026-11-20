-- Prevent duplicate live questions within a lesson session.
--
-- The classroom UI completes the previous question before inserting the next one,
-- but rapid/repeated clicks, reconnects or two tutor tabs can race. Enforcing the
-- invariant in Postgres makes the live classroom safe regardless of client timing.

begin;

-- Repair any pre-existing duplicate live rows deterministically before adding the
-- constraint. Keep the newest live question and complete older live questions.
with ranked_live_questions as (
  select
    id,
    row_number() over (
      partition by session_id
      order by position desc, sent_at desc, id desc
    ) as live_rank
  from public.session_questions
  where status = 'live'
)
update public.session_questions as sq
set
  status = 'completed',
  completed_at = coalesce(sq.completed_at, now())
from ranked_live_questions as ranked
where sq.id = ranked.id
  and ranked.live_rank > 1;

-- PostgreSQL partial unique index: at most one live question for each session.
create unique index if not exists idx_one_live_question_per_session
  on public.session_questions (session_id)
  where status = 'live';

commit;
