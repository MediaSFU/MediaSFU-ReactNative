// EventSettingsModal.tsx

import React, { useState, useEffect } from 'react';
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
import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';
import { modifySettings, ModifySettingsOptions } from '../../methods/settingsMethods/modifySettings';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Parameters supplied to `EventSettingsModal` for contextual state and server communication.
 *
 * @interface EventSettingsModalParameters
 *
 * **Display Preferences:**
 * @property {string} meetingDisplayType Current display mode selection (`'video' | 'media' | 'all'`).
 * @property {boolean} autoWave Whether auto-wave (audiograph) animations are enabled.
 * @property {boolean} forceFullDisplay Forces full-grid display regardless of active speaker.
 * @property {boolean} meetingVideoOptimized Indicates if video layout is optimized for performance.
 *
 * **Session Context:**
 * @property {string} roomName Active room identifier.
 * @property {Socket} socket Socket connection used when persisting settings.
 * @property {ShowAlert} [showAlert] Optional alert helper for user feedback.
 */
export interface EventSettingsModalParameters {
  meetingDisplayType: string;
  autoWave: boolean;
  forceFullDisplay: boolean;
  meetingVideoOptimized: boolean;
  roomName: string;
  socket: Socket;
  showAlert?: ShowAlert;
}

/**
 * Configuration options for the `EventSettingsModal` component.
 *
 * @interface EventSettingsModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isEventSettingsModalVisible Controls visibility state.
 * @property {() => void} onEventSettingsClose Invoked when the modal should close.
 *
 * **Settings Actions:**
 * @property {(options: ModifySettingsOptions) => Promise<void>} [onModifyEventSettings=modifySettings] Handler to persist updated settings.
 *
 * **Appearance:**
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'} [position='topRight'] Preferred anchor location.
 * @property {string} [backgroundColor='#83c0e9'] Background color for the modal card.
 * @property {StyleProp<ViewStyle>} [style] Additional styling for the modal container.
 *
 * **Permission Settings:**
 * @property {string} audioSetting Initial audio participant rule.
 * @property {string} videoSetting Initial video participant rule.
 * @property {string} screenshareSetting Initial screenshare rule.
 * @property {string} chatSetting Initial chat rule.
 *
 * **State Updaters:**
 * @property {(setting: string) => void} updateAudioSetting Persists audio rule updates.
 * @property {(setting: string) => void} updateVideoSetting Persists video rule updates.
 * @property {(setting: string) => void} updateScreenshareSetting Persists screenshare rule updates.
 * @property {(setting: string) => void} updateChatSetting Persists chat rule updates.
 * @property {(isVisible: boolean) => void} updateIsSettingsModalVisible Updates visibility flag from external triggers.
 *
 * **Session Context:**
 * @property {string} roomName Room identifier forwarded to the backend.
 * @property {Socket} socket Active socket connection used for updates.
 * @property {ShowAlert} [showAlert] Optional alert helper for in-modal feedback.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for customizing the internal layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for swapping the modal container implementation.
 */
export interface EventSettingsModalOptions {
  isEventSettingsModalVisible: boolean;
  onEventSettingsClose: () => void;
  onModifyEventSettings?: (options: ModifySettingsOptions) => Promise<void>;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  backgroundColor?: string;
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  updateAudioSetting: (setting: string) => void;
  updateVideoSetting: (setting: string) => void;
  updateScreenshareSetting: (setting: string) => void;
  updateChatSetting: (setting: string) => void;
  updateIsSettingsModalVisible: (isVisible: boolean) => void;
  roomName: string;
  socket: Socket;
  showAlert?: ShowAlert;
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

export type EventSettingsModalType = (options: EventSettingsModalOptions) => JSX.Element;

/**
 * EventSettingsModal enables hosts to adjust meeting-level permissions (audio, video, screenshare, chat)
 * in real time. It synchronizes with socket-based updates and exposes override hooks for custom layouts
 * or animated containers.
 *
 * ### Key Features
 * - Maps participant permission rules to intuitive picker controls.
 * - Persists changes using `modifySettings` by default, with override support.
 * - Provides render overrides and style props for bespoke UI.
 * - Leverages `updateIsSettingsModalVisible` for external state coordination.
 * - Supports corner anchoring and color theming.
 *
 * ### Accessibility
 * - Close button includes assistive labels for screen readers.
 * - Picker controls support keyboard navigation and voiceover prompts.
 *
 * @param {EventSettingsModalOptions} props Modal configuration options.
 * @returns {JSX.Element} Rendered event settings modal.
 *
 * @example Default configuration with host-managed settings.
 * ```tsx
 * <EventSettingsModal
 *   isEventSettingsModalVisible={visible}
 *   onEventSettingsClose={hide}
 *   audioSetting={audio}
 *   videoSetting={video}
 *   screenshareSetting={screen}
 *   chatSetting={chat}
 *   updateAudioSetting={setAudio}
 *   updateVideoSetting={setVideo}
 *   updateScreenshareSetting={setScreen}
 *   updateChatSetting={setChat}
 *   updateIsSettingsModalVisible={setVisible}
 *   roomName={roomId}
 *   socket={socket}
 * />
 * ```
 *
 * @example Customized handler with animated container.
 * ```tsx
 * <EventSettingsModal
 *   {...props}
 *   onModifyEventSettings={saveEventSettings}
 *   backgroundColor="#0f172a"
 *   style={{ borderRadius: 24 }}
 *   renderContainer={({ defaultContainer }) => (
 *     <FadeIn>{defaultContainer}</FadeIn>
 *   )}
 * />
 * ```
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
  style,
  renderContent,
  renderContainer,
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

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
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
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={isEventSettingsModalVisible}
      onRequestClose={onEventSettingsClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }, style]}>
          {content}
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
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
