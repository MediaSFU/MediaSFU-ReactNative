import {
  checkMediasfuURL as sharedCheckMediasfuURL,
  joinLocalRoom as sharedJoinLocalRoom,
} from 'mediasfu-shared';
import { ResponseJoinLocalRoom, PreJoinPageParameters } from '../../@types/types';
import { Socket } from 'socket.io-client';
import { JoinRoomOnMediaSFUType } from '../../methods/utils/joinRoomOnMediaSFU';

export interface JoinLocalRoomOptions {
  socket: Socket;
  roomName: string;
  islevel: string;
  member: string;
  sec: string;
  apiUserName: string;
  parameters: PreJoinPageParameters;
  checkConnect?: boolean;
  joinMediaSFURoom?: JoinRoomOnMediaSFUType,
  localLink?: string;
}

// Export the type definition for the function
export type JoinLocalRoomType = (
  options: JoinLocalRoomOptions
) => Promise<ResponseJoinLocalRoom>;


export interface CheckMediasfuURLOptions {
  data: ResponseJoinLocalRoom;
  member: string;
  roomName: string;
  islevel: string;
  socket: Socket;
  parameters: PreJoinPageParameters;
  joinMediaSFURoom?: JoinRoomOnMediaSFUType,
  localLink?: string;
}

// Export the type definition for the function
export type CheckMediasfuURLType = (options: CheckMediasfuURLOptions) => Promise<void>;

/**
 * Checks the MediaSFU URL and processes the necessary actions based on the URL's validity.
 *
 * @param {CheckMediasfuURLOptions} options - The options for checking and handling the MediaSFU URL.
 * @param {ResponseJoinLocalRoom} options.data - The data received from the room join response.
 * @param {string} options.member - The member identifier.
 * @param {string} options.roomName - The name of the room to join.
 * @param {string} options.islevel - The level of the user.
 * @param {Socket} options.socket - The socket instance to use for communication.
 * @param {PreJoinPageParameters} options.parameters - Additional parameters for pre-join page actions.
 * @param {JoinRoomOnMediaSFUType} [options.joinMediaSFURoom] - The function to join a room on MediaSFU.
 * @param {string} [options.localLink] - The local link for the Community Edition.
 *
 * @returns {Promise<void>} A promise that resolves when the actions are complete.
 *
 * @example
 * ```typescript
 * const options = {
 *   data: {
 *     mediasfuURL: 'https://example.com/meet/room123/secret',
 *     allowRecord: true,
 *     apiKey: '1234567890123456789012345678901234567890123456789012345678901234',
 *     apiUserName: 'user123',
 *   },
 *   member: 'user123',
 *   roomName: 's12345678',
 *   islevel: '1',
 *   socket: socketInstance,
 *   parameters: {
 *     someParameter: 'value',
 *   },
 * };
 *
 * try {
 *   await checkMediasfuURL(options);
 *   console.log('MediaSFU URL processed successfully.');
 * } catch (error) {
 *   console.error('Failed to process MediaSFU URL:', error);
 * }
 * ```
 */

export async function checkMediasfuURL({
  data,
  member,
  roomName,
  islevel,
  socket,
  parameters,
  joinMediaSFURoom,
  localLink = '',
}: CheckMediasfuURLOptions): Promise<void> {
  return (sharedCheckMediasfuURL as unknown as (options: CheckMediasfuURLOptions) => Promise<void>)({
    data,
    member,
    roomName,
    islevel,
    socket,
    parameters,
    joinMediaSFURoom,
    localLink,
  });
}

/**
 * Joins a user to a specified room via a socket connection.
 *
 * @param {JoinLocalRoomOptions} options - The options for joining the room.
 * @param {Socket} options.socket - The socket instance to use for communication.
 * @param {string} options.roomName - The name of the room to join.
 * @param {string} options.islevel - The level of the user.
 * @param {string} options.member - The member identifier.
 * @param {string} options.sec - The security token.
 * @param {string} options.apiUserName - The API username of the user.
 * @param {PreJoinPageParameters} options.parameters - Additional parameters for pre-join page actions.
 * @param {boolean} options.checkConnect - A flag to check the MediaSFU URL and perform necessary actions.
 * @param {JoinRoomOnMediaSFUType} [options.joinMediaSFURoom] - The function to join a room on MediaSFU.
 * @param {string} [options.localLink] - The local link for the Community Edition.
 *
 * @returns {Promise<object>} A promise that resolves with the data received from the 'joinRoom' event or rejects with a validation error.
 *
 * @example
 * ```typescript
 * const options = {
 *   socket: socketInstance,
 *   roomName: 's12345678',
 *   islevel: '1',
 *   member: 'user123',
 *   sec: '32CharacterLongSecretHere',
 *   apiUserName: 'user123',
 *   parameters: { someParameter: 'value' },
 *   checkConnect: true,
 * };
 *
 * try {
 *   const response = await joinLocalRoom(options);
 *   console.log('Room joined:', response);
 * } catch (error) {
 *   console.error('Failed to join room:', error);
 * }
 * ```
 */

async function joinLocalRoom
  ({
    socket,
    roomName,
    islevel,
    member,
    sec,
    apiUserName,
    parameters,
    checkConnect = false,
    joinMediaSFURoom,
    localLink = '',
  }: JoinLocalRoomOptions): Promise<ResponseJoinLocalRoom> {
  return (sharedJoinLocalRoom as unknown as (options: JoinLocalRoomOptions) => Promise<ResponseJoinLocalRoom>)({
    socket,
    roomName,
    islevel,
    member,
    sec,
    apiUserName,
    parameters,
    checkConnect,
    joinMediaSFURoom,
    localLink,
  });
}

export { joinLocalRoom };
