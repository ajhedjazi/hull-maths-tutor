import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("./classroom.js", import.meta.url), "utf8");

assert.match(source, /import \{ createRealtimeManager \} from "\.\/realtime-manager\.js";/);
assert.match(source, /import \{ subscribeClassroomRealtime \} from "\.\/classroom-realtime\.js";/);
assert.match(source, /const realtimeManager = supabase \? createRealtimeManager\(\{ supabase \}\) : null;/);
assert.doesNotMatch(source, /channels:\s*\[\]/);
assert.match(source, /async function unsubscribeAll\(\) \{ if \(!realtimeManager\) return; await realtimeManager\.clear\(\); \}/);
assert.match(source, /await subscribeToClassroomRealtime\(\)/);
assert.match(source, /subscribeClassroomRealtime\(\{ manager: realtimeManager, supabase, roomId: state\.room\.id, sessionId: state\.session\.id,/);
assert.doesNotMatch(source, /state\.channels\.push/);
assert.doesNotMatch(source, /function subscribeToRoom\(/);
assert.doesNotMatch(source, /function subscribeToQuestions\(/);
assert.doesNotMatch(source, /function subscribeToAnswers\(/);
assert.match(source, /async function leaveClassroomView\(\) \{ await unsubscribeAll\(\);/);
assert.match(source, /async function signOutTutor\(\) \{ await unsubscribeAll\(\);/);

console.log("realtime-production-wiring: 13 assertions passed");
