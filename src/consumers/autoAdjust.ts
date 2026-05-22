import { autoAdjust as sharedAutoAdjust } from 'mediasfu-shared';
import { EventType } from '../@types/types';

export interface AutoAdjustOptions {
  n: number;
  eventType: EventType;
  shareScreenStarted: boolean;
  shared: boolean;
}

export type AutoAdjustType = (options: AutoAdjustOptions) => Promise<number[]>;

/**
 * Adjusts values based on the provided options and the number of participants.
 *
 * @function
 * @async
 * @param {AutoAdjustOptions} options - The options for auto adjustment.
 * @param {number} options.n - The number of participants.
 * @param {string} options.eventType - The type of event (e.g., 'broadcast', 'chat', 'conference').
 * @param {boolean} options.shareScreenStarted - Indicates if screen sharing has started.
 * @param {boolean} options.shared - Indicates if something is shared.
 *
 * @returns {Promise<number[]>} A promise that resolves to an array containing the adjusted values.
 *
 * @example
 * import { autoAdjust } from 'mediasfu-reactnative';
 *
 * const options = {
 *   n: 10,
 *   eventType: 'conference',
 *   shareScreenStarted: false,
 *   shared: false,
 * };
 *
 * autoAdjust(options)
 *   .then(values => {
 *     console.log('Adjusted values:', values);
 *   })
 *   .catch(error => {
 *     console.error('Error adjusting values:', error);
 *   });
 */


export const autoAdjust = async (options: AutoAdjustOptions): Promise<number[]> => {
  return (sharedAutoAdjust as unknown as AutoAdjustType)(options);
};
