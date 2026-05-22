import React from 'react';
import VideoCard, { VideoCardOptions } from '../../components/displayComponents/VideoCard';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernVideoCardOptions = VideoCardOptions & { isDarkMode?: boolean };

export const ModernVideoCard: React.FC<ModernVideoCardOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));

  return (
    <VideoCard
      {...props}
      backgroundColor={!props.backgroundColor || props.backgroundColor === 'transparent' ? colors.mediaTile : props.backgroundColor}
      barColor={props.barColor ?? colors.accent}
      textColor={props.textColor ?? colors.invertedText}
      customStyle={[
        {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        },
        props.customStyle,
      ] as any}
    />
  );
};

export default ModernVideoCard;