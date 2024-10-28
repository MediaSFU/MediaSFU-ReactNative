// MainContainerComponent.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScaledSize,
} from 'react-native';

/**
 * Interface defining the props for the MainContainerComponent.
 */
export interface MainContainerComponentOptions {
  /**
   * The background color of the container.
   * @default 'transparent'
   */
  backgroundColor?: string;

  /**
   * The child elements to be rendered inside the container.
   */
  children: React.ReactNode;

  /**
   * Fraction of the window width to be used for the container's width.
   * @default 1
   */
  containerWidthFraction?: number;

  /**
   * Fraction of the window height to be used for the container's height.
   * @default 1
   */
  containerHeightFraction?: number;

  /**
   * Left margin of the container.
   * @default 0
   */
  marginLeft?: number;

  /**
   * Right margin of the container.
   * @default 0
   */
  marginRight?: number;

  /**
   * Top margin of the container.
   * @default 0
   */
  marginTop?: number;

  /**
   * Bottom margin of the container.
   * @default 0
   */
  marginBottom?: number;

  /**
   * Padding inside the container.
   * @default 0
   */
  padding?: number;
}

export type MainContainerComponentType = (
  options: MainContainerComponentOptions
) => JSX.Element;

/**
 * MainContainerComponent is a React Native functional component that renders a container
 * with customizable dimensions and margins. The dimensions of the container are
 * calculated based on the window size and the provided fractions for width and height.
 * The component also updates its dimensions dynamically when the window size changes.
 *
 * @param {MainContainerComponentOptions} props - The properties for the MainContainerComponent.
 * @returns {JSX.Element} The rendered container component.
 */
const MainContainerComponent: React.FC<MainContainerComponentOptions> = ({
  backgroundColor = 'transparent',
  children,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  padding = 0,
}) => {
  // State to store calculated aspect styles
  const [aspectStyles, setAspectStyles] = useState<{
    height: number;
    width: number;
    maxHeight: number;
    maxWidth: number;
  }>({
    height: Math.floor(containerHeightFraction * Dimensions.get('window').height),
    width: Math.floor(containerWidthFraction * Dimensions.get('window').width),
    maxHeight: Math.floor(containerHeightFraction * Dimensions.get('window').height),
    maxWidth: Math.floor(containerWidthFraction * Dimensions.get('window').width),
  });

  useEffect(() => {
    const updateAspectStyles = ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
      const windowHeight = window.height;
      const windowWidth = window.width;

      setAspectStyles({
        height: Math.floor(containerHeightFraction * windowHeight),
        width: Math.floor(containerWidthFraction * windowWidth),
        maxHeight: Math.floor(containerHeightFraction * windowHeight),
        maxWidth: Math.floor(containerWidthFraction * windowWidth),
      });
    };

    // Initial setup
    const { width, height } = Dimensions.get('window');
    updateAspectStyles({
      window: {
        width, height, scale: 1, fontScale: 1,
      },
      screen: {
        width, height, scale: 1, fontScale: 1,
      },
    });

    // Subscribe to dimension changes
    const subscription = Dimensions.addEventListener('change', updateAspectStyles);

    return () => {
      // Cleanup listener on component unmount
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      } else {
        // For older React Native versions
        subscription.remove();
      }
    };
  }, [
    containerHeightFraction,
    containerWidthFraction,
  ]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          marginLeft,
          marginRight,
          marginTop,
          marginBottom,
          padding,
          height: aspectStyles.height,
          width: aspectStyles.width,
          maxHeight: aspectStyles.maxHeight,
          maxWidth: aspectStyles.maxWidth,
        },
      ]}
    >
      {children}
    </View>
  );
};

export default MainContainerComponent;

/**
 * Stylesheet for the MainContainerComponent.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
});
