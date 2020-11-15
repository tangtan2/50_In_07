import express from "express";
import testConfig from "../config/TestConfig";
import { Pool } from "pg";

const pool: Pool = new Pool({
  user: testConfig.user,
  host: testConfig.host,
  database: testConfig.database,
  password: testConfig.password,
  port: testConfig.dbport,
});

const router = express.Router();
router.get("/", (_, res) => {
  res.send("Access NHL API data.");
  console.log("You are at the root page.");
});

router.get("/teams", require("./getAllTeams").default(pool));
router.get("/seasons", require("./getAllSeasons").default(pool));

export default router;
