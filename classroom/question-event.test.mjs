import test from "node:test";
import assert from "node:assert/strict";
import { isCurrentSessionQuestionEvent } from "./question-event.js";

test("accepts a question belonging to the active session", () => {
  assert.equal(isCurrentSessionQuestionEvent({ session_id: "session-1" }, { id: "session-1" }), true);
});

test("rejects a question from another or stale session", () => {
  assert.equal(isCurrentSessionQuestionEvent({ session_id: "session-old" }, { id: "session-1" }), false);
});

test("rejects incomplete question or session state", () => {
  assert.equal(isCurrentSessionQuestionEvent({}, { id: "session-1" }), false);
  assert.equal(isCurrentSessionQuestionEvent({ session_id: "session-1" }, null), false);
  assert.equal(isCurrentSessionQuestionEvent(null, { id: "session-1" }), false);
});
