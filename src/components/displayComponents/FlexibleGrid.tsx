// FlexibleGrid.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

/**
 * Options for rendering `FlexibleGrid`.
 *
 * @interface FlexibleGridOptions
 *
 * **Metrics:**
 * @property {number} customWidth Width applied to each cell.
 * @property {number} customHeight Height applied to each cell.
 * @property {number} rows Total rows to render.
 * @property {number} columns Total columns to render.
 *
 * **Content:**
 * @property {React.ReactNode[]} componentsToRender React children aligned to the grid order.
 *
 * **Appearance:**
 * @property {boolean} [showAspect=false] Toggles a square aspect ratio wrapper.
 * @property {string} [backgroundColor='transparent'] Cell background color.
 * @property {StyleProp<ViewStyle>} [style] Additional styles for the outer container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the inner grid markup.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the entire wrapping container.
 */
export interface FlexibleGridOptions {
  customWidth: number;
  customHeight: number;
  rows: number;
  columns: number;
  componentsToRender: React.ReactNode[];
  showAspect?: boolean;
  backgroundColor?: string;
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

export type FlexibleGridType = (options: FlexibleGridOptions) => JSX.Element;

/**
 * FlexibleGrid arranges arbitrary children into a fixed row/column matrix. It is primarily used for media tiles
 * that need explicit sizing while still allowing consumers to override either the content or the wrapper container.
 *
 * ### Key Features
 * - Automatically arranges children into rows and columns with fixed cell dimensions
 * - Supports optional square aspect ratio wrapper
 * - Re-renders when column count changes
 * - Exposes render overrides for custom layouts
 *
 * ### Accessibility
 * - Grid structure provides logical navigation order for screen readers
 * - Each cell can receive its own accessibility properties via children
 *
 * @example
 * ```tsx
 * // Basic grid with video tiles
 * <FlexibleGrid
 *   customWidth={200}
 *   customHeight={150}
 *   rows={2}
 *   columns={3}
 *   componentsToRender={[
 *     <VideoTile key="1" participantId="user1" />,
 *     <VideoTile key="2" participantId="user2" />,
 *     <VideoTile key="3" participantId="user3" />,
 *     <VideoTile key="4" participantId="user4" />,
 *     <VideoTile key="5" participantId="user5" />,
 *     <VideoTile key="6" participantId="user6" />,
 *   ]}
 *   backgroundColor="#1a1a1a"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Square aspect grid with custom container
 * <FlexibleGrid
 *   customWidth={100}
 *   customHeight={100}
 *   rows={3}
 *   columns={3}
 *   componentsToRender={audienceCards}
 *   showAspect
 *   renderContainer={({ defaultContainer, dimensions }) => (
 *     <Animated.View style={{ opacity: fadeAnim }}>
 *       {defaultContainer}
 *     </Animated.View>
 *   )}
 * />
 * ```
 */
const FlexibleGrid: React.FC<FlexibleGridOptions> = ({
  customWidth,
  customHeight,
  rows,
  columns,
  componentsToRender,
  showAspect = false,
  backgroundColor = 'transparent',
  style,
  renderContent,
  renderContainer,
}) => {
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [columns]);

  /**
   * Renders the grid layout based on the number of rows and columns.
   *
   * @returns {React.ReactNode[]} Array of React elements representing the grid.
   */
  const renderGrid = (): React.ReactNode[] => {
    const grid: React.ReactNode[] = [];

    for (let row = 0; row < rows; row++) {
      const rowComponents: React.ReactNode[] = [];

      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const component = componentsToRender[index];

        rowComponents.push(
          <View
            key={col}
            style={[
              styles.gridItem,
              {
                width: customWidth,
                height: customHeight,
                backgroundColor,
              },
            ]}
          >
            {component}
          </View>,
        );
      }

      grid.push(
        <View key={row} style={styles.rowContainer}>
          {rowComponents}
        </View>,
      );
    }

    return grid;
  };

  const dimensions = {
    width: customWidth * columns,
    height: customHeight * rows,
  };

  const renderedGrid = renderGrid();
  const defaultContent = <>{renderedGrid}</>;
  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View key={key} style={[styles.gridContainer, showAspect && styles.aspectContainer, style]}>
      {content}
    </View>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
};

export default FlexibleGrid;

/**
 * Stylesheet for the FlexibleGrid component.
 */
const styles = StyleSheet.create({
  gridContainer: {
    padding: 0,
  },
  aspectContainer: {
    aspectRatio: 1,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    margin: 1,
    padding: 0,
    borderRadius: 8,
  },
});
