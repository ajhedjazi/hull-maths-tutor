import { submitStudentAnswerRpc } from "./submit-student-answer.js";

export function createStudentAnswerSubmitController({ supabase, getCurrent, onSaved, onStatus }) {
  let pending = false;

  return async function submitCurrentStudentAnswer({ answerText = "", workingText = "" } = {}) {
    if (pending) return null;

    const current = getCurrent?.() || {};
    const sessionQuestionId = current.currentQuestion?.id;
    const studentId = current.user?.id;
    if (!sessionQuestionId || !studentId) {
      const error = new Error("Wait for a question before submitting.");
      onStatus?.(error.message, true);
      throw error;
    }

    pending = true;
    onStatus?.("Sending…", false);
    try {
      const saved = await submitStudentAnswerRpc({
        supabase,
        sessionQuestionId,
        studentId,
        answerText,
        workingText
      });
      onSaved?.(saved);
      onStatus?.("Answer sent to your tutor.", false);
      return saved;
    } catch (error) {
      onStatus?.(error?.message || "Could not send your answer. Please try again.", true);
      throw error;
    } finally {
      pending = false;
    }
  };
}
