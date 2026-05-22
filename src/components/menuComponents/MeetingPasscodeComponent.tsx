// MeetingPasscodeComponent.tsx

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

/**
 * Props for the MeetingPasscodeComponent.
 */
export interface MeetingPasscodeComponentOptions {
  /**
   * The meeting passcode to display. Defaults to an empty string.
   */
  meetingPasscode?: string;
  isDarkMode?: boolean;
}

/**
 * MeetingPasscodeComponent displays a meeting passcode in a read-only input field.
 *
 * @component
 * @param {Object} props - Properties for configuring the MeetingPasscodeComponent.
 * @param {string} props.meetingPasscode - The meeting passcode to display.
 * @returns {JSX.Element} The MeetingPasscodeComponent.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MeetingPasscodeComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <MeetingPasscodeComponent meetingPasscode="123456" />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const MeetingPasscodeComponent: React.FC<MeetingPasscodeComponentOptions> = ({
  meetingPasscode = '',
  isDarkMode,
}) => {
  const themed = typeof isDarkMode === 'boolean';
  const textColor = themed ? (isDarkMode ? '#f8fafc' : '#0f172a') : '#000000';
  const inputBackgroundColor = themed ? (isDarkMode ? '#1e293b' : '#ffffff') : '#f0f0f0';
  const inputBorderColor = themed ? (isDarkMode ? 'rgba(226, 232, 240, 0.22)' : 'rgba(71, 85, 105, 0.28)') : 'gray';

  return (
  <View style={styles.formGroup}>
    <Text style={[styles.label, { color: textColor }] as any}>Event Passcode (Host):</Text>
    <TextInput
      style={[styles.disabledInput, { color: textColor, backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }] as any}
      value={meetingPasscode}
      editable={false}
      selectTextOnFocus={false}
        // Optionally, you can add more accessibility props
      accessibilityLabel="Event Passcode"
    />
  </View>
  );
};

export default MeetingPasscodeComponent;

/**
 * Stylesheet for the MeetingPasscodeComponent.
 */
const styles = StyleSheet.create({
  formGroup: {
    marginTop: 10,
    maxWidth: 300,
    width: '100%',
  },

  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 5,
  },

  disabledInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#f0f0f0',
    color: 'black',
    borderRadius: 5,
    fontSize: 16,
    width: '100%',
  },
});
