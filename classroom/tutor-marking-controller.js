import { markStudentAnswerRpc } from "./mark-student-answer.js";

export function createTutorMarkingController({ supabase, getCurrent, onSaved = () => {}, onStatus = () => {} }) {
  let pending = false;

  return async function markCurrentAnswer({ isCorrect, misconceptionId = null }) {
    if (pending) return null;

    const current = getCurrent?.() || {};
    const answer = current.currentAnswer;
    const question = current.currentQuestion;
    const studentId = current.room?.student_id;

    if (!answer || !question || !studentId) {
      const error = new Error("Wait for the student's current answer before marking.");
      onStatus(error.message, true);
      throw error;
    }
    if (answer.session_question_id !== question.id || answer.student_id !== studentId) {
      const error = new Error("The response no longer matches the current student question. Refresh the classroom and try again.");
      onStatus(error.message, true);
      throw error;
    }

    const context = { answerId: answer.id, sessionQuestionId: question.id, studentId };
    pending = true;
    onStatus("Saving diagnosis…", false);

    try {
      const saved = await markStudentAnswerRpc({
        supabase,
        ...context,
        isCorrect,
        misconceptionId: isCorrect ? null : (misconceptionId || null)
      });

      const latest = getCurrent?.() || {};
      if (latest.currentAnswer?.id !== context.answerId || latest.currentQuestion?.id !== context.sessionQuestionId || latest.room?.student_id !== context.studentId) {
        onStatus("Mark saved, but the classroom has moved on to another response.", false);
        return saved;
      }

      onSaved(saved);
      onStatus(isCorrect ? "Marked correct. Skill profile updated." : "Marked incorrect. Diagnostic data saved.", false);
      return saved;
    } catch (error) {
      onStatus(error?.message || "Could not save the mark. Please try again.", true);
      throw error;
    } finally {
      pending = false;
    }
  };
}
