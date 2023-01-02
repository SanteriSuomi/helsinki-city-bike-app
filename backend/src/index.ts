import express from "express";
import env from "dotenv";
import { Database } from "./db/db";
import { Client } from "pg";
import retrieve from "./data/retrieve";
import { HSL_VALIDATION_RULES } from "./constants";

env.config();

new Database().connect(async (dbError: Error | null, client: Client) => {
	if (dbError) {
		return console.error(dbError);
	}

	try {
		await retrieve(process.env.APP_HSL_DATA, HSL_VALIDATION_RULES);
	} catch (appError) {
		return console.error(appError);
	}

	const app = express();

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.listen(process.env.APP_PORT, () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
});
