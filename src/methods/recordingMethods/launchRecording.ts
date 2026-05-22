import { launchRecording as sharedLaunchRecording } from 'mediasfu-shared';
import { ShowAlert } from '../../@types/types';

export interface LaunchRecordingOptions {
  updateIsRecordingModalVisible: (visible: boolean) => void;
  isRecordingModalVisible: boolean;
  showAlert?: ShowAlert;
  stopLaunchRecord: boolean;
  canLaunchRecord: boolean;
  recordingAudioSupport: boolean;
  recordingVideoSupport: boolean;
  updateCanRecord: (canRecord: boolean) => void;
  updateClearedToRecord: (cleared: boolean) => void;
  recordStarted: boolean;
  recordPaused: boolean;
  localUIMode: boolean;
  [key: string]: any;
}

export type LaunchRecordingType = (options: LaunchRecordingOptions) => void;

export const launchRecording: LaunchRecordingType = ({
  updateIsRecordingModalVisible,
  isRecordingModalVisible,
  showAlert,
  stopLaunchRecord,
  canLaunchRecord,
  recordingAudioSupport,
  recordingVideoSupport,
  updateCanRecord,
  updateClearedToRecord,
  recordStarted,
  recordPaused,
  localUIMode,
}: LaunchRecordingOptions): void => {
  (sharedLaunchRecording as unknown as (options: LaunchRecordingOptions) => void)({
    updateIsRecordingModalVisible,
    isRecordingModalVisible,
    showAlert,
    stopLaunchRecord,
    canLaunchRecord,
    recordingAudioSupport,
    recordingVideoSupport,
    updateCanRecord,
    updateClearedToRecord,
    recordStarted,
    recordPaused,
    localUIMode,
  });
};
