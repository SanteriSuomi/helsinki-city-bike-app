import express from "express";
import env from "dotenv";
import Database from "./db/db";
import initializeData from "./data/retrieve";
import {
	APP_DATA_JOURNEYS_VALIDATION_RULES,
	APP_DATA_STATIONS_VALIDATION_RULES,
} from "./constants";

env.config();

Database.instantiate(startApp);

async function startApp(db: Database) {
	await setupDatabaseData(db);

	const app = express();

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.listen(process.env.APP_PORT, () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
}

async function setupDatabaseData(db: Database) {
	try {
		const created = await db.initializeTables();
		if (created) {
			console.log("Initializing journeys data...");
			await initializeData(
				process.env.APP_DATA_JOURNEYS_URLS,
				APP_DATA_JOURNEYS_VALIDATION_RULES,
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
				}
			);

			console.log("Initializing stations data...");
			await initializeData(
				process.env.APP_DATA_STATIONS_URLS,
				APP_DATA_STATIONS_VALIDATION_RULES,
				async (rowData: string[]) => {
					await db.queryValues(
						`INSERT INTO ${process.env.APP_STATIONS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
						[
							rowData[1],
							rowData[2],
							rowData[5],
							rowData[7],
							rowData[9],
							rowData[10],
							rowData[11],
							rowData[12],
						]
					);
				}
			);
		}
	} catch (retrieveError) {
		return console.error(retrieveError);
	}
}
