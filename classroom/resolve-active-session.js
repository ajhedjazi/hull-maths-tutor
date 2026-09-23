export async function resolveActiveSessionId({ supabase, roomCode }) {
  const code = String(roomCode || "").trim();
  if (!supabase) throw new Error("Classroom backend is unavailable.");
  if (!code || code === "------") throw new Error("Open a live room before sending a question.");

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id")
    .eq("room_code", code)
    .eq("status", "active")
    .single();
  if (roomError) throw roomError;
  if (!room?.id) throw new Error("This room is no longer active. Refresh before sending a question.");

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, room_id")
    .eq("room_id", room.id)
    .eq("status", "active")
    .single();
  if (sessionError) throw sessionError;
  if (!session?.id || session.room_id !== room.id) {
    throw new Error("No active lesson session was found for this room. Refresh before sending a question.");
  }

  return session.id;
}
