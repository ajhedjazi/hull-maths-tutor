// Keep question/answer state transitions deterministic across realtime events.
// A realtime UPDATE for the current question must not discard the answer being marked.
export function applyQuestionState(currentQuestion, currentAnswer, nextQuestion) {
  const isNewQuestion = currentQuestion?.id !== nextQuestion?.id;

  return {
    currentQuestion: nextQuestion,
    currentAnswer: isNewQuestion ? null : currentAnswer,
    isNewQuestion,
  };
}
