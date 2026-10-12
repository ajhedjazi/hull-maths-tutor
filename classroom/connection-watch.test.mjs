import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("./connection-watch.js", import.meta.url), "utf8");

assert.match(source, /HEALTH_CHECK_TIMEOUT_MS\s*=\s*8000/, "health checks should be bounded");
assert.match(source, /Promise\.race\(\[healthCheck, timeout\]\)/, "health checks should race the timeout");
assert.match(source, /if \(checkInFlight \|\| !navigator\.onLine\) return false/, "duplicate or offline checks should be skipped");
assert.match(source, /window\.addEventListener\("offline", showOfflineState\)/, "offline transitions should be handled");
assert.match(source, /window\.addEventListener\("online"/, "online recovery should be handled");
assert.match(source, /if \(!navigator\.onLine\) showOfflineState\(\)/, "offline startup should be handled");
assert.match(source, /visibilitychange/, "visible-tab recovery should be handled");
assert.match(source, /if \(!document\.hidden\) checkBackend/, "hidden tabs should not poll the backend");
assert.doesNotMatch(source, /service[_-]?role/i, "browser recovery code must not contain service-role credentials");
assert.doesNotMatch(source, /secret[_-]?key/i, "browser recovery code must not contain secret-key credentials");

console.log("connection-watch regression checks passed");
