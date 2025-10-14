// OtherGridComponent.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import MeetingProgressTimer from './MeetingProgressTimer';

/**
 * Interface defining the props for the OtherGridComponent.
 */
/**
 * Options for rendering `OtherGridComponent`.
 *
 * @interface OtherGridComponentOptions
 *
 * **Content:**
 * @property {React.ReactNode} children Elements rendered inside the secondary grid.
 *
 * **Appearance:**
 * @property {string} backgroundColor Background color for the container.
 * @property {number | string} width Width of the grid.
 * @property {number | string} height Height of the grid.
 * @property {boolean} [showAspect=true] Controls whether the grid is visible.
 * @property {StyleProp<ViewStyle>} [style] Additional styles for the outer container.
 *
 * **Timer:**
 * @property {boolean} showTimer Controls visibility of the meeting progress timer.
 * @property {string} meetingProgressTime Time string displayed by the timer.
 * @property {string} [timeBackgroundColor] Background tint applied to the timer.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Customize the inner layout.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Replace the outer container implementation.
 */
export interface OtherGridComponentOptions {
  backgroundColor: string;
  children: React.ReactNode;
  width: number | string;
  height: number | string;
  showAspect?: boolean;
  timeBackgroundColor?: string;
  showTimer: boolean;
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

export type OtherGridComponentType = React.FC<OtherGridComponentOptions>;

/**
 * OtherGridComponent renders the secondary participant grid, optionally showing a meeting progress timer in the corner.
 * Override hooks allow complete control over the inner layout and outer wrapper.
 *
 * ### Key Features
 * - Displays secondary/auxiliary grid for off-stage participants
 * - Optional meeting progress timer overlay (top-right corner)
 * - Toggle visibility with `showAspect` prop
 * - Custom timer background color
 * - Render overrides for content and container
 *
 * ### Layout
 * - Flexible dimensions via `width` and `height`
 * - Timer positioned absolutely in top-right
 * - Children wrapped in flex container
 *
 * ### Accessibility
 * - Timer includes accessible time display
 * - Structural grouping for screen readers
 *
 * @example
 * ```tsx
 * // Basic secondary grid with timer
 * <OtherGridComponent
 *   backgroundColor="#333"
 *   height={200}
 *   width={400}
 *   meetingProgressTime="00:12:45"
 *   showTimer
 * >
 *   <FlexibleGrid
 *     rows={1}
 *     columns={3}
 *     customWidth={400}
 *     customHeight={200}
 *     componentsToRender={waitingParticipants}
 *   />
 * </OtherGridComponent>
 * ```
 *
 * @example
 * ```tsx
 * // Hidden aspect with custom timer color
 * <OtherGridComponent
 *   backgroundColor="#1a1a1a"
 *   height={150}
 *   width={600}
 *   meetingProgressTime="01:05:20"
 *   showTimer={false}
 *   showAspect={false}
 *   timeBackgroundColor="rgba(50,50,50,0.8)"
 * >
 *   <AudioOnlyGrid participants={audioParticipants} />
 * </OtherGridComponent>
 * ```
 *
 * @example
 * ```tsx
 * // With custom content overlay
 * <OtherGridComponent
 *   backgroundColor="transparent"
 *   height={250}
 *   width={500}
 *   meetingProgressTime="00:30:15"
 *   showTimer
 *   renderContent={({ defaultContent, dimensions }) => (
 *     <View>
 *       {defaultContent}
 *       <BreakoutRoomLabel roomName="Room 2" />
 *     </View>
 *   )}
 * >
 *   <BreakoutRoomGrid room={room2} />
 * </OtherGridComponent>
 * ```
 */
const OtherGridComponent: React.FC<OtherGridComponentOptions> = ({
  backgroundColor,
  children,
  width,
  height,
  showAspect = true,
  timeBackgroundColor = 'rgba(0,0,0,0.5)', // Default value if not provided
  showTimer,
  meetingProgressTime,
  style,
  renderContent,
  renderContainer,
}) => {
  const dimensions = {
    width: typeof width === 'number' ? width : 0,
    height: typeof height === 'number' ? height : 0,
  };

  const defaultContent = (
    <>
      <MeetingProgressTimer
        meetingProgressTime={meetingProgressTime}
        initialBackgroundColor={timeBackgroundColor}
        showTimer={showTimer}
        position="topRight"
      />
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const containerStyle: ViewStyle = {
    backgroundColor,
    width: width as DimensionValue,
    height: height as DimensionValue,
    display: showAspect ? 'flex' : 'none',
  };

  const defaultContainer = (
    <View style={[styles.otherGridContainer, containerStyle, style]}>
      {content}
    </View>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
};

export default OtherGridComponent;

/**
 * Stylesheet for the OtherGridComponent.
 */
const styles = StyleSheet.create({
  otherGridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ffffff', // Default background color
  },

  childrenContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    // Add additional styling if necessary
  },
});
