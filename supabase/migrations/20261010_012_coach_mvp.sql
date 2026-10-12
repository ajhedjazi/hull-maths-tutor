begin;
alter table public.coach_questions add constraint coach_question_limits check
 (length(question_text)<=6000 and length(student_note)<=2000 and length(coalesce(topic,''))<=100);
alter table public.coach_replies add constraint coach_reply_limits check(length(body)<=12000);
drop policy coach_questions_student_insert on public.coach_questions;
create policy coach_questions_student_insert on public.coach_questions for insert to authenticated with check (
 student_id=(select auth.uid()) and status='new' and topic is null
 and exists(select 1 from public.coach_memberships m where m.user_id=(select auth.uid())
 and m.role='student' and m.guardian_consent_recorded_at is not null));
create function public.coach_preserve_question() returns trigger language plpgsql set search_path=public as $$
begin
 if row(new.id,new.student_id,new.question_text,new.help_type,new.student_note,new.image_path,new.created_at)
 is distinct from row(old.id,old.student_id,old.question_text,old.help_type,old.student_note,old.image_path,old.created_at)
 then raise exception 'Original submissions cannot be changed'; end if;
 new.updated_at:=now(); return new;
end; $$;
create trigger coach_preserve_question before update on public.coach_questions for each row execute function public.coach_preserve_question();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('coach-images','coach-images',false,8388608,array['image/jpeg','image/png','image/webp'])
 on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=excluded.allowed_mime_types;
create policy coach_images_insert on storage.objects for insert to authenticated with check (
 bucket_id='coach-images' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.coach_memberships m where m.user_id=(select auth.uid())
 and (m.role='tutor' or(m.role='student' and m.guardian_consent_recorded_at is not null))));
create policy coach_images_read on storage.objects for select to authenticated using (
 bucket_id='coach-images' and (
 exists(select 1 from public.coach_memberships m where m.user_id=(select auth.uid()) and m.role='tutor')
 or((storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.coach_memberships m where m.user_id=(select auth.uid()) and m.role='student'))
 or exists(select 1 from public.coach_replies r join public.coach_questions q on q.id=r.question_id
 where r.attachment_path=name and q.student_id=(select auth.uid()))));
alter table public.coach_replies add constraint coach_reply_attachment_owned check
 (attachment_path is null or(attachment_path like tutor_id::text||'/%' and attachment_path not like '%..%' and length(attachment_path)<=512));
create function public.coach_send_reply(p_question_id uuid,p_body text,p_attachment_path text default null)
 returns uuid language plpgsql security invoker set search_path=public as $$
declare reply_id uuid;
begin
 if not exists(select 1 from public.coach_memberships where user_id=auth.uid() and role='tutor')
 then raise exception 'Tutor access required'; end if;
 perform 1 from public.coach_questions where id=p_question_id for update;
 if not found then raise exception 'Question unavailable'; end if;
 insert into public.coach_replies(question_id,tutor_id,body,attachment_path)
 values(p_question_id,auth.uid(),p_body,p_attachment_path) returning id into reply_id;
 update public.coach_questions set status='answered' where id=p_question_id;
 return reply_id;
end; $$;
revoke all on function public.coach_send_reply(uuid,text,text) from public,anon;
grant execute on function public.coach_send_reply(uuid,text,text) to authenticated;
grant select on public.coach_memberships to authenticated;
grant select,insert,update on public.coach_questions to authenticated;
grant select,insert on public.coach_replies to authenticated;
commit;
