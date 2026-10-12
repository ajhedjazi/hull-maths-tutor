import assert from "node:assert/strict";
import { applyQuestionState } from "./question-state.js";

const answer = { id: "answer-1", answer_text: "42" };
const firstQuestion = { id: "question-1", status: "live" };
const sameQuestionUpdate = { id: "question-1", status: "completed" };
const nextQuestion = { id: "question-2", status: "live" };

const same = applyQuestionState(firstQuestion, answer, sameQuestionUpdate);
assert.equal(same.isNewQuestion, false, "same-question realtime updates must not be treated as a new question");
assert.equal(same.currentAnswer, answer, "same-question realtime updates must preserve the submitted answer");
assert.equal(same.currentQuestion, sameQuestionUpdate, "same-question realtime updates must keep the latest question payload");

const next = applyQuestionState(firstQuestion, answer, nextQuestion);
assert.equal(next.isNewQuestion, true, "a different question must be treated as new");
assert.equal(next.currentAnswer, null, "a different question must clear the previous answer");
assert.equal(next.currentQuestion, nextQuestion, "a different question must become current");

const initial = applyQuestionState(null, answer, firstQuestion);
assert.equal(initial.isNewQuestion, true, "the first rendered question must be treated as new");
assert.equal(initial.currentAnswer, null, "initial render must not inherit a stale answer");

console.log("question-state: 8 assertions passed");
