import { recordUpdateTimer as sharedRecordUpdateTimer } from 'mediasfu-shared';

export interface RecordUpdateTimerOptions {
  recordElapsedTime: number;
  recordStartTime: number;
  updateRecordElapsedTime: (elapsedTime: number) => void;
  updateRecordingProgressTime: (formattedTime: string) => void;
}

export type RecordUpdateTimerType = (options: RecordUpdateTimerOptions) => void;

export const recordUpdateTimer: RecordUpdateTimerType = ({
  recordElapsedTime,
  recordStartTime,
  updateRecordElapsedTime,
  updateRecordingProgressTime,
}): void => {
  (sharedRecordUpdateTimer as unknown as (options: RecordUpdateTimerOptions) => void)({
    recordElapsedTime,
    recordStartTime,
    updateRecordElapsedTime,
    updateRecordingProgressTime,
  });
};
