import { streamSuccessAudio as sharedStreamSuccessAudio } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import { ProducerOptions } from 'mediasoup-client/lib/types';
import {
  Participant, PrepopulateUserMediaParameters, ShowAlert, CreateSendTransportParameters, ConnectSendTransportAudioParameters,
  ResumeSendTransportAudioParameters, PrepopulateUserMediaType, CreateSendTransportType, ConnectSendTransportAudioType,
  ResumeSendTransportAudioType,
} from '../@types/types';
import { MediaStream } from '../methods/utils/webrtc/webrtc';

export interface StreamSuccessAudioParameters extends CreateSendTransportParameters, ConnectSendTransportAudioParameters, ResumeSendTransportAudioParameters, PrepopulateUserMediaParameters {
  socket: Socket;
  participants: Participant[];
  localStream: MediaStream | null;
  transportCreated: boolean;
  transportCreatedAudio: boolean;
  audioAlreadyOn: boolean;
  micAction: boolean;
  audioParams: ProducerOptions;
  localStreamAudio: MediaStream | null;
  defAudioID: string;
  userDefaultAudioInputDevice: string;
  params: ProducerOptions;
  audioParamse?: ProducerOptions;
  aParams: ProducerOptions;
  hostLabel: string;
  islevel: string;
  member: string;
  updateMainWindow: boolean;
  lock_screen: boolean;
  shared: boolean;
  videoAlreadyOn: boolean;
  showAlert?: ShowAlert;

  updateParticipants: (participants: Participant[]) => void;
  updateTransportCreated: (transportCreated: boolean) => void;
  updateTransportCreatedAudio: (transportCreatedAudio: boolean) => void;
  updateAudioAlreadyOn: (audioAlreadyOn: boolean) => void;
  updateMicAction: (micAction: boolean) => void;
  updateAudioParams: (audioParams: ProducerOptions) => void;
  updateLocalStream: (localStream: MediaStream | null) => void;
  updateLocalStreamAudio: (localStreamAudio: MediaStream | null) => void;
  updateDefAudioID: (defAudioID: string) => void;
  updateUserDefaultAudioInputDevice: (userDefaultAudioInputDevice: string) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  createSendTransport: CreateSendTransportType;
  connectSendTransportAudio: ConnectSendTransportAudioType;
  resumeSendTransportAudio: ResumeSendTransportAudioType;
  prepopulateUserMedia: PrepopulateUserMediaType;

  getUpdatedAllParams: () => StreamSuccessAudioParameters;
  [key: string]: any;
}

export interface StreamSuccessAudioOptions {
  stream: MediaStream;
  parameters: StreamSuccessAudioParameters;
}

export type StreamSuccessAudioType = (options: StreamSuccessAudioOptions) => Promise<void>;

export const streamSuccessAudio: StreamSuccessAudioType = async (options): Promise<void> => {
  await (sharedStreamSuccessAudio as unknown as StreamSuccessAudioType)(options);
};
