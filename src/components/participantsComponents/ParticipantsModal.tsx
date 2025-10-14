// ParticipantsModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Socket } from 'socket.io-client';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import ParticipantList from './ParticipantList';
import ParticipantListOthers from './ParticipantListOthers';
import { muteParticipants } from '../../methods/participantsMethods/muteParticipants';
import { messageParticipants } from '../../methods/participantsMethods/messageParticipants';
import { removeParticipants } from '../../methods/participantsMethods/removeParticipants';
import {
  CoHostResponsibility,
  EventType,
  Participant,
  ShowAlert,
} from '../../@types/types';

/**
 * Parameter bundle for `ParticipantsModal`, providing real-time participant state and helpers.
 *
 * @interface ParticipantsModalParameters
 *
 * **Participant State:**
 * @property {Participant[]} participants All known participants for the session.
 * @property {Participant[]} filteredParticipants Current participant collection after applying filters.
 *
 * **Role & Permissions:**
 * @property {CoHostResponsibility[]} coHostResponsibility Responsibility matrix dictating co-host abilities.
 * @property {string} coHost Username/ID of the acting co-host.
 * @property {string} member Current user identifier.
 * @property {string} islevel Current user level (host/co-host/member differentiation).
 *
 * **Session Context:**
 * @property {EventType} eventType Meeting type controlling available actions.
 * @property {Socket} socket Live socket.io connection for participant management.
 * @property {string} roomName Active room identifier.
 * @property {ShowAlert} [showAlert] Optional alerting callback for feedback.
 *
 * **Messaging Helpers:**
 * @property {(isVisible: boolean) => void} updateIsMessagesModalVisible Toggles direct message modal visibility.
 * @property {(participant: Participant | null) => void} updateDirectMessageDetails Sets context for direct messages.
 * @property {(start: boolean) => void} updateStartDirectMessage Toggles direct messaging flow.
 * @property {(participants: Participant[]) => void} updateParticipants Applies updates to the participant list.
 *
 * **Utility:**
 * @property {() => ParticipantsModalParameters} getUpdatedAllParams Retrieves latest parameter snapshot.
 * @property {Record<string, any>} [key: string] Additional extension values consumed by overrides.
 */
export interface ParticipantsModalParameters {
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  backgroundColor?: string;
  coHostResponsibility: CoHostResponsibility[];
  coHost: string;
  member: string;
  islevel: string;
  participants: Participant[];
  eventType: EventType;
  filteredParticipants: Participant[];
  socket: Socket;
  showAlert?: ShowAlert;
  roomName: string;
  updateIsMessagesModalVisible: (isVisible: boolean) => void;
  updateDirectMessageDetails: (participant: Participant | null) => void;
  updateStartDirectMessage: (start: boolean) => void;
  updateParticipants: (participants: Participant[]) => void;
  getUpdatedAllParams: () => ParticipantsModalParameters;
  [key: string]: any;
}

/**
 * Configuration options for the `ParticipantsModal` component.
 *
 * @interface ParticipantsModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isParticipantsModalVisible Controls visibility.
 * @property {() => void} onParticipantsClose Invoked when the modal should close.
 *
 * **Participant Tools:**
 * @property {(filter: string) => void} onParticipantsFilterChange Updates the search query.
 * @property {number} participantsCounter Initial count badge displayed in the header.
 * @property {typeof muteParticipants} [onMuteParticipants=muteParticipants] Custom handler for muting selected participants.
 * @property {typeof messageParticipants} [onMessageParticipants=messageParticipants] Custom direct message handler.
 * @property {typeof removeParticipants} [onRemoveParticipants=removeParticipants] Custom removal handler.
 *
 * **Render Overrides:**
 * @property {React.ComponentType<any>} [RenderParticipantList=ParticipantList] Component used for main participant rendering.
 * @property {React.ComponentType<any>} [RenderParticipantListOthers=ParticipantListOthers] Component for overflow/other participants.
 *
 * **State Parameters:**
 * @property {ParticipantsModalParameters} parameters Parameter bundle providing helpers and state access.
 *
 * **Customization:**
 * @property {string} [backgroundColor='#83c0e9'] Modal surface color.
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'} [position='topRight'] Anchor position.
 * @property {StyleProp<ViewStyle>} [style] Additional styling applied to modal container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override to replace the default modal body content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override to replace the modal container wrapper.
 */
export interface ParticipantsModalOptions {
  isParticipantsModalVisible: boolean;
  onParticipantsClose: () => void;
  onParticipantsFilterChange: (filter: string) => void;
  participantsCounter: number;
  onMuteParticipants?: typeof muteParticipants;
  onMessageParticipants?: typeof messageParticipants;
  onRemoveParticipants?: typeof removeParticipants;
  RenderParticipantList?: React.ComponentType<any>;
  RenderParticipantListOthers?: React.ComponentType<any>;
  parameters: ParticipantsModalParameters;
  backgroundColor?: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
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

export type ParticipantsModalType = (
  options: ParticipantsModalOptions
) => JSX.Element;

/**
 * ParticipantsModal centralizes participant management actions—mute, message, remove—within a flexible
 * modal. It adapts to co-host permissions, supports direct messaging shortcuts, and offers render
 * overrides for tailor-made participant experiences.
 *
 * ### Key Features
 * - Real-time list synchronized through `parameters.getUpdatedAllParams`.
 * - Inline filtering with keyboard friendly TextInput.
 * - Built-in handlers for muting, messaging, and removal, all overrideable.
 * - Separate render components for primary and "others" participant lists.
 * - Corner anchoring and theming via `position` and `backgroundColor` props.
 * - Render overrides to swap container/content for custom UI frameworks.
 *
 * ### Accessibility
 * - Close button provides descriptive labels for assistive tech.
 * - Participant actions surface through Pressables, inheriting screen reader cues.
 *
 * @param {ParticipantsModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered participant management modal.
 *
 * @example Basic usage with default handlers.
 * ```tsx
 * <ParticipantsModal
 *   isParticipantsModalVisible={visible}
 *   onParticipantsClose={handleClose}
 *   onParticipantsFilterChange={setFilter}
 *   participantsCounter={participants.length}
 *   parameters={parameters}
 * />
 * ```
 *
 * @example Custom mute/message/remove handlers and styling.
 * ```tsx
 * <ParticipantsModal
 *   isParticipantsModalVisible
 *   onParticipantsClose={close}
 *   onParticipantsFilterChange={setQuery}
 *   participantsCounter={filtered.length}
 *   onMuteParticipants={customMute}
 *   onMessageParticipants={customMessage}
 *   onRemoveParticipants={customRemove}
 *   backgroundColor="#151d2c"
 *   style={{ borderRadius: 24 }}
 *   parameters={params}
 * />
 * ```
 *
 * @example Override participant list renderer for custom cards.
 * ```tsx
 * <ParticipantsModal
 *   {...props}
 *   RenderParticipantList={MyParticipantGrid}
 *   RenderParticipantListOthers={MyOverflowList}
 * />
 * ```
 */

const ParticipantsModal: React.FC<ParticipantsModalOptions> = ({
  isParticipantsModalVisible,
  onParticipantsClose,
  onParticipantsFilterChange,
  participantsCounter,
  onMuteParticipants = muteParticipants,
  onMessageParticipants = messageParticipants,
  onRemoveParticipants = removeParticipants,
  RenderParticipantList = ParticipantList,
  RenderParticipantListOthers = ParticipantListOthers,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  parameters,
  style,
  renderContent,
  renderContainer,
}) => {
  const {
    coHostResponsibility,
    coHost,
    member,
    islevel,
    showAlert,
    participants,
    roomName,
    eventType,
    socket,
    updateIsMessagesModalVisible,
    updateDirectMessageDetails,
    updateStartDirectMessage,
    updateParticipants,
  } = parameters;

  const [participantList, setParticipantList] = useState<Participant[]>(participants);
  const [participantsCounter_s, setParticipantsCounter_s] = useState<number>(participantsCounter);
  const [filterText, setFilterText] = useState<string>('');

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  let participantsValue = false;
  try {
    participantsValue = coHostResponsibility?.find(
      (item: { name: string; value: boolean }) => item.name === 'participants',
    )?.value ?? false;
  } catch {
    // Default to false if not found
  }

  useEffect(() => {
    const updatedParams = parameters.getUpdatedAllParams();
    setParticipantList(updatedParams.filteredParticipants);
    setParticipantsCounter_s(updatedParams.filteredParticipants.length);
  }, [participants, parameters]);

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <ScrollView style={styles.scrollView}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          Participants
          {' '}
          <Text style={styles.badge}>{participantsCounter_s}</Text>
        </Text>
        <Pressable
          onPress={onParticipantsClose}
          style={styles.closeButton}
        >
          <FontAwesome name="times" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.separator} />
      <View style={styles.modalBody}>
        {/* Search Input */}
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Search ..."
            value={filterText}
            onChangeText={(text) => {
              setFilterText(text);
              onParticipantsFilterChange(text);
            }}
          />
        </View>

        {/* Participant List */}

        {(participantList && islevel === '2')
        || (coHost === member && participantsValue === true) ? (
          <RenderParticipantList
            participants={participantList}
            isBroadcast={eventType === 'broadcast'}
            onMuteParticipants={onMuteParticipants}
            onMessageParticipants={onMessageParticipants}
            onRemoveParticipants={onRemoveParticipants}
            socket={socket}
            coHostResponsibility={coHostResponsibility}
            member={member}
            islevel={islevel}
            showAlert={showAlert}
            coHost={coHost}
            roomName={roomName}
            updateIsMessagesModalVisible={updateIsMessagesModalVisible}
            updateDirectMessageDetails={updateDirectMessageDetails}
            updateStartDirectMessage={updateStartDirectMessage}
            updateParticipants={updateParticipants}
          />
          ) : participantList ? (
            <RenderParticipantListOthers
              participants={participantList}
              coHost={coHost}
              member={member}
            />
          ) : (
            <Text style={styles.noParticipantsText}>No participants</Text>
          )}
      </View>
    </ScrollView>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="slide"
      visible={isParticipantsModalVisible}
      onRequestClose={onParticipantsClose}
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

export default ParticipantsModal;

/**
 * Stylesheet for the ParticipantsModal component.
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
    height: '65%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 15,
    maxHeight: '65%',
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 9,
    zIndex: 9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 5,
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  modalBody: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 10,
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 20,
    backgroundColor: 'white',
  },
  scrollView: {
    flexGrow: 1,
  },
  waitingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  participantName: {
    flex: 5,
  },
  participantText: {
    fontSize: 16,
    color: 'black',
  },
  actionButtons: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  acceptButton: {
    padding: 5,
  },
  rejectButton: {
    padding: 5,
  },
  noParticipantsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 20,
  },
});
