import { Socket } from 'socket.io-client';
import { Participant, ShowAlert } from '../../@types/types';
import {
  updatePanelists as sharedUpdatePanelists,
  addPanelist as sharedAddPanelist,
  removePanelist as sharedRemovePanelist,
} from 'mediasfu-shared';

export interface UpdatePanelistsOptions {
  socket: Socket;
  panelists: Participant[];
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export interface AddPanelistOptions {
  socket: Socket;
  participant: Participant;
  currentPanelists: Participant[];
  maxPanelists: number;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export interface RemovePanelistOptions {
  socket: Socket;
  participant: Participant;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export type UpdatePanelistsType = (options: UpdatePanelistsOptions) => Promise<void>;
export type AddPanelistType = (options: AddPanelistOptions) => Promise<boolean>;
export type RemovePanelistType = (options: RemovePanelistOptions) => Promise<void>;

export const updatePanelists = async (options: UpdatePanelistsOptions): Promise<void> => {
  await sharedUpdatePanelists(options as any);
};

export const addPanelist = async (options: AddPanelistOptions): Promise<boolean> => {
  return sharedAddPanelist(options as any);
};

export const removePanelist = async (options: RemovePanelistOptions): Promise<void> => {
  await sharedRemovePanelist(options as any);
};
