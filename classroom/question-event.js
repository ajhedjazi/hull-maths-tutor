export function isCurrentSessionQuestionEvent(sessionQuestion, session) {
  if (!sessionQuestion?.session_id || !session?.id) return false;
  return sessionQuestion.session_id === session.id;
}
