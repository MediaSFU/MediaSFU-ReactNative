import { ShowAlert } from '../../@types/types';

export interface PersonJoinedOptions {
  showAlert?: ShowAlert;
  name: string;
}

// Export the type definition for the function
export type PersonJoinedType = (options: PersonJoinedOptions) => Promise<void>;

/**
 * Handles the event when a person joins.
 *
 * @param {PersonJoinedOptions} options - The options for the person joined event.
 * @param {string} options.name - The name of the person who joined.
 * @param {Function} options.showAlert - A function to display an alert/notification.
 * @returns {Promise<void>} A promise that resolves when the alert has been shown.
 */
export const personJoined = async ({ name, showAlert }: PersonJoinedOptions): Promise<void> => {
  // Display an alert/notification about the person joining the event
  showAlert?.({
    message: `${name} joined the event.`,
    type: 'success',
    duration: 3000,
  });
};
