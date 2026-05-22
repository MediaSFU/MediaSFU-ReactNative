import { Message, Participant } from '../../@types/types';

export interface GenerateRandomMessagesOptions {
	participants: Participant[];
	member: string;
	coHost?: string;
	host: string;
	forChatBroadcast?: boolean;
}

export type GenerateRandomMessagesType = (options: GenerateRandomMessagesOptions) => Message[];

export const generateRandomMessages = ({
	participants,
	member,
	coHost = '',
	host,
	forChatBroadcast = false,
}: GenerateRandomMessagesOptions): Message[] => {
	const messages: Message[] = [];

	const getRandomReceiver = (sender: string): string => {
		const potentialReceivers = participants.filter((participant) => participant.name !== sender);
		const randomReceiver = potentialReceivers[Math.floor(Math.random() * potentialReceivers.length)];
		return randomReceiver?.name || '';
	};

	let refNames: string[] = [];
	if (forChatBroadcast) {
		refNames = [member, host];
	} else if (coHost) {
		refNames = [
			member,
			coHost,
			host,
			...participants.map((participant) => participant.name).filter((name): name is string => !!name),
		];
	} else {
		refNames = [
			member,
			host,
			...participants.map((participant) => participant.name).filter((name): name is string => !!name),
		];
	}

	refNames = [...new Set(refNames)];

	let timeIncrement = 0;
	refNames.forEach((sender) => {
		messages.push({
			sender,
			receivers: [getRandomReceiver(sender)],
			message: `Direct message from ${sender}`,
			timestamp: new Date(Date.now() + timeIncrement).toLocaleTimeString(),
			group: false,
		});

		messages.push({
			sender,
			receivers: participants
				.map((participant) => participant.name)
				.filter((name): name is string => !!name),
			message: `Group message from ${sender}`,
			timestamp: new Date(Date.now() + timeIncrement).toLocaleTimeString(),
			group: true,
		});

		timeIncrement += 15000;
	});

	return messages;
};
