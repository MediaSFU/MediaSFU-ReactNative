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
 * Options for rendering a `MeetingProgressTimer` badge.
 *
 * @interface MeetingProgressTimerOptions
 *
 * **Appearance:**
 * @property {string} meetingProgressTime The current progress time of the meeting to be displayed.
 * @property {string} [initialBackgroundColor='green'] The initial background color of the timer.
 * @property {StyleProp<TextStyle>} [textStyle] Additional styles to apply to the timer text.
 * @property {boolean} [showTimer=true] Flag to determine whether the timer should be displayed.
 *
 * **Positioning:**
 * @property {'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'} [position='topLeft'] The position of the timer on the screen.
 */
export interface MeetingProgressTimerOptions {
  meetingProgressTime: string;
  initialBackgroundColor?: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  textStyle?: StyleProp<TextStyle>;
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
 * MeetingProgressTimer displays a compact badge showing the meeting's elapsed time with corner-anchored positioning.
 *
 * ### Key Features
 * - Positioned in one of four screen corners for minimal layout interference.
 * - Customizable background and text styling for brand alignment.
 * - Optional visibility toggle for show/hide behavior.
 *
 * @component
 * @param {MeetingProgressTimerOptions} props Timer badge configuration.
 * @returns {JSX.Element} Rendered meeting progress timer badge.
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
