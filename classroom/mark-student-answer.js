function oneRow(data) {
  if (Array.isArray(data)) return data.length === 1 ? data[0] : null;
  return data && typeof data === "object" ? data : null;
}

export function validateMarkedAnswer(data, { answerId, sessionQuestionId, studentId, isCorrect }) {
  const answer = oneRow(data);
  if (!answer) throw new Error("Marking returned an unexpected result. Refresh the classroom and try again.");
  if (answer.id !== answerId || answer.session_question_id !== sessionQuestionId || answer.student_id !== studentId) {
    throw new Error("Marked answer did not match the current student response. Refresh the classroom and try again.");
  }
  if (answer.is_correct !== isCorrect || !answer.marked_at) {
    throw new Error("Marking was not confirmed by the classroom backend. Refresh the classroom and try again.");
  }
  return answer;
}

export async function markStudentAnswerRpc({ supabase, answerId, sessionQuestionId, studentId, isCorrect, misconceptionId = null }) {
  if (!supabase) throw new Error("Classroom backend is unavailable.");
  if (!answerId || !sessionQuestionId || !studentId) throw new Error("Wait for the student's current answer before marking.");
  if (typeof isCorrect !== "boolean") throw new Error("Choose correct or incorrect before marking.");

  const { data, error } = await supabase.rpc("mark_student_answer", {
    p_answer_id: answerId,
    p_is_correct: isCorrect,
    p_misconception_id: isCorrect ? null : (misconceptionId || null)
  });
  if (error) throw error;

  return validateMarkedAnswer(data, { answerId, sessionQuestionId, studentId, isCorrect });
}
