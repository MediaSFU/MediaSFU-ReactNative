import { clickAudio as sharedClickAudio } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import {
  CheckPermissionType, DisconnectSendTransportAudioParameters, DisconnectSendTransportAudioType, Participant,
  RequestPermissionAudioType, ResumeSendTransportAudioParameters, ResumeSendTransportAudioType, ShowAlert, StreamSuccessAudioParameters,
  StreamSuccessAudioType, MediaDevices, MediaStream,
} from '../../@types/types';

export interface ClickAudioParameters extends DisconnectSendTransportAudioParameters, ResumeSendTransportAudioParameters, StreamSuccessAudioParameters {
  checkMediaPermission: boolean;
  hasAudioPermission: boolean;
  audioPaused: boolean;
  audioAlreadyOn: boolean;
  audioOnlyRoom: boolean;
  recordStarted: boolean;
  recordResumed: boolean;
  recordPaused: boolean;
  recordStopped: boolean;
  recordingMediaOptions: string;
  islevel: string;
  youAreCoHost: boolean;
  adminRestrictSetting: boolean;
  audioRequestState: string | null;
  audioRequestTime: number;
  member: string;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  userDefaultAudioInputDevice: string;
  micAction: boolean;
  localStream: MediaStream | null;
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  updateRequestIntervalSeconds: number;
  participants: Participant[];
  mediaDevices: MediaDevices;
  transportCreated: boolean;
  transportCreatedAudio: boolean;

  updateAudioAlreadyOn: (status: boolean) => void;
  updateAudioRequestState: (state: string | null) => void;
  updateAudioPaused: (status: boolean) => void;
  updateLocalStream: (stream: MediaStream | null) => void;
  updateParticipants: (participants: Participant[]) => void;
  updateTransportCreated: (status: boolean) => void;
  updateTransportCreatedAudio: (status: boolean) => void;
  updateMicAction: (action: boolean) => void;
  showAlert?: ShowAlert;

  checkPermission: CheckPermissionType;
  streamSuccessAudio: StreamSuccessAudioType;
  disconnectSendTransportAudio: DisconnectSendTransportAudioType;
  requestPermissionAudio: RequestPermissionAudioType;
  resumeSendTransportAudio: ResumeSendTransportAudioType;

  getUpdatedAllParams: () => ClickAudioParameters;
  [key: string]: any;
}

export interface ClickAudioOptions {
  parameters: ClickAudioParameters;
}

export type ClickAudioType = (options: ClickAudioOptions) => Promise<void>;

export const clickAudio: ClickAudioType = async ({
  parameters,
}): Promise<void> => {
  await (sharedClickAudio as unknown as (options: ClickAudioOptions) => Promise<void>)({
    parameters,
  });
};
