import { Transport, Producer, ProducerOptions } from 'mediasoup-client/lib/types';

export interface ConnectSendTransportAudioParameters {
  audioProducer: Producer | null;
  producerTransport: Transport | null;
  localAudioProducer?: Producer | null;
  localProducerTransport?: Transport | null;
  updateAudioProducer: (producer: Producer | null) => void;
  updateProducerTransport: (transport: Transport | null) => void;
  updateLocalAudioProducer?: (localProducer: Producer | null) => void;
  updateLocalProducerTransport?: (localTransport: Transport | null) => void;
}

export interface ConnectSendTransportAudioOptions {
  audioParams: ProducerOptions;
  parameters: ConnectSendTransportAudioParameters;
  targetOption?: 'all' | 'local' | 'remote';
}

// Export the type definition for the function
export type ConnectSendTransportAudioType = (options: ConnectSendTransportAudioOptions) => Promise<void>;

const connectLocalSendTransportAudio = async ({
  parameters,
  audioParams
}: ConnectSendTransportAudioOptions): Promise<void> => {
  try {
    let {
      localAudioProducer,
      localProducerTransport,
      updateLocalAudioProducer,
      updateLocalProducerTransport,
    } = parameters;

    if (localProducerTransport) {
      localAudioProducer = await localProducerTransport.produce(audioParams);

      updateLocalAudioProducer?.(localAudioProducer);
      updateLocalProducerTransport?.(localProducerTransport);
    }
  } catch (error) {
    console.error('Error connecting local audio transport:', error);
    throw error; // Re-throw to let the parent handle it
  }
};


/**
 * Connects the send transport for audio by producing audio data and updating the audio producer and producer transport objects.
 *
 * If the primary connection fails, it attempts to connect using the local transport via a separate function.
 *
 * @param {ConnectSendTransportAudioOptions} options - The options for connecting the send transport.
 * @param {ProducerOptions} options.audioParams - The audio parameters.
 * @param {ConnectSendTransportAudioParameters} options.parameters - The parameters required for connecting the transport.
 * @param {Producer | null} options.parameters.audioProducer - The audio producer object.
 * @param {Transport | null} options.parameters.producerTransport - The producer transport object.
 * @param {Producer | null} [options.parameters.localAudioProducer] - The local audio producer object.
 * @param {Transport | null} [options.parameters.localProducerTransport] - The local producer transport object.
 * @param {(producer: Producer | null) => void} options.parameters.updateAudioProducer - The function to update the audio producer object.
 * @param {(transport: Transport | null) => void} options.parameters.updateProducerTransport - The function to update the producer transport object.
 * @param {(localProducer: Producer | null) => void} [options.parameters.updateLocalAudioProducer] - The function to update the local audio producer object.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 *
 * @example
 * const options = {
 *   audioParams: { codec: 'opus', maxBitrate: 128000 },
 *   parameters: {
 *     audioProducer: null,
 *     producerTransport: transport,
 *     localAudioProducer: null,
 *     localProducerTransport: localTransport,
 *     updateAudioProducer: (producer) => console.log('Updated producer:', producer),
 *     updateProducerTransport: (transport) => console.log('Updated transport:', transport),
 *     updateLocalAudioProducer: (localProducer) => console.log('Updated local producer:', localProducer),
 *     updateLocalProducerTransport: (localTransport) => console.log('Updated local transport:', localTransport),
 *   },
 * };
 *
 * connectSendTransportAudio(options)
 *   .then(() => console.log('Audio transport connected successfully'))
 *   .catch((error) => console.error('Error connecting audio transport:', error));
 */

export const connectSendTransportAudio: ConnectSendTransportAudioType = async ({
  parameters,
  audioParams,
  targetOption = 'all',
}: ConnectSendTransportAudioOptions): Promise<void> => {
  try {
    let {
      audioProducer,
      producerTransport,
      updateAudioProducer,
      updateProducerTransport,
    } = parameters;

    // Attempt to connect the primary send transport
    if (targetOption === 'all' || targetOption === 'remote') {
      audioProducer = await producerTransport!.produce(audioParams);

      // Update state with the new producer and transport
      updateAudioProducer(audioProducer);
      updateProducerTransport(producerTransport);
    }

    // Attempt to connect the local send transport
    if (targetOption === 'all' || targetOption === 'local') {
      try {
        await connectLocalSendTransportAudio({ parameters, audioParams });
      } catch (localError) {
        console.error('Local audio transport connection failed:', localError);
      }
    }

  } catch (primaryError) {
    console.error('audio transport connection failed:', primaryError);
    throw new Error('Failed to connect to audio transport.');
  }
};
