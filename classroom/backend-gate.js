import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};
const status = document.querySelector("#header-status");
const setupWarning = document.querySelector("#setup-warning");
const entryView = document.querySelector("#entry-view");
const BACKEND_CHECK_TIMEOUT_MS = 8000;

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

function validatePublicConfig() {
  if (!config.url || !config.anonKey) {
    throw new Error("Supabase URL and public key are required.");
  }

  let url;
  try {
    url = new URL(config.url);
  } catch {
    throw new Error("Supabase URL is invalid.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Supabase URL must use HTTPS.");
  }

  const key = String(config.anonKey).trim();
  if (!key) throw new Error("Supabase public key is missing.");

  // Modern Supabase publishable keys are explicitly safe for browser use.
  // Legacy anon JWTs are also supported, but service-role JWTs must never be
  // allowed into the classroom client.
  if (key.startsWith("sb_secret_")) {
    throw new Error("A Supabase secret key cannot be used in the browser.");
  }

  const payload = decodeJwtPayload(key);
  if (payload?.role === "service_role") {
    throw new Error("A Supabase service-role key cannot be used in the browser.");
  }
}

function showBackendFailure(message) {
  setStatus("Backend unavailable", false);
  setEntryDisabled(true);

  if (!setupWarning) return;
  setupWarning.hidden = false;
  const heading = setupWarning.querySelector("strong");
  const detail = setupWarning.querySelector("p");
  if (heading) heading.textContent = "Classroom backend is unavailable.";
  if (detail) detail.textContent = message;
}

async function verifyBackend() {
  setStatus("Verifying backend…", false);
  setEntryDisabled(true);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), BACKEND_CHECK_TIMEOUT_MS);

  try {
    validatePublicConfig();

    const client = createClient(config.url, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    // A tiny read proves the REST endpoint, public key and classroom schema are
    // reachable. RLS may legitimately return zero rows; that still proves the
    // backend path used by the classroom is alive. Abort rather than leaving the
    // entry controls disabled forever when the network or backend stalls.
    const { error } = await client.from("questions").select("id").limit(1).abortSignal(controller.signal);
    if (error) throw error;

    setupWarning.hidden = true;
    setEntryDisabled(false);
    setStatus("Backend connected", true);
  } catch (error) {
    console.error("Classroom backend health check failed", error);
    const unsafeKey = /secret key|service-role key/i.test(error?.message || "");
    const timedOut = controller.signal.aborted;
    showBackendFailure(
      unsafeKey
        ? "The classroom configuration contains a privileged Supabase key. Replace it with the project's publishable/anon key before continuing."
        : timedOut
          ? "The classroom backend did not respond within 8 seconds. Check your connection and try again."
          : "The classroom could not verify its database connection. Please try again shortly.",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

verifyBackend();
