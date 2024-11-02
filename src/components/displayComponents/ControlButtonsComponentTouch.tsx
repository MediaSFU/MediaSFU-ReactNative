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
 * ControlButtonsComponentTouch renders a set of interactive control buttons with customizable layout, alignment, and display options.
 *
 * This component allows for horizontal or vertical arrangement of buttons, each with optional icons, custom components, and
 * configurable background colors and active states.
 *
 * @component
 * @param {ControlButtonsComponentTouchOptions} props - Options for the ControlButtonsComponentTouch component.
 * @param {ButtonTouch[]} props.buttons - Array of button configurations, including icon, background color, and onPress functionality.
 * @param {'left' | 'right' | 'middle'} [props.position='left'] - Horizontal alignment of the button container.
 * @param {'top' | 'bottom' | 'center'} [props.location='top'] - Vertical alignment of the button container.
 * @param {'horizontal' | 'vertical'} [props.direction='horizontal'] - Arrangement direction of buttons in the container.
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Additional custom styles for the button container.
 * @param {boolean} [props.showAspect=false] - Controls the visibility of the button container.
 *
 * @returns {JSX.Element} The rendered ControlButtonsComponentTouch component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsComponentTouch } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const buttons = [
 *     { name: 'Start', icon: 'play', onPress: () => console.log('Start'), active: true },
 *     { name: 'Stop', icon: 'stop', onPress: () => console.log('Stop') },
 *   ];
 *
 *   return (
 *     <ControlButtonsComponentTouch
 *       buttons={buttons}
 *       position="middle"
 *       location="bottom"
 *       direction="horizontal"
 *       showAspect={true}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
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
