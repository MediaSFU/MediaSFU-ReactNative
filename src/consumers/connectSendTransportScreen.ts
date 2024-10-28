import {
  Transport, Producer, Device, ProducerOptions,
} from 'mediasoup-client/lib/types';
import { MediaStream } from '../@types/types';

export interface ConnectSendTransportScreenParameters {
  screenProducer: Producer | null;
  device: Device | null;
  screenParams: ProducerOptions;
  producerTransport: Transport | null;
  params: ProducerOptions;
  updateScreenProducer: (producer: (Producer | null)) => void;
  updateProducerTransport: (transport: Transport | null) => void;

  getUpdatedAllParams: () => ConnectSendTransportScreenParameters;
  [key: string]: any; // Extendable for additional parameters
}

export interface ConnectSendTransportScreenOptions {
  stream: MediaStream;
  parameters: ConnectSendTransportScreenParameters;
}

// Export the type definition for the function
export type ConnectSendTransportScreenType = (options: ConnectSendTransportScreenOptions) => Promise<void>;

/**
 * Connects and sets up the screen sharing transport for sending video streams.
 *
 * @param {Object} options - The options for connecting the screen transport.
 * @param {MediaStream} options.stream - The media stream containing the screen video track.
 * @param {ConnectSendTransportScreenOptions} options.parameters - The parameters required for setting up the transport.
 * @param {Producer} options.parameters.screenProducer - The screen producer object.
 * @param {Device} options.parameters.device - The device object containing RTP capabilities.
 * @param {Promise<ScreenParams>} options.parameters.screenParams - A promise resolving to screen share parameters.
 * @param {Transport} options.parameters.producerTransport - The transport object used for producing the screen share.
 * @param {Params} options.parameters.params - The parameters for producing the screen share.
 * @param {Function} options.parameters.updateScreenProducer - Function to update the screen producer object.
 * @param {Function} options.parameters.updateProducerTransport - Function to update the producer transport object.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to fetch updated device information.
 *
 * @returns {Promise<void>} A promise that resolves when the screen transport is successfully connected and set up.
 *
 * @throws Will throw an error if the connection or setup process fails.
 */
export const connectSendTransportScreen = async ({
  stream,
  parameters,
}: ConnectSendTransportScreenOptions): Promise<void> => {
  try {
    let {
      screenProducer,
      device,
      screenParams,
      producerTransport,
      params,
      updateScreenProducer,
      updateProducerTransport,
    } = parameters;

    // Fetch updated device information
    device = parameters.getUpdatedAllParams().device;

    // Retrieve screen share parameters
    params = screenParams;

    // Find VP9 codec for screen share
    const codec = device?.rtpCapabilities?.codecs?.find(

      (codec: { mimeType: string }) => codec.mimeType.toLowerCase() === 'video/vp9',
    );

    // Produce screen share data using the producer transport
    screenProducer = await producerTransport!.produce({
      track: stream.getVideoTracks()[0] as any,
      ...params,
      codec,
      appData: { mediaTag: 'screen-video' },
    });

    // Update the screen producer and producer transport objects
    updateScreenProducer(screenProducer);
    updateProducerTransport(producerTransport);
  } catch (error) {
    console.log('connectSendTransportScreen error', error);
    throw error;
  }
};
