import Papa from "papaparse";
import { ValidationRule } from "../types/types";
import validate from "./validate";

/**
 * Retrieve CSV data from a list of urls and validate them
 * @param urls String of urls where each url is split by a space ' '
 * @param rules List of rules where each of the rules is applied to every row of the data
 * @throws {Error} Misc. errors
 */
export default async function retrieve(
	urls: string | undefined,
	rules: ValidationRule[]
) {
	if (!urls) throw new Error("Urls are undefined");

	const splitUrls = urls.split(" ");
	await Promise.all(
		splitUrls.map(async (url: string) => {
			const data = await fetchData(url);
			let firstLineParsed = false;
			Papa.parse(data, {
				skipEmptyLines: "greedy",
				step: (row, _parser) => {
					if (!firstLineParsed) {
						return (firstLineParsed = true);
					}
					const validation = validate(row.data as any, rules);
					if (validation.valid) {
						// TODO: store data in postgres database
					}
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
