import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';
import { handleVotePoll as sharedHandleVotePoll } from 'mediasfu-shared';

export interface HandleVotePollOptions {
  pollId: string;
  optionIndex: number;
  socket: Socket;
  showAlert?: ShowAlert;
  member: string;
  roomName: string;
  updateIsPollModalVisible: (isVisible: boolean) => void;
}

// Export the type definition for the function
export type HandleVotePollType = (options: HandleVotePollOptions) => Promise<void>;

/**
 * Handles the voting process for a poll.
 *
 * @param {HandleVotePollOptions} options - The options for handling the vote.
 * @param {string} options.pollId - The ID of the poll.
 * @param {number} options.optionIndex - The index of the selected option.
 * @param {Socket} options.socket - The socket instance for communication.
 * @param {Function} [options.showAlert] - Optional function to show alerts.
 * @param {string} options.member - The member who is voting.
 * @param {string} options.roomName - The name of the room where the poll is conducted.
 * @param {Function} options.updateIsPollModalVisible - Function to update the visibility of the poll modal.
 *
 * @example
 * ```typescript
 * handleVotePoll({
 *   pollId: "poll123",
 *   optionIndex: 1,
 *   socket: socketInstance,
 *   showAlert: (message) => console.log(message),
 *   member: "user1",
 *   roomName: "roomA",
 *   updateIsPollModalVisible: (isVisible) => setIsPollModalVisible(isVisible),
 * });
 * ```
 */

export const handleVotePoll = async ({
  pollId,
  optionIndex,
  socket,
  showAlert,
  member,
  roomName,
  updateIsPollModalVisible,
}: HandleVotePollOptions): Promise<void> => {
  await sharedHandleVotePoll({
    pollId,
    optionIndex,
    socket,
    showAlert,
    member,
    roomName,
    updateIsPollModalVisible,
  } as any);
};
