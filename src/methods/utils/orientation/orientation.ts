import { Dimensions } from 'react-native';

export type ScreenOrientation = 'PORTRAIT' | 'LANDSCAPE';

export function classifyOrientation(
  width: number,
  height: number,
): ScreenOrientation {
  return width > height ? 'LANDSCAPE' : 'PORTRAIT';
}

const Orientation = {
  getInitialOrientation: (): ScreenOrientation => {
    const { width, height } = Dimensions.get('window');
    return classifyOrientation(width, height);
  },

  // Host applications own the device orientation policy.
  lockToPortrait: (): void => {},
  unlockAllOrientations: (): void => {},
};

export default Orientation;
