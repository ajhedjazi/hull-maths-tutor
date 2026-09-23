import test from "node:test";
import assert from "node:assert/strict";

import { isCurrentRoomEvent } from "./room-event.js";
import { isCurrentSessionQuestionEvent } from "./question-event.js";
import { isCurrentStudentAnswerEvent } from "./answer-event.js";

function applyRealtimeEvent(state, type, row) {
  if (type === "room") {
    if (isCurrentRoomEvent(row, state.room)) state.room = row;
    return;
  }

  if (type === "question") {
    if (isCurrentSessionQuestionEvent(row, state.session)) {
      state.currentQuestion = row;
      state.currentAnswer = null;
    }
    return;
  }

  if (type === "answer") {
    if (isCurrentStudentAnswerEvent({
      answer: row,
      currentQuestionId: state.currentQuestion?.id,
      roomStudentId: state.room?.student_id,
    })) state.currentAnswer = row;
  }
}

test("live classroom accepts the active room/question/student sequence", () => {
  const state = {
    room: { id: "room-1", student_id: null },
    session: { id: "session-1" },
    currentQuestion: null,
    currentAnswer: null,
  };

  applyRealtimeEvent(state, "room", { id: "room-1", student_id: "student-1" });
  applyRealtimeEvent(state, "question", { id: "question-1", session_id: "session-1" });
  applyRealtimeEvent(state, "answer", {
    id: "answer-1",
    session_question_id: "question-1",
    student_id: "student-1",
  });

  assert.equal(state.room.student_id, "student-1");
  assert.equal(state.currentQuestion.id, "question-1");
  assert.equal(state.currentAnswer.id, "answer-1");
});

test("stale room, question and answer events cannot disturb the active lesson", () => {
  const state = {
    room: { id: "room-1", student_id: "student-1" },
    session: { id: "session-1" },
    currentQuestion: { id: "question-2", session_id: "session-1" },
    currentAnswer: {
      id: "answer-2",
      session_question_id: "question-2",
      student_id: "student-1",
    },
  };

  applyRealtimeEvent(state, "room", { id: "room-old", student_id: "student-old" });
  applyRealtimeEvent(state, "question", { id: "question-old", session_id: "session-old" });
  applyRealtimeEvent(state, "answer", {
    id: "answer-old-question",
    session_question_id: "question-old",
    student_id: "student-1",
  });
  applyRealtimeEvent(state, "answer", {
    id: "answer-other-student",
    session_question_id: "question-2",
    student_id: "student-other",
  });

  assert.equal(state.room.id, "room-1");
  assert.equal(state.room.student_id, "student-1");
  assert.equal(state.currentQuestion.id, "question-2");
  assert.equal(state.currentAnswer.id, "answer-2");
});

test("a new valid question clears the previous answer before accepting the new one", () => {
  const state = {
    room: { id: "room-1", student_id: "student-1" },
    session: { id: "session-1" },
    currentQuestion: { id: "question-1", session_id: "session-1" },
    currentAnswer: {
      id: "answer-1",
      session_question_id: "question-1",
      student_id: "student-1",
    },
  };

  applyRealtimeEvent(state, "question", { id: "question-2", session_id: "session-1" });
  assert.equal(state.currentQuestion.id, "question-2");
  assert.equal(state.currentAnswer, null);

  applyRealtimeEvent(state, "answer", {
    id: "late-answer-1",
    session_question_id: "question-1",
    student_id: "student-1",
  });
  assert.equal(state.currentAnswer, null);

  applyRealtimeEvent(state, "answer", {
    id: "answer-2",
    session_question_id: "question-2",
    student_id: "student-1",
  });
  assert.equal(state.currentAnswer.id, "answer-2");
});
