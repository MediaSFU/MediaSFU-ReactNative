/**
 * Media socket connection errors.
 *
 * A media node that refuses a handshake emits `connection-rejected { reason, stage }` just before it closes the socket
 * (media admission v2). `connectSocket` turns that, and every other way a connection can fail, into a
 * `MediaSocketConnectError` that says what happened (`phase`), when (`elapsedMs`), whether the device was online and
 * whether trying again can help (`retryable`). The runtime lives in `mediasfu-shared`.
 *
 * @example
 * ```ts
 * try {
 *   await connectSocket({ apiUserName, apiKey, apiToken, link });
 * } catch (error) {
 *   showAlert({ message: describeMediaSocketError(error), type: 'danger' });
 *   if (!isRetryableMediaSocketError(error)) {
 *     // Rejoin through the backend instead of retrying the same credentials.
 *   }
 * }
 * ```
 */
import { isMediaSocketConnectError } from 'mediasfu-shared';

export {
  MediaSocketConnectError,
  MEDIA_CONNECTION_REJECTION_REASONS,
  normalizeRejectionReason,
  currentOnlineState,
  formatMediaSocketError,
  isMediaSocketConnectError,
  isRetryableMediaSocketError,
  describeMediaSocketError,
} from 'mediasfu-shared';
export type {
  MediaConnectionRejectionReason,
  MediaSocketConnectPhase,
  MediaSocketConnectErrorDetails,
} from 'mediasfu-shared';

/**
 * True when the attempt failed because of the device's network (offline, or the transport never opened) rather than
 * because the server refused it. Such failures are not credential guesses, so they do not count toward the join
 * page's attempt limit.
 */
export const isNetworkOnlyMediaSocketError = (error: unknown): boolean =>
  isMediaSocketConnectError(error)
  && error.phase !== 'rejected'
  && (error.online === false || error.phase === 'before-open');
