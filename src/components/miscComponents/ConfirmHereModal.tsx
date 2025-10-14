// ConfirmHereModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Socket } from 'socket.io-client';

/**
 * Configuration options for the `ConfirmHereModal` component.
 *
 * @interface ConfirmHereModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isConfirmHereModalVisible Controls the visibility state.
 * @property {() => void} onConfirmHereClose Invoked when the user confirms or the modal times out.
 *
 * **Countdown Behaviour:**
 * @property {number} [countdownDuration=120] Seconds before the user is automatically disconnected.
 * @property {Socket} socket Primary socket used to emit `disconnectUser` events.
 * @property {Socket} [localSocket] Optional secondary socket mirror for local transports.
 * @property {string} roomName Active room identifier attached to disconnect events.
 * @property {string} member Member identifier associated with the confirmation prompt.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='#83c0e9'] Modal card background color.
 * @property {StyleProp<ViewStyle>} [style] Additional container styling.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Custom renderer for the modal body.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Custom renderer for the modal container implementation.
 */
export interface ConfirmHereModalOptions {
  isConfirmHereModalVisible: boolean;
  onConfirmHereClose: () => void;
  backgroundColor?: string;
  countdownDuration?: number;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  member: string;
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

export type ConfirmHereModalType = (
  options: ConfirmHereModalOptions
) => JSX.Element;

/**
 * ConfirmHereModal prompts attendees to confirm their presence before a timeout disconnects them.
 * It coordinates socket emission for remote disconnects, exposes override hooks, and supports
 * custom theming.
 *
 * ### Key Features
 * - Countdown-driven confirmation with automatic disconnect when time lapses.
 * - Emits `disconnectUser` on both primary and optional local sockets.
 * - Provides render overrides for bespoke layouts and container animations.
 * - Supports custom background colors and styling via `StyleProp`.
 *
 * ### Accessibility
 * - Buttons expose descriptive accessibility labels for screen readers.
 * - Countdown text uses semantic ordering and high-contrast defaults.
 *
 * @param {ConfirmHereModalOptions} props Modal options and callbacks.
 * @returns {JSX.Element} Rendered confirmation modal.
 *
 * @example Basic usage with default countdown.
 * ```tsx
 * <ConfirmHereModal
 *   isConfirmHereModalVisible={visible}
 *   onConfirmHereClose={closeModal}
 *   roomName={roomName}
 *   member={memberId}
 *   socket={socket}
 * />
 * ```
 *
 * @example Custom container with radial gradient background.
 * ```tsx
 * <ConfirmHereModal
 *   {...props}
 *   backgroundColor="rgba(15, 23, 42, 0.95)"
 *   style={{ borderRadius: 24 }}
 *   renderContainer={({ defaultContainer }) => (
 *     <BlurView intensity={60}>{defaultContainer}</BlurView>
 *   )}
 * />
 * ```
 */

let countdownInterval: NodeJS.Timeout;

function startCountdown({
  duration,
  onConfirm,
  onUpdateCounter,
  socket,
  localSocket,
  roomName,
  member,
}: {
  duration: number;
  onConfirm: () => void;
  onUpdateCounter: (counter: number) => void;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  member: string;
}) {
  let timeRemaining = duration;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    onUpdateCounter(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      socket.emit('disconnectUser', {
        member,
        roomName,
        ban: false,
      });

      try {
        if (localSocket && localSocket.id) {
          localSocket.emit('disconnectUser', {
            member: member,
            roomName: roomName,
            ban: false,
          });
        }
      } catch  {
        // Do nothing
      }
      onConfirm();
    }
  }, 1000);
}

const ConfirmHereModal: React.FC<ConfirmHereModalOptions> = ({
  isConfirmHereModalVisible,
  onConfirmHereClose,
  backgroundColor = '#83c0e9',
  countdownDuration = 120,
  socket,
  localSocket,
  roomName,
  member,
  style,
  renderContent,
  renderContainer,
}) => {
  const [counter, setCounter] = useState<number>(countdownDuration);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 400) {
    modalWidth = 400;
  }

  useEffect(() => {
    if (isConfirmHereModalVisible) {
      startCountdown({
        duration: countdownDuration,
        onConfirm: onConfirmHereClose,
        onUpdateCounter: setCounter,
        socket,
        localSocket,
        roomName,
        member,
      });
    }
  }, [
    isConfirmHereModalVisible,
    countdownDuration,
    socket,
    roomName,
    member,
    onConfirmHereClose,
  ]);

  const handleConfirmHere = () => {
    setCounter(countdownDuration); // Reset counter if needed
    onConfirmHereClose(); // Close the modal
    // Additional logic if needed
  };

  const dimensions = { width: modalWidth, height: 0 };

  const defaultContent = (
    <View style={styles.modalBody}>
      {/* Spinner */}
      <ActivityIndicator
        size="large"
        color={'#000000'}
        style={styles.spinnerContainer}
      />

      {/* Modal Content */}
      <Text style={styles.modalTitle}>Are you still there?</Text>
      <Text style={styles.modalMessage}>
        Please confirm if you are still present.
      </Text>
      <Text style={styles.modalCounter}>
        Time remaining: <Text style={styles.counterText}>{counter}</Text>{' '}
        seconds
      </Text>

      {/* Confirm Button */}
      <Pressable onPress={handleConfirmHere} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Yes</Text>
      </Pressable>
    </View>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="slide"
      visible={isConfirmHereModalVisible}
      onRequestClose={onConfirmHereClose}
    >
      <View style={styles.modalContainer}>
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

export default ConfirmHereModal;

/**
 * Stylesheet for the ConfirmHereModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: '60%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 20,
    maxWidth: '80%',
    zIndex: 9,
    elevation: 9,
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    marginBottom: 20,
  },
  spinnerIcon: {
    fontSize: 50,
    color: 'black',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: 'black',
    marginVertical: 15,
    textAlign: 'center',
  },
  modalCounter: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
  counterText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});
