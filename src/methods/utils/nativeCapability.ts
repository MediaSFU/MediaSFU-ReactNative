export type NativeCapability = {
  moduleName: string;
  packageName: string;
  platform: string;
};

/**
 * Creates a concise setup error for a native module that is missing from the
 * application binary. Keep this independent of React Native so it is easy to
 * validate without loading native packages.
 */
export function createNativeCapabilityError(capability: NativeCapability): Error {
  const error = new Error(
    `MediaSFU could not load ${capability.packageName}: the native module ${capability.moduleName} is not registered on ${capability.platform}. ` +
      'Rebuild the native app after installing the package. Expo apps must use a development build rather than Expo Go; bare React Native apps should refresh CocoaPods or Gradle dependencies before rebuilding. ' +
      'This is a native app setup issue, not a MediaSFU room or server error.',
  );
  error.name = 'MediaSFUNativeCapabilityError';
  return error;
}

export function isNativeModuleLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('NativeEventEmitter') ||
    message.includes('WebRTC native module not found')
  );
}
