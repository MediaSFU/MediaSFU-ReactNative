import { checkPermission as sharedCheckPermission } from 'mediasfu-shared';
import { PermissionConfig } from '../methods/permissionsMethods/updatePermissionConfig';

export interface CheckPermissionOptions {
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  permissionType: 'audioSetting' | 'videoSetting' | 'screenshareSetting' | 'chatSetting';
  permissionConfig?: PermissionConfig | null;
  participantLevel?: string;
}

// Export the type definition for the function
export type CheckPermissionType = (options: CheckPermissionOptions) => Promise<number>;

/**
 * Checks the permission based on the provided settings.
 *
 * @param {CheckPermissionOptions} options - The options for checking permissions.
 * @param {string} options.permissionType - The type of permission to check. Can be "audioSetting", "videoSetting", "screenshareSetting", or "chatSetting".
 * @param {string} options.audioSetting - The setting for audio permission. Can be "allow", "approval", or other.
 * @param {string} options.videoSetting - The setting for video permission. Can be "allow", "approval", or other.
 * @param {string} options.screenshareSetting - The setting for screenshare permission. Can be "allow", "approval", or other.
 * @param {string} options.chatSetting - The setting for chat permission. Can be "allow", "approval", or other.
 * @returns {Promise<number>} - Returns 0 if the setting is "allow", 1 if the setting is "approval", and 2 for other settings or invalid permission types.
 * @throws Will throw an error if an unexpected error occurs during the permission check.
 *
 * @example
 * const options = {
 *   permissionType: 'audioSetting',
 *   audioSetting: 'allow',
 *   videoSetting: 'approval',
 *   screenshareSetting: 'approval',
 *   chatSetting: 'allow',
 * };
 *
 * checkPermission(options)
 *   .then(result => {
 *     console.log('Permission result:', result);
 *   })
 *   .catch(error => {
 *     console.error('Error checking permission:', error);
 *   });
 */

export const checkPermission = async (options: CheckPermissionOptions): Promise<number> => {
  return (sharedCheckPermission as unknown as CheckPermissionType)(options);
};
