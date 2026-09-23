import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { sendLiveQuestion } from "./send-live-question.js";
import { createQuestionSendFlight } from "./question-send-flight.js";

// Keep question transitions atomic without exposing privileged credentials.
// This module intercepts the tutor Send action and delegates the complete
// previous-question -> next-question transition to send_live_question().
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

// Do not even construct this module's Supabase client when configuration is
// unsafe. backend-gate.js owns the user-facing remediation message.
const supabase = hasBrowserSafeConfig() ? createClient(config.url, config.anonKey) : null;
const sendFlight = createQuestionSendFlight();

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

  // Disabled buttons normally prevent a second click, but the explicit
  // single-flight guard also protects against rapid/programmatic duplicate
  // events while the atomic RPC is still unresolved.
  if (!sendFlight.tryStart()) return;

  sendButton.disabled = true;
  showMessage("Sending question…");

  try {
    const sessionId = await resolveActiveSessionId();
    await sendLiveQuestion({ supabase, sessionId, questionId });
    showMessage("Question sent live.");
  } catch (error) {
    showMessage(error?.message || "Could not send the question. Nothing was changed.", true);
  } finally {
    sendFlight.finish();
    sendButton.disabled = false;
  }
}

if (sendButton && supabase) {
  sendButton.addEventListener("click", sendAtomically, { capture: true });
}
