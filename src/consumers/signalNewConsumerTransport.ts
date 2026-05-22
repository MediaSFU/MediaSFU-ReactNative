import { signalNewConsumerTransport as sharedSignalNewConsumerTransport } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import { Device, DtlsParameters } from 'mediasoup-client/lib/types';
import {
  ReorderStreamsParameters, ReorderStreamsType, ConnectRecvTransportType,
  ConnectRecvTransportParameters, CreateWebRTCTransportResponse,
} from '../@types/types';

export interface SignalNewConsumerTransportParameters extends ReorderStreamsParameters, ConnectRecvTransportParameters {
  device: Device | null;
  consumingTransports: string[];
  lock_screen: boolean;
  updateConsumingTransports: (transports: string[]) => void;
  connectRecvTransport: ConnectRecvTransportType;
  reorderStreams: ReorderStreamsType;
  getUpdatedAllParams: () => SignalNewConsumerTransportParameters;
  [key: string]: any;
}

export interface SignalNewConsumerTransportOptions {
  remoteProducerId: string;
  islevel: string;
  nsock: Socket;
  parameters: SignalNewConsumerTransportParameters;
}

// Export the type definition for the function
export type SignalNewConsumerTransportType = (options: SignalNewConsumerTransportOptions) => Promise<string[] | void>;

/**
 * Signals the creation of a new consumer transport.
 *
 * @param {SignalNewConsumerTransportOptions} options - The options for signaling a new consumer transport.
 * @param {string} options.remoteProducerId - The ID of the remote producer.
 * @param {string} options.islevel - Indicates the level of the consumer.
 * @param {Socket} options.nsock - The socket instance for communication.
 * @param {SignalNewConsumerTransportParameters} options.parameters - The parameters for the transport.
 *
 * @returns {Promise<string[] | void>} A promise that resolves to an array of consuming transports or void.
 *
 * @throws Will throw an error if the signaling process fails.
 *
 * @example
 * const options = {
 *   remoteProducerId: 'producer-id',
 *   islevel: '1',
 *   nsock: socketInstance,
 *   parameters: {
 *     device: mediaDevice,
 *     consumingTransports: [],
 *     lock_screen: false,
 *     updateConsumingTransports: updateFunction,
 *     connectRecvTransport: connectFunction,
 *     reorderStreams: reorderFunction,
 *     getUpdatedAllParams: getUpdatedParamsFunction,
 *   },
 * };
 *
 * signalNewConsumerTransport(options)
 *   .then(consumingTransports => {
 *     console.log('Consuming Transports:', consumingTransports);
 *   })
 *   .catch(error => {
 *     console.error('Error signaling new consumer transport:', error);
 *   });
 */

export const signalNewConsumerTransport = async (options: SignalNewConsumerTransportOptions): Promise<string[] | void> => {
  return (sharedSignalNewConsumerTransport as unknown as SignalNewConsumerTransportType)(options);
};
