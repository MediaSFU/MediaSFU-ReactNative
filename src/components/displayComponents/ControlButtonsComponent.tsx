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
 * ControlButtonsComponent is a React Native functional component that renders a set of control buttons.
 *
 * @param {ControlButtonsComponentOptions} props - The properties for the component.
 * @param {Array<Button>} props.buttons - An array of button options to render.
 * @param {string} [props.buttonBackgroundColor.default] - The default background color for the buttons.
 * @param {string} [props.buttonBackgroundColor.pressed] - The background color for the buttons when pressed.
 * @param {string} [props.alignment='flex-start'] - The alignment of the buttons within the container.
 * @param {boolean} [props.vertical=false] - Whether the buttons should be arranged vertically.
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Additional styles for the buttons container.
 * @param {boolean} [props.showAspect=false] - Whether to display the buttons container.
 *
 * @returns {JSX.Element} The rendered component.
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
