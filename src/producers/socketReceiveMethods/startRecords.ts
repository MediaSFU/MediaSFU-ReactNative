import { Socket } from 'socket.io-client';

export interface StartRecordsOptions {
  roomName: string;
  member: string;
  socket: Socket;
}

// Export the type definition for the function
export type StartRecordsType = (options: StartRecordsOptions) => Promise<void>;

/**
 * Starts recording the room.
 *
 * @param {Object} options - The options for starting the recording.
 * @param {string} options.roomName - The name of the room to start recording.
 * @param {string} options.member - The member starting the recording.
 * @param {Socket} options.socket - The socket instance for communication.
 *
 * @returns {Promise<void>} A promise that resolves when the recording is started.
 */
export const startRecords = async ({
  roomName, member, socket,
}: StartRecordsOptions): Promise<void> => {
  // Send the 'startRecording' event to the server with roomName and member information
  socket.emit(
    'startRecordIng',
    { roomName, member },
    ({ success }: { success: boolean; }) => {
      if (success) {
        // Handle success case
        // console.log('Recording started', success);
      } else {
        // Handle failure case
        // console.log('Recording failed to start', success);
      }
    },
  );
};
