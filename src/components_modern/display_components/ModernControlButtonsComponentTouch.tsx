import React from 'react';
import ControlButtonsComponentTouch, { ControlButtonsComponentTouchOptions } from '../../components/displayComponents/ControlButtonsComponentTouch';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernControlButtonsComponentTouchOptions = ControlButtonsComponentTouchOptions & { isDarkMode?: boolean };

export const ModernControlButtonsComponentTouch: React.FC<ModernControlButtonsComponentTouchOptions> = (props) => {
  const hasLightModeAction = props.buttons.some((button) => button.name === 'Light Mode');
  const hasDarkModeAction = props.buttons.some((button) => button.name === 'Dark Mode');
  const isDarkMode = hasLightModeAction ? true : hasDarkModeAction ? false : resolveIsDarkMode(props);
  const colors = getModernColors(isDarkMode);
  const normalize = (value: string | undefined, fallback: string) => (
    isDarkMode && value === 'black' ? fallback : value ?? fallback
  );

  return (
    <ControlButtonsComponentTouch
      {...props}
      buttons={props.buttons.filter((button) => button.show !== false).map((button) => ({
        ...button,
        activeColor: normalize(button.activeColor, colors.invertedText),
        inActiveColor: normalize(button.inActiveColor, colors.text),
        color: normalize(button.color, colors.text),
        backgroundColor: button.backgroundColor ?? {
          default: button.active ? colors.accent : colors.surface,
          pressed: colors.accentSoft,
        },
      }))}
    />
  );
};

export default ModernControlButtonsComponentTouch;