import { WaitingRoomParticipant } from '../../@types/types';

export type GenerateRandomWaitingRoomListType = () => WaitingRoomParticipant[];

export const generateRandomWaitingRoomList: GenerateRandomWaitingRoomListType = () => {
	const names = ['Dimen', 'Nore', 'Ker', 'Lor', 'Mik'];
	const waitingRoomList: WaitingRoomParticipant[] = [];

	for (let i = 0; i < names.length; i++) {
		waitingRoomList.push({
			name: names[i],
			id: i.toString(),
		});
	}

	return waitingRoomList;
};
