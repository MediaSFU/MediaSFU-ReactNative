export interface LaunchConfigureWhiteboardOptions {
  updateIsConfigureWhiteboardModalVisible: (visible: boolean) => void;
  isConfigureWhiteboardModalVisible: boolean;
}

// Export the type definition for the function
export type LaunchConfigureWhiteboardType = (options: LaunchConfigureWhiteboardOptions) => void;

/**
 * Toggles the visibility of the configure whiteboard modal.
 *
 * @param updateIsConfigureWhiteboardModalVisible - Function to update the visibility state of the configure whiteboard modal.
 * @param isConfigureWhiteboardModalVisible - Current visibility state of the configure whiteboard modal.
 */
export const launchConfigureWhiteboard = ({
  updateIsConfigureWhiteboardModalVisible,
  isConfigureWhiteboardModalVisible,
}: LaunchConfigureWhiteboardOptions): void => {
  /**
   * Toggle the visibility of the configure whiteboard modal.
   */
  updateIsConfigureWhiteboardModalVisible(!isConfigureWhiteboardModalVisible);
};
