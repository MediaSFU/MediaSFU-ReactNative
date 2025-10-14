// MainGridComponent.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import MeetingProgressTimer from './MeetingProgressTimer';

/**
 * Interface defining the props for the MainGridComponent.
 */
/**
 * Options for rendering `MainGridComponent`.
 *
 * @interface MainGridComponentOptions
 *
 * **Content:**
 * @property {React.ReactNode} children Elements rendered inside the primary grid.
 *
 * **Appearance:**
 * @property {string} backgroundColor Background color of the root grid container.
 * @property {number} height Pixel height of the grid.
 * @property {number} width Pixel width of the grid.
 * @property {boolean} [showAspect=true] Controls visibility of the grid shell.
 * @property {StyleProp<ViewStyle>} [style] Additional styling for the container.
 *
 * **Timer:**
 * @property {boolean} [showTimer=true] Toggles display of the meeting progress timer.
 * @property {string} meetingProgressTime Stringified duration shown on the timer.
 * @property {string} [timeBackgroundColor] Optional background color passed to the timer.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the internal content layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the outer grid wrapper.
 */
export interface MainGridComponentOptions {
  children: React.ReactNode;
  backgroundColor: string;
  height: number;
  width: number;
  showAspect?: boolean;
  timeBackgroundColor?: string;
  showTimer?: boolean;
  meetingProgressTime: string;
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

export type MainGridComponentType = (options: MainGridComponentOptions) => JSX.Element;

/**
 * MainGridComponent renders the primary on-stage grid and optionally overlays the meeting progress timer. Consumers can swap the
 * inner or outer layout through render overrides.
 *
 * ### Key Features
 * - Houses the main video/audio grid for active participants
 * - Optionally displays meeting progress timer overlay
 * - Supports custom timer background color
 * - Toggle visibility with `showAspect`
 * - Exposes render overrides for content and container
 *
 * ### Layout
 * - Fixed dimensions provided via `width` and `height` props
 * - Timer positioned absolutely in top-right corner
 * - Children fill the container with flex layout
 *
 * ### Accessibility
 * - Timer includes accessible time display
 * - Grid container provides structural grouping
 *
 * @example
 * ```tsx
 * // Basic main grid with timer
 * <MainGridComponent
 *   backgroundColor="#000"
 *   height={600}
 *   width={800}
 *   meetingProgressTime="00:15:30"
 *   showTimer
 * >
 *   <FlexibleGrid
 *     rows={2}
 *     columns={2}
 *     customWidth={400}
 *     customHeight={300}
 *     componentsToRender={videoTiles}
 *   />
 * </MainGridComponent>
 * ```
 *
 * @example
 * ```tsx
 * // Hidden timer with custom background
 * <MainGridComponent
 *   backgroundColor="#1a1a1a"
 *   height={720}
 *   width={1280}
 *   meetingProgressTime="01:23:45"
 *   showTimer={false}
 *   timeBackgroundColor="rgba(0,0,0,0.7)"
 *   style={{ borderRadius: 8 }}
 * >
 *   <PresenterView participant={presenter} />
 * </MainGridComponent>
 * ```
 *
 * @example
 * ```tsx
 * // With custom content layout
 * <MainGridComponent
 *   backgroundColor="transparent"
 *   height={500}
 *   width={900}
 *   meetingProgressTime="00:45:12"
 *   renderContent={({ defaultContent, dimensions }) => (
 *     <View style={{ position: 'relative' }}>
 *       {defaultContent}
 *       <WatermarkOverlay width={dimensions.width} height={dimensions.height} />
 *     </View>
 *   )}
 * >
 *   <ParticipantGrid />
 * </MainGridComponent>
 * ```
 */
const MainGridComponent: React.FC<MainGridComponentOptions> = ({
  children,
  backgroundColor,
  height,
  width,
  showAspect = true,
  timeBackgroundColor = 'transparent',
  showTimer = true,
  meetingProgressTime,
  style,
  renderContent,
  renderContainer,
}) => {
  const dimensions = { width, height };

  const defaultContent = (
    <>
      {showTimer && (
        <MeetingProgressTimer
          meetingProgressTime={meetingProgressTime}
          initialBackgroundColor={timeBackgroundColor}
          showTimer={showTimer}
        />
      )}
      {children}
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.maingridContainer,
        {
          backgroundColor,
          height,
          width,
          display: showAspect ? 'flex' : 'none',
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

export default MainGridComponent;

/**
 * Stylesheet for the MainGridComponent.
 */
const styles = StyleSheet.create({
  maingridContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 4,
  },
});
