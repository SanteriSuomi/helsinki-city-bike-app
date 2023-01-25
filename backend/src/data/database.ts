import Database from "../db/database";
import {
	APP_JOURNEYS_TABLE,
	APP_STATIONS_TABLE,
	APP_JOURNEYS_TABLE_CREATE_QUERY,
	APP_STATIONS_TABLE_CREATE_QUERY,
} from "./constants";

export class DataDatabase extends Database {
	static connect(onConnection: (db: DataDatabase) => void) {
		onConnection(new DataDatabase());
	}

	/**
	 * Create tables if they do not exist
	 * @returns True if didn't exist and was created
	 */
	async initializeTables() {
		let created = false;
		if (!(await this.tableExists(APP_JOURNEYS_TABLE))) {
			await this.query(APP_JOURNEYS_TABLE_CREATE_QUERY);
			created = true;
			console.log("Table journeys created");
		}
		if (!(await this.tableExists(APP_STATIONS_TABLE))) {
			await this.query(APP_STATIONS_TABLE_CREATE_QUERY);
			created = true;
			console.log("Table stations created");
		}
		return created;
	}

	async tableExists(name: string) {
		const query = await this.query(`SELECT EXISTS (
            SELECT FROM
                pg_tables
            WHERE
                schemaname = 'public' AND
                tablename  = '${name}'
            )`);
		return query.rows[0].exists;
	}

	async entryExists(column: string, value: string) {
		const query = await this.querySafe(
			`SELECT * FROM ${APP_STATIONS_TABLE} WHERE ${column} = $1`,
			[value]
		);
		return query.rowCount > 0;
	}
}
