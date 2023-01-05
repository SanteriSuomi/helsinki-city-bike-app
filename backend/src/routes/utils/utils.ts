import { Request } from "express";

/**
 * Build an SQL query parameter string from query parameters supplied to the HTTP request
 * @param req Request
 * @returns Parameters in string format ready for SQL queries
 */
function buildQueryParameters(req: Request) {
	const { column, order, offset, limit } = req.query;
	let params = "";
	if (column && (order || offset || limit)) {
		params += `ORDER BY ${column} `;
		if (order) {
			params += order;
		}
		if (offset) {
			params += ` OFFSET ${offset} `;
		}
		if (limit) {
			params += `LIMIT ${limit}`;
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
	return ` WHERE ${column} = ${query} `;
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
	if (Number.isNaN(query)) {
		return buildRouteParametersNumber(req, query, numberColumns);
	}
	return buildRouteParametersString(req, query, stringColumns);
}

function buildRouteParametersNumber(
	req: Request,
	query: string,
	columns: string[]
) {
	let queryString = `WHERE ${buildMonthFilter(req, false, true)} ${
		columns[0]
	} = ${query}`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ${columns[i]} = ${query}`;
	}
	return queryString;
}

function buildRouteParametersString(
	req: Request,
	query: string,
	columns: string[]
) {
	let queryString = `WHERE ${buildMonthFilter(req, false, true)} ${
		columns[0]
	} ILIKE '%${query}%'`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ${columns[0]} ILIKE '%${query}%'`;
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
		queryString = `${
			addWhere ? "WHERE " : ""
		}EXTRACT(${dateType} FROM ${dateColumn}) = ${dateNumber} ${
			addAnd ? "AND " : ""
		}`;
	}
	return queryString;
}

export {
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
	buildDateFilter,
};
