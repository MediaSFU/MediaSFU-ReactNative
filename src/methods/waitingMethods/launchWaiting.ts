export interface LaunchWaitingOptions {
  updateIsWaitingModalVisible: (visible: boolean) => void;
  isWaitingModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchWaitingType = (options: LaunchWaitingOptions) => void;

/**
 * Toggles the visibility of the waiting modal.
 *
 * @param updateIsWaitingModalVisible - Function to update the visibility state of the waiting modal.
 * @param isWaitingModalVisible - Current visibility state of the waiting modal.
 */
export const launchWaiting = ({
  updateIsWaitingModalVisible,
  isWaitingModalVisible,
}: LaunchWaitingOptions): void => {
  // Toggle the visibility of the waiting modal
  updateIsWaitingModalVisible(!isWaitingModalVisible);
};
