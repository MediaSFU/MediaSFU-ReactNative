import React from 'react';
import { StyleSheet } from 'react-native';
import MiniAudio, { MiniAudioOptions } from '../../components/displayComponents/MiniAudio';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernMiniAudioOptions = MiniAudioOptions & { isDarkMode?: boolean; parameters?: any };

export const ModernMiniAudio: React.FC<ModernMiniAudioOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));
  const flattenedStyle = StyleSheet.flatten(props.customStyle) || {};
  const usesDefaultGray = flattenedStyle.backgroundColor === 'gray';

  return (
    <MiniAudio
      {...props}
      barColor={props.barColor === 'white' ? colors.accentAlt : props.barColor ?? colors.accentAlt}
      textColor={props.textColor ?? colors.invertedText}
      roundedImage={props.roundedImage ?? true}
      customStyle={[
        {
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: usesDefaultGray ? colors.mediaTileAlt : colors.mediaTile,
          overflow: 'hidden',
        },
        usesDefaultGray ? null : props.customStyle,
      ] as any}
      nameTextStyling={[
        {
          color: colors.invertedText,
          backgroundColor: 'rgba(0, 0, 0, 0.46)',
          fontWeight: '700',
        },
        props.nameTextStyling,
      ] as any}
      imageStyle={[
        {
          opacity: resolveIsDarkMode(props) ? 0.82 : 0.9,
        },
        props.imageStyle,
      ] as any}
    />
  );
};

export default ModernMiniAudio;