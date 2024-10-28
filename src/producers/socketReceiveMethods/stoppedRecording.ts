import { ShowAlert } from '../../@types/types';

export interface StoppedRecordingOptions {
  state: string;
  reason: string;
  showAlert?: ShowAlert;
}

// Export the type definition for the function
export type StoppedRecordingType = (options: StoppedRecordingOptions) => Promise<void>;

/**
 * Displays an alert message when the recording has stopped.
 *
 * @param {Object} options - The options for displaying the alert message.
 * @param {string} options.state - The state of the recording.
 * @param {string} options.reason - The reason for stopping the recording.
 * @param {Function} options.showAlert - Function to show alerts.
 * @returns {Promise<void>} A promise that resolves when the alert message is displayed.
 */
export const stoppedRecording = async ({
  state,
  reason,
  showAlert,
}: StoppedRecordingOptions): Promise<void> => {
  try {
    // Ensure the state is 'stop' before showing the alert
    if (state === 'stop') {
      showAlert?.({
        message: `The recording has stopped - ${reason}.`,
        duration: 3000,
        type: 'danger',
      });
    }
  } catch (error) {
    console.log('Error in stoppedRecording: ', error);
    // throw new Error("Failed to display the recording stopped alert message.");
  }
};
