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
export interface MainScreenComponentOptions {
  /**
   * The child components to be rendered inside the main screen.
   */
  children: React.ReactNode;

  /**
   * The percentage size of the main component when stacking is enabled.
   */
  mainSize: number;

  /**
   * Flag indicating whether the components should be stacked.
   */
  doStack: boolean;

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
   * Callback function to update the sizes of the components.
   */
  updateComponentSizes: (sizes: ComponentSizes) => void;

  /**
   * Default fraction to adjust the height when controls are shown.
   * @default 0.94
   */
  defaultFraction?: number;

  /**
   * Flag indicating whether controls are shown, affecting the container height.
   */
  showControls: boolean;

  /**
   * An object containing the current sizes of the components.
   */
  componentSizes: ComponentSizes;
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
 * MainScreenComponent dynamically adjusts the layout and dimensions of its child components based on window size,
 * stacking mode, and specified width/height fractions, supporting flexible and responsive screen layouts.
 *
 * This component determines the appropriate dimensions for main and secondary components based on stacking mode, screen width,
 * and main component size, and can conditionally arrange child components in a column or row based on screen width.
 *
 * @component
 * @param {MainScreenComponentOptions} props - Configuration options for MainScreenComponent.
 * @param {React.ReactNode} props.children - Child components to render inside the screen container.
 * @param {number} props.mainSize - Percentage size of the main component when stacking.
 * @param {boolean} props.doStack - Flag indicating if components should be stacked vertically or horizontally.
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width for container width.
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height for container height.
 * @param {Function} props.updateComponentSizes - Callback to update sizes of main and secondary components.
 * @param {number} [props.defaultFraction=0.94] - Adjustment fraction for height when controls are visible.
 * @param {boolean} props.showControls - Flag indicating if controls are shown, affecting height calculation.
 * @param {ComponentSizes} props.componentSizes - Current sizes of the components (main and secondary).
 *
 * @returns {JSX.Element} The MainScreenComponent with dynamically calculated dimensions and layout.
 *
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { MainScreenComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const [componentSizes, setComponentSizes] = useState<ComponentSizes>({
 *     mainHeight: 0,
 *     otherHeight: 0,
 *     mainWidth: 0,
 *     otherWidth: 0,
 *   });
 *
 *   return (
 *     <MainScreenComponent
 *       mainSize={70}
 *       doStack={true}
 *       containerWidthFraction={1}
 *       containerHeightFraction={1}
 *       updateComponentSizes={setComponentSizes}
 *       showControls={true}
 *       componentSizes={componentSizes}
 *     >
 *       <MainContent />
 *       <SecondaryContent />
 *     </MainScreenComponent>
 *   );
 * }
 *
 * export default App;
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

  return (
    <View
      style={[
        styles.screenContainer,
        {
          flexDirection: isWideScreen ? 'row' : 'column',
          width: parentWidth,
          height: parentHeight,
        },
      ]}
    >
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
    </View>
  );
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
