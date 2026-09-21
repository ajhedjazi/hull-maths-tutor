import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { extname, join } from "node:path";

const CLASSROOM_DIR = new URL("./", import.meta.url);
const BROWSER_EXTENSIONS = new Set([".js", ".html"]);
const FORBIDDEN_PATTERNS = [
  /service[_-]?role/i,
  /supabase[_-]?service[_-]?key/i,
  /SUPABASE_SERVICE_ROLE_KEY/,
];

test("browser classroom files do not contain service-role credentials", async () => {
  const entries = await readdir(CLASSROOM_DIR, { withFileTypes: true });
  const browserFiles = entries.filter(
    (entry) => entry.isFile() && BROWSER_EXTENSIONS.has(extname(entry.name)) && !entry.name.endsWith(".test.mjs"),
  );

  for (const file of browserFiles) {
    const source = await readFile(join(CLASSROOM_DIR.pathname, file.name), "utf8");
    for (const pattern of FORBIDDEN_PATTERNS) {
      assert.doesNotMatch(source, pattern, `${file.name} contains a forbidden service-role reference`);
    }
  }
});
