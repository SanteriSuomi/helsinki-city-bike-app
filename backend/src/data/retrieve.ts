import Papa from "papaparse";
import { ValidationRule } from "../types/validation";
import validate from "./validate";

/**
 * Retrieve CSV data from a list of urls, validate them, and call a function for additional processing
 * @param urls String of urls where each url is split by a whitespace ' '
 * @param rules List of validation rules where each of the rules is applied to every row of the data
 * @param process Custom function applied to every row of validated data, e.g for storing data in the database
 */
export default async function initializeData(
	urls: string | undefined,
	rules: ValidationRule[],
	process: (rowData: string[]) => Promise<void>
) {
	if (!urls) throw new Error("initializeData - Urls undefined");

	const splitUrls = urls.split(" ");
	await Promise.all(
		splitUrls.map(async (url: string) => {
			const data = await fetchData(url);
			let firstLineParsed = false;
			Papa.parse(data, {
				skipEmptyLines: "greedy",
				step: async (row, parser) => {
					if (!firstLineParsed) {
						firstLineParsed = true;
						return;
					}
					parser.pause();
					const rowData = row.data as string[];
					if (validate(rowData, rules)) {
						await process(rowData);
					}
					parser.resume();
				},
			});
		})
	);
}

async function fetchData(url: string) {
	const response = await fetch(url, {
		method: "GET",
		headers: { "content-type": "text/csv" },
	});
	if (!response.ok) {
		throw new Error(
			`fetchData error: ${response.status} ${response.statusText}`
		);
	}
	const data = await response.text();
	if (!data || data.length === 0) {
		throw new Error("Response data undefined");
	}
	return data;
}
