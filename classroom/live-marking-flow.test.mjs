import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const classroomSource = await readFile(new URL("./classroom.js", import.meta.url), "utf8");

test("student submission returns the saved answer needed by realtime marking", () => {
  assert.match(classroomSource, /from\("student_answers"\)\.upsert\(/);
  assert.match(classroomSource, /\.select\("id, session_question_id, student_id, answer_text, working_text, is_correct, tutor_feedback, submitted_at, marked_at"\)\.single\(\)/);
  assert.match(classroomSource, /state\.currentAnswer = data;/);
});

test("answer realtime events render only the active question response", () => {
  assert.match(classroomSource, /table: "student_answers"/);
  assert.match(classroomSource, /answer\?\.session_question_id === state\.currentQuestion\?\.id/);
  assert.match(classroomSource, /renderAnswer\(answer\)/);
});

test("tutor marking persists a result and student rendering handles it", () => {
  assert.match(classroomSource, /async function markAnswer\(isCorrect\)/);
  assert.match(classroomSource, /update\(\{ is_correct: isCorrect, marked_at: new Date\(\)\.toISOString\(\) \}\)/);
  assert.match(classroomSource, /answer\.is_correct \? "✓ Correct — nice work\."/);
});

test("same-question updates preserve the active answer used for marking", () => {
  assert.match(classroomSource, /applyQuestionState\(state\.currentQuestion, state\.currentAnswer, sessionQuestion\)/);
  assert.match(classroomSource, /state\.currentAnswer = nextState\.currentAnswer/);
  assert.match(classroomSource, /if \(payload\.new\.id === state\.currentQuestion\?\.id\) renderQuestion\(payload\.new\)/);
});
