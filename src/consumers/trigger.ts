import { trigger as sharedTrigger } from 'mediasfu-shared';
/* eslint-disable eqeqeq */
import { Socket } from 'socket.io-client';
import { Participant, AutoAdjustType, ScreenState, EventType } from '../@types/types';

export interface TriggerParameters {
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  screenStates: ScreenState[];
  participants: Participant[];
  updateDateState?: number | null;
  lastUpdate: number | null;
  nForReadjust: number | null;
  eventType: EventType;
  shared: boolean;
  shareScreenStarted: boolean;
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  updateUpdateDateState: (timestamp: number | null) => void;
  updateLastUpdate: (lastUpdate: number | null) => void;
  updateNForReadjust: (nForReadjust: number) => void;


  // mediasfu functions
  autoAdjust: AutoAdjustType;

  getUpdatedAllParams: () => TriggerParameters;
  [key: string]: any;
}

export interface TriggerOptions {
  ref_ActiveNames: string[];
  parameters: TriggerParameters;
}

// Export the type definition for the function
export type TriggerType = (options: TriggerOptions) => Promise<void>;

/**
 * Triggers an update to the screen client based on the provided parameters.
 *
 * @param {TriggerOptions} options - The options for triggering the update.
 * @param {string[]} options.ref_ActiveNames - Reference to the active names.
 * @param {TriggerParameters} options.parameters - The parameters for the trigger.
 *
 * @returns {Promise<void>} A promise that resolves when the trigger is complete.
 *
 * @throws Will throw an error if the updateScreenClient operation fails.
 *
 * @remarks
 * This function handles various conditions to determine the main screen person,
 * adjusts the screen states, and emits an update to the screen client via socket.
 *
 * @example
 * ```typescript
 * await trigger({
 *   ref_ActiveNames: ['user1', 'user2'],
 *   parameters: {
 *     socket: socketInstance,
 *     localSocket: localSocketInstance,
 *     roomName: 'room1',
 *     screenStates: [{ mainScreenPerson: 'user1', mainScreenFilled: true, adminOnMainScreen: false }],
 *     participants: [{ name: 'admin', islevel: '2' }],
 *     updateDateState: 0,
 *     lastUpdate: null,
 *     nForReadjust: 0,
 *     eventType: 'conference',
 *     shared: false,
 *     shareScreenStarted: false,
 *     whiteboardStarted: false,
 *     whiteboardEnded: false,
 *     updateUpdateDateState: (date) => {},
 *     updateLastUpdate: (date) => {},
 *     updateNForReadjust: (n) => {},
 *     autoAdjust: async ({ n, parameters }) => [n, 0],
 *   },
 * });
 * ```
 */

export const trigger = async (options: TriggerOptions): Promise<void> => {
  await (sharedTrigger as unknown as TriggerType)(options);
};

