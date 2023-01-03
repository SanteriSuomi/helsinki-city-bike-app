import express from "express";
import env from "dotenv";
import Database from "./db/db";
import initializeData from "./data/retrieve";
import { DATA_VALIDATION_RULES } from "./constants";

env.config();

Database.instantiate(async (db: Database) => {
	try {
		const created = await db.initializeTables();
		if (created) {
			console.log("Initializing data...");
			await initializeData(
				process.env.APP_DATA_URLS,
				DATA_VALIDATION_RULES,
				async (rowData: string[]) => {
					await db.queryValues(
						`INSERT INTO ${process.env.APP_JOURNEYS_TABLE} VALUES($1, $2, $3, $4, $5, $6)`,
						[
							rowData[0],
							rowData[1],
							rowData[2],
							rowData[4],
							rowData[6],
							rowData[7],
						]
					);
					if (!(await db.entryExists("id", rowData[2]))) {
						await db.queryValues(
							`INSERT INTO ${process.env.APP_STATIONS_TABLE} VALUES($1, $2)`,
							[rowData[2], rowData[3]]
						);
					}
					if (!(await db.entryExists("id", rowData[4]))) {
						await db.queryValues(
							`INSERT INTO ${process.env.APP_STATIONS_TABLE} VALUES($1, $2)`,
							[rowData[4], rowData[5]]
						);
					}
				}
			);
		}
	} catch (retrieveError) {
		return console.error(retrieveError);
	}

	const app = express();

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.listen(process.env.APP_PORT, () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
});
