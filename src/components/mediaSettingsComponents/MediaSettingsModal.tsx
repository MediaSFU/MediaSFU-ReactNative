// MediaSettingsModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select'; // Install using: npm install react-native-picker-select
import { switchAudio, SwitchAudioOptions, SwitchAudioParameters } from '../../methods/streamMethods/switchAudio';
import { switchVideo, SwitchVideoOptions, SwitchVideoParameters } from '../../methods/streamMethods/switchVideo';
import { switchVideoAlt, SwitchVideoAltOptions, SwitchVideoAltParameters } from '../../methods/streamMethods/switchVideoAlt';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Interface defining the parameters required by the MediaSettingsModal component.
 */
export interface MediaSettingsModalParameters extends SwitchAudioParameters, SwitchVideoParameters, SwitchVideoAltParameters {
  userDefaultVideoInputDevice: string;
  videoInputs: MediaDeviceInfo[];
  audioInputs: MediaDeviceInfo[];
  userDefaultAudioInputDevice: string;
  isBackgroundModalVisible: boolean;
  updateIsBackgroundModalVisible: (visible: boolean) => void;

  // mediasfu functions
  getUpdatedAllParams: () => MediaSettingsModalParameters;
  // [key: string]: any;
}

/**
 * Interface defining the options (props) for the MediaSettingsModal component.
 */
export interface MediaSettingsModalOptions {
  /**
   * Determines if the media settings modal is visible.
   */
  isMediaSettingsModalVisible: boolean;

  /**
   * Callback function to close the media settings modal.
   */
  onMediaSettingsClose: () => void;

  /**
   * Function to handle camera switch action.
   * @default switchVideoAlt
   */
  switchCameraOnPress?: (options: SwitchVideoAltOptions) => Promise<void>;

  /**
   * Function to handle video input switch action.
   * @default switchVideo
   */
  switchVideoOnPress?: (options: SwitchVideoOptions) => Promise<void>;

  /**
   * Function to handle audio input switch action.
   * @default switchAudio
   */
  switchAudioOnPress?: (options: SwitchAudioOptions) => Promise<void>;

  /**
   * Parameters containing user default devices and available devices.
   */
  parameters: MediaSettingsModalParameters;

  /**
   * Position of the modal on the screen.
   * @default "topRight"
   */
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

  /**
   * Background color of the modal.
   * @default "#83c0e9"
   */
  backgroundColor?: string;
}

export type MediaSettingsModalType = (options: MediaSettingsModalOptions) => JSX.Element;

/**
 * MediaSettingsModal - A React Native component for displaying a modal to manage media settings.
 *
 * @component
 * @param {MediaSettingsModalOptions} props - The properties passed to the MediaSettingsModal component.
 * @returns {JSX.Element} - The MediaSettingsModal component JSX element.
 */
const MediaSettingsModal: React.FC<MediaSettingsModalOptions> = ({
  isMediaSettingsModalVisible,
  onMediaSettingsClose,
  switchCameraOnPress = switchVideoAlt,
  switchVideoOnPress = switchVideo,
  switchAudioOnPress = switchAudio,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const {
    userDefaultVideoInputDevice,
    videoInputs,
    audioInputs,
    userDefaultAudioInputDevice,
    // isBackgroundModalVisible,
    // updateIsBackgroundModalVisible,
  } = parameters;


  const [selectedVideoInput, setSelectedVideoInput] = useState<string>(userDefaultVideoInputDevice);
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>(userDefaultAudioInputDevice);

  const [modalWidth, setModalWidth] = useState<number>(0.8 * Dimensions.get('window').width);

  useEffect(() => {
    const updateDimensions = () => {
      let width = 0.8 * Dimensions.get('window').width;
      if (width > 400) {
        width = 400;
      }
      setModalWidth(width);
    };

    const subscribe = Dimensions.addEventListener('change', updateDimensions);
    // Initial call
    updateDimensions();

    return () => {
      subscribe.remove();
    };
  }, []);

  /**
   * Handles switching the camera.
   */
  const handleSwitchCamera = async () => {
    try {
      await switchCameraOnPress({ parameters });
    } catch (error) {
      console.error('Failed to switch camera:', error);
      // Optionally, implement alert or toast
    }
  };

  /**
   * Handles switching the video input device.
   * @param {string} value - The device ID of the selected video input.
   */
  const handleVideoSwitch = async (value: string) => {
    if (value !== selectedVideoInput) {
      setSelectedVideoInput(value);
      try {
        await switchVideoOnPress({ videoPreference: value, parameters });
      } catch (error) {
        console.error('Failed to switch video input:', error);
        // Optionally, implement alert or toast
      }
    }
  };

  /**
   * Handles switching the audio input device.
   * @param {string} value - The device ID of the selected audio input.
   */
  const handleAudioSwitch = async (value: string) => {
    if (value !== selectedAudioInput) {
      setSelectedAudioInput(value);
      try {
        await switchAudioOnPress({ audioPreference: value, parameters });
      } catch (error) {
        console.error('Failed to switch audio input:', error);
        // Optionally, implement alert or toast
      }
    }
  };

  /**
   * Toggles the virtual background modal visibility.
   */
  // const toggleVirtualBackground = () => {
  //   updateIsBackgroundModalVisible(!isBackgroundModalVisible);
  // };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isMediaSettingsModalVisible}
      onRequestClose={onMediaSettingsClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Media Settings</Text>
            <Pressable
              onPress={onMediaSettingsClose}
              style={styles.btnCloseMediaSettings}
              accessibilityRole="button"
              accessibilityLabel="Close Media Settings Modal"
            >
              <FontAwesome5 name="times" style={styles.icon} />
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.hr} />

          {/* Body */}
          <View style={styles.modalBody}>
            {/* Select Camera */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <FontAwesome5 name="camera" size={16} color="black" />
                Select Camera:
              </Text>
              <RNPickerSelect
                onValueChange={(value: string) => handleVideoSwitch(value)}
                items={videoInputs.map((input) => ({
                  label: input.label || `Camera ${input.deviceId}`,
                  value: input.deviceId,
                }))}
                value={selectedVideoInput || ''}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a camera...', value: '' }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* Select Microphone */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <FontAwesome5 name="microphone" size={16} color="black" />
                Select Microphone:
              </Text>
              <RNPickerSelect
                onValueChange={(value: string) => handleAudioSwitch(value)}
                items={audioInputs.map((input) => ({
                  label: input.label || `Microphone ${input.deviceId}`,
                  value: input.deviceId,
                }))}
                value={selectedAudioInput || ''}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a microphone...', value: '' }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* Switch Camera Button */}
            <View style={styles.formGroup}>
              <Pressable
                onPress={handleSwitchCamera}
                style={styles.switchCameraButton}
                accessibilityRole="button"
                accessibilityLabel="Switch Camera"
              >
                <Text style={styles.switchCameraButtonText}>
                  <FontAwesome5 name="sync-alt" size={16} color="black" />
                  Switch Camera
                </Text>
              </Pressable>
            </View>

            {/* Separator */}
            {/* <View style={styles.sep} /> */}

            {/* Virtual Background Button  - Not implemented */}
            {/* <View style={styles.formGroup}>
              <Pressable
                onPress={toggleVirtualBackground}
                style={styles.virtualBackgroundButton}
                accessibilityRole="button"
                accessibilityLabel="Toggle Virtual Background"
              >
                <Text style={styles.virtualBackgroundButtonText}>
                  <FontAwesome5 name="photo-video" size={16} color="black" />
                  {' '}
                  Virtual Background
                </Text>
              </Pressable>
            </View> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaSettingsModal;

/**
 * Stylesheet for the MediaSettingsModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    height: '65%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 10,
    maxHeight: '65%',
    maxWidth: '80%',
    overflow: 'scroll',
    borderWidth: 2,
    borderColor: 'black',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 9,
    zIndex: 9,
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

  btnCloseMediaSettings: {
    padding: 5,
  },

  icon: {
    fontSize: 20,
    color: 'black',
  },

  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 15,
  },

  modalBody: {
    padding: 10,
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },

  picker: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },

  switchCameraButton: {
    backgroundColor: '#8cd3ff',
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },

  switchCameraButtonText: {
    color: 'black',
    fontSize: 20,
  },

  virtualBackgroundButton: {
    backgroundColor: '#8cd3ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  virtualBackgroundButtonText: {
    color: 'black',
    fontSize: 16,
  },

  sep: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 5,
  },
});

/**
 * Stylesheet for the RNPickerSelect component.
 */
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: 'white',
    marginVertical: 5,
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
