import { stopRecording as sharedStopRecording } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';

export interface StopRecordingParameters {
  roomName: string;
  socket: Socket;
  localSocket?: Socket;
  showAlert?: ShowAlert;
  startReport: boolean;
  endReport: boolean;
  recordStarted: boolean;
  recordPaused: boolean;
  recordStopped: boolean;
  updateRecordPaused: (paused: boolean) => void;
  updateRecordStopped: (stopped: boolean) => void;
  updateStartReport: (startReport: boolean) => void;
  updateEndReport: (endReport: boolean) => void;
  updateShowRecordButtons: (show: boolean) => void;
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  recordingMediaOptions: string;
  captureCanvasStream: (options: { parameters: any; start?: boolean }) => void;
  [key: string]: any;
}

export interface StopRecordingOptions {
  parameters: StopRecordingParameters;
}

export type StopRecordingType = (options: StopRecordingOptions) => Promise<void>;

export const stopRecording: StopRecordingType = async ({
  parameters,
}: StopRecordingOptions): Promise<void> => {
  await (sharedStopRecording as unknown as (options: StopRecordingOptions) => Promise<void>)({
    parameters,
  });
};
