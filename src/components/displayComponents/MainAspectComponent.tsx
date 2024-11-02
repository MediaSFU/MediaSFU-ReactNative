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
 * MainAspectComponent dynamically adjusts its dimensions based on window size and user-defined fractions, 
 * updating screen size states (wide, medium, small) based on container width.
 *
 * This component supports responsive layouts by adjusting its height and width based on fractions of the window size.
 * It also provides callbacks to update screen size states and toggles dimensions based on control visibility.
 *
 * @component
 * @param {MainAspectComponentOptions} props - Properties for configuring the MainAspectComponent.
 * @param {string} [props.backgroundColor='transparent'] - Background color of the component.
 * @param {React.ReactNode} props.children - Elements to render inside the component.
 * @param {boolean} [props.showControls=true] - Toggles height adjustment when controls are visible.
 * @param {number} [props.containerWidthFraction=1] - Fraction of the window width for container width.
 * @param {number} [props.containerHeightFraction=1] - Fraction of the window height for container height.
 * @param {number} [props.defaultFraction=0.94] - Default height adjustment fraction when controls are shown.
 * @param {Function} props.updateIsWideScreen - Callback to set wide screen state.
 * @param {Function} props.updateIsMediumScreen - Callback to set medium screen state.
 * @param {Function} props.updateIsSmallScreen - Callback to set small screen state.
 *
 * @returns {JSX.Element} The MainAspectComponent with responsive dimensions and background.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainAspectComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <MainAspectComponent
 *       backgroundColor="lightgray"
 *       containerWidthFraction={0.8}
 *       containerHeightFraction={0.8}
 *       showControls={true}
 *       updateIsWideScreen={(isWide) => console.log("Wide screen:", isWide)}
 *       updateIsMediumScreen={(isMedium) => console.log("Medium screen:", isMedium)}
 *       updateIsSmallScreen={(isSmall) => console.log("Small screen:", isSmall)}
 *     >
 *       <Text>Responsive Component</Text>
 *     </MainAspectComponent>
 *   );
 * }
 *
 * export default App;
 * ```
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
