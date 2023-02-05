import express from "express";
import {
    APP_JOURNEYS_TABLE,
    APP_STATIONS_TABLE,
    APP_STATIONS_TABLE_NUMBER_COLUMNS,
    APP_STATIONS_TABLE_STRING_COLUMNS,
    STATIONS_ENDPOINT_DIRECTION_START,
} from "../../config/constants";
import { Station } from "../../types/database";
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
    sendSuccessEmpty,
} from "../utils/responses";
import Database from "../../db/database";

const router = express.Router();

router.get("/", async (req, res) => {
    await getAll(
        req,
        res,
        APP_STATIONS_TABLE,
        APP_STATIONS_TABLE_STRING_COLUMNS.split(" ")[0]
    );
});

router.get("/:column-:query", async (req, res) => {
    await getColumnQuery(req, res, APP_STATIONS_TABLE);
});

router.get("/search/:column-:query", async (req, res) => {
    await getSearch(
        req,
        res,
        APP_STATIONS_TABLE,
        APP_STATIONS_TABLE_STRING_COLUMNS.split(" "),
        APP_STATIONS_TABLE_NUMBER_COLUMNS.split(" ")
    );
});

/**
 * Endpoint for getting the number of journeys starting from or ending to station
 * Optionally can give the average distance of those journeys and the data itself
 */
router.get("/journeys/:start", async (req, res) => {
    const { start } = req.params;
    const { id, avg, all } = req.query;
    let queryString;
    try {
        const isDeparture =
            start === STATIONS_ENDPOINT_DIRECTION_START.FROM_STATION;
        if (isDeparture) {
            queryString = `SELECT *, count(*) OVER() as total_count, AVG(${avg}) OVER() as average_distance FROM ${APP_JOURNEYS_TABLE} WHERE ${buildDateFilter(
                req,
                false,
                true
            )} departure_station_id = ${id} ${buildQueryParameters(req)}`;
        } else {
            queryString = `SELECT *, count(*) OVER() as total_count, AVG(${avg}) OVER() as average_distance FROM ${APP_JOURNEYS_TABLE} WHERE return_station_id = ${id} ${buildQueryParameters(
                req
            )}`;
        }
    } catch (error) {
        return sendBadRequest(res, error);
    }
    try {
        const queryResult = await Database.instance.query(queryString);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let returnObj: any;
        if (queryResult.rowCount > 0) {
            returnObj = {
                totalCount: Number(queryResult.rows[0].total_count),
                averageDistance: Number(queryResult.rows[0].average_distance),
            };
        } else {
            return sendSuccessEmpty(res);
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
        (body: unknown) => {
            return new Station(body as Station);
        },
        `SELECT * FROM ${APP_STATIONS_TABLE}
			WHERE id = $1
	    	AND name = $2
	    	AND address = $3
	    	AND city = $4
	    	AND operator = $5
			AND capacity = $6
	    	AND x = $7
			AND y = $8;`,
        `INSERT INTO ${APP_STATIONS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
    );
});

export default router;
