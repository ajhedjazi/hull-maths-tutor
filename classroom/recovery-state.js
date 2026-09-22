import { applyQuestionState } from "./question-state.js";

function requireSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") throw new TypeError("snapshot is required");
  if (!snapshot.room?.id) throw new TypeError("snapshot.room.id is required");
}

export function applyRecoverySnapshot(current, snapshot) {
  if (!current || typeof current !== "object") throw new TypeError("current classroom state is required");
  requireSnapshot(snapshot);

  if (!current.room?.id || current.room.id !== snapshot.room.id) {
    return { ...current, ignored: true, reason: "room-changed" };
  }

  const snapshotQuestion = snapshot.question || null;
  const currentQuestion = current.currentQuestion || null;

  if (!snapshotQuestion) {
    return {
      ...current,
      room: snapshot.room,
      currentQuestion: null,
      currentAnswer: null,
      ignored: false,
      questionChanged: Boolean(currentQuestion),
    };
  }

  if (current.session?.id && snapshotQuestion.session_id !== current.session.id) {
    return { ...current, ignored: true, reason: "session-changed" };
  }

  const questionState = applyQuestionState(currentQuestion, current.currentAnswer || null, snapshotQuestion);

  return {
    ...current,
    room: snapshot.room,
    currentQuestion: questionState.currentQuestion,
    currentAnswer: snapshot.answer || questionState.currentAnswer,
    ignored: false,
    questionChanged: questionState.isNewQuestion,
  };
}
