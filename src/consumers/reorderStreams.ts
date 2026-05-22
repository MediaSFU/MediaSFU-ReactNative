import { reorderStreams as sharedReorderStreams } from 'mediasfu-shared';
import {
  Participant, Stream, ChangeVidsParameters, ChangeVidsType,
} from '../@types/types';

export interface ReorderStreamsParameters extends ChangeVidsParameters {
  allVideoStreams: (Stream | Participant)[];
  participants: Participant[];
  oldAllStreams: (Stream | Participant)[];
  screenId?: string;
  adminVidID?: string;
  newLimitedStreams: (Stream | Participant)[];
  newLimitedStreamsIDs: string[];
  activeSounds: string[];
  screenShareIDStream?: string;
  screenShareNameStream?: string;
  adminIDStream?: string;
  adminNameStream?: string;
  updateNewLimitedStreams: (streams: (Stream | Participant)[]) => void;
  updateNewLimitedStreamsIDs: (ids: string[]) => void;
  updateActiveSounds: (sounds: string[]) => void;
  updateScreenShareIDStream: (id: string) => void;
  updateScreenShareNameStream: (name: string) => void;
  updateAdminIDStream: (id: string) => void;
  updateAdminNameStream: (name: string) => void;
  updateYouYouStream: (streams: (Stream | Participant)[]) => void;

  // mediasfu functions
  changeVids: ChangeVidsType;
  getUpdatedAllParams: () => ReorderStreamsParameters;
  [key: string]: any;
}

export interface ReorderStreamsOptions {
  add?: boolean;
  screenChanged?: boolean;
  parameters: ReorderStreamsParameters;
}

export type ReorderStreamsType = (options: ReorderStreamsOptions) => Promise<void>;

/**
 * Reorders the video streams based on the provided options and updates the UI accordingly.
 *
 * @param {ReorderStreamsOptions} options - The options for reordering streams.
 * @param {boolean} [options.add=false] - Whether to add new streams or not.
 * @param {boolean} [options.screenChanged=false] - Whether the screen has changed or not.
 * @param {Object} options.parameters - The parameters required for reordering streams.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Array} options.parameters.allVideoStreams - Array of all video streams.
 * @param {Array} options.parameters.participants - Array of participants.
 * @param {Array} options.parameters.oldAllStreams - Array of old streams.
 * @param {string} options.parameters.screenId - ID of the screen.
 * @param {string} options.parameters.adminVidID - ID of the admin video.
 * @param {Array} options.parameters.newLimitedStreams - Array of new limited streams.
 * @param {Array} options.parameters.newLimitedStreamsIDs - Array of new limited stream IDs.
 * @param {Array} options.parameters.activeSounds - Array of active sounds.
 * @param {string} options.parameters.screenShareIDStream - ID of the screen share stream.
 * @param {string} options.parameters.screenShareNameStream - Name of the screen share stream.
 * @param {string} options.parameters.adminIDStream - ID of the admin stream.
 * @param {string} options.parameters.adminNameStream - Name of the admin stream.
 * @param {Function} options.parameters.updateNewLimitedStreams - Function to update new limited streams.
 * @param {Function} options.parameters.updateNewLimitedStreamsIDs - Function to update new limited stream IDs.
 * @param {Function} options.parameters.updateActiveSounds - Function to update active sounds.
 * @param {Function} options.parameters.updateScreenShareIDStream - Function to update screen share ID stream.
 * @param {Function} options.parameters.updateScreenShareNameStream - Function to update screen share name stream.
 * @param {Function} options.parameters.updateAdminIDStream - Function to update admin ID stream.
 * @param {Function} options.parameters.updateAdminNameStream - Function to update admin name stream.
 * @param {Function} options.parameters.updateYouYouStream - Function to update YouYou stream.
 * @param {Function} options.parameters.changeVids - Function to reflect changes on the UI.
 *
 * @returns {Promise<void>} A promise that resolves when the reordering is complete.
 *
 * @throws {Error} Throws an error if there is an issue updating the streams.
 *
 * @example
 * ```typescript
 * await reorderStreams({
 *   add: true,
 *   screenChanged: false,
 *   parameters: {
 *     allVideoStreams: [...],
 *     participants: [...],
 *     // additional parameters...
 *   },
 * });
 * ```
 */

export const reorderStreams = async (options: ReorderStreamsOptions): Promise<void> => {
  await sharedReorderStreams<ReorderStreamsParameters>(options);
};
