/**
 * Oct 2026 parity: screen-share audio (listen side + capture gate), consumer backup preference, connection-rejected
 * handling and typed media-socket errors. Spec: DSFU2/docs/sdk-parity/README.md §7.
 */
import React from 'react';
import { Platform } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { consumerBackupPreferDelay, forgetConsumerBackups, forgetScreenAudioProducer, markScreenAudioProducer } from 'mediasfu-shared';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Native WebRTC needs the native module; a tiny stand-in is enough here.
jest.mock('../src/methods/utils/webrtc/webrtc', () => {
  class FakeMediaStream {
    tracks: any[];
    constructor(tracks: any[] = []) { this.tracks = tracks; }
    getAudioTracks() { return this.tracks; }
    getTracks() { return this.tracks; }
    toURL() { return 'stream-url'; }
  }
  return {
    RTCView: 'RTCView',
    MediaStream: FakeMediaStream,
    MediaStreamTrack: class {},
    mediaDevices: {},
    registerGlobals: () => {},
  };
});

const mockIoSockets: any[] = [];
jest.mock('socket.io-client', () => {
  const makeSocket = () => {
    const handlers: Record<string, ((...args: any[]) => void)[]> = {};
    const socket: any = {
      id: undefined,
      connected: false,
      on: (event: string, handler: (...args: any[]) => void) => { (handlers[event] ||= []).push(handler); return socket; },
      off: (event: string, handler: (...args: any[]) => void) => {
        handlers[event] = (handlers[event] || []).filter((h) => h !== handler);
        return socket;
      },
      emit: jest.fn(),
      disconnect: jest.fn(),
      fire: (event: string, ...args: any[]) => [...(handlers[event] || [])].forEach((h) => h(...args)),
    };
    mockIoSockets.push(socket);
    return socket;
  };
  const io: any = jest.fn(() => makeSocket());
  return { __esModule: true, default: io, io };
});

import { consumerResume } from '../src/consumers/consumerResume';
import ScreenAudioPlayer, { screenAudioLabel } from '../src/methods/utils/ScreenAudioPlayer/ScreenAudioPlayer';
import MiniAudio from '../src/components/displayComponents/MiniAudio';
import ScreenAudioPrompt, { ScreenAudioPromptHost, promptScreenAudioChoice } from '../src/components/miscComponents/ScreenAudioPrompt';
import { startShareScreen } from '../src/consumers/startShareScreen';
import { canCaptureDisplayAudioOnPlatform } from '../src/consumers/screenAudio';
import { finishCustomScreenCapture, resolveScreenCapture } from '../src/consumers/screenCapture';
import { checkLimitsAndMakeRequest } from '../src/methods/utils/checkLimitsAndMakeRequest';
import {
  MediaSocketConnectError,
  describeMediaSocketError,
  isNetworkOnlyMediaSocketError,
  isRetryableMediaSocketError,
} from '../src/sockets/mediaSocketErrors';
import { connectSocket } from '../src/sockets/SocketManager';
import { getDomains } from '../src/producers/socketReceiveMethods/getDomains';

const setPlatform = (os: string) => jest.replaceProperty(Platform, 'OS', os as any);

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

// ---------------------------------------------------------------------------------------------------------------
// Screen audio: listen side
// ---------------------------------------------------------------------------------------------------------------

describe('consumerResume: screen audio', () => {
  const buildParameters = (overrides: Record<string, any> = {}) => {
    const state: Record<string, any> = {
      nStream: null,
      allAudioStreams: [],
      allVideoStreams: [],
      streamNames: [],
      audStreamNames: [],
      updateMainWindow: false,
      shared: false,
      shareScreenStarted: false,
      screenId: '',
      participants: [
        { name: 'alice', audioID: 'mic-1', videoID: '', ScreenID: 'screen-1', ScreenOn: true, ScreenAudioID: 'sa-1' },
        { name: 'bob', audioID: 'mic-2', videoID: '' },
      ],
      eventType: 'conference',
      meetingDisplayType: 'media',
      mainScreenFilled: false,
      first_round: false,
      lock_screen: false,
      oldAllStreams: [],
      adminVidID: '',
      mainHeightWidth: 0,
      member: 'bob',
      audioOnlyStreams: [],
      gotAllVids: false,
      defer_receive: false,
      firstAll: false,
      remoteScreenStream: [],
      hostLabel: 'host',
      whiteboardStarted: false,
      whiteboardEnded: false,
      ...overrides,
    };
    const updaters = [
      'updateUpdateMainWindow', 'updateAllAudioStreams', 'updateAllVideoStreams', 'updateStreamNames',
      'updateAudStreamNames', 'updateNStream', 'updateMainHeightWidth', 'updateLock_screen', 'updateFirstAll',
      'updateRemoteScreenStream', 'updateOldAllStreams', 'updateAudioOnlyStreams', 'updateShareScreenStarted',
      'updateGotAllVids', 'updateScreenId', 'updateDefer_receive',
    ];
    for (const name of updaters) {state[name] = jest.fn();}
    state.reorderStreams = jest.fn();
    state.prepopulateUserMedia = jest.fn();
    state.getUpdatedAllParams = () => state;
    return state;
  };

  const resume = (parameters: any, remoteProducerId: string, appData: Record<string, unknown> = {}) =>
    consumerResume({
      track: { kind: 'audio', enabled: true } as any,
      remoteProducerId,
      params: { kind: 'audio' } as any,
      parameters,
      nsock: {} as any,
      consumer: { appData, rtpReceiver: null } as any,
    } as any);

  it('plays a tagged screen-audio producer without speaker state', async () => {
    const parameters = buildParameters();
    markScreenAudioProducer('tagged-1', 'screen-audio');
    await resume(parameters, 'tagged-1');
    forgetScreenAudioProducer('tagged-1');

    expect(parameters.updateAudioOnlyStreams).toHaveBeenCalledTimes(1);
    const players = parameters.updateAudioOnlyStreams.mock.calls[0][0];
    expect(players).toHaveLength(1);
    expect(players[0].type).toBe(ScreenAudioPlayer);
    expect(players[0].props.remoteProducerId).toBe('tagged-1');
    expect(players[0].props.ownerName).toBe('alice'); // falls back to the participant sharing the screen
    expect(parameters.updateAllAudioStreams.mock.calls[0][0]).toEqual([
      expect.objectContaining({ producerId: 'tagged-1' }),
    ]);
    expect(parameters.updateAudStreamNames).not.toHaveBeenCalled();
    expect(parameters.prepopulateUserMedia).not.toHaveBeenCalled();
    expect(parameters.reorderStreams).not.toHaveBeenCalled();
  });

  it('recognises the sharer by ScreenAudioID and by consumer appData', async () => {
    const byRoster = buildParameters();
    await resume(byRoster, 'sa-1');
    expect(byRoster.updateAudioOnlyStreams.mock.calls[0][0][0].type).toBe(ScreenAudioPlayer);
    expect(byRoster.updateAudioOnlyStreams.mock.calls[0][0][0].props.ownerName).toBe('alice');
    expect(byRoster.updateAudStreamNames).not.toHaveBeenCalled();

    const byAppData = buildParameters();
    await resume(byAppData, 'app-1', { mediaTag: 'screen-audio' });
    expect(byAppData.updateAudioOnlyStreams.mock.calls[0][0][0].type).toBe(ScreenAudioPlayer);
    expect(byAppData.prepopulateUserMedia).not.toHaveBeenCalled();
  });

  it('replaces an existing player for the same producer instead of adding a second one', async () => {
    const parameters = buildParameters({
      audioOnlyStreams: [<React.Fragment key="sa-1" />, <React.Fragment key="other" />],
    });
    await resume(parameters, 'sa-1');
    const players = parameters.updateAudioOnlyStreams.mock.calls[0][0];
    expect(players.map((p: any) => p.key)).toEqual(['other', 'sa-1']);
  });

  it('keeps a microphone producer on the participant path', async () => {
    const parameters = buildParameters();
    await resume(parameters, 'mic-1');
    const players = parameters.updateAudioOnlyStreams.mock.calls[0]?.[0] || [];
    expect(players.some((p: any) => p.type === ScreenAudioPlayer)).toBe(false);
    expect(parameters.updateAudStreamNames).toHaveBeenCalled();
  });
});

describe('ScreenAudioPlayer', () => {
  it('labels the card, shows it while sound plays and mutes only locally', async () => {
    jest.useFakeTimers();
    const track = { kind: 'audio', enabled: true };
    const stream: any = { getAudioTracks: () => [track], toURL: () => 'url' };
    let level = 0.2;
    const consumer = {
      rtpReceiver: {
        getStats: jest.fn(async () => new Map([['a', { type: 'inbound-rtp', kind: 'audio', audioLevel: level }]])),
      },
    };

    let tree: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(
        <ScreenAudioPlayer stream={stream} remoteProducerId="sa-1" consumer={consumer} ownerName="alice" />,
      );
    });
    const card = () => tree!.root.findByType(MiniAudio);
    expect(card().props.name).toBe('alice · Screen audio');
    expect(card().props.visible).toBe(false);

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(card().props.visible).toBe(true);
    expect(card().props.showWaveform).toBe(true);

    act(() => card().props.onPress());
    expect(track.enabled).toBe(false);
    expect(card().props.name).toBe('alice · Screen audio (muted)');

    level = 0; // silence: a muted card stays visible so it can be unmuted
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(card().props.visible).toBe(true);
    expect(card().props.showWaveform).toBe(false);

    act(() => card().props.onPress());
    expect(track.enabled).toBe(true);
    expect(card().props.visible).toBe(false);
    act(() => tree!.unmount());
  }, 20000); // the waveform animation makes fake-timer steps slow

  it('formats the label without an owner', () => {
    expect(screenAudioLabel('', false)).toBe('Screen audio');
    expect(screenAudioLabel(undefined, true)).toBe('Screen audio (muted)');
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Screen audio: capture gate and prompt
// ---------------------------------------------------------------------------------------------------------------

describe('startShareScreen: screen-audio gate', () => {
  const buildParameters = (overrides: Record<string, any> = {}) => {
    const getDisplayMedia = jest.fn(async () => ({ id: 'screen-stream' }));
    return {
      shared: false,
      showAlert: jest.fn(),
      updateShared: jest.fn(),
      mediaDevices: { getDisplayMedia },
      onWeb: true,
      supportsScreenAudio: true,
      screenAudioEnabled: true,
      screenAudioMode: 'ask',
      streamSuccessScreen: jest.fn(async () => {}),
      getUpdatedAllParams: () => ({}),
      ...overrides,
    } as any;
  };
  const requestedAudio = (parameters: any) => parameters.mediaDevices.getDisplayMedia.mock.calls[0][0].audio;

  it('never requests display audio or prompts on native, even if the app claims capture', async () => {
    setPlatform('android');
    const screenAudioPrompt = jest.fn(async () => 'audio' as const);
    const parameters = buildParameters({ displayAudioCapable: true, screenAudioPrompt });
    await startShareScreen({ parameters });
    expect(screenAudioPrompt).not.toHaveBeenCalled();
    expect(requestedAudio(parameters)).toBe(false);
    expect(parameters.updateShared).toHaveBeenLastCalledWith(true);
  });

  it('asks on the web and honours each answer', async () => {
    setPlatform('web');
    for (const [choice, audio] of [['audio', true], ['video', false]] as const) {
      const parameters = buildParameters({ displayAudioCapable: true, screenAudioPrompt: jest.fn(async () => choice) });
      await startShareScreen({ parameters });
      expect(parameters.screenAudioPrompt).toHaveBeenCalledTimes(1);
      expect(Boolean(requestedAudio(parameters))).toBe(audio);
    }

    const cancelled = buildParameters({ displayAudioCapable: true, screenAudioPrompt: jest.fn(async (): Promise<null> => null) });
    await startShareScreen({ parameters: cancelled });
    expect(cancelled.mediaDevices.getDisplayMedia).not.toHaveBeenCalled();
    expect(cancelled.updateShared).toHaveBeenLastCalledWith(false);
  });

  it('skips the prompt for always/never and without server support', async () => {
    setPlatform('web');
    const always = buildParameters({ displayAudioCapable: true, screenAudioMode: 'always', screenAudioPrompt: jest.fn() });
    await startShareScreen({ parameters: always });
    expect(always.screenAudioPrompt).not.toHaveBeenCalled();
    expect(Boolean(requestedAudio(always))).toBe(true);

    const never = buildParameters({ displayAudioCapable: true, screenAudioMode: 'never', screenAudioPrompt: jest.fn() });
    await startShareScreen({ parameters: never });
    expect(never.screenAudioPrompt).not.toHaveBeenCalled();
    expect(requestedAudio(never)).toBe(false);

    const oldServer = buildParameters({ displayAudioCapable: true, supportsScreenAudio: false, screenAudioPrompt: jest.fn() });
    await startShareScreen({ parameters: oldServer });
    expect(oldServer.screenAudioPrompt).not.toHaveBeenCalled();
    expect(requestedAudio(oldServer)).toBe(false);
  });

  it('detects capture only on a Chromium desktop browser running React Native Web', () => {
    const original = (globalThis as any).navigator;
    try {
      (globalThis as any).navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/130.0 Safari/537.36' };
      expect(canCaptureDisplayAudioOnPlatform('web')).toBe(true);
      expect(canCaptureDisplayAudioOnPlatform('ios')).toBe(false);
      expect(canCaptureDisplayAudioOnPlatform('android')).toBe(false);
      (globalThis as any).navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; rv:131.0) Gecko/20100101 Firefox/131.0' };
      expect(canCaptureDisplayAudioOnPlatform('web')).toBe(false);
      (globalThis as any).navigator = { product: 'ReactNative' };
      expect(canCaptureDisplayAudioOnPlatform('web')).toBe(false);
    } finally {
      (globalThis as any).navigator = original;
    }
  });
});

describe('ScreenAudioPrompt', () => {
  it('resolves the choice through the mounted host on the web', async () => {
    setPlatform('web');
    let tree: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<ScreenAudioPromptHost isDarkMode />);
    });
    let pending!: Promise<any>;
    act(() => {
      pending = promptScreenAudioChoice();
    });
    const prompt = tree!.root.findByType(ScreenAudioPrompt);
    expect(prompt.props.isVisible).toBe(true);
    act(() => tree!.root.findByProps({ testID: 'screen-audio-prompt-video' }).props.onPress());
    await expect(pending).resolves.toBe('video');
    expect(tree!.root.findAllByType(ScreenAudioPrompt)).toHaveLength(0);

    act(() => {
      pending = promptScreenAudioChoice();
    });
    act(() => tree!.root.findByType(ScreenAudioPrompt).props.onChoose(null)); // Esc / back / backdrop
    await expect(pending).resolves.toBeNull();
    act(() => tree!.unmount());
  }, 20000);

  it('leaves the choice to the browser picker when no host is mounted', async () => {
    await expect(promptScreenAudioChoice()).resolves.toBe('audio');
  });

  it('uses the teal accent and no purple', () => {
    let tree: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<ScreenAudioPrompt onChoose={() => {}} isDarkMode={false} />);
    });
    const json = JSON.stringify(tree!.toJSON());
    expect(json).toContain('#0d9488');
    expect(json).not.toMatch(/#(6366f1|4f46e5|7c3aed|8b5cf6|a855f7|9333ea)/i);
    act(() => tree!.unmount());
  });
});

describe('custom screen capture (uiOverrides.screenCapture)', () => {
  const makeStream = (withAudio = false) => {
    const audioTrack = { kind: 'audio', stop: jest.fn() };
    const tracks: any[] = [{ kind: 'video' }];
    if (withAudio) {tracks.push(audioTrack);}
    const stream: any = {
      getAudioTracks: () => tracks.filter((t) => t.kind === 'audio'),
      getVideoTracks: () => tracks.filter((t) => t.kind === 'video'),
      removeTrack: (t: any) => tracks.splice(tracks.indexOf(t), 1),
    };
    return { stream, audioTrack };
  };
  const buildParameters = (overrides: Record<string, any> = {}) => ({
    shared: false,
    showAlert: jest.fn(),
    updateShared: jest.fn(),
    mediaDevices: {},
    onWeb: false,
    socket: {},
    targetWidth: 1920,
    targetHeight: 1080,
    supportsScreenAudio: true,
    screenAudioMode: 'ask',
    streamSuccessScreen: jest.fn(async () => {}),
    getUpdatedAllParams: () => ({}),
    ...overrides,
  }) as any;

  it('keeps the old native behaviour without an override', async () => {
    setPlatform('ios');
    const parameters = buildParameters();
    await startShareScreen({ parameters });
    expect(parameters.showAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'You cannot share screen while on mobile',
    }));
    expect(parameters.streamSuccessScreen).not.toHaveBeenCalled();
  });

  it('publishes the stream from a capture function on native', async () => {
    setPlatform('android');
    const { stream } = makeStream();
    const capture = jest.fn(async () => stream);
    const parameters = buildParameters({ screenCapture: capture });
    await startShareScreen({ parameters });
    expect(capture).toHaveBeenCalledWith({ width: 1920, height: 1080, frameRate: 30, audio: false, platform: 'android' });
    expect(parameters.streamSuccessScreen).toHaveBeenCalledWith(expect.objectContaining({ stream }));
    expect(parameters.updateShared).toHaveBeenLastCalledWith(true);
    expect(parameters.showAlert).not.toHaveBeenCalled();
  });

  it('treats null as cancel and a throw as a failed share', async () => {
    setPlatform('ios');
    const cancelled = buildParameters({ screenCapture: async (): Promise<null> => null });
    await startShareScreen({ parameters: cancelled });
    expect(cancelled.streamSuccessScreen).not.toHaveBeenCalled();
    expect(cancelled.updateShared).toHaveBeenLastCalledWith(false);
    expect(cancelled.showAlert).not.toHaveBeenCalled();

    jest.spyOn(console, 'log').mockImplementation(() => {});
    const failed = buildParameters({ screenCapture: async () => { throw new Error('denied'); } });
    await startShareScreen({ parameters: failed });
    expect(failed.streamSuccessScreen).not.toHaveBeenCalled();
    expect(failed.showAlert).toHaveBeenCalledWith(expect.objectContaining({ message: 'Could not share screen, check and retry' }));
  });

  it('asks about audio only for captures that support it, and drops audio when declined', async () => {
    setPlatform('android');
    const withAudio = makeStream(true);
    const getDisplayMedia = jest.fn(async () => withAudio.stream);
    const screenAudioPrompt = jest.fn(async () => 'video' as const);
    const parameters = buildParameters({ screenCapture: { getDisplayMedia, supportsAudio: true }, screenAudioPrompt });
    await startShareScreen({ parameters });
    expect(screenAudioPrompt).toHaveBeenCalledTimes(1);
    expect((getDisplayMedia.mock.calls[0] as any[])[0].audio).toBe(false);
    expect(withAudio.stream.getAudioTracks()).toHaveLength(0);
    expect(withAudio.audioTrack.stop).toHaveBeenCalled();

    const accepted = makeStream(true);
    const yes = buildParameters({
      screenCapture: { getDisplayMedia: jest.fn(async () => accepted.stream), supportsAudio: true },
      screenAudioPrompt: jest.fn(async () => 'audio' as const),
    });
    await startShareScreen({ parameters: yes });
    expect(accepted.stream.getAudioTracks()).toHaveLength(1);

    const noAudioSupport = buildParameters({ screenCapture: jest.fn(async () => makeStream().stream), screenAudioPrompt: jest.fn() });
    await startShareScreen({ parameters: noAudioSupport });
    expect(noAudioSupport.screenAudioPrompt).not.toHaveBeenCalled();
  });

  it('calls onStop once when the share ends', async () => {
    setPlatform('android');
    const { stream } = makeStream();
    const onStop = jest.fn();
    const parameters = buildParameters({ screenCapture: { getDisplayMedia: async () => stream, onStop } });
    await startShareScreen({ parameters });
    await finishCustomScreenCapture(parameters);
    await finishCustomScreenCapture(parameters);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledWith(stream);
  });

  it('accepts only usable overrides', () => {
    expect(resolveScreenCapture(undefined)).toBeNull();
    expect(resolveScreenCapture({} as any)).toBeNull();
    const fn = async (): Promise<null> => null;
    expect(resolveScreenCapture(fn)?.getDisplayMedia).toBe(fn);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Connection rejection and typed connect errors
// ---------------------------------------------------------------------------------------------------------------

describe('connectSocket: typed errors', () => {
  const apiKey = 'a'.repeat(64);
  let socketsBefore = 0;
  const attempt = () => {
    socketsBefore = mockIoSockets.length;
    const pending = connectSocket({ apiUserName: 'room1', apiKey, link: 'https://media.example' });
    pending.catch(() => {}); // asserted below; avoid an unhandled rejection in between
    return pending;
  };
  // connectSocket opens the socket after a few microtasks.
  const newSocket = async () => {
    for (let i = 0; i < 50 && mockIoSockets.length === socketsBefore; i += 1) {await Promise.resolve();}
    return mockIoSockets[mockIoSockets.length - 1];
  };

  it('turns connection-rejected into a non-retryable rejected error and disconnects once', async () => {
    const pending = attempt();
    const socket = await newSocket();
    socket.fire('connect');
    socket.fire('connection-rejected', { reason: 'invalid-credentials', stage: 'api-check-rejected' });
    socket.fire('disconnect', 'io server disconnect');
    const error: any = await pending.catch((e) => e);
    expect(error).toBeInstanceOf(MediaSocketConnectError);
    expect(error.phase).toBe('rejected');
    expect(error.reason).toBe('invalid-credentials');
    expect(error.stage).toBe('api-check-rejected');
    expect(error.retryable).toBe(false);
    expect(isRetryableMediaSocketError(error)).toBe(false);
    expect(error.message).toMatch(/^Media server rejected the connection: invalid-credentials \(phase: rejected/);
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });

  it('maps unknown reasons to rejected-before-connection-success (retryable)', async () => {
    const pending = attempt();
    (await newSocket()).fire('connection-rejected', { reason: 'something-new' });
    const error: any = await pending.catch((e) => e);
    expect(error.reason).toBe('rejected-before-connection-success');
    expect(error.retryable).toBe(true);
  });

  it('tells before-open from after-open', async () => {
    const before = attempt();
    (await newSocket()).fire('connect_error', new Error('websocket error'));
    const beforeError: any = await before.catch((e) => e);
    expect(beforeError.phase).toBe('before-open');
    expect(typeof beforeError.elapsedMs).toBe('number');
    expect(beforeError.transportError).toBe('websocket error');
    expect(beforeError.message).toMatch(/^Error connecting to media socket: websocket error \(phase: before-open, after \d+ ms/);

    const after = attempt();
    const afterSocket = await newSocket();
    afterSocket.fire('connect');
    afterSocket.fire('disconnect', 'io server disconnect');
    const afterError: any = await after.catch((e) => e);
    expect(afterError.phase).toBe('after-open');
    expect(afterError.transportError).toBe('io server disconnect');
  });
});

describe('checkLimitsAndMakeRequest: join page messages', () => {
  const buildParameters = (error: unknown) => ({
    showAlert: jest.fn(),
    updateIsLoadingModalVisible: jest.fn(),
    connectSocket: jest.fn(() => Promise.reject(error)),
  }) as any;

  beforeEach(async () => {
    jest.useFakeTimers(); // the join request races a 10 s timeout that outlives the rejection
    await AsyncStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const run = (parameters: any) => checkLimitsAndMakeRequest({
    apiUserName: 'room1', apiToken: 'secret', link: 'https://media.example', userName: 'bob', parameters,
  });

  it('shows the credential sentence and counts a rejected attempt', async () => {
    const parameters = buildParameters(new MediaSocketConnectError({
      phase: 'rejected', reason: 'invalid-credentials', stage: 'api-check-rejected', elapsedMs: 92,
    }));
    await run(parameters);
    expect(parameters.showAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'The room did not accept these credentials. Check the room ID and your access, or rejoin the room.',
    }));
    expect(await AsyncStorage.getItem('unsuccessfulAttempts')).toBe('1');
    expect(parameters.updateIsLoadingModalVisible).toHaveBeenLastCalledWith(false);
  });

  it('shows the offline sentence and does not count a network-only failure', async () => {
    const error = new MediaSocketConnectError({
      phase: 'before-open', elapsedMs: 312, online: false, transportError: 'websocket error',
    });
    expect(isNetworkOnlyMediaSocketError(error)).toBe(true);
    const parameters = buildParameters(error);
    await run(parameters);
    expect(parameters.showAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'You appear to be offline. Check your internet connection and try again.',
    }));
    expect(await AsyncStorage.getItem('unsuccessfulAttempts')).toBeNull();
  });

  it('keeps the generic sentence for unknown failures', () => {
    expect(describeMediaSocketError(new Error('boom'))).toBe('Unable to connect. Check your credentials and try again.');
    expect(describeMediaSocketError(new MediaSocketConnectError({ phase: 'rejected', reason: 'meeting-minutes-unavailable', elapsedMs: 1 })))
      .toBe('This room cannot start because its account has no meeting minutes left. Contact the room host.');
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Consumer backup preference
// ---------------------------------------------------------------------------------------------------------------

describe('consumer backup preference', () => {
  afterEach(() => forgetConsumerBackups());

  it('learns the backup map from getDomains and delays only with a connected backup', async () => {
    const connectIps = jest.fn(async () => [[], []] as any);
    const parameters: any = {
      roomRecvIPs: ['busy'],
      consume_sockets: [],
      connectIps,
      getUpdatedAllParams: () => parameters,
    };
    await getDomains({
      domains: ['busy', 'same'],
      alt_domains: { busy: 'backup', same: 'same' },
      apiUserName: 'room1', apiKey: '', apiToken: 'secret',
      parameters,
    });
    expect(connectIps).toHaveBeenCalledWith(expect.objectContaining({ remIP: ['backup', 'same'] }));

    expect(consumerBackupPreferDelay('busy', [])).toBe(0); // backup not connected yet
    const sockets = [{ backup: { connected: true } }];
    expect(consumerBackupPreferDelay('busy', sockets)).toBe(1500);
    expect(consumerBackupPreferDelay('backup', sockets)).toBe(0);
    expect(consumerBackupPreferDelay('same', sockets)).toBe(0); // x: x is ignored
    expect(consumerBackupPreferDelay('unknown', sockets)).toBe(0);
  });
});
