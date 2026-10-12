import assert from "node:assert/strict";
import test from "node:test";
import { createTutorMarkingController } from "./tutor-marking-controller.js";

const baseState = () => ({
  room: { student_id: "student-1" },
  currentQuestion: { id: "question-1" },
  currentAnswer: { id: "answer-1", session_question_id: "question-1", student_id: "student-1", is_correct: null }
});

function rpcSupabase(handler) {
  return { rpc: async (name, args) => {
    assert.equal(name, "mark_student_answer");
    return handler(args);
  } };
}

test("marks through the atomic RPC and publishes the validated result", async () => {
  const state = baseState();
  const savedRows = [];
  const supabase = rpcSupabase(async (args) => ({ data: [{ ...state.currentAnswer, is_correct: true, marked_at: "2026-09-24T09:00:00Z" }], error: null }));
  const mark = createTutorMarkingController({ supabase, getCurrent: () => state, onSaved: (row) => savedRows.push(row) });

  const saved = await mark({ isCorrect: true, misconceptionId: "stale-tag" });

  assert.equal(saved.is_correct, true);
  assert.equal(savedRows.length, 1);
});

test("suppresses duplicate clicks while marking is in flight", async () => {
  const state = baseState();
  let resolveRpc;
  let calls = 0;
  const supabase = rpcSupabase(() => { calls += 1; return new Promise((resolve) => { resolveRpc = resolve; }); });
  const mark = createTutorMarkingController({ supabase, getCurrent: () => state });

  const first = mark({ isCorrect: false, misconceptionId: "misconception-1" });
  const duplicate = await mark({ isCorrect: false, misconceptionId: "misconception-1" });
  assert.equal(duplicate, null);
  assert.equal(calls, 1);

  resolveRpc({ data: [{ ...state.currentAnswer, is_correct: false, marked_at: "2026-09-24T09:00:00Z" }], error: null });
  await first;
});

test("does not publish a saved mark after realtime moves to another answer", async () => {
  let state = baseState();
  let resolveRpc;
  const published = [];
  const statuses = [];
  const supabase = rpcSupabase(() => new Promise((resolve) => { resolveRpc = resolve; }));
  const mark = createTutorMarkingController({ supabase, getCurrent: () => state, onSaved: (row) => published.push(row), onStatus: (message) => statuses.push(message) });

  const request = mark({ isCorrect: true });
  const original = state.currentAnswer;
  state = { ...state, currentQuestion: { id: "question-2" }, currentAnswer: { id: "answer-2", session_question_id: "question-2", student_id: "student-1" } };
  resolveRpc({ data: [{ ...original, is_correct: true, marked_at: "2026-09-24T09:00:00Z" }], error: null });
  await request;

  assert.equal(published.length, 0);
  assert.match(statuses.at(-1), /moved on/i);
});

test("refuses a stale answer before calling Supabase", async () => {
  const state = baseState();
  state.currentAnswer.session_question_id = "old-question";
  let calls = 0;
  const supabase = rpcSupabase(async () => { calls += 1; return { data: null, error: null }; });
  const mark = createTutorMarkingController({ supabase, getCurrent: () => state });

  await assert.rejects(() => mark({ isCorrect: false }), /no longer matches/i);
  assert.equal(calls, 0);
});
