import { switchVideoAlt as sharedSwitchVideoAlt } from 'mediasfu-shared';
import { ShowAlert, SwitchUserVideoAltType, SwitchUserVideoAltParameters } from '../../@types/types';

export interface SwitchVideoAltParameters extends SwitchUserVideoAltParameters {
  recordStarted: boolean;
  recordResumed: boolean;
  recordStopped: boolean;
  recordPaused: boolean;
  recordingMediaOptions: string;
  videoAlreadyOn: boolean;
  currentFacingMode: string;
  prevFacingMode: string;
  allowed: boolean;
  audioOnlyRoom: boolean;
  updateCurrentFacingMode: (mode: string) => void;
  updatePrevFacingMode: (mode: string) => void;
  updateIsMediaSettingsModalVisible: (isVisible: boolean) => void;
  showAlert?: ShowAlert;

  switchUserVideoAlt: SwitchUserVideoAltType;

  getUpdatedAllParams: () => SwitchVideoAltParameters;
  [key: string]: any;
}

export interface SwitchVideoAltOptions {
  parameters: SwitchVideoAltParameters;
}

export type SwitchVideoAltType = (options: SwitchVideoAltOptions) => Promise<void>;

export const switchVideoAlt: SwitchVideoAltType = async ({
  parameters,
}): Promise<void> => {
  await (sharedSwitchVideoAlt as unknown as (options: SwitchVideoAltOptions) => Promise<void>)({
    parameters,
  });
};
