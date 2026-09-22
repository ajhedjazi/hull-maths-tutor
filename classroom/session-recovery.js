import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};

function decodeJwtPayload(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function hasBrowserSafeConfig() {
  if (!config.url || !config.anonKey) return false;

  try {
    if (new URL(config.url).protocol !== "https:") return false;
  } catch {
    return false;
  }

  const key = String(config.anonKey).trim();
  if (!key || key.startsWith("sb_secret_")) return false;
  return decodeJwtPayload(key)?.role !== "service_role";
}

// Recovery is browser-only: never construct a client from a privileged key.
if (hasBrowserSafeConfig()) {
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

    // classroom.js restores the live question and marking result. Restore the
    // student's submitted working/answer too so a refresh returns them to the
    // same lesson state rather than showing blank inputs.
    await restoreStudentAnswer(room.id, user.id);
  }

  async function restoreStudentAnswer(roomId, studentId) {
    const classroomView = document.querySelector("#classroom-view");
    const workingInput = document.querySelector("#student-working");
    const answerInput = document.querySelector("#student-answer");
    const saveState = document.querySelector("#student-save-state");
    if (!classroomView || !workingInput || !answerInput) return;

    const deadline = Date.now() + 5000;
    while (Date.now() < deadline && classroomView.hidden) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (classroomView.hidden) return;

    // Recovery queries can take long enough for a student to start typing.
    // Only replace fields that are still unchanged when the saved answer arrives.
    const workingBeforeRecovery = workingInput.value;
    const answerBeforeRecovery = answerInput.value;

    const { data: lessonSession, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("room_id", roomId)
      .eq("student_id", studentId)
      .eq("status", "active")
      .single();
    if (sessionError || !lessonSession) return;

    const { data: sessionQuestions, error: questionError } = await supabase
      .from("session_questions")
      .select("id, position")
      .eq("session_id", lessonSession.id)
      .order("position", { ascending: false })
      .limit(1);
    if (questionError || !sessionQuestions?.length) return;

    const { data: answers, error: answerError } = await supabase
      .from("student_answers")
      .select("answer_text, working_text, is_correct, submitted_at")
      .eq("session_question_id", sessionQuestions[0].id)
      .eq("student_id", studentId)
      .limit(1);
    if (answerError || !answers?.length) return;

    const submitted = answers[0];
    const workingUnchanged = workingInput.value === workingBeforeRecovery;
    const answerUnchanged = answerInput.value === answerBeforeRecovery;

    if (workingUnchanged) workingInput.value = submitted.working_text || "";
    if (answerUnchanged) answerInput.value = submitted.answer_text || "";

    if (saveState && workingUnchanged && answerUnchanged) {
      saveState.textContent = submitted.is_correct === null
        ? "Your submitted answer has been restored."
        : "Your marked answer has been restored.";
    }
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
