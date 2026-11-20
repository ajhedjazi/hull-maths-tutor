export function isCurrentStudentAnswerEvent({ answer, currentQuestionId, roomStudentId }) {
  if (!answer || !currentQuestionId || !roomStudentId) return false;
  return answer.session_question_id === currentQuestionId && answer.student_id === roomStudentId;
}
