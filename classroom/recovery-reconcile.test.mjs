import assert from "node:assert/strict";
import { reconcileRecoveredClassroom } from "./recovery-reconcile.js";

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

function supabaseFor({ room, question, answer }) {
  return {
    from(table) {
      if (table === "rooms") return query({ data: room, error: null });
      if (table === "session_questions") return query({ data: question ? [question] : [], error: null });
      if (table === "student_answers") return query({ data: answer ? [answer] : [], error: null });
      throw new Error(`Unexpected table ${table}`);
    },
  };
}

const room = { id: "room-1", room_code: "ABC123", student_display_name: "Student", status: "active" };
const session = { id: "session-1", room_id: "room-1" };
const question = { id: "question-2", session_id: "session-1", question_id: "bank-2", question_text_snapshot: "Solve x + 4 = 9", position: 2, status: "live" };
const answer = { id: "answer-2", session_question_id: "question-2", answer_text: "5", working_text: "9 - 4", is_correct: null };

const current = {
  role: "student",
  room: { ...room, student_display_name: "Old name" },
  session,
  currentQuestion: { id: "question-1", session_id: "session-1", position: 1, status: "completed" },
  currentAnswer: { id: "answer-1", session_question_id: "question-1" },
};

const recovered = await reconcileRecoveredClassroom({
  supabase: supabaseFor({ room, question, answer }),
  current,
  roomId: room.id,
  sessionId: session.id,
});
assert.equal(recovered.ignored, false);
assert.equal(recovered.questionChanged, true);
assert.equal(recovered.currentQuestion.id, "question-2");
assert.equal(recovered.currentAnswer.id, "answer-2");
assert.equal(recovered.room.student_display_name, "Student");

const moved = await reconcileRecoveredClassroom({
  supabase: supabaseFor({ room, question, answer }),
  current: { ...current, room: { id: "room-elsewhere" } },
  roomId: room.id,
  sessionId: session.id,
});
assert.equal(moved.ignored, true);
assert.equal(moved.reason, "room-changed");
assert.equal(moved.room.id, "room-elsewhere");

await assert.rejects(
  () => reconcileRecoveredClassroom({ supabase: supabaseFor({ room, question, answer }), current, roomId: "", sessionId: session.id }),
  /roomId and sessionId are required/
);

console.log("recovery reconciliation composition tests passed");
