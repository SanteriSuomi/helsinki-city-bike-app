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

export type { DefaultSortData, DataPageInfo, AbortableFetch };
