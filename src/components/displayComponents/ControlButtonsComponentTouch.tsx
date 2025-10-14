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

/**
 * Button descriptor used by touch control components.
 *
 * @interface ButtonTouch
 * @property {string} [name] Optional caption rendered under the icon.
 * @property {string} [icon] Default FontAwesome5 icon name.
 * @property {string} [alternateIcon] Alternate icon to display when `active` is true.
 * @property {() => void} [onPress] Handler invoked when the button is tapped.
 * @property {{ default?: string; pressed?: string }} [backgroundColor] Background colors for idle and pressed states.
 * @property {boolean} [active] Indicates whether the alternate icon/color should display.
 * @property {JSX.Element} [alternateIconComponent] Custom component rendered when active.
 * @property {JSX.Element} [iconComponent] Custom component rendered when inactive.
 * @property {JSX.Element} [customComponent] Full override replacing icon + label.
 * @property {string} [color] Label color when the button is inactive.
 * @property {string} [activeColor] Icon color applied when active.
 * @property {string} [inActiveColor] Icon color applied when inactive.
 * @property {boolean} [show=true] Toggle to hide the button entirely when false.
 * @property {boolean} [disabled=false] Disable press interactions.
 */
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

/**
 * Options for rendering `ControlButtonsComponentTouch`.
 *
 * @interface ControlButtonsComponentTouchOptions
 *
 * **Buttons & Behaviour:**
 * @property {ButtonTouch[]} buttons Ordered collection of touch buttons to display.
 * @property {boolean} [showAspect=false] Toggles visibility of the entire control group.
 *
 * **Layout & Positioning:**
 * @property {'left' | 'right' | 'middle'} [position='left'] Horizontal alignment anchor relative to the screen.
 * @property {'top' | 'bottom' | 'center'} [location='top'] Vertical alignment anchor.
 * @property {'horizontal' | 'vertical'} [direction='horizontal'] Axis to lay out the buttons.
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [buttonsContainerStyle] Additional styling for the internal buttons wrapper.
 * @property {StyleProp<ViewStyle>} [style] Extra styles for the outer container.
 * @property {JSX.Element} [alternateIconComponent] Shared alternate icon used when buttons are active.
 * @property {JSX.Element} [iconComponent] Shared default icon used when buttons are inactive.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override the default button rendering while receiving the computed dimensions.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the entire container wrapper while keeping dimension awareness.
 */
export interface ControlButtonsComponentTouchOptions {
  buttons: ButtonTouch[];
  position?: 'left' | 'right' | 'middle';
  location?: 'top' | 'bottom' | 'center';
  direction?: 'horizontal' | 'vertical';
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  showAspect?: boolean;

  /**
   * Optional custom style to apply to the container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional function to render custom content, receiving the default content and dimensions.
   */
  renderContent?: (options: {
    defaultContent: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;

  /**
   * Optional function to render a custom container, receiving the default container and dimensions.
   */
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
}

export type ControlButtonsComponentTouchType = (
  options: ControlButtonsComponentTouchOptions
) => JSX.Element;

/**
 * ControlButtonsComponentTouch renders an absolute-positioned toolbar designed for touch-first interfaces.
 *
 * ### Key Features
 * - Aligns button rows/columns to any screen edge via `position` and `location` anchors.
 * - Supports icon overrides, alternate active states, and fully custom button components.
 * - Exposes render overrides for container/content replacement while preserving positioning data.
 *
 * ### Accessibility
 * - Buttons rely on `Pressable`, enabling default accessibility roles and pressed feedback.
 * - Callers can inject accessible labels within `customComponent` when more context is required.
 *
 * @component
 * @param {ControlButtonsComponentTouchOptions} props Touch control configuration.
 * @returns {JSX.Element} Rendered control button group for touch devices.
 *
 * @example
 * ```tsx
 * <ControlButtonsComponentTouch
 *   buttons={[
 *     { icon: 'microphone', alternateIcon: 'microphone-slash', active: isMuted, onPress: toggleMute, show: true },
 *     { icon: 'video', alternateIcon: 'video-slash', active: isVideoOff, onPress: toggleVideo }
 *   ]}
 *   position="right"
 *   location="bottom"
 *   direction="horizontal"
 *   showAspect
 * />
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
  style,
  renderContent,
  renderContainer,
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

  const dimensions = { width: 0, height: 0 };

  const defaultContent = (
    <>
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
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.container,
        getAlignmentStyle(),
        buttonsContainerStyle,
        { display: showAspect ? 'flex' : 'none' },
        style,
      ]}
    >
      {content}
    </View>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
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
