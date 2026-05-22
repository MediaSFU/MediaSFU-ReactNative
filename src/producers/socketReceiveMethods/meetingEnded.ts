import { EventType, ShowAlert } from '../../@types/types';
import { meetingEnded as sharedMeetingEnded } from 'mediasfu-shared';

export interface MeetingEndedOptions {
  showAlert?: ShowAlert;
  redirectURL?: string;
  onWeb: boolean;
  eventType: EventType;
  updateValidated?: (isValid: boolean) => void;
}

// Export the type definition for the function
export type MeetingEndedType = (options: MeetingEndedOptions) => Promise<void>;
/**
 * Handles the end of a meeting by showing an alert and redirecting the user.
 *
 * @param {MeetingEndedOptions} options - The options for handling the meeting end.
 * @param {Function} [options.showAlert] - Optional function to show an alert message.
 * @param {string} [options.redirectURL] - URL to redirect to after the meeting ends.
 * @param {boolean} options.onWeb - Flag indicating if the application is running on the web.
 * @param {EventType} options.eventType - Type of the event that triggered the meeting end.
 *
 * @returns {Promise<void>} A promise that resolves when the meeting end handling is complete.
 *
 * @example
 * ```typescript
 * const options: MeetingEndedOptions = {
 *   showAlert: ({ message, type, duration }) => console.log(`Alert: ${message}, Type: ${type}, Duration: ${duration}`),
 *   redirectURL: "https://homepage.com",
 *   onWeb: true,
 *   eventType: "meeting",
 * };
 *
 * await meetingEnded(options);
 * // Output:
 * // Alert: The event has ended. You will be redirected to the home page in 2 seconds., Type: danger, Duration: 2000
 * // (Redirects to the specified URL after 2 seconds if on the web)
 * ```
 */

export const meetingEnded = async ({
  showAlert, redirectURL, onWeb, eventType,
}: MeetingEndedOptions): Promise<void> => {
  return sharedMeetingEnded({
    showAlert,
    redirectURL,
    onWeb,
    eventType,
  });
};
