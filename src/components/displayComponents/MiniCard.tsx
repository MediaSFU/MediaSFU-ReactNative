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
}

export type MiniCardType = (options: MiniCardOptions) => JSX.Element;

/**
 * MiniCard component displays a small card with either an image or initials.
 *
 * @component
 * @param {MiniCardOptions} props - The properties for the MiniCard component.
 * @returns {JSX.Element} The rendered MiniCard component.
 *
 * @example
 * <MiniCard
 *   initials="AB"
 *   fontSize={18}
 *   customStyle={{ backgroundColor: '#f0f0f0' }}
 *   imageSource="https://example.com/image.jpg"
 *   roundedImage={true}
 *   imageStyle={{ width: 50, height: 50 }}
 * />
 */
const MiniCard: React.FC<MiniCardOptions> = ({
  initials,
  fontSize = 14,
  customStyle,
  imageSource,
  roundedImage = true,
  imageStyle,
}) => {
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
