import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Socket } from 'socket.io-client';
import { confirmExit, ConfirmExitOptions } from '../../methods/exitMethods/confirmExit';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Interface defining the options required by the ConfirmExitModal component.
 */
export interface ConfirmExitModalOptions {
  /**
   * Determines if the modal is visible.
   */
  isConfirmExitModalVisible: boolean;

  /**
   * Callback function to close the modal.
   */
  onConfirmExitClose: () => void;

  /**
   * Position of the modal on the screen.
   * @default "topRight"
   */
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

  /**
   * Background color of the modal.
   * @default "#83c0e9"
   */
  backgroundColor?: string;

  /**
   * Event handler function to be called on confirming exit.
   * @default confirmExit
   */
  exitEventOnConfirm?: (options: ConfirmExitOptions) => void;

  /**
   * Name of the member exiting.
   */
  member: string;

  /**
   * Flag indicating if the member is banned.
   */
  ban?: boolean;

  /**
   * Name of the room.
   */
  roomName: string;

  /**
   * Socket object for communication.
   */
  socket: Socket;

  /**
   * Level of the user (e.g., "1", "2").
   */
  islevel: string;
}

export type ConfirmExitModalType = (options: ConfirmExitModalOptions) => JSX.Element;

/**
 * ConfirmExitModal - A React Native modal component for confirming user exit from an event or ending an event.
 *
 * @component
 * @param {ConfirmExitModalOptions} props - The properties of the ConfirmExitModal component.
 * @returns {JSX.Element} - JSX element representing the ConfirmExitModal component.
 *
 * @example
 * // Example usage of ConfirmExitModal
 * <ConfirmExitModal
 *   isConfirmExitModalVisible={true}
 *   onConfirmExitClose={() => setConfirmExitModalVisible(false)}
 *   position="bottomLeft"
 *   backgroundColor="#ffcccc"
 *   exitEventOnConfirm={customExitEventLogic}
 *   member="John Doe"
 *   ban={false}
 *   roomName="MainRoom"
 *   socket={socket}
 *   islevel="2"
 * />
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


  return (
    <Modal
      transparent
      animationType="fade"
      visible={isConfirmExitModalVisible}
      onRequestClose={onConfirmExitClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        {/* Modal Content */}
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
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
        </View>
      </View>
    </Modal>
  );
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
