import { controlMedia as sharedControlMedia } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import { CoHostResponsibility, Participant, ShowAlert } from '../@types/types';

export interface ControlMediaOptions {
  participantId: string;
  participantName: string;
  type: 'audio' | 'video' | 'screenshare' | 'all';
  socket: Socket;
  coHostResponsibility: CoHostResponsibility[];
  participants: Participant[];
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
  coHost: string;
  roomName: string;
}
// Export the type definition for the function
export type ControlMediaType = (options: ControlMediaOptions) => Promise<void>;

/**
 * Controls the media of a participant in a media session if certain conditions are met.
 *
 * @param {ControlMediaOptions} options - The options for controlling media.
 * @param {string} options.participantId - The ID of the participant to control.
 * @param {string} options.participantName - The name of the participant to control.
 * @param {'audio' | 'video' | 'screenshare' | 'all'} options.type - The type of media to control.
 * @param {Socket} options.socket - The socket instance for communication.
 * @param {Array<CoHostResponsibility>} options.coHostResponsibility - List of co-host responsibilities.
 * @param {Array<Participant>} options.participants - List of participants in the session.
 * @param {string} options.member - The current member attempting to control media.
 * @param {string} options.islevel - The level of the current member.
 * @param {Function} [options.showAlert] - Optional function to show alerts.
 * @param {string} options.coHost - The co-host information.
 * @param {string} options.roomName - The name of the room.
 *
 * @returns {Promise<void>} A promise that resolves when the media control operation is complete.
 *
 * @throws Will log an error message if there are issues controlling the media or if participant is not found.
 *
 * @example
 * const options = {
 *   participantId: '1234',
 *   participantName: 'John Doe',
 *   type: 'audio',
 *   socket: socketInstance,
 *   coHostResponsibility: [{ name: 'media', value: true }],
 *   participants: participantList,
 *   member: 'Admin',
 *   islevel: '1',
 *   showAlert: (alert) => console.log(alert.message),
 *   coHost: 'CoHostName',
 *   roomName: 'Room 1',
 * };
 *
 * controlMedia(options)
 *   .then(() => {
 *     console.log('Media control operation completed successfully.');
 *   })
 *   .catch((error) => {
 *     console.error('Error controlling media:', error);
 *   });
 */

export const controlMedia = async (options: ControlMediaOptions): Promise<void> => {
  await (sharedControlMedia as unknown as ControlMediaType)(options);
};
