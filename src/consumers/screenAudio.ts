import { Platform } from 'react-native';
import { canCaptureDisplayAudio } from 'mediasfu-shared';

/**
 * Screen audio: the audio of a shared tab, window or screen, published as its own producer tagged
 * `appData.mediaTag === 'screen-audio'`. Listeners play it with a "<name> · Screen audio" card and never treat it as
 * the sharer's voice. The runtime lives in `mediasfu-shared`.
 *
 * Capture: only React Native Web on a Chromium desktop browser can share tab or screen audio. Native Android and iOS
 * builds share no screen audio (and this SDK does not offer screen sharing on native), but always hear it from others.
 */
export {
  SCREEN_AUDIO_MEDIA_TAG,
  SCREEN_AUDIO_CODEC_OPTIONS,
  markScreenAudioProducer,
  forgetScreenAudioProducer,
  isScreenAudioProducer,
  shouldShareScreenAudio,
  canCaptureDisplayAudio,
  setScreenAudioPaused,
  buildDisplayMediaOptions,
  rememberScreenAudioProducer,
  recallScreenAudioProducer,
  setScreenAudioVolume,
  connectSendTransportScreenAudio,
  disconnectSendTransportScreenAudio,
  toggleScreenAudio,
} from 'mediasfu-shared';
export type {
  IsScreenAudioProducerOptions,
  ScreenAudioMode,
  ScreenAudioSettings,
  ScreenAudioChoice,
  DisplayMediaOptionsInput,
  ScreenAudioParameters,
  ConnectSendTransportScreenAudioOptions,
  ConnectSendTransportScreenAudioType,
  DisconnectSendTransportScreenAudioOptions,
  DisconnectSendTransportScreenAudioType,
  ToggleScreenAudioOptions,
} from 'mediasfu-shared';

/**
 * Whether this app can capture the audio of a shared screen: React Native Web on a Chromium desktop browser only.
 * Native builds return false (Android `AudioPlaybackCapture` and iOS ReplayKit app audio are not wired up).
 */
export const canCaptureDisplayAudioOnPlatform = (os: string = Platform.OS): boolean =>
  os === 'web' && canCaptureDisplayAudio();
