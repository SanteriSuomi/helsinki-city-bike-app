import Papa from "papaparse";
import { ValidationRule } from "../types/validation";
import validate from "./validate";

/**
 * Retrieve CSV data from a list of urls, validate them, and call a function for additional processing
 * @param urls String of urls where each url is split by a whitespace ' '
 * @param rules List of validation rules where each of the rules is applied to every row of the data
 * @param onValidate Custom function applied to every row of validated data, e.g for storing data in the database
 */
export default async function initializeData(
	urls: string | undefined,
	rules: ValidationRule[],
	onValidate: (rowData: string[]) => Promise<void>
) {
	if (!urls) throw new Error("initializeData - Urls undefined");

	const splitUrls = urls.split(" ");
	for (const url of splitUrls) {
		const data = await fetchData(url);
		await parseCSV(data, rules, onValidate);
	}
	// await Promise.all(
	// 	splitUrls.map(async (url: string) => {
	// 		const data = await fetchData(url);
	// 		await parseCSV(data, rules, onValidate);
	// 	})
	// );
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

async function parseCSV(
	data: string,
	rules: ValidationRule[],
	onValidate: (rowData: string[]) => Promise<void>
) {
	return new Promise((resolve, reject) => {
		Papa.parse(data, {
			skipEmptyLines: "greedy",
			header: true,
			step: async (row, parser) => {
				parser.pause();
				const rowData = Object.values<string>(row.data as any);
				if (validate(rowData, rules)) {
					await onValidate(rowData);
				}
				parser.resume();
			},
			complete: resolve,
			error: reject,
		});
	});
}
