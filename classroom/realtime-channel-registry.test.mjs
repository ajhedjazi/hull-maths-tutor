import test from "node:test";
import assert from "node:assert/strict";
import { createRealtimeChannelRegistry } from "./realtime-channel-registry.js";

test("replacing a keyed channel removes the previous subscription first", async () => {
  const removed = [];
  const registry = createRealtimeChannelRegistry(async (channel) => removed.push(channel.id));

  const first = await registry.replace("answers", () => ({ id: "answers-1" }));
  const second = await registry.replace("answers", () => ({ id: "answers-2" }));

  assert.equal(first.id, "answers-1");
  assert.equal(second.id, "answers-2");
  assert.deepEqual(removed, ["answers-1"]);
  assert.equal(registry.size, 1);
  assert.equal(registry.has("answers"), true);
});

test("clear forgets channels before awaiting cleanup and tolerates cleanup failure", async () => {
  const removed = [];
  const registry = createRealtimeChannelRegistry(async (channel) => {
    removed.push(channel.id);
    if (channel.id === "questions") throw new Error("socket already gone");
  });

  await registry.replace("room", () => ({ id: "room" }));
  await registry.replace("questions", () => ({ id: "questions" }));
  await registry.replace("answers", () => ({ id: "answers" }));

  await registry.clear();

  assert.equal(registry.size, 0);
  assert.deepEqual(removed.sort(), ["answers", "questions", "room"]);
});

test("remove is idempotent", async () => {
  let removals = 0;
  const registry = createRealtimeChannelRegistry(async () => { removals += 1; });
  await registry.replace("room", () => ({ id: "room" }));

  assert.equal(await registry.remove("room"), true);
  assert.equal(await registry.remove("room"), false);
  assert.equal(removals, 1);
});
