import { Client } from "pg";

/**
 * Database object
 */
export default class Database {
	private client: Client;

	constructor() {
		this.client = new Client({
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
		});
	}

	connect(onConnection: (error: Error | null, db: Database) => void) {
		this.client.connect(async (error: Error) => {
			onConnection(error, this);
		});
	}

	/**
	 * Create tables if they do not exist
	 * @returns True if didn't exist and was created
	 */
	async createTables() {
		const query = await this.query(`SELECT EXISTS (
            SELECT FROM
                pg_tables
            WHERE
                schemaname = 'public' AND
                tablename  = '${process.env.APP_JOURNEYS_TABLE}'
            )`);
		if (!(query.rows[0] as any).exists) {
			await this.query(
				process.env.APP_JOURNEYS_TABLE_CREATE_QUERY as string
			);
			return true;
		}
		return false;
	}

	async query(query: string) {
		return this.client.query(query);
	}

	async queryValues(query: string, values: string[]) {
		return this.client.query({
			text: query,
			values: values,
		});
	}
}
