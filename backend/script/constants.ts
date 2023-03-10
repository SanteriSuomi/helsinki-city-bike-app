const APP_STATIONS_TABLE = "stations";
const APP_JOURNEYS_TABLE = "journeys";

const MIN_ROWCOUNT_JOURNEYS = 10_000;
const MIN_ROWCOUNT_STATIONS = 100;

const JOURNEY_MIN_DISTANCE = 10;
const JOURNEY_MIN_DURATION = 10;

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

const APP_STATIONS_TABLE_CREATE_QUERY = `CREATE TABLE stations (
	id int NOT NULL UNIQUE PRIMARY KEY,
	name varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	city varchar(255) NOT NULL,
	operator varchar(255) NOT NULL,
	capacity int NOT NULL,
	x float NOT NULL,
	y float NOT NULL
)`;
const APP_STATIONS_TABLE_INDEX_QUERY = `CREATE INDEX name_index ON stations (name);
CREATE INDEX address_index ON stations (address);
CREATE INDEX city_index ON stations (city);
CREATE INDEX operator_index ON stations (operator);
CREATE INDEX capacity_index ON stations (capacity);
CREATE INDEX x_index ON stations (x);
CREATE INDEX y_index ON stations (y);`;

const APP_JOURNEYS_TABLE_CREATE_QUERY = `CREATE TABLE journeys (
	departure_date timestamp NOT NULL,
	return_date timestamp NOT NULL,
	departure_station_id int NOT NULL,
	departure_station_name varchar(255) NOT NULL,
	return_station_id int NOT NULL,
	return_station_name varchar(255) NOT NULL,
	covered_distance float NOT NULL,
	duration float NOT NULL
)`;
const APP_JOURNEYS_TABLE_INDEX_QUERY = `CREATE FUNCTION to_char_immutable(timestamp without time zone, text)
RETURNS text
IMMUTABLE
LANGUAGE sql
AS $_$SELECT to_char($1, $2);$_$;

CREATE INDEX departure_date_string_index ON journeys (to_char_immutable(departure_date, 'YYYY-MM-DD'));
CREATE INDEX return_date_string_index ON journeys (to_char_immutable(return_date, 'YYYY-MM-DD'));
CREATE INDEX departure_station_id_index ON journeys (departure_station_id);
CREATE INDEX departure_station_name_index ON journeys (departure_station_name);
CREATE INDEX return_station_id_index ON journeys (return_station_id);
CREATE INDEX return_station_name_index ON journeys (return_station_name);
CREATE INDEX covered_distance_index ON journeys (covered_distance);
CREATE INDEX duration_index ON journeys (duration);`;
const APP_JOURNEYS_TABLE_STRING_COLUMNS =
    "departure_date::text return_date::text departure_station_name return_station_name";
const APP_JOURNEYS_TABLE_NUMBER_COLUMNS =
    "departure_station_id return_station_id covered_distance duration";

export {
    APP_STATIONS_TABLE,
    APP_JOURNEYS_TABLE,
    APP_DATA_JOURNEYS_VALIDATION_RULES,
    APP_DATA_STATIONS_VALIDATION_RULES,
    APP_STATIONS_TABLE_CREATE_QUERY,
    APP_STATIONS_TABLE_INDEX_QUERY,
    APP_JOURNEYS_TABLE_CREATE_QUERY,
    APP_JOURNEYS_TABLE_INDEX_QUERY,
    APP_JOURNEYS_TABLE_STRING_COLUMNS,
    APP_JOURNEYS_TABLE_NUMBER_COLUMNS,
    MIN_ROWCOUNT_JOURNEYS,
    MIN_ROWCOUNT_STATIONS
};
