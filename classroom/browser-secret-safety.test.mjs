import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const CONFIG_FILE = new URL("./config.js", import.meta.url);

// The public classroom config may contain only the Supabase URL and anon key.
// Guard code elsewhere is allowed to mention service-role keys so it can reject them.
test("browser config exposes only public Supabase settings", async () => {
  const source = await readFile(CONFIG_FILE, "utf8");

  assert.match(source, /anonKey\s*:/, "config.js should expose an anonKey field");
  assert.doesNotMatch(source, /service[_-]?role/i, "config.js must never reference a service-role key");
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/, "config.js must never expose the server service-role environment key");
  assert.doesNotMatch(source, /secretKey\s*:/i, "config.js must not expose a generic secret key field");
});
