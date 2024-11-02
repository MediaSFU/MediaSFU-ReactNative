// ControlButtonsComponent.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export interface Button {
  name?: string;
  icon?: string;
  alternateIcon?: string;
  onPress?: () => void;
  backgroundColor?: {
    default?: string;
    pressed?: string;
  };
  active?: boolean;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  customComponent?: JSX.Element;
  color?: string;
  activeColor?: string;
  inActiveColor?: string;
  disabled?: boolean;
  show?: boolean;
}

export interface ControlButtonsComponentOptions {
  buttons: Button[];
  buttonColor?: string;
  buttonBackgroundColor?: {
    default?: string;
    pressed?: string;
  };
  alignment?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  vertical?: boolean;
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
}

export type ControlButtonsComponentType = (
  options: ControlButtonsComponentOptions
) => JSX.Element;

/**
 * ControlButtonsComponent renders a set of customizable control buttons with options for layout, style, and alignment.
 *
 * This component supports flexible alignment, background colors, vertical/horizontal orientation, and custom icon behavior.
 * Each button can display an icon, alternate icon, or a custom component with active and disabled states.
 *
 * @component
 * @param {ControlButtonsComponentOptions} props - Configuration options for the control buttons.
 * @param {Button[]} props.buttons - Array of button configurations, including icon, color, and onPress behavior.
 * @param {string} [props.buttonColor] - Default color for the button icons.
 * @param {object} [props.buttonBackgroundColor] - Background colors for buttons, with `default` and `pressed` states.
 * @param {'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'} [props.alignment='flex-start'] - Alignment of buttons in the container.
 * @param {boolean} [props.vertical=false] - Determines whether buttons are arranged vertically.
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Additional custom styles for the container.
 *
 * @returns {JSX.Element} The rendered ControlButtonsComponent.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const buttons = [
 *     { name: 'Play', icon: 'play', onPress: () => console.log('Play pressed'), active: true },
 *     { name: 'Stop', icon: 'stop', onPress: () => console.log('Stop pressed') }
 *   ];
 *
 *   return (
 *     <ControlButtonsComponent
 *       buttons={buttons}
 *       alignment="center"
 *       buttonBackgroundColor={{ default: '#333', pressed: '#555' }}
 *       vertical={false}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const ControlButtonsComponent: React.FC<ControlButtonsComponentOptions> = ({
  buttons,
  buttonBackgroundColor,
  alignment = 'flex-start',
  vertical = false,
  buttonsContainerStyle,
}) => {
  /**
   * getAlignmentStyle - Computes alignment styles based on alignment prop.
   * @returns {StyleProp<ViewStyle>} The computed alignment styles.
   */
  const getAlignmentStyle = (): StyleProp<ViewStyle> => {
    const alignmentStyle: ViewStyle = {};

    switch (alignment) {
      case 'center':
        alignmentStyle.justifyContent = 'center';
        break;
      case 'flex-end':
        alignmentStyle.justifyContent = 'flex-end';
        break;
      case 'space-between':
        alignmentStyle.justifyContent = 'space-between';
        break;
      case 'space-around':
        alignmentStyle.justifyContent = 'space-around';
        break;
      case 'space-evenly':
        alignmentStyle.justifyContent = 'space-evenly';
        break;
      case 'flex-start':
      default:
        alignmentStyle.justifyContent = 'flex-start';
        break;
    }

    return alignmentStyle;
  };


  return (
    <View
      style={[
        styles.container,
        getAlignmentStyle(),
        buttonsContainerStyle,
        { display: 'flex'},
      ]}
    >
      {buttons.map((button, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.buttonContainer,
            {
              backgroundColor: pressed
                ? buttonBackgroundColor?.pressed || '#444'
                : buttonBackgroundColor?.default || 'transparent',
            },
            vertical && styles.verticalButton,
          ]}
          onPress={button.onPress}
          disabled={button.disabled}
        >
          {button.icon ? (
            button.active ? (
              button.alternateIconComponent ? (
                button.alternateIconComponent
              ) : button.alternateIcon ? (
                <FontAwesome5
                  name={button.alternateIcon}
                  size={24}
                  color={button.activeColor || '#ffffff'}
                />
              ) : null
            ) : button.iconComponent ? (
              button.iconComponent
            ) : button.icon ? (
              <FontAwesome5
                name={button.icon}
                size={24}
                color={button.inActiveColor || '#ffffff'}
              />
            ) : null
          ) : (
            button.customComponent
          )}
          {button.name && (
            <Text
              style={[styles.buttonText, { color: button.color || '#ffffff' }]}
            >
              {button.name}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ControlButtonsComponent;
