// SubAspectComponent.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
  ScaledSize,
} from 'react-native';

/**
 * Interface defining the props for the SubAspectComponent.
 */
/**
 * Options for rendering `SubAspectComponent`.
 *
 * @interface SubAspectComponentOptions
 *
 * **Content:**
 * @property {React.ReactNode} children Elements displayed inside the sub-container.
 *
 * **Appearance:**
 * @property {string} backgroundColor Background color of the sub-aspect wrapper.
 * @property {StyleProp<ViewStyle>} [style] Additional style overrides for the container.
 *
 * **Sizing:**
 * @property {boolean} [showControls=true] Determines whether the container is visible and sized.
 * @property {number} [containerWidthFraction=1] Fraction of window width applied to the container width.
 * @property {number} [containerHeightFraction=1] Fraction of window height applied to the container height.
 * @property {number} [defaultFractionSub=0] Height fraction used when controls are visible.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the child layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the outer container implementation.
 */
export interface SubAspectComponentOptions {
  backgroundColor: string;
  children: React.ReactNode;
  showControls?: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  defaultFractionSub?: number;
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

export type SubAspectComponentType = (options: SubAspectComponentOptions) => JSX.Element;

/**
 * SubAspectComponent renders the auxiliary strip used for stage controls, resizing with the viewport and honoring the
 * `showControls` flag. Consumers can override either the content or the container via render hooks.
 *
 * ### Key Features
 * - Dynamically sizes based on viewport and control visibility
 * - Respects fractional width/height for flexible layouts
 * - Adjusts height fraction when controls are shown/hidden
 * - Re-renders on window dimension changes
 * - Supports render overrides for custom layouts
 *
 * ### Accessibility
 * - Provides structural grouping for control elements
 * - Children should include appropriate accessibility labels
 *
 * @example
 * ```tsx
 * // Basic control strip at bottom
 * <SubAspectComponent
 *   backgroundColor="#2d2d2d"
 *   showControls
 *   defaultFractionSub={0.1}
 * >
 *   <ControlButtonsComponent buttons={controlButtons} />
 * </SubAspectComponent>
 * ```
 *
 * @example
 * ```tsx
 * // Hidden controls with custom fractions
 * <SubAspectComponent
 *   backgroundColor="transparent"
 *   showControls={false}
 *   containerWidthFraction={0.9}
 *   containerHeightFraction={0.15}
 *   defaultFractionSub={0.12}
 *   style={{ borderTopWidth: 1, borderTopColor: '#444' }}
 * >
 *   <ParticipantBar participants={participants} />
 * </SubAspectComponent>
 * ```
 *
 * @example
 * ```tsx
 * // With animated container
 * <SubAspectComponent
 *   backgroundColor="#000"
 *   showControls={controlsVisible}
 *   renderContainer={({ defaultContainer, dimensions }) => (
 *     <Animated.View style={{ height: slideAnim, overflow: 'hidden' }}>
 *       {defaultContainer}
 *     </Animated.View>
 *   )}
 * >
 *   <MeetingControls />
 * </SubAspectComponent>
 * ```
 */
const SubAspectComponent: React.FC<SubAspectComponentOptions> = ({
  backgroundColor,
  children,
  showControls = true,
  containerWidthFraction = 1.0, // Default to full width if not provided
  containerHeightFraction = 1.0, // Default to full height if not provided
  defaultFractionSub = 0.0,
  style,
  renderContent,
  renderContainer,
}) => {
  // Calculate sub-aspect fraction based on showControls
  const subAspectFraction = showControls ? defaultFractionSub : 0.0;

  // State to store calculated aspect styles
  const [aspectStyles, setAspectStyles] = useState<StyleProp<ViewStyle>>({
    height: showControls
      ? containerHeightFraction * Dimensions.get('window').height * subAspectFraction
      : 0,
    width: containerWidthFraction
      ? containerWidthFraction * Dimensions.get('window').width
      : Dimensions.get('window').width,
    display: showControls ? 'flex' : 'none',
  });

  /**
   * Updates the aspect styles based on current window dimensions and props.
   *
   * @param {ScaledSize} window - The new window dimensions.
   */
  const updateAspectStyles = (window: ScaledSize) => {
    setAspectStyles({
      height: showControls
        ? containerHeightFraction * window.height * subAspectFraction
        : 0,
      width: containerWidthFraction
        ? containerWidthFraction * window.width
        : window.width,
      display: showControls ? 'flex' : 'none',
    });
  };


  // Effect to handle dimension changes
  useEffect(() => {
    // Handler for dimension changes
    const handleChange = ({ window }: { window: ScaledSize }) => {
      updateAspectStyles(window);
    };

    // Initial setup
    const initialWindow = Dimensions.get('window');
    updateAspectStyles(initialWindow);

    // Add event listener for dimension changes
    const subscription = Dimensions.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else {
        // For React Native versions < 0.65
        subscription.remove();
      }
    };
    // Dependencies include all props that affect aspect styles
  }, [
    showControls,
    containerWidthFraction,
    containerHeightFraction,
    defaultFractionSub,
    subAspectFraction,
  ]);

  // Extract dimensions from aspectStyles
  const styleObj = aspectStyles as ViewStyle;
  const dimensions = {
    width: typeof styleObj.width === 'number' ? styleObj.width : 0,
    height: typeof styleObj.height === 'number' ? styleObj.height : 0,
  };

  const defaultContent = <>{children}</>;
  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.subAspectContainer,
        { backgroundColor },
        aspectStyles,
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

export default SubAspectComponent;

/**
 * Stylesheet for the SubAspectComponent.
 */
const styles = StyleSheet.create({
  subAspectContainer: {
    position: 'absolute',
    bottom: 0,
    margin: 0,
    backgroundColor: 'blue',
    overflow: 'hidden',
    flex: 1,
  },
});
