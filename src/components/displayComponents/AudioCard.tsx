// AudioCard.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Socket } from 'socket.io-client';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import MiniCard from './MiniCard';
import { controlMedia } from '../../consumers/controlMedia';
import {
  ControlsPosition,
  InfoPosition,
  Participant,
  ControlMediaOptions,
  AudioDecibels,
  CoHostResponsibility,
  ShowAlert,
} from '../../@types/types';

export interface AudioCardParameters {
  audioDecibels: AudioDecibels[];
  participants: Participant[];
  socket: Socket;
  coHostResponsibility: CoHostResponsibility[];
  roomName: string;
  showAlert?: ShowAlert;
  coHost: string;
  islevel: string;
  member: string;
  eventType: string;

  // mediasfu functions
  getUpdatedAllParams(): AudioCardParameters;
}

export interface AudioCardOptions {
  controlUserMedia?: (options: ControlMediaOptions) => Promise<void>;
  customStyle?: StyleProp<ViewStyle>;
  name: string;
  barColor?: string;
  textColor?: string;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  showControls?: boolean;
  showInfo?: boolean;
  videoInfoComponent?: React.ReactNode;
  videoControlsComponent?: React.ReactNode;
  controlsPosition?: ControlsPosition;
  infoPosition?: InfoPosition;
  participant: Participant;
  backgroundColor?: string;
  audioDecibels?: AudioDecibels;
  parameters: AudioCardParameters;
}

export type AudioCardType = (options: AudioCardOptions) => JSX.Element;

/**
 * AudioCard component displays participant information, audio waveform, and media control buttons.
 *
 * This component provides an animated waveform for audio activity, control buttons to toggle audio and video,
 * and options for customization of appearance, layout, and media controls. It leverages WebSocket for
 * real-time updates and accommodates custom styling and control component integrations.
 *
 * @component
 * @param {Function} [controlUserMedia=controlMedia] - Function to control user media settings.
 * @param {StyleProp<ViewStyle>} [customStyle] - Custom styles for the card container.
 * @param {string} name - Name of the participant displayed in the card.
 * @param {string} [barColor='red'] - Color for the waveform bars.
 * @param {string} [textColor='white'] - Color for participant name text.
 * @param {string} [imageSource] - URL for participant image.
 * @param {boolean} [roundedImage=false] - Flag to display the image with rounded corners.
 * @param {StyleProp<ImageStyle>} [imageStyle] - Custom styles for participant image.
 * @param {boolean} [showControls=true] - Flag to toggle the visibility of media control buttons.
 * @param {boolean} [showInfo=true] - Flag to toggle the visibility of participant info.
 * @param {React.ReactNode} [videoInfoComponent] - Custom component to replace default participant info.
 * @param {React.ReactNode} [videoControlsComponent] - Custom component to replace default control buttons.
 * @param {ControlsPosition} [controlsPosition='topLeft'] - Position for media control buttons overlay.
 * @param {InfoPosition} [infoPosition='bottomLeft'] - Position for participant info overlay.
 * @param {Participant} participant - Participant information.
 * @param {string} [backgroundColor='#2c678f'] - Background color for the card.
 * @param {AudioDecibels} [audioDecibels] - Audio decibels data for the waveform.
 * @param {AudioCardParameters} parameters - Parameters with media and event settings.
 *
 * @returns {JSX.Element} The AudioCard component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { AudioCard } from 'mediasfu-reactnative';
 * import { io } from 'socket.io-client';
 *
 * function App() {
 *   const socket = io('http://localhost:3000');
 *   
 *   return (
 *     <AudioCard
 *       name="John Doe"
 *       barColor="blue"
 *       textColor="white"
 *       imageSource="https://example.com/image.jpg"
 *       showControls={true}
 *       showInfo={true}
 *       participant={{ name: "John Doe", muted: false, videoOn: true }}
 *       parameters={{
 *         audioDecibels: [{ name: "John Doe", averageLoudness: 128 }],
 *         participants: [{ name: "John Doe" }],
 *         socket,
 *         coHostResponsibility: [],
 *         roomName: "Room 1",
 *         coHost: "Admin",
 *         islevel: "1",
 *         member: "12345",
 *         eventType: "meeting",
 *         showAlert: ({ message, type }) => console.log(message, type),
 *         getUpdatedAllParams: () => ({}),
 *       }}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const AudioCard: React.FC<AudioCardOptions> = ({
  controlUserMedia = controlMedia,
  customStyle,
  name,
  barColor = 'red',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = 'topLeft',
  infoPosition = 'bottomLeft',
  participant,
  backgroundColor,
  audioDecibels,
  parameters,
}) => {
  // State for animated waveform bars
  const [waveformAnimations] = useState<Animated.Value[]>(
    Array.from({ length: 9 }, () => new Animated.Value(0)),
  );

  const [showWaveform, setShowWaveform] = useState<boolean>(true);
  const { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  useEffect(() => {
    // Interval to check audio decibels and participant status every second
    const interval = setInterval(() => {
      const { audioDecibels, participants } = parameters;

      const existingEntry = audioDecibels?.find((entry) => entry.name === name);
      const updatedParticipant = participants?.find((p) => p.name === name);

      // Conditions to animate or reset waveform
      if (
        existingEntry &&
        existingEntry.averageLoudness > 127.5 &&
        updatedParticipant &&
        !updatedParticipant.muted
      ) {
        animateWaveform();
      } else {
        resetWaveform();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioDecibels]);

  useEffect(() => {
    if (participant?.muted) {
      setShowWaveform(false);
      resetWaveform();
    } else {
      setShowWaveform(true);
    }
  }, [participant?.muted]);

  /**
   * animateWaveform - Starts the animation for each waveform bar.
   */
  const animateWaveform = () => {
    const animations = waveformAnimations.map((animation, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: getAnimationDuration(index),
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: getAnimationDuration(index),
            useNativeDriver: false,
          }),
        ]),
      ),
    );

    Animated.parallel(animations).start();
  };

  /**
   * resetWaveform - Resets all waveform animations.
   */
  const resetWaveform = () => {
    waveformAnimations.forEach((animation) => animation.stopAnimation());
    waveformAnimations.forEach((animation) => animation.setValue(0));
  };

  /**
   * getAnimationDuration - Returns the duration for a given waveform bar index.
   * @param index - The index of the waveform bar.
   * @returns The duration in milliseconds.
   */
  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 500;
  };

  /**
   * toggleAudio - Toggles the audio state of the participant.
   */
  const toggleAudio = async () => {
    if (!participant?.muted) {
      await controlUserMedia({
        participantId: participant.id || '',
        participantName: participant.name,
        type: 'audio',
        socket: parameters.socket,
        coHostResponsibility: parameters.coHostResponsibility,
        roomName: parameters.roomName,
        showAlert: parameters.showAlert,
        coHost: parameters.coHost,
        islevel: parameters.islevel,
        member: parameters.member,
        participants: parameters.participants,
      });
    }
  };

  /**
   * toggleVideo - Toggles the video state of the participant.
   */
  const toggleVideo = async () => {
    if (participant?.videoOn) {
      await controlUserMedia({
        participantId: participant.id || '',
        participantName: participant.name,
        type: 'video',
        socket: parameters.socket,
        coHostResponsibility: parameters.coHostResponsibility,
        roomName: parameters.roomName,
        showAlert: parameters.showAlert,
        coHost: parameters.coHost,
        islevel: parameters.islevel,
        member: parameters.member,
        participants: parameters.participants,
      });
    }
  };

  /**
   * renderControls - Renders the control buttons for audio and video.
   * @returns The control buttons JSX.Element or a custom component.
   */
  const renderControls = (): JSX.Element | null => {
    if (!showControls) {
      return null;
    }

    // Use custom videoControlsComponent if provided
    if (videoControlsComponent) {
      return <>{videoControlsComponent}</>;
    }

    // Default controls
    return (
      <View style={styles.overlayControls}>
        <Pressable style={styles.controlButton} onPress={toggleAudio}>
          <FontAwesome5
            name={participant?.muted ? 'microphone-slash' : 'microphone'}
            size={14}
            color={participant?.muted ? 'red' : 'green'}
          />
        </Pressable>

        <Pressable style={styles.controlButton} onPress={toggleVideo}>
          <FontAwesome5
            name={participant?.videoOn ? 'video' : 'video-slash'}
            size={14}
            color={participant?.videoOn ? 'green' : 'red'}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.card,
        customStyle,
        { backgroundColor: backgroundColor || '#2c678f' },
      ]}
    >
      {imageSource ? (
        <Image
          source={{ uri: imageSource }}
          style={[
            styles.backgroundImage as ImageStyle,
            roundedImage ? (styles.roundedImage as ImageStyle) : undefined,
            imageStyle as ImageStyle,
          ]}
          resizeMode="cover"
        />
      ) : (
        <MiniCard
          initials={name}
          fontSize={20}
          customStyle={{
            borderWidth: parameters.eventType !== 'broadcast' ? 2 : 0,
            borderColor:
              parameters.eventType !== 'broadcast' ? 'black' : 'transparent',
          }}
        />
      )}

      {/* Participant Info and Waveform */}
      {videoInfoComponent ||
        (showInfo && (
          <View
            style={[
              getOverlayPosition({ position: infoPosition }),
              Platform.OS === 'web'
                ? showControls
                  ? styles.overlayWeb
                  : styles.overlayWebAlt
                : styles.overlayMobile,
            ]}
          >
            <View style={styles.nameColumn}>
              <Text style={[styles.nameText, { color: textColor }]}>
                {name}
              </Text>
            </View>
            {showWaveform && (
              <View
                style={
                  Platform.OS === 'web'
                    ? styles.waveformWeb
                    : styles.waveformMobile
                }
              >
                {waveformAnimations.map((animation, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.bar,
                      {
                        height: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 14],
                        }),
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ))}

      {/* Control Buttons */}
      {videoControlsComponent ||
        (showControls && (
          <View
            style={[
              styles.overlayControls,
              getOverlayPosition({ position: controlsPosition }),
            ]}
          >
            {renderControls()}
          </View>
        ))}
    </View>
  );
};

export default AudioCard;

// Stylesheet with TypeScript typings
const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
    borderWidth: 2,
    borderColor: 'black',
    position: 'relative',
  },
  backgroundImage: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    transform: [
      { translateY: -40 }, // Half of the height
      { translateX: -40 }, // Half of the width
    ],
  },
  roundedImage: {
    borderRadius: 16,
  },
  overlayMobile: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayWebAlt: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayControls: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: 'absolute',
  },
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginEnd: 5,
    fontSize: 12,
    borderRadius: 4,
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginEnd: 2,
    fontSize: 12,
  },
  nameText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  waveformWeb: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 0,
    flexDirection: 'row',
    minHeight: '4%',
    maxHeight: '70%',
    width: '100%',
  },
  waveformMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 5,
    marginLeft: 5,
    maxWidth: '25%',
  },
  bar: {
    flex: 1,
    opacity: 0.7,
    marginHorizontal: 1,
  },
});
