function oneRow(data) {
  if (Array.isArray(data)) return data.length === 1 ? data[0] : null;
  return data && typeof data === "object" ? data : null;
}

export function validateSubmittedAnswer(data, { sessionQuestionId, studentId, answerText, workingText }) {
  const answer = oneRow(data);
  if (!answer) throw new Error("Answer submission returned an unexpected result. Refresh the classroom and try again.");
  if (answer.session_question_id !== sessionQuestionId || answer.student_id !== studentId) {
    throw new Error("Answer submission did not match this student and question. Refresh the classroom and try again.");
  }
  if (answer.answer_text !== answerText || answer.working_text !== workingText) {
    throw new Error("Answer submission returned stale content. Refresh the classroom before trying again.");
  }
  return answer;
}

export async function submitStudentAnswerRpc({ supabase, sessionQuestionId, studentId, answerText = "", workingText = "" }) {
  if (!supabase) throw new Error("Classroom backend is unavailable.");
  if (!sessionQuestionId || !studentId) throw new Error("Wait for the live question before submitting.");

  const answer = answerText.trim();
  const working = workingText.trim();
  if (!answer && !working) throw new Error("Add some working or an answer first.");

  const { data, error } = await supabase.rpc("submit_student_answer", {
    p_session_question_id: sessionQuestionId,
    p_answer_text: answer,
    p_working_text: working
  });
  if (error) throw error;

  return validateSubmittedAnswer(data, {
    sessionQuestionId,
    studentId,
    answerText: answer,
    workingText: working
  });
}
