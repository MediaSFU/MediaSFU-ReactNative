import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { modernColors, modernPanelStyle } from './modernTheme';

export interface ModernSurfaceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ModernSurface: React.FC<ModernSurfaceProps> = ({ children, style }) => (
  <View style={[styles.surface, style]}>{children}</View>
);

const styles = StyleSheet.create({
  surface: {
    ...modernPanelStyle,
    backgroundColor: modernColors.surfaceStrong,
  },
});

export default ModernSurface;