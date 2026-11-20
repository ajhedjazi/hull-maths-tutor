export function isCurrentRoomEvent(room, currentRoom) {
  return Boolean(room?.id && currentRoom?.id && room.id === currentRoom.id);
}
