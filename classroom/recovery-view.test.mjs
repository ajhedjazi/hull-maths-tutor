import assert from "node:assert/strict";
import { applyRecoveredClassroomView } from "./recovery-view.js";

function recovered(overrides = {}) {
  return {
    ignored: false,
    room: { id: "room-1", student_display_name: "Sam" },
    session: { id: "session-1", room_id: "room-1" },
    currentQuestion: { id: "question-2", position: 2, status: "live" },
    currentAnswer: { id: "answer-2", session_question_id: "question-2", answer_text: "12" },
    ...overrides,
  };
}

{
  const state = { room: { id: "room-1" }, session: { id: "session-1" }, currentQuestion: { id: "question-1" }, currentAnswer: null };
  const calls = [];
  const result = applyRecoveredClassroomView({
    recovered: recovered(), state, role: "student",
    renderQuestion(question) { calls.push(["question", question.id]); state.currentAnswer = null; },
    renderAnswer(answer) { calls.push(["answer", answer.id]); },
    setStudentName(name) { calls.push(["name", name]); },
  });
  assert.equal(result, true);
  assert.equal(state.currentQuestion.id, "question-2");
  assert.equal(state.currentAnswer.id, "answer-2", "answer survives renderQuestion reset");
  assert.deepEqual(calls, [["name", "Sam"], ["question", "question-2"], ["answer", "answer-2"]]);
}

{
  const state = { room: {}, session: {}, currentQuestion: {}, currentAnswer: {} };
  let cleared = 0;
  applyRecoveredClassroomView({
    recovered: recovered({ currentQuestion: null, currentAnswer: null }), state, role: "student",
    renderQuestion() { throw new Error("must not render a missing question"); },
    renderAnswer() { throw new Error("must not render a missing answer"); },
    clearQuestion() { cleared += 1; },
  });
  assert.equal(cleared, 1);
  assert.equal(state.currentQuestion, null);
  assert.equal(state.currentAnswer, null);
}

{
  const state = { room: { id: "room-1" } };
  let masteryLoads = 0;
  applyRecoveredClassroomView({
    recovered: recovered({ currentAnswer: null }), state, role: "tutor",
    renderQuestion() {}, renderAnswer() {}, loadMastery() { masteryLoads += 1; },
  });
  assert.equal(masteryLoads, 1);
}

{
  const state = { room: { id: "room-current" } };
  const result = applyRecoveredClassroomView({ recovered: { ignored: true }, state, role: "student", renderQuestion() {}, renderAnswer() {} });
  assert.equal(result, false);
  assert.equal(state.room.id, "room-current");
}

console.log("recovery view regression checks passed");
