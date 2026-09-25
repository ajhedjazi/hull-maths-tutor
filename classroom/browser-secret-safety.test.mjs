import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const CONFIG_FILE = new URL("./config.js", import.meta.url);

// The public classroom config may contain only the Supabase URL and anon key.
// Guard comments may mention forbidden key types; executable config fields may not.
test("browser config exposes only public Supabase settings", async () => {
  const source = await readFile(CONFIG_FILE, "utf8");

  assert.match(source, /anonKey\s*:/, "config.js should expose an anonKey field");
  assert.doesNotMatch(source, /service[_-]?role(?:Key)?\s*:/i, "config.js must never define a service-role key field");
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/, "config.js must never expose the server service-role environment key");
  assert.doesNotMatch(source, /secretKey\s*:/i, "config.js must not expose a generic secret key field");
});
