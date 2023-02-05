import express from "express";
import env from "dotenv";
import Database from "./db/database";
import journeyRouter from "./routes/endpoints/journey_endpoints";
import stationsRouter from "./routes/endpoints/station_endpoints";
import bodyParser from "body-parser";
import cors from "cors";

env.config();

Database.instantiate(startApp);

function startApp() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors({ origin: process.env.APP_CORS_DOMAIN }));
    app.use("/journeys", journeyRouter);
    app.use("/stations", stationsRouter);
    app.listen(process.env.APP_PORT, () => {
        console.log(
            `Listening to incoming connections on port ${process.env.APP_PORT}`
        );
    });
}
