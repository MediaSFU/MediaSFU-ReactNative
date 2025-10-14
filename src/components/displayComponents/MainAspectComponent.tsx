// MainAspectComponent.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScaledSize,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * Interface defining the props for the MainAspectComponent.
 */
/**
 * Options for rendering `MainAspectComponent`.
 *
 * @interface MainAspectComponentOptions
 *
 * **Content:**
 * @property {React.ReactNode} children Elements rendered inside the aspect container.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='transparent'] Background color for the container.
 * @property {StyleProp<ViewStyle>} [style] Additional style overrides for the wrapper.
 *
 * **Sizing:**
 * @property {boolean} [showControls=true] Adjusts vertical sizing when control bars are visible.
 * @property {number} [containerWidthFraction=1] Fraction of window width used as the container width.
 * @property {number} [containerHeightFraction=1] Fraction of window height used as the container height.
 * @property {number} [defaultFraction=0.94] Multiplier applied to height when controls are visible.
 *
 * **Responsive Flags:**
 * @property {(isWide: boolean) => void} updateIsWideScreen Callback invoked when the layout represents a wide screen.
 * @property {(isMedium: boolean) => void} updateIsMediumScreen Callback invoked for medium screen threshold.
 * @property {(isSmall: boolean) => void} updateIsSmallScreen Callback invoked for small screen threshold.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the child layout within the container.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the outer container element.
 */
export interface MainAspectComponentOptions {
  backgroundColor?: string;
  children: React.ReactNode;
  showControls?: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  defaultFraction?: number;
  updateIsWideScreen: (isWide: boolean) => void;
  updateIsMediumScreen: (isMedium: boolean) => void;
  updateIsSmallScreen: (isSmall: boolean) => void;
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

export type MainAspectComponentType = (
  options: MainAspectComponentOptions
) => JSX.Element;

/**
 * MainAspectComponent tracks responsive breakpoints and adjusts container dimensions relative to the viewport, providing callbacks
 * for wide/medium/small determinations. Override hooks let consumers reshape either the children or the wrapper entirely.
 *
 * ### Key Features
 * - Dynamically tracks viewport size and fires breakpoint callbacks
 * - Adjusts container height based on control visibility
 * - Supports fractional sizing for flexible layouts
 * - Re-renders on window dimension changes
 * - Provides screen size callbacks (wide/medium/small)
 *
 * ### Breakpoint Thresholds
 * - Wide screen: ≥ 768px width
 * - Medium screen: 576px–767px width
 * - Small screen: < 576px width
 *
 * ### Accessibility
 * - Container provides structural grouping
 * - Children maintain their accessibility properties
 *
 * @example
 * ```tsx
 * // Basic responsive main area
 * <MainAspectComponent
 *   backgroundColor="#000"
 *   showControls
 *   updateIsWideScreen={(isWide) => setIsWideScreen(isWide)}
 *   updateIsMediumScreen={(isMedium) => setIsMediumScreen(isMedium)}
 *   updateIsSmallScreen={(isSmall) => setIsSmallScreen(isSmall)}
 * >
 *   <VideoGridContainer />
 * </MainAspectComponent>
 * ```
 *
 * @example
 * ```tsx
 * // Custom fractions with hidden controls
 * <MainAspectComponent
 *   backgroundColor="#1a1a1a"
 *   showControls={false}
 *   containerWidthFraction={0.9}
 *   containerHeightFraction={0.85}
 *   defaultFraction={0.95}
 *   updateIsWideScreen={handleWideScreen}
 *   updateIsMediumScreen={handleMediumScreen}
 *   updateIsSmallScreen={handleSmallScreen}
 *   style={{ borderRadius: 12, overflow: 'hidden' }}
 * >
 *   <StageView participants={stageParticipants} />
 * </MainAspectComponent>
 * ```
 *
 * @example
 * ```tsx
 * // With animated container
 * <MainAspectComponent
 *   backgroundColor="transparent"
 *   updateIsWideScreen={setWideScreen}
 *   updateIsMediumScreen={setMediumScreen}
 *   updateIsSmallScreen={setSmallScreen}
 *   renderContainer={({ defaultContainer, dimensions }) => (
 *     <Animated.View
 *       style={{
 *         transform: [{ scale: scaleAnim }],
 *         opacity: opacityAnim,
 *       }}
 *     >
 *       {defaultContainer}
 *     </Animated.View>
 *   )}
 * >
 *   <PresentationView />
 * </MainAspectComponent>
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
  style,
  renderContent,
  renderContainer,
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

  const dimensions = {
    width: aspectStyles.width,
    height: aspectStyles.height,
  };

  const defaultContent = <>{children}</>;
  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.aspectContainer,
        {
          backgroundColor,
          height: aspectStyles.height,
          width: aspectStyles.width,
        },
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
