import assert from "node:assert/strict";
import test from "node:test";
import { submitStudentAnswerRpc, validateSubmittedAnswer } from "./submit-student-answer.js";

const questionId = "question-1";
const studentId = "student-1";
const row = { id: "answer-1", session_question_id: questionId, student_id: studentId, answer_text: "12", working_text: "3 x 4", is_correct: null };
const expected = { sessionQuestionId: questionId, studentId, answerText: "12", workingText: "3 x 4" };

test("submits through the atomic RPC with trimmed student work", async () => {
  const calls = [];
  const supabase = { rpc: async (name, args) => { calls.push([name, args]); return { data: [row], error: null }; } };
  const result = await submitStudentAnswerRpc({ supabase, sessionQuestionId: questionId, studentId, answerText: " 12 ", workingText: " 3 x 4 " });
  assert.deepEqual(calls, [["submit_student_answer", { p_session_question_id: questionId, p_answer_text: "12", p_working_text: "3 x 4" }]]);
  assert.equal(result, row);
});

test("rejects blank submissions before calling Supabase", async () => {
  let called = false;
  const supabase = { rpc: async () => { called = true; return { data: [row], error: null }; } };
  await assert.rejects(() => submitStudentAnswerRpc({ supabase, sessionQuestionId: questionId, studentId, answerText: " ", workingText: "\n" }), /Add some working/);
  assert.equal(called, false);
});

test("fails closed when RPC result belongs to another student or question", () => {
  assert.throws(() => validateSubmittedAnswer({ ...row, student_id: "other" }, expected), /did not match/);
  assert.throws(() => validateSubmittedAnswer({ ...row, session_question_id: "other" }, expected), /did not match/);
});

test("fails closed when RPC result contains stale answer content", () => {
  assert.throws(() => validateSubmittedAnswer({ ...row, answer_text: "11" }, expected), /stale content/);
  assert.throws(() => validateSubmittedAnswer({ ...row, working_text: "2 + 10" }, expected), /stale content/);
});

test("fails closed on missing or ambiguous RPC results", () => {
  assert.throws(() => validateSubmittedAnswer([], expected), /unexpected result/);
  assert.throws(() => validateSubmittedAnswer([row, row], expected), /unexpected result/);
});

test("propagates RPC errors", async () => {
  const supabase = { rpc: async () => ({ data: null, error: new Error("question is no longer live") }) };
  await assert.rejects(() => submitStudentAnswerRpc({ supabase, sessionQuestionId: questionId, studentId, answerText: "12" }), /no longer live/);
});
