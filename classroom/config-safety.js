// Fail closed before any classroom module constructs a Supabase client.
// Publishable/anon keys are browser-safe; secret/service-role credentials are not.
(function guardBrowserSupabaseConfig() {
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

  function isUnsafeBrowserKey(key) {
    const value = String(key || "").trim();
    if (!value) return false;
    if (value.startsWith("sb_secret_")) return true;
    return decodeJwtPayload(value)?.role === "service_role";
  }

  if (isUnsafeBrowserKey(config.anonKey)) {
    // Remove the credential before classroom.js or any helper module can read it.
    window.HMT_SUPABASE_CONFIG = {};
    window.HMT_SUPABASE_CONFIG_BLOCKED = true;
    console.error("Hull Maths Tutor: blocked an unsafe Supabase browser credential. Use a publishable/anon key instead.");
  }
})();
