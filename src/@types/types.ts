import { Socket } from 'socket.io-client';

import {
  Consumer, DtlsParameters, IceCandidate, IceParameters, RtpCapabilities,
} from 'mediasoup-client/lib/types';
import { mediaDevices, MediaStreamTrack as MediaStreamTrackType, MediaStream as NativeMediaStream  } from '../methods/utils/webrtc/webrtc';



// //consumers/socketReceiveMethods
export type { JoinConsumeRoomOptions, JoinConsumeRoomType, JoinConsumeRoomParameters } from '../consumers/socketReceiveMethods/joinConsumeRoom';
export type { ProducerClosedOptions, ProducerClosedType, ProducerClosedParameters } from '../consumers/socketReceiveMethods/producerClosed';
export type { NewPipeProducerOptions, NewPipeProducerType, NewPipeProducerParameters } from '../consumers/socketReceiveMethods/newPipeProducer';

// //consumers
export type { AddVideosGridOptions, AddVideosGridType, AddVideosGridParameters } from '../consumers/addVideosGrid';
export type { AutoAdjustOptions, AutoAdjustType } from '../consumers/autoAdjust';
export type { CalculateRowsAndColumnsOptions, CalculateRowsAndColumnsType } from '../consumers/calculateRowsAndColumns';
export type { ChangeVidsOptions, ChangeVidsType, ChangeVidsParameters } from '../consumers/changeVids';
export type { CheckGridOptions, CheckGridType } from '../consumers/checkGrid';
export type { CheckPermissionOptions, CheckPermissionType } from '../consumers/checkPermission';
export type { CheckScreenShareOptions, CheckScreenShareType, CheckScreenShareParameters } from '../consumers/checkScreenShare';
export type { CloseAndResizeOptions, CloseAndResizeType, CloseAndResizeParameters } from '../consumers/closeAndResize';
export type { CompareActiveNamesOptions, CompareActiveNamesType, CompareActiveNamesParameters } from '../consumers/compareActiveNames';
export type { CompareScreenStatesOptions, CompareScreenStatesType, CompareScreenStatesParameters } from '../consumers/compareScreenStates';
export type { ConnectIpsOptions, ConnectIpsType, ConnectIpsParameters } from '../consumers/connectIps';
export type { ConnectRecvTransportOptions, ConnectRecvTransportType, ConnectRecvTransportParameters } from '../consumers/connectRecvTransport';
export type { ConnectSendTransportOptions, ConnectSendTransportType, ConnectSendTransportParameters } from '../consumers/connectSendTransport';
export type { ConnectSendTransportAudioOptions, ConnectSendTransportAudioType, ConnectSendTransportAudioParameters } from '../consumers/connectSendTransportAudio';
export type { ConnectSendTransportScreenOptions, ConnectSendTransportScreenType, ConnectSendTransportScreenParameters } from '../consumers/connectSendTransportScreen';
export type { ConnectSendTransportVideoOptions, ConnectSendTransportVideoType, ConnectSendTransportVideoParameters } from '../consumers/connectSendTransportVideo';
export type { ConsumerResumeOptions, ConsumerResumeType, ConsumerResumeParameters } from '../consumers/consumerResume';
export type { ControlMediaOptions, ControlMediaType } from '../consumers/controlMedia';
export type { CreateSendTransportOptions, CreateSendTransportType, CreateSendTransportParameters } from '../consumers/createSendTransport';
export type { DisconnectSendTransportAudioOptions, DisconnectSendTransportAudioType, DisconnectSendTransportAudioParameters } from '../consumers/disconnectSendTransportAudio';
export type { DisconnectSendTransportVideoOptions, DisconnectSendTransportVideoType, DisconnectSendTransportVideoParameters } from '../consumers/disconnectSendTransportVideo';
export type { DisconnectSendTransportScreenOptions, DisconnectSendTransportScreenType, DisconnectSendTransportScreenParameters } from '../consumers/disconnectSendTransportScreen';
export type { DispStreamsOptions, DispStreamsType, DispStreamsParameters } from '../consumers/dispStreams';
export type { GeneratePageContentOptions, GeneratePageContentType } from '../consumers/generatePageContent';
export type { GetEstimateOptions, GetEstimateType, GetEstimateParameters } from '../consumers/getEstimate';
export type { GetPipedProducersAltOptions, GetPipedProducersAltType, GetPipedProducersAltParameters } from '../consumers/getPipedProducersAlt';
export type { GetProducersPipedOptions, GetProducersPipedType, GetProducersPipedParameters } from '../consumers/getProducersPiped';
export type { GetVideosOptions, GetVideosType } from '../consumers/getVideos';
export type { MixStreamsOptions, MixStreamsType } from '../consumers/mixStreams';
export type { OnScreenChangesOptions, OnScreenChangesType, OnScreenChangesParameters } from '../consumers/onScreenChanges';
export type { PrepopulateUserMediaOptions, PrepopulateUserMediaType, PrepopulateUserMediaParameters } from '../consumers/prepopulateUserMedia';
export type { ProcessConsumerTransportsOptions, ProcessConsumerTransportsType, ProcessConsumerTransportsParameters } from '../consumers/processConsumerTransports';
export type { ProcessConsumerTransportsAudioOptions, ProcessConsumerTransportsAudioType, ProcessConsumerTransportsAudioParameters } from '../consumers/processConsumerTransportsAudio';
export type { ReadjustOptions, ReadjustType, ReadjustParameters } from '../consumers/readjust';
export type { ReceiveAllPipedTransportsOptions, ReceiveAllPipedTransportsType, ReceiveAllPipedTransportsParameters } from '../consumers/receiveAllPipedTransports';
export type { ReorderStreamsOptions, ReorderStreamsType, ReorderStreamsParameters } from '../consumers/reorderStreams';
export type { RePortOptions, RePortType, RePortParameters } from '../consumers/rePort';
export type { RequestScreenShareOptions, RequestScreenShareType, RequestScreenShareParameters } from '../consumers/requestScreenShare';
export type { ResumePauseAudioStreamsOptions, ResumePauseAudioStreamsType, ResumePauseAudioStreamsParameters } from '../consumers/resumePauseAudioStreams';
export type { ResumePauseStreamsOptions, ResumePauseStreamsType, ResumePauseStreamsParameters } from '../consumers/resumePauseStreams';
export type { ResumeSendTransportAudioOptions, ResumeSendTransportAudioType, ResumeSendTransportAudioParameters } from '../consumers/resumeSendTransportAudio';
export type { ReUpdateInterOptions, ReUpdateInterType, ReUpdateInterParameters } from '../consumers/reUpdateInter';
export type { SignalNewConsumerTransportOptions, SignalNewConsumerTransportType, SignalNewConsumerTransportParameters } from '../consumers/signalNewConsumerTransport';
export type { StartShareScreenOptions, StartShareScreenType, StartShareScreenParameters } from '../consumers/startShareScreen';
export type { StopShareScreenOptions, StopShareScreenType, StopShareScreenParameters } from '../consumers/stopShareScreen';
export type { StreamSuccessAudioOptions, StreamSuccessAudioType, StreamSuccessAudioParameters } from '../consumers/streamSuccessAudio';
export type { StreamSuccessAudioSwitchOptions, StreamSuccessAudioSwitchType, StreamSuccessAudioSwitchParameters } from '../consumers/streamSuccessAudioSwitch';
export type { StreamSuccessScreenOptions, StreamSuccessScreenType, StreamSuccessScreenParameters } from '../consumers/streamSuccessScreen';
export type { StreamSuccessVideoOptions, StreamSuccessVideoType, StreamSuccessVideoParameters } from '../consumers/streamSuccessVideo';
export type { SwitchUserAudioOptions, SwitchUserAudioType, SwitchUserAudioParameters } from '../consumers/switchUserAudio';
export type { SwitchUserVideoOptions, SwitchUserVideoType, SwitchUserVideoParameters } from '../consumers/switchUserVideo';
export type { SwitchUserVideoAltOptions, SwitchUserVideoAltType, SwitchUserVideoAltParameters } from '../consumers/switchUserVideoAlt';
export type { TriggerOptions, TriggerType, TriggerParameters } from '../consumers/trigger';
export type { UpdateMiniCardsGridOptions, UpdateMiniCardsGridType, UpdateMiniCardsGridParameters } from '../consumers/updateMiniCardsGrid';
export type { UpdateParticipantAudioDecibelsOptions, UpdateParticipantAudioDecibelsType } from '../consumers/updateParticipantAudioDecibels';

export type { AParamsType } from '../methods/utils/producer/aParams';
export type { HParamsType } from '../methods/utils/producer/hParams';
export type { ScreenParamsType } from '../methods/utils/producer/screenParams';
export type { VParamsType } from '../methods/utils/producer/vParams';

export type { LaunchBackgroundOptions, LaunchBackgroundType } from '../methods/backgroundMethods/launchBackground';
export type { LaunchBreakoutRoomsOptions, LaunchBreakoutRoomsType } from '../methods/breakoutRoomsMethods/launchBreakoutRooms';
export type { BreakoutRoomUpdatedOptions, BreakoutRoomUpdatedType, BreakoutRoomUpdatedParameters } from '../methods/breakoutRoomsMethods/breakoutRoomUpdated';
export type { LaunchCoHostOptions, LaunchCoHostType } from '../methods/coHostMethods/launchCoHost';
export type { ModifyCoHostSettingsOptions, ModifyCoHostSettingsType } from '../methods/coHostMethods/modifyCoHostSettings';
export type { LaunchDisplaySettingsOptions, LaunchDisplaySettingsType } from '../methods/displaySettingsMethods/launchDisplaySettings';
export type { ModifyDisplaySettingsOptions, ModifyDisplaySettingsType, ModifyDisplaySettingsParameters } from '../methods/displaySettingsMethods/modifyDisplaySettings';
export type { LaunchConfirmExitOptions, LaunchConfirmExitType } from '../methods/exitMethods/launchConfirmExit';
export type { ConfirmExitOptions, ConfirmExitType } from '../methods/exitMethods/confirmExit';
export type { LaunchMediaSettingsOptions, LaunchMediaSettingsType } from '../methods/mediaSettingsMethods/launchMediaSettings';
export type { LaunchMenuModalOptions, LaunchMenuModalType } from '../methods/menuMethods/launchMenuModal';
export type { LaunchMessagesOptions, LaunchMessagesType } from '../methods/messageMethods/launchMessages';
export type { SendMessageOptions, SendMessageType } from '../methods/messageMethods/sendMessage';
export type { LaunchParticipantsOptions, LaunchParticipantsType } from '../methods/participantsMethods/launchParticipants';
export type { MessageParticipantsOptions, MessageParticipantsType } from '../methods/participantsMethods/messageParticipants';
export type { MuteParticipantsOptions, MuteParticipantsType } from '../methods/participantsMethods/muteParticipants';
export type { RemoveParticipantsOptions, RemoveParticipantsType } from '../methods/participantsMethods/removeParticipants';
export type { HandleCreatePollOptions, HandleCreatePollType } from '../methods/pollsMethods/handleCreatePoll';
export type { HandleEndPollOptions, HandleEndPollType } from '../methods/pollsMethods/handleEndPoll';
export type { HandleVotePollOptions, HandleVotePollType } from '../methods/pollsMethods/handleVotePoll';
export type { LaunchPollOptions, LaunchPollType } from '../methods/pollsMethods/launchPoll';
export type { PollUpdatedOptions, PollUpdatedType } from '../methods/pollsMethods/pollUpdated';
export type { CheckPauseStateOptions, CheckPauseStateType } from '../methods/recordingMethods/checkPauseState';
export type { CheckResumeStateOptions, CheckResumeStateType } from '../methods/recordingMethods/checkResumeState';
export type { ConfirmRecordingOptions, ConfirmRecordingType, ConfirmRecordingParameters } from '../methods/recordingMethods/confirmRecording';
export type { LaunchRecordingOptions, LaunchRecordingType } from '../methods/recordingMethods/launchRecording';
export type { RecordPauseTimerOptions, RecordPauseTimerType } from '../methods/recordingMethods/recordPauseTimer';
export type { RecordResumeTimerOptions, RecordResumeTimerType } from '../methods/recordingMethods/recordResumeTimer';
export type { RecordStartTimerOptions, RecordStartTimerType } from '../methods/recordingMethods/recordStartTimer';
export type { RecordUpdateTimerOptions, RecordUpdateTimerType } from '../methods/recordingMethods/recordUpdateTimer';
export type { StartRecordingOptions, StartRecordingType, StartRecordingParameters } from '../methods/recordingMethods/startRecording';
export type { StopRecordingOptions, StopRecordingType, StopRecordingParameters } from '../methods/recordingMethods/stopRecording';
export type { UpdateRecordingOptions, UpdateRecordingType, UpdateRecordingParameters } from '../methods/recordingMethods/updateRecording';
export type { LaunchRequestsOptions, LaunchRequestsType } from '../methods/requestsMethods/launchRequests';
export type { RespondToRequestsOptions, RespondToRequestsType } from '../methods/requestsMethods/respondToRequests';
export type { LaunchSettingsOptions, LaunchSettingsType } from '../methods/settingsMethods/launchSettings';
export type { ModifySettingsOptions, ModifySettingsType } from '../methods/settingsMethods/modifySettings';
export type { ClickAudioOptions, ClickAudioType, ClickAudioParameters } from '../methods/streamMethods/clickAudio';
export type { ClickChatOptions, ClickChatType } from '../methods/streamMethods/clickChat';
export type { ClickScreenShareOptions, ClickScreenShareType, ClickScreenShareParameters } from '../methods/streamMethods/clickScreenShare';
export type { ClickVideoOptions, ClickVideoType, ClickVideoParameters } from '../methods/streamMethods/clickVideo';
export type { SwitchAudioOptions, SwitchAudioType, SwitchAudioParameters } from '../methods/streamMethods/switchAudio';
export type { SwitchVideoOptions, SwitchVideoType, SwitchVideoParameters } from '../methods/streamMethods/switchVideo';
export type { SwitchVideoAltOptions, SwitchVideoAltType } from '../methods/streamMethods/switchVideoAlt';

export type { StartMeetingProgressTimerOptions, StartMeetingProgressTimerType, StartMeetingProgressTimerParameters } from '../methods/utils/meetingTimer/startMeetingProgressTimer';
export type { MiniAudioPlayerOptions, MiniAudioPlayerType, MiniAudioPlayerParameters } from '../methods/utils/MiniAudioPlayer/MiniAudioPlayer';
export type { FormatNumberOptions, FormatNumberType } from '../methods/utils/formatNumber';
export type { GenerateRandomMessagesOptions, GenerateRandomMessagesType } from '../methods/utils/generateRandomMessages';
export type { GenerateRandomParticipantsOptions, GenerateRandomParticipantsType } from '../methods/utils/generateRandomParticipants';
export type { GenerateRandomPollsOptions, GenerateRandomPollsType } from '../methods/utils/generateRandomPolls';
export type { GenerateRandomRequestListOptions, GenerateRandomRequestListType } from '../methods/utils/generateRandomRequestList';
export type { GenerateRandomWaitingRoomListType } from '../methods/utils/generateRandomWaitingRoomList';
export type { GetModalPositionOptions, GetModalPositionType } from '../methods/utils/getModalPosition';
export type { GetOverlayPositionOptions, GetOverlayPositionType } from '../methods/utils/getOverlayPosition';
export type { SleepOptions, SleepType } from '../methods/utils/sleep';
export type { ValidateAlphanumericOptions, ValidateAlphanumericType } from '../methods/utils/validateAlphanumeric';

export type { LaunchWaitingOptions, LaunchWaitingType } from '../methods/waitingMethods/launchWaiting';
export type { RespondToWaitingOptions, RespondToWaitingType } from '../methods/waitingMethods/respondToWaiting';
export type { LaunchConfigureWhiteboardOptions, LaunchConfigureWhiteboardType } from '../methods/whiteboardMethods/launchConfigureWhiteboard';
export type { CaptureCanvasStreamOptions, CaptureCanvasStreamType, CaptureCanvasStreamParameters } from '../methods/whiteboardMethods/captureCanvasStream';

export type { CreateDeviceClientOptions, CreateDeviceClientType } from '../ProducerClient/producerClientEmits/createDeviceClient';
export type { JoinRoomClientOptions, JoinRoomClientType } from '../ProducerClient/producerClientEmits/joinRoomClient';
export type { UpdateRoomParametersClientOptions, UpdateRoomParametersClientType, UpdateRoomParametersClientParameters } from '../ProducerClient/producerClientEmits/updateRoomParametersClient';

export type { JoinConRoomOptions, JoinConRoomType } from '../producers/producerEmits/joinConRoom';
export type { JoinRoomOptions, JoinRoomType } from '../producers/producerEmits/joinRoom';

export type { AllMembersOptions, AllMembersType, AllMembersParameters } from '../producers/socketReceiveMethods/allMembers';
export type { AllMembersRestOptions, AllMembersRestType, AllMembersRestParameters } from '../producers/socketReceiveMethods/allMembersRest';
export type { AllWaitingRoomMembersOptions, AllWaitingRoomMembersType } from '../producers/socketReceiveMethods/allWaitingRoomMembers';
export type { BanParticipantOptions, BanParticipantType, BanParticipantParameters } from '../producers/socketReceiveMethods/banParticipant';
export type { ControlMediaHostOptions, ControlMediaHostType, ControlMediaHostParameters } from '../producers/socketReceiveMethods/controlMediaHost';
export type { DisconnectOptions, DisconnectType } from '../producers/socketReceiveMethods/disconnect';
export type { DisconnectUserSelfOptions, DisconnectUserSelfType } from '../producers/socketReceiveMethods/disconnectUserSelf';
export type { GetDomainsOptions, GetDomainsType, GetDomainsParameters } from '../producers/socketReceiveMethods/getDomains';
export type { HostRequestResponseOptions, HostRequestResponseType } from '../producers/socketReceiveMethods/hostRequestResponse';
export type { MeetingEndedOptions, MeetingEndedType } from '../producers/socketReceiveMethods/meetingEnded';
export type { MeetingStillThereOptions, MeetingStillThereType } from '../producers/socketReceiveMethods/meetingStillThere';
export type { MeetingTimeRemainingOptions, MeetingTimeRemainingType } from '../producers/socketReceiveMethods/meetingTimeRemaining';
export type { ParticipantRequestedOptions, ParticipantRequestedType } from '../producers/socketReceiveMethods/participantRequested';
export type { PersonJoinedOptions, PersonJoinedType } from '../producers/socketReceiveMethods/personJoined';
export type { ProducerMediaClosedOptions, ProducerMediaClosedType, ProducerMediaClosedParameters } from '../producers/socketReceiveMethods/producerMediaClosed';
export type { ProducerMediaPausedOptions, ProducerMediaPausedType, ProducerMediaPausedParameters } from '../producers/socketReceiveMethods/producerMediaPaused';
export type { ProducerMediaResumedOptions, ProducerMediaResumedType, ProducerMediaResumedParameters } from '../producers/socketReceiveMethods/producerMediaResumed';
export type { ReInitiateRecordingOptions, ReInitiateRecordingType } from '../producers/socketReceiveMethods/reInitiateRecording';
export type { ReceiveMessageOptions, ReceiveMessageType } from '../producers/socketReceiveMethods/receiveMessage';
export type { RecordingNoticeOptions, RecordingNoticeType, RecordingNoticeParameters } from '../producers/socketReceiveMethods/recordingNotice';
export type {
  RoomRecordParamsOptions, RoomRecordParamsType, RoomRecordParamsParameters, RecordParams,
} from '../producers/socketReceiveMethods/roomRecordParams';
export type { ScreenProducerIdOptions, ScreenProducerIdType } from '../producers/socketReceiveMethods/screenProducerId';
export type { StartRecordsOptions, StartRecordsType } from '../producers/socketReceiveMethods/startRecords';
export type { StoppedRecordingOptions, StoppedRecordingType } from '../producers/socketReceiveMethods/stoppedRecording';
export type { TimeLeftRecordingOptions, TimeLeftRecordingType } from '../producers/socketReceiveMethods/timeLeftRecording';
export type { UpdateConsumingDomainsOptions, UpdateConsumingDomainsType, UpdateConsumingDomainsParameters } from '../producers/socketReceiveMethods/updateConsumingDomains';
export type { UpdateMediaSettingsOptions, UpdateMediaSettingsType } from '../producers/socketReceiveMethods/updateMediaSettings';
export type { UpdatedCoHostOptions, UpdatedCoHostType } from '../producers/socketReceiveMethods/updatedCoHost';
export type { UserWaitingOptions, UserWaitingType } from '../producers/socketReceiveMethods/userWaiting';
export type {
  ConnectSocketOptions, ConnectSocketType, DisconnectSocketType, DisconnectSocketOptions,
} from '../sockets/SocketManager';

// export type { BackgroundModalOptions, BackgroundModalType, BackgroundModalParameters } from '../components/backgroundComponents/BackgroundModal';
// export type { BreakoutRoomsModalOptions, BreakoutRoomsModalType, BreakoutRoomsModalParameters } from '../components/breakoutComponents/BreakoutRoomsModal';
export type { CoHostModalOptions, CoHostModalType } from '../components/coHostComponents/CoHostModal';
export type { AlertComponentOptions, AlertComponentType } from '../components/displayComponents/AlertComponent';
export type { AudioCardOptions, AudioCardType, AudioCardParameters } from '../components/displayComponents/AudioCard';
export type { AudioGridOptions, AudioGridType } from '../components/displayComponents/AudioGrid';
export type { CardVideoDisplayOptions, CardVideoDisplayType } from '../components/displayComponents/CardVideoDisplay';
export type { ControlButtonsComponentOptions, ControlButtonsComponentType, Button } from '../components/displayComponents/ControlButtonsComponent';
export type { ControlButtonsAltComponentOptions, ControlButtonsAltComponentType, AltButton } from '../components/displayComponents/ControlButtonsAltComponent';
export type { ControlButtonsComponentTouchOptions, ControlButtonsComponentTouchType, ButtonTouch } from '../components/displayComponents/ControlButtonsComponentTouch';
export type { FlexibleGridOptions, FlexibleGridType } from '../components/displayComponents/FlexibleGrid';
export type { FlexibleVideoOptions, FlexibleVideoType } from '../components/displayComponents/FlexibleVideo';
export type { LoadingModalOptions, LoadingModalType } from '../components/displayComponents/LoadingModal';
export type { MainAspectComponentOptions, MainAspectComponentType } from '../components/displayComponents/MainAspectComponent';
export type { MainContainerComponentOptions, MainContainerComponentType } from '../components/displayComponents/MainContainerComponent';
export type { MainGridComponentOptions, MainGridComponentType } from '../components/displayComponents/MainGridComponent';
export type { MainScreenComponentOptions, MainScreenComponentType } from '../components/displayComponents/MainScreenComponent';
export type { MeetingProgressTimerOptions, MeetingProgressTimerType } from '../components/displayComponents/MeetingProgressTimer';
export type { MiniAudioOptions, MiniAudioType } from '../components/displayComponents/MiniAudio';
export type { MiniCardOptions, MiniCardType } from '../components/displayComponents/MiniCard';
export type { MiniCardAudioOptions, MiniCardAudioType } from '../components/displayComponents/MiniCardAudio';
export type { OtherGridComponentOptions, OtherGridComponentType } from '../components/displayComponents/OtherGridComponent';
export type { PaginationOptions, PaginationType } from '../components/displayComponents/Pagination';
export type { SubAspectComponentOptions, SubAspectComponentType } from '../components/displayComponents/SubAspectComponent';
export type { VideoCardOptions, VideoCardType, VideoCardParameters } from '../components/displayComponents/VideoCard';
export type { DisplaySettingsModalOptions, DisplaySettingsModalType, DisplaySettingsModalParameters } from '../components/displaySettingsComponents/DisplaySettingsModal';
export type { EventSettingsModalOptions, EventSettingsModalType } from '../components/eventSettingsComponents/EventSettingsModal';
export type { ConfirmExitModalOptions, ConfirmExitModalType } from '../components/exitComponents/ConfirmExitModal';
export type { MediaSettingsModalOptions, MediaSettingsModalType, MediaSettingsModalParameters } from '../components/mediaSettingsComponents/MediaSettingsModal';
export type { MenuModalOptions, MenuModalType } from '../components/menuComponents/MenuModal';
export type { MessagesModalOptions, MessagesModalType } from '../components/messageComponents/MessagesModal';
export type { ConfirmHereModalOptions, ConfirmHereModalType } from '../components/miscComponents/ConfirmHereModal';
export type { PreJoinPageOptions, PreJoinPageType, PreJoinPageParameters } from '../components/miscComponents/PreJoinPage';
export type { ShareEventModalOptions, ShareEventModalType } from '../components/miscComponents/ShareEventModal';
export type { WelcomePageOptions, WelcomePageType, WelcomePageParameters } from '../components/miscComponents/WelcomePage';
export type { ParticipantsModalOptions, ParticipantsModalType, ParticipantsModalParameters } from '../components/participantsComponents/ParticipantsModal';
export type { PollModalOptions, PollModalType } from '../components/pollsComponents/PollModal';
export type { RecordingModalOptions, RecordingModalType, RecordingModalParameters } from '../components/recordingComponents/RecordingModal';
export type { RequestsModalOptions, RequestsModalType } from '../components/requestsComponents/RequestsModal';
// export type { ScreenboardOptions, ScreenboardType, ScreenboardParameters } from '../components/screenboardComponents/Screenboard';
// export type { ScreenboardModalOptions, ScreenboardModalType } from '../components/screenboardComponents/ScreenboardModal';
// export type { WaitingRoomModalOptions, WaitingRoomModalType, WaitingRoomModalParameters } from '../components/waitingComponents/WaitingModal';
// export type { ConfigureWhiteboardModalOptions, ConfigureWhiteboardModalType } from '../components/whiteboardComponents/ConfigureWhiteboardModal';
// export type {
//   WhiteboardOptions, WhiteboardType, WhiteboardParameters, Shape,
// } from '../components/whiteboardComponents/Whiteboard';

export type { CustomButtonsOptions, CustomButtonsType, CustomButton } from '../components/menuComponents/CustomButtons';


// React Native Exclusive
export type Shape = any;
export type SelfieSegmentation = any;
export type MediaDevices = typeof mediaDevices;
export type MediaStream = NativeMediaStream;
export type MediaStreamTrack = MediaStreamTrackType;


export interface Participant {
    id?: string;
    audioID: string;
    videoID: string;
    ScreenID?: string;
    ScreenOn?: boolean;
    islevel?: string;
    isAdmin?: boolean;
    name: string;
    muted?: boolean;
    isBanned?: boolean;
    isSuspended?: boolean; useBoard?: boolean;
    breakRoom?: number | null;
    [key: string]: any;
  }

export interface Stream {
    producerId: string;
    muted?: boolean;
    stream?: MediaStream;
    socket_?: Socket;
    name?: string;
    [key: string]: any;
}

export interface Request {
  id: string;
  icon: string;
  name?: string;
  username?: string;
  [key: string]: any;
}

export interface RequestResponse {
  id: string;
  icon?: string;
  name?: string;
  username?: string;
  action?: string;
  type?: string;
  [key: string]: any;
}

export interface Transport {
  producerId: string;
  consumer: Consumer;
  socket_: Socket;
  serverConsumerTransportId: string;
  [key: string]: any;
}

export interface ScreenState {
    mainScreenPerson?: string;
    mainScreenProducerId?: string;
    mainScreenFilled: boolean;
    adminOnMainScreen: boolean;
}

export interface GridSizes {
  gridWidth?: number;
  gridHeight?: number;
  altGridWidth?: number;
  altGridHeight?: number;
}

export interface ComponentSizes {
  mainWidth: number;
  mainHeight: number;
  otherWidth: number;
  otherHeight: number;
}

export interface AudioDecibels {
  name: string;
  averageLoudness: number
}

export type ShowAlert = (options: { message: string; type: 'success' | 'danger'; duration?: number }) =>  void;

export interface CoHostResponsibility {
  name: string;
  value: boolean;
  dedicated: boolean;
}

export interface VidCons {
  width: number | { ideal?: number, max?: number, min?: number };
  height: number | { ideal?: number, max?: number, min?: number };
}

export type Settings = [string, string, string, string];

export interface Message {
  sender: string;
  receivers: string[];
  message: string;
  timestamp: string;
  group: boolean;
}

export type MainSpecs = {
  mediaOptions: string;
  audioOptions: string;
  videoOptions: string;
  videoType: string;
  videoOptimized: boolean;
  recordingDisplayType: 'video' | 'media' | 'all';
  addHLS: boolean;
};

export type DispSpecs = {
  nameTags: boolean;
  backgroundColor: string;
  nameTagsColor: string;
  orientationVideo: string;
};

export type TextSpecs = {
  addText: boolean;
  customText?: string;
  customTextPosition?: string;
  customTextColor?: string;
};

export interface UserRecordingParams {
  mainSpecs: MainSpecs;
  dispSpecs: DispSpecs;
  textSpecs?: TextSpecs;
}

export type AltDomains = {
  [key: string]: string;
};

export type RequestPermissionAudioType = () => Promise<string>;
export type RequestPermissionCameraType = () => Promise<string>;

export type ControlsPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type InfoPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface Poll {
  id: string;
  question: string;
  type: string;
  options: string[];
  votes: number[];
  status: string;
  voters?: Record<string, number>;
  [key: string]: any;
}

export interface WaitingRoomParticipant {
  name: string;
  id: string;
}

export interface ModalPositionStyle {
  justifyContent: string;
  alignItems: string;
}

export interface OverlayPositionStyle {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export type EventType = 'conference' | 'webinar' | 'chat' | 'broadcast' | 'none';

export interface PollUpdatedData {
  polls?: Poll[];
  poll: Poll;
  status: string;
}

export interface BreakoutParticipant {
  name: string;
  breakRoom?: number | null;
}

export interface BreakoutRoomUpdatedData {
  forHost?: boolean;
  newRoom?: number;
  members?: Participant[];
  breakoutRooms?: BreakoutParticipant[][];
  status?: string;
}

export interface ConsumeSocket {
  [ip: string]: Socket;
}

export interface WhiteboardUser {
  name: string;
  useBoard: boolean;
}

export interface ShapePayload {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  thickness: number;
  lineType: string;
  [key: string]: any;
}

export interface Shapes {
  action: string;
  payload: ShapePayload;
}
export interface WhiteboardData {
  shapes: Shapes[];
  redoStack: Shapes[];
  undoStack: Shapes[];
  useImageBackground: boolean;
}

export type SeedData = {
  member?: string;
  host?: string;
  eventType?: EventType;
  participants?: Participant[];
  messages?: Message[];
  polls?: Poll[];
  breakoutRooms?: BreakoutParticipant[][];
  requests?: Request[];
  waitingList?: WaitingRoomParticipant[];
  whiteboardUsers?: WhiteboardUser[];
};

export interface MeetingRoomParams {
  itemPageLimit: number; // Limit for items per page
  mediaType: 'audio' | 'video'; // Type of media, could be audio or video
  addCoHost: boolean; // Whether co-hosts can be added
  targetOrientation: 'landscape' | 'neutral' | 'portrait'; // Target orientation, landscape, neutral, or portrait
  targetOrientationHost: 'landscape' | 'neutral' | 'portrait'; // Host's target orientation, landscape, neutral, or portrait
  targetResolution: 'qhd'| 'fhd' | 'hd' | 'sd' | 'QnHD'; // Target resolution for participants
  targetResolutionHost: 'qhd'| 'fhd' | 'hd' | 'sd' | 'QnHD'; // Target resolution for host
  type: EventType; // Room type: chat, conference, webinar, or broadcast
  audioSetting: 'allow' | 'approval' | 'disallow'; // Audio setting: allow, approval, or disallow
  videoSetting: 'allow' | 'approval' | 'disallow'; // Video setting: allow, approval, or disallow
  screenshareSetting: 'allow' | 'approval' | 'disallow'; // Screenshare setting: allow, approval, or disallow
  chatSetting: 'allow' | 'disallow'; // Chat setting: allow or disallow
}

export interface RecordingParams {
  recordingAudioPausesLimit: number; // Limit on audio recording pauses
  recordingAudioSupport: boolean; // Whether audio recording is supported
  recordingAudioPeopleLimit: number; // Maximum number of people for audio recording
  recordingAudioParticipantsTimeLimit: number; // Time limit for audio participants in recording

  recordingVideoPausesLimit: number; // Limit on video recording pauses
  recordingVideoSupport: boolean; // Whether video recording is supported
  recordingVideoPeopleLimit: number; // Maximum number of people for video recording
  recordingVideoParticipantsTimeLimit: number; // Time limit for video participants in recording

  recordingAllParticipantsSupport: boolean; // Whether recording all participants is supported
  recordingVideoParticipantsSupport: boolean; // Whether video recording for participants is supported
  recordingAllParticipantsFullRoomSupport: boolean; // Support for recording the entire room for all participants
  recordingVideoParticipantsFullRoomSupport: boolean; // Support for recording the full room for video participants

  recordingPreferredOrientation: 'landscape' | 'portrait'; // Preferred recording orientation
  recordingSupportForOtherOrientation: boolean; // Support for orientations other than the preferred one
  recordingMultiFormatsSupport: boolean; // Support for multiple recording formats
  recordingHLSSupport: boolean; // Whether HLS recording is supported

  recordingAudioPausesCount?: number; // Number of audio recording pauses
  recordingVideoPausesCount?: number; // Number of video recording pauses
}

export interface CreateRoomOptions {
  action: 'create' | 'join'; // Either 'create' or 'join' based on the requirement
  meetingID: string; // The meeting ID, initially an empty string
  duration: number; // Duration of the meeting in minutes
  capacity: number; // Max number of participants allowed
  userName: string; // Username of the room host
  scheduledDate: number; // Unix timestamp (in milliseconds) for the scheduled date
  secureCode: string; // Secure code for the room host
  eventType: 'conference' | 'webinar' | 'chat' | 'broadcast'; // Type of event
  recordOnly: boolean; // Whether the room is for recording only
  eventStatus: 'active' | 'inactive'; // Status of the event
  startIndex: number; // Start index for pagination or data fetch
  pageSize: number; // Number of items per page
  safeRoom: boolean; // Whether the room is a safe room
  autoStartSafeRoom: boolean; // Automatically start the safe room feature
  safeRoomAction: 'warn' | 'kick' | 'ban'; // Action for the safe room
  dataBuffer: boolean; // Whether to return data buffer
  bufferType: 'images' | 'audio' | 'all'; // Type of buffer data
}

export interface ResponseJoinRoom {
  rtpCapabilities?: RtpCapabilities | null; // Object containing the RTP capabilities
  success: boolean; // Indicates whether the operation (joining the room) was successful.
  roomRecvIPs: string[]; // Array of strings containing information about the domains that must be connected to in order to receive media.
  meetingRoomParams: MeetingRoomParams; // Object containing parameters related to the meeting room.
  recordingParams: RecordingParams; // Object containing parameters related to recording.
  secureCode: string; // Secure code (host password) associated with the host of the room.
  recordOnly: boolean; // Indicates whether the room is for recording only.
  isHost: boolean; // Indicates whether the user joining the room is the host.
  safeRoom: boolean; // Indicates whether the room is a safe room.
  autoStartSafeRoom: boolean; // Indicates whether the safe room will automatically start.
  safeRoomStarted: boolean; // Indicates whether the safe room has started.
  safeRoomEnded: boolean; // Indicates whether the safe room has ended.
  reason?: string; // Reason for the success or failure of the operation.
  banned?: boolean; // Indicates whether the user is banned from the room.
  suspended?: boolean; // Indicates whether the user is suspended from the room.
  noAdmin?: boolean; // Indicates whether the room has no host in it.
}

export interface AllMembersData {
  members: Participant[]; // Array of objects containing information about all the members in the room.
  requests: Request[]; // Array of objects containing information about the requests.
  coHost?: string; // The co-host information.
  coHostResponsibilities: CoHostResponsibility[]; // Array of objects containing information about the co-host responsibilities.
}

export interface AllMembersRestData {
  members: Participant[]; // Array of objects containing information about all the members in the room.
  settings: Settings; // Array of strings containing information about the settings.
  coHost?: string; // The co-host information.
  coHostResponsibilities: CoHostResponsibility[]; // Array of objects containing information about the co-host responsibilities.
}

export interface UserWaitingData {
  name: string; // Name of the user waiting to join the room.
}

export interface AllWaitingRoomMembersData {
  waitingParticipants?: WaitingRoomParticipant[]; // Array of objects containing information about the participants waiting to join the room.
  waitingParticipantss?: WaitingRoomParticipant[];
}

export interface BanData {
  name: string; // Name of the user to ban.
}

export interface UpdatedCoHostData {
  coHost: string; // The co-host information.
  coHostResponsibilities: CoHostResponsibility[]; // Array of objects containing information about the co-host responsibilities.
}

export interface ParticipantRequestedData {
  userRequest: Request; // Object containing information about the user request.
}

export interface ScreenProducerIdData {
  producerId: string; // The producer ID of the screen.
}

export interface UpdateMediaSettingsData {
  settings: Settings; // Array of strings containing information about the settings.
}

export interface ProducerMediaPausedData {
  producerId: string; // The producer ID of the media that was paused.
  kind: 'audio';
  name: string; // The name of the media that was paused.
}

export interface ProducerMediaResumedData {
  kind: 'audio';
  name: string; // The name of the media that was resumed.
}

export interface ProducerMediaClosedData {
  producerId: string; // The producer ID of the media that was stopped.
  kind: 'audio' | 'video' | 'screenshare';
  name: string; // The name of the media that was stopped.
}

export interface ControlMediaHostData {
  type: 'all' | 'audio' | 'video' | 'screenshare'; // The type of media to control.
}

export interface ReceiveMessageData {
  message: Message; // Object containing information about the message.
}

export interface MeetingTimeRemainingData {
  timeRemaining: number; // The time remaining for the meeting.
}

export interface MeetingStillThereData {
  timeRemaining: number; // The time remaining for the meeting.
}

export interface UpdateConsumingDomainsData {
  domains: string[]; // Array of strings containing information about the domains to consume media from.
  alt_domains: AltDomains; // Object containing information about the alternative domains to consume media from.
}

export interface RecordingNoticeData {
  state: string; // The state of the recording.
  userRecordingParam: UserRecordingParams; // Object containing information about the user recording parameters.
  pauseCount: number; // The number of times the recording was paused.
  timeDone: number; // The time the recording was paused.
}

export interface TimeLeftRecordingData {
  timeLeft: number; // The time left for recording.
}

export interface StoppedRecordingData {
  state: string; // The state of the recording.
  reason?: string; // The reason for stopping the recording.
}

export interface HostRequestResponseData {
  requestResponse: RequestResponse; // Object containing information about the request response.
}

export interface SafeRoomNoticeData {
 state: string; // The state of the safe room.
}

export interface UnSafeData {
  time: number; // The time the room was unsafe.
  evidence: ImageData; // The evidence for the room being unsafe.
}

export interface UnsafeAlertData {
  name: string; // The name of the user who triggered the unsafe alert.
}

export interface DataBufferNotice {
  state: string; // The state of the data buffer.
}

export interface AudioData {
  audioBuffer: AudioBuffer; // The audio buffer.
}

export interface ImageData {
  jpegBuffer: ImageData; // The JPEG buffer.
}

export interface WhiteboardUpdatedData {
  status: 'started' | 'ended'; // The status of the whiteboard.
  whiteboardUsers: WhiteboardUser[]; // Array of objects containing information about the whiteboard users.
  members: Participant[]; // Array of objects containing information about the members.
  whiteboardData: WhiteboardData; // Object containing information about the whiteboard data.
}

export interface WhiteboardActionData {
  action: string; // The action to be performed on the whiteboard.
  payload: ShapePayload; // Object containing information about the shape payload.
}

export type CreateWebRTCTransportResponse = {
  id: string;
  dtlsParameters: DtlsParameters;
  iceCandidates: IceCandidate[];
  iceParameters: IceParameters;
  error?: string;
};


