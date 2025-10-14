import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * Options for rendering `AlertComponent`.
 *
 * @interface AlertComponentOptions
 *
 * **Visibility & Timing:**
 * @property {boolean} visible Controls whether the alert modal is shown.
 * @property {number} [duration=4000] Auto-dismiss delay in milliseconds.
 *
 * **Content:**
 * @property {string} message Message text displayed inside the alert.
 * @property {'success' | 'danger'} [type='success'] Theme style applied to the alert badge.
 * @property {string} [textColor='black'] Text color override for the message.
 *
 * **Behaviour:**
 * @property {() => void} [onHide] Callback triggered when the alert is dismissed.
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [style] Additional styles for the centered container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the content rendered inside the modal card.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the entire modal implementation.
 */
export interface AlertComponentOptions {
  visible: boolean;
  message: string;
  type?: 'success' | 'danger';
  duration?: number;
  onHide?: () => void;
  textColor?: string;
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

export type AlertComponentType = (options: AlertComponentOptions) => JSX.Element;

/**
 * AlertComponent presents lightweight meeting alerts such as success or error notifications. It supports timed
 * dismissal, manual close taps, and override hooks for tailoring the rendered modal or its content.
 *
 * ### Key Features
 * - Auto-dismiss after configurable duration (default 4 seconds)
 * - Success (green) or danger (red) theme styles
 * - Tap-to-dismiss functionality
 * - Centered modal overlay with fade animation
 * - Render overrides for content and container
 *
 * ### Behavior
 * - Automatically hides after `duration` milliseconds
 * - Calls `onHide` callback on dismiss
 * - Dismissable by tapping the modal backdrop
 *
 * ### Accessibility
 * - Modal includes transparent backdrop
 * - Pressable area for dismissal
 * - Clear visual feedback for success/error states
 *
 * @example
 * ```tsx
 * // Basic success alert
 * <AlertComponent
 *   visible={showSuccess}
 *   message="Recording started successfully!"
 *   type="success"
 *   duration={3000}
 *   onHide={() => setShowSuccess(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Danger alert with custom text color
 * <AlertComponent
 *   visible={showError}
 *   message="Failed to connect to server"
 *   type="danger"
 *   textColor="#fff"
 *   duration={5000}
 *   onHide={() => setShowError(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom content and icon
 * <AlertComponent
 *   visible={showAlert}
 *   message="Participant joined"
 *   type="success"
 *   renderContent={({ defaultContent }) => (
 *     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
 *       <Icon name="check-circle" size={20} color="green" />
 *       {defaultContent}
 *     </View>
 *   )}
 *   onHide={() => setShowAlert(false)}
 * />
 * ```
 */
const AlertComponent: React.FC<AlertComponentOptions> = ({
  visible,
  message,
  type = 'success',
  duration = 4000,
  onHide,
  textColor = 'black',
  style,
  renderContent,
  renderContainer,
}) => {
  const [alertType, setAlertType] = useState<'success' | 'danger'>(type);

  useEffect(() => {
    if (type) {
      setAlertType(type);
    }
  }, [type]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      timer = setTimeout(() => {
        if (onHide) {onHide();}
      }, duration);
    }

    return () => {
      if (timer) {clearTimeout(timer);}
    };
  }, [visible, duration, onHide]);

  const handlePress = () => {
    if (onHide) {onHide();}
  };

  const dimensions = { width: 250, height: 0 };

  const defaultContent = (
    <Text style={[styles.modalText, { color: textColor }]}>
      {message}
    </Text>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handlePress}
    >
      <Pressable style={[styles.centeredView, style]} onPress={handlePress}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: alertType === 'success' ? 'green' : 'red' },
          ]}
        >
          {content}
        </View>
      </Pressable>
    </Modal>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 250,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AlertComponent;
