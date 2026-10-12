import assert from "node:assert/strict";
import { createClassroomRecoveryHandler } from "./recovery-handler.js";

function query(result, gate = null) {
  const chain = {
    select() { return chain; },
    eq() { return chain; },
    order() { return chain; },
    limit() { return gate ? gate.then(() => result) : Promise.resolve(result); },
    single() { return gate ? gate.then(() => result) : Promise.resolve(result); },
  };
  return chain;
}

let releaseRoom;
const roomGate = new Promise((resolve) => { releaseRoom = resolve; });
let roomReads = 0;
const supabase = {
  from(table) {
    if (table === "rooms") {
      roomReads += 1;
      return query({ data: { id: "room-1", student_id: "student-1", student_display_name: "Thomas" }, error: null }, roomGate);
    }
    if (table === "session_questions") return query({ data: [{ id: "q-2", session_id: "session-1", position: 2, status: "live" }], error: null });
    if (table === "student_answers") return query({ data: [{ id: "a-2", session_question_id: "q-2", student_id: "student-1", answer_text: "12" }], error: null });
    throw new Error(`Unexpected table ${table}`);
  },
};

const state = {
  room: { id: "room-1" },
  session: { id: "session-1" },
  currentQuestion: { id: "q-1", session_id: "session-1", position: 1 },
  currentAnswer: null,
};
const applied = [];
const recover = createClassroomRecoveryHandler({
  supabase,
  getCurrent: () => state,
  applyRecovered: async (next) => applied.push(next),
});

const first = recover("questions");
const second = recover("answers");
assert.equal(roomReads, 1, "simultaneous channel recoveries should share one snapshot fetch");
releaseRoom();
const [firstResult, secondResult] = await Promise.all([first, second]);
assert.equal(firstResult.currentQuestion.id, "q-2");
assert.equal(secondResult.currentAnswer.id, "a-2");
assert.equal(applied.length, 1, "coalesced recovery should update the UI once");

let releaseStale;
const staleGate = new Promise((resolve) => { releaseStale = resolve; });
const staleSupabase = {
  from(table) {
    if (table === "rooms") return query({ data: { id: "room-1", student_id: null }, error: null }, staleGate);
    if (table === "session_questions") return query({ data: [], error: null });
    throw new Error(`Unexpected table ${table}`);
  },
};
const mutableState = { room: { id: "room-1" }, session: { id: "session-1" }, currentQuestion: null, currentAnswer: null };
let staleApplied = false;
const recoverStale = createClassroomRecoveryHandler({
  supabase: staleSupabase,
  getCurrent: () => mutableState,
  applyRecovered: async () => { staleApplied = true; },
});
const staleRun = recoverStale();
mutableState.room = { id: "room-2" };
mutableState.session = { id: "session-2" };
releaseStale();
const staleResult = await staleRun;
assert.equal(staleResult.ignored, true);
assert.equal(staleResult.reason, "room-changed");
assert.equal(staleApplied, false, "stale recovery must not update the new classroom");

await assert.rejects(
  async () => createClassroomRecoveryHandler({ supabase, getCurrent: null, applyRecovered: async () => {} }),
  /getCurrent/,
);

console.log("recovery-handler tests passed");
