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
 * Sets up and connects a screen sharing transport for sending video streams.
 *
 * @param {Object} options - The configuration options for setting up the screen transport.
 * @param {MediaStream} options.stream - The media stream with the screen video track to share.
 * @param {ConnectSendTransportScreenParameters} options.parameters - The transport setup parameters.
 * @param {Producer | null} options.parameters.screenProducer - The current screen producer instance.
 * @param {Device | null} options.parameters.device - The device object containing RTP capabilities.
 * @param {ProducerOptions} options.parameters.screenParams - The parameters for screen sharing production.
 * @param {Transport | null} options.parameters.producerTransport - The transport for screen sharing.
 * @param {ProducerOptions} options.parameters.params - Additional parameters for producing the screen share.
 * @param {Function} options.parameters.updateScreenProducer - Callback to update the screen producer instance.
 * @param {Function} options.parameters.updateProducerTransport - Callback to update the producer transport instance.
 * @param {Function} options.parameters.getUpdatedAllParams - Callback to retrieve updated device parameters.
 *
 * @returns {Promise<void>} - A promise that resolves once the screen transport is successfully connected and set up.
 *
 * @throws Will throw an error if there is an issue with the connection or setup process.
 *
 * @example
 * ```typescript
 * await connectSendTransportScreen({
 *   stream: screenStream,
 *   parameters: {
 *     screenProducer: null,
 *     device: mediaDevice,
 *     screenParams: { encodings: [{ maxBitrate: 1500000 }] },
 *     producerTransport: sendTransport,
 *     params: { track: screenStream.getVideoTracks()[0] },
 *     updateScreenProducer: setScreenProducer,
 *     updateProducerTransport: setProducerTransport,
 *     getUpdatedAllParams: getParams,
 *   },
 * });
 * ```
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
