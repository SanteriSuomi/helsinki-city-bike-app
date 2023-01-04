type Journey = {
	departureDate: string;
	returnDate: string;
	departureStationId: number;
	returnStationId: number;
	coveredDistance: number;
	duration: number;
};

type Station = {
	id: number;
	name: string;
	address: string;
	city: string;
	operator: string;
	x: number;
	y: number;
};

type ValidationRule = {
	index?: number;
	isString?: boolean;
	isNumber?: boolean;
	isDate?: boolean;
	custom?: (field: string) => boolean;
};

export { Journey, Station, ValidationRule };
