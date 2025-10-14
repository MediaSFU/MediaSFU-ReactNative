// AudioCard.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  LayoutChangeEvent,
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
  CustomAudioCardType,
} from '../../@types/types';

/**
 * Parameters consumed by `AudioCard` to reflect live meeting state and permissions.
 *
 * @interface AudioCardParameters
 *
 * **Telemetry & Participants:**
 * @property {AudioDecibels[]} audioDecibels Live loudness metrics per participant.
 * @property {Participant[]} participants Current participant roster.
 *
 * **Session Context:**
 * @property {Socket} socket Socket instance for media control events.
 * @property {CoHostResponsibility[]} coHostResponsibility Active co-host capabilities.
 * @property {string} roomName Active room identifier.
 * @property {ShowAlert} [showAlert] Optional alert helper.
 * @property {string} coHost Current co-host identifier.
 * @property {string} islevel Member privilege level.
 * @property {string} member Local member identifier.
 * @property {string} eventType Meeting event type (e.g., `conference`).
 *
 * **Helpers:**
 * @property {() => AudioCardParameters} getUpdatedAllParams Refreshes parameters before invoking side effects.
 */
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
  getUpdatedAllParams(): AudioCardParameters;
}

/**
 * Configuration options for rendering an `AudioCard`.
 *
 * @interface AudioCardOptions
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [customStyle] Additional card styling.
 * @property {StyleProp<ViewStyle>} [style] Style override applied to the container wrapper.
 * @property {string} name Participant display name.
 * @property {string} [barColor='red'] Waveform bar color.
 * @property {string} [textColor='white'] Participant label color.
 * @property {string} [imageSource] Optional avatar URL.
 * @property {boolean} [roundedImage=false] Rounds avatar corners.
 * @property {StyleProp<ImageStyle>} [imageStyle] Additional avatar styling.
 * @property {string} [backgroundColor] Card background color.
 *
 * **Controls & Info:**
 * @property {boolean} [showControls=true] Toggles media controls visibility.
 * @property {boolean} [showInfo=true] Toggles participant info display.
 * @property {React.ReactNode} [videoInfoComponent] Replacement component for info overlay.
 * @property {React.ReactNode} [videoControlsComponent] Replacement component for controls overlay.
 * @property {ControlsPosition} [controlsPosition='topLeft'] Overlay placement for controls.
 * @property {InfoPosition} [infoPosition='bottomLeft'] Overlay placement for info.
 *
 * **Behaviour:**
 * @property {(options: ControlMediaOptions) => Promise<void>} [controlUserMedia=controlMedia] Handler for toggling media.
 * @property {Participant} participant Participant metadata used in controls.
 * @property {AudioDecibels} [audioDecibels] Loudness metrics for the participant.
 * @property {AudioCardParameters} parameters Shared meeting parameters.
 * @property {CustomAudioCardType} [customAudioCard] Custom renderer to replace the default card body.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the internal layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for the outer container implementation.
 */
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
  customAudioCard?: CustomAudioCardType;
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

export type AudioCardType = (options: AudioCardOptions) => JSX.Element;

/**
 * AudioCard renders participant avatars, animated audio waveforms, and media controls within a
 * customizable card. It reacts to live audio telemetry, exposes override hooks, and integrates with
 * `controlMedia` for host-driven moderation.
 *
 * ### Key Features
 * - Animated waveform tied to decibel telemetry.
 * - Toggle buttons for audio/video with default or custom renderers.
 * - Supports image avatars or fallback initials via `MiniCard`.
 * - Aligns overlays via `controlsPosition` and `infoPosition` helpers.
 *
 * ### Accessibility
 * - Control buttons include iconography and can be wrapped in accessible containers.
 * - Text labels use high-contrast defaults for readability.
 *
 * @param {AudioCardOptions} props Audio card configuration.
 * @returns {JSX.Element} Rendered audio card.
 *
 * @example Standard host-controlled audio card.
 * ```tsx
 * <AudioCard
 *   name={participant.name}
 *   participant={participant}
 *   parameters={parameters}
 * />
 * ```
 *
 * @example Custom container with fade animation.
 * ```tsx
 * <AudioCard
 *   {...props}
 *   renderContainer={({ defaultContainer }) => (
 *     <FadeIn>{defaultContainer}</FadeIn>
 *   )}
 * />
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
  audioDecibels: _audioDecibels,
  parameters,
  customAudioCard,
  style,
  renderContent,
  renderContainer,
}) => {
  const { getUpdatedAllParams } = parameters;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [waveformAnimations] = useState<Animated.Value[]>(
    Array.from({ length: 9 }, () => new Animated.Value(0)),
  );

  const [showWaveform, setShowWaveform] = useState<boolean>(true);

  const latestParameters = useCallback(() => getUpdatedAllParams(), [getUpdatedAllParams]);

  const getAnimationDuration = useCallback((index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 500;
  }, []);

  const animateWaveform = useCallback(() => {
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
  }, [getAnimationDuration, waveformAnimations]);

  const resetWaveform = useCallback(() => {
    waveformAnimations.forEach((animation) => {
      animation.stopAnimation();
      animation.setValue(0);
    });
  }, [waveformAnimations]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { audioDecibels: liveDecibels, participants: liveParticipants } = latestParameters();

      const existingEntry = liveDecibels?.find((entry) => entry.name === name);
      const updatedParticipant = liveParticipants?.find((p) => p.name === name);

      if (existingEntry && existingEntry.averageLoudness > 127.5 && updatedParticipant && !updatedParticipant.muted) {
        animateWaveform();
      } else {
        resetWaveform();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      resetWaveform();
    };
  }, [animateWaveform, latestParameters, name, resetWaveform]);

  useEffect(() => {
    if (participant?.muted) {
      setShowWaveform(false);
      resetWaveform();
    } else {
      setShowWaveform(true);
      animateWaveform();
    }

    return () => {
      resetWaveform();
    };
  }, [animateWaveform, participant?.muted, resetWaveform]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }
      return { width, height };
    });
  }, []);

  const accessibilityLabel = useMemo(() => {
    const statusParts: string[] = [];
    if (participant?.muted) {
      statusParts.push('audio muted');
    } else {
      statusParts.push('audio active');
    }
    statusParts.push(participant?.videoOn ? 'video on' : 'video off');
    if (showWaveform) {
      statusParts.push('waveform visible');
    }
    return `${name} (${statusParts.join(', ')})`;
  }, [name, participant?.muted, participant?.videoOn, showWaveform]);

  const toggleAudio = useCallback(async () => {
    if (!participant?.muted) {
      const updatedParams = latestParameters();
      await controlUserMedia({
        participantId: participant?.id || '',
        participantName: participant?.name || name,
        type: 'audio',
        socket: updatedParams.socket,
        coHostResponsibility: updatedParams.coHostResponsibility,
        roomName: updatedParams.roomName,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        islevel: updatedParams.islevel,
        member: updatedParams.member,
        participants: updatedParams.participants,
      });
    }
  }, [controlUserMedia, latestParameters, name, participant?.id, participant?.muted, participant?.name]);

  const toggleVideo = useCallback(async () => {
    if (participant?.videoOn) {
      const updatedParams = latestParameters();
      await controlUserMedia({
        participantId: participant?.id || '',
        participantName: participant?.name || name,
        type: 'video',
        socket: updatedParams.socket,
        coHostResponsibility: updatedParams.coHostResponsibility,
        roomName: updatedParams.roomName,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        islevel: updatedParams.islevel,
        member: updatedParams.member,
        participants: updatedParams.participants,
      });
    }
  }, [controlUserMedia, latestParameters, name, participant?.id, participant?.name, participant?.videoOn]);

  const currentParameters = latestParameters();

  const fallbackMiniCardBorder = useMemo(() => ({
    borderWidth: currentParameters.eventType !== 'broadcast' ? 2 : 0,
    borderColor: currentParameters.eventType !== 'broadcast' ? 'black' : 'transparent',
  }), [currentParameters.eventType]);

  const controlsContent = useMemo(() => {
    if (!showControls) {
      return null;
    }

    if (videoControlsComponent) {
      return <>{videoControlsComponent}</>;
    }

    return (
      <View
        style={[
          styles.overlayControls,
          getOverlayPosition({ position: controlsPosition }),
        ]}
      >
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
  }, [controlsPosition, participant?.muted, participant?.videoOn, showControls, toggleAudio, toggleVideo, videoControlsComponent]);

  const infoContent = useMemo(() => {
    if (videoInfoComponent) {
      return <>{videoInfoComponent}</>;
    }

    if (!showInfo) {
      return null;
    }

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
            {participant?.name || name}
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
    );
  }, [
    barColor,
    controlsContent,
    infoPosition,
    name,
    participant?.name,
    showControls,
    showInfo,
    showWaveform,
    textColor,
    videoInfoComponent,
    waveformAnimations,
  ]);

  const defaultContent = useMemo(() => (
    <>
      {customAudioCard ? (
        customAudioCard({
          name,
          barColor,
          textColor,
          imageSource,
          roundedImage,
          imageStyle,
          parameters: currentParameters,
        })
      ) : (
        <>
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
              customStyle={fallbackMiniCardBorder}
            />
          )}

          {infoContent}

          {controlsContent}
        </>
      )}
    </>
  ), [
    barColor,
    controlsContent,
    customAudioCard,
    fallbackMiniCardBorder,
    imageSource,
    imageStyle,
    infoContent,
    name,
    roundedImage,
    textColor,
    currentParameters,
  ]);

  const content = useMemo(
    () => (renderContent ? renderContent({ defaultContent, dimensions }) : defaultContent),
    [defaultContent, dimensions, renderContent],
  );

  const defaultContainer = (
    <View
      style={[styles.card, customStyle, style, backgroundColor ? { backgroundColor } : null]}
      onLayout={handleLayout}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {content}
    </View>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
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
