// MainContainerComponent.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScaledSize,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { calculateEmbeddedLayout } from '../../utils/embeddedLayout';

/**
 * Interface defining the props for the MainContainerComponent.
 */
/**
 * Options for rendering `MainContainerComponent`.
 *
 * @interface MainContainerComponentOptions
 *
 * **Content:**
 * @property {React.ReactNode} children Elements rendered inside the container.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='transparent'] Background color applied to the wrapper.
 * @property {number} [marginLeft=0]
 * @property {number} [marginRight=0]
 * @property {number} [marginTop=0]
 * @property {number} [marginBottom=0]
 * @property {number} [padding=0]
 * @property {StyleProp<ViewStyle>} [style] Additional styles for the outer container.
 *
 * **Sizing:**
 * @property {number} [containerWidthFraction=1] Fraction of the window width to occupy.
 * @property {number} [containerHeightFraction=1] Fraction of the window height to occupy.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the container's internal content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the outer container markup.
 */
export interface MainContainerComponentOptions {
  backgroundColor?: string;
  children: React.ReactNode;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  /** Measured host boundary. When supplied, viewport Dimensions are ignored. */
  containerDimensions?: { width: number; height: number };
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  padding?: number;
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

export type MainContainerComponentType = (
  options: MainContainerComponentOptions
) => JSX.Element;

/**
 * MainContainerComponent provides a responsive wrapper that scales with the viewport. It recalculates dimensions on window resize
 * and exposes render overrides for custom layouts.
 *
 * ### Key Features
 * - Automatically adjusts dimensions based on viewport size
 * - Supports fractional width/height for flexible sizing
 * - Respects custom margins and padding
 * - Re-renders on window dimension changes
 * - Exposes render overrides for advanced layouts
 *
 * ### Accessibility
 * - Container provides structural grouping for contained elements
 * - Children maintain their own accessibility properties
 *
 * @example
 * ```tsx
 * // Full-screen main container
 * <MainContainerComponent backgroundColor="#1e1e1e">
 *   <MeetingGrid participants={participants} />
 *   <ControlBar />
 * </MainContainerComponent>
 * ```
 *
 * @example
 * ```tsx
 * // Half-width container with custom margins
 * <MainContainerComponent
 *   containerWidthFraction={0.5}
 *   containerHeightFraction={0.8}
 *   backgroundColor="#fff"
 *   marginTop={20}
 *   marginLeft={10}
 *   padding={15}
 *   style={{ borderRadius: 8 }}
 * >
 *   <ChatPanel />
 * </MainContainerComponent>
 * ```
 *
 * @example
 * ```tsx
 * // With custom render override
 * <MainContainerComponent
 *   backgroundColor="transparent"
 *   renderContainer={({ defaultContainer, dimensions }) => (
 *     <BlurView intensity={50} style={{ width: dimensions.width, height: dimensions.height }}>
 *       {defaultContainer}
 *     </BlurView>
 *   )}
 * >
 *   <GlassPanel />
 * </MainContainerComponent>
 * ```
 */
const MainContainerComponent: React.FC<MainContainerComponentOptions> = ({
  backgroundColor = 'transparent',
  children,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  containerDimensions,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  padding = 0,
  style,
  renderContent,
  renderContainer,
}) => {
  // State to store calculated aspect styles
  const initialBoundary = containerDimensions ?? Dimensions.get('window');
  const initialDimensions = calculateEmbeddedLayout({
    boundary: initialBoundary,
    widthFraction: containerWidthFraction,
    heightFraction: containerHeightFraction,
  });
  const [aspectStyles, setAspectStyles] = useState<{
    height: number;
    width: number;
    maxHeight: number;
    maxWidth: number;
  }>({
    height: initialDimensions.height,
    width: initialDimensions.width,
    maxHeight: initialDimensions.height,
    maxWidth: initialDimensions.width,
  });

  useEffect(() => {
    const updateAspectStyles = ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
      const windowHeight = window.height;
      const windowWidth = window.width;

      const dimensions = calculateEmbeddedLayout({
        boundary: { width: windowWidth, height: windowHeight },
        widthFraction: containerWidthFraction,
        heightFraction: containerHeightFraction,
      });
      setAspectStyles({ ...dimensions, maxHeight: dimensions.height, maxWidth: dimensions.width });
    };

    // Initial setup
    const { width, height } = containerDimensions ?? Dimensions.get('window');
    updateAspectStyles({
      window: {
        width, height, scale: 1, fontScale: 1,
      },
      screen: {
        width, height, scale: 1, fontScale: 1,
      },
    });

    // Subscribe to dimension changes
    const subscription = containerDimensions
      ? undefined
      : Dimensions.addEventListener('change', updateAspectStyles);

    return () => {
      // Cleanup listener on component unmount
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [
    containerHeightFraction,
    containerWidthFraction,
    containerDimensions,
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
