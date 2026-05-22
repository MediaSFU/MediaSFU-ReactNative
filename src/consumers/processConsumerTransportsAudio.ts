import { processConsumerTransportsAudio as sharedProcessConsumerTransportsAudio } from 'mediasfu-shared';
import {
	Stream, Transport, Participant, SleepType,
} from '../@types/types';

export interface ProcessConsumerTransportsAudioParameters {
	sleep: SleepType;
	[key: string]: any;
}

export interface ProcessConsumerTransportsAudioOptions {
	consumerTransports: Transport[];
	lStreams: (Stream | Participant)[];
	parameters: ProcessConsumerTransportsAudioParameters;
}

export type ProcessConsumerTransportsAudioType = (
	options: ProcessConsumerTransportsAudioOptions
) => Promise<void>;

export const processConsumerTransportsAudio = async ({
	consumerTransports,
	lStreams,
	parameters,
}: ProcessConsumerTransportsAudioOptions): Promise<void> => {
	await sharedProcessConsumerTransportsAudio<Transport, Stream | Participant>({
		consumerTransports,
		lStreams,
		parameters,
	});
};
