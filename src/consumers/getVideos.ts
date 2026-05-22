import { getVideos as sharedGetVideos } from 'mediasfu-shared';
import { Stream, Participant } from '../@types/types';

export interface GetVideosOptions {
  participants: Participant[];
  allVideoStreams: (Stream | Participant)[];
  oldAllStreams: (Stream | Participant)[];
  adminVidID?: string;
  updateAllVideoStreams: (streams: (Stream | Participant)[]) => void;
  updateOldAllStreams: (streams: (Stream | Participant)[]) => void;
}

// Export the type definition for the function
export type GetVideosType = (options: GetVideosOptions) => Promise<void>;

/**
 * Asynchronously processes and updates video streams by filtering out the admin's video stream.
 *
 * @param {GetVideosOptions} options - The options for getting videos.
 * @param {Participant[]} options.participants - The list of participants.
 * @param {(Stream | Participant)[]} options.allVideoStreams - The list of all video streams.
 * @param {(Stream | Participant)[]} options.oldAllStreams - The list of old video streams.
 * @param {string} [options.adminVidID] - The ID of the admin's video stream.
 * @param {Function} options.updateAllVideoStreams - Function to update the state variable for all video streams.
 * @param {Function} options.updateOldAllStreams - Function to update the state variable for old video streams.
 *
 * @returns {Promise<void>} A promise that resolves when the video streams have been processed and updated.
 *
 * @throws {Error} Throws an error if an issue occurs while processing the streams.
 *
 * @example
 * const options = {
 *   participants: participantList,
 *   allVideoStreams: allStreams,
 *   oldAllStreams: oldStreams,
 *   adminVidID: 'admin-video-id',
 *   updateAllVideoStreams: (streams) => {
 *     console.log('All video streams updated:', streams);
 *   },
 *   updateOldAllStreams: (streams) => {
 *     console.log('Old video streams updated:', streams);
 *   },
 * };
 *
 * getVideos(options)
 *   .then(() => {
 *     console.log('Video streams processed successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error processing video streams:', error);
 *   });
 */

export const getVideos = async (options: GetVideosOptions): Promise<void> => {
  await (sharedGetVideos as unknown as GetVideosType)(options);
};
