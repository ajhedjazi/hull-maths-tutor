import assert from "node:assert/strict";
import test from "node:test";
import { sendLiveQuestion } from "./send-live-question.js";

const sentRow = {
  id: "sq-2",
  session_id: "session-1",
  question_id: "question-2",
  status: "live",
};

test("delegates the complete question transition to send_live_question RPC", async () => {
  const calls = [];
  const supabase = {
    rpc: async (name, args) => {
      calls.push([name, args]);
      return { data: sentRow, error: null };
    },
  };

  const result = await sendLiveQuestion({ supabase, sessionId: "session-1", questionId: "question-2" });

  assert.deepEqual(calls, [["send_live_question", {
    p_session_id: "session-1",
    p_question_id: "question-2",
  }]]);
  assert.deepEqual(result, sentRow);
});

test("does not call Supabase when required state is missing", async () => {
  let calls = 0;
  const supabase = { rpc: async () => { calls += 1; return { data: null, error: null }; } };

  await assert.rejects(() => sendLiveQuestion({ supabase, sessionId: "", questionId: "q" }), /Open a live room/);
  await assert.rejects(() => sendLiveQuestion({ supabase, sessionId: "s", questionId: "" }), /Choose a question/);
  assert.equal(calls, 0);
});

test("surfaces RPC failure without attempting a client-side fallback", async () => {
  let calls = 0;
  const expected = new Error("transaction rejected");
  const supabase = {
    rpc: async () => {
      calls += 1;
      return { data: null, error: expected };
    },
  };

  await assert.rejects(
    () => sendLiveQuestion({ supabase, sessionId: "session-1", questionId: "question-2" }),
    expected,
  );
  assert.equal(calls, 1);
});

test("normalises single-row RPC array responses", async () => {
  const supabase = { rpc: async () => ({ data: [sentRow], error: null }) };
  assert.deepEqual(
    await sendLiveQuestion({ supabase, sessionId: "session-1", questionId: "question-2" }),
    sentRow,
  );
});

test("fails closed when the RPC returns no inserted question", async () => {
  const supabase = { rpc: async () => ({ data: null, error: null }) };
  await assert.rejects(
    () => sendLiveQuestion({ supabase, sessionId: "session-1", questionId: "question-2" }),
    /returned no live question/,
  );
});

test("fails closed when the RPC returns more than one row", async () => {
  const supabase = { rpc: async () => ({ data: [sentRow, { ...sentRow, id: "sq-3" }], error: null }) };
  await assert.rejects(
    () => sendLiveQuestion({ supabase, sessionId: "session-1", questionId: "question-2" }),
    /ambiguous result/,
  );
});

test("rejects a response that does not match the requested classroom state", async () => {
  for (const badRow of [
    { ...sentRow, session_id: "other-session" },
    { ...sentRow, question_id: "other-question" },
    { ...sentRow, status: "completed" },
  ]) {
    const supabase = { rpc: async () => ({ data: badRow, error: null }) };
    await assert.rejects(
      () => sendLiveQuestion({ supabase, sessionId: "session-1", questionId: "question-2" }),
      /unexpected classroom state/,
    );
  }
});
