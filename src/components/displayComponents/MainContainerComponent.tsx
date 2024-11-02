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
 * MainContainerComponent renders a container with customizable dimensions, margins, and padding.
 * The container's width and height adjust based on window size and specified fractions.
 *
 * This component is responsive to window size changes, recalculating its dimensions dynamically
 * and supporting customization of margins, padding, and background color.
 *
 * @component
 * @param {MainContainerComponentOptions} props - Configuration options for MainContainerComponent.
 * @param {string} [props.backgroundColor='transparent'] - Background color of the container.
 * @param {React.ReactNode} props.children - Elements to render inside the container.
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width for container width.
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height for container height.
 * @param {number} [props.marginLeft=0] - Left margin of the container.
 * @param {number} [props.marginRight=0] - Right margin of the container.
 * @param {number} [props.marginTop=0] - Top margin of the container.
 * @param {number} [props.marginBottom=0] - Bottom margin of the container.
 * @param {number} [props.padding=0] - Padding inside the container.
 *
 * @returns {JSX.Element} The MainContainerComponent with responsive dimensions and customizable styling.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainContainerComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <MainContainerComponent
 *       backgroundColor="lightblue"
 *       containerWidthFraction={0.9}
 *       containerHeightFraction={0.8}
 *       marginLeft={10}
 *       marginRight={10}
 *       marginTop={20}
 *       marginBottom={20}
 *       padding={15}
 *     >
 *       <Text>Main Content</Text>
 *     </MainContainerComponent>
 *   );
 * }
 *
 * export default App;
 * ```
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
