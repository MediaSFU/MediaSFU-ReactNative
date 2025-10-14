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

/**
 * Compact button descriptor for alternate (stage-adjacent) controls.
 *
 * @interface AltButton
 * @property {string} [name] Optional short label displayed near the icon.
 * @property {string} [icon] Default FontAwesome5 icon name when inactive.
 * @property {string} [alternateIcon] Icon displayed when the button is `active`.
 * @property {() => void} [onPress] Handler invoked when the button is pressed.
 * @property {{ default?: string; pressed?: string }} [backgroundColor] Background colors for idle and pressed states.
 * @property {boolean} [active=false] Toggles alternate icon display.
 * @property {JSX.Element} [alternateIconComponent] Custom component rendered when active.
 * @property {JSX.Element} [iconComponent] Custom component rendered when inactive.
 * @property {JSX.Element} [customComponent] Full override replacing icon and label.
 * @property {string} [color] Label color for the button text.
 * @property {string} [inActiveColor] Icon color used for both active and inactive states.
 * @property {boolean} [show=true] Toggle to hide the button entirely when false.
 */
export interface AltButton {
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
  inActiveColor?: string;
  show?: boolean;
}

/**
 * Options for rendering `ControlButtonsAltComponent`.
 *
 * @interface ControlButtonsAltComponentOptions
 *
 * **Buttons & Visibility:**
 * @property {AltButton[]} buttons Collection of compact control descriptors to display.
 * @property {boolean} [showAspect=false] Toggles visibility of the entire button group.
 *
 * **Layout & Positioning:**
 * @property {'left' | 'right' | 'middle'} [position='left'] Horizontal anchor within the container.
 * @property {'top' | 'bottom' | 'center'} [location='top'] Vertical anchor within the container.
 * @property {'horizontal' | 'vertical'} [direction='horizontal'] Axis along which buttons are arranged.
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [buttonsContainerStyle] Additional styles for the internal buttons wrapper.
 * @property {StyleProp<ViewStyle>} [style] Extra styles for the outer container.
 * @property {JSX.Element} [alternateIconComponent] Shared alternate icon used when buttons are active.
 * @property {JSX.Element} [iconComponent] Shared default icon used when buttons are inactive.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Wrap or replace the default button rendering while receiving layout dimensions.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override the top-level container element to integrate with external layout systems.
 */
export interface ControlButtonsAltComponentOptions {
  buttons: AltButton[];
  position?: 'left' | 'right' | 'middle';
  location?: 'top' | 'bottom' | 'center';
  direction?: 'horizontal' | 'vertical';
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  alternateIconComponent?: JSX.Element;
  iconComponent?: JSX.Element;
  showAspect?: boolean;
  style?: StyleProp<ViewStyle>;
  renderContent?: (options: {
    defaultContent: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;
}

export type ControlButtonsAltComponentType = (
  options: ControlButtonsAltComponentOptions
) => React.ReactNode;

/**
 * Renders compact control badges typically shown near the stage presenter or pinned video card.
 * Supports anchored positioning, shared icon overrides, and render hooks for integration with
 * custom shells or animated wrappers.
 *
 * ### Key Features
 * - Anchor buttons to any corner/edge of the stage via `position` and `location`.
 * - Arrange buttons horizontally or vertically with `direction`.
 * - Provide shared icon overrides for all buttons or per-button custom components.
 * - Toggle visibility globally with `showAspect` prop.
 *
 * ### Accessibility
 * - Each button uses `Pressable`, exposing default press feedback.
 * - Descriptive labels should be provided via `name` or injected within `customComponent`.
 *
 * @example
 * ```tsx
 * <ControlButtonsAltComponent
 *   buttons={[
 *     { icon: 'microphone', alternateIcon: 'microphone-slash', active: isMuted, onPress: toggleMute },
 *     { icon: 'expand', onPress: expandStage },
 *   ]}
 *   position="right"
 *   location="top"
 *   direction="horizontal"
 *   showAspect
 * />
 * ```
 */
const ControlButtonsAltComponent: React.FC<ControlButtonsAltComponentOptions> = ({
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

  const dimensions = { width: 0, height: 0 };

  const defaultContent = (
    <>
      {buttons.map((button, index) => {
        if (button.show === false) {
          return null;
        }

        const resolvedBackgroundDefault =
          button.backgroundColor?.default ?? 'transparent';
        const resolvedBackgroundPressed =
          button.backgroundColor?.pressed ?? button.backgroundColor?.default ?? '#444';
        const resolvedLabelColor = button.color ?? '#ffffff';
        const resolvedIconColor = button.inActiveColor ?? '#ffffff';
        const inactiveIcon = button.iconComponent;
        const activeIcon = button.alternateIconComponent;

        return (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.buttonContainer,
              {
                backgroundColor: pressed
                  ? resolvedBackgroundPressed
                  : resolvedBackgroundDefault,
              },
              direction === 'vertical' && styles.verticalButton,
            ]}
            onPress={button.onPress}
            accessibilityRole="button"
            accessibilityLabel={button.name ?? button.icon ?? 'alt control button'}
          >
            {button.customComponent ? (
              button.customComponent
            ) : button.active ? (
              activeIcon ? (
                activeIcon
              ) : button.alternateIcon ? (
                <FontAwesome5
                  name={button.alternateIcon}
                  size={14}
                  color={resolvedIconColor}
                />
              ) : inactiveIcon ? (
                inactiveIcon
              ) : button.icon ? (
                <FontAwesome5
                  name={button.icon}
                  size={14}
                  color={resolvedIconColor}
                />
              ) : null
            ) : inactiveIcon ? (
              inactiveIcon
            ) : button.icon ? (
              <FontAwesome5
                name={button.icon}
                size={14}
                color={resolvedIconColor}
              />
            ) : activeIcon ? (
              activeIcon
            ) : null}
            {button.name && (
              <Text style={[styles.buttonText, { color: resolvedLabelColor }]} numberOfLines={1}>
                {button.name}
              </Text>
            )}
          </Pressable>
        );
      })}
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
