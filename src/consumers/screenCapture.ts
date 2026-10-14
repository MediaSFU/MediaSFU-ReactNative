import { Platform } from 'react-native';
import { shouldShareScreenAudio, ScreenAudioChoice, ScreenAudioMode } from './screenAudio';
import { promptScreenAudioChoice } from '../components/miscComponents/ScreenAudioPrompt';
import { MediaStream, ShowAlert } from '../@types/types';

/**
 * Bring-your-own screen capture.
 *
 * The SDK ships no screen capture for Android or iOS. An app that has its own (for example an Android MediaProjection
 * foreground service or an iOS ReplayKit broadcast extension feeding react-native-webrtc) passes it as
 * `uiOverrides.screenCapture`. The SDK then publishes the returned stream exactly like a browser screen share: screen
 * layout, annotation, recording layout, stop handling and, when the media server supports it, the stream's audio track
 * as screen audio. Without an override nothing changes.
 *
 * @example
 * ```tsx
 * <MediasfuGeneric
 *   uiOverrides={{
 *     screenCapture: {
 *       getDisplayMedia: async ({ width, height, audio }) => myCapture.start({ width, height, audio }),
 *       supportsAudio: Platform.OS === 'android',
 *       onStop: () => myCapture.stop(),
 *     },
 *   }}
 * />
 * ```
 */

export interface ScreenCaptureRequest {
  /** Requested size (from the room's screen-share resolution). */
  width: number;
  height: number;
  frameRate: number;
  /** True when the stream should include the screen's audio (server support, settings and the user's answer). */
  audio: boolean;
  /** `Platform.OS` at the time of the request. */
  platform: string;
}

/** Returns the stream to share, or `null` when the user cancelled. Throwing shows "Could not share screen". */
export type ScreenCaptureFunction = (request: ScreenCaptureRequest) => Promise<MediaStream | null>;

export interface ScreenCaptureProvider {
  getDisplayMedia: ScreenCaptureFunction;
  /**
   * The capture can include the screen's audio. Enables the "Share audio too?" question (mode `ask`) and
   * `request.audio`. Default false: any audio track in the returned stream is dropped.
   */
  supportsAudio?: boolean;
  /** Called once when the share stops by any path (button, host, track end). Release your capture here. */
  onStop?: (stream: MediaStream) => void | Promise<void>;
}

/** A provider object, or just the capture function. */
export type ScreenCaptureOverride = ScreenCaptureFunction | ScreenCaptureProvider;

export const resolveScreenCapture = (override?: ScreenCaptureOverride | null): ScreenCaptureProvider | null => {
  if (!override) {return null;}
  if (typeof override === 'function') {return { getDisplayMedia: override };}
  return typeof override.getDisplayMedia === 'function' ? override : null;
};

export interface CustomScreenCaptureParameters {
  shared: boolean;
  showAlert?: ShowAlert;
  updateShared: (shared: boolean) => void;
  targetWidth?: number;
  targetHeight?: number;
  supportsScreenAudio?: boolean;
  screenAudioEnabled?: boolean;
  screenAudioMode?: ScreenAudioMode;
  screenAudioPrompt?: () => Promise<ScreenAudioChoice>;
  isDarkModeValue?: boolean;
  socket?: object | null;
  streamSuccessScreen: (options: { stream: MediaStream; parameters: any }) => Promise<void>;
  [key: string]: any;
}

// Active custom captures, keyed by the room's producer socket, so `stopShareScreen` can call `onStop`.
const activeCaptures = new WeakMap<object, { provider: ScreenCaptureProvider; stream: MediaStream }>();
const captureKey = (parameters: { socket?: object | null }) => parameters.socket || null;

const dropAudioTracks = (stream: MediaStream) => {
  const source = stream as any;
  const tracks: any[] = typeof source.getAudioTracks === 'function' ? source.getAudioTracks() : [];
  for (const track of tracks) {
    try {
      source.removeTrack?.(track);
      track.stop?.();
    } catch {
      // Ignore: the stream is published without it either way.
    }
  }
};

/**
 * Starts a screen share from a custom capture: asks about audio when the capture supports it, gets the stream and hands
 * it to the normal publishing path (`streamSuccessScreen`).
 */
export const startCustomScreenCapture = async ({
  parameters,
  provider,
}: {
  parameters: CustomScreenCaptureParameters;
  provider: ScreenCaptureProvider;
}): Promise<void> => {
  const { showAlert, updateShared, screenAudioMode = 'ask' } = parameters;

  let audio = provider.supportsAudio === true && shouldShareScreenAudio(parameters);
  if (audio && screenAudioMode === 'ask') {
    const ask = parameters.screenAudioPrompt
      ?? (() => promptScreenAudioChoice({ isDarkMode: parameters.isDarkModeValue }));
    const choice = await ask();
    if (choice === null) {
      updateShared(false);
      return;
    }
    audio = choice === 'audio';
  }

  let stream: MediaStream | null = null;
  try {
    stream = await provider.getDisplayMedia({
      width: parameters.targetWidth ?? 1280,
      height: parameters.targetHeight ?? 720,
      frameRate: 30,
      audio,
      platform: Platform.OS,
    });
  } catch (error) {
    console.log('Custom screen capture failed', error);
    showAlert?.({ message: 'Could not share screen, check and retry', type: 'danger', duration: 3000 });
    updateShared(false);
    return;
  }
  if (!stream) {
    updateShared(false);
    return;
  }
  if (!audio) {dropAudioTracks(stream);}

  const key = captureKey(parameters);
  if (key) {activeCaptures.set(key, { provider, stream });}
  try {
    await parameters.streamSuccessScreen({ stream, parameters });
    updateShared(true);
  } catch (error) {
    console.log('Error publishing custom screen capture', error);
  }
};

/** Calls the custom capture's `onStop` once, after the share has stopped. */
export const finishCustomScreenCapture = async (parameters: { socket?: object | null }): Promise<void> => {
  const key = captureKey(parameters);
  const active = key ? activeCaptures.get(key) : undefined;
  if (!key || !active) {return;}
  activeCaptures.delete(key);
  try {
    await active.provider.onStop?.(active.stream);
  } catch (error) {
    console.log('Custom screen capture onStop failed', error);
  }
};
