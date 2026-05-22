import { Device } from 'mediasoup-client/lib/types';
import { connectIps as sharedConnectIps } from 'mediasfu-shared';
import {
  ReorderStreamsParameters, ReorderStreamsType, NewPipeProducerParameters, NewPipeProducerType, ProducerClosedType,
  ProducerClosedParameters, JoinConsumeRoomType, JoinConsumeRoomParameters, ConsumeSocket,
} from '../@types/types';

export interface ConnectIpsParameters extends ReorderStreamsParameters, JoinConsumeRoomParameters, ProducerClosedParameters, NewPipeProducerParameters {
  device: Device | null;
  roomRecvIPs: string[];
  updateRoomRecvIPs: (roomRecvIPs: string[]) => void;
  updateConsume_sockets: (consume_sockets: ConsumeSocket[]) => void;
  reorderStreams: ReorderStreamsType;
  getUpdatedAllParams: () => ConnectIpsParameters;
  [key: string]: any;
}

export interface ConnectIpsOptions {
  consume_sockets: ConsumeSocket[];
  remIP: string[];
  apiUserName: string;
  apiKey?: string;
  apiToken: string;
  newProducerMethod?: NewPipeProducerType;
  closedProducerMethod?: ProducerClosedType;
  joinConsumeRoomMethod?: JoinConsumeRoomType;
  parameters: ConnectIpsParameters;
}

export type ConnectIpsType = (options: ConnectIpsOptions) => Promise<[Record<string, any>[], string[]]>;

export const connectIps: ConnectIpsType = async (options) => {
  return (sharedConnectIps as unknown as ConnectIpsType)(options);
};
