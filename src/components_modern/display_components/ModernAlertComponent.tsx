import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AlertComponent, { AlertComponentOptions } from '../../components/displayComponents/AlertComponent';
import { getModernColors, getModernModalCardStyle, resolveIsDarkMode } from '../core/modernTheme';

export type ModernAlertComponentOptions = AlertComponentOptions & { isDarkMode?: boolean; parameters?: any };

export const ModernAlertComponent: React.FC<ModernAlertComponentOptions> = (props) => {
  const isDarkMode = resolveIsDarkMode(props);
  const colors = getModernColors(isDarkMode);
  const accentColor = props.type === 'danger' ? colors.danger : colors.success;
  const defaultContent = (
    <View style={[styles.row, getModernModalCardStyle(isDarkMode)]}>
      <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
      <Text style={[styles.text, { color: colors.text }]}>{props.message}</Text>
    </View>
  );
  const renderContent = props.renderContent ?? (() => defaultContent);

  return (
    <AlertComponent
      {...props}
      textColor={props.textColor ?? colors.invertedText}
      renderContent={renderContent}
      renderContainer={
        props.renderContainer ??
        (({ dimensions }) => (
          <Modal
            transparent
            animationType="fade"
            visible={props.visible}
            onRequestClose={props.onHide}
          >
            <Pressable style={[styles.overlay, props.style] as any} onPress={props.onHide}>
              <Pressable
                onPress={(event: any) => event?.stopPropagation?.()}
                style={[styles.toastShell, { borderColor: accentColor }]}
              >
                {renderContent({ defaultContent, dimensions })}
              </Pressable>
            </Pressable>
          </Modal>
        ))
      }
    />
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
    paddingHorizontal: 20,
  },
  toastShell: {
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ModernAlertComponent;