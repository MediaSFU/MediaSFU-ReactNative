import { View, StyleSheet, Platform } from 'react-native';
import {
  RTCView,
} from '../../methods/utils/webrtc/webrtc';
import { EventType, MediaStream } from '../../@types/types';

// Define the CardVideoDisplayOptions interface
export interface CardVideoDisplayOptions {
  remoteProducerId: string;
  eventType: EventType;
  forceFullDisplay: boolean;
  videoStream: MediaStream | null;
  backgroundColor?: string;
  doMirror?: boolean;
}

// Define the CardVideoDisplayType
export type CardVideoDisplayType = (
  options: CardVideoDisplayOptions
) => React.ReactNode;

/**
 * CardVideoDisplay - A React Native component for displaying video streams in a card layout.
 *
 * @component
 * @param {CardVideoDisplayOptions} props - The properties for the CardVideoDisplay component.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {EventType} props.eventType - The type of event.
 * @param {boolean} props.forceFullDisplay - Flag to force full display.
 * @param {MediaStream | null} props.videoStream - The video stream object.
 * @param {string} [props.backgroundColor='transparent'] - The background color of the video container.
 * @param {boolean} [props.doMirror=false] - Flag to mirror the video display.
 *
 * @returns {JSX.Element} - The CardVideoDisplay component.
 */
const CardVideoDisplay: React.FC<CardVideoDisplayOptions> = ({
  forceFullDisplay,
  videoStream,
  backgroundColor = 'transparent',
  doMirror = false,
}) => {
  /**
   * getRTCViewStyle - Helper function to get styles for RTCView based on platform.
   * @returns {Object} - Styles for RTCView.
   */
  const getRTCViewStyle = (): object => {
    // Add styles based on the forceFullDisplay value
    if (Platform.OS === 'web') {
      const baseStyles: {
        width: string;
        height: string;
        objectFit: string;
        backgroundColor: string;
        transform?: string;
      } = {
        width: forceFullDisplay ? '100%' : 'auto',
        height: '100%',
        objectFit: forceFullDisplay ? 'cover' : 'contain',
        backgroundColor,
      };

      if (doMirror) {
        baseStyles.transform = 'rotateY(180deg)';
      }

      return baseStyles;
    }

    // For non-web platforms, no additional styles needed
    return {};
  };

  return (
    <View style={[styles.videoContainer, { backgroundColor }]}>
      {/* Conditionally render RTCView based on the platform */}
      {Platform.OS === 'web' ? (
        <RTCView stream={videoStream} style={getRTCViewStyle()} />
      ) : (
        <RTCView
          streamURL={videoStream?.toURL()}
          objectFit={forceFullDisplay ? 'cover' : 'contain'}
          mirror={doMirror}
          style={styles.video}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'black', // Set a default background color if needed
  },
  video: {
    height: '100%',
  },
});

export default CardVideoDisplay;
