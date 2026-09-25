-- Secure room functions
-- ---------------------------------------------------------------------------
create or replace function public.create_tutor_room()
returns public.rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  new_room public.rooms;
  candidate text;
  chars constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  random_bytes bytea;
  i integer;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to create a room.';
  end if;

  if not public.is_tutor() then
    raise exception 'This account is not authorised as a tutor.';
  end if;

  loop
    random_bytes := gen_random_bytes(6);
    candidate := '';
    for i in 0..5 loop
      candidate := candidate || substr(
        chars,
        1 + (get_byte(random_bytes, i) % length(chars)),
        1
      );
    end loop;

    begin
      insert into public.rooms (room_code, tutor_id)
      values (candidate, auth.uid())
      returning * into new_room;
      exit;
    exception when unique_violation then
      -- Extremely unlikely; simply generate another code.
    end;
  end loop;

  insert into public.sessions (room_id, tutor_id, status)
  values (new_room.id, auth.uid(), 'active');

  return new_room;
end;
$$;

revoke all on function public.create_tutor_room() from public;
grant execute on function public.create_tutor_room() to authenticated;

create or replace function public.claim_room(p_room_code text, p_display_name text)
returns public.rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed public.rooms;
begin
  if auth.uid() is null then
    raise exception 'You must have a session before joining a room.';
  end if;

  if not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Student room joins require an anonymous student session.';
  end if;

  if length(trim(coalesce(p_display_name, ''))) < 2 then
    raise exception 'Please enter your name.';
  end if;

  update public.rooms
  set student_id = auth.uid(),
      student_display_name = left(trim(p_display_name), 80)
  where room_code = upper(trim(p_room_code))
    and status = 'active'
    and (student_id is null or student_id = auth.uid())
  returning * into claimed;

  if claimed.id is null then
    raise exception 'Room not found, closed, or already in use.';
  end if;

  update public.sessions
  set student_id = auth.uid()
  where room_id = claimed.id
    and status = 'active';

  return claimed;
end;
$$;

revoke all on function public.claim_room(text, text) from public;
grant execute on function public.claim_room(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Mastery update trigger
-- A deliberately simple V1 model: percentage correct across tagged questions.
-- The schema leaves room for recency weighting / Bayesian mastery later.
-- ---------------------------------------------------------------------------
create or replace function public.refresh_mastery_from_mark()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  linked_skill record;
  linked_question uuid;
  delta_attempts integer := 0;
  delta_correct integer := 0;
begin
  if new.is_correct is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    delta_attempts := 1;
    delta_correct := case when new.is_correct then 1 else 0 end;
  elsif old.is_correct is null then
    delta_attempts := 1;
    delta_correct := case when new.is_correct then 1 else 0 end;
  elsif old.is_correct is distinct from new.is_correct then
    delta_correct := case when new.is_correct then 1 else -1 end;
  else
    return new;
  end if;

  select sq.question_id
  into linked_question
  from public.session_questions sq
  where sq.id = new.session_question_id;

  if linked_question is null then
    return new;
  end if;

  for linked_skill in
    select qs.skill_id
    from public.question_skills qs
    where qs.question_id = linked_question
  loop
    insert into public.student_skill_mastery (
      student_id,
      skill_id,
      attempts,
      correct_count,
      mastery_percent,
      last_assessed_at,
      updated_at
    )
    values (
      new.student_id,
      linked_skill.skill_id,
      delta_attempts,
      greatest(delta_correct, 0),
      case
        when delta_attempts = 1 and delta_correct = 1 then 100
        else 0
      end,
      coalesce(new.marked_at, now()),
      now()
    )
    on conflict (student_id, skill_id) do update
    set attempts = public.student_skill_mastery.attempts + delta_attempts,
        correct_count = greatest(0, public.student_skill_mastery.correct_count + delta_correct),
        mastery_percent = case
          when public.student_skill_mastery.attempts + delta_attempts = 0 then 0
          else round(
            100.0 * greatest(0, public.student_skill_mastery.correct_count + delta_correct)
            / (public.student_skill_mastery.attempts + delta_attempts),
            2
          )
        end,
        last_assessed_at = coalesce(new.marked_at, now()),
        updated_at = now();
  end loop;

  return new;
end;
$$;

drop trigger if exists trg_refresh_mastery_from_mark on public.student_answers;
create trigger trg_refresh_mastery_from_mark
after insert or update of is_correct on public.student_answers
for each row execute function public.refresh_mastery_from_mark();

-- ---------------------------------------------------------------------------
-- Realtime publication (safe if tables have already been added)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'rooms'
  ) then
    alter publication supabase_realtime add table public.rooms;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_questions'
  ) then
    alter publication supabase_realtime add table public.session_questions;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'student_answers'
  ) then
    alter publication supabase_realtime add table public.student_answers;
  end if;
end $$;
