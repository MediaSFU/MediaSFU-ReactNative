import React, { useEffect, useState, useRef } from 'react';
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
export interface MessagesModalOptions {
  /**
   * Determines if the messages modal is visible.
   */
  isMessagesModalVisible: boolean;

  /**
   * Function to close the messages modal.
   */
  onMessagesClose: () => void;

  /**
   * Function to handle sending messages.
   * Defaults to the imported sendMessage function.
   */
  onSendMessagePress?: (options: SendMessageOptions) => Promise<void>;

  /**
   * Array of message objects to display.
   */
  messages: Message[];

  /**
   * Position of the modal on the screen.
   * Possible values: 'topRight', 'topLeft', 'bottomRight', 'bottomLeft'.
   * @default 'topRight'
   */
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

  /**
   * Background color of the modal.
   * @default '#f5f5f5'
   */
  backgroundColor?: string;

  /**
   * Background color of the active tab.
   * @default '#7AD2DCFF',
   */
  activeTabBackgroundColor?: string;

  /**
   * Type of the event (e.g., webinar, conference, broadcast, chat).
   */
  eventType: EventType;

  /**
   * Current member's username.
   */
  member: string;

  /**
   * Level of the user.
   */
  islevel: string;

  /**
   * Array of co-host responsibilities.
   */
  coHostResponsibility: CoHostResponsibility[];

  /**
   * Co-host's username.
   */
  coHost: string;

  /**
   * Flag to start a direct message.
   */
  startDirectMessage: boolean;

  /**
   * Details of the direct message.
   */
  directMessageDetails: Participant | null;

  /**
   * Function to update the start direct message flag.
   */
  updateStartDirectMessage: (start: boolean) => void;

  /**
   * Function to update direct message details.
   */
  updateDirectMessageDetails: (participant: Participant | null) => void;

  /**
   * Function to show alerts.
   */
  showAlert?: ShowAlert;

  /**
   * Name of the chat room.
   */
  roomName: string;

  /**
   * Socket object for real-time communication.
   */
  socket: Socket;

  /**
   * Settings for the chat.
   */
  chatSetting: string;
}

export type MessagesModalType = (options: MessagesModalOptions) => JSX.Element;

/**
 * MessagesModal component displays a modal for direct and group messages.
 *
 * @component
 * @param {MessagesModalOptions} props - The properties for the MessagesModal component.
 * @returns {JSX.Element} The rendered MessagesModal component.
 *
 * @example
 * ```tsx
 * <MessagesModal
 *   isMessagesModalVisible={isVisible}
 *   onMessagesClose={() => setIsVisible(false)}
 *   messages={messages}
 *   eventType="conference"
 *   member="john_doe"
 *   islevel="1"
 *   coHostResponsibility={[{ name: 'chat', value: true }]}
 *   coHost="jane_doe"
 *   startDirectMessage={false}
 *   directMessageDetails={null}
 *   updateStartDirectMessage={(start) => setStartDirectMessage(start)}
 *   updateDirectMessageDetails={(participant) => setDirectMessageDetails(participant)}
 *   showAlert={showAlertFunction}
 *   roomName="MainRoom"
 *   socket={socketInstance}
 *   chatSetting="default"
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

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isMessagesModalVisible}
      onRequestClose={onMessagesClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
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
        </View>
      </View>
    </Modal>
  );
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
