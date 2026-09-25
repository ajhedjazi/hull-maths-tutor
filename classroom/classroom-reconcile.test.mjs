import test from "node:test";
import assert from "node:assert/strict";
import { fetchClassroomSnapshot } from "./classroom-reconcile.js";

function query(result, filters = null) {
  const chain = {
    select: () => chain,
    eq: (column, value) => { filters?.push([column, value]); return chain; },
    order: () => chain,
    limit: async () => result,
    single: async () => result,
  };
  return chain;
}

test("fetchClassroomSnapshot returns authoritative room, latest question and answer", async () => {
  const room = { id: "room-1", student_id: "student-1", status: "active" };
  const question = { id: "sq-2", session_id: "session-1", position: 2 };
  const answer = { id: "answer-1", session_question_id: "sq-2", student_id: "student-1", is_correct: true };
  const calls = [];
  const answerFilters = [];
  const supabase = {
    from(table) {
      calls.push(table);
      if (table === "rooms") return query({ data: room, error: null });
      if (table === "session_questions") return query({ data: [question], error: null });
      if (table === "student_answers") return query({ data: [answer], error: null }, answerFilters);
      throw new Error(`Unexpected table ${table}`);
    },
  };

  assert.deepEqual(await fetchClassroomSnapshot({ supabase, roomId: "room-1", sessionId: "session-1" }), { room, question, answer });
  assert.deepEqual(calls, ["rooms", "session_questions", "student_answers"]);
  assert.deepEqual(answerFilters, [["session_question_id", "sq-2"], ["student_id", "student-1"]]);
});

test("fetchClassroomSnapshot skips answer lookup when there is no question", async () => {
  const calls = [];
  const supabase = {
    from(table) {
      calls.push(table);
      if (table === "rooms") return query({ data: { id: "room-1", student_id: "student-1" }, error: null });
      if (table === "session_questions") return query({ data: [], error: null });
      throw new Error("answer lookup should not run");
    },
  };

  const snapshot = await fetchClassroomSnapshot({ supabase, roomId: "room-1", sessionId: "session-1" });
  assert.equal(snapshot.question, null);
  assert.equal(snapshot.answer, null);
  assert.deepEqual(calls, ["rooms", "session_questions"]);
});

test("fetchClassroomSnapshot skips answer lookup while a room has no student", async () => {
  const calls = [];
  const supabase = {
    from(table) {
      calls.push(table);
      if (table === "rooms") return query({ data: { id: "room-1", student_id: null }, error: null });
      if (table === "session_questions") return query({ data: [{ id: "sq-1", session_id: "session-1" }], error: null });
      throw new Error("answer lookup should not run before a student joins");
    },
  };

  const snapshot = await fetchClassroomSnapshot({ supabase, roomId: "room-1", sessionId: "session-1" });
  assert.equal(snapshot.answer, null);
  assert.deepEqual(calls, ["rooms", "session_questions"]);
});

test("fetchClassroomSnapshot propagates contextual Supabase failures", async () => {
  const supabase = {
    from(table) {
      if (table === "rooms") return query({ data: { id: "room-1", student_id: "student-1" }, error: null });
      return query({ data: null, error: { message: "network unavailable" } });
    },
  };

  await assert.rejects(
    fetchClassroomSnapshot({ supabase, roomId: "room-1", sessionId: "session-1" }),
    /Could not refresh current question: network unavailable/,
  );
});

test("fetchClassroomSnapshot validates recovery identifiers", async () => {
  const supabase = { from() { throw new Error("should not query"); } };
  await assert.rejects(fetchClassroomSnapshot({ supabase, roomId: "", sessionId: "session-1" }), /roomId is required/);
  await assert.rejects(fetchClassroomSnapshot({ supabase, roomId: "room-1", sessionId: "" }), /sessionId is required/);
});
