// DisplaySettingsModal.tsx

import React, { useState } from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select'; // Install using: npm install react-native-picker-select
import {
  modifyDisplaySettings,
  ModifyDisplaySettingsOptions,
  ModifyDisplaySettingsParameters,
} from '../../methods/displaySettingsMethods/modifyDisplaySettings';

export interface DisplaySettingsModalParameters
  extends ModifyDisplaySettingsParameters {
  meetingDisplayType: string;
  autoWave: boolean;
  forceFullDisplay: boolean;
  meetingVideoOptimized: boolean;
}

export interface DisplaySettingsModalOptions {
  isDisplaySettingsModalVisible: boolean;
  onDisplaySettingsClose: () => void;
  onModifyDisplaySettings?: (
    options: ModifyDisplaySettingsOptions
  ) => Promise<void>;
  parameters: DisplaySettingsModalParameters;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
}

export type DisplaySettingsModalType = (
  options: DisplaySettingsModalOptions
) => JSX.Element;

/**
 * DisplaySettingsModal - A modal component for managing display settings.
 *
 * @param {DisplaySettingsModalOptions} props - The properties passed to the DisplaySettingsModal component.
 * @returns {JSX.Element} - The DisplaySettingsModal component JSX element.
 */
const DisplaySettingsModal: React.FC<DisplaySettingsModalOptions> = ({
  isDisplaySettingsModalVisible,
  onDisplaySettingsClose,
  onModifyDisplaySettings = modifyDisplaySettings,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const {
    meetingDisplayType,
    autoWave,
    forceFullDisplay,
    meetingVideoOptimized,
  } = parameters;

  const [meetingDisplayTypeState, setMeetingDisplayTypeState] = useState<string>(meetingDisplayType);
  const [autoWaveState, setAutoWaveState] = useState<boolean>(autoWave);
  const [forceFullDisplayState, setForceFullDisplayState] = useState<boolean>(forceFullDisplay);
  const [meetingVideoOptimizedState, setMeetingVideoOptimizedState] = useState<boolean>(meetingVideoOptimized);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  /**
   * Handles saving the modified display settings.
   */
  const handleSaveSettings = async () => {
    await onModifyDisplaySettings({
      parameters: {
        ...parameters,
        meetingDisplayType: meetingDisplayTypeState,
        autoWave: autoWaveState,
        forceFullDisplay: forceFullDisplayState,
        meetingVideoOptimized: meetingVideoOptimizedState,
      },
    });
    onDisplaySettingsClose(); // Close modal after saving
  };

  /**
   * Determines the alignment style based on the 'position' prop.
   *
   * @param {string} pos - The position string ('topRight', 'topLeft', 'bottomRight', 'bottomLeft').
   * @returns {StyleProp<ViewStyle>} - The corresponding alignment style.
   */
  const getModalPosition = (pos: string): StyleProp<ViewStyle> => {
    const styles: { [key: string]: StyleProp<ViewStyle> } = {
      topRight: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      },
      topLeft: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      bottomRight: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
      bottomLeft: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      },
    };

    return styles[pos] || styles.topRight;
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isDisplaySettingsModalVisible}
      onRequestClose={onDisplaySettingsClose}
    >
      <View style={[styles.modalContainer, getModalPosition(position)]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Display Settings</Text>
            <Pressable onPress={onDisplaySettingsClose} style={styles.btnCloseSettings} accessibilityRole="button" accessibilityLabel="Close Display Settings">
              <FontAwesome name="times" style={styles.icon} />
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.hr} />

          {/* Body */}
          <View style={styles.modalBody}>
            {/* Display Option Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Display Option:</Text>
              <RNPickerSelect
                onValueChange={(value) => setMeetingDisplayTypeState(value)}
                items={[
                  { label: 'Video Participants Only', value: 'video' },
                  { label: 'Media Participants Only', value: 'media' },
                  { label: 'Show All Participants', value: 'all' },
                ]}
                value={meetingDisplayTypeState}
                style={pickerSelectStyles}
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* Display Audiographs Toggle */}
            <View style={styles.formCheck}>
              <Text style={styles.label}>Display Audiographs</Text>
              <Pressable onPress={() => setAutoWaveState(!autoWaveState)} accessibilityRole="switch" accessibilityLabel="Toggle Display Audiographs">
                <FontAwesome
                  name="check"
                  size={24}
                  color={autoWaveState ? 'green' : 'black'}
                />
              </Pressable>
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* Force Full Display Toggle */}
            <View style={styles.formCheck}>
              <Text style={styles.label}>Force Full Display</Text>
              <Pressable onPress={() => setForceFullDisplayState(!forceFullDisplayState)} accessibilityRole="switch" accessibilityLabel="Toggle Force Full Display">
                <FontAwesome
                  name="check"
                  size={24}
                  color={forceFullDisplayState ? 'green' : 'black'}
                />
              </Pressable>
            </View>

            {/* Separator */}
            <View style={styles.sep} />

            {/* Force Video Participants Toggle */}
            <View style={styles.formCheck}>
              <Text style={styles.label}>Force Video Participants</Text>
              <Pressable onPress={() => setMeetingVideoOptimizedState(!meetingVideoOptimizedState)} accessibilityRole="switch" accessibilityLabel="Toggle Force Video Participants">
                <FontAwesome
                  name="check"
                  size={24}
                  color={meetingVideoOptimizedState ? 'green' : 'black'}
                />
              </Pressable>
            </View>

            {/* Separator */}
            <View style={styles.sep} />
          </View>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <Pressable
              onPress={handleSaveSettings}
              style={styles.btnApplySettings}
              accessibilityRole="button"
              accessibilityLabel="Save Display Settings"
            >
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DisplaySettingsModal;

/**
 * Stylesheet for the DisplaySettingsModal component.
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
    borderRadius: 0,
    padding: 20,
    maxHeight: '65%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
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
});

/**
 * Stylesheet for the RNPickerSelect component.
 */
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 4,
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
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
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
