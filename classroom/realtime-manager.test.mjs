import assert from "node:assert/strict";
import { createRealtimeManager } from "./realtime-manager.js";

const removed = [];
const timers = [];
const recovered = [];
const supabase = { async removeChannel(channel) { removed.push(channel.name); } };
const setTimer = (callback) => { const timer = { callback, cancelled: false }; timers.push(timer); return timer; };
const clearTimer = (timer) => { timer.cancelled = true; };

const manager = createRealtimeManager({
  supabase,
  recoveryDelayMs: 1,
  setTimer,
  clearTimer,
  async onRecovered(key) { recovered.push(key); },
});
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
assert.deepEqual(recovered, [], "initial subscription does not run recovery reconciliation");

statuses.get("answers-1")("CHANNEL_ERROR");
statuses.get("answers-1")("TIMED_OUT");
assert.equal(manager.pendingRecoveryCount, 1, "repeated failure statuses coalesce into one recovery");
assert.equal(timers.length, 1, "only one recovery timer is scheduled");

await timers[0].callback();
assert.equal(generation, 2, "recovery creates one replacement channel");
assert.deepEqual(removed, ["answers-1"], "stale channel is removed before replacement");
assert.equal(manager.size, 1, "replacement does not duplicate the registry entry");
assert.deepEqual(recovered, ["answers"], "successful recovery requests snapshot reconciliation for the recovered key");

statuses.get("answers-2")("CHANNEL_ERROR");
assert.equal(manager.pendingRecoveryCount, 1, "replacement channel can schedule recovery");
statuses.get("answers-2")("SUBSCRIBED");
assert.equal(manager.pendingRecoveryCount, 0, "successful subscription cancels pending recovery");
assert.equal(timers[1].cancelled, true, "pending timer is cancelled after reconnect");
assert.deepEqual(recovered, ["answers"], "a normal subscribed status does not duplicate reconciliation");

statuses.get("answers-2")("CHANNEL_ERROR");
assert.equal(manager.pendingRecoveryCount, 1, "a later failure can schedule recovery again");
await manager.clear();
assert.equal(manager.size, 0, "clear removes all registered channels");
assert.equal(manager.pendingRecoveryCount, 0, "clear cancels pending recovery work");
assert.equal(timers[2].cancelled, true, "clear cancels the outstanding timer");
assert.deepEqual(removed, ["answers-1", "answers-2"], "clear removes the active channel exactly once");

const hookTimers = [];
const hookErrors = [];
let hookGeneration = 0;
let reconciliationAttempts = 0;
const hookStatuses = new Map();
const hookManager = createRealtimeManager({
  supabase,
  recoveryDelayMs: 1,
  setTimer(callback) { const timer = { callback, cancelled: false }; hookTimers.push(timer); return timer; },
  clearTimer,
});
const hookFactory = () => {
  hookGeneration += 1;
  const channel = {
    name: `hook-${hookGeneration}`,
    subscribe(callback) { hookStatuses.set(channel.name, callback); return channel; },
  };
  return channel;
};
await hookManager.subscribe("questions", hookFactory);
hookManager.setRecoveryHooks({
  async onRecovered() {
    reconciliationAttempts += 1;
    if (reconciliationAttempts === 1) throw new Error("snapshot fetch failed");
  },
  onRecoveryError(error, key) { hookErrors.push({ message: error.message, key }); },
});
hookStatuses.get("hook-1")("CHANNEL_ERROR");
await hookTimers[0].callback();
assert.equal(hookGeneration, 2, "channel recovery succeeds when hooks are bound after manager creation");
assert.equal(hookManager.size, 1, "failed reconciliation keeps the healthy replacement channel");
assert.deepEqual(hookErrors, [{ message: "snapshot fetch failed", key: "questions" }], "reconciliation failures are reported with their channel key");
assert.equal(hookManager.pendingRecoveryCount, 1, "failed snapshot reconciliation schedules a retry");
assert.equal(hookTimers.length, 2, "snapshot retry is scheduled independently of channel replacement");
await hookTimers[1].callback();
assert.equal(reconciliationAttempts, 2, "authoritative snapshot reconciliation is retried");
assert.equal(hookGeneration, 2, "snapshot retry does not churn an already healthy realtime channel");
assert.equal(hookManager.pendingRecoveryCount, 0, "successful snapshot retry clears degraded recovery state");
await hookManager.clear();

assert.throws(() => createRealtimeManager({ supabase, onRecovered: true }), /onRecovered must be a function/, "invalid recovery hooks fail fast");
assert.throws(() => createRealtimeManager({ supabase, onRecoveryError: true }), /onRecoveryError must be a function/, "invalid recovery error hooks fail fast");
assert.throws(() => manager.setRecoveryHooks({ onRecovered: true }), /onRecovered must be a function/, "invalid late-bound recovery hooks fail fast");
assert.throws(() => manager.setRecoveryHooks({ onRecoveryError: true }), /onRecoveryError must be a function/, "invalid late-bound recovery error hooks fail fast");

console.log("realtime-manager tests passed");
