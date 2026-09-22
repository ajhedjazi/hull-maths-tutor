export function createRealtimeChannelRegistry(removeChannel) {
  if (typeof removeChannel !== "function") {
    throw new TypeError("removeChannel must be a function");
  }

  const channels = new Map();

  async function replace(key, createChannel) {
    if (!key || typeof createChannel !== "function") {
      throw new TypeError("replace requires a key and channel factory");
    }

    const previous = channels.get(key);
    if (previous) {
      channels.delete(key);
      await removeChannel(previous);
    }

    const channel = createChannel();
    if (!channel) throw new Error(`Channel factory returned no channel for ${key}`);
    channels.set(key, channel);
    return channel;
  }

  async function remove(key) {
    const channel = channels.get(key);
    if (!channel) return false;
    channels.delete(key);
    await removeChannel(channel);
    return true;
  }

  async function clear() {
    const active = [...channels.values()];
    channels.clear();
    await Promise.allSettled(active.map((channel) => removeChannel(channel)));
  }

  return {
    replace,
    remove,
    clear,
    has: (key) => channels.has(key),
    get size() { return channels.size; },
  };
}
