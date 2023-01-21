import { Request } from "express";
import sanitize from "sqlstring";
import { QUERY_NUMBER_EQUALITY_TOLERANCE } from "../../config/constants";

/**
 * Builds the query parameters for a SQL SELECT statement based on the given request query parameters
 * @param req The request object containing the query parameters: column, order, offset, and limit
 * @returns The built query parameters as a string
 */
function buildQueryParameters(req: Request) {
	const { column, order, offset, limit } = req.query;
	let params = "";
	if (column && (order || offset || limit)) {
		params += `ORDER BY ${sanitizeString(column)} `;
		if (order) {
			params += order;
		}
		if (limit) {
			params += ` LIMIT ${sanitizeNumber(limit)}`;
		}
		if (offset) {
			params += ` OFFSET ${sanitizeNumber(offset)} `;
		}
	}
	return params;
}

/**
 * Builds the WHERE clause of a SELECT statement based on the request parameters
 * @param req Request object containing the query parameters
 * @returns WHERE clause as a string, including the WHERE keyword
 */
function buildRouteParametersColumn(req: Request) {
	const { column, query } = req.params;
	return ` WHERE ${sanitizeString(column)} = ${sanitizeString(query)} `;
}

/**
 * Builds a search query for a given request and columns, depending on whether the search term is a string or a number
 * @param req Request object
 * @param stringColumns Array of column names for which the search term should be treated as a string
 * @param numberColumns Array of column names for which the search term should be treated as a number
 * @returns Search query parameters in SQL format
 */
function buildRouteParametersSearch(
	req: Request,
	stringColumns: string[],
	numberColumns: string[]
) {
	const { query } = req.params;
	if (Number.isNaN(Number(query))) {
		return buildRouteParametersString(req, query, stringColumns);
	}
	return buildRouteParametersNumber(req, query, numberColumns);
}

/**
 * Builds a WHERE clause for a SQL query that searches for a number in the specified columns
 * @param req Request object
 * @param query Search string
 * @param columns Columns to search in
 * @returns WHERE clause in SQL format
 */
function buildRouteParametersNumber(
	req: Request,
	query: string,
	columns: string[]
) {
	let queryString = `WHERE ${sanitizeString(
		buildDateFilter(req, false, true)
	)} ${columns[0]} = ${sanitizeString(query)}`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ABS(${sanitizeString(
			columns[i]
		)} - ${sanitizeString(query)}) <= ${QUERY_NUMBER_EQUALITY_TOLERANCE}`;
	}
	return queryString;
}

/**
 * Builds a WHERE clause for a SQL query that searches for a string in the specified columns
 * @param req Request object
 * @param query Search string
 * @param columns Columns to search in
 * @returns WHERE clause in SQL format
 */
function buildRouteParametersString(
	req: Request,
	query: string,
	columns: string[]
) {
	let queryString = `WHERE ${sanitizeString(
		buildDateFilter(req, false, true)
	)} ${sanitizeString(columns[0])} ILIKE '%${sanitizeString(query)}%'`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ${sanitizeString(
			columns[i]
		)} ILIKE '%${sanitizeString(query)}%'`;
	}
	return queryString;
}

/**
 * Builds a date filter for a SQL query
 * @param req Request object
 * @param addWhere Whether or not to add the "WHERE" keyword to the beginning of the returned string
 * @param addAnd Whether or not to add the "AND" keyword to the end of the returned string
 * @returns A string in the format "WHERE/AND EXTRACT(dateType FROM dateColumn) = dateNumber AND/"
 */
function buildDateFilter(req: Request, addWhere: boolean, addAnd: boolean) {
	const { dateType, dateColumn, dateNumber } = req.query;
	let queryString = "";
	if (dateType && dateColumn && dateNumber) {
		queryString = `${addWhere ? "WHERE " : ""}EXTRACT(${sanitizeString(
			dateType
		)} FROM ${sanitizeString(dateColumn)}) = ${sanitizeNumber(
			dateNumber
		)} ${addAnd ? "AND " : ""}`;
	}
	return queryString;
}

function sanitizeString(val: any) {
	return sanitize.escape(val).replace(/'/g, "");
}

function sanitizeNumber(val: any) {
	return sanitize.escape(Number(val));
}

export {
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
	buildDateFilter,
};
