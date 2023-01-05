type Journey = {
	departure_date: string;
	return_date: string;
	departure_station_id: number;
	return_station_id: number;
	covered_distance: number;
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
