const ROOM_FIELDS = "id, room_code, tutor_id, student_id, student_display_name, status, created_at, closed_at";
const QUESTION_FIELDS = "id, session_id, question_id, question_text_snapshot, position, status, sent_at";
const ANSWER_FIELDS = "id, session_question_id, student_id, answer_text, working_text, is_correct, tutor_feedback, submitted_at, marked_at";

function requireValue(value, label) {
  if (!value) throw new TypeError(`${label} is required`);
}

function throwIfError(error, context) {
  if (!error) return;
  const wrapped = new Error(`${context}: ${error.message || "Supabase request failed"}`);
  wrapped.cause = error;
  throw wrapped;
}

export async function fetchClassroomSnapshot({ supabase, roomId, sessionId }) {
  if (!supabase?.from) throw new TypeError("A Supabase client with from() is required");
  requireValue(roomId, "roomId");
  requireValue(sessionId, "sessionId");

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select(ROOM_FIELDS)
    .eq("id", roomId)
    .single();
  throwIfError(roomError, "Could not refresh room");

  const { data: questions, error: questionError } = await supabase
    .from("session_questions")
    .select(QUESTION_FIELDS)
    .eq("session_id", sessionId)
    .order("position", { ascending: false })
    .limit(1);
  throwIfError(questionError, "Could not refresh current question");

  const question = questions?.[0] || null;
  let answer = null;

  if (question && room?.student_id) {
    const { data: answers, error: answerError } = await supabase
      .from("student_answers")
      .select(ANSWER_FIELDS)
      .eq("session_question_id", question.id)
      .eq("student_id", room.student_id)
      .order("submitted_at", { ascending: false })
      .limit(1);
    throwIfError(answerError, "Could not refresh current answer");
    answer = answers?.[0] || null;
  }

  return { room, question, answer };
}
