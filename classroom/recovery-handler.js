import { fetchClassroomSnapshot } from "./classroom-reconcile.js";
import { applyRecoverySnapshot } from "./recovery-state.js";

export function createClassroomRecoveryHandler({ supabase, getCurrent, applyRecovered }) {
  if (!supabase?.from) throw new TypeError("A Supabase client with from() is required");
  if (typeof getCurrent !== "function") throw new TypeError("getCurrent must be a function");
  if (typeof applyRecovered !== "function") throw new TypeError("applyRecovered must be a function");

  let pending = null;

  return async function recoverClassroom() {
    if (pending) return pending;

    const started = getCurrent();
    const roomId = started?.room?.id;
    const sessionId = started?.session?.id;
    if (!roomId || !sessionId) return null;

    pending = (async () => {
      const snapshot = await fetchClassroomSnapshot({ supabase, roomId, sessionId });
      // Read state again after the network round trip. A user can leave or enter
      // another room while recovery is in flight; stale data must never win.
      const latest = getCurrent();
      const recovered = applyRecoverySnapshot(latest, snapshot);
      if (!recovered.ignored) await applyRecovered(recovered);
      return recovered;
    })();

    try {
      return await pending;
    } finally {
      pending = null;
    }
  };
}
