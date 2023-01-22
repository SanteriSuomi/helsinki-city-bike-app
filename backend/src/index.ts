import express from "express";
import env from "dotenv";
import Database from "./db/database";
import initializeData from "./data/retrieve";
import {
	APP_DATA_JOURNEYS_VALIDATION_RULES,
	APP_DATA_STATIONS_VALIDATION_RULES,
	APP_JOURNEYS_TABLE,
	APP_JOURNEYS_TABLE_INDEX_QUERY,
	APP_STATIONS_TABLE,
	APP_STATIONS_TABLE_INDEX_QUERY,
} from "./config/constants";
import journeyRouter from "./routes/endpoints/journey_endpoints";
import stationsRouter from "./routes/endpoints/station_endpoints";
import bodyParser from "body-parser";
import cors from "cors";

env.config();

Database.instantiate(startApp);

async function startApp(db: Database) {
	await setupDatabase(db);

	const app = express();
	app.use(bodyParser.json());
	app.use(cors({ origin: process.env.APP_CORS_DOMAIN }));
	app.use("/journeys", journeyRouter);
	app.use("/stations", stationsRouter);
	app.listen(process.env.APP_PORT, () => {
		console.log(
			`Listening to incoming connections on port ${process.env.APP_PORT}`
		);
	});
}

async function setupDatabase(db: Database) {
	try {
		const created = await db.initializeTables();
		if (created) {
			console.log(
				"Initializing journeys data (this might take up to 30 minutes)..."
			);
			await initializeData(
				process.env.APP_DATA_JOURNEYS_URLS,
				APP_DATA_JOURNEYS_VALIDATION_RULES,
				async (rowData: string[]) => {
					await db.querySafe(
						`INSERT INTO ${APP_JOURNEYS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
						[
							rowData[0],
							rowData[1],
							rowData[2],
							rowData[3],
							rowData[4],
							rowData[5],
							rowData[6],
							rowData[7],
						]
					);
				}
			);
			console.log("Creating journeys column indices...");
			await db.query(APP_JOURNEYS_TABLE_INDEX_QUERY);

			console.log("Initializing stations data...");
			await initializeData(
				process.env.APP_DATA_STATIONS_URLS,
				APP_DATA_STATIONS_VALIDATION_RULES,
				async (rowData: string[]) => {
					await db.querySafe(
						`INSERT INTO ${APP_STATIONS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
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
			console.log("Creating stations column indices...");
			await db.query(APP_STATIONS_TABLE_INDEX_QUERY);
		}
	} catch (retrieveError) {
		return console.error(retrieveError);
	}
}
