import assert from "node:assert/strict";
import test from "node:test";
import { resolveActiveSessionId } from "./resolve-active-session.js";

function query(result) {
  const chain = {
    select: () => chain,
    eq: () => chain,
    single: async () => result,
  };
  return chain;
}

const tutorId = "tutor-1";

function client({ room = { data: { id: "room-1", tutor_id: tutorId }, error: null }, session = { data: { id: "session-1", room_id: "room-1", tutor_id: tutorId }, error: null } } = {}) {
  return {
    from(table) {
      if (table === "rooms") return query(room);
      if (table === "sessions") return query(session);
      throw new Error(`Unexpected table: ${table}`);
    },
  };
}

test("resolves the active session for the signed-in tutor and displayed room", async () => {
  assert.equal(await resolveActiveSessionId({ supabase: client(), roomCode: "ABC123", tutorId }), "session-1");
});

test("normalises a valid displayed room code before querying", async () => {
  assert.equal(await resolveActiveSessionId({ supabase: client(), roomCode: " abc123 ", tutorId }), "session-1");
});

test("fails closed when tutor identity is missing", async () => {
  await assert.rejects(resolveActiveSessionId({ supabase: client(), roomCode: "ABC123" }), /tutor identity is required/i);
});

test("fails closed when the room has disappeared", async () => {
  await assert.rejects(
    resolveActiveSessionId({ supabase: client({ room: { data: null, error: null } }), roomCode: "ABC123", tutorId }),
    /room is no longer active/i,
  );
});

test("rejects a room owned by another tutor", async () => {
  await assert.rejects(
    resolveActiveSessionId({ supabase: client({ room: { data: { id: "room-1", tutor_id: "tutor-2" }, error: null } }), roomCode: "ABC123", tutorId }),
    /does not belong to the signed-in tutor/i,
  );
});

test("fails closed when no active lesson session exists", async () => {
  await assert.rejects(
    resolveActiveSessionId({ supabase: client({ session: { data: null, error: null } }), roomCode: "ABC123", tutorId }),
    /no active lesson session/i,
  );
});

test("rejects a session response that belongs to another room", async () => {
  await assert.rejects(
    resolveActiveSessionId({ supabase: client({ session: { data: { id: "session-2", room_id: "room-2", tutor_id: tutorId }, error: null } }), roomCode: "ABC123", tutorId }),
    /no active lesson session/i,
  );
});

test("rejects a session response owned by another tutor", async () => {
  await assert.rejects(
    resolveActiveSessionId({ supabase: client({ session: { data: { id: "session-1", room_id: "room-1", tutor_id: "tutor-2" }, error: null } }), roomCode: "ABC123", tutorId }),
    /no active lesson session/i,
  );
});

test("requires an open room before querying", async () => {
  await assert.rejects(resolveActiveSessionId({ supabase: client(), roomCode: "------", tutorId }), /valid live room/i);
});

test("rejects malformed room codes before querying", async () => {
  let queried = false;
  const supabase = { from() { queried = true; throw new Error("should not query"); } };
  await assert.rejects(resolveActiveSessionId({ supabase, roomCode: "ABC12!", tutorId }), /valid live room/i);
  assert.equal(queried, false);
});
