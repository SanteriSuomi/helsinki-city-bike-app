import express, { Request, Response } from "express";
import { STATIONS_ENDPOINT_DIRECTION_START } from "../constants";
import Database from "../db/db";
import { Journey } from "../types/types";
import { getAll, getColumnQuery, getSearch } from "./base";
import response from "./http/response";
import { buildQueryParameters } from "./utils/utils";

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
 * Endpoint for getting journeys from or to station count (and optionally average distance and rows themselves)
 */
router.get("/journeys/:direction", async (req, res) => {
	try {
		const { direction } = req.params;
		const { id, all, avg } = req.query;

		if (checkIncompatibleJourneysDirectionParameters(req, avg as string)) {
			return response.badRequestError(
				res,
				"Filters not compatible with getting average - Results would not be accurate."
			);
		}

		let queryString;
		if (direction === STATIONS_ENDPOINT_DIRECTION_START.FROM_STATION) {
			queryString = `SELECT * FROM ${
				process.env.APP_JOURNEYS_TABLE
			} WHERE departure_station_id = ${id} ${buildQueryParameters(req)}`;
		}
		queryString = `SELECT * FROM ${
			process.env.APP_JOURNEYS_TABLE
		} WHERE return_station_id = ${id} ${buildQueryParameters(req)}`;
		const queryResult = await Database.instance.query(queryString);

		let returnObj: any = {};

		returnObj.totalCount = queryResult.rowCount;

		if (avg) {
			let averageDistance = 0;
			queryResult.rows.forEach((journey: Journey) => {
				averageDistance += journey.covered_distance;
			});
			averageDistance /= queryResult.rowCount;
			returnObj.averageDistance = averageDistance;
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
 * Using filters and getting the average distance of journeys are incompatible - return bad request if they are used together
 * @param avg Average query parameter
 * @param req Request
 * @param res Response
 * @returns True if filters & avg are used together
 */
function checkIncompatibleJourneysDirectionParameters(
	req: Request,
	avg?: string
) {
	const { column, order, offset, limit } = req.query;
	return avg && column && (order || offset || limit);
}

export default router;
