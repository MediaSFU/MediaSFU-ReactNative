import { Socket } from 'socket.io-client';
import {
  Participant, CoHostResponsibility, OnScreenChangesType, OnScreenChangesParameters, Request, ConnectIpsParameters,
  ReorderStreamsParameters, ConnectIpsType, SleepType, ReorderStreamsType, Settings, ConsumeSocket, ConnectLocalIpsType, ConnectLocalIpsParameters,
} from '../../@types/types';
import { allMembersRest as sharedAllMembersRest } from 'mediasfu-shared';
export interface AllMembersRestParameters extends OnScreenChangesParameters, ConnectIpsParameters, ReorderStreamsParameters, ConnectLocalIpsParameters {
  participantsAll: Participant[];
  participants: Participant[];
  dispActiveNames: string[];
  requestList: Request[];
  coHost: string;
  coHostResponsibility: CoHostResponsibility[];
  lock_screen: boolean;
  firstAll: boolean;
  membersReceived: boolean;
  roomRecvIPs: string[];
  deferScreenReceived: boolean;
  screenId?: string;
  shareScreenStarted: boolean;
  meetingDisplayType: string;
  audioSetting: string
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  socket: Socket;

  updateParticipantsAll: (participantsAll: Participant[]) => void;
  updateParticipants: (participants: Participant[]) => void;
  updateRequestList: (requestList: Request[]) => void;
  updateCoHost: (coHost: string) => void;
  updateCoHostResponsibility: (coHostResponsibility: CoHostResponsibility[]) => void;
  updateFirstAll: (firstAll: boolean) => void;
  updateMembersReceived: (membersReceived: boolean) => void;
  updateDeferScreenReceived: (deferScreenReceived: boolean) => void;
  updateShareScreenStarted: (shareScreenStarted: boolean) => void;
  updateAudioSetting: (audioSetting: string) => void;
  updateVideoSetting: (videoSetting: string) => void;
  updateScreenshareSetting: (screenshareSetting: string) => void;
  updateChatSetting: (chatSetting: string) => void;
  updateConsume_sockets: (consume_sockets: ConsumeSocket[]) => void;
  updateRoomRecvIPs: (ips: string[]) => void;
  updateIsLoadingModalVisible: (visible: boolean) => void;

  // mediasfu functions
  onScreenChanges: OnScreenChangesType;
  connectIps: ConnectIpsType;
  connectLocalIps?: ConnectLocalIpsType;
  sleep: SleepType;
  reorderStreams: ReorderStreamsType;

  getUpdatedAllParams: () => AllMembersRestParameters;
  [key: string]: any;
}

export interface AllMembersRestOptions {
  members: Participant[];
  settings: Settings;
  coHoste?: string;
  coHostRes?: CoHostResponsibility[];
  parameters: AllMembersRestParameters;
  consume_sockets: ConsumeSocket[];
  apiUserName: string;
  apiKey: string;
  apiToken: string;
}

// Export the type definition for the function
export type AllMembersRestType = (options: AllMembersRestOptions) => Promise<void>;

/**
 * Handles the reception and processing of all members' data.
 *
 * @param {Object} options - The options for the function.
 * @param {Array} options.members - The list of members.
 * @param {Settings} options.settings - The settings for audio, video, screenshare, and chat.
 * @param {string} [options.coHoste] - Optional co-host information.
 * @param {CoHostResponsibility[]} [options.coHostRes] - Optional co-host responsibility information.
 * @param {AllMembersRestParameters} options.parameters - The parameters for the function.
 * @param {ConsumeSocket[]} options.consume_sockets - The sockets to consume.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @param {string} options.apiToken - The API token.
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 *
 * @example
 * ```typescript
 * await allMembersRest({
 *   members: memberList,
 *   settings: { audio: 'on', video: 'on', screenshare: 'off', chat: 'on' },
 *   coHoste: 'coHostName',
 *   coHostRes: [{ type: 'moderate', allowed: true }],
 *   parameters: allParams,
 *   consume_sockets: [socket1, socket2],
 *   apiUserName: 'apiUser',
 *   apiKey: 'apiKey123',
 *   apiToken: 'tokenXYZ'
 * });
 * ```
 */

export const allMembersRest = async ({
  members,
  settings,
  coHoste,
  coHostRes,
  parameters,
  consume_sockets,
  apiUserName,
  apiKey,
  apiToken,
}: AllMembersRestOptions): Promise<void> => {
  return sharedAllMembersRest({
    members,
    settings,
    coHoste,
    coHostRes,
    parameters,
    consume_sockets,
    apiUserName,
    apiKey,
    apiToken,
  });
};
