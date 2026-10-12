export async function fetchCurrentStudentAnswer({ supabase, sessionQuestionId, studentId }) {
  if (!supabase?.from) throw new TypeError("A Supabase client with from() is required");
  if (!sessionQuestionId) throw new TypeError("sessionQuestionId is required");

  // Tutor rooms can exist before a student joins. In that state there cannot be
  // a legitimate answer, and an unscoped lookup risks surfacing stale data.
  if (!studentId) return null;

  const { data, error } = await supabase
    .from("student_answers")
    .select("id, session_question_id, student_id, answer_text, working_text, is_correct, tutor_feedback, submitted_at, marked_at")
    .eq("session_question_id", sessionQuestionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) throw new Error(`Could not load the current student answer: ${error.message}`);
  if (!data) return null;

  // Treat the query filters as necessary but not sufficient. Recovery runs after
  // reconnects, so never render an answer unless the returned row still belongs
  // to the exact active question and student we asked for.
  if (data.session_question_id !== sessionQuestionId || data.student_id !== studentId) {
    throw new Error("Could not load the current student answer: Supabase returned an answer outside the active question or student.");
  }

  return data;
}
