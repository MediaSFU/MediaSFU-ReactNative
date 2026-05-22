import {
	getEstimate as sharedGetEstimate,
} from 'mediasfu-shared';
import { CalculateRowsAndColumnsType, EventType } from '../@types/types';

export interface GetEstimateParameters {
	fixedPageLimit: number;
	screenPageLimit: number;
	shareScreenStarted: boolean;
	shared?: boolean;
	eventType: EventType;
	removeAltGrid: boolean;
	isWideScreen: boolean;
	isMediumScreen: boolean;
	updateRemoveAltGrid: (value: boolean) => void;
	calculateRowsAndColumns: CalculateRowsAndColumnsType;
	[key: string]: any;
}

export interface GetEstimateOptions {
	n: number;
	parameters: GetEstimateParameters;
}

export type GetEstimateType = (options: GetEstimateOptions) => [number, number, number];

export function getEstimate({ n, parameters }: GetEstimateOptions): [number, number, number] {
	return sharedGetEstimate({ n, parameters });
}
