import {
	APP_DATA_JOURNEYS_VALIDATION_RULES,
	APP_DATA_STATIONS_VALIDATION_RULES,
	APP_JOURNEYS_TABLE,
	APP_JOURNEYS_TABLE_INDEX_QUERY,
	APP_STATIONS_TABLE,
	APP_STATIONS_TABLE_INDEX_QUERY,
} from "../config/constants";
import format from "pg-format";
import Database from "../db/database";
import initializeData from "./retrieve";
import env from "dotenv";

/**
 * Independent script that initialize the database (creates tables, validates data and uploads it, etc)
 * Execute with ts-node in the same folder as script e.g ts-node upload-script.ts
 * Also requires a .env file in the same directory with the following entries:
 * DB_CONNECTION_STRING=Postgres connection string
 * APP_DATA_JOURNEYS_URLS=Journey Data URLs (URL to the CSV file(s), delimited by comma)
 * APP_DATA_STATIONS_URLS=Station Data URLs (URL to the CSV file(s), delimited by comma)
 */

env.config();

Database.instantiate(setupDatabase);

const MIN_ROWCOUNT_JOURNEYS = 10_000;
const MIN_ROWCOUNT_STATIONS = 100;

async function setupDatabase(db: Database) {
	let rowCount = 0;
	let rows: string[][] = [];
	try {
		const created = await db.initializeTables();
		if (created) {
			// console.log(
			// 	"Initializing journeys data (this might take a while)..."
			// );
			// await initializeData(
			// 	process.env.APP_DATA_JOURNEYS_URLS,
			// 	APP_DATA_JOURNEYS_VALIDATION_RULES,
			// 	async (rowData: string[]) => {
			// 		rowCount += 1;
			// 		rows.push([
			// 			rowData[0],
			// 			rowData[1],
			// 			rowData[2],
			// 			rowData[3],
			// 			rowData[4],
			// 			rowData[5],
			// 			rowData[6],
			// 			rowData[7],
			// 		]);
			// 		if (rowCount > MIN_ROWCOUNT_JOURNEYS) {
			// 			await insert(db, APP_JOURNEYS_TABLE, rows);
			// 			rowCount = 0;
			// 			rows = [];
			// 		}
			// 	}
			// );
			// await insert(db, APP_JOURNEYS_TABLE, rows);
			// rowCount = 0;
			// rows = [];

			// console.log("Creating journeys index...");
			// await db.query(APP_JOURNEYS_TABLE_INDEX_QUERY);

			console.log("Initializing stations data...");
			await initializeData(
				process.env.APP_DATA_STATIONS_URLS,
				APP_DATA_STATIONS_VALIDATION_RULES,
				async (rowData: string[]) => {
					rowCount += 1;
					rows.push([
						rowData[1],
						rowData[2],
						rowData[5],
						rowData[7],
						rowData[9],
						rowData[10],
						rowData[11],
						rowData[12],
					]);
					if (rowCount > MIN_ROWCOUNT_STATIONS) {
						await insert(db, APP_STATIONS_TABLE, rows);
						rowCount = 0;
						rows = [];
					}
				}
			);
			await insert(db, APP_JOURNEYS_TABLE, rows);

			console.log("Creating stations index...");
			await db.query(APP_STATIONS_TABLE_INDEX_QUERY);
		}
	} catch (retrieveError) {
		return console.error(retrieveError);
	}
}

async function insert(db: Database, table: string, rows: string[][]) {
	await db.query(format(`INSERT INTO ${table} VALUES %L`, rows));
}
