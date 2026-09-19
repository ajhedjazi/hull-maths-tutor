import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};
const status = document.querySelector("#header-status");
const setupWarning = document.querySelector("#setup-warning");
const entryView = document.querySelector("#entry-view");

function setStatus(label, online = false) {
  const text = status?.querySelector("span:last-child");
  if (text) text.textContent = label;
  status?.classList.toggle("is-online", online);
}

function setEntryDisabled(disabled) {
  entryView?.querySelectorAll("button, input, select, textarea").forEach((control) => {
    if (!control.classList.contains("back-button")) control.disabled = disabled;
  });
}

async function verifyBackend() {
  if (!config.url || !config.anonKey) return;

  setStatus("Verifying backend…", false);
  setEntryDisabled(true);

  try {
    const client = createClient(config.url, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    // A tiny read proves the REST endpoint, publishable key and classroom schema
    // are reachable. RLS may legitimately return zero rows; that still proves
    // the backend path used by the classroom is alive.
    const { error } = await client.from("questions").select("id").limit(1);
    if (error) throw error;

    setupWarning.hidden = true;
    setEntryDisabled(false);
    setStatus("Backend connected", true);
  } catch (error) {
    console.error("Classroom backend health check failed", error);
    setStatus("Backend unavailable", false);
    setEntryDisabled(true);
    if (setupWarning) {
      setupWarning.hidden = false;
      const heading = setupWarning.querySelector("strong");
      const detail = setupWarning.querySelector("p");
      if (heading) heading.textContent = "Classroom backend is temporarily unavailable.";
      if (detail) detail.textContent = "The classroom could not verify its database connection. Please try again shortly.";
    }
  }
}

verifyBackend();
