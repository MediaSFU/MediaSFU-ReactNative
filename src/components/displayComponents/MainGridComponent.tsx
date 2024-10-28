// MainGridComponent.tsx

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MeetingProgressTimer from './MeetingProgressTimer';

/**
 * Interface defining the props for the MainGridComponent.
 */
export interface MainGridComponentOptions {
  /**
   * The child components to be rendered inside the main grid.
   */
  children: React.ReactNode;

  /**
   * The background color of the main grid container.
   */
  backgroundColor: string;

  /**
   * The height of the main grid container.
   */
  height: number;

  /**
   * The width of the main grid container.
   */
  width: number;

  /**
   * Flag to determine if the aspect ratio should be shown.
   * @default true
   */
  showAspect?: boolean;

  /**
   * The background color of the meeting progress timer.
   */
  timeBackgroundColor?: string;

  /**
   * Flag to determine if the meeting progress timer should be shown.
   * @default true
   */
  showTimer?: boolean;

  /**
   * The time to display on the meeting progress timer.
   */
  meetingProgressTime: string;
}

export type MainGridComponentType = (options: MainGridComponentOptions) => JSX.Element;

/**
 * MainGridComponent is a React Native functional component that renders a main grid container
 * with optional children components and a meeting progress timer.
 *
 * @param {MainGridComponentOptions} props - The properties for the MainGridComponent.
 * @returns {JSX.Element} The rendered main grid container with optional children and timer.
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
}) => (
  <View
    style={[
      styles.maingridContainer,
      {
        backgroundColor,
        height,
        width,
        display: showAspect ? 'flex' : 'none',
      },
    ]}
  >
    {showTimer && (
    <MeetingProgressTimer
      meetingProgressTime={meetingProgressTime}
      initialBackgroundColor={timeBackgroundColor}
      showTimer={showTimer}
    />
    )}
    {children}
  </View>
);

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
