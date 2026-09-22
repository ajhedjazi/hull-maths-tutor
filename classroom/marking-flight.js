export function createMarkingFlight() {
  let pending = false;

  return {
    begin() {
      if (pending) return false;
      pending = true;
      return true;
    },
    end() {
      pending = false;
    },
    async run(task) {
      if (pending) return { started: false };
      pending = true;
      try {
        return { started: true, value: await task() };
      } finally {
        pending = false;
      }
    },
    get pending() {
      return pending;
    },
  };
}
