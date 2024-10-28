export interface LaunchParticipantsOptions {
  updateIsParticipantsModalVisible: (isVisible: boolean) => void;
  isParticipantsModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchParticipantsType = (options: LaunchParticipantsOptions) => void;

/**
 * Toggles the visibility of the participants modal.
 * @function
 * @param {Object} options - The options object containing necessary variables and functions.
 * @param {Function} options.updateIsParticipantsModalVisible - Function to update the visibility state of the participants modal.
 * @param {boolean} options.isParticipantsModalVisible - Current visibility state of the participants modal.
 */
export const launchParticipants = ({
  updateIsParticipantsModalVisible,
  isParticipantsModalVisible,
}: LaunchParticipantsOptions): void => {
  /**
   * Toggle the visibility of the participants modal.
   */
  updateIsParticipantsModalVisible(!isParticipantsModalVisible);
};
