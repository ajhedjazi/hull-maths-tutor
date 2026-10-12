import test from "node:test";
import assert from "node:assert/strict";
import { isCurrentRoomEvent } from "./room-event.js";

test("accepts an update for the room currently open", () => {
  assert.equal(isCurrentRoomEvent({ id: "room-1" }, { id: "room-1" }), true);
});

test("rejects an update from another or stale room", () => {
  assert.equal(isCurrentRoomEvent({ id: "room-old" }, { id: "room-1" }), false);
});

test("rejects incomplete room state", () => {
  assert.equal(isCurrentRoomEvent({}, { id: "room-1" }), false);
  assert.equal(isCurrentRoomEvent({ id: "room-1" }, null), false);
  assert.equal(isCurrentRoomEvent(null, { id: "room-1" }), false);
});
