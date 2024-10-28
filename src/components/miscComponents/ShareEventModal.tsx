// ShareEventModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import MeetingIdComponent from '../menuComponents/MeetingIDComponent';
import MeetingPasscodeComponent from '../menuComponents/MeetingPasscodeComponent';
import ShareButtonsComponent from '../menuComponents/ShareButtonsComponent';
import { EventType } from '../../@types/types';

/**
 * Interface defining the options for the ShareEventModal component.
 */
export interface ShareEventModalOptions {
  /**
   * Background color of the modal content.
   * Defaults to 'rgba(255, 255, 255, 0.25)'.
   */
  backgroundColor?: string;

  /**
   * Flag to control the visibility of the modal.
   */
  isShareEventModalVisible: boolean;

  /**
   * Callback function to handle the closing of the modal.
   */
  onShareEventClose: () => void;

  /**
   * Flag to control the visibility of share buttons.
   * Defaults to true.
   */
  shareButtons?: boolean;

  /**
   * Position of the modal on the screen.
   * Possible values: 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'.
   * Defaults to 'topRight'.
   */
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

  /**
   * The name of the room to be shared.
   */
  roomName: string;

  /**
   * The admin passcode for the meeting.
   */
  adminPasscode?: string;

  /**
   * The level of the user.
   */
  islevel?: string;

  /**
   * The type of the event.
   */
  eventType: EventType;
}

export type ShareEventModalType = (options: ShareEventModalOptions) => JSX.Element;

/**
 * ShareEventModal component renders a modal for sharing event details.
 *
 * @component
 * @param {ShareEventModalOptions} props - The properties object.
 * @returns {JSX.Element} The rendered ShareEventModal component.
 *
 * @example
 * ```tsx
 * <ShareEventModal
 *   isShareEventModalVisible={modalVisible}
 *   onShareEventClose={() => setModalVisible(false)}
 *   roomName="Room123"
 *   adminPasscode="Passcode456"
 *   islevel="2"
 *   eventType="conference"
 * />
 * ```
 */
const ShareEventModal: React.FC<ShareEventModalOptions> = ({
  backgroundColor = 'rgba(255, 255, 255, 0.25)',
  isShareEventModalVisible,
  onShareEventClose,
  shareButtons = true,
  position = 'topRight',
  roomName,
  adminPasscode,
  islevel,
  eventType,
}) => {
  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isShareEventModalVisible}
      onRequestClose={onShareEventClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }]}
        >
          <View style={styles.modalHeader}>
            <Pressable onPress={onShareEventClose} style={styles.closeButton}>
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>

          <View style={styles.separator} />

          {/* Modal Body */}
          <View style={styles.modalBody}>
            <ScrollView contentContainerStyle={styles.bodyContainer}>
              {/* Conditionally render MeetingPasscodeComponent based on islevel */}
              {islevel === '2' && adminPasscode && (
                <View style={styles.componentContainer}>
                  <MeetingPasscodeComponent meetingPasscode={adminPasscode} />
                </View>
              )}

              {/* Meeting ID */}
              <View style={styles.componentContainer}>
                <MeetingIdComponent meetingID={roomName} />
              </View>

              {/* Share Buttons */}
              {shareButtons && (
                <View style={styles.componentContainer}>
                  <ShareButtonsComponent
                    meetingID={roomName}
                    eventType={eventType}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShareEventModal;

/**
 * Stylesheet for the ShareEventModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
  },
  modalContent: {
    height: '40%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 10,
    maxHeight: '40%',
    maxWidth: '80%',
    zIndex: 9,
    elevation: 9,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  icon: {
    fontSize: 20,
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 5,
  },
  bodyContainer: {
    paddingBottom: 10,
  },
  componentContainer: {
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalBody: {
    flex: 1,
  },
});
