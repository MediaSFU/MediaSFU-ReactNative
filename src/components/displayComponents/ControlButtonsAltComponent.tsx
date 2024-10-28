import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export interface AltButton {
  name?: string;
  icon?: string; // FontAwesome5 icon name
  alternateIcon?: string; // FontAwesome5 alternate icon name
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
  inActiveColor?: string;
  show?: boolean;
}

export interface ControlButtonsAltComponentOptions {
  buttons: AltButton[];
  position?: 'left' | 'right' | 'middle';
  location?: 'top' | 'bottom' | 'center';
  direction?: 'horizontal' | 'vertical';
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  showAspect?: boolean;
}

export type ControlButtonsAltComponentType = (
  options: ControlButtonsAltComponentOptions
) => React.ReactNode;

/**
 * ControlButtonsAltComponent is a React functional component that renders a set of control buttons
 * with customizable alignment, direction, and styles.
 *
 * @param {ControlButtonsAltComponentOptions} props - The properties object.
 * @param {Array<AltButton>} props.buttons - An array of button options to be rendered.
 * @param {string} [props.position='left'] - The horizontal alignment of the buttons ('left', 'right', 'middle').
 * @param {string} [props.location='top'] - The vertical alignment of the buttons ('top', 'bottom', 'center').
 * @param {string} [props.direction='horizontal'] - The direction of the button layout ('horizontal', 'vertical').
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Additional styles for the buttons container.
 * @param {boolean} [props.showAspect=false] - Whether to display the buttons container.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ControlButtonsAltComponent: React.FC<ControlButtonsAltComponentOptions> = ({
  buttons,
  position = 'left',
  location = 'top',
  direction = 'horizontal',
  buttonsContainerStyle,
  showAspect = false,
}) => {
  /**
   * getAlignmentStyle - Computes alignment styles based on position, location, and direction.
   * @returns {StyleProp<ViewStyle>} - The computed alignment styles.
   */
  const getAlignmentStyle = (): StyleProp<ViewStyle> => {
    const alignmentStyle: ViewStyle = {};

    // Horizontal alignment
    if (position === 'left' || position === 'right' || position === 'middle') {
      alignmentStyle.justifyContent = position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';
    }

    // Vertical alignment
    if (location === 'top' || location === 'bottom' || location === 'center') {
      alignmentStyle.alignItems = location === 'top' ? 'flex-start' : location === 'bottom' ? 'flex-end' : 'center';
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
                ? button.backgroundColor?.pressed || '#444'
                : button.backgroundColor?.default || 'transparent',
            },
            direction === 'vertical' && styles.verticalButton,
          ]}
          onPress={button.onPress}
        >
          {button.icon ? (
            button.active ? (
              button.alternateIconComponent ? (
                button.alternateIconComponent
              ) : button.alternateIcon ? (
                <FontAwesome5
                  name={button.alternateIcon}
                  size={14}
                  color={button.inActiveColor || '#ffffff'}
                />
              ) : null
            ) : button.iconComponent ? (
              button.iconComponent
            ) : button.icon ? (
              <FontAwesome5
                name={button.icon}
                size={14}
                color={button.inActiveColor || '#ffffff'}
              />
            ) : null
          ) : (
            button.customComponent
          )}
          {button.name && (
            <Text style={[styles.buttonText, { color: button.color || '#ffffff' }]}>
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
    marginVertical: 5,
    elevation: 9,
    zIndex: 9,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  verticalButton: {
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  } as TextStyle,
});

export default ControlButtonsAltComponent;
