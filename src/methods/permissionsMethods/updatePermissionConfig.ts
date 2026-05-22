import { Socket } from 'socket.io-client';
import { ShowAlert } from '../../@types/types';
import { updatePermissionConfig as sharedUpdatePermissionConfig } from 'mediasfu-shared';

export interface PermissionCapabilities {
  useMic: 'allow' | 'approval' | 'disallow';
  useCamera: 'allow' | 'approval' | 'disallow';
  useScreen: 'allow' | 'approval' | 'disallow';
  useChat: 'allow' | 'disallow';
}

export interface PermissionConfig {
  level0: PermissionCapabilities;
  level1: PermissionCapabilities;
}

export interface UpdatePermissionConfigOptions {
  socket: Socket;
  config: PermissionConfig;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
}

export type UpdatePermissionConfigType = (options: UpdatePermissionConfigOptions) => Promise<void>;

export const updatePermissionConfig = async (options: UpdatePermissionConfigOptions): Promise<void> => {
  await sharedUpdatePermissionConfig(options as any);
};
