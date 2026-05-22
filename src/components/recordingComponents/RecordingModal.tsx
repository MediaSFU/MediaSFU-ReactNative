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
  StyleProp,
  ViewStyle,
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

/**
 * Configuration options for the `RecordingModal` component.
 *
 * @interface RecordingModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isRecordingModalVisible Controls visibility of the recording modal.
 * @property {() => void} onClose Invoked when the modal should close.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='#83c0e9'] Background color applied to the modal surface.
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'} [position='bottomRight'] Anchor position for modal placement.
 * @property {StyleProp<ViewStyle>} [style] Additional styles merged into the modal container.
 *
 * **Recording Actions:**
 * @property {ConfirmRecordingType} confirmRecording Callback to confirm configured recording settings prior to start.
 * @property {StartRecordingType} startRecording Handler invoked to begin recording after confirmation.
 *
 * **State Parameters:**
 * @property {RecordingModalParameters} parameters Parameter bundle including recording preferences and update helpers.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for customizing the internal panel layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for swapping the modal container (e.g., animated wrappers).
 */
export interface RecordingModalOptions {
  isRecordingModalVisible: boolean;
  onClose: () => void;
  backgroundColor?: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  isDarkMode?: boolean;
  confirmRecording: ConfirmRecordingType;
  startRecording: StartRecordingType;
  parameters: RecordingModalParameters;
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

export type RecordingModalType = (options: RecordingModalOptions) => JSX.Element;

type RecordingDisplayAdviceParameters = {
  meetingDisplayType?: string;
  breakOutRoomStarted?: boolean;
  breakOutRoomEnded?: boolean;
  recordingVideoParticipantsFullRoomSupport?: boolean;
  recordingVideoOptions?: string;
  recordingMediaOptions?: string;
};

const getRecordingDisplayAdvice = (parameters?: RecordingDisplayAdviceParameters) => {
  if (!parameters) {
    return null;
  }

  const normalizedRecordingMediaOptions =
    parameters.recordingMediaOptions === 'all' ? 'video' : parameters.recordingMediaOptions;

  if (
    !parameters.recordingVideoParticipantsFullRoomSupport &&
    parameters.recordingVideoOptions === 'all' &&
    normalizedRecordingMediaOptions === 'video' &&
    parameters.meetingDisplayType === 'all' &&
    !(parameters.breakOutRoomStarted && !parameters.breakOutRoomEnded)
  ) {
    return 'Meeting display is set to All. This recording setup may be blocked. Switch the meeting display to Media before confirming so only participants with active media are included.';
  }

  return null;
};

/**
 * RecordingModal orchestrates both standard and advanced recording preferences prior to capture. It
 * surfaces panels for video layout, overlays, audio/media mixes, and HLS configuration, while
 * supporting override hooks for custom UI shells.
 *
 * ### Key Features
 * - Consolidates standard & advanced panels for holistic recording setup.
 * - Integrates confirm/start callbacks to coordinate recording workflow.
 * - Exposes update handlers for colors, text overlays, and media mixes via `parameters`.
 * - Anchorable to any screen corner and themable through props.
 * - Supports render overrides for bespoke container or panel presentations.
 *
 * ### Accessibility
 * - Control buttons include accessibility roles and descriptive labels.
 * - ScrollView ensures all settings remain reachable with assistive technologies.
 *
 * @param {RecordingModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered recording configuration modal.
 *
 * @example Toggle recording parameters with default layout.
 * ```tsx
 * <RecordingModal
 *   isRecordingModalVisible={visible}
 *   onClose={close}
 *   confirmRecording={confirmRecording}
 *   startRecording={startRecording}
 *   parameters={recordingParams}
 * />
 * ```
 *
 * @example Dark-themed modal with custom container override.
 * ```tsx
 * <RecordingModal
 *   isRecordingModalVisible
 *   onClose={handleDismiss}
 *   confirmRecording={handleConfirm}
 *   startRecording={handleStart}
 *   backgroundColor="#0f172a"
 *   style={{ borderRadius: 24 }}
 *   parameters={params}
 *   renderContainer={({ defaultContainer }) => (
 *     <SlideUp>{defaultContainer}</SlideUp>
 *   )}
 * />
 * ```
 */

const RecordingModal: React.FC<RecordingModalOptions> = ({
  isRecordingModalVisible,
  onClose,
  backgroundColor = '#83c0e9',
  position = 'bottomRight',
  isDarkMode,
  confirmRecording,
  startRecording,
  parameters,
  style,
  renderContent,
  renderContainer,
}) => {
  if (!isRecordingModalVisible) {
    return null;
  }

  const { recordPaused } = parameters;
  const recordingDisplayAdvice = getRecordingDisplayAdvice(parameters);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.75 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  const dimensions = { width: modalWidth, height: 0 };
  const themed = typeof isDarkMode === 'boolean';
  const textColor = themed ? (isDarkMode ? '#f8fafc' : '#0f172a') : 'black';
  const borderColor = themed ? (isDarkMode ? 'rgba(226, 232, 240, 0.18)' : 'rgba(71, 85, 105, 0.22)') : '#000000';

  const defaultContent = (
    <>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={[styles.modalTitle, { color: textColor }] as any}>
          <FontAwesome name="bars" size={24} color={textColor} />
          {' Recording Settings'}
        </Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <FontAwesome name="times" size={24} color={textColor} />
        </Pressable>
      </View>

      <View style={[styles.separator, { backgroundColor: borderColor }] as any} />

      {/* Modal Body */}
      <View style={styles.modalBody}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.listGroup}>
            <StandardPanelComponent parameters={{ ...parameters, isDarkMode }} />
            <AdvancedPanelComponent parameters={{ ...parameters, isDarkMode }} />
          </View>
        </ScrollView>
      </View>

      <View style={[styles.separator, { backgroundColor: borderColor }] as any} />

      {/* Action Buttons */}
      {recordingDisplayAdvice && (
        <View style={styles.adviceBox}>
          <Text style={[styles.adviceText, { color: textColor }] as any}>{recordingDisplayAdvice}</Text>
        </View>
      )}
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
              Start <FontAwesome name="play" size={16} color="#ffffff" />
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="slide"
      visible={isRecordingModalVisible}
      onRequestClose={onClose}
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
  adviceBox: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },
  adviceText: {
    color: 'black',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
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
