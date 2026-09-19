import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};
if (config.url && config.anonKey) {
  const supabase = createClient(config.url, config.anonKey);

  recoverSession().catch(() => {
    // Recovery is best-effort. The normal student join and tutor lobby flows remain available.
  });

  async function recoverSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;
    if (!user) return;

    if (user.is_anonymous) {
      await recoverStudentSession(user);
      return;
    }

    await recoverTutorSession(user);
  }

  async function recoverStudentSession(user) {
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("id, room_code, student_id, student_display_name, created_at, status")
      .eq("student_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !rooms?.length) return;

    const room = rooms[0];
    const studentButton = document.querySelector('[data-role="student"]');
    const studentName = document.querySelector("#student-name");
    const roomCode = document.querySelector("#room-code-input");
    const joinForm = document.querySelector("#student-join-form");
    const joinMessage = document.querySelector("#student-join-message");

    if (!studentButton || !studentName || !roomCode || !joinForm) return;

    studentButton.click();
    studentName.value = room.student_display_name || "Student";
    roomCode.value = room.room_code;
    if (joinMessage) joinMessage.textContent = "Rejoining your live lesson…";

    // claim_room is deliberately idempotent for the same anonymous student,
    // so the normal join path re-validates the room/session before entry.
    joinForm.requestSubmit();
  }

  async function recoverTutorSession(user) {
    // Let classroom.js finish auth initialisation and render the tutor lobby first.
    const tutorButton = document.querySelector('[data-role="tutor"]');
    const activeRooms = document.querySelector("#active-rooms");
    const lobbyMessage = document.querySelector("#tutor-lobby-message");
    if (!tutorButton || !activeRooms) return;

    tutorButton.click();

    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("id, room_code, student_id, student_display_name, created_at, status")
      .eq("tutor_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(2);

    if (error || rooms?.length !== 1) return;

    const room = rooms[0];
    if (lobbyMessage) lobbyMessage.textContent = "Reopening your live lesson…";

    // Reuse the existing tutor lobby button rather than bypassing classroom.js.
    // This keeps all normal session validation, state loading and realtime setup in one path.
    const deadline = Date.now() + 4000;
    while (Date.now() < deadline) {
      const roomButton = activeRooms.querySelector(`[data-room-id="${CSS.escape(room.id)}"]`);
      if (roomButton) {
        roomButton.click();
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (lobbyMessage) lobbyMessage.textContent = "Your active room is ready below.";
  }
}
