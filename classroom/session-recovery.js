import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};
if (config.url && config.anonKey) {
  const supabase = createClient(config.url, config.anonKey);

  recoverStudentSession().catch(() => {
    // Recovery is best-effort. The normal join flow remains available on failure.
  });

  async function recoverStudentSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;
    if (!user?.is_anonymous) return;

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
}
