import assert from "node:assert/strict";
import test from "node:test";
import { createQuestionSendFlight } from "./question-send-flight.js";

test("allows one send at a time", () => {
  const flight = createQuestionSendFlight();
  assert.equal(flight.tryStart(), true);
  assert.equal(flight.active, true);
  assert.equal(flight.tryStart(), false);
});

test("allows another send after the first finishes", () => {
  const flight = createQuestionSendFlight();
  assert.equal(flight.tryStart(), true);
  flight.finish();
  assert.equal(flight.active, false);
  assert.equal(flight.tryStart(), true);
});
