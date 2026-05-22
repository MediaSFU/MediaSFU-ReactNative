import {
  Participant, PrepopulateUserMediaParameters, PrepopulateUserMediaType, ReorderStreamsParameters, ReorderStreamsType,
} from '../../@types/types';
import { producerMediaResumed as sharedProducerMediaResumed } from 'mediasfu-shared';

export interface ProducerMediaResumedParameters extends PrepopulateUserMediaParameters, ReorderStreamsParameters {
  meetingDisplayType: string;
  participants: Participant[];
  shared: boolean;
  shareScreenStarted: boolean;
  mainScreenFilled: boolean;
  hostLabel: string;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  // mediasfu functions
  reorderStreams: ReorderStreamsType;
  prepopulateUserMedia: PrepopulateUserMediaType;

  getUpdatedAllParams: () => ProducerMediaResumedParameters;
  [key: string]: any;
}

export interface ProducerMediaResumedOptions {
  name: string;
  kind: 'audio';
  parameters: ProducerMediaResumedParameters;
}

// Export the type definition for the function
export type ProducerMediaResumedType = (options: ProducerMediaResumedOptions) => Promise<void>;

/**
 * Resumes media for a specific participant in a meeting.
 *
 * @param {ProducerMediaResumedOptions} options - The options for resuming media.
 * @param {string} options.name - The name of the participant whose media is to be resumed.
 * @param {ProducerMediaResumedParameters} options.parameters - The parameters related to the meeting and participants.
 * @param {string} options.parameters.meetingDisplayType - The type of meeting display.
 * @param {Participant[]} options.parameters.participants - The list of participants in the meeting.
 * @param {boolean} options.parameters.shared - Indicates if the screen is being shared.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.parameters.mainScreenFilled - Indicates if the main screen is filled.
 * @param {string} options.parameters.hostLabel - The label of the host.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window.
 * @param {Function} options.parameters.reorderStreams - Function to reorder the streams.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 *
 * @returns {Promise<void>} A promise that resolves when the media has been resumed.
 *
 * @example
 * ```typescript
 * const options = {
 *   name: "John Doe",
 *   kind: 'audio',
 *   parameters: {
 *     meetingDisplayType: "media",
 *     participants: [{ name: "John Doe", islevel: "2", videoID: "" }],
 *     shared: false,
 *     shareScreenStarted: false,
 *     mainScreenFilled: false,
 *     hostLabel: "Host",
 *     updateUpdateMainWindow: (update) => { console.log("Main window updated:", update); },
 *     reorderStreams: async (opts) => { console.log("Reordered streams:", opts); },
 *     prepopulateUserMedia: async (opts) => { console.log("Prepopulated user media:", opts); },
 *   },
 * };
 *
 * await producerMediaResumed(options);
 * ```
 */

export const producerMediaResumed = async ({
  name,
  kind,
  parameters,
}: ProducerMediaResumedOptions): Promise<void> => {
  return sharedProducerMediaResumed({
    name,
    kind,
    parameters,
  });
};
