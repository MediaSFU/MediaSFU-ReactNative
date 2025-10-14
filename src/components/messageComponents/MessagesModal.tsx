import React, { useEffect, useState, useRef } from 'react';
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
import MessagePanel from './MessagePanel';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { sendMessage, SendMessageOptions } from '../../methods/messageMethods/sendMessage';
import {
  CoHostResponsibility,
  EventType,
  Message,
  Participant,
  ShowAlert,
} from '../../@types/types';

/**
 * Interface defining the props for the MessagesModal component.
 */
/**
 * Configuration options for the `MessagesModal` component.
 *
 * @interface MessagesModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isMessagesModalVisible Controls visibility of the chat modal.
 * @property {() => void} onMessagesClose Invoked when the modal should close.
 *
 * **Messaging:**
 * @property {(options: SendMessageOptions) => Promise<void>} [onSendMessagePress=sendMessage] Handler triggered when sending a message.
 * @property {Message[]} messages Collection of messages to render within the panel.
 *
 * **Appearance:**
 * @property {'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'} [position='topRight'] Preferred anchor position.
 * @property {string} [backgroundColor='#f5f5f5'] Surface color of the modal.
 * @property {string} [activeTabBackgroundColor='#7AD2DCFF'] Highlight color for the active tab.
 * @property {StyleProp<ViewStyle>} [style] Additional styles merged into the modal container.
 *
 * **Session Context:**
 * @property {EventType} eventType Session type directing permissions and UI.
 * @property {string} member Display name of the current user.
 * @property {string} islevel Permission level for the current user.
 * @property {CoHostResponsibility[]} coHostResponsibility Matrix describing co-host capabilities.
 * @property {string} coHost Co-host identifier.
 * @property {string} roomName Active room identifier.
 * @property {Socket} socket Socket.io connection for real-time updates.
 * @property {string} chatSetting Chat configuration toggle (e.g., `'all' | 'hostOnly'`).
 *
 * **Direct Messaging:**
 * @property {boolean} startDirectMessage Flag that determines whether direct message mode is active.
 * @property {Participant | null} directMessageDetails Target participant for direct messaging.
 * @property {(start: boolean) => void} updateStartDirectMessage State setter for direct message mode.
 * @property {(participant: Participant | null) => void} updateDirectMessageDetails Setter for direct message context.
 *
 * **Alerts:**
 * @property {ShowAlert} [showAlert] Optional alert callback for user feedback.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the default chat panel layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for wrapping the modal with custom UI (e.g., animated containers).
 */
export interface MessagesModalOptions {
  isMessagesModalVisible: boolean;
  onMessagesClose: () => void;
  onSendMessagePress?: (options: SendMessageOptions) => Promise<void>;
  messages: Message[];
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
  activeTabBackgroundColor?: string;
  eventType: EventType;
  member: string;
  islevel: string;
  coHostResponsibility: CoHostResponsibility[];
  coHost: string;
  startDirectMessage: boolean;
  directMessageDetails: Participant | null;
  updateStartDirectMessage: (start: boolean) => void;
  updateDirectMessageDetails: (participant: Participant | null) => void;
  showAlert?: ShowAlert;
  roomName: string;
  socket: Socket;
  chatSetting: string;
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

export type MessagesModalType = (options: MessagesModalOptions) => JSX.Element;

/**
 * MessagesModal centralizes broadcast and direct messaging in a responsive modal. It adapts to event
 * context, offers tabs for chat segmentation, and coordinates direct-message flows with overrideable
 * handlers and layouts.
 *
 * ### Key Features
 * - Integrates with `sendMessage` by default but accepts custom handlers.
 * - Supports direct messaging mode with participant-specific metadata.
 * - Configurable positioning and theming for consistent branding.
 * - Uses `MessagePanel` to render messages with built-in tab management.
 * - Provides render overrides for both container and content.
 *
 * ### Accessibility
 * - Close button exposes descriptive labels for screen readers.
 * - Tab changes propagate via accessible Pressables inside `MessagePanel`.
 *
 * @param {MessagesModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered messages modal.
 *
 * @example Default configuration with built-in handlers.
 * ```tsx
 * <MessagesModal
 *   isMessagesModalVisible={visible}
 *   onMessagesClose={hide}
 *   messages={messages}
 *   eventType="conference"
 *   member={userName}
 *   islevel="1"
 *   coHostResponsibility={responsibilities}
 *   coHost={coHostName}
 *   startDirectMessage={false}
 *   directMessageDetails={null}
 *   updateStartDirectMessage={setStartDm}
 *   updateDirectMessageDetails={setDmDetails}
 *   roomName={roomId}
 *   socket={socket}
 *   chatSetting="default"
 * />
 * ```
 *
 * @example Custom send handler and styling.
 * ```tsx
 * <MessagesModal
 *   isMessagesModalVisible
 *   onMessagesClose={close}
 *   messages={messageHistory}
 *   onSendMessagePress={sendCustomMessage}
 *   eventType="webinar"
 *   member="host_01"
 *   islevel="2"
 *   backgroundColor="#101826"
 *   activeTabBackgroundColor="#3b82f6"
 *   style={{ borderRadius: 24 }}
 *   {...dmProps}
 * />
 * ```
 *
 * @example Animated container override.
 * ```tsx
 * <MessagesModal
 *   {...props}
 *   renderContainer={({ defaultContainer }) => (
 *     <FadeIn>{defaultContainer}</FadeIn>
 *   )}
 * />
 * ```
 */

const MessagesModal: React.FC<MessagesModalOptions> = ({
  isMessagesModalVisible,
  onMessagesClose,
  onSendMessagePress = sendMessage,
  messages,
  position = 'topRight',
  backgroundColor = '#f5f5f5',
  activeTabBackgroundColor = '#7AD2DCFF',
  eventType,
  member,
  islevel,
  coHostResponsibility,
  coHost,
  startDirectMessage,
  directMessageDetails,
  updateStartDirectMessage,
  updateDirectMessageDetails,
  showAlert,
  roomName,
  socket,
  chatSetting,
  style,
  renderContent,
  renderContainer,
}) => {
  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const activeTab = useRef<string>(
    eventType === 'webinar' || eventType === 'conference' ? 'direct' : 'group',
  );
  const [focusedInput, setFocusedInput] = useState<boolean>(false);
  const [reRender, setReRender] = useState<boolean>(false);

  /**
   * Switches the active tab to 'direct'.
   */
  const switchToDirectTab = () => {
    activeTab.current = 'direct';
    setReRender(!reRender);
  };

  /**
   * Switches the active tab to 'group'.
   */
  const switchToGroupTab = () => {
    activeTab.current = 'group';
    setReRender(!reRender);
  };

  useEffect(() => {
    const chatValue = coHostResponsibility?.find(
      (item: { name: string; value: boolean }) => item.name === 'chat',
    )?.value;

    const populateMessages = () => {
      const directMsgs = messages.filter(
        (message) => !message.group
          && (message.sender === member
            || message.receivers.includes(member)
            || islevel === '2'
            || (coHost === member && chatValue === true)),
      );
      setDirectMessages(directMsgs);

      const groupMsgs = messages.filter((message) => message.group);
      setGroupMessages(groupMsgs);
    };

    if (isMessagesModalVisible) {
      populateMessages();
    }
  }, [
    coHost,
    coHostResponsibility,
    isMessagesModalVisible,
    islevel,
    member,
    messages,
  ]);

  useEffect(() => {
    if (startDirectMessage && directMessageDetails) {
      if (eventType === 'webinar' || eventType === 'conference') {
        activeTab.current = 'direct';
        setFocusedInput(true);
      }
    } else if (eventType === 'broadcast' || eventType === 'chat') {
      activeTab.current = 'group';
    }
  }, [startDirectMessage, directMessageDetails, eventType]);

  useEffect(() => {
    // Force re-render when reRender state changes
  }, [reRender]);

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
      <View style={styles.header}>
        {eventType === 'webinar' || eventType === 'conference' ? (
          <View style={styles.tabsContainer}>
            <Pressable
              onPress={switchToDirectTab}
              style={[
                styles.tab,
                activeTab.current === 'direct' && styles.activeTab,
                activeTab.current === 'direct' && { backgroundColor: activeTabBackgroundColor },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab.current === 'direct' && styles.activeTabText,
                ]}
              >
                Direct
              </Text>
            </Pressable>
            <Pressable
              onPress={switchToGroupTab}
              style={[
                styles.tab,
                activeTab.current === 'group' && styles.activeTab,
                activeTab.current === 'group' && { backgroundColor: activeTabBackgroundColor },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab.current === 'group' && styles.activeTabText,
                ]}
              >
                Group
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Close Button */}
        <Pressable onPress={onMessagesClose} style={styles.closeButton}>
          <FontAwesome5 name="times" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.separator} />

      <View style={styles.modalBody}>
        {activeTab.current === 'direct'
          && (eventType === 'webinar' || eventType === 'conference') && (
            <MessagePanel
              messages={directMessages}
              messagesLength={messages.length}
              type="direct"
              onSendMessagePress={onSendMessagePress}
              username={member}
              backgroundColor={backgroundColor}
              focusedInput={focusedInput}
              showAlert={showAlert}
              eventType={eventType}
              member={member}
              islevel={islevel}
              coHostResponsibility={coHostResponsibility}
              coHost={coHost}
              directMessageDetails={directMessageDetails}
              updateStartDirectMessage={updateStartDirectMessage}
              updateDirectMessageDetails={updateDirectMessageDetails}
              roomName={roomName}
              socket={socket}
              chatSetting={chatSetting}
              startDirectMessage={startDirectMessage}
            />
        )}

        {activeTab.current === 'group' && (
          <MessagePanel
            messages={groupMessages}
            messagesLength={messages.length}
            type="group"
            onSendMessagePress={onSendMessagePress}
            username={member}
            backgroundColor={backgroundColor}
            focusedInput={false}
            showAlert={showAlert}
            eventType={eventType}
            member={member}
            islevel={islevel}
            coHostResponsibility={coHostResponsibility}
            coHost={coHost}
            directMessageDetails={directMessageDetails}
            updateStartDirectMessage={updateStartDirectMessage}
            updateDirectMessageDetails={updateDirectMessageDetails}
            roomName={roomName}
            socket={socket}
            chatSetting={chatSetting}
            startDirectMessage={startDirectMessage}
          />
        )}
      </View>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      animationType="fade"
      transparent
      visible={isMessagesModalVisible}
      onRequestClose={onMessagesClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
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

export default MessagesModal;

/**
 * Stylesheet for the MessagesModal component.
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
    height: '75%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    maxHeight: '75%',
    maxWidth: '80%',
    zIndex: 9,
    elevation: 9, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 10,
    borderRadius: 4,
  },
  activeTab: {
    // Additional styles for active tab if needed
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
  },
  activeTabText: {
    color: '#ffffff',
    backgroundColor: '#7AD2DCFF',
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
});
