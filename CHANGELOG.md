# Changelog

## 2.5.2 — 2026-10-18

- **Readable names on camera-off tiles.** Grid tiles for members with no camera or microphone (mini cards) now show the member's `displayName`, like video and audio cards already do, falling back to the member name. A room creator who set a display name no longer appears to others as their user name.

## 2.5.1 — 2026-10-14

- Requires `mediasfu-shared` 1.3.2 or later.
- **Unmute in audio-only rooms.** The microphone could not be turned on in rooms created with `mediaType: "audio"` (it showed a camera message). Audio-only rooms now only block cameras.
- **Readable names.** Video and audio cards, participant lists and the join notice show a member's `displayName` when the room has one, falling back to the member name.
- **Waiting rooms for API rooms** through `mediasfu-shared`'s `joinRoomOnMediaSFU`: a guest waits until the host lets them in.
- New room-create options: `region` (`asia`, `europe`, `us`, `general`), `regionStrict` (refuse instead of placing the room in another region) and `waitRoom`. Servers that do not support them ignore them.

## 2.5.0 — 2026-10-09

- Requires `mediasfu-shared` 1.3.0 or later.
- Screen-share audio: participants hear the sound of a shared tab or screen through a separate
  `<name> · Screen audio` card that appears while sound plays. It never counts as the sharer speaking, and tapping the
  card mutes it on that device only. New exports: `ScreenAudioPlayer`, `ScreenAudioPrompt`, `toggleScreenAudio`,
  `isScreenAudioProducer`.
- React Native web builds in Chrome, Edge, Opera or Brave on desktop can share screen audio, asking
  **Share audio too?** first. Room parameters add `updateScreenAudioMode('ask' | 'always' | 'never')` and
  `updateScreenAudioEnabled`. Android and iOS apps hear screen audio but do not share it.
- New streams from a busy media node are taken from its backup node when the room has one, as the server directs.
- Clear join errors: `connectSocket` rejects with a `MediaSocketConnectError` (`phase`, `reason`, `stage`,
  `elapsedMs`, `online`, `retryable`), and the welcome and pre-join pages show the reason, for example rejected
  credentials or an account without meeting minutes. Refusals that cannot succeed are not retried, and offline or
  unreachable-server attempts no longer count toward the ten-attempt join limit. New exports:
  `describeMediaSocketError`, `isRetryableMediaSocketError`, `isMediaSocketConnectError`.
- `MiniAudio` accepts optional `onPress` and `accessibilityLabel` props.
- Bring your own screen capture: `uiOverrides.screenCapture` (a `getDisplayMedia`-style function or
  `{ getDisplayMedia, supportsAudio, onStop }`) lets Android and iOS apps share the screen with their own native
  capture; the SDK publishes the returned stream as a normal screen share. `uiOverrides.startShareScreen` replaces or
  wraps the whole start flow. Without either, behaviour is unchanged.

## 2.4.6 — 2026-09-30

- Disable camera simulcast automatically for chat and capacity-two rooms, with an explicit `simulcastOff` opt-out for larger rooms and an optional `roomCapacity` hint.
- Preserve full-resolution encoder limits in single-encoding mode and restore the original preset for later room updates.
- Remove the recording-only 20% camera bitrate and initial-bitrate uplift; screen-sharing and audio presets are unchanged.


## 2.4.4 — 2026-09-21

- Requires `mediasfu-shared` 1.2.3 or later so failed and disconnected consume sockets are disposed and reconnects no longer require an app restart.
- Native virtual backgrounds remain intentionally separate from the browser canvas compositor; no unsupported blur control is exposed.

## 2.4.3 — 2026-09-16

- Requires `mediasfu-shared` 1.2.2 or later. That release reports the room layout to the recording service as soon as a recording starts, instead of waiting for the next participant or screen change.
