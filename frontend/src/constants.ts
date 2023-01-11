const JOURNEYS_GRID_HEADERS = [
	{
		text: "Departure Date",
		dbKey: "departure_date",
		isDate: true,
	},
	{ text: "Return Date", dbKey: "return_date", isDate: true },
	{
		text: "Dep. Station Name",
		dbKey: "departure_station_name",
	},
	{ text: "Dep. Station ID", dbKey: "departure_station_id" },
	{ text: "Ret. Station Name", dbKey: "return_station_name" },
	{ text: "Ret. Station ID", dbKey: "return_station_id" },
	{ text: "Distance", dbKey: "covered_distance" },
	{ text: "Duration", dbKey: "duration" },
];

export { JOURNEYS_GRID_HEADERS };
