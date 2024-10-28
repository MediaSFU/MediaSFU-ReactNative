//initial values
import { initialValuesState } from './src/methods/utils/initialValuesState';

//import components for display (samples)
import LoadingModal from './src/components/displayComponents/LoadingModal';
import MainAspectComponent from './src/components/displayComponents/MainAspectComponent';
import ControlButtonsComponent from './src/components/displayComponents/ControlButtonsComponent';
import ControlButtonsAltComponent from './src/components/displayComponents/ControlButtonsAltComponent';
import ControlButtonsComponentTouch from './src/components/displayComponents/ControlButtonsComponentTouch';
import OtherGridComponent from './src/components/displayComponents/OtherGridComponent';
import MainScreenComponent from './src/components/displayComponents/MainScreenComponent';
import MainGridComponent from './src/components/displayComponents/MainGridComponent';
import SubAspectComponent from './src/components/displayComponents/SubAspectComponent';
import MainContainerComponent from './src/components/displayComponents/MainContainerComponent';
import AlertComponent from './src/components/displayComponents/AlertComponent';
import MenuModal from './src/components/menuComponents/MenuModal';
import RecordingModal from './src/components/recordingComponents/RecordingModal';
import RequestsModal from './src/components/requestsComponents/RequestsModal';
import WaitingRoomModal from './src/components/waitingComponents/WaitingModal';
import DisplaySettingsModal from './src/components/displaySettingsComponents/DisplaySettingsModal';
import EventSettingsModal from './src/components/eventSettingsComponents/EventSettingsModal';
import CoHostModal from './src/components/coHostComponents/CoHostModal';
import ParticipantsModal from './src/components/participantsComponents/ParticipantsModal';
import MessagesModal from './src/components/messageComponents/MessagesModal';
import MediaSettingsModal from './src/components/mediaSettingsComponents/MediaSettingsModal';
import ConfirmExitModal from './src/components/exitComponents/ConfirmExitModal';
import ConfirmHereModal from './src/components/miscComponents/ConfirmHereModal';
import ShareEventModal from './src/components/miscComponents/ShareEventModal';
import WelcomePage from './src/components/miscComponents/WelcomePage';
import PreJoinPage from './src/components/miscComponents/PreJoinPage';

import PollModal from './src/components/pollsComponents/PollModal';
import BreakoutRoomsModal from "./src/components/breakoutComponents/BreakoutRoomsModal";


//pagination and display of media (samples)
import Pagination from './src/components/displayComponents/Pagination';
import FlexibleGrid from './src/components/displayComponents/FlexibleGrid';
import FlexibleVideo from './src/components/displayComponents/FlexibleVideo';
import AudioGrid from './src/components/displayComponents/AudioGrid';

//import methods for control (samples)
import { launchMenuModal } from './src/methods/menuMethods/launchMenuModal';
import { launchRecording } from './src/methods/recordingMethods/launchRecording';
import { startRecording } from './src/methods/recordingMethods/startRecording';
import { confirmRecording } from './src/methods/recordingMethods/confirmRecording';
import { launchWaiting } from './src/methods/waitingMethods/launchWaiting';
import { launchCoHost } from './src/methods/coHostMethods/launchCoHost';
import { launchMediaSettings } from './src/methods/mediaSettingsMethods/launchMediaSettings';
import { launchDisplaySettings } from './src/methods/displaySettingsMethods/launchDisplaySettings';
import { launchSettings } from './src/methods/settingsMethods/launchSettings';
import { launchRequests } from './src/methods/requestsMethods/launchRequests';
import { launchParticipants } from './src/methods/participantsMethods/launchParticipants';
import { launchMessages } from './src/methods/messageMethods/launchMessages';
import { launchConfirmExit } from './src/methods/exitMethods/launchConfirmExit';

import { launchPoll } from './src/methods/pollsMethods/launchPoll';
import { launchBreakoutRooms } from './src/methods/breakoutRoomsMethods/launchBreakoutRooms';


// mediasfu functions -- examples
import { connectSocket, disconnectSocket } from './src/sockets/SocketManager';
import { joinRoomClient } from './src/ProducerClient/producerClientEmits/joinRoomClient';
import { updateRoomParametersClient } from './src/ProducerClient/producerClientEmits/updateRoomParametersClient';
import { createDeviceClient } from './src/ProducerClient/producerClientEmits/createDeviceClient';

import { switchVideoAlt } from './src/methods/streamMethods/switchVideoAlt';
import { clickVideo } from './src/methods/streamMethods/clickVideo';
import { clickAudio } from './src/methods/streamMethods/clickAudio';
import { clickScreenShare } from './src/methods/streamMethods/clickScreenShare';
import { streamSuccessVideo } from './src/consumers/streamSuccessVideo';
import { streamSuccessAudio } from './src/consumers/streamSuccessAudio';
import { streamSuccessScreen } from './src/consumers/streamSuccessScreen';
import { streamSuccessAudioSwitch } from './src/consumers/streamSuccessAudioSwitch';
import { checkPermission } from './src/consumers/checkPermission';
import { producerClosed } from './src/consumers/socketReceiveMethods/producerClosed';
import { newPipeProducer } from './src/consumers/socketReceiveMethods/newPipeProducer';

//mediasfu functions
import { updateMiniCardsGrid } from './src/consumers/updateMiniCardsGrid';
import { mixStreams } from './src/consumers/mixStreams';
import { dispStreams } from './src/consumers/dispStreams';
import { stopShareScreen } from './src/consumers/stopShareScreen';
import { checkScreenShare } from './src/consumers/checkScreenShare';
import { startShareScreen } from './src/consumers/startShareScreen';
import { requestScreenShare } from './src/consumers/requestScreenShare';
import { reorderStreams } from './src/consumers/reorderStreams';
import { prepopulateUserMedia } from './src/consumers/prepopulateUserMedia';
import { getVideos } from './src/consumers/getVideos';
import { rePort } from './src/consumers/rePort';
import { trigger } from './src/consumers/trigger';
import { consumerResume } from './src/consumers/consumerResume';
import { connectSendTransportAudio } from './src/consumers/connectSendTransportAudio';
import { connectSendTransportVideo } from './src/consumers/connectSendTransportVideo';
import { connectSendTransportScreen } from './src/consumers/connectSendTransportScreen';
import { processConsumerTransports } from './src/consumers/processConsumerTransports';
import { resumePauseStreams } from './src/consumers/resumePauseStreams';
import { readjust } from './src/consumers/readjust';
import { checkGrid } from './src/consumers/checkGrid';
import { getEstimate } from './src/consumers/getEstimate';
import { calculateRowsAndColumns } from './src/consumers/calculateRowsAndColumns';
import { addVideosGrid } from './src/consumers/addVideosGrid';
import { onScreenChanges } from './src/consumers/onScreenChanges';
import { sleep } from './src/methods/utils/sleep';
import { changeVids } from './src/consumers/changeVids';
import { compareActiveNames } from './src/consumers/compareActiveNames';
import { compareScreenStates } from './src/consumers/compareScreenStates';
import { createSendTransport } from './src/consumers/createSendTransport';
import { resumeSendTransportAudio } from './src/consumers/resumeSendTransportAudio';
import { receiveAllPipedTransports } from './src/consumers/receiveAllPipedTransports';
import { disconnectSendTransportVideo } from './src/consumers/disconnectSendTransportVideo';
import { disconnectSendTransportAudio } from './src/consumers/disconnectSendTransportAudio';
import { disconnectSendTransportScreen } from './src/consumers/disconnectSendTransportScreen';
import { connectSendTransport } from './src/consumers/connectSendTransport';
import { getPipedProducersAlt } from './src/consumers/getPipedProducersAlt';
import { signalNewConsumerTransport } from './src/consumers/signalNewConsumerTransport';
import { connectRecvTransport } from './src/consumers/connectRecvTransport';
import { reUpdateInter } from './src/consumers/reUpdateInter';
import { updateParticipantAudioDecibels } from './src/consumers/updateParticipantAudioDecibels';
import { closeAndResize } from './src/consumers/closeAndResize';
import { autoAdjust } from './src/consumers/autoAdjust';
import { switchUserVideoAlt } from './src/consumers/switchUserVideoAlt';
import { switchUserVideo } from './src/consumers/switchUserVideo';
import { switchUserAudio } from './src/consumers/switchUserAudio';
import { receiveRoomMessages } from './src/consumers/receiveRoomMessages';
import { formatNumber } from './src/methods/utils/formatNumber';
import { connectIps } from './src/consumers/connectIps';

import { pollUpdated } from './src/methods/pollsMethods/pollUpdated';
import { handleCreatePoll } from './src/methods/pollsMethods/handleCreatePoll';
import { handleVotePoll } from './src/methods/pollsMethods/handleVotePoll';
import { handleEndPoll } from './src/methods/pollsMethods/handleEndPoll';

import { breakoutRoomUpdated } from './src/methods/breakoutRoomsMethods/breakoutRoomUpdated';



import { startMeetingProgressTimer } from './src/methods/utils/meetingTimer/startMeetingProgressTimer';
import { updateRecording } from './src/methods/recordingMethods/updateRecording';
import { stopRecording } from './src/methods/recordingMethods/stopRecording';

import { userWaiting } from './src/producers/socketReceiveMethods/userWaiting';
import { personJoined } from './src/producers/socketReceiveMethods/personJoined';
import { allWaitingRoomMembers } from './src/producers/socketReceiveMethods/allWaitingRoomMembers';
import { roomRecordParams } from './src/producers/socketReceiveMethods/roomRecordParams';
import { banParticipant } from './src/producers/socketReceiveMethods/banParticipant';
import { updatedCoHost } from './src/producers/socketReceiveMethods/updatedCoHost';
import { participantRequested } from './src/producers/socketReceiveMethods/participantRequested';
import { screenProducerId } from './src/producers/socketReceiveMethods/screenProducerId';
import { updateMediaSettings } from './src/producers/socketReceiveMethods/updateMediaSettings';
import { producerMediaPaused } from './src/producers/socketReceiveMethods/producerMediaPaused';
import { producerMediaResumed } from './src/producers/socketReceiveMethods/producerMediaResumed';
import { producerMediaClosed } from './src/producers/socketReceiveMethods/producerMediaClosed';
import { controlMediaHost } from './src/producers/socketReceiveMethods/controlMediaHost';
import { meetingEnded } from './src/producers/socketReceiveMethods/meetingEnded';
import { disconnectUserSelf } from './src/producers/socketReceiveMethods/disconnectUserSelf';
import { receiveMessage } from './src/producers/socketReceiveMethods/receiveMessage';
import { meetingTimeRemaining } from './src/producers/socketReceiveMethods/meetingTimeRemaining';
import { meetingStillThere } from './src/producers/socketReceiveMethods/meetingStillThere';
import { startRecords } from './src/producers/socketReceiveMethods/startRecords';
import { reInitiateRecording } from './src/producers/socketReceiveMethods/reInitiateRecording';
import { getDomains } from './src/producers/socketReceiveMethods/getDomains';
import { updateConsumingDomains } from './src/producers/socketReceiveMethods/updateConsumingDomains';
import { recordingNotice } from './src/producers/socketReceiveMethods/recordingNotice';
import { timeLeftRecording } from './src/producers/socketReceiveMethods/timeLeftRecording';
import { stoppedRecording } from './src/producers/socketReceiveMethods/stoppedRecording';
import { hostRequestResponse } from './src/producers/socketReceiveMethods/hostRequestResponse';
import { allMembers } from './src/producers/socketReceiveMethods/allMembers';
import { allMembersRest } from './src/producers/socketReceiveMethods/allMembersRest';
import { disconnect } from './src/producers/socketReceiveMethods/disconnect';

//Prebuilt Event Rooms
import MediasfuGeneric from './src/components/mediasfuComponents/MediasfuGeneric';
import MediasfuBroadcast from './src/components/mediasfuComponents/MediasfuBroadcast';
import MediasfuWebinar from './src/components/mediasfuComponents/MediasfuWebinar';
import MediasfuConference from './src/components/mediasfuComponents/MediasfuConference';
import MediasfuChat from './src/components/mediasfuComponents/MediasfuChat';

//Random Data
import { generateRandomParticipants } from './src/methods/utils/generateRandomParticipants';
import { generateRandomMessages } from './src/methods/utils/generateRandomMessages';
import { generateRandomRequestList } from './src/methods/utils/generateRandomRequestList';
import { generateRandomWaitingRoomList } from './src/methods/utils/generateRandomWaitingRoomList';
import { generateRandomPolls } from './src/methods/utils/generateRandomPolls';

//Key UI Components
import MeetingProgressTimer  from './src/components/displayComponents/MeetingProgressTimer';
import MiniAudio from './src/components/displayComponents/MiniAudio';
import MiniCard from './src/components/displayComponents/MiniCard';
import AudioCard from './src/components/displayComponents/AudioCard';
import VideoCard from './src/components/displayComponents/VideoCard';
import CardVideoDisplay from './src/components/displayComponents/CardVideoDisplay';
import MiniCardAudio from './src/components/displayComponents/MiniCardAudio';
import MiniAudioPlayer from './src/methods/utils/MiniAudioPlayer/MiniAudioPlayer';
import { SoundPlayer } from './src/methods/utils/SoundPlayer';


export { 
    initialValuesState,
    LoadingModal, MainAspectComponent, ControlButtonsComponent, ControlButtonsAltComponent, ControlButtonsComponentTouch, OtherGridComponent, MainScreenComponent, MainGridComponent, SubAspectComponent, MainContainerComponent, AlertComponent, MenuModal, RecordingModal, RequestsModal, WaitingRoomModal, DisplaySettingsModal, EventSettingsModal, CoHostModal, ParticipantsModal, MessagesModal, MediaSettingsModal, ConfirmExitModal, ConfirmHereModal, ShareEventModal, WelcomePage, PreJoinPage,
    Pagination, FlexibleGrid, FlexibleVideo, AudioGrid,
    launchMenuModal, launchRecording, startRecording, confirmRecording, launchWaiting, launchCoHost, launchMediaSettings, launchDisplaySettings, launchSettings, launchRequests, launchParticipants, launchMessages, launchConfirmExit,
    connectSocket, disconnectSocket, joinRoomClient, updateRoomParametersClient, createDeviceClient,
    switchVideoAlt, clickVideo, clickAudio, clickScreenShare, streamSuccessVideo, streamSuccessAudio, streamSuccessScreen, streamSuccessAudioSwitch, checkPermission, producerClosed, newPipeProducer,
    updateMiniCardsGrid, mixStreams, dispStreams, stopShareScreen, checkScreenShare, startShareScreen, requestScreenShare, reorderStreams, prepopulateUserMedia, getVideos, rePort, trigger, consumerResume, connectSendTransportAudio, connectSendTransportVideo, connectSendTransportScreen, processConsumerTransports, resumePauseStreams, readjust, checkGrid, getEstimate, 
    calculateRowsAndColumns, addVideosGrid, onScreenChanges, sleep, changeVids, compareActiveNames, compareScreenStates, createSendTransport, resumeSendTransportAudio, receiveAllPipedTransports, disconnectSendTransportVideo, disconnectSendTransportAudio, disconnectSendTransportScreen, connectSendTransport, getPipedProducersAlt, signalNewConsumerTransport, connectRecvTransport, reUpdateInter, updateParticipantAudioDecibels, closeAndResize, autoAdjust, switchUserVideoAlt, switchUserVideo, switchUserAudio, receiveRoomMessages, formatNumber, connectIps,
    startMeetingProgressTimer, updateRecording, stopRecording,
    
    userWaiting, personJoined, allWaitingRoomMembers, roomRecordParams, banParticipant, updatedCoHost, participantRequested, screenProducerId, updateMediaSettings, producerMediaPaused, producerMediaResumed, producerMediaClosed, controlMediaHost, meetingEnded, disconnectUserSelf, receiveMessage, meetingTimeRemaining, meetingStillThere, startRecords, reInitiateRecording, getDomains, updateConsumingDomains, recordingNotice, timeLeftRecording, stoppedRecording, hostRequestResponse, allMembers, allMembersRest, disconnect,
    MediasfuGeneric, MediasfuBroadcast, MediasfuWebinar, MediasfuConference, MediasfuChat, generateRandomParticipants, generateRandomMessages, generateRandomRequestList, generateRandomWaitingRoomList, generateRandomPolls,

    MeetingProgressTimer, MiniAudio, MiniCard, AudioCard, VideoCard, CardVideoDisplay, MiniCardAudio, MiniAudioPlayer, SoundPlayer,

    pollUpdated, handleCreatePoll, handleVotePoll, handleEndPoll, breakoutRoomUpdated,

    launchPoll, launchBreakoutRooms,

    PollModal, BreakoutRoomsModal
};

