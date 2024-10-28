export interface LaunchCoHostOptions {
  updateIsCoHostModalVisible: (isVisible: boolean) => void;
  isCoHostModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchCoHostType = (options: LaunchCoHostOptions) => void;

/**
 * Toggles the visibility of the co-host modal.
 *
 * @param updateIsCoHostModalVisible - Function to update the visibility state of the co-host modal.
 * @param isCoHostModalVisible - Current visibility state of the co-host modal.
 */
export const launchCoHost = ({
  updateIsCoHostModalVisible,
  isCoHostModalVisible,
}: LaunchCoHostOptions): void => {
  // Open or close the co-host modal based on its current visibility state
  updateIsCoHostModalVisible(!isCoHostModalVisible);
};
