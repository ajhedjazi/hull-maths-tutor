export async function subscribeClassroomRealtime({
  manager,
  supabase,
  roomId,
  sessionId,
  onRoomUpdate,
  onQuestionInsert,
  onQuestionUpdate,
  onAnswerChange,
}) {
  if (!manager?.subscribe || !supabase?.channel) {
    throw new TypeError("A realtime manager and Supabase client are required");
  }
  if (!roomId || !sessionId) throw new TypeError("roomId and sessionId are required");

  await manager.subscribe("room", () =>
    supabase
      .channel(`room-${roomId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, onRoomUpdate)
  );

  await manager.subscribe("questions", () =>
    supabase
      .channel(`questions-${sessionId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "session_questions", filter: `session_id=eq.${sessionId}` }, onQuestionInsert)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "session_questions", filter: `session_id=eq.${sessionId}` }, onQuestionUpdate)
  );

  await manager.subscribe("answers", () =>
    supabase
      .channel(`answers-${sessionId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "student_answers" }, onAnswerChange)
  );
}
