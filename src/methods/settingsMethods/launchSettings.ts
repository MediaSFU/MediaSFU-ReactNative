export interface LaunchSettingsOptions {
  updateIsSettingsModalVisible: (isVisible: boolean) => void;
  isSettingsModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchSettingsType = (options: LaunchSettingsOptions) => void;

/**
 * Toggles the visibility state of the settings modal.
 *
 * @param {LaunchSettingsOptions} options - The options for launching settings.
 * @param {Function} options.updateIsSettingsModalVisible - Function to update the visibility state of the settings modal.
 * @param {boolean} options.isSettingsModalVisible - Current visibility state of the settings modal.
 * @returns {void}
 */
export const launchSettings = ({ updateIsSettingsModalVisible, isSettingsModalVisible }: LaunchSettingsOptions): void => {
  // Open or close the menu modal based on its current visibility state
  updateIsSettingsModalVisible(!isSettingsModalVisible);
};
