-- Harden student room claiming so a room cannot become claimed without a live
-- lesson session behind it. Any exception rolls the whole function back,
-- including the room update.
create or replace function public.claim_room(p_room_code text, p_display_name text)
returns public.rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed public.rooms;
  updated_sessions integer := 0;
  normalised_code text := upper(trim(coalesce(p_room_code, '')));
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

  -- Codes are generated from this unambiguous alphabet. Reject malformed input
  -- before touching any room row.
  if normalised_code !~ '^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$' then
    raise exception 'Enter the full six-character room code.';
  end if;

  update public.rooms
  set student_id = auth.uid(),
      student_display_name = left(trim(p_display_name), 80)
  where room_code = normalised_code
    and status = 'active'
    and (student_id is null or student_id = auth.uid())
  returning * into claimed;

  if claimed.id is null then
    raise exception 'That room is unavailable. Check the code with your tutor and try again.';
  end if;

  update public.sessions
  set student_id = auth.uid()
  where room_id = claimed.id
    and status = 'active'
    and (student_id is null or student_id = auth.uid());

  get diagnostics updated_sessions = row_count;

  if updated_sessions <> 1 then
    raise exception 'That lesson is no longer available. Ask your tutor to create a new room.';
  end if;

  return claimed;
end;
$$;

revoke all on function public.claim_room(text, text) from public;
grant execute on function public.claim_room(text, text) to authenticated;
