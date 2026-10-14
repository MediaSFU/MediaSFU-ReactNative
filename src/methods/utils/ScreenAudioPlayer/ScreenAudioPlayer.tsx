import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { RTCView } from '../webrtc/webrtc';
import MiniAudio, { MiniAudioOptions } from '../../../components/displayComponents/MiniAudio';
import { MediaStream } from '../../../@types/types';

export interface ScreenAudioPlayerOptions {
  /** Stream holding the screen-share audio track. */
  stream: MediaStream | null;
  /** Producer id of the screen-share audio (used to remove the player when the share stops). */
  remoteProducerId: string;
  /** The consumer, used for its audio level (the card shows while sound plays, like other audio cards). */
  consumer?: { rtpReceiver?: { getStats: () => Promise<any> } | null } | null;
  /** Name of the participant sharing the screen. */
  ownerName?: string;
  /** Listening volume, 0..1 (default 1). Native only; on the web use the device volume or mute the card. */
  volume?: number;
  /** Card component (default MiniAudio, or the app's miniAudioComponent). */
  MiniAudioComponent?: React.ComponentType<MiniAudioOptions>;
  /** Extra props for the card. */
  miniAudioProps?: Partial<MiniAudioOptions>;
  /** Hide the card entirely (audio still plays). */
  hideCard?: boolean;
}

export type ScreenAudioPlayerType = (options: ScreenAudioPlayerOptions) => JSX.Element;

const LEVEL_THRESHOLD = 0.01;
const LEVEL_POLL_MS = 1000;

const audioTrackOf = (stream: MediaStream | null): any => {
  const source = stream as any;
  if (!source) {return null;}
  const tracks = typeof source.getAudioTracks === 'function' ? source.getAudioTracks() : source.getTracks?.();
  return tracks?.[0] ?? null;
};

/** Screen-audio card label: "<name> · Screen audio", plus "(muted)" while muted for this listener. */
export const screenAudioLabel = (ownerName: string | undefined, muted: boolean): string =>
  `${ownerName ? `${ownerName} · ` : ''}Screen audio${muted ? ' (muted)' : ''}`;

/**
 * Plays audio shared with a screen share. While it plays, it shows an audio card ("<name> · Screen audio") with a
 * waveform, like other audio-only sources; it never marks the sharer as speaking and never feeds the active-speaker or
 * audio-level logic. Tapping the card mutes or unmutes it for this listener only (the track is disabled locally).
 *
 * Works on Android, iOS and React Native Web. Native devices always hear screen audio; they cannot share it.
 *
 * @example
 * ```tsx
 * <ScreenAudioPlayer stream={stream} remoteProducerId={producerId} consumer={consumer} ownerName="Alice" />
 * ```
 */
const ScreenAudioPlayer: React.FC<ScreenAudioPlayerOptions> = ({
  stream,
  remoteProducerId,
  consumer,
  ownerName,
  volume = 1,
  MiniAudioComponent,
  miniAudioProps,
  hideCard = false,
}) => {
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);

  // Local mute: a disabled remote track plays silence on react-native-webrtc and in browsers.
  useEffect(() => {
    const track = audioTrackOf(stream);
    if (track) {track.enabled = !muted;}
  }, [stream, muted]);

  // react-native-webrtc's per-track gain (0..10, 1 = unchanged).
  useEffect(() => {
    const track = audioTrackOf(stream);
    if (Platform.OS !== 'web' && typeof track?._setVolume === 'function') {
      track._setVolume(Math.min(1, Math.max(0, Number.isFinite(volume) ? volume : 1)));
    }
  }, [stream, volume]);

  // Audio level from the receiver's stats; never fed to the speaking or audio-decibel logic.
  useEffect(() => {
    const receiver = consumer?.rtpReceiver;
    if (!stream || !receiver) {return;}
    let cancelled = false;
    const id = setInterval(() => {
      Promise.resolve()
        .then(() => receiver.getStats())
        .then((stats: any) => {
          let level = 0;
          stats?.forEach?.((report: any) => {
            if (report?.type === 'inbound-rtp' && report.kind === 'audio' && typeof report.audioLevel === 'number') {
              level = report.audioLevel;
            }
          });
          if (!cancelled) {setActive(level > LEVEL_THRESHOLD);}
        })
        .catch(() => {});
    }, LEVEL_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [stream, consumer]);

  const Card = MiniAudioComponent ?? MiniAudio;
  const label = screenAudioLabel(ownerName, muted);

  return (
    <View style={styles.container} testID={`screen-audio-${remoteProducerId}`}>
      {stream && Platform.OS === 'web' ? (
        <RTCView stream={stream} style={styles.audioPlayer} />
      ) : stream ? (
        <RTCView streamURL={(stream as any).toURL?.()} style={styles.audioPlayer} />
      ) : null}
      {!hideCard && (
        <Card
          name={label}
          visible={active || muted}
          showWaveform={active && !muted}
          imageSource="https://mediasfu.com/images/logo192.png"
          roundedImage
          customStyle={{ backgroundColor: 'gray' }}
          barColor="white"
          textColor="white"
          overlayPosition="topRight"
          accessibilityLabel={muted ? 'Unmute screen audio' : 'Mute screen audio'}
          {...miniAudioProps}
          onPress={() => {
            setMuted((value) => !value);
            miniAudioProps?.onPress?.();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 9,
    zIndex: 9,
  },
  audioPlayer: {
    width: 0,
    height: 0,
  },
});

export default ScreenAudioPlayer;
