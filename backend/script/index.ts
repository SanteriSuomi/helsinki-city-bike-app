import {
    APP_DATA_JOURNEYS_VALIDATION_RULES,
    APP_DATA_STATIONS_VALIDATION_RULES,
    APP_JOURNEYS_TABLE_INDEX_QUERY,
    APP_STATIONS_TABLE_INDEX_QUERY,
    APP_JOURNEYS_TABLE, APP_STATIONS_TABLE,
    MIN_ROWCOUNT_JOURNEYS,
    MIN_ROWCOUNT_STATIONS
} from "./constants";
import { Database } from "./database";
import format from "pg-format";
import initializeData from "./retrieve";

Database.connect(setupDatabase);

const rows: string[][] = [];

async function setupDatabase(db: Database) {
    try {
        const created = await db.initializeTables();
        if (created) {
            console.log(
                "Initializing journeys data (this might take a while)..."
            );
            const APP_DATA_JOURNEYS_URLS = process.argv[3];
            const APP_DATA_STATIONS_URLS = process.argv[4];
            await initializeData(
                APP_DATA_JOURNEYS_URLS,
                APP_DATA_JOURNEYS_VALIDATION_RULES,
                async (rowData: string[]) => {
                    rows.push([
                        rowData[0],
                        rowData[1],
                        rowData[2],
                        rowData[3],
                        rowData[4],
                        rowData[5],
                        rowData[6],
                        rowData[7],
                    ]);
                    if (rows.length >= MIN_ROWCOUNT_JOURNEYS) {
                        await insert(db, APP_JOURNEYS_TABLE, rows);
                        rows.length = 0;
                    }
                }
            );
            await insert(db, APP_JOURNEYS_TABLE, rows);
            rows.length = 0;

            console.log("Initializing stations data...");
            await initializeData(
                APP_DATA_STATIONS_URLS,
                APP_DATA_STATIONS_VALIDATION_RULES,
                async (rowData: string[]) => {
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
                    if (rows.length >= MIN_ROWCOUNT_STATIONS) {
                        await insert(db, APP_STATIONS_TABLE, rows);
                        rows.length = 0;
                    }
                }
            );
            await insert(db, APP_STATIONS_TABLE, rows);

            console.log("Creating journeys index...");
            await db.query(APP_JOURNEYS_TABLE_INDEX_QUERY);

            console.log("Creating stations index...");
            await db.query(APP_STATIONS_TABLE_INDEX_QUERY);
        }
    } catch (retrieveError) {
        return console.error(retrieveError);
    }
}

async function insert(db: Database, table: string, rows: string[][]) {
    return db.query(format(`INSERT INTO ${table} VALUES %L`, rows));
}
