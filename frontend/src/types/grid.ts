type Sort = {
	column: string;
	order: string;
};

type Header = {
	text: string;
	key: string;
	isDate?: boolean;
	isNumber?: {
		round: number;
	};
};

export type { Sort, Header };
