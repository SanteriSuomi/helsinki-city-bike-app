import express from "express";
import { getAll, getColumnQuery, getSearch } from "./base";

const router = express.Router();

router.get("/", async (req, res) => {
	await getAll(
		req,
		res,
		process.env.APP_JOURNEYS_TABLE!,
		process.env.APP_JOURNEYS_TABLE_STRING_COLUMNS!.split(" ")[0]
	);
});

router.get("/:column-:query", async (req, res) => {
	await getColumnQuery(req, res, process.env.APP_JOURNEYS_TABLE!);
});

router.get("/search/:query", async (req, res) => {
	await getSearch(
		req,
		res,
		process.env.APP_JOURNEYS_TABLE!,
		process.env.APP_JOURNEYS_TABLE_STRING_COLUMNS!.split(" "),
		process.env.APP_JOURNEYS_TABLE_NUMBER_COLUMNS!.split(" ")
	);
});

export default router;
