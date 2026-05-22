import { changeVids as sharedChangeVids } from 'mediasfu-shared';
import {
  Stream, Participant, DispStreamsType, DispStreamsParameters, AudioDecibels, MixStreamsType, BreakoutParticipant,
  EventType, MediaStream,
} from '../@types/types';

export interface ChangeVidsParameters extends DispStreamsParameters {
  allVideoStreams: (Stream | Participant)[];
  p_activeNames: string[];
  activeNames: string[];
  dispActiveNames: string[];
  shareScreenStarted: boolean;
  shared: boolean;
  newLimitedStreams: (Stream | Participant)[];
  non_alVideoStreams: Participant[];
  ref_participants: Participant[];
  participants: Participant[];
  eventType: EventType;
  islevel: string;
  member: string;
  sortAudioLoudness: boolean;
  audioDecibels: AudioDecibels[];
  mixed_alVideoStreams: (Stream | Participant)[];
  non_alVideoStreams_muted: Participant[];
  remoteProducerId?: string;
  localStreamVideo: MediaStream | null;
  oldAllStreams: (Stream | Participant)[];
  screenPageLimit: number;
  meetingDisplayType: string;
  meetingVideoOptimized: boolean;
  recordingVideoOptimized: boolean;
  recordingDisplayType: 'video' | 'media' | 'all';
  paginatedStreams: (Stream | Participant)[][];
  itemPageLimit: number;
  doPaginate: boolean;
  prevDoPaginate: boolean;
  currentUserPage: number;
  breakoutRooms: BreakoutParticipant[][];
  hostNewRoom: number;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  virtualStream: MediaStream | null;
  mainRoomsLength: number;
  memberRoom: number;
  updateP_activeNames: (names: string[]) => void;
  updateActiveNames: (names: string[]) => void;
  updateDispActiveNames: (names: string[]) => void;
  updateNewLimitedStreams: (streams: (Stream | Participant)[]) => void;
  updateNon_alVideoStreams: (participants: Participant[]) => void;
  updateRef_participants: (participants: Participant[]) => void;
  updateSortAudioLoudness: (sort: boolean) => void;
  updateMixed_alVideoStreams: (streams: (Stream | Participant)[]) => void;
  updateNon_alVideoStreams_muted: (participants: Participant[]) => void;
  updatePaginatedStreams: (streams: (Stream | Participant)[][]) => void;
  updateDoPaginate: (paginate: boolean) => void;
  updatePrevDoPaginate: (paginate: boolean) => void;
  updateCurrentUserPage: (page: number) => void;
  updateNumberPages: (pages: number) => void;
  updateMainRoomsLength: (length: number) => void;
  updateMemberRoom: (room: number) => void;
  mixStreams: MixStreamsType;
  dispStreams: DispStreamsType;
  getUpdatedAllParams: () => ChangeVidsParameters;
  [key: string]: any;
}

export interface ChangeVidsOptions {
  screenChanged?: boolean;
  parameters: ChangeVidsParameters;
}

export type ChangeVidsType = (options: ChangeVidsOptions) => Promise<void>;

export const changeVids = async (options: ChangeVidsOptions): Promise<void> => {
  await sharedChangeVids<ChangeVidsParameters>(options);
};
