import Papa from "papaparse";
import validate from "./validate";

function retrieveData(onComplete: (error?: string | void[]) => void) {
	try {
		if (!process.env.APP_DATA_URLS) {
			throw new Error("APP_DATA_URLS environment variable undefined");
		}

		const urls = process.env.APP_DATA_URLS.split(" ");
		Promise.all(
			urls.map(async (url: string) => {
				const response = await fetch(url, {
					method: "GET",
					headers: { "content-type": "text/csv" },
				});
				if (!response.ok) {
					throw new Error(
						`Error: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.text();
				if (!data || data.length === 0) {
					throw new Error("Response data undefined");
				}

				const parseResult = await parseCSV(data);
				validateCSV(parseResult);
			})
		)
			.then(() => {
				onComplete();
			})
			.catch(onComplete);
	} catch (error: any) {
		onComplete(error?.message ? error.message : "Unspecified error thrown");
	}
}

function parseCSV(data: string) {
	return new Promise<Papa.ParseResult<unknown>>((resolve) => {
		Papa.parse(data, {
			complete: (result) => resolve(result),
		});
	});
}

function validateCSV(parseResult: Papa.ParseResult<unknown>) {
	if (parseResult.errors.length > 0) {
		console.log(parseResult.errors);
	}

	const errorRows = new Set<number>();
	parseResult.errors.forEach((error) => {
		errorRows.add(error.row);
	});

	const csv: any = parseResult.data;
	for (let i = 1; i < csv.length; i++) {
		if (!errorRows.has(i)) {
			const validation = validate(csv, i);
			if (validation.valid) {
			}
		}
	}
}

export { retrieveData };
