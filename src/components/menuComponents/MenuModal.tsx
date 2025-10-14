import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButtons, { CustomButton } from './CustomButtons';
import MeetingIdComponent from './MeetingIDComponent';
import MeetingPasscodeComponent from './MeetingPasscodeComponent';
import ShareButtonsComponent from './ShareButtonsComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { EventType } from '../../@types/types';

/**
 * Configuration options for the `MenuModal` component.
 *
 * @interface MenuModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isVisible Controls the modal visibility state.
 * @property {() => void} onClose Handler invoked to dismiss the modal.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='#83c0e9'] Background fill applied to the modal card.
 * @property {'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'} [position='bottomRight'] Preferred anchor location.
 * @property {StyleProp<ViewStyle>} [style] Additional styles merged into the modal container.
 *
 * **Meeting Metadata:**
 * @property {string} roomName Human-readable meeting identifier.
 * @property {string} adminPasscode Host/admin passcode displayed to privileged users.
 * @property {string} islevel Participant level used to gate passcode visibility (level `'2'` shows the passcode).
 * @property {EventType} eventType Event classification used by share helpers.
 * @property {string} [localLink] URL for self-hosted Community Edition shares.
 *
 * **Menu Content:**
 * @property {CustomButton[]} [customButtons] Optional array of bespoke menu actions.
 * @property {boolean} [shareButtons=true] Toggles the share/action button group.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override to replace the default internal layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override to swap the surrounding modal container implementation.
 */
export interface MenuModalOptions {
  backgroundColor?: string;
  isVisible: boolean;
  onClose: () => void;
  customButtons?: CustomButton[];
  shareButtons?: boolean;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  roomName: string;
  adminPasscode: string;
  islevel: string;
  eventType: EventType;
  localLink?: string;
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

export type MenuModalType = (options: MenuModalOptions) => JSX.Element;

/**
 * MenuModal offers a consolidated hub for meeting metadata, quick actions, and sharing shortcuts.
 * Hosts and facilitators can expose custom buttons, reveal passcodes, and copy/share meeting details
 * without navigating away from the current screen.
 *
 * ### Key Features
 * - Auto-resizes based on screen width with a 450px cap for consistent layout.
 * - Supports custom call-to-actions via `customButtons` with iconography.
 * - Conditionally reveals admin passcodes for elevated users (level `'2'`).
 * - Integrates share helpers for room links, event type metadata, and local CE URLs.
 * - Provides `renderContent` and `renderContainer` overrides for deep customization.
 * - Anchorable to any corner of the screen using `position`.
 *
 * ### Accessibility
 * - Close button carries descriptive labels for assistive technologies.
 * - Scrollable content maintains keyboard navigation through focusable items.
 *
 * @param {MenuModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered meeting menu modal.
 *
 * @example Basic meeting info menu with default share buttons.
 * ```tsx
 * <MenuModal
 *   isVisible={visible}
 *   onClose={handleClose}
 *   roomName={roomName}
 *   adminPasscode={adminPasscode}
 *   islevel={userLevel}
 *   eventType="video"
 * />
 * ```
 *
 * @example Custom action buttons and dark theme styling.
 * ```tsx
 * <MenuModal
 *   isVisible
 *   onClose={toggleMenu}
 *   roomName="DesignSync"
 *   adminPasscode="742915"
 *   islevel="2"
 *   eventType="hybrid"
 *   backgroundColor="#101826"
 *   style={{ borderRadius: 24 }}
 *   customButtons={[
 *     {
 *       text: 'End Meeting',
 *       icon: 'power-off',
 *       show: true,
 *       backgroundColor: '#ff5a5f',
 *       action: handleEndMeeting,
 *     },
 *   ]}
 * />
 * ```
 *
 * @example Advanced UI override with custom container.
 * ```tsx
 * <MenuModal
 *   isVisible={open}
 *   onClose={close}
 *   roomName={roomId}
 *   adminPasscode={passcode}
 *   islevel="1"
 *   eventType="broadcast"
 *   renderContainer={({ defaultContainer }) => (
 *     <AnimatedPresence>{defaultContainer}</AnimatedPresence>
 *   )}
 * />
 * ```
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
  localLink,
  style,
  renderContent,
  renderContainer,
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

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
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
                localLink={localLink}
              />
            )}
          </View>
        </ScrollView>
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
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor, width: modalWidth },
            style,
          ]}
        >
          {content}
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
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
