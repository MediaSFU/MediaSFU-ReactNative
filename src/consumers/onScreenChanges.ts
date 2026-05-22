import { onScreenChanges as sharedOnScreenChanges } from 'mediasfu-shared';
import { ReorderStreamsType, ReorderStreamsParameters, EventType } from '../@types/types';

export interface OnScreenChangesParameters extends ReorderStreamsParameters {
  eventType: EventType;
  shareScreenStarted: boolean;
  shared: boolean;
  addForBasic: boolean;
  updateAddForBasic: (value: boolean) => void;
  itemPageLimit: number;
  updateItemPageLimit: (value: number) => void;
  updateMainHeightWidth: (value: number) => void;

  // mediasfu functions
  reorderStreams: ReorderStreamsType;
  [key: string]: any;
}

export interface OnScreenChangesOptions {
  changed?: boolean;
  parameters: OnScreenChangesParameters;
}

// Export the type definition for the function
export type OnScreenChangesType = (options: OnScreenChangesOptions) => Promise<void>;

/**
 * Handles changes in screen events such as broadcast, chat, and conference.
 *
 * @param {OnScreenChangesOptions} options - The options for handling screen changes.
 * @param {boolean} options.changed - Indicates if the screen has changed.
 * @param {object} options.parameters - The parameters for handling screen changes.
 * @param {string} options.parameters.eventType - The type of event (e.g., "broadcast", "chat", "conference").
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.parameters.shared - Indicates if the screen is shared.
 * @param {boolean} options.parameters.addForBasic - Flag to add basic controls.
 * @param {function} options.parameters.updateMainHeightWidth - Function to update the main height and width.
 * @param {function} options.parameters.updateAddForBasic - Function to update the addForBasic flag.
 * @param {number} options.parameters.itemPageLimit - The limit for item pages.
 * @param {function} options.parameters.updateItemPageLimit - Function to update the item page limit.
 * @param {function} options.parameters.reorderStreams - Function to reorder streams.
 *
 * @returns {Promise<void>} A promise that resolves when the screen changes have been handled.
 *
 * @throws {Error} Throws an error if there is an issue handling screen changes.
 *
 * @example
 * ```typescript
 * await onScreenChanges({
 *   changed: true,
 *   parameters: {
 *     eventType: 'conference',
 *     shareScreenStarted: false,
 *     shared: false,
 *     addForBasic: false,
 *     updateMainHeightWidth: (height) => console.log('Updated height:', height),
 *     updateAddForBasic: (value) => console.log('Updated addForBasic:', value),
 *     itemPageLimit: 2,
 *     updateItemPageLimit: (limit) => console.log('Updated item page limit:', limit),
 *     reorderStreams: async (options) => console.log('Reordered streams with options:', options),
 *   },
 * });
 * ```
 */
export const onScreenChanges = async (options: OnScreenChangesOptions): Promise<void> => {
  await sharedOnScreenChanges(options);
};
