import express, { Request } from "express";
import { QueryResult } from "pg";
import { STATIONS_ENDPOINT_DIRECTION_START } from "../../config/constants";
import { Journey, Station } from "../../types/database";
import {
	getAll,
	getColumnQuery,
	getSearch,
	postInsert,
} from "../base_endpoints";
import { buildDateFilter, buildQueryParameters } from "../utils/query_builders";
import {
	sendBadRequest,
	sendInternalError,
	sendSuccessData,
} from "../utils/responses";
import Database from "../../db/database";

const router = express.Router();

router.get("/", async (req, res) => {
	await getAll(
		req,
		res,
		process.env.APP_STATIONS_TABLE!,
		process.env.APP_STATIONS_TABLE_STRING_COLUMNS!.split(" ")[0]
	);
});

router.get("/:column-:query", async (req, res) => {
	await getColumnQuery(req, res, process.env.APP_STATIONS_TABLE!);
});

router.get("/search/:column-:query", async (req, res) => {
	await getSearch(
		req,
		res,
		process.env.APP_STATIONS_TABLE!,
		process.env.APP_STATIONS_TABLE_STRING_COLUMNS!.split(" "),
		process.env.APP_STATIONS_TABLE_NUMBER_COLUMNS!.split(" ")
	);
});

/**
 * Endpoint for getting the number of journeys starting from or ending to station
 * Optionally can give the average distance of those journeys and the data itself
 */
router.get("/journeys/:start", async (req, res) => {
	const { start } = req.params;
	const { id, all, avg } = req.query;

	let queryString;
	try {
		if (checkIncompatibleParameters(req, avg as string)) {
			return sendBadRequest(
				res,
				"Filters not compatible with getting average as results would not be accurate."
			);
		}

		let isDeparture =
			start === STATIONS_ENDPOINT_DIRECTION_START.FROM_STATION;
		if (isDeparture) {
			queryString = `SELECT * FROM ${
				process.env.APP_JOURNEYS_TABLE
			} WHERE ${buildDateFilter(
				req,
				false,
				true
			)} departure_station_id = ${id} ${buildQueryParameters(req)}`;
		} else {
			queryString = `SELECT * FROM ${
				process.env.APP_JOURNEYS_TABLE
			} WHERE return_station_id = ${id} ${buildQueryParameters(req)}`;
		}
	} catch (error) {
		return sendBadRequest(res, error);
	}
	try {
		const queryResult = await Database.instance.query(queryString);
		let returnObj: any = { totalCount: queryResult.rowCount };
		if (avg) {
			returnObj.averageDistance = await calcAverageDistance(queryResult);
		}
		if (all) {
			returnObj.items = queryResult.rows;
		}
		return sendSuccessData(res, returnObj);
	} catch (error) {
		return sendInternalError(res, error);
	}
});

router.post("/", async (req, res) => {
	await postInsert(
		req,
		res,
		(body: any) => {
			return new Station(body);
		},
		`SELECT * FROM ${process.env.APP_STATIONS_TABLE}
			WHERE id = $1
	    	AND name = $2
	    	AND address = $3
	    	AND city = $4
	    	AND operator = $5
			AND capacity = $6
	    	AND x = $7
			AND y = $8;`,
		`INSERT INTO ${process.env.APP_STATIONS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
	);
});

/**
 * Check if "avg" is defined aswell as query (filter) parameters, as they are incompatible
 * @param req Request object
 * @param avg Average parameter
 * @returns True if the "avg" parameter is defined and any of the other parameters are also defined, false otherwise
 **/
function checkIncompatibleParameters(req: Request, avg?: string) {
	const { column, order, offset, limit } = req.query;
	return avg && column && (order || offset || limit);
}

async function calcAverageDistance(queryResult: QueryResult) {
	let averageDistance = 0;
	queryResult.rows.forEach((journey: Journey) => {
		averageDistance += journey.covered_distance;
	});
	averageDistance /= queryResult.rowCount;
	return averageDistance;
}

export default router;
