import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';

/**
 * Enum for Overlay Positions.
 */
type OverlayPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/**
 * Options for rendering a `MiniCardAudio`.
 *
 * @interface MiniCardAudioOptions
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [customStyle] Additional styling for the audio card body.
 * @property {StyleProp<ViewStyle>} [style] Styling applied to the outer wrapper.
 * @property {string} name Participant label text.
 * @property {string} [imageSource] Optional background image.
 * @property {boolean} [roundedImage=false] Whether the image should be rounded.
 * @property {StyleProp<ImageStyle>} [imageStyle] Extra styling for the background image.
 *
 * **Waveform & Overlay:**
 * @property {boolean} showWaveform Toggles waveform animation visibility.
 * @property {OverlayPosition} [overlayPosition='topLeft'] Overlay anchor for the name/waveform row.
 * @property {string} [barColor='white'] Waveform bar color.
 * @property {string} [textColor='white'] Participant text color.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the internal layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for the outer container.
 */
export interface MiniCardAudioOptions {
  customStyle?: StyleProp<ViewStyle>;
  name: string;
  showWaveform: boolean;
  overlayPosition?: OverlayPosition;
  barColor?: string;
  textColor?: string;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
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

export type MiniCardAudioType = (options: MiniCardAudioOptions) => JSX.Element;

/**
 * MiniCardAudio renders a compact audio badge with optional waveform animation. It is ideal for spotlighting
 * speaking participants in grid layouts or mini overlays.
 *
 * ### Key Features
 * - Animated waveform synchronized via `Animated` API.
 * - Overlay positioning helper for name/waveform cluster.
 * - Supports background imagery with optional rounded styling.
 *
 * @param {MiniCardAudioOptions} props Audio mini card configuration.
 * @returns {JSX.Element} Rendered audio mini card.
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
  style,
  renderContent,
  renderContainer,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize waveform animation values
  const [waveformAnimations] = useState<Animated.Value[]>(
    Array.from({ length: 9 }, () => new Animated.Value(0)),
  );

  /**
   * Retrieves the animation duration for a specific bar.
   * @param {number} index - The index of the waveform bar.
   * @returns {number} The duration in milliseconds.
   */
  const getAnimationDuration = useCallback((index: number): number => {
    const durations = [474, 433, 407, 458, 400, 427, 441, 419, 487];
    return durations[index] || 400;
  }, []);

  /**
   * Animates the waveform bars using the Animated API.
   */
  const animateWaveform = useCallback(() => {
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
  }, [getAnimationDuration, waveformAnimations]);

  /**
   * Resets the waveform animations to their initial state.
   */
  const resetWaveform = useCallback(() => {
    waveformAnimations.forEach((animation) => {
      animation.setValue(0);
      animation.stopAnimation();
    });
  }, [waveformAnimations]);

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
  }, [animateWaveform, resetWaveform, showWaveform]);

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
    if (showWaveform) {
      return `${name} is speaking`;
    }
    return name;
  }, [name, showWaveform]);

  const defaultContent = useMemo(
    () => (
      <>
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
      </>
    ),
    [
      barColor,
      imageSource,
      imageStyle,
      name,
      overlayPosition,
      roundedImage,
      showWaveform,
      textColor,
      waveformAnimations,
    ],
  );

  const content = useMemo(
    () => (renderContent ? renderContent({ defaultContent, dimensions }) : defaultContent),
    [defaultContent, dimensions, renderContent],
  );

  const defaultContainer = (
    <View
      style={[styles.card, customStyle, style]}
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
