import { readFileSync } from 'fs';
import path from 'path';
import {
  createNativeCapabilityError,
  isNativeModuleLoadError,
} from '../src/methods/utils/nativeCapability';
import Orientation, {
  classifyOrientation,
} from '../src/methods/utils/orientation/orientation';

describe('native capability diagnostics', () => {
  it('provides an actionable WebRTC setup message', () => {
    const error = createNativeCapabilityError({
      moduleName: 'WebRTCModule',
      packageName: 'react-native-webrtc',
      platform: 'android',
    });

    expect(error.name).toBe('MediaSFUNativeCapabilityError');
    expect(error.message).toContain('WebRTCModule');
    expect(error.message).toContain('development build rather than Expo Go');
    expect(error.message).toContain('not a MediaSFU room or server error');
  });

  it('recognizes the native emitter failure that the guard replaces', () => {
    expect(
      isNativeModuleLoadError(
        new Error('new NativeEventEmitter() requires a non-null argument.'),
      ),
    ).toBe(true);
    expect(isNativeModuleLoadError(new Error('permission denied'))).toBe(false);
  });

  it('uses the React Native dimension adapter without an orientation package', () => {
    const adapterSource = readFileSync(
      path.resolve(
        __dirname,
        '../src/methods/utils/orientation/orientation.ts',
      ),
      'utf8',
    );

    expect(adapterSource).not.toContain('react-native-orientation-locker');
    expect(classifyOrientation(390, 844)).toBe('PORTRAIT');
    expect(classifyOrientation(844, 390)).toBe('LANDSCAPE');
    expect(Orientation.lockToPortrait()).toBeUndefined();
    expect(Orientation.unlockAllOrientations()).toBeUndefined();
  });
});
