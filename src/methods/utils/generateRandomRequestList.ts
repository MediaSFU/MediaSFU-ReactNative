import { Participant, Request } from '../../@types/types';

export interface GenerateRandomRequestListOptions {
	participants: Participant[];
	hostName: string;
	coHostName?: string;
	numberOfRequests: number;
}

export type GenerateRandomRequestListType = (
	options: GenerateRandomRequestListOptions,
) => Request[];

export const generateRandomRequestList = ({
	participants,
	hostName,
	coHostName,
	numberOfRequests,
}: GenerateRandomRequestListOptions): Request[] => {
	const filteredParticipants = participants.filter(
		(participant) => participant.name !== hostName && participant.name !== coHostName,
	);

	const requestIcons = ['fa-video', 'fa-desktop', 'fa-microphone'];
	for (let i = requestIcons.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[requestIcons[i], requestIcons[j]] = [requestIcons[j], requestIcons[i]];
	}

	return filteredParticipants.flatMap((participant) => {
		const uniqueIcons = new Set<string>();
		const requests: Request[] = [];

		for (let i = 0; i < numberOfRequests; i++) {
			let randomIcon;
			do {
				randomIcon = requestIcons[Math.floor(Math.random() * requestIcons.length)];
			} while (uniqueIcons.has(randomIcon));

			uniqueIcons.add(randomIcon);
			requests.push({
				id: participant.id || '',
				name: participant.name.toLowerCase().replace(/\s/g, '_'),
				icon: randomIcon,
				username: participant.name.toLowerCase().replace(/\s/g, '_'),
			});
		}

		return requests;
	});
};
