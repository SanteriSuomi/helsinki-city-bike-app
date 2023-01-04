import { Request } from "express";

/**
 * Build SQL query parameter string from query parameters supplied to the HTTP request
 * @param req HTTP request
 * @returns Parameters in string format ready for SQL
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

function buildRouteParametersColumn(req: Request) {
	const { column, query } = req.params;
	return ` WHERE ${column} = ${query} `;
}

function buildRouteParametersSearch(req: Request) {
	const { query } = req.params;
	if (Number.isNaN(query)) {
		return `WHERE departure_station_id = ${query}
        OR return_station_id = ${query}
        OR covered_distance = ${query}
        OR duration = ${query}`;
	}
	return `WHERE departure_date ILIKE '%${query}%'
    OR return_date ILIKE '%${query}%'`;
}

export {
	buildQueryParameters,
	buildRouteParametersColumn,
	buildRouteParametersSearch,
};
