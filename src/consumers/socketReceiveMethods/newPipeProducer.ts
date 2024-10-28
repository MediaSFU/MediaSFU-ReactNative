import { Socket } from 'socket.io-client';
import { Device } from 'mediasoup-client/lib/types';
import { signalNewConsumerTransport } from '../../consumers/signalNewConsumerTransport';
import {
  ReorderStreamsParameters, ReorderStreamsType, SignalNewConsumerTransportParameters, ConnectRecvTransportParameters, ConnectRecvTransportType, ShowAlert,
} from '../../@types/types';

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
  [key: string]: any;

}

export interface NewPipeProducerOptions {
  producerId: string;
  islevel: string;
  nsock: Socket;
  parameters: NewPipeProducerParameters;
}

// Export the type definition for the function
export type NewPipeProducerType = (options: NewPipeProducerOptions) => Promise<void>;

export const newPipeProducer = async ({
  producerId,
  islevel,
  nsock,
  parameters,
}: NewPipeProducerOptions): Promise<void> => {
  const {
    shareScreenStarted,
    shared,
    landScaped,
    showAlert,
    isWideScreen,
    updateFirst_round,
    updateLandScaped,
  } = parameters;

  // Signal new consumer transport
  await signalNewConsumerTransport({
    remoteProducerId: producerId,
    islevel,
    nsock,
    parameters,
  });

  // Modify first_round and landscape status
  let updatedFirstRound = false;

  if (shareScreenStarted || shared) {
    if (!isWideScreen) {
      if (!landScaped) {
        if (showAlert) {
          showAlert({
            message: 'Please rotate your device to landscape mode for better experience',
            type: 'success',
            duration: 3000,
          });
        }
        updateLandScaped(true);
      }
    }

    updatedFirstRound = true;
    updateFirst_round(updatedFirstRound);
  }
};
