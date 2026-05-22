import { getPipedProducersAlt as sharedGetPipedProducersAlt } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import { SignalNewConsumerTransportParameters, SignalNewConsumerTransportType } from '../@types/types';

interface TranslationMeta {
  speakerId: string;
  speakerName: string;
  language: string;
  originalProducerId?: string;
  isSpeakerControlled?: boolean;
}

export interface GetPipedProducersAltParameters extends Omit<SignalNewConsumerTransportParameters, 'getUpdatedAllParams'> {
  member: string;
  listenerTranslationPreferences?: {
    perSpeaker: Map<string, { speakerId: string; language: string | null; wantOriginal: boolean }>;
    globalLanguage: string | null;
  };

  // mediasfu functions
  signalNewConsumerTransport: SignalNewConsumerTransportType;
  startConsumingTranslation?: (
    producerId: string,
    speakerId: string,
    language: string,
    originalProducerId?: string,
    nsock?: Socket
  ) => Promise<void>;
  getUpdatedAllParams?: () => GetPipedProducersAltParameters;
  [key: string]: any;
}

export interface GetPipedProducersAltOptions {
  community?: boolean;
  nsock: Socket;
  islevel: string;
  parameters: GetPipedProducersAltParameters;
}

// Export the type definition for the function
export type GetPipedProducersAltType = (options: GetPipedProducersAltOptions) => Promise<void>;

/**
 * Retrieves piped producers and signals new consumer transport for each retrieved producer.
 *
 * @param {GetPipedProducersAltOptions} options - The options for retrieving piped producers.
 * @param {boolean} options.community - A flag indicating if the room is a community edition room.
 * @param {Socket} options.nsock - The WebSocket instance used for communication.
 * @param {string} options.islevel - A flag indicating the level of the request.
 * @param {GetPipedProducersAltParameters} options.parameters - Additional parameters for the request.
 * @param {string} options.parameters.member - The member identifier.
 * @param {Function} options.parameters.signalNewConsumerTransport - A function to signal new consumer transport.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws {Error} If an error occurs during the process of retrieving producers.
 *
 * @example
 * const options = {
 *   community: false,
 *   nsock: socketInstance,
 *   islevel: '1',
 *   parameters: {
 *     member: 'memberId',
 *     signalNewConsumerTransport: async ({ nsock, remoteProducerId, islevel, parameters }) => {
 *       // Implementation for signaling new consumer transport
 *     },
 *   },
 * };
 *
 * getPipedProducersAlt(options)
 *   .then(() => {
 *     console.log('Successfully retrieved piped producers');
 *   })
 *   .catch((error) => {
 *     console.error('Error retrieving piped producers:', error);
 *   });
 */

export const getPipedProducersAlt = async (options: GetPipedProducersAltOptions): Promise<void> => {
  await (sharedGetPipedProducersAlt as unknown as GetPipedProducersAltType)(options);
};
