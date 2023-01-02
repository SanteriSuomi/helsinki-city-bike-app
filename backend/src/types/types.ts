type Journey = {
	departureDate: string;
	returnDate: string;
	departureStationId: number;
	departureStationName: string;
	returnStationId: number;
	returnStationName: string;
	coveredDistance: number;
	duration: number;
};

type ValidationRule = {
	index?: number;
	isString?: boolean;
	isNumber?: boolean;
	isDate?: boolean;
	custom?: (field: string) => boolean;
};

type ValidationData = {
	valid: boolean;
	object?: any;
};

export { Journey, ValidationRule, ValidationData };
