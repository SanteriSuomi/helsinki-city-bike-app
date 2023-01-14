const JOURNEYS_GRID_HEADERS = [
	{
		text: "Departure Date",
		key: "departure_date",
		isDate: true,
	},
	{ text: "Return Date", key: "return_date", isDate: true },
	{
		text: "Dep. Station Name",
		key: "departure_station_name",
	},
	{ text: "Dep. Station ID", key: "departure_station_id" },
	{ text: "Ret. Station Name", key: "return_station_name" },
	{ text: "Ret. Station ID", key: "return_station_id" },
	{ text: "Distance (m)", key: "covered_distance" },
	{ text: "Duration (s)", key: "duration" },
];

const STATIONS_GRID_HEADERS = [
	{
		text: "ID",
		key: "id",
	},
	{ text: "Name", key: "name" },
	{ text: "Address", key: "address" },
	{ text: "City", key: "city" },
	{ text: "Operator", key: "operator" },
	{ text: "Capacity", key: "capacity" },
	{
		text: "X Coordinate",
		key: "x",
		isNumber: {
			round: 3,
		},
	},
	{
		text: "Y Coordinate",
		key: "y",
		isNumber: {
			round: 3,
		},
	},
];

const SORT_ORDER_HEADERS = [
	{ text: "Ascending", key: "asc" },
	{ text: "Descending", key: "desc" },
];

export { JOURNEYS_GRID_HEADERS, STATIONS_GRID_HEADERS, SORT_ORDER_HEADERS };
