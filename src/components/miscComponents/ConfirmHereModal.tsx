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
} from 'react-native';
import { Socket } from 'socket.io-client';

export interface ConfirmHereModalOptions {
  isConfirmHereModalVisible: boolean;
  onConfirmHereClose: () => void;
  backgroundColor?: string;
  countdownDuration?: number;
  socket: Socket;
  roomName: string;
  member: string;
}

export type ConfirmHereModalType = (
  options: ConfirmHereModalOptions
) => JSX.Element;

/**
 * ConfirmHereModal is a React Native functional component that displays a modal asking the user
 * to confirm their presence. If the user does not confirm within the countdown duration,
 * it emits a 'disconnectUser' event via Socket.io.
 *
 * @component
 * @param {ConfirmHereModalOptions} props - The properties for the ConfirmHereModal component.
 * @returns {JSX.Element} The rendered ConfirmHereModal component.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { ConfirmHereModal } from 'mediasfu-reactnative';
 * 
 * function App() {
 *   const [isModalVisible, setModalVisible] = useState(true);

 *   return (
 *     <ConfirmHereModal
 *       isConfirmHereModalVisible={isModalVisible}
 *       onConfirmHereClose={() => setModalVisible(false)}
 *       countdownDuration={120}
 *       socket={socketInstance}
 *       roomName="Main Room"
 *       member="User123"
 *       backgroundColor="#83c0e9"
 *     />
 *   );
 * }

 * export default App;
 * ```
 */

let countdownInterval: NodeJS.Timeout;

function startCountdown({
  duration,
  onConfirm,
  onUpdateCounter,
  socket,
  roomName,
  member,
}: {
  duration: number;
  onConfirm: () => void;
  onUpdateCounter: (counter: number) => void;
  socket: Socket;
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
  roomName,
  member,
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

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isConfirmHereModalVisible}
      onRequestClose={onConfirmHereClose}
    >
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor, width: modalWidth }]}
        >
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
        </View>
      </View>
    </Modal>
  );
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
