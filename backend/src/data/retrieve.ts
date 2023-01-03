import Papa from "papaparse";
import { ValidationRule } from "../types/types";
import validate from "./validate";

/**
 * Retrieve CSV data from a list of urls and validate them
 * @param urls String of urls where each url is split by a space ' '
 * @param rules List of validation rules where each of the rules is applied to every row of the data
 * @param storeData Custom function applied to every row of validated data, e.g for storing data in the database
 * @throws {Error} Misc. errors
 */
export default async function initializeData(
	urls: string | undefined,
	rules: ValidationRule[],
	storeData: (rowData: string[]) => Promise<void>
) {
	if (!urls) throw new Error("Urls undefined");

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
						await storeData(rowData);
					}
					parser.resume();
				},
			});
		})
	);
}

/**
 * Fetch csv data from url
 * @param url String
 * @returns data as string
 */
async function fetchData(url: string) {
	const response = await fetch(url, {
		method: "GET",
		headers: { "content-type": "text/csv" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	}
	const data = await response.text();
	if (!data || data.length === 0) {
		throw new Error("Response data undefined");
	}
	return data;
}
