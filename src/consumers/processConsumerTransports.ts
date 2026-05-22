import { processConsumerTransports as sharedProcessConsumerTransports } from 'mediasfu-shared';
import {
	Stream, Participant, Transport, SleepType,
} from '../@types/types';

export interface ProcessConsumerTransportsParameters {
	remoteScreenStream: Stream[];
	oldAllStreams: (Stream | Participant)[];
	newLimitedStreams: (Stream | Participant)[];

	// mediasfu functions
	sleep: SleepType;
	getUpdatedAllParams: () => ProcessConsumerTransportsParameters;
	[key: string]: any;
}

export interface ProcessConsumerTransportsOptions {
	consumerTransports: Transport[];
	lStreams_: (Stream | Participant)[];
	parameters: ProcessConsumerTransportsParameters;
}

export type ProcessConsumerTransportsType = (options: ProcessConsumerTransportsOptions) => Promise<void>;

export async function processConsumerTransports({
	consumerTransports,
	lStreams_,
	parameters,
}: ProcessConsumerTransportsOptions): Promise<void> {
	await sharedProcessConsumerTransports<Transport, Stream, Stream | Participant>({
		consumerTransports,
		lStreams_,
		parameters,
	});
}
