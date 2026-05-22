/* eslint-disable eqeqeq */
import { updateRoomParametersClient as sharedUpdateRoomParametersClient } from 'mediasfu-shared';
import { RtpCapabilities } from 'mediasoup-client/lib/types';
import {
  QnHDCons,
  sdCons,
  hdCons,
  fhdCons,
  qhdCons,
  QnHDConsPort,
  sdConsPort,
  hdConsPort,
  fhdConsPort,
  qhdConsPort,
  QnHDConsNeu,
  sdConsNeu,
  hdConsNeu,
  fhdConsNeu,
  qhdConsNeu,
  QnHDFrameRate,
  hdFrameRate,
  fhdFrameRate,
  qhdFrameRate,
} from '../../methods/utils/producer/videoCaptureConstraints'; // Import the video capture constraints from the videoCaptureConstraints.js file

import { hParams as host_Params, HParamsType } from '../../methods/utils/producer/hParams';
import { vParams as video_Params, VParamsType } from '../../methods/utils/producer/vParams';
import { screenParams as screen_Params, ScreenParamsType } from '../../methods/utils/producer/screenParams';
import { aParams as audio_Params, AParamsType } from '../../methods/utils/producer/aParams';
import {
  MeetingRoomParams, VidCons, ShowAlert, ResponseJoinRoom, EventType,
} from '../../@types/types';

export interface UpdateRoomParametersClientParameters {
  rtpCapabilities: RtpCapabilities | null;
  roomRecvIPs: string[];
  meetingRoomParams: MeetingRoomParams | null;
  itemPageLimit: number;
  audioOnlyRoom: boolean;
  addForBasic: boolean;
  screenPageLimit: number;
  shareScreenStarted: boolean;
  shared: boolean;
  targetOrientation: string;
  vidCons: VidCons;
  recordingVideoSupport: boolean;
  frameRate: number;
  adminPasscode: string;
  eventType: EventType;
  youAreCoHost: boolean;
  autoWave: boolean;
  forceFullDisplay: boolean;
  chatSetting: string;
  meetingDisplayType: string;
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  hParams: HParamsType;
  vParams: VParamsType;
  screenParams: ScreenParamsType;
  aParams: AParamsType;
  islevel: string;
  showAlert?: ShowAlert;
  data: ResponseJoinRoom;
  // update functions
  updateRtpCapabilities: (rtpCapabilities: RtpCapabilities | null) => void;
  updateRoomRecvIPs: (roomRecvIPs: string[]) => void;
  updateMeetingRoomParams: (meetingRoomParams: MeetingRoomParams | null) => void;
  updateItemPageLimit: (limit: number) => void;
  updateAudioOnlyRoom: (isAudioOnly: boolean) => void;
  updateAddForBasic: (addForBasic: boolean) => void;
  updateScreenPageLimit: (limit: number) => void;
  updateVidCons: (cons: VidCons) => void;
  updateFrameRate: (frameRate: number) => void;
  updateAdminPasscode: (passcode: string) => void;
  updateEventType: (eventType: EventType) => void;
  updateYouAreCoHost: (coHost: boolean) => void;
  updateAutoWave: (autoWave: boolean) => void;
  updateForceFullDisplay: (forceFull: boolean) => void;
  updateChatSetting: (setting: string) => void;
  updateMeetingDisplayType: (type: string) => void;
  updateAudioSetting: (setting: string) => void;
  updateVideoSetting: (setting: string) => void;
  updateScreenshareSetting: (setting: string) => void;
  updateHParams: (params: HParamsType) => void;
  updateVParams: (params: VParamsType) => void;
  updateScreenParams: (params: ScreenParamsType) => void;
  updateAParams: (params: AParamsType) => void;
  updateMainHeightWidth: (heightWidth: number) => void;
  updateTargetResolution: (resolution: string) => void;
  updateTargetResolutionHost: (resolution: string) => void;

  // Recording-related update functions
  updateRecordingAudioPausesLimit: (limit: number) => void;
  updateRecordingAudioPausesCount: (count: number) => void;
  updateRecordingAudioSupport: (support: boolean) => void;
  updateRecordingAudioPeopleLimit: (limit: number) => void;
  updateRecordingAudioParticipantsTimeLimit: (limit: number) => void;
  updateRecordingVideoPausesCount: (count: number) => void;
  updateRecordingVideoPausesLimit: (limit: number) => void;
  updateRecordingVideoSupport: (support: boolean) => void;
  updateRecordingVideoPeopleLimit: (limit: number) => void;
  updateRecordingVideoParticipantsTimeLimit: (limit: number) => void;
  updateRecordingAllParticipantsSupport: (support: boolean) => void;
  updateRecordingVideoParticipantsSupport: (support: boolean) => void;
  updateRecordingAllParticipantsFullRoomSupport: (support: boolean) => void;
  updateRecordingVideoParticipantsFullRoomSupport: (support: boolean) => void;
  updateRecordingPreferredOrientation: (orientation: string) => void;
  updateRecordingSupportForOtherOrientation: (support: boolean) => void;
  updateRecordingMultiFormatsSupport: (support: boolean) => void;
  updateRecordingVideoOptions: (options: string) => void;
  updateRecordingAudioOptions: (options: string) => void;
}

export type UpdateRoomParametersClientOptions = {
  parameters: UpdateRoomParametersClientParameters;
};

// Export type definition for the function
export type UpdateRoomParametersClientType = (options: UpdateRoomParametersClientOptions) => void;

/**
 * Updates the room parameters for the client.
 *
 * @param {Object} params - The parameters object.
 * @param {UpdateRoomParametersClientParameters} params.parameters - The parameters to update the room with.
 *
 * @throws Will throw an error if the update process fails.
 *
 * @example
 * updateRoomParametersClient({
 *   parameters: {
 *     screenPageLimit: 10,
 *     shareScreenStarted: true,
 *     shared: false,
 *     hParams: host_Params,
 *     vParams: video_Params,
 *     frameRate: 30,
 *     islevel: "1",
 *     showAlert: (alert) => console.log(alert),
 *     data: {
 *       rtpCapabilities: {},
 *       reason: "Some reason",
 *       secureCode: "1234",
 *       roomRecvIPs: ["192.168.1.1"],
 *       meetingRoomParams: {
 *         itemPageLimit: 5,
 *         type: "conference",
 *         audioSetting: {},
 *         videoSetting: {},
 *         screenshareSetting: {},
 *         chatSetting: {},
 *         mediaType: "video",
 *         targetOrientationHost: "landscape",
 *         targetOrientation: "portrait",
 *         targetResolutionHost: "hd",
 *         targetResolution: "sd",
 *       },
 *       recordingParams: {
 *         recordingAudioPausesLimit: 3,
 *         recordingAudioPausesCount: 1,
 *         recordingAudioSupport: true,
 *         recordingAudioPeopleLimit: 10,
 *         recordingAudioParticipantsTimeLimit: 60,
 *         recordingVideoPausesCount: 2,
 *         recordingVideoPausesLimit: 3,
 *         recordingVideoSupport: true,
 *         recordingVideoPeopleLimit: 5,
 *         recordingVideoParticipantsTimeLimit: 30,
 *         recordingAllParticipantsSupport: true,
 *         recordingVideoParticipantsSupport: true,
 *         recordingAllParticipantsFullRoomSupport: true,
 *         recordingVideoParticipantsFullRoomSupport: true,
 *         recordingPreferredOrientation: "landscape",
 *         recordingSupportForOtherOrientation: true,
 *         recordingMultiFormatsSupport: true,
 *       },
 *     },
 *     updateRtpCapabilities: (capabilities) => {},
 *     updateRoomRecvIPs: (ips) => {},
 *     updateMeetingRoomParams: (params) => {},
 *     updateItemPageLimit: (limit) => {},
 *     updateAudioOnlyRoom: (isAudioOnly) => {},
 *     updateScreenPageLimit: (limit) => {},
 *     updateVidCons: (cons) => {},
 *     updateFrameRate: (rate) => {},
 *     updateAdminPasscode: (passcode) => {},
 *     updateEventType: (type) => {},
 *     updateYouAreCoHost: (isCoHost) => {},
 *     updateAutoWave: (autoWave) => {},
 *     updateForceFullDisplay: (forceFullDisplay) => {},
 *     updateChatSetting: (chatSetting) => {},
 *     updateMeetingDisplayType: (displayType) => {},
 *     updateAudioSetting: (audioSetting) => {},
 *     updateVideoSetting: (videoSetting) => {},
 *     updateScreenshareSetting: (screenshareSetting) => {},
 *     updateHParams: (hParams) => {},
 *     updateVParams: (vParams) => {},
 *     updateScreenParams: (screenParams) => {},
 *     updateAParams: (aParams) => {},
 *     updateRecordingAudioPausesLimit: (limit) => {},
 *     updateRecordingAudioPausesCount: (count) => {},
 *     updateRecordingAudioSupport: (support) => {},
 *     updateRecordingAudioPeopleLimit: (limit) => {},
 *     updateRecordingAudioParticipantsTimeLimit: (timeLimit) => {},
 *     updateRecordingVideoPausesCount: (count) => {},
 *     updateRecordingVideoPausesLimit: (limit) => {},
 *     updateRecordingVideoSupport: (support) => {},
 *     updateRecordingVideoPeopleLimit: (limit) => {},
 *     updateRecordingVideoParticipantsTimeLimit: (timeLimit) => {},
 *     updateRecordingAllParticipantsSupport: (support) => {},
 *     updateRecordingVideoParticipantsSupport: (support) => {},
 *     updateRecordingAllParticipantsFullRoomSupport: (support) => {},
 *     updateRecordingVideoParticipantsFullRoomSupport: (support) => {},
 *     updateRecordingPreferredOrientation: (orientation) => {},
 *     updateRecordingSupportForOtherOrientation: (support) => {},
 *     updateRecordingMultiFormatsSupport: (support) => {},
 *     updateRecordingVideoOptions: (options) => {},
 *     updateRecordingAudioOptions: (options) => {},
 *     updateMainHeightWidth: (heightWidth) => {},
 *   }
 * });
 */

export const updateRoomParametersClient = ({ parameters }: UpdateRoomParametersClientOptions): void => {
  sharedUpdateRoomParametersClient({
    parameters,
  });
};
