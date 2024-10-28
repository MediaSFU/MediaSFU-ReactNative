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

export interface ButtonTouch {
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
  show?: boolean;
  disabled?: boolean;
}

export interface ControlButtonsComponentTouchOptions {
  buttons: ButtonTouch[];
  position?: 'left' | 'right' | 'middle';
  location?: 'top' | 'bottom' | 'center';
  direction?: 'horizontal' | 'vertical';
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  showAspect?: boolean;
}

export type ControlButtonsComponentTouchType = (
  options: ControlButtonsComponentTouchOptions
) => JSX.Element;

/**
 * ControlButtonsComponentTouch is a React Native functional component that renders a set of control buttons.
 *
 * @param {ControlButtonsComponentTouchOptions} props - The properties for the component.
 * @param {Array<ButtonTouch>} props.buttons - An array of button objects to be rendered.
 * @param {string} [props.position='left'] - The horizontal alignment of the button container ('left', 'right', 'middle').
 * @param {string} [props.location='top'] - The vertical alignment of the button container ('top', 'bottom', 'center').
 * @param {string} [props.direction='horizontal'] - The direction in which buttons are arranged ('horizontal', 'vertical').
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Additional styles for the container of buttons.
 * @param {boolean} [props.showAspect=false] - Flag to determine if the button container should be displayed.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ControlButtonsComponentTouch: React.FC<
  ControlButtonsComponentTouchOptions
> = ({
  buttons,
  position = 'left',
  location = 'top',
  direction = 'horizontal',
  buttonsContainerStyle,
  showAspect = false,
}) => {
  /**
   * getAlignmentStyle - Computes alignment styles based on position, location, and direction.
   * @returns {StyleProp<ViewStyle>} The computed alignment styles.
   */
  const getAlignmentStyle = (): StyleProp<ViewStyle> => {
    const alignmentStyle: ViewStyle = {};

    // Horizontal alignment
    if (position === 'left' || position === 'right' || position === 'middle') {
      alignmentStyle.justifyContent =
        position === 'left'
          ? 'flex-start'
          : position === 'right'
          ? 'flex-end'
          : 'center';
    }

    // Vertical alignment
    if (location === 'top' || location === 'bottom' || location === 'center') {
      alignmentStyle.alignItems =
        location === 'top'
          ? 'flex-start'
          : location === 'bottom'
          ? 'flex-end'
          : 'center';
    }

    // Direction of layout
    if (direction === 'vertical') {
      alignmentStyle.flexDirection = 'column';
    } else {
      alignmentStyle.flexDirection = 'row';
    }

    return alignmentStyle;
  };

  return (
    <View
      style={[
        styles.container,
        getAlignmentStyle(),
        buttonsContainerStyle,
        { display: showAspect ? 'flex' : 'none' },
      ]}
    >
      {buttons.map((button, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.buttonContainer,
            {
              backgroundColor: pressed
                ? button.backgroundColor?.pressed ||
                  button.backgroundColor?.default ||
                  'rgba(255, 255, 255, 0.25)'
                : button.backgroundColor?.default ||
                  button.backgroundColor?.pressed ||
                  'rgba(255, 255, 255, 0.25)',
              display: button.show ? 'flex' : 'none',
            },
            direction === 'vertical' && styles.verticalButton,
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
                  size={20}
                  color={button.activeColor || 'transparent'}
                />
              ) : null
            ) : button.iconComponent ? (
              button.iconComponent
            ) : button.icon ? (
              <FontAwesome5
                name={button.icon}
                size={20}
                color={button.inActiveColor || 'transparent'}
              />
            ) : null
          ) : (
            button.customComponent
          )}
          {button.name && (
            <Text
              style={[
                styles.buttonText,
                { color: button.color || 'transparent' },
              ]}
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginVertical: 5,
    zIndex: 9,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default ControlButtonsComponentTouch;
