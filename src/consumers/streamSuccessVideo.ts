import { streamSuccessVideo as sharedStreamSuccessVideo } from 'mediasfu-shared';
import {
  Device, Producer, ProducerOptions,
} from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import {
  ConnectSendTransportVideoParameters, Participant, ShowAlert, CreateSendTransportParameters, ReorderStreamsParameters, SleepType,
  CreateSendTransportType, ConnectSendTransportVideoType, ReorderStreamsType, HParamsType, VParamsType,
} from '../@types/types';
import { MediaStream } from '../methods/utils/webrtc/webrtc';

export interface StreamSuccessVideoParameters extends CreateSendTransportParameters, ConnectSendTransportVideoParameters, ReorderStreamsParameters {
  socket: Socket;
  participants: Participant[];
  localStream: MediaStream | null;
  transportCreated: boolean;
  transportCreatedVideo: boolean;
  videoAlreadyOn: boolean;
  videoAction: boolean;
  videoParams: ProducerOptions;
  localStreamVideo: MediaStream | null;
  defVideoID: string;
  userDefaultVideoInputDevice: string;
  params: ProducerOptions;
  videoParamse?: ProducerOptions;
  islevel: string;
  member: string;
  updateMainWindow: boolean;
  lock_screen: boolean;
  shared: boolean;
  shareScreenStarted: boolean;
  vParams: VParamsType;
  hParams: HParamsType;
  allowed: boolean;
  currentFacingMode: string;
  device: Device | null;
  keepBackground: boolean;
  appliedBackground: boolean;
  videoProducer: Producer | null;

  updateTransportCreatedVideo: (created: boolean) => void;
  updateVideoAlreadyOn: (videoOn: boolean) => void;
  updateVideoAction: (videoAction: boolean) => void;
  updateLocalStream: (stream: MediaStream | null) => void;
  updateLocalStreamVideo: (stream: MediaStream | null) => void;
  updateUserDefaultVideoInputDevice: (device: string) => void;
  updateCurrentFacingMode: (mode: string) => void;
  updateDefVideoID: (id: string) => void;
  updateAllowed: (allowed: boolean) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;
  updateParticipants: (participants: Participant[]) => void;
  updateVideoParams: (params: ProducerOptions) => void;
  updateIsBackgroundModalVisible: (isVisible: boolean) => void;
  updateAutoClickBackground: (autoClick: boolean) => void;

  showAlert?: ShowAlert;

  createSendTransport: CreateSendTransportType;
  connectSendTransportVideo: ConnectSendTransportVideoType;
  reorderStreams: ReorderStreamsType;
  sleep: SleepType;

  getUpdatedAllParams: () => StreamSuccessVideoParameters;
  [key: string]: any;
}

export interface StreamSuccessVideoOptions {
  stream: MediaStream;
  parameters: StreamSuccessVideoParameters;
}

export type StreamSuccessVideoType = (options: StreamSuccessVideoOptions) => Promise<void>;

export const streamSuccessVideo: StreamSuccessVideoType = async ({
  stream,
  parameters,
}): Promise<void> => {
  await (sharedStreamSuccessVideo as unknown as (options: {
    stream: MediaStream;
    parameters: StreamSuccessVideoParameters & { removeSingleVideoEncoding?: boolean };
  }) => Promise<void>)({
    stream,
    parameters: {
      ...parameters,
      removeSingleVideoEncoding: true,
    },
  });
};
