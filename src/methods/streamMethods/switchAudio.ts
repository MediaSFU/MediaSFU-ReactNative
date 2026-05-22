import { switchAudio as sharedSwitchAudio } from 'mediasfu-shared';
import { SwitchUserAudioType, SwitchUserAudioParameters } from '../../@types/types';

export interface SwitchAudioParameters extends SwitchUserAudioParameters {
  defAudioID: string;
  userDefaultAudioInputDevice: string;
  prevAudioInputDevice: string;
  updateUserDefaultAudioInputDevice: (deviceId: string) => void;
  updatePrevAudioInputDevice: (deviceId: string) => void;

  switchUserAudio: SwitchUserAudioType;

  getUpdatedAllParams: () => SwitchAudioParameters;
  [key: string]: any;
}

export interface SwitchAudioOptions {
  audioPreference: string;
  parameters: SwitchAudioParameters;
}

export type SwitchAudioType = (options: SwitchAudioOptions) => Promise<void>;

export const switchAudio: SwitchAudioType = async ({
  audioPreference,
  parameters,
}): Promise<void> => {
  await (sharedSwitchAudio as unknown as (options: SwitchAudioOptions) => Promise<void>)({
    audioPreference,
    parameters,
  });
};
