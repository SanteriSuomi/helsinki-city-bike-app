import { TopStation } from "./database";

type DefaultSortData = {
	column: string;
	order: string;
};

type DataPageInfo<TData> = {
	totalCount: number;
	items: TData[];
};

type AbortableFetch = {
	abort: () => void;
	request: Promise<Response>;
};

type StationDetailedInfo = {
	totalCount: number;
	averageDistance: number;
	topStations: TopStation[];
};

export type {
	DefaultSortData,
	DataPageInfo,
	AbortableFetch,
	StationDetailedInfo,
};
