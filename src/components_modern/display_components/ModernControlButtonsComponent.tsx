import React from 'react';
import ControlButtonsComponent, { ControlButtonsComponentOptions } from '../../components/displayComponents/ControlButtonsComponent';
import { getModernColors, resolveIsDarkMode } from '../core/modernTheme';

export type ModernControlButtonsComponentOptions = ControlButtonsComponentOptions & { isDarkMode?: boolean };

export const ModernControlButtonsComponent: React.FC<ModernControlButtonsComponentOptions> = (props) => {
  const hasLightModeAction = props.buttons.some((button) => button.name === 'Light Mode');
  const hasDarkModeAction = props.buttons.some((button) => button.name === 'Dark Mode');
  const isDarkMode = hasLightModeAction ? true : hasDarkModeAction ? false : resolveIsDarkMode(props);
  const colors = getModernColors(isDarkMode);
  const normalize = (value: string | undefined, fallback: string) => (
    isDarkMode && value === 'black' ? fallback : value ?? fallback
  );

  return (
    <ControlButtonsComponent
      {...props}
      buttonBackgroundColor={props.buttonBackgroundColor ?? {
        default: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15, 23, 42, 0.08)',
        pressed: colors.accentSoft,
      }}
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
      buttonsContainerStyle={[
        {
          padding: 6,
          borderRadius: 18,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        props.buttonsContainerStyle,
      ] as any}
    />
  );
};

export default ModernControlButtonsComponent;