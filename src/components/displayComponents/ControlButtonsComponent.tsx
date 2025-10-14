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

/**
 * Button descriptor used by `ControlButtonsComponent`.
 *
 * @interface Button
 * @property {string} [name] Optional label displayed beneath the icon.
 * @property {string} [icon] Default FontAwesome5 icon name when inactive.
 * @property {string} [alternateIcon] Icon displayed when the button is `active`.
 * @property {() => void} [onPress] Handler invoked when the button is pressed.
 * @property {{ default?: string; pressed?: string }} [backgroundColor] Background colors for idle and pressed states.
 * @property {boolean} [active=false] Enables alternate icon or color states.
 * @property {JSX.Element} [alternateIconComponent] Custom component rendered when active.
 * @property {JSX.Element} [iconComponent] Custom component rendered when inactive.
 * @property {JSX.Element} [customComponent] Full override replacing icon and label.
 * @property {string} [color] Default text/icon color for the button.
 * @property {string} [activeColor] Icon color when the button is active.
 * @property {string} [inActiveColor] Icon color when the button is inactive.
 * @property {boolean} [disabled=false] Disables press interactions.
 * @property {boolean} [show=true] Toggle to hide the button entirely when false.
 */
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

/**
 * Options for rendering `ControlButtonsComponent`.
 *
 * @interface ControlButtonsComponentOptions
 *
 * **Buttons & Behaviour:**
 * @property {Button[]} buttons Collection of button descriptors rendered in order.
 * @property {boolean} [vertical=false] Arranges icon+label vertically within each button when true.
 *
 * **Appearance:**
 * @property {string} [buttonColor] Default color applied to button labels/icons when no per-button color is provided.
 * @property {{ default?: string; pressed?: string }} [buttonBackgroundColor] Shared background colors applied to buttons.
 * @property {StyleProp<ViewStyle>} [buttonsContainerStyle] Additional styles for the internal buttons wrapper.
 * @property {StyleProp<ViewStyle>} [style] Extra styles for the outer container.
 * @property {JSX.Element} [alternateIconComponent] Shared component rendered when buttons are active.
 * @property {JSX.Element} [iconComponent] Shared component rendered when buttons are inactive.
 *
 * **Layout:**
 * @property {'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'} [alignment='flex-start'] Distribution of buttons within the container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Wrap or replace the default button rendering while receiving basic layout dimensions.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override the top-level container element to integrate with custom shells.
 */
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

export type ControlButtonsComponentType = (
  options: ControlButtonsComponentOptions
) => JSX.Element;

/**
 * Renders a customizable toolbar of meeting controls (mute, camera, share, etc.) with
 * flexible layout, shared icon overrides, and render hooks for advanced integrations.
 *
 * ### Key Features
 * - Align buttons using common flex alignments while preserving horizontal layout.
 * - Provide per-button or shared icon overrides, including React elements for animated states.
 * - Wrap the default content or container via `renderContent` and `renderContainer` hooks.
 *
 * ### Accessibility
 * - Each `Pressable` exposes an accessibility label derived from the button `name` or icon name.
 * - Disabled buttons lower opacity but remain rendered to avoid focus jumps.
 *
 * @example
 * ```tsx
 * <ControlButtonsComponent
 *   buttons={[
 *     { name: 'Mute', icon: 'microphone', alternateIcon: 'microphone-slash', active: isMuted, onPress: toggleMute },
 *     { name: 'Video', icon: 'video', onPress: toggleVideo },
 *   ]}
 *   buttonColor="#f1f5f9"
 *   alignment="space-between"
 *   renderContent={({ defaultContent }) => <View testID="controls-wrapper">{defaultContent}</View>}
 * />
 * ```
 */
const ControlButtonsComponent: React.FC<ControlButtonsComponentOptions> = ({
  buttons,
  buttonColor,
  buttonBackgroundColor,
  alignment = 'flex-start',
  vertical = false,
  buttonsContainerStyle,
  alternateIconComponent,
  iconComponent,
  style,
  renderContent,
  renderContainer,
}) => {
  const getAlignmentStyle = (): ViewStyle => {
    switch (alignment) {
      case 'center':
        return { justifyContent: 'center' };
      case 'flex-end':
        return { justifyContent: 'flex-end' };
      case 'space-between':
        return { justifyContent: 'space-between' };
      case 'space-around':
        return { justifyContent: 'space-around' };
      case 'space-evenly':
        return { justifyContent: 'space-evenly' };
      case 'flex-start':
      default:
        return { justifyContent: 'flex-start' };
    }
  };

  const dimensions = { width: buttons.length, height: vertical ? buttons.length : 1 };

  const defaultContent = (
    <>
      {buttons.map((button, index) => {
        if (button.show === false) {
          return null;
        }

        const resolvedBackgroundDefault =
          button.backgroundColor?.default ?? buttonBackgroundColor?.default ??
          'transparent';
        const resolvedBackgroundPressed =
          button.backgroundColor?.pressed ??
          buttonBackgroundColor?.pressed ??
          resolvedBackgroundDefault;
        const resolvedLabelColor = button.color ?? buttonColor ?? '#ffffff';
        const resolvedActiveColor = button.activeColor ?? resolvedLabelColor;
        const resolvedInActiveColor =
          button.inActiveColor ?? resolvedLabelColor;
        const inactiveIconComponent = button.iconComponent ?? iconComponent;
        const activeIconComponent =
          button.alternateIconComponent ?? alternateIconComponent;

        return (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.buttonContainer,
              {
                backgroundColor: pressed
                  ? resolvedBackgroundPressed
                  : resolvedBackgroundDefault,
                opacity: button.disabled ? 0.5 : 1,
              },
              vertical && styles.verticalButton,
            ]}
            onPress={button.onPress}
            disabled={button.disabled}
            accessibilityRole="button"
            accessibilityLabel={button.name ?? button.icon ?? 'control button'}
          >
            {button.customComponent ? (
              button.customComponent
            ) : button.active ? (
              activeIconComponent ? (
                activeIconComponent
              ) : button.alternateIcon ? (
                <FontAwesome5
                  name={button.alternateIcon}
                  size={24}
                  color={resolvedActiveColor}
                />
              ) : inactiveIconComponent ? (
                inactiveIconComponent
              ) : button.icon ? (
                <FontAwesome5
                  name={button.icon}
                  size={24}
                  color={resolvedActiveColor}
                />
              ) : null
            ) : inactiveIconComponent ? (
              inactiveIconComponent
            ) : button.icon ? (
              <FontAwesome5
                name={button.icon}
                size={24}
                color={resolvedInActiveColor}
              />
            ) : activeIconComponent ? (
              activeIconComponent
            ) : null}
            {button.name && (
              <Text
                style={[styles.buttonText, { color: resolvedLabelColor }]}
                numberOfLines={1}
              >
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
        vertical && styles.verticalContainer,
        buttonsContainerStyle,
        { display: 'flex' },
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
    flexDirection: 'row',
    marginVertical: 10,
  },
  verticalContainer: {
    flexDirection: 'column',
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
