import { Poll, ShowAlert, PollUpdatedData } from '../../@types/types';
import { pollUpdated as sharedPollUpdated } from 'mediasfu-shared';

export interface PollUpdatedOptions {
  data: PollUpdatedData;
  polls: Poll[];
  poll: Poll;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
  updatePolls: (polls: Poll[]) => void;
  updatePoll: (poll: Poll) => void;
  updateIsPollModalVisible: (isVisible: boolean) => void;
}

// Export the type definition for the function
export type PollUpdatedType = (options: PollUpdatedOptions) => Promise<void>;

/**
 * Updates the poll state based on the provided data.
 *
 * @param {Object} options - The options for updating the poll.
 * @param {any} options.data - The data containing poll information.
 * @param {any[]} options.polls - The current list of polls.
 * @param {any} options.poll - The current poll.
 * @param {string} options.member - The member identifier.
 * @param {string} options.islevel - The level of the member.
 * @param {Function} options.showAlert - Function to show alerts.
 * @param {Function} options.updatePolls - Function to update the list of polls.
 * @param {Function} options.updatePoll - Function to update the current poll.
 * @param {Function} options.updateIsPollModalVisible - Function to update the visibility of the poll modal.
 * @returns {Promise<void>} A promise that resolves when the poll update is complete.
 *
 * @example
 * ```typescript
 * await pollUpdated({
 *   data: { poll: updatedPoll, status: "started" },
 *   polls: currentPolls,
 *   poll: currentPoll,
 *   member: "user123",
 *   islevel: "1",
 *   showAlert: (alert) => console.log(alert.message),
 *   updatePolls: (polls) => setPolls(polls),
 *   updatePoll: (poll) => setCurrentPoll(poll),
 *   updateIsPollModalVisible: (visible) => setIsPollModalVisible(visible),
 * });
 * ```
 */

export const pollUpdated = async (options: PollUpdatedOptions): Promise<void> => {
  await sharedPollUpdated(options as any);
};
