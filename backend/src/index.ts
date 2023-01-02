import express from "express";
import env from "dotenv";
import Database from "./db/db";
import retrieve from "./data/retrieve";
import { JOURNEYS_VALIDATION_RULES } from "./constants";

env.config();

new Database(async (db: Database) => {
	try {
		const created = await db.createTables();
		if (created) {
			await retrieve(
				db,
				process.env.APP_JOURNEYS_DATA,
				JOURNEYS_VALIDATION_RULES,
				`INSERT INTO ${process.env.APP_JOURNEYS_TABLE} VALUES($1, $2, $3, $4, $5, $6, $7, $8)`
			);
		}
	} catch (retrieveError) {
		return console.error(retrieveError);
	}

	const app = express();

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.listen(process.env.APP_PORT, () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
});
