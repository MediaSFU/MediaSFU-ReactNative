import { recordStartTimer as sharedRecordStartTimer } from 'mediasfu-shared';

export interface RecordStartTimerParameters {
  recordStartTime: number;
  recordTimerInterval?: NodeJS.Timeout | null;
  isTimerRunning: boolean;
  canPauseResume: boolean;
  recordChangeSeconds: number;
  recordPaused: boolean;
  recordStopped: boolean;
  roomName: string | null;
  updateRecordStartTime: (time: number) => void;
  updateRecordTimerInterval: (interval: NodeJS.Timeout | null) => void;
  updateIsTimerRunning: (isRunning: boolean) => void;
  updateCanPauseResume: (canPause: boolean) => void;

  getUpdatedAllParams: () => RecordStartTimerParameters;
  [key: string]: any;
}

export interface RecordStartTimerOptions {
  parameters: RecordStartTimerParameters;
}

export type RecordStartTimerType = (options: RecordStartTimerOptions) => Promise<void>;

export const recordStartTimer: RecordStartTimerType = async ({
  parameters,
}: RecordStartTimerOptions): Promise<void> => {
  await (sharedRecordStartTimer as unknown as (options: RecordStartTimerOptions) => Promise<void>)({
    parameters,
  });
};
