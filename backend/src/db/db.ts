import { Pool, PoolClient } from "pg";

/**
 * Database class where all database manipulation methods are stored
 */
export default class Database {
	private pool: Pool;

	constructor(onConnection: (db: Database) => void) {
		this.pool = new Pool({
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			min: 5,
			max: 50,
		});
		onConnection(this);
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

	async connect() {
		return await this.pool.connect();
	}

	async query(query: string) {
		return await this.pool.query(query);
	}

	async queryValues(query: string, values?: string[]) {
		return await this.pool.query({
			text: query,
			values: values,
		});
	}

	async queryValuesClient(
		client: PoolClient,
		query: string,
		values?: string[]
	) {
		return await client.query({
			text: query,
			values: values,
		});
	}
}
