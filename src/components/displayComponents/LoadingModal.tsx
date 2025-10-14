// LoadingModal.tsx

import React from 'react';
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

/**
 * Options for configuring `LoadingModal`.
 *
 * @interface LoadingModalOptions
 *
 * **Modal Control:**
 * @property {boolean} isVisible Toggles the visibility of the loading overlay.
 *
 * **Appearance:**
 * @property {string} [backgroundColor='rgba(0, 0, 0, 0.5)'] Backdrop color.
 * @property {string} [displayColor='black'] Spinner and label color.
 * @property {StyleProp<ViewStyle>} [style] Additional styling for the overlay container.
 *
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent]
 * Override the spinner/text content.
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContainer]
 * Override the surrounding container implementation.
 */
export interface LoadingModalOptions {
  isVisible: boolean;
  backgroundColor?: string;
  displayColor?: string;
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

export type LoadingModalType = (options: LoadingModalOptions) => JSX.Element;

/**
 * LoadingModal presents a centered activity indicator with optional status text. It is ideal for
 * blocking interactions while asynchronous work completes and can be themed or overridden for
 * custom visuals.
 *
 * ### Key Features
 * - Lightweight overlay with spinner and message.
 * - Easily themed via `backgroundColor`, `displayColor`, and `StyleProp`.
 * - Supports render overrides for custom loading UX.
 *
 * ### Accessibility
 * - Spinner conveys ongoing progress; pair with additional messaging when possible.
 *
 * @param {LoadingModalOptions} props Modal configuration.
 * @returns {JSX.Element} Rendered loading modal.
 *
 * @example Simple loading overlay.
 * ```tsx
 * <LoadingModal isVisible={true} />
 * ```
 *
 * @example Custom content override.
 * ```tsx
 * <LoadingModal
 *   isVisible={isFetching}
 *   renderContent={({ defaultContent }) => (
 *     <View>
 *       {defaultContent}
 *       <Text style={{ marginTop: 8 }}>Syncing data…</Text>
 *     </View>
 *   )}
 * />
 * ```
 */

const LoadingModal: React.FC<LoadingModalOptions> = ({
  isVisible,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  displayColor = 'black',
  style,
  renderContent,
  renderContainer,
}) => {
  /**
   * Styles for the modal overlay container.
   */
  const modalContainerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'center', // Vertically center content
    alignItems: 'center', // Horizontally center content
    backgroundColor,
  };

  /**
   * Styles for the modal content box.
   */
  const modalContentStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200,
  };

  /**
   * Styles for the loading text.
   */
  const loadingTextStyle: StyleProp<TextStyle> = {
    color: displayColor,
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  };

  const dimensions = { width: 200, height: 0 };

  const defaultContent = (
    <>
      <ActivityIndicator size="large" color={displayColor} />
      <Text style={loadingTextStyle}>Loading...</Text>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => { /* Optionally handle modal close */ }}
    >
      <View style={[modalContainerStyle, style]}>
        <View style={modalContentStyle}>
          {content}
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? renderContainer({ defaultContainer, dimensions })
    : defaultContainer;
};

export default LoadingModal;
