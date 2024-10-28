import { Producer } from 'mediasoup-client/lib/types';
import {
  ConnectSendTransportScreenType, CreateSendTransportType, DisconnectSendTransportScreenType, SleepType,
  CreateSendTransportParameters, DisconnectSendTransportScreenParameters, ConnectSendTransportScreenParameters,
  MediaStream as MediaStream, MediaStreamTrack,
} from '../../@types/types';

export interface CaptureCanvasStreamParameters extends CreateSendTransportParameters, DisconnectSendTransportScreenParameters, ConnectSendTransportScreenParameters {
  canvasWhiteboard: HTMLCanvasElement | null;
  canvasStream: MediaStream | null;
  updateCanvasStream: (stream: MediaStream | null) => void;
  screenProducer: Producer | null;
  transportCreated: boolean;
  updateScreenProducer: (producer: Producer | null) => void;

  // mediasfu functions
  sleep: SleepType;
  createSendTransport: CreateSendTransportType;
  connectSendTransportScreen: ConnectSendTransportScreenType;
  disconnectSendTransportScreen: DisconnectSendTransportScreenType;

  getUpdatedAllParams: () => CaptureCanvasStreamParameters;
  [key: string]: any;
}

export interface CaptureCanvasStreamOptions {
  parameters: CaptureCanvasStreamParameters;
  start?: boolean;
}

// Export the type definition for the function
export type CaptureCanvasStreamType = (options: CaptureCanvasStreamOptions) => Promise<void>;

/**
 * Capture the canvas stream.
 * @param {CaptureCanvasStreamOptions} options - The options object.
 * @returns {Promise<void>} - A promise that resolves when the canvas stream is captured.
 */
/**
 * Captures the canvas stream and handles the transport connection for screen sharing.
 *
 * @param {CaptureCanvasStreamOptions} options - The options for capturing the canvas stream.
 * @param {Object} options.parameters - The parameters required for capturing and managing the canvas stream.
 * @param {HTMLCanvasElement} options.parameters.canvasWhiteboard - The canvas element to capture the stream from.
 * @param {MediaStream} [options.parameters.canvasStream] - The current canvas stream, if any.
 * @param {Function} options.parameters.updateCanvasStream - Function to update the canvas stream state.
 * @param {Object} [options.parameters.screenProducer] - The current screen producer, if any.
 * @param {boolean} [options.parameters.transportCreated] - Flag indicating if the transport has been created.
 * @param {Function} options.parameters.updateScreenProducer - Function to update the screen producer state.
 * @param {Function} options.parameters.sleep - Function to pause execution for a specified duration.
 * @param {Function} options.parameters.createSendTransport - Function to create a send transport for the screen.
 * @param {Function} options.parameters.connectSendTransportScreen - Function to connect the send transport for the screen.
 * @param {Function} options.parameters.disconnectSendTransportScreen - Function to disconnect the send transport for the screen.
 * @param {boolean} [start=true] - Flag indicating whether to start or stop the canvas stream.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const captureCanvasStream = async ({
  parameters,
  start = true,
}: CaptureCanvasStreamOptions): Promise<void> => {
  try {
    let {
      canvasWhiteboard,
      canvasStream,
      updateCanvasStream,
      screenProducer,
      transportCreated,
      updateScreenProducer,

      // mediasfu functions
      sleep,
      createSendTransport,
      connectSendTransportScreen,
      disconnectSendTransportScreen,
    } = parameters;

    if (start && !canvasStream) {
      const stream = canvasWhiteboard!.captureStream(30);
      canvasStream = stream as any;
      updateCanvasStream(canvasStream);

      if (!transportCreated) {
        await createSendTransport({ option: 'screen', parameters });
      } else {
        try {
          if (screenProducer) {
            screenProducer.close();
            updateScreenProducer(null);
            await sleep({ ms: 500 });
          }
        } catch (error) {
          console.error(error);
        }
        await connectSendTransportScreen({ stream: canvasStream, parameters });
      }
    } else if (canvasStream && !start) {
      canvasStream.getTracks().forEach((track: MediaStreamTrack) => track?.stop());
      canvasStream = null;
      updateCanvasStream(null);
      disconnectSendTransportScreen({ parameters });
    }
  } catch (error) {
    console.error(error, 'error in captureCanvasStream');
  }
};
