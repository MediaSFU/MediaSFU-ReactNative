import { mixStreams as sharedMixStreams } from 'mediasfu-shared';
import { Stream, Participant } from '../@types/types';

export interface MixStreamsOptions {
  alVideoStreams: (Stream | Participant)[];
  non_alVideoStreams: Participant[];
  ref_participants: (Stream | Participant)[];
}

// Export the type definition for the function
export type MixStreamsType = (options: MixStreamsOptions) => Promise<(Stream | Participant)[]>;

/**
 * Mixes video and audio streams and participants based on specified parameters.
 *
 * @param {MixStreamsOptions} options - The options for mixing streams.
 * @param {Array} options.alVideoStreams - The list of audio and video streams to mix.
 * @param {Array} options.non_alVideoStreams - The list of non-audio and video streams to mix.
 * @param {Array} options.ref_participants - The list of reference participants to mix.
 * @returns {Promise<Array>} A promise that resolves with the mixed streams.
 * @throws Will throw an error if there is an issue mixing the streams.
 * @example
 * ```typescript
 * const mixedStreams = await mixStreams({
 *   alVideoStreams: [stream1, stream2],
 *   non_alVideoStreams: [participant1, participant2],
 *   ref_participants: [participant1, participant2],
 * });
 * console.log('Mixed streams:', mixedStreams);
 * ```
 */

export async function mixStreams(options: MixStreamsOptions): Promise<(Stream | Participant)[]> {
  return sharedMixStreams<Stream, Participant>(options);
}
