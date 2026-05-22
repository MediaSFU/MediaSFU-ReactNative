import { Poll } from '../../@types/types';

export interface GenerateRandomPollsOptions {
	numberOfPolls: number;
}

export type GenerateRandomPollsType = (options: GenerateRandomPollsOptions) => Poll[];

export const generateRandomPolls = ({ numberOfPolls }: GenerateRandomPollsOptions): Poll[] => {
	const pollTypes: string[] = ['trueFalse', 'yesNo', 'custom'];
	const polls: Poll[] = [];

	for (let i = 0; i < numberOfPolls; i++) {
		const type = pollTypes[Math.floor(Math.random() * pollTypes.length)];
		let options: string[];

		switch (type) {
			case 'trueFalse':
				options = ['True', 'False'];
				break;
			case 'yesNo':
				options = ['Yes', 'No'];
				break;
			default:
				options = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, idx) => `Option ${idx + 1}`);
		}

		polls.push({
			id: `${i + 1}`,
			question: `Random Question ${i + 1}`,
			type,
			options,
			votes: Array(options.length).fill(0),
			status: 'inactive',
			voters: {},
		});
	}

	return polls;
};
