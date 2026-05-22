import { StyleSheet } from 'react-native';

export interface ModalBodyTheme {
  textColor: string;
  mutedTextColor: string;
  iconColor: string;
  borderColor: string;
  dividerColor: string;
  inputBackgroundColor: string;
  inputTextColor: string;
  placeholderTextColor: string;
  rowBackgroundColor: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  dangerColor: string;
  successColor: string;
  accentColor: string;
}

export const getModalBodyTheme = (isDarkMode?: boolean): ModalBodyTheme => {
  if (typeof isDarkMode !== 'boolean') {
    return {
      textColor: 'black',
      mutedTextColor: 'gray',
      iconColor: 'black',
      borderColor: 'gray',
      dividerColor: 'black',
      inputBackgroundColor: 'white',
      inputTextColor: 'black',
      placeholderTextColor: 'gray',
      rowBackgroundColor: '#ffffff',
      badgeBackgroundColor: '#ffffff',
      badgeTextColor: '#000000',
      buttonBackgroundColor: 'black',
      buttonTextColor: 'white',
      dangerColor: 'red',
      successColor: 'green',
      accentColor: '#83c0e9',
    };
  }

  if (isDarkMode) {
    return {
      textColor: '#f8fafc',
      mutedTextColor: '#cbd5e1',
      iconColor: '#f8fafc',
      borderColor: 'rgba(148, 163, 184, 0.35)',
      dividerColor: 'rgba(226, 232, 240, 0.18)',
      inputBackgroundColor: 'rgba(15, 23, 42, 0.72)',
      inputTextColor: '#f8fafc',
      placeholderTextColor: '#94a3b8',
      rowBackgroundColor: 'rgba(15, 23, 42, 0.46)',
      badgeBackgroundColor: 'rgba(59, 130, 246, 0.22)',
      badgeTextColor: '#dbeafe',
      buttonBackgroundColor: '#2563eb',
      buttonTextColor: '#ffffff',
      dangerColor: '#f87171',
      successColor: '#22c55e',
      accentColor: '#38bdf8',
    };
  }

  return {
    textColor: '#0f172a',
    mutedTextColor: '#475569',
    iconColor: '#0f172a',
    borderColor: 'rgba(71, 85, 105, 0.24)',
    dividerColor: 'rgba(71, 85, 105, 0.22)',
    inputBackgroundColor: '#ffffff',
    inputTextColor: '#0f172a',
    placeholderTextColor: '#64748b',
    rowBackgroundColor: 'rgba(255, 255, 255, 0.78)',
    badgeBackgroundColor: 'rgba(37, 99, 235, 0.12)',
    badgeTextColor: '#1d4ed8',
    buttonBackgroundColor: '#2563eb',
    buttonTextColor: '#ffffff',
    dangerColor: '#dc2626',
    successColor: '#16a34a',
    accentColor: '#2563eb',
  };
};

export const createThemedPickerSelectStyles = (theme: ModalBodyTheme) =>
  StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      color: theme.inputTextColor,
      paddingRight: 30,
      backgroundColor: theme.inputBackgroundColor,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      color: theme.inputTextColor,
      paddingRight: 30,
      backgroundColor: theme.inputBackgroundColor,
      marginVertical: 5,
    },
    inputWeb: {
      fontSize: 14,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      color: theme.inputTextColor,
      paddingRight: 30,
      backgroundColor: theme.inputBackgroundColor,
      marginBottom: 10,
    },
    placeholder: {
      color: theme.placeholderTextColor,
    },
  });