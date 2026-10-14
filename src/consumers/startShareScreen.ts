import { Platform } from 'react-native';
import { startShareScreen as sharedStartShareScreen } from 'mediasfu-shared';
import { StreamSuccessScreenType, StreamSuccessScreenParameters, ShowAlert, MediaDevices as RNMediaDevices} from '../@types/types';
import { canCaptureDisplayAudioOnPlatform, ScreenAudioChoice, ScreenAudioMode } from './screenAudio';
import { promptScreenAudioChoice } from '../components/miscComponents/ScreenAudioPrompt';
import { resolveScreenCapture, startCustomScreenCapture, ScreenCaptureOverride } from './screenCapture';


export interface StartShareScreenParameters extends StreamSuccessScreenParameters {
  shared: boolean;
  showAlert?: ShowAlert;
  updateShared: (shared: boolean) => void;
  mediaDevices: MediaDevices | RNMediaDevices;
  onWeb: boolean;
  targetWidth?: number;
  targetHeight?: number;

  /** Set from the join response: the media server accepts screen audio. */
  supportsScreenAudio?: boolean;
  /** Ask for the screen's audio too (default true). */
  screenAudioEnabled?: boolean;
  /** `ask` (default) shows "Screen + audio" / "Screen only" first, `always` requests audio, `never` shares video only. */
  screenAudioMode?: ScreenAudioMode;
  /** Replace the "share audio too?" dialog: resolve `audio`, `video` or `null` (cancel). */
  screenAudioPrompt?: () => Promise<ScreenAudioChoice>;
  /**
   * Whether this platform can capture display audio. Defaults to React Native Web on a Chromium desktop browser;
   * always false on Android and iOS.
   */
  displayAudioCapable?: boolean;
  /** App-supplied screen capture (`uiOverrides.screenCapture`); used on every platform when set. */
  screenCapture?: ScreenCaptureOverride | null;

  // mediasfu functions
  streamSuccessScreen: StreamSuccessScreenType;
  [key: string]: any;
}

export interface StartShareScreenOptions {
  parameters: StartShareScreenParameters;
}

// Export the type definition for the function
export type StartShareScreenType = (options: StartShareScreenOptions) => Promise<void>;

/**
 * Starts the screen sharing process.
 *
 * @param {StartShareScreenOptions} options - The options for starting screen sharing.
 * @param {Object} options.parameters - The parameters for screen sharing.
 * @param {boolean} options.parameters.shared - Indicates if the screen is currently being shared.
 * @param {Function} options.parameters.showAlert - Function to show alert messages.
 * @param {Function} options.parameters.updateShared - Function to update the shared state.
 * @param {MediaDevices} options.parameters.mediaDevices - The media devices available for screen sharing.
 * @param {boolean} options.parameters.onWeb - Indicates if the application is running on a web platform.
 * @param {number} [options.parameters.targetWidth] - The target width for screen sharing.
 * @param {number} [options.parameters.targetHeight] - The target height for screen sharing.
 * @param {Function} options.parameters.streamSuccessScreen - Function to handle successful screen sharing.
 *
 * @returns {Promise<void>} A promise that resolves when the screen sharing process is complete.
 *
 * @throws Will log an error message if there is an issue starting the screen share.
 *
 * @example
 * const options = {
 *   parameters: {
 *     shared: false,
 *     showAlert: showAlertFunction,
 *     updateShared: updateSharedFunction,
 *     mediaDevices: navigator.mediaDevices,
 *     onWeb: true,
 *     targetWidth: 1280,
 *     targetHeight: 720,
 *     streamSuccessScreen: streamSuccessFunction,
 *   },
 * };
 *
 * startShareScreen(options)
 *   .then(() => {
 *     console.log('Screen sharing started successfully');
 *   })
 *   .catch(error => {
 *     console.error('Error starting screen share:', error);
 *   });
 */

export const startShareScreen = async (options: StartShareScreenOptions): Promise<void> => {
  const { parameters } = options;
  // An app-supplied capture replaces the platform's own (and makes screen sharing possible on Android and iOS).
  const provider = resolveScreenCapture(parameters.screenCapture);
  if (provider) {
    await startCustomScreenCapture({ parameters: parameters as any, provider });
    return;
  }
  // Native builds never request display audio (and never show the prompt), even if a polyfill fakes a browser.
  const displayAudioCapable = Platform.OS === 'web'
    ? parameters.displayAudioCapable ?? canCaptureDisplayAudioOnPlatform()
    : false;
  const screenAudioPrompt = parameters.screenAudioPrompt
    ?? (() => promptScreenAudioChoice({ isDarkMode: parameters.isDarkModeValue }));
  await (sharedStartShareScreen as unknown as StartShareScreenType)({
    ...options,
    parameters: { ...parameters, displayAudioCapable, screenAudioPrompt },
  });
};
