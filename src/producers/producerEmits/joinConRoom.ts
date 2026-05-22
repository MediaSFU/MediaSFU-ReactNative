import { Socket } from 'socket.io-client';
import { RtpCapabilities } from 'mediasoup-client/lib/types'; // Import the RtpCapabilities type from the mediasoup-client library
import { joinConRoom as sharedJoinConRoom } from 'mediasfu-shared';

export interface JoinConRoomOptions {
  socket: Socket;
  roomName: string;
  islevel: string;
  member: string;
  sec: string;
  apiUserName: string;
}

export interface JoinConRoomResponse {
  success: boolean;
  rtpCapabilities: RtpCapabilities | null;
  reason?: string;
  banned?: boolean;
  suspended?: boolean;
  noAdmin?: boolean;
  [key: string]: any;
}

// Export the type definition for the function
export type JoinConRoomType = (options: JoinConRoomOptions) => Promise<JoinConRoomResponse>;

/**
 * Joins a conference room using the provided options.
 *
 * @param {JoinConRoomOptions} options - The options for joining the conference room.
 * @param {Socket} options.socket - The socket instance to use for communication.
 * @param {string} options.roomName - The name of the room to join.
 * @param {string} options.islevel - The level of the user.
 * @param {string} options.member - The member identifier.
 * @param {string} options.sec - The security token.
 * @param {string} options.apiUserName - The API username.
 *
 * @returns {Promise<JoinConRoomResponse>} A promise that resolves with the response of the join operation.
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
 *   const response = await joinConRoom(options);
 *   console.log("Room joined:", response);
 * } catch (error) {
 *   console.error("Failed to join room:", error);
 * }
 * ```
 */

export async function joinConRoom(
  {
    socket, roomName, islevel, member, sec, apiUserName,
  }: JoinConRoomOptions,
): Promise<JoinConRoomResponse> {
  return sharedJoinConRoom({
    socket: socket as any,
    roomName,
    islevel,
    member,
    sec,
    apiUserName,
  } as any);
}
