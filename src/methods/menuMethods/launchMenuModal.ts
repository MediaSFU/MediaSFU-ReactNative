export interface LaunchMenuModalOptions {
  updateIsMenuModalVisible: (isVisible: boolean) => void;
  isMenuModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchMenuModalType = (options: LaunchMenuModalOptions) => void;

/**
 * Toggles the visibility of the menu modal.
 *
 * @param updateIsMenuModalVisible - Function to update the visibility state of the menu modal.
 * @param isMenuModalVisible - Current visibility state of the menu modal.
 */
export const launchMenuModal = ({
  updateIsMenuModalVisible,
  isMenuModalVisible,
}: LaunchMenuModalOptions): void => {
  // Open or close the menu modal based on the current visibility state
  updateIsMenuModalVisible(!isMenuModalVisible);
};
