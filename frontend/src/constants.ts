import { UploadColumnType } from "./types/data";

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

const JOURNEYS_UPLOAD_COLUMNS = [
	{
		name: "Departure Date",
		key: "departure_date",
		type: UploadColumnType.DATE,
	},
	{
		name: "Return Date",
		key: "return_date",
		type: UploadColumnType.DATE,
	},
	{
		name: "Departure Station ID",
		key: "departure_station_id",
		type: UploadColumnType.NUMBER,
	},
	{
		name: "Departure Station Name",
		key: "departure_station_name",
		type: UploadColumnType.STRING,
	},
	{
		name: "Return Station ID",
		key: "return_station_id",
		type: UploadColumnType.NUMBER,
	},
	{
		name: "Return Station Name",
		key: "return_station_name",
		type: UploadColumnType.STRING,
	},
	{
		name: "Covered Distance",
		key: "covered_distance",
		type: UploadColumnType.NUMBER,
	},
	{
		name: "Duration",
		key: "duration",
		type: UploadColumnType.NUMBER,
	},
];

const STATIONS_UPLOAD_COLUMNS = [
	{
		name: "ID",
		key: "id",
		type: UploadColumnType.NUMBER,
	},
	{
		name: "Name",
		key: "name",
		type: UploadColumnType.STRING,
	},
	{
		name: "Address",
		key: "address",
		type: UploadColumnType.STRING,
	},
	{
		name: "City",
		key: "city",
		type: UploadColumnType.STRING,
	},
	{
		name: "Operator",
		key: "operator",
		type: UploadColumnType.STRING,
	},
	{
		name: "Capacity",
		key: "capacity",
		type: UploadColumnType.NUMBER,
	},
	{
		name: "X",
		key: "x",
		type: UploadColumnType.NUMBER,
	},
	{
		name: "Y",
		key: "y",
		type: UploadColumnType.NUMBER,
	},
];

const SORT_ORDER_HEADERS = [
	{ text: "Ascending", key: "asc" },
	{ text: "Descending", key: "desc" },
];

const MIN_DATAPAGE_UPDATE_COUNT = 3;

const MAX_ITEMS_PER_DATAPAGE = 20;

const MAP_DEFAULT_ZOOM = 10;

export {
	JOURNEYS_GRID_HEADERS,
	STATIONS_GRID_HEADERS,
	JOURNEYS_UPLOAD_COLUMNS,
	STATIONS_UPLOAD_COLUMNS,
	SORT_ORDER_HEADERS,
	MIN_DATAPAGE_UPDATE_COUNT,
	MAX_ITEMS_PER_DATAPAGE,
	MAP_DEFAULT_ZOOM,
};
