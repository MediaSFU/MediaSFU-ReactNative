import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import LoadingModal, { LoadingModalOptions } from '../../components/displayComponents/LoadingModal';
import { getModernColors, getModernModalCardStyle, resolveIsDarkMode } from '../core/modernTheme';

export type ModernLoadingModalOptions = LoadingModalOptions & { isDarkMode?: boolean; parameters?: any };

export const ModernLoadingModal: React.FC<ModernLoadingModalOptions> = (props) => {
  const isDarkMode = resolveIsDarkMode(props);
  const colors = getModernColors(isDarkMode);

  return (
    <LoadingModal
      {...props}
      backgroundColor={props.backgroundColor ?? (isDarkMode ? 'rgba(15, 23, 42, 0.46)' : 'rgba(15, 23, 42, 0.22)')}
      displayColor={props.displayColor ?? colors.accent}
      renderContent={
        props.renderContent ??
        (() => (
          <View style={[styles.content, getModernModalCardStyle(isDarkMode)]}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
          </View>
        ))
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    minWidth: 180,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ModernLoadingModal;