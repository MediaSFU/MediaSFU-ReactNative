import Sound from 'react-native-sound';

export interface SoundPlayerOptions {
  soundUrl: string;
}
// Export the type definition for the function
export type SoundPlayerType = (options: SoundPlayerOptions) => void;

/**
 * Plays a sound from a given URL.
 *
 * @param {SoundPlayerOptions} options - The options for the sound player.
 * @param {string} options.soundUrl - The URL of the sound to play.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * SoundPlayer({ soundUrl: 'https://example.com/sound.mp3' });
 * ```
 */
export const SoundPlayer = ({ soundUrl }: SoundPlayerOptions): void => {
  // Initialize the Sound instance with the URL
  const sound = new Sound(soundUrl, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Failed to load sound', error);
      return;
    }

    // Play the sound
    sound.play((success) => {
      if (success) {
        console.log('Sound played successfully');
      } else {
        console.log('Sound playback failed');
      }

      // Release the sound resource
      sound.release();
    });
  });
};
