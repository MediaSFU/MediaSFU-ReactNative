import { streamSuccessScreen as sharedStreamSuccessScreen } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import {
  SleepType, CreateSendTransportType, ConnectSendTransportScreenType, DisconnectSendTransportScreenType, StopShareScreenType, ReorderStreamsType, PrepopulateUserMediaType, RePortType,
  ShowAlert, CreateSendTransportParameters, ConnectSendTransportScreenParameters, DisconnectSendTransportScreenParameters, StopShareScreenParameters, ReorderStreamsParameters, PrepopulateUserMediaParameters,
  EventType, MediaStream,
} from '../@types/types';

export interface StreamSuccessScreenParameters extends CreateSendTransportParameters, ConnectSendTransportScreenParameters, DisconnectSendTransportScreenParameters, StopShareScreenParameters, ReorderStreamsParameters, PrepopulateUserMediaParameters {
  socket: Socket;
  transportCreated: boolean;
  localStreamScreen: MediaStream | null;
  screenAlreadyOn: boolean;
  screenAction: boolean;
  transportCreatedScreen: boolean;
  hostLabel: string;
  eventType: EventType;
  showAlert?: ShowAlert;
  annotateScreenStream: boolean;
  shared: boolean;

  updateTransportCreatedScreen: (transportCreatedScreen: boolean) => void;
  updateScreenAlreadyOn: (screenAlreadyOn: boolean) => void;
  updateScreenAction: (screenAction: boolean) => void;
  updateTransportCreated: (transportCreated: boolean) => void;
  updateLocalStreamScreen: (localStreamScreen: MediaStream | null) => void;
  updateShared: (shared: boolean) => void;
  updateIsScreenboardModalVisible: (isVisible: boolean) => void;

  sleep: SleepType;
  createSendTransport: CreateSendTransportType;
  connectSendTransportScreen: ConnectSendTransportScreenType;
  disconnectSendTransportScreen: DisconnectSendTransportScreenType;
  stopShareScreen: StopShareScreenType;
  reorderStreams: ReorderStreamsType;
  prepopulateUserMedia: PrepopulateUserMediaType;
  rePort: RePortType;

  getUpdatedAllParams: () => StreamSuccessScreenParameters;
  [key: string]: any;
}

export interface StreamSuccessScreenOptions {
  stream: MediaStream;
  parameters: StreamSuccessScreenParameters;
}

export type StreamSuccessScreenType = (options: StreamSuccessScreenOptions) => Promise<void>;

export const streamSuccessScreen: StreamSuccessScreenType = async (options): Promise<void> => {
  await (sharedStreamSuccessScreen as unknown as StreamSuccessScreenType)(options);
};
