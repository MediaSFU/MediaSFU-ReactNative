import { Socket } from 'socket.io-client';
import { joinRoom as sharedJoinRoom } from 'mediasfu-shared';

export interface JoinRoomOptions {
  socket: Socket;
  roomName: string;
  islevel: string;
  member: string;
  sec: string;
  apiUserName: string;
}

// Export the type definition for the function
export type JoinRoomType = (
  socket: Socket,
  roomName: string,
  islevel: string,
  member: string,
  sec: string,
  apiUserName: string
) => Promise<object>;

/**
 * Joins a user to a specified room via a socket connection.
 *
 * @param {JoinRoomOptions} options - The options for joining the room.
 * @param {Socket} options.socket - The socket instance to use for communication.
 * @param {string} options.roomName - The name of the room to join.
 * @param {string} options.islevel - The level of the user.
 * @param {string} options.member - The member identifier.
 * @param {string} options.sec - The security token.
 * @param {string} options.apiUserName - The API username of the user.
 *
 * @returns {Promise<object>} A promise that resolves with the data received from the 'joinRoom' event or rejects with a validation error.
 *
 * @example
 * ```typescript
 * const options = {
 *   socket: socketInstance,
 *   roomName: "s12345678",
 *   islevel: "1",
 *   member: "user123",
 *   sec: "64CharacterLongSecretHere",
 *   apiUserName: "user123",
 * };
 *
 * try {
 *   const response = await joinRoom(options);
 *   console.log("Room joined:", response);
 * } catch (error) {
 *   console.error("Failed to join room:", error);
 * }
 * ```
 */

async function joinRoom({
  socket,
  roomName,
  islevel,
  member,
  sec,
  apiUserName,
}: JoinRoomOptions): Promise<object> {
  return sharedJoinRoom({
    socket: socket as any,
    roomName,
    islevel,
    member,
    sec,
    apiUserName,
  } as any);
}

export { joinRoom };
