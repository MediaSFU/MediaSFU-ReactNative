import React from 'react';
import MainContainerComponent, { MainContainerComponentOptions } from '../../components/displayComponents/MainContainerComponent';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernMainContainerComponentOptions = MainContainerComponentOptions & { isDarkMode?: boolean };

export const ModernMainContainerComponent: React.FC<ModernMainContainerComponentOptions> = (props) => {
  const colors = getModernColors(resolveIsDarkMode(props));

  return (
    <MainContainerComponent
      {...props}
      backgroundColor={props.backgroundColor ?? colors.roomBackground}
      style={[
        {
          backgroundColor: props.backgroundColor ?? colors.roomBackground,
        },
        props.style,
      ] as any}
    />
  );
};

export default ModernMainContainerComponent;