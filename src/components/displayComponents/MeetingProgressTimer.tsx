import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

/**
 * Interface defining the props for the MeetingProgressTimer component.
 */
export interface MeetingProgressTimerOptions {
  /**
   * The current progress time of the meeting to be displayed.
   */
  meetingProgressTime: string;

  /**
   * The initial background color of the timer.
   * @default 'green'
   */
  initialBackgroundColor?: string;

  /**
   * The position of the timer on the screen.
   * @default 'topLeft'
   */
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

  /**
   * Additional styles to apply to the timer text.
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Flag to determine whether the timer should be displayed.
   * @default true
   */
  showTimer?: boolean;
}

/**
 * Type defining the possible positions for the timer.
 */
const positions: Record<
  'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
  StyleProp<ViewStyle>
> = {
  topLeft: { position: 'absolute', top: 10, left: 10 },
  topRight: { position: 'absolute', top: 10, right: 10 },
  bottomLeft: { position: 'absolute', bottom: 10, left: 10 },
  bottomRight: { position: 'absolute', bottom: 10, right: 10 },
};

export type MeetingProgressTimerType = (options: MeetingProgressTimerOptions) => JSX.Element;

/**
 * MeetingProgressTimer component displays a timer indicating the progress of a meeting.
 *
 * @param {MeetingProgressTimerOptions} props - The properties for the MeetingProgressTimer component.
 * @returns {JSX.Element} The rendered MeetingProgressTimer component.
 */
const MeetingProgressTimer: React.FC<MeetingProgressTimerOptions> = ({
  meetingProgressTime,
  initialBackgroundColor = 'green',
  position = 'topLeft',
  textStyle,
  showTimer = true,
}) => (
  <View style={[styles.badgeContainer, positions[position]]}>
    {showTimer && (
    <View
      style={[
        styles.progressTimer,
        { backgroundColor: initialBackgroundColor },
      ]}
    >
      <Text style={[styles.progressTimerText, textStyle]}>
        {meetingProgressTime}
      </Text>
    </View>
    )}
  </View>
);

export default MeetingProgressTimer;

/**
 * Stylesheet for the MeetingProgressTimer component.
 */
const styles = StyleSheet.create({
  badgeContainer: {
    padding: 5,
    elevation: 6,
    zIndex: 6,
  },
  progressTimer: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 5,
    backgroundColor: 'green',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    // Elevation for Android
    color: 'white',
  },
  progressTimerText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
