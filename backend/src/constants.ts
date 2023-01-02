const MIN_DISTANCE = 10;
const MIN_DURATION = 10;

const JOURNEYS_VALIDATION_RULES = [
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
		isString: true,
	},
	{
		isNumber: true,
	},
	{
		isString: true,
	},
	{
		isNumber: true,
	},
	{
		isNumber: true,
	},
	{
		index: 6,
		custom: (field: string) => {
			return Number(field) >= MIN_DISTANCE;
		},
	},
	{
		index: 7,
		custom: (field: string) => {
			return Number(field) >= MIN_DURATION;
		},
	},
];

export { MIN_DISTANCE, MIN_DURATION, JOURNEYS_VALIDATION_RULES };
