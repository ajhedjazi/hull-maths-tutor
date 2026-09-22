import assert from "node:assert/strict";
import { createRealtimeManager } from "./realtime-manager.js";

const removed = [];
const timers = [];
const supabase = { async removeChannel(channel) { removed.push(channel.name); } };
const setTimer = (callback) => { const timer = { callback, cancelled: false }; timers.push(timer); return timer; };
const clearTimer = (timer) => { timer.cancelled = true; };

const manager = createRealtimeManager({ supabase, recoveryDelayMs: 1, setTimer, clearTimer });
let generation = 0;
const statuses = new Map();
const factory = () => {
  generation += 1;
  const channel = {
    name: `answers-${generation}`,
    subscribe(callback) { statuses.set(channel.name, callback); return channel; },
  };
  return channel;
};

await manager.subscribe("answers", factory);
assert.equal(manager.size, 1, "first subscription is registered");
assert.equal(generation, 1, "first channel is created once");

statuses.get("answers-1")("CHANNEL_ERROR");
statuses.get("answers-1")("TIMED_OUT");
assert.equal(manager.pendingRecoveryCount, 1, "repeated failure statuses coalesce into one recovery");
assert.equal(timers.length, 1, "only one recovery timer is scheduled");

await timers[0].callback();
assert.equal(generation, 2, "recovery creates one replacement channel");
assert.deepEqual(removed, ["answers-1"], "stale channel is removed before replacement");
assert.equal(manager.size, 1, "replacement does not duplicate the registry entry");

statuses.get("answers-2")("CHANNEL_ERROR");
assert.equal(manager.pendingRecoveryCount, 1, "replacement channel can schedule recovery");
statuses.get("answers-2")("SUBSCRIBED");
assert.equal(manager.pendingRecoveryCount, 0, "successful subscription cancels pending recovery");
assert.equal(timers[1].cancelled, true, "pending timer is cancelled after reconnect");

statuses.get("answers-2")("CHANNEL_ERROR");
assert.equal(manager.pendingRecoveryCount, 1, "a later failure can schedule recovery again");
await manager.clear();
assert.equal(manager.size, 0, "clear removes all registered channels");
assert.equal(manager.pendingRecoveryCount, 0, "clear cancels pending recovery work");
assert.equal(timers[2].cancelled, true, "clear cancels the outstanding timer");
assert.deepEqual(removed, ["answers-1", "answers-2"], "clear removes the active channel exactly once");

console.log("realtime-manager tests passed");
