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
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Configuration parameters for `DisplaySettingsModal`.
 *
 * @interface DisplaySettingsModalParameters
 * @extends ModifyDisplaySettingsParameters
 *
 * **Display Configuration:**
 * @property {string} meetingDisplayType Current display mode (`'video'`, `'media'`, `'all'`).
 * @property {boolean} autoWave Whether participant auto-wave animations are enabled.
 * @property {boolean} forceFullDisplay Forces full-screen display mode when true.
 * @property {boolean} meetingVideoOptimized Indicates if video rendering is optimized for performance.
 */
export interface DisplaySettingsModalParameters
  extends ModifyDisplaySettingsParameters {
  meetingDisplayType: string;
  autoWave: boolean;
  forceFullDisplay: boolean;
  meetingVideoOptimized: boolean;
}

/**
 * Configuration options for the `DisplaySettingsModal` component.
 *
 * @interface DisplaySettingsModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isDisplaySettingsModalVisible Toggles modal visibility.
 * @property {() => void} onDisplaySettingsClose Invoked when the settings modal should close.
 *
 * **Settings Handler:**
 * @property {(options: ModifyDisplaySettingsOptions) => Promise<void>} [onModifyDisplaySettings=modifyDisplaySettings]
 * Custom handler for persisting updated display settings.
 *
 * **State Parameters:**
 * @property {DisplaySettingsModalParameters} parameters Current display configuration state.
 *
 * **Customization:**
 * @property {'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'} [position='topRight'] Preferred modal anchor location.
 * @property {string} [backgroundColor='#83c0e9'] Modal background color.
 * @property {StyleProp<ViewStyle>} [style] Additional styling applied to the modal container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the default content layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for the outer modal container.
 */
export interface DisplaySettingsModalOptions {
  isDisplaySettingsModalVisible: boolean;
  onDisplaySettingsClose: () => void;
  onModifyDisplaySettings?: (
    options: ModifyDisplaySettingsOptions
  ) => Promise<void>;
  parameters: DisplaySettingsModalParameters;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;

  // Render props for enhanced customization
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

export type DisplaySettingsModalType = (
  options: DisplaySettingsModalOptions
) => JSX.Element;

/**
 * DisplaySettingsModal centralizes MediaSFU meeting display preferences in a compact, accessible modal.
 * It supports rapid toggling of audiographs, full-screen overrides, and video optimization, and exposes
 * convenient render overrides for advanced UI customization.
 *
 * ### Key Features
 * - Connects directly to `modifyDisplaySettings` to persist layout changes.
 * - Provides toggles for auto-wave animations, force display, and video prioritization.
 * - Supports anchored positioning (`topRight`, `topLeft`, `bottomRight`, `bottomLeft`).
 * - Allows render overrides for both the modal container and internal content.
 *
 * ### Accessibility
 * - Switch interactions are wrapped in `Pressable` components with accessibility roles and labels.
 * - Close button exposes assistive text and supports keyboard/screen-reader activation.
 *
 * @param {DisplaySettingsModalOptions} props Configuration options controlling modal visibility, styling, and handlers.
 *
 * @example Basic usage toggling display options within a meeting controller.
 * ```tsx
 * import React, { useState } from 'react';
 * import { View, Button } from 'react-native';
 * import { DisplaySettingsModal } from 'mediasfu-reactnative';
 *
 * export function MeetingControls() {
 *   const [visible, setVisible] = useState(false);
 *
 *   return (
 *     <View>
 *       <Button title="Display Settings" onPress={() => setVisible(true)} />
 *       <DisplaySettingsModal
 *         isDisplaySettingsModalVisible={visible}
 *         onDisplaySettingsClose={() => setVisible(false)}
 *         parameters={{
 *           meetingDisplayType: 'video',
 *           autoWave: true,
 *           forceFullDisplay: false,
 *           meetingVideoOptimized: false,
 *           getUpdatedAllParams: () => ({}),
 *         }}
 *       />
 *     </View>
 *   );
 * }
 * ```
 *
 * @example Advanced override replacing the modal container with a custom sheet implementation.
 * ```tsx
 * <DisplaySettingsModal
 *   isDisplaySettingsModalVisible={visible}
 *   onDisplaySettingsClose={handleClose}
 *   parameters={parameters}
 *   renderContainer={({ defaultContainer }) => (
 *     <CustomSheet onDismiss={handleClose}>{defaultContainer}</CustomSheet>
 *   )}
 *   renderContent={({ defaultContent }) => (
 *     <ScrollView>{defaultContent}</ScrollView>
 *   )}
 * />
 * ```
 */

const DisplaySettingsModal: React.FC<DisplaySettingsModalOptions> = ({
  isDisplaySettingsModalVisible,
  onDisplaySettingsClose,
  onModifyDisplaySettings = modifyDisplaySettings,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  style,
  renderContent,
  renderContainer,
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

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <>
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
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={isDisplaySettingsModalVisible}
      onRequestClose={onDisplaySettingsClose}
    >
  <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }, style]}>
          {content}
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
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
