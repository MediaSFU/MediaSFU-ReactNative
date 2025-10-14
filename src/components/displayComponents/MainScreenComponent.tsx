// MainScreenComponent.tsx

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
  ScaledSize,
} from 'react-native';

/**
 * Interface defining the sizes of the main and other components.
 */
export interface ComponentSizes {
  mainHeight: number;
  otherHeight: number;
  mainWidth: number;
  otherWidth: number;
}

/**
 * Interface defining the props for the MainScreenComponent.
 */
/**
 * Options for rendering `MainScreenComponent`.
 *
 * @interface MainScreenComponentOptions
 *
 * **Content:**
 * @property {React.ReactNode} children Child layout rendered within the screen container.
 *
 * **Layout:**
 * @property {number} mainSize Percentage (0-100) assigned to the main component when stacking.
 * @property {boolean} doStack Whether to split the screen between main/other regions.
 * @property {ComponentSizes} componentSizes Cached dimensions for main and secondary regions.
 * @property {(sizes: ComponentSizes) => void} updateComponentSizes Callback invoked when dimensions are recalculated.
 *
 * **Sizing:**
 * @property {number} [containerWidthFraction=1] Fraction of window width consumed by the container.
 * @property {number} [containerHeightFraction=1] Fraction of window height consumed by the container.
 * @property {number} [defaultFraction=0.94] Height multiplier when controls are visible.
 * @property {boolean} showControls Whether control surfaces are visible, affecting height.
 *
 * **Appearance:**
 * @property {StyleProp<ViewStyle>} [style] Additional styles for the screen container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the rendered children with computed dimensions.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the entire container wrapper.
 */
export interface MainScreenComponentOptions {
  children: React.ReactNode;
  mainSize: number;
  doStack: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  updateComponentSizes: (sizes: ComponentSizes) => void;
  defaultFraction?: number;
  showControls: boolean;
  componentSizes: ComponentSizes;
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

/**
 * Interface defining the additional props for resizable child components.
 */
export interface ResizableChildOptions {
  /**
   * The percentage size of the main component.
   */
  mainSize: number;

  /**
   * Flag indicating if the screen is wide.
   */
  isWideScreen: boolean;

  /**
   * Optional additional styles for the child component.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Type guard to determine if a child component conforms to ResizableChildOptions.
 * @param child - The child to check.
 * @returns True if the child is a React element with ResizableChildOptions, false otherwise.
 */
const isResizableChild = (
  child: any,
): child is React.ReactElement<ResizableChildOptions> => (
  child
    && typeof child === 'object'
    && 'props' in child
    && typeof child.props === 'object'
);

export type MainScreenComponentType = (
  options: MainScreenComponentOptions
) => JSX.Element;

/**
 * MainScreenComponent calculates media tile dimensions for the main and secondary regions and applies them to children that
 * accept `mainSize` and `isWideScreen` props. Override hooks provide full control over content and container rendering.
 *
 * ### Key Features
 * - Dynamically calculates main/other region sizes based on `mainSize` percentage
 * - Automatically determines wide screen status (≥768px or aspect > 1.5:1)
 * - Passes dimension props to compatible children (mainSize, isWideScreen)
 * - Re-renders on window dimension changes
 * - Supports stacking or side-by-side layout modes
 *
 * ### Layout Modes
 * - **Stack mode** (`doStack=true`): Splits screen between main and secondary regions
 * - **Single mode** (`doStack=false`): Allocates full screen to main region
 *
 * ### Accessibility
 * - Container provides structural grouping for main regions
 * - Children should include appropriate accessibility labels
 *
 * @example
 * ```tsx
 * // Basic split screen layout
 * <MainScreenComponent
 *   mainSize={70}
 *   doStack
 *   showControls
 *   componentSizes={componentSizes}
 *   updateComponentSizes={setComponentSizes}
 * >
 *   <MainGridComponent mainSize={70} />
 *   <OtherGridComponent mainSize={70} />
 * </MainScreenComponent>
 * ```
 *
 * @example
 * ```tsx
 * // Full screen main view
 * <MainScreenComponent
 *   mainSize={100}
 *   doStack={false}
 *   showControls={false}
 *   containerWidthFraction={0.95}
 *   containerHeightFraction={0.9}
 *   defaultFraction={1}
 *   componentSizes={sizes}
 *   updateComponentSizes={handleSizeUpdate}
 *   style={{ backgroundColor: '#000' }}
 * >
 *   <PresentationView />
 * </MainScreenComponent>
 * ```
 *
 * @example
 * ```tsx
 * // With custom render override
 * <MainScreenComponent
 *   mainSize={60}
 *   doStack
 *   showControls
 *   componentSizes={sizes}
 *   updateComponentSizes={updateSizes}
 *   renderContainer={({ defaultContainer, dimensions }) => (
 *     <Animated.View
 *       style={{
 *         transform: [{ translateY: slideAnim }],
 *         width: dimensions.width,
 *         height: dimensions.height,
 *       }}
 *     >
 *       {defaultContainer}
 *     </Animated.View>
 *   )}
 * >
 *   <MainGrid />
 *   <AudienceGrid />
 * </MainScreenComponent>
 * ```
 */
const MainScreenComponent: React.FC<MainScreenComponentOptions> = ({
  children,
  mainSize,
  doStack,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  updateComponentSizes,
  defaultFraction = 0.94,
  showControls,
  componentSizes,
  style,
  renderContent,
  renderContainer,
}) => {
  const { width: windowWidth, height: windowHeight }: ScaledSize = Dimensions.get('window');

  // Calculate parent dimensions based on fractions and control visibility
  const parentWidth = containerWidthFraction * windowWidth;
  const parentHeight = showControls
    ? containerHeightFraction * windowHeight * defaultFraction
    : containerHeightFraction * windowHeight;

  // Determine if the screen is wide
  let isWideScreen = parentWidth >= 768;

  if (!isWideScreen && parentWidth > 1.5 * parentHeight) {
    isWideScreen = true;
  }

  /**
   * Computes the dimensions for the main and other components based on stacking mode and screen width.
   * @returns {ComponentSizes} The calculated sizes for the components.
   */
  const computeDimensions = (): ComponentSizes => {
    if (doStack) {
      if (isWideScreen) {
        return {
          mainHeight: parentHeight,
          otherHeight: parentHeight,
          mainWidth: Math.floor((mainSize / 100) * parentWidth),
          otherWidth: Math.floor(((100 - mainSize) / 100) * parentWidth),
        };
      }
      return {
        mainHeight: Math.floor((mainSize / 100) * parentHeight),
        otherHeight: Math.floor(((100 - mainSize) / 100) * parentHeight),
        mainWidth: parentWidth,
        otherWidth: parentWidth,
      };
    }
    return {
      mainHeight: parentHeight,
      otherHeight: parentHeight,
      mainWidth: parentWidth,
      otherWidth: parentWidth,
    };
  };

  useEffect(() => {
    const {
      mainHeight, otherHeight, mainWidth, otherWidth,
    } = computeDimensions();
    updateComponentSizes({
      mainHeight, otherHeight, mainWidth, otherWidth,
    });

  }, [parentWidth, parentHeight, mainSize, doStack, isWideScreen]);

  const dimensions = {
    width: parentWidth,
    height: parentHeight,
  };

  const defaultContent = (
    <>
      {/* Render child components with updated dimensions */}
      {React.Children.map(children, (child, index) => {
        if (isResizableChild(child)) {
          const childStyle = doStack
            ? {
              height: index === 0 ? componentSizes.mainHeight : componentSizes.otherHeight,
              width: index === 0 ? componentSizes.mainWidth : componentSizes.otherWidth,
            }
            : {
              height: componentSizes.mainHeight,
              width: componentSizes.mainWidth,
            };

          return React.cloneElement(child, {
            mainSize,
            isWideScreen,
            style: [child.props.style, childStyle],
            key: index,
          });
        }
        return null;
      })}
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.screenContainer,
        {
          flexDirection: isWideScreen ? 'row' : 'column',
          width: parentWidth,
          height: parentHeight,
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

export default MainScreenComponent;

/**
 * Stylesheet for the MainScreenComponent.
 */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
});
