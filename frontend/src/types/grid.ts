type Sort = {
	column: string;
	order: string;
};

type Header = {
	text: string;
	key: string;
	isDate?: boolean;
};

export type { Sort, Header };
