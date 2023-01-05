import express from "express";
import Database from "../db/db";
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
 * Endpoint for getting journeys from or to station
 */
router.get("/journeys/:direction", async (req, res) => {
	let queryString;
	try {
		const { direction } = req.params;
		const { id, mode } = req.query;
		if (direction === "start") {
			queryString = `SELECT * FROM ${
				process.env.APP_JOURNEYS_TABLE
			} WHERE departure_station_id = ${id} ${buildQueryParameters(req)}`;
		} else if (direction === "end") {
			queryString = `SELECT * FROM ${
				process.env.APP_JOURNEYS_TABLE
			} WHERE return_station_id = ${id} ${buildQueryParameters(req)}`;
		}
		if (!queryString) {
			throw new Error("Parameter Direction Required: 'start' or 'end'");
		}
		const queryResult = await Database.instance.query(queryString);
		if (mode === "all") {
			return response.successData(res, {
				totalCount: queryResult.rowCount,
				items: queryResult.rows,
			});
		}
		return response.successData(res, {
			totalCount: queryResult.rowCount,
		});
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
});

export default router;
