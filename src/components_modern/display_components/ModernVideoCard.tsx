import React from 'react';
import VideoCard, { VideoCardOptions } from '../../components/displayComponents/VideoCard';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';
import { stageCardPropsEqual } from './stageCardMemo';

export type ModernVideoCardOptions = VideoCardOptions & { isDarkMode?: boolean };

const ModernVideoCardComponent: React.FC<ModernVideoCardOptions> = (props) => {
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

export const ModernVideoCard = React.memo(ModernVideoCardComponent, stageCardPropsEqual);
ModernVideoCard.displayName = 'ModernVideoCard';

export default ModernVideoCard;
