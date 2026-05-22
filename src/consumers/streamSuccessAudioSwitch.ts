import { streamSuccessAudioSwitch as sharedStreamSuccessAudioSwitch } from 'mediasfu-shared';
import { Producer, ProducerCodecOptions, ProducerOptions } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import {
  PrepopulateUserMediaParameters, PrepopulateUserMediaType, CreateSendTransportParameters, CreateSendTransportType, ConnectSendTransportAudioParameters, ConnectSendTransportAudioType,
  SleepType, MediaStream as MediaStreamType,
} from '../@types/types';
import { MediaStream } from '../methods/utils/webrtc/webrtc';

export interface StreamSuccessAudioSwitchParameters extends PrepopulateUserMediaParameters, CreateSendTransportParameters, ConnectSendTransportAudioParameters {
  audioProducer: Producer | null;
  localAudioProducer?: Producer | null;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  localStream: MediaStream | null;
  localStreamAudio: MediaStream | null;
  audioParams: ProducerOptions;
  audioPaused: boolean;
  audioAlreadyOn: boolean;
  transportCreated: boolean;
  localTransportCreated?: boolean;
  audioParamse?: ProducerCodecOptions;
  defAudioID: string;
  userDefaultAudioInputDevice: string;
  hostLabel: string;
  updateMainWindow: boolean;
  videoAlreadyOn: boolean;
  islevel: string;
  lock_screen: boolean;
  shared: boolean;

  updateAudioProducer: (audioProducer: Producer | null) => void;
  updateLocalAudioProducer?: (localAudioProducer: Producer | null) => void;
  updateLocalStream: (localStream: MediaStream | null) => void;
  updateAudioParams: (audioParams: ProducerOptions) => void;
  updateDefAudioID: (defAudioID: string) => void;
  updateUserDefaultAudioInputDevice: (userDefaultAudioInputDevice: string) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  sleep: SleepType;
  prepopulateUserMedia: PrepopulateUserMediaType;
  createSendTransport: CreateSendTransportType;
  connectSendTransportAudio: ConnectSendTransportAudioType;

  getUpdatedAllParams: () => StreamSuccessAudioSwitchParameters;
  [key: string]: any;
}

export interface StreamSuccessAudioSwitchOptions {
  stream: MediaStreamType;
  parameters: StreamSuccessAudioSwitchParameters;
}

export type StreamSuccessAudioSwitchType = (options: StreamSuccessAudioSwitchOptions) => Promise<void>;

export const streamSuccessAudioSwitch: StreamSuccessAudioSwitchType = async (options): Promise<void> => {
  await (sharedStreamSuccessAudioSwitch as unknown as StreamSuccessAudioSwitchType)(options);
};
