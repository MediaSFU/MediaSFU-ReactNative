import { Socket } from 'socket.io-client';
import { Participant, ShowAlert } from '../../@types/types';
import { updateParticipantPermission as sharedUpdateParticipantPermission } from 'mediasfu-shared';

export type PermissionLevel = '0' | '1' | '2';

export interface UpdateParticipantPermissionOptions {
  socket: Socket;
  participant: Participant;
  newLevel: PermissionLevel;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
}

export type UpdateParticipantPermissionType = (
  options: UpdateParticipantPermissionOptions,
) => Promise<void>;

export const updateParticipantPermission = async ({
  socket,
  participant,
  newLevel,
  member,
  islevel,
  roomName,
  showAlert,
}: UpdateParticipantPermissionOptions): Promise<void> => {
  await sharedUpdateParticipantPermission({
    socket,
    participant,
    newLevel,
    member,
    islevel,
    roomName,
    showAlert,
  } as any);
};
