import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';
import {
  focusPanelists as sharedFocusPanelists,
  unfocusPanelists as sharedUnfocusPanelists,
} from 'mediasfu-shared';

export interface FocusPanelistsOptions {
  socket: Socket;
  roomName: string;
  member: string;
  islevel: string;
  focusEnabled: boolean;
  muteOthersMic?: boolean;
  muteOthersCamera?: boolean;
  showAlert?: ShowAlert;
}

export interface UnfocusPanelistsOptions {
  socket: Socket;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export type FocusPanelistsType = (options: FocusPanelistsOptions) => Promise<void>;
export type UnfocusPanelistsType = (options: UnfocusPanelistsOptions) => Promise<void>;

export const focusPanelists = async (options: FocusPanelistsOptions): Promise<void> => {
  await sharedFocusPanelists(options as any);
};

export const unfocusPanelists = async (options: UnfocusPanelistsOptions): Promise<void> => {
  await sharedUnfocusPanelists(options as any);
};
