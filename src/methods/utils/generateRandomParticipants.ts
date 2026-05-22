import { Participant } from '../../@types/types';

export interface GenerateRandomParticipantsOptions {
	member: string;
	coHost?: string;
	host: string;
	forChatBroadcast?: boolean;
}

export type GenerateRandomParticipantsType = (
	options: GenerateRandomParticipantsOptions,
) => Participant[];

export const generateRandomParticipants = ({
	member,
	coHost = '',
	host,
	forChatBroadcast = false,
}: GenerateRandomParticipantsOptions): Participant[] => {
	const participants: Participant[] = [];
	let names = [
		'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack', 'Kate',
		'Liam', 'Mia', 'Nina', 'Olivia', 'Pete', 'Quinn', 'Rachel', 'Steve', 'Tina', 'Ursula',
		'Vince', 'Wendy', 'Xander', 'Yvonne', 'Zack',
	];

	if (forChatBroadcast) names.splice(2);
	if (!names.includes(member)) names.unshift(member);
	if (!names.includes(coHost) && !forChatBroadcast && coHost) names.unshift(coHost);
	if (!names.includes(host)) names.unshift(host);
	if (forChatBroadcast) names.splice(2);

	names = names.filter((name) => name.length > 1);

	const shuffledNames = [...names];
	for (let i = shuffledNames.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
	}

	let hasLevel2Participant = false;

	for (let i = 0; i < shuffledNames.length; i++) {
		const randomName = shuffledNames[i];
		const randomLevel = hasLevel2Participant ? '1' : randomName === host ? '2' : '1';
		const randomMuted = forChatBroadcast ? true : Math.random() < 0.5;

		if (randomLevel === '2') hasLevel2Participant = true;

		participants.push({
			name: randomName,
			islevel: randomLevel,
			muted: randomMuted,
			id: i.toString(),
			audioID: `audio-${i}`,
			videoID: `video-${i}`,
		});
	}

	return participants;
};
