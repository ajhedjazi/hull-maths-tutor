import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const classroomSource = await readFile(new URL("./classroom.js", import.meta.url), "utf8");

test("classroom routes student submissions through the guarded atomic controller", () => {
  assert.match(classroomSource, /createStudentAnswerSubmitController/);
  assert.match(classroomSource, /submitCurrentStudentAnswer\(\{\s*answerText,\s*workingText\s*\}\)/);

  assert.doesNotMatch(
    classroomSource,
    /from\(["']student_answers["']\)\s*\.upsert\s*\(/,
    "classroom.js must not bypass submit_student_answer with a direct student_answers upsert",
  );
  assert.doesNotMatch(
    classroomSource,
    /from\(["']student_answers["']\)\s*\.insert\s*\(/,
    "classroom.js must not bypass submit_student_answer with a direct student_answers insert",
  );
});

test("classroom routes tutor marking through the guarded atomic controller", () => {
  assert.match(classroomSource, /createTutorMarkingController/);
  assert.match(classroomSource, /markCurrentStudentAnswer\(\{\s*isCorrect,/);

  assert.doesNotMatch(
    classroomSource,
    /from\(["']student_answers["']\)\s*\.update\s*\(/,
    "classroom.js must not bypass mark_student_answer with a direct student_answers update",
  );
  assert.doesNotMatch(
    classroomSource,
    /from\(["']answer_misconceptions["']\)\s*\.(?:insert|upsert|update|delete)\s*\(/,
    "classroom.js must not split misconception tagging out of the atomic marking RPC",
  );
});
