// EventSettingsModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select'; // Install using: npm install react-native-picker-select
import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';
import { modifySettings, ModifySettingsOptions } from '../../methods/settingsMethods/modifySettings';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Interface defining the parameters required by the EventSettingsModal component.
 */
export interface EventSettingsModalParameters {
  meetingDisplayType: string;
  autoWave: boolean;
  forceFullDisplay: boolean;
  meetingVideoOptimized: boolean;

  // Additional parameters inherited from ModifySettingsParameters
  roomName: string;
  socket: Socket;
  showAlert?: ShowAlert;
}

/**
 * Interface defining the options (props) for the EventSettingsModal component.
 */
export interface EventSettingsModalOptions {
  /**
   * Determines if the modal is visible.
   */
  isEventSettingsModalVisible: boolean;

  /**
   * Callback function to close the modal.
   */
  onEventSettingsClose: () => void;

  /**
   * Callback function to modify event settings.
   * @default modifySettings
   */
  onModifyEventSettings?: (options: ModifySettingsOptions) => Promise<void>;

  /**
   * Position of the modal on the screen.
   * @default "topRight"
   */
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

  /**
   * Background color of the modal.
   * @default "#83c0e9"
   */
  backgroundColor?: string;

  /**
   * Initial audio setting.
   */
  audioSetting: string;

  /**
   * Initial video setting.
   */
  videoSetting: string;

  /**
   * Initial screenshare setting.
   */
  screenshareSetting: string;

  /**
   * Initial chat setting.
   */
  chatSetting: string;

  /**
   * Callback function to update audio setting.
   */
  updateAudioSetting: (setting: string) => void;

  /**
   * Callback function to update video setting.
   */
  updateVideoSetting: (setting: string) => void;

  /**
   * Callback function to update screenshare setting.
   */
  updateScreenshareSetting: (setting: string) => void;

  /**
   * Callback function to update chat setting.
   */
  updateChatSetting: (setting: string) => void;

  /**
   * Callback function to update modal visibility.
   */
  updateIsSettingsModalVisible: (isVisible: boolean) => void;

  /**
   * Name of the room.
   */
  roomName: string;

  /**
   * Socket object for communication.
   */
  socket: Socket;

  /**
   * Callback function to show alerts.
   */
  showAlert?: ShowAlert;
}

export type EventSettingsModalType = (options: EventSettingsModalOptions) => JSX.Element;

/**
 * EventSettingsModal - A React Native component for displaying a modal to modify event settings.
 *
 * @param {EventSettingsModalOptions} props - The properties passed to the EventSettingsModal component.
 * @returns {JSX.Element} - The EventSettingsModal component JSX element.
 */
const EventSettingsModal: React.FC<EventSettingsModalOptions> = ({
  isEventSettingsModalVisible,
  onEventSettingsClose,
  onModifyEventSettings = modifySettings,
  audioSetting,
  videoSetting,
  screenshareSetting,
  chatSetting,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  updateAudioSetting,
  updateVideoSetting,
  updateScreenshareSetting,
  updateChatSetting,
  updateIsSettingsModalVisible,
  roomName,
  socket,
  showAlert,
}) => {
  const [audioState, setAudioState] = useState<string>(audioSetting);
  const [videoState, setVideoState] = useState<string>(videoSetting);
  const [screenshareState, setScreenshareState] = useState<string>(screenshareSetting);
  const [chatState, setChatState] = useState<string>(chatSetting);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  useEffect(() => {
    if (isEventSettingsModalVisible) {
      setAudioState(audioSetting);
      setVideoState(videoSetting);
      setScreenshareState(screenshareSetting);
      setChatState(chatSetting);
    }
  }, [isEventSettingsModalVisible, audioSetting, videoSetting, screenshareSetting, chatSetting]);

  /**
   * Handles saving the modified event settings.
   */
  const handleSaveSettings = async () => {
    try {
      await onModifyEventSettings({
        audioSet: audioState,
        videoSet: videoState,
        screenshareSet: screenshareState,
        chatSet: chatState,
        updateAudioSetting,
        updateVideoSetting,
        updateScreenshareSetting,
        updateChatSetting,
        updateIsSettingsModalVisible,
        roomName,
        socket,
        showAlert,
      });
      onEventSettingsClose(); // Close modal after saving
    } catch {
      showAlert?.({ message: 'Failed to save settings.', type: 'danger' });
    }
  };


  return (
    <Modal
      transparent
      animationType="fade"
      visible={isEventSettingsModalVisible}
      onRequestClose={onEventSettingsClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Event Settings</Text>
            <Pressable
              onPress={onEventSettingsClose}
              style={styles.btnCloseSettings}
              accessibilityRole="button"
              accessibilityLabel="Close Event Settings Modal"
            >
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.hr} />

          {/* Body */}
          <View style={styles.modalBody}>
            {/* User Audio Setting */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User Audio:</Text>
              <RNPickerSelect
                onValueChange={(value: string) => {
                  setAudioState(value);
                  updateAudioSetting(value);
                }}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  { label: 'Upon approval', value: 'approval' },
                ]}
                value={audioState}
                style={pickerSelectStyles}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* User Video Setting */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User Video:</Text>
              <RNPickerSelect
                onValueChange={(value: string) => {
                  setVideoState(value);
                  updateVideoSetting(value);
                }}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  { label: 'Upon approval', value: 'approval' },
                ]}
                value={videoState}
                style={pickerSelectStyles}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* User Screenshare Setting */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User Screenshare:</Text>
              <RNPickerSelect
                onValueChange={(value: string) => {
                  setScreenshareState(value);
                  updateScreenshareSetting(value);
                }}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                  { label: 'Upon approval', value: 'approval' },
                ]}
                value={screenshareState}
                style={pickerSelectStyles}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* User Chat Setting */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>User Chat:</Text>
              <RNPickerSelect
                onValueChange={(value: string) => {
                  setChatState(value);
                  updateChatSetting(value);
                }}
                items={[
                  { label: 'Disallow', value: 'disallow' },
                  { label: 'Allow', value: 'allow' },
                ]}
                value={chatState}
                style={pickerSelectStyles}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Pressable
              onPress={handleSaveSettings}
              style={styles.btnApplySettings}
              accessibilityRole="button"
              accessibilityLabel="Save Event Settings"
            >
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EventSettingsModal;

/**
 * Stylesheet for the EventSettingsModal component.
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
    borderStyle: 'solid',
  },

  modalContent: {
    height: '70%',
    backgroundColor: '#83c0e9',
    borderRadius: 0,
    padding: 20,
    maxHeight: '75%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  btnCloseSettings: {
    padding: 5,
  },

  icon: {
    fontSize: 24,
    color: 'black',
  },

  hr: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
  },

  modalBody: {
    flex: 1,
  },

  formGroup: {
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },

  sep: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 1,
  },

  modalFooter: {
    marginTop: 30,
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
    fontWeight: 'bold',
  },
});

/**
 * Stylesheet for the RNPickerSelect component.
 */
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: 'white',
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
