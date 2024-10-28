import { ShowAlert } from '../../@types/types';

export interface UserWaitingOptions {
  name: string;
  showAlert?: ShowAlert;
  totalReqWait: number;
  updateTotalReqWait: (total: number) => void;
}

// Export the type definition for the function
export type UserWaitingType = (options: UserWaitingOptions) => Promise<void>;

/**
 * Handles the event when a user joins the waiting room.
 *
 * @param {Object} options - The options for the user waiting event.
 * @param {string} options.name - The name of the user joining the waiting room.
 * @param {Function} options.showAlert - A function to display an alert/notification.
 * @param {number} options.totalReqWait - The current total number of requests waiting.
 * @param {Function} options.updateTotalReqWait - A function to update the total number of requests waiting.
 * @returns {Promise<void>} A promise that resolves when the user waiting event is handled.
 */
export const userWaiting = async ({
  name, showAlert, totalReqWait, updateTotalReqWait,
}: UserWaitingOptions): Promise<void> => {
  // Display an alert/notification about the user joining the waiting room
  showAlert?.({
    message: `${name} joined the waiting room.`,
    type: 'success',
    duration: 3000,
  });

  // Update the total number of requests waiting in the waiting room
  const totalReqs = totalReqWait + 1;
  updateTotalReqWait(totalReqs);
};
