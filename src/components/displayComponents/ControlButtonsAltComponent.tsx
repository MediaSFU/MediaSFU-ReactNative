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
 * ControlButtonsAltComponent renders a set of customizable control buttons with adjustable layout, styling, and alignment options.
 *
 * This component displays a collection of control buttons that can be horizontally or vertically aligned, with additional options
 * to define icon behavior, active states, and color schemes. Each button can have an icon, alternate icon, or custom component.
 *
 * @component
 * @param {ControlButtonsAltComponentOptions} props - Configuration options for the control buttons.
 * @param {AltButton[]} props.buttons - Array of button options, each with properties for icon, label, and behavior.
 * @param {'left' | 'right' | 'middle'} [props.position='left'] - Horizontal alignment of the button group.
 * @param {'top' | 'bottom' | 'center'} [props.location='top'] - Vertical alignment of the button group.
 * @param {'horizontal' | 'vertical'} [props.direction='horizontal'] - Layout direction for the buttons.
 * @param {StyleProp<ViewStyle>} [props.buttonsContainerStyle] - Custom styles for the container.
 * @param {boolean} [props.showAspect=false] - Controls the visibility of the button group.
 *
 * @returns {JSX.Element} The rendered ControlButtonsAltComponent.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { ControlButtonsAltComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const buttons = [
 *     { name: 'Play', icon: 'play', onPress: () => console.log('Play pressed'), active: true },
 *     { name: 'Stop', icon: 'stop', onPress: () => console.log('Stop pressed') }
 *   ];
 *
 *   return (
 *     <ControlButtonsAltComponent
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
