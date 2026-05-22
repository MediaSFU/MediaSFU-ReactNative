import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getOverlayPosition } from '../../methods/utils/getOverlayPosition';
import { controlMedia } from '../../consumers/controlMedia';
import type { AudioCardOptions } from '../../components/displayComponents/AudioCard';
import { getModernColors, modernShadow, resolveIsDarkMode } from '../core/modernTheme';
import { ModernMiniCard } from './ModernMiniCard';
import { SubtitleOverlay } from './SubtitleOverlay';

export interface ModernAudioCardOptions extends AudioCardOptions {
  isDarkMode?: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ModernAudioCard: React.FC<ModernAudioCardOptions> = (props) => {
  const {
    controlUserMedia = controlMedia,
    customStyle,
    name,
    barColor,
    textColor,
    imageSource,
    roundedImage = true,
    imageStyle,
    showControls = true,
    showInfo = true,
    videoInfoComponent,
    videoControlsComponent,
    controlsPosition = 'topLeft',
    infoPosition = 'bottomLeft',
    participant,
    backgroundColor,
    audioDecibels,
    liveSubtitleText,
    showSubtitles = true,
    parameters,
    customAudioCard,
    style,
    renderContent,
    renderContainer,
  } = props;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveformValues, setWaveformValues] = useState([3, 3, 3, 3, 3]);

  const darkMode = resolveIsDarkMode(props);
  const colors = getModernColors(darkMode);
  const resolvedBackgroundColor =
    backgroundColor && backgroundColor !== 'transparent'
      ? backgroundColor
      : colors.mediaTileAlt;
  const resolvedBarColor = !barColor || barColor.toLowerCase() === 'red'
    ? colors.accentAlt
    : barColor;
  const resolvedTextColor = textColor ?? colors.invertedText;

  const avatarSize = useMemo(() => {
    if (!dimensions.width || !dimensions.height) {
      return 120;
    }

    return clamp(Math.min(dimensions.width, dimensions.height) * 0.3, 92, 150);
  }, [dimensions.height, dimensions.width]);

  const badgeIconSize = useMemo(
    () => clamp(Math.round(avatarSize * 0.13), 11, 15),
    [avatarSize],
  );

  const displayName = useMemo(() => name.trim().slice(0, 24), [name]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return { width, height };
    });
  }, []);

  useEffect(() => {
    const resolveSpeakingState = () => {
      const latestAudioDecibels = parameters?.getUpdatedAllParams?.()?.audioDecibels;
      const activeAudioEntry =
        audioDecibels ??
        latestAudioDecibels?.find(
          (entry: { name: string; averageLoudness: number }) =>
            entry.name === name || entry.name === participant?.name,
        );

      const averageLoudness = activeAudioEntry?.averageLoudness ?? 0;
      setIsSpeaking(averageLoudness > 127.5 && !participant?.muted);
    };

    resolveSpeakingState();
    const interval = setInterval(resolveSpeakingState, 900);

    return () => clearInterval(interval);
  }, [audioDecibels, name, parameters, participant?.muted, participant?.name]);

  useEffect(() => {
    if (!isSpeaking) {
      setWaveformValues([3, 3, 3, 3, 3]);
      return undefined;
    }

    const interval = setInterval(() => {
      setWaveformValues([
        clamp(Math.round(Math.random() * 16) + 4, 4, 22),
        clamp(Math.round(Math.random() * 12) + 6, 4, 22),
        clamp(Math.round(Math.random() * 18) + 4, 4, 24),
        clamp(Math.round(Math.random() * 12) + 6, 4, 22),
        clamp(Math.round(Math.random() * 16) + 4, 4, 22),
      ]);
    }, 150);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  const invokeMediaControl = useCallback(
    async (type: 'audio' | 'video') => {
      if (!controlUserMedia || !participant?.id || !parameters?.getUpdatedAllParams) {
        return;
      }

      const updatedParams = parameters.getUpdatedAllParams();
      await controlUserMedia({
        participantId: participant.id,
        participantName: participant.name,
        type,
        socket: updatedParams.socket,
        roomName: updatedParams.roomName,
        coHostResponsibility: updatedParams.coHostResponsibility,
        showAlert: updatedParams.showAlert,
        coHost: updatedParams.coHost,
        participants: updatedParams.participants,
        member: updatedParams.member,
        islevel: updatedParams.islevel,
      });
    },
    [controlUserMedia, parameters, participant],
  );

  const handleToggleAudio = useCallback(async () => {
    if (!participant?.muted) {
      await invokeMediaControl('audio');
    }
  }, [invokeMediaControl, participant?.muted]);

  const handleToggleVideo = useCallback(async () => {
    if (participant?.videoOn || participant?.videoID) {
      await invokeMediaControl('video');
    }
  }, [invokeMediaControl, participant?.videoID, participant?.videoOn]);

  const defaultContent = customAudioCard ? (
    customAudioCard({
      ...props,
      barColor: resolvedBarColor,
      textColor: resolvedTextColor,
      backgroundColor: resolvedBackgroundColor,
    })
  ) : (
    <View style={styles.contentShell} onLayout={handleLayout}>
      <View style={styles.avatarZone}>
        {isSpeaking ? (
          <View
            pointerEvents="none"
            style={[
              styles.speakingHalo,
              {
                width: avatarSize + 28,
                height: avatarSize + 28,
                borderRadius: (avatarSize + 28) / 2,
                borderColor: resolvedBarColor,
                backgroundColor: 'transparent',
              },
            ]}
          />
        ) : null}

        <View style={{ width: avatarSize, height: avatarSize }}>
          <ModernMiniCard
            initials={name}
            name={name}
            imageSource={imageSource}
            imageStyle={imageStyle}
            roundedImage={roundedImage}
            fontSize={Math.max(16, Math.round(avatarSize * 0.22))}
            isDarkMode={darkMode}
            size={avatarSize}
            showGradientBackground
            showBorder
          />
        </View>
      </View>

      <View style={styles.statusCluster}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: participant?.muted
                ? 'rgba(127, 29, 29, 0.66)'
                : 'rgba(8, 145, 178, 0.40)',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : colors.border,
            },
          ]}
        >
          <FontAwesome5
            name={participant?.muted ? 'microphone-slash' : 'microphone'}
            size={badgeIconSize}
            color={resolvedTextColor}
          />
        </View>
        <View
          style={[
            styles.statusBadge,
            styles.statusBadgeSpacer,
            {
              backgroundColor: participant?.videoOn || participant?.videoID
                ? 'rgba(15, 118, 110, 0.38)'
                : 'rgba(71, 85, 105, 0.44)',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : colors.border,
            },
          ]}
        >
          <FontAwesome5
            name={participant?.videoOn || participant?.videoID ? 'video' : 'video-slash'}
            size={badgeIconSize}
            color={resolvedTextColor}
          />
        </View>
      </View>

      {(videoInfoComponent || showInfo) && (
        <View
          style={[
            styles.infoOverlay,
            getOverlayPosition({ position: infoPosition }),
            {
              backgroundColor: darkMode ? 'rgba(2, 6, 23, 0.68)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : colors.border,
            },
          ]}
        >
          {videoInfoComponent ? (
            videoInfoComponent
          ) : (
            <>
              {isSpeaking ? (
                <View style={[styles.speakingDot, { backgroundColor: colors.success }]} />
              ) : null}
              <Text style={[styles.nameText, { color: resolvedTextColor }]} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={styles.waveformRow}>
                {waveformValues.map((value, index) => (
                  <View
                    key={`${displayName}-wave-${index}`}
                    style={[
                      styles.waveformBar,
                      {
                        height: isSpeaking ? value : 3,
                        backgroundColor: resolvedBarColor,
                      },
                    ]}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      )}

      {(videoControlsComponent || showControls) && (
        <View style={[styles.controlsOverlay, getOverlayPosition({ position: controlsPosition })]}>
          {videoControlsComponent ? (
            videoControlsComponent
          ) : (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={participant?.muted ? 'Participant microphone is muted' : 'Mute participant microphone'}
                disabled={participant?.muted}
                onPress={handleToggleAudio}
                style={({ pressed }) => [
                  styles.controlButton,
                  {
                    backgroundColor: pressed
                      ? 'rgba(15, 23, 42, 0.82)'
                      : darkMode
                      ? 'rgba(15, 23, 42, 0.72)'
                      : 'rgba(255, 255, 255, 0.90)',
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : colors.border,
                    opacity: participant?.muted ? 0.7 : 1,
                  },
                ]}
              >
                <FontAwesome5
                  name={participant?.muted ? 'microphone-slash' : 'microphone'}
                  size={14}
                  color={participant?.muted ? colors.danger : resolvedTextColor}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={participant?.videoOn || participant?.videoID ? 'Turn participant camera off' : 'Participant camera is off'}
                disabled={!participant?.videoOn && !participant?.videoID}
                onPress={handleToggleVideo}
                style={({ pressed }) => [
                  styles.controlButton,
                  styles.controlButtonSpacer,
                  {
                    backgroundColor: pressed
                      ? 'rgba(15, 23, 42, 0.82)'
                      : darkMode
                      ? 'rgba(15, 23, 42, 0.72)'
                      : 'rgba(255, 255, 255, 0.90)',
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : colors.border,
                    opacity: participant?.videoOn || participant?.videoID ? 1 : 0.7,
                  },
                ]}
              >
                <FontAwesome5
                  name={participant?.videoOn || participant?.videoID ? 'video' : 'video-slash'}
                  size={14}
                  color={participant?.videoOn || participant?.videoID ? resolvedTextColor : colors.danger}
                />
              </Pressable>
            </>
          )}
        </View>
      )}

      <SubtitleOverlay
        speakerId={participant?.id || ''}
        speakerName={participant?.name || name || ''}
        fallbackText={liveSubtitleText}
        showSubtitles={showSubtitles}
        isDarkMode={darkMode}
      />
    </View>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.card,
        modernShadow,
        {
          backgroundColor: resolvedBackgroundColor,
          borderColor: colors.border,
        },
        customStyle,
        style,
      ]}
    >
      {content}
    </View>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  contentShell: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarZone: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  speakingHalo: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  statusCluster: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 3,
  },
  statusBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusBadgeSpacer: {
    marginTop: 8,
  },
  infoOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '72%',
    zIndex: 3,
  },
  speakingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 160,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 10,
    minWidth: 30,
    height: 20,
  },
  waveformBar: {
    width: 3,
    marginLeft: 3,
    borderRadius: 999,
  },
  controlsOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 3,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  controlButtonSpacer: {
    marginLeft: 8,
  },
});

export default ModernAudioCard;