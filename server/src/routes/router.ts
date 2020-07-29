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

router.get(
  "/update_active_players",
  require("./updateActivePlayers").default(pool)
);
router.get("/add_seasons", require("./addSeasons").default(pool));
router.get("/add_season_games", require("./addSeasonGames").default(pool));
router.get(
  "/add_goalie_stats_per_season",
  require("./addGoalieStatsPerSeason").default(pool)
);
router.get(
  "/add_player_stats_per_season",
  require("./addPlayerStatsPerSeason").default(pool)
);
router.get(
  "/add_team_stats_per_season",
  require("./addTeamStatsPerSeason").default(pool)
);
router.get(
  "/update_results_per_game",
  require("./updateResultsPerGame").default(pool)
);

export default router;
