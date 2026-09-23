function normaliseRpcRow(data) {
  return Array.isArray(data) ? data[0] ?? null : data ?? null;
}

function validateSentQuestion(row, { sessionId, questionId }) {
  if (!row?.id) throw new Error("Question send returned no live question. Please try again.");
  if (row.session_id !== sessionId || row.question_id !== questionId || row.status !== "live") {
    throw new Error("Question send returned unexpected classroom state. Please refresh the room before sending again.");
  }
  return row;
}

export async function sendLiveQuestion({ supabase, sessionId, questionId }) {
  if (!supabase) throw new Error("Classroom backend is unavailable.");
  if (!sessionId) throw new Error("Open a live room before sending a question.");
  if (!questionId) throw new Error("Choose a question first.");

  const { data, error } = await supabase.rpc("send_live_question", {
    p_session_id: sessionId,
    p_question_id: questionId,
  });

  if (error) throw error;
  return validateSentQuestion(normaliseRpcRow(data), { sessionId, questionId });
}
