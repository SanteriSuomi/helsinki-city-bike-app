import { Request } from "express";
import sanitize from "sqlstring";

/**
 * Build an SQL query parameter string from query parameters supplied to the HTTP request
 * @param req Request
 * @returns Parameters in string format ready for SQL queries
 */
function buildQueryParameters(req: Request) {
	const { column, order, offset, limit } = req.query;
	let params = "";
	if (column && (order || offset || limit)) {
		params += `ORDER BY ${sanitizeString(column)} `;
		if (order) {
			params += order;
		}
		if (offset) {
			params += ` OFFSET ${sanitizeNumber(offset)} `;
		}
		if (limit) {
			params += `LIMIT ${sanitizeNumber(limit)}`;
		}
	}
	return params;
}

/**
 * Build an SQL query parameter string from request parameters. Built in date filter
 * @param req Request
 * @returns Parameters in string format ready for SQL queries
 */
function buildRouteParametersColumn(req: Request) {
	const { column, query } = req.params;
	return ` WHERE ${sanitizeString(column)} = ${sanitizeString(query)} `;
}

/**
 * Build pattern-matching (substring) search SQL query parameter string
 * @param req Request
 * @param columns Columns on which the query string is matched
 * @returns Parameters in SQL format ready for SQL queries
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

function buildRouteParametersNumber(
	req: Request,
	query: string,
	columns: string[]
) {
	let queryString = `WHERE ${sanitizeString(
		buildDateFilter(req, false, true)
	)} ${columns[0]} = ${sanitizeString(query)}`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ${sanitizeString(columns[i])} = ${sanitizeString(
			query
		)}`;
	}
	return queryString;
}

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
			columns[0]
		)} ILIKE '%${sanitizeString(query)}%'`;
	}
	return queryString;
}

/**
 * Injectable date filter
 * @param req Request
 * @param addWhere Add a 'WHERE' to the start
 * @param addAnd Add a a 'AND' to the end
 * @returns Month filter string
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
