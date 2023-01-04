import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Stations");
});

export default router;
