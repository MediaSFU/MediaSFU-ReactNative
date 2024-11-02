import { Socket } from 'socket.io-client';

export interface DisconnectUserSelfOptions {
  member: string;
  roomName: string;
  socket: Socket;
}

// Export the type definition for the function
export type DisconnectUserSelfType = (options: DisconnectUserSelfOptions) => Promise<void>;

/**
 * Disconnects the user from the specified room and bans them.
 *
 * @param {DisconnectUserSelfOptions} options - The options for disconnecting the user.
 * @param {Object} options.member - The member object representing the user to disconnect.
 * @param {string} options.roomName - The name of the room from which the user will be disconnected.
 * @param {Socket} options.socket - The socket instance used to emit the disconnection request.
 * @returns {Promise<void>} A promise that resolves when the disconnection request has been emitted.
 * 
 * @example
 * ```typescript
 * await disconnectUserSelf({
 *  member: "user123",
 * roomName: "main-room",
 * socket: socketInstance,
 * });
 * ```
 */

export async function disconnectUserSelf({ member, roomName, socket }: DisconnectUserSelfOptions): Promise<void> {
  // Emit the disconnection request to the socket, indicating that the user is being banned
  socket.emit('disconnectUser', {
    member,
    roomName,
    ban: true,
  });
}
