// OtherGridComponent.tsx

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MeetingProgressTimer from './MeetingProgressTimer';

/**
 * Interface defining the props for the OtherGridComponent.
 */
export interface OtherGridComponentOptions {
  /**
   * The background color of the grid.
   */
  backgroundColor: string;

  /**
   * The child components to be rendered inside the grid.
   */
  children: React.ReactNode;

  /**
   * The width of the grid.
   */
  width: number | string;

  /**
   * The height of the grid.
   */
  height: number | string;

  /**
   * Flag to determine if the grid should be displayed.
   * @default true
   */
  showAspect?: boolean;

  /**
   * The background color of the meeting progress timer.
   */
  timeBackgroundColor?: string;

  /**
   * Flag to determine if the meeting progress timer should be displayed.
   */
  showTimer: boolean;

  /**
   * The time to display on the meeting progress timer.
   */
  meetingProgressTime: string;
}

export type OtherGridComponentType = React.FC<OtherGridComponentOptions>;

/**
 * OtherGridComponent displays a container grid with optional child components and a meeting progress timer.
 *
 * This component allows customization of dimensions, background color, and an optional timer display. It is useful
 * for displaying grouped content within a bordered grid layout.
 *
 * @component
 * @param {OtherGridComponentOptions} props - Configuration options for the OtherGridComponent.
 * @param {string} props.backgroundColor - Background color of the grid.
 * @param {React.ReactNode} props.children - Components to be rendered within the grid.
 * @param {number | string} props.width - Width of the grid.
 * @param {number | string} props.height - Height of the grid.
 * @param {boolean} [props.showAspect=true] - Flag to toggle the grid's display.
 * @param {string} [props.timeBackgroundColor='rgba(0,0,0,0.5)'] - Background color of the meeting progress timer.
 * @param {boolean} props.showTimer - Flag to display the meeting progress timer.
 * @param {string} props.meetingProgressTime - Time to show in the meeting progress timer.
 *
 * @returns {JSX.Element} The rendered OtherGridComponent.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { OtherGridComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <OtherGridComponent
 *       backgroundColor="#f9f9f9"
 *       width={250}
 *       height={250}
 *       showAspect={true}
 *       timeBackgroundColor="rgba(0, 0, 0, 0.6)"
 *       showTimer={true}
 *       meetingProgressTime="10:45"
 *     >
 *       <Text>Child Component</Text>
 *     </OtherGridComponent>
 *   );
 * }
 *
 * export default App;
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
}) => (
  <View style={[styles.otherGridContainer, {
    backgroundColor, width: width as number, height: height as number, display: showAspect ? 'flex' : 'none',
  }]}
  >
    {/* Render the meeting progress timer */}
    <MeetingProgressTimer
      meetingProgressTime={meetingProgressTime}
      initialBackgroundColor={timeBackgroundColor}
      showTimer={showTimer}
      position="topRight"
    />
    {/* Render the children */}
    <View style={styles.childrenContainer}>
      {children}
    </View>
  </View>
);

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
