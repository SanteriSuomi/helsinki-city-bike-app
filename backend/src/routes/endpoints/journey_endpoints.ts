import express from "express";
import { STATIONS_ENDPOINT_DIRECTION_START } from "../../config/constants";
import {
	getAll,
	getColumnQuery,
	getSearch,
	postInsert,
} from "../base_endpoints";
import {
	sendBadRequest,
	sendInternalError,
	sendSuccessData,
} from "../utils/responses";
import { buildDateFilter } from "../utils/query_builders";
import { Journey } from "../../types/database";
import Database from "../../db/database";

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
 * Endpoint for getting the most popular return stations for a journey starting at some station and vice versa
 */
router.get("/stations/:start", async (req, res) => {
	let queryString;
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
		queryString = `SELECT ${queryEndString} as station_id, COUNT(*) as num_journeys
			FROM ${process.env.APP_JOURNEYS_TABLE}
			WHERE ${buildDateFilter(req, false, true)} ${queryStartString} = ${id}
			GROUP BY ${queryEndString}
			ORDER BY num_journeys DESC
			LIMIT ${top}`;
	} catch (error) {
		return sendBadRequest(res, error);
	}
	try {
		const topQueryResult = await Database.instance.query(queryString);
		return sendSuccessData(res, {
			topStations: topQueryResult.rows,
		});
	} catch (error) {
		return sendInternalError(res, error);
	}
});

router.post("/", async (req, res) => {
	await postInsert(
		req,
		res,
		(body: any) => {
			return new Journey(body);
		},
		`SELECT * FROM ${process.env.APP_JOURNEYS_TABLE}
			WHERE departure_date = $1
	    	AND return_date = $2
	    	AND departure_station_id = $3
			AND departure_station_name = $4
	    	AND return_station_id = $5
			AND return_station_name = $6
	    	AND covered_distance = $7
	    	AND duration = $8;`,
		`INSERT INTO ${process.env.APP_JOURNEYS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
	);
});

export default router;
