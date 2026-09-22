import assert from "node:assert/strict";
import { applyRecoverySnapshot } from "./recovery-state.js";

const room = { id: "room-1", room_code: "ABC123", student_display_name: "Sam" };
const session = { id: "session-1" };
const q1 = { id: "q1", session_id: "session-1", position: 1, status: "live" };
const q2 = { id: "q2", session_id: "session-1", position: 2, status: "live" };
const a1 = { id: "a1", session_question_id: "q1", answer_text: "12" };
const a2 = { id: "a2", session_question_id: "q2", answer_text: "7" };

{
  const current = { room, session, currentQuestion: q1, currentAnswer: a1 };
  const refreshedRoom = { ...room, student_display_name: "Sam Taylor" };
  const result = applyRecoverySnapshot(current, { room: refreshedRoom, question: q1, answer: a1 });
  assert.equal(result.ignored, false);
  assert.equal(result.questionChanged, false);
  assert.equal(result.room.student_display_name, "Sam Taylor");
  assert.equal(result.currentAnswer, a1);
}

{
  const current = { room, session, currentQuestion: q1, currentAnswer: a1 };
  const result = applyRecoverySnapshot(current, { room, question: q2, answer: a2 });
  assert.equal(result.ignored, false);
  assert.equal(result.questionChanged, true);
  assert.equal(result.currentQuestion, q2);
  assert.equal(result.currentAnswer, a2);
}

{
  const current = { room, session, currentQuestion: q1, currentAnswer: a1 };
  const result = applyRecoverySnapshot(current, { room, question: null, answer: null });
  assert.equal(result.currentQuestion, null);
  assert.equal(result.currentAnswer, null);
  assert.equal(result.questionChanged, true);
}

{
  const current = { room, session, currentQuestion: q1, currentAnswer: a1 };
  const result = applyRecoverySnapshot(current, { room: { id: "room-2" }, question: q2, answer: a2 });
  assert.equal(result.ignored, true);
  assert.equal(result.reason, "room-changed");
  assert.equal(result.currentQuestion, q1);
}

{
  const current = { room, session, currentQuestion: q1, currentAnswer: a1 };
  const result = applyRecoverySnapshot(current, { room, question: { ...q2, session_id: "session-2" }, answer: a2 });
  assert.equal(result.ignored, true);
  assert.equal(result.reason, "session-changed");
  assert.equal(result.currentQuestion, q1);
}

assert.throws(() => applyRecoverySnapshot(null, { room }), /current classroom state is required/);
assert.throws(() => applyRecoverySnapshot({ room, session }, null), /snapshot is required/);
assert.throws(() => applyRecoverySnapshot({ room, session }, { room: {} }), /snapshot.room.id is required/);

console.log("recovery-state tests passed");
