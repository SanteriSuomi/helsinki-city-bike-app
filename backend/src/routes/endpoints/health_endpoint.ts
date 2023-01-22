import express from "express";
import { sendSuccessEmpty } from "../utils/responses";

const router = express.Router();

router.get("/", async (_req, res) => {
	return sendSuccessEmpty(res);
});

export default router;
