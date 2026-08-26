# Live Classroom — Milestone 1

This branch introduces the first end-to-end diagnostic tutoring loop without changing the public SEO pages.

## What Milestone 1 does

1. Tutor signs in with a Supabase magic link.
2. Tutor creates a private six-character room code.
3. Student joins with their name and room code using an anonymous Supabase auth session.
4. Tutor sends a question live.
5. Student submits working and a final answer.
6. Tutor marks it correct/incorrect and can tag a misconception.
7. The answer updates the student's skill-mastery profile.

The database deliberately stores **no correct answer in the student-readable `questions` table**. Marking is tutor-led in this milestone.

## Supabase setup

1. Run `supabase/migrations/20260826_live_classroom_m1.sql` in the Supabase SQL editor.
2. In Supabase Authentication settings, enable anonymous sign-ins for students.
3. Make sure the tutor email can use email OTP / magic-link authentication.
4. Add that email to the server-side tutor allowlist:

   ```sql
   insert into public.tutor_access (email)
   values ('your-tutor-email@example.com')
   on conflict do nothing;
   ```

5. Copy the Supabase project URL and the browser-safe publishable/anon key into `classroom/config.js`.

Never place a `service_role` key in `classroom/config.js`.

## Test flow

Use two separate browser sessions (for example, normal browser + private tab):

- Tutor: `/classroom/` → Tutor dashboard → magic-link sign in → Create room.
- Student: `/classroom/` → I'm a student → enter name + room code.
- Tutor sends one of the seeded questions.
- Student submits working and an answer.
- Tutor marks it and optionally tags a misconception.
- Tutor's Skill picture updates after marking.

## Starter diagnostic data

The migration seeds a tiny test bank only:

- `3x + 7 = 22`
- `3(x + 4) = 27`
- `2/3 + 1/4`

It also seeds a handful of atomised skills and misconceptions so the diagnostic loop can be tested before a full GCSE question bank is built.

## Security model

- Only emails in the server-side `tutor_access` allowlist can create and control tutor rooms.
- Tutors can only access rooms/sessions they own.
- Students can only access the room/session claimed by their authenticated anonymous user ID.
- Room claiming happens through a security-definer RPC and is atomic.
- Anonymous student sessions are blocked from creating tutor rooms.
- Students cannot see a stored answer key because one is not present in the readable question table.

## Next milestones

Milestone 2 should add the tools around the working area: embedded video, on-screen GCSE calculator, richer maths input and shared whiteboard/annotation.

Milestone 3 can build the larger Sparx-style diagnostic layer: curriculum map, question recommendations, retrieval scheduling, lesson summaries and parent-facing progress reports.
