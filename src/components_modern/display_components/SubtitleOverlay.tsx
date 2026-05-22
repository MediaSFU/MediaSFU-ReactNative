import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isSubtitleExpired } from 'mediasfu-shared';
import { useLiveSubtitles } from '../../contexts/LiveSubtitleContext';

export interface SubtitleOverlayProps {
  speakerId: string;
  speakerName: string;
  fallbackText?: string | null;
  showSubtitles?: boolean;
  isDarkMode?: boolean;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  speakerId,
  speakerName,
  fallbackText,
  showSubtitles = true,
  isDarkMode = true,
}) => {
  const subtitleContext = useLiveSubtitles();
  const subtitle = subtitleContext?.getSubtitleForSpeaker(speakerId, speakerName) || null;
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setIsExpired(false);

    if (!subtitle) {
      return undefined;
    }

    if (isSubtitleExpired(subtitle)) {
      setIsExpired(true);
      return undefined;
    }

    const timeoutMs = Math.max(0, subtitle.expiresAt - Date.now());
    const timer = setTimeout(() => {
      setIsExpired(true);
    }, timeoutMs + 50);

    return () => clearTimeout(timer);
  }, [subtitle]);

  const shouldShowSubtitles = subtitleContext
    ? subtitleContext.showSubtitlesOnCards
    : showSubtitles;
  const subtitleText = subtitle && !isExpired
    ? subtitle.text
    : subtitleContext
    ? null
    : fallbackText || null;

  if (!shouldShowSubtitles || !subtitleText) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? 'rgba(2, 6, 23, 0.72)' : 'rgba(255, 255, 255, 0.92)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(148, 163, 184, 0.28)',
        },
      ]}
    >
      <Text
        style={[styles.text, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}
        numberOfLines={3}
      >
        {subtitleText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 3,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SubtitleOverlay;