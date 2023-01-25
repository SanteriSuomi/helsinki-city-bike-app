import { Pool } from "pg";

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
		const newDB = new Database();
		if (!Database.instance) {
			Database.instance = newDB;
		}
		onConnection(newDB);
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
