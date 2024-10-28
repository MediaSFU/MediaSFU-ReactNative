// MiniAudio.tsx

import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';

/**
 * Enum for overlay positions.
 */
type OverlayPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/**
 * Interface defining the props for the MiniAudio component.
 */
export interface MiniAudioOptions {
  /**
   * Determines if the component is visible.
   * @default true
   */
  visible?: boolean;

  /**
   * Custom styles for the component container.
   */
  customStyle?: StyleProp<ViewStyle>;

  /**
   * The name to display on the audio player.
   */
  name: string;

  /**
   * Flag to show or hide the waveform animation.
   * @default false
   */
  showWaveform?: boolean;

  /**
   * The position of the overlay on the screen.
   * @default 'topLeft'
   */
  overlayPosition?: OverlayPosition;

  /**
   * The color of the waveform bars.
   * @default 'red'
   */
  barColor?: string;

  /**
   * The color of the text.
   * @default 'white'
   */
  textColor?: string;

  /**
   * Custom styles for the name text.
   */
  nameTextStyling?: StyleProp<TextStyle>;

  /**
   * The source URI for the background image.
   */
  imageSource: string;

  /**
   * Flag to determine if the background image should be rounded.
   * @default false
   */
  roundedImage?: boolean;

  /**
   * Custom styles for the background image.
   */
  imageStyle?: StyleProp<ImageStyle>;
}

export type MiniAudioType = (options: MiniAudioOptions) => JSX.Element;

/**
 * MiniAudio component displays an audio player with optional waveform animation and draggable functionality.
 *
 * @param {MiniAudioOptions} props - The properties for the MiniAudio component.
 * @returns {JSX.Element} The rendered MiniAudio component.
 */
const MiniAudio: React.FC<MiniAudioOptions> = ({
  visible = true,
  customStyle,
  name,
  showWaveform = false,
  overlayPosition = 'topLeft',
  barColor = 'red',
  textColor = 'white',
  nameTextStyling,
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {
  const pan = useRef<any>(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set the initial value to the current state
        pan?.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  const [waveformAnimations] = useState(
    Array.from({ length: 9 }, () => new Animated.Value(0)),
  );

  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
    }
  }, [showWaveform]);

  const animateWaveform = () => {
    const animations = waveformAnimations.map((animation, index) => Animated.loop(
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
    ));

    Animated.parallel(animations).start();
  };

  /**
   * Resets the waveform animations to initial state.
   */
  const resetWaveform = () => {
    waveformAnimations.forEach((animation) => animation.setValue(0));
  };

  /**
   * Retrieves the animation duration for a specific bar.
   * @param index - The index of the waveform bar.
   * @returns number - The duration in milliseconds.
   */
  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 0;
  };

  return (
    <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
      <Animated.View
        style={[
          styles.modalContent,
          { transform: pan.getTranslateTransform() },
          styles.modalContainer,
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.card, StyleSheet.flatten(customStyle)]}>
          {imageSource && (
            <Image
              source={{ uri: imageSource }}
              style={[
                styles.backgroundImage as ImageStyle,
                roundedImage && (styles.roundedImage as ImageStyle),
                imageStyle as ImageStyle, // Assuming imageStyle is of type ImageStyle
              ]}
              resizeMode="cover"
            />
          )}
          <View>
            <Text
              style={[
                styles.nameText,
                StyleSheet.flatten([nameTextStyling, { color: textColor }]),
              ]}
            >
              {name}
            </Text>
          </View>
          <View
            style={[
              StyleSheet.flatten(getOverlayPosition({ position: overlayPosition })),
              StyleSheet.flatten(
                Platform.OS === 'web' ? styles.overlayWeb : styles.overlayMobile,
              ),
            ]}
          >
            <View>
              {/* <Text style={{ ...styles.nameText, color: textColor }}>{name}</Text> */}
            </View>
            <View
              style={{
                ...(Platform.OS === 'web'
                  ? styles.waveformWeb
                  : styles.waveformMobile),
              }}
            >
              {waveformAnimations.map((animation, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.bar,
                    {
                      height: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 40],
                      }),
                      backgroundColor: barColor,
                    },
                  ]}
                />
              ))}
            </View>
            <View />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default MiniAudio;

const styles = StyleSheet.create({
  container: {
    width: 100, // Specify the desired width
    height: 100, // Specify the desired height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 0, // Remove any margin
    padding: 0, // Remove any padding
    elevation: 8,
    zIndex: 8,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
  },
  overlayMobile: {
    position: 'absolute',
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'absolute',
    minWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    display: 'flex',
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginEnd: 2,
    fontSize: 14,
  },
  nameText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    display: 'flex',
    paddingVertical: 3,
    textAlign: 'center',
  },
  waveformWeb: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 0,
    flexDirection: 'row',
  },

  waveformMobile: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    maxHeight: '100%',
    marginLeft: 5,
    maxWidth: '100%',
    marginVertical: '30%',
  },
  bar: {
    flex: 1,
    opacity: 0.35,
    marginHorizontal: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: '40%',
    left: '50%',
    transform: [
      { translateY: -10 }, // Half of the height
      { translateX: -35 }, // Half of the width
    ],
  },
  roundedImage: {
    borderRadius: 20,
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 45, 33, 0.5)',
    padding: 0,
    margin: 0,
    width: 100,
    height: 100,
  },
  modalContent: {
    width: 100, // You should specify the unit, e.g., 100px or 100%
    height: 100, // You should specify the unit, e.g., 100px or 100%
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 0, // Remove any margin
    padding: 0, // Remove any padding
  },
});
