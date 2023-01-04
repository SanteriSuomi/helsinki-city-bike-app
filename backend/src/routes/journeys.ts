import express from "express";
import Database from "../db/db";
import response from "./http/response";
import {
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
} from "./utils/utils";

const router = express.Router();

/**
 * Get all with optional query filters
 */
router.get("/", async (req, res) => {
	try {
		const query = await Database.instance.query(
			`SELECT * FROM ${
				process.env.APP_JOURNEYS_TABLE
			} ${buildQueryParameters(req)}`
		);
		if (query.rowCount > 0) {
			return response.successData(res, query.rows);
		}
	} catch (error) {
		return response.internalError(res, error);
	}
	response.successEmpty(res);
});

/**
 * Return all journeys where given column has a matching query
 */
router.get("/:column-:query", async (req, res) => {
	try {
		const query = await Database.instance.query(
			`SELECT * FROM ${process.env.APP_JOURNEYS_TABLE}
			${buildRouteParametersColumn(req)}
			${buildQueryParameters(req)}`
		);
		if (query.rowCount > 0) {
			return response.successData(res, query.rows);
		}
	} catch (error) {
		return response.internalError(res, error);
	}
	response.successEmpty(res);
});

/**
 * Return all journeys with matching substring or number in any of the columns (free search)
 */
router.get("/search/:query", async (req, res) => {
	try {
		console.log(
			`SELECT * FROM ${process.env.APP_JOURNEYS_TABLE}
			${buildRouteParametersSearch(req)}
			${buildQueryParameters(req)}`
		);
		const query = await Database.instance.query(
			`SELECT * FROM ${process.env.APP_JOURNEYS_TABLE}
			${buildRouteParametersSearch(req)}
			${buildQueryParameters(req)}`
		);
		if (query.rowCount > 0) {
			return response.successData(res, query.rows);
		}
	} catch (error) {
		return response.internalError(res, error);
	}
	response.successEmpty(res);
});

export default router;
