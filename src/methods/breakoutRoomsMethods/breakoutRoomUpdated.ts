import { breakoutRoomUpdated as sharedBreakoutRoomUpdated } from 'mediasfu-shared';
import {
  BreakoutParticipant,
  BreakoutRoomUpdatedData,
  OnScreenChangesParameters,
  OnScreenChangesType,
  Participant,
  RePortParameters,
  RePortType,
} from '../../@types/types';

export interface BreakoutRoomUpdatedParameters extends OnScreenChangesParameters, RePortParameters {
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  breakoutRooms: BreakoutParticipant[][];
  hostNewRoom: number;
  islevel: string;
  participantsAll: Participant[];
  participants: Participant[];
  meetingDisplayType: string;
  prevMeetingDisplayType: string;
  updateBreakoutRooms: (rooms: BreakoutParticipant[][]) => void;
  updateBreakOutRoomStarted: (started: boolean) => void;
  updateBreakOutRoomEnded: (ended: boolean) => void;
  updateHostNewRoom: (room: number) => void;
  updateMeetingDisplayType: (type: string) => void;
  updateParticipantsAll: (participants: Participant[]) => void;
  updateParticipants: (participants: Participant[]) => void;
  onScreenChanges: OnScreenChangesType;
  rePort: RePortType;
  getUpdatedAllParams: () => BreakoutRoomUpdatedParameters;
  [key: string]: any;
}

export interface BreakoutRoomUpdatedOptions {
  data: BreakoutRoomUpdatedData;
  parameters: BreakoutRoomUpdatedParameters;
}

export type BreakoutRoomUpdatedType = (options: BreakoutRoomUpdatedOptions) => Promise<void>;

export const breakoutRoomUpdated = async ({ data, parameters }: BreakoutRoomUpdatedOptions): Promise<void> => {
  return sharedBreakoutRoomUpdated({ data: data as any, parameters: parameters as any } as any);
};
