import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Switch,
  TextInput,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { modifyCoHostSettings } from '../../methods/coHostMethods/modifyCoHostSettings';
import {
  CoHostResponsibility,
  Participant,
  ModifyCoHostSettingsOptions,
  ShowAlert,
} from '../../@types/types';
import { Socket } from 'socket.io-client';

export interface CoHostModalOptions {
  isCoHostModalVisible: boolean;
  currentCohost?: string;
  participants: Participant[];
  coHostResponsibility: CoHostResponsibility[];
  position?: string;
  backgroundColor?: string;
  roomName: string;
  showAlert?: ShowAlert;
  updateCoHostResponsibility: (
    coHostResponsibility: CoHostResponsibility[]
  ) => void;
  updateCoHost: (coHost: string) => void;
  updateIsCoHostModalVisible: (isCoHostModalVisible: boolean) => void;
  socket: Socket;
  onCoHostClose: () => void;
  onModifyEventSettings?: (settings: ModifyCoHostSettingsOptions) => void;
}

export type CoHostModalType = (options: CoHostModalOptions) => JSX.Element;


/**
 * CoHostModal component allows users to manage co-host settings in a virtual event.
 *
 * This component renders a modal interface where users can assign a new co-host from the list of participants,
 * set responsibilities, and save the updated settings. It leverages a Socket instance for real-time updates
 * and offers customizable modal position and styling options.
 *
 * @component
 * @param {boolean} isCoHostModalVisible - Flag to control the visibility of the modal.
 * @param {() => void} onCoHostClose - Callback to close the modal.
 * @param {Function} [onModifyEventSettings=modifyCoHostSettings] - Callback to handle changes to event settings, defaulting to `modifyCoHostSettings`.
 * @param {string} [currentCohost='No coHost'] - Name of the current co-host.
 * @param {Participant[]} participants - List of event participants.
 * @param {CoHostResponsibility[]} coHostResponsibility - List of co-host responsibilities and their statuses.
 * @param {string} [position='topRight'] - Screen position of the modal.
 * @param {string} [backgroundColor='#83c0e9'] - Background color for the modal.
 * @param {string} roomName - Room identifier for the event.
 * @param {ShowAlert} [showAlert] - Function to display alerts.
 * @param {Function} updateCoHostResponsibility - Function to update co-host responsibility statuses.
 * @param {Function} updateCoHost - Function to set a new co-host.
 * @param {Function} updateIsCoHostModalVisible - Function to toggle modal visibility.
 * @param {Socket} socket - Socket instance for real-time communication.
 *
 * @returns {JSX.Element} The CoHostModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { CoHostModal } from 'mediasfu-reactnative';
 * import { io } from 'socket.io-client';
 *
 * function App() {
 *   const socket = io('http://localhost:3000');
 *   
 *   return (
 *     <CoHostModal
 *       isCoHostModalVisible={true}
 *       onCoHostClose={() => console.log('Modal closed')}
 *       currentCohost="John Doe"
 *       participants={[
 *         { name: 'John Doe', islevel: '1' },
 *         { name: 'Jane Doe', islevel: '0' }
 *       ]}
 *       coHostResponsibility={[
 *         { name: 'manageParticipants', value: true, dedicated: false }
 *       ]}
 *       position="topRight"
 *       backgroundColor="#83c0e9"
 *       roomName="Room 1"
 *       showAlert={({ message, type }) => console.log(message, type)}
 *       updateCoHostResponsibility={(responsibilities) => console.log(responsibilities)}
 *       updateCoHost={(coHost) => console.log(coHost)}
 *       updateIsCoHostModalVisible={(visible) => console.log(visible)}
 *       socket={socket}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */


const CoHostModal: React.FC<CoHostModalOptions> = ({
  isCoHostModalVisible,
  onCoHostClose,
  onModifyEventSettings = modifyCoHostSettings,
  currentCohost = 'No coHost',
  participants,
  coHostResponsibility,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  roomName,
  showAlert,
  updateCoHostResponsibility,
  updateCoHost,
  updateIsCoHostModalVisible,
  socket,
}) => {
  const [selectedCohost, setSelectedCohost] = useState<string>(currentCohost);

  const [coHostResponsibilityCopy, setCoHostResponsibilityCopy] = useState<
    CoHostResponsibility[]
  >([...coHostResponsibility]);
  const [coHostResponsibilityCopyAlt, setCoHostResponsibilityCopyAlt] =
    useState<CoHostResponsibility[]>([...coHostResponsibility]);

  const initialResponsibilities: Record<string, boolean> =
    coHostResponsibilityCopyAlt.reduce<Record<string, boolean>>((acc, item) => {
      const str2 = item.name.charAt(0).toUpperCase() + item.name.slice(1);
      const keyed = `manage${str2}`;
      acc[keyed] = item.value;
      acc[`dedicateTo${keyed}`] = item.dedicated;
      return acc;
    }, {});

  const [responsibilities, setResponsibilities] = useState<
    Record<string, boolean>
  >(initialResponsibilities);

  const responsibilityItems = [
    { name: 'manageParticipants', label: 'Manage Participants' },
    { name: 'manageMedia', label: 'Manage Media' },
    { name: 'manageWaiting', label: 'Manage Waiting Room' },
    { name: 'manageChat', label: 'Manage Chat' },
  ];

  // Filter out the current co-host from the list of participants and any participant with islevel '2'
  const filteredParticipants: Participant[] = participants?.filter(
    (participant) =>
      participant.name !== currentCohost && participant.islevel !== '2',
  );

  const handleToggleSwitch = (responsibility: string) => {
    setResponsibilities((prevResponsibilities) => ({
      ...prevResponsibilities,
      [responsibility]: !prevResponsibilities[responsibility],
    }));

    // Update the coHostResponsibilityCopy
    if (responsibility.startsWith('dedicateTo')) {
      const responsibilityName = responsibility
        .replace('dedicateTomanage', '')
        .toLowerCase();
      const responsibilityItem = coHostResponsibilityCopy.find(
        (item) => item.name === responsibilityName,
      );
      if (responsibilityItem) {
        responsibilityItem.dedicated = !responsibilityItem.dedicated;
        setCoHostResponsibilityCopy([...coHostResponsibilityCopy]);
      }
    } else if (responsibility.startsWith('manage')) {
      const responsibilityName = responsibility
        .replace('manage', '')
        .toLowerCase();
      const responsibilityItem = coHostResponsibilityCopy.find(
        (item) => item.name === responsibilityName,
      );
      if (responsibilityItem) {
        responsibilityItem.value = !responsibilityItem.value;
        setCoHostResponsibilityCopy([...coHostResponsibilityCopy]);
      }
    }
  };

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  useEffect(() => {
    const populateResponsibilities = () => {
      setCoHostResponsibilityCopyAlt([...coHostResponsibility]);
      setCoHostResponsibilityCopy([...coHostResponsibility]);
      const responsibilities = coHostResponsibilityCopyAlt.reduce<
        Record<string, boolean>
      >((acc, item) => {
        const str2 = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        const keyed = `manage${str2}`;
        acc[keyed] = item.value;
        acc[`dedicateTo${keyed}`] = item.dedicated;
        return acc;
      }, {});
      setResponsibilities(responsibilities);
    };

    if (isCoHostModalVisible) {
      populateResponsibilities();
    }
  }, [isCoHostModalVisible, coHostResponsibility]);

  const handleSave = () => {
    onModifyEventSettings({
      roomName: roomName,
      showAlert: showAlert,
      selectedParticipant: selectedCohost,
      coHost: currentCohost,
      coHostResponsibility: coHostResponsibilityCopy,
      updateCoHostResponsibility: updateCoHostResponsibility,
      updateCoHost: updateCoHost,
      updateIsCoHostModalVisible: updateIsCoHostModalVisible,
      socket: socket,
    });
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isCoHostModalVisible}
      onRequestClose={onCoHostClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[
            styles.modalContent,
            { width: modalWidth, backgroundColor: backgroundColor },
          ]}
        >
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Co-Host</Text>
              <Pressable
                onPress={onCoHostClose}
                style={styles.btnCloseSettings}
              >
                <FontAwesome name="times" style={styles.icon} />
              </Pressable>
            </View>
            <View style={styles.hr} />
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  Current Co-host:
                </Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={currentCohost}
                  editable={false}
                />
              </View>

              <View style={styles.sep} />
              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  Select New Co-host:
                </Text>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  value={selectedCohost}
                  onValueChange={(value: string) => setSelectedCohost(value)}
                  items={
                    filteredParticipants
                      ? filteredParticipants.map((participant) => ({
                          label: participant.name,
                          value: participant.name,
                        }))
                      : []
                  }
                  placeholder={{ label: 'Select a participant', value: '' }}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <View style={styles.sep} />
              <View style={styles.row}>
                <View style={styles.col5}>
                  <Text style={[styles.label, { fontWeight: 'bold' }]}>
                    Responsibility
                  </Text>
                </View>
                <View style={styles.col3}>
                  <Text style={[styles.label, { fontWeight: 'bold' }]}>
                    Select
                  </Text>
                </View>
                <View style={styles.col4}>
                  <Text style={[styles.label, { fontWeight: 'bold' }]}>
                    Dedicated
                  </Text>
                </View>
              </View>
              {responsibilityItems.map((item) => (
                <View style={styles.row} key={item.name}>
                  <View style={styles.col5}>
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={
                        responsibilities[item.name] ? '#f5dd4b' : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => handleToggleSwitch(item.name)}
                      value={responsibilities[item.name]}
                    />
                  </View>
                  <View style={styles.col4}>
                    <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={
                        responsibilities[item.name] &&
                        responsibilities[`dedicateTo${item.name}`]
                          ? '#f5dd4b'
                          : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() =>
                        handleToggleSwitch(`dedicateTo${item.name}`)
                      }
                      value={
                        responsibilities[`dedicateTo${item.name}`] &&
                        responsibilities[item.name]
                      }
                      disabled={!responsibilities[item.name]}
                    />
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.modalFooter}>
              <Pressable onPress={handleSave} style={styles.btnApplySettings}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CoHostModal;

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
    borderRadius: 0,
    padding: 20,
    maxHeight: '65%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
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
  text: {
    color: 'black',
  },
  btnCloseSettings: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  formCheckGroup: {
    marginBottom: 10,
  },
  formCheck: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sep: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 2,
  },
  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },

  input: {
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 20,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
  },

  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  modalFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnApplySettings: {
    flex: 1,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
  },
  icon: {
    fontSize: 24,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col5: {
    flex: 5,
  },
  col3: {
    flex: 3,
    alignItems: 'center',
  },
  col4: {
    flex: 4,
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputWeb: {
    fontSize: 14,
    paddingHorizontal: 5,
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
