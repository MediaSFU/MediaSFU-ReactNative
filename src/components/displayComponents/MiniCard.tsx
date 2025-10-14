// MiniCard.tsx

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  LayoutChangeEvent,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CustomMiniCardType } from '../../@types/types';

/**
 * Options for rendering a `MiniCard`.
 *
 * @interface MiniCardOptions
 *
 * **Appearance:**
 * @property {string} [initials] Fallback initials when no image is provided.
 * @property {number} [fontSize=14] Font size for initials.
 * @property {StyleProp<ViewStyle>} [customStyle] Styling for the inner card surface.
 * @property {StyleProp<ViewStyle>} [style] Styling applied to the outer wrapper.
 *
 * **Imagery:**
 * @property {string} [imageSource] Optional avatar URL.
 * @property {boolean} [roundedImage=true] Whether to round the avatar image.
 * @property {StyleProp<ImageStyle>} [imageStyle] Additional avatar styling.
 *
 * **Badges:**
 * @property {boolean} [showVideoIcon] Indicates video availability.
 * @property {boolean} [showAudioIcon] Indicates audio availability.
 * @property {string} [name] Participant name associated with the card.
 *
 * **Customization:**
 * @property {CustomMiniCardType} [customMiniCard] Override for the default mini card presentation.
 * @property {any} [parameters] Additional data forwarded to custom renderers.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override the internal card structure.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override the surrounding container implementation.
 */
export interface MiniCardOptions {
  initials?: string;
  fontSize?: number;
  customStyle?: StyleProp<ViewStyle>;
  imageSource?: string;
  roundedImage?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  showVideoIcon?: boolean;
  showAudioIcon?: boolean;
  name?: string;
  customMiniCard?: CustomMiniCardType;
  parameters?: any;
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

export type MiniCardType = (options: MiniCardOptions) => JSX.Element;

/**
 * MiniCard displays a compact avatar block using either initials or an image and exposes override hooks for
 * complete customization. It is commonly used as a fallback for video/audio cards and participant badges.
 *
 * ### Key Features
 * - Displays initials or avatar imagery with optional rounded styling.
 * - Supports custom renderers for fully bespoke layouts.
 * - Emits optional audio/video badges via icon flags.
 *
 * @param {MiniCardOptions} props Mini card configuration.
 * @returns {JSX.Element} Rendered mini card.
 */
const MiniCard: React.FC<MiniCardOptions> = ({
  initials,
  fontSize = 14,
  customStyle,
  imageSource,
  roundedImage = true,
  imageStyle,
  showVideoIcon = false,
  showAudioIcon = false,
  name,
  customMiniCard,
  parameters,
  style,
  renderContent,
  renderContainer,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const cardStyle: StyleProp<ViewStyle> = useMemo(
    () => [styles.miniCard, customStyle, style],
    [customStyle, style],
  );

  const resolvedInitials = useMemo(() => {
    if (initials && initials.trim().length > 0) {
      return initials.trim().slice(0, 3).toUpperCase();
    }

    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/).slice(0, 3);
      return parts.map((part) => part.charAt(0).toUpperCase()).join('');
    }

    return '??';
  }, [initials, name]);

  const accessibilityLabel = useMemo(() => {
    const base = name || resolvedInitials;
    const badges: string[] = [];
    if (showVideoIcon) {
      badges.push('video on');
    }
    if (showAudioIcon) {
      badges.push('audio on');
    }

    return badges.length > 0 ? `${base} (${badges.join(', ')})` : base;
  }, [name, resolvedInitials, showAudioIcon, showVideoIcon]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return { width, height };
    });
  }, []);

  const defaultContent = useMemo(() => {
    if (customMiniCard) {
      return customMiniCard({
        initials: resolvedInitials,
        fontSize,
        customStyle,
        name: name || resolvedInitials,
        showVideoIcon,
        showAudioIcon,
        imageSource,
        roundedImage,
        imageStyle,
        parameters,
      });
    }

    return (
      <View style={styles.defaultContent}>
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
          <Text style={[styles.initials, { fontSize }]}>{resolvedInitials}</Text>
        )}

        {(showVideoIcon || showAudioIcon) && (
          <View style={styles.badgeContainer}>
            {showVideoIcon && (
              <FontAwesome
                name="video-camera"
                size={14}
                style={[styles.badgeIcon, styles.badgeIconFirst]}
              />
            )}
            {showAudioIcon && (
              <FontAwesome
                name="microphone"
                size={14}
                style={[styles.badgeIcon, showVideoIcon ? null : styles.badgeIconFirst]}
              />
            )}
          </View>
        )}
      </View>
    );
  }, [
    customMiniCard,
    resolvedInitials,
    fontSize,
    customStyle,
    name,
    showVideoIcon,
    showAudioIcon,
    imageSource,
    roundedImage,
    imageStyle,
    parameters,
  ]);

  const content = useMemo(() => (
    renderContent ? renderContent({ defaultContent, dimensions }) : defaultContent
  ), [defaultContent, dimensions, renderContent]);

  const defaultContainer = (
    <View
      style={cardStyle}
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

export default MiniCard;

/**
 * Stylesheet for the MiniCard component.
 */
const styles = StyleSheet.create({
  miniCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    width: '100%',
    height: '100%',
    color: 'white',
    fontFamily: 'Nunito',
    overflow: 'hidden',
    position: 'relative',
  },
  defaultContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
    borderRadius: 50,
  },
  initials: {
    textAlign: 'center',
    color: 'black',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeIcon: {
    color: '#ffffff',
    marginLeft: 6,
  },
  badgeIconFirst: {
    marginLeft: 0,
  },
});
