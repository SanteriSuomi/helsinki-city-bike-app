import { Request, Response } from "express";
import Database from "../db/database";
import response from "./utils/response";
import {
	buildDateFilter,
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
} from "./utils/queries";
import { DatabaseBaseObject } from "../types/types";

/**
 * Include generic endpoint query functions such as get all, search
 */

/**
 * Get all with optional query filters
 * @param req Request
 * @param res Response
 * @param table Table to search
 * @param column Column (can be any column) used for getting total row count
 * @returns All rows if any
 */
async function getAll(
	req: Request,
	res: Response,
	table: string,
	column: string
) {
	let queryString;
	let countQueryString;
	try {
		queryString = `SELECT * FROM ${table} ${buildDateFilter(
			req,
			true,
			false
		)} ${buildQueryParameters(req)}`;
		countQueryString = `SELECT COUNT(${column}) FROM ${table}`;
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
	try {
		const queryResult = await Database.instance.query(queryString);
		const countQueryResult = await Database.instance.query(
			countQueryString
		);
		return response.successData(res, {
			totalCount: Number(countQueryResult.rows[0].count),
			items: queryResult.rows,
		});
	} catch (error) {
		return response.internalError(res, (error as any).message);
	}
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
 * Insert a new object into the database
 * @param req Request
 * @param res Response
 * @param getObject Custom function that returns the object from request body
 * @param checkQueryString Query string that checks if the object already exists
 * @param queryString Insert query string
 * @returns All rows inserted in the database if any
 */
async function postInsert<T extends DatabaseBaseObject>(
	req: Request,
	res: Response,
	getObject: (body: any) => T,
	checkQueryString: string,
	queryString: string
) {
	let object: T | undefined;
	try {
		object = getObject(req.body);
		if (!object || object.hasEmptyProperties()) {
			return response.badRequestError(
				res,
				"Body is not valid - must be conform to the T object type"
			);
		}
	} catch (error) {
		return response.badRequestError(res, (error as any).message);
	}
	try {
		const checkQueryResult = await Database.instance.querySafe(
			checkQueryString,
			object.toArray()
		);
		if (checkQueryResult.rowCount > 0) {
			return response.neutralConflict(res);
		}
		const queryResult = await Database.instance.querySafe(
			queryString,
			object.toArray()
		);
		return response.successCreated(res, queryResult.rows);
	} catch (error) {
		return response.internalError(res, (error as any).message);
	}
}

export { getAll, getColumnQuery, getSearch, postInsert };
