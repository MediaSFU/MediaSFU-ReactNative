import { disconnectSendTransportVideo as sharedDisconnectSendTransportVideo } from 'mediasfu-shared';
import { Producer } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import { ReorderStreamsType, ReorderStreamsParameters } from '../@types/types';

export interface DisconnectSendTransportVideoParameters extends ReorderStreamsParameters {
  videoProducer: Producer | null;
  localVideoProducer?: Producer | null;
  socket: Socket;
  localSocket?: Socket;
  islevel: string;
  roomName: string;
  lock_screen: boolean;
  updateMainWindow: boolean;
  updateUpdateMainWindow: (state: boolean) => void;
  updateVideoProducer: (producer: Producer | null) => void;
  updateLocalVideoProducer?: (producer: Producer | null) => void;

  // mediasfu functions
  reorderStreams: ReorderStreamsType;
  [key: string]: any;
}

export interface DisconnectSendTransportVideoOptions {
  parameters: DisconnectSendTransportVideoParameters;
}

export type DisconnectSendTransportVideoType = (options: DisconnectSendTransportVideoOptions) => Promise<void>;

export const disconnectSendTransportVideo: DisconnectSendTransportVideoType = async (options): Promise<void> => {
  await (sharedDisconnectSendTransportVideo as unknown as DisconnectSendTransportVideoType)(options);
};
