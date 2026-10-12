import { fetchClassroomSnapshot } from "./classroom-reconcile.js";
import { applyRecoverySnapshot } from "./recovery-state.js";

export async function reconcileRecoveredClassroom({ supabase, current, roomId, sessionId }) {
  if (!current || typeof current !== "object") throw new TypeError("current classroom state is required");
  if (!roomId || !sessionId) throw new TypeError("roomId and sessionId are required");

  // Capture the room/session being recovered before awaiting the network. The
  // reducer below rejects the snapshot if the user has moved to another room.
  const snapshot = await fetchClassroomSnapshot({ supabase, roomId, sessionId });
  return applyRecoverySnapshot(current, snapshot);
}
