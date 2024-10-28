export interface LaunchPollOptions {
  updateIsPollModalVisible: (isVisible: boolean) => void;
  isPollModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchPollType = (options: LaunchPollOptions) => void;

/**
 * Toggles the visibility of the poll modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsPollModalVisible - Function to update the visibility state of the poll modal.
 * @param {boolean} options.isPollModalVisible - Current visibility state of the poll modal.
 */
export const launchPoll = ({
  updateIsPollModalVisible,
  isPollModalVisible,
}: LaunchPollOptions): void => {
  /**
   * Toggle the visibility of the poll modal.
   */
  updateIsPollModalVisible(!isPollModalVisible);
};
