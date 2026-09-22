import assert from "node:assert/strict";
import { createMarkingFlight } from "./marking-flight.js";

const flight = createMarkingFlight();
assert.equal(flight.pending, false, "marking starts idle");
assert.equal(flight.begin(), true, "first mark attempt must acquire the flight");
assert.equal(flight.pending, true, "marking is pending after acquisition");
assert.equal(flight.begin(), false, "a second mark attempt must be rejected while the first is pending");
flight.end();
assert.equal(flight.pending, false, "marking returns to idle after completion");
assert.equal(flight.begin(), true, "a later mark attempt can proceed after completion");
flight.end();

console.log("marking-flight: 6 assertions passed");
