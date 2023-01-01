import express from "express";
import env from "dotenv";
import { Database } from "./db/db";
import { Client } from "pg";
import Papa from "papaparse";
import validate from "./validate";

env.config();

new Database().connect((error: Error | null, client: Client) => {
	if (error) {
		return console.error(error);
	}

	if (process.env.APP_DATA_URLS) {
		const urls = process.env.APP_DATA_URLS.split(" ");
		urls.forEach(async (url: string) => {
			const response = await fetch(url, {
				method: "GET",
				headers: { "content-type": "text/csv" },
			});
			if (response.ok) {
				const csv = await response.text();
				Papa.parse(csv, {
					complete: (result) => {
						if (result.errors.length > 0) {
							console.error(result.errors);
						}
						const errorRows = new Set<number>();
						result.errors.forEach((error) => {
							console.error(error);
							errorRows.add(error.row);
						});

						const csv: any = result.data;
						for (let i = 1; i < csv.length; i++) {
							if (!errorRows.has(i)) {
								const validation = validate(csv, i);
								if (validation.valid) {
								}
							}
						}
					},
				});
			}
		});
	}

	const app = express();

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.listen(process.env.APP_PORT, () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
});
