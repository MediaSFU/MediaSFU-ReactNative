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
 * MeetingProgressTimer displays a timer badge indicating the progress time of a meeting, with customizable positioning and styles.
 *
 * This component is designed to show a timer in one of four corner positions with optional styling and background color customization.
 *
 * @component
 * @param {MeetingProgressTimerOptions} props - Configuration options for MeetingProgressTimer.
 * @param {string} props.meetingProgressTime - The current progress time of the meeting to display.
 * @param {string} [props.initialBackgroundColor='green'] - Background color of the timer badge.
 * @param {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'} [props.position='topLeft'] - Position of the timer on the screen.
 * @param {StyleProp<TextStyle>} [props.textStyle] - Additional styles for the timer text.
 * @param {boolean} [props.showTimer=true] - Controls whether the timer is visible.
 *
 * @returns {JSX.Element} The MeetingProgressTimer component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MeetingProgressTimer } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <MeetingProgressTimer
 *       meetingProgressTime="15:30"
 *       initialBackgroundColor="blue"
 *       position="bottomRight"
 *       showTimer={true}
 *       textStyle={{ color: 'white', fontSize: 16 }}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
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
