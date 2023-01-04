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
 * Build an SQL query parameter string from request parameters
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
		return buildQueryStringNumber(query, numberColumns);
	}
	return buildQueryString(query, stringColumns);
}

function buildQueryStringNumber(query: string, columns: string[]) {
	let queryString = `WHERE ${columns[0]} = ${query}`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ${columns[i]} = ${query}`;
	}
	return queryString;
}

function buildQueryString(query: string, columns: string[]) {
	let queryString = `WHERE ${columns[0]} ILIKE '%${query}%'`;
	for (let i = 1; i < columns.length; i++) {
		queryString += ` OR ${columns[0]} ILIKE '%${query}%'`;
	}
	return queryString;
}

export {
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
};
