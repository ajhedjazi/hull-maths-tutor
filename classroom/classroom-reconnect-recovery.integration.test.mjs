import assert from "node:assert/strict";
import { createRealtimeManager } from "./realtime-manager.js";
import { subscribeClassroomRealtime } from "./classroom-realtime.js";
import { createClassroomRecoveryHandler } from "./recovery-handler.js";

function query(result) {
  const chain = {
    select() { return chain; },
    eq() { return chain; },
    order() { return chain; },
    limit() { return Promise.resolve(result); },
    single() { return Promise.resolve(result); },
  };
  return chain;
}

const channels = [];
const reads = [];
const timers = [];
const supabase = {
  channel(name) {
    const channel = {
      name,
      statusCallback: null,
      on() { return channel; },
      subscribe(callback) { channel.statusCallback = callback; return channel; },
    };
    channels.push(channel);
    return channel;
  },
  async removeChannel() {},
  from(table) {
    reads.push(table);
    if (table === "rooms") return query({ data: { id: "room-1", student_id: "student-1", student_display_name: "Thomas" }, error: null });
    if (table === "session_questions") return query({ data: [{ id: "q-2", session_id: "session-1", question_id: "bank-2", question_text_snapshot: "What is 7 + 5?", position: 2, status: "live" }], error: null });
    if (table === "student_answers") return query({ data: [{ id: "a-2", session_question_id: "q-2", student_id: "student-1", answer_text: "12", working_text: "7 + 5 = 12", is_correct: true, marked_at: "2026-09-24T15:00:00Z" }], error: null });
    throw new Error(`Unexpected table ${table}`);
  },
};

const state = {
  role: "tutor",
  room: { id: "room-1", student_id: "student-1", student_display_name: "Thomas" },
  session: { id: "session-1", room_id: "room-1", status: "active" },
  currentQuestion: { id: "q-1", session_id: "session-1", position: 1, status: "live" },
  currentAnswer: null,
};
const applied = [];
const recover = createClassroomRecoveryHandler({
  supabase,
  getCurrent: () => state,
  applyRecovered: async (recovered) => {
    Object.assign(state, {
      room: recovered.room,
      session: recovered.session,
      currentQuestion: recovered.currentQuestion,
      currentAnswer: recovered.currentAnswer,
    });
    applied.push(recovered);
  },
});

const manager = createRealtimeManager({
  supabase,
  recoveryDelayMs: 1,
  setTimer(callback) { const timer = { callback }; timers.push(timer); return timer; },
  clearTimer() {},
  onRecovered: recover,
});

const noop = () => {};
await subscribeClassroomRealtime({
  manager,
  supabase,
  roomId: "room-1",
  sessionId: "session-1",
  onRoomUpdate: noop,
  onQuestionInsert: noop,
  onQuestionUpdate: noop,
  onAnswerChange: noop,
});

const answers = channels.find((channel) => channel.name === "answers-session-1");
assert.ok(answers?.statusCallback, "answer channel is subscribed");
answers.statusCallback("CHANNEL_ERROR");
assert.equal(timers.length, 1, "a dropped channel schedules one reconnect");

await timers[0].callback();

assert.deepEqual(reads, ["rooms", "session_questions", "student_answers"], "successful reconnect fetches one authoritative classroom snapshot");
assert.equal(applied.length, 1, "reconnect applies the authoritative snapshot exactly once");
assert.equal(state.currentQuestion.id, "q-2", "missed question is restored after reconnect");
assert.equal(state.currentAnswer.id, "a-2", "missed answer is restored after reconnect");
assert.equal(state.currentAnswer.is_correct, true, "missed tutor mark is restored after reconnect");
assert.equal(state.currentAnswer.marked_at, "2026-09-24T15:00:00Z", "mark timestamp survives recovery");
assert.equal(manager.size, 3, "recovery does not duplicate classroom subscriptions");

await manager.clear();
console.log("classroom reconnect recovery integration tests passed");
