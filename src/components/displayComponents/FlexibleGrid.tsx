// FlexibleGrid.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Interface defining the props for the FlexibleGrid component.
 */
export interface FlexibleGridOptions {
  /**
   * Custom width for each grid item.
   */
  customWidth: number;

  /**
   * Custom height for each grid item.
   */
  customHeight: number;

  /**
   * Number of rows in the grid.
   */
  rows: number;

  /**
   * Number of columns in the grid.
   */
  columns: number;

  /**
   * Array of React components or elements to render in the grid.
   */
  componentsToRender: React.ReactNode[];

  /**
   * Flag indicating whether to show the aspect ratio.
   */
  showAspect?: boolean;

  /**
   * Background color for each grid item.
   * @default 'transparent'
   */
  backgroundColor?: string;
}

export type FlexibleGridType = (options: FlexibleGridOptions) => JSX.Element;

/**
 * FlexibleGrid is a React Native component that renders a customizable grid layout.
 *
 * This component arranges an array of components or elements in a grid defined by specified rows and columns.
 * Each grid item can have custom dimensions and background color, with optional aspect ratio settings.
 *
 * @component
 * @param {FlexibleGridOptions} props - Properties for configuring the FlexibleGrid component.
 * @param {number} props.customWidth - Custom width for each grid item.
 * @param {number} props.customHeight - Custom height for each grid item.
 * @param {number} props.rows - Number of rows in the grid.
 * @param {number} props.columns - Number of columns in the grid.
 * @param {React.ReactNode[]} props.componentsToRender - Array of components or elements to render in the grid.
 * @param {boolean} [props.showAspect=false] - Flag to enable aspect ratio for the grid.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 *
 * @returns {JSX.Element} The rendered FlexibleGrid component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { FlexibleGrid } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const components = [
 *     <Text key={1}>Item 1</Text>,
 *     <Text key={2}>Item 2</Text>,
 *     <Text key={3}>Item 3</Text>
 *   ];
 *
 *   return (
 *     <FlexibleGrid
 *       customWidth={100}
 *       customHeight={100}
 *       rows={2}
 *       columns={2}
 *       componentsToRender={components}
 *       showAspect={true}
 *       backgroundColor="lightgray"
 *     />
 *   );
 * }
 *
 * export default App;
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

  return (
    <View key={key} style={[styles.gridContainer, showAspect && styles.aspectContainer]}>
      {renderGrid()}
    </View>
  );
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
