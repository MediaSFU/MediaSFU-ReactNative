import { Socket } from 'socket.io-client';
import { Producer } from 'mediasoup-client/lib/types';
import { PrepopulateUserMediaType, PrepopulateUserMediaParameters } from '../@types/types';

export interface DisconnectSendTransportAudioParameters extends PrepopulateUserMediaParameters {
  audioProducer: Producer | null;
  socket: Socket;
  videoAlreadyOn: boolean;
  islevel: string;
  lock_screen: boolean;
  shared: boolean;
  updateMainWindow: boolean;
  hostLabel: string;
  roomName: string;
  updateAudioProducer: (audioProducer: Producer | null) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  // mediasfu functions
  prepopulateUserMedia: PrepopulateUserMediaType;
  [key: string]: any;
}

export interface DisconnectSendTransportAudioOptions {
  parameters: DisconnectSendTransportAudioParameters;
}

// Export the type definition for the function
export type DisconnectSendTransportAudioType = (options: DisconnectSendTransportAudioOptions) => Promise<void>;

/**
 * Disconnects the send transport for audio by pausing the audio producer and updating the UI accordingly.
 *
 * @param {DisconnectSendTransportAudioOptions} options - The options required to disconnect the send transport for audio.
 * @param {Producer | null} options.parameters.audioProducer - The audio producer to be paused.
 * @param {Socket} options.parameters.socket - The socket connection to notify the server.
 * @param {boolean} options.parameters.videoAlreadyOn - Flag indicating if the video is already on.
 * @param {string} options.parameters.islevel - The level of the user.
 * @param {boolean} options.parameters.lock_screen - Flag indicating if the screen is locked.
 * @param {boolean} options.parameters.shared - Flag indicating if the screen is shared.
 * @param {Function} options.parameters.updateMainWindow - Function to update the main window state.
 * @param {string} options.parameters.hostLabel - The label of the host.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {Function} options.parameters.updateAudioProducer - Function to update the audio producer state.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window update state.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 *
 * @returns {Promise<void>} A promise that resolves when the send transport for audio is disconnected.
 *
 * @throws Will throw an error if the operation fails.
 *
 * @example
 * const options = {
 *   parameters: {
 *     audioProducer: audioProducerInstance,
 *     socket: socketInstance,
 *     videoAlreadyOn: false,
 *     islevel: '1',
 *     lock_screen: false,
 *     shared: false,
 *     updateMainWindow: true,
 *     hostLabel: 'Host',
 *     roomName: 'Room 1',
 *     updateAudioProducer: (producer) => console.log('Updated audio producer:', producer),
 *     updateUpdateMainWindow: (state) => console.log('Main window state updated:', state),
 *     prepopulateUserMedia: async ({ name, parameters }) => console.log('Prepopulating user media for', name),
 *   },
 * };
 *
 * disconnectSendTransportAudio(options)
 *   .then(() => {
 *     console.log('Audio send transport disconnected successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error disconnecting audio send transport:', error);
 *   });
 */

export const disconnectSendTransportAudio = async ({ parameters }: DisconnectSendTransportAudioOptions) => {
  try {
    // Destructure parameters
    let {
      audioProducer,
      socket,
      videoAlreadyOn,
      islevel,
      lock_screen,
      shared,
      updateMainWindow,
      hostLabel,
      roomName,
      updateAudioProducer,
      updateUpdateMainWindow,

      // mediasfu functions
      prepopulateUserMedia,
    } = parameters;

    // Pause the audio producer
    audioProducer!.pause(); // actual logic is to close (await audioProducer.close()) but mediaSFU prefers pause if recording
    updateAudioProducer(audioProducer);

    // Update the UI
    if (!videoAlreadyOn && islevel === '2') {
      if (!lock_screen && !shared) {
        updateMainWindow = true;
        updateUpdateMainWindow(updateMainWindow);
        await prepopulateUserMedia({ name: hostLabel, parameters });
        updateMainWindow = false;
        updateUpdateMainWindow(updateMainWindow);
      }
    }

    // Notify the server about pausing audio producer
    socket.emit('pauseProducerMedia', {
      mediaTag: 'audio',
      roomName,
    });
  } catch {
    // Handle errors
  }
};
