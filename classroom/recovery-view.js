export function applyRecoveredClassroomView({ recovered, state, role, renderQuestion, renderAnswer, clearQuestion, setStudentName, loadMastery }) {
  if (!recovered || recovered.ignored) return false;
  if (!state || typeof state !== "object") throw new TypeError("state is required");
  if (typeof renderQuestion !== "function" || typeof renderAnswer !== "function") throw new TypeError("render callbacks are required");

  state.room = recovered.room;
  state.session = recovered.session;
  state.currentQuestion = recovered.currentQuestion;
  state.currentAnswer = recovered.currentAnswer;

  if (typeof setStudentName === "function") {
    setStudentName(recovered.room?.student_display_name || "Waiting for student");
  }

  if (recovered.currentQuestion) {
    // renderQuestion owns the question-change reset semantics. Restore the answer
    // afterwards because renderQuestion may intentionally clear it for a new question.
    const answer = recovered.currentAnswer;
    renderQuestion(recovered.currentQuestion);
    state.currentAnswer = answer;
    if (answer) renderAnswer(answer);
  } else if (typeof clearQuestion === "function") {
    clearQuestion();
  }

  if (role === "tutor" && typeof loadMastery === "function") loadMastery();
  return true;
}
