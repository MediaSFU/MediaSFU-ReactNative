import { switchUserVideo as sharedSwitchUserVideo } from 'mediasfu-shared';
import { ClickVideoParameters } from '../methods/streamMethods/clickVideo';
import {
  ShowAlert, VidCons, RequestPermissionCameraType, StreamSuccessVideoType, SleepType, StreamSuccessVideoParameters,
  MediaDevices,
} from '../@types/types';

export interface SwitchUserVideoParameters extends StreamSuccessVideoParameters, ClickVideoParameters {
  audioOnlyRoom: boolean;
  frameRate: number;
  vidCons: VidCons;
  prevVideoInputDevice: string;
  userDefaultVideoInputDevice: string;
  showAlert?: ShowAlert;
  mediaDevices: MediaDevices;
  hasCameraPermission: boolean;
  updateVideoSwitching: (state: boolean) => void;
  updateUserDefaultVideoInputDevice: (deviceId: string) => void;

  requestPermissionCamera: RequestPermissionCameraType;
  streamSuccessVideo: StreamSuccessVideoType;
  sleep: SleepType;
  checkMediaPermission: boolean;

  getUpdatedAllParams: () => SwitchUserVideoParameters;
  [key: string]: any;
}

export interface SwitchUserVideoOptions {
  videoPreference: string;
  checkoff: boolean;
  parameters: SwitchUserVideoParameters;
}

export type SwitchUserVideoType = (options: SwitchUserVideoOptions) => Promise<void>;

export const switchUserVideo: SwitchUserVideoType = async (options): Promise<void> => {
  await (sharedSwitchUserVideo as unknown as SwitchUserVideoType)(options);
};
