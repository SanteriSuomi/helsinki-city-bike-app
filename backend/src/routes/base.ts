import { Request, Response } from "express";
import Database from "../db/db";
import response from "./http/response";
import {
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
} from "./utils/utils";

/**
 * Get all with optional query filters
 * @param req Request
 * @param res Response
 * @param table Table to search
 * @returns All rows if any
 */
async function getAll(req: Request, res: Response, table: string) {
	let queryString;
	try {
		queryString = `SELECT * FROM ${table} ${buildQueryParameters(req)}`;
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
	try {
		const queryResult = await Database.instance.query(queryString);
		console.log(queryResult.rowCount);

		if (queryResult.rowCount > 0) {
			return response.successData(res, queryResult.rows);
		}
	} catch (error) {
		return response.internalError(res, (error as any).message);
	}
	response.successEmpty(res);
}

/**
 * Return all journeys where given column has a matching query
 * @param req Request
 * @param res Response
 * @param table Table to search
 * @returns All journeys with matching query in column
 */
async function getColumnQuery(req: Request, res: Response, table: string) {
	let queryString;
	try {
		queryString = `SELECT * FROM ${table}
        ${buildRouteParametersColumn(req)}
        ${buildQueryParameters(req)}`;
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
	try {
		const queryResult = await Database.instance.query(queryString);
		if (queryResult.rowCount > 0) {
			return response.successData(res, queryResult.rows);
		}
	} catch (error) {
		return response.internalError(res, (error as any).message);
	}
	response.successEmpty(res);
}

/**
 * Return all journeys with matching substring or number in any of the columns
 * @param req Request
 * @param res Response
 * @param table Table to search
 * @param stringColumns List of all columns which are of type string (these two parameters required to prevent type mismatch errors)
 * @param numberColumns List of all columns which are of type number
 * @returns All rows which match the given query
 */
async function getSearch(
	req: Request,
	res: Response,
	table: string,
	stringColumns: string[],
	numberColumns: string[]
) {
	let queryString;
	try {
		queryString = `SELECT * FROM ${table}
        ${buildRouteParametersSearch(req, stringColumns, numberColumns)}
        ${buildQueryParameters(req)}`;
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
	try {
		const queryResult = await Database.instance.query(queryString);
		if (queryResult.rowCount > 0) {
			return response.successData(res, queryResult.rows);
		}
	} catch (error) {
		return response.internalError(res, (error as any).message);
	}
	response.successEmpty(res);
}

/**
 * Get the number of rows in given table
 * @param res Response
 * @param table Table
 * @param column Column (can be any column)
 * @returns Total row count
 */
async function getCount(res: Response, table: string, column: string) {
	let queryString;
	try {
		queryString = `SELECT COUNT(${column}) FROM ${table}`;
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
	try {
		const queryResult = await Database.instance.query(queryString);
		return response.successData(res, queryResult.rows[0].count);
	} catch (error) {
		return response.internalError(res, (error as any).message);
	}
}

export { getAll, getColumnQuery, getSearch, getCount };
