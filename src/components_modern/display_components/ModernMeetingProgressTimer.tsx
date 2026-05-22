import React from 'react';
import MeetingProgressTimer, { MeetingProgressTimerOptions } from '../../components/displayComponents/MeetingProgressTimer';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernMeetingProgressTimerOptions = MeetingProgressTimerOptions & { isDarkMode?: boolean; parameters?: any };

export const ModernMeetingProgressTimer: React.FC<ModernMeetingProgressTimerOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));

  return (
    <MeetingProgressTimer
      {...props}
      initialBackgroundColor={props.initialBackgroundColor ?? colors.accent}
      textStyle={[
        {
          color: colors.invertedText,
          fontWeight: '800',
        },
        props.textStyle,
      ] as any}
    />
  );
};

export default ModernMeetingProgressTimer;