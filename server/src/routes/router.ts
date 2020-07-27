import express from "express";
import { Pool } from "pg";

const pool: Pool = new Pool({
  user: "tanyatang",
  host: "localhost",
  database: "50_in_07",
  password: "",
  port: 5432,
});

const router = express.Router();
router.get("/", (_, res) => {
  res.send("Access NHL API data.");
  console.log("You are at the root page.");
});

router.get("/update_players", require("./updatePlayers").default(pool));
router.get("/update_seasons", require("./updateSeasons").default(pool));

export default router;
