import { Socket } from 'socket.io-client';

export interface ReInitiateRecordingOptions {
  roomName: string;
  member: string;
  socket: Socket;
  adminRestrictSetting: boolean;
}

// Export the type definition for the function
export type ReInitiateRecordingType = (options: ReInitiateRecordingOptions) => Promise<void>;

/**
 * Re-initiates the recording for a given room and member.
 *
* @param {Object} options - The options for re-initiating the recording.
* @param {string} options.roomName - The name of the room to re-initiate recording.
* @param {string} options.member - The member re-initiating the recording.
* @param {Socket} options.socket - The socket instance for communication.
* @param {boolean} options.adminRestrictSetting - Has admin restricted access to use specific media features.
* @returns {Promise<void>} A promise that resolves when the recording is re-initiated.
* @throws Will log an error message if there is an issue re-initiating the recording.a
*/
export const reInitiateRecording = async ({
  roomName, member, socket, adminRestrictSetting,
}: ReInitiateRecordingOptions): Promise<void> => {
  // Function to re-initiate recording
  if (!adminRestrictSetting) {
    socket.emit(
      'startRecordIng',
      { roomName, member },
      ({ success }: { success: boolean; }) => {
        if (success) {
          // Handle success, if needed
        } else {
          // Handle failure, if needed
        }
      },
    );
  }
};
