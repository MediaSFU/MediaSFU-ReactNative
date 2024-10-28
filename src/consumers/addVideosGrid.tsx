import MiniCard from '../components/displayComponents/MiniCard';
import VideoCard from '../components/displayComponents/VideoCard';
import AudioCard from '../components/displayComponents/AudioCard';
// import { RTCView } from "../methods/utils/webrtc/webrtc";

import {
  Participant, Stream, UpdateMiniCardsGridType, UpdateMiniCardsGridParameters, AudioCardParameters, EventType,
  MediaStream as MediaStreamType,
} from '../@types/types';

export interface AddVideosGridParameters extends UpdateMiniCardsGridParameters, AudioCardParameters {
  eventType: EventType;
  updateAddAltGrid: (addAltGrid: boolean) => void;
  ref_participants: Participant[];
  islevel: string;
  videoAlreadyOn: boolean;
  localStreamVideo: MediaStreamType | null;
  keepBackground: boolean;
  virtualStream: MediaStreamType | null;
  forceFullDisplay: boolean;
  otherGridStreams: JSX.Element[][];
  updateOtherGridStreams: (otherGridStreams: JSX.Element[][]) => void;

  // mediasfu functions
  updateMiniCardsGrid: UpdateMiniCardsGridType;
  getUpdatedAllParams: () => AddVideosGridParameters;
  [key: string]: any;
}

export interface AddVideosGridOptions {
  mainGridStreams: (Stream | Participant)[];
  altGridStreams: (Stream | Participant)[];
  numtoadd: number;
  numRows: number;
  numCols: number;
  actualRows: number;
  lastrowcols: number;
  removeAltGrid: boolean;
  parameters: AddVideosGridParameters;
}

// Export the type definition for the function
export type AddVideosGridType = (options: AddVideosGridOptions) => Promise<void>;

export async function addVideosGrid({
  mainGridStreams,
  altGridStreams,
  numtoadd,
  numRows,
  numCols,
  actualRows,
  lastrowcols,
  removeAltGrid,
  parameters,
}: AddVideosGridOptions): Promise<void> {
  const { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  const {
    eventType,
    updateAddAltGrid,
    ref_participants,
    islevel,
    videoAlreadyOn,
    localStreamVideo,
    keepBackground,
    virtualStream,
    forceFullDisplay,
    otherGridStreams,
    updateOtherGridStreams,
    updateMiniCardsGrid,
  } = parameters;

  const newComponents: JSX.Element[][] = [[], []];
  let participant: any;
  let remoteProducerId: string = '';

  numtoadd = mainGridStreams.length;

  if (removeAltGrid) {
    updateAddAltGrid(false);
  }

  // Add participants to the main grid
  for (let i = 0; i < numtoadd; i++) {
    participant = mainGridStreams[i];
    remoteProducerId = participant.producerId;

    const pseudoName = !remoteProducerId || remoteProducerId === '';

    if (pseudoName) {
      remoteProducerId = participant.name;

      if (participant.audioID) {
        newComponents[0].push(
          <AudioCard
            key={`audio-${participant.id}`}
            name={participant.name || ''}
            barColor="red"
            textColor="white"
            customStyle={{
              backgroundColor: 'transparent',
              borderWidth: eventType !== 'broadcast' ? 2 : 0,
              borderColor: 'black',
            }}
            controlsPosition="topLeft"
            infoPosition="topRight"
            roundedImage
            parameters={parameters}
            backgroundColor="transparent"
            showControls={eventType !== 'chat'}
            participant={participant}
          />,
        );
      } else {
        newComponents[0].push(
          <MiniCard
            key={`mini-${participant.id}`}
            initials={participant.name}
            fontSize={20}
            customStyle={{
              backgroundColor: 'transparent',
              borderWidth: eventType !== 'broadcast' ? 2 : 0,
              borderColor: 'black',
            }}
          />,
        );
      }
    } else if (remoteProducerId === 'youyou' || remoteProducerId === 'youyouyou') {
      let name = 'You';
      if (islevel === '2' && eventType !== 'chat') {
        name = 'You (Host)';
      }

      if (!videoAlreadyOn) {
        newComponents[0].push(
          <MiniCard
            key="mini-you"
            initials={name}
            fontSize={20}
            customStyle={{
              backgroundColor: 'transparent',
              borderWidth: eventType !== 'broadcast' ? 2 : 0,
              borderColor: 'black',
            }}
          />,
        );
      } else {
        participant = {
          id: 'youyouyou',
          stream:
              keepBackground && virtualStream
                ? virtualStream
                : localStreamVideo,
          name: 'youyouyou',
        };

        newComponents[0].push(
          <VideoCard
            key="video-you"
            videoStream={participant.stream || new MediaStream()}
            remoteProducerId={participant.stream?.id || ''}
            eventType={eventType}
            forceFullDisplay={
                eventType === 'webinar' ? false : forceFullDisplay
              }
            customStyle={{
              borderWidth: eventType !== 'broadcast' ? 2 : 0,
              borderColor: 'black',
            }}
            participant={participant}
            backgroundColor="transparent"
            showControls={false}
            showInfo={false}
            name={participant.name}
            doMirror
            parameters={parameters}
          />,
        );
      }
    } else {
      const participant_ = ref_participants.find(
        (obj: Participant) => obj.videoID === remoteProducerId,
      );
      if (participant_) {
        newComponents[0].push(
          <VideoCard
            key={`video-${participant_.id}`}
            videoStream={participant.stream || new MediaStream()}
            remoteProducerId={remoteProducerId || ''}
            eventType={eventType}
            forceFullDisplay={forceFullDisplay}
            customStyle={{
              borderWidth: eventType !== 'broadcast' ? 2 : 0,
              borderColor: 'black',
            }}
            participant={participant_}
            backgroundColor="transparent"
            showControls={eventType !== 'chat'}
            showInfo
            name={participant_.name || ''}
            doMirror={false}
            parameters={parameters}
          />,
        );
      }
    }

    if (i === numtoadd - 1) {
      otherGridStreams[0] = newComponents[0];

      await updateMiniCardsGrid({
        rows: numRows,
        cols: numCols,
        defal: true,
        actualRows,
        parameters,
      });

      updateOtherGridStreams(otherGridStreams);

      await updateMiniCardsGrid({
        rows: numRows,
        cols: numCols,
        defal: true,
        actualRows,
        parameters,
      });
    }
  }

  // Handle the alternate grid streams
  if (!removeAltGrid) {
    for (let i = 0; i < altGridStreams.length; i++) {
      participant = altGridStreams[i];
      remoteProducerId = participant.producerId;

      const pseudoName = !remoteProducerId || remoteProducerId === '';

      if (pseudoName) {
        if (participant.audioID) {
          newComponents[1].push(
            <AudioCard
              key={`audio-alt-${participant.id}`}
              name={participant.name}
              barColor="red"
              textColor="white"
              customStyle={{
                backgroundColor: 'transparent',
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              }}
              controlsPosition="topLeft"
              infoPosition="topRight"
              roundedImage
              parameters={parameters}
              backgroundColor="transparent"
              showControls={eventType !== 'chat'}
              participant={participant}
            />,
          );
        } else {
          newComponents[1].push(
            <MiniCard
              key={`mini-alt-${participant.id}`}
              initials={participant.name}
              fontSize={20}
              customStyle={{
                backgroundColor: 'transparent',
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              }}
            />,
          );
        }
      } else {
        const participant_ = ref_participants.find(
          (obj: Participant) => obj.videoID === remoteProducerId,
        );
        if (participant_) {
          newComponents[1].push(
            <VideoCard
              key={`video-alt-${participant_.id}`}
              videoStream={participant.stream || new MediaStream()}
              remoteProducerId={remoteProducerId || ''}
              eventType={eventType}
              forceFullDisplay={forceFullDisplay}
              customStyle={{
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              }}
              participant={participant_}
              backgroundColor="transparent"
              showControls={eventType !== 'chat'}
              showInfo
              name={participant.name}
              doMirror={false}
              parameters={parameters}
            />,
          );
        }
      }

      if (i === altGridStreams.length - 1) {
        otherGridStreams[1] = newComponents[1];

        await updateMiniCardsGrid({
          rows: 1,
          cols: lastrowcols,
          defal: false,
          actualRows,
          parameters,
        });

        updateOtherGridStreams(otherGridStreams);

        await updateMiniCardsGrid({
          rows: numRows,
          cols: numCols,
          defal: true,
          actualRows,
          parameters,
        });
      }
    }
  } else {
    updateAddAltGrid(false);
    otherGridStreams[1] = [];

    await updateMiniCardsGrid({
      rows: 0,
      cols: 0,
      defal: false,
      actualRows,
      parameters,
    });

    updateOtherGridStreams(otherGridStreams);

    await updateMiniCardsGrid({
      rows: numRows,
      cols: numCols,
      defal: true,
      actualRows,
      parameters,
    });
  }
}
