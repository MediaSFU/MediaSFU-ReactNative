import { resumePauseAudioStreams as sharedResumePauseAudioStreams } from 'mediasfu-shared';
import {
  Participant, Stream, ProcessConsumerTransportsAudioType, ProcessConsumerTransportsAudioParameters, Transport, BreakoutParticipant, EventType,
} from '../@types/types';

export interface ResumePauseAudioStreamsParameters extends ProcessConsumerTransportsAudioParameters {
  breakoutRooms: BreakoutParticipant[][];
  ref_participants: Participant[];
  allAudioStreams: (Stream | Participant)[];
  participants: Participant[];
  islevel: string;
  eventType: EventType;
  consumerTransports: Transport[];
  limitedBreakRoom: BreakoutParticipant[];
  hostNewRoom: number;
  member: string;
  updateLimitedBreakRoom: (limitedBreakRoom: BreakoutParticipant[]) => void;

  // mediasfu functions
  processConsumerTransportsAudio: ProcessConsumerTransportsAudioType;
  getUpdatedAllParams: () => ResumePauseAudioStreamsParameters;
  [key: string]: any;
}

export interface ResumePauseAudioStreamsOptions {
  breakRoom?: number;
  inBreakRoom?: boolean;
  parameters: ResumePauseAudioStreamsParameters;
}

// Export the type definition for the function
export type ResumePauseAudioStreamsType = (
  options: ResumePauseAudioStreamsOptions
) => Promise<void>;

/**
 * Resumes or pauses audio streams based on the provided options.
 *
 * @param {ResumePauseAudioStreamsOptions} options - The options for resuming or pausing audio streams.
 * @param {number} [options.breakRoom=-1] - The ID of the break room.
 * @param {boolean} [options.inBreakRoom=false] - Indicates if the participant is in a break room.
 * @param {ResumePauseAudioStreamsParameters} options.parameters - The parameters required for processing audio streams.
 *
 * @returns {Promise<void>} A promise that resolves when the audio streams have been processed.
 *
 * @throws Will log an error message if there is an issue processing the audio streams.
 *
 * @example
 * ```typescript
 * await resumePauseAudioStreams({
 *   breakRoom: 1,
 *   inBreakRoom: true,
 *   parameters: {
 *     // ...parameters here
 *   },
 * });
 * ```
 */

export const resumePauseAudioStreams = async (
  options: ResumePauseAudioStreamsOptions,
): Promise<void> => {
  await sharedResumePauseAudioStreams(options);
};
