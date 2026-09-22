import { createRealtimeChannelRegistry } from "./realtime-channel-registry.js";
import { createRealtimeRecovery } from "./realtime-recovery.js";

export function createRealtimeManager({ supabase, recoveryDelayMs = 750, setTimer, clearTimer }) {
  if (!supabase?.removeChannel) throw new TypeError("A Supabase client with removeChannel is required");

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
    replaceChannel: replace,
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
