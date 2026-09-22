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

const guarded = createMarkingFlight();
let release;
const first = guarded.run(() => new Promise((resolve) => { release = resolve; }));
assert.equal(guarded.pending, true, "run acquires the marking flight before awaiting");
assert.deepEqual(await guarded.run(async () => "duplicate"), { started: false }, "run rejects concurrent marking work");
release("saved");
assert.deepEqual(await first, { started: true, value: "saved" }, "run returns the completed task value");
assert.equal(guarded.pending, false, "run releases the marking flight after success");

await assert.rejects(() => guarded.run(async () => { throw new Error("save failed"); }), /save failed/, "run surfaces marking failures");
assert.equal(guarded.pending, false, "run releases the marking flight after failure");
assert.deepEqual(await guarded.run(async () => "retry saved"), { started: true, value: "retry saved" }, "marking can retry after a failed request");

console.log("marking-flight: 13 assertions passed");
