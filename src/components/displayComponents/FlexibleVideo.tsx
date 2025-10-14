// FlexibleVideo.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MediaStream } from '../../@types/types';

/**
 * Options for rendering `FlexibleVideo`.
 *
 * @interface FlexibleVideoOptions
 *
 * **Metrics:**
 * @property {number} customWidth Width for each tile.
 * @property {number} customHeight Height for each tile.
 * @property {number} rows Row count for the grid.
 * @property {number} columns Column count for the grid.
 *
 * **Content:**
 * @property {React.ReactNode[]} componentsToRender Elements rendered within the grid cells.
 * @property {React.ReactNode} [Screenboard] Optional overlay element drawn above the grid.
 *
 * **Appearance:**
 * @property {boolean} [showAspect=false] Forces a square container wrapper when `true`.
 * @property {string} [backgroundColor='transparent'] Background color for each cell.
 * @property {StyleProp<ViewStyle>} [style] Additional styles for the outer grid container.
 *
 * **Annotation:**
 * @property {boolean} [annotateScreenStream=false] Enables local screen annotation layout adjustments.
 * @property {MediaStream} [localStreamScreen] Local screen stream used for measurements while annotating.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the inner grid markup or overlay composition.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the entire outer container.
 */
export interface FlexibleVideoOptions {
  customWidth: number;
  customHeight: number;
  rows: number;
  columns: number;
  componentsToRender: React.ReactNode[];
  showAspect?: boolean;
  backgroundColor?: string;
  Screenboard?: React.ReactNode;
  annotateScreenStream?: boolean;
  localStreamScreen?: MediaStream;
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

export type FlexibleVideoType = (options: FlexibleVideoOptions) => JSX.Element;

/**
 * FlexibleVideo renders a matrix of media tiles with optional screenboard overlays and local annotation sizing. It
 * mirrors the flexible layout used during screen-share sessions and supports override hooks for both content and
 * container customization.
 *
 * ### Key Features
 * - Grid layout for video tiles with explicit dimensions
 * - Optional Screenboard overlay for annotations or controls
 * - Annotation mode adjusts layout for local screen stream measurements
 * - Square aspect ratio wrapper available via `showAspect`
 * - Re-renders when column count changes
 *
 * ### Accessibility
 * - Maintains logical grid navigation order
 * - Overlay elements should include appropriate ARIA labels
 *
 * @example
 * ```tsx
 * // Basic video grid with screen share
 * <FlexibleVideo
 *   customWidth={320}
 *   customHeight={180}
 *   rows={2}
 *   columns={2}
 *   componentsToRender={[
 *     <VideoCard key="1" participant={participant1} />,
 *     <VideoCard key="2" participant={participant2} />,
 *     <VideoCard key="3" participant={participant3} />,
 *     <VideoCard key="4" participant={participant4} />,
 *   ]}
 *   Screenboard={<ScreenAnnotationOverlay />}
 *   backgroundColor="#000"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Annotation mode with local screen stream
 * <FlexibleVideo
 *   customWidth={640}
 *   customHeight={360}
 *   rows={1}
 *   columns={1}
 *   componentsToRender={[<ScreenShareView stream={screenStream} />]}
 *   annotateScreenStream
 *   localStreamScreen={localScreenStream}
 *   Screenboard={<DrawingToolbar />}
 *   renderContent={({ defaultContent, dimensions }) => (
 *     <View style={{ position: 'relative' }}>
 *       {defaultContent}
 *       <AnnotationCanvas width={dimensions.width} height={dimensions.height} />
 *     </View>
 *   )}
 * />
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
  style,
  renderContent,
  renderContainer,
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

  const dimensions = {
    width: cardWidth * columns,
    height: cardHeight * rows,
  };

  const defaultContent = (
    <>
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
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
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
