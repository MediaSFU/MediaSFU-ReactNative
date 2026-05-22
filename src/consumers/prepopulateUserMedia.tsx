import React from 'react';
import MiniCard from '../components/displayComponents/MiniCard';
import VideoCard from '../components/displayComponents/VideoCard';
import AudioCard from '../components/displayComponents/AudioCard';
// import { RTCView } from "../methods/utils/webrtc/webrtc";
import {
  Participant, Stream, AudioCardParameters, EventType,
  CustomVideoCardType, CustomAudioCardType, CustomMiniCardType,
} from '../@types/types';
import type { MediaStream } from '../@types/types';
import { buildMainHostCardPlan, buildMainScreenState, buildPrepopulateUserMediaPlan, buildScreenShareHostCardPlan } from 'mediasfu-shared';

export interface PrepopulateUserMediaParameters extends AudioCardParameters {

  participants: Participant[];
  allVideoStreams: (Stream | Participant)[];
  islevel: string;
  member: string;
  shared: boolean;
  shareScreenStarted: boolean;
  eventType: EventType;
  screenId?: string;
  forceFullDisplay: boolean;
  updateMainWindow: boolean;
  mainScreenFilled: boolean;
  adminOnMainScreen: boolean;
  mainScreenPerson: string;
  videoAlreadyOn: boolean;
  audioAlreadyOn: boolean;
  oldAllStreams: (Stream | Participant)[];
  checkOrientation: () => string;
  screenForceFullDisplay: boolean;
  localStreamScreen: MediaStream | null;
  remoteScreenStream: Stream[];
  localStreamVideo: MediaStream | null;
  mainHeightWidth: number;
  isWideScreen: boolean;
  localUIMode: boolean;
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  virtualStream: MediaStream | null;
  keepBackground: boolean;
  annotateScreenStream: boolean;
  updateMainScreenPerson: (person: string) => void;
  updateMainScreenFilled: (filled: boolean) => void;
  updateAdminOnMainScreen: (admin: boolean) => void;
  updateMainHeightWidth: (heightWidth: number) => void;
  updateScreenForceFullDisplay: (force: boolean) => void;
  updateUpdateMainWindow: (update: boolean) => void;
  updateMainGridStream: (components: JSX.Element[]) => void;

  // Custom component props
  customVideoCard?: CustomVideoCardType;
  customAudioCard?: CustomAudioCardType;
  customMiniCard?: CustomMiniCardType;

  // Override-provided component references
  videoCardComponent?: React.ComponentType<React.ComponentProps<typeof VideoCard>>;
  audioCardComponent?: React.ComponentType<React.ComponentProps<typeof AudioCard>>;
  miniCardComponent?: React.ComponentType<React.ComponentProps<typeof MiniCard>>;

  translationTranscripts?: Array<{
    speakerId?: string;
    speakerName?: string;
    translatedText?: string;
    originalText?: string;
    timestamp?: number;
  }>;
  showSubtitlesOnCards?: boolean;

  // mediasfu functions
  getUpdatedAllParams: () => PrepopulateUserMediaParameters;
  [key: string]: any;
}

export interface PrepopulateUserMediaOptions {
  name: string;
  parameters: PrepopulateUserMediaParameters;
}

// Export the type definition for the function
export type PrepopulateUserMediaType = (options: PrepopulateUserMediaOptions) => Promise<JSX.Element[] | void>;

/**
 * Prepopulates the user media based on the provided options.
 *
 * @param {PrepopulateUserMediaOptions} options - The options for prepopulating user media.
 * @param {string} options.name - The name of the user.
 * @param {Parameters} options.parameters - The parameters for prepopulating user media.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Array<Participant>} options.parameters.participants - List of participants.
 * @param {Array<Stream>} options.parameters.allVideoStreams - List of all video streams.
 * @param {string} options.parameters.islevel - The level of the user.
 * @param {string} options.parameters.member - The member name.
 * @param {boolean} options.parameters.shared - Indicates if the screen is shared.
 * @param {boolean} options.parameters.shareScreenStarted - Indicates if screen sharing has started.
 * @param {string} options.parameters.eventType - The type of event.
 * @param {string} options.parameters.screenId - The screen ID.
 * @param {boolean} options.parameters.forceFullDisplay - Indicates if full display is forced.
 * @param {Function} options.parameters.updateMainWindow - Function to update the main window.
 * @param {boolean} options.parameters.mainScreenFilled - Indicates if the main screen is filled.
 * @param {boolean} options.parameters.adminOnMainScreen - Indicates if admin is on the main screen.
 * @param {string} options.parameters.mainScreenPerson - The person on the main screen.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if the video is already on.
 * @param {boolean} options.parameters.audioAlreadyOn - Indicates if the audio is already on.
 * @param {Array<Stream>} options.parameters.oldAllStreams - List of old all streams.
 * @param {Function} options.parameters.checkOrientation - Function to check orientation.
 * @param {boolean} options.parameters.screenForceFullDisplay - Indicates if screen force full display is enabled.
 * @param {Stream} options.parameters.localStreamScreen - The local screen stream.
 * @param {Array<Stream>} options.parameters.remoteScreenStream - List of remote screen streams.
 * @param {Stream} options.parameters.localStreamVideo - The local video stream.
 * @param {number} options.parameters.mainHeightWidth - The main height and width.
 * @param {boolean} options.parameters.isWideScreen - Indicates if the screen is wide.
 * @param {boolean} options.parameters.localUIMode - Indicates if local UI mode is enabled.
 * @param {boolean} options.parameters.whiteboardStarted - Indicates if whiteboard has started.
 * @param {boolean} options.parameters.whiteboardEnded - Indicates if whiteboard has ended.
 * @param {Stream} options.parameters.virtualStream - The virtual stream.
 * @param {boolean} options.parameters.keepBackground - Indicates if background should be kept.
 * @param {boolean} options.parameters.annotateScreenStream - The annotate screen stream.
 * @param {Function} options.parameters.updateMainScreenPerson - Function to update the main screen person.
 * @param {Function} options.parameters.updateMainScreenFilled - Function to update if the main screen is filled.
 * @param {Function} options.parameters.updateAdminOnMainScreen - Function to update if admin is on the main screen.
 * @param {Function} options.parameters.updateMainHeightWidth - Function to update the main height and width.
 * @param {Function} options.parameters.updateScreenForceFullDisplay - Function to update screen force full display.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window update status.
 * @param {Function} options.parameters.updateMainGridStream - Function to update the main grid stream.
 *
 * @returns {Promise<JSX.Element[] | void>} A promise that resolves to an array of JSX elements or void.
 *
 * @example
 * ```typescript
 * const elements = await prepopulateUserMedia({
 *   name: "John Doe",
 *   parameters: {
 *     participants: [],
 *     allVideoStreams: [],
 *     islevel: "1",
 *     member: "John",
 *     shared: false,
 *     shareScreenStarted: false,
 *     eventType: "conference",
 *     screenId: "screen1",
 *     forceFullDisplay: true,
 *     updateMainWindow: true,
 *     mainScreenFilled: false,
 *     adminOnMainScreen: false,
 *     mainScreenPerson: "Jane",
 *     videoAlreadyOn: false,
 *     audioAlreadyOn: false,
 *     oldAllStreams: [],
 *     checkOrientation: () => "portrait",
 *     screenForceFullDisplay: false,
 *     localStreamScreen: null,
 *     remoteScreenStream: [],
 *     localStreamVideo: null,
 *     mainHeightWidth: 800,
 *     isWideScreen: true,
 *     localUIMode: false,
 *     whiteboardStarted: false,
 *     whiteboardEnded: false,
 *     virtualStream: null,
 *     keepBackground: false,
 *     annotateScreenStream: false,
 *     updateMainScreenPerson: (person) => console.log(person),
 *     updateMainScreenFilled: (filled) => console.log(filled),
 *     updateAdminOnMainScreen: (admin) => console.log(admin),
 *     updateMainHeightWidth: (heightWidth) => console.log(heightWidth),
 *     updateScreenForceFullDisplay: (force) => console.log(force),
 *     updateUpdateMainWindow: (update) => console.log(update),
 *     updateMainGridStream: (components) => console.log(components),
 *   },
 * });
 * ```
 */

export async function prepopulateUserMedia({
  name,
  parameters,
}: PrepopulateUserMediaOptions): Promise<JSX.Element[] | void> {
  try {
    // Destructure parameters

    const { getUpdatedAllParams } = parameters;
    parameters = getUpdatedAllParams();

    let {
      participants,
      allVideoStreams,
      islevel,
      member,
      shared,
      shareScreenStarted,
      eventType,
      screenId,
      forceFullDisplay,
      updateMainWindow,
      mainScreenFilled,
      adminOnMainScreen,
      mainScreenPerson,
      videoAlreadyOn,
      audioAlreadyOn,
      oldAllStreams,
      checkOrientation,
      screenForceFullDisplay,

      localStreamScreen,
      remoteScreenStream,
      localStreamVideo,
      mainHeightWidth,
      isWideScreen,
      localUIMode,
      whiteboardStarted,
      whiteboardEnded,

      virtualStream,
      keepBackground,
      annotateScreenStream,

      updateMainScreenPerson,
      updateMainScreenFilled,
      updateAdminOnMainScreen,
      updateMainHeightWidth,
      updateScreenForceFullDisplay,
      updateUpdateMainWindow,
      updateMainGridStream,

      // Custom component props
      customVideoCard,
      customAudioCard,
      customMiniCard,
      videoCardComponent,
      audioCardComponent,
      miniCardComponent,
      translationTranscripts = [],
      showSubtitlesOnCards = true,
    } = parameters;

    const getSubtitleForSpeaker = (
      speakerId: string,
      speakerName?: string,
    ): string | null => {
      if (!showSubtitlesOnCards || !Array.isArray(translationTranscripts)) {
        return null;
      }

      const now = Date.now();
      const ttlMs = 8000;
      for (let i = translationTranscripts.length - 1; i >= 0; i -= 1) {
        const entry = translationTranscripts[i];

        if (!entry) continue;
        const matches =
          (speakerId && entry.speakerId === speakerId)
          || (speakerName && entry.speakerName === speakerName);
        if (!matches) continue;

        if (!entry.timestamp || now - entry.timestamp > ttlMs) {
          continue;
        }

        return entry.translatedText || entry.originalText || null;
      }

      return null;
    };

    const VideoCardComponentOverride =
      (videoCardComponent ?? VideoCard) as React.ComponentType<React.ComponentProps<typeof VideoCard>>;
    const AudioCardComponentOverride =
      (audioCardComponent ?? AudioCard) as React.ComponentType<React.ComponentProps<typeof AudioCard>>;
    const MiniCardComponentOverride =
      (miniCardComponent ?? MiniCard) as React.ComponentType<React.ComponentProps<typeof MiniCard>>;
    const isDarkMode = typeof parameters?.isDarkModeValue === 'boolean'
      ? parameters.isDarkModeValue
      : true;
    const participantCardTextColor = isDarkMode ? '#f8fafc' : '#0f172a';

    const buildVideoCard = ({
      key,
      videoStream,
      remoteProducerId = '',
      eventType: cardEventType,
      forceFullDisplay: cardForceFullDisplay = false,
      customStyle,
      participant: cardParticipant,
      backgroundColor,
      showControls = false,
      showInfo = true,
      name = '',
      doMirror = false,
    }: {
      key: string;
      videoStream: MediaStream | null;
      remoteProducerId?: string;
      eventType: EventType;
      forceFullDisplay?: boolean;
      customStyle?: React.CSSProperties;
      participant: Participant;
      backgroundColor?: string;
      showControls?: boolean;
      showInfo?: boolean;
      name?: string;
      doMirror?: boolean;
    }) => {
      const subtitle = getSubtitleForSpeaker(
        cardParticipant.id || '',
        cardParticipant.name,
      );

      if (customVideoCard) {
        return React.createElement(customVideoCard as any, {
          key,
          videoStream: videoStream || new MediaStream(),
          remoteProducerId,
          eventType: cardEventType,
          forceFullDisplay: cardForceFullDisplay,
          customStyle,
          participant: cardParticipant,
          backgroundColor,
          showControls,
          showInfo,
          name,
          doMirror,
          liveSubtitleText: subtitle,
          showSubtitles: showSubtitlesOnCards,
          parameters,
        });
      }

      return (
        <VideoCardComponentOverride
          key={key}
          videoStream={videoStream}
          remoteProducerId={remoteProducerId}
          eventType={cardEventType}
          forceFullDisplay={cardForceFullDisplay}
          customStyle={customStyle as any}
          participant={cardParticipant}
          backgroundColor={backgroundColor}
          showControls={showControls}
          showInfo={showInfo}
          name={name}
          doMirror={doMirror}
          liveSubtitleText={subtitle}
          showSubtitles={showSubtitlesOnCards}
          {...({ parameters } as any)}
        />
      );
    };

    const buildAudioCard = ({
      key,
      name,
      barColor = 'red',
      textColor = 'white',
      customStyle,
      roundedImage = true,
      backgroundColor = 'transparent',
      participant: cardParticipant,
    }: {
      key: string;
      name: string;
      barColor?: string;
      textColor?: string;
      customStyle?: React.CSSProperties;
      roundedImage?: boolean;
      backgroundColor?: string;
      participant: Participant;
    }) => {
      const subtitle = getSubtitleForSpeaker(
        cardParticipant.id || '',
        cardParticipant.name,
      );

      if (customAudioCard) {
        return React.createElement(customAudioCard as any, {
          key,
          name,
          barColor,
          textColor,
          imageSource: '',
          roundedImage,
          imageStyle: {},
          liveSubtitleText: subtitle,
          showSubtitles: showSubtitlesOnCards,
          parameters,
        });
      }

      return (
        <AudioCardComponentOverride
          key={key}
          name={name}
          barColor={barColor}
          textColor={textColor}
          customStyle={customStyle as any}
          controlsPosition="topLeft"
          infoPosition="topRight"
          roundedImage={roundedImage}
          parameters={parameters}
          showControls={false}
          backgroundColor={backgroundColor}
          participant={cardParticipant}
          liveSubtitleText={subtitle}
          showSubtitles={showSubtitlesOnCards}
        />
      );
    };

    const buildMiniCard = ({
      key,
      initials,
      fontSize = 20,
      borderColor,
    }: {
      key: string;
      initials: string;
      fontSize?: number;
      borderColor?: string;
    }) => {
      if (customMiniCard) {
        return React.createElement(customMiniCard as any, {
          key,
          initials,
          fontSize,
          name: initials,
          showVideoIcon: false,
          showAudioIcon: false,
          imageSource: '',
          roundedImage: true,
          imageStyle: {},
          parameters,
        });
      }

      return (
        <MiniCardComponentOverride
          key={key}
          initials={initials}
          fontSize={fontSize}
          customStyle={{
            backgroundColor: 'transparent',
            borderColor: borderColor,
          } as any}
          parameters={parameters}
        />
      );
    };

    const applyMainScreenState = ({
      filled,
      adminOnMainScreen: nextAdminOnMainScreen,
      mainScreenPerson: nextMainScreenPerson,
    }: {
      filled: boolean;
      adminOnMainScreen: boolean;
      mainScreenPerson: string;
    }) => {
      mainScreenFilled = filled;
      adminOnMainScreen = nextAdminOnMainScreen;
      mainScreenPerson = nextMainScreenPerson;

      updateMainScreenFilled(mainScreenFilled);
      updateAdminOnMainScreen(adminOnMainScreen);
      updateMainScreenPerson(mainScreenPerson);
    };

    const renderMainHostCard = ({
      plan,
      host,
    }: {
      plan: ReturnType<typeof buildMainHostCardPlan<Stream>>;
      host: Participant;
    }) => {
      if (plan.kind === 'audio') {
        try {
          newComponent.push(
            buildAudioCard({
              key: plan.key,
              name: plan.name,
              barColor: 'red',
              textColor: participantCardTextColor,
              customStyle: {
                backgroundColor: 'transparent',
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              },
              roundedImage: true,
              backgroundColor: 'transparent',
              participant: host,
            }),
          );

          updateMainGridStream(newComponent);
        } catch {
        }

        applyMainScreenState(plan.state);
        return;
      }

      if (plan.kind === 'mini') {
        try {
          newComponent.push(
            buildMiniCard({
              key: plan.key,
              initials: plan.initials || name,
              fontSize: 20,
              borderColor: eventType !== 'broadcast' ? 'black' : undefined,
            }),
          );

          updateMainGridStream(newComponent);
        } catch {
        }

        applyMainScreenState(plan.state);
        return;
      }

      try {
        newComponent.push(
          buildVideoCard({
            key: plan.key,
            videoStream: plan.videoStream || null,
            remoteProducerId: plan.remoteProducerId || '',
            eventType,
            forceFullDisplay,
            customStyle: {
              borderWidth: eventType !== 'broadcast' ? 2 : 0,
              borderColor: 'black',
            },
            participant: host,
            backgroundColor: 'rgba(217, 227, 234, 0.99)',
            showControls: false,
            showInfo: true,
            name: plan.name,
            doMirror: plan.doMirror || false,
          }),
        );

        updateMainGridStream(newComponent);
        applyMainScreenState(plan.state);
      } catch {
        // Handle video card creation error
      }
    };

    const renderNoHostCard = () => {
      try {
        newComponent.push(
          buildMiniCard({
            key: name,
            initials: name,
            fontSize: 20,
            borderColor: eventType !== 'broadcast' ? 'black' : undefined,
          }),
        );

        updateMainGridStream(newComponent);

        applyMainScreenState(buildMainScreenState({
          filled: false,
          adminOnMainScreen: false,
          mainScreenPerson: '',
        }));
      } catch {
        // Handle mini card creation error
      }
    };

    // If the event type is 'chat', return early
    if (eventType === 'chat') {
      return;
    }

    // Initialize variables
    let host: Participant | null = null;
    let hostStream: any;
    const newComponent: JSX.Element[] = [];

    const prepopulatePlan = buildPrepopulateUserMediaPlan<Participant, Stream>({
      participants,
      allVideoStreams: allVideoStreams as Stream[],
      member,
      islevel,
      shared,
      shareScreenStarted,
      eventType,
      screenId,
      whiteboardStarted,
      whiteboardEnded,
      remoteScreenStream,
      localStreamScreen,
      checkOrientation,
      isWideScreen,
      forceFullDisplay,
      includeWhiteboardAsScreenFlow: true,
    });

    if (prepopulatePlan.screenFlowActive) {
      if (eventType === 'conference') {
        if (mainHeightWidth === 0) {
          updateMainHeightWidth(84);
        }
      } else if (mainHeightWidth !== 84) {
        updateMainHeightWidth(84);
      }
    }

    screenForceFullDisplay = prepopulatePlan.screenForceFullDisplay;
    updateScreenForceFullDisplay(screenForceFullDisplay);

    host = prepopulatePlan.host as Participant | null;
    hostStream = prepopulatePlan.hostStream;

    if (prepopulatePlan.shouldUpdateAdminOnMainScreen) {
      adminOnMainScreen = prepopulatePlan.adminOnMainScreen;
      updateAdminOnMainScreen(adminOnMainScreen);
    }

    mainScreenPerson = prepopulatePlan.mainScreenPerson;
    updateMainScreenPerson(mainScreenPerson);

    if (prepopulatePlan.shouldReturnEarly) {
      return;
    }

    // If host is not null, check if host videoIsOn
    if (host) {
      // Populate the main screen with the host video
      if (shareScreenStarted || shared) {
        forceFullDisplay = screenForceFullDisplay;
        const screenShareHostCardPlan = buildScreenShareHostCardPlan({
          hostName: host.name || '',
          hostScreenID: host.ScreenID,
          hostIsAdmin: host.islevel === '2',
          shared,
          hostStream,
          screenForceFullDisplay,
          annotateScreenStream,
        });

        if (whiteboardStarted && !whiteboardEnded) {
          // Whiteboard is active
        } else {
          newComponent.push(
            buildVideoCard({
              key: screenShareHostCardPlan.key,
              videoStream: screenShareHostCardPlan.videoStream,
              remoteProducerId: screenShareHostCardPlan.remoteProducerId,
              eventType: eventType,
              forceFullDisplay: screenShareHostCardPlan.forceFullDisplay,
              customStyle: {
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              },
              participant: host,
              backgroundColor: 'rgba(217, 227, 234, 0.99)',
              showControls: false,
              showInfo: true,
              name: screenShareHostCardPlan.name,
              doMirror: screenShareHostCardPlan.doMirror,
            }),
          );
        }

        updateMainGridStream(newComponent);

        applyMainScreenState(screenShareHostCardPlan.state);

        return newComponent;
      }

      const mainHostCardPlan = buildMainHostCardPlan<Stream>({
        islevel,
        localUIMode,
        videoAlreadyOn,
        audioAlreadyOn,
        hostVideoOn: !!host.videoOn,
        hostMuted: host.muted,
        hostIsAdmin: host.islevel === '2',
        hostName: host.name || '',
        hostVideoID: host.videoID,
        fallbackName: name,
        member,
        keepBackground,
        virtualStream,
        localStreamVideo,
        oldAllStreams: oldAllStreams as Stream[],
      });

      renderMainHostCard({ plan: mainHostCardPlan, host });
    } else {
      renderNoHostCard();
    }

    updateMainWindow = false;
    updateUpdateMainWindow(updateMainWindow);

    return newComponent;
  } catch {
    // Handle errors during the process of preparing and populating the main screen
    // throw error;
  }
}
