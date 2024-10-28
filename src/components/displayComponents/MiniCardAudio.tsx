import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Animated,
} from 'react-native';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';

/**
 * Enum for Overlay Positions.
 */
type OverlayPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/**
 * Interface defining the props for the MiniCardAudio component.
 */
export interface MiniCardAudioOptions {
  /**
   * Custom styles to apply to the card.
   */
  customStyle?: StyleProp<ViewStyle>;

  /**
   * The name to display on the card.
   */
  name: string;

  /**
   * Flag to show or hide the waveform animation.
   */
  showWaveform: boolean;

  /**
   * Position of the overlay on the card.
   * @default 'topLeft'
   */
  overlayPosition?: OverlayPosition;

  /**
   * The color of the waveform bars.
   * @default 'white'
   */
  barColor?: string;

  /**
   * The color of the text.
   * @default 'white'
   */
  textColor?: string;

  /**
   * The source URI for the background image.
   */
  imageSource?: string;

  /**
   * Flag to apply rounded corners to the image.
   * @default false
   */
  roundedImage?: boolean;

  /**
   * Custom styles to apply to the image.
   */
  imageStyle?: StyleProp<ImageStyle>;
}

export type MiniCardAudioType = (options: MiniCardAudioOptions) => JSX.Element;

/**
 * MiniCardAudio component displays an audio card with optional waveform animation.
 *
 * @param {MiniCardAudioOptions} props - The properties for the MiniCardAudio component.
 * @returns {JSX.Element} The rendered MiniCardAudio component.
 */
const MiniCardAudio: React.FC<MiniCardAudioOptions> = ({
  customStyle,
  name,
  showWaveform,
  overlayPosition = 'topLeft',
  barColor = 'white',
  textColor = 'white',
  imageSource,
  roundedImage = false,
  imageStyle,
}) => {
  // Initialize waveform animation values
  const [waveformAnimations] = useState<Animated.Value[]>(
    Array.from({ length: 9 }, () => new Animated.Value(0)),
  );

  // Reference to store interval IDs (if using setInterval)
  // Not recommended in React Native; using Animated API instead

  /**
   * Animates the waveform bars using the Animated API.
   */
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
   * Resets the waveform animations to their initial state.
   */
  const resetWaveform = () => {
    waveformAnimations.forEach((animation) => {
      animation.setValue(0);
      animation.stopAnimation();
    });
  };

  /**
   * Retrieves the animation duration for a specific bar.
   * @param index - The index of the waveform bar.
   * @returns number - The duration in milliseconds.
   */
  const getAnimationDuration = (index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 400;
  };

  useEffect(() => {
    if (showWaveform) {
      animateWaveform();
    } else {
      resetWaveform();
    }

    // Cleanup animations on component unmount or when showWaveform changes
    return () => {
      resetWaveform();
    };

  }, [showWaveform]);

  return (
    <View style={[styles.card, customStyle]}>
      {imageSource && (
        <Image
          source={{ uri: imageSource }}
          style={[
            styles.backgroundImage,
            roundedImage && styles.roundedImage,
            imageStyle,
          ]}
          resizeMode="cover"
        />
      )}
      <View style={[getOverlayPosition({ position: overlayPosition }), styles.overlayContainer]}>
        <View style={styles.nameColumn}>
          <Text style={[styles.nameText, { color: textColor }]}>{name}</Text>
        </View>
        {showWaveform && (
          <View style={styles.waveformContainer}>
            {waveformAnimations.map((animation, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.bar,
                  {
                    height: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 16],
                    }),
                    backgroundColor: barColor,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default MiniCardAudio;

/**
 * Stylesheet for the MiniCardAudio component.
 */
const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#2c678f',
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlayContainer: {
    position: 'absolute',
    // Additional positioning handled by getOverlayPositionStyle
  },
  nameColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginEnd: 2,
    borderRadius: 5,
  },
  nameText: {
    fontSize: 14,
    color: 'white',
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
  bar: {
    width: 4,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  backgroundImage: {
    width: '60%',
    height: '60%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedImage: {
    borderRadius: 50, // Fully rounded
  },
});
