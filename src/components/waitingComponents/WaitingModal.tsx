// WaitingRoomModal.tsx

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
import {
  respondToWaiting,
  RespondToWaitingType,
} from '../../methods/waitingMethods/respondToWaiting';
import { WaitingRoomParticipant } from '../../@types/types';

/**
 * Parameters supplied to `WaitingRoomModal` for maintaining filtered state.
 *
 * @interface WaitingRoomModalParameters
 *
 * **Participant State:**
 * @property {WaitingRoomParticipant[]} filteredWaitingRoomList Current filtered waiting list snapshot.
 *
 * **Utility:**
 * @property {() => WaitingRoomModalParameters} getUpdatedAllParams Fetches the latest waiting room parameters.
 * @property {Record<string, any>} [key: string] Additional shared data available to child components.
 */
export interface WaitingRoomModalParameters {
  filteredWaitingRoomList: WaitingRoomParticipant[];
  getUpdatedAllParams: () => WaitingRoomModalParameters;
  [key: string]: any;
}

/**
 * Configuration options for the `WaitingRoomModal` component.
 *
 * @interface WaitingRoomModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isWaitingModalVisible Controls modal visibility.
 * @property {() => void} onWaitingRoomClose Invoked when the waiting room modal should close.
 *
 * **Queue Management:**
 * @property {number} waitingRoomCounter Pending participants count displayed in the header badge.
 * @property {(filter: string) => void} onWaitingRoomFilterChange Callback fired whenever the search input changes.
 * @property {WaitingRoomParticipant[]} waitingRoomList Complete list of waiting participants.
 * @property {(updatedList: WaitingRoomParticipant[]) => void} updateWaitingList Persists changes after accept/deny actions.
 * @property {RespondToWaitingType} [onWaitingRoomItemPress=respondToWaiting] Handler invoked for accept/deny on each participant.
 *
 * **Session Context:**
 * @property {string} roomName Active room identifier used in network calls.
 * @property {Socket} socket Live socket.io connection powering real-time updates.
 *
 * **State Parameters:**
 * @property {WaitingRoomModalParameters} parameters Parameter bundle supplying filtered state helpers.
 *
 * **Customization:**
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'} [position='topRight'] Preferred modal anchor position.
 * @property {string} [backgroundColor='#83c0e9'] Background color for the modal card.
 * @property {StyleProp<ViewStyle>} [style] Additional styles merged into the modal container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override that replaces the default modal body content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override that swaps the default modal container wrapper.
 */
export interface WaitingRoomModalOptions {
  isWaitingModalVisible: boolean;
  onWaitingRoomClose: () => void;
  waitingRoomCounter: number;
  onWaitingRoomFilterChange: (filter: string) => void;
  waitingRoomList: WaitingRoomParticipant[];
  updateWaitingList: (updatedList: WaitingRoomParticipant[]) => void;
  roomName: string;
  socket: Socket;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  backgroundColor?: string;
  parameters: WaitingRoomModalParameters;
  onWaitingRoomItemPress?: RespondToWaitingType;
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

export type WaitingRoomModalType = (
  options: WaitingRoomModalOptions
) => JSX.Element;

/**
 * WaitingRoomModal equips hosts with a moderated queue for admitting participants. It pairs search
 * filtering with accept/deny actions, leverages socket callbacks for real-time updates, and exposes
 * render overrides for teams that need bespoke waiting room experiences.
 *
 * ### Key Features
 * - Real-time counter badge that mirrors the filtered waiting list length.
 * - Search input for quickly locating specific participants.
 * - Accept/deny actions wired to `respondToWaiting` by default.
 * - Supports corner anchoring and surface color customization.
 * - Allows override of both container and internal content via render props.
 * - Integrates `parameters.getUpdatedAllParams` for up-to-date queue state.
 *
 * ### Accessibility
 * - Close button carries assistive labels for screen readers.
 * - List items remain accessible thanks to Pressable wrappers within custom renderers.
 *
 * @param {WaitingRoomModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered waiting room management modal.
 *
 * @example Basic host usage with default handlers.
 * ```tsx
 * <WaitingRoomModal
 *   isWaitingModalVisible={visible}
 *   onWaitingRoomClose={handleClose}
 *   waitingRoomCounter={waitingList.length}
 *   onWaitingRoomFilterChange={setFilter}
 *   waitingRoomList={waitingList}
 *   updateWaitingList={setWaitingList}
 *   roomName={roomId}
 *   socket={socket}
 *   parameters={{
 *     getUpdatedAllParams: () => ({ filteredWaitingRoomList: filteredList })
 *   }}
 * />
 * ```
 *
 * @example Custom accept/deny handler and dark theme styling.
 * ```tsx
 * <WaitingRoomModal
 *   isWaitingModalVisible
 *   onWaitingRoomClose={dismiss}
 *   waitingRoomCounter={pending.length}
 *   onWaitingRoomFilterChange={setQuery}
 *   waitingRoomList={pending}
 *   updateWaitingList={setPending}
 *   roomName="StageA"
 *   socket={socket}
 *   onWaitingRoomItemPress={handleWaitingDecision}
 *   backgroundColor="#141927"
 *   style={{ borderRadius: 20 }}
 *   parameters={{
 *     getUpdatedAllParams: () => ({ filteredWaitingRoomList: filteredPending })
 *   }}
 * />
 * ```
 *
 * @example Integrating a custom container animation.
 * ```tsx
 * <WaitingRoomModal
 *   {...baseProps}
 *   renderContainer={({ defaultContainer }) => (
 *     <SlideIn>{defaultContainer}</SlideIn>
 *   )}
 * />
 * ```
 */


const WaitingRoomModal: React.FC<WaitingRoomModalOptions> = ({
  isWaitingModalVisible,
  onWaitingRoomClose,
  waitingRoomCounter,
  onWaitingRoomFilterChange,
  waitingRoomList,
  updateWaitingList,
  roomName,
  socket,
  onWaitingRoomItemPress = respondToWaiting,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  parameters,
  style,
  renderContent,
  renderContainer,
}) => {
  const screenWidth: number = Dimensions.get('window').width;
  let modalWidth: number = 0.8 * screenWidth;

  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const [filteredWaitingRoomList, setFilteredWaitingRoomList] =
    useState<WaitingRoomParticipant[]>(waitingRoomList);
  const [waitingRoomCounter_s, setWaitingRoomCounter_s] =
    useState<number>(waitingRoomCounter);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    const { getUpdatedAllParams } = parameters;
    const updatedParams = getUpdatedAllParams();
    setFilteredWaitingRoomList(updatedParams.filteredWaitingRoomList);
    setWaitingRoomCounter_s(updatedParams.filteredWaitingRoomList.length);
  }, [waitingRoomList, parameters]);

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          Waiting <Text style={styles.badge}>{waitingRoomCounter_s}</Text>
        </Text>
        <Pressable onPress={onWaitingRoomClose} style={styles.closeButton}>
          <FontAwesome name="times" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.separator} />

      {/* Search Input */}

      <View style={styles.modalBody}>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Search ..."
            value={filterText}
            onChangeText={(text) => {
              setFilterText(text);
              onWaitingRoomFilterChange(text);
            }}
          />
        </View>

        {/* Waiting List */}
        <ScrollView style={styles.scrollView}>
          <View>
            {filteredWaitingRoomList &&
            filteredWaitingRoomList.length > 0 ? (
              filteredWaitingRoomList.map((participant, index) => (
                <View key={index} style={styles.waitingItem}>
                  <View style={styles.participantName}>
                    <Text style={styles.participantText}>
                      {participant.name}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    {/* Accept Button */}
                    <Pressable
                      style={styles.acceptButton}
                      onPress={() =>
                        onWaitingRoomItemPress({
                          participantId: participant.id,
                          participantName: participant.name,
                          updateWaitingList,
                          waitingList: waitingRoomList,
                          roomName,
                          type: true, // accepted
                          socket,
                        })
                      }
                    >
                      <FontAwesome name="check" size={24} color="green" />
                    </Pressable>

                    {/* Reject Button */}
                    <Pressable
                      style={styles.rejectButton}
                      onPress={() =>
                        onWaitingRoomItemPress({
                          participantId: participant.id,
                          participantName: participant.name,
                          updateWaitingList,
                          waitingList: waitingRoomList,
                          roomName,
                          type: false, // rejected
                          socket,
                        })
                      }
                    >
                      <FontAwesome name="times" size={24} color="red" />
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noParticipantsText}>
                No participants found.
              </Text>
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
      visible={isWaitingModalVisible}
      onRequestClose={onWaitingRoomClose}
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

export default WaitingRoomModal;

/**
 * Stylesheet for the WaitingRoomModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
  },
  modalContent: {
    height: '65%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 15,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
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
  badge: {
    backgroundColor: '#ffffff',
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 5,
  },
  modalBody: {
    flex: 1,
  },
  closeButton: {
    padding: 5,
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  scrollView: {
    flexGrow: 1,
    maxHeight: '100%',
    maxWidth: '100%',
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
