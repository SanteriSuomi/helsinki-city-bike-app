import express from "express";
import { STATIONS_ENDPOINT_DIRECTION_START } from "../constants";
import Database from "../db/db";
import { getAll, getColumnQuery, getSearch } from "./base";
import response from "./http/response";

const router = express.Router();

router.get("/", async (req, res) => {
	await getAll(
		req,
		res,
		process.env.APP_JOURNEYS_TABLE!,
		process.env.APP_JOURNEYS_TABLE_STRING_COLUMNS!.split(" ")[0]
	);
});

router.get("/:column-:query", async (req, res) => {
	await getColumnQuery(req, res, process.env.APP_JOURNEYS_TABLE!);
});

router.get("/search/:query", async (req, res) => {
	await getSearch(
		req,
		res,
		process.env.APP_JOURNEYS_TABLE!,
		process.env.APP_JOURNEYS_TABLE_STRING_COLUMNS!.split(" "),
		process.env.APP_JOURNEYS_TABLE_NUMBER_COLUMNS!.split(" ")
	);
});

/**
 * Endpoint for getting the most return stations for a journey starting at some stations and vice versa
 */
router.get("/stations/:start", async (req, res) => {
	try {
		const { start } = req.params;
		const { id, top } = req.query;

		let isDeparture =
			start === STATIONS_ENDPOINT_DIRECTION_START.FROM_STATION;
		const queryStartString = isDeparture
			? "departure_station_id"
			: "return_station_id";
		const queryEndString = isDeparture
			? "return_station_id"
			: "departure_station_id";

		const topQueryResult = await Database.instance
			.query(`SELECT ${queryEndString}, COUNT(*) as num_journeys_from_station
					FROM ${process.env.APP_JOURNEYS_TABLE}
					WHERE ${queryStartString} = ${id}
					GROUP BY ${queryEndString}
					ORDER BY num_journeys_from_station DESC
					LIMIT ${top};
			`);
		return response.successData(res, {
			topStations: topQueryResult.rows,
		});
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
});

export default router;
