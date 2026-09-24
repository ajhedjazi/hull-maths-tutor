import assert from "node:assert/strict";
import { createRealtimeManager } from "./realtime-manager.js";
import { subscribeClassroomRealtime } from "./classroom-realtime.js";

const removed = [];
const timers = [];
const recovered = [];
const channels = [];

const supabase = {
  channel(name) {
    const handlers = [];
    const channel = {
      name,
      handlers,
      statusCallback: null,
      on(type, filter, callback) {
        handlers.push({ type, filter, callback });
        return channel;
      },
      subscribe(callback) {
        channel.statusCallback = callback;
        return channel;
      },
    };
    channels.push(channel);
    return channel;
  },
  async removeChannel(channel) {
    removed.push(channel.name);
  },
};

const manager = createRealtimeManager({
  supabase,
  recoveryDelayMs: 1,
  setTimer(callback) {
    const timer = { callback, cancelled: false };
    timers.push(timer);
    return timer;
  },
  clearTimer(timer) {
    timer.cancelled = true;
  },
  async onRecovered(key) {
    recovered.push(key);
  },
});

const noop = () => {};
await subscribeClassroomRealtime({
  manager,
  supabase,
  roomId: "room-1",
  sessionId: "session-1",
  onRoomUpdate: noop,
  onQuestionInsert: noop,
  onQuestionUpdate: noop,
  onAnswerChange: noop,
});

assert.equal(manager.size, 3, "room, question and answer channels are installed once");
assert.deepEqual(
  channels.map((channel) => channel.name),
  ["room-room-1", "questions-session-1", "answers-session-1"],
  "classroom subscribes to the expected scoped channels",
);

const firstAnswers = channels.find((channel) => channel.name === "answers-session-1");
assert.ok(firstAnswers?.statusCallback, "answer channel exposes its realtime status callback");

firstAnswers.statusCallback("CHANNEL_ERROR");
firstAnswers.statusCallback("TIMED_OUT");
assert.equal(manager.pendingRecoveryCount, 1, "repeated answer-channel failures coalesce into one recovery");
assert.equal(timers.length, 1, "only one reconnect timer is scheduled");

await timers[0].callback();

const answerChannels = channels.filter((channel) => channel.name === "answers-session-1");
assert.equal(answerChannels.length, 2, "reconnect creates exactly one replacement answer channel");
assert.deepEqual(removed, ["answers-session-1"], "the stale answer channel is removed before replacement");
assert.equal(manager.size, 3, "reconnect preserves exactly three active classroom subscriptions");
assert.deepEqual(recovered, ["answers"], "successful reconnect triggers exactly one authoritative reconciliation hook");

const replacementAnswers = answerChannels[1];
replacementAnswers.statusCallback("SUBSCRIBED");
assert.equal(manager.pendingRecoveryCount, 0, "healthy replacement has no pending recovery");
assert.deepEqual(recovered, ["answers"], "SUBSCRIBED does not trigger duplicate reconciliation");

await manager.clear();
assert.equal(manager.size, 0, "leaving the classroom removes all subscriptions");
assert.deepEqual(
  removed.sort(),
  ["answers-session-1", "answers-session-1", "questions-session-1", "room-room-1"].sort(),
  "cleanup removes the replacement plus the other active classroom channels exactly once",
);

console.log("classroom reconnect integration tests passed");
