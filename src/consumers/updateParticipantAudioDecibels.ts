import { AudioDecibels } from '../@types/types';
import { updateParticipantAudioDecibels as sharedUpdateParticipantAudioDecibels } from 'mediasfu-shared';

export interface UpdateParticipantAudioDecibelsOptions {
  name: string;
  averageLoudness: number;
  audioDecibels: AudioDecibels[];
  updateAudioDecibels: (audioDecibels: AudioDecibels[]) => void;
}

export type UpdateParticipantAudioDecibelsType = (options: UpdateParticipantAudioDecibelsOptions) => void;

export const updateParticipantAudioDecibels: UpdateParticipantAudioDecibelsType = (options) => {
  (sharedUpdateParticipantAudioDecibels as unknown as UpdateParticipantAudioDecibelsType)(options);
};
