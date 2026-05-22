import React from 'react';
import FlexibleGrid, { FlexibleGridOptions } from '../../components/displayComponents/FlexibleGrid';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernFlexibleGridOptions = FlexibleGridOptions & { isDarkMode?: boolean };

export const ModernFlexibleGrid: React.FC<ModernFlexibleGridOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));

  return (
    <FlexibleGrid
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

export default ModernFlexibleGrid;