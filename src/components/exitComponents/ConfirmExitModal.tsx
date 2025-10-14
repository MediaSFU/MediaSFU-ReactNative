import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Socket } from 'socket.io-client';
import { confirmExit, ConfirmExitOptions } from '../../methods/exitMethods/confirmExit';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Options for configuring `ConfirmExitModal`.
 *
 * @interface ConfirmExitModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isConfirmExitModalVisible Toggles the visibility of the modal.
 * @property {() => void} onConfirmExitClose Called when the modal should close.
 *
 * **Appearance:**
 * @property {'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'} [position='topRight'] Anchor position on screen.
 * @property {string} [backgroundColor='#83c0e9'] Card background color.
 * @property {StyleProp<ViewStyle>} [style] Additional styling for the modal container.
 *
 * **Exit Behaviour:**
 * @property {(options: ConfirmExitOptions) => void} [exitEventOnConfirm=confirmExit] Handler triggered on confirm.
 * @property {string} member Name of the participant exiting.
 * @property {boolean} [ban=false] Whether the participant should be banned on exit.
 * @property {string} roomName Active room identifier.
 * @property {Socket} socket Socket instance used for exit events.
 * @property {string} islevel User level determining available actions (e.g., `'2'` for admin).
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Custom renderer for modal body.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Custom renderer for modal shell.
 */
export interface ConfirmExitModalOptions {
  isConfirmExitModalVisible: boolean;
  onConfirmExitClose: () => void;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
  exitEventOnConfirm?: (options: ConfirmExitOptions) => void;
  member: string;
  ban?: boolean;
  roomName: string;
  socket: Socket;
  islevel: string;
  style?: StyleProp<ViewStyle>;
  renderContent?: (options: {
    defaultContent: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
}

export type ConfirmExitModalType = (options: ConfirmExitModalOptions) => JSX.Element;

/**
 * ConfirmExitModal confirms whether a participant should leave or, for admins, end the event for all.
 * It coordinates socket-based exits, respects ban flags, and surfaces override hooks for custom UI.
 *
 * ### Key Features
 * - Differentiates between regular exit and admin-level "End Event" actions.
 * - Calls `exitEventOnConfirm` with socket context for flexible business logic.
 * - Supports corner anchoring, theming, and render overrides.
 * - Provides clear call-to-action buttons with accessible labels.
 *
 * ### Accessibility
 * - Buttons expose descriptive `accessibilityLabel` values.
 * - Focusable layout ensures keyboard navigation across controls.
 *
 * @param {ConfirmExitModalOptions} props Modal configuration.
 * @returns {JSX.Element} Rendered confirmation modal.
 *
 * @example Standard exit confirmation.
 * ```tsx
 * <ConfirmExitModal
 *   isConfirmExitModalVisible={visible}
 *   onConfirmExitClose={hide}
 *   member={participant}
 *   roomName={roomId}
 *   socket={socket}
 *   islevel="1"
 * />
 * ```
 *
 * @example Admin ending the event with custom styling.
 * ```tsx
 * <ConfirmExitModal
 *   {...props}
 *   islevel="2"
 *   backgroundColor="#1f2937"
 *   style={{ borderRadius: 16 }}
 *   renderContent={({ defaultContent }) => (
 *     <AnimatedView>{defaultContent}</AnimatedView>
 *   )}
 * />
 * ```
 */

const ConfirmExitModal: React.FC<ConfirmExitModalOptions> = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  exitEventOnConfirm = confirmExit,
  member,
  ban = false,
  roomName,
  socket,
  islevel,
  style,
  renderContent,
  renderContainer,
}) => {
  const [modalWidth, setModalWidth] = useState<number>(0.7 * Dimensions.get('window').width);

  useEffect(() => {
    const updateDimensions = () => {
      let width = 0.7 * Dimensions.get('window').width;
      if (width > 400) {
        width = 400;
      }
      setModalWidth(width);
    };

    const subscribe = Dimensions.addEventListener('change', updateDimensions);
    // Initial call
    updateDimensions();

    return () => {
      subscribe.remove();
    };
  }, []);

  /**
   * Handles the logic when the user confirms exit.
   */
  const handleConfirmExit = () => {
    exitEventOnConfirm({
      socket,
      member,
      roomName,
      ban,
    });
    onConfirmExitClose();
  };

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Confirm Exit</Text>
        <Pressable
          onPress={onConfirmExitClose}
          style={styles.btnCloseConfirmExit}
          accessibilityRole="button"
          accessibilityLabel="Close Confirm Exit Modal"
        >
          <FontAwesome5 name="times" style={styles.icon} />
        </Pressable>
      </View>

      {/* Divider */}
      <View style={styles.hr} />

      {/* Body */}
      <View style={styles.modalBody}>
        <Text style={styles.confirmExitText}>
          {islevel === '2'
            ? 'This will end the event for all. Confirm exit.'
            : 'Are you sure you want to exit?'}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.hr} />

      {/* Footer */}
      <View style={styles.modalFooter}>
        {/* Cancel Button */}
        <Pressable
          onPress={onConfirmExitClose}
          style={[styles.confirmButton, styles.btnCancel]}
          accessibilityRole="button"
          accessibilityLabel="Cancel Exit"
        >
          <Text style={[styles.confirmButtonText, styles.btnCancelText]}>Cancel</Text>
        </Pressable>

        {/* Separator */}
        <View style={styles.doubleBorder} />

        {/* Exit/End Event Button */}
        <Pressable
          onPress={handleConfirmExit}
          style={[styles.confirmButton, styles.btnExit]}
          accessibilityRole="button"
          accessibilityLabel={islevel === '2' ? 'End Event' : 'Exit'}
        >
          <Text style={[styles.confirmButtonText, styles.btnExitText]}>
            {islevel === '2' ? 'End Event' : 'Exit'}
          </Text>
        </Pressable>
      </View>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={isConfirmExitModalVisible}
      onRequestClose={onConfirmExitClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        {/* Modal Content */}
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }, style]}>
          {content}
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
};

export default ConfirmExitModal;

/**
 * Stylesheet for the ConfirmExitModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    height: '35%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 20,
    maxHeight: '35%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  btnCloseConfirmExit: {
    padding: 5,
  },

  icon: {
    fontSize: 20,
    color: 'black',
    marginRight: 15,
  },

  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 15,
  },

  modalBody: {
    padding: 4,
  },

  confirmExitText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },

  confirmButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnCancel: {
    backgroundColor: '#6c757d',
  },

  btnExit: {
    backgroundColor: '#dc3545',
  },

  doubleBorder: {
    height: 25,
    width: 1,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },

  confirmButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },

  btnCancelText: {
    fontSize: 14,
    color: 'white',
  },

  btnExitText: {
    fontSize: 14,
  },
});
