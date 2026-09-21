# Changelog

## 2.4.4 — 2026-09-21

- Requires `mediasfu-shared` 1.2.3 or later so failed and disconnected consume sockets are disposed and reconnects no longer require an app restart.
- Native virtual backgrounds remain intentionally separate from the browser canvas compositor; no unsupported blur control is exposed.

## 2.4.3 — 2026-09-16

- Requires `mediasfu-shared` 1.2.2 or later. That release reports the room layout to the recording service as soon as a recording starts, instead of waiting for the next participant or screen change.
