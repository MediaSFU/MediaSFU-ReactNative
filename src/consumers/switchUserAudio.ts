import { switchUserAudio as sharedSwitchUserAudio } from 'mediasfu-shared';
import {
  ShowAlert, StreamSuccessAudioSwitchType, RequestPermissionAudioType, StreamSuccessAudioSwitchParameters,
  MediaDevices,
} from '../@types/types';

export interface SwitchUserAudioParameters extends StreamSuccessAudioSwitchParameters {
  mediaDevices: MediaDevices;
  userDefaultAudioInputDevice: string;
  prevAudioInputDevice: string;
  showAlert?: ShowAlert;
  hasAudioPermission: boolean;
  updateUserDefaultAudioInputDevice: (deviceId: string) => void;

  streamSuccessAudioSwitch: StreamSuccessAudioSwitchType;
  requestPermissionAudio: RequestPermissionAudioType;
  checkMediaPermission: boolean;

  [key: string]: any;
}

export interface SwitchUserAudioOptions {
  audioPreference: string;
  parameters: SwitchUserAudioParameters;
}

export type SwitchUserAudioType = (options: SwitchUserAudioOptions) => Promise<void>;

export const switchUserAudio: SwitchUserAudioType = async (options): Promise<void> => {
  await (sharedSwitchUserAudio as unknown as SwitchUserAudioType)(options);
};
