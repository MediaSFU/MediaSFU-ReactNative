import { NativeModules, Platform } from 'react-native';
import {
  createNativeCapabilityError,
  isNativeModuleLoadError,
} from '../nativeCapability';

type NativeWebRTCExports = typeof import('react-native-webrtc');

/**
 * Check the host application's native registration before loading WebRTC.
 * react-native-webrtc creates its NativeEventEmitter during module evaluation,
 * so a missing native module must be reported before calling require().
 */
export function loadNativeWebRTC(): NativeWebRTCExports {
  const nativeModules = NativeModules as typeof NativeModules & {
    WebRTCModule?: unknown;
  };

  if (!nativeModules?.WebRTCModule) {
    throw createNativeCapabilityError({
      moduleName: 'WebRTCModule',
      packageName: 'react-native-webrtc',
      platform: Platform.OS,
    });
  }

  try {
    return require('react-native-webrtc') as NativeWebRTCExports;
  } catch (error) {
    if (isNativeModuleLoadError(error)) {
      throw createNativeCapabilityError({
        moduleName: 'WebRTCModule',
        packageName: 'react-native-webrtc',
        platform: Platform.OS,
      });
    }
    throw error;
  }
}
