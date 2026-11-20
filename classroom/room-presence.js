const studentName = document.querySelector("#classroom-student-name");
const roleLabel = document.querySelector("#classroom-role-label");
const sendQuestion = document.querySelector("#send-question");
const classroomMessage = document.querySelector("#classroom-message");

if (studentName && roleLabel && sendQuestion && classroomMessage) {
  let previousStudentName = "";

  const isTutorView = () => roleLabel.textContent.trim().toLowerCase().startsWith("tutor view");
  const currentStudentName = () => studentName.textContent.trim();
  const isWaitingForStudent = () => {
    const name = currentStudentName().toLowerCase();
    return !name || name === "waiting for student";
  };

  const syncTutorPresence = () => {
    if (!isTutorView()) {
      sendQuestion.removeAttribute("aria-disabled");
      sendQuestion.removeAttribute("data-waiting-for-student");
      previousStudentName = currentStudentName();
      return;
    }

    if (isWaitingForStudent()) {
      sendQuestion.setAttribute("aria-disabled", "true");
      sendQuestion.dataset.waitingForStudent = "true";
      previousStudentName = "";
      return;
    }

    sendQuestion.removeAttribute("aria-disabled");
    sendQuestion.removeAttribute("data-waiting-for-student");

    const name = currentStudentName();
    if (name && name !== previousStudentName) {
      classroomMessage.textContent = `${name} joined — the classroom is ready.`;
      classroomMessage.classList.remove("is-error");
      previousStudentName = name;
    }
  };

  sendQuestion.addEventListener(
    "click",
    (event) => {
      if (!isTutorView() || !isWaitingForStudent()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      classroomMessage.textContent = "Wait for your student to join before sending the first question.";
      classroomMessage.classList.remove("is-error");
    },
    true,
  );

  const observer = new MutationObserver(syncTutorPresence);
  observer.observe(studentName, { childList: true, characterData: true, subtree: true });
  observer.observe(roleLabel, { childList: true, characterData: true, subtree: true });
  syncTutorPresence();
}
