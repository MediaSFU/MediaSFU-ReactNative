import { Settings } from '../../@types/types';

export interface UpdateMediaSettingsOptions {
  settings: Settings;
  updateAudioSetting: (value: string) => void;
  updateVideoSetting: (value: string) => void;
  updateScreenshareSetting: (value: string) => void;
  updateChatSetting: (value: string) => void;
}

// Export the type definition for the function
export type UpdateMediaSettingsType = (options: UpdateMediaSettingsOptions) => void;

/**
 * Updates the media settings by invoking the provided update functions for each setting.
 *
 * @param {UpdateMediaSettingsOptions} options - The options for updating media settings.
 * @param {Array} options.settings - An array containing the settings for audio, video, screenshare, and chat.
 * @param {Function} options.updateAudioSetting - Function to update the audio setting.
 * @param {Function} options.updateVideoSetting - Function to update the video setting.
 * @param {Function} options.updateScreenshareSetting - Function to update the screenshare setting.
 * @param {Function} options.updateChatSetting - Function to update the chat setting.
 *
 * @returns {void}
 */
export const updateMediaSettings = ({
  settings,
  updateAudioSetting,
  updateVideoSetting,
  updateScreenshareSetting,
  updateChatSetting,
}: UpdateMediaSettingsOptions): void => {
  const [audioSetting, videoSetting, screenshareSetting, chatSetting] = settings;

  // Update audio setting
  updateAudioSetting(audioSetting);
  // Update video setting
  updateVideoSetting(videoSetting);
  // Update screenshare setting
  updateScreenshareSetting(screenshareSetting);
  // Update chat setting
  updateChatSetting(chatSetting);
};
