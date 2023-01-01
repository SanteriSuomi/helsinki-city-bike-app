import express from "express";
import env from "dotenv";
import { Database } from "./db/db";
import { Client } from "pg";

env.config();

new Database().connect((error: Error | null, client: Client) => {
	if (error) {
		return console.error(error);
	}

	const app = express();

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.listen(process.env.APP_PORT, () => {
		console.log(`App listening on port ${process.env.APP_PORT}`);
	});
});
