import { createRealtimeChannelRegistry } from "./realtime-channel-registry.js";
import { createRealtimeRecovery } from "./realtime-recovery.js";

export function createRealtimeManager({ supabase, recoveryDelayMs = 750, setTimer = setTimeout, clearTimer = clearTimeout, onRecovered, onRecoveryError }) {
  if (!supabase?.removeChannel) throw new TypeError("A Supabase client with removeChannel is required");
  if (onRecovered !== undefined && typeof onRecovered !== "function") throw new TypeError("onRecovered must be a function");
  if (onRecoveryError !== undefined && typeof onRecoveryError !== "function") throw new TypeError("onRecoveryError must be a function");

  let recoveredHook = onRecovered;
  let recoveryErrorHook = onRecoveryError;
  const factories = new Map();
  const reconciliationTimers = new Map();
  const registry = createRealtimeChannelRegistry((channel) => supabase.removeChannel(channel));

  function setRecoveryHooks({ onRecovered: nextRecovered, onRecoveryError: nextError } = {}) {
    if (nextRecovered !== undefined && typeof nextRecovered !== "function") throw new TypeError("onRecovered must be a function");
    if (nextError !== undefined && typeof nextError !== "function") throw new TypeError("onRecoveryError must be a function");
    recoveredHook = nextRecovered;
    recoveryErrorHook = nextError;
  }

  function cancelReconciliation(key) {
    const timer = reconciliationTimers.get(key);
    if (timer === undefined) return false;
    reconciliationTimers.delete(key);
    clearTimer(timer);
    return true;
  }

  async function reconcile(key) {
    if (!recoveredHook || !factories.has(key)) return true;
    try {
      await recoveredHook(key);
      cancelReconciliation(key);
      return true;
    } catch (error) {
      if (recoveryErrorHook) recoveryErrorHook(error, key);
      if (!reconciliationTimers.has(key) && factories.has(key)) {
        const timer = setTimer(async () => {
          reconciliationTimers.delete(key);
          await reconcile(key);
        }, recoveryDelayMs);
        reconciliationTimers.set(key, timer);
      }
      return false;
    }
  }

  async function replace(key) {
    const factory = factories.get(key);
    if (!factory) return null;

    return registry.replace(key, () => {
      const channel = factory();
      if (!channel?.subscribe) throw new Error(`Channel factory for ${key} must return a subscribable channel`);
      channel.subscribe((status) => recovery.handleStatus(key, status));
      return channel;
    });
  }

  const recovery = createRealtimeRecovery({
    replaceChannel: async (key) => {
      const channel = await replace(key);
      if (channel) await reconcile(key);
      return channel;
    },
    delayMs: recoveryDelayMs,
    setTimer,
    clearTimer,
  });

  async function subscribe(key, factory) {
    if (!key || typeof factory !== "function") throw new TypeError("subscribe requires a key and channel factory");
    factories.set(key, factory);
    return replace(key);
  }

  async function remove(key) {
    recovery.cancel(key);
    cancelReconciliation(key);
    factories.delete(key);
    return registry.remove(key);
  }

  async function clear() {
    recovery.clear();
    [...reconciliationTimers.keys()].forEach(cancelReconciliation);
    factories.clear();
    await registry.clear();
  }

  return {
    subscribe,
    replace,
    remove,
    clear,
    setRecoveryHooks,
    has: (key) => registry.has(key),
    get size() { return registry.size; },
    get pendingRecoveryCount() { return recovery.pendingCount + reconciliationTimers.size; },
  };
}
