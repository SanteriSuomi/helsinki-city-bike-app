const JOURNEY_MIN_DISTANCE = 10;
const JOURNEY_MIN_DURATION = 10;

// Assuming a situation (not based on anything) where 100km and 24hrs are the max distance and duration, respectively
const JOURNEY_MAX_DISTANCE = 100000;
const JOURNEY_MAX_DURATION = 86400;

const APP_DATA_JOURNEYS_VALIDATION_RULES = [
	{
		index: 0,
		isString: true,
		isDate: true,
	},
	{
		index: 1,
		isString: true,
		isDate: true,
	},
	{
		index: 2,
		isNumber: true,
	},
	{
		index: 3,
		isString: true,
	},
	{
		index: 4,
		isNumber: true,
	},
	{
		index: 5,
		isString: true,
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
		customCheck: (field: string) => {
			const number = Number(field);
			return (
				number >= JOURNEY_MIN_DISTANCE && number <= JOURNEY_MAX_DISTANCE
			);
		},
	},
	{
		index: 7,
		customCheck: (field: string) => {
			const number = Number(field);
			return (
				number >= JOURNEY_MIN_DURATION && number <= JOURNEY_MAX_DURATION
			);
		},
	},
];

const APP_DATA_STATIONS_VALIDATION_RULES = [
	{
		index: 1,
		isNumber: true,
	},
	{
		index: 2,
		isString: true,
	},
	{
		index: 5,
		isString: true,
	},
	{
		index: 11,
		isNumber: true,
	},
	{
		index: 12,
		isNumber: true,
	},
];

enum STATIONS_ENDPOINT_DIRECTION_START {
	FROM_STATION = "departure",
}

export {
	JOURNEY_MIN_DISTANCE,
	JOURNEY_MIN_DURATION,
	APP_DATA_JOURNEYS_VALIDATION_RULES,
	APP_DATA_STATIONS_VALIDATION_RULES,
	STATIONS_ENDPOINT_DIRECTION_START,
};
