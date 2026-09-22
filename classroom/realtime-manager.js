import { createRealtimeChannelRegistry } from "./realtime-channel-registry.js";
import { createRealtimeRecovery } from "./realtime-recovery.js";

export function createRealtimeManager({ supabase, recoveryDelayMs = 750, setTimer, clearTimer, onRecovered, onRecoveryError }) {
  if (!supabase?.removeChannel) throw new TypeError("A Supabase client with removeChannel is required");
  if (onRecovered !== undefined && typeof onRecovered !== "function") throw new TypeError("onRecovered must be a function");
  if (onRecoveryError !== undefined && typeof onRecoveryError !== "function") throw new TypeError("onRecoveryError must be a function");

  const factories = new Map();
  const registry = createRealtimeChannelRegistry((channel) => supabase.removeChannel(channel));

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
      if (channel && onRecovered) {
        try {
          await onRecovered(key);
        } catch (error) {
          if (onRecoveryError) onRecoveryError(error, key);
        }
      }
      return channel;
    },
    delayMs: recoveryDelayMs,
    ...(setTimer ? { setTimer } : {}),
    ...(clearTimer ? { clearTimer } : {}),
  });

  async function subscribe(key, factory) {
    if (!key || typeof factory !== "function") throw new TypeError("subscribe requires a key and channel factory");
    factories.set(key, factory);
    return replace(key);
  }

  async function remove(key) {
    recovery.cancel(key);
    factories.delete(key);
    return registry.remove(key);
  }

  async function clear() {
    recovery.clear();
    factories.clear();
    await registry.clear();
  }

  return {
    subscribe,
    replace,
    remove,
    clear,
    has: (key) => registry.has(key),
    get size() { return registry.size; },
    get pendingRecoveryCount() { return recovery.pendingCount; },
  };
}
