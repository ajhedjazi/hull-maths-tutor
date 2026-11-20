import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("./session-recovery.js", import.meta.url), "utf8");

test("student recovery does not overwrite typing that changed during backend recovery", () => {
  assert.match(source, /const workingBeforeRecovery = workingInput\.value;/);
  assert.match(source, /const answerBeforeRecovery = answerInput\.value;/);
  assert.match(source, /const workingUnchanged = workingInput\.value === workingBeforeRecovery;/);
  assert.match(source, /const answerUnchanged = answerInput\.value === answerBeforeRecovery;/);
  assert.match(source, /if \(workingUnchanged\) workingInput\.value = submitted\.working_text \|\| "";/);
  assert.match(source, /if \(answerUnchanged\) answerInput\.value = submitted\.answer_text \|\| "";/);
});

test("recovery only claims a full restore when both student fields were untouched", () => {
  assert.match(source, /if \(saveState && workingUnchanged && answerUnchanged\)/);
  assert.match(source, /Your submitted answer has been restored\./);
  assert.match(source, /Your marked answer has been restored\./);
});

test("student recovery is bounded instead of waiting forever for classroom entry", () => {
  assert.match(source, /const deadline = Date\.now\(\) \+ 5000;/);
  assert.match(source, /if \(classroomView\.hidden\) return;/);
});
