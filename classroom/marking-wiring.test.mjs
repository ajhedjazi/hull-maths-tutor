import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("./classroom.js", import.meta.url), "utf8");

assert.match(source, /import \{ createMarkingFlight \} from "\.\/marking-flight\.js";/, "classroom imports the marking flight guard");
assert.match(source, /const markingFlight = createMarkingFlight\(\);/, "classroom creates one marking flight guard");

const markStart = source.indexOf("async function markAnswer(");
assert.notEqual(markStart, -1, "production classroom defines markAnswer");
const nextFunction = source.indexOf("\nasync function ", markStart + 1);
const markSource = source.slice(markStart, nextFunction === -1 ? source.length : nextFunction);

assert.match(markSource, /markingFlight\.run\(/, "markAnswer executes persistence inside the single-flight guard");
assert.match(markSource, /setMarkingBusy\(true\)/, "markAnswer disables marking controls before persistence");
assert.match(markSource, /finally\s*\{[^}]*setMarkingBusy\(false\)/s, "markAnswer restores marking controls in finally");
assert.match(markSource, /if \(!result\.started\) return;/, "markAnswer ignores a duplicate concurrent mark attempt");
assert.match(markSource, /const answerId = state\.currentAnswer\.id;/, "markAnswer snapshots the answer id before async work");

console.log("marking-wiring: 8 assertions passed");
