import { Client } from "pg";

export class Database {
	private client: Client;

	constructor() {
		this.client = new Client({
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
		});
	}

	connect(onConnection: (error: Error | null, client: Client) => void) {
		this.client.connect((error: Error) => {
			onConnection(error, this.client);
		});
	}
}
