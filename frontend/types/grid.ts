type Sort = {
	column: string;
	order: string;
};

type Header = {
	text: string;
	dbKey: string;
	isDate?: boolean;
};

export type { Sort, Header };
