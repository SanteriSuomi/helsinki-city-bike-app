const JOURNEY_MIN_DISTANCE = 10;
const JOURNEY_MIN_DURATION = 10;

const APP_DATA_JOURNEYS_VALIDATION_RULES = [
	{
		isString: true,
		isDate: true,
	},
	{
		isString: true,
		isDate: true,
	},
	{
		isNumber: true,
	},
	{
		index: 4,
		isNumber: true,
	},
	{
		index: 6,
		isNumber: true,
	},
	{
		index: 7,
		isNumber: true,
	},
	{
		index: 6,
		custom: (field: string) => {
			return Number(field) >= JOURNEY_MIN_DISTANCE;
		},
	},
	{
		index: 7,
		custom: (field: string) => {
			return Number(field) >= JOURNEY_MIN_DURATION;
		},
	},
];

const APP_DATA_STATIONS_VALIDATION_RULES = [
	{
		isNumber: true,
	},
	{
		index: 1,
		isString: true,
	},
	{
		index: 4,
		isString: true,
	},
	{
		index: 6,
		isString: true,
	},
	{
		index: 8,
		isString: true,
	},
	{
		index: 9,
		isNumber: true,
	},
	{
		index: 10,
		isNumber: true,
	},
	{
		index: 11,
		isNumber: true,
	},
];

enum STATIONS_ENDPOINT_DIRECTION_START {
	FROM_STATION = "start",
}

export {
	JOURNEY_MIN_DISTANCE,
	JOURNEY_MIN_DURATION,
	APP_DATA_JOURNEYS_VALIDATION_RULES,
	APP_DATA_STATIONS_VALIDATION_RULES,
	STATIONS_ENDPOINT_DIRECTION_START,
};
