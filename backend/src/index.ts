import express from "express";
import env from "dotenv";
import { Database } from "./db/db";
import { Client } from "pg";
import { retrieveData } from "./data/retrieve";

env.config();

new Database().connect((dbError: Error | null, client: Client) => {
	if (dbError) {
		return console.error(dbError);
	}

	retrieveData((dataError?: string | void[]) => {
		if (dataError) {
			return console.error(dataError);
		}

		const app = express();

		app.get("/", (req, res) => {
			res.send("Hello World!");
		});

		app.listen(process.env.APP_PORT, () => {
			console.log(`App listening on port ${process.env.APP_PORT}`);
		});
	});
});
