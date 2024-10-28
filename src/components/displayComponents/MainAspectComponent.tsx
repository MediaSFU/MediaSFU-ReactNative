// MainAspectComponent.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScaledSize,
} from 'react-native';

/**
 * Interface defining the props for the MainAspectComponent.
 */
export interface MainAspectComponentOptions {
  /**
   * The background color of the component.
   * @default 'transparent'
   */
  backgroundColor?: string;

  /**
   * The child elements to be rendered inside the component.
   */
  children: React.ReactNode;

  /**
   * Flag to determine if controls are shown, affecting the height calculation.
   * @default true
   */
  showControls?: boolean;

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
   * Default fraction to adjust the height when controls are shown.
   * @default 0.94
   */
  defaultFraction?: number;

  /**
   * Callback function to update the wide screen state.
   */
  updateIsWideScreen: (isWide: boolean) => void;

  /**
   * Callback function to update the medium screen state.
   */
  updateIsMediumScreen: (isMedium: boolean) => void;

  /**
   * Callback function to update the small screen state.
   */
  updateIsSmallScreen: (isSmall: boolean) => void;
}

export type MainAspectComponentType = (
  options: MainAspectComponentOptions
) => JSX.Element;

/**
 * MainAspectComponent is a React Native functional component that adjusts its dimensions
 * based on the window size and specified fractions. It also updates screen size
 * states (wide, medium, small) based on the container's width.
 *
 * @param {MainAspectComponentOptions} props - The properties for the MainAspectComponent.
 * @returns {JSX.Element} The rendered component with adjusted dimensions and background color.
 */
const MainAspectComponent: React.FC<MainAspectComponentOptions> = ({
  backgroundColor = 'transparent',
  children,
  showControls = true,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  defaultFraction = 0.94,
  updateIsWideScreen,
  updateIsMediumScreen,
  updateIsSmallScreen,
}) => {
  const [aspectStyles, setAspectStyles] = useState<{
    height: number;
    width: number;
  }>({
    height: showControls
      ? Math.floor(containerHeightFraction * Dimensions.get('window').height * defaultFraction)
      : Math.floor(containerHeightFraction * Dimensions.get('window').height),
    width: Math.floor(containerWidthFraction * Dimensions.get('window').width),
  });

  useEffect(() => {
    const updateAspectStyles = ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
      const windowHeight = window.height;
      const windowWidth = window.width;

      const parentWidth = Math.floor(containerWidthFraction * windowWidth);
      const parentHeight = showControls
        ? Math.floor(containerHeightFraction * windowHeight * defaultFraction)
        : Math.floor(containerHeightFraction * windowHeight);

      let isWideScreen = parentWidth >= 768;
      const isMediumScreen = parentWidth >= 576 && parentWidth < 768;
      const isSmallScreen = parentWidth < 576;

      if (!isWideScreen && parentWidth > 1.5 * parentHeight) {
        isWideScreen = true;
      }

      updateIsWideScreen(isWideScreen);
      updateIsMediumScreen(isMediumScreen);
      updateIsSmallScreen(isSmallScreen);

      setAspectStyles({
        height: showControls
          ? Math.floor(containerHeightFraction * windowHeight * defaultFraction)
          : Math.floor(containerHeightFraction * windowHeight),
        width: Math.floor(containerWidthFraction * windowWidth),
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
      if (subscription?.remove) {
        subscription.remove();
      } else {
        // For older React Native versions
        subscription.remove();
      }
    };
  }, [
    showControls,
    containerHeightFraction,
    containerWidthFraction,
    defaultFraction,
    updateIsWideScreen,
    updateIsMediumScreen,
    updateIsSmallScreen,
  ]);

  return (
    <View
      style={[
        styles.aspectContainer,
        {
          backgroundColor,
          height: aspectStyles.height,
          width: aspectStyles.width,
        },
      ]}
    >
      {children}
    </View>
  );
};

export default MainAspectComponent;

/**
 * Stylesheet for the MainAspectComponent.
 */
const styles = StyleSheet.create({
  aspectContainer: {
    flex: 1,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  },
});
