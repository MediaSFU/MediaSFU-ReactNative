import { Producer } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import { ReorderStreamsType, ReorderStreamsParameters } from '../@types/types';

export interface DisconnectSendTransportVideoParameters extends ReorderStreamsParameters {
  videoProducer: Producer | null;
  socket: Socket;
  islevel: string;
  roomName: string;
  lock_screen: boolean;
  updateMainWindow: boolean
  updateUpdateMainWindow: (state: boolean) => void;
  updateVideoProducer: (producer: Producer | null) => void;

  // mediasfu functions
  reorderStreams: ReorderStreamsType;
  [key: string]: any;
}

export interface DisconnectSendTransportVideoOptions {
  parameters: DisconnectSendTransportVideoParameters;
}

// Export the type definition for the function
export type DisconnectSendTransportVideoType = (options: DisconnectSendTransportVideoOptions) => Promise<void>;

/**
 * Disconnects the send transport for video, closes the video producer, and updates the state.
 * 
 * @param {DisconnectSendTransportVideoOptions} options - The options for disconnecting the send transport.
 * @param {Object} options.parameters - The parameters required for disconnection.
 * @param {Producer | null} options.parameters.videoProducer - The video producer to be closed.
 * @param {Socket} options.parameters.socket - The socket instance for communication.
 * @param {string} options.parameters.islevel - The participant's level.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {boolean} options.parameters.updateMainWindow - Flag to update the main window.
 * @param {boolean} options.parameters.lock_screen - Flag indicating if the screen is locked.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window state.
 * @param {Function} options.parameters.updateVideoProducer - Function to update the video producer state.
 * @param {Function} options.parameters.reorderStreams - Function to reorder streams.
 * 
 * @returns {Promise<void>} A promise that resolves when the disconnection process is complete.
 * 
 * @throws {Error} Throws an error if the disconnection process fails.
 *
 * @example
 * const options = {
 *   parameters: {
 *     videoProducer: videoProducerInstance,
 *     socket: socketInstance,
 *     islevel: '1',
 *     roomName: 'Room A',
 *     updateMainWindow: false,
 *     lock_screen: false,
 *     updateUpdateMainWindow: (state) => console.log('Main window updated:', state),
 *     updateVideoProducer: (producer) => console.log('Video producer updated:', producer),
 *     reorderStreams: reorderStreamsFunction,
 *   },
 * };
 * 
 * disconnectSendTransportVideo(options)
 *   .then(() => {
 *     console.log('Video send transport disconnected successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error disconnecting video send transport:', error);
 *   });
 */

export const disconnectSendTransportVideo = async ({ parameters }: DisconnectSendTransportVideoOptions): Promise<void> => {
  try {
    // Destructure parameters
    let {
      videoProducer,
      socket,
      islevel,
      roomName,
      updateMainWindow,
      lock_screen,
      updateUpdateMainWindow,
      updateVideoProducer,
      reorderStreams,
    } = parameters;

    // Close the video producer and update the state
    videoProducer!.close();
    updateVideoProducer(null);

    // Notify the server about pausing video sharing
    socket.emit('pauseProducerMedia', { mediaTag: 'video', roomName });

    // Update the UI based on the participant's level and screen lock status
    if (islevel === '2') {
      updateMainWindow = true;
      updateUpdateMainWindow(updateMainWindow);
    }

    if (lock_screen) {
      await reorderStreams({ add: true, screenChanged: true, parameters });
    } else {
      await reorderStreams({ add: false, screenChanged: true, parameters });
    }
  } catch (error) {
    // Handle errors during the disconnection process
    if (error instanceof Error) {
      console.log('Error disconnecting send transport for video:', error.message);
    } else {
      console.log('Error disconnecting send transport for video:', error);
    }
  }
};
