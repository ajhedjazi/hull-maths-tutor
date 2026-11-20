import test from "node:test";
import assert from "node:assert/strict";
import { assertTutorSendAuthorised } from "./tutor-send-authorisation.js";

test("accepts an authenticated tutor-style user", () => {
  const user = { id: "tutor-1", is_anonymous: false };
  assert.equal(assertTutorSendAuthorised(user), user);
});

test("rejects an anonymous user", () => {
  assert.throws(
    () => assertTutorSendAuthorised({ id: "student-1", is_anonymous: true }),
    /Tutor sign-in is required/,
  );
});

test("rejects a missing user", () => {
  assert.throws(() => assertTutorSendAuthorised(null), /Tutor sign-in is required/);
});
