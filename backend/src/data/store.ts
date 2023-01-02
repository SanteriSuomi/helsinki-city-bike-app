import { Client } from "pg";

export default async function store(client: Client, row: string) {
	await client.query(`${process.env.APP_JOURNEYS_TABLE_INSERT_QUERY}${row})`);
}
