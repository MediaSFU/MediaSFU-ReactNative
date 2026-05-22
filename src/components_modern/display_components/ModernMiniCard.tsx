import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import type { MiniCardOptions } from '../../components/displayComponents/MiniCard';
import { getModernColors, modernShadow, resolveIsDarkMode } from '../core/modernTheme';

export interface ModernMiniCardOptions extends MiniCardOptions {
  isDarkMode?: boolean;
  backgroundColor?: string;
  showGradientBackground?: boolean;
  showBorder?: boolean;
  size?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ModernMiniCard: React.FC<ModernMiniCardOptions> = ({
  initials,
  fontSize = 14,
  textColor,
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
  isDarkMode,
  backgroundColor,
  showGradientBackground = true,
  showBorder = true,
  size,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const darkMode = resolveIsDarkMode({ isDarkMode, parameters } as any);
  const colors = getModernColors(darkMode);

  const resolvedLabel = useMemo(() => {
    const rawAvatarLabel = initials?.trim() || name?.trim() || '?';
    return rawAvatarLabel.slice(0, 10);
  }, [initials, name]);

  const resolvedTextColor = useMemo(
    () => textColor ?? colors.invertedText,
    [colors.invertedText, textColor],
  );

  const avatarSize = useMemo(() => {
    if (typeof size === 'number' && size > 0) {
      return clamp(size, 32, 140);
    }

    if (!dimensions.width || !dimensions.height) {
      return 72;
    }

    return clamp(Math.min(dimensions.width, dimensions.height) * 0.72, 32, 140);
  }, [dimensions.height, dimensions.width, size]);

  const resolvedFontSize = useMemo(() => {
    const baseSize = typeof size === 'number' && size > 0 ? size : avatarSize;
    const widthFit = baseSize / Math.max(resolvedLabel.length * 0.58, 1);
    const heightFit = baseSize * 0.28;
    return Math.max(10, Math.min(fontSize, Math.floor(widthFit), Math.floor(heightFit)));
  }, [avatarSize, fontSize, resolvedLabel.length, size]);

  const badgeIconSize = useMemo(
    () => clamp(Math.round(avatarSize * 0.15), 10, 14),
    [avatarSize],
  );

  const haloSize = avatarSize + 18;
  const circleBackgroundColor = backgroundColor ?? (darkMode ? colors.surfaceMuted : colors.surfaceStrong);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return { width, height };
    });
  }, []);

  const defaultContent = customMiniCard ? (
    customMiniCard({
      initials: resolvedLabel,
      fontSize: resolvedFontSize,
      textColor: resolvedTextColor,
      customStyle,
      imageSource,
      roundedImage,
      imageStyle,
      showVideoIcon,
      showAudioIcon,
      name,
      parameters,
      style,
    })
  ) : (
    <View style={styles.contentShell}>
      {roundedImage && (
        <View
          pointerEvents="none"
          style={[
            styles.avatarHalo,
            {
              width: haloSize,
              height: haloSize,
              borderRadius: haloSize / 2,
              backgroundColor: darkMode ? colors.accentSoft : 'rgba(37, 99, 235, 0.16)',
            },
          ]}
        />
      )}

      <View
        style={[
          styles.avatarFrame,
          roundedImage ? styles.roundedFrame : styles.squareFrame,
          roundedImage
            ? {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
              }
            : styles.fillFrame,
          {
            backgroundColor: circleBackgroundColor,
            borderColor: showBorder
              ? darkMode
                ? 'rgba(255, 255, 255, 0.16)'
                : colors.borderStrong
              : 'transparent',
          },
        ]}
      >
        {!imageSource && showGradientBackground && (
          <View
            pointerEvents="none"
            style={[
              styles.gradientUnderlay,
              {
                backgroundColor: darkMode ? colors.accent : colors.accentAlt,
                opacity: 0.22,
              },
            ]}
          />
        )}
        <View
          pointerEvents="none"
          style={[
            styles.glassSheen,
            {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.42)',
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.bottomTint,
            {
              backgroundColor: darkMode ? 'rgba(2, 6, 23, 0.22)' : 'rgba(37, 99, 235, 0.10)',
            },
          ]}
        />

        {imageSource ? (
          <Image
            source={{ uri: imageSource }}
            style={[
              styles.avatarImage,
              roundedImage ? { borderRadius: avatarSize / 2 } : null,
              imageStyle,
            ]}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.avatarLabel,
              {
                fontSize: resolvedFontSize,
                color: resolvedTextColor,
                textShadowColor: darkMode ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.55)',
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
          >
            {resolvedLabel}
          </Text>
        )}
      </View>

      {(showVideoIcon || showAudioIcon) && (
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: darkMode ? 'rgba(2, 6, 23, 0.72)' : 'rgba(255, 255, 255, 0.94)',
              borderColor: colors.border,
            },
          ]}
        >
          {showVideoIcon ? (
            <FontAwesome5 name="video" size={badgeIconSize} color={darkMode ? colors.invertedText : colors.text} />
          ) : null}
          {showAudioIcon ? (
            <FontAwesome5
              name="microphone"
              size={badgeIconSize}
              color={darkMode ? colors.invertedText : colors.text}
              style={showVideoIcon ? styles.statusIconGap : null}
            />
          ) : null}
        </View>
      )}
    </View>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[styles.container, customStyle, style]}
      onLayout={handleLayout}
      accessibilityRole="image"
      accessibilityLabel={name || resolvedLabel}
    >
      {content}
    </View>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    minWidth: 0,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  contentShell: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarHalo: {
    position: 'absolute',
    ...modernShadow,
  },
  avatarFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    ...modernShadow,
  },
  roundedFrame: {
    maxWidth: '82%',
    maxHeight: '82%',
  },
  squareFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  fillFrame: {
    width: '100%',
    height: '100%',
  },
  gradientUnderlay: {
    position: 'absolute',
    inset: 0,
  },
  glassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
  },
  bottomTint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '52%',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarLabel: {
    fontWeight: '800',
    maxWidth: '84%',
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusIconGap: {
    marginLeft: 6,
  },
});

export default ModernMiniCard;