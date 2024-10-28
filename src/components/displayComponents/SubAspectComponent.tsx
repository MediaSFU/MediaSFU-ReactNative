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
export interface SubAspectComponentOptions {
  /**
   * The background color of the component.
   */
  backgroundColor: string;

  /**
   * The child elements to be rendered inside the component.
   */
  children: React.ReactNode;

  /**
   * Flag to show or hide the controls.
   * @default true
   */
  showControls?: boolean;

  /**
   * The fraction of the window width to be used for the component's width.
   */
  containerWidthFraction?: number;

  /**
   * The fraction of the window height to be used for the component's height.
   */
  containerHeightFraction?: number;

  /**
   * The default sub-aspect fraction to be used if controls are shown.
   * @default 0.0
   */
  defaultFractionSub?: number;
}

export type SubAspectComponentType = (options: SubAspectComponentOptions) => JSX.Element;

/**
 * SubAspectComponent is a React Native functional component that renders a sub-aspect
 * of a media display with optional controls. The component adjusts its width
 * and height based on the window size and provided fractions.
 *
 * @param {SubAspectComponentOptions} props - The properties for the SubAspectComponent.
 * @returns {JSX.Element} The rendered sub-aspect component.
 *
 * @example
 * <SubAspectComponent
 *   backgroundColor="#ffffff"
 *   showControls={true}
 *   containerWidthFraction={0.8}
 *   containerHeightFraction={0.1}
 *   defaultFractionSub={0.5}
 * >
 *   <ChildComponent />
 * </SubAspectComponent>
 */
const SubAspectComponent: React.FC<SubAspectComponentOptions> = ({
  backgroundColor,
  children,
  showControls = true,
  containerWidthFraction = 1.0, // Default to full width if not provided
  containerHeightFraction = 1.0, // Default to full height if not provided
  defaultFractionSub = 0.0,
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

  return (
    <View
      style={[
        styles.subAspectContainer,
        { backgroundColor },
        aspectStyles,
      ]}
    >
      {children}
    </View>
  );
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
