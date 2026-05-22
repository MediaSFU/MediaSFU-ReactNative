import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';
import { handleEndPoll as sharedHandleEndPoll } from 'mediasfu-shared';

export interface HandleEndPollOptions {
  pollId: string;
  socket: Socket;
  showAlert?: ShowAlert;
  roomName: string;
  updateIsPollModalVisible: (isVisible: boolean) => void;
}

// Export the type definition for the function
export type HandleEndPollType = (options: HandleEndPollOptions) => Promise<void>;

/**
 * Handles the end of a poll by emitting an "endPoll" event through the provided socket.
 * Displays an alert based on the success or failure of the operation.
 *
 * @param {HandleEndPollOptions} options - The options for ending the poll.
 * @param {string} options.pollId - The ID of the poll to end.
 * @param {Socket} options.socket - The socket instance to emit the event.
 * @param {Function} [options.showAlert] - Optional function to display alerts.
 * @param {string} options.roomName - The name of the room where the poll is being conducted.
 * @param {Function} options.updateIsPollModalVisible - Function to update the poll modal visibility.
 *
 * @example
 * ```typescript
 * handleEndPoll({
 *   pollId: "poll123",
 *   socket: socketInstance,
 *   showAlert: (message) => console.log(message),
 *   roomName: "roomA",
 *   updateIsPollModalVisible: (isVisible) => setIsPollModalVisible(isVisible),
 * });
 * ```
 */

export const handleEndPoll = async (
  {
    pollId, socket, showAlert, roomName, updateIsPollModalVisible,
  }: HandleEndPollOptions,
): Promise<void> => {
  await sharedHandleEndPoll({
    pollId,
    socket,
    showAlert,
    roomName,
    updateIsPollModalVisible,
  } as any);
};
