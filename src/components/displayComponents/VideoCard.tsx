import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Platform,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Socket } from 'socket.io-client';
import { controlMedia } from '../../consumers/controlMedia';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import CardVideoDisplay from './CardVideoDisplay';
import {
  EventType,
  ShowAlert,
  CoHostResponsibility,
  Participant,
  AudioDecibels,
  MediaStream,
} from '../../@types/types';

/**
 * Interface defining the parameters required by the VideoCard component.
 */
export interface VideoCardParameters {
  socket: Socket;
  roomName: string;
  coHostResponsibility: CoHostResponsibility[];
  showAlert?: ShowAlert;
  coHost: string;
  participants: Participant[];
  member: string;
  islevel: string;
  audioDecibels: AudioDecibels[];

  // Function to get updated parameters
  getUpdatedAllParams: () => VideoCardParameters;
  [key: string]: any;
}

/**
 * Interface defining the options for the VideoCard component.
 */
export interface VideoCardOptions {
  customStyle?: StyleProp<ViewStyle>;
  name: string;
  barColor?: string;
  textColor?: string;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  remoteProducerId: string;
  eventType: EventType;
  forceFullDisplay: boolean;
  videoStream: MediaStream | null;
  showControls?: boolean;
  showInfo?: boolean;
  videoInfoComponent?: React.ReactNode;
  videoControlsComponent?: React.ReactNode;
  controlsPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  infoPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  participant: Participant;
  backgroundColor?: string;
  audioDecibels?: AudioDecibels[];
  doMirror?: boolean;
  parameters: VideoCardParameters;
}

export type VideoCardType = (options: VideoCardOptions) => JSX.Element;

/**
 * VideoCard is a flexible React Native component for displaying a participant's video stream with optional controls and information.
 * It includes an animated waveform based on audio decibels.
 *
 * @param {VideoCardOptions} props - The configuration options for the VideoCard component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { VideoCard } from 'mediasfu-reactnative';
 * import { Socket } from 'socket.io-client';
 * 
 * const socket = Socket('https://example.com'); // Example socket instance
 * 
 * function App() {
 *   return (
 *     <VideoCard
 *       name="John Doe"
 *       remoteProducerId="1234"
 *       eventType="meeting"
 *       forceFullDisplay={true}
 *       videoStream={null}
 *       participant={{
 *         name: 'John Doe',
 *         id: '123',
 *         videoOn: true,
 *         muted: false,
 *       }}
 *       parameters={{
 *         socket,
 *         roomName: 'room1',
 *         coHostResponsibility: [],
 *         getUpdatedAllParams: () => ({
 *           socket,
 *           roomName: 'room1',
 *           coHostResponsibility: [],
 *           audioDecibels: [],
 *           participants: [{ name: 'John Doe', id: '123', videoOn: true, muted: false }],
 *           member: '123',
 *           islevel: '1',
 *           coHost: 'coHostId',
 *         }),
 *       }}
 *       backgroundColor="#2c678f"
 *       showControls={true}
 *       showInfo={true}
 *       barColor="green"
 *       textColor="white"
 *       doMirror={false}
 *     />
 *   );
 * }
 * 
 * export default App;
 * ```
 */

const VideoCard: React.FC<VideoCardOptions> = ({
  customStyle,
  name,
  barColor = 'red',
  textColor = 'white',
  remoteProducerId,
  eventType,
  forceFullDisplay,
  videoStream,
  showControls = true,
  showInfo = true,
  videoInfoComponent,
  videoControlsComponent,
  controlsPosition = 'topLeft',
  infoPosition = 'topRight',
  participant,
  backgroundColor = '#2c678f',
  audioDecibels = [],
  doMirror = false,
  parameters,
}) => {
  // Initialize waveform animation values
  const [waveformAnimations] = useState<Animated.Value[]>(
    Array.from({ length: 9 }, () => new Animated.Value(0)),
  );

  const [showWaveform, setShowWaveform] = useState<boolean>(true);

  /**
   * animateWaveform - Animates the waveform bars using the Animated API.
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
   * resetWaveform - Resets all waveform animations to their initial state.
   */
  const resetWaveform = () => {
    waveformAnimations.forEach((animation) => animation.stopAnimation());
    waveformAnimations.forEach((animation) => animation.setValue(0));
  };

  /**
   * getAnimationDuration - Retrieves the duration for a specific waveform animation.
   *
   * @param {number} index - The index of the waveform bar.
   * @returns {number} The duration in milliseconds.
   */
  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 400;
  };

  /**
   * Effect to handle waveform animations based on audio decibel levels.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedParams = parameters.getUpdatedAllParams();
      const { audioDecibels, participants } = updatedParams;

      const existingEntry = audioDecibels.find(
        (entry: AudioDecibels) => entry.name === name,
      );
      const participantEntry = participants.find(
        (p: Participant) => p.name === name,
      );

      if (
        existingEntry &&
        existingEntry.averageLoudness > 127.5 &&
        participantEntry &&
        !participantEntry.muted
      ) {
        animateWaveform();
      } else {
        resetWaveform();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioDecibels, name, parameters]);

  /**
   * Effect to show or hide the waveform based on the participant's muted state.
   */
  useEffect(() => {
    if (participant?.muted) {
      resetWaveform();
      setShowWaveform(false);
    } else {
      animateWaveform();
      setShowWaveform(true);
    }
  }, [participant?.muted]);

  /**
   * toggleAudio - Toggles the audio state for the participant.
   */
  const toggleAudio = async () => {
    if (!participant?.muted) {
      const updatedParams = parameters.getUpdatedAllParams();
      await controlMedia({
        participantId: participant.id || '',
        participantName: participant.name,
        type: 'audio',
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    }
  };

  /**
   * toggleVideo - Toggles the video state for the participant.
   */
  const toggleVideo = async () => {
    if (participant?.videoOn) {
      const updatedParams = parameters.getUpdatedAllParams();
      await controlMedia({
        participantId: participant.id || '',
        participantName: participant.name,
        type: 'video',
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    }
  };

  /**
   * renderControls - Render video controls based on conditions.
   * @returns {React.Component} - Rendered video controls.
   */
  const renderControls = (): JSX.Element | null => {
    if (!showControls) {
      return null;
    }

    if (videoControlsComponent) {
      return <>{videoControlsComponent}</>;
    }

    // Default controls
    return (
      <View
        style={{
          ...styles.overlayControls,
          ...getOverlayPosition({ position: controlsPosition }),
        }}
      >
        <Pressable style={styles.controlButton} onPress={toggleAudio}>
          <FontAwesome5
            name={participant?.muted ? 'microphone-slash' : 'microphone'}
            size={16}
            color={participant?.muted ? 'red' : 'green'}
          />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={toggleVideo}>
          <FontAwesome5
            name={participant?.videoOn ? 'video' : 'video-slash'}
            size={16}
            color={participant?.videoOn ? 'green' : 'red'}
          />
        </Pressable>
      </View>
    );
  };

  /**
   * renderInfo - Renders the participant information and waveform.
   *
   * @returns {JSX.Element | null} The rendered info or null.
   */
  const renderInfo = (): JSX.Element | null => {
    if (videoInfoComponent) {
      return <>{videoInfoComponent}</>;
    }

    if (!showInfo) {return null;}

    return (
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
            {participant?.name}
          </Text>
        </View>
        {showWaveform && (
          <View
            style={
              Platform.OS === 'web' ? styles.waveformWeb : styles.waveformMobile
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
    );
  };

  return (
    <View style={[styles.card, customStyle, { backgroundColor }]}>
      {/* Video Display */}
      <CardVideoDisplay
        remoteProducerId={remoteProducerId}
        eventType={eventType}
        forceFullDisplay={forceFullDisplay}
        videoStream={videoStream}
        backgroundColor={backgroundColor}
        doMirror={doMirror}
      />

      {/* Participant Information */}
      {renderInfo()}

      {/* Video Controls */}
      {renderControls()}
    </View>
  );
};

export default VideoCard;

/**
 * Stylesheet for the VideoCard component.
 */
const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
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

  overlayMobile: {
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
    marginRight: 5,
    borderRadius: 5,
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
    textAlign: 'center',
  },

  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 5,
  },

  waveformMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 5,
    marginLeft: 5,
    maxWidth: '25%',
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

  bar: {
    flex: 1,
    opacity: 0.7,
    marginHorizontal: 1,
  },

  backgroundImage: {
    position: 'absolute',
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
    borderRadius: 40, // Fully rounded for a 80x80 image
  },
});
