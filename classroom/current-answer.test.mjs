import test from "node:test";
import assert from "node:assert/strict";
import { fetchCurrentStudentAnswer } from "./current-answer.js";

function makeSupabase({ data = null, error = null } = {}) {
  const calls = [];
  const query = {
    select(columns) { calls.push(["select", columns]); return this; },
    eq(column, value) { calls.push(["eq", column, value]); return this; },
    async maybeSingle() { calls.push(["maybeSingle"]); return { data, error }; }
  };
  return {
    calls,
    client: {
      from(table) { calls.push(["from", table]); return query; }
    }
  };
}

test("loads the answer only for the active question and room student", async () => {
  const answer = { id: "answer-1", session_question_id: "sq-1", student_id: "student-1" };
  const { client, calls } = makeSupabase({ data: answer });

  const result = await fetchCurrentStudentAnswer({
    supabase: client,
    sessionQuestionId: "sq-1",
    studentId: "student-1"
  });

  assert.equal(result, answer);
  assert.deepEqual(calls.filter(([name]) => name === "eq"), [
    ["eq", "session_question_id", "sq-1"],
    ["eq", "student_id", "student-1"]
  ]);
  assert.deepEqual(calls.at(-1), ["maybeSingle"]);
});

test("does not query answers while a tutor room is waiting for a student", async () => {
  const { client, calls } = makeSupabase();
  const result = await fetchCurrentStudentAnswer({ supabase: client, sessionQuestionId: "sq-1", studentId: null });
  assert.equal(result, null);
  assert.deepEqual(calls, []);
});

test("returns null when the active student has not answered yet", async () => {
  const { client } = makeSupabase({ data: null });
  assert.equal(await fetchCurrentStudentAnswer({ supabase: client, sessionQuestionId: "sq-1", studentId: "student-1" }), null);
});

test("surfaces database failures with current-answer context", async () => {
  const { client } = makeSupabase({ error: { message: "network unavailable" } });
  await assert.rejects(
    fetchCurrentStudentAnswer({ supabase: client, sessionQuestionId: "sq-1", studentId: "student-1" }),
    /Could not load the current student answer: network unavailable/
  );
});

test("rejects missing question identifiers", async () => {
  const { client } = makeSupabase();
  await assert.rejects(
    fetchCurrentStudentAnswer({ supabase: client, sessionQuestionId: "", studentId: "student-1" }),
    /sessionQuestionId is required/
  );
});
