// MiniCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { CustomMiniCardType } from '../../@types/types';

/**
 * Interface defining the props for the MiniCard component.
 */
export interface MiniCardOptions {
  /**
   * The initials to display if no image is provided.
   */
  initials?: string;

  /**
   * The font size for the initials.
   * @default 14
   */
  fontSize?: number;

  /**
   * Custom styles to apply to the card.
   */
  customStyle?: StyleProp<ViewStyle>;

  /**
   * The source URI of the image to display.
   */
  imageSource?: string;

  /**
   * Whether the image should have rounded corners.
   * @default true
   */
  roundedImage?: boolean;

  /**
   * Custom styles to apply to the image.
   */
  imageStyle?: StyleProp<ImageStyle>;

  /**
   * Whether to show the video icon.
   */
  showVideoIcon?: boolean;

  /**
   * Whether to show the audio icon.
   */
  showAudioIcon?: boolean;

  /**
   * The name of the participant.
   */
  name?: string;

  /**
   * Custom MiniCard component to replace default rendering.
   */
  customMiniCard?: CustomMiniCardType;

  /**
   * Additional parameters that can be passed to custom components.
   */
  parameters?: any;
}

export type MiniCardType = (options: MiniCardOptions) => JSX.Element;

/**
 * MiniCard component displays a small card with either an image or initials, providing flexible styling options.
 *
 * This component renders either an image or initials based on the provided props, supporting customizable
 * font size, border radius, and additional styling for the card and image.
 *
 * @component
 * @param {MiniCardOptions} props - Configuration options for the MiniCard component.
 * @param {string} [props.initials] - Initials to display if no image is provided.
 * @param {number} [props.fontSize=14] - Font size for the initials.
 * @param {StyleProp<ViewStyle>} [props.customStyle] - Custom styles for the card container.
 * @param {string} [props.imageSource] - URI of the image to display.
 * @param {boolean} [props.roundedImage=true] - Determines if the image should have rounded corners.
 * @param {StyleProp<ImageStyle>} [props.imageStyle] - Custom styles for the image.
 *
 * @returns {JSX.Element} The MiniCard component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MiniCard } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <MiniCard
 *       initials="AB"
 *       fontSize={18}
 *       customStyle={{ backgroundColor: '#f0f0f0', borderRadius: 10 }}
 *       imageSource="https://example.com/image.jpg"
 *       roundedImage={true}
 *       imageStyle={{ width: 50, height: 50 }}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const MiniCard: React.FC<MiniCardOptions> = ({
  initials,
  fontSize = 14,
  customStyle,
  imageSource,
  roundedImage = true,
  imageStyle,
  showVideoIcon,
  showAudioIcon,
  name,
  customMiniCard,
  parameters,
}) => {
  // If a custom mini card is provided, use it instead of the default
  if (customMiniCard) {
    return customMiniCard({
      initials: initials || '',
      fontSize,
      customStyle,
      name: name || '',
      showVideoIcon,
      showAudioIcon,
      imageSource,
      roundedImage,
      imageStyle,
      parameters,
    });
  }
  // Define the style for the MiniCard
  const cardStyle: StyleProp<ViewStyle> = [
    styles.miniCard,
    customStyle,
  ];

  // Render the MiniCard with either an image or initials
  return (
    <View style={cardStyle}>
      {imageSource ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageSource }}
            style={[
              styles.backgroundImage,
              roundedImage && styles.roundedImage,
              imageStyle,
            ]}
            resizeMode="cover"
          />
        </View>
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      )}
    </View>
  );
};

export default MiniCard;

/**
 * Stylesheet for the MiniCard component.
 */
const styles = StyleSheet.create({
  miniCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0, // Default border radius; can be overridden via customStyle
    width: '100%',
    height: '100%',
    color: 'white',
    fontFamily: 'Nunito',
    overflow: 'hidden',

  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '60%',
    height: '60%',
  },
  roundedImage: {
    borderRadius: 50, // Fully rounded; adjust as needed
  },
  initials: {
    textAlign: 'center',
    color: 'black',
  },
});
