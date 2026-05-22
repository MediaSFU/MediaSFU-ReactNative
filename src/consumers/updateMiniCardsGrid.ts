import {
	updateMiniCardsGrid as sharedUpdateMiniCardsGrid,
} from 'mediasfu-shared';
import { GridSizes, ComponentSizes, EventType } from '../@types/types';

export interface UpdateMiniCardsGridParameters {
	updateGridRows: (rows: number) => void;
	updateGridCols: (cols: number) => void;
	updateAltGridRows: (rows: number) => void;
	updateAltGridCols: (cols: number) => void;
	updateGridSizes: (gridSizes: GridSizes) => void;
	gridSizes: GridSizes;
	paginationDirection: string;
	paginationHeightWidth: number;
	doPaginate: boolean;
	componentSizes: ComponentSizes;
	eventType: EventType;
	getUpdatedAllParams: () => UpdateMiniCardsGridParameters;
	[key: string]: any;
}

export interface UpdateMiniCardsGridOptions {
	rows: number;
	cols: number;
	defal?: boolean;
	actualRows?: number;
	parameters: UpdateMiniCardsGridParameters;
}

export type UpdateMiniCardsGridType = (options: UpdateMiniCardsGridOptions) => Promise<void>;

export async function updateMiniCardsGrid(options: UpdateMiniCardsGridOptions): Promise<void> {
	await sharedUpdateMiniCardsGrid(options);
}
