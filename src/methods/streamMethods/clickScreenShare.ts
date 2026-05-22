import { clickScreenShare as sharedClickScreenShare } from 'mediasfu-shared';
import { Socket } from 'socket.io-client';
import {
  CheckPermissionType, CheckScreenShareParameters, CheckScreenShareType, ShowAlert, StopShareScreenParameters, StopShareScreenType,
} from '../../@types/types';

export interface ClickScreenShareParameters extends CheckScreenShareParameters, StopShareScreenParameters {
  showAlert?: ShowAlert;
  roomName: string;
  member: string;
  socket: Socket;
  islevel: string;
  youAreCoHost: boolean;
  adminRestrictSetting: boolean;
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  screenAction: boolean;
  screenAlreadyOn: boolean;
  screenRequestState: string | null;
  screenRequestTime: number;
  audioOnlyRoom: boolean;
  updateRequestIntervalSeconds: number;
  updateScreenRequestState: (state: string | null) => void;
  updateScreenAlreadyOn: (status: boolean) => void;

  checkPermission: CheckPermissionType;
  checkScreenShare: CheckScreenShareType;
  stopShareScreen: StopShareScreenType;

  getUpdatedAllParams: () => ClickScreenShareParameters;
  [key: string]: any;
}

export interface ClickScreenShareOptions {
  parameters: ClickScreenShareParameters;
}

export type ClickScreenShareType = (options: ClickScreenShareOptions) => Promise<void>;

export const clickScreenShare: ClickScreenShareType = async ({
  parameters,
}): Promise<void> => {
  await (sharedClickScreenShare as unknown as (options: ClickScreenShareOptions) => Promise<void>)({
    parameters,
  });
};
