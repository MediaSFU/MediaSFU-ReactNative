import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButtons, { CustomButton } from './CustomButtons';
import MeetingIdComponent from './MeetingIDComponent';
import MeetingPasscodeComponent from './MeetingPasscodeComponent';
import ShareButtonsComponent from './ShareButtonsComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { EventType } from '../../@types/types';

/**
 * Interface defining the options (props) for the MenuModal component.
 */
export interface MenuModalOptions {
  /**
   * The background color of the modal content.
   * @default "#83c0e9"
   */
  backgroundColor?: string;

  /**
   * Determines if the modal is visible.
   */
  isVisible: boolean;

  /**
   * Function to call when the modal is closed.
   */
  onClose: () => void;

  /**
   * An array of custom buttons to display in the modal.
   */
  customButtons?: CustomButton[];

  /**
   * Determines if share buttons should be displayed.
   * @default true
   */
  shareButtons?: boolean;

  /**
   * Position of the modal on the screen.
   * Possible values: "topRight", "topLeft", "bottomRight", "bottomLeft"
   * @default "bottomRight"
   */
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

  /**
   * The name of the room.
   */
  roomName: string;

  /**
   * The admin passcode for the meeting.
   */
  adminPasscode: string;

  /**
   * The level of the user.
   */
  islevel: string;

  /**
   * The type of event.
   */
  eventType: EventType;
}

export type MenuModalType = (options: MenuModalOptions) => JSX.Element;

/**
 * MenuModal - A React Native component that displays a modal with various menu options and buttons.
 *
 * @component
 * @param {MenuModalOptions} props - The properties passed to the MenuModal component.
 * @returns {JSX.Element} - The MenuModal component JSX element.
 */
const MenuModal: React.FC<MenuModalOptions> = ({
  backgroundColor = '#83c0e9',
  isVisible,
  onClose,
  customButtons = [],
  shareButtons = true,
  position = 'bottomRight',
  roomName,
  adminPasscode,
  islevel,
  eventType,
}) => {
  const [modalWidth, setModalWidth] = useState<number>(
    0.7 * Dimensions.get('window').width,
  );

  useEffect(() => {
    const updateDimensions = () => {
      let width = 0.7 * Dimensions.get('window').width;
      if (width > 450) {
        width = 450;
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

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              <FontAwesome5 name="bars" style={styles.icon} /> Menu
            </Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close Menu Modal"
            >
              <FontAwesome5 name="times" style={styles.icon} />
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.hr} />

          <View style={styles.modalBody}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.listGroup}>
                <CustomButtons buttons={customButtons} />

                {/* Separator */}
                <View style={styles.separator} />

                {/* Meeting Passcode - Visible only for level 2 users */}
                {islevel === '2' && (
                  <MeetingPasscodeComponent meetingPasscode={adminPasscode} />
                )}

                {/* Meeting ID */}
                <MeetingIdComponent meetingID={roomName} />

                {/* Share Buttons */}
                {shareButtons && (
                  <ShareButtonsComponent
                    meetingID={roomName}
                    eventType={eventType}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MenuModal;

/**
 * Stylesheet for the MenuModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  modalContent: {
    height: '70%',
    backgroundColor: '#83c0e9',
    borderRadius: 0,
    padding: 10,
    maxHeight: '70%',
    maxWidth: '75%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'black',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },

  scrollView: {
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  closeButton: {
    padding: 5,
  },

  icon: {
    fontSize: 20,
    color: 'black',
  },

  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 15,
  },

  modalBody: {
    flex: 1,
  },

  listGroup: {
    margin: 0,
    padding: 0,
  },

  separator: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 10,
  },
});
