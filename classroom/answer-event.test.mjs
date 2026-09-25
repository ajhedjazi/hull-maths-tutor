import assert from "node:assert/strict";
import { isCurrentStudentAnswerEvent } from "./answer-event.js";

const current = {
  answer: { session_question_id: "question-1", student_id: "student-1" },
  currentQuestionId: "question-1",
  roomStudentId: "student-1",
};

assert.equal(isCurrentStudentAnswerEvent(current), true);
assert.equal(isCurrentStudentAnswerEvent({ ...current, answer: { ...current.answer, session_question_id: "question-old" } }), false);
assert.equal(isCurrentStudentAnswerEvent({ ...current, answer: { ...current.answer, student_id: "student-other" } }), false);
assert.equal(isCurrentStudentAnswerEvent({ ...current, roomStudentId: null }), false);
assert.equal(isCurrentStudentAnswerEvent({ ...current, currentQuestionId: null }), false);
assert.equal(isCurrentStudentAnswerEvent({ ...current, answer: null }), false);

console.log("answer-event: 6 assertions passed");
