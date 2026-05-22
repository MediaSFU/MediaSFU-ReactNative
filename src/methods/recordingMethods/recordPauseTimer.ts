import { recordPauseTimer as sharedRecordPauseTimer } from 'mediasfu-shared';
import { ShowAlert } from '../../@types/types';

export interface RecordPauseTimerOptions {
  stop?: boolean;
  isTimerRunning: boolean;
  canPauseResume: boolean;
  showAlert?: ShowAlert;
}

export type RecordPauseTimerType = (options: RecordPauseTimerOptions) => boolean;

export const recordPauseTimer: RecordPauseTimerType = ({
  stop = false,
  isTimerRunning,
  canPauseResume,
  showAlert,
}): boolean => {
  return (sharedRecordPauseTimer as unknown as (options: RecordPauseTimerOptions) => boolean)({
    stop,
    isTimerRunning,
    canPauseResume,
    showAlert,
  });
};
