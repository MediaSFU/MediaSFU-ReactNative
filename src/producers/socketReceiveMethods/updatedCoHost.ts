import { CoHostResponsibility, EventType, ShowAlert } from '../../@types/types';

export interface UpdatedCoHostOptions {
  coHost: string;
  coHostResponsibility: CoHostResponsibility[];
  showAlert?: ShowAlert;
  eventType: EventType;
  islevel: string;
  member: string;
  youAreCoHost: boolean;
  updateCoHost: (coHost: string) => void;
  updateCoHostResponsibility: (responsibility: CoHostResponsibility[]) => void;
  updateYouAreCoHost: (youAreCoHost: boolean) => void;
}

// Export the type definition for the function
export type UpdatedCoHostType = (options: UpdatedCoHostOptions) => Promise<void>;

/**
 * Updates the co-host information based on the provided options.
 *
 * @param {Object} options - The options for updating the co-host.
 * @param {string} options.coHost - The co-host identifier.
 * @param {string} options.coHostResponsibility - The responsibility of the co-host.
 * @param {Function} options.showAlert - Function to show an alert message.
 * @param {string} options.eventType - The type of event (e.g., "broadcast", "chat").
 * @param {string} options.islevel - The level of the event.
 * @param {string} options.member - The member identifier.
 * @param {boolean} options.youAreCoHost - Indicates if the current user is a co-host.
 * @param {Function} options.updateCoHost - Function to update the co-host.
 * @param {Function} options.updateCoHostResponsibility - Function to update the co-host responsibility.
 * @param {Function} options.updateYouAreCoHost - Function to update the co-host status of the current user.
 * @returns {Promise<void>} A promise that resolves when the co-host information has been updated.
 */
export const updatedCoHost = async ({
  coHost,
  coHostResponsibility,
  showAlert,
  eventType,
  islevel,
  member,
  youAreCoHost,
  updateCoHost,
  updateCoHostResponsibility,
  updateYouAreCoHost,
}: UpdatedCoHostOptions): Promise<void> => {
  if (eventType !== 'broadcast' && eventType !== 'chat') {
    // Only update the co-host if the event type is not broadcast or chat
    updateCoHost(coHost);
    updateCoHostResponsibility(coHostResponsibility);

    if (member === coHost) {
      if (!youAreCoHost) {
        updateYouAreCoHost(true);

        showAlert?.({
          message: 'You are now a co-host.',
          type: 'success',
          duration: 3000,
        });
      }
    } else {
      updateYouAreCoHost(false);
    }
  } else if (islevel !== '2') {
    updateYouAreCoHost(true);
  }
};
