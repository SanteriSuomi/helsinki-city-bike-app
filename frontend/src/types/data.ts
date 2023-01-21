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

enum UploadColumnType {
	STRING = "text",
	NUMBER = "number",
	DATE = "date",
}

type UploadColumn = {
	name: string;
	key: string;
	type: UploadColumnType;
};

export { UploadColumnType };

export type {
	DefaultSortData,
	DataPageInfo,
	AbortableFetch,
	StationDetailedInfo,
	UploadColumn,
};
