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
    get pending() {
      return pending;
    },
  };
}
