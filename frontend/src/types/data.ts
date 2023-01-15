type DefaultSortData = {
	column: string;
	order: string;
};

type DataPageInfo<TData> = {
	totalCount: number;
	items: TData[];
};

export type { DefaultSortData, DataPageInfo };
