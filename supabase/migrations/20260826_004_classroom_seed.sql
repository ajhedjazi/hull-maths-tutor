-- Small starter bank for testing the end-to-end loop
-- ---------------------------------------------------------------------------
insert into public.skills (code, strand, topic, skill_name, description, sort_order)
values
  ('ALG-EXP-01', 'Algebra', 'Expanding brackets', 'Expand a single bracket', 'Multiply a term through a single bracket.', 10),
  ('ALG-EQ-01', 'Algebra', 'Linear equations', 'Solve a one-step linear equation', 'Use inverse operations to isolate the unknown.', 20),
  ('ALG-EQ-02', 'Algebra', 'Linear equations', 'Solve equations containing brackets', 'Expand and then solve a linear equation.', 30),
  ('NUM-FRA-01', 'Number', 'Fractions', 'Find a common denominator', 'Identify a suitable common denominator for unlike fractions.', 40)
on conflict (code) do nothing;

insert into public.questions (code, prompt, answer_type, calculator_allowed, difficulty)
values
  ('M1-ALG-001', 'Solve: 3x + 7 = 22', 'free_text', false, 1),
  ('M1-ALG-002', 'Solve: 3(x + 4) = 27', 'free_text', false, 2),
  ('M1-FRA-001', 'Work out: 2/3 + 1/4', 'free_text', false, 2)
on conflict (code) do nothing;

insert into public.question_skills (question_id, skill_id, weight)
select q.id, s.id, 1.0
from public.questions q
join public.skills s on
  (q.code = 'M1-ALG-001' and s.code = 'ALG-EQ-01')
  or (q.code = 'M1-ALG-002' and s.code in ('ALG-EXP-01', 'ALG-EQ-02'))
  or (q.code = 'M1-FRA-001' and s.code = 'NUM-FRA-01')
on conflict (question_id, skill_id) do nothing;

insert into public.misconceptions (code, label, description)
values
  ('EXP-NOT-DISTRIBUTED', 'Did not distribute across the bracket', 'A multiplier was applied to only one term inside the bracket.'),
  ('EQ-INVERSE-OP', 'Incorrect inverse operation', 'The student used the wrong inverse operation while solving.'),
  ('FRA-ADD-TOP-BOTTOM', 'Added numerators and denominators', 'The student added numerator to numerator and denominator to denominator.'),
  ('ARITHMETIC-SLIP', 'Arithmetic slip', 'The method was sound but an arithmetic error changed the result.')
on conflict (code) do nothing;
