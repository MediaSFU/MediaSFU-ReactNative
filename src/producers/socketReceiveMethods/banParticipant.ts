import {
  Participant,
  ReorderStreamsType,
  ReorderStreamsParameters,
} from '../../@types/types';
import { banParticipant as sharedBanParticipant } from 'mediasfu-shared';

export interface BanParticipantParameters extends ReorderStreamsParameters {
  activeNames: string[];
  dispActiveNames: string[];
  participants: Participant[];
  updateParticipants: (participants: Participant[]) => void;
  reorderStreams: ReorderStreamsType;
  [key: string]: any;
}

export interface BanParticipantOptions {
  name: string;
  parameters: BanParticipantParameters;
}

export type BanParticipantType = (options: BanParticipantOptions) => Promise<void>;

export const banParticipant = async ({
  name,
  parameters,
}: BanParticipantOptions): Promise<void> => {
  return sharedBanParticipant({
    name,
    parameters,
  });
};
