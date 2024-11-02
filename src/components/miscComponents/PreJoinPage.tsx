/* eslint-disable no-catch-shadow */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';
import { Socket } from 'socket.io-client';
import { ConnectSocketType, ShowAlert } from '../../@types/types';
import RNPickerSelect from 'react-native-picker-select';


const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

/**
 * Interface defining the parameters for the PreJoinPage component.
 */
export interface PreJoinPageParameters {
  /**
   * Source URL for the logo image.
   * Defaults to 'https://mediasfu.com/images/logo192.png' if not provided.
   */
  imgSrc?: string;

  /**
   * Function to display alert messages.
   */
  showAlert?: ShowAlert;

  /**
   * Function to toggle the visibility of the loading modal.
   */
  updateIsLoadingModalVisible: (visible: boolean) => void;

  /**
   * Function to establish a socket connection.
   */
  connectSocket: ConnectSocketType;

  /**
   * Function to update the socket instance in the parent state.
   */
  updateSocket: (socket: Socket) => void;

  /**
   * Function to update the validation state in the parent.
   */
  updateValidated: (validated: boolean) => void;

  /**
   * Function to update the API username in the parent state.
   */
  updateApiUserName: (apiUserName: string) => void;

  /**
   * Function to update the API token in the parent state.
   */
  updateApiToken: (apiToken: string) => void;

  /**
   * Function to update the event link in the parent state.
   */
  updateLink: (link: string) => void;

  /**
   * Function to update the room name in the parent state.
   */
  updateRoomName: (roomName: string) => void;

  /**
   * Function to update the member name in the parent state.
   */
  updateMember: (member: string) => void;
}

/**
 * Interface defining the credentials.
 */
export interface Credentials {
  apiUserName: string;
  apiKey: string;
}

/**
 * Interface defining the options for the PreJoinPage component.
 */
export interface PreJoinPageOptions {
  /**
   * Parameters required by the PreJoinPage component.
   */
  parameters: PreJoinPageParameters;

  /**
   * Optional user credentials. Defaults to predefined credentials if not provided.
   */
  credentials?: Credentials;
}

/**
 * Interface defining the response structure when creating or joining a room.
 */
export interface CreateJoinRoomResponse {
  message: string;
  roomName: string;
  secureCode?: string;
  publicURL: string;
  link: string;
  secret: string;
  success: boolean;
}

/**
 * Interface defining the error structure when creating or joining a room.
 */
export interface CreateJoinRoomError {
  error: string;
  success?: boolean;
}

/**
 * Type defining the structure of the response from create/join room functions.
 */
export type CreateJoinRoomType = (options: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

/**
 * Async function to join a room on MediaSFU.
 *
 * @param {object} options - The options for joining a room.
 * @param {any} options.payload - The payload for the API request.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
 */
export const joinRoomOnMediaSFU: CreateJoinRoomType = async ({
  payload,
  apiUserName,
  apiKey,
}) => {
  try {
    // Validate credentials
    if (
      !apiUserName
      || !apiKey
      || apiUserName === 'yourAPIUSERNAME'
      || apiKey === 'yourAPIKEY'
      || apiKey.length !== 64
      || apiUserName.length < 6
    ) {
      return { data: { error: 'Invalid credentials' }, success: false };
    }

    const response = await fetch('https://mediasfu.com/v1/rooms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiUserName}:${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: CreateJoinRoomResponse = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = (error as Error).message || 'unknown error';
    return {
      data: { error: `Unable to join room, ${errorMessage}` },
      success: false,
    };
  }
};

/**
 * Async function to create a room on MediaSFU.
 *
 * @param {object} options - The options for creating a room.
 * @param {any} options.payload - The payload for the API request.
 * @param {string} options.apiUserName - The API username.
 * @param {string} options.apiKey - The API key.
 * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
 */
export const createRoomOnMediaSFU: CreateJoinRoomType = async ({
  payload,
  apiUserName,
  apiKey,
}) => {
  try {
    // Validate credentials
    if (
      !apiUserName
      || !apiKey
      || apiUserName === 'yourAPIUSERNAME'
      || apiKey === 'yourAPIKEY'
      || apiKey.length !== 64
      || apiUserName.length < 6
    ) {
      return { data: { error: 'Invalid credentials' }, success: false };
    }

    const response = await fetch('https://mediasfu.com/v1/rooms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiUserName}:${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: CreateJoinRoomResponse = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = (error as Error).message || 'unknown error';
    return {
      data: { error: `Unable to create room, ${errorMessage}` },
      success: false,
    };
  }
};

export type PreJoinPageType = (options: PreJoinPageOptions) => JSX.Element;

/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 *
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @returns {JSX.Element} The rendered PreJoinPage component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { PreJoinPage } from 'mediasfu-reactnative';
 * 
 * function App() {
 *   return (
 *     <PreJoinPage
 *       parameters={{
 *         showAlert: showAlertFunction,
 *         updateIsLoadingModalVisible: updateLoadingFunction,
 *         connectSocket: connectSocketFunction,
 *         updateSocket: updateSocketFunction,
 *         updateValidated: updateValidatedFunction,
 *         updateApiUserName: updateApiUserNameFunction,
 *         updateApiToken: updateApiTokenFunction,
 *         updateLink: updateLinkFunction,
 *         updateRoomName: updateRoomNameFunction,
 *         updateMember: updateMemberFunction,
 *         imgSrc: 'https://example.com/logo.png',
 *       }}
 *       credentials={{
 *         apiUserName: 'user123',
 *         apiKey: 'apikey123',
 *       }}
 *     />
 *   );
 * }
 * 
 * export default App;
 * ```
 */

const PreJoinPage: React.FC<PreJoinPageOptions> = ({
  parameters,
  credentials,
}) => {
  // State variables
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('');
  const [eventID, setEventID] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Destructure parameters
  const {
    showAlert,
    updateIsLoadingModalVisible,
    connectSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  /**
   * Checks rate limits and makes a socket connection request.
   */
  const checkLimitsAndMakeRequest = async ({
    apiUserName,
    apiToken,
    link,
    apiKey = '',
    userName,
  }: {
    apiUserName: string;
    apiToken: string;
    link: string;
    apiKey?: string;
    userName: string;
  }) => {
    const TIMEOUT_DURATION = 10000; // 10 seconds

    try {
      // Retrieve unsuccessful attempts and last request timestamp from AsyncStorage
      let unsuccessfulAttempts = parseInt(
        (await AsyncStorage.getItem('unsuccessfulAttempts')) || '0',
       10);
      const lastRequestTimestamp = parseInt(
        (await AsyncStorage.getItem('lastRequestTimestamp')) || '0',
       10);

      // Check if user has exceeded maximum attempts
      if (
        unsuccessfulAttempts >= MAX_ATTEMPTS
        && Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION
      ) {
        showAlert?.({
          message: 'Too many unsuccessful attempts. Please try again later.',
          type: 'danger',
          duration: 3000,
        });
        await AsyncStorage.setItem(
          'lastRequestTimestamp',
          Date.now().toString(),
        );
        return;
      } if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
        // Reset unsuccessful attempts after rate limit duration
        unsuccessfulAttempts = 0;
        await AsyncStorage.setItem(
          'unsuccessfulAttempts',
          unsuccessfulAttempts.toString(),
        );
        await AsyncStorage.setItem(
          'lastRequestTimestamp',
          Date.now().toString(),
        );
      }

      // Show loading modal
      updateIsLoadingModalVisible(true);

      // Attempt to connect to socket with a timeout
      const socketPromise = connectSocket({
        apiUserName,
        apiKey,
        apiToken,
        link,
      });
      const timeoutPromise = new Promise<never>((_, reject) => setTimeout(
        () => reject(new Error('Request timed out')),
        TIMEOUT_DURATION,
      ));

      const socket = await Promise.race([socketPromise, timeoutPromise]);

      if (socket && socket.id) {
        // Successful connection
        unsuccessfulAttempts = 0;
        await AsyncStorage.setItem(
          'unsuccessfulAttempts',
          unsuccessfulAttempts.toString(),
        );
        await AsyncStorage.setItem(
          'lastRequestTimestamp',
          Date.now().toString(),
        );

        // Update parent state with socket and user details
        updateSocket(socket);
        updateApiUserName(apiUserName);
        updateApiToken(apiToken);
        updateLink(link);
        updateRoomName(apiUserName);
        updateMember(userName);
        updateValidated(true);
      } else {
        // Unsuccessful connection
        unsuccessfulAttempts += 1;
        await AsyncStorage.setItem(
          'unsuccessfulAttempts',
          unsuccessfulAttempts.toString(),
        );
        await AsyncStorage.setItem(
          'lastRequestTimestamp',
          Date.now().toString(),
        );
        updateIsLoadingModalVisible(false);

        if (unsuccessfulAttempts >= MAX_ATTEMPTS) {
          showAlert?.({
            message: 'Too many unsuccessful attempts. Please try again later.',
            type: 'danger',
            duration: 3000,
          });
        } else {
          showAlert?.({
            message: 'Invalid credentials.',
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } catch (error) {
      // Handle errors during connection
      console.error('Error connecting to socket:', error);
      showAlert?.({
        message: 'Unable to connect. Check your credentials and try again.',
        type: 'danger',
        duration: 3000,
      });

      // Increment unsuccessful attempts
      let unsuccessfulAttempts = parseInt(
        (await AsyncStorage.getItem('unsuccessfulAttempts')) || '0',
       10);
      unsuccessfulAttempts += 1;
      await AsyncStorage.setItem(
        'unsuccessfulAttempts',
        unsuccessfulAttempts.toString(),
      );
      await AsyncStorage.setItem('lastRequestTimestamp', Date.now().toString());
      updateIsLoadingModalVisible(false);
    }
  };

  /**
   * Handles toggling between Create Mode and Join Mode.
   */
  const handleToggleMode = () => {
    setIsCreateMode((prevMode) => !prevMode);
    setError('');
  };

  /**
   * Handles the creation of a new room.
   */
  const handleCreateRoom = async () => {
    try {
      setError('');

      // Validate input fields
      if (!name || !duration || !eventType || !capacity) {
        setError('Please fill all the fields.');
        return;
      }

      // Validate event type
      const validEventTypes = ['broadcast', 'chat', 'webinar', 'conference'];
      if (!validEventTypes.includes(eventType.toLowerCase())) {
        setError(
          'Event type must be one of "broadcast", "chat", "webinar", or "conference".',
        );
        return;
      }

      // Validate numeric fields
      const durationNum = parseInt(duration, 10);
      const capacityNum = parseInt(capacity, 10);
      if (isNaN(durationNum) || isNaN(capacityNum)) {
        setError('Duration and Capacity must be valid numbers.');
        return;
      }

      // Prepare payload
      const payload = {
        action: 'create',
        duration: durationNum,
        capacity: capacityNum,
        eventType: eventType.toLowerCase(),
        userName: name,
      };

      // Make API call to create room
      updateIsLoadingModalVisible(true);

      const response = await createRoomOnMediaSFU({
        payload,
        apiUserName: credentials.apiUserName,
        apiKey: credentials.apiKey,
      });

      if (response.success && response.data && 'roomName' in response.data) {
        // Handle successful room creation
        await checkLimitsAndMakeRequest({
          apiUserName: response.data.roomName,
          apiToken: response.data.secret,
          link: response.data.link,
          userName: name,
        });
        setError('');
      } else {
        // Handle failed room creation
        updateIsLoadingModalVisible(false);
        setError(
          `Unable to create room. ${
            response.data && 'error' in response.data ? response.data.error : ''
          }`,
        );
      }
    } catch (error) {
      updateIsLoadingModalVisible(false);
      setError(`Unable to connect. ${error.message}`);
      showAlert?.({
        message: `Unable to connect. ${error.message}`,
        type: 'danger',
        duration: 3000,
      });
    }
  };

  /**
   * Handles joining an existing room.
   */
  const handleJoinRoom = async () => {
    try {
      setError('');

      // Validate input fields
      if (!name || !eventID) {
        setError('Please fill all the fields.');
        return;
      }

      // Prepare payload
      const payload = {
        action: 'join',
        meetingID: eventID,
        userName: name,
      };

      // Make API call to join room
      updateIsLoadingModalVisible(true);

      const response = await joinRoomOnMediaSFU({
        payload,
        apiUserName: credentials.apiUserName,
        apiKey: credentials.apiKey,
      });

      if (response.success && response.data && 'roomName' in response.data) {
        // Handle successful room join
        await checkLimitsAndMakeRequest({
          apiUserName: response.data.roomName,
          apiToken: response.data.secret,
          link: response.data.link,
          userName: name,
        });
        setError('');
      } else {
        // Handle failed room join
        updateIsLoadingModalVisible(false);
        setError(
          `Unable to connect to room. ${
            response.data && 'error' in response.data ? response.data.error : ''
          }`,
        );
      }
    } catch (error) {
      updateIsLoadingModalVisible(false);
      setError(`Unable to connect. ${error.message}`);
      showAlert?.({
        message: `Unable to connect. ${error.message}`,
        type: 'danger',
        duration: 3000,
      });
    }
  };

  /**
   * Locks the orientation to portrait mode when the component mounts and unlocks on unmount.
   */
  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, Platform.OS === 'web' && { maxWidth: 600, alignSelf: 'center' }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri:
                  parameters.imgSrc
                  || 'https://mediasfu.com/images/logo192.png',
              }}
              style={styles.logoImage}
            />
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {isCreateMode ? (
              <>
                <TextInput
                  style={styles.inputField}
                  placeholder="Display Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Display Name"
                  placeholderTextColor="gray"
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Duration (minutes)"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Duration (minutes)"
                  placeholderTextColor="gray"

                />

                <RNPickerSelect
                  onValueChange={(value: string) => {
                    setEventType(value);
                  }}
                  items={[
                    { label: 'Chat', value: 'chat' },
                    { label: 'Broadcast', value: 'broadcast' },
                    { label: 'Webinar', value: 'webinar' },
                    { label: 'Conference', value: 'conference' },
                  ]}
                  value={eventType}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: 'Select Event Type',
                    value: '',
                    color: 'gray',
                  }}
                  useNativeAndroidPickerStyle={false}
                />
                <View style={styles.gap} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Room Capacity"
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Room Capacity"
                  placeholderTextColor="gray"
                />
                <Pressable
                  style={styles.actionButton}
                  onPress={handleCreateRoom}
                  accessibilityRole="button"
                  accessibilityLabel="Create Room"
                >
                  <Text style={styles.actionButtonText}>Create Room</Text>
                </Pressable>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.inputField}
                  placeholder="Display Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Display Name"
                  placeholderTextColor="gray"
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Event ID"
                  value={eventID}
                  onChangeText={setEventID}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Event ID"
                  placeholderTextColor="gray"
                />
                <Pressable
                  style={styles.actionButton}
                  onPress={handleJoinRoom}
                  accessibilityRole="button"
                  accessibilityLabel="Join Room"
                >
                  <Text style={styles.actionButtonText}>Join Room</Text>
                </Pressable>
              </>
            )}
            {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* OR Separator */}
          <View style={styles.orContainer}>
            <Text style={styles.orText}>OR</Text>
          </View>

          {/* Toggle Mode Button */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={styles.toggleButton}
              onPress={handleToggleMode}
              accessibilityRole="button"
              accessibilityLabel={
                isCreateMode ? 'Switch to Join Mode' : 'Switch to Create Mode'
              }
            >
              <Text style={styles.toggleButtonText}>
                {isCreateMode ? 'Switch to Join Mode' : 'Switch to Create Mode'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PreJoinPage;

/**
 * Stylesheet for the PreJoinPage component.
 */
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#53C6E0',
    paddingVertical: 10,
    maxHeight: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  gap: {
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: 'black',
    paddingRight: 20,
  },
  inputAndroid: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: 'black',
    paddingRight: 20,
  },
  inputWeb: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: 'black',
    paddingRight: 20,
  },
  placeholder: {
    color: 'gray',
  },

});
