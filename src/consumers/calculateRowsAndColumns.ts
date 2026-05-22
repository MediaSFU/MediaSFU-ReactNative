import {
	calculateRowsAndColumns as sharedCalculateRowsAndColumns,
} from 'mediasfu-shared';

export interface CalculateRowsAndColumnsOptions {
	n: number;
}

export type CalculateRowsAndColumnsType = (options: CalculateRowsAndColumnsOptions) => [number, number];

export function calculateRowsAndColumns({ n }: CalculateRowsAndColumnsOptions): [number, number] {
	return sharedCalculateRowsAndColumns({ n });
}
