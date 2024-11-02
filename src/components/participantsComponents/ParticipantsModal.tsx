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

  // mediasfu functions
  getUpdatedAllParams: () => ParticipantsModalParameters;
  [key: string]: any;
}

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
}

export type ParticipantsModalType = (
  options: ParticipantsModalOptions
) => JSX.Element;

/**
 * ParticipantsModal displays a list of participants in a modal, with options for filtering, muting, messaging, or removing participants based on user permissions and event type.
 *
 * @component
 * @param {ParticipantsModalOptions} props - The properties for the ParticipantsModal component.
 * @returns {JSX.Element} The rendered ParticipantsModal component.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { ParticipantsModal } from 'mediasfu-reactnative';
 * 
 * function App() {
 *   const [isModalVisible, setIsModalVisible] = useState(false);
 *   const participantsParameters = {
 *     position: 'topRight',
 *     backgroundColor: '#83c0e9',
 *     coHostResponsibility: [{ name: 'participants', value: true }],
 *     coHost: 'JaneDoe',
 *     member: 'JohnDoe',
 *     islevel: '2',
 *     participants: [
 *       { name: 'Alice', id: '1', islevel: '1', muted: false },
 *       { name: 'Bob', id: '2', islevel: '1', muted: true },
 *     ],
 *     eventType: 'webinar',
 *     filteredParticipants: [],
 *     socket: socketInstance,
 *     showAlert: showAlertFunction,
 *     roomName: 'MainRoom',
 *     updateIsMessagesModalVisible: setIsMessagesModalVisible,
 *     updateDirectMessageDetails: setDirectMessageDetails,
 *     updateStartDirectMessage: setStartDirectMessage,
 *     updateParticipants: setParticipants,
 *     getUpdatedAllParams: () => participantsParameters,
 *   };
 * 
 *   return (
 *     <ParticipantsModal
 *       isParticipantsModalVisible={isModalVisible}
 *       onParticipantsClose={() => setIsModalVisible(false)}
 *       onParticipantsFilterChange={(filter) => handleFilterChange(filter)}
 *       participantsCounter={participantsParameters.participants.length}
 *       parameters={participantsParameters}
 *     />
 *   );
 * }
 * 
 * export default App;
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

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isParticipantsModalVisible}
      onRequestClose={onParticipantsClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }]}
        >
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
        </View>
      </View>
    </Modal>
  );
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
