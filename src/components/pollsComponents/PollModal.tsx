import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import { Socket } from 'socket.io-client';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
  HandleCreatePollType,
  HandleEndPollType,
  HandleVotePollType,
  Poll,
  ShowAlert,
} from '../../@types/types';

/**
 * Configuration options for the `PollModal` component.
 *
 * @interface PollModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isPollModalVisible Controls modal visibility.
 * @property {() => void} onClose Callback invoked when the modal should close.
 * @property {(isVisible: boolean) => void} updateIsPollModalVisible Updates the external visibility state.
 *
 * **Poll Management:**
 * @property {Poll[]} polls Collection of every poll available in the session.
 * @property {Poll | null} poll Currently active poll (if any) displayed in the modal.
 * @property {HandleCreatePollType} handleCreatePoll Handler that persists a new poll (host/co-host only).
 * @property {HandleEndPollType} handleEndPoll Handler that terminates the active poll (host/co-host only).
 * @property {HandleVotePollType} handleVotePoll Handler that records the participant's vote selection.
 *
 * **User Context:**
 * @property {string} member Identifier for the current participant submitting votes.
 * @property {string} islevel Permission level (`'0'` participant, `'1'` co-host, `'2'` host) driving available actions.
 *
 * **Session Context:**
 * @property {Socket} socket Active socket.io connection for real-time poll updates.
 * @property {string} roomName Room identifier associated with poll events.
 * @property {ShowAlert} [showAlert] Optional alert helper for surfacing poll feedback.
 *
 * **Customization:**
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'} [position='topRight'] Modal anchoring position.
 * @property {string} [backgroundColor='#f5f5f5'] Background color for the modal surface.
 * @property {StyleProp<ViewStyle>} [style] Extra styles applied to the modal container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Custom renderer for the modal body content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Custom renderer that can wrap/replace the outer modal container.
 */
export interface PollModalOptions {
  isPollModalVisible: boolean;
  onClose: () => void;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  backgroundColor?: string;
  member: string;
  islevel: string;
  polls: Poll[];
  poll: Poll | null;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  updateIsPollModalVisible: (isVisible: boolean) => void;
  handleCreatePoll: HandleCreatePollType;
  handleEndPoll: HandleEndPollType;
  handleVotePoll: HandleVotePollType;
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

export type PollModalType = (options: PollModalOptions) => JSX.Element;

/**
 * PollModal - Interactive polling and voting interface.
 *
 * Provides a full polling workflow for MediaSFU rooms, enabling hosts to
 * author polls, participants to vote, and everyone to view live results with
 * percentages. Layout and container wrappers can be overridden through
 * `uiOverrides.pollModal` while retaining the built-in handlers.
 *
 * **Key Features:**
 * - Guided poll creation with multiple choice support (host/co-host only).
 * - Participant voting with per-user selection highlighting.
 * - Real-time tally and percentage breakdown of each option.
 * - Previous poll archive including ended/archived questions.
 * - Configurable modal positioning for disparate layout needs.
 * - Optional custom styling via `style` prop or render overrides.
 * - Socket-driven synchronization to keep all clients consistent.
 * - Single-vote enforcement leveraging member identity tracking.
 *
 * **UI Customization:**
 * Replace via `uiOverrides.pollModal` to supply an entirely custom polling UI
 * while continuing to leverage the provided poll handlers.
 *
 * @component
 * @param {PollModalOptions} props Component properties.
 * @returns {JSX.Element} Rendered poll modal.
 *
 * @example
 * ```tsx
 * // Host creating and managing polls
 * <PollModal
 *   isPollModalVisible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   member="host-user"
 *   islevel="2"
 *   polls={allPolls}
 *   poll={activePoll}
 *   socket={socket}
 *   roomName="demo-room"
 *   handleCreatePoll={handleCreatePoll}
 *   handleEndPoll={handleEndPoll}
 *   handleVotePoll={handleVotePoll}
 *   updateIsPollModalVisible={setIsOpen}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Participant voting with custom styling
 * <PollModal
 *   isPollModalVisible={visible}
 *   onClose={onClose}
 *   member={participantId}
 *   islevel="0"
 *   polls={pollHistory}
 *   poll={currentPoll}
 *   socket={socket}
 *   roomName={roomName}
 *   handleCreatePoll={handleCreatePoll}
 *   handleEndPoll={handleEndPoll}
 *   handleVotePoll={handleVotePoll}
 *   updateIsPollModalVisible={setVisible}
 *   backgroundColor="#eef6ff"
 *   style={{ borderRadius: 20 }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Supplying a custom container through uiOverrides
 * const overrides = {
 *   pollModal: {
 *     component: MyCustomPollModal,
 *     injectedProps: {
 *       theme: 'dark',
 *     },
 *   },
 * };
 *
 * const PollModalComponent = withOverride(overrides.pollModal, PollModal);
 * <PollModalComponent
 *   isPollModalVisible={visible}
 *   onClose={onClose}
 *   member="user-1"
 *   islevel="1"
 *   polls={polls}
 *   poll={poll}
 *   socket={socket}
 *   roomName="lobby"
 *   handleCreatePoll={handleCreatePoll}
 *   handleEndPoll={handleEndPoll}
 *   handleVotePoll={handleVotePoll}
 *   updateIsPollModalVisible={setVisible}
 * />
 * ```
 */
const PollModal: React.FC<PollModalOptions> = ({
  isPollModalVisible,
  onClose,
  position = 'topRight',
  backgroundColor = '#f5f5f5',
  member,
  islevel,
  polls,
  poll,
  socket,
  roomName,
  showAlert,
  updateIsPollModalVisible,
  handleCreatePoll,
  handleEndPoll,
  handleVotePoll,
  style,
  renderContent,
  renderContainer,
}) => {
  const [newPoll, setNewPoll] = useState({
    question: '',
    type: '',
    options: [] as string[],
  });

  const modalWidth = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    return Math.min(0.9 * screenWidth, 350);
  }, []);

  const dimensions = useMemo(
    () => ({ width: modalWidth, height: 0 }),
    [modalWidth],
  );

  useEffect(() => {
    if (!isPollModalVisible) {
      return;
    }

    let activePollCount = 0;
    polls.forEach((existingPoll) => {
      if (existingPoll.status === 'active' && poll && existingPoll.id === poll.id) {
        activePollCount += 1;
      }
    });

    if (islevel === '2' && activePollCount === 0) {
      if (poll && poll.status === 'active') {
        poll.status = 'inactive';
      }
    }
  }, [isPollModalVisible, polls, poll, islevel]);

  const calculatePercentage = (votes: number[], optionIndex: number): string => {
    const totalVotes = votes.reduce((acc, current) => acc + current, 0);
    return totalVotes > 0
      ? ((votes[optionIndex] / totalVotes) * 100).toFixed(2)
      : '0.00';
  };

  const handlePollTypeChange = (type: string) => {
    let options: string[] = [];

    switch (type) {
      case 'trueFalse':
        options = ['True', 'False'];
        break;
      case 'yesNo':
        options = ['Yes', 'No'];
        break;
      case 'custom':
        options = [''];
        break;
      default:
        options = [];
        break;
    }

    setNewPoll((prevState) => ({ ...prevState, type, options }));
  };

  const addCustomOption = () => {
    setNewPoll((prevState) => ({
      ...prevState,
      options: [...prevState.options, ''],
    }));
  };

  const updateCustomOption = (index: number, value: string) => {
    setNewPoll((prevState) => {
      const updated = [...prevState.options];
      updated[index] = value;
      return { ...prevState, options: updated };
    });
  };

  const removeCustomOption = (index: number) => {
    setNewPoll((prevState) => {
      const updated = prevState.options.filter((_, optionIndex) => optionIndex !== index);
      return { ...prevState, options: updated };
    });
  };

  const renderPollOptions = () => {
    switch (newPoll.type) {
      case 'trueFalse':
      case 'yesNo':
        return (
          <View style={styles.formGroup}>
            {newPoll.options.map((option, index) => (
              <View key={index} style={styles.optionStaticRow}>
                <Text style={styles.optionStaticText}>{option}</Text>
              </View>
            ))}
          </View>
        );
      case 'custom':
        return (
          <View style={styles.formGroup}>
            {newPoll.options.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChangeText={(value) => updateCustomOption(index, value)}
                />
                <Pressable
                  onPress={() => removeCustomOption(index)}
                  style={[styles.smallButton, styles.buttonDanger]}
                >
                  <Text style={styles.smallButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={addCustomOption}
              style={[styles.button, styles.buttonPrimary]}
            >
              <Text style={styles.buttonText}>Add Option</Text>
            </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  const renderCurrentPollOptions = () => {
    if (!poll) {
      return null;
    }

    return poll.options.map((option, index) => (
      <Pressable
        key={index}
        style={styles.formCheck}
        onPress={() =>
          handleVotePoll({
            pollId: poll.id,
            optionIndex: index,
            socket,
            showAlert,
            member,
            roomName,
            updateIsPollModalVisible,
          })
        }
      >
        <View
          style={[
            styles.radioButton,
            poll.voters && poll.voters[member] === index && styles.radioButtonSelected,
          ]}
        >
          {poll.voters && poll.voters[member] === index && (
            <View style={styles.radioButtonIcon} />
          )}
        </View>
        <Text style={styles.formCheckLabel}>{option}</Text>
      </Pressable>
    ));
  };

  const renderPollStatus = () => {
    if (!poll) {
      return null;
    }

    return (
      <View style={styles.pollStatus}>
        {poll.votes.map((vote, index) => (
          <Text key={index} style={styles.statusText}>
            {`${poll.options[index]}: ${vote} votes (${calculatePercentage(
              poll.votes,
              index,
            )}%)`}
          </Text>
        ))}
      </View>
    );
  };

  const handleSubmitPoll = () => {
    handleCreatePoll({
      poll: newPoll,
      socket,
      showAlert,
      roomName,
      updateIsPollModalVisible,
    });

    setNewPoll({ question: '', type: '', options: [] });
  };

  const defaultContent = (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Polls</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <FontAwesome5 name="times" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.separator} />

      <ScrollView>
        {islevel === '2' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Previous Polls</Text>
              {polls.length === 0 && (
                <Text style={styles.noPollText}>No polls available</Text>
              )}
              {polls.map((existingPoll, index) => {
                const isCurrent = poll && existingPoll.id === poll.id && poll.status === 'active';
                if (isCurrent) {
                  return null;
                }

                return (
                  <View key={index} style={styles.pollCard}>
                    <Text style={styles.pollLabel}>Question</Text>
                    <TextInput
                      style={styles.textarea}
                      multiline
                      editable={false}
                      value={existingPoll.question}
                    />
                    <Text style={styles.pollLabel}>Results</Text>
                    {existingPoll.options.map((option, optionIndex) => (
                      <Text key={optionIndex} style={styles.statusText}>
                        {`${option}: ${existingPoll.votes[optionIndex]} votes (${calculatePercentage(
                          existingPoll.votes,
                          optionIndex,
                        )}%)`}
                      </Text>
                    ))}
                    {existingPoll.status === 'active' && (
                      <Pressable
                        style={[styles.button, styles.buttonDanger]}
                        onPress={() =>
                          handleEndPoll({
                            pollId: existingPoll.id,
                            socket,
                            showAlert,
                            roomName,
                            updateIsPollModalVisible,
                          })
                        }
                      >
                        <Text style={styles.buttonText}>End Poll</Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.separator} />

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Create New Poll</Text>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Question</Text>
                <TextInput
                  style={styles.textarea}
                  multiline
                  placeholder="Enter poll question"
                  value={newPoll.question}
                  onChangeText={(value) =>
                    setNewPoll((prevState) => ({ ...prevState, question: value }))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type</Text>
                <RNPickerSelect
                  onValueChange={handlePollTypeChange}
                  items={[
                    { label: 'True/False', value: 'trueFalse' },
                    { label: 'Yes/No', value: 'yesNo' },
                    { label: 'Custom', value: 'custom' },
                  ]}
                  placeholder={{ label: 'Select poll type', value: '' }}
                  value={newPoll.type}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                />
              </View>

              {renderPollOptions()}

              <Pressable
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSubmitPoll}
                disabled={!newPoll.question || newPoll.options.length === 0}
              >
                <Text style={styles.buttonText}>Create Poll</Text>
              </Pressable>
            </View>

            <View style={styles.separator} />
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Current Poll</Text>
          {poll && poll.status === 'active' ? (
            <View style={styles.pollCard}>
              <Text style={styles.pollLabel}>Question</Text>
              <TextInput
                style={styles.textarea}
                multiline
                editable={false}
                value={poll.question}
              />
              <Text style={styles.pollLabel}>Options</Text>
              {renderCurrentPollOptions()}
              {renderPollStatus()}
              {islevel === '2' && (
                <Pressable
                  style={[styles.button, styles.buttonDanger]}
                  onPress={() =>
                    handleEndPoll({
                      pollId: poll.id,
                      socket,
                      showAlert,
                      roomName,
                      updateIsPollModalVisible,
                    })
                  }
                >
                  <Text style={styles.buttonText}>End Poll</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Text style={styles.noPollText}>No active poll available.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      visible={isPollModalVisible}
      transparent
      animationType="slide"
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

  const container = renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;

  return <>{container}</>;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    maxHeight: '80%',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  noPollText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  pollCard: {
    marginBottom: 12,
  },
  pollLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    marginBottom: 6,
  },
  textarea: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 16,
    color: 'black',
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionStaticRow: {
    paddingVertical: 4,
  },
  optionStaticText: {
    fontSize: 16,
    color: 'black',
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    color: 'black',
    marginRight: 8,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPrimary: {
    backgroundColor: '#000',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  formCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  radioButtonIcon: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  formCheckLabel: {
    fontSize: 16,
    color: 'black',
  },
  pollStatus: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
  },
  inputWeb: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default PollModal;
