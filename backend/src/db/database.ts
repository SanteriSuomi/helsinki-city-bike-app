import { Pool } from "pg";
import {
	APP_JOURNEYS_TABLE,
	APP_JOURNEYS_TABLE_CREATE_QUERY,
	APP_STATIONS_TABLE,
	APP_STATIONS_TABLE_CREATE_QUERY,
} from "../config/constants";

/**
 * Database class where all database manipulation methods are stored
 */
export default class Database {
	private pool: Pool;
	static instance: Database;

	constructor() {
		const connectionString = process.env.DB_CONNECTION_STRING;
		if (connectionString) {
			this.pool = new Pool({
				connectionString: connectionString,
				min: 5,
				max: 50,
				ssl: {
					rejectUnauthorized: false,
				},
			});
		} else {
			this.pool = new Pool({
				host: process.env.DB_HOST,
				port: Number(process.env.DB_PORT),
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				min: 5,
				max: 50,
			});
		}
	}

	static instantiate(onConnection: (db: Database) => void) {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		onConnection(Database.instance);
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

	async query(query: string) {
		return await this.pool.query(query);
	}

	async querySafe(query: string, values?: string[]) {
		return await this.pool.query({
			text: query,
			values: values,
		});
	}
}
