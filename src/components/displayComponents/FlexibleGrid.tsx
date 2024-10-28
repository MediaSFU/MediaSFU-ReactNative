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
 * FlexibleGrid is a React Native component for rendering a flexible grid layout.
 *
 * @param {FlexibleGridOptions} props - The properties passed to the FlexibleGrid.
 * @returns {JSX.Element} The rendered grid layout.
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
