import assert from "node:assert/strict";
import test from "node:test";
import { markStudentAnswerRpc, validateMarkedAnswer } from "./mark-student-answer.js";

const answerId = "answer-1";
const questionId = "question-1";
const studentId = "student-1";
const markedAt = "2026-09-24T04:00:00Z";
const row = { id: answerId, session_question_id: questionId, student_id: studentId, is_correct: false, marked_at: markedAt };

test("marks through the atomic RPC and preserves an incorrect misconception", async () => {
  const calls = [];
  const supabase = { rpc: async (name, args) => { calls.push([name, args]); return { data: [row], error: null }; } };
  const result = await markStudentAnswerRpc({ supabase, answerId, sessionQuestionId: questionId, studentId, isCorrect: false, misconceptionId: "misconception-1" });
  assert.deepEqual(calls, [["mark_student_answer", { p_answer_id: answerId, p_is_correct: false, p_misconception_id: "misconception-1" }]]);
  assert.equal(result, row);
});

test("never sends a misconception when marking correct", async () => {
  const calls = [];
  const correctRow = { ...row, is_correct: true };
  const supabase = { rpc: async (name, args) => { calls.push([name, args]); return { data: [correctRow], error: null }; } };
  await markStudentAnswerRpc({ supabase, answerId, sessionQuestionId: questionId, studentId, isCorrect: true, misconceptionId: "stale-tag" });
  assert.equal(calls[0][1].p_misconception_id, null);
});

test("rejects incomplete marking context before calling Supabase", async () => {
  let called = false;
  const supabase = { rpc: async () => { called = true; return { data: [row], error: null }; } };
  await assert.rejects(() => markStudentAnswerRpc({ supabase, answerId: null, sessionQuestionId: questionId, studentId, isCorrect: false }), /current answer/);
  assert.equal(called, false);
});

test("fails closed on another answer, question or student", () => {
  const context = { answerId, sessionQuestionId: questionId, studentId, isCorrect: false };
  assert.throws(() => validateMarkedAnswer({ ...row, id: "other" }, context), /did not match/);
  assert.throws(() => validateMarkedAnswer({ ...row, session_question_id: "other" }, context), /did not match/);
  assert.throws(() => validateMarkedAnswer({ ...row, student_id: "other" }, context), /did not match/);
});

test("fails closed on ambiguous or unconfirmed marking results", () => {
  const context = { answerId, sessionQuestionId: questionId, studentId, isCorrect: false };
  assert.throws(() => validateMarkedAnswer([], context), /unexpected result/);
  assert.throws(() => validateMarkedAnswer([row, row], context), /unexpected result/);
  assert.throws(() => validateMarkedAnswer({ ...row, is_correct: true }, context), /not confirmed/);
  assert.throws(() => validateMarkedAnswer({ ...row, marked_at: null }, context), /not confirmed/);
});

test("propagates RPC errors", async () => {
  const supabase = { rpc: async () => ({ data: null, error: new Error("lesson is no longer active") }) };
  await assert.rejects(() => markStudentAnswerRpc({ supabase, answerId, sessionQuestionId: questionId, studentId, isCorrect: false }), /no longer active/);
});
