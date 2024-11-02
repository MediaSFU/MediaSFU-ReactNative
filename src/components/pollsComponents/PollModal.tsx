import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import { Socket } from 'socket.io-client';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
  Poll,
  ShowAlert,
  HandleCreatePollType,
  HandleEndPollType,
  HandleVotePollType,
} from '../../@types/types';

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
}

export type PollModalType = (options: PollModalOptions) => JSX.Element;

/**
 * PollModal component allows users to create, manage, and vote in polls within an event.
 *
 * @component
 * @param {PollModalOptions} props - The properties for the PollModal component.
 * @returns {JSX.Element} The rendered PollModal component.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { PollModal } from 'mediasfu-reactnative';
 * 
 * function App() {
 *   const [isPollModalVisible, setPollModalVisible] = useState(false);
 *   
 *   const handleCreatePoll = (options) => { };
 *   const handleEndPoll = (options) => { };
 *   const handleVotePoll = (options) => { };
 *
 *   return (
 *     <PollModal
 *       isPollModalVisible={isPollModalVisible}
 *       onClose={() => setPollModalVisible(false)}
 *       position="topRight"
 *       member="john_doe"
 *       islevel="2"
 *       polls={[{ id: '1', question: 'Is React Native awesome?', options: ['Yes', 'No'], status: 'active', voters: {}, votes: [3, 1] }]}
 *       poll={{ id: '1', question: 'Is React Native awesome?', options: ['Yes', 'No'], status: 'active', voters: {}, votes: [3, 1] }}
 *       socket={socketInstance}
 *       roomName="MainRoom"
 *       handleCreatePoll={handleCreatePoll}
 *       handleEndPoll={handleEndPoll}
 *       handleVotePoll={handleVotePoll}
 *       showAlert={showAlertFunction}
 *       updateIsPollModalVisible={setPollModalVisible}
 *     />
 *   );
 * }
 * 
 * export default App;
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
}) => {
  const [newPoll, setNewPoll] = useState<{
    question: string;
    type: string;
    options: string[];
  }>({
    question: '',
    type: '',
    options: [],
  });

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.9 * screenWidth; // Adjusted for better mobile view
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  /**
   * Renders polls based on the user's level and poll status.
   */
  const renderPolls = () => {
    let activePollCount = 0;

    polls.forEach((polled) => {
      if (polled.status === 'active' && poll && polled.id === poll.id) {
        activePollCount++;
      }
    });

    if (islevel === '2' && activePollCount === 0) {
      if (poll && poll.status === 'active') {
        // Ideally, you should handle state immutably
        // This is just a placeholder; consider using state management
        poll.status = 'inactive';
      }
    }
  };

  useEffect(() => {
    if (isPollModalVisible) {
      renderPolls();
    }
  }, [isPollModalVisible, polls, poll]);

  /**
   * Calculates the percentage of votes for a given option.
   * @param votes Array of vote counts.
   * @param optionIndex Index of the option.
   * @returns Percentage string.
   */
  const calculatePercentage = (
    votes: number[],
    optionIndex: number,
  ): string => {
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    return totalVotes > 0
      ? ((votes[optionIndex] / totalVotes) * 100).toFixed(2)
      : '0.00';
  };

  /**
   * Handles the change in poll type and initializes options accordingly.
   * @param type Selected poll type.
   */
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
        options = [];
        break;
      default:
        options = [];
        break;
    }

    setNewPoll({ ...newPoll, type, options });
  };

  /**
   * Renders poll options based on the selected poll type.
   */
  const renderPollOptions = () => {
    switch (newPoll?.type) {
      case 'trueFalse':
      case 'yesNo':
        return (
          <View>
            {newPoll.options.map((option, index) => (
              <View style={styles.formCheck} key={index}>
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonIcon} />
                </View>
                <Text style={styles.formCheckLabel}>{option}</Text>
              </View>
            ))}
          </View>
        );
      case 'custom':
        return (
          <>
            {newPoll.options?.map((option, index) => (
              <View style={styles.formGroup} key={index}>
                <TextInput
                  style={styles.formControl}
                  placeholder={`Option ${index + 1}`}
                  maxLength={50}
                  value={option || ''}
                  onChangeText={(text) => {
                    const newOptions = [...newPoll.options];
                    newOptions[index] = text;
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              </View>
            ))}
            {[...Array(5 - (newPoll.options?.length || 0))].map((_, index) => (
              <View
                style={styles.formGroup}
                key={(newPoll.options?.length || 0) + index}
              >
                <TextInput
                  style={styles.formControl}
                  placeholder={`Option ${
                    (newPoll.options?.length || 0) + index + 1
                  }`}
                  maxLength={50}
                  value=""
                  onChangeText={(text) => {
                    const newOptions = [...(newPoll.options || []), text];
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              </View>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  /**
   * Renders the options for the current active poll.
   */
  const renderCurrentPollOptions = () => poll?.options.map((option, i) => (
    <Pressable
      key={i}
      style={styles.formCheck}
      onPress={() => handleVotePoll({
        pollId: poll.id,
        optionIndex: i,
        socket,
        showAlert,
        member,
        roomName,
        updateIsPollModalVisible,
      })}
    >
      <View
        style={[
          styles.radioButton,
          poll.voters
              && poll.voters[member] === i
              && styles.radioButtonSelected,
        ]}
      >
        {poll.voters && poll.voters[member] === i && (
        <View style={styles.radioButtonIcon} />
        )}
      </View>
      <Text style={styles.formCheckLabel}>{option}</Text>
    </Pressable>
  ));

  return (
    <Modal
      visible={isPollModalVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }]}
        >
          {/* Header */}
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
                {/* Previous Polls */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Previous Polls</Text>
                  {polls.length === 0 && (
                    <Text style={styles.noPollText}>No polls available</Text>
                  )}
                  {polls.map(
                    (polled, index) => polled
                      && (!poll
                        || (poll
                          && (poll.status !== 'active'
                            || polled.id !== poll.id))) && (
                            <View key={index} style={styles.poll}>
                              <Text style={styles.pollLabel}>Question:</Text>
                              <TextInput
                                style={styles.textarea}
                                multiline
                                editable={false}
                                value={polled.question}
                              />
                              <Text style={styles.pollLabel}>Options:</Text>
                              {polled.options.map((option, i) => (
                                <Text key={i} style={styles.optionText}>
                                  {`${option}: ${
                                    polled.votes[i]
                                  } votes (${calculatePercentage(
                                    polled.votes,
                                    i,
                                  )}%)`}
                                </Text>
                              ))}
                              {polled.status === 'active' && (
                              <Pressable
                                style={[styles.button, styles.buttonDanger]}
                                onPress={() => handleEndPoll({
                                  pollId: polled.id,
                                  socket,
                                  showAlert,
                                  roomName,
                                  updateIsPollModalVisible,
                                })}
                              >
                                <Text style={styles.buttonText}>End Poll</Text>
                              </Pressable>
                              )}
                            </View>
                    ),
                  )}
                </View>

                <View style={styles.separator} />

                {/* Create New Poll */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Create a New Poll</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Poll Question</Text>
                    <TextInput
                      style={styles.textarea}
                      multiline
                      maxLength={300}
                      value={newPoll.question}
                      onChangeText={(text) => setNewPoll({ ...newPoll, question: text })}
                      placeholder="Enter your question here..."
                      placeholderTextColor={'black'}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                      Select Poll Answer Type
                    </Text>
                    <RNPickerSelect
                      onValueChange={handlePollTypeChange}
                      items={[
                        { label: 'Choose...', value: '' },
                        { label: 'True/False', value: 'trueFalse' },
                        { label: 'Yes/No', value: 'yesNo' },
                        { label: 'Custom', value: 'custom' },
                      ]}
                      placeholder={{}}
                      style={pickerSelectStyles}
                      value={newPoll.type}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  {renderPollOptions()}
                  <Pressable
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={() => handleCreatePoll({
                      poll: newPoll,
                      socket,
                      roomName,
                      showAlert,
                      updateIsPollModalVisible,
                    })}
                  >
                    <Text style={styles.buttonText}>Create Poll</Text>
                  </Pressable>
                </View>

                <View style={styles.separator} />
              </>
            )}

            {/* Current Poll */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Current Poll</Text>
              {poll && poll.status === 'active' ? (
                <View style={styles.poll}>
                  <Text style={styles.pollLabel}>Question:</Text>
                  <TextInput
                    style={styles.textarea}
                    multiline
                    editable={false}
                    value={poll.question}
                  />
                  <Text style={styles.pollLabel}>Options:</Text>
                  {renderCurrentPollOptions()}
                  {poll.status === 'active' && islevel === '2' && (
                    <Pressable
                      style={[styles.button, styles.buttonDanger]}
                      onPress={() => handleEndPoll({
                        pollId: poll.id,
                        socket,
                        showAlert,
                        roomName,
                        updateIsPollModalVisible,
                      })}
                    >
                      <Text style={styles.buttonText}>End Poll</Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <Text style={styles.noPollText}>No active poll</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    zIndex: 9,
    elevation: 9,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    maxHeight: '70%',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 9,
    zIndex: 9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    padding: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  noPollText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 10,
  },
  poll: {
    marginBottom: 10,
  },
  pollLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
    color: 'black',
  },
  textarea: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: 'black',
  },
  formGroup: {
    marginBottom: 15,
  },
  formControl: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
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
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPrimary: {
    backgroundColor: '#000000',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
});

/**
 * Styles for the RNPickerSelect component.
 */
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputWeb: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default PollModal;
