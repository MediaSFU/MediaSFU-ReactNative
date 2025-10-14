import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import {
  RTCView,
} from '../../methods/utils/webrtc/webrtc';
import { EventType, MediaStream } from '../../@types/types';

// Define the CardVideoDisplayOptions interface
/**
 * Options for displaying a video stream inside `CardVideoDisplay`.
 *
 * @interface CardVideoDisplayOptions
 *
 * **Video Source:**
 * @property {string} remoteProducerId Identifier for the remote video producer.
 * @property {EventType} eventType Event flavour (meeting, webinar, etc.).
 * @property {boolean} forceFullDisplay Forces `RTCView` to fill the container.
 * @property {MediaStream | null} videoStream Stream instance to render.
 * @property {boolean} [doMirror=false] Mirrors the video output.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='transparent'] Background fill for the container.
 * @property {StyleProp<ViewStyle>} [style] Additional styling for the wrapping view.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override for the `RTCView` content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override for the containing view.
 */
export interface CardVideoDisplayOptions {
  remoteProducerId: string;
  eventType: EventType;
  forceFullDisplay: boolean;
  videoStream: MediaStream | null;
  backgroundColor?: string;
  doMirror?: boolean;
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

// Define the CardVideoDisplayType
export type CardVideoDisplayType = (
  options: CardVideoDisplayOptions
) => JSX.Element;

/**
 * CardVideoDisplay is a lightweight wrapper around `RTCView` that respects platform-specific rendering
 * differences while exposing override hooks for advanced layouts.
 *
 * ### Key Features
 * - Mirrors video automatically when requested (self-view scenarios)
 * - Matches Expo web behaviour by configuring `objectFit`/`transform` for browsers
 * - Supports render overrides to integrate with animation or custom frames
 * - Platform-specific optimizations for iOS, Android, and web
 *
 * ### Accessibility
 * - RTCView provides native video accessibility
 * - Consumers should add descriptive labels to the container
 *
 * @example
 * ```tsx
 * // Basic remote video display
 * <CardVideoDisplay
 *   videoStream={remoteStream}
 *   remoteProducerId="producer-123"
 *   eventType="conference"
 *   forceFullDisplay
 *   backgroundColor="#000"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Mirrored self-view with custom container
 * <CardVideoDisplay
 *   videoStream={localStream}
 *   remoteProducerId="local"
 *   eventType="broadcast"
 *   forceFullDisplay
 *   doMirror
 *   renderContainer={({ defaultContainer, dimensions }) => (
 *     <Animated.View
 *       style={{
 *         transform: [{ scale: scaleAnim }],
 *         borderRadius: 12,
 *         overflow: 'hidden',
 *       }}
 *     >
 *       {defaultContainer}
 *     </Animated.View>
 *   )}
 * />
 * ```
 */
const CardVideoDisplay: React.FC<CardVideoDisplayOptions> = ({
  forceFullDisplay,
  videoStream,
  backgroundColor = 'transparent',
  doMirror = false,
  style,
  renderContent,
  renderContainer,
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

  const dimensions = { width: 0, height: 0 }; // Video fills container

  const defaultContent = (
    <>
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
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <View style={[styles.videoContainer, { backgroundColor }, style]}>
      {content}
    </View>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
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
