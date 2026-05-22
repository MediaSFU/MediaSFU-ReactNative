import { Socket } from 'socket.io-client';
import { Device } from 'mediasoup-client/lib/types';
import { signalNewConsumerTransport } from '../../consumers/signalNewConsumerTransport';
import {
  ReorderStreamsParameters, ReorderStreamsType, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters, ConnectRecvTransportType, ShowAlert,
} from '../../@types/types';
import { newPipeProducer as sharedNewPipeProducer } from 'mediasfu-shared';

export interface TranslationMeta {
  speakerId: string;
  speakerName: string;
  language: string;
  originalProducerId?: string;
  isSpeakerControlled?: boolean;
}

export interface NewPipeProducerParameters extends ReorderStreamsParameters, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters {

  first_round: boolean;
  shareScreenStarted: boolean;
  shared: boolean;
  landScaped: boolean;
  showAlert?: ShowAlert;
  isWideScreen: boolean;
  updateFirst_round: (firstRound: boolean) => void;
  updateLandScaped: (landScaped: boolean) => void;
  device: Device | null;
  consumingTransports: string[];
  lock_screen: boolean;
  updateConsumingTransports: (transports: string[]) => void;

  // mediasfu functions
  connectRecvTransport: ConnectRecvTransportType;
  reorderStreams: ReorderStreamsType;
  getUpdatedAllParams: () => NewPipeProducerParameters;

  startConsumingTranslation?: (producerId: string, speakerId: string, language: string, originalProducerId?: string, nsock?: Socket) => Promise<void>;
  translationSubscriptions?: Map<string, { speakerId: string; language: string }>;
  speakerTranslationStates?: Map<string, { speakerId: string; speakerName: string; inputLanguage: string; outputLanguage: string; originalProducerId: string; enabled: boolean }>;
  listenerTranslationOverrides?: Map<string, { speakerId: string; wantOriginal: boolean; preferredLanguage?: string }>;
  listenerTranslationPreferences?: {
    perSpeaker: Map<string, { speakerId: string; language: string | null; wantOriginal: boolean }>;
    globalLanguage: string | null;
  };
  [key: string]: any;

}

export interface NewPipeProducerOptions {
  producerId: string;
  islevel: string;
  nsock: Socket;
  parameters: NewPipeProducerParameters;
  isTranslation?: boolean;
  translationMeta?: TranslationMeta;
}

// Export the type definition for the function
export type NewPipeProducerType = (options: NewPipeProducerOptions) => Promise<void>;

/**
 * Handles the creation of a new pipe producer by signaling for a new consumer transport and updating the necessary parameters.
 *
 * @function
 * @async
 * @param {NewPipeProducerOptions} options - The options for the new pipe producer.
 * @param {string} options.producerId - The ID of the producer to be consumed.
 * @param {string} options.islevel - The level status of the participant.
 * @param {Socket} options.nsock - The socket instance for real-time communication.
 * @param {NewPipeProducerParameters} options.parameters - Additional parameters required for the producer.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.parameters.shared - Indicates if sharing is active.
 * @param {boolean} options.parameters.landScaped - Indicates if the device is in landscape mode.
 * @param {ShowAlert} options.parameters.showAlert - Function to show alerts to the user.
 * @param {boolean} options.parameters.isWideScreen - Indicates if the device is a widescreen.
 * @param {Function} options.parameters.updateFirst_round - Function to update the first round status.
 * @param {Function} options.parameters.updateLandScaped - Function to update the landscape status.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * @throws {Error} Will throw an error if the operation fails to signal the new consumer transport.
 *
 * @example
 * import { newPipeProducer } from 'mediasfu-reactnative';
 * import { io } from 'socket.io-client';
 *
 * const parameters = {
 *   shareScreenStarted: true,
 *   shared: true,
 *   landScaped: false,
 *   showAlert: (alert) => console.log(alert.message),
 *   isWideScreen: false,
 *   updateFirst_round: (firstRound) => console.log('First round updated:', firstRound),
 *   updateLandScaped: (landScaped) => console.log('Landscape status updated:', landScaped),
 * };
 *
 * const producerId = 'producer-123';
 * const islevel = '2';
 * const nsock = io("http://localhost:3000");
 *
 * async function init() {
 *   try {
 *     await newPipeProducer({
 *       producerId,
 *       islevel,
 *       nsock,
 *       parameters,
 *     });
 *     console.log('New pipe producer created successfully');
 *   } catch (error) {
 *     console.error('Error creating new pipe producer:', error);
 *   }
 * }
 *
 * init();
 */


export const newPipeProducer = async ({
  producerId,
  islevel,
  nsock,
  parameters,
  isTranslation,
  translationMeta,
}: NewPipeProducerOptions): Promise<void> => {
  return sharedNewPipeProducer({
    producerId,
    islevel,
    nsock: nsock as any,
    parameters: parameters as any,
    isTranslation,
    translationMeta,
  } as any);
};
