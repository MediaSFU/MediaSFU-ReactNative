/**
 * Generated from the React SDK by
 * mediasfu-shared/scripts/port-headless-hook-native.cjs — do not edit here.
 * Keep this native adapter aligned with the public framework-neutral headless contract.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  BreakoutState,
  HeadlessActionResult,
  HeadlessParameters,
  ModerationArea,
  ModerationPermissions,
  ParticipantMediaState,
  PollState,
  ProducerKind,
  RecordingState,
  ResolvedMedia,
  RoomReadiness,
  ScreenShareState,
  WhiteboardState,
  createRoomPoll,
  disableParticipantVideo,
  endRoomPoll,
  flipCamera,
  getAudioGridComponents,
  getBreakoutState,
  getLocalAudioStream,
  getLocalVideoStream,
  getModerationPermissions,
  getPollState,
  getRecordingState,
  getRemoteVideoStreams,
  getRoomReadiness,
  getScreenShareStream,
  getWhiteboardState,
  leaveRoom,
  listParticipantMediaStates,
  muteEveryone,
  muteParticipant,
  pauseRoomRecording,
  produceCanvas,
  produceDisplay,
  produceElement,
  produceMedia,
  removeParticipant,
  replaceProducerTrack,
  respondToParticipantRequest,
  respondToWaitingParticipant,
  resumeRoomRecording,
  runMediaControl,
  sendChatMessage,
  setCoHost,
  setParticipantMedia,
  startRoomRecording,
  startWhiteboard,
  stopParticipantScreenShare,
  stopProducing,
  stopRoomRecording,
  stopWhiteboard,
  switchCamera,
  switchMicrophone,
  voteInRoomPoll,
} from 'mediasfu-shared';

export interface HeadlessControls {
  toggleMic: () => Promise<HeadlessActionResult>;
  toggleCamera: () => Promise<HeadlessActionResult>;
  toggleScreenShare: () => Promise<HeadlessActionResult>;
  selectMic: (deviceId: string) => Promise<HeadlessActionResult>;
  selectCamera: (deviceId: string) => Promise<HeadlessActionResult>;
  /** Toggle front/rear. The SDK's switchVideoAlt takes no target, so this flips. */
  flipCamera: () => Promise<HeadlessActionResult>;
  sendChat: (
    message: string,
    options?: { receivers?: string[]; group?: boolean }
  ) => Promise<HeadlessActionResult>;
  leave: (ban?: boolean, endRoomOnHostExit?: boolean) => Promise<HeadlessActionResult>;
}

/** Host / co-host actions. Gate the UI on `permissions`, not on `isHost`. */
export interface HeadlessModeration {
  permissions: ModerationPermissions;
  muteParticipant: (name: string) => Promise<HeadlessActionResult>;
  disableParticipantVideo: (name: string) => Promise<HeadlessActionResult>;
  stopParticipantScreenShare: (name: string) => Promise<HeadlessActionResult>;
  /** Turn off one participant's audio, video, screen share, or all of it. */
  setParticipantMedia: (
    name: string,
    kind: 'audio' | 'video' | 'screenshare' | 'all'
  ) => Promise<HeadlessActionResult>;
  muteEveryone: (
    kind?: 'audio' | 'video' | 'screenshare' | 'all'
  ) => Promise<HeadlessActionResult>;
  removeParticipant: (name: string) => Promise<HeadlessActionResult>;
  admitWaiting: (nameOrId: string) => Promise<HeadlessActionResult>;
  denyWaiting: (nameOrId: string) => Promise<HeadlessActionResult>;
  approveRequest: (requestId: string) => Promise<HeadlessActionResult>;
  rejectRequest: (requestId: string) => Promise<HeadlessActionResult>;
  setCoHost: (name: string, areas?: ModerationArea[]) => Promise<HeadlessActionResult>;
}

/** Recording, whiteboard, polls and breakout rooms. */
export interface HeadlessSession {
  recording: RecordingState;
  whiteboard: WhiteboardState;
  polls: PollState;
  breakout: BreakoutState;
  startRecording: () => Promise<HeadlessActionResult>;
  pauseRecording: () => Promise<HeadlessActionResult>;
  resumeRecording: () => Promise<HeadlessActionResult>;
  stopRecording: () => Promise<HeadlessActionResult>;
  startWhiteboard: (users?: any[]) => Promise<HeadlessActionResult>;
  stopWhiteboard: () => Promise<HeadlessActionResult>;
  createPoll: (question: string, options: string[]) => Promise<HeadlessActionResult>;
  votePoll: (pollId: string, optionIndex: number) => Promise<HeadlessActionResult>;
  endPoll: (pollId: string) => Promise<HeadlessActionResult>;
}

/** Publish arbitrary media: a canvas, a media element, a screen, a custom stream. */
export interface HeadlessProduction {
  /** Publish any MediaStream as camera, mic, or screen. */
  media: (stream: MediaStream, kind: ProducerKind) => Promise<HeadlessActionResult>;
  /** Publish a <canvas> as video. Returns the captured stream for cleanup. */
  canvas: (
    canvas: HTMLCanvasElement,
    frameRate?: number
  ) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;
  /** Publish a playing <video>/<audio> element. */
  element: (
    element: HTMLMediaElement
  ) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;
  /** Start a screen share. Call from a user gesture. */
  display: (
    withAudio?: boolean
  ) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;
  /** Swap a live producer's track with no renegotiation or visible gap. */
  replaceTrack: (track: MediaStreamTrack) => Promise<HeadlessActionResult>;
  /** Tear down one producer, leaving the others up. */
  stop: (kind: ProducerKind) => Promise<HeadlessActionResult>;
}

export interface MediasfuHeadless {
  /**
   * Pass to the MediaSFU component's `sourceParameters` prop.
   * Stable across renders.
   */
  sourceParameters: HeadlessParameters;
  /** Pass to the MediaSFU component's `updateSourceParameters` prop. */
  updateSourceParameters: (parameters: HeadlessParameters) => void;
  /**
   * Pass to the MediaSFU component's `onMediaChanged` prop. This is the signal
   * that fires *because* media changed, rather than incidentally; wiring it
   * removes any need for a polling loop.
   */
  onMediaChanged: (data: { reasons: string[]; parameters: HeadlessParameters }) => void;
  /** Increments on every publication; use as a `useMemo`/`useEffect` dependency. */
  sourceChanged: number;
  /** The latest bag. Read it, do not hold it across publications. */
  parameters: HeadlessParameters;

  readiness: RoomReadiness;
  ready: boolean;

  localVideo: MediaStream | null;
  localAudio: MediaStream | null;
  remoteVideos: ResolvedMedia[];
  screenShare: ScreenShareState;
  /** Mount all of these (hidden is fine) or participants will be inaudible. */
  audioComponents: any[];

  participants: ParticipantMediaState[];
  micOn: boolean;
  cameraOn: boolean;

  controls: HeadlessControls;
  moderation: HeadlessModeration;
  session: HeadlessSession;
  produce: HeadlessProduction;
}

/**
 * Everything a `returnUI={false}` surface needs, in one hook.
 *
 * This composes the headless helpers against a correctly wired parameter bridge,
 * which is where most headless integrations go wrong. Two rules are baked in:
 *
 *  - **Take every publication.** Each field on the bag is a snapshot of an
 *    internal ref that the SDK reassigns, so a bag you hold is stale as soon as
 *    a producer changes. De-duplicating or deep-comparing publications freezes
 *    your UI on whatever it happened to render first.
 *  - **Keep `sourceParameters` stable.** The object handed to the SDK is a seed
 *    it writes through; passing a fresh object each render makes the SDK
 *    re-render and can loop. This hook keeps one seed and tracks state itself.
 *
 * @example
 * ```tsx
 * import { MediasfuGeneric, PreJoinPage, AudioGrid, useMediasfuHeadless } from 'mediasfu-reactnative';
 *
 * function Call() {
 *   const room = useMediasfuHeadless();
 *   const primary = room.screenShare.stream
 *     ?? room.remoteVideos[0]?.stream
 *     ?? room.localVideo;
 *
 *   return (
 *     <>
 *       <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
 *         <MediasfuGeneric
 *           PrejoinPage={PreJoinPage}
 *           returnUI={false}
 *           noUIPreJoinOptions={{ action: 'create', userName: 'Eric', duration: 15, capacity: 4, eventType: 'conference' }}
 *           sourceParameters={room.sourceParameters}
 *           updateSourceParameters={room.updateSourceParameters}
 *         />
 *       </div>
 *
 *       {primary ? <MyVideo stream={primary} /> : <p>{room.readiness.reason}</p>}
 *       <button disabled={!room.ready} onClick={room.controls.toggleCamera}>
 *         {room.cameraOn ? 'Camera off' : 'Camera on'}
 *       </button>
 *
 *       <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
 *         <AudioGrid componentsToRender={room.audioComponents} />
 *       </div>
 *     </>
 *   );
 * }
 * ```
 */
export function useMediasfuHeadless(): MediasfuHeadless {
  // A single seed object for the SDK to write through. Never replaced.
  const seedRef = useRef<HeadlessParameters>({});
  const parametersRef = useRef<HeadlessParameters>({});
  const [sourceChanged, setSourceChanged] = useState(0);

  const updateSourceParameters = useCallback(
    (parameters: HeadlessParameters) => {
      if (!parameters || parameters === parametersRef.current) return;
      parametersRef.current = parameters;
      setSourceChanged((previous) => previous + 1);
    },
    []
  );

  // A media transition is authoritative: adopt the bag it carries immediately.
  const onMediaChanged = useCallback(
    (data: { reasons: string[]; parameters: HeadlessParameters }) => {
      if (data?.parameters) updateSourceParameters(data.parameters);
    },
    [updateSourceParameters]
  );

  const parameters = parametersRef.current;

  const projection = useMemo(() => {
    const readiness = getRoomReadiness({ parameters });
    return {
      readiness,
      localVideo: getLocalVideoStream({ parameters }),
      localAudio: getLocalAudioStream({ parameters }),
      remoteVideos: getRemoteVideoStreams({ parameters }),
      screenShare: getScreenShareStream({ parameters }),
      audioComponents: getAudioGridComponents({ parameters }),
      participants: listParticipantMediaStates({ parameters }),
      permissions: getModerationPermissions({ parameters }),
      recording: getRecordingState({ parameters }),
      whiteboard: getWhiteboardState({ parameters }),
      polls: getPollState({ parameters }),
      breakout: getBreakoutState({ parameters }),
    };
    // `parameters` identity changes on every publication, and `sourceChanged`
    // keeps this honest if a caller ever reuses an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, sourceChanged]);

  const controls = useMemo<HeadlessControls>(
    () => ({
      toggleMic: () =>
        runMediaControl({ parameters: parametersRef.current, control: 'clickAudio' }),
      toggleCamera: () =>
        runMediaControl({ parameters: parametersRef.current, control: 'clickVideo' }),
      toggleScreenShare: () =>
        runMediaControl({
          parameters: parametersRef.current,
          control: 'clickScreenShare',
        }),
      // Not runMediaControl: `switchAudio`/`switchVideo` are never published on
      // the parameter bag (only `switchVideoAlt` is), so routing through it
      // failed every time with "The SDK switchAudio control is unavailable".
      // switchMicrophone/switchCamera import the SDK methods directly and keep
      // the same alert-based refusal detection.
      selectMic: (deviceId: string) =>
        switchMicrophone({ parameters: parametersRef.current, deviceId }),
      selectCamera: (deviceId: string) =>
        switchCamera({ parameters: parametersRef.current, deviceId }),
      flipCamera: () => flipCamera({ parameters: parametersRef.current }),
      sendChat: (message: string, options = {}) =>
        sendChatMessage({
          parameters: parametersRef.current,
          message,
          receivers: options.receivers,
          group: options.group,
        }),
      leave: (ban = false, endRoomOnHostExit = true) =>
        leaveRoom({ parameters: parametersRef.current, ban, endRoomOnHostExit }),
    }),
    []
  );

  // Actions read `parametersRef` at call time, so this map is built once and
  // never goes stale — no dependency churn on every publication.
  const moderationActions = useMemo(
    () => ({
      muteParticipant: (name: string) =>
        muteParticipant({ parameters: parametersRef.current, name }),
      disableParticipantVideo: (name: string) =>
        disableParticipantVideo({ parameters: parametersRef.current, name }),
      stopParticipantScreenShare: (name: string) =>
        stopParticipantScreenShare({ parameters: parametersRef.current, name }),
      setParticipantMedia: (
        name: string,
        kind: 'audio' | 'video' | 'screenshare' | 'all'
      ) => setParticipantMedia({ parameters: parametersRef.current, name, kind }),
      muteEveryone: (kind: 'audio' | 'video' | 'screenshare' | 'all' = 'audio') =>
        muteEveryone({ parameters: parametersRef.current, kind }),
      removeParticipant: (name: string) =>
        removeParticipant({ parameters: parametersRef.current, name }),
      admitWaiting: (nameOrId: string) =>
        respondToWaitingParticipant({
          parameters: parametersRef.current,
          id: nameOrId,
          name: nameOrId,
          admit: true,
        }),
      denyWaiting: (nameOrId: string) =>
        respondToWaitingParticipant({
          parameters: parametersRef.current,
          id: nameOrId,
          name: nameOrId,
          admit: false,
        }),
      approveRequest: (requestId: string) =>
        respondToParticipantRequest({
          parameters: parametersRef.current,
          requestId,
          approve: true,
        }),
      rejectRequest: (requestId: string) =>
        respondToParticipantRequest({
          parameters: parametersRef.current,
          requestId,
          approve: false,
        }),
      setCoHost: (name: string, areas?: ModerationArea[]) =>
        setCoHost({ parameters: parametersRef.current, name, areas }),
    }),
    []
  );

  const sessionActions = useMemo(
    () => ({
      startRecording: () => startRoomRecording({ parameters: parametersRef.current }),
      pauseRecording: () => pauseRoomRecording({ parameters: parametersRef.current }),
      resumeRecording: () => resumeRoomRecording({ parameters: parametersRef.current }),
      stopRecording: () => stopRoomRecording({ parameters: parametersRef.current }),
      startWhiteboard: (users?: any[]) =>
        startWhiteboard({ parameters: parametersRef.current, users }),
      stopWhiteboard: () => stopWhiteboard({ parameters: parametersRef.current }),
      createPoll: (question: string, options: string[]) =>
        createRoomPoll({ parameters: parametersRef.current, question, options }),
      votePoll: (pollId: string, optionIndex: number) =>
        voteInRoomPoll({ parameters: parametersRef.current, pollId, optionIndex }),
      endPoll: (pollId: string) =>
        endRoomPoll({ parameters: parametersRef.current, pollId }),
    }),
    []
  );

  const productionActions = useMemo<HeadlessProduction>(
    () => ({
      media: (stream: MediaStream, kind: ProducerKind) =>
        produceMedia({ parameters: parametersRef.current, stream, kind }),
      canvas: (canvas: HTMLCanvasElement, frameRate?: number) =>
        produceCanvas({ parameters: parametersRef.current, canvas, frameRate }),
      element: (element: HTMLMediaElement) =>
        produceElement({ parameters: parametersRef.current, element }),
      display: (withAudio = false) =>
        produceDisplay({ parameters: parametersRef.current, withAudio }),
      replaceTrack: (track: MediaStreamTrack) =>
        replaceProducerTrack({ parameters: parametersRef.current, track }),
      stop: (kind: ProducerKind) =>
        stopProducing({ parameters: parametersRef.current, kind }),
    }),
    []
  );

  return {
    sourceParameters: seedRef.current,
    updateSourceParameters,
    onMediaChanged,
    sourceChanged,
    parameters,
    readiness: projection.readiness,
    ready: projection.readiness.ready,
    localVideo: projection.localVideo,
    localAudio: projection.localAudio,
    remoteVideos: projection.remoteVideos,
    screenShare: projection.screenShare,
    audioComponents: projection.audioComponents,
    participants: projection.participants,
    micOn: Boolean(parameters.audioAlreadyOn),
    cameraOn: Boolean(parameters.videoAlreadyOn),
    controls,
    moderation: { permissions: projection.permissions, ...moderationActions },
    session: {
      recording: projection.recording,
      whiteboard: projection.whiteboard,
      polls: projection.polls,
      breakout: projection.breakout,
      ...sessionActions,
    },
    produce: productionActions,
  };
}

export default useMediasfuHeadless;
