import { switchUserVideoAlt as sharedSwitchUserVideoAlt } from 'mediasfu-shared';
import { ClickVideoParameters } from '../methods/streamMethods/clickVideo';
import {
  ShowAlert, VidCons, RequestPermissionCameraType, StreamSuccessVideoType, SleepType, StreamSuccessVideoParameters,
  MediaDevices,
} from '../@types/types';

export interface SwitchUserVideoAltParameters extends StreamSuccessVideoParameters, ClickVideoParameters {
  audioOnlyRoom: boolean;
  frameRate: number;
  vidCons: VidCons;
  showAlert?: ShowAlert;
  mediaDevices: MediaDevices;
  hasCameraPermission: boolean;
  updateVideoSwitching: (state: boolean) => void;
  updateCurrentFacingMode: (mode: string) => void;

  requestPermissionCamera: RequestPermissionCameraType;
  streamSuccessVideo: StreamSuccessVideoType;
  sleep: SleepType;
  checkMediaPermission: boolean;
  getUpdatedAllParams: () => SwitchUserVideoAltParameters;

  [key: string]: any;
}

export interface SwitchUserVideoAltOptions {
  videoPreference: string;
  checkoff: boolean;
  parameters: SwitchUserVideoAltParameters;
}

export type SwitchUserVideoAltType = (options: SwitchUserVideoAltOptions) => Promise<void>;

export const switchUserVideoAlt: SwitchUserVideoAltType = async (options): Promise<void> => {
  await (sharedSwitchUserVideoAlt as unknown as SwitchUserVideoAltType)(options);
};
