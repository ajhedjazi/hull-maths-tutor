export async function resolveActiveSessionId({ supabase, roomCode, tutorId }) {
  const code = String(roomCode || "").trim();
  if (!supabase) throw new Error("Classroom backend is unavailable.");
  if (!tutorId) throw new Error("Tutor identity is required before sending a question.");
  if (!code || code === "------") throw new Error("Open a live room before sending a question.");

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, tutor_id")
    .eq("room_code", code)
    .eq("status", "active")
    .single();
  if (roomError) throw roomError;
  if (!room?.id) throw new Error("This room is no longer active. Refresh before sending a question.");
  if (room.tutor_id !== tutorId) {
    throw new Error("This live room does not belong to the signed-in tutor. Refresh before sending a question.");
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, room_id, tutor_id")
    .eq("room_id", room.id)
    .eq("status", "active")
    .single();
  if (sessionError) throw sessionError;
  if (!session?.id || session.room_id !== room.id || session.tutor_id !== tutorId) {
    throw new Error("No active lesson session was found for this tutor and room. Refresh before sending a question.");
  }

  return session.id;
}
