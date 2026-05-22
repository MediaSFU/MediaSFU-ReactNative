// @ts-nocheck

import React, { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModernAlertComponent } from './src/components_modern/display_components/ModernAlertComponent';
import { ModernAudioCard } from './src/components_modern/display_components/ModernAudioCard';
import { ModernControlButtonsComponent } from './src/components_modern/display_components/ModernControlButtonsComponent';
import { ModernFlexibleGrid } from './src/components_modern/display_components/ModernFlexibleGrid';
import { ModernLoadingModal } from './src/components_modern/display_components/ModernLoadingModal';
import { ModernMainContainerComponent } from './src/components_modern/display_components/ModernMainContainerComponent';
import { ModernMeetingProgressTimer } from './src/components_modern/display_components/ModernMeetingProgressTimer';
import { ModernMediasfuGeneric } from './src/components_modern/mediasfu_components/ModernMediasfuGeneric';
import { ModernMiniCard } from './src/components_modern/display_components/ModernMiniCard';
import { ModernPagination } from './src/components_modern/display_components/ModernPagination';
import { ModernVideoCard } from './src/components_modern/display_components/ModernVideoCard';
import { ParticipantsCounterBadge } from './src/components_modern/display_components/ParticipantsCounterBadge';
import {
  ModernBackgroundModal,
  ModernBreakoutRoomsModal,
  ModernCoHostModal,
  ModernConfirmExitModal,
  ModernConfirmHereModal,
  ModernConfigureWhiteboardModal,
  ModernDisplaySettingsModal,
  ModernEventSettingsModal,
  ModernMediaSettingsModal,
  ModernMenuModal,
  ModernMessagesModal,
  ModernPanelistsModal,
  ModernParticipantsModal,
  ModernPermissionsModal,
  ModernPollModal,
  ModernRecordingModal,
  ModernRequestsModal,
  ModernScreenboardModal,
  ModernShareEventModal,
  ModernWaitingModal,
} from './src/components_modern/modal_components';
import Whiteboard from './src/components/whiteboardComponents/Whiteboard';

const noop = () => undefined;
const asyncNoop = async () => undefined;

export const surfaceIds = [
  'overview',
  'integrated-shell',
  'video-card',
  'audio-card',
  'mini-card',
  'controls',
  'pagination',
  'grid',
  'main-container',
  'timer-badge',
  'loading-modal',
  'alert',
  'background-modal',
  'breakout-rooms-modal',
  'co-host-modal',
  'configure-whiteboard-modal',
  'whiteboard',
  'confirm-here-modal',
  'menu-modal',
  'messages-modal',
  'media-settings-modal',
  'participants-modal',
  'panelists-modal',
  'permissions-modal',
  'recording-modal',
  'requests-modal',
  'poll-modal',
  'screenboard-modal',
  'share-event-modal',
  'display-settings-modal',
  'event-settings-modal',
  'waiting-modal',
  'confirm-exit-modal',
] as const;

export type SurfaceId = typeof surfaceIds[number];
export type VisualAuditRoute = {
  surface: SurfaceId;
};

type AppVisualAuditProps = {
  initialSurface?: SurfaceId;
};

const normalizeSurface = (value?: string | null): SurfaceId => {
  return surfaceIds.includes(value as SurfaceId) ? (value as SurfaceId) : 'overview';
};

export const resolveVisualAuditRoute = (url?: string | null): VisualAuditRoute | null => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const normalizedTarget = `${parsed.host}${parsed.pathname}`.replace(/^\/+|\/+$/g, '');
    const isAuditLaunch = normalizedTarget === 'audit' || parsed.searchParams.get('audit') === '1';

    if (!isAuditLaunch) {
      return null;
    }

    return {
      surface: normalizeSurface(parsed.searchParams.get('surface')),
    };
  } catch {
    const isAuditLaunch = /:\/\/audit(?:[/?#]|$)|\/audit(?:[?#]|$)|[?&]audit=1(?:&|$)/i.test(url);
    if (!isAuditLaunch) {
      return null;
    }

    const match = /[?&]surface=([^&#]+)/i.exec(url);
    const selectedSurface = match ? decodeURIComponent(match[1]) : null;

    return {
      surface: normalizeSurface(selectedSurface),
    };
  }
};

const getSurfaceFromLocation = (): SurfaceId => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return 'overview';
  }

  const params = new URLSearchParams(window.location.search);
  return normalizeSurface(params.get('surface') || window.location.hash.replace(/^#/, ''));
};

const createSocket = () => ({
  id: 'visual-audit-socket',
  emit: (...args: unknown[]) => {
    const callback = args[args.length - 1];
    if (typeof callback === 'function') {
      callback({ success: true });
    }
  },
  on: noop,
  off: noop,
  disconnect: noop,
});

const participants = [
  { id: 'host', name: 'Host Ada', islevel: '2', muted: false, videoOn: true, audioID: 'audio-host', videoID: 'video-host' },
  { id: 'cohost', name: 'Co Host Ben', islevel: '1', muted: false, videoOn: false, audioID: 'audio-ben', videoID: 'video-ben' },
  { id: 'guest', name: 'Guest Chen', islevel: '0', muted: true, videoOn: true, audioID: 'audio-chen', videoID: 'video-chen' },
];

const audioDecibels = [
  { name: 'Host Ada', averageLoudness: 184 },
  { name: 'Co Host Ben', averageLoudness: 152 },
  { name: 'Guest Chen', averageLoudness: 96 },
];

const coHostResponsibility = [
  { name: 'participants', value: true, dedicated: false },
  { name: 'media', value: true, dedicated: false },
  { name: 'chat', value: true, dedicated: false },
  { name: 'polls', value: true, dedicated: false },
];

const requestList = [
  { id: 'request-1', name: 'Guest Chen wants to share screen', icon: 'fa-desktop', username: 'Guest Chen' },
  { id: 'request-2', name: 'Co Host Ben requested microphone access', icon: 'fa-microphone', username: 'Co Host Ben' },
];

const waitingRoomList = [
  { id: 'waiting-1', name: 'Dana Queue' },
  { id: 'waiting-2', name: 'Eli Lobby' },
];

const messages = [
  { sender: 'Host Ada', message: 'Welcome to the modern UI audit.', timestamp: '10:01', receivers: [], group: true },
  { sender: 'Guest Chen', message: 'The side panel is readable now.', timestamp: '10:02', receivers: ['Host Ada'], group: false },
  { sender: 'Co Host Ben', message: 'Recording checks are ready.', timestamp: '10:03', receivers: ['Host Ada'], group: false },
];

const baseParameters: Record<string, any> = {
  socket: createSocket(),
  localSocket: createSocket(),
  roomName: 'visual-audit-room',
  meetingID: 'VISUAL-AUDIT',
  adminPasscode: '246810',
  member: 'Host Ada',
  host: 'Host Ada',
  coHost: 'Co Host Ben',
  islevel: '2',
  eventType: 'conference',
  participants,
  filteredParticipants: participants,
  participantsCounter: participants.length,
  audioDecibels,
  coHostResponsibility,
  panelists: [participants[0], participants[2]],
  panelistsFocused: true,
  mainRoomsLength: 4,
  memberRoom: 0,
  hostNewRoom: 0,
  itemPageLimit: 4,
  meetingDisplayType: 'all',
  prevMeetingDisplayType: 'video',
  autoWave: true,
  forceFullDisplay: false,
  showSubtitlesOnCards: true,
  meetingVideoOptimized: true,
  audioSetting: 'allow',
  videoSetting: 'approval',
  screenshareSetting: 'approval',
  chatSetting: 'allow',
  userDefaultVideoInputDevice: 'camera-front',
  userDefaultAudioInputDevice: 'mic-default',
  videoInputs: [
    { deviceId: 'camera-front', label: 'Front Camera', kind: 'videoinput' },
    { deviceId: 'camera-wide', label: 'Wide Camera', kind: 'videoinput' },
  ],
  audioInputs: [
    { deviceId: 'mic-default', label: 'Built-in Microphone', kind: 'audioinput' },
    { deviceId: 'mic-usb', label: 'USB Microphone', kind: 'audioinput' },
  ],
  isBackgroundModalVisible: false,
  updateIsBackgroundModalVisible: noop,
  breakOutRoomStarted: false,
  breakOutRoomEnded: true,
  currentRoomIndex: 0,
  canStartBreakout: true,
  breakoutRooms: [[{ name: 'Co Host Ben', breakRoom: 0 }], [{ name: 'Guest Chen', breakRoom: 1 }]],
  shareScreenStarted: false,
  shared: false,
  whiteboardStarted: false,
  whiteboardEnded: true,
  whiteboardUsers: [],
  canStartWhiteboard: true,
  hostLabel: 'Host Ada',
  showAlert: noop,
  updateIsMessagesModalVisible: noop,
  updateDirectMessageDetails: noop,
  updateStartDirectMessage: noop,
  updateParticipants: noop,
  updatePanelists: noop,
  updatePanelistsFocused: noop,
  updateCoHostResponsibility: noop,
  updateCoHost: noop,
  updateIsCoHostModalVisible: noop,
  updateMeetingDisplayType: noop,
  updateBreakoutRooms: noop,
  updateBreakOutRoomStarted: noop,
  updateBreakOutRoomEnded: noop,
  updateCurrentRoomIndex: noop,
  updateCanStartBreakout: noop,
  updateShareScreenStarted: noop,
  updateWhiteboardStarted: noop,
  updateWhiteboardEnded: noop,
  updateWhiteboardUsers: noop,
  updateCanStartWhiteboard: noop,
  updateIsConfigureWhiteboardModalVisible: noop,
  onScreenChanges: asyncNoop,
  captureCanvasStream: asyncNoop,
  prepopulateUserMedia: asyncNoop,
  rePort: asyncNoop,
  updateIsPollModalVisible: noop,
  filteredRequestList: requestList,
  filteredWaitingRoomList: waitingRoomList,
  recordPaused: false,
  recordingVideoType: 'fullDisplay',
  recordingDisplayType: 'video',
  recordingBackgroundColor: '#0f172a',
  recordingNameTagsColor: '#f8fafc',
  recordingOrientationVideo: 'landscape',
  recordingNameTags: true,
  recordingAddText: true,
  recordingCustomText: 'MediaSFU Visual Audit',
  recordingCustomTextPosition: 'topLeft',
  recordingCustomTextColor: '#f8fafc',
  recordingMediaOptions: 'video',
  recordingAudioOptions: 'all',
  recordingVideoOptions: 'all',
  recordingAddHLS: true,
  updateRecordingVideoType: noop,
  updateRecordingDisplayType: noop,
  updateRecordingBackgroundColor: noop,
  updateRecordingNameTagsColor: noop,
  updateRecordingOrientationVideo: noop,
  updateRecordingNameTags: noop,
  updateRecordingAddText: noop,
  updateRecordingCustomText: noop,
  updateRecordingCustomTextPosition: noop,
  updateRecordingCustomTextColor: noop,
  updateRecordingMediaOptions: noop,
  updateRecordingAudioOptions: noop,
  updateRecordingVideoOptions: noop,
  updateRecordingAddHLS: noop,
};

baseParameters.getUpdatedAllParams = () => baseParameters;

const activePoll = {
  id: 'poll-1',
  question: 'Which layout should ship as the default modern room?',
  options: ['Grid first', 'Speaker first', 'Sidebar first'],
  status: 'active',
  votes: [5, 3, 2],
  voters: { 'Host Ada': 0, 'Co Host Ben': 1 },
};

const integratedShellSeedData = {
  member: 'Host Ada',
  host: 'Host Ada',
  eventType: 'conference',
  participants,
  messages,
  waitingList: waitingRoomList,
  requests: requestList,
  polls: [activePoll],
  breakoutRooms: baseParameters.breakoutRooms,
  whiteboardUsers: [
    { name: 'Host Ada', useBoard: true },
    { name: 'Co Host Ben', useBoard: true },
    { name: 'Guest Chen', useBoard: false },
  ],
};

const whiteboardShapes = [
  {
    type: 'freehand',
    points: [
      { x: 72, y: 82 },
      { x: 126, y: 114 },
      { x: 188, y: 78 },
      { x: 238, y: 128 },
    ],
    color: '#0ea5e9',
    thickness: 3,
  },
  { type: 'rectangle', x1: 315, y1: 82, x2: 505, y2: 190, color: '#22c55e', thickness: 3 },
  { type: 'circle', x1: 112, y1: 210, x2: 266, y2: 346, color: '#a855f7', thickness: 3 },
  { type: 'line', x1: 348, y1: 268, x2: 570, y2: 342, color: '#ef4444', thickness: 3 },
  { type: 'text', x: 380, y: 220, text: 'Plan', color: '#0f172a', fontSize: 24 },
];

const modernButtons = [
  { name: 'Mic', icon: 'microphone', alternateIcon: 'microphone-slash', active: false, onPress: noop },
  { name: 'Video', icon: 'video', alternateIcon: 'video-slash', active: true, onPress: noop },
  { name: 'Share', icon: 'desktop', active: false, onPress: noop },
  { name: 'Leave', icon: 'phone-slash', color: '#ffffff', backgroundColor: { default: '#dc2626', pressed: '#991b1b' }, onPress: noop },
];

const auditMenuButtons = [
  { icon: 'sun', text: 'Light Mode', action: noop, show: true },
  { icon: 'record-vinyl', text: 'Record', action: noop, show: true },
  { icon: 'cog', text: 'Event Settings', action: noop, show: true },
  { icon: 'tools', text: 'Set Media', action: noop, show: true },
  { icon: 'pen', text: 'Whiteboard', action: noop, show: true },
];

const cardStyle = { width: 360, height: 230 };

const Screen = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.screen} testID={`audit-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
    <Text style={styles.kicker}>MediaSFU React Native Modern UI Audit</Text>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.stage}>{children}</View>
  </View>
);

const SurfaceLinkList = () => (
  <View style={styles.surfaceGrid}>
    {surfaceIds.filter((id) => id !== 'overview').map((id) => (
      <View key={id} style={styles.surfacePill}>
        <Text style={styles.surfacePillText}>mediasfurn://audit?surface={id}</Text>
      </View>
    ))}
  </View>
);

const PlaceholderTile = ({ label }: { label: string }) => (
  <View style={styles.placeholderTile}>
    <Text style={styles.placeholderTitle}>{label}</Text>
    <Text style={styles.placeholderCaption}>Modern surface</Text>
  </View>
);

const IntegratedShellSurface = () => (
  <View style={styles.integratedShellPage} testID="audit-integrated-shell">
    <ModernMediasfuGeneric
      connectMediaSFU={false}
      useLocalUIMode
      useSeed
      seedData={integratedShellSeedData}
    />
  </View>
);

const AppVisualAudit = ({ initialSurface }: AppVisualAuditProps) => {
  const [surface, setSurface] = useState<SurfaceId>(initialSurface ?? getSurfaceFromLocation());
  const params = useMemo(() => ({ ...baseParameters, getUpdatedAllParams: () => baseParameters }), []);
  const whiteboardParams = useMemo(
    () => ({
      ...baseParameters,
      shapes: whiteboardShapes,
      whiteboardStarted: true,
      whiteboardEnded: false,
      whiteboardUsers: integratedShellSeedData.whiteboardUsers,
      useImageBackground: false,
      getUpdatedAllParams: () => baseParameters,
    }),
    [],
  );
  const participant = participants[0];

  useEffect(() => {
    if (initialSurface) {
      setSurface(initialSurface);
    }
  }, [initialSurface]);

  const gridItems = [
    <PlaceholderTile key="one" label="Host" />,
    <PlaceholderTile key="two" label="Guest" />,
    <PlaceholderTile key="three" label="Screen" />,
    <PlaceholderTile key="four" label="Chat" />,
  ];

  const surfaces: Record<SurfaceId, React.ReactNode> = {
    overview: (
      <Screen title="Surface Index">
        <Text style={styles.copy}>Use these deep links for screenshot capture.</Text>
        <SurfaceLinkList />
      </Screen>
    ),
    'integrated-shell': <IntegratedShellSurface />,
    'video-card': (
      <Screen title="Modern Video Card">
        <ModernVideoCard
          name={participant.name}
          remoteProducerId="video-host"
          eventType="conference"
          forceFullDisplay={false}
          videoStream={null}
          participant={participant}
          parameters={params}
          showControls
          showInfo
          showSubtitles
          liveSubtitleText="Live translated subtitle preview"
          isDarkMode
          customStyle={cardStyle}
        />
      </Screen>
    ),
    'audio-card': (
      <Screen title="Modern Audio Card">
        <ModernAudioCard
          name={participants[1].name}
          participant={participants[1]}
          parameters={params}
          audioDecibels={audioDecibels[1]}
          showControls
          showInfo
          isDarkMode
          customStyle={cardStyle}
        />
      </Screen>
    ),
    'mini-card': (
      <Screen title="Modern Mini Card">
        <View style={styles.inlineRow}>
          <ModernMiniCard initials="HA" name="Host Ada" showAudioIcon showVideoIcon isDarkMode customStyle={styles.miniCard} />
          <ModernMiniCard initials="CB" name="Co Host Ben" showAudioIcon isDarkMode customStyle={styles.miniCard} />
          <ModernMiniCard initials="GC" name="Guest Chen" showVideoIcon isDarkMode={false} customStyle={styles.miniCard} />
        </View>
      </Screen>
    ),
    controls: (
      <Screen title="Modern Control Buttons">
        <ModernControlButtonsComponent buttons={modernButtons} alignment="center" isDarkMode />
      </Screen>
    ),
    pagination: (
      <Screen title="Modern Pagination">
        <ModernPagination totalPages={5} currentUserPage={2} position="middle" location="middle" direction="horizontal" parameters={params} isDarkMode />
      </Screen>
    ),
    grid: (
      <Screen title="Modern Flexible Grid">
        <ModernFlexibleGrid customWidth={220} customHeight={140} rows={2} columns={2} componentsToRender={gridItems} showAspect backgroundColor="#111827" isDarkMode />
      </Screen>
    ),
    'main-container': (
      <Screen title="Modern Main Container">
        <ModernMainContainerComponent backgroundColor="#111827" containerWidthFraction={0.7} containerHeightFraction={0.45} padding={18}>
          <View style={styles.containerPreview}>
            <Text style={styles.containerPreviewTitle}>Modern room shell</Text>
            <Text style={styles.containerPreviewText}>Container, stage, controls, and sidebar-ready spacing.</Text>
          </View>
        </ModernMainContainerComponent>
      </Screen>
    ),
    'timer-badge': (
      <Screen title="Modern Timer And Participant Badge">
        <View style={styles.timerShell}>
          <ModernMeetingProgressTimer initialMinutes={18} totalMinutes={30} isDarkMode />
          <ParticipantsCounterBadge participantsCount={participants.length} position="topRight" isDarkMode />
          <Text style={styles.timerCaption}>Meeting is in progress</Text>
        </View>
      </Screen>
    ),
    'loading-modal': (
      <Screen title="Modern Loading Modal">
        <ModernLoadingModal isVisible isDarkMode />
      </Screen>
    ),
    alert: (
      <Screen title="Modern Alert">
        <ModernAlertComponent visible message="Modern success alert preview" type="success" duration={0} isDarkMode />
      </Screen>
    ),
    'background-modal': (
      <Screen title="Modern Background Modal">
        <ModernBackgroundModal isBackgroundModalVisible onBackgroundClose={noop} position="topRight" isDarkMode />
      </Screen>
    ),
    'breakout-rooms-modal': (
      <Screen title="Modern Breakout Rooms Modal">
        <ModernBreakoutRoomsModal isVisible onBreakoutRoomsClose={noop} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'co-host-modal': (
      <Screen title="Modern Co-Host Modal">
        <ModernCoHostModal isCoHostModalVisible onCoHostClose={noop} currentCohost="Co Host Ben" participants={participants} coHostResponsibility={coHostResponsibility} roomName="visual-audit-room" socket={params.socket} updateCoHostResponsibility={noop} updateCoHost={noop} updateIsCoHostModalVisible={noop} showAlert={noop} position="topRight" isDarkMode />
      </Screen>
    ),
    'configure-whiteboard-modal': (
      <Screen title="Modern Configure Whiteboard Modal">
        <ModernConfigureWhiteboardModal isConfigureWhiteboardModalVisible onConfigureWhiteboardClose={noop} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    whiteboard: (
      <Screen title="Modern Whiteboard">
        <View style={styles.whiteboardPreview}>
          <Whiteboard isVisible parameters={whiteboardParams} isDarkMode />
        </View>
      </Screen>
    ),
    'confirm-here-modal': (
      <Screen title="Modern Confirm Here Modal">
        <ModernConfirmHereModal isConfirmHereModalVisible onConfirmHereClose={noop} countdownDuration={90} socket={params.socket} roomName="visual-audit-room" member="Host Ada" isDarkMode />
      </Screen>
    ),
    'menu-modal': (
      <Screen title="Modern Menu Modal">
        <ModernMenuModal isVisible onClose={noop} roomName="visual-audit-room" adminPasscode="246810" islevel="2" eventType="conference" localLink="" customButtons={auditMenuButtons} shareButtons position="topRight" isDarkMode />
      </Screen>
    ),
    'messages-modal': (
      <Screen title="Modern Messages Modal">
        <ModernMessagesModal isMessagesModalVisible onMessagesClose={noop} messages={messages} eventType="conference" member="Host Ada" islevel="2" coHostResponsibility={coHostResponsibility} coHost="Co Host Ben" startDirectMessage directMessageDetails={participants[2]} updateStartDirectMessage={noop} updateDirectMessageDetails={noop} roomName="visual-audit-room" socket={params.socket} chatSetting="allow" showAlert={noop} position="topRight" isDarkMode />
      </Screen>
    ),
    'media-settings-modal': (
      <Screen title="Modern Media Settings Modal">
        <ModernMediaSettingsModal isMediaSettingsModalVisible onMediaSettingsClose={noop} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'participants-modal': (
      <Screen title="Modern Participants Modal">
        <ModernParticipantsModal isParticipantsModalVisible onParticipantsClose={noop} onParticipantsFilterChange={noop} participantsCounter={participants.length} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'panelists-modal': (
      <Screen title="Modern Panelists Modal">
        <ModernPanelistsModal isPanelistsModalVisible onPanelistsClose={noop} parameters={params} position="topRight" renderMode="inline" isDarkMode />
      </Screen>
    ),
    'permissions-modal': (
      <Screen title="Modern Permissions Modal">
        <ModernPermissionsModal isPermissionsModalVisible onPermissionsClose={noop} parameters={params} position="topRight" renderMode="inline" isDarkMode />
      </Screen>
    ),
    'recording-modal': (
      <Screen title="Modern Recording Modal">
        <ModernRecordingModal isRecordingModalVisible onClose={noop} confirmRecording={asyncNoop} startRecording={asyncNoop} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'requests-modal': (
      <Screen title="Modern Requests Modal">
        <ModernRequestsModal isRequestsModalVisible onRequestClose={noop} requestCounter={requestList.length} onRequestFilterChange={noop} onRequestItemPress={asyncNoop} requestList={requestList} updateRequestList={noop} roomName="visual-audit-room" socket={params.socket} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'poll-modal': (
      <Screen title="Modern Poll Modal">
        <ModernPollModal isPollModalVisible onClose={noop} updateIsPollModalVisible={noop} member="Host Ada" islevel="2" polls={[activePoll]} poll={activePoll} socket={params.socket} roomName="visual-audit-room" handleCreatePoll={asyncNoop} handleEndPoll={asyncNoop} handleVotePoll={asyncNoop} position="topRight" isDarkMode />
      </Screen>
    ),
    'screenboard-modal': (
      <Screen title="Modern Screenboard Modal">
        <ModernScreenboardModal isScreenboardModalVisible onScreenboardClose={noop} position="topRight" isDarkMode />
      </Screen>
    ),
    'share-event-modal': (
      <Screen title="Modern Share Event Modal">
        <ModernShareEventModal isShareEventModalVisible onShareEventClose={noop} roomName="visual-audit-room" adminPasscode="246810" islevel="2" eventType="conference" localLink="https://mediasfu.com/join/visual-audit-room" shareButtons position="topRight" isDarkMode />
      </Screen>
    ),
    'display-settings-modal': (
      <Screen title="Modern Display Settings Modal">
        <ModernDisplaySettingsModal isDisplaySettingsModalVisible onDisplaySettingsClose={noop} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'event-settings-modal': (
      <Screen title="Modern Event Settings Modal">
        <ModernEventSettingsModal isEventSettingsModalVisible onEventSettingsClose={noop} audioSetting="allow" videoSetting="approval" screenshareSetting="approval" chatSetting="allow" updateAudioSetting={noop} updateVideoSetting={noop} updateScreenshareSetting={noop} updateChatSetting={noop} updateIsSettingsModalVisible={noop} roomName="visual-audit-room" socket={params.socket} showAlert={noop} position="topRight" isDarkMode />
      </Screen>
    ),
    'waiting-modal': (
      <Screen title="Modern Waiting Modal">
        <ModernWaitingModal isWaitingModalVisible onWaitingRoomClose={noop} waitingRoomCounter={waitingRoomList.length} onWaitingRoomFilterChange={noop} onWaitingRoomItemPress={asyncNoop} waitingRoomList={waitingRoomList} updateWaitingList={noop} roomName="visual-audit-room" socket={params.socket} parameters={params} position="topRight" isDarkMode />
      </Screen>
    ),
    'confirm-exit-modal': (
      <Screen title="Modern Confirm Exit Modal">
        <ModernConfirmExitModal isConfirmExitModalVisible onConfirmExitClose={noop} member="Host Ada" roomName="visual-audit-room" socket={params.socket} islevel="2" position="topRight" isDarkMode />
      </Screen>
    ),
  };

  if (surface === 'integrated-shell') {
    return <View style={styles.root}>{surfaces[surface]}</View>;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.rootContent}>
      {surfaces[surface]}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  rootContent: {
    minHeight: '100%',
  },
  integratedShellPage: {
    flex: 1,
    minHeight: 960,
    backgroundColor: '#020617',
  },
  screen: {
    minHeight: 720,
    padding: 28,
    backgroundColor: '#020617',
  },
  kicker: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 22,
  },
  copy: {
    color: '#cbd5e1',
    fontSize: 15,
    marginBottom: 18,
  },
  stage: {
    minHeight: 520,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  surfaceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  surfacePill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(96, 165, 250, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.32)',
  },
  surfacePillText: {
    color: '#dbeafe',
    fontWeight: '700',
    fontSize: 12,
  },
  inlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  miniCard: {
    width: 110,
    height: 110,
  },
  whiteboardPreview: {
    width: '100%',
    maxWidth: 980,
    height: 720,
  },
  placeholderTile: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.28)',
  },
  placeholderTitle: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 18,
  },
  placeholderCaption: {
    color: '#cbd5e1',
    marginTop: 6,
    fontSize: 12,
  },
  containerPreview: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.32)',
    padding: 18,
  },
  containerPreviewTitle: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 8,
  },
  containerPreviewText: {
    color: '#cbd5e1',
    textAlign: 'center',
  },
  timerShell: {
    width: 420,
    height: 260,
    borderRadius: 22,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.26)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerCaption: {
    color: '#cbd5e1',
    marginTop: 16,
  },
});

export default AppVisualAudit;
