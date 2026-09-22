import assert from "node:assert/strict";
import { subscribeClassroomRealtime } from "./classroom-realtime.js";

const registrations = [];
const subscribed = [];
const callbacks = {
  onRoomUpdate() {},
  onQuestionInsert() {},
  onQuestionUpdate() {},
  onAnswerChange() {},
};

function makeChannel(name) {
  return {
    name,
    on(type, filter, callback) {
      registrations.push({ name, type, filter, callback });
      return this;
    },
  };
}

const supabase = { channel: (name) => makeChannel(name) };
const manager = {
  async subscribe(key, factory) {
    subscribed.push({ key, channel: factory() });
  },
};

await subscribeClassroomRealtime({
  manager,
  supabase,
  roomId: "room-123",
  sessionId: "session-456",
  ...callbacks,
});

assert.deepEqual(subscribed.map(({ key }) => key), ["room", "questions", "answers"]);
assert.deepEqual(subscribed.map(({ channel }) => channel.name), [
  "room-room-123",
  "questions-session-456",
  "answers-session-456",
]);

assert.equal(registrations.length, 4);
assert.deepEqual(registrations[0].filter, {
  event: "UPDATE", schema: "public", table: "rooms", filter: "id=eq.room-123",
});
assert.equal(registrations[0].callback, callbacks.onRoomUpdate);
assert.deepEqual(registrations[1].filter, {
  event: "INSERT", schema: "public", table: "session_questions", filter: "session_id=eq.session-456",
});
assert.equal(registrations[1].callback, callbacks.onQuestionInsert);
assert.deepEqual(registrations[2].filter, {
  event: "UPDATE", schema: "public", table: "session_questions", filter: "session_id=eq.session-456",
});
assert.equal(registrations[2].callback, callbacks.onQuestionUpdate);
assert.deepEqual(registrations[3].filter, {
  event: "*", schema: "public", table: "student_answers",
});
assert.equal(registrations[3].callback, callbacks.onAnswerChange);

await assert.rejects(
  () => subscribeClassroomRealtime({ manager, supabase, roomId: "", sessionId: "session-456" }),
  /roomId and sessionId are required/,
);

console.log("classroom-realtime: 11 assertions passed");
