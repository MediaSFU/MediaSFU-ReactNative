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
 * OtherGridComponent is a React Native functional component that displays a grid with optional timer and children components.
 *
 * @param {OtherGridComponentOptions} props - The properties for the OtherGridComponent.
 * @returns {JSX.Element} The rendered grid component.
 *
 * @example
 * <OtherGridComponent
 *   backgroundColor="#ffffff"
 *   width={200}
 *   height={200}
 *   showAspect={true}
 *   timeBackgroundColor="rgba(0,0,0,0.5)"
 *   showTimer={true}
 *   meetingProgressTime="12:34"
 * >
 *   <ChildComponent />
 * </OtherGridComponent>
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
