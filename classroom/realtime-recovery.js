const RECOVERABLE_STATUSES = new Set(["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"]);

export function isRecoverableRealtimeStatus(status) {
  return RECOVERABLE_STATUSES.has(status);
}

export function createRealtimeRecovery({ replaceChannel, delayMs = 750, setTimer = setTimeout, clearTimer = clearTimeout }) {
  if (typeof replaceChannel !== "function") throw new TypeError("replaceChannel must be a function");

  const timers = new Map();

  function cancel(key) {
    const timer = timers.get(key);
    if (timer === undefined) return false;
    timers.delete(key);
    clearTimer(timer);
    return true;
  }

  function handleStatus(key, status) {
    if (status === "SUBSCRIBED") {
      cancel(key);
      return false;
    }
    if (!isRecoverableRealtimeStatus(status) || timers.has(key)) return false;

    const timer = setTimer(async () => {
      timers.delete(key);
      await replaceChannel(key);
    }, delayMs);
    timers.set(key, timer);
    return true;
  }

  function clear() {
    [...timers.keys()].forEach(cancel);
  }

  return { handleStatus, cancel, clear, get pendingCount() { return timers.size; } };
}
