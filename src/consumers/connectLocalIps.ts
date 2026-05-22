import { Socket } from 'socket.io-client';
import { connectLocalIps as sharedConnectLocalIps } from 'mediasfu-shared';
import {
  ReorderStreamsParameters, ReorderStreamsType, NewPipeProducerParameters, NewPipeProducerType, ProducerClosedType,
  ProducerClosedParameters,
  ReceiveAllPipedTransportsParameters,
} from '../@types/types';

export interface ConnectLocalIpsParameters extends ReorderStreamsParameters, ProducerClosedParameters, NewPipeProducerParameters,
ReceiveAllPipedTransportsParameters {
  socket: Socket;
  reorderStreams: ReorderStreamsType;
  getUpdatedAllParams: () => ConnectLocalIpsParameters;
  [key: string]: any;
}

export interface ConnectLocalIpsOptions {
  socket: Socket;
  newProducerMethod?: NewPipeProducerType;
  closedProducerMethod?: ProducerClosedType;
  parameters: ConnectLocalIpsParameters;
}

export type ConnectLocalIpsType = (options: ConnectLocalIpsOptions) => Promise<void>;

export const connectLocalIps: ConnectLocalIpsType = async (options) => {
  await (sharedConnectLocalIps as unknown as ConnectLocalIpsType)(options);
};
