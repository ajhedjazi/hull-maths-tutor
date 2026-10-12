import assert from "node:assert/strict";
import test from "node:test";
import { createRealtimeRecovery, isRecoverableRealtimeStatus } from "./realtime-recovery.js";

test("classifies Supabase realtime failure statuses", () => {
  assert.equal(isRecoverableRealtimeStatus("CHANNEL_ERROR"), true);
  assert.equal(isRecoverableRealtimeStatus("TIMED_OUT"), true);
  assert.equal(isRecoverableRealtimeStatus("CLOSED"), true);
  assert.equal(isRecoverableRealtimeStatus("SUBSCRIBED"), false);
});

test("coalesces repeated failures into one channel replacement", async () => {
  const replacements = [];
  const queued = [];
  const recovery = createRealtimeRecovery({
    replaceChannel: async (key) => replacements.push(key),
    setTimer: (callback) => { queued.push(callback); return queued.length; },
    clearTimer: () => {},
  });

  assert.equal(recovery.handleStatus("answers", "CHANNEL_ERROR"), true);
  assert.equal(recovery.handleStatus("answers", "TIMED_OUT"), false);
  assert.equal(recovery.pendingCount, 1);
  await queued[0]();
  assert.deepEqual(replacements, ["answers"]);
  assert.equal(recovery.pendingCount, 0);
});

test("successful subscription cancels pending recovery", () => {
  const cancelled = [];
  const recovery = createRealtimeRecovery({
    replaceChannel: async () => {},
    setTimer: () => 42,
    clearTimer: (timer) => cancelled.push(timer),
  });

  recovery.handleStatus("questions", "CHANNEL_ERROR");
  assert.equal(recovery.handleStatus("questions", "SUBSCRIBED"), false);
  assert.deepEqual(cancelled, [42]);
  assert.equal(recovery.pendingCount, 0);
});
