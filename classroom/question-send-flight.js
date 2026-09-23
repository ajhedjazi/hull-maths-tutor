export function createQuestionSendFlight() {
  let inFlight = false;

  return {
    tryStart() {
      if (inFlight) return false;
      inFlight = true;
      return true;
    },
    finish() {
      inFlight = false;
    },
    get active() {
      return inFlight;
    },
  };
}
