import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Keep question transitions atomic without exposing privileged credentials.
// This module intercepts the tutor Send action and delegates the complete
// previous-question -> next-question transition to send_live_question().
const config = window.HMT_SUPABASE_CONFIG || {};
const supabase = config.url && config.anonKey ? createClient(config.url, config.anonKey) : null;

const sendButton = document.querySelector("#send-question");
const questionPicker = document.querySelector("#question-picker");
const roomCodeBadge = document.querySelector("#room-code-badge");
const classroomMessage = document.querySelector("#classroom-message");

function showMessage(message, isError = false) {
  if (!classroomMessage) return;
  classroomMessage.textContent = message;
  classroomMessage.classList.toggle("is-error", isError);
}

async function resolveActiveSessionId() {
  const roomCode = roomCodeBadge?.textContent?.trim();
  if (!roomCode || roomCode === "------") throw new Error("Open a live room before sending a question.");

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id")
    .eq("room_code", roomCode)
    .eq("status", "active")
    .single();
  if (roomError) throw roomError;

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id")
    .eq("room_id", room.id)
    .eq("status", "active")
    .single();
  if (sessionError) throw sessionError;

  return session.id;
}

async function sendAtomically(event) {
  if (!supabase || !sendButton || !questionPicker) return;

  // Capture phase prevents classroom.js's legacy two-write handler from
  // running. Realtime remains responsible for rendering the inserted row.
  event.preventDefault();
  event.stopImmediatePropagation();

  const questionId = questionPicker.value;
  if (!questionId) {
    showMessage("Choose a question first.", true);
    return;
  }

  sendButton.disabled = true;
  showMessage("Sending question…");

  try {
    const sessionId = await resolveActiveSessionId();
    const { error } = await supabase.rpc("send_live_question", {
      p_session_id: sessionId,
      p_question_id: questionId,
    });
    if (error) throw error;

    showMessage("Question sent live.");
  } catch (error) {
    showMessage(error?.message || "Could not send the question. Nothing was changed.", true);
  } finally {
    sendButton.disabled = false;
  }
}

if (sendButton) {
  sendButton.addEventListener("click", sendAtomically, { capture: true });
}
