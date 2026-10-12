# Live classroom smoke test

Use this before putting a real student into the classroom. Run it with two genuinely separate browser sessions (for example tutor on a laptop and student in a private window/phone).

## Preconditions

- The classroom page loads without a setup/configuration warning.
- Tutor authentication uses the normal magic-link flow.
- Student browser has no tutor session stored.
- Browser developer console is open on both devices so unexpected errors are visible.

## Core lesson loop

1. **Tutor signs in.** Confirm the tutor lobby loads and an active room can be created.
2. **Tutor creates a room.** Confirm a six-character room code is shown and the room remains visible after a refresh.
3. **Student joins.** Enter the student's display name and room code. Confirm the student enters the classroom and the tutor sees the student's name without refreshing.
4. **Tutor sends question 1.** Confirm it appears on the student device without refreshing and the question number/status agree on both devices.
5. **Student submits working and an answer.** Confirm the tutor receives both without refreshing and marking controls become available.
6. **Same-question update regression check.** While question 1 is still current, allow any realtime update to that `session_questions` row (for example its status changing). Confirm the tutor can still press Correct/Incorrect for the already-visible answer. This specifically guards against `currentAnswer` being lost when `renderQuestion()` handles an UPDATE for the same question.
7. **Tutor marks the answer.** Confirm the student sees the result without refreshing. If marked incorrect with a misconception selected, confirm the diagnosis saves successfully.
8. **Tutor sends question 2.** Confirm question 1 is completed, question 2 replaces it, the student's old inputs/results are cleared, and the tutor response card returns to Waiting.
9. **Refresh recovery.** Submit an answer to question 2, then refresh the tutor browser. Confirm the current question and submitted answer are restored and can still be marked. Refresh the student browser and confirm the current question is restored.
10. **Connection separation.** Close/reopen one browser or briefly interrupt its network connection. Confirm the other browser remains usable and the reconnecting browser can recover the current lesson state.
11. **Tutor ends the room.** Confirm the student is told the room has ended and can no longer submit answers. Confirm the ended room is no longer offered as active in the tutor lobby.

## Pass criteria for a real-student pilot

The pilot is a **go** only if steps 1–9 pass twice consecutively with no page reloads required except the deliberate recovery test. Steps 10–11 should also pass before relying on the classroom for a full lesson.

Record each failure with: device/browser, step number, exact visible message, console error (if any), and whether refreshing changed the result. Fix reproducible failures before adding new classroom features.
