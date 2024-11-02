import { Device, Transport, DtlsParameters } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import { ConnectSendTransportParameters, ConnectSendTransportType } from '../@types/types';

export interface CreateSendTransportParameters extends ConnectSendTransportParameters {
  islevel: string;
  member: string;
  socket: Socket;
  device: Device | null;
  transportCreated: boolean;
  producerTransport: Transport | null;
  updateProducerTransport: (producerTransport: Transport | null) => void;
  updateTransportCreated: (transportCreated: boolean) => void;

  // mediasfu functions
  connectSendTransport: ConnectSendTransportType;
  getUpdatedAllParams: () => CreateSendTransportParameters;
  [key: string]: any;
}

export interface CreateSendTransportOptions {
  option: 'audio' | 'video' | 'screen' | 'all';
  parameters: CreateSendTransportParameters;
}

// Export the type definition for the function
export type CreateSendTransportType = (options: CreateSendTransportOptions) => Promise<void>;

/**
 * Creates a WebRTC send transport and sets up event handlers for the transport.
 *
 * @param {CreateSendTransportOptions} options - The options for creating the send transport.
 * @param {'audio' | 'video' | 'screen' | 'all'} options.option - The type of transport to create.
 * @param {CreateSendTransportParameters} options.parameters - The parameters required for creating the transport.
 * @param {string} options.parameters.islevel - Indicates the level of the transport.
 * @param {string} options.parameters.member - The member name associated with the transport.
 * @param {Socket} options.parameters.socket - The socket instance for communication.
 * @param {Device | null} options.parameters.device - The WebRTC device instance.
 * @param {boolean} options.parameters.transportCreated - Flag indicating if the transport is created.
 * @param {Transport | null} options.parameters.producerTransport - The producer transport instance.
 * @param {Function} options.parameters.updateProducerTransport - Function to update the producer transport.
 * @param {Function} options.parameters.updateTransportCreated - Function to update the transport creation state.
 *
 * @returns {Promise<void>} A promise that resolves when the send transport is created and configured.
 *
 * @throws Will throw an error if there is an issue creating the send transport.
 *
 * @example
 * const options = {
 *   option: 'video',
 *   parameters: {
 *     islevel: '1',
 *     member: 'John Doe',
 *     socket: socketInstance,
 *     device: deviceInstance,
 *     transportCreated: false,
 *     producerTransport: null,
 *     updateProducerTransport: (transport) => console.log('Updated transport:', transport),
 *     updateTransportCreated: (state) => console.log('Transport created:', state),
 *   },
 * };
 *
 * createSendTransport(options)
 *   .then(() => {
 *     console.log('Send transport created successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error creating send transport:', error);
 *   });
 */

export const createSendTransport = async ({
  option,
  parameters,
}: CreateSendTransportOptions): Promise<void> => {
  try {
    // Destructure parameters
    let {
      islevel,
      member,
      socket,
      device,
      transportCreated,
      producerTransport,
      updateProducerTransport,
      updateTransportCreated,
      connectSendTransport,
    } = parameters;

    // Get updated device and socket parameters
    const updatedParams = parameters.getUpdatedAllParams();
    device = updatedParams.device;
    socket = updatedParams.socket;

    // Emit createWebRtcTransport event to the server
    socket.emit(
      'createWebRtcTransport',
      { consumer: false, islevel },
      async ({ params }: { params: any }) => {
        // Check if there is an error in the response
        if (params && params.error) {
          console.error('Error in createWebRtcTransport:', params.error);
          return;
        }

        // Create a WebRTC send transport
        producerTransport = await device!.createSendTransport(params);
        updateProducerTransport(producerTransport);

        // Handle 'connect' event
        producerTransport.on(
          'connect',
          async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, callback: () => void, errback: (error: Error) => void) => {
            try {
              socket.emit('transport-connect', { dtlsParameters });
              callback();
            } catch (error) {
              errback(error as Error);
            }
          },
        );

        // Handle 'produce' event
        producerTransport.on(
          'produce',
          async (

            parameters: { kind: string; rtpParameters: any; appData: any },
            callback: (response: { id: string }) => void,
            errback: (error: Error) => void,
          ) => {
            try {
              socket.emit(
                'transport-produce',
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                  islevel,
                  name: member,
                },
                async ({ id }: { id: string }) => {
                  callback({ id });
                },
              );
            } catch (error) {
              errback(error as Error);
            }
          },
        );

        // Handle 'connectionstatechange' event
        producerTransport.on('connectionstatechange', async (state: string) => {
          switch (state) {
            case 'connecting':
              // console.log('Transport connecting...');
              break;
            case 'connected':
              // console.log('Transport connected.');
              break;
            case 'failed':
              console.log('Transport connection failed.');
              producerTransport!.close();
              break;
            default:
              break;
          }
        });

        // Update transport creation state
        transportCreated = true;
        await connectSendTransport({
          option,
          parameters: {
            ...parameters,
            producerTransport,
          },
        });

        updateTransportCreated(transportCreated);
      },
    );
  } catch (error) {
    console.log('Error creating send transport:', error);
  }
};
