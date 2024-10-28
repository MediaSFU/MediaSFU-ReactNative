import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';

interface NewPoll {
  question: string;
  type: string;
  options: string[];
}
export interface HandleCreatePollOptions {
  poll: NewPoll;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  updateIsPollModalVisible: (visible: boolean) => void;

}

// Export the type definition for the function
export type HandleCreatePollType = (options: HandleCreatePollOptions) => Promise<void>;

/**
 * Handles the creation of a poll.
 *
 * @param {Object} options - The options for creating the poll.
 * @param {Poll} options.poll - The poll object containing the poll details.
 * @param {Object} options.parameters - Additional parameters for creating the poll.
 * @returns {Promise<void>} - A promise that resolves when the poll is created successfully.
 */
export const handleCreatePoll = async ({
  poll,
  socket,
  roomName,
  showAlert,
  updateIsPollModalVisible,
}: HandleCreatePollOptions): Promise<void> => {
  try {
    socket.emit(
      'createPoll',
      { roomName, poll },
      (response: { success: boolean; reason?: string }) => {
        if (response.success) {
          showAlert?.({ message: 'Poll created successfully', type: 'success' });
          updateIsPollModalVisible(false);
        } else {
          showAlert?.({ message: response.reason || 'Failed to create poll', type: 'danger' });
        }
      },
    );
  } catch (error) {
    console.error('Error creating poll:', error);
  }
};
