import { checkGrid as sharedCheckGrid } from 'mediasfu-shared';

export interface CheckGridOptions {
  rows: number;
  cols: number;
  actives: number;
}

export type CheckGridType = (options: CheckGridOptions) => Promise<[boolean, number, number, number, number, number, number] | void>;

/**
 * Checks the grid configuration and calculates various parameters based on the number of rows, columns, and active elements.
 *
 * @param {CheckGridOptions} options - The options for checking the grid.
 * @param {number} options.rows - The number of rows in the grid.
 * @param {number} options.cols - The number of columns in the grid.
 * @param {number} options.actives - The number of active elements in the grid.
 * @returns {Promise<[boolean, number, number, number, number, number, number] | void>} A promise that resolves to a tuple containing:
 * - `removeAltGrid` (boolean): Indicates whether to remove the alternate grid.
 * - `numtoadd` (number): The number of elements to add.
 * - `numRows` (number): The number of rows.
 * - `numCols` (number): The number of columns.
 * - `remainingVideos` (number): The number of remaining videos.
 * - `actualRows` (number): The actual number of rows.
 * - `lastrowcols` (number): The number of columns in the last row.
 *
 * If an error occurs, it logs the error to the console.
 *
 * @example
 * const options = {
 *   rows: 3,
 *   cols: 4,
 *   actives: 10,
 * };
 *
 * checkGrid(options)
 *   .then(result => {
 *     console.log('Grid check result:', result);
 *     // Example output: [true, 2, 3, 4, 2, 3, 4]
 *   })
 *   .catch(error => {
 *     console.error('Error checking grid:', error);
 *   });
 */

export const checkGrid = async (options: CheckGridOptions): Promise<[boolean, number, number, number, number, number, number] | void> => {
  return (sharedCheckGrid as unknown as CheckGridType)(options);
};
