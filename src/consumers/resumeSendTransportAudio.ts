import { Producer } from 'mediasoup-client/lib/types';
import { PrepopulateUserMediaParameters, PrepopulateUserMediaType } from '../@types/types';

export interface ResumeSendTransportAudioParameters extends PrepopulateUserMediaParameters {
  audioProducer: Producer | null;
  islevel: string;
  hostLabel: string;
  lock_screen: boolean;
  shared: boolean;
  videoAlreadyOn: boolean;
  updateAudioProducer: (audioProducer: Producer | null) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  // mediasfu functions
  prepopulateUserMedia: PrepopulateUserMediaType;
  [key: string]: any;
}

export interface ResumeSendTransportAudioOptions {
  parameters: ResumeSendTransportAudioParameters;
}

// Export the type definition for the function
export type ResumeSendTransportAudioType = (options: ResumeSendTransportAudioOptions) => Promise<void>;

/**
 * Resumes the send transport for audio and updates the UI and audio producer state accordingly.
 *
 * @param {ResumeSendTransportAudioOptions} options - The options for resuming the send transport.
 * @param {Object} options.parameters - The parameters required for resuming the send transport.
 * @param {Producer} options.parameters.audioProducer - The audio producer to be resumed.
 * @param {string} options.parameters.islevel - The level of the user.
 * @param {string} options.parameters.hostLabel - The label of the host.
 * @param {boolean} options.parameters.lock_screen - Indicates if the screen is locked.
 * @param {boolean} options.parameters.shared - Indicates if the screen is shared.
 * @param {Function} options.parameters.updateAudioProducer - Function to update the audio producer state.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if the video is already on.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window state.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 *
 * @returns {Promise<void>} A promise that resolves when the send transport is resumed and the UI is updated.
 *
 * @throws {Error} Throws an error if there is an issue during the process of resuming the audio send transport.
 *
 * @example
 * ```typescript
 * await resumeSendTransportAudio({
 *   parameters: {
 *     audioProducer: producer,
 *     islevel: '1',
 *     hostLabel: 'Host',
 *     lock_screen: false,
 *     shared: false,
 *     updateAudioProducer: updateProducerFunction,
 *     videoAlreadyOn: false,
 *     updateUpdateMainWindow: updateWindowFunction,
 *     prepopulateUserMedia: prepopulateFunction,
 *   },
 * });
 * ```
 */

export const resumeSendTransportAudio = async ({
  parameters,
}: ResumeSendTransportAudioOptions): Promise<void> => {
  try {
    const {
      audioProducer,
      islevel,
      hostLabel,
      lock_screen,
      shared,
      updateAudioProducer,
      videoAlreadyOn,
      updateUpdateMainWindow,

      // mediasfu functions
      prepopulateUserMedia,
    } = parameters;

    // Resume send transport for audio
    audioProducer!.resume();

    // Update the UI
    if (!videoAlreadyOn && islevel === '2') {
      if (!lock_screen && !shared) {
        let updatedMainWindow = true;
        updateUpdateMainWindow(updatedMainWindow);
        await prepopulateUserMedia({ name: hostLabel, parameters });
        updatedMainWindow = false;
        updateUpdateMainWindow(updatedMainWindow);
      }
    }

    // Update audio producer state
    updateAudioProducer(audioProducer);
  } catch (error: any) {
    // Handle errors during the process of resuming the audio send transport
    throw new Error(
      `Error during resuming audio send transport: ${error.message}`,
    );
  }
};
