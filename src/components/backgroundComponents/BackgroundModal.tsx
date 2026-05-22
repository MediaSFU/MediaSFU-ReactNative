import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { getModalBodyTheme } from '../../components_modern/core/modalBodyTheme';
import { getModalPosition } from '../../methods/utils/getModalPosition';

interface BackgroundModalProps {
  isBackgroundModalVisible?: boolean;
  onBackgroundClose?: () => void;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  parameters?: any;
  isDarkMode?: boolean;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => React.ReactNode;
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isBackgroundModalVisible = false,
  onBackgroundClose,
  backgroundColor,
  style,
  isDarkMode,
  position = 'center',
  renderContainer,
}) => {
  if (!isBackgroundModalVisible) {
    return null;
  }

  const theme = getModalBodyTheme(isDarkMode);
  const dimensions = { width: 420, height: 240 };

  const defaultContainer = (
    <Modal visible={isBackgroundModalVisible} transparent animationType="fade" onRequestClose={onBackgroundClose}>
      <View style={[styles.modalOverlay, getModalPosition({ position })]}>
        <View style={[styles.container, backgroundColor ? { backgroundColor } : null, { borderColor: theme.borderColor }, style]}>
          <Text style={[styles.text, { color: theme.textColor }]}>Virtual background is currently unsupported on native mobile devices.</Text>
          <TouchableOpacity onPress={onBackgroundClose} style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]}> 
            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  container: {
    width: '80%',
    maxWidth: 420,
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#475569'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
});

export default BackgroundModal;
