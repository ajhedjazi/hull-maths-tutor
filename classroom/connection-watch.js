import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};
const headerStatus = document.querySelector("#header-status");
const classroomMessage = document.querySelector("#classroom-message");

if (config.url && config.anonKey && headerStatus) {
  const supabase = createClient(config.url, config.anonKey);
  let checkInFlight = false;
  let lastHealthy = true;

  const setStatus = (label, online) => {
    const text = headerStatus.querySelector("span:last-child");
    if (text) text.textContent = label;
    headerStatus.classList.toggle("is-online", online);
  };

  const setClassroomNotice = (message, isError = false) => {
    if (!classroomMessage || document.querySelector("#classroom-view")?.hidden) return;
    classroomMessage.textContent = message;
    classroomMessage.classList.toggle("is-error", isError);
  };

  async function checkBackend({ announceRecovery = false } = {}) {
    if (checkInFlight || !navigator.onLine) return false;
    checkInFlight = true;

    try {
      // A tiny authenticated read verifies that the browser can actually reach
      // the configured Supabase project, rather than trusting navigator.onLine.
      const { error } = await supabase.from("questions").select("id").limit(1);
      if (error) throw error;

      const recovered = !lastHealthy;
      lastHealthy = true;
      setStatus("Backend connected", true);
      if (recovered && announceRecovery) {
        setClassroomNotice("Connection restored. Live lesson updates are available again.");
      }
      return true;
    } catch (_error) {
      lastHealthy = false;
      setStatus("Reconnecting…", false);
      setClassroomNotice("Connection interrupted. Your lesson is still open; wait for the connection to return before sending or marking work.", true);
      return false;
    } finally {
      checkInFlight = false;
    }
  }

  window.addEventListener("offline", () => {
    lastHealthy = false;
    setStatus("Offline", false);
    setClassroomNotice("You are offline. Keep this page open; live lesson updates will resume when your connection returns.", true);
  });

  window.addEventListener("online", () => {
    setStatus("Reconnecting…", false);
    checkBackend({ announceRecovery: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkBackend({ announceRecovery: true });
  });

  // Re-check periodically while a lesson tab is left open. This catches cases
  // where Wi-Fi remains connected but Supabase itself is temporarily unreachable.
  window.setInterval(() => checkBackend({ announceRecovery: true }), 30000);
}
