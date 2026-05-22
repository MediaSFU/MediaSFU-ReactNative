import React from 'react';
import MiniAudioPlayer, { MiniAudioPlayerOptions } from '../../methods/utils/MiniAudioPlayer/MiniAudioPlayer';
import { resolveIsDarkMode } from '../core/modernTheme';
import { ModernMiniAudio } from './ModernMiniAudio';

export type ModernMiniAudioPlayerOptions = MiniAudioPlayerOptions & { isDarkMode?: boolean };

export const ModernMiniAudioPlayer: React.FC<ModernMiniAudioPlayerOptions> = (props) => {
  const isDarkMode = resolveIsDarkMode({ isDarkMode: props.isDarkMode, parameters: props.parameters });

  return (
    <MiniAudioPlayer
      {...props}
      MiniAudioComponent={props.MiniAudioComponent ?? ModernMiniAudio}
      miniAudioProps={{
        ...props.miniAudioProps,
        isDarkMode,
        parameters: props.parameters,
      }}
    />
  );
};

export default ModernMiniAudioPlayer;