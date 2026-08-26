import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.HMT_SUPABASE_CONFIG || {};
const isConfigured = Boolean(config.url && config.anonKey);
const supabase = isConfigured ? createClient(config.url, config.anonKey) : null;

const state = {
  role: null,
  user: null,
  room: null,
  session: null,
  currentQuestion: null,
  currentAnswer: null,
  questions: [],
  misconceptions: [],
  channels: [],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  setupWarning: $("#setup-warning"),
  headerStatus: $("#header-status"),
  entryView: $("#entry-view"),
  classroomView: $("#classroom-view"),
  studentJoinForm: $("#student-join-form"),
  studentJoinMessage: $("#student-join-message"),
  tutorLoginForm: $("#tutor-login-form"),
  tutorLoginMessage: $("#tutor-login-message"),
  tutorLobby: $("#tutor-lobby"),
  tutorLobbyMessage: $("#tutor-lobby-message"),
  activeRooms: $("#active-rooms"),
  createRoom: $("#create-room"),
  tutorSignOut: $("#tutor-sign-out"),
  classroomRoleLabel: $("#classroom-role-label"),
  classroomStudentName: $("#classroom-student-name"),
  roomCodeBadge: $("#room-code-badge"),
  leaveClassroom: $("#leave-classroom"),
  closeRoom: $("#close-room"),
  tutorQuestionControls: $("#tutor-question-controls"),
  questionPicker: $("#question-picker"),
  sendQuestion: $("#send-question"),
  questionNumber: $("#question-number"),
  questionStatus: $("#question-status"),
  questionDisplay: $("#question-display"),
  studentWorkspace: $("#student-workspace"),
  studentWorking: $("#student-working"),
  studentAnswer: $("#student-answer"),
  submitAnswer: $("#submit-answer"),
  studentSaveState: $("#student-save-state"),
  studentMarkResult: $("#student-mark-result"),
  tutorResponseCard: $("#tutor-response-card"),
  responseState: $("#response-state"),
  responseWorking: $("#response-working"),
  responseAnswer: $("#response-answer"),
  markingControls: $("#marking-controls"),
  misconceptionPicker: $("#misconception-picker"),
  markCorrect: $("#mark-correct"),
  markIncorrect: $("#mark-incorrect"),
  markingMessage: $("#marking-message"),
  diagnosticCard: $("#diagnostic-card"),
  masteryList: $("#mastery-list"),
  classroomMessage: $("#classroom-message"),
};

function setMessage(element, message = "", isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function setConnectionStatus(label, online = false) {
  const text = elements.headerStatus?.querySelector("span:last-child");
  if (text) text.textContent = label;
  elements.headerStatus?.classList.toggle("is-online", online);
}

function normaliseRoomCode(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function showEntryHome() {
  state.role = null;
  elements.entryView.hidden = false;
  elements.classroomView.hidden = true;
  elements.studentJoinForm.hidden = true;
  elements.tutorLoginForm.hidden = true;
  elements.tutorLobby.hidden = true;
  $$(".role-picker").forEach((node) => (node.hidden = false));
  clearClassroomState(false);
}

function showRole(role) {
  state.role = role;
  $$(".role-picker").forEach((node) => (node.hidden = true));
  elements.studentJoinForm.hidden = role !== "student";
  elements.tutorLoginForm.hidden = role !== "tutor";
  elements.tutorLobby.hidden = true;

  if (role === "tutor" && state.user && !state.user.is_anonymous) {
    showTutorLobby();
  }
}

function clearClassroomState(removeChannels = true) {
  if (removeChannels) unsubscribeAll();
  state.room = null;
  state.session = null;
  state.currentQuestion = null;
  state.currentAnswer = null;
  elements.questionDisplay.innerHTML = '<p class="empty-state">The question will appear here.</p>';
  elements.questionDisplay.classList.remove("has-question");
  elements.questionNumber.textContent = "Waiting to begin";
  elements.questionStatus.textContent = "Ready";
  elements.responseWorking.innerHTML = '<p class="empty-state">Waiting for the student to submit.</p>';
  elements.responseAnswer.textContent = "—";
  elements.markingControls.hidden = true;
  elements.studentMarkResult.hidden = true;
  elements.studentWorking.value = "";
  elements.studentAnswer.value = "";
}

async function unsubscribeAll() {
  if (!supabase) return;
  const channels = [...state.channels];
  state.channels = [];
  await Promise.allSettled(channels.map((channel) => supabase.removeChannel(channel)));
}

async function initialise() {
  if (!isConfigured) {
    elements.setupWarning.hidden = false;
    setConnectionStatus("Setup required", false);
    $$("button, input, select, textarea").forEach((control) => {
      if (!control.classList.contains("back-button")) control.disabled = true;
    });
    return;
  }

  setConnectionStatus("Connecting…", false);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  state.user = session?.user || null;
  setConnectionStatus("Backend connected", true);

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    state.user = nextSession?.user || null;
    if (state.role === "tutor" && state.user && !state.user.is_anonymous) {
      showTutorLobby();
    }
  });

  if (state.user && !state.user.is_anonymous && window.location.hash) {
    showRole("tutor");
  }
}

async function ensureAnonymousStudent() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.is_anonymous) {
    state.user = session.user;
    return session.user;
  }

  if (session?.user && !session.user.is_anonymous) {
    throw new Error("Tutor sign-in is active in this browser. Open the student room in another browser or private tab.");
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  state.user = data.user;
  return data.user;
}

async function sendTutorMagicLink(event) {
  event.preventDefault();
  setMessage(elements.tutorLoginMessage, "");

  const email = $("#tutor-email").value.trim();
  if (!email) return;

  const button = elements.tutorLoginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Sending…";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` },
  });

  button.disabled = false;
  button.textContent = "Email me a sign-in link";

  if (error) {
    setMessage(elements.tutorLoginMessage, error.message, true);
    return;
  }

  setMessage(elements.tutorLoginMessage, "Magic link sent. Open it on this device to continue.");
}

async function showTutorLobby() {
  if (!state.user || state.user.is_anonymous) return;
  state.role = "tutor";
  $$(".role-picker").forEach((node) => (node.hidden = true));
  elements.studentJoinForm.hidden = true;
  elements.tutorLoginForm.hidden = true;
  elements.tutorLobby.hidden = false;
  await loadActiveRooms();
}

async function loadActiveRooms() {
  setMessage(elements.tutorLobbyMessage, "");
  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_code, student_id, student_display_name, created_at, status")
    .eq("tutor_id", state.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    setMessage(elements.tutorLobbyMessage, error.message, true);
    return;
  }

  if (!data?.length) {
    elements.activeRooms.innerHTML = '<p class="muted">No active rooms yet.</p>';
    return;
  }

  elements.activeRooms.innerHTML = data
    .map(
      (room) => `
        <button class="active-room-button" type="button" data-room-id="${room.id}">
          <span>
            <strong>${escapeHtml(room.student_display_name || "Waiting for student")}</strong>
            <small>Room ${room.room_code}</small>
          </span>
          <span aria-hidden="true">→</span>
        </button>`,
    )
    .join("");

  elements.activeRooms.querySelectorAll("[data-room-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const room = data.find((item) => item.id === button.dataset.roomId);
      if (room) enterClassroom("tutor", room);
    });
  });
}

async function createRoom() {
  setMessage(elements.tutorLobbyMessage, "Creating room…");
  elements.createRoom.disabled = true;

  const { data, error } = await supabase.rpc("create_tutor_room");
  elements.createRoom.disabled = false;

  if (error) {
    setMessage(elements.tutorLobbyMessage, error.message, true);
    return;
  }

  const room = Array.isArray(data) ? data[0] : data;
  await enterClassroom("tutor", room);
}

async function joinStudentRoom(event) {
  event.preventDefault();
  setMessage(elements.studentJoinMessage, "Joining…");

  const studentName = $("#student-name").value.trim();
  const roomCode = normaliseRoomCode($("#room-code-input").value);

  if (studentName.length < 2 || roomCode.length !== 6) {
    setMessage(elements.studentJoinMessage, "Enter your name and the full six-character room code.", true);
    return;
  }

  try {
    await ensureAnonymousStudent();
    const { data, error } = await supabase.rpc("claim_room", {
      p_room_code: roomCode,
      p_display_name: studentName,
    });
    if (error) throw error;

    const room = Array.isArray(data) ? data[0] : data;
    await enterClassroom("student", room);
  } catch (error) {
    setMessage(elements.studentJoinMessage, error.message || "Could not join the room.", true);
  }
}

async function enterClassroom(role, room) {
  await unsubscribeAll();
  state.role = role;
  state.room = room;
  state.currentQuestion = null;
  state.currentAnswer = null;

  const { data: lessonSession, error } = await supabase
    .from("sessions")
    .select("id, room_id, tutor_id, student_id, status, started_at")
    .eq("room_id", room.id)
    .eq("status", "active")
    .single();

  if (error) {
    setMessage(role === "tutor" ? elements.tutorLobbyMessage : elements.studentJoinMessage, error.message, true);
    return;
  }

  state.session = lessonSession;
  elements.entryView.hidden = true;
  elements.classroomView.hidden = false;
  elements.classroomRoleLabel.textContent = role === "tutor" ? "Tutor view · Live lesson" : "Student view · Live lesson";
  elements.roomCodeBadge.textContent = room.room_code;
  elements.classroomStudentName.textContent = room.student_display_name || "Waiting for student";
  elements.closeRoom.hidden = role !== "tutor";
  elements.tutorQuestionControls.hidden = role !== "tutor";
  elements.tutorResponseCard.hidden = role !== "tutor";
  elements.diagnosticCard.hidden = role !== "tutor";
  elements.studentWorkspace.hidden = role !== "student";

  if (role === "tutor") {
    await Promise.all([loadQuestionBank(), loadMisconceptions()]);
    await loadMastery();
  }

  await loadLatestQuestion();
  subscribeToRoom();
  subscribeToQuestions();
  subscribeToAnswers();
  setMessage(elements.classroomMessage, role === "tutor" && !room.student_id ? "Share the room code with your student." : "Live classroom connected.");
}

async function loadQuestionBank() {
  const { data, error } = await supabase
    .from("questions")
    .select("id, code, prompt, answer_type, calculator_allowed, difficulty")
    .eq("active", true)
    .order("difficulty", { ascending: true })
    .order("code", { ascending: true });

  if (error) {
    setMessage(elements.classroomMessage, error.message, true);
    return;
  }

  state.questions = data || [];
  elements.questionPicker.innerHTML = '<option value="">Choose a question…</option>' +
    state.questions
      .map((question) => `<option value="${question.id}">${escapeHtml(question.code)} · ${escapeHtml(question.prompt)}</option>`)
      .join("");
}

async function loadMisconceptions() {
  const { data, error } = await supabase
    .from("misconceptions")
    .select("id, code, label")
    .eq("active", true)
    .order("label", { ascending: true });

  if (error) return;
  state.misconceptions = data || [];
  elements.misconceptionPicker.innerHTML = '<option value="">No misconception tag</option>' +
    state.misconceptions
      .map((item) => `<option value="${item.id}">${escapeHtml(item.label)}</option>`)
      .join("");
}

async function sendSelectedQuestion() {
  const question = state.questions.find((item) => item.id === elements.questionPicker.value);
  if (!question || !state.session) return;

  elements.sendQuestion.disabled = true;
  setMessage(elements.classroomMessage, "Sending question…");

  const { data: latest } = await supabase
    .from("session_questions")
    .select("id, position")
    .eq("session_id", state.session.id)
    .order("position", { ascending: false })
    .limit(1);

  if (latest?.[0]?.id) {
    await supabase
      .from("session_questions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", latest[0].id)
      .eq("status", "live");
  }

  const { data, error } = await supabase
    .from("session_questions")
    .insert({
      session_id: state.session.id,
      question_id: question.id,
      question_text_snapshot: question.prompt,
      position: (latest?.[0]?.position || 0) + 1,
      status: "live",
    })
    .select("id, session_id, question_id, question_text_snapshot, position, status, sent_at")
    .single();

  elements.sendQuestion.disabled = false;

  if (error) {
    setMessage(elements.classroomMessage, error.message, true);
    return;
  }

  renderQuestion(data, question);
  setMessage(elements.classroomMessage, "Question sent live.");
}

async function loadLatestQuestion() {
  if (!state.session) return;
  const { data, error } = await supabase
    .from("session_questions")
    .select("id, session_id, question_id, question_text_snapshot, position, status, sent_at")
    .eq("session_id", state.session.id)
    .order("position", { ascending: false })
    .limit(1);

  if (error || !data?.length) return;
  const bankQuestion = state.questions.find((item) => item.id === data[0].question_id);
  renderQuestion(data[0], bankQuestion);
  await loadCurrentAnswer();
}

function renderQuestion(sessionQuestion, bankQuestion = null) {
  const isNewQuestion = state.currentQuestion?.id !== sessionQuestion.id;
  state.currentQuestion = sessionQuestion;
  state.currentAnswer = null;

  elements.questionNumber.textContent = `Question ${sessionQuestion.position}`;
  elements.questionStatus.textContent = sessionQuestion.status === "live" ? "Live" : sessionQuestion.status;
  elements.questionDisplay.classList.add("has-question");

  const meta = [];
  if (bankQuestion?.calculator_allowed === false) meta.push("Non-calculator");
  if (bankQuestion?.calculator_allowed === true) meta.push("Calculator allowed");
  if (bankQuestion?.difficulty) meta.push(`Difficulty ${bankQuestion.difficulty}/5`);

  elements.questionDisplay.innerHTML = `
    <div>
      <p class="question-text">${escapeHtml(sessionQuestion.question_text_snapshot)}</p>
      ${meta.length ? `<div class="question-meta">${meta.map((item) => `<span>${item}</span>`).join("")}</div>` : ""}
    </div>`;

  if (isNewQuestion) {
    elements.studentWorking.value = "";
    elements.studentAnswer.value = "";
    elements.studentMarkResult.hidden = true;
    elements.studentSaveState.textContent = "";
    elements.responseWorking.innerHTML = '<p class="empty-state">Waiting for the student to submit.</p>';
    elements.responseAnswer.textContent = "—";
    elements.responseState.textContent = "Waiting";
    elements.markingControls.hidden = true;
    elements.markingMessage.textContent = "";
  }
}

async function submitStudentAnswer() {
  if (!state.currentQuestion || !state.user) {
    setMessage(elements.classroomMessage, "Wait for a question before submitting.", true);
    return;
  }

  const answerText = elements.studentAnswer.value.trim();
  const workingText = elements.studentWorking.value.trim();
  if (!answerText && !workingText) {
    elements.studentSaveState.textContent = "Add some working or an answer first.";
    return;
  }

  elements.submitAnswer.disabled = true;
  elements.studentSaveState.textContent = "Sending…";

  const { data, error } = await supabase
    .from("student_answers")
    .upsert(
      {
        session_question_id: state.currentQuestion.id,
        student_id: state.user.id,
        answer_text: answerText,
        working_text: workingText,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "session_question_id,student_id" },
    )
    .select("id, session_question_id, student_id, answer_text, working_text, is_correct, tutor_feedback, submitted_at, marked_at")
    .single();

  elements.submitAnswer.disabled = false;

  if (error) {
    elements.studentSaveState.textContent = error.message;
    return;
  }

  state.currentAnswer = data;
  elements.studentSaveState.textContent = "Answer sent to your tutor.";
}

async function loadCurrentAnswer() {
  if (!state.currentQuestion) return;

  const query = supabase
    .from("student_answers")
    .select("id, session_question_id, student_id, answer_text, working_text, is_correct, tutor_feedback, submitted_at, marked_at")
    .eq("session_question_id", state.currentQuestion.id)
    .limit(1);

  const { data, error } = await query;
  if (error || !data?.length) return;
  renderAnswer(data[0]);
}

function renderAnswer(answer) {
  if (answer.session_question_id !== state.currentQuestion?.id) return;
  state.currentAnswer = answer;

  if (state.role === "tutor") {
    elements.responseWorking.textContent = answer.working_text || "No working submitted.";
    elements.responseAnswer.textContent = answer.answer_text || "—";
    elements.responseState.textContent = answer.is_correct === null ? "Submitted" : "Marked";
    elements.markingControls.hidden = false;
  }

  if (state.role === "student") {
    if (answer.is_correct === null) {
      elements.studentMarkResult.hidden = true;
      return;
    }

    elements.studentMarkResult.hidden = false;
    elements.studentMarkResult.className = `mark-result ${answer.is_correct ? "is-correct" : "is-incorrect"}`;
    elements.studentMarkResult.textContent = answer.is_correct
      ? "✓ Correct — nice work."
      : `Not quite yet.${answer.tutor_feedback ? ` ${answer.tutor_feedback}` : " Your tutor will talk through the next step."}`;
    elements.submitAnswer.disabled = true;
  }
}

async function markAnswer(isCorrect) {
  if (!state.currentAnswer) return;
  setMessage(elements.markingMessage, "Saving diagnosis…");

  const { data, error } = await supabase
    .from("student_answers")
    .update({
      is_correct: isCorrect,
      marked_at: new Date().toISOString(),
    })
    .eq("id", state.currentAnswer.id)
    .select("id, session_question_id, student_id, answer_text, working_text, is_correct, tutor_feedback, submitted_at, marked_at")
    .single();

  if (error) {
    setMessage(elements.markingMessage, error.message, true);
    return;
  }

  const misconceptionId = !isCorrect ? elements.misconceptionPicker.value : "";
  if (misconceptionId) {
    const { error: tagError } = await supabase.from("answer_misconceptions").upsert(
      {
        answer_id: data.id,
        misconception_id: misconceptionId,
        tagged_by: state.user.id,
      },
      { onConflict: "answer_id,misconception_id" },
    );
    if (tagError) {
      setMessage(elements.markingMessage, `Marked, but the misconception tag failed: ${tagError.message}`, true);
      return;
    }
  }

  renderAnswer(data);
  setMessage(elements.markingMessage, isCorrect ? "Marked correct. Skill profile updated." : "Marked incorrect. Diagnostic data saved.");
  await loadMastery();
}

async function loadMastery() {
  const studentId = state.room?.student_id;
  if (state.role !== "tutor" || !studentId) {
    elements.masteryList.innerHTML = '<p class="empty-state">Skill data will build as answers are marked.</p>';
    return;
  }

  const { data, error } = await supabase
    .from("student_skill_mastery")
    .select("attempts, correct_count, mastery_percent, last_assessed_at, skills(skill_name, topic, strand)")
    .eq("student_id", studentId)
    .order("last_assessed_at", { ascending: false });

  if (error || !data?.length) {
    elements.masteryList.innerHTML = '<p class="empty-state">Skill data will build as answers are marked.</p>';
    return;
  }

  elements.masteryList.innerHTML = data
    .map((row) => {
      const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills;
      const percent = Math.max(0, Math.min(100, Number(row.mastery_percent) || 0));
      return `
        <div class="mastery-item">
          <div class="mastery-topline">
            <strong>${escapeHtml(skill?.skill_name || "Skill")}</strong>
            <span>${percent.toFixed(0)}% · ${row.correct_count}/${row.attempts}</span>
          </div>
          <div class="mastery-bar" aria-label="${percent.toFixed(0)} percent mastery">
            <div class="mastery-fill" style="width:${percent}%"></div>
          </div>
        </div>`;
    })
    .join("");
}

function subscribeToRoom() {
  if (!state.room) return;
  const channel = supabase
    .channel(`room-${state.room.id}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${state.room.id}` },
      (payload) => {
        state.room = payload.new;
        elements.classroomStudentName.textContent = payload.new.student_display_name || "Waiting for student";
        if (payload.new.status === "closed") {
          setMessage(elements.classroomMessage, "This room has ended.");
          elements.submitAnswer.disabled = true;
        }
        if (state.role === "tutor") loadMastery();
      },
    )
    .subscribe();
  state.channels.push(channel);
}

function subscribeToQuestions() {
  if (!state.session) return;
  const channel = supabase
    .channel(`questions-${state.session.id}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "session_questions", filter: `session_id=eq.${state.session.id}` },
      async (payload) => {
        const bankQuestion = state.questions.find((item) => item.id === payload.new.question_id);
        renderQuestion(payload.new, bankQuestion);
        await loadCurrentAnswer();
      },
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "session_questions", filter: `session_id=eq.${state.session.id}` },
      (payload) => {
        if (payload.new.id === state.currentQuestion?.id) renderQuestion(payload.new);
      },
    )
    .subscribe();
  state.channels.push(channel);
}

function subscribeToAnswers() {
  const channel = supabase
    .channel(`answers-${state.session.id}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "student_answers" }, (payload) => {
      const answer = payload.new;
      if (answer?.session_question_id === state.currentQuestion?.id) {
        renderAnswer(answer);
        if (state.role === "tutor" && answer.is_correct !== null) loadMastery();
      }
    })
    .subscribe();
  state.channels.push(channel);
}

async function closeCurrentRoom() {
  if (state.role !== "tutor" || !state.room || !state.session) return;
  elements.closeRoom.disabled = true;

  const now = new Date().toISOString();
  const [{ error: roomError }, { error: sessionError }] = await Promise.all([
    supabase.from("rooms").update({ status: "closed", closed_at: now }).eq("id", state.room.id),
    supabase.from("sessions").update({ status: "ended", ended_at: now }).eq("id", state.session.id),
  ]);

  elements.closeRoom.disabled = false;
  if (roomError || sessionError) {
    setMessage(elements.classroomMessage, roomError?.message || sessionError?.message, true);
    return;
  }

  await leaveClassroomView();
}

async function leaveClassroomView() {
  await unsubscribeAll();
  const previousRole = state.role;
  clearClassroomState(false);
  elements.classroomView.hidden = true;
  elements.entryView.hidden = false;

  if (previousRole === "tutor" && state.user && !state.user.is_anonymous) {
    await showTutorLobby();
  } else {
    showEntryHome();
  }
}

async function signOutTutor() {
  await unsubscribeAll();
  await supabase.auth.signOut();
  state.user = null;
  showEntryHome();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$$("[data-role]").forEach((button) => {
  button.addEventListener("click", () => showRole(button.dataset.role));
});

$$(".back-button").forEach((button) => {
  button.addEventListener("click", showEntryHome);
});

$("#room-code-input").addEventListener("input", (event) => {
  event.target.value = normaliseRoomCode(event.target.value);
});

elements.studentJoinForm.addEventListener("submit", joinStudentRoom);
elements.tutorLoginForm.addEventListener("submit", sendTutorMagicLink);
elements.createRoom.addEventListener("click", createRoom);
elements.tutorSignOut.addEventListener("click", signOutTutor);
elements.sendQuestion.addEventListener("click", sendSelectedQuestion);
elements.submitAnswer.addEventListener("click", submitStudentAnswer);
elements.markCorrect.addEventListener("click", () => markAnswer(true));
elements.markIncorrect.addEventListener("click", () => markAnswer(false));
elements.closeRoom.addEventListener("click", closeCurrentRoom);
elements.leaveClassroom.addEventListener("click", leaveClassroomView);

initialise().catch((error) => {
  setConnectionStatus("Connection error", false);
  setMessage(elements.studentJoinMessage, error.message, true);
});
