// FlexibleVideo.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MediaStream } from '../../@types/types';

/**
 * Interface defining the props for the FlexibleVideo component.
 */
export interface FlexibleVideoOptions {
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
  showAspect: boolean;

  /**
   * Background color for each grid item.
   * @default 'transparent'
   */
  backgroundColor?: string;

  /**
   * Screenboard component to overlay on the video grid.
   */
  Screenboard?: React.ReactNode;

  /**
   * Flag to annotate the screen stream.
   * @default false
   */
  annotateScreenStream?: boolean;

  /**
   * The local screen stream to use for annotation.
   */
  localStreamScreen?: MediaStream;
}

export type FlexibleVideoType = (options: FlexibleVideoOptions) => JSX.Element

/**
 * FlexibleVideo is a React Native component that renders a flexible video grid with optional screenboard overlay
 * and annotation capabilities.
 *
 * This component arranges components in a grid layout with specified rows and columns. It supports custom item
 * dimensions, optional screenboard overlay, and video stream annotation.
 *
 * @component
 * @param {FlexibleVideoOptions} props - Options to configure the FlexibleVideo component.
 * @param {number} props.customWidth - Width of each grid item.
 * @param {number} props.customHeight - Height of each grid item.
 * @param {number} props.rows - Number of rows in the grid.
 * @param {number} props.columns - Number of columns in the grid.
 * @param {React.ReactNode[]} props.componentsToRender - Components or elements to display in the grid.
 * @param {boolean} [props.showAspect=false] - Controls whether the aspect ratio is enforced.
 * @param {string} [props.backgroundColor='transparent'] - Background color for each grid item.
 * @param {React.ReactNode} [props.Screenboard] - Overlay component for the video grid.
 * @param {boolean} [props.annotateScreenStream=false] - Enables screen stream annotation.
 * @param {MediaStream} [props.localStreamScreen] - Media stream for local screen annotation.
 *
 * @returns {JSX.Element} The rendered FlexibleVideo component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { FlexibleVideo } from 'mediasfu-reactnative';
 *
 * function App() {
 *   const videoComponents = [
 *     <RTCView streamURL="stream1" />,
 *     <RTCView streamURL="stream2" />,
 *   ];
 *
 *   return (
 *     <FlexibleVideo
 *       customWidth={200}
 *       customHeight={150}
 *       rows={2}
 *       columns={2}
 *       componentsToRender={videoComponents}
 *       showAspect={true}
 *       backgroundColor="black"
 *       Screenboard={<Text>Overlay Component</Text>}
 *       annotateScreenStream={true}
 *       localStreamScreen={myLocalStream}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const FlexibleVideo: React.FC<FlexibleVideoOptions> = ({
  customWidth,
  customHeight,
  rows,
  columns,
  componentsToRender,
  showAspect = false,
  backgroundColor = 'transparent',
  Screenboard,
  annotateScreenStream = false,
  localStreamScreen,
}) => {
  const [key, setKey] = useState<number>(0);
  const [cardWidth, setCardWidth] = useState<number>(customWidth);
  const [cardHeight, setCardHeight] = useState<number>(customHeight);
  const [, setCardTop] = useState<number>(0);
  const [cardLeft, setCardLeft] = useState<number>(0);
  const [canvasLeft, setCanvasLeft] = useState<number>(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [columns]);

  useEffect(() => {
    if (annotateScreenStream && localStreamScreen) {
      const videoTrack = localStreamScreen.getVideoTracks()[0];
      const videoSettings: MediaTrackSettings = videoTrack.getSettings();
      const videoHeight = videoSettings.height || customHeight;
      const videoWidth = videoSettings.width || customWidth;

      setCardWidth(videoWidth);
      setCardHeight(videoHeight);
      setCardTop(Math.floor((customHeight - videoHeight) / 2));
      setCardLeft(Math.floor((customWidth - videoWidth) / 2));
      setCanvasLeft(cardLeft < 0 ? cardLeft : 0);
    } else {
      setCardWidth(customWidth);
      setCardHeight(customHeight);
      setCardTop(0);
      setCardLeft(0);
      setCanvasLeft(0);
    }
  }, [
    customWidth,
    customHeight,
    localStreamScreen,
    annotateScreenStream,
    cardLeft,
  ]);

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
                width: cardWidth,
                height: cardHeight,
                backgroundColor,
                margin: 1,
                padding: 0,
                borderRadius: 0,
                left: cardLeft,
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
    <View
      key={key}
      style={[
        styles.gridContainer,
        {
          padding: 0,
          flex: 1,
          margin: 0,
          position: 'relative',
          display: showAspect ? 'flex' : 'none',
          maxWidth: customWidth,
          overflow: 'hidden',
          left: cardLeft > 0 ? cardLeft : 0,
        },
      ]}
    >
      {renderGrid()}
      {Screenboard && (
        <View
          style={[
            styles.screenboardOverlay,
            {
              top: 0,
              left: canvasLeft,
              width: cardWidth,
              height: cardHeight,
              backgroundColor: 'rgba(0, 0, 0, 0.005)',
              zIndex: 2,
            },
          ]}
        >
          {Screenboard}
        </View>
      )}
    </View>
  );
};

export default FlexibleVideo;

/**
 * Stylesheet for the FlexibleVideo component.
 */
const styles = StyleSheet.create({
  gridContainer: {
    // Additional container styles can be added here if needed
  },
  rowContainer: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    margin: 1,
    padding: 0,
    borderRadius: 0,
  },
  screenboardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    // width and height are set dynamically via inline styles
    backgroundColor: 'rgba(0, 0, 0, 0.005)',
    zIndex: 2,
    // Additional overlay styles can be added here
  },
});
