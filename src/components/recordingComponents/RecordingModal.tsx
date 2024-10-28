// RecordingModal.tsx

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Text,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StandardPanelComponent from './StandardPanelComponent';
import AdvancedPanelComponent from './AdvancedPanelComponent';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import {
  EventType,
  ConfirmRecordingType,
  StartRecordingType,
  ConfirmRecordingParameters,
  StartRecordingParameters,
} from '../../@types/types';

export interface RecordingModalParameters
  extends ConfirmRecordingParameters,
    StartRecordingParameters {
  recordPaused: boolean;
  recordingVideoType: string;
  recordingDisplayType: 'video' | 'media' | 'all';
  recordingBackgroundColor: string;
  recordingNameTagsColor: string;
  recordingOrientationVideo: string;
  recordingNameTags: boolean;
  recordingAddText: boolean;
  recordingCustomText: string;
  recordingCustomTextPosition: string;
  recordingCustomTextColor: string;
  recordingMediaOptions: string;
  recordingAudioOptions: string;
  recordingVideoOptions: string;
  recordingAddHLS: boolean;
  eventType: EventType;
  updateRecordingVideoType: (value: string) => void;
  updateRecordingDisplayType: (value: 'video' | 'media' | 'all') => void;
  updateRecordingBackgroundColor: (value: string) => void;
  updateRecordingNameTagsColor: (value: string) => void;
  updateRecordingOrientationVideo: (value: string) => void;
  updateRecordingNameTags: (value: boolean) => void;
  updateRecordingAddText: (value: boolean) => void;
  updateRecordingCustomText: (value: string) => void;
  updateRecordingCustomTextPosition: (value: string) => void;
  updateRecordingCustomTextColor: (value: string) => void;
  updateRecordingMediaOptions: (value: string) => void;
  updateRecordingAudioOptions: (value: string) => void;
  updateRecordingVideoOptions: (value: string) => void;
  updateRecordingAddHLS: (value: boolean) => void;

  // mediasfu functions
  getUpdatedAllParams: () => RecordingModalParameters;
  [key: string]: any;
}

export interface RecordingModalOptions {
  /**
   * Flag to control the visibility of the modal.
   */
  isRecordingModalVisible: boolean;

  /**
   * Callback function to handle the closing of the modal.
   */
  onClose: () => void;

  /**
   * Background color of the modal content.
   * Defaults to '#83c0e9'.
   */
  backgroundColor?: string;

  /**
   * Position of the modal on the screen.
   * Possible values: 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'.
   * Defaults to 'bottomRight'.
   */
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

  /**
   * Function to confirm recording settings.
   */
  confirmRecording: ConfirmRecordingType;

  /**
   * Function to start the recording.
   */
  startRecording: StartRecordingType;

  /**
   * Parameters for configuring the recording.
   */
  parameters: RecordingModalParameters;
}

export type RecordingModalType = (options: RecordingModalOptions) => JSX.Element;

/**
 * RecordingModal component renders a modal for recording settings.
 *
 * @param {RecordingModalOptions} props - The properties object.
 * @returns {JSX.Element} The rendered RecordingModal component.
 *
 * @example
 * ```tsx
 * <RecordingModal
 *   isRecordingModalVisible={isModalVisible}
 *   onClose={() => setModalVisible(false)}
 *   confirmRecording={handleConfirmRecording}
 *   startRecording={handleStartRecording}
 *   parameters={recordingParameters}
 * />
 * ```
 */
const RecordingModal: React.FC<RecordingModalOptions> = ({
  isRecordingModalVisible,
  onClose,
  backgroundColor = '#83c0e9',
  position = 'bottomRight',
  confirmRecording,
  startRecording,
  parameters,
}) => {
  const { recordPaused } = parameters;

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.75 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isRecordingModalVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              <FontAwesome name="bars" size={24} color="black" />
              {' Recording Settings'}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="black" />
            </Pressable>
          </View>

          <View style={styles.separator} />

          {/* Modal Body */}
          <View style={styles.modalBody}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.listGroup}>
                <StandardPanelComponent parameters={parameters} />
                <AdvancedPanelComponent parameters={parameters} />
              </View>
            </ScrollView>
          </View>

          <View style={styles.separator} />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={() => confirmRecording({ parameters })}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
            {!recordPaused && (
              <Pressable
                style={[styles.button, styles.startButton]}
                onPress={() => startRecording({ parameters })}
              >
                <Text style={styles.buttonText}>
                  Start <FontAwesome name="play" size={16} color="black" />
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RecordingModal;

/**
 * Stylesheet for the RecordingModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
  },
  modalContent: {
    height: '75%',
    backgroundColor: '#ffffff', // Default background color
    borderRadius: 10,
    padding: 15,
    maxHeight: '80%',
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 9,
    zIndex: 9,
  },
  scrollView: {
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',

  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  startButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
  listGroup: {
    margin: 0,
    padding: 0,
  },
});
