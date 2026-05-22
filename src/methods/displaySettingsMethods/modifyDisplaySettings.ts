import { modifyDisplaySettings as sharedModifyDisplaySettings } from 'mediasfu-shared';
import { OnScreenChangesParameters, OnScreenChangesType, ShowAlert } from '../../@types/types';

export interface ModifyDisplaySettingsParameters extends OnScreenChangesParameters {
  showAlert?: ShowAlert;
  meetingDisplayType: string;
  autoWave: boolean;
  forceFullDisplay: boolean;
  showSubtitlesOnCards?: boolean;
  meetingVideoOptimized: boolean;
  islevel: string;
  recordStarted: boolean;
  recordResumed: boolean;
  recordStopped: boolean;
  recordPaused: boolean;
  recordingDisplayType: 'video' | 'media' | 'all';
  recordingVideoOptimized: boolean;
  prevForceFullDisplay: boolean;
  prevMeetingDisplayType: string;
  updateMeetingDisplayType: (displayType: string) => void;
  updateAutoWave: (autoWave: boolean) => void;
  updateForceFullDisplay: (forceFullDisplay: boolean) => void;
  updateShowSubtitlesOnCards?: (showSubtitlesOnCards: boolean) => void;
  updateMeetingVideoOptimized: (optimized: boolean) => void;
  updatePrevForceFullDisplay: (forceFullDisplay: boolean) => void;
  updatePrevMeetingDisplayType: (displayType: string) => void;
  updateIsDisplaySettingsModalVisible: (isVisible: boolean) => void;
  updateFirstAll: (firstAll: boolean) => void;
  updateUpdateMainWindow: (update: boolean) => void;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  onScreenChanges: OnScreenChangesType;
  [key: string]: any;
}

export interface ModifyDisplaySettingsOptions {
  parameters: ModifyDisplaySettingsParameters;
}

export type ModifyDisplaySettingsType = (options: ModifyDisplaySettingsOptions) => Promise<void>;

export const modifyDisplaySettings = async ({ parameters }: ModifyDisplaySettingsOptions): Promise<void> => {
  return sharedModifyDisplaySettings({ parameters: parameters as any } as any);
};
