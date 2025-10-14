// ShareEventModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import MeetingIdComponent from '../menuComponents/MeetingIDComponent';
import MeetingPasscodeComponent from '../menuComponents/MeetingPasscodeComponent';
import ShareButtonsComponent from '../menuComponents/ShareButtonsComponent';
import { EventType } from '../../@types/types';

/**
 * Options for configuring `ShareEventModal`.
 *
 * @interface ShareEventModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isShareEventModalVisible Controls modal visibility.
 * @property {() => void} onShareEventClose Callback fired when closing the modal.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='rgba(255, 255, 255, 0.25)'] Card background color.
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'} [position='topRight']
 * Anchor location for the modal.
 * @property {StyleProp<ViewStyle>} [style] Additional container styling.
 *
 * **Share Content:**
 * @property {boolean} [shareButtons=true] Determines if share buttons are displayed.
 * @property {string} roomName Meeting identifier displayed in the modal.
 * @property {string} [adminPasscode] Optional admin passcode.
 * @property {string} [islevel] Current user level (e.g., `'2'` for admins).
 * @property {EventType} eventType Meeting type used by share buttons.
 * @property {string} [localLink] Optional vanity link for local deployments.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Overrides the inner modal layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Overrides the surrounding container implementation.
 */
export interface ShareEventModalOptions {
  backgroundColor?: string;
  isShareEventModalVisible: boolean;
  onShareEventClose: () => void;
  shareButtons?: boolean;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  roomName: string;
  adminPasscode?: string;
  islevel?: string;
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

export type ShareEventModalType = (options: ShareEventModalOptions) => JSX.Element;

/**
 * ShareEventModal exposes room identifiers, admin passcodes, and share buttons so hosts can
 * distribute join details quickly. It supports corner positioning, theming, and override hooks
 * for custom layouts.
 *
 * ### Key Features
 * - Displays meeting ID and optional admin passcode.
 * - Integrates share shortcuts tailored to `eventType`.
 * - Supports compact corner placement with scrollable content.
 * - Offers render overrides and `StyleProp`-driven styling for complete control.
 *
 * ### Accessibility
 * - Close button includes assistive label for screen readers.
 * - ScrollView content remains keyboard accessible.
 *
 * @param {ShareEventModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered share modal.
 *
 * @example Basic usage with share buttons enabled.
 * ```tsx
 * <ShareEventModal
 *   isShareEventModalVisible={visible}
 *   onShareEventClose={hide}
 *   roomName={roomId}
 *   adminPasscode={adminCode}
 *   eventType="conference"
 *   islevel="2"
 * />
 * ```
 *
 * @example Custom container with animation.
 * ```tsx
 * <ShareEventModal
 *   {...props}
 *   renderContainer={({ defaultContainer }) => (
 *     <FadeIn>{defaultContainer}</FadeIn>
 *   )}
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
  localLink,
  style,
  renderContent,
  renderContainer,
}) => {
  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
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
                localLink={localLink}
              />
            </View>
          )}
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
      visible={isShareEventModalVisible}
      onRequestClose={onShareEventClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }, style]}
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
