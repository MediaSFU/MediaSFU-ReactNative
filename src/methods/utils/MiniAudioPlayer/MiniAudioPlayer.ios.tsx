import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
// import { AudioContext } from 'standardized-audio-context';
import {
  RTCView,
} from '../webrtc/webrtc';

import {
  ReUpdateInterType,
  UpdateParticipantAudioDecibelsType,
  ReUpdateInterParameters,
  BreakoutParticipant,
  Participant,
  MediaStream,
} from '../../../@types/types';
import { Consumer } from 'mediasoup-client/lib/types';

export interface MiniAudioPlayerParameters extends ReUpdateInterParameters {
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  limitedBreakRoom: BreakoutParticipant[];

  // mediasfu functions
  reUpdateInter: ReUpdateInterType;
  updateParticipantAudioDecibels: UpdateParticipantAudioDecibelsType;

  getUpdatedAllParams: () => MiniAudioPlayerParameters;
  [key: string]: any;
}

export interface MiniAudioPlayerOptions {
  stream: MediaStream | null;
  remoteProducerId: string;
  consumer: Consumer;
  parameters: MiniAudioPlayerParameters;
  MiniAudioComponent?: React.ComponentType<any>;
  miniAudioProps?: Record<string, any>;
}

export type MiniAudioPlayerType = (
  options: MiniAudioPlayerOptions
) => JSX.Element;

/**
 * MiniAudioPlayer component is a React Native component for playing audio streams
 * and optionally a mini audio component for visualizing audio waveforms.
 *
 * @component
 * @param {MiniAudioPlayerOptions} props - The properties for the MiniAudioPlayer component.
 * @param {MediaStream | null} props.stream - The media stream to be played by the audio player.
 * @param {Consumer} props.consumer - The consumer object for consuming media.
 * @param {string} props.remoteProducerId - The ID of the remote producer.
 * @param {MiniAudioPlayerParameters} props.parameters - The parameters object containing various settings and methods.
 * @param {Function} props.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Function} props.parameters.reUpdateInter - Function to re-update interaction parameters.
 * @param {Function} props.parameters.updateParticipantAudioDecibels - Function to update participant audio decibels.
 * @param {boolean} props.parameters.breakOutRoomStarted - Flag indicating if the breakout room has started.
 * @param {boolean} props.parameters.breakOutRoomEnded - Flag indicating if the breakout room has ended.
 * @param {Array<BreakoutParticipant>} props.parameters.limitedBreakRoom - Array of limited breakout room participants.
 * @param {React.ComponentType} [props.MiniAudioComponent] - An optional component to render for audio visualization.
 * @param {Object} [props.miniAudioProps] - Additional properties to pass to the MiniAudioComponent.
 *
 * @returns {JSX.Element} The rendered MiniAudioPlayer component.
 *
 * @example
 * ```tsx
 * // Import and use MiniAudioPlayer in a React component
 * import { MiniAudioPlayer } from 'mediasfu-reactnative';
 *
 * const WaveformVisualizer = ({ stream }: { stream: MediaStream }) => (
 *   <canvas width='300' height='50' />
 * );
 *
 * const App = () => {
 *   const stream = useMediaStream(); // Custom hook to get MediaStream
 *   const parameters = {
 *     // Mocked parameters with required functions
 *     getUpdatedAllParams: () => updatedParameters,
 *     reUpdateInter: () => {},
 *     updateParticipantAudioDecibels: () => {},
 *     breakOutRoomStarted: false,
 *     breakOutRoomEnded: false,
 *     limitedBreakRoom: [],
 *   };
 *
 *   return (
 *     <MiniAudioPlayer
 *       stream={stream}
 *       consumer={consumer}
 *       remoteProducerId='producer123'
 *       parameters={parameters}
 *       MiniAudioComponent={WaveformVisualizer}
 *       miniAudioProps={{ color: 'blue' }}
 *     />
 *   );
 * };
 * ```
 */

const MiniAudioPlayer: React.FC<MiniAudioPlayerOptions> = ({
  stream,
  remoteProducerId,
  consumer,
  parameters,
  MiniAudioComponent,
  miniAudioProps,
}) => {
  const { getUpdatedAllParams } = parameters;

  parameters = getUpdatedAllParams();
  const {
    reUpdateInter,
    updateParticipantAudioDecibels,
    breakOutRoomStarted,
    breakOutRoomEnded,
    limitedBreakRoom,
  } = parameters;

  const [showWaveModal, setShowWaveModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const autoWaveCheck = useRef<boolean>(false);

  useEffect(() => {
    if (stream) {
      let consLow: boolean = false;
      let averageLoudness: number = 128;

      const intervalId = setInterval(() => {
        try {
          const receiver = consumer.rtpReceiver;
          receiver?.getStats().then((stats) => {
            stats.forEach((report) => {
              if (
                report.type === 'inbound-rtp' &&
                report.kind === 'audio' &&
                report.audioLevel
              ) {
                averageLoudness = 127.5 + report.audioLevel * 127.5;
              }
            });
          });
        } catch {
          // Do nothing
        }

        const updatedParams = getUpdatedAllParams();
        let {
          eventType,
          meetingDisplayType,
          shared,
          shareScreenStarted,
          dispActiveNames,
          adminNameStream,
          participants,
          activeSounds,
          autoWave,
          updateActiveSounds,
          paginatedStreams,
          currentUserPage,
        } = updatedParams;

        const participant = participants.find(
          (obj: Participant) => obj.audioID === remoteProducerId,
        );

        let audioActiveInRoom = true;
        if (participant) {
          if (breakOutRoomStarted && !breakOutRoomEnded) {
            if (
              participant.name
              && !limitedBreakRoom
                .map((obj) => obj.name)
                .includes(participant.name)
            ) {
              audioActiveInRoom = false;
            }
          }
        }

        if (meetingDisplayType !== 'video') {
          autoWaveCheck.current = true;
        }
        if (shared || shareScreenStarted) {
          autoWaveCheck.current = false;
        }

        if (participant) {
          setIsMuted(participant.muted ?? false);

          if (eventType !== 'chat' && eventType !== 'broadcast') {
            updateParticipantAudioDecibels({
              name: participant.name ?? '',
              averageLoudness,
              audioDecibels: updatedParams.audioDecibels,
              updateAudioDecibels: updatedParams.updateAudioDecibels,
            });
          }

          const inPage =
            paginatedStreams[currentUserPage]?.findIndex(
              (obj: any) => obj.name === participant.name
            ) ?? -1;

          if (
            participant.name
            && !dispActiveNames.includes(participant.name)
            && inPage === -1
          ) {
            autoWaveCheck.current = false;
            if (!adminNameStream) {
              const adminParticipant = participants.find(
                (obj: any) => obj.islevel === '2',
              );
              adminNameStream = adminParticipant ? adminParticipant.name : '';
            }

            if (participant.name === adminNameStream) {
              autoWaveCheck.current = true;
            }
          } else {
            autoWaveCheck.current = true;
          }

          if (
            participant.videoID
            || autoWaveCheck.current
            || (breakOutRoomStarted && !breakOutRoomEnded && audioActiveInRoom)
          ) {
            setShowWaveModal(false);

            if (averageLoudness > 127.5) {
              if (participant.name && !activeSounds.includes(participant.name)) {
                activeSounds.push(participant.name);
                consLow = false;

                if (!(shareScreenStarted || shared) || participant.videoID) {
                  if (
                    eventType !== 'chat'
                    && eventType !== 'broadcast'
                    && participant.name
                  ) {
                    reUpdateInter({
                      name: participant.name ?? '',
                      add: true,
                      average: averageLoudness,
                      parameters: updatedParams,
                    });
                  }
                }
              }
            } else if (participant.name && activeSounds.includes(participant.name) && consLow) {
              activeSounds.splice(activeSounds.indexOf(participant.name), 1);
              if (!(shareScreenStarted || shared) || participant.videoID) {
                if (
                  eventType !== 'chat'
                    && eventType !== 'broadcast'
                    && participant.name
                ) {
                  reUpdateInter({
                    name: participant.name ?? '',
                    average: averageLoudness,
                    parameters: updatedParams,
                  });
                }
              }
            } else {
              consLow = true;
            }
          } else if (averageLoudness > 127.5) {
            if (!autoWave) {
              setShowWaveModal(false);
            } else {
              setShowWaveModal(true);
            }

            if (participant.name && !activeSounds.includes(participant.name)) {
              activeSounds.push(participant.name);
            }
            if ((shareScreenStarted || shared) && !participant.videoID) {
              /* empty */
            } else if (
              eventType !== 'chat'
                  && eventType !== 'broadcast'
                  && participant.name
            ) {
              reUpdateInter({
                name: participant.name,
                add: true,
                average: averageLoudness,
                parameters: updatedParams,
              });
            }
          } else {
            setShowWaveModal(false);
            if (participant.name && activeSounds.includes(participant.name)) {
              activeSounds.splice(activeSounds.indexOf(participant.name), 1);
            }
            if ((shareScreenStarted || shared) && !participant.videoID) {
              /* empty */
            } else if (
              eventType !== 'chat'
                  && eventType !== 'broadcast'
                  && participant.name
            ) {
              reUpdateInter({
                name: participant.name,
                average: averageLoudness,
                parameters: updatedParams,
              });
            }
          }

          updateActiveSounds(activeSounds);
        } else {
          setShowWaveModal(false);
          setIsMuted(true);
        }
      }, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [stream]);

  const renderMiniAudioComponent = (): JSX.Element | null => {
    if (MiniAudioComponent) {
      return (
        <MiniAudioComponent
          showWaveform={showWaveModal}
          visible={showWaveModal && !isMuted}
          {...miniAudioProps}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* RTCView for displaying the audio stream */}
      {!isMuted && stream && Platform.OS === 'web' ? (
        <RTCView stream={stream} style={styles.audioPlayer} />
      ) : !isMuted && stream ? (
        <RTCView streamURL={stream?.toURL()} style={styles.audioPlayer} />
      ) : null}
      {renderMiniAudioComponent()}
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

export default MiniAudioPlayer;
