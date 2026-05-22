import type { MediasfuUICustomOverrides } from '../@types/types';
import { ModernMainContainerComponent } from './display_components/ModernMainContainerComponent';
import { ModernControlButtonsComponent } from './display_components/ModernControlButtonsComponent';
import { ModernControlButtonsComponentTouch } from './display_components/ModernControlButtonsComponentTouch';
import { ModernPagination } from './display_components/ModernPagination';
import { ModernFlexibleGrid } from './display_components/ModernFlexibleGrid';
import { ModernFlexibleVideo } from './display_components/ModernFlexibleVideo';
import { ModernMeetingProgressTimer } from './display_components/ModernMeetingProgressTimer';
import { ModernLoadingModal } from './display_components/ModernLoadingModal';
import { ModernAlertComponent } from './display_components/ModernAlertComponent';
import { ModernVideoCard } from './display_components/ModernVideoCard';
import { ModernAudioCard } from './display_components/ModernAudioCard';
import { ModernMiniCard } from './display_components/ModernMiniCard';
import { ModernMiniAudio } from './display_components/ModernMiniAudio';
import { ModernMiniAudioPlayer } from './display_components/ModernMiniAudioPlayer';
import {
  ModernBackgroundModal,
  ModernBreakoutRoomsModal,
  ModernCoHostModal,
  ModernConfigureWhiteboardModal,
  ModernConfirmExitModal,
  ModernConfirmHereModal,
  ModernDisplaySettingsModal,
  ModernEventSettingsModal,
  ModernMediaSettingsModal,
  ModernMenuModal,
  ModernMessagesModal,
  ModernPanelistsModal,
  ModernParticipantsModal,
  ModernPermissionsModal,
  ModernPollModal,
  ModernRecordingModal,
  ModernRequestsModal,
  ModernScreenboardModal,
  ModernShareEventModal,
  ModernTranslationSettingsModal,
  ModernWaitingModal,
} from './modal_components';

export const createModernReactNativeOverrides = (
  overrides?: MediasfuUICustomOverrides
): MediasfuUICustomOverrides => ({
  mainContainer: { component: ModernMainContainerComponent as any },
  flexibleGrid: { component: ModernFlexibleGrid as any },
  flexibleGridAlt: { component: ModernFlexibleGrid as any },
  flexibleVideo: { component: ModernFlexibleVideo as any },
  pagination: { component: ModernPagination as any },
  controlButtons: { component: ModernControlButtonsComponent as any },
  controlButtonsTouch: { component: ModernControlButtonsComponentTouch as any },
  meetingProgressTimer: { component: ModernMeetingProgressTimer as any },
  videoCard: { component: ModernVideoCard as any },
  audioCard: { component: ModernAudioCard as any },
  miniCard: { component: ModernMiniCard as any },
  miniAudio: { component: ModernMiniAudio as any },
  miniAudioPlayer: { component: ModernMiniAudioPlayer as any },
  loadingModal: { component: ModernLoadingModal as any },
  alert: { component: ModernAlertComponent as any },
  menuModal: { component: ModernMenuModal as any },
  recordingModal: { component: ModernRecordingModal as any },
  requestsModal: { component: ModernRequestsModal as any },
  waitingRoomModal: { component: ModernWaitingModal as any },
  displaySettingsModal: { component: ModernDisplaySettingsModal as any },
  eventSettingsModal: { component: ModernEventSettingsModal as any },
  coHostModal: { component: ModernCoHostModal as any },
  participantsModal: { component: ModernParticipantsModal as any },
  messagesModal: { component: ModernMessagesModal as any },
  mediaSettingsModal: { component: ModernMediaSettingsModal as any },
  confirmExitModal: { component: ModernConfirmExitModal as any },
  confirmHereModal: { component: ModernConfirmHereModal as any },
  shareEventModal: { component: ModernShareEventModal as any },
  pollModal: { component: ModernPollModal as any },
  backgroundModal: { component: ModernBackgroundModal as any },
  translationSettingsModal: { component: ModernTranslationSettingsModal as any },
  breakoutRoomsModal: { component: ModernBreakoutRoomsModal as any },
  configureWhiteboardModal: { component: ModernConfigureWhiteboardModal as any },
  screenboardModal: { component: ModernScreenboardModal as any },
  panelistsModal: { component: ModernPanelistsModal as any },
  permissionsModal: { component: ModernPermissionsModal as any },
  ...overrides,
});

export const createModernNativeOverrides = createModernReactNativeOverrides;