import { recordResumeTimer as sharedRecordResumeTimer } from 'mediasfu-shared';
import { ShowAlert } from '../../@types/types';

export interface RecordResumeTimerParameters {
  isTimerRunning: boolean;
  canPauseResume: boolean;
  recordElapsedTime: number;
  recordStartTime: number;
  recordTimerInterval?: NodeJS.Timeout | null;
  showAlert?: ShowAlert;
  updateRecordStartTime: (time: number) => void;
  updateRecordTimerInterval: (interval: NodeJS.Timeout | null) => void;
  updateIsTimerRunning: (isRunning: boolean) => void;
  updateCanPauseResume: (canPause: boolean) => void;

  getUpdatedAllParams: () => RecordResumeTimerParameters;
  [key: string]: any;
}

export interface RecordResumeTimerOptions {
  parameters: RecordResumeTimerParameters;
}

export type RecordResumeTimerType = (options: RecordResumeTimerOptions) => Promise<boolean>;

export const recordResumeTimer: RecordResumeTimerType = async ({
  parameters,
}: RecordResumeTimerOptions): Promise<boolean> => {
  return (sharedRecordResumeTimer as unknown as (options: RecordResumeTimerOptions) => Promise<boolean>)({
    parameters,
  });
};
