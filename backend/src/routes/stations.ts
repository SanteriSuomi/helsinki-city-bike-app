import express, { Request } from "express";
import { QueryResult } from "pg";
import { STATIONS_ENDPOINT_DIRECTION_START } from "../constants";
import { Journey } from "../types/types";
import { getAll, getColumnQuery, getSearch } from "./base";
import { buildDateFilter, buildQueryParameters } from "./utils/queries";
import Database from "../db/db";
import response from "./utils/response";

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

router.get("/search/:query", async (req, res) => {
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
	try {
		const { start } = req.params;
		const { id, all, avg } = req.query;

		if (checkIncompatibleParameters(req, avg as string)) {
			return response.badRequestError(
				res,
				"Filters not compatible with getting average as results would not be accurate."
			);
		}

		let queryString;
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
		}
		queryString = `SELECT * FROM ${
			process.env.APP_JOURNEYS_TABLE
		} WHERE return_station_id = ${id} ${buildQueryParameters(req)}`;
		const queryResult = await Database.instance.query(queryString);

		let returnObj: any = { totalCount: queryResult.rowCount };
		if (avg) {
			returnObj.averageDistance = await calcAverageDistance(queryResult);
		}
		if (all) {
			returnObj.items = queryResult.rows;
		}
		return response.successData(res, returnObj);
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
});

/**
 * Using filters and getting the average distance of journeys are incompatible
 * @param avg Average query parameter
 * @param req Request
 * @param res Response
 * @returns True if filters & avg are used together
 */
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
