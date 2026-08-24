# Headless MediaSFU React Native Guide

Use this guide when a bare React Native app owns the visible call experience while `mediasfu-reactnative` owns room signaling, transports, producers, consumers, and runtime state. The current contract is `returnUI={false}` plus `sourceParameters` and `updateSourceParameters`; it is not a separate controller export.

## Architecture

```text
Your navigation stack and call screen
        | user intents
        v
ModernMediasfuGeneric with returnUI=false
        | publishes current room state and helpers
        v
updateSourceParameters -> latest React state
        | render selected video plus every remote audio stream
        v
Your native call UI
```

## 1. Store the latest publication

```tsx
const [sourceParameters, setSourceParameters] =
  useState<Record<string, any>>({});

const updateSourceParameters = useCallback(
  (next: Record<string, any>) => setSourceParameters(next),
  [],
);
```

Replace the reference on every callback. Do not capture the first publication in a long-lived timer or event listener.

## 2. Mount the hidden runtime

```tsx
<ModernMediasfuGeneric
  returnUI={false}
  noUIPreJoinOptions={headlessJoin}
  sourceParameters={sourceParameters}
  updateSourceParameters={updateSourceParameters}
  createMediaSFURoom={createMediaSFURoom}
  joinMediaSFURoom={joinMediaSFURoom}
/>
```

Use an `action: 'create'` payload with `duration`, `capacity`, and `userName`, or an `action: 'join'` payload with `meetingID` and `userName`.

## 3. Keep credentials on the app backend

Your mobile client should submit only room intent to an authenticated HTTPS endpoint. The backend validates it, adds MediaSFU credentials from environment variables, and forwards it to MediaSFU Cloud or the configured MediaSFU Open rooms endpoint. Return the normalized `{ data, success }` shape.

Short-lived keys are acceptable only in ignored local configuration for fast development. Remove them before creating public binaries or screenshots. Follow the [secure proxy guide](https://mediasfu.com/docs/usage/secure-backend-proxy/).

## 4. Produce local media

Read current React state inside each handler:

```ts
async function toggleMicrophone() {
  const p = sourceParameters;
  await p.clickAudio?.({ parameters: p });
}

async function toggleCamera() {
  const p = sourceParameters;
  await p.clickVideo?.({ parameters: p });
}

async function toggleScreenShare() {
  const p = sourceParameters;
  await p.clickScreenShare?.({ parameters: p });
}
```

These helpers keep permission, producer, transport, and control state aligned. Request platform permissions before entering the call and handle denial explicitly.

## 5. Resolve and render participant video

```ts
async function resolveParticipantVideo(participant: any) {
  const p = sourceParameters;
  return p.getParticipantMedia?.(
    participant.videoID ?? '',
    participant.name,
    'video',
  );
}
```

A deterministic resolver should prefer:

1. active screen share
2. selected remote camera
3. local camera preview
4. avatar or audio-only fallback

Key RTC views by stable producer or stream ID. Re-resolve when participant lists, streams, IDs, or screen-share state change. Remove a view when its tracks end or producer closes even if the stream object is still non-null.

## 6. Play all remote audio

Drive a dedicated audio-render layer from the newest `allAudioStreams` collection. Each entry exposes a stable producer identifier and stream.

- Render each live stream with the RTC view appropriate to your installed WebRTC package and platform.
- Keep audio rendering separate from paginated video cards.
- Do not stop an audio consumer when its video tile becomes hidden.
- Remove the RTC view when the producer closes.
- Test Bluetooth, speaker, earpiece, interruptions, and background/foreground transitions on supported devices.

The SDK's `MiniAudioPlayer` and `ModernMiniAudioPlayer` are exported when you also need SDK waveform/decibel behavior and have the required consumer object.

## 7. Custom component or fully headless?

Use `uiOverrides`, custom cards, or `customComponent` when the MediaSFU room workflow still fits. Use `returnUI={false}` when your navigation, call screen, accessibility model, and product shell must be entirely app-owned.

## 8. Cleanup

When leaving the screen:

- call the latest MediaSFU leave/disconnect helper
- detach app-owned RTC views and listeners
- stop only tracks created directly by your app
- clear audio queues, timers, and retry callbacks
- restore any app-level audio-session state you changed
- discard the parameter bag

## 9. Real-room acceptance

- Install the published SDK version from npm and confirm a clean dependency resolution before performing release acceptance.
- Create and join through the backend proxy without exposing credentials.
- Join two participants and verify audio/video in both directions.
- Toggle microphone, camera, and screen share.
- Confirm participants remain audible when their video card is off-page.
- Exercise Bluetooth/speaker routing, interruptions, background/foreground, reconnect, participant leave, and room leave.
- Test emulator/simulator for automation and supported physical targets before release.
- Inspect release binaries and source maps for secrets.

## References

- [Package quick start](README.md)
- [Detailed React Native manual](README_DETAILED.md)
- [Custom components](CUSTOM-COMPONENTS.md)
- [React Native SDK guide](https://mediasfu.com/docs/sdks/react-native/)
- [Generated API references](https://mediasfu.com/docs/api-reference/)
- [MediaSFU Open](https://github.com/MediaSFU/MediaSFUOpen)
- [MediaSFU Sandbox](https://mediasfu.com/sandbox)
