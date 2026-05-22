import React from 'react';
import FlexibleVideo, { FlexibleVideoOptions } from '../../components/displayComponents/FlexibleVideo';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernFlexibleVideoOptions = FlexibleVideoOptions & { isDarkMode?: boolean };

export const ModernFlexibleVideo: React.FC<ModernFlexibleVideoOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));

  return (
    <FlexibleVideo
      {...props}
      backgroundColor={props.backgroundColor ?? colors.roomSurface}
      style={[
        {
          backgroundColor: props.backgroundColor ?? colors.roomSurface,
        },
        props.style,
      ] as any}
    />
  );
};

export default ModernFlexibleVideo;