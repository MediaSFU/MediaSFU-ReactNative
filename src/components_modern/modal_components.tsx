import React from 'react';
import { Dimensions, Platform } from 'react-native';
import TranslationSettingsModal from '../components/translationComponents/TranslationSettingsModal';
import { ModernMenuModal as ModernMenuModalBase } from './menu_components/ModernMenuModal';
import { ModernBackgroundModal as ModernBackgroundModalBase } from './background_components/ModernBackgroundModal';
import { ModernBreakoutRoomsModal as ModernBreakoutRoomsModalBase } from './breakout_components/ModernBreakoutRoomsModal';
import { ModernConfirmExitModal as ModernConfirmExitModalBase } from './exit_components/ModernConfirmExitModal';
import { ModernConfirmHereModal as ModernConfirmHereModalBase } from './misc_components/ModernConfirmHereModal';
import { ModernShareEventModal as ModernShareEventModalBase } from './misc_components/ModernShareEventModal';
import { ModernDisplaySettingsModal as ModernDisplaySettingsModalBase } from './display_settings_components/ModernDisplaySettingsModal';
import { ModernEventSettingsModal as ModernEventSettingsModalBase } from './event_settings_components/ModernEventSettingsModal';
import { ModernMediaSettingsModal as ModernMediaSettingsModalBase } from './media_settings_components/ModernMediaSettingsModal';
import { ModernConfigureWhiteboardModal as ModernConfigureWhiteboardModalBase } from './whiteboard_components/ModernConfigureWhiteboardModal';
import { ModernScreenboardModal as ModernScreenboardModalBase } from './screenboard_components/ModernScreenboardModal';
import { ModernPanelistsModal as ModernPanelistsModalBase } from './panelists_components/ModernPanelistsModal';
import { ModernPermissionsModal as ModernPermissionsModalBase } from './permissions_components/ModernPermissionsModal';
import { ModernRecordingModal as ModernRecordingModalBase } from './recording_components/ModernRecordingModal';
import { ModernPollModal as ModernPollModalBase } from './polls_components/ModernPollModal';
import { ModernCoHostModal as ModernCoHostModalBase } from './co_host_components/ModernCoHostModal';
import { ModernParticipantsModal as ModernParticipantsModalBase } from './participants_components/ModernParticipantsModal';
import { ModernRequestsModal as ModernRequestsModalBase } from './requests_components/ModernRequestsModal';
import { ModernWaitingModal as ModernWaitingModalBase } from './waiting_components/ModernWaitingModal';
import { ModernMessagesModal as ModernMessagesModalBase } from './message_components/ModernMessagesModal';
import { getModernColors, getModernModalCardStyle, getModernSidePanelStyle, resolveIsDarkMode } from './core/modernTheme';

type AnyProps = Record<string, any>;

const withModernModalProps = <Props extends AnyProps>(props: Props): Props => ({
  ...props,
  backgroundColor: props.backgroundColor ?? getModernColors(resolveIsDarkMode(props)).surface,
  position: props.position ?? 'topRight',
  style: [
    getModernModalCardStyle(resolveIsDarkMode(props)),
    Platform.OS === 'web' && Dimensions.get('window').width >= 1200
      ? getModernSidePanelStyle(resolveIsDarkMode(props))
      : null,
    props.style,
  ] as any,
  isDarkMode: resolveIsDarkMode(props),
} as Props);

export const ModernMenuModal: React.FC<React.ComponentProps<typeof ModernMenuModalBase>> = (props) => (
  <ModernMenuModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernRecordingModal: React.FC<React.ComponentProps<typeof ModernRecordingModalBase>> = (props) => (
  <ModernRecordingModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernRequestsModal: React.FC<React.ComponentProps<typeof ModernRequestsModalBase>> = (props) => (
  <ModernRequestsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernWaitingModal: React.FC<React.ComponentProps<typeof ModernWaitingModalBase>> = (props) => (
  <ModernWaitingModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernDisplaySettingsModal: React.FC<React.ComponentProps<typeof ModernDisplaySettingsModalBase>> = (props) => (
  <ModernDisplaySettingsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernEventSettingsModal: React.FC<React.ComponentProps<typeof ModernEventSettingsModalBase>> = (props) => (
  <ModernEventSettingsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernCoHostModal: React.FC<React.ComponentProps<typeof ModernCoHostModalBase>> = (props) => (
  <ModernCoHostModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernParticipantsModal: React.FC<React.ComponentProps<typeof ModernParticipantsModalBase>> = (props) => (
  <ModernParticipantsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernMessagesModal: React.FC<React.ComponentProps<typeof ModernMessagesModalBase>> = (props) => (
  <ModernMessagesModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernMediaSettingsModal: React.FC<React.ComponentProps<typeof ModernMediaSettingsModalBase>> = (props) => (
  <ModernMediaSettingsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernConfirmExitModal: React.FC<React.ComponentProps<typeof ModernConfirmExitModalBase>> = (props) => (
  <ModernConfirmExitModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'center'}
  />
);

export const ModernConfirmHereModal: React.FC<React.ComponentProps<typeof ModernConfirmHereModalBase>> = (props) => (
  <ModernConfirmHereModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
  />
);

export const ModernShareEventModal: React.FC<React.ComponentProps<typeof ModernShareEventModalBase>> = (props) => (
  <ModernShareEventModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernPollModal: React.FC<React.ComponentProps<typeof ModernPollModalBase>> = (props) => (
  <ModernPollModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernBackgroundModal: React.FC<React.ComponentProps<typeof ModernBackgroundModalBase>> = (props) => (
  <ModernBackgroundModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'center'}
  />
);

export const ModernTranslationSettingsModal: React.FC<React.ComponentProps<typeof TranslationSettingsModal>> = (props) => (
  <TranslationSettingsModal {...withModernModalProps(props as AnyProps) as React.ComponentProps<typeof TranslationSettingsModal>} />
);

export const ModernBreakoutRoomsModal: React.FC<React.ComponentProps<typeof ModernBreakoutRoomsModalBase>> = (props) => (
  <ModernBreakoutRoomsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'topRight'}
  />
);

export const ModernConfigureWhiteboardModal: React.FC<React.ComponentProps<typeof ModernConfigureWhiteboardModalBase>> = (props) => (
  <ModernConfigureWhiteboardModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'center'}
  />
);

export const ModernScreenboardModal: React.FC<React.ComponentProps<typeof ModernScreenboardModalBase>> = (props) => (
  <ModernScreenboardModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'center'}
  />
);

export const ModernPanelistsModal: React.FC<React.ComponentProps<typeof ModernPanelistsModalBase>> = (props) => (
  <ModernPanelistsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'center'}
  />
);

export const ModernPermissionsModal: React.FC<React.ComponentProps<typeof ModernPermissionsModalBase>> = (props) => (
  <ModernPermissionsModalBase
    {...props}
    backgroundColor={props.backgroundColor ?? getModernColors(resolveIsDarkMode(props as AnyProps)).surface}
    isDarkMode={resolveIsDarkMode(props as AnyProps)}
    position={props.position ?? 'center'}
  />
);