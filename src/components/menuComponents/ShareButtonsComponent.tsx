import React from 'react';
import {View, Pressable, StyleSheet, Linking} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {EventType} from '../../@types/types';

/**
 * Interface defining the structure of each share button.
 */
export interface ShareButton {
  /**
   * The name of the FontAwesome5 icon to be displayed.
   */
  icon: string;

  /**
   * The function to be called when the share button is pressed.
   */
  action: () => void;

  /**
   * Determines if the share button should be displayed.
   */
  show: boolean;

  /**
   * The background color of the share button.
   * @default 'black'
   */
  color?: string;

  /**
   * The color of the icon within the share button.
   * @default '#ffffff'
   */
  iconColor?: string;
}

/**
 * Interface defining the props for the ShareButtonsComponent.
 */
export interface ShareButtonsComponentOptions {
  /**
   * The unique identifier for the meeting.
   */
  meetingID: string;

  /**
   * An optional array of custom share buttons to display. If not provided, default share buttons will be used.
   */
  shareButtons?: ShareButton[];

  /**
   * The type of event, which can be "chat", "broadcast", or "meeting". This determines the URL structure for sharing.
   */
  eventType: EventType;
}

export type ShareButtonsComponentType = (
  options: ShareButtonsComponentOptions,
) => JSX.Element;

/**
 * ShareButtonsComponent is a React Native functional component that renders a set of share buttons.
 * These buttons allow users to share a meeting link via various platforms such as clipboard, email, Facebook, WhatsApp, and Telegram.
 *
 * @component
 * @param {ShareButtonsComponentOptions} props - The properties for the component.
 * @returns {JSX.Element} The rendered ShareButtonsComponent.
 * @example
 * ```tsx
 * import React from 'react';
 * import { ShareButtonsComponent } from 'mediasfu-reactnative';
 *
 * function App() {
 *   return (
 *     <ShareButtonsComponent
 *       meetingID="123456"
 *       eventType="meeting"
 *       shareButtons={[
 *         {
 *           icon: 'copy',
 *           action: () => console.log('Copied to clipboard'),
 *           show: true,
 *         },
 *         {
 *           icon: 'envelope',
 *           action: () => console.log('Shared via email'),
 *           show: true,
 *         },
 *       ]}
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */
const ShareButtonsComponent: React.FC<ShareButtonsComponentOptions> = ({
  meetingID,
  shareButtons = [],
  eventType,
}) => {
  const shareName =
    eventType === 'chat'
      ? 'chat'
      : eventType === 'broadcast'
      ? 'broadcast'
      : 'meeting';

  const defaultShareButtons: ShareButton[] = [
    {
      icon: 'copy',
      action: () => {
        Clipboard.setString(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`,
        );
      },
      show: true,
    },
    {
      icon: 'envelope',
      action: () => {
        const emailUrl = `mailto:?subject=Join my meeting&body=Here's the link to the meeting: https://${shareName}.mediasfu.com/${shareName}/${meetingID}`;
        Linking.openURL(emailUrl);
      },
      show: true,
    },
    {
      icon: 'facebook',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`,
        )}`;
        Linking.openURL(facebookUrl);
      },
      show: true,
    },
    {
      icon: 'whatsapp',
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`,
        )}`;
        Linking.openURL(whatsappUrl);
      },
      show: true,
    },
    {
      icon: 'telegram',
      action: () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
          `https://${shareName}.mediasfu.com/${shareName}/${meetingID}`,
        )}`;
        Linking.openURL(telegramUrl);
      },
      show: true,
    },
  ];

  const finalShareButtons =
    shareButtons.length > 0
      ? shareButtons.filter(button => button.show)
      : defaultShareButtons.filter(button => button.show);

  return (
    <View style={styles.shareButtonsContainer}>
      {finalShareButtons.map((button, index) => (
        <Pressable
          key={index}
          onPress={button.action}
          style={[
            styles.shareButton,
            {backgroundColor: button.color || 'black'},
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Share via ${button.icon}`}>
          <FontAwesome5
            name={button.icon}
            style={[styles.shareIcon, {color: button.iconColor || '#ffffff'}]}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default ShareButtonsComponent;

/**
 * Stylesheet for the ShareButtonsComponent.
 */
const styles = StyleSheet.create({
  shareButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    // Optional: Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },

  shareIcon: {
    fontSize: 24,
  },
});
