export function assertTutorSendAuthorised(user) {
  if (!user?.id || user.is_anonymous) {
    throw new Error("Tutor sign-in is required before sending a live question.");
  }
  return user;
}
