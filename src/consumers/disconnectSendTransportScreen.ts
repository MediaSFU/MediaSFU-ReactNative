import { Producer } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';

export interface DisconnectSendTransportScreenParameters {
    screenProducer: Producer | null;
    socket: Socket;
    roomName: string;
    updateScreenProducer: (screenProducer: Producer | null) => void;

    getUpdatedAllParams: () => DisconnectSendTransportScreenParameters;
    [key: string]: any;
}
export interface DisconnectSendTransportScreenOptions {
    parameters: DisconnectSendTransportScreenParameters;
}

// Export the type definition for the function
export type DisconnectSendTransportScreenType = (options: DisconnectSendTransportScreenOptions) => Promise<void>;


/**
 * Disconnects the send transport for screen sharing.
 *
 * This function closes the screen producer, updates the state, and notifies the server
 * about the closure and pausing of screen sharing.
 *
 * @param {DisconnectSendTransportScreenOptions} options - The options for disconnecting the send transport.
 * @param {Object} options.parameters - The parameters required for disconnection.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Producer | null} options.parameters.screenProducer - The screen producer to be closed.
 * @param {Socket} options.parameters.socket - The socket connection to notify the server.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {Function} options.parameters.updateScreenProducer - Function to update the screen producer state.
 * @returns {Promise<void>} A promise that resolves when the disconnection process is complete.
 * @throws {Error} If an error occurs during the disconnection process.
 *
 * @example
 * const options = {
 *   parameters: {
 *     screenProducer: screenProducerInstance,
 *     socket: socketInstance,
 *     roomName: 'Room 1',
 *     updateScreenProducer: (producer) => console.log('Updated screen producer:', producer),
 *     getUpdatedAllParams: () => ({
 *       screenProducer: screenProducerInstance,
 *       socket: socketInstance,
 *       roomName: 'Room 1',
 *     }),
 *   },
 * };
 *
 * disconnectSendTransportScreen(options)
 *   .then(() => {
 *     console.log('Screen send transport disconnected successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error disconnecting screen send transport:', error);
 *   });
 */

export const disconnectSendTransportScreen = async ({ parameters }: DisconnectSendTransportScreenOptions) : Promise<void> => {
  const { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  try {
    // Destructure parameters
    const {
      screenProducer,
      socket,
      roomName,
      updateScreenProducer,
    } = parameters;

        // Close the screen producer and update the state
        screenProducer!.close();
        updateScreenProducer(screenProducer);

        // Notify the server about closing the screen producer and pausing screen sharing
        socket.emit('closeScreenProducer');
        socket.emit('pauseProducerMedia', { mediaTag: 'screen', roomName });
  } catch (error) {
    // Handle errors during the disconnection process
    if (error instanceof Error) {
      console.log('Error disconnecting send transport for screen:', error.message);
    } else {
      console.log('Error disconnecting send transport for screen:', error);
    }
  }
};
