import { ShowAlert, SwitchUserVideoAltType, SwitchUserVideoParameters } from '../../@types/types';

export interface SwitchVideoAltParameters extends SwitchUserVideoParameters {

    recordStarted: boolean;
    recordResumed: boolean;
    recordStopped: boolean;
    recordPaused: boolean;
    recordingMediaOptions: string;
    videoAlreadyOn: boolean;
    currentFacingMode: string;
    prevFacingMode: string;
    allowed: boolean;
    audioOnlyRoom: boolean;
    updateCurrentFacingMode: (mode: string) => void;
    updatePrevFacingMode: (mode: string) => void;
    updateIsMediaSettingsModalVisible: (isVisible: boolean) => void;
    showAlert?: ShowAlert

    // mediasfu functions
    switchUserVideoAlt: SwitchUserVideoAltType;

    getUpdatedAllParams: () => SwitchVideoAltParameters;
    [key: string]: any;
}

export interface SwitchVideoAltOptions {
    parameters: SwitchVideoAltParameters;
}

// Export the type definition for the function
export type SwitchVideoAltType = (options: SwitchVideoAltOptions) => Promise<void>;

/**
 * Switches the user's video device with alternate logic, taking into account recording state and camera access permissions.
 * @function
 * @async
 * @param {SwitchVideoAltParams} options - The parameters object containing necessary variables.
 */
export const switchVideoAlt = async ({ parameters }: SwitchVideoAltOptions): Promise<void> => {
  let {
    recordStarted,
    recordResumed,
    recordStopped,
    recordPaused,
    recordingMediaOptions,
    videoAlreadyOn,
    currentFacingMode,
    prevFacingMode,
    allowed,
    audioOnlyRoom,
    updateCurrentFacingMode,
    updateIsMediaSettingsModalVisible,
    updatePrevFacingMode,

    showAlert,

    // media functions
    switchUserVideoAlt,
  } = parameters;

  if (audioOnlyRoom) {
    showAlert?.({
      message: 'You cannot turn on your camera in an audio-only event.',
      type: 'danger',
      duration: 3000,
    });
    return;
  }

  let checkoff = false;
  if ((recordStarted || recordResumed) && !recordStopped && !recordPaused && recordingMediaOptions === 'video') {
    checkoff = true;
  }

  if (!allowed) {
    showAlert?.({
      message: 'Allow access to your camera by starting it for the first time.',
      type: 'danger',
      duration: 3000,
    });
    return;
  }

  if (checkoff) {
    if (videoAlreadyOn) {
      showAlert?.({
        message: 'Please turn off your video before switching.',
        type: 'danger',
        duration: 3000,
      });
      return;
    }
  } else if (!videoAlreadyOn) {
    showAlert?.({
      message: 'Please turn on your video before switching.',
      type: 'danger',
      duration: 3000,
    });
    return;
  }

  // Camera switching logic
  prevFacingMode = currentFacingMode;
  updatePrevFacingMode(prevFacingMode);

  currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
  updateCurrentFacingMode(currentFacingMode);

  updateIsMediaSettingsModalVisible(false);
  await switchUserVideoAlt({ videoPreference: currentFacingMode, checkoff, parameters });
};
