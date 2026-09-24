import test from "node:test";
import assert from "node:assert/strict";
import { createStudentAnswerSubmitController } from "./student-answer-submit-controller.js";

const questionId = "question-1";
const studentId = "student-1";
const savedRow = { id: "answer-1", session_question_id: questionId, student_id: studentId, answer_text: "12", working_text: "3 x 4" };

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

test("submits the current question through the atomic answer RPC", async () => {
  const calls = [];
  const statuses = [];
  let saved;
  const supabase = {
    rpc: async (name, args) => {
      calls.push([name, args]);
      return { data: [savedRow], error: null };
    }
  };
  const submit = createStudentAnswerSubmitController({
    supabase,
    getCurrent: () => ({ currentQuestion: { id: questionId }, user: { id: studentId } }),
    onSaved: (row) => { saved = row; },
    onStatus: (message, isError) => statuses.push([message, isError])
  });

  const result = await submit({ answerText: " 12 ", workingText: " 3 x 4 " });
  assert.deepEqual(result, savedRow);
  assert.deepEqual(saved, savedRow);
  assert.deepEqual(calls, [["submit_student_answer", { p_session_question_id: questionId, p_answer_text: "12", p_working_text: "3 x 4" }]]);
  assert.deepEqual(statuses.at(-1), ["Answer sent to your tutor.", false]);
});

test("prevents duplicate submissions while one request is in flight", async () => {
  const gate = deferred();
  let rpcCalls = 0;
  const supabase = {
    rpc: async () => {
      rpcCalls += 1;
      await gate.promise;
      return { data: [savedRow], error: null };
    }
  };
  const submit = createStudentAnswerSubmitController({
    supabase,
    getCurrent: () => ({ currentQuestion: { id: questionId }, user: { id: studentId } })
  });

  const first = submit({ answerText: "12", workingText: "3 x 4" });
  const second = await submit({ answerText: "12", workingText: "3 x 4" });
  assert.equal(second, null);
  assert.equal(rpcCalls, 1);
  gate.resolve();
  await first;
});

test("fails before Supabase when there is no current student question", async () => {
  let rpcCalls = 0;
  const statuses = [];
  const submit = createStudentAnswerSubmitController({
    supabase: { rpc: async () => { rpcCalls += 1; } },
    getCurrent: () => ({ currentQuestion: null, user: { id: studentId } }),
    onStatus: (message, isError) => statuses.push([message, isError])
  });

  await assert.rejects(() => submit({ answerText: "12" }), /Wait for a question/);
  assert.equal(rpcCalls, 0);
  assert.deepEqual(statuses.at(-1), ["Wait for a question before submitting.", true]);
});
